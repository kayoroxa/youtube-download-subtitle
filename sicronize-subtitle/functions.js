const parser = require('subtitles-parser')
const fs = require('fs')
const joinPath = require('path').join
const { compareTwoStrings, findBestMatch } = require('string-similarity')

const makePath = path => joinPath(__dirname, path)
function readSrt(path) {
  const srtPath = makePath(path)
  const srtFile = fs.readFileSync(srtPath, 'utf8')
  return parser.fromSrt(srtFile, true)
}

function getBestMatchIndex(text, arrayTexts) {
  return findBestMatch(text, arrayTexts)
}

function medianNumbers(numbers) {
  const median = numbers.length / 2
  const sortedNumbers = numbers.sort((a, b) => a - b)
  return numbers.length % 2 !== 0
    ? sortedNumbers[median]
    : (sortedNumbers[median - 1] + sortedNumbers[median]) / 2
}

function findSyncTimeSrtMovie(srtYoutube, srtMovie) {
  const srtMovieOnlyText = srtMovie.map(item => item.text)
  const srtYoutubeOnlyText = srtYoutube.map(item => item.text)
  function findTextYoutubeOnMovie(srtYoutubeText, srtMovieOnlyText) {
    const best = getBestMatchIndex(srtYoutubeText, srtMovieOnlyText)

    const indexMovieSrt = srtMovie
      .map(v => v.text)
      .indexOf(best.bestMatch.target)

    const indexYoutubeSrt = srtYoutube.map(v => v.text).indexOf(srtYoutubeText)

    const startCoringa = srtYoutube[indexYoutubeSrt].startTime
    const endCoringa = srtYoutube[indexYoutubeSrt].endTime
    const coringa =
      srtMovie[indexMovieSrt].startTime - srtYoutube[indexYoutubeSrt].startTime
    return {
      ...best.bestMatch,
      bestMatchIndex: best.bestMatchIndex,
      search: srtYoutubeText,
      // startMovie: srtMovie[indexMovieSrt].startTime,
      // endMovie: srtMovie[indexMovieSrt].endTime,
      // startCoringa,
      // endCoringa,
      coringa,
      // startYoutube: srtYoutube[indexYoutubeSrt].startTime,
      // endYoutube: srtYoutube[indexYoutubeSrt].endTime,
      startCalc: srtMovie[indexMovieSrt].startTime - coringa,
      endCalc: srtMovie[indexMovieSrt].endTime - coringa,
    }
  }

  return srtYoutubeOnlyText
    .map(v => findTextYoutubeOnMovie(v, srtMovieOnlyText))
    .filter(v => v.rating > 0.7 && v.search.length > 25 && v.target.length > 25)
    .reduce(
      (acc, v) => {
        if (v.rating > acc.rating) return v
        return acc
      },
      { rating: 0 }
    )
  // return best
}

// console.log(medianNumbers([1, 1, 10, 6, 4, 8, 7, 9]))
module.exports = {
  readSrt,
  getBestMatchIndex,
  medianNumbers,
  findSyncTimeSrtMovie,
}
