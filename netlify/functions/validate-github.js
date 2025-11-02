const { validateGitHubCredentials } = require('../../modules/github-deploy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { username, token } = JSON.parse(event.body);

    if (!username || !token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and token required' })
      };
    }

    const result = await validateGitHubCredentials(username, token);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: true, ...result })
    };

  } catch (error) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: false, error: error.message })
    };
  }
};
