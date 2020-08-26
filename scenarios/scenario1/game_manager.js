class GameManager {
    constructor() {
        this.gap;
        this.tf;

        this.background = new Background(Scenario1.getConfig().STARS_AMOUNT);
        this.planet_manager;
    }

    loadData(data) {
        this.planet_manager.loadPlanetsAssets(data);
        this.planet_manager.initPlanets();
        this.planet_manager.loaded = true;
        this.scale = this.planet_manager.getCurrentPlanet().scale;
    }

    init(planets_data) {
        this.background.initStars();
        this.gap = width * Scenario1.getConfig().PLANETS.GAP_RATIO;

        this.tf = new Transformer();
        this.planet_manager = new PlanetManager(
            this.tf,
            this.gap,
            Scenario1.getConfig().PLANETS.ID_SUN
        );
        this.loadData(planets_data);

        angleMode(DEGREES);
        textAlign(CENTER, CENTER);
        fill(255);
    }

    draw() {
        background(0);
        this.background.updateAndDrawStars(
            this.planet_manager.getCurrentPlanet()
        );
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
        const currentPlanet = this.planet_manager.getCurrentPlanet();
        if (currentPlanet.id != Scenario1.getConfig().PLANETS.ID_SUN) {
            textSize(height / 20);
            textAlign(LEFT, TOP);
            const percent = parseInt(map(currentPlanet.angle, 0, 360, 0, 100));
            text(`Année ${currentPlanet.year} : ${percent}%`, 5, 5);
            textAlign(CENTER, CENTER);
        }
    }

    click(x, y) {
        this.planet_manager.click(x, y, this.scale, (planet) => {
            this.scale = planet.scale;
        });
    }

    scroll(isUp) {
        const step = 0.05;
        this.scale = parseFloat(
            (this.scale + (isUp ? step : -step)).toFixed(2)
        );
    }

    keyPressed(keyCode) {
        // keys 0 to 9 - Change planet
        if (keyCode >= 48 && keyCode <= 57) {
            // 48 -> 57
            let newIdPlanet = keyCode;
            // place sun (48) at the end
            newIdPlanet += newIdPlanet == 48 ? 10 : 0; // 49 -> 58
            newIdPlanet = newIdPlanet - 49; // 0 -> 9
            newIdPlanet = 9 - newIdPlanet; // 9 -> 0 (invert)

            this.planet_manager.idCurrentPlanet = newIdPlanet;
            this.scale = this.planet_manager.getCurrentPlanet().scale;
        }
    }
}
