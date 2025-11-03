/**
 * Async Slide Generation - Returns immediately, processes in background
 * Uses Netlify Blobs for persistent storage across function invocations
 */

const { generateSlides, generateSampleSlides } = require('../../modules/llm-generator');
const { generateUserPrompt, getCustomSystemPrompt } = require('../../modules/prompts');
const { generateRevealHTML } = require('../../modules/reveal-html-generator');
const { getStore } = require('@netlify/blobs');

// Get blob store for job data
function getJobStore() {
  return getStore({
    name: 'slide-jobs',
    siteID: process.env.SITE_ID
  });
}

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
    if (!jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'jobId required' })
      };
    }

    const store = getJobStore();
    const jobData = await store.get(jobId, { type: 'json' });

    if (!jobData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Job not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(jobData)
    };
  }

  // POST: Start new job
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const store = getJobStore();

    // Store job with initial status
    await store.set(jobId, JSON.stringify({
      id: jobId,
      status: 'processing',
      progress: 0,
      message: 'Starting...',
      createdAt: new Date().toISOString()
    }));

    // Process in background (don't await)
    processJob(jobId, body).catch(error => {
      console.error('Background job failed:', error);
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

  const store = getJobStore();

  async function updateJob(updates) {
    const current = await store.get(jobId, { type: 'json' });
    await store.set(jobId, JSON.stringify({ ...current, ...updates }));
  }

  try {
    // Update progress
    await updateJob({ progress: 10, message: 'Generating slides with AI...' });

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

    await updateJob({ progress: 60, message: 'Building HTML...' });

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

    await updateJob({ progress: 90, message: 'Finalizing...' });

    // Complete
    await updateJob({
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
    await updateJob({
      status: 'failed',
      error: error.message,
      failedAt: new Date().toISOString()
    });
  }
}
