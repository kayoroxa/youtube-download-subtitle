module.exports = {
  removeDuplicates: function (arr) {
    return arr.filter((elem, pos, arr) => arr.indexOf(elem) == pos)
  },
  pushUnique: function (arr, elem) {
    if (arr.indexOf(elem) == -1) arr.push(elem)
    return arr
  },
  removeFromArray: function (arr, elem) {
    let index = arr.indexOf(elem)
    if (index > -1) arr.splice(index, 1)
    return arr
  },
  removeItemsFromArray: function (arr, items) {
    items.forEach(item => {
      this.removeFromArray(arr, item)
    })
    return arr
  },
}
