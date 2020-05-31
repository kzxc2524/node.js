var url = require('url');
var qs = require('querystring');

var db = require('./db.js');
var template = require('./template.js');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, results, fields) => {
        db.query(`SELECT * FROM author`, (error2, authors, fields2) => {
            var title = 'Author';
            var description = template.authorHtml(authors);
            var authorCreate = `
                    <form method="post" action="/author/create_process">
                        <p><input type="text" name="name" width:"200" placeholder="name"></p>
                        <p>
                            <textarea name="profile" rows="10" style="resize: none;" placeholder="profile"></textarea>
                        </p>
                        <input type="submit" name="submit" id="submit" value="Submit">
                    </form>
                `;
            description += authorCreate;
            var control = '<a href="/">Home</a>';

            var list = template.List(results);
            var HTML = template.HTML(title, list, description, control, '');
            response.end(HTML);

            response.end('author');
        });
    });
}

exports.create_process = (request, response) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);
        var authorName = post.name;
        var authorProfile = post.profile;
        db.query(`INSERT INTO author (name, profile) VALUES (?,?)`, [authorName, authorProfile], (error, result, fields) => {
            if (error) {
                throw error;
            }
            response.writeHead(302, { 'Location': `/author` })
            response.end('Success');
        });
    });
}

exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (error, results, fields) => {
        db.query(`SELECT * FROM author`, (error2, authors, fields2) => {
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (error3, author, fields2) => {
                var title = 'Author';
                var description = template.authorHtml(authors);
                var authorUpdate = `
                        <form method="post" action="/author/update_process">
                            <p><input type="text" readonly name="id" value="${queryData.id}" width:"200" ></p>
                            <p><input type="text" name="name" value="${author[0].name}" width:"200" placeholder="name"></p>
                            <p>
                                <textarea name="profile" rows="10" style="resize: none;" placeholder="profile">${author[0].profile}</textarea>
                            </p>
                            <input type="submit" name="submit" id="submit" value="Submit">
                        </form>
                    `;
                description += authorUpdate;
                var control = '<a href="/">Home</a>';

                var list = template.List(results);
                var HTML = template.HTML(title, list, description, control, '');
                response.end(HTML);

                response.end('author');
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
        var authorId = post.id;
        var authorName = post.name;
        var authorProfile = post.profile;
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [authorName, authorProfile, authorId], (error, result, fields) => {
            response.writeHead(302, { Location: '/author' })
            response.end('')
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
        var authorId = post.id;
        db.query(`DELETE FROM author WHERE id=?`, [authorId], (error, result, fields) => {
            response.writeHead(302, { Location: '/author' })
            response.end('')
        });
    });
}