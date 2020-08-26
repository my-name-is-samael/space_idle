class Scenario1 extends AbstractScenario {
    constructor() {
        super();
        this.game_manager;
        this.planets_data = {};
        this.initStarted = false;
    }

    preload() {
        $.getJSON(
            "scenarios/scenario1/assets/planets/planets_data.json",
            (planets_data) => {
                this.planets_data.planets = [];
                this.planets_data.img_planets = [];
                planets_data.forEach((planet) => {
                    this.planets_data.planets.push(planet);
                    this.planets_data.img_planets.push(
                        loadImage(
                            `scenarios/scenario1/assets/planets/${planet.id}.png`
                        )
                    );
                });
            }
        );
    }

    canvasSizeUpdated() {
        resizeCanvas(windowWidth, windowHeight);
    }

    isOver() {
        if (!this.game_manager) {
            return false;
        }
        const planets = this.game_manager.planet_manager.planets;
        return planets[planets.length-1].year >= 2;
    }

    static getConfig() {
        return {
            PLANETS: {
                ID_SUN: 0,
                GAP_RATIO: 0.04,
                SPEED_RATIO: 0.3,
                DETECTION_RANGE: 1.01,
            },
            STARS_AMOUNT: 500,
        };
    }

    init() {
        if (!this.loadClassesStart) {
            this.loadClassesStart = true;
            const scriptsToLoad = [];
            if(typeof Background !== "function") scriptsToLoad.push($.getScript("scenarios/scenario1/background.js"));
            if(typeof PlanetManager !== "function") scriptsToLoad.push($.getScript("scenarios/scenario1/planet_manager.js"));
            if(typeof GameManager !== "function") scriptsToLoad.push($.getScript("scenarios/scenario1/game_manager.js"));
            scriptsToLoad.push($.Deferred((deferred) => {
                $(deferred.resolve);
            }));
            $.when(...scriptsToLoad).done(() => {
                this.game_manager = new GameManager();
                this.game_manager.init(this.planets_data);
                this.initOver = true;
                this.loadClassesDone = true;
            });
        } else if(this.loadClassesDone){
            this.game_manager = new GameManager();
            this.game_manager.init(this.planets_data);
            this.initOver = true;
        }
    }

    update() {
        if (!!this.game_manager) {
            this.game_manager.draw();
            
            const planets = this.game_manager.planet_manager.planets;
            const w = map(planets[planets.length-1].angle, 0, 360, 0, width);
            noStroke();
            fill(255);
            rect(0, height-5, w, height);
        }
    }

    click(x, y) {
        this.game_manager.click(x, y);
    }

    scroll(isUp) {
        this.game_manager.scroll(isUp);
    }

    keyPressed(keyCode) {
        this.game_manager.keyPressed(keyCode);
    }
    
    reset() {
        super.reset();
        delete this.game_manager;
    }
}
