/*
 * @Author: dylan
 * @Date: 2021-09-23 23:06:04
 * @LastEditTime: 2021-09-24 16:11:08
 * @LastEditors: dylan
 * @Description: 
 * @FilePath: /node-chatroom/public/js/chat.js
 */
function Chat (socket)
{
    this.socket = socket;
}

Chat.prototype.sendMessage = function (text) {
    this.socket.emit("message", { text: text });
}

Chat.prototype.joinRoom = function (room) {
    this.socket.emit("join", room);
}

Chat.prototype.processCommand = function (input) {
    let words = input.split(' ');
    let command = words[0].substring(1, words[0].length).toLowerCase();
    let message = true;

    switch (command) {
        case "join":
            words.shift();
            let room = words.join('');
            this.joinRoom(room);
            break;
        case "nick":
            words.shift();
            let name = words.join('');
            this.socket.emit("rename", name);
            break;
        default:
            message = false;
            break;
    }

    return message;
}