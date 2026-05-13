
import { Scene } from 'phaser';
import Player from "../objects/characters/player/player";
import AmmoUI from "../objects/UI/Weapons/AmmoUI";
import LocationUI from "../objects/UI/Location/LocationUI";

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', 'assets/TopDownBackground.png');
        this.load.image("player", "assets/survivor1_gun.png");
        this.load.image("bullet", "assets/projectiles/9mmBulletHorizontalVertical.png");
    }


    //designed myself and refactored into classes using AI(copilot)
    create() {
        
        console.log("Loading Game");
        

        this.add.image(512, 384, 'background').setAlpha(0.5);

        // ✅ Player
        this.player = new Player(this, 400, 300);
        this.ammoUI = new AmmoUI(this, 800, 700);

        // ✅ UI (clean + separated)
        this.locationUI = new LocationUI(this, 150, 50, "groundZero");

        
        
        
       
        
        this.events.on('postupdate', () => {
            console.log("Frame OK");
        });

        

         // ✅ Shooting
        this.input.on('pointerdown', () => {
            this.player.shoot();
            //this.ammoUI.updateText(); // update only when needed
        });
    }

    update() {
        this.player.update();
    }
}
