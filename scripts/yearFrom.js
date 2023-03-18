var fs = require('fs');

const dirname = 'data/regions'

fs.readdirSync(dirname, {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .forEach(region => {

        fs.readdirSync(dirname + '/' + region, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
            .forEach(name => {

                const filename = dirname + '/' + region + '/' + name
                const geojson = JSON.parse(fs.readFileSync(filename,'utf-8'))
                geojson.properties.year = {
                    from: geojson.properties.year,
                    to: Number.MAX_SAFE_INTEGER
                }
                fs.writeFileSync(filename, JSON.stringify(geojson));
            })

    })


