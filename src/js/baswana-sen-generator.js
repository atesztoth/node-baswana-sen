

module.exports = ({
  k,
  nodes,
  edges,
  randomSupplier,
  shouldYield
}) => function *() {
  yield 'Starting'
  const internalRandom = randomSupplier(Math.pow(1 / nodes.length, 1 / k))
  console.info('Initial clustering...')
  nodes.forEach(x => x.paint())
  console.info('Done')
  for (let i = 1; i <= k - 1; i++) {
    // Signing a cluster for reaching next level
    if (shouldYield) yield 'Signing and coloring vertices'
    nodes.forEach(n => {
      if (!internalRandom()) return
      console.info('Called for node: ', n.id)
      console.info('cluster level: ', i)
      n.cluster.level = i
      n.paint()
    })
    if (shouldYield) yield 'Creating Qv...'
    // node.cluster.level === i-1 => the node is unsigned!
    const exampleNode = nodes.filter(n => n.cluster.level === i - 1)[0]
    // edges to all other szomszéd clusters
    const edgesToOtherClusters = edges
    .filter(e => {
      const targetNode = nodes.find(({ id }) => e.target === id)
      return e.source === exampleNode.id &&
        targetNode.cluster.level >= i - 1 &&
        targetNode.cluster.id !== exampleNode.cluster.id
    })
    console.info('edges to other cs:', edgesToOtherClusters)
    const Qv = []
    if (shouldYield) yield 'Qv created'
    console.info(Qv)
  }
}
