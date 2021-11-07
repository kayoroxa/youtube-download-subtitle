const fs = require('fs')
const parser = require('subtitles-parser')
const joinPath = require('path').join
const words = require('./words.json')

function allSrtInFolder(folder) {
  var files = fs.readdirSync(folder)
  var srtFiles = []
  files.forEach(function (file) {
    if (file.indexOf('.srt') > -1) {
      srtFiles.push(file)
    }
  })
  return srtFiles
}

function readAllSrtFiles(filesName) {
  const srtFiles = [{ name: '', content: '' }]

  filesName.forEach(function (file) {
    const fileContent = fs.readFileSync(joinPath('../srt', file), 'utf8')
    const dataSrt = parser.fromSrt(fileContent, true)
    srtFiles.push({ name: file, content: dataSrt })
  })
  return srtFiles.filter(v => v.content.length > 0)
}
const all = allSrtInFolder('../srt')
console.log(all)