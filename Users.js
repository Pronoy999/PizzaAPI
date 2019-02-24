const users = {};
const helpers = require('./helpers');
const database = require('./databaseHandler');
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
            const password = typeof (dataObject.postData.password) === 'string' ? dataObject.postData.password : false;
            const address = typeof (dataObject.postData.address) === 'string' ? dataObject.postData.address : false;
            if (name && email && password && address) {
                const token = helpers.generateToken(16);
                const query = "INSERT INTO users VALUES('','" + name + "','" + email + "','" + password + "','" + address + "','" + token + "')";
                database.query(query).then(insertData => {
                    resolve([200, {'res': true, 'token': token}]);
                }).catch(err => {
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
