import * as Phaser from "phaser"
import Weapon from "./Weapon";

//AI Generated to accellerate development, based upon the weapon class context (bottom Up methodology)
// this should control multiple weapons for the player cleanly and parse the Weapons CSV file/
// events: weaponAdded, weaponReplaced, weaponSwitched
// weaponAdded(same as replaced really, but slightly diff)
// weaponSwitched should show the name of the weapon and description briefly.


// 🔥 Helper: parse shotgun damage like "10x30"

function parseDamage(damageStr: string | undefined) {
    if (!damageStr) {
        return {
            pelletCount: 1,
            damage: 0
        };
    }

    if (damageStr.includes("x")) {
        const [pellets, dmg] = damageStr.split("x").map(Number);
        return {
            pelletCount: pellets,
            damage: dmg
        };
    }

    return {
        pelletCount: 1,
        damage: Number(damageStr)
    };
}


export default class WeaponManager {
    private scene: Phaser.Scene;

    // 📦 weapon configs (from CSV)
    private weaponConfigs: Map<number, WeaponConfig> = new Map();

    // 🔫 inventory
    private weaponSlots: (Weapon | null)[] = [];
    private maxSlots: number;

    public currentSlot: number = 0;
    public currentWeapon: Weapon | null = null;

    constructor(scene: Phaser.Scene, maxSlots: number = 2) {

        
        this.scene = scene;
        this.maxSlots = maxSlots;
        // load CSV
        const csvText = this.scene.cache.text.get("weaponsCSV");
        this.loadFromCSV(csvText);
        

        this.weaponSlots = new Array(maxSlots).fill(null);

        //new default weapon - dusty old revolver - less powerful and intended to get the first weapons in the first room(always spawn a browning and a slr?)
        this.addWeaponById(999);
        this.switchToSlot(0);

        this.scene.events.emit("ammoChanged", this.currentWeapon?.clipSize, this.currentWeapon?.reserveSize);
        
        

        this.scene.events.on("weaponSwitched", (slot: number, weapon: Weapon) => {
            console.log(`Switched to slot ${slot}: ${weapon.name}`);
        });

        this.scene.events.on("weaponAdded", (slot: number, weapon: Weapon) => {
            console.log(`Picked up ${weapon.name} with slot ${slot}`);
        });

        this.scene.events.on("weaponReplaced", (slot: number, weapon: Weapon) => {
            console.log(`Replaced slot ${slot} with ${weapon.name}`);
        });

        console.log(this.currentSlot);
    }

    // =========================================
    // ✅ CSV LOADING + PARSING
    // =========================================

    loadFromCSV(csvText: string) {
        const rows = this.parseCSV(csvText);

        rows.forEach(row => {
            const parsedDamage = parseDamage(row.Damage);

            const config = {
                id: Number(row.WeaponID),
                name: row.WeaponName,
                description: row.WeaponDescription,

                fireMode: row.FireMode ?? "semi",

                clipSize: Number(row.ClipSize),
                reserveSize: Number(row.ReserveSize),

                fireRate: Number(row.FireRate),
                reloadTime: Number(row.ReloadTime),

                damage: parsedDamage.damage,
                pelletCount: parsedDamage.pelletCount,

                bulletSpeed: Number(row.BulletSpeed),
                spread: Number(row.Spread) || 0,

                penetration: Number(row.Penetration),
                depletionAmount: Number(row.DepletionAmount),

                baseCost: Number(row.BaseCost),
                assetDirectory: row.AssetDirectory !== "NA" ? row.AssetDirectory : "",
            };
            console.log("Loaded config:", config);
            this.weaponConfigs.set(config.id, config);
        });
    }

    private parseCSV(csv: string) {
        const lines = csv.split("\n");
        const headers = lines[0].split(",");

        return lines
            .slice(1)
            .filter(line => line.trim() !== "")
            .map(line => {
                const values = line.split(",");

                // ✅ Skip broken rows
                if (values.length !== headers.length) {
                    console.warn("Skipping malformed row:", line);
                    return null;
                }

                const obj: any = {};

                headers.forEach((h, i) => {
                    obj[h.trim()] = values[i]?.trim();
                });

                return obj;
            })
            .filter(row => row !== null);
    }

