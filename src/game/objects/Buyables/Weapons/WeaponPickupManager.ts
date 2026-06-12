import * as Phaser from "phaser";
import Player from "../../characters/player/player";
import WeaponPickup from "./WeaponPickup";
import WeaponManager from "../../characters/player/projectiles/weapons/WeaponManager";

//initially jsut going to hold predefined weapon pickups, but later on will randomise spawns to specific anchors and randomise:
// weapons,
// cost of said weapons based upon baseCost,
// what type of weapons should be placed with really bad luck rolls for awful weapons



export default class WeaponPickupManager {
    private scene: Phaser.Scene;

    private weaponPickups: Map<number, WeaponPickup> = new Map();

    private weaponManager: WeaponManager;

    constructor(scene: Phaser.Scene, weaponManager: WeaponManager) {
        this.scene = scene;
        //objects(wall buys)
        //Make a controller to just loop through updates for every wallbuy placed in the current room
        //tested the weapons from the csv and all of them work
        const slrWallBuy = new WeaponPickup(scene, 220, 240, 1, 0.8);
        //objects(wall buys)
        const brwningWallBuy = new WeaponPickup(scene, 700, 600, 0, 0.4);

        //ads to map
        this.weaponPickups.set(0, brwningWallBuy);
        this.weaponPickups.set(1, slrWallBuy);
        
        //csv weapon handling needed for room advancement
        this.weaponManager = weaponManager;



    }

    //celars pickups ast the end of the round - to ensure that there isnt incrementing amoutns of weaponPickups
    clearPickups() {
        this.weaponPickups.forEach((pickup) => {
            pickup.destroy(); // removes sprite + physics body
        });

        this.weaponPickups.clear();
    }



    weightedRandom<T>(items: T[], weights: number[]): T {
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;

        for (let i = 0; i < items.length; i++) {
            if (r < weights[i]) return items[i];
            r -= weights[i];
        }

        return items[0];
    }


    //returns a random weapon based on luck
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

    //generated using prompting - IDea is to have 9 locations where the weaponPickups can spawn.
    generateWeaponPlacements(luck: number, wave: number) {

        // 🧹 Clear old pickups
        this.clearPickups();

        // 🎯 9 fixed spawn locations - add to the others later so I can have randomised spanwns for perk machines, and for weaponUpgrade machines.
        const spawnPoints = [
            { x: 150, y: 150 },
            { x: 400, y: 150 },
            { x: 650, y: 150 },

            { x: 150, y: 350 },
            { x: 400, y: 350 },
            { x: 650, y: 350 },

            { x: 150, y: 550 },
            { x: 400, y: 550 },
            { x: 650, y: 550 }
        ];

        // 🎲 Decide number of weapons (1–3)
        const weaponCount = Phaser.Math.Between(1, 3);

        // 🃏 Shuffle spawn points so we get random positions
        const shuffledPoints = Phaser.Utils.Array.Shuffle([...spawnPoints]);

        // ✅ Optional: prevent duplicates
        const usedWeapons = new Set<number>();

        for (let i = 0; i < weaponCount; i++) {

            let weaponId: number;

            // 🎯 Avoid duplicates
            do {
                weaponId = this.pickWeapon(luck, wave);
            } while (usedWeapons.has(weaponId));

            usedWeapons.add(weaponId);

            const point = shuffledPoints[i];

            const pickup = new WeaponPickup(
                this.scene,
                point.x,
                point.y,
                weaponId,
                0.6 // scale (you can vary this later)
            );

            this.weaponPickups.set(i, pickup);
        }
    }




    update(p1: Player) {
        //updates every pickup in the weaponPickups
        this.weaponPickups.forEach((wPckup: WeaponPickup, i: number)  => {
            wPckup.update(p1);

        });
    }

}