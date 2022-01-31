
import NeuralNet from './NeuralNetworkLib/NeuralNet.js';
import Cell from './Cell.js';


class Neuroevolution {
    constructor(world) {
        this.population = [];

        this.populationQuantity = 5;
        this.world = world;

        this.DNAs = [];
        this.mutationRate = Math.random() / 3;
        console.log('MUTATION RATE:', this.mutationRate)
        this.statistics = []
        this.generation = 0;
    }

    async nextGeneration() {
        Cell.count = 0;
        console.log('Next Generation')

        this.world.objects = this.world.objects.filter(o => !(o instanceof Cell))


        if (this.generation != 0) {
            let sum = 0;
            for (let i = 0; i < this.population.length; i++) {
                sum += this.population[i].fitness;
            }

            this.statistics.push({
                generation: this.generation,
                averageScore: sum / this.population.length
            })
            for (let stat of this.statistics) {
                console.log(`Generation ${stat.generation}: Average Score: ${stat.averageScore}`)
            }
            this.selection();
        }



        this.population = [];
        let sx = 50, sy = 60;


        for (let i = 0; i < this.populationQuantity; i++) {
            let cell = new Cell(sx, sy, 10);
            if (this.generation == 0) {
                cell.brain = new NeuralNet(Cell.inputNodes, Cell.hiddenNodes, Cell.outputNodes);
                cell.brain.randomize();
            }
            else {
                cell.brain = this.DNAs[i];
                // cell.brain.weights_IH = this.DNAs[i].weights_IH;
                // cell.brain.weights_HO = this.DNAs[i].weights_HO;
                // cell.brain.bias_H = this.DNAs[i].bias_H;
                // cell.brain.bias_O = this.DNAs[i].bias_O;
            }
            // console.log(cell.brain)
            this.world.addObject(cell)
            this.population.push(cell)
        }

        this.generation++;
    }

    selection() {
        this.population = this.population.sort((a, b) => b.fitness - a.fitness);

        let brains = this.population.map(el => el.brain);
        let fitness = this.population.map(el => el.fitness)//.slice(0, this.population.length / 3);
        let mates = this.pair(fitness)
        // console.log(fitness)

        //generate new generation
        this.DNAs = [];
        for (let i = 0; i < this.populationQuantity; i++) {
            let nn = NeuralNet.cross(brains[mates[i][0]], brains[mates[i][1]]);
            // console.log(nn)
            nn.mutate(this.mutationRate);
            this.DNAs.push(nn);
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
            // do {
            second = rand()
            // } while (first == second)

            mates.push([first, second])
        }

        return mates;
    }

}

export default Neuroevolution;