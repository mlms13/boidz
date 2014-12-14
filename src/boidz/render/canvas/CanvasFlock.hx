package boidz.render.canvas;

import boidz.Flock;
import boidz.IRenderable;
import boidz.Point;
import thx.core.Ints;

class CanvasFlock implements IRenderable<CanvasRender> {
  var flock : Flock;
  public var enabled : Bool = true;
  public var renderCentroid : Bool = true;
  public var renderTrail : Bool = true;
  public var trailLength : Int = 20;

  var map : Map<Boid, Array<Point>>;
  public function new(flock : Flock) {
    this.flock = flock;
    this.map = new Map();
  }

  function getTrail(b : Boid) {
    var c = map.get(b);
    if(c == null) {
      c = [];
      map.set(b, c);
    }
    if(c.length < trailLength) {
      c.push({ x : b.x, y : b.y });
    } else {
      var p = c.pop();
      p.x = b.x;
      p.y = b.y;
      c.unshift(p);
    }
    return c;
  }

  public function render(render : CanvasRender) {
    var ctx = render.ctx;
    ctx.setLineDash([]);

    // boidz trail
    if(renderTrail) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,150,0.075)";
      var c;
      for(b in flock.boids) {
        c = getTrail(b);
        if(c.length < 2) continue;
        ctx.moveTo(c[0].x, c[0].y);
        for(i in 1...Ints.min(c.length, trailLength)) {
          ctx.lineTo(c[i].x, c[i].y);
        }
      }
      ctx.stroke();
    }

    // boidz
    for(b in flock.boids) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
      ctx.arc(b.x, b.y, 1, 0, 2 * Math.PI, false);
    ctx.fill();
    }

    // render centroid
    if(renderCentroid) {
      ctx.beginPath();
      ctx.fillStyle = "#cc3300";
      ctx.arc(flock.x, flock.y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }
}