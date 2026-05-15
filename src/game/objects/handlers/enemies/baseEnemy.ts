import * as Phaser from "phaser";

export default class BaseZombie extends Phaser.Physics.Arcade.Sprite {
    
    //Stats
    turnSpeed: any;
    targetAngle: any;
    health: number = 20;

    
   


    constructor(scene: Phaser.Scene, x: number, y: number, zombieIndex: number) {
        super(scene, x, y, "base_zombie"); // "base_zombie" = the texture key of the object.

        this.turnSpeed = 0.5;

        console.log("Zombie Spawned" + zombieIndex);
        //add to scene and add physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        
        
        

        //basic settings
        this.setCollideWorldBounds(false);
    }
    

    update() {
        //functions tying to mechanics
        this.move();
        this.look();
        
       
    }

    //      --------------
    // -----  MOVING/LOOKING ------
    //     -----------------
    //moving function
    move() {
        const speed = 200;
        

        // LEFT
            //this.setVelocityX(-speed);
        
        // RIGHT
            //this.setVelocityX(speed);
        

        // UP
            //this.setVelocityY(-speed);
        
        // DOWN
            //this.setVelocityY(speed);
        
    }

    //looking/aiming function
    lookToPoint() {
        
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

    
    look() {
        if (!this.scene) return;              // scene gone
        if (!this.active) return;             // enemy destroyed/inactive

        const player = (this.scene as any).player;
        if (!player || !player.active) return;

        this.targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        this.rotation = Phaser.Math.Angle.RotateTo(
            this.rotation,
            this.targetAngle,
            this.turnSpeed
        );
    }


    takeDamage(amount: number) {
        this.health -= amount;
        

        if(this.health < 0) {
            //adds 100 points to the point total
            this.scene.events.emit("point_increase", 100); 
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
    



}