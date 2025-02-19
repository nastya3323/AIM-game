const startButton = document.querySelector('#start');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('#time-list');
const timeDisplay = document.querySelector('#time');
const gameBoard = document.querySelector('#board');
const restartButton = document.querySelector('.restart');
const clickSound = document.querySelector('#click-sound');
const volumeControl = document.querySelector('#volume-control');
const volumeIcon = document.querySelector('#volume-icon');

if (!startButton || !screens.length || !timeList || !timeDisplay || !gameBoard || !restartButton) {
    console.error('Не удалось получить один или несколько элементов из DOM.');
    throw new Error('Необходимые элементы не найдены');
}

const colors = ['#F8D800', '#F55555', '#a80077', '#9708CC', '#3CD500', '#92FFC0', '#0396FF'];

let timeRemaining = 0;
let score = 0;
let intervalId;
let isMuted = false; // Состояние звука, по умолчанию звук включен

startButton.addEventListener('click', (event) => {
    event.preventDefault();

    screens[0].classList.add('up');
});

// Обработчик события для выбора времени
timeList.addEventListener('click', (event) => {
    if (event.target.classList.contains('time-btn')) {
        timeRemaining = parseInt(event.target.dataset.time);
        screens[1].classList.add('up');
        startGame();
    }
})

// Обработчик события для выбора времени
gameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle')) {
        clickSound.currentTime = 0; // Сбрасываем время воспроизведения
        clickSound.play(); // Воспроизводим звук

        score++;
        moveCircle(event.target);
    }
})

restartButton.addEventListener('click', restartGame);

restartButton.addEventListener('mouseenter', () => {
    restartButton.style.transitionDelay = '0s';
});

volumeControl.addEventListener('click', () => {
    isMuted = !isMuted;

    if (isMuted) {
        volumeIcon.classList.add('bx-volume-mute');
        clickSound.muted = true;
    } else {
        volumeIcon.classList.remove('bx-volume-mute');
        clickSound.muted = false;
    }
})

function startGame() {
    score = 0;

    timeDisplay.parentNode.classList.remove('hide');

    gameBoard.innerHTML = '';

    intervalId = setInterval(decreaseTime, 1000);

    createCircle();

    setTimeDisplay(timeRemaining);
}

function decreaseTime() {
    if (timeRemaining <= 0) {
        finishGame();
    } else {
        timeRemaining--;
        setTimeDisplay(timeRemaining);
    }
}

function setTimeDisplay(value) {
    const formattedTime = value < 10 ? `00:0${value}` : `00:${value}`;
    timeDisplay.innerHTML = formattedTime;
}

function finishGame() {
    clearInterval(intervalId);

    timeDisplay.parentNode.classList.add('hide');

    gameBoard.innerHTML = `<h1>Счёт: <span class="primary">${score}</span></h1>`

    restartButton.classList.remove('hide');
}

// Функция для создания и настройки круга
function setupCircle(element) {
    const size = getRandomNumber(10, 60);
    const { width, height } = gameBoard.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    const color = getRandomColor();

    element.classList.add('circle');
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.top = `${y}px`;
    element.style.left = `${x}px`;
    element.style.backgroundColor = `${color}`;
}

function createCircle() {
    const circle = document.createElement('div');
    setupCircle(circle);

    gameBoard.append(circle);
}

function moveCircle(circle) {
    setupCircle(circle);
}

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function restartGame() {
    restartButton.classList.add('hide');
    restartButton.style.transitionDelay = '0.5s';

    screens[1].classList.remove('up');
}

