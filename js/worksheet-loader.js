// Worksheet Loader - Loads and displays worksheets
let currentWorksheet = null;
let studentAnswers = {};

async function loadWorksheetList() {
    const container = document.getElementById('worksheet-list');
    
    try {
        // Get list of worksheet files
        const response = await fetch('worksheets/');
        const text = await response.text();
        
        // Parse HTML to find JSON files (works with directory listing)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.endsWith('.json'))
            .map(a => a.href.split('/').pop());

        if (links.length === 0) {
            // Fallback: try to load known files
            const knownFiles = ['sample.json', 'algebraic-fractions-ks3-easy-001.json'];
            await displayWorksheetCards(knownFiles, container);
        } else {
            await displayWorksheetCards(links, container);
        }
    } catch (error) {
        console.error('Error loading worksheet list:', error);
        // Fallback to sample
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
        displayQuestions(currentWorksheet.questions);
        
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
    
    const promptDiv = document.createElement('div');
    promptDiv.className = 'question-prompt latex display';
    promptDiv.setAttribute('data-latex', question.prompt_latex);
    
    card.innerHTML = `
        <div class="question-number">Question ${index + 1}</div>
    `;
    card.appendChild(promptDiv);
    
    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `
        <input type="text" 
               class="answer-input" 
               id="answer-${index}" 
               placeholder="Enter your answer"
               data-question-index="${index}">
        <div id="feedback-${index}" class="feedback hidden"></div>
    `;
    card.appendChild(inputDiv);
    
    // Render LaTeX after adding to DOM
    setTimeout(() => renderLatex(question.prompt_latex, promptDiv, true), 0);
    
    return card;
}

function submitAnswers() {
    const questions = currentWorksheet.questions;
    let correctCount = 0;
    
    questions.forEach((question, index) => {
        const input = document.getElementById(`answer-${index}`);
        const feedback = document.getElementById(`feedback-${index}`);
        const studentAnswer = input.value.trim();
        
        const result = AnswerChecker.check(
            studentAnswer,
            question.answer,
            question.marking.method,
            question.marking.tolerance
        );
        
        if (result.correct) {
            correctCount++;
            input.classList.add('correct');
            input.classList.remove('incorrect');
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
        
        feedback.textContent = result.message;
        feedback.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
        feedback.classList.remove('hidden');
        
        input.disabled = true;
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
