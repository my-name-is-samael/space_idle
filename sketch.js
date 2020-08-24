const data_planets = [];
const img_planets = [];
const id_sun = 0;
const id_earth = 3;
let loaded = false;
const scales = [5, 2.8, 2, 1.6, 1.3, 1.2];
let id_scale = 0;
const planets_gap_ratio = 0.04;
let gap;
const speed_ratio = 0.3;
const detection_range = 1.01;
let tf;
let year = 1;

function preload() {
    $.getJSON("assets/planets/planets_data.json", (data) => {
        data.forEach((dplanet) => {
            data_planets.push(dplanet);
            img_planets.push(loadImage(`assets/planets/${dplanet.id}.png`));
        });
        initPlanets();
        loaded = true;
    });
}

function updateDisplay() {
    const canvasSize = min(windowWidth, windowHeight);
    resizeCanvas(canvasSize, canvasSize);

    gap = width * planets_gap_ratio;
}

function initPlanets() {
    let distance = 0;
    const base_size = height * data_planets[id_earth].base_size;
    data_planets.forEach((planet) => {
        const planet_radius = (base_size * planet.size_ratio) / 2;
        if (planet.id != id_sun) {
            distance += planet_radius;
            if (planet.id == id_earth) {
                planet.angle = 0;
            } else {
                planet.angle = parseFloat(random(0, 360).toFixed(2));
            }
        }
        planet.distance = distance;
        distance += planet_radius + gap;
        updatePlanetPos(planet);
    });
}

function setup() {
    createCanvas(0, 0);
    tf = new Transformer();
    updateDisplay();
    angleMode(DEGREES);
    textAlign(CENTER, CENTER);
}

function windowResized() {
    updateDisplay();
}

function draw() {
    background(0);
    drawStars();
    if (!loaded) {
        fill(255);
        textSize(width / 20);
        text("Chargement...", width / 2, height / 2);
    } else {
        centerOnEarth();
        data_planets.forEach((planet) => {
            updatePlanet(planet);
            drawPlanet(planet);
        });
        pop();
        drawDate();
    }
}

function updatePlanetPos(planet) {
    if (planet.id == id_sun) {
        planet.pos = createVector(0, 0);
        return;
    }
    tf.push();
    tf.rotate(planet.angle);
    tf.translate(-planet.distance, 0);
    tf.rotate(-planet.angle);
    planet.pos = createVector(tf.x.toFixed(2), tf.y.toFixed(2));
    tf.pop();
}

function updatePlanet(planet) {
    if (planet.id != id_sun) {
        const planetUpdateAngle = parseFloat(
            (planet.speed * speed_ratio).toFixed(2)
        );
        planet.angle += planetUpdateAngle;
        if (planet.id == id_earth && planet.angle >= 360) {
            year++;
        }
        planet.angle -= planet.angle >= 360 ? 360 : 0;
        planet.angle = parseFloat(planet.angle.toFixed(2));
        updatePlanetPos(planet);
    }

    if (planet.id == id_earth) {
        // neighbor detection
        const range = id_scale + 1;
        const minIndex = max(0, id_earth - range);
        const minReached = minIndex == 0;
        const maxIndex = min(id_earth + range, data_planets.length - 1);
        const maxReached = maxIndex == data_planets.length - 1;

        const planetsToCheck = [];
        if (!minReached) {
            planetsToCheck.push(data_planets[minIndex]);
        }
        if (!maxReached) {
            planetsToCheck.push(data_planets[maxIndex]);
        }

        let stepReached = false;
        planetsToCheck.forEach((target) => {
            if (!stepReached) {
                const distance = dist(
                    planet.pos.x,
                    planet.pos.y,
                    target.pos.x,
                    target.pos.y
                );
                const range = abs(planet.distance - target.distance);
                if (distance < range * detection_range) {
                    stepReached = true;
                }
            }
        });
        if (stepReached) {
            id_scale++;
        }
    }
}

function drawPlanet(planet) {
    const base_size = height * data_planets[id_earth].base_size;
    const img = img_planets[planet.id];
    const h = base_size * planet.size_ratio;
    const w = img.width == img.height ? h : h * (img.width / img.height);
    const earth = data_planets[id_earth];

    push();
    // trails and names
    if (planet.id != id_sun) {
        stroke(150);
        strokeWeight(0.1);
        noFill();
        translate(earth.distance, 0);
        ellipse(0, 0, planet.distance * 2, planet.distance * 2);
        if (planet.id != id_earth) {
            translate(-planet.distance, 0);
            rotate(-90);
            fill(`rgba(200, 200, 200, .8)`);
            noStroke();
            textSize(w / 1.5);
            text(planet.name, 0, 0);
        }
    }
    pop();
    push();
    if (planet.id != id_earth) {
        rotate(-earth.angle);
        translate(-earth.pos.x, -earth.pos.y);

        // OTHER PLANETS
        if (planet.id != id_sun) {
            translate(planet.pos.x, planet.pos.y);
            rotate(planet.angle);
        }
    }
    image(img, -(w / 2), -(h / 2), w, h);
    pop();
}

function centerOnEarth() {
    push();
    translate(width / 2, height / 2);
    const scaleV = scales[id_scale];
    scale(scaleV, scaleV);
}

let starsAngle = 0;
const stars = [];
function drawStars() {
    if (stars.length == 0) {
        starMovement = createVector(random(-1, 1), random(-1, 0));

        for (let i = 0; i < 50; i++) {
            const star = {};
            star.pos = createVector(
                random(-width / 2, width / 2),
                random(-height / 2, height / 2)
            );
            star.size = parseInt(random(1, 5));
            stars.push(star);
        }
    }
    starsAngle++;
    push();
    translate(width / 2, height / 2);
    stars.forEach((star) => {
        if (!!data_planets[id_earth]) rotate(-starsAngle *speed_ratio*.01);
        strokeWeight(star.size);
        stroke(255);
        point(star.pos.x, star.pos.y);
    });
    pop();
}

function drawDate() {
    textSize(height / 20);
    textAlign(LEFT, TOP);
    const day = parseInt(map(data_planets[id_earth].angle, 0, 360, 1, 366));
    text(`Année ${year} Jour ${day}`, 5, 5);
    textAlign(CENTER, CENTER);
}

function drawDebug() {
    // PLANETS POS
    /*noStroke();
    textSize(planet.size_ratio * 10);
    text(`${planet.pos.x} - ${planet.pos.y}`, 0, -(h / 2));*/
}
