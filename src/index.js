import Canvas from "./canvas";
import Cell from "./cell";
import Voronoi from "./voronoi";
import Map from "./map";
import get_polygon_centroid from "./polygon";

let canvas;
let map;
let voronoi;

function render() {
  map.render();
  drawDelaunay();
}

function resize() {
  canvas.resize(window.innerWidth, window.innerHeight);
  render();
}

function init() {
  const el = document.getElementById('map');
  canvas = new Canvas(el, window.innerWidth, window.innerHeight);

  voronoi = Voronoi.generate(50, canvas.width, canvas.height);

  map = new Map(canvas);
  map.cells = voronoi.cells();

  resize();
  window.addEventListener('resize', resize, false);

  // voronoi.relax(2);

  // addCursorDisplay();
}

function drawDelaunay() {
  const {
    points: points2,
    halfedges: halfedges,
    hull: hull,
    triangles: triangles
  } = voronoi.delaunay;

  // draw points
  for (let point of voronoi.points) {
    canvas.drawCircle(point[0], point[1], 3, { fillStyle: "black" });
  }

  // draw delaunay triangles
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
  let node = hull;
  const path = [{ x: node.x, y: node.y }];
  while (node = node.next, node !== hull) {
    path.push({ x: node.x, y: node.y });
  }
  canvas.drawPolygon(path, { strokeStyle: "rgba(0, 0, 0, 0.2)" });
}

function addCursorDisplay() {
  window.addEventListener("mousemove", function(event) {
    const div = document.querySelector("#cursor");
    const position = "X: " + event.clientX + " Y: " + event.clientY;
    div.innerHTML = position;
  });
}

init();
