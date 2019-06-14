import SimplexNoise from 'simplex-noise';
import Voronoi from './voronoi';

class Map {
  constructor() {
    this.cells = [];
  }

  static generate(numberOfCells, width, height) {
    const map = new Map();
    map.width = width;
    map.height = height;

    map.voronoi = Voronoi.generate(numberOfCells, width, height);
    map.voronoi.relax(3);
    map.cells = map.voronoi.cells();

    map.generateNoise();

    return map;
  }

  generateIslandMask() {
    const shape = [];
    const originX = this.width / 2;
    const originY = this.height / 2;
    const islandWidth = Math.min(this.width, this.height) * 0.95;

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        let noise;
        const distanceFromCenter = Math.sqrt(((originX - x) ** 2) + ((originY - y) ** 2));

        if (distanceFromCenter > islandWidth / 2) {
          noise = 0.0;
        } else {
          noise = Math.max(0.0, Math.abs(1 - distanceFromCenter / (islandWidth / 2)));
        }

        shape[x] = shape[x] || [];
        shape[x][y] = noise;
      }
    }

    this.islandShape = shape;
  }

  generateNoise() {
    this.generateIslandMask();
    this.generateTerrain();
  }

  generateTerrain() {
    // const noise = new SimplexNoise('seed');
    const noise = new SimplexNoise();

    this.cells.forEach((cell) => {
      const x = cell.centroid[0];
      const y = cell.centroid[1];
      const intX = Math.floor(x);
      const intY = Math.floor(y);
      const noiseValue = noise.noise2D(x / (this.width * 0.22), y / (this.height * 0.22)) + 1;
      const maskValue = this.islandShape[intX][intY];

      const terrain = noiseValue * maskValue;
      // if (intX > this.width * 0.25 && this.width * 0.75 && intY > this.height * 0.25 && intY < this.height * 0.75) {
      //   console.log(intX, intY, noiseValue, maskValue, terrain);
      // }

      if (terrain > 0.15) {
        cell.terrain = 'land';
      } else {
        cell.terrain = 'water';
      }
    });
  }

  renderIslandMask(canvas) {
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const noise = this.islandShape[x][y];
        const color = Math.floor(noise * 255);
        const fillStyle = `rgb(${color}, ${color}, ${color})`;
        canvas.drawPixel(x, y, { fillStyle });
      }
    }
  }

  render(canvas) {
    canvas.clear();

    this.cells.forEach((cell) => {
      let fillStyle;

      switch (cell.terrain) {
        case 'water':
          fillStyle = 'rgb(30, 30, 210)';
          break;
        case 'land':
          fillStyle = 'rgb(80, 180, 80)';
          break;
        default:
          fillStyle = 'rgb(255, 255, 255)';
          break;
      }

      canvas.drawPolygon(cell.path, {
        fillStyle,
        strokeStyle: 'rgb(100, 100, 100)',
      });
      canvas.drawText(cell.terrain[0], cell.centroid[0], cell.centroid[1]);
    });

    // this.renderIslandMask(canvas);

    // for (let i = 0; i < 100; i += 1) {
    //   for (let j = 0; j < 100; j += 1) {
    //     const value = this.noise.noise2D(i/10, j/10);
    //     const color = Math.floor((value + 1) * 128);
    //     const fillStyle = `rgb(${color}, ${color}, ${color})`;
    //     // console.log('FILLSTYLE', fillStyle);
    //     canvas.drawPixel(i, j, { fillStyle });
    //   }
    // }
  }
}

export default Map;
