const soundRain = document.querySelector('.sound');
const dropSound = document.querySelector('.drop-sound');
const bubbleSound = document.querySelector('.bubble-sound');
const wrongSound = document.querySelector('.wrong-sound');
const playField = document.querySelector('.play_field');
const score = document.querySelector('.control__scoreText');
const calculator = document.querySelector('.control__calculator');
const displayCalculator = document.querySelector('.control__display');
const wrongAnswer = document.querySelector('.wrong_answer');
const riverLevel = document.querySelector('.river_level');
const startScreen = document.querySelector('.startScreen');

const getRamdomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const operators = [{
  sign: "+",
  operation: function(a,b){ return a + b; }
},
{
  sign: "-",
  operation: function(a,b){ return Math.abs(a - b); }
},
{
  sign: "*",
  operation: function(a,b){ return a * b; }
},
// {
//   sign: "/",
//   operation: function(a,b){ return a / b; }
// }
];

// let allDropsCount = 0;
let totalEquationsSolved = 0;
let points = 10;
let scoreValue = 0;
let dropAnswersArray =[];
const dropSize = 50;
let dropSpeed = 45;
let gameLevel = 1;
let lives = 3;


function createTask() {
  const dropFirstNumber = getRamdomNumber(5 * gameLevel, 10 * gameLevel);
  const dropSecondNumber = getRamdomNumber(1 * gameLevel, 5 * gameLevel);
  const selectedOperator = Math.floor(Math.random() * operators.length); 
  const dropAnswer = operators[selectedOperator].operation(dropFirstNumber, dropSecondNumber);
  let task = `${dropFirstNumber} ${operators[selectedOperator].sign} ${dropSecondNumber}`;
  dropAnswersArray.push(dropAnswer);
  return task;
}

function createDrop() {
  // allDropsCount += 1; 
  const drop = document.createElement('div');
  
  drop.className = "drop";
  drop.innerHTML = createTask();
  drop.style.left = `${getRamdomNumber(30, 65)}%`;

  playField.append(drop);

  moveDrop(drop, 0);
  
  let id = setTimeout(createDrop, 5000);
  drop.setAttribute('data-timer', id)
}

function  moveDrop(drop, y) {

    let coordY = y || 0;
    let timer = setTimeout(() => moveDrop(drop, coordY), dropSpeed);
   
     if (drop.offsetTop >= playField.offsetHeight - riverLevel.offsetHeight  - dropSize) {
      removeElement(drop);
      clearTimeout(timer);
      increaseRiverlevel();
      dropAnswersArray.splice(0,1);
      lives--;
      return;
    } else if (lives == 0) {
      finishGame(drop); 
    } else {
      coordY++;
      drop.style.top = coordY + 'px';
 } 
  
}


function startGame() { 
  startScreen.style.display = 'none';  
  soundRain.play();
  btnTutorial.disabled = true;
  createDrop();
  increaseGameLevel();
  
}; 

function increaseGameLevel() {
  setInterval(() => {
    gameLevel += 1;
    dropSpeed -= 15;
  }, 60000);
}

 function finishGame(drop) {
  saveStatistic();

  clearTimeout(drop.dataset.timer)
  
  removeAllElements();

  document.location.href = './results.html';
 }

 const saveStatistic = () => {
  sessionStorage.setItem('totalEquationsSolved', totalEquationsSolved);
  sessionStorage.setItem('scoreValue', `${scoreValue} points`);
};

let btnStart = document.querySelector('.start_button');
btnStart.addEventListener('click', startGame, {once: true});


const removeElement = (element) => {
  element.remove();
};

const removeAllElements = () => {
  const allDrops = document.querySelectorAll('.drop');
  allDrops.forEach(removeElement);
};

function checkAnswer()  {
  const firstDrop = document.querySelector('.drop');
  const isCorrectAnswer = displayCalculator.textContent === String(dropAnswersArray[0]);
  changeScore(isCorrectAnswer);
  showScore(scoreValue);
  
  if (isCorrectAnswer) {

    removeElement(firstDrop);
    bubbleSound.play();
    dropAnswersArray.splice(0,1);

    points += 1;
    totalEquationsSolved += 1;
    }
   displayCalculator.textContent = '';
   
};

const wrongAnswerAnimation = () => {
  wrongAnswer.classList.add('wrong_answer--animation');
  wrongAnswer.addEventListener('transitionend', () => wrongAnswer.classList.remove('wrong_answer--animation'));
  wrongAnswer.textContent = `-${points}`;
  wrongSound.play();
}

const changeScore = (isCorrectAnswer) => {
    if (isCorrectAnswer) {
      scoreValue += points;
    } else {
      scoreValue -= points;
      scoreValue = scoreValue < 0 ? 0 : scoreValue;
      wrongAnswerAnimation();
    }
  };

const showScore = (scoreNumber) => {
    score.textContent = `Score: ${scoreNumber}`;
  };

const increaseRiverlevel = () => {
  dropSound.currentTime = 0;
  dropSound.play();
  riverLevel.style.height = `${riverLevel.offsetHeight + dropSize}px`;
}


const isNumberRegExp = /^[0-9]$/;
const changeDisplayValue = (number) => {
  const isNumber = isNumberRegExp.test(number);
  const isCorrectLength = displayCalculator.textContent.length < 5;

  if (!isNumber || !isCorrectLength) return;

  displayCalculator.textContent += number;
};


const addCalculatorControl = ({ target: button }) => {
  changeDisplayValue(button.textContent);
  if (button.textContent === 'Enter') {
    checkAnswer();
  }
  if (button.textContent === 'Del') {
    displayCalculator.textContent = displayCalculator.textContent.slice(0, -1);
  }
  if (button.textContent === 'Clear') {
    displayCalculator.textContent = '';
  }
};

const addKeyboardControl = (e) => {
  changeDisplayValue(e.key);
  if (e.key === 'Enter') {
    checkAnswer();
  }
};
window.addEventListener('keyup', addKeyboardControl);

calculator.addEventListener('click', addCalculatorControl);


const tutorialMode = () => {
  btnStart.disabled = true;
  startGame();
  setInterval(() => {

    displayCalculator.textContent = String(dropAnswersArray[0]);
    
    setTimeout(() => {
      checkAnswer();
    }, 2000);
  }, 5000);
};


let btnTutorial = document.querySelector('.tutorial_button');
btnTutorial.addEventListener('click', tutorialMode, {once: true});


let btnReset = document.querySelector('.reset_button');
btnReset.addEventListener('click', () => document.location.href = './index.html', {once: true});

let fullscreen = document.querySelector('.fullscreen').addEventListener("click", function() {
 toggleFullScreen();
  }, false);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

