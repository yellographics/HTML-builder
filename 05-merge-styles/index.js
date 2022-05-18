const path = require("path");
const fs = require("fs");

let writeableStream = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, files) => {
    console.log("\nAnalazing files...");
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.name.endsWith(".css")) {
          const src = path.join(__dirname, "styles", file.name);          
          fs.readFile(src, "utf-8", (err, data) => {
            if (err) throw err;
            else writeableStream.write(data);
          });
        }
      });
    }
  }
);
