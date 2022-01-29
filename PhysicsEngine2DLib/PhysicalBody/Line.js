
import Vector from '../Vector.js';
import Matrix from '../Matrix.js';
import PhysicalBody from './PhysicalBody.js';

class Line {
    constructor(x1, y1, x2, y2, frictionCoefficient = 0.98, color = 'black') {

        this.type = 'Line';
        this.startPoint = new Vector(x1, y1);
        this.endPoint = new Vector(x2, y2);
        this.directionalVector = this.endPoint.clone().subtr(this.startPoint).normalize();
        this.centerPoint = this.startPoint.clone().add(this.endPoint).div(2);
        this.length = this.endPoint.clone().subtr(this.startPoint).mag();
        this.angle = 0;

        this.refStart = new Vector(x1, y1);
        this.refEnd = new Vector(x2, y2);
        this.refDirectionalVector = this.directionalVector.clone();

        this.frictionCoefficient = frictionCoefficient;

        this.color = color;
        this.engineTempData = {
            lockPosition: false
        }

        this.objects = [];
    }

    update(dt) {
        return
        let rotMatrix = Matrix.rotationMatrix(this.angle);
        let dirMatrix = new Matrix();
        dirMatrix.fromArray(this.refDirectionalVector.toArray());
        let newDir = rotMatrix.multiply(dirMatrix);
        this.startPoint = this.centerPoint.add()
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

    collision(obj) {
        obj.collisionFriction = this.frictionCoefficient;
        this.objects.push(obj);
    }

    updateDirectionalVector() {
        this.directionalVector = this.endPoint.clone().subtr(this.startPoint).normalize();
    }

    move(vec) {
        this.startPoint.add(vec);
        this.endPoint.add(vec);
        this.updateDirectionalVector();
    }

}

export default Line;