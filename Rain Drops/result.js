const totalEquationsStatistic = document.querySelector('.total-equations');
const totalScore = document.querySelector('.total-score');

totalEquationsStatistic.textContent = sessionStorage.getItem('totalEquationsSolved') || 0;
totalScore.textContent = sessionStorage.getItem('scoreValue') || 0;

let btnContinue = document.querySelector('.continue-button');
btnContinue.addEventListener('click', newGame);

function newGame() {
    document.location.href = './index.html';
}
