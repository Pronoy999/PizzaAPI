const mysql = require('mysql');
const database = {};
const pool = mysql.createPool({
    host: 'hx-db.cy5gosef4el7.ap-south-1.rds.amazonaws.com',
    user: 'db_admin',
    database: 'pizza',
    password: 'hxadmin123',
    port: '3306'
});
database.query = function (queryStatement) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, con) {
            if (err) {
                reject(err);
                console.error(err.stack);
            } else {
                //console.log('Got Connection');
                con.query(queryStatement, function (err, results, fields) {
                    con.release();
                    if (err) {
                        reject(err);
                        console.error(err.stack);
                    } else {
                        resolve(results);
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
    });
};

module.exports = database;