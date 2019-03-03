const database = require('./databaseHandler');
const message = require('./Constants');
const helpers = require('./helpers');
const orders = {};
/**
 * Method to create a new Order.
 * @param dataObject: The Request Object.
 */
orders.create = function (dataObject) {
    return new Promise((resolve, reject) => {
        if (dataObject.method === 'post') {
            const token = typeof (dataObject.queryString.token) === 'string' ? dataObject.queryString.token : false;
            const orderItems = typeof (dataObject.postData.order_items) === 'object' &&
            dataObject.postData.order_items instanceof Array ? dataObject.postData.order_items : false;
            const totalPrice = Number(dataObject.postData.total_price) > 0 ?
                dataObject.postData.total_price : false;
            if (token && orderItems && totalPrice) {
                let query = "SELECT * FROM users_data WHERE token LIKE '" + token + "'";
                database.query(query).then(tokenData => {
                    if (tokenData.length > 0 && tokenData[0].id > 0) {
                        const userID = tokenData[0].id;
                        query = "INSERT INTO order_data VALUES(''," + userID + "," + totalPrice + ",0)";
                        database.query(query).then(insertData => {
                            const orderID = insertData.insertId;
                            let isComplete = true;
                            for (let i = 0; i < orderItems.length; i++) {
                                const id = orderItems[i];
                                let query = "INSERT INTO order_items VALUES(" + orderID + "," + id + ")";
                                database.query(query).then(insertData => {
                                    console.log(insertData.insertId);
                                }).catch(err => {
                                    isComplete = false;
                                    console.error(err.stack);
                                    reject([500, {'res': message.errorMessage}]);
                                });
                            }
                            if (isComplete) {
                                resolve([200, {'res': true, 'order_id': orderID}]);
                            }
                        }).catch(err => {
                            console.error(err.stack);
                            reject([500, {'res': message.errorMessage}]);
                        })
                    } else {
                        reject([403, {'res': message.accountDontExists}]);
                    }
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
 * exporting the orders.
 */
module.exports = orders;