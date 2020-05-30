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
            list += `<li><a href="/?id=${fileList[i].id}">${fileList[i].title}</a></li>`
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
    }
}

module.exports = template;