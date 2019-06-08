import { Delaunay } from "d3-delaunay";
import Canvas from "./canvas";
import get_polygon_centroid from "./polygon";

let canvas;

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
        // console.log("added x", cellPolygon[i][0], "total", x);
        // console.log("added y", cellPolygon[i][1], "total", y);
      }
      x = x / (cellPolygon.length);
      y = y / (cellPolygon.length);
      // console.log("R", x, y);
      // ctx.beginPath();
      // ctx.arc(x, y, 3, 0, 2 * Math.PI);
      // ctx.fillStyle = 'red';
      // ctx.fill();
      // break;
      p2.push([x, y]);
    }
    assignPoints(p2);
    render();
  }
};

function render() {
  canvas.clear();

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
      [points2[ti * 2], points2[ti * 2 + 1]],
      [points2[tj * 2], points2[tj * 2 + 1]]
    ];
    canvas.drawPath(path, { strokeStyle: "#ccccff" });
  }

  // draw hull
  const {hull} = delaunay;
  let node = hull;
  const path = [[node.x, node.y]];
  while (node = node.next, node !== hull) {
    path.push([node.x, node.y]);
  }
  canvas.drawPath(path, { strokeStyle: "#99bb99" });

  // draw voronoi cells
  for (let cellPolygon of voronoi.cellPolygons()) {
    let from;
    for (let i = 0; i < cellPolygon.length; i++) {
      const to = cellPolygon[i];
      if (from) {
        const path = [
          [from[0], from[1]],
          [to[0], to[1]]
        ];
        canvas.drawPath(path, { strokeStyle: "#ff5555" });
      }
      from = to;
    }
  }
}

function resize() {
  canvas.resize(window.innerWidth, window.innerHeight);
  render();
}

function init() {
  const cnvs = document.getElementById('map');

  canvas = new Canvas(cnvs, window.innerWidth, window.innerHeight);
  points = generatePoints(500);
  assignPoints(points);
  resize();
  window.addEventListener('resize', resize, false);

  // relax(2);
}

init();
