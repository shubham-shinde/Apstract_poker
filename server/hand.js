var Player = require("./player.js")
var Card = require("./card.js")

class Hand{
	constructor(hand_id, playersInHand, dealerPos, agent, smallBlind){
		this.hand_id = hand_id;
		this.player_list = [];
		this.playersInHand = playersInHand;
		this.pot = 0;
		this.currentBet = 0;
		this.raisedBy = -1;
		this.dealerPos = dealerPos;
		this.state = -1;
		this.agent = agent;
		this.flop = [[], [], []];
		this.turn = [];
		this.river = [];
		this.playerIndex = -1;
		this.maxPlayerCount = 8;

		// for(var key in playersInHand){
		// 	console.log(key + " : " + playersInHand[key]);
		// }
	}

	startHand(){
		// getnextPlayer(this.dealerPos);
		for(var key in this.playersInHand){
			if(this.playersInHand[key] != -1){
				this.player_list.push(this.playersInHand[key]);
				this.playersInHand[key].inHand = true;
			}
		}
		this.state = 0;
		for(var p = 0; p < this.player_list.length; p++){
			this.player_list[p].getHoleCards(new Card("A", "D"), new Card("A", "C"));
			// console.log(this.player_list[player]);
		}
		this.raisedBy = this.getNextPlayer(this.dealerPos);
		console.log("Checking raisedBy " + this.raisedBy);
		this.raisedBy = this.getNextPlayer(this.raisedBy);
		this.raisedBy = this.getNextPlayer(this.raisedBy);
		// this.raisedBy = this.getNextPlayer(this.getNextPlayer(this.getNextPlayer(this.dealerPos)));
		// assignTurn(3);
	}

	showFlop(){
		//getDataFromBC
		if(this.state != 1) return;
		// var data = contract.getFlop(this.hand_id);
		// chat.broadcast();

		// var flop = {
		// 	state : 1,
		// 	cards : [{data[0].x, data[0].y}, {data[1].x, data[1].y}, {data[2].x, data[2].y}]
		// }

		// agent.broadcast.emit(flop);
		this.currentBet = 0;

		// playersInHand = player_list;
		// for(var player in this.playersInHand){

		// }
		// raisedBy = (dealerPos + 1) % (player_list.length);
		// display cards
	}

	showTurn(){
		//getDataFromBC
		// contract.getTurn(this.hand_id);
		// agent.broadcast(turn);
		this.currentBet = 0;
		// this.playersInHand = player_list;
		// raisedBy = (dealerPos + 1) % (player_list.length);
	}

	showRiver(){
		//getDataFromBC
		contract.getRiver(this.hand_id);
		// agent.broadcast();
		currentBet = 0;
		// playersInHand = player_list;
		// raisedBy =;
	}

	showdown(){
		//getDataFromBC
		// contract.showDown(this.hand_id);
		// agent.broadcast();
		this.finishHand();
	}

	finishHand(){
		console.log("Hand Finished");
	}

	// static startHand(){
	// 	//send playerList to BC, get dealerPos and all from BC
	// 	//get handID from BC
	// }

	getPlayerAtPos(pos){
		for (var i = 0; i<player_list.length; i++){
			if(player_list[i].index == pos) return player_list[i];
		}
		throw "Player at Position " + pos + " not found";
	}

	placeBet(amount, player){
		//update min raise
		if(amount < minRaise) return;
		pot += amount;
		player_list.clear();
		player_list.push(player);
	}

	raise(amount, player){
		//update min raise
		if(amount < minRaise) return;
		minRaise = amount - currentBet + amount;
		currentBet = amount;
		pot += amount;
		// for(var keys in playerList){

		// }
		// player_list.clear();
		// player_list.push(player);
	}

	call(player){
		pot += currentBet;
		// player_list.push(player);
	}

	fold(player){
		player.fold();
		this.assignTurn(this.getNextPlayer(player.index));
		console.log(this.raisedBy);
	}

	winner(player, amount){
		player.balance += amount;
	}

	assignTurn(pos){
		// return contract.getCurrentTurn();
		if(pos == this.raisedBy) {
			var start = pos;
			// console.log("In HERE");
			while(true){
				if(this.playersInHand[this.getNextPlayer(start)].inHand){
					break;
				} else{
					start = this.getNextPlayer(start);
					if(start == pos){
						this.winner(this.playersInHand[this.raisedBy], this.pot);
						this.finishHand();
					}
				}
			}
			if(this.state == 0){
				this.state++;
				this.showFlop();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if(this.state == 1){
				this.state++;
				this.showTurn();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if (this.state == 2){
				this.state++;
				this.showRiver();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if (this.state == 3){
				this.state++;
				this.showDown();
				// this.playerIndex = getNextPlayer(this.dealerPos);
			}
		}
		else{
			console.log("Assigning Turn : " + pos);
			this.playerIndex = pos;
		}
	}

	getNextPlayer(pos){
		var start = pos+1;
		// console.log
		while(true){
			if(this.playersInHand[start].inHand){
				return start;
			}
			else{
				start = (start + 1) % this.maxPlayerCount;
				if(start == pos) return pos;
			}
		}
	}

	getTurn(){
		// return contract.getCurrentTurn();
	}

	// getNextPlayer(currentPos){
	// 	for(var i = 0; i<playersInHand.length; i++){

	// 	}
	// }

	display(){
		for(var key in this.playersInHand){
			if(this.playersInHand[key] != -1)
				console.log(key + " : " + this.playersInHand[key].inHand);
		}
	}
};

module.exports = Hand;

// var playerList = {0 : -1 , 1 : -1 , 2 : -1 , 3 : -1 , 4 : -1 , 5 : -1 , 6 : -1 , 7 : -1 , 8 : -1};
// // var hand = new Hand();
// for(var keys in playerList){
// 	console.log(keys + " : " + playerList[keys]);
// }