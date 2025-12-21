import { readTextFile } from './utils.ts';

async function part1() {
  const filePath = './day-9-input.txt';
  const fileContent = await readTextFile(filePath);
  const tiles = fileContent.split('\n').map(line => line.split(',').map(Number));
  
  const n = tiles.length;
  let largest = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = tiles[i]! as [number, number];
      const [x2, y2] = tiles[j]! as [number, number];
      const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
      if (area > largest) {
        largest = area;
      }
    }
  }

  console.log('Largest area of any rectangle:', largest);
}

// It works for small inputs but may be too slow for large inputs.
async function part2() {
  const filePath = './day-9-input.txt';
  const fileContent = await readTextFile(filePath);
  const tiles = fileContent.split('\n').map(line => line.split(',').map(Number));

  const n = tiles.length;
  const redTiles = new Set<string>(tiles.map(([x, y]) => `${x},${y}`));
  const greenTiles = new Set<string>();

  // 1. Add green tiles connecting consecutive red tiles
  for (let i = 0; i < n; i++) {
    const [x1, y1] = tiles[i]! as [number, number];
    const [x2, y2] = tiles[(i + 1) % n]! as [number, number];

    // Tiles that are adjacent in your list will always be on either the same row or the same column.
    if (x1 === x2) {
      // Same column, different rows
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY + 1; y < maxY; y++) {
        greenTiles.add(`${x1},${y}`);
      }
    } else {
      // Same row, different columns
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX + 1; x < maxX; x++) {
        greenTiles.add(`${x},${y1}`);
      }
    }
  }

  // 2. Find all tiles inside the loop (ray casting algorithm)
  /*
   * The ray casting is used to determine if a point is located inside a polygon.
   * It works by drawing a ray from the point in any direction and counting how many times
   * it intersects with the polygon's edges.
   * 
   * If the ray intersects an odd number of times, the point is considered inside the polygon.
   * If the ray intersects an even number of times, the point is considered outside the polygon.
   * 
   * Examples:
   * Outside:  P----->|      |  (crosses 2 walls - even = outside)
   * Inside:   |      P----->|  (crosses 1 wall - odd = inside)
   * 
   * Complete Visual Example:
   * Polygon edges (red tiles connected):

      (2,1) ●-------● (6,1)
            |       |
      (2,4) ●-------● (6,4)

      Test point P at (3, 2):
      P(3,2) ------->

      Edge 1: (2,1) to (6,1)
        - Does it cross y=2? No (both y1=1 and y2=1 are below y=2)
      Edge 2: (6,1) to (6,4)
        - Does it cross y=2? Yes (y1=1 < 2 < y2=4)
        - xIntersect = 6 + (2-1)*(6-6)/(4-1) = 6
        - Is 6 > 3? Yes! Count it. intersections = 1
      Edge 3: (6,4) to (2,4)
        - Does it cross y=2? No (both y1=4 and y2=4 are above y=2)
      Edge 4: (2,4) to (2,1)
        - Does it cross y=2? Yes (y1=4 > 2 > y2=1)
        - xIntersect = 2 + (2-4)*(2-2)/(1-4) = 2
        - Is 2 > 3? No. Do not count it.
   */

  // Find bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const [x, y] of tiles) {
    minX = Math.min(minX, x!);
    maxX = Math.max(maxX, x!);
    minY = Math.min(minY, y!);
    maxY = Math.max(maxY, y!);
  }
  
  // Check each point in the bounding box
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const key = `${x},${y}`;
      if (redTiles.has(key) || greenTiles.has(key)) {
        continue;
      }

      // Use ray casting: count intersections with polygon edges
      let intersections = 0;
      for (let i = 0; i < n; i++) {
        const [x1, y1] = tiles[i]! as [number, number];
        const [x2, y2] = tiles[(i + 1) % n]! as [number, number];
        
        // Check if horizontal ray from (x, y) intersects edge (x1,y1)-(x2,y2)
        if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
          // This uses linear interpolation
          const xIntersect = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
          if (xIntersect > x) {
            intersections++;
          }
        }
      }

      // If odd number of intersections, point is inside
      if (intersections % 2 === 1) {
        greenTiles.add(key);
      }
    }
  }

  // 3. Find the largest rectangle
  const validTiles = new Set([...redTiles, ...greenTiles]);
  let largest = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = tiles[i] as [number, number];
      const [x2, y2] = tiles[j] as [number, number];
      
      const minRectX = Math.min(x1, x2);
      const maxRectX = Math.max(x1, x2);
      const minRectY = Math.min(y1, y2);
      const maxRectY = Math.max(y1, y2);

      // Check if all tiles in rectangle are valid
      let allValid = true;
      for (let x = minRectX; x <= maxRectX && allValid; x++) {
        for (let y = minRectY; y <= maxRectY && allValid; y++) {
          if (!validTiles.has(`${x},${y}`)) {
            allValid = false;
          }
        }
      }

      if (allValid) {
        const area = (maxRectX - minRectX + 1) * (maxRectY - minRectY + 1);
        largest = Math.max(largest, area);
      }
    }
  }

  console.log('Largest area of rectangles including valid tiles:', largest);
}

part1();
part2();
