var fs = require('fs');
var sizeOf = require('image-size');
const sharp = require('sharp')
const { createWorker } = require('tesseract.js');

const dirname = 'public/screenshots';

(async () => {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');


    const names = fs.readdirSync(dirname, {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name)

    for (let i in names) {
            const name = names[i]
            console.log(i,name)
            const image = `${dirname}/${name}`

            // let w,h
            // await sharp(image).metadata().then((d) => {
            //     w = d.width
            //     h = d.height
            // })
            // const width = 500
            // await sharp(image).extract({ left: w-width, top: 0, width: width, height: 200 }).toFile(`public/subs/x-${name}`)

            let rectangles = []
            rectangles.push({ left: 1770, top: 45, width: 380, height: 80 })
            rectangles.push({ left: 1360, top: 165, width: 310, height: 70 })
            rectangles.push({ left: 2, top: 60, width: 385, height: 110 })
            rectangles.push({ left: 20, top: 640, width: 250, height: 75 })

            for (let rectangle of rectangles) {

                // (async () => {
                const { data: { text } } = await worker.recognize(image, { rectangle });
                console.log(text);
                const ss = text.split(" ")
                if (ss.length != 2) {


                    if (text.trim() == `${Number.parseInt(text.trim())}`) {
                        fs.renameSync(image,`public/years/${text.trim()}.png`)
                        break
    
                    }
                    console.log(text)
                    continue
                }
                if (ss[1].trim() == 'BCE') {
                    fs.renameSync(image,`public/years/-${Number.parseInt(ss[0])}.png`)
                    break
                } else if (ss[1].trim() == 'CE') {
                fs.renameSync(image,`public/years/${Number.parseInt(ss[0])}.png`)
                break
                } else {
                    console.log(text)
                }

            }
            // })();

            // break
    }
        // .forEach(name => {


    // const country = JSON.parse(fs.readFileSync(dirname + '/' + name,'utf-8'))


    // fs.writeFileSync(outFilename, JSON.stringify(fixed));


    await worker.terminate();
    console.log('done')

})()
