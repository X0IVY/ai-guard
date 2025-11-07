// Prompt Injection Detector Content Script - Optimized

interface Pattern {
  id: string;
  name: string;
  regex: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

let patterns: Pattern[] = [];
let compiledPatterns: Map<string, RegExp> = new Map();
let activeBanner: HTMLElement | null = null;
let bannerTimeout: number | null = null;
let debounceTimer: number | null = null;

const DEBOUNCE_DELAY = 300; // ms
const BANNER_DURATION = 10000; // ms
const SELECTOR = 'textarea, input[type="text"], [contenteditable="true"]';

// Load and compile patterns from file
async function loadPatterns(): Promise<void> {
  try {
    const response = await fetch(chrome.runtime.getURL('src/patterns.json'));
    patterns = await response.json();
    
    // Pre-compile regex patterns for better performance
    patterns.forEach(pattern => {
      try {
        compiledPatterns.set(pattern.id, new RegExp(pattern.regex, 'gi'));
      } catch (e) {
        console.error(`Failed to compile pattern ${pattern.id}:`, e);
      }
    });
    
    console.log(`Loaded and compiled ${patterns.length} patterns`);
  } catch (error) {
    console.error('Failed to load patterns:', error);
  }
}

// Check text for injection patterns with optimized matching
function detectInjection(text: string): { detected: boolean; matches: Array<{ pattern: Pattern; match: string }> } {
  const matches: Array<{ pattern: Pattern; match: string }> = [];
  
  // Early exit for empty or very short text
  if (!text || text.length < 3) {
    return { detected: false, matches };
  }
  
  for (const pattern of patterns) {
    const compiledRegex = compiledPatterns.get(pattern.id);
    if (!compiledRegex) continue;
    
    // Reset regex lastIndex for global flag
    compiledRegex.lastIndex = 0;
    const match = compiledRegex.exec(text);
    
    if (match) {
      matches.push({ pattern, match: match[0] });
    }
  }
  
  return { detected: matches.length > 0, matches };
}

// Create warning banner with improved styling
function createWarningBanner(matches: Array<{ pattern: Pattern; match: string }>): HTMLElement {
  const banner = document.createElement('div');
  banner.className = 'injection-detector-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');
  
  // Use CSS class instead of inline styles for better performance
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.3s ease-out;
  `;
  
  const title = document.createElement('div');
  title.style.cssText = 'font-weight: bold; margin-bottom: 8px; font-size: 16px;';
  title.textContent = '⚠️ Prompt Injection Detected!';
  banner.appendChild(title);
  
  const details = document.createElement('div');
  details.style.cssText = 'font-size: 13px; line-height: 1.4; max-height: 300px; overflow-y: auto;';
  
  // Limit displayed matches to prevent DOM bloat
  const maxMatches = 5;
  const displayMatches = matches.slice(0, maxMatches);
  
  for (const { pattern, match } of displayMatches) {
    const item = document.createElement('div');
    item.style.cssText = 'margin: 5px 0; padding: 5px; background: rgba(0,0,0,0.2); border-radius: 4px;';
    
    // Sanitize and truncate match text
    const sanitizedMatch = match.slice(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    item.innerHTML = `<strong>${pattern.name}</strong> (${pattern.severity})<br/>Match: "${sanitizedMatch}${match.length > 100 ? '...' : ''}"`;
    details.appendChild(item);
  }
  
  if (matches.length > maxMatches) {
    const more = document.createElement('div');
    more.style.cssText = 'margin-top: 5px; font-style: italic; opacity: 0.8;';
    more.textContent = `... and ${matches.length - maxMatches} more`;
    details.appendChild(more);
  }
  
  banner.appendChild(details);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close alert');
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;
  closeBtn.onclick = () => removeBanner();
  banner.appendChild(closeBtn);
  
  return banner;
}

// Remove banner with cleanup
function removeBanner(): void {
  if (activeBanner) {
    activeBanner.remove();
    activeBanner = null;
  }
  if (bannerTimeout !== null) {
    clearTimeout(bannerTimeout);
    bannerTimeout = null;
  }
}

// Show banner with debouncing
function showBanner(matches: Array<{ pattern: Pattern; match: string }>): void {
  removeBanner();
  
  activeBanner = createWarningBanner(matches);
  document.body.appendChild(activeBanner);
  
  // Auto-remove after duration
  bannerTimeout = window.setTimeout(removeBanner, BANNER_DURATION);
}

// Debounced input handler
function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
  
  // Clear existing debounce timer
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = window.setTimeout(() => {
    const text = 'value' in target ? target.value : target.textContent || '';
    
    const result = detectInjection(text);
    if (result.detected) {
      showBanner(result.matches);
    } else {
      removeBanner();
    }
  }, DEBOUNCE_DELAY);
}

// Attach listener to input element
function attachListener(input: Element): void {
  const element = input as HTMLElement;
  if (!(element as any)._injectionDetectorAttached) {
    (element as any)._injectionDetectorAttached = true;
    element.addEventListener('input', handleInput, { passive: true });
  }
}

// Monitor text inputs and textareas with optimized observer
function monitorInputs(): void {
  // Initial scan with batched processing
  const inputs = document.querySelectorAll(SELECTOR);
  inputs.forEach(attachListener);
  
  // Use IntersectionObserver for better performance with dynamic content
  const observer = new MutationObserver((mutations) => {
    const newInputs: Element[] = [];
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.matches(SELECTOR)) {
              newInputs.push(element);
            }
            newInputs.push(...Array.from(element.querySelectorAll(SELECTOR)));
          }
        });
      }
    }
    
    // Batch attach listeners
    newInputs.forEach(attachListener);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  removeBanner();
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
});

// Initialize
loadPatterns().then(() => {
  console.log('Prompt Injection Detector initialized');
  monitorInputs();
}).catch(err => {
  console.error('Failed to initialize Prompt Injection Detector:', err);
});
