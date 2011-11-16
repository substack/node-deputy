var deputy = require('../');
var detective = deputy(process.env.HOME + '/.config/deputy.json');

var deps = detective.find('require("a"); require("b")');
console.dir(deps);
