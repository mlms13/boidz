package boidz.render;

import boidz.IRender;
import boidz.Flock;
import pixi.primitives.Graphics;

class PixiJSRender implements IRender {
  var ctx : Graphics;
  var dx : Float;
  var dy : Float;
  // DX and DY are wrong, it should be a Matrix
  public function new(ctx : Graphics, dx = 1.0, dy = 1.0) {
    this.ctx = ctx;
    this.dx = dx;
    this.dy = dy;
  }

  public function render(flock : Flock) {
    // setup
    ctx.clear();
    // boidz
    ctx.lineStyle(1.0, 0x000000, 1);
    for(b in flock.boids) {
      ctx.moveTo(b.px * dx, b.py * dy);
      ctx.lineTo((b.px - b.vx) * dx, (b.py - b.vy) * dy);
    };
  }
}
