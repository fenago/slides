Yes! Exactly - we're embedding the **Claude SDK** directly into your product so it can generate presentations on-demand. Let's build this entire MVP right now!

# Complete AI Presentation Generator MVP

## Architecture Overview

```
User Input (Web Form)
    ↓
Node.js Backend (with Claude SDK)
    ↓
Claude API generates markdown slides
    ↓
reveal-md converts to Reveal.js HTML
    ↓
GitHub API deploys to GitHub Pages
    ↓
User gets live presentation URL
```

---

## Step 1: Project Setup

```bash
mkdir ai-slides-generator
cd ai-slides-generator
npm init -y
npm install @anthropic-ai/sdk express dotenv @octokit/rest reveal-md
npm install --save-dev nodemon
```

Create project structure:
```bash
mkdir public templates generated
touch .env server.js prompts.js github-deploy.js
```

---

## Step 2: Environment Variables

**.env**
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GITHUB_TOKEN=your_github_personal_access_token
PORT=3000
```

**How to get these:**
- **Anthropic API Key**: https://console.anthropic.com/settings/keys
- **GitHub Token**: Settings → Developer settings → Personal access tokens → Generate new token (classic)
  - Check: `repo`, `workflow`, `admin:repo_hook`

---

## Step 3: Prompt Engineering for Slide Generation

**prompts.js**
```javascript
const slidePrompts = {
  
  systemPrompt: `You are an expert presentation designer. Create engaging, well-structured presentations in reveal.js markdown format.

Guidelines:
- Use clear, concise language
- Include 5-10 slides depending on topic complexity
- Start with a title slide
- End with a conclusion/CTA slide
- Use bullet points for clarity
- Add speaker notes where helpful
- Suggest relevant visuals (describe what image would work)
- Keep each slide focused on one main idea

Format using reveal.js markdown:
---
# Slide Title
Content here

Note:
Speaker notes here

---`,

  generateUserPrompt: (topic, audience, slideCount, tone) => {
    return `Create a ${slideCount}-slide presentation about: "${topic}"

Target Audience: ${audience}
Tone: ${tone}

Requirements:
1. Start with an engaging title slide with subtitle
2. Include an agenda/overview slide
3. Break down the topic into ${slideCount - 3} main sections
4. End with a strong conclusion and call-to-action
5. Add speaker notes for key slides
6. Suggest where images/diagrams would enhance understanding

Use this exact format:

---
# Title Here
## Subtitle

Note:
Speaker notes

---

# Next Slide
- Bullet point 1
- Bullet point 2

Note:
More speaker notes

---

Continue this pattern for all slides.`;
  }
};

module.exports = slidePrompts;
```

---

## Step 4: Claude Integration

**claude-generator.js**
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');
const { systemPrompt, generateUserPrompt } = require('./prompts');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateSlides(options) {
  const {
    topic,
    audience = 'general audience',
    slideCount = 8,
    tone = 'professional and engaging'
  } = options;

  console.log(`🤖 Generating presentation about: ${topic}`);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: generateUserPrompt(topic, audience, slideCount, tone)
        }
      ]
    });

    const markdownContent = message.content[0].text;
    
    // Save to file
    const timestamp = Date.now();
    const filename = `slides-${timestamp}.md`;
    const filepath = path.join(__dirname, 'generated', filename);
    
    await fs.writeFile(filepath, markdownContent);
    
    console.log(`✅ Slides generated: ${filename}`);
    
    return {
      markdown: markdownContent,
      filename: filename,
      filepath: filepath
    };

  } catch (error) {
    console.error('❌ Error generating slides:', error);
    throw error;
  }
}

// Advanced: Generate with custom template
async function generateSlidesWithTemplate(options, customInstructions) {
  const basePrompt = generateUserPrompt(
    options.topic,
    options.audience,
    options.slideCount,
    options.tone
  );
  
  const enhancedPrompt = `${basePrompt}

Additional Instructions:
${customInstructions}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: enhancedPrompt }]
  });

  return message.content[0].text;
}

