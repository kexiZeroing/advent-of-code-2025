import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-10-input.txt';
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim()
    .split('\n')
    .map(line => line.split(' ').slice(0, -1));
  
  let totalPresses = 0;

  lines.forEach(machine => {
    const lightsStr = machine[0]!.slice(1, -1);
    const lights = lightsStr.split('').map(c => c === '#' ? 1 : 0);
    
    const buttons = machine.slice(1).map(buttonStr => {
      const nums = buttonStr.slice(1, -1).split(',').map(Number);
      return nums;
    });
    
    const minPresses = findMinimumPresses(lights, buttons);
    totalPresses += minPresses;
  });

  console.log('fewest button presses required:', totalPresses);
}

function findMinimumPresses(target: number[], buttons: number[][]): number {
  const numLights = target.length;
  const numButtons = buttons.length;
  
  // Key insight: pressing a button twice = not pressing it at all
  // So we only need to try pressing each button 0 or 1 times

  // 1. Start with all lights off
  // 2. Press the buttons indicated by the bits in the current combination
  // 3. Toggle the appropriate lights for each button press
  // 4. Check if we reach the target

  let minPresses = Infinity;
  // Every possible way to press these buttons (binary representation)
  const totalCombinations = Math.pow(2, numButtons);

  for (let i = 0; i < totalCombinations; i++) {
    const lights = new Array(numLights).fill(0);
    let pressCount = 0;

    // i = which combination we're trying
    // buttonIndex = which button we're checking
    for (let buttonIndex = 0; buttonIndex < numButtons; buttonIndex++) {
      // 1 << buttonIndex: only one bit turned on at position buttonIndex
      // Example: i = 5 (101)
      // 101 & 001 = 001 = 1 → press button 0
      // 101 & 010 = 000 = 0 → don't press button 1
      // 101 & 100 = 100 = 4 → press button 2
      const shouldPress = (i & (1 << buttonIndex)) !== 0;
      
      if (shouldPress) {
        pressCount++;
        // Toggle all lights affected by this button
        for (const lightIndex of buttons[buttonIndex]!) {
          lights[lightIndex] = lights[lightIndex] === 0 ? 1 : 0;
        }
      }
    }

    // Check if lights match target
    let matches = true;
    for (let j = 0; j < numLights; j++) {
      if (lights[j] !== target[j]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      minPresses = Math.min(minPresses, pressCount);
    }
  }
  
  return minPresses;
}

part1();
