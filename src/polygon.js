function chunkArray(array) {
  var chunks = [],
      i = 0,
      n = array.length;

  while (i < n) {
    chunks.push(array.slice(i, i += 2));
  }

  return chunks;
}

// Adapted from https://stackoverflow.com/a/43747218
// points is an array of integers with format [x1, y1, x2, y2, x3, y3, ...]
function centroid(points) {
  points = chunkArray(points);

  var first = points[0], last = points[points.length-1];
  if (first[0] != last[0] || first[1] != last[1]) points.push(first);
  var twicearea=0,
      x=0, y=0,
      nPts = points.length,
      p1, p2, f;
  for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
    p1 = points[i]; p2 = points[j];
    f = (p1[1] - first[1]) * (p2[0] - first[0]) - (p2[1] - first[1]) * (p1[0] - first[0]);
    twicearea += f;
    x += (p1[0] + p2[0] - 2 * first[0]) * f;
    y += (p1[1] + p2[1] - 2 * first[1]) * f;
  }
  f = twicearea * 3;
  return { x:x/f + first[0], y:y/f + first[1] };
}

export default centroid;
