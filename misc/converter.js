const fs = require('fs')
const baseData = require('./from.json')

let nodes = []
let edges = []

baseData.forEach(piece => {
    const { group: pieceGroup } = piece
    if (pieceGroup === 'edges') {
        const { data: { id, weight, source, target } } = Object.assign({}, piece)
        if(source === target) return // no need for hurokél
        delete piece.data
        delete piece.group
        edges.push({ data: Object.assign({}, { id, weight, source, target }, { ...piece }) })
    } else if (pieceGroup === 'nodes') {
        const { data: { id, weight } } = Object.assign({}, piece)
        delete piece.data
        delete piece.group
        nodes.push({ data: Object.assign({}, { id, weight }, { ...piece }) })
    }
})

const writable = {nodes, edges}
fs.writeFile('./graph2.json', JSON.stringify(writable, null, 2), 'utf8', err => {
	if (err) return console.info('Unsuccessful!')
	console.info('Success!')
});
