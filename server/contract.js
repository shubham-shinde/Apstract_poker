import eos from "./eos";
//TODO : Call functions from smart contracts
var ACTOR = 'eospoker1234'
var KEY = '5KGf9fnZ6auaSuwNqCBT2NARu5T4GSCAyCKbLsGfsUvW4fkV7uM'
var ContractConnection = {
    EOS_CONTRACT_NAME: ACTOR,
    EOS_HTTP_ENDPOINT: "http://jungle2.cryptolions.io:80",
    KEY: KEY
}

export async function addPlayer (playerAccountName, playerId, buyIn){
    try {
        await eos.makeAction(ACTOR, KEY, 'addplayer', {s: ACTOR, playerAccountName, playerId, buyIn} , ContractConnection)   
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function rmplayer(playerId){
    try {
        await eos.makeAction(ACTOR, KEY, 'rmplayer', {s: ACTOR, playerId} , ContractConnection)
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function seatPlayer(seatPosition, buyIn){
    try {
        await eos.makeAction(ACTOR, KEY, 'seatplayer', {s: ACTOR, seatPosition, buyIn} , ContractConnection)
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

export async function creategame(maxPlayers, rakePercentage, smallBlind){
    try {
        await eos.makeAction(ACTOR, KEY, 'creategame', {s: ACTOR, maxPlayers, rakePercentage, smallBlind} , ContractConnection)
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

export async function startGame(smallBlind){
    try {
        await eos.makeAction(ACTOR, KEY, 'startgame', {s: ACTOR, smallBlind} , ContractConnection)
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function startHand(dealerPosition, currentPlayer, smallBlind, playersOnTable, playersInHand){
    try {
        await eos.makeAction(ACTOR, KEY, 'starthand', {s: ACTOR, dealerPosition, currentPlayer, smallBlind, playersOnTable, playersInHand} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function dealCards(handId){
    try {
        await eos.makeAction(ACTOR, KEY, 'dealcards', {s: ACTOR, handId} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function call(playerId, handId, handSeatId){
    try {
        await eos.makeAction(ACTOR, KEY, 'actioncall', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function bet(playerId, handId, handSeatId, betValue){
    try {
        await eos.makeAction(ACTOR, KEY, 'actionbet', {s: ACTOR, playerId, handId, handSeatId, betValue} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function raise(playerId, handId, handSeatId, raiseValue){
    try {
        await eos.makeAction(ACTOR, KEY, 'actionraise', {s: ACTOR, playerId, handId, handSeatId, raiseValue} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function allin(playerId, handId, handSeatId){
    try {
        await eos.makeAction(ACTOR, KEY, 'actionallin', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function fold(playerId, handId, handSeatId){
    try {
        await eos.makeAction(ACTOR, KEY, 'actionfold', {s: ACTOR, playerId, handId, handSeatId} , ContractConnection)
        return true
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
export async function getFlop(handId){
    try {
        var transection = await eos.makeAction(ACTOR, KEY, 'openflop', {s: ACTOR, handId} , ContractConnection)
        var data = await eos.getTableRows(ContractConnection, 'hand');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(ele.handId == handId) return ele.flop
            }
        }
        return false;
    }
    catch(err) {
        return false;
    }
}

export async function getTurn(handId){
    try {
        await eos.makeAction(ACTOR, KEY, 'openturn', {s: ACTOR, handId} , ContractConnection)
        var data = await eos.getTableRows(ContractConnection, 'hand');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(ele.handId == handId) return ele.turn
            }
        }
        return false;
        
    } catch (error) {
        return false;
    }
}

export async function getRiver(handId){
    try {
        await eos.makeAction(ACTOR, KEY, 'openriver', {s: ACTOR, handId} , ContractConnection)
        var data = await eos.getTableRows(ContractConnection, 'hand');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(ele.handId == handId) return ele.river
            }
        }
        return false;
        
    } catch (error) {
        return false;
    }
}

export async function showdown(handId){
    try {
        await eos.makeAction(ACTOR, KEY, 'showdown', {s: ACTOR, handId} , ContractConnection)
        return true;
    } catch (error) {
        return false;
    }
}

export async function getCurrentPlayer(handId){
    try {
        // var transection = await eos.makeAction(ACTOR, KEY, 'openflop', {s: ACTOR, handId} , ContractConnection)
        var data = await eos.getTableRows(ContractConnection, 'hand');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(ele.handId == handId) return ele.currentPlayer
            }
        }
        return false;
        
    } catch (error) {
        return false;
    }
}

export async function actionCheck(playerID, handID){
    try{
        await eos.makeAction(ACTOR, KEY, 'actioncheck', {}, ContractConnection)
        return true;
    }
    catch(error){
        console.log(error);
        return false;
    }
}

export async function getHandData(handId){
    try {
        var data = await eos.getTableRows(ContractConnection, 'hand');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(ele.handId == handId) return ele
            }
        }
        return false;
    }
    catch(err) {
        return false;
    }
}

export async function getCurrentHand(){
    try {
        var data = await eos.getTableRows(ContractConnection, 'hand');
        var max = -1;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ele = data[key];
                if(max < ele.handId) max = ele.handId;
            }
        }
        return max;
    }
    catch(err) {
        return -1;
    }
}

export async function getPlayerData(){
    try {
        var data = await eos.getTableRows(ContractConnection, 'players');
        return data;
    }
    catch(err) {
        return -1;
    }
}