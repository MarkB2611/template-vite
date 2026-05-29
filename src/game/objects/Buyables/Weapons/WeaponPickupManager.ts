import * as Phaser from "phaser";
import Player from "../../characters/player/player";
import WeaponPickup from "./WeaponPickup";

//initially jsut going to hold predefined weapon pickups, but later on will randomise spawns to specific anchors and randomise:
// weapons,
// cost of said weapons based upon baseCost,
// what type of weapons should be placed with really bad luck rolls for awful weapons



export default class WeaponPickupManager {
    private scene: Phaser.Scene;

    private weaponPickups: Map<number, WeaponPickup> = new Map();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        //objects(wall buys)
        //Make a controller to just loop through updates for every wallbuy placed in the current room
        //tested the weapons from the csv and all of them work
        const slrWallBuy = new WeaponPickup(scene, 220, 240, 9, 0.8);
        //objects(wall buys)
        const brwningWallBuy = new WeaponPickup(scene, 700, 600, 0, 0.4);

        //ads to map
        this.weaponPickups.set(0, brwningWallBuy);
        this.weaponPickups.set(1, slrWallBuy);
        



    }

    update(p1: Player) {
        //updates every pickup in the weaponPickups
        this.weaponPickups.forEach((wPckup: WeaponPickup, i: number)  => {
            wPckup.update(p1);

        });
    }

}