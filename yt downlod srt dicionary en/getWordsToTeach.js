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

function readAllSrtFiles(filesName, folder) {
  const srtFiles = [{ name: '', content: '' }]

  filesName.forEach(function (file) {
    const fileContent = fs.readFileSync(
      joinPath(__dirname, folder, file),
      'utf8'
    )
    const dataSrt = parser.fromSrt(fileContent, true)
    srtFiles.push({ name: file, content: dataSrt })
  })
  return srtFiles.filter(v => v.content.length > 0)
}
const all = allSrtInFolder('./srt videos learning eng')
const srtFiles = readAllSrtFiles(all, './srt videos learning eng')
const srtCena = ''

//take sentences in SrtFiles that are in srtCena
function getWordsToTeach(srtCena) {
  const wordsToTeach = []
  srtFiles.forEach(function (srtFile) {
    srtFile.content.forEach(function (sentence) {
      if (srtCena.indexOf(sentence.text) > -1) {
        wordsToTeach.push(sentence.text)
      }
    })
  })
  return wordsToTeach
}

getWordsToTeach(srtCena)
