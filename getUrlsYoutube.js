document.querySelector('#copy').remove()
let urls = [...document.querySelectorAll('a#thumbnail')].map(
  v => 'https://www.youtube.com' + v.getAttribute('href')?.replace(/&.*/g, '')
)

copy(urls)
