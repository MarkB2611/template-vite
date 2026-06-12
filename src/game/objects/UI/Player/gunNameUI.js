import * as Phaser from "phaser";


export default class GunNameUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, gunName) {
        super(scene, x, y,  gunName, {
            fontFamily: 'Courier New',
            fontSize: 22,
            color: '#000000',
            stroke: '#ff7300',
            strokeThickness: 7,
            align: 'center'
        });

        this.setName(gunName);

        this.setOrigin(0.9);
        this.setAlpha(0.9);
        
        scene.add.existing(this);
    }

    setName(gunName) {
        this.setVisible(true);
        this.setText(gunName);
        setTimeout(() => {
            this.setVisible(false);
        }, 6000);
    }
}
