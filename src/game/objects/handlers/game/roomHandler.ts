import * as Phaser from "phaser";
import Room from "./room";
import WeaponPickupManager from "../../Buyables/Weapons/WeaponPickupManager";
import PerkPickupManager from "../perks/perkPickupManager";
import WaveHandler from "../enemies/waveHandler";
import DoorArrowHandler from "./doorArrowHandler";


export type RoomChoice = {
    id: number;
    luck: number;
    active: boolean;
}



export default class RoomHandler {

   
    //"Choose your next room while you can"
    // Intended to eventually have a 30 second timer witht he arrows to disappear s not to clutter the screen for players staying, and tio add a mechanic to fast paced decisions
    choiceID: number = 0;
    doorMaxAmount: number = 8;
    roomsTraversed: number = 0;
    
    choices: RoomChoice[] = []; // Array Definition
    currentChoice!: RoomChoice;

    currentRoom!: Room;

    arrowHandler!: DoorArrowHandler;
    scene!: Phaser.Scene;

    weaponPickupManager!: WeaponPickupManager;
    perkManager!: PerkPickupManager;
    waveHandler!: WaveHandler;
    locationName!: string;



    constructor(scene: Phaser.Scene, weaponPickupManager: WeaponPickupManager, perkManager: PerkPickupManager, waveHandler: WaveHandler) {
        this.scene = scene;
        this.weaponPickupManager = weaponPickupManager;
        this.perkManager = perkManager;
        this.waveHandler = waveHandler;
        this.arrowHandler = new DoorArrowHandler(this.scene);

        this.initChoices();
        this.currentChoice = this.getActiveChoice();
        this.makeNewRoom(this.weaponPickupManager, this.perkManager, this.waveHandler);
        
        
        this.locationName = "Ground Zero(the start)";
        this.scene.events.emit("change_location_name", this.locationName, this.roomsTraversed);

        this.scene.events.on("wave_ended", ()=> {
            this.makeArrows();
        });
        this.scene.events.on(("door_selected"), (choiceID: number)=> {
            this.selectDoor(choiceID);
            this.makeNewRoom(this.weaponPickupManager, this.perkManager, this.waveHandler);

            this.locationName = this.generateRoomName();
            this.roomsTraversed++;

            this.scene.events.emit("change_location_name", this.locationName, this.roomsTraversed);

        });
    }

    selectDoor(choiceID: number) {
        this.choiceID =  choiceID;
        this.currentChoice = this.choices[choiceID];
        this.currentChoice.active = true;
    }

    //randomisation of luck values
    // between -1.0 and +1.0
    initChoices() {
        //randomised float values between 1 and -1 and a randomised active value so there is most likely less than 8 every time
        this.choices = Array.from(
            {length: this.doorMaxAmount },
            (_, i) => ({
                id: i,
                luck: Phaser.Math.FloatBetween(-1.0,1.0),
                active: Math.random() < 0.5
            })
        );

       
        const minActive = 2;

        let activeCount = this.choices.filter(c => c.active).length;

        while (activeCount < minActive) {
            const i = Phaser.Math.Between(0, this.doorMaxAmount - 1);
            if (!this.choices[i].active) {
                this.choices[i].active = true;
                activeCount++;
            }
        }

    }

    returnChoiceValue(choiceID: number) {
        return this.choices.at(choiceID);
    }

    returnRoomChoice(choiceID: number) {
        return this.choices[choiceID];
    }

    
    //random room choice for when its initialised
    getActiveChoice(): RoomChoice {
        const activeChoices = this.choices.filter(choice => choice.active);

        // Pick a random active one
        const index = Phaser.Math.Between(0, activeChoices.length - 1);

        return activeChoices[index];
    }

    makeNewRoom(weaponPickupManager: WeaponPickupManager, perkManager: PerkPickupManager, waveHandler: WaveHandler) {
        this.currentRoom = new Room(weaponPickupManager, perkManager, waveHandler);
        this.currentRoom.initialiseRoom(this.currentChoice.luck);
        this.initChoices();
    }


    advanceRoom( weaponPickupManager: WeaponPickupManager, perkManager: PerkPickupManager, waveHandler: WaveHandler) {
        this.initChoices();
        this.currentChoice = this.getActiveChoice();
        this.currentRoom.initialiseRoom(this.currentChoice.luck);
        
        this.makeNewRoom(weaponPickupManager, perkManager, waveHandler);
    }

    //procedural room naming
    // expandable for procedural room effects - background png stays the same but colours, etc change
    generateRoomName(): string {

        const adjectives = [
            "Abandoned",
            "Frozen",
            "Cursed",
            "Silent",
            "Burning"
        ];

        const locations = [
            "Corridor",
            "Chamber",
            "Hall",
            "Sanctum",
            "Vault"
        ];

        const adj = Phaser.Utils.Array.GetRandom(adjectives);
        const loc = Phaser.Utils.Array.GetRandom(locations);

        return `${adj} ${loc}`;
    }


    //to be called at the end of a round to show the arrows
    makeArrows() {
        this.arrowHandler.createArrows(this.choices);
    }

    update(player: Phaser.GameObjects.Sprite) {
        this.arrowHandler.update(player);
    }

}