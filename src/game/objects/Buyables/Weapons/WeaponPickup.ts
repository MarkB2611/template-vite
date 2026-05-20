import * as Phaser from "phaser";

export default class WeaponPickup extends Phaser.Physics.Arcade.Sprite {
    cost = 600;
    buyAmmoCost = 300;
    weaponName = "L1A1 SLR"
    magSize = 20;
    reserveSize = 240;
    damage = 15;


    
    playerInRange = false;
    interactKey: Phaser.Input.Keyboard.Key;
    promptText: Phaser.GameObjects.Text;

    
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "weapon_pickup_slr");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Key (E to interact)
        this.interactKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        // UI prompt (hidden by default)
        this.promptText = scene.add.text(x, y - 40, "", {
            fontSize: "16px",
            color: "#ffce47",
            backgroundColor: "#ffffff"
        }).setOrigin(0.5);

        this.promptText.setVisible(false);
        
        //ping pong anim for the weapon to be bought
        this.anims.create({
            key: "slr_buy_anim",
            frames: [
                { key: "slr1" },
                { key: "slr2" },
                { key: "slr3" },
                { key: "slr4" },
                { key: "slr3" },
                { key: "slr2" },
                { key: "slr1" },
                { key: "weapon_pickup_slr"},
                { key: "slr2" },
                { key: "slr3" },
                { key: "slr4" },
                { key: "slr3" },
                { key: "slr2" },
                { key: "slr1" },
                { key: "weapon_pickup_slr"},
                { key: "slr2" },
                { key: "slr3" },
                { key: "slr4" },
                { key: "slr3" },
                { key: "slr2" },
                { key: "slr1" },
                { key: "weapon_pickup_slr"},
                { key: "slr2" },
                { key: "slr3" },
                { key: "slr4" },
                { key: "slr3" },
                { key: "slr2" },
                { key: "slr1"},
                { key: "weapon_pickup_slr"},
                { key: "slr1" },
                { key: "slr2" },
                { key: "slr3" },
                { key: "slr4" },
                { key: "slr3" },
                { key: "slr2" },
                { key: "slr1" },
                { key: "weapon_pickup_slr"}
            ],
            frameRate: 25,   // adjust speed
            repeat: 0      // loop forever
        });



       this.scale = 0.8;
    }

        
    update(player: Phaser.Physics.Arcade.Sprite, playerMoney: number, onBuy: Function) {
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        if (distance < 80) {
            this.playerInRange = true;
            this.promptText.setVisible(true);
            this.promptText.setText(`Press F to buy ${this.weaponName} ($${this.cost})`);

            // If player presses E
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                if (playerMoney >= this.cost) {
                    onBuy(); // give weapon
                    this.onBuy();
                    this.promptText.setText("Purchased!");
                } else {
                    this.promptText.setText("Not enough money!");
                }
            }

        } else {
            this.playerInRange = false;
            this.promptText.setVisible(false);
        }
    }

    onBuy() {
        //(this.scene as any)?.player.score;
        this.anims.play("slr_buy_anim");
    }
}
