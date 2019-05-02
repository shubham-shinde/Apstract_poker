import * as contract from './contract';
import socket from 'socket.io';
var Hand = require('./hand.js')
var Player = require('./player.js')

var abcd = -1;


class Table{
	constructor(playersOnTable, smallBlind, minBuyIn, maxBuyIn, io){
		this.playersOnTable = playersOnTable;
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
			// contract.seatPlayer(player.index, seatPosition);
			//verify if this actually happened
			// playersOnTable.push(playerID);
			this.seats[seatPosition] = player;
			player.seatPlayer(seatPosition);
		}
		else{
			return false;
		}
	}

	getState(){
		// return all the data for the game.
	}
}

module.exports = Table;