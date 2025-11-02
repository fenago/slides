const { getThemeInfo } = require('../../modules/reveal-builder');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getThemeInfo())
  };
};
