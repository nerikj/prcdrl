import centroid from "./polygon";

test('centroid of square', () => {
  let points = [
    0, 0,
    2, 0,
    2, 2,
    0, 2
  ];
  const c = centroid(points);
  expect(c.x).toBe(1);
  expect(c.y).toBe(1);
});

test('centroid of triangle', () => {
  let points = [
    0, 0,
    6, 0,
    0, 4
  ];
  const c = centroid(points);
  expect(c.x).toBe(2);
  expect(c.y).toBe(1.3333333333333333);
});
