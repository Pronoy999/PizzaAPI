const mysql = require('mysql');
const database = {};
const pool = mysql.createPool({
    'host': 'pronoy-db.co4ceq5hj2um.us-east-1.rds.amazonaws.com',
    'username': 'Pronoy999',
    'password': 'earth999',
    'database': 'test',
    'port': '3306'
});
database.query = function (queryStatement, callback) {
    //console.log('In Query.');
    pool.getConnection(function (err, con) {
        if (err) {
            callback(err);
            console.log(err);
        } else {
            //console.log('Got Connection');
            con.query(queryStatement, function (err, results, fields) {
                con.release();
                if (err) {
                    callback(err);
                    console.log(err);
                } else {
                    callback(false, results);
                }
            });
        }
        /*pool.on('release', function (con) {
            //Released.
        });
        pool.on('acquire', function (con) {
            //Acquired.
        });*/
    });
};

module.exports = database;