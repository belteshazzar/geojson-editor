const fs = require('fs'); 
const csv = require('csv-parser');

fs.createReadStream('worldcities.csv')
.pipe(csv())
.on('data', function(data){
    try {

        const name = data.city_ascii
        const country = data.country
        const lat = data.lat
        const lng = data.lng

        fetch(`http://localhost:3000/city/${name}`)
            .then(data => data.json())
            .then(json => {
                if (json.$err) console.log(`${name}, ${country} NOT FOUND`)
                else console.log(`${name} ${lat},${lng} = ${json.geometry.coordinates[0]},${json.geometry.coordinates[1]}`)
            })
            .catch(err => {
                console.log(`${name} ERROR`)
            })

    }
    catch(err) {
    }
})
.on('end',function(){
});  