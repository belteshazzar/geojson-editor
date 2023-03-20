var fs = require('fs');

const dirname = 'data/regions'

const r1 = 'sudan'
const y1 = 2011
const r2 = 'south sudan'
const y2 = 2011

const geojson1 = JSON.parse(fs.readFileSync(`${dirname}/${r1}/${r1}_${y1}.geojson`,'utf-8'))
const geojson2 = JSON.parse(fs.readFileSync(`${dirname}/${r2}/${r2}_${y2}.geojson`,'utf-8'))

// reverse geojson2

geojson2.geometry.coordinates[0] = geojson2.geometry.coordinates[0].reverse()

// find shared edge

for (let i1 = 0 ; i1< geojson1.geometry.coordinates[0].length ; i1++) {
    let c1 = geojson1.geometry.coordinates[0][i1]

    for (let i2 = 0 ; i2 < geojson2.geometry.coordinates[0].length ; i2++) {
        let c2 = geojson2.geometry.coordinates[0][i2]

        if (c1[0] == c2[0] && c1[1] == c2[1]) {
            console.log(i1,i2)
            break
        }
    }
}

