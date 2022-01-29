/** @type {CanvasRenderingContext2D} */

import Timer from './Timer.js';

globalThis.ctxWidth = 0;
globalThis.ctxHeight = 0;
globalThis.ctx = null;

class GameManager {
    constructor() {

        this.timer = new Timer();
        this.controlObject = null;

        this.objects = [];
    }

    init() {

        this.timer.reset();

        this.events();

        this.gameLoop();
    }

    gameLoop() {
        requestAnimationFrame(() => {
            this.update();
            this.render();

            this.gameLoop();
        });
    }

    update() {
        let dt = this.timer.deltaTime();
        this.objects.forEach((obj) => {
            obj.update(dt);
        })
    }

    render() {
        ctx.clearRect(0, 0, ctxWidth, ctxHeight);
        this.objects.forEach((obj) => {
            obj.render();
        })
    }

    setCanvasSize(width, height) {
        ctxWidth = width;
        ctxHeight = height;
    }

    setCtx(_ctx) {
        ctx = _ctx;
    }

    events() {

    }

    add(obj) {
        this.objects.push(obj);
    }
}


export default GameManager;