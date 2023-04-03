const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const RENDER_BIRD_PATH = false; // looks rubbish at the moment - update later
const POPULATION_SIZE = 10;
const MAX_TIME = 30;
const dt = 0.01;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    var domain = new Domain(container);
    var population = new Population(POPULATION_SIZE);

    var intervalId = setInterval(function() {
        domain.resetCanvas();

        population.update();

        population.render(domain.context);
    }, dt * 1000);
}
