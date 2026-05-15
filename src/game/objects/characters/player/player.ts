import * as Phaser from "phaser";
import Bullet from "./projectiles/bullets/Bullet";


export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;

    //PlayerStats
    turnSpeed: any;
    targetAngle: any;


    score: number = 500;

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

    //
    
    fireRate = 200;   // milliseconds between shots
    lastFired = 0;



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

        //scores
        this.scene.events.on('point_increase', (number: number) => {
            this.score += number;
        });
    }
    

    update(time: number) {
        //functions tying to mechanics
        this.move();
        this.look();
        
        if(this.clipAmount < this.depletionAmount) {
            this.reload();
        }
        

        const pointer = this.scene.input.activePointer;

        if (pointer.isDown) {
            this.shoot(time);
        }

        


    }

    //      --------------
    // -----  MOVING/LOOKING ------
    //     -----------------
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

    //      --------------
    // -----  GUNS/WEAPONS ------
    //     -----------------
    reload() {
        if (this.isReloading) return;
        if (this.reserveSize < this.clipSize) return;
        // Emit event - for sfx
        this.isReloading = true;

        console.log("Reloading...");

        //reload sound effect trigger
        this.scene.events.emit('playerReload');

        this.scene.time.delayedCall(this.reloadTime, () => {
            
            

            this.reserveSize += this.clipAmount;
            this.clipAmount = this.clipSize;

            this.reserveSize -= this.clipSize;

            
                        

            this.isReloading = false;

            console.log("Reload complete");
            this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
        });
        
    }


    
    
    shoot(time: number) {
        if (time < this.lastFired + this.fireRate) return;

        if (this.clipAmount > 0 && this.clipAmount >= this.depletionAmount) {

            this.lastFired = time; // ✅ set cooldown

            const bullet = new Bullet(this.scene, this.x, this.y, this.targetAngle);

            (this.scene as any).bullets.add(bullet);

            this.clipAmount -= this.depletionAmount;
            (this.scene as any).soundHandler.playSFX("sfx_gunshot_laser_1", 0.3, 2.3, 2400);
        }

        this.scene.events.emit('ammoChanged', this.clipAmount, this.reserveSize);
    }





}