import Canvas from './canvas';
import Map from './map';

let canvas;
let debug = false;
let map;

function addCursorDisplay() {
  window.addEventListener('mousemove', (event) => {
    const div = document.querySelector('#cursor');
    const position = `X: ${event.clientX} Y: ${event.clientY}`;
    div.innerHTML = position;
  });
}

function drawDelaunay() {
  map.voronoi.points.forEach((point) => {
    canvas.drawCircle(point[0], point[1], 3, { fillStyle: 'black' });
  });

  map.voronoi.delaunayPolygons().forEach((polygon) => {
    canvas.drawPolygon(polygon, { strokeStyle: 'rgba(0, 0, 0, 0.2)' });
  });

  canvas.drawPolygon(map.voronoi.hullPolygon(), { strokeStyle: 'rgba(0, 0, 0, 0.2)' });
}

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  debug = params.get('debug') === 'true';
}

function render() {
  map.render(canvas);
  if (debug) {
    drawDelaunay();
  }
}

function resize() {
  canvas.resize(window.innerWidth, window.innerHeight);
  render();
}

function init() {
  parseParams();

  const el = document.getElementById('map');
  canvas = new Canvas(el, window.innerWidth, window.innerHeight);

  map = Map.generate(200, canvas.width, canvas.height);

  render();

  window.addEventListener('resize', resize, false);

  if (debug) {
    addCursorDisplay();
  }
}

init();
