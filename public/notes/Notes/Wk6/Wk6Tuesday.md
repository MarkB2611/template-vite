

**Tuesday**

Power interest grid - for staekholders


issues with stakeholder management
1.only talking to direct contact
2. assuming silence = agreement
3. delivery date and what it means for them to non technical people


3 golden rules.

1. communicate early
2. tailor your message
3. document everything - verbal agreements dissapear



**Game Making** 
**Project Idea**
**Retroactively put this scenario in place**
# Scenario: A game publisher wants your company to create a prototype of a game to be used in an online game dashboard they aim to create - the goal is to test the 
viability of an open source javascript game engine called phaser - some valuable looking games have been created without much thought into optomisation or potential 
markets that could benefit.
# Your job is to create a game demo using phaser and any assorted tools that can interlink(backend services such as a local API(postgres and IDEA with java), test automation including any framewokrs or libraries).
the deadline is 3 months(halfway through) - if the game demo lives up to expectations or exceed them there is also talk of you working on the dashboard to provide the first version independently or with outside help. The dashboard would store phaser games to work as an online arcade of different phaser games.

# The only note on the type of game the publisher mentioned is a "Roguelike/Roguelite style top down shooter" or a "platformer with secret paths to allow for 

**Whats done previously(pseudo technical):**
- Pseudo technical means "pseudo code" so technical but not really, i.e technical aspects in english

# Spawning system for weapons, weapon pickups, and weapons loaded from a csv(shotguns, single semi auto fires, multiple auto fires, burst weapons)
- Note there is an issue with where the bullets originate , the burst weapons for example anchor to where the player was not where they actually are -
- this means that if the player moves while burst firing that the bullets will originate from the previous location(x and y where the player is moving from)
set to be scalable with separate systems for the perks etc.

# Points system for the player to use on weapons(so far), with intent to be used on different items such as perks, rnadomised weapons, traits etc.
- note only effective on the weapons in the game so far

# Room System - room system that randomises a set of weapons from the csv with the intent of randomising other pickups and valuable items bought with points.
when a round ends the player can choose between 2 and 8 options to move, that is reflected byu the player being teleported and a new room name being chosen.

# Damage systema nd enemies - enemies move directly towards the player off screenw ith no pathfinding currently or places that are collidable blocking enemies, will add this as another big task(i.e A star pathfinding or djikstras )
- enemies swing and miss, they can also hit the player has a game of dodging these hits, which gets higher risk the more enemies as they can hoard the player. - this may need to be changed with collidables and pathfidning.

# Movement, shooting and player systems. - the player can look and move, has a crosshair and can shoot the active weapons with the weapon handler.
- its absic, effective, has slowing on turning, and feels good to play so far.

# Game scene lifecycle, Start - main game - game over screen - game end screen -> on restart there is a bug with referencing after playing a game the game over screen breaks for some reason.

# Enemey wave handler that spawns and scales in new enemies and difficulties of their speed and damage they can take - making the player need to find better weapons in different rooms - this handler also resets locations of the enemies if the player moves rooms for a better game feel.

**Summary of game so far**
Scalable systems with a hierarchy that is both adapted for reasonable scalability, maintainability created with urgency to get across the deadline and provide multiple starting points of technologies in the demo. THe game has a soid amount of different systems and interlinking features. they need to be pushed slightly further.





**to do today**
fix the issue of the bullets spawning fromt eh same location once shot
