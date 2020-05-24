var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // true면 객체형식으로, false면 문자열 형식으로 가져옴 <ㅡ GET 방식으로 데이터 받기
    var title = queryData.id;
    var pathName = url.parse(_url, true).pathname;
    console.log(pathName);

    if (_url == '/') {
       title = 'Welcome';
    }
    response.writeHead(200);

    var templateList = (fileList) => {
        var list = '<ul>';
        for (var i = 0; i < fileList.length; i++) {
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
        }
        list += '</ul >';
        return list;
    }

    var templateHTML = (title, list, description) => {
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
                    <p><a href="/create">CREATE</a></p>         
                    
                    <h2>${title}</h2>                
                    <p>
                        ${description}
                    </p>
                </body>
                </html>    
                `;
        return template;
    }

    if (pathName == '/'){
        fs.readdir('./data', (err, fileList) => {
            var list = templateList(fileList);
            fs.readFile(`data/${title}`, 'utf-8', (err, description) => {
                var template = templateHTML(title, list, description);

                response.end(template);
                //response.end(fs.readFileSync(__dirname + url));
            });

        });
    }else if (pathName == '/create'){
        fs.readdir('./data', (err, fileList) => {
            var title = 'WEB - CREATE';
            var list = templateList(fileList);
            fs.readFile(`data/${title}`, 'utf-8', (err, description) => {
                var template = templateHTML(title, list, `
                <form method="post" action="http://localhost:3000/create_process">
                    <input type="text" name="title" id="title" width:"200" placeholder="title">
                    <p>
                        <textarea name="description" rows="10" style="resize: none;" placeholder="description"></textarea>
                    </p>
                    <input type="submit" name="submit" id="submit" value="Submit">
                </form>
                `);

                response.end(template);
                //response.end(fs.readFileSync(__dirname + url));
            });

        });
       
    } else if (pathName == '/create_process'){
        var body ='';
        request.on('data',(data) => { //정보를 조각조각 내어 수신
            body += data;
        });

        request.on('end', () => { //정보수신 종료 후
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                response.writeHead(302, { 'Location': `/?id=${title}`})
                response.end('Success');
            });
        });
        
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
    

});
app.listen(3000);