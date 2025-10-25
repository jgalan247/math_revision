// MathLive Handler - Manages MathLive math fields with custom keyboard

class MathLiveHandler {
    constructor() {
        this.mathFields = new Map();
        this.keyboardsRegistered = false;
    }

    registerCustomKeyboards() {
        // Only register once
        if (this.keyboardsRegistered || typeof window.mathVirtualKeyboard === 'undefined') {
            return;
        }

        // Register custom keyboards globally using MathLive's API
        window.mathVirtualKeyboard.layouts = [
            this.createKS3KS4Keyboard(),
            this.createAlgebraKeyboard(),
            this.createQuadraticKeyboard(),
            this.createCalculusKeyboard(),
            this.createInequalitiesKeyboard(),
            this.createBasicKeyboard()
        ];

        this.keyboardsRegistered = true;
        console.log('Custom keyboards registered:', window.mathVirtualKeyboard.layouts.map(k => k.label));
    }

    createKS3KS4Keyboard() {
        return {
            label: 'KS3/KS4',
            tooltip: 'Extended keyboard for KS3/KS4 curriculum',
            rows: [
                [
                    { class: 'small', latex: '\\frac{#@}{#0}', label: '□/□' },
                    { class: 'small', latex: '#@^{#0}', label: '□^□' },
                    { class: 'small', latex: '#@^{2}', label: '□²' },
                    { class: 'small', latex: '#@^{3}', label: '□³' },
                    { class: 'small', latex: '#@^{-1}', label: '□⁻¹' },
                ],
                [
                    { class: 'small', latex: '\\sqrt{#0}', label: '√□' },
                    { class: 'small', latex: '\\sqrt[3]{#0}', label: '³√□' },
                    { class: 'small', latex: '\\sqrt[#@]{#0}', label: 'ⁿ√□' },
                    { class: 'small', latex: '\\pi', label: 'π' },
                    { class: 'small', latex: '\\%', label: '%' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\div', label: '÷' },
                    { latex: '\\times', label: '×' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]', '[:]',
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: '\\left(#0\\right)', label: '( )' },
                    '[backspace]',
                    { class: 'action', label: 'Clear', command: ['deleteAll'] },
                ]
            ]
        };
    }

    createAlgebraKeyboard() {
        return {
            label: 'Algebra',
            tooltip: 'Algebraic expressions and equations',
            rows: [
                [
                    { class: 'small', latex: 'x' },
                    { class: 'small', latex: 'y' },
                    { class: 'small', latex: 'a' },
                    { class: 'small', latex: 'b' },
                    { class: 'small', latex: 'n' },
                ],
                [
                    { class: 'small', latex: '#@^{2}', label: '□²' },
                    { class: 'small', latex: '#@^{3}', label: '□³' },
                    { class: 'small', latex: '#@^{#0}', label: '□^□' },
                    { class: 'small', latex: '\\sqrt{#0}', label: '√□' },
                    { class: 'small', latex: '\\frac{#@}{#0}', label: '□/□' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\times', label: '×' },
                    { latex: '\\div', label: '÷' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]',
                    { class: 'small', latex: '\\left(#0\\right)', label: '( )' },
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: '\\lt', label: '<' },
                    { class: 'small', latex: '\\gt', label: '>' },
                    '[backspace]',
                ]
            ]
        };
    }

    createQuadraticKeyboard() {
        return {
            label: 'Quadratic',
            tooltip: 'Quadratic equations and formula',
            rows: [
                [
                    {
                        class: 'large-formula',
                        latex: 'x = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}',
                        label: 'x = (-b±√(b²-4ac))/2a',
                        width: 5
                    },
                ],
                [
                    { class: 'small', latex: 'ax^{2}+bx+c=0', label: 'ax²+bx+c=0', width: 2 },
                    { class: 'small', latex: 'a=#0', label: 'a=', width: 1 },
                    { class: 'small', latex: 'b=#0', label: 'b=', width: 1 },
                    { class: 'small', latex: 'c=#0', label: 'c=', width: 1 },
                ],
                [
                    { class: 'small', latex: 'x_{1}=#0', label: 'x₁=', width: 1.5 },
                    { class: 'small', latex: 'x_{2}=#0', label: 'x₂=', width: 1.5 },
                    { class: 'small', latex: '\\pm', label: '±', width: 1 },
                    { class: 'small', latex: '\\sqrt{#0}', label: '√□', width: 1 },
                ],
                [
                    { class: 'small', latex: '#@^{2}', label: '□²' },
                    { class: 'small', latex: '#@^{3}', label: '□³' },
                    { class: 'small', latex: '#@^{#0}', label: '□^□' },
                    { class: 'small', latex: '\\frac{#@}{#0}', label: '□/□' },
                    { class: 'small', latex: '\\left(#0\\right)', label: '( )' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\times', label: '×' },
                    { latex: '\\div', label: '÷' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]',
                    { class: 'small', latex: 'x' },
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: ',', label: ',' },
                    '[backspace]',
                    { class: 'action', label: 'Clear', command: ['deleteAll'] },
                ]
            ]
        };
    }

