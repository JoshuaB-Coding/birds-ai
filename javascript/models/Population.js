class Population {
    constructor(size) {
        this.size = size;

        // Neural network layer information
        const numberOfLayers = 2;
        const layerInformation = new LayerInformation(
            numberOfLayers,
            [0, 8],
            [8, 6],
        );

        this.agents = [];
        for (let _ = 0; _ < this.size; _++) {
            this.agents.push(new Agent(layerInformation));
        }

        this.food = new Food();

        this.isRunning = true;
        this.timeRunning = 0;
    }

    update() {
        this.timeRunning += dt;
        if (!this.isRunning || this.timeRunning > MAX_TIME) {
            this.timeRunning = 0;
            this.evolve();
            this.reset();
            this.isRunning = true;
        }

        this.isRunning = false;
        for (var agent of this.agents) {
            agent.update();
            if (agent.isAlive) this.isRunning = true;
        }

        this.checkForBirdCollisions();
    }

    render(context) {
        for (const agent of this.agents) {
            agent.render(context);
        }
    }

    reset() {
        for (var agent of this.agents) {
            agent.reset();
        }
    }

    evolve() {
        const bestAgents = this.bestPeformers();
        const numberOfBestAgents = bestAgents.length;

        for (let i = 0; i < this.size; i++) {
            if (bestAgents.includes(this.agents[i])) continue;

            const index1 = Math.floor( Math.random() * numberOfBestAgents );
            const index2 = Math.floor( Math.random() * numberOfBestAgents );
            
            const agent1 = bestAgents[index1];
            const agent2 = bestAgents[index2];

            this.agents[i].brain = agent1.brain.createChild(
                agent2.brain
            );
        }
    }

    bestPeformers() {
        var bestFitness = -Infinity;
        for (let i = 0; i < this.size; i++) {
            if (this.agents[i].fitness < bestFitness) continue;
            bestFitness = this.agents[i].fitness;
        }
        console.log(bestFitness);

        const fitnessThreshold = 0.8 * bestFitness;
        var bestAgents = [];
        for (const agent of this.agents) {
            if (agent.fitness < fitnessThreshold) continue;
            bestAgents.push(agent);
        }

        return bestAgents;
    }

    checkForBirdCollisions() {
        for (var agent of this.agents) {
            if (!agent.isAlive) continue;

            var closestAgent = this.findClosestAgent(agent);
            if (closestAgent === null) continue; // all birds are dead except one

            const dx = agent.bird.X - closestAgent.bird.X;
            const dy = agent.bird.Y - closestAgent.bird.Y;
            const distance = Math.sqrt( dx*dx + dy*dy );

            if (distance < 20) {
                agent.isAlive = false;
                agent.bird.isAlive = false;
                closestAgent.isAlive = false;
                closestAgent.bird.isAlive = false;
            }
        }
    }

    findClosestAgent(targetAgent) {
        var closestAgent = null;
        var closestAgentDistance = Infinity;
        for (const agent of this.agents) {
            if (agent === targetAgent) continue;
            if (!agent.isAlive) continue;

            const dx = agent.bird.X - targetAgent.bird.X;
            const dy = agent.bird.Y - targetAgent.bird.Y;
            const distance = Math.sqrt( dx*dx + dy*dy );

            if (distance < closestAgentDistance) {
                closestAgentDistance = distance;
                closestAgent = agent;
            }
        }
        return closestAgent;
    }
};