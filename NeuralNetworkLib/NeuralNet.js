
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
        let totalMutation = 0;
        this.bias_H.map((val, row, col) => {
            if (rate > Math.random()) {
                totalMutation++;
                console.log('mutate')
                return Math.random() * 2 - 1
            }
            return val;
        })

        this.bias_O.map((val, row, col) => {
            if (rate > Math.random()) {
                totalMutation++;
                console.log('mutate')
                return Math.random() * 2 - 1
            }
            return val;
        })
        this.check()
        // console.log('Total Mutations:', totalMutation)
        return this;
    }

    static cross(n1, n2) {
        try {
            if (n1.inputNodes != n2.inputNodes || n1.hiddenNodes != n2.hiddenNodes || n1.outputNodes != n2.outputNodes) {
                return Error('Diffrent sizes of Neural Nets')
            }
        } catch (err) {
            console.log(err)
            console.log(n1, n2)
        }

        let nn = new NeuralNet(n1.inputNodes, n1.hiddenNodes, n1.outputNodes);
        nn.randomize()
        let toUse = Math.ceil(n1.bias_H.cols * n1.bias_H.rows / 2);
        let used1 = 0;
        let used2 = 0;

        nn.bias_H.map((val, row, col) => {
            let choice = Math.floor(Math.random() * 2);

            if ((choice == 0 && (used1 < toUse)) || used2 >= toUse) {
                used1++;
                return n1.bias_H.matrix[row][col];
            }
            else if (used2 < toUse) {
                used2++;
                return n2.bias_H.matrix[row][col];
            }
            else {
                console.log('not compied')
            }
        });

        toUse = Math.ceil(n1.bias_O.cols * n1.bias_O.rows / 2);
        used1 = 0;
        used2 = 0;

        nn.bias_O.map((val, row, col) => {
            let choice = Math.floor(Math.random() * 2);

            if ((choice == 0 && (used1 < toUse)) || used2 >= toUse) {
                used1++;
                return n1.bias_O.matrix[row][col];
            }
            else if (used2 < toUse) {
                used2++;
                return n2.bias_O.matrix[row][col];
            }
            else {
                console.log('not compied')
            }
        });

        // console.log(toUse, used1, used2)
        // nn.bias_O.map((val, row, col) => {
        //     let choice = Math.floor(Math.random() * 2);
        // });
        nn.check()
        return nn;
    }


}

export default NeuralNet;