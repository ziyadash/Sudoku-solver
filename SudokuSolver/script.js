// script.js

document.addEventListener('DOMContentLoaded', createGrid);

const solveButton = document.getElementById('solveButton');
const clearButton = document.getElementById('clearButton');
const verifyButton = document.getElementById('verifyButton');

solveButton.addEventListener('click', solveSudoku);
clearButton.addEventListener('click', clearGrid);
verifyButton.addEventListener('click', verifySolution);

function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = createCell(`cell-${i}-${j}`);
            gridContainer.appendChild(cell);
        }
    }
}

function createCell(id) {
    const cell = document.createElement('input');
    cell.type = 'number';
    cell.className = 'cell';
    cell.id = id;
    return cell;
}

function possible(x, y, n, grid) {
    for (let i = 0; i < 9; i++) {
        if (grid[i][y] === n || grid[x][i] === n) {
            return false;
        }
    }

    const x0 = Math.floor(x / 3) * 3;
    const y0 = Math.floor(y / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[x0 + i][y0 + j] === n) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku() {
    const grid = getGrid();
    if (countFilledCells(grid) < 17) {
        showModal('Not enough cells filled to generate a solution!');
        return;
    }

    function solve() {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[x][y] === 0) {
                    for (let n = 1; n <= 9; n++) {
                        if (possible(x, y, n, grid)) {
                            grid[x][y] = n;
                            updateCell(x, y, n);
                            if (solve()) {
                                return true;
                            }
                            grid[x][y] = 0;
                            updateCell(x, y, '');
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    if (solve()) {
        showModal('Sudoku solved!');
    } else {
        showModal('No solution exists.');
    }
}

function clearGrid() {
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.value = '';
    });
}

function verifySolution() {
    const grid = getGrid();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);
            const cellValue = parseInt(cell.value);

            if (isNaN(cellValue) || cellValue < 1 || cellValue > 9) {
                showModal('Invalid Sudoku solution: Each cell should have a positive number between 1 and 9.');
                return;
            }

            grid[i][j] = cellValue;
        }
    }

    if (validateGrid(grid)) {
        showModal('Solution is correct!');
    } else {
        showModal('Incorrect Sudoku solution.');
    }
}

function validateGrid(grid) {
    function validateSet(set) {
        const uniqueValues = new Set();
        for (const value of set) {
            if (value !== 0 && uniqueValues.has(value)) {
                return false;
            }
            uniqueValues.add(value);
        }
        return true;
    }

    for (let i = 0; i < 9; i++) {
        const row = grid[i];
        const column = grid.map(row => row[i]);
        const subgrid = getSubgridValues(grid, i);

        if (!validateSet(row) || !validateSet(column) || !validateSet(subgrid)) {
            return false;
        }
    }

    return true;
}

function getSubgridValues(grid, index) {
    const subgridValues = [];
    const rowIndex = Math.floor(index / 3) * 3;
    const colIndex = (index % 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            subgridValues.push(grid[rowIndex + i][colIndex + j]);
        }
    }

    return subgridValues;
}

function getGrid() {
    const grid = [];

    for (let i = 0; i < 9; i++) {
        grid[i] = [];

        for (let j = 0; j < 9; j++) {
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);
            grid[i][j] = parseInt(cell.value) || 0;
        }
    }

    return grid;
}

function updateCell(x, y, value) {
    const cellId = `cell-${x}-${y}`;
    const cell = document.getElementById(cellId);
    cell.value = value;
}

function countFilledCells(grid) {
    return grid.reduce((count, row) => count + row.filter(value => value !== 0).length, 0);
}

function showModal(message) {
    const modalText = document.getElementById('modalText');
    modalText.textContent = message;
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
