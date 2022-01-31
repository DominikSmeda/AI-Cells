
//Basic
import Vector from './Vector.js';
import Timer from './Timer.js';

//PhysicalBody
import PhysicalBody from './PhysicalBody/PhysicalBody.js';
import Circle from './PhysicalBody/Circle.js';
import ColidingObject from './Shapes/CollidingObject.js';
var t = new Timer();

class Engine2D {
    constructor() {

        this.objects = [];
        this.tickCollisionTimer = new Timer();
        this.tickCollisionMaxCalcTime = 2040;
        this.lastCollisionIndex = 0;

        this.helpers = [];


    }

    init() {

    }

    update(dt, data = {}) {
        for (let obj of this.objects) {
            let resultTab = obj.update(dt, { ...data, objects: this.objects });

            if (resultTab instanceof Array)
                for (let result of resultTab) {
                    switch (result.type) {
                        case 'Render': {
                            this.addHelper(result.helper)
                            break;
                        }
                        case 'Add Object': {
                            this.objects.push(result.object)
                            break;
                        }
                    }
                }
        }
        // let timer = new Timer();
        this.handleCollisions();
        // console.log('handleCollision', timer.deltaTimeMs());
        for (let obj of this.objects) {
            if (obj instanceof PhysicalBody)
                obj.engineTempData.lockPosition = false;
        }
    }

    render() {
        for (let helper of this.helpers) {
            helper();
        }
        this.helpers = [];
    }

    addObject(obj) {
        if (obj.type == 'Line') {
            this.objects.unshift(obj)
        } else {
            this.objects.push(obj);
        }
    }

    addHelper(fun) {
        this.helpers.push(fun);
    }

    handleCollisions() {

        // if (this.lastCollisionIndex == 0) {
        //     console.log(t.deltaTimeMs());
        // }
        this.tickCollisionTimer.reset();


        const length = this.objects.length;
        for (let index = this.lastCollisionIndex; index < length; index++) {
            // if (this.tickCollisionTimer.timeElapsed() > this.tickCollisionMaxCalcTime) {
            //     this.lastCollisionIndex = index;
            //     return
            // }

            let obj1 = this.objects[index];
            if (!(obj1 instanceof ColidingObject)) continue;
            for (let i = index + 1; i < length; i++) {
                if (!(this.objects[i] instanceof ColidingObject)) continue;
                this.detectCollisionBetween(obj1, this.objects[i]);
            }
        }
        this.lastCollisionIndex = 0;
    }

    detectCollisionBetween(obj1, obj2) {

        if (obj1.type == obj2.type) {
            switch (obj1.type) {
                case 'Circle':
                    this.collisionCircleCircle(obj1, obj2)//Todo check if direct invoke is faster
                    break;

                default:
                    return new Error('Cannot recognize PhysicalBody type');
            }
        }
        else {
            if (obj1.type == 'Line' || obj2.type == 'Line') {
                if (obj1.type == 'Circle' || obj2.type == 'Circle')
                    this.collisionLineCircle(obj1, obj2);
            }
            if (obj1.type == 'Rectangle' || obj2.type == 'Rectangle') {
                if (obj1.type == 'Circle' || obj2.type == 'Circle') {
                    this.collisionRectangleCircle(obj1, obj2);
                }
            }

        }

    }

