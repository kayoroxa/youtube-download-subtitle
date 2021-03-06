const fs = require('fs')
const parser = require('subtitles-parser')
const joinPath = require('path').join
const words = require('./words.json')

function allSrtInFolder(folder) {
  var files = fs.readdirSync(joinPath(__dirname, folder))
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
    const fileContent = fs.readFileSync(
      joinPath(__dirname, '../srt', file),
      'utf8'
    )
    const dataSrt = parser.fromSrt(fileContent, true)
    srtFiles.push({ name: file, content: dataSrt })
  })
  return srtFiles.filter(v => v.content.length > 0)
}
const all = allSrtInFolder('../srt')
const srtFiles = readAllSrtFiles(all)
// console.log(srtFiles)

const filterSrtFiles = srtFiles.map(v => {
  const allFrases = v.content.map(v => v.text)
  let num = 0
  let sem = 0
  allFrases.forEach(v => {
    const wordsInFrase = v.split(' ')
    wordsInFrase.forEach(v => (words.indexOf(v) > -1 ? num++ : sem++))
  })
  return { name: v.name, num, sem, score: (num * 100) / (sem + num) }
})

const sorted = filterSrtFiles.sort((a, b) => b.score - a.score).reverse()
console.log(sorted)
// console.log(readAllSrtFiles()[0])
