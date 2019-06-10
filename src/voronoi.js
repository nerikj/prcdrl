import Cell from "./cell";
import { Delaunay } from "d3-delaunay";

class Voronoi {
  static generate(number_of_points, width, height) {
    const points = [];

    for(let i = 0; i < number_of_points; i++) {
      const x = Math.floor(Math.random() * width) + 1;
      const y = Math.floor(Math.random() * height) + 1;
      points.push([x, y]);
    }

    const v = new Voronoi();
    v.points = points;
    v.delaunay = Delaunay.from(points);
    v.voronoi = v.delaunay.voronoi([0, 0, width, height]);
    return v;
  }

  cells() {
    const cells = [];

    for (const cellPolygon of this.voronoi.cellPolygons()) {
      const path = [];

      for (let i = 0; i < cellPolygon.length; i++) {
        path.push({ x: cellPolygon[i][0], y: cellPolygon[i][1] });
      }

      cells.push(new Cell(path));
    }

    return cells;
  }

  relax(steps = 1) {
    for(let j = 0; j < steps; j++) {
      const points = [];

      for (let cellPolygon of this.voronoi.cellPolygons()) {
        let x = 0;
        let y = 0;
        for (var i = 0; i < cellPolygon.length; i++) {
          x += cellPolygon[i][0];
          y += cellPolygon[i][1];
        }
        x = x / (cellPolygon.length);
        y = y / (cellPolygon.length);
        points.push([x, y]);
      }

      this.points = points;
    }
  }
}

export default Voronoi;
