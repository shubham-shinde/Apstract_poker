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
	}

	getBalance(){
		return this.balance;
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

	sitout(){
		this.active = false;
	}
}