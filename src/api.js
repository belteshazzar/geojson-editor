
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors');
app.use(cors())
const port = 3000
const fs = require('fs');
const datadir = 'data/regions'

function getRegions() {
    let regions = []

    fs.readdirSync(datadir, {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .forEach(name => {
        regions.push(name)
    })

    return regions
}

function getRegionYears(region) {
    let years = []

    fs.readdirSync(datadir + '/' + region, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name)
    .forEach(name => {
        years.push(Number.parseInt(name.replace('.geojson$','').replace(/^.*_/,'')))
    })

    return years
}

app.get('/', (req, res) => {
  res.send('region api')
})

app.get('/regions', (req,res) => {
    let all = {}

    fs.readdirSync(datadir, {withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .forEach(region => {

            all[region] = {}

            fs.readdirSync(datadir + '/' + region, {withFileTypes: true})
                .filter(item => !item.isDirectory())
                .map(item => item.name)
                .forEach(filename => {

                    const year = filename.replace(/\.geojson$/,'').replace(/^.*_/,'')
                    const json = JSON.parse(fs.readFileSync(datadir + '/' + region + '/' + filename,'utf-8'))

                    all[region][year] = json

                })
        })

    res.json(all)
})

app.get('/region', (req,res) => {
    res.json({ regions: getRegions() })
})

app.post('/region/:region', (req,res) => {

    const region = req.params.region.toLowerCase()

    if (getRegions().includes(region)) {
        res.status(400).send('already exists')
    } else {
        const newDir = datadir + '/' + region
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir);
        }
        res.status(201).json({ region: region})
    }

})

app.get('/region/:region', (req,res) => {
    const region = req.params.region.toLowerCase()

    if (!getRegions().includes(region)) {
        res.status(404).send('region doesnt exist')
        return
    }

    res.json({ region: region, years: getRegionYears(region) })

});

app.get('/region/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year

    const json = JSON.parse(fs.readFileSync(datadir + '/' + region + '/' + region + '_' + year + '.geojson','utf-8'))

    res.json(json);
});

app.put('/region/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
    const geojson = req.body

    if (region.toLowerCase() != geojson.properties.name) {
        res.status(400).send('region doesnt match payload')
        return
    }

    if (Number.parseInt(year) + '' != year) {
        res.status(400).send('year must be an integer')
        return
    }

    if (year != geojson.properties.year) {
        res.status(400).send('year doesnt match payload')
        return
    }

    let regionFolder = datadir + '/' + region
    if (!fs.existsSync(regionFolder)) {
        fs.mkdirSync(regionFolder);
    }

    let outFilename = regionFolder + '/' + region + '_' + year + '.geojson'
    if (fs.existsSync(outFilename)) {
        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(201) // created
        .json(geojson)

    } else {

        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(200) // updated
        .json(geojson)

    }
});

app.get('/rivers', (req,res) => {
    let all = {}

    fs.readdirSync('data/rivers', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .filter(item => item.name.match(/.*\.geojson$/))
        .map(item => item.name)
        .forEach(filename => {
            const river = filename.replace(/\.geojson$/,'')
            const json = JSON.parse(fs.readFileSync('data/rivers/' + filename,'utf-8'))
            all[river] = json
        })

    res.json(all)
})

app.get('/river', (req,res) => {

    function getRivers() {
        let rivers = []
    
        fs.readdirSync('data/rivers', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name)
        .forEach(name => {
            rivers.push(name.replace(/\.geojson$/,''))
        })
    
        return rivers
    }

    res.json({ rivers: getRivers() })
})

app.get('/river/:river', (req,res) => {
    const river = req.params.river.toLowerCase()

    const json = JSON.parse(fs.readFileSync('data/rivers/' + river + '.geojson','utf-8'))

    res.json(json);
});

app.put('/river/:river', (req,res) => {
    const river = req.params.river.toLowerCase()
    const geojson = req.body

    if (river.toLowerCase() != geojson.properties.name) {
        res.status(400).send('river doesnt match payload')
        return
    }

    let outFilename = 'data/rivers/' + river + '.geojson'
    if (fs.existsSync(outFilename)) {
        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(201) // created
        .json(geojson)

    } else {

        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(200) // updated
        .json(geojson)

    }
});

app.get('/cities', (req,res) => {
    let all = {}

    fs.readdirSync('data/cities', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .filter(item => item.name.match(/.*\.geojson$/))
        .map(item => item.name)
        .forEach(filename => {
            const city = filename.replace(/\.geojson$/,'')
            const json = JSON.parse(fs.readFileSync('data/cities/' + filename,'utf-8'))
            all[city] = json
        })

    res.json(all)
})

app.get('/city', (req,res) => {

    function getCities() {
        let cities = []
    
        fs.readdirSync('data/cities', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name)
        .forEach(name => {
            cities.push(name.replace(/\.geojson$/,''))
        })
    
        return cities
    }

    res.json({ cities: getCities() })
})

app.get('/city/:city', (req,res) => {
    const city = req.params.city.toLowerCase()
    const json = JSON.parse(fs.readFileSync('data/cities/' + city + '.geojson','utf-8'))
    res.json(json);
});

app.put('/city/:city', (req,res) => {
    const city = req.params.city.toLowerCase()
    const geojson = req.body

    if (city.toLowerCase() != geojson.properties.name) {
        res.status(400).send('city doesnt match payload')
        return
    }

    let outFilename = 'data/cities/' + city + '.geojson'
    if (fs.existsSync(outFilename)) {
        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(201) // created
        .json(geojson)

    } else {

        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(200) // updated
        .json(geojson)

    }
});

app.listen(port, () => {
  console.log(`region api on port ${port}`)
})