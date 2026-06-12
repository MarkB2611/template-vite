import * as Phaser from "phaser"

export default class HealthManager extends Phaser.Events.EventEmitter {

    health: number;
    maxHealth: number;
    regenerationRate: number;

    //health paerks
    regenEnabled: boolean = true;

    
    private lastDamageTime = 0;
    private regenDelay = 2000
    scene: Phaser.Scene;

    constructor(health: number, maxHealth: number, regenRate: number, scene: Phaser.Scene) {
        super();

        this.health = health;
        this.maxHealth = maxHealth;
        this.regenerationRate = regenRate;

        this.scene = scene;
    }


    //Take damage function to  both subtract an amount of health, clamp it to 0, and emit an event of the health and maxHealth.
    //allows for both regen amounts enterred and base set amounts - maybe sadd enemies that do criticals? could be frustrating  but with a perk/traits system avoiding
    // crit and other types of damage could be a thing
    takeDamage(amount: number, time?: number) {
        this.health -= amount;
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

        if(time) {
            //to set off delay to regen.
            this.lastDamageTime = time;
        }

        

        // Emit event when health changes
        this.emit("healthChanged", this.health, this.maxHealth);
        this.emit("healthDamaged");

        if (this.health <= 0) {
            this.scene.events.emit("dead");
        }
    }


    heal(amount: number) {
        this.health += amount;
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

        if(this.health === this.maxHealth) {
            this.emit("healthHealed");
        } else {
            this.emit("healthHealing");
        }
        this.emit("healthChanged", this.health, this.maxHealth);
   
    }

    healMax() {
        this.health = this.maxHealth;
        this.emit("healthChanged", this.health, this.maxHealth);
        this.emit("healthHealed");
    }

   
    Update(time: number, delta: number) {
        //if i want to make regen based upon an item, perk etc - can add this here
        if(!this.regenEnabled){ return; }
        if (this.health <= 0 || this.health >= this.maxHealth) {
            return; // no regen if dead or full
        }

        //regen delay active vs not
        const now = time;
        if (now - this.lastDamageTime < this.regenDelay) {
            return; // still waiting before regen starts
        }


        // regen per second → convert delta (ms) to seconds
        const regenAmount = this.regenerationRate * (delta / 1000);

        this.health += regenAmount;

        // Clamp
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

        // Emit change
        this.emit("healthChanged", this.health, this.maxHealth);
        if(this.health === this.maxHealth) {
            this.emit("healthHealed");
        }
    }




} 