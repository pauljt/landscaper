import { randomFloat, splitPath } from "./utils.js";
function Water(rect) {
  let left = new Segment({
    point: rect.topLeft,
    handleOut: [5, -5],
  });

  let right = new Segment({
    point: rect.topRight,
    handleIn: [5, -5],
  });

  let shore = new Path(left, right);

  splitPath(shore, 20);

  for (const segment of shore.segments) {
    segment.point.y += randomFloat(-1, 1);
  }

  shore.lineTo(rect.bottomRight);
  shore.lineTo(rect.bottomLeft);
  //shore.closePath();

  shore.fillColor = "#6699CC";
  shore.name = "Water";
  shore.data.z = rect.top;

  return shore;
}

export { Water };
