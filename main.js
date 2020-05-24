var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // true면 객체형식으로, false면 문자열 형식으로 가져옴
    var title = queryData.id;

    if (_url == '/') {
       title = 'Welcome';
    }
    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);

    fs.readdir('./data', (err, fileList) => {
        var list = '<ul>';
        for (var i = 0; i < fileList.length; i++){
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
        }
        list += '</ul >';
        fs.readFile(`data/${title}`, 'utf-8', (err, description) => {
            if (title == 'Welcome') {
                description = `
                The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.
            `;
            }
            //template literal은 ',"가 아닌 `(백틱)으로 감싸준다!
            var template = `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>           
                ${list}                
                <h2>${title}</h2>
                <p>
                    ${description}
                </p>
            </body>
            </html>    
            `;

            response.end(template);
            //response.end(fs.readFileSync(__dirname + url));
        });

    });
    
    

});
app.listen(3000);