
import Vector from './Vector.js';

const img = new Image();
img.src = '../assets/red-blood-cell.png';

class Cell {
    constructor() {
        this.label = "";
        this.position = new Vector(0, 0);
        this.velocity = new Vector(3, 0);
        this.acceleration = new Vector(0, 0);
        this.rotation = 0;
        this.size = 50;
    }

    update(dt) {
        console.log('dt')
        this.velocity.add(this.acceleration.clone().mult(dt));
        this.position.add(this.velocity.clone().mult(dt));
    }

    render() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        console.log(this.position)
        ctx.rotate(this.rotation);
        ctx.drawImage(img, 0, 0, this.size, this.size);

        ctx.restore();
    }

}

export default Cell;