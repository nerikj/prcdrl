import Canvas from "./canvas";
import Cell from "./cell";
import Voronoi from "./voronoi";
import Map from "./map";

let canvas;
let map;
let voronoi;

function addCursorDisplay() {
  window.addEventListener("mousemove", function(event) {
    const div = document.querySelector("#cursor");
    const position = "X: " + event.clientX + " Y: " + event.clientY;
    div.innerHTML = position;
  });
}

function drawDelaunay() {
  for (let point of map.voronoi.points) {
    canvas.drawCircle(point[0], point[1], 3, { fillStyle: "black" });
  }

  for (let polygon of map.voronoi.delaunayPolygons()) {
    canvas.drawPolygon(polygon, { strokeStyle: "rgba(0, 0, 0, 0.2)" });
  }

  canvas.drawPolygon(map.voronoi.hullPolygon(), { strokeStyle: "rgba(0, 0, 0, 0.2)" });
}

function init() {
  const el = document.getElementById('map');
  canvas = new Canvas(el, window.innerWidth, window.innerHeight);

  map = Map.generate(200, canvas.width, canvas.height);

  render();

  window.addEventListener('resize', resize, false);
  // addCursorDisplay();
}

function render() {
  map.render(canvas);
  drawDelaunay();
}

function resize() {
  canvas.resize(window.innerWidth, window.innerHeight);
  render();
}

init();
