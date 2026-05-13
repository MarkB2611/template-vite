import * as Phaser from "phaser";
import Bullet from "./projectiles/bullets/Bullet";


export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;

    //PlayerStats
    turnSpeed: any;
    targetAngle: any;

    //weapon stats(may want to separate after working)
    clipSize = 8;
    clipAmount = 8;
    reserveSize = 32;
    reserveMaxSize = 80;
    //would change to enum for burst, auto, single and adaptations on that in future(i.e scalability)
    autoFire = false;
    depletionAmount = 1;
    //reloads
    isReloading = false;
    reloadTime = 1500; // ms


    //maybes even an extra class for the bullet types.
    bulletSpeed = 500;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player"); // "player" = the texture key of the object.

        this.turnSpeed = 0.5;

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
        this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
    }
    

    update() {
        //functions tying to mechanics
        this.move();
        this.look();
        
        if(this.clipAmount < this.depletionAmount) {
            this.reload();
        }
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

        this.targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            pointer.worldX,
            pointer.worldY
        );

        // Smoothly rotate toward target
        this.rotation = Phaser.Math.Angle.RotateTo(
            this.rotation,
            this.targetAngle,
            this.turnSpeed   // 👈 smaller = slower turning
        );

    }

    
    reload() {
        if (this.isReloading) return;
        if (this.reserveSize < this.clipSize) return;

        this.isReloading = true;

        console.log("Reloading...");

        this.scene.time.delayedCall(this.reloadTime, () => {
            this.reserveSize += this.clipAmount;
            this.clipAmount = this.clipSize;

            this.reserveSize -= this.clipSize;
                        

            this.isReloading = false;

            console.log("Reload complete");
            this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
        });
        
    }


    shoot() {
        //if ther clipsize is both more than zero and more than the depletion amount then fire
        if(this.clipAmount > 0 && this.clipAmount >= this.depletionAmount) {
            new Bullet(this.scene, this.x, this.y, this.targetAngle);
            //reduces  clipsize by the depletion amount(burst would be 3)
            this.clipAmount -= this.depletionAmount;
        } else {
            
            this.reload();
        }
        this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
    }
}