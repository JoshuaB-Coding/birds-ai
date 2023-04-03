const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const RENDER_BIRD_PATH = false; // looks rubbish at the moment - update later
const dt = 0.01;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    var domain = new Domain(container);
    var bird = new Bird(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    var intervalId = setInterval(function() {
        domain.resetCanvas();

        bird.update();

        domain.render();
        bird.render(domain.context);
    }, dt * 1000);
}
