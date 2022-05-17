const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

function copyDir() {
  fs.mkdir(
    path.resolve(__dirname, "files-copy"),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );

  fs.readdir(
    path.join(__dirname, "files-copy"),
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          const currentPath = path.join(__dirname, "files-copy", file.name);
          fs.unlink(currentPath, (err) => {
            if (err) throw err;
          });
        });
      }
    }
  );

  fs.readdir(
    path.join(__dirname, "files"),
    { withFileTypes: true },
    (err, files) => {
      console.log("\nCopying...");
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          const src = path.join(__dirname, "files", file.name);
          const dest = path.join(__dirname, "files-copy", file.name);
          fs.copyFile(src, dest, () => {
            console.log(file.name + " is successfully copied");
          });
        });
      }
    }
  );
}

copyDir();
