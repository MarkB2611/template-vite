import * as Phaser from "phaser"
import BaseZombie from "./baseEnemy";

//meant to handle enemy spawns and the beginning and ending condition of the wave
export default class WaveHandler  {
    //default is wave 1 and 8 enemies
    WaveNumber: number = 1;
    NumOfEnemiesRemain: number = 8;
    MaxEnemiesThisWave: number = 8;
    //can get the burst of enemies amount here(also could start with enemies only appearing after the previous burst disappearing#
    // then gradually make it so that I can add the next burst when a few enemies are kept)
    EnemiesKilled: number = 0;

    //Range of 2 number to use rtandom in, it will be changed based upon difficulty potentially,
    // initially it will be solely based upon wave number.
    MaxEnemies: number = 8;
    MinEnemies: number = 8;
    scene: Phaser.Scene;
    //enemiesList
    enemies: BaseZombie[] = [];

    enemySpeed: number = 120;
    enemyHealth: number = 20;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.scene.events.on("enemy_dead", this.onEnemyDead, this);
    }
        
    
    
    onEnemyDead(enemy: BaseZombie) {
        this.enemies = this.enemies.filter(e => e !== enemy);

        // ✅ Always correct count
        this.NumOfEnemiesRemain--;

        // ✅ Update UI directly (no event needed)
        (this.scene as any).enemyRemainingUI.setAmount(
            this.NumOfEnemiesRemain,
            this.MaxEnemies
        );

        this.EnemiesKilled++;
    
        if(this.NumOfEnemiesRemain <= 0) {
            this.NextWave();
        }
    }

    NextWave() {
        this.WaveNumber++;
        this.scene.events.emit("next_wave", this.WaveNumber);

        
        this.DefineTotalQuantityOfEnemies();
        this.SpawnEnemies();
        // ✅ Update UI directly (no event needed)
        (this.scene as any).enemyRemainingUI.setAmount(
            this.NumOfEnemiesRemain,
            this.MaxEnemies
        );
    }

    DefineTotalQuantityOfEnemies() {
                
        // Scale difficulty with wave number
        const scaledMin = Math.floor(this.MinEnemies + this.WaveNumber * 0.5);
        const scaledMax = Math.floor(this.MaxEnemies + this.WaveNumber * 0.5);

        // Get total enemies for this wave
        const quantityOfEnemies = Math.floor(
        Math.random() * (scaledMax - scaledMin + 1)
        ) + scaledMin;

        // Assign values
        this.NumOfEnemiesRemain = quantityOfEnemies;
        this.MaxEnemies = quantityOfEnemies;
        this.MaxEnemiesThisWave = quantityOfEnemies; // for UI

        
        
        console.log("Wave: " + this.WaveNumber + ", NumOfenemiesThisWave: " + quantityOfEnemies);
    }

    SpawnEnemies() {
        this.DefineTotalQuantityOfEnemies();
        console.log("Wave(instance): " + this.WaveNumber + ", NumOfenemiesThisWave: " + this.NumOfEnemiesRemain);

        
        for (let i = 0; i < this.NumOfEnemiesRemain; i++) {

            // Generate bounds
            const randXUpper = (Math.random() * 1000) + (Math.random() * 2100 - 1000) + 1000;
            const randXLower = (Math.random() * 1000) - (Math.random() * 2100 + 1000) - 1000;
            const randYUpper = (Math.random() * 1000) + (Math.random() * 2100 - 1000) + 1000;
            const randYLower = (Math.random() * 1000) - (Math.random() * 2100 + 1000) - 1000;

            // ✅ Normalize (prevents broken ranges)
            const minX = Math.min(randXLower, randXUpper);
            const maxX = Math.max(randXLower, randXUpper);
            const minY = Math.min(randYLower, randYUpper);
            const maxY = Math.max(randYLower, randYUpper);

            // ✅ Pick random point within range
            const x = Math.random() * (maxX - minX) + minX;
            const y = Math.random() * (maxY - minY) + minY;

            console.log(`coordinates of zombie: ${x}, ${y}`);

            const enemy = new BaseZombie(this.scene, x, y, i, this.enemyHealth, this.enemySpeed);
            //basic scaling for health and speed of enemies(limited for balancing against the player, wave amounts arent capped)
            if(this.enemySpeed < 140){
                this.enemySpeed = Math.random() * (this.WaveNumber * 1.02) + enemy.speed;
            }
            if( this.enemyHealth < 250 ) {
                this.enemyHealth = Math.random() * (this.WaveNumber * 1.01) + enemy.health;
            }
            this.enemies.push(enemy);
            
            // ✅ add to Phaser physics group
            (this.scene as any).enemies.add(enemy);

        }

    }

    update() {
        
        this.enemies.forEach((enemy) => {
            if(enemy != undefined) {
                enemy.update(); // or whatever method you need
            }
        });

        

    }
}
