
const fs = require('fs');

const json = JSON.parse(fs.readFileSync('scripts/USA-border-data.json','utf-8'))

json.features.forEach(feature => {
    const p = feature.properties
    const year = Number.parseInt(p.START_DATE)
    const geojson = { 
        type: 'Feature',
        properties: {
            name: p.NAME,
            year: year,
            known_as: '',
            source: '',
            overlay: { url: '', c1: { lat: 0.0, lng: 0.0}, c2: {lat: 0.0, lng: 0.0}},
            note: `${p.NAME_START}\n\n${p.START_DATE} -> ${p.END_DATE}\n\n${p.CHANGE}\n\n${p.CITATION}\n`,
            label: {lat:0.0, lng: 0.0}
        },
        geometry: feature.geometry
    }

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geojson)
    };

    fetch(`http://localhost:3000/regions/${p.NAME}/${year}`, requestOptions)
        .then(r => console.log(`${p.NAME}/${year} = ${r.statusText}`))
        .catch(err => {
            console.log(err)
        })

});
// json.forEach(city => {

//     let name = city.c
//     let lat = city.lt
//     let lng = city.ln

//     fetch(`http://localhost:3000/city/${name}`)
//         .then(data => data.json())
//         .then(json => {
//             console.log(`${name} ${lat},${lng} = ${json.geometry.coordinates[0]},${json.geometry.coordinates[1]}`)
//         })
//         .catch(err => {

//             const geojson = {
//                 "type": "Feature",
//                 "properties": {
//                   "name": name,
//                   "founded": '',
//                   "abandoned": '',
//                   "source": `https://en.wikipedia.org/wiki/${name}`,
//                   "note": ''
//                 },
//                 "geometry": {
//                   "coordinates": [
//                     lat, lng
//                   ],
//                   "type": "Point"
//                 }
//             }
        
//             fetch(`http://localhost:3000/city/${name}`,{
//                 method: 'PUT',
//                 mode: 'cors', // no-cors, *cors, same-origin
//                 cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//                 credentials: 'omit', // include, *same-origin, omit
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 redirect: 'error',
//                 referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//                 body: JSON.stringify(geojson) 
//             })
//                 .then(data => data.json())
//                 .then(json => {
//                     console.log(`created ${name}`)
//                 })
//                 .catch(err => {
//                     console.log(`error creating ${name}`)
//                     console.log(err)
//                 })
        
//         })
// })