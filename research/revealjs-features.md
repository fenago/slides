# Complete Reveal.js Features & Configuration Options

**Last Updated**: 2025-11-01
**Source**: Official Reveal.js Documentation & GitHub Repository

---

## Core Presentation Features

### 1. **Display & Layout**
- [x] `width` - Presentation width (default: 960)
- [x] `height` - Presentation height (default: 700)
- [x] `margin` - Factor of display size for empty space around content (default: 0.04)
- [x] `minScale` - Minimum scale for content (default: 0.2)
- [x] `maxScale` - Maximum scale for content (default: 2.0)
- [x] `center` - Vertically center slides (default: true)
- [x] `embedded` - Embedded mode for placing inside other content (default: false)
- [x] `rtl` - Right-to-left text direction (default: false)

### 2. **Controls & Navigation**
- [x] `controls` - Display navigation controls (default: true)
- [x] `controlsLayout` - Position of controls ('bottom-right', 'edges', default: 'bottom-right')
- [x] `controlsBackArrows` - Visibility of back arrows ('faded', 'hidden', 'visible')
- [x] `progress` - Display progress bar (default: true)
- [x] `slideNumber` - Display slide numbers (boolean or format string)
- [x] `showSlideNumber` - When to show slide numbers ('all', 'print', 'speaker')
- [x] `hash` - Push state to URL hash (default: false)
- [x] `history` - Push state to browser history (default: false)
- [x] `keyboard` - Enable keyboard shortcuts (default: true)
- [x] `keyboardCondition` - When keyboard is active ('focused' or null)
- [x] `overview` - Enable overview mode (default: true)
- [x] `disableLayout` - Disable layout scaling and positioning (default: false)
- [x] `touch` - Enable touch navigation (default: true)
- [x] `loop` - Loop presentation (default: false)
- [x] `shuffle` - Shuffle slide order (default: false)
- [x] `navigationMode` - Navigation mode ('default', 'linear', 'grid')

### 3. **Transitions**
- [x] `transition` - Transition style ('none', 'fade', 'slide', 'convex', 'concave', 'zoom')
- [x] `transitionSpeed` - Transition speed ('default', 'fast', 'slow')
- [x] `backgroundTransition` - Background transition style (same options as transition)

### 4. **Fragments**
- [x] Incremental content reveal
- [x] `data-fragment-index` - Control fragment order
- [x] Multiple fragment styles ('fade-in', 'fade-out', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'grow', 'shrink', 'strike', 'highlight-red', 'highlight-green', 'highlight-blue', 'highlight-current-red', 'highlight-current-green', 'highlight-current-blue')

### 5. **Parallax Background**
- [x] `parallaxBackgroundImage` - Parallax background image URL
- [x] `parallaxBackgroundSize` - CSS syntax for background size
- [x] `parallaxBackgroundHorizontal` - Horizontal parallax movement
- [x] `parallaxBackgroundVertical` - Vertical parallax movement

### 6. **Auto-Slide**
- [x] `autoSlide` - Auto-advance interval in milliseconds (0 = disabled)
- [x] `autoSlideStoppable` - Stop auto-sliding on user input (default: true)
- [x] `autoSlideMethod` - Custom function for auto-slide navigation

### 7. **Mouse & Pointer**
- [x] `mouseWheel` - Enable slide navigation via mousewheel (default: false)
- [x] `hideAddressBar` - Hide address bar on mobile (default: true)
- [x] `hideCursorTime` - Time before hiding cursor in milliseconds (default: 5000)
- [x] `previewLinks` - Open links in preview iframe overlay (default: false)

### 8. **View Modes**
- [x] `view` - Presentation view mode ('default', 'scroll')
- [x] `scrollProgress` - Show progress bar in scroll view (default: 'auto')
- [x] `scrollLayout` - Scroll view layout ('full', 'compact')
- [x] `scrollSnap` - Enable snap scrolling (default: true)
- [x] `scrollActivationWidth` - Threshold for scroll activation

---

## Built-in Plugins

### 1. **RevealMarkdown**
- [x] Write slides in Markdown syntax
- [x] External markdown file support
- [x] Separator customization (`---` horizontal, `--` vertical)
- [x] Data attributes in markdown
- [x] Smart quotes (SmartyPants)

### 2. **RevealHighlight**
- [x] Syntax highlighting for code blocks
- [x] Line numbers (`data-line-numbers`)
- [x] Line highlighting (`data-line-numbers="1,2,3"`)
- [x] Line offset (`data-ln-start-from`)
- [x] Auto-detect language or specify manually
- [x] Multiple highlight themes

