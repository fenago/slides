/**
 * Reveal.js Builder Module
 * Converts markdown slides to static Reveal.js presentations
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;

const execAsync = promisify(exec);

/**
 * Build Reveal.js presentation from markdown
 * @param {string} markdownPath - Path to markdown file
 * @param {Object} options - Build options
 * @returns {Object} - Build result with output path
 */
async function buildRevealPresentation(markdownPath, options = {}) {
  const {
    theme = 'black',
    highlightTheme = 'monokai',
    transition = 'slide',
    transitionSpeed = 'default',
    controls = true,
    progress = true,
    slideNumber = false,
    hash = true,
    center = true,
    fragments = true,
    autoSlide = 0,
    loop = false,
    outputDir = (process.cwd() === '/var/task' || process.env.AWS_LAMBDA_FUNCTION_NAME) ? '/tmp/dist' : 'dist',
    // Advanced options
    backgroundTransition = 'fade',
    navigationMode = 'default',
    showSlideNumber = 'all',
    mouseWheel = false,
    overview = true,
    touch = true
  } = options;

  console.log(`🔨 Building Reveal.js presentation...`);
  console.log(`   Theme: ${theme}`);
  console.log(`   Transition: ${transition}`);

  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Build reveal-md options
    const revealOptions = {
      controls,
      progress,
      slideNumber: slideNumber ? 'c/t' : false,
      hash,
      center,
      transition,
      transitionSpeed,
      backgroundTransition,
      autoSlide,
      loop,
      navigationMode,
      showSlideNumber,
      mouseWheel,
      overview,
      touch
    };

    const revealOptionsJson = JSON.stringify(revealOptions).replace(/"/g, '\\"');

    // Build command
    const command = `npx reveal-md "${markdownPath}" --static "${outputDir}" --theme ${theme} --highlight-theme ${highlightTheme} --reveal-options '${revealOptionsJson}'`;

    console.log(`📦 Running build command...`);

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stderr && !stderr.includes('Wrote')) {
      console.warn('⚠️  Build warnings:', stderr);
    }

    console.log('✅ Presentation built successfully!');
    if (stdout) {
      console.log(stdout);
    }

    return {
      success: true,
      outputDir,
      indexPath: path.join(outputDir, 'index.html'),
      theme,
      options: revealOptions
    };

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    throw new Error(`Reveal.js build failed: ${error.message}`);
  }
}

/**
 * Build with custom reveal.js configuration (advanced)
 * @param {string} markdownPath - Path to markdown file
 * @param {Object} customConfig - Full reveal.js config object
 */
async function buildWithCustomConfig(markdownPath, customConfig) {
  const outputDir = customConfig.outputDir || 'dist';
  const theme = customConfig.theme || 'black';
  const highlightTheme = customConfig.highlightTheme || 'monokai';

  delete customConfig.outputDir;
  delete customConfig.theme;
  delete customConfig.highlightTheme;

  const configJson = JSON.stringify(customConfig).replace(/"/g, '\\"');
  const command = `npx reveal-md "${markdownPath}" --static "${outputDir}" --theme ${theme} --highlight-theme ${highlightTheme} --reveal-options '${configJson}'`;

  await execAsync(command);

  return {
    success: true,
    outputDir,
    indexPath: path.join(outputDir, 'index.html')
  };
}

/**
 * Available themes
 */
const THEMES = [
  'black',
  'white',
  'league',
  'beige',
  'sky',
  'night',
  'serif',
  'simple',
  'solarized',
  'blood',
  'moon'
];

/**
 * Available highlight themes
 */
const HIGHLIGHT_THEMES = [
  'monokai',
  'zenburn',
  'vs',
  'github',
  'github-dark',
  'atom-one-dark',
  'atom-one-light',
  'dracula'
];

/**
 * Available transitions
 */
const TRANSITIONS = [
  'none',
  'fade',
  'slide',
  'convex',
  'concave',
  'zoom'
];

/**
 * Get theme info
 */
function getThemeInfo() {
  return {
    themes: THEMES.map(theme => ({
      id: theme,
      name: theme.charAt(0).toUpperCase() + theme.slice(1),
      description: getThemeDescription(theme)
    })),
    highlightThemes: HIGHLIGHT_THEMES,
    transitions: TRANSITIONS
  };
}

/**
 * Get theme description
 */
function getThemeDescription(theme) {
  const descriptions = {
    black: 'Black background, white text - Classic and professional',
    white: 'White background, black text - Clean and minimal',
    league: 'Gray background, white text - Modern and sleek',
    beige: 'Beige background, dark text - Warm and inviting',
    sky: 'Blue gradient background - Fresh and energetic',
    night: 'Dark background, thick white text - Bold and dramatic',
    serif: 'Cappuccino background, gray text - Traditional and elegant',
    simple: 'White background, black text - Minimalist design',
    solarized: 'Cream-colored background - Easy on the eyes',
    blood: 'Dark background, red accents - Striking and memorable',
    moon: 'Dark blue background - Professional night theme'
  };

  return descriptions[theme] || 'Professional presentation theme';
}

/**
 * Validate build options
 */
function validateOptions(options) {
  const errors = [];

  if (options.theme && !THEMES.includes(options.theme)) {
    errors.push(`Invalid theme: ${options.theme}. Must be one of: ${THEMES.join(', ')}`);
  }

  if (options.highlightTheme && !HIGHLIGHT_THEMES.includes(options.highlightTheme)) {
    errors.push(`Invalid highlight theme: ${options.highlightTheme}`);
  }

  if (options.transition && !TRANSITIONS.includes(options.transition)) {
    errors.push(`Invalid transition: ${options.transition}. Must be one of: ${TRANSITIONS.join(', ')}`);
  }

  if (options.transitionSpeed && !['default', 'fast', 'slow'].includes(options.transitionSpeed)) {
    errors.push(`Invalid transition speed: ${options.transitionSpeed}`);
  }

  if (errors.length > 0) {
    throw new Error(`Build options validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

module.exports = {
  buildRevealPresentation,
  buildWithCustomConfig,
  getThemeInfo,
  validateOptions,
  THEMES,
  HIGHLIGHT_THEMES,
  TRANSITIONS
};
