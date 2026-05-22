
// Weapon.ts
import * as Phaser from "phaser";
import Bullet from "../bullets/Bullet";

export default class Weapon {
    scene: Phaser.Scene;

    id: number;
    name: string;
    description: string;

    auto: boolean;

    // ammo
    clipSize: number;
    clipAmount: number;
    reserveSize: number;
    reserveMaxSize: number;

    // firing
    fireRate: number;
    lastFired = 0;

    reloadTime: number;
    isReloading = false;

    // damage
    damage: number;
    pelletCount: number; // NEW (for shotguns)

    bulletSpeed: number;
    penetration: number;

    depletionAmount: number;

    baseCost: number;
    assetDirectory: string;

    constructor(scene: Phaser.Scene, config: any) {
        this.scene = scene;

        this.id = config.id;
        this.name = config.name;
        this.description = config.description;

        this.auto = config.auto;

        // ammo
        this.clipSize = config.clipSize;
        this.clipAmount = config.clipSize;

        this.reserveSize = config.reserveSize;
        this.reserveMaxSize = config.reserveMaxSize ?? config.reserveSize;

        // firing
        this.fireRate = config.fireRate;
        this.reloadTime = config.reloadTime;

        // damage (supports shotgun format like "10x30")
        this.damage = config.damage;
        this.pelletCount = config.pelletCount ?? 1;

        this.bulletSpeed = config.bulletSpeed;
        this.penetration = config.penetration ?? 0;

        this.depletionAmount = config.depletionAmount ?? 1;

        this.baseCost = config.baseCost ?? 0;
        this.assetDirectory = config.assetDirectory ?? "";
    }

    shoot(x: number, y: number, angle: number, time: number) {
        if (time < this.lastFired + this.fireRate) return;
        if (this.clipAmount < this.depletionAmount) return;
        if (this.isReloading) return;

        this.lastFired = time;

        // 🔥 Support shotgun pellets
        for (let i = 0; i < this.pelletCount; i++) {
            const spread = Phaser.Math.FloatBetween(-0.1, 0.1);

            const bullet = new Bullet(
                this.scene,
                x,
                y,
                angle + spread,
                this.damage,
                this.bulletSpeed,
                this.penetration
            );

            (this.scene as any).bullets.add(bullet);
        }

        this.clipAmount -= this.depletionAmount;

        this.scene.events.emit("ammoChanged", this.clipAmount, this.reserveSize);
    }

    reload() {
        if (this.isReloading) return;
        if (this.reserveSize <= 0) return;

        this.isReloading = true;

        this.scene.events.emit("playerReload");

        this.scene.time.delayedCall(this.reloadTime, () => {
            const needed = this.clipSize - this.clipAmount;
            const toReload = Math.min(needed, this.reserveSize);

            this.clipAmount += toReload;
            this.reserveSize -= toReload;

            this.isReloading = false;

            this.scene.events.emit("ammoChanged", this.clipAmount, this.reserveSize);
        });
    }
}
