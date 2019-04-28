import express from 'express';
import socket from 'socket.io';
import path from 'path';
// import config from '../webpack.config.dev.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as ContractActions from './contract';

var ChatHandler = require('chat.js');

var app = express();
//add code to initialize compiler
// const compiler = webpack(config); 

function fun() {
    console.log('fun');
}

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
    // fun();
    res.sendFile(path.resolve(__dirname,'..','dist','index.html'))

})

//TODO save all connections to connections table
//TODO save all players to player table with current state
//TODO create a route to validate provided email
//TODO emit timer of the seat no. for the action
//TODO create next round function and remove all inactive player of the game
//TODO update all the action into the player table and also give it to the client


const io = socket(server);

chatHandler = new ChatHandler(io);

var players = [];
var connections = [];

io.on('connection', (socket) => {
    console.log(socket.id);
    
    connections.push(socket);


    //TODO if email is valid add player to player table
    //TODO if player already exist in player table then make it active
    //TODO if player email is invalid don't let if play but give current game state
    socket.on('addPlayer', ({email, name, pic}, gameState) => {
        
        validatePlayer(email, function(result) {
            // players.push({
            //     email,
            //     socket: socket.id,
            //     seatNo: 1,
            //     money: 3000,
            //     pic: pic,
            //     name: name,
            //     playing: false,
            // });
            var p = new Player(result.username, result.balance, result.accountName, result.pvtKey, result.index, socket, true);
            players.push(p);
        }, function(fail) {
            console.log("No player found");
        })
        // gameState is callback function to give client current game state
        // gameState(players);
        // console.log(players.length);
    });

    socket.on('seatPlayer', ({seatPosition, playerID}, seatPlayer) => {

    });

    socket.on('call', ({playerID, handID}, onCall) => {

    });

    socket.on('bet', ({playerID, handID, betValue}, onBet) => {

    });

    socket.on('raise', ({playerID, handID, raiseValue}, onRaise) => {

    });

    socket.on('fold', ({playerID, handID}, onFold) => {

    });
    // socket.on('message',(message) => {
    //     io.emit('message', message);
    // })


    // socket.on('time', (name) => {
    //     socket.broadcast.emit('time', name);
    // })

    //TODO Automate players Action on disconnect
    socket.on('disconnect', () => {
        // console.log('disconnected');
        chatHandler.remove(socket);
    })
});

function validateEmail(email, successCallback, failureCallback){
    // connect to db via mysql
    // if email isn't validated, throw an error
    var params = {email}
    var options = {
        uri : '',
        method : 'POST',
        headers : {
            'Accept' : 'application/json'
        },
        body : params,
        json = true
    }
    request(options, (err, res, body) => {
        if(err){
            failureCallback();
        }
        else{
            // if(res.)
        }
    })
        // successCallback(result);
}