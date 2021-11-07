const parser = require('subtitles-parser')
const fs = require('fs')
const joinPath = require('path').join

const {
  readSrt,
  getBestMatchIndex,
  findSyncTimeSrtMovie,
} = require('./functions')

const config = {
  timeOfMatchYoutube: 290 * 1000,
  range: 10 * 1000,
}

const dataSrtMovie = readSrt('./movie.srt')

const dataSrtYoutube = readSrt(
  '../srt/HOTEL TRANSYLVANIA 2 All Movie Clips (2015).srt'
).filter(
  item =>
    item.startTime >= config.timeOfMatchYoutube - config.range / 2 &&
    item.endTime <= config.timeOfMatchYoutube + config.range / 2
)

console.log(dataSrtYoutube)

const { coringa, bestMatchIndex, search } = findSyncTimeSrtMovie(
  dataSrtYoutube,
  dataSrtMovie
)

//const videoDuration = 308400

const dataSrtMovieTimeSync = dataSrtMovie.map(v => ({
  ...v,
  startTime: v.startTime - coringa,
  endTime: v.endTime - coringa,
}))

const dataSrtMovieCut = dataSrtMovieTimeSync
  .filter(v => v.startTime >= 0)
  .map((v, i) => ({ ...v, id: i + 1 }))

console.log({ dataSrtMovieTimeSync })
console.log(dataSrtMovieCut.length)

// exportSrtFile(dataSrtMovieCut, 'movie-cut.srt')

function exportSrtFile(dataSrt, fileName) {
  // const srtString = parser.toSrt(dataSrt)
  // fs.writeFileSync(joinPath(__dirname, fileName), srtString)
  fs.writeFileSync(
    joinPath(__dirname, fileName),
    `var videoSrt = ${JSON.stringify(dataSrt, null, 2)}`
  )
}
exportSrtFile(dataSrtMovieCut, 'videoSrt.js')
