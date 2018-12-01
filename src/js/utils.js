/* eslint-disable */
module.exports = {
  clusterNodes: (cyInstance, clustering, clusterName) =>
    clustering.forEach(cluster => cluster.forEach(({ id }) =>
      cyInstance.nodes(`[id="${ id }"]`).addClass(clusterName))),
  updateClusterInfo: (fullClustering, displayer) => {
    let i = 0
    displayer.innerHTML = fullClustering.reduce((acc, curr) =>
      acc.concat(`${ ++i } ${ JSON.stringify(curr, null, 2) }`), '')
  },
  randomGenerator: succRate => () => Math.random() > (1 - succRate)
}
