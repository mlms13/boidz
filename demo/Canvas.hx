import boidz.Boid;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.*;

import js.Browser;

class Canvas {
  static var width  = 800;
  static var height = 600;

  public static function main() {
    var flock  = new Flock(),
        canvas = getCanvas(),
        render = new CanvasRender(canvas);

    var goalRule = new MoveTowardGoal(width * Math.random(), height * Math.random());

    // this rule doesn't make much sense when used together with MoveTowardGoal, right?
    //flock.addRule(new MoveTowardCenter(flock));
    flock.addRule(new AvoidCollisions(flock));
    flock.addRule(new MatchGroupVelocity(flock));
    flock.addRule(new RespectBoundaries(10, width - 10, 10, height - 10));
    flock.addRule(goalRule);
    flock.addRule(new LimitSpeed());

    addBoids(flock, 1000);

    var residue = 0.0,
        step    = flock.step * 1000;
    thx.core.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {
        flock.update();
        delta -= step;
      }
      residue = delta;
      render.render(flock);
    });

    canvas.addEventListener("click", function(e) {
      goalRule.goalx = e.clientX;
      goalRule.goaly = e.clientY;
    }, false);
  }

  static function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  static function addBoids(flock : Flock, howMany : Int) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var a = Math.random() * 2 * Math.PI,
          d = w * Math.random(),
          b = new Boid(width / 2 + Math.cos(a) * d, height / 2 + Math.sin(a) * d);
      flock.boids.push(b);
    }
  }
}