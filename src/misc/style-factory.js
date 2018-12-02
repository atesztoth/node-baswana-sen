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
}))
