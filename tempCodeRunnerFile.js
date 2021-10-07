const roles = {
  contains: (text, x) =>
    v.text.match(new RegExp('\\b' + searchTerm + '\\b', 'gi')),
  endsWith: (text, x) => v.text.endsWith(searchTerm),
  startsWith: (text, x) => v.text.startsWith(searchTerm),
}
console.log(typeof roles === 'object')