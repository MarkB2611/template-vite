import * as Phaser from "phaser";


export default class AmmoUI {
    constructor(scene, x, y) {
        this.text = scene.add.text(x, y, "8 / 32", {
            fontFamily: 'Georgia',
            fontSize: 26,
            color: '#02ff4e',
            stroke: '#000000',
            strokeThickness: 14,
        });

        this.text.setOrigin(0.5);
        this.text.setAlpha(0.75)
        this.scene = scene;
        scene.events.on('ammoChanged', this.updateText, this);
    }

    updateText(clip, reserve) {
        this.text.setText(`${clip} / ${reserve}`);
        this.makeVisible();
        this.makeInvisible();
        
    }

    makeVisible() {
        if (this.fadeTimer) {
            this.fadeTimer.remove(false);
        }

        // kill any fade tween
        this.scene.tweens.killTweensOf([this.text]);

        this.text.setAlpha(1);
    }

    makeInvisible() {
        this.fadeTimer = this.scene.time.delayedCall(3500, () => {

            this.scene.tweens.add({
                targets: [this.text],
                alpha: 0,
                duration: 1200,
                ease: "Linear"
            });

        });
    }
}

