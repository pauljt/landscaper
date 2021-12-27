import {
  randomInt,
  randomFloat,
  bendHandles,
  displaceSegments,
} from "./utils.js";

const treeColors = ["#7dc1b4", "#4e977a", "#3d7c71", "#93d0a7"];
const trunkColor = "#fcab8e";

function Tree(u = 10) {
  let group = new Group();
  let leafColor = new Color(treeColors.random());

  let trunk = new Path.Rectangle({
    from: [0, 0],
    to: [u, -u * 7],
    fillColor: trunkColor,
  });

  trunk.shear([randomFloat(0.05), 0]);

  let folliage = [];
  folliage.push(
    new Path.Circle({
      center: [0, -u * 6],
      radius: u * 5,
    })
  );

  for (let i = 0; i < randomInt(3, 5); i++) {
    let f = folliage[0].clone();
    f.translate(new Point({ length: u * 3, angle: Math.random() * 360 }));
    f.scale(randomFloat(0.4, 0.6));
    folliage.push(f);
  }

  var temp = new CompoundPath({
    children: folliage,
    fillColor: leafColor,
  });

  group.addChild(trunk);
  let crown = temp.unite();
  temp.remove(); // crown.unite() makes a copy above, remove the original

  crown.scale(1 + randomFloat(0.2), 1 + randomFloat(0.2));
  group.addChild(crown);

  Object.defineProperty(group, "lightness", {
    set: function (val) {
      this.lastChild.fillColor.lightness = val;
    },
  });
  group.remove();
  console.log(group);
  return group;
}

function Tree2(u = 10) {
  let leafColor = new Color(treeColors.random());
  let group = new Group();

  let trunk = new Path.Rectangle({
    point: [0, 0],
    size: [u, -u * 3],
    fillColor: trunkColor,
  });

  trunk.shear([randomFloat(0.05), 0]);

  group.addChild(trunk);

  let folliage = new Path.RegularPolygon({
    center: new Point(0, -u * 6),
    sides: randomInt(5, 8),
    radius: u * 5,
  });

  folliage.fillColor = leafColor;
  folliage.smooth();

  bendHandles(folliage, { min: 30, max: 60 }, { min: 1, max: 1.7 });
  displaceSegments(folliage, u / 2, u / 2);

  group.addChild(folliage);
  folliage.scale(1 + randomFloat(0.1), 1 + randomFloat(0.1));

  Object.defineProperty(group, "lightness", {
    set: function (val) {
      this.lastChild.fillColor.lightness = val;
    },
  });

  group.remove();
  return group;
}

export { Tree, Tree2 };
