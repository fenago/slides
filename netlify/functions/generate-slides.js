/**
 * Netlify Function: Generate Slides
 * Main endpoint for generating and deploying presentations
 */

const { generateSlides, generateSampleSlides } = require('../../modules/llm-generator');
const { generateUserPrompt, getCustomSystemPrompt, INSTRUCTIONAL_DESIGN_SYSTEM_PROMPT } = require('../../modules/prompts');
const { buildStaticPresentation } = require('../../modules/reveal-html-generator');
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

    // STEP 2: Build Reveal.js HTML (lightweight, no deployment yet)
    console.log('🔨 Building Reveal.js presentation...');

    const buildOptions = {
      theme: theme || 'black',
      transition: transition || 'slide',
      controls: controls !== false,
      progress: progress !== false,
      slideNumber: slideNumber || false,
      hash: hash !== false,
      center: center !== false
    };

    // Generate HTML from markdown (no file system needed)
    const { generateRevealHTML } = require('../../modules/reveal-html-generator');
    const html = generateRevealHTML(slideData.markdown, buildOptions);

    console.log('✅ Presentation HTML built');
    console.log('💡 Client will handle GitHub deployment');

    // Success response - return HTML and markdown for client-side deployment
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Slides generated successfully!',
        data: {
          slides: {
            filename: slideData.filename,
            slideCount: slideData.metadata.slideCount,
            characterCount: slideData.metadata.characterCount,
            provider: slideData.metadata.provider,
            model: slideData.metadata.model
          },
          markdown: slideData.markdown,
          html: html, // Full HTML for deployment
          theme: buildOptions.theme,
          // GitHub credentials passed through for client-side deployment
          github: !testMode && githubUsername && githubPAT && repoName ? {
            username: githubUsername,
            token: githubPAT,
            repo: repoName
          } : null
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
