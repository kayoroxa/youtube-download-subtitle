const fs = require('fs')
const ytdl = require('ytdl-core')

ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ', {
  format: 'mp4',
})
  .on('progress', (length, downloaded, totalLength) => {
    const progress = (downloaded / totalLength) * 1000
    console.log(Math.round(progress) + '%') // not logging
  })
  .pipe(fs.createWriteStream('myvideo.mp4'))
