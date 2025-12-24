import { readTextFile } from './utils.ts';

function parseShapes(block: string[]) {
  const shapes = [];
  for (const shapeBlock of block) {
    const lines = shapeBlock.split('\n');
    const shapeIndex = Number(lines[0]!.split(':')[0]!);
    const shapeLines = lines.slice(1);
    
    shapes.push({
      index: shapeIndex,
      grid: shapeLines
    });
  }
  return shapes;
}

function parseRegions(lines: string[]) {
  const regions = [];
  let i = 0;
  while (i < lines.length) {
    const curLine = lines[i]!;
    const parts = curLine.split(':') as [string, string];
    const [width, height] = parts[0].split('x').map(Number);
    const presentCounts = parts[1].split(/\s+/).map(Number);
    
    regions.push({
      width,
      height,
      presentCounts
    });
    
    i++;
  }
  return regions;
}

async function part1() {
  const filePath = './day-12-input.txt';
  const fileContent = await readTextFile(filePath);
  const lines = fileContent.trim().split('\n\n');

  const shapes = parseShapes(lines.slice(0, -1));
  const regions = parseRegions(lines.slice(-1).flatMap(block => block.split('\n')));

  console.log(shapes, regions);
}

part1();
