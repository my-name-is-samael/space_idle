class Scenario2 extends AbstractScenario {
    constructor() {
        super();
        this.stars = [];
        this.currentLength = 0;
    }

    canvasSizeUpdated() {
        super.canvasSizeUpdated();
        this.init();
    }

    isOver() {
        return this.currentLength >= Scenario2.getConfig().SCENARIO_LENGTH;
    }

    static getConfig() {
        return {
            STARS_AMOUNT: 200,
            SPEED: 1,
            TRAIL_MAX_LENGTH: 3,
            SCENARIO_LENGTH: 5 * CONFIG.FRAMERATE,
        };
    }

    getHypotenuse() {
        return sqrt(sq(width / 2) + sq(height / 2));
    }

    init() {
        this.stars = [];
        const hypotenuse = this.getHypotenuse();
        for (let i = 0; i < Scenario2.getConfig().STARS_AMOUNT; i++) {
            const star = createVector(0, -1);
            star.rotate(floor(random(360)));
            star.mult(random(hypotenuse));
            star.trail = [];
            star.color =
                random() < 0.01
                    ? random(["red", "blue", "purple", "yellow"])
                    : 150;
            this.stars.push(star);
        }
        this.initOver = true;
    }

    getStarSize(star) {
        const hypotenuse = this.getHypotenuse();
        return map(dist(0, 0, star.x, star.y), 0, hypotenuse, 0.1, 10);
    }

    update() {
        background(0);
        push();
        translate(width / 2, height / 2);
        this.stars.forEach((star) => {
            star.trail.unshift(createVector(star.x, star.y));
            if (star.trail.length >= Scenario2.getConfig().TRAIL_MAX_LENGTH) {
                star.trail.pop();
            }
            star.trail.forEach((trail, tab, index) => {
                let origin = createVector(star.x, star.y);
                if (index > 0) {
                    const previous = tab[index - 1];
                    origin = createVector(previous.x, previous.y);
                }
                strokeWeight(this.getStarSize(trail) * 0.75);
                line(origin.x, origin.y, trail.x, trail.y);
            });

            star.mult(random(1, 1.5));
            if (dist(star.x, star.y, 0, 0) > this.getHypotenuse()) {
                const angle = star.heading();
                star.x = 0;
                star.y = -1;
                star.rotate(angle);
                star.trail = [];
            }
            stroke(star.color);
            strokeWeight(this.getStarSize(star));
            point(star.x, star.y);
        });
        pop();
        this.currentLength++;
    }

    reset() {
        super.reset();
        this.currentLength = 0;
    }
}
