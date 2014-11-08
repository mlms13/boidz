package boidz.render;

import boidz.IRender;
import boidz.Flock;
import js.html.CanvasRenderingContext2D;
import js.html.CanvasElement;

class CanvasRender implements IRender {
  var canvas : CanvasElement;
  var ctx : CanvasRenderingContext2D;
  var dx : Float;
  var dy : Float;
  // DX and DY are wrong, it should be a Matrix
  public function new(canvas : CanvasElement, dx = 1.0, dy = 1.0) {
    this.canvas = canvas;
    this.ctx = canvas.getContext2d();
    this.dx = dx;
    this.dy = dy;
  }

  public function render(flock : Flock) {
    // setup
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    // boidz
    for(b in flock.boids) {
      ctx.moveTo(b.px * dx, b.py * dy);
      ctx.lineTo((b.px - b.vx) * dx, (b.py - b.vy) * dy);
    }
    // close
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#cc3300";
    ctx.arc(flock.cx, flock.cy, 4, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
