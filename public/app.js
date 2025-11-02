// AI Slides Generator - Client-side Logic

// Provider configuration
const providerConfig = {
  anthropic: {
    name: 'Anthropic Claude',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    models: [
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', description: 'Most powerful, latest model' },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Excellent for complex tasks' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Fast and capable' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest, most cost-effective' }
    ]
  },
  openai: {
    name: 'OpenAI GPT',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    modelsEndpoint: 'https://api.openai.com/v1/models',
    authHeader: 'Authorization',
    authPrefix: 'Bearer '
  },
  google: {
    name: 'Google Gemini',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    modelsEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    authType: 'query'
  },
  openrouter: {
    name: 'OpenRouter',
    apiKeyUrl: 'https://openrouter.ai/keys',
    modelsEndpoint: 'https://openrouter.ai/api/v1/models',
    authHeader: 'Authorization',
    authPrefix: 'Bearer '
  }
};

// DOM Elements
const form = document.getElementById('slideForm');
const providerRadios = document.querySelectorAll('input[name="provider"]');
const apiKeyInput = document.getElementById('apiKey');
const apiKeyLink = document.getElementById('apiKeyLink');
const modelSelect = document.getElementById('model');
const modelInfo = document.getElementById('modelInfo');
const fetchModelsBtn = document.getElementById('fetchModels');
const generateBtn = document.getElementById('generateBtn');
const testModeCheckbox = document.getElementById('testMode');

const status = document.getElementById('status');
const statusMessage = document.getElementById('statusMessage');
const progressFill = document.getElementById('progressFill');

const result = document.getElementById('result');
const resultURL = document.getElementById('resultURL');
const copyURLBtn = document.getElementById('copyURL');
const viewPresentationBtn = document.getElementById('viewPresentation');
const downloadMarkdownBtn = document.getElementById('downloadMarkdown');
const createAnotherBtn = document.getElementById('createAnother');
const resultDetails = document.getElementById('resultDetails');

let generatedMarkdown = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Restore provider selection from localStorage
  const savedProvider = localStorage.getItem('selectedProvider');
  if (savedProvider && document.querySelector(`input[value="${savedProvider}"]`)) {
    document.querySelector(`input[value="${savedProvider}"]`).checked = true;
    updateAPIKeyLink(savedProvider);
  }

  // Enable collapsible sections by default
  document.querySelectorAll('.collapsible').forEach(section => {
    section.classList.add('expanded');
  });
});

// Provider selection handler
providerRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    const provider = e.target.value;
    updateAPIKeyLink(provider);
    modelSelect.innerHTML = '<option value="">Enter API key and click "Fetch Models"</option>';
    modelSelect.disabled = true;
    fetchModelsBtn.disabled = true;
    modelInfo.textContent = '';

    // Save to localStorage
    localStorage.setItem('selectedProvider', provider);
  });
});

// API key input handler
apiKeyInput.addEventListener('input', () => {
  const provider = getSelectedProvider();
  const hasApiKey = apiKeyInput.value.trim().length > 0;

  if (provider && hasApiKey) {
    fetchModelsBtn.disabled = false;
  } else {
    fetchModelsBtn.disabled = true;
  }
});

// Fetch models button handler
fetchModelsBtn.addEventListener('click', async () => {
  const provider = getSelectedProvider();
  const apiKey = apiKeyInput.value.trim();

  if (!provider || !apiKey) {
    alert('Please select a provider and enter your API key');
    return;
  }

  fetchModelsBtn.disabled = true;
  fetchModelsBtn.textContent = 'Fetching...';
  modelSelect.innerHTML = '<option value="">Loading models...</option>';

  try {
    const models = await fetchModelsForProvider(provider, apiKey);
    populateModelDropdown(models);
    fetchModelsBtn.textContent = '✓ Models Loaded';
    setTimeout(() => {
      fetchModelsBtn.textContent = 'Fetch Models';
      fetchModelsBtn.disabled = false;
    }, 2000);
  } catch (error) {
    alert('Error fetching models: ' + error.message);
    modelSelect.innerHTML = '<option value="">Error loading models</option>';
    fetchModelsBtn.textContent = 'Retry';
    fetchModelsBtn.disabled = false;
  }
});

// Model selection handler
modelSelect.addEventListener('change', (e) => {
  const selectedOption = e.target.selectedOptions[0];
  const description = selectedOption.dataset.description;
  modelInfo.textContent = description || '';
});

