var templateObj = {
    HTML : (title,List,description,control) => {
        return`
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${List}
            ${control}
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>
        `;
    },
    List : (fileList) => {
        var List = '<ul>';
        for(var i=0; i < fileList.length; i++){
            List += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        }
        List += '</ul>';
        return List;
    }
}

module.exports = templateObj;