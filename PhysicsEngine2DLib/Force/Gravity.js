
import Force from './Force.js';

class Gravity extends Force {
    constructor(gVec, id = 0) {
        super('Gravity');

        this.gVec = gVec;

    }

    calculate(obj) {
        return this.gVec.clone().mult(obj.mass);
    }
}

export default Gravity;