const messages = require('./Constants');
const handlers = {};
const users = require('./Users');
const orders = require('./Orders');
const database = require('./databaseHandler');
const helpers = require('./helpers');
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
            case "data":
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
/**
 * Handler to handle the  Order Requests.
 * @param dataObject: The Data object.
 * @returns {Promise<any>}
 */
handlers.order = function (dataObject) {
    return new Promise((resolve, reject) => {
        let promise;
        switch (dataObject.path) {
            case "new":
                promise = orders.create(dataObject);
                break;
            default:
                reject([400, {'res': messages.invalidPath}]);
                break;
        }
        promise.then(response => {
            resolve(response);
        }).catch(err => {
            reject(err);
        })
    });
};
/**
 * Method to make the payment for an existing Order.
 * @param dataObject: The request Object.
 * @returns {Promise<any>}
 */
handlers.payment = function (dataObject) {
    return new Promise((resolve, reject) => {
        if (dataObject.method === 'post') {
            const token = typeof (dataObject.queryString.token) === 'string' &&
            dataObject.queryString.token.length > 0 ? dataObject.queryString.token : false;
            const orderID = Number(dataObject.postData.order_id) > 0 ? dataObject.postData.order_id : false;
            const price = Number(dataObject.postData.total_price) > 0 ? dataObject.postData.total_price : false;
            if (token && orderID && price) {
                let query = "SELECT * FROM users_data WHERE token LIKE '" + token + "'";
                database.query(query).then(tokenData => {
                    if (tokenData.length > 0 && tokenData[0].token === token) {
                        query = "SELECT * FROM order_data WHERE id = " + orderID;
                        database.query(query).then(orderData => {
                            if (orderData.length > 0 && orderData[0].id === orderID) {
                                if (Number(orderData[0].total_price) === price && orderData[0].is_paid === 0) {
                                    helpers.makePayment(price, "Payment for Order " + orderID, "usd")
                                        .then(paymentData => {
                                            console.log(paymentData);
                                            helpers.sendEmail("Payment for Order ID: " + orderID,
                                                tokenData[0].email, "Your Order has been Confirmed.")
                                                .then(mailData => {
                                                    query = "UPDATE order_data SET is_paid=1 WHERE id = " + orderID;
                                                    database.query(query).then(updateData => {
                                                        resolve([200, {'res': true}]);
                                                    }).catch(err => {
                                                        console.error(err.stack);
                                                        reject([500, {'res': messages.errorMessage}]);
                                                    });
                                                }).catch(err => {
                                                reject([500, {'res': messages.errorMessage}]);
                                            });
                                        }).catch(err => {
                                        console.error(err);
                                        reject([400, {'res': messages.errorMessage}]);
                                    });
                                } else {
                                    reject([400, {'res': messages.invalidPaymentData}]);
                                }
                            } else {
                                reject([400, {'res': messages.invalidOrderID}]);
                            }
                        }).catch(err => {
                            reject([500, {'res': messages.errorMessage}]);
                        })
                    } else {
                        reject([403, {'res': messages.invalidToken}]);
                    }
                }).catch(err => {
                    reject([500, {'res': messages.errorMessage}]);
                });
            } else {
                reject([400, {'res': messages.insufficientData}]);
            }
        } else {
            reject([400, {'res': messages.invalidRequestMethod}]);
        }
    });
};
/**
 * Exporting the Handlers.
 */
module.exports = handlers;