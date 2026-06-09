
import { Scene } from 'phaser';
import * as Phaser from "phaser";
import SoundHandler from '../objects/handlers/sound/music/soundHandler';
import WaveHandler from '../objects/handlers/enemies/waveHandler';
import Player from "../objects/characters/player/player";
import Weapon from '../objects/characters/player/projectiles/weapons/Weapon';
import WeaponManager from '../objects/characters/player/projectiles/weapons/WeaponManager';
import WeaponPickupManager from '../objects/Buyables/Weapons/WeaponPickupManager';

import RoomHandler from '../objects/handlers/game/roomHandler';
import PerkPickupManager from '../objects/handlers/perks/perkPickupManager';
import DoorArrow from '../objects/handlers/game/doorArrow';


import BaseZombie from '../objects/handlers/enemies/baseEnemy';
import AmmoUI from "../objects/UI/Weapons/AmmoUI";
import ScoreNumberUI from '../objects/UI/Player/ScoreUI';
import { HealthBarUI } from '../objects/UI/Player/HealthBarUI';
import { StaminaBarUI } from '../objects/UI/Player/StaminaBarUI';
import LocationUI from "../objects/UI/Location/LocationUI";
import EnemiesRemainUI from '../objects/UI/Game/EnemiesRemainingUI';
import WaveNumberUI from '../objects/UI/Game/WaveNumberUI';
import WeaponPickup from '../objects/Buyables/Weapons/WeaponPickup';
import GunNameUI from '../objects/UI/Player/gunNameUI';
import GunDescriptionUI from '../objects/UI/Player/gunDescriptionUI';
import HealthManager from '../objects/characters/player/playerobjects/health/healthManager';
import GameOverScreenOverlay from '../objects/UI/Game/GameOverScreenOverlay';

export class Game extends Scene {
    



    constructor() {
        super('Game');
    }


    //designed myself and refactored into classes using AI(copilot)
    create() {
        
        this.add.image(512, 384, 'background').setAlpha(0.8).setScale(1.1);
        console.log("Loading Game");

        //player first for enemies, bullets reference
        this.player = new Player(this, 400, 300);

        //groups for physics/overlaps
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        
        //defined collisionS
        //ENEMIES WITH BULLETS
        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.onBulletHit,
            null,
            this
        );

