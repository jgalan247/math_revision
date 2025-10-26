# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Math Revision Platform with arcade-style UI for UK curriculum students (KS3/KS4). Built as a pure static website using vanilla JavaScript, KaTeX for LaTeX rendering, and MathLive for interactive math input. No build process or server-side logic required.

**Two primary interfaces:**
1. **Math Arcade** (index.html, arcade.html) - Worksheet selection with game-themed cards
2. **Worksheet Player** (worksheet.html) - Interactive problem solver with real-time answer validation

**URL Structure:** Worksheets load via query parameter: `worksheet.html?id=worksheet-name` (matches JSON filename without extension)

## Core Architecture

### Critical Data Flow (Cross-Component)

1. **Worksheet Loading Chain:**
   - URL parameter → `worksheet-loader.js:loadWorksheet()` → fetches `/worksheets/{id}.json`
   - JSON questions → `renderQuestion()` → creates DOM structure with KaTeX-rendered prompts
   - For each question: determines input type based on `marking.method`

2. **Input Field Creation (Method-Dependent Logic):**
   - `marking.method: "solution_set"` with `answer.roots` array → **dual fields** (x₁ and x₂) via `mathlive-handler.js:createDualFieldQuestion()`
   - All other methods → single MathLive field via `createMathField()`
   - **Work area** (optional scratchpad) is created for all questions, shares same keyboard as answer field

3. **Answer Validation Flow:**
   - Student clicks "Check" button → `checkAnswer(questionIndex)`
   - Retrieves LaTeX value(s) from MathLive field(s) via `mathLiveHandler.getValue()`
   - Passes to `AnswerChecker.check()` with `marking.method` and `tolerance`
   - Result → visual feedback via `.correct`/`.incorrect` CSS classes on MathLive fields

### Key Components

**Worksheet System** (`js/worksheet-loader.js`)
- **Global state:** `currentWorksheet`, `studentAnswers`, `questionStatus` objects
- **Rendering:** Dynamically generates question cards with KaTeX-rendered LaTeX
- **Progress tracking:** Updates status badges and progress bar based on `questionStatus`
- **Two validation modes:** Individual question checking vs. full worksheet submission

**MathLive Handler** (`js/mathlive-handler.js`)
- **Registry pattern:** Maintains `Map` of field IDs → MathLive instances
- **6 custom virtual keyboards:** Registered globally via `window.mathVirtualKeyboard.layouts`
  - KS3/KS4, Algebra, Quadratic (with formula templates), Calculus, Inequalities, Basic
- **Dual-field support:** Special handling for quadratic equations (x₁/x₂) with synchronized keyboards
- **Visual feedback:** Applies CSS classes directly to MathLive elements

**Answer Checker** (`js/answer-checker.js`)
- **5 marking methods:**
  - `fraction_equivalence`: Parses LaTeX fractions and compares decimal values
  - `numeric_equal`: Numeric comparison with configurable tolerance
  - `solution_pair`: Validates (x,y) coordinate pairs
  - `solution_set`: Validates unordered sets of roots (for quadratics)
  - `exact`: LaTeX string normalization and comparison
- **Alternative answers:** Checks `answer.alt` array if primary answer fails
- **Tolerance handling:** Different precision for fractions (0.02) vs. decimals (0.01)

### Worksheet JSON Schema

```json
{
  "id": "unique-id",  // Must match filename (without .json)
  "title": "Worksheet Title",
  "topic": "Topic Name",
  "grade": "KS3|KS4 Foundation|KS4 Higher",
  "difficulty": "easy|medium|difficult",
  "estimatedTime": 15,
  "questions": [
    {
      "prompt_latex": "\\text{Question with } \\frac{LaTeX}{notation}",
      "answer": {
        "exact_latex": "1",      // For exact/numeric/fraction methods
        "roots": [2, 3],         // For solution_set (triggers dual fields)
        "pair": [2, 3],          // For solution_pair method
        "alt": ["1.0", "1/1"]    // Alternative formats (optional)
      },
      "marking": {
        "method": "numeric_equal|fraction_equivalence|solution_set|solution_pair|exact",
        "tolerance": 0.01
      },
      "meta": {
        "coefficients": { "a": 1, "b": -5, "c": 6 },  // Enables auto-compute
        "subtopic": "string",
        "difficulty": "easy|medium|difficult"
      }
    }
  ]
}
```

**Critical:** `marking.method: "solution_set"` with `answer.roots: [x1, x2]` automatically triggers dual-field rendering (x₁ and x₂ inputs).

## File Structure

