**Saturday**

unofficial orogramming time because:
1. I feel like doing some more technical stuff
2. I didnt have the most productive week
3. the system isnt where I would like it to be(a lot has been done but if I push it further it can be a great project not just a good one).


**YESTERDAY**
FRIDAY AGENDA

- FIX REACTIVE UI - if easy enough add it fading out with opacity/alpha vs just dissapearing
(Fixed no alpha )
THIS IS DONE FOR:
- Stamina and health bars
- Room opening title
- Weapon Item and descriptions
NOT DONE FOR:
- Ammo
- Waves
- Enemy remaining count

- FIx the room opening text UI(shows above the room name and other UI items) - also has an issue with the press f to open door appearing where the chosen arrow was without deleting the message.
- Fix the Wave UI (reactive to starting a new wave to decrease clutter)
- FIX ROOM SPAWNING - start with randomised weapons 
(need to fix now I have the )


Additional Fixes:
- Added the soundcontroller to have a float based volume setting for SFX, Music, and for master volume(enough to make a UI to add some quality of life assurances for the players seems minimal but is incredibly important)
- Alpha and opacity.



**Saturday**

**DONE**
- Wave Spawning (when enterring a new room I need a function to activate to move all zombies back to their original spawns.)(DONE)
1. (wave spawner and enemy base class handles the teleporting out of the room
2. original x and y is stored in the constructor and directly sets the current x and y)
3. the wave spawner runs through the enemies checks if the enemy is alive and if they are then the function gets called(prevents calling a function from a null class )

**DONE**
- Add a run away function from the player(simple enough should  be inversing the x and y movement vectors)
COMPLETE
inverses the rotation 180 degrees so the target is still the player but the rotation changes to make it run away - currently not in use anywehre but tested to work fine


also Managed to get the ammon fading in nd out - this is progress since the other fade i9ns and outs are stamina abrs
they have multiple elements rather than one or 2;

