/**
 * Async Slide Generation - Returns immediately, processes in background
 */

const { generateSlides, generateSampleSlides } = require('../../modules/llm-generator');
const { generateUserPrompt, getCustomSystemPrompt } = require('../../modules/prompts');
const { generateRevealHTML } = require('../../modules/reveal-html-generator');

// In-memory job store (use Redis/DB in production)
const jobs = new Map();

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET: Check job status
  if (event.httpMethod === 'GET') {
    const jobId = event.queryStringParameters?.jobId;
    if (!jobId || !jobs.has(jobId)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Job not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(jobs.get(jobId))
    };
  }

  // POST: Start new job
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Store job with initial status
    jobs.set(jobId, {
      id: jobId,
      status: 'processing',
      progress: 0,
      message: 'Starting...',
      createdAt: new Date().toISOString()
    });

    // Process in background (don't await)
    processJob(jobId, body).catch(error => {
      jobs.set(jobId, {
        ...jobs.get(jobId),
        status: 'failed',
        error: error.message
      });
    });

    // Return immediately
    return {
      statusCode: 202, // Accepted
      headers,
      body: JSON.stringify({
        success: true,
        jobId,
        message: 'Job started. Poll /generate-slides-async?jobId=' + jobId + ' for status',
        pollUrl: `/.netlify/functions/generate-slides-async?jobId=${jobId}`
      })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

async function processJob(jobId, config) {
  const {
    provider, apiKey, model, customSystemPrompt,
    topic, audience, slideCount, tone, topicType, includeCode,
    theme, transition, controls, progress, slideNumber, hash, center,
    testMode
  } = config;

  try {
    // Update progress
    jobs.set(jobId, { ...jobs.get(jobId), progress: 10, message: 'Generating slides with AI...' });

    // Step 1: Generate slides
    let slideData;
    if (testMode) {
      slideData = await generateSampleSlides({ topic, slideCount: slideCount || 8 });
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
        provider, apiKey, model, systemPrompt, userPrompt, topic
      });
    }

    jobs.set(jobId, { ...jobs.get(jobId), progress: 60, message: 'Building HTML...' });

    // Step 2: Generate HTML
    const buildOptions = {
      theme: theme || 'black',
      transition: transition || 'slide',
      controls: controls !== false,
      progress: progress !== false,
      slideNumber: slideNumber || false,
      hash: hash !== false,
      center: center !== false
    };

    const html = generateRevealHTML(slideData.markdown, buildOptions);

    jobs.set(jobId, { ...jobs.get(jobId), progress: 90, message: 'Finalizing...' });

    // Complete
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'completed',
      progress: 100,
      message: 'Complete!',
      data: {
        slides: {
          filename: slideData.filename,
          slideCount: slideData.metadata.slideCount,
          characterCount: slideData.metadata.characterCount,
          provider: slideData.metadata.provider,
          model: slideData.metadata.model
        },
        markdown: slideData.markdown,
        html: html,
        theme: buildOptions.theme
      },
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Job failed:', error);
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'failed',
      error: error.message,
      failedAt: new Date().toISOString()
    });
  }
}
