class ScenarioManager {
    constructor() {
        this.scenarios = getScenarios();
        this.initCurrentScenarioIndex();
    }

    initCurrentScenarioIndex() {
        this.currentScenarioIndex = 0;
    }

    init() {
        this.canvasSizeUpdated();
    }

    getCurrentScenario() {
        return this.scenarios[this.currentScenarioIndex];
    }

    preload() {
        this.scenarios.forEach((sc) => sc.preload());
    }

    update() {
        const current = this.getCurrentScenario();
        if (!current.initOver) {
            current.init();
            if (!current.initOver) {
                return;
            }
        }
        try {
            current.update();
        } catch (exc) {
            console.error(exc);
        }
        if (current.isOver()) {
            const data = current.receivePreviousData();
            current.reset();
            if (!!this.scenarios[this.currentScenarioIndex + 1]) {
                this.currentScenarioIndex++;
            } else if (CONFIG.DO_LOOP) {
                this.currentScenarioIndex = 0;
            }
            const next = this.getCurrentScenario();
            if (!!data) {
                next.sendNextData(data);
            }
        }
    }

    canvasSizeUpdated() {
        this.getCurrentScenario().canvasSizeUpdated();
    }

    click(x, y) {
        this.getCurrentScenario().click(x, y);
    }

    scroll(isUp) {
        this.getCurrentScenario().scroll(isUp);
    }
    
    keyPressed(keyPressed) {
        this.getCurrentScenario().keyPressed(keyPressed)
    }
}
const scenario_manager = new ScenarioManager();