// Test mode handler
testModeCheckbox.addEventListener('change', (e) => {
  const isTestMode = e.target.checked;

  // Disable/enable provider and GitHub sections
  document.querySelectorAll('input[name="provider"]').forEach(input => {
    input.disabled = isTestMode;
  });

  apiKeyInput.disabled = isTestMode;
  modelSelect.disabled = isTestMode || !modelSelect.options.length;
  fetchModelsBtn.disabled = isTestMode;

  document.getElementById('githubUsername').disabled = isTestMode;
  document.getElementById('githubPAT').disabled = isTestMode;
  document.getElementById('repoName').disabled = isTestMode;

  if (isTestMode) {
    apiKeyInput.required = false;
    modelSelect.required = false;
    document.getElementById('githubUsername').required = false;
    document.getElementById('githubPAT').required = false;
    document.getElementById('repoName').required = false;
  } else {
    apiKeyInput.required = true;
    modelSelect.required = true;
    document.getElementById('githubUsername').required = true;
    document.getElementById('githubPAT').required = true;
    document.getElementById('repoName').required = true;
  }
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Add checkboxes
  data.controls = form.controls.checked;
  data.progress = form.progress.checked;
  data.slideNumber = form.slideNumber.checked;
  data.center = form.center.checked;
  data.hash = form.hash.checked;
  data.testMode = testModeCheckbox.checked;

  // Validate
  if (!data.topic || data.topic.trim().length < 10) {
    alert('Please provide a detailed topic description (at least 10 characters)');
    return;
  }

  if (!data.testMode) {
    if (!data.provider || !data.apiKey || !data.model) {
      alert('Please select a provider, enter your API key, and select a model');
      return;
    }

    if (!data.githubUsername || !data.githubPAT || !data.repoName) {
      alert('Please provide all GitHub credentials');
      return;
    }
  }

  // Show status
  showStatus('Initializing...');
  hideResult();

  try {
    // Call the API
    updateProgress(10, 'Generating slides with AI...');

    const response = await fetch('/.netlify/functions/generate-slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    updateProgress(50, 'Building Reveal.js presentation...');

    const resultData = await response.json();

    updateProgress(90, 'Finalizing...');

    if (!resultData.success) {
      throw new Error(resultData.error || 'Unknown error');
    }

    // Store markdown
    generatedMarkdown = resultData.data.markdown;

    // Show result
    setTimeout(() => {
      hideStatus();
      showResult(resultData.data);
    }, 500);

  } catch (error) {
    hideStatus();
    alert('Error: ' + error.message);
  }
});

// Copy URL button
copyURLBtn.addEventListener('click', () => {
  resultURL.select();
  document.execCommand('copy');
  copyURLBtn.textContent = '✓ Copied!';
  setTimeout(() => {
    copyURLBtn.textContent = 'Copy';
  }, 2000);
});

// Download markdown button
downloadMarkdownBtn.addEventListener('click', () => {
  if (!generatedMarkdown) return;

  const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'presentation.md';
  a.click();
  URL.revokeObjectURL(url);
});

// Create another button
createAnotherBtn.addEventListener('click', () => {
  hideResult();
  form.reset();
  generatedMarkdown = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Helper Functions

function getSelectedProvider() {
  const selected = document.querySelector('input[name="provider"]:checked');
  return selected ? selected.value : null;
}

function updateAPIKeyLink(provider) {
  if (providerConfig[provider]) {
    apiKeyLink.href = providerConfig[provider].apiKeyUrl;
  }
}

async function fetchModelsForProvider(provider, apiKey) {
  const config = providerConfig[provider];

  // Anthropic: Use hardcoded list
  if (provider === 'anthropic') {
    return config.models;
  }

  // Google: API key in query param
  if (provider === 'google') {
    const response = await fetch(`${config.modelsEndpoint}?key=${apiKey}`);
    if (!response.ok) throw new Error('Invalid API key or network error');
    const data = await response.json();

    return data.models
      .filter(m => m.name.includes('gemini'))
      .map(m => ({
        id: m.name.replace('models/', ''),
        name: m.displayName || m.name,
        description: m.description || ''
      }));
  }

  // OpenAI & OpenRouter: Bearer token
  const headers = {
    [config.authHeader]: `${config.authPrefix}${apiKey}`
  };

  const response = await fetch(config.modelsEndpoint, { headers });
  if (!response.ok) throw new Error('Invalid API key or network error');
  const data = await response.json();

  return data.data
    .filter(m => {
      // Filter relevant models
      if (provider === 'openai') {
        return m.id.includes('gpt') || m.id.includes('o1');
      }
      return true;
    })
    .map(m => ({
      id: m.id,
      name: m.id,
      description: m.description || ''
    }))
    .slice(0, 50); // Limit to first 50 models for OpenRouter
}

function populateModelDropdown(models) {
  modelSelect.innerHTML = '';
  modelSelect.disabled = false;

  if (models.length === 0) {
    modelSelect.innerHTML = '<option value="">No models available</option>';
    return;
  }

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.name;
    option.dataset.description = model.description;
    modelSelect.appendChild(option);
  });

  // Trigger change event for first model
  if (models.length > 0) {
    modelSelect.dispatchEvent(new Event('change'));
  }
}

function showStatus(message) {
  statusMessage.textContent = message;
  status.classList.remove('hidden');
  form.style.display = 'none';
}

function hideStatus() {
  status.classList.add('hidden');
  form.style.display = 'block';
}

function updateProgress(percent, message) {
  progressFill.style.width = percent + '%';
  if (message) {
    statusMessage.textContent = message;
  }
}

function showResult(data) {
  result.classList.remove('hidden');

  if (data.deployment && data.deployment.url) {
    resultURL.value = data.deployment.url;
    viewPresentationBtn.href = data.deployment.url;
    viewPresentationBtn.style.display = 'inline-flex';
  } else {
    resultURL.value = 'Test mode - no deployment';
    viewPresentationBtn.style.display = 'none';
  }

  // Show details
  let details = '';
  details += `<p><strong>Slides Generated:</strong> ${data.slides.slideCount} slides</p>`;
  details += `<p><strong>Provider:</strong> ${data.slides.provider} / ${data.slides.model}</p>`;
  details += `<p><strong>Theme:</strong> ${data.build.theme}</p>`;

  if (data.deployment) {
    details += `<p><strong>Repository:</strong> ${data.deployment.repository}</p>`;
    details += `<p><strong>Branch:</strong> ${data.deployment.branch}</p>`;
  }

  resultDetails.innerHTML = details;
}

function hideResult() {
  result.classList.add('hidden');
}

function toggleSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`).closest('.collapsible');
  section.classList.toggle('expanded');
}

// Make toggleSection global for onclick
window.toggleSection = toggleSection;
