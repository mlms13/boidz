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
    var ctx = render.ctx;

    if(null == waypoints.goalRule) return;

    ctx.beginPath();
    ctx.strokeStyle = "#CCCCCC";
    ctx.setLineDash([2, 5]);
    ctx.moveTo(waypoints.flock.cx, waypoints.flock.cy);
    ctx.lineTo(waypoints.goalRule.goalx, waypoints.goalRule.goaly);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#666666";
    ctx.setLineDash([]);
    ctx.arc(waypoints.goalRule.goalx, waypoints.goalRule.goaly, waypoints.radius, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(waypoints.goalRule.goalx, waypoints.goalRule.goaly);

    for(goal in waypoints.goals) {
      ctx.strokeStyle = "#AAAAAA";
      ctx.setLineDash([2, 5]);
      ctx.lineTo(goal[0], goal[1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#999999";
      ctx.setLineDash([]);
      ctx.arc(goal[0], goal[1], waypoints.radius, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.moveTo(goal[0], goal[1]);
    }
    ctx.stroke();
  }
}