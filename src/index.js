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

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  debug = params.get('debug') === 'true';
}

function render() {
  map.render(canvas);
  if (debug) {
    map.renderDelaunay(canvas);
  }
}

function init() {
  parseParams();

  const el = document.getElementById('map');
  canvas = new Canvas(el, window.innerWidth, window.innerHeight);

  map = Map.generate(200, canvas.width, canvas.height);

  render();

  if (debug) {
    addCursorDisplay();
  }
}

init();
