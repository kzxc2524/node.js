var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path'); //*보안이슈 파일을 읽을 때 경로가 오염된는 것을 방지
var sanitizeHtml = require('sanitize-html'); //원하지 않는 태그를 막는 npm 모듈

var template = require('./lib/template.js')

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // true면 객체형식으로, false면 문자열 형식으로 가져옴 <ㅡ GET 방식으로 데이터 받기
    var title = queryData.id;
    var pathName = url.parse(_url, true).pathname;
    
    
    var control = `
        <a href="/create">CREATE</a> <a href="/update?id=${title}">UPDATE</a>
        <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
        </form>
    `;

    

    if (_url == '/') {
       title = 'Welcome';
       control = '<a href="/create">CREATE</a>';
    }
    response.writeHead(200);

    if (pathName == '/'){
        fs.readdir('./data', (err, fileList) => {                
            var filteredTitle = path.parse(title).base;
            fs.readFile(`data/${filteredTitle}`, 'utf-8', (err, description) => {
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description, {
                    allowedTags : ['h1', 'h2', 'h3', 'strong', 'a'],
                    allowedAttributes : {
                        'a': ['href']
                    }
                });
                var list = template.List(fileList);
                var HTML = template.HTML(sanitizedTitle, list, sanitizedDescription, control);
                response.end(HTML);
                //response.end(fs.readFileSync(__dirname + url));
            });

        });
    }else if (pathName == '/create'){
        fs.readdir('./data', (err, fileList) => {
            var title = 'WEB - CREATE';
            var list = template.List(fileList);
            var filteredTitle = path.parse(title).base;
            fs.readFile(`data/${filteredTitle}`, 'utf-8', (err, description) => {
                var HTML = template.HTML(title, list, `
                <form method="post" action="/create_process">
                    <input type="text" name="title" id="title" width:"200" placeholder="title">
                    <p>
                        <textarea name="description" rows="10" style="resize: none;" placeholder="description"></textarea>
                    </p>
                    <input type="submit" name="submit" id="submit" value="Submit">
                </form>
                `, '');

                response.end(HTML);
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
            var filteredTitle = path.parse(title).base;
            fs.writeFile(`data/${filteredTitle}`, description, 'utf-8', (err) => {
                response.writeHead(302, { 'Location': `/?id=${title}`})
                response.end('Success');
            });
        });
        
    }else if(pathName == '/update') {
        fs.readdir('./data', (err, fileList) => {
            var title = queryData.id;
            var list = template.List(fileList);
            var filteredTitle = path.parse(title).base;
            fs.readFile(`./data/${filteredTitle}`, 'utf-8', (err, description) => {
                var HTML = template.HTML(title, list, `
                <form method="post" action="/update_process">
                    <p><input type="text" name="id" id="title" width:"200" readonly value=${title} style="background:#eeeeee;"></p>
                    <p><input type="text" name="title" id="title" width:"200" placeholder="title" value=${title}></p>
                    <p>
                        <textarea name="description" rows="10" style="resize: none;" placeholder="description">${description}</textarea>
                    </p>
                    <input type="submit" name="submit" id="submit" value="Submit">
                </form>
                `, '');

                response.end(HTML);
                //response.end(fs.readFileSync(__dirname + url));
            });

        });

    }else if (pathName == '/update_process'){
        var body = '';
        request.on('data', (data)=>{
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            var filteredTitle = path.parse(title).base;
            fs.rename(`data/${id}`, `data/${filteredTitle}`, (err) => { //파일 이름 수정
                fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {  // 수정된 파일을 찾아 내용 쓰기
                    response.writeHead(302, {'Location':`/?id=${title}`});
                    response.end('Update Success');
                });
            });
        });
    } else if(pathName == '/delete_process'){
        var body = '';
        request.on('data',(data)=>{
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredTitle = path.parse(id).base;
            fs.unlink(`data/${filteredTitle}`, (err)=>{
                response.writeHead(302, {Location:'/'});
                response.end('Delete Success');
            });
        });
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
    

});
app.listen(3000);