# Multi-LLM Provider Integration

**Last Updated**: 2025-11-01
**Supported Providers**: Anthropic, OpenAI, Google Gemini, OpenRouter

---

## Architecture Overview

```
User enters API key for provider
    ↓
Fetch available models from provider API
    ↓
Display models in dropdown for user selection
    ↓
User selects model + configures presentation
    ↓
Generate slides using selected model
```

---

## Provider 1: Anthropic Claude

### API Endpoint
```
https://api.anthropic.com/v1/
```

### Authentication
```javascript
{
  headers: {
    'x-api-key': 'sk-ant-...',
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  }
}
```

### Available Models (as of 2025-11-01)
- `claude-sonnet-4-5-20250929` - Latest Sonnet 4.5 (most powerful)
- `claude-sonnet-4-20250514` - Sonnet 4
- `claude-3-7-sonnet-20250219` - Claude 3.7 Sonnet
- `claude-3-5-sonnet-20241022` - Claude 3.5 Sonnet
- `claude-3-5-haiku-20241022` - Claude 3.5 Haiku (fastest)
- `claude-3-opus-20240229` - Claude 3 Opus (legacy)

### How to Get Models List
Anthropic doesn't provide a models list endpoint. Use hardcoded list above (updated via documentation).

### SDK Usage
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: userProvidedKey
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 8000,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }]
});
```

### Cost Considerations
- Sonnet 4.5: Best quality, moderate cost
- Haiku: Fastest, lowest cost
- Input tokens cheaper than output tokens

---

## Provider 2: OpenAI

### API Endpoint
```
https://api.openai.com/v1/
```

### Authentication
```javascript
{
  headers: {
    'Authorization': 'Bearer sk-...',
    'Content-Type': 'application/json'
  }
}
```

### Models List Endpoint
```
GET https://api.openai.com/v1/models
```

### Available Models (GPT-4, GPT-4 Turbo, GPT-3.5, etc.)
Models are fetched dynamically. Key models include:
- `gpt-4-turbo` - Latest GPT-4 Turbo
- `gpt-4` - Standard GPT-4
- `gpt-4o` - GPT-4 Optimized
- `gpt-4o-mini` - Smaller, faster GPT-4o
- `gpt-3.5-turbo` - Fast and cost-effective
- `o1-preview` - Reasoning model
- `o1-mini` - Smaller reasoning model

### SDK Usage
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: userProvidedKey
});

// Get models list
const modelsList = await openai.models.list();

// Generate content
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  max_tokens: 8000
});
```

### Response Format
```javascript
{
  choices: [{
    message: {
      content: "Generated markdown slides..."
    }
  }]
}
```

---

## Provider 3: Google Gemini

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/
```

### Authentication
```
API Key as query parameter: ?key=AIza...
```

### Models List Endpoint
```
GET https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY
```

### Available Models (2025)
- `gemini-2.5-pro` - Most powerful, adaptive thinking
- `gemini-2.5-flash` - Fast, high-performance
- `gemini-2.5-flash-lite` - Fastest, low-cost
- `gemini-exp-1206` - Experimental advanced model
- `gemini-2.0-flash-thinking-exp` - Reasoning mode

Legacy (retired):
- ~~gemini-1.5-pro~~ (use 2.5 instead)
- ~~gemini-1.5-flash~~ (use 2.5 instead)
- ~~gemini-1.0-pro~~ (deprecated)

### SDK Usage
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(userProvidedKey);

// Get models list
const modelsResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${userProvidedKey}`
);
const modelsData = await modelsResponse.json();

// Generate content
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

const result = await model.generateContent([
  { text: systemPrompt },
  { text: userPrompt }
]);

const response = result.response.text();
```

### Response Format
```javascript
{
  response: {
    text: () => "Generated markdown slides..."
  }
}
```

---

## Provider 4: OpenRouter

### API Endpoint
```
https://openrouter.ai/api/v1/
```

### Authentication
```javascript
{
  headers: {
    'Authorization': 'Bearer sk-or-v1-...',
    'HTTP-Referer': 'https://your-app-url.com', // Optional
    'X-Title': 'AI Slides Generator' // Optional
  }
}
```

### Models List Endpoint
```
GET https://openrouter.ai/api/v1/models
```

### Available Models (400+)
OpenRouter aggregates models from multiple providers:

#### Anthropic Models (via OpenRouter)
- `anthropic/claude-sonnet-4-5`
- `anthropic/claude-3.5-sonnet`
- `anthropic/claude-3-opus`

#### OpenAI Models (via OpenRouter)
- `openai/gpt-4-turbo`
- `openai/gpt-4o`
- `openai/gpt-3.5-turbo`

#### Google Models (via OpenRouter)
- `google/gemini-2.5-pro`
- `google/gemini-2.5-flash`

#### Meta Models
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-3.1-405b-instruct`

