import * as Phaser from "phaser";


export default class GunNameUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, gunName) {
        super(scene, x, y,  gunName, {
            fontFamily: 'Courier New',
            fontSize: 24,
            color: '#000000',
            stroke: '#ff00aa',
            strokeThickness: 7,
            align: 'center'
        });

        this.setOrigin(0.7);
        this.setAlpha(0.8);
        scene.add.existing(this);
    }

    setName(gunName) {
        this.setText(gunName);
    }
}
