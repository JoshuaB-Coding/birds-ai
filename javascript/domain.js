class Domain {
    constructor(parent) {
        this.canvas = document.createElement("canvas");
        this.setupCanvas();
        parent.appendChild(this.canvas);
    }

    setupCanvas() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
    }

    resetCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        
    }
};  
