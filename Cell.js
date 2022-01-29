import { Circle, RayCast, Vector } from "./PhysicsEngine2DLib/main.js";

const img = new Image();
img.src = './assets/red-blood-cell.png';
const imageScale = 3.2;

class Cell extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
        this.type = 'Circle';

        this.color = 'blue'
        console.log(ctx)
        this.rotation = 0;

    }

    update(dt, { objects }) {
        super.update(dt);

        let intersects = [];
        intersects.push(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation), objects));
        intersects.push(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation - Math.PI / 8), objects));
        intersects.push(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation + Math.PI / 8), objects));
        intersects.push(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation - Math.PI / 5), objects));
        intersects.push(RayCast.cast(this.position, new Vector(0, 1).rotate(this.rotation + Math.PI / 5), objects));
        intersects = intersects.flat()
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

        return resultData;
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
        ctx.arc(this.position.x, this.position.y, this.radius, this.rotation + Math.PI / 2 - Math.PI / 5, this.rotation + Math.PI / 2 + Math.PI / 5);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        // ctx.drawImage(img, -this.radius * imageScale / 2, -this.radius * imageScale / 2, this.radius * imageScale, this.radius * imageScale)
        ctx.restore();
    }
}

export default Cell;