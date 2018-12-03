const appFactory = require('./app-factory')

// HTML elements
const cyContainer = document.getElementById('cy')
const nextButton = document.getElementById('start-button')
const infoDiv = document.getElementById('write-info')
const yieldedInfoDiv = document.getElementById('yielded-messages')
const yieldTrigger = document.getElementById('yield-button')
const yieldInfo = document.getElementById('yield-info')

const graph = require('../graphs/graph1')
const layout = {
  name: 'preset',
  padding: 20,
  fit: true,
}

appFactory({
  cyContainer,
  nextButton,
  infoDiv,
  yieldedInfoDiv,
  graph,
  yieldTrigger,
  yieldInfo,
  layout,
})


