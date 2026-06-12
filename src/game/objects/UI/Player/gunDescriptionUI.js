import * as Phaser from "phaser";


export default class GunDescriptionUI extends Phaser.GameObjects.Text {
    constructor(scene, x, y, gunDesc) {
        super(scene, x, y,  gunDesc, {
            fontFamily: 'Courier New',
            fontSize: 9,
            color: '#fdfcfc',
            stroke: '#ff6600',
            strokeThickness: 5,
            align: 'center',


            wordWrap: {
                width: 200,   // ✅ max width before wrapping
                useAdvancedWrap: true
            }

        });

        this.setName(gunDesc);
        
        this.setOrigin(0.9);
        this.setAlpha(0.9);
        scene.add.existing(this);
    }

    

    setName(gunDesc) {
        this.setVisible(true);
        this.setText(gunDesc);
        setTimeout(() => {
            this.setVisible(false);
        }, 6000);
    }
}
