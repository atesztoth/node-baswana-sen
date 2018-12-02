

module.exports = ({
  k,
  nodes,
  edges,
  randomSupplier,
  verticePainter,
  shouldYield
}) => function *() {
  yield 'Starting'
  const clusters = []
  const internalRandom = randomSupplier(Math.pow(1 / nodes.length, 1 / k))
  clusters[0] = nodes.map(x => [x])
  verticePainter(nodes, 0)
  for (let i = 0; i < k - 1; i++) {
    // eslint-disable-next-line
    clusters[i + 1] = clusters[i].reduce((a, c) => internalRandom() ? a.concat(c) : a, [])
    // Before colouring our selected vertices, yielding a stop if needed:
    if (shouldYield) yield 'Color signed vertices'
    const signedVertices = clusters[i + 1].flatMap(x => x)
    verticePainter(signedVertices, i + 1)
    if (shouldYield) yield 'Creating Qv...'
    const unsignedVertices = clusters[i].flatMap(c => c)
      .filter(({ id }) => !signedVertices.find(s => s.id === id))
    console.info('Unsigned: ', unsignedVertices)
    const Qv = []
    if (shouldYield) yield 'Qv created'
    console.info(Qv)
  }
}
