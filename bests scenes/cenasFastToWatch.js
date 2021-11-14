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

const filterSrtFiles = srtFiles.map(fileData => {
  const dataSrt = fileData.content
  // const allFrases = content.map(v => v.text)
  let time = 0
  let wordsCount = 0
  let frasesCount = 0
  dataSrt.forEach(fraseSrtData => {
    const timeDiference = fraseSrtData.endTime - fraseSrtData.startTime
    const timeDiferenceSeconds = timeDiference / 1000
    const frase = fraseSrtData.text.replace(/\[.*\]/g, '')
    const fraseWordsCount = frase.split(' ').length
    const timeByWord = timeDiferenceSeconds / fraseWordsCount
    time += timeByWord
    wordsCount += fraseWordsCount
    frasesCount++
  })
  return { name: fileData.name, score: time / wordsCount, frasesCount }
})

const sorted = filterSrtFiles.sort((a, b) => b.score - a.score).reverse()
console.log(sorted)
// console.log(readAllSrtFiles()[0])
