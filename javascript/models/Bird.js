class Bird {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;

        this.image = new Image();
        this.image.src = "./assets/bird.png";

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

        this.U = this.U_min;
        this.alpha = 0;
        this.isAlive = true;
    }

    render(context) {
        context.translate(this.X, this.Y);
        context.rotate(this.alpha);
        context.drawImage(
            this.image,
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

        this.increaseSpeed();
        this.turnLeft();

        this.updatePosition();

        if (RENDER_BIRD_PATH) {
            this.updateFlightPath();
        }

        if (this.checkCollision()) {
            this.isAlive = false;
            console.log("OUCH!");
        }
    }

    checkCollision() {
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

    state(birds) {
        return [
            this.U,
            this.alpha,
            this.topWallDistance(),
            this.bottomWallDistance(),
            this.leftWallDistance(),
            this.rightWallDistance(),
            this.nearestBirdDistance(birds),
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

    nearestBirdDistance(birds) {
        if (!birds) return 0;
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
};