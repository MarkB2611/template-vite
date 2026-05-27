
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
    spread: number; //unintentional addition for single bullet/pellet weapons, adds to gameplay and necessity for shotguns

    bulletSpeed: number;
    penetration: number;

    depletionAmount: number;

    baseCost: number;
    assetDirectory: string;

    constructor(scene: Phaser.Scene, config: any) {
        this.scene = scene;

        this.id = config.id ?? 999;
        this.name = config.name ?? "DEFAULT WEAPON";
        this.description = config.description ?? "DEFAULT VALUES";

        this.auto = config.auto ?? false;

        // ammo
        this.clipSize = config.clipSize ?? 3;
        this.clipAmount = config.clipSize ?? 3;

        this.reserveSize = config.reserveSize ?? 30;
        this.reserveMaxSize = config.reserveMaxSize ?? config.reserveSize ?? 30;

        // firing
        this.fireRate = config.fireRate ?? 10;
        this.reloadTime = config.reloadTime ?? 3000;

        // damage (supports shotgun format like "10x30")
        this.damage = config.damage ?? 8;
        this.pelletCount = config.pelletCount ?? 1;
        //default spread is 0.1
        this.spread = config.spread ?? 0.1;

        this.bulletSpeed = config.bulletSpeed ?? 300;
        this.penetration = config.penetration ?? 0;

        this.depletionAmount = config.depletionAmount ?? 1;

        this.baseCost = config.baseCost ?? 0;
        this.assetDirectory = config.assetDirectory ?? "NA";
    }

    shoot(x: number, y: number, angle: number, time: number) {
        if (time < this.lastFired + this.fireRate) return;
        if (this.clipAmount < this.depletionAmount) return;
        if (this.isReloading) return;

        this.lastFired = time;

        (this.scene as any).soundHandler.playSFX("sfx_gunshot_laser_1", 0.1, 2.6, 100 );
        // 🔥 Support shotgun pellets
        for (let i = 0; i < this.pelletCount; i++) {
            const spread = Phaser.Math.FloatBetween(-this.spread, this.spread);

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
