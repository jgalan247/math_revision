// Worksheet Loader - Loads and displays worksheets
let currentWorksheet = null;
let studentAnswers = {};
let questionStatus = {}; // Track status: null, 'answered', 'correct', 'incorrect'

async function loadWorksheetList() {
    const container = document.getElementById('worksheet-list');
    
    try {
        // Get list of worksheet files
        const response = await fetch('worksheets/');
        const text = await response.text();
        
        // Parse HTML to find JSON files
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.endsWith('.json'))
            .map(a => a.href.split('/').pop());

        if (links.length === 0) {
            const knownFiles = ['sample.json', 'algebraic-fractions-ks3-easy-001.json'];
            await displayWorksheetCards(knownFiles, container);
        } else {
            await displayWorksheetCards(links, container);
        }
    } catch (error) {
        console.error('Error loading worksheet list:', error);
        await displayWorksheetCards(['sample.json'], container);
    }
}

async function displayWorksheetCards(filenames, container) {
    container.innerHTML = '';
    
    for (const filename of filenames) {
        try {
            const response = await fetch(`worksheets/${filename}`);
            const worksheet = await response.json();
            
            const card = createWorksheetCard(worksheet);
            container.appendChild(card);
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
        }
    }
}

function createWorksheetCard(worksheet) {
    const card = document.createElement('div');
    card.className = 'worksheet-card bg-white rounded-lg shadow-md p-6 cursor-pointer';
    card.onclick = () => window.location.href = `worksheet.html?id=${worksheet.id}`;
    
    card.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-2">${worksheet.title}</h3>
        <div class="flex flex-wrap gap-2 mb-3">
            <span class="badge badge-${worksheet.difficulty}">${worksheet.difficulty}</span>
            <span class="badge badge-${worksheet.grade.toLowerCase().replace(' ', '-')}">${worksheet.grade}</span>
        </div>
        <p class="text-gray-600 text-sm mb-2">${worksheet.topic}</p>
        <p class="text-gray-500 text-sm">${worksheet.questions.length} questions • ${worksheet.estimatedTime} min</p>
    `;
    
    return card;
}

async function loadWorksheet(worksheetId) {
    try {
        const response = await fetch(`worksheets/${worksheetId}.json`);
        currentWorksheet = await response.json();
        
        displayWorksheetHeader(currentWorksheet);
        
        // Wait for MathLive to load
        if (typeof MathfieldElement === 'undefined') {
            await new Promise(resolve => {
                const checkMathLive = setInterval(() => {
                    if (typeof MathfieldElement !== 'undefined') {
                        clearInterval(checkMathLive);
                        resolve();
                    }
                }, 100);
            });
        }
        
        displayQuestions(currentWorksheet.questions);

        // Show progress bar
        const progressSection = document.getElementById('progress-section');
        if (progressSection) {
            progressSection.style.display = 'block';
            updateProgress();
        }

        document.getElementById('submit-btn').addEventListener('click', submitAnswers);
        document.getElementById('retry-btn')?.addEventListener('click', retryWorksheet);
    } catch (error) {
        console.error('Error loading worksheet:', error);
        alert('Error loading worksheet. Please try again.');
    }
}

function displayWorksheetHeader(worksheet) {
    document.getElementById('worksheet-title').textContent = worksheet.title;
    document.getElementById('worksheet-topic').innerHTML = `<strong>Topic:</strong> ${worksheet.topic}`;
    document.getElementById('worksheet-grade').innerHTML = `<strong>Grade:</strong> ${worksheet.grade}`;
    document.getElementById('worksheet-difficulty').innerHTML = `<strong>Difficulty:</strong> ${worksheet.difficulty}`;
    document.getElementById('worksheet-time').innerHTML = `<strong>Time:</strong> ${worksheet.estimatedTime} min`;
}

function displayQuestions(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionCard = createQuestionCard(question, index);
        container.appendChild(questionCard);
    });
}

function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `question-${index}`;

    // Question header with number and status badge
    const headerDiv = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.justifyContent = 'space-between';
    headerDiv.style.alignItems = 'center';
    headerDiv.style.marginBottom = '1rem';

    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `Question ${index + 1}`;

    const statusBadge = document.createElement('span');
    statusBadge.id = `status-${index}`;
    statusBadge.className = 'status-badge unanswered';
    statusBadge.textContent = 'Unanswered';

    headerDiv.appendChild(questionNumber);
    headerDiv.appendChild(statusBadge);
    card.appendChild(headerDiv);

    // Question prompt
    const promptDiv = document.createElement('div');
    promptDiv.className = 'question-prompt latex display';
    promptDiv.setAttribute('data-latex', question.prompt_latex);
    card.appendChild(promptDiv);

    // Input container for work area and answer field
    const inputContainer = document.createElement('div');
    inputContainer.id = `input-container-${index}`;
    card.appendChild(inputContainer);

    // Action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'question-actions';

    // Add compute button if coefficients are available
    if (question.meta && question.meta.coefficients) {
        const computeBtn = document.createElement('button');
        computeBtn.className = 'btn-compute';
        computeBtn.textContent = '🔮 Calculate Result';
        computeBtn.onclick = () => computeAnswer(index);
        actionsDiv.appendChild(computeBtn);
    }

    // Check answer button
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn-check';
    checkBtn.id = `check-btn-${index}`;
    checkBtn.textContent = '✓ Check Answer';
    checkBtn.onclick = () => checkSingleAnswer(index);
    actionsDiv.appendChild(checkBtn);

    card.appendChild(actionsDiv);

    // Computed result container (hidden by default)
    const computedDiv = document.createElement('div');
    computedDiv.id = `computed-${index}`;
    computedDiv.className = 'computed-result hidden';
    card.appendChild(computedDiv);

    // Feedback div
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = `feedback-${index}`;
    feedbackDiv.className = 'feedback hidden';
    card.appendChild(feedbackDiv);

    // Render LaTeX prompt
    setTimeout(() => renderLatex(question.prompt_latex, promptDiv, true), 0);

    // Create enhanced question fields (work area + final answer)
    setTimeout(() => {
        mathLiveHandler.createQuestionFields(`input-container-${index}`, index, question);
    }, 100);

    // Initialize status
    questionStatus[index] = null;

    return card;
}

function submitAnswers() {
    const questions = currentWorksheet.questions;
    let correctCount = 0;
    
    questions.forEach((question, index) => {
        const feedback = document.getElementById(`feedback-${index}`);
        const studentAnswer = mathLiveHandler.getValue(index);
        
        const result = AnswerChecker.check(
            studentAnswer,
            question.answer,
            question.marking.method,
            question.marking.tolerance
        );
        
        if (result.correct) {
            correctCount++;
            mathLiveHandler.markCorrect(index);
        } else {
            mathLiveHandler.markIncorrect(index);
        }
        
        feedback.textContent = result.message;
        feedback.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
        feedback.classList.remove('hidden');
    });
    
    displayResults(correctCount, questions.length);
    document.getElementById('submit-btn').disabled = true;
}

function displayResults(correct, total) {
    const resultsDiv = document.getElementById('results');
    const scoreDiv = document.getElementById('score');
    const percentage = Math.round((correct / total) * 100);
    
    scoreDiv.innerHTML = `
        <strong>Score: ${correct}/${total} (${percentage}%)</strong>
        <div class="mt-2">
            ${percentage >= 80 ? '🌟 Excellent work!' : 
              percentage >= 60 ? '👍 Good effort!' : 
              '💪 Keep practicing!'}
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function retryWorksheet() {
    location.reload();
}

// Compute answer for quadratic equations
function computeAnswer(index) {
    const question = currentWorksheet.questions[index];
    const computedDiv = document.getElementById(`computed-${index}`);

    if (!question.meta || !question.meta.coefficients) {
        return;
    }

    const { a, b, c } = question.meta.coefficients;

    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;

    let resultHTML = '<div class="computed-result-title">💡 Calculated Result:</div>';

    if (discriminant > 0) {
        // Two real roots
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        resultHTML += `<div class="computed-result-value">x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}</div>`;
        resultHTML += `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #6b21a8;">Two real roots (discriminant = ${discriminant.toFixed(2)})</div>`;
    } else if (discriminant === 0) {
        // One repeated root
        const x = -b / (2 * a);
        resultHTML += `<div class="computed-result-value">x = ${x.toFixed(3)} (repeated root)</div>`;
        resultHTML += `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #6b21a8;">One repeated root (discriminant = 0)</div>`;
    } else {
        // Complex roots
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        resultHTML += `<div class="computed-result-value">x = ${realPart.toFixed(3)} ± ${imaginaryPart.toFixed(3)}i</div>`;
        resultHTML += `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #6b21a8;">Complex roots (discriminant = ${discriminant.toFixed(2)})</div>`;
    }

    computedDiv.innerHTML = resultHTML;
    computedDiv.classList.remove('hidden');
}

// Check a single answer
function checkSingleAnswer(index) {
    console.log(`[checkSingleAnswer] Starting check for question ${index}`);

    const question = currentWorksheet.questions[index];
    const studentAnswer = mathLiveHandler.getValue(index);
    const feedbackDiv = document.getElementById(`feedback-${index}`);
    const checkBtn = document.getElementById(`check-btn-${index}`);

    console.log(`[checkSingleAnswer] Student answer: "${studentAnswer}"`);
    console.log(`[checkSingleAnswer] Expected answer:`, question.answer);
    console.log(`[checkSingleAnswer] Marking method: ${question.marking.method}`);

    if (!studentAnswer || studentAnswer.trim() === '') {
        console.log('[checkSingleAnswer] Empty answer, showing error');
        showFeedback(index, false, 'Please enter an answer first');
        return;
    }

    const result = AnswerChecker.check(
        studentAnswer,
        question.answer,
        question.marking.method,
        question.marking.tolerance
    );

    console.log('[checkSingleAnswer] Result:', result);

    // Apply visual feedback
    mathLiveHandler.applyFeedback(index, result.correct);

    // Show feedback message
    showFeedback(index, result.correct, result.message);

    // Update question status
    updateQuestionStatus(index, result.correct ? 'correct' : 'incorrect');

    // Disable check button after checking
    checkBtn.disabled = true;
    checkBtn.textContent = result.correct ? '✓ Checked' : '✗ Checked';

    // Update progress
    updateProgress();

    console.log('[checkSingleAnswer] Check complete');
}

// Show feedback message
function showFeedback(index, isCorrect, message) {
    const feedbackDiv = document.getElementById(`feedback-${index}`);

    feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.innerHTML = `
        <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    feedbackDiv.classList.remove('hidden');

    // Scroll feedback into view
    setTimeout(() => {
        feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Update question status
function updateQuestionStatus(index, status) {
    questionStatus[index] = status;

    const statusBadge = document.getElementById(`status-${index}`);
    const card = document.getElementById(`question-${index}`);

    // Remove existing status classes
    statusBadge.classList.remove('unanswered', 'answered', 'correct', 'incorrect');
    card.classList.remove('answered', 'correct', 'incorrect');

    // Add new status
    if (status === 'correct') {
        statusBadge.classList.add('correct');
        statusBadge.textContent = 'Correct';
        card.classList.add('correct');
    } else if (status === 'incorrect') {
        statusBadge.classList.add('incorrect');
        statusBadge.textContent = 'Incorrect';
        card.classList.add('incorrect');
    } else if (status === 'answered') {
        statusBadge.classList.add('answered');
        statusBadge.textContent = 'Answered';
        card.classList.add('answered');
    }
}

// Update progress bar
function updateProgress() {
    const totalQuestions = currentWorksheet.questions.length;
    let answeredCount = 0;
    let correctCount = 0;

    for (let i = 0; i < totalQuestions; i++) {
        if (questionStatus[i]) {
            answeredCount++;
            if (questionStatus[i] === 'correct') {
                correctCount++;
            }
        }
    }

    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');

    if (progressText && progressFill && progressPercentage) {
        progressText.textContent = `${answeredCount}/${totalQuestions} answered (${correctCount} correct)`;

        const percentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
}
