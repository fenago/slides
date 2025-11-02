/**
 * Reveal.js HTML Generator (No CLI needed)
 * Generates static HTML directly from markdown
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Generate Reveal.js HTML from markdown
 * @param {string} markdown - Markdown content
 * @param {Object} options - Reveal.js options
 * @returns {string} - Complete HTML
 */
function generateRevealHTML(markdown, options = {}) {
  const {
    theme = 'black',
    transition = 'slide',
    controls = true,
    progress = true,
    slideNumber = false,
    hash = true,
    center = true
  } = options;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/${theme}.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/highlight/monokai.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
${convertMarkdownToSlides(markdown)}
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/notes/notes.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/markdown/markdown.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/highlight/highlight.js"></script>

  <script>
    Reveal.initialize({
      controls: ${controls},
      progress: ${progress},
      slideNumber: ${slideNumber ? "'c/t'" : 'false'},
      hash: ${hash},
      center: ${center},
      transition: '${transition}',
      plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
    });
  </script>
</body>
</html>`;

  return html;
}

/**
 * Convert markdown to Reveal.js slides
 */
function convertMarkdownToSlides(markdown) {
  // Split by horizontal rule (---)
  const slides = markdown.split(/\n---\n/).filter(s => s.trim());

  return slides.map(slide => {
    // Parse slide for special Reveal.js features
    const lines = slide.split('\n');
    let slideHTML = '<section data-markdown>\n<textarea data-template>\n';
    slideHTML += slide;
    slideHTML += '\n</textarea>\n</section>';

    return slideHTML;
  }).join('\n');
}

/**
 * Build static presentation and save to directory
 */
async function buildStaticPresentation(markdown, outputDir, options = {}) {
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Generate HTML
  const html = generateRevealHTML(markdown, options);

  // Write index.html
  const indexPath = path.join(outputDir, 'index.html');
  await fs.writeFile(indexPath, html);

  return {
    success: true,
    outputDir,
    indexPath,
    theme: options.theme || 'black'
  };
}

module.exports = {
  generateRevealHTML,
  buildStaticPresentation
};
