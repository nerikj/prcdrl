class Map {
  constructor(cells) {
    this.cells = cells;
  }

  renderDelaunay(canvas) {
    this.voronoi.points.forEach((point) => {
      canvas.drawCircle(point[0], point[1], 3, { fillStyle: 'black' });
    });

    this.voronoi.delaunayPolygons().forEach((polygon) => {
      canvas.drawPolygon(polygon, { strokeStyle: 'rgba(0, 0, 0, 0.2)' });
    });

    canvas.drawPolygon(this.voronoi.hullPolygon(), { strokeStyle: 'rgba(0, 0, 0, 0.2)' });
  }

  renderIslandMask(canvas) {
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const noise = this.islandShape[x][y];
        const color = Math.floor(noise * 255);
        const fillStyle = `rgb(${color}, ${color}, ${color})`;
        canvas.drawPixel(x, y, { fillStyle });
      }
    }
  }

  render(canvas) {
    canvas.clear();

    this.cells.forEach((cell) => {
      let fillStyle;

      switch (cell.terrain) {
        case 'water':
          fillStyle = 'rgb(30, 30, 210)';
          break;
        case 'land':
          fillStyle = 'rgb(80, 180, 80)';
          break;
        case 'ocean':
          fillStyle = 'rgb(0, 0, 190)';
          break;
        default:
          fillStyle = 'rgb(255, 255, 255)';
          break;
      }

      canvas.drawPolygon(cell.path, {
        fillStyle,
        strokeStyle: 'rgb(100, 100, 100)',
      });
      // canvas.drawText(cell.terrain[0], cell.centroid[0], cell.centroid[1]);
    });

    // this.renderIslandMask(canvas);

    // for (let i = 0; i < 100; i += 1) {
    //   for (let j = 0; j < 100; j += 1) {
    //     const value = this.noise.noise2D(i/10, j/10);
    //     const color = Math.floor((value + 1) * 128);
    //     const fillStyle = `rgb(${color}, ${color}, ${color})`;
    //     // console.log('FILLSTYLE', fillStyle);
    //     canvas.drawPixel(i, j, { fillStyle });
    //   }
    // }
  }
}

export default Map;
