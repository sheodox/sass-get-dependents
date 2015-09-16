'use strict';
var startTime = Date.now(),
  fs = require('fs'),
  glob = require('glob'),
  path = require('path'),
  verbose = require('verboser'),
  encoding = {encoding: 'utf8'},
  endTime, filesWithImports;

var checkForImports = function (src) {
  var contents,
    importRegEx = new RegExp("@import"),
    matchingFiles = [];

  src.forEach(function (cur) {
    contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) && matchingFiles.indexOf(cur) === -1) {
      matchingFiles.push(cur);
    }
  });
  return matchingFiles;
};

var readImportStatements = function (file) {
  var matchingFiles = [],
    basename = path.basename(file, (path.extname(file))),
    fileName = (basename[0] === '_') ? basename.substring(1, basename.length) : basename,
    importRegEx = new RegExp('@import[\\s]+([\'|"./\\w]+?)' + fileName + '[\'|"];?');

  filesWithImports.forEach(function (cur) {
    var contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) === true) {
      matchingFiles.push(cur);
    }
  });
  return matchingFiles;
};

var dependentFiles = function (files, i) {
  files = files || [];
  i = i || 0;

  if (files.length === i) {
    files.shift();
    return files;
  }

  var f = files[i],
    dependents = readImportStatements(f);

  files.push(dependents);
  files = [].concat.apply([], files);

  return dependentFiles(files, ++i);
};

module.exports = function (source, basePath) {
  basePath = basePath || '';
  verbose.log('Checking ' + source).linebreak();

  // Initial file checks -- does exist?.
  if (!fs.existsSync(path.join(basePath, source))) {
    return [];
  }
  // Initial file checks -- is css?
  if (path.extname(source) === '.css') {
    return [];
  }

  // Okay, the basics are there. Lets build the patterns
  var fileExt = path.extname(source),
    fileSearch = glob.sync(path.join(basePath, '**/*') + fileExt),
    allDependentFiles = [],
    results;

  filesWithImports = checkForImports(fileSearch);

  verbose.log('These files have import statements:');
  verbose.log(filesWithImports).linebreak();

  results = dependentFiles([source]);
  results.forEach(function (el) {
    if (allDependentFiles.indexOf(el) === -1) {
      allDependentFiles.push(el);
    }
  });


  verbose.log('These are all the dependentFiles:');
  verbose.log(allDependentFiles);

  return allDependentFiles;
};

endTime = Date.now();
verbose.log(endTime - startTime + 'ms to complete');
