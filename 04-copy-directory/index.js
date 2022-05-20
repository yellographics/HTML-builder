const { mkdir, readdir, copyFile, rm, stat } = require("fs/promises");
const path = require("path");

const input = path.join(__dirname, "files");
const output = path.join(__dirname, "files-copy");

async function copyDir(i, o){ 
  
  try {
    await rm(o, {recursive: true});  
  } catch (err) {}

  try {    
    await mkdir(o, {recursive: true });    
  } catch (err) { console.log(err) }    

  try {
    const elements = await readdir(i, { withFileTypes: true });
    elements.forEach((element) => {
      if(element.isFile()){
        copyFile(path.join(i, element.name), path.join(o, element.name));
      } else {
        const newInput = path.join(input, element.name);
        const newOutput = path.join(output, element.name);
        copyDir(newInput, newOutput);
      }
    })
  } catch (err) { console.log(err) }
}

copyDir(input, output);

