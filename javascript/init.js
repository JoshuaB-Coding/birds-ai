const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const RENDER_BIRD_PATH = false; // looks rubbish at the moment - update later
const POPULATION_SIZE = 100;
const MAX_TIME = 10;
const NUMBER_OF_FOOD = 50;
const dt = 0.01;

function startGame() {
    var container = document.createElement('div');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    var domain = new Domain(container);
    var population = new Population(POPULATION_SIZE);

    var generationText = document.createElement('h1');
    document.body.appendChild(generationText);

    var intervalId = setInterval(function() {
        domain.resetCanvas();

        population.update();

        generationText.textContent = "Generation " + population.generation;

        population.render(domain.context);
    }, dt * 1000);
}
