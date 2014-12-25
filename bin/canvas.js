(function () { "use strict";
var console = (1,eval)('this').console || {log:function(){}};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Canvas = function() { };
Canvas.__name__ = ["Canvas"];
Canvas.main = function() {
	var flock = new boidz.Flock();
	var canvas = Canvas.getCanvas();
	var render = new boidz.render.canvas.CanvasRender(canvas);
	var display = new boidz.Display(render);
	var avoidCollisions = new boidz.rules.AvoidCollisions(flock,3,thx.unit.angle._Degree.Degree_Impl_._new(25));
	var respectBoundaries = new boidz.rules.RespectBoundaries(0,Canvas.width,0,Canvas.height,50,thx.unit.angle._Degree.Degree_Impl_._new(25));
	var waypoints = new boidz.rules.IndividualWaypoints(flock,10);
	var velocity = 3.0;
	flock.addRule(waypoints);
	flock.addRule(avoidCollisions);
	flock.addRule(respectBoundaries);
	Canvas.addBoids(flock,1000,velocity,respectBoundaries.offset);
	var canvasBoundaries = new boidz.render.canvas.CanvasBoundaries(respectBoundaries);
	var canvasWaypoints = new boidz.render.canvas.CanvasIndividualWaypoints(waypoints);
	var canvasFlock = new boidz.render.canvas.CanvasFlock(flock);
	display.addRenderable(canvasBoundaries);
	display.addRenderable(canvasWaypoints);
	display.addRenderable(canvasFlock);
	var benchmarks = [];
	var frames = [];
	var renderings = [];
	var residue = 0.0;
	var step = flock.step * 1000;
	var execution = null;
	var rendering = null;
	var frameRate = null;
	var start = performance.now();
	thx.core.Timer.frame(function(delta) {
		delta += residue;
		while(delta - step >= 0) {
			var time = performance.now();
			flock.update();
			benchmarks.splice(1,10);
			benchmarks.push(performance.now() - time);
			delta -= step;
		}
		residue = delta;
		var before = performance.now();
		display.render();
		renderings.splice(1,10);
		renderings.push(performance.now() - before);
		var n = performance.now();
		frames.splice(1,10);
		frames.push(n - start);
		start = n;
	});
	thx.core.Timer.repeat(function() {
		var average = thx.core.Floats.roundTo(thx.core.ArrayFloats.average(benchmarks),2);
		var min = thx.core.Floats.roundTo(thx.core.ArrayFloats.min(benchmarks),2);
		var max = thx.core.Floats.roundTo(thx.core.ArrayFloats.max(benchmarks),2);
		execution.set("" + average + " (" + min + " -> " + max + ")");
		average = thx.core.Floats.roundTo(thx.core.ArrayFloats.average(renderings),1);
		min = thx.core.Floats.roundTo(thx.core.ArrayFloats.min(renderings),1);
		max = thx.core.Floats.roundTo(thx.core.ArrayFloats.max(renderings),1);
		rendering.set("" + average + " (" + min + " -> " + max + ")");
		average = thx.core.Floats.roundTo(1000 / thx.core.ArrayFloats.average(frames),1);
		min = thx.core.Floats.roundTo(1000 / thx.core.ArrayFloats.min(frames),1);
		max = thx.core.Floats.roundTo(1000 / thx.core.ArrayFloats.max(frames),1);
		frameRate.set("" + average + "/s (" + min + " -> " + max + ")");
	},2000);
	canvas.addEventListener("click",function(e) {
		waypoints.addGoal(e.clientX,e.clientY);
	},false);
	var sui1 = new sui.Sui();
	var ui = sui1.folder("flock");
	ui["int"]("boids",flock.boids.length,{ min : 0, max : 3000},function(v) {
		if(v > flock.boids.length) Canvas.addBoids(flock,v - flock.boids.length,velocity,respectBoundaries.offset); else flock.boids.splice(v,flock.boids.length - v);
	});
	var randomVelocity = false;
	var updateVelocity = function() {
		var _g = 0;
		var _g1 = flock.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			boid.v = velocity * (randomVelocity?Math.random():1);
		}
	};
	ui["float"]("velocity",velocity,{ min : 0, max : 20},function(v1) {
		velocity = v1;
		updateVelocity();
	});
	ui.bool("random velocity",randomVelocity,null,function(v2) {
		randomVelocity = v2;
		updateVelocity();
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("render centroid",canvasFlock.renderCentroid,null,function(v3) {
		canvasFlock.renderCentroid = v3;
	});
	ui.bool("render trail",canvasFlock.renderTrail,null,function(v4) {
		canvasFlock.renderTrail = v4;
	});
	ui["int"]("trail length",canvasFlock.trailLength,{ min : 1, max : 400},function(v5) {
		canvasFlock.trailLength = v5;
	});
	ui = sui1.folder("collisions");
	ui.bool("enabled",avoidCollisions.enabled,null,function(v6) {
		avoidCollisions.enabled = v6;
	});
	ui.bool("proportional",avoidCollisions.proportional,null,function(v7) {
		avoidCollisions.proportional = v7;
	});
	ui["float"]("radius",avoidCollisions.get_radius(),{ min : 0, max : 100},function(v8) {
		avoidCollisions.set_radius(v8);
	});
	ui["float"]("max steer",avoidCollisions.maxSteer,{ min : 1, max : 90},function(v9) {
		avoidCollisions.maxSteer = v9;
	});
	ui = sui1.folder("boundaries");
	ui.bool("enabled",respectBoundaries.enabled,null,function(v10) {
		respectBoundaries.enabled = v10;
	});
	ui["float"]("offset",respectBoundaries.offset,{ min : 0, max : Math.min(Canvas.width,Canvas.height) / 2.1},function(v11) {
		respectBoundaries.offset = v11;
	});
	ui["float"]("max steer",respectBoundaries.maxSteer,{ min : 1, max : 90},function(v12) {
		respectBoundaries.maxSteer = v12;
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("enabled",canvasBoundaries.enabled,null,function(v13) {
		canvasBoundaries.enabled = v13;
	});
	ui = sui1.folder("waypoints");
	ui.bool("enabled",waypoints.enabled,null,function(v14) {
		waypoints.enabled = v14;
	});
	ui["float"]("radius",waypoints.radius,{ min : 1, max : 100},function(v15) {
		waypoints.radius = v15;
	});
	ui["float"]("max steer",waypoints.get_maxSteer(),{ min : 1, max : 90},function(v16) {
		waypoints.set_maxSteer(v16);
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("enabled",canvasWaypoints.enabled,null,function(v17) {
		canvasWaypoints.enabled = v17;
	});
	execution = sui1.label("...","execution time");
	rendering = sui1.label("...","rendering time");
	frameRate = sui1.label("...","frame rate");
	sui1.attach();
};
Canvas.getCanvas = function() {
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	canvas.width = Canvas.width;
	canvas.height = Canvas.height;
	window.document.body.appendChild(canvas);
	return canvas;
};
Canvas.addBoids = function(flock,howMany,velocity,offset) {
	var w = Math.min(Canvas.width,Canvas.height);
	var _g = 0;
	while(_g < howMany) {
		var i = _g++;
		var b = new boidz.Boid(offset + (Canvas.width - offset * 2) * Math.random(),offset + (Canvas.height - offset * 2) * Math.random(),velocity,(function($this) {
			var $r;
			var value = Math.random() * 360;
			$r = thx.unit.angle._Degree.Degree_Impl_._new(value);
			return $r;
		}(this)));
		flock.boids.push(b);
	}
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return js.Boot.getClass(o);
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js.Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var boidz = {};
boidz.Boid = function(x,y,v,d) {
	if(v == null) v = 0.0;
	if(null == d) d = thx.unit.angle._Degree.Degree_Impl_._new(0.0);
	this.x = x;
	this.y = y;
	this.v = v;
	this.d = d;
};
boidz.Boid.__name__ = ["boidz","Boid"];
boidz.Boid.prototype = {
	x: null
	,y: null
	,v: null
	,d: null
	,__class__: boidz.Boid
};
boidz.Display = function(render) {
	this.renderEngine = render;
	this.renderables = new haxe.ds.ObjectMap();
};
boidz.Display.__name__ = ["boidz","Display"];
boidz.Display.prototype = {
	renderables: null
	,renderEngine: null
	,addRenderable: function(renderable) {
		this.renderables.set(renderable,true);
	}
	,removeRenderable: function(renderable) {
		this.renderables.remove(renderable);
	}
	,render: function() {
		this.renderEngine.clear();
		var $it0 = this.renderables.keys();
		while( $it0.hasNext() ) {
			var renderable = $it0.next();
			if(renderable.enabled) {
				this.renderEngine.beforeEach();
				renderable.render(this.renderEngine);
				this.renderEngine.afterEach();
			}
		}
	}
	,__class__: boidz.Display
};
boidz.Flock = function() {
	this.step = 0.05;
	this.x = this.y = 0;
	this.v = 0;
	this.d = thx.unit.angle._Degree.Degree_Impl_._new(0);
	this.boids = [];
	this.rules = [];
};
boidz.Flock.__name__ = ["boidz","Flock"];
boidz.Flock.prototype = {
	boids: null
	,rules: null
	,x: null
	,y: null
	,v: null
	,d: null
	,step: null
	,addRule: function(rule) {
		this.rules.push(rule);
	}
	,update: function() {
		this.setFlockAverages();
		var _g = 0;
		var _g1 = this.rules;
		while(_g < _g1.length) {
			var rule = _g1[_g];
			++_g;
			if(!rule.enabled) continue;
			if(!rule.before()) continue;
			var _g2 = 0;
			var _g3 = this.boids;
			while(_g2 < _g3.length) {
				var boid = _g3[_g2];
				++_g2;
				rule.modify(boid);
			}
		}
		var _g4 = 0;
		var _g11 = this.boids;
		while(_g4 < _g11.length) {
			var boid1 = _g11[_g4];
			++_g4;
			boid1.x += boid1.v * (function($this) {
				var $r;
				var this1 = thx.unit.angle._Radian.Radian_Impl_._new(boid1.d * 0.0174532925199433);
				$r = Math.cos(this1);
				return $r;
			}(this));
			boid1.y += boid1.v * (function($this) {
				var $r;
				var this2 = thx.unit.angle._Radian.Radian_Impl_._new(boid1.d * 0.0174532925199433);
				$r = Math.sin(this2);
				return $r;
			}(this));
		}
	}
	,setFlockAverages: function() {
		this.x = this.y = 0;
		this.v = 0;
		this.d = thx.unit.angle._Degree.Degree_Impl_._new(0);
		var _g = 0;
		var _g1 = this.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			this.x += boid.x;
			this.y += boid.y;
			this.v += boid.v;
			this.d = thx.unit.angle._Degree.Degree_Impl_._new(this.d + boid.d);
		}
		var l = this.boids.length;
		this.x = this.x / l;
		this.y = this.y / l;
		this.v = this.v / l;
		this.d = thx.unit.angle._Degree.Degree_Impl_._new(this.d / l);
	}
	,__class__: boidz.Flock
};
boidz.IFlockRule = function() { };
boidz.IFlockRule.__name__ = ["boidz","IFlockRule"];
boidz.IFlockRule.prototype = {
	enabled: null
	,before: null
	,modify: null
	,__class__: boidz.IFlockRule
};
boidz.IRender = function() { };
boidz.IRender.__name__ = ["boidz","IRender"];
boidz.IRender.prototype = {
	clear: null
	,beforeEach: null
	,afterEach: null
	,__class__: boidz.IRender
};
boidz.IRenderable = function() { };
boidz.IRenderable.__name__ = ["boidz","IRenderable"];
boidz.IRenderable.prototype = {
	enabled: null
	,render: null
	,__class__: boidz.IRenderable
};
boidz.render = {};
boidz.render.canvas = {};
boidz.render.canvas.CanvasBoundaries = function(boundaries) {
	this.color = "#BBBBBB";
	this.enabled = true;
	this.boundaries = boundaries;
};
boidz.render.canvas.CanvasBoundaries.__name__ = ["boidz","render","canvas","CanvasBoundaries"];
boidz.render.canvas.CanvasBoundaries.__interfaces__ = [boidz.IRenderable];
boidz.render.canvas.CanvasBoundaries.prototype = {
	boundaries: null
	,enabled: null
	,color: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.setLineDash([2,2]);
		ctx.moveTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.stroke();
	}
	,__class__: boidz.render.canvas.CanvasBoundaries
};
boidz.render.canvas.CanvasFlock = function(flock,boidColor) {
	this.pos = 0;
	this.trailLength = 20;
	this.renderTrail = true;
	this.renderCentroid = true;
	this.enabled = true;
	if(null == boidColor) boidColor = thx.color._RGB.RGB_Impl_.fromString("#000000");
	this.flock = flock;
	this.map = new haxe.ds.ObjectMap();
	this.rgb = thx.color._RGB.RGB_Impl_.toHex(boidColor);
	var this1 = thx.color._RGBA.RGBA_Impl_.toRGBXA(335544320 | (boidColor >> 16 & 255 & 255) << 16 | (boidColor >> 8 & 255 & 255) << 8 | boidColor & 255 & 255);
	this.rgba = "rgba(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
boidz.render.canvas.CanvasFlock.__name__ = ["boidz","render","canvas","CanvasFlock"];
boidz.render.canvas.CanvasFlock.__interfaces__ = [boidz.IRenderable];
boidz.render.canvas.CanvasFlock.prototype = {
	flock: null
	,enabled: null
	,renderCentroid: null
	,renderTrail: null
	,trailLength: null
	,rgb: null
	,rgba: null
	,map: null
	,getTrail: function(b) {
		var c = this.map.h[b.__id__];
		if(c == null) {
			var _g = [];
			var _g2 = 0;
			var _g1 = this.trailLength;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push({ x : b.x, y : b.y});
			}
			c = _g;
			this.map.set(b,c);
		}
		while(c.length < this.trailLength) c.push({ x : b.x, y : b.y});
		if(c.length > this.trailLength) c.splice(this.trailLength,c.length - this.trailLength);
		c[this.pos].x = b.x;
		c[this.pos].y = b.y;
		return c;
	}
	,pos: null
	,render: function(render) {
		var ctx = render.ctx;
		if(this.renderTrail) {
			this.pos++;
			if(this.pos >= this.trailLength) this.pos = 0;
			ctx.beginPath();
			ctx.strokeStyle = this.rgba;
			var c;
			var s = this.pos + 1;
			if(s == this.trailLength) s = 0;
			var _g = 0;
			var _g1 = this.flock.boids;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				c = this.getTrail(b);
				if(c.length < 2) continue;
				ctx.moveTo(c[s].x,c[s].y);
				var _g3 = s;
				var _g2 = this.trailLength;
				while(_g3 < _g2) {
					var i = _g3++;
					ctx.lineTo(c[i].x,c[i].y);
				}
				if(s != 0) {
					var _g31 = 0;
					var _g21 = this.pos;
					while(_g31 < _g21) {
						var i1 = _g31++;
						ctx.lineTo(c[i1].x,c[i1].y);
					}
				}
			}
			ctx.stroke();
		}
		var _g4 = 0;
		var _g11 = this.flock.boids;
		while(_g4 < _g11.length) {
			var b1 = _g11[_g4];
			++_g4;
			ctx.beginPath();
			ctx.fillStyle = this.rgb;
			ctx.arc(b1.x,b1.y,1,0,2 * Math.PI,false);
			ctx.fill();
		}
		if(this.renderCentroid) {
			ctx.beginPath();
			ctx.fillStyle = "#cc3300";
			ctx.arc(this.flock.x,this.flock.y,4,0,2 * Math.PI,false);
			ctx.fill();
		}
	}
	,__class__: boidz.render.canvas.CanvasFlock
};
boidz.render.canvas.CanvasIndividualWaypoints = function(waypoints) {
	this.enabled = true;
	this.waypoints = waypoints;
};
boidz.render.canvas.CanvasIndividualWaypoints.__name__ = ["boidz","render","canvas","CanvasIndividualWaypoints"];
boidz.render.canvas.CanvasIndividualWaypoints.__interfaces__ = [boidz.IRenderable];
boidz.render.canvas.CanvasIndividualWaypoints.prototype = {
	waypoints: null
	,enabled: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.lineWidth = 1;
		ctx.setLineDash([2]);
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		var _g1 = this.waypoints.current;
		var _g = this.waypoints.goals.length;
		while(_g1 < _g) {
			var i = _g1++;
			var goal = this.waypoints.goals[i];
			ctx.strokeStyle = "#CCCCCC";
			if(i > this.waypoints.current) {
				ctx.lineTo(goal.x,goal.y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.strokeStyle = "";
			ctx.arc(goal.x,goal.y,this.waypoints.radius,0,2 * Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(goal.x,goal.y);
		}
	}
	,__class__: boidz.render.canvas.CanvasIndividualWaypoints
};
boidz.render.canvas.CanvasRender = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.ctx.save();
};
boidz.render.canvas.CanvasRender.__name__ = ["boidz","render","canvas","CanvasRender"];
boidz.render.canvas.CanvasRender.__interfaces__ = [boidz.IRender];
boidz.render.canvas.CanvasRender.prototype = {
	canvas: null
	,ctx: null
	,clear: function() {
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
	,beforeEach: function() {
		this.ctx.save();
	}
	,afterEach: function() {
		this.ctx.restore();
	}
	,__class__: boidz.render.canvas.CanvasRender
};
boidz.rules = {};
boidz.rules.AvoidCollisions = function(flock,radius,maxSteer) {
	if(radius == null) radius = 5;
	this.proportional = false;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx.unit.angle._Degree.Degree_Impl_._new(10.0);
	this.flock = flock;
	this.set_radius(radius);
	this.maxSteer = maxSteer;
	this.a = { x : 0.0, y : 0.0};
};
boidz.rules.AvoidCollisions.__name__ = ["boidz","rules","AvoidCollisions"];
boidz.rules.AvoidCollisions.__interfaces__ = [boidz.IFlockRule];
boidz.rules.AvoidCollisions.prototype = {
	radius: null
	,flock: null
	,enabled: null
	,proportional: null
	,maxSteer: null
	,squareRadius: null
	,a: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var dx = 0.0;
		var dy = 0.0;
		var count = 0;
		this.a.x = this.a.y = 0.0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n == b) continue;
			dx = b.x - n.x;
			dy = b.y - n.y;
			if(dx * dx + dy * dy > this.squareRadius) continue;
			this.a.x += n.x;
			this.a.y += n.y;
			count++;
		}
		if(count == 0) return;
		this.a.x /= count;
		this.a.y /= count;
		if(this.proportional) {
			var dist = Math.sqrt((this.a.x - b.x) * (this.a.x - b.x) + (this.a.y - b.y) * (this.a.y - b.y));
			var other;
			var this1;
			var this11 = boidz.util.Steer.away(b,this.a,thx.unit.angle._Degree.Degree_Impl_._new(this.maxSteer));
			var other2 = this.get_radius() - dist;
			this1 = thx.unit.angle._Degree.Degree_Impl_._new(this11 * other2);
			var other1 = this.get_radius();
			other = thx.unit.angle._Degree.Degree_Impl_._new(this1 / other1);
			b.d = thx.unit.angle._Degree.Degree_Impl_._new(b.d + other);
		} else {
			var other3 = boidz.util.Steer.away(b,this.a,thx.unit.angle._Degree.Degree_Impl_._new(this.maxSteer));
			b.d = thx.unit.angle._Degree.Degree_Impl_._new(b.d + other3);
		}
	}
	,get_radius: function() {
		return this.radius;
	}
	,set_radius: function(r) {
		this.radius = r;
		this.squareRadius = r * r;
		return r;
	}
	,__class__: boidz.rules.AvoidCollisions
};
boidz.rules.IndividualWaypoints = function(flock,radius,maxSteer) {
	if(radius == null) radius = 10;
	this.current = 0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx.unit.angle._Degree.Degree_Impl_._new(15.0);
	this.flock = flock;
	this.radius = radius;
	this.goals = [];
	this.onStep = function(coords) {
	};
	this.onBoidStep = function(b,coords1) {
	};
	this.set_maxSteer(maxSteer);
	this.goalRule = new boidz.rules.SteerTowardGoal(0,0,maxSteer);
	this.map = new haxe.ds.ObjectMap();
};
boidz.rules.IndividualWaypoints.__name__ = ["boidz","rules","IndividualWaypoints"];
boidz.rules.IndividualWaypoints.__interfaces__ = [boidz.IFlockRule];
boidz.rules.IndividualWaypoints.prototype = {
	goals: null
	,enabled: null
	,radius: null
	,onStep: null
	,onBoidStep: null
	,flock: null
	,maxSteer: null
	,goalRule: null
	,map: null
	,current: null
	,addGoal: function(x,y) {
		this.goals.push({ x : x, y : y});
	}
	,before: function() {
		if(this.goals.length == 0) return false;
		var counter = 0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			var pos = this.map.h[boid.__id__];
			if(null == pos) {
				pos = this.current;
				this.map.set(boid,pos);
				counter++;
			} else if(pos == this.current) counter++;
			var p = this.goals[pos];
			if(null == p) continue;
			var dx = p.x - boid.x;
			var dy = p.y - boid.y;
			if(dx * dx + dy * dy <= this.radius * this.radius) {
				this.onBoidStep(boid,p);
				if(pos == this.current) counter--;
				pos += 1;
				this.map.set(boid,pos);
			}
		}
		if(counter == 0) this.current++;
		return this.goals.length > 0;
	}
	,modify: function(b) {
		var pos = this.map.h[b.__id__];
		if(pos < this.goals.length) {
			var p = this.goals[pos];
			this.goalRule.x = p.x;
			this.goalRule.y = p.y;
			this.goalRule.modify(b);
		}
	}
	,updateGoalRuleForBoid: function(b) {
		this.goalRule.x = 100;
		this.goalRule.y = 200;
	}
	,get_maxSteer: function() {
		return this.maxSteer;
	}
	,set_maxSteer: function(v) {
		if(null != this.goalRule) this.goalRule.maxSteer = v;
		return this.maxSteer = v;
	}
	,__class__: boidz.rules.IndividualWaypoints
};
boidz.rules.RespectBoundaries = function(minx,maxx,miny,maxy,offset,maxSteer) {
	if(offset == null) offset = 0.0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx.unit.angle._Degree.Degree_Impl_._new(10);
	this.minx = minx;
	this.maxx = maxx;
	this.miny = miny;
	this.maxy = maxy;
	this.offset = offset;
	this.maxSteer = maxSteer;
};
boidz.rules.RespectBoundaries.__name__ = ["boidz","rules","RespectBoundaries"];
boidz.rules.RespectBoundaries.__interfaces__ = [boidz.IFlockRule];
boidz.rules.RespectBoundaries.prototype = {
	minx: null
	,maxx: null
	,miny: null
	,maxy: null
	,offset: null
	,enabled: null
	,maxSteer: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		if(b.x < this.minx + this.offset && boidz.util.Steer.facingLeft(b.d) || b.x > this.maxx - this.offset && boidz.util.Steer.facingRight(b.d)) {
			var other = thx.unit.angle._Degree.Degree_Impl_._new(this.maxSteer * (b.d < 0?-1:1));
			b.d = thx.unit.angle._Degree.Degree_Impl_._new(b.d + other);
		}
		if(b.y < this.miny + this.offset && boidz.util.Steer.facingUp(b.d) || b.y > this.maxy - this.offset && boidz.util.Steer.facingDown(b.d)) {
			var other1 = thx.unit.angle._Degree.Degree_Impl_._new(this.maxSteer * (b.d < 0?-1:1));
			b.d = thx.unit.angle._Degree.Degree_Impl_._new(b.d + other1);
		}
	}
	,__class__: boidz.rules.RespectBoundaries
};
boidz.rules.SteerTowardGoal = function(x,y,maxSteer) {
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx.unit.angle._Degree.Degree_Impl_._new(5.0);
	this.x = x;
	this.y = y;
	this.maxSteer = maxSteer;
};
boidz.rules.SteerTowardGoal.__name__ = ["boidz","rules","SteerTowardGoal"];
boidz.rules.SteerTowardGoal.__interfaces__ = [boidz.IFlockRule];
boidz.rules.SteerTowardGoal.prototype = {
	x: null
	,y: null
	,maxSteer: null
	,enabled: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var other = boidz.util.Steer.toward(b,this,thx.unit.angle._Degree.Degree_Impl_._new(this.maxSteer));
		b.d = thx.unit.angle._Degree.Degree_Impl_._new(b.d + other);
	}
	,__class__: boidz.rules.SteerTowardGoal
};
boidz.util = {};
boidz.util.Steer = function() { };
boidz.util.Steer.__name__ = ["boidz","util","Steer"];
boidz.util.Steer.away = function(a,b,max) {
	var px = a.x - b.x;
	var py = a.y - b.y;
	var d = thx.unit.angle._Degree.Degree_Impl_.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			var value = Math.atan2(py,px);
			this2 = thx.unit.angle._Radian.Radian_Impl_._new(value);
			this1 = thx.unit.angle._Degree.Degree_Impl_._new(this2 * 57.2957795130823);
		}
		$r = thx.unit.angle._Degree.Degree_Impl_._new(this1 - a.d);
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		var value2 = Math.abs(d);
		this4 = thx.unit.angle._Degree.Degree_Impl_._new(value2);
		var value1 = Math.min(this4,max);
		this3 = thx.unit.angle._Degree.Degree_Impl_._new(value1);
		d = thx.unit.angle._Degree.Degree_Impl_._new(this3 * (d < 0?-1:1));
	}
	return d;
};
boidz.util.Steer.toward = function(a,b,max) {
	var px = b.x - a.x;
	var py = b.y - a.y;
	var d = thx.unit.angle._Degree.Degree_Impl_.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			var value = Math.atan2(py,px);
			this2 = thx.unit.angle._Radian.Radian_Impl_._new(value);
			this1 = thx.unit.angle._Degree.Degree_Impl_._new(this2 * 57.2957795130823);
		}
		$r = thx.unit.angle._Degree.Degree_Impl_._new(this1 - a.d);
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		var value2 = Math.abs(d);
		this4 = thx.unit.angle._Degree.Degree_Impl_._new(value2);
		var value1 = Math.min(this4,max);
		this3 = thx.unit.angle._Degree.Degree_Impl_._new(value1);
		d = thx.unit.angle._Degree.Degree_Impl_._new(this3 * (d < 0?-1:1));
	}
	return d;
};
boidz.util.Steer.converge = function(src,dst,max) {
	var delta = dst - src;
	if(Math.abs(delta) > max) return (delta < 0?-1:1) * max; else return delta;
};
boidz.util.Steer.facingRight = function(d) {
	d = thx.unit.angle._Degree.Degree_Impl_.normalize(d);
	return (function($this) {
		var $r;
		var other = thx.unit.angle._Degree.Degree_Impl_._new(270);
		$r = d > other;
		return $r;
	}(this)) || (function($this) {
		var $r;
		var other1 = thx.unit.angle._Degree.Degree_Impl_._new(90);
		$r = d < other1;
		return $r;
	}(this));
};
boidz.util.Steer.facingLeft = function(d) {
	d = thx.unit.angle._Degree.Degree_Impl_.normalize(d);
	return (function($this) {
		var $r;
		var other = thx.unit.angle._Degree.Degree_Impl_._new(270);
		$r = d < other;
		return $r;
	}(this)) && (function($this) {
		var $r;
		var other1 = thx.unit.angle._Degree.Degree_Impl_._new(90);
		$r = d > other1;
		return $r;
	}(this));
};
boidz.util.Steer.facingUp = function(d) {
	d = thx.unit.angle._Degree.Degree_Impl_.normalize(d);
	var other = thx.unit.angle._Degree.Degree_Impl_._new(180);
	return d > other;
};
boidz.util.Steer.facingDown = function(d) {
	d = thx.unit.angle._Degree.Degree_Impl_.normalize(d);
	var other = thx.unit.angle._Degree.Degree_Impl_._new(180);
	return d < other;
};
var dots = {};
dots.Detect = function() { };
dots.Detect.__name__ = ["dots","Detect"];
dots.Detect.supportsInput = function(type) {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	i.setAttribute("type",type);
	return i.type == type;
};
dots.Detect.supportsInputPlaceholder = function() {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	return Object.prototype.hasOwnProperty.call(i,"placeholder");
};
dots.Detect.supportsInputAutofocus = function() {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	return Object.prototype.hasOwnProperty.call(i,"autofocus");
};
dots.Detect.supportsCanvas = function() {
	return null != ($_=((function($this) {
		var $r;
		var _this = window.document;
		$r = _this.createElement("canvas");
		return $r;
	}(this))),$bind($_,$_.getContext));
};
dots.Detect.supportsVideo = function() {
	return null != ($_=((function($this) {
		var $r;
		var _this = window.document;
		$r = _this.createElement("video");
		return $r;
	}(this))),$bind($_,$_.canPlayType));
};
dots.Detect.supportsLocalStorage = function() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch( e ) {
		return false;
	}
};
dots.Detect.supportsWebWorkers = function() {
	return !(!window.Worker);
};
dots.Detect.supportsOffline = function() {
	return null != window.applicationCache;
};
dots.Detect.supportsGeolocation = function() {
	return Reflect.hasField(window.navigator,"geolocation");
};
dots.Detect.supportsMicrodata = function() {
	return Reflect.hasField(window.document,"getItems");
};
dots.Detect.supportsHistory = function() {
	return !!(window.history && history.pushState);
};
dots.Dom = function() { };
dots.Dom.__name__ = ["dots","Dom"];
dots.Dom.addCss = function(css,container) {
	if(null == container) container = window.document.head;
	var style;
	var _this = window.document;
	style = _this.createElement("style");
	style.type = "text/css";
	style.appendChild(window.document.createTextNode(css));
	container.appendChild(style);
};
dots.Html = function() { };
dots.Html.__name__ = ["dots","Html"];
dots.Html.parseNodes = function(html) {
	if(!dots.Html.pattern.match(html)) throw "Invalid pattern \"" + html + "\"";
	var el;
	var _g = dots.Html.pattern.matched(1).toLowerCase();
	switch(_g) {
	case "tbody":case "thead":
		el = window.document.createElement("table");
		break;
	case "td":case "th":
		el = window.document.createElement("tr");
		break;
	case "tr":
		el = window.document.createElement("tbody");
		break;
	default:
		el = window.document.createElement("div");
	}
	el.innerHTML = html;
	return el.childNodes;
};
dots.Html.parseArray = function(html) {
	return dots.Html.nodeListToArray(dots.Html.parseNodes(html));
};
dots.Html.parse = function(html) {
	return dots.Html.parseNodes(html)[0];
};
dots.Html.nodeListToArray = function(list) {
	return Array.prototype.slice.call(list,0);
};
dots.Query = function() { };
dots.Query.__name__ = ["dots","Query"];
dots.Query.first = function(selector,ctx) {
	return (ctx != null?ctx:dots.Query.doc).querySelector(selector);
};
dots.Query.list = function(selector,ctx) {
	return (ctx != null?ctx:dots.Query.doc).querySelectorAll(selector);
};
dots.Query.all = function(selector,ctx) {
	return dots.Html.nodeListToArray(dots.Query.list(selector,ctx));
};
dots.Query.getElementIndex = function(el) {
	var index = 0;
	while(null != (el = el.previousElementSibling)) index++;
	return index;
};
dots.Query.childrenOf = function(children,parent) {
	return children.filter(function(child) {
		return child.parentElement == parent;
	});
};
var haxe = {};
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.exceptionStack = function() {
	return [];
};
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe.CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
haxe.IMap = function() { };
haxe.IMap.__name__ = ["haxe","IMap"];
haxe.IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,keys: null
	,__class__: haxe.IMap
};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [haxe.IMap];
haxe.ds.IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [haxe.IMap];
haxe.ds.ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; return $x; };
haxe.ds.Option.None = ["None",1];
haxe.ds.Option.None.__enum__ = haxe.ds.Option;
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [haxe.IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js.Boot.__nativeClassName(o);
		if(name != null) return js.Boot.__resolveNativeClass(name);
		return null;
	}
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js.Boot.__string_rec(o[i1],s); else str2 += js.Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js.Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__nativeClassName = function(o) {
	var name = js.Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js.Boot.__isNativeObj = function(o) {
	return js.Boot.__nativeClassName(o) != null;
};
js.Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var sui = {};
sui.Sui = function() {
	this.grid = new sui.components.Grid();
	this.el = this.grid.el;
};
sui.Sui.__name__ = ["sui","Sui"];
sui.Sui.createArray = function(defaultValue,defaultElementValue,createControl,options) {
	return new sui.controls.ArrayControl((function($this) {
		var $r;
		var t;
		{
			var _0 = defaultValue;
			if(null == _0) t = null; else t = _0;
		}
		$r = t != null?t:[];
		return $r;
	}(this)),defaultElementValue,createControl,options);
};
sui.Sui.createBool = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = false;
	return new sui.controls.BoolControl(defaultValue,options);
};
sui.Sui.createColor = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = "#AA0000";
	return new sui.controls.ColorControl(defaultValue,options);
};
sui.Sui.createDate = function(defaultValue,options) {
	if(null == defaultValue) defaultValue = new Date();
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui.controls.DateKind.DateOnly;
		if(_g != null) switch(_g) {
		case true:
			return new sui.controls.DateSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 1:
				return new sui.controls.DateTimeControl(defaultValue,options);
			default:
				return new sui.controls.DateControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 1:
			return new sui.controls.DateTimeControl(defaultValue,options);
		default:
			return new sui.controls.DateControl(defaultValue,options);
		}
	}
};
sui.Sui.collapsible = function(label,collapsed,attachTo,position) {
	if(collapsed == null) collapsed = false;
	var sui1 = new sui.Sui();
	var folder = sui1.folder((function($this) {
		var $r;
		var t;
		{
			var _0 = label;
			if(null == _0) t = null; else t = _0;
		}
		$r = t != null?t:"";
		return $r;
	}(this)),{ collapsible : true, collapsed : collapsed});
	sui1.attach(attachTo,position);
	return folder;
};
sui.Sui.createFloat = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0.0;
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui.controls.FloatKind.FloatNumber;
		if(_g != null) switch(_g) {
		case true:
			return new sui.controls.NumberSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 1:
				return new sui.controls.TimeControl(defaultValue,options);
			default:
				if(null != options && options.min != null && options.max != null) return new sui.controls.FloatRangeControl(defaultValue,options); else return new sui.controls.FloatControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 1:
			return new sui.controls.TimeControl(defaultValue,options);
		default:
			if(null != options && options.min != null && options.max != null) return new sui.controls.FloatRangeControl(defaultValue,options); else return new sui.controls.FloatControl(defaultValue,options);
		}
	}
};
sui.Sui.createInt = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0;
	if((function($this) {
		var $r;
		var t;
		{
			var _0 = options;
			var _1;
			if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		}
		$r = t != null?t:false;
		return $r;
	}(this))) return new sui.controls.NumberSelectControl(defaultValue,options); else if(null != options && options.min != null && options.max != null) return new sui.controls.IntRangeControl(defaultValue,options); else return new sui.controls.IntControl(defaultValue,options);
};
sui.Sui.createIntMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui.controls.MapControl(defaultValue,function() {
		return new haxe.ds.IntMap();
	},createKeyControl,createValueControl,options);
};
sui.Sui.createLabel = function(defaultValue,label,callback) {
	if(defaultValue == null) defaultValue = "";
	return new sui.controls.LabelControl(defaultValue);
};
sui.Sui.createObjectMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui.controls.MapControl(defaultValue,function() {
		return new haxe.ds.ObjectMap();
	},createKeyControl,createValueControl,options);
};
sui.Sui.createStringMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui.controls.MapControl(defaultValue,function() {
		return new haxe.ds.StringMap();
	},createKeyControl,createValueControl,options);
};
sui.Sui.createText = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = "";
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui.controls.TextKind.PlainText;
		if(_g != null) switch(_g) {
		case true:
			return new sui.controls.TextSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 0:
				return new sui.controls.EmailControl(defaultValue,options);
			case 1:
				return new sui.controls.PasswordControl(defaultValue,options);
			case 3:
				return new sui.controls.TelControl(defaultValue,options);
			case 2:
				return new sui.controls.SearchControl(defaultValue,options);
			case 5:
				return new sui.controls.UrlControl(defaultValue,options);
			default:
				return new sui.controls.TextControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 0:
			return new sui.controls.EmailControl(defaultValue,options);
		case 1:
			return new sui.controls.PasswordControl(defaultValue,options);
		case 3:
			return new sui.controls.TelControl(defaultValue,options);
		case 2:
			return new sui.controls.SearchControl(defaultValue,options);
		case 5:
			return new sui.controls.UrlControl(defaultValue,options);
		default:
			return new sui.controls.TextControl(defaultValue,options);
		}
	}
};
sui.Sui.createTrigger = function(actionLabel,options) {
	return new sui.controls.TriggerControl(actionLabel,options);
};
sui.Sui.prototype = {
	el: null
	,grid: null
	,array: function(label,defaultValue,defaultElementValue,createControl,options,callback) {
		return this.control(label,sui.Sui.createArray(defaultValue,defaultElementValue,createControl,options),callback);
	}
	,bool: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = false;
		return this.control(label,sui.Sui.createBool(defaultValue,options),callback);
	}
	,color: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = "#AA0000";
		return this.control(label,sui.Sui.createColor(defaultValue,options),callback);
	}
	,date: function(label,defaultValue,options,callback) {
		return this.control(label,sui.Sui.createDate(defaultValue,options),callback);
	}
	,'float': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0.0;
		return this.control(label,sui.Sui.createFloat(defaultValue,options),callback);
	}
	,folder: function(label,options) {
		var collapsible;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.collapsible)) t = null; else t = _1;
		if(t != null) collapsible = t; else collapsible = true;
		var collapsed;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.collapsed)) t1 = null; else t1 = _11;
		if(t1 != null) collapsed = t1; else collapsed = false;
		var sui1 = new sui.Sui();
		var header = { el : dots.Html.parseNodes("<header class=\"sui-folder\">\n<i class=\"sui-trigger-toggle sui-icon sui-icon-collapse\"></i>\n" + label + "</header>")[0]};
		var trigger = dots.Query.first(".sui-trigger-toggle",header.el);
		if(collapsible) {
			header.el.classList.add("sui-collapsible");
			if(collapsed) sui1.grid.el.style.display = "none";
			var collapse = thx.stream.EmitterBools.negate(thx.stream.dom.Dom.streamEvent(header.el,"click",false).map(function(_) {
				return collapsed = !collapsed;
			}));
			collapse.subscribe(thx.core.Functions1.join(thx.stream.dom.Dom.subscribeToggleVisibility(sui1.grid.el),thx.stream.dom.Dom.subscribeSwapClass(trigger,"sui-icon-collapse","sui-icon-expand")));
		} else trigger.style.display = "none";
		sui1.grid.el.classList.add("sui-grid-inner");
		this.grid.add(sui.components.CellContent.VerticalPair(header,sui1.grid));
		return sui1;
	}
	,'int': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0;
		return this.control(label,sui.Sui.createInt(defaultValue,options),callback);
	}
	,intMap: function(label,defaultValue,createValueControl,options,callback) {
		return this.control(label,sui.Sui.createIntMap(defaultValue,function(v) {
			return sui.Sui.createInt(v);
		},createValueControl,options),callback);
	}
	,label: function(defaultValue,label,callback) {
		if(defaultValue == null) defaultValue = "";
		return this.control(label,sui.Sui.createLabel(defaultValue),callback);
	}
	,objectMap: function(label,defaultValue,createKeyControl,createValueControl,options,callback) {
		return this.control(label,sui.Sui.createObjectMap(defaultValue,createKeyControl,createValueControl,options),callback);
	}
	,stringMap: function(label,defaultValue,createValueControl,options,callback) {
		return this.control(label,sui.Sui.createStringMap(defaultValue,function(v) {
			return sui.Sui.createText(v);
		},createValueControl,options),callback);
	}
	,text: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = "";
		return this.control(label,sui.Sui.createText(defaultValue,options),callback);
	}
	,trigger: function(actionLabel,label,options,callback) {
		return this.control(label,new sui.controls.TriggerControl(actionLabel,options),function(_) {
			callback();
		});
	}
	,control: function(label,control,callback) {
		this.grid.add(null == label?sui.components.CellContent.Single(control):sui.components.CellContent.HorizontalPair(new sui.controls.LabelControl(label),control));
		control.streams.value.subscribe(callback);
		return control;
	}
	,attach: function(el,anchor) {
		if(null == el) el = window.document.body;
		this.el.classList.add((function($this) {
			var $r;
			var t;
			{
				var _0 = anchor;
				if(null == _0) t = null; else t = _0;
			}
			$r = t != null?t:el == window.document.body?"sui-top-right":"sui-append";
			return $r;
		}(this)));
		el.appendChild(this.el);
	}
	,__class__: sui.Sui
};
sui.components = {};
sui.components.Grid = function() {
	this.el = dots.Html.parseNodes("<table class=\"sui-grid\"></table>")[0];
};
sui.components.Grid.__name__ = ["sui","components","Grid"];
sui.components.Grid.prototype = {
	el: null
	,add: function(cell) {
		var _g = this;
		switch(cell[1]) {
		case 0:
			var control = cell[2];
			var container = dots.Html.parseNodes("<tr class=\"sui-single\"><td colspan=\"2\"></td></tr>")[0];
			dots.Query.first("td",container).appendChild(control.el);
			this.el.appendChild(container);
			break;
		case 2:
			var right = cell[3];
			var left = cell[2];
			var container1 = dots.Html.parseNodes("<tr class=\"sui-horizontal\"><td class=\"sui-left\"></td><td class=\"sui-right\"></td></tr>")[0];
			dots.Query.first(".sui-left",container1).appendChild(left.el);
			dots.Query.first(".sui-right",container1).appendChild(right.el);
			this.el.appendChild(container1);
			break;
		case 1:
			var bottom = cell[3];
			var top = cell[2];
			var containers = dots.Html.nodeListToArray(dots.Html.parseNodes("<tr class=\"sui-vertical sui-top\"><td colspan=\"2\"></td></tr><tr class=\"sui-vertical sui-bottom\"><td colspan=\"2\"></td></tr>"));
			dots.Query.first("td",containers[0]).appendChild(top.el);
			dots.Query.first("td",containers[1]).appendChild(bottom.el);
			containers.map(function(_) {
				return _g.el.appendChild(_);
			});
			break;
		}
	}
	,__class__: sui.components.Grid
};
sui.components.CellContent = { __ename__ : ["sui","components","CellContent"], __constructs__ : ["Single","VerticalPair","HorizontalPair"] };
sui.components.CellContent.Single = function(control) { var $x = ["Single",0,control]; $x.__enum__ = sui.components.CellContent; return $x; };
sui.components.CellContent.VerticalPair = function(top,bottom) { var $x = ["VerticalPair",1,top,bottom]; $x.__enum__ = sui.components.CellContent; return $x; };
sui.components.CellContent.HorizontalPair = function(left,right) { var $x = ["HorizontalPair",2,left,right]; $x.__enum__ = sui.components.CellContent; return $x; };
sui.controls = {};
sui.controls.IControl = function() { };
sui.controls.IControl.__name__ = ["sui","controls","IControl"];
sui.controls.IControl.prototype = {
	el: null
	,defaultValue: null
	,streams: null
	,set: null
	,get: null
	,isEnabled: null
	,isFocused: null
	,disable: null
	,enable: null
	,focus: null
	,blur: null
	,reset: null
	,__class__: sui.controls.IControl
};
sui.controls.ArrayControl = function(defaultValue,defaultElementValue,createElementControl,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-array\">\n<ul class=\"sui-array\"></ul>\n<div class=\"sui-array-add\"><i class=\"sui-icon sui-icon-add\"></i></div>\n</div>";
	var t;
	var _0 = options;
	if(null == _0) t = null; else t = _0;
	if(t != null) options = t; else options = { };
	this.defaultValue = defaultValue;
	this.defaultElementValue = defaultElementValue;
	this.createElementControl = createElementControl;
	this.elements = [];
	this.length = 0;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused.debounce(0),this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.ul = dots.Query.first("ul",this.el);
	this.addButton = dots.Query.first(".sui-icon-add",this.el);
	thx.stream.dom.Dom.streamEvent(this.addButton,"click",false).subscribe(function(_) {
		_g.addControl(defaultElementValue);
	});
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx.stream.EmitterBools.negate(this.values.enabled).subscribe(thx.stream.dom.Dom.subscribeToggleClass(this.el,"sui-disabled"));
	this.values.enabled.subscribe(function(v2) {
		_g.elements.map(function(_1) {
			if(v2) _1.control.enable(); else _1.control.disable();
			return;
		});
	});
	this.setValue(defaultValue);
	this.reset();
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui.controls.ArrayControl.__name__ = ["sui","controls","ArrayControl"];
sui.controls.ArrayControl.__interfaces__ = [sui.controls.IControl];
sui.controls.ArrayControl.prototype = {
	el: null
	,ul: null
	,addButton: null
	,defaultValue: null
	,defaultElementValue: null
	,streams: null
	,createElementControl: null
	,length: null
	,values: null
	,elements: null
	,addControl: function(value) {
		var _g = this;
		var o = { control : this.createElementControl(value), el : dots.Html.parseNodes("<li class=\"sui-array-item\">\n    <div class=\"sui-move\"><i class=\"sui-icon-mini sui-icon-up\"></i><i class=\"sui-icon-mini sui-icon-down\"></i></div>\n    <div class=\"sui-control-container\"></div>\n    <div class=\"sui-remove\"><i class=\"sui-icon sui-icon-remove\"></i></div>\n</li>")[0], index : this.length++};
		this.ul.appendChild(o.el);
		var removeElement = dots.Query.first(".sui-icon-remove",o.el);
		var upElement = dots.Query.first(".sui-icon-up",o.el);
		var downElement = dots.Query.first(".sui-icon-down",o.el);
		var controlContainer = dots.Query.first(".sui-control-container",o.el);
		controlContainer.appendChild(o.control.el);
		thx.stream.dom.Dom.streamEvent(removeElement,"click",false).subscribe(function(_) {
			_g.ul.removeChild(o.el);
			_g.elements.splice(o.index,1);
			var _g2 = o.index;
			var _g1 = _g.elements.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.elements[i].index--;
			}
			_g.length--;
			_g.updateValue();
		});
		this.elements.push(o);
		o.control.streams.value.subscribe(function(_1) {
			_g.updateValue();
		});
		o.control.streams.focused.subscribe(thx.stream.dom.Dom.subscribeToggleClass(o.el,"sui-focus"));
		o.control.streams.focused.feed(this.values.focused);
		thx.stream.dom.Dom.streamEvent(upElement,"click",false).subscribe(function(_2) {
			var pos = o.index;
			var prev = _g.elements[pos - 1];
			_g.elements[pos] = prev;
			_g.elements[pos - 1] = o;
			prev.index = pos;
			o.index = pos - 1;
			_g.ul.insertBefore(o.el,prev.el);
			_g.updateValue();
		});
		thx.stream.dom.Dom.streamEvent(downElement,"click",false).subscribe(function(_3) {
			var pos1 = o.index;
			var next = _g.elements[pos1 + 1];
			_g.elements[pos1] = next;
			_g.elements[pos1 + 1] = o;
			next.index = pos1;
			o.index = pos1 + 1;
			_g.ul.insertBefore(next.el,o.el);
			_g.updateValue();
		});
	}
	,setValue: function(v) {
		var _g = this;
		v.map(function(_) {
			_g.addControl(_);
			return;
		});
	}
	,getValue: function() {
		return this.elements.map(function(_) {
			return _.control.get();
		});
	}
	,updateValue: function() {
		this.values.value.set(this.getValue());
	}
	,set: function(v) {
		this.clear();
		this.setValue(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		if(this.elements.length > 0) thx.core.Arrays.last(this.elements).control.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		(function(_) {
			if(null == _) null; else el.blur();
			return;
		})(thx.core.Arrays.first(this.elements.filter(function(_1) {
			return _1.control.el == el;
		})));
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,clear: function() {
		var _g = this;
		this.length = 0;
		this.elements.map(function(item) {
			_g.ul.removeChild(item.el);
		});
		this.elements = [];
	}
	,__class__: sui.controls.ArrayControl
};
sui.controls.SingleInputControl = function(defaultValue,event,name,type,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><input type=\"" + type + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.input = dots.Query.first("input",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.setInput(defaultValue);
	thx.stream.dom.Dom.streamFocus(this.input).feed(this.values.focused);
	thx.stream.dom.Dom.streamEvent(this.input,event).map(function(_) {
		return _g.getInput();
	}).feed(this.values.value);
	if(!options.allownull) this.input.setAttribute("required","required");
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui.controls.SingleInputControl.__name__ = ["sui","controls","SingleInputControl"];
sui.controls.SingleInputControl.__interfaces__ = [sui.controls.IControl];
sui.controls.SingleInputControl.prototype = {
	el: null
	,input: null
	,defaultValue: null
	,streams: null
	,values: null
	,setInput: function(v) {
		throw new thx.core.error.AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 64, className : "sui.controls.SingleInputControl", methodName : "setInput"});
	}
	,getInput: function() {
		throw new thx.core.error.AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 67, className : "sui.controls.SingleInputControl", methodName : "getInput"});
	}
	,set: function(v) {
		this.setInput(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.input.focus();
	}
	,blur: function() {
		this.input.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui.controls.SingleInputControl
};
sui.controls.BaseDateControl = function(value,name,type,dateToString,options) {
	if(null == options) options = { };
	this.dateToString = dateToString;
	sui.controls.SingleInputControl.call(this,value,"input",name,type,options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min",dateToString(options.min));
	if(null != options.max) this.input.setAttribute("max",dateToString(options.max));
	if(null != options.list) new sui.controls.DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : dateToString(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui.controls.DataList(this.el,options.values.map(function(o1) {
		return { label : HxOverrides.dateStr(o1), value : dateToString(o1)};
	})).applyTo(this.input);
};
sui.controls.BaseDateControl.__name__ = ["sui","controls","BaseDateControl"];
sui.controls.BaseDateControl.toRFCDate = function(date) {
	var y = date.getFullYear();
	var m = StringTools.lpad("" + (date.getMonth() + 1),"0",2);
	var d = StringTools.lpad("" + date.getDate(),"0",2);
	return "" + y + "-" + m + "-" + d;
};
sui.controls.BaseDateControl.toRFCDateTime = function(date) {
	var d = sui.controls.BaseDateControl.toRFCDate(date);
	var hh = StringTools.lpad("" + date.getHours(),"0",2);
	var mm = StringTools.lpad("" + date.getMinutes(),"0",2);
	var ss = StringTools.lpad("" + date.getSeconds(),"0",2);
	return "" + d + "T" + hh + ":" + mm + ":" + ss;
};
sui.controls.BaseDateControl.toRFCDateTimeNoSeconds = function(date) {
	var d = sui.controls.BaseDateControl.toRFCDate(date);
	var hh = StringTools.lpad("" + date.getHours(),"0",2);
	var mm = StringTools.lpad("" + date.getMinutes(),"0",2);
	return "" + d + "T" + hh + ":" + mm + ":00";
};
sui.controls.BaseDateControl.fromRFC = function(date) {
	var dp = date.split("T")[0];
	var dt;
	var t1;
	var _0 = date;
	var _1;
	var _2;
	if(null == _0) t1 = null; else if(null == (_1 = _0.split("T"))) t1 = null; else if(null == (_2 = _1[1])) t1 = null; else t1 = _2;
	if(t1 != null) dt = t1; else dt = "00:00:00";
	var p = dp.split("-");
	var y = Std.parseInt(p[0]);
	var m = Std.parseInt(p[1]) - 1;
	var d = Std.parseInt(p[2]);
	var t = dt.split(":");
	var hh = Std.parseInt(t[0]);
	var mm = Std.parseInt(t[1]);
	var ss = Std.parseInt(t[2]);
	return new Date(y,m,d,hh,mm,ss);
};
sui.controls.BaseDateControl.__super__ = sui.controls.SingleInputControl;
sui.controls.BaseDateControl.prototype = $extend(sui.controls.SingleInputControl.prototype,{
	dateToString: null
	,setInput: function(v) {
		this.input.value = this.dateToString(v);
	}
	,getInput: function() {
		if(thx.core.Strings.isEmpty(this.input.value)) return null; else return sui.controls.BaseDateControl.fromRFC(this.input.value);
	}
	,__class__: sui.controls.BaseDateControl
});
sui.controls.BaseTextControl = function(value,name,type,options) {
	if(null == options) options = { };
	sui.controls.SingleInputControl.call(this,value,"input",name,type,options);
	if(null != options.maxlength) this.input.setAttribute("maxlength","" + options.maxlength);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.pattern) this.input.setAttribute("pattern","" + options.pattern);
	if(null != options.placeholder) this.input.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui.controls.DataList(this.el,options.list).applyTo(this.input); else if(null != options.values) sui.controls.DataList.fromArray(this.el,options.values).applyTo(this.input);
};
sui.controls.BaseTextControl.__name__ = ["sui","controls","BaseTextControl"];
sui.controls.BaseTextControl.__super__ = sui.controls.SingleInputControl;
sui.controls.BaseTextControl.prototype = $extend(sui.controls.SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.value = v;
	}
	,getInput: function() {
		return this.input.value;
	}
	,__class__: sui.controls.BaseTextControl
});
sui.controls.BoolControl = function(value,options) {
	sui.controls.SingleInputControl.call(this,value,"change","bool","checkbox",options);
};
sui.controls.BoolControl.__name__ = ["sui","controls","BoolControl"];
sui.controls.BoolControl.__super__ = sui.controls.SingleInputControl;
sui.controls.BoolControl.prototype = $extend(sui.controls.SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.checked = v;
	}
	,getInput: function() {
		return this.input.checked;
	}
	,__class__: sui.controls.BoolControl
});
sui.controls.DoubleInputControl = function(defaultValue,name,event1,type1,event2,type2,filter,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-double sui-type-" + name + "\"><input class=\"input1\" type=\"" + type1 + "\"/><input class=\"input2\" type=\"" + type2 + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.input1 = dots.Query.first(".input1",this.el);
	this.input2 = dots.Query.first(".input2",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input1.removeAttribute("disabled");
			_g.input2.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input1.setAttribute("disabled","disabled");
			_g.input2.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx.stream.dom.Dom.streamFocus(this.input1).merge(thx.stream.dom.Dom.streamFocus(this.input2)).feed(this.values.focused);
	thx.stream.dom.Dom.streamEvent(this.input1,event1).map(function(_) {
		return _g.getInput1();
	}).subscribe(function(v2) {
		_g.setInput2(v2);
		_g.values.value.set(v2);
	});
	thx.stream.dom.Dom.streamEvent(this.input2,event2).map(function(_1) {
		return _g.getInput2();
	}).filter(filter).subscribe(function(v3) {
		_g.setInput1(v3);
		_g.values.value.set(v3);
	});
	if(!options.allownull) {
		this.input1.setAttribute("required","required");
		this.input2.setAttribute("required","required");
	}
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
	if(!dots.Detect.supportsInput(type1)) this.input1.style.display = "none";
};
sui.controls.DoubleInputControl.__name__ = ["sui","controls","DoubleInputControl"];
sui.controls.DoubleInputControl.__interfaces__ = [sui.controls.IControl];
sui.controls.DoubleInputControl.prototype = {
	el: null
	,input1: null
	,input2: null
	,defaultValue: null
	,streams: null
	,values: null
	,setInputs: function(v) {
		this.setInput1(v);
		this.setInput2(v);
	}
	,setInput1: function(v) {
		throw new thx.core.error.AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 89, className : "sui.controls.DoubleInputControl", methodName : "setInput1"});
	}
	,setInput2: function(v) {
		throw new thx.core.error.AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 92, className : "sui.controls.DoubleInputControl", methodName : "setInput2"});
	}
	,getInput1: function() {
		throw new thx.core.error.AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 95, className : "sui.controls.DoubleInputControl", methodName : "getInput1"});
	}
	,getInput2: function() {
		throw new thx.core.error.AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 98, className : "sui.controls.DoubleInputControl", methodName : "getInput2"});
	}
	,set: function(v) {
		this.setInputs(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.input2.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		if(el == this.input1 || el == this.input2) el.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui.controls.DoubleInputControl
};
sui.controls.ColorControl = function(value,options) {
	if(null == options) options = { };
	sui.controls.DoubleInputControl.call(this,value,"color","input","color","input","text",($_=sui.controls.ColorControl.PATTERN,$bind($_,$_.match)),options);
	if(null != options.autocomplete) this.input2.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.list) new sui.controls.DataList(this.el,options.list).applyTo(this.input1).applyTo(this.input2); else if(null != options.values) sui.controls.DataList.fromArray(this.el,options.values).applyTo(this.input1).applyTo(this.input2);
	this.setInputs(value);
};
sui.controls.ColorControl.__name__ = ["sui","controls","ColorControl"];
sui.controls.ColorControl.__super__ = sui.controls.DoubleInputControl;
sui.controls.ColorControl.prototype = $extend(sui.controls.DoubleInputControl.prototype,{
	setInput1: function(v) {
		this.input1.value = v;
	}
	,setInput2: function(v) {
		this.input2.value = v;
	}
	,getInput1: function() {
		return this.input1.value;
	}
	,getInput2: function() {
		return this.input2.value;
	}
	,__class__: sui.controls.ColorControl
});
sui.controls.ControlStreams = function(value,focused,enabled) {
	this.value = value;
	this.focused = focused;
	this.enabled = enabled;
};
sui.controls.ControlStreams.__name__ = ["sui","controls","ControlStreams"];
sui.controls.ControlStreams.prototype = {
	value: null
	,focused: null
	,enabled: null
	,__class__: sui.controls.ControlStreams
};
sui.controls.ControlValues = function(defaultValue) {
	this.value = new thx.stream.Value(defaultValue);
	this.focused = new thx.stream.Value(false);
	this.enabled = new thx.stream.Value(true);
};
sui.controls.ControlValues.__name__ = ["sui","controls","ControlValues"];
sui.controls.ControlValues.prototype = {
	value: null
	,focused: null
	,enabled: null
	,__class__: sui.controls.ControlValues
};
sui.controls.DataList = function(container,values) {
	this.id = "sui-dl-" + ++sui.controls.DataList.nid;
	var datalist = dots.Html.parse("<datalist id=\"" + this.id + "\" style=\"display:none\">" + values.map(sui.controls.DataList.toOption).join("") + "</datalist>");
	container.appendChild(datalist);
};
sui.controls.DataList.__name__ = ["sui","controls","DataList"];
sui.controls.DataList.fromArray = function(container,values) {
	return new sui.controls.DataList(container,values.map(function(v) {
		return { value : v, label : v};
	}));
};
sui.controls.DataList.toOption = function(o) {
	return "<option value=\"" + StringTools.htmlEscape(o.value) + "\">" + o.label + "</option>";
};
sui.controls.DataList.prototype = {
	id: null
	,applyTo: function(el) {
		el.setAttribute("list",this.id);
		return this;
	}
	,__class__: sui.controls.DataList
};
sui.controls.DateControl = function(value,options) {
	sui.controls.BaseDateControl.call(this,value,"date","date",sui.controls.BaseDateControl.toRFCDate,options);
};
sui.controls.DateControl.__name__ = ["sui","controls","DateControl"];
sui.controls.DateControl.__super__ = sui.controls.BaseDateControl;
sui.controls.DateControl.prototype = $extend(sui.controls.BaseDateControl.prototype,{
	__class__: sui.controls.DateControl
});
sui.controls.SelectControl = function(defaultValue,name,options) {
	this.count = 0;
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><select></select></div>";
	if(null == options) throw " A select control requires an option object with values or list set";
	if(null == options.values && null == options.list) throw " A select control requires either the values or list option";
	if(null == options.allownull) options.allownull = false;
	this.defaultValue = defaultValue;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.select = dots.Query.first("select",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.select.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.select.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.options = [];
	(options.allownull?[{ label : (function($this) {
		var $r;
		var t;
		{
			var _0 = options;
			var _1;
			if(null == _0) t = null; else if(null == (_1 = _0.labelfornull)) t = null; else t = _1;
		}
		$r = t != null?t:"- none -";
		return $r;
	}(this)), value : null}]:[]).concat((function($this) {
		var $r;
		var t1;
		{
			var _01 = options;
			var _11;
			if(null == _01) t1 = null; else if(null == (_11 = _01.list)) t1 = null; else t1 = _11;
		}
		$r = t1 != null?t1:options.values.map(function(_) {
			return { value : _, label : Std.string(_)};
		});
		return $r;
	}(this))).map(function(_2) {
		return _g.addOption(_2.label,_2.value);
	});
	this.setInput(defaultValue);
	thx.stream.dom.Dom.streamFocus(this.select).feed(this.values.focused);
	thx.stream.dom.Dom.streamEvent(this.select,"change").map(function(_3) {
		return _g.getInput();
	}).feed(this.values.value);
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui.controls.SelectControl.__name__ = ["sui","controls","SelectControl"];
sui.controls.SelectControl.__interfaces__ = [sui.controls.IControl];
sui.controls.SelectControl.prototype = {
	el: null
	,select: null
	,defaultValue: null
	,streams: null
	,options: null
	,values: null
	,count: null
	,addOption: function(label,value) {
		var index = this.count++;
		var option = dots.Html.parseNodes("<option>" + label + "</option>")[0];
		this.options[index] = value;
		this.select.appendChild(option);
		return option;
	}
	,setInput: function(v) {
		var index = HxOverrides.indexOf(this.options,v,0);
		if(index < 0) throw "value \"" + Std.string(v) + "\" is not included in this select control";
		this.select.selectedIndex = index;
	}
	,getInput: function() {
		return this.options[this.select.selectedIndex];
	}
	,set: function(v) {
		this.setInput(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.select.focus();
	}
	,blur: function() {
		this.select.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui.controls.SelectControl
};
sui.controls.DateSelectControl = function(defaultValue,options) {
	sui.controls.SelectControl.call(this,defaultValue,"select-date",options);
};
sui.controls.DateSelectControl.__name__ = ["sui","controls","DateSelectControl"];
sui.controls.DateSelectControl.__super__ = sui.controls.SelectControl;
sui.controls.DateSelectControl.prototype = $extend(sui.controls.SelectControl.prototype,{
	__class__: sui.controls.DateSelectControl
});
sui.controls.DateTimeControl = function(value,options) {
	sui.controls.BaseDateControl.call(this,value,"date-time","datetime-local",sui.controls.BaseDateControl.toRFCDateTimeNoSeconds,options);
};
sui.controls.DateTimeControl.__name__ = ["sui","controls","DateTimeControl"];
sui.controls.DateTimeControl.__super__ = sui.controls.BaseDateControl;
sui.controls.DateTimeControl.prototype = $extend(sui.controls.BaseDateControl.prototype,{
	__class__: sui.controls.DateTimeControl
});
sui.controls.EmailControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.placeholder) options.placeholder = "name@example.com";
	sui.controls.BaseTextControl.call(this,value,"email","email",options);
};
sui.controls.EmailControl.__name__ = ["sui","controls","EmailControl"];
sui.controls.EmailControl.__super__ = sui.controls.BaseTextControl;
sui.controls.EmailControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.EmailControl
});
sui.controls.NumberControl = function(value,name,options) {
	if(null == options) options = { };
	sui.controls.SingleInputControl.call(this,value,"input",name,"number",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min","" + Std.string(options.min));
	if(null != options.max) this.input.setAttribute("max","" + Std.string(options.max));
	if(null != options.step) this.input.setAttribute("step","" + Std.string(options.step));
	if(null != options.placeholder) this.input.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui.controls.DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui.controls.DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input);
};
sui.controls.NumberControl.__name__ = ["sui","controls","NumberControl"];
sui.controls.NumberControl.__super__ = sui.controls.SingleInputControl;
sui.controls.NumberControl.prototype = $extend(sui.controls.SingleInputControl.prototype,{
	__class__: sui.controls.NumberControl
});
sui.controls.FloatControl = function(value,options) {
	sui.controls.NumberControl.call(this,value,"float",options);
};
sui.controls.FloatControl.__name__ = ["sui","controls","FloatControl"];
sui.controls.FloatControl.__super__ = sui.controls.NumberControl;
sui.controls.FloatControl.prototype = $extend(sui.controls.NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return parseFloat(this.input.value);
	}
	,__class__: sui.controls.FloatControl
});
sui.controls.NumberRangeControl = function(value,options) {
	sui.controls.DoubleInputControl.call(this,value,"float-range","input","range","input","number",function(v) {
		return v != null;
	},options);
	if(null != options.autocomplete) {
		this.input1.setAttribute("autocomplete",options.autocomplete?"on":"off");
		this.input2.setAttribute("autocomplete",options.autocomplete?"on":"off");
	}
	if(null != options.min) {
		this.input1.setAttribute("min","" + Std.string(options.min));
		this.input2.setAttribute("min","" + Std.string(options.min));
	}
	if(null != options.max) {
		this.input1.setAttribute("max","" + Std.string(options.max));
		this.input2.setAttribute("max","" + Std.string(options.max));
	}
	if(null != options.step) {
		this.input1.setAttribute("step","" + Std.string(options.step));
		this.input2.setAttribute("step","" + Std.string(options.step));
	}
	if(null != options.placeholder) this.input2.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui.controls.DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input1).applyTo(this.input2); else if(null != options.values) new sui.controls.DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input1).applyTo(this.input2);
	this.setInputs(value);
};
sui.controls.NumberRangeControl.__name__ = ["sui","controls","NumberRangeControl"];
sui.controls.NumberRangeControl.__super__ = sui.controls.DoubleInputControl;
sui.controls.NumberRangeControl.prototype = $extend(sui.controls.DoubleInputControl.prototype,{
	setInput1: function(v) {
		this.input1.value = "" + Std.string(v);
	}
	,setInput2: function(v) {
		this.input2.value = "" + Std.string(v);
	}
	,__class__: sui.controls.NumberRangeControl
});
sui.controls.FloatRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) options.min = Math.min(value,0);
	if(null == options.min) {
		var s;
		if(null != options.step) s = options.step; else s = 1;
		options.max = Math.max(value,s);
	}
	sui.controls.NumberRangeControl.call(this,value,options);
};
sui.controls.FloatRangeControl.__name__ = ["sui","controls","FloatRangeControl"];
sui.controls.FloatRangeControl.__super__ = sui.controls.NumberRangeControl;
sui.controls.FloatRangeControl.prototype = $extend(sui.controls.NumberRangeControl.prototype,{
	getInput1: function() {
		if(thx.core.Floats.canParse(this.input1.value)) return thx.core.Floats.parse(this.input1.value); else return null;
	}
	,getInput2: function() {
		if(thx.core.Floats.canParse(this.input2.value)) return thx.core.Floats.parse(this.input2.value); else return null;
	}
	,__class__: sui.controls.FloatRangeControl
});
sui.controls.IntControl = function(value,options) {
	sui.controls.NumberControl.call(this,value,"int",options);
};
sui.controls.IntControl.__name__ = ["sui","controls","IntControl"];
sui.controls.IntControl.__super__ = sui.controls.NumberControl;
sui.controls.IntControl.prototype = $extend(sui.controls.NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return Std.parseInt(this.input.value);
	}
	,__class__: sui.controls.IntControl
});
sui.controls.IntRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) if(value < 0) options.min = value; else options.min = 0;
	if(null == options.min) {
		var s;
		if(null != options.step) s = options.step; else s = 100;
		if(value > s) options.max = value; else options.max = s;
	}
	sui.controls.NumberRangeControl.call(this,value,options);
};
sui.controls.IntRangeControl.__name__ = ["sui","controls","IntRangeControl"];
sui.controls.IntRangeControl.__super__ = sui.controls.NumberRangeControl;
sui.controls.IntRangeControl.prototype = $extend(sui.controls.NumberRangeControl.prototype,{
	getInput1: function() {
		if(thx.core.Ints.canParse(this.input1.value)) return thx.core.Ints.parse(this.input1.value); else return null;
	}
	,getInput2: function() {
		if(thx.core.Ints.canParse(this.input2.value)) return thx.core.Ints.parse(this.input2.value); else return null;
	}
	,__class__: sui.controls.IntRangeControl
});
sui.controls.LabelControl = function(defaultValue) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-label\"><output>" + defaultValue + "</output></div>";
	this.defaultValue = defaultValue;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.output = dots.Query.first("output",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
};
sui.controls.LabelControl.__name__ = ["sui","controls","LabelControl"];
sui.controls.LabelControl.__interfaces__ = [sui.controls.IControl];
sui.controls.LabelControl.prototype = {
	el: null
	,output: null
	,defaultValue: null
	,streams: null
	,values: null
	,set: function(v) {
		this.output.innerHTML = v;
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
	}
	,blur: function() {
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui.controls.LabelControl
};
sui.controls.MapControl = function(defaultValue,createMap,createKeyControl,createValueControl,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-array\">\n<table class=\"sui-map\"><tbody></tbody></table>\n<div class=\"sui-array-add\"><i class=\"sui-icon sui-icon-add\"></i></div>\n</div>";
	var t;
	var _0 = options;
	if(null == _0) t = null; else t = _0;
	if(t != null) options = t; else options = { };
	if(null == defaultValue) defaultValue = createMap();
	this.defaultValue = defaultValue;
	this.createMap = createMap;
	this.createKeyControl = createKeyControl;
	this.createValueControl = createValueControl;
	this.elements = [];
	this.length = 0;
	this.values = new sui.controls.ControlValues(defaultValue);
	this.streams = new sui.controls.ControlStreams(this.values.value,this.values.focused.debounce(0),this.values.enabled);
	this.el = dots.Html.parseNodes(template)[0];
	this.tbody = dots.Query.first("tbody",this.el);
	this.addButton = dots.Query.first(".sui-icon-add",this.el);
	thx.stream.dom.Dom.streamEvent(this.addButton,"click",false).subscribe(function(_) {
		_g.addControl(null,null);
	});
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx.stream.EmitterBools.negate(this.values.enabled).subscribe(thx.stream.dom.Dom.subscribeToggleClass(this.el,"sui-disabled"));
	this.values.enabled.subscribe(function(v2) {
		_g.elements.map(function(_1) {
			if(v2) {
				_1.controlKey.enable();
				_1.controlValue.enable();
			} else {
				_1.controlKey.disable();
				_1.controlValue.disable();
			}
			return;
		});
	});
	this.setValue(defaultValue);
	this.reset();
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui.controls.MapControl.__name__ = ["sui","controls","MapControl"];
sui.controls.MapControl.__interfaces__ = [sui.controls.IControl];
sui.controls.MapControl.prototype = {
	el: null
	,tbody: null
	,addButton: null
	,defaultValue: null
	,streams: null
	,createMap: null
	,createKeyControl: null
	,createValueControl: null
	,length: null
	,values: null
	,elements: null
	,addControl: function(key,value) {
		var _g = this;
		var o = { controlKey : this.createKeyControl(key), controlValue : this.createValueControl(value), el : dots.Html.parseNodes("<tr class=\"sui-map-item\">\n<td class=\"sui-map-key\"></td>\n<td class=\"sui-map-value\"></td>\n<td class=\"sui-remove\"><i class=\"sui-icon sui-icon-remove\"></i></td>\n</tr>")[0], index : this.length++};
		this.tbody.appendChild(o.el);
		var removeElement = dots.Query.first(".sui-icon-remove",o.el);
		var controlKeyContainer = dots.Query.first(".sui-map-key",o.el);
		var controlValueContainer = dots.Query.first(".sui-map-value",o.el);
		controlKeyContainer.appendChild(o.controlKey.el);
		controlValueContainer.appendChild(o.controlValue.el);
		thx.stream.dom.Dom.streamEvent(removeElement,"click",false).subscribe(function(_) {
			_g.tbody.removeChild(o.el);
			_g.elements.splice(o.index,1);
			var _g2 = o.index;
			var _g1 = _g.elements.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.elements[i].index--;
			}
			_g.length--;
			_g.updateValue();
		});
		this.elements.push(o);
		o.controlKey.streams.value.toNil().merge(o.controlValue.streams.value.toNil()).subscribe(function(_1) {
			_g.updateValue();
		});
		o.controlKey.streams.focused.merge(o.controlValue.streams.focused).subscribe(thx.stream.dom.Dom.subscribeToggleClass(o.el,"sui-focus"));
		o.controlKey.streams.focused.merge(o.controlValue.streams.focused).feed(this.values.focused);
	}
	,setValue: function(v) {
		var _g = this;
		thx.core.Iterators.map(v.keys(),function(_) {
			_g.addControl(_,v.get(_));
			return;
		});
	}
	,getValue: function() {
		var map = this.createMap();
		this.elements.map(function(o) {
			var k = o.controlKey.get();
			var v = o.controlValue.get();
			if(k == null || map.exists(k)) {
				o.controlKey.el.classList.add("sui-invalid");
				return;
			}
			o.controlKey.el.classList.remove("sui-invalid");
			map.set(k,v);
		});
		return map;
	}
	,updateValue: function() {
		this.values.value.set(this.getValue());
	}
	,set: function(v) {
		this.clear();
		this.setValue(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		if(this.elements.length > 0) thx.core.Arrays.last(this.elements).controlValue.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		(function(_) {
			if(null == _) null; else el.blur();
			return;
		})(thx.core.Arrays.first(this.elements.filter(function(_1) {
			return _1.controlKey.el == el || _1.controlValue.el == el;
		})));
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,clear: function() {
		var _g = this;
		this.length = 0;
		this.elements.map(function(item) {
			_g.tbody.removeChild(item.el);
		});
		this.elements = [];
	}
	,__class__: sui.controls.MapControl
};
sui.controls.NumberSelectControl = function(defaultValue,options) {
	sui.controls.SelectControl.call(this,defaultValue,"select-number",options);
};
sui.controls.NumberSelectControl.__name__ = ["sui","controls","NumberSelectControl"];
sui.controls.NumberSelectControl.__super__ = sui.controls.SelectControl;
sui.controls.NumberSelectControl.prototype = $extend(sui.controls.SelectControl.prototype,{
	__class__: sui.controls.NumberSelectControl
});
sui.controls.DateKind = { __ename__ : ["sui","controls","DateKind"], __constructs__ : ["DateOnly","DateTime"] };
sui.controls.DateKind.DateOnly = ["DateOnly",0];
sui.controls.DateKind.DateOnly.__enum__ = sui.controls.DateKind;
sui.controls.DateKind.DateTime = ["DateTime",1];
sui.controls.DateKind.DateTime.__enum__ = sui.controls.DateKind;
sui.controls.FloatKind = { __ename__ : ["sui","controls","FloatKind"], __constructs__ : ["FloatNumber","FloatTime"] };
sui.controls.FloatKind.FloatNumber = ["FloatNumber",0];
sui.controls.FloatKind.FloatNumber.__enum__ = sui.controls.FloatKind;
sui.controls.FloatKind.FloatTime = ["FloatTime",1];
sui.controls.FloatKind.FloatTime.__enum__ = sui.controls.FloatKind;
sui.controls.TextKind = { __ename__ : ["sui","controls","TextKind"], __constructs__ : ["TextEmail","TextPassword","TextSearch","TextTel","PlainText","TextUrl"] };
sui.controls.TextKind.TextEmail = ["TextEmail",0];
sui.controls.TextKind.TextEmail.__enum__ = sui.controls.TextKind;
sui.controls.TextKind.TextPassword = ["TextPassword",1];
sui.controls.TextKind.TextPassword.__enum__ = sui.controls.TextKind;
sui.controls.TextKind.TextSearch = ["TextSearch",2];
sui.controls.TextKind.TextSearch.__enum__ = sui.controls.TextKind;
sui.controls.TextKind.TextTel = ["TextTel",3];
sui.controls.TextKind.TextTel.__enum__ = sui.controls.TextKind;
sui.controls.TextKind.PlainText = ["PlainText",4];
sui.controls.TextKind.PlainText.__enum__ = sui.controls.TextKind;
sui.controls.TextKind.TextUrl = ["TextUrl",5];
sui.controls.TextKind.TextUrl.__enum__ = sui.controls.TextKind;
sui.controls.PasswordControl = function(value,options) {
	sui.controls.BaseTextControl.call(this,value,"text","password",options);
};
sui.controls.PasswordControl.__name__ = ["sui","controls","PasswordControl"];
sui.controls.PasswordControl.__super__ = sui.controls.BaseTextControl;
sui.controls.PasswordControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.PasswordControl
});
sui.controls.SearchControl = function(value,options) {
	if(null == options) options = { };
	sui.controls.BaseTextControl.call(this,value,"search","search",options);
};
sui.controls.SearchControl.__name__ = ["sui","controls","SearchControl"];
sui.controls.SearchControl.__super__ = sui.controls.BaseTextControl;
sui.controls.SearchControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.SearchControl
});
sui.controls.TelControl = function(value,options) {
	if(null == options) options = { };
	sui.controls.BaseTextControl.call(this,value,"tel","tel",options);
};
sui.controls.TelControl.__name__ = ["sui","controls","TelControl"];
sui.controls.TelControl.__super__ = sui.controls.BaseTextControl;
sui.controls.TelControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.TelControl
});
sui.controls.TextControl = function(value,options) {
	sui.controls.BaseTextControl.call(this,value,"text","text",options);
};
sui.controls.TextControl.__name__ = ["sui","controls","TextControl"];
sui.controls.TextControl.__super__ = sui.controls.BaseTextControl;
sui.controls.TextControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.TextControl
});
sui.controls.TextSelectControl = function(defaultValue,options) {
	sui.controls.SelectControl.call(this,defaultValue,"select-text",options);
};
sui.controls.TextSelectControl.__name__ = ["sui","controls","TextSelectControl"];
sui.controls.TextSelectControl.__super__ = sui.controls.SelectControl;
sui.controls.TextSelectControl.prototype = $extend(sui.controls.SelectControl.prototype,{
	__class__: sui.controls.TextSelectControl
});
sui.controls.TimeControl = function(value,options) {
	if(null == options) options = { };
	sui.controls.SingleInputControl.call(this,value,"input","time","time",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min",sui.controls.TimeControl.timeToString(options.min));
	if(null != options.max) this.input.setAttribute("max",sui.controls.TimeControl.timeToString(options.max));
	if(null != options.list) new sui.controls.DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : sui.controls.TimeControl.timeToString(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui.controls.DataList(this.el,options.values.map(function(o1) {
		return { label : sui.controls.TimeControl.timeToString(o1), value : sui.controls.TimeControl.timeToString(o1)};
	})).applyTo(this.input);
};
sui.controls.TimeControl.__name__ = ["sui","controls","TimeControl"];
sui.controls.TimeControl.timeToString = function(t) {
	var h = Math.floor(t / 3600000);
	t -= h * 3600000;
	var m = Math.floor(t / 60000);
	t -= m * 60000;
	var s = t / 1000;
	var hh = StringTools.lpad("" + h,"0",2);
	var mm = StringTools.lpad("" + m,"0",2);
	var ss;
	ss = (s >= 10?"":"0") + s;
	return "" + hh + ":" + mm + ":" + ss;
};
sui.controls.TimeControl.stringToTime = function(t) {
	var p = t.split(":");
	var h = Std.parseInt(p[0]);
	var m = Std.parseInt(p[1]);
	var s = parseFloat(p[2]);
	return s * 1000 + m * 60000 + h * 3600000;
};
sui.controls.TimeControl.__super__ = sui.controls.SingleInputControl;
sui.controls.TimeControl.prototype = $extend(sui.controls.SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.value = sui.controls.TimeControl.timeToString(v);
	}
	,getInput: function() {
		return sui.controls.TimeControl.stringToTime(this.input.value);
	}
	,__class__: sui.controls.TimeControl
});
sui.controls.TriggerControl = function(label,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-trigger\"><button>" + label + "</button></div>";
	if(null == options) options = { };
	this.defaultValue = thx.core.Nil.nil;
	this.el = dots.Html.parseNodes(template)[0];
	this.button = dots.Query.first("button",this.el);
	this.values = new sui.controls.ControlValues(thx.core.Nil.nil);
	var emitter = thx.stream.dom.Dom.streamEvent(this.button,"click",false).toNil();
	this.streams = new sui.controls.ControlStreams(emitter,this.values.focused,this.values.enabled);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.button.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.button.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx.stream.dom.Dom.streamFocus(this.button).feed(this.values.focused);
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui.controls.TriggerControl.__name__ = ["sui","controls","TriggerControl"];
sui.controls.TriggerControl.__interfaces__ = [sui.controls.IControl];
sui.controls.TriggerControl.prototype = {
	el: null
	,button: null
	,defaultValue: null
	,streams: null
	,values: null
	,set: function(v) {
		this.button.click();
	}
	,get: function() {
		return thx.core.Nil.nil;
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.button.focus();
	}
	,blur: function() {
		this.button.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui.controls.TriggerControl
};
sui.controls.UrlControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.placeholder) options.placeholder = "http://example.com";
	sui.controls.BaseTextControl.call(this,value,"url","url",options);
};
sui.controls.UrlControl.__name__ = ["sui","controls","UrlControl"];
sui.controls.UrlControl.__super__ = sui.controls.BaseTextControl;
sui.controls.UrlControl.prototype = $extend(sui.controls.BaseTextControl.prototype,{
	__class__: sui.controls.UrlControl
});
sui.macro = {};
sui.macro.Embed = function() { };
sui.macro.Embed.__name__ = ["sui","macro","Embed"];
var thx = {};
thx.color = {};
thx.color._CIELCh = {};
thx.color._CIELCh.CIELCh_Impl_ = {};
thx.color._CIELCh.CIELCh_Impl_.__name__ = ["thx","color","_CIELCh","CIELCh_Impl_"];
thx.color._CIELCh.CIELCh_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cielch":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._CIELCh.CIELCh_Impl_.fromFloats = function(l,c,h) {
	return [l,c,h];
};
thx.color._CIELCh.CIELCh_Impl_._new = function(channels) {
	return channels;
};
thx.color._CIELCh.CIELCh_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._CIELCh.CIELCh_Impl_.toString = function(this1) {
	return "CIELCh(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx.color._CIELCh.CIELCh_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._CIELCh.CIELCh_Impl_.toCIELab = function(this1) {
	var hradi = this1[2] * (Math.PI / 180);
	var a = Math.cos(hradi) * this1[1];
	var b = Math.sin(hradi) * this1[1];
	return [this1[0],a,b];
};
thx.color._CIELCh.CIELCh_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY((function($this) {
		var $r;
		var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
		$r = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
		return $r;
	}(this)));
};
thx.color._CIELCh.CIELCh_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK((function($this) {
		var $r;
		var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
		$r = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
		return $r;
	}(this)));
};
thx.color._CIELCh.CIELCh_Impl_.toGrey = function(this1) {
	var this2;
	var this4 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
	this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this4));
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._CIELCh.CIELCh_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL((function($this) {
		var $r;
		var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
		$r = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
		return $r;
	}(this)));
};
thx.color._CIELCh.CIELCh_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV((function($this) {
		var $r;
		var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
		$r = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
		return $r;
	}(this)));
};
thx.color._CIELCh.CIELCh_Impl_.toRGB = function(this1) {
	var this2;
	var this3 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
	this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this3));
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._CIELCh.CIELCh_Impl_.toRGBX = function(this1) {
	var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
	return thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
};
thx.color._CIELCh.CIELCh_Impl_.toXYZ = function(this1) {
	return thx.color._CIELab.CIELab_Impl_.toXYZ(thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1));
};
thx.color._CIELCh.CIELCh_Impl_.toYxy = function(this1) {
	var this2 = thx.color._CIELCh.CIELCh_Impl_.toCIELab(this1);
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._CIELab.CIELab_Impl_.toXYZ(this2));
};
thx.color._CIELCh.CIELCh_Impl_.get_l = function(this1) {
	return this1[0];
};
thx.color._CIELCh.CIELCh_Impl_.get_c = function(this1) {
	return this1[1];
};
thx.color._CIELCh.CIELCh_Impl_.get_h = function(this1) {
	return this1[2];
};
thx.color._CIELab = {};
thx.color._CIELab.CIELab_Impl_ = {};
thx.color._CIELab.CIELab_Impl_.__name__ = ["thx","color","_CIELab","CIELab_Impl_"];
thx.color._CIELab.CIELab_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cielab":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._CIELab.CIELab_Impl_.fromFloats = function(l,a,b) {
	return [l,a,b];
};
thx.color._CIELab.CIELab_Impl_._new = function(channels) {
	return channels;
};
thx.color._CIELab.CIELab_Impl_.distance = function(this1,other) {
	return Math.sqrt((this1[0] - other[0]) * (this1[0] - other[0]) + (this1[1] - other[1]) * (this1[1] - other[1]) + (this1[2] - other[2]) * (this1[2] - other[2]));
};
thx.color._CIELab.CIELab_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._CIELab.CIELab_Impl_.darker = function(this1,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],0),this1[1],this1[2]];
	return channels;
};
thx.color._CIELab.CIELab_Impl_.lighter = function(this1,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],100),this1[1],this1[2]];
	return channels;
};
thx.color._CIELab.CIELab_Impl_.match = function(this1,palette) {
	var it = palette;
	if(null == it) throw new thx.core.error.NullArgument("Iterable argument \"palette\" cannot be null",{ fileName : "NullArgument.hx", lineNumber : 73, className : "thx.color._CIELab.CIELab_Impl_", methodName : "match"}); else if(!$iterator(it)().hasNext()) throw new thx.core.error.NullArgument("Iterable argument \"palette\" cannot be empty",{ fileName : "NullArgument.hx", lineNumber : 75, className : "thx.color._CIELab.CIELab_Impl_", methodName : "match"});
	var dist = Infinity;
	var closest = null;
	var $it0 = $iterator(palette)();
	while( $it0.hasNext() ) {
		var color = $it0.next();
		var ndist = thx.color._CIELab.CIELab_Impl_.distance(this1,color);
		if(ndist < dist) {
			dist = ndist;
			closest = color;
		}
	}
	return closest;
};
thx.color._CIELab.CIELab_Impl_.withLightness = function(this1,lightness) {
	return [lightness,this1[1],this1[2]];
};
thx.color._CIELab.CIELab_Impl_.toString = function(this1) {
	return "CIELab(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx.color._CIELab.CIELab_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._CIELab.CIELab_Impl_.toCIELCh = function(this1) {
	var h = thx.core.Floats.wrapCircular(Math.atan2(this1[2],this1[1]) * 180 / Math.PI,360);
	var c = Math.sqrt(this1[1] * this1[1] + this1[2] * this1[2]);
	return [this1[0],c,h];
};
thx.color._CIELab.CIELab_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1)));
};
thx.color._CIELab.CIELab_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1)));
};
thx.color._CIELab.CIELab_Impl_.toGrey = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1));
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._CIELab.CIELab_Impl_.toHSL = function(this1) {
	var this2 = thx.color._RGBX.RGBX_Impl_.toHSL(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1)));
	return thx.color._RGBX.RGBX_Impl_.toHSV((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this2[0] + 120,this2[1],this2[2]),thx.color._HSL.HSL_Impl_._c(this2[0],this2[1],this2[2]),thx.color._HSL.HSL_Impl_._c(this2[0] - 120,this2[1],this2[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._CIELab.CIELab_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1)));
};
thx.color._CIELab.CIELab_Impl_.toRGB = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1));
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._CIELab.CIELab_Impl_.toRGBX = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._CIELab.CIELab_Impl_.toXYZ(this1));
};
thx.color._CIELab.CIELab_Impl_.toXYZ = function(this1) {
	var y = (this1[0] + 16) / 116;
	var x = this1[1] / 500 + y;
	var z = y - this1[2] / 200;
	var p;
	p = Math.pow(y,3);
	if(p > 0.008856) y = p; else y = (y - 0.137931034482758619) / 7.787;
	p = Math.pow(x,3);
	if(p > 0.008856) x = p; else x = (x - 0.137931034482758619) / 7.787;
	p = Math.pow(z,3);
	if(p > 0.008856) z = p; else z = (z - 0.137931034482758619) / 7.787;
	return [95.047 * x,100 * y,108.883 * z];
};
thx.color._CIELab.CIELab_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._CIELab.CIELab_Impl_.toXYZ(this1));
};
thx.color._CIELab.CIELab_Impl_.get_l = function(this1) {
	return this1[0];
};
thx.color._CIELab.CIELab_Impl_.get_a = function(this1) {
	return this1[1];
};
thx.color._CIELab.CIELab_Impl_.get_b = function(this1) {
	return this1[2];
};
thx.color._CMY = {};
thx.color._CMY.CMY_Impl_ = {};
thx.color._CMY.CMY_Impl_.__name__ = ["thx","color","_CMY","CMY_Impl_"];
thx.color._CMY.CMY_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmy":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,4);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._CMY.CMY_Impl_.fromFloats = function(cyan,magenta,yellow) {
	return [cyan < 0?0:cyan > 1?1:cyan,magenta < 0?0:magenta > 1?1:magenta,yellow < 0?0:yellow > 1?1:yellow];
};
thx.color._CMY.CMY_Impl_._new = function(channels) {
	return channels;
};
thx.color._CMY.CMY_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._CMY.CMY_Impl_.toString = function(this1) {
	return "cmy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx.color._CMY.CMY_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._CMY.CMY_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab([1 - this1[0],1 - this1[1],1 - this1[2]]);
};
thx.color._CMY.CMY_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh([1 - this1[0],1 - this1[1],1 - this1[2]]);
};
thx.color._CMY.CMY_Impl_.toCMYK = function(this1) {
	var k = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	if(k == 1) return [0,0,0,1]; else return [(this1[0] - k) / (1 - k),(this1[1] - k) / (1 - k),(this1[2] - k) / (1 - k),k];
};
thx.color._CMY.CMY_Impl_.toGrey = function(this1) {
	var this_0 = 1 - this1[0];
	var this_1 = 1 - this1[1];
	var this_2 = 1 - this1[2];
	var grey = this_0 * .2126 + this_1 * .7152 + this_2 * .0722;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._CMY.CMY_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL([1 - this1[0],1 - this1[1],1 - this1[2]]);
};
thx.color._CMY.CMY_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV([1 - this1[0],1 - this1[1],1 - this1[2]]);
};
thx.color._CMY.CMY_Impl_.toRGB = function(this1) {
	var this_0 = 1 - this1[0];
	var this_1 = 1 - this1[1];
	var this_2 = 1 - this1[2];
	return thx.color._RGB.RGB_Impl_.fromFloats(this_0,this_1,this_2);
};
thx.color._CMY.CMY_Impl_.toRGBX = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx.color._CMY.CMY_Impl_.toRGBXA = function(this1) {
	var channels = [1 - this1[0],1 - this1[1],1 - this1[2]].concat([1.0]);
	return channels;
};
thx.color._CMY.CMY_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ([1 - this1[0],1 - this1[1],1 - this1[2]]);
};
thx.color._CMY.CMY_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ([1 - this1[0],1 - this1[1],1 - this1[2]]));
};
thx.color._CMY.CMY_Impl_.get_cyan = function(this1) {
	return this1[0];
};
thx.color._CMY.CMY_Impl_.get_magenta = function(this1) {
	return this1[1];
};
thx.color._CMY.CMY_Impl_.get_yellow = function(this1) {
	return this1[2];
};
thx.color._CMYK = {};
thx.color._CMYK.CMYK_Impl_ = {};
thx.color._CMYK.CMYK_Impl_.__name__ = ["thx","color","_CMYK","CMYK_Impl_"];
thx.color._CMYK.CMYK_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmyk":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,4);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._CMYK.CMYK_Impl_.fromFloats = function(cyan,magenta,yellow,black) {
	return [cyan < 0?0:cyan > 1?1:cyan,magenta < 0?0:magenta > 1?1:magenta,yellow < 0?0:yellow > 1?1:yellow,black < 0?0:black > 1?1:black];
};
thx.color._CMYK.CMYK_Impl_._new = function(channels) {
	return channels;
};
thx.color._CMYK.CMYK_Impl_.darker = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx.color._CMYK.CMYK_Impl_.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx.color._CMYK.CMYK_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2]),thx.core.Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx.color._CMYK.CMYK_Impl_.toString = function(this1) {
	return "cmyk(" + this1[0] + "," + this1[1] + "," + this1[2] + "," + this1[3] + ")";
};
thx.color._CMYK.CMYK_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2] && this1[3] == other[3];
};
thx.color._CMYK.CMYK_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]);
};
thx.color._CMYK.CMYK_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]);
};
thx.color._CMYK.CMYK_Impl_.toCMY = function(this1) {
	return [this1[3] + (1 - this1[3]) * this1[0],this1[3] + (1 - this1[3]) * this1[1],this1[3] + (1 - this1[3]) * this1[2]];
};
thx.color._CMYK.CMYK_Impl_.toGrey = function(this1) {
	var this_0 = (1 - this1[3]) * (1 - this1[0]);
	var this_1 = (1 - this1[3]) * (1 - this1[1]);
	var this_2 = (1 - this1[3]) * (1 - this1[2]);
	var grey = this_0 * .2126 + this_1 * .7152 + this_2 * .0722;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._CMYK.CMYK_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]);
};
thx.color._CMYK.CMYK_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]);
};
thx.color._CMYK.CMYK_Impl_.toRGB = function(this1) {
	var this_0 = (1 - this1[3]) * (1 - this1[0]);
	var this_1 = (1 - this1[3]) * (1 - this1[1]);
	var this_2 = (1 - this1[3]) * (1 - this1[2]);
	return thx.color._RGB.RGB_Impl_.fromFloats(this_0,this_1,this_2);
};
thx.color._CMYK.CMYK_Impl_.toRGBX = function(this1) {
	return [(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])];
};
thx.color._CMYK.CMYK_Impl_.toRGBXA = function(this1) {
	var channels = [(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])].concat([1.0]);
	return channels;
};
thx.color._CMYK.CMYK_Impl_.get_cyan = function(this1) {
	return this1[0];
};
thx.color._CMYK.CMYK_Impl_.get_magenta = function(this1) {
	return this1[1];
};
thx.color._CMYK.CMYK_Impl_.get_yellow = function(this1) {
	return this1[2];
};
thx.color._CMYK.CMYK_Impl_.get_black = function(this1) {
	return this1[3];
};
thx.color._CMYK.CMYK_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]);
};
thx.color._CMYK.CMYK_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ([(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])]));
};
thx.color._Grey = {};
thx.color._Grey.Grey_Impl_ = {};
thx.color._Grey.Grey_Impl_.__name__ = ["thx","color","_Grey","Grey_Impl_"];
thx.color._Grey.Grey_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "grey":case "gray":
			var grey = thx.color.parse.ColorParser.getFloatChannels(info.channels,1)[0];
			var this1;
			if(grey < 0) this1 = 0; else if(grey > 1) this1 = 1; else this1 = grey;
			return this1;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._Grey.Grey_Impl_._new = function(grey) {
	var this1;
	if(grey < 0) this1 = 0; else if(grey > 1) this1 = 1; else this1 = grey;
	return this1;
};
thx.color._Grey.Grey_Impl_.contrast = function(this1) {
	if(this1 > 0.5) return thx.color._Grey.Grey_Impl_.black; else return thx.color._Grey.Grey_Impl_.white;
};
thx.color._Grey.Grey_Impl_.darker = function(this1,t) {
	var grey = thx.core.Floats.interpolate(t,this1,0);
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._Grey.Grey_Impl_.lighter = function(this1,t) {
	var grey = thx.core.Floats.interpolate(t,this1,1);
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._Grey.Grey_Impl_.interpolate = function(this1,other,t) {
	var grey = thx.core.Floats.interpolate(t,this1,other);
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._Grey.Grey_Impl_.toString = function(this1) {
	return "grey(" + this1 * 100 + "%)";
};
thx.color._Grey.Grey_Impl_.equals = function(this1,other) {
	return this1 == other;
};
thx.color._Grey.Grey_Impl_.get_grey = function(this1) {
	return this1;
};
thx.color._Grey.Grey_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toRGB = function(this1) {
	var this_0 = this1;
	var this_1 = this1;
	var this_2 = this1;
	return thx.color._RGB.RGB_Impl_.fromFloats(this_0,this_1,this_2);
};
thx.color._Grey.Grey_Impl_.toRGBX = function(this1) {
	return [this1,this1,this1];
};
thx.color._Grey.Grey_Impl_.toRGBXA = function(this1) {
	var channels = [this1,this1,this1].concat([1.0]);
	return channels;
};
thx.color._Grey.Grey_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ([this1,this1,this1]);
};
thx.color._Grey.Grey_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ([this1,this1,this1]));
};
thx.color._HSL = {};
thx.color._HSL.HSL_Impl_ = {};
thx.color._HSL.HSL_Impl_.__name__ = ["thx","color","_HSL","HSL_Impl_"];
thx.color._HSL.HSL_Impl_.create = function(hue,saturation,lightness) {
	var channels = [thx.core.Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness];
	return channels;
};
thx.color._HSL.HSL_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._HSL.HSL_Impl_.fromFloats = function(hue,saturation,lightness) {
	return [hue,saturation,lightness];
};
thx.color._HSL.HSL_Impl_._new = function(channels) {
	return channels;
};
thx.color._HSL.HSL_Impl_.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx.color._HSL.HSL_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSL.HSL_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSL.HSL_Impl_.complement = function(this1) {
	return thx.color._HSL.HSL_Impl_.rotate(this1,180);
};
thx.color._HSL.HSL_Impl_.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx.core.Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx.color._HSL.HSL_Impl_.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx.core.Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx.color._HSL.HSL_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._HSL.HSL_Impl_.rotate = function(this1,angle) {
	return thx.color._HSL.HSL_Impl_.create(this1[0] + angle,this1[1],this1[2]);
};
thx.color._HSL.HSL_Impl_.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx.color._HSL.HSL_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSL.HSL_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSL.HSL_Impl_.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx.color._HSL.HSL_Impl_.toCSS3 = function(this1) {
	return "hsl(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx.color._HSL.HSL_Impl_.toString = function(this1) {
	return "hsl(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx.color._HSL.HSL_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._HSL.HSL_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toGrey = function(this1) {
	var this2;
	var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
	this2 = channels;
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._HSL.HSL_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toRGB = function(this1) {
	var this2;
	var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
	this2 = channels;
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._HSL.HSL_Impl_.toRGBX = function(this1) {
	var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
	return channels;
};
thx.color._HSL.HSL_Impl_.toRGBXA = function(this1) {
	var this2;
	var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
	this2 = channels;
	var channels1 = this2.concat([1.0]);
	return channels1;
};
thx.color._HSL.HSL_Impl_.toHSLA = function(this1) {
	var channels = this1.concat([1.0]);
	return channels;
};
thx.color._HSL.HSL_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ((function($this) {
		var $r;
		var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSL.HSL_Impl_.toYxy = function(this1) {
	var this2;
	var channels = [thx.color._HSL.HSL_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSL.HSL_Impl_._c(this1[0] - 120,this1[1],this1[2])];
	this2 = channels;
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ(this2));
};
thx.color._HSL.HSL_Impl_.get_hue = function(this1) {
	return this1[0];
};
thx.color._HSL.HSL_Impl_.get_huef = function(this1) {
	return this1[0];
};
thx.color._HSL.HSL_Impl_.get_saturation = function(this1) {
	return this1[1];
};
thx.color._HSL.HSL_Impl_.get_lightness = function(this1) {
	return this1[2];
};
thx.color._HSL.HSL_Impl_._c = function(d,s,l) {
	var m2;
	if(l <= 0.5) m2 = l * (1 + s); else m2 = l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx.core.Floats.wrapCircular(d,360);
	if(d < 60) return m1 + (m2 - m1) * d / 60; else if(d < 180) return m2; else if(d < 240) return m1 + (m2 - m1) * (240 - d) / 60; else return m1;
};
thx.color._HSLA = {};
thx.color._HSLA.HSLA_Impl_ = {};
thx.color._HSLA.HSLA_Impl_.__name__ = ["thx","color","_HSLA","HSLA_Impl_"];
thx.color._HSLA.HSLA_Impl_.create = function(hue,saturation,lightness,alpha) {
	var channels = [thx.core.Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness,alpha < 0?0:alpha > 1?1:alpha];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			var this1;
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			this1 = channels;
			var channels1 = this1.concat([1.0]);
			return channels1;
		case "hsla":
			var channels2 = thx.color.parse.ColorParser.getFloatChannels(info.channels,4);
			return channels2;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._HSLA.HSLA_Impl_.fromFloats = function(hue,saturation,lightness,alpha) {
	return [hue,saturation,lightness,alpha];
};
thx.color._HSLA.HSLA_Impl_._new = function(channels) {
	return channels;
};
thx.color._HSLA.HSLA_Impl_.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx.color._HSLA.HSLA_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSLA.HSLA_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSLA.HSLA_Impl_.complement = function(this1) {
	return thx.color._HSLA.HSLA_Impl_.rotate(this1,180);
};
thx.color._HSLA.HSLA_Impl_.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx.core.Floats.interpolate(t,this1[2],0),this1[3]];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx.core.Floats.interpolate(t,this1[2],1),this1[3]];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2]),thx.core.Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.rotate = function(this1,angle) {
	return thx.color._HSLA.HSLA_Impl_.create(this1[0] + angle,this1[1],this1[2],this1[3]);
};
thx.color._HSLA.HSLA_Impl_.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx.color._HSLA.HSLA_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSLA.HSLA_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSLA.HSLA_Impl_.toCSS3 = function(this1) {
	return "hsla(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx.color._HSLA.HSLA_Impl_.toString = function(this1) {
	return "hsla(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx.color._HSLA.HSLA_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2] && this1[3] == other[3];
};
thx.color._HSLA.HSLA_Impl_.toHSL = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx.color._HSLA.HSLA_Impl_.toHSVA = function(this1) {
	return thx.color._RGBXA.RGBXA_Impl_.toHSVA((function($this) {
		var $r;
		var channels = [thx.color._HSLA.HSLA_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
		$r = channels;
		return $r;
	}(this)));
};
thx.color._HSLA.HSLA_Impl_.toRGB = function(this1) {
	var this2;
	var channels = [thx.color._HSLA.HSLA_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
	this2 = channels;
	var this3;
	var channels1 = this2.slice(0,3);
	this3 = channels1;
	return thx.color._RGB.RGB_Impl_.fromFloats(this3[0],this3[1],this3[2]);
};
thx.color._HSLA.HSLA_Impl_.toRGBXA = function(this1) {
	var channels = [thx.color._HSLA.HSLA_Impl_._c(this1[0] + 120,this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0],this1[1],this1[2]),thx.color._HSLA.HSLA_Impl_._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
	return channels;
};
thx.color._HSLA.HSLA_Impl_.get_hue = function(this1) {
	return this1[0];
};
thx.color._HSLA.HSLA_Impl_.get_huef = function(this1) {
	return this1[0];
};
thx.color._HSLA.HSLA_Impl_.get_saturation = function(this1) {
	return this1[1];
};
thx.color._HSLA.HSLA_Impl_.get_lightness = function(this1) {
	return this1[2];
};
thx.color._HSLA.HSLA_Impl_.get_alpha = function(this1) {
	return this1[3];
};
thx.color._HSLA.HSLA_Impl_._c = function(d,s,l) {
	var m2;
	if(l <= 0.5) m2 = l * (1 + s); else m2 = l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx.core.Floats.wrapCircular(d,360);
	if(d < 60) return m1 + (m2 - m1) * d / 60; else if(d < 180) return m2; else if(d < 240) return m1 + (m2 - m1) * (240 - d) / 60; else return m1;
};
thx.color._HSV = {};
thx.color._HSV.HSV_Impl_ = {};
thx.color._HSV.HSV_Impl_.__name__ = ["thx","color","_HSV","HSV_Impl_"];
thx.color._HSV.HSV_Impl_.create = function(hue,saturation,lightness) {
	var channels = [thx.core.Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness];
	return channels;
};
thx.color._HSV.HSV_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._HSV.HSV_Impl_.fromFloats = function(hue,saturation,value) {
	return [hue,saturation,value];
};
thx.color._HSV.HSV_Impl_._new = function(channels) {
	return channels;
};
thx.color._HSV.HSV_Impl_.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx.color._HSV.HSV_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSV.HSV_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSV.HSV_Impl_.complement = function(this1) {
	return thx.color._HSV.HSV_Impl_.rotate(this1,180);
};
thx.color._HSV.HSV_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._HSV.HSV_Impl_.rotate = function(this1,angle) {
	return thx.color._HSV.HSV_Impl_.create(this1[0] + angle,this1[1],this1[2]);
};
thx.color._HSV.HSV_Impl_.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx.color._HSV.HSV_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSV.HSV_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSV.HSV_Impl_.toString = function(this1) {
	return "hsv(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx.color._HSV.HSV_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._HSV.HSV_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toGrey = function(this1) {
	var this2;
	if(this1[1] == 0) this2 = [this1[2],this1[2],this1[2]]; else {
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		this2 = [r,g,b];
	}
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._HSV.HSV_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toHSVA = function(this1) {
	var channels = this1.concat([1.0]);
	return channels;
};
thx.color._HSV.HSV_Impl_.toRGB = function(this1) {
	var this2;
	if(this1[1] == 0) this2 = [this1[2],this1[2],this1[2]]; else {
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		this2 = [r,g,b];
	}
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._HSV.HSV_Impl_.toRGBX = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b];
};
thx.color._HSV.HSV_Impl_.toRGBXA = function(this1) {
	var this2;
	if(this1[1] == 0) this2 = [this1[2],this1[2],this1[2]]; else {
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		this2 = [r,g,b];
	}
	var channels = this2.concat([1.0]);
	return channels;
};
thx.color._HSV.HSV_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ(this1[1] == 0?[this1[2],this1[2],this1[2]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b];
		return $r;
	}(this)));
};
thx.color._HSV.HSV_Impl_.toYxy = function(this1) {
	var this2;
	if(this1[1] == 0) this2 = [this1[2],this1[2],this1[2]]; else {
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		this2 = [r,g,b];
	}
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ(this2));
};
thx.color._HSV.HSV_Impl_.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx.color._HSV.HSV_Impl_.get_hue = function(this1) {
	return this1[0];
};
thx.color._HSV.HSV_Impl_.get_huef = function(this1) {
	return this1[0];
};
thx.color._HSV.HSV_Impl_.get_saturation = function(this1) {
	return this1[1];
};
thx.color._HSV.HSV_Impl_.get_value = function(this1) {
	return this1[2];
};
thx.color._HSVA = {};
thx.color._HSVA.HSVA_Impl_ = {};
thx.color._HSVA.HSVA_Impl_.__name__ = ["thx","color","_HSVA","HSVA_Impl_"];
thx.color._HSVA.HSVA_Impl_.create = function(hue,saturation,value,alpha) {
	var channels = [thx.core.Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,value < 0?0:value > 1?1:value,alpha < 0?0:alpha > 1?1:alpha];
	return channels;
};
thx.color._HSVA.HSVA_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			var this1;
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			this1 = channels;
			var channels1 = this1.concat([1.0]);
			return channels1;
		case "hsva":
			var channels2 = thx.color.parse.ColorParser.getFloatChannels(info.channels,4);
			return channels2;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._HSVA.HSVA_Impl_.fromFloats = function(hue,saturation,value,alpha) {
	return [hue,saturation,value,alpha];
};
thx.color._HSVA.HSVA_Impl_._new = function(channels) {
	return channels;
};
thx.color._HSVA.HSVA_Impl_.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx.color._HSVA.HSVA_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSVA.HSVA_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSVA.HSVA_Impl_.complement = function(this1) {
	return thx.color._HSVA.HSVA_Impl_.rotate(this1,180);
};
thx.color._HSVA.HSVA_Impl_.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx.color._HSVA.HSVA_Impl_.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx.color._HSVA.HSVA_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2]),thx.core.Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx.color._HSVA.HSVA_Impl_.rotate = function(this1,angle) {
	return thx.color._HSVA.HSVA_Impl_.create(this1[0] + angle,this1[1],this1[2],this1[3]);
};
thx.color._HSVA.HSVA_Impl_.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx.color._HSVA.HSVA_Impl_.rotate(this1,-spread);
	var _1 = thx.color._HSVA.HSVA_Impl_.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx.color._HSVA.HSVA_Impl_.toString = function(this1) {
	return "hsva(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx.color._HSVA.HSVA_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2] && this1[3] == other[3];
};
thx.color._HSVA.HSVA_Impl_.toHSV = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx.color._HSVA.HSVA_Impl_.toHSLA = function(this1) {
	return thx.color._RGBXA.RGBXA_Impl_.toHSLA(this1[1] == 0?[this1[2],this1[2],this1[2],this1[3]]:(function($this) {
		var $r;
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		$r = [r,g,b,this1[3]];
		return $r;
	}(this)));
};
thx.color._HSVA.HSVA_Impl_.toRGB = function(this1) {
	var this2;
	if(this1[1] == 0) this2 = [this1[2],this1[2],this1[2],this1[3]]; else {
		var r;
		var g;
		var b;
		var i;
		var f;
		var p;
		var q;
		var t;
		var h = this1[0] / 60;
		i = Math.floor(h);
		f = h - i;
		p = this1[2] * (1 - this1[1]);
		q = this1[2] * (1 - f * this1[1]);
		t = this1[2] * (1 - (1 - f) * this1[1]);
		switch(i) {
		case 0:
			r = this1[2];
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = this1[2];
			b = p;
			break;
		case 2:
			r = p;
			g = this1[2];
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = this1[2];
			break;
		case 4:
			r = t;
			g = p;
			b = this1[2];
			break;
		default:
			r = this1[2];
			g = p;
			b = q;
		}
		this2 = [r,g,b,this1[3]];
	}
	var this3;
	var channels = this2.slice(0,3);
	this3 = channels;
	return thx.color._RGB.RGB_Impl_.fromFloats(this3[0],this3[1],this3[2]);
};
thx.color._HSVA.HSVA_Impl_.toRGBXA = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2],this1[3]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b,this1[3]];
};
thx.color._HSVA.HSVA_Impl_.get_hue = function(this1) {
	return this1[0];
};
thx.color._HSVA.HSVA_Impl_.get_huef = function(this1) {
	return this1[0];
};
thx.color._HSVA.HSVA_Impl_.get_saturation = function(this1) {
	return this1[1];
};
thx.color._HSVA.HSVA_Impl_.get_value = function(this1) {
	return this1[2];
};
thx.color._HSVA.HSVA_Impl_.get_alpha = function(this1) {
	return this1[3];
};
thx.color._RGB = {};
thx.color._RGB.RGB_Impl_ = {};
thx.color._RGB.RGB_Impl_.__name__ = ["thx","color","_RGB","RGB_Impl_"];
thx.color._RGB.RGB_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseHex(color);
	if(null == info) info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			var arr = thx.color.parse.ColorParser.getInt8Channels(info.channels,3);
			return (arr[0] & 255) << 16 | (arr[1] & 255) << 8 | arr[2] & 255;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._RGB.RGB_Impl_.fromFloats = function(red,green,blue) {
	var red1 = Math.round((red < 0?0:red > 1?1:red) * 255);
	var green1 = Math.round((green < 0?0:green > 1?1:green) * 255);
	var blue1 = Math.round((blue < 0?0:blue > 1?1:blue) * 255);
	return (red1 & 255) << 16 | (green1 & 255) << 8 | blue1 & 255;
};
thx.color._RGB.RGB_Impl_.fromArray = function(arr) {
	return (arr[0] & 255) << 16 | (arr[1] & 255) << 8 | arr[2] & 255;
};
thx.color._RGB.RGB_Impl_.fromInts = function(red,green,blue) {
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx.color._RGB.RGB_Impl_._new = function(rgb) {
	return rgb;
};
thx.color._RGB.RGB_Impl_.darker = function(this1,t) {
	var this2 = thx.color._RGBX.RGBX_Impl_.darker([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255],t);
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._RGB.RGB_Impl_.lighter = function(this1,t) {
	var this2 = thx.color._RGBX.RGBX_Impl_.lighter([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255],t);
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._RGB.RGB_Impl_.interpolate = function(this1,other,t) {
	var this2 = thx.color._RGBX.RGBX_Impl_.interpolate([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255],[(other >> 16 & 255) / 255,(other >> 8 & 255) / 255,(other & 255) / 255],t);
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._RGB.RGB_Impl_.withAlpha = function(this1,alpha) {
	return thx.color._RGBA.RGBA_Impl_.toRGBXA((alpha & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255);
};
thx.color._RGB.RGB_Impl_.toCSS3 = function(this1) {
	return "rgb(" + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) + ")";
};
thx.color._RGB.RGB_Impl_.toString = function(this1) {
	return thx.color._RGB.RGB_Impl_.toHex(this1);
};
thx.color._RGB.RGB_Impl_.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(this1 >> 16 & 255,2) + StringTools.hex(this1 >> 8 & 255,2) + StringTools.hex(this1 & 255,2);
};
thx.color._RGB.RGB_Impl_.equals = function(this1,other) {
	return (this1 >> 16 & 255) == (other >> 16 & 255) && (this1 >> 8 & 255) == (other >> 8 & 255) && (this1 & 255) == (other & 255);
};
thx.color._RGB.RGB_Impl_.toCIELab = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELab([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toCIELCh = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCIELCh([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toGrey = function(this1) {
	var this_0 = (this1 >> 16 & 255) / 255;
	var this_1 = (this1 >> 8 & 255) / 255;
	var this_2 = (this1 & 255) / 255;
	var grey = this_0 * .2126 + this_1 * .7152 + this_2 * .0722;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._RGB.RGB_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.toRGBX = function(this1) {
	return [(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255];
};
thx.color._RGB.RGB_Impl_.toRGBA = function(this1) {
	var this2 = thx.color._RGBA.RGBA_Impl_.toRGBXA(-16777216 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGB.RGB_Impl_.toRGBXA = function(this1) {
	return thx.color._RGBA.RGBA_Impl_.toRGBXA((function($this) {
		var $r;
		var this2 = thx.color._RGBA.RGBA_Impl_.toRGBXA(-16777216 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255);
		$r = thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
		return $r;
	}(this)));
};
thx.color._RGB.RGB_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]));
};
thx.color._RGB.RGB_Impl_.toXYZ = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toXYZ([(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255]);
};
thx.color._RGB.RGB_Impl_.get_red = function(this1) {
	return this1 >> 16 & 255;
};
thx.color._RGB.RGB_Impl_.get_green = function(this1) {
	return this1 >> 8 & 255;
};
thx.color._RGB.RGB_Impl_.get_blue = function(this1) {
	return this1 & 255;
};
thx.color._RGBA = {};
thx.color._RGBA.RGBA_Impl_ = {};
thx.color._RGBA.RGBA_Impl_.__name__ = ["thx","color","_RGBA","RGBA_Impl_"];
thx.color._RGBA.RGBA_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseHex(color);
	if(null == info) info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			var this1;
			var arr = thx.color.parse.ColorParser.getInt8Channels(info.channels,3);
			this1 = (arr[0] & 255) << 16 | (arr[1] & 255) << 8 | arr[2] & 255;
			var this2 = thx.color._RGBA.RGBA_Impl_.toRGBXA(-16777216 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255);
			return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
		case "rgba":
			var arr_0 = thx.color.parse.ColorParser.getInt8Channel(info.channels[0]);
			var arr_1 = thx.color.parse.ColorParser.getInt8Channel(info.channels[1]);
			var arr_2 = thx.color.parse.ColorParser.getInt8Channel(info.channels[2]);
			var arr_3 = Math.round(thx.color.parse.ColorParser.getFloatChannel(info.channels[3]) * 255);
			return (arr_3 & 255) << 24 | (arr_0 & 255) << 16 | (arr_1 & 255) << 8 | arr_2 & 255;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._RGBA.RGBA_Impl_.fromArray = function(arr) {
	return (arr[3] & 255) << 24 | (arr[0] & 255) << 16 | (arr[1] & 255) << 8 | arr[2] & 255;
};
thx.color._RGBA.RGBA_Impl_.fromFloats = function(red,green,blue,alpha) {
	var red1 = Math.round((red < 0?0:red > 1?1:red) * 255);
	var green1 = Math.round((green < 0?0:green > 1?1:green) * 255);
	var blue1 = Math.round((blue < 0?0:blue > 1?1:blue) * 255);
	var alpha1 = Math.round((alpha < 0?0:alpha > 1?1:alpha) * 255);
	return (alpha1 & 255) << 24 | (red1 & 255) << 16 | (green1 & 255) << 8 | blue1 & 255;
};
thx.color._RGBA.RGBA_Impl_.fromInts = function(red,green,blue,alpha) {
	return (alpha & 255) << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx.color._RGBA.RGBA_Impl_.fromInt = function(rgba) {
	return rgba;
};
thx.color._RGBA.RGBA_Impl_._new = function(rgba) {
	return rgba;
};
thx.color._RGBA.RGBA_Impl_.darker = function(this1,t) {
	var this2 = thx.color._RGBXA.RGBXA_Impl_.darker(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1),t);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGBA.RGBA_Impl_.lighter = function(this1,t) {
	var this2 = thx.color._RGBXA.RGBXA_Impl_.lighter(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1),t);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGBA.RGBA_Impl_.transparent = function(this1,t) {
	var this2 = thx.color._RGBXA.RGBXA_Impl_.transparent(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1),t);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGBA.RGBA_Impl_.opaque = function(this1,t) {
	var this2 = thx.color._RGBXA.RGBXA_Impl_.opaque(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1),t);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGBA.RGBA_Impl_.interpolate = function(this1,other,t) {
	var this2 = thx.color._RGBXA.RGBXA_Impl_.interpolate(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1),thx.color._RGBA.RGBA_Impl_.toRGBXA(other),t);
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this2[0],this2[1],this2[2],this2[3]);
};
thx.color._RGBA.RGBA_Impl_.toHSLA = function(this1) {
	return thx.color._RGBXA.RGBXA_Impl_.toHSLA(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1));
};
thx.color._RGBA.RGBA_Impl_.toHSVA = function(this1) {
	return thx.color._RGBXA.RGBXA_Impl_.toHSVA(thx.color._RGBA.RGBA_Impl_.toRGBXA(this1));
};
thx.color._RGBA.RGBA_Impl_.toRGB = function(this1) {
	return (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
};
thx.color._RGBA.RGBA_Impl_.toRGBX = function(this1) {
	return [(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255];
};
thx.color._RGBA.RGBA_Impl_.toRGBXA = function(this1) {
	return [(this1 >> 16 & 255) / 255,(this1 >> 8 & 255) / 255,(this1 & 255) / 255,(this1 >> 24 & 255) / 255];
};
thx.color._RGBA.RGBA_Impl_.toCSS3 = function(this1) {
	return "rgba(" + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) + "," + (this1 >> 24 & 255) / 255 + ")";
};
thx.color._RGBA.RGBA_Impl_.toString = function(this1) {
	return "rgba(" + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) + "," + (this1 >> 24 & 255) / 255 + ")";
};
thx.color._RGBA.RGBA_Impl_.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(this1 >> 24 & 255,2) + StringTools.hex(this1 >> 16 & 255,2) + StringTools.hex(this1 >> 8 & 255,2) + StringTools.hex(this1 & 255,2);
};
thx.color._RGBA.RGBA_Impl_.equals = function(this1,other) {
	return (this1 >> 16 & 255) == (other >> 16 & 255) && (this1 >> 24 & 255) == (other >> 24 & 255) && (this1 >> 8 & 255) == (other >> 8 & 255) && (this1 & 255) == (other & 255);
};
thx.color._RGBA.RGBA_Impl_.get_alpha = function(this1) {
	return this1 >> 24 & 255;
};
thx.color._RGBA.RGBA_Impl_.get_red = function(this1) {
	return this1 >> 16 & 255;
};
thx.color._RGBA.RGBA_Impl_.get_green = function(this1) {
	return this1 >> 8 & 255;
};
thx.color._RGBA.RGBA_Impl_.get_blue = function(this1) {
	return this1 & 255;
};
thx.color._RGBX = {};
thx.color._RGBX.RGBX_Impl_ = {};
thx.color._RGBX.RGBX_Impl_.__name__ = ["thx","color","_RGBX","RGBX_Impl_"];
thx.color._RGBX.RGBX_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseHex(color);
	if(null == info) info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx.color._RGBX.RGBX_Impl_.fromArray(thx.color.parse.ColorParser.getFloatChannels(info.channels,3));
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._RGBX.RGBX_Impl_.fromArray = function(values) {
	var channels = values.map(function(v) {
		if(v < 0) return 0; else if(v > 1) return 1; else return v;
	}).concat([0,0,0]).slice(0,3);
	return channels;
};
thx.color._RGBX.RGBX_Impl_.fromInts = function(red,green,blue) {
	return [red / 255,green / 255,blue / 255];
};
thx.color._RGBX.RGBX_Impl_.fromFloats = function(red,green,blue) {
	return [red,green,blue];
};
thx.color._RGBX.RGBX_Impl_._new = function(channels) {
	return channels;
};
thx.color._RGBX.RGBX_Impl_.darker = function(this1,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],0),thx.core.Floats.interpolate(t,this1[1],0),thx.core.Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx.color._RGBX.RGBX_Impl_.lighter = function(this1,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],1),thx.core.Floats.interpolate(t,this1[1],1),thx.core.Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx.color._RGBX.RGBX_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._RGBX.RGBX_Impl_.toCSS3 = function(this1) {
	return "rgb(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx.color._RGBX.RGBX_Impl_.toString = function(this1) {
	return "rgb(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx.color._RGBX.RGBX_Impl_.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(Math.round(this1[0] * 255),2) + StringTools.hex(Math.round(this1[1] * 255),2) + StringTools.hex(Math.round(this1[2] * 255),2);
};
thx.color._RGBX.RGBX_Impl_.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx.color._RGBX.RGBX_Impl_.toCIELab = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toCIELab(thx.color._RGBX.RGBX_Impl_.toXYZ(this1));
};
thx.color._RGBX.RGBX_Impl_.toCIELCh = function(this1) {
	return thx.color._CIELab.CIELab_Impl_.toCIELCh(thx.color._RGBX.RGBX_Impl_.toCIELab(this1));
};
thx.color._RGBX.RGBX_Impl_.toCMY = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx.color._RGBX.RGBX_Impl_.toCMYK = function(this1) {
	var c = 0.0;
	var y = 0.0;
	var m = 0.0;
	var k;
	if(this1[0] + this1[1] + this1[2] == 0) k = 1.0; else {
		k = 1 - Math.max(Math.max(this1[0],this1[1]),this1[2]);
		c = (1 - this1[0] - k) / (1 - k);
		m = (1 - this1[1] - k) / (1 - k);
		y = (1 - this1[2] - k) / (1 - k);
	}
	return [c,m,y,k];
};
thx.color._RGBX.RGBX_Impl_.toGrey = function(this1) {
	var grey = this1[0] * .2126 + this1[1] * .7152 + this1[2] * .0722;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._RGBX.RGBX_Impl_.toPerceivedGrey = function(this1) {
	var grey = this1[0] * .299 + this1[1] * .587 + this1[2] * .114;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._RGBX.RGBX_Impl_.toPerceivedAccurateGrey = function(this1) {
	var grey = Math.pow(this1[0],2) * .241 + Math.pow(this1[1],2) * .691 + Math.pow(this1[2],2) * .068;
	var this2;
	if(grey < 0) this2 = 0; else if(grey > 1) this2 = 1; else this2 = grey;
	return this2;
};
thx.color._RGBX.RGBX_Impl_.toHSL = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var l = (max + min) / 2;
	if(delta == 0.0) s = h = 0.0; else {
		if(l < 0.5) s = delta / (max + min); else s = delta / (2 - max - min);
		if(this1[0] == max) h = (this1[1] - this1[2]) / delta + (this1[1] < Math.round(this1[2] * 255)?6:0); else if(this1[1] == max) h = (this1[2] - this1[0]) / delta + 2; else h = (this1[0] - this1[1]) / delta + 4;
		h *= 60;
	}
	return [h,s,l];
};
thx.color._RGBX.RGBX_Impl_.toHSV = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var v = max;
	if(delta != 0) s = delta / max; else {
		s = 0;
		h = -1;
		return [h,s,v];
	}
	if(this1[0] == max) h = (this1[1] - this1[2]) / delta; else if(this1[1] == max) h = 2 + (this1[2] - this1[0]) / delta; else h = 4 + (this1[0] - this1[1]) / delta;
	h *= 60;
	if(h < 0) h += 360;
	return [h,s,v];
};
thx.color._RGBX.RGBX_Impl_.toRGB = function(this1) {
	return thx.color._RGB.RGB_Impl_.fromFloats(this1[0],this1[1],this1[2]);
};
thx.color._RGBX.RGBX_Impl_.toRGBXA = function(this1) {
	var channels = this1.concat([1.0]);
	return channels;
};
thx.color._RGBX.RGBX_Impl_.toXYZ = function(this1) {
	var r = this1[0];
	var g = this1[1];
	var b = this1[2];
	r = 100 * (r > 0.04045?Math.pow((r + 0.055) / 1.055,2.4):r / 12.92);
	g = 100 * (g > 0.04045?Math.pow((g + 0.055) / 1.055,2.4):g / 12.92);
	b = 100 * (b > 0.04045?Math.pow((b + 0.055) / 1.055,2.4):b / 12.92);
	return [r * 0.4124 + g * 0.3576 + b * 0.1805,r * 0.2126 + g * 0.7152 + b * 0.0722,r * 0.0193 + g * 0.1192 + b * 0.9505];
};
thx.color._RGBX.RGBX_Impl_.toYxy = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toYxy(thx.color._RGBX.RGBX_Impl_.toXYZ(this1));
};
thx.color._RGBX.RGBX_Impl_.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx.color._RGBX.RGBX_Impl_.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx.color._RGBX.RGBX_Impl_.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx.color._RGBX.RGBX_Impl_.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx.color._RGBX.RGBX_Impl_.get_redf = function(this1) {
	return this1[0];
};
thx.color._RGBX.RGBX_Impl_.get_greenf = function(this1) {
	return this1[1];
};
thx.color._RGBX.RGBX_Impl_.get_bluef = function(this1) {
	return this1[2];
};
thx.color._RGBXA = {};
thx.color._RGBXA.RGBXA_Impl_ = {};
thx.color._RGBXA.RGBXA_Impl_.__name__ = ["thx","color","_RGBXA","RGBXA_Impl_"];
thx.color._RGBXA.RGBXA_Impl_.parse = function(color) {
	var info = thx.color.parse.ColorParser.parseHex(color);
	if(null == info) info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			var this1 = thx.color._RGBX.RGBX_Impl_.fromArray(thx.color.parse.ColorParser.getFloatChannels(info.channels,3));
			var channels = this1.concat([1.0]);
			return channels;
		case "rgba":
			return thx.color._RGBXA.RGBXA_Impl_.fromArray(thx.color.parse.ColorParser.getFloatChannels(info.channels,4));
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._RGBXA.RGBXA_Impl_.fromArray = function(values) {
	var channels = values.map(function(v) {
		if(v < 0) return 0; else if(v > 1) return 1; else return v;
	}).concat([0,0,0,0]).slice(0,4);
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_.fromInts = function(red,green,blue,alpha) {
	return [red / 255,green / 255,blue / 255,alpha / 255];
};
thx.color._RGBXA.RGBXA_Impl_.fromFloats = function(red,green,blue,alpha) {
	return [red,green,blue,alpha];
};
thx.color._RGBXA.RGBXA_Impl_.darker = function(this1,t) {
	var this2 = thx.color._RGBX.RGBX_Impl_.darker((function($this) {
		var $r;
		var channels = this1.slice(0,3);
		$r = channels;
		return $r;
	}(this)),t);
	var alpha = Math.round(this1[3] * 255);
	var channels1 = this2.concat([alpha]);
	return channels1;
};
thx.color._RGBXA.RGBXA_Impl_.lighter = function(this1,t) {
	var this2 = thx.color._RGBX.RGBX_Impl_.lighter((function($this) {
		var $r;
		var channels = this1.slice(0,3);
		$r = channels;
		return $r;
	}(this)),t);
	var alpha = Math.round(this1[3] * 255);
	var channels1 = this2.concat([alpha]);
	return channels1;
};
thx.color._RGBXA.RGBXA_Impl_.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Ints.interpolate(t,this1[3],0)];
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx.core.Ints.interpolate(t,this1[3],1)];
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Ints.interpolate(t,this1[0],other[0]),thx.core.Ints.interpolate(t,this1[1],other[1]),thx.core.Ints.interpolate(t,this1[2],other[2]),thx.core.Ints.interpolate(t,this1[3],other[3])];
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_._new = function(channels) {
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_.toCSS3 = function(this1) {
	return "rgba(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx.color._RGBXA.RGBXA_Impl_.toString = function(this1) {
	return "rgba(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx.color._RGBXA.RGBXA_Impl_.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(Math.round(this1[3] * 255),2) + StringTools.hex(Math.round(this1[0] * 255),2) + StringTools.hex(Math.round(this1[1] * 255),2) + StringTools.hex(Math.round(this1[2] * 255),2);
};
thx.color._RGBXA.RGBXA_Impl_.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10 && Math.abs(this1[3] - other[3]) <= 10e-10;
};
thx.color._RGBXA.RGBXA_Impl_.toHSLA = function(this1) {
	var this2 = thx.color._RGBX.RGBX_Impl_.toHSL((function($this) {
		var $r;
		var channels = this1.slice(0,3);
		$r = channels;
		return $r;
	}(this)));
	var alpha = Math.round(this1[3] * 255);
	var channels1 = this2.concat([alpha]);
	return channels1;
};
thx.color._RGBXA.RGBXA_Impl_.toHSVA = function(this1) {
	var this2 = thx.color._RGBX.RGBX_Impl_.toHSV((function($this) {
		var $r;
		var channels = this1.slice(0,3);
		$r = channels;
		return $r;
	}(this)));
	var alpha = Math.round(this1[3] * 255);
	var channels1 = this2.concat([alpha]);
	return channels1;
};
thx.color._RGBXA.RGBXA_Impl_.toRGB = function(this1) {
	var this2;
	var channels = this1.slice(0,3);
	this2 = channels;
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._RGBXA.RGBXA_Impl_.toRGBX = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx.color._RGBXA.RGBXA_Impl_.toRGBA = function(this1) {
	return thx.color._RGBA.RGBA_Impl_.fromFloats(this1[0],this1[1],this1[2],this1[3]);
};
thx.color._RGBXA.RGBXA_Impl_.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx.color._RGBXA.RGBXA_Impl_.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx.color._RGBXA.RGBXA_Impl_.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx.color._RGBXA.RGBXA_Impl_.get_alpha = function(this1) {
	return Math.round(this1[3] * 255);
};
thx.color._RGBXA.RGBXA_Impl_.get_redf = function(this1) {
	return this1[0];
};
thx.color._RGBXA.RGBXA_Impl_.get_greenf = function(this1) {
	return this1[1];
};
thx.color._RGBXA.RGBXA_Impl_.get_bluef = function(this1) {
	return this1[2];
};
thx.color._RGBXA.RGBXA_Impl_.get_alphaf = function(this1) {
	return this1[3];
};
thx.color._XYZ = {};
thx.color._XYZ.XYZ_Impl_ = {};
thx.color._XYZ.XYZ_Impl_.__name__ = ["thx","color","_XYZ","XYZ_Impl_"];
thx.color._XYZ.XYZ_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "ciexyz":case "xyz":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._XYZ.XYZ_Impl_.fromFloats = function(x,y,z) {
	return [x,y,z];
};
thx.color._XYZ.XYZ_Impl_._new = function(channels) {
	return channels;
};
thx.color._XYZ.XYZ_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._XYZ.XYZ_Impl_.toString = function(this1) {
	return "XYZ(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx.color._XYZ.XYZ_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._XYZ.XYZ_Impl_.toCIELab = function(this1) {
	var x = this1[0] * 0.0105211106;
	var y = this1[1] * 0.01;
	var z = this1[2] * 0.00918417016;
	var p;
	if(x > 0.008856) x = Math.pow(x,0.333333333333333315); else x = 7.787 * x + 0.137931034482758619;
	if(y > 0.008856) y = Math.pow(y,0.333333333333333315); else y = 7.787 * y + 0.137931034482758619;
	if(z > 0.008856) z = Math.pow(z,0.333333333333333315); else z = 7.787 * z + 0.137931034482758619;
	if(y > 0.008856) return [116 * y - 16,500 * (x - y),200 * (y - z)]; else return [903.3 * y,500 * (x - y),200 * (y - z)];
};
thx.color._XYZ.XYZ_Impl_.toCIELCh = function(this1) {
	return thx.color._CIELab.CIELab_Impl_.toCIELCh(thx.color._XYZ.XYZ_Impl_.toCIELab(this1));
};
thx.color._XYZ.XYZ_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY(thx.color._XYZ.XYZ_Impl_.toRGBX(this1));
};
thx.color._XYZ.XYZ_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK(thx.color._XYZ.XYZ_Impl_.toRGBX(this1));
};
thx.color._XYZ.XYZ_Impl_.toGrey = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(this1);
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._XYZ.XYZ_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL(thx.color._XYZ.XYZ_Impl_.toRGBX(this1));
};
thx.color._XYZ.XYZ_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV(thx.color._XYZ.XYZ_Impl_.toRGBX(this1));
};
thx.color._XYZ.XYZ_Impl_.toRGB = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(this1);
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._XYZ.XYZ_Impl_.toRGBX = function(this1) {
	var x = this1[0] / 100;
	var y = this1[1] / 100;
	var z = this1[2] / 100;
	var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	var b = x * 0.0557 + y * -0.204 + z * 1.0570;
	if(r > 0.0031308) r = 1.055 * Math.pow(r,0.416666666666666685) - 0.055; else r = 12.92 * r;
	if(g > 0.0031308) g = 1.055 * Math.pow(g,0.416666666666666685) - 0.055; else g = 12.92 * g;
	if(b > 0.0031308) b = 1.055 * Math.pow(b,0.416666666666666685) - 0.055; else b = 12.92 * b;
	return [r,g,b];
};
thx.color._XYZ.XYZ_Impl_.toRGBXA = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(this1);
	var channels = this2.concat([1.0]);
	return channels;
};
thx.color._XYZ.XYZ_Impl_.toYxy = function(this1) {
	var sum = this1[0] + this1[1] + this1[2];
	return [this1[1],sum == 0?1:this1[0] / sum,sum == 0?1:this1[1] / sum];
};
thx.color._XYZ.XYZ_Impl_.get_x = function(this1) {
	return this1[0];
};
thx.color._XYZ.XYZ_Impl_.get_y = function(this1) {
	return this1[1];
};
thx.color._XYZ.XYZ_Impl_.get_z = function(this1) {
	return this1[2];
};
thx.color._Yxy = {};
thx.color._Yxy.Yxy_Impl_ = {};
thx.color._Yxy.Yxy_Impl_.__name__ = ["thx","color","_Yxy","Yxy_Impl_"];
thx.color._Yxy.Yxy_Impl_.fromString = function(color) {
	var info = thx.color.parse.ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "yxy":
			var channels = thx.color.parse.ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		return null;
	}
};
thx.color._Yxy.Yxy_Impl_.fromFloats = function(y1,x,y2) {
	return [y1,x,y2];
};
thx.color._Yxy.Yxy_Impl_._new = function(channels) {
	return channels;
};
thx.color._Yxy.Yxy_Impl_.interpolate = function(this1,other,t) {
	var channels = [thx.core.Floats.interpolate(t,this1[0],other[0]),thx.core.Floats.interpolate(t,this1[1],other[1]),thx.core.Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx.color._Yxy.Yxy_Impl_.toString = function(this1) {
	return "Yxy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx.color._Yxy.Yxy_Impl_.equals = function(this1,other) {
	return this1[0] == other[0] && this1[1] == other[1] && this1[2] == other[2];
};
thx.color._Yxy.Yxy_Impl_.toCIELab = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toCIELab(thx.color._Yxy.Yxy_Impl_.toXYZ(this1));
};
thx.color._Yxy.Yxy_Impl_.toCIELCh = function(this1) {
	return thx.color._CIELab.CIELab_Impl_.toCIELCh(thx.color._XYZ.XYZ_Impl_.toCIELab(thx.color._Yxy.Yxy_Impl_.toXYZ(this1)));
};
thx.color._Yxy.Yxy_Impl_.toCMY = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMY(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1)));
};
thx.color._Yxy.Yxy_Impl_.toCMYK = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toCMYK(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1)));
};
thx.color._Yxy.Yxy_Impl_.toGrey = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1));
	var grey = this2[0] * .2126 + this2[1] * .7152 + this2[2] * .0722;
	var this3;
	if(grey < 0) this3 = 0; else if(grey > 1) this3 = 1; else this3 = grey;
	return this3;
};
thx.color._Yxy.Yxy_Impl_.toHSL = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSL(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1)));
};
thx.color._Yxy.Yxy_Impl_.toHSV = function(this1) {
	return thx.color._RGBX.RGBX_Impl_.toHSV(thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1)));
};
thx.color._Yxy.Yxy_Impl_.toRGB = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1));
	return thx.color._RGB.RGB_Impl_.fromFloats(this2[0],this2[1],this2[2]);
};
thx.color._Yxy.Yxy_Impl_.toRGBX = function(this1) {
	return thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1));
};
thx.color._Yxy.Yxy_Impl_.toRGBXA = function(this1) {
	var this2 = thx.color._XYZ.XYZ_Impl_.toRGBX(thx.color._Yxy.Yxy_Impl_.toXYZ(this1));
	var channels = this2.concat([1.0]);
	return channels;
};
thx.color._Yxy.Yxy_Impl_.toXYZ = function(this1) {
	return [this1[1] * (this1[0] / this1[2]),this1[0],(1 - this1[1] - this1[2]) * (this1[0] / this1[2])];
};
thx.color._Yxy.Yxy_Impl_.get_y1 = function(this1) {
	return this1[0];
};
thx.color._Yxy.Yxy_Impl_.get_x = function(this1) {
	return this1[1];
};
thx.color._Yxy.Yxy_Impl_.get_y2 = function(this1) {
	return this1[2];
};
thx.color.parse = {};
thx.color.parse.ColorParser = function() {
	this.pattern_color = new EReg("^\\s*([^(]+)\\s*\\(([^)]*)\\)\\s*$","i");
	this.pattern_channel = new EReg("^\\s*(\\d*.\\d+|\\d+)(%|deg|rad)?\\s*$","i");
};
thx.color.parse.ColorParser.__name__ = ["thx","color","parse","ColorParser"];
thx.color.parse.ColorParser.parseColor = function(s) {
	return thx.color.parse.ColorParser.parser.processColor(s);
};
thx.color.parse.ColorParser.parseHex = function(s) {
	return thx.color.parse.ColorParser.parser.processHex(s);
};
thx.color.parse.ColorParser.parseChannel = function(s) {
	return thx.color.parse.ColorParser.parser.processChannel(s);
};
thx.color.parse.ColorParser.getFloatChannels = function(channels,length) {
	if(length != channels.length) throw "invalid number of channels, expected " + length + " but it is " + channels.length;
	return channels.map(thx.color.parse.ColorParser.getFloatChannel);
};
thx.color.parse.ColorParser.getInt8Channels = function(channels,length) {
	if(length != channels.length) throw "invalid number of channels, expected " + length + " but it is " + channels.length;
	return channels.map(thx.color.parse.ColorParser.getInt8Channel);
};
thx.color.parse.ColorParser.getFloatChannel = function(channel) {
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 1:
		var v1 = channel[2];
		return v1;
	case 4:
		var v2 = channel[2];
		return v2;
	case 2:
		var v3 = channel[2];
		return v3;
	case 3:
		var v4 = channel[2];
		return v4 / 255;
	case 0:
		var v5 = channel[2];
		return v5 / 100;
	}
};
thx.color.parse.ColorParser.getInt8Channel = function(channel) {
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 3:
		var v1 = channel[2];
		return v1;
	case 0:
		var v2 = channel[2];
		return Math.round(255 * v2 / 100);
	default:
		throw "unable to extract a valid int8 value";
	}
};
thx.color.parse.ColorParser.prototype = {
	pattern_color: null
	,pattern_channel: null
	,processHex: function(s) {
		if(!thx.color.parse.ColorParser.isPureHex.match(s)) {
			if(HxOverrides.substr(s,0,1) == "#") {
				if(s.length == 4) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3); else if(s.length == 5) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3) + s.charAt(4) + s.charAt(4); else s = HxOverrides.substr(s,1,null);
			} else if(HxOverrides.substr(s,0,2) == "0x") s = HxOverrides.substr(s,2,null); else return null;
		}
		var channels = [];
		while(s.length > 0) {
			channels.push(thx.color.parse.ChannelInfo.CIInt8(Std.parseInt("0x" + HxOverrides.substr(s,0,2))));
			s = HxOverrides.substr(s,2,null);
		}
		if(channels.length == 4) return new thx.color.parse.ColorInfo("rgba",channels.slice(1).concat([channels[0]])); else return new thx.color.parse.ColorInfo("rgb",channels);
	}
	,processColor: function(s) {
		if(!this.pattern_color.match(s)) return null;
		var name = this.pattern_color.matched(1);
		if(null == name) return null;
		name = name.toLowerCase();
		var m2 = this.pattern_color.matched(2);
		var s_channels;
		if(null == m2) s_channels = []; else s_channels = m2.split(",");
		var channels = [];
		var channel;
		var _g = 0;
		while(_g < s_channels.length) {
			var s_channel = s_channels[_g];
			++_g;
			channel = this.processChannel(s_channel);
			if(null == channel) return null;
			channels.push(channel);
		}
		return new thx.color.parse.ColorInfo(name,channels);
	}
	,processChannel: function(s) {
		if(!this.pattern_channel.match(s)) return null;
		var value = this.pattern_channel.matched(1);
		var unit = this.pattern_channel.matched(2);
		if(unit == null) unit = "";
		try {
			switch(unit) {
			case "%":
				if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIPercent(thx.core.Floats.parse(value)); else return null;
				break;
			case "deg":
				if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIDegree(thx.core.Floats.parse(value)); else return null;
				break;
			case "DEG":
				if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIDegree(thx.core.Floats.parse(value)); else return null;
				break;
			case "rad":
				if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIDegree(thx.core.Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "RAD":
				if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIDegree(thx.core.Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "":
				if(thx.core.Ints.canParse(value)) {
					var i = thx.core.Ints.parse(value);
					if(i == 0) return thx.color.parse.ChannelInfo.CIBool(false); else if(i == 1) return thx.color.parse.ChannelInfo.CIBool(true); else if(i < 256) return thx.color.parse.ChannelInfo.CIInt8(i); else return thx.color.parse.ChannelInfo.CIInt(i);
				} else if(thx.core.Floats.canParse(value)) return thx.color.parse.ChannelInfo.CIFloat(thx.core.Floats.parse(value)); else return null;
				break;
			default:
				return null;
			}
		} catch( e ) {
			return null;
		}
	}
	,__class__: thx.color.parse.ColorParser
};
thx.color.parse.ColorInfo = function(name,channels) {
	this.name = name;
	this.channels = channels;
};
thx.color.parse.ColorInfo.__name__ = ["thx","color","parse","ColorInfo"];
thx.color.parse.ColorInfo.prototype = {
	name: null
	,channels: null
	,toString: function() {
		return "" + this.name + ", channels: " + Std.string(this.channels);
	}
	,__class__: thx.color.parse.ColorInfo
};
thx.color.parse.ChannelInfo = { __ename__ : ["thx","color","parse","ChannelInfo"], __constructs__ : ["CIPercent","CIFloat","CIDegree","CIInt8","CIInt","CIBool"] };
thx.color.parse.ChannelInfo.CIPercent = function(value) { var $x = ["CIPercent",0,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.color.parse.ChannelInfo.CIFloat = function(value) { var $x = ["CIFloat",1,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.color.parse.ChannelInfo.CIDegree = function(value) { var $x = ["CIDegree",2,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.color.parse.ChannelInfo.CIInt8 = function(value) { var $x = ["CIInt8",3,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.color.parse.ChannelInfo.CIInt = function(value) { var $x = ["CIInt",4,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.color.parse.ChannelInfo.CIBool = function(value) { var $x = ["CIBool",5,value]; $x.__enum__ = thx.color.parse.ChannelInfo; return $x; };
thx.core = {};
thx.core.Arrays = function() { };
thx.core.Arrays.__name__ = ["thx","core","Arrays"];
thx.core.Arrays.after = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0) + 1);
};
thx.core.Arrays.all = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(!predicate(item)) return false;
	}
	return true;
};
thx.core.Arrays.any = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(predicate(item)) return true;
	}
	return false;
};
thx.core.Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx.core.Arrays.before = function(array,element) {
	return array.slice(0,HxOverrides.indexOf(array,element,0));
};
thx.core.Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx.core.Arrays.contains = function(array,element,eq) {
	if(null == eq) return HxOverrides.indexOf(array,element,0) >= 0; else {
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(array[i],element)) return true;
		}
		return false;
	}
};
thx.core.Arrays.cross = function(a,b) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var va = a[_g];
		++_g;
		var _g1 = 0;
		while(_g1 < b.length) {
			var vb = b[_g1];
			++_g1;
			r.push([va,vb]);
		}
	}
	return r;
};
thx.core.Arrays.crossMulti = function(array) {
	var acopy = array.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var array1 = acopy.shift();
		var tresult = result;
		result = [];
		var _g = 0;
		while(_g < array1.length) {
			var v1 = array1[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < tresult.length) {
				var ar = tresult[_g1];
				++_g1;
				var t = ar.slice();
				t.push(v1);
				result.push(t);
			}
		}
	}
	return result;
};
thx.core.Arrays.eachPair = function(array,callback) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = array.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!callback(array[i],array[j])) return;
		}
	}
};
thx.core.Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx.core.Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx.core.Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx.core.Arrays.find = function(array,predicate) {
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(predicate(item)) return item;
	}
	return null;
};
thx.core.Arrays.findLast = function(array,predicate) {
	var len = array.length;
	var j;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		j = len - i - 1;
		if(predicate(array[j])) return array[j];
	}
	return null;
};
thx.core.Arrays.first = function(array) {
	return array[0];
};
thx.core.Arrays.flatMap = function(array,callback) {
	return thx.core.Arrays.flatten(array.map(callback));
};
thx.core.Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx.core.Arrays.from = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0));
};
thx.core.Arrays.head = function(array) {
	return array[0];
};
thx.core.Arrays.ifEmpty = function(value,alt) {
	if(null != value && 0 != value.length) return value; else return alt;
};
thx.core.Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx.core.Arrays.isEmpty = function(array) {
	return array.length == 0;
};
thx.core.Arrays.last = function(array) {
	return array[array.length - 1];
};
thx.core.Arrays.mapi = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i],i));
	}
	return r;
};
thx.core.Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx.core.Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx.core.Arrays.pull = function(array,toRemove,equality) {
	var _g = 0;
	while(_g < toRemove.length) {
		var item = toRemove[_g];
		++_g;
		thx.core.Arrays.removeAll(array,item,equality);
	}
};
thx.core.Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx.core.Arrays.reduce = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx.core.Arrays.reducei = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx.core.Arrays.reduceRight = function(array,callback,initial) {
	var i = array.length;
	while(--i >= 0) initial = callback(initial,array[i]);
	return initial;
};
thx.core.Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx.core.Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx.core.Arrays.rest = function(array) {
	return array.slice(1);
};
thx.core.Arrays.sample = function(array,n) {
	n = thx.core.Ints.min(n,array.length);
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx.core.Arrays.sampleOne = function(array) {
	return array[Std.random(array.length)];
};
thx.core.Arrays.shuffle = function(a) {
	var t = thx.core.Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx.core.Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx.core.Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx.core.Arrays.zip = function(array1,array2) {
	var length = thx.core.Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx.core.Arrays.zip3 = function(array1,array2,array3) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx.core.Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx.core.Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx.core.Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx.core.Arrays.unzip3 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx.core.Arrays.unzip4 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx.core.Arrays.unzip5 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx.core.ArrayFloats = function() { };
thx.core.ArrayFloats.__name__ = ["thx","core","ArrayFloats"];
thx.core.ArrayFloats.average = function(arr) {
	return thx.core.ArrayFloats.sum(arr) / arr.length;
};
thx.core.ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx.core.ArrayFloats.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayFloats.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.ArrayFloats.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0.0);
};
thx.core.ArrayInts = function() { };
thx.core.ArrayInts.__name__ = ["thx","core","ArrayInts"];
thx.core.ArrayInts.average = function(arr) {
	return thx.core.ArrayInts.sum(arr) / arr.length;
};
thx.core.ArrayInts.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayInts.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.ArrayInts.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0);
};
thx.core.ArrayStrings = function() { };
thx.core.ArrayStrings.__name__ = ["thx","core","ArrayStrings"];
thx.core.ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx.core.Strings.isEmpty(v);
	});
};
thx.core.ArrayStrings.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayStrings.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.Either = { __ename__ : ["thx","core","Either"], __constructs__ : ["Left","Right"] };
thx.core.Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx.core.Either; return $x; };
thx.core.Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx.core.Either; return $x; };
thx.core.Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		try {
			stack = haxe.CallStack.exceptionStack();
		} catch( e ) {
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe.CallStack.callStack();
		} catch( e1 ) {
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx.core.Error.__name__ = ["thx","core","Error"];
thx.core.Error.fromDynamic = function(err,pos) {
	if(js.Boot.__instanceof(err,thx.core.Error)) return err;
	return new thx.core.Error("" + Std.string(err),null,pos);
};
thx.core.Error.__super__ = Error;
thx.core.Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
		return this.message + "\nfrom: " + this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber + "\n\n" + haxe.CallStack.toString(this.stackItems);
	}
	,__class__: thx.core.Error
});
thx.core.Floats = function() { };
thx.core.Floats.__name__ = ["thx","core","Floats"];
thx.core.Floats.ceilTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.ceil(f * p) / p;
};
thx.core.Floats.canParse = function(s) {
	return thx.core.Floats.pattern_parse.match(s);
};
thx.core.Floats.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx.core.Floats.clampSym = function(v,max) {
	return thx.core.Floats.clamp(v,-max,max);
};
thx.core.Floats.compare = function(a,b) {
	if(a < b) return -1; else if(b > a) return 1; else return 0;
};
thx.core.Floats.floorTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.floor(f * p) / p;
};
thx.core.Floats.interpolate = function(f,a,b) {
	return (b - a) * f + a;
};
thx.core.Floats.nearEquals = function(a,b) {
	return Math.abs(a - b) <= 10e-10;
};
thx.core.Floats.nearZero = function(n) {
	return Math.abs(n) <= 10e-10;
};
thx.core.Floats.normalize = function(v) {
	if(v < 0) return 0; else if(v > 1) return 1; else return v;
};
thx.core.Floats.parse = function(s) {
	if(s.substring(0,1) == "+") s = s.substring(1);
	return parseFloat(s);
};
thx.core.Floats.roundTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.round(f * p) / p;
};
thx.core.Floats.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx.core.Floats.wrap = function(v,min,max) {
	var range = max - min + 1;
	if(v < min) v += range * ((min - v) / range + 1);
	return min + (v - min) % range;
};
thx.core.Floats.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
thx.core.Functions0 = function() { };
thx.core.Functions0.__name__ = ["thx","core","Functions0"];
thx.core.Functions0.after = function(callback,n) {
	return function() {
		if(--n == 0) callback();
	};
};
thx.core.Functions0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx.core.Functions0.once = function(f) {
	return function() {
		var t = f;
		f = thx.core.Functions.noop;
		t();
	};
};
thx.core.Functions0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx.core.Functions0.times = function(n,callback) {
	return function() {
		return thx.core.Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx.core.Functions0.timesi = function(n,callback) {
	return function() {
		return thx.core.Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
thx.core.Functions1 = function() { };
thx.core.Functions1.__name__ = ["thx","core","Functions1"];
thx.core.Functions1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx.core.Functions1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx.core.Functions1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map_h = { };
	return function(v1) {
		var key = resolver(v1);
		if(map_h.hasOwnProperty("$" + key)) return map_h["$" + key];
		var result = callback(v1);
		map_h["$" + key] = result;
		return result;
	};
};
thx.core.Functions1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx.core.Functions1.noop = function(_) {
};
thx.core.Functions1.times = function(n,callback) {
	return function(value) {
		return thx.core.Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx.core.Functions1.timesi = function(n,callback) {
	return function(value) {
		return thx.core.Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx.core.Functions1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
thx.core.Functions2 = function() { };
thx.core.Functions2.__name__ = ["thx","core","Functions2"];
thx.core.Functions2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map_h = { };
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(map_h.hasOwnProperty("$" + key)) return map_h["$" + key];
		var result = callback(v11,v21);
		map_h["$" + key] = result;
		return result;
	};
};
thx.core.Functions2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
thx.core.Functions3 = function() { };
thx.core.Functions3.__name__ = ["thx","core","Functions3"];
thx.core.Functions3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map_h = { };
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(map_h.hasOwnProperty("$" + key)) return map_h["$" + key];
		var result = callback(v11,v21,v31);
		map_h["$" + key] = result;
		return result;
	};
};
thx.core.Functions3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
thx.core.Functions = function() { };
thx.core.Functions.__name__ = ["thx","core","Functions"];
thx.core.Functions.constant = function(v) {
	return function() {
		return v;
	};
};
thx.core.Functions.equality = function(a,b) {
	return a == b;
};
thx.core.Functions.identity = function(value) {
	return value;
};
thx.core.Functions.noop = function() {
};
thx.core.Ints = function() { };
thx.core.Ints.__name__ = ["thx","core","Ints"];
thx.core.Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx.core.Ints.canParse = function(s) {
	return thx.core.Ints.pattern_parse.match(s);
};
thx.core.Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx.core.Ints.clampSym = function(v,max) {
	return thx.core.Ints.clamp(v,-max,max);
};
thx.core.Ints.compare = function(a,b) {
	return a - b;
};
thx.core.Ints.interpolate = function(f,a,b) {
	return Math.round(a + (b - a) * f);
};
thx.core.Ints.isEven = function(v) {
	return v % 2 == 0;
};
thx.core.Ints.isOdd = function(v) {
	return v % 2 != 0;
};
thx.core.Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx.core.Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx.core.Ints.parse = function(s,base) {
	var v = parseInt(s,base);
	if(isNaN(v)) return null; else return v;
};
thx.core.Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx.core.Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw "infinite range";
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx.core.Ints.toString = function(value,base) {
	return value.toString(base);
};
thx.core.Ints.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx.core.Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
thx.core.Iterators = function() { };
thx.core.Iterators.__name__ = ["thx","core","Iterators"];
thx.core.Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(!predicate(item)) return false;
	}
	return true;
};
thx.core.Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(predicate(item)) return true;
	}
	return false;
};
thx.core.Iterators.eachPair = function(it,handler) {
	thx.core.Arrays.eachPair(thx.core.Iterators.toArray(it),handler);
};
thx.core.Iterators.filter = function(it,predicate) {
	return thx.core.Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
thx.core.Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var item = it.next();
		if(f(item)) return item;
	}
	return null;
};
thx.core.Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx.core.Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx.core.Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx.core.Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
thx.core.Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx.core.Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx.core.Iterators.order = function(it,sort) {
	var n = thx.core.Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx.core.Iterators.reduce = function(it,callback,initial) {
	thx.core.Iterators.map(it,function(v) {
		initial = callback(initial,v);
	});
	return initial;
};
thx.core.Iterators.reducei = function(it,callback,initial) {
	thx.core.Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx.core.Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
thx.core.Nil = { __ename__ : ["thx","core","Nil"], __constructs__ : ["nil"] };
thx.core.Nil.nil = ["nil",0];
thx.core.Nil.nil.__enum__ = thx.core.Nil;
thx.core.Nulls = function() { };
thx.core.Nulls.__name__ = ["thx","core","Nulls"];
thx.core.Options = function() { };
thx.core.Options.__name__ = ["thx","core","Options"];
thx.core.Options.equals = function(a,b,eq) {
	switch(a[1]) {
	case 1:
		switch(b[1]) {
		case 1:
			return true;
		default:
			return false;
		}
		break;
	case 0:
		switch(b[1]) {
		case 0:
			var a1 = a[2];
			var b1 = b[2];
			if(null == eq) eq = function(a2,b2) {
				return a2 == b2;
			};
			return eq(a1,b1);
		default:
			return false;
		}
		break;
	}
};
thx.core.Options.equalsValue = function(a,b,eq) {
	return thx.core.Options.equals(a,null == b?haxe.ds.Option.None:haxe.ds.Option.Some(b),eq);
};
thx.core.Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx.core.Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe.ds.Option.None;
	case 0:
		var v = option[2];
		return haxe.ds.Option.Some(callback(v));
	}
};
thx.core.Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx.core.Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx.core.Options.toOption = function(value) {
	if(null == value) return haxe.ds.Option.None; else return haxe.ds.Option.Some(value);
};
thx.core.Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
thx.core._Result = {};
thx.core._Result.Result_Impl_ = {};
thx.core._Result.Result_Impl_.__name__ = ["thx","core","_Result","Result_Impl_"];
thx.core._Result.Result_Impl_.optionValue = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return haxe.ds.Option.Some(v);
	default:
		return haxe.ds.Option.None;
	}
};
thx.core._Result.Result_Impl_.optionError = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return haxe.ds.Option.Some(v);
	default:
		return haxe.ds.Option.None;
	}
};
thx.core._Result.Result_Impl_.value = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx.core._Result.Result_Impl_.error = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx.core._Result.Result_Impl_.get_isSuccess = function(this1) {
	switch(this1[1]) {
	case 1:
		return true;
	default:
		return false;
	}
};
thx.core._Result.Result_Impl_.get_isFailure = function(this1) {
	switch(this1[1]) {
	case 0:
		return true;
	default:
		return false;
	}
};
thx.core.Strings = function() { };
thx.core.Strings.__name__ = ["thx","core","Strings"];
thx.core.Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx.core.Strings.capitalize = function(s) {
	return s.substring(0,1).toUpperCase() + s.substring(1);
};
thx.core.Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx.core.Strings.UCWORDSWS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx.core.Strings.upperMatch); else return thx.core.Strings.UCWORDS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx.core.Strings.upperMatch);
};
thx.core.Strings.collapse = function(value) {
	return thx.core.Strings.WSG.replace(StringTools.trim(value)," ");
};
thx.core.Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx.core.Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx.core.Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx.core.Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return s.substring(0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx.core.Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx.core.Strings.filterCharcode = function(s,predicate) {
	return thx.core.Strings.toCharcodeArray(s).filter(predicate).map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx.core.Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos);
};
thx.core.Strings.humanize = function(s) {
	return StringTools.replace(thx.core.Strings.underscore(s),"_"," ");
};
thx.core.Strings.isAlphaNum = function(value) {
	return thx.core.Strings.ALPHANUM.match(value);
};
thx.core.Strings.isLowerCase = function(value) {
	return value.toLowerCase() == value;
};
thx.core.Strings.isUpperCase = function(value) {
	return value.toUpperCase() == value;
};
thx.core.Strings.ifEmpty = function(value,alt) {
	if(null != value && "" != value) return value; else return alt;
};
thx.core.Strings.isDigitsOnly = function(value) {
	return thx.core.Strings.DIGITS.match(value);
};
thx.core.Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx.core.Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx.core.Strings.map = function(value,callback) {
	return value.split("").map(callback);
};
thx.core.Strings.remove = function(value,toremove) {
	return StringTools.replace(value,toremove,"");
};
thx.core.Strings.removeAfter = function(value,toremove) {
	if(StringTools.endsWith(value,toremove)) return value.substring(0,value.length - toremove.length); else return value;
};
thx.core.Strings.removeBefore = function(value,toremove) {
	if(StringTools.startsWith(value,toremove)) return value.substring(toremove.length); else return value;
};
thx.core.Strings.repeat = function(s,times) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < times) {
				var i = _g1++;
				_g.push(s);
			}
		}
		$r = _g;
		return $r;
	}(this))).join("");
};
thx.core.Strings.reverse = function(s) {
	var arr = s.split("");
	arr.reverse();
	return arr.join("");
};
thx.core.Strings.stripTags = function(s) {
	return thx.core.Strings.STRIPTAGS.replace(s,"");
};
thx.core.Strings.surround = function(s,left,right) {
	return "" + left + s + (null == right?left:right);
};
thx.core.Strings.toArray = function(s) {
	return s.split("");
};
thx.core.Strings.toCharcodeArray = function(s) {
	return thx.core.Strings.map(s,function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx.core.Strings.toChunks = function(s,len) {
	var chunks = [];
	while(s.length > 0) {
		chunks.push(s.substring(0,len));
		s = s.substring(len);
	}
	return chunks;
};
thx.core.Strings.trimChars = function(value,charlist) {
	return thx.core.Strings.trimCharsRight(thx.core.Strings.trimCharsLeft(value,charlist),charlist);
};
thx.core.Strings.trimCharsLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx.core.Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return value.substring(pos);
};
thx.core.Strings.trimCharsRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx.core.Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return value.substring(0,pos);
};
thx.core.Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx.core.Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return value.substring(0,pos);
};
thx.core.Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx.core.Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx.core.Strings.wrapLine(StringTools.trim(thx.core.Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx.core.Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx.core.Strings.wrapLine = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(s.substring(pos));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(s.substring(pos,pos + columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(s.substring(pos,pos + columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
thx.core.Timer = function() { };
thx.core.Timer.__name__ = ["thx","core","Timer"];
thx.core.Timer.debounce = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var cancel = thx.core.Functions.noop;
	var poll = function() {
		cancel();
		cancel = thx.core.Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
		}
		poll();
	};
};
thx.core.Timer.throttle = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var waiting = false;
	var poll = function() {
		waiting = true;
		thx.core.Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
			return;
		}
		if(waiting) return;
		poll();
	};
};
thx.core.Timer.repeat = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx.core.Timer.clear,setInterval(callback,delayms));
};
thx.core.Timer.delay = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx.core.Timer.clear,setTimeout(callback,delayms));
};
thx.core.Timer.frame = function(callback) {
	var cancelled = false;
	var f = thx.core.Functions.noop;
	var current = performance.now();
	var next;
	f = function() {
		if(cancelled) return;
		next = performance.now();
		callback(next - current);
		current = next;
		requestAnimationFrame(f);
	};
	requestAnimationFrame(f);
	return function() {
		cancelled = false;
	};
};
thx.core.Timer.nextFrame = function(callback) {
	var id = requestAnimationFrame(callback);
	return function() {
		cancelAnimationFrame(id);
	};
};
thx.core.Timer.immediate = function(callback) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx.core.Timer.clear,setImmediate(callback));
};
thx.core.Timer.clear = function(id) {
	clearTimeout(id);
	return;
};
thx.core.Timer.time = function() {
	return performance.now();
};
thx.core._Tuple = {};
thx.core._Tuple.Tuple0_Impl_ = {};
thx.core._Tuple.Tuple0_Impl_.__name__ = ["thx","core","_Tuple","Tuple0_Impl_"];
thx.core._Tuple.Tuple0_Impl_._new = function() {
	return thx.core.Nil.nil;
};
thx.core._Tuple.Tuple0_Impl_["with"] = function(this1,v) {
	return v;
};
thx.core._Tuple.Tuple0_Impl_.toString = function(this1) {
	return "Tuple0()";
};
thx.core._Tuple.Tuple0_Impl_.toNil = function(this1) {
	return this1;
};
thx.core._Tuple.Tuple0_Impl_.nilToTuple = function(v) {
	return thx.core.Nil.nil;
};
thx.core._Tuple.Tuple1_Impl_ = {};
thx.core._Tuple.Tuple1_Impl_.__name__ = ["thx","core","_Tuple","Tuple1_Impl_"];
thx.core._Tuple.Tuple1_Impl_._new = function(_0) {
	return _0;
};
thx.core._Tuple.Tuple1_Impl_.get__0 = function(this1) {
	return this1;
};
thx.core._Tuple.Tuple1_Impl_["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx.core._Tuple.Tuple1_Impl_.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx.core._Tuple.Tuple2_Impl_ = {};
thx.core._Tuple.Tuple2_Impl_.__name__ = ["thx","core","_Tuple","Tuple2_Impl_"];
thx.core._Tuple.Tuple2_Impl_._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx.core._Tuple.Tuple2_Impl_.get_left = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple2_Impl_.get_right = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple2_Impl_.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx.core._Tuple.Tuple2_Impl_.dropLeft = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple2_Impl_.dropRight = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple2_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx.core._Tuple.Tuple2_Impl_.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx.core._Tuple.Tuple3_Impl_ = {};
thx.core._Tuple.Tuple3_Impl_.__name__ = ["thx","core","_Tuple","Tuple3_Impl_"];
thx.core._Tuple.Tuple3_Impl_._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx.core._Tuple.Tuple3_Impl_.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx.core._Tuple.Tuple3_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx.core._Tuple.Tuple3_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx.core._Tuple.Tuple3_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx.core._Tuple.Tuple3_Impl_.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx.core._Tuple.Tuple4_Impl_ = {};
thx.core._Tuple.Tuple4_Impl_.__name__ = ["thx","core","_Tuple","Tuple4_Impl_"];
thx.core._Tuple.Tuple4_Impl_._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx.core._Tuple.Tuple4_Impl_.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx.core._Tuple.Tuple4_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx.core._Tuple.Tuple4_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx.core._Tuple.Tuple4_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx.core._Tuple.Tuple4_Impl_.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx.core._Tuple.Tuple5_Impl_ = {};
thx.core._Tuple.Tuple5_Impl_.__name__ = ["thx","core","_Tuple","Tuple5_Impl_"];
thx.core._Tuple.Tuple5_Impl_._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx.core._Tuple.Tuple5_Impl_.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx.core._Tuple.Tuple5_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx.core._Tuple.Tuple5_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx.core._Tuple.Tuple5_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx.core._Tuple.Tuple5_Impl_.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx.core._Tuple.Tuple6_Impl_ = {};
thx.core._Tuple.Tuple6_Impl_.__name__ = ["thx","core","_Tuple","Tuple6_Impl_"];
thx.core._Tuple.Tuple6_Impl_._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx.core._Tuple.Tuple6_Impl_.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx.core._Tuple.Tuple6_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx.core._Tuple.Tuple6_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx.core._Tuple.Tuple6_Impl_.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx.core.Types = function() { };
thx.core.Types.__name__ = ["thx","core","Types"];
thx.core.Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx.core.Types.isPrimitive = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 1:case 2:case 3:
			return true;
		case 0:case 5:case 7:case 4:case 8:
			return false;
		case 6:
			var c = _g[2];
			return Type.getClassName(c) == "String";
		}
	}
};
thx.core.Types.hasSuperClass = function(cls,sup) {
	while(null != cls) {
		if(cls == sup) return true;
		cls = Type.getSuperClass(cls);
	}
	return false;
};
thx.core.Types.sameType = function(a,b) {
	return thx.core.Types.typeToString(Type["typeof"](a)) == thx.core.Types.typeToString(Type["typeof"](b));
};
thx.core.Types.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["{}"];
	case 5:
		return ["Function"];
	case 6:
		var c = type[2];
		var classes = [];
		while(null != c) {
			classes.push(c);
			c = Type.getSuperClass(c);
		}
		return classes.map(Type.getClassName);
	case 7:
		var e = type[2];
		return [Type.getEnumName(e)];
	default:
		throw "invalid type " + Std.string(type);
	}
};
thx.core.Types.typeToString = function(type) {
	switch(type[1]) {
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "{}";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		throw "invalid type " + Std.string(type);
	}
};
thx.core.Types.valueTypeInheritance = function(value) {
	return thx.core.Types.typeInheritance(Type["typeof"](value));
};
thx.core.Types.valueTypeToString = function(value) {
	return thx.core.Types.typeToString(Type["typeof"](value));
};
thx.core.error = {};
thx.core.error.AbstractMethod = function(posInfo) {
	thx.core.Error.call(this,"method " + posInfo.className + "." + posInfo.methodName + "() is abstract",null,posInfo);
};
thx.core.error.AbstractMethod.__name__ = ["thx","core","error","AbstractMethod"];
thx.core.error.AbstractMethod.__super__ = thx.core.Error;
thx.core.error.AbstractMethod.prototype = $extend(thx.core.Error.prototype,{
	__class__: thx.core.error.AbstractMethod
});
thx.core.error.NullArgument = function(message,posInfo) {
	thx.core.Error.call(this,message,null,posInfo);
};
thx.core.error.NullArgument.__name__ = ["thx","core","error","NullArgument"];
thx.core.error.NullArgument.__super__ = thx.core.Error;
thx.core.error.NullArgument.prototype = $extend(thx.core.Error.prototype,{
	__class__: thx.core.error.NullArgument
});
thx.promise = {};
thx.promise.Future = function() {
	this.handlers = [];
	this.state = haxe.ds.Option.None;
};
thx.promise.Future.__name__ = ["thx","promise","Future"];
thx.promise.Future.all = function(arr) {
	return thx.promise.Future.create(function(callback) {
		var results = [];
		var counter = 0;
		thx.core.Arrays.mapi(arr,function(p,i) {
			p.then(function(value) {
				results[i] = value;
				counter++;
				if(counter == arr.length) callback(results);
			});
		});
	});
};
thx.promise.Future.create = function(handler) {
	var future = new thx.promise.Future();
	handler($bind(future,future.setState));
	return future;
};
thx.promise.Future.flatMap = function(future) {
	return thx.promise.Future.create(function(callback) {
		future.then(function(future1) {
			future1.then(callback);
		});
	});
};
thx.promise.Future.value = function(v) {
	return thx.promise.Future.create(function(callback) {
		callback(v);
	});
};
thx.promise.Future.prototype = {
	handlers: null
	,state: null
	,delay: function(delayms) {
		if(null == delayms) return thx.promise.Future.flatMap(this.map(function(value) {
			return thx.promise.Timer.immediateValue(value);
		})); else return thx.promise.Future.flatMap(this.map(function(value1) {
			return thx.promise.Timer.delayValue(value1,delayms);
		}));
	}
	,hasValue: function() {
		return thx.core.Options.toBool(this.state);
	}
	,map: function(handler) {
		var _g = this;
		return thx.promise.Future.create(function(callback) {
			_g.then(function(value) {
				callback(handler(value));
			});
		});
	}
	,mapAsync: function(handler) {
		var _g = this;
		return thx.promise.Future.create(function(callback) {
			_g.then(function(result) {
				handler(result,callback);
			});
		});
	}
	,mapFuture: function(handler) {
		return thx.promise.Future.flatMap(this.map(handler));
	}
	,then: function(handler) {
		this.handlers.push(handler);
		this.update();
		return this;
	}
	,toString: function() {
		return "Future";
	}
	,setState: function(newstate) {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				this.state = haxe.ds.Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx.core.Error("future was already \"" + Std.string(r) + "\", can't apply the new state \"" + Std.string(newstate) + "\"",null,{ fileName : "Future.hx", lineNumber : 85, className : "thx.promise.Future", methodName : "setState"});
				break;
			}
		}
		this.update();
		return this;
	}
	,update: function() {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				break;
			case 0:
				var result = _g[2];
				var index = -1;
				while(++index < this.handlers.length) this.handlers[index](result);
				this.handlers = [];
				break;
			}
		}
	}
	,__class__: thx.promise.Future
};
thx.promise.Futures = function() { };
thx.promise.Futures.__name__ = ["thx","promise","Futures"];
thx.promise.Futures.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			callback({ _0 : v1, _1 : v2});
		};
		p1.then(function(v) {
			counter++;
			v1 = v;
			complete();
		});
		p2.then(function(v3) {
			counter++;
			v2 = v3;
			complete();
		});
	});
};
thx.promise.Futures.log = function(future,prefix) {
	if(prefix == null) prefix = "";
	return future.then(function(r) {
		haxe.Log.trace("" + prefix + " VALUE: " + Std.string(r),{ fileName : "Future.hx", lineNumber : 132, className : "thx.promise.Futures", methodName : "log"});
	});
};
thx.promise.FutureTuple6 = function() { };
thx.promise.FutureTuple6.__name__ = ["thx","promise","FutureTuple6"];
thx.promise.FutureTuple6.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.FutureTuple6.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5,cb);
		return;
	});
};
thx.promise.FutureTuple6.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	}));
};
thx.promise.FutureTuple6.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.FutureTuple5 = function() { };
thx.promise.FutureTuple5.__name__ = ["thx","promise","FutureTuple5"];
thx.promise.FutureTuple5.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple5.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.FutureTuple5.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,cb);
		return;
	});
};
thx.promise.FutureTuple5.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	}));
};
thx.promise.FutureTuple5.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.FutureTuple4 = function() { };
thx.promise.FutureTuple4.__name__ = ["thx","promise","FutureTuple4"];
thx.promise.FutureTuple4.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple4.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	});
};
thx.promise.FutureTuple4.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,cb);
		return;
	});
};
thx.promise.FutureTuple4.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	}));
};
thx.promise.FutureTuple4.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3);
	});
};
thx.promise.FutureTuple3 = function() { };
thx.promise.FutureTuple3.__name__ = ["thx","promise","FutureTuple3"];
thx.promise.FutureTuple3.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple3.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2);
	});
};
thx.promise.FutureTuple3.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,cb);
		return;
	});
};
thx.promise.FutureTuple3.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2);
	}));
};
thx.promise.FutureTuple3.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2);
	});
};
thx.promise.FutureTuple2 = function() { };
thx.promise.FutureTuple2.__name__ = ["thx","promise","FutureTuple2"];
thx.promise.FutureTuple2.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple2.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1);
	});
};
thx.promise.FutureTuple2.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,cb);
		return;
	});
};
thx.promise.FutureTuple2.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1);
	}));
};
thx.promise.FutureTuple2.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1);
	});
};
thx.promise.FutureNil = function() { };
thx.promise.FutureNil.__name__ = ["thx","promise","FutureNil"];
thx.promise.FutureNil.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback(t._1);
		});
	});
};
thx.promise._Promise = {};
thx.promise._Promise.Promise_Impl_ = {};
thx.promise._Promise.Promise_Impl_.__name__ = ["thx","promise","_Promise","Promise_Impl_"];
thx.promise._Promise.Promise_Impl_.futureToPromise = function(future) {
	return future.map(function(v) {
		return thx.core.Either.Right(v);
	});
};
thx.promise._Promise.Promise_Impl_.all = function(arr) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		var results = [];
		var counter = 0;
		var hasError = false;
		thx.core.Arrays.mapi(arr,function(p,i) {
			thx.promise._Promise.Promise_Impl_.either(p,function(value) {
				if(hasError) return;
				results[i] = value;
				counter++;
				if(counter == arr.length) resolve(results);
			},function(err) {
				if(hasError) return;
				hasError = true;
				reject(err);
			});
		});
	});
};
thx.promise._Promise.Promise_Impl_.create = function(callback) {
	return thx.promise.Future.create(function(cb) {
		callback(function(value) {
			cb(thx.core.Either.Right(value));
		},function(error) {
			cb(thx.core.Either.Left(error));
		});
	});
};
thx.promise._Promise.Promise_Impl_.createFulfill = function(callback) {
	return thx.promise.Future.create(callback);
};
thx.promise._Promise.Promise_Impl_.error = function(err) {
	return thx.promise._Promise.Promise_Impl_.create(function(_,reject) {
		reject(err);
	});
};
thx.promise._Promise.Promise_Impl_.value = function(v) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,_) {
		resolve(v);
	});
};
thx.promise._Promise.Promise_Impl_.always = function(this1,handler) {
	this1.then(function(_) {
		handler();
	});
};
thx.promise._Promise.Promise_Impl_.either = function(this1,success,failure) {
	this1.then(function(r) {
		switch(r[1]) {
		case 1:
			var value = r[2];
			success(value);
			break;
		case 0:
			var error = r[2];
			failure(error);
			break;
		}
	});
	return this1;
};
thx.promise._Promise.Promise_Impl_.delay = function(this1,delayms) {
	return this1.delay(delayms);
};
thx.promise._Promise.Promise_Impl_.isFailure = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 1:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx.promise._Promise.Promise_Impl_.isResolved = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 0:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx.promise._Promise.Promise_Impl_.failure = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.either(this1,function(_) {
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapAlways = function(this1,handler) {
	return this1.map(function(_) {
		return handler();
	});
};
thx.promise._Promise.Promise_Impl_.mapAlwaysAsync = function(this1,handler) {
	return this1.mapAsync(function(_,cb) {
		handler(cb);
		return;
	});
};
thx.promise._Promise.Promise_Impl_.mapAlwaysFuture = function(this1,handler) {
	return thx.promise.Future.flatMap(this1.map(function(_) {
		return handler();
	}));
};
thx.promise._Promise.Promise_Impl_.mapEither = function(this1,success,failure) {
	return this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	});
};
thx.promise._Promise.Promise_Impl_.mapEitherFuture = function(this1,success,failure) {
	return thx.promise.Future.flatMap(this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	}));
};
thx.promise._Promise.Promise_Impl_.mapFailure = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.mapEither(this1,function(value) {
		return value;
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapFailureFuture = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,function(value) {
		return thx.promise.Future.value(value);
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapSuccess = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,function(v) {
		return thx.promise._Promise.Promise_Impl_.value(success(v));
	},function(err) {
		return thx.promise._Promise.Promise_Impl_.error(err);
	});
};
thx.promise._Promise.Promise_Impl_.mapSuccessPromise = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,success,function(err) {
		return thx.promise._Promise.Promise_Impl_.error(err);
	});
};
thx.promise._Promise.Promise_Impl_.success = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.either(this1,success,function(_) {
	});
};
thx.promise._Promise.Promise_Impl_.throwFailure = function(this1) {
	return thx.promise._Promise.Promise_Impl_.failure(this1,function(err) {
		throw err;
	});
};
thx.promise._Promise.Promise_Impl_.toString = function(this1) {
	return "Promise";
};
thx.promise.Promises = function() { };
thx.promise.Promises.__name__ = ["thx","promise","Promises"];
thx.promise.Promises.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		var hasError = false;
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			resolve({ _0 : v1, _1 : v2});
		};
		var handleError = function(error) {
			if(hasError) return;
			hasError = true;
			reject(error);
		};
		thx.promise._Promise.Promise_Impl_.either(p1,function(v) {
			if(hasError) return;
			counter++;
			v1 = v;
			complete();
		},handleError);
		thx.promise._Promise.Promise_Impl_.either(p2,function(v3) {
			if(hasError) return;
			counter++;
			v2 = v3;
			complete();
		},handleError);
	});
};
thx.promise.Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return thx.promise._Promise.Promise_Impl_.either(promise,function(r) {
		haxe.Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 174, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe.Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 175, className : "thx.promise.Promises", methodName : "log"});
	});
};
thx.promise.PromiseTuple6 = function() { };
thx.promise.PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx.promise.PromiseTuple6.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.PromiseTuple6.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.PromiseTuple6.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple5 = function() { };
thx.promise.PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx.promise.PromiseTuple5.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple5.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.PromiseTuple5.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.PromiseTuple5.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple4 = function() { };
thx.promise.PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx.promise.PromiseTuple4.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple4.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx.promise.PromiseTuple4.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx.promise.PromiseTuple4.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple3 = function() { };
thx.promise.PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx.promise.PromiseTuple3.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple3.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx.promise.PromiseTuple3.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx.promise.PromiseTuple3.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple2 = function() { };
thx.promise.PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx.promise.PromiseTuple2.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple2.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx.promise.PromiseTuple2.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx.promise.PromiseTuple2.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseNil = function() { };
thx.promise.PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx.promise.PromiseNil.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.Timer = function() { };
thx.promise.Timer.__name__ = ["thx","promise","Timer"];
thx.promise.Timer.delay = function(delayms) {
	return thx.promise.Timer.delayValue(thx.core.Nil.nil,delayms);
};
thx.promise.Timer.delayValue = function(value,delayms) {
	return thx.promise.Future.create(function(callback) {
		thx.core.Timer.delay((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value),delayms);
	});
};
thx.promise.Timer.immediate = function() {
	return thx.promise.Timer.immediateValue(thx.core.Nil.nil);
};
thx.promise.Timer.immediateValue = function(value) {
	return thx.promise.Future.create(function(callback) {
		thx.core.Timer.immediate((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value));
	});
};
thx.stream = {};
thx.stream.Emitter = function(init) {
	this.init = init;
};
thx.stream.Emitter.__name__ = ["thx","stream","Emitter"];
thx.stream.Emitter.prototype = {
	init: null
	,feed: function(value) {
		var stream = new thx.stream.Stream(null);
		stream.subscriber = function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				value.set(v);
				break;
			case 1:
				var c = r[2];
				if(c) stream.cancel(); else stream.end();
				break;
			}
		};
		value.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(value.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,plug: function(bus) {
		var stream = new thx.stream.Stream(null);
		stream.subscriber = $bind(bus,bus.emit);
		bus.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(bus.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,sign: function(subscriber) {
		var stream = new thx.stream.Stream(subscriber);
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,end) {
		if(null != pulse) pulse = pulse; else pulse = function(_) {
		};
		if(null != end) end = end; else end = function(_1) {
		};
		var stream = new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				pulse(v);
				break;
			case 1:
				var c = r[2];
				end(c);
				break;
			}
		});
		this.init(stream);
		return stream;
	}
	,concat: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					stream.pulse(v);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						other.init(stream);
						break;
					}
					break;
				}
			}));
		});
	}
	,count: function() {
		return this.map((function() {
			var c = 0;
			return function(_) {
				return ++c;
			};
		})());
	}
	,debounce: function(delay) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var cancel = function() {
			};
			stream.addCleanUp(function() {
				cancel();
			});
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					cancel();
					cancel = thx.core.Timer.delay((function(f,v1) {
						return function() {
							f(v1);
						};
					})($bind(stream,stream.pulse),v),delay);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						thx.core.Timer.delay($bind(stream,stream.end),delay);
						break;
					}
					break;
				}
			}));
		});
	}
	,delay: function(time) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var cancel = thx.core.Timer.delay(function() {
				_g.init(stream);
			},time);
			stream.addCleanUp(cancel);
		});
	}
	,diff: function(init,f) {
		return this.window(2,null != init).map(function(a) {
			if(a.length == 1) return f(init,a[0]); else return f(a[0],a[1]);
		});
	}
	,merge: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
		});
	}
	,previous: function() {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var value = null;
			var first = true;
			var pulse = function() {
				if(first) {
					first = false;
					return;
				}
				stream.pulse(value);
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					pulse();
					value = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,reduce: function(acc,f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					acc = f(acc,v);
					stream.pulse(acc);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,window: function(size,emitWithLess) {
		if(emitWithLess == null) emitWithLess = false;
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var buf = [];
			var pulse = function() {
				if(buf.length > size) buf.shift();
				if(buf.length == size || emitWithLess) stream.pulse(buf.slice());
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					buf.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,map: function(f) {
		return this.mapFuture(function(v) {
			return thx.promise.Future.value(f(v));
		});
	}
	,mapFuture: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then($bind(stream,stream.pulse));
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,toOption: function() {
		return this.map(function(v) {
			if(null == v) return haxe.ds.Option.None; else return haxe.ds.Option.Some(v);
		});
	}
	,toNil: function() {
		return this.map(function(_) {
			return thx.core.Nil.nil;
		});
	}
	,toTrue: function() {
		return this.map(function(_) {
			return true;
		});
	}
	,toFalse: function() {
		return this.map(function(_) {
			return false;
		});
	}
	,toValue: function(value) {
		return this.map(function(_) {
			return value;
		});
	}
	,filter: function(f) {
		return this.filterFuture(function(v) {
			return thx.promise.Future.value(f(v));
		});
	}
	,filterFuture: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then(function(c) {
						if(c) stream.pulse(v);
					});
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,first: function() {
		return this.take(1);
	}
	,distinct: function(equals) {
		if(null == equals) equals = function(a,b) {
			return a == b;
		};
		var last = null;
		return this.filter(function(v) {
			if(equals(v,last)) return false; else {
				last = v;
				return true;
			}
		});
	}
	,last: function() {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var last = null;
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					last = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.pulse(last);
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,memberOf: function(arr,equality) {
		return this.filter(function(v) {
			return thx.core.Arrays.contains(arr,v,equality);
		});
	}
	,notNull: function() {
		return this.filter(function(v) {
			return v != null;
		});
	}
	,skip: function(n) {
		return this.skipUntil((function() {
			var count = 0;
			return function(_) {
				return count++ < n;
			};
		})());
	}
	,skipUntil: function(predicate) {
		return this.filter((function() {
			var flag = false;
			return function(v) {
				if(flag) return true;
				if(predicate(v)) return false;
				return flag = true;
			};
		})());
	}
	,take: function(count) {
		return this.takeUntil((function(counter) {
			return function(_) {
				return counter++ < count;
			};
		})(0));
	}
	,takeAt: function(index) {
		return this.take(index + 1).last();
	}
	,takeLast: function(n) {
		return thx.stream.EmitterArrays.flatten(this.window(n).last());
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var instream = null;
			instream = new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					if(f(v)) stream.pulse(v); else {
						instream.end();
						stream.end();
					}
					break;
				case 1:
					switch(r[2]) {
					case true:
						instream.cancel();
						stream.cancel();
						break;
					case false:
						instream.end();
						stream.end();
						break;
					}
					break;
				}
			});
			_g.init(instream);
		});
	}
	,withValue: function(expected) {
		return this.filter(function(v) {
			return v == expected;
		});
	}
	,pair: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,sampleBy: function(sampler) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			sampler.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,samplerOf: function(sampled) {
		return sampled.sampleBy(this).map(function(t) {
			return { _0 : t._1, _1 : t._0};
		});
	}
	,zip: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = [];
			var _1 = [];
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(_0.length == 0 || _1.length == 0) return;
				stream.pulse((function($this) {
					var $r;
					var _01 = _0.shift();
					var _11 = _1.shift();
					$r = { _0 : _01, _1 : _11};
					return $r;
				}(this)));
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1.push(v1);
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,audit: function(handler) {
		return this.map(function(v) {
			handler(v);
			return v;
		});
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe.Log.trace("" + prefix + Std.string(v),posInfo);
			return v;
		});
	}
	,split: function() {
		var _g = this;
		var inited = false;
		var streams = [];
		var init = function(stream) {
			streams.push(stream);
			if(!inited) {
				inited = true;
				thx.core.Timer.immediate(function() {
					_g.init(new thx.stream.Stream(function(r) {
						switch(r[1]) {
						case 0:
							var v = r[2];
							var _g1 = 0;
							while(_g1 < streams.length) {
								var s = streams[_g1];
								++_g1;
								s.pulse(v);
							}
							break;
						case 1:
							switch(r[2]) {
							case true:
								var _g11 = 0;
								while(_g11 < streams.length) {
									var s1 = streams[_g11];
									++_g11;
									s1.cancel();
								}
								break;
							case false:
								var _g12 = 0;
								while(_g12 < streams.length) {
									var s2 = streams[_g12];
									++_g12;
									s2.end();
								}
								break;
							}
							break;
						}
					}));
				});
			}
		};
		var _0 = new thx.stream.Emitter(init);
		var _1 = new thx.stream.Emitter(init);
		return { _0 : _0, _1 : _1};
	}
	,__class__: thx.stream.Emitter
};
thx.stream.Bus = function(distinctValuesOnly,equal) {
	if(distinctValuesOnly == null) distinctValuesOnly = false;
	var _g = this;
	this.distinctValuesOnly = distinctValuesOnly;
	if(null == equal) this.equal = function(a,b) {
		return a == b;
	}; else this.equal = equal;
	this.downStreams = [];
	this.upStreams = [];
	thx.stream.Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
	});
};
thx.stream.Bus.__name__ = ["thx","stream","Bus"];
thx.stream.Bus.__super__ = thx.stream.Emitter;
thx.stream.Bus.prototype = $extend(thx.stream.Emitter.prototype,{
	downStreams: null
	,upStreams: null
	,distinctValuesOnly: null
	,equal: null
	,value: null
	,cancel: function() {
		this.emit(thx.stream.StreamValue.End(true));
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,emit: function(value) {
		switch(value[1]) {
		case 0:
			var v = value[2];
			if(this.distinctValuesOnly) {
				if(this.equal(v,this.value)) return;
				this.value = v;
			}
			var _g = 0;
			var _g1 = this.downStreams.slice();
			while(_g < _g1.length) {
				var stream = _g1[_g];
				++_g;
				stream.pulse(v);
			}
			break;
		case 1:
			switch(value[2]) {
			case true:
				var _g2 = 0;
				var _g11 = this.downStreams.slice();
				while(_g2 < _g11.length) {
					var stream1 = _g11[_g2];
					++_g2;
					stream1.cancel();
				}
				break;
			case false:
				var _g3 = 0;
				var _g12 = this.downStreams.slice();
				while(_g3 < _g12.length) {
					var stream2 = _g12[_g3];
					++_g3;
					stream2.end();
				}
				break;
			}
			break;
		}
	}
	,end: function() {
		this.emit(thx.stream.StreamValue.End(false));
	}
	,pulse: function(value) {
		this.emit(thx.stream.StreamValue.Pulse(value));
	}
	,__class__: thx.stream.Bus
});
thx.stream.Emitters = function() { };
thx.stream.Emitters.__name__ = ["thx","stream","Emitters"];
thx.stream.Emitters.skipNull = function(emitter) {
	return emitter.filter(function(value) {
		return null != value;
	});
};
thx.stream.Emitters.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = [];
		return function(v) {
			if(HxOverrides.indexOf(buf,v,0) >= 0) return false; else {
				buf.push(v);
				return true;
			}
		};
	})());
};
thx.stream.EmitterStrings = function() { };
thx.stream.EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx.stream.EmitterStrings.match = function(emitter,pattern) {
	return emitter.filter(function(s) {
		return pattern.match(s);
	});
};
thx.stream.EmitterStrings.toBool = function(emitter) {
	return emitter.map(function(s) {
		return s != null && s != "";
	});
};
thx.stream.EmitterStrings.truthy = function(emitter) {
	return emitter.filter(function(s) {
		return s != null && s != "";
	});
};
thx.stream.EmitterStrings.unique = function(emitter) {
	return emitter.filter((function() {
		var buf_h = { };
		return function(v) {
			if(buf_h.hasOwnProperty("$" + v)) return false; else {
				buf_h["$" + v] = true;
				return true;
			}
		};
	})());
};
thx.stream.EmitterInts = function() { };
thx.stream.EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx.stream.EmitterInts.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx.stream.EmitterInts.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx.stream.EmitterInts.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx.stream.EmitterInts.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx.stream.EmitterInts.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx.stream.EmitterInts.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx.stream.EmitterInts.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx.stream.EmitterInts.max = function(emitter) {
	return emitter.filter((function() {
		var max = null;
		return function(v) {
			if(null == max || v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterInts.min = function(emitter) {
	return emitter.filter((function() {
		var min = null;
		return function(v) {
			if(null == min || v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterInts.sum = function(emitter) {
	return emitter.map((function() {
		var value = 0;
		return function(v) {
			return value += v;
		};
	})());
};
thx.stream.EmitterInts.toBool = function(emitter) {
	return emitter.map(function(i) {
		return i != 0;
	});
};
thx.stream.EmitterInts.unique = function(emitter) {
	return emitter.filter((function() {
		var buf_h = { };
		return function(v) {
			if(buf_h.hasOwnProperty(v)) return false; else {
				buf_h[v] = true;
				return true;
			}
		};
	})());
};
thx.stream.EmitterFloats = function() { };
thx.stream.EmitterFloats.__name__ = ["thx","stream","EmitterFloats"];
thx.stream.EmitterFloats.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx.stream.EmitterFloats.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx.stream.EmitterFloats.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx.stream.EmitterFloats.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx.stream.EmitterFloats.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx.stream.EmitterFloats.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx.stream.EmitterFloats.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx.stream.EmitterFloats.max = function(emitter) {
	return emitter.filter((function() {
		var max = -Infinity;
		return function(v) {
			if(v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterFloats.min = function(emitter) {
	return emitter.filter((function() {
		var min = Infinity;
		return function(v) {
			if(v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterFloats.sum = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		return function(v) {
			return sum += v;
		};
	})());
};
thx.stream.EmitterOptions = function() { };
thx.stream.EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx.stream.EmitterOptions.either = function(emitter,some,none,end) {
	if(null == some) some = function(_) {
	};
	if(null == none) none = function() {
	};
	return emitter.subscribe(function(o) {
		switch(o[1]) {
		case 0:
			var v = o[2];
			some(v);
			break;
		case 1:
			none();
			break;
		}
	},end);
};
thx.stream.EmitterOptions.filterOption = function(emitter) {
	return emitter.filter(function(opt) {
		return thx.core.Options.toBool(opt);
	}).map(function(opt1) {
		return thx.core.Options.toValue(opt1);
	});
};
thx.stream.EmitterOptions.toBool = function(emitter) {
	return emitter.map(function(opt) {
		return thx.core.Options.toBool(opt);
	});
};
thx.stream.EmitterOptions.toValue = function(emitter) {
	return emitter.map(function(opt) {
		return thx.core.Options.toValue(opt);
	});
};
thx.stream.EmitterBools = function() { };
thx.stream.EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx.stream.EmitterBools.negate = function(emitter) {
	return emitter.map(function(v) {
		return !v;
	});
};
thx.stream.EmitterEmitters = function() { };
thx.stream.EmitterEmitters.__name__ = ["thx","stream","EmitterEmitters"];
thx.stream.EmitterEmitters.flatMap = function(emitter) {
	return new thx.stream.Emitter(function(stream) {
		emitter.init(new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var em = r[2];
				em.init(stream);
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
thx.stream.EmitterArrays = function() { };
thx.stream.EmitterArrays.__name__ = ["thx","stream","EmitterArrays"];
thx.stream.EmitterArrays.containerOf = function(emitter,value) {
	return emitter.filter(function(arr) {
		return HxOverrides.indexOf(arr,value,0) >= 0;
	});
};
thx.stream.EmitterArrays.flatten = function(emitter) {
	return new thx.stream.Emitter(function(stream) {
		emitter.init(new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var arr = r[2];
				arr.map($bind(stream,stream.pulse));
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
thx.stream.EmitterValues = function() { };
thx.stream.EmitterValues.__name__ = ["thx","stream","EmitterValues"];
thx.stream.EmitterValues.left = function(emitter) {
	return emitter.map(function(v) {
		return v._0;
	});
};
thx.stream.EmitterValues.right = function(emitter) {
	return emitter.map(function(v) {
		return v._1;
	});
};
thx.stream.IStream = function() { };
thx.stream.IStream.__name__ = ["thx","stream","IStream"];
thx.stream.IStream.prototype = {
	cancel: null
	,__class__: thx.stream.IStream
};
thx.stream.Stream = function(subscriber) {
	this.subscriber = subscriber;
	this.cleanUps = [];
	this.finalized = false;
	this.canceled = false;
};
thx.stream.Stream.__name__ = ["thx","stream","Stream"];
thx.stream.Stream.__interfaces__ = [thx.stream.IStream];
thx.stream.Stream.prototype = {
	subscriber: null
	,cleanUps: null
	,finalized: null
	,canceled: null
	,addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx.stream.StreamValue.End(true));
	}
	,end: function() {
		this.finalize(thx.stream.StreamValue.End(false));
	}
	,pulse: function(v) {
		this.subscriber(thx.stream.StreamValue.Pulse(v));
	}
	,finalize: function(signal) {
		if(this.finalized) return;
		this.finalized = true;
		while(this.cleanUps.length > 0) (this.cleanUps.shift())();
		this.subscriber(signal);
		this.subscriber = function(_) {
		};
	}
	,__class__: thx.stream.Stream
};
thx.stream.StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End"] };
thx.stream.StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.Value = function(value,equals) {
	var _g = this;
	if(null == equals) this.equals = thx.core.Functions.equality; else this.equals = equals;
	this.value = value;
	this.downStreams = [];
	this.upStreams = [];
	thx.stream.Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
		stream.pulse(_g.value);
	});
};
thx.stream.Value.__name__ = ["thx","stream","Value"];
thx.stream.Value.createOption = function(value,equals) {
	var def;
	if(null == value) def = haxe.ds.Option.None; else def = haxe.ds.Option.Some(value);
	return new thx.stream.Value(def,function(a,b) {
		return thx.core.Options.equals(a,b,equals);
	});
};
thx.stream.Value.__super__ = thx.stream.Emitter;
thx.stream.Value.prototype = $extend(thx.stream.Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,equals: null
	,get: function() {
		return this.value;
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,set: function(value) {
		if(this.equals(this.value,value)) return;
		this.value = value;
		this.update();
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.pulse(this.value);
		}
	}
	,__class__: thx.stream.Value
});
thx.stream.dom = {};
thx.stream.dom.Dom = function() { };
thx.stream.dom.Dom.__name__ = ["thx","stream","dom","Dom"];
thx.stream.dom.Dom.ready = function() {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx.core.Nil.nil);
		},false);
	});
};
thx.stream.dom.Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"click",capture);
};
thx.stream.dom.Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx.stream.Emitter(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx.stream.dom.Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"focus",capture).toTrue().merge(thx.stream.dom.Dom.streamEvent(el,"blur",capture).toFalse());
};
thx.stream.dom.Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx.stream.Emitter((function($this) {
		var $r;
		if(!StringTools.startsWith(name,"key")) name = "key" + name;
		$r = function(stream) {
			el.addEventListener(name,$bind(stream,stream.pulse),capture);
			stream.addCleanUp(function() {
				el.removeEventListener(name,$bind(stream,stream.pulse),capture);
			});
		};
		return $r;
	}(this)));
};
thx.stream.dom.Dom.streamChecked = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.checked;
	});
};
thx.stream.dom.Dom.streamChange = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.value;
	});
};
thx.stream.dom.Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"input",capture).map(function(_) {
		return el.value;
	});
};
thx.stream.dom.Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousedown",capture);
};
thx.stream.dom.Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,name,capture);
};
thx.stream.dom.Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousemove",capture);
};
thx.stream.dom.Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mouseup",capture);
};
thx.stream.dom.Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx.stream.dom.Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx.stream.dom.Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx.stream.dom.Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
	};
};
thx.stream.dom.Dom.subscribeToggleAttribute = function(el,name,value) {
	if(null == value) value = el.getAttribute(name);
	return function(on) {
		if(on) el.setAttribute(name,value); else el.removeAttribute(name);
	};
};
thx.stream.dom.Dom.subscribeToggleClass = function(el,name) {
	return function(on) {
		if(on) el.classList.add(name); else el.classList.remove(name);
	};
};
thx.stream.dom.Dom.subscribeSwapClass = function(el,nameOn,nameOff) {
	return function(on) {
		if(on) {
			el.classList.add(nameOn);
			el.classList.remove(nameOff);
		} else {
			el.classList.add(nameOff);
			el.classList.remove(nameOn);
		}
	};
};
thx.stream.dom.Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
thx.unit = {};
thx.unit.angle = {};
thx.unit.angle._BinaryDegree = {};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_ = {};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.__name__ = ["thx","unit","angle","_BinaryDegree","BinaryDegree_Impl_"];
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.pointToBinaryDegree = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 40.7436654315252);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.floatToBinaryDegree = function(value) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(value);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0245436926061703);
	return Math.cos(this2);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0245436926061703);
	return Math.sin(this2);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(value);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(value);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(value);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(a);
		return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.turn + other);
	} else return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(a);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(a - thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.turn); else return a;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.negate = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(-this1);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.add = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 + other);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 - other);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * other);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.divide = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 / other);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 % other);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.equal = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1) == other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1) != other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 1.40625);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 1.5625);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 0.09375);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 84.375);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 0.125);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.015625);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0245436926061703);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.00390625);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 5062.5);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.0234375);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.00390625);
};
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.toString = function(this1) {
	return this1 + "binary degree";
};
thx.unit.angle._Degree = {};
thx.unit.angle._Degree.Degree_Impl_ = {};
thx.unit.angle._Degree.Degree_Impl_.__name__ = ["thx","unit","angle","_Degree","Degree_Impl_"];
thx.unit.angle._Degree.Degree_Impl_.pointToDegree = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 57.2957795130823);
};
thx.unit.angle._Degree.Degree_Impl_.floatToDegree = function(value) {
	return thx.unit.angle._Degree.Degree_Impl_._new(value);
};
thx.unit.angle._Degree.Degree_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Degree.Degree_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0174532925199433);
	return Math.cos(this2);
};
thx.unit.angle._Degree.Degree_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0174532925199433);
	return Math.sin(this2);
};
thx.unit.angle._Degree.Degree_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Degree.Degree_Impl_._new(value);
};
thx.unit.angle._Degree.Degree_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Degree.Degree_Impl_._new(value);
};
thx.unit.angle._Degree.Degree_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Degree.Degree_Impl_._new(value);
};
thx.unit.angle._Degree.Degree_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Degree.Degree_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Degree.Degree_Impl_._new(a);
		return thx.unit.angle._Degree.Degree_Impl_._new(thx.unit.angle._Degree.Degree_Impl_.turn + other);
	} else return thx.unit.angle._Degree.Degree_Impl_._new(a);
};
thx.unit.angle._Degree.Degree_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Degree.Degree_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Degree.Degree_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Degree.Degree_Impl_._new(a - thx.unit.angle._Degree.Degree_Impl_.turn); else return a;
};
thx.unit.angle._Degree.Degree_Impl_.negate = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(-this1);
};
thx.unit.angle._Degree.Degree_Impl_.add = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 + other);
};
thx.unit.angle._Degree.Degree_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 - other);
};
thx.unit.angle._Degree.Degree_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * other);
};
thx.unit.angle._Degree.Degree_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 / other);
};
thx.unit.angle._Degree.Degree_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 % other);
};
thx.unit.angle._Degree.Degree_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1) == other;
};
thx.unit.angle._Degree.Degree_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Degree.Degree_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1) != other;
};
thx.unit.angle._Degree.Degree_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Degree.Degree_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Degree.Degree_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Degree.Degree_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Degree.Degree_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Degree.Degree_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 0.711111111111111);
};
thx.unit.angle._Degree.Degree_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 1.11111111111111);
};
thx.unit.angle._Degree.Degree_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 0.0666666666666667);
};
thx.unit.angle._Degree.Degree_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 60);
};
thx.unit.angle._Degree.Degree_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 0.0888888888888889);
};
thx.unit.angle._Degree.Degree_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.0111111111111111);
};
thx.unit.angle._Degree.Degree_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.0174532925199433);
};
thx.unit.angle._Degree.Degree_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.00277777777777778);
};
thx.unit.angle._Degree.Degree_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 3600);
};
thx.unit.angle._Degree.Degree_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.0166666666666667);
};
thx.unit.angle._Degree.Degree_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.00277777777777778);
};
thx.unit.angle._Degree.Degree_Impl_.toString = function(this1) {
	return this1 + "°";
};
thx.unit.angle._Grad = {};
thx.unit.angle._Grad.Grad_Impl_ = {};
thx.unit.angle._Grad.Grad_Impl_.__name__ = ["thx","unit","angle","_Grad","Grad_Impl_"];
thx.unit.angle._Grad.Grad_Impl_.pointToGrad = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 63.6619772367581);
};
thx.unit.angle._Grad.Grad_Impl_.floatToGrad = function(value) {
	return thx.unit.angle._Grad.Grad_Impl_._new(value);
};
thx.unit.angle._Grad.Grad_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Grad.Grad_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.015707963267949);
	return Math.cos(this2);
};
thx.unit.angle._Grad.Grad_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.015707963267949);
	return Math.sin(this2);
};
thx.unit.angle._Grad.Grad_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Grad.Grad_Impl_._new(value);
};
thx.unit.angle._Grad.Grad_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Grad.Grad_Impl_._new(value);
};
thx.unit.angle._Grad.Grad_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Grad.Grad_Impl_._new(value);
};
thx.unit.angle._Grad.Grad_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Grad.Grad_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Grad.Grad_Impl_._new(a);
		return thx.unit.angle._Grad.Grad_Impl_._new(thx.unit.angle._Grad.Grad_Impl_.turn + other);
	} else return thx.unit.angle._Grad.Grad_Impl_._new(a);
};
thx.unit.angle._Grad.Grad_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Grad.Grad_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Grad.Grad_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Grad.Grad_Impl_._new(a - thx.unit.angle._Grad.Grad_Impl_.turn); else return a;
};
thx.unit.angle._Grad.Grad_Impl_.negate = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(-this1);
};
thx.unit.angle._Grad.Grad_Impl_.add = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 + other);
};
thx.unit.angle._Grad.Grad_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 - other);
};
thx.unit.angle._Grad.Grad_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * other);
};
thx.unit.angle._Grad.Grad_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 / other);
};
thx.unit.angle._Grad.Grad_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 % other);
};
thx.unit.angle._Grad.Grad_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1) == other;
};
thx.unit.angle._Grad.Grad_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Grad.Grad_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1) != other;
};
thx.unit.angle._Grad.Grad_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Grad.Grad_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Grad.Grad_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Grad.Grad_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Grad.Grad_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Grad.Grad_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 0.64);
};
thx.unit.angle._Grad.Grad_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 0.9);
};
thx.unit.angle._Grad.Grad_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 0.06);
};
thx.unit.angle._Grad.Grad_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 54);
};
thx.unit.angle._Grad.Grad_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 0.08);
};
thx.unit.angle._Grad.Grad_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.01);
};
thx.unit.angle._Grad.Grad_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.015707963267949);
};
thx.unit.angle._Grad.Grad_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.0025);
};
thx.unit.angle._Grad.Grad_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 3240);
};
thx.unit.angle._Grad.Grad_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.015);
};
thx.unit.angle._Grad.Grad_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.0025);
};
thx.unit.angle._Grad.Grad_Impl_.toString = function(this1) {
	return this1 + "grad";
};
thx.unit.angle._HourAngle = {};
thx.unit.angle._HourAngle.HourAngle_Impl_ = {};
thx.unit.angle._HourAngle.HourAngle_Impl_.__name__ = ["thx","unit","angle","_HourAngle","HourAngle_Impl_"];
thx.unit.angle._HourAngle.HourAngle_Impl_.pointToHourAngle = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 3.81971863420549);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.floatToHourAngle = function(value) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(value);
};
thx.unit.angle._HourAngle.HourAngle_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.261799387799149);
	return Math.cos(this2);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.261799387799149);
	return Math.sin(this2);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(value);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(value);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(value);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._HourAngle.HourAngle_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._HourAngle.HourAngle_Impl_._new(a);
		return thx.unit.angle._HourAngle.HourAngle_Impl_._new(thx.unit.angle._HourAngle.HourAngle_Impl_.turn + other);
	} else return thx.unit.angle._HourAngle.HourAngle_Impl_._new(a);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._HourAngle.HourAngle_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._HourAngle.HourAngle_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._HourAngle.HourAngle_Impl_._new(a - thx.unit.angle._HourAngle.HourAngle_Impl_.turn); else return a;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.negate = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(-this1);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.add = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 + other);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 - other);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * other);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.divide = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 / other);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 % other);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.equal = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1) == other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1) != other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 10.6666666666667);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 15);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 16.6666666666667);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 900);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 1.33333333333333);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.166666666666667);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.261799387799149);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.0416666666666667);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 54000);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.25);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.0416666666666667);
};
thx.unit.angle._HourAngle.HourAngle_Impl_.toString = function(this1) {
	return this1 + "hour";
};
thx.unit.angle._MinuteOfArc = {};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_ = {};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.__name__ = ["thx","unit","angle","_MinuteOfArc","MinuteOfArc_Impl_"];
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.pointToMinuteOfArc = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 3437.74677078494);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.floatToMinuteOfArc = function(value) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(value);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.000290888208665722);
	return Math.cos(this2);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.000290888208665722);
	return Math.sin(this2);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(value);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(value);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(value);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(a);
		return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.turn + other);
	} else return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(a);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(a - thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.turn); else return a;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.negate = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(-this1);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.add = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 + other);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 - other);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * other);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.divide = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 / other);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 % other);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.equal = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1) == other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1) != other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 0.0118518518518519);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 0.0166666666666667);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 0.0185185185185185);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 0.00111111111111111);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 0.00148148148148148);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.000185185185185185);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.000290888208665722);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 4.62962962962963e-05);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 60);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.000277777777777778);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 4.62962962962963e-05);
};
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.toString = function(this1) {
	return this1 + "′";
};
thx.unit.angle._Point = {};
thx.unit.angle._Point.Point_Impl_ = {};
thx.unit.angle._Point.Point_Impl_.__name__ = ["thx","unit","angle","_Point","Point_Impl_"];
thx.unit.angle._Point.Point_Impl_.pointToPoint = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 5.09295817894065);
};
thx.unit.angle._Point.Point_Impl_.floatToPoint = function(value) {
	return thx.unit.angle._Point.Point_Impl_._new(value);
};
thx.unit.angle._Point.Point_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Point.Point_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.196349540849362);
	return Math.cos(this2);
};
thx.unit.angle._Point.Point_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.196349540849362);
	return Math.sin(this2);
};
thx.unit.angle._Point.Point_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Point.Point_Impl_._new(value);
};
thx.unit.angle._Point.Point_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Point.Point_Impl_._new(value);
};
thx.unit.angle._Point.Point_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Point.Point_Impl_._new(value);
};
thx.unit.angle._Point.Point_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Point.Point_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Point.Point_Impl_._new(a);
		return thx.unit.angle._Point.Point_Impl_._new(thx.unit.angle._Point.Point_Impl_.turn + other);
	} else return thx.unit.angle._Point.Point_Impl_._new(a);
};
thx.unit.angle._Point.Point_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Point.Point_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Point.Point_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Point.Point_Impl_._new(a - thx.unit.angle._Point.Point_Impl_.turn); else return a;
};
thx.unit.angle._Point.Point_Impl_.negate = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(-this1);
};
thx.unit.angle._Point.Point_Impl_.add = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 + other);
};
thx.unit.angle._Point.Point_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 - other);
};
thx.unit.angle._Point.Point_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * other);
};
thx.unit.angle._Point.Point_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 / other);
};
thx.unit.angle._Point.Point_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 % other);
};
thx.unit.angle._Point.Point_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1) == other;
};
thx.unit.angle._Point.Point_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Point.Point_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Point.Point_Impl_._new(this1) != other;
};
thx.unit.angle._Point.Point_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Point.Point_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Point.Point_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Point.Point_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Point.Point_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Point.Point_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 8);
};
thx.unit.angle._Point.Point_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 11.25);
};
thx.unit.angle._Point.Point_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 12.5);
};
thx.unit.angle._Point.Point_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 0.75);
};
thx.unit.angle._Point.Point_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 675);
};
thx.unit.angle._Point.Point_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.125);
};
thx.unit.angle._Point.Point_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 0.196349540849362);
};
thx.unit.angle._Point.Point_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.03125);
};
thx.unit.angle._Point.Point_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 40500);
};
thx.unit.angle._Point.Point_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.1875);
};
thx.unit.angle._Point.Point_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.03125);
};
thx.unit.angle._Point.Point_Impl_.toString = function(this1) {
	return this1 + "point";
};
thx.unit.angle._Quadrant = {};
thx.unit.angle._Quadrant.Quadrant_Impl_ = {};
thx.unit.angle._Quadrant.Quadrant_Impl_.__name__ = ["thx","unit","angle","_Quadrant","Quadrant_Impl_"];
thx.unit.angle._Quadrant.Quadrant_Impl_.pointToQuadrant = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.636619772367581);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.floatToQuadrant = function(value) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(value);
};
thx.unit.angle._Quadrant.Quadrant_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.5707963267949);
	return Math.cos(this2);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.5707963267949);
	return Math.sin(this2);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(value);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(value);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(value);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Quadrant.Quadrant_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Quadrant.Quadrant_Impl_._new(a);
		return thx.unit.angle._Quadrant.Quadrant_Impl_._new(thx.unit.angle._Quadrant.Quadrant_Impl_.turn + other);
	} else return thx.unit.angle._Quadrant.Quadrant_Impl_._new(a);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Quadrant.Quadrant_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Quadrant.Quadrant_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Quadrant.Quadrant_Impl_._new(a - thx.unit.angle._Quadrant.Quadrant_Impl_.turn); else return a;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.negate = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(-this1);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.add = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 + other);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 - other);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * other);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 / other);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 % other);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1) == other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1) != other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 64);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 90);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 100);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 6);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 5400);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 8);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.5707963267949);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.25);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 324000);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 1.5);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.25);
};
thx.unit.angle._Quadrant.Quadrant_Impl_.toString = function(this1) {
	return this1 + "quad.";
};
thx.unit.angle._Radian = {};
thx.unit.angle._Radian.Radian_Impl_ = {};
thx.unit.angle._Radian.Radian_Impl_.__name__ = ["thx","unit","angle","_Radian","Radian_Impl_"];
thx.unit.angle._Radian.Radian_Impl_.pointToRadian = function(x,y) {
	var value = Math.atan2(y,x);
	return thx.unit.angle._Radian.Radian_Impl_._new(value);
};
thx.unit.angle._Radian.Radian_Impl_.floatToRadian = function(value) {
	return thx.unit.angle._Radian.Radian_Impl_._new(value);
};
thx.unit.angle._Radian.Radian_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Radian.Radian_Impl_.cos = function(this1) {
	return Math.cos(this1);
};
thx.unit.angle._Radian.Radian_Impl_.sin = function(this1) {
	return Math.sin(this1);
};
thx.unit.angle._Radian.Radian_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Radian.Radian_Impl_._new(value);
};
thx.unit.angle._Radian.Radian_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Radian.Radian_Impl_._new(value);
};
thx.unit.angle._Radian.Radian_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Radian.Radian_Impl_._new(value);
};
thx.unit.angle._Radian.Radian_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Radian.Radian_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Radian.Radian_Impl_._new(a);
		return thx.unit.angle._Radian.Radian_Impl_._new(thx.unit.angle._Radian.Radian_Impl_.turn + other);
	} else return thx.unit.angle._Radian.Radian_Impl_._new(a);
};
thx.unit.angle._Radian.Radian_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Radian.Radian_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Radian.Radian_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Radian.Radian_Impl_._new(a - thx.unit.angle._Radian.Radian_Impl_.turn); else return a;
};
thx.unit.angle._Radian.Radian_Impl_.negate = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(-this1);
};
thx.unit.angle._Radian.Radian_Impl_.add = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 + other);
};
thx.unit.angle._Radian.Radian_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 - other);
};
thx.unit.angle._Radian.Radian_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * other);
};
thx.unit.angle._Radian.Radian_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 / other);
};
thx.unit.angle._Radian.Radian_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 % other);
};
thx.unit.angle._Radian.Radian_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1) == other;
};
thx.unit.angle._Radian.Radian_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Radian.Radian_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1) != other;
};
thx.unit.angle._Radian.Radian_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Radian.Radian_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Radian.Radian_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Radian.Radian_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Radian.Radian_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Radian.Radian_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 40.7436654315252);
};
thx.unit.angle._Radian.Radian_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 57.2957795130823);
};
thx.unit.angle._Radian.Radian_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 63.6619772367581);
};
thx.unit.angle._Radian.Radian_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 3.81971863420549);
};
thx.unit.angle._Radian.Radian_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 3437.74677078494);
};
thx.unit.angle._Radian.Radian_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 5.09295817894065);
};
thx.unit.angle._Radian.Radian_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.636619772367581);
};
thx.unit.angle._Radian.Radian_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.159154943091895);
};
thx.unit.angle._Radian.Radian_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 206264.806247096);
};
thx.unit.angle._Radian.Radian_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.954929658551372);
};
thx.unit.angle._Radian.Radian_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.159154943091895);
};
thx.unit.angle._Radian.Radian_Impl_.toString = function(this1) {
	return this1 + "rad";
};
thx.unit.angle._Revolution = {};
thx.unit.angle._Revolution.Revolution_Impl_ = {};
thx.unit.angle._Revolution.Revolution_Impl_.__name__ = ["thx","unit","angle","_Revolution","Revolution_Impl_"];
thx.unit.angle._Revolution.Revolution_Impl_.pointToRevolution = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.159154943091895);
};
thx.unit.angle._Revolution.Revolution_Impl_.floatToRevolution = function(value) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(value);
};
thx.unit.angle._Revolution.Revolution_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Revolution.Revolution_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
	return Math.cos(this2);
};
thx.unit.angle._Revolution.Revolution_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
	return Math.sin(this2);
};
thx.unit.angle._Revolution.Revolution_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Revolution.Revolution_Impl_._new(value);
};
thx.unit.angle._Revolution.Revolution_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Revolution.Revolution_Impl_._new(value);
};
thx.unit.angle._Revolution.Revolution_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Revolution.Revolution_Impl_._new(value);
};
thx.unit.angle._Revolution.Revolution_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Revolution.Revolution_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Revolution.Revolution_Impl_._new(a);
		return thx.unit.angle._Revolution.Revolution_Impl_._new(thx.unit.angle._Revolution.Revolution_Impl_.turn + other);
	} else return thx.unit.angle._Revolution.Revolution_Impl_._new(a);
};
thx.unit.angle._Revolution.Revolution_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Revolution.Revolution_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Revolution.Revolution_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Revolution.Revolution_Impl_._new(a - thx.unit.angle._Revolution.Revolution_Impl_.turn); else return a;
};
thx.unit.angle._Revolution.Revolution_Impl_.negate = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(-this1);
};
thx.unit.angle._Revolution.Revolution_Impl_.add = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 + other);
};
thx.unit.angle._Revolution.Revolution_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 - other);
};
thx.unit.angle._Revolution.Revolution_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * other);
};
thx.unit.angle._Revolution.Revolution_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 / other);
};
thx.unit.angle._Revolution.Revolution_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 % other);
};
thx.unit.angle._Revolution.Revolution_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1) == other;
};
thx.unit.angle._Revolution.Revolution_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Revolution.Revolution_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1) != other;
};
thx.unit.angle._Revolution.Revolution_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Revolution.Revolution_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Revolution.Revolution_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Revolution.Revolution_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Revolution.Revolution_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Revolution.Revolution_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 256);
};
thx.unit.angle._Revolution.Revolution_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 360);
};
thx.unit.angle._Revolution.Revolution_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 400);
};
thx.unit.angle._Revolution.Revolution_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 24);
};
thx.unit.angle._Revolution.Revolution_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 21600);
};
thx.unit.angle._Revolution.Revolution_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 32);
};
thx.unit.angle._Revolution.Revolution_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 4);
};
thx.unit.angle._Revolution.Revolution_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
};
thx.unit.angle._Revolution.Revolution_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 1296000);
};
thx.unit.angle._Revolution.Revolution_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 6);
};
thx.unit.angle._Revolution.Revolution_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1);
};
thx.unit.angle._Revolution.Revolution_Impl_.toString = function(this1) {
	return this1 + "r";
};
thx.unit.angle._SecondOfArc = {};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_ = {};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.__name__ = ["thx","unit","angle","_SecondOfArc","SecondOfArc_Impl_"];
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.pointToSecondOfArc = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 206264.806247096);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.floatToSecondOfArc = function(value) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(value);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 4.84813681109536e-06);
	return Math.cos(this2);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 4.84813681109536e-06);
	return Math.sin(this2);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(value);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(value);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(value);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(a);
		return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.turn + other);
	} else return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(a);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(a - thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.turn); else return a;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.negate = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(-this1);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.add = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 + other);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 - other);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * other);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.divide = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 / other);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 % other);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.equal = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1) == other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1) != other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 0.000197530864197531);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 0.000277777777777778);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 0.000308641975308642);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 1.85185185185185e-05);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 0.0166666666666667);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 2.46913580246914e-05);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 3.08641975308642e-06);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 4.84813681109536e-06);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 7.71604938271605e-07);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 4.62962962962963e-06);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 7.71604938271605e-07);
};
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.toString = function(this1) {
	return this1 + "″";
};
thx.unit.angle._Sextant = {};
thx.unit.angle._Sextant.Sextant_Impl_ = {};
thx.unit.angle._Sextant.Sextant_Impl_.__name__ = ["thx","unit","angle","_Sextant","Sextant_Impl_"];
thx.unit.angle._Sextant.Sextant_Impl_.pointToSextant = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 0.954929658551372);
};
thx.unit.angle._Sextant.Sextant_Impl_.floatToSextant = function(value) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(value);
};
thx.unit.angle._Sextant.Sextant_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Sextant.Sextant_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.0471975511966);
	return Math.cos(this2);
};
thx.unit.angle._Sextant.Sextant_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.0471975511966);
	return Math.sin(this2);
};
thx.unit.angle._Sextant.Sextant_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Sextant.Sextant_Impl_._new(value);
};
thx.unit.angle._Sextant.Sextant_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Sextant.Sextant_Impl_._new(value);
};
thx.unit.angle._Sextant.Sextant_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Sextant.Sextant_Impl_._new(value);
};
thx.unit.angle._Sextant.Sextant_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Sextant.Sextant_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Sextant.Sextant_Impl_._new(a);
		return thx.unit.angle._Sextant.Sextant_Impl_._new(thx.unit.angle._Sextant.Sextant_Impl_.turn + other);
	} else return thx.unit.angle._Sextant.Sextant_Impl_._new(a);
};
thx.unit.angle._Sextant.Sextant_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Sextant.Sextant_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Sextant.Sextant_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Sextant.Sextant_Impl_._new(a - thx.unit.angle._Sextant.Sextant_Impl_.turn); else return a;
};
thx.unit.angle._Sextant.Sextant_Impl_.negate = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(-this1);
};
thx.unit.angle._Sextant.Sextant_Impl_.add = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 + other);
};
thx.unit.angle._Sextant.Sextant_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 - other);
};
thx.unit.angle._Sextant.Sextant_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * other);
};
thx.unit.angle._Sextant.Sextant_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 / other);
};
thx.unit.angle._Sextant.Sextant_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 % other);
};
thx.unit.angle._Sextant.Sextant_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1) == other;
};
thx.unit.angle._Sextant.Sextant_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Sextant.Sextant_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1) != other;
};
thx.unit.angle._Sextant.Sextant_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Sextant.Sextant_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Sextant.Sextant_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Sextant.Sextant_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Sextant.Sextant_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Sextant.Sextant_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 42.6666666666667);
};
thx.unit.angle._Sextant.Sextant_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 60);
};
thx.unit.angle._Sextant.Sextant_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 66.6666666666667);
};
thx.unit.angle._Sextant.Sextant_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 4);
};
thx.unit.angle._Sextant.Sextant_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 3600);
};
thx.unit.angle._Sextant.Sextant_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 5.33333333333333);
};
thx.unit.angle._Sextant.Sextant_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 0.666666666666667);
};
thx.unit.angle._Sextant.Sextant_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 1.0471975511966);
};
thx.unit.angle._Sextant.Sextant_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1 * 0.166666666666667);
};
thx.unit.angle._Sextant.Sextant_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 216000);
};
thx.unit.angle._Sextant.Sextant_Impl_.toTurn = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.166666666666667);
};
thx.unit.angle._Sextant.Sextant_Impl_.toString = function(this1) {
	return this1 + "sextant";
};
thx.unit.angle._Turn = {};
thx.unit.angle._Turn.Turn_Impl_ = {};
thx.unit.angle._Turn.Turn_Impl_.__name__ = ["thx","unit","angle","_Turn","Turn_Impl_"];
thx.unit.angle._Turn.Turn_Impl_.pointToTurn = function(x,y) {
	var this1;
	var value = Math.atan2(y,x);
	this1 = thx.unit.angle._Radian.Radian_Impl_._new(value);
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * 0.159154943091895);
};
thx.unit.angle._Turn.Turn_Impl_.floatToTurn = function(value) {
	return thx.unit.angle._Turn.Turn_Impl_._new(value);
};
thx.unit.angle._Turn.Turn_Impl_._new = function(value) {
	return value;
};
thx.unit.angle._Turn.Turn_Impl_.cos = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
	return Math.cos(this2);
};
thx.unit.angle._Turn.Turn_Impl_.sin = function(this1) {
	var this2 = thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
	return Math.sin(this2);
};
thx.unit.angle._Turn.Turn_Impl_.abs = function(this1) {
	var value = Math.abs(this1);
	return thx.unit.angle._Turn.Turn_Impl_._new(value);
};
thx.unit.angle._Turn.Turn_Impl_.min = function(this1,other) {
	var value = Math.min(this1,other);
	return thx.unit.angle._Turn.Turn_Impl_._new(value);
};
thx.unit.angle._Turn.Turn_Impl_.max = function(this1,other) {
	var value = Math.max(this1,other);
	return thx.unit.angle._Turn.Turn_Impl_._new(value);
};
thx.unit.angle._Turn.Turn_Impl_.normalize = function(this1) {
	var a = this1 % thx.unit.angle._Turn.Turn_Impl_.turn;
	if(a < 0) {
		var other = thx.unit.angle._Turn.Turn_Impl_._new(a);
		return thx.unit.angle._Turn.Turn_Impl_._new(thx.unit.angle._Turn.Turn_Impl_.turn + other);
	} else return thx.unit.angle._Turn.Turn_Impl_._new(a);
};
thx.unit.angle._Turn.Turn_Impl_.normalizeDirection = function(this1) {
	var a = thx.unit.angle._Turn.Turn_Impl_.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx.unit.angle._Turn.Turn_Impl_._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx.unit.angle._Turn.Turn_Impl_._new(a - thx.unit.angle._Turn.Turn_Impl_.turn); else return a;
};
thx.unit.angle._Turn.Turn_Impl_.negate = function(this1) {
	return thx.unit.angle._Turn.Turn_Impl_._new(-this1);
};
thx.unit.angle._Turn.Turn_Impl_.add = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 + other);
};
thx.unit.angle._Turn.Turn_Impl_.subtract = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 - other);
};
thx.unit.angle._Turn.Turn_Impl_.multiply = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 * other);
};
thx.unit.angle._Turn.Turn_Impl_.divide = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 / other);
};
thx.unit.angle._Turn.Turn_Impl_.modulo = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1 % other);
};
thx.unit.angle._Turn.Turn_Impl_.equal = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1) == other;
};
thx.unit.angle._Turn.Turn_Impl_.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx.unit.angle._Turn.Turn_Impl_.notEqual = function(this1,other) {
	return thx.unit.angle._Turn.Turn_Impl_._new(this1) != other;
};
thx.unit.angle._Turn.Turn_Impl_.less = function(this1,other) {
	return this1 < other;
};
thx.unit.angle._Turn.Turn_Impl_.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx.unit.angle._Turn.Turn_Impl_.more = function(this1,other) {
	return this1 > other;
};
thx.unit.angle._Turn.Turn_Impl_.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx.unit.angle._Turn.Turn_Impl_.toFloat = function(this1) {
	return this1;
};
thx.unit.angle._Turn.Turn_Impl_.toBinaryDegree = function(this1) {
	return thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(this1 * 256);
};
thx.unit.angle._Turn.Turn_Impl_.toDegree = function(this1) {
	return thx.unit.angle._Degree.Degree_Impl_._new(this1 * 360);
};
thx.unit.angle._Turn.Turn_Impl_.toGrad = function(this1) {
	return thx.unit.angle._Grad.Grad_Impl_._new(this1 * 400);
};
thx.unit.angle._Turn.Turn_Impl_.toHourAngle = function(this1) {
	return thx.unit.angle._HourAngle.HourAngle_Impl_._new(this1 * 24);
};
thx.unit.angle._Turn.Turn_Impl_.toMinuteOfArc = function(this1) {
	return thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(this1 * 21600);
};
thx.unit.angle._Turn.Turn_Impl_.toPoint = function(this1) {
	return thx.unit.angle._Point.Point_Impl_._new(this1 * 32);
};
thx.unit.angle._Turn.Turn_Impl_.toQuadrant = function(this1) {
	return thx.unit.angle._Quadrant.Quadrant_Impl_._new(this1 * 4);
};
thx.unit.angle._Turn.Turn_Impl_.toRadian = function(this1) {
	return thx.unit.angle._Radian.Radian_Impl_._new(this1 * 6.28318530717959);
};
thx.unit.angle._Turn.Turn_Impl_.toRevolution = function(this1) {
	return thx.unit.angle._Revolution.Revolution_Impl_._new(this1);
};
thx.unit.angle._Turn.Turn_Impl_.toSecondOfArc = function(this1) {
	return thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(this1 * 1296000);
};
thx.unit.angle._Turn.Turn_Impl_.toSextant = function(this1) {
	return thx.unit.angle._Sextant.Sextant_Impl_._new(this1 * 6);
};
thx.unit.angle._Turn.Turn_Impl_.toString = function(this1) {
	return this1 + "τ";
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
dots.Dom.addCss(".sui-icon-add,.sui-icon-collapse,.sui-icon-down,.sui-icon-expand,.sui-icon-remove,.sui-icon-up{background-repeat:no-repeat}.sui-icon-add{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H35V19c0-1.657-1.343-3-3-3s-3%201.343-3%203v10H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h10v10c0%201.657%201.343%203%203%203s3-1.343%203-3V35h10c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-collapse{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-down{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-expand{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-remove{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h26c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-up{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-grid{border-collapse:collapse;}.sui-grid *{box-sizing:border-box}.sui-grid td{border-bottom:1px solid #ddd;margin:0;padding:0}.sui-grid tr:first-child td{border-top:1px solid #ddd}.sui-grid td:first-child{border-left:1px solid #ddd}.sui-grid td:last-child{border-right:1px solid #ddd}.sui-grid td.sui-top,.sui-grid td.sui-left{background-color:#fff}.sui-grid td.sui-bottom,.sui-grid td.sui-right{background-color:#f6f6f6}.sui-bottom-left,.sui-bottom-right,.sui-top-left,.sui-top-right{position:absolute;background-color:#fff}.sui-top-right{top:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-top-right.sui-grid tr:first-child td{border-top:none}.sui-top-right.sui-grid td:last-child{border-right:none}.sui-top-left{top:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-top-left.sui-grid tr:first-child td{border-top:none}.sui-top-left.sui-grid td:last-child{border-left:none}.sui-bottom-right{bottom:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-right.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-right.sui-grid td:last-child{border-right:none}.sui-bottom-left{bottom:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-left.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-left.sui-grid td:last-child{border-left:none}.sui-fill{position:absolute;width:100%;max-height:100%;top:0;left:0}.sui-append{width:100%}.sui-control,.sui-folder{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;user-select:none;font-size:11px;font-family:Helvetica,\"Nimbus Sans L\",\"Liberation Sans\",Arial,sans-serif;line-height:18px;vertical-align:middle;}.sui-control *,.sui-folder *{box-sizing:border-box;margin:0;padding:0}.sui-control button,.sui-folder button{line-height:18px;vertical-align:middle}.sui-control input,.sui-folder input{line-height:18px;vertical-align:middle;border:none;background-color:#f6f6f6;max-width:16em}.sui-control button:hover,.sui-folder button:hover{background-color:#fafafa;border:1px solid #ddd}.sui-control button:focus,.sui-folder button:focus{background-color:#fafafa;border:1px solid #aaa;outline:#eee solid 2px}.sui-control input:focus,.sui-folder input:focus{outline:#eee solid 2px;$outline-offset:-2px;background-color:#fafafa}.sui-control output,.sui-folder output{padding:0 6px;background-color:#fff;display:inline-block}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"],.sui-control input[type=\"date\"],.sui-folder input[type=\"date\"],.sui-control input[type=\"datetime-local\"],.sui-folder input[type=\"datetime-local\"],.sui-control input[type=\"time\"],.sui-folder input[type=\"time\"]{text-align:right}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"]{font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace}.sui-control input,.sui-folder input{padding:0 6px}.sui-control input[type=\"color\"],.sui-folder input[type=\"color\"],.sui-control input[type=\"checkbox\"],.sui-folder input[type=\"checkbox\"]{padding:0;margin:0}.sui-control input[type=\"range\"],.sui-folder input[type=\"range\"]{margin:0 8px;min-height:19px}.sui-control button,.sui-folder button{background-color:#eee;border:1px solid #aaa;border-radius:4px}.sui-control.sui-control-single input,.sui-folder.sui-control-single input,.sui-control.sui-control-single output,.sui-folder.sui-control-single output,.sui-control.sui-control-single button,.sui-folder.sui-control-single button{width:100%}.sui-control.sui-control-single input[type=\"checkbox\"],.sui-folder.sui-control-single input[type=\"checkbox\"]{width:initial}.sui-control.sui-control-double input,.sui-folder.sui-control-double input,.sui-control.sui-control-double output,.sui-folder.sui-control-double output,.sui-control.sui-control-double button,.sui-folder.sui-control-double button{width:50%}.sui-control.sui-control-double .input1,.sui-folder.sui-control-double .input1{width:calc(100% - 7em);max-width:8em}.sui-control.sui-control-double .input2,.sui-folder.sui-control-double .input2{width:7em}.sui-control.sui-control-double .input1[type=\"range\"],.sui-folder.sui-control-double .input1[type=\"range\"]{width:calc(100% - 7em - 16px)}.sui-control.sui-type-bool,.sui-folder.sui-type-bool{text-align:center}.sui-control.sui-invalid,.sui-folder.sui-invalid{border-left:4px solid #d00}.sui-array{list-style:none;}.sui-array .sui-array-item{border-bottom:1px dotted #aaa;position:relative;}.sui-array .sui-array-item .sui-icon,.sui-array .sui-array-item .sui-icon-mini{opacity:.1}.sui-array .sui-array-item .sui-array-add .sui-icon,.sui-array .sui-array-item .sui-array-add .sui-icon-mini{opacity:.2}.sui-array .sui-array-item > *{vertical-align:top}.sui-array .sui-array-item:first-child > .sui-move > .sui-icon-up{visibility:hidden}.sui-array .sui-array-item:last-child{border-bottom:none;}.sui-array .sui-array-item:last-child > .sui-move > .sui-icon-down{visibility:hidden}.sui-array .sui-array-item > div{display:inline-block}.sui-array .sui-array-item .sui-move{position:absolute;width:8px;height:100%;}.sui-array .sui-array-item .sui-move .sui-icon-mini{display:block;position:absolute}.sui-array .sui-array-item .sui-move .sui-icon-up{top:0;left:1px}.sui-array .sui-array-item .sui-move .sui-icon-down{bottom:0;left:1px}.sui-array .sui-array-item .sui-control-container{margin:0 14px 0 10px;width:calc(100% - 24px)}.sui-array .sui-array-item .sui-remove{width:12px;position:absolute;right:1px;top:0}.sui-array .sui-array-item .sui-icon-remove,.sui-array .sui-array-item .sui-icon-up,.sui-array .sui-array-item .sui-icon-down{cursor:pointer}.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon-mini,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon-mini{opacity:.4}.sui-array ~ .sui-control{margin-bottom:0}.sui-map{border-collapse:collapse;}.sui-map .sui-map-item > td{border-bottom:1px dotted #aaa;}.sui-map .sui-map-item > td:first-child{border-left:none}.sui-map .sui-map-item:last-child > td{border-bottom:none}.sui-map .sui-map-item .sui-icon{opacity:.1}.sui-map .sui-map-item .sui-array-add .sui-icon{opacity:.2}.sui-map .sui-map-item .sui-remove{width:14px;text-align:right;padding:0 1px}.sui-map .sui-map-item .sui-icon-remove{cursor:pointer}.sui-map .sui-map-item.sui-focus > .sui-remove .sui-icon{opacity:.4}.sui-disabled .sui-icon,.sui-disabled .sui-icon-mini,.sui-disabled .sui-icon:hover,.sui-disabled .sui-icon-mini:hover{opacity:.05 !important;cursor:default}.sui-array-add{text-align:right;}.sui-array-add .sui-icon,.sui-array-add .sui-icon-mini{margin-right:1px;opacity:.2;cursor:pointer}.sui-icon,.sui-icon-mini{display:inline-block;opacity:.4;vertical-align:middle;}.sui-icon:hover,.sui-icon-mini:hover{opacity:.8 !important}.sui-icon{width:12px;height:12px;background-size:12px 12px}.sui-icon-mini{width:8px;height:8px;background-size:8px 8px}.sui-folder{padding:0 6px;font-weight:bold}.sui-collapsible{cursor:pointer}.sui-bottom-left .sui-trigger-toggle,.sui-bottom-right .sui-trigger-toggle{transform:rotate(180deg)}.sui-choice-options > .sui-grid,.sui-grid-inner{width:100%}.sui-choice-options > .sui-grid > tr > td:first-child,.sui-choice-options > .sui-grid > tbody > tr > td:first-child{border-left:none}.sui-choice-options > .sui-grid > tr:last-child > td,.sui-choice-options > .sui-grid > tbody > tr:last-child > td{border-bottom:none}.sui-grid-inner{border-left:6px solid #f6f6f6}.sui-choice-header select{width:100%}");

      // Production steps of ECMA-262, Edition 5, 15.4.4.21
      // Reference: http://es5.github.io/#x15.4.4.21
      if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(callback /*, initialValue*/) {
          'use strict';
          if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
          }
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }
          var t = Object(this), len = t.length >>> 0, k = 0, value;
          if (arguments.length == 2) {
            value = arguments[1];
          } else {
            while (k < len && ! k in t) {
              k++;
            }
            if (k >= len) {
              throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
          }
          for (; k < len; k++) {
            if (k in t) {
              value = callback(value, t[k], k, t);
            }
          }
          return value;
        };
      }
    ;
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
var lastTime = 0;
var vendors = ["webkit","moz"];
var x = 0;
while(x < vendors.length && !scope.requestAnimationFrame) {
	scope.requestAnimationFrame = scope[vendors[x] + "RequestAnimationFrame"];
	scope.cancelAnimationFrame = scope[vendors[x] + "CancelAnimationFrame"] || scope[vendors[x] + "CancelRequestAnimationFrame"];
	x++;
}
if(!scope.requestAnimationFrame) scope.requestAnimationFrame = function(callback1) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0,16 - (currTime - lastTime));
	var id = scope.setTimeout(function() {
		callback1(currTime + timeToCall);
	},timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};
