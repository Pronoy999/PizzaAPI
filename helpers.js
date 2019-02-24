const crypt = require('crypto');
const https = require('https');
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
 * Method to generate the Hash of the Password.
 * @param password: The Password to be encrypted.
 * @returns {*} hash Password;
 */
helpers.getHash = function (password) {
    password = typeof (password) === 'string' && password.length > 0 ? password : false;
    if (password) {
        return crypt.createHmac('sha256', 'canyouguessmykey').update(password).digest('hex');
    } else {
        return false;
    }
};
/**
 * Method to send an email.
 * @param subject: The Email Subject.
 * @param to: Reciepent.
 * @param text: The Email Body.
 * @returns {Promise<any>}
 */
helpers.sendEmail = function (subject, to, text) {
    return new Promise((resolve, reject) => {
        subject = typeof (subject) === 'string' ? subject : false;
        to = typeof (to) === 'string' ? to : false;
        text = typeof (text) === 'string' ? text : false;
        if (subject && to && text) {
            const payload = {
                'from': 'Pronoy Pizza mailgun@sandboxb2f32a1062a2493cb03d6b4ef6847128.mailgun.org',
                to,
                subject,
                text
            };
            const payLoadString = JSON.stringify(payload);
            const requestObject = {
                protocol: "https:",
                hostname: "api.mailgun.net",
                method: "POST",
                path: "/v3/sandboxb2f32a1062a2493cb03d6b4ef6847128.mailgun.org",
                auth: "079846593d1e6e0cca72e81190118f77-9ce9335e-29601595",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(payLoadString),
                },
            };
            const request = https.request(requestObject, res => {
                const status = res.statusCode;
                if ([201, 200].indexOf(status) > -1) {
                    console.log("Email Send to ", to);
                    resolve(true);
                } else {
                    console.log("Couldn't send EMAIL.");
                    reject(false);
                }
            }).on("error", err => {
                console.error(err.stack);
                reject(false);
            });
            request.write(payLoadString);
            request.end();
        } else {
            reject(false);
        }
    });
};
/**
 * Exporting the helpers.
 */
module.exports = helpers;