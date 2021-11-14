const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)
const parser = require('subtitles-parser')
const videosWithSubtitle = require('./2videosWithSubtitleLink.json')
const _ = require('lodash')

function nameFile(str) {
  if (!str) return null
  return str.replace(/[<>:"/\|?*]/g, ' ')
}

async function findSceneWith(dirPath, searchTerm, ignore = [], options = {}) {
  const files = (await readdir(path.join(__dirname, dirPath))).filter(v =>
    ignore.every(i => !v.toLowerCase().includes(i.toLowerCase()))
  )
  // const promises = files.map(file =>
  //   searchCenaInFiles(path.join(dirPath, file), searchTerm)
  // )
  console.log('procurando...')
  console.log('Cenas com: ', searchTerm)
  const results = []
  for (const file of files) {
    if (results.length > 50) break
    const result = await searchSentenceInFile(
      path.join(__dirname, dirPath, file),
      searchTerm,
      options
    )

    if (result) {
      console.log(result)
      results.push(result)
    }
  }

  // console.log(
  //   _.sortBy(
  //     results.filter(v => v !== null),
  //     [v => v?.frase.includes('🔵')]
  //   ).reverse()
  // )
  return '' //results
}

async function readSrt(filePath) {
  const file = await fs.readFileSync(filePath, 'utf8')
  const parsed = parser.fromSrt(file)
  return parsed
}

async function searchSentenceInFile(filePath, search, options) {
  const isObj = typeof search === 'object'
  const searchTerm = !isObj ? search : Object.values(search).join(' ')

  const dataSrt = await readSrt(filePath)

  const srt = {
    linesHasLiteral: filter(
      dataSrt,
      v => {
        if (isObj) {
          return Object.keys(search).every(key =>
            rules[key](v.text, search[key])
          )
        }
        return v.text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi'))
      }
      // v.text.endsWith(searchTerm)
    ),
    linesHasWords: options.onlyLiteral
      ? undefined
      : filter(dataSrt, v => {
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
    return nameFile(v.title) === filePath.trim().match(/[^\\]*$/g)[0]
  })

  if (!videoSrtFromName.length) {
    return [
      {
        title: filePath.replace(/srt\\|.srt/gi, ''),
        startTime: srt.linesHasLiteral?.[0]?.startTime,
        frase:
          putEmoticon(srt.linesHasLiteral?.[0]?.text, 'azul') ||
          putEmoticon(srt.linesHasWords?.[0]?.text, 'yellow'),
      },
    ]
  }

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
    file: filePath.replace(/srt\\|.srt/gi, ''),
    frase:
      putEmoticon(srt.linesHasLiteral?.[0]?.text, 'azul') ||
      putEmoticon(srt.linesHasWords?.[0]?.text, 'yellow'),
  }))[0]
}

//F:\MAIN\JOB\vscode\others\download lot subtitle youtube\srt\Captain Underpants  The First Epic Movie (2017) - The Origin Story Scene (1 10)   Movieclips.srt
//f:/MAIN/JOB/vscode/others/download lot subtitle youtube/srt/Captain Underpants  The First Epic Movie (2017) - The Origin Story Scene (1 10)   Movieclips.srt'

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

const rules = {
  have: (text, search) => text.includes(search),
  contains: (text, searchTerm) => {
    return text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi'))
    return text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi'))
  },
  endsWith: (text, searchTerm) => {
    return text.endsWith(searchTerm)
    return text.match(new RegExp('\\b' + searchTerm + '\\b$', 'gi'))
  },
  startsWith: (text, searchTerm) => {
    return text.match(new RegExp('^\\b' + searchTerm + '\\b', 'gi'))
    return text.match(new RegExp('^\\b' + searchTerm + '\\b', 'gi'))
  },
}

// async function main() {
//   const cenaSrt = await readSrt(path.join(__dirname, 'cena.srt'))
//   cenaSrt.forEach(sentenceSrt => {
//     // console.log(sentenceSrt.text)
//     sentenceSrt.text = sentenceSrt.text.replace(/\n/g, ' ')
//     const words = sentenceSrt.text.toLowerCase().match(/[a-zA-Z][’'a-zA-Z]*/gi)

//     words.forEach((word, index) => {
//       const search = `${words[index - 1] ? words[index - 1] : ''} ${word} mean`
//       // console.log(word)
//       findSceneWith(
//         // './netflix srt',
//         './meSrt',
//         {
//           contains: ,
//           // contains: `no matter what is`,
//           // endsWith: 'to?',
//         },
//         [],
//         { onlyLiteral: true }
//       )
//     })
//     return
//   })
// }
// main()

findSceneWith(
  // '../netflix srt',
  './meSrt',
  {
    contains: 'to someone is',
    // contains: `no matter what is`,
    // endsWith: 'to?',
  },
  []
  // { onlyLiteral: true }
)
