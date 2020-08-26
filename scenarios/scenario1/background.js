class Background {
    constructor(starsAmount) {
        this.stars = [];
        this.maxStars = starsAmount;
        this.starMovement = { x: 0, y: 0 };
        this.starsAngle = 0;
    }

    initStars() {
        // constant movement
        this.starMovement = createVector(random(-1, 1), random(-1, 0));

        // positions
        for (let i = 0; i < this.maxStars; i++) {
            const star = {};
            const x = random(-width, width);
            const y = random(-height, height);
            star.pos = createVector(x, y);
            const sizeChance = random();
            star.size =
                sizeChance < 0.4 ? 1
                : sizeChance < 0.7 ? 2
                : sizeChance < 0.85 ? 3
                : sizeChance < 0.95 ? 4
                : 5;
            this.stars.push(star);
        }
    }

    updateAndDrawStars(currentPlanet) {
        // TODO make component generic
        // move and draw stars
        this.starsAngle += Scenario1.getConfig().PLANETS.SPEED_RATIO * 0.05;
        push();
        translate(width / 2, height / 2);
        rotate(this.starsAngle);
        if(currentPlanet.id != Scenario1.getConfig().STARS_AMOUNT) {
            rotate(-currentPlanet.angle);
        }
        this.stars.forEach((star) => {
            strokeWeight(star.size);
            stroke(255);
            point(star.pos.x, star.pos.y);
        });
        pop();
    }
}
