module.exports = ({ k, clusters, nodes, edges, randomSupplier }) =>
  function* () {
    if (k < 1) return

    for (let i = 1; i < k - 1; i++) {
      // sign clusters with randomness:
      yield clusters.reduce((acc,curr) => randomSupplier()? , [])
    }
  }
