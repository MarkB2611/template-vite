**Week 4 monday**

Accomplished last week:
- Burst, Auto, Semi auto, shotguns
 projectile types and weapons

-cSV parser finishing off. + [rptections

- Refactor old way of communicating between components, I now use the event syhstem to reduce the risks of coupled items and imports. This makes it safer and easier to reference.
win win

- UI for the weapon name and type on the screen.
~





Accomplished:
- Slight visual changes for the gun description then wiring.
-player damage systrem
- end coniditon for player dying.
wednesday
- Stamina Bar + player stamina refactor to clear up more space and allow a stamina manager to handle more - decent pattern of using "managers" as apposed to one bulk class
- intended to be made with not just stamiona, health and weapon managers(current version) but to add trait item managers, perks, and consumables


Accomplishing:
- Player Death and end condition


Doing later:
- before the 6th - AI LITERACY(even if you summarise the transcript)
- End condition, screen flow of data to score kills etc.
- write to a csv for data to be passed(with game scroe and stuff etc)



**BIg Git Commit**
**To the Phaser Frontend Repo**
Function stamina bar among other improvements

other improvements include:
- the bullet now fires from the players pistol - if I want ton add a 2 handed player sprite for the rifles etc I can use that or akimbo(this would require a lot of work probably but set up well for scalability with weapon stats).
- Muzzle flash - added a muzzle flash sound and animation to the weapon firing since I now have the correct rotation and fire oriign on the players weapons.

Main Affected Files:
Weapon.ts
Bullet.ts
game.js

added Files:
StaminaManager.ts
StaminaBarUI.ts
Explosion.ts
