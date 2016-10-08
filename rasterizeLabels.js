#!/usr/bin/env node

var path = require('path')
var Vector = require('tilelive-vector')
var tilelive = require('tilelive')
require('mbtiles').registerProtocols(tilelive)
var queue = require('queue-async')
var argv = require('minimist')(process.argv.slice(2))

var style = require('./lib/style')
var readSample = require('./lib/read-sample')
var writeTile = require('./lib/write-tile')

var input = process.argv[2] // usually an osm qa tiles mbtiles file
var layers = process.argv[3] // json file defining classes
var output = process.argv[4] // output dir

init(input, style(layers), function (err, vector) {
  if (err) { throw err }

  var q = queue(5) // TODO: abstract magic number

  readSample(argv)
  .on('data', function (tile) {
    q.defer(function (done) {
      writeTile(output, vector, tile, done)
    })
  })
  .on('end', function () {
    q.awaitAll(function (err) { if (err) { throw err } })
  })
})

function init (source, style, cb) {
  if (!/^.+:\/\//.test(source)) {
    source = input
  } else {
    tilelive.auto(source)
  }

  console.log('Reading from source', source)
  /* eslint-disable no-new */
  new Vector({
    xml: style,
    source: source
  }, cb)
}