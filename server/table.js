class Table{
	constructor(player_list, smallBlind, minBuyIn, maxBuyIn){
		this.player_list = player_list;
		this.smallBlind = smallBlind;
		this.minBuyIn = minBuyIn;
		this.maxBuyIn = maxBuyIn;
		this.minRaise = 4*smallBlind;
		this.currentBet = 2*smallBlind;
	}

	addPlayer(player){
		player_list.push(player);
		//tell blockchain that a new player has joined
	}

	removePlayer(player){
		for (var i = 0; i < arr.length; i++){ 
			// if ( arr[i] === 5) {
			// 	arr.splice(i, 1); 
			// 	i--;
			// }	
		}
	}

	removePlayer(position){
		for (var i = 0; i < arr.length; i++){ 
			// if ( arr[i] === 5) {
			// 	arr.splice(i, 1); 
			// 	i--;
			// }	
		}	
		// player_list.splice(position, )
	}

	initHand(){
		//get data from blockchain, including dealer position and people in hand
	}
}