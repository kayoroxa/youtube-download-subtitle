const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)
const parser = require('subtitles-parser')
const videosWithSubtitle = require('./videosWithSubtitleLink.json')
const _ = require('lodash')

function nameFile(str) {
  if (!str) return null
  return str.replace(/[<>:"/\|?*]/g, ' ')
}

async function loopFilesSrt(dirPath, searchTerm) {
  const files = await readdir(dirPath)
  const promises = files.map(file =>
    searchCenaInFiles(path.join(dirPath, file), searchTerm)
  )
  const results = await Promise.all(promises)
  console.log('Cenas com ', searchTerm)
  console.log(
    _.sortBy(
      results.filter(v => v !== null),
      [v => v.frase.includes('🔵')]
    ).reverse()
  )
  return results
}

async function searchCenaInFiles(filePath, searchTerm) {
  const srtFile = await fs.readFileSync(filePath, 'utf8')
  const dataSrt = parser
    .fromSrt(srtFile, true)
    .map(v => ({ ...v, text: v.text.replace(/\n/g, ' ') }))

  const srt = {
    linesHasLiteral: filter(dataSrt, v =>
      v.text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi'))
    ),
    linesHasWords: filter(dataSrt, v => {
      return searchTerm.split(' ').every(search => {
        if (
          v.text.match(new RegExp('\\b' + search + '\\b', 'gi')) &&
          !v.text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi'))
        )
          return true
      })
    }),
  }

  if (!srt.linesHasLiteral && !srt.linesHasWords) {
    return null
  }

  const videoSrtFromName = videosWithSubtitle.filter(v => {
    return nameFile(v.title) === filePath.replace(/srt\\|.srt/gi, '')
  })
  // console.log(
  //   videoSubData.map(v => ({
  //     ...v,
  //     linkYoutube: createYoutubeLink(v.linkYoutube, searchResult[0].startTime),
  //   }))
  // )
  return videoSrtFromName.map(v => ({
    title: v.title,
    linkYoutube: createYoutubeLink(
      v.linkYoutube,
      srt.linesHasLiteral?.[0]?.startTime || srt.linesHasWords?.[0]?.startTime
    ),
    frase:
      putEmoticon(srt.linesHasLiteral?.[0]?.text, 'azul') ||
      putEmoticon(srt.linesHasWords?.[0]?.text, 'yellow'),
  }))[0]
}

function createYoutubeLink(linkYoutube, startTime) {
  const realTime = parseInt(startTime / 1000)
  return `https://youtu.be/${linkYoutube}?t=${Math.max(0, realTime - 3)}`
}

function filter(data, funcFilter) {
  const result = data.filter(funcFilter)
  if (result.length === 0) return null
  return result
}

function putEmoticon(sentence, emoticon) {
  if (!sentence) return null
  return emoticon === 'azul' ? '🔵 ' + sentence : '🟡 ' + sentence
}

loopFilesSrt('./srt', `make you have`)
