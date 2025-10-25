# Answer Checking Guide

This guide explains how to check answers in the Math Revision Platform.

## How Answer Checking Works

### 1. In Worksheets (Automated)

When students complete worksheets, answers are checked automatically using the `AnswerChecker` class in `js/answer-checker.js`.

**Process:**
1. Student enters answer using MathLive keyboard
2. Answer is converted to LaTeX format
3. `AnswerChecker.check()` compares student answer to correct answer
4. Feedback is displayed (✅ Correct! or ❌ Incorrect with expected answer)

### 2. Available Marking Methods

#### `fraction_equivalence`
Checks if fractions are mathematically equivalent.

**Worksheet JSON:**
```json
{
  "prompt_latex": "\\text{Simplify: } \\frac{2}{3} + \\frac{1}{3}",
  "answer": {
    "exact_latex": "1",
    "alt": ["1", "3/3", "\\frac{3}{3}"]
  },
  "marking": {
    "method": "fraction_equivalence",
    "tolerance": 0.01
  }
}
```

**Accepted formats:**
- LaTeX: `\frac{3}{4}`
- Text: `3/4`
- Decimal: `0.75`

---

#### `numeric_equal`
Checks if numbers are equal within tolerance.

**Worksheet JSON:**
```json
{
  "prompt_latex": "\\text{Solve: } 2x + 5 = 13",
  "answer": {
    "exact_latex": "4"
  },
  "marking": {
    "method": "numeric_equal",
    "tolerance": 0.01
  }
}
```

**Accepted formats:**
- Any numeric value: `4`, `4.0`, `4.00`

---

#### `solution_pair`
For simultaneous equations with two variables (x, y).

**Worksheet JSON:**
```json
{
  "prompt_latex": "\\text{Solve: } x + y = 5, \\quad x - y = 1",
  "answer": {
    "pair": [3, 2],
    "alt": ["x=3, y=2", "(3,2)"]
  },
  "marking": {
    "method": "solution_pair",
    "tolerance": 0.01
  }
}
```

**Accepted formats:**
- `x=3, y=2`
- `(3, 2)`
- `3, 2`

---

#### `solution_set` ⭐ (Perfect for Quadratics!)
For equations with multiple solutions (like quadratic equations).

**Worksheet JSON:**
```json
{
  "prompt_latex": "\\text{Solve: } x^{2} - 5x + 6 = 0",
  "answer": {
    "roots": [2, 3],
    "alt": ["x=2, x=3", "2, 3", "x_{1}=2, x_{2}=3"]
  },
  "marking": {
    "method": "solution_set",
    "tolerance": 0.01
  }
}
```

**Accepted formats:**
- `2, 3`
- `x=2, x=3`
- `x₁=2, x₂=3`
- Order doesn't matter: `3, 2` is also correct

**How it works:**
1. Extracts all numbers from student answer
2. Sorts both student and correct answers
3. Compares each value within tolerance
4. Returns correct if all values match

---

#### `exact`
Requires exact LaTeX match (normalized).

**Worksheet JSON:**
```json
{
  "prompt_latex": "\\text{Express in simplest form: } \\sqrt{16}",
  "answer": {
    "exact_latex": "4"
  },
  "marking": {
    "method": "exact"
  }
}
```

**Note:** Whitespace and `\left`/`\right` commands are normalized.

---

## Using Answer Checking for Quadratic Equations

### Example Worksheet Question

```json
{
  "prompt_latex": "\\text{Solve: } x^{2} + 2x - 8 = 0",
  "answer": {
    "roots": [-4, 2],
    "alt": ["x=-4, x=2", "-4, 2", "x_{1}=-4, x_{2}=2"]
  },
  "marking": {
    "method": "solution_set",
    "tolerance": 0.01
  },
  "meta": {
    "subtopic": "Quadratic formula",
    "difficulty": "medium",
    "coefficients": {
      "a": 1,
      "b": 2,
      "c": -8
    }
  }
}
```

### Student Workflow

1. **See question:** "Solve: x² + 2x - 8 = 0"
2. **Open keyboard:** Click keyboard icon (⌨️)
3. **Switch to Quadratic keyboard:** Click "Quadratic" tab
4. **Use quadratic formula button:** Click the large formula button to insert it
5. **Enter values:**
   - Use `a=`, `b=`, `c=` buttons to note coefficients
   - Calculate using the formula
