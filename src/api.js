const util = require('util')

const colors = require('./colors.js').colors

const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors');
app.use(cors())
const port = 3000

const fs = require('fs');
const datadir = 'data/regions'

function getRegionNames() {
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

            all[region] = { color: colors[Object.values(all).length], years: {} }

            fs.readdirSync(datadir + '/' + region, {withFileTypes: true})
                .filter(item => !item.isDirectory())
                .map(item => item.name)
                .forEach(filename => {

                    const year = filename.replace(/\.geojson$/,'').replace(/^.*_/,'')
                    const json = JSON.parse(fs.readFileSync(datadir + '/' + region + '/' + filename,'utf-8'))

                    all[region].years[year] = json

                })
        })

    res.json(all)
})

app.get('/regionNames', (req,res) => {
    res.json({ regions: getRegionNames() })
})

app.post('/regions/:region', (req,res) => {

    const region = req.params.region.toLowerCase()

    if (getRegionNames().includes(region)) {
        res.status(400).send('already exists')
    } else {
        const newDir = datadir + '/' + region
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir);
        }
        res.status(201).json({ region: region})
    }

})

app.get('/regions/:region', (req,res) => {
    const region = req.params.region.toLowerCase()

    if (!getRegionNames().includes(region)) {
        res.status(404).send('region doesnt exist')
        return
    }

    res.json({ region: region, years: getRegionYears(region) })

});

app.get('/regions/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year

    const json = JSON.parse(fs.readFileSync(datadir + '/' + region + '/' + region + '_' + year + '.geojson','utf-8'))

    res.json(json);
});

app.delete('/regions/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
    const filename = datadir + '/' + region + '/' + region + '_' + year + '.geojson'

    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename)
        if (fs.existsSync(filename)) {
            res.status(400).send('failed to delete')
        } else {
            res.send()
        }
    } else {
        res.status(400).send('not deleted')
    }
})

app.put('/regions/:region/:year', (req,res) => {
    const region = req.params.region.toLowerCase()
    const year = req.params.year
    const geojson = req.body

    if (region != geojson.properties.name.toLowerCase()) {
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

app.get('/riverNames', (req,res) => {

    function getRiverNames() {
        let rivers = []
    
        fs.readdirSync('data/rivers', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name)
        .forEach(name => {
            rivers.push(name.replace(/\.geojson$/,''))
        })
    
        return rivers
    }

    res.json({ rivers: getRiverNames() })
})

app.get('/rivers/:river', (req,res) => {
    const river = req.params.river.toLowerCase()

    const json = JSON.parse(fs.readFileSync('data/rivers/' + river + '.geojson','utf-8'))

    res.json(json);
});

app.put('/rivers/:river', (req,res) => {
    const river = req.params.river.toLowerCase()
    const geojson = req.body

    if (river != geojson.properties.name.toLowerCase()) {
        res.status(400).send('river doesnt match payload')
        return
    }

    let outFilename = 'data/rivers/' + river + '.geojson'
    if (fs.existsSync(outFilename)) {
        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(200) // updated
        .json(geojson)

    } else {

        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(201) // created
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

app.get('/cityNames', (req,res) => {

    function getCityNames() {
        let cities = []
    
        fs.readdirSync('data/cities', {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name)
        .forEach(name => {
            cities.push(name.replace(/\.geojson$/,''))
        })
    
        return cities
    }

    res.json({ cities: getCityNames() })
})

app.get('/cities/:city', (req,res) => {
    const city = req.params.city.toLowerCase()
    const filename = 'data/cities/' + city + '.geojson'
    if (fs.existsSync(filename)) {
        const json = JSON.parse(fs.readFileSync(filename,'utf-8'))
        res.json(json);
    } else {
        res.status(404).json({$err: 'not found'})
    }
});

app.put('/cities/:city', (req,res) => {

    const city = req.params.city.toLowerCase()
    const geojson = req.body

    if (city != geojson.properties.name.toLowerCase()) {
        res.status(400).send('city doesnt match payload')
        return
    }

    let outFilename = 'data/cities/' + city + '.geojson'

    if (fs.existsSync(outFilename)) {
        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(200) // updated
        .json(geojson)

    } else {

        fs.writeFileSync(outFilename, JSON.stringify(geojson));

        res
        .status(201) // created
        .json(geojson)

    }
});

app.get('/cities/:city/wiki', async (req,res) => {

    const city = req.params.city

    const both = await Promise.all([
        fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=coordinates&titles=${city}`)
            .then((response) => response.json())
            .then((json) => {
                try {
                    const id = Object.keys(json.query.pages)[0]
                    const coordinates = json.query.pages[id].coordinates[0]
                    const lat = coordinates.lat
                    const lng = coordinates.lon
                    return { lat: lat, lng: lng }
                } catch (e) {
                    return { lat: '', lng: '' }
                }
            }),

        fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=${city}&rvslots=main`)
            .then((response) => response.json())
            .then((json) => {
                const re = /\|[^ ]+ = {{(circa)?\|(AD )?([0-9]+)( BC)?(\|.*)?}}/

                try {
                    const id = Object.keys(json.query.pages)
                    const txt = json.query.pages[id].revisions[0].slots.main['*']

                    let founded = ''
                    let fline = /\|built = [^\n]*/.exec(txt)
                    if (fline) {
                        fline = fline[0]
                        const fmatch = re.exec(fline)
                        if (fmatch) {
                            if (fmatch[2]) founded = fmatch[3]
                            if (fmatch && fmatch[4]) founded = -fmatch[3]
                        }
                    } else {

                        let est = /\| established_date += ([0-9]+)( BC)?[^\n]*/.exec(txt)
                        if (est) {
                            founded = ( est[2] ? -1 : 1 ) * est[1]
                        }

                    }

                    let abandoned = ''
                    let aline = /\|abandoned = [^\n]*/.exec(txt)
                    if (aline) {
                        aline = aline[0]
                        const amatch = re.exec(aline)
                        if (amatch) {
                            if (amatch[2]) abandoned = amatch[3]
                            if (amatch && amatch[4]) abandoned = -amatch[3]
                        }
                    }

                    return { founded: founded, abandoned: abandoned }
                } catch (e) {
                    return { founded: '', abandoned: '' }
                }
            })
        ])
    res.json({ lat: both[0].lat, lng: both[0].lng, founded: both[1].founded, abandoned: both[1].abandoned })
})

app.listen(port, () => {
  console.log(`region api on port ${port}`)
})
