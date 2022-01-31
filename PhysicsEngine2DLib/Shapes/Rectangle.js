
import Vector from "../Vector.js";
import Shape from "./Shape.js";

class Rectangle extends Shape {
    constructor(centerX = 0, centerY = 0, width = 10, height = 10, fillStyle = 'black', strokeStyle = 'black') {
        super();
        this.type = 'Rectangle';
        this.position = new Vector(centerX, centerY);
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.index = 0;
        this.meta = false;
        // this.boundryBox = [];
    }

    update(dt) {
    }

    render() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.rect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    collision(obj) {

    }

    updateBoundryLines() {
        // this.boundryBox = [];
        // this.boundryLines.push(new Line(this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.x + this.width / 2, this.position.y - this.height / 2));
        // this.boundryLines.push(new Line(this.position.x, this.position.y, this.position.x, this.position.y));
        // this.boundryLines.push(new Line(this.position.x, this.position.y, this.position.x, this.position.y));
        // this.boundryLines.push(new Line(this.position.x, this.position.y, this.position.x, this.position.y));


    }
}

export default Rectangle;