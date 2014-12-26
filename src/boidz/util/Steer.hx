package boidz.util;

using thx.core.Floats;
import thx.unit.angle.Degree;
import boidz.Point;

class Steer {
  public static function away(a : DirectedPoint, b : Point, ?max : Degree) {
    var px = a.x - b.x,
        py = a.y - b.y,
        d  = (Degree.pointToDegree(px, py) - a.d).normalizeDirection();
    if(null != max) {
      d = d.abs().min(max) * d.toFloat().sign();
    }
    return d;
  }

  public static function toward(a : DirectedPoint, b : Point, ?max : Degree) {
    var px = b.x - a.x,
        py = b.y - a.y,
        d  = (Degree.pointToDegree(px, py) - a.d).normalizeDirection();
    if(null != max) {
      d = d.abs().min(max) * d.toFloat().sign();
    }
    return d;
  }

  public static function converge(src : Float, dst : Float, max : Float) {
    var delta = dst - src;
    if(Math.abs(delta) > max)
      return delta.sign() * max;
    else
      return delta;
  }

  public static function facingRight(d : Degree) {
    d = d.normalize();
    return d > 270 || d < 90;
  }

  public static function facingLeft(d : Degree) {
    d = d.normalize();
    return d < 270 && d > 90;
  }

  public static function facingUp(d : Degree) {
    d = d.normalize();
    return d > 180;
  }

  public static function facingDown(d : Degree) {
    d = d.normalize();
    return d < 180;
  }
}