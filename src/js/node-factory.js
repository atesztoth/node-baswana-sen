module.exports = ({ id, level, clusterId, cyInstance }) => {
  const node = {
    id,
    cluster: {
      id: clusterId,
      level,
    },
  }
  node.paint = function () {
    cyInstance.filter(`node#${ id }`).
               addClass(`cluster-${ this.cluster.level }`)
  }.bind(node)
  return node
}
