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

                const token = helpers.generateToken(16);
                const query = "INSERT INTO users_data VALUES('','" + name + "','" + email +
                    "','" + password + "','" + address + "','" + token + "')";
                database.query(query).then(insertData => {
                    resolve([200, {'res': true, 'token': token}]);
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
 * Method to login for an existing User.
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
                const query = "SELECT * FROM users_data WHERE email LIKE '" + email + "' AND password LIKE '" + password + "'";
                database.query(query).then(selectData => {
                    if (selectData.length > 0) {
                        resolve([200, {'res': selectData[0].token}]);
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
        } else {
            reject([400, {'res': message.invalidRequestMethod}]);
        }
    });
};
users.menu = function (dataObject) {
    helpers.sendEmail("Test Email", "mukherjee.pronoy999@gmail.com", "This is a test message.").then(isSend => {
        console.log("Send.");
    }).catch(err => {
        console.error(err.stack);
    });
};
/**
 * Exporting the users.
 */
module.exports = users;
