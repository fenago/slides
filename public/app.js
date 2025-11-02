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
    // Call the ASYNC API - returns immediately, then poll for results
    updateProgress(5, 'Starting job...');
    console.log('[Frontend] Starting async generation with data:', data);

    const startResponse = await fetch('/.netlify/functions/generate-slides-async', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!startResponse.ok) {
      const error = await startResponse.json();
      console.error('[Frontend] Error starting job:', error);
      throw new Error(error.error || 'Failed to start job');
    }

    const startResult = await startResponse.json();
    console.log('[Frontend] Job started:', startResult.jobId);

    // Poll for completion
    updateProgress(10, 'Generating slides with AI...');
    const resultData = await pollJobStatus(startResult.pollUrl);
    console.log('[Frontend] Result data:', resultData);

    // Store markdown
    generatedMarkdown = resultData.markdown;
    console.log('[Frontend] Generated markdown length:', generatedMarkdown?.length);

    // Deploy to GitHub if credentials provided
    if (!testModeCheckbox.checked && data.githubUsername && data.githubPAT && data.repoName) {
      updateProgress(70, 'Deploying to GitHub Pages...');
      console.log('[Frontend] Starting GitHub deployment...');

      try {
        const deployUrl = await deployToGitHub(
          resultData.html,
          data.githubUsername,
          data.githubPAT,
          data.repoName
        );

        resultData.deployment = {
          url: deployUrl,
          repository: `${data.githubUsername}/${data.repoName}`,
          branch: 'gh-pages'
        };

        console.log('[Frontend] ✅ Deployed to:', deployUrl);
      } catch (deployError) {
        console.error('[Frontend] Deployment failed:', deployError);
        alert('Slides generated but GitHub deployment failed: ' + deployError.message);
      }
    }

    updateProgress(95, 'Complete!');

    // Show result
    setTimeout(() => {
      hideStatus();
      showResult(resultData);
      console.log('[Frontend] ✅ Generation complete!');
    }, 500);

  } catch (error) {
    console.error('[Frontend] ❌ Error:', error);
    console.error('[Frontend] Error stack:', error.stack);
    hideStatus();
    alert('Error: ' + error.message);
  }
});

// Poll job status until complete
async function pollJobStatus(pollUrl) {
  console.log('[Frontend] Polling for job status...');

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds

    const response = await fetch(pollUrl);
    if (!response.ok) {
      throw new Error('Failed to check job status');
    }

    const job = await response.json();
    console.log('[Frontend] Job status:', job.status, `${job.progress}%`, job.message);

    // Update progress bar with real-time status
    if (job.progress) {
      updateProgress(job.progress, job.message);
    }

    if (job.status === 'completed') {
      console.log('[Frontend] ✅ Job completed!');
      return job.data;
    }

    if (job.status === 'failed') {
      throw new Error(job.error || 'Job failed');
    }

    // Continue polling if still processing
  }
}

// Deploy to GitHub (client-side)
async function deployToGitHub(html, username, token, repo) {
  console.log('[GitHub] Deploying to:', `${username}/${repo}`);

  const apiBase = 'https://api.github.com';

  // Step 1: Check if repo exists, create if not
  try {
    const checkRepo = await fetch(`${apiBase}/repos/${username}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (checkRepo.status === 404) {
      console.log('[GitHub] Creating repository...');
      const createRepo = await fetch(`${apiBase}/user/repos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repo,
          description: 'AI-generated presentation',
          homepage: `https://${username}.github.io/${repo}`,
          private: false,
          has_issues: false,
          has_wiki: false
        })
      });

      if (!createRepo.ok) {
        throw new Error('Failed to create repository');
      }
      console.log('[GitHub] ✅ Repository created');
    }
  } catch (error) {
    console.error('[GitHub] Error checking/creating repo:', error);
    throw error;
  }

  // Step 2: Create/update index.html in gh-pages branch
  console.log('[GitHub] Uploading index.html...');

  const content = btoa(unescape(encodeURIComponent(html)));

  const uploadResponse = await fetch(`${apiBase}/repos/${username}/${repo}/contents/index.html`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Deploy presentation',
      content: content,
      branch: 'gh-pages'
    })
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    throw new Error(error.message || 'Failed to upload file');
  }

  console.log('[GitHub] ✅ File uploaded');

  // Step 3: Enable GitHub Pages
  console.log('[GitHub] Enabling GitHub Pages...');

  const pagesResponse = await fetch(`${apiBase}/repos/${username}/${repo}/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: {
        branch: 'gh-pages',
        path: '/'
      }
    })
  });

  // Ignore 409 (already enabled) or 422 (already exists)
  if (!pagesResponse.ok && pagesResponse.status !== 409 && pagesResponse.status !== 422) {
    console.warn('[GitHub] Pages may already be enabled');
  }

  const url = `https://${username}.github.io/${repo}`;
  console.log('[GitHub] ✅ Deployment complete:', url);

  return url;
}

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
