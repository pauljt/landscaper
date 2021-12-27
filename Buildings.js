import { randomInt, randomFloat } from "./utils.js";

const windowColors = ["#dab2a8", "#d7bcab"];
let houseColor = "#fce9db";
let roofColors = ["#fbbd98", "#bd9c97", "#565b61"];

function Village(width, u = 10) {
  let numBuildings = randomInt(5, 10);
  let group = new Group();
  let x = 0,
    y = 0;

  for (let leftCorner = 0, i = 0; i < numBuildings; i++) {
    let houseSettings = { houseColor };
    houseSettings.wallWidth = randomFloat(4, 7) * 1.5 * u;
    houseSettings.wallHeight = (2 / 3) * houseSettings.wallWidth;
    houseSettings.houseColor = houseColor;
    houseSettings.roofColor = roofColors.random();
    houseSettings.windows = randomInt(0, 1);
    houseSettings.chimneys = randomInt(0, 1);
    houseSettings.u = u;
    let b = House(x + leftCorner, y, houseSettings);

    if (randomInt(0, 1)) {
      b.scale(-1, 1);
    }
    group.addChild(b);
    leftCorner = (leftCorner + houseSettings.wallWidth) % width;
  }
  group.translate([-group.bounds.right, -group.bounds.bottom]);
  return group;
}

function House(x, y, settings) {
  const { wallWidth, wallHeight, houseColor, roofColor, windows, chimneys, u } =
    settings;
  let group = new Group();
  let side = new paper.Path.Line({
    from: [x, y],
    to: [x + wallWidth, y],
    fillColor: houseColor,
  });
  side.lineBy([0, -wallHeight]);
  side.lineBy([-wallWidth, 0]);
  side.lineBy([0, wallHeight]);
  side.lineBy([-wallWidth / 2, 0]);
  side.lineBy([0, -wallHeight]);
  side.lineBy(wallWidth / 4, -wallHeight / 2);
  side.lineBy(wallWidth / 4, wallHeight / 2);
  group.addChild(side);

  let roof = new paper.Path.Line({
    from: [x, y - wallHeight],
    to: [x + wallWidth, y - wallHeight],
    fillColor: roofColor,
  });
  roof.lineBy(-wallWidth / 4, -wallHeight / 2);
  roof.lineBy(-wallWidth, 0);
  roof.closePath();
  group.addChild(roof);

  if (windows > 0) {
    let w = new Path.Rectangle({
      point: [x + u, y - wallHeight * 0.75],
      size: [u, u],
      fillColor: windowColors.random(),
      strokeColor: null,
    });
    group.addChild(w);
  }
  return group;
}

function ManorHouse(u = 10) {
  let houseColor = "#fce9db";
  let roofColor = "#3689bc";
  let x = 0,
    y = 0;

  let h = u * 10;
  let w = h * 2;

  let group = new Group();

  let facade = new Path.Rectangle({
    point: [x, y],
    size: [w, h],
    fillColor: houseColor,
  });

  group.addChild(facade);

  let roofHeight = h / 2.5;
  let roof = new Path.Rectangle({
    point: [x, y],
    size: [w, -roofHeight],
    fillColor: roofColor,
  });
  roof.segments[0].point.x -= w / 4;
  roof.segments[3].point.x -= w / 4;
  group.addChild(roof);

  let chimney = new paper.Path.Line({
    from: [x, y - roofHeight - u],
    to: [x + u, y - roofHeight - u],
    fillColor: roofColor,
  });
  chimney.lineBy([0, 2 * u]);
  chimney.lineBy([-u, 0]);
  chimney.lineBy([-u, -u]);
  chimney.lineBy([0, -u]);
  chimney.lineBy([u, 0]);
  chimney.lineBy([0, +2 * u]);
  group.addChild(chimney);

  for (let i = 0; i < 4; i++) {
    chimney.clone();
    chimney.translate(u * 3, 0);
    group.addChild(chimney);
  }

  let side = new paper.Path.Line({
    from: [x, y],
    to: [x, y + h],
    fillColor: houseColor,
  });

  side.lineBy([-w / 2, 0]);
  side.lineBy([0, -h]);
  side.lineBy([w / 4, -h / 2.5]);
  side.closePath();
  group.addChild(side);

  //create window
  let windowWidth = h / 5;
  let windowHeight = (2 * h) / 6;
  let window = new Path.Rectangle({
    point: [x, y],
    size: [windowWidth, windowHeight],
    fillColor: "#fffdf5",
    strokeColor: null,
  });
  group.addChild(window);
  let windowPane = window.clone();
  windowPane.fillColor = "#cfdde6";
  windowPane.scale(0.8);
  let windowGroup = new Group([window, windowPane]);

  //clone windows
  let windowRows = 2;
  let windowCols = 6;
  let windows = new Group();
  for (let i = 0; i < windowCols; i++) {
    for (let j = 0; j < windowRows; j++) {
      let newWindow = windowGroup.clone();
      newWindow.translate(i * windowWidth * 1.5, j * windowHeight * 1.2);
      windows.addChild(newWindow);
    }
  }

  windowGroup.remove(); //remove original window
  windows.translate(windowWidth / 1.5, windowHeight / 2);
  group.addChild(windows);
  group.translate([-group.bounds.right, -group.bounds.bottom]);
  return group;
}

export { Village, ManorHouse };
