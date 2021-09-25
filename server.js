/*
 * @Author: dylan
 * @Date: 2021-09-20 16:03:39
 * @LastEditTime: 2021-09-23 15:56:45
 * @LastEditors: dylan
 * @Description: 
 * @FilePath: /node-chatroom/server.js
 */
const http       = require('http');
const fs         = require('fs');
const path       = require('path');
const mime       = require('mime');
const charServer = require('./lib/chat_server');

let cache = { };

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.getType(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath] !== undefined) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.open(absPath, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    send404(response);
                    return;
                }

                throw err;
            } else {
                fs.readFile(fd, (err, data) => {
                    if (err) {
                        send404(response);
                        return;
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }
        });
    }
}

let server = http.createServer(function(request, response) {
    let filePath = '';

    if (request.url === '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    let absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

charServer.listen(server);