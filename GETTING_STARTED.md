# Getting Started with AI Guard

Welcome! This guide covers everything you need to get AI Guard running on your machine.

## TL;DR - Fastest Path

```bash
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard
bash QUICK_START.sh
```

Then open `chrome://extensions/`, enable Developer mode, click "Load unpacked", and select the `dist/` folder.

**Done!** Look for the 🧠 icon on ChatGPT.

---

## Choose Your Path

### Path 1: Automated Setup (Recommended)

**For:** First-time users who want automation

```bash
bash QUICK_START.sh
```

- ✅ Checks prerequisites (Node.js, npm)
- ✅ Installs dependencies
- ✅ Builds the extension
- ✅ Verifies everything works
- ✅ Shows next steps

**Time:** ~2 minutes

### Path 2: Manual Setup (Most Control)

**For:** Developers who want to understand each step

Read [SETUP.md](SETUP.md) for detailed instructions:
1. Prerequisites check
2. Installation step-by-step
3. Development build options
4. Chrome extension loading
5. Testing and debugging

**Time:** ~5-10 minutes

### Path 3: Quick Verification

**For:** Those who want to verify an existing setup

Read [VERIFY.md](VERIFY.md):
- System requirements checklist
- Build verification
- Chrome extension verification
- Runtime verification
- Debug tips

**Time:** ~5 minutes

---

## Quick Reference

### Essential Commands

```bash
# One-time setup
npm install              # Install dependencies
npm run build            # Build for production

# Development
npm run dev              # Watch mode (auto-rebuilds)
npm run type-check       # TypeScript type checking
npm run lint             # Code quality check
npm run lint:fix         # Auto-fix issues

# Code quality
npm run format           # Format code
npm run format:check     # Check formatting
```

### Loading into Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the **`dist/`** folder
5. Done! You should see AI Guard in your extensions

### Testing the Extension

