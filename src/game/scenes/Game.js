import { Scene } from 'phaser';
import Player from "../objects/characters/player/player";

export class Game extends Scene
{


    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        //new comment to try fork
        this.load.image('background', 'assets/bg.png');
        this.load.image("player", "assets/survivor1_gun.png")
    }

    create ()
    {
        console.log("Loading Game");
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);


        this.player = new Player(this, 400,  300);




        this.input.once('pointerdown', () => {

            //this.scene.start('GameOver');

        });
    }

    update() {
        this.player.update();
    }
}
