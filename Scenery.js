const bushColors = ["#3a816f", "#458876", "#5ba487", "#81c59e"];
const grassColor = "#aacdac";

import { randomInt, randomFloat, splitPath } from "./utils.js";

function Field(u) {
  let x = 0,
    y = 0;

  //start with a curve
  let width = randomFloat(50, 100) * u;
  let path = new Path();
  path.add(x, y);
  path.curveBy([width / 2, -2 * u], [width, 0]);
  path.fillColor = grassColor;

  // add points across the length of the curve
  splitPath(path, randomInt(2, 7), 0.3);

  //bend the handles of each segment to make the field
  for (const segment of path.segments) {
    if (segment.index < path.segments.length) {
      segment.handleIn.angle += randomInt(2, 5);
      segment.handleOut.angle -= randomInt(0, 5);
    }
  }
  path.closePath();
  return path;
}

function Bush(u) {
  let x = 0,
    y = 0;
  //start with a curve
  let width = randomFloat(10, 20) * u;
  let path = new Path();
  path.add(x, y);
  path.curveBy([width / 2, -2.5 * u], [width, 0]);
  path.fillColor = bushColors.random();

  // add points across the length of the curve
  splitPath(path, randomInt(4, 6), 0.3);

  //bend the handles of each segment to make the bush
  for (const segment of path.segments) {
    if (segment.index < path.segments.length) {
      segment.handleIn.angle += randomInt(40, 70);
      segment.handleOut.angle -= randomInt(50, 70);
    }
  }
  path.closePath();
  return path;
}

export { Bush, Field };
