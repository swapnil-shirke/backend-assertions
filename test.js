var autoRequire  = require('./auto-require')
var pluginDir    = __dirname + '/spec'
var conf         = require('./config/conf')
var endpoints    = require('./config/endpoints')

//Do not change the require sequence
GLOBAL.R         = require("./utility")
GLOBAL.config    = conf
config.endpoints = endpoints
GLOBAL.chai      = require('chai')
GLOBAL.should    = chai.should()
GLOBAL.expect    = chai.expect
GLOBAL.supertest = require('supertest')
GLOBAL.api       = supertest(config.host + '/' + config.version)

chai.use(require('chai-as-promised'))
chai.use(require('chai-things'))

GLOBAL.factories = {
  factories: [],
  addFactory: function(name, method) {
    this.factories.push({
      name: name,
      method: method
    })
  },
  create: function() {
    var args      = Array.prototype.slice.call(arguments)
    // Name of the factory method to call
    name          = args[0]
    args          = R.remove(0, 1, args)
    var factoryFn = R.find(R.propEq('name', name))(this.factories);
    return factoryFn.method.apply(null, args)
  },
  list: function() {
    var that = this
    console.log(R.map(function (factory) {
      return R.pick(['name'], factory)
    }, that.factories))
  }
}
var plugins = autoRequire.listDir(pluginDir)

function traverseAllTestSuites(basePath, plugins){
	return plugins.forEach(function(plugin){
  	// Construct full path
  	var subPath = autoRequire.path(basePath, plugin)
    //Check if its directory
    if(autoRequire.isDirectory(subPath) && !isNodeModules(basePath)){
  		// Require '/test' if avaiable 
  		autoRequire.traverseAndRequire(subPath)
  		// Recurse to find my test suites
			return traverseAllTestSuites(subPath, autoRequire.listDir(subPath))
  	}
	})
}

traverseAllTestSuites(pluginDir, plugins)


function isNodeModules(basePath){
  return R.last(R.split("/")(basePath)) === "node_modules"
}

GLOBAL.generateUid = function(){
  var uid = ""
  var possibleValues = "abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < 5; i++)
    uid += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
  return uid
}
