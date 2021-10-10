const OS = require('opensubtitles-api')
const fs = require('fs')
const https = require('https')

const OpenSubtitles = new OS({
  useragent: 'UserAgent',
  username: 'kayoroxa',
  password: 'zFNVj!@J9XugVzG',
  ssl: true,
})

OpenSubtitles.search({
  sublanguageid: 'eng', // Can be an array.join, 'all', or be omitted.
  extensions: ['srt'], // Accepted extensions, defaults to 'srt'.
  limit: '3', // Can be 'best', 'all' or an
  query: 'Now You See Me 2 (2016)', // Text-based query, this is not recommended.
  //  gzip: true, // returns url to gzipped subtitles, defaults to false
}).then(subtitles => {
  // an array of objects, no duplicates (ordered by
  // matching + uploader, with total downloads as fallback)
  downloadFile(subtitles.en[0].utf8, './movie.srt')
})

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const request = https.get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(resolve)
      })
    })
    request.on('error', reject)
  })
}