### 3. **RevealNotes**
- [x] Speaker notes view (press 's')
- [x] Separate window with notes
- [x] Current and upcoming slide preview
- [x] Timer and pacing indicators
- [x] Total time tracking
- [x] `data-timing` attribute for slide timing
- [x] `totalTime` and `minimumTimePerSlide` config

### 4. **RevealSearch**
- [x] Full-text search (Ctrl+Shift+F)
- [x] Highlight search results
- [x] Navigate between matches

### 5. **RevealZoom**
- [x] Zoom into slide sections (Alt+Click)
- [x] Magnify specific areas

### 6. **RevealMath**
- [x] **MathJax 2** - Traditional math rendering
- [x] **MathJax 3** - Modern MathJax
- [x] **KaTeX** - Fast math typesetting
- [x] Custom macros and configurations
- [x] Inline and display equations

---

## Advanced Features

### 1. **Media**
- [x] Video backgrounds
- [x] Video autoplay
- [x] Iframe backgrounds
- [x] `data-autoplay` attribute
- [x] `data-preload` for iframes
- [x] Lazy loading media

### 2. **Backgrounds**
- [x] Image backgrounds (`data-background-image`)
- [x] Video backgrounds (`data-background-video`)
- [x] Iframe backgrounds (`data-background-iframe`)
- [x] Color backgrounds (`data-background-color`)
- [x] Gradient backgrounds
- [x] Background size, position, repeat
- [x] Background transitions
- [x] `data-background-opacity`

### 3. **Slide States**
- [x] Custom data-state attributes
- [x] CSS classes applied to document element
- [x] JavaScript state change events

### 4. **Slide Visibility**
- [x] `data-visibility="hidden"` - Hide from navigation
- [x] `data-visibility="uncounted"` - Exclude from numbering

### 5. **Auto-Animate**
- [x] Smooth element transitions between slides
- [x] `data-auto-animate` attribute
- [x] `data-id` for matching elements
- [x] Customizable easing and duration
- [x] `data-auto-animate-easing`
- [x] `data-auto-animate-duration`
- [x] `data-auto-animate-delay`

### 6. **Layout Helpers**
- [x] Stack slides (vertical)
- [x] Fragment layout classes
- [x] `r-fit-text` - Auto-size text
- [x] `r-stretch` - Fill available space
- [x] `r-stack` - Stack elements on top of each other
- [x] `r-hstack` - Horizontal stack
- [x] `r-vstack` - Vertical stack

### 7. **PDF Export**
- [x] `?print-pdf` URL parameter
- [x] Export to PDF via print dialog
- [x] Maintain slide formatting
- [x] Include fragments as separate pages

### 8. **Multiplexing**
- [x] Control multiple presentations simultaneously
- [x] Master/client setup
- [x] Socket.io integration

### 9. **Postmessage API**
- [x] Control presentation via postMessage
- [x] External application integration
- [x] Cross-origin communication

---

## Themes

### Built-in Themes (11 total)
1. **black** - Black background, white text
2. **white** - White background, black text
3. **league** - Gray background, white text
4. **beige** - Beige background, dark text
5. **sky** - Blue gradient background
6. **night** - Dark background, thick white text
7. **serif** - Cappuccino background, gray text (serif font)
8. **simple** - White background, black text (simple styling)
9. **solarized** - Cream-colored background (solarized palette)
10. **blood** - Dark background, red accents
11. **moon** - Dark blue background

### Custom Themes
- [x] Create custom CSS themes
- [x] Override default styles
- [x] CSS variables for easy customization

---

## Events

### Lifecycle Events
- [x] `ready` - Presentation initialized
- [x] `slidechanged` - Slide navigation occurred
- [x] `fragmentshown` - Fragment revealed
- [x] `fragmenthidden` - Fragment hidden
- [x] `overviewshown` - Overview mode activated
- [x] `overviewhidden` - Overview mode deactivated
- [x] `paused` - Presentation paused
- [x] `resumed` - Presentation resumed
- [x] `resize` - Presentation resized

### Custom Events
- [x] Dispatch custom events
- [x] Listen to state changes

---

## API Methods

### Navigation
- `Reveal.slide(h, v, f)` - Navigate to specific slide
- `Reveal.left()` - Navigate left
- `Reveal.right()` - Navigate right
- `Reveal.up()` - Navigate up
- `Reveal.down()` - Navigate down
- `Reveal.prev()` - Previous slide
- `Reveal.next()` - Next slide
- `Reveal.prevFragment()` - Previous fragment
- `Reveal.nextFragment()` - Next fragment

