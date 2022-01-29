

class Timer {
    constructor() {
        this.lastTime = Date.now();
        this.divider = 100;
    }

    reset() {
        this.lastTime = Date.now();
    }

    deltaTime() {
        let lastTime = this.lastTime;
        this.reset();
        return (Date.now() - lastTime) / this.divider;
    }

    deltaTimeMs() {
        let lastTime = this.lastTime;
        this.reset();
        return Date.now() - lastTime;
    }

    timeElapsed() {
        return Date.now() - this.lastTime;
    }
}

export default Timer;