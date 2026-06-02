import * as Phaser from "phaser";
import Player from "../../characters/player/player";

export default class BaseZombie extends Phaser.Physics.Arcade.Sprite {
    
    //Stats
    turnSpeed: any;
    targetAngle: any;
    health: number = 20;
    speed: number = 110;
    
    stopRadius: number;

    zombieIndex: number;

    //lastAttackTime
    lastAttackTime: number = 0;
    attackCooldown: number = 3000; // 3 seconds
    isAttacking: boolean = false;
    attackWindup: number = 250;
    attackRange: number = 20;



    
   


   
    constructor(scene: Phaser.Scene, x: number, y: number, zombieI: number, enemyHealth?: number, enemySpeed?: number) {
        super(scene, x, y, "base_zombie");

        this.turnSpeed = 0.5;
        this.zombieIndex = zombieI;

        // ✅ random stop distance
        this.stopRadius = Phaser.Math.Between(9, 29);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        if(enemyHealth) {
            this.health = enemyHealth;
        }
        if(enemySpeed) {
            this.speed = enemySpeed;
        }
       
    }

    

    update() {
        //guard the update for destory condition
        if (!this.active) return;
        //functions tying to #
        this.look();
        this.move();
        
        
       
    }

    //      --------------
    // -----  MOVING/LOOKING ------
    //     -----------------
    //moving function
    
   
    move() {
        if (!this.active || !this.body) return;

        const player = (this.scene as any).player;
        if (!player || !player.active) return;

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        

        // ✅ Stop when inside your personal radius
        if (distance <= this.stopRadius) {
            this.setVelocity(0, 0);
            return;
        }

        // ✅ Move toward facing direction
        this.setVelocity(
            Math.cos(this.rotation) * this.speed,
            Math.sin(this.rotation) * this.speed
        );
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
            this.scene.events.emit("enemy_dead");
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

    //ties into player/enemy physics group overlap
    canAttack(now: number): boolean {
        return now - this.lastAttackTime >= this.attackCooldown;
    }
    
    registerAttack(now: number) {
        this.lastAttackTime = now;
    }





}