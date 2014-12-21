import boidz.Boid;
import boidz.Display;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.canvas.*;
using thx.core.Arrays;
using thx.core.Floats;

import js.Browser;
import thx.core.Timer;

class Canvas {
  static var width  = 800;
  static var height = 600;

  public static function main() {
    var flock  = new Flock(),
        canvas = getCanvas(),
        render = new CanvasRender(canvas),
        display = new Display(render),
        avoidCollisions = new AvoidCollisions(flock, 3, 25),
        respectBoundaries = new RespectBoundaries(0, width, 0, height, 50, 25),
        waypoints = new IndividualWaypoints(flock, 10),
        velocity = 3.0;

    //flock.addRule(new SteerTowardCenter(flock));
    flock.addRule(waypoints);
    flock.addRule(avoidCollisions);
    flock.addRule(respectBoundaries);
    addBoids(flock, 1000, velocity, respectBoundaries.offset);

    var canvasBoundaries = new CanvasBoundaries(respectBoundaries),
        canvasWaypoints = new CanvasIndividualWaypoints(waypoints),
        canvasFlock = new CanvasFlock(flock);

    display.addRenderable(canvasBoundaries);
    display.addRenderable(canvasWaypoints);
    display.addRenderable(canvasFlock);

    var benchmarks = [],
        frames = [],
        renderings = [],
        residue = 0.0,
        step    = flock.step * 1000,
        execution = null,
        rendering = null,
        frameRate = null,
        start = Timer.time();
    thx.core.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {

        var time = Timer.time();
        flock.update();
        benchmarks.splice(1, 10);
        benchmarks.push(Timer.time() - time);

        delta -= step;
      }
      residue = delta;
      var before = Timer.time();
      display.render();
      renderings.splice(1, 10);
      renderings.push(Timer.time() - before);

      var n = Timer.time();
      frames.splice(1, 10);
      frames.push(n - start);
      start = n;
    });

    thx.core.Timer.repeat(function() {
      var average = benchmarks.average().round(2),
          min     = benchmarks.min().round(2),
          max     = benchmarks.max().round(2);
      execution.set('$average ($min -> $max)');

      average = renderings.average().round(1);
      min     = renderings.min().round(1);
      max     = renderings.max().round(1);
      rendering.set('$average ($min -> $max)');

      average = (1000 / frames.average()).round(1);
      min     = (1000 / frames.min()).round(1);
      max     = (1000 / frames.max()).round(1);
      frameRate.set('$average/s ($min -> $max)');
    }, 2000);
    canvas.addEventListener("click", function(e) {
      waypoints.addGoal(e.clientX, e.clientY);
    }, false);

    // UI
    var sui = new sui.Sui();
    var ui = sui.folder("flock");
    ui.int("boids",
      flock.boids.length, { min : 0, max : 3000 },
      function(v){
        if(v > flock.boids.length)
          addBoids(flock, v - flock.boids.length, velocity, respectBoundaries.offset);
        else
          flock.boids.splice(v, flock.boids.length - v);
      });
    var randomVelocity = false;

    function updateVelocity() {
      for(boid in flock.boids)
        boid.v = velocity * (randomVelocity ? Math.random() : 1);
    }

    ui.float("velocity",
      velocity, { min : 0, max : 20 },
      function(v){
        velocity = v;
        updateVelocity();
      });
    ui.bool("random velocity",
      randomVelocity,
      function(v) {
        randomVelocity = v;
        updateVelocity();
      });
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasFlock.renderCentroid);
    ui.bind(canvasFlock.renderTrail);
    ui.bind(canvasFlock.trailLength, { min : 1, max : 400 });

    ui = sui.folder("collisions");
    ui.bind(avoidCollisions.enabled);
    ui.bind(avoidCollisions.radius, { min : 0, max : 100 });
    ui.bind(avoidCollisions.maxSteer, { min : 1, max : 90 });

    ui = sui.folder("boundaries");
    ui.bind(respectBoundaries.enabled);
    ui.bind(respectBoundaries.offset, { min : 0, max : Math.min(width, height) / 2.1 });
    ui.bind(respectBoundaries.maxSteer, { min : 1, max : 90 });
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasBoundaries.enabled);

    ui = sui.folder("waypoints");
    ui.bind(waypoints.enabled);
    ui.bind(waypoints.radius, { min : 1, max : 100 });
    ui.bind(waypoints.maxSteer, { min : 1, max : 90 });
    ui = ui.folder("render", { collapsible : false });
    ui.bind(canvasWaypoints.enabled);

    execution = sui.label("...", "execution time");
    rendering = sui.label("...", "rendering time");
    frameRate = sui.label("...", "frame rate");
    sui.attach();
  }

  static function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  static function addBoids(flock : Flock, howMany : Int, velocity : Float, offset : Float) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var b = new Boid(
            offset + (width - offset * 2) * Math.random(),
            offset + (height - offset * 2) * Math.random(),
            velocity,
            Math.random() * 360);
      flock.boids.push(b);
    }
  }
}