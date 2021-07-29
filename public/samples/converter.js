const Lame = require('node-lame').Lame;
const path = require('path');
const fs = require('fs');
const folder = process.argv[2];
if (!folder) {
  console.log('no folder given!');
} else {
  //joining path of directory
  const directoryPath = path.join(__dirname, folder);
  console.log('convert ', directoryPath);
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files
      .filter((file) => file.split('.')[1] === 'wav')
      .forEach(function (file) {
        const encoder = new Lame({
          output: `${directoryPath}/${file.split('.')[0]}.mp3`,
          bitrate: 192
        }).setFile(`${directoryPath}/${file.split('.')[0]}.wav`);
        encoder
          .encode()
          .then(() =>
            console.log(`encoded ${directoryPath}/${file.split('.')[0]}.mp3`)
          )
          .catch((error) =>
            console.log(
              `error encoding ${directoryPath}/${
                file.split('.')[0]
              }.mp3: ${error}`
            )
          );
      });
  });
}
