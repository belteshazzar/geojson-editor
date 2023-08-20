
const fs = require('fs');

const FILENAME = process.argv[2]
const YEAR = process.argv[3]

const json = JSON.parse(fs.readFileSync(FILENAME,'utf-8'))

json.features.forEach(feature => {
    const p = feature.properties
    const name = p.NAME
    if (name==null) {
        return
    }

    fs.writeFileSync(`${name.replaceAll('/','_')}-${YEAR}.geom.geojson`, JSON.stringify(feature.geometry));

});