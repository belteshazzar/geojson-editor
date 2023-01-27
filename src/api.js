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

app.post('/region/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
    const geojson = req.body

    console.log(region)
    console.log(year)
    console.log(geojson)

    // let outFolder = dirname + '/' + fixedName
    // if (!fs.existsSync(outFolder)) {
    //     fs.mkdirSync(outFolder);
    // }

    // let outFilename = outFolder + '/' + fixedName + '_2022.geojson'

    // fs.writeFileSync(outFilename, JSON.stringify(fixed));

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})