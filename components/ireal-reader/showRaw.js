const fs = require('fs');
const iRealReader = require('./index');

fs.readFile("./spec/Tester.html", "utf8", function(err, data){
  if(err) throw err;
  showRaw(data);
});

function showRaw (data){
  var p = new iRealReader(data);
  console.log('raw is', p);
}