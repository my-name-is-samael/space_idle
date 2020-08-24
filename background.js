class Background {
    constructor(starsAmount) {
        this.stars = [];
        this.starMovement = { x: 0, y: 0 };
        this.starsAngle = 0;
    }

    initStars() {
        // constant movement
        this.starMovement = createVector(random(-1, 1), random(-1, 0));

        // positions
        for (let i = 0; i < 50; i++) {
            const star = {};
            star.pos = createVector(
                random(-width / 2, width / 2),
                random(-height / 2, height / 2)
            );
            star.size = parseInt(random(1, 5));
            this.stars.push(star);
        }
    }

    updateAndDrawStars() {
        // move and draw stars
        this.starsAngle += CONFIG.PLANETS.SPEED_RATIO;
        push();
        translate(width / 2, height / 2);
        this.stars.forEach((star) => {
            strokeWeight(star.size);
            stroke(255);
            point(star.pos.x, star.pos.y);
        });
        pop();
    }
}
