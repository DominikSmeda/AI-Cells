



class NeuralNetworkVisualizer {
    constructor(ctx, width, height) {
        this.neuralNetwork;

        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}