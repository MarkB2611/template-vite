import * as Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;
    

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player"); // "player" = the texture key of the object.

        console.log("Initializing...");
        //add to scene and add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //controls
        if(scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
        } else {
            console.error("Keyboard input not gathered");
        }

        
        this.wasd = scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });


        //basic settings
        this.setCollideWorldBounds(true);
    }
    

    update() {
        //functions tying to mechanics
        this.move();
        this.look();
        
    }

    //moving function
    move() {
        const speed = 200;
        this.setVelocity(0);

        // LEFT
        if (this.cursors.left?.isDown || this.wasd.left.isDown) {
            this.setVelocityX(-speed);
        }
        // RIGHT
        else if (this.cursors.right?.isDown || this.wasd.right.isDown) {
            this.setVelocityX(speed);
        }

        // UP
        if (this.cursors.up?.isDown || this.wasd.up.isDown) {
            this.setVelocityY(-speed);
        }
        // DOWN
        else if (this.cursors.down?.isDown || this.wasd.down.isDown) {
            this.setVelocityY(speed);
        }
    }

    //looking/aiming function
    look() {
        
        const pointer = this.scene.input.activePointer;

        const targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            pointer.worldX,
            pointer.worldY
        );

        // Smoothly rotate toward target
        this.rotation = Phaser.Math.Angle.RotateTo(
            this.rotation,
            targetAngle,
            0.5   // 👈 smaller = slower turning
        );

    }
}