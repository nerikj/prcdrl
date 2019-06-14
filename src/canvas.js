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

  drawPixel(x, y, options) {
    const { fillStyle = '#000000' } = options;
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x, y, 1, 1);
  }

  drawPolygon(path, options) {
    const { fillStyle, strokeStyle = "#000000" } = options;

    this.ctx.beginPath();
    for (const point of path) {
      this.ctx.lineTo(point.x, point.y);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill();
    }
  }

  drawText(text, x, y) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px sans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }
}

export default Canvas;
