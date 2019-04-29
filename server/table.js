import * as contract from './contract';
var Hand = require('./hand.js')
var Player = require('./player.js')

var abcd = -1;


class Table{
	constructor(playersOnTable, smallBlind, minBuyIn, maxBuyIn){
		this.playersOnTable = playersOnTable;
		this.smallBlind = smallBlind;
		this.minBuyIn = minBuyIn;
		this.maxBuyIn = maxBuyIn;
		this.minRaise = 4*smallBlind;
		this.currentBet = 2*smallBlind;
		this.seats = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
		this.currentHand = null; // Read data from contract
		// var Hand = require('./hand.js')
		// abcd ++;
	}

	addPlayer(player){
		// player_list.push(player);
		//tell blockchain that a new player has joined
		// contract.addPlayer();
		//verify that the player has been added
		// playersOnTable
	}

	removePlayer(player){
		for(var val in player_list){

		}
	}

	removePlayer(position){
		
	}

	startHand(){
		//verify if the current hand is over from blockchain
		// contract.startHand();
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
		this.currentHand = new Hand(0, playerList, 0, 0, null);
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
		}
		else{
			return false;
		}
	}

	getState(){
		// return all the data for the game.
	}
}

var player1 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 0, null, true);
var player2 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 1, null, true);
var player3 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 2, null, true);
var player4 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 3, null, true);
var player5 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 4, null, true);
var player6 = new Player("pandeyshrey33", 3000, "abcde", "xyz", 5, null, true);


// var hand = new Hand(0, );
var table = new Table([], 10, 2000, 4000);

table.seatPlayer(0, player1);
table.seatPlayer(1, player2);
table.seatPlayer(2, player3);
table.seatPlayer(3, player4);
table.seatPlayer(4, player5);

for(var key in table.seats){
	console.log(key, table.seats[key]);
}

table.startHand();

table.currentHand.assignTurn(3);
// console.log(table.currentHand.getNextTurn(2));

table.currentHand.fold(player4);
table.currentHand.fold(player5);
// table.currentHand.fold(player6);

table.currentHand.display();

module.exports = Table;