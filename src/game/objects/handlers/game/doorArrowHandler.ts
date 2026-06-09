
import * as Phaser from "phaser";
import DoorArrow from "./doorArrow";
import { RoomChoice } from "./roomHandler";

export default class DoorArrowHandler {

    
    locationPresets = [
        {x: 550, y: 120, angle: 0},   // 0 up
        {x: 900, y: 120, angle: 45},  // 1 up-right
        {x: 900, y: 400, angle: 90},  // 2 right
        {x: 900, y: 650, angle: 135}, // 3 down-right
        {x: 550, y: 650, angle: 180}, // 4 down
        {x: 120, y: 650, angle: 225}, // 5 down-left
        {x: 120, y: 400, angle: 270}, // 6 left
        {x: 120, y: 120, angle: 315}, // 7 up-left
    ];


    scene: Phaser.Scene;
    arrows: DoorArrow[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        
    }

    createArrows(choices: RoomChoice[]) {
        this.clearArrows();

        choices.forEach((choice: RoomChoice, index: number) => {
            if (!choice.active) return;

            const preset = this.locationPresets[index];

            const arrow = new DoorArrow(this.scene, preset.x, preset.y, choice.id, choice);
            arrow.setAngle(preset.angle);

            this.arrows.push(arrow);
        });
    }

    clearArrows() {
        this.arrows.forEach(a => a.destroy());
        this.arrows = [];
    }

    update(player: Phaser.GameObjects.Sprite) {
        this.arrows.forEach((element) => {
            element.update(player);
        });
    }
}
