/* eslint-disable */

// Styles for CY, CY
const styles = require('../misc/style-factory')
const graph = require('../graphs/graph1')
const cytoFactory = require('./cy-factory')
const nodeFactory = require('./node-factory')
const baswanaSenGenerator = require('./baswana-sen-generator')
const { updateClusterInfo, randomGenerator } = require('./utils.js')

// HTML elements
const cyContainer = document.getElementById('cy')
const nextButton = document.getElementById('start-button')
const infoDiv = document.getElementById('write-info')

// INIT
const cyInstance = cytoFactory.createInstance(cyContainer, graph, styles)
const nodes = graph.nodes.map(({ data: { id } }, index) => nodeFactory({
  id,
  level: 0,
  clusterId: index,
  cyInstance
}))
const edges = graph.edges.map(({ data: { id, source, target } }) => ({
  id,
  source,
  target,
}))
const baswanaSen = baswanaSenGenerator({
  k: 4,
  nodes,
  edges,
  randomSupplier: randomGenerator,
  shouldYield: true
})()

// Controls
nextButton.onclick = () => {
  const response = baswanaSen.next().value
  console.info(response)
}

