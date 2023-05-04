const { execSync } = require('child_process');

const secs = 16*60 + 5
const fps = 4
const mspf = 1000/fps // ms per frame 
const frames = secs * fps

for (let f=1 ; f<frames ; f++) {

    const ms = f*250
    const stdout = execSync(`node scripts/extract-frame.js ${ms}`)
    console.log(`${stdout}`)

}