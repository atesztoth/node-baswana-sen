module.exports = ({
  k,
  nodes,
  edges,
  randomSupplier,
  verticePainter,
  shouldYield
}) => function* () {
  yield 'Starting'
  const clusters = []
  const internalRandom = randomSupplier(Math.pow(1 / nodes.length, 1 / k))
  clusters[0] = nodes.map(x => [x])
  verticePainter(nodes, 0)
  for (let i = 0; i < k - 1; i++) {
    // SELECTING CLUSTERS WITH APPROPRIATE PROBABILITY SUPPLIED BY randomSupplier
    // eslint-disable-next-line
    clusters[i + 1] = clusters[i].reduce((a, c) => internalRandom() ? a.concat(c) : a, [])
    // Before colouring our selected vertices, yielding a stop if needed:
    if (shouldYield) yield 'Color vertices'
    verticePainter(clusters[i + 1].flatMap(x => x), i + 1)
    return
  }
}
