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
		this.smallBlind = smallBlind;
		this.turnNumber = 0;
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
		this.currentBet = 2*this.smallBlind;
		this.raisedBy = this.getNextPlayer(this.dealerPos);
		this.playersInHand[this.raisedBy].currentBet = this.smallBlind;
		this.playersInHand[this.raisedBy].balance -= this.smallBlind;
		this.raisedBy = this.getNextPlayer(this.raisedBy);
		this.playersInHand[this.raisedBy].currentBet = 2*this.smallBlind;
		this.playersInHand[this.raisedBy].balance -= 2*this.smallBlind;
		this.raisedBy = this.getNextPlayer(this.raisedBy);
		// this.raisedBy = this.getNextPlayer(this.raisedBy);
		// console.log("Checking smallBlind " + this.raisedBy);
		this.playerIndex = this.raisedBy;
		this.pot = 3 * this.smallBlind;

		this.agent.emit('message', {handID : 1, dealer : this.dealerPos, smallBlind : this.smallBlind, bigBlind : 2*this.smallBlind});

		// this.raisedBy = this.getNextPlayer(this.getNextPlayer(this.getNextPlayer(this.dealerPos)));
		// assignTurn(3);
	}

	showFlop(){
		// console.log("Showing Flop");
		//getDataFromBC
		if(this.state != 2) return;

		this.agent.emit('message', {card1 : "cA", card2 : 'dA', card3 : 'cT'});


		this.currentBet = 0;
	}

	showTurn(){
		//getDataFromBC
		// contract.getTurn(this.hand_id);
		// agent.broadcast(turn);
		this.currentBet = 0;
		this.agent.emit('message', {card : "c2"});
		// this.playersInHand = player_list;
		// raisedBy = (dealerPos + 1) % (player_list.length);
	}

	showRiver(){
		//getDataFromBC
		// contract.getRiver(this.hand_id);
		// agent.broadcast();
		this.currentBet = 0;
		this.agent.emit('message', {card : "c6"});
		// playersInHand = player_list;
		// raisedBy =;
	}

	showdown(){
		//getDataFromBC
		// contract.showDown(this.hand_id);
		// agent.broadcast();

		// Example message

		// this.agent.emit('showDown', {{
		// 		player : [
		// 			{
		// 				playerID : 1,
		// 				seat : 1,
		// 				card1 : "c7",
		// 				card2 : 'c9',
		// 				win : 1000,
		// 				newBalance : 2300
		// 			},
		// 			{
		// 				playerID : 2,
		// 				seat : 1,
		// 				card1 : "c7",
		// 				card2 : 'c9',
		// 				win : 1000,
		// 				newBalance : 2300
		// 			}
		// 		]
		// 	}
		// });
		// this.finishHand();
	}

	finishHand(){
		// console.log("Hand Finished");
		// this.agent.emit('handfin', "Hand finished");
	}

	getPlayerAtPos(pos){
		for (var i = 0; i<player_list.length; i++){
			if(player_list[i].index == pos) return player_list[i];
		}
		throw "Player at Position " + pos + " not found";
	}

	placeBet(amount, player){
		//update min raise
		if(this.playerIndex != player.seat) return;
		if(amount < minRaise) return;

		this.agent.emit('raise', {seatID : player.seat, value : amount});

		this.pot += amount;
		this.player_list.clear();
		this.player_list.push(player);
	}

	raise(amount, player){
		//update min raise
		if(this.playerIndex != player.seat) return;
		if(amount < this.minRaise) return;
		
		this.agent.emit('raise', {seatID : player.seat, value : amount});
		
		this.minRaise = amount - this.currentBet + amount;
		this.currentBet = amount;
		this.pot += amount;
	}

	call(player){
		if(this.playerIndex != player.seat) return;

		this.agent.emit('call', {seatID : player.seat});
		
		this.pot += this.currentBet - player.currentBet;
		player.balance -= (this.currentBet - player.currentBet);
		this.assignTurn(this.getNextPlayer(player.seat));
		// player_list.push(player);
	}

	fold(player){
		// console.log(this.playerIndex + " is the player Index " + player.seat);
		// console.log("Folding for player " + player.username);
		if(this.playerIndex != player.seat) return;
		// console.log("Here");
		player.fold();
		this.agent.emit('fold', {seat : player.seat});
		// this.playersInHand[player.seat] = -1;
		this.assignTurn(this.getNextPlayer(player.seat));
		// console.log(this.raisedBy);
	}

	check(player){
		if(this.playerIndex != player.seat) return;
		if(this.currentBet != player.currentBet) return;
		// console.log("Checked");
		this.agent.emit('check', {seatID : player.seat});
		this.assignTurn(this.getNextPlayer(player.seat));
	}

	winner(player, amount){
		player.balance += amount;
	}

	assignTurn(pos){
		// return contract.getCurrentTurn();
		// console.log("Pos : " + pos + " RaisedBy : " + this.raisedBy);
		// console.log("State " + this.state);
		this.turnNumber += 1;
		// console.log(this.turnNumber + " this.turnNumber");
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
			if (this.state == 0){
				// console.log("Assigning Turn: " + pos);
				this.state ++;
				this.playerIndex = pos;
			}
			else if (this.state == 1){
				this.state++;
				// console.log("Showing flop");
				this.showFlop();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if (this.state == 2){
				this.state++;
				this.showTurn();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if (this.state == 3){
				this.state++;
				this.showRiver();
				this.playerIndex = this.getNextPlayer(this.dealerPos);
			}
			else if (this.state == 4){
				this.state++;
				this.showDown();
				// this.playerIndex = getNextPlayer(this.dealerPos);
			}
		}
		else{
			// console.log("Assigning Turn : " + pos);
			this.playerIndex = pos;
		}

		// setTimeout(this.autoFold.bind(this), 2000, this.playersInHand[this.playerIndex], this.turnNumber);
	}

	autoFold(player, turnNumber){
		// console.log("Folding for player " + player.username + " " + turnNumber + " : " + this.turnNumber);
		if(this.turnNumber == turnNumber){
			this.fold(player);
			// console.log("Folding")
		}
	}

	getNextPlayer(pos){
		// console.log("Position : " + pos);
		var start = (pos+1) % this.maxPlayerCount;
		while(true){
			if(this.playersInHand[start].inHand == true){
				return start;
			}
			else{
				// console.log("Looking at : " + start);
				if(start == this.raisedBy) {
					// this.assignTurn(this.raisedBy);
					return this.raisedBy;
				}
				start = (start + 1) % this.maxPlayerCount;
			}
		}
	}

	getTurn(){
		// return contract.getCurrentTurn();
	}

	display(){
		for(var key in this.playersInHand){
			if(this.playersInHand[key] != -1)
				console.log(key + " : " + this.playersInHand[key].username + " , " + this.playersInHand[key].balance);
		}
	}

	getPublicData(){
		var reply = {
			hand_id : this.hand_id,
			pot : this.pot,
			raisedBy : this.raisedBy,
			dealerPos : this.dealerPos,
			flop : this.flop,
			turn : this.turn,
			river : this.river,
			playerTurn : this.playerIndex,
			smallBlind : this.smallBlind
		}
		return reply;
	}
};

module.exports = Hand;