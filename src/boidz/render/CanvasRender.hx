package boidz.render;

import boidz.IRender;
import boidz.Flock;
import js.html.CanvasRenderingContext2D;
import js.html.CanvasElement;

class CanvasRender implements IRender {
  var canvas : CanvasElement;
  var ctx : CanvasRenderingContext2D;
  var tx : Float;
  var ty : Float;
  public function new(canvas : CanvasElement, tx = 1.0, ty = 1.0) {
    this.canvas = canvas;
    this.ctx = canvas.getContext2d();
    this.tx = tx;
    this.ty = ty;
  }

  public function render(flock : Flock) {
    // setup
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    // boidz
    for(b in flock.boids) {
      ctx.moveTo(b.px * tx, b.py * ty);
      ctx.lineTo((b.px - b.vx) * tx, (b.py - b.vy) * ty);
    }
    // close
    ctx.stroke();
  }
}
