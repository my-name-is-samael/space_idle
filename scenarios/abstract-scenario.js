class AbstractScenario {
    constructor() {
        this.initOver = false;
        if (new.target === AbstractScenario) {
            throw new TypeError(
                "Cannot construct AbstractScenario instances directly"
            );
        }
    }

    preload() {
        // can be implemented
    }

    getConfig() {
        // can be implemented
        return {};
    }

    receivePreviousData() {
        // can be implemented
    }

    sendNextData(data) {
        // can be implemented
    }

    init() {
        // can be implemented but should be called with super
        this.initOver = true;
    }

    update() {
        throw new TypeError("AbstractScenario.update must be implemented");
    }

    isOver() {
        // can be implemented
        return false;
    }

    canvasSizeUpdated() {
        throw new TypeError("AbstractScenario.canvasSizeUpdated must be implemented");
    }

    click(x, y) {
        // can be implemented
    }

    scroll(isUp) {
        // can be implemented
    }

    keyPressed(keyCode){
        // can be implemented
    }

    reset() {
        // can be implemented but should be called with super
        this.initOver = false;
    }
}
