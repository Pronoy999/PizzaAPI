const messages = require('./Constants');
const handlers = {};
handlers.notFound = function (dataObject, callback) {
    callback(true, 400, {'res': messages.invalidPath});
};
handlers.users = function (dataObject, callback) {
    const path=dataObject.path;
    
};

module.exports = handlers;