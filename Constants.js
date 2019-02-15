const messages = {};
messages.invalidPath = "Invalid Path.";
messages.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
    'Access-Control-Max-Age': 2592000,
    'Access-Control-Allow-Headers': 'Content-Type'
};


/**
 * Exporting the messages.
 */
module.exports = messages;