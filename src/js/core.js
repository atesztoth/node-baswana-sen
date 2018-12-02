/* eslint-disable */

// Styles for CY, CY
const styles = require('../misc/style-factory')
const graph = require('../graphs/graph1')
const cytoFactory = require('./cy-factory')
const baswanaSenGenerator = require('./baswana-sen-generator')
const { updateClusterInfo, randomGenerator } = require('./utils.js')

// HTML elements
const cyContainer = document.getElementById('cy')
const nextButton = document.getElementById('start-button')
const infoDiv = document.getElementById('write-info')

// Preparation
const verticePainter = (vertices, k) => {
  cyInstance.filter(vertices
             .reduce((a, c) => a.concat(`node#${ c.id },`), '').slice(0, -1)
  ).forEach(v => v.addClass(`cluster-${ k }`))
}
const nodes = graph.nodes.map(({ data: { id } }) => ({ id }))
const edges = graph.edges.map(({ data: { id, source, target } }) => ({
  id,
  source,
  target
}))

// INIT
console.info('DIK GECI', styles)
const cyInstance = cytoFactory.createInstance(cyContainer, graph, styles)
const baswanaSen = baswanaSenGenerator({
  k: 4,
  nodes,
  edges,
  verticePainter,
  randomSupplier: randomGenerator,
  shouldYield: true
})()

// Controls
nextButton.onclick = () => {
  const response = baswanaSen.next().value
  console.info(response)
}

