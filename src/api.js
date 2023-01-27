const express = require('express')
const app = express()
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
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .forEach(name => {
        years.push(name)
    })

    return regions
}

app.get('/', (req, res) => {
  res.send('Hello World!')
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

    if (getRegions().includes(region)) {
        res.status(404).send('region doesnt exist')
    } else {
        res.json({ region: region, years: getYears(region) })
    }
});

app.get('/region/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
});

app.post('/region/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})