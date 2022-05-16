const path = require('path');
const fs = require('fs');

const newPath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(newPath, 'utf-8');
readableStream.on('data', text => {
    console.log(text);
})