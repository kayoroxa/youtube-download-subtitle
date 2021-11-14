const brain = require('brain.js')

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
}

// create a simple feed forward neural network with backpropagation
const net = new brain.recurrent.LSTM(config)

net.train([
  { input: 'take away means', output: 'take away' },
  { input: 'tip someone is', output: 'tip' },
  { input: 'sneak is to', output: 'sneak' },
])

const output = net.run('make is when someone') // [0.987]
console.log(output)
