import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-6-input.txt';
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim().split('\n').map(line => line.split(/\s+/).filter(Boolean));

  const rows = lines.length - 1;
  const cols = lines[0]!.length;
  let total = 0;

  for (let i = 0; i < cols; i++) {
    // only add or multiply
    const isAdd = lines[rows]![i] === '+';
    let res = isAdd ? 0 : 1;
    for (let r = 0; r < rows; r++) {
      res = isAdd ? res + Number(lines[r]![i]) : res * Number(lines[r]![i]);
    }
    total += res;
  }

  console.log('part1: total result by adding all of the answers:', total);
}

async function part2() {
  const filePath = './day-6-input.txt';
  const fileContent = await readTextFile(filePath);
  // Create a matrix by splitting twice
  const lines = fileContent.split('\n').map(line => line.split(''));

  const rows = lines.length;
  const cols = lines[0]!.length;
  let stack = [];
  let total = 0;

  // Math is written right-to-left in columns. 
  // Each number is given in its own column.
  for (let c = cols - 1; c >= 0; c--) {
    let digits = 0;
    for (let r = 0; r < rows; r++) {
      const char = lines[r]![c];
      if (r < rows - 1) {
        // skip spaces because they can't be parsed as zero
        // last row can't be skipped
        if (char === ' ') {
          continue;
        }
        digits = digits * 10 + Number(char);
      }
      // last row
      else {
        stack.push(digits);
        digits = 0;
        if (char === '+') {
          let sum = 0;
          while (stack.length > 0) {
            sum += stack.pop()!;
          }
          total += sum;
          // Problems are separated by a full column of only spaces
          c--;
        } else if (char === '*') {
          let prod = 1;
          while (stack.length > 0) {
            prod *= stack.pop()!;
          }
          total += prod;
          c--;
        }
      }
    }
  }

  console.log('part2: total result by adding all of the answers:', total);
}

part1();
part2();
