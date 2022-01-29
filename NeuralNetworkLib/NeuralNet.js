

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    // return sigmoid(x) * (1 - sigmoid(x));
    return y * (1 - y);
}


class NeuralNet {
    constructor(inputNodes, hiddenNodes, outputNodes) {

        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.weights_IH = new Matrix(this.hiddenNodes, this.inputNodes);
        this.weights_IH.randomize()

        this.weights_HO = new Matrix(this.outputNodes, this.hiddenNodes);
        this.weights_HO.randomize()


        this.bias_H = new Matrix(this.hiddenNodes, 1)
        this.bias_O = new Matrix(this.outputNodes, 1)
        this.bias_H.randomize();
        this.bias_O.randomize();

        this.init();
    }

    init() {

    }

    feedForward(input_array) {

        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_IH, inputs);
        hidden.add(this.bias_H);

        hidden.map(sigmoid);

        let output = Matrix.multiply(this.weights_HO, hidden);
        output.add(this.bias_O);
        output.map(sigmoid);

        return output.toArray()
    }

    train(inputs, targets) {
        let outputs = this.feedForward(inputs)
        console.log('OUTPUT', outputs);
        outputs = Matrix.fromArray(outputs);
        targets = Matrix.fromArray(targets)

        let outputErrors = Matrix.substract(targets, outputs);
        outputErrors.print('Error')

        let weightsHidOutT = Matrix.transpose(this.weights_HO);
        let hiddenErrors = Matrix.multiply(weightsHidOutT, outputErrors)

    }

}