//TODO : Broadcast data to everyone connected

class ChatHandler{
	constructor(agent){
		this.players = [];
		this.sockets = [];
		this.agent = agent;
		agent.emit('time', 'ChatHandler Initialized');
	}

	addConnection(playerID, socketID){
		this.players[playerID] = socketID;
		this.sockets[socketID] = playerID;
	}

	removeConnection(socketID){
		if(socketID in this.sockets){
			var x = this.sockets[socketID];
			delete this.sockets[socketID];
			delete this.players[x];
		}
	}

	getPlayerConnection(playerID){
		if(playerID in this.players){
			return this.players[playerID];
		}
		return -1;
	}

	getConnectionPlayer(socketID){
		if(socketID in this.sockets){
			return this.sockets[socketID];
		}
		return -1;
	}

	display(){
		for(var player in this.players){
			console.log(player + " " + this.getPlayerConnection(player));
		}
	}

	emit(){
		for(var socket in sockets){
			this.agent.emit("Hello");
		}
		//TODO : send data to all sockets using sockets.io
	}
}

// export default ChatHandler{};
module.exports = ChatHandler
// chatHandler = new ChatHandler();
// chatHandler.addConnection(1, "abcd1");
// chatHandler.addConnection(2, "abcd2");
// chatHandler.addConnection(3, "abcd3");
// chatHandler.addConnection(4, "abcd4");
// chatHandler.display();
// chatHandler.removeConnection("abcd1");
// chatHandler.display();