import * as ContractActions from './contract';

class Player{
	constructor(playerID, email, username, balance, accountName, pvtKey, index, connection, active, displayPic){
		this.playerID = playerID;
		this.displaypicture = displayPic
		this.email = email;
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
		this.seat = playerID;
	}

	getBalance(){
		return this.balance;
	}

	async placeBet(amount, handID){
		await ContractActions.bet(this.playerId, handID, amount);
	}

	async raise(amount, handID){
		// console.log("Amount : " + amount + ", handID : " + handID);
		await ContractActions.raise(this.playerID, handID, amount);
	}

	async check(handID){
		await ContractActions.actionCheck(this.playerID, handID);
	}

	async call(handID){
		// send action
		await ContractActions.call(this.playerID, handID);
	}
	
	async allin(handID){
		// send action
		await ContractActions.allIn(this.playerID, handID)
	}

	async fold(handID){
		this.inHand = false;
		await ContractActions.fold(this.playerID, handID);
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
		// console.log("Username " + this.username + ", Balance " + this.balance);
	}

	getFromBlockchain(val, successCallback, failureCallback){
		successCallback({amount : val});
	}

	seatPlayer(seatPos){
		this.seat = seatPos;
	}

	getPublicData(){
		var reply = {
			username : this.username,
			balance : this.balance,
			seat : this.seat,
			currentBet : this.currentBet,
			active : this.active,
			inHand : this.inHand,
			playerID : this.playerID,
			displayPic : this.displayPic
		};

		return reply;
	}
}

module.exports = Player;