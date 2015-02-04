#!/usr/bin/env node

var subarg = require('subarg');

var robocomp = require('../');
var argv = subarg(process.argv.slice(2));

if (!argv.o) {
  console.error('-o is required');
  process.exit(1);
}

robocomp.watchjs(argv);
robocomp.watchless(argv);
