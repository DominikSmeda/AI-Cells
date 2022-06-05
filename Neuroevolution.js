
import NeuralNet from './NeuralNetworkLib/NeuralNet.js';
import Cell from './Cell.js';
import Matrix from './NeuralNetworkLib/Matrix.js';

class Neuroevolution {
    constructor() {
        this.population = [];

        this.populationQuantity = 25;

        this.DNAs = [];
        this.mutationRate = 0.002//Math.random() / 3;
        console.log('MUTATION RATE:', this.mutationRate)
        this.statistics = []
        this.generation = 0;

        this.events = {}
    }

    async nextGeneration() {
        Cell.count = 0;
        Cell.podiumPlaceReset();
        await this.emit('next-generation')

        console.log('Next Generation')


        if (this.generation != 0) {
            let sum = 0;
            for (let i = 0; i < this.population.length; i++) {
                sum += this.population[i].calcFitness();
            }

            this.statistics.push({
                generation: this.generation,
                averageScore: sum / this.population.length
            })
            // for (let stat of this.statistics) {   
            //     console.log(`Generation ${stat.generation}: Average Score: ${stat.averageScore}`)
            // }
            console.log(`Generation ${this.statistics[this.statistics.length - 1].generation}: Average Score: ${this.statistics[this.statistics.length - 1].averageScore}`)
            this.selection();
        }


        let noPrototype = false;
        if (this.DNAs.length == 0) {
            noPrototype = true;
        }
        this.population = [];
        let sx = 50, sy = 60;

        for (let i = 0; i < this.populationQuantity; i++) {
            let cell = new Cell(sx, sy, 15);
            if (noPrototype) {
                cell.brain = new NeuralNet(Cell.inputNodes, Cell.hiddenNodes, Cell.outputNodes);
                cell.brain.randomize();

                cell.features = new Matrix(1, 1)
                cell.features.matrix[0][0] = Math.random();
                cell.features.multiply(Math.PI)
            }
            else {
                cell.brain = this.DNAs[i].brain;
                cell.features = this.DNAs[i].features;
                console.log('Using Ancestors DNAs')
                // cell.brain.weights_IH = this.DNAs[i].weights_IH;
                // cell.brain.weights_HO = this.DNAs[i].weights_HO;
                // cell.brain.bias_H = this.DNAs[i].bias_H;
                // cell.brain.bias_O = this.DNAs[i].bias_O;
            }

            this.population.push(cell)
        }

        this.generation++;
        await this.emit('next-generation-ready')
    }

    selection() {
        this.population = this.population.sort((a, b) => b.calcFitness() - a.calcFitness());

        let brains = this.population.map(el => el.brain);
        let features = this.population.map(el => el.features);
        let fitness = this.population.map(el => el.calcFitness())//.slice(0, this.population.length / 3);
        let mates = this.pair(fitness)
        // console.log(fitness)

        //generate new generation
        this.DNAs = [];
        for (let i = 0; i < this.populationQuantity; i++) {
            let nn = NeuralNet.cross(brains[mates[i][0]], brains[mates[i][1]]);
            // console.log(nn)
            nn.mutate(this.mutationRate);
            // let f = Matrix.cross(features[mates[i][0]], features[mates[i][1]]);

            // f.mutate(this.mutationRate);
            let f = new Matrix(1, 1);
            f.matrix[0][0] = (features[mates[i][0]].matrix[0][0] + features[mates[i][1]].matrix[0][0]) / 2
            // console.log(f)

            if (this.mutationRate > Math.random()) {
                f.matrix[0][0] = Math.random() * Math.PI
            }

            // console.log(f.matrix)

            this.DNAs.push({ brain: nn, features: f });
        }

        // console.log(this.DNAs)
    }

    pair(fitness) {
        let probability = [];
        // console.log(fitness)
        for (let i = 0; i < fitness.length; i++) {
            for (let j = 0; j < fitness[i]; j++)
                probability.push(i);
        }
        // console.log('probability', probability)
        function rand() {
            let val = probability[Math.floor(Math.random() * probability.length)];
            return val;
        }

        let mates = [];

        for (let i = 0; i < this.populationQuantity; i++) {
            let first = rand();
            let second;
            let probe = 0;
            do {
                second = rand()
                probe++;
            } while (first == second && probe < 2)

            mates.push([first, second])
        }

        return mates;
    }

    saveBest(amount = 1) {
        let DNAs = this.population.sort((a, b) => b.calcFitness() - a.calcFitness()).slice(0, amount);
        console.log(DNAs);
        DNAs = DNAs.map(({ brain, features }) => {
            return { brain: brain.extractData(), features }
        })

        return DNAs;
    }

    load(DNA) {
        this.reset();
        console.log('Loading DNA')
        this.DNAs = [];
        for (let i = 0; i < this.populationQuantity; i++) {
            this.DNAs.push({ brain: NeuralNet.fromData(DNA.brain), features: DNA.features })
        }
        console.log(this.DNAs)
        // this.selection();
    }

    reset() {
        this.population = [];
        this.DNAs = [];
        this.mutationRate = 0.002
        console.log('MUTATION RATE:', this.mutationRate)
        this.statistics = []
        this.generation = 0;
    }

    update(dt) {

        if (!this.population.length) return;
        let population = this.population.sort((a, b) => b.calcFitness() - a.calcFitness());


        for (let i = 0; i < population.length; i++) {
            population[i].color = 'blue'
            population[i].text = i + 1;
        }
        population[0].color = 'green'
        population[1].color = 'yellow'
        population[2].color = 'purple'
    }

    render() {

    }

    async emit(eventName, ...args) {
        if (this.events[eventName])
            await this.events[eventName](...args)
    }

    on(eventName, func) {
        this.events[eventName] = func;
    }

    off(eventName) {
        delete this.events[eventName];
    }
}

export default Neuroevolution;