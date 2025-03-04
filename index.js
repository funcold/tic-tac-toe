const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let playerNow = CROSS;
let fieldSize = 3;
let field = [];
let movesMade = 0;
let endGame = false;

const container = document.getElementById('fieldWrapper');

const submitButton = document.getElementById('submitButton');
const textInput = document.getElementById('textInput');
submitButton.addEventListener('click', function() {
    fieldSize = +textInput.value;
    if (isNaN(fieldSize) || fieldSize < 3) {
        return;
    }
    console.log(fieldSize);
    startGame();
});

startGame();
addResetListener();



function startGame () {
    renderGrid(fieldSize);
    playerNow = CROSS;
    makeEmptyField();
    movesMade = 0;
    endGame = false;
}

function makeEmptyField() {
    field = [];
    for (let i = 0; i < fieldSize; ++i) {
        field.push(new Array(fieldSize).fill(EMPTY));
    }
}

function expandField() {
    ++fieldSize;
    for (let row of field){
        row.push(EMPTY);
    }
    field.push(new Array(fieldSize).fill(EMPTY));
    renderGrid(fieldSize);
    for (let row = 0; row < fieldSize; ++row) {
        for (let col = 0; col < fieldSize; ++col) {
            renderSymbolInCell(field[row][col], row, col);
        }
    }
}

function checkWinner() {
    for (let row = 0; row < fieldSize; row++) {
        for (let col = 0; col <= fieldSize - fieldSize; col++) {
            const symbol = field[row][col];
            if (symbol !== EMPTY && checkLine(field, symbol, row, col, 0, 1, fieldSize)) {
                renderWinningCells(symbol, row, col, 0, 1, fieldSize);
                return symbol;
            }
        }
    }

    for (let col = 0; col < fieldSize; col++) {
        for (let row = 0; row <= fieldSize - fieldSize; row++) {
            const symbol = field[row][col];
            if (symbol !== EMPTY && checkLine(field, symbol, row, col, 1, 0, fieldSize)) {
                renderWinningCells(symbol, row, col, 1, 0, fieldSize);
                return symbol;
            }
        }
    }

    for (let row = 0; row <= fieldSize - fieldSize; row++) {
        for (let col = 0; col <= fieldSize - fieldSize; col++) {
            const symbol = field[row][col];
            if (symbol !== EMPTY && checkLine(field, symbol, row, col, 1, 1, fieldSize)) {
                renderWinningCells(symbol, row, col, 1, 1, fieldSize);
                return symbol;
            }
        }
    }

    for (let row = 0; row <= fieldSize - fieldSize; row++) {
        for (let col = fieldSize - 1; col >= fieldSize - fieldSize; col--) {
            const symbol = field[row][col];
            if (symbol !== EMPTY && checkLine(field, symbol, row, col, 1, -1, fieldSize)) {
                renderWinningCells(symbol, row, col, 1, -1, fieldSize);
                return symbol;
            }
        }
    }

    return false;
}

function checkLine(field, symbol, startRow, startCol, deltaRow, deltaCol, fieldSize) {
    for (let i = 0; i < fieldSize; i++) {
        if (field[startRow + i * deltaRow][startCol + i * deltaCol] !== symbol) {
            return false;
        }
    }
    return true;
}

function renderWinningCells(symbol, startRow, startCol, deltaRow, deltaCol, fieldSize) {
    for (let i = 0; i < fieldSize; i++) {
        const row = startRow + i * deltaRow;
        const col = startCol + i * deltaCol;
        renderSymbolInCell(symbol, row, col, '#ff0000');
    }
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (endGame) {
        return;
    }
    if (field[row][col] === EMPTY) {
        renderSymbolInCell(playerNow, row, col);
        field[row][col] = playerNow;
        playerNow = playerNow == CROSS ? ZERO : CROSS;
        ++movesMade;
    }
    updateGameState();
}

function updateGameState() {
    let winner = checkWinner();
    if (winner) {
        endGame = true;
        console.log(`Победил ${winner}`);
    } else if (movesMade == fieldSize * fieldSize) {
        endGame = true;
        console.log("Победила дружба");
    } else if (movesMade > fieldSize * fieldSize / 2) {
        expandField();
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}

function findWinningMove(field, playerNow) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (field[i][j] === EMPTY) {
                field[i][j] = playerNow;
                if (checkWinner(field, playerNow)) {
                    return [i, j];
                }
                field[i][j] = EMPTY;
            }
        }
    }
    return null;
}

function makeSmartMove(field) {
    let winningMove = findWinningMove(field, ZERO);
    if (winningMove) {
        field[winningMove[0]][winningMove[1]] = ZERO;
        return field;
    }

    let blockMove = findWinningMove(field, CROSS);
    if (blockMove) {
        field[blockMove[0]][blockMove[1]] = ZERO;
        return field;
    }

    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (field[i][j] === EMPTY) {
                emptyCells.push([i, j]);
            }
        }
    }

    let randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    field[randomMove[0]][randomMove[1]] = ZERO;

    return field;

}


function makeAssistentMove (field) {
    let emptyCells = [];

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] == EMPTY)
                emptyCells.push([i, j]);
        }
        if (emptyCells.length === 0) {
            return field;
        }

        let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        field[row][col] = ZERO;

        return field
    }

}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
