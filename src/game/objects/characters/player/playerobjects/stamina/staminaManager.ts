
import * as Phaser from "phaser"

export default class StaminaManager extends Phaser.Events.EventEmitter {

    stamina: number;
    maxStamina: number;

    regenEnabled: boolean = true;

    staminaDrainRate = 0.58;   // per frame
    staminaRegenRate = 0.38;   // per frame

    regenDelay = 1600;
    lastStaminaUseTime = 0;

    minSprintStamina = 10;
    canSprint = true;

    scene: Phaser.Scene;

    constructor(stamina: number, maxStamina: number, regenRate: number, scene: Phaser.Scene) {
        super();

        this.stamina = stamina;
        this.maxStamina = maxStamina;

        this.scene = scene;
    }

    takeDamage(amount: number, time?: number) {
        this.stamina -= amount;
        this.stamina = Phaser.Math.Clamp(this.stamina, 0, this.maxStamina);

        this.lastStaminaUseTime = time ?? this.scene.time.now;

        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }

    heal(amount: number) {
        this.stamina += amount;
        this.stamina = Phaser.Math.Clamp(this.stamina, 0, this.maxStamina);

        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }

    healMax() {
        this.stamina = this.maxStamina;
        this.emit("StaminaChanged", this.stamina, this.maxStamina);
        this.emit("Healed");
    }

    // FRAME-BASED (fixed)
    sprint() {
        this.stamina -= this.staminaDrainRate;

        this.stamina = Phaser.Math.Clamp(this.stamina, 0, this.maxStamina);

        this.lastStaminaUseTime = this.scene.time.now;

        this.emit("Sprinting");
        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }

    // FRAME-BASED regen (fixed + unified delay)
    walk() {
        if (!this.regenEnabled) return;

        if (this.stamina >= this.maxStamina) return;

        if (this.scene.time.now - this.lastStaminaUseTime < this.regenDelay) {
            return;
        }

        this.stamina += this.staminaRegenRate;

        if (this.stamina >= this.maxStamina) {
            this.stamina = this.maxStamina;
            this.emit("Healed");
        } else {
            this.emit("Healing");
        }

        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }

    Update() {
        if (this.stamina <= 0) this.canSprint = false;
        if (this.stamina >= this.minSprintStamina) this.canSprint = true;

        this.walk();
    }
}
