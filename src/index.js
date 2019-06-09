import { Delaunay } from "d3-delaunay";
import Canvas from "./canvas";
import Cell from "./cell";
import Map from "./map";
import get_polygon_centroid from "./polygon";

let canvas;
let map;

let points = [];
let delaunay;
let voronoi;

function assignPoints(pnts) {
  points = pnts;
  delaunay = Delaunay.from(pnts);
  voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);
}

function generatePoints(count) {
  points = [];
  for(let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * canvas.width) + 1;
    const y = Math.floor(Math.random() * canvas.height) + 1;
    points.push([x, y]);
  }
  return points;
}

window.relax = function(steps = 1) {
  for(let j = 0; j < steps; j++) {
    let p2 = [];
    for (let cellPolygon of voronoi.cellPolygons()) {
      let x = 0;
      let y = 0;
      for (var i = 0; i < cellPolygon.length; i++) {
        x += cellPolygon[i][0];
        y += cellPolygon[i][1];
      }
      x = x / (cellPolygon.length);
      y = y / (cellPolygon.length);
      p2.push([x, y]);
    }
    assignPoints(p2);
    render();
  }
};

function render() {
  map.render();

  // draw points
  for (let point of points) {
    canvas.drawCircle(point[0], point[1], 3, { fillStyle: "black" });
  }

  // draw delaunay triangles
  const { points: points2, halfedges: halfedges, triangles: triangles } = delaunay;
  for (let i = 0, n = halfedges.length; i < n; ++i) {
    const j = halfedges[i];
    if (j < i) continue;
    const ti = triangles[i];
    const tj = triangles[j];
    const path = [
      { x: points2[ti * 2], y: points2[ti * 2 + 1] },
      { x: points2[tj * 2], y: points2[tj * 2 + 1] }
    ];
    canvas.drawPolygon(path, { strokeStyle: "rgba(0, 0, 0, 0.2)" });
  }

  // draw hull
  const {hull} = delaunay;
  let node = hull;
  const path = [{ x: node.x, y: node.y }];
  while (node = node.next, node !== hull) {
    path.push({ x: node.x, y: node.y });
  }
  canvas.drawPolygon(path, { strokeStyle: "rgba(0, 0, 0, 0.2)" });
}

function resize() {
  canvas.resize(window.innerWidth, window.innerHeight);
  render();
}

function init() {
  const el = document.getElementById('map');

  canvas = new Canvas(el, window.innerWidth, window.innerHeight);
  points = generatePoints(500);
  assignPoints(points);

  map = new Map(canvas);
  const cells = [];
  for (const cellPolygon of voronoi.cellPolygons()) {
    const path = [];

    for (let i = 0; i < cellPolygon.length; i++) {
      path.push({ x: cellPolygon[i][0], y: cellPolygon[i][1] });
    }

    cells.push(new Cell(path));
  }
  map.cells = cells;

  resize();
  window.addEventListener('resize', resize, false);

  // relax(2);

  window.addEventListener("mousemove", function(event) {
    const div = document.querySelector("#cursor");
    const position = "X: " + event.clientX + " Y: " + event.clientY;
    div.innerHTML = position;
  });
}

init();
