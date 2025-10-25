# User Experience Flow - Worksheet Interface

## Student Workflow

### The Intended Flow

1. **Page Loads** → Work area auto-focuses (cursor ready to type)
2. **Show Working** → Student types calculations in work area
3. **Ready for Answer** → Student clicks:
   - Final Answer field directly, OR
   - Keyboard icon button
4. **Enter Answer** → Use MathLive field with virtual keyboard
5. **Check** → Click "Check Answer" button
6. **Get Feedback** → See immediate visual feedback

---

## Why the Keyboard Button Focuses the Final Answer Field

### Current Behavior (By Design)

When a student clicks the keyboard icon (⌨️):
1. Focus moves to the Final Answer field
2. MathLive virtual keyboard appears
3. Student can enter their answer

### Why This Makes Sense

The keyboard button is **specifically for the Final Answer field**, not the work area:

**Work Area:**
- Regular text input
- No special math symbols needed
- Students type normally (just text and numbers)

**Final Answer Field:**
- MathLive mathematical input
- Needs special symbols (fractions, powers, roots, etc.)
- Virtual keyboard provides these symbols

**Therefore:** Clicking the keyboard icon is a signal that "I'm ready to enter my final answer" → Focus should move to the final answer field.

---

## UX Improvements Made

### 1. Helper Text Added

**Label now shows:**
```
Final Answer: (click here or keyboard icon when ready)
```

**This communicates:**
- ✅ Work area is separate from final answer
- ✅ Two ways to move to final answer: click field OR click keyboard icon
- ✅ Keyboard icon is intentionally for the final answer
- ✅ "when ready" implies work area comes first

### 2. Tooltip on Keyboard Button

**Hover text:**
```
Click to enter final answer with math keyboard
```

**This makes it clear:**
- ✅ Button is for final answer entry
- ✅ Clicking will open keyboard
- ✅ Focus will move (expected behavior)

### 3. Auto-Focus on Work Area

**On page load:**
- ✅ Cursor automatically in Question 1's work area
- ✅ Visual cue: solid border + white background
- ✅ Student can start typing immediately

**This guides students to:**
1. Start with working out
2. Then move to final answer when ready

---

## Alternative Approaches (Not Implemented)

### Option A: Keyboard Button Doesn't Change Focus

**Pros:**
- Students can toggle keyboard while in work area
- Less "surprising" behavior

**Cons:**
- Work area doesn't need the math keyboard (it's just text)
- Virtual keyboard would appear but not be usable
- Confusing UX: keyboard open but typing goes to work area
- MathLive keyboard is specifically designed for MathLive fields

**Verdict:** ❌ Not a good UX

### Option B: Two Keyboard Buttons

**Pros:**
- One for work area (if needed)
- One for final answer

**Cons:**
- Work area doesn't need math symbols
- Cluttered interface
- Confusing: which keyboard for what?

**Verdict:** ❌ Over-engineered

### Option C: Hide Keyboard Button Until Final Answer Focused

**Pros:**
- Can't accidentally click keyboard button while in work area
- Clearer separation

**Cons:**
- Students might not know how to open keyboard
- Keyboard button is a discovery affordance

**Verdict:** ⚠️ Possible but reduces discoverability

---

## Current Solution (Implemented)

### ✅ Clear Labeling + Expected Behavior

**What we did:**
1. ✅ Added helper text: "(click here or keyboard icon when ready)"
2. ✅ Added tooltip: "Click to enter final answer with math keyboard"
3. ✅ Auto-focus work area on page load
4. ✅ Visual distinction: work area (dashed) vs final answer (solid blue)
5. ✅ Keyboard button intentionally focuses final answer field

**Why this works:**
- Clear communication of workflow
- Expected behavior for a "math keyboard" button
- Visual guidance (auto-focus, borders, labels)
- No accidental clicks if students read the label
- Progressive disclosure: work first, answer second

---

## Student Mental Model

### What Students Learn

**Work Area (Dashed Box):**
- "This is where I show my calculations"
- "I can type normally here"
- "This is optional"
- Auto-focused = "Start here"

**Final Answer (Blue Box):**
- "This is where my actual answer goes"
- "This gets checked/graded"
- "I need the keyboard button for math symbols"
- "When I'm ready, I click here or the keyboard icon"

**Keyboard Icon:**
- "Opens the math keyboard"
- "Lets me enter fractions, powers, etc."
- "For my final answer, not my working"

---

## Testing the Flow

### Test Scenario

1. **Load page** → Cursor in work area ✓
2. **Type working:** "a=1, b=-5, c=6" ✓
3. **Type more:** "discriminant = 25-24 = 1" ✓
4. **Read label:** "Final Answer: (click here or keyboard icon when ready)"
5. **Click keyboard icon** → Focus moves to final answer ✓
6. **Expected:** This is intentional ✓
7. **Type answer:** Use virtual keyboard to enter "2,3" ✓
8. **Check answer** → Feedback appears ✓

### Alternative Flow

1. **Load page** → Cursor in work area ✓
2. **Type working** ✓
3. **Click final answer field directly** → Focus moves, can type
4. **Type answer** (can use keyboard if needed)
5. **Check answer** ✓

---

## Design Decision Summary

**Question:** Should the keyboard button steal focus from work area?

**Answer:** YES, and here's why:

1. **Purpose:** The keyboard button is for math symbols, which are only needed in the final answer field
2. **Communication:** We clearly label this with helper text
3. **Intent:** Clicking the keyboard means "I want to enter my final answer now"
4. **Alternative:** Students can click the final answer field directly if they don't want the keyboard
5. **Workflow:** This encourages the intended flow: work first, answer second

**The behavior is intentional and supported by clear UX communication.**

---

## Summary

✅ **Auto-focus work area** - Students start with working out
✅ **Helper text** - Clear guidance on when to use final answer
✅ **Tooltip** - Keyboard button purpose is clear
✅ **Intentional focus change** - Clicking keyboard = ready for final answer
✅ **Visual distinction** - Dashed vs solid borders guide workflow

**The UX flow is now clear and intuitive!** 📝✨
