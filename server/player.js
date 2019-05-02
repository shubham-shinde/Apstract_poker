class Player{
	constructor(username, balance, accountName, pvtKey, index, connection, active){
		this.username = username;
		this.balance = balance;
		this.accountName = accountName;
		this.pvtKey = pvtKey;
		this.index = index;
		this.holeCards = [];
		this.currentBet = 0;
		this.connection = connection;
		this.active = active;
		this.inHand = false;
		this.seat = -1;
	}

	getBalance(){
		return this.balance;
	}

	placeBet(amount){
		// send action
	}

	raise(amount){
		//send action
		getFromBlockchain(amount, function(result) {
			currentBet += result.amount;
			balance -= result.amount;
		});
	}

	check(){
		// send action
	}

	call(){
		// send action
	}
	
	allin(){
		// send action
	}

	fold(){
		this.inHand = false;
	}

	getHoleCards(card1, card2){
		// ask my wallet for my cards
		// display the images
		this.holeCards.push(card1);
		this.holeCards.push(card2);
	}

	showdown(){
		//read cards
	}

	sitout(){
		this.active = false;
	}

	display(){
		console.log("Username " + this.username + ", Balance " + this.balance);
	}

	getFromBlockchain(val, successCallback, failureCallback){
		successCallback({amount : val});
	}

	seatPlayer(seatPos){
		this.seat = seatPos;
	}
}

module.exports = Player;