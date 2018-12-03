module.exports = ({ id, source, target, weight, cyInstance }) => {
  const edge = {
    id,
    source,
    target,
    weight,
  }
  edge.mark = function () {
    cyInstance.filter(`edge#${ id }`).addClass('red-edge')
  }
  edge.unmark = function () {
    cyInstance.filter(`edge#${ id }`).removeClass('red-edge')
  }
  return edge
}
