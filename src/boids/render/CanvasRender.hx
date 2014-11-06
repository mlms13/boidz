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

// OR
//    ctx.fillStyle = "rgba(255,255,255,1)";
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
//    ctx.fillStyle = "#000";
  }

  override public function post() {
    ctx.stroke();

// OR
//    ctx.fill();
  }

  override public function modify(b:Boid):Void {
    ctx.moveTo(b.px, b.py);
    ctx.lineTo(b.px - b.vx, b.py - b.vy);

// OR
//    ctx.fillRect(b.px, b.py, 1, 1);
  }
}
