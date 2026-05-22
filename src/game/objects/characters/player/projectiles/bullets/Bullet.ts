// Weapon.ts
import * as Phaser from "phaser";
import BaseZombie from "../../../../handlers/enemies/baseEnemy";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    damage: number;

    penetration: number;
    hitsRemaining: number;

    hitTargets: Set<number> = new Set();

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        fireAngle: number,
        damage: number,
        speed: number,
        penetration: number
    ) {
        super(scene, x, y, "bullet");

        this.speed = speed;
        this.damage = damage;

        this.penetration = penetration;
        this.hitsRemaining = penetration + 1; 
        // +1 so penetration = 0 still hits 1 enemy

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);

        scene.time.delayedCall(0, () => {
            const body = this.body as Phaser.Physics.Arcade.Body;

            if (!body) return;

            scene.physics.velocityFromRotation(
                fireAngle,
                this.speed,
                body.velocity
            );
        });

        // cleanup
        scene.time.delayedCall(3000, () => {
            this.destroy();
        });
    }

    onHitEnemy(enemy: BaseZombie) {
        // Apply damage
        if( !this.hitTargets.has(enemy.zombieIndex) ) {
            enemy.takeDamage(this.damage);
            this.hitTargets.add(enemy.zombieIndex);
        }
        

        this.hitsRemaining--;

        if (this.hitsRemaining <= 0) {
            this.destroy();
        }
    }
}
