import { Circle } from "./PhysicsEngine2DLib/main.js";

const img = new Image();
img.src = './assets/red-blood-cell.png';
const imageScale = 3.2;

class Cell extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
        this.type = 'Circle';

        this.velocity.x = 3
        this.color = 'blue'
        console.log(ctx)
    }

    update(dt, { object }) {
        super.update(dt);

    }

    render() {

        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, -Math.PI / 2 - Math.PI / 6, -Math.PI / 2 + Math.PI / 6);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        // ctx.drawImage(img, -this.radius * imageScale / 2, -this.radius * imageScale / 2, this.radius * imageScale, this.radius * imageScale)
        ctx.restore();
    }
}

export default Cell;