    createCalculusKeyboard() {
        return {
            label: 'Calculus',
            tooltip: 'Differential calculus and derivatives',
            rows: [
                [
                    { class: 'small', latex: '\\frac{d}{dx}', label: 'd/dx' },
                    { class: 'small', latex: '\\frac{d^{2}}{dx^{2}}', label: 'd²/dx²' },
                    { class: 'small', latex: '\\frac{dy}{dx}', label: 'dy/dx' },
                    { class: 'small', latex: '\\frac{d^{2}y}{dx^{2}}', label: 'd²y/dx²' },
                    { class: 'small', latex: "f'(x)", label: "f'(x)" },
                ],
                [
                    { class: 'small', latex: "f''(x)", label: "f''(x)" },
                    { class: 'small', latex: '\\frac{\\partial}{\\partial x}', label: '∂/∂x' },
                    { class: 'small', latex: '\\int', label: '∫' },
                    { class: 'small', latex: '\\int_{#@}^{#0}', label: '∫ₐᵇ' },
                    { class: 'small', latex: '\\lim_{#@ \\to #0}', label: 'lim' },
                ],
                [
                    { class: 'small', latex: 'x' },
                    { class: 'small', latex: 'y' },
                    { class: 'small', latex: 'f' },
                    { class: 'small', latex: 'e^{#0}', label: 'eˣ' },
                    { class: 'small', latex: '\\ln', label: 'ln' },
                ],
                [
                    { class: 'small', latex: '\\sin', label: 'sin' },
                    { class: 'small', latex: '\\cos', label: 'cos' },
                    { class: 'small', latex: '\\tan', label: 'tan' },
                    { class: 'small', latex: '#@^{#0}', label: '□^□' },
                    { class: 'small', latex: '\\sqrt{#0}', label: '√□' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\times', label: '×' },
                    { latex: '\\div', label: '÷' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]',
                    { class: 'small', latex: '\\left(#0\\right)', label: '( )' },
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: '\\infty', label: '∞' },
                    '[backspace]',
                    { class: 'action', label: 'Clear', command: ['deleteAll'] },
                ]
            ]
        };
    }

    createInequalitiesKeyboard() {
        return {
            label: 'Compare',
            tooltip: 'Inequalities and comparisons',
            rows: [
                [
                    { class: 'small', latex: '\\lt', label: '<' },
                    { class: 'small', latex: '\\gt', label: '>' },
                    { class: 'small', latex: '\\leq', label: '≤' },
                    { class: 'small', latex: '\\geq', label: '≥' },
                    { class: 'small', latex: '\\neq', label: '≠' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\times', label: '×' },
                    { latex: '\\div', label: '÷' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]',
                    { class: 'small', latex: 'x' },
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: 'y' },
                    '[backspace]',
                    { class: 'action', label: 'Clear', command: ['deleteAll'] },
                ]
            ]
        };
    }

    createBasicKeyboard() {
        return {
            label: 'Basic',
            tooltip: 'Basic calculator keyboard',
            rows: [
                [
                    { class: 'small', latex: '\\frac{#@}{#0}', label: '□/□' },
                    { class: 'small', latex: '#@^{#0}', label: '□^□' },
                    { class: 'small', latex: '\\sqrt{#0}', label: '√□' },
                    { class: 'small', latex: '\\sqrt[3]{#0}', label: '³√□' },
                    { class: 'small', latex: '\\left(#0\\right)', label: '( )' },
                ],
                [
                    '[7]', '[8]', '[9]',
                    { latex: '\\div', label: '÷' },
                    { latex: '\\times', label: '×' },
                ],
                [
                    '[4]', '[5]', '[6]',
                    '[+]', '[-]',
                ],
                [
                    '[1]', '[2]', '[3]',
                    '[=]',
                    { class: 'small', latex: 'x' },
                ],
                [
                    '[0]', '[.]',
                    { class: 'small', latex: 'y' },
                    '[backspace]',
                    { class: 'action', label: 'Clear', command: ['deleteAll'] },
                ]
            ]
        };
    }

