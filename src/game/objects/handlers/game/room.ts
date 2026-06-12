import * as Phaser from "phaser";
import WeaponPickupManager from "../../../objects/Buyables/Weapons/WeaponPickupManager.ts";
import PerkPickupManager from "../perks/perkPickupManager.ts";
import WaveHandler from "../enemies/waveHandler.ts";

export default class Room {

    wpm!: WeaponPickupManager;
    pm!: PerkPickupManager;
    wm!: WaveHandler;

    constructor(wpManager: WeaponPickupManager, pManager: PerkPickupManager, wManager: WaveHandler) {
        this.wpm = wpManager;
        this.pm = pManager;
        this.wm = wManager;
    }

    //all between 1 and -1
    initialiseRoom(luckSeed: number) {
        this.initWaveManager(luckSeed);
        this.initPerKManager(luckSeed);
        this.initWeaponPickupManager(luckSeed);
        
    }

    initWaveManager(luck: number) {
        if(luck < 0) {
            
        }
    }

    initPerKManager(luck: number) {

    }

    initWeaponPickupManager(luck: number) {

        const wave = this.wm.WaveNumber; // ✅ from WaveHandler

        this.wpm.generateWeaponPlacements(luck, wave);

    }
}