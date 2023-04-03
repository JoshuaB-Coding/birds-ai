class Bird {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;

        this.image_alive = new Image();
        this.image_alive.src = "./assets/bird.png";

        this.image_dead = new Image();
        this.image_dead.src = "./assets/dead_bird.png";

        this.width = 40;
        this.height = 20;
        this.scale = 1; // scale image size by this amount

        // Bird motion constants
        this.U_min = 50; // px/s
        this.U_max = 400; // px/s
        this.turn_rate = 0.05; // rad/s

        // Bird flight path history
        this.max_flight_path_length = 400;
        this.flight_path_X = [];
        this.flight_path_Y = [];

        this.U = this.generateRandomVelocity();
        this.alpha = this.generateRandomAngle();
        this.isAlive = true;
        this.X_START = this.X;
        this.Y_START = this.Y;
    }

    render(context) {
        let image;
        if (this.isAlive) image = this.image_alive;
        else image = this.image_dead;

        context.translate(this.X, this.Y);
        context.rotate(this.alpha);
        context.drawImage(
            image,
            -this.width / 2, -this.height / 2,
            this.scale * this.width, this.scale * this.height
        );
        context.rotate(-this.alpha);
        context.translate(-this.X, -this.Y);

        if (RENDER_BIRD_PATH) {
            this.renderFlightPath(context);
        }
    }

    renderFlightPath(context) {
        const length = this.flight_path_X.length;

        context.beginPath();

        for (let i = 0; i < length - 1; i++) {
            context.moveTo(
                this.flight_path_X[i],
                this.flight_path_Y[i],
            );
            context.lineTo(
                this.flight_path_X[i + 1],
                this.flight_path_Y[i + 1],
            );

            context.stroke();
        }
    }

    update() {
        if (!this.isAlive) return;

        this.updatePosition();

        if (RENDER_BIRD_PATH) {
            this.updateFlightPath();
        }

        if (this.checkWallCollision()) {
            this.isAlive = false;
        }
    }

    checkWallCollision() {
        if (this.topWallDistance() < 0) {
            this.Y = 0;
            return true;
        }
        else if (this.bottomWallDistance() < 0) {
            this.Y = CANVAS_HEIGHT;
            return true;
        }
        else if (this.leftWallDistance() < 0) {
            this.X = 0;
            return true;
        }
        else if (this.rightWallDistance() < 0) {
            this.X = CANVAS_WIDTH;
            return true;
        }
        return false;
    }

    updatePosition() {
        const dX_dt = this.U * Math.cos(this.alpha);
        const dY_dt = this.U * Math.sin(this.alpha);

        this.X += dX_dt * dt;
        this.Y += dY_dt * dt;
    }

    updateFlightPath() {
        // Very inefficient
        this.flight_path_X.push(this.X);
        this.flight_path_Y.push(this.Y);

        if (this.flight_path_X.length > this.max_flight_path_length) {
            this.flight_path_X = this.flight_path_X.slice(-this.max_flight_path_length);
            this.flight_path_Y = this.flight_path_Y.slice(-this.max_flight_path_length);
        }
    }

    state(agents, foodArray) {
        // Fix to account for bird line of sight and sight range
        return [
            this.U, // turned off
            this.alpha, // turned off
            this.topWallDistance(),
            this.bottomWallDistance(),
            this.leftWallDistance(),
            this.rightWallDistance(),
            this.nearestBirdDistanceX(agents),
            this.nearestBirdDistanceY(agents),
            this.nearestFoodDistanceX(foodArray),
            this.nearestFoodDistanceY(foodArray),
        ];
    }

    topWallDistance() {
        return this.Y;
    }

    bottomWallDistance() {
        return CANVAS_HEIGHT - this.Y;
    }

    leftWallDistance() {
        return this.X;
    }

    rightWallDistance() {
        return CANVAS_WIDTH - this.X;
    }

    nearestBirdDistanceX(agents) {
        if (!agents) return 0;

        let nearestDistance = Infinity;
        for (const agent of agents) {
            if (agent.bird === this) continue;

            const dx = agent.bird.X - this.X;
            if (Math.abs(nearestDistance) > Math.abs(dx)) nearestDistance = dx;
        }

        return nearestDistance;
    }

    nearestBirdDistanceY(agents) {
        if (!agents) return 0;

        let nearestDistance = Infinity;
        for (const agent of agents) {
            if (agent.bird === this) continue;

            const dy = agent.bird.Y - this.Y;
            if (Math.abs(nearestDistance) > Math.abs(dy)) nearestDistance = dy;
        }

        return nearestDistance;
    }

    nearestFoodDistanceX(foodArray) {
        if (!foodArray) return 0;

        let nearestDistance = Infinity;
        for (const food of foodArray) {
            const dx = food.X - this.X;
            if (Math.abs(nearestDistance) > Math.abs(dy)) nearestDistance = dx;
        }

        return nearestDistance;
    }

    nearestFoodDistanceY(foodArray) {
        if (!foodArray) return 0;

        let nearestDistance = Infinity;
        for (const food of foodArray) {
            const dy = food.Y - this.Y;
            if (Math.abs(nearestDistance) > Math.abs(dy)) nearestDistance = dy;
        }

        return nearestDistance;
    }

    increaseSpeed() {
        const acceleration = this.calculateAcceleration();
        this.U = Math.min(this.U + acceleration[0], this.U_max);
    }

    decreaseSpeed() {
        const acceleration = this.calculateAcceleration();
        this.U = Math.max(this.U + acceleration[1], this.U_min);
    }

    calculateAcceleration() {
        // acceleration[0] = positive; acceleration[1] = negative
        var acceleration = [0, 0];

        // Improve this model later
        acceleration[0] = 1;// f(this.U_max - this.U);
        acceleration[1] = -1;// f(this.U_min - this.U);

        return acceleration;
    }

    turnRight() {
        this.alpha += this.turn_rate;
        this.correctFlightAngle();
    }

    turnLeft() {
        this.alpha -= this.turn_rate;
        this.correctFlightAngle();
    }

    correctFlightAngle() {
        if (this.alpha > 2 * Math.PI) this.alpha -= 2 * Math.PI;
        else if (this.alpha < 0) this.alpha += 2 * Math.PI;
    }

    generateRandomVelocity() {
        return this.U_min + Math.random() * (this.U_max - this.U_min);
    }

    generateRandomAngle() {
        return Math.random() * 2 * Math.PI;
    }

    reset(X, Y) {
        this.X = X;
        this.Y = Y;
        this.U = this.generateRandomVelocity();
        this.alpha = this.generateRandomAngle();
        this.isAlive = true;
        this.X_START = this.X;
        this.Y_START = this.Y;
    }

    distanceFromStart() {
        const dx = this.X - this.X_START;
        const dy = this.Y - this.Y_START;
        return Math.sqrt( dx*dx + dy*dy );
    }
};