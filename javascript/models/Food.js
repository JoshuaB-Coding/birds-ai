class Food {
    constructor() {
        this.radius = 10;
        this.reset();
        this.isEaten = false;
    }

    render(context) {
        context.beginPath();
        context.arc(this.X, this.Y, this.radius, 0, Math.PI * 2, true);
        context.fillStyle = this.isEaten ? 'grey' : 'red';
        context.fill();
    }

    reset(X, Y) {
        this.isEaten = false;
        this.X = ( 0.1 + Math.random() * 0.8 ) * CANVAS_WIDTH;
        this.Y = ( 0.1 + Math.random() * 0.8 ) * CANVAS_HEIGHT;
    }
};