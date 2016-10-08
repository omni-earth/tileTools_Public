var mapnik = require('mapnik');
var vt = new mapnik.VectorTile(0,0,0);
var tileSize = vt.tileSize;
var map = new mapnik.Map(tileSize, tileSize);
vt.render(map, new mapnik.Image(256,256), function(err, image) {
 if (err) throw err;   
 // save the rendered image to an existing image file somewhere
 // see mapnik.Image for available methods
 image.save('./file.png', 'png32');
});