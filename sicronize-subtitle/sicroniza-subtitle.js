const parser = require('subtitles-parser')
const fs = require('fs')
const joinPath = require('path').join

const {
  readSrt,
  getBestMatchIndex,
  findSyncTimeSrtMovie,
} = require('./functions')

const dataSrtMovie = readSrt('./movie.srt')
const dataSrtYoutube = readSrt('./youtube.srt')

const { coringa, bestMatchIndex, search } = findSyncTimeSrtMovie(
  dataSrtYoutube,
  dataSrtMovie
)

const videoDuration = 308400

const dataSrtMovieTimeSync = dataSrtMovie.map(v => ({
  ...v,
  startTime: v.startTime - coringa,
  endTime: v.endTime - coringa,
}))

const dataSrtMovieCut = dataSrtMovieTimeSync
  .filter(v => v.startTime >= 0 && v.endTime <= videoDuration)
  .map((v, i) => ({ ...v, id: i + 1 }))
console.log(dataSrtYoutube[44], dataSrtYoutube[45])
console.log(coringa, coringa)
// console.log({ bestMatchIndex, search })

console.log(dataSrtMovieTimeSync[583], dataSrtMovieTimeSync[584])

console.log(dataSrtMovieCut.length)

// exportSrtFile(dataSrtMovieCut, 'movie-cut.srt')

function exportSrtFile(dataSrt, fileName) {
  const srt = parser.toSrt(dataSrt)
  fs.writeFileSync(joinPath(__dirname, fileName), srt)
}
exportSrtFile(dataSrtMovieCut, 'movie-cut.srt')
