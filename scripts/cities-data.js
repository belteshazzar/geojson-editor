
const fs = require('fs');

const json = JSON.parse(fs.readFileSync('cities-data.json','utf-8'))

json.forEach(city => {

    let name = city.c
    let lat = city.lt
    let lng = city.ln

    fetch(`http://localhost:3000/city/${name}`)
        .then(data => data.json())
        .then(json => {
            console.log(`${name} ${lat},${lng} = ${json.geometry.coordinates[0]},${json.geometry.coordinates[1]}`)
        })
        .catch(err => {

            const geojson = {
                "type": "Feature",
                "properties": {
                  "name": name,
                  "founded": '',
                  "abandoned": '',
                  "source": `https://en.wikipedia.org/wiki/${name}`,
                  "note": ''
                },
                "geometry": {
                  "coordinates": [
                    lat, lng
                  ],
                  "type": "Point"
                }
            }
        
            fetch(`http://localhost:3000/city/${name}`,{
                method: 'PUT',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'omit', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'error',
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(geojson) 
            })
                .then(data => data.json())
                .then(json => {
                    console.log(`created ${name}`)
                })
                .catch(err => {
                    console.log(`error creating ${name}`)
                    console.log(err)
                })
        
        })
})