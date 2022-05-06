'use strict';

const CELLS_NUMBER = 7;             // number of all cells in play row
const STAR_CELLS_NUMBER = 2;        // number of star cells in play row
const MAX_STAR_VALUE = 11;          // maximum value in the selection range for lucky star cells
const NOT_STAR_CELLS_NUMBER = CELLS_NUMBER - STAR_CELLS_NUMBER;
const MAX_VALUE = 50;               // maximum value in the selection range for cells

let numbers = [];                   // list of all chosen numbers

const gameBoard = document.querySelector(".game__board");
const playRowNumbers = document.querySelectorAll(".play-row__numbers > .cell");
const container = document.querySelector('.container');

const randomizer = (min, max) => Math.round(min + Math.random() * (max - min));

function startGame() {
    document.querySelector(".game-play").style.display = "block";
    document.querySelector(".home").classList.add("disabledbutton");
    container.scrollBy({
        top: 0,
        left: 700,
        behavior: 'smooth'
    });
    renderGameBoard();
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

// fill a game board with cells with values from 1 to maximum value (k)
function fillGameBoard(k) {
    for (let i = 1; i <= k; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = i;
        gameBoard.append(cell);
    }
}

// remove all cells from  a game board
function cleanGameBoard() {
    document.querySelector(".game__board").innerHTML = "";
}

// fill the play row with the chosen numbers from the numbers list
function renderPlayRow() {
    for (let i = 0, j = 0; j < CELLS_NUMBER; i++, j++) {
        if (numbers[i]) {
            playRowNumbers[j].textContent = numbers[i];
            playRowNumbers[i].classList.remove('cell_active');
            playRowNumbers[i].classList.add('cell_chosen');
        }
        else {
            playRowNumbers[j].textContent = "";
            playRowNumbers[j].classList.remove('cell_active', 'cell_chosen');
        }
    }
    // the first empty cell in the row is always an active cell
    if (numbers.length < CELLS_NUMBER) {
        playRowNumbers[numbers.length].classList.add('cell_active');
    }
}

// build and fill the game board according to the value of 
// the maximum value in the selection range for cells
function renderGameBoard() {
    cleanGameBoard();
    if (numbers.length < NOT_STAR_CELLS_NUMBER) {
        gameBoard.classList.remove('game__board_small');
        gameBoard.classList.add('game__board_big');
        fillGameBoard(MAX_VALUE);
        paintGameBoard(numbers.slice(0, CELLS_NUMBER));
    }
    else {
        gameBoard.classList.remove('game__board_big');
        gameBoard.classList.add('game__board_small');
        fillGameBoard(MAX_STAR_VALUE);
        paintGameBoard(numbers.slice(NOT_STAR_CELLS_NUMBER));
    }
}

// mark all chosen numbers on the game board
function paintGameBoard(nums) {
    let boardCells = gameBoard.querySelectorAll('.cell');
    for (let i of nums) {
        boardCells[i - 1].classList.add('cell_chosen');
    }
}

// select or deselect a number depending on the state of the cell
function selectNumber(el) {
    if (!el.classList.contains('cell_chosen')) {
        if (numbers.length < CELLS_NUMBER) {
            numbers.push(el.textContent);
        }
    }
    else {
        // remove the last occurrence of the selected number in the list of chosen numbers
        numbers.splice(numbers.lastIndexOf(el.textContent), 1);
    }
}

// add n of random unique numbers between 1 and max inclusively to the numbers list
function addRandomNumbers(n, max) {
    while (numbers.length < n) {
        let num = randomizer(1, max).toString();
        if (numbers.indexOf(num) === -1) {
            numbers.push(num)
        };
    }
}

document.querySelector('#lucky-dip-button').addEventListener('click', function () {
    resetGame();
    addRandomNumbers(NOT_STAR_CELLS_NUMBER, MAX_VALUE);
    addRandomNumbers(CELLS_NUMBER, MAX_STAR_VALUE);
    updateGame();
})

gameBoard.addEventListener('click', function (event) {
    if (!event.target.classList.contains("cell")) return;
    selectNumber(event.target);
    updateGame();
});

function updateGame() {
    renderPlayRow();
    renderGameBoard();
}

function resetGame() {
    numbers = [];
    updateGame();
}

document.querySelector('#cancel-button').addEventListener('click', function (event) {
    numbers.pop();
    updateGame();
})

document.querySelector('#clear-button').addEventListener('click', resetGame);
document.querySelector('#clear-icon').addEventListener('click', resetGame);

document.querySelector('#betslip-button').addEventListener('click', function (event) {
    resetGame();
    endGame();
})