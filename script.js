const apiUrl = 'https://opentdb.com/api.php?amount=10&category=17&type=multiple';

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');
const feedbackContainer = document.getElementById('feedback-container');
const scoreContainer = document.getElementById('score-container');
const scoreDisplay = document.getElementById('score');
const congratsGif = document.getElementById('congrats-gif');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);

async function fetchQuestions() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results;
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function startQuiz() {
    startButton.style.display = 'none';
    scoreContainer.style.display = 'none';
    feedbackContainer.innerHTML = '';
    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    congratsGif.src = ''; // Reset congrats GIF
    fetchQuestions().then(() => showQuestion());
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <p>${currentQuestion.question}</p>
        ${shuffleArray([...currentQuestion.incorrect_answers, currentQuestion.correct_answer])
            .map(option => `<button onclick="checkAnswer('${option}')">${option}</button>`).join('')}
    `;
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correct_answer) {
        score++;
        feedbackContainer.textContent = 'Correct!';
    } else {
        feedbackContainer.textContent = `Incorrect. The correct answer is: ${currentQuestion.correct_answer}`;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function nextQuestion() {
    feedbackContainer.textContent = '';
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    nextButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    scoreContainer.style.display = 'block';
    scoreDisplay.textContent = score;

    // Display congrats GIF based on the score
    if (score === questions.length) {
        congratsGif.src = 'your-congrats-gif-url.gif'; // Replace with your actual GIF URL
    }
}

function restartQuiz() {
    startQuiz();
}

// Utility function to shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
