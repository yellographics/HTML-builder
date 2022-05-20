const path = require("path");
const fs = require("fs");
const { readdir, readFile } = require('fs/promises');

const writeableStreamCss = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

const inputPath = path.join(__dirname, "styles");


async function bundleCss(){
    try {
    const files = await readdir(inputPath, {withFileTypes: true});   
    for (const file of files)  {
      if (file.name.endsWith('.css')){
        try{
          const cssData = await readFile(path.join(inputPath, file.name));
          writeableStreamCss.write(cssData);
        } catch (err){}        
      }
    }      
  } catch (err) {console.log(err)}
}

bundleCss();

