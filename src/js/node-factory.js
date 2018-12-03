module.exports = ({ id, level, clusterId, cyInstance }) => {
  const node = {
    id,
    cluster: {
      id: clusterId,
      level,
    },
  }
  node.paint = function () {
    cyInstance.filter(`node#${ id }`).addClass(`cluster-${ this.cluster.id }`)
  }.bind(node)
  node.removePaint = function() {
    cyInstance.filter(`node#${ id }`).removeClass(`cluster-${ this.cluster.id }`)
  }.bind(node)
  node.markAsUnSigned = function () {
    cyInstance.filter(`node#${ id }`).addClass('cluster-unsigned')
  }
  return node
}
