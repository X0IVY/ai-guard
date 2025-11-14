// AI Guard - Integrated Content Script with Full Feature Suite
// Monitors AI chatbot behavior, detects anomalies, tracks patterns, and provides real-time insights

import { PerformanceMonitor } from './performance-monitor';
import { PromptLearningEngine } from './prompt-learning-engine';
import { PromptRepository } from './prompt-repository';

interface Pattern {
  id: string;
  name: string;
  regex: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class AIGuard {
  private patterns: Pattern[] = [];
  private compiledPatterns: Map<string, RegExp> = new Map();
  private perfMonitor: PerformanceMonitor;
  private learningEngine: PromptLearningEngine;
  private repository: PromptRepository;
  private uiContainer: HTMLElement | null = null;
  private isUIVisible: boolean = false;
  
  constructor() {
    this.perfMonitor = new PerformanceMonitor();
    this.learningEngine = new PromptLearningEngine();
    this.repository = new PromptRepository();
  }

  async initialize(): Promise<void> {
    console.log('[AI Guard] Initializing...');
    
    try {
      // Load patterns
      await this.loadPatterns();
      
      // Start performance monitoring
      this.perfMonitor.startMonitoring();
      
      // Create and inject UI
      this.createUI();
      
      // Monitor text inputs for injection detection
      this.monitorInputs();
      
      // Set up prompt learning
      this.setupPromptLearning();
      
      console.log('[AI Guard] ✓ Initialized successfully');
    } catch (error) {
      console.error('[AI Guard] Failed to initialize:', error);
    }
  }

  private async loadPatterns(): Promise<void> {
    try {
      const response = await fetch(chrome.runtime.getURL('src/patterns.json'));
      this.patterns = await response.json();
      
      this.patterns.forEach(pattern => {
        try {
          this.compiledPatterns.set(pattern.id, new RegExp(pattern.regex, 'gi'));
        } catch (e) {
          console.error(`[AI Guard] Failed to compile pattern ${pattern.id}:`, e);
        }
      });
      
      console.log(`[AI Guard] Loaded ${this.patterns.length} patterns`);
    } catch (error) {
      console.error('[AI Guard] Failed to load patterns:', error);
    }
  }

  private createUI(): void {
    // Create floating panel (Phantom wallet style)
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'ai-guard-panel';
    this.uiContainer.className = 'ai-guard-panel';
    
    // Initial hidden state
    this.uiContainer.style.display = 'none';
    
    document.body.appendChild(this.uiContainer);
    
    // Create toggle button
    this.createToggleButton();
    
    // Render initial UI
    this.renderUI();
  }

  private createToggleButton(): void {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ai-guard-toggle';
    toggleBtn.className = 'ai-guard-toggle';
    toggleBtn.innerHTML = '🛡️';
    toggleBtn.setAttribute('aria-label', 'Toggle AI Guard Panel');
    
    toggleBtn.onclick = () => this.toggleUI();
    
    document.body.appendChild(toggleBtn);
  }

  private toggleUI(): void {
    this.isUIVisible = !this.isUIVisible;
    if (this.uiContainer) {
      this.uiContainer.style.display = this.isUIVisible ? 'flex' : 'none';
      if (this.isUIVisible) {
        this.updateUI();
      }
    }
  }

  private async renderUI(): Promise<void> {
    if (!this.uiContainer) return;

    const perfMetrics = this.perfMonitor.getMetrics();
    const learningMetrics = await this.learningEngine.getMetrics();
    
    this.uiContainer.innerHTML = `
      <div class="ai-guard-header">
        <div class="ai-guard-logo">
          <span class="logo-icon">🛡️</span>
          <span class="logo-text">AI Guard</span>
        </div>
        <button class="ai-guard-close" onclick="document.getElementById('ai-guard-panel').style.display='none';">×</button>
      </div>

      <div class="ai-guard-stats">
        <div class="stat-card">
          <div class="stat-label">Memory</div>
          <div class="stat-value">${(perfMetrics.memory / 1024 / 1024).toFixed(1)} MB</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">CPU</div>
          <div class="stat-value">${perfMetrics.cpuUsage.toFixed(1)}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Prompts</div>
          <div class="stat-value">${learningMetrics.totalPrompts}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Suspicious</div>
          <div class="stat-value ${learningMetrics.suspiciousPrompts > 0 ? 'stat-warning' : ''}">${learningMetrics.suspiciousPrompts}</div>
        </div>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">⚡ Performance</div>
        <div class="metric-row">
          <span class="metric-label">Page Load</span>
          <span class="metric-value">${perfMetrics.loadTime.toFixed(0)}ms</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">DOM Nodes</span>
          <span class="metric-value">${perfMetrics.domNodes}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Network</span>
          <span class="metric-value">${perfMetrics.networkRequests} requests</span>
        </div>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">🧠 Learning Metrics</div>
        <div class="metric-row">
          <span class="metric-label">Avg Complexity</span>
          <span class="metric-value">${learningMetrics.avgComplexity.toFixed(2)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Confidence</span>
          <span class="metric-value">${learningMetrics.confidenceScore.toFixed(1)}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Injection Risk</span>
          <span class="metric-value">${learningMetrics.injectionAttempts}</span>
        </div>
      </div>

      <div class="ai-guard-section">
        <div class="section-title">🏆 Top Domains</div>
        <div class="domain-list">
          ${learningMetrics.topDomains.map(d => `
            <div class="domain-item">
              <span class="domain-name">${d.domain}</span>
              <span class="domain-count">${d.count}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ai-guard-actions">
        <button class="action-btn" onclick="aiGuardInstance.exportData()">📊 Export Data</button>
        <button class="action-btn" onclick="aiGuardInstance.clearData()">🗑️ Clear Data</button>
      </div>
    `;
  }

  private async updateUI(): Promise<void> {
    await this.renderUI();
  }

  private monitorInputs(): void {
    const selector = 'textarea, input[type="text"], [contenteditable="true"]';
    
    const handleInput = async (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
      const text = 'value' in target ? target.value : target.textContent || '';
      
      if (text.length < 3) return;
      
      // Check for injection patterns
      const injectionResult = this.detectInjection(text);
      if (injectionResult.detected) {
        this.showInjectionWarning(injectionResult.matches);
      }
      
      // Learn from prompt
      await this.learningEngine.learnFromPrompt(text, {
        domain: window.location.hostname,
        success: true,
        responseQuality: 'good'
      });
    };
    
    // Attach to existing inputs
    document.querySelectorAll(selector).forEach(input => {
      input.addEventListener('input', handleInput, { passive: true });
    });
    
    // Monitor for new inputs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.matches(selector)) {
              element.addEventListener('input', handleInput, { passive: true });
            }
            element.querySelectorAll(selector).forEach(input => {
              input.addEventListener('input', handleInput, { passive: true });
            });
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  private detectInjection(text: string): { detected: boolean; matches: Array<{ pattern: Pattern; match: string }> } {
    const matches: Array<{ pattern: Pattern; match: string }> = [];
    
    for (const pattern of this.patterns) {
      const compiledRegex = this.compiledPatterns.get(pattern.id);
      if (!compiledRegex) continue;
      
      compiledRegex.lastIndex = 0;
      const match = compiledRegex.exec(text);
      
      if (match) {
        matches.push({ pattern, match: match[0] });
      }
    }
    
    return { detected: matches.length > 0, matches };
  }

  private showInjectionWarning(matches: Array<{ pattern: Pattern; match: string }>): void {
    const warning = document.createElement('div');
    warning.className = 'ai-guard-warning';
    warning.innerHTML = `
      <div class="warning-header">
        <span>⚠️ Potential Injection Detected</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="warning-body">
        ${matches.slice(0, 3).map(m => `
          <div class="warning-item">
            <strong>${m.pattern.name}</strong> (${m.pattern.severity})
          </div>
        `).join('')}
      </div>
    `;
    
    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 8000);
  }

  private setupPromptLearning(): void {
    // Auto-update UI every 5 seconds if visible
    setInterval(() => {
      if (this.isUIVisible) {
        this.updateUI();
      }
    }, 5000);
  }

  async exportData(): Promise<void> {
    try {
      const data = await this.learningEngine.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-guard-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[AI Guard] Export failed:', error);
    }
  }

  async clearData(): Promise<void> {
    if (confirm('Clear all AI Guard data? This cannot be undone.')) {
      await this.repository.clearAll();
      await this.updateUI();
      console.log('[AI Guard] Data cleared');
    }
  }
}

// Initialize AI Guard
const aiGuardInstance = new AIGuard();
(window as any).aiGuardInstance = aiGuardInstance;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => aiGuardInstance.initialize());
} else {
  aiGuardInstance.initialize();
}
