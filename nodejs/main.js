var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var templateObj = require('./lib/template.js');

var app = http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query //URL에서 quertString 가져오기
    var pathname = url.parse(_url, true).pathname //quertString  제외하고 URL가져오기
  
    
    response.writeHead(200)
    if(pathname == '/'){
        var title = queryData.id;
        var control = `
        <p><a href="/create">CREATE</a>
        <a href="/update?id=${title}">UPDATE</a>
        <form action="delete_process" method="post">
            <input type="hidden" name="title" value="${title}"/>
            <input type="submit" value="delete"/>
        </form>
        </p>`;
        fs.readdir('./data/', (err, fileList)=>{        
            fs.readFile(`./data/${title}`, 'utf-8', (err, description) => {
            if(queryData.id == undefined){
                title = 'WEB';
                description = 'The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.';
                control = '<p><a href="/create">CREATE</a></p>';
            }
        var List = templateObj.List(fileList);
        var template = templateObj.HTML(title,List,description,control);
        response.end(template)
            });
        });
    }else if(pathname == '/create'){
        fs.readdir('./data/', (err, fileList)=>{      
            var title = 'CREATE';
            var form = `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" /></p>
                <p><textarea name="description"></textarea></p>
                <p><input type="submit"></p>
            </form>
            `;
            var List = templateObj.List(fileList);
            var template = templateObj.HTML(title,List,form,'');

            response.end(template);
        });
    }else if(pathname == '/create_process'){
        var body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end',() => {
            var post = qs.parse(body);
  
            fs.writeFile(`./data/${post.title}`, post.description, (err) =>{
                response.writeHead(302, {Location:`/?id=${post.title}`})
                response.end('Success')
            });
        });

    }else if(pathname == '/update'){
        fs.readdir('./data/', (err, fileList)=>{        
            fs.readFile(`./data/${queryData.id}`, 'utf-8', (err, description) => {
            var title = 'UPDATE';
            var form = `
            <form action="/update_process" method="post">
                <p><input type="text" name="id" value="${queryData.id}" style="background:#ededed;" readonly /></p>
                <p><input type="text" name="title" value="${queryData.id}" /></p>
                <p><textarea name="description" >${description}</textarea></p>
                <p><input type="submit"></p>
            </form>
            `;
        var List = templateObj.List(fileList);
        var template = templateObj.HTML(title,List,form,'');
        response.end(template)
            });
        });
    }else if(pathname == '/update_process'){
       var body = '';
       request.on('data', (data) => {
           body += data;
       });
       request.on('end', ()=> {
           var post = qs.parse(body);
           fs.rename(`./data/${post.id}`,`./data/${post.title}`, (error) => {
            fs.writeFile(`./data/${post.title}`, `${post.description}`, 'utf-8', (err)=>{
                response.writeHead(302,{Location:`/?id=${post.title}`});
                response.end('Success');
            });
           });
       });
    }else if(pathname == '/delete_process'){
        var body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', ()=> {
            var post = qs.parse(body);
            fs.unlink(`./data/${post.title}`, (error) => {
                 response.writeHead(302,{Location:`/`});
                 response.end('Success');
            });
        });
     }else{
        response.writeHead(404);
        response.end('Not Found')
    }
});
    

app.listen(3000);