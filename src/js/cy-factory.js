/* eslint-disable quote-props */
const cytoscape = require('cytoscape')

module.exports = {
  createInstance: (container, elements, additionalStyles = [], layout = {}) => cytoscape({
    container, // container to render in
    elements,
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle'
        }
      }
    ].concat(additionalStyles),
    layout: layout || {
      name: 'grid',
      padding: 5,
      fit: true,
      avoidOverlap: true,
    },
    zoomingEnabled: false,
  })
}
