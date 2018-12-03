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
          // todo: create general function for finding other node (no time now)
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
      // transformign to format: { clusterid: [edges] }
      const sortableFormat = edgesToOtherClusters.reduce((a, c) => {
        const { source, target } = c
        const destCid = nodes.find(({ id: otherId }) => otherId === (id === source ? target : source)).cluster.id
        a[destCid] = a[destCid] ? a[destCid].concat(c) : [c]
        return a
      }, {})
      // Sort them edges!
      const sorted = Object.keys(sortableFormat).reduce((a, c) => {
        a[c] = sortableFormat[c].sort((x, y) => x.weight - y.weight) // todo: make it able to handle unweighted case!
        return a
      }, {})
      console.info('sorted edges to others: ', sorted)
      yield 'Check results! Next step: show Qv'
      const Qv = Object.keys(sorted).map(key => sorted[key][0])
      console.info(Qv)
      yield 'Checking if we have any signed neighbours'
      // Also giving a distance property for later use:
      const signedNeighbours = Qv.map(({ target, source, weight }) => {
        const otherNode = nodes.find(({ id: otherId }) => otherId === (id === source ? target : source))
        return Object.assign({}, otherNode, { distance: weight })
      }).filter(({ cluster: { level } }) => level === i)
      console.info('Nodes in signed clusters: ', signedNeighbours)
      if (signedNeighbours.length < 1) {
        H.push(Qv)
      } else {
        // eslint-disable-next-line
        const closestNode = signedNeighbours.sort((x, y) => x.distance - y.distance)[0]
        yield `Chosen node: ${ closestNode.id }`
        console.info(`Joining cluster: ${ closestNode.cluster.id }`)
        // finding the joining edge:
        const { id: closestNodeId } = closestNode
        const edgeIJoinedBy = edges.filter(({ source, target }) =>
          (id === target || id === source) && (closestNodeId === target || closestNodeId === source))
        H.push(edgeIJoinedBy)
        nodes[i].removePaint()
        nodes[i].cluster.id = closestNode.cluster.id
        nodes[i].paint()
        yield `Adding every edge to H that is shorter than: {${ nodes[i].id }, ${ closestNode.id }}`
        const shortestToSomeClusters = Qv.filter(({ weight, id: edgeId }) =>
          weight < closestNode.distance && edgeId !== edgeIJoinedBy.id)
        H.push(shortestToSomeClusters)
      }

      yield 'Last step'
      // Every node adds an edge to H which is the shortest between it and a neighboor cluster of the final clustering
      yield 'No last step lol'
    }

    const Qv = []
    if (shouldYield) yield 'Qv created'
    console.info(Qv)
  }
}