#### Mistral Models
- `mistralai/mistral-large`
- `mistralai/mixtral-8x22b-instruct`

#### Perplexity Models
- `perplexity/llama-3.1-sonar-huge-128k-online`

#### And many more...

### SDK Usage (OpenAI-compatible)
```javascript
import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: userProvidedKey,
  baseURL: 'https://openrouter.ai/api/v1'
});

// Get models list
const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
  headers: {
    'Authorization': `Bearer ${userProvidedKey}`
  }
});
const modelsData = await modelsResponse.json();

// Generate content
const completion = await openrouter.chat.completions.create({
  model: 'anthropic/claude-sonnet-4-5',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
});
```

### Response Format
OpenAI-compatible format:
```javascript
{
  choices: [{
    message: {
      content: "Generated markdown slides..."
    }
  }]
}
```

### Pricing
- OpenRouter shows real-time pricing in models list
- Pay-as-you-go with credits
- Some free models available (with rate limits)

---

## Implementation Strategy

### 1. User Flow

```
Step 1: Select LLM Provider
  └─ Radio buttons: [ ] Anthropic  [ ] OpenAI  [ ] Google Gemini  [ ] OpenRouter

Step 2: Enter API Key
  └─ Input field with validation

Step 3: Fetch Models (automatically)
  └─ Loading indicator → Populate dropdown

Step 4: Select Model
  └─ Dropdown with model names + descriptions

Step 5: Configure & Generate
  └─ Presentation settings + Generate button
```

### 2. Frontend Implementation

```html
<!-- Provider Selection -->
<div class="provider-section">
  <h3>Choose AI Provider</h3>

  <label>
    <input type="radio" name="provider" value="anthropic">
    Anthropic Claude
  </label>

  <label>
    <input type="radio" name="provider" value="openai">
    OpenAI GPT
  </label>

  <label>
    <input type="radio" name="provider" value="google">
    Google Gemini
  </label>

  <label>
    <input type="radio" name="provider" value="openrouter">
    OpenRouter (400+ models)
  </label>
</div>

<!-- API Key Input -->
<div class="api-key-section">
  <label for="apiKey">API Key</label>
  <input type="password"
         id="apiKey"
         name="apiKey"
         placeholder="Enter your API key..."
         required>
  <button type="button" id="fetchModels">Fetch Models</button>
</div>

<!-- Model Selection -->
<div class="model-section">
  <label for="model">Select Model</label>
  <select id="model" name="model" disabled>
    <option>Fetch models first...</option>
  </select>
  <small id="modelInfo"></small>
</div>
```

### 3. Client-side Logic

```javascript
// app.js
const providerConfig = {
  anthropic: {
    name: 'Anthropic',
    modelsEndpoint: null, // Hardcoded list
    authHeader: 'x-api-key',
    models: [
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', description: 'Most powerful' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest' }
    ]
  },
  openai: {
    name: 'OpenAI',
    modelsEndpoint: 'https://api.openai.com/v1/models',
    authHeader: 'Authorization',
    authPrefix: 'Bearer '
  },
  google: {
    name: 'Google Gemini',
    modelsEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    authType: 'query', // API key in query param
    paramName: 'key'
  },
  openrouter: {
    name: 'OpenRouter',
    modelsEndpoint: 'https://openrouter.ai/api/v1/models',
    authHeader: 'Authorization',
    authPrefix: 'Bearer '
  }
};

// Fetch models when provider or API key changes
document.getElementById('fetchModels').addEventListener('click', async () => {
  const provider = document.querySelector('input[name="provider"]:checked').value;
  const apiKey = document.getElementById('apiKey').value;

  if (!provider || !apiKey) {
    alert('Please select provider and enter API key');
    return;
  }

  try {
    const models = await fetchModelsForProvider(provider, apiKey);
    populateModelDropdown(models);
  } catch (error) {
    alert('Error fetching models: ' + error.message);
  }
});

async function fetchModelsForProvider(provider, apiKey) {
  const config = providerConfig[provider];

  // Anthropic: Use hardcoded list
  if (provider === 'anthropic') {
    return config.models;
  }

  // Google: API key in query param
  if (provider === 'google') {
    const response = await fetch(`${config.modelsEndpoint}?key=${apiKey}`);
    const data = await response.json();
    return data.models.map(m => ({
      id: m.name.replace('models/', ''),
      name: m.displayName,
      description: m.description
    }));
  }

  // OpenAI & OpenRouter: Bearer token
  const headers = {
    [config.authHeader]: `${config.authPrefix}${apiKey}`
  };

  const response = await fetch(config.modelsEndpoint, { headers });
  const data = await response.json();

  return data.data.map(m => ({
    id: m.id,
    name: m.id,
    description: m.description || ''
  }));
}

function populateModelDropdown(models) {
  const select = document.getElementById('model');
  select.innerHTML = '';
  select.disabled = false;

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.name;
    option.dataset.description = model.description;
    select.appendChild(option);
  });

  // Show description on change
  select.addEventListener('change', (e) => {
    const description = e.target.selectedOptions[0].dataset.description;
    document.getElementById('modelInfo').textContent = description;
  });
}
```

