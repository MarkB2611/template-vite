import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        //new comment to try for
        this.load.image('background', 'assets/TopDownBackground.png');
        this.load.image("player", "assets/survivor1_gun.png");
        this.load.image("bullet", "assets/projectiles/9mmBulletHorizontalVertical.png");
        this.load.image("crosshair", "assets/crosshair/Crosshair1.png");


        //npcs
        //enemies
        this.load.image("base_zombie", "assets/npcs/enemies/zombie1_hold.png");
    
        //objects
        //slrWallBuy
        this.load.image("weapon_pickup_slr", "assets/wallpurchases/weapons/L1A1SLR/still/L1A1SLRSingle.png");
        //animSLR
        this.load.image("slr1", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr1.png");
        this.load.image("slr2", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr2.png");
        this.load.image("slr3", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr3.png");
        this.load.image("slr4", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr4.png");
        this.load.audio("sfx_wall_buy", "public/assets/sounds/game/mainloop/purchases/weapons/WallBuySfx.mp3");



        //sound
        this.load.audio('sfx_wave_start', 'assets/sounds/game/mainloop/roundSounds/SoundFX2(RoundStart).mp3');
        this.load.audio("sfx_wave_end", "assets/sounds/game/mainloop/roundSounds/SoundFX3(RoundEnd).mp3");
        this.load.audio("sfx_gunshot_laser_1", "assets/sounds/game/mainloop/weapons/SoundFX1(laser).mp3" );
        this.load.audio("sfx_gun_reload", "assets/sounds/game/mainloop/weapons/sourced-Freesounds-reload.mp3")

        //music
        this.load.audio("music_track_1_90bpm", "assets/sounds/music/Zombie90bpmFL1.mp3");
        this.load.audio("music_track_2_123bpm", "assets/sounds/music/Zombie123bpmFL2.mp3");
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
