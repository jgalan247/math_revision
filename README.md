# Math Revision Platform

A static web application for students to practice math problems with instant feedback.

## Features

- 📝 Interactive math worksheets with KaTeX rendering
- ✅ Instant answer validation
- 🎯 Multiple marking methods (fractions, equations, solution pairs)
- 🔧 Prompt builder for creating new worksheets
- 📱 Responsive design

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
      }
    }
  ]
}
```

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

## License

MIT
# math_revision
