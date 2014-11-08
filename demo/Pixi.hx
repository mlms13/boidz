import boidz.Boid;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.*;

import pixi.primitives.Graphics;
import pixi.display.Stage;
import pixi.utils.Detector;
import js.Browser;

class Pixi {
  static var width  = 800;
  static var height = 600;

  public static function main() {
    var flock    = new Flock(),
        stage    = new Stage(0xBADA55),
        sprite   = new Graphics(),
        renderer = Detector.autoDetectRenderer(width, height, new RenderingOptions(1, true)),
        render   = new PixiJSRender(sprite);

    //stage.setInteractive(true);
    stage.addChild(sprite);

    Browser.document.body.appendChild(renderer.view);

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
      renderer.render(stage);
    });

    stage.click = stage.tap = function(data) {
      var p = data.getLocalPosition(sprite);
      goalRule.goalx = p.x;
      goalRule.goaly = p.y;
    };
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