var crypto = require('crypto')
var R = module.exports = require('ramda')

module.exports.node = require('util')
module.exports.Promise = require('when')
module.exports.Promise.sequence = require('when/sequence')
module.exports.Promise.pipeline = require('when/pipeline')
module.exports.Promise.parallel = require('when/parallel');
module.exports.Promise.wrapFnInPromise = require('when/function').lift
module.exports.Promise.wrapNodeFnInPromise = require('when/node').lift
module.exports.Promise.wrapAllNodeFnInPromise = require('when/node').liftAll

module.exports.Promise.npromise = function() {
  var context = arguments[0]
  var fn = arguments[1]
  var rest = Array.prototype.slice.call(arguments, 2, arguments.length)

  var deferred = R.Promise.defer()

  rest.push(function(err, data) {
    return deferred.resolve(data)
  })

  context[fn].apply(context, rest)
  return deferred.promise
}

/**
 This method Promisifies any supertest api call
 Example
  R.Promisify(api.post('url'))
  .then(function(res){
    console.log(res.body)
  })
*/
module.exports.Promisify = function(client) {
  return module.exports.Promise.npromise(client, 'end')
}


module.exports.wrapInPromise = function(toBeWrapped) {
  return when(toBeWrapped)
}

module.exports.Promise.wrapAllFnInPromise = function(fns) {
  return fns.map(function(fn) {
    return R.Promise.wrapFnInPromise(fn)
  })
}

module.exports.pretty = function(val) {
  return console.log(JSON.stringify(val, null, 2))
}
/*
  Generates a random string to used as "uid"
  param | length |  Length of the uid
*/
module.exports.bltRandom = function(length) {
  return 'blt' + crypto.randomBytes(length).toString('hex')
}
/*
  Generates a random email
*/
module.exports.bltRandomEmail = function() {
  return module.exports.bltRandom(4) + '@random.org'
}

/*
 This method should be used when all undefined values need to be removed from array
 eg [undefind, 2] ==> [2]
*/
module.exports.removeUndefined = function(arr) {
  var isNotUndefined = R.compose(R.not, R.isUndefined)
  return R.filter(isNotUndefined, arr)
}

/*
 This method should be used when all empty values need to be removed from array
 eg ['', [], {}, 2] ==> [2]
*/
module.exports.removeEmpty = function(arr) {
  var isNotEmpty = R.compose(R.not, R.isEmpty)
  return R.filter(isNotEmpty, arr)
}

/*
 This method should be used when undefined and null values need to be removed from array
 eg [undefind, 2, null, 3] ==> [2, 3]
*/
module.exports.removeNils = function(arr) {
  var isNotNil = R.compose(R.not, R.isNil)
  return R.filter(isNotNil, arr)
}

/**
 * Creates an array with all falsey values removed. The values false, null, 0, "", undefined, and NaN are falsey.
 */
module.exports.compact = function(array) {
  var index = -1,
    length = array ? array.length : 0,
    resIndex = -1,
    result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[++resIndex] = value;
    }
  }
  return result;
}

/*
  Creates an array excluding all provided values.
  eg. without([1, 2, 1, 3], [1, 2]) -> [3]
*/
module.exports.without = function(arr, valuesToExclude) {
  var predicate = function(n) {
    return !R.contains(n, valuesToExclude)
  }
  return R.filter(predicate, arr)
}


// Converts a arrays of string into a "." delimited string
module.exports.concatenatePath = function(paths) {
  return paths.join(".")
}

/*
  Does it end with the given suffix?
  @return Boolean
*/
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

/*
  This method iteratively copies properties/methods from one object to other
  param | copyTo |  Target object
  param | copyFrom |  Source object
*/
module.exports.copyProperties = function(copyTo, copyFrom) {
  for (method in copyFrom) {
    copyTo[method] = copyFrom[method]
  }
  return copyTo
}


/**
 * Overwrite ramda has method to handle null values
 * @return {boolean}
 */
module.exports.has = R.curry(function(prop, obj) {
  return obj && R.keys(obj).indexOf(prop) >= 0
})

/*
  This method is used to check if a variable is array
  param | array | The variable to be checked
*/
module.exports.isArray = function(arr) {
  // Uses ramda's R.is function
  return module.exports.is(Array, arr)
}

module.exports.isNumber = function(variable) {
  // isNumber of NaN gives true so we need to handle it separately
  if (isNaN(variable))
    return false
      // Uses ramda's R.is function
  return module.exports.is(Number, variable)
}

module.exports.isBoolean = function(variable) {
  // Uses ramda's R.is function
  return module.exports.is(Boolean, variable)
}

module.exports.isString = function(variable) {
  // Uses ramda's R.is function
  return module.exports.is(String, variable)
}

module.exports.isFunction = function(functionToCheck) {
  return module.exports.is(Function, functionToCheck)
}

module.exports.isMongoError = function(err) {
  return R.hasField('name', err) && (err['name'] === 'MongoError')
}

/*
  This method is used to check if a variable is a pure JavaScript Object and not array
  param | object | The variable to be checked
  eg
   [1,2,3] => false
   {       => true
     a: "b"
   }
*/
module.exports.isPlainObject = function(obj) {
  return R.isObject(obj) && !R.isArray(obj)
}

/*
  This method is used to check if a variable is a JavaScript Object
  param | object | The variable to be checked
  eg
   [1,2,3] => true
   {       => true
     a: "b"
   }
*/
module.exports.isObject = function(obj) {
  // Uses ramda's R.is function
  return module.exports.is(Object, obj)
}
/*
  Returns true is value is undefined||null||''||[] etc
*/
module.exports.isBlank = function(variable) {
  return module.exports.isNil(variable) || module.exports.isEmpty(variable)
}

