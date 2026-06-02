import * as Phaser from "phaser"

export default class HealthManager extends Phaser.Events.EventEmitter {

    health: number;
    maxHealth: number;
    regenerationRate: number;

    constructor(health: number, maxHealth: number, regenRate: number) {
        super();

        this.health = health;
        this.maxHealth = maxHealth;
        this.regenerationRate = regenRate;
    }


    //Take damage function to  both subtract an amount of health, clamp it to 0, and emit an event of the health and maxHealth.
    takeDamage(amount: number) {
        this.health -= amount;
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

        // Emit event when health changes
        this.emit("healthChanged", this.health, this.maxHealth);

        if (this.health <= 0) {
            this.emit("dead");
        }
    }


    heal(amount: number) {
        this.health += amount;
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

        this.emit("healthChanged", this.health, this.maxHealth);
    }



}