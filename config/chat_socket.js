module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection recevied',socket.id);


        socket.on('disconnect', function(){
            console.log('socket disconnected!')
        });

        socket.on('join_room', function(data){
            console.log('joining request rec',data);

            //makes the user to join the room
            socket.join(data.chatroom);

            //telling all the users about new user joined in chatroom
            io.in(data.chatroom).emit('user_joined',data);
        });

        //detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })
    });
}