**Wk3Tuesday**
monday was bankbholiday thats why there are no notes for then

**Worked on today**
- WeaponPickups - ties into weapon controller and the csv parsing.

Fix to the UI to make it more user friendly and interactive. swapping weapons.

Added a better way to call sound effects using events and the main game scene.

working on fixing the auto fire, semi fire, burst fire conundrum - changing boolean to a string(that functions as an enum)

made a weaponPickupHandler that now allows me to store all the weaponPickup Logic elsewhere.


Agenda each day

    What are you working on
    - Front end system/client - been working on this for the past 3 weeks. plan on incorporating a small monolithic backend next week for the leaderboard
    - CSV loading system(last week and works amazingly for the weapon system/ weapon loading and variety, easy to add new weapons with new stats and different PNGs for the pickups)
    - added a new weapon pickup
    - dealing with CSV files, Async programming, UI design, System Architecture, Object Oriented Programming, Integration of complex systems, scalability

    next week:
    - the leaderboard will show, score, kills, weapons bought, perks bought, consumables bought, consumables used, perk items bought
    - Extra Rooms


    Goals for the week
    - Damage, health system
    - Complete game loop that is playable until finish condition(no win condition as its a retro/arcade gameplay style) - when the player dies show the leaderboard and prompt to enter a 3 digit name
    - Recording of the gameplay loop as a small look/demo - use editing so viewers can ge tthe just and its an easy watch as apposed to lots of unused time/boring gameplay at the sake of demonstrating. Much better having the majoirty of features showcased in a concise way as apposed to
    all of the features at the cost of time. A short summary gameplay video. (recorded gameplay loop)
    - fix burst weapons to fire delay fire delay fire delay - while allowing shotguns to fire multiple instantly

    Blockers
    - issue - Weapon System bug/refactor - fix - ( reactoring from a single weapon system to one that incorporates 2 weapons(with extension for scalability added to make it easy in future))
    - issue - weapon type and csv refactor - had no way of doing burst, auto and semi - now I have 4 main weapon types semi, auto, burst, and spread(shotguns)
    
    Accolades and achievements from last weeks(last week highlighted rest mentioned to add a picture)
    - got a basic structure set up to allow enemies to receive damage, give the player a score based upon hits and enemies,
    - Gathered tools, utilised both linux(ubuntu) and windows(11)
    - Set up github and floating between two computers to encourage development on multiple platforms(also for spottings issues between OS's sooner
    rather than later)

 