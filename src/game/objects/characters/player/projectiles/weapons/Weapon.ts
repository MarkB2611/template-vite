
// Weapon.ts
import * as Phaser from "phaser";
import Bullet from "../bullets/Bullet";

export default class Weapon {
    scene: Phaser.Scene;

    // stats
    clipSize: number;
    clipAmount: number;
    reserveSize: number;
    reserveMaxSize: number;

    fireRate: number;
    lastFired = 0;

    reloadTime: number;
    isReloading = false;

    damage: number;
    bulletSpeed: number;

    depletionAmount: number;

    constructor(scene: Phaser.Scene, config: any) {
        this.scene = scene;

        // assign from config
        this.clipSize = config.clipSize;
        this.clipAmount = config.clipSize;
        this.reserveSize = config.reserveSize;
        this.reserveMaxSize = config.reserveMaxSize;

        this.fireRate = config.fireRate;
        this.reloadTime = config.reloadTime;

        this.damage = config.damage;
        this.bulletSpeed = config.bulletSpeed;

        this.depletionAmount = config.depletionAmount ?? 1;
    }

    shoot(x: number, y: number, angle: number, time: number) {
        if (time < this.lastFired + this.fireRate) return;
        if (this.clipAmount < this.depletionAmount) return;
        if (this.isReloading) return;

        this.lastFired = time;

        const bullet = new Bullet(this.scene, x, y, angle);
        (this.scene as any).bullets.add(bullet);

        this.clipAmount -= this.depletionAmount;

        (this.scene as any).soundHandler.playSFX(
            "sfx_gunshot_laser_1",
            0.3,
            2.3,
            2400
        );

        this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
    }

    reload() {
        if (this.isReloading) return;
        if (this.reserveSize <= 0) return;

        this.isReloading = true;

        this.scene.events.emit('playerReload');

        this.scene.time.delayedCall(this.reloadTime, () => {
            const needed = this.clipSize - this.clipAmount;
            const toReload = Math.min(needed, this.reserveSize);

            this.clipAmount += toReload;
            this.reserveSize -= toReload;

            this.isReloading = false;

            this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
        });
    }
}
