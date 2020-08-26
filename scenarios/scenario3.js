class Scenario3 extends AbstractScenario {
    constructor() {
        super();
        this.conversation;
        this.background;
    }

    preload() {
        $.getJSON(
            "scenarios/scenario3/conversation.json",
            (conversation_data) => {
                this.conversation = conversation_data;
            }
        );
    }

    init() {
        if (!this.loadClassesStart) {
            this.loadClassesStart = true;
            const loadInit = () => {
                this.background = new Background(
                    this.getConfig().BACKGROUND_STARS_AMOUNT
                );
                this.background.initStars();
                this.loadClassesDone = true;
            };
            if (typeof Background !== "function") {
                $.when(
                    $.getScript("scenarios/scenario1/background.js"),
                    $.Deferred((deferred) => {
                        $(deferred.resolve);
                    })
                ).done(() => {
                    loadInit();
                });
            } else {
                loadInit();
            }
        } else if (this.loadClassesDone) {
            this.currentConversationIndex = 0;
            this.actual_sentence = null;
            this.target_sentence = null;
            this.conversationDone = false;
            this.waitForClick = false;
            this.initOver = true;
        }
    }

    isOver() {
        return this.conversationDone;
    }

    static getConfig() {
        return {
            TYPING_SPEED: 2,
            TYPING_TIME_BETWEEN_LETTERS: 10,
            BACKGROUND_STARS_AMOUNT: 200,
        };
    }

    getCurrentConversationItem() {
        return this.conversation[this.currentConversationIndex];
    }

    update() {
        if (this.isOver() || !this.loadClassesDone) {
            return;
        }
        background(0);
        if (!!this.conversation) {
            this.updateConversation();
            this.drawConversationFrame();
            this.drawConversation();
        }
    }

    updateConversation() {
        const convItem = this.getCurrentConversationItem();
        const config = Scenario3.getConfig();
        if (!convItem.choices) {
            if (!this.actual_sentence) {
                this.target_sentence = convItem.text;
                this.actual_sentence = this.target_sentence.substring(0, 1);
                this.target_sentence = this.target_sentence.slice(1);
            } else if (
                this.target_sentence.length > 0 &&
                frameCount %
                    floor(
                        (config.TYPING_TIME_BETWEEN_LETTERS * 1) /
                            config.TYPING_SPEED
                    ) ==
                    0
            ) {
                this.actual_sentence += this.target_sentence.substring(0, 1);
                this.target_sentence = this.target_sentence.slice(1);
            } else if (this.target_sentence.length == 0) {
                this.waitForClick = true;
            }
        } else if (!this.waitForClick) {
            this.waitForClick = true;
        }
    }

    getConversationFrameHeight() {
        return max(height * 0.2, 200);
    }

    drawConversationFrame() {
        stroke(255);
        strokeWeight(5);
        fill(0);
        rectMode(CORNERS);
        const margin = 10;
        rect(
            margin,
            height - this.getConversationFrameHeight(),
            width - margin,
            height - margin
        );
    }

    getButtonPosition(index, amount) {
        const margin = 30;
        const frameHeight = this.getConversationFrameHeight();
        const w = (width - margin * (amount + 1)) / amount;
        const x1 = (index + 1) * margin + index * w;
        return {
            x1,
            y1: height - frameHeight + margin,
            x2: x1 + w,
            y2: height - margin,
        };
    }

    drawConversation() {
        const convItem = this.getCurrentConversationItem();
        const frameHeight = this.getConversationFrameHeight();
        if (!!convItem.choices) {
            // draw buttons
            strokeWeight(3);
            rectMode(CORNERS);
            textSize(frameHeight / 6);
            textAlign(LEFT, TOP);
            convItem.choices.forEach((choice, index) => {
                const pos = this.getButtonPosition(
                    index,
                    convItem.choices.length
                );

                let hovered = false;
                if (
                    mouseX >= pos.x1 &&
                    mouseX <= pos.x2 &&
                    mouseY >= pos.y1 &&
                    mouseY <= pos.y2
                ) {
                    hovered = true;
                }

                const margin = 6;
                stroke(hovered ? "lightgreen" : 255);
                noFill();
                rect(pos.x1, pos.y1, pos.x2, pos.y2);

                // General Kenobi
                noStroke();
                fill(hovered ? "lightgreen" : 255);
                text(
                    choice.text,
                    pos.x1 + margin,
                    pos.y1 + margin,
                    pos.x2 - pos.x1 + margin * 2,
                    pos.y2 - pos.y1 + margin * 2
                );
            });
        } else {
            rectMode(CORNERS);
            textSize(frameHeight / 6);
            textAlign(LEFT, TOP);
            noStroke();
            fill(255);
            const margin = 30;
            text(
                this.actual_sentence,
                margin,
                height - frameHeight + margin,
                width - margin,
                height - margin
            );
        }
    }

    findNextConversationIndex(id_parent) {
        const convItem = this.getCurrentConversationItem();
        const idParentToFind = !!id_parent ? id_parent : convItem.id;
        let nextIndex = null;
        this.conversation.forEach((conv, index) => {
            if (conv.id_parent == idParentToFind) {
                nextIndex = index;
            }
        });

        if (!nextIndex) {
            this.conversationDone = true;
        }
        return nextIndex;
    }

    click(x, y) {
        const convItem = this.getCurrentConversationItem();
        if (this.waitForClick) {
            if (!!convItem.choices) {
                convItem.choices.forEach((choice, index) => {
                    const pos = this.getButtonPosition(
                        index,
                        convItem.choices.length
                    );
                    if (
                        x >= pos.x1 &&
                        x <= pos.x2 &&
                        y >= pos.y1 &&
                        y <= pos.y2
                    ) {
                        this.currentConversationIndex = this.findNextConversationIndex(
                            choice.id
                        );
                        this.waitForClick = false;
                    }
                });
            } else {
                this.actual_sentence = null;
                this.target_sentence = null;
                this.currentConversationIndex = this.findNextConversationIndex();
                this.waitForClick = false;
            }
        } else if (!convItem.choices && this.target_sentence.length > 0) {
            // skip sentence
            this.actual_sentence += this.target_sentence;
            this.target_sentence = "";
        }
    }
}
