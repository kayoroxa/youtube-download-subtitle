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