import * as Phaser from "phaser";


export default class LocationUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, locationName) {
        super(scene, x, y, locationName, {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        });

        this.setOrigin(0.5);

        scene.add.existing(this);
    }

    setLocation(name) {
        this.setText(name);
    }
}
