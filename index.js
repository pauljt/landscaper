//const paper = require("./paper-full");

paper.install(window);

//make Math.random() predictable
Math.seedrandom("113235353227");
const animate = false;

const kHeight = 600;
const kWidth = 1200;
let kCenter = kHeight / 2;
let kStageTop = kCenter + 50;
let kStageHeight = 50;
let highTide = kStageHeight + kStageTop;
let wave = 10;

const kUnit = kHeight / 60;

const kPenStroke = "#333333";

const windowColors = ["#dab2a8", "#d7bcab"];
const treeColors = ["#7dc1b4", "#4e977a", "#3d7c71", "#93d0a7"];
const bushColors = ["#3a816f", "#458876", "#5ba487", "#81c59e"];
const grassColor = "#aacdac";
const hillColor = "#72c897";
let houseColor = "#fce9db";
let roofColors = ["#fbbd98", "#bd9c97", "#565b61"];

function init() {
  var canvas = document.getElementById("myCanvas");
  canvas.width = kWidth;
  canvas.height = kHeight;
  paper.setup(canvas);
  project.currentStyle = {
    strokeColor: kPenStroke,
    strokeWidth: 1.3,
    selected: true,
  };
  project.currentStyle.strokeColor.lightness = 0.3;
  drawScene();
  let textureCount = 1;
  paper.view.onFrame = function () {
    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (var i = 0; i < project.activeLayer.children.length; i++) {
      var item = project.activeLayer.children[i];

      // Move the item 1/20th of its width to the right. This way
      // larger circles move faster than smaller circles:

      // If the item has left the view on the right, move it back
      // to the left:

      const background = new Set(["Sky", "Hills"]);
      if (background.has(item.name)) {
        ///background doesn't need to move
        //TODO: make the texture move (and wrap)
      } else if (item.name == "Water") {
        if (item.bounds.left >= 0) {
          item.insert(0, new Point(-60, highTide + randomFloat(1.5)));
        }
        item.position.x += item.z / kStageHeight / 2;

        item.segments[item.segments.length - 1].point.x = 0;
      } else {
        item.position.x += item.z / kStageHeight + 1;

        if (item.name == "Texture") {
          if (item.bounds.left > 0 && textureCount <= 1) {
            console.log("copy");
            let clone = item.clone();
            clone.scale(-1, 1);
            clone.position.x = -item.bounds.width / 1.968;
            clone.name = "Texture";
            textureCount++;
          } else if (item.bounds.left > view.size.width) {
            item.remove();
            textureCount++;
          }
        } else if (item.bounds.left > view.size.width) {
          if (item.name == "ManorHouse" || item.name == "ManorHouse") {
            item.position.x = -item.bounds.width - randomInt(400, 8000);
          } else {
            item.position.x = -item.bounds.width;
          }
        }
      }
    }
  };

  paper.view.draw();
}

function drawScene() {
  let toggle = {
    trees: 1,
    sky: 1,
    hills: 1,
    bush: 1,
    village: 1,
    manorHouse: 1,
    water: 1,
    field: 1,
    texture: 1,
  };

  let sceneObjects = [];
  let randomZ = (margin = 0) => randomInt(0, kStageHeight - margin);

  if (toggle.sky) sky();
  if (toggle.hills) hills();
  if (toggle.trees) {
    for (let x = 0; x <= kWidth; x += 15) {
      let obj = new Tree(x, randomZ(15));
      x += randomFloat(0, obj.width / 2);
      sceneObjects.push(obj);
    }
  }
  if (toggle.bush) {
    for (let x = -kWidth / 2; x <= kWidth; x += 15) {
      let pick = randomInt(0, 100);
      let obj = new Bush(x, randomZ());
      x += randomFloat(0, obj.width);
      sceneObjects.push(obj);
    }
  }
  if (toggle.field) {
    for (let x = -kWidth / 2; x <= kWidth; x += 15) {
      let pick = randomInt(0, 100);
      let obj = new Field(x, randomZ());
      x += randomFloat(0, obj.width / 2);
      sceneObjects.push(obj);
    }
  }
  if (toggle.village) {
    let village = new Village(700, randomZ(15));
    sceneObjects.push(village);
  }
  if (toggle.manorHouse) {
    let manorHouse = new ManorHouse(400, randomZ(15));
    sceneObjects.push(manorHouse);
  }

  //order objects by their z position, and fix overlay order
  sceneObjects.sort((a, b) => a.z - b.z);
  sceneObjects.forEach((obj) => {
    obj.item.bringToFront();
  });

  if (toggle.water) water();

  if (toggle.texture) {
    let raster = new Raster(view.center);
    raster.source = "./texture.png";
    raster.name = "Texture";
    raster.opacity = 0.3;
    raster.onLoad = () => {
      //raster.fitBounds(view.size);
    };
  }
}

