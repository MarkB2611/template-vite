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
        this.setAlpha(0.3);

        this.setValues("Ground Zero", 0)

        scene.add.existing(this);

    }

    setLocation(name) {
        this.setText(name);
    }

    setValues(name, roomsTravelled) {
        this.setVisible(true);
        this.setText(name + "\nrooms: " + roomsTravelled);
        setTimeout(() => {
            this.setVisible(false);
        }, 12000);
    }
}
