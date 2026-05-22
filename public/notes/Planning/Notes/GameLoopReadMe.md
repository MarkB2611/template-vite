🎮 Core Game Loop
(Used AI to help generate and summarise, worked at a gameplay loop fitting current gameplay mechanics and to push it to the next level.)

Start Room (Fixed)

Always a weapon shop
Sets up player choice early



Main Loop

Player progresses through rooms
Each room offers progression choices
Occasional randomness + risk



Boss Rooms

No shops
Provide big rewards (weapon, stats, or currency)




🛒 Shop System
✅ Weapon Shops

Weapons scale with game stage
Players can:

Buy reliable weapons
Plan builds




✅ Stat Upgrade System (Separate Shop)

Improves player stats like:

❤️ Health
⚔️ Damage
⚡ Attack speed
💰 Economy



👉 Purpose:

Long-term progression
Adds decision-making vs buying weapons


🎲 Mystery Weapon System (Key Feature)
Core Idea:

Cheaper weapon option (~70% cost)
High randomness
Wide range of outcomes


Balance Rules:

More likely to get average or weak weapons
Small chance for very strong weapons
Uses weighted probabilities


Example Chances:

Common → 55%
Uncommon → 25%
Rare → 15%
Legendary → 5%


Stat Variance:

Normal weapons: small variation
Mystery weapons: large variation

Plain Textpseudo isn’t fully supported. Syntax highlighting is based on Plain Text.normal:   0.9 → 1.1mystery:  0.7 → 1.3``Show more lines

🧩 Weapon Design Philosophy
❌ Avoid:

Useless weapons

✅ Instead:

“Bad” = different purpose


Weapon Categories:

⚔️ Combat → reliable damage
💰 Economy → generate resources
🎲 Chaos → unpredictable
🧪 Experimental → niche playstyles


🦆 Example Weapon (Rubber Duck Gun)
Base:

No damage
+10 gold per hit


Purpose:

Weak in combat
Strong for earning money


Becomes:

A strategic choice, not a joke


📈 Upgrade System (Major Feature)
Core Idea:

Weak weapons can become top-tier with upgrades


“Investment Weapons”

Start bad
Scale into powerful tools
Require commitment


Example Progression:

Economy weapon (no damage)
Adds utility
Adds damage
Becomes hybrid
Becomes build-defining


Upgrade Choices (Branching)
Players choose:

💰 More income
⚔️ Add damage
🎲 Add special effects


👉 This creates:

Unique builds
Replayability


⚖️ Balance Principles
✅ Economy Balance

Player can buy something every 2–3 rooms


✅ Risk vs Reward

Safe = normal weapons
Risk = mystery weapon


✅ No Dead Ends

Always allow:

Weapon replacement
Recovery from bad RNG




✅ Controlled RNG

Randomness is:

Visible
Optional
Meaningful




🔥 Player Decision System (Your Core Strength)
Every room, the player chooses:

Buy safe weapon
Gamble for random weapon
Upgrade stats
Invest in scaling weapon
Save for later


👉 This creates:

🎯 Constant meaningful choices


🎲 Perks System (Planned/Optional)
Perks modify gameplay rules:
Examples:

Better mystery rolls
Cheaper upgrades
More frequent weapons
Re-roll options


👉 These:

Add variety between runs
Let players control RNG


🧠 Overall Design Philosophy
Your system is based on:
✅ Structured randomness
Not chaos — controlled unpredictability

✅ Risk vs reward
Players choose how risky to be

✅ Player agency
No forced outcomes

✅ Build evolution
Runs feel different each time

🚀 Final Concept Summary (1 Sentence)

🎮 A progression-based roguelite where players balance safe upgrades, risky weapon rolls, and long-term investment builds to survive increasingly difficult stages.


✅ What You’ve Built (Big Picture)
You now have:

🎲 Random loot system
🛒 Reliable shops
📈 Scaling progression
🔁 Upgradeable weapons
🧠 Strategic decision-making


✅ This is a very strong, replayable game loop

If you want next, I can help you:

Turn this into a technical system (code + structure)
Design your first 10–20 weapons
Build a progression curve with real numbers