import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-7-input.txt';
  const fileContent = await readTextFile(filePath);
  const matrix = fileContent.split('\n').map(line => line.split(''));

  const rows = matrix.length;
  const cols = matrix[0]!.length;
  const beamSet = new Set<number>();
  beamSet.add(matrix[0]!.findIndex(char => char === 'S'));
  let splits = 0;

  for (let r = 1; r < rows; r++) {
    beamSet.forEach(c => {
      if (matrix[r]![c] === '^') {
        splits++;
        beamSet.delete(c);
        if (c - 1 >= 0) {
          beamSet.add(c - 1);
        }
        if (c + 1 < cols) {
          beamSet.add(c + 1);
        }
      }
    });
  }
  
  console.log('Times the beam be split:', splits);
}

async function part2() {
  const filePath = './day-7-input.txt';
  const fileContent = await readTextFile(filePath);
  const matrix = fileContent.split('\n').map(line => line.split(''));

  const rows = matrix.length;
  const cols = matrix[0]!.length;
  
  // DP approach (track the # of timelines at each column position)
  // Map: each column position -> # of timelines
  let timelineCount = new Map<number, number>();
  timelineCount.set(matrix[0]!.findIndex(char => char === 'S'), 1);

  for (let r = 1; r < rows; r++) {
    const nextTimelineCount = new Map<number, number>();
    
    for (const [col, count] of timelineCount.entries()) {
      if (matrix[r]![col] === '^') {
        // Left path
        if (col - 1 >= 0) {
          nextTimelineCount.set(col - 1, (nextTimelineCount.get(col - 1) || 0) + count);
        }
        // Right path
        if (col + 1 < cols) {
          nextTimelineCount.set(col + 1, (nextTimelineCount.get(col + 1) || 0) + count);
        }
      } else {
        // No splitter: continue straight down
        nextTimelineCount.set(col, (nextTimelineCount.get(col) || 0) + count);
      }
    }
    timelineCount = nextTimelineCount;
  }
  
  let totalTimelines = 0;
  for (const count of timelineCount.values()) {
    totalTimelines += count;
  }
  
  console.log('Total number of timelines:', totalTimelines);
}

part1();
part2();
