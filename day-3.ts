import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-3-input.txt';
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim().split('\n');
  let total = 0;

  lines.forEach(line => {
    const nums = line.split('').map(Number);

    // turn on exactly two batteries
    let maxIdx = 0;
    let max = nums[maxIdx]!;
    for (let i = 1; i < nums.length - 1; i++) {
      if (nums[i]! > max) {
        max = nums[i]!;
        maxIdx = i;
      }
    } 

    let secondMaxIdx = maxIdx + 1;
    let secondMax = nums[secondMaxIdx]!;
    for (let j = secondMaxIdx + 1 ; j < nums.length; j++) {
      if (nums[j]! > secondMax) {
        secondMax = nums[j]!;
        secondMaxIdx = j;
      }
    }

    const joltage = max * 10 + secondMax;
    total += joltage;
  });

  console.log('Total joltage with two batteries:', total);
}

async function part2() {
  const filePath = './day-3-input.txt';
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim().split('\n');
  let total = 0;

  lines.forEach(line => {
    const nums = line.split('').map(Number);

    // turn on exactly twelve batteries
    // Refer to leetcode 402 - Remove K Digits
    // Here we want to remove (n - 12) digits to get the largest number
    let k = nums.length - 12;
    const stack: number[] = [];
    for (let c of nums) {
      while (stack.length && k > 0 && c > stack[stack.length-1]!) {
        stack.pop();
        k--;
      }
      stack.push(c);
    }

    while (stack.length && k > 0) {
      stack.pop();
      k--;
    }

    const maxResult = Number(stack.join(''));
    total += maxResult;
  });

  console.log('Total joltage with twelve batteries:', total);
}

part1();
part2();
