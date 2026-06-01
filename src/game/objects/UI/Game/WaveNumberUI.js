import * as Phaser from "phaser";


export default class WaveNumberUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, number) {
        super(scene, x, y, "Wave: " + number, {
            fontFamily: 'Georgia',
            fontSize: 48,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 16,
            align: 'center'
        });

        this.setOrigin(0.5);
        this.setAlpha(0.6)

        scene.add.existing(this);

        this.scene.events.on("next_wave", (waveNum) => {
            this.setWave(waveNum);
        })
    }

    setWave(number) {
        this.setText("Wave: " + number);
    }
}
