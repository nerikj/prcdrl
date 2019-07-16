import SimplexNoise from 'simplex-noise';
import Voronoi from './voronoi';

function stepStart(message) {
  postMessage({ status: 'STEP_START', message: `[map_worker] ${message}` });
}

function stepDone(message, cells) {
  postMessage({ status: 'STEP_DONE', message: `[map_worker] ${message}`, cells });
}

function generateIslandMask(width, height) {
  const mask = [];
  const originX = width / 2;
  const originY = height / 2;
  const islandWidth = Math.min(width, height) * 0.95;

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      let noise;
      const distanceFromCenter = Math.sqrt(((originX - x) ** 2) + ((originY - y) ** 2));

      if (distanceFromCenter > islandWidth / 2) {
        noise = 0.0;
      } else {
        noise = Math.max(0.0, Math.abs(1 - distanceFromCenter / (islandWidth / 2)));
      }

      mask[x] = mask[x] || [];
      mask[x][y] = noise;
    }
  }

  return mask;
}

function generateTerrain(cells, width, height, islandMask, voronoi) {
  const noise = new SimplexNoise();

  cells.forEach((cell) => {
    const x = cell.centroid[0];
    const y = cell.centroid[1];
    const intX = Math.floor(x);
    const intY = Math.floor(y);
    const noiseValue = noise.noise2D(x / (width * 0.22), y / (height * 0.22)) + 1;
    const maskValue = islandMask[intX][intY];

    const terrain = noiseValue * maskValue;

    if (terrain > 0.15) {
      cell.terrain = 'land';
    } else {
      cell.terrain = 'water';
    }
  });

  // first pass, find edges
  const oceanCells = [];

  cells.forEach((cell) => {
    let edge = false;

    for (let i = 0; i < cell.path.length && !edge; i += 1) {
      const path = cell.path[i];
      // TODO: Can edges be detected in a better way?
      if (path.x === 0 || Math.floor(path.x) >= width || path.y === 0 || Math.floor(path.y) >= height) {
        cell.terrain = 'ocean';
        oceanCells.push(cell);
        edge = true;
      }
    }
  });

  // second pass, generate ocean
  for (let i = 0; i < oceanCells.length; i += 1) {
    const cell = oceanCells[i];

    voronoi.neighborIndexes(cell).forEach((neighborIndex) => {
      const neighbor = cells[neighborIndex];
      if (neighbor.terrain === 'water') {
        neighbor.terrain = 'ocean';
        oceanCells.push(neighbor);
      }
    });
  }
}

function generate(numberOfCells, width, height) {
  stepStart('Generating Voronoi diagram');
  const voronoi = Voronoi.generate(numberOfCells, width, height);
  // TODO: Post a message and render for each relax pass?
  voronoi.relax(3);
  const cells = voronoi.cells();
  stepDone('Done generating Voronoi diagram', cells);

  stepStart('Generating island mask');
  const islandMask = generateIslandMask(width, height);

  stepStart('Generating terrain');
  generateTerrain(cells, width, height, islandMask, voronoi);

  postMessage({ status: 'DONE', cells });
}

onmessage = function (e) {
  const { numberOfCells, width, height } = e.data;
  generate(numberOfCells, width, height);
};