function sky() {
  let path = new Path.Rectangle({
    point: [0, 0],
    size: [kWidth * 3, kStageTop],
    fillColor: "#93b9e6",
    fillColor: {
      gradient: {
        stops: [
          "#93b9e6",
          "#93b9e6",
          "#93b9e6",
          "#93b9e6",
          "#93b9e6",
          "#93b9e6",
          "#d0abdf",
          "#eca6dc",
        ],
      },
      origin: [0, 0],
      destination: [0, kStageTop - kStageHeight],
    },
  });
  path.name = "Sky";
}

function hills() {
  let path = new Path.Rectangle({
    point: [0, kStageTop],
    size: [kWidth, kStageHeight + 10],
    fillColor: hillColor,
  });
  path.name = "Hills";
}

function water() {
  let left = new Segment({
    point: [0, highTide + randomInt(wave)],
    handleOut: [20, -20],
  });

  let right = new Segment({
    point: [kWidth, highTide + randomInt(wave)],
    handleIn: [20, -20],
  });

  let shore = new Path(left, right);

  splitPath(shore, 20);

  for (const segment of shore.segments) {
    segment.point.y += randomFloat(-1, 1);
  }

  shore.lineTo(kWidth, kHeight);
  shore.lineTo(0, kHeight);
  //shore.closePath();

  shore.fillColor = "#6699CC";
  shore.name = "Water";
  shore.z = kStageTop + kStageHeight - 15; //move the shore at the same speed as the top of the stage
}

class SceneObject {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    //page y is stage +z
    this.y = kStageTop + z;
    this.u = lerp(kUnit / 2, kUnit, z / kStageHeight);
    this._item = new Path.Circle(new Point(this.x, this.y), 5);
    this._item.fillColor = "black";
  }

  get width() {
    return this.item.bounds.width;
  }

  get item() {
    return this._item;
  }

  set item(i) {
    this._item.remove();
    this._item = i;
    this._item.name = this.constructor.name;
    this._item.translate([this.x - i.bounds.left, this.y - i.bounds.bottom]);

    //add a z
    this._item.z = this.z;
  }
}

class Tree2 extends SceneObject {
  constructor(x, z) {
    super(x, z);
    this.item = new Group();
    let u = this.u;
    let y = this.y;
    let leafColor = new Color(treeColors.random());
    leafColor.lightness = (z / kStageHeight) * 0.3 + 0.4;
    let group = new Group();

    let trunk = new Path.Rectangle({
      point: [x, y],
      size: [u, -u * 3],
      fillColor: "#fcab8e",
    });

    trunk.shear([randomFloat(0.05), 0]);

    group.addChild(trunk);

    let folliage = [];
    folliage.push(
      new Path.Circle({
        center: [x, y - u * 6],
        radius: u * 5,
      })
    );

    for (let i = 0; i < randomInt(3, 5); i++) {
      let f = folliage[0].clone();
      f.translate(new Point({ length: u * 3, angle: Math.random() * 360 }));
      f.scale(randomFloat(0.5, 0.7));
      folliage.push(f);
    }

    var crown = new CompoundPath({
      children: folliage,
      fillColor: leafColor,
    });
    group.addChild(crown.unite());

    crown.remove();
    this.item = group;
  }

  get width() {
    return this.item.bounds.width;
  }
}

