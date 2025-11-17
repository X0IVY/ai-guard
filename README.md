# ai-guard

ever wonder what's going on inside your LLMs head when it gives you a weird answer?

this extension basically lets you peek into the AI's "brain" while you're chatting. tracks things like memory, context drift, confidence levels, hallucinations - all in real time.

## quick start

```bash
git clone https://github.com/X0IVY/ai-guard.git
cd ai-guard
npm install
npm run build
```

then load the `dist/` folder as an unpacked extension in chrome (see [SETUP.md](SETUP.md) for detailed instructions).

**first time setup?** → read [SETUP.md](SETUP.md) for step-by-step walkthrough

## why i built this

was debugging some AI responses and got frustrated not knowing if it:
- forgot something from earlier
- went completely off-topic
- was just making shit up
- lost confidence halfway through

so i threw this together to actually see what's happening under the hood. turned out pretty useful for spotting when AI is about to give you garbage.

## what it tracks

### memory stuff
- **memory pressure** - basically how close it is to forgetting things
- **forgotten items** - catches when it loses track of what you said earlier
- **active memory** - shows what's currently in working memory

### context & drift
- **context drift** - how far off-topic the conversation has gone
- **active topics** - what it thinks you're actually talking about
- **lost references** - when it forgets what "it" or "that" means

### reasoning quality
- **confidence** - how sure it is (counts all the "maybe" and "I think" hedging)
- **hallucinations** - flags suspicious claims and vague citations
- **self-corrections** - tracks when it backtracks or contradicts itself

### attention
- **focus score** - how well it's paying attention vs going on tangents
- **distractions** - catches when it derails
- **focus areas** - keywords it's concentrating on

### emotional state
- **tone** - neutral, apologetic, defensive, uncertain
- **tone shifts** - sudden changes (like when it gets defensive)
- **stress** - excessive apologizing, hedging language

## features

- clean dashboard in the corner (collapsible)
- updates every 500ms as you chat
- color-coded alerts (green=good, yellow=watch out, red=wtf)
- works on ChatGPT, Claude, Gemini, and other AI platforms
- doesn't get in your way
- fully typed typescript codebase

## how it works

runs NLP analysis on responses in real-time:

1. tracks conversation length vs context window
2. compares current topic to history (context drift detection)
3. analyzes hedging language and uncertainty markers
4. looks for claims without sources (hallucination flags)
5. tracks topic consistency and focus
6. detects tone shifts and stress patterns

## using it

click the brain icon (🧠) in top-right to expand/collapse.

**debugging weird responses:**
- check memory pressure (is it forgetting stuff?)
- check context drift (did conversation derail?)
- check confidence (lots of "maybe" and "I think"?)

**quality checking output:**
- any hallucination flags?
- high uncertainty markers?
- did it contradict itself?

**research/analysis:**
- when does memory pressure spike in long convos?
- how well does it maintain topic focus?
- does it get "defensive" under certain conditions?

## documentation

- **[SETUP.md](SETUP.md)** - complete local development guide (required for first-time setup)
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - technical architecture and integration details
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - how to contribute
- **[SECURITY.md](SECURITY.md)** - security considerations
- **[PRIVACY.md](PRIVACY.md)** - data handling and privacy

## development

### commands

```bash
npm run dev          # Start dev server (watch mode)
npm run build        # Build for production
npm run preview      # Preview build output
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code
npm run type-check   # TypeScript type checking
```

### tech stack

- preact (lighter than react)
- typescript
- vite (fast bundler)
- custom css with animations
- chrome extension manifest v3

## project structure

```
ai-guard/
├── src/
│   ├── brain-tracker.ts        # Core tracking logic
│   ├── brain-dashboard.tsx     # Dashboard UI component
│   ├── content.ts              # Content script entry point
│   ├── patterns.json           # Detection patterns
│   └── popup/
│       └── index.html          # Popup HTML
├── styles/
│   ├── brain-dashboard.css     # Dashboard styles
│   └── content.css             # Content script styles
├── dist/                       # Build output (auto-generated)
├── manifest.json               # Extension manifest
├── package.json                # Dependencies
├── vite.config.ts              # Build config
├── tsconfig.json               # TypeScript config
├── SETUP.md                    # Setup guide (START HERE!)
└── IMPLEMENTATION.md           # Technical details
```

## supported platforms

- ✅ ChatGPT (OpenAI)
- ✅ Claude (Anthropic)
- ✅ Gemini (Google)
- ✅ Any platform with similar chat interface

## troubleshooting

**Extension not loading?**
- Make sure you ran `npm run build`
- Check that `dist/` folder exists
- See [SETUP.md](SETUP.md#troubleshooting) for detailed troubleshooting

**Dashboard not showing?**
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors (F12)
- Verify extension is enabled in `chrome://extensions/`

**Build errors?**
- Run `npm run type-check` to see type issues
- Run `npm run lint:fix` to auto-fix linting problems
- See [SETUP.md](SETUP.md#troubleshooting) for more solutions

## contributing

contributions welcome! see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## license

MIT
