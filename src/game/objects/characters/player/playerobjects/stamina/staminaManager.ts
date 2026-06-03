import * as Phaser from "phaser"

export default class StaminaManager extends Phaser.Events.EventEmitter {

    stamina: number;
    maxStamina: number;
    regenerationRate: number;

    //Stamina paerks
    regenEnabled: boolean = true;

    staminaDrainRate = 0.58;
    staminaRegenRate = 0.38;

    staminaRegenDelay = 1600;
    lastSprintTime = 0;

    minSprintStamina = 10;
    canSprint = true;
    
    //in place for when enemies damage stamina too
    private lastDamageTime = 0;
    private regenDelay = 2000
    scene: Phaser.Scene;

    constructor(stamina: number, maxStamina: number, regenRate: number, scene: Phaser.Scene) {
        super();

        this.stamina = stamina;
        this.maxStamina = maxStamina;
        this.regenerationRate = regenRate;

        this.scene = scene;
    }


    //Take damage function to  both subtract an amount of Stamina, clamp it to 0, and emit an event of the Stamina and maxStamina.
    //allows for both regen amounts enterred and base set amounts - maybe sadd enemies that do criticals? could be frustrating  but with a perk/traits system avoiding
    // crit and other types of damage could be a thing
    takeDamage(amount: number, time?: number) {
        this.stamina -= amount;
        this.stamina = Phaser.Math.Clamp(this.stamina, 0, this.maxStamina);

        if(time) {
            //to set off delay to regen.
            this.lastDamageTime = time;
        }

        

        // Emit event when Stamina changes
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
    }

    sprint() {
        this.stamina -= this.staminaDrainRate;
        if (this.stamina < 0) this.stamina = 0;
        this.lastSprintTime = this.scene.time.now;
        // Emit change
        this.emit("StaminaChanged", this.stamina, this.maxStamina);
        
    }

    walk() {
        // ✅ Regen (with delay if you added it)
        if (this.scene.time.now > this.lastSprintTime + this.staminaRegenDelay) {
            this.stamina += this.staminaRegenRate;
            if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
        }
        // Emit change
        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }
   
    Update(time: number, delta: number) {
        // ✅ LOCK SYSTEM
        if (this.stamina <= 0) {
            this.canSprint = false;
        }

        if (this.stamina >= this.minSprintStamina) {
            this.canSprint = true;
        }


        // Clamp
        this.stamina = Phaser.Math.Clamp(this.stamina, 0, this.maxStamina);

        // Emit change
        this.emit("StaminaChanged", this.stamina, this.maxStamina);
    }




}