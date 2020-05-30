var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'nodejs_mysql'
});
db.connect();

module.exports = db;