/* eslint-disable */
const cytoFactory = require('./cy-factory')
const utilsFactory = require('./utils.js')
const graph = require('../graphs/graph1')

// HTML elements
const cyContainer = document.getElementById('cy')
const startButton = document.getElementById('start-button')
const infoDiv = document.getElementById('write-info')

// Styles for CY
const styles = ['#001c49', '#43006d', '#00576d', '#98f442', '#f4ad49']
  .map((x, i) => ({
    selector: `node.cluster-${ i }`,
    style: {
      'background-color': x,
      'label': 'data(id)'
    }
  }))

// CY
const k = 4
const cyInstance = cytoFactory.createInstance(cyContainer, graph, styles)
const { clusterNodes } = utilsFactory(cyInstance)
const nodes = graph.nodes.map(({ data: { id } }) => ({ id }))
const edges = graph.edges.map(({ data: { id, source, target } }) => ({ id, source, target }))
let clusters = []

// Controls
startButton.onclick = () => {
  clusters.push(nodes)
  infoDiv.innerHTML = JSON.stringify(clusters, null, 2)
  clusterNodes(nodes, 'cluster-0')
}

