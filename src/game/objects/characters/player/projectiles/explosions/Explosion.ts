
//public/assets/sounds/400Sounds/Retro/explosion_quick.wav
//sfx_muzzle_flash
// Weapon.ts
import * as Phaser from "phaser";
import BaseZombie from "../../../../handlers/enemies/baseEnemy";

export default class Explosion extends Phaser.GameObjects.Sprite {
    speed: number;
    damage: number;

    penetration: number;
    hitsRemaining: number;


    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        fireAngle: number,
        damage: number,
        speed: number,
        penetration: number
    ) {
        super(scene, x, y, "muzzle_flash_1");
        
        this.speed = speed;
        this.damage = damage;

        this.penetration = penetration;
        this.hitsRemaining = penetration + 1; 
        // +1 so penetration = 0 still hits 1 enemy

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.6, 0.6)
        this.setActive(true);
        this.setVisible(true);

        this.setScale(1.8);

        scene.time.delayedCall(0, () => {
            const body = this.body as Phaser.Physics.Arcade.Body;

            if (!body) return;

                            
            this.setRotation(fireAngle); // rotates sprite visually


        

        });



        this.anims.create({
            key: "muzzle_flash",
            frames: [
                { key: "muzzle_flash_1" },
                { key: "muzzle_flash_2" },
                { key: "muzzle_flash_3" },
                { key: "muzzle_flash_4" },
                { key: "muzzle_flash_5" },
                { key: "muzzle_flash_6" },
                { key: "muzzle_flash_7" }
            ],
            frameRate: 20,
            repeat: 0
        });

        this.scene.events.emit("playSound", "sfx_muzzle_flash", 0.8, 1.4)
        this.play("muzzle_flash");
        // cleanup
       
        // destroy when done
        this.on("animationcomplete", () => {
            this.destroy();
        });

    }

}
