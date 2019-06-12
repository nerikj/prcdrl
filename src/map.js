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

  generateNoise() {
    this.noise = new SimplexNoise('seed');
  }

  render(canvas) {
    canvas.clear();

    // for (let i = 0; i < 100; i += 1) {
    //   for (let j = 0; j < 100; j += 1) {
    //     const value = this.noise.noise2D(i, j);
    //     const color = 255 * value;
    //     const fillStyle = `rgb(${color}, ${color}, ${color}, 0.5)`;
    //     console.log('FILLSTYLE', fillStyle);
    //     canvas.drawCircle(i, j, 1, { fillStyle });
    //   }
    // }

    this.cells.forEach((cell) => {
      const x = cell.centroid[0];
      const y = cell.centroid[1];
      const value = this.noise.noise2D(x, y);
      let fillStyle;
      if (value >= 0.1) {
        fillStyle = 'rgba(50, 200, 50, 0.7)';
      } else {
        fillStyle = 'rgba(10, 10, 250, 0.7)';
      }

      canvas.drawPolygon(cell.path, {
        fillStyle,
        strokeStyle: 'rgba(255, 0, 0, 0.5)',
      });
    });
  }
}

export default Map;