        //ENEMIES WITH PLAYER
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.onPlayerHit,
            undefined,
            this
        );


        
 
        //sound handler(handles music and sound effects)
        this.soundHandler = new SoundHandler(this);
        this.soundHandler.startPlaylist();

        

        this.weaponPickups = new WeaponPickupManager(this);
        this.perkManager = new PerkPickupManager(this);
        this.waveHandler = new WaveHandler(this, this.enemies);
        this.waveHandler.SpawnEnemies();

        // ✅ Room system (THIS now controls spawning)
        this.roomHandler = new RoomHandler(
            this,
            this.weaponPickups,
            this.perkManager,
            this.waveHandler
        );

                


        
        // UI AT THIS POINT
        this.gunNameUI = new GunNameUI(this, 980, 620, "Dusty Revolver")
        this.gunDescUI = new GunDescriptionUI(this, 980, 650, "Cruddy Old Revolver, Not very good\nbut its something.");
        this.ammoUI = new AmmoUI(this, 940, 700);
        this.score = new ScoreNumberUI(this, 930, 170, this.player.score);
        

        this.healthBarUI = new HealthBarUI(this, 800, 732, this.player.healthManager, 200, 20);
        this.staminaBarUI = new StaminaBarUI(this, 25, 732, this.player.staminaManager, 300, 20);
        


        // ✅ UI (clean + separated)
        this.locationUI = new LocationUI(this, 150, 50, "groundZero");

        this.enemyRemainingUI = new EnemiesRemainUI(this, 880, 50, this.waveHandler.NumOfEnemiesRemain,  this.waveHandler.MaxEnemies);
        this.waveNumberUI = new WaveNumberUI(this, 880, 115, this.waveHandler.WaveNumber);
        
        /*
        this.events.on('postupdate', () => {
            console.log("Frame OK");
           
        });*/
        //weapon swaps
        this.events.on("weaponSwitched", (index, weapon) => {
           this.gunNameUI.setText(weapon.name); 
           this.gunDescUI.setText(weapon.description);
        });
       
        //reloading
        this.events.on('playerReload', () => {
            this.soundHandler.playSFX("sfx_gun_reload", 0.5 );
        });
        //score handling
        this.events.on('point_increase', (number) => {
            this.score.setScore(this.player.score);
        });
        this.events.on('point_decrease', (value) => {
            this.score.setScore(this.player.score);
            console.log("Points decreased by " , value);
        });
        
        //created this new method of playing sfx to reduce complexity - emit an event and then provide the key of the sound effect.
        this.events.on("playSound", (soundEffectKey, volume, rate, detune) => {
            this.soundHandler.playSFX(soundEffectKey, volume, rate, detune);
        });

        this.events.on("game_over", ()=> {
            this.player.die();
            this.gameOverScreen = new GameOverScreenOverlay(this, this.player.score, this.player.kills, this.player.deaths, this.waveHandler.WaveNumber);
            this.gameOverScreen.setVisible(true);
        });

        this.events.on(("door_selected"), (choiceID)=> {
            this.movePlayerToRoom(choiceID);
            this.roomHandler.arrowHandler.clearArrows();
        });
        
        

        //initialises first round.
        this.soundHandler.playSFX("sfx_wave_start", 0.4, 1.4);
        console.log("wave 1 started");

        
        this.roomArrow = new DoorArrow(this, 400, 400, 1);
        this.roomArrow.makeVisible();
        this.roomArrow.playBuyDoorAnim();
        
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.waveHandler.update();
        this.weaponPickups.update(this.player);
        this.roomHandler.update(this.player);
        // () => passes as a function
        // or this.onBuy.bind(this)

        // ✅ Room progression trigger
        if (this.waveHandler.NumOfEnemiesRemain <= 0) {
            this.roomHandler.advanceRoom(this.weaponPickups, this.perkManager, this.waveHandler);
            this.advanceRoom();

        }


        if(this.gameOverScreen) {
            this.gameOverScreen.update();
        }
        
    }


    advanceRoom(choiceID) {

        console.log("Advancing room via door:", choiceID);

        // ✅ Tell RoomHandler which door was chosen
        this.roomHandler.selectDoor(choiceID);

        // ✅ Move player BEFORE generating new room
        this.movePlayerToRoom(choiceID);

        // ✅ Generate room based on that choice
        this.roomHandler.advanceRoom(
            this.weaponPickups,
            this.perkManager,
            this.waveHandler
        );

        this.soundHandler.playSFX("sfx_wave_start", 0.4, 1.2);
    }


    
    movePlayerToRoom(choiceID) {

        const centerX = 512;
        const centerY = 384;
        const offset = 250;

        const directions = [
            { x: 0, y: -offset },           // 0 up
            { x: offset, y: -offset },      // 1 up-right
            { x: offset, y: 0 },            // 2 right
            { x: offset, y: offset },       // 3 down-right
            { x: 0, y: offset },            // 4 down
            { x: -offset, y: offset },      // 5 down-left
            { x: -offset, y: 0 },           // 6 left
            { x: -offset, y: -offset },     // 7 up-left
        ];

        // ✅ Get opposite direction
        const oppositeID = (choiceID + 4) % 8;
        const dir = directions[oppositeID];

        this.player.setPosition(
            centerX + dir.x,
            centerY + dir.y
        );

        console.log("Spawned using opposite direction:", oppositeID);
    }




    onBulletHit(bullet, enemy) {
        console.log("HIT!");
        this.events.emit("point_increase", 10);
        console.log(this.player.score);
        //enemy.takeDamage(this.player.currentWeapon.damage);
        bullet.onHitEnemy(enemy);
    }

   
    onPlayerHit(player, zombie) {
        const now = this.time.now;

        if (!zombie.canAttack(now) || zombie.isAttacking) return;

        zombie.registerAttack(now);
        zombie.isAttacking = true;

        // ✅ Start attack wind-up
        this.time.delayedCall(zombie.attackWindup, () => {

            if (!zombie.active) return;

            // ✅ Check distance at moment of swing
            const distance = Phaser.Math.Distance.Between(
                zombie.x,
                zombie.y,
                player.x,
                player.y
            );

            if (distance <= zombie.attackRange) {
                // ✅ HIT
                player.takeDamage(10, now);
                this.events.emit("playSound", "sfx_zombie_punch_1", 0.8);
            } else {
                // ❌ MISS (player dodged)
                this.events.emit("playSound", "sfx_enemy_miss", 1.8, 1.0);
            }

            zombie.isAttacking = false;

        });
    }


}
