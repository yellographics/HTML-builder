const fs = require('fs');
const path = require('path');


fs.readdir(path.join(__dirname, 'secret-folder'), 
    { withFileTypes: true },
    (err, files) => {
    console.log("\nCurrent directory files:");
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
          if(file.isFile()){  
            const filename = file.name.split('.'); 
            const ext =  (path.extname(file.name)).slice(1, path.extname(file.name).length);  
            const pathToCheck = path.join(__dirname, 'secret-folder', file.name);
            fs.stat(pathToCheck, (err, stats) => {
              if(!err){
                console.log(filename[0] + " - " + ext + ' - ' + stats.size);
              }           
            })            
          }        
      })
    }
  })

  

