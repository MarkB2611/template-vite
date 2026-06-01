import * as Phaser from "phaser";


export default class GunNameUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, gunName) {
        super(scene, x, y,  gunName, {
            fontFamily: 'Courier New',
            fontSize: 20,
            color: '#fdfcfc',
            stroke: '#ff0077',
            strokeThickness: 7,
            align: 'center'
        });

        this.setOrigin(0.7);
        this.setAlpha(0.55);
        scene.add.existing(this);
    }

    setName(gunName) {
        this.setText(gunName);
    }
}
