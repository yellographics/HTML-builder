const path = require("path");
const fs = require("fs");
const { mkdir, readFile, rm, readdir, copyFile } = require("fs/promises");

const output = path.join(__dirname, "project-dist");

// create a folder

async function makeDir(dir) {
  try {
    mkdir(dir, { recursive: true });
  } catch (err) {}
}

makeDir(output);

// merge styles

const writeableStreamCss = fs.createWriteStream(path.join(output, "style.css"));

const inputPath = path.join(__dirname, "styles");

async function bundleCss() {
  try {
    const files = await readdir(inputPath, { withFileTypes: true });
    for (const file of files) {
      if (file.name.endsWith(".css")) {
        try {
          const cssData = await readFile(path.join(inputPath, file.name));
          writeableStreamCss.write(cssData);
        } catch (err) {}
      }
    }
  } catch (err) {}
}

bundleCss();

// copy assets
const inputDir = path.join(__dirname, "assets");
const outputDir = path.join(output, "assets");

async function copyDir(i, o) {
  try {
    await rm(o, { recursive: true });
  } catch (err) {}

  try {
    await mkdir(o, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  try {
    const elements = await readdir(i, { withFileTypes: true });
    elements.forEach((element) => {
      if (element.isFile()) {
        copyFile(path.join(i, element.name), path.join(o, element.name));
      } else {
        const newInput = path.join(inputDir, element.name);
        const newOutput = path.join(outputDir, element.name);
        copyDir(newInput, newOutput);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

copyDir(inputDir, outputDir);

//working with template

const writeableStreamHTML = fs.createWriteStream(
  path.join(__dirname, "project-dist", "index.html")
);

let html = "";

async function readTemplate() {
  try {
    html = await readFile(path.join(__dirname, "template.html"), {
      encoding: "utf-8",
    });
    try {
      const files = await readdir(path.join(__dirname, "components"), {withFileTypes: true});
      let i = 0;      
      for (const file of files) {
        const fileName = file.name.split('.html').join('');
        html = html.split(`{{${fileName}}}`);        
        try {
          const htmlFromFile = await readFile(path.join(__dirname, 'components', file.name), {encoding: "utf-8"});  
          
          html.splice(1, 0, htmlFromFile);
          html = html.join('');
          i++;
          if(i === files.length){
            writeableStreamHTML.write(html);
          }         
        } catch (err) {}        
      }      
    } catch (err) {}
  } catch (err) {}
}

readTemplate();

/* const readableStream = fs.createReadStream(
  path.join(__dirname, "template.html"),
  "utf-8"
);

readableStream.on("data", (html) => {
  let htmlString = "";
  fs.readdir(
    path.join(__dirname, "components"),
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file, index) => {
          const src = path.join(__dirname, "components", file.name);
          fs.readFile(src, "utf-8", (err, data) => {
            if (err) throw err;
            else {
              const fileName = file.name.split(".html").join("");
              console.log(fileName);
              if (htmlString.length === 0) {
                htmlString = html.toString().split(`{{${fileName}}}`);
              } else {
                htmlString = htmlString.toString().split(`{{${fileName}}}`);
              }

              htmlString.splice(1, 0, data);
              htmlString = htmlString.join("");
              if (index === files.length - 1) {                
                let writeableStreamHtml = fs.createWriteStream(
                  path.join(__dirname, "project-dist", "index.html")
                );
                writeableStreamHtml.write(htmlString);
              }
            }
          });
        });
      }
    }
  );
}); */
