var socket = io();

var score1 = 0;
var score2 = 0;

const {username, room, p} = Qs.parse(location.search, {ignoreQueryPrefix : true});

function a(val){
    container.dataset.configuration = 7 + parseInt(val);
}


function z(){
    if(p == 1){
        document.getElementById("p1").disabled = false;
        document.getElementById("p2").disabled = true;
    }else{
        document.getElementById("p2").disabled = false;
        document.getElementById("p1").disabled = true;
    }

    // a(1);
}


socket.emit('joinRoom', {
    username, room
})

socket.on('leaveRoom', () => {
    location.href = '/';
})

socket.on('jokeRec', ({
    joke, sender
}) => {
    const jk = document.createElement("span");
    jk.className = "msg";
    jk.innerHTML = joke;
    if(sender == 1){
        document.getElementById("cbox-1").appendChild(jk);
    }else if(sender == 2){
        document.getElementById("cbox-2").appendChild(jk);
    }
    
    if(sender != p){
        chance = !chance;
        disableCheck();
    }

})

socket.on('ans', ({
    dataToSend, person
}) => {
    a(dataToSend);
    if(person == 1){
        score1+=parseInt(dataToSend);
    }else{
        score2+=parseInt(dataToSend);
    }

    document.getElementById("score1").innerHTML = score1;
    document.getElementById("score2").innerHTML = score2;

})

let chance=true;

function disableCheck(){
    if(chance){
        document.getElementById("p1").disabled = false;
        document.getElementById("p2").disabled = true;
    }else{
        document.getElementById("p2").disabled = false;
        document.getElementById("p1").disabled = true;
    }
}

function send(a){
    if(a == 1 && chance && p==1){
        socket.emit('joke', {joke: document.getElementById("p1").value, person: 1});
        chance = !chance;
    }else if(a == 2 && !chance && p==2){
        socket.emit('joke', {joke: document.getElementById("p2").value, person: 2});
        chance = !chance;
    }

    disableCheck();
}