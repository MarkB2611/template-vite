
import { Scene } from 'phaser';
import SoundHandler from '../objects/handlers/sound/music/soundHandler';
import WaveHandler from '../objects/handlers/enemies/waveHandler';
import Player from "../objects/characters/player/player";
import Weapon from '../objects/characters/player/projectiles/weapons/Weapon';
import WeaponManager from '../objects/characters/player/projectiles/weapons/WeaponManager';
import WeaponPickupManager from '../objects/Buyables/Weapons/WeaponPickupManager';


import BaseZombie from '../objects/handlers/enemies/baseEnemy';
import AmmoUI from "../objects/UI/Weapons/AmmoUI";
import ScoreNumberUI from '../objects/UI/Player/ScoreUI';
import { HealthBarUI } from '../objects/UI/Player/HealthBarUI';
import LocationUI from "../objects/UI/Location/LocationUI";
import EnemiesRemainUI from '../objects/UI/Game/EnemiesRemainingUI';
import WaveNumberUI from '../objects/UI/Game/WaveNumberUI';
import WeaponPickup from '../objects/Buyables/Weapons/WeaponPickup';
import GunNameUI from '../objects/UI/Player/gunNameUI';
import GunDescriptionUI from '../objects/UI/Player/gunDescriptionUI';

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

        this.add.image(512, 384, 'background').setAlpha(0.8);

        
        // ✅ Player
        this.player = new Player(this, 400, 300);
        this.gunNameUI = new GunNameUI(this, 940, 620, "Dusty Revolver")
        this.gunDescUI = new GunDescriptionUI(this, 860, 680, "Cruddy Old Revolver, Not Very good\n beggars cant be choosers \n and you can be a chooser my friend.");
        this.ammoUI = new AmmoUI(this, 940, 700);
        this.score = new ScoreNumberUI(this, 950, 580, this.player.score);
        this.events.on('point_increase', (number) => {
            this.score.setScore(this.player.score);
        });

        this.healthBarUI = new HealthBarUI(this, 800, 732, 200, 20, 100);

        this.weaponPickups = new WeaponPickupManager(this);
        


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
        
        //created this new method of playing sfx to reduce complexity - emit an event and then provide the key of the sound effect.
        this.events.on("playSound", (soundEffectKey, volume, rate, detune) => {
            this.soundHandler.playSFX(soundEffectKey, volume, rate, detune);
        });

        


        //initialises first round.
        this.soundHandler.playSFX("sfx_wave_start", 0.4, 1.4);
        console.log("wave 1 started");

        
    }

    update(time) {
        this.player.update(time);
        this.waveHandler.update();
        this.weaponPickups.update(this.player);
        // () => passes as a function
        // or this.onBuy.bind(this)
        
    }


    onBulletHit(bullet, enemy) {
        console.log("HIT!");
        this.events.emit("point_increase", 10);
        console.log(this.player.score);
        //enemy.takeDamage(this.player.currentWeapon.damage);
        bullet.onHitEnemy(enemy);
    }

}
