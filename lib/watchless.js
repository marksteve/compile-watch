require('colors');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var less = require('less');

function compile(outdir, lessfile) {
  if (path.extname(lessfile) != '.less') {
    return;
  }
  var outfile = path.join(
    outdir,
    path.basename(lessfile, path.extname(lessfile)) + '.css'
  );
  fs.readFile(lessfile, function(err, content) {
    function checkErr(err) {
      if (err) {
        console.error('[error]'.red, lessfile + ':', err.message);
      }
      return !!err;
    }
    if (checkErr(err)) return;
    less.render(content.toString())
      .then(function(output) {
        fs.writeFile(outfile, output.css, function(err) {
          if (checkErr(err)) return;
          console.log('[built]'.green, outfile);
        });
      }, function(err) {
        if (checkErr(err)) return;
      });
  });
}

module.exports = function(argv) {
  var entries = argv.less;
  if (typeof entries === 'string') {
    entries = [entries];
  }
  if (!entries) {
    return;
  }
  entries.forEach(function(entry) {
    console.log('[watching]'.yellow, entry);
    var l = chokidar.watch(entry);
    l.on('add', compile.bind(null, argv.o));
    l.on('change', compile.bind(null, argv.o));
  });
};
