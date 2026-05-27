
import { Scene } from 'phaser';
import SoundHandler from '../objects/handlers/sound/music/soundHandler';
import WaveHandler from '../objects/handlers/enemies/waveHandler';
import Player from "../objects/characters/player/player";
import Weapon from '../objects/characters/player/projectiles/weapons/Weapon';
import WeaponManager from '../objects/characters/player/projectiles/weapons/WeaponManager';


import BaseZombie from '../objects/handlers/enemies/baseEnemy';
import AmmoUI from "../objects/UI/Weapons/AmmoUI";
import ScoreNumberUI from '../objects/UI/Player/ScoreUI';
import LocationUI from "../objects/UI/Location/LocationUI";
import EnemiesRemainUI from '../objects/UI/Game/EnemiesRemainingUI';
import WaveNumberUI from '../objects/UI/Game/WaveNumberUI';
import WeaponPickup from '../objects/Buyables/Weapons/WeaponPickup';

export class Game extends Scene {
    



    constructor() {
        super('Game');
    }


    //designed myself and refactored into classes using AI(copilot)
    create() {
        
        console.log("Loading Game");

        //groups
        
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        
        //defined collision
        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.onBulletHit,
            null,
            this
        );
        
 
        //sound handler(handles music and sound effects)
        this.soundHandler = new SoundHandler(this);
        this.soundHandler.startPlaylist();

        this.waveHandler = new WaveHandler(this);
        this.waveHandler.SpawnEnemies();

        this.add.image(512, 384, 'background').setAlpha(0.5);

        //objects(wall buys)
        this.slrWallBuy = new WeaponPickup(this, 120, 240, 1);

        // ✅ Player
        this.player = new Player(this, 400, 300);
        this.ammoUI = new AmmoUI(this, 920, 700);
        this.score = new ScoreNumberUI(this, 940, 630, this.player.score);
        this.events.on('point_increase', (number) => {
            this.score.setScore(this.player.score);
        });



        


        // ✅ UI (clean + separated)
        this.locationUI = new LocationUI(this, 150, 50, "groundZero");

        this.enemyRemainingUI = new EnemiesRemainUI(this, 880, 50, this.waveHandler.NumOfEnemiesRemain,  this.waveHandler.MaxEnemies);
        this.waveNumberUI = new WaveNumberUI(this, 880, 115, this.waveHandler.WaveNumber);
        
        /*
        this.events.on('postupdate', () => {
            console.log("Frame OK");
           
        });*/

       
        //reloading
        this.events.on('playerReload', () => {
            this.soundHandler.playSFX("sfx_gun_reload", 0.5 );
        });
        //score handling
        this.events.on('point_decrease', (value) => {
            this.score.setScore(this.player.score);
            console.log("Points decreased by " , value);
        });
       

        


        //initialises first round.
        this.soundHandler.playSFX("sfx_wave_start", 0.4, 1.4);
        console.log("wave 1 started");

        
    }

    update(time) {
        this.player.update(time);
        this.waveHandler.update();
        // () => passes as a function
        // or this.onBuy.bind(this)
        this.slrWallBuy.update(this.player);
    }

    //adds weapon by ID 
    onBuy() {
        
        const success = this.player.weaponManager.addWeaponById(1);

        if (!success) {
            this.player.weaponManager.replaceWeapon(
                this.player.weaponManager.currentSlot,
                1
            );
            console.log("Error: Weapon Manager Failed to add weapon by ID")
        } else {
        }

        this.events.emit("ammoChanged", this.player.weaponManager.currentWeapon.clipAmount, this.player.weaponManager.currentWeapon.reserveSize);
        this.player.score -= this.slrWallBuy.cost;
        this.score.setScore(this.player.score);

        console.log(this.player.weaponManager.getWeapons());
        this.soundHandler.playSFX("sfx_wall_buy", 0.7, 3.0, 1800);

        
    }

    onBulletHit(bullet, enemy) {
        console.log("HIT!");
        this.events.emit("point_increase", 10);
        console.log(this.player.score);
        //enemy.takeDamage(this.player.currentWeapon.damage);
        bullet.onHitEnemy(enemy);
    }

}
