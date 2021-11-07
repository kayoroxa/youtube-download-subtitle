const _ = require('lodash')

const verbs = [
  // 'can',
  'make',
  'have',
  'want',
  'see',
  'do',
  'ask',
  'take',
  'say',
  // 'think',
]

const vTraduções = [
  // 'pode',
  'faz',
  'tem',
  'quer',
  'vê',
  'faz',
  'pede',
  'pega',
  'diz',
  // 'pensa',
]

const objects = ['bike', 'car', 'house', 'cat', 'dog']
const oTranslations = ['bicicleta', 'carro', 'casa', 'gato', 'cachorro']

const persons = ['I', 'you', 'he', 'she', 'it', 'we', 'they']
const pTranslations = ['eu', 'você', 'ele', 'ela', 'isso', 'nós', 'eles']

function generatePhrase() {
  const verb = _.sample(verbs)
  const vTradução = vTraduções[_.indexOf(verbs, verb)]

  const person = _.sample(persons)
  const pTradução = pTranslations[_.indexOf(persons, person)]

  const obj = _.sample(objects)
  const oTradução = oTranslations[_.indexOf(objects, obj)]
  const isHeSheIt = person.match(/\b(he|she|it)\b/gi)?.length > 0

  const phrase = `${person} ${verb}${isHeSheIt ? 's' : ''} a ${obj}`
  const translation = `${pTradução} ${vTradução} um ${oTradução}`

  return { phrase, translation }
}

for (let c = 0; c <= 20; c++) {
  const { phrase, translation } = generatePhrase()
  console.log(phrase + '\n' + translation + '\n')
}
