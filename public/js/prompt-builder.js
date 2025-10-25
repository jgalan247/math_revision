// Prompt Builder JavaScript
const form = document.getElementById('promptForm');
const output = document.getElementById('output');
const promptOutput = document.getElementById('promptOutput');
const copyBtn = document.getElementById('copyBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const topic = document.getElementById('topic').value;
    const difficulty = document.getElementById('difficulty').value;
    const grade = document.getElementById('grade').value;
    const questionsUrl = document.getElementById('questionsUrl').value;
    const answersUrl = document.getElementById('answersUrl').value;

    const prompt = generatePrompt(topic, difficulty, grade, questionsUrl, answersUrl);
    
    promptOutput.textContent = prompt;
    output.classList.remove('hidden');
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptOutput.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('bg-green-700');
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('bg-green-700');
        }, 2000);
    });
});

function generatePrompt(topic, difficulty, grade, questionsUrl, answersUrl) {
    return `**TASK: Generate a Math Worksheet JSON from Corbett Maths PDFs**

**Topic:** ${topic}

**Difficulty:** ${difficulty}

**Grade:** ${grade}

**Questions PDF:** ${questionsUrl}

**Answers PDF:** ${answersUrl}

---

**INSTRUCTIONS:**

1. Fetch and analyze BOTH PDFs from the provided URLs
2. Study the question patterns, style, and difficulty level
3. Create NEW questions inspired by the worksheet patterns (DO NOT copy verbatim)
4. Generate corresponding answers based on your created questions
5. Output ONLY valid JSON - no explanations, no markdown blocks

**JSON STRUCTURE:**

\`\`\`json
{
  "id": "unique-id",
  "title": "Descriptive Title",
  "topic": "${topic}",
  "grade": "${grade}",
  "difficulty": "${difficulty}",
  "estimatedTime": 20,
  "sources": {
    "questions": "${questionsUrl}",
    "answers": "${answersUrl}"
  },
  "questions": [
    {
      "prompt_latex": "KaTeX-safe LaTeX string",
      "answer": {
        ${getAnswerFormat(topic)}
      },
      "marking": {
        "method": "${getMarkingMethod(topic)}",
        "tolerance": 0.01
      },
      "meta": {
        "subtopic": "specific subtopic",
        "difficulty": "easy|medium|hard"
      }
    }
  ]
}
\`\`\`

**KEY REQUIREMENTS:**
- Create NEW questions based on the patterns in the provided worksheets
- All LaTeX must be KaTeX-compatible (use \\\\frac, \\\\times, \\\\div, etc.)
- Generate answers for your created questions with appropriate marking criteria
- Include alternative answer formats where appropriate
- Generate 8-12 questions matching the worksheet's style and difficulty`;
}

function getAnswerFormat(topic) {
    switch(topic) {
        case 'Fractions':
            return `// FOR FRACTIONS:
        "exact_latex": "\\\\\\\\frac{3}{4}",
        "alt": ["0.75", "3/4"]`;
        case 'Linear Equations':
            return `// FOR LINEAR EQUATIONS:
        "exact_latex": "5"`;
        case 'Simultaneous Equations':
            return `// FOR SIMULTANEOUS:
        "pair": [2, 3],
        "alt": ["x=2, y=3", "(2,3)"]`;
        case 'Quadratics':
            return `// FOR QUADRATICS:
        "roots": [-2, 3],
        "alt": ["x=-2 or x=3", "x=-2, 3"]`;
        default:
            return '';
    }
}

function getMarkingMethod(topic) {
    switch(topic) {
        case 'Fractions':
            return 'fraction_equivalence';
        case 'Linear Equations':
            return 'numeric_equal';
        case 'Simultaneous Equations':
            return 'solution_pair';
        case 'Quadratics':
            return 'solution_set';
        default:
            return 'numeric_equal';
    }
}
