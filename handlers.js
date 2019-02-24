const messages = require('./Constants');
const handlers = {};
const users = require('./Users');
/**
 * Send the default Response.
 * @param dataObject
 */
handlers.notFound = function (dataObject) {
    return new Promise((resolve, reject) => {
        reject([400, {'res': messages.invalidPath}]);
    });
};
/**
 * Method to handle the Users Request.
 * @param dataObject
 * @returns {Promise<any>}
 */
handlers.users = function (dataObject) {
    return new Promise((resolve, reject) => {
        let promise;
        switch (dataObject.path) {
            case "new":
                promise = users.create(dataObject);
                break;
            case "login":
                promise = users.login(dataObject);
                break;
            case "menu":
                promise = users.menu(dataObject);
                break;
            default:
                reject([400, {'res': messages.invalidPath}]);
                break;
        }
        promise.then(response => {
            resolve(response);
        }).catch(response => {
            reject(response);
        });
    });
};

module.exports = handlers;