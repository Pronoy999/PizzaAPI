const messages = {};
messages.invalidPath = "Invalid Path.";
messages.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
    'Access-Control-Max-Age': 2592000,
    'Access-Control-Allow-Headers': 'Content-Type'
};
messages.errorMessage="Error.";
messages.insufficientData="Insufficient Data";
messages.invalidRequestMethod="Invalid Request method.";


/**
 * Exporting the messages.
 */
module.exports = messages;