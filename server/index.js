import express from 'express';
import socket from 'socket.io';
import path from 'path';
// import config from '../webpack.config.dev.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as ContractActions from './contract';

// ContractActions.addPlayer('shubham5', 10, 300).then((data) => {
// 	console.log('addplayer', data);
// })

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

});

app.get("/hiii", (req, res) => {
	res.json({success : 1});
	console.log("received");
})

//TODO save all connections to connections table
//TODO save all players to player table with current state
//TODO create a route to validate provided email
//TODO emit timer of the seat no. for the action
//TODO create next round function and remove all inactive player of the game
//TODO update all the action into the player table and also give it to the client


const io = socket(server);

var chatHandler = new ChatHandler(io);

// console.log(io + " IO");

// var game = new Game();
var table = new Table([], 10, 2000, 4000, io, true);
// table.initialize();
// table.setSocket(io);

var players = [];
var connections = [];

start(table);
// table.initialize();

io.on('connection', (socket) => {
	console.log(socket.id);
	
	// connections.push(socket);

	// app.get("/hii", (req, res) => {
	// 	socket.emit("Hello");
	// 	res.end();
	// });

	// io.emit('time', 'timeout')

	//TODO if email is valid add player to player table
	//TODO if player already exist in player table then make it active
	//TODO if player email is invalid don't let if play but give current game state
	socket.on('addPlayer', ({email, name, pic}, gameState) => {

		// console.log("Adding new connection");
		
		validatePlayer(email, function(result) {
			var p = new Player(result.PlayerID, result.Email, result.UserName, result.Balance, result.AccountName, result.PvtKey, result.Index, socket, true);
			// console.log(result);
			var playerData = table.getPublicPlayerData()
			var reply = {
				players : playerData,
				pot : table.currentHand.pot,
				playerData : {
					playerID : result.PlayerID,
					username : result.UserName,
					balance : result.Balance,
					accountName : result.AccountName,
					pvtKey : result.PvtKey,
					email : result.Email
				}
			}
			// console.log(reply);
			gameState(reply);
		}, function(fail) {
			console.log("No player found");
		})
	});

	socket.on('seatPlayer', ({seatPosition, playerData}, callback) => {
		if(table.seatPlayer(seatPosition, new Player(playerData.playerID, playerData.email, playerData.username, playerData.balance, playerData.accountName, playerData.pvtKey, 0, socket, true, playerData.pic))){
			// The player was seated on the table
			// console.log("HERE");
			// console.log(table.playersOnTable[seatPosition]);
			var playerData = table.getPublicPlayerData();
			var reply = {
				players : playerData,
				seat : 5,
				balance : table.playersOnTable[seatPosition].balance
			}
			// console.log(table.getState());
			callback(table.getState());
		}
		else{
			
		}
	});

	socket.on('call', ({playerID, handID}, onCall) => {
		table.currentHand.call(table.playersOnTable[table.getPlayerSeat(playerID)]);
		onCall(table.getState());
		io.emit('state', table.getState());
	});

	socket.on('bet', ({playerID, handID, betValue}, onBet) => {
		table.currentHand.bet(table.playersOnTable[table.getPlayerSeat(playerID)], betValue);
		onBet(table.getState());
		io.emit('state', table.getState());
	});

	socket.on('raise', ({playerID, handID, raiseValue}, onRaise) => {
		table.currentHand.bet(table.playersOnTable[table.getPlayerSeat(playerID)], raiseValue);
		onRaise(table.getState());
		io.emit('state', table.getState());
	});

	socket.on('fold', ({playerID, handID}, onFold) => {
		table.currentHand.fold(table.playersOnTable[table.getPlayerSeat(playerID)]);
		onFold(table.getState());
		io.emit('state', table.getState());
	});

	socket.on('check', ({playerID, handID}, onCheck) => {
		table.currentHand.check(table.playersOnTable[table.getPlayerSeat(playerID)]);
		onCheck(table.getState());
		io.emit('state', table.getState());
	});

	socket.on('disconnect', () => {
		// console.log('disconnected');
		// chatHandler.remove(socket);
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
	  	con.end();
	});
}

async function start(table){

	var player0 = new Player(0, "a@a.com", "Shubham", 3000, "abcde", "xyz", 0, null, true, ".");
	var player1 = new Player(1, "b@a.com", "Shrey", 3000, "abcde", "xyz", 1, null, true, ".");
	var player2 = new Player(2, "c@a.com", "Ameta", 3000, "abcde", "xyz", 2, null, true, ".");
	var player3 = new Player(3, "d@a.com", "Shuvam", 3000, "abcde", "xyz", 3, null, true, ".");
	var player4 = new Player(4, "e@a.com", "Piyush", 3000, "abcde", "xyz", 4, null, true, ".");

	await ContractActions.removeGame(0);
	// // await ContractActions.removeGame(1);
	// // await ContractActions.removeGame(2);
	// // await ContractActions.removeGame(3);
	// // await ContractActions.removeGame(4);
	// // await ContractActions.removeGame(5);

	await table.createGame(10);

	await ContractActions.rmplayer(0);
	await ContractActions.rmplayer(1);
	await ContractActions.rmplayer(2);
	await ContractActions.rmplayer(3);
	await ContractActions.rmplayer(4);

	console.log('players removed')
	// // await ContractActions.rmplayer(5);
	// // await ContractActions.rmplayer(6);
	// // await ContractActions.rmplayer(7);
	// // await ContractActions.rmplayer(8);


	await table.seatPlayer(0, player0);
	await table.seatPlayer(1, player1);
	await table.seatPlayer(2, player2);
	await table.seatPlayer(3, player3);
	await table.seatPlayer(4, player4);

	console.log('players seated')
	

	await table.startGame(0);
	console.log('game started')

	await table.initialize();
	console.log('table initialized')

	// console.log("Playing out the hand now");

	await table.call(player3);
	await table.call(player4);
	await table.raise(player0, 60);
	await table.call(player1);
	//TODO need so save gameID in hand or table.
	//currently it is hardcoded and passed through function.
	await table.fold(player2, 0);
	await table.fold(player3, 0);
	await table.call(player4);

	// // FLOP OPENS

	// function timeout(ms) {
	//     return new Promise(resolve => setTimeout(resolve, ms));
	// }
	
	// // console.log("Flop has been opened");

	// await timeout(2000);

	await table.raise(player1, 110);
	// console.log(data);
	await table.fold(player4, 0);
	await table.raise(player0, 390);
	await table.fold(player1, 0);
	

	// // await table.initialize();

	// // await setTimeout(()=>{console.log("Initialized")}, 2000);

	// await table.call(player4);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// await table.call(player5);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// // console.log("------------------------" + player1.playerID);
	// await table.raise(player1, 60);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// await table.call(player2);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// await table.fold(player3);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// await table.fold(player4);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// await table.call(player5);
	// // await setTimeout(()=>{console.log("Initialized")}, 2000);
	// // table.startGame();

	// await table.raise(player2, 110);

	// table.initialize();

	// table.startHand();
	// ContractActions.getHandData(0).then(console.log)
	// player2.call();

	// ContractActions.getCurrentPlayer(1).then((data) => {
	// 	console.log(data);
	// });

	// ContractActions.creategame(0)

	// ContractActions.startGame(10).then((data) => {
	// 	console.log(data);
	// })

	// table.startHand();

	// table.currentHand.assignTurn(3);

	// table.currentHand.fold(player4);
	// table.currentHand.fold(player5);

	// table.startGame();

	// ContractActions.creategame(8, 4, 10).then((data) => {
	// 	console.log(data);
	// });

	// table.seatPlayer(0, player1);
	// table.seatPlayer(1, player2);
	// table.seatPlayer(2, player3);
	// table.seatPlayer(3, player4);
	// table.seatPlayer(4, player5);

	// ContractActions.

	// table.getPlayerSeat(3);

	// ContractActions

	// ContractActions.seatPlayer(4, 3).then((data)=>{
	// 	console.log(data);
	// });

	// ContractActions.startHand(0, 4, 5, [1,2,3,4], [1,2,3,4]).then((data) => {
	// 	console.log(data);
	// });

	// ContractActions.dealCards(0).then((data) => {
	// 	console.log(data);
	// })

	// ContractActions.getRiver(0).then((data)=>{
	// 	console.log(data);
	// });

	// ContractActions.rmplayer(0).then((data) => {
	// 	console.log(data);
	// })

	// ContractActions.addPlayer("pandeyshrey1", 3, 3000).then((data) => {
	// 	console.log(data);
	// });

	// ContractActions.seatPlayer("")

	// console.log(table.getState());
}