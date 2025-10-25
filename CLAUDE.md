# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static web application for students to practice math problems with instant feedback. Students work through interactive worksheets with LaTeX-rendered questions and submit answers using a MathLive-powered math keyboard. The platform uses KaTeX for display and validates answers using configurable marking methods.

## Development

This is a static site with no build process. Run a local server:

```bash
# Python
python -m http.server 8000

# Or Node.js
npx serve
```

Open browser to `http://localhost:8000`

## Architecture

### Core Flow
1. **Home page** (`index.html`) → Lists available worksheets from `worksheets/` directory
2. **Worksheet page** (`worksheet.html?id=<worksheet-id>`) → Loads specific worksheet, renders questions, collects answers
3. **Prompt Builder** (`prompt-builder.html`) → Generates prompts for creating new worksheet JSONs

### JavaScript Modules

The application uses vanilla JavaScript with a modular structure:

- **`worksheet-loader.js`** - Central orchestrator
  - Loads worksheet list on home page
  - Loads individual worksheets on worksheet page
  - Manages submission flow and results display
  - Coordinates between katex-renderer, answer-checker, and mathlive-handler

- **`mathlive-handler.js`** - Math input management
  - Creates MathLive math-field elements for each question
  - Provides custom calculator-style virtual keyboard
  - Returns LaTeX values for answer checking
  - Handles visual feedback (correct/incorrect styling)

- **`answer-checker.js`** - Answer validation
  - Receives LaTeX from MathLive and compares against correct answers
  - Supports multiple marking methods (see Marking Methods section)
  - Parses LaTeX fractions, numerics, and solution pairs/sets

- **`katex-renderer.js`** - Display rendering
  - Renders question prompts using KaTeX
  - Auto-renders all elements with `.latex` class and `data-latex` attribute

### Data Flow

```
User clicks worksheet → worksheet-loader fetches JSON → displays header
                     ↓
         Creates question cards with LaTeX prompts (katex-renderer)
                     ↓
         Creates MathLive fields for input (mathlive-handler)
                     ↓
User submits → worksheet-loader calls answer-checker for each question
                     ↓
         answer-checker returns {correct, message}
                     ↓
         mathlive-handler applies visual feedback
         feedback messages displayed
         results summary shown
```

## Worksheet JSON Schema

Worksheets are JSON files in `worksheets/` directory with this structure:

```json
{
  "id": "unique-id",
  "title": "Worksheet Title",
  "topic": "Fractions",
  "grade": "KS3",
  "difficulty": "easy|medium|difficult",
  "estimatedTime": 20,
  "sources": {
    "questions": "URL to source PDF",
    "answers": "URL to answers PDF"
  },
  "questions": [
    {
      "prompt_latex": "\\text{Question text} \\frac{1}{2}",
      "answer": {
        "exact_latex": "\\frac{3}{4}",
        "alt": ["0.75", "3/4"]
      },
      "marking": {
        "method": "fraction_equivalence",
        "tolerance": 0.01
      },
      "meta": {
        "subtopic": "Adding fractions",
        "difficulty": "easy"
      }
    }
  ]
}
```

### Marking Methods

The `marking.method` field determines how answers are validated:

- **`fraction_equivalence`** - Converts fractions to decimals and compares within tolerance
  - Answer format: `{"exact_latex": "\\frac{3}{4}", "alt": ["0.75", "3/4"]}`

- **`numeric_equal`** - Parses numbers and compares within tolerance
  - Answer format: `{"exact_latex": "42"}`

- **`solution_pair`** - For simultaneous equations (x, y pairs)
  - Answer format: `{"pair": [2, 3], "alt": ["x=2, y=3", "(2,3)"]}`

- **`solution_set`** - For quadratics (multiple roots)
  - Answer format: `{"roots": [-2, 3], "alt": ["x=-2 or x=3"]}`

- **`exact`** (default) - Normalized LaTeX string comparison
  - Answer format: `{"exact_latex": "\\sqrt{16}"}`

### Answer Checking Implementation

The `AnswerChecker` class (in `answer-checker.js`) receives LaTeX from MathLive and:
1. Selects marking method from question.marking.method
2. Parses student LaTeX (e.g., `\\frac{3}{4}` → 0.75)
3. Compares against exact_latex and alternative formats
4. Returns `{correct: boolean, message: string}`

## Adding New Worksheets

### Using Prompt Builder

1. Navigate to `/prompt-builder.html`
2. Select topic, difficulty, and grade
3. Provide URLs to Corbett Maths question and answer PDFs
4. Click "Generate Prompt" and copy the output
5. Give the prompt to Claude (with PDFs) to generate worksheet JSON
6. Save JSON as `worksheets/<topic-grade-difficulty-###>.json`
7. Refresh home page - new worksheet appears automatically

