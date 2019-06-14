import Cell from "./cell";
import { Delaunay } from "d3-delaunay";

class Voronoi {
  static generate(numberOfPoints, width, height) {
    const points = [];

    for(let i = 0; i < numberOfPoints; i++) {
      const x = Math.floor(Math.random() * width) + 1;
      const y = Math.floor(Math.random() * height) + 1;
      points.push([x, y]);
    }

    const v = new Voronoi();
    v.width = width;
    v.height = height;
    v.points = points;
    return v;
  }

  get points() {
    return this._points;
  }

  set points(points) {
    this._points = points;
    this.delaunay = Delaunay.from(points);
    this.voronoi = this.delaunay.voronoi([0, 0, this.width, this.height]);
  }

  cells() {
    const cells = [];

    this.points.forEach((point) => {
      const index = this.delaunay.find(point[0], point[1]);
      const cellPolygon = this.voronoi.cellPolygon(index);

      const path = [];

      for (let i = 0; i < cellPolygon.length; i += 1) {
        path.push({ x: cellPolygon[i][0], y: cellPolygon[i][1] });
      }

      cells.push(new Cell(point, path));
    });

    return cells;
  }

  delaunayPolygons() {
    const { points, halfedges, hull, triangles} = this.delaunay;
    const polygons = [];

    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j = halfedges[i];
      if (j < i) continue;
      const ti = triangles[i];
      const tj = triangles[j];
      const polygon = [
        { x: points[ti * 2], y: points[ti * 2 + 1] },
        { x: points[tj * 2], y: points[tj * 2 + 1] }
      ];
      polygons.push(polygon);
    }
    return polygons;
  }

  hullPolygon() {
    let node = this.delaunay.hull;
    const polygon = [{ x: node.x, y: node.y }];
    while (node = node.next, node !== this.delaunay.hull) {
      polygon.push({ x: node.x, y: node.y });
    }
    return polygon;
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
