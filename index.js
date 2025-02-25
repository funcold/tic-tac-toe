const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
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
    // Пиши код тут
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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


function aiAssistent (field) {
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
