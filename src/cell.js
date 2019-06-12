class Cell {
  constructor(centroid, path) {
    this.centroid = centroid;
    this.path = path;

    // TODO: change from random style to something else
    const i = Math.random();
    if (i >= 0.5) {
      this.fillStyle = "rgba(10, 10, 250, 0.4)";
    } else {
      this.fillStyle = "rgba(100, 255, 150, 0.4)";
    }
  }
}

export default Cell;