### State
- `Reveal.isReady()` - Check if initialized
- `Reveal.isOverview()` - Check overview state
- `Reveal.isPaused()` - Check paused state
- `Reveal.isAutoSliding()` - Check auto-slide state
- `Reveal.isFirstSlide()` - Check if first slide
- `Reveal.isLastSlide()` - Check if last slide
- `Reveal.isLastVerticalSlide()` - Check if last vertical slide

### Retrieval
- `Reveal.getIndices()` - Get current slide indices {h, v, f}
- `Reveal.getProgress()` - Get presentation progress (0-1)
- `Reveal.getTotalSlides()` - Get total slide count
- `Reveal.getCurrentSlide()` - Get current slide element
- `Reveal.getPreviousSlide()` - Get previous slide element
- `Reveal.getSlides()` - Get all slides
- `Reveal.getConfig()` - Get configuration object

### Control
- `Reveal.configure(options)` - Update configuration
- `Reveal.toggleOverview()` - Toggle overview mode
- `Reveal.togglePause()` - Toggle pause state
- `Reveal.toggleHelp()` - Toggle help overlay
- `Reveal.toggleAutoSlide()` - Toggle auto-slide

### Plugins
- `Reveal.registerPlugin(plugin)` - Register plugin
- `Reveal.hasPlugin(name)` - Check if plugin registered
- `Reveal.getPlugin(name)` - Get plugin instance

---

## Keyboard Shortcuts

### Navigation
- **Arrow keys** - Navigate slides
- **Space** - Next slide
- **N/Page Down** - Next slide
- **P/Page Up** - Previous slide
- **Home** - First slide
- **End** - Last slide

### Controls
- **O/Esc** - Toggle overview mode
- **B/.** - Pause presentation (blackout)
- **S** - Open speaker notes
- **F** - Fullscreen
- **Alt+Click** - Zoom (with Zoom plugin)
- **Ctrl+Shift+F** - Search (with Search plugin)

---

## Markdown Features

### Slide Separators
```markdown
---
# Horizontal slide

--
## Vertical slide
```

### Element Attributes
```markdown
<!-- .slide: data-background="#ff0000" -->
```

### Fragment Syntax
```markdown
- Item 1 <!-- .element: class="fragment" -->
- Item 2 <!-- .element: class="fragment fade-in" -->
```

### Speaker Notes
```markdown
Note:
These are speaker notes
```

### Code Blocks
```markdown
\```javascript [1,2,3]
function example() {
  console.log("Hello");
}
\```
```

---

## Configuration Best Practices

### Performance
- Lazy load media with `preloadIframes: false`
- Use `viewDistance` to control slide preloading
- Optimize images for web

### Accessibility
- Provide alt text for images
- Use proper heading hierarchy
- Enable keyboard navigation
- Include speaker notes for context

### Responsive Design
- Test on multiple screen sizes
- Use `center: true` for mobile
- Adjust `margin` for different devices

---

## Integration Options

### Frameworks
- [x] React integration (reveal.js-react)
- [x] Vue integration
- [x] Angular integration

### Tools
- [x] **reveal-md** - Markdown to Reveal.js CLI
- [x] **Quarto** - Academic publishing integration
- [x] **Asciidoctor** - AsciiDoc to Reveal.js

### Hosting
- [x] GitHub Pages
- [x] Netlify
- [x] Vercel
- [x] Static hosting

---

## Feature Checkbox Categories for UI

### Category 1: Basic Settings
- Controls
- Progress bar
- Slide numbers
- Center slides
- Loop presentation
- Shuffle slides

### Category 2: Navigation
- Keyboard shortcuts
- Touch navigation
- Mousewheel navigation
- Navigation mode (default/linear/grid)
- Overview mode

### Category 3: Transitions
- Slide transition type
- Transition speed
- Background transitions

### Category 4: Auto-Advance
- Enable auto-slide
- Auto-slide interval
- Stop on user input

### Category 5: Visual Effects
- Parallax background
- Auto-animate
- Fragments

### Category 6: Backgrounds
- Image backgrounds
- Video backgrounds
- Color backgrounds
- Gradient backgrounds

### Category 7: Plugins
- Markdown support
- Code highlighting
- Speaker notes
- Search
- Zoom
- Math (MathJax/KaTeX)

### Category 8: Media
- Video autoplay
- Lazy loading
- Iframe preloading

### Category 9: Export & Sharing
- PDF export
- URL hash
- Browser history

### Category 10: Advanced
- RTL support
- Custom CSS
- Embedded mode
- Postmessage API

---

**Total Configurable Options**: 100+
**Built-in Themes**: 11
**Core Plugins**: 6
**Transition Effects**: 6
**Fragment Animations**: 15+
