/* eslint-disable line-comment-position,no-inline-comments */
module.exports = ({
  k,
  nodes,
  edges,
  randomSupplier,
  shouldYield,
  postman, // event deliverer
}) => function *() {
  const H = [] // final spanner
  const internalRandom = randomSupplier(Math.pow(1 / nodes.length, 1 / k))
  nodes.forEach(x => x.paint())
  postman()
  edges[0].mark()
  yield 'Ready!'
  for (let i = 1; i <= k - 1; i++) {
    // Signing a cluster for reaching next level
    if (shouldYield) yield 'Marking clusters...'
    nodes.forEach(n => {
      if (!internalRandom()) return
      n.cluster.level = i
      n.paint()
    })
    postman()
    // node.cluster.level === i-1 => the node is unsigned!
    // also giving them a nice red color to sign that, they are unsigned!
    const unclusteredNodes = nodes.filter(n => n.cluster.level === i - 1).map(n => {
      n.removePaint()
      n.markAsUnSigned()
      return n
    })
    // edges to all other szomszéd clusters
    for (let j = 0; j < unclusteredNodes.length; j++) {
      const { id, cluster: { id: ownClusterId } } = unclusteredNodes[j]
      const edgesToOtherClusters = edges.filter(({ source, target }) => {
        if (id === source || id === target) {
          const otherNode = nodes.find(({ id: otherId }) => otherId === (id === source ? target : source))
          return otherNode.cluster.id !== ownClusterId
        }
        return false
      })
      console.info(`edgesToOtherClusters: ${ id }`, edgesToOtherClusters)
      yield 'Marking edges to other clusters...'
      edgesToOtherClusters.forEach(e => e.mark())
      // Show, which edges they are!
      console.info(edgesToOtherClusters)
      // Sort them edges!
    }

    const Qv = []
    if (shouldYield) yield 'Qv created'
    console.info(Qv)
  }
}
