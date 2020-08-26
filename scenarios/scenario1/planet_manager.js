class PlanetManager {
    constructor(tf, gap, idPlanet) {
        this.planets = [];
        this.img_planets = [];
        this.loaded = false;
        this.tf = tf;
        this.gap = gap;

        this.idCurrentPlanet = idPlanet;
    }

    getCurrentPlanet() {
        return this.planets[this.idCurrentPlanet];
    }

    loadPlanetsAssets(data) {
        this.planets = data.planets;
        this.img_planets = data.img_planets;
    }

    getBasePlanetSize() {
        return height * this.planets[Scenario1.getConfig().PLANETS.ID_SUN].base_size;
    }

    initPlanets() {
        let distance = 0;
        const base_size = this.getBasePlanetSize();
        // init planets at differents starting angles, imcrementing distance
        this.planets.forEach((planet, index) => {
            const planet_radius = (base_size * planet.size_ratio) / 2;
            if (planet.id != Scenario1.getConfig().PLANETS.ID_SUN) {
                distance += planet_radius;
                // Hello there
                if (index == this.planets.length-1) {
                    planet.angle = parseFloat(random(0, 180).toFixed(2));
                } else {
                    planet.angle = parseFloat(random(0, 360).toFixed(2));
                }
            } else {
                planet.angle = 0;
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
        if (planet.id == Scenario1.getConfig().PLANETS.ID_SUN) {
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
        if (planet.id != Scenario1.getConfig().PLANETS.ID_SUN) {
            const planetUpdateAngle = parseFloat(
                (planet.speed * Scenario1.getConfig().PLANETS.SPEED_RATIO).toFixed(2)
            );
            planet.angle += planetUpdateAngle;
            if (planet.angle >= 360) {
                planet.year++;
            }
            planet.angle -= planet.angle >= 360 ? 360 : 0;
            planet.angle = parseFloat(planet.angle.toFixed(2));
            this.updatePlanetPos(planet);
        }

        if (!!updateCallback) {
            updateCallback(planet, this.planets);
        }
    }

    drawPlanet(planet) {
        const base_size = this.getBasePlanetSize();
        const img = this.img_planets[planet.id];
        const h = base_size * planet.size_ratio;
        const w = img.width == img.height ? h : h * (img.width / img.height);
        const currentPlanet = this.getCurrentPlanet();

        // circles and names
        push();
        if (planet.id != Scenario1.getConfig().PLANETS.ID_SUN) {
            stroke(150);
            strokeWeight(0.1);
            noFill();
            translate(currentPlanet.distance, 0);
            ellipse(0, 0, planet.distance * 2, planet.distance * 2);
            if (planet.id != this.getCurrentPlanet().id) {
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
        if (planet.id != this.getCurrentPlanet().id) {
            rotate(-currentPlanet.angle);
            translate(-currentPlanet.pos.x, -currentPlanet.pos.y);

            // OTHER PLANETS
            if (planet.id != Scenario1.getConfig().PLANETS.ID_SUN) {
                translate(planet.pos.x, planet.pos.y);
                rotate(planet.angle);
            }
        }
        image(img, -(w / 2), -(h / 2), w, h);
        pop();
    }

    click(x, y, scale, callback) {
        // vec is position of cursor, then we apply planet transformation
        const vec = createVector(x - width / 2, y - height / 2);
        const currentPlanet = this.getCurrentPlanet();
        vec.rotate(currentPlanet.angle);
        scale = 1 / scale;
        vec.mult(scale);
        vec.add(
            parseFloat(currentPlanet.pos.x),
            parseFloat(currentPlanet.pos.y)
        );

        const base_size = this.getBasePlanetSize();
        this.planets.forEach((planet) => {
            const distance = dist(planet.pos.x, planet.pos.y, vec.x, vec.y);
            const planet_radius = (base_size * planet.size_ratio) / 2;
            if (planet.id != currentPlanet.id && distance < planet_radius) {
                this.idCurrentPlanet = planet.id;
                if (!!callback) {
                    callback(planet);
                }
            }
        });
    }
}
