/**
 * Netlify Function: Generate Slides
 * Main endpoint for generating and deploying presentations
 */

const { generateSlides, generateSampleSlides } = require('../../modules/llm-generator');
const { generateUserPrompt, getCustomSystemPrompt, INSTRUCTIONAL_DESIGN_SYSTEM_PROMPT } = require('../../modules/prompts');
const { buildRevealPresentation } = require('../../modules/reveal-builder');
const { deployToGitHubPages } = require('../../modules/github-deploy');

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

    const {
      // LLM Provider settings
      provider,
      apiKey,
      model,
      customSystemPrompt,

      // Presentation settings
      topic,
      audience,
      slideCount,
      tone,
      topicType,
      includeCode,

      // GitHub settings
      githubUsername,
      githubPAT,
      repoName,

      // Reveal.js settings
      theme,
      highlightTheme,
      transition,
      transitionSpeed,
      controls,
      progress,
      slideNumber,
      hash,
      center,
      backgroundTransition,
      navigationMode,
      autoSlide,
      loop,

      // Test mode
      testMode
    } = body;

    console.log('🎨 Starting slide generation...');
    console.log('   Topic:', topic);
    console.log('   Provider:', provider);
    console.log('   Model:', model);
    console.log('   Test Mode:', testMode);

    // Validate required fields
    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Topic is required' })
      };
    }

    if (!testMode) {
      if (!provider || !apiKey || !model) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Provider, API key, and model are required' })
        };
      }

      if (!githubUsername || !githubPAT || !repoName) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'GitHub credentials are required' })
        };
      }
    }

    // STEP 1: Generate slides with AI
    let slideData;

    if (testMode) {
      console.log('🧪 Using test mode...');
      slideData = await generateSampleSlides({
        topic,
        slideCount: slideCount || 8
      });
    } else {
      const systemPrompt = getCustomSystemPrompt(customSystemPrompt);
      const userPrompt = generateUserPrompt({
        topic,
        audience: audience || 'general audience',
        slideCount: slideCount || 8,
        tone: tone || 'professional',
        includeCode: includeCode || false,
        topicType: topicType || 'general'
      });

      slideData = await generateSlides({
        provider,
        apiKey,
        model,
        systemPrompt,
        userPrompt,
        topic
      });
    }

    console.log('✅ Slides generated:', slideData.filename);

    // STEP 2: Build Reveal.js presentation
    console.log('🔨 Building Reveal.js presentation...');

    const buildOptions = {
      theme: theme || 'black',
      highlightTheme: highlightTheme || 'monokai',
      transition: transition || 'slide',
      transitionSpeed: transitionSpeed || 'default',
      controls: controls !== false,
      progress: progress !== false,
      slideNumber: slideNumber || false,
      hash: hash !== false,
      center: center !== false,
      backgroundTransition: backgroundTransition || 'fade',
      navigationMode: navigationMode || 'default',
      autoSlide: autoSlide || 0,
      loop: loop || false,
      outputDir: 'dist'
    };

    const buildResult = await buildRevealPresentation(slideData.filepath, buildOptions);

    console.log('✅ Presentation built');

    // STEP 3: Deploy to GitHub Pages (skip in test mode)
    let deploymentResult = null;

    if (!testMode && githubUsername && githubPAT && repoName) {
      console.log('🚀 Deploying to GitHub Pages...');

      deploymentResult = await deployToGitHubPages(
        githubUsername,
        githubPAT,
        repoName,
        buildResult.outputDir
      );

      console.log('✅ Deployed:', deploymentResult.url);
    }

    // Success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Presentation generated successfully!',
        data: {
          slides: {
            filename: slideData.filename,
            slideCount: slideData.metadata.slideCount,
            characterCount: slideData.metadata.characterCount,
            provider: slideData.metadata.provider,
            model: slideData.metadata.model
          },
          build: {
            theme: buildResult.theme,
            outputDir: buildResult.outputDir
          },
          deployment: deploymentResult ? {
            url: deploymentResult.url,
            repository: `${deploymentResult.username}/${deploymentResult.repoName}`,
            branch: deploymentResult.branch
          } : null,
          markdown: slideData.markdown // Include markdown in response
        }
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: error.stack
      })
    };
  }
};
