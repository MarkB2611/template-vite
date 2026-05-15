
import { Scene } from 'phaser';
import SoundHandler from '../objects/handlers/sound/music/soundHandler';
import WaveHandler from '../objects/handlers/enemies/waveHandler';
import Player from "../objects/characters/player/player";
import BaseZombie from '../objects/handlers/enemies/baseEnemy';
import AmmoUI from "../objects/UI/Weapons/AmmoUI";
import ScoreNumberUI from '../objects/UI/Player/ScoreUI';
import LocationUI from "../objects/UI/Location/LocationUI";
import EnemiesRemainUI from '../objects/UI/Game/EnemiesRemainingUI';
import WaveNumberUI from '../objects/UI/Game/WaveNumberUI';

export class Game extends Scene {
    



    constructor() {
        super('Game');
    }

    preload() {
       //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        //new comment to try for
        this.load.image('background', 'assets/TopDownBackground.png');
        this.load.image("player", "assets/survivor1_gun.png");
        this.load.image("bullet", "assets/projectiles/9mmBulletHorizontalVertical.png");

        //npcs
        //enemies
        this.load.image("base_zombie", "assets/npcs/enemies/zombie1_hold.png");
    
        
        //sound
        this.load.audio('sfx_wave_start', 'assets/sounds/game/mainloop/roundSounds/SoundFX2(RoundStart).mp3');
        this.load.audio("sfx_wave_end", "assets/sounds/game/mainloop/roundSounds/SoundFX3(RoundEnd).mp3");
        this.load.audio("sfx_gunshot_laser_1", "assets/sounds/game/mainloop/weapons/SoundFX1(laser).mp3" );
        this.load.audio("sfx_gun_reload", "assets/sounds/game/mainloop/weapons/sourced-Freesounds-reload.mp3")

        //music
        this.load.audio("music_track_1_90bpm", "assets/sounds/music/Zombie90bpmFL1.mp3");
        this.load.audio("music_track_2_123bpm", "assets/sounds/music/Zombie123bpmFL2.mp3");
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
            this.soundHandler.playSFX("sfx_gun_reload", 0.8 );
        });


        

        this.soundHandler.playSFX("sfx_wave_start", 0.6, 1.4);
        console.log("wave 1 started");

        //test enemy for points no movement or update
        const enemy = new BaseZombie(this, 700, 600 , -1);
        // ✅ add to Phaser physics group
        this.enemies.add(enemy);
        this.waveHandler.enemies.push(enemy);
    }

    update(time) {
        this.player.update(time);
        this.waveHandler.update();
    }

    
    onBulletHit(bullet, enemy) {
        console.log("HIT!");
        this.events.emit("point_increase", 10);
        console.log(this.player.score);
        enemy.takeDamage(8);
        bullet.destroy();
    }

}
