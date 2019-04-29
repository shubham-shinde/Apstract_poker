import express from 'express';
import socket from 'socket.io';
import path from 'path';
// import config from '../webpack.config.dev.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as ContractActions from './contract';

// import ChatHandler from './chat';

var ChatHandler = require('./chat.js');
var Player = require('./player.js')
var Table = require('./table.js')
var mysql = require('mysql'); 

var app = express();
//add code to initialize compiler
// const compiler = webpack(config); 
// ContractActions.addPlayer('shrey', 2, 1000).then(data => {
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// })

var app = express()

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

var chatHandler = new ChatHandler(io);

// var game = new Game();
var table = new Table([], 100, 20000, 40000);

var players = [];
var connections = [];

io.on('connection', (socket) => {
	console.log(socket.id);
	
	connections.push(socket);

	app.get("/hii", (req, res) => {
		socket.emit("Hello");
		res.end();
	});

	//TODO if email is valid add player to player table
	//TODO if player already exist in player table then make it active
	//TODO if player email is invalid don't let if play but give current game state
	socket.on('addPlayer', ({email, name, pic}, gameState) => {
		
		validatePlayer(email, function(result) {
			var p = new Player(result.UserName, result.Balance, result.AccountName, result.PvtKey, result.Index, socket, true);
			// players.push(p);
			// p.display();
			chatHandler.addConnection(p, socket);
			// TODO : Where to assign id, DB or Contract
			// players[Where do we assign ID, DB or Contract] = 
			gameState(players);
			players.push(p);
		}, function(fail) {
			console.log("No player found");
		})
	});

	socket.on('seatPlayer', ({seatPosition, playerID}, seatPlayer) => {
		if(table.seatPlayer(seatPosition, playerID)){
			// The player was seated on the table
		}
		else{
			// The player couldn't be seated
		}
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

function validatePlayer(email, successCallback, failureCallback){
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "apstract"
	});

	con.connect(function(err) {
		if (err) throw err;
		// console.log("Connected!");
		var sql = "select * from poker_db where Email = '" + email + "'";
		// console.log(sql);
		con.query(sql, function (err, result) {
			if (err) failureCallback(err);
			else{
				// console.log(result[0]);
				successCallback(result[0]);
			}
	  	});
	});
}

function gameState(players){
	// console.log(players.length);
	console.log("Hello");
	return "hello";
}