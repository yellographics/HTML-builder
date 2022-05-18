const path = require("path");
const fs = require("fs");

// create a folder

fs.mkdir(
  path.join(__dirname, "project-dist"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);

//merge styles

const writeableStream = fs.createWriteStream(
  path.join(__dirname, "project-dist", "style.css")
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, files) => {
    console.log("\nMerging css files...");
    if (err) console.log(err);
    else {
      let css = '';
      files.forEach((file, index) => {
        if (file.name.endsWith(".css")) {
          const src = path.join(__dirname, "styles", file.name);
          fs.readFile(src, "utf-8", (err, data) => {            
            if (err) throw err;            
            else css = css + '\n' + data;
            if(index === (files.length - 1)){                
              writeableStream.write(css);
            }
          });
          
        }
      });
    }
  }
);

// copy assets

let input = path.join(__dirname, "assets");
let output = path.join(__dirname, "project-dist", "assets");

function copyDir(input, output) {
  fs.mkdir(output, { recursive: true }, (err) => {
    if (err) throw err;
  });

  

  fs.readdir(input, { withFileTypes: true }, (err, elements) => {
    if (err) console.log(err);
    else {
      elements.forEach((element) => {
        if (element.isFile()) {
          const src = path.join(input, element.name);
          const dest = path.join(output, element.name);
          fs.copyFile(src, dest, () => {
            console.log(element.name + " is copied!");
          });
        } else {
          const newInput = path.join(input, element.name);
          const newOutput = path.join(output, element.name);
          copyDir(newInput, newOutput);
        }
      });
    }
  });
}

copyDir(input, output);

//working with template


const readableStream = fs.createReadStream(
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
});
