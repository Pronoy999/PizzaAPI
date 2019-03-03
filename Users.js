const users = {};
const helpers = require('./helpers');
const database = require('./databaseHandler');
const message = require('./Constants');
/**
 * Method to create a new User.
 * @param dataObject: the Request Object.
 * @returns {Promise<any>}: promise.
 */
users.create = function (dataObject) {
    return new Promise((resolve, reject) => {
        if (dataObject.method === 'post') {
            const name = typeof (dataObject.postData.name) === 'string' ? dataObject.postData.name : false;
            const email = typeof (dataObject.postData.email) === 'string' ? dataObject.postData.email : false;
            const password = typeof (dataObject.postData.password) === 'string' ?
                helpers.getHash(dataObject.postData.password) : false;
            const address = typeof (dataObject.postData.address) === 'string' ? dataObject.postData.address : false;
            if (name && email && password && address) {
                //const token = helpers.generateToken(16);
                const query = "INSERT INTO users_data VALUES('','" + name + "','" + email +
                    "','" + password + "','" + address + "','')";
                console.log(query);
                database.query(query).then(insertData => {
                    resolve([200, {'res': true}]);
                }).catch(err => {
                    console.error(err.stack);
                    reject([500, {'res': message.errorMessage}]);
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else if (dataObject.method === 'put') {
            const name = typeof (dataObject.postData.name) === 'string' ? dataObject.postData.name : false;
            const email = typeof (dataObject.postData.email) === 'string' ? dataObject.postData.email : false;
            let password = typeof (dataObject.postData.password) === 'string' ?
                helpers.getHash(dataObject.postData.password) : false;
            const address = typeof (dataObject.postData.address) === 'string' ? dataObject.postData.address : false;
            if (email && (name || password || address)) {
                let setClause = "SET ";
                if (name) {
                    setClause += " name = '" + name + "',";
                }
                if (password) {
                    password = helpers.getHash(password);
                    setClause += "password = '" + password + "',";
                }
                if (address) {
                    setClause += "address = '" + address + "',";
                }
                setClause = setClause.substring(0, setClause.length - 1);
                const query = "UPDATE users_data " + setClause + " WHERE email LIKE '" + email + "'";
                database.query(query).then(updateData => {
                    resolve([200, {'res': true}]);
                }).catch(err => {
                    console.error(err.stack);
                    reject([500, {'res': message.errorMessage}]);
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else if (dataObject.method === 'delete') {
            const email = typeof (dataObject.postData.email) === 'string' ? dataObject.postData.email : false;
            const query = "DELETE FROM users_data WHERE email LIKE '" + email + "'";
            if (email) {
                database.query(query).then(deleteData => {
                    resolve([200, {'res': true}]);
                }).catch(err => {
                    reject([500, {'res': message.errorMessage}])
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else {
            reject([400, {'res': message.invalidRequestMethod}]);
        }
    });
};
/**
 * Method to login for an existing User.
 * DELETE Method to log out a user.
 * @param dataObject: the Request object.
 * @returns {Promise<any>}
 */
users.login = function (dataObject) {
    return new Promise((resolve, reject) => {
        if (dataObject.method === 'post') {
            const email = typeof (dataObject.postData.email) === 'string' ? dataObject.postData.email : false;
            const password = typeof (dataObject.postData.password) === 'string' ?
                helpers.getHash(dataObject.postData.password) : false;
            if (email && password) {
                let query = "SELECT * FROM users_data WHERE email LIKE '" + email + "' AND password LIKE '" + password + "'";
                database.query(query).then(selectData => {
                    if (selectData.length > 0 && selectData[0].email === email && selectData[0].password === password) {
                        const token = helpers.generateToken(16);
                        query = "UPDATE users_data SET token = '" + token + "' WHERE email LIKE '" + email + "'";
                        database.query(query).then(updateData => {
                            resolve([200, {'res': token}]);
                        }).catch(err => {
                            reject([500, {'res': message.errorMessage}]);
                        });
                    } else {
                        reject([200, {'res': message.accountDontExists}]);
                    }
                }).catch(err => {
                    console.error(err.stack);
                    reject([500, {'res': message.errorMessage}]);
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else if (dataObject.method === 'delete') {
            const token = typeof (dataObject.queryString.token) === 'string' ? dataObject.queryString.token : false;
            if (token) {
                let query = "SELECT * FROM users_data WHERE token LIKE '" + token + "'";
                database.query(query).then(tokenData => {
                    if (tokenData.length > 0) {
                        query = "UPDATE users_data SET token = '' WHERE token LIKE '" + token + "'";
                        database.query(query).then(updateData => {
                            resolve([200, {'res': true}]);
                        }).catch(err => {
                            reject([500, {'res': message.errorMessage}]);
                        });
                    }
                }).catch(err => {
                    reject(403, {'res': message.invalidToken});
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else {
            reject([400, {'res': message.invalidRequestMethod}]);
        }
    });
};
/**
 * Method to get the Menu.
 * @param dataObject: The Request Object.
 * @returns {Promise<any>}
 */
users.menu = function (dataObject) {
    return new Promise((resolve, reject) => {
        if (dataObject.method === 'get') {
            const token = typeof (dataObject.queryString.token) === 'string' ? dataObject.queryString.token : false;
            if (token) {
                let query = "SELECT * FROM users_data WHERE token LIKE '" + token + "'";
                database.query(query).then(selectData => {
                    if (selectData.length > 0 && selectData[0].token === token) {
                        query = "SELECT * FROM menu";
                        database.query(query).then(menuData => {
                            resolve([200, {'res': menuData}]);
                        }).catch(err => {
                            console.error(err.stack);
                            reject([500, {'res': message.errorMessage}]);
                        });
                    } else {
                        reject([403, {'res': message.accountDontExists}]);
                    }
                }).catch(err => {
                    console.error(err.stack);
                    reject([500, {'res': message.errorMessage}]);
                });
            } else {
                reject([400, {'res': message.insufficientData}]);
            }
        } else {
            reject([400, {'res': message.invalidRequestMethod}]);
        }
    });
};
/**
 * Exporting the users.
 */
module.exports = users;
