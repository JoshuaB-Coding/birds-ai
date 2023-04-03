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

    update(agents, food) {
        const agentState = this.bird.state(agents, food);
        this.fitness += this.fitnessFunction(agentState);

        if (!this.isAlive) return;
        
        const suggestedActions = this.brain.output(agentState);

        // Perform Sigmoid transformation - very slow, limit input to Sigmoid
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
        if (this.isAlive === this.bird.isAlive) return; // no change in state

        // Punish for running into walls
        this.fitness *= 0.5;
        this.isAlive = false;
    }

    render(context) {
        this.bird.render(context);
    }

    performAction(speedPreference, turnPreference) {
        const maxSpeedPreference = Math.max(...speedPreference);
        const maxTurnPreference = Math.max(...turnPreference);

        if (speedPreference[0] !== maxSpeedPreference) {
            if (speedPreference[1] === maxSpeedPreference) {
                this.bird.increaseSpeed();
            }
            else if (speedPreference[2] === maxSpeedPreference) {
                this.bird.decreaseSpeed();
            }
        }

        if (turnPreference[0] !== maxTurnPreference) {
            if (turnPreference[1] === maxTurnPreference) {
                this.bird.turnRight();
            }
            else if (turnPreference[2] === maxTurnPreference) {
                this.bird.turnLeft();
            }
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

        // const distanceFromStart = this.bird.distanceFromStart();
        // fitnessValue += distanceFromStart / Math.max(CANVAS_WIDTH, CANVAS_HEIGHT);

        return fitnessValue;
    }

    eatFood(food) {
        if (!this.isAlive) return false;

        const dx = this.bird.X - food.X;
        const dy = this.bird.Y - food.Y;
        const distance = Math.sqrt( dx*dx + dy*dy );

        if (distance < food.radius * 2) {
            // Perhaps reward players for eating food more quickly
            this.fitness += MAX_TIME / NUMBER_OF_FOOD * 10;
            return true;
        }
        
        return false;
    }
};