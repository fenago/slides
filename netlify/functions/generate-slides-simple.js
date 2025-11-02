/**
 * Simplified Generate Slides - Returns Markdown Only
 * Skips Reveal.js build and GitHub deployment (do those locally)
 */

const { generateSlides, generateSampleSlides } = require('../../modules/llm-generator');
const { generateUserPrompt, getCustomSystemPrompt } = require('../../modules/prompts');

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

      // Test mode
      testMode
    } = body;

    console.log('🎨 Starting slide generation...');
    console.log('   Topic:', topic);
    console.log('   Provider:', provider);
    console.log('   Test Mode:', testMode);

    // Validate required fields
    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Topic is required' })
      };
    }

    if (!testMode && (!provider || !apiKey || !model)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Provider, API key, and model are required (or enable test mode)' })
      };
    }

    // Generate slides with AI
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

    // Success response - return markdown
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Slides generated successfully! Download the markdown and build locally.',
        data: {
          markdown: slideData.markdown,
          filename: slideData.filename,
          metadata: slideData.metadata,
          instructions: {
            step1: 'Download the markdown file',
            step2: 'Run: npx reveal-md slides.md --static dist --theme black',
            step3: 'Deploy the dist folder to GitHub Pages or any static host'
          }
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
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
