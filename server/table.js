import * as contract from './contract';
import socket from 'socket.io';
var Hand = require('./hand.js')
var Player = require('./player.js')

var abcd = -1;


class Table{
	constructor(playersOnTable, smallBlind, minBuyIn, maxBuyIn, io){
		this.playersOnTable = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		this.smallBlind = smallBlind;
		this.minBuyIn = minBuyIn;
		this.maxBuyIn = maxBuyIn;
		this.minRaise = 4*smallBlind;
		this.currentBet = 2*smallBlind;
		this.seats = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		this.currentHand = null; // Read data from contract
		this.agent = io;
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
		this.currentHand = new Hand(0, playerList, 0, this.agent, 10);
		this.currentHand.startHand();
		// for(var player in this.playersOnTable){

		// }
	}

	seatPlayer(seatPosition, player){
		if(this.seats[seatPosition] == -1){

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
		else{
			return false;
		}
	}

	getState(){
		var reply = {
			playerData : this.getPublicPlayerData(),
			handData : this.currentHand.getPublicData()
		}
		return reply;
		// return all the data for the game. 
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
}

module.exports = Table;