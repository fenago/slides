exports.handler = async (event, context) => {
  try {
    // Test 1: Basic function works
    const test1 = { basic: true };

    // Test 2: Can we require built-in modules?
    const fs = require('fs');
    const test2 = { fs: true };

    // Test 3: Can we require our modules?
    let test3 = { error: null };
    try {
      const prompts = require('../../modules/prompts');
      test3.prompts = true;
    } catch (e) {
      test3.error = e.message;
    }

    // Test 4: Can we require Anthropic?
    let test4 = { error: null };
    try {
      const Anthropic = require('@anthropic-ai/sdk');
      test4.anthropic = true;
    } catch (e) {
      test4.error = e.message;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        tests: { test1, test2, test3, test4 },
        env: {
          NETLIFY: process.env.NETLIFY,
          NODE_ENV: process.env.NODE_ENV,
          cwd: process.cwd()
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
