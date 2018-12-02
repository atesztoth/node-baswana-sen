/* eslint-disable */
module.exports = {
  updateClusterInfo: (fullClustering, displayer) => {
    let i = 0
    displayer.innerHTML = fullClustering.reduce((acc, curr) =>
      acc.concat(`${ ++i } ${ JSON.stringify(curr, null, 2) }`), '')
  },
  randomGenerator: succRate => () => Math.random() > (1 - succRate)
}
