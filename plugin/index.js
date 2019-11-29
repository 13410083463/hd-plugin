var obj = {}
var modules = [{
  name:'api',
  filePath:'./api/data.js'
}]
for (let i in modules) obj[modules[i].name] = require(modules[i].filePath)
module.exports = obj
 