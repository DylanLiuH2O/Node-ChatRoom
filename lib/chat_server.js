/*
 * @Author: dylan
 * @Date: 2021-09-20 19:50:43
 * @LastEditTime: 2021-09-25 20:06:58
 * @LastEditors: dylan
 * @Description: 
 * @FilePath: /node-chatroom/lib/chat_server.js
 */
const socketio = require("socket.io");

let io;
let guestNumber = 1;
let nickNames = { };
let namesUsed = [];
let currentRoom = { };

let MessageType = {
    System: 0,
    Normal: 1
};

function assignGuestName(socket)
{
    let name = "Guest" + guestNumber;
    nickNames[socket.id] = name;
    socket.emit("naemResult", {
        success: true,
        name: name
    });
    namesUsed.push(name);

    return guestNumber + 1;
}

function joinRoom(socket, room)
{
    if (currentRoom[socket.id] === room) {
        socket.emit("joinResult", {
            success: false,
            text: "You are already in this room."
        });
        return;
    }

    if (currentRoom !== undefined) {
        socket.leave(currentRoom[socket.id]);
    }
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit("joinResult", { 
        success: true,
        room: room 
    });
    socket.to(room).emit("message", {
        type: MessageType.System,
        text: nickNames[socket.id] + " has joined " + room + "."
    });

    let usersInRoom = io.of("/").adapter.rooms.get(room);
    if (usersInRoom.size > 1) {
        let usersInRoomSummary = "Users currently in " + room + ": ";
        let index = 0;
        for (let userSocketId of usersInRoom.values()) {
            if (userSocketId !== socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ", ";
                }
                usersInRoomSummary += nickNames[userSocketId];
                index++;
            }
        }
        usersInRoomSummary += ".";
        socket.emit("message", {
            type: MessageType.System,
            text: usersInRoomSummary
        });
    }
}

function listen(server)
{
    io = new socketio.Server();
    io.listen(server);

    console.log("Chat server is listening...");

    io.on("connection", socket => {
        socket.emit("message", { 
            type: MessageType.System, 
            text: socket.id 
        });
        guestNumber = assignGuestName(socket);
        joinRoom(socket, "public-square");
        
        console.log(`new user connnected, sockedId: ${socket.id}, nickname: ${namesUsed[namesUsed.length-1]}`);

        socket.on("join", (room) => {
            joinRoom(socket, room);
        });

        socket.on("rename", (name) => {
            if (name === nickNames[socket.id]) {
                socket.emit("renameResult", { 
                    success: false, 
                    message: "The new name cannot be the same." 
                });
            } else {
                let index = namesUsed.indexOf(name);
                if (index !== -1) {
                    socket.emit("renameResult", { 
                        success: false, 
                        message: "The name has already existed." 
                    });
                } else {
                    let oldname = nickNames[socket.id];
                    namesUsed.push(name);
                    nickNames[socket.id] = name;
                    delete namesUsed[namesUsed.indexOf(oldname)];
                    socket.emit("renameResult", { 
                        success: true, 
                        name: name
                    })
                    socket.to(currentRoom[socket.id]).emit("message", {
                        type: MessageType.System,
                        text: `${oldname} is now known as ${name}`
                    })
                    console.log(`socketId: ${socket.id}, has changed name \"${oldname}\" to \"${name}\".`);
                }
            }
        });

        socket.on("message", (message) => {
            socket.to(currentRoom[socket.id]).emit("message", { 
                type: MessageType.Normal,
                room: currentRoom[socket.id],
                nickname: nickNames[socket.id], 
                text: message.text 
            });
        })

        socket.on("rooms", () => {
            // console.log([...io.of("/").adapter.rooms.keys()]);
            socket.emit("rooms", [...io.of("/").adapter.rooms.keys()]);
        });

        socket.on("disconnect", () => {
            let name = nickNames[socket.id];
            let index = namesUsed.indexOf(nickNames[socket.id]);
            delete namesUsed[index];
            delete nickNames[socket.id];
            console.log(`${name} disconnected.`);
        });
    });

}

exports.listen = listen;