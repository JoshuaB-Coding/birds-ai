class Agent {
    constructor(layerInformation) {
        this.bird = new Bird(
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT,
        );

        this.brain = new NeuralNetwork(
            layerInformation,
            'dense',
        );

        this.isAlive = true;

        this.fitness = 0;
    }

    update(agents) {
        const agentState = this.bird.state(agents);
        this.fitness += this.fitnessFunction(agentState);

        if (!this.isAlive) return;
        
        const suggestedActions = this.brain.output(agentState);

        // Perform Sigmoid transformation
        var activation = [];
        for (let i = 0; i < suggestedActions.length; i++) {
            const sigmoid = 1.0 / ( 1.0 + Math.exp(-suggestedActions[i]) );
            activation.push(
                sigmoid
            );
        }

        const speedPreference = activation.slice(0, 3);
        const turnPreference = activation.slice(3, 6);

        this.performAction(speedPreference, turnPreference);

        this.bird.update();
        this.isAlive = this.bird.isAlive;
    }

    render(context) {
        this.bird.render(context);
    }

    checkBirdCollision() {

    }

    performAction(speedPreference, turnPreference) {
        const maxSpeedPreference = Math.max(...speedPreference);
        const maxTurnPreference = Math.max(...turnPreference);

        if (speedPreference[0] === maxSpeedPreference) {
            this.bird.increaseSpeed();
        }
        else if (speedPreference[1] === maxSpeedPreference) {
            this.bird.decreaseSpeed();
        }
        
        if (turnPreference[0] === maxTurnPreference) {
            this.bird.turnRight();
        }
        else if (turnPreference[1] === maxTurnPreference) {
            this.bird.turnLeft();
        }
    }

    reset() {
        this.bird.reset(
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT,
        );
        this.fitness = 0;
        this.isAlive = true;
    }

    fitnessFunction(agentState) {
        var fitnessValue = 0;

        if (this.isAlive) fitnessValue += dt;

        const distanceFromStart = this.bird.distanceFromStart();
        fitnessValue += distanceFromStart / Math.max(CANVAS_WIDTH, CANVAS_HEIGHT);

        return fitnessValue;
    }
};