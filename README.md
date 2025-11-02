# 🎨 AI Slides Generator

**Create stunning, professional presentations using AI • Deploy to GitHub Pages in minutes**

Transform your ideas into beautiful Reveal.js presentations with the power of AI. Support for Anthropic Claude, OpenAI GPT, Google Gemini, and OpenRouter with 400+ models.

---

## ✨ Features

- 🤖 **Multi-LLM Support** - Choose from Anthropic, OpenAI, Google Gemini, or OpenRouter
- 🎓 **Instructional Design** - Built on cognitive load theory and evidence-based learning principles
- 🎤 **TED Talk Quality** - Speaker notes with storytelling structure and presentation tips
- 🎯 **100+ Reveal.js Features** - Full control over themes, transitions, and advanced features
- 🚀 **GitHub Pages Deployment** - Automatic deployment to your GitHub account
- 🔒 **Privacy First** - Zero data storage, completely stateless
- 🎨 **Stunning Design** - Auto-animate, fragments, backgrounds, and visual effects
- 📱 **Mobile Responsive** - Works beautifully on all devices

---

## 🚀 Quick Start

### 1. Get API Keys

You'll need:
- **LLM Provider API Key** (choose one):
  - [Anthropic Claude](https://console.anthropic.com/settings/keys)
  - [OpenAI](https://platform.openai.com/api-keys)
  - [Google Gemini](https://aistudio.google.com/app/apikey)
  - [OpenRouter](https://openrouter.ai/keys)

- **GitHub Personal Access Token**:
  - Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
  - Create new token with `repo` and `workflow` permissions

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:8888`

### 4. Deploy to Netlify

```bash
netlify deploy --prod
```

Or connect your GitHub repo to Netlify for automatic deployments.

---

## 📖 How To Use

### Step 1: Choose Your AI Provider

Select from:
- **Anthropic Claude** - Most powerful, latest models
- **OpenAI GPT** - GPT-4, GPT-4o, o1 reasoning models
- **Google Gemini** - Gemini 2.5 series
- **OpenRouter** - 400+ models from all providers

### Step 2: Describe Your Presentation

```
Topic: AI in Education for College Professors

Target Audience: College faculty

Number of Slides: 10

Tone: Professional

Topic Type: Educational
```

Be specific! The more detail you provide, the better the results.

### Step 3: Configure Reveal.js Settings

Choose from:
- **Themes**: Black, White, League, Sky, Night, and more
- **Transitions**: Slide, Fade, Convex, Zoom, etc.
- **Features**: Controls, progress bar, slide numbers, speaker notes

### Step 4: Deploy to GitHub

Enter your:
- GitHub username
- Personal Access Token
- Repository name (we'll create it if it doesn't exist)

### Step 5: Generate!

Click "Generate Presentation" and watch the magic happen:
1. AI generates slides (10-30 seconds)
2. Reveal.js builds presentation (5-10 seconds)
3. Deploys to GitHub Pages (10-20 seconds)

**Result**: `https://username.github.io/repo-name`

---

## 🎓 Instructional Design Principles

Every presentation generated follows research-based best practices:

### Cognitive Load Theory
- **Maximum 4 bullets per slide** - Respects working memory limits
- **Visual-first design** - Images and diagrams over walls of text
- **Dual coding** - Combines visual and verbal information
- **Minimize extraneous load** - Every element serves a purpose

### TED Talk Speaker Notes
Every slide includes speaker notes with:
- **Hook** - Surprising facts, questions, or stories
- **Storytelling** - Relatable examples and analogies
- **Transitions** - Smooth connections between slides
- **Timing** - Suggested pacing (e.g., "2 minutes")
- **Tips** - Presentation guidance (e.g., "Make eye contact")

### Visual Design
- Strategic use of color psychology
- Auto-animate transitions for smooth flow
- Fragment reveals for engagement
- Background variety for visual interest
- High-quality suggested imagery

---

## 🛠️ Tech Stack

### Frontend
- HTML5/CSS3/Vanilla JavaScript
- Responsive, mobile-first design
- No frameworks needed!

### Backend
- Netlify Serverless Functions (Node.js)
- No Express, no database, completely stateless

### AI Providers
- `@anthropic-ai/sdk` - Claude models
- `openai` - GPT models and OpenRouter
- `@google/generative-ai` - Gemini models

### Presentation
- `reveal-md` - Markdown to Reveal.js converter
- 11 built-in themes
- 100+ configuration options

### Deployment
- `@octokit/rest` - GitHub API client
- GitHub Pages for hosting

---

## 📁 Project Structure

```
ai-slides-generator/
├── public/                   # Frontend files
│   ├── index.html           # Main interface
│   ├── styles.css           # Styling
│   └── app.js               # Client logic
├── netlify/functions/       # Serverless API
│   ├── generate-slides.js   # Main generation function
│   ├── get-themes.js        # Get available themes
│   └── validate-github.js   # Validate credentials
├── modules/                 # Shared code
│   ├── prompts.js          # Instructional design prompts
│   ├── llm-generator.js    # Multi-LLM support
│   ├── reveal-builder.js   # Reveal.js builder
│   └── github-deploy.js    # GitHub deployment
├── research/                # Documentation
│   ├── todo.md             # Development roadmap
│   ├── revealjs-features.md # Complete features list
│   ├── multi-llm-providers.md # LLM integration guide
│   └── SUMMARY.md          # Project overview
├── generated/               # Temporary generated files
├── dist/                    # Built presentations
├── package.json
├── netlify.toml
└── README.md               # This file
```

---

## 🔧 Configuration

### Default Settings

```javascript
{
  slideCount: 8,
  theme: 'black',
  tone: 'professional',
  topicType: 'general',
  transition: 'slide',
  controls: true,
  progress: true,
  slideNumber: false,
  center: true,
  hash: true
}
```

### Available Themes

- **black** - Classic black background
- **white** - Clean white background
- **league** - Gray background
- **beige** - Warm beige
- **sky** - Blue gradient
- **night** - Dark with thick text
- **serif** - Traditional serif font
- **simple** - Minimalist
- **solarized** - Easy on eyes
- **blood** - Dark with red accents
- **moon** - Professional night theme

### Available Transitions

- **slide** - Horizontal slide
- **fade** - Cross-fade
- **convex** - Curved 3D
- **concave** - Inverted convex
- **zoom** - Scale transition
- **none** - Instant

---

## 🔒 Privacy & Security

### What We DON'T Store
- ❌ Your API keys (any provider)
- ❌ Your GitHub token
- ❌ Your presentation content
- ❌ Any user data
- ❌ Logs with sensitive information

### How It Works
- ✅ All credentials transmitted over HTTPS
- ✅ Processed in-memory only (Netlify Functions)
- ✅ Cleared immediately after use
- ✅ Completely stateless architecture
- ✅ You own all generated content

---

## 💰 Cost Structure

### For You (App Owner)
- **Netlify Free Tier**: 125k function requests/month
- **No LLM costs**: Users provide their own keys
- **Total**: $0/month for most use cases

### For Users
- **LLM API costs** (per presentation):
  - Anthropic Claude: $3-15
  - OpenAI GPT-4: $5-20
  - Google Gemini: $1-5
  - OpenRouter: Varies (free models available)
- **GitHub Pages**: Free
- **Total**: $1-20 per presentation (user's choice)

---

## 🧪 Test Mode

Want to try it without using your API key?

1. Check "Test Mode" checkbox
2. Enter your presentation details
3. Skip provider and GitHub sections
4. Generate sample slides

Test mode creates professional example slides without:
- Using any API keys
- Deploying to GitHub
- Incurring any costs

Perfect for:
- Seeing what the output looks like
- Testing the interface
- Demonstrations
- Development

---

## 🚀 Deployment Guide

### Deploy to Netlify

#### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option 2: GitHub Integration

1. Push code to GitHub
2. Visit [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `public`
6. Deploy!

### Custom Domain

1. Go to Netlify dashboard → Domain settings
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (automatic)

---

## 🐛 Troubleshooting

### "Invalid API key"
- Double-check your API key
- Ensure it has proper permissions
- Try creating a new key

### "GitHub deployment failed"
- Verify GitHub PAT has `repo` and `workflow` permissions
- Check if repository name is valid (alphanumeric, hyphens, underscores)
- Ensure username is correct

### "Models not loading"
- Check internet connection
- Verify API key is valid
- Try a different provider

### "Build failed"
- Check Netlify function logs
- Ensure all dependencies are installed
- Try clearing `node_modules` and reinstalling

---

## 📚 Advanced Usage

### Custom System Prompts

Want to customize how the AI generates slides?

1. Open "Reveal.js Settings (Optional)"
2. Expand "Advanced Options"
3. Edit system prompt to add specific instructions

Example:
```
Always include code examples
Use lots of emojis
Make it very visual
Focus on practical applications
```

### Programmatic Usage

Use the API directly:

```javascript
const response = await fetch('/.netlify/functions/generate-slides', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'anthropic',
    apiKey: 'your-key',
    model: 'claude-sonnet-4-5-20250929',
    topic: 'Your topic',
    slideCount: 10,
    // ... other options
  })
});

const result = await response.json();
console.log(result.data.deployment.url);
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this for any purpose!

---

## 🙏 Acknowledgments

Built with:
- [Reveal.js](https://revealjs.com/) - Presentation framework
- [Netlify](https://www.netlify.com/) - Hosting and functions
- [Anthropic Claude](https://www.anthropic.com/) - AI models
- [OpenAI](https://openai.com/) - GPT models
- [Google Gemini](https://deepmind.google/technologies/gemini/) - Gemini models
- [OpenRouter](https://openrouter.ai/) - Multi-model API

Research references:
- Cognitive Load Theory (Sweller, 1988)
- Multimedia Learning (Mayer, 2001)
- Presentation Zen (Reynolds, 2008)
- TED Talk Speaker Guide

---

## 📞 Support

- **Documentation**: Check `/research` folder for detailed guides
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ and AI**

Generate amazing presentations. Deploy in minutes. Impress your audience.

🚀 **[Try it now!](#)**
