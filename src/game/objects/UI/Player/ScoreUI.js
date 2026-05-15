import * as Phaser from "phaser";


export default class ScoreNumberUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, number) {
        super(scene, x, y,  number, {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#000000',
            stroke: '#00ff15',
            strokeThickness: 18,
            align: 'center'
        });

        this.setOrigin(0.5);

        scene.add.existing(this);
    }

    setScore(number) {
        this.setText(number);
    }
}
