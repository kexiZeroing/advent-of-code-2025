import { readTextFile } from './utils.ts';

const ROLL = '@';
const REMOVED = 'x';
const IGNORE = '.';

function isValid(grid: string[][], row: number, col: number, i: number, j: number): boolean {
  // check if fewer than four '@' in the eight adjacent positions
  let count = 0;
  let directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  
  for (let [dx, dy] of directions) {
    const newRow = i + dx!;
    const newCol = j + dy!;
    if (newRow >= 0 && newRow < row && newCol >= 0 && newCol < col) {
      if (grid[newRow]![newCol] === ROLL || grid[newRow]![newCol] === REMOVED) {
        count++;
      }
    }
  }
  return count < 4;
}

function updateOnce(grid: string[][], row: number, col: number): void {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i]![j] === ROLL && isValid(grid, row, col, i, j)) {
        grid[i]![j] = REMOVED;
      }
    }
  }
}

function countLabelAndReset(grid: string[][], row: number, col: number): number {
  let count = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i]![j] === REMOVED) {
        count++;
        grid[i]![j] = IGNORE;
      }
    }
  }
  return count;
}

async function part1() {
  const filePath = './day-4-input.txt';
  const fileContent = await readTextFile(filePath);
  const grid = fileContent.trim().split('\n').map(line => line.split(''));

  const row = grid.length;
  const col = grid[0]!.length;
  updateOnce(grid, row, col);
  const total = countLabelAndReset(grid, row, col);

  console.log('Count of rolls of paper can be accessed:', total);
}

async function part2() {
  const filePath = './day-4-input.txt';
  const fileContent = await readTextFile(filePath);
  const grid = fileContent.trim().split('\n').map(line => line.split(''));

  const row = grid.length;
  const col = grid[0]!.length;
  
  let total = 0;
  while (true) {
    updateOnce(grid, row, col);
    const count = countLabelAndReset(grid, row, col);
    total += count;

    if (!count) {
      break;
    }
  }

  console.log('Total rolls of paper accessed until no more can be accessed:', total);
}

part1();
part2();