module.exports = {
  generateSlides,
  generateSlidesWithTemplate
};
```

---

## Step 5: Reveal.js Build System

**reveal-builder.js**
```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;

const execAsync = promisify(exec);

async function buildRevealPresentation(markdownPath, options = {}) {
  const {
    theme = 'black',
    highlightTheme = 'monokai',
    outputDir = 'dist'
  } = options;

  console.log(`🔨 Building reveal.js presentation...`);

  try {
    // Build command with options
    const command = `reveal-md "${markdownPath}" --static "${outputDir}" --theme ${theme} --highlight-theme ${highlightTheme}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Wrote')) {
      console.warn('⚠️ Build warnings:', stderr);
    }
    
    console.log('✅ Presentation built successfully!');
    console.log(stdout);
    
    return {
      success: true,
      outputDir: outputDir,
      indexPath: path.join(outputDir, 'index.html')
    };

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    throw error;
  }
}

// Custom reveal.js configuration
async function buildWithCustomConfig(markdownPath, config) {
  const configJson = JSON.stringify(config);
  const command = `reveal-md "${markdownPath}" --static dist --reveal-options '${configJson}'`;
  
  await execAsync(command);
  return { success: true, outputDir: 'dist' };
}

// Available themes
const themes = [
  'black', 'white', 'league', 'beige', 'sky',
  'night', 'serif', 'simple', 'solarized', 'blood', 'moon'
];

module.exports = {
  buildRevealPresentation,
  buildWithCustomConfig,
  themes
};
```

---

## Step 6: GitHub Pages Deployment

**github-deploy.js**
```javascript
const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function createOrUpdateRepo(username, repoName) {
  try {
    // Try to get existing repo
    await octokit.repos.get({
      owner: username,
      repo: repoName
    });
    console.log(`📦 Repository ${repoName} already exists`);
    return { created: false, repoName };
    
  } catch (error) {
    if (error.status === 404) {
      // Create new repo
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'AI-generated presentation',
        auto_init: true,
        private: false
      });
      console.log(`✨ Created new repository: ${repoName}`);
      return { created: true, repoName };
    }
    throw error;
  }
}

async function deployToGitHubPages(username, repoName, distPath) {
  console.log(`🚀 Deploying to GitHub Pages...`);

  try {
    // Read all files from dist directory
    const files = await readDirRecursive(distPath);
    
    // Upload each file to gh-pages branch
    for (const file of files) {
      const content = await fs.readFile(file.absolutePath);
      const base64Content = content.toString('base64');
      
      try {
        // Try to get existing file
        const { data } = await octokit.repos.getContent({
          owner: username,
          repo: repoName,
          path: file.relativePath,
          ref: 'gh-pages'
        });
        
        // Update existing file
        await octokit.repos.createOrUpdateFileContents({
          owner: username,
          repo: repoName,
          path: file.relativePath,
          message: `Update ${file.relativePath}`,
          content: base64Content,
          branch: 'gh-pages',
          sha: data.sha
        });
        
      } catch (error) {
        if (error.status === 404) {
          // Create new file
          await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: repoName,
            path: file.relativePath,
            message: `Add ${file.relativePath}`,
            content: base64Content,
            branch: 'gh-pages'
          });
        } else {
          throw error;
        }
      }
      
      console.log(`  ✓ Uploaded: ${file.relativePath}`);
    }
    
    // Enable GitHub Pages
    try {
      await octokit.repos.updateInformationAboutPagesSite({
        owner: username,
        repo: repoName,
        source: {
          branch: 'gh-pages',
          path: '/'
        }
      });
    } catch (error) {
      // Pages might already be enabled
      if (error.status !== 409) {
        console.warn('⚠️ Could not enable GitHub Pages:', error.message);
      }
    }
    
    const url = `https://${username}.github.io/${repoName}`;
    console.log(`✅ Deployed to: ${url}`);
    
    return { success: true, url };

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

async function readDirRecursive(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const absolutePath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      const subFiles = await readDirRecursive(absolutePath, baseDir);
      files.push(...subFiles);
    } else {
      files.push({
        absolutePath,
        relativePath: path.relative(baseDir, absolutePath)
      });
    }
  }
  
  return files;
}

