
const fs = require('fs')
const util = require('util')
const turf = require('@turf/turf')

const dirname = 'data/regions'

const r1 = 'sudan'
const y1 = 2011
const r2 = 'south sudan'
const y2 = 2011

// load

const geojson1 = JSON.parse(fs.readFileSync(`${dirname}/${r1}/${r1}_${y1}.geojson`,'utf-8'))
const geojson2 = JSON.parse(fs.readFileSync(`${dirname}/${r2}/${r2}_${y2}.geojson`,'utf-8'))

// create union

var union = turf.union(geojson1,geojson2)

console.log(JSON.stringify(union))
