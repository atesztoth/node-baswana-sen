const randomColor = require('./random-color')
module.exports = nodeNumber => {
  const defClusterColors = [
    '#001c49',
    '#f4df42',
    '#00576d',
    '#98f442',
    '#f4ad49',
  ]
  const colors = [
    {
      selector: 'node',
      style: {
        'label': 'data(id)',
        'background-color': 'gray',
      }
    },
    {
      selector: 'node.cluster-unsigned',
      style: {
        'background-color': '#ff1d00',
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge.final',
      style: {
        'label': 'data(id)',
        'line-color': '#2ead00',
      }
    },
    {
      selector: 'edge.red-edge',
      style: {
        'label': 'data(weight)',
        'line-color': '#ff1d00',
      }
    }
  ].concat(defClusterColors.map((x, i) => ({
      selector: `node.cluster-${ i }`,
      style: {
        'background-color': x,
      }
    })))

  const diff = nodeNumber - defClusterColors.length
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      colors.push({
        selector: `node.cluster-${ defClusterColors.length + i }`,
        style: {
          'background-color': randomColor(),
        }
      })
    }
  }

  console.info('colors: ', colors)
  return colors
}

