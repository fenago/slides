# 🚀 Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git (optional, for deployment)
- GitHub account (for deployment)
- API key from one of:
  - Anthropic Claude
  - OpenAI
  - Google Gemini
  - OpenRouter

---

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@anthropic-ai/sdk` - Anthropic Claude SDK
- `openai` - OpenAI SDK (also works for OpenRouter)
- `@google/generative-ai` - Google Gemini SDK
- `@octokit/rest` - GitHub API client
- `reveal-md` - Markdown to Reveal.js converter
- `netlify-cli` - Netlify deployment CLI (dev dependency)

### 2. Test Locally

```bash
npm run dev
```

This starts Netlify Dev server at `http://localhost:8888`

### 3. Try Test Mode

1. Open `http://localhost:8888`
2. Check "Test Mode" checkbox
3. Fill in presentation details
4. Click "Generate Presentation"
5. See sample slides generated without API calls!

---

## Deployment

### Option A: Netlify CLI (Fastest)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option B: Netlify Dashboard

1. Push code to GitHub
2. Visit [app.netlify.com](https://app.netlify.com)
3. Click "New site from Git"
4. Connect GitHub repository
5. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
6. Click "Deploy site"

Your site will be live at `https://random-name.netlify.app`

---

## Usage

### For Users (No Setup Needed)

1. Visit your deployed site
2. Select AI provider
3. Enter API key
4. Click "Fetch Models"
5. Select model
6. Describe presentation
7. Enter GitHub credentials
8. Generate!

### For Development

```bash
# Start dev server
npm run dev

# Run with different port
netlify dev --port 3000
```

---

## Environment Variables

**None needed!** 🎉

This app is completely stateless. Users provide their own:
- LLM provider API keys
- GitHub Personal Access Tokens

No environment variables to configure on the server side.

---

## Troubleshooting

### npm install fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Netlify dev fails

```bash
# Make sure you're in the project directory
cd /path/to/ai-slides-generator

# Check Node.js version (needs 18+)
node --version

# Reinstall Netlify CLI
npm install -g netlify-cli
```

### Functions not working locally

```bash
# Make sure functions directory exists
mkdir -p netlify/functions

# Check netlify.toml configuration
cat netlify.toml
```

---

## File Permissions

Ensure these directories are writable:

```bash
chmod -R 755 netlify/functions
chmod -R 755 modules
chmod -R 755 public

# Create generated directory
mkdir -p generated
chmod 755 generated
```

---

## Testing

### Test Slide Generation

```javascript
// In browser console or Node.js
const testData = {
  provider: 'anthropic',
  apiKey: 'your-test-key',
  model: 'claude-sonnet-4-5-20250929',
  topic: 'Test Presentation',
  slideCount: 5,
  testMode: false
};

fetch('/.netlify/functions/generate-slides', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
}).then(r => r.json()).then(console.log);
```

### Test GitHub Validation

```javascript
fetch('/.netlify/functions/validate-github', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'your-github-username',
    token: 'your-github-token'
  })
}).then(r => r.json()).then(console.log);
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Test locally with `npm run dev`
3. ✅ Try test mode
4. ✅ Deploy to Netlify
5. 📢 Share with users!

---

## Support

Need help? Check:
- `README.md` - Full documentation
- `/research` folder - Detailed guides
- [Netlify Docs](https://docs.netlify.com)
- [Reveal.js Docs](https://revealjs.com)

---

**You're all set!** 🎉

Start generating amazing presentations!