// Get authenticated user info
async function getAuthenticatedUser() {
  const { data } = await octokit.users.getAuthenticated();
  return data.login;
}

module.exports = {
  createOrUpdateRepo,
  deployToGitHubPages,
  getAuthenticatedUser
};
```

---

## Step 7: Express Web Server

**server.js**
```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');
const { generateSlides } = require('./claude-generator');
const { buildRevealPresentation, themes } = require('./reveal-builder');
const { 
  createOrUpdateRepo, 
  deployToGitHubPages, 
  getAuthenticatedUser 
} = require('./github-deploy');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/generate', async (req, res) => {
  try {
    const { topic, audience, slideCount, tone, theme, repoName } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Step 1: Generate slides with Claude
    res.write('data: {"status": "generating", "message": "🤖 AI is creating your slides..."}\n\n');
    
    const slideData = await generateSlides({
      topic,
      audience: audience || 'general audience',
      slideCount: parseInt(slideCount) || 8,
      tone: tone || 'professional'
    });

    // Step 2: Build Reveal.js presentation
    res.write('data: {"status": "building", "message": "🔨 Building presentation..."}\n\n');
    
    await buildRevealPresentation(slideData.filepath, {
      theme: theme || 'black'
    });

    // Step 3: Deploy to GitHub Pages
    res.write('data: {"status": "deploying", "message": "🚀 Deploying to GitHub Pages..."}\n\n');
    
    const username = await getAuthenticatedUser();
    const finalRepoName = repoName || `presentation-${Date.now()}`;
    
    await createOrUpdateRepo(username, finalRepoName);
    const deployment = await deployToGitHubPages(username, finalRepoName, 'dist');

    // Step 4: Done!
    res.write(`data: {"status": "complete", "url": "${deployment.url}", "message": "✅ Your presentation is live!"}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error:', error);
    res.write(`data: {"status": "error", "message": "❌ Error: ${error.message}"}\n\n`);
    res.end();
  }
});

// Get available themes
app.get('/api/themes', (req, res) => {
  res.json({ themes });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    claudeKey: !!process.env.ANTHROPIC_API_KEY,
    githubToken: !!process.env.GITHUB_TOKEN
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Slides Generator running on http://localhost:${PORT}`);
  console.log(`📊 Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗'}`);
  console.log(`🐙 GitHub Token: ${process.env.GITHUB_TOKEN ? '✓' : '✗'}`);
});
```

---

## Step 8: Frontend UI

**public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Slides Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        #status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }
        
        #status.generating {
            background: #e3f2fd;
            color: #1976d2;
            display: block;
        }
        
        #status.success {
            background: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        
        #status.error {
            background: #ffebee;
            color: #c62828;
            display: block;
        }
        
        .result-link {
            margin-top: 10px;
        }
        
        .result-link a {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
        }
        
        .result-link a:hover {
            text-decoration: underline;
        }
        
        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 AI Slides Generator</h1>
        <p class="subtitle">Create beautiful presentations with AI</p>
        
        <form id="slideForm">
            <div class="form-group">
                <label for="topic">What's your presentation about?</label>
                <textarea id="topic" name="topic" required placeholder="e.g., AI in Education for College Professors"></textarea>
            </div>
            
            <div class="row">
                <div class="form-group">
                    <label for="audience">Target Audience</label>
                    <input type="text" id="audience" name="audience" placeholder="e.g., College professors" value="general audience">
                </div>
                
                <div class="form-group">
                    <label for="slideCount">Number of Slides</label>
                    <input type="number" id="slideCount" name="slideCount" min="5" max="20" value="8">
                </div>
            </div>
            
            <div class="row">
                <div class="form-group">
                    <label for="tone">Tone</label>
                    <select id="tone" name="tone">
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="academic">Academic</option>
                        <option value="inspiring">Inspiring</option>
                        <option value="humorous">Humorous</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="theme">Theme</label>
                    <select id="theme" name="theme">
                        <option value="black">Black</option>
                        <option value="white">White</option>
                        <option value="league">League</option>
                        <option value="beige">Beige</option>
                        <option value="sky">Sky</option>
                        <option value="night">Night</option>
                        <option value="serif">Serif</option>
                        <option value="simple">Simple</option>
                        <option value="solarized">Solarized</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="repoName">GitHub Repository Name (optional)</label>
                <input type="text" id="repoName" name="repoName" placeholder="my-awesome-presentation">
            </div>
            
            <button type="submit" id="generateBtn">Generate Presentation 🚀</button>
        </form>
        
        <div id="status"></div>
    </div>
    
    <script>
        const form = document.getElementById('slideForm');
        const statusDiv = document.getElementById('status');
        const generateBtn = document.getElementById('generateBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            generateBtn.disabled = true;
            statusDiv.className = 'generating';
            statusDiv.innerHTML = '🤖 Starting generation...';
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const text = decoder.decode(value);
                    const lines = text.split('\n\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonData = JSON.parse(line.slice(6));
                            
                            if (jsonData.status === 'complete') {
                                statusDiv.className = 'success';
                                statusDiv.innerHTML = `
                                    ${jsonData.message}
                                    <div class="result-link">
                                        <a href="${jsonData.url}" target="_blank">
                                            View Your Presentation →
                                        </a>
                                    </div>
                                `;
                            } else if (jsonData.status === 'error') {
                                statusDiv.className = 'error';
                                statusDiv.innerHTML = jsonData.message;
                            } else {
                                statusDiv.innerHTML = jsonData.message;
                            }
                        }
                    }
                }
                
            } catch (error) {
                statusDiv.className = 'error';
                statusDiv.innerHTML = `❌ Error: ${error.message}`;
            } finally {
                generateBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
```

