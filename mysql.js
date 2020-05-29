var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'nodejs_mysql'
});

connection.connect();

connection.query('SELECT * FROM  topic', function (error, results, fields) {
    console.log(results);
});

connection.end();