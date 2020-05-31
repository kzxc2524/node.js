var url = require('url');
var qs = require('querystring');
var snitizeHtml = require('sanitize-html');

var db = require('./db.js');
var template = require('./template.js');



exports.home = (request, response) => {
    db.query('SELECT * FROM  topic', function (error, results, fields) {
        title = 'Welcome';
        description = `The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.`;
        control = '<a href="/create">CREATE</a>';

        var list = template.List(results);
        var HTML = template.HTML(title, list, description, control, '');
        response.end(HTML);
    });
}

exports.page = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var control = `
        <a href="/create">CREATE</a> <a href="/update?id=${title}">UPDATE</a>
        <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
        </form>
    `;
    var description = '';

    db.query('SELECT * FROM  topic', function (error, results, fields) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic JOIN author ON topic.author_id = author.id WHERE topic.id=?`, [queryData.id], (error2, result, fields) => { //두번째 인자는 배열로 주고 첫번쨰 인자의 ?에 해당함
            if (error2) {
                throw error2;
            }
            title = snitizeHtml(result[0].title);
            description = snitizeHtml(result[0].description);
            var authors = `by ${snitizeHtml(result[0].name)}`;
            var list = template.List(results);
            var HTML = template.HTML(title, list, description, control, authors);
            response.end(HTML);
        });
    });
}

exports.create = (request, response) => {
    db.query('SELECT * FROM  topic', function (error, results, fields) {
        if (error) {
            throw error;
        }
        db.query('SELECT * FROM  author', function (error2, authors, fields) {
            if (error2) {
                throw error2;
            }
            var title = 'WEB - CREATE';
            var authorList = template.authorList(authors);
            var list = template.List(results);
            var HTML = template.HTML(title, list, `
                <form method="post" action="/create_process">
                    <p><input type="text" name="title" id="title" width:"200" placeholder="title"></p>
                    <select name="author">
                        ${authorList}
                    </select>
                    <p>
                        <textarea name="description" rows="10" style="resize: none;" placeholder="description"></textarea>
                    </p>
                    <input type="submit" name="submit" id="submit" value="Submit">
                </form>
                `, '', '');

            response.end(HTML);
        });
    });
}

exports.create_process = (request, response) => {
    var body = '';
    request.on('data', (data) => { //정보를 조각조각 내어 수신
        body += data;
    });

    request.on('end', () => { //정보수신 종료 후
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        var author = post.author;
        db.query('INSERT INTO topic (title,description,created,author_id) VALUES (?,?,Now(),?)', [title, description, author], function (error, result, fields) {
            if (error) {
                throw error;
            }
            response.writeHead(302, { 'Location': `/?id=${result.insertId}` })
            response.end('Success');

        });
    });
}

exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM  topic', function (error, results, fields) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, result, fields) => {
            if (error2) {
                throw error2;
            }
            db.query('SELECT * FROM  author', function (error3, authors, fields) {
                if (error3) {
                    throw error3;
                }

                var title = 'WEB - UPDATE';
                var authorList = template.authorList(authors, result[0].author_id);
                var list = template.List(results);
                var HTML = template.HTML(title, list, `
                    <form method="post" action="/update_process">
                        <p><input type="text" name="id" id="title" width:"200" readonly value=${result[0].id} style="background:#eeeeee;"></p>
                        <p><input type="text" name="title" id="title" width:"200" placeholder="title" value="${result[0].title}"></p>
                        <select name="author">
                            ${authorList}
                        </select>
                        <p>
                            <textarea name="description" rows="10" style="resize: none;" placeholder="description">${result[0].description}</textarea>
                        </p>
                        <input type="submit" name="submit" id="submit" value="Submit">
                    </form>
                    `, '', '');

                response.end(HTML);

            });
        });

    });
}

exports.update_process = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var author = post.author;
        var description = post.description;
        db.query('UPDATE topic SET title=?, description=?, created=Now(), author_id=? WHERE id=?', [title, description, author, id], function (error, result, fields) {
            if (error) {
                throw error;
            }
            response.writeHead(302, { 'Location': `/?id=${id}` })
            response.end('Success');

        });
    });
}

exports.delete_process = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        db.query('DELETE FROM topic WHERE id=?', [id], function (error, result, fields) {
            if (error) {
                throw error;
            }
            response.writeHead(302, { 'Location': `/` })
            response.end('Success');
        });
    });
}