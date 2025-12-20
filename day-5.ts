import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-5-input.txt';
  const fileContent = await readTextFile(filePath);
  const [ranges, list] = fileContent.trim().split('\n\n');

  const freshRanges = ranges!.split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end] as [number, number];
  });
  const ingredients = list!.split('\n').map(line => Number(line));

  let count = 0;
  for (const ingredient of ingredients) {
    let isInRange = false;
    for (const range of freshRanges) {
      if (ingredient >= range[0] && ingredient <= range[1]) {
        isInRange = true;
        break;
      }
    }
    if (isInRange) {
      count++;
    }
  }

  console.log('Count of fresh ingredients:', count);
}

async function part2() {
  const filePath = './day-5-input.txt';
  const fileContent = await readTextFile(filePath);
  const [ranges, _] = fileContent.trim().split('\n\n');

  const freshRanges = ranges!.split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end] as [number, number];
  });

  // Sort and merge all overlapping ranges.
  // Refer to leetcode 56 - Merge Intervals
  freshRanges.sort((a, b) => a[0] - b[0]);
  let mergedRanges: [number, number][] = [];
  for (let i = 0; i < freshRanges.length - 1; i++) {
    const cur = freshRanges[i] as [number, number];
    const next = freshRanges[i + 1] as [number, number];

    if (cur[1] >= next[0]) {
      freshRanges[i] = undefined as any;
      freshRanges[i + 1] = [Math.min(cur[0], next[0]), Math.max(cur[1], next[1])];
    }
  }
  mergedRanges = freshRanges.filter(r => r);

  // total fresh ingredients
  let total = 0;
  for (const range of mergedRanges) {
    total += range[1] - range[0] + 1;
  }

  console.log('Total fresh ingredients:', total);
}

part1();
part2();
