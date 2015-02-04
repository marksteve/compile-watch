require('colors');
var fs = require('fs');
var path = require('path');
var watchify = require('watchify/bin/args');

function bundle(w, dotfile, outfile) {
  var wb = w.bundle();
  wb.on('error', function (err) {
    console.error('[error]'.red, String(err));
    fs.writeFile(outfile, 'console.error('+JSON.stringify(String(err))+')', function(err) {
      if (err) console.error(err);
    });
  });
  wb.pipe(fs.createWriteStream(dotfile));
  wb.on('end', function() {
    fs.rename(dotfile, outfile);
    console.log('[built]'.green, outfile);
  });
}

module.exports = function(argv) {
  var entries = argv.js;
  if (typeof entries === 'string') {
    entries = [entries];
  }
  if (!entries) {
    return;
  }
  entries.forEach(function(entry) {
    console.log('[watching]'.yellow, entry);
    var outfile = path.join(
      argv.o,
      path.basename(entry, path.extname(entry)) + '.js'
    );
    var dotfile = path.join(path.dirname(outfile), '.' + path.basename(outfile));
    var w = watchify([entry].concat(process.argv.slice(2)));
    w.on('update', bundle.bind(null, w, dotfile, outfile));
    bundle(w, dotfile, outfile);
  });
};
