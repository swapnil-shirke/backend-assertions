var fs = require('fs')

function listDir(dir) {
  return fs.readdirSync(dir)
}

function isDirectory(file) {
  var stat = fs.statSync(file)
  return stat && stat.isDirectory()
}

function getJsFiles(files) {
  return files.filter(function(f) {return f.match(/.js$/)})
}

function path(dir, file) {
  return dir + '/' + file
}

/*
  Simple function to traverse and require the JS files
*/
function traverseAndRequire(dir) {
  if (!fs.existsSync(dir))
    return

  var files = listDir(dir)
  getJsFiles(files).forEach(function(file) {
    require(path(dir, file))
  })

  files.forEach(function(file) {
    file = path(dir, file)
    if (isDirectory(file))
      return traverseAndRequire(file)
  })
}

exports.isDirectory        = isDirectory
exports.listDir            = listDir
exports.traverseAndRequire = traverseAndRequire
exports.path               = path