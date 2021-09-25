<!--
 * @Author: dylan
 * @Date: 2021-09-25 15:32:02
 * @LastEditTime: 2021-09-25 21:09:51
 * @LastEditors: dylan
 * @Description: 
 * @FilePath: /node-chatroom/README.md
-->

# A simple web-chatroom based on [Socket.IO](https://socket.io/)

This is my very first Node.js application, just for practicing.  

## Features (maybe continue to improve)

- join in a room (create or change)
- send message
- change nickname

## Usage

Run these following commands in terminal.  

```shell
npm install
node server.js
```

Then the app will be run on `localhost:3000/index.html`.  

## Demonstration

![1.gif](./img/1.gif)

## Bugs

- if the client leave their own default room by using `socket.leave(room)`, it will receive the message from itself.

## References  

[*JavaScript: The Good Parts*](https://www.amazon.com/dp/0596517742/ref=cm_sw_r_tw_dp_9FFQ6HYPCTD6Z0A6WVAZ)  

[*Node.js in Action* (The 1st edition was out of date, many apis in this book have changed, highly reccommand the 2nd edition.)](https://www.amazon.com/dp/1617290572/ref=cm_sw_r_tw_dp_B7QNWSVS31T9XG2XBWCG)  

# 一个基于[Sock.IO](https://socket.io)的简单web聊天室  

这是一个用于练习Node.js的简单demo。

## 功能

- 加入房间（创建或切换）
- 发送消息
- 更改昵称

## 使用方法

在已经安装Node.js的环境中，在终端中执行以下命令。

```shell
npm install
node server.js
```

接着聊天室就会在 `localhost:3000/index.html`上运行.  

## 演示

![1.gif](./img/1.gif)

## 已知的问题

- 如果客户端使用`socket.leave()`离开自己的默认房间，那么之后它会收到自己发送的消息。

## 参考资料

[《JavaScript语言精粹》](https://book.douban.com/subject/3590768/)  

[《Node.js实战》第一版（第一版已经过时了，里面涉及到的很多api已经不一样了，强烈建议看第二版）](https://book.douban.com/subject/25870705/)  