    createMathField(containerId, questionIndex) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        // Register keyboards if not already done
        this.registerCustomKeyboards();

        // Create wrapper for math field and keyboard button
        const wrapper = document.createElement('div');
        wrapper.className = 'answer-input-container';

        // Create math field
        const mathField = document.createElement('math-field');
        mathField.id = `math-field-${questionIndex}`;
        mathField.setAttribute('virtual-keyboard-mode', 'manual');

        // Configure math field options
        this.configureMathField(mathField);

        // Create keyboard toggle button
        const toggleBtn = this.createKeyboardToggle(mathField, questionIndex);

        wrapper.appendChild(mathField);
        wrapper.appendChild(toggleBtn);
        container.appendChild(wrapper);

        // Store reference
        this.mathFields.set(questionIndex, {
            field: mathField,
            toggle: toggleBtn
        });

        return mathField;
    }

    createQuestionFields(containerId, questionIndex, question = null) {
        console.log(`[mathLiveHandler.createQuestionFields] Creating fields for question ${questionIndex}`);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[mathLiveHandler.createQuestionFields] Container ${containerId} not found`);
            return null;
        }

        // Register keyboards if not already done
        this.registerCustomKeyboards();

        // Check if this is a quadratic question (solution_set with roots)
        const isQuadratic = question &&
                           question.marking &&
                           question.marking.method === 'solution_set' &&
                           question.answer &&
                           question.answer.roots;

        console.log(`[mathLiveHandler.createQuestionFields] Is quadratic: ${isQuadratic}`);

        // Create work area label
        const workAreaLabel = document.createElement('label');
        workAreaLabel.className = 'work-area-label';
        workAreaLabel.htmlFor = `work-area-${questionIndex}`;
        workAreaLabel.innerHTML = '<strong>Show Your Working (Optional):</strong> <span class="work-area-hint">Use the keyboard icon to enter math formulas</span>';

        // Create work area container
        const workAreaContainer = document.createElement('div');
        workAreaContainer.className = 'work-area-container';

        // Create work area as MathLive field (not textarea)
        const workArea = document.createElement('math-field');
        workArea.id = `work-area-${questionIndex}`;
        workArea.className = 'work-area-mathfield';
        workArea.setAttribute('virtual-keyboard-mode', 'manual');

        // Configure work area math field
        this.configureMathField(workArea);

        // Create keyboard toggle for work area
        const workAreaToggle = this.createKeyboardToggle(workArea, questionIndex, true); // true = for work area

        workAreaContainer.appendChild(workArea);
        workAreaContainer.appendChild(workAreaToggle);

        // Create final answer label
        const answerLabel = document.createElement('label');
        answerLabel.className = 'answer-field-label';
        answerLabel.htmlFor = `answer-field-${questionIndex}`;

        if (isQuadratic) {
            answerLabel.innerHTML = '<strong>Final Answer:</strong> <span class="answer-field-hint">(Use ⌨️ icons to open math keyboard)</span>';
        } else {
            answerLabel.innerHTML = '<strong>Final Answer:</strong> <span class="answer-field-hint">(Click field or ⌨️ icon to enter)</span>';
        }

        // Append work area label, work area container, then final answer label
        container.appendChild(workAreaLabel);
        container.appendChild(workAreaContainer);
        container.appendChild(answerLabel);

        let mathField, mathField2, toggleBtn, toggleBtn2;

        if (isQuadratic) {
            // Create DUAL fields for quadratic equations
            const dualFieldsContainer = document.createElement('div');
            dualFieldsContainer.className = 'dual-fields-container';

            // x₁ field
            const field1Container = document.createElement('div');
            field1Container.className = 'answer-field-container quadratic-field';

            const field1Label = document.createElement('label');
            field1Label.className = 'quadratic-field-label';
            field1Label.textContent = 'x₁ =';

            const field1Wrapper = document.createElement('div');
            field1Wrapper.className = 'answer-field';
            field1Wrapper.id = `answer-field-${questionIndex}`;

            mathField = document.createElement('math-field');
            mathField.id = `math-field-${questionIndex}`;
            mathField.setAttribute('virtual-keyboard-mode', 'manual');
            this.configureMathField(mathField);

            toggleBtn = this.createKeyboardToggle(mathField, questionIndex);

            field1Wrapper.appendChild(mathField);
            field1Container.appendChild(field1Label);
            field1Container.appendChild(field1Wrapper);
            field1Container.appendChild(toggleBtn);

            // x₂ field
            const field2Container = document.createElement('div');
            field2Container.className = 'answer-field-container quadratic-field';

            const field2Label = document.createElement('label');
            field2Label.className = 'quadratic-field-label';
            field2Label.textContent = 'x₂ =';

            const field2Wrapper = document.createElement('div');
            field2Wrapper.className = 'answer-field';
            field2Wrapper.id = `answer-field-2-${questionIndex}`;

            mathField2 = document.createElement('math-field');
            mathField2.id = `math-field-2-${questionIndex}`;
            mathField2.setAttribute('virtual-keyboard-mode', 'manual');
            this.configureMathField(mathField2);

            toggleBtn2 = this.createKeyboardToggle(mathField2, questionIndex);

            field2Wrapper.appendChild(mathField2);
            field2Container.appendChild(field2Label);
            field2Container.appendChild(field2Wrapper);
            field2Container.appendChild(toggleBtn2);

            dualFieldsContainer.appendChild(field1Container);
            dualFieldsContainer.appendChild(field2Container);
            container.appendChild(dualFieldsContainer);

            // Store both fields
            this.mathFields.set(questionIndex, {
                field: mathField,
                field2: mathField2,
                toggle: toggleBtn,
                toggle2: toggleBtn2,
                workArea: workArea,
                workAreaToggle: workAreaToggle,
                isQuadratic: true
            });

        } else {
            // Create SINGLE field for non-quadratic questions
            const answerFieldContainer = document.createElement('div');
            answerFieldContainer.className = 'answer-field-container';

            const answerFieldWrapper = document.createElement('div');
            answerFieldWrapper.className = 'answer-field';
            answerFieldWrapper.id = `answer-field-${questionIndex}`;

            mathField = document.createElement('math-field');
            mathField.id = `math-field-${questionIndex}`;
            mathField.setAttribute('virtual-keyboard-mode', 'manual');
            this.configureMathField(mathField);

            toggleBtn = this.createKeyboardToggle(mathField, questionIndex);

            answerFieldWrapper.appendChild(mathField);
            answerFieldContainer.appendChild(answerFieldWrapper);
            answerFieldContainer.appendChild(toggleBtn);

            container.appendChild(answerFieldContainer);

            // Store reference
            this.mathFields.set(questionIndex, {
                field: mathField,
                toggle: toggleBtn,
                workArea: workArea,
                workAreaToggle: workAreaToggle,
                isQuadratic: false
            });
        }

        // Auto-focus work area for first question only
        if (questionIndex === 0) {
            console.log('[mathLiveHandler.createQuestionFields] Setting up auto-focus for first question');
            setTimeout(() => {
                console.log('[mathLiveHandler.createQuestionFields] Focusing work area');
                workArea.focus();
                // Scroll into view if needed
                workArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('[mathLiveHandler.createQuestionFields] Active element:', document.activeElement.id);
            }, 300);
        }

        console.log(`[mathLiveHandler.createQuestionFields] Fields created for question ${questionIndex}`);
        return { mathField, workArea };
    }

    applyFeedback(questionIndex, isCorrect) {
        console.log(`[mathLiveHandler.applyFeedback] Index ${questionIndex}, Correct: ${isCorrect}`);
        const data = this.mathFields.get(questionIndex);
        if (!data) {
            console.warn(`[mathLiveHandler.applyFeedback] No field data for index ${questionIndex}`);
            return;
        }

        const { field, field2, isQuadratic } = data;

        // Remove existing classes from both fields
        field.classList.remove('correct', 'incorrect');
        if (isQuadratic && field2) {
            field2.classList.remove('correct', 'incorrect');
        }

        // Add appropriate class to both fields
        if (isCorrect) {
            field.classList.add('correct');
            if (isQuadratic && field2) {
                field2.classList.add('correct');
            }
            console.log('[mathLiveHandler.applyFeedback] Added correct class');
        } else {
            field.classList.add('incorrect');
            if (isQuadratic && field2) {
                field2.classList.add('incorrect');
            }
            console.log('[mathLiveHandler.applyFeedback] Added incorrect class');
        }
    }

    configureMathField(mathField) {
        // Configure to use our custom keyboards only
        mathField.setOptions({
            virtualKeyboardMode: 'manual',
            smartMode: false,
            removeExtraneousParentheses: false,
            defaultMode: 'math',
            keypressSound: null,
            plonkSound: null,
        });

        // Handle focus
        mathField.addEventListener('focus', () => {
            const index = this.getFieldIndex(mathField);
            if (index !== null) {
                const data = this.mathFields.get(index);
                if (data && data.toggle.classList.contains('active')) {
                    window.mathVirtualKeyboard.show();
                }
            }
        });
    }

    createKeyboardToggle(mathField, questionIndex, isWorkArea = false) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'keyboard-toggle';

        if (isWorkArea) {
            button.setAttribute('aria-label', 'Open math keyboard for working');
            button.setAttribute('title', 'Click to open math keyboard for showing your work');
        } else {
            button.setAttribute('aria-label', 'Open math keyboard for final answer');
            button.setAttribute('title', 'Click to enter final answer with math keyboard');
        }

        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
            </svg>
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleKeyboard(mathField, button);
        });

        return button;
    }

    toggleKeyboard(mathField, button) {
        console.log('[mathLiveHandler.toggleKeyboard] Toggle clicked');
        const isActive = button.classList.contains('active');

        if (isActive) {
            // Hide keyboard
            console.log('[mathLiveHandler.toggleKeyboard] Hiding keyboard');
            window.mathVirtualKeyboard.hide();
            button.classList.remove('active');
        } else {
            // Show keyboard and focus the math field
            // This is intentional - clicking the keyboard button means
            // the student wants to enter their final answer
            console.log('[mathLiveHandler.toggleKeyboard] Showing keyboard and focusing math field');
            mathField.focus();
            window.mathVirtualKeyboard.show();
            button.classList.add('active');
        }
    }

    getFieldIndex(mathField) {
        for (let [index, data] of this.mathFields.entries()) {
            if (data.field === mathField) {
                return index;
            }
        }
        return null;
    }

    getValue(questionIndex) {
        const data = this.mathFields.get(questionIndex);
        if (!data) {
            console.warn(`[mathLiveHandler.getValue] No field data for index ${questionIndex}`);
            return '';
        }

        if (data.isQuadratic && data.field2) {
            // For quadratic questions, combine x₁ and x₂
            const x1 = data.field.value.trim();
            const x2 = data.field2.value.trim();

            // Return in format "x1, x2"
            const combined = x1 && x2 ? `${x1},${x2}` : (x1 || x2 || '');
            console.log(`[mathLiveHandler.getValue] Index ${questionIndex} (quadratic): x₁="${x1}", x₂="${x2}", combined="${combined}"`);
            return combined;
        } else {
            // For non-quadratic questions, return single value
            const value = data.field.value;
            console.log(`[mathLiveHandler.getValue] Index ${questionIndex}: "${value}"`);
            return value;
        }
    }

    setValue(questionIndex, latex) {
        const data = this.mathFields.get(questionIndex);
        if (data) {
            data.field.value = latex;
        }
    }

    markCorrect(questionIndex) {
        const data = this.mathFields.get(questionIndex);
        if (data) {
            data.field.classList.add('correct');
            data.field.classList.remove('incorrect');
            data.field.disabled = true;
        }
    }

    markIncorrect(questionIndex) {
        const data = this.mathFields.get(questionIndex);
        if (data) {
            data.field.classList.add('incorrect');
            data.field.classList.remove('correct');
            data.field.disabled = true;
        }
    }

    disable(questionIndex) {
        const data = this.mathFields.get(questionIndex);
        if (data) {
            data.field.disabled = true;
        }
    }
}

// Global instance
const mathLiveHandler = new MathLiveHandler();
