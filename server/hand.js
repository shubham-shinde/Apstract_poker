class Hand{
	constructor(hand_id, playersInHand, dealerPos, currentBet){
		this.hand_id = hand_id;
		this.player_list = [];
		this.playersInHand = playersInHand;
		this.pot = 0;
		this.currentBet = currentBet;
		this.raisedBy = 0;
		this.dealerPos = dealerPos;
	}

	startHand(){
		// for each player, call getHoleCards()
		dealerPos++;
		// currentBet = 
	}

	showFlop(){
		//getDataFromBC
		currentBet = 0;
		raisedBy = (dealerPos + 1) % (player_list.length);
		// display cards
	}

	showTurn(){
		//getDataFromBC
	}

	showRiver(){
		//getDataFromBC
	}

	showdown(){
		//getDataFromBC
	}

	finishHand(){

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
		player_list.clear();
		player_list.push(player);
	}

	call(player){
		pot += currentBet;
		player_list.push(player);
	}

	getNextTurn(){
		//get from blockchain
	}
};