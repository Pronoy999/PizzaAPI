const mysql = require('mysql');
const database = {};
const pool = mysql.createPool({
    host: HOST,
    user: USER_NAME,
    database: DATABASE_NAME,
    password: PASSWORD,
    port: PORT_NUMBER
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
