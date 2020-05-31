var snitizeHtml = require('sanitize-html');

var template = {
    HTML: (title, list, description, _control, authors) => {
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
                    <h2><a href="/author">author</a></h2>           
                    ${list}
                    <p>${_control}</p>         
                    
                    <h2>${title}</h2>                
                    <p>
                        ${description}<br/><br/>
                        ${authors}
                    </p>
                </body>
                </html>    
                `;
        return template;
    },
    List: (fileList) => {
        var list = '<ul>';
        for (var i = 0; i < fileList.length; i++) {
            list += `<li><a href="/?id=${fileList[i].id}">${snitizeHtml(fileList[i].title)}</a></li>`
        }
        list += '</ul >';
        return list;
    },
    authorList: (authors, author_id) => {                
        var list = '';     
        for (var i = 0; i < authors.length; i++) {
            var selected = '';
            if (authors[i].id === author_id){
                selected = 'selected';
            }
            list += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;           
        }
        return list;
    },
    authorHtml: (authors) => {
        var authorList = '<tbody>';
        for (var i = 0; i < authors.length; i++) {
            authorList += `
                    <tr>
                        <td>${snitizeHtml(authors[i].name)}</td>
                        <td>${snitizeHtml(authors[i].profile)}</td>
                        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                        <td>
                            <form action="/author/delete_process" method="post">
                                <input type="hidden" name="id" value="${authors[i].id}">
                                <input type="submit" value="delete">
                            </form>
                        </td>
                    </tr>`;
        }
        authorList += '</tbody>';

        var description = `
                    <table>
                        <colgroup>
                            <col width="10%">
                            <col width="*%">
                            <col width="12%">
                            <col width="12%">
                        </colgoup>
                        <thead>
                            <tr>
                                <th scopre="col">Name</th>
                                <th scopre="col">Profile</th>
                                <th scopre="col">Update</th>
                                <th scopre="col">Delete</th>
                            </tr>
                        </thead>
                        ${authorList}
                    </table>
                `;
        return description;
    }
}

module.exports = template;