import { readTextFile } from './utils.ts';

function distance(p1: number[], p2: number[]): number {
  const dx = p1[0]! - p2[0]!;
  const dy = p1[1]! - p2[1]!;
  const dz = p1[2]! - p2[2]!;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

class UnionFind {
  parent: number[];
  size: number[];
  // Used in part2 to track they're all in one large circuit.
  numComponents: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
    this.numComponents = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]!);
    }
    return this.parent[x];
  }

  union(x: number, y: number) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return; // Already in same circuit
    }

    // Union by size
    if (this.size[rootX]! < this.size[rootY]!) {
      this.parent[rootX] = rootY;
      this.size[rootY]! += this.size[rootX]!;
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX]! += this.size[rootY]!;
    }

    this.numComponents--;
  }

  getCircuitSizes(): number[] {
    const circuits = new Map<number, number>();
    
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      circuits.set(root, this.size[root]!);
    }

    return Array.from(circuits.values());
  }
}

function initEdges(positions: number[][]) {
  const n = positions.length;
  const edges: { i: number; j: number; dist: number }[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist = distance(positions[i]!, positions[j]!);
      edges.push({ i, j, dist });
    }
  }
  edges.sort((a, b) => a.dist - b.dist);
  return edges;
}

async function part1() {
  const filePath = './day-8-input.txt';
  const fileContent = await readTextFile(filePath);
  const positions = fileContent.split('\n').map(line => line.split(',').map(Number));

  const n = positions.length;
  const edges = initEdges(positions);

  // Use Union-Find to make the 1000 shortest connections
  const uf = new UnionFind(n);
  let connections = 0;
  const maxConnections = 1000;

  for (const edge of edges) {
    if (connections >= maxConnections) {
      break;
    }

    uf.union(edge.i, edge.j);
    connections++;
  }

  const circuitSizes = uf.getCircuitSizes();
  circuitSizes.sort((a, b) => b - a);

  const result = circuitSizes[0]! * circuitSizes[1]! * circuitSizes[2]!;
  console.log('Multiply together the sizes of the three largest circuits:', result);
}

async function part2() {
  const filePath = './day-8-input.txt';
  const fileContent = await readTextFile(filePath);
  const positions = fileContent.split('\n').map(line => line.split(',').map(Number));
  
  const n = positions.length;
  const edges = initEdges(positions);

  const uf = new UnionFind(n);
  let lastConnection: { i: number; j: number } = { i: -1, j: -1 };

  // Keep connecting until we have only 1 component
  for (const edge of edges) {
    if (uf.numComponents === 1) {
      break;
    }

    uf.union(edge.i, edge.j);
    lastConnection = { i: edge.i, j: edge.j };
  }

  // lastConnection should exist since there must be a answer.
  const x1 = positions[lastConnection.i]![0]!;
  const x2 = positions[lastConnection.j]![0]!;
  const result = x1 * x2;

  console.log('Product of the x-coordinates of the last connection:', result);
}

part1();
part2();
