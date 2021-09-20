const videosWithSubtitleLink = require('./videosWithSubtitleLink.json')

const https = require('https')
const fs = require('fs')

// console.log(videosWithSubtitleLink.length)
const detailsConsole = {
  alreadyHad: 0,
  downloaded: 0,
  error: 0,
}

for (const titleAndLinkSubtitle of videosWithSubtitleLink) {
  const { title, subsLink } = titleAndLinkSubtitle

  // console.log({ title, subsLink })
  if (!subsLink || hasFileInFolder('./srt', nameFile(title + '.srt'))) {
    detailsConsole.alreadyHad++
    continue
  }
  try {
    https.get(subsLink, resp =>
      resp.pipe(
        fs.createWriteStream(`./srt/${title.replace(/[<>:"/\|?*]/g, ' ')}.srt`)
      )
    )
    detailsConsole.downloaded++
  } catch (error) {
    console.log('erro')
    detailsConsole.error++
  }
}

console.log(detailsConsole)

function hasFileInFolder(folder, fileName) {
  return fs.existsSync(`${folder}/${fileName}`)
}

function nameFile(str) {
  if (!str) return null
  return str.replace(/[<>:"/\|?*]/g, ' ')
}