6. **Enter solutions:** Use `x₁=` and `x₂=` buttons or just type: `-4, 2`
7. **Submit:** Click "Submit Answers"
8. **See result:** ✅ "Correct!" or ❌ "Incorrect. Expected: -4, 2"

### Valid Student Answers

All of these will be marked correct:
- `-4, 2`
- `2, -4` (order doesn't matter)
- `x=-4, x=2`
- `x_{1}=-4, x_{2}=2`
- `x₁=-4, x₂=2`
- `-4.0, 2.0`

---

## Testing Answer Checking

### Try the Demo Worksheet

1. Start local server: `python -m http.server 8000`
2. Open: `http://localhost:8000/worksheet.html?id=quadratic-equations-demo`
3. Try solving the quadratic equations
4. Submit answers to test the checking

### Example Test Cases

**Question 1:** x² - 5x + 6 = 0
- **Correct answers:** `2, 3` or `3, 2` or `x=2, x=3`
- **Incorrect answer:** `1, 6` → Shows "Incorrect. Expected: 2, 3"

**Question 2:** x² - 4 = 0
- **Correct answers:** `-2, 2` or `2, -2`
- **Incorrect answer:** `4` → Shows "Incorrect. Expected: -2, 2"

**Question 5:** x² + 6x + 9 = 0 (repeated root)
- **Correct answers:** `-3` or `-3, -3`
- **Incorrect answer:** `3` → Shows "Incorrect. Expected: -3, -3"

---

## Programmatic Answer Checking

You can also check answers programmatically in JavaScript:

```javascript
// Check a quadratic solution
const studentAnswer = "2, 3";
const correctAnswer = {
  roots: [2, 3]
};

const result = AnswerChecker.check(
  studentAnswer,
  correctAnswer,
  'solution_set',
  0.01  // tolerance
);

console.log(result.correct);  // true or false
console.log(result.message);  // "Correct!" or "Incorrect. Expected: ..."
```

---

## Adding Custom Marking Methods

To add a new marking method, edit `js/answer-checker.js`:

```javascript
static check(studentAnswer, correctAnswer, markingMethod, tolerance = 0.01) {
  switch (markingMethod) {
    case 'your_new_method':
      return this.checkYourNewMethod(studentAnswer, correctAnswer, tolerance);
    // ... existing cases
  }
}

static checkYourNewMethod(studentAnswer, correctAnswer, tolerance) {
  // Your validation logic here

  return {
    correct: true/false,
    message: 'Feedback message'
  };
}
```

---

## Troubleshooting

### "Invalid format" errors

**Problem:** Student enters answer in unexpected format
**Solution:** Add more alternative formats to the `alt` array in worksheet JSON

**Example:**
```json
"answer": {
  "roots": [2, 3],
  "alt": [
    "x=2, x=3",
    "2, 3",
    "x₁=2, x₂=3",
    "x1=2, x2=3",  // Added this
    "(2,3)"         // Added this
  ]
}
```

### Tolerance issues

**Problem:** Answer is "almost correct" but marked wrong
**Solution:** Increase tolerance in marking method

```json
"marking": {
  "method": "solution_set",
  "tolerance": 0.1  // Increased from 0.01
}
```

### Order matters for solution_set

**Don't worry!** The `solution_set` method automatically sorts both student and correct answers before comparing, so order doesn't matter.

- `2, 3` ✅
- `3, 2` ✅
- Both are correct!

---

## Summary

| Marking Method | Use For | Example |
|----------------|---------|---------|
| `fraction_equivalence` | Fractions, decimals | `3/4`, `0.75`, `\frac{3}{4}` |
| `numeric_equal` | Single numbers | `42`, `3.14` |
| `solution_pair` | Simultaneous equations | `x=2, y=3` |
| `solution_set` | Quadratics, polynomials | `x=2, x=3` |
| `exact` | Exact LaTeX match | `\sqrt{2}` |

For **quadratic equations**, use `solution_set` - it's flexible, order-independent, and accepts multiple formats!
