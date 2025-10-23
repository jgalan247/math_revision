// Answer Checker - Validates student answers
class AnswerChecker {
    static check(studentAnswer, correctAnswer, markingMethod, tolerance = 0.01) {
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
        // Parse fraction or decimal
        const studentValue = this.parseFraction(studentAnswer);
        const correctValue = this.parseFraction(correctAnswer.exact_latex);
        
        if (studentValue === null || correctValue === null) {
            return { correct: false, message: 'Invalid format' };
        }

        const isCorrect = Math.abs(studentValue - correctValue) < tolerance;
        
        // Also check alternative formats
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
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${correctAnswer.exact_latex}`
        };
    }

    static checkNumeric(studentAnswer, correctAnswer, tolerance) {
        const studentValue = parseFloat(studentAnswer);
        const correctValue = parseFloat(correctAnswer.exact_latex);

        if (isNaN(studentValue) || isNaN(correctValue)) {
            return { correct: false, message: 'Invalid number format' };
        }

        const isCorrect = Math.abs(studentValue - correctValue) < tolerance;

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${correctAnswer.exact_latex}`
        };
    }

    static checkSolutionPair(studentAnswer, correctAnswer, tolerance) {
        // Parse input like "x=2, y=3" or "(2,3)" or "2,3"
        const matches = studentAnswer.match(/[\d.-]+/g);
        if (!matches || matches.length !== 2) {
            return { correct: false, message: 'Invalid format. Expected: x=a, y=b' };
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
        // Parse roots like "x=-2 or x=3" or "-2, 3"
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
        const student = studentAnswer.trim().toLowerCase();
        const correct = correctAnswer.exact_latex.toLowerCase();

        const isCorrect = student === correct;

        return {
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. Expected: ${correctAnswer.exact_latex}`
        };
    }

    static parseFraction(input) {
        // Handle LaTeX fractions like \frac{3}{4}
        const latexMatch = input.match(/\\frac\{(-?\d+)\}\{(-?\d+)\}/);
        if (latexMatch) {
            return parseFloat(latexMatch[1]) / parseFloat(latexMatch[2]);
        }

        // Handle text fractions like 3/4
        const fractionMatch = input.match(/^(-?\d+)\/(-?\d+)$/);
        if (fractionMatch) {
            return parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
        }

        // Handle decimals
        const decimal = parseFloat(input);
        if (!isNaN(decimal)) {
            return decimal;
        }

        return null;
    }
}
