
import * as Phaser from "phaser";

export default class GameOverScreenOverlay extends Phaser.GameObjects.Container {

    rKey!: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, score:number, kills:number, deaths:number, round:number ) {
        super(scene, 0, 0);

        this.rKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );

        scene.add.existing(this);

        const { width, height } = scene.scale;

        // ✅ Background image (full screen, 0.6 alpha)
        const bg = scene.add.image(width / 2, height / 2, "endBackground");
        bg.setDisplaySize(width, height);
        bg.setAlpha(0.6);

        // ✅ Main "Game Over" text
        const title = scene.add.text(width / 2, height / 2 - 50, "GAME OVER", {
            fontSize: "64px",
            color: "#ff0000",
            stroke: "#fafafa",
            strokeThickness: 20,
            fontFamily: "Arial",
        }).setOrigin(0.5);

        // Values from game
        const roundsSurvived = scene.add.text(width / 2, height / 2 + 30, "You Survived " + round + " waves.", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        const scoreInGame = scene.add.text(width / 2, height / 2 + 60, "You Scored " + score + " points.", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        const deathsInGame = scene.add.text(width / 2, height / 2 + 120, "You Died " + deaths + " times.", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        const killsInGame = scene.add.text(width / 2, height / 2 + 90, "You Killed " + kills + " enemies.", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        // ✅ Subtitle / instruction text
        const subtitle = scene.add.text(width / 2, height / 2 + 260, "Press R When Ready", {
            fontSize: "24px",
            color: "#006eff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        // ✅ Add everything to container
        this.add([bg, title, subtitle, roundsSurvived, deathsInGame, killsInGame, scoreInGame]);

        // ✅ Optional: block input behind it
        this.setSize(width, height);
        this.setInteractive();

        // Start hidden (optional)
        this.setVisible(false);
        
    }

    show() {
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }

    update() {
        if(this.rKey.isDown) {
            //next scene
            console.log("next scene");
            this.scene.scene.start("GameOver");
        }
    }
}
