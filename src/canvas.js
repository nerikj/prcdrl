class Canvas {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawCircle(x, y, radius, options) {
    const { fillStyle = "#000000" } = options;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
  }

  // path will close itself so last point isn't needed
  drawPolygon(path, options) {
    const { fillStyle, strokeStyle = "#000000" } = options;

    this.ctx.beginPath();
    for (let point of path) {
      this.ctx.lineTo(point[0], point[1]);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill();
    }
  }
}

export default Canvas;
