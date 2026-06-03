
// Weapon.ts
import * as Phaser from "phaser";
import Bullet from "../bullets/Bullet";
import { WeaponConfig } from "./WeaponManager";
import Explosion from "../explosions/Explosion";

export default class Weapon {
    scene: Phaser.Scene;

    id: number;
    name: string;
    description: string;

    fireMode: "semi"|"auto"|"burst" = "semi";

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

    constructor(scene: Phaser.Scene, config: WeaponConfig) {
        this.scene = scene;

        this.id = config.id ?? 999;
        this.name = config.name ?? "DEFAULT WEAPON";
        this.description = config.description ?? "DEFAULT VALUES";

        this.fireMode = config.fireMode ?? "semi";

        // ammo
        this.clipSize = config.clipSize ?? 3;
        this.clipAmount = config.clipSize ?? 3;

        this.reserveSize = config.reserveSize ?? 30;
        //starts out with max - not a mistake just not making a redundant variable for no reason
        this.reserveMaxSize = config.reserveSize ?? 30;

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
        
        //replacing with safer one liner
        //(this.scene as any).soundHandler.playSFX("sfx_gunshot_laser_1", 0.1, 2.6, 100 );
        //if the spoundhandler breaks it simply wont call as apposed to crashing.
        this.scene.events.emit("playSound", "sfx_gunshot_laser_1", 0.1, 2.6, 100 )
        // 🔥 Support shotgun pellets - adding burst support
        if(this.fireMode == "burst") { //add a small delay betqeen each fire
            
            const delayBetweenShots = 45; // ms between each shot in the burst

            this.scene.time.addEvent({
                delay: delayBetweenShots,
                repeat: this.pelletCount - 1, // total shots = pelletCount
                callback: () => {
                    const spread = Phaser.Math.FloatBetween(-this.spread, this.spread);


                    const offsetX = 20;   // right of player
                    const offsetY = -10;  // above player

                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);

                    // rotate offset around player
                    const spawnX = x + (offsetX * cos - offsetY * sin);
                    const spawnY = y + (offsetX * sin + offsetY * cos);

                    const bullet = new Bullet(
                        this.scene,
                        spawnX,
                        spawnY,
                        angle + spread,
                        this.damage,
                        this.bulletSpeed,
                        this.penetration
                    );
                    const explosion = new Explosion(
                        this.scene,
                        spawnX,
                        spawnY,
                        angle + spread,
                        this.damage,
                        this.bulletSpeed,
                        this.penetration
                    );

                    //dangerous see how I can replace
                    (this.scene as any).bullets.add(bullet);
                }
            });

        } else { //normal case
            for (let i = 0; i < this.pelletCount; i++) {
                const spread = Phaser.Math.FloatBetween(-this.spread, this.spread);


                const offsetX = 25;   // right of player
                const offsetY = 10;  // above player

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                // rotate offset around player
                const spawnX = x + (offsetX * cos - offsetY * sin);
                const spawnY = y + (offsetX * sin + offsetY * cos);


                const bullet = new Bullet(
                    this.scene,
                    spawnX,
                    spawnY,
                    angle + spread,
                    this.damage,
                    this.bulletSpeed,
                    this.penetration
                );
                const explosion = new Explosion(
                    this.scene,
                    spawnX,
                    spawnY,
                    angle + spread,
                    this.damage,
                    this.bulletSpeed,
                    this.penetration
                );

                (this.scene as any).bullets.add(bullet);
            }
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
