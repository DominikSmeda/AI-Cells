


//TODO: 1) Make class and pass only canvas.
//      2) Connect class to Neuralnetwork as interface.

class NeuralNetworkVisualizer {
    constructor(canvas) {
        this.neuralNetwork;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.neuroevolution = null;

        this.mode = 'BEST';

        this.NEURON_SIZE = 16;
        this.PADDING = 60;

        this.visibility = false;
    }

    toggleVisibility() {
        if (this.visibility) {
            this.canvas.style.visibility = 'hidden';
        }
        else {
            this.canvas.style.visibility = 'visible';
        }
        this.visibility = !this.visibility;
    }

    update(dt) {

        if (!this.visibility) return
        this.render()

        if (this.mode == 'BEST') {
            if (this.neuroevolution.population.length) {
                console.log(this.neuroevolution.generation)
                this.renderNeuralNetwork(this.neuroevolution.population[0].brain, this.neuroevolution.population[0].text)
            }
        }

    }

    render() {
        // console.log(this.neuroevolution)
        // console.log(this.ctx)

        // this.ctx.fillRect(10, 10, 50, 50);
    }

    renderNeuralNetwork(neuralNetwork, text) {

        this.ctx.clearRect(0, 0, this.width, this.height);
        // console.log(neuralNetwork)

        let width = this.width - (2 * this.PADDING) - this.NEURON_SIZE * 2;
        let height = this.height - 2 * this.PADDING - this.NEURON_SIZE * 2;

        // this.weights_IH = new Matrix(this.hiddenNodes, this.inputNodes);
        // this.weights_HO = new Matrix(this.outputNodes, this.hiddenNodes);

        // this.bias_H = new Matrix(this.hiddenNodes, 1)
        // this.bias_O = new Matrix(this.outputNodes, 1)

        // this.ctx.strokeRect(this.PADDING, this.PADDING, width + this.NEURON_SIZE * 2, height + this.NEURON_SIZE * 2)
        this.ctx.save();
        this.ctx.font = "26px Arial";
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";

        this.ctx.strokeText("Brain of: " + text, width / 2 + this.PADDING, this.PADDING);
        this.ctx.fillText("Brain of: " + text, width / 2 + this.PADDING, this.PADDING);
        this.ctx.restore();

        let layers = [neuralNetwork.inputNodes, neuralNetwork.hiddenNodes, neuralNetwork.outputNodes];

        let weights = [neuralNetwork.weights_IH, neuralNetwork.weights_HO];
        let biases = [neuralNetwork.bias_H, neuralNetwork.bias_O];



        this.ctx.save();

        let colors = ['blue', 'red', 'purple', 'orange', 'crimson', 'yellow', 'olive', 'cyan', 'brown'];

        let color = 'black'

        for (let i = 0; i < weights.length; i++) {
            let matrix = weights[i];
            let layerNodes = layers[i];

            for (let r = 0; r < matrix.rows; r++) {

                // let color = colors[r]

                let tx = (i + 1) * width / (layers.length - 1) + this.PADDING + this.NEURON_SIZE;
                let ty = r * width / (layers[i + 1]) + this.PADDING + width / (layers[i + 1]) / 2 + this.NEURON_SIZE;

                let bias = biases[i].matrix[r][0];
                this.ctx.lineWidth = (bias + 1) * 4;
                let v = 255 - (bias + 1) * 255 / 2;

                this.ctx.beginPath()
                this.ctx.moveTo(tx, ty - this.NEURON_SIZE);
                this.ctx.lineTo(tx, ty - this.NEURON_SIZE - 20);

                // this.ctx.strokeStyle = `rgb(${v},${v},${v})`
                this.ctx.strokeStyle = 'cyan'
                this.ctx.stroke();

                for (let c = 0; c < matrix.cols; c++) {
                    //i - warstwa z której wychodzą 
                    // r - do którego trafia z warstwy i+1
                    // c - który neuron z warstwy i
                    // console.log(matrix.matrix[r][c])
                    let fx = i * width / (layers.length - 1) + this.PADDING + this.NEURON_SIZE;
                    let fy = c * width / (layerNodes) + this.PADDING + width / (layerNodes) / 2 + this.NEURON_SIZE;


                    let weight = matrix.matrix[r][c];
                    this.ctx.lineWidth = (weight + 1) * 4;


                    let v = 255 - (weight + 1) * 255 / 2;
                    let color = `rgb(${v},${v},${v})`


                    this.ctx.strokeStyle = color;

                    this.ctx.beginPath();
                    this.ctx.moveTo(fx, fy);
                    this.ctx.lineTo(tx, ty);
                    this.ctx.stroke();

                }

            }
        }

        this.ctx.restore();

        this.ctx.save();
        for (let i = 0; i < layers.length; i++) {
            let layerNodes = layers[i];

            for (let j = 0; j < layerNodes; j++) {
                let x = i * width / (layers.length - 1) + this.PADDING + this.NEURON_SIZE;
                let y = j * width / (layerNodes) + this.PADDING + width / (layerNodes) / 2 + this.NEURON_SIZE;
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.NEURON_SIZE, 0, 2 * Math.PI, false)
                this.ctx.fillStyle = 'red'
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
        this.ctx.restore();




        this.ctx.save();

        this.ctx.font = "16px Arial";
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = 'top';

        for (let i = 0; i < layers[0]; i++) {
            let x = 0 * width / (layers[0] - 1) + this.PADDING + this.NEURON_SIZE;
            let y = i * width / (layers[0]) + this.PADDING + width / (layers[0]) / 2 + this.NEURON_SIZE * 2 + 5;

            this.ctx.strokeText(neuralNetwork.inputLabels[i], x, y);
            this.ctx.fillText(neuralNetwork.inputLabels[i], x, y);
        }

        for (let i = 0; i < layers[layers.length - 1]; i++) {
            // let x = 20;
            let x = (layers.length - 1) * width / (layers[layers.length - 1]) + this.PADDING + this.NEURON_SIZE;
            let y = i * width / (layers[layers.length - 1]) + this.PADDING + width / (layers[layers.length - 1]) / 2 + this.NEURON_SIZE * 2 + 5;

            this.ctx.strokeText(neuralNetwork.outputLabels[i], x, y);
            this.ctx.fillText(neuralNetwork.outputLabels[i], x, y);
        }

        this.ctx.restore();

    }
}

export default NeuralNetworkVisualizer;