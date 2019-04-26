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

//eslint-disable-next-line no-console
const server = app.listen(3000, () => console.log('listening on port 3000'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..','dist','index.html'))
})


const io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('name', (name) => {
        io.emit('name',name);
    });
    socket.on('message',(message) => {
        io.emit('message', message);
    })
    socket.on('typing', (name) => {
        socket.broadcast.emit('typing', name);
    })
})