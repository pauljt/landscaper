function randomFloat(min, max = -min) {
  return Math.random() * (max - min) + min;
}
function randomInt(min, max = -min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

Array.prototype.random = function () {
  return this[randomInt(0, this.length - 1)];
};

function lerp(v0, v1, t) {
  return v0 + t * (v1 - v0);
}

function splitPath(path, numCurves, rand = 0) {
  let curveLength = path.length / numCurves;

  let maxLen = path.length;
  for (
    let pathOffset = curveLength;
    pathOffset < maxLen;
    pathOffset += curveLength
  ) {
    let warp = 1;
    if (rand) {
      warp = randomFloat(1.0 - rand, 1.0 + rand);
    }

    path.lastCurve.divideAt(curveLength * warp);
  }
}

function bendHandles(
  path,
  angle = { min: 0, max: 0 },
  scale = { min: 1, max: 1 }
) {
  for (const segment of path.segments) {
    segment.handleIn.angle += randomFloat(angle.min, angle.max);
    segment.handleOut.angle -= randomFloat(angle.min, angle.max);
    segment.handleIn.length *= randomFloat(scale.min, scale.max);
    segment.handleOut.length *= randomFloat(scale.min, scale.max);
  }
}

function displaceSegments(path, dx, dy) {
  for (const segment of path.segments) {
    segment.point.x += randomFloat(dx);
    segment.point.y -= randomFloat(dy);
  }
}

export {
  randomFloat,
  randomInt,
  lerp,
  splitPath,
  bendHandles,
  displaceSegments,
};
