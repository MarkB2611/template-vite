import * as Phaser from "phaser";


export default class GunDescriptionUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, gunDesc) {
        super(scene, x, y,  gunDesc, {
            fontFamily: 'Courier New',
            fontSize: 9,
            color: '#fdfcfc',
            stroke: '#ff0077',
            strokeThickness: 5,
            align: 'center'
        });

        this.setOrigin(0.7);
        this.setAlpha(0.9);
        scene.add.existing(this);
    }

    setName(gunDesc) {
        this.setText(gunDesc);
    }
}
