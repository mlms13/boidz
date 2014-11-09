package boidz.render;

import boidz.IRender;
import boidz.Flock;
import js.html.CanvasRenderingContext2D;
import js.html.CanvasElement;

class TrailCanvasRender implements IRender {
  var canvas : CanvasElement;
  var ctx : CanvasRenderingContext2D;
  var colors : Map<Boid, String>;
  public function new(canvas : CanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext2d();

    colors = new Map();
  }

  function getColor(boid : Boid) {
    var color = colors.get(boid);
    if(null == color) {
      color = "#"+StringTools.lpad(thx.core.Ints.toString(Std.random(0xFFFFFF), 16), "0", 6);
      colors.set(boid, color);
    }
    return color;
  }

  public function render(flock : Flock) {
    // setup
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.075)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // boidz
    for(b in flock.boids) {
      ctx.beginPath();
      ctx.strokeStyle = getColor(b);
      ctx.moveTo(b.px, b.py);
      ctx.lineTo(b.px - b.vx, b.py - b.vy);
      ctx.stroke();
    }

    // render centroid
    ctx.beginPath();
    ctx.fillStyle = "#cc3300";
    ctx.arc(flock.cx, flock.cy, 4, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
