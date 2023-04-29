var fs = require('fs');

const dirname = 'data/regions'
const re = /^.*?_(.*?)\.geojson$/

fs.readdirSync(dirname, {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .forEach(region => {

        console.log(`---- ${region} -----`)

        const years = fs.readdirSync(dirname + '/' + region, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
            .map(fn => {
                return Number.parseInt(re.exec(fn)[1])
            })
            .sort((a,b) => {
                return a - b
            })
        
        for (let i=0 ; i<years.length ; i++) {

            const filename = `${dirname}/${region}/${region}_${years[i]}.geojson`
            const geojson = JSON.parse(fs.readFileSync(filename,'utf-8'))
            try {
                geojson.properties.label = {
                    lat: Number.parseInt(geojson.properties.label.lat),
                    lng: Number.parseInt(geojson.properties.label.lng)
                }
            } catch (e) {
                geojson.properties.label = { lat: 0, lng: 0 }
            }
            if (geojson.properties.label.lat == NaN) geojson.properties.label.lat = 0
            if (geojson.properties.label.lng == NaN) geojson.properties.label.lng = 0

            if ( i<years.length - 1 
                && Number.parseInt(geojson.properties.year.to) + 1 < years[i+1]) {

                    console.log(i,years[i],geojson.properties.year.from,geojson.properties.year.to, i<years.length-1 ? years[i+1]:'-')

                    const createYear = Number.parseInt(geojson.properties.year.to) + 1
                    const createFilename = `${dirname}/${region}/${region}_${createYear}.geojson`
                    const createGeojson = {
                        "type": "Feature",
                        "properties": {
                            "name": region,
                            "year": createYear,
                            "known_as": geojson.properties['known_as'],
                            "source": "",
                            "overlay": {
                                "url": "",
                                "c1": { "lat":0,"lng":0},
                                "c2": {"lat":0,"lng":0}
                            },
                            "note":"",
                            "label": geojson.properties.label,
                            "geometry": null
                        }
                    }

                    fs.writeFileSync(createFilename, JSON.stringify(createGeojson))
            }

            geojson.properties.year = years[i]

            fs.writeFileSync(filename, JSON.stringify(geojson));

        }

    })


