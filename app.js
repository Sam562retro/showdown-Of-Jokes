const express = require('express');
const app = express()
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const {spawn} = require('child_process');
const socketIo = require('socket.io');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, giveAllRooms, createRoom} = require('./utils/users');
const io = new socketIo.Server(server);
const bodyParser = require('body-parser');

app.use(express.static(path.resolve(__dirname, './public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

var numClients = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('joinRoom', ({
        username, room
    }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        if (numClients[room] == undefined) {
            numClients[room] = 1;
        } else if(numClients[room] < 2){
            numClients[room]++;
        } else{
            socket.emit('leaveRoom');
            socket.leave(user.room);
        }
    })


    socket.on('joke', ({
        joke, person
    }) => {
        const user = getCurrentUser(socket.id);
        console.log(joke);
        io
            .to(user.room)
            .emit('load', {
                person
            })

        var dataToSend;
        const python = spawn('python', ['bardCall.py', joke]);
        
        python.stdout.on('data', function (data) {
            dataToSend = data.toString();
        });

        python.on('close', (code) => {
            console.log(dataToSend);
            io
            .to(user.room)
            .emit('ans', {
                dataToSend, person
            })
        });


        io
            .to(user.room)
            .emit('jokeRec', {
                joke, sender: person
            })
    })

    socket.on('disconnect', () => {
      const user = getCurrentUser(socket.id);
      numClients[user.room]--;
      console.log('user disconnected');

    });
  });




app.get('/', (req, res) => {
    res.render('home');
});

app.post('/', (req, res) => {
    if (numClients[req.body.room] == undefined) {
        res.redirect(301, `/chat?username=${req.body.username}&room=${req.body.room}&p=1`);
    } else if (numClients[req.body.room]==1){
        console.log(2)
        res.redirect(301, `/chat?username=${req.body.username}&room=${req.body.room}&p=2`);
    } else{
        console.log(3)
        res.redirect('/');
    }
});

app.get('/chat', (req, res) => {
    res.render('chat');
})

server.listen(4000, () => {
    console.log('connecting to http://localhost:4000');
})