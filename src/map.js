import Voronoi from './voronoi';

class Map {
  constructor() {
    this.cells = [];
  }

  static generate(numberOfCells, width, height) {
    const map = new Map();
    map.voronoi = Voronoi.generate(numberOfCells, width, height);
    map.voronoi.relax(3);
    map.cells = map.voronoi.cells();
    return map;
  }

  render(canvas) {
    canvas.clear();

    this.cells.forEach((cell) => {
      canvas.drawPolygon(cell.path, {
        fillStyle: cell.fillStyle,
        strokeStyle: 'rgba(255, 0, 0, 0.5)',
      });
    });
  }
}

export default Map;
