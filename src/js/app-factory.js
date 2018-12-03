const styleFactory = require('../misc/style-factory')
const cytoFactory = require('./cy-factory')
const nodeFactory = require('./node-factory')
const edgeFactory = require('./edge-factory')
const baswanaSenGenerator = require('./baswana-sen-generator')
const { randomGenerator } = require('./utils.js')

module.exports = ({ cyContainer, nextButton, infoDiv, yieldedInfoDiv, graph, yieldTrigger, yieldInfo, layout = {} }) => {
  // INIT
  const styles = styleFactory(graph.nodes.length)
  let internalShouldYield = true
  const cyInstance = cytoFactory.createInstance(cyContainer, graph, styles, layout)
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
  const updateLabels = () => {
    infoDiv.innerHTML = nodes.reduce((a, { id, cluster: { id: clusterId, level } }) =>
    a.concat(`${ id } - cluster: ${ clusterId }, level: ${ level } <br>`), '')
    yieldInfo.innerHTML = `Does yield: ${ internalShouldYield ? 'yes' : 'no' }`
  }
  const baswanaSen = baswanaSenGenerator({
    k: 4,
    nodes,
    edges,
    randomSupplier: randomGenerator,
    shouldYield: () => internalShouldYield,
    postman: () => updateLabels()
  })()

  updateLabels()

  // Controls
  nextButton.onclick = () => {
    const response = baswanaSen.next().value
    yieldedInfoDiv.innerHTML = response || 'No info'
    console.info(response)
  }

  yieldTrigger.onclick = () => {
    internalShouldYield = !internalShouldYield
    updateLabels()
  }
}
