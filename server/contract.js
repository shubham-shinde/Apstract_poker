import eos from "./eos";
//TODO : Call functions from smart contracts
var ACTOR = 'eospokergame'
var KEY = '5HzHemUESLjVts2oh8hYPj2ei9vewYa1Zo4CLfZKkYLJZGtLaE6'
var ContractConnection = {
    EOS_CONTRACT_NAME: ACTOR,
    EOS_HTTP_ENDPOINT: "http://jungle2.cryptolions.io:80",
    KEY: KEY
}

// export function addPlayer (playerAccountName, playerId, buyIn){
//     return eos.makeAction(ACTOR, KEY, 'addplayer', {s: ACTOR, playerAccountName, playerId, buyIn} , ContractConnection)   
// }

// export function rmplayer(playerId){
//     return eos.makeAction(ACTOR, KEY, 'rmplayer', {s: ACTOR, playerId} , ContractConnection)
// }

export function seatPlayer(playerId, seatPosition){
    return eos.makeAction(ACTOR, KEY, 'seatplayer', {s: ACTOR, playerId, seatPosition} , ContractConnection)
}

export function startGame(smallBlind){
    return eos.makeAction(ACTOR, KEY, 'startgame', {s: ACTOR, smallBlind} , ContractConnection)
}

export function startHand(dealerPosition, currentPlayer, smallBlind, playersOnTable, playersInHand){
    return eos.makeAction(ACTOR, KEY, 'starthand', {s: ACTOR, dealerPosition, currentPlayer, smallBlind, playersOnTable, playersInHand} , ContractConnection)
}

export function dealCards(handId){
    return eos.makeAction(ACTOR, KEY, 'dealcards', {s: ACTOR, handId} , ContractConnection)
}

export function call(playerId, handId, handSeatId){
    return eos.makeAction(ACTOR, KEY, 'actioncall', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
}

export function bet(playerId, handId, handSeatId, betValue){
    return eos.makeAction(ACTOR, KEY, 'actionbet', {s: ACTOR, playerId, handId, handSeatId, betValue} , ContractConnection)
}

export function raise(playerId, handId, handSeatId, raiseValue){
    return eos.makeAction(ACTOR, KEY, 'actionraise', {s: ACTOR, playerId, handId, handSeatId, raiseValue} , ContractConnection)
}

export function allin(playerId, handId, handSeatId){
    return eos.makeAction(ACTOR, KEY, 'actionallin', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
}

export function fold(playerId, handId, handSeatId){
    return eos.makeAction(ACTOR, KEY, 'actionfold', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
}

export async function getFlop(handId){
    var transection = await eos.makeAction(ACTOR, KEY, 'openflop', {s: ACTOR, handId} , ContractConnection)
    var data = await eos.getTableRows(ContractConnection, 'hand');
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const ele = data[key];
            if(ele.handId == handId) return ele.flop
                //array of card
                //ex. [{1,1}, {3, 2}, {5, 2}]
        }
    }
    return null;
}

export async function getTurn(handId){
    return eos.makeAction(ACTOR, KEY, 'openturn', {s: ACTOR, handId} , ContractConnection)
    var data = await eos.getTableRows(ContractConnection, 'hand');
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const ele = data[key];
            if(ele.handId == handId) return ele.turn
                //card i.e {2, 5}
        }
    }
    return null;
}

export async function getRiver(handId){
    return eos.makeAction(ACTOR, KEY, 'openriver', {s: ACTOR, handId} , ContractConnection)
    var data = await eos.getTableRows(ContractConnection, 'hand');
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const ele = data[key];
            if(ele.handId == handId) return ele.river
                //card i.e {3, 5}
        }
    }
    return null;
}

export function showdown(handId){
    return eos.makeAction(ACTOR, KEY, 'showdown', {s: ACTOR, handId} , ContractConnection)
}

export async function getCurrentPlayer(handId){
    // var transection = await eos.makeAction(ACTOR, KEY, 'openflop', {s: ACTOR, handId} , ContractConnection)
    var data = await eos.getTableRows(ContractConnection, 'hand');
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const ele = data[key];
            if(ele.handId == handId) return ele.currentPlayer
                //current player id i.e 4
        }
    }
    return null;
}