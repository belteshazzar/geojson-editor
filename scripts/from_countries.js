var fs = require('fs');

const dirname = 'data'

fs.readdirSync(dirname, {withFileTypes: true})
.filter(item => !item.isDirectory())
.map(item => item.name)
.forEach(name => {
    console.log(name)

    const country = JSON.parse(fs.readFileSync(dirname + '/' + name,'utf-8'))

    let fixed = {}
    fixed.type = country.type
    fixed.properties = {}
    fixed.properties.name = country.properties.name_long
    fixed.properties.label_x = country.properties.label_x
    fixed.properties.label_y = country.properties.label_y
    fixed.geometry = country.geometry

    let fixedName = fixed.properties.name.replaceAll(/[ -]/g,'_')

    let outFolder = dirname + '/' + fixedName
    if (!fs.existsSync(outFolder)) {
        fs.mkdirSync(outFolder);
    }

    let outFilename = outFolder + '/' + fixedName + '_2022.geojson'

    fs.writeFileSync(outFilename, JSON.stringify(fixed));
})

