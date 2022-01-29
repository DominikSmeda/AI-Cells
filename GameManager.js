/** @type {CanvasRenderingContext2D} */

import { Engine2D, Timer, Vector } from './PhysicsEngine2DLib/main.js';

globalThis.ctxWidth = 0;
globalThis.ctxHeight = 0;
globalThis.ctx = null;

var KEYS = {};
window.addEventListener('keydown', e => {
    KEYS[e.key] = true;
})
window.addEventListener('keyup', e => {
    KEYS[e.key] = false;
})

class GameManager extends Engine2D {
    constructor() {
        super();

        this.timer = new Timer();
        this.controlObject = null;
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
        this.control()
        let dt = this.timer.deltaTime();
        super.update(dt);
    }

    render() {
        ctx.clearRect(0, 0, ctxWidth, ctxHeight);
        this.objects.forEach((obj) => {
            obj.render();
        })

        super.render();
    }

    setCanvasSize(width, height) {
        ctxWidth = width;
        ctxHeight = height;
    }

    setCtx(_ctx) {
        ctx = _ctx;
    }

    keyControl(obj) {
        if (this.controlObject)
            this.controlObject.focused = false;
        this.controlObject = obj;
        obj.focused = true;
    }

    control() {
        this.controlObject.acceleration.set(0, 0)
        if (KEYS['w']) {
            this.controlObject.acceleration = new Vector(0, 10).rotate(this.controlObject.rotation)
        }
        if (KEYS['s']) {
            this.controlObject.acceleration = new Vector(0, -10).rotate(this.controlObject.rotation)
        }

        if (KEYS['d']) {
            this.controlObject.rotation += Math.PI / 60
        }
        if (KEYS['a']) {
            this.controlObject.rotation -= Math.PI / 60
        }
    }

    events() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'r':
                case 'R':
                    this.controlObject.acceleration.set(0, 0);
                    this.controlObject.velocity.set(0, 0);
                    break;

                case 'c':
                    console.log(this.controlObject.position, this.controlObject.velocity);
                    break;
                case 'ArrowUp':
                    this.controlObject.velocity.add(new Vector(0, -1))
                    break;

                case 'ArrowDown':
                    this.controlObject.velocity.add(new Vector(0, 1))
                    break;

                case 'ArrowLeft':
                    this.controlObject.velocity.add(new Vector(-1, 0))
                    break;

                case 'ArrowRight':
                    this.controlObject.velocity.add(new Vector(1, 0))
                    break;
            }

        })

    }
}

export default GameManager;