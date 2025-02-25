const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let playerNow = CROSS;
let field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
let movesMade = 0;
let endGame = false;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
    playerNow = CROSS;
    field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
    movesMade = 0;
    endGame = false;
}

function checkWinner() {
    for (let row = 0; row < 3; row++) {
        if (field[row][0] === field[row][1] && field[row][1] === field[row][2] && field[row][0] !== EMPTY) {
            renderSymbolInCell(field[row][0], row, 0, '#ff0000');
            renderSymbolInCell(field[row][0], row, 1, '#ff0000');
            renderSymbolInCell(field[row][0], row, 2, '#ff0000');
            return field[row][0];
        }
    }

    for (let col = 0; col < 3; col++) {
        if (field[0][col] === field[1][col] && field[1][col] === field[2][col] && field[0][col] !== EMPTY) {
            renderSymbolInCell(field[0][col], 0, col, '#ff0000');
            renderSymbolInCell(field[0][col], 1, col, '#ff0000');
            renderSymbolInCell(field[0][col], 2, col, '#ff0000');
            return field[0][col];
        }
    }

    if (field[0][0] === field[1][1] && field[1][1] === field[2][2] && field[0][0] !== EMPTY) {
        renderSymbolInCell(field[0][0], 0, 0, '#ff0000');
        renderSymbolInCell(field[0][0], 1, 1, '#ff0000');
        renderSymbolInCell(field[0][0], 2, 2, '#ff0000');
        return field[0][0];
    }
    if (field[0][2] === field[1][1] && field[1][1] === field[2][0] && field[0][2] !== EMPTY) {
        renderSymbolInCell(field[0][2], 0, 2, '#ff0000');
        renderSymbolInCell(field[0][2], 1, 1, '#ff0000');
        renderSymbolInCell(field[0][2], 2, 0, '#ff0000');
        return field[0][2];
    }

    return false;
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
    console.log(field);
    if (endGame) {
        return;
    }
    if (field[row][col] === EMPTY) {
        renderSymbolInCell(playerNow, row, col);
        field[row][col] = playerNow;
        playerNow = playerNow == CROSS ? ZERO : CROSS;
        ++movesMade;
    }
    let winner = checkWinner();
    console.log(winner);
    if (winner) {
        endGame = true;
        console.log(`Победил ${winner}`);
    } else if (movesMade == 9) {
        endGame = true;
        console.log("Победила дружба");
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
