
import Vector from '../Vector.js';
import Force from '../Force/Force.js';

class PhysicalBody {
    constructor(args) {

        this.position = new Vector(args.position.x, args.position.y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.type = 'PhysicalBody';
        this.mass = 1;
        this.invertedMass = 1;
        this.elasticity = 1;
        this.friction = 1;
        this.collisionFriction = this.friction;

        this.forces = [];
        this.collide = true;

        this.preventCovering = true;
        this.collisionReaction = true;

        this.colliding = false;

        this.engineTempData = {
            lockPosition: false,
            lockDirection: null
        }
    }

    update(dt) {
        this.velocity.add(this.acceleration.clone().mult(dt));
        this.velocity.mult(this.collisionFriction);
        this.position.add(this.velocity.clone().mult(dt));


        //reset
        this.collisionFriction = this.friction;
    }

    applyForce(force) {
        if (!(force instanceof Force)) {
            throw new Error('Applyied object doesnt inherit from Force class');
            return;
        }
        this.forces.push(force);
        this.updateAcceleration();
    }

    removeForce() {

        this.updateAcceleration();
    }

    updateAcceleration() {
        for (let force of this.forces) {
            let f = force.calculate(this);
            if (this.mass == 0) {
                f.mult(0);
            }
            else {
                f.div(this.mass)
            }
            this.acceleration.add(f);
        }
    }

    collision(obj) {
        this.colliding = true;
        // if (this.preventCovering) {
        //     this.velocity.set(0, 0);
        // }
    }

    setMass(mass) {
        this.mass = mass;
        if (mass == 0) {
            this.invertedMass = 0;
        }
        else {
            this.invertedMass = 1 / mass;
        }
    }
}

export default PhysicalBody;