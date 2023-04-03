const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const dt = 0.1;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    var domain = new Domain(container);

    var intervalId = setInterval(function() {

    }, dt * 1000);
}