    // =========================================
    // ✅ WEAPON CREATION
    // =========================================

    createWeapon(id: number): Weapon {
        const config = this.weaponConfigs.get(id);
        if (!config) throw new Error(`Weapon ${id} not found`);

        return new Weapon(this.scene, config);
    }

    // =========================================
    // ✅ INVENTORY SYSTEM
    // =========================================

    
    addWeaponById(id: number): boolean {
        const weapon = this.createWeapon(id);

        for (let i = 0; i < this.maxSlots; i++) {
            if (this.weaponSlots[i] === null) {

                this.weaponSlots[i] = weapon;

                this.scene.events.emit("weaponAdded", i, weapon);

                // ✅ ALWAYS switch to new weapon
                this.switchToSlot(i);
                //update ammo counter via event
                this.scene.events.emit("ammoChanged", weapon.clipAmount, weapon.reserveSize);

                return true;
            }
        }

        return false;
    }



    tryAddOrReplace(id: number) {
        const added = this.addWeaponById(id);

        if (!added) {
            this.replaceWeapon(this.currentSlot, id);
        }
    }


    // ✅ Replace a slot (explicit swap)
    replaceWeapon(slot: number, weaponId: number) {
        if (slot < 0 || slot >= this.maxSlots) return;

        const newWeapon = this.createWeapon(weaponId);
        this.weaponSlots[slot] = newWeapon;

        this.scene.events.emit("weaponReplaced", slot, newWeapon);

        this.switchToSlot(slot);
    }

    // ✅ Switch weapons
    switchToSlot(index: number) {
        if (index < 0 || index >= this.maxSlots) return;

        const weapon = this.weaponSlots[index];
        if (!weapon) return;

        this.currentSlot = index;
        this.currentWeapon = weapon;

        this.scene.events.emit("weaponSwitched", index, weapon);
        this.scene.events.emit("playSound", "sfx_weapon_swap", 0.8, 1.0, 0);
        this.scene.events.emit("ammoChanged", weapon.clipAmount, weapon.reserveSize);
    }

    // ✅ Keyboard helper
    handleNumberInput(key: number) {
        this.switchToSlot(key - 1);
    }

    // =========================================
    // ✅ ACTIONS
    // =========================================

    shoot(x: number, y: number, angle: number, time: number) {
        if (!this.currentWeapon) return;

        this.currentWeapon.shoot(x, y, angle, time);
    }

    reload() {
        if (!this.currentWeapon) return;

        this.currentWeapon.reload();
    }

    // =========================================
    // ✅ SLOT UPGRADE (2 → 3 weapons later)
    // =========================================

    setMaxSlots(newMax: number) {
        if (newMax <= this.maxSlots) return;

        const extra = newMax - this.maxSlots;

        for (let i = 0; i < extra; i++) {
            this.weaponSlots.push(null);
        }

        this.maxSlots = newMax;
    }

    // =========================================
    // ✅ GETTERS (UI / Debug)
    // =========================================

    getWeapons() {
        return this.weaponSlots;
    }

    getCurrentWeapon() {
        return this.currentWeapon;
    }


    getWeaponConfig(id: number): WeaponConfig | null {
        const config = this.weaponConfigs.get(id);

        if (!config) {
            console.warn(`Weapon config not found for id: ${id}`);
            return null;
        }

        return config;
    }



}

export interface WeaponConfig {
    id: number;
    name: string;
    description: string;

    //provides and enum/type - refactored from auto vs semi bool
    fireMode: "semi"|"auto"|"burst";

    clipSize: number;
    reserveSize: number;

    fireRate: number;
    reloadTime: number;

    damage: number;
    pelletCount: number;

    bulletSpeed: number;
    spread: number;

    penetration: number;
    depletionAmount: number;

    baseCost: number;
    assetDirectory: string;
}