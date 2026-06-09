
import * as Phaser from "phaser";
import Player from "../../characters/player/player";

export default class WeaponPickup extends Phaser.Physics.Arcade.Sprite {

    weaponId: number;

    private interactKey: Phaser.Input.Keyboard.Key;
    private promptText: Phaser.GameObjects.Text;
    private playerInRange: boolean = false;


    constructor(scene: Phaser.Scene, x: number, y: number, weaponId: number, scale: number)
    {
        super(scene, x, y, `weapon_${weaponId}_still`);

        this.weaponId = weaponId;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //interact key and prompt text
        this.interactKey = scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        this.promptText = scene.add.text(x, y - 50, "", {
            fontSize: "16px",
            color: "#00ffcc",
            backgroundColor: "#000000"
        }).setOrigin(0.5);

        this.promptText.setVisible(false);


        this.setScale(scale);

        
    }

    // =========================================
    // 🎞 CREATE ANIMATION (from anim/*.png)
    // =========================================

    private createAnim(scene: Phaser.Scene) {

        const animKey = `weapon_${this.weaponId}_anim`;

        if (scene.anims.exists(animKey)) return;

        const frames: Phaser.Types.Animations.AnimationFrame[] = [];

        const MAX_FRAMES = 10; // safe upper limit

        for (let i = 1; i <= MAX_FRAMES; i++) {

            const key = `weapon_${this.weaponId}_${i}`;

            if (scene.textures.exists(key)) {
                frames.push({ key });
            }
        }

        if (frames.length === 0) return;

        // ✅ create ping-pong effect
        const pingPongFrames = [
            ...frames,
            ...frames.slice(1, -1).reverse()
        ];

        scene.anims.create({
            key: animKey,
            frames: pingPongFrames,
            frameRate: 12,
            repeat: 0
        });
    }


    // =========================================
    // 🔄 UPDATE LOOP
    // =========================================

   
    
    update(player: Player) {

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        const weaponManager = player.weaponManager;
        const config = weaponManager.getWeaponConfig(this.weaponId);

        if (!config) return;

        // ✅ Keep prompt positioned correctly
        this.promptText.setPosition(this.x, this.y - 40);

        if (distance < 80) {

            this.playerInRange = true;
            this.promptText.setVisible(true);

            this.promptText.setText(
                `Press F to buy ${config.name} ($${config.baseCost})`
            );

            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {

                if (player.score >= config.baseCost) {

                    // ✅ Deduct money
                    player.score -= config.baseCost;
                    this.scene.events.emit("point_decrease", config.baseCost);

                    weaponManager.tryAddOrReplace(this.weaponId);

                    
                    this.createAnim(this.scene);
                    this.playBuyAnimation();


                    // ✅ Feedback
                    this.promptText.setText("Purchased!");

                    this.scene.events.emit(
                        "showMessage",
                        `Bought ${config.name}`
                    );
                    this.scene.events.emit(
                        "playSound",
                        "sfx_wall_buy",
                        0.7,
                        1.8,
                        3000
                    )

                    // ✅ Reset prompt text
                    this.scene.time.delayedCall(1000, () => {
                        this.promptText.setText(
                            `Press F to buy ${config.name} ($${config.baseCost})`
                        );
                    });

                } else {
                    this.promptText.setText("Not enough money!");
                }
            }

        } else {
            this.playerInRange = false;
            this.promptText.setVisible(false);
        }
    }



    // =========================================
    // 🎉 BUY ANIMATION
    // =========================================

    private playBuyAnimation() {
        const animKey = `weapon_${this.weaponId}_anim`;

        if (this.scene.anims.exists(animKey)) {
            this.anims.play(animKey);
        }

        // When animation completes → return to still image
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setTexture(`weapon_${this.weaponId}_still`);
        });

    }
}
