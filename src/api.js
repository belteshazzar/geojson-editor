
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors');
app.use(cors())
const port = 3000
const fs = require('fs');
const datadir = 'data'

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

app.listen(port, () => {
  console.log(`region api on port ${port}`)
})