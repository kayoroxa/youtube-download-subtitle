const startNodeDataBase = require('data-base-node')
const fn = require('./functions/dbFunctions')

const db = startNodeDataBase()

// const instanciaAllYoutubeUrls = require('./allUrl.json')
const videosWithSubtitleLink = require('./videosWithSubtitleLink.json')

const videosLinkAlreadyGet = videosWithSubtitleLink
  .filter(v => v.linkYoutube || v.linkSubtitle === false)
  .map(v => 'https://www.youtube.com/watch?v=' + v.linkYoutube)

const dbBooks = db.tryLoad('allYoutubeUrls').orStartWith([])

dbBooks.setValue(v => {
  return fn.removeDuplicates(v)
})

dbBooks.setValue(v => {
  return fn.removeItemsFromArray(v, videosLinkAlreadyGet)
})

dbBooks.save()

// console.log(dbBooks.value())
