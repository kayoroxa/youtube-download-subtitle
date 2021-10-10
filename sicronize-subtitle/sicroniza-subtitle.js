const parser = require('subtitles-parser')
const fs = require('fs')
const joinPath = require('path').join

const {
  readSrt,
  getBestMatchIndex,
  findSyncTimeSrtMovie,
} = require('./functions')

const dataSrtMovie = readSrt('./movie.srt')
const dataSrtYoutube = readSrt(
  '../srt/Now You See Me 2 (2016) - So Happy to Be Working With You Scene (4 11)   Movieclips.srt'
)

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
  const srt = parser.toSrt(dataSrt)
  fs.writeFileSync(joinPath(__dirname, fileName), srt)
}
exportSrtFile(dataSrtMovieCut, 'movie-cut.srt')
