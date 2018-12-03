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
  if (shouldYield) yield 'Will show initial clustering'
  nodes.forEach(x => x.paint())
  postman()
  if (shouldYield) yield 'Will start iterating'
  for (let i = 1; i <= k - 1; i++) {
    // Signing a cluster for reaching next level
    const existingClusters = nodes.map(({ cluster: { id } }) => id).filter((v, ind, a) => a.indexOf(v) === ind)
    // Marking clusters
    existingClusters.forEach(eCluster => {
      if (!internalRandom()) return
      nodes.filter(x => x.cluster.id === eCluster).forEach(n => {
          n.removePaint()
          n.cluster.level = i
          n.paint()
        })
      console.info('Cluster made it: ', eCluster)
    })
    postman()
    // node.cluster.level === i-1 => the node is unsigned!
    // also giving them a nice red color to sign that, they are unsigned!
    const unclusteredNodes = nodes.filter(n => n.cluster.level === i - 1).map(n => {
      n.removePaint()
      n.markAsUnSigned()
      return n
    })
    yield 'Check marked clusters!'
    // edges to all other szomszéd clusters
    for (let j = 0; j < unclusteredNodes.length; j++) {
      const { id, cluster: { id: ownClusterId } } = unclusteredNodes[j]
      const edgesToOtherClusters = edges.filter(({ source, target }) => {
        if (id === source || id === target) {
          const otherNode = nodes.find(({ id: otherId }) => otherId === (id === source ? target : source))
          return otherNode.cluster.id !== ownClusterId && (otherNode.cluster.level === i || otherNode.cluster.level === i - 1)
        }
        return false
      })
      console.info(`edgesToOtherClusters: ${ id }`, edgesToOtherClusters)
      yield 'Will mark edges to other clusters'
      edgesToOtherClusters.forEach(e => e.mark())
      // Show, which edges they are!
      console.info('Edges to other clusters: ', edgesToOtherClusters)
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
      if (shouldYield) yield 'Check results! Next step: show Qv'
      const Qv = Object.keys(sorted).map(key => sorted[key][0])
      console.info('Qv: ', Qv)
      if (shouldYield) yield `Qv: ${ JSON.stringify(Qv, null, 2) }`
      if (shouldYield) yield 'Checking if we have any signed neighbours'
      // Also giving a distance property for later use:
      const signedNeighbours = Qv.map(({ target, source, weight }) => {
        const otherNode = nodes.find(({ id: otherId }) => otherId === (id === source ? target : source))
        return Object.assign({}, otherNode, { distance: weight })
      }).filter(({ cluster: { level } }) => level === i)
      console.info('Nodes in signed clusters: ', signedNeighbours)
      // b. part of the algorithm
      if (signedNeighbours.length < 1) {
        if (shouldYield) yield 'Did not find signed neighbours'
        H.push(Qv)
        postman()
      } else {
        if (shouldYield) yield 'Found signed neighbour clusters'
        // eslint-disable-next-line
        const closestNode = signedNeighbours.sort((x, y) => x.distance - y.distance)[0]
        if (shouldYield) yield `Chosen node: ${ closestNode.id }`
        console.info(`Joining cluster: ${ closestNode.cluster.id }`)
        // finding the joining edge:
        const { id: closestNodeId } = closestNode
        const edgeIJoinedBy = edges.filter(({ source, target }) =>
          (id === target || id === source) && (closestNodeId === target || closestNodeId === source))
        H.push(edgeIJoinedBy)
        unclusteredNodes[j].removePaint()
        unclusteredNodes[j].cluster.level = closestNode.cluster.level
        unclusteredNodes[j].cluster.id = closestNode.cluster.id
        unclusteredNodes[j].paint()
        postman()
        if (shouldYield) yield `Adding every edge to H that is shorter than: {${ unclusteredNodes[j].id }, ${ closestNode.id }}`
        const shortestToSomeClusters = Qv.filter(({ weight, id: edgeId }) =>
          weight < closestNode.distance && edgeId !== edgeIJoinedBy.id)
        H.push(shortestToSomeClusters)
        if (shouldYield) yield 'Cleaning up'
        edges.forEach(edge => edge.unmark())
        unclusteredNodes.filter(({ cluster: { level } }) => level !== closestNode.cluster.level).forEach(node => node.removePaint())
        console.info('H:', H)
        if (shouldYield) yield 'Showing H'
        H.flatMap(x => x).forEach(edge => edge.mark())
        if (shouldYield) yield 'Showing H, will unmark on next click'
        H.flatMap(x => x).forEach(edge => edge.unmark())
      }
    } // end of looping through unsigned nodes of current iteration
  } // end of main iteration

  // Every node adds an edge to H which is the shortest between it and a neighboor cluster of the final clustering
  if (nodes.filter(({ cluster: { level } }) => level === k - 1).length > 0) {
    // If they even exist! There's a possibility, no cluster makes till this level.
    nodes.forEach(n => {
      const neighboorKnodes = nodes.filter(({ id: nid, cluster: { level: nlevel } }) => n.cluster.id !== nid && nlevel === k - 1)
        .filter(({ id: pId }) => edges.find(({ source, target }) => (source === n.id && target === pId) || (target === n.id && source === pId)))

      if (neighboorKnodes.length < 1) return

      const distances = neighboorKnodes.reduce((a, c) => {
        const { cluster: { id: cCid } } = c
        const edge = edges.find(({ target, source }) => (source === n.id && target === cCid) || (target === n.id && source === cCid))
        if (!edge) return a
        const { weight } = edge
        a[c.cluster.id] = a[c.cluster.id] ? a[c.cluster.id].push({ node: c, distance: weight }) : [{ node: c, distance: weight }]
        return a
      }, {})

      const sortedByDist = Object.keys(distances).reduce((a, c) => {
        a[c] = distances[c].sort((x, y) => x.distance - y.distance)
        return a
      }, {})

      console.info(`Sorted by distances from ${ n.id }`, sortedByDist)

      Object.keys(sortedByDist).forEach(key => {
        if (!sortedByDist[key].length > 0) return
        H.push(sortedByDist[key][0])
      })
    })
  }
  if (shouldYield) yield 'Will show final H'
  H.flatMap(x => x).forEach(edge => edge.finalColor())
  if (shouldYield) yield 'Finished'
}
