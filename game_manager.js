class GameManager {
    constructor() {
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
            this.scale = this.planet_manager.getCurrentPlanet().scale;
        });
    }

    init() {
        createCanvas(0, 0);

        this.background.initStars();

        this.updateDisplay();
        this.gap = width * CONFIG.PLANETS.GAP_RATIO;

        this.tf = new Transformer();
        this.planet_manager = new PlanetManager(
            this.tf,
            this.gap,
            CONFIG.PLANETS.ID_SUN
        );

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
            this.centerOnPlanet();
            this.planet_manager.updateAndDrawPlanets();
            pop();
            this.drawDate();
        }
    }

    centerOnPlanet() {
        translate(width / 2, height / 2);
        scale(this.scale, this.scale);
    }

    drawDate() {
        textSize(height / 20);
        textAlign(LEFT, TOP);
        const currentPlanet = this.planet_manager.getCurrentPlanet();
        const percent = parseInt(map(currentPlanet.angle, 0, 360, 0, 100));
        text(`Année ${currentPlanet.year} : ${percent}%`, 5, 5);
        textAlign(CENTER, CENTER);
    }

    click(x, y) {
        this.planet_manager.click(x, y, (planet) => {
            this.scale = planet.scale;
        });
    }

    scroll(isUp) {
        const step = 0.05;
        this.scale += isUp ? step : -step;
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

function mouseClicked() {
    if (mouseX > 0 && mouseX <= width && mouseY > 0 && mouseY <= height) {
        game_manager.click(mouseX, mouseY);
    }
}

function mouseWheel(event) {
    game_manager.scroll(event.delta < 0);
}
