import { readTextFile } from "./utils.ts";

async function part1() {
  const filePath = "./day-11-input.txt";
  const fileContent = await readTextFile(filePath);
  const devices: Record<string, string[]> = {};

  fileContent.split("\n").forEach((line) => {
    const [key, val] = line.split(": ") as [string, string];
    devices[key] = val.split(" ");
  });

  const START = "you";
  const END = "out";

  // BFS to find different paths leading from `you` to `out`.
  // assumes the input is a Directed Acyclic Graph (DAG), 
  const queue: string[] = [START];
  let count = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === END) {
      count++;
      continue;
    }

    for (const neighbor of devices[current] ?? []) {
      queue.push(neighbor);
    }
  }

  console.log("part1: Different paths found:", count);

  // If you need to handle cycles in the graph, you can use the following approach:
  // Each element in the queue is now [currentNode, pathHistory]
  // You put the entire path taken to get there.
  // const queue: [string, Set<string>][] = [[START, new Set([START])]];
  // let count = 0;

  // while (queue.length > 0) {
  //   const [current, visited] = queue.shift()!;

  //   if (current === END) {
  //     count++;
  //     continue;
  //   }

  //   for (const neighbor of devices[current] ?? []) {
  //     if (!visited.has(neighbor)) {
  //       const nextVisited = new Set(visited);
  //       nextVisited.add(neighbor);
  //       queue.push([neighbor, nextVisited]);
  //     }
  //   }
  // }
}

// Below is correct, but too slow to complete in reasonable time for larger inputs
// async function part2() {
//   const filePath = "./day-11-input.txt";
//   const fileContent = await readTextFile(filePath);
//   const devices: Record<string, string[]> = {};

//   fileContent.split("\n").forEach((line) => {
//     const [key, val] = line.split(": ") as [string, string];
//     devices[key] = val.split(" ");
//   });
  
//   const START = "svr";
//   const END = "out";
//   const MUST_VISIT_1 = "dac";
//   const MUST_VISIT_2 = "fft";

//   // Queue stores: [currentNode, hasVisitedDac, hasVisitedFft]
//   const queue: Array<[string, boolean, boolean]> = [[START, false, false]];
//   let count = 0;

//   while (queue.length > 0) {
//     const [current, hasDac, hasFft] = queue.shift()!;

//     const newHasDac = hasDac || current === MUST_VISIT_1;
//     const newHasFft = hasFft || current === MUST_VISIT_2;

//     if (current === END) {
//       if (newHasDac && newHasFft) {
//         count++;
//       }
//       continue;
//     }

//     for (const neighbor of devices[current] ?? []) {
//       queue.push([neighbor, newHasDac, newHasFft]);
//     }
//   }

//   console.log("part2: Different paths found:", count);
// }

async function part2() {
  const filePath = "./day-11-input.txt";
  const fileContent = await readTextFile(filePath);
  const devices: Record<string, string[]> = {};

  fileContent.split("\n").forEach((line) => {
    const [key, val] = line.split(": ") as [string, string];
    devices[key] = val.split(" ");
  });

  const START = "svr";
  const END = "out";
  const MUST_VISIT_1 = "dac";
  const MUST_VISIT_2 = "fft";

  // We use recursion with memoization
  // only calculate the "number of paths to the end" for each node exactly once.
  // 1. CACHE: The memoization map
  // 2. UPDATE STATE: Update conditions based on where we are now
  // 3. BASE CASE: Success or Failure
  // 4. MEMO CHECK: Have we seen this exact state before
  // 5. RECURSION: Sum the results of all possible next moves
  // 6. SAVE & RETURN: Store the result before finishing

  // Memoization Map: "node-hasDac-hasFft" -> number of paths to the end
  const memo = new Map<string, number>();

  const result = countPaths(START, false, false);
  console.log("part2: Different paths found:", result);

  function countPaths(current: string, hasDac: boolean, hasFft: boolean): number {
    const nowHasDac = hasDac || current === MUST_VISIT_1;
    const nowHasFft = hasFft || current === MUST_VISIT_2;

    if (current === END) {
      return (nowHasDac && nowHasFft) ? 1 : 0;
    }

    // If we've already solved this specific state, return it
    const stateKey = `${current}-${nowHasDac}-${nowHasFft}`;
    if (memo.has(stateKey)) {
      return memo.get(stateKey)!;
    }

    let totalPathsFromHere = 0;

    for (const neighbor of devices[current] ?? []) {
      totalPathsFromHere += countPaths(neighbor, nowHasDac, nowHasFft);
    }

    memo.set(stateKey, totalPathsFromHere);
    return totalPathsFromHere;
  }
}

part1();
part2();
