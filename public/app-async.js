// Async version with polling

async function generateSlidesAsync(data) {
  console.log('[Frontend] Starting async generation...');

  // Step 1: Start the job
  const startResponse = await fetch('/.netlify/functions/generate-slides-async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const startResult = await startResponse.json();
  console.log('[Frontend] Job started:', startResult);

  if (!startResult.success) {
    throw new Error('Failed to start job');
  }

  const jobId = startResult.jobId;
  const pollUrl = startResult.pollUrl;

  // Step 2: Poll for completion
  return await pollJobStatus(pollUrl);
}

async function pollJobStatus(pollUrl) {
  console.log('[Frontend] Polling:', pollUrl);

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    const response = await fetch(pollUrl);
    const job = await response.json();

    console.log('[Frontend] Job status:', job.status, job.progress + '%', job.message);

    // Update progress bar
    if (job.progress) {
      updateProgress(job.progress, job.message);
    }

    if (job.status === 'completed') {
      console.log('[Frontend] ✅ Job complete!');
      return job.data;
    }

    if (job.status === 'failed') {
      throw new Error(job.error || 'Job failed');
    }

    // Continue polling if still processing
  }
}

// Usage in form submit
generateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    // ... gather form data ...
    testMode: testModeCheckbox.checked
  };

  showStatus('Initializing...');

  try {
    // Use async version
    const resultData = await generateSlidesAsync(data);

    // Store markdown
    generatedMarkdown = resultData.markdown;

    // Deploy to GitHub if needed
    if (data.githubUsername && data.githubPAT && data.repoName) {
      updateProgress(70, 'Deploying to GitHub Pages...');
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
    }

    // Show result
    hideStatus();
    showResult(resultData);

  } catch (error) {
    console.error('[Frontend] Error:', error);
    hideStatus();
    alert('Error: ' + error.message);
  }
});
