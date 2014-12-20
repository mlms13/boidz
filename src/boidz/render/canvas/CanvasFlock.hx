package boidz.render.canvas;

import boidz.Flock;
import boidz.IRenderable;
import boidz.Point;
import thx.core.Ints;
import thx.color.RGB;

class CanvasFlock implements IRenderable<CanvasRender> {
  var flock : Flock;
  public var enabled : Bool = true;
  public var renderCentroid : Bool = true;
  public var renderTrail : Bool = true;
  public var trailLength : Int = 20;
  var rgb : String;
  var rgba : String;

  var map : Map<Boid, Array<Point>>;
  public function new(flock : Flock, ?boidColor : RGB) {
    if(null == boidColor)
      boidColor = "#000000";
    this.flock = flock;
    this.map = new Map();

    rgb = boidColor.toString();
    rgba = boidColor.withAlpha(25).toString();
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
      ctx.strokeStyle = rgba;
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
    ctx.fillStyle = rgb;
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