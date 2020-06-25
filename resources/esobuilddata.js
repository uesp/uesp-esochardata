window.ecdLastTooltip = null;

window.lastEsoBookSearchText = "";
window.lastEsoBookSearchPos = -1;
window.lastEsoBookSearchElement = null;

window.g_EsoBuildLastInputValues = {};
window.g_EsoCurrentTooltipSlot = "";

	// Default stats needed for tooltip updates
g_EsoBuildLastInputValues.HealingDone = 0;
g_EsoBuildLastInputValues.SpellResist = 0;
g_EsoBuildLastInputValues.PhysicalResist = 0;
g_EsoBuildLastInputValues.Health = 0;
g_EsoBuildLastInputValues.DamageShield = 0;
g_EsoBuildLastInputValues.DamageDone = 0;
g_EsoBuildLastInputValues.MagicDamageDone = 0;
g_EsoBuildLastInputValues.PhysicalDamageDone = 0;
g_EsoBuildLastInputValues.ShockDamageDone = 0;
g_EsoBuildLastInputValues.FlameDamageDone = 0;
g_EsoBuildLastInputValues.FrostDamageDone = 0;
g_EsoBuildLastInputValues.PoisonDamageDone = 0;
g_EsoBuildLastInputValues.DiseaseDamageDone = 0;
g_EsoBuildLastInputValues.SingleTargetDamageDone = 0;
g_EsoBuildLastInputValues.DotDamageDone = 0;
g_EsoBuildLastInputValues.AOEDamageDone = 0;
g_EsoBuildLastInputValues.DirectDamageDone = 0;
g_EsoBuildLastInputValues.BleedDamage = 0;
g_EsoBuildLastInputValues.PetDamageDone = 0;


