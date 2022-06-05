
import Matrix from "./Matrix.js";

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
        this.weights_HO = new Matrix(this.outputNodes, this.hiddenNodes);

        this.bias_H = new Matrix(this.hiddenNodes, 1)
        this.bias_O = new Matrix(this.outputNodes, 1)

        this.inputLabels = [];
        this.outputLabels = [];


        this.init();
    }

    init() {

    }

    randomize() {
        this.weights_IH.randomize()
        this.weights_HO.randomize()
        this.bias_H.randomize();
        this.bias_O.randomize();
    }

    check() {
        this.weights_IH.check()
        this.weights_HO.check()
        this.bias_H.check();
        this.bias_O.check();
    }

    feedForward(input_array) {
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_IH, inputs);
        try {
            hidden.add(this.bias_H);
        } catch (err) {
            console.log(input_array);
            throw err;

        }
        hidden.map(sigmoid);

        let output = Matrix.multiply(this.weights_HO, hidden);
        output.add(this.bias_O);
        output.map(sigmoid);

        return output.toArray()
    }

    mutate(rate) {

        NeuralNet.mutateMatrix(this.bias_H, rate);
        NeuralNet.mutateMatrix(this.bias_O, rate);
        NeuralNet.mutateMatrix(this.weights_HO, rate);
        NeuralNet.mutateMatrix(this.weights_IH, rate);

        this.check()
        // console.log('Total Mutations:', totalMutation)
        return this;
    }

    static cross(n1, n2) {
        if (n1.inputNodes != n2.inputNodes || n1.hiddenNodes != n2.hiddenNodes || n1.outputNodes != n2.outputNodes) {
            return Error('Diffrent sizes of Neural Nets')
        }

        let nn = new NeuralNet(n1.inputNodes, n1.hiddenNodes, n1.outputNodes);
        // nn.randomize()

        NeuralNet.crossMatrix(nn.bias_H, n1.bias_H, n2.bias_H);
        NeuralNet.crossMatrix(nn.bias_O, n1.bias_O, n2.bias_O);
        NeuralNet.crossMatrix(nn.weights_HO, n1.weights_HO, n2.weights_HO);
        NeuralNet.crossMatrix(nn.weights_IH, n1.weights_IH, n2.weights_IH);

        nn.check()
        return nn;
    }

    static crossMatrix(m, m1, m2) {
        let toUse = Math.ceil(m1.cols * m2.rows / 2);
        let used1 = 0;
        let used2 = 0;

        m.map((val, row, col) => {
            let choice = Math.floor(Math.random() * 2);

            if ((choice == 0 && (used1 < toUse)) || used2 >= toUse) {
                used1++;
                return m1.matrix[row][col];
            }
            else if (used2 < toUse) {
                used2++;
                return m2.matrix[row][col];
            }
            else {
                console.log('not compied')
            }
        });

        return m;
    }

    static mutateMatrix(m, rate) {
        m.map((val, row, col) => {
            if (rate > Math.random()) {
                console.log('mutate')
                return Math.random() * 2 - 1
            }
            return val;
        })

        return m;
    }

    extractData() {
        let data = {
            inputNodes: this.inputNodes,
            hiddenNodes: this.hiddenNodes,
            outputNodes: this.outputNodes,
            weights_IH: this.weights_IH,
            weights_HO: this.weights_HO,
            bias_H: this.bias_H,
            bias_O: this.bias_O
        }

        return { ...data }
    }

    static fromData(data) {
        data = { ...data };

        let nn = new NeuralNet(data.inputNodes, data.hiddenNodes, data.outputNodes)

        nn.weights_IH = data.weights_IH;
        nn.weights_HO = data.weights_HO;
        nn.bias_H = data.bias_H;
        nn.bias_O = data.bias_O;
        // console.log(nn)
        return nn;
    }
}

export default NeuralNet;