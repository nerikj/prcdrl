import Canvas from './canvas';
import Map from './map';

let canvas;
let debug = false;
const map = new Map([]);

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
  map.render(canvas, debug);
  // TODO: Need to find a way to represent this as paths that can be
  // sent from the worker
  // if (debug) {
  //   map.renderDelaunay(canvas);
  // }
}

function init() {
  parseParams();

  const el = document.getElementById('map');
  canvas = new Canvas(el, window.innerWidth, window.innerHeight);

  const mapWorker = new Worker('map_worker.js');
  mapWorker.postMessage({
    numberOfCells: 5000,
    width: canvas.width,
    height: canvas.height,
  });

  mapWorker.onmessage = (e) => {
    switch (e.data.status) {
      case 'STEP_START':
        console.log(e.data.message);
        break;
      case 'STEP_DONE':
        console.log(e.data.message);
        // map.cells = e.data.cells;
        // render();
        break;
      case 'DONE':
        map.cells = e.data.cells;
        render();
        break;
      default:
        console.log(e.data.message);
        break;
    }
  };

  if (debug) {
    addCursorDisplay();
  }
}

init();
