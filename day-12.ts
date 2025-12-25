import { readTextFile } from "./utils.ts";

function parseShapes(block: string[]) {
  const shapes = [];
  for (const shapeBlock of block) {
    const lines = shapeBlock.split("\n");
    const shapeIndex = Number(lines[0]!.split(":")[0]!);
    const shapeLines = lines.slice(1);
    const coords = gridToCoordinates(shapeLines);

    shapes.push({
      index: shapeIndex,
      grid: shapeLines,
      coords,
      transformations: getAllTransformations(coords),
    });
  }
  return shapes;
}

function parseRegions(lines: string[]) {
  const regions = [];
  let i = 0;
  while (i < lines.length) {
    const curLine = lines[i]!;
    const parts = curLine.split(":") as [string, string];
    const [width, height] = parts[0].split("x").map(Number);
    const presentCounts = parts[1].split(/\s+/).map(Number);

    regions.push({
      width,
      height,
      presentCounts,
    });

    i++;
  }
  return regions;
}

// Convert shape grid to list of coordinates where '#' appears
// For example converts this shape:
// ###
// ##.
// into coordinates: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:0,y:1}, {x:1,y:1}]
function gridToCoordinates(grid: string[]) {
  const coords = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (grid[y]![x] === "#") {
        coords.push({ x, y });
      }
    }
  }
  return coords;
}

// Generate all unique transformations (rotations + flips)
// Too much Math here...
function getAllTransformations(coords: Array<{ x: number; y: number }>) {
  const transformations = new Set<string>();
  const results = [];

  // with and without flip
  for (let flip = 0; flip < 2; flip++) {
    let current =
      flip === 0 ? coords : coords.map((c) => ({ x: -c.x, y: c.y }));

    // 4 rotations
    for (let rot = 0; rot < 4; rot++) {
      // Normalize to (0,0)
      const minX = Math.min(...current.map((c) => c.x));
      const minY = Math.min(...current.map((c) => c.y));
      const normalized = current.map((c) => ({ x: c.x - minX, y: c.y - minY }));

      const key = normalized
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map((c) => `${c.x},${c.y}`)
        .join("|");

      if (!transformations.has(key)) {
        transformations.add(key);
        results.push(normalized);
      }

      // Rotate 90 degrees
      current = current.map((c) => ({ x: c.y, y: -c.x }));
    }
  }
  return results;
}

async function part1() {
  const filePath = "./day-12-input.txt";
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim().split("\n\n");

  const shapes = parseShapes(lines.slice(0, -1));
  const regions = parseRegions(
    lines.slice(-1).flatMap((block) => block.split("\n"))
  );

  console.log("=== SHAPES ===");
  shapes.forEach((shape) => {
    console.log(`Shape ${shape.index}:`);
    console.log(`  Original coords:`, shape.coords);
    console.log(`  Transformations:`, shape.transformations);
  });

  console.log(`regions:`, regions);
}

part1();
