import * as Phaser from "phaser";


export default class EnemiesRemainUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, remaining, maximum) {
        super(scene, x, y, "Enemies: " + remaining + " / " + maximum, {
            fontFamily: 'Georgia',
            fontSize: 22,
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 8,
            align: 'center'
        });

        this.setOrigin(0.5);

        scene.add.existing(this);
    }

    setAmount(remaining, maximum) {
        this.setText("Enemies: " + remaining + " / " + maximum);
    }
}
