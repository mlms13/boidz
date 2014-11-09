package boidz.render;

import openfl.display.Graphics;
import boidz.IRender;
import boidz.Flock;

class OpenFLGraphicsRender implements IRender {
  var g : Graphics;
  public function new(graphics : Graphics) {
    g = graphics;
  }
  public function render(flock : boidz.Flock) {
    g.clear();
    g.lineStyle(1, 0x0);

    for(b in flock.boids) {
      g.moveTo(b.px, b.py);
      g.lineTo(b.px - b.vx, b.py - b.vy);
    }

    // render centroid
    g.beginFill(0xCC3300);
    g.drawCircle(flock.cx, flock.cy, 4);
    g.endFill();
  }
}
