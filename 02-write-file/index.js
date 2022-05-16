const fs = require('fs');
const { dirname } = require('path');
const path = require('path');
const {stdin, stdout} = process;

const output = fs.WriteStream(path.join(__dirname, 'output.txt'));

stdout.write('Hello, please enter the text. P.S. Enter \'Ctrl + C\' or \'exit\' to quit \n');


stdin.on('data', data => {
    const text = data.toString();
    if (text.includes('exit')){
        process.exit();
    } else output.write(text);    
})

process.on('SIGINT', () => {
    process.exit();    
})

process.on('exit', () => {
    stdout.write('Finished!');    
})