### 4. Backend (Netlify Function)

```javascript
// netlify/functions/generate-slides.js
exports.handler = async (event) => {
  const {
    provider,
    apiKey,
    model,
    systemPrompt,
    userPrompt,
    // ... other config
  } = JSON.parse(event.body);

  let generatedContent;

  switch(provider) {
    case 'anthropic':
      generatedContent = await generateWithAnthropic(apiKey, model, systemPrompt, userPrompt);
      break;
    case 'openai':
      generatedContent = await generateWithOpenAI(apiKey, model, systemPrompt, userPrompt);
      break;
    case 'google':
      generatedContent = await generateWithGemini(apiKey, model, systemPrompt, userPrompt);
      break;
    case 'openrouter':
      generatedContent = await generateWithOpenRouter(apiKey, model, systemPrompt, userPrompt);
      break;
  }

  // Continue with reveal.js build and deployment...
};

async function generateWithAnthropic(apiKey, model, systemPrompt, userPrompt) {
  const Anthropic = require('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  return message.content[0].text;
}

async function generateWithOpenAI(apiKey, model, systemPrompt, userPrompt) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: 8000
  });

  return completion.choices[0].message.content;
}

async function generateWithGemini(apiKey, model, systemPrompt, userPrompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });

  const result = await geminiModel.generateContent([
    { text: systemPrompt },
    { text: userPrompt }
  ]);

  return result.response.text();
}

async function generateWithOpenRouter(apiKey, model, systemPrompt, userPrompt) {
  const OpenAI = require('openai');
  const openrouter = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  const completion = await openrouter.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return completion.choices[0].message.content;
}
```

---

## Required NPM Packages

```bash
npm install @anthropic-ai/sdk openai @google/generative-ai
```

### Package Details
- `@anthropic-ai/sdk` - Anthropic Claude SDK
- `openai` - OpenAI SDK (also works for OpenRouter)
- `@google/generative-ai` - Google Gemini SDK

---

## Security Considerations

### Client-Side
- Never log API keys
- Clear keys from memory after use
- Validate key format before sending
- Use HTTPS only

### Server-Side
- Don't store user API keys
- Process keys in-memory only
- Don't include keys in logs
- Rate limit requests

### User Education
- Provide clear instructions on API key permissions
- Link to provider documentation
- Warn about costs
- Recommend separate keys for testing

---

## Error Handling

```javascript
try {
  const models = await fetchModels(provider, apiKey);
} catch (error) {
  if (error.status === 401) {
    return 'Invalid API key';
  }
  if (error.status === 429) {
    return 'Rate limit exceeded';
  }
  if (error.status === 403) {
    return 'API key lacks required permissions';
  }
  return 'Error fetching models: ' + error.message;
}
```

---

## Cost Optimization

### Recommendations by Use Case

**Best Quality**
- Anthropic Claude Sonnet 4.5
- OpenAI GPT-4 Turbo
- Google Gemini 2.5 Pro

**Best Speed**
- Anthropic Claude 3.5 Haiku
- OpenAI GPT-4o-mini
- Google Gemini 2.5 Flash Lite

**Best Value**
- Google Gemini 2.5 Flash
- OpenAI GPT-3.5 Turbo
- OpenRouter (various free models)

---

## Testing Checklist

- [ ] Provider selection works
- [ ] API key validation for each provider
- [ ] Models list fetched successfully
- [ ] Model dropdown populated correctly
- [ ] Generation works with each provider
- [ ] Error handling for invalid keys
- [ ] Error handling for rate limits
- [ ] Cost display (if available)
- [ ] Model descriptions shown
- [ ] Secure key handling

---

**Last Updated**: 2025-11-01
