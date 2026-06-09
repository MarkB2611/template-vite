
import * as Phaser from "phaser";
import { RoomChoice } from "./roomHandler";

export default class DoorArrow extends Phaser.GameObjects.Sprite {

    id: number;
    
    private interactKey: Phaser.Input.Keyboard.Key;
    private promptText: Phaser.GameObjects.Text;
    private playerInRange: boolean = false;
    hasTriggered: boolean = false; // ✅ prevents spam


    choiceData!: RoomChoice;

    constructor(scene: Phaser.Scene, x: number, y: number, id: number, choice: RoomChoice) {
        super(scene, x, y, "arrow1");

        scene.add.existing(this);
        this.id = id;
        this.setAlpha(0.6);
        this.setZ(15);

        this.setScale(0.6);
        this.setVisible(true);

        this.choiceData = choice;


        this.interactKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        this.promptText = scene.add.text(x, y - 50, "", {
            fontSize: "16px",
            color: "#00ffcc",
            backgroundColor: "#000000"
        }).setOrigin(0.5);

        this.promptText.setVisible(true);


        // ✅ Only create animations once
        this.createAnimations();

        this.playBuyDoorAnim();

        setTimeout(() => {
            this.destroy();
        }, 12000);
    }

    createAnimations() {

        if (!this.scene.anims.exists("arrow_buy")) {
            const buyFrames = [];
            for (let i = 1; i <= 16; i++) {
                buyFrames.push({ key: `arrow${i}` });
            }

            this.scene.anims.create({
                key: "arrow_buy",
                frames: buyFrames,
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists("arrow_offscreen")) {
            const offscreenFrames = [];
            for (let i = 1; i <= 8; i++) {
                offscreenFrames.push({ key: `arrow${i}` });
            }

            this.scene.anims.create({
                key: "arrow_offscreen",
                frames: offscreenFrames,
                frameRate: 12,
                repeat: -1
            });
        }
    }


    update(player: Phaser.GameObjects.Sprite) {

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        // Keep prompt positioned correctly
        this.promptText.setPosition(this.x, this.y - 50);

        if (distance < 80) {

            this.playerInRange = true;
            this.promptText.setVisible(true);

            this.promptText.setText("Press F to open door");

            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {

                if (!this.hasTriggered) {

                    this.tryTrigger();
                    console.log("TRIGGERED!");
                    // Feedback
                    this.promptText.setText("Opening...");

                    
                    setTimeout(() => {
                        this.promptText.setVisible(false);
                    }, 1000);

                }
            }

        } else {
            this.playerInRange = false;
            this.promptText.setVisible(false);
        }
    }


    // ✅ Called when player overlaps
    tryTrigger() {
        if (this.hasTriggered) return;

        this.hasTriggered = true;

        this.scene.events.emit("door_selected", this.id);
    }

    makeVisible() {
        this.setVisible(true);
    }

    makeInvisable() {
        this.setVisible(false);
    }

    playBuyDoorAnim() {
        this.play("arrow_buy");
    }

    playOffScreenAnim() {
        this.play("arrow_offscreen");
    }
}
