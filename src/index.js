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
  for (let point of voronoi.points) {
    canvas.drawCircle(point[0], point[1], 3, { fillStyle: "black" });
  }

  for (let polygon of voronoi.delaunayPolygons()) {
    canvas.drawPolygon(polygon, { strokeStyle: "rgba(0, 0, 0, 0.2)" });
  }

  canvas.drawPolygon(voronoi.hullPolygon(), { strokeStyle: "rgba(0, 0, 0, 0.2)" });
}

function addCursorDisplay() {
  window.addEventListener("mousemove", function(event) {
    const div = document.querySelector("#cursor");
    const position = "X: " + event.clientX + " Y: " + event.clientY;
    div.innerHTML = position;
  });
}

init();
