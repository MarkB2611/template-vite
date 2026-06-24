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

        // ✅ Clear existing pickups first
        this.wpm.clearPickups();

        const wave = this.wm.WaveNumber;
        
        // ✅ Tell the system to generate buyables
        this.wpm["scene"].events.emit(
            "generate_buyables",
            luckSeed,
            wave
        );
        
    }

    initWaveManager(luck: number) {
     
    }

    initPerKManager(luck: number) {

    }

    
    initWeaponPickupManager(luck: number) {

    }

}