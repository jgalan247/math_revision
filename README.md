# Math Revision Platform

A static web application for students to practice math problems with instant feedback.

## Features

- 📝 Interactive math worksheets with KaTeX rendering
- ✅ Instant answer validation with visual feedback
- 🎯 Multiple marking methods (fractions, equations, solution pairs)
- 🔧 Prompt builder for creating new worksheets
- 📱 Responsive design
- 🔮 Auto-calculation for quadratic equations
- 📊 Real-time progress tracking
- 🎨 Color-coded visual feedback system

## Getting Started

### Local Development

1. Start a local server:
```bash
# Python
python -m http.server 8000

# Or Node.js
npx serve
```

2. Open browser to `http://localhost:8000`

### Enhanced Worksheet Interface

The platform now includes an enhanced interactive interface for better learning:

**Test the enhanced interface:**
```
http://localhost:8000/worksheet.html?id=quadratic-equations-compute-demo
```

**Features include:**
1. **Work Area** - MathLive field with dashed border for showing calculations
   - ⌨️ Keyboard icon to open virtual math keyboard
   - Insert formulas (e.g., quadratic formula) with one click
   - Use proper math notation (fractions, powers, roots)
   - Optional - for showing your working
2. **Final Answer Box** - Dedicated blue-bordered MathLive field(s) for validated answers
   - Quadratic questions: **TWO separate fields** (x₁ and x₂)
   - Other questions: Single field
   - Each field has its own ⌨️ keyboard icon
3. **Calculate Button** - Auto-computes solutions for quadratic equations (purple button)
4. **Check Answer Button** - Individual per-question validation with immediate feedback
5. **Visual Feedback** - Color-coded borders on answer fields and question cards:
   - Blue: Default answer field
   - Green: Correct answers (with ✅) - both x₁ and x₂ turn green
   - Red: Incorrect answers (with ❌)
6. **Progress Bar** - Real-time tracking showing "X/Y answered (Z correct)"

**Status Badges:**
- Gray "Unanswered" - Not yet checked
- Green "Correct" - Answer is correct
- Red "Incorrect" - Answer is wrong

**Complete Student Workflow for Quadratics:**
1. Click work area ⌨️ icon → virtual keyboard opens
2. Click "Quadratic" tab → click formula button → formula inserted
3. Type values (a, b, c) and working
4. Click "Calculate Result" → see computed x₁ and x₂
5. Click x₁ field → enter first root
6. Click x₂ field → enter second root
7. Click "Check Answer" → both fields turn green if correct ✅

See [COMPLETE_WORKFLOW_GUIDE.md](COMPLETE_WORKFLOW_GUIDE.md) for detailed walkthrough.

### Quadratic Function Plotter

Visit `http://localhost:8000/quadratic-demo.html` to see the interactive quadratic function plotter:
- Enter coefficients a, b, c
- See real-time graph plotting
- View vertex, roots, discriminant analysis
- Color-coded information (roots, no roots, etc.)

### Adding Worksheets

1. Use the Prompt Builder to generate a prompt
2. Give the prompt to Claude to create a worksheet JSON
3. Save the JSON file to the `worksheets/` folder
4. Refresh the home page to see the new worksheet

## Worksheet JSON Format
```json
{
  "id": "unique-id",
  "title": "Worksheet Title",
  "topic": "Fractions",
  "grade": "KS3",
  "difficulty": "easy",
  "estimatedTime": 20,
  "questions": [
    {
      "prompt_latex": "KaTeX LaTeX string",
      "answer": {
        "exact_latex": "\\frac{3}{4}",
        "alt": ["0.75", "3/4"]
      },
      "marking": {
        "method": "fraction_equivalence",
        "tolerance": 0.01
      },
      "meta": {
        "coefficients": {
          "a": 1,
          "b": -5,
          "c": 6
        }
      }
    }
  ]
}
```

**Note:** The `meta.coefficients` field is optional and enables the Calculate button for quadratic equations.

### Marking Methods

- `fraction_equivalence` - Compares fractions and decimals
- `numeric_equal` - Number comparison with tolerance
- `solution_pair` - For simultaneous equations (x, y pairs)
- `solution_set` - For quadratic equations (order-independent roots)
- `exact` - Exact LaTeX string matching

See [ANSWER_CHECKING_GUIDE.md](ANSWER_CHECKING_GUIDE.md) for complete documentation.

## Deployment

Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- DigitalOcean App Platform (static site)

## Technologies

- HTML5
- CSS3 (Tailwind CDN)
- Vanilla JavaScript
- KaTeX for LaTeX rendering
- MathLive for mathematical input

## Documentation

Comprehensive guides are available:
- **[CLAUDE.md](CLAUDE.md)** - Complete development guide for Claude Code instances
- **[ANSWER_CHECKING_GUIDE.md](ANSWER_CHECKING_GUIDE.md)** - How answer validation works
- **[FEATURES_OVERVIEW.md](FEATURES_OVERVIEW.md)** - Complete feature set and use cases
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Comprehensive testing guide
- **[ENHANCED_INTERFACE_GUIDE.md](ENHANCED_INTERFACE_GUIDE.md)** - Quick test guide for new features
- **[COMPLETE_WORKFLOW_GUIDE.md](COMPLETE_WORKFLOW_GUIDE.md)** - Step-by-step student workflow with MathLive
- **[QUADRATIC_DUAL_FIELDS.md](QUADRATIC_DUAL_FIELDS.md)** - Dual x₁/x₂ fields implementation
- **[TWO_INPUT_AREAS_GUIDE.md](TWO_INPUT_AREAS_GUIDE.md)** - Work area vs final answer guide
- **[IMPLEMENTATION_VERIFICATION.md](IMPLEMENTATION_VERIFICATION.md)** - Complete verification and testing guide

## License

MIT

# math_revision

## MathLive Integration

This platform uses MathLive for mathematical input with specialized keyboards for KS3/KS4 curriculum.

### Available Keyboards:

**KS3/KS4 (Default)**
- Fractions: □/□
- Powers: □², □³, □^□, □⁻¹ (for reciprocals)
- Roots: √□, ³√□, ⁿ√□
- Pi (π) and percentage (%)
- Ratio symbol (:)
- All basic operators and numbers

**Algebra**
- Variables: x, y, a, b, n
- Powers: □², □³, □^□
- Square roots and fractions
- Inequality symbols: <, >
- Perfect for solving equations and expressions

**Quadratic**
- Quadratic formula: x = (-b±√(b²-4ac))/2a (large display button)
- Standard form: ax²+bx+c=0
- Quick entry for a=, b=, c= values
- Solution notation: x₁=, x₂=
- Plus-minus symbol: ±
- Perfect for solving quadratic equations
- **Includes graphing capability** - see quadratic-demo.html

**Calculus**
- Derivatives: d/dx, d²/dx², dy/dx, d²y/dx², f'(x), f''(x)
- Partial derivatives: ∂/∂x
- Integrals: ∫, ∫ₐᵇ (definite integrals)
- Limits: lim
- Functions: sin, cos, tan, eˣ, ln
- Infinity: ∞
- Perfect for differentiation and integration problems

**Compare (Inequalities)**
- Full inequality set: <, >, ≤, ≥, ≠
- All numbers and basic operators
- Variables: x, y

**Basic (Calculator)**
- Simple calculator-style layout
- Fractions, powers, square roots, cube roots
- Basic arithmetic operations

### Usage:
1. Click the keyboard icon (⌨️) next to any answer field
2. Switch between keyboards using the tabs at the top of the keyboard
3. Type using the visual keyboard
4. Use tab or click outside to close the keyboard
5. Submit answers when complete
