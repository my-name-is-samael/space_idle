class GameManager {
    constructor() {
        this.id_scale = 0;
        this.gap;
        this.tf;
        this.year = 1;

        this.background = new Background(CONFIG.STARS_AMOUNT);
        this.planet_manager;
    }

    loadData() {
        $.getJSON("assets/planets/planets_data.json", (planets_data) => {
            this.planet_manager.loadPlanetsAssets(planets_data);
            this.planet_manager.initPlanets();
            this.planet_manager.loaded = true;
        });
    }

    init() {
        createCanvas(0, 0);

        this.background.initStars();

        this.updateDisplay();
        this.gap = width * CONFIG.PLANETS.GAP_RATIO;

        this.tf = new Transformer();
        this.planet_manager = new PlanetManager(this.tf, this.gap);


        angleMode(DEGREES);
        textAlign(CENTER, CENTER);
    }

    updateDisplay() {
        const canvasSize = min(windowWidth, windowHeight);
        resizeCanvas(canvasSize, canvasSize);
    }

    draw() {
        background(0);
        this.background.updateAndDrawStars();
        if (!this.planet_manager.loaded) {
            fill(255);
            textSize(width / 20);
            text("Chargement...", width / 2, height / 2);
        } else {
            push();
            this.centerOnEarth();
            this.planet_manager.updateAndDrawPlanets((planet, planets) => {
                if (planet.id == CONFIG.PLANETS.ID_EARTH) {
                    // neighbor detection (zoom out to next pair of planets)
                    const range = this.id_scale + 1;
                    const minIndex = max(0, CONFIG.PLANETS.ID_EARTH - range);
                    const minReached = minIndex == 0;
                    const maxIndex = min(
                        CONFIG.PLANETS.ID_EARTH + range,
                        planets.length - 1
                    );
                    const maxReached = maxIndex == planets.length - 1;

                    const planetsToCheck = [];
                    if (!minReached) {
                        planetsToCheck.push(planets[minIndex]);
                    }
                    if (!maxReached) {
                        planetsToCheck.push(planets[maxIndex]);
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
                            const range = abs(
                                planet.distance - target.distance
                            );
                            if (distance < range * CONFIG.PLANETS.DETECTION_RANGE) {
                                stepReached = true;
                            }
                        }
                    });
                    if (stepReached) {
                        this.id_scale++;
                    }
                }
            });
            pop();
            this.drawDate();
        }
    }

    centerOnEarth() {
        translate(width / 2, height / 2);
        const scaleV = CONFIG.SCALES[this.id_scale];
        scale(scaleV, scaleV);
    }

    drawDate() {
        textSize(height / 20);
        textAlign(LEFT, TOP);
        const day = parseInt(
            map(this.planet_manager.planets[CONFIG.PLANETS.ID_EARTH].angle, 0, 360, 1, 366)
        );
        text(`Année ${this.year} Jour ${day}`, 5, 5);
        textAlign(CENTER, CENTER);
    }
}
const game_manager = new GameManager();

function preload() {
    game_manager.loadData();
}

function setup() {
    game_manager.init();
}

function windowResized() {
    game_manager.updateDisplay();
}

function draw() {
    game_manager.draw();
}
