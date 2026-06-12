
import * as Phaser from "phaser";
import StaminaManager from "../../characters/player/playerobjects/stamina/staminaManager";

export class StaminaBarUI {
    scene: Phaser.Scene;

    x: number;
    y: number;
    width: number;
    height: number;

    currentStamina: number;
    maxStamina: number;

    background: Phaser.GameObjects.Graphics;
    bar: Phaser.GameObjects.Graphics;
    border: Phaser.GameObjects.Graphics;

    //For fading out animation
    private fadeTimer?: Phaser.Time.TimerEvent;
    

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        staminaManager: StaminaManager,
        width: number = 200,
        height: number = 20
    ) {
        this.scene = scene;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;


        // background
        this.background = scene.add.graphics();
        this.background.fillStyle(0x222222, 1);
        this.background.fillRect(x, y, width, height);

        // stamina bar (foreground)
        this.bar = scene.add.graphics();

        // border (optional but nice)
        this.border = scene.add.graphics();
        this.border.lineStyle(2, 0xffffff, 1);
        this.border.strokeRect(x, y, width, height);
        
        this.currentStamina = staminaManager.stamina;
        this.maxStamina = staminaManager.maxStamina;


        // Listen for stamina updates
        staminaManager.on("StaminaChanged", this.updateStamina, this);

        staminaManager.on("Sprinting", this.makeBarVisible, this);
        staminaManager.on("Healing", this.makeBarVisible, this);
        staminaManager.on("Healed", this.makeBarInvisible, this);
        

        this.draw();
    }

    
    
    makeBarInvisible() {
        // reset timer if called again
        if (this.fadeTimer) {
            this.fadeTimer.remove(false);
        }

        this.fadeTimer = this.scene.time.delayedCall(2000, () => {

            this.scene.tweens.add({
                targets: [this.background, this.bar, this.border],
                alpha: 0,
                duration: 1200,
                ease: "Linear"
            });

        });
    }


    
    
    makeBarVisible() {
        // cancel any pending fade-out
        if (this.fadeTimer) {
            this.fadeTimer.remove(false);
        }

        // kill any fade tween
        this.scene.tweens.killTweensOf([this.background, this.bar, this.border]);

        // instantly visible
        this.background.setAlpha(1);
        this.bar.setAlpha(1);
        this.border.setAlpha(1);
    }



    updateStamina(current: number, max: number) {
        this.currentStamina = current;
        this.maxStamina = max;
       
        this.draw();
    }



    draw() {
        this.bar.clear();

        const staminaPercent = this.currentStamina / this.maxStamina;

        // color change based on stamina
        let color = 0x00ff00; // green
        if (staminaPercent < 0.5) color = 0xffff00; // yellow
        if (staminaPercent < 0.25) color = 0xff0000; // red

        this.bar.fillStyle(color, 1);
        this.bar.fillRect(
            this.x,
            this.y,
            this.width * staminaPercent,
            this.height
        );
    }

    setStamina(value: number) {
        this.currentStamina = Phaser.Math.Clamp(value, 0, this.maxStamina);
        this.draw();
    }

    damage(amount: number) {
        this.setStamina(this.currentStamina - amount);
        this.background.setVisible(true);
        this.border.setVisible(true);
        this.bar.setVisible(true);
    }

    heal(amount: number) {
        this.setStamina(this.currentStamina + amount);
        this.background.setVisible(true);
        this.border.setVisible(true);
        this.bar.setVisible(true);
    }

    setMaxstamina(newMax: number) {
        this.maxStamina = newMax;
        this.currentStamina = Phaser.Math.Clamp(this.currentStamina, 0, newMax);
        this.draw();
    }
}
