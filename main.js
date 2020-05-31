var http = require('http');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');
var db = require('./lib/db.js');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // true면 객체형식으로, false면 문자열 형식으로 가져옴 <ㅡ GET 방식으로 데이터 받기
    var pathName = url.parse(_url, true).pathname;    
    
    response.writeHead(200);

    if (pathName == '/'){
        if (queryData.id === undefined){
            topic.home(request, response);
        }else{
            topic.page(request, response);
        }
    }else if (pathName == '/create'){
        topic.create(request, response);
    } else if (pathName == '/create_process'){
        topic.create_process(request, response);
    }else if(pathName == '/update') {
        topic.update(request, response);
    }else if (pathName == '/update_process'){
        topic.update_process(request, response);
    }else if(pathName == '/delete_process'){
        topic.delete_process(request, response);
    }else if (pathName == '/author') {
        author.home(request, response);
    }else if (pathName == '/author/create_process') {
        author.create_process(request, response);
    }else if (pathName == '/author/update'){
        author.update(request, response);
    }else if (pathName == '/author/update_process') {
        author.update_process(request, response);
    }else if (pathName == '/author/delete_process') {
        author.delete_process(request, response);
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
    

});
app.listen(3000);