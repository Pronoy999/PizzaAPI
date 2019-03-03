const messages = {};
messages.invalidPath = "Invalid Path.";
messages.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
    'Access-Control-Max-Age': 2592000,
    'Access-Control-Allow-Headers': 'Content-Type'
};
messages.errorMessage = "Error.";
messages.insufficientData = "Insufficient Data";
messages.invalidRequestMethod = "Invalid Request method.";
messages.invalidPaymentData = "Invalid Payment Data";
messages.invalidToken = "Invalid Token.";
messages.invalidOrderID = "Order ID doesn't exists.";
messages.accountDontExists = "we couldn't find an account matching the combination of this email and password.";


/**
 * Exporting the messages.
 */
module.exports = messages;