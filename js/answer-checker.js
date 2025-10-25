// Answer Checker - Validates student answers (works with LaTeX from MathLive)
class AnswerChecker {
    static check(studentAnswer, correctAnswer, markingMethod, tolerance = 0.01) {
        // studentAnswer is now LaTeX from MathLive
        switch (markingMethod) {
            case 'fraction_equivalence':
                return this.checkFraction(studentAnswer, correctAnswer, tolerance);
            case 'numeric_equal':
                return this.checkNumeric(studentAnswer, correctAnswer, tolerance);
            case 'solution_pair':
                return this.checkSolutionPair(studentAnswer, correctAnswer, tolerance);
            case 'solution_set':
                return this.checkSolutionSet(studentAnswer, correctAnswer, tolerance);
            default:
                return this.checkExact(studentAnswer, correctAnswer);
        }
    }

    static checkFraction(studentAnswer, correctAnswer, tolerance) {
        const studentValue = this.parseFraction(studentAnswer);
        const correctValue = this.parseFraction(correctAnswer.exact_latex);
        
        if (studentValue === null || correctValue === null) {
            return { correct: false, message: 'Invalid format' };
        }

        const isCorrect = Math.abs(studentValue - correctValue) < tolerance;
        
        if (!isCorrect && correctAnswer.alt) {
            for (let alt of correctAnswer.alt) {
                const altValue = this.parseFraction(alt);
                if (altValue !== null && Math.abs(studentValue - altValue) < tolerance) {
                    return { correct: true, message: 'Correct!' };
                }
            }
        }

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${this.latexToDisplay(correctAnswer.exact_latex)}`
        };
    }

    static checkNumeric(studentAnswer, correctAnswer, tolerance) {
        const studentValue = this.parseNumeric(studentAnswer);
        const correctValue = this.parseNumeric(correctAnswer.exact_latex);

        if (studentValue === null || correctValue === null) {
            return { correct: false, message: 'Invalid number format' };
        }

        const isCorrect = Math.abs(studentValue - correctValue) < tolerance;

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${correctAnswer.exact_latex}`
        };
    }

    static checkSolutionPair(studentAnswer, correctAnswer, tolerance) {
        // Parse LaTeX or text input like "x=2, y=3"
        const matches = studentAnswer.match(/[-]?\d+\.?\d*/g);
        if (!matches || matches.length !== 2) {
            return { correct: false, message: 'Invalid format. Expected: x=a, y=b or (a,b)' };
        }

        const studentX = parseFloat(matches[0]);
        const studentY = parseFloat(matches[1]);
        const [correctX, correctY] = correctAnswer.pair;

        const isCorrect = 
            Math.abs(studentX - correctX) < tolerance &&
            Math.abs(studentY - correctY) < tolerance;

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: x=${correctX}, y=${correctY}`
        };
    }

    static checkSolutionSet(studentAnswer, correctAnswer, tolerance) {
        const matches = studentAnswer.match(/[-]?\d+\.?\d*/g);
        if (!matches || matches.length !== correctAnswer.roots.length) {
            return { correct: false, message: 'Invalid format or wrong number of roots' };
        }

        const studentRoots = matches.map(parseFloat).sort((a, b) => a - b);
        const correctRoots = [...correctAnswer.roots].sort((a, b) => a - b);

        const isCorrect = studentRoots.every((root, i) => 
            Math.abs(root - correctRoots[i]) < tolerance
        );

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${correctRoots.join(', ')}`
        };
    }

    static checkExact(studentAnswer, correctAnswer) {
        // Normalize LaTeX for comparison
        const student = this.normalizeLatex(studentAnswer);
        const correct = this.normalizeLatex(correctAnswer.exact_latex);

        let isCorrect = student === correct;

        // Check alternative answers if provided
        if (!isCorrect && correctAnswer.alt) {
            for (let alt of correctAnswer.alt) {
                const normalizedAlt = this.normalizeLatex(alt);
                if (student === normalizedAlt) {
                    isCorrect = true;
                    break;
                }
            }
        }

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${this.latexToDisplay(correctAnswer.exact_latex)}`
        };
    }

    static parseFraction(input) {
        // Handle LaTeX fractions like \frac{3}{4}
        const latexMatch = input.match(/\\frac\{([^}]+)\}\{([^}]+)\}/);
        if (latexMatch) {
            const num = this.parseNumeric(latexMatch[1]);
            const den = this.parseNumeric(latexMatch[2]);
            if (num !== null && den !== null && den !== 0) {
                return num / den;
            }
        }

        // Handle text fractions like 3/4
        const fractionMatch = input.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
        if (fractionMatch) {
            const num = parseFloat(fractionMatch[1]);
            const den = parseFloat(fractionMatch[2]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return num / den;
            }
        }

        // Handle decimals
        return this.parseNumeric(input);
    }

    static parseNumeric(input) {
        // Remove LaTeX commands and extract numbers
        const cleaned = input.replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    static normalizeLatex(latex) {
        return latex
            .replace(/\s+/g, '')
            .replace(/\\left/g, '')
            .replace(/\\right/g, '')
            .toLowerCase();
    }

    static latexToDisplay(latex) {
        // Convert LaTeX to more readable format for error messages
        return latex
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
            .replace(/\^/g, '^')
            .replace(/\\times/g, '×')
            .replace(/\\div/g, '÷');
    }
}
