var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path'); //*보안이슈 파일을 읽을 때 경로가 오염된는 것을 방지
var sanitizeHtml = require('sanitize-html'); //원하지 않는 태그를 막는 npm 모듈
var mysql = require('mysql');

var template = require('./lib/template.js')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'nodejs_mysql'
});
db.connect();

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

    var description = '';

    if (_url == '/') {
       
    }
    response.writeHead(200);

    if (pathName == '/'){
        if (queryData.id === undefined){
            db.query('SELECT * FROM  topic', function (error, results, fields) {
            title = 'Welcome';
            description = `The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.`;
            control = '<a href="/create">CREATE</a>';
            
            var list = template.List(results);
            var HTML = template.HTML(title, list, description, control);
            response.end(HTML);
            });
        }else{
            db.query('SELECT * FROM  topic', function (error, results, fields) {
                if (error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, result, fields) => { //두번째 인자는 배열로 주고 첫번쨰 인자의 ?에 해당함
                    if (error2) {
                        throw error2;
                    }
                    title = result[0].title;
                    description = result[0].description;
                    var list = template.List(results);
                    var HTML = template.HTML(title, list, description, control);
                    response.end(HTML);
                });
            });
        }
    }else if (pathName == '/create'){
        db.query('SELECT * FROM  topic', function (error, results, fields) {
            if (error) {
                throw error;
            }
            var title = 'WEB - CREATE';
            var list = template.List(results);
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
            db.query('INSERT INTO topic (title,description,created,author_id) VALUES (?,?,Now(),?)', [title, description, 1],function (error, result, fields) {
                if(error){
                    throw error;
                }
                response.writeHead(302, { 'Location': `/?id=${result.insertId}` })
                response.end('Success');

            });
        });
        
    }else if(pathName == '/update') {
        db.query('SELECT * FROM  topic', function (error, results, fields) {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, result, fields) => {
                var title = 'WEB - CREATE';
                var list = template.List(results);
                var HTML = template.HTML(title, list, `
                <form method="post" action="/update_process">
                    <p><input type="text" name="id" id="title" width:"200" readonly value=${result[0].id} style="background:#eeeeee;"></p>
                    <p><input type="text" name="title" id="title" width:"200" placeholder="title" value="${result[0].title}"></p>
                    <p>
                        <textarea name="description" rows="10" style="resize: none;" placeholder="description">${result[0].description}</textarea>
                    </p>
                    <input type="submit" name="submit" id="submit" value="Submit">
                </form>
                `, '');

                response.end(HTML);

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
            db.query('UPDATE topic SET title=?, description=?, created=Now() WHERE id=?', [title, description, id], function (error, result, fields) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, { 'Location': `/?id=${id}` })
                response.end('Success');

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
            db.query('DELETE FROM topic WHERE id=?', [id], function (error, result, fields) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, { 'Location': `/` })
                response.end('Success');

            });
        });
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
    

});
app.listen(3000);