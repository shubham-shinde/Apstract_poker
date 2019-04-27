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


var socket = io.connect('localhost:3000');

socket.on('connect', function () {
    socket.emit('addPlayer', {name: 'shubham', pic: 'pic', email: 'email'}, (data) => {
        console.log(data);
    })
})

socket.on('time', (name) => {
    console.log(name);    
})
