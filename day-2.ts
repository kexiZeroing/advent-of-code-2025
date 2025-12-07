import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-2-input.txt';
  const fileContent = await readTextFile(filePath);

  const ranges = fileContent.trim().split(',').map(r => {
    return r.split('-').map(Number);
  });
  // invalid ID is made only of some sequence of digits repeated twice
  const invalidIDs: number[] = [];

  ranges.forEach(([start, end]) => {
    for (let cur = start; cur <= end; cur++) {
      const strID = cur.toString();
      const firstHalf = strID.slice(0, strID.length / 2);
      const secondHalf = strID.slice(strID.length / 2);
      if (firstHalf === secondHalf) {
        invalidIDs.push(cur);
      }
    }
  });

  const sum = invalidIDs.reduce((acc, val) => acc + val);
  console.log('part1: Sum of the invalid IDs:', sum);
}

async function part2() {
  const filePath = './day-2-input.txt';
  const fileContent = await readTextFile(filePath);

  const ranges = fileContent.trim().split(',').map(r => {
    return r.split('-').map(Number);
  });

  // invalid ID is made only of some sequence of digits repeated at least twice
  let invalidIDs: number[] = [];

  ranges.forEach(([start, end]) => {
    // check each ID in the range
    for (let cur = start; cur <= end; cur++) {
      const strID = cur.toString();
      const len = strID.length;

      let isInvalid = false;

      // try every possible substring length L that divides len
      for (let L = 1; L <= len / 2; L++) {
        if (len % L !== 0) {
          continue;
        }

        const repeats = len / L;
        const subStr = strID.slice(0, L);
        // build the repeated string
        let builtStr = '';
        for (let r = 0; r < repeats; r++) {
          builtStr += subStr;
        }
        
        if (builtStr === strID) {
          isInvalid = true;
          break;
        }
      }

      if (isInvalid) {
        invalidIDs.push(cur);
      }
    }
  });

  const sum = invalidIDs.reduce((acc, val) => acc + val);
  console.log('part2: Sum of the invalid IDs:', sum);
}

part1();
part2();
