// $('#p1').removeClass('d-flex')
// $('#p1').addClass('d-none')
// $('#p2>img').attr('src', './assets/Cards_2/_0052_BACK.png')
import $ from './jquery';
import io from 'socket.io-client/dist/socket.io'
// import '../css/bootstrap.css';
// import '../css/dash.css';
// import '../css/index.css';
// import '../css/App.css';
// import '../css/intro.css';


// $(document).ready(() => {
//     console.log(window.localStorage.getItem('email'));
//     console.log(window.localStorage.getItem('pic'));
// })

window['addPlayer'] = (seat, name, money) => {
    var id = '#p'+seat
    $(id).removeClass('d-none');
    $(id).addClass('d-flex');
    $(id+' .user-money').html('$' + money);
    $(id+' .user-name').html(name);
}


window['removePlayer'] = (seat) => {
    var id = '#p'+seat
    $(id).removeClass('d-flex');
    $(id).addClass('d-none');
}

window['action'] = (seat, action, money) => {
    var id = '#p'+seat
    $(id+' .user-action').removeClass('d-none');
    $(id+' .user-action').html(action);
    $(id+' .user-money').html('$' + money);
}

var call = 120;
var total = 500

window['sliderChange'] = (value) => {
    var Raise = call*2;
    var RaiseInput = Raise + value*(total-Raise)/100
    RaiseInput = Math.floor(RaiseInput)
    $('#raise-input').val(RaiseInput)
}

window['inputChangeRaise'] = (value) => {
    console.log(value);
    var Raise = call*2;
    var RangeValue = 100*(value - Raise)/(total-Raise)
    $('#raise-range').val(RangeValue);
}



// socket ================================================


var socket = io.connect(document.URL);

socket.on('connect', () => {
    socket.emit('addPlayer', {name: 'shubham', pic: 'pic', email: 'email'})
})


setTimeout(() => {
    
    socket.emit('addPlayer', {name: 'shubham', pic: 'pic', email: 'email'})
}, 2000);

socket.on('time', (name) => {
    console.log(name);    
})
