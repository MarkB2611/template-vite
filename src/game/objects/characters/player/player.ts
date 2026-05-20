import * as Phaser from "phaser";
import Bullet from "./projectiles/bullets/Bullet";
import Weapon from "./projectiles/weapons/Weapon";


export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;

    //PlayerStats
    turnSpeed: any;
    targetAngle: any;


    score: number = 500;

    //weapons
    currentWeapon!: Weapon;
    weapon1!: Weapon;
    weapon2?: Weapon;


    //crosshairStats
    crosshair!: Phaser.GameObjects.Image;
    crosshairRadius = 250;
    
    //Sprint Data
    baseSpeed = 200;
    sprintMultiplier = 1.8;

    maxStamina = 100;
    stamina = 100;

    staminaDrainRate = 0.58;
    staminaRegenRate = 0.38;

    staminaRegenDelay = 1600;
    lastSprintTime = 0;

    minSprintStamina = 10;
    canSprint = true;

    isSprinting = false;
    shiftKey!: Phaser.Input.Keyboard.Key;
    reloadKey!: Phaser.Input.Keyboard.Key;








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


                
        this.weapon1 = new Weapon(scene, {
            clipSize: 8,
            reserveSize: 80,
            reserveMaxSize: 80,
            fireRate: 200,
            reloadTime: 1500,
            damage: 15,
            bulletSpeed: 500,
            depletionAmount: 1
        });
        this.currentWeapon = this.weapon1;


        //basic settings
        this.setCollideWorldBounds(true);
        this.scene.events.emit('ammoChanged', this.currentWeapon.clipAmount, this.currentWeapon.reserveSize);

        
        this.crosshair = scene.add.image(x, y, "crosshair");
        this.crosshair.setDepth(10);
        this.crosshair.setAlpha(0.7);

        
        //scores
        this.scene.events.on('point_increase', (number: number) => {
            this.score += number;
        });

        
        this.shiftKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );
        this.reloadKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );

    }

    
        
    updateCrosshair() {
        const pointer = this.scene.input.activePointer;

        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            pointer.worldX,
            pointer.worldY
        );

        let targetX = pointer.worldX;
        let targetY = pointer.worldY;

        if (dist > this.crosshairRadius) {
            targetX = this.x + Math.cos(this.targetAngle) * this.crosshairRadius;
            targetY = this.y + Math.sin(this.targetAngle) * this.crosshairRadius;
        }

        this.crosshair.setPosition(targetX, targetY);

        // Optional rotation
        this.crosshair.rotation = this.targetAngle;
    }


    

    update(time: number) {
        //functions tying to mechanics
        this.move();
        this.look();
        this.updateCrosshair();
        
        //changed weapons to be a separate class, also added reload button.
        const pointer = this.scene.input.activePointer;
        if(this.currentWeapon.clipAmount < this.currentWeapon.depletionAmount || this.reloadKey.isDown && this.currentWeapon.clipAmount < this.currentWeapon.clipSize) {
            this.currentWeapon.reload();
        }
        
        if (pointer.isDown) {
            this.currentWeapon.shoot(this.x, this.y, this.targetAngle, time);
        }

        


    }

    //      --------------
    // -----  MOVING/LOOKING ------
    //     -----------------
    //moving function
    //Includes normalisation for diagonal speed increases
    //adds sprint function -depend on stamina making player walk adds complexity to gameplay while being simple to follow
   
    
    move() {
        let dx = 0;
        let dy = 0;

        if (this.cursors.left?.isDown || this.wasd.left.isDown) dx -= 1;
        if (this.cursors.right?.isDown || this.wasd.right.isDown) dx += 1;
        if (this.cursors.up?.isDown || this.wasd.up.isDown) dy -= 1;
        if (this.cursors.down?.isDown || this.wasd.down.isDown) dy += 1;

        let speed = this.baseSpeed;
        const isMoving = (dx !== 0 || dy !== 0);

        // ✅ LOCK SYSTEM
        if (this.stamina <= 0) {
            this.canSprint = false;
        }

        if (this.stamina >= this.minSprintStamina) {
            this.canSprint = true;
        }

        // ✅ Sprint logic using lock
        if (this.shiftKey.isDown && isMoving && this.canSprint) {
            this.isSprinting = true;
            speed *= this.sprintMultiplier;

            this.stamina -= this.staminaDrainRate;
            if (this.stamina < 0) this.stamina = 0;

            this.lastSprintTime = this.scene.time.now;
        } else {
            this.isSprinting = false;

            // ✅ Regen (with delay if you added it)
            if (this.scene.time.now > this.lastSprintTime + this.staminaRegenDelay) {
                this.stamina += this.staminaRegenRate;
                if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
            }
        }

        // ✅ Movement
        const vec = new Phaser.Math.Vector2(dx, dy);

        if (vec.length() > 0) {
            vec.normalize().scale(speed);
        }

        this.setVelocity(vec.x, vec.y);
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
            this.turnSpeed   
        );

    }

}