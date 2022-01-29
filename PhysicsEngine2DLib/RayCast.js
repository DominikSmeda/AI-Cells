
import Line from "./PhysicalBody/Line.js";
import Vector from "./Vector.js";

class RayCast {
    static cast(position, directionalVec, objects) {
        let intersects = [];

        let posdirVec = position.clone().add(directionalVec);

        for (let obj of objects) {
            if (obj instanceof Line) {//getBoundingPoints? maybe make for all objects
                const denominator = (obj.startPoint.x - obj.endPoint.x) * (position.y - posdirVec.y) - (obj.startPoint.y - obj.endPoint.y) * (position.x - posdirVec.x);
                if (denominator == 0) {
                    continue;
                }

                const t = ((obj.startPoint.x - position.x) * (position.y - posdirVec.y) - (obj.startPoint.y - position.y) * (position.x - posdirVec.x)) / denominator;
                const u = -((obj.startPoint.x - obj.endPoint.x) * (obj.startPoint.y - position.y) - (obj.startPoint.y - obj.endPoint.y) * (obj.startPoint.x - position.x)) / denominator;

                if (t > 0 && t < 1 && u > 0) {
                    let point = new Vector(obj.startPoint.x + t * (obj.endPoint.x - obj.startPoint.x), obj.startPoint.y + t * (obj.endPoint.y - obj.startPoint.y));

                    intersects.push({ point, distance: point.clone().subtr(position) });
                }
            }
        }

        return intersects;
    }

    constructor(position, directionalVec) {
        this.position = position;
        this.directionalVec = directionalVec.normalize();
        this.intersects = [];
    }

    update(dt, { objects }) {
        this.intersects = RayCast.cast(this.position, this.directionalVec, objects);
    }

    render() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.rect(-5, -5, 10, 10);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.directionalVec.x * 20, this.directionalVec.y * 20);
        ctx.stroke();

        ctx.restore();

        // for (let intersect of this.intersects) {

        //     ctx.save();

        //     ctx.beginPath();
        //     ctx.arc(intersect.point.x, point.y, 5, 0, Math.PI * 2);
        //     ctx.strokeStyle = 'red';
        //     ctx.stroke();
        //     ctx.restore();
        // }
    }
};

export default RayCast;