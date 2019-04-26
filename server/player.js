class Player{
	constructor(username, balance, accountName, pvtKey, index, owner){
		this.username = username;
		this.balance = balance;
		this.accountName = accountName;
		this.pvtKey = pvtKey;
		this.index = index;
		this.holeCards = [];
		this.owner = owner;							//true if owner is the user
		this.currentBet = 0;
	}

	getBalance(){
		return balance;
	}

	placeBet(amount){
		// send action
	}

	raise(amount){
		//send action
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

	getHoleCards(){
		// ask my wallet for my cards
		// display the images
	}

	showdown(){
		//read cards
	}
}