The prompt builder generates structured prompts that instruct Claude to:
- Analyze the source PDFs for question patterns
- Create NEW questions (not copy verbatim) following those patterns
- Generate appropriate answers with correct marking methods
- Output valid JSON matching the schema

## LaTeX Requirements

All LaTeX must be KaTeX-compatible:
- Fractions: `\\frac{numerator}{denominator}`
- Multiplication: `\\times` not `\\cdot`
- Division: `\\div`
- Text: `\\text{Your text here}`
- Avoid unsupported commands (check KaTeX documentation)

## MathLive Integration

The platform uses MathLive for math input with specialized keyboards for KS3/KS4 curriculum:

### Available Keyboards

All keyboards are defined in `mathlive-handler.js` → `createCustomKeyboards()`:

1. **KS3/KS4** (default) - Comprehensive keyboard for UK math curriculum
   - Powers: □², □³, □^□, □⁻¹ (reciprocals)
   - Roots: √□, ³√□, ⁿ√□
   - Special symbols: π, %, : (ratio)
   - All arithmetic operators

2. **Algebra** - Focused on algebraic expressions
   - Variables: x, y, a, b, n
   - Powers and roots
   - Inequalities: <, >

3. **Quadratic** - Quadratic equations and graphing
   - Large quadratic formula button: x = (-b±√(b²-4ac))/2a
   - Standard form entry: ax²+bx+c=0
   - Coefficient templates: a=, b=, c=
   - Solution notation: x₁=, x₂=
   - Plus-minus symbol: ±
   - Paired with `quadratic-plotter.js` for graphing

4. **Calculus** - Differential calculus and integration
   - Derivatives: d/dx, d²/dx², dy/dx, d²y/dx², f'(x), f''(x)
   - Partial derivatives: ∂/∂x
   - Integrals: ∫, ∫ₐᵇ (with bounds)
   - Limits: lim
   - Trig functions: sin, cos, tan
   - Exponential and logarithms: eˣ, ln
   - Infinity: ∞

5. **Compare (Inequalities)** - For inequality problems
   - Full set: <, >, ≤, ≥, ≠
   - Variables and operators

6. **Basic (Calculator)** - Simple arithmetic
   - Calculator-style layout
   - Fractions, basic powers, roots

### Configuration
- Keyboards registered via: `window.mathVirtualKeyboard.layouts = [...]`
- Available keyboards: KS3/KS4, Algebra, Quadratic, Calculus, Compare (Inequalities), Basic
- Manual virtual keyboard mode (toggle button per question)
- Returns LaTeX via `mathLiveHandler.getValue(index)`
- Users can switch between keyboards using tabs at top of keyboard

## Quadratic Function Plotter

The `quadratic-plotter.js` module provides interactive graphing for quadratic functions.

### Usage

```javascript
// Create a plot
quadraticPlotter.createPlot(containerId, a, b, c, questionIndex);

// Update existing plot
quadraticPlotter.updatePlot(questionIndex, a, b, c);

// Remove plot
quadraticPlotter.removePlot(questionIndex);
```

### Features

- Canvas-based plotting with automatic scaling
- Displays parabola curve (blue line)
- Shows vertex (red dot) - turning point
- Shows roots/x-intercepts (green dots) when they exist
- Grid lines and axis labels
- Information panel showing:
  - Function equation
  - Vertex coordinates
  - Direction (opens upward/downward)
  - Discriminant value
  - Root values and classification (two real, one repeated, or complex)

### Demo

See `quadratic-demo.html` for a complete interactive demo with:
- Coefficient input controls
- Real-time plotting
- Example problems
- Quadratic keyboard integration

## File Structure

```
/
├── index.html              # Home page (worksheet list)
├── worksheet.html          # Worksheet viewer
├── prompt-builder.html     # Prompt generator
├── css/
│   ├── styles.css          # Home page styles
│   └── worksheet.css       # Worksheet page styles
├── js/
│   ├── worksheet-loader.js  # Core orchestrator
│   ├── answer-checker.js    # Answer validation logic
│   ├── mathlive-handler.js  # Math input management
│   ├── katex-renderer.js    # LaTeX rendering
│   ├── quadratic-plotter.js # Quadratic function graphing
│   └── prompt-builder.js    # Prompt generation
└── worksheets/
    └── *.json              # Worksheet data files
```

## Key Conventions

- **Global state**: `currentWorksheet` in worksheet-loader.js holds active worksheet
- **Question indexing**: Zero-indexed throughout (question-0, question-1, etc.)
- **MathLive singleton**: `mathLiveHandler` global instance manages all math fields
- **Async loading**: MathLive loads asynchronously; worksheet-loader waits for it
- **No routing**: Uses query params (`?id=worksheet-id`) for navigation
