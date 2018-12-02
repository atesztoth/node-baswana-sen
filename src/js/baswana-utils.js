module.exports = (nodes, edges, getLevel) => ({
  unclusteredNodes: () => nodes.filter(n => n.cluster.level === getLevel() - 1),

})