/*
 Returns true is the variable's value is undefined
*/
module.exports.isUndefined = function(variable) {
  return variable === undefined
}

/*
 Returns true is the variable's value is null
*/
module.exports.isNull = function(variable) {
  return variable === null
}

/*
 Unlike the isNaN method provided by JS this method returns false if is used again undefined
*/
module.exports.isNaN = function(value) {
  value = parseInt(value)
  // An `NaN` primitive is the only value that is not equal to itself.
  return R.isNumber(value) && value != +value;
}

module.exports.first = function(array) {
  return array[0]
}

module.exports.isEmptyObj = function(obj) {
  return Object.keys(obj).length === 0
}

/*
  Converts a string value to a number value if possible else returns the same string
*/
module.exports.numToString = function(elem) {
  if (R.isNumber(elem)) {
    return elem.toString()
  }
  return elem
}


/*
  Convert a string to boolean, or return if already boolean
*/
module.exports.toBoolean = function(elem) {
  if (R.isBoolean(elem))
    return elem
  else if (R.isString(elem))
    return elem === 'true'
  else if (elem === null)
    return false
  else if (elem === undefined)
    return false
  else
    return Boolean(elem)
}

module.exports.toNumber = function(elem) {
  return parseFloat(elem)
}

// Checks if a object has a field
module.exports.hasField = function(field, obj) {
  // Uses ramda's has function
  // R.has gives error if object is undefined, so we check whether obj is present
  return obj && R.has(field)(obj)
}

/*
  This method can be used to make object hierarchy dyanmically
  @example
  var obj = keyValue("person",keyValue('age',10))
  {
    person:{
      age:10
    }
  }
*/
module.exports.keyValue = function() {
  var lastKey = null
  var result = {}

  for (var i = 0; i < arguments.length; i++) {
    var elem = arguments[i]
    if ((i % 2) === 0) {
      lastKey = elem
    } else {
      result[lastKey] = elem
    }
  }

  return result
}

var encodeParam = module.exports.encodeParam = function(property, object) {
  if (module.exports.isObject(object[property])) {
    return property + "=" + encodeURIComponent(JSON.stringify(object[property]))
  } else {
    return property + "=" + object[property]
  }
}

module.exports.addParam = function(path, property, object) {
  if (path.indexOf("?") >= 0) {
    path += "&" + encodeParam(property, object)
  } else {
    path += "?" + encodeParam(property, object)
  }
  return path
}

module.exports.findAndRemove = function(item, list) {
  var index = list.indexOf(item)
  if (index >= -1) {
    return list.splice(index, 1)
  }
  return list
}
/*
 This method renames a property
 Example
  var app = {
    name: 'abc'
  }
  var result = renameProperties(app, 'name', 'username')
  result will be
  {
    username: 'abc'
  }
*/
module.exports.renameProperties = function(from, propFrom, propTo) {
  from[propTo] = from[propFrom]
  delete from[propFrom]
  return from
}

/*
  Get the start of day for any date object
  @param date: A date Object
  @return date: Start of day of a date
*/
module.exports.startOfDay = function(date) {
  var newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

/*
  Get the end of day for any date object
  @param date: A date Object
  @return date: End of day of a date
*/
module.exports.endOfDay = function(date) {
  var newDate = new Date(date)
  newDate.setHours(23, 59, 59, 999)
  return newDate
}

/*
  Get a new date object, which has the value of number of minutes ago
  @param number: The number of minutes you want to go in the past
  @return date: A date object
*/
module.exports.minutesAgo = function(number) {
  return module.exports.minutesAgoFrom(new Date(), number)
}

/*
  Get a new date object, which has the value of number of minutes from now
  @param number: The number of minutes you want to go in the future
  @return date: A date object
*/
module.exports.minutesFromNow = function(number) {
  return module.exports.minutesFrom(new Date(), number)
}

/*
  Return the date instance minutes ago
*/
module.exports.minutesAgoFrom = function(date, minutes) {
  var number = Number(minutes)

  var newMill = Number(date) - (number * 60000)
  return (new Date(newMill))
}

/*
  Return the date instance that is minutes from given date
*/
module.exports.minutesFrom = function(date, minutes) {
  var number = Number(minutes)

  var newMill = Number(date) + (number * 60000)
  return (new Date(newMill))
}

module.exports.one_day = 86400000

/*
  Subtracts number of days from a date
  @param date: A date object
  @param subtract: Number of days to be subtracted
  @return new_date: A new Date Object, with the final value
*/
module.exports.minusDays = function(date, subtract) {
  var new_date = new Date(date)
  new_date.setMilliseconds(date.getMilliseconds() - (subtract * module.exports.one_day))
  return new_date
},

/*
  Adds number of days to a date
  @param date: A date object
  @param subtract: Number of days to be added
  @return new_date: A new Date Object, with the final value
*/
module.exports.addDays = function(date, add) {
  if (typeof(add) != 'number') {
    add = 0
  }
  var new_date = new Date(date)
  new_date.setMilliseconds(date.getMilliseconds() + (add * module.exports.one_day))
  return new_date
}

module.exports.dataFiller = module.exports.curry(function(model, doc, delta) {
  model.data = doc
  model.delta = {}
  model.originalDelta = {}
  return model
})


/**
 * This method will choose to merge the rightValue only if the left value was null or undefined
 */
module.exports.nonEmptyMergeCustomizer = function(key, leftVal, rightVal) {
  if (!R.isNil(leftVal) && R.isNil(rightVal))
    return leftVal
  else
    return rightVal
}