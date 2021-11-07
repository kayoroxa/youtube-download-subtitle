const _ = require('lodash')
const readlineSync = require('readline-sync')
const fs = require('fs')

const dict = {
  p: [
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    // 'who',

    // 'which',
  ],
  v: ['eat', 'do', 'have', 'see', 'say', 'be'],
  wq: ['what', 'where', 'when', 'why'],
  othersP: ['my mom', 'these same dog', 'one of them'],
  p2: ['i', 'you', 'her', 'him', 'it', 'us', 'them'],
  situation: ['safe', 'dead', 'nice'],
  adjective: ['big', 'small', 'tall', 'short', 'long', 'weak', 'important'],
  posse: ['daughter', 'son', 'house', 'guitar'],
  pPosse: ['my', 'your', 'his', 'her', 'its', 'our', 'their'],
  // noun: ['dog', 'cat', 'house', 'car', 'tree'],
  // adverb: ['slowly', 'quickly', 'well', 'badly', 'well'],
  // preposition: ['to', 'from', 'on', 'in', 'of'],
}

function putCodigo(sentence) {
  const hasIYouTheyWe =
    sentence.match(/\bi\b/) ||
    sentence.match(/\byou\b/) ||
    sentence.match(/\bthey\b/) ||
    sentence.match(/\bwe\b/)
  if (!hasIYouTheyWe)
    return sentence.replace(/\sc\s/g, ` ${_.sample(['does'])} `)
  else return sentence.replace(/\sc\s/g, ` ${_.sample(['do'])} `)
}

function generate(pattern) {
  const patternSplitted = pattern.split(' ')
  let isQuestion = false
  let makeIt = patternSplitted.map((block, index) => {
    let result = ''

    if (block.includes('*')) {
      const showCondicional = _.sample([true, false])
      if (!showCondicional) return ''
    }
    if (block.includes('|')) {
      const blockSplitted = block.split('|')
      block = _.sample(blockSplitted)
    }

    if (block.includes('wq')) isQuestion = true

    const blockSanitized = block.replace(/[\*|\{|\}]/g, '')
    const blockSplitted = blockSanitized.split('-')
    const hasMultiple = blockSplitted.length > 1
    result = hasMultiple
      ? blockSplitted
          .map(miniBlock => _.sample(dict[miniBlock]) || miniBlock)
          .join(' ')
      : _.sample(dict[blockSanitized]) || ''

    return result === '' ? block.replace(/\*/, '') : result
  })
  const retornar = putCodigo(makeIt.join(' ').trim())
  // if (isQuestion) return retornar + '?'
  return (
    retornar.replace(/\s\s/, ' ') +
    (isQuestion && !retornar.includes('?') ? '?' : '')
  )
}

const patternsDict = [
  // {text : `{p|othersP} may not end up being {adjective}`, translation: ``},
  // {text : `{p|othersP} should|shouldn't {v} ___`, translation: ``},
  {
    text: `{*wq} should|shouldn't {p|othersP} {v} ___?`,
    translation: `{*wq} {p|othersP} deveria|não deveria  {v} ___?`,
  },
  {
    text: `{p|othersP} would have been {situation|adjective}`,
    translation: `{p|othersP} teria sido {situation|adjective}`,
  },
  {
    text: `{p|othersP} may have been {situation|adjective}`,
    translation: `{p|othersP} pode ter sido|estado {situation}`,
  },
  {
    text: `{p|othersP} just wish {p2|othersP} could {v} ___`,
    translation: `{p|othersP} só gostaria que {p2|othersP} pudesse {v} ___`,
  },
  {
    text: `{p|othersP} will {v} a lot of more than {p2|othersP}`,
    translation: `{p|othersP} "vai" {v} mais do que {p2|othersP}`,
  },
  {
    text: `{c|?} {p|othersP} think {p|othersP} *will {v}`,
    translation: `{p|othersP} acha que {p|othersP} *will {v}`,
  },
  {
    text: `{c|?} {p|othersP} think {p|othersP} *will *already has||have ____`,
    translation: `{p|othersP} acha que {p|othersP} *"vai" *já ter ____`,
  },
  {
    text: `so far as {p} {v}`,
    translation: `tão longe quanto {p} {v}`,
  },
  {
    text: `as far as {p} am concerned`,
    translation: `no que {p} diz respeito`,
  },
  {
    text: `nothing is as {adjective} as {pPosse} {posse}`,
    translation: `nada é tão {adjective} quanto {pPosse} {posse}`,
  },
  {
    text: `*would|c {p} mind if {p} {v} ____`,
    translation: `"ria"|c {p} ligaria se {p} {v} ____`,
  },
  {
    text: `{wq} {c} {p} {v}?`,
    translation: ``,
  },
  {
    text: `have|haven't {p} ever {v3}?`,
    translation: `{você} já|num já {v3}?`,
  },
  {
    text: `just when {p} thought {p} ____`,
    translation: `quando {você} acha que {ele}___`,
  },
]
const patterns = patternsDict.map(pattern => pattern.text)

function getAllSentence(number) {
  const allGenerator = patterns.map(pattern => {
    const result = []
    for (let i = 0; i < 10; i++) {
      const sentence = generate(pattern)
      if (!result.includes(sentence)) result.push(sentence)
    }
    return result
  })

  const allSentences = _.concat(...allGenerator)

  console.log({
    quantidadeFrases: allSentences.length,
    quantidadePalavras: Object.keys(dict).reduce((acc, key) => {
      return acc + dict[key].length
    }, 0),
  })

  return allSentences
}

// const texto = _.shuffle(patternsDict)
//   .slice(0, 5)
//   .reduce((acc, pattern) => {
//     const juntador = _.sample([
//       ' and ',
//       ' cause ',
//       ' even though ',
//       ' perhaps ',
//       ' that means ',
//       ', ',
//       ', ',
//       ', ',
//       ', ',
//       '.\n',
//       '.\n',
//       '.\n',
//     ])

//     // const sentence = generate(pattern)
//     console.clear()
//     // console.log('\n'.repeat(20))
//     console.log('Texto Completo: ', acc)
//     console.log('---------------')

//     console.log(pattern.text)
//     console.log(pattern.translation)
//     console.log('---------------')
//     const sentence = readlineSync.question('=> ')
//     if (acc.length === 0) return sentence
//     return acc + ' ' + sentence
//     // return acc + juntador + sentence
//   }, '')

// const otherTexto = Array(10)
//   .fill('')
//   .reduce(acc => {
//     console.clear()
//     const pattern = _.sample(patternsDict)
//     console.log('Texto Completo: ', acc)
//     console.log('---------------')
//     console.log(pattern.text)
//     console.log(pattern.translation)
//     console.log('---------------')
//     const pattern2 = _.sample(patternsDict)
//     console.log(pattern2.text)
//     console.log(pattern2.translation)
//     console.log('---------------')
//     const sentence = readlineSync.question('=> ')
//     if (acc.length === 0) return sentence
//     return acc + ' ' + sentence
//   }, '')

// console.log('='.repeat(30))
// console.log(otherTexto)

const allSentences = getAllSentence(10)
fs.writeFileSync('./output.txt', allSentences.join('\n'))
