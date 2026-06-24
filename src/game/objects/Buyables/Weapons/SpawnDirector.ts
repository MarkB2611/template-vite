
import * as Phaser from "phaser";
import WeaponManager from "../../characters/player/projectiles/weapons/WeaponManager";

type BuyableType = "weapon" | "perk";

export default class SpawnDirector {

    private scene: Phaser.Scene;
    private weaponManager: WeaponManager;

    allowPerks!: false;

    constructor(scene: Phaser.Scene, weaponManager: WeaponManager) {
        this.scene = scene;
        this.weaponManager = weaponManager;

        // 🎯 Listen for spawn requests
        this.scene.events.on(
            "generate_buyables",
            (luck: number, wave: number) => {
                console.log("Generating buyables")
                this.generate(luck, wave);
            }
        );
    }

    // =========================================
    // 🎲 MAIN GENERATION ENTRY
    // =========================================

    generate(luck: number, wave: number) {

        const count = this.getSpawnCount(wave);

        const usedWeapons = new Set<number>();

        for (let i = 0; i < count; i++) {

            const type = this.pickType(wave)
            console.log("Spawning type:", type);;

            if (type === "weapon") {

                let weaponId: number;

                // ✅ prevent duplicates
                do {
                    weaponId = this.pickWeapon(luck, wave);
                } while (usedWeapons.has(weaponId));

                usedWeapons.add(weaponId);

                this.scene.events.emit("buyable_node_initiated", 
                    i+100,
                    "weapon",
                    weaponId
                );

                console.log("Spawning WeaponID " + weaponId)

            } else {

                const perkId = this.pickPerk(luck, wave);

                this.scene.events.emit("buyable_node_initiated", 
                    i+200,
                    "perk",
                    perkId
                );
            }
        }
    }

    // =========================================
    // 🔢 SPAWN COUNT SCALING
    // =========================================

    getSpawnCount(wave: number): number {

        if (wave < 5) return Phaser.Math.Between(1, 2);

        if (wave < 10) return Phaser.Math.Between(2, 3);

        if (wave < 20) return Phaser.Math.Between(2, 4);

        return Phaser.Math.Between(3, 5);
    }

    // =========================================
    // 🎯 TYPE SELECTION (weapon vs perk)
    // =========================================

    pickType(wave: number): any {


        if(!this.allowPerks) return "weapon";

        
        if (wave < 5) {
            return this.weightedRandom(
                ["weapon", "perk"],
                [0.9, 0.1]
            );
        }

        if (wave < 15) {
            return this.weightedRandom(
                ["weapon", "perk"],
                [0.7, 0.3]
            );
        }

        return this.weightedRandom(
            ["weapon", "perk"],
            [0.5, 0.5]
        );
    }

    // =========================================
    // 🔫 WEAPON SELECTION (based on your system)
    // =========================================

    pickWeapon(luck: number, wave: number): number {

        const allWeapons = [];

        for (let i = 0; i <= 9; i++) {
            const config = this.weaponManager.getWeaponConfig(i);
            if (config) {
                allWeapons.push(config);
            }
        }

        const weights: number[] = [];
        const MAX_COST = 2500;

        allWeapons.forEach(w => {

            const costFactor = w.baseCost / MAX_COST;

            const luckBias = (luck + 1) / 2;
            const waveFactor = Phaser.Math.Clamp(wave / 20, 0, 1);

            const targetQuality = (luckBias * 0.6) + (waveFactor * 0.4);

            const weight = 1 - Math.abs(costFactor - targetQuality);

            weights.push(Math.max(weight, 0.01));
        });

        const chosen = this.weightedRandom(allWeapons, weights);

        return chosen.id;
    }

    // =========================================
    // 💊 PERK SELECTION (placeholder for now)
    // =========================================

    pickPerk(luck: number, wave: number): number {

        // 👉 Replace with real perk system later
        // simple random for now

        const perkIds = [0, 1, 2, 3];

        return Phaser.Utils.Array.GetRandom(perkIds);
    }

    // =========================================
    // 🎲 GENERIC WEIGHTED RANDOM
    // =========================================

    weightedRandom<T>(items: T[], weights: number[]): T {

        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;

        for (let i = 0; i < items.length; i++) {
            if (r < weights[i]) return items[i];
            r -= weights[i];
        }

        return items[0];
    }
}
