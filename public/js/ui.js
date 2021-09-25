/*
 * @Author: dylan
 * @Date: 2021-09-23 23:06:09
 * @LastEditTime: 2021-09-24 19:20:14
 * @LastEditors: dylan
 * @Description: 
 * @FilePath: /node-chatroom/public/js/ui.js
 */
let MessageType = {
    System: 0,
    Normal: 1
};

function processUserInput(chatApp)
{
    let message = $('#send-message').val();

    if (message.charAt(0) === '/') {
        let command = chatApp.processCommand(message);
        if (command === true) {
            $('#messages').append($('<div></div>').html('<i>' + message + '</i>'));
        }
    } else {
        chatApp.sendMessage(message);
        $('#messages').append($('<div></div>').text(message).css('text-align', 'right'));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
    $('#send-message').focus();
}

let socket = io.connect();

$(document).ready(() => {
    let chatApp = new Chat(socket);

    socket.on("joinResult", result => {
        if (result.success === true) {
            $('#room').text(result.room);
        } else {
            $('#messages').append($('<div></div>').html('<i>' + result.text + '</i>'));
        }
    });

    socket.on("renameResult", result => {
        let message;

        if (result.success === true) {
            message = "You are now known as " + result.name + ".";
        } else {
            message = result.message;
        }
        $('#messages').append($('<div></div>').html('<i>' + message + '</i>'));
    });

    socket.on("message", message => {
        switch (message.type) {
            case MessageType.Normal:
                $('#messages').append($('<div></div>').text(message.nickname + ": " + message.text));
                break;
            case MessageType.System:
                $('#messages').append($('<div></div>').html('<i>' + message.text + '</i>').css('color', 'red'));
                break;
            default:
                break;
        }
    });

    socket.on("rooms", rooms => {
        $('#room-list').empty();

        // console.log(rooms);
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i] !== '') {
                $('#room-list').append($('<div></div>').text(rooms[i]));
            }
        }

        $('#room-list div').click((e) => {
            chatApp.processCommand("/join " + $(e.currentTarget).text());
            $('#send-message').focus();
        });
    });

    setInterval(() => {
        socket.emit("rooms");
    }, 1000);

    $('#send-form').focus();

    $('#send-form').submit(() => {
        processUserInput(chatApp);
        return false;
    });
});