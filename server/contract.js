import eos from "./eos";
//TODO : Call functions from smart contracts
var ACTOR = 'eospokergame'
var KEY = '5HzHemUESLjVts2oh8hYPj2ei9vewYa1Zo4CLfZKkYLJZGtLaE6'
var ContractConnection = {
    EOS_CONTRACT_NAME: ACTOR,
    EOS_HTTP_ENDPOINT: "http://jungle2.cryptolions.io:80",
    KEY: KEY
}

export function addPlayer (accountName, playerID, buyIn){
    return eos.makeAction(ACTOR, KEY, 'addPlayer', {accountName, playerID, buyIn} , ContractConnection)    
}

export function rmplayer(playerID){
    return eos.makeAction(ACTOR, KEY, 'rmplayer', {playerID} , ContractConnection)
}

export function seatPlayer(playerID, seatPosition){
    return eos.makeAction(ACTOR, KEY, 'seatPlayer', {playerID, seatPosition} , ContractConnection)
}

export function startGame(smallBlind){
    return eos.makeAction(ACTOR, KEY, 'startGame', {smallBlind} , ContractConnection)
}

export function startHand(){
    return eos.makeAction(ACTOR, KEY, 'startHand', {} , ContractConnection)
}

export function dealCards(handID){
    return eos.makeAction(ACTOR, KEY, 'dealCards', {handID} , ContractConnection)
}

export function call(playerID, handID, seatID){
    return eos.makeAction(ACTOR, KEY, 'call', {playerID, handID, seatID} , ContractConnection)
}

export function bet(playerID, handID, seatID, betValue){
    return eos.makeAction(ACTOR, KEY, 'bet', {playerID, handID, seatID, betValue} , ContractConnection)
}

export function raise(playerID, handID, seatID, raiseValue){
    return eos.makeAction(ACTOR, KEY, 'raise', {playerID, handID, seatID, raiseValue} , ContractConnection)
}

export function allin(playerID, handID, seatID){
    return eos.makeAction(ACTOR, KEY, 'allin', {playerID, handID, seatID} , ContractConnection)
}

export function fold(playerID, handID, seatID){
    return eos.makeAction(ACTOR, KEY, 'fold', {playerID, handID, seatID} , ContractConnection)
}

export function getFlop(handID){
    return eos.makeAction(ACTOR, KEY, 'getFlop', {handID} , ContractConnection)
}

export function getTurn(handID){
    return eos.makeAction(ACTOR, KEY, 'getTurn', {handID} , ContractConnection)
}

export function getRiver(handID){
    return eos.makeAction(ACTOR, KEY, 'getRiver', {handID} , ContractConnection)
}

export function showdown(handID){
    return eos.makeAction(ACTOR, KEY, 'showdown', {handID} , ContractConnection)
}

export function getCurrentPlayer(handID){
    return eos.makeAction(ACTOR, KEY, 'getCurrentPlayer', {handID} , ContractConnection)
}