//todo: split into seperate files:
/* todo: make stage into an class   
   - maintain a SORTED sceneObject array
   - adds insert objects into the correct spot in the heirachy
   - remove() calls .remove() on the paper object AND removes reference to item (or  maybe make sceneObject.remove() that does that?)
   */

import { Tree, Tree2 } from "./Tree.js";
import { Village, ManorHouse } from "./Buildings.js";
import { Water } from "./Water.js";
import { randomInt, randomFloat, bendHandles } from "./utils.js";
import { Bush, Field } from "./Scenery.js";

paper.install(window);

//make Math.random() predictable
//Math.seedrandom("1345433434");
const animate = false;

const kHeight = 600;
const kWidth = 1200;
const kCenter = kHeight / 2;
const kStageTop = kCenter + 50;
const kStageHeight = 50;
const highTide = kStageHeight + kStageTop;
const wave = 10;
const kUnit = kHeight / 60;
const scrollSpeed = 1.0;
const randomZ = (margin = 0) => randomFloat(0, kStageHeight - margin);

const toggle = {
  trees: 1,
  sky: 1,
  hills: 1,
  bush: 1,
  village: 1,
  manorHouse: 1,
  water: 1,
  field: 1,
  texture: 1,
  scroll: 1,
};

//layers
let background;
let stage;
let water;
let texture;

function init() {
  var canvas = document.getElementById("myCanvas");
  canvas.width = kWidth;
  canvas.height = kHeight;
  paper.setup(canvas);

  project.currentStyle = {
    strokeColor: "#333333",
    strokeWidth: 1.3,
    selected: true,
  };

  project.currentStyle.strokeColor.lightness = 0.3;
  paper.view.onFrame = toggle.scroll ? scroll : null;
  paper.view.draw();

  //setup layers
  background = new Layer();

  stage = new Layer();
  stage.data.area = new Rectangle(0, kStageTop, kWidth, kStageHeight);
  stage.data.height = kStageHeight;

  //stage.children must remain sorted by z value, so items in foreground overlay background
  stage.place = function (item, x, z) {
    if (!item) {
      console.warn("Attempting to place a null item");
      return;
    }
    item.data.z = z;
    item.translate(new Point(x, stage.data.area.top + z));
    // item.position.x = x;
    //item.position.y = stage.data.area.top + z;
    item.lightness = (z / kStageHeight) * 0.3 + 0.4;
    item.visible = true;

    //if there are children, iterate until
    for (let i = 0; i < this.children.length; i++) {
      if (item.data.z < this.children[i].data.z) {
        this.insertChild(i, item);
        return;
      }
    }
    this.addChild(item);
  };
  water = new Layer();
  texture = new Layer({ blendMode: "lighten" });
  drawScene();
}

function drawScene() {
  background.activate();
  if (toggle.sky) sky();
  if (toggle.hills) Hills();

  texture.activate();
  // let stageOverlay = new Path.Rectangle(stage.data.area);
  //stageOverlay.fillColor = "red";
  if (toggle.texture) {
    let raster = new Raster(view.center);
    raster.source = "./texture.png";
    raster.name = "Texture";
    raster.opacity = 0.2;
    texture = raster;
  }

  stage.activate();

  if (toggle.trees) {
    for (let x = 0; x <= kWidth; x += 15) {
      let item;
      switch (1) {
        case 0:
          item = new Tree();
          break;
        case 1:
          item = new Tree2();
          break;
      }
      stage.place(item, x, randomZ());
      x += randomFloat(0, item.bounds.width / 2);
    }
  }

  if (toggle.bush) {
    for (let x = -kWidth / 2; x <= kWidth; x += 15) {
      let pick = randomInt(0, 100);
      let item = new Bush(kUnit);
      stage.place(item, x, randomZ());
      x += randomFloat(0, item.bounds.width);
    }
  }
  if (toggle.field) {
    for (let x = -kWidth / 2; x <= kWidth; x += 15) {
      let pick = randomInt(0, 100);
      let item = new Field(kUnit);
      stage.place(item, x, randomZ());
      x += randomFloat(0, item.bounds.width / 2);
    }
  }
  if (toggle.village) {
    let village = new Village(kWidth / 4, kUnit * 0.8);
    stage.place(village, 700, 30);
  }
  if (toggle.manorHouse) {
    let manorHouse = new ManorHouse(kUnit * 0.08);
    stage.place(manorHouse, 200, 30);
  }

  if (toggle.water) {
    water.activate();
    let item = new Water(
      new Rectangle(0, kStageTop + kStageHeight, kWidth, kHeight),
      kStageHeight
    );
    console.log(item, item.position.x, item.position.y);
  }

  //layoutScene();
}

function move(item) {
  item.position.x +=
    ((item.data.z / kStageHeight) * scrollSpeed) / 4 + scrollSpeed;
}

function scroll() {
  if (toggle.water) {
    let item = water.firstChild;
    if (item.bounds.left >= -10) {
      item.insert(0, new Point(-100 * scrollSpeed, highTide + randomFloat(5)));
    }

    move(item);
    item.segments[item.segments.length - 1].point.x = 0;
  }

  for (var i = 0; i < stage.children.length; i++) {
    let item = stage.children[i];

    if (item.name == "Water") {
    } else {
      move(item);

      if (item.bounds.left > view.size.width) {
        if (item.name == "ManorHouse") {
          sceneObjects.splice(i, 1);
          item.remove();
          sceneObjects.push(
            new ManorHouse(randomInt(-kWidth / 2, -kWidth), randomZ(15))
          );
        } else if (item.name == "Village") {
          sceneObjects.splice(i, 1);
          item.remove();
          sceneObjects.push(
            new Village(randomInt(-kWidth / 2, -kWidth), randomZ(15))
          );
          sceneObjects.sort((a, b) => a.z - b.z);
        } else {
          item.position.x = -item.bounds.width;
        }
      }
    }
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

function Hills() {
  let path = new Path.Rectangle(
    new Rectangle(
      stage.data.area.topLeft.x,
      stage.data.area.topLeft.y,
      kWidth,
      kHeight
    )
  );
  path.fillColor = "#72c897";
  path.name = "Hills";
}

window.addEventListener("load", () => {
  init();
});
