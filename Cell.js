
import { Circle, RayCast, Vector, Line } from "./PhysicsEngine2DLib/main.js";
import NeuralNet from "./NeuralNetworkLib/NeuralNet.js";
import Rectangle from "./PhysicsEngine2DLib/Shapes/Rectangle.js";

// const img = new Image();
// img.src = './assets/red-blood-cell.png';
// const imageScale = 3.2;
//TODO: Zindex for map and podium place
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

const PODIUM_PLACE = 3;

class Cell extends Circle {
    static count = 0;
    static inputNodes = 6;
    static hiddenNodes = 5;
    static outputNodes = 2;
    static podiumPlace = PODIUM_PLACE;
    static podiumPlaceReset() {
        Cell.podiumPlace = PODIUM_PLACE;
    }

    constructor(x, y, r) {
        super(x, y, r);
        this.type = 'Circle';

        this.color = 'blue'
        this.text = "";
        this.rotation = 0;
        this.friction = 0.98;
        this.elasticity = 1;
        this.number = Cell.count++;

        this.stop = false;
        this.brain = null
        // this.deltaTime = 0.5;
        this.health = 300;

        this.lastDeltaTime = 0;

        this.lastSquareIndex = 0;
        this.fitness = 0;
    }

    update(dt, { objects }) {
        super.update(dt);

        // this.lastDeltaTime += dt;
        // if (this.lastDeltaTime > this.deltaTime) {
        //     this.lastDeltaTime = 0;
        // }
        // else {
        //     return;
        // }

        let intersects = [];

        let input = Array(5)
        function check(r, index) {
            intersects.push(r);
            if (r.length) {
                input[index] = r[0].distance;
            }
            else {
                input[index] = 1000;
            }
        }

        check(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation), objects), 0);
        check(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation - Math.PI / 3), objects), 1);
        check(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation + Math.PI / 3), objects), 2);
        check(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation - Math.PI / 5), objects), 3);
        check(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation + Math.PI / 5), objects), 4);

        intersects = intersects.flat();
        let resultData = []
        for (let intersect of intersects) {

            resultData.push({
                type: 'Render',
                helper: () => {
                    ctx.save();

                    ctx.beginPath();
                    ctx.arc(intersect.point.x, intersect.point.y, 5, 0, Math.PI * 2);
                    ctx.strokeStyle = 'red';
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.strokeStyle = "#ff000044"
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(intersect.point.x, intersect.point.y)
                    ctx.stroke()
                    ctx.restore();
                }
            })
        }

        input.push(this.velocity.mag())

        // console.log(intersects)
        // console.log(this.velocity);

        let output = this.brain.feedForward(input);
        // console.log('OUTPUT: Cell' + this.number, output);

        this.acceleration.set(0, 0)

        if (this.stop) {
            return;
        }
        if (output[0] > 0.5) {
            this.acceleration = new Vector(0, -6).rotate(this.rotation)
        }
        if (output[1] < 0.5) {
            this.acceleration = new Vector(0, 6).rotate(this.rotation)
        }

        if (output[0] > 0.5) {
            this.rotation += Math.PI / 80
        }
        if (output[1] < 0.5) {
            this.rotation -= Math.PI / 80
        }

        return resultData;
    }

    render() {
        this.fitness = Math.floor(this.fitness)
        this.health = Math.floor(this.health)
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        // if (this.fitness >= 40) {
        //     ctx.fillStyle = 'green'
        // }
        // ctx.globalAlpha = 0.4;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, this.rotation + Math.PI / 2 - Math.PI / 5, this.rotation + Math.PI / 2 + Math.PI / 5);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        // ctx.globalAlpha = 0.5
        ctx.font = "11px Arial";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.strokeText(this.fitness, this.position.x, this.position.y - this.radius / 1.5);
        ctx.fillText(this.fitness, this.position.x, this.position.y - this.radius / 1.5);

        ctx.font = "20px Arial";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.strokeText(this.text, this.position.x, this.position.y + this.radius / 2);
        ctx.fillText(this.text, this.position.x, this.position.y + this.radius / 2);

        ctx.font = "11px Arial";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "lightgreen";
        ctx.textAlign = "center";
        ctx.strokeText(this.health, this.position.x, this.position.y + this.radius);
        ctx.fillText(this.health, this.position.x, this.position.y + this.radius);
        // ctx.drawImage(img, -this.radius * imageScale / 2, -this.radius * imageScale / 2, this.radius * imageScale, this.radius * imageScale)
        ctx.restore();
    }

    collision(obj) {


        if (obj instanceof Rectangle) {
            this.fitness = obj.index * 25 //+ this.health;

            if (obj.meta) {
                this.stop = true;
                if (Cell.podiumPlace >= 0)
                    this.fitness += 50 * Cell.podiumPlace--;
            }
        }
        if (this.stop) return;
        if (this.fitness < 30) {
            this.fitness = 1;
        }

        if (obj instanceof Line) {
            // this.fitness = 0;
            this.health -= this.velocity.mag();
            if (this.health <= 0) {
                // this.position.set(60, 60)
                this.health = 0;
                this.stop = true;
                this.velocity.set(0, 0)
            }

        }
    }
}

export default Cell;