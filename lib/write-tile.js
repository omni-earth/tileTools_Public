var fs = require('fs')
var path = require('path')

module.exports = function writeTile (output, source, tile, cb) {
  var filename = path.join(output, tile.join('-') + '.png')
  fs.exists(filename, function (exists) {
    if (exists) { return cb() }
    console.log('Reading ' + tile)
    source.getTile(tile[0], function (err, image, opts) {
      if (err) {
        // report errors to screen, but don't actually fail
        console.error('Error processing tile ' + tile, err.message || err)
        if (cb) { return cb() }
      }

      console.log('Writing ' + filename)
      fs.writeFileSync(filename, image)
      if (cb) { cb() }
    })
  })
}

