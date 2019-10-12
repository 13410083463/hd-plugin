var obj = {}
var modules = [{
  name:'api',
  filePath:'./api/data.js'
},{
  name:'url',
  filePath:'./api/api.js'
},{
  name:'http',
  filePath:'./api/http.js'
},{
  name:'util',
  filePath:'./api/util.js'
},{
  name:'image',
  filePath:'./api/image.js'
}]
for (let i in modules) obj[modules[i].name] = require(modules[i].filePath)
module.exports = obj
 