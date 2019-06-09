class Map {
  constructor(canvas) {
    this.canvas = canvas;
    this.cells = [];
  }

  render() {
    this.canvas.clear();

    for (const cell of this.cells) {
      this.canvas.drawPolygon(cell.path, {
        fillStyle: cell.fillStyle,
        strokeStyle: "rgba(255, 0, 0, 0.5)"
      });
    }
  }
}

export default Map;
