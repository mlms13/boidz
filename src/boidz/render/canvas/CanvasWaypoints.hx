package boidz.render.canvas;

import boidz.rules.Waypoints;
import boidz.IRenderable;

class CanvasWaypoints implements IRenderable<CanvasRender> {
  var waypoints : Waypoints;
  public var enabled : Bool = true;
  public function new(waypoints : Waypoints) {
    this.waypoints = waypoints;
  }

  public function render(render : CanvasRender) {
    if(null == waypoints.goalRule) return;

    var ctx = render.ctx;
    ctx.lineWidth = 1;
    ctx.setLineDash([2]);

    ctx.beginPath();
    ctx.strokeStyle = "#999999";
    ctx.moveTo(waypoints.flock.x, waypoints.flock.y);
    ctx.lineTo(waypoints.goalRule.x, waypoints.goalRule.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.arc(waypoints.goalRule.x, waypoints.goalRule.y, waypoints.radius, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.0.5)";
    ctx.moveTo(waypoints.goalRule.x, waypoints.goalRule.y);

    for(goal in waypoints.goals) {
      ctx.strokeStyle = "#CCCCCC";
      ctx.lineTo(goal.x, goal.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "";
      ctx.arc(goal.x, goal.y, waypoints.radius, 0, 2 * Math.PI, false);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(goal.x, goal.y);
    }
  }
}