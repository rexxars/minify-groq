const fs = require('fs')
const path = require('path')

const MAX_ALLOWED_BYTES = 1024

fs.stat(path.join(__dirname, 'lib', 'minify-groq.min.js'), (err, stats) => {
  if (err) {
    throw err
  }

  process.stdout.write(`\nMinified file size: ${stats.size} bytes\n`)

  if (stats.size > MAX_ALLOWED_BYTES) {
    throw new Error(`Larger than max allowed size (${MAX_ALLOWED_BYTES} bytes)`)
  }
})
