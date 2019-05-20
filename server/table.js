import * as contract from './contract';
import socket from 'socket.io';
var Hand = require('./hand.js')
var Player = require('./player.js')

// var abcd = -1;


class Table{
	constructor(playersOnTable, smallBlind, minBuyIn, maxBuyIn, io, onBlockchain){
		this.playersOnTable = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		this.smallBlind = smallBlind;
		this.minBuyIn = minBuyIn;
		this.maxBuyIn = maxBuyIn;
		this.minRaise = 4*smallBlind;
		this.currentBet = 2*smallBlind;
		this.seats = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		this.currentHand = null; // Read data from contract
		this.agent = io;
		this.onBlockchain = onBlockchain;
	}

	addPlayer(player){
		// player_list.push(player);
		//tell blockchain that a new player has joined
		// contract.addPlayer();
		//verify that the player has been added
		// playersOnTable
	}

	removePlayer(player){
		for(var key in this.playersOnTable){
			if(this.playersOnTable[key].username == player.username){
				this.playersOnTable[key] = -1;
				return;
			}
		}
	}

	removePlayer(position){
		if(position > -1 && position < 9){
			this.playersOnTable[position] = -1;
			return;
		}
	}

	startHand(){
		//verify if the current hand is over from blockchain
		// contract.startHand();
		// this.agent.emit('time', {'handID' : 1, "user" : 2});
		// console.log(this.agent);
		var playerList = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		for(var key in this.seats){
			if(this.seats[key].active){
				playerList[key] = this.seats[key];
			}
		}

		// for(var p in )
		// var p = new Player();
		//get data from blockchain, including dealer position and people in hand
		/*Pass data to the constructor to initialize the hand*/
		var handID = 0;
		if(this.currentHand) handID = this.currentHand.handID;
		this.currentHand = new Hand(handID + 1, playerList, 0, this.agent, 10, this.onBlockchain);
		this.currentHand.startHand();

		this.agent.emit('startHand', {handID : this.currentHand.handID});
		// for(var player in this.playersOnTable){

		// }
		setTimeout(this.currentHandCheck.bind(this), 1000);
	}

	async seatPlayer(seatPosition, player){
		if(this.seats[seatPosition] == -1){
			if(this.onBlockchain){
				var d = await contract.seatPlayer(seatPosition, player.balance)
			}

			for(var key in this.playersOnTable){
				if(this.playersOnTable[key].username == player.username) {
					console.log("Already on table");
					return false;
				}
			}

			this.seats[seatPosition] = player;
			this.playersOnTable[seatPosition]  = player;
			player.seatPlayer(seatPosition);
			return true;
		}
		return false;
	}

	getState(){
		var reply = {
			players : this.getPublicPlayerData(),
			handData : this.currentHand.getPublicData()
		}
		return reply;
	}

	getPublicPlayerData(){
		var ret = [];
		for(var key in this.playersOnTable){
			if(this.playersOnTable[key] != -1){
				ret.push(this.playersOnTable[key].getPublicData());
			}
			else{
				var p = new Player();
				ret.push(p.getPublicData());
			}
		}
		return ret;
	}

	getPlayerWithID(playerID){
		// for(var key in this.)
	}

	getCurrentTurn(){
		return ;
	}

	getPlayerSeat(playerID){
		console.log("playerID  " + playerID);
		for(var key in this.playersOnTable){
			if(this.playersOnTable[key].playerID == playerID){
				console.log("playerID : " + playerID + " key : " + key);
				return key;
			}

		}
		return -1;
	}

	currentHandCheck(){
		if(this.currentHand.isFinished){
			console.log("Hand finish has been acknowledged by Table");
			setTimeout(this.startHand.bind(this), 1000);
		}
		else{
			setTimeout(this.currentHandCheck.bind(this), 1000);
		}
	}

	async startGame(){
		if(this.onBlockchain)
		var x = await contract.startGame(0);
		console.log(x)
	}

	async createGame(smallBlind){
		if(this.onBlockchain)
		var x = await contract.creategame(8, 0, smallBlind);
		console.log('game created', x);
	}

	async initialize(){
		try {
			if(!this.onBlockchain) return;
			var handID = await contract.getCurrentHand();
			var handData = await contract.getHandData(handID);
			var playerList = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
			var playerData = await contract.getPlayerData();
			
			for(var key in playerData){
				if(playerData.hasOwnProperty(key)){
					const element = playerData[key];
					var pd = await this.getDataFromDB(element.playerId);
					var p = new Player(pd.playerID, pd.email, pd.username, element.currentChips, pd.accountName, pd.pvtKey, pd.index, pd.connection, pd.active, pd.displayPic);
					playerList[element.playerId] = p;
					p.seatPlayer(element.playerId);
				}
			}

			for (var key in handData.playersInHand){
				playerList[key].currentBet = handData.playersBetAmount[key];
			}
			// console.log(playerList);
			this.currentHand = new Hand(handID, playerList, handData.dealerPosition, this.agent, 10, true);
			this.currentHand.applyHand(handData);
			return true;
		}
		catch(err) {
			throw err;
		}
	}

	async getDataFromDB(playerID){
		var reply = {
			playerID,
			email : "a@a.com",
			username : "sp56783",
			balance : 3000,
			accountName : "abcde",
			pvtKey : "1234",
			index : playerID,
			connection : null,
			active : true,
			displayPic : "."
		};
		return reply;
	}

	async call(player){
		if(this.onBlockchain){
			// console.log("In table.call")
			await this.currentHand.call(player);
		}
	}

	async raise(player, amount){
		// console.log("Raising for player" + player.playerID);
		if(this.onBlockchain){
			await this.currentHand.raise(player, amount);
		}
	}

	async fold(player, gameId){
		if(this.onBlockchain)
		await this.currentHand.fold(player, gameId);
	}
}

module.exports = Table;