function preload() {
    scenario_manager.preload();
}

function setup() {
    createCanvas(0, 0);
    frameRate(CONFIG.FRAMERATE);
    scenario_manager.init();
}

function windowResized() {
    scenario_manager.canvasSizeUpdated();
}

function draw() {
    scenario_manager.update();
}

function mouseClicked() {
    if (mouseX > 0 && mouseX <= width && mouseY > 0 && mouseY <= height) {
        scenario_manager.click(mouseX, mouseY)
    }
}

function mouseWheel(event) {
    scenario_manager.scroll(event.delta < 0);
}

function keyPressed() {
    scenario_manager.keyPressed(keyCode);
}