class Tree extends SceneObject {
  constructor(x, z) {
    super(x, z);
    this.item = new Group();
    let u = this.u;
    let y = this.y;
    let leafColor = new Color(treeColors.random());
    leafColor.lightness = (z / kStageHeight) * 0.3 + 0.4;
    let group = new Group();

    let trunk = new Path.Rectangle({
      point: [x, y],
      size: [u, -u * 3],
      fillColor: "#fcab8e",
    });

    trunk.shear([randomFloat(0.05), 0]);

    group.addChild(trunk);

    let folliage = new Path.RegularPolygon({
      center: new Point(x, y - u * 6),
      sides: randomInt(5, 8),
      radius: u * 5,
    });

    let folliage2 = new Path.Circle({
      center: new Point(x, y - u * 6),
      //sides: randomInt(5, 8),
      radius: u * 5,
    });

    //splitPath(folliage,7,0.3)
    folliage.fillColor = leafColor;
    folliage.smooth();
    bendHandles(folliage, { min: 30, max: 60 }, { min: 1, max: 1.7 });

    group.addChild(folliage);
    group.scale(1 + randomFloat(0.2), 1 + randomFloat(0.2));
    group.skew(
      randomFloat(5),
      randomFloat(5),
      new Point(group.bounds.center.x, group.bounds.bottom)
    );

    this.item = group;
  }

  get width() {
    return this.item.bounds.width;
  }
}

class Village extends SceneObject {
  constructor(x, z) {
    super(x, z);
    let u = this.u;
    let y = this.y;
    let width = kWidth / 4;
    let numBuildings = randomInt(5, 10);
    let group = new Group();

    for (let leftCorner = 0, i = 0; i < numBuildings; i++) {
      let houseSettings = { houseColor };
      houseSettings.wallWidth = randomFloat(4, 7) * 1.5 * u;
      houseSettings.wallHeight = (2 / 3) * houseSettings.wallWidth;
      houseSettings.houseColor = houseColor;
      houseSettings.roofColor = roofColors.random();
      houseSettings.windows = randomInt(0, 1);
      houseSettings.chimneys = randomInt(0, 1);
      houseSettings.u = u;
      let b = this.house(x + leftCorner, y, houseSettings);

      if (randomInt(0, 1)) {
        b.scale(-1, 1);
      }
      group.addChild(b);
      leftCorner = (leftCorner + houseSettings.wallWidth) % width;
    }
    this.item = group;
  }

  house(x, y, settings) {
    const {
      wallWidth,
      wallHeight,
      houseColor,
      roofColor,
      windows,
      chimneys,
      u,
    } = settings;
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
}

class Field extends SceneObject {
  constructor(x, z) {
    super(x, z);

    let y = this.y;
    let u = this.u;

    //start with a curve
    let width = randomInt(50, 100) * u;
    let path = new Path();
    path.add(x, y);
    path.curveBy([width / 2, -0.5 * u], [width, 0]);
    path.fillColor = grassColor;

    // add points across the length of the curve
    splitPath(path, randomInt(2, 7), 0.3);

    //bend the handles of each segment to make the bush
    for (const segment of path.segments) {
      if (segment.index < path.segments.length) {
        segment.handleIn.angle += randomInt(5, 15);
        segment.handleOut.angle -= randomInt(5, 15);
      }
    }
    path.closePath();
    this.item = path;
  }

  // return this.item.bounds.bottom - this.delta;
}

class Bush extends SceneObject {
  constructor(x, z) {
    super(x, z);

    let y = this.y;
    let u = this.u;

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
        segment.handleIn.angle += randomInt(50, 70);
        segment.handleOut.angle -= randomInt(50, 70);
      }
    }
    path.closePath();
    this.item = path;
  }

  // return this.item.bounds.bottom - this.delta;
}

//todo fix manorHouse so y is the bottom of the object
class ManorHouse extends SceneObject {
  constructor(x, z) {
    super(x, z);
    let u = this.u;
    let y = this.y;

    let houseColor = "#fce9db";
    let roofColor = "#3689bc";

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

    this.item = group;
  }
}

window.addEventListener("load", () => {
  init();
});

/*
 * Wobble function to simulate handledrawn paths
 * displaces segment points and handles by pdelta and hdelta
 * wobble(rpath, 1, 2); gives close lines that overlap
 */

function wobble(apath, pdelta) {
  let path = apath.clone();
  var curves = path.curves;

  var originalCurveCount = curves.length;
  for (i = 0; i < originalCurveCount; i++) {
    curves[i].divideAtTime(0.5); // modifies curves.length!
    i++; //skip the new curve we just added
  }

  var segments = path.segments;
  for (i = 0; i < segments.length; i++) {
    segments[i].point =
      segments[i].point +
      new Point({ length: pdelta, angle: Math.randomFloat() * 360 });
  }
}

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
