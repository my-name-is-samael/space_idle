class PlanetManager {
    constructor(tf, gap) {
        this.planets = [];
        this.img_planets = [];
        this.loaded = false;
        this.tf = tf;
        this.gap = gap;
    }

    loadPlanetsAssets(data) {
        // load planets json + imgs
        data.forEach((dplanet) => {
            this.planets.push(dplanet);
            this.img_planets.push(
                loadImage(`assets/planets/${dplanet.id}.png`)
            );
        });
    }

    initPlanets() {
        let distance = 0;
        const base_size =
            height * this.planets[CONFIG.PLANETS.ID_EARTH].base_size;
        // init planets at differents starting angles, imcrementing distance
        this.planets.forEach((planet) => {
            const planet_radius = (base_size * planet.size_ratio) / 2;
            if (planet.id != CONFIG.PLANETS.ID_SUN) {
                distance += planet_radius;
                planet.angle = parseFloat(random(0, 360).toFixed(2));
            }
            // adding distance from sun
            planet.distance = distance;
            distance += planet_radius + this.gap;
            planet.year = 1;
            this.updatePlanetPos(planet);
        });
    }

    updateAndDrawPlanets(updateCallback) {
        this.planets.forEach((planet) => {
            this.updatePlanet(planet, updateCallback);
            this.drawPlanet(planet);
        });
    }

    updatePlanetPos(planet) {
        if (planet.id == CONFIG.PLANETS.ID_SUN) {
            planet.pos = createVector(0, 0);
            return;
        }
        // calculate position from the sun (0, 0)
        this.tf.push();
        this.tf.rotate(planet.angle);
        this.tf.translate(-planet.distance, 0);
        this.tf.rotate(-planet.angle);
        planet.pos = createVector(this.tf.x.toFixed(2), this.tf.y.toFixed(2));
        this.tf.pop();
    }

    updatePlanet(planet, updateCallback) {
        // update angle
        if (planet.id != CONFIG.PLANETS.ID_SUN) {
            const planetUpdateAngle = parseFloat(
                (planet.speed * CONFIG.PLANETS.SPEED_RATIO).toFixed(2)
            );
            planet.angle += planetUpdateAngle;
            if (planet.angle >= 360) {
                planet.year++;
            }
            planet.angle -= planet.angle >= 360 ? 360 : 0;
            planet.angle = parseFloat(planet.angle.toFixed(2));
            this.updatePlanetPos(planet);
        }

        updateCallback(planet, this.planets);
    }

    drawPlanet(planet) {
        const base_size = height * this.planets[CONFIG.PLANETS.ID_EARTH].base_size;
        const img = this.img_planets[planet.id];
        const h = base_size * planet.size_ratio;
        const w = img.width == img.height ? h : h * (img.width / img.height);
        const earth = this.planets[CONFIG.PLANETS.ID_EARTH];

        // circles and names
        push();
        if (planet.id != CONFIG.PLANETS.ID_SUN) {
            stroke(150);
            strokeWeight(0.1);
            noFill();
            translate(earth.distance, 0);
            ellipse(0, 0, planet.distance * 2, planet.distance * 2);
            if (planet.id != CONFIG.PLANETS.ID_EARTH) {
                translate(-planet.distance, 0);
                rotate(-90);
                fill(`rgba(200, 200, 200, .8)`);
                noStroke();
                textSize(w / 1.5);
                text(planet.name, 0, 0);
            }
        }
        pop();
        // draw planets with angle and size
        push();
        if (planet.id != CONFIG.PLANETS.ID_EARTH) {
            rotate(-earth.angle);
            translate(-earth.pos.x, -earth.pos.y);

            // OTHER PLANETS
            if (planet.id != CONFIG.PLANETS.ID_SUN) {
                translate(planet.pos.x, planet.pos.y);
                rotate(planet.angle);
            }
        }
        image(img, -(w / 2), -(h / 2), w, h);
        pop();
    }
}
