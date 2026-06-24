import * as Phaser from "phaser";

//make a handler thats based on events that handles the locations of Items by ID.
//this is the event emitter that gives the location.

export default class BuyableLocationHandler {

    //holds off the x and y coordinates for a buyable as not to create a buyable on top of another buyable(i.e weapons, perks etc)
    spawnPoints = [
            { x: 150, y: 150, taken: false },
            { x: 400, y: 150, taken: false },
            { x: 650, y: 150, taken: false },

            { x: 150, y: 350, taken: false },
            { x: 400, y: 350, taken: false },
            { x: 650, y: 350, taken: false },

            { x: 150, y: 550, taken: false },
            { x: 400, y: 550, taken: false },
            { x: 650, y: 550, taken: false }
    ];

    scene!: Phaser.Scene;
    

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        //passes in one through 9 and sees if its available
        this.scene.events.on("buyable_node_initiated", (buyableID: number, type: any, typeID: number) => {
            //on a node trying to be initiated searches through for available choices and makes choices taken
            this.chooseLocation(buyableID, type, typeID);
            console.log("Activated BUyableLocationHandler");
        });


        //clears the taken choices and generates new ones by emitting events(these items emit an event back with the needed info)
        this.scene.events.on("door_selected", () => {
            //
            this.clearTakenChoices();
            //emits to other components to make the choices now after clearing
            this.scene.events.emit("make_buyable_choices");
            //

        })
    }

    chooseLocation(buyableID: number, type: any, typeID: number) {

        //filters for available locations and returns if false
        const availableLocations = this.spawnPoints.filter(location => !location.taken);

        if (availableLocations.length === 0) {
            console.log("All locations are taken");
            //gives error codes when all are taken with buyableID
            this.scene.events.emit("buyable_node_selected", [-1, -1], buyableID, type, typeID);
            return;
        } else {

                // pick a random index
            const randomIndex = Math.floor(Math.random() * availableLocations.length);
            const chosenLocation = availableLocations[randomIndex];
            this.scene.events.emit("buyable_node_selected", [chosenLocation.x, chosenLocation.y], buyableID, type, typeID);

            console.log("Random available location:", chosenLocation);

            // mark it as taken
            chosenLocation.taken = true;

        }

        
    }

    setTaken(location: number) {
        this.spawnPoints[location].taken = true;
    }

    clearTakenChoices() {
        this.spawnPoints.forEach(location => {
            location.taken = false;
        })
    }
}