const express = require('express');
const app= express();
const http=require('http');
const cors = require('cors');
const {Server}= require('socket.io')

app.use(cors()); // cors is for access control 

const server =http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:'*', // cors access requests from all origins 
        methods: ['GET','POST'] //which methods should be accepted 
    }
});

server.listen(3001,()=>{
    console.log('SERVER IS DOING THE RUNS FOR THOSE BUNNS')
})

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });

io.on('connection', (socket) => {
    console.log(socket.id + ' id is connected');

    socket.on('joinRoom',(data)=>{
        console.log(data.name+ ' has joined room : '+ data.room)
        socket.join(data.room)
    })

    socket.on('send-message',(data)=>{
        
        socket.to(data.room).emit('receive-message',data);
        console.log(data)

    })
    socket.on('restart',(data)=>{
        console.log('inside restart game')
        
        socket.to(data.room).emit('restartGame',data);
        console.log(data)

    })

    socket.on('play',(data)=>{
        
        console.log('player  played on tile ' +data.number );
        socket.to(data.room).emit('update-game', data );
    })
    

    
    socket.on('disconnect', () => {
      console.log('user '+ socket.id +' disconnected');
    });
  });