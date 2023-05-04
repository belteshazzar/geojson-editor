const extractFrames = require('ffmpeg-extract-frames')

const ms = Number.parseInt(process.argv[2])
const m = Math.floor(ms / (60*1000))
const s = ms / 1000 - m*60

const ts = `${m<10?'0':''}${m}-${s<10?'0':''}${s}` // timestamp

extractFrames({
    input: 'video.mov',
    output: `./screenshot-${ts}.png`,
    offsets: [ ms ]
})

console.log(`${ms} = ${ts}`)
