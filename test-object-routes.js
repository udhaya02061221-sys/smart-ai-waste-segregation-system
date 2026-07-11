const fs = require("fs");
const vm = require("vm");

const appSource = fs.readFileSync("app.js", "utf8");
const casesStart = appSource.indexOf("const cases = ");
const casesEnd = appSource.indexOf("];", casesStart);
if (casesStart < 0 || casesEnd < 0) throw new Error("Unable to find cases array");

const casesCode = appSource.slice(casesStart + "const cases = ".length, casesEnd + 1);
const cases = vm.runInNewContext(casesCode);

const expected = [
  ["Paper", "recycle"],
  ["Notebook", "recycle"],
  ["Cardboard", "recycle"],
  ["Plastic Bottle", "recycle"],
  ["Hard Plastic Container", "recycle"],
  ["Steel Bottle", "recycle"],
  ["Sip Bottle Cup", "recycle"],
  ["Glass Bottle", "recycle"],
  ["Metal Can", "recycle"],
  ["Food Waste", "organic"],
  ["Banana Peel", "organic"],
  ["Apple", "organic"],
  ["Chip Packet", "reject"],
  ["Biscuit Packet", "reject"],
  ["Plastic Cover", "reject"],
  ["Pen", "reject"],
  ["Rubber", "reject"],
  ["Phone", "reject"],
  ["Phone Case", "reject"],
  ["Battery", "reject"],
  ["Shoe", "reject"],
  ["Broken Slipper", "reject"],
  ["Rubber Slipper", "reject"],
  ["Leather Slipper", "reject"],
  ["Cloth", "reject"]
];

const failures = [];
const aliasExpectations = {
  paper: "Paper",
  notebook: "Notebook",
  book: "Notebook",
  "note book": "Notebook",
  cardboard: "Cardboard",
  wrapper: "Biscuit Packet",
  "biscuit packet": "Biscuit Packet",
  "wheat packet": "Chip Packet",
  slipper: "Shoe",
  sandal: "Shoe",
  "broken slipper": "Broken Slipper",
  "rubber slipper": "Rubber Slipper",
  "leather slipper": "Leather Slipper"
};

const aliasStart = appSource.indexOf("const aliases = {");
const aliasEnd = appSource.indexOf("  };", aliasStart);
if (aliasStart < 0 || aliasEnd < 0) throw new Error("Unable to find aliases object");
const aliasCode = `(${appSource.slice(aliasStart + "const aliases = ".length, aliasEnd + 3)})`;
const aliases = vm.runInNewContext(aliasCode);

const rows = expected.map(([name, route]) => {
  const item = cases.find((entry) => entry.name === name);
  if (!item) {
    failures.push(`${name}: missing`);
    return { name, expectedRoute: route, actualRoute: "missing" };
  }
  if (item.route !== route) failures.push(`${name}: expected ${route}, got ${item.route}`);
  if (!(item.weight > 0)) failures.push(`${name}: weight must be positive`);
  if (!(item.fillImpact > 0)) failures.push(`${name}: fillImpact must be positive`);
  return {
    name,
    route: item.route,
    weightKg: item.weight,
    fillImpactPercent: item.fillImpact
  };
});

Object.entries(aliasExpectations).forEach(([label, expectedName]) => {
  const actualName = aliases[label] || label;
  if (actualName !== expectedName) failures.push(`alias ${label}: expected ${expectedName}, got ${actualName}`);
  const item = cases.find((entry) => entry.name === actualName);
  if (!item) failures.push(`alias ${label}: mapped item ${actualName} missing`);
});

console.table(rows);
console.log(`Tested ${rows.length} objects`);
console.log(`Tested ${Object.keys(aliasExpectations).length} aliases`);
if (failures.length) {
  console.error("FAILURES");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("All object route tests passed");
