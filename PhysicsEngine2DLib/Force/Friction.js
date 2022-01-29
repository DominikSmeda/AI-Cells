
import Force from './Force.js';

class Friction extends Force {
    constructor(Mk, Ms) {
        super('Friction');

        this.Mk = Mk;
        this.Ms = Ms

    }

    calculate(obj) {
        // let Fn = 
        // return;
    }
}

export default Friction;