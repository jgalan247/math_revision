# Quadratic Dual Fields - Feature Documentation

## Overview

Quadratic equation questions now display **TWO separate input fields** for x₁ and x₂, instead of a single field where students must enter "2, 3".

---

## Visual Layout

### Before (Single Field):
```
Final Answer: (click here or keyboard icon when ready)
┌─────────────────────────┐ [⌨️]
│ Enter: 2, 3             │
└─────────────────────────┘
```

### After (Dual Fields):
```
Final Answer: (click here or keyboard icon when ready)

x₁ = ┌──────────┐ [⌨️]    x₂ = ┌──────────┐ [⌨️]
     │ Enter: 2 │              │ Enter: 3 │
     └──────────┘              └──────────┘
```

---

## How It Works

### 1. Automatic Detection

Quadratic questions are detected by checking:
- `marking.method === 'solution_set'`
- `answer.roots` exists

**Example JSON:**
```json
{
  "answer": {
    "roots": [2, 3]
  },
  "marking": {
    "method": "solution_set",
    "tolerance": 0.01
  }
}
```

### 2. Field Creation

**For quadratic questions:**
- Creates TWO MathLive fields
- Each has its own keyboard toggle button
- Labels: "x₁ =" and "x₂ ="
- Side-by-side layout (responsive)

**For non-quadratic questions:**
- Creates ONE MathLive field
- Single keyboard toggle button
- Standard layout

### 3. Answer Combination

When student enters:
- x₁ = `2`
- x₂ = `3`

The `getValue()` method automatically combines them as: `"2,3"`

This is then checked against `answer.roots: [2, 3]` using the existing `solution_set` marking method.

---

## Implementation Details

### JavaScript Changes

**File:** `js/mathlive-handler.js`

**1. Detection Logic:**
```javascript
const isQuadratic = question &&
                   question.marking &&
                   question.marking.method === 'solution_set' &&
                   question.answer &&
                   question.answer.roots;
```

**2. Dual Field Creation:**
```javascript
if (isQuadratic) {
    // Create x₁ field
    mathField = document.createElement('math-field');
    mathField.id = `math-field-${questionIndex}`;

    // Create x₂ field
    mathField2 = document.createElement('math-field');
    mathField2.id = `math-field-2-${questionIndex}`;

    // Store both
    this.mathFields.set(questionIndex, {
        field: mathField,
        field2: mathField2,
        isQuadratic: true
    });
}
```

**3. Value Combination:**
```javascript
getValue(questionIndex) {
    const data = this.mathFields.get(questionIndex);

    if (data.isQuadratic && data.field2) {
        const x1 = data.field.value.trim();
        const x2 = data.field2.value.trim();
        return x1 && x2 ? `${x1},${x2}` : '';
    } else {
        return data.field.value;
    }
}
```

**4. Feedback Application:**
```javascript
applyFeedback(questionIndex, isCorrect) {
    const { field, field2, isQuadratic } = data;

    // Apply to both fields
    field.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (isQuadratic && field2) {
        field2.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
}
```

### CSS Styling

**File:** `css/worksheet.css`

```css
/* Container for both fields */
.dual-fields-container {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

/* Each field container */
.answer-field-container.quadratic-field {
    flex: 1;
    min-width: 250px;
}

/* x₁ = and x₂ = labels */
.quadratic-field-label {
    font-weight: 600;
    color: #374151;
    font-size: 1.1rem;
    margin-right: 0.5rem;
}
```

---

## User Experience

### Student Workflow

1. **See question:** "Solve: x² - 5x + 6 = 0"
2. **Work in work area:** Show calculations
3. **Click Calculate** (optional): See x₁ = 2, x₂ = 3
4. **Enter x₁:** Click first field, enter `2`
5. **Enter x₂:** Click second field, enter `3`
6. **Check answer:** Both fields turn green ✅

### Benefits

✅ **Clarity:** Separate fields for each root
✅ **No confusion:** Don't need to remember "2, 3" format
✅ **Visual:** Clearly shows "x₁ =" and "x₂ ="
✅ **Order independence:** Still works (AnswerChecker sorts)
✅ **Individual feedback:** Each field gets green/red border
✅ **Math keyboard:** Each field has its own keyboard button

