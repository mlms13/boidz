package boids;

import openfl.geom.Point;

class Flock {
    public var boids:Array<Boid>;
    public var speedLimit:Int; // measured in pixels per event loop cycle
    public var center:Point;
    public var avgVelocity:Point;
    public var stageWidth:Int;
    public var stageHeight:Int;

    public function new(numberOfBoids:Int, stageWidth:Int, stageHeight:Int, ?speedLimit = 10) {
        boids = new Array();
        center = new Point();
        avgVelocity = new Point();
        this.speedLimit = speedLimit;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        initBoids(numberOfBoids);
    }
    private function initBoids(howMany = 50) {
        var w = Math.min(stageWidth, stageHeight);
        for (i in 0...howMany) {
            // create a new boid and add it to the stage
            var a = Math.random() * 2 * Math.PI,
                d = w * Math.random();
            //var b = new Boid(Math.floor(Math.random() * stageWidth), Math.floor(Math.random() * stageHeight));
            var b = new Boid(stageWidth / 2 + Math.cos(a) * d, stageHeight / 2 + Math.sin(a) * d);
            boids.push(b);
        }
    }
    public function positionBoids() {
        var neighborBoids = new Array();
        var v1 = new Point(0, 0);
        var v2 = new Point(0, 0);
        var v3 = new Point(0, 0);

        setFlockAverages();

        v3.x = avgVelocity.x / 8;
        v3.y = avgVelocity.y / 8;

        // checking each boid, calculate the center of the flock
        for (boid in boids) {
            // find each boid near the current boid
            neighborBoids = findBoidsNearby(boid, boids, 10);
            // trace('There are ' + neighborBoids.length + ' boids nearby.');

            // execute each rule to find the new boid velocity
            v1 = moveTowardCenter(boid, center, v1);
            v2 = avoidCollisions(boid, neighborBoids, v2);

            boid.velocity.x = boid.velocity.x + v1.x + v2.x + v3.x;
            boid.velocity.y = boid.velocity.y + v1.y + v2.y + v3.y;

            respectBoundaries(boid);
            limitSpeed(boid);

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

    // boid positioning rules

    function moveTowardCenter(b:Boid, center:Point, vector:Point):Point {
        // move 0.5% toward the perceived center of all other boids
        vector.x = (center.x - b.position.x) / 100;
        vector.y = (center.y - b.position.y) / 100;

        return vector;
    }

    function avoidCollisions(b:Boid, neighbors:Array<Boid>, vector:Point):Point {
        vector.x = 0;
        vector.y = 0;
        for (n in neighbors) {
            vector.x -= (n.position.x - b.position.x);
            vector.y -= (n.position.y - b.position.y);
        }

        return vector;
    }

    function respectBoundaries(b:Boid) {
        // TODO, this feels a bit brute-force... why not use the same approach
        // that we use to keep boids from colliding with other boids?
        if (b.position.x < 0) {
            b.velocity.x = 10;
        } else if (b.position.x > stageWidth) {
            b.velocity.x = -10;
        }

        if (b.position.y < 0) {
            b.velocity.y = 10;
        } else if (b.position.y >stageHeight) {
            b.velocity.y = -10;
        }
    }

    function limitSpeed(b:Boid) {
        // TODO, each boid could have a different speed based on its location
        var currentSpeed = Math.sqrt(Math.pow(b.velocity.x, 2) + Math.pow(b.velocity.y, 2));
        var speedDifference = speedLimit / currentSpeed;

        if (speedDifference < 1) {
            b.velocity.x *= speedDifference;
            b.velocity.y *= speedDifference;

        }
    }
}