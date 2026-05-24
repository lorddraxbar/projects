const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
let score = 0;

const candyColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        let randomColor = Math.floor(Math.random() * candyColors.length);
        square.classList.add(candyColors[randomColor]);
        grid.appendChild(square);
        squares.push(square);
    }
}
createBoard();

// Dragging Logic
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

squares.forEach(square => square.addEventListener('dragstart', dragStart));
squares.forEach(square => square.addEventListener('dragend', dragEnd));
squares.forEach(square => square.addEventListener('dragover', dragOver));
squares.forEach(square => square.addEventListener('dragenter', dragEnter));
squares.forEach(square => square.addEventListener('dragleave', dragLeave));
squares.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
    colorBeingDragged = this.className;
    squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); }
function dragLeave() {}

function dragDrop() {
    colorBeingReplaced = this.className;
    squareIdBeingReplaced = parseInt(this.id);
    this.className = colorBeingDragged;
    squares[squareIdBeingDragged].className = colorBeingReplaced;
}

function dragEnd() {
    let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width
    ];
    let isValidMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && isValidMove) {
        // Check if the move actually results in a match by simulating it? 
        // Actually simpler: just check matches after drop. If no match, revert.
        let hasMatch = checkMatches(); 
        if(!hasMatch) { 
             squares[squareIdBeingReplaced].className = colorBeingReplaced;
             squares[squareIdBeingDragged].className = colorBeingDragged;
        }
    } else if (squareIdBeingReplaced !== undefined) {
         squares[squareIdBeingReplaced].className = colorBeingReplaced;
         squares[squareIdBeingDragged].className = colorBeingDragged;
    }
}

// Match Checking Logic
function checkMatches() {
    let matchFound = false;
    // Check rows of 3
    for (let i = 0; i < 64; i++) {
        let rowOfThree = [i, i + 1, i + 2];
        let decidedColor = squares[i].className;
        const isBlank = squares[i].className === '';

        if (i % width < 6) { // Ensure not wrapping around rows
            if (rowOfThree.every(index => index < 64 && squares[index] && squares[index].className === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => {
                    squares[index].className = '';
                });
                matchFound = true;
            }
        }
    }

    // Check columns of 3
    for (let i = 0; i < 48; i++) {
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedColor = squares[i].className;
        const isBlank = squares[i].className === '';

        if (columnOfThree.every(index => index < 64 && squares[index] && squares[index].className === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.innerHTML = score;
            columnOfThree.forEach(index => {
                squares[index].className = '';
            });
            matchFound = true;
        }
    }
    return matchFound;
}

// Refill Logic
function moveDown() {
    for (let i = 0; i < 56; i++) {
        if (squares[i + width].className === '') {
            squares[i + width].className = squares[i].className;
            squares[i].className = '';
        }
    }

    // Fill top row if empty
    for (let i = 0; i < 8; i++) {
        if (squares[i].className === '') {
            let randomColor = Math.floor(Math.random() * candyColors.length);
            squares[i].className = candyColors[randomColor];
        }
    }
}

window.setInterval(function(){
    checkMatches();
    moveDown();
}, 100);