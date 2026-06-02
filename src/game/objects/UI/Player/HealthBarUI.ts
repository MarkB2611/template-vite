
import * as Phaser from "phaser";
import HealthManager from "../../characters/player/playerobjects/health/healthManager";

export class HealthBarUI {
    scene: Phaser.Scene;

    x: number;
    y: number;
    width: number;
    height: number;

    currentHealth: number;
    maxHealth: number;

    background: Phaser.GameObjects.Graphics;
    bar: Phaser.GameObjects.Graphics;
    border: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        healthManager: HealthManager,
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

        // health bar (foreground)
        this.bar = scene.add.graphics();

        // border (optional but nice)
        this.border = scene.add.graphics();
        this.border.lineStyle(2, 0xffffff, 1);
        this.border.strokeRect(x, y, width, height);
        
        this.currentHealth = healthManager.health;
        this.maxHealth = healthManager.maxHealth;


        // Listen for health updates
        healthManager.on("healthChanged", this.updateHealth, this);

        

        this.draw();
    }


    updateHealth(current: number, max: number) {
        this.currentHealth = current;
        this.maxHealth = max;
        this.draw();
    }


    draw() {
        this.bar.clear();

        const healthPercent = this.currentHealth / this.maxHealth;

        // color change based on health
        let color = 0x00ff00; // green
        if (healthPercent < 0.5) color = 0xffff00; // yellow
        if (healthPercent < 0.25) color = 0xff0000; // red

        this.bar.fillStyle(color, 1);
        this.bar.fillRect(
            this.x,
            this.y,
            this.width * healthPercent,
            this.height
        );
    }

    setHealth(value: number) {
        this.currentHealth = Phaser.Math.Clamp(value, 0, this.maxHealth);
        this.draw();
    }

    damage(amount: number) {
        this.setHealth(this.currentHealth - amount);
    }

    heal(amount: number) {
        this.setHealth(this.currentHealth + amount);
    }

    setMaxHealth(newMax: number) {
        this.maxHealth = newMax;
        this.currentHealth = Phaser.Math.Clamp(this.currentHealth, 0, newMax);
        this.draw();
    }
}
