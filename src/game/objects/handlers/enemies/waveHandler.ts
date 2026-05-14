import * as Phaser from "phaser"

//meant to handle enemy spawns and the beginning and ending condition of the wave
export default class WaveHandler  {
    //default is wave 1 and 8 enemies
    WaveNumber: number = 1;
    NumOfEnemiesRemain: number = 8;
    //can get the burst of enemies amount here(also could start with enemies only appearing after the previous burst disappearing#
    // then gradually make it so that I can add the next burst when a few enemies are kept)
    EnemiesKilled: number = 0;

    //Range of 2 number to use rtandom in, it will be changed based upon difficulty potentially,
    // initially it will be solely based upon wave number.
    MaxEnemies: number = 8;
    MinEnemies: number = 8;

    constructor(scene: Phaser.Scene) {
        
    }

    DefineTotalQuantityOfEnemies() {
        //gets the total number
         //wave number multiplied by rounded whole number inbetween max and min enemy numbers for range
        const quantityOfEnemies = this.WaveNumber * (Math.floor(Math.random() * (this.MaxEnemies - this.MinEnemies)) + this.MinEnemies);
        this.NumOfEnemiesRemain = quantityOfEnemies;
        
        console.log("Wave: " + this.WaveNumber + ", NumOfenemiesThisWave: " + quantityOfEnemies);
    }

    SpawnEnemies() {
        this.DefineTotalQuantityOfEnemies();
        console.log("Wave(instance): " + this.WaveNumber + ", NumOfenemiesThisWave: " + this.NumOfEnemiesRemain);
    }
}
