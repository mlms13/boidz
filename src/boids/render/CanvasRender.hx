package boids.render;

import boids.rules.BaseRule;
import js.html.CanvasRenderingContext2D;
import js.html.CanvasElement;

class CanvasRender extends BaseRule {
    var canvas : CanvasElement;
    var ctx : CanvasRenderingContext2D;
    public function new(canvas : CanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext2d();
    }
    override public function pre() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }

    override public function post() {
        ctx.stroke();
    }

    override public function modify(b:Boid):Void {
        ctx.moveTo(b.px, b.py);
        ctx.lineTo(b.px - b.vx, b.py - b.vy);
    }
}
