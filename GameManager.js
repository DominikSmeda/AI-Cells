/** @type {CanvasRenderingContext2D} */

import { Engine2D, Timer, Vector } from './PhysicsEngine2DLib/main.js';
import { Line } from './PhysicsEngine2DLib/main.js';

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
        // ctx.drawRect(0, 0, ctxWidth, ctxHeight, 'red')
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
        if (!this.controlObject) return;

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


        let lineIndex = -1;
        let controledPointIndex = true;
        let controledPoint = null;
        let controledLine = null;
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
                    controledPoint.add(new Vector(0, -5))
                    break;

                case 'ArrowDown':
                    controledPoint.add(new Vector(0, 5))
                    break;

                case 'ArrowLeft':
                    controledPoint.add(new Vector(-5, 0))
                    break;

                case 'ArrowRight':
                    controledPoint.add(new Vector(5, 0))
                    break;

                case 'l':
                    lineIndex++
                    if (controledLine) controledLine.unfocus()
                    let lines = this.objects.filter(el => el instanceof Line);
                    if (lineIndex > this.objects.length - 1) lineIndex = 0;
                    controledPoint = lines[lineIndex].startPoint;
                    controledLine = lines[lineIndex];

                    break;

                case 'k':
                    controledPointIndex = !controledPointIndex;
                    if (controledPointIndex) {
                        controledPoint = controledLine.startPoint;
                    }
                    else {
                        controledPoint = controledLine.endPoint;
                    }

                    break;

            }

            if (controledPoint) {
                controledLine.focus()
                controledLine.updateDirectionalVector();
                this.addHelper(() => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(controledPoint.x, controledPoint.y, 10, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.restore();
                })
            }

        })

    }
}

export default GameManager;