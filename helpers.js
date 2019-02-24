const helpers = {};
helpers.parseToJSON = function (data) {
    let obj = {};
    try {
        obj = JSON.parse(data);
        return obj;
    } catch (e) {
        return {};
    }
};
/**
 * Method to generate the RANDOM token.
 * @param len: the Length of the token.
 * @returns {string}: token.
 */
helpers.generateToken = function (len) {
    const possibleCharaters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    len = typeof (len) === 'number' && len > 0 ? len : 16;
    let key = '';
    for (let i = 1; i <= len; i++) {
        key += possibleCharaters.charAt(Math.floor(Math.random() * possibleCharaters.length));
    }
    return key;
};
/**
 * Exporting the helpers.
 */
module.exports = helpers;