```
/
├── index.html, arcade.html        # Arcade interfaces (worksheet selection)
├── worksheet.html                 # Main worksheet player
├── quadratic-demo.html            # Standalone graphing calculator
├── prompt-builder.html            # Question prompt builder tool
├── css/
│   ├── styles.css                # Global styling
│   ├── worksheet.css             # Worksheet + MathLive field styles
│   └── arcade-theme.css          # Arcade-specific theme
├── js/
│   ├── worksheet-loader.js       # Core: worksheet loading, rendering, state
│   ├── mathlive-handler.js       # Core: MathLive fields, keyboards, feedback
│   ├── answer-checker.js         # Core: answer validation methods
│   ├── katex-renderer.js         # LaTeX rendering utilities
│   └── quadratic-plotter.js      # Graphing functionality
├── worksheets/                   # Source worksheet JSON files
└── public/                       # **Deployment mirror** (copy of root files)
```

**Deployment:** The `/public/` directory mirrors root structure. Deploy either root or public/ to web server. All dependencies load via CDN (Tailwind, KaTeX, MathLive).

## Development Tasks

### Testing Worksheets
Open `worksheet.html?id={worksheet-id}` in browser (id = JSON filename without extension)

Example: `/worksheets/quadratic-equations-demo.json` → `worksheet.html?id=quadratic-equations-demo`

**Quick test with all features:** `worksheet.html?id=quadratic-equations-compute-demo`

### Adding New Worksheets

1. Create JSON in `/worksheets/` following schema above
2. Choose `marking.method` based on answer type:
   - `solution_set`: Quadratic roots (triggers dual x₁/x₂ fields)
   - `fraction_equivalence`: Fractions (handles multiple formats)
   - `numeric_equal`: Numbers with tolerance
   - `exact`: Algebraic expressions (LaTeX matching)
3. For quadratics: add `meta.coefficients: {a, b, c}` to enable auto-compute button
4. Open in browser to test

### Adding New Marking Methods

Extend `answer-checker.js`:
1. Add case to `AnswerChecker.check()` switch statement
2. Implement `static check{MethodName}(studentAnswer, correctAnswer, tolerance)`
3. Use `this.parseNumeric()` or `this.parseFraction()` helpers for LaTeX parsing
4. Return `{correct: boolean, message: string}`

### Customizing Virtual Keyboards

Edit keyboard methods in `mathlive-handler.js`:
- `createKS3KS4Keyboard()`, `createAlgebraKeyboard()`, etc.
- Each returns `{label, tooltip, rows: []}`
- Rows contain button definitions: `{class, latex, label}` or `'[7]'` for numbers
- See MathLive keyboard API: https://cortexjs.io/mathlive/guides/virtual-keyboards/

To change which keyboard appears for a question type:
- Modify keyboard assignment logic in `createMathField()` method

## Styling Architecture

**Arcade Theme:**
- "Press Start 2P" font (Google Fonts) for retro gaming aesthetic
- Purple gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Gold accents: `#FFD700` (borders, badges, highlights)
- Inline styles in `index.html` with high specificity to override Tailwind defaults

**MathLive Visual Feedback:**
- `.correct` class → green border (`#10b981`)
- `.incorrect` class → red border (`#ef4444`)
- Applied directly to `<math-field>` elements by `mathlive-handler.js:applyFeedback()`
- CSS defined in `css/worksheet.css`

## Debugging

**Console Logs:**
- MathLive handler logs field creation, value retrieval, and feedback application
- Worksheet loader logs JSON fetch, question rendering, answer validation

**Browser DevTools:**
- Inspect `<math-field>` elements to see current LaTeX value and CSS classes
- Check `window.mathVirtualKeyboard.layouts` to verify registered keyboards
- Examine global state: `currentWorksheet`, `studentAnswers`, `questionStatus`

## Key Technical Details

**LaTeX Parsing Challenges:**
- MathLive outputs LaTeX (e.g., `\frac{3}{4}`)
- Answer checker must parse both LaTeX and text formats (e.g., `3/4`)
- Normalization strips whitespace and standardizes notation before comparison

**Dual Field Synchronization:**
- Quadratic questions create two separate MathLive instances (x₁ and x₂)
- Both fields controlled by same keyboard toggle buttons
- Validation checks both fields simultaneously, applies feedback to both
- Implementation in `createDualFieldQuestion()` and `handleDualFieldAnswer()`

**Auto-Compute Feature:**
- Requires `meta.coefficients: {a, b, c}` in question JSON
- Calculates discriminant (b² - 4ac) and quadratic formula roots
- Inserts calculated values into x₁ and x₂ fields
- Does not automatically check answer (student must click "Check")

## CDN Dependencies

Static site loads all dependencies externally:
- **Tailwind CSS:** Latest via CDN
- **KaTeX:** v0.16.9 (CSS + JS)
- **MathLive:** Latest from unpkg.com

No build process, npm, or package.json required. Works with any static web server or file:// protocol.
