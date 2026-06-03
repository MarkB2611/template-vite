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
        this.load.image("weapon_1_still", "assets/wallpurchases/weapons/L1A1SLR/still/L1A1SLRSingle.png");
        //AnimExplosion
        this.load.image("muzzle_flash_1", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame1.png");   
        this.load.image("muzzle_flash_2", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame2.png");    
        this.load.image("muzzle_flash_3", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame3.png");  
        this.load.image("muzzle_flash_4", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame4.png");     
        this.load.image("muzzle_flash_5", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame5.png");   
        this.load.image("muzzle_flash_6", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame6.png");   
        this.load.image("muzzle_flash_7", "assets/explosion pack 1/explosion pack 1/Explosions pack/explosion-1-g/Sprites/frame7.png");      
       
        
        this.load.image("endBackground", "assets/BlueRoseSonata Blood FX Pack/bloodslash_heavy.png");
     
        
      
        //animSLR
        this.load.image("weapon_1_1", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr1.png");
        this.load.image("weapon_1_2", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr2.png");
        this.load.image("weapon_1_3", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr3.png");
        this.load.image("weapon_1_4", "assets/wallpurchases/weapons/L1A1SLR/Anim/slr4.png");
        //browning wall buy
        this.load.image("weapon_0_still", "assets/wallpurchases/weapons/BrowningHiPower/still/BrowningHiPowerSingle.png");
        //AnimBrowning
        this.load.image("weapon_0_1", "assets/wallpurchases/weapons/BrowningHiPower/Anim/BrowningHiPowerAnim1.png");
        this.load.image("weapon_0_2", "assets/wallpurchases/weapons/BrowningHiPower/Anim/BrowningHiPowerAnim2.png");
        this.load.image("weapon_0_3", "assets/wallpurchases/weapons/BrowningHiPower/Anim/BrowningHiPowerAnim3.png");
        this.load.image("weapon_0_4", "assets/wallpurchases/weapons/BrowningHiPower/Anim/BrowningHiPowerAnim4.png");

        //sfx
        this.load.audio("sfx_wall_buy", "assets/sounds/game/mainloop/purchases/weapons/WallBuySfx.mp3");
        this.load.audio("sfx_weapon_swap", "assets/sounds/game/mainloop/weapons/Equipment-weapon-yoyosound.com.mp3");
        this.load.audio("sfx_equipment_equip", "assets/sounds/game/mainloop/equipment/Equipment-armor-yoyosound.com.mp3")
        this.load.audio("sfx_gunshot_laser_1", "assets/sounds/game/mainloop/weapons/SoundFX1(laser).mp3" );
        //freesounds needs to be in accredations
        this.load.audio("sfx_gun_reload", "assets/sounds/game/mainloop/weapons/sourced-Freesounds-reload.mp3");
        
        //400sounds from itch
        this.load.audio("sfx_muzzle_flash", "assets/sounds/400Sounds/Retro/explosion_quick.wav");
        

        //enemies/combat sound
        this.load.audio("sfx_zombie_punch_1", "assets/sounds/400Sounds/Combat and Gore/punch.wav");
        this.load.audio("sfx_player_take_damage_1", "assets/sounds/400Sounds/Combat and Gore/squelching_1.wav");
        this.load.audio("sfx_enemy_miss", "assets/sounds/400Sounds/Combat and Gore/swipe.wav");
        
        //sound
        this.load.audio('sfx_wave_start', 'assets/sounds/game/mainloop/roundSounds/SoundFX2(RoundStart).mp3');
        this.load.audio("sfx_wave_end", "assets/sounds/game/mainloop/roundSounds/SoundFX3(RoundEnd).mp3");
        //music
        this.load.audio("music_track_1_90bpm", "assets/sounds/music/Zombie90bpmFL1.mp3");
        this.load.audio("music_track_2_123bpm", "assets/sounds/music/Zombie123bpmFL2.mp3");

        //DATA/CSVS
        this.load.text("weaponsCSV", "assets/csvs/weapons/weapons_list.csv");
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
