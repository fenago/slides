/**
 * Test version of generate-slides to debug issues
 */

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    console.log('Received request:', body);

    // Test 1: Can we load modules?
    let modulesLoaded = {
      prompts: false,
      llmGenerator: false,
      revealBuilder: false,
      githubDeploy: false
    };

    try {
      require('../../modules/prompts');
      modulesLoaded.prompts = true;
    } catch (e) {
      console.error('Failed to load prompts:', e.message);
    }

    try {
      require('../../modules/llm-generator');
      modulesLoaded.llmGenerator = true;
    } catch (e) {
      console.error('Failed to load llm-generator:', e.message);
    }

    try {
      require('../../modules/reveal-builder');
      modulesLoaded.revealBuilder = true;
    } catch (e) {
      console.error('Failed to load reveal-builder:', e.message);
    }

    try {
      require('../../modules/github-deploy');
      modulesLoaded.githubDeploy = true;
    } catch (e) {
      console.error('Failed to load github-deploy:', e.message);
    }

    // Test 2: Can we load dependencies?
    let depsLoaded = {
      anthropic: false,
      openai: false,
      google: false,
      octokit: false
    };

    try {
      require('@anthropic-ai/sdk');
      depsLoaded.anthropic = true;
    } catch (e) {
      console.error('Failed to load Anthropic SDK:', e.message);
    }

    try {
      require('openai');
      depsLoaded.openai = true;
    } catch (e) {
      console.error('Failed to load OpenAI SDK:', e.message);
    }

    try {
      require('@google/generative-ai');
      depsLoaded.google = true;
    } catch (e) {
      console.error('Failed to load Google SDK:', e.message);
    }

    try {
      require('@octokit/rest');
      depsLoaded.octokit = true;
    } catch (e) {
      console.error('Failed to load Octokit:', e.message);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Test function working',
        diagnostics: {
          modulesLoaded,
          depsLoaded,
          testMode: body.testMode,
          cwd: process.cwd(),
          env: {
            NODE_ENV: process.env.NODE_ENV,
            LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT
          }
        }
      })
    };

  } catch (error) {
    console.error('Error in test function:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
