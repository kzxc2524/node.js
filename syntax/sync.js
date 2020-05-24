var fs = require('fs');

// readFileSync 동기
console.log('A');
var result = fs.readFileSync('syntax/sample.txt','utf-8');
console.log(result);
console.log('C');

// readFile 비동기
console.log('A');
fs.readFile('syntax/sample.txt', 'utf-8',(err,data) => {
    console.log(data)
});
console.log('C');
console.log('D');
console.log('E');
console.log('F');
console.log('G');
console.log('H');
console.log('I');