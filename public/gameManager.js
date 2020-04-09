var input = {enabled: true};

var info = document.getElementById('info');

window.requestAnimationFrame(update);
var lastTime = 0;
function update(time) {
	deltaTime = (time - lastTime)/1000;
	lastTime = time;

	if(game.game != 'none') {
		game.update(deltaTime);
	}
	window.requestAnimationFrame(update);
}

setInterval(function() {
	socket.emit('input', input);
}, 1000 / 60);

document.addEventListener('keydown', function(e) {
	if(input.enabled) {
		game.handleKeyDown(e);
	}
});

document.addEventListener('keyup', function(e) {
	if(e.keyCode == 27) {
		document.activeElement.blur();
		input.enabled = true;
	}
	if(e.keyCode == 13) {
		chatMessage.focus();
	}
	if(input.enabled) {
		game.handleKeyUp(e);
	}
});

document.addEventListener('focus', function() {
	input.enabled = false;
	game.handleFocus();
}, true);

document.addEventListener('blur', function() {
	if(document.activeElement == document.body) {
		input.enabled = true;
	}
}, true);