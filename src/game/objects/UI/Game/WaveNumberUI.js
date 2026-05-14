import * as Phaser from "phaser";


export default class WaveNumberUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, number) {
        super(scene, x, y, "Wave: " + number, {
            fontFamily: 'Georgia',
            fontSize: 22,
            color: '#00ff51',
            stroke: '#0062ff',
            strokeThickness: 8,
            align: 'center'
        });

        this.setOrigin(0.5);

        scene.add.existing(this);
    }

    setWave(number) {
        this.setText("Wave: " + number);
    }
}