    collisionCircleCircle(c1, c2) {
        return;
        let centerDistanceVec = c2.position.clone().subtr(c1.position)
        let centerDistance = centerDistanceVec.mag();
        let bothR = c1.radius + c2.radius;

        if (centerDistance <= bothR) {

            c1.collision(c2);
            c2.collision(c1);

            let distance = centerDistance - bothR;

            // if (c1.preventCovering && c2.preventCovering) {
            //penetration
            let sumOfInvertedMasses = c1.invertedMass + c2.invertedMass;
            if (sumOfInvertedMasses == 0) {
                let penetrationVec = centerDistanceVec.clone().normalize().mult(distance / 2);
                c1.position.add(penetrationVec);
                c2.position.add(penetrationVec);
            }
            else {

                if (c1.engineTempData.lockPosition || c2.engineTempData.lockPosition) {
                    if (c1.engineTempData.lockPosition) {
                        let penetrationVec = centerDistanceVec.clone().normalize().mult(-distance);
                        c2.position.add(penetrationVec);
                    }

                    if (c2.engineTempData.lockPosition) {
                        let penetrationVec = centerDistanceVec.clone().normalize().mult(distance);
                        c1.position.add(penetrationVec);
                    }
                }
                else {
                    let penetrationVec = centerDistanceVec.clone().normalize().mult(distance / (sumOfInvertedMasses));
                    c1.position.add(penetrationVec.clone().mult(c1.invertedMass));
                    c2.position.add(penetrationVec.mult(-c2.invertedMass));
                }
            }


            //response
            let m1 = c1.invertedMass;
            let m2 = c2.invertedMass;
            // if (c1.engineTempData.lockPosition) {
            //     m1 = 0;
            // }
            // if (c2.engineTempData.lockPosition) {
            //     m2 = 0;
            // }
            sumOfInvertedMasses = c1.invertedMass + c2.invertedMass;
            sumOfInvertedMasses = m1 + m2;
            let normal = centerDistanceVec.clone().negate().normalize();
            let relativeVelocity = c1.velocity.clone().subtr(c2.velocity);
            let separatingVelocity = relativeVelocity.dot(normal);

            let newSeparatingVelocity = -separatingVelocity * Math.min(c1.elasticity, c2.elasticity);
            let separatingVelocityDiff = newSeparatingVelocity - separatingVelocity;

            let impulse;
            if (sumOfInvertedMasses == 0) {
                impulse = 1; //or 0;
            }
            else {
                impulse = separatingVelocityDiff / (sumOfInvertedMasses);
            }

            let impulseVec = normal.mult(impulse);

            c1.velocity.add(impulseVec.clone().mult(m1));
            c2.velocity.add(impulseVec.mult(-m2));


            return { centerDistance, distance, collision: true };
        }
        else {
            return { collision: false };
        }
    }

    collisionLineCircle = (obj1, obj2) => {
        let circle, line;

        if (obj1.type == 'Circle') {
            circle = obj1;
            line = obj2;
        }
        else {
            circle = obj2;
            line = obj1;
        }

        let point = this.closestPointOnLine(circle, line);

        let distanceVec = point.clone().subtr(circle.position);
        let distance = distanceVec.mag();
        if (distance <= circle.radius) {
            line.collision(circle)
            circle.collision(line);
            circle.engineTempData.lockPosition = true;
            circle.engineTempData.lockDirection = distanceVec.clone().normalize();
            //penetration resolution
            let penetrationVec = distanceVec.clone().normalize().negate().mult(circle.radius - distance);
            circle.position.add(penetrationVec);

            //collision response
            let normal = distanceVec.clone().normalize().negate();
            let separatingVelocity = Vector.dot(circle.velocity, normal);
            let newSeparatingVelocity = -separatingVelocity * circle.elasticity;
            let separatingVelocityDiff = separatingVelocity - newSeparatingVelocity;
            circle.velocity.add(normal.mult(-separatingVelocityDiff))
        }

        // this.addHelper(() => {
        //     distanceVec.draw(circle.position.x, circle.position.y, '#ff0000', 1);
        //     ctx.save();
        //     ctx.fillStyle = "#ff0000";
        //     ctx.fillRect(point.x, point.y, 5, 5);
        //     ctx.restore();
        // })

        //Circle collide through wall? first check collision with line

    }

    closestPointOnLine(obj, line) {
        let objToLineStart = line.startPoint.clone().subtr(obj.position);
        if (Vector.dot(line.directionalVector, objToLineStart) > 0) {//go for Vector dot
            return line.startPoint;
        }

        let objToLineEnd = obj.position.clone().subtr(line.endPoint);
        if (line.directionalVector.dot(objToLineEnd) > 0) {//go for Vector dot
            return line.endPoint;
        }

        let closestDist = Vector.dot(line.directionalVector, objToLineStart);
        let closestVec = line.directionalVector.clone().mult(closestDist);
        return line.startPoint.clone().subtr(closestVec);

    }

    collisionRectangleCircle = (obj1, obj2) => {
        let circle, rect;

        if (obj1.type == 'Circle') {
            circle = obj1;
            rect = obj2;
        }
        else {
            circle = obj2;
            rect = obj1;
        }

        let dx = Math.abs(circle.position.x - rect.position.x);
        let dy = Math.abs(circle.position.y - rect.position.y);

        if (dx > (rect.width / 2 + circle.radius)) return false;
        if (dy > (rect.height / 2 + circle.radius)) return false;
        if ((dx <= rect.width / 2) || (dy <= rect.height / 2)) {
            circle.collision(rect);
            rect.collision(circle);

            return true;
        }

        let cDist = (dx - rect.width / 2) ** 2 + (dy - rect.height / 2) ** 2;
        if (cDist <= circle.r ** 2) {
            circle.collision(rect);
            rect.collision(circle);

            return true;
        }

        return false;
    }



}

export default Engine2D;