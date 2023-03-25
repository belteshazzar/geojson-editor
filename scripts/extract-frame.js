const extractFrames = require('ffmpeg-extract-frames')
 
// extract 3 frames at 1s, 2s, and 3.5s respectively
extractFrames({
    input: '/Users/daniel/empiresX.mov',
    output: './screenshot-%i.jpg',
    offsets: [
        1000,
        2000,
        3500
    ]
    })
    
    // generated screenshots:
    // ./screenshot-1.jpg
    // ./screenshot-2.jpg
    // ./screenshot-3.jpg
