module.exports = [
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
].concat([
    '#001c49',
    '#f4df42',
    '#00576d',
    '#98f442',
    '#f4ad49'
  ].map((x, i) => ({
    selector: `node.cluster-${ i }`,
    style: {
      'background-color': x,
    }
  })))

