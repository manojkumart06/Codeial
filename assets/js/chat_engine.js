class chatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

         // Initialize socket with CORS configuration
         this.socket = io.connect('http://localhost:5000', { transports: ['websocket', 'polling'], origins: 'http://localhost:8000' });
        
         /*The transports property specifies the transport methods to be used (websocket and polling), 
         and the origins property specifies the allowed origins.In this case, it allows connections from 'http://localhost:8000'.*/  

        if(this.userEmail){
            this.connectionHandler();
        }

    }
    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log("Connection Estalished using sockets...!");
        });

        self.socket.emit('join_room',{
            user_email : self.userEmail,
            chatroom : 'codieal'
        });

        self.socket.on('user_joined',function(data){
            console.log('user joined!',data);
        });

        //send a message on clicking the send message butto
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg!= ''){
                self.socket.emit('send_message',{
                    message : msg,
                    user_email : self.userEmail,
                    chatroom : 'codieal'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message recevied', data.message);

        let newMessage = $('<li>');

        let messageType = 'other-message';

        if(data.user_email == self.userEmail){
            messageType = 'self-message'
        }

        newMessage.append($('<span>',{
            'html' : data.message
        }));

        newMessage.append($('<sub>',{
            'html' : data.user_email
        }));

        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);

        });
    }
}

