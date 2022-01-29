
import Vector from './Vector.js';


class Line {
    constructor(x1, y1, x2, y2, color = 'black') {

        this.type = 'Line';
        this.startPoint = new Vector(x1, y1);
        this.endPoint = new Vector(x2, y2);
        this.directionalVector = this.endPoint.clone().subtr(this.startPoint).normalize();
        this.centerPoint = this.startPoint.clone().add(this.endPoint).div(2);
        this.length = this.endPoint.clone().subtr(this.startPoint).mag();

        this.color = color;

    }

    update(dt) {

    }

    render() {
        ctx.save();
        ctx.lineWidth = '3'
        ctx.beginPath();
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        ctx.lineTo(this.endPoint.x, this.endPoint.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.fillRect(this.centerPoint.x, this.centerPoint.y, 4, 4)
        ctx.restore();
    }


}

export default Line;