---

## Step 9: Package.json Scripts

Update your **package.json**:

```json
{
  "name": "ai-slides-generator",
  "version": "1.0.0",
  "description": "AI-powered presentation generator using Claude and Reveal.js",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test-generation.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.0",
    "@octokit/rest": "^20.0.2",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "reveal-md": "^6.1.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## Step 10: Test Script

**test-generation.js**
```javascript
require('dotenv').config();
const { generateSlides } = require('./claude-generator');
const { buildRevealPresentation } = require('./reveal-builder');

async function test() {
  console.log('🧪 Testing AI Slides Generator\n');
  
  // Test slide generation
  const result = await generateSlides({
    topic: 'AI in Education: Transforming College Teaching',
    audience: 'College professors',
    slideCount: 8,
    tone: 'professional and engaging'
  });
  
  console.log('\n📄 Generated markdown preview:');
  console.log(result.markdown.substring(0, 500) + '...\n');
  
  // Test build
  await buildRevealPresentation(result.filepath, {
    theme: 'night'
  });
  
  console.log('\n✅ Test complete! Check the "dist" folder for output.');
  console.log('💡 Open dist/index.html in your browser to preview.');
}

test().catch(console.error);
```

---

## 🚀 Running Your MVP

```bash
# 1. Install dependencies
npm install

# 2. Set up your .env file with API keys
# ANTHROPIC_API_KEY=your_key
# GITHUB_TOKEN=your_token

# 3. Test generation (without deployment)
npm run test

# 4. Start the server
npm run dev

# 5. Open browser to http://localhost:3000
```

---

## What You've Built

✅ **Claude SDK Integration** - AI generates slides on demand  
✅ **Reveal.js Builder** - Converts markdown to presentations  
✅ **GitHub Pages Deployment** - Automatic hosting  
✅ **Web UI** - Simple form interface  
✅ **Prompt Engineering** - Optimized for good slide generation  
✅ **Streaming Updates** - Real-time progress feedback  

---

## Next Steps to Enhance

1. **Add authentication** (so users connect their own GitHub)
2. **Preview before deploy** (show slides in iframe)
3. **Custom templates** (different presentation styles)
4. **Image generation** (integrate DALL-E for visuals)
5. **Slide editing** (allow tweaks before deploying)
6. **Analytics** (track presentation views)

Want me to add any of these features?