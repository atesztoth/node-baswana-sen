module.exports = {
  findShortestsFromVtoC: (vertex, clustering, edges, level = 0, isWeightedCase = true) => {
    // In which cluster in we are?
    const ownClusterId = clustering[level].reduce((a, c) => c.find(({ id }, i) => id === vertex.id ? i : a), -1)
    if (ownClusterId === -1) throw Error('Could determine in which cluster the current vertex is in.')
    // todo: continue!
  }
}