window.ESO_SETPROCDAMAGE_DATA = 
{
		"adept rider" : {
			//(5 items) While mounted you gain Major Evasion, reducing damage from area attacks by 25%. 
			//Dismounting spawns a dust cloud at your position for 12 seconds that deals 16-1436 Physical
			//Damage every 1 second to enemies who stand inside it. You and group members inside the dust 
			//cloud gain Major Evasion. Dust cloud can be created once every 12 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"aegis caller": {
			//(5 items) When you deal critical melee damage, summon a Lesser Aegis for 11 seconds. After 2.5 seconds, 
			//the Lesser Aegis spins its blades, dealing 86-3730 Bleed Damage every 1 second. This effect can occur once every 12 seconds.
			isAoE: true,
			isDoT: true,
			isBleed: true,
			index: 4,
			items: 5,
		},
		"affliction" : {
			// (5 items)  When you deal damage, you have a 50% chance to deal 42-1830 Disease damage to the target.
			// This damage immediately applies the Diseased status effect, applying Minor Defile to the target, 
			// reducing their Healing Received and Health Recovery by 15% for 4 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"arms of relequen" : {
			// (5 items) Your Light and Heavy attacks apply a stack of harmful winds to your target for 5 seconds. 
			// Harmful winds deal 4-200 Physical Damage per stack every 1 second. 20 stacks max.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"ashen grip" : {
			// (5 items) When you deal melee damage, you breathe fire to all enemies in front of you for 124-5350 Flame damage. 
			// This effect can occur once every 4 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"auroran's thunder" : {
			// (5 items) Dealing direct damage with a single target attack summons a cone of lightning from your chest for 3 seconds, 
			// dealing 26-1147 Shock Damage every 0.5 seconds to enemies in the cone. This effect can occur every 6 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},		
		"azureblight reaper" : {
			// (5 items) When you deal damage with a damage over time effect, you apply a stack of Blight Seed to your target for 5 seconds.
			// At 20 stacks, the Blight Seeds explode, dealing 258-11100 Disease Damage to the target and nearby enemies.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"bahraha's curse" : {
			// (5 items) When you deal damage, you have a 25% chance to create desecrated ground for 5 seconds, which reduces the Movement Speed of 
			// enemies within by 70%, damages them for 20-860 Magic damage every 1 second, and heals you for 100% of the damage done.
			isAoE : true,
			isDoT : true,
			index : 5,
			items : 5,
		},
		"caluurion's legacy" : {
			// (5 items) When you deal direct Critical Damage with a single target Magicka ability, you launch a Fire, Ice, Shock, or Disease ball at
			// your target that deals 300-12900 damage and applies a status effect. This effect can occur once every 10 seconds.
			isAoE : false,
			isDoT : false,
			damageTypes: ["Flame", "Frost", "Shock", "Disease"],
			index : 4,
			items : 5,
		},
		"chaotic whirlwind" : {
			// (2 items) When you cast Whirlwind, you envelop yourself in a destructive flurry of blades for 6 seconds that pulse outward, 
			// striking up to 3 random enemies around you every 1 second for 62-2675 Physical Damage. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : true,
			index : 1,
			items : 2,
		},
		"coldharbour's favorite" : {
			// (5 items) When you damage an enemy, summon Cadwell's noble mount, Honor, who after 2 seconds, explodes, damaging enemies around him for 280-12190 Magic Damage over 4 seconds.
			isAoE : true,
			isDoT : true,
			index : 5,
			items : 5,
		},
		"curse of doylemish" : {
			// (5 items) When using a fully-charged melee Heavy Attack on a taunted monster or any enemy who is stunned, feared, or immobilized, you
			// will deal 290-12507 Physical Damage. This effect can occur once every 4 seconds.
			isAoE : false,
			isDoT : false,
			index : 5,
			items : 5,
		},
		"defending warrior" : {
			// (5 items) When you block an attack, you deal 93-4000 Magic Damage to all enemies within 10 meters of you and heal for 100% of the damage done. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"defiler" : {
			// (5 items) When you deal Critical Damage, you have an 8% chance to summon a Hunger that spews poison to all enemies in front of it, 
			// dealing 139-6000 Poison Damage and stunning any enemy hit for 5 seconds. This effect can occur once every 5 seconds.
			isAoE : true,
			isDoT : false,
			isPet : true,
			index : 4,
			items : 5,
		},
		"destructive mage" : {
			// (5 items) When you deal damage with a fully-charged Heavy Attack, you place a bomb on the enemy for 10 seconds. When they are hit with a
			// fully-charged Heavy Attack the bomb detonates, dealing 152-6575 Magic Damage all enemies within 8 meters. This effect can occur once every 4 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"domihaus" : {
			// (2 items) When you deal damage, you create either a ring of fire or ring of molten earth around you for 10 seconds, which deals 30-1300 Flame damage or 30-1300 Physical damage
			// every 1 second. Standing within the ring grants you 6-300 Spell Damage or 6-300 Weapon Damage. This effect can occur once every 15 seconds
			isAoE : true,
			isDoT : true,
			damageTypes: ["Flame", "Physical"],
			index : 2,
			items : 2,
		},		
		"embershield" : {
			// (5 items)  When you deal damage with a fully-charged Heavy Attack, you increase your Physical and Spell Resistance by 76-3300 and deal 20-860 Flame damage 
			// to all enemies within 5 meters of you every 1 second for 6 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"eternal hunt" : {
			// (5 items) When you use Roll Dodge, you leave behind a rune that detonates when enemies come close, dealing 170-7335 Poison damage and immobilizing them for 1.5 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"flame blossom" : {
			// (5 items) When you deal damage, you have a 10% chance to summon a line of flame that moves forward after 1 second, dealing 186-8000 Flame Damage to 
			// any enemy in its path. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"frozen watcher" : {
			// (5 items) Summon a blizzard around you while blocking, inflicting 23-1000 Frost Damage every 1 second to enemies within your blizzard. 
			// Your blizzard has a 15% chance of inflicting Chilled on enemies damaged.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"galerion's revenge" : {
			// (5 items) When you deal damage with a Light or Heavy Attack, you put a Mark of Revenge on the enemy for 15 seconds. 
			// After stacking 5 Marks of Revenge on an enemy they detonate for 223-9630 Magic Damage.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"grothdarr" : {
			// (2 items) When you deal damage, you have a 10% chance to create lava pools that swirl around you, dealing 41-1800 Flame damage to
			// all enemies within 8 meters of you every 1 second for 5 seconds. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"hand of mephala" : {
			// (5 items) When you take damage, you have a 10% chance to cast a web around you for 5 seconds, reducing the Movement Speed of enemies within by 50%.
			// After 5 seconds the webs burst into venom, dealing 60-2580 Poison Damage and applying Minor Fracture to any enemy hit for 5 seconds, reducing their Physical Resistance by 1320.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"hide of morihaus" : {
			// (5 items)  When you Roll Dodge through an enemy, you deal 42-1840 Physical Damage and knock them down for 3 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"iceheart" : {
			// (2 items) When you deal Critical Damage, you have a 20% chance to gain a damage shield that absorbs 116-5000 damage for 6 seconds. While the damage shield holds, you deal 11-500 Frost damage
			// to all enemies within 5 meters of you every 1 second. This effect can occur once every 6 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"icy conjuror" : {
			// (5 items) Applying a minor debuff to your enemy summons a non-reflectable Ice Wraith that will charge into your enemy, dealing 440-18920 Frost Damage 
			// over 8 seconds. This effect can occur every 12 seconds.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"ilambris" : {
			// (2 items) When you deal Flame or Shock Damage, you have a 33% chance to summon a meteor shower of that damage type that deals 46-2015 Damage to 
			// all enemies within 4 meters every 1 second for 5 seconds. This effect can occur once every 8 seconds.
			isAoE : true,
			isDoT : true,
			damageTypes : [ "Flame", "Shock" ],
			index : 2,
			items : 2,
		},
		"infernal guardian" : {
			// (2 items) When you apply a damage shield to yourself or an ally, you have a 50% chance to lob 3 mortars over 2 seconds at the furthest enemy from you
			// that each deal 103-4430 Flame damage to all enemies within 5 meters of the blast area. This effect can occur once every 6 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"kjalnar's nightmare" : {
			// (2 items) Dealing damage with a Light Attack puts a Bone stack on your enemy for 5 seconds. You can only apply 1 stack every 1 second.
			// At 5 stacks, an undodgeable skeletal hand attacks your enemy after 1 second, knocking them into the air and stunning them for 3 seconds, 
			// or dealing 337-14500 Magic damage if they cannot be stunned. An enemy that has reached 5 stacks cannot gain Bone stacks for 3 seconds.
			isAoE : false,
			isDoT : false,
			index : 2,
			items : 2,
		},
		"kra'gh" : {
			// (2 items) When you deal damage, you have a 10% chance to spawn dreugh limbs that create shockwaves in front of you dealing 31-1345 Physical damage
			// every 0.4 seconds for 1.2 seconds. This effect can occur once every 3 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"leeching plate" : {
			// (5 items) When you take damage, you have a 20% chance to summon a cloud of leeching poison under the assailant. The cloud deals 27-1200 Poison damage
			// every 1 second for 5 seconds and heals you for 100% of the damage caused. A cloud can be created once every 5 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"mad tinkerer" : {
			// (5 items) When you deal damage, you have a 10% chance to summon a Verminous Fabricant that charges the nearest enemy, dealing 232-9999 Shock Damage to all
			// enemies in its path, knocking them into the air, and stunning them for 2 seconds. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : false,
			isPet : true,
			index : 4,
			items : 5,
		},
		"maw of the infernal" : {
			// (2 items)  When you deal damage with a Light or Heavy Attack, you have a 33% chance to summon a fire breathing Daedroth for 15 seconds. 
			// The Daedroth's attacks deal 89-3865 Flame damage, and alternate between Fiery Breath, Fiery Jaws, and Jagged Claw, which alternate once every 2 seconds.
			isAoE : false,
			isDoT : false,
			isPet : true,
			index : 2,
			items : 2,
		},
		"merciless charge" : {
			// (2 items)  Dealing damage with Critical Charge causes enemies to bleed for 228-10032 Physical Damage over 5 seconds.
			isAoE : false,
			isDoT : true,
			index : 1,
			items : 2,
		},
		"morkuldin" : {
			// (5 items)  When you deal damage with a Light or Heavy Attack, you summon an animated weapon to attack your enemies for 15 seconds. 
			// The animated weapon's basic attacks deal 95-4108 Physical damage. This effect can occur once every 15 seconds.
			isAoE : false,
			isDoT : true,
			isPet : true,
			index : 4,
			items : 5,
		},
		"nerien'eth" : {
			// (2 items)  When you deal direct damage, you have a 15% chance to summon a Lich crystal that explodes after 2 seconds, dealing 218-9393 Magic damage
			// to all enemies within 4 meters. This effect can occur once every 3 seconds.
			isAoE : true,
			isDoT : false,
			index : 2,
			items : 2,
		},
		"night terror" : {
			// (5 items)  When you take melee damage, you deal 46-2000 Poison Damage to the attacker. This effect can occur once every 1 second.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"overwhelming surge" : {
			// (5 items)  When you deal damage with a Class ability, you have a 33% chance to surround yourself with a torrent that deals 24-1040 Shock Damage
			// to enemies within 8 meters of you every 1 second for 6 seconds. 15% of the damage you deal this way is restored to you as Magicka. This effect can occur every 6 seconds.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"perfected arms of relequen": {
			// (5 items) Your Light and Heavy attacks apply a stack of harmful winds to your target for 5 seconds. Harmful winds deal 4-200 Physical Damage every 1 second. 20 stacks max.
			isAoE : false,
			isDoT : true,
			index : 5,
			items : 5,
		},
		"perfected chaotic whirlwind": {
			// (2 items) When you cast Whirlwind, you envelop yourself in a destructive flurry of blades for 6 seconds that pulse outward, striking up to 3
			// random enemies around you every 1 second for 62-2675 Physical Damage. This effect can occur once every 10 seconds.
			isAoE : false,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"perfected merciless charge" : {
			// (2 items)  Dealing damage with Critical Charge causes enemies to bleed for 228-10032 Physical Damage over 5 seconds.
			isAoE : false,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"perfected piercing spray" : {
			// (2 items)  Dealing damage with Critical Charge causes enemies to bleed for 228-10032 Physical Damage over 5 seconds.
			isAoE : false,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"perfected wild impulse" : {
			// (2 items)  Reduce the cost of Impulse by 10%. Impulse places lingering elemental damage on your targets, dealing 92-3965 Flame, 
			// 92-3965 Shock, and 92-3965 Frost Damage over 8 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"phoenix" : {
			// (5 items)  When you drop below 25% Health, gain a damage shield that absorbs 581-25000 damage for 6 seconds and deals 186-8000 Flame damage
			// to nearby enemies. This effect can occur once every 1 minute 
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"pillar of nirn" : {
			// (5 items)When you deal damage, you have a 10% chance to create a fissure underneath the enemy after 1 second, dealing 46-2000 Physical Damage to all 
			// enemies within 2.5 meters and causing them to bleed for an additional 230-10000 Physical Damage over 10 seconds. This effect can occur once every 10 seconds.
			isAoE : [true, false],
			isDoT : [false, true],
			isBleed: [false, true],
			index : 4,
			items : 5,
		},
		"plague slinger" : {
			// (5 items) When you take damage, summon a Skeever corpse which will launch five poison balls over 5 seconds that deal 120-5160 Poison Damage each at the nearest enemy.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"poisonous serpent" : {
			// (5 items) When you deal damage with a Light or Heavy Attack against an enemy who has a Poison Damage ability on them, you have a 50% chance to deal an 
			// additional 79-3400 Poison Damage. This effect can occur once every 1 second.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"roar of alkosh" : {
			// (5 items)  When you activate a synergy, you send a shockwave from your position that deals 40-1720 Physical damage and an additional 280-12040 Physical damage 
			// over 10 seconds. Reduces the Physical and Spell Resistance of any enemy hit by 70-3010 for 10 seconds.
			isAoE : [true, true],
			isDoT : [false, true],
			index : 4,
			items : 5,
		},
		"savage werewolf" : {
			// (5 items) Your Light and Heavy Attacks rend flesh, causing your enemy to bleed for 23-1000 Physical Damage every 1 second for 4 seconds.
			isAoE : false,
			isDoT : true,
			isBleed: true,
			index : 4,
			items : 5,
		},
		"scavenging demise" : {
			// (5 items)   When you deal Critical Poison Damage to an enemy, summon the Scavenging Maw which attacks your enemy after 2 seconds. The Scavenging Maw deals 162-7000 Poison Damage
			// and inflicts Minor Vulnerability for 15 seconds, increasing their damage taken by 8%. This effect can occur every 10 seconds.
			isAoE : false,
			isDoT : false,
			isPet : true,		//TODO: Confirm?
			index : 4,
			items : 5,
		},
		"selene" : {
			// (2 items) When you deal melee damage, you have a 15% chance to call on a primal spirit that mauls the closest enemy in front of you after 1.3 seconds for 
			// 310-13364 Physical damage. This effect can occur once every 4 seconds.
			isAoE : false,
			isDoT : false,
			isPet : true,
			singleTarget : true,
			index : 2,
			items : 2,
		},
		"sellistrix" : {
			// (2 items) When you deal damage you create an earthquake under the enemy that erupts after 1.5 seconds, dealing 158-6836 Physical damage to all enemies within 
			// 4 meters and stunning them for 3 seconds. This effect can occur once every 6 seconds.
			isAoE : true,
			isDoT : false,
			index : 2,
			items : 2,
		},
		"shadow of the red mountain" : {
			// (5 items)  When you deal damage with a weapon, you have a 10% chance to spawn a volcano that erupts after 1 second, launching liquid hot lava at the closest 
			// enemy dealing 195-8400 Flame damage. This effect can occur once every 2 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"shadowrend" : {
			// (2 items) When you take damage, you have a 15% chance to summon a shadowy Clannfear for 15 seconds. The Clannfear's attacks deal 18-800 Magic damage and
			// reduce their target's damage done by 5% for 2 seconds.
			isAoE : false,
			isDoT : false,			//TODO: Confirm?
			singleTarget : false, 	//TODO: Test?
			isPet: true,
			index : 2,
			items : 2,
		},
		"sheer venom" : {
			// (5 items) When you deal damage with an Execute ability you infect the enemy, dealing 224-9660 Poison damage over 6 seconds. This effect can occur once every 6 seconds.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"song of lamae" : {
			// (5 items) When you take damage while you are under 30% Health, you deal 90-3870 Magic damage to the attacker and heal for 90-3870 Health.
			// This effect can occur once every 30 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"spawn of mephala" : {
			// (2 items) When you deal damage with a fully-charged Heavy Attack, you create a web for 10 seconds that deals 31-1340 Poison damage every 1 second to 
			// all enemies within 4 meters and reduces their Movement Speed by 50%. This effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
			
		},
		"storm knight's plate" : {
			// (5 items)  When you take non-Physical Damage, you have a 10% chance to deal 101-4373 Shock damage to all enemies within 5 meters of you every 2 seconds 
			// for 6 seconds. This effect can occur once every 6 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"storm master" : {
			// (5 items) When you deal Critical Damage with a fully-charged Heavy Attack or Overload, your Light Attacks will also deal 37-1605 Shock Damage for 20 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"stormfist" : {
			// (2 items) When you deal damage, you have a 10% chance to create a thunderfist to crush the enemy, dealing 38-1650 Shock damage every 1 second for 3 seconds to all 
			// enemies within 4 meters and a final 196-8470 Physical damage when the fist closes. This effect can occur once every 8 seconds.
			isAoE : true,
			isDoT : [true, false],
			isPet: true,
			index : 2,
			items : 2,
		},
		"sunderflame" : {
			// (5 items) When you deal damage with a fully-charged Heavy Attack, you deal an additional 93-4000 Flame Damage and apply Minor Breach and Minor Fracture to the enemy, 
			// reducing their Spell and Physical Resistance by 1320 for 8 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"syvarra's scales" : {
			// (5 items) When you deal damage, you have a 5% chance to cause a burst of lamia poison that deals 22-967 Poison damage in a 5 meter radius 
			// and an additional 132-5802 Poison damage over 6 seconds to all enemies hit. This effect can occur once every 6.5 seconds.
			isAoE : [true, true],
			isDoT : [false, true],
			index : 5,
			items : 5,
		},
		"the ice furnace" : {
			// (5 items) When you deal Frost Damage, you deal an additional 74-1644 Flame Damage to all enemies within 8 meters around the initial target. 
			// This effect can occur once every 1 second.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"Thews of the Harbinger" : {
			// (5 items) When you block an attack, you deal damage to your attacker equal to 6% of your Max Health. Current value: 524 Physical Damage
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"thunderbug's carapace" : {
			// (5 items) When you take Physical Damage, you have a 50% chance to deal 120-5160 Shock Damage in a 5 meter radius around you. This effect can occur once every 3 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"thurvokun" : {
			// (2 items)When you take damage from a nearby enemy, you summon a growing pool of desecrated bile for 8 seconds. Enemies in the bile take 2-100 Disease damage every 1 second and are 
			// afflicted with Minor Maim and Minor Defile for 4 seconds, reducing their damage done by 15% and healing received and Health Recovery by 15%. This effect can occur every 16 seconds.
			isAoE : true,
			isDoT : true,
			index : 2,
			items : 2,
		},
		"tremorscale" : {
			// (2 items) When you taunt an enemy, you cause a duneripper to burst from the ground beneath them after 1 second, dealing 139-6000 Physical damage to all enemies within 4 meters 
			// and reducing their Physical Resistance by 55-2395 for 8 seconds. This effect can occur once every 8 seconds.
			isAoE : true,
			isDoT : false,
			index : 2,
			items : 2,
		},
		"trinimac's valor" : {
			// (5 items) When you cast a damage shield ability, you call down a fragment of Trinimac that heals you and your allies for 93-4000 Health and damages enemies for 93-4000 Magic damage 
			// in a 5 meter radius. This effect can occur once every 5 seconds.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"twin sisters" : {
			// (5 items) When you block an attack, you have a 20% chance to cause all enemies within 5 meters of you to bleed for 330-14400 Physical damage over 10 seconds. 
			// awThis effect can occur once every 10 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"unfathomable darkness" : {
			// (5 items) When you deal damage, you have a 10% chance to call a murder of crows around you for 12 seconds. Every 3 seconds a crow will be sent to peck the closest enemy 
			// within 12 meters of you, dealing 93-4000 Physical Damage. This effect can occur once every 15 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"valkyn skoria" : {
			// (2 items)  When you deal damage with a damage over time effect, you have a 8% chance to summon a meteor that deals 209-9000 Flame damage to the target and 82-3535 Flame damage 
			// to all other enemies within 5 meters. This effect can occur once every 5 seconds.
			isAoE : [false, true],
			isDoT : false,
			index : 2,
			items : 2,
		},
		"velidreth" : {
			// (2 items)  When you deal damage, you have a 20% chance to spawn 3 disease spores in front of you after 1 second that deal 250-10752 Disease damage to 
			// the first enemy they hit. This effect can occur once every 8 seconds.
			isAoE : false,
			isDoT : false,
			index : 2,
			items : 2,
		},
		"venomous smite" : {
			// (5 items) Dealing Critical Damage inflicts Hunter's Venom on your enemy for 10 seconds, dealing 52-2241 Poison Damage to your target and nearby enemies 
			// every 1 second. This effect can occur once every 15 seconds.
			isAoE : true,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"vicecanon of venom" : {
			// (5 items) When you deal Critical Damage to an enemy from Sneak, you inject a leeching poison that deals 320-13760 Poison Damage over 15 seconds to 
			// them and heals you for 100% of the damage done.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"vicious death" : {
			// (5 items) When you kill a Player, they violently explode for 367-15815 Flame damage to all other enemies in a 4 meter radius.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"viper's sting" : {
			// (5 items) When you deal damage with a melee attack, you deal an additional 145-6400 Poison Damage over 4 seconds. This effect can occur once every 4 seconds.
			isAoE : false,
			isDoT : true,
			index : 4,
			items : 5,
		},
		"way of fire" : {
			// (5 items) When you deal damage with a weapon, you have a 20% chance to deal an additional 93-4000 Flame damage. This effect can occur once every 2 seconds.
			isAoE : false,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"widowmaker" : {
			// (5 items) When your alchemical poison fires, you drop a poisonous spore in front of you that bursts after 1 second, dealing 180-7740 Poison Damage to all enemies within 5 meters.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"wild impulse" : {
			// (2 items) Reduce the cost of Impulse by 10%. Impulse places lingering elemental damage on your targets, dealing 92-3965 Flame, 92-3965 Shock, and 92-3965 Frost Damage over 8 seconds.
			isAoE : true,
			isDoT : true,
			index : 1,
			items : 2,
		},
		"winterborn" : {
			// (5 items) When you deal Frost Damage, you have an 8% chance to summon an ice pillar that deals 140-6020 Frost damage to all enemies in a 3 meter radius. The ice pillar persists 
			// for 2 seconds and reduces the Movement Speed of all enemies within the radius by 60%.
			isAoE : true,
			isDoT : false,
			index : 4,
			items : 5,
		},
		"zaan" : {
			// (2 items)When you damage a nearby enemy with a Light or Heavy Attack, you have a 33% chance to create a beam of fire that will connect you to your enemy. The beam deals 46-2010 
			// Flame damage every 1 second to your enemy for 6 seconds. Every second, this damage increases by 100%. The beam is broken if the enemy moves 8 meters away from you. This effect can occur every 18 seconds.
			isAoE : false,
			isDoT : true,
			index : 2,
			items : 2,
		},
		
		"blooddrinker" : {
			ignoreAll: true,
		},
		"call of the undertaker" : {
			ignoreAll: true,
		},
		"crushing wall" : {
			// (2 items) Your Light and Heavy Attacks deal an additional 31-1353 damage to enemies in your Wall of Elements.
			ignoreAll: true,
		},
		"deadly strike" : {
			ignoreAll: true,
		},
		"dragon's appetite" : {
			ignoreAll: true,
		},
		"draugrkin's grip" : {
			ignoreAll: true,
		},
		"infallible mage" : {
			// (5 items) Your Heavy Attacks deal an additional 21-903 damage. Enemies you damage with fully-charged Heavy Attacks are afflicted with 
			// Minor Vulnerability for 10 seconds, increasing their damage taken by 8%.
			ignoreAll: true,
		},	
		"jolting arms" : {
			// (5 items) When you block an attack, you have a 50% chance to charge your arms, causing your next Bash ability to deal an additional 141-6086 and increase 
			// your Physical and Spell Resistance by 107-4620 for 6 seconds.
			ignoreAll: true,
		},
		"knight slayer" : {
			ignoreAll: true,
		},
		"queen's elegance" : {
			ignoreAll: true,
		},
		"noble duelist's silks" : {
			// (5 items) When you dodge an attack, your Light and Heavy Attacks deal an additional 28-1225 damage for 8 seconds.
			ignoreAll: true,
		},
		"perfected crushing wall" : {
			// (2 items) Your Light and Heavy Attacks deal an additional 31-1353 damage to enemies in your Wall of Elements.
			ignoreAll: true,
		},
		"perfected roaring opportunist" : {
			// (5 items) Using a Fully-Charged Heavy Attack grants you and up to 11 group members within 28 meters Major Slayer, increasing your damage done to Dungeon, Trial, and 
			// Arena Monsters by 15% for 1 second for every 8000 damage dealt. Roaring Opportunist can only affect a target every 22 seconds.
			ignoreAll: true,
		},
		"perfected stinging slashes" : {
			ignoreAll: true,
		},
		"perfected thunderous volley" : {
			ignoreAll: true,
		},
		"perfected titanic cleave" : {
			ignoreAll: true,
		},
		"roaring opportunist" : {
			// (5 items) Using a Fully-Charged Heavy Attack grants you and up to 11 group members within 28 meters Major Slayer, increasing your damage done to Dungeon, Trial, and 
			// Arena Monsters by 15% for 1 second for every 8000 damage dealt. Roaring Opportunist can only affect a target every 22 seconds.
			ignoreAll: true,
		},
		"sload's semblance" : {
			ignoreAll: true,
		},
		"stinging slashes" : {
			ignoreAll: true,
		},
		"thunderous volley" : {
			ignoreAll: true,
		},
		"titanic cleave" : {
			ignoreAll: true,
		},
		"undaunted infiltrator" : {
			// (5 items) When you use an ability that costs Magicka, your Light Attacks deal an additional 18-774 damage and Heavy Attacks deal an additional 27-1161 damage for 10 seconds.
			ignoreAll: true,
		},
		"undaunted unweaver" : {
			// (5 items) When you use an ability that costs Stamina, your Light Attacks deal an additional 18-774 damage and Heavy Attacks deal an additional 27-1161 damage for 10 seconds.
			ignoreAll: true,
		},
		"varen's legacy" : {
			// (5 items) When you block an attack, you have a 10% chance to cause your next direct damage area of effect attack to deal an additional 300-3450 damage. This bonus does not work with channeled effects.
			ignoreAll: true,
		},
};


window.EsoBuildLog = function()
{
	if (console == null) return;
	if (console.log == null) return;
	
	console.log.apply(console, arguments);
}


window.onTooltipHoverShow = function()
{
	ecdLastTooltip = $(this).find('.ecdTooltip');
	
	if (ecdLastTooltip)
	{
		ecdLastTooltip.css('display', 'inline-block');
		adjustSkillTooltipPosition(ecdLastTooltip, $(this));
	}
}


window.adjustSkillTooltipPosition = function(tooltip, parent)
{
	if (tooltip == null || tooltip[0] == null) return;
	
	var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var toolTipWidth = tooltip.width();
    var toolTipHeight = tooltip.height();
    var elementHeight = parent.height();
    var elementWidth = parent.width();
    var NARROW_WINDOW_WIDTH = 800;
     
    var top = parent.offset().top - 50;
    var left = parent.offset().left + parent.outerWidth() + 3;
        
    if (windowWidth < NARROW_WINDOW_WIDTH)
    {
    	top = parent.offset().top - 25 - toolTipHeight;
    	left = parent.offset().left - toolTipWidth/2 + elementWidth/2;
    }
    
    tooltip.offset({ top: top, left: left });
    
    var viewportTooltip = tooltip[0].getBoundingClientRect();
     
    if (viewportTooltip.bottom > windowHeight) 
    {
    	var deltaHeight = viewportTooltip.bottom - windowHeight + 10;
        top = top - deltaHeight
    }
    else if (viewportTooltip.top < 0)
    {
    	var deltaHeight = viewportTooltip.top - 10;
    	
    	if (windowWidth < NARROW_WINDOW_WIDTH) deltaHeight = -toolTipHeight - elementHeight - 30;
    	
        top = top - deltaHeight
    }
         
    if (viewportTooltip.right > windowWidth) 
    {
    	if (windowWidth < NARROW_WINDOW_WIDTH)
    		left = left + windowWidth - viewportTooltip.right - 10;
    	else
    		left = left - toolTipWidth - parent.width() - 28;
    }
     
	tooltip.offset({ top: top, left: left });    
}


window.onTooltipHoverHide = function()
{
	if (ecdLastTooltip) ecdLastTooltip.hide();
}


window.onTooltipMouseMove = function(e)
{
	if (ecdLastTooltip == null) return;
	
    var mousex = e.pageX + 20;
    var mousey = e.pageY + 20 
    
    var tipWidth  = ecdLastTooltip.width();
    var tipHeight = ecdLastTooltip.height();

    var tipVisX = $(window).width() - (mousex + tipWidth);
    var tipVisY = $(window).height() - (mousey + tipHeight);

    if ( tipVisX < 20 ) {
        mousex = e.pageX - tipWidth - 20;
    } if ( tipVisY < 20 ) {
        mousey = e.pageY - tipHeight - 20;
    }
    
    ecdLastTooltip.css({  top: mousey, left: mousex });
}


window.EsoSkillTree_LastOpenTree = null;
window.EsoSkillTree_LastOpenTreeName = null;
window.EsoSkillTree_LastSkillContentName = null;
window.EsoSkillTree_LastSkillContent = null;

window.EsoAchTree_LastOpenTree = null;
window.EsoAchTree_LastOpenTreeName = null;
window.EsoAchTree_LastContentName = null;
window.EsoAchTree_LastContent = null;


window.OnEsoSkillTreeName1Click = function(e)
{
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1.ecdSkillTreeNameHighlight').first();
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	if (EsoSkillTree_LastOpenTree.is($(this).next(".ecdSkillTreeContent1"))) return;
	EsoSkillTree_LastOpenTree.slideUp();
	EsoSkillTree_LastOpenTreeName.removeClass('ecdSkillTreeNameHighlight');
		
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
	EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
	EsoSkillTree_LastSkillContent.hide();
		
	EsoSkillTree_LastOpenTreeName = $(this);
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	EsoSkillTree_LastOpenTreeName.addClass('ecdSkillTreeNameHighlight');
	EsoSkillTree_LastOpenTree.slideDown();

	SelectEsoSkillTreeContents(EsoSkillTree_LastOpenTree.children(".ecdSkillTreeName2").first());
}


window.OnEsoSkillTreeName2Click = function(e)
{
	SelectEsoSkillTreeContents($(this));
}


window.SelectEsoSkillTreeContents = function(object)
{
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
	
	EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
	EsoSkillTree_LastSkillContent.hide();
	
	EsoSkillTree_LastSkillContentName = object;
	object.addClass('ecdSkillTreeNameHighlight2');
	
	var objText = object.contents().filter(function(){ return this.nodeType == 3;})[0].nodeValue;
	var idName = 'ecdSkill_' + objText.replace(/ /g, "").replace(/'/g, "");
	
	EsoSkillTree_LastSkillContent = $('#'+idName); 
	EsoSkillTree_LastSkillContent.show(); 
}


window.OnEsoAchievementTreeName1Click = function(e)
{
	EsoAchTree_LastOpenTreeName = $('.ecdAchTreeName1.ecdAchTreeNameHighlight').first();
	EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
	if (EsoAchTree_LastOpenTree.is($(this).next(".ecdAchTreeContent1"))) return;
	
	EsoAchTree_LastOpenTree.slideUp();
	EsoAchTree_LastOpenTreeName.removeClass('ecdAchTreeNameHighlight');
		
	EsoAchTree_LastContentName = $('.ecdAchTreeNameHighlight2').first();
	$('.ecdAchTreeNameHighlight2').removeClass("ecdAchTreeNameHighlight2");
	//EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	
	EsoAchTree_LastContent = $('.ecdAchData:visible').first();
	EsoAchTree_LastContent.hide();
		
	EsoAchTree_LastOpenTreeName = $(this);
	EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
	EsoAchTree_LastOpenTreeName.addClass('ecdAchTreeNameHighlight');
	EsoAchTree_LastOpenTree.slideDown();

	SelectEsoAchievementTreeContents(EsoAchTree_LastOpenTree.children(".ecdAchTreeName2").first());
}


window.OnEsoAchievementTreeName2Click = function(e)
{
	SelectEsoAchievementTreeContents($(this));
}


window.SelectEsoAchievementTreeContents = function(object)
{
	EsoAchTree_LastContentName = $('.ecdAchTreeNameHighlight2').first();
	EsoAchTree_LastContent = $('.ecdAchData:visible').first();
	
	//EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	$('.ecdAchTreeNameHighlight2').removeClass("ecdAchTreeNameHighlight2");
	EsoAchTree_LastContent.hide();
	
	EsoAchTree_LastContentName = object;
	object.addClass('ecdAchTreeNameHighlight2');
	
	var catName = EsoAchTree_LastOpenTreeName.attr("achcategory");
	var subCatName = EsoAchTree_LastContentName.attr("achsubcategory");
	
	var idName = "ecdAch_" + catName + "_" + subCatName;
	if (subCatName == null || subCatName == "") idName = "ecdAch_" + catName;
	
	idName = idName.replace(/ /g, "").replace(/'/g, "");
	
	EsoAchTree_LastContent = $('#'+idName); 
	EsoAchTree_LastContent.show(); 
}


window.OnEsoRightTitleClick = function(name, self)
{
	$('.ecdRightTitleButtonEnabled').addClass("ecdRightTitleButtonDisabled").removeClass("ecdRightTitleButtonEnabled");
	$('.ecdTopLevelIcon').removeClass('selected');
	
	$(self).children(".ecdTopLevelIcon").addClass('selected');
	
	var idName = "#ecd" + name;
	var idButtonName = "#ecd" + name + "Button";
	$(idButtonName).removeClass("ecdRightTitleButtonDisabled").addClass("ecdRightTitleButtonEnabled");
	
	$(".ecdRightDataArea").hide();
	
	var newContent = $(idName);
	
	CheckEsoContentForAsyncLoad(newContent, name);
	newContent.show();
	
	UpdateEsoInventoryShownSpace();
}


window.CheckEsoContentForAsyncLoad = function(element, contentId)
{
	var asyncLoadElement = $(element).children(".ecdAsyncLoad");
	
	if (asyncLoadElement.length < 1) return false;
	
		/* Load inventory JSON data if required */
	if ($.isEmptyObject(ecdAllInventory) && (contentId == "Inventory" || contentId == "Bank" || contentId == "Craft" || contentId == "AccountInv"))
	{
		var queryParams = {}
		
		queryParams['content'] = "AllInventoryJS";
		queryParams['id'] = ecdCharacterId;
		
		$.ajax("//esochars.uesp.net/loadCharDataContents.php", {
				data: queryParams,
			}).
			done(function(data, status, xhr) { OnEsoCharDataJsonRequest(data, "AllInventoryJS", status, xhr); }).
			fail(function(xhr, status, errorMsg) { OnEsoCharDataJsonError(xhr, "AllInventoryJS", status, errorMsg); });
	}
	
	var queryParams = {}
	
	queryParams['content'] = contentId;
	queryParams['id'] = ecdCharacterId;
	
	
	
	$.ajax("//esochars.uesp.net/loadCharDataContents.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoCharDataContentRequest(data, contentId, asyncLoadElement, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoCharDataContentError(xhr, contentId, asyncLoadElement, status, errorMsg); });
	
	return true;
}


window.OnEsoCharDataContentRequest = function(data, contentId, element, status, xhr)
{
	var parent = $(element).parent();
	
	$(element).replaceWith(data);
	AddEsoCharDataAsyncHandlers(parent);
}


window.OnEsoCharDataContentError = function(xhr, contentId, element, status, errorMsg)
{
	EsoBuildLog("Error requesting char data content '" + contentId + "'!", errorMsg);
}


window.OnEsoCharDataJsonRequest = function(data, contentId, status, xhr)
{
	if (contentId == "AllInventoryJS") ecdAllInventory = data;	
}


window.OnEsoCharDataJsonError = function(xhr, contentId, status, errorMsg)
{
	EsoBuildLog("Error requesting char data JSON '" + contentId + "'!", errorMsg);
}
	

window.OnItemFilter = function(name)
{
	$('.ecdItemFilterContainer').removeClass("selected");
	
	var idName = ".ecdItemFilter" + name;
	$(idName).addClass("selected");
	
	var displayName = name.toUpperCase();
	
	if (displayName == "ARMOR")
		displayName = "APPAREL";
	else if (displayName == "MATERIAL")
		displayName = "MATERIALS";	
	else if (displayName == "MISC")
		displayName = "MISC";
	
	$(".ecdItemFilterTextLabel").text(displayName);
	
	g_EsoCharLastItemFilter = null;
	
	DoItemFilter();
}


window.ItemFilter_All = function(item)
{
	return true;
}


window.ItemFilter_Armor = function(item)
{
	return item.type == 2 || (item.type == 1 && item.weaponType == 14);
}


window.ItemFilter_Weapon = function(item)
{
	return item.type == 1 && item.weaponType != 14;
}


window.ItemFilter_Consumable = function(item)
{
	return item.consumable != 0 && (
		item.type ==  7 || item.type ==  4 || item.type ==  9 || item.type == 12 || item.type == 29 || item.type == 55 || 
		item.type == 57 || item.type == 30 || item.type == 18 || item.type ==  5 || item.type == 47 || item.type ==  6 ||
		item.type == 18 || item.type ==  8 || item.type == 54 || item.type == 58);
}


window.ItemFilter_Material = function(item)
{
	return item.type == 10 || item.type == 44 || item.type == 53 || item.type == 45 || item.type == 33 || item.type == 31 || 
           item.type == 39 || item.type == 37 || item.type == 35 || item.type == 38 || item.type == 40 || item.type == 52 ||
           item.type == 36 || item.type == 51 || item.type == 17 || item.type == 42 || item.type == 46 || item.type == 41 ||
           item.type == 17 || item.type == 43;
}


window.ItemFilter_Misc = function(item)
{
	return item.type == 56 || item.type == 48 || item.type == 19 || item.type == 9 || item.type == 29 || item.type == 55 || 
           item.type == 57 || item.type == 30 || item.type == 18 || item.type == 5 || item.type == 47 || item.type ==  6 ||
           item.type == 26 || item.type == 21 || item.type == 20;
}


window.ItemFilter_Quest = function(item)
{
	//TODO
	return false;
}


window.ItemFilter_Junk = function(item)
{
	return item.junk != 0;
}


window.ITEM_FILTER_FUNCTIONS = {
		"ALL" 			: ItemFilter_All,
		"WEAPON" 		: ItemFilter_Weapon,
		"ARMOR" 		: ItemFilter_Armor,
		"CONSUMABLE" 	: ItemFilter_Consumable,
		"MATERIAL" 		: ItemFilter_Material,
		"MISC" 			: ItemFilter_Misc,
		"QUEST" 		: ItemFilter_Quest,
		"JUNK" 			: ItemFilter_Junk,
}


window.MatchFilterString = function(filterText, item)
{
	if (filterText == "") return true;
	
	if (item.nameLC.indexOf(filterText) != -1) return true;
	if (item.setNameLC.indexOf(filterText) != -1) return true;
	
	return false;	
}


window.g_EsoCharLastItemFilter = null;
window.ESO_ITEMFILTER_UPDATEMS = 400;
window.g_EsoItemFilterIsUpdating = false;


window.DoItemFilter = function()
{
	var filterName = $(".ecdItemFilterContainer.selected").attr('itemfilter').toUpperCase();
	var filterText = $(".ecdItemFilterTextInput:visible").val().toLowerCase();
	var filterFunc = ITEM_FILTER_FUNCTIONS[filterName];
	
	g_EsoItemFilterIsUpdating = false;
	if (filterFunc == null) filterFunc = ItemFilter_All;
	
	if (filterText == g_EsoCharLastItemFilter) return;
	g_EsoCharLastItemFilter = filterText;
	
	$(".ecdScrollContent tr").each(function() {
			var localId = $(this).attr('localid');
			var item = ecdAllInventory[localId];
			
			if (item == null)
			{
				$(this).show();
				return;
			}
			
			if (!filterFunc(item)) {
				$(this).hide();
				return;
			}
			
			if (!MatchFilterString(filterText, item))
			{
				$(this).hide();
				return;
			}
				
			$(this).show();
		});	
	
	UpdateEsoInventoryShownSpace();
}


window.ESO_ITEMFILTER_UPDATE_MINTIME = 0.4;
window.g_EsoCharUpdateItemFilterFlag = false;
window.g_EsoCharUpdateItemLastRequest = 0;


window.UpdateItemFilter = function()
{
	g_EsoCharUpdateItemFilterFlag = true;
	g_EsoCharUpdateItemLastRequest = (new Date().getTime())/1000;
	
	setTimeout(CheckEsoCharUpdateItemFilter, ESO_ITEMFILTER_UPDATE_MINTIME*501);
}


window.CheckEsoCharUpdateItemFilter = function()
{
	if (!g_EsoCharUpdateItemFilterFlag) return;
	
	var currentTime = (new Date().getTime())/1000;
	
	if (currentTime - g_EsoCharUpdateItemLastRequest > ESO_ITEMFILTER_UPDATE_MINTIME)
	{
		g_EsoCharUpdateItemFilterFlag = false;
		DoItemFilter();
	}
	else
	{
		setTimeout(CheckEsoCharUpdateItemFilter, ESO_ITEMFILTER_UPDATE_MINTIME*501);
	}
}


window.copyToClipboard = function(self)
{
	var textToCopy = $(self).text();
	copyTextToClipboard(textToCopy);
}


window.OnBuildTableAnchorClick = function(e)
{
	e.stopPropagation();
}


window.OnBuildTableRowClick = function(e)
{
	var anchor = $(this).parent().find(".ecdBuildLink");
	if (anchor.length == 0) return;
	
	window.location.href = anchor.attr("href");
}


window.copyTextToClipboard = function(textToCopy)
{
	$("body")
		.append($('<input type="text" name="fname" class="textToCopyInput" style="opacity: 0; position: absolute;" />' )
				.val(textToCopy))
		.find(".textToCopyInput")
		.select();
	
	try 
	{
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
    }
	catch (err) 
    {
    	window.prompt("To copy the text to clipboard: Ctrl+C, Enter", textToCopy);
    }
	
	$(".textToCopyInput").remove();
}


window.UpdateBuildStatData = function(barIndex)
{
	var prefix = "Computed:Bar" + barIndex + ":";
	
	if (barIndex == null || barIndex == "") prefix = "Computed:";
		
	if (window.g_EsoBuildLastInputValues == null) return;
	if (window.g_EsoBuildStatData == null) return;
	
	for (var stat in g_EsoBuildStatData)
	{
		var value = g_EsoBuildStatData[stat];
		
		if (!stat.startsWith(prefix)) continue;
		
		stat = stat.substring(prefix.length);
		g_EsoBuildLastInputValues[stat] = +value;
	}
	
	g_EsoBuildLastInputValues.HealingDone /= 100;
	g_EsoBuildLastInputValues.DamageShield /= 100;
	g_EsoBuildLastInputValues.DamageDone /= 100;
	g_EsoBuildLastInputValues.MagicDamageDone /= 100;
	g_EsoBuildLastInputValues.PhysicalDamageDone /= 100;
	g_EsoBuildLastInputValues.ShockDamageDone /= 100;
	g_EsoBuildLastInputValues.FlameDamageDone /= 100;
	g_EsoBuildLastInputValues.FrostDamageDone /= 100;
	g_EsoBuildLastInputValues.PoisonDamageDone /= 100;
	g_EsoBuildLastInputValues.DiseaseDamageDone /= 100;
	g_EsoBuildLastInputValues.SingleTargetDamageDone /= 100;
	g_EsoBuildLastInputValues.DotDamageDone /= 100;
	g_EsoBuildLastInputValues.AOEDamageDone /= 100;
	g_EsoBuildLastInputValues.DirectDamageDone /= 100;
	g_EsoBuildLastInputValues.BleedDamage /= 100;
	g_EsoBuildLastInputValues.PetDamageDone /= 100;
}


window.ActivateBuildActionBar = function(barIndex)
{
	if (barIndex < 1 || barIndex > 4) return;
	
	var activeBar = $(".ecdActionBar" + barIndex);
	var weaponBarIndex = activeBar.attr("activeweaponbar");
	
	$("#ecdActionBar .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
	activeBar.addClass("ecdActiveAbilityBar");
	
	if (weaponBarIndex >= 1 && weaponBarIndex <= 2)
	{
		$("#ecdEquipSlots .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
		$("#ecdWeaponBar" + weaponBarIndex).addClass("ecdActiveAbilityBar");
	}
	
	$(".ecdStatBar").hide();
	$(".ecdStatBar1").hide();
	$(".ecdStatBar2").hide();
	$(".ecdStatBar3").hide();
	$(".ecdStatBar4").hide();
	
	$(".ecdStatBar" + barIndex).show();
	
	UpdateBuildStatData(barIndex);
	
	if (barIndex >= 1 && barIndex <= 2)
	{
		$("#ecdEquipSlots .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
		$("#ecdWeaponBar" + barIndex).addClass("ecdActiveAbilityBar");
	}
	
}


window.OnBuildWeaponBar1Click = function(e)
{
	ActivateBuildActionBar(1);
}


window.OnBuildWeaponBar2Click = function(e)
{
	ActivateBuildActionBar(2);
}


window.OnBuildActionBar1Click = function(e)
{
	ActivateBuildActionBar(1);
}


window.OnBuildActionBar2Click = function(e)
{
	ActivateBuildActionBar(2);
}


window.OnBuildActionBar3Click = function(e)
{
	ActivateBuildActionBar(3);
}


window.OnBuildActionBar4Click = function(e)
{
	ActivateBuildActionBar(4);
}


window.ecdItemOwnerWindow = null;


window.CreateItemOwnerWindow = function()
{
	if (ecdItemOwnerWindow != null) return;
	
	ecdItemOwnerWindow = $("<div/>")
							.addClass("ecdItemOwnerWindow")
							.attr('id', 'ecdItemOwnerWindow')
							.hide()
							.appendTo("body");
	
	ecdItemOwnerWindow.html("<div class='ecdItemOwnerTitle'>Characters With Item</div><hr><div id='ecdItemOwnerData' class='ecdItemOwnerData'></div>");
}


window.CreateItemOwnerHtml = function(itemData)
{
	var output = "";
	var summaryData = {};
	
	for (var i = 0; i < itemData.characterIds.length; ++i)
	{
		var qnt = itemData.characterQnts[i];
		var charId = itemData.characterIds[i];
		
		if (summaryData[charId] == null)
			summaryData[charId] = qnt;
		else
			summaryData[charId] += qnt;
	}
	
	for (var charId in summaryData) 
	{
		var qnt = summaryData[charId];
		
		var name = ecdCharacterNames[charId];
		if (name == null) name = "" + charId;
		
		output += "<div class='ecdItemDataQnt'>" + qnt + "</div>";
		output += "<div class='ecdItemDataName'>" + name + "</div>";
		output += "<br/>\n";
	}
	
	return output;
}


window.ShowItemOwnerWindow = function(element, itemData)
{
	CreateItemOwnerWindow();
	
	ecdItemOwnerWindow.find('#ecdItemOwnerData').html(CreateItemOwnerHtml(itemData));
	ecdItemOwnerWindow.show();
	
	var top = element.offset().top + 30;
    var left = element.offset().left + 350;
    
    ecdItemOwnerWindow.offset({ top: top, left: left });
}


window.OnItemRowClick = function(e)
{
	
	var localId = $(this).attr("localid");
	if (localId == null) return;
	
	var itemData = ecdAllInventory[localId];
	if (itemData == null) return;
	
	ShowItemOwnerWindow($(this), itemData);
}


window.OnItemRowLeave = function(e)
{
	if (ecdItemOwnerWindow) ecdItemOwnerWindow.hide();
}


window.DoesEsoItemLinkHaveEvent = function()
{
	if (ShowEsoItemLinkPopup != null) return true; 
	
	//var events = $._data($(".eso_item_link").get(0), 'events');
	//if (events['mouseover'] != null || events['mouseout'] != null) return true;
	
	return false;
}


window.OnSlideAchievementComplete = function()
{
	SlideAchievementIntoView($(this).parent());
}


window.SlideAchievementIntoView = function(element, instant)
{
	var offsetTop = element.position().top;
	var parent = element.parent(".ecdAchData");
	var nextTop = offsetTop + element.height() + 25;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


window.OnAchievementClick = function()
{
	var dataBlock = $(this).children(".ecdAchDataBlock");
	dataBlock.slideToggle(400, OnSlideAchievementComplete);
	
	if (dataBlock.length == 0) SlideAchievementIntoView($(this));
}


window.lastAchSearchText = "";
window.lastAchSearchPos = -1;
window.lastAchSearchElement = null;


window.OnFindEsoCharAchievement = function(element)
{
	var text = $("#ecdFindAchInput").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastAchSearchText)
	{
		lastAchSearchText = text;
		lastAchSearchPos = -1;
		lastAchSearchElement = null;
	}
	
	FindEsoCharNextAchievement();
}


window.FindEsoCharNextAchievement = function()
{
	var isFound = false;
	
	$(".ecdAchSearchHighlight").removeClass("ecdAchSearchHighlight");
		
	$(".ecdAchName, .ecdAchDesc, .ecdAchReward, .ecdAchCriteria, .ecdAchListItem img").each(function(index) {
		if (index <= lastAchSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
		var title = $this.attr("title");
		if (title == null) title = "";
		title = title.toLowerCase();
		
		lastAchSearchPos = index;
		
		if (text.indexOf(lastAchSearchText) >= 0 || title.indexOf(lastAchSearchText) >= 0) 
		{
			var achievement = $this.closest(".ecdAchievement1");
			if (lastAchSearchElement != null && achievement.is(lastAchSearchElement)) return true;
			
			lastAchSearchElement = achievement;
			SelectFoundAchievement($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastAchSearchText = "";
		lastAchSearchPos = -1;
		lastAchSearchElement = null;
		$(".ecdFindAchTextBox button").text("Done!");
	}
	else
	{
		$(".ecdFindAchTextBox button").text("Find Next");
	}
}


window.SelectFoundAchievement = function(element)
{
	var achievement = $(element).closest(".ecdAchievement1");
	var parent = $(element).closest(".ecdAchData");
	var parentId = parent.attr("id");
	var catData = parentId.split("_");
	var catName = catData[1];
	var subCatName = catData[2];
	var currentCat = $(".ecdAchTreeNameHighlight").attr("achcategory");
	var currentSubCat = $(".ecdAchTreeNameHighlight2").attr("achsubcategory");
	
	if (currentCat != catName)
	{
		$(".ecdAchTreeContent1:visible").slideUp();
		$(".ecdAchTreeNameHighlight").removeClass("ecdAchTreeNameHighlight");
		
		EsoAchTree_LastOpenTreeName = $(".ecdAchTreeName1[achcategory='" + catName + "']");
		EsoAchTree_LastOpenTreeName.addClass("ecdAchTreeNameHighlight");
		
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
		EsoAchTree_LastOpenTree.slideDown();

		currentSubCat = "";
	}
	
	if (currentSubCat != subCatName)
	{
		$(".ecdAchTreeNameHighlight2").removeClass("ecdAchTreeNameHighlight2");
		
		EsoAchTree_LastOpenTreeName = $(".ecdAchTreeNameHighlight");
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
		
		EsoAchTree_LastContentName = $(".ecdAchTreeName2[achsubcategory='" + subCatName + "']");
		EsoAchTree_LastContentName.addClass('ecdAchTreeNameHighlight2');
	}
	
	$(".ecdAchData:visible").hide();
	EsoAchTree_LastContent = parent;
	parent.show();
	
	achievement.addClass("ecdAchSearchHighlight");
	var dataBlock = achievement.children(".ecdAchDataBlock");
	if (dataBlock.length > 0) dataBlock.slideDown(0, OnSlideAchievementComplete);
	
	SlideAchievementIntoView(achievement, true);
}


window.lastRecipeSearchText = "";
window.lastRecipeSearchPos = -1;
window.lastRecipeSearchElement = null;


window.OnEsoCharDataSearchRecipe = function(event)
{
	var searchText = $("#ecdSkillRecipesSearchInput").val().trim().toLowerCase();
	if (searchText == "") return;
	
	if (searchText != lastRecipeSearchText)
	{
		lastRecipeSearchText = searchText;
		lastRecipeSearchPos = -1;
		lastRecipeSearchElement = null;
	}
	
	FindEsoCharNextRecipe();
}



window.FindEsoCharNextRecipe = function()
{
	var isFound = false;
	
	$(".ecdRecipeSearchHighlight").removeClass("ecdRecipeSearchHighlight");
		
	$(".ecdRecipeItem").each(function(index) {
		
		if (index <= lastRecipeSearchPos) return true;
		
		var $this = $(this);
		var text = $this.text().toLowerCase();
		
		lastRecipeSearchPos = index;
		
		if (text.indexOf(lastRecipeSearchText) >= 0) 
		{
			if (lastRecipeSearchElement != null && $this.is(lastRecipeSearchElement)) return true;
			
			lastRecipeSearchElement = $this;
			SelectFoundEsoCharRecipe($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastRecipeSearchText = "";
		lastRecipeSearchPos = -1;
		lastRecipeSearchElement = null;
		$("#ecdSkillRecipesSearchBlock button").text("Done!");
	}
	else
	{
		$("#ecdSkillRecipesSearchBlock button").text("Next...");
	}
}


window.SelectFoundEsoCharRecipe = function(element, instant)
{
	element.addClass("ecdRecipeSearchHighlight");
	
	var offsetTop = element.position().top;
	var parentList = element.parent(".ecdRecipeList");
	var parent = parentList.parent("#ecdSkill_Recipes");
	var nextTop = offsetTop + element.height() + 25;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (!parentList.is(":visible"))
	{
		SetRecipeTitleArrow(parentList.prev(".ecdRecipeTitle"), true);
		parentList.show(0, function() { SelectFoundEsoCharRecipe(element, instant); });
		return;
	}
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


window.OnEsoRecipeScroll = function(event)
{
	$("#ecdSkillRecipesSearchBlock").css('top', $("#ecdSkill_Recipes").scrollTop());
}


window.UpdateEsoInventoryShownSpace = function()
{
	$(".ecdInvShowSpaceLabel").text("");
	
	setTimeout(UpdateEsoInventoryShownSpace_Async, 100);
}


window.UpdateEsoInventoryShownSpace_Async = function()
{	
	var shownItems = $(".ecdItemTable tr.eso_item_link:visible");
	var numItems = 0;
	var totalItems = 0;
	
	numItems = shownItems.length;
	//$(".ecdInvShowSpaceLabel").text("" + numItems + " shown");
	//return;
	
	shownItems.each(function() {
		var itemIndex = parseInt($(this).attr("localid"));
		var itemData = ecdAllInventory[itemIndex];
		if (itemData == null) return true;
		
		if (itemData.qnt == null)
			totalItems += 1;
		else
			totalItems += parseInt(itemData.qnt);
		
		return true;		
	});
	
	if (numItems == totalItems)
		$(".ecdInvShowSpaceLabel").text("" + numItems + " shown");
	else
		$(".ecdInvShowSpaceLabel").text("" + numItems + " shown (" + totalItems + " total)");
}


window.OnRecipeTitleClick = function(e)
{
	var recipeList = $(this).next(".ecdRecipeList");

	SetRecipeTitleArrow(this, !recipeList.is(":visible"));
	
	recipeList.slideToggle();
}


window.SetRecipeTitleArrow = function(element, visible)
{
	var recipeArrow = $(element).children(".ecdRecipeTitleArrow");
	
	if (visible)
		recipeArrow.html("&#9650");
	else
		recipeArrow.html("&#9660");
	
}


window.OnQuestZoneTitleClick = function(e)
{
	var lastOpenQuestZone = $(".ecdQuestZoneTitle.ecdQuestSelected").first();
	if (lastOpenQuestZone.is($(this))) return;
	
	lastOpenQuestZone.removeClass("ecdQuestSelected");
	lastOpenQuestZone.next(".ecdQuestZoneList").slideUp();
	
	$(this).addClass("ecdQuestSelected");
	var questList = $(this).next(".ecdQuestZoneList");
	
	questList.slideDown();
	
	$(".ecdQuestName.ecdQuestSelected").removeClass("ecdQuestSelected");
	
	var firstQuest = questList.children(".ecdQuestName").first();
	firstQuest.addClass('ecdQuestSelected');
	
	var journalIndex = firstQuest.attr("journalindex");
	
	if (journalIndex != null )
	{
		$(".ecdQuestDetail:visible").hide(0);
		$("#ecdQuestJournal" + journalIndex).show(0);
	}
}


window.OnQuestZoneTitle1Click = function(e)
{
	var questList = $(this).next(".ecdQuestZoneList1");
	questList.slideToggle();
}


window.OnQuestNameClick = function(e)
{
	var lastOpenQuest = $(".ecdQuestName.ecdQuestSelected").first();
	if (lastOpenQuest.is($(this))) return;
	
	lastOpenQuest.removeClass("ecdQuestSelected");
	
	$(this).addClass("ecdQuestSelected");
	
	var journalIndex = $(this).attr("journalindex");
	
	if (journalIndex != null)
	{
		$(".ecdQuestDetail:visible").hide(0);
		$("#ecdQuestJournal" + journalIndex).show(0);
	}
}


window.UpdateFirstQuestDetails = function()
{
	var firstQuest = $(".ecdQuestZoneTitle.ecdQuestSelected").next(".ecdQuestZoneList").children(".ecdQuestName").first()[0];
	
	if (firstQuest) OnQuestNameClick.call(firstQuest, null);
}


window.lastEsoAllQuestSearchText = "";
window.lastEsoAllQuestSearchPos = -1;
window.lastEsoAllQuestSearchElement = null;


window.OnEsoCharDataSearchAllQuests = function()
{
	var text = $("#ecdQuestAllSearchText").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastEsoAllQuestSearchText)
	{
		lastEsoAllQuestSearchText = text;
		lastEsoAllQuestSearchPos = -1;
		lastEsoAllQuestSearchElement = null;
	}
	
	FindEsoCharNextAllQuest();
}


window.FindEsoCharNextAllQuest = function()
{
	var isFound = false;
	
	$(".ecdQuestSearchHighlight").removeClass("ecdQuestSearchHighlight");
		
	$("#ecdQuestJournalAll .ecdQuestName1").each(function(index) {
		if (index <= lastEsoAllQuestSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
				
		lastEsoAllQuestSearchPos = index;
		
		if (text.indexOf(lastEsoAllQuestSearchText) >= 0) 
		{
			if (lastEsoAllQuestSearchElement != null && $this.is(lastEsoAllQuestSearchElement)) return true;
			
			lastEsoAllQuestSearchElement = $this;
			SelectFoundEsoAllQuest($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastEsoAllQuestSearchText = "";
		lastEsoAllQuestSearchPos = -1;
		lastEsoAllQuestSearchElement = null;
		$("#ecdQuestAllSearchForm button").text("Done!");
	}
	else
	{
		$("#ecdQuestAllSearchForm button").text("Find Next");
	}
}


window.SelectFoundEsoAllQuest = function(quest)
{
	var questList = $(quest).parent(".ecdQuestZoneList1");
	
	if (!questList.is(":visible")) questList.show(0);
	
	quest.addClass("ecdQuestSearchHighlight");
	
	SlideEsoQuestIntoView(quest, true);
}


window.SlideEsoQuestIntoView = function(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parents(".ecdQuestDetail");
	var nextTop = offsetTop + element.height() + 225;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


window.OnEsoBookCollectionClick = function(e)
{
	var categoryIndex = $(this).attr("categoryindex");
	var collectionIndex = $(this).attr("collectionindex");
	
	$(".ecdBookList:visible").hide(0);
	$("#ecdBookList_"+categoryIndex+"_"+collectionIndex).show(0);
	
	$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
	$(this).addClass("ecdBookCollectionSelected");
}


window.OnEsoBookCategoryClick = function(e)
{
	var currentCategory = $(".ecdBookCategorySelected").first();
	if ($(this).is(currentCategory)) return;
	
	currentCategory.removeClass("ecdBookCategorySelected");
	$(".ecdBookCollectionList:visible").slideUp();
	
	$(this).addClass('ecdBookCategorySelected');
	
	var nextList = $(this).next(".ecdBookCollectionList");
	var firstBook = nextList.children(".ecdBookCollection").first();
	
	nextList.slideDown();
	
	var categoryIndex = firstBook.attr("categoryindex");
	var collectionIndex = firstBook.attr("collectionindex");
	
	$(".ecdBookList:visible").hide(0);
	$("#ecdBookList_"+categoryIndex+"_"+collectionIndex).show(0);
	
	$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
	firstBook.addClass("ecdBookCollectionSelected");	
}


window.OnEsoCharDataSearchBooks = function()
{
	var text = $("#ecdBookSearchText").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastEsoBookSearchText)
	{
		lastEsoBookSearchText = text;
		lastEsoBookSearchPos = -1;
		lastEsoBookSearchElement = null;
	}
	
	FindEsoCharNextBook();
}


window.FindEsoCharNextBook = function()
{
	var isFound = false;
	
	$(".ecdBookSearchHighlight").removeClass("ecdBookSearchHighlight");
		
	$(".ecdBookLine").each(function(index) {
		if (index <= lastEsoBookSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
				
		lastEsoBookSearchPos = index;
		
		if (text.indexOf(lastEsoBookSearchText) >= 0) 
		{
			if (lastEsoBookSearchElement != null && $this.is(lastEsoBookSearchElement)) return true;
			
			lastEsoBookSearchElement = $this;
			SelectFoundEsoBook($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastEsoBookSearchText = "";
		lastEsoBookSearchPos = -1;
		lastEsoBookSearchElement = null;
		$("#ecdBookSearchForm button").text("Done!");
	}
	else
	{
		$("#ecdBookSearchForm button").text("Find Next");
	}
}


window.SelectFoundEsoBook = function(book)
{
	var bookList = $(book).parent(".ecdBookList");
	
	if (!bookList.is(":visible")) 
	{
		$(".ecdBookList:visible").hide(0);
		bookList.show(0);
		
		var categoryIndex = bookList.attr("categoryindex");
		var collectionIndex = bookList.attr("collectionindex");
		
		$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
		
		var collection = $(".ecdBookCollection[categoryindex='" + categoryIndex + "'][collectionindex='" + collectionIndex + "']");
		var collectionList = collection.parent(".ecdBookCollectionList");
		collection.addClass("ecdBookCollectionSelected");
		
		if (!collectionList.is(":visible"))
		{
			var currentCategory = $(".ecdBookCategorySelected").first();
			var newCategory = collectionList.prev(".ecdBookCategory");
			
			currentCategory.removeClass("ecdBookCategorySelected");
			newCategory.addClass("ecdBookCategorySelected");
			
			$(".ecdBookCollectionList:visible").hide(0);
			collectionList.show(0);
		}
		
		SlideEsoBookCollectionIntoView(collection, true);
	}
	
	book.addClass("ecdBookSearchHighlight");
	
	SlideEsoBookIntoView(book, true);
}


window.SlideEsoBookIntoView = function(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parent(".ecdBookList");
	var nextTop = offsetTop + element.height() + 225;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


window.SlideEsoBookCollectionIntoView = function(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parents(".ecdBookTree");
	var nextTop = offsetTop + element.height() + 225;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


window.OnEsoBookClick = function(e)
{
	var queryParams = {}
	var bookId = $(this).attr("bookid");
	
	queryParams['table'] = 'book';
	queryParams['id'] = bookId;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoBookDataRequest(data, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoBookDataError(xhr, status, errorMsg); });
	
	return true;
}


window.OnEsoBookDataRequest = function(data, status, xhr)
{
	ShowEsoBook(data.book[0]);
}


window.OnEsoBookDataError = function(xhr, status, errorMsg)
{
	EsoBuildLog("Error requesting book data!", errorMsg);
}


window.ShowEsoBook = function(book)
{
	var bookRoot = $("#ecdBookRoot");
	var bookContents = $("#ecdBookContents");
	var output = "";
	
	bookRoot.show(0);
	
	$(document).on("click.OnEsoBookClickDocument", OnEsoBookClickDocument);
	
	output += "<div class='ecdBookTitle'>" + book.title + "</div>";
	output += "<div class='ecdBookBody'>" + book.body + "</div>";
	
	bookContents.html(output);
}


window.OnEsoBookCloseClick = function()
{
	var bookRoot = $("#ecdBookRoot");
	bookRoot.hide(0);
}


window.OnEsoBookClickDocument = function()
{
	var bookRoot = $("#ecdBookRoot");
	bookRoot.hide(0);
	$(document).off("click.OnEsoBookClickDocument");
}


window.OnEsoCategoryCollectibleClick = function()
{
	var lastCategory = $(".ecdCollectibleCategorySelected").first();
	if ($(this).is(lastCategory)) return;
	
	lastCategory.removeClass('ecdCollectibleCategorySelected');
	$(this).addClass('ecdCollectibleCategorySelected');
	
	$(".ecdCollectibleSubcategories:visible").slideUp();
	
	var subCategoryList = $(this).next(".ecdCollectibleSubcategories");
	if (subCategoryList.text() != "") subCategoryList.slideDown();
	
	$(".ecdCollectibleBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = 0;
	var collectibleBlock = 	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex);
	
	if (collectibleBlock.length > 0)
	{
		collectibleBlock.show(0);
		return;
	}
	
	var firstSubcategory = $(this).next(".ecdCollectibleSubcategories").children(".ecdCollectibleSubcategory").first();
	
	$(".ecdCollectibleSubcategorySelected").removeClass('ecdCollectibleSubcategorySelected');
	firstSubcategory.addClass('ecdCollectibleSubcategorySelected');
	
	categoryIndex = firstSubcategory.attr('categoryindex');
	subCategoryIndex = firstSubcategory.attr('subcategoryindex');
	
	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


window.OnEsoSubcategoryCollectibleClick = function()
{
	var lastSubcategory = $(".ecdCollectibleSubcategorySelected").first();
	if ($(this).is(lastSubcategory)) return;
	
	lastSubcategory.removeClass('ecdCollectibleSubcategorySelected');
	
	$(this).addClass('ecdCollectibleSubcategorySelected');
	
	$(".ecdCollectibleBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = $(this).attr('subcategoryindex');
	
	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


window.OnEsoCollectionsMenuItemClick = function()
{
	var collectible = $(this).attr("collectid");
	var title = $(this).attr("title");
	
	$(".ecdCollectMenuItemSelected").removeClass("ecdCollectMenuItemSelected");
	$(this).addClass("ecdCollectMenuItemSelected");
	
	$("#ecdCollectMenuTitle").text(title.toUpperCase());
	
	$(".ecdCollectContents:visible").hide(0);
	$("#ecdCollectContents_"+collectible).show(0);
}


window.OnEsoCategoryOutfitClick = function()
{
	var lastCategory = $(".ecdOutfitCategorySelected").first();
	if ($(this).is(lastCategory)) return;
	
	lastCategory.removeClass('ecdOutfitCategorySelected');
	$(this).addClass('ecdOutfitCategorySelected');
	
	$(".ecdOutfitSubcategories:visible").slideUp();
	
	var subCategoryList = $(this).next(".ecdOutfitSubcategories");
	if (subCategoryList.text() != "") subCategoryList.slideDown();
	
	$(".ecdOutfitBlock:visible").hide(0);
		
	var firstSubcategory = $(this).next(".ecdOutfitSubcategories").children(".ecdOutfitSubcategory").first();
	
	$(".ecdOutfitSubcategorySelected").removeClass('ecdOutfitSubcategorySelected');
	firstSubcategory.addClass('ecdOutfitSubcategorySelected');
	
	var categoryIndex = firstSubcategory.attr('categoryindex');
	var subCategoryIndex = firstSubcategory.attr('subcategoryindex');
	
	$("#ecdOutfit_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


window.OnEsoSubcategoryOutfitClick = function()
{
	var lastSubcategory = $(".ecdOutfitSubcategorySelected").first();
	if ($(this).is(lastSubcategory)) return;
	
	lastSubcategory.removeClass('ecdOutfitSubcategorySelected');
	
	$(this).addClass('ecdOutfitSubcategorySelected');
	
	$(".ecdOutfitBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = $(this).attr('subcategoryindex');
	
	$("#ecdOutfit_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


window.AddEsoCharDataAsyncHandlers = function(parent)
{
	var $parent = $(parent);
	
	if ($parent.find('.ecdAchTreeName1').length > 0)
	{
		$parent.find('.ecdAchTreeName1').click(OnEsoAchievementTreeName1Click);
		$parent.find('.ecdAchTreeName2').click(OnEsoAchievementTreeName2Click);
	
		EsoAchTree_LastOpenTreeName = $parent.find('.ecdAchTreeName1:visible').first();
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
		EsoAchTree_LastContentName = $parent.find('.ecdAchTreeNameHighlight2').first();
		EsoAchTree_LastContent = $parent.find('.ecdAchData:visible').first();
	}
	
	$parent.find(".ecdSelectAchievement1").click(OnAchievementClick);
	
	var tables = $parent.find(".tablesorter");
	
	if (tables.tablesorter)
	{
		$parent.find(".tablesorter").tablesorter({
			sortList: [[2,0]] 
		});
	}
	
	$parent.find(".ecdItemFilterTextInput").keyup(function() {
		UpdateItemFilter();
		return true;
	});

	$parent.find(".ecdItemFilterTextInput").blur(function() {
			$(".ecdItemFilterTextInput").val(this.value);
			return true;
		});
	
	$parent.find('.ecdClickToCopy').click(function() {
			copyToClipboard(this);
		});
	
	$parent.find('.ecdClickToCopyTooltip').click(function() {
			var text = $(this).attr('tooltip');
			copyTextToClipboard(text);
		});
	
	$parent.find(".ecdScrollContent tr").click(OnItemRowClick);
	$parent.find(".ecdScrollContent tr").mouseleave(OnItemRowLeave);
		
	$parent.find(".ecdQuestZoneTitle").click(OnQuestZoneTitleClick);
	$parent.find(".ecdQuestZoneTitle1").click(OnQuestZoneTitle1Click);
	$parent.find(".ecdQuestName ").click(OnQuestNameClick);
	
	$parent.find("#ecdFindAchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnFindEsoCharAchievement();
		else
			$(".ecdFindAchTextBox button").text("Find...");
	});
	
	$parent.find("#ecdSkillRecipesSearchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchRecipe();
		else
			$("#ecdSkillRecipesSearchBlock button").text("Find...");
	});
	
	$parent.find("#ecdQuestAllSearchText").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchAllQuests();
		else
			$("#ecdQuestAllSearchForm button").text("Find...");
	});
	
	$parent.find("#ecdBookSearchText").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchBooks();
		else
			$("#ecdBookSearchForm button").text("Find...");
	});	
	
	$parent.find("#ecdSkill_Recipes").on("scroll", OnEsoRecipeScroll);
	
	$parent.find(".ecdRecipeTitle").click(OnRecipeTitleClick);
	
	$parent.find(".ecdBookCollection").click(OnEsoBookCollectionClick);
	$parent.find(".ecdBookCategory").click(OnEsoBookCategoryClick);
	$parent.find(".ecdBookLine").click(OnEsoBookClick);
	$parent.find(".ecdBookClose").click(OnEsoBookCloseClick);
	
	$parent.find(".ecdCollectibleCategory").click(OnEsoCategoryCollectibleClick);
	$parent.find(".ecdCollectibleSubcategory").click(OnEsoSubcategoryCollectibleClick);
	$parent.find(".ecdCollectMenuItem").click(OnEsoCollectionsMenuItemClick);
	
	$parent.find(".ecdOutfitCategory").click(OnEsoCategoryOutfitClick);
	$parent.find(".ecdOutfitSubcategory").click(OnEsoSubcategoryOutfitClick);
	
	$parent.find(".ecdBookCategory").first().trigger("click");
	$parent.find(".ecdCollectibleCategory").first().trigger("click");
	$parent.find(".ecdQuestZoneTitle").first().trigger("click");
		 	
	if (!DoesEsoItemLinkHaveEvent() || !$parent.is($(document))) $parent.find('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
}


window.FormatEsoTimeLeft = function(timeLeft)
{
	var days = Math.floor(timeLeft / 3600 / 24);
	var hours = Math.floor(timeLeft / 3600) % 24;
	var minutes = Math.floor(timeLeft / 60) % 60;
	var seconds = timeLeft % 60;
	var timeFmt = "";
	
	if (days > 1)
		timeFmt = '' + days.toString() + ' days '+ hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	else if (days > 0)
		timeFmt = '' + days.toString() + ' day '+ hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	else
		timeFmt = '' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	
	return timeFmt;
}


window.UpdateEsoCharDataHirelingTime = function(index, element)
{
	var nowTime = Math.floor(Date.now() / 1000);
	var baseTime = $(this).attr("timestamp");
	var skillLevel = $(this).attr("skill");
	
	if (baseTime == null || skillLevel == null || baseTime <= 0 || skillLevel <= 0) return;
	
	baseTime = +baseTime;
	skillLevel = +skillLevel;
		
	var newTime = ((skillLevel >= 3) ? 12 : 24) * 3600 + baseTime;
		
	if (newTime > nowTime)
		$(this).text(FormatEsoTimeLeft(newTime - nowTime));
	else
		$(this).text("Ready!");
}


window.UpdateEsoCharDataRidingTime = function(index, element)
{
	var nowTime = Math.floor(Date.now() / 1000);
	var baseTime = $(this).attr("timestamp");
	
	if (baseTime == null || baseTime <= 0) return;
	
	baseTime = +baseTime;
	
	if (baseTime > nowTime)
		$(this).text(FormatEsoTimeLeft(baseTime - nowTime));
	else
		$(this).text("Ready!");
}


window.OnEsoCharDataTimeUpdate = function()
{
	$(".ecdHirelingTime").each(UpdateEsoCharDataHirelingTime);
	$(".ecdRidingTime").each(UpdateEsoCharDataRidingTime);	
}


window.OnCharMenuHoverIn = function()
{
	$("#ecdCharacterMenu").slideDown();
	$("#ecdCharMenuArrow").html("&#x25B2;");
}


window.OnCharMenuHoverOut = function()
{
	$("#ecdCharacterMenu").slideUp();
	$("#ecdCharMenuArrow").html("&#x25BC;");
}


window.OnChangeCharScreenshot = function()
{
	var selectedImage = $("#ecdScreenshotList").val();
	
	if (selectedImage == "" || selectedImage == "blank")
	{
		$("#ecdRoot").css("background-image", "none");
		return;
	}
	
	selectedImage = "url(//esochar.uesp.net/screenshots/" + selectedImage + ")"; 
	$("#ecdRoot").css("background-image", selectedImage);
}


window.OnToggleCharBackgroundImage = function()
{
	$("#ecdTitleBar").toggle();
	$("#ecdRightData").toggle();
	$("#ecdEquipSlots").toggle();
	$("#ecdStatsandBuffs").toggle();
	$("#ecdActionBar").toggle();
	$("#ecdRawLink").toggle();
	$("#ecdCreateDate").toggle();
}


window.OnClickEsoScreenshotCaptionButton = function()
{
	var queryParams = {}
	var charId = $(this).attr("charid");
	var buildType = $(this).attr("buildtype");
	var screenshotId = $(this).attr("screenshotid");
	var caption = $(this).prev(".ecdScreenshotCaption").val();
	var statusElement = $(this).siblings(".ecdScreenshotStatus"); 
	
	statusElement.html("");
	
	if (charId == null || buildType == null || screenshotId == null) return false;
	
	if (buildType == "char")
		queryParams['charid'] = charId;
	else
		queryParams['buildid'] = charId;
	
	queryParams['screenshotid'] = screenshotId;
	queryParams['caption'] = caption;
	queryParams['action'] = "editcaption";
	
	$.ajax("//esochars.uesp.net/manageScreenshots.php", {
			data: queryParams,
			xhrFields: { withCredentials: true },
		}).
		done(function(data, status, xhr) { OnEsoCharEditScreenshotCaptionSaved(data, screenshotId, statusElement, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoCharEditScreenshotCaptionError(xhr, screenshotId, statusElement, status, errorMsg); });
	
	return true;
}


window.OnEsoCharEditScreenshotCaptionSaved = function(data, screenshotId, statusElement, status, xhr)
{
	if (data.result > 0)
	{
		statusElement.html("Caption saved for screenshot " + screenshotId + "!");
	}
	else
	{
		var errorMsg = "";
		if (data.errorMsg) errorMsg = data.errorMsg.join("<br/>");
		statusElement.html("Error saving caption for screenshot " + screenshotId + "!</br>" + errorMsg);
	}	
}


window.OnEsoCharEditScreenshotCaptionError = function(xhr, screenshotId, statusElement, status, errorMsg)
{
	$("#ecdScreenshotStatus").html("Error saving caption for screenshot " + screenshotId +"!<br/>" + errorMsg)
}


window.OnClickEsoScreenshotDeleteButton = function()
{
	var queryParams = {}
	var charId = $(this).attr("charid");
	var buildType = $(this).attr("buildtype");
	var screenshotId = $(this).attr("screenshotid");
	var caption = $(this).prev(".ecdScreenshotCaption").val();
	var statusElement = $(this).parentsUntil("tr").find(".ecdScreenshotStatus");
	
	$("#ecdScreenshotStatus").html("");
	if (charId == null || buildType == null || screenshotId == null) return false;
	
	if (buildType == "char")
		queryParams['charid'] = charId;
	else
		queryParams['buildid'] = charId;
	
	queryParams['screenshotid'] = screenshotId;
	queryParams['action'] = "delete";
	
	$.ajax("//esochars.uesp.net/manageScreenshots.php", {
			data: queryParams,
			xhrFields: { withCredentials: true },
		}).
		done(function(data, status, xhr) { OnEsoCharEditScreenshotDeleted(data, screenshotId, statusElement, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoCharEditScreenshotDeleteError(xhr, screenshotId, statusElement, status, errorMsg); });
	
	return true;
}


window.OnEsoCharEditScreenshotDeleted = function(data, screenshotId, statusElement, status, xhr)
{
	if (data.result > 0)
	{
		$("#ecdScreenshotStatus").html("Screenshot " + screenshotId + " deleted!");
		$(".ecdScreenshotsTable tr[screenshotid='" + screenshotId + "']").replaceWith("");
	}
	else
	{
		var errorMsg = "";
		if (data.errorMsg) errorMsg = data.errorMsg.join("<br/>");
		statusElement.html("Error deleting screenshot " + screenshotId + "!</br>" + errorMsg);
	}
}


window.OnEsoCharEditScreenshotDeleteError = function(xhr, screenshotId, statusElement, status, errorMsg)
{
	statusElement.html("Error deleting screenshot " + screenshotId + "!<br/>" + errorMsg)
}


window.UpdateEsoTooltipEnchantDamage = function (match, divData, enchantValue, damageType)
{
	var enchantFactor = 1;
	var damageMod;
	var checkDamageType = damageType;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
		
	damageMod = g_EsoBuildLastInputValues[checkDamageType + "DamageDone"];
	
	if (checkDamageType != "" && damageMod != null && damageMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment " + checkDamageType + "DamageDone"] = (damageMod * 100).toFixed(1) + "%";
		enchantFactor += +damageMod;	
	}
	
	damageMod = g_EsoBuildLastInputValues.DamageDone;
	
	if (damageMod != null && damageMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment DamageDone"] = (damageMod * 100).toFixed(1) + "%";
		enchantFactor += +damageMod;
	}
	
	damageMod = g_EsoBuildLastInputValues.SingleTargetDamageDone;
	
	if (damageMod != null && damageMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment SingleTargetDamageDone"] = (damageMod * 100).toFixed(1) + "%";
		enchantFactor += +damageMod;
	}
	
	damageMod = g_EsoBuildLastInputValues.DirectDamageDone;
	
	if (damageMod != null && damageMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment DirectDamageDone"] = (damageMod * 100).toFixed(1) + "%";
		enchantFactor += +damageMod;
	}
	
	if (itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		//enchantFactor *= 0.5;	//Handled by tooltip display
		//itemData.rawOutput["Tooltip: Enchantment 1H Weapon"] = "50%";
	}

	if (enchantFactor != 1)
	{
		enchantValue = Math.floor(enchantValue * enchantFactor);
	}
		
	return "Deals <div" + divData + ">" + enchantValue + "</div> " + damageType + " Damage";
}


window.UpdateEsoTooltipEnchantHealing = function (match, divData, enchantValue)
{
	var enchantFactor = 1;
	var healingMod;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
		
	healingMod = g_EsoBuildLastInputValues["HealingDone"];
	
	if (healingMod != null && healingMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment HealingDone"] = (healingMod * 100).toFixed(1) + "%";
		enchantFactor += +healingMod;
	}
	
	if (itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		//enchantFactor *= 0.5;	//Handled by tooltip display
		//itemData.rawOutput["Tooltip: Enchantment 1H Weapon"] = "50%";
	}
	
	if (enchantFactor != 1)
	{
		enchantValue = Math.floor(enchantValue * enchantFactor);
	}
	
	return "restores <div" + divData + ">" + enchantValue + "</div> Health";
}


window.UpdateEsoTooltipEnchantDamageShield = function (match, divData, enchantValue)
{
	var enchantFactor = 1;
	var shieldMod;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	
	shieldMod = g_EsoBuildLastInputValues["DamageShield"];
	
	if (shieldMod != null && shieldMod !== 0) 
	{
		//itemData.rawOutput["Tooltip: Enchantment DamageShield"] = (shieldMod*100).toFixed(1) + "%";
		enchantFactor += +shieldMod;
	}
	
	if (itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		//enchantFactor *= 0.5;	//Handled by tooltip display
		//itemData.rawOutput["Tooltip: Enchantment 1H Weapon"] = "50%";
	}
	
	if (enchantFactor != 1)
	{
		enchantValue = Math.floor(enchantValue * enchantFactor);
	}
	
	return "Grants a  <div" + divData + ">" + enchantValue + "</div> point Damage shield";
}


window.UpdateEsoTooltipEnchantOther = function (match, header, enchantValue, footer)
{
	var enchantFactor = 1;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};

	if (itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		//enchantFactor *= 0.5;	//Handled by tooltip display
		//itemData.rawOutput["Tooltip: Enchantment 1H Weapon"] = "50%";
	}
	
	if (enchantFactor != 1)
	{
		enchantValue = Math.floor(enchantValue * enchantFactor);
	}
	
	return header + enchantValue + footer;
}


window.UpdateEsoBuildTooltipEnchant = function (enchantBlock, tooltip, parent, slotId)
{
	var enchantHtml = "";
		
	if (tooltip)
	{
		enchantHtml = enchantBlock.html();
		g_EsoCurrentTooltipSlot = $(parent).parent().attr("slotid");
	}
	else if (slotId)
	{
		g_EsoCurrentTooltipSlot = slotId;
		
		var enchant = g_EsoBuildEnchantData[g_EsoCurrentTooltipSlot];
		var item  = g_EsoBuildItemData[g_EsoCurrentTooltipSlot];
		
		if (item != null) enchantHtml = item.enchantDesc;
		if (enchant != null && enchant.enchantDesc) enchantHtml = enchant.enchantDesc;
		
		if (enchantHtml == "") return;
		enchantHtml = RemoveEsoDescriptionFormats(enchantHtml);
	}
	else
	{
		return;
	}
	
	var newEnchantHtml = enchantHtml;
	
	newEnchantHtml = newEnchantHtml.replace(/Deals (?:\<div([^>]*)\>|)([0-9]+)(?:\<\/div\>|) ([A-Za-z]+) Damage/gi, UpdateEsoTooltipEnchantDamage);
	newEnchantHtml = newEnchantHtml.replace(/restores (?:\<div([^>]*)\>|)([0-9]+)(?:\<\/div\>|) Health/gi, UpdateEsoTooltipEnchantHealing);
	newEnchantHtml = newEnchantHtml.replace(/Grants a (?:\<div([^>]*)\>|)([0-9]+)(?:\<\/div\>|) point Damage shield/gi, UpdateEsoTooltipEnchantDamageShield);
	
	newEnchantHtml = newEnchantHtml.replace(/(restores (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|) Stamina)/gi, UpdateEsoTooltipEnchantOther);
	newEnchantHtml = newEnchantHtml.replace(/(restores (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|) Magicka)/gi, UpdateEsoTooltipEnchantOther);
	newEnchantHtml = newEnchantHtml.replace(/(Spell Resistance by (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|) for)/gi, UpdateEsoTooltipEnchantOther);
	newEnchantHtml = newEnchantHtml.replace(/(Spell Damage by (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|) for)/gi, UpdateEsoTooltipEnchantOther);
	
	if (tooltip && newEnchantHtml != enchantHtml) enchantBlock.html(newEnchantHtml);
}


window.UpdateEsoSetDamageDataReplace = function (match, prefixWord, div1, damageValue, div2, damageType, extraSpace, setDamageData, matchCount)
{
	var damageFactor = 1;
	var damageMod;
	var checkDamageType = damageType;
	var isAoE = false;
	var isSingleTarget = false;
	var isDoT = false;
	var isBleed = false;
	var isPet = false;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	
	if (prefixWord == "absorbs") return match;
	if (damageType == "Spell") return match;
	if (damageType == "Weapon") return match;
	
	if (setDamageData != null)
	{
		if (setDamageData.ignoreAll) return match;
		
		if (typeof setDamageData.isAoE == 'boolean')
			isAoE = setDamageData.isAoE;
		else if (setDamageData.isAoE && setDamageData.isAoE[matchCount - 1] != null)
			isAoE = setDamageData.isAoE[matchCount - 1];
		
		if (typeof setDamageData.isDoT == 'boolean')
			isDoT = setDamageData.isDoT;
		else if (setDamageData.isDoT && setDamageData.isDoT[matchCount - 1] != null)
			isDoT = setDamageData.isDoT[matchCount - 1];
		
		if (typeof setDamageData.isBleed == 'boolean')
			isBleed = setDamageData.isBleed;
		else if (setDamageData.isBleed && setDamageData.isBleed[matchCount - 1] != null)
			isBleed = setDamageData.isBleed[matchCount - 1];
		
		if (setDamageData.isSingleTarget == null)
			isSingleTarget = !isAoE;
		else if (typeof setDamageData.isSingleTarget == 'boolean')
			isSingleTarget = setDamageData.isSingleTarget;
		else if (setDamageData.isSingleTarget && setDamageData.isSingleTarget[matchCount - 1] != null)
			isSingleTarget = setDamageData.isSingleTarget[matchCount - 1];
		
		if (typeof setDamageData.isPet == 'boolean')
			isPet = setDamageData.isPet;
		else if (setDamageData.isPet && setDamageData.isPet[matchCount - 1] != null)
			isPet = setDamageData.isPet[matchCount - 1];
		
		if (setDamageData.damageTypes != null) {
			var maxDamageType = setDamageData.damageTypes[0];
			var maxDamageValue = -1;
			
			for (var i = 0; i < setDamageData.damageTypes.length; ++i) {
				var damageType = setDamageData.damageTypes[i];
				var damageValue = g_EsoBuildLastInputValues[damageType + "DamageDone"];
				if (damageValue == null || damageValue == 0 || isNaN(damageValue)) continue;
				if (damageValue > maxDamageValue) {
					maxDamageValue = damageValue;
					maxDamageType = damageType;
				}
			}
			checkDamageType = maxDamageType;
		}
		
		if (setDamageData.damageType != null) checkDamageType = setDamageData.damageType;
	}
	
	//EsoBuildLog("UpdateEsoSetDamageData", match, isAoE, isDoT, damageValue, damageType);
	
	if (checkDamageType)
	{
		itemData.rawOutput["Tooltip: Set Using DamageType"] = checkDamageType;
	}
	
	damageMod = g_EsoBuildLastInputValues[checkDamageType + "DamageDone"];
	
	if (checkDamageType != "" && damageMod != null && damageMod !== 0) 
	{
		itemData.rawOutput["Tooltip: Set " + checkDamageType + "DamageDone"] = (damageMod * 100).toFixed(1) + "%";
		damageFactor += +damageMod;	
	}
	
	damageMod = g_EsoBuildLastInputValues.DamageDone;
	
	if (damageMod != null && damageMod !== 0) 
	{
		itemData.rawOutput["Tooltip: Set DamageDone"] = (damageMod * 100).toFixed(1) + "%";
		damageFactor += +damageMod;
	}
	
	if (isAoE)
	{
		damageMod = g_EsoBuildLastInputValues.AOEDamageDone;
		
		if (damageMod != null && damageMod !== 0) 
		{
			itemData.rawOutput["Tooltip: Set AOEDamageDone"] = (damageMod * 100).toFixed(1) + "%";
			damageFactor += +damageMod;
		}
	}
	else if (isSingleTarget)
	{
		damageMod = g_EsoBuildLastInputValues.SingleTargetDamageDone;
		
		if (damageMod != null && damageMod !== 0) 
		{
			itemData.rawOutput["Tooltip: Set SingleTargetDamageDone"] = (damageMod * 100).toFixed(1) + "%";
			damageFactor += +damageMod;
		}
	}
	
	if (isDoT)
	{
		damageMod = g_EsoBuildLastInputValues.DotDamageDone;
		
		if (damageMod != null && damageMod !== 0) 
		{
			itemData.rawOutput["Tooltip: Set DotDamageDone"] = (damageMod * 100).toFixed(1) + "%";
			damageFactor += +damageMod;
		}
	}
	else
	{
			// TODO: Confirm
		damageMod = g_EsoBuildLastInputValues.DirectDamageDone;
		
		if (damageMod != null && damageMod !== 0) 
		{
			itemData.rawOutput["Tooltip: Set DirectDamageDone"] = (damageMod * 100).toFixed(1) + "%";
			damageFactor += +damageMod;
		}
	}
	
	if (isBleed)
	{
		damageMod = g_EsoBuildLastInputValues.BleedDamage;
		
		if (damageMod != null && damageMod !== 0) 
		{
			itemData.rawOutput["Tooltip: Set BleedDamage"] = (damageMod * 100).toFixed(1) + "%";
			damageFactor += +damageMod;
		}
	}
	
	damageMod = g_EsoBuildLastInputValues.PetDamageDone;
	
	if (isPet && damageMod != null && damageMod !== 0) 
	{
		itemData.rawOutput["Tooltip: Pet DamageDone"] = (damageMod * 100).toFixed(1) + "%";
		damageFactor += +damageMod;
	}

	if (damageFactor != 0)
	{
		damageValue = Math.floor(damageValue * damageFactor);
	}
	
	return " " + prefixWord + " " + div1 + damageValue + div2 + " " + damageType + extraSpace + "Damage";
}



window.UpdateEsoSetDamageShieldReplace = function (match, div1, damageShieldValue, div2)
{
	// damage shield that absorbs 140-12040 damage
	// damage shield every 2 seconds that absorbs 27-2399 damage

	var shieldFactor = 1;
	var shieldMod;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	
	shieldMod = g_EsoBuildLastInputValues["DamageShield"];
	
	if (shieldMod != null && shieldMod !== 0) 
	{
		itemData.rawOutput["Tooltip: Set DamageShield"] = (shieldMod * 100).toFixed(1) + "%";
		shieldFactor += +shieldMod;
	}
	
	if (shieldFactor != 0)
	{
		damageShieldValue = Math.floor(damageShieldValue * shieldFactor);
	}
	
	return " absorbs " + div1 + damageShieldValue + div2 + " damage";
}


window.UpdateEsoSetHealReplace = function (match, prefixWord, div1, healValue, div2, suffixWord)
{
	// heal for 23-2000 Health
	// collecting the essence heals you 50-4300 Health
	// ? When you take damage, you have a 6% chance to create a beam that steals
	// 63-5805 Health over 4 seconds from the attacker
	
	var healFactor = 1;
	var healMod;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	
	if (prefixWord != "for" && prefixWord != "you" && prefixWord != "steals") return match;
	
	healMod = g_EsoBuildLastInputValues["HealingDone"];
	
	if (healMod != null && healMod !== 0) 
	{
		itemData.rawOutput["Tooltip: Set HealingDone"] = (healMod * 100).toFixed(1) + "%";
		healFactor += +healMod;
	}
	
	if (healFactor != 0)
	{
		healValue = Math.floor(healValue * healFactor);
	}
	
	return " " + prefixWord + " " + div1 + healValue + div2 + suffixWord;
}



window.UpdateEsoBuildSetDamageData = function (setDesc, setDamageData)
{
	var newDesc = setDesc;
	var matchCount = 0;
	
	// EsoBuildLog("UpdateEsoBuildSetDamageData", setDesc, setDamageData);
	
	newDesc = newDesc.replace(/ ([A-Za-z\:]+) ((?:\<div[^>]*\>)|)([0-9]+)((?:\<\/div\>)|) ((?:[a-zA-Z]+)|)( |)damage/gi, function(match, prefixWord, div1, damageValue, div2, damageType, extraSpace) {
		++matchCount;
		return UpdateEsoSetDamageDataReplace(match, prefixWord, div1, damageValue, div2, damageType, extraSpace, setDamageData, matchCount);
	});
	
	return newDesc;
}


window.UpdateEsoBuildSetDamageShield = function (setDesc)
{
	var newDesc = setDesc;
	var matchCount = 0;
	
	// EsoBuildLog("UpdateEsoBuildSetDamageShieldData", setDesc);
	
	newDesc = newDesc.replace(/ absorbs ((?:\<div[^>]*\>)|)([0-9]+)((?:\<\/div\>)|) damage/gi, function(match, div1, damageValue, div2) {
		++matchCount;
		return UpdateEsoSetDamageShieldReplace(match, div1, damageValue, div2, matchCount);
	});
	
	return newDesc;
}


window.UpdateEsoBuildSetHealing = function (setDesc)
{
	var newDesc = setDesc;
	var matchCount = 0;
	
	// EsoBuildLog("UpdateEsoBuildSetHealing", setDesc);
	
	newDesc = newDesc.replace(/ (for|you|steals) ((?:\<div[^>]*\>)|)([0-9]+)((?:\<\/div\>)|)( Health|\.)/gi, function(match, prefixWord, div1, healValue, div2, suffixWord) {
		++matchCount;
		return UpdateEsoSetHealReplace(match, prefixWord, div1, healValue, div2, suffixWord, matchCount);
	});
	
	return newDesc;
}


window.UpdateEsoBuildSetOther = function (setDesc)
{
	var newDesc = setDesc;
	var itemData = (window.g_EsoBuildItemData ? g_EsoBuildItemData[g_EsoCurrentTooltipSlot] : {} ) || {};
	
	if (itemData.rawOutput == null) itemData.rawOutput = {};

		// Alessian Order
	newDesc = newDesc.replace(/(\(5 items\) Increase your Health Recovery by (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|)% of your sum total Physical and Spell Resistance\..*\s*Current Bonus Health Recovery: )([0-9]+)/i, function(match, prefix, percent, middle, healthRegen) {
		healthRegen = Math.floor((+g_EsoBuildLastInputValues.SpellResist + g_EsoBuildLastInputValues.PhysicalResist) * percent / 100);
		itemData.rawOutput["Tooltip: Set HealthRegen"] = "(" + g_EsoBuildLastInputValues.SpellResist + " + " + g_EsoBuildLastInputValues.PhysicalResist + ") * " + percent + "% = " + healthRegen;
		return prefix + percent + middle + healthRegen;
	});
	
	newDesc = newDesc.replace(/(\(5 items\) Increase your Health Recovery by (?:\<div[^>]*\>|))([0-9]+)((?:\<\/div\>|)% of your sum total Physical Resistance and Spell Resistance\..*\s*Current Bonus Health Recovery: )([0-9]+)/i, function(match, prefix, percent, middle, healthRegen) {
		healthRegen = Math.floor((+g_EsoBuildLastInputValues.SpellResist + g_EsoBuildLastInputValues.PhysicalResist) * percent / 100);
		itemData.rawOutput["Tooltip: Set HealthRegen"] = "(" + g_EsoBuildLastInputValues.SpellResist + " + " + g_EsoBuildLastInputValues.PhysicalResist + ") * " + percent + "% = " + healthRegen;
		return prefix + percent + middle + healthRegen;
	});
	
		// Thews of the Harbinger
	newDesc = newDesc.replace(/(\(5 items\) When you block a direct damage attack, you deal damage to your attacker equal to )([0-9]+)(% of your current Health. Current value: )([0-9]+)/i, function(match, prefix, percent, middle, damage) {
		damage = Math.floor(+g_EsoBuildLastInputValues.Health * percent / 100);
		itemData.rawOutput["Tooltip: Set Damage"] = "" + g_EsoBuildLastInputValues.Health + " * " + percent + "% = " + damage;
		return prefix + percent + middle + damage;
	});
	
	return newDesc;
}


window.UpdateEsoBuildSetAllData = function (setDesc, setDamageData)
{
	var newDesc = setDesc;
	
	newDesc = UpdateEsoBuildSetOther(newDesc);
	newDesc = UpdateEsoBuildSetDamageData(newDesc, setDamageData);
	newDesc = UpdateEsoBuildSetDamageShield(newDesc);
	newDesc = UpdateEsoBuildSetHealing(newDesc);	
		
	// EsoBuildLog("UpdateEsoBuildSetAllData", newDesc, setDesc, setDamageData);
	
	return newDesc;
}
 

window.UpdateEsoBuildSetAllFullText = function (setText)
{
	var matchResult;
	var setName = "";
	var setDamageData = null;
	
	matchResult = setText.match(/PART OF THE ([A-Za-z0-9_\'\- ]+) SET/i);
	if (matchResult && matchResult[1]) setName = matchResult[1].toLowerCase();
	
	// EsoBuildLog("UpdateEsoBuildSetAllFullText", matchResult, setName, ESO_SETPROCDAMAGE_DATA[setName], setText);
	
	setDamageData = ESO_SETPROCDAMAGE_DATA[setName];
	return UpdateEsoBuildSetAllData(setText, setDamageData);
}


window.UpdateEsoBuildSetAll = function (setName, setDesc)
{
	var matchResult;
	var setDamageData = null;
	
	setDamageData = ESO_SETPROCDAMAGE_DATA[setName.toLowerCase()];
	return UpdateEsoBuildSetAllData(setDesc, setDamageData);
}


window.UpdateEsoBuildTooltipSet = function (setBlock, tooltip, parent, slotId)
{
	var setHtml = "";
	var newSetHtml;
	
	if (tooltip)
	{
		setHtml = setBlock.html();
		g_EsoCurrentTooltipSlot = $(parent).parent().attr("slotid");
	}
	else if (slotId)
	{
		g_EsoCurrentTooltipSlot = slotId;
		
		var item  = g_EsoBuildItemData[g_EsoCurrentTooltipSlot];
		if (item == null || item.setName == "") return;
		
		setHtml = "PART OF THE " + item.setName + " SET\n" + item.setBonusDesc1 + "\n" + item.setBonusDesc2 + "\n" + item.setBonusDesc3 + "\n" + item.setBonusDesc4 + "\n" + item.setBonusDesc5 + "\n";
		setHtml = RemoveEsoDescriptionFormats(setHtml);
	}
	else
	{
		return;
	}
	
	newSetHtml = UpdateEsoBuildSetAllFullText(setHtml);
	
	if (tooltip && newSetHtml != setHtml) setBlock.html(newSetHtml);
}


window.UpdateEsoBuildTooltip = function (tooltip, parent, slotId)
{
	var enchantBlock = null;
	var setBlock = null;
	
	if (tooltip)
	{
		enchantBlock = $(tooltip).find("#esoil_itemenchantblock");
		setBlock = $(tooltip).find("#esoil_itemsetblock");
	}
	
	UpdateEsoBuildTooltipEnchant(enchantBlock, tooltip, parent, slotId);
	UpdateEsoBuildTooltipSet(setBlock, tooltip, parent, slotId);
}


window.OnEsoTooltipUpdate = function (event, tooltip, parent)
{
	// EsoBuildLog("OnEsoTooltipUpdate", tooltip, parent);
	UpdateEsoBuildTooltip(tooltip, parent, null);	
}


window.EsoBuildLoadEmbed = function(buildId, elementId)
{
	var queryParams = {};
	
	queryParams.id = buildId;
	
	$.ajax("//esochars.uesp.net/embedBuildData.php", {
		data: queryParams,
	}).
	done(function(data, status, xhr) { OnEsoBuildDataEmbedRequest(elementId, data, status, xhr); }).
	fail(function(xhr, status, errorMsg) { OnEsoBuildDataEmbedError(errorMsg, status, xhr); });
}


window.OnEsoBuildDataEmbedRequest = function(elementId, data, status, xhr)
{
	$("#" + elementId).html(data);
	
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
	
	onEsoBuildDataDocReady();
	esovcpOnDocReady();
}


window.OnEsoBuildDataEmbedError = function(errorMsg, status, xhr)
{
}


window.onEsoBuildDataDocReady = function()
{  
	$(".ecdTooltipTrigger").hover(onTooltipHoverShow, onTooltipHoverHide, onTooltipMouseMove);
	$(".ecdTooltip").hover(onTooltipHoverHide, onTooltipHoverHide, onTooltipHoverHide);
	
	$('.ecdSkillTreeName1').click(OnEsoSkillTreeName1Click);
	$('.ecdSkillTreeName2').click(OnEsoSkillTreeName2Click);
	
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1:visible').first();
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
		
	$("#ecdBuildTable a").click(OnBuildTableAnchorClick);
	$(".ecdBuildRowHover td").not(".ecdBuildTableButtons").click(OnBuildTableRowClick);
	
	$("#ecdWeaponBar1").click(OnBuildWeaponBar1Click);
	$("#ecdWeaponBar2").click(OnBuildWeaponBar2Click);
	
	$(".ecdActionBar1").click(OnBuildActionBar1Click);
	$(".ecdActionBar2").click(OnBuildActionBar2Click);
	$(".ecdActionBar3").click(OnBuildActionBar3Click);
	$(".ecdActionBar4").click(OnBuildActionBar4Click);
	
	$("#ecdCharacterMenuRoot").click(OnCharMenuHoverIn);
	$("#ecdCharacterMenuRoot").hover(null, OnCharMenuHoverOut);
	$("#ecdBackgroundFocus").click(OnToggleCharBackgroundImage);
	
	$(".ecdScreenshotCaptionButton").click(OnClickEsoScreenshotCaptionButton);
	$(".ecdScreenshotDeleteButton").click(OnClickEsoScreenshotDeleteButton);
	
	$(document).on("esoTooltipUpdate", OnEsoTooltipUpdate);
	
	g_EsoCharDataTimeUpdateId = setInterval(OnEsoCharDataTimeUpdate, 1000);
	
	AddEsoCharDataAsyncHandlers(document);
	
	UpdateEsoInventoryShownSpace();
	UpdateFirstQuestDetails();
	UpdateBuildStatData();
}


$(document).ready(onEsoBuildDataDocReady);


