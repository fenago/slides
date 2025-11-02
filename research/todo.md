# AI-Powered Slide Generation System - Development Roadmap

## Project Overview
Building an intuitive AI-powered presentation system using Reveal.js that follows instructional design best practices, generates Ted Talk-quality lecture notes, and deploys to GitHub Pages.

---

## Tech Stack

### Frontend
- HTML5/CSS3/JavaScript (vanilla - no framework needed)
- Responsive design for all devices
- Real-time streaming UI updates
- Interactive checkbox controls for Reveal.js features

### Backend
- Netlify Serverless Functions (Node.js runtime)
- Claude SDK (@anthropic-ai/sdk) for content generation
- reveal-md for markdown to Reveal.js conversion
- Octokit (@octokit/rest) for GitHub API integration
- Environment variables via Netlify dashboard

### Infrastructure & Deployment
- **Main Application**: Netlify (hosts web UI and serverless functions)
- **Generated Presentations**: GitHub Pages (each presentation = separate GitHub repo)
- Netlify Functions replace Express endpoints
- Anthropic Claude API (AI generation)
- GitHub API (deploys presentations to user's GitHub Pages)

---

## Phase 1: Research & Planning ✓

- [ ] **Deep Research on Instructional Design Best Practices**
  - [x] Cognitive Load Theory principles
  - [x] Dual-channel learning (visual + auditory)
  - [x] Evidence-based presentation design
  - [x] TED Talk structure and techniques
  - [ ] Mayer's Multimedia Learning principles
  - [ ] Gagne's Nine Events of Instruction
  - [ ] Universal Design for Learning (UDL) guidelines

- [ ] **Document Core Principles for AI Prompts**
  - [ ] Maximum 4 bullet points per slide (working memory constraint)
  - [ ] Visual-first design (images > text)
  - [ ] Minimize extraneous cognitive load
  - [ ] Clear learning objectives per slide
  - [ ] Storytelling structure (4-step: Hook, Promise, Main Points, Conclusion)
  - [ ] Speaker notes that complement (not duplicate) slide content
  - [ ] Real-world scenarios and examples

- [ ] **Reveal.js Feature Audit**
  - [ ] Document all available features and plugins
  - [ ] Map features to checkbox UI controls
  - [ ] Identify essential vs. advanced features
  - [ ] Test feature compatibility combinations

---

## Phase 2: Project Setup & Infrastructure

- [ ] **Initialize Project Structure**
  ```
  ai-slides-generator/
  ├── netlify.toml            # Netlify configuration
  ├── .env.example            # Environment template
  ├── .gitignore
  ├── package.json
  ├── public/                 # Static frontend files
  │   ├── index.html
  │   ├── styles.css
  │   └── app.js
  ├── netlify/
  │   └── functions/          # Serverless API endpoints
  │       ├── generate-slides.js
  │       ├── get-themes.js
  │       ├── get-features.js
  │       └── health.js
  ├── modules/                # Shared utilities
  │   ├── claude-generator.js
  │   ├── prompts.js
  │   ├── reveal-builder.js
  │   └── github-deploy.js
  ├── generated/              # Temporary generated files
  ├── dist/                   # Built presentations
  ├── templates/              # Prompt templates
  └── research/
      ├── idea.md ✓
      └── todo.md (this file)
  ```

- [ ] **Package Installation**
  ```bash
  npm init -y
  npm install @anthropic-ai/sdk openai @google/generative-ai @octokit/rest reveal-md
  npm install --save-dev netlify-cli
  ```

- [ ] **Environment Configuration**
  - [ ] Create netlify.toml configuration file
  - [ ] Create .env.example (no API keys needed - users provide their own)
  - [ ] Document how users get API keys:
    - Anthropic: https://console.anthropic.com/settings/keys
    - OpenAI: https://platform.openai.com/api-keys
    - Google Gemini: https://aistudio.google.com/app/apikey
    - OpenRouter: https://openrouter.ai/keys
  - [ ] Document how users create GitHub personal access token
  - [ ] Note: App is completely stateless - no API keys stored anywhere

- [ ] **Git Repository Setup**
  - [ ] Initialize git repository
  - [ ] Create comprehensive .gitignore
  - [ ] Set up GitHub repository for project
  - [ ] Create README.md with setup instructions

---

## Phase 3: AI Prompt Engineering (Critical Foundation)

- [ ] **System Prompt Development**
  - [ ] Incorporate cognitive load theory principles
  - [ ] Embed instructional design best practices
  - [ ] Include visual design guidelines
  - [ ] Define slide structure requirements
  - [ ] Specify speaker notes format and quality standards
  - [ ] Add constraints (max bullets, text length, etc.)

- [ ] **User Prompt Templates**
  - [ ] Basic template (topic, audience, slide count)
  - [ ] Advanced template (tone, learning objectives)
  - [ ] Custom template (user-defined system/user prompts)
  - [ ] Context injection for specific industries/fields

- [ ] **Speaker Notes Generation Prompts**
  - [ ] TED Talk structure (Hook, Promise, Points, Conclusion)
  - [ ] Storytelling techniques
  - [ ] Transition phrases between slides
  - [ ] Timing guidance (pacing notes)
  - [ ] Audience engagement cues
  - [ ] Analogies and examples for complex concepts

- [ ] **Prompt Testing & Iteration**
  - [ ] Test with diverse topics (technical, creative, educational)
  - [ ] Validate output against instructional design principles
  - [ ] Refine for consistency and quality
  - [ ] Create test cases for edge cases

---

## Phase 4: Core Backend Development

- [ ] **Multi-LLM Generator Module (llm-generator.js)**
  - [ ] **Anthropic Integration**
    - [ ] Initialize SDK with user's API key
    - [ ] Generate slides function
    - [ ] Error handling
  - [ ] **OpenAI Integration**
    - [ ] Initialize SDK with user's API key
    - [ ] Generate slides function
    - [ ] Error handling
  - [ ] **Google Gemini Integration**
    - [ ] Initialize SDK with user's API key
    - [ ] Generate slides function
    - [ ] Error handling
  - [ ] **OpenRouter Integration**
    - [ ] Initialize OpenAI-compatible client
    - [ ] Generate slides function
    - [ ] Error handling
  - [ ] **Unified Interface**
    - [ ] Single generateSlides() function that routes to provider
    - [ ] Normalize responses from all providers
    - [ ] Common error handling
    - [ ] Retry logic with exponential backoff
    - [ ] Save generated markdown to files
    - [ ] Include metadata (provider, model, timestamp)

- [ ] **Prompt Management Module (prompts.js)**
  - [ ] Store instructional design system prompt (research-based)
  - [ ] Create dynamic user prompt builder
  - [ ] Add prompt template variations by topic type
  - [ ] Include TED Talk-quality speaker notes sub-prompts
  - [ ] Support custom system/user prompt override
  - [ ] Prompt versioning and testing

- [ ] **Reveal.js Builder Module (reveal-builder.js)**
  - [ ] Markdown to Reveal.js conversion
  - [ ] Theme selection system
  - [ ] Plugin integration based on checkboxes
  - [ ] Custom configuration builder
  - [ ] Static site generation
  - [ ] Asset management (images, fonts, etc.)

- [ ] **GitHub Deployment Module (github-deploy.js)**
  - [ ] Octokit authentication
  - [ ] Repository creation/update logic
  - [ ] File upload to gh-pages branch
  - [ ] GitHub Pages enablement
  - [ ] Deployment status tracking
  - [ ] Error handling for API rate limits

---

## Phase 5: Reveal.js Features Integration

- [ ] **Core Features Checkboxes**
  - [ ] Themes (black, white, league, beige, sky, night, serif, simple, solarized, blood, moon)
  - [ ] Transitions (none, fade, slide, convex, concave, zoom)
  - [ ] Transition speed (default, fast, slow)
  - [ ] Background transitions
  - [ ] Slide numbers
  - [ ] Progress bar
  - [ ] Controls (arrows)
  - [ ] Overview mode (ESC key)
  - [ ] Center slides vertically
  - [ ] Touch navigation
  - [ ] Loop presentation
  - [ ] RTL (right-to-left) support
  - [ ] Shuffle slides
  - [ ] Fragments (incremental reveals)

- [ ] **Advanced Features Checkboxes**
  - [ ] Speaker notes view
  - [ ] Auto-slide (with timing control)
  - [ ] Keyboard shortcuts
  - [ ] Mousewheel navigation
  - [ ] Hide cursor
  - [ ] Parallax background
  - [ ] PDF export support
  - [ ] Embedded media (video, audio)
  - [ ] Math equations (MathJax)
  - [ ] Syntax highlighting for code
  - [ ] Chart.js integration
  - [ ] Mermaid diagrams
  - [ ] Zoom plugin
  - [ ] Search plugin
  - [ ] Fullscreen API

- [ ] **Build Feature Toggle System**
  - [ ] Map checkboxes to reveal.js config
  - [ ] Dynamic config generation
  - [ ] Validate feature combinations
  - [ ] Apply defaults for unchecked features

---

## Phase 6: Frontend Development

- [ ] **Main Interface (index.html)**
  - [ ] **LLM Provider Section**
    - [ ] Provider selection (radio buttons):
      - [ ] Anthropic Claude
      - [ ] OpenAI GPT
      - [ ] Google Gemini
      - [ ] OpenRouter (400+ models)
    - [ ] API Key input (password field, required)
    - [ ] "Fetch Models" button
    - [ ] Help links for each provider's API key page
    - [ ] Security notice (keys never stored, used only for generation)
  - [ ] **Model Selection Section**
    - [ ] Model dropdown (populated after fetching)
    - [ ] Model description display
    - [ ] Cost information (if available)
  - [ ] **GitHub Deployment Section**
    - [ ] GitHub username input (required)
    - [ ] GitHub Personal Access Token input (password field, required)
    - [ ] Repository name input (required, auto-create if doesn't exist)
    - [ ] Help text with link to create GitHub PAT
    - [ ] Permissions required: 'repo', 'workflow'
  - [ ] **Presentation Details Section**
    - [ ] Conversational input textarea (describe your presentation)
    - [ ] Number of slides selector (5-30 range)
    - [ ] Audience type input
    - [ ] Tone selector (professional, casual, academic, inspiring, humorous)
  - [ ] **Advanced Options** (collapsible sections)
    - [ ] Custom system prompt editor
    - [ ] Custom user prompt template
    - [ ] Reveal.js features checkboxes (10 categories - see revealjs-features.md)
    - [ ] Theme preview with thumbnails
  - [ ] **Actions**
    - [ ] Generate Presentation button (prominent CTA)
    - [ ] Real-time progress display with stages
    - [ ] Result URL display with copy button
    - [ ] Preview button (optional)

- [ ] **Styling (styles.css)**
  - [ ] Clean, modern design
  - [ ] Responsive layout (mobile-first)
  - [ ] Accessible color contrast (WCAG AA)
  - [ ] Loading states and animations
  - [ ] Error state styling
  - [ ] Success state with clear CTAs
  - [ ] Checkbox groups with visual hierarchy
  - [ ] Collapsible sections for advanced options

- [ ] **Client-side Logic (app.js)**
  - [ ] **LLM Provider Management**
    - [ ] Provider configuration object (endpoints, auth methods)
    - [ ] Fetch models function for each provider
    - [ ] Populate model dropdown dynamically
    - [ ] Display model descriptions on selection
    - [ ] API key format validation per provider
  - [ ] **Form Validation**
    - [ ] Provider and API key required
    - [ ] Model selection required
    - [ ] GitHub credentials format validation (ghp_...)
    - [ ] Repository name validation (alphanumeric, hyphens, underscores)
    - [ ] Presentation topic validation (min length)
  - [ ] **Security**
    - [ ] Never log API keys or PATs
    - [ ] Clear sensitive data from memory after use
    - [ ] HTTPS-only transmission
    - [ ] Input sanitization
  - [ ] **UI State Management**
    - [ ] Enable/disable model dropdown based on fetch status
    - [ ] Loading indicators for async operations
    - [ ] Progress updates during generation
    - [ ] Dynamic Reveal.js checkbox state management
    - [ ] Collapsible sections toggle
  - [ ] **User Experience**
    - [ ] Copy-to-clipboard functionality
    - [ ] Form reset after successful generation
    - [ ] Error handling with clear messages
    - [ ] Helpful tooltips
    - [ ] Optional: Remember provider choice in localStorage (never keys!)

- [ ] **User Experience Enhancements**
  - [ ] Helpful tooltips for all features
  - [ ] Example prompts/templates
  - [ ] Preset configurations (quick start)
  - [ ] Keyboard shortcuts
  - [ ] Auto-save form state (localStorage)
  - [ ] Guided tour for first-time users

---

## Phase 7: Netlify Functions & API Routes

- [ ] **Netlify Configuration (netlify.toml)**
  - [ ] Define functions directory
  - [ ] Set build command and publish directory
  - [ ] Configure redirects and headers
  - [ ] Set function timeout limits
  - [ ] Environment variable references

- [ ] **Netlify Functions (Serverless Endpoints)**
  - [ ] `netlify/functions/generate-slides.js` - Full generation pipeline
    - Accept user inputs:
      - LLM provider, API key, model
      - GitHub credentials (username, PAT, repoName)
      - Presentation config (topic, audience, slides, tone)
      - Reveal.js settings and features
    - Validate all inputs
    - Generate slides using selected provider/model
    - Build Reveal.js presentation with selected features
    - Deploy to user's GitHub Pages (using their PAT)
    - Create repo if doesn't exist
    - Return deployment URL (username.github.io/repoName)
    - Never log or store sensitive credentials
  - [ ] `netlify/functions/fetch-models.js` - Fetch models for provider
    - Accept provider and API key
    - Call appropriate provider API
    - Return formatted models list
  - [ ] `netlify/functions/get-themes.js` - List available Reveal.js themes
  - [ ] `netlify/functions/get-features.js` - List all Reveal.js features
  - [ ] `netlify/functions/get-templates.js` - Get prompt templates

- [ ] **Progress Tracking**
  - [ ] Implement progress callback system
  - [ ] Use response streaming for real-time updates
  - [ ] Progress stages (generating, building, deploying, complete)
  - [ ] Error handling with recovery options

---

## Phase 8: Instructional Design Validation

- [ ] **Content Quality Checks**
  - [ ] Automated validation of bullet point count
  - [ ] Text-to-image ratio analysis
  - [ ] Reading level assessment
  - [ ] Learning objective clarity check
  - [ ] Slide progression logic validation

- [ ] **Speaker Notes Quality**
  - [ ] TED Talk structure verification
  - [ ] Storytelling elements present
  - [ ] Timing estimates included
  - [ ] Transition quality between slides
  - [ ] Audience engagement techniques

- [ ] **Accessibility Compliance**
  - [ ] Alt text for images
  - [ ] Proper heading hierarchy
  - [ ] Color contrast ratios
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility

---

## Phase 9: Testing & Quality Assurance

- [ ] **Unit Tests**
  - [ ] Prompt generation logic
  - [ ] Claude API integration
  - [ ] Reveal.js builder functions
  - [ ] GitHub deployment functions
  - [ ] Configuration validator

- [ ] **Integration Tests**
  - [ ] End-to-end generation pipeline
  - [ ] API endpoint responses
  - [ ] Error handling scenarios
  - [ ] Feature toggle combinations

- [ ] **User Testing**
  - [ ] Test with elementary school teacher (simplicity)
  - [ ] Test with PhD physicist (advanced features)
  - [ ] Test with various topics and audiences
  - [ ] Gather feedback on UX/UI
  - [ ] Test deployment success rate

- [ ] **Performance Testing**
  - [ ] Generation time benchmarks
  - [ ] Deployment time optimization
  - [ ] Concurrent user handling
  - [ ] API rate limit handling

---

## Phase 10: Documentation

- [ ] **User Documentation**
  - [ ] Quick start guide
  - [ ] Feature explanations
  - [ ] Best practices for writing prompts
  - [ ] Troubleshooting guide
  - [ ] FAQ section
  - [ ] Video tutorials (optional)

- [ ] **Developer Documentation**
  - [ ] Architecture overview
  - [ ] API documentation
  - [ ] Module documentation
  - [ ] Environment setup guide
  - [ ] Contributing guidelines
  - [ ] Code comments and JSDoc

- [ ] **Instructional Design Guide**
  - [ ] Embedded principles explanation
  - [ ] How the AI applies best practices
  - [ ] Customization for different learning contexts
  - [ ] Research references

---

## Phase 11: Netlify Deployment & DevOps

- [ ] **Netlify Production Setup**
  - [ ] Connect GitHub repository to Netlify
  - [ ] Configure build settings (build command, publish directory)
  - [ ] Set environment variables in Netlify dashboard
    - ANTHROPIC_API_KEY (app owner's Claude API key)
    - Note: User GitHub PATs come from user input, not env vars
  - [ ] Configure custom domain (optional)
  - [ ] Enable HTTPS (automatic with Netlify)

- [ ] **CI/CD Pipeline (Automatic with Netlify)**
  - [ ] Push to GitHub triggers automatic deployment
  - [ ] Deploy previews for pull requests
  - [ ] Production deployment on merge to main
  - [ ] Rollback via Netlify dashboard

- [ ] **Monitoring & Analytics**
  - [ ] Netlify Analytics (built-in)
  - [ ] Netlify Functions logs
  - [ ] Error tracking (Sentry integration, optional)
  - [ ] Performance monitoring
  - [ ] User feedback collection

---

## Phase 12: Advanced Features (Post-MVP)

- [ ] **Preview Before Deploy**
  - [ ] Local preview in iframe
  - [ ] Edit mode for generated slides
  - [ ] Regenerate individual slides

- [ ] **User Accounts & History**
  - [ ] User authentication
  - [ ] Save presentation history
  - [ ] Template library
  - [ ] Favorites and bookmarks

- [ ] **AI Image Generation**
  - [ ] Integrate DALL-E or Stable Diffusion
  - [ ] Auto-generate slide visuals
  - [ ] Image style consistency

- [ ] **Collaboration Features**
  - [ ] Multi-user editing
  - [ ] Comments and feedback
  - [ ] Version control for presentations

- [ ] **Analytics Dashboard**
  - [ ] Presentation view tracking
  - [ ] Slide engagement metrics
  - [ ] Speaker performance insights

- [ ] **Export Options**
  - [ ] PDF export
  - [ ] PowerPoint export
  - [ ] Video recording
  - [ ] Standalone HTML package

---

## Phase 13: Launch & Marketing

- [ ] **Soft Launch**
  - [ ] Beta testing with educators
  - [ ] Gather initial feedback
  - [ ] Refine based on user input

- [ ] **Public Launch**
  - [ ] Product Hunt submission
  - [ ] Social media announcement
  - [ ] Blog post about project
  - [ ] Demo video creation

- [ ] **Community Building**
  - [ ] Discord/Slack community
  - [ ] User showcase gallery
  - [ ] Monthly webinars
  - [ ] Template sharing platform

---

## Success Metrics

- **Usability**: Elementary teacher AND PhD physicist can use without confusion
- **Quality**: Generated slides follow all instructional design principles
- **Speaker Notes**: TED Talk quality with storytelling structure
- **Deployment**: GitHub Pages deployment works 99%+ of time
- **Speed**: Full generation + deployment in under 3 minutes
- **Satisfaction**: User feedback score > 4.5/5

---

## Current Status: Planning Complete, Ready to Build

**Next Immediate Steps:**
1. Initialize project structure
2. Install dependencies
3. Set up environment configuration
4. Begin prompt engineering (most critical phase)

---

## Notes & Decisions

- Single-page application (SPA) approach - no complex routing needed
- Vanilla JavaScript for frontend (no React/Vue needed for this scope)
- **Netlify for main application hosting** (serverless, auto-scaling, easy deployment)
- **GitHub Pages for generated presentations** (user owns content, version controlled)
- Netlify Functions replace Express server (serverless architecture)
- Claude Sonnet 4.5 for generation (best balance of quality and speed)
- Markdown-first approach (easier to edit and version control)
- Each presentation = separate GitHub repo deployed to GitHub Pages

### Multi-LLM & Multi-User Architecture
- **No accounts/database** - Completely stateless application
- **User provides ALL credentials**:
  - LLM provider API key (Anthropic, OpenAI, Gemini, or OpenRouter)
  - GitHub PAT for deployment
- **Dynamic model fetching** - Get available models from provider API
- **User owns everything** - API usage billed to their account, presentations in their GitHub
- **App owner provides** - Nothing! Zero infrastructure costs for API usage
- **Security** - All credentials transmitted over HTTPS, processed in-memory only
- **Privacy** - No user data, API keys, or PATs stored anywhere

---

## Research References

- Cognitive Load Theory (Sweller, 1988)
- Multimedia Learning Principles (Mayer, 2001)
- Presentation Zen (Reynolds, 2008)
- TED Speaker Guide (official)
- Nancy Duarte's presentation structure research
- Evidence-based presentation design (UCSD Blink)

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Status**: Ready to Execute
