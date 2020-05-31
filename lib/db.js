var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'nodejs_mysql',
    // multipleStatements : true // 다중 쿼리 사용시 true -> injection 위험이 있음, db.escape()로 방지 가능
});
db.connect();

module.exports = db;