// $('#p1').removeClass('d-flex')
// $('#p1').addClass('d-none')
// $('#p2>img').attr('src', './assets/Cards_2/_0052_BACK.png')
$(document).ready(() => {
    console.log(window.localStorage.getItem('email'));
    console.log(window.localStorage.getItem('pic'));
})

function addPlayer(seat, name, money) {
    var id = '#p'+seat
    $(id).removeClass('d-none');
    $(id).addClass('d-flex');
    $(id+' .user-money').html('$' + money);
    $(id+' .user-name').html(name);
}


function removePlayer(seat) {
    var id = '#p'+seat
    $(id).removeClass('d-flex');
    $(id).addClass('d-none');
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


var socket = io.connect('localhost:3000');

socket.on('connect', function () {
    socket.emit('addPlayer', {name: 'shubham', pic: 'pic', email: 'pandeyshrey33@gmail.com'}, (data) => {
        console.log(data);
    })
})

socket.on('time', (name) => {
    console.log(name);    
})

socket.on('message', (msg) => {
    console.log(msg);
})
