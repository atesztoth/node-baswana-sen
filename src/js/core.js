/* eslint-disable */

// Styles for CY, CY
const styles = require('../misc/style-factory')
const graph = require('../graphs/graph2')
const cytoFactory = require('./cy-factory')
const nodeFactory = require('./node-factory')
const edgeFactory = require('./edge-factory')
const baswanaSenGenerator = require('./baswana-sen-generator')
const { randomGenerator } = require('./utils.js')

// HTML elements
const cyContainer = document.getElementById('cy')
const nextButton = document.getElementById('start-button')
const infoDiv = document.getElementById('write-info')
const yieldedInfoDiv = document.getElementById('yielded-messages')

// INIT
const cyInstance = cytoFactory.createInstance(cyContainer, graph, styles)
const nodes = graph.nodes.map(({ data: { id } }, index) => nodeFactory({
  id,
  level: 0,
  clusterId: index,
  cyInstance,
}))
const edges = graph.edges.map(({ data: { id, source, target, weight } }) => edgeFactory({
  id,
  source,
  target,
  weight,
  cyInstance,
}))
const updateLabels = () => infoDiv.innerHTML = nodes.reduce((a, { id, cluster: { id: clusterId, level } }) =>
  a.concat(`${ id } - cluster: ${ clusterId }, level: ${ level } <br>`), '')
const baswanaSen = baswanaSenGenerator({
  k: 4,
  nodes,
  edges,
  randomSupplier: randomGenerator,
  shouldYield: false,
  postman: () => updateLabels()
})()

updateLabels()

// Controls
nextButton.onclick = () => {
  const response = baswanaSen.next().value
  yieldedInfoDiv.innerHTML = response || 'No info'
  console.info(response)
}
