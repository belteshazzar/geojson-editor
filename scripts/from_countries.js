var fs = require('fs');

const dirname = 'data'

fs.readdirSync(dirname, {withFileTypes: true})
.filter(item => !item.isDirectory())
.map(item => item.name)
.forEach(name => {

    if (name=='all.geojson') return
    if (name=='index.geojson') return

    console.log(name)

    const country = JSON.parse(fs.readFileSync(dirname + '/' + name,'utf-8'))

    let fixed = {}
    fixed.type = country.type
    fixed.properties = {}
    fixed.properties.name = country.properties.name_long
    fixed.properties.known_as = country.properties.name_long
    fixed.properties.source = "https://github.com/AshKyd/geojson-regions/tree/master/countries/110m"
    fixed.properties.note = "TBD"
    fixed.properties.label_x = country.properties.label_x
    fixed.properties.label_y = country.properties.label_y
    fixed.properties.year = 2022
    fixed.geometry = country.geometry

    let fixedName = fixed.properties.name.replace(/ *\/.*$/,'').toLowerCase()

    let outFolder = dirname + '/' + fixedName
    if (!fs.existsSync(outFolder)) {
        fs.mkdirSync(outFolder);
    }

    let outFilename = outFolder + '/' + fixedName + '_2022.geojson'

    fs.writeFileSync(outFilename, JSON.stringify(fixed));
})

