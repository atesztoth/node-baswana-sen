/* eslint-disable quote-props */
module.exports = cyInstance => ({
  clusterNodes: (nodes, cluster) => nodes.forEach(({ id }) => cyInstance.nodes(`[id="${ id }"]`).addClass(cluster))
})
