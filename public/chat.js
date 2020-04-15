var chatMessages = document.getElementById('messages');
var chatMessage = document.getElementById('chatMessage');
var messages = [];

chatMessage.addEventListener('keyup', function(e) {
	if(e.keyCode == 27) {
		document.activeElement.blur();
	}
	if(e.keyCode == 13) {
		if(chatMessage.value != "") {
			socket.emit('message', chatMessage.value);
			chatMessage.value = "";
		} else {
			document.activeElement.blur();
			e.stopPropagation();
		}
	}
})

chat.addEventListener('mouseleave', function() {
	chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('message', function(msg) {
	let message = document.createElement('div');
	message.className = 'message';
	let name = document.createElement('b');
	name.style.color = room.players[msg.id].color;
	if('msg' in msg) {
		name.innerText = room.players[msg.id].nickname + " ";
		message.innerText = msg.msg;
	} else {
		name.innerText = room.players[msg.id].nickname + " joined the game!";
	}
	message.prepend(name);
	chatMessages.prepend(message);
});

socket.on('joined', function(id) {
	let message = document.createElement('div');
	message.className = 'message';
	let name = document.createElement('b');
	name.style.color = room.players[id].color;
	name.innerText = room.players[id].nickname + " joined the game!";
	message.prepend(name);
	chatMessages.prepend(message);
});

socket.on('left', function(id) {
	let message = document.createElement('div');
	message.className = 'message';
	let name = document.createElement('b');
	name.style.color = room.players[id].color;
	name.innerText = room.players[id].nickname + " left the game.";
	message.prepend(name);
	chatMessages.prepend(message);
});