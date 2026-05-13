import * as Phaser from "phaser";


export default class AmmoUI {
    constructor(scene, x, y) {
        this.text = scene.add.text(x, y, "ammo: 8 / 32", {
            fontFamily: 'Georgia',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
        });

        this.text.setOrigin(0.5);

        scene.events.on('ammoChanged', this.updateText, this);
    }

    updateText(clip, reserve) {
        this.text.setText(`Ammo: ${clip} / ${reserve}`);
    }
}

