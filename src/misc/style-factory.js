module.exports = [
  '#001c49',
  '#43006d',
  '#00576d',
  '#98f442',
  '#f4ad49'
].map((x, i) => ({
  selector: `node.cluster-${ i }`,
  style: {
    'background-color': x,
    'label': 'data(id)'
  }
}))
