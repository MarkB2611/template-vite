import * as Phaser from "phaser";
import Bullet from "./projectiles/bullets/Bullet";
import Weapon from "./projectiles/weapons/Weapon";
import WeaponManager from "./projectiles/weapons/WeaponManager";
import HealthManager from "./playerobjects/health/healthManager";


export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;

    //PlayerStats
    turnSpeed: any;
    targetAngle: any;


    score: number = 2250;

    // Replaced weapon System
    weaponManager!: WeaponManager;
    healthManager!: HealthManager;

    //perk manager priority 2

    //item manager priority 3

    //consumable manager priority 4

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

    wasPointerDown = false;
    isSprinting = false;
    shiftKey!: Phaser.Input.Keyboard.Key;
    reloadKey!: Phaser.Input.Keyboard.Key;
    
    //add 3 if u make it to 3 weapons
    key1!: Phaser.Input.Keyboard.Key;
    key2!: Phaser.Input.Keyboard.Key;








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


                
        /*this.weapon1 = new Weapon(scene, {
            clipSize: 8,
            reserveSize: 80,
            reserveMaxSize: 80,
            fireRate: 200,
            reloadTime: 1500,
            damage: 15,
            bulletSpeed: 500,
            depletionAmount: 1
        });
        this.currentWeapon = this.weapon1;*/

        this.weaponManager = new WeaponManager(scene, 2);
        this.healthManager = new HealthManager(80, 100, 1);

        // input
        
        this.key1 = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);



        //basic settings
        this.setCollideWorldBounds(true);
        const weapon = this.weaponManager.getCurrentWeapon();
       
        if(weapon) {
            this.scene.events.emit('ammoChanged', weapon.clipAmount, weapon.reserveSize);
        }

        
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
        const weapon = this.weaponManager.getCurrentWeapon();
        if(!weapon) {
            console.log("Weapon Not found");
        }
        this.move();
        this.look();
        this.updateCrosshair();
        //changed so it only calls getCurrentWeapon once a frame - still a lot but minimised.
        this.reload(weapon);
        this.fire(time, weapon);
        this.weaponSwaps();



        //Resets was fired for fire
        
        if(weapon?.fireMode != "auto") {
            this.wasPointerDown = this.scene.input.activePointer.isDown;
        }
    }

    //      --------------------------------------------
    //-------    FIRING/RELOADING/WEAPONSWAPPING       -------
    //      --------------------------------------------


    fire(time: number, weapon: Weapon | null) {
        if(!weapon) {
            console.log("Weapon Not Found, Cant fire");
            return;
        }
        //changed weapons to be a separate class, also added reload button.
        let justClicked = false;
        const pointer = this.scene.input.activePointer;
        if(weapon?.fireMode != "auto"){
            justClicked = !this.wasPointerDown && pointer.isDown;
        } else {
            justClicked = this.wasPointerDown && pointer.isDown;
        }
         
        if(weapon){
            switch (weapon.fireMode) {
                case "auto":
                    if (pointer.isDown) {
                        weapon.shoot(this.x, this.y, this.targetAngle, time);
                    }
                    break;

                case "semi":
                    if (justClicked) {
                        weapon.shoot(this.x, this.y, this.targetAngle, time);
                    }
                    break;

                case "burst":
                    if (justClicked) {
                        weapon.shoot(this.x, this.y, this.targetAngle, time);
                    }
                    break;
            }
        }
    }
    
    reload(weapon: Weapon|null) {
        if (!weapon) return;

        if(weapon.clipAmount < weapon.depletionAmount || this.reloadKey.isDown && weapon.clipAmount < weapon.clipSize) {
            weapon.reload();
        }
    }

    weaponSwaps() {
        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.weaponManager.handleNumberInput(1);
        } else if(Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.weaponManager.handleNumberInput(2);
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