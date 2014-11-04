package boids;

import openfl.geom.Point;

class Flock {
    public var boids(default, null):Array<Boid>;
    public var rules(default, null):Array<IFlockRule>;
    public var speedLimit:Int; // measured in pixels per event loop cycle
    public var center:Point;
    public var avgVelocity:Point;
    public var stageWidth:Int;
    public var stageHeight:Int;

    public function new(?speedLimit = 10) {
        boids = [];
        center = new Point();
        avgVelocity = new Point();
        rules = [];
        this.speedLimit = speedLimit;
    }
    public function addRule(rule:IFlockRule) {
        // for now, just push the rule to the array, but in the future
        // we could use weighting to determine precedence and have a key
        // to look up and replace a single rule
        rules.push(rule);
    }
    public function positionBoids() {
        var neighborBoids = [];
        setFlockAverages();

        // checking each boid, calculate the center of the flock
        for (boid in boids) {
            // find each boid near the current boid
            neighborBoids = findBoidsNearby(boid, boids, 10);
            // trace('There are ' + neighborBoids.length + ' boids nearby.');

            // execute each rule to find the new boid velocity
            for (rule in rules) {
                rule.modifyBoidVelocity(boid, this, neighborBoids);
            }

            // update boid position given new velocity
            boid.position.x += boid.velocity.x;
            boid.position.y += boid.velocity.y;
        }
    }

    function setFlockAverages() {
        for (boid in boids) {
            center.x += boid.position.x;
            center.y += boid.position.y;
            avgVelocity.x += boid.velocity.x;
            avgVelocity.y += boid.velocity.y;
        }

        center.x = center.x / boids.length;
        center.y = center.y / boids.length;
        avgVelocity.x = avgVelocity.x / boids.length;
        avgVelocity.y = avgVelocity.y / boids.length;
    }

    function findBoidsNearby(boid:Boid, allBoids:Array<Boid>, radius:Int):Array<Boid> {
        var neighbors = new Array();

        for (b in allBoids) {
            if (b != boid && Point.distance(boid.position, b.position) < radius) {
                neighbors.push(b);
            }
        }
        return neighbors;
    }
}