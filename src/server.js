const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const extractFileName = fromUrl => (/[^/]*$/u).exec(fromUrl)[0]
http.createServer((req, res) => {
  console.log(`${ req.method } ${ req.url }`)
  let usableUrl = req.url

  if (req.url.indexOf('/cytoscape/') !== -1) {
    usableUrl = `./node_modules/cytoscape/dist/${ extractFileName(req.url) }`
  } else if (req.url.indexOf('/graph/') !== -1) {
    usableUrl = `./src/graphs/${ req.url }`
  } else if (req.url.indexOf('/bundle.js') !== -1) {
    usableUrl = '/../public/bundle.js'
  }

  // parse URL
  const parsedUrl = url.parse(usableUrl)
  // extract URL path
  const pathname = `.${ parsedUrl.pathname }`
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const { ext } = path.parse(pathname)
  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
  }

  let usablePath = path.join(__dirname, pathname)
  fs.exists(usablePath, exist => {
    if (!exist) {
      // if the file is not found, return 404
      res.statusCode = 404
      res.end(`File ${ usablePath } not found!`)
      return
    }

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type'
    )

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // if is a directory search for index file matching the extention
    if (fs.statSync(usablePath).isDirectory()) usablePath += '/../public/index.html'

    // read file from file system
    fs.readFile(usablePath, (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${ err }.`)
      } else {
        // if the file is found, set Content-type and send data
        console.info('Ext when empty: ', ext)
        res.setHeader('Content-type', map[ext || '.html'] || 'text/plain')
        res.end(data)
      }
    })
  })
}).listen(3000)

console.info('Server running!')
