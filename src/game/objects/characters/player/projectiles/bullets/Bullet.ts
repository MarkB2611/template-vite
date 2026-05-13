import * as Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    speed = 1000;


    //when constructed fires straight away
    
    
    constructor(scene: Phaser.Scene, x: number, y: number, fireAngle: number) {
        super(scene, x, y, "bullet");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);

        // ✅ wait until next frame (critical)
        scene.time.delayedCall(0, () => {
            const body = this.body as Phaser.Physics.Arcade.Body;

            if (!body) return;

            scene.physics.velocityFromRotation(
                fireAngle,
                this.speed,
                body.velocity
            );
        });

        // ✅ cleanup (also critical)
        scene.time.delayedCall(1000, () => {
            this.destroy();
        });
    }


    
    
    fire(x: number, y: number, angle: number) {
        this.setPosition(x, y);

        const body = this.body as Phaser.Physics.Arcade.Body;

        if (!body) {
            console.warn("Bullet body not ready");
            return;
        }

        this.scene.physics.velocityFromRotation(
            angle,
            this.speed,
            body.velocity
        );

        this.setActive(true);
        this.setVisible(true);
    }


}