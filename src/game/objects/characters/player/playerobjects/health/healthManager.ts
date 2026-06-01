import * as Phaser from "phaser"

export default class HealthManager {

    health: number;
    maxHealth: number;
    regenerationRate: number;

    constructor(health: number, maxHealth: number, regenRate: number) {
        this.health = health;
        this.maxHealth = health;
        this.regenerationRate = regenRate;
    }


}