1. Navigate to [ChatGPT](https://chat.openai.com)
2. Look for the **🧠 brain icon** in top-right
3. Click it to expand the dashboard
4. Send a message - watch the dashboard update

---

## System Requirements

### Required

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **Chrome/Chromium** v90+ (or Edge, Brave, Opera)
- **Git**

### Verify Installation

```bash
node --version    # Should show v18+
npm --version     # Should show v9+
```

---

## Troubleshooting Quick Links

### Extension Not Loading

```bash
# Rebuild
npm run build

# Check dist folder exists
ls dist/manifest.json

# Reload from chrome://extensions
```

→ See [SETUP.md - Troubleshooting](SETUP.md#troubleshooting)

### Dashboard Not Showing

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
2. Verify you're on `https://chat.openai.com` (exact domain)
3. Check DevTools console (F12) for errors
4. Reload extension from `chrome://extensions/`

→ See [VERIFY.md](VERIFY.md#runtime-verification)

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check for errors
npm run type-check

# Auto-fix issues
npm run lint:fix
```

→ See [SETUP.md - Build Errors](SETUP.md#build-errors)

---

## What Gets Built?

The `dist/` folder contains your complete extension:

```
dist/
├── manifest.json           # Extension configuration
├── content.js              # Content script (runs on pages)
├── popup.html              # Extension popup
├── styles/                 # CSS files
│   ├── brain-dashboard.css
│   └── content.css
└── [other compiled files]
```

**Don't edit dist/ directly** - it's generated automatically by the build process.

---

## Development Workflow

### For Active Development

```bash
# Terminal 1: Start watch mode
npm run dev

# Terminal 2: Edit files in src/
# Files auto-compile as you save

# In Chrome: Reload extension when you change code
# chrome://extensions → Find AI Guard → Click refresh
```

### For One-Time Testing

```bash
# Build once
npm run build

# Load dist/ folder into Chrome
# Test in ChatGPT
```

---

## Documentation Map

| Document | Purpose | Read When |
|----------|---------|----------|
| **[SETUP.md](SETUP.md)** | Complete setup guide with all options | First time setup |
| **[VERIFY.md](VERIFY.md)** | Verification checklist & debugging | Something isn't working |
| **[IMPLEMENTATION.md](IMPLEMENTATION.md)** | Technical architecture & internals | Modifying the code |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Contribution guidelines | Want to contribute |
| **[SECURITY.md](SECURITY.md)** | Security considerations & practices | Concerned about security |
| **[PRIVACY.md](PRIVACY.md)** | Data handling & privacy details | Concerned about privacy |
| **[QUICK_START.sh](QUICK_START.sh)** | Automated setup script | Want automation |
| **[.env.example](.env.example)** | Environment variables template | Advanced configuration |

---

## Project Structure

```
ai-guard/
├── src/                         # Source code
│   ├── brain-tracker.ts        # Core tracking logic
│   ├── brain-dashboard.tsx     # UI component
│   ├── content.ts              # Content script entry
│   ├── patterns.json           # Detection patterns
│   └── popup/
│       └── index.html
├── styles/                      # CSS files
│   ├── brain-dashboard.css
│   └── content.css
├── dist/                        # Built extension (auto-generated)
├── manifest.json                # Extension manifest
├── package.json                 # Dependencies
├── vite.config.ts               # Build configuration
├── tsconfig.json                # TypeScript config
├── SETUP.md                     # Setup guide
├── VERIFY.md                    # Verification guide
├── QUICK_START.sh               # Quick start script
└── IMPLEMENTATION.md            # Technical details
```

---

## Common Tasks

### "I cloned the repo, what's next?"

```bash
# Option 1: Automated
bash QUICK_START.sh

# Option 2: Manual
npm install
npm run build
# Then load dist/ into Chrome
```

### "I want to modify the code"

```bash
# 1. Start development server
npm run dev

# 2. Edit files in src/
# 3. Save your changes

# 4. Reload extension in Chrome
# chrome://extensions → AI Guard → Refresh button
```

### "I'm getting TypeScript errors"

```bash
# Check what's wrong
npm run type-check

# Auto-fix common issues
npm run lint:fix

# Rebuild
npm run build
```

### "The extension won't load"

```bash
# 1. Verify build exists
ls dist/manifest.json

# 2. Rebuild if missing
npm run build

# 3. Reload extension
# chrome://extensions → AI Guard → Refresh
```

### "Dashboard shows but doesn't update"

1. Hard refresh ChatGPT: `Cmd+Shift+R` or `Ctrl+Shift+R`
2. Check console for errors: `F12 → Console tab`
3. Reload extension from `chrome://extensions`
4. If still broken, read [VERIFY.md#runtime-verification](VERIFY.md#runtime-verification)

---

## Getting Help

### Documentation First

1. Search [SETUP.md](SETUP.md) for your issue
2. Check [VERIFY.md](VERIFY.md) troubleshooting section
3. Review [IMPLEMENTATION.md](IMPLEMENTATION.md) for how things work

### Debug Mode

```bash
# Enable detailed logging
# Edit src/brain-tracker.ts and set:
# const DEBUG_MODE = true;

npm run build
# Reload extension
# Check console for debug messages
```

### Check Error Console

1. **Content script errors:** `F12` on ChatGPT tab → Console
2. **Extension errors:** `chrome://extensions/` → AI Guard → "Service Worker"
3. **Build errors:** Terminal output when running `npm run build`

---

## Next Steps

✅ **Setup Complete?** 
→ Check out [IMPLEMENTATION.md](IMPLEMENTATION.md) to understand the architecture

✅ **Want to Contribute?** 
→ Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

✅ **Modifying Code?** 
→ Use `npm run dev` for watch mode development

✅ **Curious About Security?** 
→ See [SECURITY.md](SECURITY.md)

---

## Quick Facts

- **Build time:** ~10-30 seconds
- **Reload time:** ~1 second
- **Dashboard update interval:** ~500ms
- **Bundle size:** ~50-80 KB (minified)
- **Memory usage:** <10 MB
- **Supported browsers:** Chrome 90+, Edge, Brave, Opera
- **Supported platforms:** ChatGPT, Claude, Gemini

---

**Questions?** Check the relevant documentation guide above or review [SETUP.md](SETUP.md) for comprehensive help.
