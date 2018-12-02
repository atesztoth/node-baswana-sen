module.exports = [
  '#001c49',
  '#f4df42',
  '#00576d',
  '#98f442',
  '#f4ad49'
].map((x, i) => ({
  selector: `node.cluster-${ i }`,
  style: {
    'background-color': x,
    'label': 'data(id)'
  }
})).concat([
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
    selector: 'edge.red-edge',
    style: {
      'line-color': '#ff1d00',
    }
  }
])
