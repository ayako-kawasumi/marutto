const fs = require('fs')
const {promisify} = require('util')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const statAsync = promisify(fs.stat)

module.exports = {
  readFileAsync,
  writeFileAsync,
  statAsync
}