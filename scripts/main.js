'use strict';

const CELLS_NUMBER = 7;
const STAR_CELLS_NUMBER = 2;
const NOT_STAR_CELL_NUMBER = CELLS_NUMBER - STAR_CELLS_NUMBER;

let numbers = [];

const gameBoard = document.querySelector(".game__board");
const playRowNumbers = document.querySelectorAll(".play-row_numbers > .cell");
const container = document.querySelector('.container');

function startGame() {
    document.querySelector(".game-play").style.display = "block";
    document.querySelector(".home").classList.add("disabledbutton");
    container.scrollBy({
        top: 0,
        left: 700,
        behavior: 'smooth'
    });
    renderBoard();
}

function endGame() {
    document.querySelector(".home").classList.remove("disabledbutton");
    container.scrollBy({
        top: 0,
        left: -700,
        behavior: 'smooth'
    });
}

document.querySelector("#euro-millions-game").addEventListener("click", startGame);

function fullGameBoard(k) {
    for (let i = 0; i < k; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = i + 1;
        gameBoard.append(cell);
    }
}

function cleanGameBoard() {
    document.querySelector(".game__board").innerHTML = "";
}

function renderPlayRow() {
    for (let i = 0, j = 0; j < CELLS_NUMBER; i++, j++) {
        if (numbers[i]) {
            playRowNumbers[j].textContent = numbers[i];
            playRowNumbers[i].classList.add('cell_chosen');
        }
        else {
            playRowNumbers[j].textContent = "";
            playRowNumbers[j].classList.remove('cell_active', 'cell_chosen');
        }
    }
    if (numbers.length < CELLS_NUMBER) {
        playRowNumbers[numbers.length].classList.add('cell_active');
    }
}

function renderBoard() {
    cleanGameBoard();
    if (numbers.length < NOT_STAR_CELL_NUMBER) {
        gameBoard.classList.remove('game__board_small');
        gameBoard.classList.add('game__board_big');
        fullGameBoard(50);
        renderBoard_aux(numbers.slice(0, CELLS_NUMBER));
    }
    else {
        gameBoard.classList.remove('game__board_big');
        gameBoard.classList.add('game__board_small');
        fullGameBoard(11);
        renderBoard_aux(numbers.slice(NOT_STAR_CELL_NUMBER));
    }
}

function renderBoard_aux(nums) {
    let boardCells = gameBoard.querySelectorAll('.cell');
    for (let i of nums) {
        boardCells[i - 1].classList.add('cell_chosen');
    }
}

function selectNumber(el) {
    let n = el.textContent;
    if (!el.classList.contains('cell_chosen')) {
        if (numbers.length < CELLS_NUMBER) {
            numbers.push(n);
        }
    }
    else {
        numbers.splice(numbers.indexOf(n), 1);
    }
}

gameBoard.addEventListener('click', function (event) {
    if (!event.target.classList.contains("cell")) return;
    selectNumber(event.target);
    updateGame();
});

function updateGame() {
    renderPlayRow();
    renderBoard();
}

function resetGame() {
    numbers = [];
    updateGame()
}

document.querySelector('#cancel-button').addEventListener('click', function (event) {
    numbers.pop()
    updateGame();
})

document.querySelector('#clear-button').addEventListener('click', resetGame);

document.querySelector('#betslip-button').addEventListener('click', function (event) {
    resetGame();
    endGame();
})