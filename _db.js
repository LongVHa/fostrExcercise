const path = require("path")
const glob = require("glob")

//load json files
const apiFiles = glob.sync(path.resolve(__dirname, "./json") + "/**/*.json", {
    nodir:true
})

let data = { api: []}

apiFiles.forEach( filePath => {
    const jsonFile = require(filePath)
    let [,url] = filePath.split("json/") //get file names
    url = url.slice(0, url.length - 5) //remove .json
    data.api.push(jsonFile)
})

module.exports = () => {
    return data
}