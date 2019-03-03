const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helpers = require('./helpers');
const message = require('./Constants');
const router = {
    'users': handlers.users,
    'orders':handlers.order,
    'payment':handlers.payment
};

const unifiedServer = function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    let trimmedPath = pathName.replace(/^\/+|\/+$/g, '');
    let actualPath = trimmedPath.substring(trimmedPath.indexOf('/') + 1);
    trimmedPath = trimmedPath.split("/")[0];
    //console.log(actualPath);
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const decoder = new stringDecoder('utf-8');
    let postData = "";
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    req.on('data', function (data) {
        postData += decoder.write(data);
    });
    req.on('end', function () {
        postData += decoder.end();
        postData = helpers.parseToJSON(postData);
        const data = {
            postData,
            queryString,
            'path': actualPath,
            method
        };
        execHandlers(data);
    });

    function execHandlers(data) {
        /**
         * Method to send the response.
         * @param responseData: the Response Object to be send.
         * @param statusCode: the status code.
         */
        function sendResponse(responseData, statusCode) {
            responseData = typeof (responseData) === 'object' ? responseData : {};
            statusCode = typeof (statusCode) === 'number' ? statusCode : 400;
            const responseObject = JSON.stringify(responseData);
            try {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCode, message.headers);
                res.end(responseObject);
                console.log('Returning: ', responseObject, "For Path ", trimmedPath, statusCode);
            } catch (e) {
                console.log(e);
            }
        }

        chosenHandler(data).then(response => {
            sendResponse(response[1], response[0]);
        }).catch(response => {
            sendResponse(response[1], response[0]);
        });
    }
};
const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

httpServer.listen(7009, function () {
    console.log("Server Listening on Port 7009");
});