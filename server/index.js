import express from 'express';
import socket from 'socket.io';
import path from 'path';
// import config from '../webpack.config.dev.js';
import cors from 'cors';
import bodyParser from 'body-parser';

var app = express();
//add code to initialize compiler
// const compiler = webpack(config); 

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.resolve(__dirname,'..','dist')));
 
// parse application/json
app.use(bodyParser.json())

const port = 3000;

//eslint-disable-next-line no-console
const server = app.listen(port, () => console.log('listening on port '+ port));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..','dist','index.html'))
})


const io = socket(server);

var players = [];
var connections = [];

io.on('connection', (socket) => {
    console.log(socket.id);
    
    connections.push(socket);
    socket.emit('hii', 'data')

    socket.on('addPlayer', ({email, name, pic}) => {
        console.log('called', fun)
        players.push({
            email,
            socket,
            money: 3000,
            pic: pic,
            name: name,
            playing: false,
        });
        console.log(players.length);
    })

    socket.on('message',(message) => {
        io.emit('message', message);
    })

    socket.on('time', (name) => {
        socket.broadcast.emit('time', name);
    })

    socket.on('disconnect', () => {
        console.log('disconnected');
    })
})