---

## Compatibility

### Backward Compatible

- Non-quadratic questions: Single field (as before)
- Old worksheets: Continue to work
- `solution_set` method: Still handles "2,3" format

### Question Types Supported

**Dual Fields (quadratic):**
- x² - 5x + 6 = 0 → Two distinct roots
- x² - 4 = 0 → Two roots (one positive, one negative)
- x² - 4x + 4 = 0 → Repeated root (both fields show same)

**Single Field (non-quadratic):**
- Fractions: 3/4
- Single numbers: 42
- Expressions: 2x + 3
- Anything not using solution_set

---

## Special Cases

### Repeated Roots

**Question:** x² + 6x + 9 = 0
**Answer:** x = -3 (repeated)

**Student enters:**
- x₁ = `-3`
- x₂ = `-3`

**Result:** ✅ Correct (both fields have same value)

### Complex Roots (No Real Solutions)

**Question:** x² + 2x + 5 = 0
**Answer:** No real solutions

**Handling:** This uses `exact` marking method, not `solution_set`, so it displays a single field.

---

## Testing

### Test Cases

**1. Standard Quadratic:**
```
Question: x² - 5x + 6 = 0
Expected: x₁ = 2, x₂ = 3
Should see: TWO fields side-by-side
```

**2. Negative Roots:**
```
Question: x² - 4 = 0
Expected: x₁ = -2, x₂ = 2
Should see: TWO fields side-by-side
```

**3. Repeated Root:**
```
Question: x² + 6x + 9 = 0
Expected: x = -3
Should see: TWO fields (enter -3 in both)
```

**4. Non-Quadratic:**
```
Question: Simplify 3/4
Expected: 3/4
Should see: ONE field (single answer)
```

### Visual Verification

- [ ] Two fields appear for quadratics
- [ ] Fields are side-by-side on desktop
- [ ] Fields stack on mobile
- [ ] Each field has blue border
- [ ] Each field has keyboard icon
- [ ] Labels show "x₁ =" and "x₂ ="
- [ ] Both fields turn green when correct
- [ ] Both fields turn red when incorrect

---

## Code Flow

```
1. loadWorksheet()
   ↓
2. createQuestionCard(question, index)
   ↓
3. createQuestionFields(containerId, index, question)
   ↓
4. Detect: Is it quadratic?
   ├─ YES: Create dual fields (x₁ and x₂)
   └─ NO:  Create single field
   ↓
5. Student enters answers
   ↓
6. checkSingleAnswer(index)
   ↓
7. getValue(index)
   ├─ Quadratic: Combine "x1,x2"
   └─ Other: Return single value
   ↓
8. AnswerChecker.check()
   ↓
9. applyFeedback()
   ├─ Quadratic: Apply to both fields
   └─ Other: Apply to single field
```

---

## Files Modified

1. **js/mathlive-handler.js** (Major changes)
   - Added `question` parameter to `createQuestionFields()`
   - Added quadratic detection logic
   - Added dual field creation
   - Modified `getValue()` to combine fields
   - Modified `applyFeedback()` to handle both fields

2. **js/worksheet-loader.js** (Minor change)
   - Pass `question` to `createQuestionFields()`

3. **css/worksheet.css** (New styles)
   - Added `.dual-fields-container`
   - Added `.quadratic-field` modifier
   - Added `.quadratic-field-label`

---

## Migration Notes

### For Existing Worksheets

No changes needed! Worksheets automatically benefit from dual fields if they use:
- `marking.method: "solution_set"`
- `answer.roots: [...]`

### For New Worksheets

Just use the standard format:
```json
{
  "answer": {
    "roots": [2, 3]
  },
  "marking": {
    "method": "solution_set"
  }
}
```

Dual fields will appear automatically!

---

## Success!

✅ Quadratic questions now have clear, separate fields for x₁ and x₂
✅ Automatically detected based on marking method
✅ Backward compatible with all existing worksheets
✅ Better UX: No need to remember "2, 3" format
✅ Visual clarity: Students see exactly where each root goes

**Ready to test!** 🎉
