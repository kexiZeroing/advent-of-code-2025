import { readTextFile } from './utils.ts';

//   0
// 3   1
//   2
// 
// left (toward lower numbers) or right (toward higher numbers)
async function part1() {
  const filePath = './day-1-input.txt';
  const fileContent = await readTextFile(filePath);

  const rotations = fileContent.trim().split('\n').map(line => {
    return [line[0], Number(line.slice(1))] as [string, number];
  });
  const START = 50;
  const TOTAL = 100;
  let current = START;
  let count = 0;

  rotations.forEach(([dir, steps]) => {
    if (dir === 'L') {
      current = current - steps;
      while (current < 0) {
        current += TOTAL;
      }
    } else if (dir === 'R') {
      current = (current + steps) % TOTAL;
    }

    if (current === 0) {
      count += 1;
    }
  });
  
  console.log('Number of times at position 0:', count);
}

async function part2() {
  const filePath = './day-1-input.txt';
  const fileContent = await readTextFile(filePath);

  const rotations = fileContent.trim().split('\n').map(line => {
    return [line[0], Number(line.slice(1))] as [string, number];
  });
  const START = 50;
  const TOTAL = 100;
  let current = START;
  let count = 0;

  rotations.forEach(([dir, steps]) => {
    const normalSteps = steps % TOTAL;
    const repeats = Math.floor(steps / TOTAL);

    if (dir === 'L') {
      // Crossing 0 during partial move?
      const next = current - normalSteps;
      if (current > 0 && next <= 0) {
        count += 1;
      }

      count += repeats;
      
      current = current - steps;
      while (current < 0) {
        current += TOTAL;
      }
    } else if (dir === 'R') {
      const next = current + normalSteps;
      if (current > 0 && next >= TOTAL) {
        count += 1;
      }

      count += repeats;
      current = (current + steps) % TOTAL;
    }
  });
  
  console.log('Number of times pass or at position 0:', count);
}

part1();
part2();
