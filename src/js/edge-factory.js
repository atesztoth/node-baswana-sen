module.exports = ({ id, source, target, cyInstance }) => {
  const edge = {
    id,
    source,
    target,
  }
  edge.mark = function () {
    console.info('mark edge: ', id)
    cyInstance.filter(`edge#${ id }`).addClass('red-edge')
  }
  edge.unmark = function () {
    cyInstance.filter(`edge#${ id }`).removeClass('red-edge')
  }
  return edge
}
