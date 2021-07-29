const path = require('path');
const fs = require('fs');
const MP3Cutter = require('mp3-cutter');

const folder = process.argv[2];

if (!folder) {
  console.log('no folder given!');
} else {
  //joining path of directory
  const directoryPath = path.join(__dirname, folder);
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files
      .filter((file) => file.split('.')[1] === 'mp3')
      .forEach(function (file) {
        console.log(`${directoryPath}/${file}`);
        // Do whatever you want to do with the file
        MP3Cutter.cut({
          src: `${directoryPath}/${file}`,
          target: `${directoryPath}/out/${file.split('.')[0]}-cut.mp3`,
          start: 0,
          end: 10
        });
      });
  });
}