if(!scope.cancelAnimationFrame) scope.cancelAnimationFrame = function(id1) {
	scope.clearTimeout(id1);
};
if(typeof(scope.performance) == "undefined") scope.performance = { };
if(typeof(scope.performance.now) == "undefined") {
	var nowOffset = new Date().getTime();
	if(scope.performance.timing && scope.performance.timing.navigationStart) nowOffset = scope.performance.timing.navigationStart;
	var now = function() {
		return new Date() - nowOffset;
	};
	scope.performance.now = now;
}
Canvas.width = 800;
Canvas.height = 600;
dots.Html.pattern = new EReg("[<]([^> ]+)","");
dots.Query.doc = document;
haxe.ds.ObjectMap.count = 0;
js.Boot.__toStr = {}.toString;
sui.controls.ColorControl.PATTERN = new EReg("^[#][0-9a-f]{6}$","i");
sui.controls.DataList.nid = 0;
thx.color._Grey.Grey_Impl_.black = (function($this) {
	var $r;
	var this1;
	this1 = 0;
	$r = this1;
	return $r;
}(this));
thx.color._Grey.Grey_Impl_.white = (function($this) {
	var $r;
	var this1;
	this1 = 1;
	$r = this1;
	return $r;
}(this));
thx.color.parse.ColorParser.parser = new thx.color.parse.ColorParser();
thx.color.parse.ColorParser.isPureHex = new EReg("^([0-9a-f]{2}){3,4}$","i");
thx.core.Floats.TOLERANCE = 10e-5;
thx.core.Floats.EPSILON = 10e-10;
thx.core.Floats.pattern_parse = new EReg("^(\\+|-)?\\d+(\\.\\d+)?(e-?\\d+)?$","");
thx.core.Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx.core.Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
thx.core.Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx.core.Strings.UCWORDSWS = new EReg("\\s[a-z]","g");
thx.core.Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx.core.Strings.DIGITS = new EReg("^[0-9]+$","");
thx.core.Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*?/?>","gi");
thx.core.Strings.WSG = new EReg("\\s+","g");
thx.core.Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx.core.Timer.FRAME_RATE = Math.round(16.6666666666666679);
thx.promise._Promise.Promise_Impl_.nil = thx.promise._Promise.Promise_Impl_.value(thx.core.Nil.nil);
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.turn = thx.unit.angle._BinaryDegree.BinaryDegree_Impl_._new(256);
thx.unit.angle._BinaryDegree.BinaryDegree_Impl_.symbol = "binary degree";
thx.unit.angle._Degree.Degree_Impl_.turn = thx.unit.angle._Degree.Degree_Impl_._new(360);
thx.unit.angle._Degree.Degree_Impl_.symbol = "°";
thx.unit.angle._Grad.Grad_Impl_.turn = thx.unit.angle._Grad.Grad_Impl_._new(400);
thx.unit.angle._Grad.Grad_Impl_.symbol = "grad";
thx.unit.angle._HourAngle.HourAngle_Impl_.turn = thx.unit.angle._HourAngle.HourAngle_Impl_._new(24);
thx.unit.angle._HourAngle.HourAngle_Impl_.symbol = "hour";
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.turn = thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_._new(21600);
thx.unit.angle._MinuteOfArc.MinuteOfArc_Impl_.symbol = "′";
thx.unit.angle._Point.Point_Impl_.turn = thx.unit.angle._Point.Point_Impl_._new(32);
thx.unit.angle._Point.Point_Impl_.symbol = "point";
thx.unit.angle._Quadrant.Quadrant_Impl_.turn = thx.unit.angle._Quadrant.Quadrant_Impl_._new(4);
thx.unit.angle._Quadrant.Quadrant_Impl_.symbol = "quad.";
thx.unit.angle._Radian.Radian_Impl_.turn = thx.unit.angle._Radian.Radian_Impl_._new(6.28318530717959);
thx.unit.angle._Radian.Radian_Impl_.symbol = "rad";
thx.unit.angle._Revolution.Revolution_Impl_.turn = thx.unit.angle._Revolution.Revolution_Impl_._new(1);
thx.unit.angle._Revolution.Revolution_Impl_.symbol = "r";
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.turn = thx.unit.angle._SecondOfArc.SecondOfArc_Impl_._new(1296000);
thx.unit.angle._SecondOfArc.SecondOfArc_Impl_.symbol = "″";
thx.unit.angle._Sextant.Sextant_Impl_.turn = thx.unit.angle._Sextant.Sextant_Impl_._new(6);
thx.unit.angle._Sextant.Sextant_Impl_.symbol = "sextant";
thx.unit.angle._Turn.Turn_Impl_.turn = thx.unit.angle._Turn.Turn_Impl_._new(1);
thx.unit.angle._Turn.Turn_Impl_.symbol = "τ";
Canvas.main();
})();
