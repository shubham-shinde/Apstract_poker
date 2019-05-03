// $('#p1').removeClass('d-flex')
// $('#p1').addClass('d-none')
// $('#p2>img').attr('src', './assets/Cards_2/_0052_BACK.png')

var playerID=-1;
var playerData = -1;
var playerInfo = -1;

$(document).ready(() => {
    console.log(playerInfo.email = window.localStorage.getItem('email'));
    console.log(playerInfo.pic = window.localStorage.getItem('pic'));
})

function addPlayer(player, ss) {
    var seat = player.seat + 1;
    var id = '#p'+seat
    var sss = Number(ss)+1;
    $('#p'+sss).removeClass('d-none');
    
    if(seat === 0) {
        return;
    }
    console.log(seat);
    
    $(id+'>.seat').addClass('d-none');
    $(id+'>.main').removeClass('d-none');
    $(id+'>.main').addClass('d-flex');
    $(id+'>.main .user-money').html('$' + player.balance);
    $(id+'>.main .user-name').html(player.username);

    if(player.inHand == false) deactivatePlayer(player.seat);
} 

function removeAllPlus() {
    for(var i=1; i<=8; i++)
        $('#p'+i+'>.seat').addClass('d-none')
}


function removePlayer(seat) {
    var id = '#p'+seat
    $(id).removeClass('d-flex');
    $(id).addClass('d-none');
}

function deactivatePlayer(seatID) {
    var seat = seatID+1;
    var id = '#p'+seat;    
    console.log(id);
    
    $(id+' .card-1').addClass('transparent')
    $(id+' .card-2').addClass('transparent')
}

function action(seat, action, money) {
    var id = '#p'+seat
    $(id+' .user-action').removeClass('d-none');
    $(id+' .user-action').html(action);
    $(id+' .user-money').html('$' + money);
}

var call = 120;
var total = 500

function sliderChange(value) {
    var Raise = call*2;
    var RaiseInput = Raise + value*(total-Raise)/100
    RaiseInput = Math.floor(RaiseInput)
    $('#raise-input').val(RaiseInput)
}

function inputChangeRaise(value) {
    console.log(value);
    var Raise = call*2;
    var RangeValue = 100*(value - Raise)/(total-Raise)
    $('#raise-range').val(RangeValue);
}

//cards is the array of cardNames(string) ex C-3 D-J
function showCard(seat, cards) {
    var id = '#p'+seat
    cards.forEach((ele, index) => {
        var ind = index+1;
        $(id+' .card-'+ind).attr('src', '../assets/Cards/'+ele+'.png');
    });
}

function updateTable(players) {
    for (const key in players) {
        if (players.hasOwnProperty(key)) {
            const ele = players[key];
            addPlayer(ele, key);
            if(key>=7) break;
        }
    }    
}







// var socket = io.connect('localhost:3000');
var socket = io.connect('192.168.0.52:3000');


socket.on('connect', function () {
    socket.emit('addPlayer', {name: 'shubham', pic: 'pic', email: 'pandeyshrey33@gmail.com'}, (data) => {
        console.log('addPlayers' ,data);
        updateTable(data.players) //Update table
        playerData = data.playerData; //Save player data
    })
    socket.on('state', players => {
        updateTable(players);
    })
    socket.on('fold', seatID => {
        var seat = seatID + 1;
        $('#p'+seat+' .user-action').removeClass('d-none')
        $('#p'+seat+' .user-action').html('Fold')
    })    
    socket.on('call', seatID => {
        var seat = seatID + 1;
        $('#p'+seat+' .user-action').removeClass('d-none')
        $('#p'+seat+' .user-action').html('Call')

    })
    socket.on('check', seatID => {
        var seat = seatID + 1;
        $('#p'+seat+' .user-action').removeClass('d-none')
        $('#p'+seat+' .user-action').html('Check')

    })
    socket.on('raise', (seatID, value) => {
        var seat = seatID + 1;
        $('#p'+seat+' .user-action').removeClass('d-none')
        $('#p'+seat+' .user-action').html('Raise '+value)

    })
    socket.on('bet', (seatID, value) => {
        var seat = seatID + 1;
        $('#p'+seat+' .user-action').removeClass('d-none')
        $('#p'+seat+' .user-action').html('Bet '+value)

    })    
})

socket.on('time', (name) => {
    console.log('time', name);    
})

socket.on('message', (msg) => {
    console.log('message', msg);
})


function seatMeHere(seat) {
    console.log('seat', seat);
    socket.emit('seatPlayer', {
        seatPosition: Number(seat) - 1,
        playerData
    },
    (data) => {
        console.log(data);
        for (const key in data.players) {
            if (data.players.hasOwnProperty(key)) {
                const ele = data.players[key];
                addPlayer(data.players[key], key);
                var sss = Number(key)+1;
                $('#p'+sss+'>.seat').addClass('d-none')
                if(key>=7) break;
            }
        }
        
    })
}




var Fold = () => {
    console.log('Fold function called');
    var { playerID } = playerData;
    var handID = 1;
    socket.emit('fold', {playerID, handID}, data => {
        console.log('fold', data);
        
    })
}
var Call = () => {
    console.log('Call function called');
    var { playerID } = playerData;
    var handID = 1;
    
    socket.emit('call', {playerID, handID}, data => {
        console.log('call', data);
        
    })
}
var Check = () => {
    console.log('Check function called');
    var { playerID } = playerData;
    var handID = 1;
    
    socket.emit('check', {playerID, handID}, data => {
        console.log('check', data);
        
    })
}
var Raise = () => {
    console.log('Raise function called');
    var { playerID } = playerData;
    var handID = 1;
    var raiseValue = 300;
    socket.emit('raise', {playerID, handID, raiseValue}, data => {
        console.log('raise', data);
        
    })
}


var Bet = () => {
    console.log('Bet function called');
    var { playerID } = playerData;
    var handID = 1;
    betValue = 200;
    socket.emit('bet', {playerID, handID, betValue}, data => {
        console.log('bet', data);
        
    })
}


















