package boidz.render.canvas;

import boidz.Flock;
import boidz.IRenderable;

class CanvasFlock implements IRenderable<CanvasRender> {
  var flock : Flock;
  public var enabled : Bool = true;
  public var renderCentroid : Bool = true;
  public function new(flock : Flock) {
    this.flock = flock;
  }

  public function render(render : CanvasRender) {
    var ctx = render.ctx;
    // render centroid
    if(renderCentroid) {
      ctx.beginPath();
      ctx.fillStyle = "#cc3300";
      ctx.arc(flock.cx, flock.cy, 4, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    // boidz
    ctx.strokeStyle = "#000000";
    ctx.setLineDash([]);
    ctx.beginPath();
    for(b in flock.boids) {
      ctx.moveTo(b.px, b.py);
      ctx.lineTo(b.px - b.vx, b.py - b.vy);
    }
    // close
    ctx.stroke();
  }
}