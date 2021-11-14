const videosWithSubtitleLink = require('./2videosWithSubtitleLink.json')
const pathJoin = require('path').join
const https = require('https')
const fs = require('fs')

// console.log(videosWithSubtitleLink.length)
const detailsConsole = {
  alreadyHadOrNotSrt: 0,
  downloaded: 0,
  error: 0,
}

for (const titleAndLinkSubtitle of videosWithSubtitleLink) {
  const { title, subsLink } = titleAndLinkSubtitle

  // console.log({ title, subsLink })
  if (
    !subsLink ||
    hasFileInFolder(pathJoin(__dirname, './meSrt'), nameFile(title + '.srt'))
  ) {
    detailsConsole.alreadyHadOrNotSrt++
    continue
  }

  function downloadSrtLink(subLink) {
    const fileName = nameFile(title)
    const file = fs.createWriteStream(pathJoin(__dirname, './meSrt', fileName))
    https.get(subLink, function (response) {
      response.pipe(file)
      file
        .on('finish', function () {
          file.close()
          detailsConsole.downloaded++
        })
        .on('error', function (err) {
          detailsConsole.error++
        })
    })
  }

  downloadSrtLink(subsLink)
}

console.log(detailsConsole)

function hasFileInFolder(folder, fileName) {
  const result = fs.existsSync(pathJoin(folder, fileName))
  // console.log({ result })
  return result
}

function nameFile(str) {
  if (!str) return null
  return str.replace(/[<>:"/\|?*]/g, ' ')
}
