/*
 * TODO:
 * 		- Description of input types (plain, percent, special, etc...)
 * 		- Poison buffs
 * 		- Hide skill lines, auto-purchase free skills.
 * 		- Include specific Spell/Weapon damage values in raw data and effective power.
 * 		- View window enchantment/set effect modifiers.
 * 		- Block mitigation has cap of 90%: https://forums.elderscrollsonline.com/en/discussion/comment/6265073#Comment_6265073
 * 		- Custom titles.
 * 		- Custom skill bars.
 *		- bound aegis (sorc) should enable "expert summoner" passive by default, in the game it DOES boost hp by 8% just while slotted, without activating skill (unlike bound armaments, which doesnt give u hp even if u use it until u get atleast 1 spectral dagger).
 * 		- Fix text for set tooltips to have the correct values.
 * 		- Private builds?
 * 		- Minor/Major Magicka
 * 		- Potions/Poison
 * 		- Make Rallying Cry a buff (needs maxTimes capability added to buffs).
 *  
 */

window.TestCache = 789;

window.ESO_TESTBUILD_SHOWALLRAWINPUTS = false;

window.ESO_ICON_URL = "//esoicons.uesp.net";

window.ESO_MAX_ATTRIBUTES = 64;
window.ESO_MAX_LEVEL = 50;
window.ESO_MAX_CPLEVEL = 16;
window.ESO_MAX_EFFECTIVELEVEL = 66;

	// Time between an input change and a stat update in seconds
window.ESO_BUILD_UPDATE_MINTIME = 0.9;

window.g_EsoBuildLastUpdateRequest = 0;
window.g_EsoBuildRebuildStatFlag = false;
window.g_EsoBuildEnableUpdates = true;
window.g_EsoBuildClickWallLinkElement = null;
window.g_EsoBuildDumpSetData = "";

window.g_EsoBuildItemData = {};
window.g_EsoBuildEnchantData = {};
window.g_EsoBuildSetData = {};
window.g_EsoBuildSetMaxData = {};
window.g_EsoBuildToggledSetData = {};
window.g_EsoBuildToggledCpData = {};
window.g_EsoBuildToggledSkillData = {};
window.g_EsoBuildLastInputValues = {};
window.g_EsoBuildLastInputHistory = {};

g_EsoBuildItemData.Head = {};
g_EsoBuildItemData.Shoulders = {};
g_EsoBuildItemData.Chest = {};
g_EsoBuildItemData.Hands = {};
g_EsoBuildItemData.Legs = {};
g_EsoBuildItemData.Waist = {};
g_EsoBuildItemData.Feet = {};
g_EsoBuildItemData.Neck = {};
g_EsoBuildItemData.Ring1 = {};
g_EsoBuildItemData.Ring2 = {};
g_EsoBuildItemData.MainHand1 = {};
g_EsoBuildItemData.OffHand1 = {};
g_EsoBuildItemData.MainHand2 = {};
g_EsoBuildItemData.OffHand2 = {};
g_EsoBuildItemData.Poison1 = {};
g_EsoBuildItemData.Poison2 = {};
g_EsoBuildItemData.Food = {};
g_EsoBuildItemData.Potion = {};

g_EsoBuildEnchantData.Head = {};
g_EsoBuildEnchantData.Shoulders = {};
g_EsoBuildEnchantData.Chest = {};
g_EsoBuildEnchantData.Hands = {};
g_EsoBuildEnchantData.Legs = {};
g_EsoBuildEnchantData.Waist = {};
g_EsoBuildEnchantData.Feet = {};
g_EsoBuildEnchantData.Neck = {};
g_EsoBuildEnchantData.Ring1 = {};
g_EsoBuildEnchantData.Ring2 = {};
g_EsoBuildEnchantData.MainHand1 = {};
g_EsoBuildEnchantData.OffHand1 = {};
g_EsoBuildEnchantData.MainHand2 = {};
g_EsoBuildEnchantData.OffHand2 = {};

window.g_EsoFormulaInputValues = {};
window.g_EsoInputStatSources = {};

window.g_EsoBuildUpdatedOffBarEnchantFactor = false;


window.ESO_ITEMQUALITYLEVEL_INTTYPEMAP = 
{
		 1 : [1,  30,  31,  32,  33,  34],
		 4 : [1,  25,  26,  27,  28,  29],
		 6 : [1,  20,  21,  22,  23,  24],
		50 : [1,  20,  21,  22,  23,  24], // ?
		51 : [1, 125, 135, 145, 155, 165],
		52 : [1, 126, 136, 146, 156, 166],
		53 : [1, 127, 137, 147, 157, 167],
		54 : [1, 128, 138, 148, 158, 168],
		55 : [1, 129, 139, 149, 159, 169],
		56 : [1, 130, 140, 150, 160, 170],
		57 : [1, 131, 141, 151, 161, 171],
		58 : [1, 132, 142, 152, 162, 172],
		59 : [1, 133, 143, 153, 163, 173],
		60 : [1, 134, 144, 154, 164, 174],
		61 : [1, 236, 237, 238, 239, 240],
		62 : [1, 254, 255, 256, 257, 258],
		63 : [1, 272, 273, 274, 275, 276],
		64 : [1, 290, 291, 292, 293, 294],
		65 : [1, 308, 309, 310, 311, 312],
		66 : [1, 366, 367, 368, 369, 370],
};

window.ESO_ITEMQUALITYLEVEL_INTTYPEMAP_JEWELRY = 
{
		 1 : [1,  30,  31,  32,  33,  34],
		 4 : [1,  25,  26,  27,  28,  29],
		 6 : [1,  20,  21,  22,  23,  24],
		50 : [1,  20,  21,  22,  23,  24],  // ?
		51 : [1, 125, 135, 145, 155, 165],
		52 : [1, 126, 136, 146, 156, 166],
		53 : [1, 127, 137, 147, 157, 167],
		54 : [1, 128, 138, 148, 158, 168],
		55 : [1, 129, 139, 149, 159, 169],
		56 : [1, 130, 140, 150, 160, 170],
		57 : [1, 131, 141, 151, 161, 171],
		58 : [1, 132, 142, 152, 162, 172],
		59 : [1, 133, 143, 153, 163, 173],
		60 : [1, 134, 144, 154, 164, 174],
		61 : [1, 236, 237, 238, 239, 240],
		62 : [1, 254, 255, 256, 257, 258],
		63 : [1, 272, 273, 274, 275, 276],
		64 : [1, 290, 291, 292, 293, 294],
		65 : [1, 308, 309, 310, 311, 312], // TODO: and previous levels
		66 : [1, 365, 359, 362, 363, 364],
};


window.ESO_MUNDUS_BUFF_DATA = 
{
	"The Apprentice" : {
		abilityId: 13979,
		icon : "/esoui/art/icons/ability_mundusstones_008.png",
		description: "Increases your Spell Damage by 238.",
	},
	"The Atronach" : {
		abilityId: 13982,
		icon : "/esoui/art/icons/ability_mundusstones_009.png",
		description: "Increases your Magicka Recovery by 310.",
	},
	"The Lady" : {
		abilityId: 13976,
		icon : "/esoui/art/icons/ability_mundusstones_005.png",
		description: "Increases your Spell and Physical Resistance by 2744.",
	},
	"The Lover" : {
		abilityId: 13981,
		icon : "/esoui/art/icons/ability_mundusstones_011.png",
		description: "Increases your Spell and Physical Penetration by 2744.",
	},
	"The Lord" : {
		abilityId: 13978,
		icon : "/esoui/art/icons/ability_mundusstones_007.png",
		description: "Increases your Maximum Health by 2225.",
	},
	"The Mage" : {
		abilityId: 13943,
		icon : "/esoui/art/icons/ability_mundusstones_002.png",
		description: "Increases your Maximum Magicka by 2023.",
	},
	"The Ritual" : {
		abilityId: 13980,
		icon : "/esoui/art/icons/ability_mundusstones_010.png",
		description: "Increases your Healing Done by 8%.",
	},
	"The Serpent" : {
		abilityId: 13974,
		icon : "/esoui/art/icons/ability_mundusstones_004.png",
		description: "Increases your Stamina Recovery by 310.",
	},
	"The Shadow" : {
		abilityId: 13984,
		icon : "/esoui/art/icons/ability_mundusstones_012.png",
		description: "Increases your Critical Damage and Healing by 11%.",
	},
	"The Steed" : {
		abilityId: 13977,
		icon : "/esoui/art/icons/ability_mundusstones_006.png",
		description: "Increases your Movement Speed by 10% and Health Recovery by 238.",
	},
	"The Thief" : {
		abilityId: 13975,
		icon : "/esoui/art/icons/ability_mundusstones_003.png",
		description: "Increases your Critical Strike Chance by 7%.",
	},
	"The Tower" : {
		abilityId: 13985,
		icon : "/esoui/art/icons/ability_mundusstones_013.png",
		description: "Increases your Maximum Stamina by 2023.",
	},
	"The Warrior" : {
		abilityId: 13985,
		icon : "/esoui/art/icons/ability_mundusstones_001.png",
		description: "Increases your Weapon Damage by 238.",
	},
};


window.ESOBUILD_SLOTID_TO_EQUIPSLOT = 
{
		"Head" : 0,
		"Shoulders" : 3,
		"Chest" : 2,
		"Hands" : 16,
		"Waist" : 6,
		"Legs" : 8,
		"Feet" : 9,
		"Neck" : 1,
		"Ring1" : 11,
		"Ring2" : 12,
		"MainHand1" : 4,
		"OffHand1" : 5,
		"Poison1" : 13,
		"MainHand2" : 20,
		"OffHand2" : 21,
		"Poison2" : 14,
};


window.ESOBUILD_SLOTID_TO_EQUIPTYPE = 
{
		"Head" : 1,
		"Shoulders" : 4,
		"Chest" : 3,
		"Hands" : 13,
		"Waist" : 8,
		"Legs" : 9,
		"Feet" : 10,
		"Neck" : 2,
		"Ring1" : 12,
		"Ring2" : 12,
		"MainHand1" : 14, 	// 5,6
		"OffHand1" : 7,		// 5
		"Poison1" : 15,
		"MainHand2" : 14,	// 5,6
		"OffHand2" : 7,		// 5
		"Poison2" : 15,
};


window.ESOBUILD_SKILLTYPES = 
{
		0 : "",
		1 : "Class",
		2 : "Weapon",
		3 : "Armor",
		4 : "World",
		5 : "Guild",
		6 : "Alliance War",
		7 : "Racial",
		8 : "Craft",
		9 : "Champion",
};


window.g_EsoBuildBuffData =
{
		"Raid Dummy Buffs & Debuffs" :
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			buffIds: [	"War Horn", "Major Force", "Hircines Veneer", "Worms Raiment", "Minor Toughness", "Minor Berserk", "Minor Brutality", "Minor Sorcery", "Minor Savagery", "Major Courage", "Minor Prophecy",
			          	"Engulfing Flames (Target)", "Major Breach (Target)", "Minor Breach (Target)", "Minor Vulnerability (Target)", "Alkosh (Target)",
			          	"Major Vulnerability (Target)", "Minor Brittle (Target)", "Old Crusher Enchantment Infused + Torug (Target)"
			          	],
			icon : "/esoui/art/icons/crafting_poison_001_blue_005.png",
		},
		"Ravage Magicka" : 
		{
			group: "Poison",
			enabled: false,
			buffEnabled: false,
			skillEnabled : false,
			value : 0.10,
			display: "%",
			category: "Buff",
			statId : "MagickaCost",
			combineAs: "*%",
			icon : "/esoui/art/icons/crafting_poison_001_blue_005.png",
		},
		"Ravage Stamina" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Buff",
			statId : "StaminaCost",
			combineAs: "*%",
			icon : "/esoui/art/icons/crafting_poison_001_green_005.png",
		},
		"Hindrance" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.40,
			display: "%",
			category: "Buff",
			statId : "MovementSpeed",
			icon : "/esoui/art/icons/ability_debuff_minor_cowardice.png",
		},
		"Crimson Oath`s Rive" : {
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -3451,
			category: "Set",
			statIds : [ "SpellResist", "PhysicalResist"],
			icon : "/esoui/art/icons/ability_debuff_minor_fracture.png",
		},
		"Crimson Oath`s Rive (Target)" : {
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -3451,
			category: "Target",
			statIds : [ "SpellResist", "PhysicalResist"],
			icon : "/esoui/art/icons/ability_debuff_minor_fracture.png",
		},
		"Meritorious Service" : {
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 3540,
			category: "Set",
			statIds : [ "SpellResist", "PhysicalResist"],
			icon : "/esoui/art/icons/ability_healer_005.png",
		},
		"Major Cowardice" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -430,
			category: "Target",
			statIds : [ "WeaponDamage", "SpellDamage"],
			icon : "/esoui/art/icons/ability_debuff_major_cowardice.png",
		},
		"Minor Cowardice" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -215,
			category: "Target",
			statIds : [ "WeaponDamage", "SpellDamage"],
			icon : "/esoui/art/icons/ability_debuff_minor_cowardice.png",
		},
		"Minor Uncertainty" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			category: "Buff",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_debuff_minor_uncertainty.png",
		},
		"Minor Enervation" : 
		{
			group: "Poison",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -1320,
			category: "Buff",
			statIds : [ "SpellCrit", "WeaponCrit" ],
			icon : "/esoui/art/icons/ability_debuff_minor_enervation.png",
		},
		"Scorion`s Feast (Imbued Aura)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [307, 307],
			category: "Set",
			statIds : [ "MagickaRegen", "StaminaRegen" ],
			icon : "/esoui/art/icons/ability_healer_010.png",
		},
		"Scorion`s Feast (Overflow Aura)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [307, 307],
			category: "Set",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			icon : "/esoui/art/icons/ability_healer_019.png",
		},
		"Elemental Catalyst (Frost)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_mage_065.png",		// TODO: Placeholder
		},
		"Elemental Catalyst (Flame)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_mage_065.png",		// TODO: Placeholder
		},
		"Elemental Catalyst (Shock)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_mage_065.png",		// TODO: Placeholder
		},
		"The Morag Tong" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Set",
			statIds : [ "PoisonDamageDone", "DiseaseDamageDone" ],
			icon : "/esoui/art/icons/ability_rogue_021.png",		// TODO: Placeholder
		},
		"Encratis Behemoth" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			categories: ["Set", "Set"],
			statIds : [ "FlameDamageTaken", "FlameDamageDone" ],
			factorValues: [ -1, 1 ],
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		"Vastaries Tutelage" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [ 258, 258, -0.10, -0.10, -0.10 ],
			displays: [ "", "", "%", "%", "%" ],
			category: "Set",
			statIds : [ "SpellDamage", "WeaponDamage", "MagickaCost", "StaminaCost", "HealthCost" ],
			combineAses: [ '', '', '*%', '*%', '*%' ],
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		"Way of Martial Knowledge" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.08,
			display: "%",
			category: "Set",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_mage_044.png",		// TODO: Placeholder
		},
		"Beckoning Steel" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			category: "Set",
			statId : "RangedDamageTaken",
			icon : "/esoui/art/icons/ava_siege_ammo_006.png",
		},
		"Lord Warden" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 3180,
			category: "Set",
			statIds : [ "SpellResist", "PhysicalResist" ],
			icon : "/esoui/art/icons/gear_undauntedgrievoust_head_a.png",
		},
		"Grave Guardian" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 4430,
			category: "Set",
			statIds : [ "PhysicalResist", "SpellResist" ],
			icon : "/esoui/art/icons/ability_warrior_020.png",
		},
		"Hitis Hearth" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.05,
			display: "%",
			category: "Set",
			statIds : [ "SprintCost", "BlockCost", "RollDodgeCost" ],
			icon : "/esoui/art/icons/ability_mage_010.png",
		},
		"Robes of Transmutation" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 1400,
			category: "Set",
			statId : "CritResist",
			icon : "/esoui/art/icons/ability_healer_015.png",
		},
		"Healing Mage (Debuff)" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -430,
			category: "Skill2",
			statId : "WeaponDamage",
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		"Sturdy Horn" :
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Buff",
			value : 1320,
			statIds : [ "CritResist" ],
			icon : "/esoui/art/icons/ability_ava_003_b.png",
		},
		"Crystal Weapon" :
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -1000,
			category: "Target",
			statIds : [ "SpellResist", "PhysicalResist" ],
			icon : "/esoui/art/icons/ability_sorcerer_crystalweapon.png",
		},
		"War Horn" : 
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [0.10, 0.10],
			display: "%",
			statIds : ["Magicka", "Stamina"],
			icon : "/esoui/art/icons/ability_ava_003.png",
		},
		"Minor Aegis" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.05,
			display: "%",
			combineAs: "*%",
			statId : "DungeonDamageTaken",
			category: "Buff",
			icon : "/esoui/art/icons/ability_warrior_030.png",
		},
		"Major Aegis" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			combineAs: "*%",
			statId : "DungeonDamageTaken",
			category: "Buff",
			icon : "/esoui/art/icons/procs_004.png",
		},
		"Major Slayer" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "DamageDone",
			category: "Buff",
			icon : "/esoui/art/icons/procs_006.png",
		},
		"Minor Slayer" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statId : "DamageDone",
			category: "Buff",
			icon : "/esoui/art/icons/ability_warrior_025.png",
		},
		"Major Force" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.20,
			display: "%",
			statId : "CritDamage",
			category: "Buff",
			icon : "/esoui/art/icons/ability_ava_003_a.png",
		},
		"Minor Force" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_nightblade_003_a.png",
		},
		"Minor Mending" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.08,
			display: "%",
			statId : "HealingDone",
			icon : "/esoui/art/icons/ability_buff_minor_mending.png",
		},
		"Major Mending" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.16,
			display: "%",
			statId : "HealingDone",
			icon : "/esoui/art/icons/ability_templar_cleansing_ritual.png",
		},
		"Major Sorcery" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.20,
			display: "%",
			statId : "SpellDamage",
			icon : "/esoui/art/icons/ability_sorcerer_critical_surge.png",
		},
		"Minor Sorcery" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "SpellDamage",
			icon : "/esoui/art/icons/ability_sorcerer_surge.png",
		},
		"Major Brutality" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.20,
			display: "%",
			statId : "WeaponDamage",
			icon : "/esoui/art/icons/ability_2handed_005.png",
		},
		"Minor Brutality" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "WeaponDamage",
			icon : "/esoui/art/icons/ability_warrior_012.png",
		},
		"Major Resolve" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 5948,
			category : "Skill",
			statIds : [ "PhysicalResist", "SpellResist" ],
			icon : "/esoui/art/icons/ability_warrior_021.png",
		},
		"Major Resolve (Bonus)" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 2974,
			category : "Skill",
			statIds : [ "PhysicalResist", "SpellResist" ],
			icon : "/esoui/art/icons/ability_warrior_021.png",
		},
		"Minor Resolve" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 2974,
			category : "Skill",
			statIds : [ "PhysicalResist", "SpellResist" ],
			icon : "/esoui/art/icons/ability_warrior_033.png",
		},
		"Spell Resistance Potion" : 
		{
			group: "Potion",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 5280,
			category : "Skill",
			statIds : [ "SpellResist" ],
			icon : "/esoui/art/icons/consumable_potion_004_type_005.png",
		},
		"Physical Resistance Potion" : 
		{
			group: "Potion",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 5280,
			category : "Skill",
			statIds : [ "PhysicalResist" ],
			icon : "/esoui/art/icons/consumable_potion_007_type_005.png",
		},
		"Major Savagery" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 2629,
			statId : "WeaponCrit",
			icon : "/esoui/art/icons/ability_warrior_022.png",
		},
		"Minor Savagery" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 1314,
			statId : "WeaponCrit",
			icon : "/esoui/art/icons/ability_warrior_005.png",
		},
		"Major Prophecy" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 2629,
			statId : "SpellCrit",
			icon : "/esoui/art/icons/ability_mage_017.png",
		},
		"Minor Prophecy" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 1314,
			statId : "SpellCrit",
			icon : "/esoui/art/icons/ability_mage_042.png",
		},
		"Major Fortitude" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.30,
			display : "%",
			statId : "HealthRegen",
			icon : "/esoui/art/icons/ability_healer_003.png",
		},
		"Minor Fortitude" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.15,
			display : "%",
			statId : "HealthRegen",
			icon : "/esoui/art/icons/ability_healer_002.png",
		},
		"Major Intellect" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.30,
			display : "%",
			statId : "MagickaRegen",
			icon : "/esoui/art/icons/ability_mage_045.png",
		},
		"Minor Intellect" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.15,
			display : "%",
			statId : "MagickaRegen",
			icon : "/esoui/art/icons/ability_mage_044.png",
		},
		"Major Endurance" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.30,
			display : "%",
			statId : "StaminaRegen",
			icon : "/esoui/art/icons/ability_warrior_028.png",
		},
		"Minor Endurance" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.15,
			display : "%",
			statId : "StaminaRegen",
			icon : "/esoui/art/icons/ability_warrior_031.png",
		},
		"Major Expedition" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.30,
			display : "%",
			statId : "MovementSpeed",
			icon : "/esoui/art/icons/ability_rogue_049.png",
		},
		"Major Gallop" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.30,
			display : "%",
			statId : "MountSpeed",
			icon : "/esoui/art/icons/ability_buff_major_gallop.png",
		},
		"Minor Expedition" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.15,
			display : "%",
			statId : "MovementSpeed",
			icon : "/esoui/art/icons/ability_rogue_045.png",
		},
		"Major Vitality" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.16,
			display : "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_healer_018.png",
		},
		"Minor Vitality" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.08,
			display : "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_healer_004.png",
		},
		"Empower" :
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [0.40, 0.40],
			display : "%",
			statIds : ["Empower", "OverloadDamage"],
			statDescs : ["Increases the damage of your Light/Medium/Heavy Attacks by ", "Increases the damage of your Overload attacks by ", ],
			icon : "/esoui/art/icons/ability_warrior_012.png",
		},
		"Major Courage" :			// TODO: Check how its added to other SD/WD stats
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 430,
			category: "Set",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			statDesc : "Increases your Weapon and Spell Damage by ",
			icon : "/esoui/art/icons/ability_mage_045.png",
		},
		"Minor Courage" :			// TODO: Check how its added to other SD/WD stats
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 215,
			category: "Set",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			statDesc : "Increases your Weapon and Spell Damage by ",
			icon : "/esoui/art/icons/ability_mage_045.png",
		},
		"Major Evasion" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.20,
			display : "%",
			category: "Skill",
			statId : "AOEDamageTaken",
			icon : "/esoui/art/icons/ability_rogue_037.png",
		},
		"Minor Evasion" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display : "%",
			category: "Skill",
			statId : "AOEDamageTaken",
			icon : "/esoui/art/icons/ability_rogue_035.png",
		},
		"Major Berserk" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			display: "%",
			values : [ 0.10 ],
			statIds : [ "DamageDone" ],
			icon : "/esoui/art/icons/ability_rogue_011.png",
		},
		"Minor Berserk" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_warrior_025.png",
		},
		"Major Protection" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			combineAs: "*%",
			statId : "DamageTaken",
			icon : "/esoui/art/icons/ability_templar_sun_shield.png",
		},
 		"Minor Protection" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.05,
			display: "%",
			statId : "DamageTaken",
			combineAs: "*%",
			icon : "/esoui/art/icons/ability_templar_radiant_ward.png",
		},
 		"Minor Lifesteal" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : "Heals you and your allies for 600 Health every 1 second when damaging them.",
			statId : "OtherEffects",
			icon : "/esoui/art/icons/ability_buff_minor_lifesteal.png",
		},  
		"Major Brittle" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.20,
			display: "%",
			category: "Buff",
			statIds : [ "CritDamageTaken" ],
			icon : "/esoui/art/icons/ability_debuff_major_brittle.png",
		},
		"Minor Brittle" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Buff",
			statIds : [ "CritDamageTaken" ],
			icon : "/esoui/art/icons/ability_debuff_minor_brittle.png",
		},
		"Major Defile" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.16,
			display: "%",
			categories : [  "Buff", "Skill2" ],
			statIds : [ "HealingTaken", "HealthRegen" ],
			icon : "/esoui/art/icons/ability_nightblade_001_a.png",
		},
		"Minor Defile" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.08,
			display: "%",
			categories : [ "Buff", "Skill2" ],
			statIds : [ "HealingTaken", "HealthRegen" ],
			icon : "/esoui/art/icons/ability_nightblade_001_b.png",
		},
		"Major Heroism" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value: 3,
			category: "Item",
			statId : "UltimateRestore",
			icon : "/esoui/art/icons/ability_templar_breath_of_life.png",
		},
		"Minor Heroism" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value: "Grants you 1 Ultimate every 1.5 seconds for 12 seconds.",
			statId : "OtherEffects",
			icon : "/esoui/art/icons/ability_templar_honor_the_dead.png",
		},  
		"Major Breach" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -5948,
			category: "Skill",
			statIds : [ "SpellResist", "PhysicalResist"],
			icon : "/esoui/art/icons/ability_mage_039.png",
		},
		"Minor Breach" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -2974,
			category: "Skill",
			statIds : [ "SpellResist", "PhysicalResist"],
			icon : "/esoui/art/icons/ability_mage_053.png",
		},
		"Major Maim" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_fightersguild_004_a.png",
		},
		"Minor Maim" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.05,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_fightersguild_004.png",
		},
		"Major Vulnerability" : 
		{
			group: "Major",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Buff",
			statId : "Vulnerability",
			//combineAs: "*%",
			statDescs : ["Increases your Damage Taken by "],
			icon : "/esoui/art/icons/ability_debuff_major_vulnerability.png",
		},
		"Minor Vulnerability" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			category: "Buff",
			statId : "Vulnerability",
			//combineAs: "*%",
			statDescs : ["Increases your Damage Taken by "],
			icon : "/esoui/art/icons/ability_debuff_minor_vulnerability.png",
		},
		"Weapon Damage Enchantment" :
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			visible : false,
			toggleVisible : true,
			value : 348,
			category: "Item",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			icon : "/esoui/art/icons/enchantment_weapon_berserking.png",
		},
		"Ultimate Restore (LA)" : 
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 3,
			category: "Item",
			statId : "UltimateRestore",
			icon : "/esoui/art/icons/procs_006.png",
		},
		"Spaulder of Ruin" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Set",
			value : 260,
			statIds: [ "WeaponDamage", "SpellDamage" ],
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		
		"Zens Redress" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			statDesc : "Enemies with the Touch of Z'en take an additional $1 more damage for each damage over time effect you've placed on them, up to 5%.",
			category: "Set",
			statId : "DamageDone",
			combineAs: "*%",
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		"Maelstrom DW Enchantment" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			//visible : false,
			//toggleVisible : true,
			value : 2003,
			statDesc : "Increases the Spell and Weapon Damage of your next non-AoE DoT attack by ",
			category: "Item",
			statIds : [ "MaelstromDamage" ],
			icon : "/esoui/art/icons/enchantment_weapon_berserking.png",
		},
		"Kargaeda" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			statDescs : ["Allies within the whirlwind reduce their Magicka costs by ", "Allies within the whirlwind reduce their Stamina costs by "],
			category: "Set",
			statIds : [ "MagickaCost", "StaminaCost" ],
			icon : "/esoui/art/icons/achievement_trial_cr_flavor_2.png",
		},
		"Maelstrom Destruction Enchantment" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			//visible : false,
			//toggleVisible : true,
			value : 1341,
			statDescs : ["Increases your Light Attack damage on targets affected by your Wall of Elements by ", "Increases your Heavy Attack damage on targets affected by your Wall of Elements by "],
			category: "Skill2",
			statIds : [ "LADamage", "HADamage" ],
			icon : "/esoui/art/icons/enchantment_weapon_berserking.png",
		},
		"Lycanthropy" :
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			visible : false,
			toggleVisible : true,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Buff" ],
			values : [ 0.30, 0.25 ],
			statIds : [ "Stamina", "PoisonVulnerability" ],
			icon: "/esoui/art/icons/ability_werewolf_001.png",
		},
		"Kyne`s Wind" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 508,
			statDescs : [ "You and allies standing in Kyne's Blessing restore $1 Magicka every 1 second.", "You and allies standing in Kyne's Blessing restore $1 Stamina every 1 second." ],
			category: "Set",
			statIds : [ "MagickaRestore", "StaminaRestore" ],
			icon : "/esoui/art/icons/ability_healer_015.png",
		},
		"Symphony of Blades (Magicka)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			//visible : true,
			//toggleVisible : true,
			value : 508,
			statDesc : "Restores $1 Magicka every 1 second.",
			category: "Set",
			statIds : [ "MagickaRestore" ],
			icon : "/esoui/art/icons/ability_debuff_snare.png",
		},
		"Symphony of Blades (Stamina)" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			//visible : true,
			//toggleVisible : true,
			value : 508,
			statDesc : "Restores $1 Stamina every 1 second.",
			category: "Set",
			statIds : [ "StaminaRestore" ],
			icon : "/esoui/art/icons/death_recap_melee_basic.png",
		},
		"Mechanical Acuity" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [ 21910, 21910 ],
			// displays: [ "%", "%" ],
			statIds : [ "SpellCrit", "WeaponCrit" ],
			icon : "/esoui/art/icons/gear_clockwork_medium_head_a.png",
		},
		"Ayleid Health Bonus" : 
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "Health",
			icon : "/esoui/art/icons/quest_spirit_001.png",
		},
		"Yokudan Might" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.08,
			display: "%",
			statId : "DamageDone",
			statDesc : "Increases your Damage Done while in Craglorn by ",
			icon : "/esoui/art/icons/ability_armor_001_a.png",
		},
		"Magicka Attunement" : 
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 1320,
			category: "Item",
			statId : "SpellResist",
			statDesc : "Increases your Spell Resistance while in Craglorn by ",
			icon : "/esoui/art/icons/ability_mage_038.png",
		},
		"Nirncrux Infusion" : 
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 1320,
			category: "Item",
			statId : "PhysicalResist",
			statDesc : "Increases your Physical Resistance while in Craglorn by ",
			icon : "/esoui/art/icons/ability_wrothgar_chillingwind.png",
		},
		"Firelight" : 
		{
			group: "Other",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			category: "Buff",
			statId : "Stamina",
			statDesc : "Increases your Max Stamina by ",
			description: "Random event for the Lightbringer achievement.",
			icon : "/esoui/art/icons/quest_small_furnishing_001.png",
		},
		"Blade Cloak" : 
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.20,
			display: "%",
			category: "Skill",
			statId : "AOEDamageTaken",
			// statDesc : "Decreases AOE damage taken by ",
			icon : "/esoui/art/icons/ability_dualwield_004.png",
		},
		"Minor Toughness" : 
		{
			group: "Minor",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statId : "Health",
			icon : "/esoui/art/icons/achievement_031.png",
		},
		"Worms Raiment" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 145,
			category: "Set",
			statId : "MagickaRegen",
			icon : "/esoui/art/icons/gear_artifactwormcultlight_head_a.png",
		},
		"Hircines Veneer" :
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 145,
			category: "Set",
			statId : "StaminaRegen",
			icon : "/esoui/art/icons/gear_artifactsaviorhidemd_head_a.png",
		},
		"Hircines Rage" : 
		{ 
			group: "Skill",
			enabled: false, 
			skillEnabled : false,
			buffEnabled: false,
			buffIds: [ "Major Berserk" ],
			value : 0.20, 
			display: '%', 
			statId : "DamageTaken", 
			icon : "/esoui/art/icons/ability_werewolf_004_b.png", 
		},
		"Powerful Assault" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 307,
			category: "Item",
			statIds : ["SpellDamage", "WeaponDamage"],
			icon : "/esoui/art/icons/ability_healer_019.png",
		},
		"Aura of Pride" :		// From Spaulder of Ruin
		{
			group: "set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 260,
			category: "Item",
			statIds : ["SpellDamage", "WeaponDamage"],
			icon : "/esoui/art/icons/ability_mage_065.png",	//TODO
		},
		
			/* Target Buffs */
		"Major Brittle (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.20,
			display: "%",
			statIds : [ "CritDamage" ],
			icon : "/esoui/art/icons/ability_debuff_major_brittle.png",
		},
		"Minor Brittle (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			statIds : [ "CritDamage" ],
			icon : "/esoui/art/icons/ability_debuff_minor_brittle.png",
		},
		"Major Defile (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.16,
			display: "%",
			categories : [ "Target", "Target" ],
			statIds : [ "HealingTaken", "HealthRegen" ],
			icon : "/esoui/art/icons/ability_nightblade_001_a.png",
		},
		"Minor Defile (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.08,
			display: "%",
			categories : [ "Target", "Target" ],
			statIds : [ "HealingTaken", "HealthRegen" ],
			icon : "/esoui/art/icons/ability_nightblade_001_b.png",
		},
		"Major Maim (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -0.10,
			display: "%",
			category: "Target",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_fightersguild_004_a.png",
		},
		"Minor Maim (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Target",
			value : -0.05,
			display: "%",
			statId : "DamageDone",
			statDesc : "Reduces the target's damage done by ",
			icon : "/esoui/art/icons/ability_fightersguild_004.png",
		},
		"Alkosh (Target)" : 
		{
			// Reduces the Physical and Spell Resistance of any enemy hit by 35-3010 for 10 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [ -3010, -3010 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_mage_065.png",
		},
		"Tremorscale (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [ -2395 ],
			category: "Target",
			statIds : [ "PhysicalDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by " ],
			icon : "/esoui/art/icons/gear_undauntedsuneripper_head_a.png",
		},
		"Weakening Enchantment (Target)" :
		{
			// Reduce target Weapon Damage and Spell Damage by 0-348 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -348,
			category: "Target",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			statDescs : [ "Reduces the target's Weapon Damage by ", "Reduces the target's Spell Damage by " ],
			icon : "/esoui/art/icons/ava_artifact_005.png",
		},
		"Crusher Enchantment (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1622 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -1622, -1622 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Crusher Enchantment Infused (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1946 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -2108, -2108 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Crusher Enchantment Infused + Torug (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1946 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -3056, -3056 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Old Crusher Enchantment Infused + Torug (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1946 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -2740, -2740 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Crusher Enchantment One-Hand (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1622 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -811, -811 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Crusher Enchantment Infused One-Hand (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1946 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -1054, -1054 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Crusher Enchantment Infused + Torug One-Hand (Target)" :
		{
			// Reduce the target's Spell Resist and Physical Resist by 1946 for 5 seconds.
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			// visible : false,
			// toggleVisible : true,
			values : [ -1528, -1528 ],
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_armor_001.png",
		},
		"Ebon Armory" : 
		{
			group: "Set",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Item",
			statId : "Health",
			value : 1118,
			icon : "/esoui/art/icons/ability_warrior_028.png",
		},
		"Spirit Guardian" : 
		{
			group: "Skill",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Skill",
			statId : "DamageTaken",
			value : -0.10,
			display: "%",
			icon : "/esoui/art/icons/ability_mage_036.png",
		},
		"Major Breach (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -5948,
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_mage_039.png",
		},
		"Minor Breach (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : -2974,
			category: "Target",
			statIds : [ "PhysicalDebuff", "SpellDebuff" ],
			statDescs : [ "Reduces the target's Physical Resistance by ", "Reduces the target's Spell Resistance by " ],
			icon : "/esoui/art/icons/ability_mage_053.png",
		},
		"Major Vulnerability (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Target",
			statId : "Vulnerability",
			//combineAs: "*%",
			icon : "/esoui/art/icons/ability_debuff_major_vulnerability.png",
		},
		"Minor Vulnerability (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			category: "Target",
			statId : "Vulnerability",
			//combineAs: "*%",
			icon : "/esoui/art/icons/ability_debuff_minor_vulnerability.png",
		},
		"Off Balance (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			values : [ 0.70, 1.0, 1.0 ],
			displays: [ "%", "%", "%" ],
			categories: [ "Skill", "Buff", "Buff" ],
			statIds : [ "HADamage", "HAStaRestore", "HAMagRestore" ],
			icon : "/esoui/art/icons/ability_debuff_offbalance.png",
		},
		"Engulfing Flames (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.10,
			display: "%",
			category: "Buff",
			statId : "FlameDamageDone",
			icon : "/esoui/art/icons/ability_dragonknight_004_b.png",
		},
		"Inner Beast (Target)" : 
		{
			group: "Target",
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			value : 0.05,
			display: "%",
			category: "Buff",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_undaunted_002_a.png",
		},
		
			/* Cyrodiil */
		"Offensive Scroll Bonus" : 
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Buff",
			value : 0.05,
			display: "%",
			statIds : [ "SpellDamage", "WeaponDamage" ],
			icon : "/esoui/art/icons/ability_armor_004.png",
		},
		"Defensive Scroll Bonus" : 
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			category: "Buff",
			value : 0.05,
			display: "%",
			statIds : [ "SpellResist", "PhysicalResist" ],
			icon : "/esoui/art/icons/ability_weapon_009.png",
		},
		"Battle Spirit" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%", "%", "%" ],
			categories : [ "Skill2", "Buff", "Buff", "Buff" ],
			values : [ -0.55, -0.50, -0.55, -0.50 ],
			statIds : [ "HealingReceived", "HealthRegen", "DamageTaken", "DamageShield" ],
			combineAses: [ '', '', "*%", '' ],
			icon: "/esoui/art/icons/ability_templar_002.png",
		},
		"Enemy Keep Bonus 1" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.01, 0.01 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 2" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.02, 0.02 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_034.png",
		},
		"Enemy Keep Bonus 3" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.03, 0.03 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 4" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.04, 0.04 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 5" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.05, 0.05 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 6" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.06, 0.06 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 7" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.07, 0.07 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 8" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.08, 0.08 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		"Enemy Keep Bonus 9" :
		{
			group: "Cyrodiil",
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			buffEnabled: false,
			displays : [ "%", "%" ],
			categories : [ "Skill", "Skill" ],
			values : [ 0.09, 0.09 ],
			statIds : [ "WeaponCrit", "SpellCrit" ],
			icon: "/esoui/art/icons/ability_dragonknight_024.png",
		},
		
};


window.g_EsoBuildBuffData_PTS =
{
};


window.ESO_ACTIVEEFFECT_MATCHES = 
[
	{
		"statRequireId": "WerewolfStage",
		"statRequireValue": 2,
		"buffId": "Minor Courage",
		"match": /You also grant yourself and nearby allies Minor Courage/i
	},
	{
		"buffId": "Major Prophecy",
		"match": /While slotted, you gain Major Prophecy/i
	},
	{
		"buffId": "Major Savagery",
		"match": /While slotted, you gain Major Prophecy and Savagery/i
	},
	{
		"buffId": "Major Savagery",
		"match": /While slotted you gain Major Savagery/i
	},
	{
		"buffId": "Major Prophecy",
		"match": /While slotted you gain Major Savagery and Prophecy/i
	},
	{
		"buffId": "Minor Fortitude",
		"match": /While slotted, you gain Minor Fortitude/i
	},
	{
		"buffId": "Minor Endurance",
		"match": /While slotted, you gain Minor Fortitude, Minor Endurance/i
	},
	{
		"buffId": "Minor Intellect",
		"match": /While slotted, you gain Minor Fortitude, Minor Endurance, and Minor Intellect/i
	},
	{
		"buffId": "Major Brutality",
		"match": /While slotted you gain Major Brutality/i
	},
	{
		"buffId": "Major Sorcery",
		"match": /While slotted you gain Major Brutality and Sorcery/i
	},
	{
		"buffId": "Minor Protection",
		"match": /While slotted you gain Minor Protection/i
	},
	{
		"buffId": "Minor Resolve",
		"match": /you gain Minor Resolve/i
	},
	{
		"id": "Crystal Weapon (Debuff)",
		"matchSkillName": false,
		"baseSkillId": 47552,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Crystal Weapon",
		"rawInputMatch": /(and reducing the target's Armor by ([0-9]+) for [0-9]+ seconds\.)/i,
		"match": /and reducing the target's Armor by ([0-9]+) for/i
	},
	{
		"id": "Immovable",
		"baseSkillId": 41082,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Resolve",
		"match": /to gain Major Resolve/i
	},
	{
		"id": "Northern Storm",
		"baseSkillId": 86112,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Protection",
		"match": /You and nearby allies gain Major Protection, reducing your damage taken/i
	},
	{
		"id": "Spirit Guardian",
		"baseSkillId": 40115710,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Spirit Guardian",
		"updateBuffValue": true,
		"rawInputMatch": /(While active, [0-9]+% of the damage you take is transferred to the spirit instead\.)/i,
		"match": /While active, ([0-9]+)% of the damage you take is transferred/i
	},
	{
		"id": "Accelerate",
		"baseSkillId": 40103503,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Expedition",
		"match": /to gain Major Expedition/i
	},
	{
		"id": "Accelerate",
		"baseSkillId": 40103503,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Minor Force",
		"match": /and Minor Force for/i
	},
	{
		"id": "War Horn",
		"baseSkillId": 46529,
		"buffId": "War Horn",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /increasing you and your group's Max Magicka and Max Stamina by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "War Horn",
		"baseSkillId": 46537,
		"displayName": "Aggressive Horn",
		"buffId": "Major Force",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /You and your allies gain Major Force/i
	},
	{
		"id": "War Horn",
		"baseSkillId": 46546,
		"displayName": "Sturdy Horn",
		"buffId": "Sturdy Horn",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"rawInputMatch": /(You and your allies gain [0-9]+ Critical Resistance for [0-9]+ seconds)/i,
		"match": /You and your allies gain ([0-9]+) Critical Resistance/i
	},
	{
		"id": "Lightning Form",
		"baseSkillId": 30235,
		"buffId": "Major Resolve",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /While in this form you also gain Major Resolve/i
	},
	{
		"id": "Molten Weapons",
		"baseSkillId": 32156,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Brutality",
		"match": /Charge you and your grouped allies' weapons with volcanic power to gain Major Brutality and Sorcery/i
	},
	{
		"id": "Molten Weapons",
		"baseSkillId": 32156,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Sorcery",
		"match": /Charge you and your grouped allies' weapons with volcanic power to gain Major Brutality and Sorcery/i
	},
	{
		"id": "Hircine's Rage",
		"matchSkillName": true,
		"baseSkillId": 58316,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Hircines Rage",
		"rawInputMatch": /(If you are at full Health you instead restore [0-9]+ Stamina and gain Major Berserk, increasing your damage done by [0-9]+% for [0-9]+ seconds, but you also take [0-9]+% more damage\.)/i,
		"match": /If you are at full Health you instead restore [0-9]+ Stamina and gain Major Berserk, increasing your damage done by [0-9]+% for [0-9]+ seconds, but you also take [0-9]+% more damage/i
	},
	{
		"id": "Rune Focus",
		"matchSkillName": false,
		"baseSkillId": 23970,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Major Resolve",
		"match": /Create a rune of celestial protection and gain Major Resolve for/i
	},
	{
		"id": "Summoner's Armor",
		"baseSkillId": 40115206,
		"category": "SkillCost",
		"statId": "Blastbones_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"factorValue": -1,
		"match": /While active, reduce the cost of Blastbones, Skeletal Mage, and Spirit Mender by ([0-9]+)%/i
	},
	{
		"statId": "BlockCost",
		"category": "Skill2",
		"display": "%",
		"factorValue": -1,
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"match": /the cost of blocking is reduced by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BlockMitigation",
		"display": "%",
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"match": /the amount of damage you can block is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Immovable",
		"baseSkillId": 41082,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"factorStatId": "ArmorHeavy",
		"statId": "BlockMitigation",
		"display": "%",
		"match": /Each piece of Heavy Armor worn increases the amount of damage you block and the potency of the snare by ([0-9.]+)%/i
	},
	{
		"id": "Bound Armor",
		"baseSkillId": 30418,
		"matchSkillName": true,
		"statId": "BlockMitigation",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"display": "%",
		"match": /creating a suit of Daedric mail that increases your block mitigation by ([0-9]+\.?[0-9]*)% for/i
	},
	{
		"id": "Bound Aegis",
		"baseSkillId": 30418,
		"matchSkillName": true,
		"statId": "BlockMitigation",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"display": "%",
		"match": /creating a suit of Daedric mail that increases your block mitigation by ([0-9]+\.?[0-9]*)% for/i
	},
	{
		"category": "Skill",
		"statId": "DamageDone",
		"display": "%",
		"match": /While slotted, your damage done is increased by ([0-9]+)%/i
	},
	{
		"id": "Death Stroke",
		"baseSkillId": 37518,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill",
		"statId": "DamageDone",
		"display": "%",
		"rawInputMatch": /((?:causing them to take [0-9]+% more damage from your attacks for [0-9.]+ seconds\.)|(?:increasing your damage against them by [0-9]+% for [0-9.]+ seconds\.))/i,
		"match": /causing them to take ([0-9]+)% more damage from your attacks/i
	},
	{
		"id": "Death Stroke",
		"baseSkillId": 37518,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill",
		"statId": "DamageDone",
		"display": "%",
		"match": /increasing your damage against them by ([0-9]+)% for [0-9.]+ seconds/i
	},
	{
		"id": "Standard of Might",
		"baseSkillId": 33963,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill",
		"statId": "DamageDone",
		"display": "%",
		"rawInputMatch": /(Standing in the area increases your damage done and reduces damage taken by [0-9]+%\.)/i,
		"match": /Standing in the area increases your damage done and reduces damage taken by ([0-9]+)%/i
	},
	{
		"id": "Thrive in Chaos",
		"baseSkillId": 86370,
		"category": "Skill",
		"statId": "DamageDone",
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"display": "%",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"maxTimes": 6,
		"match": /Each enemy hit increases your damage done by ([0-9]+)% for the duration/i
	},
	{
		"id": "Equilibrium",
		"baseSkillId": 42251,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "DamageShield",
		"display": "%",
		"factorValue": -1,
		"rawInputMatch": /(The exchange reduces your healing done and damage shield strength by [0-9]+% for [0-9]+ seconds\.)/i,
		"match": /The exchange reduces your healing done and damage shield strength by ([0-9]+)% for /i
	},
	{
		"statRequireId": "WerewolfStage",
		"statRequireValue": 2,
		"statId": "DamageTaken",
		"display": "%",
		"factorValue": -1,
		"match": /you take ([0-9]+\.?[0-9]*)% less damage/i
	},
	{
		"category": "Skill",
		"statId": "DamageTaken",
		"display": "%",
		"factorValue": -1,
		"match": /While slotted, your damage taken is reduced by ([0-9]+)%/i
	},
	{
		"id": "Standard of Might",
		"baseSkillId": 28988,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill",
		"statId": "DamageTaken",
		"display": "%",
		"match": /Standing in the area increases your damage done and reduces damage taken by ([0-9]+)%/i
	},
	{
		"id": "Molten Weapons",
		"displayName": "Molten Armaments",
		"baseSkillId": 32156,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "HADamage",
		"display": "%",
		"match": /Your own damage with Heavy Attacks is increased by ([0-9]+\.?[0-9]*)% while active/i
	},
	{
		"category": "Skill",
		"statId": "HealingDone",
		"display": "%",
		"match": /While slotted, your healing done is increased by ([0-9]+)%/i
	},
	{
		"id": "Equilibrium",
		"baseSkillId": 42251,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "HealingDone",
		"factorValue": -1,
		"display": "%",
		"rawInputMatch": /(The exchange reduces your healing done and damage shield strength by [0-9]+% for [0-9]+ seconds\.)/i,
		"match": /The exchange reduces your healing done and damage shield strength by ([0-9]+)% for /i
	},
	{
		"id": "Blood Scion",
		"baseSkillId": 41920,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill2",
		"statId": "Health",
		"match": /While transformed, your Max Health, Magicka, and Stamina are increased by ([0-9]+),/i
	},
	{
		"id": "Bone Goliath Transformation",
		"baseSkillId": 40115001,
		"category": "Skill2",
		"statId": "Health",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /Goliath, increasing your Max Health by ([0-9]+) for/i
	},
	{
		"id": "Crystal Weapon (Cost)",
		"matchSkillName": false,
		"baseSkillId": 47552,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "HealthCost",
		"factorValue": -1,
		"display": "%",
		"match": /After casting, your next non-Ultimate ability used within [0-9]+ seconds costs ([0-9.]+)% less/i
	},
	{
		"id": "Ferocious Roar",
		"baseSkillId": 42145,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "HeavyAttackSpeed",
		"display": "%",
		"rawInputMatch": /(Your Heavy Attacks also are [0-9]+% faster for [0-9]+ seconds after casting\.)/i,
		"match": /Your Heavy Attacks also are ([0-9]+)% faster for/i
	},
	{
		"statId": "LADamage",
		"display": "%",
		"match": /and your Light Attacks deal ([0-9]+)% more damage/i
	},
	{
		"statId": "Magicka",
		"display": "%",
		"match": /While slotted, your Max Magicka is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "Magicka",
		"display": "%",
		"match": /and your Max Magicka is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Blood Scion",
		"baseSkillId": 41920,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill2",
		"statId": "Magicka",
		"match": /While transformed, your Max Health, Magicka, and Stamina are increased by ([0-9]+),/i
	},
	{
		"category": "Skill",
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /While slotted, the cost of all your abilities are reduced by ([0-9]+)%/i
	},
	{
		"id": "Crystal Weapon (Cost)",
		"matchSkillName": false,
		"baseSkillId": 47552,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "MagickaCost",
		"factorValue": -1,
		"display": "%",
		"rawInputMatch": /(After casting, your next non-Ultimate ability used within [0-9]+ seconds costs [0-9.]+% less\.)/i,
		"match": /After casting, your next non-Ultimate ability used within [0-9]+ seconds costs ([0-9.]+)% less/i
	},
	{
		"id": "Equilibrium",
		"displayName": "Spell Symmetry",
		"baseSkillId": 42251,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "MagickaCost",
		"combineAs": "*%",
		"factorValue": -1,
		"display": "%",
		"rawInputMatch": /(After the exchange is complete, the cost of your next Magicka ability is reduced by [0-9]+% for [0-9]+ seconds\.)/i,
		"match": /After the exchange is complete, the cost of your next Magicka ability is reduced by ([0-9]+)% for/i
	},
	{
		"id": "Molten Whip",
		"matchSkillName": true,
		"baseSkillId": 23811,
		"category": "SkillDamage",
		"statId": "Molten Whip",
		"toggle": true,
		"enabled": false,
		"maxTimes": 3,
		"display": "%",
		"match": /Whenever you activate a different Ardent Flame ability, you gain a stack of Seething Fury, increasing the damage of your next Molten Whip by ([0-9]+)% and your Weapon and Spell Damage by [0-9]+ /i
	},
	{
		"id": "Immovable",
		"baseSkillId": 41082,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "MovementSpeed",
		"factorValue": -1,
		"display": "%",
		"match": /but reduces your Movement Speed by ([0-9.]+)% for/i
	},
	{
		"id": "Daedric Prey",
		"baseSkillId": 30499,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "PetDamageDone",
		"display": "%",
		"rawInputMatch": /(While the curse is active, your pets deal an additional [0-9.]+% damage to the target\.)/i,
		"match": /While the curse is active, your pets deal an additional ([0-9.]+)% damage to the target/i
	},
	{
		"id": "Protective Scale",
		"baseSkillId": 33743,
		"category": "Skill",
		"statId": "RangedDamageTaken",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"display": "%",
		"factorValue": -1,
		"match": /Flex your scales, reducing your damage taken from projectiles by ([0-9]+)%/i
	},
	{
		"id": "Protective Scale",
		"baseSkillId": 33743,
		"category": "Skill",
		"statId": "RangedDamageTaken",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"display": "%",
		"factorValue": -1,
		"match": /Flex your scales, reducing damage taken from projectiles by ([0-9]+)%/i
	},
	{
		"id": "Summoner's Armor",
		"baseSkillId": 40115206,
		"category": "SkillCost",
		"statId": "Skeletal_Mage_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"factorValue": -1,
		"match": /While active, reduce the cost of Blastbones, Skeletal Mage, and Spirit Mender by ([0-9]+)%/i
	},
	{
		"statId": "SneakSpeed",
		"category": "Skill",
		"display": "%",
		"rawInputMatch": /(While slotted, your Movement Speed while Sneaking or invisible is increased by [0-9]+\.?[0-9]*%\.)/i,
		"match": /While slotted, your Movement Speed while Sneaking or invisible is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Flawless Dawnbreaker",
		"baseSkillId": "42566",
		"category": "Skill2",
		"statId": "SpellDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /After activating, your Weapon and Spell Damage is increased by ([0-9]+) for /i
	},
	{
		"id": "Molten Whip",
		"matchSkillName": true,
		"baseSkillId": 23811,
		"category": "Skill2",
		"statId": "SpellDamage",
		"toggle": true,
		"enabled": false,
		"maxTimes": 3,
		"match": /Whenever you activate a different Ardent Flame ability, you gain a stack of Seething Fury, increasing the damage of your next Molten Whip by [0-9]+% and your Weapon and Spell Damage by ([0-9]+) /i
	},
	{
		"id": "Grim Focus",
		"baseSkillId": 62096,
		"category": "Skill2",
		"statId": "SpellDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"maxTimes": 5,
		"match": /Focus your senses for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+) with every Light or Heavy Attack/i
	},
	{
		"id": "Grim Focus",
		"baseSkillId": 62096,
		"category": "Skill2",
		"statId": "SpellDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"maxTimes": 5,
		"match": /Focus your senses for [0-9]+ minute, increasing your Weapon and Spell Damage by ([0-9]+) with every Light or Heavy Attack/i
	},
	{
		"id": "Summoner's Armor",
		"baseSkillId": 40115206,
		"category": "SkillCost",
		"statId": "Spirit_Mender_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"factorValue": -1,
		"match": /While active, reduce the cost of Blastbones, Skeletal Mage, and Spirit Mender by ([0-9]+)%/i
	},
	{
		"statId": "Stamina",
		"display": "%",
		"match": /While slotted, your Max Stamina is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Blood Scion",
		"baseSkillId": 41920,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill2",
		"statId": "Stamina",
		"match": /While transformed, your Max Health, Magicka, and Stamina are increased by ([0-9]+),/i
	},
	{
		"category": "Skill",
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /While slotted, the cost of all your abilities are reduced by ([0-9]+)%/i
	},
	{
		"id": "Crystal Weapon (Cost)",
		"matchSkillName": false,
		"baseSkillId": 47552,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "StaminaCost",
		"factorValue": -1,
		"display": "%",
		"match": /After casting, your next non-Ultimate ability used within [0-9]+ seconds costs ([0-9.]+)% less/i
	},
	{
		"statId": "StaminaRegen",
		"display": "%",
		"match": /While slotted, your Stamina Recovery is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Summon Twilight Tormentor",
		"baseSkillId": 30587,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "SkillDamage",
		"statId": "Summon Twilight Tormentor",
		"display": "%",
		"rawInputMatch": /(Once summoned, you can activate the twilight tormentor's special ability for [0-9.]+ Magicka, causing it to deal [0-9.]+% more damage to enemies above [0-9.]+% Health for [0-9.]+ seconds\.)/i,
		"match": /you can activate the twilight tormentor's special ability for [0-9.]+ Magicka, causing it to deal ([0-9.]+)% more damage/i
	},
	{
		"category": "Skill",
		"statId": "UltimateCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /While slotted, the cost of all your abilities are reduced by ([0-9]+)%/i
	},
	{
		"id": "Blood Scion",
		"displayName": "Perfect Scion",
		"baseSkillId": 41920,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill",
		"statId": "VampireStage",
		"statValue": 5,
		"match": /You also ascend to Vampire Stage 5, which grants all the benefits of Vampire Stage 4 with none of the drawbacks\./i
	},
	{
		"id": "Brutal Pounce",
		"baseSkillId": 42110,
		"matchSkillName": true,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"category": "Skill2",
		"statId": "WeaponDamage",
		"maxTimes": 6,
		"rawInputMatch": /(Increases your Weapon and Spell Damage by [0-9]+ for each enemy hit, up to a maximum of [0-9]+ times\.)/i,
		"match": /Increases your Weapon and Spell Damage by ([0-9]+) for each enemy hit, up to a maximum of [0-9]+ times/i
	},
	{
		"id": "Flawless Dawnbreaker",
		"baseSkillId": "42566",
		"category": "Skill2",
		"statId": "WeaponDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"match": /After activating, your Weapon and Spell Damage is increased by ([0-9]+) for /i
	},
	{
		"id": "Molten Whip",
		"matchSkillName": true,
		"baseSkillId": 23811,
		"category": "Skill2",
		"statId": "WeaponDamage",
		"toggle": true,
		"enabled": false,
		"maxTimes": 3,
		"match": /Whenever you activate a different Ardent Flame ability, you gain a stack of Seething Fury, increasing the damage of your next Molten Whip by [0-9]+% and your Weapon and Spell Damage by ([0-9]+) /i
	},
	{
		"id": "Grim Focus",
		"baseSkillId": 62096,
		"category": "Skill2",
		"statId": "WeaponDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"maxTimes": 5,
		"match": /Focus your senses for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+) with every Light or Heavy Attack/i
	},
	{
		"id": "Grim Focus",
		"baseSkillId": 62096,
		"category": "Skill2",
		"statId": "WeaponDamage",
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"maxTimes": 5,
		"match": /Focus your senses for [0-9]+ minute, increasing your Weapon and Spell Damage by ([0-9]+) with every Light or Heavy Attack/i
	}
];


window.ESO_PASSIVEEFFECT_MATCHES = 
[
	{
		"id": "Exploitation",
		"baseSkillId": 31389,
		"toggle": true,
		"enabled": false,
		"buffId": "Minor Prophecy",
		"match": /When you cast a Dark Magic ability you grant Minor Prophecy to you and your group/i
	},
	{
		"id": "Illuminate",
		"baseSkillId": 31743,
		"toggle": true,
		"enabled": false,
		"buffId": "Minor Sorcery",
		"match": /Casting a Dawn's Wrath ability grants Minor Sorcery to you and your group/i
	},
	{
		"id": "Might of the Guild",
		"baseSkillId": 43561,
		"toggle": true,
		"enabled": false,
		"buffId": "Empower",
		"match": /Casting a Mages Guild ability has a [0-9]+% chance of granting you Empower/i
	},
	{
		"id": "Might of the Guild",
		"baseSkillId": 43561,
		"toggle": true,
		"enabled": false,
		"buffId": "Empower",
		"match": /Casting a Mages Guild ability grants you Empower/i
	},
	{
		"id": "Maturation",
		"baseSkillId": 85880,
		"toggle": true,
		"enabled": false,
		"buffId": "Minor Toughness",
		"match": /When you activate a heal on yourself or an ally you grant the target Minor Toughness/i
	},
	{
		"id": "Accelerated Growth",
		"baseSkillId": 85882,
		"toggle": true,
		"enabled": false,
		"buffId": "Major Mending",
		"match": /When you heal yourself or an ally under [0-9]+% Health with a Green Balance ability you gain Major Mending/i
	},
	{
		"id": "Sacred Ground",
		"baseSkillId": 31757,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Minor Mending",
		"match": /While standing in your own Cleansing Ritual, Rune Focus, or Rite of Passage areas of effect and for up to [0-9.]+ seconds after leaving them you gain Minor Mending/i
	},
	{
		"id": "Sacred Ground",
		"baseSkillId": 31757,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"buffId": "Minor Mending",
		"match": /While standing in your own Cleansing Ritual, Rune Focus, or Rite of Passage area effects and for up to [0-9.]+ seconds after leaving them you gain Minor Mending/i
	},
	{
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"buffId": "Major Gallop",
		"match": /Gain Major Gallop at all times/i
	},
	{
		"id": "Hemorrhage",
		"buffId": "Minor Savagery",
		"baseSkillId": 36641,
		"toggle": true,
		"enabled": false,
		"rawInputMatch": /(Dealing Critical Damage grants you and your group Minor Savagery, increasing your Weapon Critical rating by [0-9]+ for [0-9]+ seconds\.)/i,
		"match": /Dealing Critical Damage grants you and your group Minor Savagery, increasing your Weapon Critical rating by/i
	},
	{
		"id": "Mountain's Blessing",
		"baseSkillId": 29473,
		"buffId": "Minor Brutality",
		"toggle": true,
		"enabled": false,
		"match": /When you cast an Earthen Heart ability, you and your group members gain Minor Brutality for [0-9]+ seconds/i
	},
	{
		"id": "Shadow Barrier",
		"baseSkillId": 18866,
		"buffId": "Major Resolve",
		"toggle": true,
		"enabled": false,
		"match": /Casting a Shadow ability grants you Major Resolve for [0-9]+ seconds/i
	},
	{
		"id": "Shadow Barrier",
		"baseSkillId": 18866,
		"buffId": "Major Ward",
		"toggle": true,
		"enabled": false,
		"match": /Casting a Shadow ability grants you Major Resolve for [0-9]+ seconds/i
	},
	{
		"statId": "AlliancePointsGained",
		"display": "%",
		"match": /Increases your Alliance Points gained by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statRequireId": "WeaponShockStaff",
		"statRequireValue": 1,
		"statId": "AOEDamageDone",
		"display": "%",
		"match": /Lightning Staff increases your damage done with area of effect abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Medium Armor Bonus: Roll Dodge",
		"baseSkillId": 150181,
		"statId": "AOEDamageTaken",
		"display": "%",
		"factorStatId": "ArmorMedium",
		"factorValue": -1,
		"toggle": true,
		"enabled": false,
		"rawInputMatch": /(Reduces damage taken from Area of Effect attacks by [0-9.]+% for [0-9.]+ seconds after you use Roll Dodge)/i,
		"match": /Reduces damage taken from Area of Effect attacks by ([0-9.]+)% for /i
	},
	{
		"category": "SkillDuration",
		"statId": "Ash Cloud",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Aspect of Terror",
		"match": /Increases the duration of your non-invisibility based Shadow abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"statId": "BashCost",
		"display": "%",
		"factorValue": -1,
		"match": /Improves your standard bash attacks, causing them to deal [0-9]+ more damage and cost ([0-9.]+)% less Stamina/i
	},
	{
		"statId": "BashCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BashCost",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Bash by ([0-9.]+)%/i
	},
	{
		"statId": "BashDamage",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /Decreases damage done with Bash by ([0-9.]+)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Berserker_Strike_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Reusable Parts",
		"baseSkillId": 116186,
		"category": "SkillCost",
		"statId": "Blastbones_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"factorValue": -1,
		"match": /When your Blastbones, Skeletal Mage, or Spirit Mender dies, the cost of your next Blastbones, Skeletal Mage, or Spirit Mender is reduced by ([0-9]+)%/i
	},
	{
		"statId": "BleedDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /Increases damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "BleedDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"match": /Reduces damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"statId": "BlockCost",
		"display": "%",
		"factorValue": -1,
		"match": /and reduces the cost of blocking by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statRequireId": "WeaponFrostStaff",
		"statRequireValue": 1,
		"statId": "BlockCost",
		"display": "%",
		"factorValue": -1,
		"match": /Equipping an Ice Staff reduces the cost of blocking by ([0-9]+\.?[0-9]*)% and increases the amount of damage you block by [0-9]+\.?[0-9]*%/i
	},
	{
		"statId": "BlockCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BlockCost",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /Increases the cost of Block by ([0-9.]+)%/i
	},
	{
		"statId": "BlockCost",
		"display": "%",
		"factorStatId": "ArmorMedium",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Block by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statRequireId": "WeaponFrostStaff",
		"statRequireValue": 1,
		"statId": "BlockMitigation",
		"display": "%",
		"match": /Equipping an Ice Staff reduces the cost of blocking by [0-9]+\.?[0-9]*% and increases the amount of damage you block by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BlockMitigation",
		"display": "%",
		"match": /^Increases the amount of damage you block by ([0-9]+)%/i
	},
	{
		"id": "Sacred Ground",
		"baseSkillId": 31757,
		"toggle": true,
		"enabled": false,
		"enableOffBar": true,
		"statId": "BlockMitigation",
		"display": "%",
		"match": /Also increases the amount of damage you can block by ([0-9.]+)% for the duration/i
	},
	{
		"statId": "BlockMitigation",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /[\n\r]+Increases the amount of damage blocked by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"statId": "BlockSpeedPenalty",
		"display": "%",
		"match": /Reduces the Movement Speed penalty of Bracing[\s\S]+Current penalty: ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Bow_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BowExperience",
		"display": "%",
		"match": /Increases your experience gain with the Bow skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BreakFreeCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "BreakFreeCost",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Break Free by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statId": "BurningDamage",
		"display": "%",
		"match": /Increases the damage of your Burning and Poisoned status effects by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "Constitution",
		"factorStatId": "ArmorHeavy",
		"match": /You restore ([0-9]+) Magicka and Stamina when you take damage/i
	},
	{
		"category": "SkillDuration",
		"statId": "Consuming Darkness",
		"match": /Increases the duration of your non-invisibility based Shadow abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "CritDamage",
		"display": "%",
		"match": /Increases your Critical Damage and Healing done rating by ([0-9]+)% for every piece of Medium Armor equipped/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "CritDamage",
		"display": "%",
		"factorValue": 0.5,
		"match": /Increases your Critical Damage and Healing done rating by ([0-9]+)% for every 2 pieces of Medium Armor equipped/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponAxe",
		"statId": "CritDamage",
		"display": "%",
		"rawInputMatch": /(Each axe increases your Critical Damage done by [0-9]+\.?[0-9]*%\.)/i,
		"match": /Each axe increases your Critical Damage done by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statRequireId": "Weapon2H",
		"statRequireValue": 1,
		"factorStatId": "WeaponAxe",
		"category": "Skill",
		"statId": "CritDamage",
		"display": "%",
		"match": /Axes increase your Critical Damage done by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "CritDamage",
		"display": "%",
		"match": /Increases your Critical Damage and Critical healing by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Glacial Presence",
		"baseSkillId": 86191,
		"statId": "CritDamage",
		"toggle": true,
		"enabled": false,
		"display": "%",
		"match": /Enemies and allies who have recently been Chilled take ([0-9.]+)% more Critical Damage and Healing from you/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "CritHealing",
		"display": "%",
		"match": /Increases your Critical Damage and Healing done rating by ([0-9]+)% for every piece of Medium Armor equipped/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "CritHealing",
		"display": "%",
		"factorValue": 0.5,
		"match": /Increases your Critical Damage and Healing done rating by ([0-9]+)% for every 2 pieces of Medium Armor equipped/i
	},
	{
		"statId": "CritHealing",
		"display": "%",
		"match": /Increases your Critical Damage and Critical healing by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Glacial Presence",
		"baseSkillId": 86191,
		"statId": "CritHealing",
		"toggle": true,
		"enabled": false,
		"display": "%",
		"match": /Enemies and allies who have recently been Chilled take ([0-9.]+)% more Critical Damage and Healing from you/i
	},
	{
		"factorSkillLine": "ANIMAL COMPANIONS",
		"statId": "DamageDone",
		"display": "%",
		"match": /Increases your damage done by ([0-9]+\.?[0-9]*)% for each Animal Companion ability slotted/i
	},
	{
		"id": "Amplitude",
		"baseSkillId": 31422,
		"statId": "DamageDone",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"maxTimes": 10,
		"match": /Increases your damage done against enemies by [0-9]+% for every [0-9]+% current Health they have/i
	},
	{
		"id": "Deliberation",
		"baseSkillId": 103972,
		"toggle": true,
		"enabled": false,
		"statId": "DamageTaken",
		"factorValue": -1,
		"display": "%",
		"match": /While you are casting or channeling a Psijic Order ability you reduce your damage taken by ([0-9]+)%/i
	},
	{
		"id": "Heavy Armor Bonus: Crowd Control",
		"baseSkillId": 150184,
		"statId": "DamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"toggle": true,
		"enabled": false,
		"rawInputMatch": /(Reduces your damage taken while immune to crowd control by [0-9.]+%)/i,
		"match": /Reduces your damage taken while immune to crowd control by ([0-9.]+)%/i
	},
	{
		"id": "Undeath",
		"baseSkillId": 33093,
		"statRequireId": "VampireStage",
		"statRequireValue": 3,
		"category": "Skill",
		"statId": "DamageTaken",
		"display": "%",
		"factorValue": -1,
		"toggle": true,
		"enabled": false,
		"maxTimes": 30,
		"match": /Reduces your damage taken by up to [0-9]+\.?[0-9]*% based on your missing Health/i
	},
	{
		"id": "Spell Recharge",
		"baseSkillId": 35993,
		"statId": "DamageTaken",
		"display": "%",
		"factorValue": -1,
		"toggle": true,
		"enabled": false,
		"match": /When you are using an ability with a channel or cast time, you take ([0-9]+\.?[0-9]*)% less damage/i
	},
	{
		"category": "SkillCost",
		"statId": "Destruction_Staff_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "DestructionExperience",
		"display": "%",
		"match": /Increases your experience gain with the Destruction Staff skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "Skill",
		"statId": "DestructionPenetration",
		"display": "%",
		"match": /Your Destruction Staff abilities ignore ([0-9]+)% of the enemy's Spell Resistance./i
	},
	{
		"statId": "DiseaseDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /Increases damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "DiseaseDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"match": /Reduces damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "DiseaseResist",
		"match": /and your Disease and Poison Resistance by ([0-9]+)/i
	},
	{
		"statId": "DotDamageDone",
		"display": "%",
		"match": /Increases your damage done with damage over time effects by ([0-9]+)%/i
	},
	{
		"id": "Disdain Harm",
		"baseSkillId": 116239,
		"statId": "DotDamageTaken",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"factorValue": -1,
		"match": /Reduce the damage you take from damage over time abilities by ([0-9]+)% while you have a Bone Tyrant ability active/i
	},
	{
		"category": "SkillDuration",
		"statId": "Dragonknight Standard",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"category": "SkillDotDamage",
		"statId": "Dragonknight Standard",
		"display": "%",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)% and the duration by [0-9]+\.?[0-9]* seconds/i
	},
	{
		"category": "SkillDuration",
		"statId": "Dragonknight Standard",
		"match": /Increases the duration of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"statId": "DrinkDuration",
		"match": /Increases the duration of any consumed drink by ([0-9]+\.?[0-9]*) minutes/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"category": "SkillCost",
		"statId": "Dual_Wield_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the Stamina cost of Dual Wield abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Dual_Wield_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "DualWieldExperience",
		"display": "%",
		"match": /Increases your experience gain with the Dual Wield skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Eclipse",
		"match": /Increases the duration of your Sun Fire, Eclipse, Solar Flare, and Nova abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"category": "SkillCost",
		"statId": "Elemental_Storm_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Entropy",
		"display": "%",
		"match": /Increases the duration of your Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "ExperienceGained",
		"display": "%",
		"match": /Increases your experience gained by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statRequireId": "Weapon1HShield",
		"statRequireValue": 1,
		"statId": "ExtraBashDamage",
		"match": /Improves your standard bash attacks, causing them to deal ([0-9]+) more damage and/i
	},
	{
		"statId": "FallDamageTaken",
		"display": "%",
		"factorValue": -1,
		"match": /Decreases your fall damage taken by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Fiery Breath",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"category": "SkillDotDamage",
		"statId": "Fiery Breath",
		"display": "%",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)% and the duration by [0-9]+\.?[0-9]* seconds/i
	},
	{
		"category": "SkillDuration",
		"statId": "Fiery Breath",
		"match": /Increases the duration of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"category": "SkillLineDamage",
		"statId": "Fighters_Guild",
		"display": "%",
		"match": /Your Fighters Guild abilities deal an additional ([0-9]+\.?[0-9]*)% damage/i
	},
	{
		"id": "Skilled Tracker",
		"baseSkillId": 40393,
		"category": "SkillLineDamage",
		"statId": "Fighters_Guild",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Your Fighters Guild abilities deal an additional ([0-9]+\.?[0-9]*)% damage. This bonus doubles against player Vampires and Werewolves/i
	},
	{
		"category": "SkillCost",
		"statId": "Fighters_Guild_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /reduces the Stamina cost of your Fighters Guild abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Fire Rune",
		"display": "%",
		"match": /Increases the duration of your Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "FlameDamageDone",
		"display": "%",
		"match": /Increases the damage of your Flame and Poison attacks by ([0-9.]+)%/i
	},
	{
		"statId": "FlameDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /Reduces damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"statId": "FlameDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /Increases damage taken from Magical attacks by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statId": "FlameResist",
		"match": /Increases your Flame Resistance by ([0-9]+)\./i
	},
	{
		"statId": "FoodDuration",
		"match": /Increases the duration of any eaten food by ([0-9]+\.?[0-9]*) minutes/i
	},
	{
		"statId": "FrostDamageDone",
		"display": "%",
		"match": /Increases your Magic and Frost Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "FrostDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /Reduces damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"statId": "FrostDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /Increases damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"statId": "GoldGained",
		"display": "%",
		"match": /Increases your gold gained by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"factorSkillLine": "GREEN BALANCE",
		"category": "SkillHealing",
		"statId": "Green_Balance",
		"display": "%",
		"match": /Increases your healing done with Green Balance abilities by ([0-9]+\.?[0-9]*)% for each Green Balance ability slotted/i
	},
	{
		"factorSkillLine": "GREEN BALANCE",
		"category": "SkillHealing",
		"statId": "Green_Balance",
		"display": "%",
		"match": /Increase your healing done with Green Balance abilities by ([0-9]+\.?[0-9]*)% for each Green Balance ability slotted/i
	},
	{
		"statRequireId": "WeaponFlameStaff",
		"statRequireValue": 1,
		"statId": "HADamage",
		"display": "%",
		"match": /Fully-charged Inferno Staff Heavy Attacks deal ([0-9]+\.?[0-9]*)% additional damage./i
	},
	{
		"statId": "HAMagRestore",
		"factorStatId": "ArmorHeavy",
		"display": "%",
		"match": /Increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)% for each piece of Heavy Armor worn/i
	},
	{
		"statId": "HAStaRestore",
		"factorStatId": "ArmorHeavy",
		"display": "%",
		"match": /Increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)% for each piece of Heavy Armor worn/i
	},
	{
		"id": "Near-Death Experience",
		"baseSkillId": 116273,
		"requireSkillLine": "LIVING DEATH",
		"category": "Skill",
		"statId": "HealCrit",
		"display": "%",
		"maxTimes": 20,
		"statValue": 1,
		"toggle": true,
		"enabled": false,
		"match": /While you have a Living Death ability slotted, your Critical Strike Chance with all healing abilities is increased by up to [0-9]+% in proportion to the severity of the target's wounds/i
	},
	{
		"factorSkillLine": "SIPHONING",
		"statId": "HealingDone",
		"display": "%",
		"match": /Increases your healing done by ([0-9]+\.?[0-9]*)% for each Siphoning ability slotted/i
	},
	{
		"statId": "HealingDone",
		"display": "%",
		"match": /Increases your healing done by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"id": "Curative Curse",
		"baseSkillId": 116286,
		"statId": "HealingDone",
		"toggle": true,
		"enabled": false,
		"display": "%",
		"match": /While you have a negative effect on you, your healing done is increased by ([0-9]+)%/i
	},
	{
		"id": "Combat Medic",
		"baseSkillId": 39259,
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "HealingDone",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases your healing done by ([0-9]+\.?[0-9]*)% when you are near a Keep/i
	},
	{
		"factorStatId": "ArmorHeavy",
		"statId": "HealingReceived",
		"factorValue": 0.5,
		"display": "%",
		"match": /Increases your healing received by ([0-9]+\.?[0-9]*)% for every 2 pieces of Heavy Armor worn/i
	},
	{
		"factorStatId": "ArmorHeavy",
		"statId": "HealingReceived",
		"display": "%",
		"match": /Increases your healing received by ([0-9]+\.?[0-9]*)% for each piece of Heavy Armor worn/i
	},
	{
		"id": "Health Avarice",
		"baseSkillId": 116269,
		"statId": "HealingReceived",
		"factorSkillLine": "BONE TYRANT",
		"display": "%",
		"match": /Increase your Healing Received by ([0-9]+)% for each Bone Tyrant ability slotted/i
	},
	{
		"id": "Burning Heart",
		"baseSkillId": 29457,
		"statId": "HealingReceived",
		"toggle": true,
		"enabled": false,
		"display": "%",
		"match": /While a Draconic Power ability is active, your healing received is increased by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"factorStatId": "ArmorHeavy",
		"statId": "Health",
		"display": "%",
		"match": /Increases your Max Health by ([0-9]+\.?[0-9]*)% for each piece of Heavy Armor equipped/i
	},
	{
		"factorStatId": "ArmorTypes",
		"statId": "Health",
		"display": "%",
		"match": /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i
	},
	{
		"category": "Skill2",
		"statId": "Health",
		"match": /^Increase your Max Health by ([0-9]+\.?[0-9]*)/i
	},
	{
		"factorSkillLine": "Shadow",
		"statId": "Health",
		"display": "%",
		"match": /Increases your Max Health by ([0-9]+\.?[0-9]*)% for each Shadow ability slotted/i
	},
	{
		"statId": "Health",
		"category": "Skill2",
		"match": /Increases your Max Health by ([0-9]+)\./i
	},
	{
		"statId": "Health",
		"category": "Skill2",
		"match": /Increases your Max Health by ([0-9]+) and/i
	},
	{
		"statId": "Health",
		"category": "Skill2",
		"match": /Increase your Maximum Health, Magicka, and Stamina by ([0-9]+)\./i
	},
	{
		"id": "Expert Summoner",
		"baseSkillId": 31412,
		"statId": "Health",
		"toggle": true,
		"enabled": false,
		"display": "%",
		"match": /Increases your Max Health by ([0-9]+\.?[0-9]*)% while you have a Daedric Summoning ability active/i
	},
	{
		"statId": "HealthCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, and Stamina costs of your non Core Combat abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "HealthCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, Stamina, and Ultimate costs of your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "HealthCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Persistence",
		"baseSkillId": 31378,
		"statId": "HealthCost",
		"factorValue": -1,
		"display": "%",
		"toggle": true,
		"enabled": false,
		"combineAs": "*%",
		"match": /After blocking an attack, your next Health, Magicka, or Stamina ability costs ([0-9]+\.?[0-9]*)% less/i
	},
	{
		"factorStatId": "ArmorHeavy",
		"statId": "HealthRegen",
		"display": "%",
		"match": /Increases your Health Recovery by ([0-9]+\.?[0-9]*)% for each piece of Heavy Armor equipped/i
	},
	{
		"statId": "HealthRegen",
		"display": "%",
		"match": /Increases your Health, Stamina, and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"factorSkillLine": "Draconic Power",
		"statId": "HealthRegen",
		"display": "%",
		"match": /Increases your Health Recovery by ([0-9]+\.?[0-9]*)% for each Draconic Power ability slotted/i
	},
	{
		"requireSkillLine": "DAEDRIC SUMMONING",
		"statId": "HealthRegen",
		"display": "%",
		"match": /Increases your Health and Stamina Recovery by ([0-9]+\.?[0-9]*)% while you have a Daedric Summoning ability slotted./i
	},
	{
		"statId": "HealthRegen",
		"category": "Food",
		"match": /Increases your Health Recovery by ([0-9]+) and/i
	},
	{
		"id": "Undead Confederate",
		"baseSkillId": 116282,
		"category": "Item",
		"statId": "HealthRegen",
		"toggle": true,
		"enabled": false,
		"match": /While you have a Blastbones, Skeletal Mage, or Spirit Mender active, your Health, Magicka, and Stamina Recovery is increased by ([0-9]+)/i
	},
	{
		"statId": "HeavyArmorExperience",
		"display": "%",
		"match": /Increases your experience gain with the Heavy Armor skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "InspirationGained",
		"display": "%",
		"match": /Increases your crafting inspiration gained by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Lacerate_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "LavaDamage",
		"display": "%",
		"match": /Reduces your damage taken from environmental lava by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "LightArmorExperience",
		"display": "%",
		"match": /Increases your experience gain with the Light Armor skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Magelight",
		"display": "%",
		"match": /Increases the duration of your Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Mages_Guild_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the Magicka and Health cost of your Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "MagicDamageDone",
		"display": "%",
		"match": /Increases your Magic and Frost Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "MagicDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /Reduces damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"statId": "MagicDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /Increases damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"factorStatId": "ArmorTypes",
		"statId": "Magicka",
		"display": "%",
		"match": /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i
	},
	{
		"requireSkillLine": "SIPHONING",
		"statId": "Magicka",
		"display": "%",
		"match": /Increases your Max Magicka by ([0-9]+\.?[0-9]*)% while a Siphoning ability is slotted/i
	},
	{
		"factorSkillLine": "Mages Guild",
		"statId": "Magicka",
		"display": "%",
		"match": /Increases your Max Magicka and Magicka Recovery by ([0-9]+\.?[0-9]*)% for each Mages Guild ability slotted/i
	},
	{
		"statId": "Magicka",
		"category": "Skill2",
		"match": /Increases your Max Magicka by ([0-9]+)\./i
	},
	{
		"statId": "Magicka",
		"category": "Skill2",
		"match": /Increases your Max Magicka and Max Stamina by ([0-9]+)(?:\.|\s)/i
	},
	{
		"statId": "Magicka",
		"category": "Skill2",
		"match": /Increase your Maximum Health, Magicka, and Stamina by ([0-9]+)\./i
	},
	{
		"factorStatId": "ArmorLight",
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Magicka cost of your abilities by ([0-9]+\.?[0-9]*)% for each piece of Light Armor/i
	},
	{
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, and Stamina costs of your non Core Combat abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Magicka cost of your abilities by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, Stamina, and Ultimate costs of your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "MagickaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Persistence",
		"baseSkillId": 31378,
		"statId": "MagickaCost",
		"factorValue": -1,
		"display": "%",
		"toggle": true,
		"enabled": false,
		"combineAs": "*%",
		"match": /After blocking an attack, your next Health, Magicka, or Stamina ability costs ([0-9]+\.?[0-9]*)% less/i
	},
	{
		"factorStatId": "ArmorLight",
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Magicka Recovery by ([0-9]+\.?[0-9]*)% for each piece of Light Armor/i
	},
	{
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Magicka Recovery by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Health, Stamina, and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"factorSkillLine": "Mages Guild",
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Max Magicka and Magicka Recovery by ([0-9]+\.?[0-9]*)% for each Mages Guild ability slotted/i
	},
	{
		"factorSkillLine": "Support",
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Magicka Recovery by ([0-9]+\.?[0-9]*)% for each Support ability slotted/i
	},
	{
		"requireSkillLine": "ANIMAL COMPANIONS",
		"statId": "MagickaRegen",
		"display": "%",
		"match": /Increases your Magicka and Stamina recovery by ([0-9]+\.?[0-9]*)% if an Animal Companion ability is slotted/i
	},
	{
		"statId": "MagickaRegen",
		"category": "Food",
		"match": /Increases your Magicka Recovery by ([0-9]+)\./i
	},
	{
		"statId": "MagickaRegen",
		"category": "Food",
		"match": /and your Stamina and Magicka Recovery by ([0-9]+)\./i
	},
	{
		"id": "Continuous Attack",
		"baseSkillId": 39248,
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "MagickaRegen",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /and Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Undead Confederate",
		"baseSkillId": 116282,
		"category": "Item",
		"statId": "MagickaRegen",
		"toggle": true,
		"enabled": false,
		"match": /While you have a Blastbones, Skeletal Mage, or Spirit Mender active, your Health, Magicka, and Stamina Recovery is increased by ([0-9]+)/i
	},
	{
		"category": "SkillDuration",
		"statId": "Magma Armor",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "MediumArmorExperience",
		"display": "%",
		"match": /Increases your experience gain with the Medium Armor skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Molten Weapons",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Medium Armor Bonus: Crowd Control",
		"baseSkillId": 150181,
		"statId": "MovementSpeed",
		"display": "%",
		"factorStatId": "ArmorMedium",
		"toggle": true,
		"enabled": false,
		"rawInputMatch": /(Increases Movement Speed by [0-9.]+% while immune to crowd control)/i,
		"match": /Increases Movement Speed by ([0-9.]+)% while immune to crowd control/i
	},
	{
		"statId": "MovementSpeed",
		"display": "%",
		"match": /Increases your movement speed by ([0-9]+\.?[0-9]*)% and your Physical and Spell Penetration by [0-9]+\./i
	},
	{
		"category": "Skill",
		"statId": "NormalSneakSpeed",
		"statRequireId": "VampireStage",
		"statRequireValue": 1,
		"value": 1,
		"match": /Ignore the movement speed penalty of Sneak/i
	},
	{
		"category": "SkillDuration",
		"statId": "Nova",
		"match": /Increases the duration of your Sun Fire, Eclipse, Solar Flare, and Nova abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"category": "SkillDuration",
		"statId": "Obsidian Shield",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "One_Hand_and_Shield_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "OneHandandShieldExperience",
		"display": "%",
		"match": /Increases your experience gain with the One Hand and Shield skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Panacea_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Path of Darkness",
		"match": /Increases the duration of your non-invisibility based Shadow abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"category": "SkillDuration",
		"statId": "Petrify",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "PhysicalDamageDone",
		"display": "%",
		"match": /Increases your Physical and Shock Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "PhysicalDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /Increases damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "PhysicalDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"match": /Reduces damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponMace",
		"category": "Skill",
		"statId": "PhysicalPenetration",
		"rawInputMatch": /(Each mace increases your Armor Penetration by [0-9]+\.)/i,
		"match": /Each mace increases your Armor Penetration by ([0-9]+)/i
	},
	{
		"statRequireId": "Weapon2H",
		"statRequireValue": 1,
		"factorStatId": "WeaponMace",
		"category": "Skill",
		"statId": "PhysicalPenetration",
		"match": /Maces increase your Armor Penetration by ([0-9]+)/i
	},
	{
		"statId": "PhysicalPenetration",
		"factorStatId": "ArmorLight",
		"match": /Increases your Physical and Spell Penetration by ([0-9.]+) for each piece of Light Armor worn/i
	},
	{
		"id": "Master Assassin",
		"statId": "PhysicalPenetration",
		"baseSkillId": 36616,
		"toggle": true,
		"enabled": false,
		"match": /Increases your Physical and Spell Penetration against enemies you are flanking by ([0-9]+)/i
	},
	{
		"id": "Dismember",
		"baseSkillId": 116192,
		"statId": "PhysicalPenetration",
		"toggle": true,
		"enabled": false,
		"match": /While a Grave Lord ability is active, your Spell and Physical Penetration are increased by ([0-9]+)/i
	},
	{
		"statId": "PhysicalPenetration",
		"match": /Increases your movement speed by [0-9]+\.?[0-9]*% and your Physical and Spell Penetration by ([0-9]+)\./i
	},
	{
		"statId": "PhysicalResist",
		"factorStatId": "ArmorHeavy",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+) for each piece of Heavy Armor equipped/i
	},
	{
		"statId": "PhysicalResist",
		"match": /\% and Physical and Spell Resistance by ([0-9]+)\./i
	},
	{
		"factorSkillLine": "Winter's Embrace",
		"statId": "PhysicalResist",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+) for each Winter's Embrace ability slotted/i
	},
	{
		"statId": "PhysicalResist",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+)\./i
	},
	{
		"id": "Light Weaver",
		"baseSkillId": 31760,
		"toggle": true,
		"enabled": false,
		"statId": "PhysicalResist",
		"match": /While you are channeling Rite of Passage, you gain ([0-9]+) Physical and Spell Resistance/i
	},
	{
		"statId": "PickPocketChance",
		"display": "%",
		"match": /Increases your chance to successfully pickpocket by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "PoisonDamageDone",
		"display": "%",
		"match": /Increases the damage of your Flame and Poison attacks by ([0-9.]+)%/i
	},
	{
		"statId": "PoisonDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /Increases damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "PoisonDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"match": /Reduces damage taken from Martial attacks by ([0-9.]+)%/i
	},
	{
		"statId": "PoisonedDamage",
		"display": "%",
		"match": /Increases the damage of your Burning and Poisoned status effects by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "PoisonResist",
		"match": /and Poison Resistance by ([0-9]+)/i
	},
	{
		"category": "SkillCost",
		"statId": "Psijic_Order_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your Psijic Order abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Rapid_Fire_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Restoration_Staff_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "RestorationExperience",
		"display": "%",
		"match": /Increases your experience gain with the Restoration Staff skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Mending",
		"baseSkillId": 31751,
		"category": "SkillHealing",
		"statId": "Restoring_Light",
		"maxTimes": 12,
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases the healing effects from your Restoring Light abilities by up to [0-9]+\.?[0-9]*%, in proportion to the severity of the target's wounds/i
	},
	{
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "ResurrectSpeed",
		"display": "%",
		"match": /Reduces the time it takes you to resurrect another player by ([0-9]+\.?[0-9]*)% while you are in a PvP area/i
	},
	{
		"statId": "ResurrectSpeed",
		"display": "%",
		"match": /Increases Resurrection speed by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "RollDodgeCost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of Roll Dodge by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor equipped/i
	},
	{
		"statId": "RollDodgeCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "RollDodgeCost",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Roll Dodge by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statId": "RollDodgeCost",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /\s+Increases the cost of Roll Dodge by ([0-9.]+)%[\n\r]+/i
	},
	{
		"category": "SkillDuration",
		"statId": "Searing Strike",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"category": "SkillDotDamage",
		"statId": "Searing Strike",
		"display": "%",
		"match": /Increases the damage over time of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)% and the duration by [0-9]+\.?[0-9]* seconds/i
	},
	{
		"category": "SkillDuration",
		"statId": "Searing Strike",
		"match": /Increases the duration of your Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i
	},
	{
		"category": "SkillCost",
		"statId": "Shield_Wall_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "ShockDamageDone",
		"display": "%",
		"match": /Increases your Physical and Shock Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "ShockDamageTaken",
		"display": "%",
		"factorStatId": "ArmorLight",
		"factorValue": -1,
		"match": /Reduces damage taken from Magical attacks by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statId": "ShockDamageTaken",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /Increases damage taken from Magical attacks by ([0-9.]+)%/i
	},
	{
		"statRequireId": "WeaponFlameStaff",
		"statRequireValue": 1,
		"statId": "SingleTargetDamageDone",
		"display": "%",
		"match": /Equipping an Inferno Staff increases your damage done with single target abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Reusable Parts",
		"baseSkillId": 116186,
		"category": "SkillCost",
		"statId": "Skeletal_Mage_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"factorValue": -1,
		"match": /When your Blastbones, Skeletal Mage, or Spirit Mender dies, the cost of your next Blastbones, Skeletal Mage, or Spirit Mender is reduced by ([0-9]+)%/i
	},
	{
		"statId": "SnareEffect",
		"factorValue": -1,
		"display": "%",
		"match": /Reduce the effectiveness of snares applied to you by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "SnareEffect",
		"factorValue": -1,
		"display": "%",
		"match": /Reduces the effectiveness of snares applied to you by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "SnareEffect",
		"factorStatId": "ArmorLight",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the effectiveness of snares applied to you by ([0-9.]+)% for each piece of Light Armor worn/i
	},
	{
		"statId": "SneakCost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of Sneak by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "SneakCost",
		"display": "%",
		"factorStatId": "ArmorMedium",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Sneak by ([0-9.]+)%[\n\r]+/i
	},
	{
		"statId": "SneakDetectRange",
		"category": "Skill2",
		"match": /Increases your stealth detection radius by ([0-9]+) meters./i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "SneakRange",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the size of your detection area while Sneaking by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor equipped/i
	},
	{
		"statId": "SneakRange",
		"category": "Skill2",
		"factorValue": -1,
		"match": /Decreases your detection radius in Stealth by ([0-9]+) meters./i
	},
	{
		"statId": "SneakRange",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"match": /Increases the size of your detection area while Sneaking by ([0-9.]+)%/i
	},
	{
		"statId": "SneakSpeed",
		"display": "%",
		"factorStatId": "ArmorLight",
		"match": /[\n\r]+Reduces the Movement Speed penalty of Sneak by ([0-9.]+)%[\n\r]+/i
	},
	{
		"category": "SkillDuration",
		"statId": "Solar Flare",
		"match": /Increases the duration of your Sun Fire, Eclipse, Solar Flare, and Nova abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponDagger",
		"category": "Skill2",
		"statId": "SpellCrit",
		"rawInputMatch": /(Each dagger increases your Critical Chance rating by [0-9]+)/i,
		"match": /Each dagger increases your Critical Chance rating by ([0-9]+)/i
	},
	{
		"factorSkillLine": "Assassination",
		"category": "Skill2",
		"statId": "SpellCrit",
		"match": /Increases your Weapon and Spell Critical ratings by ([0-9]+) for each Assassination ability slotted/i
	},
	{
		"statId": "SpellCrit",
		"category": "Skill2",
		"factorStatId": "ArmorLight",
		"match": /Increases your Weapon and Spell Critical rating by ([0-9.]+) for each piece of Light Armor equipped/i
	},
	{
		"id": "Death Knell",
		"baseSkillId": 116197,
		"statId": "SpellCrit",
		"factorSkillLine": "GRAVE LORD",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases your Critical Strike Chance against enemies under [0-9]+% Health by ([0-9]+)% for each Grave Lord ability slotted/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "SpellDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor worn/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponSword",
		"category": "Skill2",
		"statId": "SpellDamage",
		"rawInputMatch": /(Each sword increases your Weapon and Spell Damage by [0-9]+)/i,
		"match": /Each sword increases your Weapon and Spell Damage by ([0-9]+)/i
	},
	{
		"statId": "SpellDamage",
		"display": "%",
		"match": /^Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and Physical /i
	},
	{
		"factorSkillType": "Sorcerer",
		"statId": "SpellDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each Sorcerer ability slotted/i
	},
	{
		"factorSkillLine": "Fighters Guild",
		"statId": "SpellDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each Fighters Guild ability slotted/i
	},
	{
		"statRequireId": "Weapon2H",
		"statRequireValue": 1,
		"factorStatId": "WeaponSword",
		"category": "Skill2",
		"statId": "SpellDamage",
		"match": /Swords increase your Weapon and Spell Damage by ([0-9]+)/i
	},
	{
		"statId": "SpellDamage",
		"category": "Skill2",
		"match": /^Increases your Weapon and Spell Damage by ([0-9]+)\./i
	},
	{
		"id": "Continuous Attack",
		"baseSkillId": 39248,
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "SpellDamage",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and Magicka and Stamina Recovery /i
	},
	{
		"id": "Strike from the Shadows",
		"baseSkillId": 33096,
		"statRequireId": "VampireStage",
		"statRequireValue": 2,
		"category": "Skill2",
		"statId": "SpellDamage",
		"toggle": true,
		"enabled": false,
		"match": /When you leave Sneak, invisibility, or Mist Form your Weapon and Spell Damage is increased by ([0-9]+) for/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponMace",
		"category": "Skill",
		"statId": "SpellPenetration",
		"rawInputMatch": /(Each mace increases your Armor Penetration by [0-9]+\.)/i,
		"match": /Each mace increases your Armor Penetration by ([0-9]+)/i
	},
	{
		"statRequireId": "Weapon2H",
		"statRequireValue": 1,
		"factorStatId": "WeaponMace",
		"category": "Skill",
		"statId": "SpellPenetration",
		"match": /Maces increase your Armor Penetration by ([0-9]+)/i
	},
	{
		"statId": "SpellPenetration",
		"factorStatId": "ArmorLight",
		"match": /Increases your Physical and Spell Penetration by ([0-9.]+) for each piece of Light Armor worn/i
	},
	{
		"id": "Master Assassin",
		"statId": "SpellPenetration",
		"baseSkillId": 36616,
		"toggle": true,
		"enabled": false,
		"match": /Increases your Physical and Spell Penetration against enemies you are flanking by ([0-9]+)/i
	},
	{
		"id": "Dismember",
		"baseSkillId": 116192,
		"statId": "SpellPenetration",
		"toggle": true,
		"enabled": false,
		"match": /While a Grave Lord ability is active, your Spell and Physical Penetration are increased by ([0-9]+)/i
	},
	{
		"statId": "SpellPenetration",
		"match": /Increases your movement speed by [0-9]+\.?[0-9]*% and your Physical and Spell Penetration by ([0-9]+)\./i
	},
	{
		"statId": "SpellResist",
		"factorStatId": "ArmorLight",
		"match": /Increases your Spell Resistance by ([0-9]+) for each piece of Light Armor equipped/i
	},
	{
		"statId": "SpellResist",
		"factorStatId": "ArmorHeavy",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+) for each piece of Heavy Armor equipped/i
	},
	{
		"statId": "SpellResist",
		"match": /\% and Physical and Spell Resistance by ([0-9]+)\./i
	},
	{
		"statId": "SpellResist",
		"match": /Increases your Spell Resistance by ([0-9]+)\./i
	},
	{
		"factorSkillLine": "Winter's Embrace",
		"statId": "SpellResist",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+) for each Winter's Embrace ability slotted/i
	},
	{
		"statId": "SpellResist",
		"match": /Increases your Physical and Spell Resistance by ([0-9]+)\./i
	},
	{
		"id": "Light Weaver",
		"baseSkillId": 31760,
		"toggle": true,
		"enabled": false,
		"statId": "SpellResist",
		"match": /While you are channeling Rite of Passage, you gain ([0-9]+) Physical and Spell Resistance/i
	},
	{
		"id": "Reusable Parts",
		"baseSkillId": 116186,
		"category": "SkillCost",
		"statId": "Spirit_Mender_Cost",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"factorValue": -1,
		"match": /When your Blastbones, Skeletal Mage, or Spirit Mender dies, the cost of your next Blastbones, Skeletal Mage, or Spirit Mender is reduced by ([0-9]+)%/i
	},
	{
		"statId": "SprintCost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of Sprint by ([0-9]+\.?[0-9]*)% and/i
	},
	{
		"statRequireId": "VampireStage",
		"statRequireValue": 4,
		"statId": "SprintCost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of Sprint by ([0-9]+\.?[0-9]*)%\./i
	},
	{
		"statId": "SprintCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "SprintCost",
		"factorStatId": "ArmorLight",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of Sprint by ([0-9.]+)% for each piece of Light Armor worn/i
	},
	{
		"statId": "SprintCost",
		"display": "%",
		"factorStatId": "ArmorMedium",
		"factorValue": -1,
		"match": /[\n\r]+Reduces the cost of Sprint by ([0-9.]+)%[\n\r]+/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "SprintSpeed",
		"display": "%",
		"match": /Increases the movement speed bonus of sprint by ([0-9]+\.?[0-9]*)% for each piece of medium armor/i
	},
	{
		"statId": "SprintSpeed",
		"display": "%",
		"match": /and increases the movement speed bonus of sprint by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "SprintSpeed",
		"display": "%",
		"factorStatId": "ArmorHeavy",
		"factorValue": -1,
		"match": /\s+Reduces the Movement Speed bonus of Sprint by ([0-9.]+)%[\n\r]+/i
	},
	{
		"factorStatId": "ArmorTypes",
		"statId": "Stamina",
		"display": "%",
		"match": /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i
	},
	{
		"statId": "Stamina",
		"category": "Skill2",
		"match": /Increases your Max Stamina by ([0-9]+)\./i
	},
	{
		"statId": "Stamina",
		"category": "Skill2",
		"match": /Increases your Max Stamina by ([0-9]+) and/i
	},
	{
		"statId": "Stamina",
		"category": "Skill2",
		"match": /Increases your Max Magicka and Max Stamina by ([0-9]+)(?:\.|\s)/i
	},
	{
		"statId": "Stamina",
		"category": "Skill2",
		"match": /Increase your Maximum Health, Magicka, and Stamina by ([0-9]+)\./i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Stamina cost of your abilities by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Stamina cost of your abilities by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor equipped/i
	},
	{
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, and Stamina costs of your non Core Combat abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, Stamina, and Ultimate costs of your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "StaminaCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Persistence",
		"baseSkillId": 31378,
		"statId": "StaminaCost",
		"factorValue": -1,
		"display": "%",
		"toggle": true,
		"enabled": false,
		"combineAs": "*%",
		"match": /After blocking an attack, your next Health, Magicka, or Stamina ability costs ([0-9]+\.?[0-9]*)% less/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "StaminaRegen",
		"display": "%",
		"match": /Increases your Stamina Recovery by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor equipped/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "StaminaRegen",
		"display": "%",
		"match": /Increases your Stamina Recovery by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i
	},
	{
		"statId": "StaminaRegen",
		"display": "%",
		"match": /Increases your Health, Stamina, and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"requireSkillLine": "DAEDRIC SUMMONING",
		"statId": "StaminaRegen",
		"display": "%",
		"match": /Increases your Health and Stamina Recovery by ([0-9]+\.?[0-9]*)% while you have a Daedric Summoning ability slotted./i
	},
	{
		"requireSkillLine": "ANIMAL COMPANIONS",
		"statId": "StaminaRegen",
		"display": "%",
		"match": /Increases your Magicka and Stamina recovery by ([0-9]+\.?[0-9]*)% if an Animal Companion ability is slotted/i
	},
	{
		"statId": "StaminaRegen",
		"category": "Food",
		"match": /and your Stamina and Magicka Recovery by ([0-9]+)\./i
	},
	{
		"statId": "StaminaRegen",
		"category": "Food",
		"match": /Increases your Stamina Recovery by ([0-9]+)\./i
	},
	{
		"id": "Continuous Attack",
		"baseSkillId": 39248,
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "StaminaRegen",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /and Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"id": "Undead Confederate",
		"baseSkillId": 116282,
		"category": "Item",
		"statId": "StaminaRegen",
		"toggle": true,
		"enabled": false,
		"match": /While you have a Blastbones, Skeletal Mage, or Spirit Mender active, your Health, Magicka, and Stamina Recovery is increased by ([0-9]+)/i
	},
	{
		"statId": "StatusEffectChance",
		"display": "%",
		"statRequireId": "WeaponDestStaff",
		"statRequireValue": 1,
		"match": /Increases your chance to apply status effects by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Stonefist",
		"display": "%",
		"match": /Increases duration of your Earthen Heart abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statRequireId": "Stealthed",
		"statRequireValue": 1,
		"category": "Target",
		"statId": "StunDuration",
		"display": "%",
		"match": /Increases the duration of the stun from Sneak by ([0-9]+)%/i
	},
	{
		"id": "Master Assassin",
		"statId": "StunDuration",
		"display": "%",
		"match": /Increases the duration of the stun from Sneak by ([0-9.]+)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Summon Shade",
		"match": /Increases the duration of your non-invisibility based Shadow abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"category": "SkillDuration",
		"statId": "Sun Fire",
		"match": /Increases the duration of your Sun Fire, Eclipse, Solar Flare, and Nova abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"statId": "SwimSpeed",
		"display": "%",
		"match": /Increases your swimming speed by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Two_Handed_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your weapon abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "TwoHandedExperience",
		"display": "%",
		"match": /Increases your experience gain with the Two Handed skill line by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "UltimateCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the Health, Magicka, Stamina, and Ultimate costs of your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "UltimateCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of your Ultimate abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"statId": "UltimateCost",
		"display": "%",
		"factorValue": -1,
		"combineAs": "*%",
		"match": /Reduces the cost of all your abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillCost",
		"statId": "Undo_Cost",
		"display": "%",
		"factorValue": -1,
		"match": /Reduces the cost of your Psijic Order abilities by ([0-9]+\.?[0-9]*)%/i
	},
	{
		"category": "SkillDuration",
		"statId": "Veiled Strike",
		"match": /Increases the duration of your non-invisibility based Shadow abilities by ([0-9]+\.?[0-9]*) second/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponDagger",
		"category": "Skill2",
		"statId": "WeaponCrit",
		"rawInputMatch": /(Each dagger increases your Critical Chance rating by [0-9]+)/i,
		"match": /Each dagger increases your Critical Chance rating by ([0-9]+)/i
	},
	{
		"factorSkillLine": "Assassination",
		"category": "Skill2",
		"statId": "WeaponCrit",
		"match": /Increases your Weapon and Spell Critical ratings by ([0-9]+) for each Assassination ability slotted/i
	},
	{
		"statId": "WeaponCrit",
		"category": "Skill2",
		"factorStatId": "ArmorLight",
		"match": /Increases your Weapon and Spell Critical rating by ([0-9.]+) for each piece of Light Armor equipped/i
	},
	{
		"id": "Death Knell",
		"baseSkillId": 116197,
		"statId": "WeaponCrit",
		"factorSkillLine": "GRAVE LORD",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases your Critical Strike Chance against enemies under [0-9]+% Health by ([0-9]+)% for each Grave Lord ability slotted/i
	},
	{
		"factorStatId": "ArmorMedium",
		"statId": "WeaponDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each piece of Medium Armor worn/i
	},
	{
		"statRequireId": "Weapon1H",
		"statRequireValue": 2,
		"factorStatId": "WeaponSword",
		"category": "Skill2",
		"statId": "WeaponDamage",
		"rawInputMatch": /(Each sword increases your Weapon and Spell Damage by [0-9]+)/i,
		"match": /Each sword increases your Weapon and Spell Damage by ([0-9]+)/i
	},
	{
		"statId": "WeaponDamage",
		"display": "%",
		"match": /^Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and Physical /i
	},
	{
		"factorSkillType": "Sorcerer",
		"statId": "WeaponDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each Sorcerer ability slotted/i
	},
	{
		"factorSkillLine": "Fighters Guild",
		"statId": "WeaponDamage",
		"display": "%",
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% for each Fighters Guild ability slotted/i
	},
	{
		"statRequireId": "Weapon2H",
		"statRequireValue": 1,
		"factorStatId": "WeaponSword",
		"category": "Skill2",
		"statId": "WeaponDamage",
		"match": /Swords increase your Weapon and Spell Damage by ([0-9]+)/i
	},
	{
		"statId": "WeaponDamage",
		"category": "Skill2",
		"match": /^Increases your Weapon and Spell Damage by ([0-9]+)\./i
	},
	{
		"id": "Continuous Attack",
		"baseSkillId": 39248,
		"statRequireId": "Cyrodiil",
		"statRequireValue": 1,
		"statId": "WeaponDamage",
		"display": "%",
		"toggle": true,
		"enabled": false,
		"match": /Increases your Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and Magicka and Stamina Recovery/i
	},
	{
		"id": "Strike from the Shadows",
		"baseSkillId": 33096,
		"statRequireId": "VampireStage",
		"statRequireValue": 2,
		"category": "Skill2",
		"statId": "WeaponDamage",
		"toggle": true,
		"enabled": false,
		"match": /When you leave Sneak, invisibility, or Mist Form your Weapon and Spell Damage is increased by ([0-9]+) for/i
	}
];


window.ESO_CPEFFECT_MATCHES = [
	{
		id: "Exploiter",
		toggle: true,
		eanble: false,
		category: "CP",
		statId: "DamageDone",
		display: "%",
		match: /Increases your damage done against Off Balance enemies by ([0-9\.]+)%/i,
	},
	{
		id: "Foresight",
		toggle: true,
		eanble: false,
		category: "CP",
		statId: "MagickaCost",
		combineAs: "*%",
		display: "%",
		factorValue: -1,
		match: /When you drink a potion, the cost of your next Magicka ability used within [0-9\.]+ seconds is reduced by ([0-9\.]+)%/i,
	},
	
		/* CP2 Data Update 29 */
	{
		id: "Arcane Alacrity",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "FlatRollDodgeCost",
		match: /While under the effects of a damage shield your dodge roll costs [0-9\.]+ less stamina per stage.*\s*Current bonus: ([0-9\.]+)/i,
	},
	{
		id: "Backstabber",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "CritDamage",
		display: "%",
		match: /Increases your Critical Damage done by [0-9\.]+% per stage against enemies you are flanking.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	/*// Always on?
	{
		id: "Bastion",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "DamageShield",
		display: "%",
		match: /Increases the effectiveness of your damage shields and damage against shielded enemies by [0-9\.]+% per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	}, */
	{
		id: "Bastion",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "DamageDone",
		display: "%",
		match: /Increases the effectiveness of your damage shields and damage against shielded enemies by [0-9\.]+% per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Foresight",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "MagickaCost",
		combineAs: "*%",
		display: "%",
		factorValue: -1,
		match: /the cost of your Magicka and Stamina healing abilities used within [0-9\.]+ seconds are reduced by ([0-9\.]+)%/i,
	},
	{
		id: "Juggernaut",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "DamageTaken",
		display: "%",
		factorValue: -1,
		match: /While under the effects of Crowd Control Immunity, you take [0-9\.]+% less damage per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "On Guard",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "BlockMitigation",
		display: "%",
		match: /While under the effects of Crowd Control Immunity, increases the amount of damage you block by [0-9\.]+% per stage.*\s*Current (?:value|bonus): ([0-9\.]+)%/i,
	},
	{
		id: "Peace of Mind",
		toggle: true,
		enable: false,
		category: "Item",
		statId: "MagickaRegen",
		match: /Increases Magicka and Health Recovery while under the effects of Crowd Control Immunity by [0-9\.]+ per stage.*\s*Current bonus: ([0-9\.]+)/i,
	},
	{
		id: "Peace of Mind",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "HealthRegen",
		match: /Increases Magicka and Health Recovery while under the effects of Crowd Control Immunity by [[0-9\.]+ per stage.*\s*Current bonus: ([0-9\.]+)/i,
	},
	{
		id: "Preparation",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "DamageTaken",
		factorValue: -1,
		display: "%",
		match: /Reduces your damage taken from non-player attacks by [0-9\.]+% per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Rousing Speed",
		toggle: true,
		enable: false,
		category: "Skill2",
		statId: "SprintCost",
		factorValue: -1,
		match: /Reduces the cost of Sprint by [0-9\.]+ Stamina per stage, while under the effects of Crowd Control Immunity.*\s*Current bonus: ([0-9\.]+)/i,
	},
	{
		id: "Steed's Blessing",
		toggle: true,
		eanble: false,
		statId: "MovementSpeed",
		display: "%",
		match: /Increases your out of combat movement speed by [0-9\.]+% per stage.*\s*Current (?:value|bonus): ([0-9\.]+)%/i,
	},
	{
		id: "Strategic Reserve",
		toggle: true,
		enable: false,
		category: "Item",
		statId: "HealthRegen",
		factorValue: 0.1,
		round: "floor",
		maxTimes: 500,
		match: /Gain ([0-9\.]+) Health Recovery for every 10 Ultimate you have/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "BashCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "BlockCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "BreakFreeCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "RollDodgeCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "SneakCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Survival Instincts",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "SprintCost",
		display: "%",
		factorValue: -1,
		match: /While afflicted with a Status Effect, your core combat skills cost [0-9\.]+% less per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Unchained",
		toggle: true,
		enable: false,
		category: "CP",
		statId: "StaminaCost",
		combineAs: "*%",
		display: "%",
		factorValue: -1,
		match: /When you use Break Free, the cost of your next Stamina ability used within [0-9\.]+ seconds is reduced by [0-9\.]+% per stage.*\s*Current bonus: ([0-9\.]+)%/i,
	},
	{
		id: "Unchained Aggressor",
		toggle: true,
		enable: false,
		buffId: "Major Berserk",
		match: / After Breaking Free, gain Major Berserk for /i,
	},
		// Update 30
	{
		id: "Enlivening Overflow",
		
		toggle: true,
		enable: false,
		onlyManual: true,
		category: "Item",
		statId: "MagickaRegen",
		match: /Overhealing yourself or an ally grants them Health, Magicka, and Stamina Recovery equal to [0-9.]+% of your Max Magicka.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Enlivening Overflow",
		toggle: true,
		eanble: false,
		onlyManual: true,
		category: "Item",
		statId: "StaminaRegen",
		match: /Overhealing yourself or an ally grants them Health, Magicka, and Stamina Recovery equal to [0-9.]+% of your Max Magicka.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Enlivening Overflow",
		toggle: true,
		eanble: false,
		onlyManual: true,
		category: "Item",
		statId: "HealthRegen",
		match: /Overhealing yourself or an ally grants them Health, Magicka, and Stamina Recovery equal to [0-9.]+% of your Max Magicka.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	
		/* CP2 Update 31 */
	{
		id: "Refreshing Stride",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "HealthRegen",
		match: /While Sprinting you gain [0-9.]+ Health and Magicka Recovery.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Refreshing Stride",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "MagickaRegen",
		match: /While Sprinting you gain [0-9.]+ Health and Magicka Recovery.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Sustained by Suffering",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "HealthRegen",
		match: /Increases your Health, Magicka, and Stamina Recovery by [0-9.]+ per stage while under the effects of a negative effect.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Sustained by Suffering",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "MagickaRegen",
		match: /Increases your Health, Magicka, and Stamina Recovery by [0-9.]+ per stage while under the effects of a negative effect.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Sustained by Suffering",
		toggle: true,
		eanble: false,
		category: "Item",
		statId: "StaminaRegen",
		match: /Increases your Health, Magicka, and Stamina Recovery by [0-9.]+ per stage while under the effects of a negative effect.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},
	{
		id: "Pain's Refuge",
		toggle: true,
		eanble: false,
		statId: "DamageTaken",
		maxTimes: 20,
		display: "%",
		factorValue: -1,
		match: /Reduces your damage taken by ([0-9\.]+)% per negative effect active on you, up to a maximum of [0-9\.]+%/i,
	},
	{
		id: "Ward Master",
		toggle: true,
		eanble: false,
		statId: "DamageTaken",
		display: "%",
		factorValue: -1,
		match: /Reduces your damage taken by [0-9.]+% per stage while Blocking and under the effects of a Damage Shield.*\s*Current (?:value|bonus): ([0-9\.]+)/i,
	},

];


window.ESO_SETEFFECT_MATCHES = 
[
	{
		statId: "PhysicalPenetration",
		match: /Adds ([0-9]+) Offensive Penetration/i,
	},
	{
		statId: "SpellPenetration",
		match: /Adds ([0-9]+) Offensive Penetration/i,
	},
	{
		category: "Target",
		statId: "MovementSpeed",
		factorValue: -1,
		display: "%",
		match: /Your Bow attacks reduce the Movement Speed of any enemy they hit by ([0-9]+\.?[0-9]*)% and increase your Movement Speed by [0-9]+\.?[0-9]*% for [0-9\.]+ seconds./i,
	},
	{
		statId: "MovementSpeed",
		display: "%",
		match: /Your Bow attacks reduce the Movement Speed of any enemy they hit by [0-9]+\.?[0-9]*% and increase your Movement Speed by ([0-9]+\.?[0-9]*)% for [0-9\.]+ seconds./i,
	},
	{
		category: "Set",
		statId: "BuffDuration",
		display: "%",
		match: /Increases the duration of all Major buffs.*by ([0-9]+\.?[0-9]*)%/i,
	},
	{	// Deadly strike
		statId: "DotDamageDone",
		display: "%",
		match: /Increase the damage your damage over time and channeled abilities do by ([0-9]+\.?[0-9]*)%/i,
	},
	{	// Deadly strike --  TODO: Check this....Note that bleeds are all DoTs so ignore this to prevent a double effect
		statId: "ChannelDamageDone",
		display: "%",
		match: /Increase the damage your damage over time and channeled abilities do by ([0-9]+\.?[0-9]*)%/i,
	},
	{	// Syvarra's Scales
		statId: "GuardDamage",
		factorValue: -1,
		display: "%",
		match: /Reduces your damage taken from Guards by ([0-9]+)%/i,
	},
	{	// Assassin's Guile
		statId: "PoisonDuration",
		match: /Increases the duration of your alchemical poisons by ([0-9]+) seconds/i,
	},
	{	// Stinging Slashes
		category: "Set",
		statId: "TwinSlashInitialDamage",
		match: /Twin Slashes deals ([0-9]+) more damage for each hit of the initial attack and bleed/i,
	},
	{
		category: "Set",
		statId: "TrapDamageTaken",
		combineAs: "*%",
		display: "%",
		match: /Reduces your damage taken from environmental traps by ([0-9]+)%/i,
	},
	{
		category: "Set",
		statId: "SiegeDamageTaken",
		combineAs: "*%",
		display: "%",
		match: /Reduces your damage taken from Siege Weapons and Player Area of Effect abilities by ([0-9]+)%/i,
	},
	{
		category: "Set",
		statId: "PlayerAOEDamageTaken",
		combineAs: "*%",
		display: "%",
		match: /Reduces your damage taken from Siege Weapons and Player Area of Effect abilities by ([0-9]+)%/i,
	},
	{
		category: "Set",
		statId: "PlayerDamageTaken",
		display: "%",
		combineAs: "*%",
		factorValue: -1,
		match: /Reduces your damage taken from Players by ([0-9]+)%/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Physical",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Physical and Bleed Damage abilities/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Bleed",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Physical and Bleed Damage abilities/i,
	},
	{
		category: "SkillBonusSpellDmg",
		statId: "Frost",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Frost Damage abilities/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Frost",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Frost Damage abilities/i,
	},
	{
		category: "SkillBonusSpellDmg",
		statId: "Magic",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Magic Damage abilities/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Magic",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Magic Damage abilities/i,
	},
	{
		category: "SkillBonusSpellDmg",
		statId: "Shock",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Shock Damage abilities/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Shock",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Shock Damage abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Two Handed",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Two Handed abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Two Handed",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Two Handed abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Dual Wield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Dual Wield abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Dual Wield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Dual Wield abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Restoration Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Restoration Staff abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Restoration Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Restoration Staff abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Destruction Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Destruction Staff abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Destruction Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Destruction Staff abilities/i,
	},
	{
		category: "SkillBonusSpellDmg",
		statId: "Flame",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Flame Damage abilities/i,
	},
	{
		category: "SkillBonusWeaponDmg",
		statId: "Flame",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Flame Damage abilities/i,
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(When an immobilization or snare is applied to you, heal for [0-9]+ Health and restore [0-9]+ Stamina)/i,
		match: /When an immobilization or snare is applied to you, heal for [0-9]+ Health and restore [0-9]+ Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "Werewolf_Transformation_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of your Werewolf Transformation ability by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "Health",
		category: "Skill2", // As of patch 3.1.2 this is calculated differently
		match: /While you have a food buff active, your Max Health is increased by ([0-9]+)/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "HealthRegen",
		category: "Food",
		match: /While you have a food buff active, your Max Health is increased by [0-9]+ and Health Recovery by ([0-9]+)/i,
	},
	{
		statRequireId: "DrinkBuff",
		statRequireValue: 1,
		statId: "Stamina",
		category: "Skill2", // As of patch 3.1.2 this is still normal +set?
		match: /While you have a drink buff active, your Max Stamina is increased by ([0-9]+)/i,
	},
	{
		statRequireId: "DrinkBuff",
		statRequireValue: 1,
		statId: "StaminaRegen",
		category: "Food",
		match: /While you have a drink buff active, your Max Stamina is increased by [0-9]+ and Stamina Recovery by ([0-9]+)/i,
	},
	{
		statRequireId: "DrinkBuff",
		statRequireValue: 1,
		statId: "Magicka",
		category: "Skill2",
		match: /While you have a drink buff active, your Max Magicka is increased by ([0-9]+)/i,
	},
	{
		statRequireId: "DrinkBuff",
		statRequireValue: 1,
		statId: "MagickaRegen",
		category: "Food",
		match: /While you have a drink buff active, your Max Magicka is increased by [0-9]+ and Magicka Recovery by ([0-9]+)/i,
	},
	{
		category: "SkillCost",
		statId: "Bow_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost and increases the damage of your Bow abilities by ([0-9]+)%/i,
	},
	{	/* Check if this actually affects the Bow ultimate */
		category: "SkillCost",
		statId: "Rapid_Fire_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost and increases the damage of your Bow abilities by ([0-9]+)%/i,
	},
	{	
		category: "SkillCost",
		statId: "Shield_Charge_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of Shield Charge by ([0-9]+)%/i,
	},
	{	
		category: "SkillCost",
		statId: "Impulse_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of Impulse by ([0-9]+)%/i,
	},
	{
		buffId: "Major Gallop",
		match: /Gain Major Gallop and Major Expedition at all times/i,
	},
	{
		buffId: "Major Expedition",
		match: /Gain Major Gallop and Major Expedition at all times/i,
	},
	{
		buffId: "Minor Toughness",
		match: /Gain Minor Toughness at all times/i,
	},
	{
		buffId: "Minor Slayer",
		match: /Gain Minor Slayer at all times/i,
	},
	{
		buffId: "Minor Aegis",
		match: /Gain Minor Aegis at all times/i,
	},
	{
		buffId: "Minor Heroism",
		match: /Gain Minor Heroism at all times/i,
	},
	{
		buffId: "Minor Expedition",
		match: /Gain Minor Expedition at all times/i,
	},
	{
		setBonusCount: 2,
		statId: "OtherEffects",
		rawInputMatch: /(When you take damage, you have a [0-9]+% chance to generate [0-9]+ Ultimate)/i,
		match: /When you take damage, you have a [0-9]+% chance to generate ([0-9]+) Ultimate/i,
	},
	{
		setBonusCount: 4,
		statId: "OtherEffects",
		rawInputMatch: /(When you kill an enemy, you gain Major Expedition for [0-9]+ seconds, increasing your Movement Speed by [0-9]+%)/i,
		match: /When you kill an enemy, you gain Major Expedition for [0-9]+ seconds, increasing your Movement Speed by ([0-9]+)%/i,
	},
	{
		setBonusCount: 4,
		statId: "OtherEffects",
		rawInputMatch: /(While Sprinting, restore [0-9]+ Magicka every [0-9]+ second)/i,
		match: /While Sprinting, restore ([0-9]+) Magicka every [0-9]+ second/i,
	},
	{
		setBonusCount: 4,
		statId: "OtherEffects",
		display: '%',
		rawInputMatch: /(increases the damage of your Bow abilities against Players by [0-9]+\.?[0-9]*%)/i,
		match: /increases the damage of your Bow abilities against Players by ([0-9]+\.?[0-9]*)%/i,
	},
	{			// Willow's Path
		setBonusCount: 4,
		category: "Skill2",
		statId: "HealthRegen",
		display: '%',
		match: /Increases your Health, Magicka, and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{			// Willow's Path
		setBonusCount: 4,
		category: "Skill2",
		statId: "MagickaRegen",
		display: '%',
		match: /Increases your Health, Magicka, and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{			// Willow's Path
		setBonusCount: 4,
		category: "Skill2",
		statId: "StaminaRegen",
		display: '%',
		match: /Increases your Health, Magicka, and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BlockMitigation",
		display: "%",
		match: /Increases the amount of damage you block by ([0-9]+)%/i,
	}, 
	{
		buffId: "Major Prophecy",
		match: /Gain Major Prophecy at all times/i,
	},
	{
		buffId: "Major Savagery",
		match: /Gain Major Savagery at all times/i,
	},
	{
		buffId: "Major Savagery",
		match: /Gain Major Savagery and Prophecy at all times/i,
	},
	{
		buffId: "Major Prophecy",
		match: /Gain Major Savagery and Prophecy at all times/i,
	},
	{
		buffId: "Minor Protection",
		match: /Gain Minor Protection at all times/i,
	},
	{
		category: "Skill",
		statId: "NormalSneakSpeed",
		value: 1,
		match: /Ignore the Movement Speed penalty of Sneak/i,
	},
	{
		buffId: "Minor Berserk",
		match: /Gain Minor Berserk at all times/i,
	},
	{
		statId: "BreakFreeCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of Break Free by ([0-9]+)%/i,
	},
	{
		category: "Skill2",
		statId: "SneakDetectRange",
		match: /Increases the radius you can detect Sneaking enemies by ([0-9]+) meters/i,
	},
	{
		statId: "HealingReceived",
		display: "%",
		match: /Increases your healing received by ([0-9]+)%/i,
	},
	{
		statId: "MagickaCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "StaminaCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "UltimateCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "BlockCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "SprintCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "BashCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "HAStaRestore",
		display: "%",
		match: /Increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "HAMagRestore",
		display: "%",
		match: /Increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "SneakCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "RollDodgeCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "BreakFreeCost",	// Assumed
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of all of your abilities by ([0-9]+)%/i,
	},
	{
		statId: "HealingDone",
		display: "%",
		match: /Increases your healing done by ([0-9]+)%/i,
	},
	{
		statId: "StaminaCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the costs of your Stamina abilities by ([0-9]+)%/i,
	},
	{
		statId: "SprintCost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost and increases the Movement Speed bonus of Sprint by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SprintSpeed",
		display: "%",
		match: /Reduces the cost and increases the Movement Speed bonus of Sprint by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		buffId: "Minor Vitality",
		match: /Gain Minor Vitality at all times/i,
	},
	{
		statId: "SneakCost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of Sneak by ([0-9]+)%/i,
	},
	{
		category: "Skill2",
		statId: "SneakRange",
		factorValue: -1,
		match: /Reduces the radius you can be detected while Sneaking by ([0-9]+) meters/i,
	},
	{
		buffId: "Major Sorcery",
		match: /Gain Major Sorcery at all times/i,
	},
	{
		buffId : "Major Brutality",
		match: /Gain Major Brutality at all times/i,
	},
	{
		buffId : "Major Brutality",
		match: /Gain Major Brutality and Sorcery at all times/i,
	},
	{
		buffId : "Major Sorcery",
		match: /Gain Major Brutality and Sorcery at all times/i,
	},
	{
		buffId: "Major Ward",
		match: /Gain Major Ward and Major Resolve at all times/i,
	},
	{
		buffId: "Major Resolve",
		match: /and Major Resolve at all times/i,
	},
	{
		buffId: "Major Resolve",
		match: /Gain Major Resolve at all times/i,
	},
	{
		buffId: "Minor Force",
		match: /Gain Minor Force at all times/i,
	},
	{
		statId: "StaminaCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		match: /Reduces the cost of your Stamina abilities by ([0-9]+)%/i,
	},
	{
		statId: "BleedDamageDone",
		display: "%",
		match: /Increases your Bleed damaging attacks by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealingDone",
		display: "%",
		match: /Adds ([0-9]+)% Healing Done/i,
	},
	{
		buffId: "Minor Mending",
		match: /Gain Minor Mending at all times, increasing your healing done by [0-9]+%/i,
	},
	{
		category: "SkillCost",
		statId: "Restoration_Staff_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of your Restoration Staff abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Panacea_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of your Restoration Staff abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{		// Ebon Set
		// statId: "Health",
		// category: "Skill2",
		buffId: "Ebon Armory",
		updateBuffValue : true,
		match: /Increases your Max Health by ([0-9]+)/i,
	},
	{
		statId: "SprintCost",
		factorValue: -1,
		display: '%',
		match: /Reduces the cost of Sprint and Sneak by ([0-9]+)%/i,
	},
	{
		statId: "SneakCost",
		factorValue: -1,
		display: '%',
		match: /Reduces the cost of Sprint and Sneak by ([0-9]+)%/i,
	},
	{
		statId: "Constitution",
		display: '%',
		match: /Increases the Magicka and Stamina restored from the Constitution passive ability by ([0-9]+)%/i,
	},
	{
		statId: "WeaponDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+)\./,
	},
	{
		statId: "SpellDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+)\./,
	},
	{
		statId: "CritDamage",
		display: "%",
		match: /Increases your Critical Damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		// Archer's Mind
		statId: "CritDamage",
		display: "%",
		match: /Increases your Critical Damage and Healing by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		// Archer's Mind
		statId: "CritHealing",
		display: "%",
		match: /Increases your Critical Damage and Healing by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		// Archer's Mind
		statId: "CritDamage",
		statRequireId: "Stealthed",
		statRequireValue: 1,
		display: "%",
		match: /Increases your Critical Damage and Healing by an additional ([0-9]+\.?[0-9]*)% when you are Sneaking or Invisible./i,
	},
	{
		// Archer's Mind
		statId: "CritHealing",
		statRequireId: "Stealthed",
		statRequireValue: 1,
		display: "%",
		match: /Increases your Critical Damage and Healing by an additional ([0-9]+\.?[0-9]*)% when you are Sneaking or Invisible./i,
	},
	{
		statId: "UltimateCost",
		display: "%",
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces the cost of your Ultimate abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Health",
		match: /Adds ([0-9]+) Maximum Health/i,
	},
	{
		statId: "Magicka",
		match: /Adds ([0-9]+) Maximum Magicka/i,
	},
	{
		statId: "Stamina",
		match: /Adds ([0-9]+) Maximum Stamina/i,
	},
	{
		statId: "HealthRegen",
		match: /Adds ([0-9]+) Health Recovery$/i,
	},
	{
		statId: "MagickaRegen",
		match: /Adds ([0-9]+) Magicka Recovery$/i,
	},
	{
		statId: "StaminaRegen",
		match: /Adds ([0-9]+) Stamina Recovery$/i,
	},
	{
		statId: "SpellResist",
		match: /Adds ([0-9]+) Armor/i,
	},
	{
		statId: "PhysicalResist",
		match: /Adds ([0-9]+) Armor/i,
	},
	{
		statId: "HealingTaken",
		display: '%',
		match: /Adds ([0-9]+\.?[0-9]*)% Healing Taken/i,
	},
	{
		statId: "CritResist",
		match: /Adds ([0-9]+) Critical Resistance/i,
	},
	{
		statId: "MagickaCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces the cost of your Magicka abilities by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "PlayerDamageTaken",
		factorValue: -1,
		display: '%',
		match: /Reduce damage taken from players by ([0-9]+)%/i,
	},
	{
		statId: "TwiceBornStar",
		match: /You can have two Mundus Stone boons at the same time./i,
	},
	{
		// Alessian Order
		statId: "HealthRegenResistFactor",
		display: "%",
		match: /Increase your Health Recovery by ([0-9]+\.?[0-9]*)% of your sum total Physical Resistance and Spell Resistance/i,
	},
	{
		id: "Innate Axiom",
		setBonusCount: 5,
		enabled: false,
		statId: "ClassWeaponDamage",
		match: /Adds ([0-9]+) Spell and Weapon Damage to your Class abilities/i,
	},
	{
		id: "Innate Axiom",
		setBonusCount: 5,
		enabled: false,
		statId: "ClassSpellDamage",
		match: /Adds ([0-9]+) Spell and Weapon Damage to your Class abilities/i,
	},
	{
		requireSkillType: "Armor",
		category: "Skill",
		statId: "Health",
		display: "%",
		match: /While you have an Armor Ability slotted, your Max Health is increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SnareEffect",
		display: "%",
		factorValue: -1,
		match: /Reduce the effectiveness of snares applied to you by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "DisableEffectDuration",
		display: "%",
		factorValue: -1,
		match: /Reduces the duration of immobilizations and snares applied to you by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		statId: "Magicka",
		category: "Skill2",
		match: /While you have a Destruction Staff equipped, your Max Magicka is increased by ([0-9]+)/i,
	},
	{
		statId: "ElfBaneDuration",
		category: "Set",
		match: /Increases the duration of your Flame Damage over Time abilities by ([0-9]+) seconds/i,
	},
	{
		setBonusCount: 4,
		statId: "EnchantCooldown",
		display: "%",
		factorValue: -1,
		match: /Decreases weapon enchantment cooldown by ([0-9]+)% and increases non Oblivion Damage weapon enchantment potency by/i,
	},
	{
		setBonusCount: 4,
		statId: "EnchantPotency",
		display: "%",
		match: /Decreases weapon enchantment cooldown by [0-9]+% and increases non Oblivion Damage weapon enchantment potency by ([0-9]+)%/i,
	},
	{
		id: "Infallible Mage",
		setBonusCount: 4,
		category: "Skill2",
		statId: "HADamage",
		match: /Your Heavy Attacks deal an additional ([0-9]+) damage/i,
	},
	{
		id: "Destructive Impact",
		setBonusCount: 1,
		category: "SkillCost",
		statId: "Destructive_Touch_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of Destructive Touch by ([0-9]+)% and /i,
	},
	{
		id: "Swamp Raider",
		setBonusCount: 4,
		category: "SkillBonusWeaponDmg",
		statId: "Poison",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Poison and Disease Damage abilities./i,
	},
	{
		id: "Swamp Raider",
		setBonusCount: 4,
		category: "SkillBonusWeaponDmg",
		statId: "Disease",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Poison and Disease Damage abilities./i,
	},
	{
		id: "Swamp Raider",
		setBonusCount: 4,
		category: "SkillBonusSpellDmg",
		statId: "Poison",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Poison and Disease Damage abilities./i,
	},
	{
		id: "Swamp Raider",
		setBonusCount: 4,
		category: "SkillBonusSpellDmg",
		statId: "Disease",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Poison and Disease Damage abilities./i,
	},
	{	
		id: "Beckoning Steel",
		setBonusCount: 4,
		buffId: "Beckoning Steel",
		enableOffBar : true,
		match: /Generate an aura that causes you and [0-9]+ group members within the aura to take ([0-9]+)% less damage from projectiles/i,
	},
	{		// Mark of the Pariah
		statId: "SpellResist",
		factorValue: 0.23256,	// Update 22 - Value at 100% health
		round: "floor",
		match: /Increases your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{
		statId: "PhysicalResist",
		factorValue: 0.23256,
		round: "floor",
		match: /Increases your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{
		statId: "MagickaCost",
		display: "%",
		combineAs: "*%",
		match: /Increases the cost of your active abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StaminaCost",
		display: "%",
		combineAs: "*%",
		match: /Increases the cost of your active abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealthCost",
		display: "%",
		combineAs: "*%",
		match: /Increases the cost of your active abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{		// TODO: Ultimate costs?
		category: "SkillCost",
		statId: "Two_Handed_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "One_Hand_and_Shield_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "Dual_Wield_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "Bow_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "Destruction_Staff_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		category: "SkillCost",
		statId: "Restoration_Staff_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the cost of your Weapon abilities by ([0-9]+\.?[0-9]*)% Magicka or Stamina/i,
	},
	{
		statId: "VampireLord",
		statValue: 1,
		match: /Increases the bonuses and penalties of your Vampire Stage, depending on how far you've progressed/i,
	},
	{
		// Leki's Focus
		statId: "AOEDamageDone",
		display: "%",
		factorValue: -1,
		match: /Reduces your damage done with area of effect attacks by ([0-9.]+)%, but grants Major Evasion at all times/i,
	},
	{
		// Leki's Focus
		buffId: "Major Evasion",
		match: /Reduces your damage done with area of effect attacks by ([0-9.]+)%, but grants Major Evasion at all times/i,
	},
	{
		buffId: "Hircines Veneer",
		updateBuffValue: true,
		match: /Grants ([0-9.]+) Stamina Recovery to you and up to/i,
	},
	{
		buffId: "Worms Raiment",
		updateBuffValue: true,
		match: /Grants ([0-9.]+) Magicka Recovery to you and up to/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage$/i,
	},
	{
		statId: "SpellDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage$/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage\./i,
	},
	{
		statId: "SpellDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage\./i,
	},
	{
		category: "SkillCost",
		statId: "Undaunted_Cost",
		factorValue: -1,
		display: "%",
		match: /Reduces the cost of your Undaunted abilities by ([0-9.]+)%/i,
	},
	{
		category: "Skill2",
		statId: "SpellCrit",
		match: /Adds ([0-9]+) Critical Chance/i,
	},
	{
		category: "Skill2",
		statId: "WeaponCrit",
		match: /Adds ([0-9]+) Critical Chance/i,
	},
	{
		statId: "BlockCost",
		display: "%",
		match: /Increases the cost of Block, Sprint, Dodge, and Break Free by ([0-9.]+)%/i,
	},
	{
		statId: "SprintCost",
		display: "%",
		match: /Increases the cost of Block, Sprint, Dodge, and Break Free by ([0-9.]+)%/i,
	},
	{
		statId: "RollDodgeCost",
		display: "%",
		match: /Increases the cost of Block, Sprint, Dodge, and Break Free by ([0-9.]+)%/i,
	},
	{
		statId: "BreakFreeCost",
		display: "%",
		match: /Increases the cost of Block, Sprint, Dodge, and Break Free by ([0-9.]+)%/i,
	},
	{
		category: "Set",
		statId: "AOEWeaponDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage to your area of effect abilities/i,
	},
	{
		category: "Set",
		statId: "AOESpellDamage",
		match: /Adds ([0-9.]+) Weapon and Spell Damage to your area of effect abilities/i,
	},
	{
		statId: "FrostDamageDone",
		display: "%",
		match: /Increases your damage done with Frost abilities by ([0-9.]+)%/i,
	},
	{
		statId: "WeaponTraitEffect",
		display: "%",
		match: /Increase the effectiveness of your Weapon Traits by ([0-9.]+)%/i,
	},
	{
		statId: "ExtraBashDamage",	//TODO: Check if this is modified bu +Bash Damage%
		match: /Your Bash attacks deal ([0-9]+) more damage/i,
	},
	{
		category: "Skill2",
		statId: "LADamage",
		match: /Increase the damage of your Light Attacks by ([0-9]+)/i,
	},
	{
		category: "Set",
		factorStatId: "ThreeSetCount",
		statId: "WeaponDamage",
		match: /Gain ([0-9]+) Weapon and Spell Damage and [0-9]+ Armor for every set you are wearing at least 3 or more/i,
	},
	{
		category: "Set",
		factorStatId: "ThreeSetCount",
		statId: "SpellDamage",
		match: /Gain ([0-9]+) Weapon and Spell Damage and [0-9]+ Armor for every set you are wearing at least 3 or more/i,
	},
	{
		category: "Set",
		factorStatId: "ThreeSetCount",
		statId: "SpellResist",
		match: /Gain [0-9]+ Weapon and Spell Damage and ([0-9]+) Armor for every set you are wearing at least 3 or more/i,
	},
	{
		category: "Set",
		factorStatId: "ThreeSetCount",
		statId: "PhysicalResist",
		match: /Gain [0-9]+ Weapon and Spell Damage and ([0-9]+) Armor for every set you are wearing at least 3 or more/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration/i,
	},
	{
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration/i,
	},
	{
		statId: "SpellPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration/i,
	},
	{
		statId: "PhysicalPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration/i,
	},
	{
		category: "Skill2",
		statId: "HASpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your fully-charged Heavy Attacks/i,
	},
	{
		category: "Skill2",
		statId: "HAWeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your fully-charged Heavy Attacks/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "BlockCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "RollDodgeCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "BreakFreeCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "BashCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "SprintCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statRequireId: "FoodBuff",
		statRequireValue: 1,
		statId: "SneakCost",
		factorValue: -1,
		display: "%",
		match: /While you have a food buff active, reduce the cost of your Core Combat abilities by ([0-9]+)%/i,
	},
	{
		statId: "CritDamage",
		display: "%",
		match: /Increases your Critical Damage and Critical Healing by ([0-9]+)%/i,
	},
	{
		statId: "CritHealing",
		display: "%",
		match: /Increases your Critical Damage and Critical Healing by ([0-9]+)%/i,
	},
	{
		buffId: "Major Berserk",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Courage",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Brutality",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Sorcery",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Prophecy",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Savagery",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Force",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Protection",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Resolve",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Minor Fortitude",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Minor Intellect",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Minor Endurance",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		buffId: "Major Heroism",
		match: /and gain Major Berserk, Major Courage, Major Brutality, Major Sorcery, Major Prophecy, Major Savagery, Major Force, Major Protection, Major Resolve, Minor Fortitude, Minor Intellect, Minor Endurance, and Major Heroism/i,
	},
	{
		statId: "DirectRangeSpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your ranged direct damage abilities./i,
	},
	{
		statId: "DirectRangeWeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your ranged direct damage abilities./i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Two Handed",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "One Hand and Shield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Dual Wield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Bow",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Destruction Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineWeaponDmg",
		statId: "Restoration Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Two Handed",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "One Hand and Shield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Dual Wield",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Bow",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Destruction Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillLineSpellDmg",
		statId: "Restoration Staff",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your Weapon Skill abilities/i,
	},
	{
		category: "SkillCost",
		statId: "Two_Handed_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "One_Hand_and_Shield_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Dual_Wield_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Bow_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Destruction_Staff_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Restoration_Staff_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Berserker_Strike_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Shield_Wall_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Lacerate_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Rapid_Fire_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Elemental_Storm_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillCost",
		statId: "Panacea_Cost",
		display: "%",
		match: /Increases the cost of your Weapon Skill abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StatusEffectDuration",
		match: /Increase the duration of Status Effects you apply by ([0-9]+) seconds/i,
	},
	
	
		// Optionally toggled set effects
	{
		id: "Vastarie's Tutelage",
		setBonusCount: 6,
		toggle: true,
		enabled: false,
		buffId: "Vastaries Tutelage",
		match: / When you resurrect an ally, you and your ally gain ([0-9]+) Weapon and Spell Damage and ([0-9]+)% cost reduction/i,
	},
	{
		id: "Spaulder of Ruin",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "HealthRegen",
		factorValue: -1,
		maxTimes: 6,
		match: /Reduce your Health, Magicka, and Stamina Recovery by ([0-9]+) for every ally benefiting from your Aura of Pride/i,
	},
	{
		id: "Spaulder of Ruin",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		factorValue: -1,
		maxTimes: 6,
		match: /Reduce your Health, Magicka, and Stamina Recovery by ([0-9]+) for every ally benefiting from your Aura of Pride/i,
	},
	{
		id: "Spaulder of Ruin",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "StaminaRegen",
		factorValue: -1,
		maxTimes: 6,
		match: /Reduce your Health, Magicka, and Stamina Recovery by ([0-9]+) for every ally benefiting from your Aura of Pride/i,
	},
	{
		id: "Spaulder of Ruin",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		buffId: "Aura of Pride",
		maxTimes: 6,
		match: /Activating crouch activates and deactivates a [0-9]+ meter Aura of Pride/i,
	},
	{
		id: "Aegis of Galenwe",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Empower",
		match: /When you Block, you grant Empower to /i,
	},
	{
		id: "Alessia's Bulwark",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Target",
		statId: "WeaponDamage",
		factorValue: -1,
		match: /When you take damage from a Martial melee attack, you reduce the attacker's Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Alessia's Bulwark",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Target",
		statId: "SpellDamage",
		factorValue: -1,
		match: /When you take damage from a Martial melee attack, you reduce the attacker's Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Might of the Lost Legion",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		buffId: "Empower",
		match: /When you Block, you gain Empower,/i,
	},
	{
		id: "Sea-Serpent's Coil",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "DamageTaken",
		factorValue: -1,
		display: "%",
		match: / While at full Health, you gain ([0-9]+)% damage reduction/i,
	},
	{
		id: "Mora's Whispers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "SpellCrit",
		factorValue: 0.01,
		round: "floor",
		maxTimes: 100,
		match: /Gain up to ([0-9]+) Critical Chance and/i,
	},
	{
		id: "Mora's Whispers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "WeaponCrit",
		factorValue: 0.01,
		round: "floor",
		maxTimes: 100,
		match: /Gain up to ([0-9]+) Critical Chance and/i,
	},
	{
		id: "Mora's Whispers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "MorasWhispers",
		factorValue: 0.01,
		round: "floor",
		maxTimes: 100,
		match: /Gain up to ([0-9]+) Critical Chance and/i,
	},
	{
		id: "Dov-rha Sabatons",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		maxTimes: 20,
		match: /While Sprinting gain a stack of Draconic Scales every [0-9.]+ seconds, granting you ([0-9]+) Armor,/i,
	},
	{
		id: "Dov-rha Sabatons",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		maxTimes: 20,
		match: /While Sprinting gain a stack of Draconic Scales every [0-9.]+ seconds, granting you ([0-9]+) Armor,/i,
	},
	{
		id: "Coral Riptide",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		factorValue: 0.014926,
		maxTimes: 67,
		round: "floor",
		match: /Increase your Weapon and Spell Damage by up to ([0-9]+) based on your missing Stamina/i,
	},
	{
		id: "Coral Riptide",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		factorValue: 0.014926,
		maxTimes: 67,
		round: "floor",
		match: /Increase your Weapon and Spell Damage by up to ([0-9]+) based on your missing Stamina/i,
	},
	{
		id: "Coral Riptide",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "CoralRiptide",
		factorValue: 0.014926,
		maxTimes: 67,
		round: "floor",
		match: /Increase your Weapon and Spell Damage by up to ([0-9]+) based on your missing Stamina/i,
	},
	{
		id: "Pearlescent Ward",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statValue: 15,
		maxTimes: 12, 
		statId: "WeaponDamage",
		match: /Pearlescent Ward increases Weapon and Spell Damage by up to [0-9]+ based on the number of group members that are alive/i,
	},
	{
		id: "Pearlescent Ward",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statValue: 15,
		maxTimes: 12, 
		statId: "SpellDamage",
		match: /Pearlescent Ward increases Weapon and Spell Damage by up to [0-9]+ based on the number of group members that are alive/i,
	},
	{
		id: "Pearlescent Ward",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statValue: -5.5,
		maxTimes: 12,
		display: "%",
		round: "floor",
		statId: "DamageTaken",
		match: /Pearlescent Ward increases damage reduction from non-player enemies out of [0-9]+% based on the number of group members that are dead/i,
	},
	{
		id: "Pearlescent Ward",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 12,
		round: "floor",
		statId: "PearlescentWard",
		match: /Pearlescent Ward increases damage reduction from non-player enemies out of [0-9]+% based on the number of group members that are dead/i,
	},
	{
		id: "Perfected Pearlescent Ward",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statValue: 15,
		maxTimes: 12, 
		statId: "WeaponDamage",
		match: /Pearlescent Ward increases Weapon and Spell Damage by up to [0-9]+ based on the number of group members that are alive/i,
	},
	{
		id: "Perfected Pearlescent Ward",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statValue: 15,
		maxTimes: 12, 
		statId: "SpellDamage",
		match: /Pearlescent Ward increases Weapon and Spell Damage by up to [0-9]+ based on the number of group members that are alive/i,
	},
	{
		id: "Perfected Pearlescent Ward",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statValue: -5.5,
		maxTimes: 12,
		display: "%",
		round: "floor",
		statId: "DamageTaken",
		match: /Pearlescent Ward increases damage reduction from non-player enemies out of [0-9]+% based on the number of group members that are dead/i,
	},
	{
		id: "Perfected Pearlescent Ward",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		maxTimes: 12,
		round: "floor",
		statId: "PearlescentWard",
		match: /Pearlescent Ward increases damage reduction from non-player enemies out of [0-9]+% based on the number of group members that are dead/i,
	},
	{
		id: "Blessing of High Isle",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /When you are healed while in combat, increase your Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Blessing of High Isle",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /When you are healed while in combat, increase your Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Gryphon's Ferocity",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Minor Force",
		match: /After dealing direct damage, you gain Minor Force and Minor Expedition for/i,
	},
	{
		id: "Gryphon's Ferocity",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Minor Expedition",
		match: /After dealing direct damage, you gain Minor Force and Minor Expedition for/i,
	},
	{
		id: "Bright-Throat's Boast",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "Magicka",
		match: /While you have a drink buff active, your Max Magicka is increased by ([0-9]+) and Magicka Recovery by [0-9]+/i,
	},
	{
		id: "Bright-Throat's Boast",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		match: /While you have a drink buff active, your Max Magicka is increased by [0-9]+ and Magicka Recovery by ([0-9]+)/i,
	},
	{
		id: "Crimson Oath's Rive",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Crimson Oath's Rive (Target)",
		updateBuffValue: true,
		factorValue: -1,
		match: /sends out a wave of energy that reduces the Armor of nearby enemies within [0-9]+ meters by ([0-9]+) for/,
	},
	{
		id: "Hew and Sunder",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 20,
		statId: "SpellPenetration",
		match: /When you deal damage with a Heavy Attack, gain ([0-9]+) Offensive Penetration for each enemy within /,
	},
	{
		id: "Hew and Sunder",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 20,
		statId: "PhysicalPenetration",
		match: /When you deal damage with a Heavy Attack, gain ([0-9]+) Offensive Penetration for each enemy within /,
	},
	{
		id: "Rallying Cry",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 12,
		factorValue: -0.05,
		factorOffset: -20,
		statId: "WeaponDamage",
		match: /While Battle Spirit is active, critically healing yourself or an ally causes you and up to [0-9]+ other group members within [0-9]+ meters to gain ([0-9]+) Weapon and Spell Damage, and [0-9]+ Critical Resistance/,
	},
	{
		id: "Rallying Cry",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 12,
		factorValue: -0.05,
		factorOffset: -20,
		statId: "SpellDamage",
		match: /While Battle Spirit is active, critically healing yourself or an ally causes you and up to [0-9]+ other group members within [0-9]+ meters to gain ([0-9]+) Weapon and Spell Damage, and [0-9]+ Critical Resistance/,
	},
	{
		id: "Rallying Cry",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 12,
		factorValue: -0.05,
		factorOffset: -20,
		statId: "CritResist",
		match: /While Battle Spirit is active, critically healing yourself or an ally causes you and up to [0-9]+ other group members within [0-9]+ meters to gain [0-9]+ Weapon and Spell Damage, and ([0-9]+) Critical Resistance/,
	},
	{
		id: "Spriggan's Vigor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 10,
		statId: "Stamina",
		rawInputMatch: /(gain a stack of Wild Growth for [0-9]+ seconds, increasing your Max Stamina by [0-9]+)/i,
		match: /gain a stack of Wild Growth for [0-9]+ seconds, increasing your Max Stamina by ([0-9]+)/i,
	},
	{
		id: "Kargaeda",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		buffId: "Kargaeda",
		updateBuffValue: true,
		factorValue: -1,
		display: "%",
		rawInputMatch: /(Allies within the whirlwind reduce their Magicka and Stamina costs by [0-9.]+%)/i,
		match: /Allies within the whirlwind reduce their Magicka and Stamina costs by ([0-9.]+)%/i,
	},
	{
		id: "Iron Flask",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /When you drink a potion while in combat, gain ([0-9.]+) Armor for/i,
	},
	{
		id: "Iron Flask",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /When you drink a potion while in combat, gain ([0-9.]+) Armor for/i,
	},
	{
		id: "Wretched Vitality (Major Buff)",
		setId: "Wretched Vitality",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		rawInputMatch: /(While in combat, applying a Major Buff or Debuff to a target grants you [0-9]+ Magicka and Stamina Recovery for [0-9]+ seconds\.)/i,
		match: /While in combat, applying a Major Buff or Debuff to a target grants you ([0-9]+) Magicka and Stamina Recovery/i,
	},
	{
		id: "Wretched Vitality (Major Buff)",
		setId: "Wretched Vitality",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "StaminaRegen",
		rawInputMatch: /(While in combat, applying a Major Buff or Debuff to a target grants you [0-9]+ Magicka and Stamina Recovery for [0-9]+ seconds\.)/i,
		match: /While in combat, applying a Major Buff or Debuff to a target grants you ([0-9]+) Magicka and Stamina Recovery/i,
	},
	{
		id: "Wretched Vitality (Minor Buff)",
		setId: "Wretched Vitality",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		rawInputMatch: /(While in combat, applying a Minor Buff or Debuff to a target grants you [0-9]+ Magicka and Stamina Recovery for [0-9]+ seconds\.)/i,
		match: /While in combat, applying a Minor Buff or Debuff to a target grants you ([0-9]+) Magicka and Stamina Recovery/i,
	},
	{
		id: "Wretched Vitality (Minor Buff)",
		setId: "Wretched Vitality",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "StaminaRegen",
		rawInputMatch: /(While in combat, applying a Minor Buff or Debuff to a target grants you [0-9]+ Magicka and Stamina Recovery for [0-9]+ seconds\.)/i,
		match: /While in combat, applying a Minor Buff or Debuff to a target grants you ([0-9]+) Magicka and Stamina Recovery/i,
	},
	{
		id: "Scorion's Feast (Imbued Aura)",
		setId: "Scorion's Feast",
		setBonusCount: 4,
		buffId: "Scorion`s Feast (Imbued Aura)",
		updateBuffValue: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(When you deal damage with a fully-charged Heavy Attack, you gain an Imbued Aura for [0-9]+ seconds, granting you and up to [0-9]+ other group members [0-9]+ Magicka and Stamina Recovery.)/i,
		match: /you gain an Imbued Aura for 10 seconds, granting you and up to [0-9]+ other group members ([0-9]+) Magicka and Stamina Recovery/i,
	},
	{
		id: "Scorion's Feast (Overflow Aura)",
		setId: "Scorion's Feast",
		setBonusCount: 4,
		buffId: "Scorion`s Feast (Overflow Aura)",
		updateBuffValue: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(If you deal damage with a fully-charged Heavy Attack with an Imbued Aura active, consume it and gain an Overflow Aura for [0-9]+ seconds, granting you and up to [0-9]+ other group members [0-9]+ Weapon and Spell Damage.)/i,
		match: /consume it and gain an Overflow Aura for [0-9]+ seconds, granting you and up to 3 other group members ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Prior Thierric",
		setBonusCount: 3,
		statId: "AOEDamageDone",
		display: "%",
		toggle: true,
		enabled: false,
		match: /increase their damage taken from your area of effect abilities by ([0-9.]+)%/i,
	},
	{	id: "Crusader",
		setBonusCount: 4,
		buffId: "Minor Courage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(Every [0-9.]+ seconds you and up to [0-9.]+ group members in the area gain Minor Courage for [0-9.]+ seconds)/i,
		match: /Every [0-9.]+ seconds you and up to [0-9.]+ group members in the area gain Minor Courage for [0-9.]+ seconds/i,
	},
	{	id: "Magma Incarnate",
		setBonusCount: 3,
		buffId: "Minor Courage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(When you heal yourself or a group member with a single target heal ability, grant the lowest Health group member within [0-9.]+ meters Minor Courage and Minor Resolve)/i,
		match: /When you heal yourself or a group member with a single target heal ability, grant the lowest Health group member within [0-9.]+ meters Minor Courage and Minor Resolve/i,
	},
	{	id: "Magma Incarnate",
		setBonusCount: 3,
		buffId: "Minor Resolve",
		toggle: true,
		enabled: false,
		rawInputMatch: /(When you heal yourself or a group member with a single target heal ability, grant the lowest Health group member within [0-9.]+ meters Minor Courage and Minor Resolve)/i,
		match: /When you heal yourself or a group member with a single target heal ability, grant the lowest Health group member within [0-9.]+ meters Minor Courage and Minor Resolve/i,
	},
	{	id: "Perfected Claw of Yolnahkriin",
		setBonusCount: 5,
		buffId: "Minor Courage",
		toggle: true,
		enabled: false,
		match: /When you taunt an enemy, you give yourself and [0-9]+ group members Minor Courage for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{	id: "Claw of Yolnahkriin",
		setBonusCount: 4,
		buffId: "Minor Courage",
		toggle: true,
		enabled: false,
		match: /When you taunt an enemy, you give yourself and [0-9]+ group members Minor Courage for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{
		id: "Pelinal's Wrath",
		setBonusCount: 4,
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack of Wrath of Whitestrake grants you ([0-9.]+) Weapon and Spell Damage/i,
	},
	{
		id: "Pelinal's Wrath",
		setBonusCount: 4,
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack of Wrath of Whitestrake grants you ([0-9.]+) Weapon and Spell Damage/i,
	},
	{
		id: "Sul-Xan's Torment",
		setBonusCount: 4,
		statId: "WeaponCrit",
		toggle: true,
		enabled: false,
		match: /Touching the soul increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+% for/i,
	},
	{
		id: "Sul-Xan's Torment",
		setBonusCount: 4,
		statId: "SpellCrit",
		toggle: true,
		enabled: false,
		match: /Touching the soul increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+% for/i,
	},
	{
		id: "Sul-Xan's Torment",
		setBonusCount: 4,
		statId: "CritDamage",
		toggle: true,
		enabled: false,
		display: "%",
		match: /Touching the soul increases your Critical Chance by [0-9.]+ and your Critical Damage by ([0-9.]+)% for/i,
	},
	{
		id: "Perfected Sul-Xan's Torment",
		setBonusCount: 5,
		statId: "WeaponCrit",
		toggle: true,
		enabled: false,
		match: /Touching the soul increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+% for/i,
	},
	{
		id: "Perfected Sul-Xan's Torment",
		setBonusCount: 5,
		statId: "SpellCrit",
		toggle: true,
		enabled: false,
		match: /Touching the soul increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+% for/i,
	},
	{
		id: "Perfected Sul-Xan's Torment",
		setBonusCount: 5,
		statId: "CritDamage",
		toggle: true,
		enabled: false,
		display: "%",
		match: /Touching the soul increases your Critical Chance by [0-9.]+ and your Critical Damage by ([0-9.]+)% for/i,
	},
	{
		id: "Bahsei's Mania",
		setBonusCount: 4,
		statId: "DamageDone",
		display: "%",
		maxTimes: 12,
		toggle: true,
		enabled: false,
		statValue: 1,
		match: /Increases your damage done to non-player enemies by up to [0-9.]+% based on your missing Magicka/i,
	},
	{
		id: "Bahsei's Mania",
		setBonusCount: 4,
		statId: "BahseiMania",
		display: "%",
		maxTimes: 12,
		toggle: true,
		enabled: false,
		statValue: 1,
		match: /Increases your damage done to non-player enemies by up to [0-9.]+% based on your missing Magicka/i,
	},
	{
		id: "Perfected Bahsei's Mania",
		setBonusCount: 5,
		statId: "DamageDone",
		display: "%",
		maxTimes: 12,
		toggle: true,
		enabled: false,
		statValue: 1,
		match: /Increases your damage done to non-player enemies by up to [0-9.]+% based on your missing Magicka/i,
	},
	{
		id: "Perfected Bahsei's Mania",
		setBonusCount: 5,
		statId: "BahseiMania",
		display: "%",
		maxTimes: 12,
		toggle: true,
		enabled: false,
		statValue: 1,
		match: /Increases your damage done to non-player enemies by up to [0-9.]+% based on your missing Magicka/i,
	},
	{
		id: "Diamond's Victory: Ranged Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "DOTSpellDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of [0-9.]+ meters or less grants you Range Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your damage over time and ranged attacks\.)/i,
		match: /you Range Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your damage over time and ranged attacks/i,
	},
	{
		id: "Diamond's Victory: Ranged Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "DOTWeaponDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of [0-9.]+ meters or less grants you Range Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your damage over time and ranged attacks\.)/i,
		match: /you Range Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your damage over time and ranged attacks/i,
	},
	{
		id: "Diamond's Victory: Ranged Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "RangedSpellDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of [0-9.]+ meters or less grants you Range Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your damage over time and ranged attacks\.)/i,
		match: /you Range Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your damage over time and ranged attacks/i,
	},
	{
		id: "Diamond's Victory: Ranged Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "RangedWeaponDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of [0-9.]+ meters or less grants you Range Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your damage over time and ranged attacks\.)/i,
		match: /you Range Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your damage over time and ranged attacks/i,
	},
	{
		id: "Diamond's Victory: Melee Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "MeleeSpellDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of over [0-9.]+ meters grants you Melee Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your melee attacks\.)/i,
		match: /you Melee Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your melee attacks/i,
	},
	{
		id: "Diamond's Victory: Melee Supremacy",
		setId: "Diamond's Victory",
		setBonusCount: 4,
		statId: "MeleeWeaponDamage",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While in combat, using an ability with a range of over [0-9.]+ meters grants you Melee Supremacy for [0-9.]+ seconds, adding [0-9.]+ Weapon and Spell Damage to your melee attacks\.)/i,
		match: /you Melee Supremacy for [0-9.]+ seconds, adding ([0-9.]+) Weapon and Spell Damage to your melee attacks/i,
	},
	{
		id: "Frostbite Chilled",
		setId: "Frostbite",
		setBonusCount: 4,
		statId: "DamageDone",
		toggle: true,
		enabled: false,
		display: "%",
		rawInputMatch: /(Increases your damage done against Chilled enemies by [0-9.]+%\.)/i,
		match: /Increases your damage done against Chilled enemies by ([0-9.]+)%/i,
	},
	{
		id: "Frostbite Minor Brittle",
		setId: "Frostbite",
		setBonusCount: 4,
		statId: "DamageDone",
		toggle: true,
		enabled: false,
		display: "%",
		rawInputMatch: /(Increases your damage done against enemies afflicted with Minor Brittle by [0-9.]+%\.)/i,
		match: /Increases your damage done against enemies afflicted with Minor Brittle by ([0-9.]+)%/i,
	},
	{
		id: "Bog Raider",
		setBonusCount: 4,
		statId: "HealthRegen",
		toggle: true,
		enabled: false,
		match: /When an enemy you have recently damaged dies, gain [0-9.]+ Ultimate and increase your Health Recovery by ([0-9.]+) for/i,
	},
	{
		id: "Shapeshifter's Chain",
		setBonusCount: 1,
		statId: "Health",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While transformed, increase your Maximum Health, Stamina, and Magicka by [0-9.]+\.)/i,
		match: /While transformed, increase your Maximum Health, Stamina, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Shapeshifter's Chain",
		setBonusCount: 1,
		statId: "Magicka",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While transformed, increase your Maximum Health, Stamina, and Magicka by [0-9.]+\.)/i,
		match: /While transformed, increase your Maximum Health, Stamina, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Shapeshifter's Chain",
		setBonusCount: 1,
		statId: "Stamina",
		toggle: true,
		enabled: false,
		rawInputMatch: /(While transformed, increase your Maximum Health, Stamina, and Magicka by [0-9.]+\.)/i,
		match: /While transformed, increase your Maximum Health, Stamina, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Death Dealer's Fete",
		setBonusCount: 1,
		statId: "Health",
		toggle: true,
		enabled: false,
		maxTimes: 30,
		match: /Each stack of Escalating Fete increases your Maximum Stamina, Health, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Death Dealer's Fete",
		setBonusCount: 1,
		statId: "Magicka",
		toggle: true,
		enabled: false,
		maxTimes: 30,
		match: /Each stack of Escalating Fete increases your Maximum Stamina, Health, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Death Dealer's Fete",
		setBonusCount: 1,
		statId: "Stamina",
		toggle: true,
		enabled: false,
		maxTimes: 30,
		match: /Each stack of Escalating Fete increases your Maximum Stamina, Health, and Magicka by ([0-9.]+)/i,
	},
	{
		id: "Harpooner's Wading Kilt",
		setBonusCount: 1,
		statId: "SpellCrit",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack of Hunter's Focus increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+%/i,
	},
	{
		id: "Harpooner's Wading Kilt",
		setBonusCount: 1,
		statId: "WeaponCrit",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack of Hunter's Focus increases your Critical Chance by ([0-9.]+) and your Critical Damage by [0-9.]+%/i,
	},
	{
		id: "Harpooner's Wading Kilt",
		setBonusCount: 1,
		statId: "CritDamage",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		display: "%",
		match: /Each stack of Hunter's Focus increases your Critical Chance by [0-9.]+ and your Critical Damage by ([0-9.]+)%/i,
	},
	{
		id: "Glorgoloch the Destroyer",
		setBonusCount: 2,
		statId: "SpellResist",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack increases your Armor by ([0-9.]+) and your Critical Resistance by [0-9.]+/i,
	},
	{
		id: "Glorgoloch the Destroyer",
		setBonusCount: 2,
		statId: "PhysicalResist",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack increases your Armor by ([0-9.]+) and your Critical Resistance by [0-9.]+/i,
	},
	{
		id: "Glorgoloch the Destroyer",
		setBonusCount: 2,
		statId: "CritResist",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /Each stack increases your Armor by [0-9.]+ and your Critical Resistance by ([0-9.]+)/i,
	},
	{
		id: "Zoal the Ever-Wakeful",
		setBonusCount: 2,
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		maxTimes: 6,
		match: /You also gain ([0-9.]+) Weapon and Spell Damage for each enemy hit/i,
	},
	{
		id: "Zoal the Ever-Wakeful",
		setBonusCount: 2,
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		maxTimes: 6,
		match: /You also gain ([0-9.]+) Weapon and Spell Damage for each enemy hit/i,
	},
	{
		id: "Unleashed Ritualist",
		setBonusCount: 4,
		statId: "PetDamageDone",
		toggle: true,
		enabled: false,
		display: "%",
		match: /Enemies with your Ritualist's Mark take an additional ([0-9.]+)% damage from your summoned pets/i,
	},
	{
		id: "Frenzied Momentum",
		setBonusCount: 1,
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		enableOffBar: true,
		maxTimes: 10,
		match: /While Momentum is active, casting Stamina abilities while in combat generates a stack of Frenzied Momentum for [0-9.]+ seconds, increasing your Weapon and Spell Damage by ([0-9.]+) up to [0-9.]+ times/i,
	},
	{
		id: "Perfected Frenzied Momentum",
		setBonusCount: 2,
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		enableOffBar: true,
		maxTimes: 10,
		match: /While Momentum is active, casting Stamina abilities while in combat generates a stack of Frenzied Momentum for [0-9.]+ seconds, increasing your Weapon and Spell Damage by ([0-9.]+) up to [0-9.]+ times/i,
	},
	{
		id: "Frenzied Momentum",
		setBonusCount: 1,
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		enableOffBar: true,
		maxTimes: 10,
		match: /While Momentum is active, casting Stamina abilities while in combat generates a stack of Frenzied Momentum for [0-9.]+ seconds, increasing your Weapon and Spell Damage by ([0-9.]+) up to [0-9.]+ times/i,
	},
	{
		id: "Perfected Frenzied Momentum",
		setBonusCount: 2,
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		enableOffBar: true,
		maxTimes: 10,
		match: /While Momentum is active, casting Stamina abilities while in combat generates a stack of Frenzied Momentum for [0-9.]+ seconds, increasing your Weapon and Spell Damage by ([0-9.]+) up to [0-9.]+ times/i,
	},
	{
		id: "Executioner's Blade",
		setBonusCount: 1,
		category: "SkillDamage",
		statId: "Hidden Blade",
		toggle: true,
		enabled: false,
		display: "%",
		maxTimes: 250,
		match: /Hidden Blade deals up to [0-9.]+% more damage to targets under [0-9.]+% Health when you are standing behind them/i,
	},
	{
		id: "Perfected Executioner's Blade",
		setBonusCount: 2,
		category: "SkillDamage",
		statId: "Hidden Blade",
		toggle: true,
		enabled: false,
		display: "%",
		maxTimes: 250,
		match: /Hidden Blade deals up to [0-9.]+% more damage to targets under [0-9.]+% Health when you are standing behind them/i,
	},
	{
		id: "Point-Blank Snipe",
		setBonusCount: 1,
		category: "SkillDamage",
		statId: "Snipe",
		toggle: true,
		enabled: false,
		display: "%",
		maxTimes: 33,
		minTimes: 5,
		match: /Increases your damage done with Snipe based on how close you are to your target/i,
	},
	{
		id: "Perfected Point-Blank Snipe",
		setBonusCount: 2,
		category: "SkillDamage",
		statId: "Snipe",
		toggle: true,
		enabled: false,
		display: "%",
		maxTimes: 33,
		minTimes: 5,
		match: /Increases your damage done with Snipe based on how close you are to your target/i,
	},
	{
		id: "True-Sworn Fury: Double",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellCrit",
		factorValue: 1,
		disableSetIds: ["True-Sworn Fury: Quadruple"],
		rawInputMatch: /(While in combat, this bonus doubles when you are under [0-9.]+% Health)/i,
		match: /Adds ([0-9.]+) Critical Chance and increases your Critical Damage by [0-9.]+%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "True-Sworn Fury: Double",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponCrit",
		factorValue: 1,
		disableSetIds: ["True-Sworn Fury: Quadruple"],
		rawInputMatch: /(While in combat, this bonus doubles when you are under [0-9.]+% Health)/i,
		match: /Adds ([0-9.]+) Critical Chance and increases your Critical Damage by [0-9.]+%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "True-Sworn Fury: Double",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		display: "%",
		statId: "CritDamage",
		factorValue: 1,
		disableSetIds: ["True-Sworn Fury: Quadruple"],
		rawInputMatch: /(While in combat, this bonus doubles when you are under [0-9.]+% Health)/i,
		match: /Adds [0-9.]+ Critical Chance and increases your Critical Damage by ([0-9.]+)%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "True-Sworn Fury: Quadruple",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellCrit",
		factorValue: 3,
		disableSetIds: ["True-Sworn Fury: Double"],
		rawInputMatch: /(and quadruples when you are under [0-9.]+% Health\.)/i,
		match: /Adds ([0-9.]+) Critical Chance and increases your Critical Damage by [0-9.]+%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "True-Sworn Fury: Quadruple",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponCrit",
		factorValue: 3,
		disableSetIds: ["True-Sworn Fury: Double"],
		rawInputMatch: /(and quadruples when you are under [0-9.]+% Health\.)/i,
		match: /Adds ([0-9.]+) Critical Chance and increases your Critical Damage by [0-9.]+%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "True-Sworn Fury: Quadruple",
		setId: "True-Sworn Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		display: "%",
		statId: "CritDamage",
		factorValue: 3,
		disableSetIds: ["True-Sworn Fury: Double"],
		rawInputMatch: /(and quadruples when you are under [0-9.]+% Health\.)/i,
		match: /Adds [0-9.]+ Critical Chance and increases your Critical Damage by ([0-9.]+)%\. While in combat, this bonus doubles when you are under [0-9.]+% Health/i,
	},
	{
		id: "Encratis's Behemoth",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Encratis Behemoth",
		updateBuffValue: true,
		display: "%",
		match: /Dealing Flame Damage to an enemy grants you Behemoth's Aura for [0-9.]+ second.*reduce Flame Damage taken by ([0-9.]+)%/i,
	},
	
	{
		id: "Hex Siphon",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "SpellDamage",
		maxTimes: 6,
		match: /Each enemy hit increases your Weapon and Spell Damage by ([0-9.]+) for [0-9]+ seconds, up to a maximum of [0-9]+ enemies/i,
	},
	{
		id: "Hex Siphon",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "WeaponDamage",
		maxTimes: 6,
		match: /Each enemy hit increases your Weapon and Spell Damage by ([0-9.]+) for [0-9]+ seconds, up to a maximum of [0-9]+ enemies/i,
	},
	{
		id: "Voidcaller",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "SpellDamage",
		maxTimes: 20,
		match: /When you take damage, your Weapon and Spell Damage is increased by ([0-9]+) for [0-9.]+ seconds, stacking up to [0-9.]+ times/i,
	},
	{
		id: "Voidcaller",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "WeaponDamage",
		maxTimes: 20,
		match: /When you take damage, your Weapon and Spell Damage is increased by ([0-9]+) for [0-9.]+ seconds, stacking up to [0-9.]+ times/i,
	},
	{
		id: "Witch-Knight's Defiance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "WeaponDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against enemies inflicted with a Poison Damage effect/i,
	},
	{
		id: "Witch-Knight's Defiance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "SpellDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against enemies inflicted with a Poison Damage effect/i,
	},
	{
		id: "Storm Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LADamage",
		match: /When you deal Critical Damage with a fully-charged Heavy Attack, your Light and Heavy Attacks deal an additional ([0-9.]+) Damage/i,
	},
	{
		id: "Storm Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HADamage",
		match: /When you deal Critical Damage with a fully-charged Heavy Attack, your Light and Heavy Attacks deal an additional ([0-9.]+) Damage/i,
	},
	{
		id: "Elemental Catalyst (Flame)",
		setId: "Elemental Catalyst",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		updateBuffValue: true,
		display: "%",
		buffId: "Elemental Catalyst (Flame)",
		match: /Each stack of an Elemental Weakness increases their Critical Damage taken by ([0-9.]+)%/i,
	},
	{
		id: "Elemental Catalyst (Shock)",
		setId: "Elemental Catalyst",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		updateBuffValue: true,
		display: "%",
		buffId: "Elemental Catalyst (Shock)",
		match: /Each stack of an Elemental Weakness increases their Critical Damage taken by ([0-9.]+)%/i,
	},
	{
		id: "Elemental Catalyst (Frost)",
		setId: "Elemental Catalyst",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		updateBuffValue: true,
		display: "%",
		buffId: "Elemental Catalyst (Frost)",
		match: /Each stack of an Elemental Weakness increases their Critical Damage taken by ([0-9.]+)%/i,
	},
	{
		id: "Stone Husk",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 15,
		rawInputMatch: /(When the tether ends, you consume the stacks and gain [0-9]+ Weapon and Spell Damage per stack for [0-9]+ seconds\.)/i,
		match: /When the tether ends, you consume the stacks and gain ([0-9]+) Weapon and Spell Damage per stack /i,
	},
	{
		id: "Stone Husk",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 15,
		rawInputMatch: /(When the tether ends, you consume the stacks and gain [0-9]+ Weapon and Spell Damage per stack for [0-9]+ seconds\.)/i,
		match: /When the tether ends, you consume the stacks and gain ([0-9]+) Weapon and Spell Damage per stack /i,
	},
	{
		id: "Soulshine",
		setBonusCount: 4,
		enableOffBar: true,
		enable: false,
		toggle: true,
		statId: "SpellDamage",
		match: /Activating an ability with a cast or channel time grants you ([0-9]+) Weapon and Spell Damage for /i,
	},
	{
		id: "Soulshine",
		setBonusCount: 4,
		enableOffBar: true,
		enable: false,
		toggle: true,
		statId: "WeaponDamage",
		match: /Activating an ability with a cast or channel time grants you ([0-9]+) Weapon and Spell Damage for /i,
	},
	{
		id: "Stygian",
		setBonusCount: 4,
		enableOffBar: true,
		enable: false,
		toggle: true,
		category: "Item",
		statId: "SpellDamage",
		match: /When you leave Sneak or invisibility while in combat, your Weapon and Spell Damage is increased by ([0-9]+) for /i,
	},
	{
		id: "Stygian",
		setBonusCount: 4,
		enableOffBar: true,
		enable: false,
		toggle: true,
		category: "Item",
		statId: "WeaponDamage",
		match: /When you leave Sneak or invisibility while in combat, your Weapon and Spell Damage is increased by ([0-9]+) for /i,
	},
	{
		id: "Spectral Cloak",
		setBonusCount: 1,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		display: "%",
		statId: "DamageDone",
		match: /Dealing damage with Blade Cloak grants you Spectral Cloak for [0-9.]+ seconds, reducing your damage taken and increasing your damage done by ([0-9]+)%/i,
	},
	{
		id: "Spectral Cloak",
		setBonusCount: 1,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		factorValue: -1,
		display: "%",
		statId: "DamageTaken",
		match: /Dealing damage with Blade Cloak grants you Spectral Cloak for [0-9.]+ seconds, reducing your damage taken and increasing your damage done by ([0-9]+)%/i,
	},
	{
		id: "Perfected Spectral Cloak",
		setBonusCount: 2,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		display: "%",
		statId: "DamageDone",
		match: /Dealing damage with Blade Cloak grants you Spectral Cloak for [0-9.]+ seconds, reducing your damage taken and increasing your damage done by ([0-9]+)%/i,
	},
	{
		id: "Perfected Spectral Cloak",
		setBonusCount: 2,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		factorValue: -1,
		display: "%",
		statId: "DamageTaken",
		match: /Dealing damage with Blade Cloak grants you Spectral Cloak for [0-9.]+ seconds, reducing your damage taken and increasing your damage done by ([0-9]+)%/i,
	},
	{
		id: "The Morag Tong",
		setBonusCount: 4,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		display: "%",
		buffId: "The Morag Tong",
		updateBuffValue: true,
		match: /When you deal direct damage, you cause the enemy to take ([0-9]+)% more damage from Poison and Disease attacks/i,
	},
	{
		id: "Z'en's Redress",
		setBonusCount: 4,
		buffId: "Zens Redress",
		updateBuffValue: true,
		enableOffBar: true,
		toggle: true,
		enabled: false,
		maxTimes: 5,
		display: "%",
		match: /Enemies with the Touch of Z'en take an additional ([0-9]+)% more damage for each damage over time effect you've placed on them/i,
	},
	{
		id: "Destructive Impact",
		setBonusCount: 1,
		statId: "SpellDamage",
		enableOffBar: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(increases your Spell Damage by [0-9]+ for [0-9]+ seconds after activating it)/,
		match: /Reduces the cost of Destructive Touch by [0-9]+% and increases your Weapon and Spell Damage by ([0-9]+) for [0-9]+ seconds after activating it/i,
	},
	{
		id: "Destructive Impact",
		setBonusCount: 1,
		statId: "WeaponDamage",
		enableOffBar: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(increases your Spell Damage by [0-9]+ for [0-9]+ seconds after activating it)/,
		match: /Reduces the cost of Destructive Touch by [0-9]+% and increases your Weapon and Spell Damage by ([0-9]+) for [0-9]+ seconds after activating it/i,
	},
	{
		id: "Perfected Destructive Impact",
		setBonusCount: 2,
		statId: "SpellDamage",
		enableOffBar: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(increases your Spell Damage by [0-9]+ for [0-9]+ seconds after activating it)/,
		match: /Reduces the cost of Destructive Touch by [0-9]+% and increases your Weapon and Spell Damage by ([0-9]+) for [0-9]+ seconds after activating it/i,
	},
	{
		id: "Perfected Destructive Impact",
		setBonusCount: 2,
		statId: "WeaponDamage",
		enableOffBar: true,
		toggle: true,
		enabled: false,
		rawInputMatch: /(increases your Spell Damage by [0-9]+ for [0-9]+ seconds after activating it)/,
		match: /Reduces the cost of Destructive Touch by [0-9]+% and increases your Weapon and Spell Damage by ([0-9]+) for [0-9]+ seconds after activating it/i,
	},
	{
		id: "Symphony of Blades (Magicka)",
		setId: "Symphony of Blades",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Symphony of Blades (Stamina)" ],
		buffId: "Symphony of Blades (Magicka)",
		updateBuffValue: true,
		match: /grant them Meridia's Favor, which restores ([0-9]+) Magicka or Stamina every [0-9]+ sec/i,
	},
	{
		id: "Symphony of Blades (Stamina)",
		setId: "Symphony of Blades",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Symphony of Blades (Magicka)" ],
		buffId: "Symphony of Blades (Stamina)",
		updateBuffValue: true,
		match: /grant them Meridia's Favor, which restores ([0-9]+) Magicka or Stamina every [0-9]+ sec/i,
	},
	{
		id: "Engine Guardian (Health)",
		setId: "Engine Guardian",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Engine Guardian (Magicka)", "Engine Guardian (Stamina)" ],
		statId: "HealthRestore",
		factorValue: 2,
		match: /chance to summon a dwemer automation to restore [0-9]+ Stamina or Magicka or ([0-9]+) Health to you every/i,
	},
	{
		id: "Engine Guardian (Magicka)",
		setId: "Engine Guardian",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Engine Guardian (Health)", "Engine Guardian (Stamina)" ],
		statId: "MagickaRestore",
		factorValue: 2,
		match: /chance to summon a dwemer automation to restore ([0-9]+) Stamina or Magicka or [0-9]+ Health to you every/i,
	},
	{
		id: "Engine Guardian (Stamina)",
		setId: "Engine Guardian",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Engine Guardian (Magicka)", "Engine Guardian (Health)" ],
		statId: "StaminaRestore",
		factorValue: 2,
		match: /chance to summon a dwemer automation to restore ([0-9]+) Stamina or Magicka or [0-9]+ Health to you every/i,
	},
	{
		id: "Queen's Elegance (LA)",
		setId: "Queen's Elegance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaCost",
		combineAs: "*%",
		factorValue: -1,
		display: "%",
		rawInputMatch: /(When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%)/i,
		match: /When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%/i,
	},
	{
		id: "Queen's Elegance (LA)",
		setId: "Queen's Elegance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "StaminaCost",
		combineAs: "*%",
		factorValue: -1,
		display: "%",
		rawInputMatch: /(When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%)/i,
		match: /When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%/i,
	},
	{
		id: "Queen's Elegance (LA)",
		setId: "Queen's Elegance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "HealthCost",
		factorValue: -1,
		display: "%",
		combineAs: "*%",
		rawInputMatch: /(When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%)/i,
		match: /When you use a Light Attack you reduce the Health, Magicka, or Stamina cost of your next active ability cast within [0-9]+ seconds by ([0-9]+)%/i,
	},
	{
		id: "Queen's Elegance (HA)",
		setId: "Queen's Elegance",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Empower",
		rawInputMatch: /(When you use a fully charged Heavy Attack you gain Empower for [0-9]+ seconds, increasing the damage of your Light and Heavy Attacks by [0-9]+%)/i,
		match: /When you use a fully charged Heavy Attack you gain Empower for [0-9]+ seconds, increasing the damage of your Light and Heavy Attacks by [0-9]+%/i,
	},
	{
		id: "The Arch-Mage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		match: /When you complete a fully-charged Heavy Attack, you gain an additional ([0-9]+) Magicka Recovery/i,
	},
	{
		id: "Torc of Tonal Constancy (Magicka)",
		setId: "Torc of Tonal Constancy",
		setBonusCount: 1,
		toggle: true,
		enabled: true,
		statId: "MagickaRegen",
		rawInputMatch: /(While your Stamina is less than [0-9]+%, increase your Magicka Recovery by [0-9]+\.)/,
		match: /While your Stamina is less than [0-9]+%, increase your Magicka Recovery by ([0-9]+)\./i,
	},
	{
		id: "Torc of Tonal Constancy (Stamina)",
		setId: "Torc of Tonal Constancy",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "StaminaRegen",
		rawInputMatch: /(While your Magicka is less than [0-9]+%, increase your Stamina Recovery by [0-9]+\.)/,
		match: /While your Magicka is less than [0-9]+%, increase your Stamina Recovery by ([0-9]+)\./i,
	},
	{
		id: "Ring of the Wild Hunt (Combat)",
		setId: "Ring of the Wild Hunt",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "MovementSpeed",
		disableSetIds: [ "Ring of the Wild Hunt (Out of Combat)" ],
		display: "%",
		rawInputMatch: /(Increases your movement speed by [0-9]+% while in combat\.)/,
		match: /Increases your movement speed by ([0-9]+)% while in combat/i,
	},
	{
		id: "Ring of the Wild Hunt (Out of Combat)",
		setId: "Ring of the Wild Hunt",
		setBonusCount: 1,
		toggle: true,
		enabled: true,
		statId: "MovementSpeed",
		disableSetIds: [ "Ring of the Wild Hunt (Combat)" ],
		display: "%",
		rawInputMatch: /(Increases your movement speed by [0-9]+% while out of combat\.)/,
		match: /Increases your movement speed by ([0-9]+)% while out of combat/i,
	},
	{
		id: "Thrassian Stranglers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		maxTimes: 50,
		match: /Each stack increases your Weapon and Spell Damage by ([0-9]+), reduces your Maximum Health by [0-9]+, and reduces effectiveness of your damage shields by [0-9]+%/i,
	},
	{
		id: "Thrassian Stranglers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		maxTimes: 50,
		match: /Each stack increases your Weapon and Spell Damage by ([0-9]+), reduces your Maximum Health by [0-9]+, and reduces effectiveness of your damage shields by [0-9]+%/i,
	},
	{
		id: "Thrassian Stranglers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "Health",
		maxTimes: 50,
		factorValue: -1,
		match: /Each stack increases your Weapon and Spell Damage by [0-9]+, reduces your Maximum Health by ([0-9]+), and reduces effectiveness of your damage shields by [0-9]+%/i,
	},
	{
		id: "Thrassian Stranglers",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "DamageShield",
		factorValue: -1,
		maxTimes: 50,
		display: "%",
		match: /Each stack increases your Weapon and Spell Damage by [0-9]+, reduces your Maximum Health by [0-9]+, and reduces effectiveness of your damage shields by ([0-9]+%)/i,
	},
	{
		id: "Vrol's Command",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		buffId: "Major Aegis",
		match: /apply Major Aegis to you and up to [0-9]+ nearby group members for/i,
	},
	{
		id: "Perfected Vrol's Command",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		buffId: "Major Aegis",
		match: /apply Major Aegis to you and up to [0-9]+ nearby group members for/i,
	},
	{
		id: "Yandir's Might (Giant's Endurance)",
		setId: "Yandir's Might",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Yandir's Might (Giant's Might)" ],
		statId: "WeaponDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing Critical Damage grants you a stack of Giant's Endurance, up to one every half second\. Each stack of Giant's Endurance adds [0-9]+ Weapon and Spell Damage, and stacks up to [0-9]+ times.\.)/i,
		match: /Each stack of Giant's Endurance adds ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Yandir's Might (Giant's Endurance)",
		setId: "Yandir's Might",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Yandir's Might (Giant's Might)" ],
		statId: "SpellDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing Critical Damage grants you a stack of Giant's Endurance, up to one every half second\. Each stack of Giant's Endurance adds [0-9]+ Weapon and Spell Damage, and stacks up to [0-9]+ times.\.)/i,
		match: /Each stack of Giant's Endurance adds ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Yandir's Might (Giant's Might)",
		setId: "Yandir's Might",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Yandir's Might (Giant's Endurance)" ],
		statId: "WeaponDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing damage with a Fully Charged Heavy Attack removes Giant's Endurance and grants Giant's Might for [0-9]+ seconds, increasing your Weapon and Spell Damage by [0-9]+ per stack removed\.)/i,
		match: /increasing your Weapon and Spell Damage by ([0-9]+) per stack removed/i,
	},
	{
		id: "Yandir's Might (Giant's Might)",
		setId: "Yandir's Might",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Yandir's Might (Giant's Endurance)" ],
		statId: "SpellDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing damage with a Fully Charged Heavy Attack removes Giant's Endurance and grants Giant's Might for [0-9]+ seconds, increasing your Weapon and Spell Damage by [0-9]+ per stack removed\.)/i,
		match: /increasing your Weapon and Spell Damage by ([0-9]+) per stack removed/i,
	},
	{
		id: "Perfected Yandir's Might (Giant's Endurance)",
		setId: "Perfected Yandir's Might",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Perfected Yandir's Might (Giant's Might)" ],
		statId: "WeaponDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing Critical Damage grants you a stack of Giant's Endurance, up to one every half second\. Each stack of Giant's Endurance adds [0-9]+ Weapon and Spell Damage, and stacks up to [0-9]+ times.\.)/i,
		match: /Each stack of Giant's Endurance adds ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Perfected Yandir's Might (Giant's Endurance)",
		setId: "Perfected Yandir's Might",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Perfected Yandir's Might (Giant's Might)" ],
		statId: "SpellDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing Critical Damage grants you a stack of Giant's Endurance, up to one every half second\. Each stack of Giant's Endurance adds [0-9]+ Weapon and Spell Damage, and stacks up to [0-9]+ times.\.)/i,
		match: /Each stack of Giant's Endurance adds ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Perfected Yandir's Might (Giant's Might)",
		setId: "Perfected Yandir's Might",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Perfected Yandir's Might (Giant's Endurance)" ],
		statId: "WeaponDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing damage with a Fully Charged Heavy Attack removes Giant's Endurance and grants Giant's Might for [0-9]+ seconds, increasing your Weapon and Spell Damage by [0-9]+ per stack removed\.)/i,
		match: /increasing your Weapon and Spell Damage by ([0-9]+) per stack removed/i,
	},
	{
		id: "Perfected Yandir's Might (Giant's Might)",
		setId: "Perfected Yandir's Might",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Perfected Yandir's Might (Giant's Endurance)" ],
		statId: "SpellDamage",
		maxTimes: 10,
		rawInputMatch: /(Dealing damage with a Fully Charged Heavy Attack removes Giant's Endurance and grants Giant's Might for [0-9]+ seconds, increasing your Weapon and Spell Damage by [0-9]+ per stack removed\.)/i,
		match: /increasing your Weapon and Spell Damage by ([0-9]+) per stack removed/i,
	},
	{
		id: "Eternal Vigor (Magicka + Stamina)",
		setId: "Eternal Vigor",
		setBonusCount: 4,
		toggle: true,
		enabled: true,
		disableSetIds: [ "Eternal Vigor (Health)" ],
		statId: "MagickaRegen",
		rawInputMatch: /(Adds [0-9]+ Stamina and Magicka Recovery while your Health is above [0-9]+%\.)/,
		match: /Adds ([0-9]+) Stamina and Magicka Recovery while/i,
	},
	{
		id: "Eternal Vigor (Magicka + Stamina)",
		setId: "Eternal Vigor",
		setBonusCount: 4,
		toggle: true,
		enabled: true,
		disableSetIds: [ "Eternal Vigor (Health)" ],
		statId: "StaminaRegen",
		rawInputMatch: /(Adds [0-9]+ Stamina and Magicka Recovery while your Health is above [0-9]+%\.)/,
		match: /Adds ([0-9]+) Stamina and Magicka Recovery while your Health is above/i,
	},
	{
		id: "Eternal Vigor (Health)",
		setId: "Eternal Vigor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Eternal Vigor (Magicka + Stamina)" ],
		statId: "HealthRegen",
		rawInputMatch: /(Adds [0-9]+ Health Recovery while your Health is [0-9]+% or less\.)/,
		match: /Adds ([0-9]+) Health Recovery while your Health is/i,
	},
	{
		id: "Stuhn's Favor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalPenetration",
		match: /Off Balance, your Physical and Spell Penetration is increased by ([0-9]+) for/i,
	},
	{
		id: "Stuhn's Favor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellPenetration",
		match: /Off Balance, your Physical and Spell Penetration is increased by ([0-9]+) for/i,
	},
	{
		id: "Cruel Flurry",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		buffId: "Maelstrom DW Enchantment",
		updateBuffValue : true,
		enableOffBar : true,
		match: /When you deal damage with Flurry, your single target damage over time abilities used within [0-9]+ seconds gain ([0-9]+) Spell and Weapon Damage./i,
	},
	{
		id: "Dro'Zakar's Claws",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		maxTimes: 10,
		category: "Set",
		statId: "WeaponDamage",
		match: /For every bleed effect you have on an enemy, increase your Weapon and Spell Damage by ([0-9]+) against them/i,
	},
	{
		id: "Dro'Zakar's Claws",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		maxTimes: 10,
		category: "Set",
		statId: "SpellDamage",
		match: /For every bleed effect you have on an enemy, increase your Weapon and Spell Damage by ([0-9]+) against them/i,
	},
	{	
		id: "Grave Guardian",
		setBonusCount: 4,
		buffId: "Grave Guardian",
		toggle: true,
		enabled: false,
		updateBuffValue : true,
		enableOffBar : false,
		match: /Summon a stone aura while you are Bracing, hardening you and your nearby group members, increasing your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{	id: "Titanborn Strength x2",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Titanborn Strength x4" ],
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x2",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Titanborn Strength x4" ],
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x2",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Titanborn Strength x4" ],
		statId: "PhysicalPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x2",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetIds: [ "Titanborn Strength x4" ],
		statId: "SpellPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x4",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		factorValue: 3.0,
		disableSetIds: [ "Titanborn Strength x2" ],
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x4",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		factorValue: 3.0,
		disableSetIds: [ "Titanborn Strength x2" ],
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage and [0-9]+ Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x4",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		factorValue: 3.0,
		disableSetIds: [ "Titanborn Strength x2" ],
		statId: "PhysicalPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Titanborn Strength x4",
		setId: "Titanborn Strength",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		factorValue: 3.0,
		disableSetIds: [ "Titanborn Strength x2" ],
		statId: "SpellPenetration",
		match: /Adds [0-9]+ Weapon and Spell Damage and ([0-9]+) Offensive Penetration.\s*While in combat, this bonus doubles when you are under [0-9]+% Health and quadruples when you are under [0-9]+% Health./i,
	},
	{	id: "Hiti's Hearth",
		setBonusCount: 4,
		buffId: "Hitis Hearth",
		toggle: true,
		enabled: false,
		updateBuffValue : true,
		enableOffBar : false,
		factorValue: -1,
		display: "%",
		match: /and reduce the cost of Sprint, Block, and Roll Dodge by ([0-9]+)%/i,
	},
	{	id: "Perfected Eye of Nahviintaas",
		setBonusCount: 5,
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		toggle: true,
		enabled: false,
		combineAs: "*%",
		match: /When an ally activates one of your synergies, you and the ally who activated the synergy get ([0-9]+)% cost reduction for non-Ultimate abilities/i,
	},
	{	id: "Perfected Eye of Nahviintaas",
		setBonusCount: 5,
		statId: "StaminaCost",
		display: "%",
		factorValue: -1,
		toggle: true,
		enabled: false,
		combineAs: "*%",
		match: /When an ally activates one of your synergies, you and the ally who activated the synergy get ([0-9]+)% cost reduction for non-Ultimate abilities/i,
	},
	{	id: "Eye of Nahviintaas",
		setBonusCount: 4,
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		toggle: true,
		enabled: false,
		combineAs: "*%",
		match: /When an ally activates one of your synergies, you and the ally who activated the synergy get ([0-9]+)% cost reduction for non-Ultimate abilities/i,
	},
	{	id: "Eye of Nahviintaas",
		setBonusCount: 4,
		statId: "StaminaCost",
		display: "%",
		factorValue: -1,
		toggle: true,
		enabled: false,
		combineAs: "*%",
		match: /When an ally activates one of your synergies, you and the ally who activated the synergy get ([0-9]+)% cost reduction for non-Ultimate abilities/i,
	},
	{	id: "Senche-raht's Grit",
		setBonusCount: 4,
		statId: "HealingReceived",
		display: "%",
		toggle: true,
		enabled: false,
		match: /After being damaged by a damage over time ability, increase your Healing Received by ([0-9]+)% and your Physical and Spell Resistance by [0-9]+ /i,
	},
	{	id: "Senche-raht's Grit",
		setBonusCount: 4,
		statId: "PhysicalResist",
		toggle: true,
		enabled: false,
		match: /After being damaged by a damage over time ability, increase your Healing Received by [0-9]+% and your Physical and Spell Resistance by ([0-9]+) /i,
	},
	{	id: "Senche-raht's Grit",
		setBonusCount: 4,
		statId: "SpellResist",
		toggle: true,
		enabled: false,
		match: /After being damaged by a damage over time ability, increase your Healing Received by [0-9]+% and your Physical and Spell Resistance by ([0-9]+) /i,
	},
	{	id: "Mark of the Pariah",
		setBonusCount: 4,
		statId: "SpellResist",
		maxTimes: 100,
		factorValue: 0.0076744,
		toggle: true,
		enabled: false,
		round: "floor",
		match: /Increases your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{	id: "Mark of the Pariah",
		setBonusCount: 4,
		statId: "PhysicalResist",
		maxTimes: 100,
		factorValue: 0.0076744,
		toggle: true,
		enabled: false,
		round: "floor",
		match: /Increases your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{	
		id: "Tzogvin's Warband",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponCrit",
		maxTimes: 10,
		enableBuffAtMax: "Minor Force",
		match: /When you deal Critical Damage, you gain a stack of Precision, increasing your Critical Chance by ([0-9]+) for [0-9]+ seconds, up to [0-9]+ stacks max/i,
	},
	{	
		id: "Tzogvin's Warband",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellCrit",
		maxTimes: 10,
		match: /When you deal Critical Damage, you gain a stack of Precision, increasing your Critical Chance by ([0-9]+) for [0-9]+ seconds, up to [0-9]+ stacks max/i,
	},
	{	
		id: "Timeless Blessing",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "HealingAbilityCost",
		factorValue: -1,
		display: "%",
		match: /When you cast Blessing of Protection, the cost of your Magicka and Stamina healing abilities are reduced by ([0-9]+)% for/i,
	},
	{	
		id: "Perfected Timeless Blessing",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "HealingAbilityCost",
		factorValue: -1,
		display: "%",
		match: /When you cast Blessing of Protection, the cost of your Magicka and Stamina healing abilities are reduced by ([0-9]+)% for/i,
	},
	{	
		id: "Puncturing Remedy",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /When you deal damage with Puncture, you heal for ([0-9]+) Health and gain Spell and Physical Resistance equal to the amount of healing/i,
	},
	{	
		id: "Puncturing Remedy",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /When you deal damage with Puncture, you heal for ([0-9]+) Health and gain Spell and Physical Resistance equal to the amount of healing/i,
	},
	{	
		id: "Perfected Puncturing Remedy",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /When you deal damage with Puncture, you heal for ([0-9]+) Health and gain Spell and Physical Resistance equal to the amount of healing/i,
	},
	{	
		id: "Perfected Puncturing Remedy",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /When you deal damage with Puncture, you heal for ([0-9]+) Health and gain Spell and Physical Resistance equal to the amount of healing/i,
	},
	{
		id: "Trial by Fire",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Item",
		statId: "SpellResist",
		match: /While under the effect of an Elemental Status Effect you gain ([0-9]+) Armor/i,
	},
	{
		id: "Trial by Fire",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Item",
		statId: "PhysicalResist",
		match: /While under the effect of an Elemental Status Effect you gain ([0-9]+) Armor/i,
	},
	{
		id: "Way of Martial Knowledge",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Way of Martial Knowledge",
		updateBuffValue: true,
		display: "%",
		match: /While your Stamina is below [0-9]+\.?[0-9]*%, your Light Attacks cause the enemy to take ([0-9]+\.?[0-9]*)% additional damage/i,
	},
	{
		id: "Kvatch Gladiator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /You gain ([0-9]+) Weapon and Spell Damage against targets who are at or below [0-9]+% Health/i,
	},
	{
		id: "Kvatch Gladiator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /You gain ([0-9]+) Weapon and Spell Damage against targets who are at or below [0-9]+% Health/i,
	},
	{
		id: "Armor of the Code",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "WeaponCrit",
		match: /Increase your Critical Chance against targets with a lower % of health than you by ([0-9]+)/i,

	},
	{
		id: "Armor of the Code",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "SpellCrit",
		match: /Increase your Critical Chance against targets with a lower % of health than you by ([0-9]+)/i,
	},
	{
		id: "Armor Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalResist",
		rawInputMatch: /(When you use an Armor ability while in combat, your Physical and Spell Resistance is increased by [0-9]+)/i,
		match: /When you use an Armor ability while in combat, your Physical and Spell Resistance is increased by ([0-9]+)/i,
	},
	{
		id: "Armor Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellResist",
		match: /When you use an Armor ability while in combat, your Physical and Spell Resistance is increased by ([0-9]+)/i,
	},
	{
		id: "Armor of Truth",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you deal damage to an enemy who is Off Balance, your Weapon and Spell Damage are increased by ([0-9]+) for/i,
	},
	{
		id: "Armor of Truth",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you deal damage to an enemy who is Off Balance, your Weapon and Spell Damage are increased by ([0-9]+) for/i,
	},
	{
		id: "Balorgh",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		factorValue: 1,
		maxTimes: 500,
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage equal to the amount of total Ultimate consumed, and Physical and Spell Penetration equal to [0-9]+ times the amount for/i,
	},
	{
		id: "Balorgh",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		factorValue: 1,
		maxTimes: 500,
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage equal to the amount of total Ultimate consumed, and Physical and Spell Penetration equal to [0-9]+ times the amount for/i,
	},
	{
		id: "Balorgh",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalPenetration",
		factorValue: 23,
		maxTimes: 500,
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage equal to the amount of total Ultimate consumed, and Physical and Spell Penetration equal to [0-9]+ times the amount for/i,
	},
	{
		id: "Balorgh",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellPenetration",
		factorValue: 23,
		maxTimes: 500,
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage equal to the amount of total Ultimate consumed, and Physical and Spell Penetration equal to [0-9]+ times the amount for/i,
	},
	{
		id: "Berserking Warrior",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		maxTimes: 10,
		statId: "WeaponCrit",
		match: /When you deal Martial melee damage, your Critical Chance is increased by ([0-9]+) for [0-9]+ seconds, stacking up to [0-9]+ times/i,
	},
	{
		id: "Berserking Warrior",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		maxTimes: 10,
		statId: "SpellCrit",
		match: /When you deal Martial melee damage, your Critical Chance is increased by ([0-9]+) for [0-9]+ seconds, stacking up to [0-9]+ times/i,
	},
	{
		id: "Blood Moon",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "LAMeleeDamage",
		display: "%",
		match: /When you gain [0-9]+ stacks, you become Frenzied for [0-9]+ seconds, increasing your melee Light Attack damage by ([0-9]+)% and attack speed by [0-9]+%/i,
	},
	{
		id: "Blood Moon",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "LAMeleeSpeed",
		factorValue: -1,
		display: "%",
		match: /When you gain [0-9]+ stacks, you become Frenzied for [0-9]+ seconds, increasing your melee Light Attack damage by [0-9]+% and attack speed by ([0-9]+)%/i,
	},
	{
		id: "Bloodspawn",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalResist",
		match: /Ultimate and increase your Physical and Spell Resistance by ([0-9]+) for/i,
	},
	{
		id: "Bloodspawn",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellResist",
		match: /Ultimate and increase your Physical and Spell Resistance by ([0-9]+) for/i,
	},
	{
		id: "Briarheart",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you deal Critical Damage, you increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Briarheart",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you deal Critical Damage, you increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Burning Spellweave",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you deal damage with a Flame Damage ability, you apply the Burning status effect to the enemy and increase your Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Burning Spellweave",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you deal damage with a Flame Damage ability, you apply the Burning status effect to the enemy and increase your Weapon and Spell Damage by ([0-9]+) for/i,
	},
	{
		id: "Chaotic Whirlwind (Movement Speed)",
		setId: "Chaotic Whirlwind",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "MovementSpeed",
		display: "%",
		maxTimes: 5,
		match: /When you cast Whirlwind while in combat, you gain a stack of Chaotic Whirlwind for [0-9]+ seconds, granting you ([0-9]+)% Movement Speed per stack, up to a maximum of [0-9]+ times/i,
	},
	{
		id: "Chaotic Whirlwind (Damage)",
		setId: "Chaotic Whirlwind",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 75,
		match: /While Chaotic Whirlwind is active, you gain ([0-9]+) Weapon and Spell Damage for every [0-9]+% bonus Movement Speed you have, up to a maximum of [0-9]+/i,
	},
	{
		id: "Chaotic Whirlwind (Damage)",
		setId: "Chaotic Whirlwind",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 75,
		match: /While Chaotic Whirlwind is active, you gain ([0-9]+) Weapon and Spell Damage for every [0-9]+% bonus Movement Speed you have, up to a maximum of [0-9]+/i,
	},
	{
		id: "Perfected Chaotic Whirlwind",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 75,
		match: /While Chaotic Whirlwind is active, you gain ([0-9]+) Weapon and Spell Damage for every [0-9]+% bonus Movement Speed you have, up to a maximum of [0-9]+/i,
	},
	{
		id: "Perfected Chaotic Whirlwind",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 75,
		match: /While Chaotic Whirlwind is active, you gain ([0-9]+) Weapon and Spell Damage for every [0-9]+% bonus Movement Speed you have, up to a maximum of [0-9]+/i,
	},
	{
		id: "Caustic Arrow",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "EnemyTargetWeaponDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against targets affected by your Poison Arrow/i,
	},
	{
		id: "Caustic Arrow",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "EnemyTargetSpellDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against targets affected by your Poison Arrow/i,
	},
	{
		id: "Perfected Caustic Arrow",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "EnemyTargetWeaponDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against targets affected by your Poison Arrow/i,
	},
	{
		id: "Perfected Caustic Arrow",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "EnemyTargetSpellDamage",
		match: /Increases your Weapon and Spell Damage by ([0-9]+) against targets affected by your Poison Arrow/i,
	},
	{
		id: "Clever Alchemist",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you drink a potion during combat you feel a rush of energy, increasing your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Clever Alchemist",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you drink a potion during combat you feel a rush of energy, increasing your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Crushing Wall",
		setBonusCount: 1,
		toggle: true,
		enabled: false,
		buffId : "Maelstrom Destruction Enchantment",
		updateBuffValue : true,
		enableOffBar : true,
		match: /Your Light and Heavy Attacks deal an additional ([0-9]+) damage to enemies in your Wall of Elements/i,
	},
	{
		id: "Perfected Crushing Wall",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		buffId : "Maelstrom Destruction Enchantment",
		updateBuffValue : true,
		enableOffBar : true,
		match: /Your Light and Heavy Attacks deal an additional ([0-9]+) damage to enemies in your Wall of Elements/i,
	},
	{
		id: "Domihaus",
		setId: "Domihaus",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /Standing within the ring grants you ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Domihaus",
		setId: "Domihaus",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /Standing within the ring grants you ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Duneripper's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /While you are Bracing, your Physical and Spell Resistance are increased by ([0-9]+)/i,
	},
	{
		id: "Duneripper's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /While you are Bracing, your Physical and Spell Resistance are increased by ([0-9]+)/i,
	},
	{
		id: "Elemental Succession (Flame)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusSpellDmg",
		statId: "Flame",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Elemental Succession (Shock)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusSpellDmg",
		statId: "Shock",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Elemental Succession (Cold)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusSpellDmg",
		statId: "Frost",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Elemental Succession (Flame)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusWeaponDmg",
		statId: "Flame",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Elemental Succession (Shock)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusWeaponDmg",
		statId: "Shock",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Elemental Succession (Cold)",
		setId: "Elemental Succession",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "SkillBonusWeaponDmg",
		statId: "Frost",
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9]+) Weapon and Spell Damage /i,
	},
	{
		id: "Embershield",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalResist",
		match: /When you complete a fully-charged Heavy Attack, you increase your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Embershield",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellResist",
		match: /When you complete a fully-charged Heavy Attack, you increase your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Essence Thief",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "DamageDone",
		display: "%",
		match: /increases your damage done by ([0-9]+\.?[0-9]*)% for/i,
	},
	{
		id: "Flanking Strategist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your damaging abilities when you attack an enemy from behind or their sides/i,
	},
	{
		id: "Flanking Strategist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your damaging abilities when you attack an enemy from behind or their sides/i,
	},
	{
		id: "Ironblood",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "DamageTaken",
		factorValue: -1,
		display: '%',
		match: /When you take damage, you have a(?:n|) [0-9]+% chance to turn your blood into pure iron for [0-9]+ seconds, reducing your damage taken by ([0-9]+)%, but your Movement Speed is reduced by [0-9]+%/i,
	},
	{
		id: "Ironblood",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "MovementSpeed",
		factorValue: -1,
		display: '%',
		match: /When you take damage, you have a(?:n|) [0-9]+% chance to turn your blood into pure iron for [0-9]+ seconds, reducing your damage taken by [0-9\.]+%, but your Movement Speed is reduced by ([0-9]+)%/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Health",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Magicka",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Stamina",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique +600%",
		setId: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Health",
		factorValue: 7,
		disableSetId: "Imperial Physique",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique +600%",
		setId: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Magicka",
		factorValue: 7,
		disableSetId: "Imperial Physique",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique +600%",
		setId: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Stamina",
		factorValue: 7,
		disableSetId: "Imperial Physique",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka, and Stamina by ([0-9]+)/i,
	},
	{
		id: "Jolting Arms",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellResist",
		match: /When you Block, you charge your arms, increasing your Physical and Spell Resistance by ([0-9]+) for/i,
	},
	{
		id: "Jolting Arms",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalResist",
		match: /When you Block, you charge your arms, increasing your Physical and Spell Resistance by ([0-9]+) for/i,
	},
	{
		id: "Jolting Arms",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Set",
		statId: "ExtraBashDamage",
		match: /and causing your next Bash attack to deal an additional ([0-9]+) damage/i,
	},
	{
		id: "Light of Cyrodiil",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageTaken",
		combineAs: "*%",
		factorValue: -0.01,
		match: /While you are casting or channeling an ability, your damage taken is reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Lord Warden",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Lord Warden",
		updateBuffValue: true,
		match: /chance to summon a shadow orb for [0-9]+ seconds that increases the Physical and Spell Resistance of you and your group members within [0-9]+ meters by ([0-9]+)/i,
	},
	{
		id: "Mantle of Siroria",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 10,
		match: /Standing in the ring grants you a stack of Siroria's Boon for [0-9]+ seconds, up to a maximum of 10 times. Each stack increases your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{
		id: "Mantle of Siroria",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 10,
		match: /Standing in the ring grants you a stack of Siroria's Boon for [0-9]+ seconds, up to a maximum of 10 times. Each stack increases your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{
		id: "Perfected Mantle of Siroria",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 10,
		match: /Standing in the ring grants you a stack of Siroria's Boon for [0-9]+ seconds, up to a maximum of 10 times. Each stack increases your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{
		id: "Perfected Mantle of Siroria",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 10,
		match: /Standing in the ring grants you a stack of Siroria's Boon for [0-9]+ seconds, up to a maximum of 10 times. Each stack increases your Weapon and Spell Damage by ([0-9]+)\./i,
	},
	{
		id: "Mechanical Acuity",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Item",
		statId: "SpellCrit",
		maxTimes: 5,
		display: "%",
		match: /When you deal non Critical Damage, you gain a stack of Mechanical Acuity for [0-9]+ seconds, granting you ([0-9]+)% Critical Strike chance per stack/i,
	},
	{
		id: "Mechanical Acuity",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Item",
		statId: "WeaponCrit",
		maxTimes: 5,
		display: "%",
		match: /When you deal non Critical Damage, you gain a stack of Mechanical Acuity for [0-9]+ seconds, granting you ([0-9]+)% Critical Strike chance per stack/i,
	},
	{
		id: "Meritorious Service",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Meritorious Service",
		match: /When you cast a Support ability while in combat, you increase the Physical and Spell Resistance of yourself and up to [0-9]+ group members within [0-9]+ meters by ([0-9]+) for/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "MagickaCost",
		display: "%",
		combineAs: "*%",
		match: /but also increases the cost of your abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "StaminaCost",
		display: "%",
		combineAs: "*%",
		match: /but also increases the cost of your abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /which increases your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /which increases your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Moon Hunter",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		category: "Set",
		match: /When your alchemical poison fires, increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Moon Hunter",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		category: "Set",
		match: /When your alchemical poison fires, increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Necropotence",
		setBonusCount: 4,
		toggle: true,
		enabled: true,
		enableOffBar : true,
		statId: "Magicka",
		category: "Skill2",
		match: /While you have a pet active, your Max Magicka is increased by ([0-9]+)/i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LASpellDamage",
		match: /When you deal damage with a Light or Heavy Attack in melee range, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HASpellDamage",
		match: /When you deal damage with a Light or Heavy Attack in melee range, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LAWeaponDamage",
		match: /When you deal damage with a Light or Heavy Attack in melee range, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HAWeaponDamage",
		match: /When you deal damage with a Light or Heavy Attack in melee range, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Orgnum's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "HealthRegen",
		match: /While you are under [0-9]+% Health, your Health Recovery is increased by ([0-9]+) and your Physical and Spell Resistance is increased by [0-9]+/i,
	},
	{
		id: "Orgnum's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "SpellResist",
		match: /While you are under [0-9]+% Health, your Health Recovery is increased by [0-9]+ and your Physical and Spell Resistance is increased by ([0-9]+)/i,
	},
	{
		id: "Orgnum's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "PhysicalResist",
		match: /While you are under [0-9]+% Health, your Health Recovery is increased by [0-9]+ and your Physical and Spell Resistance is increased by ([0-9]+)/i,
	},
	{
		id: "Permafrost",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : false,
		statId: "HealthRegen",
		match: /While you have a damage shield on you, your Health Recovery is increased by ([0-9]+)/i,
	},
	{
		id: "Powerful Assault",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Powerful Assault",
		updateBuffValue: true,
		match: /When you cast an Assault ability while in combat, you and up to [0-9]+ group members within [0-9]+ meters gain ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Ravager",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		maxTimes: 5,
		statId: "WeaponDamage",
		match: /Each time you attempt to reduce the target's Physical or Spell Resistance, you gain a stack of Ravager for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Ravager",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		maxTimes: 5,
		statId: "SpellDamage",
		match: /Each time you attempt to reduce the target's Physical or Spell Resistance, you gain a stack of Ravager for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Reactive Armor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageTaken",
		display: "%",
		factorValue: -1,
		match: /After you are affected by a disabling effect, your damage taken is reduced by ([0-9]+\.?[0-9]*)% for /i,
	},
	{
		id: "Renald's Resolve",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 8,
		statId: "HealingTaken",
		display: "%",
		match: /Whenever you deal direct damage, gain a stack of Resolve for [0-9]+ seconds. Each stack increases your Healing Taken by ([0-9]+)% and your Physical and Spell Resistance by [0-9]+/i,
	},
	{
		id: "Renald's Resolve",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 8,
		statId: "PhysicalResist",
		match: /Whenever you deal direct damage, gain a stack of Resolve for [0-9]+ seconds. Each stack increases your Healing Taken by [0-9]+% and your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Renald's Resolve",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		maxTimes: 8,
		statId: "SpellResist",
		match: /Whenever you deal direct damage, gain a stack of Resolve for [0-9]+ seconds. Each stack increases your Healing Taken by [0-9]+% and your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Robes of Transmutation",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Robes of Transmutation",
		updateBuffValue: true,
		match: /When you heal yourself or an ally with a healing over time ability, grant them ([0-9]+) Critical Resistance/i,
	},
	{
		id: "Scathing Mage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you deal direct damage, you have a [0-9]+% chance to increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Scathing Mage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you deal direct damage, you have a [0-9]+% chance to increase your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Shield Breaker",
		setBonusCount: 4,
		enabled: false,
		statId: "DamageDone",
		display: "%",
		match: /Increases your damage done by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		id: "Shield Breaker",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageDone",
		display: "%",
		match: /Increases your damage done by ([0-9]+)%. This effect is doubled when attacking targets with a damage shield active/i,
	},
	{
		id: "Malacath's Band of Brutality", 
		setBonusCount: 1,
		enabled: false,
		statId: "DamageDone",
		display: "%",
		match: /Increases your damage done by ([0-9]+\.?[0-9]*)% but decreases your Critical Damage done by [0-9]+\.?[0-9]*%/i,
	},
	{
		id: "Malacath's Band of Brutality", 
		setBonusCount: 1,
		enabled: false,
		statId: "CritDamage",
		factorValue: -1,
		display: "%",
		match: /Increases your damage done by [0-9]+\.?[0-9]*% but decreases your Critical Damage done by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Gaze of Sithis",
		setBonusCount: 1,
		enabled: false,
		statId: "BlockMitigation",
		display: "%",
		statValue: -1000,
		match: /Reduces your block mitigation to 0/i,
	},
	{
		id: "Shroud of the Lich",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "MagickaRegen",
		match: /When you cast an ability that costs resources while under [0-9]+\.?[0-9]*% Magicka while in combat, your Magicka Recovery is increased by ([0-9]+) for /i,
	},
	{
		id: "Senche's Bite",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "CritDamage",
		display: "%",
		match: /Whenever you successfully Dodge, increase your Critical Damage and Critical Healing by ([0-9.]+)% for/i,
	},
	{
		id: "Senche's Bite",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "CritHealing",
		display: "%",
		match: /Whenever you successfully Dodge, increase your Critical Damage and Critical Healing by ([0-9.]+)% for/i,
	},
	{
		id: "Seventh Legion Brute",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you cast an ability that increases your Physical or Spell Resistance while in combat, you gain ([0-9]+) Weapon and Spell Damage and [0-9]+ Health Recovery/i
	},
	{
		id: "Seventh Legion Brute",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you cast an ability that increases your Physical or Spell Resistance while in combat, you gain ([0-9]+) Weapon and Spell Damage and [0-9]+ Health Recovery/i
	},
	{
		id: "Seventh Legion Brute",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "HealthRegen",
		match: /When you cast an ability that increases your Physical or Spell Resistance while in combat, you gain [0-9]+ Weapon and Spell Damage and ([0-9]+) Health Recovery/i,
	},
	{
		id: "Sithis' Touch",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "MovementSpeed",
		maxTimes: 20,
		display: "%",
		match: /When you kill an enemy you gain ([0-9]+)% movement speed for/i,
	},
	{
		id: "Spell Power Cure",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Major Courage",
		updateBuffValue : true,
		match: /When you overheal yourself or an ally, you give the target Major Courage for [0-9]+ seconds which increases their Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Spell Strategist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you deal damage with a Light Attack, you place a mark over your target for 5 seconds, granting you ([0-9]+) Weapon and Spell Damage against your marked target/i,
	},
	{
		id: "Spell Strategist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you deal damage with a Light Attack, you place a mark over your target for 5 seconds, granting you ([0-9]+) Weapon and Spell Damage against your marked target/i,
	},
	{
		id: "Tormentor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalResist",
		match: /you gain ([0-9]+) Physical and Spell Resistance and taunt/
	},
	{
		id: "Tormentor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellResist",
		match: /you gain ([0-9]+) Physical and Spell Resistance and taunt/
	},
	{
		id: "The Troll King",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "HealthRegen",
		match: /When you heal yourself or an ally, if they are still below [0-9]+% Health, their Health Recovery is increased by ([0-9]+) /
	},
	{
		id: "Twice-Fanged Serpent",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "PhysicalPenetration",
		maxTimes: 10,
		match: /When you deal damage, your Offensive Penetration is increased by ([0-9]+)/i,
	},
	{
		id: "Twice-Fanged Serpent",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellPenetration",
		maxTimes: 10,
		match: /When you deal damage, your Offensive Penetration is increased by ([0-9]+)/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LASpellDamage",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HASpellDamage",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LAWeaponDamage",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HAWeaponDamage",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillSpellDamage",
		statId: "Mend Wounds",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillWeaponDamage",
		statId: "Mend Wounds",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillWeaponDamage",
		statId: "Overload",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillSpellDamage",
		statId: "Overload",
		match: /When you use an ability that costs Magicka while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HASpellDamage",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "HAWeaponDamage",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LASpellDamage",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "Skill2",
		statId: "LAWeaponDamage",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillSpellDamage",
		statId: "Mend Wounds",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillWeaponDamage",
		statId: "Mend Wounds",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillWeaponDamage",
		statId: "Overload",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		category: "SkillSpellDamage",
		statId: "Overload",
		match: /When you use an ability that costs Stamina while in combat, you add ([0-9]+) Weapon and Spell Damage to your Light and Heavy Attacks/i,
	},
	{
		id: "Vestment of Olorime",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		buffId: "Major Courage",
		updateBuffValue : true,
		match: /You and your group members in the circle gain Major Courage for [0-9]+ seconds, increasing your Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		id: "Warrior's Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		maxTimes: 20,
		match: /When you take damage, your Weapon and Spell Damage is increased by ([0-9]+) for/i,
	},
	{
		id: "Warrior's Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		maxTimes: 20,
		match: /When you take damage, your Weapon and Spell Damage is increased by ([0-9]+) for/i,
	},
	{
		id: "Way of Air",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "WeaponDamage",
		match: /When you use Roll Dodge, your Weapon and Spell Damage is increased by ([0-9]+)/i,
	},
	{
		id: "Way of Air",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		enableOffBar : true,
		statId: "SpellDamage",
		match: /When you use Roll Dodge, your Weapon and Spell Damage is increased by ([0-9]+)/i,
	},
	{
		id: "Marauder's Haste",
		setBonusCount: 4,
		enabled: false,
		enableOffBar: true,
		toggle: true,
		statId: "MovementSpeed",
		display: "%",
		match: /When you apply a damage shield to yourself or an ally, increase your Movement Speed by ([0-9]+)% for/i,
	},
	{
		id: "Dragonguard Elite",
		setBonusCount: 4,
		enabled: false,
		enableOffBar: true,
		toggle: true,
		maxTimes: 10,
		category: "Set",
		statId: "WeaponCrit",
		match: /Each stack of Dragonguard Tactics increases your Critical Chance by ([0-9]+)\./i,
	},
	{
		id: "Dragonguard Elite",
		setBonusCount: 4,
		enabled: false,
		enableOffBar: true,
		toggle: true,
		maxTimes: 10,
		category: "Set",
		statId: "SpellCrit",
		match: /Each stack of Dragonguard Tactics increases your Critical Chance by ([0-9]+)\./i,
	},
	{
		id: "Ancient Dragonguard (Damage)",
		setId: "Ancient Dragonguard",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		disableSetIds: ["Ancient Dragonguard (Resist)"],
		statId: "WeaponDamage",
		rawInputMatch: /(Adds [0-9]+ Weapon and Spell Damage while your health is above [0-9]+%\.)/i,
		match: /Adds ([0-9]+) Weapon and Spell Damage while your health is/i,
	},
	{
		id: "Ancient Dragonguard (Damage)",
		setId: "Ancient Dragonguard",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		disableSetIds: ["Ancient Dragonguard (Resist)"],
		statId: "SpellDamage",
		rawInputMatch: /(Adds [0-9]+ Weapon and Spell Damage while your health is above [0-9]+%\.)/i,
		match: /Adds ([0-9]+) Weapon and Spell Damage while your health is/i,
	},
	{
		id: "Ancient Dragonguard (Resist)",
		setId: "Ancient Dragonguard",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		disableSetIds: ["Ancient Dragonguard (Damage)"],
		statId: "PhysicalResist", 
		rawInputMatch: /(Adds [0-9]+ Physical and Spell Resistance while your health is [0-9]+% or less\.)/i,
		match: /Adds ([0-9]+) Physical and Spell Resistance while your Health is/i,
	},
	{
		id: "Ancient Dragonguard (Resist)",
		setId: "Ancient Dragonguard",
		setBonusCount: 4,
		enabled: false,
		toggle: true,
		disableSetIds: ["Ancient Dragonguard (Damage)"],
		statId: "SpellResist", 
		rawInputMatch: /(Adds [0-9]+ Physical and Spell Resistance while your health is [0-9]+% or less\.)/i,
		match: /Adds ([0-9]+) Physical and Spell Resistance while your Health is/i,
	},
];		// End of Toggled Sets

	
window.ESO_ENCHANT_ARMOR_MATCHES = [
	{
		statId: "Health",
		match: /Adds ([0-9]+) Maximum Health/i,
	},
	{
		statId: "Magicka",
		match: /Adds ([0-9]+) Maximum Magicka/i,
	},
	{
		statId: "Stamina",
		match: /Adds ([0-9]+) Maximum Stamina/i,
	},
	{
		statId: "Health",
		match: /Adds up to ([0-9]+) Maximum Health/i,
	},
	{
		statId: "Magicka",
		match: /Adds up to ([0-9]+) Maximum Magicka/i,
	},
	{
		statId: "Stamina",
		match: /Adds up to ([0-9]+) Maximum Stamina/i,
	},
	{
		category: "Item",
		statId: "BashWeaponDamage",
		match: /Adds ([0-9]+) Weapon Damage to your bash ability/i,
	},
	{
		category: "Item",
		statId: "BashWeaponDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your bash ability/i,
	},
	{
		category: "Item",
		statId: "BashSpellDamage",
		match: /Adds ([0-9]+) Weapon and Spell Damage to your bash ability/i,
	},
	{
		statId: "PhysicalResist",
		match: /Adds ([0-9]+) Physical Resistance/i,
	},
	{
		statId: "SpellResist",
		match: /Adds ([0-9]+) Spell Resistance/i,
	},
	{
		statId: "DiseaseResist",
		match: /Adds ([0-9]+) Disease Resistance/i,
	},
	{
		statId: "PoisonResist",
		match: /Adds ([0-9]+) Poison Resistance/i,
	},
	{
		statId: "FlameResist",
		match: /Adds ([0-9]+) Flame Resistance/i,
	},
	{
		statId: "FrostResist",
		match: /Adds ([0-9]+) Cold Resistance/i,
	},
	{
		statId: "ShockResist",
		match: /Adds ([0-9]+) Shock Resistance/i,
	},
	{
		statId: "HealthRegen",
		match: /Adds ([0-9]+) Health Recovery/i,
	},
	{
		statId: "MagickaRegen",
		match: /Adds ([0-9]+) Magicka Recovery/i,
	},
	{
		statId: "StaminaRegen",
		match: /Adds ([0-9]+) Stamina Recovery/i,
	},
	{
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Spell Damage\./i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon Damage\./i,
	},
	{
		statId: "PotionDuration",
		round: "floor10",
		match: /Increase the duration of potion effects by ([0-9]+\.?[0-9]*) second/i,
	},
	{
		statId: "PotionCooldown",
		round: "floor10",
		factorValue: -1,
		match: /Reduce the cooldown of potions below this item's level by ([0-9]+\.?[0-9]*) second/i,
	},
	{
		statId: "StaminaCost",
		factorValue: -1,
		match: /Reduce Stamina cost of abilities by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "MagickaCost",
		factorValue: -1,
		match: /Reduce Magicka cost of abilities by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "MagickaCost",
		factorValue: -1,
		match: /Reduce Magicka cost of spells by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "BashCost",
		factorValue: -1,
		match: /Reduce cost of bash by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "BlockCost",
		factorValue: -1,
		match: /Reduce cost of blocking by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "BashCost",
		factorValue: -1,
		match: /Reduce the cost of bash by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "BlockCost",
		factorValue: -1,
		match: /Reduce the cost of block by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "BlockCost",
		factorValue: -1,
		match: /and the cost of block by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "ExtraBashDamage",
		match: /Adds ([0-9]+) damage to your bash attack/i,
	},
	{
		category: "Item",
		statId: "HealthCost",
		factorValue: -1,
		match: /Reduce Health, Magicka, and Stamina cost of abilities by ([0-9]+)\./i,
	},
	{
		category: "Item",
		statId: "MagickaCost",
		factorValue: -1,
		match: /Reduce Health, Magicka, and Stamina cost of abilities by ([0-9]+)\./i,
	},
	{
		category: "Item",
		statId: "StaminaCost",
		factorValue: -1,
		match: /Reduce Health, Magicka, and Stamina cost of abilities by ([0-9]+)\./i,
	},
	
];


window.ESO_ENCHANT_OTHERHAND_WEAPON_MATCHES = 
[
	{
		statId: "OtherEffects",
		match: /Increase your Weapon Damage and Spell Damage by ([0-9]+) for [0-9]+ seconds/i,
		buffId : "Weapon Damage Enchantment",
		updateBuffValue : true,
	},
];

window.ESO_ENCHANT_DAMAGE_COOLDOWN = 4;
window.ESO_ENCHANT_OTHER_COOLDOWN = 10;
window.ESO_ENCHANT_OTHER_DURATION = 5;


window.ESO_ENCHANT_WEAPON_MATCHES = [
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) Magic Damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "",
		isHealing: true,
		match: /and restores ([0-9]+) Health/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "",
		match: /and restores ([0-9]+) Magicka/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "",
		match: /and restores ([0-9]+) Stamina/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		match: /Reduce the target's Physical and Spell Resistance by ([0-9]+) for/i,
		duration: ESO_ENCHANT_OTHER_DURATION,
		cooldown: ESO_ENCHANT_OTHER_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Oblivion",
		match: /Deals a maximum of ([0-9]+) Oblivion Damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Flame",
		match: /Deals ([0-9]+) flame damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Disease",
		match: /Deals ([0-9]+) disease damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Frost",
		match: /Deals ([0-9]+) cold damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Frost",
		match: /Deals ([0-9]+) frost damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Poison",
		match: /Deals ([0-9]+) poison damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Shock",
		match: /Deals ([0-9]+) shock damage/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		damageType: "Magic",
		// TODO: Toggle?
		match: /Deals ([0-9]+) Magic Damage to Undead and Daedra/i,
		duration: 0,
		cooldown: ESO_ENCHANT_DAMAGE_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		isDamageShield: true,
		match: /Grants a ([0-9]+) point Damage Shield for/i,
		duration: ESO_ENCHANT_OTHER_DURATION,
		cooldown: ESO_ENCHANT_OTHER_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		match: /Reduce target Weapon Damage and Spell Damage by ([0-9]+) for /i,
		buffId : "Weakening Enchantment (Target)",
		enableOffBar : true,
		updateBuffValue : true,
		duration: ESO_ENCHANT_OTHER_DURATION,
		cooldown: ESO_ENCHANT_OTHER_COOLDOWN,
	},
	{
		statId: "OtherEffects",
		match: /Increase your Weapon Damage and Spell Damage by ([0-9]+) for /i,
		buffId : "Weapon Damage Enchantment",
		updateBuffValue : true,
		enableOffBar : true,
		duration: ESO_ENCHANT_OTHER_DURATION,
		cooldown: ESO_ENCHANT_OTHER_COOLDOWN,
	},
];


window.ESO_ABILITYDESC_MATCHES = [
	{
		statId: "Health",
		match: /Max Health by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Magicka by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Magicka and Max Stamina by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Magicka and Stamina by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /Max Magicka and Stamina by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /Max Stamina by ([0-9]+)/i,
	},
	{
		statId: "HealthRegen",
		match: /Health Recovery by ([0-9]+)/i,
	},
	{
		statId: "MagickaRegen",
		match: /Magicka Recovery by ([0-9]+)/i,
	},
	{
		statId: "MagickaRegen",
		match: /Magicka and Stamina Recovery by ([0-9]+)/i,
	},
	{
		statId: "StaminaRegen",
		match: /Stamina Recovery by ([0-9]+)/i,
	},
	{
		statId: "StaminaRegen",
		match: /Stamina and Magicka Recovery by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Increase Max Magicka and Max Health by ([0-9]+)/i,
	},
	{
		statId: "MagickaRegen",
		match: /Increase Magicka Recovery, Stamina Recovery, and Health Recovery by ([0-9]+)/i,
	},
	{
		statId: "StaminaRegen",
		match: /Increase Magicka Recovery, Stamina Recovery, and Health Recovery by ([0-9]+)/i,
	},
	{
		statId: "HealthRegen",
		match: /Increase Magicka Recovery, Stamina Recovery, and Health Recovery by ([0-9]+)/i,
	},
	{
		statId: "MagickaRegen",
		match: /Increase Magicka Recovery and Health Recovery by ([0-9]+)/i,
	},
	{
		statId: "MagickaRegen",
		match: /Increase Magicka Recovery and Stamina Recovery by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Stamina and Magicka by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /Max Stamina and Magicka by ([0-9]+)/i,
	},
];


window.ESOBUILD_RAWOUTPUT_LABELREPLACEMENT =
{
		"CP.Enabled" : "CP Enabled",
		"Skill.HAStaRestoreWerewolf": "HA Stamina Restore Werewolf",
		"CP.RollDodgeCost": "Dodge Roll Cost",
		"Skill.RollDodgeCost": "Dodge Roll Cost",
		"Set.RollDodgeCost": "Dodge Roll Cost",
		"Buff.RollDodgeCost": "Dodge Roll Cost",
		"Skill2.RollDodgeCost": "Dodge Roll Cost",
		"Item.RollDodgeCost": "Dodge Roll Cost",
		"SkillLineDamage.Bow" : "Bow Damage",
		"SkillLineDamage.Duel_Wield" : "Duel Wield Damage",
		"SkillHealing.Green_Balance" : "Green Balance Healing",
		"SkillHealing.Restoration_Staff" : "Restoration Staff Healing",
		"SkillHealing.Restoring_Light" : "Restoring Light Healing",
		"Skill.HAMagRestore" : "Heavy Attack Magicka Restore",
		"Skill.HAStaRestore" : "Heavy Attack Stamina Restore",
};


window.ESOBUILD_RAWOUTPUT_LABELSUFFIX = 
{
	"SkillBonusWeaponDmg" : "WeaponDamage",
	"SkillBonusSpellDmg" : "SpellDamage",
	"SkillLineWeaponDmg" : "WeaponDamage",
	"SkillLineSpellDmg" : "SpellDamage",
};


window.InitializeEsoBuildInputValues = function (inputValues)
{
	for (var key in g_EsoInputStats)
	{
		var object = g_EsoInputStats[key];
		
		if (typeof(object) == "object")
		{
			inputValues[key] = {};
			
			for (var key1 in object)
			{
				inputValues[key][key1] = 0;
			}
		}
		else
		{
			inputValues[key] = 0;
		}
	}
	
	inputValues.pow = Math.pow;
	inputValues.floor = Math.floor;
	inputValues.round = Math.round;
	inputValues.fround = Math.fround;
	if (Math.fround == null) inputValues.fround = function(f) { return f; };
	inputValues.ceil = Math.ceil;
	inputValues.trunc = Math.trunc;
	inputValues.max = Math.max;
	inputValues.min = Math.min;
	
	inputValues.UsePtsRules = false;
}


window.GetEsoInputValues = function (mergeComputedStats)
{
	// if (console && console.time) console.time('GetEsoInputValues');
	
	g_EsoBuildLastInputHistory = {};
	g_EsoBuildLastInputHistory.SkillCost = {};
	g_EsoBuildLastInputHistory.Item = {};
	g_EsoBuildLastInputHistory.Skill = {};
	g_EsoBuildLastInputHistory.Skill2 = {};
	g_EsoBuildLastInputHistory.Food = {};
	g_EsoBuildLastInputHistory.Set = {};
	g_EsoBuildLastInputHistory.CP = {};
	g_EsoBuildLastInputHistory.Buff = {};
	g_EsoBuildLastInputHistory.Vampire = {};
	
	ResetEsoBuffSkillEnabled();
	ResetEsoAllSkillRawOutputs();
	
	var inputValues = {};
	if (mergeComputedStats == null) mergeComputedStats = false;
	
	g_EsoInputStatSources = {};
	
	InitializeEsoBuildInputValues(inputValues);
	
	if ($("#esotbUsePtsRules").prop("checked")) inputValues.UsePtsRules = true;
	
	inputValues.AutoPurchaseRacialPassives = false;
	if ($("#esotbEnableRaceAutoPurchase").prop("checked")) inputValues.AutoPurchaseRacialPassives = true;
			
	inputValues.Race = $("#esotbRace").val();
	inputValues.Class = $("#esotbClass").val();
	
	if (inputValues.Race  == "Khajiit" || inputValues.Race == "Wood Elf")
		FixupEsoRacialSkills(inputValues.Race , [36022, 45295, 45296]);
	else if (inputValues.Race  == "Breton" || inputValues.Race == "High Elf")
		FixupEsoRacialSkills(inputValues.Race , [35995, 45259, 45260]);
	else if (inputValues.Race  == "Orc" || inputValues.Race == "Nord")
		FixupEsoRacialSkills(inputValues.Race , [36064, 45297, 45298]);	
	
	inputValues.Level = parseInt($("#esotbLevel").val());
	if (inputValues.Level > ESO_MAX_LEVEL) inputValues.Level = ESO_MAX_LEVEL;

	inputValues.Attribute.Health = parseInt($("#esotbAttrHea").val());
	inputValues.Attribute.Magicka = parseInt($("#esotbAttrMag").val());
	inputValues.Attribute.Stamina = parseInt($("#esotbAttrSta").val());
	if (isNaN(inputValues.Attribute.Health))  inputValues.Attribute.Health = 0;
	if (isNaN(inputValues.Attribute.Magicka)) inputValues.Attribute.Magicka = 0;
	if (isNaN(inputValues.Attribute.Stamina)) inputValues.Attribute.Stamina = 0;
	inputValues.Attribute.TotalPoints = inputValues.Attribute.Health + inputValues.Attribute.Magicka + inputValues.Attribute.Stamina;
	
	inputValues.Stealthed = 0;
	inputValues.NormalSneakSpeed = 0;
	inputValues.MountSpeedBonus = parseInt($("#esotbMountSpeedBonus").val()) / 100;
	inputValues.BaseWalkSpeed = parseFloat($("#esotbBaseWalkSpeed").val()); // 3.0m/s estimated
	inputValues.BuildDescription = $("#esotbBuildDescription").val();
	
	if ($("#esotbStealth").prop("checked"))
	{
		inputValues.Stealthed = 1;
		AddEsoInputStatSource("Stealthed", { source: "Character State", value: inputValues.Stealthed });
	}
	
	inputValues.Cyrodiil = 0;
	
	if ($("#esotbCyrodiil").prop("checked"))
	{
		inputValues.Cyrodiil = 1;
		AddEsoInputStatSource("Cyrodiil", { source: "Character State", value: inputValues.Cyrodiil });
	}
	
	if (inputValues.Cyrodiil > 0)
	{
		g_EsoBuildBuffData['Battle Spirit'].visible = true;
		g_EsoBuildBuffData['Battle Spirit'].enabled = true;
		g_EsoBuildBuffData['Battle Spirit'].skillEnabled = true;
		
		g_EsoBuildBuffData['Offensive Scroll Bonus'].visible = true;
		g_EsoBuildBuffData['Defensive Scroll Bonus'].visible = true;
		
		g_EsoBuildBuffData['Enemy Keep Bonus 1'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 2'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 3'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 4'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 5'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 6'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 7'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 8'].visible = true;
		g_EsoBuildBuffData['Enemy Keep Bonus 9'].visible = true;
		
		// g_EsoBuildBuffData['Lycanthropy'].skillAbilities.push(g_SkillsData[42358]);
		AddEsoItemRawOutputString(g_EsoBuildBuffData['Battle Spirit'], "Active Skill", "Character State");
	}
	else
	{
		g_EsoBuildBuffData['Battle Spirit'].visible = false;
		g_EsoBuildBuffData['Battle Spirit'].enabled = false;
		g_EsoBuildBuffData['Battle Spirit'].skillEnabled = false;
		
		g_EsoBuildBuffData['Offensive Scroll Bonus'].visible = false;
		g_EsoBuildBuffData['Defensive Scroll Bonus'].visible = false;
		
		g_EsoBuildBuffData['Enemy Keep Bonus 1'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 2'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 3'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 4'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 5'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 6'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 7'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 8'].visible = false;
		g_EsoBuildBuffData['Enemy Keep Bonus 9'].visible = false;
	}
	
	GetEsoInputItemValues(inputValues, "Head");
	GetEsoInputItemValues(inputValues, "Shoulders");
	GetEsoInputItemValues(inputValues, "Chest");
	GetEsoInputItemValues(inputValues, "Hands");
	GetEsoInputItemValues(inputValues, "Waist");
	GetEsoInputItemValues(inputValues, "Legs");
	GetEsoInputItemValues(inputValues, "Feet");
	GetEsoInputItemValues(inputValues, "Neck");
	GetEsoInputItemValues(inputValues, "Ring1");
	GetEsoInputItemValues(inputValues, "Ring2");
	
	GetEsoInputGeneralValues(inputValues, "Food", "Food");
	GetEsoInputGeneralValues(inputValues, "Buff", "Potion");
	
	GetEsoInputFoodValues(inputValues);
	
	inputValues.ActiveWeaponBar = g_EsoBuildActiveWeapon;
	inputValues.ActiveAbilityBar = g_EsoBuildActiveAbilityBar;
	
	PreUpdateEsoItemSpecialSets(inputValues);
	
	if (g_EsoBuildActiveWeapon == 1)
	{
		if ( ( (g_EsoBuildItemData.MainHand1.weaponType >= 1 && g_EsoBuildItemData.MainHand1.weaponType <= 3) ||
				g_EsoBuildItemData.MainHand1.weaponType == 11) && g_EsoBuildItemData.OffHand1.weaponType == 14)
		{
			inputValues.Weapon1HShield = 1;
			AddEsoInputStatSource("Weapon1HShield", { source: "Worn Weapons", value: 1 });
		}
		
		GetEsoInputItemValues(inputValues, "MainHand1");
		GetEsoInputItemValues(inputValues, "OffHand1");
		GetEsoInputItemValues(inputValues, "Poison1");
		
		GetEsoInputItemOffHandValues(inputValues, "MainHand2");
		GetEsoInputItemOffHandValues(inputValues, "OffHand2");
	}
	else
	{
		if ( ( (g_EsoBuildItemData.MainHand2.weaponType >= 1 && g_EsoBuildItemData.MainHand2.weaponType <= 3) ||
				g_EsoBuildItemData.MainHand2.weaponType == 11) && g_EsoBuildItemData.OffHand2.weaponType == 14) 
		{
			inputValues.Weapon1HShield = 1;
			AddEsoInputStatSource("Weapon1HShield", { source: "Worn Weapons", value: 1 });
		}
		
		GetEsoInputItemValues(inputValues, "MainHand2");
		GetEsoInputItemValues(inputValues, "OffHand2");
		GetEsoInputItemValues(inputValues, "Poison2");
		
		GetEsoInputItemOffHandValues(inputValues, "MainHand1");
		GetEsoInputItemOffHandValues(inputValues, "OffHand1");
	}
	
	g_EsoSkillDestructionElementPrev = g_EsoSkillDestructionElement;
	g_EsoSkillDestructionElement = "";
	g_EsoSkillDestructionOffHandElement = "";
	
	if (inputValues.WeaponFrostStaff > 0)
		g_EsoSkillDestructionElement = "frost";	
	else if (inputValues.WeaponShockStaff > 0)
		g_EsoSkillDestructionElement = "shock";
	else if (inputValues.WeaponFlameStaff > 0)
		g_EsoSkillDestructionElement = "flame";
	
	if (inputValues.WeaponOffHandFrostStaff > 0)
		g_EsoSkillDestructionOffHandElement = "frost";	
	else if (inputValues.WeaponOffHandShockStaff > 0)
		g_EsoSkillDestructionOffHandElement = "shock";
	else if (inputValues.WeaponOffHandFlameStaff > 0)
		g_EsoSkillDestructionOffHandElement = "flame";
	
	UpdateEsoBuildSlottedDestructionSkills();
	
	inputValues.ArmorTypes = 0;
	if (inputValues.ArmorLight  > 0) ++inputValues.ArmorTypes;
	if (inputValues.ArmorMedium > 0) ++inputValues.ArmorTypes;
	if (inputValues.ArmorHeavy  > 0) ++inputValues.ArmorTypes;
	AddEsoInputStatSource("ArmorTypes", { source: "Worn Armor", value: inputValues.ArmorTypes });
	
	UpdateEsoItemSets(inputValues);
	GetEsoInputSetValues(inputValues);
	
		/* Update weapon enchantments */
	if (g_EsoBuildActiveWeapon == 1)
	{
		GetEsoInputItemEnchantValues(inputValues, "MainHand1", true);
		GetEsoInputItemEnchantValues(inputValues, "OffHand1", true);
		
		GetEsoInputOtherHandItemValues(inputValues, "MainHand2");
		GetEsoInputOtherHandItemValues(inputValues, "OffHand2");
		
		UpdateEsoBuildWeaponEnchantFactor("MainHand1", inputValues);
		UpdateEsoBuildWeaponEnchantFactor("OffHand1", inputValues);
		UpdateEsoBuildWeaponTraitFactor("MainHand1", inputValues);
		UpdateEsoBuildWeaponTraitFactor("OffHand1", inputValues);
		
			/* Update offbar only the first update */
		if (!g_EsoBuildUpdatedOffBarEnchantFactor)
		{
			UpdateEsoBuildWeaponEnchantFactor("MainHand2", null);
			UpdateEsoBuildWeaponEnchantFactor("OffHand2", null);
			g_EsoBuildUpdatedOffBarEnchantFactor = true;
		}
		
		UpdateEsoBuildWeaponTraitFactor("MainHand2", inputValues, true);
		UpdateEsoBuildWeaponTraitFactor("OffHand2", inputValues, true);
	}
	else
	{
		GetEsoInputItemEnchantValues(inputValues, "MainHand2", true);
		GetEsoInputItemEnchantValues(inputValues, "OffHand2", true);
		
		GetEsoInputOtherHandItemValues(inputValues, "MainHand1");
		GetEsoInputOtherHandItemValues(inputValues, "OffHand1");
		
		UpdateEsoBuildWeaponEnchantFactor("MainHand2", inputValues);
		UpdateEsoBuildWeaponEnchantFactor("OffHand2", inputValues);
		UpdateEsoBuildWeaponTraitFactor("MainHand2", inputValues);
		UpdateEsoBuildWeaponTraitFactor("OffHand2", inputValues);
		
			/* Update offbar only the first update */
		if (!g_EsoBuildUpdatedOffBarEnchantFactor)
		{
			UpdateEsoBuildWeaponEnchantFactor("MainHand1", null);
			UpdateEsoBuildWeaponEnchantFactor("OffHand1", null);
			g_EsoBuildUpdatedOffBarEnchantFactor = true;
		}
		
		UpdateEsoBuildWeaponTraitFactor("MainHand1", inputValues, true);
		UpdateEsoBuildWeaponTraitFactor("OffHand1", inputValues, true);
	}
	
	GetEsoInputSpecialValues(inputValues);
	
	GetEsoInputMundusValues(inputValues);
	GetEsoInputCPValues(inputValues);
	GetEsoInputTargetValues(inputValues);
	
	UpdateEsoBuildToggledSkillData(inputValues);
	UpdateEsoBuildSkillInputValues(inputValues);
	GetEsoInputSkillPassives(inputValues);
	GetEsoInputSkillActiveBar(inputValues);
	GetEsoInputSkillOffBars(inputValues);
	GetEsoInputBuffValues(inputValues);
	
	GetEsoInputMiscValues(inputValues);
	
	if (mergeComputedStats === true) 
	{
		for (var name in g_EsoComputedStats)
		{
			inputValues[name] = g_EsoComputedStats[name].value;
		}
	}
	
	if (inputValues.UsePtsRules != g_EsoBuildLastInputValues.UsePtsRules) 
	{
		UpdateEsoItemLinkVersion(inputValues.UsePtsRules ? g_EsoBuildPtsVersion : "");
	}
	
	g_EsoBuildLastInputValues = inputValues;
	
	// if (console && console.time) console.timeEnd('GetEsoInputValues');
	return inputValues;
}


window.UpdateEsoCp2SpecialDescriptions = function(inputValues)
{
	
	if (g_EsoCpData[156008])
	{
		var cpData = g_EsoCpData[156008];
		
		UpdateEsoCPSkillDesc(156008, cpData.points);
		
		var toggleData = g_EsoBuildToggledCpData[cpData.name];
		if (toggleData) toggleData.desc = cpData.description;
		
		GetEsoInputCpToggleValues(inputValues, cpData, true);
	}
	
}


window.UpdateEsoItemLinkVersion = function(version)
{
	if (version == null || version == "")
	{
		$("#esotbItems").find(".eso_item_link").removeAttr("version");
	}
	else
	{
		$("#esotbItems").find(".eso_item_link").attr("version", version);
	}
	
}


window.GetEsoInputFoodValues = function (inputValues)
{
	var buffDesc = g_EsoBuildItemData['Food'].abilityDesc;
	var itemType = g_EsoBuildItemData['Food'].type;
 
	inputValues.FoodBuff = 0;
	inputValues.DrinkBuff = 0;
	
	if (g_EsoBuildItemData['Food'].enabled === false) return;
	if (buffDesc == null) return;
		
	if (buffDesc.indexOf("Max ") >= 0 || itemType == 4)
	{
		inputValues.FoodBuff = 1;
		AddEsoInputStatSource("FoodBuff", { source: "Food", value: 1 });
	}
	
	if (buffDesc.indexOf(" Recovery ") >= 0 || itemType == 12)
	{
		inputValues.DrinkBuff = 1;
		AddEsoInputStatSource("DrinkBuff", { source: "Drink", value: 1 });
	}
	
}


window.UpdateEsoInputBuffToggles = function (buffData)
{
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData == null) continue;
		if (!buffData.visible || !(buffData.enabled || buffData.skillEnabled || buffData.buffEnabled || buffData.combatEnabled)) continue;
		
		var buffIds = buffData.buffIds;
		if (buffIds == null) buffIds = [ buffData.buffIds ];
		
		for (var i in buffIds)
		{
			var buffId = buffIds[i];
			if (buffId == null) continue;
			
			var targetBuff = g_EsoBuildBuffData[buffId];
			if (targetBuff == null) continue;
			
			targetBuff.buffEnabled = true;
			targetBuff.buffAbilities.push(buffName);
			
			AddEsoItemRawOutputString(buffData, "Adds Buff", buffId);
		}
	}
}


window.GetEsoInputBuffValues = function (inputValues)
{
	UpdateEsoInputBuffToggles();
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData == null) continue;
		if (!buffData.visible || !(buffData.enabled || buffData.skillEnabled || buffData.buffEnabled || buffData.combatEnabled)) continue;
		GetEsoInputBuffValue(inputValues, buffName, buffData);
	}
}


window.CombineEsoValuesMult = function (base, value)
{
	//return +((1 + base) * (1 + value) - 1);
	return Math.ceil(((1 + base) * (1 + value))*100 - 0.01)/100 - 1;
}


window.AddEsoStatValueHistory = function(category, statId, value)
{
	if (g_EsoBuildLastInputHistory[category] == null) g_EsoBuildLastInputHistory[category] = {};
	if (g_EsoBuildLastInputHistory[category][statId] == null) g_EsoBuildLastInputHistory[category][statId] = [];
	
	g_EsoBuildLastInputHistory[category][statId].push(value);
}


window.GetEsoInputBuffValue = function (inputValues, buffName, buffData)
{
	var statId = buffData.statId;
	var statIds = buffData.statIds;
	var category = "Buff";
	var categories = buffData.categories;
	var statValue = buffData.value;
	var statValues = buffData.values;
	var combineAs = buffData.combineAs;
	var combineAses = buffData.combineAses;
	var factorValue = buffData.factorValue;
	var factorValues = buffData.factorValues;
	
	if (buffData.category != null) category = buffData.category;
	if (combineAs == null) combineAs = '';
	
	if (statIds == null) statIds = [ statId ];
	if (statValues == null) statValues = [].fill.call({ length: statIds.length }, statValue);
	if (categories == null) categories = [].fill.call({ length: statIds.length }, category);
	if (combineAses == null) combineAses = [].fill.call({ length: statIds.length }, combineAs);
	if (factorValues == null) factorValues = [].fill.call({ length: statIds.length }, factorValues);
	
	for (var i = 0; i < statIds.length; ++i)
	{
		statValue = parseFloat(statValues[i]);
		category = categories[i];
		statId = statIds[i];
		combineAs = combineAses[i];
		factorValue = factorValues[i];
		
		if (statId == "OtherEffects")
		{
			AddEsoItemRawOutputString(buffData, "OtherEffects", statValue);
			AddEsoInputStatSource("OtherEffects", { other: true, buff: buffData, buffName: buffName, value: statValue, factorValue: factorValue });
		}
		else
		{
			if (inputValues[category][statId] == null) inputValues[category][statId] = 0;
			
			if (factorValue != null && factorValue != 1) statValue *= factorValue;
			
			if (combineAs == "*%")
				inputValues[category][statId] = CombineEsoValuesMult(inputValues[category][statId], statValue);
			else
				inputValues[category][statId] += statValue;
			
			AddEsoStatValueHistory(category, statId, statValue);
			AddEsoItemRawOutput(buffData, category + "." + statId, statValue);
			AddEsoInputStatSource(category + "." + statId, { buff: buffData, buffName: buffName, value: statValue });
		}
	}
	
}


window.GetEsoVampireStageStats = function (stage, inputValues)
{
	var result = {};
	
	if (stage == 1)
	{
		result.healthRegenValue = -0.10
		result.flameDamageValue = 0.05;
		result.costReduction = -0.06;
		result.allCostIncrease = 0.03;
		
		if (inputValues.Set.VampireLord == 1) {
			result.flameDamageValue += 0.01;
			result.costReduction += -0.05;
			result.allCostIncrease += 0.01;
		}
	}
	else if (stage == 2)
	{
		result.healthRegenValue = -0.30;
		result.flameDamageValue = 0.08;
		result.costReduction = -0.10;
		result.allCostIncrease = 0.05;
		
		if (inputValues.Set.VampireLord == 1) {
			result.flameDamageValue += 0.02;
			result.costReduction += -0.10;
			result.allCostIncrease += 0.02;
		}
	}
	else if (stage == 3)
	{
		result.healthRegenValue = -0.60;
		result.flameDamageValue = 0.13;
		result.costReduction = -0.16;
		result.allCostIncrease = 0.08;
		
		if (inputValues.Set.VampireLord == 1) {
			result.flameDamageValue += 0.04;
			result.costReduction += -0.15;
			result.allCostIncrease += 0.04;
		}
	}
	else if (stage == 4)
	{
		result.healthRegenValue = -1.00;
		result.flameDamageValue = 0.20;
		result.costReduction = -0.24;
		result.allCostIncrease = 0.12;
		
		if (inputValues.Set.VampireLord == 1) {
			result.flameDamageValue += 0.06;
			result.costReduction += -0.20;
			result.allCostIncrease += 0.06;
		}
	}
	else if (stage == 5)		// TODO: Verify which effects are cancelled
	{
		// result.healthRegenValue = -1.00;
		// result.flameDamageValue = 0.20;
		result.costReduction = -0.24;
		// result.allCostIncrease = 0.12;
		
		if (inputValues.Set.VampireLord == 1) {
			// result.flameDamageValue += 0.06;
			result.costReduction += -0.20;
			// result.allCostIncrease += 0.06;
		}
	}
	
	return result;
}


window.GetEsoVampireStageStatsOld = function (stage, inputValues)
{
	var result = {};
	
	if (stage == 1)
	{
		result.healthRegenValue = 0;
		result.flameDamageValue = 0;
		result.costReduction = 0;
	}
	else if (stage == 2)
	{
		result.healthRegenValue = -0.25;
		result.flameDamageValue = 0.15;
		result.costReduction = -0.07;
	}
	else if (stage == 3)
	{
		result.healthRegenValue = -0.50;
		result.flameDamageValue = 0.20;
		result.costReduction = -0.14;
	}
	else if (stage == 4)
	{
		result.healthRegenValue = -0.75;
		result.flameDamageValue = 0.25;
		result.costReduction = -0.21;
	}
	
	return result;
}


window.GetEsoInputSpecialValues = function (inputValues)
{
	inputValues.VampireStage = parseInt($("#esotbVampireStage").val());
	if (inputValues.Skill.VampireStage > inputValues.VampireStage) inputValues.VampireStage = inputValues.Skill.VampireStage;
	
	if (inputValues.VampireStage > 0)
	{
		var stats = {};
		
		stats = GetEsoVampireStageStats(inputValues.VampireStage, inputValues);
		
		if (stats.healthRegenValue)
		{
			inputValues.Vampire.HealthRegen += stats.healthRegenValue;
			AddEsoStatValueHistory("Vampire", "HealthRegen", stats.healthRegenValue);
			AddEsoInputStatSource("Vampire.HealthRegen", { source: "Vampire Stage " + inputValues.VampireStage, value: stats.healthRegenValue });
		}
		
		if (stats.flameDamageValue)
		{
			inputValues.Buff.FlameVulnerability += stats.flameDamageValue;
			AddEsoStatValueHistory("Vampire", "FlameVulnerability", stats.flameDamageValue);
			AddEsoInputStatSource("Buff.FlameVulnerability", { source: "Vampire Stage " + inputValues.VampireStage, value: stats.flameDamageValue });
		}
		
		if (stats.costReduction)
		{
			inputValues.SkillCost.Vampire_Cost += stats.costReduction;
			AddEsoStatValueHistory("SkillCost", "Vampire_Cost", stats.costReduction);
			AddEsoInputStatSource("SkillCost.Vampire_Cost", { source: "Vampire Stage " + inputValues.VampireStage, value: stats.costReduction });
		}
		
		if (stats.allCostIncrease)
		{
			inputValues.SkillCost.Regular_Ability_Cost += stats.allCostIncrease;
			AddEsoStatValueHistory("Vampire", "Regular_Ability_Cost", stats.allCostIncrease);
			AddEsoInputStatSource("SkillCost.Regular_Ability_Cost", { source: "Vampire Stage " + inputValues.VampireStage, value: stats.allCostIncrease });
		}
	}
	
	inputValues.WerewolfStage = parseInt($("#esotbWerewolfStage").val());
	
	if (inputValues.WerewolfStage >= 2)
	{
		g_EsoBuildBuffData['Lycanthropy'].visible = true;
		g_EsoBuildBuffData['Lycanthropy'].enabled = true;
		g_EsoBuildBuffData['Lycanthropy'].skillEnabled = true;
		
		g_EsoBuildBuffData['Lycanthropy'].skillAbilities.push(g_SkillsData[42358]);
		AddEsoItemRawOutputString(g_EsoBuildBuffData['Lycanthropy'], "Active Skill", "Werewolf Transformation");
	}
	else
	{
		g_EsoBuildBuffData['Lycanthropy'].visible = false;
		g_EsoBuildBuffData['Lycanthropy'].enabled = false;
		g_EsoBuildBuffData['Lycanthropy'].skillEnabled = false;
	}
	
}


window.GetEsoInputSetValues = function (inputValues)
{
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		GetEsoInputSetDataValues(inputValues, setData);
	}
	
}


window.GetEsoInputSetDataValues = function (inputValues, setData)
{
	if (setData == null || (setData.count <= 0 && setData.otherCount <= 0)) return;
	setData.rawOutput = [];
	setData.isDescValid = [ false, false, false, false, false ];
	setData.isOffhandDescValid = [ false, false, false, false, false ];
	
	for (var i = 0; i < 12; ++i)
	{
		var setBonusCount = 15;
		
		if (setData.items[0] != null)
			setBonusCount = parseInt(setData.items[0]['setBonusCount' + (i+1)]);
		else if (setData.unequippedItems[0])
			setBonusCount = parseInt(setData.unequippedItems[0]['setBonusCount' + (i+1)]);
		
		if (setBonusCount <= 0) continue;
		if (setBonusCount > setData.count && setBonusCount > setData.otherCount) continue;
		
		var onlyEnableToggles = false;
		
		if (setBonusCount > setData.count)
		{
			onlyEnableToggles = true;
			setData.isOffhandDescValid[i] = true;
		}
		else 
		{
			setData.isDescValid[i] = true;
		}
		
		var setDesc = setData.averageDesc[i];
		
		if (setDesc == null)
		{
			if (setData.unequippedItems[0])
			{
				setDesc = RemoveEsoDescriptionFormats(setData.unequippedItems[0]['setBonusDesc' + (i+1)]);
			}
			
			if (setDesc == null || setDesc == "") continue;
		}
		
		GetEsoInputSetDescValues(inputValues, setDesc, setBonusCount, setData, onlyEnableToggles);
	}
	
}


window.GetEsoInputSetDescValues = function (inputValues, setDesc, setBonusCount, setData, onlyEnableToggles)
{
	var foundMatch = false;
	var addFinalEffect = false;
	var rawInputDesc = setDesc;
	
	if (setBonusCount < 0 || setDesc == "") return;
	
	for (var i = 0; i < ESO_SETEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_SETEFFECT_MATCHES[i];
		var matches = setDesc.match(matchData.match);
		
		if (matches == null) continue;
		
		if (matchData.ignore === true) 
		{
			foundMatch = true;
			continue;
		}
		
			/* Ignore toggled effects that aren't on */
		if (matchData.toggle === true)
		{
			if (!IsEsoBuildToggledSetEnabled(matchData.id)) continue;
			if (setBonusCount > setData.count && matchData.enableOffBar === false) continue;
		}
		else if (onlyEnableToggles)
		{
			continue;
		}
		
		if (matchData.statRequireId != null)
		{
			var requiredStat = inputValues[matchData.statRequireId];
			if (requiredStat == null) continue;
			if (parseFloat(requiredStat) < parseFloat(matchData.statRequireValue)) continue;
		}
		
		if (matchData.requireSkillLine != null)
		{
			var count = CountEsoBarSkillsWithSkillLine(matchData.requireSkillLine);
			if (count == 0) continue;
		}
		
		if (matchData.requireSkillType != null)
		{
			var count = CountEsoBarSkillsWithSkillType(matchData.requireSkillType);
			if (count == 0) continue;
		}
		
		foundMatch = true;
		
		if (matchData.damageType)
		{
			var setId = matchData.id;
			if (matchData.setId) setId = matchData.setId;
			var procSetId = setId.toLowerCase();
			var procData = ESO_SETPROCDAMAGE_DATA[procSetId];
			
			if (procData)
			{
				procData.damageType = matchData.damageType;
				AddEsoItemRawOutputString(setData, "Using Damage Type", matchData.damageType);
			}
		}
		
		if (matchData.buffId != null)
		{
			var buffData = g_EsoBuildBuffData[matchData.buffId];
			if (buffData == null) continue;
			
			buffData.skillEnabled = true;
			buffData.skillAbilities.push(setData);
			AddEsoItemRawOutputString(setData, "Adds Buff", matchData.buffId);
			AddEsoItemRawOutputString(buffData, "Set Effect", setData.name + " set");
			
			if (matchData.updateBuffValue === true && matches[1] != null)
			{
				var factorValue = 1;
				
				if (matchData.display == "%") factorValue *= 0.01;
				if (matchData.factorValue) factorValue *= matchData.factorValue;
				
				if (matchData.maxTimes != null)
				{
					var toggleData = g_EsoBuildToggledSetData[matchData.id];
					if (toggleData != null && toggleData.count != null) factorValue *= toggleData.count;
				}
				
				if (buffData.value != null) buffData.value = parseFloat(matches[1]) * factorValue;
				
				if (buffData.values) {
					for (var j = 0; j < buffData.values.length; j++) 
					{
						buffData.values[j] = parseFloat(matches[1]) * factorValue;
					}
				}
				
				buffData.visible = true;
				buffData.forceUpdate = true;
			}
			
			continue;
		}
		
		if (matchData.statId == "OtherEffects")
		{
			if (matchData.rawInputMatch != null)
			{
				var rawInputMatches = setDesc.match(matchData.rawInputMatch);
				if (rawInputMatches != null) rawInputDesc = rawInputMatches[1];
				if (rawInputDesc == null) rawInputDesc = setDesc;
			}
			
			addFinalEffect = true;
			continue;
		}
		
		var statFactor = 1;
		var statValue = 1;
		var newStatValue = parseFloat(matches[1]);
		
		if (matchData.statValue !== undefined) statValue = matchData.statValue;
		if (!isNaN(newStatValue)) statValue = newStatValue;
		if (isNaN(statValue)) statValue = 1;
		
		if (matchData.factorStatId != null)
		{
			var factorStat = inputValues[matchData.factorStatId];
			
			if (factorStat == null)
				statFactor = 0;
			else
				statFactor = parseFloat(factorStat);
		}
		
		if (matchData.maxTimes != null)
		{
			var toggleData = g_EsoBuildToggledSetData[matchData.id];
			
			if (toggleData != null && toggleData.count != null)
			{
				if (statFactor == 0)
					statFactor = toggleData.count;
				else
					statFactor *= toggleData.count;
				
				if (matchData.enableBuffAtMax && toggleData.count >= matchData.maxTimes)
				{
					var buffData = g_EsoBuildBuffData[matchData.enableBuffAtMax];
					
					if (buffData)
					{
						buffData.skillEnabled = true;
						buffData.skillAbilities.push(setData);
						AddEsoItemRawOutputString(setData, "Adds Buff", matchData.enableBuffAtMax);
						AddEsoItemRawOutputString(buffData, "Set Effect", setData.name + " set");
					}
				}
			}
		}
		
		if (matchData.factorOffset != null)
		{
			statFactor = statFactor + matchData.factorOffset;
		}
		
		if (matchData.factorValue != null)
		{
			statFactor = statFactor * matchData.factorValue;
		}
		
		if (statFactor == 0) continue;
		statValue = statValue * statFactor;
		
		if (matchData.round == "floor") statValue = Math.floor(statValue);
		if (matchData.display == "%") statValue = statValue/100;
		
		var category = matchData.category || "Set";
		
		if (inputValues[category][matchData.statId] == null) inputValues[category][matchData.statId] = 0;
		
		if (matchData.combineAs == "*%")
			inputValues[category][matchData.statId] = CombineEsoValuesMult(inputValues[category][matchData.statId], statValue);
		else
			inputValues[category][matchData.statId] += statValue;
		
		if (matchData.statId)
		{
			AddEsoStatValueHistory(category, matchData.statId, statValue);
			AddEsoItemRawOutput(setData, category + "." + matchData.statId, statValue);
			AddEsoInputStatSource(category + "." + matchData.statId, { set: setData, setBonusCount: setBonusCount, value: statValue });
		}
	}
	
	if ((!foundMatch && !onlyEnableToggles) || addFinalEffect)
	{
		AddEsoInputStatSource("OtherEffects", { other: true, set: setData, setBonusCount: setBonusCount, value: setDesc });
		AddEsoItemRawOutputString(setData, "OtherEffects", rawInputDesc);
	}
	
}


window.UpdateEsoBuildSetOtherEffectDesc = function ()
{
	g_EsoCurrentTooltipSlot = "";
	
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		
		for (var name in setData.rawOutput)
		{
			if (name == "OtherEffects")
			{
				setData.rawOutput[name] = UpdateEsoBuildSetAll(setName, setData.rawOutput[name]);
			}
		}
	}
	
	for (var i in g_EsoInputStatSources.OtherEffects)
	{
		var data = g_EsoInputStatSources.OtherEffects[i];
		
		if (data.set != null)
		{
			data.value = UpdateEsoBuildSetAll(data.set.name, data.value);
		}
	}
}


window.GetEsoEnchantData = function (slotId)
{
	var itemData = null;
	var enchantData = g_EsoBuildEnchantData[slotId];
	
	if (enchantData == null) return null;
		
	if ($.isEmptyObject(enchantData) || enchantData.isDefaultEnchant === true)
	{
		itemData = g_EsoBuildItemData[slotId];
		enchantData.isDefaultEnchant = true;
		
		if (itemData == null) return null;
		
		enchantData.itemId = itemData.itemId;
		enchantData.internalLevel = itemData.internalLevel;
		enchantData.internalSubtype = itemData.internalSubtype;
		enchantData.enchantId = itemData.enchantId;
		enchantData.enchantLevel = itemData.enchantLevel;
		enchantData.enchantSubtype = itemData.enchantSubtype;
		enchantData.enchantName = itemData.enchantName;
		enchantData.name = enchantData.enchantName;
		enchantData.enchantDesc = itemData.enchantDesc; 
	}
	else
	{
		itemData = g_EsoBuildEnchantData[slotId];
		enchantData.isDefaultEnchant = false;
	}
	
	enchantData.newEnchantDesc = "";
	
	return enchantData;
}


window.GetEsoInputGeneralValues = function (inputValues, outputId, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	itemData.rawOutput = {};
	
	if (itemData.enabled === false) return false;
	
	GetEsoInputAbilityDescValues(inputValues, outputId, itemData, slotId);
}


window.GetEsoInputAbilityDescValues = function (inputValues, outputId, itemData, slotId)
{
	if (itemData.enabled === false) return;
	
	var rawDesc = RemoveEsoDescriptionFormats(itemData.abilityDesc);
	if (rawDesc == "") return;
		
	for (var i = 0; i < ESO_ABILITYDESC_MATCHES.length; ++i)
	{
		var matchData = ESO_ABILITYDESC_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var statValue = Math.floor(parseFloat(matches[1]));
		
		if (inputValues[outputId][matchData.statId] == null) inputValues[outputId][matchData.statId] = 0;
		
		if (matchData.combineAs == "*%")
			inputValues[outputId][matchData.statId] = CombineEsoValuesMult(inputValues[outputId][matchData.statId], statValue);
		else
			inputValues[outputId][matchData.statId] += statValue;
		
		AddEsoStatValueHistory(outputId, matchData.statId, statValue);
		AddEsoItemRawOutput(itemData, outputId + "." + matchData.statId, statValue);
		AddEsoInputStatSource(outputId + "." + matchData.statId, { item: itemData, value: statValue, slotId: slotId });
	}
}


window.GetEsoInputSkillPassives = function (inputValues)
{
	var skillInputValues = GetEsoTestBuildSkillInputValues();
	
	for (var skillId in g_EsoSkillPassiveData)
	{
		GetEsoInputSkillPassiveValues(inputValues, skillInputValues, g_EsoSkillPassiveData[skillId]);
	}
	
}


window.GetEsoInputSkillActiveBar = function (inputValues)
{
	var skillInputValues = GetEsoTestBuildSkillInputValues();
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillData = skillBar[i];
		if (skillData.origSkillId == null) continue;
		
		var activeData = g_EsoSkillActiveData[skillData.origSkillId];
		if (activeData == null) continue;
		
		GetEsoInputSkillActiveValues(inputValues, skillInputValues, activeData);
	}
	
}


window.GetEsoInputSkillOffBars = function (inputValues)
{
	var skillInputValues = GetEsoTestBuildSkillInputValues();
	
	for (var j = 0; j < g_EsoSkillBarData.length; ++j)
	{
		if (j == g_EsoBuildActiveAbilityBar - 1) continue;
		
		var skillBar = g_EsoSkillBarData[j];
		if (skillBar == null) continue;
		
		for (var i = 0; i < skillBar.length; ++i)
		{
			var skillData = skillBar[i];
			if (skillData.origSkillId == null) continue;
			
			var activeData = g_EsoSkillActiveData[skillData.origSkillId];
			if (activeData == null) continue;
			
			GetEsoInputSkillActiveValues(inputValues, skillInputValues, activeData, true);
		}
	}
}


window.ComputeEsoInputSkillValue = function (matchData, inputValues, rawDesc, abilityData, isPassive, testMatch, isOffBar)
{
	var statValue = 0;
	var statFactor = 1;
	var matches = null;
	
	rawDesc = rawDesc.replaceAll("  ", " ");
	rawDesc = rawDesc.replaceAll("  ", " ");
	
	if (matchData.statValue !== undefined) statValue = matchData.statValue;
	
	if (matchData.match != null) 
	{
		matches = rawDesc.match(matchData.match);
		if (matches == null) return false;
		
		var newStatValue = parseFloat(matches[1]);
		
		if (isNaN(newStatValue) && matchData.statValue === undefined) 
			statValue = 1;
		else if (!isNaN(newStatValue))
			statValue = newStatValue;
	}
	
	if (matchData.skillName != null)
	{
		if (abilityData.name.toUpperCase() != matchData.skillName.toUpperCase()) return false;
	}
	
	if (matchData.skillRank != null)
	{
		if (abilityData.rank != matchData.skillRank) return false;
	}
	
	if (matchData.ignoreSkills != null)
	{
		if (matchData.ignoreSkills[abilityData.name] != null) return false;
		if (matchData.ignoreSkills[abilityData.id] != null) return false;
	}
			
	if (matchData.toggle === true && matchData.id != null)
	{
		if (!IsEsoBuildToggledSkillEnabled(matchData.id)) return false;
		if (IsEsoBuildToggledSkillUsed(matchData.id)) return false;
		
		g_EsoToggleSkillUsedBuffer[matchData.id] = true;
	}
	else if (isOffBar)
	{
		return false;
	}
	
	if (matchData.requireSkillLine != null)
	{
		var count = CountEsoBarSkillsWithSkillLine(matchData.requireSkillLine);
		if (count == 0) return false;
	}
	
	if (matchData.requireSkillType != null)
	{
		var count = CountEsoBarSkillsWithSkillType(matchData.requireSkillType);
		if (count == 0) return false;
	}
	
	if (matchData.statRequireId != null)
	{
		var requiredStat = inputValues[matchData.statRequireId];
		if (requiredStat == null) return false;
		if (parseFloat(requiredStat) < parseFloat(matchData.statRequireValue)) return false;
	}
	
	if (matchData.factorSkillLine != null)
	{
		var count = CountEsoBarSkillsWithSkillLine(matchData.factorSkillLine);
		statFactor = count;
	}
	else if (matchData.factorSkillType != null)
	{
		var count = CountEsoBarSkillsWithSkillType(matchData.factorSkillType);
		statFactor = count;
	}
	else if (matchData.factorStatId != null)
	{
		var factorStat = inputValues[matchData.factorStatId];
		
		if (factorStat == null)
			statFactor = 0;
		else
			statFactor = parseFloat(factorStat);
		
		if (statFactor == 0) return false;
	}
	else if (matchData.maxTimes != null)
	{
		var toggleData = g_EsoBuildToggledSkillData[matchData.id];
		if (toggleData != null && toggleData.count != null) statFactor = toggleData.count;
	}
	
	if (matchData.factorValue != null)
	{
		statFactor = statFactor * matchData.factorValue;
	}
	
	if (matchData.baseValue != null) 
		statValue = statValue * matchData.baseValue + statValue * statFactor;
	else
		statValue = statValue * statFactor;	
	
	if (matchData.display == '%') statValue = statValue / 100;
	if (matchData.round == 'floor') statValue = Math.floor(statValue);
	
	var category = "Skill";
	if (matchData.category != null) category = matchData.category;
	
	if (matchData.buffId != null)
	{
		var buffData = g_EsoBuildBuffData[matchData.buffId];
		if (buffData == null) return false;
		
		if (!testMatch)
		{
			buffData.skillEnabled = true;
			buffData.skillAbilities.push(abilityData);
			AddEsoItemRawOutputString(buffData, (isPassive ? "Passive Skill" : "Active Skill"), abilityData.name);
		}
		
		AddEsoItemRawOutputString(abilityData, "Adds Buff", matchData.buffId);
	}
	else if (matchData.statId == "OtherEffects")
	{
		var rawInputDesc = rawDesc;
		
		if (matchData.rawInputMatch != null)
		{
			var rawInputMatches = rawDesc.match(matchData.rawInputMatch);
			if (rawInputMatches != null) rawInputDesc = rawInputMatches[1];
			if (rawInputDesc == null) rawInputDesc = rawDesc;
		}
		
		AddEsoItemRawOutputData(abilityData, "PassiveEffect", { abilityData: abilityData, rawInputMatch: matchData.rawInputMatch, value: rawInputDesc });
		
		if (!testMatch)
		{
			if (isPassive)
				AddEsoInputStatSource("OtherEffects", { other: true, passive: abilityData, value: rawInputDesc, rawInputMatch: matchData.rawInputMatch });
			else
				AddEsoInputStatSource("OtherEffects", { other: true, active: abilityData, value: rawInputDesc, rawInputMatch: matchData.rawInputMatch });
		}
	}
	else 
	{
		if (inputValues[category][matchData.statId] == null) inputValues[category][matchData.statId] = 0;
		
		if (matchData.combineAs == "*%")
			inputValues[category][matchData.statId] = CombineEsoValuesMult(inputValues[category][matchData.statId], statValue);
		else
			inputValues[category][matchData.statId] += statValue;
		
		AddEsoStatValueHistory(category, matchData.statId, statValue);
		AddEsoItemRawOutput(abilityData, category + "." + matchData.statId, statValue);
		
		if (!testMatch)
		{
			if (isPassive)
				AddEsoInputStatSource(category + "." + matchData.statId, { passive: abilityData, value: statValue, rawInputMatch: matchData.rawInputMatch });
			else
				AddEsoInputStatSource(category + "." + matchData.statId, { active: abilityData, value: statValue, rawInputMatch: matchData.rawInputMatch });
		}
	}
	
	return true;
}


window.ResetEsoBuffSkillEnabled = function ()
{
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData.visible == null) buffData.visible = true;
		if (buffData.toggleVisible === true) buffData.visible = false;
		buffData.buffEnabled = false;
		buffData.skillEnabled = false;
		buffData.combatEnable = 0;
		buffData.rawOutput = {};
		buffData.skillAbilities = [];
		buffData.buffAbilities = [];
	}
}


window.UpdateEsoBuffSkillEnabled = function ()
{
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		var parentId = buffName.replace(/\W/g, "_");
		var parent = $("#esotbBuff_" + parentId);
		var element = parent.find(".esotbBuffSkillEnable");
		
		if (buffData.skillEnabled)
		{
			var abilityData = buffData.skillAbilities[0];
			var abilityDesc = "";
			
			if (abilityData != null)
			{
				abilityDesc = abilityData.name;
				
				if (buffData.skillAbilities.length == 2) 
					abilityDesc += " and 1 other";
				else if (buffData.skillAbilities.length > 2)
					abilityDesc += " and " + (buffData.skillAbilities.length - 1) + " others";
				else if (abilityData.averageDesc != null)
					abilityDesc += " set";
			}
			else if (buffData.rawOutput != null && buffData.rawOutput["Active Skill"] != null)
			{
				abilityDesc = buffData.rawOutput["Active Skill"];
			}
			
			parent.addClass("esotbBuffDisable");
			parent.removeClass("esotbBuffItemSelect");
			
			element.text(" (Enabled by " + abilityDesc + ")");
		}
		else if (buffData.enabled)
		{
			parent.addClass("esotbBuffItemSelect");
			parent.removeClass("esotbBuffDisable");
		}
		else
		{
			parent.removeClass("esotbBuffItemSelect");
			parent.removeClass("esotbBuffDisable");
			element.text("");
		}
	}
	
}


window.UpdateEsoBuffBuffEnabled = function ()
{
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		var parentId = buffName.replace(/\W/g, "_");
		var parent = $("#esotbBuff_" + parentId);
		var element = parent.find(".esotbBuffSkillEnable");
		
		if (buffData.buffEnabled)
		{
			var buffName = buffData.buffAbilities[0];
			var buffDesc = "";
			
			if (buffName != null)
			{
				buffDesc = buffName;
				
				if (buffData.buffAbilities.length == 2) 
					buffDesc += " and 1 other";
				else if (buffData.buffAbilities.length > 2)
					buffDesc += " and " + (buffData.buffAbilities.length - 1) + " others";
			}
			else if (buffData.rawOutput != null && buffData.rawOutput["Buff"] != null)
			{
				buffDesc = buffData.rawOutput["Buff"];
			}
			
			parent.addClass("esotbBuffDisable");
			parent.removeClass("esotbBuffItemSelect");
			element.text(" (Enabled by " + buffDesc + ")");
		}
		else if (buffData.enabled)
		{
			// parent.addClass("esotbBuffItemSelect");
			// parent.removeClass("esotbBuffDisable");
		}
		else
		{
			// parent.removeClass("esotbBuffItemSelect");
			// parent.removeClass("esotbBuffDisable");
			// element.text("");
		}
	}
	
}


window.GetEsoInputSkillPassiveValues = function (inputValues, skillInputValues, skillData)
{
	var abilityData = g_SkillsData[skillData.abilityId];
	var skillDesc = GetEsoSkillDescription(skillData.abilityId, skillInputValues, false, true);
	var rawDesc = RemoveEsoDescriptionFormats(skillDesc);
	if (rawDesc == "" || abilityData == null) return;
	
	abilityData.rawOutput = {};
	
	for (var i = 0; i < ESO_PASSIVEEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_PASSIVEEFFECT_MATCHES[i];
		ComputeEsoInputSkillValue(matchData, inputValues, rawDesc, abilityData, true);
	}
	
}


window.g_EsoToggleSkillUsedBuffer = {};


window.GetEsoInputSkillActiveValues = function (inputValues, skillInputValues, skillData, isOffBar)
{
	var abilityData = g_SkillsData[skillData.abilityId];
	var skillDesc = GetEsoSkillDescription(skillData.abilityId, skillInputValues, false, true);
	var rawDesc = RemoveEsoDescriptionFormats(skillDesc);
	if (rawDesc == "" || abilityData == null) return;
	
	// abilityData.rawOutput = {};
	g_EsoToggleSkillUsedBuffer = {};
	
	for (var i = 0; i < ESO_ACTIVEEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_ACTIVEEFFECT_MATCHES[i];
		ComputeEsoInputSkillValue(matchData, inputValues, rawDesc, abilityData, false, false, isOffBar);
	}
	
	for (var id in g_EsoToggleSkillUsedBuffer)
	{
		SetEsoBuildToggledSkillUsed(id, true);
	}
	
}


window.ResetEsoAllSkillRawOutputs = function ()
{
	
	for (var skillId in g_SkillsData)
	{
		g_SkillsData[skillId].rawOutput = {};
	}

}


window.AddEsoItemRawOutput = function (itemData, statId, value)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	if (itemData.rawOutput[statId] == null)	itemData.rawOutput[statId] = "";
	itemData.rawOutput[statId] = +itemData.rawOutput[statId] + +value;
}


window.AddEsoItemRawOutputString = function (itemData, statId, value, overwrite)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	
	if (itemData.rawOutput[statId] == null || overwrite)
		itemData.rawOutput[statId] = value;
	else
		itemData.rawOutput[statId] += ", " + value;
}


window.AddEsoItemRawOutputData = function (itemData, statId, data)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	itemData.rawOutput[statId] = data;
}


window.GetEsoInputOtherHandItemValues = function (inputValues, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.enabled === false) return false;
	
	itemData.rawOutput = {};
	
	var enchantData = GetEsoEnchantData(slotId);
	if (enchantData == null) return false;
	if (enchantData.enchantDesc == "") return true;
	
	var enchantFactor = 1;
	var transmuteFactor = 1;
	
	var weaponTraitFactor = 1;
	if (inputValues.OffHandWeaponTraitEffect > 0) weaponTraitFactor += inputValues.OffHandWeaponTraitEffect;
	
		// Infused
	if (itemData.trait == 16 || itemData.trait == 4 || itemData.trait == 33)
	{
		var rawDesc = RemoveEsoDescriptionFormats(itemData.traitDesc);
		var results = rawDesc.match(/([0-9]+\.?[0-9]*\%?)/g);
		
		if (results != null && results.length !== 0) 
		{
			if (itemData.trait != 4) weaponTraitFactor = 1;
			var infusedFactor = 1 + parseFloat(results[0])/100 * weaponTraitFactor;
			if (isNaN(infusedFactor) || infusedFactor < 1) infusedFactor = 1;
			enchantFactor = enchantFactor * infusedFactor;
		}
	}
	
	if (IsEsoItemWeapon(itemData))
	{
		GetEsoInputItemEnchantOtherHandWeaponValues(inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor);
	}

	return true;
}


window.GetEsoInputItemOffHandValues = function (inputValues, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.enabled === false) return false;
	
	itemData.rawOutput = {};
	
	switch (parseInt(itemData.weaponType))
	{
	case 1:
		++inputValues.WeaponOffHandAxe;
		++inputValues.WeaponOffHand1H;
		break;
	case 2:
		++inputValues.WeaponOffHandMace;
		++inputValues.WeaponOffHand1H;
		break;
	case 3:
		++inputValues.WeaponOffHandSword;
		++inputValues.WeaponOffHand1H;
		break;
	case 4:
		++inputValues.WeaponOffHandSword;
		++inputValues.WeaponOffHand2H;
		break;
	case 5:
		++inputValues.WeaponOffHandAxe;
		++inputValues.WeaponOffHand2H;
		break;
	case 6:
		++inputValues.WeaponOffHandMace;
		++inputValues.WeaponOffHand2H;
		break;
	case 8:
		++inputValues.WeaponOffHandBow;
		break;
	case 9:
		++inputValues.WeaponOffHandRestStaff;
		break;
	case 11:
		++inputValues.WeaponOffHandDagger;
		++inputValues.WeaponOffHand1H;
		break;
	case 12:
		++inputValues.WeaponOffHandDestStaff;
		++inputValues.WeaponOffHandFlameStaff;
		break;
	case 13:
		++inputValues.WeaponOffHandDestStaff;
		++inputValues.WeaponOffHandFrostStaff;
		break;
	case 15:
		++inputValues.WeaponOffHandDestStaff;
		++inputValues.WeaponOffHandShockStaff;
		break;
	}
	
}


window.GetEsoInputItemValues = function (inputValues, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.enabled === false) return false;
	
	itemData.rawOutput = {};
	
	var traitMatch = null;
	var traitValue = 0;
	var traitValue2 = 0;
	if (itemData.traitDesc != null) traitMatch = itemData.traitDesc.match(/[0-9]+.?[0-9]*/g);
	if (traitMatch != null && traitMatch[0] != null) traitValue = parseFloat(traitMatch[0]);
	if (traitMatch != null && traitMatch[1] != null) traitValue2 = parseFloat(traitMatch[1]);
	
	var weaponTraitFactor = 1;
	if (inputValues.WeaponTraitEffect > 0) weaponTraitFactor += inputValues.WeaponTraitEffect;
	
	if (itemData.armorType == 1)
	{
		++inputValues.ArmorLight;
		AddEsoItemRawOutput(itemData, "ArmorLight", 1);
		AddEsoInputStatSource("ArmorLight", { item: itemData, value: 1, slotId:slotId });
	}
	else if (itemData.armorType == 2)
	{
		++inputValues.ArmorMedium;
		AddEsoItemRawOutput(itemData, "ArmorMedium", 1);
		AddEsoInputStatSource("ArmorMedium", { item: itemData, value: 1, slotId:slotId });
	}
	else if (itemData.armorType == 3)
	{
		++inputValues.ArmorHeavy;
		AddEsoItemRawOutput(itemData, "ArmorHeavy", 1);
		AddEsoInputStatSource("ArmorHeavy", { item: itemData, value: 1, slotId:slotId });
	}

	switch (parseInt(itemData.weaponType))
	{
	case 1:
		++inputValues.WeaponAxe;
		AddEsoItemRawOutput(itemData, "WeaponAxe", 1);
		AddEsoInputStatSource("WeaponAxe", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon1H;
		AddEsoItemRawOutput(itemData, "Weapon1H", 1);
		AddEsoInputStatSource("Weapon1H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 2:
		++inputValues.WeaponMace;
		AddEsoItemRawOutput(itemData, "WeaponMace", 1);
		AddEsoInputStatSource("WeaponMace", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon1H;
		AddEsoItemRawOutput(itemData, "Weapon1H", 1);
		AddEsoInputStatSource("Weapon1H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 3:
		++inputValues.WeaponSword;
		AddEsoItemRawOutput(itemData, "WeaponSword", 1);
		AddEsoInputStatSource("WeaponSword", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon1H;
		AddEsoItemRawOutput(itemData, "Weapon1H", 1);
		AddEsoInputStatSource("Weapon1H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 4:
		++inputValues.WeaponSword;
		AddEsoItemRawOutput(itemData, "WeaponSword", 1);
		AddEsoInputStatSource("WeaponSword", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon2H;
		AddEsoItemRawOutput(itemData, "Weapon2H", 1);
		AddEsoInputStatSource("Weapon2H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 5:
		++inputValues.WeaponAxe;
		AddEsoItemRawOutput(itemData, "WeaponAxe", 1);
		AddEsoInputStatSource("WeaponAxe", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon2H;
		AddEsoItemRawOutput(itemData, "Weapon2H", 1);
		AddEsoInputStatSource("Weapon2H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 6:
		
		++inputValues.WeaponMace;
		AddEsoItemRawOutput(itemData, "WeaponMace", 1);
		AddEsoInputStatSource("WeaponMace", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon2H;
		AddEsoItemRawOutput(itemData, "Weapon2H", 1);
		AddEsoInputStatSource("Weapon2H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 8:
		++inputValues.WeaponBow;
		AddEsoItemRawOutput(itemData, "WeaponBow", 1);
		AddEsoInputStatSource("WeaponBow", { item: itemData, value: 1, slotId: slotId });
		break;
	case 9:
		++inputValues.WeaponRestStaff;
		AddEsoItemRawOutput(itemData, "WeaponRestStaff", 1);
		AddEsoInputStatSource("WeaponRestStaff", { item: itemData, value: 1, slotId: slotId });
		break;
	case 11:
		++inputValues.WeaponDagger;
		AddEsoItemRawOutput(itemData, "WeaponDagger", 1);
		AddEsoInputStatSource("WeaponDagger", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.Weapon1H;
		AddEsoItemRawOutput(itemData, "Weapon1H", 1);
		AddEsoInputStatSource("Weapon1H", { item: itemData, value: 1, slotId: slotId });
		break;
	case 12:
		++inputValues.WeaponDestStaff;
		AddEsoItemRawOutput(itemData, "WeaponDestStaff", 1);
		AddEsoInputStatSource("WeaponDestStaff", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.WeaponFlameStaff;
		AddEsoItemRawOutput(itemData, "WeaponFlameStaff", 1);
		AddEsoInputStatSource("WeaponFlameStaff", { item: itemData, value: 1, slotId: slotId });
		break;
	case 13:
		++inputValues.WeaponDestStaff;
		AddEsoItemRawOutput(itemData, "WeaponDestStaff", 1);
		AddEsoInputStatSource("WeaponDestStaff", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.WeaponFrostStaff;
		AddEsoItemRawOutput(itemData, "WeaponFrostStaff", 1);
		AddEsoInputStatSource("WeaponFrostStaff", { item: itemData, value: 1, slotId: slotId });
		break;
	case 15:
		++inputValues.WeaponDestStaff;
		AddEsoItemRawOutput(itemData, "WeaponDestStaff", 1);
		AddEsoInputStatSource("WeaponDestStaff", { item: itemData, value: 1, slotId: slotId });
		
		++inputValues.WeaponShockStaff;
		AddEsoItemRawOutput(itemData, "WeaponShockStaff", 1);
		AddEsoInputStatSource("WeaponShockStaff", { item: itemData, value: 1, slotId: slotId });
		break;
	}
	
	if (itemData.armorRating > 0 && (itemData.type == 2 || (itemData.type == 1 && itemData.weaponType == 14)))
	{
		var factor = 1;
		var factor2 = 1;
		var bonusResist  = 0;
		var bonusResist2 = 0;
		
				// Shield expert
		if (itemData.weaponType == 14 && g_EsoCpData['Shield Expert'] != null && g_EsoCpData['Shield Expert'].isUnlocked)
		{
			// var extraBonus = factor * 0.75;
			// factor *= 1.75;
		}
		
		var transmuteTraitMatch = null;
		var transmuteTraitValue = 0;
		if (itemData.origTraitDesc != null) transmuteTraitMatch = itemData.origTraitDesc.match(/[0-9]+.?[0-9]*/);
		if (transmuteTraitMatch != null && transmuteTraitMatch[0] != null) transmuteTraitValue = parseFloat(transmuteTraitMatch[0]);
		
			// Fix original reinforced trait for transmuted armor
		if (itemData.origTrait == 13 && itemData.transmuteTrait > 0 && itemData.transmuteTrait != 13)
		{
			factor2 /= 1 + transmuteTraitValue/100;
		}
			// Fix original nirnhoned trait for transmuted armor
		else if (itemData.origTrait == 25 && itemData.transmuteTrait > 0 && itemData.transmuteTrait != 25)
		{
			bonusResist2 = -Math.floor(transmuteTraitValue);
		}
		
			// Fix transmuted reinforced trait
		if (itemData.origTrait != 13 && itemData.transmuteTrait == 13)
		{
			factor *= 1 + traitValue/100;
		}
			// Fix transmuted nirnhoned trait
		else if (itemData.origTrait != 25 && itemData.transmuteTrait == 25)
		{
			bonusResist = Math.floor(traitValue);
		}
		
		if (itemData.trait == 13)	// Reinforced
		{
			// factor *= 1 + traitValue/100; // Now included in the raw item
			// data when mined
		}
		else if (itemData.trait == 25) // Armor Nirnhoned
		{
			// bonusResist =
			// Math.floor(itemData.armorRating*traitValue/100*factor); // Pre
			// Update 11
			// bonusResist = Math.floor(traitValue); // Update 15?: Now included
			// in the raw item data when mined
		}
		
		var armorRating = +itemData.armorRating;
		armorRating += bonusResist2;
		armorRating = Math.round(armorRating * factor2)
		armorRating = Math.floor(armorRating * factor) + bonusResist;
		
		inputValues.Item.SpellResist += armorRating;
		inputValues.Item.PhysicalResist += armorRating;
		
		AddEsoStatValueHistory("Item", "SpellResist", armorRating);
		AddEsoStatValueHistory("Item", "PhysicalResist", armorRating);
		
		AddEsoItemRawOutput(itemData, "Item.SpellResist", armorRating);
		AddEsoItemRawOutput(itemData, "Item.PhysicalResist", armorRating);
		
		AddEsoInputStatSource("Item.SpellResist", { item: itemData, value: armorRating, slotId:slotId });
		AddEsoInputStatSource("Item.PhysicalResist", { item: itemData, value: armorRating, slotId:slotId });
	}
	
	if (itemData.weaponPower > 0 && itemData.type == 1)
	{
		var weaponPower = parseFloat(itemData.weaponPower);
		
		var transmuteTraitMatch = null;
		var transmuteTraitValue = 0;
		if (itemData.origTraitDesc != null) transmuteTraitMatch = itemData.origTraitDesc.match(/[0-9]+.?[0-9]*/);
		if (transmuteTraitMatch != null && transmuteTraitMatch[0] != null) transmuteTraitValue = parseFloat(transmuteTraitMatch[0]);
		
			// Fix original nirnhoned trait for transmuted weapons
		if (itemData.origTrait == 26 && itemData.transmuteTrait > 0 && itemData.transmuteTrait != 26)
		{
			weaponPower = Math.round(weaponPower / (1 + transmuteTraitValue/100));
		}
		
			// Fix weapon power for nirnhoned weapons with a weaponTraitFactor
		if (itemData.origTrait != 26 && itemData.transmuteTrait == 26 && weaponTraitFactor > 0)
		{
			weaponPower = Math.floor(weaponPower * (1 + traitValue * weaponTraitFactor/100));
		}
		else if (itemData.origTrait == 26 && itemData.transmuteTrait == 26 && weaponTraitFactor > 0)
		{
			weaponPower = Math.floor(weaponPower / (1 + traitValue/100) * (1 + traitValue * weaponTraitFactor/100));
		}
		else if (itemData.trait == 26 && (itemData.transmuteTrait <= 0 || itemData.transmuteTrait == null) && weaponTraitFactor > 0)
		{
			weaponPower = Math.floor(weaponPower / (1 + traitValue/100) * (1 + traitValue * weaponTraitFactor/100));
		}
		
		if (itemData.trait == 26)	// Weapon nirnhoned
		{
			// weaponPower = Math.floor(weaponPower * (1 + traitValue/100)); //
			// Now included in raw weapon data since update?
		}
		
		if (slotId == "OffHand1" || slotId == "OffHand2") 
		{
			inputValues.WeaponOffHandDamage = weaponPower;
			weaponPower = Math.floor(weaponPower * 0.178);
		}
		
		inputValues.WeaponPower += weaponPower;
		//AddEsoStatValueHistory("Item", "SpellDamage", weaponPower);
		AddEsoItemRawOutput(itemData, "WeaponPower", weaponPower);
		AddEsoInputStatSource("WeaponPower", { item: itemData, value: weaponPower, slotId:slotId });
		
		inputValues.Item.WeaponDamage += weaponPower;
		inputValues.Item.SpellDamage += weaponPower;
		
		AddEsoStatValueHistory("Item", "SpellDamage", weaponPower);
		AddEsoStatValueHistory("Item", "WeaponDamage", weaponPower);
		
		AddEsoItemRawOutput(itemData, "Item.WeaponDamage", weaponPower);
		AddEsoItemRawOutput(itemData, "Item.SpellDamage", weaponPower);
		
		AddEsoInputStatSource("Item.WeaponDamage", { item: itemData, value: weaponPower, slotId:slotId });
		AddEsoInputStatSource("Item.SpellDamage", { item: itemData, value: weaponPower, slotId:slotId });
	}
	
	if (itemData.trait == 18) // Divines
	{
		inputValues.Item.Divines += traitValue/100;
		AddEsoStatValueHistory("Item", "Divines", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.Divines", traitValue/100);
		AddEsoInputStatSource("Item.Divines", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 17) // Prosperous/Invigorating
	{
			/* Pre update 15 */
		// inputValues.Item.Prosperous += traitValue/100;
		// AddEsoItemRawOutput(itemData, "Item.Prosperous", traitValue/100);
		// AddEsoInputStatSource("Item.Prosperous", { item: itemData, value:
		// traitValue/100, slotId:slotId });
		
			/* Update 15 */
		traitValue = Math.floor(traitValue);
		
		inputValues.Item.HealthRegen += traitValue;
		AddEsoStatValueHistory("Item", "HealthRegen", traitValue);
		AddEsoItemRawOutput(itemData, "Item.HealthRegen", traitValue);
		AddEsoInputStatSource("Item.HealthRegen", { item: itemData, value: traitValue, slotId:slotId });
		
		inputValues.Item.MagickaRegen += traitValue;
		AddEsoStatValueHistory("Item", "MagickaRegen", traitValue);
		AddEsoItemRawOutput(itemData, "Item.MagickaRegen", traitValue);
		AddEsoInputStatSource("Item.MagickaRegen", { item: itemData, value: traitValue, slotId:slotId });
		
		inputValues.Item.StaminaRegen += traitValue;
		AddEsoStatValueHistory("Item", "StaminaRegen", traitValue);
		AddEsoItemRawOutput(itemData, "Item.StaminaRegen", traitValue);
		AddEsoInputStatSource("Item.StaminaRegen", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 12) // Impenetrable
	{
		inputValues.Item.CritResist += traitValue;
		AddEsoStatValueHistory("Item", "CritResist", traitValue);
		AddEsoItemRawOutput(itemData, "Item.CritResist", traitValue);
		AddEsoInputStatSource("Item.CritResist", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 11) // Sturdy
	{
		inputValues.Item.Sturdy += traitValue/100;
		AddEsoStatValueHistory("Item", "Sturdy", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.Sturdy", traitValue/100);
		AddEsoInputStatSource("Item.Sturdy", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	
	else if (itemData.trait == 6) // Weapon Training
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.Training += traitValue/100;
		AddEsoStatValueHistory("Item", "Training", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.Training", traitValue/100);
		AddEsoInputStatSource("Item.Training", { item: itemData, value: traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 15) // Armor Training
	{
		inputValues.Item.Training += traitValue/100;
		AddEsoStatValueHistory("Item", "Training", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.Training", traitValue/100);
		AddEsoInputStatSource("Item.Training", { item: itemData, value: traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 21) // Healthy
	{
		inputValues.Item.Health += traitValue;
		AddEsoStatValueHistory("Item", "Health", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Health", traitValue);
		AddEsoInputStatSource("Item.Health", { item: itemData, value: traitValue, slotId: slotId });
	}
	else if (itemData.trait == 22) // Arcane
	{
		inputValues.Item.Magicka += traitValue;
		AddEsoStatValueHistory("Item", "Magicka", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Magicka", traitValue);
		AddEsoInputStatSource("Item.Magicka", { item: itemData, value: traitValue, slotId: slotId });
	}
	else if (itemData.trait == 23) // Robust
	{
		inputValues.Item.Stamina += traitValue;
		AddEsoStatValueHistory("Item", "Stamina", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Stamina", traitValue);
		AddEsoInputStatSource("Item.Stamina", { item: itemData, value: traitValue, slotId: slotId });
	}	
	else if (itemData.trait == 14) // Well Fitted
	{
		inputValues.Item.SprintCost -= traitValue/100;
		inputValues.Item.RollDodgeCost -= traitValue/100;
		AddEsoStatValueHistory("Item", "SprintCost", -traitValue/100);
		AddEsoStatValueHistory("Item", "RollDodgeCost", -traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.SprintCost", -traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.RollDodgeCost", -traitValue/100);
		AddEsoInputStatSource("Item.SprintCost", { item: itemData, value: -traitValue/100, slotId:slotId });
		AddEsoInputStatSource("Item.RollDodgeCost", { item: itemData, value: -traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 7) // Sharpened
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.SpellPenetration += traitValue;
		inputValues.Item.PhysicalPenetration += traitValue;
		AddEsoStatValueHistory("Item", "SpellPenetration", traitValue);
		AddEsoStatValueHistory("Item", "PhysicalPenetration", traitValue);
		AddEsoItemRawOutput(itemData, "Item.SpellPenetration", traitValue);
		AddEsoItemRawOutput(itemData, "Item.PhysicalPenetration", traitValue);
		AddEsoInputStatSource("Item.SpellPenetration", { item: itemData, value: traitValue, slotId:slotId });
		AddEsoInputStatSource("Item.PhysicalPenetration", { item: itemData, value: traitValue, slotId: slotId });
	}
	else if (itemData.trait == 3) // Precise
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.SpellCrit += traitValue/100;
		inputValues.Item.WeaponCrit += traitValue/100;
		AddEsoStatValueHistory("Item", "SpellCrit", traitValue/100);
		AddEsoStatValueHistory("Item", "WeaponCrit", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.SpellCrit", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.WeaponCrit", traitValue/100);
		AddEsoInputStatSource("Item.SpellCrit", { item: itemData, value: traitValue/100, slotId:slotId });
		AddEsoInputStatSource("Item.WeaponCrit", { item: itemData, value: traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 5) // Defending
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.SpellResist += traitValue;
		inputValues.Item.PhysicalResist += traitValue;
		AddEsoStatValueHistory("Item", "SpellResist", traitValue);
		AddEsoStatValueHistory("Item", "PhysicalResist", traitValue);
		AddEsoItemRawOutput(itemData, "Item.SpellResist", traitValue);
		AddEsoItemRawOutput(itemData, "Item.PhysicalResist", traitValue);
		AddEsoInputStatSource("Item.SpellResist", { item: itemData, value: traitValue, slotId:slotId });
		AddEsoInputStatSource("Item.PhysicalResist", { item: itemData, value: traitValue, slotId: slotId });
	}
	else if (itemData.trait == 2) // Charged
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.StatusEffectChance += traitValue/100;
		AddEsoStatValueHistory("Item", "StatusEffectChance", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.StatusEffectChance", traitValue/100);
		AddEsoInputStatSource("Item.StatusEffectChance", { item: itemData, value: traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 4) // Infused
	{
		traitValue *= weaponTraitFactor;
	}
	else if (itemData.trait == 1) // Powered
	{
		traitValue *= weaponTraitFactor;
		inputValues.Item.HealingDone += traitValue/100;
		AddEsoStatValueHistory("Item", "HealingDone", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.HealingDone", traitValue/100);
		AddEsoInputStatSource("Item.HealingDone", { item: itemData, value: traitValue/100, slotId: slotId });
	}
	else if (itemData.trait == 8) // Decisive
	{
		traitValue *= weaponTraitFactor;
	}
	else if (itemData.trait == 31) // Jewelry Bloodthirsty
	{
		inputValues.Item.Bloodthirsty += traitValue2;
		AddEsoStatValueHistory("Item", "Bloodthirsty", traitValue2);
		AddEsoItemRawOutput(itemData, "Item.Bloodthirsty", traitValue2);
		AddEsoInputStatSource("Item.Bloodthirsty", { item: itemData, value: traitValue2, slotId:slotId });
	}
	else if (itemData.trait == 29) // Jewelry Harmony
	{
		inputValues.Item.SynergyBonus += traitValue/100;
		AddEsoStatValueHistory("Item", "SynergyBonus", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.SynergyBonus", traitValue/100);
		AddEsoInputStatSource("Item.SynergyBonus", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 33) // Jewelry Infused
	{
		// Implemented elsewhere
	}
	else if (itemData.trait == 32) // Jewelry Protective
	{
		inputValues.Item.SpellResist += traitValue;
		AddEsoStatValueHistory("Item", "SpellResist", traitValue);
		AddEsoItemRawOutput(itemData, "Item.SpellResist", traitValue);
		AddEsoInputStatSource("Item.SpellResist", { item: itemData, value: traitValue, slotId:slotId });
		
		inputValues.Item.PhysicalResist += traitValue;
		AddEsoStatValueHistory("Item", "PhysicalResist", traitValue);
		AddEsoItemRawOutput(itemData, "Item.PhysicalResist", traitValue);
		AddEsoInputStatSource("Item.PhysicalResist", { item: itemData, value: traitValue, slotId:slotId });		
	}
	else if (itemData.trait == 28) // Jewelry Swift
	{
		inputValues.Item.MovementSpeed += traitValue/100;
		AddEsoStatValueHistory("Item", "MovementSpeed", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.MovementSpeed", traitValue/100);
		AddEsoInputStatSource("Item.MovementSpeed", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 30) // Jewelry Triune
	{
		inputValues.Item.Magicka += traitValue;
		AddEsoStatValueHistory("Item", "Magicka", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Magicka", traitValue);
		AddEsoInputStatSource("Item.Magicka", { item: itemData, value: traitValue, slotId:slotId });
		
		inputValues.Item.Health += traitValue;
		AddEsoStatValueHistory("Item", "Health", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Health", traitValue);
		AddEsoInputStatSource("Item.Health", { item: itemData, value: traitValue, slotId:slotId });
		
		inputValues.Item.Stamina += traitValue;
		AddEsoStatValueHistory("Item", "Stamina", traitValue);
		AddEsoItemRawOutput(itemData, "Item.Stamina", traitValue);
		AddEsoInputStatSource("Item.Stamina", { item: itemData, value: traitValue, slotId:slotId });
	}
	
	GetEsoInputItemEnchantValues(inputValues, slotId, false);
}


window.IsEsoItemArmor = function (itemData)
{
	if (itemData.type == 1 && itemData.weaponType == 14) return true;
	if (itemData.type != 2) return false;
	return true;
}


window.IsEsoItemWeapon = function (itemData)
{
	if (itemData.type != 1) return false;
	if (itemData.weaponType == 14) return false;
	return true;
}


window.GetEsoInputItemEnchantValues = function (inputValues, slotId, doWeaponUpdate)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	
	var enchantData = GetEsoEnchantData(slotId);
	if (enchantData == null) return false;
	if (enchantData.enchantDesc == "") return true;
	
	var enchantFactor = 1;
	var transmuteFactor = 1;
	var isTransmuted = (itemData.transmuteTrait > 0 && itemData.transmuteTrait != itemData.origTrait)
	
	var weaponTraitFactor = 1;
	if (inputValues.WeaponTraitEffect > 0) weaponTraitFactor += inputValues.WeaponTraitEffect;
	
		// Fix original infused item that is transmuted
	if (enchantData.isDefaultEnchant && itemData.transmuteTrait > 0 && (itemData.origTrait == 16 || itemData.origTrait == 4 || itemData.origTrait == 33) && itemData.transmuteTrait != itemData.origTrait)
	{
		var rawDesc = RemoveEsoDescriptionFormats(itemData.origTraitDesc);
		var results = rawDesc.match(/([0-9]+\.?[0-9]*\%?)/g);
		
		if (results != null && results.length !== 0)
		{
			transmuteFactor = parseFloat(results[0])/100;
			if (isNaN(transmuteFactor) || transmuteFactor < 0) transmuteFactor = 0;
			transmuteFactor += 1;
		}
	}
	
		// Infused
	if (itemData.trait == 16 || itemData.trait == 4 || itemData.trait == 33)
	{
		var rawDesc = RemoveEsoDescriptionFormats(itemData.traitDesc);
		var results = rawDesc.match(/([0-9]+\.?[0-9]*\%?)/g);
		
		if (results != null && results.length !== 0)
		{
			var infusedFactor = parseFloat(results[0])/100;
			if (isNaN(infusedFactor) || infusedFactor < 0) infusedFactor = 0;
			if (itemData.trait == 4) infusedFactor *= weaponTraitFactor;
			
				/* Default enchants already include the infused effect */
			if (!(enchantData.isDefaultEnchant && !isTransmuted)) enchantFactor = enchantFactor * (1 + infusedFactor);
			
			if (doWeaponUpdate) {
				var potency = inputValues['EnchantPotency' + slotId];
				
				if (potency != null) {
					inputValues['EnchantPotency' + slotId] = (1 + inputValues['EnchantPotency' + slotId]) * (1 + infusedFactor) - 1;
					AddEsoItemRawOutput(itemData, "Enchant Potency Infused", infusedFactor);
					AddEsoInputStatSource("EnchantPotency" + slotId, { item: itemData, value: infusedFactor, slotId: slotId });
				}
			}
			
			if (results.length > 1)
			{
				var infusedCooldown = parseFloat(results[1])/100;
				if (isNaN(infusedCooldown) || infusedCooldown < 0) infusedCooldown = 0;
				
				if (doWeaponUpdate) {
					var cooldown = inputValues['EnchantCooldown' + slotId];
					
					if (cooldown != null) {
						inputValues['EnchantCooldown' + slotId] = (1 + inputValues['EnchantCooldown' + slotId]) * (1 - infusedCooldown) - 1;
						AddEsoItemRawOutput(itemData, "Enchant Cooldown Infused", -infusedCooldown);
						AddEsoInputStatSource("EnchantCooldown" + slotId, { item: itemData, value: -infusedCooldown, slotId: slotId });
					}
				}
			}
		}
	}
	
	if (IsEsoItemWeapon(itemData) && doWeaponUpdate === true && inputValues.Set.EnchantPotency != 0 && itemData.weaponType != 14) 
	{
		var potency = inputValues['EnchantPotency' + slotId];
		var cooldown = inputValues['EnchantCooldown' + slotId];
		var isOblivionDamage = (enchantData.enchantDesc.indexOf("Oblivion Damage") >= 0); 
		
		if (potency != null && !isOblivionDamage) 
		{
			inputValues['EnchantPotency' + slotId] = (1 + inputValues['EnchantPotency' + slotId]) * (1 + inputValues.Set.EnchantPotency) - 1;
			AddEsoItemRawOutput(itemData, "Enchant Potency Torug", inputValues.Set.EnchantPotency);
			AddEsoInputStatSource('EnchantPotency' + slotId, { set: g_EsoBuildSetData["Torug's Pact"], setBonusCount: 4, value: inputValues.Set.EnchantPotency, slotId: slotId });
		}
		
		if (cooldown != null && inputValues.Set.EnchantCooldown != 0) {
			inputValues['EnchantCooldown' + slotId] = (1 + inputValues['EnchantCooldown' + slotId]) * (1 + inputValues.Set.EnchantCooldown) - 1;
			AddEsoItemRawOutput(itemData, "Enchant Cooldown Torug", inputValues.Set.EnchantCooldown);
			AddEsoInputStatSource("EnchantCooldown" + slotId, { set: g_EsoBuildSetData["Torug's Pact"], setBonusCount: 4, value: inputValues.Set.EnchantCooldown, slotId: slotId });
		}
		
		if (!isOblivionDamage) enchantFactor *= (1 + inputValues.Set.EnchantPotency);
	}
	
	//if (!isTransmuted && (slotId == "Waist" || slotId == "Feet" || slotId == "Shoulders" || slotId == "Hands"))
	if (slotId == "Waist" || slotId == "Feet" || slotId == "Shoulders" || slotId == "Hands")
	{
		if (!enchantData.isDefaultEnchant)		//Change in update 29?
		{
			enchantFactor = enchantFactor * 0.4044;
		}
	}
	
	if (IsEsoItemWeapon(itemData) && doWeaponUpdate === true)
	{
		GetEsoInputItemEnchantWeaponValues(inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor);
	}
	else if (IsEsoItemArmor(itemData) && doWeaponUpdate !== true)
	{
		GetEsoInputItemEnchantArmorValues(inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor);
	}	
	
	return true;
}


window.GetEsoInputItemEnchantArmorValues = function (inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor)
{
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	var isTransmuted = (itemData.transmuteTrait > 0 && itemData.transmuteTrait != itemData.origTrait)
	
	for (var i = 0; i < ESO_ENCHANT_ARMOR_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_ARMOR_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var statValue = parseFloat(matches[1]);
		
		statValue /= transmuteFactor;
		if (!enchantData.isDefaultEnchant || isTransmuted) statValue *= enchantFactor;
		//if (!enchantData.isDefaultEnchant) statValue *= enchantFactor;		//Changed in update 29?
		
		if (matchData.factorValue != null) statValue *= matchData.factorValue;
		
		if (matchData.round == "floor10")
			statValue = Math.floor(statValue*10)/10;
		else
			statValue = Math.floor(statValue);
		
		inputValues.Item[matchData.statId] += statValue;
		AddEsoStatValueHistory("Item", matchData.statId, statValue);
		AddEsoItemRawOutput(itemData, "Item." + matchData.statId, statValue);
		AddEsoInputStatSource("Item." + matchData.statId, { item: itemData, enchant: enchantData, value: statValue, slotId: slotId });
	}
	
	enchantData.enchantFactor = enchantFactor;
	enchantData.transmuteFactor = transmuteFactor;
}


window.RemoveEsoDescriptionFormats = function (text)
{
	if (text == null) return "";
	return text.replace(/\|c[a-fA-F0-9]{6}([^|]*)\|r/g, '$1');
}


window.UpdateEsoAllEnchantWeaponValues = function(inputValues)
{
	if (g_EsoBuildActiveWeapon == 1)
	{
		UpdateEsoEnchantWeaponValues(inputValues, "MainHand1");
		UpdateEsoEnchantWeaponValues(inputValues,  "OffHand1");
	}
	else
	{
		UpdateEsoEnchantWeaponValues(inputValues, "MainHand2");
		UpdateEsoEnchantWeaponValues(inputValues,  "OffHand2");
	}
	
}


window.UpdateEsoEnchantWeaponValues = function(inputValues, slotId)
{
	var enchantData = g_EsoBuildEnchantData[slotId];
	var itemData = g_EsoBuildItemData[slotId];
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	var isDescUpdated = false;
	
	if (itemData == null || $.isEmptyObject(itemData)) return false;
	if (itemData.weaponType == 14) return false;
	if ($.isEmptyObject(enchantData)) return false;
	if (rawDesc == "") return false;
	
	for (var i = 0; i < ESO_ENCHANT_WEAPON_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_WEAPON_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponUpdateMatch(match, p1, itemData, enchantData, matchData, inputValues); });
		
		isDescUpdated = true;
		
		enchantData.origCooldown = matchData.cooldown;
		enchantData.origDuration = matchData.duration;
		enchantData.cooldown = matchData.cooldown;
		enchantData.duration = matchData.duration;
		
		var statId = "EnchantCooldown" + slotId;
		
		if (inputValues[statId] != null) 
		{
			enchantData.cooldown = Math.floor(enchantData.cooldown * (1 + inputValues[statId]) * 100)/100;
		}
	}
	
	// AddEsoInputStatSource("OtherEffects", { other: true, item: itemData,
	// enchant: enchantData, value: rawDesc, slotId: slotId });
	AddEsoItemRawOutputString(itemData, "Orig Enchant", RemoveEsoDescriptionFormats(enchantData.enchantDesc));
	AddEsoItemRawOutputString(itemData, "Enchantment", rawDesc);
	
	enchantData.newEnchantDesc = rawDesc;
	return true;
}


window.ReplaceEsoWeaponUpdateMatch = function (match, p1, itemData, enchantData, matchData, inputValues)
{
	var newValue = parseFloat(p1);
	
	if (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11)
	{
		AddEsoItemRawOutputString(itemData, "Enchantment 1H Weapon", "50%", true);
	}
	
	if (enchantData.transmuteFactor && enchantData.transmuteFactor != 1) 
	{
		newValue = newValue / enchantData.transmuteFactor;
		AddEsoItemRawOutputString(itemData, "Enchantment Transmute Factor", ((enchantData.transmuteFactor - 1)*100).toFixed(0) + "%", true);
	}
	
	if (enchantData.enchantFactor && enchantData.enchantFactor != 1) 
	{
		newValue = newValue * enchantData.enchantFactor;
		AddEsoItemRawOutputString(itemData, "Final Enchantment Factor", ((enchantData.enchantFactor - 1)*100).toFixed(0) + "%", true);
	}
	
	if (matchData.damageType != null)
	{
		var damageTypeDamageDone = inputValues[matchData.damageType + "DamageDone"];
		
		if (inputValues.DamageDone)
		{
			newValue *= 1 + inputValues.DamageDone;
			AddEsoItemRawOutputString(itemData, "Enchantment Damage Done", inputValues.DamageDone*100 + "%");
		}
		
		if (inputValues.DirectDamageDone)
		{
			newValue *= 1 + inputValues.DirectDamageDone;
			AddEsoItemRawOutputString(itemData, "Enchantment Direct Damage Done", inputValues.DirectDamageDone*100 + "%");
		}
		
		if (inputValues.SingleTargetDamageDone)
		{
			newValue *= 1 + inputValues.SingleTargetDamageDone;
			AddEsoItemRawOutputString(itemData, "Enchantment Single Target Damage Done", inputValues.SingleTargetDamageDone*100 + "%");
		}
		
		if (damageTypeDamageDone)
		{
			newValue *= 1 + damageTypeDamageDone;
			AddEsoItemRawOutputString(itemData, "Enchantment " + matchData.damageType + " Damage Done", damageTypeDamageDone*100 + "%");
		}
	}
	else if (matchData.isDamageShield && inputValues.DamageShield)
	{
		newValue *= 1 + inputValues.DamageShield;
		AddEsoItemRawOutputString(itemData, "Enchantment Damage Shield", inputValues.DamageShield*100 + "%");
	}
	else if (matchData.isHealing)
	{
		if (inputValues.HealingDone) {
			newValue *= 1 + inputValues.HealingDone;
			AddEsoItemRawOutputString(itemData, "Enchantment Healing Done", inputValues.HealingDone*100 + "%");
		}
		
		if (inputValues.HealingReceived) {
			newValue *= 1 + inputValues.HealingReceived;
			AddEsoItemRawOutputString(itemData, "Enchantment Healing Received", inputValues.HealingReceived*100 + "%");
		}
	}
	
	newValue = Math.floor(newValue);
	
	return match.replace(p1, newValue);
}



window.ReplaceEsoWeaponMatch = function (match, p1, offset, string, enchantFactor, transmuteFactor)
{
	var newValue = Math.floor(parseFloat(p1) / transmuteFactor * enchantFactor);
	return match.replace(p1, newValue);
}


window.GetEsoInputItemEnchantWeaponValues = function (inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor)
{
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	var addFinalEffect = false;
	var isTransmuted = (itemData.transmuteTrait > 0 && itemData.transmuteTrait != itemData.origTrait)
	
	// if (enchantData.isDefaultEnchant && !isTransmuted) enchantFactor = 1;
	if (itemData.type != 1) return false;
	
	if (!enchantData.isDefaultEnchant && itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		enchantFactor *= 0.5;
	}
	
	for (var i = 0; i < ESO_ENCHANT_WEAPON_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_WEAPON_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		if (matchData.damageType != null || matchData.isHealing || matchData.isDamageShield) {
			// Do nothing...is updated later
		}
		else if (matchData.statId  == null || matchData.statId == "")
		{
			rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor, transmuteFactor); });
		}
		else if (matchData.statId == "OtherEffects")
		{
			rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor, transmuteFactor); });
			addFinalEffect = true;
			
			if (matchData.buffId != null && matchData.updateBuffValue === true)
			{
				var buffData = g_EsoBuildBuffData[matchData.buffId];
				
				if (buffData != null) 
				{
					var matches = rawDesc.match(matchData.match);
					
					if (matches != null && matches[1] != null) 
					{
						if (buffData.value != null) buffData.value = parseFloat(matches[1]);
						
						if (buffData.values) {
							for (var j = 0; j < buffData.values.length; j++)
							{
								buffData.values[j] = parseFloat(matches[1]);
							}
						}
					}
					
					buffData.visible = true;
					buffData.forceUpdate = true;
				}
			}
		}
		else
		{
			var statValue = Math.floor(parseFloat(matches[1]) * enchantFactor);
			var category = matchData.category || "Item";
			
			inputValues[category][matchData.statId] += statValue;
			AddEsoStatValueHistory(category, matchData.statId, statValue);
			AddEsoItemRawOutput(itemData, category + "." + matchData.statId, statValue);
			AddEsoInputStatSource(category + "." + matchData.statId, { item: itemData, enchant: enchantData, value: statValue, slotId: slotId });
		}
	}
	
	if (addFinalEffect)
	{
		AddEsoInputStatSource("OtherEffects", { other: true, item: itemData, enchant: enchantData, value: rawDesc, slotId: slotId });
		// AddEsoItemRawOutputString(itemData, "WeaponEnchant", rawDesc);
	}
	
	enchantData.newEnchantDesc = rawDesc;
	enchantData.enchantFactor = enchantFactor;
	enchantData.transmuteFactor = transmuteFactor;
}


window.GetEsoInputItemEnchantOtherHandWeaponValues = function (inputValues, slotId, itemData, enchantData, enchantFactor, transmuteFactor)
{
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	var addFinalEffect = false;
	var isTransmuted = (itemData.transmuteTrait > 0 && itemData.transmuteTrait != itemData.origTrait)
	
	if (enchantData.isDefaultEnchant && !isTransmuted) enchantFactor = 1;
	if (itemData.type != 1) return false;
	
	if (inputValues.Set.EnchantPotency != null)
	{
		enchantFactor *= (1 + inputValues.Set.EnchantPotency);
	}
		/* Special case for offbar Torug's Pact setup */
	else if (g_EsoBuildSetData["Torug's Pact"] != null && g_EsoBuildSetData["Torug's Pact"].count < 5 && g_EsoBuildSetData["Torug's Pact"].otherCount >= 5)
	{
		enchantFactor *= (1 + 0.3);
	}
	
	if (!enchantData.isDefaultEnchant && itemData && (itemData.weaponType == 1 || itemData.weaponType == 2 || itemData.weaponType == 3 || itemData.weaponType == 11))
	{
		enchantFactor *= 0.5;
	}
	
	for (var i = 0; i < ESO_ENCHANT_OTHERHAND_WEAPON_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_OTHERHAND_WEAPON_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor, transmuteFactor); });
		addFinalEffect = true;
		
		if (matchData.buffId != null && matchData.updateBuffValue === true)
		{
			var buffData = g_EsoBuildBuffData[matchData.buffId];
			
			if (buffData != null) 
			{
				var matches = rawDesc.match(matchData.match);
				
				if (matches != null && matches[1] != null) 
				{
					if (buffData.value != null) buffData.value = parseFloat(matches[1]);
					
					if (buffData.values) {
						for (var j = 0; j < buffData.values.length; j++) 
						{
							buffData.values[j] = parseFloat(matches[1]);
						}
					}
				}
				
				buffData.visible = true;
				buffData.forceUpdate = true;
			}
		}
		
	}
	
	enchantData.newEnchantDesc = rawDesc;
	enchantData.enchantFactor = enchantFactor;
	enchantData.transmuteFactor = transmuteFactor;
}


window.EsoItemSetQuickCount = function (setName, useOffHand)
{
	var setCount = 0;
	
	setName = setName.toLowerCase();
	
	for (var key in g_EsoBuildItemData)
	{
		itemData = g_EsoBuildItemData[key];
		
		if (itemData == null || itemData.setName == null) continue;
		if (itemData.setName.toLowerCase() != setName) continue;
		if (itemData.enabled === false) continue;
		
		var is2HWeapon = itemData.weaponType ==  4 || itemData.weaponType ==  5 || itemData.weaponType ==  6 || itemData.weaponType ==  8 ||
						 itemData.weaponType ==  9 || itemData.weaponType == 12 || itemData.weaponType == 13 || itemData.weaponType == 15;
		
		if (key == "MainHand2" || key == "OffHand2" || key == "Poison2")
		{
			if (useOffHand === true && g_EsoBuildActiveWeapon == 2)
				continue;
			else if (!useOffHand && g_EsoBuildActiveWeapon == 1)
				continue;
		}
		else if (key == "MainHand1" || key == "OffHand1" || key == "Poison1")
		{
			if (useOffHand === true && g_EsoBuildActiveWeapon == 1)
				continue;
			else if (!useOffHand && g_EsoBuildActiveWeapon == 2)
				continue;
		}
		
		++setCount;
		if (is2HWeapon) ++setCount;
	}
	
	return setCount;
}


window.PreUpdateEsoItemSpecialSets = function (inputValues)
{
	inputValues.WeaponTraitEffect = 0;
	inputValues.OffHandWeaponTraitEffect = 0;
	
	var diamondSetCount = EsoItemSetQuickCount("Heartland Conqueror");
	var diamondSetCountOffHand = EsoItemSetQuickCount("Heartland Conqueror", true);
	
	if (diamondSetCount >= 5)
	{
		inputValues.WeaponTraitEffect = 1;
	}
	
	if (diamondSetCountOffHand >= 5)
	{
		inputValues.OffHandWeaponTraitEffect = 1;
	}
	
}


window.UpdateEsoItemSets = function (inputValues)
{
	g_EsoBuildSetData = {};
	
	for (var key in g_EsoBuildItemData)
	{
		var isOtherHand = false;
		var isCurrentHand = false;
		var is2HWeapon = false;
		
		var itemData = g_EsoBuildItemData[key];
		var setName = itemData.setName;
		
		is2HWeapon = itemData.weaponType ==  4 || itemData.weaponType ==  5 || itemData.weaponType ==  6 || itemData.weaponType ==  8 ||
					 itemData.weaponType ==  9 || itemData.weaponType == 12 || itemData.weaponType == 13 || itemData.weaponType == 15;
		
		if (key == "MainHand2" || key == "OffHand2" || key == "Poison2")
		{
			if (g_EsoBuildActiveWeapon == 1)
				isOtherHand = true;
			else
				isCurrentHand = true;
		}
		else if (key == "MainHand1" || key == "OffHand1" || key == "Poison1")
		{
			if (g_EsoBuildActiveWeapon == 2)
				isOtherHand = true;
			else
				isCurrentHand = true;
		}
		
		if (itemData.enabled === false) continue;
		if (setName == null || setName == "") continue;
		
		if (g_EsoBuildSetData[setName] == null)
		{
			g_EsoBuildSetData[setName] = {
					name: setName,
					count: 0,
					otherCount: 0,
					enableOffBar : null,
					items: [],
					unequippedItems : [],
			};
		}
		
		if (isOtherHand)
		{
			++g_EsoBuildSetData[setName].otherCount;
			if (is2HWeapon) ++g_EsoBuildSetData[setName].otherCount; 
			g_EsoBuildSetData[setName].unequippedItems.push(itemData);
		}
		else
		{
			++g_EsoBuildSetData[setName].count;
			if (is2HWeapon) ++g_EsoBuildSetData[setName].count;
			
			if (!isCurrentHand)
			{
				++g_EsoBuildSetData[setName].otherCount;
				if (is2HWeapon) ++g_EsoBuildSetData[setName].otherCount;
			}
			
			g_EsoBuildSetData[setName].items.push(itemData);
			AddEsoItemRawOutput(itemData, "Set." + setName, 1);
			AddEsoInputStatSource("Set." + setName, { set: setName, item: itemData });
		}
	}
	
	for (var set in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[set];
		if (setData.count >= 3) inputValues['ThreeSetCount'] += 1;
	}
	
	ComputeEsoBuildAllSetData();
	UpdateEsoBuildToggledSetData();
}


window.ParseEsoBuildFloat = function (value, defaultValue)
{
	var result = parseFloat(value);
	
	if (!isNaN(result)) return result;
	if (defaultValue != null) return defaultValue;
	return 0;
}


window.GetEsoInputTargetValues = function (inputValues)
{
	inputValues.Target.SpellResist = ParseEsoBuildFloat($("#esotbTargetResistance").val());
	inputValues.Target.PhysicalResist = inputValues.Target.SpellResist;
	inputValues.Target.CritResist = ParseEsoBuildFloat($("#esotbTargetCritResistFlat").val());
	inputValues.Target.EffectiveLevel = parseInt(ParseEsoBuildFloat($("#esotbTargetEffectiveLevel").val()));
	// inputValues.Target.CritResistFactor =
	// ParseEsoBuildFloat($("#esotbTargetCritResistFactor").val()) / 100;
	inputValues.Target.PenetrationFlat = ParseEsoBuildFloat($("#esotbTargetPenetrationFlat").val());
	inputValues.Target.PenetrationFactor = ParseEsoBuildFloat($("#esotbTargetPenetrationFactor").val()) / 100;
	inputValues.Target.DefenseBonus = ParseEsoBuildFloat($("#esotbTargetDefenseBonus").val()) / 100;
	inputValues.Target.AttackBonus = ParseEsoBuildFloat($("#esotbTargetAttackBonus").val()) / 100;
	inputValues.Target.CritDamage = ParseEsoBuildFloat($("#esotbTargetCritDamage").val()) / 100;
	inputValues.Target.CritChance = ParseEsoBuildFloat($("#esotbTargetCritChance").val()) / 100;
	
	inputValues.Target.PercentHealth = ParseEsoBuildFloat($("#esotbTargetPercentHealth").val()) / 100;
	if (inputValues.Target.PercentHealth < 0) inputValues.Target.PercentHealth = 0;
	if (inputValues.Target.PercentHealth > 1) inputValues.Target.PercentHealth = 1;
}


window.GetEsoInputMiscValues = function (inputValues)
{
	inputValues.Misc.SpellCost = parseFloat($("#esotbMiscSpellCost").val());
	
	if (inputValues.Skill.BlockSpeedPenalty == 0) inputValues.Skill.BlockSpeedPenalty = 0.60;
}


window.GetEsoInputMundusValues = function (inputValues)
{
	inputValues.Mundus.Name = $("#esotbMundus").val();
	GetEsoInputMundusNameValues(inputValues, inputValues.Mundus.Name);
	
	if (IsTwiceBornStarEnabled())
	{
		inputValues.Mundus.Name2 = $("#esotbMundus2").val();
		GetEsoInputMundusNameValues(inputValues, inputValues.Mundus.Name2);
	}
	else
	{
		inputValues.Mundus.Name2 = ""; 
	}
	
}


window.GetEsoInputMundusNameValues = function (inputValues, mundusName)
{
	var divines = inputValues.Item.Divines;
	
	if (mundusName == "The Lady")
	{
			// Preupdate 15
		// inputValues.Mundus.PhysicalResist = 1980; //30*66
		// AddEsoInputStatSource("Mundus.PhysicalResist", { mundus: mundusName,
		// value: inputValues.Mundus.PhysicalResist });
		
			// Update 15
		inputValues.Mundus.PhysicalResist = 2752;
		inputValues.Mundus.SpellResist = 2752;
		
			// Update 27
		inputValues.Mundus.PhysicalResist = 2744;
		inputValues.Mundus.SpellResist = 2744;
		
		AddEsoStatValueHistory("Mundus", "PhysicalResist", inputValues.Mundus.PhysicalResist);
		AddEsoStatValueHistory("Mundus", "SpellResist", inputValues.Mundus.SpellResist);
		
		AddEsoInputStatSource("Mundus.PhysicalResist", { mundus: mundusName, value: inputValues.Mundus.PhysicalResist });
		AddEsoInputStatSource("Mundus.SpellResist", { mundus: mundusName, value: inputValues.Mundus.SpellResist });
		
		if (divines > 0)
		{
			var extraSpell    = Math.floor(inputValues.Mundus.SpellResist    * divines);
			var extraPhysical = Math.floor(inputValues.Mundus.PhysicalResist * divines);
			inputValues.Mundus.PhysicalResist += extraPhysical;
			inputValues.Mundus.SpellResist += extraSpell;
			
			AddEsoStatValueHistory("Mundus", "PhysicalResist", extraPhysical);
			AddEsoStatValueHistory("Mundus", "SpellResist", extraSpell);
			
			AddEsoInputStatSource("Mundus.PhysicalResist", { source: mundusName + " Divines bonus", value: extraPhysical });
			AddEsoInputStatSource("Mundus.SpellResist", { source: mundusName + " Divines bonus", value: extraSpell });
		}
		
	}
	else if (mundusName == "The Lover")
	{
			// Preupdate 15
		// inputValues.Mundus.SpellResist = 1980; // 30*66
		// AddEsoInputStatSource("Mundus.SpellResist", { mundus: mundusName,
		// value: inputValues.Mundus.SpellResist });
		
			// Update 15
		inputValues.Mundus.SpellPenetration = 2752;
		inputValues.Mundus.PhysicalPenetration = 2752;
		
			// Update 27
		inputValues.Mundus.SpellPenetration = 2744;
		inputValues.Mundus.PhysicalPenetration = 2744;
		
		AddEsoStatValueHistory("Mundus", "PhysicalPenetration", inputValues.Mundus.PhysicalPenetration);
		AddEsoStatValueHistory("Mundus", "SpellPenetration", inputValues.Mundus.SpellPenetration);
		
		AddEsoInputStatSource("Mundus.SpellPenetration", { mundus: mundusName, value: inputValues.Mundus.SpellPenetration });
		AddEsoInputStatSource("Mundus.PhysicalPenetration", { mundus: mundusName, value: inputValues.Mundus.PhysicalPenetration });
		
		if (divines > 0)
		{
			var extraSpell    = Math.floor(inputValues.Mundus.SpellPenetration    * divines);
			var extraPhysical = Math.floor(inputValues.Mundus.PhysicalPenetration * divines);
			inputValues.Mundus.PhysicalPenetration += extraPhysical;
			inputValues.Mundus.SpellPenetration += extraSpell;
			
			AddEsoStatValueHistory("Mundus", "PhysicalPenetration", extraPhysical);
			AddEsoStatValueHistory("Mundus", "SpellPenetration", extraSpell);
			
			AddEsoInputStatSource("Mundus.PhysicalPenetration", { source: mundusName + " Divines bonus", value: extraPhysical });
			AddEsoInputStatSource("Mundus.SpellPenetration", { source: mundusName + " Divines bonus", value: extraSpell });
		}
	}
	else if (mundusName == "The Lord")
	{
		// inputValues.Mundus.Health = 1452; // 22*66
		
			// Update 15
		inputValues.Mundus.Health = 2231;
		
			// Update 27
		inputValues.Mundus.Health = 2225;
		
		AddEsoStatValueHistory("Mundus", "Health", inputValues.Mundus.Health);
		AddEsoInputStatSource("Mundus.Health", { mundus: mundusName, value: inputValues.Mundus.Health });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.Health * divines);
			inputValues.Mundus.Health += extra;
			AddEsoStatValueHistory("Mundus", "Health", extra);
			AddEsoInputStatSource("Mundus.Health", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Mage")
	{
		// inputValues.Mundus.Magicka = 1320; // 20*66
		
			// Update 15
		inputValues.Mundus.Magicka = 2028;
		
			// Update 27
		inputValues.Mundus.Magicka = 2023;
		
		AddEsoStatValueHistory("Mundus", "Magicka", inputValues.Mundus.Magicka);
		AddEsoInputStatSource("Mundus.Magicka", { mundus: mundusName, value: inputValues.Mundus.Magicka });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.Magicka * divines);
			inputValues.Mundus.Magicka += extra;
			AddEsoStatValueHistory("Mundus", "Magicka", extra);
			AddEsoInputStatSource("Mundus.Magicka", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Tower")
	{
		// inputValues.Mundus.Stamina = 1320; // 20*66
		
			// Update 15
		inputValues.Mundus.Stamina = 2028;
		
			// Update 27
		inputValues.Mundus.Stamina = 2023;
		
		AddEsoStatValueHistory("Mundus", "Stamina", inputValues.Mundus.Stamina);
		AddEsoInputStatSource("Mundus.Stamina", { mundus: mundusName, value: inputValues.Mundus.Stamina });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.Stamina * divines);
			inputValues.Mundus.Stamina += extra;
			AddEsoStatValueHistory("Mundus", "Stamina", extra);
			AddEsoInputStatSource("Mundus.Stamina", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Atronach")
	{
		// inputValues.Mundus.MagickaRegen = 198; // 3*66
		
			// Update 15
		inputValues.Mundus.MagickaRegen = 238;
		
			// Update 27
		inputValues.Mundus.MagickaRegen = 310;
		
		AddEsoStatValueHistory("Mundus", "MagickaRegen", inputValues.Mundus.MagickaRegen);
		AddEsoInputStatSource("Mundus.MagickaRegen", { mundus: mundusName, value: inputValues.Mundus.MagickaRegen });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.MagickaRegen * divines);
			inputValues.Mundus.MagickaRegen += extra;
			AddEsoStatValueHistory("Mundus", "MagickaRegen", extra);
			AddEsoInputStatSource("Mundus.MagickaRegen", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Serpent")
	{
		// inputValues.Mundus.StaminaRegen = 198; // 3*66
		
			// Update 15
		inputValues.Mundus.StaminaRegen = 238;
		
			// Update 27
		inputValues.Mundus.StaminaRegen = 310;
		
		AddEsoStatValueHistory("Mundus", "StaminaRegen", inputValues.Mundus.StaminaRegen);
		AddEsoInputStatSource("Mundus.StaminaRegen", { mundus: mundusName, value: inputValues.Mundus.StaminaRegen });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.StaminaRegen * divines);
			inputValues.Mundus.StaminaRegen += extra;
			AddEsoStatValueHistory("Mundus", "StaminaRegen", extra);
			AddEsoInputStatSource("Mundus.StaminaRegen", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Shadow")
	{
		// inputValues.Mundus.CritDamage = 0.12;
		
		// inputValues.Mundus.CritDamage = 0.09; // Update 15
		// inputValues.Mundus.CritHealing = 0.09;
		
		inputValues.Mundus.CritDamage  = 0.13;			// Update 21
		// inputValues.Mundus.CritHealing = 0.13; // Update ??
		
			// Update 27
		inputValues.Mundus.CritDamage  = 0.11;
		inputValues.Mundus.CritHealing = 0.11;
		
		AddEsoStatValueHistory("Mundus", "CritDamage", inputValues.Mundus.CritDamage);
		AddEsoStatValueHistory("Mundus", "CritHealing", inputValues.Mundus.CritHealing);
		
		AddEsoInputStatSource("Mundus.CritDamage",  { mundus: mundusName, value: inputValues.Mundus.CritDamage });
		AddEsoInputStatSource("Mundus.CritHealing", { mundus: mundusName, value: inputValues.Mundus.CritHealing });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.CritDamage * 1000 * divines) / 1000;
			
			inputValues.Mundus.CritDamage  += extra;
			AddEsoStatValueHistory("Mundus", "CritDamage", extra);
			AddEsoInputStatSource("Mundus.CritDamage",  { source: mundusName + " Divines bonus", value: extra });
			
			inputValues.Mundus.CritHealing += extra;
			AddEsoStatValueHistory("Mundus", "CritHealing", extra);
			AddEsoInputStatSource("Mundus.CritHealing", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Ritual")
	{
		inputValues.Mundus.HealingDone = 0.10;
		
			// Update 27
		inputValues.Mundus.HealingDone = 0.08;
		
		AddEsoStatValueHistory("Mundus", "HealingDone", inputValues.Mundus.HealingDone);
		AddEsoInputStatSource("Mundus.HealingDone", { mundus: mundusName, value: inputValues.Mundus.HealingDone });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.HealingDone * 1000 * divines)/1000;
			inputValues.Mundus.HealingDone += extra;
			AddEsoStatValueHistory("Mundus", "HealingDone", extra);
			AddEsoInputStatSource("Mundus.HealingDone", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Thief")
	{
		// inputValues.Mundus.SpellCrit = 0.11; // Preupdate 15
		// inputValues.Mundus.WeaponCrit = 0.11;
		
			// Update 15
		//inputValues.Mundus.SpellCrit = 0.07;		// 1537
		//inputValues.Mundus.WeaponCrit = 0.07;
		
			// Update 6.1.6
		inputValues.Mundus.SpellCrit = 0.0608;	// 1333
		inputValues.Mundus.WeaponCrit = 0.0608;
		
		AddEsoStatValueHistory("Mundus", "SpellCrit", inputValues.Mundus.SpellCrit);
		AddEsoStatValueHistory("Mundus", "WeaponCrit", inputValues.Mundus.WeaponCrit);
		
		AddEsoInputStatSource("Mundus.SpellCrit", { mundus: mundusName, value: inputValues.Mundus.SpellCrit });
		AddEsoInputStatSource("Mundus.WeaponCrit", { mundus: mundusName, value: inputValues.Mundus.WeaponCrit });
		
		if (divines > 0)
		{
			var extraSpell    = Math.floor(inputValues.Mundus.SpellCrit * 1000  * divines)/1000;
			var extraPhysical = Math.floor(inputValues.Mundus.WeaponCrit * 1000 * divines)/1000;
			inputValues.Mundus.WeaponCrit += extraPhysical;
			inputValues.Mundus.SpellCrit += extraSpell;
			
			AddEsoStatValueHistory("Mundus", "WeaponCrit", extraPhysical);
			AddEsoStatValueHistory("Mundus", "SpellCrit", extraSpell);
			
			AddEsoInputStatSource("Mundus.WeaponCrit", { source: mundusName + " Divines bonus", value: extraPhysical });
			AddEsoInputStatSource("Mundus.SpellCrit", { source: mundusName + " Divines bonus", value: extraSpell });
		}
	}
	else if (mundusName == "The Warrior")
	{
		// inputValues.Mundus.WeaponDamage = 167; // Preupdate 15
		inputValues.Mundus.WeaponDamage = 238;		// Update 15
		AddEsoStatValueHistory("Mundus", "WeaponDamage", inputValues.Mundus.WeaponDamage);
		AddEsoInputStatSource("Mundus.WeaponDamage", { mundus: mundusName, value: inputValues.Mundus.WeaponDamage });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.WeaponDamage * divines);
			inputValues.Mundus.WeaponDamage += extra;
			AddEsoStatValueHistory("Mundus", "WeaponDamage", extra);
			AddEsoInputStatSource("Mundus.WeaponDamage", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Apprentice")
	{
		// inputValues.Mundus.SpellDamage = 167; // Preupdate 15
		inputValues.Mundus.SpellDamage = 238; 		// Update 15
		AddEsoStatValueHistory("Mundus", "SpellDamage", inputValues.Mundus.SpellDamage);
		AddEsoInputStatSource("Mundus.SpellDamage", { mundus: mundusName, value: inputValues.Mundus.SpellDamage });
		
		if (divines > 0)
		{
			var extra = Math.floor(inputValues.Mundus.SpellDamage * divines);
			inputValues.Mundus.SpellDamage += extra;
			AddEsoStatValueHistory("Mundus", "SpellDamage", extra);
			AddEsoInputStatSource("Mundus.SpellDamage", { source: mundusName + " Divines bonus", value: extra });
		}
	}
	else if (mundusName == "The Steed")
	{
		// inputValues.Mundus.HealthRegen = 198; // 3*66, preupdate 15
		inputValues.Mundus.HealthRegen = 238;		// Update 15
		inputValues.Mundus.MovementSpeed = 0.05;
		inputValues.Mundus.MovementSpeed = 0.10;	// Update 21/22?
		AddEsoStatValueHistory("Mundus", "HealthRegen", inputValues.Mundus.HealthRegen);
		AddEsoStatValueHistory("Mundus", "MovementSpeed", inputValues.Mundus.MovementSpeed);
		AddEsoInputStatSource("Mundus.HealthRegen",   { mundus: mundusName, value: inputValues.Mundus.HealthRegen });
		AddEsoInputStatSource("Mundus.MovementSpeed", { mundus: mundusName, value: inputValues.Mundus.MovementSpeed });
		
		if (divines > 0)
		{
			var extraRegen = Math.floor(inputValues.Mundus.HealthRegen    * divines);
			var extraMove  = Math.floor(inputValues.Mundus.MovementSpeed * 1000 * divines)/1000;
			inputValues.Mundus.HealthRegen += extraRegen;
			inputValues.Mundus.MovementSpeed += extraMove;
			
			AddEsoStatValueHistory("Mundus", "HealthRegen", extraRegen);
			AddEsoStatValueHistory("Mundus", "MovementSpeed", extraMove);
			
			AddEsoInputStatSource("Mundus.HealthRegen", { source: mundusName + " Divines bonus", value: extraRegen });
			AddEsoInputStatSource("Mundus.MovementSpeed", { source: mundusName + " Divines bonus", value: extraMove });
		}
	}

}


window.GetEsoInputCPValues = function (inputValues)
{
	inputValues.CP.Enabled = true;
	if (!$("#esotbEnableCP").prop("checked")) inputValues.CP.Enabled = false;
	AddEsoInputStatSource("CP.Enabled", { source: "Character State", value: inputValues.CP.Enabled });
		
	inputValues.CP.TotalPoints = parseInt($("#esotbCPTotalPoints").val());
	
	inputValues.CPLevel = Math.floor(inputValues.CP.TotalPoints/10);
	if (inputValues.CPLevel > ESO_MAX_CPLEVEL) inputValues.CPLevel = ESO_MAX_CPLEVEL;
	
	if (inputValues.Level == 50)
		inputValues.EffectiveLevel = inputValues.Level + inputValues.CPLevel;
	else
		inputValues.EffectiveLevel = inputValues.Level;
		
	if (inputValues.EffectiveLevel > ESO_MAX_EFFECTIVELEVEL) inputValues.EffectiveLevel = ESO_MAX_EFFECTIVELEVEL;
	
	if (!inputValues.CP.Enabled) 
	{
		// if (inputValues.EffectiveLevel > 50) inputValues.EffectiveLevel = 50;
		return;
	}
	
	if (g_EsoCpData.attribute1 == null) 
	{
		inputValues.CP.Health = 0;
		inputValues.CP.Magicka = 0;
		inputValues.CP.Stamina = 0;
		inputValues.CP.UsedPoints = g_EsoCpData.totalPoints;
	}
	else
	{
		inputValues.CP.Health = g_EsoCpData.attribute1.points;
		inputValues.CP.Magicka = g_EsoCpData.attribute2.points;
		inputValues.CP.Stamina = g_EsoCpData.attribute3.points;
		inputValues.CP.UsedPoints = inputValues.CP.Health + inputValues.CP.Magicka + inputValues.CP.Stamina;
	}
		
		/* Tower (1) */
	ParseEsoCPValue(inputValues, "BashCost", 58899, null, null, -1);
	ParseEsoCPValue(inputValues, "SprintCost", 64077, null, null, -1);
	// ParseEsoCPValue(inputValues, "MagickaCost", 63861, null, null, -1); //
	// Pre Update 14
	// ParseEsoCPValue(inputValues, "StaminaCost", 63862, null, null, -1); //
	// Pre Update 14
	ParseEsoCPValue(inputValues, "TargetRecovery", 92425, null, null, -1);
	ParseEsoCPValue(inputValues, "BreakFreeCost", 92431, null, null, -1);
	ParseEsoCPValue(inputValues, "InspirationGained", 60494, "the_tower", 30);
		
		/* Lord (2) */
	if (inputValues.ArmorHeavy >= 5) ParseEsoCPValue(inputValues, "PhysicalResist", 60624);
	ParseEsoCPValue(inputValues, "DamageShield", 59948);
	ParseEsoCPValue(inputValues, ["HADamageTaken", "LADamageTaken"], 59953, null, null, -1);
	ParseEsoCPValue(inputValues, "HealingReceived", 63851);
	
		/* Lady (3) */
	if (inputValues.ArmorLight >= 5) ParseEsoCPValue(inputValues, "PhysicalResist", 60502);
	ParseEsoCPValue(inputValues, "DotDamageTaken", 63850, null, null, -1);
	ParseEsoCPValue(inputValues, ["PhysicalDamageTaken", "PoisonDamageTaken", "DiseaseDamageTaken"], 63844, null, null, -1);
	ParseEsoCPValue(inputValues, ["MagicDamageTaken", "FlameDamageTaken", "FrostDamageTaken", "ShockDamageTaken"], 63843, null, null, -1);
	
	var itemData = g_EsoBuildItemData.OffHand1;
	var weaponData = g_EsoBuildItemData.MainHand1;
	var slotId = "OffHand1";
	
	if (g_EsoBuildActiveWeapon == 1)
	{
		if (weaponData.weaponType == 13)
		{
			itemData = weaponData;
			slotId = "MainHand1";
		}
	}
	else if (g_EsoBuildActiveWeapon == 2) 
	{
		itemData = g_EsoBuildItemData.OffHand2;
		weaponData = g_EsoBuildItemData.MainHand2;
		slotId = "OffHand2";
		
		if (weaponData.weaponType == 13)
		{
			itemData = weaponData;
			slotId = "MainHand2";
		}
	}
	
	if ((itemData.weaponType == 13 || itemData.weaponType == 14) && g_EsoCpData['Bulwark'] != null && g_EsoCpData['Bulwark'].isUnlocked)
	{
		var extraBonus = 1900;
		
		var matchResult = g_EsoCpData['Bulwark'].description.match(/by ([0-9]+)/);
		if (matchResult && !isNaN(matchResult[1])) extraBonus = parseInt(matchResult[1]);
		
		inputValues.Item.SpellResist += extraBonus;
		inputValues.Item.PhysicalResist += extraBonus;
		
		AddEsoStatValueHistory("Item", "SpellResist", extraBonus);
		AddEsoStatValueHistory("Item", "PhysicalResist", extraBonus);
		
		AddEsoInputStatSource("Item.SpellResist", { cp: "Bulwark", abilityId: g_EsoCpData['Bulwark'].id, value: extraBonus });
		AddEsoInputStatSource("Item.PhysicalResist", { cp: "Bulwark", abilityId: g_EsoCpData['Bulwark'].id, value: extraBonus });
		
		AddEsoItemRawOutputString(itemData, "SpellResist from Bulwark", extraBonus);
		AddEsoItemRawOutputString(itemData, "PhysicalResist from Bulwark", extraBonus);
	}
	
	if (inputValues.Weapon1H >= 1 || inputValues.Weapon2H >= 1) 
	{
		inputValues.CP.HAActiveDamage = inputValues.CP.HAWeaponDamage;
		inputValues.CP.LAActiveDamage = inputValues.CP.LAWeaponDamage;
	}
	else if (inputValues.WeaponBow >= 1) 
	{
		inputValues.CP.HAActiveDamage = inputValues.CP.HABowDamage;
		inputValues.CP.LAActiveDamage = inputValues.CP.LABowDamage;
	}
	else if (inputValues.WeaponRestStaff >= 1 || inputValues.WeaponDestStaff >= 1) 
	{
		inputValues.CP.HAActiveDamage = inputValues.CP.HAStaffDamage;
		inputValues.CP.LAActiveDamage = inputValues.CP.LAStaffDamage;
	}
	else
	{
		inputValues.CP.HAActiveDamage = 0;
		inputValues.CP.LAActiveDamage = 0;
	}
	
		/* CP2 parsing */
		// ParseEsoCP2Value = function (inputValues, statIds, abilityId, statFactor, category, statValue)
		// ParseEsoCP2Value(inputValues, "FishQuality", 142234);
	ParseEsoCP2Value(inputValues, "Magicka", 141744, null, "Item");
	ParseEsoCP2Value(inputValues, "BashDamage", 142091);
	ParseEsoCP2Value(inputValues, "MartialStatusEffectChance", 149276);
	ParseEsoCP2Value(inputValues, "AOEDamageDone", 141997);
	ParseEsoCP2Value(inputValues, "HealingDone", 149439);
		// Restore 300 Stamina per stage, whenever you kill an enemy. Current value
	ParseEsoCP2Value(inputValues, "Health", 142034, null, "Item");
	ParseEsoCP2Value(inputValues, "FallDamageTaken", 142205, -1.0);
		// Bulwark: Handled manually elsewhere
	ParseEsoCP2Value(inputValues, "SingleTargetDamageDone", 141999);
	ParseEsoCP2Value(inputValues, "BreakFreeCost", 149624, -1.0, "Skill2");
	ParseEsoCP2Value(inputValues, "SingleTargetDamageTaken", 151749, -1.0);
	ParseEsoCP2Value(inputValues, "Magicka", 149305, null, "Item");
	ParseEsoCP2Value(inputValues, ["FrostDamageTaken", "MagicDamageTaken", "ShockDamageTaken", "FlameDamageTaken"], 149273, -1.0);
	ParseEsoCP2Value(inputValues, "Stamina", 141773, null, "Item");
	ParseEsoCP2Value(inputValues, "DotDamageTaken", 151750, -1.0);
		// Your next Roll Dodge is free of cost. After consuming this effect, you cannot gain it again for 30 seconds.
		// Escaping from a Guard wipes 25% of your current Heat, but not Bounty.
	ParseEsoCP2Value(inputValues, ["CritDamage", "CritHealing"], 141899);
	ParseEsoCP2Value(inputValues, "MagicalStatusEffectChance", 149275);
	ParseEsoCP2Value(inputValues, "SneakSpeed", 142203);	// How does this work?
	ParseEsoCP2Value(inputValues, "SingleTargetHealingDone", 142000);
	ParseEsoCP2Value(inputValues, "BlockMitigation", 142086);
	ParseEsoCP2Value(inputValues, "GoldGained", 142207);
		// Removes 1000 gold from your bounty once per day when committing a crime where bounty is added. You must be level 50 for this passive to activate, and your current bounty must be at or greater than 1000 gold.
	ParseEsoCP2Value(inputValues, "MountSpeed", 149286);
	ParseEsoCP2Value(inputValues, "MerchantSellCost", 142210);
	ParseEsoCP2Value(inputValues, "BreakFreeDuration", 142099);
	ParseEsoCP2Value(inputValues, ["PhysicalDamageTaken", "DiseaseDamageTaken", "PoisonDamageTaken", "BleedDamageTaken"], 149274, -1.0);
	ParseEsoCP2Value(inputValues, "SprintSpeed", 142083);
	ParseEsoCP2Value(inputValues, "Health", 149311, null, "Item");
		// ParseEsoCP2Value(inputValues, "FenceSellCost", 142215);
	ParseEsoCP2Value(inputValues, "InspirationGained", 142208);
	ParseEsoCP2Value(inputValues, ["SpellResist", "PhysicalResist"], 142035);
		// When you take damage below 20% Health you gain Major Heroism, granting 3 Ultimate every 1.5 seconds for 9 seconds. This effect can occur once every 9 seconds
		// Whenever you use a potion or poison you have a 10% chance to not consume it.
	ParseEsoCP2Value(inputValues, "HarvestSpeed", 142217);
		// Improves the chances of extracting Woodworking ingredients and allows the refining of more powerful resins from raw materials
	ParseEsoCP2Value(inputValues, ["Poison", "Physical", "Disease", "Bleed"], 141930, null, "SkillBonusWeaponDmg", 100);
	ParseEsoCP2Value(inputValues, ["Poison", "Physical", "Disease", "Bleed"], 141930, null, "SkillBonusSpellDmg", 100);
	ParseEsoCP2Value(inputValues, "StatusEffectDurationTaken", 142096, -1.0);
	ParseEsoCP2Value(inputValues, "BlockSpeed", 142088);
	ParseEsoCP2Value(inputValues, "SneakRange", 142204, -1.0);
	ParseEsoCP2Value(inputValues, ["SpellPenetration", "PhysicalPenetration"], 141895);
	ParseEsoCP2Value(inputValues, "SneakDetectRange", 142089);
	ParseEsoCP2Value(inputValues, ["SpellCrit", "WeaponCrit"], 141898);
	ParseEsoCP2Value(inputValues, "DoubleHarvestChance", 142220);
		// ParseEsoCP2Value(inputValues, "NonPlayerDamageTaken", 141901, -1.0); //Handled by toggle
	ParseEsoCP2Value(inputValues, "RepairArmorCost", 142121, -1.0);
	ParseEsoCP2Value(inputValues, "HealingTaken", 141929);
	ParseEsoCP2Value(inputValues, ["FoodDuration", "DrinkDuration"], 142230);
	ParseEsoCP2Value(inputValues, ["HealthRegen", "MagickaRegen", "StaminaRegen"], 142074, null, "Item");
		// When you deal Direct Damage you heal for 7% of the damage done.
		// When you begin Bracing, you gain a damage shield that absorbs 5140 damage for 3 seconds. This effect can occur once every 10 seconds.
	ParseEsoCP2Value(inputValues, ["HealingSpellDamage", "HealingWeaponDamage"], 141942);
		// When you block an attack from an enemy within 7 meters, you deal 4800 Physical Damage back to the attacker. This effect can occur once every 5 seconds
	ParseEsoCP2Value(inputValues, "CritResist", 141900);
	ParseEsoCP2Value(inputValues, "SprintCost", 142115, -1.0, "Skill2");
	ParseEsoCP2Value(inputValues, "BashCost", 142081, -1.0, "Item");
	ParseEsoCP2Value(inputValues, "DamageShieldCost", 149283, -1.0);
		// Restore 300 Magicka per stage, whenever you kill an enemy. 
	ParseEsoCP2Value(inputValues, "AOEHealingDone", 141998);
		// When you resurrect yourself or another player you have a 33% chance to not consume a Soul Gem.
	ParseEsoCP2Value(inputValues, "ResurrectSpeed", 142100, null, null, 0.33);
	ParseEsoCP2Value(inputValues, "SprintCost", 142079, -1.0, "Skill2");
		// Your Weapon Enchants decay 20% slower per stage. Current bonus: 0%
		//ParseEsoCP2Value(inputValues, "NonCombatSpeed", 142125);	// Now a toggle
	ParseEsoCP2Value(inputValues, "SneakCost", 142123, -1.0);
	ParseEsoCP2Value(inputValues, "DotHealingDone", 142002);
		// Return to life after resurrection with 10% more resources per stage. Current bonus: 0%
	ParseEsoCP2Value(inputValues, "DotDamageDone", 142001);
	ParseEsoCP2Value(inputValues, "Stamina", 147888, null, "Item");
	ParseEsoCP2Value(inputValues, "BlockCost", 142080, -1.0, "Item");
	ParseEsoCP2Value(inputValues, "RollDodgeCost", 142077, -1.0, "Skill2");
	ParseEsoCP2Value(inputValues, "AOEDamageTaken", 151748, -1.0);
	ParseEsoCP2Value(inputValues, ["WeaponDamage", "SpellDamage"], 146960);
	ParseEsoCP2Value(inputValues, "WayshrineCost", 142206, -1.0);
	ParseEsoCP2Value(inputValues, ["Magic", "Frost", "Flame", "Shock"], 141931, null, "SkillBonusWeaponDmg", 100);
	ParseEsoCP2Value(inputValues, ["Magic", "Frost", "Flame", "Shock"], 141931, null, "SkillBonusSpellDmg", 100);
		// Improves your mastery with mounts, removing all mount Stamina costs outside of combat
	ParseEsoCP2Value(inputValues, ["Magic", "Frost", "Flame", "Shock", "Poison", "Physical", "Disease", "Bleed"], 141941, null, "SkillBonusWeaponDmg");
	ParseEsoCP2Value(inputValues, ["Magic", "Frost", "Flame", "Shock", "Poison", "Physical", "Disease", "Bleed"], 141941, null, "SkillBonusSpellDmg");
	ParseEsoCP2Value(inputValues, "DamageShield", 142090);
	
		/* Update 30 CPs */
	ParseEsoCP2Value(inputValues, "DirectDamageDone", 92134);
	ParseEsoCP2Value(inputValues, ["LADamage", "HADamage"], 155859);
	
		/* Update 31 CPs */
	ParseEsoCP2Value(inputValues, "DirectDamageTaken", 159972, -1.0);
	ParseEsoCP2Value(inputValues, "MovementSpeed", 160044);
	ParseEsoCP2Value(inputValues, "BlockMitigation", 160162);
	ParseEsoCP2Value(inputValues, "MovementSpeed", 160162, 1, null, "-0.16");
	
	UpdateEsoBuildToggledCpData();
	
	for (var id in g_EsoCpData) 
	{
		var cpData = g_EsoCpData[id];
		
		if (cpData.type != "skill") continue;
		if (isNaN(id)) continue;
		
		GetEsoInputCpToggleValues(inputValues, cpData);
	}
	
}


window.GetEsoInputCpToggleValues = function (inputValues, cpData, isManual)
{
	var desc = cpData.description;
	
	if (desc == null || desc == "") return;
	if (cpData.isUnlocked !== true) return;
	
	for (var i = 0; i < ESO_CPEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_CPEFFECT_MATCHES[i];
		if (!matchData.toggle) continue;
		if (matchData.onlyManual === true && !isManual) continue;
		
		var toggleData = g_EsoBuildToggledCpData[cpData.name];
		if (toggleData == null) continue;
		
		if (!(toggleData.enabled || toggleData.combatEnabled)) continue;
		
		var matchResult = desc.match(matchData.match);
		if (!matchResult) continue;
		
		var statValue = 1;
		if (!isNaN(matchResult[1])) statValue = parseFloat(matchResult[1]);
		
		if (matchData.maxTimes != null)
		{
			var toggleData = g_EsoBuildToggledCpData[matchData.id];
			if (toggleData != null && toggleData.count != null) statValue = statValue * toggleData.count;
		}
		
		if (matchData.display == "%") statValue = statValue/100;
		if (matchData.factorValue != null) statValue = statValue * matchData.factorValue;
		if (matchData.round == "floor") statValue = Math.floor(statValue);
		
		var category = matchData.category || "CP";
		
		if (inputValues[category][matchData.statId] == null) inputValues[category][matchData.statId] = 0;
		
		if (matchData.combineAs == "*%")
			inputValues[category][matchData.statId] = CombineEsoValuesMult(inputValues[category][matchData.statId], statValue);
		else
			inputValues[category][matchData.statId] += statValue;
		
		AddEsoStatValueHistory(category, matchData.statId, statValue);
		AddEsoItemRawOutput(cpData, category + "." + matchData.statId, statValue);
		AddEsoInputStatSource(category + "." + matchData.statId, { cp: cpData.name, abilityId: cpData.id, value: statValue });
	}
	
}


window.ConvertEsoFlatCritToPercent = function (flatCrit, inputValues)
{
	var effectiveLevel = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) effectiveLevel = parseInt(inputValues.EffectiveLevel);

	var result = flatCrit / (2 * effectiveLevel * (100 + effectiveLevel));
	return Math.round(result * 1000) / 10;
}


window.ConvertEsoPercentCritToFlat = function (percentCrit, inputValues)
{
	var effectiveLevel = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) effectiveLevel = parseInt(inputValues.EffectiveLevel);

	var result = percentCrit * 2 * effectiveLevel * (100 + effectiveLevel);
	return Math.round(result);
}


window.ParseEsoCPValue = function (inputValues, statIds, abilityId, discId, unlockLevel, statFactor, category)
{
	var cpDesc = $("#descskill_" + abilityId);
	if (cpDesc.length == 0) return false;
	
	if (category == null) category = "CP";

	var cpName = cpDesc.prev().text();
	
	var text = RemoveEsoDescriptionFormats(cpDesc.text());
	var results = text.match(/by ([0-9]+\.?[0-9]*\%?)/);
	if (results.length == 0) return false;
	
	if (discId != null && unlockLevel != null)
	{
		var discPoints = parseInt($("#skills_" + discId).find(".esovcpDiscTitlePoints").text());
		if (discPoints < unlockLevel) return false;
	}
	
	var value = parseFloat(results[1]);
	var lastChar = results[1].slice(-1);
	
	if (lastChar == "%") 
	{
		value = Math.floor(value); // Jump points
		value = value/100;
	}
	
	if (statFactor != null) value *= statFactor;

	if (typeof(statIds) == "object")
	{
		for (var i = 0; i < statIds.length; ++i)
		{
			inputValues[category][statIds[i]] += value;
			AddEsoStatValueHistory(category, statIds[i], value);
			AddEsoInputStatSource(category + "." + statIds[i], { cp: cpName, abilityId: abilityId, value: value });
		}
	}
	else
	{
		inputValues[category][statIds] += value;
		AddEsoStatValueHistory(category, statIds, value);
		AddEsoInputStatSource(category + "." + statIds, { cp: cpName, abilityId: abilityId, value: value });
	}
	
	return true;
}


window.ParseEsoCP2Value = function (inputValues, statIds, abilityId, statFactor, category, statValue)
{
	var $skill = $("#skill_" + abilityId);
	var cpDesc = $("#descskill_" + abilityId);
	if ($skill.length == 0 || cpDesc.length == 0) return false;
	
	var isUnlocked = $skill.attr("unlocked");
	if (isUnlocked <= 0) return false;
	
	if (category == null) category = "CP";
	
	var cpName = cpDesc.prev().text();
	var value = 1;
	
	if (statValue == null)
	{
		var text = RemoveEsoDescriptionFormats(cpDesc.text());
		var results = text.match(/Current (?:bonus|value)(?::|) ([0-9]+\.?[0-9]*\%?)/i);
		if (results == null || results.length == 0) return false;
		
		var value = parseFloat(results[1]);
		var lastChar = results[1].slice(-1);
		
		if (lastChar == "%") 
		{
			value = Math.floor(value);
			value = value/100;
		}
	}
	else
	{
		value = statValue;
	}
	
	if (statFactor != null) value *= statFactor;
	
	if (typeof(statIds) == "object")
	{
		for (var i = 0; i < statIds.length; ++i)
		{
			inputValues[category][statIds[i]] += value;
			AddEsoStatValueHistory(category, statIds[i], value);
			AddEsoInputStatSource(category + "." + statIds[i], { cp: cpName, abilityId: abilityId, value: value });
		}
	}
	else
	{
		inputValues[category][statIds] += value;
		AddEsoStatValueHistory(category, statIds, value);
		AddEsoInputStatSource(category + "." + statIds, { cp: cpName, abilityId: abilityId, value: value });
	}
	
	return true;
}


window.AddEsoInputStatSource = function (statId, data)
{
	if (g_EsoInputStatSources[statId] == null) g_EsoInputStatSources[statId] = [];
	
	data.origStatId = statId;
	g_EsoInputStatSources[statId].push(data);
	
	var statIds = statId.split(".");
	
	if (statIds.length > 1)
	{
		var firstStatId = statIds.shift();
		var newStatId = statIds.join(".");
		var replaceId = ESOBUILD_RAWOUTPUT_LABELREPLACEMENT[statId];
		var suffix = ESOBUILD_RAWOUTPUT_LABELSUFFIX[firstStatId];
		
		if (replaceId != null) 
		{
			newStatId = replaceId;
		}		
		else if (suffix != null)
		{
			newStatId += suffix; 
		}
				
		if (g_EsoInputStatSources[newStatId] == null) g_EsoInputStatSources[newStatId] = [];
		g_EsoInputStatSources[newStatId].push(data);
	}
}


window.UpdateEsoComputedStatsList = function (realUpdate)
{
	if (!g_EsoBuildEnableUpdates) return;
	
	if (realUpdate === true)
	{
		g_EsoBuildRebuildStatFlag = false;
		UpdateEsoComputedStatsList_Real();
		return;
	}
	else if (realUpdate == "async")
	{
		g_EsoBuildRebuildStatFlag = false;
		setTimeout(UpdateEsoComputedStatsList_Real, 100);
		return;
	}
	
	g_EsoBuildRebuildStatFlag = true;
	g_EsoBuildLastUpdateRequest = (new Date().getTime())/1000;
	
	setTimeout(CheckEsoComputeStatUpdate, ESO_BUILD_UPDATE_MINTIME*501);
}


window.CheckEsoComputeStatUpdate = function ()
{
	if (!g_EsoBuildRebuildStatFlag) return;
	
	var currentTime = (new Date().getTime())/1000;
	
	if (currentTime - g_EsoBuildLastUpdateRequest > ESO_BUILD_UPDATE_MINTIME)
	{
		g_EsoBuildRebuildStatFlag = false;
		UpdateEsoComputedStatsList_Real();
	}
	else
	{
		setTimeout(CheckEsoComputeStatUpdate, ESO_BUILD_UPDATE_MINTIME*501);
	}
}


window.g_EsoProfileData = {};


window.EsoProfileStart = function(name)
{
	var newProfile = {};
	
	newProfile.name = name;
	newProfile.startTime = Date.now();
	newProfile.lastTime = newProfile.startTime;
	newProfile.times = [];
	newProfile.endTime = -1;
	
	g_EsoProfileData[name] = newProfile;
	
	return newProfile;
}


window.EsoProfile = function(name, msg)
{
	var profile = g_EsoProfileData[name];
	var newData = {};
	
	if (profile == null) profile = EsoProfileStart(name);
	
	newData.time = Date.now();
	newData.msg = msg;
	if (newData.msg == null) newData.msg = "";
	
	var diffTime1 = newData.time - profile.startTime;
	var diffTime2 = newData.time - profile.lastTime;
	
	profile.times.push(newData);
	profile.lastTime = newData.time;
	
	EsoBuildLog("" + diffTime2 + "ms (" + diffTime1 + "ms): " + name + " - " + newData.msg + "");
}


window.EsoProfileEnd = function(name)
{
	var profile = g_EsoProfileData[name];
	if (profile == null) return;
	
	EsoProfile(name, "End");
	
	profile.endTime = Date.now();
}


window.UpdateEsoComputedStatsList_Real = function (keepSaveResults, noUpdate)
{
	EsoProfileStart('UpdateEsoComputedStatsList_Real');
	
	g_EsoBuildRebuildStatFlag = false;
	if (keepSaveResults !== true) SetEsoBuildSaveResults("");
	
	var inputValues = GetEsoInputValues();
	var deferredStats = [];
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'GetEsoInputValues');
	
	UpdateEsoBuildSkillInputValues(inputValues);
	EsoProfile('UpdateEsoComputedStatsList_Real', 'UpdateEsoBuildSkillInputValues');
		
	for (var statId in g_EsoComputedStats)
	{
		var depends = g_EsoComputedStats[statId].depends;
		
		if (depends != null)
			deferredStats.push(statId);
		else
			UpdateEsoComputedStat(statId, g_EsoComputedStats[statId], inputValues);
	}
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'UpdateEsoComputedStat');
	
	UpdateEsoComputedStatsSpecial(inputValues);
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'UpdateEsoComputedStatsSpecial');
	
	for (var j = 0; j <= 10; ++j)
	{
		for (var name in g_EsoComputedStats)
		{
			inputValues[name] = g_EsoComputedStats[name].value;
		}
		
		for (var i = 0; i < deferredStats.length; ++i)
		{
			var statId = deferredStats[i];
			var deferLevel = g_EsoComputedStats[statId].deferLevel;
			if (deferLevel == null) deferLevel = 0;
			
			if (deferLevel == j) UpdateEsoComputedStat(statId, g_EsoComputedStats[statId], inputValues);
		}
	}
	
		// Recompute
	UpdateEsoComputedStatsSpecial(inputValues);
	UpdateEsoCp2SpecialDescriptions(inputValues);
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'UpdateEsoComputedStat - Deferred');
	
	for (var name in g_EsoComputedStats)
	{
		inputValues[name] = g_EsoComputedStats[name].value;
	}
	
	UpdateEsoBuildSkillInputValues(inputValues);
	UpdateEsoBuildRawInputOtherEffects();
	UpdateEsoBuildSetOtherEffectDesc();
	UpdateEsoAllEnchantWeaponValues(inputValues);
	EsoBuildUpdateAllSetAverageDesc();
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Misc1');
	
	if (noUpdate === true) {
		EsoProfileEnd('UpdateEsoComputedStatsList_Real');
		return;
	}
	
	DisplayEsoAllComputedStats(inputValues);
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Display Stats');
	
	UpdateEsoReadOnlyStats(inputValues);
	UpdateEsoBuildMundusList2();
	UpdateEsoBuildSetInfo();
	UpdateEsoBuildToggleSets();
	UpdateEsoBuildToggleCp();	
	UpdateEsoBuildToggleSkills();
	UpdateEsoBuildItemLinkSetCounts();
	UpdateEsoMitigation();
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Misc2');
	
	UpdateEsoBuildVisibleBuffs();
	UpdateEsoBuffSkillEnabled();
	UpdateEsoBuffBuffEnabled();
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Buffs');
	
	UpdateEsoAllSkillCost(false);
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Skills');
	
	if (window.EsoBuildCombatFixActionData != null) EsoBuildCombatFixActionData();
	
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Fix Combat Data');
	
	UpdateEsoBuildCurrentTab();
	EsoProfile('UpdateEsoComputedStatsList_Real', 'Update Current Tab');
	
	EsoProfileEnd('UpdateEsoComputedStatsList_Real');
}


window.UpdateEsoComputedStatsSpecial = function (inputValues)
{
	var pelinalSetCount = 0;
	var pelinalSetName = "";
	
	if (g_EsoBuildSetData["Pelinal's Aptitude"] != null) 
	{
		pelinalSetName = "Pelinal's Aptitude";
		pelinalSetCount = g_EsoBuildSetData["Pelinal's Aptitude"].count;
	}
	
	if (pelinalSetCount >= 5)
	{
		var weaponDamage = g_EsoComputedStats.WeaponDamage.value;
		var spellDamage = g_EsoComputedStats.SpellDamage.value;
		var setBonusCount = g_EsoBuildSetData[pelinalSetName].count;
		
		if (weaponDamage > spellDamage)
		{
			g_EsoComputedStats.SpellDamage.value = weaponDamage;
			
			AddEsoItemRawOutputString(g_EsoBuildSetData[pelinalSetName], "OtherEffects", "Set Spell Damage to Weapon Damage");
			AddEsoInputStatSource("OtherEffects", { set: g_EsoBuildSetData[pelinalSetName], setBonusCount: setBonusCount, value: "Set Spell Damage to Weapon Damage" });
		}
		else
		{
			g_EsoComputedStats.WeaponDamage.value = spellDamage;
			
			AddEsoItemRawOutputString(g_EsoBuildSetData[pelinalSetName], "OtherEffects", "Set Weapon Damage to Spell Damage");
			AddEsoInputStatSource("OtherEffects", { set: g_EsoBuildSetData[pelinalSetName],  setBonusCount: setBonusCount, value: "Set Weapon Damage to Spell Damage" });
		}
		
		DisplayEsoComputedStat("WeaponDamage");
		DisplayEsoComputedStat("SpellDamage");
	}
	
}


window.UpdateEsoReadOnlyStats = function (inputValues)
{
	if (inputValues == null) return;
	
	$("#esotbEffectiveLevel").text(inputValues.EffectiveLevel);
}


window.UpdateEsoComputedStat = function (statId, stat, inputValues, saveResult, updateDisplay)
{
	if (typeof(stat) == "string") return false;
	
	var stack = [];
	var error = "";
	var computeIndex = 0;
	var round = stat.round;
	
	if (saveResult == null) saveResult = true;
	if (inputValues == null) return false;
	
	var element = $("#esoidStat_" + statId);
	if (element.length == 0) return false;
	
	var valueElement = element.children(".esotbStatValue");
	var computeElements = element.find(".esotbStatComputeValue");
	
	for (var i = 0; i < stat.compute.length; ++i)
	{
		var computeItem = stat.compute[i];
		var nextItem = stat.compute[i+1];
		var itemValue = 0;
		
		if (computeItem == "*")
		{
			if (stack.length >= 2)
				stack.push(stack.pop() * stack.pop());
			else
				error = "ERR";
			
			if (round == "floor") 
				stack.push(Math.floor(stack.pop()));
			else if (round == "round")
				stack.push(Math.round(stack.pop()));
			else if (round == "ceil")
				stack.push(Math.ceil(stack.pop()));
			else if (round == "floor2")
				stack.push(Math.floor(stack.pop()*2)/2);
			else if (round == "floor10")
				stack.push(Math.floor(stack.pop()*10)/10);
			
			continue;
		}
		else if (computeItem == "+")
		{
			if (stack.length >= 2)
				stack.push(stack.pop() + stack.pop());
			else
				error = "ERR";
			
			continue;
		}
		else if (computeItem == "-")
		{
			if (stack.length >= 2)
				stack.push(-stack.pop() + stack.pop());
			else
				error = "ERR";
			
			continue;
		}
		
		with(inputValues)
		{
			try {
				itemValue = eval(computeItem); 
			} catch (e) {
			    itemValue = "ERR";
			}
			
			stack.push(itemValue);
		}
		
		var prefix = "";
		if (nextItem == "-") prefix = "-";
		if (nextItem == "+" && itemValue >= 0) prefix = "+";
		if (nextItem == "*") prefix = "x";
		
		if (!(itemValue % 1 === 0))
		{
			itemValue = Number(itemValue).toFixed(3);
		}
		
		if (saveResult === true)
		{
			$(computeElements[computeIndex]).text(prefix + itemValue);
		}
		
		++computeIndex;
	}
	
	if (stack.length <= 0) error = "ERR";
	
	if (error !== "")
	{
		if (saveResult === true)
		{
			inputValues[statId] = error;
			stat.value = error;
			DisplayEsoComputedStat(statId, inputValues);
		}
		
		return error;
	}
	
	var result = stack.pop();
	stat.preCapValue = result;
	
	if (stat.min != null && result < stat.min) result = stat.min;
	if (stat.max != null && result > stat.max) result = stat.max;
	
	if (saveResult !== true) return result;

	inputValues[statId] = result;
	stat.value = result;
	
	if (updateDisplay) DisplayEsoComputedStat(statId, inputValues);
	
	return result;
}


window.DisplayEsoAllComputedStats = function (inputValues)
{
	if (inputValues == null) inputValues = g_EsoBuildLastInputValues;

	for (var statId in g_EsoComputedStats)
	{
		var statData = g_EsoComputedStats[statId];
		if (typeof(statData) != "string") DisplayEsoComputedStat(statId, inputValues);
	}
	
}


window.DisplayEsoComputedStat = function (statId, inputValues)
{
	var stat = g_EsoComputedStats[statId];
	if (stat == null) return false;
	
	if (inputValues == null) inputValues = g_EsoBuildLastInputValues;
	
	var element = $("#esoidStat_" + statId);
	if (element.length == 0) return false;
	var valueElement = element.children(".esotbStatValue");
	
	var result = stat.value;
	var display = stat.display;
	var displayResult = result;
	var suffix = "";
	
	if (isNaN(result))
	{
		valueElement.text(result);
		return true;
	}
	
	if (stat.suffix != null) suffix = stat.suffix;
	
	if (display == "%")
	{
		displayResult = "" + (Math.round(result*1000)/10) + "%";
	}
	else if (display == "%2")
	{
		displayResult = "" + Math.round(result*100) + "%";
	}
	else if (display == "round1")
	{
		displayResult = "" + (Math.round(result*10)/10).toFixed(1);
	}
	else if (display == "round2")
	{
		displayResult = "" + (Math.round(result*100)/100).toFixed(2);
	}
	else if (display == "resist")
	{
		displayResult = "" + result + " (" + ConvertEsoFlatResistToPercent(result, inputValues) + "%)";
	}
	else if (display == "elementresist")
	{
		displayResult = "" + result + " (" + ConvertEsoElementResistToPercent(result, inputValues) + "%)";
	}
	else if (display == "critresist")
	{
		displayResult = "" + result + " (" + ConvertEsoCritResistToPercent(result, inputValues) + "%)";
	}
	
	valueElement.text(displayResult + suffix);
	return true;
}


window.ConvertEsoFlatResistToPercent = function (flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	flatResist = Math.min(33000, flatResist);
	flatResist = Math.max(0, flatResist);	
	
	var result = Math.max(0, (flatResist - 100)/(level*10));
	return Math.round(result);
}


window.ConvertEsoElementResistToPercent = function (flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	flatResist = Math.min(33000, flatResist);
	flatResist = Math.max(0, flatResist);
	
	var result = Math.max(0, flatResist/(level*10));
	return Math.round(result);
}


window.ConvertEsoCritResistToPercent = function (flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	var result = flatResist/level;
	return Math.round(result);
}


window.g_EsoBuildComputedStatParent = null;


window.CreateEsoComputedStats = function ()
{
	g_EsoBuildComputedStatParent = $("#esotbStatList");
	
	for (var statId in g_EsoComputedStats)
	{
		CreateEsoComputedStat(statId, g_EsoComputedStats[statId]);
	}
	
}


window.CreateEsoComputedStat = function (statId, stat)
{
	var element;
	
	if (typeof(stat) == "string")
	{
		if (stat == "EndSection")
		{
			g_EsoBuildComputedStatParent = $("#esotbStatList");
		}
		else if (stat == "StartSection")
		{
			var elementId = statId.replace(/[^a-zA-Z0-9_]+/g, "")
				
			$("<div/>").addClass("esotbStatSectionTitle").
					attr("statid", statId).
					appendTo("#esotbStatList").
					text(statId);
			
			g_EsoBuildComputedStatParent = $("<div/>").attr("id", "esoidStatSection_" + elementId).
					attr("statid", statId).
					addClass("esotbStatSection").
					appendTo("#esotbStatList");
		}
		
		return;
	}
	
	element = $("<div/>").attr("id", "esoidStat_" + statId).
		attr("statid", statId).
		addClass("esotbStatRow").
		appendTo(g_EsoBuildComputedStatParent);
	
	if (stat.addClass != null) element.addClass(stat.addClass);

	$("<div/>").addClass("esotbStatName").
		text(stat.title).
		appendTo(element);
		
	$("<div/>").addClass("esotbStatValue").
		text("?").
		appendTo(element);
	
	var warningStyle = "";
	var warningDisplay = "display: none;";
	
	if (stat.warning != null)
	{
		warningStyle = "esotbStatWarningButton";
		warningDisplay = "";
	}
	else if (stat.note != null) 
	{
		warningStyle = "esotbStatNoteButton";
		warningDisplay = "";
	}
	
	$("<div/>").addClass(warningStyle).
		html("?").
		attr("style", warningDisplay).
		appendTo(element);

	
	$("<div/>").addClass("esotbStatDetailsButton").
		html("...").
		appendTo(element);
	
	var computeElement = $("<div/>").addClass("esotbComputeItems").
										attr("style", "display: none;").
										appendTo(element);
		
	CreateEsoComputedStatItems(stat.compute, computeElement);
	
	return element;
}


window.CreateEsoComputedStatItems = function (computeData, parentElement)
{
	
	for (var i = 0; i < computeData.length; ++i)
	{
		var computeItem = computeData[i];
		var nextItem = computeData[i+1];
		
		if (computeItem == "*")
		{
		}
		else if (computeItem == "+")
		{
		}
		else if (computeItem == "-")
		{
		}
		else
		{
			var prefix = "";
			if (nextItem == "+") prefix = "+";
			if (nextItem == "-") prefix = "-";
			if (nextItem == "*") prefix = "x";
			
			$("<div/>").addClass("esotbStatComputeValue").
				text(prefix + "0").
				attr("computeindex", i).
				appendTo(parentElement);
			
			$("<div/>").addClass("esotbStatComputeItem").
				text(computeItem).
				attr("computeindex", i).
				appendTo(parentElement);
		}
	}
	
}


window.OnEsoInputChange = function (e)
{
	var id = $(this).attr("id");
	
	if (id == "esotbLevel") 
	{
		OnEsoLevelChange.call(this, e);
	}
	else if ($(this).hasClass("esotbAttributeInput"))
	{
		OnEsoAttributeChange.call(this, e);
	}
	
	UpdateEsoComputedStatsList();
}


window.OnEsoAttributeChange = function (e)
{
	var $this = $(this);
	var value = parseInt($this.val()) || 0;
	
	if (value > ESO_MAX_ATTRIBUTES) $this.val(ESO_MAX_ATTRIBUTES);
	if (value < 0) $this.val("0");
	
	var value1 = parseInt($("#esotbAttrHea").val()) || 0;
	var value2 = parseInt($("#esotbAttrMag").val()) || 0;
	var value3 = parseInt($("#esotbAttrSta").val()) || 0;
	var totalValue = value1 + value2 + value3;
	
	if (totalValue > ESO_MAX_ATTRIBUTES) 
	{
		$this.val(ESO_MAX_ATTRIBUTES - totalValue + value);
		totalValue = ESO_MAX_ATTRIBUTES;
	}
	
	$("#esotbAttrTotal").text(totalValue + " / " + ESO_MAX_ATTRIBUTES);
}


window.OnEsoLevelChange = function (e)
{
	var $this = $(this);
	var value = $this.val();
	
	if (value > 50) $this.val("50");
	if (value < 1)  $this.val("1");
}


window.OnEsoCPTotalPointsChange = function (e)
{
	var $this = $(this);
	var value = $this.val();
	
	if (value < 0) $this.val("0");
}


window.OnEsoClickStatRow = function (e)
{
	var computeItems = $(this).find(".esotbComputeItems");
	computeItems.slideToggle();
}


window.OnEsoClickStatWarningButton = function (e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	
	return false;
}


window.FixupEsoRacialSkills = function (raceName, abilityIds)
{
	for (var i = 0; i < abilityIds.length; ++i)
	{
		var abilityId = abilityIds[i];
		var skillData = g_SkillsData[abilityId];
		if (skillData == null) continue;
		
		skillData.skillTypeName = "Racial::" + raceName + " Skills";
		skillData.skillLine = raceName + " Skills";
		skillData.raceType = raceName;
	}
}


window.OnEsoRaceChange = function (e)
{
	var newRace = $(this).val();
	var autoPurchase = $("#esotbEnableRaceAutoPurchase").prop("checked");
	
	g_EsoBuildEnableUpdates = false;
	EnableEsoRaceSkills(newRace, autoPurchase);
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoComputedStatsList("async");
}


window.OnEsoClassChange = function (e)
{
	var newClass = $(this).val();
	
	g_EsoBuildEnableUpdates = false;
	EnableEsoClassSkills(newClass);
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoSkillBarDisplay();
		
	UpdateEsoComputedStatsList("async");
}


window.OnEsoVampireChange = function (e)
{
	if ($("#esotbVampireStage").val() > 0)
	{
		$("#esotbWerewolfStage").val("0");
	}
	
	g_EsoBuildEnableUpdates = false;
	UpdateEsoSkillGroupDisplay();
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoComputedStatsList("async");
}


window.OnEsoWerewolfChange = function (e)
{
	if ($("#esotbWerewolfStage").val() > 0)
	{
		$("#esotbVampireStage").val("0");
	}
	
	g_EsoBuildEnableUpdates = false;
	UpdateEsoSkillGroupDisplay();
	UpdateEsoSkillBarDisplay();
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoComputedStatsList("async");
}


window.OnEsoClickStealth = function (e)
{
	UpdateEsoComputedStatsList("async");
}


window.OnEsoClickCyrodiil = function (e)
{
	UpdateEsoComputedStatsList("async");
}


window.OnEsoUpdateStats = function (e)
{
	UpdateEsoComputedStatsList("async");
}


window.OnEsoUpdate21Click = function (e)
{
	// RemovePurchasedEsoRaceSkills();
	UpdateEsoComputedStatsList("async");
}


window.OnEsoUpdate22Click = function (e)
{
	// RemovePurchasedEsoRaceSkills();
	UpdateEsoComputedStatsList("async");
}


window.OnEsoMundusChange = function (e)
{
	var mundus1 = $("#esotbMundus").val();
	var mundus2 = $("#esotbMundus2").val();
	
	if (mundus1 == mundus2 && mundus1 != "")
	{
		$("#esotbMundus2").val("");
	}
	
	UpdateEsoComputedStatsList("async");
}


window.OnEsoClickItem = function (e)
{
	var $this = $(this);
	var id = $this.attr("id");
	
	SelectEsoItem($this);
}

window.OnEsoClickItemIcon = function (e)
{
	var $this = $(this).parent();
	var id = $this.attr("id");
	
	SelectEsoItem($this);
	
	e.stopPropagation();
}


window.UnequipEsoItemSlot = function (slotId, update)
{
	if (g_EsoBuildItemData[slotId] == null) return false;
	
	var element = $("#esotbItem" + slotId);
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	iconElement.attr("src", g_EsoGearIcons[slotId] || "");
	labelElement.text("");
	iconElement.attr("itemid", "");
	iconElement.attr("intlevel", "");
	iconElement.attr("inttype", "");
	iconElement.attr("setcount", "");
	iconElement.attr("enchantfactor", "");
	iconElement.attr("weapontraitfactor", "");
	iconElement.attr("extraarmor", "");
	iconElement.attr("trait", "");
	
	UpdateEsoItemTraitList(slotId, 0);
		
	g_EsoBuildItemData[slotId] = {};
	
	UnequipEsoEnchantSlot(slotId, false);
	
	if (update == null || update === true) UpdateEsoComputedStatsList("async");
	return true;
}


window.UnequipEsoEnchantSlot = function (slotId, update)
{
	if (g_EsoBuildEnchantData[slotId] == null) return false;
	
	var element = $("#esotbItem" + slotId);
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	iconElement.attr("enchantid", "0");
	iconElement.attr("enchantintlevel", "0");
	iconElement.attr("enchantinttype", "0");

	g_EsoBuildEnchantData[slotId] = {};
	
	if (update == null || update === true) UpdateEsoComputedStatsList("async");
	return true;
}


window.OnEsoSelectItem = function (itemData, element)
{
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if ($.isEmptyObject(itemData))
	{
		UnequipEsoItemSlot(slotId, true);
		return;
	}
	
	var iconName = itemData.icon.replace(".dds", ".png");
	var iconUrl = ESO_ICON_URL + iconName;
	var niceName = itemData.name.charAt(0).toUpperCase() + itemData.name.slice(1);
	
	if (iconName == "" || iconName == "/") iconUrl = "";
	
	iconElement.attr("src", iconUrl);
	labelElement.text(niceName);
	
	iconElement.attr("itemid", itemData.itemId);
	iconElement.attr("intlevel", itemData.internalLevel);
	iconElement.attr("inttype", itemData.internalSubtype);
	iconElement.attr("setcount", "0");
	iconElement.attr("enchantfactor", "");
	iconElement.attr("weapontraitfactor", "");
	iconElement.attr("extraarmor", "0");
	iconElement.attr("trait", "0");
	
	// UpdateEsoItemTraitList(slotId, 0);
	UpdateWeaponEquipSlots(itemData, slotId);
	
	g_EsoBuildItemData[slotId] = itemData;
	
	RequestEsoItemData(itemData, element);
}


window.UpdateWeaponEquipSlots = function (itemData, slotId)
{
	
	if (itemData.equipType == 6)
	{
		if (slotId == "MainHand1") UnequipEsoItemSlot("OffHand1", false);
		if (slotId == "MainHand2") UnequipEsoItemSlot("OffHand2", false);
	}
	else if (slotId == "OffHand1")
	{
		if (g_EsoBuildItemData["MainHand1"].equipType == 6) UnequipEsoItemSlot("MainHand1", false);
		if (g_EsoBuildEnchantData["OffHand1"].type == 21 && itemData.weaponType != 14) UnequipEsoEnchantSlot("OffHand1", false);
		if (g_EsoBuildEnchantData["OffHand1"].type == 20 && itemData.weaponType == 14) UnequipEsoEnchantSlot("OffHand1", false);
	}
	else if (slotId == "OffHand2")
	{
		if (g_EsoBuildItemData["MainHand2"].equipType == 6) UnequipEsoItemSlot("MainHand2", false);
		if (g_EsoBuildEnchantData["OffHand2"].type == 21 && itemData.weaponType != 14) UnequipEsoEnchantSlot("OffHand2", false);
		if (g_EsoBuildEnchantData["OffHand2"].type == 20 && itemData.weaponType == 14) UnequipEsoEnchantSlot("OffHand2", false);
	}
	
}


window.GetEsoIntDataFromLevelQuality = function (level, quality, equipType)
{
	level = parseInt(level);
	quality = parseInt(quality)
	var result = { type: 1, level: level };
	var typeMap = ESO_ITEMQUALITYLEVEL_INTTYPEMAP;
	
		/* Special case for mythic items */
	if (quality == 6) {
		result.level = 1;
		result.type = 1;
		return result;
	}
	
	if (result.level > 50) result.level = 50;
	if (result.level <  1) result.level = 1;
	
	if (equipType == 12 || equipType == 2) typeMap = ESO_ITEMQUALITYLEVEL_INTTYPEMAP_JEWELRY;
	
	for (var l in typeMap)
	{
		var levelData = typeMap[l];
		
		if (level <= l)
		{
			if (levelData[quality] == null) return result;
			result.type = levelData[quality];
			break;
		}
	}
	
	if (result.level == null || result.level <= 0) return null;
	if (result.type  == null || result.type   < 0) return null;
	
	return result;
}


window.GetEsoIntTypeFromLevelQuality = function (level, quality, equipType)
{
	level = parseInt(level);
	quality = parseInt(quality);
	var typeMap = ESO_ITEMQUALITYLEVEL_INTTYPEMAP;
	var returnType = null;
	
	if (equipType == 2 || equipType == 12) typeMap = ESO_ITEMQUALITYLEVEL_INTTYPEMAP_JEWELRY;
	
	for (var l in typeMap)
	{
		var levelData = typeMap[l];
		
		if (level <= l)
		{
			if (levelData[quality] == null) return returnType;
			returnType = levelData[quality];
			break;
		}
	}
	
	return returnType;
}


window.RequestEsoChangeItemLevelData = function (itemData, level, slotId, msgElement)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	if (slotId == null || slotId == "") return false;
	
	var newIntData = GetEsoIntDataFromLevelQuality(level, itemData.quality, itemData.equipType);
	if (newIntData == null) return false;
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = level;
	tempItemData.quality = itemData.quality;
	tempItemData.internalLevel = newIntData.level;
	tempItemData.internalSubtype = newIntData.type;
	
	iconElement.attr("intlevel", newIntData.level);
	iconElement.attr("inttype", newIntData.type);
	
	RequestEsoItemData(tempItemData, element);
	
	return true;
}


window.RequestEsoChangeEnchantLevelData = function (itemData, level, slotId, msgElement)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	if (slotId == null || slotId == "") return false;
	
	var newIntData = GetEsoIntDataFromLevelQuality(level, itemData.quality, itemData.equipType);
	if (newIntData == null) return false;
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = level;
	tempItemData.quality = itemData.quality;
	tempItemData.internalLevel = newIntData.level;
	tempItemData.internalSubtype = newIntData.type;
	
	iconElement.attr("enchantintlevel", newIntData.level);
	iconElement.attr("enchantinttype", newIntData.type);
	
	RequestEsoEnchantData(tempItemData, element);
	
	return true;
}


window.RequestEsoChangeItemQualityData = function (itemData, quality, slotId, msgElement)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	if (slotId == null || slotId == "") return false;
	
	var newIntType = GetEsoIntTypeFromLevelQuality(itemData.level, quality, itemData.equipType);
	if (newIntType == null) return false;
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = itemData.level;
	tempItemData.quality = quality;
	tempItemData.internalLevel = itemData.internalLevel;
	tempItemData.internalSubtype = newIntType;
	
	iconElement.attr("intlevel", itemData.internalLevel);
	iconElement.attr("inttype", newIntType);
	
	RequestEsoItemData(tempItemData, element);
	
	return true;
}


window.RequestEsoChangeEnchantQualityData = function (itemData, quality, slotId, msgElement)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	if (slotId == null || slotId == "") return false;
	
	var newIntType = GetEsoIntTypeFromLevelQuality(itemData.level, quality, itemData.equipType);
	if (newIntType == null) return false;
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = itemData.level;
	tempItemData.quality = quality;
	tempItemData.internalLevel = itemData.internalLevel;
	tempItemData.internalSubtype = newIntType;
	
	iconElement.attr("enchantintlevel", itemData.internalLevel);
	iconElement.attr("enchantinttype", newIntType);
	
	RequestEsoEnchantData(tempItemData, element);
	
	return true;
}


window.RequestEsoChangeArmorTypeData = function (itemData, armorType, slotId)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	
	var queryParams = {
			"text" : itemData.setName,
			"set" : itemData.setName,
			"equiptype" : itemData.equipType,
			"type" : itemData.type,
			"weapontype" : itemData.weaponType,
			"armortype" : armorType,
			"quality" : itemData.quality,
			"level" : itemData.level,
			"intlevel" : itemData.internalLevel,
			"inttype" : itemData.internalSubtype,
			"trait" : itemData.trait,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;

	$.ajax("//esolog.uesp.net/esoItemSearchPopup.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoRequestChangeArmorTypeReceive(data, status, xhr, slotId, itemData, armorType); }).
		fail(function(xhr, status, errorMsg) { OnEsoChangeArmorTypeError(xhr, status, errorMsg, armorType, slotId); });
	
	return true;
}


window.RequestEsoFindSetItemData = function (slotId, monsterSet, equipType, armorType, weaponType, level, quality, trait, msgElement, onNoItemsFoundCallback)
{
	var queryParams = {
			"text" : monsterSet,
			"set" : monsterSet,
			"armortype" : armorType,
			"equiptype" : equipType,
			"weapontype" : weaponType,
			"quality" : quality,
			"level" : level,
			"trait" : trait,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;

	$.ajax("//esolog.uesp.net/esoItemSearchPopup.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoRequestFindSetItemReceive(data, status, xhr, slotId, monsterSet, equipType, armorType, weaponType, level, quality, trait, msgElement, onNoItemsFoundCallback); }).
		fail(function(xhr, status, errorMsg) { OnEsoFindSetItemError(xhr, status, errorMsg, monsterSet, armorType, msgElement); });
	
	return true;
}


window.OnEsoChangeArmorTypeError = function (xhr, status, errorMsg, armorType, slotId)
{
	var text = $("#esotbItemSetupArmorTypeMsg").text();
	$("#esotbItemSetupArmorTypeMsg").text(text + " No " + slotId + " item found! ")
}


window.OnEsoFindSetItemError = function (xhr, status, errorMsg, monsterSet, armorType, msgElement)
{
	var text = msgElement.text();
	msgElement.text(text + " No " + monsterSet + " set with armor type " + armorType + " found! ")
}


window.RequestEsoChangeTraitData = function (itemData, newTrait, slotId, msgElement)
{
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	
	var queryParams = {
			"text" : itemData.name,
			"set" : itemData.setName,
			"equiptype" : itemData.equipType,
			"type" : itemData.type,
			"weapontype" : itemData.weaponType,
			"armortype" : itemData.armorType,
			"quality" : itemData.quality,
			"level" : itemData.level,
			"intlevel" : itemData.internalLevel,
			"inttype" : itemData.internalSubtype,
			"trait" : newTrait,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;

	$.ajax("//esolog.uesp.net/esoItemSearchPopup.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoRequestChangeTraitReceive(data, status, xhr, slotId, itemData, newTrait, msgElement); }).
		fail(function(xhr, status, errorMsg) { OnEsoRequestChangeTraitError(xhr, status, errorMsg, slotId, newTrait, msgElement); });
	
	return true;
}


window.OnEsoRequestChangeTraitError = function (xhr, status, errorMsg, slotId, newTrait, msgElement)
{
	var text = $(msgElement).text();
	$(msgElement).text(text + " No " + slotId + " item found! ")
}


window.OnEsoRequestChangeTraitReceive = function (data, status, xhr, slotId, origItemData, newTrait, msgElement)
{
	if (slotId == null || slotId == "") return false;
	
	// EsoBuildLog("OnEsoRequestChangeTraitReceive", slotId, data.length, data);
	
	var text = $(msgElement).text();
	var itemData = data[0];
	
	if (itemData == null || itemData.itemId == null) 
	{
		$(msgElement).text(text + " No " + slotId + " item found! ")
		return false;
	}
	
	var tempItemData = {};
	var element = $(".esotbItem[slotid='" + slotId + "']");
	var iconElement = element.find(".esotbItemIcon");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = origItemData.level;
	tempItemData.quality = origItemData.quality;
	tempItemData.internalLevel = origItemData.internalLevel;
	tempItemData.internalSubtype = origItemData.internalSubtype;
	
	iconElement.attr("itemid", itemData.itemId);
	iconElement.attr("trait", "0");
	
	UpdateEsoItemTraitList(slotId, newTrait);
	
	RequestEsoItemData(tempItemData, element);	
}


window.OnEsoRequestChangeArmorTypeReceive = function (data, status, xhr, slotId, origItemData, armorType)
{
	if (slotId == null || slotId == "") return false;
	
	// EsoBuildLog("OnEsoRequestChangeArmorTypeReceive", slotId, data.length,
	// data);
	
	var itemData = data[0];
	var text = $("#esotbItemSetupArmorTypeMsg").text();
	
	if (itemData == null || itemData.itemId == null) 
	{
		$("#esotbItemSetupArmorTypeMsg").text(text + " No " + slotId + " item found! ")
		return false;
	}
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	var labelElement = element.find(".esotbItemLabel");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = origItemData.level;
	tempItemData.quality = origItemData.quality;
	tempItemData.internalLevel = origItemData.internalLevel;
	tempItemData.internalSubtype = origItemData.internalSubtype;
	
	iconElement.attr("itemid", itemData.itemId);
	labelElement.text(itemData.name);
	
	RequestEsoItemData(tempItemData, element);	
}


window.OnEsoRequestFindSetItemReceive = function (data, status, xhr, slotId, monsterSet, equipType, armorType, weaponType, level, quality, trait, msgElement, onNoItemsFoundCallback)
{
	if (slotId == null || slotId == "") return false;
	
	// EsoBuildLog("OnEsoRequestFindSetItemReceive", slotId, data.length, data);
	
	var itemData = data[0];
	var text = msgElement.text();
	
	if (itemData == null || itemData.itemId == null)
	{
		if (onNoItemsFoundCallback)
		{
			return onNoItemsFoundCallback(slotId, monsterSet, equipType, armorType, weaponType, level, quality, trait, msgElement);
		}
		
		msgElement.text(text + " No " + slotId + " item found! ");
		return false;
	}
	
	var tempItemData = {};
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	var labelElement = element.find(".esotbItemLabel");
	
	tempItemData.itemId = itemData.itemId;
	tempItemData.level = level;
	tempItemData.quality = quality;
	
	var result = GetEsoIntDataFromLevelQuality(level, quality, equipType);
	
	if (result)
	{
		tempItemData.internalLevel = result.level;
		tempItemData.internalSubtype = result.type;
	}
	else 
	{
		tempItemData.internalLevel = 1;
		tempItemData.internalSubtype = 1;
	}
	
	var iconName = itemData.icon.replace(".dds", ".png");
	var iconUrl = ESO_ICON_URL + iconName;
	var niceName = itemData.name.charAt(0).toUpperCase() + itemData.name.slice(1);
	
	if (iconName == "" || iconName == "/") iconUrl = "";
	
	iconElement.attr("src", iconUrl);
	labelElement.text(niceName);
	
	iconElement.attr("itemid", itemData.itemId);
	iconElement.attr("intlevel", tempItemData.internalLevel);
	iconElement.attr("inttype", tempItemData.internalSubtype);
	iconElement.attr("setcount", "0");
	iconElement.attr("enchantfactor", "0");
	iconElement.attr("weapontraitfactor", "0");
	iconElement.attr("extraarmor", "0");
	iconElement.attr("trait", "0");
	
	UpdateEsoItemTraitList(slotId, trait);
	
	RequestEsoItemData(tempItemData, element);
}


window.RequestEsoItemData = function (itemData, element)
{	
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	
	var queryParams = {
			"table" : "minedItem",
			"id" : itemData.itemId,
			"intlevel" : itemData.internalLevel,
			"inttype" : itemData.internalSubtype,
			"limit" : 1,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
	
	if (itemData.type == 4 || itemData.type == 12)
	{
		// queryParams.intlevel = null;
		// queryParams.inttype = null;
		// queryParams.level = null;
		// queryParams.quality = null;
	}
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoItemDataReceive(data, status, xhr, element, itemData); }).
		fail(function(xhr, status, errorMsg) { OnEsoItemDataError(xhr, status, errorMsg); });
}


window.OnEsoItemDataReceive = function (data, status, xhr, element, origItemData)
{
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if (data.minedItem == null || data.minedItem[0] == null) 
	{
		if (origItemData.internalLevel != 1 && origItemData.internalSubtype != 1)
		{
			var newItemData = jQuery.extend({}, origItemData);
			
			newItemData.internalLevel = 1;
			newItemData.internalSubtype = 1;
			
			RequestEsoItemData(newItemData, element);
		}
		
		return false;
	}
	
	g_EsoBuildItemData[slotId] = data.minedItem[0];
	
	g_EsoBuildItemData[slotId].transmuteTrait = 0;
	g_EsoBuildItemData[slotId].origTrait = g_EsoBuildItemData[slotId].trait; 
	g_EsoBuildItemData[slotId].origTraitDesc = g_EsoBuildItemData[slotId].traitDesc;
	
	UpdateEsoItemTraitList(slotId, g_EsoBuildItemData[slotId].trait);
	
	UpdateEsoComputedStatsList(false);
	
	GetEsoSetMaxData(g_EsoBuildItemData[slotId]);
}


window.GetEsoSetMaxData = function (itemData)
{
	if (itemData == null) return;
	
	var setName = itemData.setName;
	if (setName == null || setName == "") return;
	
	if (g_EsoBuildSetMaxData[setName] != null) return;
	
	var queryParams = {
			"table" : "minedItem",
			"id" : itemData.itemId,
			"intlevel" : 50,
			"inttype" : 370,
			"limit" : 1,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoSetMaxDataReceive(data, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoItemDataError(xhr, status, errorMsg); });
}


window.OnEsoSetMaxDataReceive = function (data, status, xhr)
{
	if (data.minedItem != null && data.minedItem[0] != null)
	{
		var itemData = data.minedItem[0];
		g_EsoBuildSetMaxData[itemData.setName] = itemData;
		
		var setData = {};
		setData.parsedNumbers = [];
		setData.averageNumbers = [];
		setData.averageDesc = [];
		
		g_EsoBuildSetMaxData[itemData.setName].setData = setData;
		
		ComputeEsoBuildSetDataItem(setData, itemData);
	}
}


window.OnEsoItemDataError = function (xhr, status, errorMsg)
{
}


window.SelectEsoItem = function (element)
{
	var equipType = element.attr("equiptype");
	var itemType = element.attr("itemtype");
	var weaponType = element.attr("weapontype");
	
	var data = {
		onSelectItem: OnEsoSelectItem,
		itemType: itemType,
		xoffset: -190,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) data.version = g_EsoBuildPtsVersion;
	
	if (equipType  != null) data.equipType  = equipType;
	if (weaponType != null) data.weaponType = weaponType;
	
	var rootSearchPopup = UESP.showEsoItemSearchPopup(element, data);
	ShowEsoBuildClickWall(rootSearchPopup);
}


window.ShowEsoBuildClickWall = function (parentElement)
{
	$(".eso_item_link_popup").hide();
	$("#esotbClickWall").show();
	g_EsoBuildClickWallLinkElement = parentElement;
}


window.HideEsoBuildClickWall = function ()
{
	$("#esotbClickWall").hide();
	
	if (g_EsoBuildClickWallLinkElement != null)
	{
		g_EsoBuildClickWallLinkElement.hide();
		g_EsoBuildClickWallLinkElement = null;
	}
}


window.OnEsoClickBuildWall = function (e)
{
	HideEsoBuildClickWall();
}


window.OnEsoClickComputeItems = function (e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	return false;
}


window.OnEsoClickStatDetails = function (e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	return false;
}



window.ConvertEsoFormulaToPrefix = function (computeItems)
{
	var equation = "";
	var stack = [];
	var lastOperator = "";
	
	for (var key in computeItems)
	{
		var computeItem = computeItems[key];
		var operator = "";
		
		if (computeItem == "*" || computeItem == "+" || computeItem == "-")
		{
			operator = computeItem;
		}
		else
		{
			stack.push(computeItem);
			continue;
		}
		
		if (stack.length < 2)
		{
			equation += " ERR ";
			continue;
		}
		
		var op1 = stack.pop();
		var op2 = stack.pop();
		
		if (operator == "*")
		{
			if (lastOperator == "*")
				stack.push("" + op2 + "" + operator + "(" + op1 + ")");
			else
				stack.push("(" + op2 + ")" + operator + "(" + op1 + ")");
		}
		else
		{
			stack.push("" + op2 + " " + operator + " " + op1 + "");
		}
		
		lastOperator = operator;
	}
	
	if (stack.length != 1) return "ERR";
	return stack.pop();
}


window.OnEsoFormulaInputChange = function (e)
{
	var statId = $(this).attr("statid");
	if (statId == null || statId == "") return;
	
	var display = $(this).attr("display") || "";
	var value = $(this).val();
	if (value === "") value = 0;
	if (display == "%") value = parseFloat(value)/100.0;
	
	SetEsoInputValue(statId, value, g_EsoFormulaInputValues);
	
	var computeStatId = $("#esotbFormulaPopup").attr("statid");
	if (computeStatId == null || computeStatId == "") return;
	
	var stat = g_EsoComputedStats[computeStatId];
	if (stat == null) return;
	
	var newValue = UpdateEsoComputedStat(computeStatId, stat, g_EsoFormulaInputValues, false, true);
	
	display = stat.display;
	var suffix = "";
	if (stat.suffix != null) suffix = stat.suffix;
	var result = newValue;
	var displayResult = result;
	
	if (display == "%")
	{
		displayResult = "" + (Math.round(result*1000)/10);
		suffix = "%";
	}
	else if (display == "%2")
	{
		displayResult = "" + Math.round(result*100);
		suffix = "%";
	}
	else if (display == "resist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoFlatResistToPercent(result) + "%)";
	}
	else if (display == "elementresist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoElementResistToPercent(result) + "%)";
	}
	else if (display == "critresist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoCritResistToPercent(result) + "%)";
	}
	
	$("#esotbFormInputInputResult").val(displayResult);
	$("#esotbFormInputResultSuffix").text(suffix);
	$("#esotbFormInputResultCapValue").text();
	
	if (stat.preCapValue != newValue)
	{
		var preCapValue = stat.preCapValue;
		suffix = "";
		
		if (display == "%")
		{
			displayResult = "" + (Math.round(preCapValue*1000)/10);
			suffix = "%";
		}
		else if (display == "%2")
		{
			displayResult = "" + Math.round(preCapValue*100);
			suffix = "%";
		}
		else if (display == "resist")
		{
			displayResult = "" + preCapValue;
			suffix = " (" + ConvertEsoFlatResistToPercent(preCapValue) + "%)";
		}
		else if (display == "elementresist")
		{
			displayResult = "" + preCapValue;
			suffix = " (" + ConvertEsoElementResistToPercent(preCapValue) + "%)";
		}
		else if (display == "critresist")
		{
			displayResult = "" + preCapValue;
			suffix = " (" + ConvertEsoCritResistToPercent(preCapValue) + "%)";
		}
		
		$("#esotbFormInputResultCapValue").text("Before Cap = " + displayResult + " " + suffix);
	}
}


window.ShowEsoFormulaPopup = function (statId)
{
	var formulaPopup = $("#esotbFormulaPopup");
	var stat = g_EsoComputedStats[statId];
	if (stat == null) return false;

	var equation = ConvertEsoFormulaToPrefix(stat.compute);
	
	if (stat.warning != null)
		$("#esotbFormulaNote").html(stat.warning).show();
	else if (stat.note != null)
		$("#esotbFormulaNote").html(stat.note).show();
	else
		$("#esotbFormulaNote").html("").hide();
	
	$("#esotbFormulaTitle").text("Complete Formula for " + stat.title);
	$("#esotbFormulaName").text(statId + " = ");
	$("#esotbFormula").text(equation);
	formulaPopup.attr("statid", statId);
	$("#esotbFormulaInputs").html(MakeEsoFormulaInputs(statId));
	
	$("#esotbFormulaInputs").find(".esotbFormInputInput").on("input", OnEsoFormulaInputChange);
	
	formulaPopup.show();
	ShowEsoBuildClickWall(formulaPopup);
	
	return true;
}


window.MakeEsoFormulaInputs = function (statId)
{
	var output = "";
	var stat = g_EsoComputedStats[statId];
	if (stat == null) return "";
	
	var FUNCTIONS = { "floor" : 1, "round" : 1, "ceil" : 1, "pow" : 1, "min" : 1, "max" : 1, "fround" : 1 };
	
	//var inputValues = GetEsoInputValues(true);
	var inputValues = g_EsoBuildLastInputValues;
	var inputNames = {};
	
	g_EsoFormulaInputValues = {};
	jQuery.extend(true, g_EsoFormulaInputValues, inputValues);
	//g_EsoFormulaInputValues = inputValues;
	
	for (var i = 0; i < stat.compute.length; ++i)
	{
		var computeItem = stat.compute[i];
		var variables = computeItem.match(/[a-zA-Z]+[a-zA-Z_0-9\.]*/g);
		if (variables == null) continue;
		
		for (var j = 0; j < variables.length; ++j)
		{
			var name = variables[j];
			
			if (FUNCTIONS[name] != null) continue;
			
			if (inputNames[name] == null) inputNames[name] = 0;
			++inputNames[name];
		}
	}
	
	for (var name in inputNames)
	{	
		var value = GetEsoInputValue(name, inputValues);
		var statDetails = g_EsoInputStatDetails[name] || {};
		var extraAttr = "";
		var suffixText = "";
		
		if (statDetails.display == '%')
		{
			extraAttr = "display='%' ";	
			suffixText = '%';
			value = Math.round(value*1000)/10;
		}
		else if (statDetails.display == "flatcrit")
		{
			suffixText = " = " + ConvertEsoFlatCritToPercent(value) + "%";
		}
			
		output += "<div class='esotbFormulaInput'>";
		output += "<div class='esotbFormInputName'>" + name + "</div>";
		output += "<input type='text' class='esotbFormInputInput' statid='" + name + "' value='" + value + "' size='5' " + extraAttr + "> ";
		output += suffixText;
		output += "</div>";
	}
	
	var displayResult = stat.value;
	var result = stat.value;
	var suffix = "";
	var display = stat.display;
	if (stat.suffix != null) suffix = stat.suffix;
	
	if (display == "%")
	{
		displayResult = "" + (Math.round(result*1000)/10);
		suffix = "%";
	}
	else if (display == "%2")
	{
		displayResult = "" + Math.round(result*100);
		suffix = "%";
	}
	else if (display == "resist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoFlatResistToPercent(result, inputValues) + "%)";
	}
	else if (display == "elementresist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoElementResistToPercent(result, inputValues) + "%)";
	}
	else if (display == "critresist")
	{
		displayResult = "" + result;
		suffix = " (" + ConvertEsoCritResistToPercent(result, inputValues) + "%)";
	}
	
	output += "<div class='esotbFormulaInput'>";
	output += "<div class='esotbFormInputResult'>" + stat.title + "</div>";
	output += "<input type='text' class='esotbFormInputInputResult' id='esotbFormInputInputResult' statid='" + stat.title + "' value='" + displayResult + "' size='5' readonly='readonly'>";
	output += "<div id='esotbFormInputResultSuffix'>" + suffix + "</div>";
	output += "<div id='esotbFormInputResultCapValue'></div>";
	output += "</div>";
	
	return output;
}


window.SetEsoInputValue = function (name, value, inputValues)
{
	var ids = name.split(".");
	var data = inputValues;
	var newData = {};
	var lastId = "";
	
	for (var i = 0; i < ids.length; ++i)
	{
		lastId = ids[i];
		newData = data[ids[i]];
		if (newData == null) return false;
		
		if (typeof(newData) != "object") break;
		data = newData;
	}
	
	if (typeof(newData) == "object") return false;
	data[lastId] = parseFloat(value);	
	return true;
}


window.GetEsoInputValue = function (name, inputValues)
{
	var ids = name.split(".");
	var data = inputValues;
	var newData = {};
	
	for (var i = 0; i < ids.length; ++i)
	{
		newData = data[ids[i]];
		if (newData == null) break;
		
		if (typeof(newData) != "object") break;
		data = newData;
	}
	
	if (typeof(newData) != "object") return newData;
	return 0;
}


window.CloseEsoFormulaPopup = function ()
{
	$("#esotbFormulaPopup").hide();
	HideEsoBuildClickWall();
}


window.UpdateEsoBuildCurrentTab = function()
{
	var selectedTab = $("#esotbStatTabList").find(".esotbStatTabSelected");
	var tabId = selectedTab.attr("tabid");
	
	if (tabId == "esotbStatBlockRawData")
	{
		UpdateEsoBuildRawInputs();
	}
	else if (tabId == "esotbStatBlockSkills")
	{
		//UpdateEsoBuildSkillTab();
	}
}


window.OnEsoClickBuildStatTab = function (e)
{
	var tabId = $(this).attr("tabid");
	if (tabId == null || tabId == "") return;
	
	$("#esotbStatTabList").find(".esotbStatTabSelected").removeClass("esotbStatTabSelected");
	$(this).addClass("esotbStatTabSelected");
	
	$("#esotbStatInputs").children(".esotbStatBlock:visible").hide();
	$("#" + tabId).show();
	
	if (tabId == "esotbStatBlockRawData")
	{
		UpdateEsoBuildRawInputs();
	}
	else if (tabId == "esotbStatBlockSkills")
	{
		UpdateEsoBuildSkillTab();
	}
	
}


window.UpdateEsoBuildSkillTab = function (e)
{
	UpdateEsoAllSkillCost(false);
	
	var visibleBlock = $("#esovsSkillContent").find(".esovsSkillContentBlock:visible");
	
	if (visibleBlock.length == 0) {
		var firstVisibleSkillType = $("#esovsSkillContent").find(".esovsSkillType:visible").first();
		if (firstVisibleSkillType.length == 0) return;
		
		var firstSkillLine = firstVisibleSkillType.children(".esovsSkillLineTitle").first();
		if (firstSkillLine.length == 0) return;
		
		var skillTypeId = firstVisibleSkillType.attr("skilltypeid");
		var skillLineId = firstSkillLine.attr("skilllineid");
		SelectEsoSkillLine(skillTypeId, skillLineId);
	}
}


window.OnEsoBuildCpUpdate = function (e)
{
	UpdateEsoComputedStatsList();
}


window.OnEsoItemSearchPopupClose = function (e)
{
	HideEsoBuildClickWall();
}


window.OnEsoSkillDetailsClick = function (e)
{
	var skillId = $(this).parent().attr("skillid");
	if (skillId == null || skillId == "") return;
	
		/* Check for destruction elemental specific skills */
	if (g_EsoSkillDestructionData && g_EsoSkillDestructionData[skillId] != null && g_EsoSkillDestructionElement != "")
	{
		var newSkillId = g_EsoSkillDestructionData[skillId][g_EsoSkillDestructionElement];
		if (newSkillId) skillId = newSkillId;
	}
	
	ShowEsoSkillDetailsPopup(skillId);
	
	e.preventDefault();
	e.stopPropagation();
	return false;
}


window.OnEsoItemDetailsClick = function (e)
{
	var slotId = $(this).parent().attr("slotId");
	if (slotId == null || slotId == "") return;
	
	ShowEsoItemDetailsPopup(slotId);
}


window.MakeEsoBuildItemLink = function (slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null) return "";
	
	var itemLink = itemData.link;
	if (itemLink == null) return "";
	
	var enchantData = g_EsoBuildEnchantData[slotId];
	
	if (enchantData != null && enchantData.itemId != null && !enchantData.isDefaultEnchant) 
	{
		itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:[0-9]+:[0-9]+:)/, "$1" + enchantData.itemId + "$3");
		itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:[0-9]+:)/, "$1" + enchantData.internalSubtype + "$3");
		itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:)/, "$1" + enchantData.internalLevel + "$3");
	}
	
	if (itemData.trait != itemData.origTrait)
	{
		itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:)/, "$1" + itemData.trait + "$3");
	}
		
	return itemLink;
}


window.ShowEsoSkillDetailsPopup = function (abilityId)
{
	var detailsPopup = $("#esotbItemDetailsPopup");
	
	var skillData = g_SkillsData[abilityId];
	if (skillData == null) return false;
	var displayId = skillData['displayId'];
	
	GetEsoSkillCost(abilityId, null);
	GetEsoSkillDuration(abilityId, null);
	GetEsoSkillDescription(abilityId, null, false);	
	
	var detailsHtml = "";
	
	for (var key in skillData.rawOutput)
	{
		var statDetails = g_EsoInputStatDetails[key] || {};
		var value = skillData.rawOutput[key];
		var suffix = "";
		
			// Ignore tooltip raw output for new tooltip system
		if (USE_V2_TOOLTIPS && key.toLowerCase().indexOf("tooltip") >= 0) continue;
		
		if (typeof(value) == "object")
		{
			var abilityData = value.abilityData;
			var rawInputMatch = value.rawInputMatch;
			var desc = value.value;
			
			if (abilityData != null && abilityData.lastDesc != null)
			{
				value = abilityData.lastDesc;
			}
			else if (abilityData != null && abilityData.description != null)
				value = abilityData.lastDesc;
			else if (desc != null)
				value = desc;
			else
				value = "Unknown Skill Data";
			
			if (rawInputMatch != null)
			{
				var rawInputMatches = value.match(rawInputMatch);
				if (rawInputMatches != null) value = rawInputMatches[1];
			}
		}
		else if (statDetails.display == '%')
		{
			suffix = "%";
			value = (value * 100).toFixed(1);
		}
		else if (statDetails.display == "flatcrit")
		{
			value = ConvertEsoFlatCritToPercent(value);
			suffix = "%";
		}
		
		detailsHtml += key + " = " + value + suffix + "<br/>";
	}
	
	if (USE_V2_TOOLTIPS && window.CreateEsoSkillCoefContentForIndexHtml)
	{
		var numTooltips = CountEsoSkillTooltips(abilityId);
		
		detailsHtml += "<h4>Skill Coefficients</h4>";
		detailsHtml += "<div class='esotbSkillDetailsCoef'>";
		
		var skillDesc = ConvertEsoSkillRawDescToHtml(skillData.rawDescription);
		detailsHtml += "<div class='esotbSkillDetailsDesc'>" + skillDesc + "</div>";
		
		for (var tooltipIndex = 1; tooltipIndex <= numTooltips; ++tooltipIndex)
		{
			detailsHtml += CreateEsoSkillCoefContentForIndexHtml(skillData, tooltipIndex, true);
		}
		
		detailsHtml += "</div>";
	}
	else if (skillData.numCoefVars > 0)
	{
		detailsHtml += "<br/><h4>Skill Coefficients</h4>";
		detailsHtml += "<div class='esotbSkillDetailsCoef'>"
			
		for (var i = 1; i < 1 + +skillData.numCoefVars; ++i)
		{
			detailsHtml += GetEsoSkillCoefDataHtml(skillData, i);
		}
		
		var skillDesc = EsoConvertDescToHTMLClass(skillData.coefDescription, 'esovsBold');
		detailsHtml += "<div class='esotbSkillDetailsDesc'>" + skillDesc + "</div></div>";
	}
	
	detailsHtml += "<h4>Raw Ability Data</h4>";
	detailsHtml += "<div class='esotbSkillDetailsOther'>";
	detailsHtml += "abilityId = " + displayId + "<br/>";
	detailsHtml += "skillType = " + skillData.skillTypeName.split("::")[0] + "<br/>";
	detailsHtml += "skillLine = " + skillData.skillLine + "<br/>";
	detailsHtml += "type = " + skillData.type + "<br/>";
	detailsHtml += "rank = " + skillData.rank + "<br/>";
	detailsHtml += "learnedLevel = " + skillData.learnedLevel + "<br/>";
	detailsHtml += "target = " + skillData.target + "<br/>";
	detailsHtml += "maxCost = " + skillData.cost + "<br/>";
	detailsHtml += "mechanic = " + skillData.mechanic + "<br/>";
	detailsHtml += "internalId = " + skillData.abilityId + "<br/>";
	detailsHtml += "</div>";
	detailsHtml += "<div class='esotbSkillDetailsOther'>";
	detailsHtml += "duration = " + skillData.duration + "<br/>";
	detailsHtml += "startDelay = " + skillData.startTime + "<br/>";
	detailsHtml += "tickLength = " + skillData.tickTime + "<br/>";
	detailsHtml += "minRange = " + skillData.minRange + "<br/>";
	detailsHtml += "maxRange = " + skillData.maxRange + "<br/>";
	detailsHtml += "radius = " + skillData.radius + "<br/>";
	detailsHtml += "castTime = " + skillData.castTime + "<br/>";
	detailsHtml += "channelTime = " + skillData.channelTime + "<br/>";
	detailsHtml += "angleDistance = " + skillData.angleDistance + "<br/>";
	detailsHtml += "</div>";
	
	$("#esotbItemDetailsTitle").text("Details for Ability " + skillData.name);
	$("#esotbItemDetailsText").html(detailsHtml);
	
	detailsPopup.show();
	ShowEsoBuildClickWall(detailsPopup);
	
	return true;
}


window.UpdateEsoItemDetails = function (slotId, itemData)
{
	UpdateEsoBuildTooltip(null, null, slotId);
}


window.ShowEsoItemDetailsPopup = function (slotId)
{
	var detailsPopup = $("#esotbItemDetailsPopup");
	
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null) return false;
	if (itemData.rawOutput == null) return false;
	
	UpdateEsoItemDetails(slotId, itemData);
	
	var detailsHtml = "";
	
	detailsHtml += "Item Link = " + MakeEsoBuildItemLink(slotId) + "<br/>"; 
	
	for (var key in itemData.rawOutput)
	{
		var statDetails = g_EsoInputStatDetails[key] || {};
		var value = itemData.rawOutput[key];
		var suffix = "";
		
		if (statDetails.display == '%') 
		{
			suffix = "%";
			value = Math.round(value * 1000)/10;
		}
		else if (statDetails.display == "flatcrit")
		{
			value = ConvertEsoFlatCritToPercent(value);
			suffix = "%";
		}
		
		detailsHtml += key + " = " + value + suffix + "<br/>";
	}
	
	if (itemData.setName && USE_V2_TOOLTIPS && window.CreateEsoSkillCoefContentForIndexHtml && window.g_SetSkillsData)
	{
		var setName = itemData.setName.toLowerCase().replace("perfected ", "");
		var setSkillData = g_SetSkillsData[setName];
		
		var setDesc = "PART OF THE " + itemData.setName.toUpperCase() + " SET<br />";
		
		for (i = 1; i <= 12; ++i)
		{
			var setBonusDesc = itemData['setBonusDesc' + i];
			
			if (setBonusDesc != null && setBonusDesc != '')
			{
				setBonusDesc = setBonusDesc.replaceAll("|cffffff", "").replaceAll("|r", "");
				setBonusDesc = setBonusDesc.replaceAll("\n", "<br />");
				setDesc += setBonusDesc + "<br />";
			}
		}
		
		var newDesc = UpdateEsoBuildSetTooltips(setDesc);
		
		if (setSkillData)
		{
			//UpdateEsoBuildSetTooltips(setDesc);
			
			var abilityId = parseInt(setSkillData.abilityId);
			var numTooltips = CountEsoSkillTooltips(abilityId);
			var skillData = g_SkillsData[abilityId];
			
			if (skillData && numTooltips > 0)
			{
				detailsHtml += "<h4>Set Tooltip Coefficients</h4>";
				detailsHtml += "<div class='esotbSkillDetailsCoef'>";
				
				var skillDesc = ConvertEsoSkillRawDescToHtml(skillData.rawDescription);
				detailsHtml += "<div class='esotbSkillDetailsDesc'>" + skillDesc + "</div>";
				
				for (var tooltipIndex = 1; tooltipIndex <= numTooltips; ++tooltipIndex)
				{
					detailsHtml += CreateEsoSkillCoefContentForIndexHtml(skillData, tooltipIndex, true);
				}
				
				detailsHtml += "</div>";
			}
		}
	}
	
	$("#esotbItemDetailsTitle").text("Item Details for " + slotId);
	$("#esotbItemDetailsText").html(detailsHtml);
	
	detailsPopup.show();
	ShowEsoBuildClickWall(detailsPopup);
	
	return true;
}


window.CloseEsoItemDetailsPopup = function ()
{
	$("#esotbItemDetailsPopup").hide();
	HideEsoBuildClickWall();
}


window.OnEsoItemEnchantClick = function (e)
{
	var parent = $(this).parent();
	
	SelectEsoItemEnchant(parent);
}


window.OnEsoItemDisableClick = function (e)
{
	var parent = $(this).parent();
	var slotId = parent.attr("slotId");
	var itemData = g_EsoBuildItemData[slotId];
	
	parent.toggleClass("esotbItemDisabled");
	
	if (itemData != null)
	{
		itemData.enabled = !parent.hasClass("esotbItemDisabled");
	}

	UpdateEsoComputedStatsList(true);
}


window.SelectEsoItemEnchant = function (element)
{
	var slotId = element.attr("slotid");
	if (slotId == null || slotId == "") return false;
	
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || $.isEmptyObject(itemData)) return false;
	
	var equipType = element.attr("equiptype");
	var itemType = element.attr("itemtype");
	var enchantType = 0;
	
	if (itemType == 1) // Weapon
	{
		if (itemData.weaponType == 14)
			enchantType = 21;
		else
			enchantType = 20;
	}
	else if (itemType == 2) // Armor
	{
		if (equipType == 2 || equipType == 12)
			enchantType = 26;
		else
			enchantType = 21;
	}

	if (enchantType == 0) return false;
	
	var data = {
		onSelectItem: OnEsoSelectItemEnchant,
		itemType: enchantType,
		xoffset: -190,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) data.version = g_EsoBuildPtsVersion;
	
	var rootSearchPopup = UESP.showEsoItemSearchPopup(element, data);
	ShowEsoBuildClickWall(rootSearchPopup);
	
	return true;
}


window.OnEsoSelectItemEnchant = function (itemData, element)
{
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if ($.isEmptyObject(itemData))
	{
		iconElement.attr("enchantid", "0");
		iconElement.attr("enchantintlevel", "0");
		iconElement.attr("enchantinttype", "0");
		g_EsoBuildEnchantData[slotId] = {};
		
		UpdateEsoComputedStatsList(true);
		return;
	}
		
	iconElement.attr("enchantid", itemData.itemId);
	iconElement.attr("enchantintlevel", itemData.internalLevel);
	iconElement.attr("enchantinttype", itemData.internalSubtype);
	
	g_EsoBuildEnchantData[slotId] = itemData;
	RequestEsoEnchantData(itemData, element);
}


window.RequestEsoEnchantData = function (itemData, element)
{	
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	
	var queryParams = {
			"table" : "minedItem",
			"id" : itemData.itemId,
			"intlevel" : itemData.internalLevel,
			"inttype" : itemData.internalSubtype,
			"limit" : 1,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoEnchantDataReceive(data, status, xhr, element, itemData); }).
		fail(function(xhr, status, errorMsg) { OnEsoEnchantDataError(xhr, status, errorMsg, element); });
}


window.OnEsoEnchantDataReceive = function (data, status, xhr, element, origItemData)
{
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	if (data.minedItem == null || data.minedItem[0] == null) return false;
	
	if (slotId == "allarmor")
	{
		UpdateAllArmorEnchantData(data.minedItem[0]);
	}
	else
	{
		UpdateEnchantSlotData(slotId, data.minedItem[0], element);
	}
		
	UpdateEsoComputedStatsList(false);
}


window.OnEsoEnchantDataError = function (xhr, status, errorMsg, element)
{
	
	if (element != null && $(element).attr("slotId") == "allarmor")
	{
		$("#esotbItemSetupArmorEnchantMsg").text("No armor enchantment found!");
	}
}


window.OnEsoWeaponBarSelect1 = function ()
{
	SetEsoBuildActiveWeaponBar(1);
	SetEsoBuildActiveSkillBar(1);
	UpdateEsoComputedStatsList(true);
}


window.OnEsoWeaponBarSelect2 = function ()
{
	SetEsoBuildActiveWeaponBar(2);
	SetEsoBuildActiveSkillBar(2);
	UpdateEsoComputedStatsList(true);
}


window.UpdateEsoBuildRawInputs = function ()
{
	var rawInputs = $("#esotbRawInputs");
	var output = "";
	var keys = Object.keys(g_EsoInputStatSources).sort();
	
	for (var i = 0; i < keys.length; ++i)
	{
		var key = keys[i];
		var statSource = g_EsoInputStatSources[key];
		
		if (HasEsoBuildRawInputSources(statSource))
		{
			output += GetEsoBuildRawInputSourcesHtml(key, statSource);
		}
	}
	
	rawInputs.html(output);
}


window.HasEsoBuildRawInputSources = function (sourceData)
{
	if (sourceData == null) return false;
	
	for (var i = 0; i < sourceData.length; ++i)
	{
		if (sourceData[i].value != null && sourceData[i].value != 0) return true;
	}	
	
	return false;
}


window.GetEsoBuildRawInputSourcesHtml = function (sourceName, sourceData)
{
	if (sourceData.length <= 0) return "";
	
	if (!ESO_TESTBUILD_SHOWALLRAWINPUTS && sourceName.indexOf(".") >= 0 && !sourceName.startsWith("Target.")) {
		return "";
	}
	
	var output = "<div class='esotbRawInputItem'>";
	var sourceValue = "";
	
	sourceName = sourceName.replace(/[.]/g, ' ').replace(/_/g, " ").replace(/([0-9]*[A-Z]+)/g, ' $1').replace(/  /g, ' ').trim();
	
	output += "<div class='esotbRawInputName'>" + sourceName + ":</div>";
	var content = "";
	
	for (var i = 0; i < sourceData.length; ++i)
	{
		content += GetEsoBuildRawInputSourceItemHtml(sourceData[i], sourceName);
	}
	
	if (content == "") return "";
		
	output += content + "</div>";
	return output;
}


window.GetEsoBuildRawInputSourceItemHtml = function (sourceItem, sourceName)
{
	var output = "<div class='esotbRawInputValue'>";
	var value = sourceItem.value;
	var statDetails = g_EsoInputStatDetails[sourceItem.origStatId] || {};
	var suffix = " (" + sourceItem.origStatId + ")";
	var isTarget = sourceName.startsWith("Target ");
	
	if (!isTarget && sourceItem.origStatId.startsWith("Target.") ) return "";
	if (value === null || value == 0) return "";
	
	if (statDetails.display == '%') 
		value = "" + (Math.round(value * 1000)/10) + "%";
	else if (statDetails.display == "flatcrit")
		value = "" + ConvertEsoFlatCritToPercent(value) + "%";
		
	if (sourceItem.slotId != null && sourceItem.item != null && sourceItem.enchant != null)
	{
		if (sourceItem.other)
			output += "" + value + ": Enchantment on " + sourceItem.item.name + " in " + sourceItem.slotId + " equip slot";
		else
			output += "" + value + ": " + sourceItem.enchant.enchantName + " on " + sourceItem.item.name + " in " + sourceItem.slotId + " equip slot";
	}
	else if (sourceItem.slotId != null && sourceItem.item != null)
	{
		output += "" + value + ": " + sourceItem.item.name + " in " + sourceItem.slotId + " equip slot";
	}
	else if (sourceItem.abilityId != null && sourceItem.cp != null)
	{
		output += "" + value + ": " + sourceItem.cp + " CP ability";
	}	
	else if (sourceItem.set != null)
	{
		if (sourceItem.other)
			output += "" + value + ": " + sourceItem.set.name + " set bonus #" + sourceItem.setBonusCount + "";
		else
			output += "" + value + ": " + sourceItem.set.name + " set bonus #" + sourceItem.setBonusCount + "";
	}
	else if (sourceItem.mundus != null)
	{
		output += "" + value + ": " + sourceItem.mundus + " mundus stone";
	}		
	else if (sourceItem.source != null)
	{
		output += "" + value + ": " + sourceItem.source;
	}
	else if (sourceItem.passive != null)
	{
		var skillData = sourceItem.passive;
		
		if (skillData == null || skillData.name == null)
			output += "" + value + ": Unknown skill passive";
		else
			output += "" + value + ": " + skillData.name + " " + skillData.rank + " passive in " + skillData.skillLine + " line";
	}
	else if (sourceItem.active != null)
	{
		var skillData = sourceItem.active;
		
		if (skillData == null || skillData.name == null)
			output += "" + value + ": Unknown active skill";
		else
			output += "" + value + ": " + skillData.name + " " + skillData.rank + " active skill in " + skillData.skillLine + " line";
	}
	else if (sourceItem.buff != null)
	{
		var abilityData = sourceItem.buff.skillAbilities[0];
		
		if (abilityData == null || abilityData.name == null)
			output += "" + value + ": " + sourceItem.buff.name + " buff ";
		else if (abilityData.averageDesc != null)
			output += "" + value + ": " + sourceItem.buff.name + " buff from " + abilityData.name + " set";
		else
			output += "" + value + ": " + sourceItem.buff.name + " buff from " + abilityData.name + " skill";
	}
	else
	{
		output += "" + value + ": Unknown";
	}
	
	output += suffix;
	output += "</div>";
	return output;
}


window.ComputeEsoBuildAllSetData = function ()
{
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		ComputeEsoBuildSetData(setData);
	}
	
	if (g_EsoBuildDumpSetData != "" && g_EsoBuildSetData[setName] != null)
	{
		g_EsoBuildDumpSetData = "";
		
		for (var i in g_EsoBuildSetData[setName].averageDesc)
		{
			var desc = g_EsoBuildSetData[setName].averageDesc[i];
			// EsoBuildLog("" + i + ") " + desc);
		}
	}
}


window.ComputeEsoBuildSetData = function (setData)
{
	setData.parsedNumbers = [];
	setData.averageNumbers = [];
	setData.averageDesc = [];
	setData.isDescValid = [ false, false, false, false, false ];
	
	var setMaxData = g_EsoBuildSetMaxData[setData.name];
	
	if (setMaxData != null && setMaxData.setData != null && setMaxData.setData.parsedNumbers != null)
	{
		setData.maxParsedNumbers = setMaxData.setData.parsedNumbers;
	}
	
	for (var i = 0; i < setData.items.length; ++i)
	{
		var item = setData.items[i];
		ComputeEsoBuildSetDataItem(setData, item);
	}
	
	ComputeEsoBuildSetDataAverages(setData);
	UpdateEsoBuildSetDesc(setData);
}


window.UpdateEsoBuildSetDesc = function (setData)
{
	setData.averageDesc = [];
	if (setData.items.length == 0) return;
	
	for (var i = 0; i < setData.averageNumbers.length; ++i)
	{
		var numbers = setData.averageNumbers[i];
		var rawDesc = RemoveEsoDescriptionFormats(setData.items[0]["setBonusDesc" + (i+1)]);
		var matchCounter = 0;
		
		if (rawDesc == null)
		{
			setData.averageDesc[i] = "";
			continue;
		}
		
		setData.averageDesc[i] = rawDesc.replace(/[0-9]+\.?[0-9]*/g, function(match) {
			++matchCounter;
			return numbers[matchCounter-1] || "";
		});
	}
}


window.ComputeEsoBuildSetDataAverages = function (setData)
{
	var sums = [];
	setData.averageNumbers = [];
	setData.numbersVary = [];
	
	for (var i = 0; i < setData.parsedNumbers.length; ++i)
	{
		if (setData.parsedNumbers[i] == null) continue;
		
		var numbersVary = [];
		var lastNumber = [];
		var thisSum = [];
		var counts = [];
		
		for (var j = 0; j < setData.parsedNumbers[i].length; ++j)
		{
			if (setData.parsedNumbers[i][j] == null) continue;
			
			for (var k = 0; k < setData.parsedNumbers[i][j].length; ++k)
			{
				if (setData.parsedNumbers[i][j][k] == null) continue;
				var number = parseFloat(setData.parsedNumbers[i][j][k]);
				
				if (thisSum[k] == null) 
				{
					thisSum[k] = number;
					counts[k] = 1;
					lastNumber[k] = number;
					numbersVary[k] = false;
				}
				else
				{
					if (lastNumber[k] != number) numbersVary[k] = true;
					lastNumber[k] = number;
					thisSum[k] += number;
					++counts[k];
				}
			}	
		}
		
		setData.numbersVary[i] = numbersVary;
		setData.averageNumbers[i] = [];
		
		for (var j = 0; j < thisSum.length; ++j)
		{
			if (counts[j] == 0)
			{
				setData.averageNumbers[i][j] = 0;
				continue;
			}
			
			if (numbersVary[j])
			{
				setData.averageNumbers[i][j] = Math.floor(thisSum[j] / counts[j]);
				
				if (setData.maxParsedNumbers == null) continue;
				if (setData.maxParsedNumbers[i] == null) continue;
				if (setData.maxParsedNumbers[i][0] == null) continue;
				
				var maxNumber = setData.maxParsedNumbers[i][0][j];
				if (maxNumber == null) continue;

				var delta = maxNumber / 86;		// Best estimate so far
				setData.averageNumbers[i][j] = Math.round(Math.floor(setData.averageNumbers[i][j] / delta) * delta);
			}
			else if (setData.parsedNumbers[i] != null && setData.parsedNumbers[i][0] != null && setData.parsedNumbers[i][0][j] != null)
			{
				setData.averageNumbers[i][j] = setData.parsedNumbers[i][0][j];
			}
			
		}
	}
	
}


window.ComputeEsoBuildSetDataItem = function (setData, item)
{
	ParseEsoBuildSetDesc(setData, 0, item.setBonusDesc1);
	ParseEsoBuildSetDesc(setData, 1, item.setBonusDesc2);
	ParseEsoBuildSetDesc(setData, 2, item.setBonusDesc3);
	ParseEsoBuildSetDesc(setData, 3, item.setBonusDesc4);
	ParseEsoBuildSetDesc(setData, 4, item.setBonusDesc5);
	ParseEsoBuildSetDesc(setData, 5, item.setBonusDesc6);
	ParseEsoBuildSetDesc(setData, 6, item.setBonusDesc7);
	ParseEsoBuildSetDesc(setData, 7, item.setBonusDesc8);
	ParseEsoBuildSetDesc(setData, 8, item.setBonusDesc9);
	ParseEsoBuildSetDesc(setData, 9, item.setBonusDesc10);
	ParseEsoBuildSetDesc(setData, 10, item.setBonusDesc11);
	ParseEsoBuildSetDesc(setData, 11, item.setBonusDesc12);
}


window.ParseEsoBuildSetDesc = function (setData, descIndex, description)
{
	var rawDesc = RemoveEsoDescriptionFormats(description);
	var results = rawDesc.match(/[0-9]+\.?[0-9]*/g);
	
	if (setData.parsedNumbers[descIndex] == null) setData.parsedNumbers[descIndex] = [];
	
	setData.parsedNumbers[descIndex].push(results);
}


window.IsTwiceBornStarEnabled = function ()
{
	if (g_EsoInputStatSources.TwiceBornStar == null) return false;
	if (g_EsoInputStatSources.TwiceBornStar[0] == null) return false;
	if (g_EsoInputStatSources.TwiceBornStar[0].value == 1) return true;
	return false;
}


window.UpdateEsoBuildMundusList2 = function ()
{
	var isEnabled = IsTwiceBornStarEnabled();
	
	if (isEnabled)
	{
		$("#esotbMundus2").prop("disabled", false);
	}
	else
	{
		$("#esotbMundus2").val("none");
		$("#esotbMundus2").prop("disabled", "disabled");
	}
}


window.UpdateEsoBuildSetInfo = function ()
{
	var setInfoElement = $("#esotbSetInfo");
	var output = GetEsoBuildSetInfoHtml(); 
	
	setInfoElement.html(output);
}


window.GetEsoBuildSetInfoHtml = function ()
{
	var output = "";
	
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		
		var wornItems = setData.count;
		var otherWornItems = setData.otherCount;
		if (wornItems <= 0 && otherWornItems <= 0) continue;
		
		output += "<div class='esotbSetInfoSet'>";
		output += "<h4>" + setName + "</h4>";
		
		output += "<div class='esotbSetInfoRow'>Worn Set Items = " + wornItems + "</div>";
		output += "<div class='esotbSetInfoRow'>Unequipped Weapon Bar Set Items = " + otherWornItems + "</div>";
		
		for (var name in setData.rawOutput)
		{
			var statDetails = g_EsoInputStatDetails[name] || {};
			var value = setData.rawOutput[name];
			
			if (statDetails.display == '%') 
				value = "" + Math.floor(value * 1000)/10 + "%";
			else if (statDetails.display == '%')
				value = "" + ConvertEsoFlatCritToPercent(value) + "%";
			
			output += "<div class='esotbSetInfoRow'>" + name + " = " + value + "</div>";
		}
		
		output += "</div>";
	}
	
	return output;
}


window.AddEsoBuildToggledSkillData = function (skillEffectData, isPassive)
{
	var id = skillEffectData.id;
	
	if (g_EsoBuildToggledSkillData[id] == null) 
	{
		g_EsoBuildToggledSkillData[id] = {};
		g_EsoBuildToggledSkillData[id].isPassive = isPassive;
		g_EsoBuildToggledSkillData[id].matchData = skillEffectData;
		g_EsoBuildToggledSkillData[id].baseSkillId = skillEffectData.baseSkillId;
		g_EsoBuildToggledSkillData[id].statIds = [];
		g_EsoBuildToggledSkillData[id].rawInputMatch = skillEffectData.rawInputMatch; 
		g_EsoBuildToggledSkillData[id].displayName = skillEffectData.displayName;
	}
	
	g_EsoBuildToggledSkillData[id].id = id;
	g_EsoBuildToggledSkillData[id].desc = "";
	g_EsoBuildToggledSkillData[id].valid = false;
	g_EsoBuildToggledSkillData[id].isUsed = false;
	g_EsoBuildToggledSkillData[id].enabled = skillEffectData.enabled;
	g_EsoBuildToggledSkillData[id].combatEnabled = false;
	g_EsoBuildToggledSkillData[id].count = 0;
	g_EsoBuildToggledSkillData[id].maxTimes = skillEffectData.maxTimes;	
	
	if (skillEffectData.statId != null)
		g_EsoBuildToggledSkillData[id].statIds.push(skillEffectData.statId);
	else if (skillEffectData.buffId != null)
		g_EsoBuildToggledSkillData[id].statIds.push("Buff." + skillEffectData.buffId);
}


window.CreateEsoBuildToggledSkillData = function ()
{
	g_EsoBuildToggledSkillData = {};
	
	for (var i = 0; i < ESO_PASSIVEEFFECT_MATCHES.length; ++i)
	{
		var skillEffectData = ESO_PASSIVEEFFECT_MATCHES[i];
		if (skillEffectData.toggle !== true) continue;
		
		AddEsoBuildToggledSkillData(skillEffectData, true);
	}
	
	for (var i = 0; i < ESO_ACTIVEEFFECT_MATCHES.length; ++i)
	{
		var skillEffectData = ESO_ACTIVEEFFECT_MATCHES[i];
		if (skillEffectData.toggle !== true) continue;
		
		AddEsoBuildToggledSkillData(skillEffectData, false);
	}
}


window.CreateEsoBuildToggledSetData = function ()
{
	g_EsoBuildToggledSetData = {};
	
	for (var i = 0; i < ESO_SETEFFECT_MATCHES.length; ++i)
	{
		var setEffectData = ESO_SETEFFECT_MATCHES[i];
		if (setEffectData.toggle !== true) continue;
		
		var id = setEffectData.id;
		
		if (g_EsoBuildToggledSetData[id] == null) 
		{
			g_EsoBuildToggledSetData[id] = {};
			g_EsoBuildToggledSetData[id].statIds = [];
			g_EsoBuildToggledSetData[id].matchData = setEffectData;
			g_EsoBuildToggledSetData[id].setId = id;
			g_EsoBuildToggledSetData[id].displayName = setEffectData.displayName;
			g_EsoBuildToggledSetData[id].disableSetId = setEffectData.disableSetId;
			g_EsoBuildToggledSetData[id].disableSetIds = setEffectData.disableSetIds;
			g_EsoBuildToggledSetData[id].damageType = setEffectData.damageType;
		}
		
		g_EsoBuildToggledSetData[id].id = id;
		g_EsoBuildToggledSetData[id].setBonusCount = setEffectData.setBonusCount;
		g_EsoBuildToggledSetData[id].desc = "";
		g_EsoBuildToggledSetData[id].valid = false;
		g_EsoBuildToggledSetData[id].enabled = setEffectData.enabled;
		g_EsoBuildToggledSetData[id].combatEnabled = false;
		g_EsoBuildToggledSetData[id].statIds.push(setEffectData.statId);
		g_EsoBuildToggledSetData[id].maxTimes = setEffectData.maxTimes;
		g_EsoBuildToggledSetData[id].count = 0;		
		g_EsoBuildToggledSetData[id].otherCount = 0;
		
		if (setEffectData.setId != null) g_EsoBuildToggledSetData[id].setId = setEffectData.setId;
		
		if (g_EsoBuildSetData[id] != null && g_EsoBuildSetData[id].averageDesc != null &&
				g_EsoBuildSetData[id].averageDesc[setEffectData.setBonusCount] != null)
		{
			g_EsoBuildToggledSetData[id].desc = g_EsoBuildSetData[id].averageDesc[setEffectData.setBonusCount];
		}
		else if (g_EsoBuildSetData[id] != null && g_EsoBuildSetData[id].unequippedItems[0] != null)
		{
			var desc = g_EsoBuildSetData[id].unequippedItems[0]['setBonusDesc' + setEffectData.setBonusCount];
			if (desc) g_EsoBuildToggledSetData[id].desc = desc;
		}
		else if (g_EsoBuildSetData[id] != null && g_EsoBuildSetData[id].items[0] != null)
		{
			var desc = g_EsoBuildSetData[id].items[0]['setBonusDesc' + setEffectData.setBonusCount];
			if (desc) g_EsoBuildToggledSetData[id].desc = desc;
		}
	}
	
}


window.CreateEsoBuildToggledCpData = function ()
{
	g_EsoBuildToggledCpData = {};
	
	for (var i = 0; i < ESO_CPEFFECT_MATCHES.length; ++i)
	{
		var cpEffectData = ESO_CPEFFECT_MATCHES[i];
		if (cpEffectData.toggle !== true) continue;
		
		var id = cpEffectData.id;
		
		if (g_EsoBuildToggledCpData[id] == null) 
		{
			g_EsoBuildToggledCpData[id] = {};
			g_EsoBuildToggledCpData[id].statIds = [];
			g_EsoBuildToggledCpData[id].matchData = cpEffectData;
			g_EsoBuildToggledCpData[id].displayName = cpEffectData.displayName;
		}
		
		g_EsoBuildToggledCpData[id].id = id;
		g_EsoBuildToggledCpData[id].valid = false;
		g_EsoBuildToggledCpData[id].enabled = cpEffectData.enabled;
		g_EsoBuildToggledCpData[id].combatEnabled = false;
		if (g_EsoBuildToggledCpData[id].enabled == null) g_EsoBuildToggledCpData[id].enabled = false;
		g_EsoBuildToggledCpData[id].statIds.push(cpEffectData.statId);
		g_EsoBuildToggledCpData[id].maxTimes = cpEffectData.maxTimes;
		g_EsoBuildToggledCpData[id].count = 0;
		g_EsoBuildToggledCpData[id].desc = "";
	}
}


window.IsEsoBuildToggledSkillUsed = function (skillId)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	return g_EsoBuildToggledSkillData[skillId].isUsed;
}


window.SetEsoBuildToggledSkillUsed = function (skillId, isUsed)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return;
	return g_EsoBuildToggledSkillData[skillId].isUsed = isUsed;
}


window.IsEsoBuildToggledSkillEnabled = function (skillId)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	return g_EsoBuildToggledSkillData[skillId].valid && (g_EsoBuildToggledSkillData[skillId].enabled || g_EsoBuildToggledSkillData[skillId].combatEnabled);
}


window.SetEsoBuildToggledSkillValid = function (skillId, valid)
{
	if (g_EsoBuildToggledSkillData[skillId] != null) g_EsoBuildToggledSkillData[skillId].valid = valid;
}


window.SetEsoBuildToggledSkillDesc = function (skillId, desc)
{
	if (g_EsoBuildToggledSkillData[skillId] != null) g_EsoBuildToggledSkillData[skillId].desc = desc;
}


window.SetEsoBuildToggledSkillEnable = function (skillId, enable)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	g_EsoBuildToggledSkillData[skillId].enabled = enable;
}


window.NiceIntParse = function(value, defaultValue = 0) 
{
	var result = parseInt(value);
	
	if (isNaN(result)) result = defaultValue;
	return result;
}


window.NiceFloatParse = function(value, defaultValue = 0) 
{
	var result = parseFloat(value);
	
	if (isNaN(result)) result = defaultValue;
	return result;
}


window.SetEsoBuildToggledSkillCount = function (skillId, value)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	g_EsoBuildToggledSkillData[skillId].count = NiceIntParse(value);
}


window.SetEsoBuildToggledSetCount = function (skillId, value)
{
	if (g_EsoBuildToggledSetData[skillId] == null) return false;
	g_EsoBuildToggledSetData[skillId].count = NiceIntParse(value);
}


window.IsEsoBuildToggledSetEnabled = function (setId)
{
	if (g_EsoBuildToggledSetData[setId] == null) return false;
	var isEnabled = g_EsoBuildToggledSetData[setId].valid && (g_EsoBuildToggledSetData[setId].enabled || g_EsoBuildToggledSetData[setId].combatEnabled);
	if (isEnabled) return true;
	return false;
}


window.SetEsoBuildToggledSetValid = function (setId, valid)
{
	if (g_EsoBuildToggledSetData[setId] != null) g_EsoBuildToggledSetData[setId].valid = valid;
	// if (g_EsoBuildToggledSetData[setId+"2"] != null)
	// g_EsoBuildToggledSetData[setId+"2"].valid = valid;
}


window.SetEsoBuildToggledSetDesc = function (setId, desc)
{
	if (g_EsoBuildToggledSetData[setId] != null) g_EsoBuildToggledSetData[setId].desc = desc;
}


window.SetEsoBuildToggledSetEnable = function (setId, enable)
{
	if (g_EsoBuildToggledSetData[setId] == null) return false;
	g_EsoBuildToggledSetData[setId].enabled = enable;
}


window.SetEsoBuildToggledCpEnable = function (cpId, enable)
{
	if (g_EsoBuildToggledCpData[cpId] == null) return false;
	g_EsoBuildToggledCpData[cpId].enabled = enable;
}


window.SetEsoBuildToggledCpCount = function (cpId, value)
{
	if (g_EsoBuildToggledCpData[cpId] == null) return false;
	g_EsoBuildToggledCpData[cpId].count = NiceIntParse(value);
}


window.UpdateEsoBuildToggledSkillData = function (inputValues)
{
	
	for (var skillId in g_EsoBuildToggledSkillData)
	{
		var toggleSkillData = g_EsoBuildToggledSkillData[skillId];
		var abilityId = toggleSkillData.baseSkillId;
		var abilityData = g_EsoSkillPassiveData[abilityId];
		var realAbilityId = abilityId;
		
		toggleSkillData.valid = false;
		toggleSkillData.isUsed = false;
		
		if (abilityData == null)
		{
			abilityData = g_EsoSkillActiveData[abilityId];
			// if (abilityData == null) continue;
		}
		
		if (toggleSkillData.matchData == null) continue;
		
		if (toggleSkillData.matchData.matchSkillName === true)
		{
			// var data = g_SkillsData[abilityId];
			// if (data == null) continue;
			// if (toggleSkillData.matchData.id.toUpperCase() !=
			// data.name.toUpperCase()) continue;
			
			if (abilityData == null) continue;
			var data = g_SkillsData[abilityData.abilityId];
			if (data == null) continue;
			if (toggleSkillData.matchData.id.toUpperCase() != data.name.toUpperCase()) continue;
		}
		
		if (toggleSkillData.matchData.statRequireId != null)
		{
			var requiredStat = inputValues[toggleSkillData.matchData.statRequireId];
			if (requiredStat == null) continue;
			if (parseFloat(requiredStat) < parseFloat(toggleSkillData.matchData.statRequireValue)) continue;
		}
		
		if (toggleSkillData.matchData.requireSkillLine != null)
		{
			var count = CountEsoBarSkillsWithSkillLine(toggleSkillData.matchData.requireSkillLine);
			if (count == 0) continue;
		}
		
		if (!toggleSkillData.isPassive)
		{
			if (toggleSkillData.matchData.enableOffBar)
			{
				if (!IsEsoSkillOnAnyBar(abilityId)) continue;
			}
			else
			{
				if (!IsEsoSkillOnActiveBar(abilityId)) continue;
			}
			
			abilityData = g_EsoSkillActiveData[abilityId];
			if (abilityData == null) continue;
			
			realAbilityId = abilityData.abilityId;
		}
		else
		{
			abilityData = g_EsoSkillPassiveData[abilityId];
			if (abilityData == null) continue;
			
			realAbilityId = abilityData.abilityId;
		}
		
		toggleSkillData.valid = true;
		toggleSkillData.desc = GetEsoSkillDescription(realAbilityId, g_LastSkillInputValues, false, true);
		
		var checkElement = $("#esotbToggledSkillInfo").find(".esotbToggledSkillItem[skillid=\"" + skillId + "\"]").find(".esotbToggleSkillCheck");
		
		if (checkElement.length > 0)
		{
			SetEsoBuildToggledSkillEnable(skillId, checkElement.is(":checked"));
			
			var countElement = checkElement.next(".esotbToggleSkillNumber");
			if (countElement.length > 0) SetEsoBuildToggledSkillCount(skillId, countElement.val());
		}
	}
	
}


window.FindMatchingEsoPassiveSkillDescription = function (matchData)
{
	if (matchData == null) return "";
	
	for (var skillId in g_EsoSkillPassiveData)
	{
		var skillData = g_EsoSkillPassiveData[skillId];
		var abilityData = g_SkillsData[skillData.abilityId];
		
		if (abilityData == null) continue;
		
		var skillDesc = GetEsoSkillDescription(abilityData.abilityId, g_LastSkillInputValues, false, true);
		var rawDesc = skillDesc;
		
		if (matchData.match != null)
		{
			var matches = rawDesc.match(matchData.match);
			if (matches == null) continue;
		}
	
		if (matchData.skillName != null)
		{
			if (abilityData.name.toUpperCase() != matchData.skillName.toUpperCase()) continue;
		}
		
		if (matchData.skillRank != null)
		{
			if (abilityData.rank != matchData.skillRank) continue;
		}

		return rawDesc;
	}
	
	return "";
}


window.UpdateEsoBuildToggledSetData = function ()
{
	
	for (var setId in g_EsoBuildToggledSetData)
	{
		var toggleData = g_EsoBuildToggledSetData[setId];
		if (toggleData == null) continue;
		
		SetEsoBuildToggledSetValid(setId, false);
		
		var setName = setId;
		if (toggleData.setId != null) setName = toggleData.setId;
		
		var setData = g_EsoBuildSetData[setName];
		if (setData == null) continue;
		
		// if (setData.averageDesc == null || setData.items[0] == null)
		// continue;
		
		if (toggleData.matchData.statRequireId != null)
		{
			var requiredStat = inputValues[toggleData.matchData.statRequireId];
			if (requiredStat == null) continue;
			if (parseFloat(requiredStat) < parseFloat(toggleData.matchData.statRequireValue)) continue;
		}
		
		if (toggleData.matchData.requireSkillLine != null)
		{
			var count = CountEsoBarSkillsWithSkillLine(toggleData.matchData.requireSkillLine);
			if (count == 0) continue;
		}
		
		if (toggleData.matchData.requireSkillType != null)
		{
			var count = CountEsoBarSkillsWithSkillType(toggleData.matchData.requireSkillType);
			if (count == 0) continue;
		}
		
		var setDesc = null;
		var setCount = null;
		
		if (toggleData.matchData.enableOffBar) 
		{
			setDesc = RemoveEsoDescriptionFormats(toggleData.desc);
			if (setData.unequippedItems && setData.unequippedItems[0] != null) setCount = setData.unequippedItems[0]['setBonusCount' + toggleData.setBonusCount];
			
			if (setDesc == null && setData.unequippedItems[0] != null)
			{
				setDesc = RemoveEsoDescriptionFormats(setData.unequippedItems[0]['setBonusDesc' + toggleData.setBonusCount]);
			}
		}
		
		if (setData.averageDesc[toggleData.setBonusCount - 1] != null) 
		{ 
			setDesc = setData.averageDesc[toggleData.setBonusCount - 1];
		}
		else if (setData.unequippedItems[0] != null)
		{
			var desc = setData.unequippedItems[0]['setBonusDesc' + toggleData.setBonusCount];
			if (desc) setDesc = RemoveEsoDescriptionFormats(desc);
		}
		else if (setData.items[0] != null)
		{
			var desc = setData.items[0]['setBonusDesc' + toggleData.setBonusCount];
			if (desc) setDesc = RemoveEsoDescriptionFormats(desc);
		}
		
		if (setData.items[0] != null) setCount = setData.items[0]['setBonusCount' + toggleData.setBonusCount];
		
		if (setDesc == null || setCount == null) continue;
		toggleData.desc = setDesc;
		
		if (toggleData.matchData.rawInputMatch != null)
		{
			var rawInputMatches = toggleData.desc.match(toggleData.matchData.rawInputMatch);
			if (rawInputMatches != null) toggleData.desc = rawInputMatches[1];
		}
		
		if (setCount > setData.count && setCount > setData.otherCount) continue;
		
		SetEsoBuildToggledSetValid(setId, true);
		
		var checkElement = $("#esotbItemToggleSets").find(".esotbToggledSetItem[setid=\"" + setId + "\"]").find(".esotbToggleSetCheck");
		
		if (checkElement.length > 0)
		{
			SetEsoBuildToggledSetEnable(setId, checkElement.is(":checked"));
			
			var countElement = checkElement.next(".esotbToggleSetNumber");
			if (countElement.length > 0) SetEsoBuildToggledSetCount(setId, countElement.val());
		}
	}
}


window.UpdateEsoBuildToggleSets = function ()
{
	var element = $("#esotbToggledSetInfo");
	var output = "";
	
	for (var setId in g_EsoBuildToggledSetData)
	{
		var setData = g_EsoBuildToggledSetData[setId];
		if (!setData.valid) continue;
		output += CreateEsoBuildToggleSetHtml(setData);
	}
	
	element.html(output);
	
	$("#esotbItemToggleSets").find(".esotbToggleSetNumber").on("input", OnEsoBuildToggleSetNumber);
	$("#esotbItemToggleSets").find(".esotbToggleSetNumber").click(OnEsoBuildToggleSetNumberClick);
	$("#esotbItemToggleSets").find(".esotbToggleSetCheck").click(OnEsoBuildToggleSet);
	$("#esotbItemToggleSets").find(".esotbToggledSetItem").click(OnEsoBuildToggleSetClick);
}


window.UpdateEsoBuildToggleCp = function ()
{
	var element = $("#esotbToggledCpInfo");
	var output = "";
	
	for (var cpId in g_EsoBuildToggledCpData)
	{
		var cpData = g_EsoBuildToggledCpData[cpId];
		if (!cpData.valid) continue;
		output += CreateEsoBuildToggleCpHtml(cpData);
	}
	
	element.html(output);
	
	$("#esotbToggledCpInfo").find(".esotbToggleCpNumber").on("input", OnEsoBuildToggleCpNumber);
	$("#esotbToggledCpInfo").find(".esotbToggleCpNumber").click(OnEsoBuildToggleCpNumberClick);
	$("#esotbToggledCpInfo").find(".esotbToggleCpCheck").click(OnEsoBuildToggleCp);
	$("#esotbToggledCpInfo").find(".esotbToggledCpItem").click(OnEsoBuildToggleCpClick);
}


window.UpdateEsoBuildToggledCpData = function ()
{
	
	for (var cpId in g_EsoBuildToggledCpData)
	{
		var toggleData = g_EsoBuildToggledCpData[cpId];
		if (toggleData == null) continue;
		
		toggleData.valid = false;
		
		var cpData = g_EsoCpData[cpId];
		if (cpData == null) continue;
		
		toggleData.desc = cpData.description;
		if (cpData.isUnlocked !== true) continue;
		
		toggleData.valid = true;
		
		var checkElement = $("#esotbToggledCpInfo").find(".esotbToggledCpItem[cpid=\"" + cpId + "\"]").find(".esotbToggleCpCheck");
		
		if (checkElement.length > 0)
		{
			SetEsoBuildToggledCpEnable(cpId, checkElement.is(":checked"));
			
			var countElement = checkElement.next(".esotbToggleCpNumber");
			if (countElement.length > 0) SetEsoBuildToggledCpCount(cpId, countElement.val());
		}
	}
}


window.OnEsoBuildToggleSetNumberClick = function (e)
{
	e.stopPropagation();
	return false;
}


window.OnEsoBuildToggleCpNumberClick = function (e)
{
	e.stopPropagation();
	return false;
}


window.OnEsoBuildToggleSet = function (e)
{
	OnEsoBuildToggleSetChanged($(this));
	
	UpdateEsoComputedStatsList("async");
	
	e.stopPropagation();
	return true;
}


window.OnEsoBuildToggleCp = function (e)
{
	OnEsoBuildToggleCpChanged($(this));
	
	UpdateEsoComputedStatsList("async");
	
	e.stopPropagation();
	return true;
}


window.OnEsoBuildToggleSetClick = function (e)
{
	var checkBox = $(this).find(".esotbToggleSetCheck");
	checkBox.prop("checked", !checkBox.prop("checked"));
	
	OnEsoBuildToggleSetChanged(checkBox);
	
	UpdateEsoComputedStatsList("async");
	
	return false;
}


window.OnEsoBuildToggleCpClick = function (e)
{
	var checkBox = $(this).find(".esotbToggleCpCheck");
	checkBox.prop("checked", !checkBox.prop("checked"));
	
	OnEsoBuildToggleCpChanged(checkBox);
	
	UpdateEsoComputedStatsList("async");
	
	return false;
}



window.OnEsoBuildToggleSetChanged = function (checkBox)
{
	var parent = checkBox.parent();
	var setId = parent.attr("setid");
	var toggleData = g_EsoBuildToggledSetData[setId];
	
	if (checkBox.prop("checked"))
		parent.addClass("esotbToggledSetSelect");
	else
		parent.removeClass("esotbToggledSetSelect");
	
	if (toggleData == null) return;
	
	if (toggleData.disableSetId != null || toggleData.disableSetIds != null)
	{
		if (toggleData.disableSetId) {
			$("#esotbToggledSetInfo").find(".esotbToggledSetItem[setid=\"" + toggleData.disableSetId + "\"]").find(".esotbToggleSetCheck").prop("checked", false);
		}
		
		for (var i in toggleData.disableSetIds)
		{
			var disableSetId = toggleData.disableSetIds[i];
			$("#esotbToggledSetInfo").find(".esotbToggledSetItem[setid=\"" + disableSetId + "\"]").find(".esotbToggleSetCheck").prop("checked", false);
		}
	}
	
}


window.OnEsoBuildToggleCpChanged = function (checkBox)
{
	var parent = checkBox.parent();
	var cpId = parent.attr("cpid");
	var toggleData = g_EsoBuildToggledCpData[cpId];
	
	if (checkBox.prop("checked"))
		parent.addClass("esotbToggledCpSelect");
	else
		parent.removeClass("esotbToggledCpSelect");
	
	if (toggleData == null) return;
}


window.CreateEsoBuildToggleSetHtml = function (setData)
{
	var checked = setData.enabled ? "checked" : "";
	var extraClass = "";
	if (checked) extraClass = 'esotbToggledSetSelect';
	
	var displayName = setData.id;
	if (setData.displayName != null) displayName = setData.displayName;
	
	var output = "<div class='esotbToggledSetItem " + extraClass + "' setid=\"" + setData.id + "\">";
	
	output += "<input type='checkbox' class='esotbToggleSetCheck'  " + checked + " >";
	
	if (setData.maxTimes != null) 
	{
		output += "<input type='number' class='esotbToggleSetNumber'  value='" + setData.count + "' >";
	}
	
	output += "<div class='esotbToggleSetTitle'>" + displayName + ":</div> ";
	output += "<div class='esotbToggleSetDesc'>" + setData.desc + "</div>";
	
	output += "</div>";
	return output;
}


window.CreateEsoBuildToggleCpHtml = function (cpData)
{
	var checked = cpData.enabled ? "checked" : "";
	var extraClass = "";
	if (checked) extraClass = 'esotbToggledCpSelect';
	
	var displayName = cpData.id;
	if (cpData.displayName != null) displayName = cpData.displayName;
	
	var output = "<div class='esotbToggledCpItem " + extraClass + "' cpid=\"" + cpData.id + "\">";
	
	output += "<input type='checkbox' class='esotbToggleCpCheck'  " + checked + " >";
	
	if (cpData.maxTimes != null) 
	{
		output += "<input type='number' class='esotbToggleCpNumber'  value='" + cpData.count + "' >";
	}
	
	output += "<div class='esotbToggleCpTitle'>" + displayName + ":</div> ";
	output += "<div class='esotbToggleCpDesc'>" + cpData.desc + "</div>";
	
	output += "</div>";
	return output;
}


window.OnEsoBuildToggleSkill = function (e)
{
	var skillId = $(this).parent().attr("skillId");
	if (skillId == null || skillId == "") return;
	
	UpdateEsoComputedStatsList("async");
	
	e.stopPropagation();
	return true;
}


window.OnEsoBuildToggleSkillClick = function (e)
{
	var checkbox = $(this).find(".esotbToggleSkillCheck");
	checkbox.prop("checked", !checkbox.prop("checked"));
	
	if (checkbox.prop("checked"))
		$(this).addClass("esotbToggledSkillSelect");
	else
		$(this).removeClass("esotbToggledSkillSelect");
	
	UpdateEsoComputedStatsList("async");
	
	return false;
}


window.OnEsoBuildToggleSkillNumber = function (e)
{
	var skillId = $(this).parent().attr("skillId");
	if (skillId == null || skillId == "") return;
	
	var toggleData = g_EsoBuildToggledSkillData[skillId];
	if (toggleData == null) return;
	
	var value = $(this).val();
	
	if (value < 0) $(this).val("0");
	if (toggleData.maxTimes != null && value > toggleData.maxTimes)  $(this).val(toggleData.maxTimes);
	
	UpdateEsoComputedStatsList();
}


window.OnEsoBuildToggleSetNumber = function (e)
{
	var setName = $(this).parent().attr("setid");
	if (setName == null || setName == "") return;
	
	var toggleData = g_EsoBuildToggledSetData[setName];
	if (toggleData == null) return;
	
	var value = $(this).val();
	
	if (value < 0) $(this).val("0");
	if (toggleData.maxTimes != null && value > toggleData.maxTimes)  $(this).val(toggleData.maxTimes);
	
	UpdateEsoComputedStatsList();
}


window.OnEsoBuildToggleCpNumber = function (e)
{
	var cpName = $(this).parent().attr("cpid");
	if (cpName == null || cpName == "") return;
	
	var toggleData = g_EsoBuildToggledCpData[cpName];
	if (toggleData == null) return;
	
	var value = $(this).val();
	
	if (value < 0) $(this).val("0");
	if (toggleData.maxTimes != null && value > toggleData.maxTimes)  $(this).val(toggleData.maxTimes);
	
	UpdateEsoComputedStatsList();
}


window.UpdateEsoBuildToggleSkills = function ()
{
	var element = $("#esotbToggledSkillInfo");
	var output = "";
	
	for (var skillId in g_EsoBuildToggledSkillData)
	{
		var skillData = g_EsoBuildToggledSkillData[skillId];
		if (!skillData.valid) continue;
		output += CreateEsoBuildToggleSkillHtml(skillData);
	}
	
	element.html(output);
	$("#esotbToggleSkills").find(".esotbToggleSkillNumber").on("input", OnEsoBuildToggleSkillNumber);
	$("#esotbToggleSkills").find(".esotbToggleSkillNumber").click(OnEsoBuildToggleSkillNumberClick);
	$("#esotbToggleSkills").find(".esotbToggleSkillCheck").click(OnEsoBuildToggleSkill);
	$("#esotbToggleSkills").find(".esotbToggledSkillItem").click(OnEsoBuildToggleSkillClick);
}


window.OnEsoBuildToggleSkillNumberClick = function (e)
{
	e.stopPropagation();
	return false;
}


window.CreateEsoBuildToggleSkillHtml = function (skillData)
{
	var checked = skillData.enabled ? "checked" : "";
	var extraClass = "";
	if (checked) extraClass = 'esotbToggledSkillSelect';
	
	var output = "<div class='esotbToggledSkillItem " + extraClass + "' skillid=\"" + skillData.id + "\">";
	
	var displayName = skillData.id;
	var activeData = g_EsoSkillActiveData[skillData.baseSkillId];
			
	if (activeData != null && activeData.abilityId != null)
	{
		var abilityData = g_SkillsData[activeData.abilityId];
		if (abilityData != null && abilityData.name != null) displayName = abilityData.name;
	}
	
	if (skillData.displayName != null) displayName = skillData.displayName;
	
	output += "<input type='checkbox' class='esotbToggleSkillCheck'  " + checked + " >";
	
	if (skillData.maxTimes != null) 
	{
		output += "<input type='number' class='esotbToggleSkillNumber'  value='" + skillData.count + "' >";
	}
	
	var skillDesc = skillData.desc;
	
	if (skillData.rawInputMatch != null)
	{
		var rawInputMatches = skillDesc.match(skillData.rawInputMatch);
		if (rawInputMatches != null) skillDesc = rawInputMatches[1];
	}
	
	output += "<div class='esotbToggleSkillTitle'>" + displayName + ":</div> ";
	output += "<div class='esotbToggleSkillDesc'>" + skillDesc + "</div>";
	
	output += "</div>";
	return output;
}


window.UpdateEsoBuildItemLinkSetCounts = function ()
{
	UpdateEsoBuildItemLinkSetCount("Head");
	UpdateEsoBuildItemLinkSetCount("Shoulders");
	UpdateEsoBuildItemLinkSetCount("Chest");
	UpdateEsoBuildItemLinkSetCount("Hands");
	UpdateEsoBuildItemLinkSetCount("Waist");
	UpdateEsoBuildItemLinkSetCount("Legs");
	UpdateEsoBuildItemLinkSetCount("Feet");
	UpdateEsoBuildItemLinkSetCount("Neck");
	UpdateEsoBuildItemLinkSetCount("Ring1");
	UpdateEsoBuildItemLinkSetCount("Ring2");
	UpdateEsoBuildItemLinkSetCount("MainHand1");
	UpdateEsoBuildItemLinkSetCount("OffHand1");
	UpdateEsoBuildItemLinkSetCount("MainHand2");
	UpdateEsoBuildItemLinkSetCount("OffHand2");
}


window.UpdateEsoBuildItemLinkSetCount = function (slotId)
{
	//var itemElement = $(".esotbItem[slotid='" + slotId + "']");
	var itemElement = $("#esotbItem" + slotId);
	var iconElement = itemElement.children(".esotbItemIcon");
	var itemData = g_EsoBuildItemData[slotId];
	
	iconElement.attr("setcount", "0");
	
	if (itemData == null) return;
	if (itemData.setName == null || itemData.setName == "") return;
	
	var setData = g_EsoBuildSetData[itemData.setName];
	if (setData == null) return;
	if (setData.count == null) return;
	
	iconElement.attr("setcount", setData.count);
}


window.UpdateEsoBuildWeaponEnchantFactor = function (slotId, inputValues)
{
	//var itemElement = $(".esotbItem[slotid='" + slotId + "']");
	var itemElement = $("#esotbItem" + slotId);
	var iconElement = itemElement.children(".esotbItemIcon");
	var itemData = g_EsoBuildItemData[slotId];
	var enchantData = g_EsoBuildEnchantData[slotId];
	var enchantDesc = enchantData.enchantDesc ? enchantData.enchantDesc : "";
	var isOblivionDamage = (enchantDesc.indexOf("Oblivion Damage") >= 0);
	
	iconElement.attr("enchantfactor", 0);
	if (itemData == null) return;
	
	if (itemData.weaponType == 14) 
	{
		iconElement.attr("enchantfactor", 0);
		return;
	}
	
		/* Manually check for Torug's Pact off-bar setup */
	if (inputValues == null)
	{
		if (g_EsoBuildSetData["Torug's Pact"] != null && g_EsoBuildSetData["Torug's Pact"].otherCount >= 5 && !isOblivionDamage)
		{
			iconElement.attr("enchantfactor", 0.3);
		}
		
		return;
	}
	
	if (inputValues.Set == null || inputValues.Set.EnchantPotency == null) return;
	if (!isOblivionDamage) iconElement.attr("enchantfactor", inputValues.Set.EnchantPotency);
}


window.UpdateEsoBuildWeaponTraitFactor = function (slotId, inputValues, isOffHand)
{
	var itemElement = $("#esotbItem" + slotId);
	var iconElement = itemElement.children(".esotbItemIcon");
	var itemData = g_EsoBuildItemData[slotId];
	
	iconElement.attr("weapontraitfactor", 0);
	if (itemData == null) return;
	
	if ( itemData.weaponType == 14 || itemData.trait == 10 || itemData.trait == 9) 
	{
		iconElement.attr("weapontraitfactor", 0);
		return;
	}
	
	if (isOffHand)
	{
		if (g_EsoBuildSetData["Heartland Conqueror"] != null && g_EsoBuildSetData["Heartland Conqueror"].otherCount >= 5)
		{
			iconElement.attr("weapontraitfactor", 1.0);
		}
		
		return;
	}
	
		/* Manually check for Heartland Conqueror */
	if (inputValues == null || inputValues.Set == null)
	{
		if (g_EsoBuildSetData["Heartland Conqueror"] != null && g_EsoBuildSetData["Heartland Conqueror"].count >= 5)
		{
			iconElement.attr("weapontraitfactor", 1.0);
		}
		
		return;
	}
	
	var weaponTraitEffect = inputValues.Set.WeaponTraitEffect;
	if (weaponTraitEffect == null) weaponTraitEffect = 0;
	iconElement.attr("weapontraitfactor", weaponTraitEffect);
}


window.OnEsoBuildEscapeKey = function (e) 
{
	HideEsoBuildClickWall();
}


window.GetEsoTestBuildStat = function (statId)
{
	if (g_EsoComputedStats[statId] != null) return g_EsoComputedStats[statId];
	return g_EsoInputStats[statId];
}


window.GetEsoTestBuildSkillInputValues = function (inputValues)
{
	return g_LastSkillInputValues;
}


window.UpdateEsoBuildSkillInputValues = function (inputValues)
{
	if (inputValues == null) return;
	
	var magicka = parseInt(inputValues.Magicka);
	var stamina = parseInt(inputValues.Stamina);
	var health = parseInt(inputValues.Health);
	var spellDamage = parseInt(inputValues.SpellDamage);
	var weaponDamage = parseInt(inputValues.WeaponDamage);
	var level = parseInt(inputValues.EffectiveLevel);
	
	if (isNaN(magicka)) magicka = parseInt(g_EsoComputedStats.Magicka.value);
	if (isNaN(stamina)) stamina = parseInt(g_EsoComputedStats.Stamina.value);
	if (isNaN(health)) health = parseInt(g_EsoComputedStats.Health.value);
	if (isNaN(spellDamage)) spellDamage = parseInt(g_EsoComputedStats.SpellDamage.value);
	if (isNaN(weaponDamage)) weaponDamage = parseInt(g_EsoComputedStats.WeaponDamage.value);
	
	g_LastSkillInputValues =
	{ 
			Magicka			: magicka,
			Stamina			: stamina,
			Health			: health,
			SpellResist		: parseInt(inputValues.SpellResist),
			PhysicalResist	: parseInt(inputValues.PhysicalResist),
			SpellDamage		: spellDamage,
			WeaponDamage	: weaponDamage,
			MaxStat			: Math.max(stamina, magicka),
			MaxDamage		: Math.max(spellDamage, weaponDamage),
			EffectiveLevel	: level,
			LightArmor		: parseInt(inputValues.ArmorLight),
			MediumArmor		: parseInt(inputValues.ArmorMedium),
			HeavyArmor		: parseInt(inputValues.ArmorHeavy),
			ArmorTypes		: parseInt(inputValues.ArmorTypes),
			DaggerWeapon	: parseInt(inputValues.WeaponDagger),
			AssassinSkills	: CountEsoBarSkillsWithSkillLine("Assassination"),
			FightersGuildSkills	: CountEsoBarSkillsWithSkillLine("Fighters Guild"),
			DraconicPowerSkills	: CountEsoBarSkillsWithSkillLine("Draconic Power"),
			ShadowSkills	: CountEsoBarSkillsWithSkillLine("Shadow"),
			SiphoningSkills	: CountEsoBarSkillsWithSkillLine("Siphoning"),
			SorcererSkills	: CountEsoBarSkillsWithSkillType("Sorcerer"),
			MagesGuildSkills : CountEsoBarSkillsWithSkillLine("Mages Guild"),
			SupportSkills : CountEsoBarSkillsWithSkillLine("Support"),
			AnimalCompanionSkills : CountEsoBarSkillsWithSkillLine("Animal Companions"),
			GreenBalanceSkills : CountEsoBarSkillsWithSkillLine("Green Balance"),
			WintersEmbraceSkills : CountEsoBarSkillsWithSkillLine("Winter's Embrace"),
			BoneTyrantSkills : CountEsoBarSkillsWithSkillLine("Bone Tyrant"),
			GraveLordSkills : CountEsoBarSkillsWithSkillLine("Grave Lord"),
			CoralRiptide : inputValues.Set.CoralRiptide,
	};
	
	g_LastSkillInputValues.SkillLineCost = inputValues.SkillCost;
	g_LastSkillInputValues.DamageShield = inputValues.DamageShield;
	g_LastSkillInputValues.DamageShieldCost = inputValues.DamageShieldCost;
	g_LastSkillInputValues.SkillDirectDamage = inputValues.SkillDirectDamage;
	g_LastSkillInputValues.SkillDotDamage = inputValues.SkillDotDamage;
	g_LastSkillInputValues.ElfBaneDuration = inputValues.Set.ElfBaneDuration;
	
	g_LastSkillInputValues.StatHistory = g_EsoBuildLastInputHistory;
	
	g_LastSkillInputValues.MagickaCost =
	{
			CP 		: inputValues.CP.MagickaCost,
			Item 	: inputValues.Item.MagickaCost,
			Set 	: inputValues.Set.MagickaCost,
			Skill 	: inputValues.Skill.MagickaCost,
			Skill2	: inputValues.Skill2.MagickaCost,
			Buff	: inputValues.Buff.MagickaCost,
			All     : inputValues.MagickaCost,
	};
	
	g_LastSkillInputValues.StaminaCost = 
	{
			CP 		: inputValues.CP.StaminaCost,
			Item 	: inputValues.Item.StaminaCost,
			Set		: inputValues.Set.StaminaCost,
			Skill 	: inputValues.Skill.StaminaCost,
			Skill2	: inputValues.Skill2.StaminaCost,
			Buff	: inputValues.Buff.StaminaCost,
			All     : inputValues.StaminaCost,
	};
	
	g_LastSkillInputValues.UltimateCost = 
	{
			CP 		: inputValues.CP.UltimateCost,
			Item 	: inputValues.Item.UltimateCost,
			Set 	: inputValues.Set.UltimateCost,
			Skill 	: inputValues.Skill.UltimateCost,
			Skill2	: inputValues.Skill2.UltimateCost,
			Buff	: inputValues.Buff.UltimateCost,
			All     : inputValues.UltimateCost,
	};
	
	g_LastSkillInputValues.HealthCost = 
	{
			Item	: inputValues.Item.HealthCost,
			Set		: inputValues.Set.HealthCost,
			Skill 	: inputValues.Skill.HealthCost,	
	};
	
	g_LastSkillInputValues.Damage =
	{
		Physical		: inputValues.PhysicalDamageDone,
		Magic			: inputValues.MagicDamageDone,
		Shock			: inputValues.ShockDamageDone,
		Flame			: inputValues.FlameDamageDone,
		Frost			: inputValues.FrostDamageDone,
		Poison			: inputValues.PoisonDamageDone,
		Disease			: inputValues.DiseaseDamageDone,
		Bleed			: inputValues.BleedDamageDone,
		Dot				: inputValues.DotDamageDone,
		Channel			: inputValues.Set.ChannelDamageDone,
		Direct			: inputValues.DirectDamageDone,
		All				: inputValues.DamageDone,
		Empower			: inputValues.Buff.Empower,
		MaelstromDamage : 0,
		AOE				: inputValues.AOEDamageDone,
		SingleTarget	: inputValues.SingleTargetDamageDone,
		Overload		: inputValues.OverloadDamage,
		Pet				: inputValues.PetDamageDone,
		ExtraBashDamage : inputValues.Skill.ExtraBashDamage + inputValues.Set.ExtraBashDamage + inputValues.Item.ExtraBashDamage,
		LADamage		: inputValues.CP.LADamage + inputValues.Set.LADamage + inputValues.Skill.LADamage,
		HADamage		: inputValues.CP.HADamage + inputValues.Set.HADamage + inputValues.Skill.HADamage,
	};
	
	g_LastSkillInputValues.Healing =
	{
		Done		 : inputValues.HealingDone,
		Taken		 : inputValues.HealingTaken,
		Received	 : inputValues.HealingReceived,
		AOE			 : inputValues.AOEHealingDone,
		DOT			 : inputValues.DotHealingDone,
		SingleTarget : inputValues.SingleTargetHealingDone,
		Reduction	 : inputValues.HealingReduction,
	};
	
	g_LastSkillInputValues.Vulnerability = inputValues.Target.Vulnerability;
	g_LastSkillInputValues.SkillDuration = inputValues.SkillDuration;
 	g_LastSkillInputValues.SkillDamage = inputValues.SkillDamage;
 	g_LastSkillInputValues.SkillLineDamage = inputValues.SkillLineDamage;
 	g_LastSkillInputValues.SkillHealing = inputValues.SkillHealing;
 	g_LastSkillInputValues.useMaelstromDamage = false;
 	g_LastSkillInputValues.PoisonStaminaCost = inputValues.Skill.PoisonStaminaCost;
 	g_LastSkillInputValues.FlameAOEDamageDone = inputValues.Skill.FlameAOEDamageDone;
 	//g_LastSkillInputValues.BleedDamage = inputValues.Set.BleedDamageDone;
 	//g_LastSkillInputValues.FlatBleedDamage = inputValues.Skill2.BleedDamageDone;
 	g_LastSkillInputValues.FlatOverloadDamage = inputValues.Skill2.OverloadDamage;
 	
 	g_LastSkillInputValues.TwinSlashInitialDamage = inputValues.Set.TwinSlashInitialDamage;
 	g_LastSkillInputValues.MagickaAbilityDamageDone = inputValues.Set.MagickaAbilityDamageDone;
 	g_LastSkillInputValues.HealingAbilityCost = inputValues.Set.HealingAbilityCost;
 	g_LastSkillInputValues.NonWeaponAbilityCost = inputValues.Set.NonWeaponAbilityCost;
 	
 	g_LastSkillInputValues.DotDamageDone = {};
 	g_LastSkillInputValues.DotDamageDone.Physical = inputValues.Set.PhysicalDotDamageDone;
 	g_LastSkillInputValues.DotDamageDone.Poison = inputValues.Set.PoisonDotDamageDone;
 	g_LastSkillInputValues.DotDamageDone.Disease = inputValues.Set.DiseaseDotDamageDone;
 	g_LastSkillInputValues.DotDamageDone.Bleed = inputValues.Set.BleedDotDamageDone;
 	
 	g_LastSkillInputValues.ChannelDamageDone = {};
 	g_LastSkillInputValues.ChannelDamageDone.Physical = inputValues.Set.PhysicalChannelDamageDone;
 	g_LastSkillInputValues.ChannelDamageDone.Poison = inputValues.Set.PoisonChannelDamageDone;
 	g_LastSkillInputValues.ChannelDamageDone.Disease = inputValues.Set.DiseaseChannelDamageDone;
 	g_LastSkillInputValues.ChannelDamageDone.Bleed = inputValues.Set.BleedChannelDamageDone;
 	
 	var SpellDamageFactor = 1 + inputValues.Skill.SpellDamage + inputValues.Buff.SpellDamage;
 	var WeaponDamageFactor = 1 + inputValues.Skill.WeaponDamage + inputValues.Buff.WeaponDamage;
 	var BaseSpellDamage = inputValues.Item.SpellDamage + inputValues.Set.SpellDamage + inputValues.Mundus.SpellDamage + inputValues.Skill2.SpellDamage + inputValues.CP.SpellDamage;
 	var BaseWeaponDamage = inputValues.Item.WeaponDamage + inputValues.Set.WeaponDamage + inputValues.Mundus.WeaponDamage + inputValues.Skill2.WeaponDamage + inputValues.CP.WeaponDamage;
 	
	BaseSpellDamage += inputValues.Level * 20;
	BaseWeaponDamage += inputValues.Level * 20;
 	
 		/* TODO: Check if this works correctly for buffs */
	var pelinalSetCount = 0;
	var pelinalSetName = "";
	
	if (g_EsoBuildSetData["Pelinal's Aptitude"] != null) 
	{
		pelinalSetName = "Pelinal's Aptitude";
		pelinalSetCount = g_EsoBuildSetData["Pelinal's Aptitude"].count;
	}
	
	if (pelinalSetCount >= 5)
	{
		var weaponDamage = BaseWeaponDamage * WeaponDamageFactor;
		var spellDamage = BaseSpellDamage * SpellDamageFactor;
		
		if (weaponDamage > spellDamage)
		{
			SpellDamageFactor = WeaponDamageFactor;
			BaseSpellDamage = BaseWeaponDamage;
		}
		else
		{
			WeaponDamageFactor = SpellDamageFactor;
			BaseWeaponDamage = BaseSpellDamage;
		}
	}
	
	inputValues.SkillLineWeaponDmg['base'] = 0;
	inputValues.SkillLineSpellDmg['base'] = 0;
	inputValues.SkillBonusWeaponDmg['base'] = 0;
	inputValues.SkillBonusSpellDmg['base'] = 0;
	
	var dmgIds = [ "Class", "Channel", "Maelstrom", "Healing", "AOE", "DOT", "Direct", "Range", "Melee", "DirectRange", "EnemyTarget" ];
	
	var spellDmgData = {
			base: BaseSpellDamage,
			line: inputValues.SkillLineSpellDmg,
			bonus: inputValues.SkillBonusSpellDmg,
			factor: SpellDamageFactor,
			bloodthirsty: inputValues.BloodthirstySpellDamage,
			Class: inputValues.Set.ClassSpellDamage,
			Channel: inputValues.Item.ChannelSpellDamage,
			Maelstrom: inputValues.Item.MaelstromDamage,
			AOE: inputValues.Set.AOESpellDamage,
			Healing: inputValues.CP.HealingSpellDamage,
			DOT: inputValues.Set.DOTSpellDamage,
			Range: inputValues.Set.RangedSpellDamage,
			Melee: inputValues.Set.MeleeSpellDamage,
			Direct: inputValues.Set.DirectSpellDamage,
			DirectRange: inputValues.Set.DirectRangeSpellDamage,
			EnemyTarget: inputValues.Set.EnemyTargetSpellDamage,
		};
	var weaponDmgData = {
			base: BaseWeaponDamage,
			line: inputValues.SkillLineWeaponDmg,
			bonus: inputValues.SkillBonusWeaponDmg,
			factor: WeaponDamageFactor,
			bloodthirsty: inputValues.BloodthirstyWeaponDamage,
			Class: inputValues.Set.ClassWeaponDamage,
			Channel: inputValues.Item.ChannelWeaponDamage,
			Maelstrom: inputValues.Item.MaelstromDamage,
			AOE: inputValues.Set.AOEWeaponDamage,
			Healing: inputValues.CP.HealingWeaponDamage,
			DOT: inputValues.Set.DOTWeaponDamage,
			Range: inputValues.Set.RangedWeaponDamage,
			Melee: inputValues.Set.MeleeWeaponDamage,
			Direct: inputValues.Set.DirectWeaponDamage,
			DirectRange: inputValues.Set.DirectRangeWeaponDamage,
			EnemyTarget: inputValues.Set.EnemyTargetWeaponDamage,
		};
	
	g_LastSkillInputValues.SkillSpellDamage  = EsoBuildCreateDamageData(dmgIds, spellDmgData);
	g_LastSkillInputValues.SkillWeaponDamage = EsoBuildCreateDamageData(dmgIds, weaponDmgData);
	
	g_LastSkillInputValues.SkillSpellDamage.SkillSpellDamages = inputValues.SkillSpellDamage;
	g_LastSkillInputValues.SkillSpellDamage.SkillWeaponDamages = inputValues.SkillWeaponDamage;
	g_LastSkillInputValues.SkillWeaponDamage.SkillSpellDamages = inputValues.SkillSpellDamage;
	g_LastSkillInputValues.SkillWeaponDamage.SkillWeaponDamages = inputValues.SkillWeaponDamage;
	
	g_LastSkillInputValues.SkillSpellDamage.WeaponDamageFactor = WeaponDamageFactor;
	g_LastSkillInputValues.SkillSpellDamage.SpellDamageFactor = SpellDamageFactor;
	g_LastSkillInputValues.SkillWeaponDamage.WeaponDamageFactor = WeaponDamageFactor;
	g_LastSkillInputValues.SkillWeaponDamage.SpellDamageFactor = SpellDamageFactor;
 	
	return g_LastSkillInputValues;
}


window.EsoBuildCreateDamageData = function(ids, dmgData)
{
	var resultData = EsoBuildCreateSkillBonusDamage(dmgData.line, dmgData.bonus, dmgData.base, dmgData.factor, dmgData.bloodthirsty);
	var nextIds = ids;
	
	ids.forEach(function (id, index) {
		var value = dmgData[id];
		if (value == null || isNaN(value)) value = 0;
		
		var newDmgData = Object.assign({}, dmgData);
		var newIds = ids.slice(index + 1);
		
		newDmgData.base += value;
		
		resultData[id] = EsoBuildCreateDamageData(newIds, newDmgData);
		//resultData[id] = EsoBuildCreateSkillBonusDamage(dmgData.skillLine, dmgData.skillBonus, dmgData.base + value, dmgData.factor, dmgData.bloodthirsty);
	});
	
	return resultData;
}


window.EsoBuildCreateSkillBonusDamage = function (lineSourceDmg, sourceDmg, baseDmg, factorDmg, addDmg)
{''
	var bonusDmg = {};
	
	if (addDmg == null) addDmg = 0;
	
	for (var lineDmgType in lineSourceDmg)
	{
		var lineDmg = lineSourceDmg[lineDmgType];
		lineDmgType = lineDmgType.toLowerCase();
		
		bonusDmg[lineDmgType] = {};
		
		for (var dmgType in sourceDmg)
		{
			var dmg = sourceDmg[dmgType];
			dmgType = dmgType.toLowerCase();
			
			bonusDmg[lineDmgType][dmgType] = Math.floor((baseDmg + lineDmg + dmg) * factorDmg + addDmg);
		}	
	}
	
	return bonusDmg;
}


window.SetEsoBuildActiveWeaponBar = function (barIndex)
{
	if (barIndex == 1)
	{
		$("#esotbWeaponBar1").addClass("esotbWeaponSelect");
		$("#esotbWeaponBar2").removeClass("esotbWeaponSelect");
		
		g_EsoBuildActiveWeapon = barIndex;
	}
	else if (barIndex == 2)
	{
		$("#esotbWeaponBar1").removeClass("esotbWeaponSelect");
		$("#esotbWeaponBar2").addClass("esotbWeaponSelect");
		
		g_EsoBuildActiveWeapon = barIndex;
	}
	
}


window.SetEsoBuildActiveSkillBar = function (skillBarIndex)
{
	SetEsoSkillBarSelect(skillBarIndex);
	g_EsoBuildActiveAbilityBar = skillBarIndex;
}


window.OnEsoBuildSkillBarSwap = function (e, skillBarIndex, weaponBarIndex)
{
	g_EsoBuildActiveAbilityBar = skillBarIndex;
	
	if (weaponBarIndex >= 1 && weaponBarIndex <= 2)
	{
		SetEsoBuildActiveWeaponBar(weaponBarIndex);	
	}
	else if (skillBarIndex >= 1 && skillBarIndex <= 2)
	{
		SetEsoBuildActiveWeaponBar(skillBarIndex);
	}
	else
	{
		SetEsoBuildActiveWeaponMatchingSkillBar(skillBarIndex);
	}
	
	CopyEsoSkillsToItemTab();
	CopyEsoSkillsToCombatTab();
	UpdateEsoComputedStatsList("async");
}


window.OnEsoBuildSkillUpdate = function (e)
{
	CopyEsoSkillsToItemTab();
	if (window.CopyEsoSkillsToCombatTab) CopyEsoSkillsToCombatTab();
	UpdateEsoComputedStatsList("async");
}


window.OnEsoBuildSkillBarUpdate = function (e)
{
	CopyEsoSkillsToItemTab();
	if (window.CopyEsoSkillsToCombatTab) CopyEsoSkillsToCombatTab();
	UpdateEsoComputedStatsList();
}


window.IsEsoSkillOnAnyBar = function (abilityId)
{
	
	for (var j = 0; j < g_EsoSkillBarData.length; ++j) 
	{
		var skillBar = g_EsoSkillBarData[j];
		if (skillBar == null) continue;
		
		for (var i = 0; i < skillBar.length; ++i)
		{
			var skillId = skillBar[i].skillId;
			if (skillId == null || skillId <= 0) continue;
			
			if (skillId == abilityId) return true;
			
			var origSkillId = skillBar[i].origSkillId;
			if (origSkillId == null || origSkillId <= 0) continue;
			
			if (origSkillId == abilityId) return true;
		}
	}
	
	return false;
}


window.IsEsoSkillOnActiveBar = function (abilityId)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return false;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillId = skillBar[i].skillId;
		if (skillId == null || skillId <= 0) continue;
		
		if (skillId == abilityId) return true;
		
		var origSkillId = skillBar[i].origSkillId;
		if (origSkillId == null || origSkillId <= 0) continue;
		
		if (origSkillId == abilityId) return true;
	}
	
	return false;
}


window.IsEsoOrigSkillOnActiveBar = function (abilityId)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return false;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillId = skillBar[i].origSkillId;
		if (skillId == null || skillId <= 0) continue;
		
		if (skillId == abilityId) return true;
	}
	
	return false;
}


window.CountEsoBarSkillsWithSkillLine = function (skillLine)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	var count = 0;
	
	if (skillBar == null) return 0;
	skillLine = skillLine.toUpperCase();
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillId = skillBar[i].skillId;
		if (skillId == null || skillId <= 0) continue;
		
		var skillData = g_SkillsData[skillId];
		if (skillData == null) continue;
		
		if (skillData.skillLine.toUpperCase() == skillLine) ++count;
	}
	
	return count;
}


window.CountEsoBarSkillsWithSkillType = function (skillType)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	var count = 0;
	
	if (skillBar == null) return 0;
	skillType = skillType.toUpperCase();
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillId = skillBar[i].skillId;
		if (skillId == null || skillId <= 0) continue;
		
		var skillData = g_SkillsData[skillId];
		if (skillData == null) continue;
		
		if (skillData.skillTypeName.substr(0, skillType.length).toUpperCase() == skillType) ++count;
	}
	
	return count;
}


window.UpdateEsoBuildRawInputOtherEffects = function ()
{
	for (var key in g_EsoInputStatSources.OtherEffects)
	{
		var data = g_EsoInputStatSources.OtherEffects[key];
		var skillData = null
		
		if (data.active  != null) skillData = data.active;
		if (data.passive != null) skillData = data.passive;
		if (skillData == null || skillData.abilityId == null) continue;
		
		data.value = GetEsoSkillDescription(skillData.abilityId, null, false, true);
		
		if (data.rawInputMatch != null)
		{
			var matches = data.value.match(data.rawInputMatch);
			if (matches != null && matches[1] != null) data.value = matches[1];
		}
	}
}


window.CreateEsoBuildBuffElements = function ()
{
	var buffElement = $("#esotbBuffInfo");
	var output = "";
	var groupOutputs = {};
	var keys = Object.keys(g_EsoBuildBuffData).sort();
	
		/* Predefine to set display order */
	groupOutputs["Major"] = "";
	groupOutputs["Minor"] = "";
	groupOutputs["Cyrodiil"] = "";
	groupOutputs["Poison"] = "";
	groupOutputs["Potion"] = "";
	groupOutputs["Skill"] = "";
	groupOutputs["Set"] = "";
	groupOutputs["Target"] = "";
	groupOutputs["Other"] = "";	
	
	for (var i = 0; i < keys.length; ++i)
	{
		var buffName = keys[i];
		var buffData = g_EsoBuildBuffData[buffName];
		var group = buffData.group || "Other";
		
		if (groupOutputs[group] == null) groupOutputs[group] = "";
		groupOutputs[group] += CreateEsoBuildBuffHtml(buffName, buffData);
	}
	
	for (var group in groupOutputs)
	{
		output += "<div class='esotbBuffGroup'>" + group + "</div>";
		output += groupOutputs[group];
		output += "";
	}
	
	buffElement.html(output);
}


window.CreateEsoBuildBuffHtml = function (buffName, buffData)
{
	var icon = buffData.icon;
	var extraAttributes = "";
	var extraClass = "";
	var checked = "";
	
	buffData.name = buffName;
	
	if (icon == null) icon = "/unknown.png";
	icon = ESO_ICON_URL + icon;
	
	if (buffData.visible === false) extraClass = "esotbBuffDisabled";
	if (buffData.enabled) checked = "checked";
	
	var elementId = "esotbBuff_" + buffName;
	elementId = elementId.replace(/\W/g, "_");
	
	var output = "<div id='" + elementId + "' class='esotbBuffItem " + extraClass + "' " + extraAttributes + " buffid='" + buffName + "'>";
	
	output += "<input class='esotbBuffCheck' type='checkbox' buffid='" + buffName + "' " + checked + "> ";
	output += "<img class='esotbBuffIcon' src='" + icon + "'>";
	output += "<div class='esotbBuffTitle'>" + buffName + "</div>";
	
	CreateEsoBuildBuffDescHtml(buffData);

	output += "<div class='esotbBuffDesc'>" + buffData.desc + "</div>";
	output += "<div class='esotbBuffSkillEnable'></div>";
	output += "</div>";
	
	return output;
}


	/* [].fill() is missing in IE */ 
if (Array.prototype.fill == null)
{
	Array.prototype.fill = function(value, start, end)
	{
		if (start == null) start = 0;
		if (end == null) end == this.length;
		
		for (var i = start; i < end; ++i)
		{
			this[i] = value;
		}
		
		return this;
	}
}


window.CreateEsoBuildBuffDescHtml = function (buffData)
{
	var statId = buffData.statId;
	var statIds = buffData.statIds;
	var buffId = buffData.buffId;
	var buffIds = buffData.buffIds;
	var category = buffData.category;;
	var categories = buffData.categories;
	var statValue = buffData.value;
	var statValues = buffData.values;
	var display = buffData.display;
	var displays = buffData.displays;
	var statDesc = buffData.statDesc;
	var statDescs = buffData.statDescs;
	var factorValue = buffData.factorValue;
	var factorValues = buffData.factorValues;
	var prefixDesc = "Increases ";
	var targetDesc = "your ";
	
	buffData.desc = "";
	
	if (statDesc == null) statDesc = "";
	if (statValue == null) statValue = "";
	if (category == null) category = "";
	if (display == null) display = "";
	
	if (buffIds == null) buffIds = [ buffId ];
	if (statIds == null) statIds = [ statId ];	
	if (statValues == null) statValues = [].fill.call({ length: statIds.length }, statValue);
	if (categories == null) categories = [].fill.call({ length: statIds.length }, category);
	if (displays == null) displays = [].fill.call({ length: statIds.length }, display);
	if (statDescs == null) statDescs = [].fill.call({ length: statIds.length }, statDesc);
	if (factorValues == null) factorValues = [].fill.call({ length: statIds.length }, factorValue);
			
	for (var i = 0; i < statIds.length; ++i)
	{
		if (statIds[i] == null) continue;
		
		var prefixDesc = "Increases ";
		var targetDesc = "your ";
		
			/* Replace some stat abbreviations with nicer descriptions */
		statId = statIds[i].replace(/([A-Z])/g, ' $1').trim().replace("A O E ", " AOE ");
		statId = statId.replace("H A ", "Heavy Attack ");
		statId = statId.replace("L A ", "Light Attack ");
		statId = statId.replace("Sta Restore ", "Stamina Restoration ");
		statId = statId.replace("Mag Restore ", "Mag Restoration ");
		
		statValue = statValues[i];
		category = categories[i];
		display = displays[i];
		factorValue = factorValues[i];
		
		if (typeof(statValue) != "string")
		{
			if (factorValue != null && factorValue != 1) statValue *= factorValue;
			
			if (statValue < 0) 
			{
				prefixDesc = "Decreases ";
				statValue *= -1;
			}
			
			if (buffData.category == "Target" || category == "Target") targetDesc = "the target's ";
			
			if (display == "%")
			{
				statValue = "" + (Math.floor(statValue*1000)/10) + "%";
			}
			
			if (statDescs[i] != null && statDescs[i] != "") {
				var replaceIndex = statDescs[i].indexOf("$1");
				
				if (replaceIndex < 0) {
					buffData.desc += statDescs[i] + statValue + "<br/>";
				}
				else {
					var output = statDescs[i].replace("$1", statValue);
					buffData.desc += output + "<br/>";
				}
			}
			else {
				buffData.desc += prefixDesc + targetDesc + statId + " by " + statValue + "<br/>";
			}
		}
		else
		{
			if (statDescs[i] != null && statDescs[i] != "") {
				buffData.desc += statDescs[i] + statValue + "<br/>";
			}
			else {
				buffData.desc += statValue + "<br/>";
			}
		}
	}
	
	var buffDesc = buffIds.filter(Boolean).join(", ");
	
	if (buffDesc != "")
	{
		if (buffData.desc != "") buffData.desc += "<br/>";
		buffData.desc += "Adds Buffs: " + buffDesc;
	}
	
	return buffData.desc;
}


window.UpdateEsoBuildVisibleBuffs = function ()
{
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		var elementId = buffName.replace(/\W/g, "_");
		var element = $("#esotbBuff_" + elementId);
		var buffDesc = element.find(".esotbBuffDesc");
		
		if (buffData.toggleVisible === true && buffData.visible)
		{
			var newHtml = CreateEsoBuildBuffDescHtml(buffData);
			element.removeClass("esotbBuffDisabled");
			buffDesc.html(newHtml);
		}
		else if (buffData.toggleVisible === true && !buffData.visible)
		{
			element.addClass("esotbBuffDisabled");
		}
		else if (buffData.forceUpdate)
		{
			var newHtml = CreateEsoBuildBuffDescHtml(buffData);
			buffDesc.html(newHtml);
			buffData.forceUpdate = false;
		}
	}
}


window.UpdateEsoBuffItem = function (element)
{
	if (element.hasClass("esotbBuffDisable")) return;
	var checked = element.find(".esotbBuffCheck").prop("checked");
	
	if (checked)
		element.addClass("esotbBuffItemSelect");
	else
		element.removeClass("esotbBuffItemSelect");
}


window.OnEsoBuildBuffClick = function (e)
{
	var checkElement = $(this).find(".esotbBuffCheck");
	var buffId = $(this).attr("buffid");
	var buffData = g_EsoBuildBuffData[buffId];
	
	checkElement.prop("checked", !checkElement.prop("checked"));
	
	if (buffData != null)
	{
		buffData.enabled = checkElement.prop("checked");
	}
	
	UpdateEsoBuffItem($(this));
	UpdateEsoComputedStatsList("async");
	
	return false;
}


window.OnEsoBuildBuffCheckClick = function (e)
{
	var parent = $(this).parent();
	var buffId = parent.attr("buffid");
	var buffData = g_EsoBuildBuffData[buffId];
	
	if (buffData != null)
	{
		buffData.enabled = $(this).prop("checked");
	}
	
	UpdateEsoBuffItem(parent);
	UpdateEsoComputedStatsList("async");

	e.stopPropagation();
	return true;
}


window.AddEsoBuildSkillDetailsButtons = function ()
{
	var skillDetails = "<div class='esotbItemButton esotbSkillDetailsButton'>...</div>";
	$("#esovsSkillContent").find(".esovsSkillContentBlock").children(".esovsAbilityBlock").append(skillDetails);
}


window.CreateEsoBuildClickWall = function ()
{
	$("<div/>").attr("id", "esotbClickWall")
		.attr("style", "display:none;")
		.html("")
		.appendTo("body");
}


window.CreateEsoBuildItemDetailsPopup = function ()
{
	$("<div/>").attr("id", "esotbItemDetailsPopup")
		.attr("style", "display:none;")
		.html("<div id=\"esotbItemDetailsCloseButton\">x</div><div id=\"esotbItemDetailsTitle\"></div><div id=\"esotbItemDetailsText\"></div>")
		.appendTo("body");
}


window.CreateEsoBuildFormulaPopup = function ()
{
	$("<div/>").attr("id", "esotbFormulaPopup")
		.attr("style", "display:none;")
		.html('<div id="esotbFormulaCloseButton">x</div>' +
					'<div id="esotbFormulaTitle"></div>' + 
					'<div id="esotbFormulaNote"></div>' + 
					'<div id="esotbFormulaName"></div>' + 
					'<div id="esotbFormula"></div><p>' + 
					'Changing the below input values will only change them inside of this window.' + 
					'<div id="esotbFormulaInputs"></div>' + 
					'<div id="esotbFormulaBottomNote">Note that formulas are estimates and may not be completely accurate for all inputs.</div>')
		.appendTo("body");
}


window.SetEsoInitialData = function (destData, srcData)
{
	
	for (var key in srcData)
	{
		var value = srcData[key];
		if (value != null) destData[key] = value;
	}
	
}


window.UpdateEsoSetMaxData = function ()
{
	
	for (var setName in g_EsoBuildSetMaxData)
	{
		var setData = g_EsoBuildSetMaxData[setName];
		
		if (setData.setData == null)
		{
			setData.setData = {};
			setData.setData.parsedNumbers = [];
			setData.setData.averageNumbers = [];
			setData.setData.averageDesc = [];
		}
		
		ComputeEsoBuildSetDataItem(setData.setData, setData);
	}
}


window.UpdateEsoInitialBuffData = function ()
{
	for (var buffName in g_EsoInitialBuffData)
	{
		var enabled = g_EsoInitialBuffData[buffName];
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData == null) continue;
		
		buffData.enabled       = ((parseInt(enabled) & 1) != 0); 
		buffData.skillEnabled  = ((parseInt(enabled) & 2) != 0);
		buffData.buffEnabled   = ((parseInt(enabled) & 4) != 0);
		buffData.combatEnabled = false; 
	}
	
}


window.UpdateEsoInitialToggleCpData = function()
{
	for (var cpName in g_EsoInitialToggleCpData)
	{
		var initData = g_EsoInitialToggleCpData[cpName];
		var cpData = g_EsoBuildToggledCpData[cpName];
		if (cpData == null) continue;
		
		cpData.enabled = (initData.enabled != 0);
		if (initData.count != null) cpData.count = NiceIntParse(initData.count);
	}
}


window.UpdateEsoInitialToggleSetData = function ()
{
	for (var setName in g_EsoInitialToggleSetData)
	{
		var initData = g_EsoInitialToggleSetData[setName];
		var setData = g_EsoBuildToggledSetData[setName];
		if (setData == null) continue;
		
		setData.enabled = (initData.enabled != 0);
		if (initData.count != null) setData.count = NiceIntParse(initData.count);
	}

}


window.UpdateEsoInitialToggleSkillData = function ()
{
	for (var skillName in g_EsoInitialToggleSkillData)
	{
		var initData = g_EsoInitialToggleSkillData[skillName];
		var skillData = g_EsoBuildToggledSkillData[skillName];
		if (skillData == null) continue;
		
		skillData.enabled = (initData.enabled != 0);
		if (initData.count != null) skillData.count = NiceIntParse(initData.count);
	}

}


window.OnEsoBuildAbilityBlockClick = function (e)
{
	var $openList = $("#esovsSkillContent").find('.esovsAbilityBlockList:visible');
	var $element = $(this).next('.esovsAbilityBlockList');
		
	if ($openList[0] == $element[0])
	{
		$element.slideUp();
		return false;
	}
	
	$openList.slideUp();
	$element.slideToggle();
	
	e.preventDefault();
	e.stopPropagation();
	return false;
}


window.RequestEsoBuildSave = function ()
{
	var saveData = CreateEsoBuildSaveData();
	
	$.ajax("https://esobuilds.uesp.net/saveBuild.php", {
				type: "POST",
				data: { 
					savedata: JSON.stringify(saveData), 
					id: g_EsoBuildData.id,
				},
				xhrFields: { withCredentials: true },
			})
		.done(function(data, status, xhr) { OnEsoBuildSaved(data, status, xhr); })
		.fail(function(xhr, status, errorMsg) { OnEsoBuildSaveError(xhr, status, errorMsg); });
}


window.RequestEsoBuildCreateCopy = function ()
{
	var saveData = CreateEsoBuildSaveData();
	
	$.ajax("https://esobuilds.uesp.net/saveBuild.php", {
				type: "POST",
				data: { 
					savedata: JSON.stringify(saveData), 
					id: g_EsoBuildData.id, 
					copy: 1,
				},
				xhrFields: { withCredentials: true },
			})
		.done(function(data, status, xhr) { OnEsoBuildCopy (data, status, xhr); })
		.fail(function(xhr, status, errorMsg) { OnEsoBuildCopyError(xhr, status, errorMsg); });
}


window.OnEsoBuildSaved = function (data, status, xhr)
{
	if (!data.success)
	{
		SetEsoBuildSaveResults("ERROR saving build!");
	}
	else if (data.isnew)
	{
		UpdateEsoBuildNewId(data.id);
		SetEsoBuildSaveResults("Successfully created new build! Reloading....");
		
		var currentUrl = window.location.href;
		var newUrl = currentUrl.replace(/&id=[0-9]+/, "").replace(/[?]id=[0-9]+/, "?");
		
		if (newUrl.includes("?"))
			newUrl = newUrl + "&id=" + data.id;
		else
			newUrl = newUrl + "?id=" + data.id;
		
		window.location.href = newUrl;
	}
	else
	{
		SetEsoBuildSaveResults("Successfully saved build!");
	}

}


window.OnEsoBuildCopy = function (data, status, xhr)
{
	if (!data.success)
	{
		SetEsoBuildSaveResults("ERROR copying build!");
		return;
	}
	
	UpdateEsoBuildNewId(data.id);
	SetEsoBuildSaveResults("Successfully created new build! Reloading...");
	
	var currentUrl = window.location.href;
	var newUrl = currentUrl.replace(/&id=[0-9]+/, "").replace(/[?]id=[0-9]+/, "?");
	
	if (newUrl.includes("?"))
		newUrl = newUrl + "&id=" + data.id;
	else
		newUrl = newUrl + "?id=" + data.id;
	
	window.location.href = newUrl;
}


window.OnEsoBuildCopyError = function (xhr, status, errorMsg)
{
	SetEsoBuildSaveResults("ERROR copying build!");
}


window.OnEsoBuildSaveError = function (xhr, status, errorMsg)
{
	SetEsoBuildSaveResults("ERROR saving build!");
}


window.UpdateEsoBuildNewId = function (newId)
{
	g_EsoBuildData.id = newId;
}


window.CreateEsoBuildSaveData = function ()
{
	var saveData = {};

	UpdateEsoComputedStatsList_Real(true);
	
	var inputValues = g_EsoBuildLastInputValues;
	
	saveData.Stats = {};
	
	CreateEsoBuildGeneralSaveData(saveData, inputValues);
	CreateEsoBuildComputedSaveData(saveData, inputValues);
	CreateEsoBuildItemSaveData(saveData, inputValues);
	CreateEsoBuildSkillSaveData(saveData, inputValues);
	CreateEsoBuildBuffSaveData(saveData, inputValues);
	CreateEsoBuildCPSaveData(saveData, inputValues);
	CreateEsoBuildActionBarSaveData(saveData, inputValues);
	CreateEsoBuildSkillToggleSaveData(saveData, inputValues);
	CreateEsoBuildSetToggleSaveData(saveData, inputValues);
	CreateEsoBuildCpToggleSaveData(saveData, inputValues);
	CreateEsoBuildCombatSaveData(saveData, inputValues);
	
	CreateEsoBuildOffBarSaveData(saveData, inputValues);
	
	return saveData;
}


window.CreateEsoBuildCpToggleSaveData = function (saveData, inputValues)
{
	for (var name in g_EsoBuildToggledCpData)
	{
		var toggleData = g_EsoBuildToggledCpData[name];
		var outName = "ToggleCp:" + name;
		
		if (toggleData.maxTimes != null) 
		{
			saveData.Stats[outName + ":Count"] = "" + toggleData.count;
		}
		
		saveData.Stats[outName] = "" + ConvertBoolToInt(toggleData.enabled);
	}
	
	return saveData;
}


window.CreateEsoBuildSetToggleSaveData = function (saveData, inputValues)
{
	
	for (var name in g_EsoBuildToggledSetData)
	{
		var toggleData = g_EsoBuildToggledSetData[name];
		var outName = "ToggleSet:" + name;
		
		if (toggleData.maxTimes != null) 
		{
			saveData.Stats[outName + ":Count"] = "" + toggleData.count;
		}
		
		saveData.Stats[outName] = "" + ConvertBoolToInt(toggleData.enabled);
	}
	
	return saveData;
}


window.ConvertBoolToInt = function (value)
{
	if (value == null) return 0;
	return value ? 1 : 0;
}


window.CreateEsoBuildSkillToggleSaveData = function (saveData, inputValues)
{

	for (var name in g_EsoBuildToggledSkillData)
	{
		var toggleData = g_EsoBuildToggledSkillData[name];
		var outName = "ToggleSkill:" + name;
		
		saveData.Stats[outName] = "" + ConvertBoolToInt(toggleData.enabled);
		
		if (toggleData.maxTimes != null) 
		{
			saveData.Stats[outName + ":Count"] = "" + toggleData.count;
		}
	}
	
	return saveData;
}


window.CreateEsoAbilityRangeString = function (abilityData)
{
	if (abilityData == null) return "";
	var rangeStr = "";
	
	if (abilityData.minRange > 0 && abilityData.maxRange > 0)
		rangeStr = "" + (abilityData.minRange/100) + " - " + (abilityData.maxRange/100) + " meters";
	else if (abilityData.minRange <= 0 && abilityData.maxRange > 0)
		rangeStr = "" + (abilityData.maxRange/100) + " meters";
	else if (abilityData.minRange > 0 && abilityData.maxRange <= 0)
		rangeStr = "Under " + (abilityData.minRange/100) + " meters";
	
	return rangeStr;
}


window.CreateEsoAbilityAreaString = function (abilityData)
{
	if (abilityData == null) return "";
	var areaStr = "";
	
	if (abilityData.angleDistance > 0)
	{
		areaStr = "" + (abilityData.radius/100) + " x " + (abilityData.angleDistance/50) + " meters";
	}
	
	return areaStr;
}


window.CreateEsoBuildActionBarSaveData = function (saveData, inputValues)
{
	saveData.ActionBars = {};
	
	for (var barIndex = 0; barIndex < 4; ++barIndex)
	{
		for (var slotIndex = 0; slotIndex < 6; ++slotIndex)
		{
			if (g_EsoSkillBarData[barIndex] == null) continue;
			
			var slotData = g_EsoSkillBarData[barIndex][slotIndex];
			var index = barIndex*100 + slotIndex + 3;
			var data = {};
			var abilityData = g_SkillsData[slotData.skillId];
			
			data.index = index;
			
			if (slotData.skillId > 0 && abilityData != null)
			{
				data.name = abilityData.name;
				data.icon = abilityData.texture;
				data.abilityId = slotData.skillId;
				data.area = CreateEsoAbilityAreaString(abilityData);
				data.range = CreateEsoAbilityRangeString(abilityData);
				data.radius = abilityData.radius;
				data.castTime = abilityData.castTime;
				data.channelTime = abilityData.channelTime;
				data.duration = abilityData.duration;
				data.target = abilityData.target;
				
				data.description = GetEsoSkillDescription(slotData.skillId, null, false, true, true);
				data.cost = GetEsoSkillCost(slotData.skillId);
			}
			else
			{
				data.name = "";
				data.icon = "";
				data.abilityId = 0;
				data.description = "";
				data.area = "";
				data.cost = "";
				data.range = "";
				data.radius = "";
				data.castTime = "";
				data.channelTime = "";
				data.duration = "";
				data.target = "";
			}
			
			saveData.ActionBars[index] = data;
		}
	}
	
	return saveData;
}


window.CreateEsoBuildCPSaveData = function (saveData, inputValues)
{
	saveData.ChampionPoints = {};
	
	for (var id in g_EsoCpData)
	{
		var cpData = g_EsoCpData[id];
		if (isNaN(parseInt(id))) continue;
		if (cpData.type != "skill") continue;
		
		if (cpData.points == null && !cpData.isUnlocked) continue;
		if (cpData.points == 0) continue;
		
		var data = {};
		var discName = cpData.discipline.replace("_", " ");
		discName = discName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		
		data.name = discName + ":" + cpData.name;
		data.description = cpData.description;
		data.abilityId = cpData.id;
		data.points = 0;
		data.slotIndex = cpData.slotIndex;
		
		if (cpData.points != null)
			data.points = cpData.points;
		else if (cpData.isUnlocked)
			data.points = -1;
		
		saveData.ChampionPoints[id] = data;
	}
	
	return saveData;
}


window.CreateEsoBuildBuffSaveData = function (saveData, inputValues)
{
	var data = {};
	saveData.Buffs = {};
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (!buffData.visible || !(buffData.enabled || buffData.skillEnabled || buffData.buffEnabled)) continue;
		
		data = {};
		
		data.name = buffName;
		data.icon = buffData.icon;
		data.description = buffData.desc.replaceAll("<br/>", " ");
		data.abilityId = 0;
		
		data.enabled = 0;
		if (buffData.enabled) data.enabled += 1;
		if (buffData.skillEnabled) data.enabled += 2;
		if (buffData.buffEnabled) data.enabled += 4;
		
		saveData.Buffs[buffName] = data;
	}
	
	if (inputValues.VampireStage > 0)
	{
		data = {};
		
		if (inputValues.VampireStage == 1)
		{
			data.abilityId = 35771;
		}
		else if (inputValues.VampireStage == 2)
		{
			data.abilityId = 35776;
		}
		else if (inputValues.VampireStage == 3)
		{
			data.abilityId = 35783;
		}
		else if (inputValues.VampireStage == 4)
		{
			data.abilityId = 35792;
		}
		
		data.icon = "/esoui/art/icons/ability_vampire_007.dds";
		data.description = "";
		// data.name = "Stage " + inputValues.VampireStage + " Vampirism"; //
		// Pre Update 27?
		data.name = "Vampire Stage " + inputValues.VampireStage;
		saveData.Buffs[data.name] = data;
	}
	
	if (inputValues.WerewolfStage > 0)
	{
		data = {};
		data.abilityId = 35658;
		data.icon = "/esoui/art/icons/ability_werewolf_010.dds";
		data.description = "You can transform into a savage beast. Take 25% more damage from Poison Attacks while in werewolf form. Increased Stamina, Armor, and Sprinting Speed while in werewolf form.";
		data.name = "Lycanthropy";
		saveData.Buffs[data.name] = data;
	}
		
	if (inputValues.Mundus.Name != "")
	{
		data = {};
		data.abilityId = 0;
		data.icon = "";
		data.description = "";
		data.name = "Boon: " + inputValues.Mundus.Name;
		
		var mundusData = ESO_MUNDUS_BUFF_DATA[inputValues.Mundus.Name];
		
		if (mundusData != null)
		{
			data.abilityId = mundusData.abilityId;
			data.icon = mundusData.icon;
			data.description = mundusData.description;
		}
		
		saveData.Buffs[data.name] = data;
	}
	
	if (inputValues.Mundus.Name2 != "")
	{
		data = {};
		data.abilityId = 0;
		data.icon = "";
		data.description = "";
		data.name = "Boon: " + inputValues.Mundus.Name2;
		
		var mundusData = ESO_MUNDUS_BUFF_DATA[inputValues.Mundus.Name2];
		
		if (mundusData != null)
		{
			data.abilityId = mundusData.abilityId;
			data.icon = mundusData.icon;
			data.description = mundusData.description;
		}
		
		saveData.Buffs[data.name] = data;
	}
	
	var foodData = g_EsoBuildItemData.Food;
	
	if (foodData.itemId > 0)
	{
		data = {};
		data.abilityId = foodData.itemId;	// TODO ?
		data.icon = foodData.icon;
		data.description = foodData.abilityDesc;
		data.name = foodData.name;		// TODO ?
		
		saveData.Buffs[data.name] = data;
	}
	
	return saveData;
}


window.CreateEsoBuildSkillSaveData = function (saveData, inputValues)
{
	saveData.Skills = {};
	
	for (var baseId in g_EsoSkillActiveData)
	{
		var skillData = g_EsoSkillActiveData[baseId];
		var abilityData = g_SkillsData[skillData.abilityId];
		if (abilityData == null) continue;
		
		CreateEsoBuildSaveDataForSkill(saveData, abilityData, skillData);
	}
	
	for (var baseId in g_EsoSkillPassiveData)
	{
		var skillData = g_EsoSkillPassiveData[baseId];
		var abilityData = g_SkillsData[skillData.abilityId];
		if (abilityData == null) continue;
		
		CreateEsoBuildSaveDataForSkill(saveData, abilityData, skillData);
	}
	
	return saveData;
}


window.CreateEsoBuildSaveDataForSkill = function (saveData, abilityData, skillData)
{
	// EsoBuildLog("CreateEsoBuildSaveDataForSkill", abilityData, skillData);
	
	var data = {};
	var abilityId = abilityData.abilityId;
	
	var skillType = ESOBUILD_SKILLTYPES[abilityData.skillType];
	if (skillType == null) skillType = abilityData.skillType;
	
	data.name = skillType + ":" + abilityData.skillLine + ":" + abilityData.name;
	data.type = abilityData.type.toLowerCase();
	if (data.type == "active") data.type = "skill";
	data.icon = abilityData.texture;
	data.abilityId = abilityId;
	
	if (skillData.morph != null)
		data.rank = (+skillData.rank) + (+skillData.morph) * 4;
	else
		data.rank = (+skillData.rank);
	
	data.index = +abilityData.skillIndex;
	data.area = CreateEsoAbilityAreaString(abilityData);
	data.range = CreateEsoAbilityRangeString(abilityData);
	data.radius = abilityData.radius;
	data.castTime = abilityData.castTime;
	data.channelTime = abilityData.channelTime;
	data.duration = abilityData.duration;
	data.target = abilityData.target;
	
	data.description = GetEsoSkillDescription(abilityId, null, false, true, true);
	data.cost = GetEsoSkillCost(abilityId);
	
	saveData.Skills[abilityId] = data;
}


window.CreateEsoBuildItemSaveData = function (saveData, inputValues)
{
	saveData.EquipSlots = {};
	
	for (var slotId in g_EsoBuildItemData) 
	{
		var itemData = g_EsoBuildItemData[slotId];
		if (itemData.itemId == null) continue;
		
		var data = {};
		
		data.index = ESOBUILD_SLOTID_TO_EQUIPSLOT[slotId];
		if (data.index == null) continue;
		
		data.name = itemData.name;
		data.condition = 100;
		data.itemLink = MakeEsoBuildItemLink(slotId);
		data.icon = itemData.icon;
		data.setCount = GetEsoBuildSetCount(itemData.setName);
		data.setName = itemData.setName;
		data.value = itemData.value;
		data.level = itemData.level;
		data.quality = itemData.quality;
		data.type = itemData.type;
		data.equipType = itemData.equipType;
		data.armorType = itemData.armorType;
		data.weaponType = itemData.weaponType;
		data.craftType = itemData.craftType;
		data.stolen = itemData.stolen;
		data.style = itemData.style;
		data.trait = itemData.trait;
		
		saveData.EquipSlots[slotId] = data;
	}
	
	saveData.Stats["AxeWeaponCount"] = "" + inputValues.WeaponAxe;
	saveData.Stats["DaggerWeaponCount"] = "" + inputValues.WeaponDagger;
	saveData.Stats["MaceWeaponCount"] = "" + inputValues.WeaponMace;
	saveData.Stats["SwordWeaponCount"] = "" + inputValues.WeaponSword;
	saveData.Stats["BowWeaponCount"] = "" + inputValues.WeaponBow;
	saveData.Stats["1HWeaponCount"] = "" + inputValues.Weapon1H;
	saveData.Stats["2HWeaponCount"] = "" + inputValues.Weapon2H;
	saveData.Stats["RestStaffWeaponCount"] = "" + inputValues.WeaponRestStaff;
	saveData.Stats["DestStaffWeaponCount"] = "" + inputValues.WeaponDestStaff;
	saveData.Stats["FlameStaffWeaponCount"] = "" + inputValues.WeaponFlameStaff;
	saveData.Stats["ShockStaffWeaponCount"] = "" + inputValues.WeaponShockStaff;
	saveData.Stats["FrostStaffWeaponCount"] = "" + inputValues.WeaponFrostStaff;
	saveData.Stats["1HShieldWeaponCount"] = "" + inputValues.Weapon1HShield;
	saveData.Stats["LightArmorCount"] = "" + inputValues.ArmorLight;
	saveData.Stats["MediumArmorCount"] = "" + inputValues.ArmorMedium;
	saveData.Stats["HeavyArmorCount"] = "" + inputValues.ArmorHeavy;
	saveData.Stats["ArmorTypeCount"] = "" + inputValues.ArmorTypes;
	
	if (g_EsoBuildItemData.Food.link == null)
	{
		saveData.Stats["LastFoodEatenCP"] = "";
		saveData.Stats["LastFoodEatenDesc"] = "";
		saveData.Stats["LastFoodEatenLevel"] = "";
		saveData.Stats["LastFoodEatenLink"] = "";
		saveData.Stats["LastFoodEatenName"] = "";
		saveData.Stats["LastFoodEatenType"] = "";
	}
	else
	{
		if (g_EsoBuildItemData.Food.level <= 50)
			saveData.Stats["LastFoodEatenCP"] = "0";
		else
			saveData.Stats["LastFoodEatenCP"] = "" + (parseInt(g_EsoBuildItemData.Food.level) - 50) * 10;
		
		saveData.Stats["LastFoodEatenLevel"] = g_EsoBuildItemData.Food.level;
		if (saveData.Stats["LastFoodEatenLevel"] > 50) saveData.Stats["LastFoodEatenLevel"] = "50";
		
		saveData.Stats["LastFoodEatenDesc"] = g_EsoBuildItemData.Food.abilityDesc;
		saveData.Stats["LastFoodEatenLink"] = g_EsoBuildItemData.Food.link;
		saveData.Stats["LastFoodEatenName"] = g_EsoBuildItemData.Food.name;
		saveData.Stats["LastFoodEatenType"] = g_EsoBuildItemData.Food.type == 4 ? "Food" : "Drink";
	}
	
	return saveData;
}


window.CreateEsoBuildGeneralSaveData = function (saveData, inputValues)
{
	saveData.Build = g_EsoBuildData;
	saveData.Build.buildName = $("#esotbBuildName").val().trim();
	saveData.Build.name = $("#esotbCharName").val();
	saveData.Build['class'] = inputValues.Class;
	saveData.Build['race'] = inputValues.Race;
	saveData.Build['special'] = "";
	saveData.Build['buildType'] = "Other";
	saveData.Build['level'] = "" + inputValues.EffectiveLevel;
	saveData.Build['alliance'] = $("#esotbAlliance").val();
	
	saveData.Build['championPoints'] = "" + inputValues.CP.TotalPoints;
	if (inputValues.CP.UsedPoints > inputValues.CP.TotalPoints)	saveData.Build['championPoints'] = "" + inputValues.CP.UsedPoints;
	
	saveData.Stats['EffectiveLevel'] = "" + inputValues.EffectiveLevel;
	saveData.Stats['Level'] = "" + inputValues.Level;
	saveData.Stats['Race'] = inputValues.Race;
	saveData.Stats['Class'] = inputValues.Class;
	saveData.Stats['Vampire'] = "" + (inputValues.VampireStage > 0 ? 1 : 0);
	saveData.Stats['VampireStage'] = "" + (inputValues.VampireStage);
	saveData.Stats['Werewolf'] = "" + (inputValues.WerewolfStage > 0 ? 1 : 0);
	saveData.Stats['WerewolfStage'] = "" + inputValues.WerewolfStage;
	saveData.Stats['Alliance'] = saveData.Build['alliance'];
	saveData.Stats['Stealth'] = inputValues.Stealthed;
	saveData.Stats['Cyrodiil'] = inputValues.Cyrodiil;
	saveData.Stats['CP:Level'] = inputValues.CP.TotalPoints;
	saveData.Stats['CP:Used'] = inputValues.CP.UsedPoints;
	saveData.Stats['CP:Enabled'] = inputValues.CP.Enabled;
	saveData.Stats['UsesChampionPoints2'] = 1;
	saveData.Stats['UsePtsRules'] = inputValues.UsePtsRules;
	saveData.Stats['AutoPurchaseRacialPassives'] = inputValues.AutoPurchaseRacialPassives;
	
	inputValues.CPLevel = Math.floor(inputValues.CP.TotalPoints/10);
	if (inputValues.CPLevel > ESO_MAX_CPLEVEL) inputValues.CPLevel = ESO_MAX_CPLEVEL;
	
	if (inputValues.Level == 50)
		inputValues.EffectiveLevel = inputValues.Level + inputValues.CPLevel;
	else
		inputValues.EffectiveLevel = inputValues.Level;
		
	if (inputValues.EffectiveLevel > ESO_MAX_EFFECTIVELEVEL) inputValues.EffectiveLevel = ESO_MAX_EFFECTIVELEVEL;
	if (!inputValues.CP.Enabled && inputValues.EffectiveLevel > 50) inputValues.EffectiveLevel = 50;
	
	saveData.Stats['BaseWalkSpeed'] = inputValues.BaseWalkSpeed;
	saveData.Stats['RidingSpeed'] = parseInt(inputValues.MountSpeedBonus * 100);
	
	saveData.Stats['ActiveAbilityBar'] = "" + inputValues.ActiveAbilityBar;
	saveData.Stats['ActiveWeaponBar'] = "" + inputValues.ActiveWeaponBar;
	
	if (inputValues.Attribute.Magicka > 32)	saveData.Build['buildType'] = "Magicka";
	if (inputValues.Attribute.Stamina > 32)	saveData.Build['buildType'] = "Stamina";
	if (inputValues.Attribute.Health > 32)	saveData.Build['buildType'] = "Health";
	if (inputValues.WerewolfStage > 0) saveData.Build['special'] = "Werewolf";
	if (inputValues.VampireStage > 0) saveData.Build['special'] = "Vampire";
	
	saveData.Stats['BuildType'] = saveData.Build['buildType'];	
	
	saveData.Stats['Target:PenetrationFlat'] = "" + inputValues.Target.PenetrationFlat;
	saveData.Stats['Target:PenetrationFactor'] = "" + (inputValues.Target.PenetrationFactor * 100) + "%";
	saveData.Stats['Target:DefenseBonus'] = "" + (inputValues.Target.DefenseBonus * 100) + "%";
	saveData.Stats['Target:AttackBonus'] = "" + (inputValues.Target.AttackBonus * 100) + "%";
	saveData.Stats['Target:Resistance'] = "" + inputValues.Target.SpellResist;
	saveData.Stats['Target:CritResistFlat'] = "" + inputValues.Target.CritResist;
	saveData.Stats['Target:EffectiveLevel'] = "" + inputValues.Target.EffectiveLevel;
	// saveData.Stats['Target:CritResistFactor'] = "" +
	// (inputValues.Target.CritResistFactor * 100) + "%";
	saveData.Stats['Target:CritDamage'] = "" + (inputValues.Target.CritDamage * 100) + "%";
	saveData.Stats['Target:CritChance'] = "" + (inputValues.Target.CritChance * 100) + "%";
	saveData.Stats['Target:PercentHealth'] = "" + (inputValues.Target.PercentHealth * 100) + "%";
	saveData.Stats['Misc:SpellCost'] = "" + inputValues.Misc.SpellCost;
	
	saveData.Stats['AttributesTotal'] = "" + inputValues.Attribute.TotalPoints;
	saveData.Stats['AttributesHealth'] = "" + inputValues.Attribute.Health;
	saveData.Stats['AttributesMagicka'] = "" + inputValues.Attribute.Magicka;
	saveData.Stats['AttributesStamina'] = "" + inputValues.Attribute.Stamina;
	
	saveData.Stats['Mundus'] = inputValues.Mundus.Name;
	saveData.Stats['Mundus2'] = inputValues.Mundus.Name2;
	
	saveData.Stats['SkillPointsUsed'] = g_EsoSkillPointsUsed;
	saveData.Stats['SkillPointsTotal'] = g_EsoSkillPointsUsed;
	
	saveData.Stats['UseZeroBaseCrit'] = 1;
	
	saveData.Stats['BuildDescription'] = inputValues.BuildDescription;
	
	return saveData;
}


window.HasEsoBuildThirdSkillBar = function ()
{
	return false;
}


window.HasEsoBuildForthSkillBar = function ()
{
	return parseInt($("#esotbWerewolfStage").val()) > 0;
}


window.SetEsoBuildActiveWeaponMatchingSkillBar = function (skillBar)
{
	if (skillBar == 1)
	{
		SetEsoBuildActiveWeaponBar(1);
		return 1;
	}
	
	if (skillBar == 2)
	{
		SetEsoBuildActiveWeaponBar(2);
		return 2;
	}
	
	if (skillBar == 3)
	{
		var ult1 = g_EsoSkillBarData[0][5].origSkillId;
		var ult2 = g_EsoSkillBarData[1][5].origSkillId;
		
		if (ult1 == 30354 && ult2 == 30354) return -1;
		
		if (ult1 == 30354)
		{
			SetEsoBuildActiveWeaponBar(1);
			return 1;
		}
		
		if (ult2 == 30354)
		{
			SetEsoBuildActiveWeaponBar(2);
			return 2;
		}
	}
	
	if (skillBar == 4)
	{
		var ult1 = g_EsoSkillBarData[0][5].origSkillId;
		var ult2 = g_EsoSkillBarData[1][5].origSkillId;
		
		if (ult1 == 42358 && ult2 == 42358) return -1;
		
		if (ult1 == 42358)
		{
			SetEsoBuildActiveWeaponBar(1);
			return 1;
		}
		
		if (ult2 == 42358)
		{
			SetEsoBuildActiveWeaponBar(2);
			return 2;
		}
	}
	
	return -1;
}


window.CreateEsoBuildOffBarSaveData = function (saveData, inputValues)
{
	var CurrentActiveBar = g_EsoBuildActiveAbilityBar;
	var CurrentWeaponBar = g_EsoBuildActiveWeapon;
	
	CreateEsoBuildComputedSaveData(saveData, inputValues, CurrentActiveBar);
	
	if (HasEsoBuildForthSkillBar() && CurrentActiveBar != 4)
	{
		SetEsoBuildActiveSkillBar(4);
		SetEsoBuildActiveWeaponMatchingSkillBar(4);
		UpdateEsoComputedStatsList(true);
		CreateEsoBuildComputedSaveData(saveData, inputValues, 4);
	}
	
	if (HasEsoBuildThirdSkillBar() && CurrentActiveBar != 3)
	{
		SetEsoBuildActiveSkillBar(3);
		SetEsoBuildActiveWeaponMatchingSkillBar(3);
		UpdateEsoComputedStatsList(true);
		CreateEsoBuildComputedSaveData(saveData, inputValues, 3);
	}
	
	if (CurrentActiveBar != 1)
	{
		SetEsoBuildActiveWeaponBar(1);
		SetEsoBuildActiveSkillBar(1);
		UpdateEsoComputedStatsList(true);
		CreateEsoBuildComputedSaveData(saveData, inputValues, 1);
	}
	
	if (CurrentActiveBar != 2)
	{
		SetEsoBuildActiveWeaponBar(2);
		SetEsoBuildActiveSkillBar(2);
		UpdateEsoComputedStatsList(true);
		CreateEsoBuildComputedSaveData(saveData, inputValues, 2);
	}
	
	SetEsoBuildActiveWeaponBar(CurrentWeaponBar);
	SetEsoBuildActiveSkillBar(CurrentActiveBar);
	UpdateEsoComputedStatsList(true);
}


window.CreateEsoBuildComputedSaveData = function (saveData, inputValues, barIndex)
{
	var prefix = "";
	
	if (barIndex != null)
	{
		prefix = "Bar" + barIndex + ":";
	}
	
	for (var name in g_EsoComputedStats)
	{
		AddEsoBuildComputedStatToSaveData(saveData, name, prefix + name, true);
	}
	
	AddEsoBuildComputedStatToSaveData(saveData, "Health", prefix + "Health");
	AddEsoBuildComputedStatToSaveData(saveData, "Magicka", prefix + "Magicka");
	AddEsoBuildComputedStatToSaveData(saveData, "Stamina", prefix + "Stamina");
	
	AddEsoBuildComputedStatToSaveData(saveData, "HealthRegen", prefix + "HealthRegenCombat");
	AddEsoBuildComputedStatToSaveData(saveData, "MagickaRegen", prefix + "MagickaRegenCombat");
	AddEsoBuildComputedStatToSaveData(saveData, "StaminaRegen", prefix + "StaminaRegenCombat");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellDamage", prefix + "SpellPower");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponDamage", prefix + "WeaponPower");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponDamage", prefix + "Power");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellCrit", prefix + "SpellCritical", null, "critical");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "WeaponCritical", null, "critical");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "CriticalStrike", null, "critical");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellCrit", prefix + "SpellCritPercent");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "WeaponCritPercent");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "WeaponCritPercent");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellResist", prefix + "SpellResist");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalResist", prefix + "PhysicalResist");
	AddEsoBuildComputedStatToSaveData(saveData, "CritResist", prefix + "CriticalResistance");
	AddEsoBuildComputedStatToSaveData(saveData, "FrostResist", prefix + "DamageResistFrost");
	AddEsoBuildComputedStatToSaveData(saveData, "DiseaseResist", prefix + "DamageResistDisease");
	AddEsoBuildComputedStatToSaveData(saveData, "FlameResist", prefix + "DamageResistFire");
	AddEsoBuildComputedStatToSaveData(saveData, "SpellResist", prefix + "DamageResistMagic");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalResist", prefix + "DamageResistPhysical");
	AddEsoBuildComputedStatToSaveData(saveData, "PoisonResist", prefix + "DamageResistPoison");
	AddEsoBuildComputedStatToSaveData(saveData, "ShockResist", prefix + "DamageResistShock");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellPenetration", prefix + "SpellPenetration");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalPenetration", prefix + "PhysicalPenetration");
	
	saveData.Stats[prefix + "ActiveWeaponBar"] = g_EsoBuildActiveWeapon;
	
	return saveData;
}


window.GetEsoBuildSetCount = function (setName)
{
	if (setName == null || setName == "") return 0;
	if (g_EsoBuildSetData[setName] == null) return 0;
	return g_EsoBuildSetData[setName].count;
}


window.AddEsoBuildComputedStatToSaveData = function (saveData, name, outName, addComputed, type)
{
	var statData = g_EsoComputedStats[name];
	if (statData == null) return;
	
	var value = statData.value;
	
	if (type == "critical")
	{
		value = ConvertEsoPercentCritToFlat(value);
	}
	else if (statData.display == "%" || type == "%")
	{
		value = Math.round(value * 1000)/10;
	}
	
	if (outName == null) outName = name;
	var statId = outName;
	if (addComputed === true) statId = "Computed:" + outName;
	
	saveData.Stats[statId] = "" + value;
}


window.SetEsoBuildSaveResults = function (text)
{
	$("#esotbSaveResults").html(text);
}


window.OnEsoBuildSave = function (e)
{
	SetEsoBuildSaveResults("Saving build...");
	
	setTimeout(RequestEsoBuildSave, 50);
}


window.OnEsoBuildDelete = function (e)
{
	var $form = $('<form>', {
        action: '//en.uesp.net/wiki/Special:EsoBuildData',
        method: 'post'
    });
	
    $('<input>').attr({
             type: "hidden",
             name: "id",
             value: g_EsoBuildData.id
         }).appendTo($form);
    
    $('<input>').attr({
        type: "hidden",
        name: "action",
        value: "delete"
    }).appendTo($form);

    $form.appendTo('body').submit();
}


window.OnEsoBuildCreateCopy = function (e)
{
	var buildName = $("#esotbBuildName").val().trim();
	if (!buildName.endsWith(" (Copy)")) $("#esotbBuildName").val(buildName + " (Copy)");
	
	SetEsoBuildSaveResults("Saving new build...");

	setTimeout(RequestEsoBuildCreateCopy, 50);
}


window.EsoBuildLog = function ()
{
	if (console == null) return;
	if (console.log == null) return;
	
	console.log.apply(console, arguments);
}


var g_EsoBuildLastSetIndex = -1;


window.EsoBuildFindSetName = function (setName)
{
	setName = setName.toLowerCase();
	
	for (var i in g_EsoBuildSetNames)
	{
		if (g_EsoBuildSetNames[i].toLowerCase().indexOf(setName) != -1)
		{
			return i
		}
	}
	
	return -1;
}


window.EsoBuildEquipSet = function (setIndexOrName)
{
	if (g_EsoBuildSetNames.length <= 0) return EsoBuildLog("Error: No set names currently loaded!");
	
	var setIndex = -1;
	
	if (typeof setIndexOrName == "string")
	{
		setIndex = EsoBuildFindSetName(setIndexOrName);
		
		if (setIndex < 0)
		{
			EsoBuildLog("No match for set name '" + setIndexOrName + "'!");
			return;
		}
	}
	else if (typeof setIndexOrName == "number")
	{
		setIndex = parseInt(setIndexOrName);
	}
	else
	{
		EsoBuildLog("Unknown input to EsoBuildEquipSet()!")
		return;
	}	
	
	if (setIndex < 0) return EsoBuildLog("Error: Invalid set index!");
	if (setIndex >= g_EsoBuildSetNames.length) return EsoBuildLog("Error: Set index exceeds maximum of ", g_EsoBuildSetNames.length, "!");
	
	g_EsoBuildLastSetIndex = setIndex;
	var setName = g_EsoBuildSetNames[setIndex];
	
	g_EsoBuildDumpSetData = setName;
	// EsoBuildLog("Loading items for set '" + setName + "'...");
	
	EquipSetItem(setName, "Chest", 66, 5);
	EquipSetItem(setName, "Waist", 66, 5);
	EquipSetItem(setName, "Hands", 66, 5);
	EquipSetItem(setName, "Feet", 66, 5);
	EquipSetItem(setName, "Legs", 66, 5);
	EquipSetItem(setName, "Head", 66, 5);
	EquipSetItem(setName, "Shoulders", 66, 5);
	EquipSetItem(setName, "MainHand1", 66, 5);
	EquipSetItem(setName, "OffHand1", 66, 5);
	EquipSetItem(setName, "Neck", 66, 5);
	EquipSetItem(setName, "Ring1", 66, 5);
	EquipSetItem(setName, "Ring2", 66, 5);
}


	// TODO: Better to specify exact internal level/subtype? 
window.EquipSetItem = function (setName, slotId, level, quality)
{
	UnequipEsoItemSlot(slotId, false);
	
	var equipSlot = ESOBUILD_SLOTID_TO_EQUIPSLOT[slotId];
	var equipType = ESOBUILD_SLOTID_TO_EQUIPTYPE[slotId];
	
	if (equipSlot == null || equipType == null) return EsoBuildLog("Invalid slotId '" + slotId + "'!");
	
	var queryParams = {
			"equiptype" : equipType,
			"level" : level,
			"quality" : quality,
			"setname" : setName,
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
		
	$.ajax("//esolog.uesp.net/getSetItemData.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoSetItemDataReceive(data, status, xhr, slotId); }).
		fail(function(xhr, status, errorMsg) { OnEsoSetItemDataError(xhr, status, errorMsg, slotId); });
}


window.OnEsoSetItemDataReceive = function (data, status, xhr, slotId)
{
	// EsoBuildLog("OnEsoSetItemDataReceive", itemData);
	
	if (data.minedItem == null || data.minedItem[0] == null) return EsoBuildLog("No item data received for slot '" + slotId + "'!");
	if (slotId == null || slotId == "") return EsoBuildLog("Invalid slotId '" + slotId + "' received!");
	
	var itemData = data.minedItem[0];
	
	var element = $("#esotbItem" + slotId);
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
		
	var iconName = itemData.icon.replace(".dds", ".png");
	var iconUrl = ESO_ICON_URL + iconName;
	var niceName = itemData.name.charAt(0).toUpperCase() + itemData.name.slice(1);
	
	if (iconName == "" || iconName == "/") iconUrl = "";
	
	iconElement.attr("src", iconUrl);
	labelElement.text(niceName);
	
	iconElement.attr("itemid", itemData.itemId);
	iconElement.attr("intlevel", itemData.internalLevel);
	iconElement.attr("inttype", itemData.internalSubtype);
	iconElement.attr("setcount", "0");
	iconElement.attr("enchantfactor", "0");
	iconElement.attr("extraarmor", "0");
	iconElement.attr("trait", "0");
	
	UpdateEsoItemTraitList(slotId, itemData.trait);
	UpdateWeaponEquipSlots(itemData, slotId);
	
	g_EsoBuildItemData[slotId] = itemData; 
		
	GetEsoSetMaxData(g_EsoBuildItemData[slotId]);
	UpdateEsoComputedStatsList(false);
}


window.OnEsoSetItemDataError = function (xhr, status, errorMsg, slotId)
{
	EsoBuildLog("OnEsoSetItemDataError", errorMsg);
}


window.EsoEditBuildChangeAllArmorEnchants = function (itemId, internalType, internalLevel, element)
{
	var itemData = {};
	
	itemData.itemId = itemId;
	itemData.type = 1;
	itemData.internalLevel = internalLevel;
	itemData.internalSubtype = internalType;
	itemData.level = 66;
	itemData.quality = 5;
	
	RequestEsoEnchantData(itemData, element);	
}


window.OnEsoEditBuildSetupArmorEnchant = function (element)
{
	var form = $("#esotbItemSetupArmorEnchant");
	var formValue = form.val().toLowerCase();
	
	$("#esotbItemSetupArmorEnchantMsg").text("");
	
	if (formValue == "none")
	{
		UpdateAllArmorEnchantData({});
		UpdateEsoComputedStatsList(false);
		return;
	}
	else if (formValue == "health")
	{	
		EsoEditBuildChangeAllArmorEnchants(26580, 370, 50, form);
	}
	else if (formValue == "magicka")
	{
		EsoEditBuildChangeAllArmorEnchants(26582, 370, 50, form);
	}
	else if (formValue == "stamina")
	{
		EsoEditBuildChangeAllArmorEnchants(26588, 370, 50, form);
	}
	else if (formValue == "prismatic")
	{
		EsoEditBuildChangeAllArmorEnchants(68343, 370, 50, form);
	}

}


window.UpdateAllArmorEnchantData = function (itemData)
{
	updateCount = 7;
		
	UpdateEnchantSlotData('Chest', itemData);
	UpdateEnchantSlotData('Head', itemData);
	UpdateEnchantSlotData('Feet', itemData);
	UpdateEnchantSlotData('Legs', itemData);
	UpdateEnchantSlotData('Waist', itemData);
	UpdateEnchantSlotData('Hands', itemData);
	UpdateEnchantSlotData('Shoulders', itemData);
	
	if (g_EsoBuildItemData['OffHand1'].weaponType == 14) { ++updateCount; UpdateEnchantSlotData('OffHand1', itemData); }
	if (g_EsoBuildItemData['OffHand2'].weaponType == 14) { ++updateCount; UpdateEnchantSlotData('OffHand2', itemData); }
	
	$("#esotbItemSetupArmorEnchantMsg").text("Updated " + updateCount + " armor enchantments!");
}


window.UpdateEnchantSlotData = function (slotId, itemData, element)
{
	var itemId = itemData.itemId;
	var level = itemData.internalLevel;
	var subtype = itemData.internalSubtype;
	
	//if (element == null) element = $("#esotbItems").find(".esotbItem[slotid='" + slotId + "']");
	if (element == null) element = $("#esotbItems").find("#esotbItem" + slotId);
	if (itemId == null) itemId = 0;
	if (level == null) level = 0;
	if (subtype == null) subtype = 0;
	
	g_EsoBuildEnchantData[slotId] = itemData;
	
	var iconElement = $(element).find(".esotbItemIcon");
	iconElement.attr("enchantid", itemId);
	iconElement.attr("enchantintlevel", level);
	iconElement.attr("enchantinttype", subtype);
}


window.OnEsoEditBuildSetupArmorTrait = function (element)
{
	var form = $("#esotbItemSetupArmorTrait");
	var formValue = form.val();
	
	$("#esotbItemSetupArmorTraitMsg").text("");
	
	EsoEditBuildChangeAllArmorTraits(formValue);
}


window.OnEsoEditBuildSetupJewelryTrait = function (element)
{
	var form = $("#esotbItemSetupJewelryTrait");
	var formValue = form.val();
	
	$("#esotbItemSetupJewelryTraitMsg").text("");
	
	EsoEditBuildChangJewelryTraits(formValue);
}


window.OnEsoEditBuildSetupWeaponTrait = function (element)
{
	var form = $("#esotbItemSetupWeaponTrait");
	var formValue = form.val();
	
	$("#esotbItemSetupWeaponTraitMsg").text("");
	
	EsoEditBuildChangWeaponTraits(formValue);
}


window.EsoEditBuildChangeAllArmorTraits = function (newTrait)
{
	var msgElement = $("#esotbItemSetupArmorTraitMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotTrait('Chest', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Head', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Feet', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Legs', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Waist', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Hands', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Shoulders', newTrait, msgElement)) ++count;
	
	if (g_EsoBuildItemData['OffHand1'].weaponType == 14) 
	{
		if (EsoBuildChangeSlotTrait('OffHand1', newTrait, msgElement)) ++count;
	}
	
	if (g_EsoBuildItemData['OffHand2'].weaponType == 14) 
	{
		if (EsoBuildChangeSlotTrait('OffHand2', newTrait, msgElement)) ++count;
	}
	
	msgElement.text("Updating " + count + " armor to trait " + newTrait + "... ");
}


window.EsoEditBuildChangJewelryTraits = function (newTrait)
{
	var msgElement = $("#esotbItemSetupJewelryTraitMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotTrait('Neck', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Ring1', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('Ring2', newTrait, msgElement)) ++count;
	
	msgElement.text("Updating " + count + " jewelry to trait " + newTrait + "... ");
}


window.EsoEditBuildChangWeaponTraits = function (newTrait)
{
	var msgElement = $("#esotbItemSetupWeaponTraitMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotTrait('MainHand1', newTrait, msgElement)) ++count;
	if (EsoBuildChangeSlotTrait('MainHand2', newTrait, msgElement)) ++count;
	
	if (g_EsoBuildItemData['OffHand1'].weaponType != 14) 
	{
		if (EsoBuildChangeSlotTrait('OffHand1', newTrait, msgElement)) ++count;
	}
	
	if (g_EsoBuildItemData['OffHand2'].weaponType != 14) 
	{
		if (EsoBuildChangeSlotTrait('OffHand2', newTrait, msgElement)) ++count;
	}
	
	msgElement.text("Updating " + count + " weapons to trait " + newTrait + "... ");
}


window.EsoBuildChangeSlotTrait = function (slotId, newTrait, msgElement)
{
	if (g_EsoBuildItemData[slotId] == null) return false;
	if (g_EsoBuildItemData[slotId].itemId == null) return false;
	if (g_EsoBuildItemData[slotId].trait == newTrait) return true;
	
	return RequestEsoChangeTraitData(g_EsoBuildItemData[slotId], newTrait, slotId, msgElement);
}


window.OnEsoEditBuildSetupArmorTypes = function (element)
{
	var form = $("#esotbItemSetupArmorTypes");
	var formValue = form.val();
	var numLight = Math.floor(formValue/100) % 10;
	var numMedium = Math.floor(formValue/10) % 10;
	var numHeavy = Math.floor(formValue) % 10;
	
	$("#esotbItemSetupArmorTypeMsg").text("");
	
	EsoEditBuildChangeArmorTypes(numLight, numMedium, numHeavy);
}


window.EsoEditBuildChangeArmorTypes = function (numLight, numMedium, numHeavy)
{
	// 1 => "Light",
	// 2 => "Medium",
	// 3 => "Heavy",
	var slots = [ "Chest", "Legs", "Head", "Feet", "Shoulders", "Hands", "Waist" ];
	var count = 0;
	var origNumLight = numLight;
	var origNumMedium = numMedium;
	var origNumHeavy = numHeavy;
	
	// EsoBuildLog("EsoEditBuildChangeArmorTypes", numLight, numMedium,
	// numHeavy);
	
	for (var i in slots)
	{
		var slot = slots[i];
		
		if (numHeavy > 0)
		{
			if (EsoBuildChangeArmorType(slot, 3)) ++count;
			--numHeavy;
		}
		else if (numMedium > 0)
		{
			if (EsoBuildChangeArmorType(slot, 2)) ++count;
			--numMedium;
		}
		else if (numLight > 0)
		{
			if (EsoBuildChangeArmorType(slot, 1)) ++count;
			--numLight;
		}
		else 
		{
			// Do nothing
		}
	}
	
	$("#esotbItemSetupArmorTypeMsg").text("Updating " + count + " armor to " + origNumLight + "/" + origNumMedium + "/" + origNumHeavy + "... ");
}


window.EsoBuildChangeArmorType = function (slotId, armorType)
{
	if (g_EsoBuildItemData[slotId] == null) return false;
	if (g_EsoBuildItemData[slotId].itemId == null) return false;
	if (g_EsoBuildItemData[slotId].armorType == armorType) return true;
	
	return RequestEsoChangeArmorTypeData(g_EsoBuildItemData[slotId], armorType, slotId);
}


window.OnEsoEditBuildSetupAllQualities = function (element)
{
	var form = $("#esotbItemSetupAllQualities");
	var formValue = form.val();
	
	$("#esotbItemSetupAllQualitiesMsg").text("");
	
	EsoEditBuildChangeAllQualities(formValue);
}


window.OnEsoEditBuildSetupWeaponQualities = function (element)
{
	var form = $("#esotbItemSetupWeaponQualities");
	var formValue = form.val();
	
	$("#esotbItemSetupWeaponQualitiesMsg").text("");
	
	EsoEditBuildChangeWeaponQualities(formValue);
}


window.OnEsoEditBuildSetupArmorQualities = function (element)
{
	var form = $("#esotbItemSetupArmorQualities");
	var formValue = form.val();
	
	$("#esotbItemSetupArmorQualitiesMsg").text("");
	
	EsoEditBuildChangeArmorQualities(formValue);
}


window.OnEsoEditBuildSetupEnchantQualities = function (element)
{
	var form = $("#esotbItemSetupEnchantQualities");
	var formValue = form.val();
	
	$("#esotbItemSetupEnchantQualitiesMsg").text("");
	
	EsoEditBuildChangeEnchantQualities(formValue);
}


window.OnEsoEditBuildSetupJewelryQualities = function (element)
{
	var form = $("#esotbItemSetupJewelryQualities");
	var formValue = form.val();
	
	$("#esotbItemSetupJewelryQualitiesMsg").text("");
	
	EsoEditBuildChangeJewelryQualities(formValue);
}


window.EsoEditBuildChangeAllQualities = function (newQuality)
{
	var msgElement = $("#esotbItemSetupAllQualitiesMsg");
	var count = 0;
		
	if (EsoBuildChangeSlotQuality('Chest', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Head', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Feet', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Legs', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Waist', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Hands', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Shoulders', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeSlotQuality('Neck', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Ring1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Ring2', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeSlotQuality('MainHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('MainHand2', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('OffHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('OffHand2', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantQuality('Chest', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Head', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Feet', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Legs', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Waist', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Hands', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Shoulders', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantQuality('Neck', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Ring1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Ring2', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantQuality('MainHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('MainHand2', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('OffHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('OffHand2', newQuality, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " items/enchants to quality " + newQuality + "... ");
}


window.EsoEditBuildChangeJewelryQualities = function (newQuality)
{
	var msgElement = $("#esotbItemSetupJewelryQualitiesMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotQuality('Neck', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Ring1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Ring2', newQuality, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " jewelry to quality " + newQuality + "... ");
}


window.EsoEditBuildChangeArmorQualities = function (newQuality)
{
	var msgElement = $("#esotbItemSetupArmorQualitiesMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotQuality('Chest', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Head', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Feet', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Legs', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Waist', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Hands', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('Shoulders', newQuality, msgElement)) ++count;
	
	if (g_EsoBuildItemData['OffHand1'].weaponType == 14) 
	{
		if (EsoBuildChangeSlotQuality('OffHand1', newQuality, msgElement)) ++count;
	}
	
	if (g_EsoBuildItemData['OffHand2'].weaponType == 14) 
	{
		if (EsoBuildChangeSlotQuality('OffHand2', newQuality, msgElement)) ++count;
	}
		
	$(msgElement).text("Updating " + count + " armor to quality " + newQuality + "... ");
}


window.EsoEditBuildChangeWeaponQualities = function (newQuality)
{
	var msgElement = $("#esotbItemSetupWeaponQualitiesMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotQuality('MainHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeSlotQuality('MainHand2', newQuality, msgElement)) ++count;
	
	if (g_EsoBuildItemData['OffHand1'].weaponType != 14) 
	{
		if (EsoBuildChangeSlotQuality('OffHand1', newQuality, msgElement)) ++count;
	}
	
	if (g_EsoBuildItemData['OffHand2'].weaponType != 14) 
	{
		if (EsoBuildChangeSlotQuality('OffHand2', newQuality, msgElement)) ++count;
	}
		
	$(msgElement).text("Updating " + count + " weapons to quality " + newQuality + "... ");
}


window.EsoEditBuildChangeEnchantQualities = function (newQuality)
{
	var msgElement = $("#esotbItemSetupEnchantQualitiesMsg");
	var count = 0;
	
	if (EsoBuildChangeEnchantQuality('Chest', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Head', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Feet', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Legs', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Waist', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Hands', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Shoulders', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantQuality('Neck', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Ring1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('Ring2', newQuality, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantQuality('MainHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('MainHand2', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('OffHand1', newQuality, msgElement)) ++count;
	if (EsoBuildChangeEnchantQuality('OffHand2', newQuality, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " enchantments to quality " + newQuality + "... ");
}


window.EsoBuildChangeSlotLevel = function (slotId, newLevel, msgElement)
{
	if (g_EsoBuildItemData[slotId] == null) return false;
	if (g_EsoBuildItemData[slotId].itemId == null) return false;
	if (g_EsoBuildItemData[slotId].level == newLevel) return true;

	return RequestEsoChangeItemLevelData(g_EsoBuildItemData[slotId], newLevel, slotId, msgElement);
}


window.EsoBuildChangeEnchantLevel = function (slotId, newLevel, msgElement)
{
	if (g_EsoBuildEnchantData[slotId] == null) return false;
	if (g_EsoBuildEnchantData[slotId].itemId == null) return false;
	if (g_EsoBuildEnchantData[slotId].level == newLevel) return true;
	
	return RequestEsoChangeEnchantLevelData(g_EsoBuildItemData[slotId], newLevel, slotId, msgElement);
}


window.EsoBuildChangeSlotQuality = function (slotId, newQuality, msgElement)
{
	if (g_EsoBuildItemData[slotId] == null) return false;
	if (g_EsoBuildItemData[slotId].itemId == null) return false;
	if (g_EsoBuildItemData[slotId].quality == newQuality) return true;
	
	return RequestEsoChangeItemQualityData(g_EsoBuildItemData[slotId], newQuality, slotId, msgElement);
}


window.EsoBuildChangeEnchantQuality = function (slotId, newQuality, msgElement)
{
	if (g_EsoBuildEnchantData[slotId] == null) return false;
	if (g_EsoBuildEnchantData[slotId].itemId == null) return false;
	if (g_EsoBuildEnchantData[slotId].quality == newQuality) return true;
	
	return RequestEsoChangeEnchantQualityData(g_EsoBuildEnchantData[slotId], newQuality, slotId, msgElement);
}


window.OnEsoEditBuildSetupAllLevel = function (element)
{
	var form = $("#esotbItemSetupAllLevel");
	var formValue = form.val();
	
	$("#esotbItemSetupAllLevelMsg").text("");
	
	EsoEditBuildChangeAllLevel(formValue);
}


window.OnEsoEditBuildSetupMythicSet = function (element)
{
	var msgElement = $("#esotbItemSetupMythicSetMsg");
	var count = 0;
	
	var mythicSet = $("#esotbItemSetupMythicSet").val();
	var selected = $("#esotbItemSetupMythicSet").children("option:selected");
	
	var slotId = selected.attr("slotid");
	EsoBuildLog("Mythic Slot Id", slotId);
	
	msgElement.text("");
	
	// function (slotId, monsterSet, equipType, armorType, weaponType, level,
	// quality, trait, msgElement)
	if (RequestEsoFindSetItemData(slotId, mythicSet, null, null, null, 66, 6, null, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " item to mythic set " + mythicSet + "... ");
}


window.OnEsoEditBuildSetupMonsterSet = function (element)
{
	var msgElement = $("#esotbItemSetupMonsterSetMsg");
	var count = 0;
	
	var monsterSet = $("#esotbItemSetupMonsterSet").val();
	var qualityVal = parseInt($("#esotbItemSetupMonsterSetQuality").val());
	var headArmorType = parseInt($("#esotbItemSetupMonsterSetHeadType").val());
	var shoulderArmorType = parseInt($("#esotbItemSetupMonsterSetShoulderType").val());
	var headTrait = parseInt($("#esotbItemSetupMonsterSetHeadTrait").val());
	var shoulderTrait = parseInt($("#esotbItemSetupMonsterSetShoulderTrait").val());
	
	msgElement.text("");
	
	if (headArmorType == 0) headArmorType = null;
	if (shoulderArmorType == 0) shoulderArmorType = null;
	if (headTrait == 0) headTrait = null;
	if (shoulderTrait == 0) shoulderTrait = null;
		
	if (RequestEsoFindSetItemData('Head', monsterSet, 1, headArmorType, null, 66, qualityVal, headTrait, msgElement)) ++count;
	if (RequestEsoFindSetItemData('Shoulders', monsterSet, 4, shoulderArmorType, null, 66, qualityVal, shoulderTrait, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " items to monster set " + monsterSet + "... ");
}


window.OnEsoEditBuildSetupEquipSet = function (element)
{
	var msgElement = $("#esotbItemSetupEquipSetMsg");
	var count = 0;
	
	var setName = $("#esotbItemSetupEquipSet").val();
	var locationVal = parseInt($("#esotbItemSetupEquipSetLocation").val());
	var qualityVal = parseInt($("#esotbItemSetupEquipSetQuality").val());
	var armorTraitVal = parseInt($("#esotbItemSetupEquipSetTraitArmor").val());
	var weaponTraitVal = parseInt($("#esotbItemSetupEquipSetTraitWeapon").val());
	var jewelTraitVal = parseInt($("#esotbItemSetupEquipSetTraitJewelry").val());
	var armorTypeVal = parseInt($("#esotbItemSetupEquipSetArmorType").val());
	var weaponTypeVal = parseInt($("#esotbItemSetupEquipSetWeaponType").val());
	var useOffhandWeapons = $("#esotbItemSetupEquipSetOffHandWeapon").is(':checked');
	
	var armorTypes = [null, null, null, null, null];
	var weaponTypes = [null, null];
	var weaponEquipTypes = ["5", "5,7"];
	var traits = [null, null, null, null, null];
	
	var weaponSlot1 = "MainHand1";
	var weaponSlot2 = "OffHand1";
	
	if (useOffhandWeapons)
	{
		weaponSlot1 = "MainHand2";
		weaponSlot2 = "OffHand2";
	}
	
	if (armorTypeVal == 0)
	{
		armorTypes[0] = null;
		armorTypes[1] = null;
		armorTypes[2] = null;
		armorTypes[3] = null;
		armorTypes[4] = null;
	}
	else if (armorTypeVal == 500)
	{
		armorTypes[0] = 1;
		armorTypes[1] = 1;
		armorTypes[2] = 1;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 50)
	{
		armorTypes[0] = 2;
		armorTypes[1] = 2;
		armorTypes[2] = 2;
		armorTypes[3] = 2;
		armorTypes[4] = 2;
	}
	else if (armorTypeVal == 5)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 3;
		armorTypes[3] = 3;
		armorTypes[4] = 3;
	}
	else if (armorTypeVal == 311)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 2;
		armorTypes[2] = 1;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	} 
	else if (armorTypeVal == 320)
	{
		armorTypes[0] = 2;
		armorTypes[1] = 2;
		armorTypes[2] = 1;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 302)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 1;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	} 
	else if (armorTypeVal == 131)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 2;
		armorTypes[2] = 2;
		armorTypes[3] = 2;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 230)
	{
		armorTypes[0] = 2;
		armorTypes[1] = 2;
		armorTypes[2] = 2;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 032)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 2;
		armorTypes[3] = 2;
		armorTypes[4] = 2;
	}
	else if (armorTypeVal == 113)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 3;
		armorTypes[3] = 2;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 203)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 3;
		armorTypes[3] = 1;
		armorTypes[4] = 1;
	}
	else if (armorTypeVal == 023)
	{
		armorTypes[0] = 3;
		armorTypes[1] = 3;
		armorTypes[2] = 3;
		armorTypes[3] = 2;
		armorTypes[4] = 2;
	}

	if (armorTraitVal == 0)
	{
		traits[0] = null;
		traits[1] = null;
		traits[2] = null;
		traits[3] = null;
		traits[4] = null;
	}
	else if (armorTraitVal == 1)
	{
		traits[0] = 18;
		traits[1] = 18;
		traits[2] = 18;
		traits[3] = 18;
		traits[4] = 18;
	}
	else if (armorTraitVal == 2)
	{
		traits[0] = 16;
		traits[1] = 16;
		traits[2] = 18;
		traits[3] = 18;
		traits[4] = 18;
	}
	else if (armorTraitVal == 3)
	{
		traits[0] = 16;
		traits[1] = 16;
		traits[2] = 16;
		traits[3] = 16;
		traits[4] = 16;
	}
	else if (armorTraitVal == 4)
	{
		traits[0] = 13;
		traits[1] = 13;
		traits[2] = 13;
		traits[3] = 13;
		traits[4] = 13;
	}
	else if (armorTraitVal == 5)
	{
		traits[0] = 11;
		traits[1] = 11;
		traits[2] = 11;
		traits[3] = 11;
		traits[4] = 11;
	}
	else if (armorTraitVal == 6)
	{
		traits[0] = 25;
		traits[1] = 25;
		traits[2] = 25;
		traits[3] = 25;
		traits[4] = 25;
	}
	
	if (locationVal > 1)
	{
		if (weaponTypeVal == 0)
		{
			weaponTypes[0] = null;
			weaponTypes[1] = null;
		}
		else if (weaponTypeVal == 1)
		{
			weaponTypes[0] = 11;
			weaponTypes[1] = 11;
		}
		else if (weaponTypeVal == 2)
		{
			weaponTypes[0] = 3;
			weaponTypes[1] = 3;
		}
		else if (weaponTypeVal == 3)
		{
			weaponTypes[0] = 1;
			weaponTypes[1] = 1;
		}
		else if (weaponTypeVal == 4)
		{
			weaponTypes[0] = 11;
			weaponTypes[1] = 1;
		}
		else if (weaponTypeVal == 5)
		{
			weaponTypes[0] = 3;
			weaponTypes[1] = 14;
		}
		else if (weaponTypeVal == 6)
		{
			weaponTypes[0] = 4;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 7)
		{
			weaponTypes[0] = 5;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 8)
		{
			weaponTypes[0] = 6;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 9)
		{
			weaponTypes[0] = 8;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 10)
		{
			weaponTypes[0] = 12;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 11)
		{
			weaponTypes[0] = 13;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 12)
		{
			weaponTypes[0] = 15;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		else if (weaponTypeVal == 13)
		{
			weaponTypes[0] = 9;
			weaponTypes[1] = -1;
			weaponEquipTypes[0] = 6;
		}
		
		if (jewelTraitVal == 0)
		{
			traits[0] = null;
			traits[1] = null;
			traits[2] = null;
		}
		else if (jewelTraitVal == 1)
		{
			traits[0] = 21;
			traits[1] = 21;
			traits[2] = 21;
		}
		else if (jewelTraitVal == 2)
		{
			traits[0] = 23;
			traits[1] = 23;
			traits[2] = 23;
		}
		else if (jewelTraitVal == 3)
		{
			traits[0] = 22;
			traits[1] = 22;
			traits[2] = 22;
		}
		
		if (weaponTraitVal == 0)
		{
			traits[3] = null;
			if (weaponTypeVal != 5) traits[4] = null;
		}
		else if (weaponTraitVal == 1)
		{
			traits[3] = 7;
			if (weaponTypeVal != 5) traits[4] = 7;
		}
		else if (weaponTraitVal == 2)
		{
			traits[3] = 5;
			if (weaponTypeVal != 5) traits[4] = 5;
		}
		else if (weaponTraitVal == 3)
		{
			traits[3] = 26;
			if (weaponTypeVal != 5) traits[4] = 26;
		}
	}
	
	msgElement.text("");
	
	if (locationVal == 1)
	{
		if (RequestEsoFindSetItemData('Chest', setName,  3, armorTypes[0], null, 66, qualityVal, traits[0], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Legs',  setName,  9, armorTypes[1], null, 66, qualityVal, traits[1], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Waist', setName,  8, armorTypes[2], null, 66, qualityVal, traits[2], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Feet',  setName, 10, armorTypes[3], null, 66, qualityVal, traits[3], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Hands', setName, 13, armorTypes[4], null, 66, qualityVal, traits[4], msgElement)) ++count;
	}
	else if (locationVal == 2)
	{
		if (RequestEsoFindSetItemData('Neck',      setName,     2, null, null, 66, qualityVal, traits[0], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Ring1',     setName,    12, null, null, 66, qualityVal, traits[1], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Ring2',     setName,    12, null, null, 66, qualityVal, traits[2], msgElement)) ++count;
		if (RequestEsoFindSetItemData(weaponSlot1, setName,     weaponEquipTypes[0], null, weaponTypes[0], 66, qualityVal, traits[3], msgElement)) ++count;
		
		if (weaponTypes[1] > 0) {
			if (RequestEsoFindSetItemData(weaponSlot2,  setName, weaponEquipTypes[1], null, weaponTypes[1], 66, qualityVal, traits[4], msgElement, onUespSetNoItemsFoundCallback)) ++count;
		}
		else {
			UnequipEsoItemSlot(weaponSlot2, false);
		}
	}
	else if (locationVal == 3)
	{
		if (RequestEsoFindSetItemData('Neck',      setName,     2, null, null, 66, qualityVal, traits[0], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Ring1',     setName,    12, null, null, 66, qualityVal, traits[1], msgElement)) ++count;
		if (RequestEsoFindSetItemData('Ring2',     setName,    12, null, null, 66, qualityVal, traits[2], msgElement)) ++count;
	}
	else if (locationVal == 4)
	{
		if (RequestEsoFindSetItemData(weaponSlot1, setName,     weaponEquipTypes[0], null, weaponTypes[0], 66, qualityVal, traits[3], msgElement, onUespSetNoItemsFoundCallback)) ++count;
		
		if (weaponTypes[1] > 0) {
			if (RequestEsoFindSetItemData(weaponSlot2,  setName, weaponEquipTypes[1], null, weaponTypes[1], 66, qualityVal, traits[4], msgElement)) ++count;
		}
		else {
			UnequipEsoItemSlot(weaponSlot2, false);
		}
	}
	
	$(msgElement).text("Updating " + count + " items to set " + setName + "... ");
}


window.onUespSetNoItemsFoundCallback = function(slotId, setName, equipType, armorType, weaponType, level, quality, trait, msgElement)
{
	if (equipType == "5")
	{
		RequestEsoFindSetItemData(slotId, setName, "6", armorType, weaponType, level, quality, trait, msgElement);
		var text = $(msgElement).text();
		$(msgElement).text(text + " Finding 2H weapons...");
		return true;
	}
	
	return false;
}


window.EsoEditBuildChangeAllLevel = function (newLevel)
{
	var msgElement = $("#esotbItemSetupAllLevelMsg");
	var count = 0;
	
	if (EsoBuildChangeSlotLevel('Chest', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Head', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Feet', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Legs', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Waist', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Hands', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Shoulders', newLevel, msgElement)) ++count;
	
	if (EsoBuildChangeSlotLevel('Neck', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Ring1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('Ring2', newLevel, msgElement)) ++count;
	
	if (EsoBuildChangeSlotLevel('MainHand1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('MainHand2', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('OffHand1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeSlotLevel('OffHand2', newLevel, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantLevel('Chest', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Head', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Feet', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Legs', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Waist', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Hands', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Shoulders', newLevel, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantLevel('Neck', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Ring1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('Ring2', newLevel, msgElement)) ++count;
	
	if (EsoBuildChangeEnchantLevel('MainHand1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('MainHand2', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('OffHand1', newLevel, msgElement)) ++count;
	if (EsoBuildChangeEnchantLevel('OffHand2', newLevel, msgElement)) ++count;
	
	$(msgElement).text("Updating " + count + " items/enchants to level " + newLevel + "... ");
}


window.UpdateEsoSkillGroupDisplay = function()
{
	var vampireStage = parseInt($("#esotbVampireStage").val());
	var werewolfStage = parseInt($("#esotbWerewolfStage").val());
	
	var vampSkillLine = $("#esovsSkillTree").children(".esovsSkillType[skilltypeid='World']").children(".esovsSkillLineTitle[skilllineid='Vampire']");
	var wereSkillLine = $("#esovsSkillTree").children(".esovsSkillType[skilltypeid='World']").children(".esovsSkillLineTitle[skilllineid='Werewolf']");
	
	vampSkillLine.toggle(vampireStage > 0);
	wereSkillLine.toggle(werewolfStage > 0);
	
	if (vampireStage  <= 0) $("#Vampire").toggle(false);
	if (werewolfStage <= 0) $("#Werewolf").toggle(false);
	
	if (vampireStage <= 0) EsoResetSkillLine("Vampire");
	if (werewolfStage <= 0) EsoResetSkillLine("Werewolf");
}


window.UpdateEsoSkillBarDisplay = function ()
{
	if (HasEsoBuildThirdSkillBar())
		$("#esovsSkillBar, #esotbItemSkillCopy").find(".esovsSkillBar[skillbar='3']").show()
	else
		$("#esovsSkillBar, #esotbItemSkillCopy").find(".esovsSkillBar[skillbar='3']").hide()
		
	if (HasEsoBuildForthSkillBar())
		$("#esovsSkillBar, #esotbItemSkillCopy").find(".esovsSkillBar[skillbar='4']").show()
	else
		$("#esovsSkillBar, #esotbItemSkillCopy").find(".esovsSkillBar[skillbar='4']").hide()
}


window.CopyEsoSkillsToItemTab = function ()
{
	$("#esotbItemSkillCopy").html($("#esovsSkillBar").html());
	
	$("#esotbItemSkillCopy #esovsSkillBar1").attr("id", null);
	$("#esotbItemSkillCopy #esovsSkillBar2").attr("id", null);
	$("#esotbItemSkillCopy #esovsSkillBar3").attr("id", null);
	
	$("#esotbItemSkillCopy .esovsSkillBarIcon[draggable='true']").attr("draggable", "false");
	$("#esotbItemSkillCopy .esovsSkillBar").click(OnSkillBarSelect);
	$("#esotbItemSkillCopy .esovsSkillBarIcon").hover(OnHoverEsoSkillBarIcon, OnLeaveEsoSkillBarIcon);
}


window.UpdateEsoBuildSlottedDestructionSkills = function ()
{
	var changed = false;
	
	if (g_EsoSkillDestructionData == null) return;
	if (g_EsoSkillDestructionElement == null) return;
	
	var skillBarItems = $("#esovsSkillBar").children(".esovsSkillBarHighlight").children(".esovsSkillBarItem");
	
	skillBarItems.each(function (i, element) {
		var icon = $(this).children(".esovsSkillBarIcon");
		var skillId = parseInt(icon.attr('skillid'));
		var origSkillId = parseInt(icon.attr('origSkillId'));
		
		if (skillId < 0 || origSkillId <= 0) return;
		
		var skillData = g_SkillsData[skillId];
		if (skillData == null) return;
		if (skillData.skillLine != "Destruction Staff") return;
		
		var newSkillId = null;
		
		for (var origId in g_EsoSkillDestructionData)
		{
			var destData = g_EsoSkillDestructionData[origId];
			
			if (origId == skillId || destData['flame'] == skillId || destData['frost'] == skillId || destData['shock'] == skillId)
			{
				newSkillId = destData[g_EsoSkillDestructionElement];
				break;
			}
		}
		
		if (newSkillId == null) return;
		if (newSkillId == skillId) return;
		
		// console.log("Switching destruction skill abilities", skillId,
		// newSkillId, origSkillId);
		
		if (g_SkillsData[newSkillId] != null)
		{
			icon.attr("src", "//esoicons.uesp.net" + g_SkillsData[newSkillId]['icon'].replace("\.dds", ".png"));
		}
		
		icon.attr("skillId", newSkillId);
		changed = true;
	});
	
	if (changed) UpdateEsoSkillBarData();
}


window.UpdateAllEsoItemTraitLists = function ()
{
	for (var slotId in ESOBUILD_SLOTID_TO_EQUIPSLOT)
	{
		var itemData = g_EsoBuildItemData[slotId];
		
		if (itemData == null || $.isEmptyObject(g_EsoBuildItemData[slotId]))
		{
			UpdateEsoItemTraitList(slotId, 0);
		}
		else
		{
			UpdateEsoItemTraitList(slotId, itemData.trait);
		}
		
	}
}


window.UpdateEsoItemTraitList = function (slotId, trait)
{
	if (trait === null || trait === undefined || trait < 0) return false;
	
	var list = $("#esotbItemTransmute" + slotId);
	if (list.length == 0) return false;
		
	list.val(trait);
	
	if (slotId == "OffHand1" || slotId == "OffHand2") UpdateEsoOffHandTransmuteTraitList(slotId);
	return true;
}


window.OnEsoItemButtonClick = function(e)
{
	e.stopPropagation();
}


window.OnEsoTransmuteListChange = function (e)
{
	var $this = $(this);
	var slotId = $this.attr("slotid");
	var newTrait = $this.val();
	
	if (slotId == null || slotId == "") return;
	if (g_EsoBuildItemData[slotId] == null) return
	if ($.isEmptyObject(g_EsoBuildItemData[slotId])) return;
	
	if (g_EsoBuildItemData[slotId].trait == newTrait) return;
	
	//var element = $(".esotbItem[slotid='" + slotId + "']");
	var element = $("#esotbItem" + slotId);
	var iconElement = element.find(".esotbItemIcon");
	
	g_EsoBuildItemData[slotId].trait = newTrait;
	g_EsoBuildItemData[slotId].transmuteTrait = newTrait;
	
	iconElement.attr("trait", newTrait);
	
	RequestEsoTransmuteTraitData(g_EsoBuildItemData[slotId], newTrait, element);
	
	// EsoBuildLog("OnEsoTransmuteListChange", newTrait, slotId, this, e);
	
	// UpdateEsoComputedStatsList(true);
}


window.RequestEsoTransmuteTraitData = function (itemData, newTrait, element)
{	
	if (itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.level == null || itemData.level == "") return false;
	if (itemData.quality == null || itemData.quality == "") return false;
	
	var queryParams = {
			"table" : "minedItem",
			"id" : itemData.itemId,
			"intlevel" : itemData.internalLevel,
			"inttype" : itemData.internalSubtype,
			"transmutetrait" : newTrait,
			"equiptype" : itemData.equipType,
			"limit" : 1,
	};
	
		/* Special case for mythic items */
	if (itemData.quality == 6) {
		queryParams.intlevel = 50;
		queryParams.inttype = 370;
	}
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoTransmuteTraitDataReceive(data, status, xhr, element, itemData); }).
		fail(function(xhr, status, errorMsg) { OnEsoTransmuteTraitDataError(xhr, status, errorMsg); });
}


window.OnEsoTransmuteTraitDataReceive = function (data, status, xhr, element, origItemData)
{
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if (data.minedItem == null || data.minedItem[0] == null) return false;
	
	var itemData = data.minedItem[0];
	
	g_EsoBuildItemData[slotId].traitDesc = itemData.traitDesc;
	
	// EsoBuildLog("Received Transmute Trait Desc", itemData.traitDesc, data);
	
	UpdateEsoComputedStatsList(true);
}


window.OnEsoTransmuteTraitDataError = function (xhr, status, errorMsg)
{
}


window.UpdateEsoOffHandTransmuteTraitList = function (slotId)
{
	var item = g_EsoBuildItemData[slotId];
	
	if ($.isEmptyObject(item)) return;

	var list = $("#esotbItemTransmute" + slotId);
	var options = list.children("option");
	var isShield = item.weaponType == 14;
	
	options.each(function(index, element) {
		var $this = $(this);
		var value = $this.attr("value");
		
		if (value == 0) return;
		
		var isWeaponTrait = (value > 0 && value <= 8) || value == 26;
	
		if ((isShield && isWeaponTrait) || (!isShield && !isWeaponTrait))
		{
			$this.hide();
			$this.prop("hidden", true);
		}
		else
		{
			$this.show();
			$this.removeAttr("hidden");
		}
	});
	
}


window.ESO_MITIGATION_ELEMENTTYPES = {
	1 : "Physical",
	2 : "Poison",
	3 : "Disease",
	4 : "Magic",
	5 : "Flame",
	6 : "Frost",
	7 : "Shock",
};

window.ESO_STATMULTVALUE_CATEGORIES = ['Item', 'Buff', 'Skill', 'Skill2', 'Food', 'Mundus', 'Set', 'CP'];


window.ESO_RESIST_CAP = 33000;

window.rawEsoMitigationData = {};
window.currentEsoMitigationRawDataElementId = null;


window.UpdateEsoMitigation = function()
{
	var isPlayer = g_EsoBuildLastInputValues.Cyrodiil != 0;
	var isBlocking = $("#esotbMitigationBlock").is(":checked");
	
	$("#esotbMitigationPVP").prop("checked", isPlayer);
	
	window.rawEsoMitigationData = {};
	
	for (var i in ESO_MITIGATION_ELEMENTTYPES) 
	{
		var elementType = ESO_MITIGATION_ELEMENTTYPES[i];
		
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "1"), elementType, "Direct", "Melee", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "2"), elementType, "Direct", "Ranged", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "3"), elementType, "Direct", "SingleTarget", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "4"), elementType, "Direct", "AOE", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "5"), elementType, "Direct", "LA", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "6"), elementType, "Dot", "Melee", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "7"), elementType, "Dot", "Ranged", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "8"), elementType, "Dot", "SingleTarget", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "9"), elementType, "Dot", "AOE", isPlayer, isBlocking)
		UpdateEsoMitigationCell($("#esotbMitTable" + i + "10"), elementType, "Dot", "LA", isPlayer, isBlocking)
	}
	
	if (currentEsoMitigationRawDataElementId) UpdateEsoMitigationTableElement(currentEsoMitigationRawDataElementId);
}


window.GetEsoComputedStatValue = function(key, defaultValue = 0)
{
	var obj = g_EsoComputedStats[key];
	if (obj && obj.value != null) return obj.value;
	return defaultValue;
}


window.GetEsoInputStatValue = function(category, key, defaultValue = 0)
{
	var obj1 = g_EsoBuildLastInputValues[category];
	if (obj1 == null) return defaultValue;
	
	var obj2 = obj1[key];
	if (obj2 == null) return defaultValue;
	
	return obj2;
}


window.GetEsoInputStatMultValue = function(stat, factor = 1)
{
	var value = 1;
	
	for (var i in ESO_STATMULTVALUE_CATEGORIES)
	{
		var obj = g_EsoBuildLastInputValues[ESO_STATMULTVALUE_CATEGORIES[i]][stat];
	
		if (obj != null)
		{
			// EsoBuildLog("\t", ESO_STATMULTVALUE_CATEGORIES[i], obj);
			value *= (1 + obj * factor);
		}
	}	
	
	// EsoBuildLog("GetEsoComputedStatMultValue", stat, value);
	return value;
}


window.UpdateEsoMitigationCell = function(element, elementType, damageType1, damageType2, isPlayer, isBlocking)
{
	var resistType = "SpellResist";
	var extraResist = 0;
	var resistance = 0;
	var mitigation = 1;
	var damageTaken = 1;
	var damage1Taken = 1;
	var damage2Taken = 1;
	var elementDamageTaken = 1;
	var blockDamageTaken = 0;
	var playerDamageTaken = 1;
	var playerAOEDamageTaken = 1;
	var dungeonDamageTaken = 1;
	var mitigationText = "";
	var elementVulnerability = 1;
	var vulnerability = 1;
	var rawData = {};
	
	if (elementType == "Physical" || elementType == "Poison" || elementType == "Disease") resistType = "PhysicalResist";
	if (elementType != "Physical") extraResist = GetEsoComputedStatValue(elementType + "Resist");
	
	rawData.id = element.attr("id");
	rawData.resistType = resistType;
	rawData.elementType = elementType;
	rawData.damageType1 = damageType1;
	rawData.damageType2 = damageType2;
	
	rawData.baseResistance = g_EsoComputedStats[resistType].value;
	rawData.extraResist = extraResist;
	
	resistance = g_EsoComputedStats[resistType].value + extraResist;
	if (resistance > ESO_RESIST_CAP) resistance = ESO_RESIST_CAP;
	if (resistance < 0) resistance = 0;
	
	vulnerability = GetEsoInputStatValue("Buff", "Vulnerability");
	elementVulnerability = GetEsoInputStatValue("Buff", elementType + "Vulnerability");
	
	damageTaken = GetEsoInputStatMultValue("DamageTaken");
	elementDamageTaken = GetEsoInputStatMultValue(elementType + "DamageTaken");
	damage1Taken = GetEsoInputStatMultValue(damageType1 + "DamageTaken");
	
	damage2Taken = GetEsoInputStatMultValue(damageType2 + "DamageTaken");
	if (damageType2 == "LA" && !isPlayer) damage2Taken = 1;
	
	if (isBlocking)
	{
		blockDamageTaken = GetEsoComputedStatValue("BlockMitigation");
		
		if (damageType2 == "Ranged")
		{
			var RangedDamageTaken = GetEsoInputStatValue("Skill", "BlockRangedDamageTaken");
			//damage2Taken *= (1 + RangedDamageTaken);
			if (RangedDamageTaken) blockDamageTaken *= (1 - RangedDamageTaken);
		}
	}
	
	if (isPlayer)
	{
		playerDamageTaken = GetEsoInputStatMultValue("PlayerDamageTaken");
		if (damageType2 == "AOE") playerAOEDamageTaken = GetEsoInputStatMultValue("PlayerAOEDamageTaken");
	}
	else
	{
		dungeonDamageTaken = GetEsoInputStatMultValue("DungeonDamageTaken");
	}
	
	rawData.resistance = resistance;
	rawData.baseDamageTaken = 1 - 0.10;
	rawData.resistanceDamageTaken = (1 - Math.max(0, resistance - 100) / 660 / 100);
	rawData.elementVulnerability = elementVulnerability;
	rawData.vulnerability = vulnerability;
	rawData.damageTaken = damageTaken;
	rawData.damage1Taken = damage1Taken;
	rawData.damage2Taken = damage2Taken;
	rawData.elementDamageTaken = elementDamageTaken;
	rawData.blockDamageTaken = 1 - blockDamageTaken;
	rawData.playerDamageTaken = playerDamageTaken;
	rawData.playerAOEDamageTaken = playerAOEDamageTaken;
	rawData.dungeonDamageTaken = dungeonDamageTaken;
	
		/* Mitigation calculation */
	mitigation *= rawData.baseDamageTaken;
	mitigation *= (1 - Math.max(0, resistance - 100) / 660 / 100); 
	mitigation *= damageTaken * damage1Taken * damage2Taken * elementDamageTaken + elementVulnerability + vulnerability;
	// mitigation *= damage1Taken;
	// mitigation *= damage2Taken;
	// mitigation *= elementDamageTaken;
	mitigation *= 1 - blockDamageTaken;
	mitigation *= playerDamageTaken;
	mitigation *= playerAOEDamageTaken;
	mitigation *= dungeonDamageTaken;
	
	rawData.mitigation = mitigation;
	
		/* Convert to nice number for display */
	mitigation = (100 * mitigation).toFixed(1);
	mitigationText = "" + (100 - mitigation).toFixed(1);
	
	element.text(mitigationText + "%");
	
	rawEsoMitigationData[element.attr("id")] = rawData;
}


window.OnEsoClickMitigationBlock = function()
{
	UpdateEsoMitigation();
}


window.OnEsoClickMitigationPVP = function()
{
	var isPlayer = $("#esotbMitigationPVP").is(":checked");
	
	$("#esotbCyrodiil").prop("checked", isPlayer);
	
	OnEsoClickCyrodiil();
}

window.OnEsoShowMitigationDetails = function()
{
	$("#esotbMitigationDetails").toggle();
}


window.OnEsoMitigationTableClick = function()
{
	var elementId = $(this).attr("id");
	UpdateEsoMitigationTableElement(elementId);
}


window.UpdateEsoMitigationTableElement = function(elementId)
{
	var rawData = rawEsoMitigationData[elementId];
	var output = "";
	var mitigation = 1;
	
	$("#esotbMitigation").find(".esotbMitTableSelected").removeClass("esotbMitTableSelected");
	$("#" + elementId).addClass("esotbMitTableSelected");
	currentEsoMitigationRawDataElementId = elementId;
	
	output += "<div class='esotbMitRawDataHeader'> " + rawData.resistType + ", " + rawData.elementType + ", " + rawData.damageType1 + ", " + rawData.damageType2 + "</div>";
	
	if (rawData == null)
	{
		output += "Error: Missing raw data for table element '" + elementId + "'!";
		$("#esotbMitigationDetails").html(output);
		return;
	}
	
	if (rawData.mitigation == 1)
	{
		output += "<div class='esotbMitRawData'><div class='esotbMitRawDataTitle'>Final Mitigation:</div> 0.0%</div>";
		$("#esotbMitigationDetails").html(output);
		return;
	}
	
	if (rawData.extraResist != 0) 
	{
		output += CreateMitigationRawDataBlock("Base Resistance", rawData.baseResistance, "resist");
		output += CreateMitigationRawDataBlock("Extra Resistance", rawData.extraResist, "resist");
	}
	
	output += CreateMitigationRawDataBlock("Resistance", rawData.resistance, "resist");
	output += CreateMitigationRawDataBlock("DamageTaken Mitigation", rawData.damageTaken, "mitigation");
	output += CreateMitigationRawDataBlock(rawData.damageType1 + " Mitigation", rawData.damage1Taken, "mitigation");
	output += CreateMitigationRawDataBlock(rawData.damageType2 + " Mitigation", rawData.damage2Taken, "mitigation");
	output += CreateMitigationRawDataBlock(rawData.elementType + " Mitigation", rawData.elementDamageTaken, "mitigation");
	
	var damageTaken = rawData.damageTaken * rawData.damage1Taken * rawData.damage2Taken * rawData.elementDamageTaken;
	output += CreateMitigationRawDataBlock("Total DamageTaken Mitigation", damageTaken, "mitigation");
	
	output += CreateMitigationRawDataBlock("Vulnerability", rawData.vulnerability, "vulnerability");
	output += CreateMitigationRawDataBlock(rawData.elementType + " Vulnerability", rawData.elementVulnerability, "vulnerability");
	output += "<hr/>";
	output += " Each of the following mitigation values combine multiplicatively<sup>*</sup>:<p><br/>"
	
	output += CreateMitigationRawDataBlock("Base DamageTaken", rawData.baseDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.baseDamageTaken;
	
	output += CreateMitigationRawDataBlock("Resistance Mitigation", rawData.resistanceDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.resistanceDamageTaken;
	
	damageTaken += rawData.vulnerability + rawData.elementVulnerability;
	output += CreateMitigationRawDataBlock("DamageTaken - Vulnerability Mitigation", damageTaken, "mitigation", mitigation);
	mitigation *= rawData.damageTaken + rawData.vulnerability + rawData.elementVulnerability;
	
	/*
	 * output += CreateMitigationRawDataBlock(rawData.damageType1 + "
	 * Mitigation", rawData.damage1Taken, "mitigation", mitigation); mitigation *=
	 * rawData.damage1Taken;
	 */
	
	/*
	 * output += CreateMitigationRawDataBlock(rawData.damageType2 + "
	 * Mitigation", rawData.damage2Taken, "mitigation", mitigation); mitigation *=
	 * rawData.damage2Taken;
	 */
	
	/*
	 * output += CreateMitigationRawDataBlock(rawData.elementDamageTaken + "
	 * Mitigation", rawData.elementDamageTaken, "mitigation", mitigation);
	 * mitigation *= rawData.elementDamageTaken;
	 */
	
	output += CreateMitigationRawDataBlock("Block Mitigation", rawData.blockDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.blockDamageTaken;
	
	output += CreateMitigationRawDataBlock("Player Mitigation", rawData.playerDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.playerDamageTaken;
	
	output += CreateMitigationRawDataBlock("PlayerAOE Mitigation", rawData.playerAOEDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.playerAOEDamageTaken;
	
	output += CreateMitigationRawDataBlock("Dungeon Mitigation", rawData.dungeonDamageTaken, "mitigation", mitigation);
	mitigation *= rawData.dungeonDamageTaken;
	
	output += "<p><br/>"
	output += CreateMitigationRawDataBlock("Final Mitigation", rawData.mitigation, "mitigation");
	
	output += "<p><br/>"
	output += " <sup>*</sup>Multiplicative combination of mitigations works as follows:</br>";
	output += "<pre>Mitigation #1 = 5%<br/>";
	output += "Mitigation #2 = 31%<br/>";
	output += "Combined = (1 - (1 - 5/100) * (1 - 31/100) ) * 100 = 34.4%</pre>";

	$("#esotbMitigationDetails").html(output);
}


window.CreateMitigationRawDataBlock = function(title, value, type, cumulativeMitigation)
{
	var output = "";
	
	if (type == "mitigation"    && value == 1) return "";
	if (type == "vulnerability" && value == 0) return "";
	if (type == "resist"        && value == 0) return "";
	
	output += "<div class='esotbMitRawData'>";
	output += "<div class='esotbMitRawDataTitle'>" + title + ":</div> ";
	
	if (type == "mitigation")
	{
		output += (100*(1 - value)).toFixed(1) + "%";
	}
	else if (type == "stat")
	{
		output += "<b>" + value + "</b>";
	}
	else if (type == "vulnerability")
	{
		output += (100*value).toFixed(1) + "%";
	}
	else if (type == "resist")
	{
		mitigation = Math.max(0, value - 100) / 660;
		mitigation = mitigation.toFixed(1);
		
		output += value + " (" + mitigation + "%)";
	}
	else
	{
		output += value;
	}
	
	if (cumulativeMitigation != null)
	{
		var mitigation = ((1 - cumulativeMitigation * value)*100).toFixed(1);
		output += " <div class='esotbMitRawDataCumulative'>(" + (100 - cumulativeMitigation*100).toFixed(1) + "% * " + (100 - value*100).toFixed(1) + "% = " + mitigation + "%)</div>";
	}
	
	output += "</div>";
	
	return output;
}


window.OnEsoStatSectionTitleClick = function()
{
	$(this).next(".esotbStatSection").slideToggle()
}


window.g_EsoBuildTestSkills = {};


window.TestAllEsoSkills = function ()
{
	g_EsoBuildTestSkills = {};
	
	for (var abilityId in g_SkillsData)
	{
		if (window.ESOBUILD_UNIQUESKILLID_MAX && abilityId <= ESOBUILD_UNIQUESKILLID_MAX) continue;
		
		var inputValues = {};
		InitializeEsoBuildInputValues(inputValues);
		
		TestEsoSkill(abilityId, g_SkillsData[abilityId], inputValues);
	}
	
	CheckEsoTestSkillResults();
	
		// All handled by the new tooltip system now
	//TestAllEsoSkillsBleed();
	//TestAllEsoSkillsDamageShield();
	//TestAllEsoSkillsHealing();
}


window.TestAllEsoSkillsBleed = function ()
{
	EsoBuildLog("Testing All Skills Bleed Damage");
	
	for (var abilityId in g_SkillsData)
	{
		var skillData = g_SkillsData[abilityId];
		
		if (skillData.description.match(/bleed /) != null)
		{
			TestEsoSkillBleed(abilityId, skillData);
		}
	}

}


window.TestEsoSkillBleed = function (abilityId, skillData)
{
	if (skillData.isPlayer == 0) return true;
	
	var numMatches = 0;
	
	for (var i = 0; i < ESO_SKILL_BLEEDMATCHES.length; ++i)
	{
		var match = ESO_SKILL_BLEEDMATCHES[i];
		var desc = skillData.description.replaceAll("  ", " ").replaceAll("  ", " ");
		
		if (desc.match(match) != null) numMatches++;
	}
	
	if (numMatches == 0)
	{
		EsoBuildLog("\t" + skillData.name + ": Missing bleed damage match!");
		EsoBuildLog("\t\t" + skillData.description);
	}
	else if (numMatches > 1)
	{
		EsoBuildLog("\t" + skillData.name + ": Duplicate bleed damage match (" + numMatches + ")!");
		EsoBuildLog("\t\t" + skillData.description);
	}
	
	return numMatches;
}


window.TestAllEsoSkillsDamageShield = function ()
{
	EsoBuildLog("Testing All Skills Damage Shield");
	
	for (var abilityId in g_SkillsData)
	{
		var skillData = g_SkillsData[abilityId];
		
		if (skillData.description.match(/damage shield/i) != null ||
				skillData.description.match(/absorbing damage to allies /i) != null ||
				skillData.description.match(/absorbing damage equivalent /i) != null ||
				skillData.description.match(/a ward to absorb /i) != null ||
				skillData.description.match(/absorb up to /i) != null ||
				skillData.description.match(/absorbing up to /i) != null)
			
		{
			TestEsoSkillDamageShield(abilityId, skillData);
		}
	}
	
}


window.TestEsoSkillDamageShield = function (abilityId, skillData)
{
	if (skillData.isPlayer == 0) return true;
	
	var numMatches = 0;
	var matches = [];
	
	if (skillData.baseAbilityId == 31642) return false;
	
	for (var i = 0; i < ESO_SKILL_DAMAGESHIELDMATCHES.length; ++i)
	{
		var match = ESO_SKILL_DAMAGESHIELDMATCHES[i].match;
		var desc = skillData.description.replaceAll("  ", " ").replaceAll("  ", " ");
		var result = desc.match(match);
		
		if (result != null) 
		{
			matches.push(result[0]);
			numMatches++;
		}
	}
	
	if (numMatches == 0)
	{
		EsoBuildLog("===== " + skillData.name + ": Missing damage shield match! ===== ");
		EsoBuildLog("\t\t" + skillData.description);
	}
	else if (numMatches > 1)
	{
		EsoBuildLog("===== " + skillData.name + ": Duplicate damage shield match (" + numMatches + ")! ===== ");
		// EsoBuildLog("\t\t" + skillData.description);
		EsoBuildLog("\t\t Matches: ", matches);
	}
	
	return numMatches;
}


window.TestAllEsoSkillsHealing = function ()
{
	EsoBuildLog("Testing All Skills Healing");
	
	for (var abilityId in g_SkillsData)
	{
		var skillData = g_SkillsData[abilityId];
		
		/*
		 * heals heal you heal for healed for the heal the heal the target you
		 * siphon to restore * health restoring * health restores * health
		 * additional * health nearby allies for * Health
		 */
		
		if (skillData.description.match(/healing (?!received|done|taken|for the |by |effects |ritual |with )/i) != null ||
				skillData.description.match(/heal (?!Absorption |an ally |on yourself |yourself or an ally |youself or an ally)/i) != null ||
				skillData.description.match(/heals /i) != null ||
				skillData.description.match(/healed (?!and |under )/i) != null ||
				skillData.description.match(/you siphon /i) != null ||
				skillData.description.match(/to restore \|c[a-fA-F0-9]{6}[0-9]+\|r Health/i) != null ||
				skillData.description.match(/additional \|c[a-fA-F0-9]{6}[0-9]+\|r Health/i) != null ||
				skillData.description.match(/nearby allies for \|c[a-fA-F0-9]{6}[0-9]+\|r Health/i) != null)
			
		{
			TestEsoSkillHealing(abilityId, skillData);
		}
	}
	
}


window.TestEsoSkillHealing = function (abilityId, skillData)
{
	if (skillData.isPlayer == 0) return true;
	
	var numMatches = 0;
	var matches = [];
	var matchCount = {};
	
	if (skillData.baseAbilityId == 31642) return false;
	
	for (var i = 0; i < ESO_SKILL_HEALINGMATCHES.length; ++i)
	{
		var match = ESO_SKILL_HEALINGMATCHES[i].match;
		var desc = skillData.description.replaceAll("  ", " ").replaceAll("  ", " ");
		var result = desc.match(match);
		
		if (result != null)
		{
			matches.push(result[0]);
			numMatches++;
			
			if (matchCount[result[0]] == null) matchCount[result[0]] = [];
			matchCount[result[0]].push(result[0]);
			
			// var subResult = result[0].match(/\|c[a-fA-F0-9]{6}[0-9]+\|r/);
			// if (matchCount[subResult[0]] == null) matchCount[subResult[0]] =
			// [];
			// matchCount[subResult[0]].push(result[0]);
		}
	}
	
	if (numMatches == 0)
	{
		EsoBuildLog("===== " + skillData.name + ": Missing healing match! ===== ");
		EsoBuildLog("\t\t" + skillData.description);
	}
	
	for (var match in matchCount)
	{
		var matches = matchCount[match];
		
		if (matches.length > 1)
		{
			EsoBuildLog("\t" + skillData.name + ": Duplicate healing match (" + matches.length + ")!");
			// EsoBuildLog("\t\t" + skillData.description);
			
			for (var i = 0; i < matches.length; ++i)
			{
				EsoBuildLog("\t\t", matches[i]);
			}
		}
	}
	
	return numMatches;
}


window.CheckEsoTestSkillResults = function ()
{
	EsoBuildLog("Showing Results for Skill Tests:")
	EsoBuildLog("Checking passive skills...");
	
	for (var abilityId in g_EsoBuildTestSkills)
	{
		var abilityData = g_SkillsData[abilityId];
		var testData = g_EsoBuildTestSkills[abilityId];
		
		if (!testData.isPassive) continue; 

		if (testData.numMatches <= 0)
		{
			var desc = testData.desc.replaceAll("\n", " ");
			// EsoBuildLog("Passive Skill has NO matches!", testData.name,
			// testData, abilityData);
			EsoBuildLog(`===== ${testData.name} (${testData.id}) passive has NO matches! =====\n\t${desc}`);
		}
	
	}
	
	EsoBuildLog("Checking active skills...");
		
	for (var abilityId in g_EsoBuildTestSkills)
	{
		var abilityData = g_SkillsData[abilityId];
		var testData = g_EsoBuildTestSkills[abilityId];
		
		if (testData.isPassive) continue;
		
		if (testData.numMatches > 0)
		{
			var desc = testData.desc.replaceAll("\n", " ");
			// EsoBuildLog("Active Skill has " + testData.numMatches + "
			// matches!", testData.name, testData, abilityData);
			EsoBuildLog(`===== ${testData.name} (${testData.id}) active has ${testData.numMatches} matches!=====\n\t${desc}`, testData);
		}
	}
	
	EsoBuildLog("Checking for duplicate parsing...");
	
	for (var abilityId in g_EsoBuildTestSkills)
	{
		var abilityData = g_SkillsData[abilityId];
		var testData = g_EsoBuildTestSkills[abilityId];
		var rawOutputKeys = {};
		
		for (var i = 0; i < testData.rawOutput.length; ++i)
		{
			var data = testData.rawOutput[i];
			var key = data.key;
			var value = data.value;
			
			if (key == "Buff") key = "Buff: " + value;
			
			if (rawOutputKeys[key] == null) rawOutputKeys[key] = 0;
			rawOutputKeys[key] += 1;
		}
		
		for (var key in rawOutputKeys)
		{
			var count = rawOutputKeys[key];
			
			if (count > 1) 
			{
				EsoBuildLog(`===== ${testData.name} (${testData.id}) skill has potential multiple parsing (${count})! =====`);
				EsoBuildLog("          " + key);
			}
		}
	}
	
}


window.TestEsoSkill = function (abilityId, abilityData, inputValues)
{
	if (abilityData.isPlayer == 0) return true;
	
	var skillDesc = GetEsoSkillDescription(abilityId, inputValues, false, true);
	
	var rawDesc = RemoveEsoDescriptionFormats(skillDesc);
	rawDesc = rawDesc.replaceAll("  ", " ").replaceAll("  ", " ");
	if (rawDesc == "" || abilityData == null) return;
	
		/* Ignore crafting passives and other skill lines */
	if (abilityData.skillType == 8) return true;
	if (abilityData.skillLine == "Scrying") return true;
	if (abilityData.skillLine == "Excavation") return true;
	if (abilityData.skillLine == "Thieves Guild") return true;
	if (abilityData.skillLine == "Dark Brotherhood") return true;
	
		/* Only test first rank of passives and rank 1 of active skills */
	if (abilityData.isPassive > 1 && abilityData.rank > 1) return true;
	if (abilityData.isPassive == 0 && !(abilityData.rank == 1 || abilityData.rank == 5 || abilityData.rank == 9)) return true;
	
	var matchArray = ESO_ACTIVEEFFECT_MATCHES;
	if (abilityData.isPassive != 0) matchArray = ESO_PASSIVEEFFECT_MATCHES;
	
	var rawOutput = [];
	
	g_EsoBuildTestSkills[abilityId] = {};
	
	g_EsoBuildTestSkills[abilityId].id = abilityId;
	g_EsoBuildTestSkills[abilityId].name = abilityData.name;
	g_EsoBuildTestSkills[abilityId].desc = rawDesc;
	g_EsoBuildTestSkills[abilityId].isPassive = (abilityData.isPassive != 0);
	g_EsoBuildTestSkills[abilityId].numMatches = 0;
	g_EsoBuildTestSkills[abilityId].matches = [];
	g_EsoBuildTestSkills[abilityId].numTested = matchArray.length;
	
	for (var i = 0; i < matchArray.length; ++i)
	{
		var matchData = matchArray[i];
		var statValue = 0;
		var statFactor = 1;
		var matches = null;

		if (matchData.statValue !== undefined) statValue = matchData.statValue;
		
		if (matchData.match == null) continue;
		
		matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var newStatValue = parseFloat(matches[1]);
		
		if (isNaN(newStatValue) && matchData.statValue === undefined)
			statValue = 1;
		else if (!isNaN(newStatValue))
			statValue = newStatValue;
		
		var category = "Skill";
		if (matchData.category != null) category = matchData.category;
		
		if (matchData.buffId != null)
		{
			var buffData = g_EsoBuildBuffData[matchData.buffId];
			if (buffData == null) continue;

			rawOutput.push({
				key: "Buff",
				value: matchData.buffId
			});
		}
		else if (matchData.statId == "OtherEffects")
		{
			var rawInputDesc = rawDesc;
			
			if (matchData.rawInputMatch != null)
			{
				var rawInputMatches = rawDesc.match(matchData.rawInputMatch);
				if (rawInputMatches != null) rawInputDesc = rawInputMatches[1];
				if (rawInputDesc == null) rawInputDesc = rawDesc;
			}
			
			rawOutput.push({
				key: "OtherEffects",
				value: rawInputDesc
			});
		}
		else 
		{
			rawOutput.push({
				key:  category + "." + matchData.statId,
				value: statValue
			});
		}
		
		g_EsoBuildTestSkills[abilityId].matches.push(matchData);
		g_EsoBuildTestSkills[abilityId].numMatches++;
	}
		
	g_EsoBuildTestSkills[abilityId].rawOutput = rawOutput;
}


window.g_EsoLoadedAllSetData = false;
window.g_EsoBuildAllSetData = [];


window.RequestEsoAllSetData = function ()
{	
	var queryParams = 
	{
			"table" : "setSummary",
	};
	
	if (g_EsoBuildLastInputValues.UsePtsRules) queryParams.version = g_EsoBuildPtsVersion;
	
	g_EsoLoadedAllSetData = false;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoAllSetDataReceive(data, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoAllSetDataError(xhr, status, errorMsg); });
}


window.OnEsoAllSetDataReceive = function(data, status, xhr)
{
	var setData = data.setSummary;
	var rangeRegex = /([0-9]+)\-([0-9]+)/g;
	var rangeReplace = "$2";
	
	if (setData == null || setData.length == 0) 
	{
		EsoBuildLog("Failed to load all set data! No data returned!");
		return;
	}
	
	g_EsoBuildAllSetData = setData;
	g_EsoLoadedAllSetData = true;
	
	for (var i = 0; i < g_EsoBuildAllSetData.length; ++i)
	{
		var setData = g_EsoBuildAllSetData[i];
		
		setData.setBonusDesc = setData.setBonusDesc.replace(rangeRegex, rangeReplace);
		setData.setBonusDesc1 = setData.setBonusDesc1.replace(rangeRegex, rangeReplace);
		setData.setBonusDesc2 = setData.setBonusDesc2.replace(rangeRegex, rangeReplace);
		setData.setBonusDesc3 = setData.setBonusDesc3.replace(rangeRegex, rangeReplace);
		setData.setBonusDesc4 = setData.setBonusDesc4.replace(rangeRegex, rangeReplace);
		setData.setBonusDesc5 = setData.setBonusDesc5.replace(rangeRegex, rangeReplace);
	}
	
	EsoBuildLog("Loaded data for " + g_EsoBuildAllSetData.length + " sets!");
}


window.OnEsoAllSetDataError = function(xhr, status, errorMsg)
{
	EsoBuildLog("Failed to load all set data!", errorMsg, status);
	g_EsoLoadedAllSetData = false;
}


window.g_EsoBuildTestSets = {};


window.TestAllEsoSets = function()
{
	if (!g_EsoLoadedAllSetData)
	{
		EsoBuildLog("Loading all set data first...");
		RequestEsoAllSetData();
		return;
	}
	
	window.g_EsoBuildTestSets = {};
	
	for (var i = 0; i < g_EsoBuildAllSetData.length; ++i)
	{
		TestEsoSet(g_EsoBuildAllSetData[i]);
	}

	CheckEsoSetTestResults();
}


window.TestEsoSet = function(setData)
{
	var descs = setData.setBonusDesc.split("\n");
	var setName = setData.setName;
	
	if (g_EsoBuildTestSets[setName] != null) EsoBuildLog("Duplicate set " + setName + " found!");
	
	g_EsoBuildTestSets[setName] = {};
	g_EsoBuildTestSets[setName].name = setName;
	g_EsoBuildTestSets[setName].descResults = [];
	g_EsoBuildTestSets[setName].desc = [];
	g_EsoBuildTestSets[setName].data = setData;
	g_EsoBuildTestSets[setName].rawOutput = [];

	for (var i = 0; i < descs.length; ++i)
	{
		g_EsoBuildTestSets[setName].rawOutput[i] = [];
		
		var result = TestEsoSetBonus(setName, descs[i], g_EsoBuildTestSets[setName].rawOutput[i]);
		
		g_EsoBuildTestSets[setName].descResults[i] = result;
		g_EsoBuildTestSets[setName].desc[i] = descs[i];
	}
	
	return true;
}


window.TestEsoSetBonus = function(setName, setDesc, rawOutput)
{
	var foundMatch = false;
	
	if (setDesc == "") return true;
	
	if (setDesc == null || setDesc == "") return true;
	
	for (var i = 0; i < ESO_SETEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_SETEFFECT_MATCHES[i];
		var matches = setDesc.match(matchData.match);
		
		if (matches == null) continue;
		// if (matchData.id != null && matchData.id != setName) continue;
		
		if (matchData.ignore === true) 
		{
			foundMatch = true;
			continue;
		}
		
		foundMatch = true;
		
		if (matchData.buffId != null)
		{
			rawOutput.push({
				key: "Buff",
				value: matchData.buffId
			});
			continue;
		}
		
		if (matchData.statId == "OtherEffects")
		{
			if (matchData.rawInputMatch != null)
			{
				var rawInputMatches = setDesc.match(matchData.rawInputMatch);
				if (rawInputMatches != null) rawInputDesc = rawInputMatches[1];
				if (rawInputDesc == null) rawInputDesc = setDesc;
			}
			
			rawOutput.push({
				key: "OtherEffects",
				value: rawInputDesc
			});
			
			continue;
		}
		
		var statFactor = 1;
		var newStatValue = parseFloat(matches[1]);
		
		if (matchData.statValue !== undefined) statValue = matchData.statValue;
		if (!isNaN(newStatValue)) statValue = newStatValue;
		if (isNaN(statValue)) statValue = 1;
		
		if (matchData.factorValue != null)
		{
			statFactor = statFactor * matchData.factorValue;
		}
		
		statValue = statValue * statFactor;
		
		if (matchData.round == "floor") statValue = Math.floor(statValue);
		if (matchData.display == "%") statValue = statValue/100;
		
		var category = matchData.category || "Set";
		
		rawOutput.push({ 
			key: category + "." + matchData.statId, 
			value: statValue
		});
	}
	
	return foundMatch;
}


window.TEST_ESOSETS_SKIPMATCHES = [
	/chance to spawn a volcano/i,
	/remove up to 5 negative effects/i,
	/(When|While) you deal direct damage, you restore/i,
	/(When|While) (you|using) [a-zA-Z\-, ]+ you (restore|generate|deal|heal|grant them|apply|will deal)/i,
	/(When|While) you [a-zA-Z\-, ]+ you have a [0-9]+% chance to (deal|cause|grant|blind|reflect|apply|surround|restore|heal|gain|create|summon|draw|call|overload|become|breath|reduce|spawn)/i,
	/(When|While) you [a-zA-Z\-, ]+ you have a [0-9]+% chance to cause/i,	
	/(When|While) you [a-zA-Z\-, ]+ under [0-9]+% (Health|Stamina|Magicka), (you |)(knockdown|gain a damage shield|deal|summon|knockback|heal|restore)/i,
	/(When|While) you [a-zA-Z\-, ]+ dealing/i,
	/Gain a damage shield equal to/i,
	/When an enemy within [0-9]+ meters of you dies, (you| )(gain|heal)/i,
	/Your Bow abilities reduce the Movement Speed of any enemy/i,
	/gain Major Expedition/i,
	/gain Major Evasion/i,
	/gain Stealth Detection/i,
	/with Minor Vulnerability/i,
	/apply Minor Defile/i,
	/gain Major Protection/i,
	/gain Major Aegis/i,
	/gain Major Slayer/i,
	/gain Major Mending/i,
	/gain Minor Force/i,
	/gain Major Heroism/i,
	/gain Major Vitality/i,
	/applying Major Maim/i,
	/gain Minor Mending/i,
	/gain Major Resolve/i,
	/gain Minor Protection/i,
	/your Light and Heavy Attacks deal an additional/i,
	/your Light Attacks deal an additional/i,
	/When you [a-zA-Z\-, ]+ under [0-9]+% Magicka, (you |)restore/i,
	/(When|While) you are under [0-9]+% Health, (you knockback|dealing damage)/i,
	/When you kill an enemy, you (heal|fill)/i,
	/When an enemy dies within 2 seconds of being damaged by you, you gain/,
	/When you cast a Magicka ability, you (have an|gain)/i,
	/When an enemy within [0-9]+ meters of you dies, (heal|you gain)/i,
	/remove up to [0-9]+ negative effects /i,
	/After successfully blocking, (you |)(heal|have|gain)/i,
	/When you die/i,
	/you place a bomb on the enemy/i,
	/Increases the direct damage/i,
	/Grand Healing/i,
	/Low Slash/i,
	/Critical Charge/i,
	/Volley/i,
	/Uppercut/i,
	/Blade Cloak/i,
	/Scatter Shot/i,
	/Steadfast Ward/i,
	/you create a web for/i,
	/Gain a damage shield that absorbs /i,
	/When your pets attack an enemy/i,
	/When you dodge an attack/i,
	/you leave behind a rune/i,
	/When an ally activates your synergy/i,
	/When you activate a synergy/i,
	/they violently explode/i,
	/Mark of Revenge/,
	/inject a leeching poison/i,
	/to cast a web around/i,
	/drop a poisonous spore/i,
	/pull the enemy to you/i,
	/dreugh limbs/i,
	/furthest enemy from you that each deal/i,
	/create lava pools/i,
	/random Major Buffs/i,
	/summon a Hunger/i,
	/deal an additional/i,
	/pool of quenching blood/i,
	/launch a Fire, Ice, Shock, or Disease ball/i,
	/summon a Skeever corpse/i,
	/Increases the duration of all Major buffs/i,
	/When you deal damage with Whirlwind/i,
	/When you deal damage with Arrow Spray/i,
	/cast of Force Shock/i,
	/Whenever you successfully Dodge, heal/i,
	/Current Bonus Health Recovery/i,
	/You can only be affected by one instance of Beckoning Steel/i,
	/While you are Sneaking or invisible and are not moving, heal/i,
	/circle of consecrated ground/i,
	/fire a Shadow Pearl/i,
	/Harmful winds deal/i,
	/Armor of the Code/i,
	/causing your enemy to bleed/i,
	/drop a grave-stake/i,
	/place a ring on the ground/i,
	/non-reflectable Ice Wraith/i,
	/gain an energy Charge/i,
	/Summon a blizzard/i,
	/Scavenging Maw/i,
	/summon a cone of lightning/i,
	/grant them Meridia's Favor/i,
	
];


window.IsSkipSetTest = function(setDesc)
{
	if (setDesc == "") return true;
	
	for (var i = 0; i < TEST_ESOSETS_SKIPMATCHES.length; ++i)
	{
		var result = setDesc.match(TEST_ESOSETS_SKIPMATCHES[i]);
		if (result) return true;
	}
	
	return false;
}


window.CheckEsoSetTestResults = function()
{
	var duplicateCount = 0;
	var badCount = 0;
	
	EsoBuildLog("Test Results for All Sets:");
	EsoBuildLog("Checking for set effects not parsed...");
	
	var keys = Object.keys(g_EsoBuildTestSets);
	keys.sort();
 	
	for (var i in keys)
	{
		var setName = keys[i];
		var testResult = g_EsoBuildTestSets[setName];
		
		//console.log(setName);
		
		for (var i = 0; i < testResult.descResults.length; ++i)
		{
			var result = testResult.descResults[i];
			var desc   = testResult.desc[i];
			var rawOutput = testResult.rawOutput[i];
			
			if (IsSkipSetTest(desc)) continue;
			
			if (!result || rawOutput.length == 0)
			{
				badCount++;
				EsoBuildLog("\t" + setName + ": " + desc);
			}
		}
	}
	EsoBuildLog("Found " + badCount + " skipped sets!")
	EsoBuildLog("Checking for duplicate set effects...");
	
	for (var i in keys)
	{
		var setName = keys[i];
		var testResult = g_EsoBuildTestSets[setName];
		
		for (var i = 0; i < testResult.descResults.length; ++i)
		{
			var result = testResult.descResults[i];
			var desc   = testResult.desc[i];
			var rawOutput = testResult.rawOutput[i];
			var rawOutputKeys = {};
			
			for (var j = 0; j < rawOutput.length; ++j)
			{
				var key = rawOutput[j].key;
				var value =rawOutput[j].value
				
				if (key == "Buff") key += ": " + value;
				
				if (rawOutputKeys[key] == null) rawOutputKeys[key] = 0;
				rawOutputKeys[key]++;
			}

			for (var key in rawOutputKeys)
			{
				if ( rawOutputKeys[key] > 1)
				{
					EsoBuildLog("\t" + setName + ": " + desc);
					EsoBuildLog("\t\tx" + rawOutputKeys[key] + ": " + key);
					duplicateCount++;
				}
			}
			
		}
	}
	
	EsoBuildLog("Found " + duplicateCount + " duplicate sets!")
}


window.UpdateEsoPts = function() 
{
	if (!$("#esotbUsePtsRules").prop("checked")) return;
	
	$("#esotbQuickItemSetups").find(".esotbSetPts").removeAttr("disabled").removeAttr("hidden");
	$("#esotbItemSetupMythicSet").children().removeAttr("disabled").removeAttr("hidden");
	$("#esotbItemSetupMonsterSet").children().removeAttr("disabled").removeAttr("hidden");
	$("#esotbItemSetupEquipSetList").children().removeAttr("disabled").removeAttr("hidden");
	
	$("#esotbQuickItemSetups").find(".esoRemoveSet").remove();
	
	for (var buffId in g_EsoBuildBuffData_PTS) 
	{
		var buffData = g_EsoBuildBuffData_PTS[buffId];
		
		if (buffData == null) {
			delete g_EsoBuildBuffData[buffId];
		}
		else {
			g_EsoBuildBuffData[buffId] = buffData;
		}
		
	}
	
}


window.UpdateEsoPtsToggleData = function()
{
	if (!$("#esotbUsePtsRules").prop("checked")) return;
}


window.EsoBuildUpdateAllSetAverageDesc = function()
{
	for (var setId in g_EsoBuildSetData)
	{
		EsoBuildUpdateSetAverageDesc(g_EsoBuildSetData[setId]);
	}
}


window.EsoBuildUpdateSetAverageDesc = function(setData)
{
	var setDamageData = ESO_SETPROCDAMAGE_DATA[setData.name.toLowerCase()];
	
	for (i = 0; i < setData.averageDesc.length; ++i)
	{
		var newDesc = UpdateEsoBuildSetAllData(setData.averageDesc[i], setDamageData);
		setData.averageDesc[i] = newDesc;
	}
	
}


window.TestAllEsoSkillMatches = function()
{
	var numMatches = [];
	var noMatchCount = 0;
	
	window.g_EsoGoodActiveMatches = [];
	window.g_EsoGoodPassiveMatches = [];
	
	for (var i = 0; i < ESO_ACTIVEEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_ACTIVEEFFECT_MATCHES[i];
		
		var count = TestAllEsoActiveSkillMatch(matchData);
		
		numMatches.push(count);
		
		if (count == 0)
		{
			EsoBuildLog("Active skill match data had no matches in all skill data!", i, matchData.match)
			++noMatchCount;
		}
		else
		{
			g_EsoGoodActiveMatches.push(matchData);
		}
	}
	
	for (var i = 0; i < ESO_PASSIVEEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_PASSIVEEFFECT_MATCHES[i];
		
		var count = TestAllEsoPassiveSkillMatch(matchData);
		
		numMatches.push(count);
		
		if (count == 0)
		{
			EsoBuildLog("Passive skill match data had no matches in all skill data!", i, matchData.match)
			++noMatchCount;
		}
		else
		{
			g_EsoGoodPassiveMatches.push(matchData);
		}
	}
	
	g_EsoGoodPassiveMatches.sort(TestEsoSkillMatchSort);
	g_EsoGoodActiveMatches.sort(TestEsoSkillMatchSort);
	
	window.g_EsoGoodPassiveMatchesString = TestEsoStringify(g_EsoGoodPassiveMatches);
	window.g_EsoGoodActiveMatchesString = TestEsoStringify(g_EsoGoodActiveMatches);
	
	EsoBuildLog("Found " + noMatchCount + " skill match data out of " + (ESO_ACTIVEEFFECT_MATCHES.length + ESO_PASSIVEEFFECT_MATCHES.length) + " that had no matches in all the skill data.");
}


window.TestEsoStringify = function(obj)
{
	RegExp.prototype.toJSON = RegExp.prototype.toString;
	
	var out = JSON.stringify(obj, null, '\t');
	
	out = out.replaceAll('"match": "/', '"match": /');
	out = out.replaceAll('"rawInputMatch": "/', '"rawInputMatch": /');
	out = out.replaceAll('/i"', '/i');
	out = out.replaceAll('\\\\\\\\', '\\');
	//out = out.replaceAll('\\n', "\n");
	//out = out.replaceAll('\\t', "\t");
	out = out.replaceAll("[\n\\r]", "[\\n\\r]");
	
	return out;
}


window.TestEsoSkillMatchSort = function(a, b)
{
	var aToggle = a.isToggle ? 1 : 0;
	var bToggle = b.isToggle ? 1 : 0;
	
	if (aToggle != bToggle) return bToggle - aToggle;
	
	var aStatId = a.statId ? '' + a.statId : "";
	var bStatId = b.statId ? '' + b.statId : "";
	
	return aStatId.localeCompare(bStatId);
}


window.TestEsoSetMatchSort = function(a, b)
{
	var aToggle = a.isToggle ? 1 : 0;
	var bToggle = b.isToggle ? 1 : 0;
	
	if (aToggle != bToggle) return bToggle - aToggle;
	
	var aStatId = a.id ? '' + a.id : "";
	var bStatId = b.id ? '' + b.id : "";
	
	if (aStatId != bStatId) return aStatId.localeCompare(bStatId);
	
	aStatId = a.statId ? '' + a.statId : "";
	bStatId = b.statId ? '' + b.statId : "";
	
	return aStatId.localeCompare(bStatId);
}


window.TestAllEsoPassiveSkillMatch = function (matchData)
{
	var numMatches = 0;
	
	for (var id in g_SkillsData)
	{
		var skill = g_SkillsData[id];
		
		if (skill.isCustom == 1) continue;
		if (skill.isPlayer == 0) continue;
		if (skill.isPassive == 0) continue;
		
		var rawDesc = RemoveEsoDescriptionFormats(skill.description);
		if (rawDesc.match(matchData.match)) ++numMatches;
	}
	
	return numMatches;
}


window.TestAllEsoActiveSkillMatch = function (matchData)
{
	var numMatches = 0;
	
	for (var id in g_SkillsData)
	{
		var skill = g_SkillsData[id];
		
		if (skill.isCustom == 1) continue;
		if (skill.isPlayer == 0) continue;
		if (skill.isPassive == 1) continue;
		
		var rawDesc = RemoveEsoDescriptionFormats(skill.description);
		if (rawDesc.match(matchData.match)) ++numMatches;
	}
	
	return numMatches;
}


window.TestAllEsoSetMatches = function()
{
	var numMatches = [];
	var noMatchCount = 0;
	
	if (!g_EsoLoadedAllSetData)
	{
		EsoBuildLog("Loading all set data first...");
		RequestEsoAllSetData();
		return;
	}
	
	window.g_EsoGoodSetMatches = [];
	
	for (var i = 0; i < ESO_SETEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_SETEFFECT_MATCHES[i];
		var count = TestAllEsoSetMatch(matchData);
		
		numMatches.push(count);
		
		if (count == 0) 
		{
			EsoBuildLog("Set match data had no matches in all current set data!", i, matchData.match)
			++noMatchCount;
		}
		else 
		{
			g_EsoGoodSetMatches.push(matchData);
		}
	}
	
	g_EsoGoodActiveMatches.sort(TestEsoSetMatchSort);
	window.g_EsoGoodSetMatchesString = TestEsoStringify(g_EsoGoodSetMatches);
	
	EsoBuildLog("Found " + noMatchCount + " set match data out of " + ESO_SETEFFECT_MATCHES.length + " that had no matches in all the set data.");
}


window.TestAllEsoSetMatch = function (matchData)
{
	var numMatches = 0;
	
	for (var i = 0; i < g_EsoBuildAllSetData.length; ++i)
	{
		var setData = g_EsoBuildAllSetData[i];
		
		if (setData.setBonusDesc1.match(matchData.match)) ++numMatches;
		if (setData.setBonusDesc2.match(matchData.match)) ++numMatches;
		if (setData.setBonusDesc3.match(matchData.match)) ++numMatches;
		if (setData.setBonusDesc4.match(matchData.match)) ++numMatches;
		if (setData.setBonusDesc5.match(matchData.match)) ++numMatches;
	}
	
	return numMatches;
}


window.esotbOnDocReady = function ()
{
	clearInterval(g_EsoCharDataTimeUpdateId);
	
	UpdateEsoPts();
	
	GetEsoSkillInputValues = GetEsoTestBuildSkillInputValues;
	
	SetEsoInitialData(g_EsoBuildItemData, g_EsoInitialItemData);
	SetEsoInitialData(g_EsoBuildEnchantData, g_EsoInitialEnchantData);
	SetEsoInitialData(g_EsoBuildSetMaxData, g_EsoInitialSetMaxData);
	UpdateEsoSetMaxData();
	
	UpdateEsoInitialBuffData();
	
	CreateEsoBuildToggledSetData();
	CreateEsoBuildToggledCpData();
	CreateEsoBuildToggledSkillData();
	
	UpdateEsoPtsToggleData();
	
	UpdateEsoInitialToggleSetData();
	UpdateEsoInitialToggleCpData();
	UpdateEsoInitialToggleSkillData();
	
	CreateEsoBuildItemDetailsPopup();
	CreateEsoBuildFormulaPopup();
	CreateEsoBuildClickWall();
	CreateEsoComputedStats();
	
	CreateEsoBuildBuffElements();
	AddEsoBuildSkillDetailsButtons();
	
	$("#esotbRace").change(OnEsoRaceChange)
	$("#esotbClass").change(OnEsoClassChange)
	$("#esotbVampireStage").change(OnEsoVampireChange)
	$("#esotbWerewolfStage").change(OnEsoWerewolfChange)
	$("#esotbMundus").change(OnEsoMundusChange)
	$("#esotbMundus2").change(OnEsoMundusChange)
	$("#esotbCPTotalPoints").change(OnEsoCPTotalPointsChange);
	$("#esotbStatList").find(".esotbStatRow").click(OnEsoClickStatRow);
	$("#esotbStatList").find(".esotbStatDetailsButton").click(OnEsoClickStatDetails);
	$("#esotbStatList").find(".esotbStatWarningButton").click(OnEsoClickStatWarningButton);
	$("#esotbStatList").find(".esotbStatNoteButton").click(OnEsoClickStatWarningButton);
	$("#esotbStealth").click(OnEsoClickStealth);	
	$("#esotbCyrodiil").click(OnEsoClickCyrodiil);
	$("#esotbMitigationBlock").click(OnEsoClickMitigationBlock);
	$("#esotbMitigationPVP").click(OnEsoClickMitigationPVP);
	$("#esotbEnableCP").click(OnEsoUpdateStats);
	$("#esotbUpdate18Rules").click(OnEsoUpdateStats);
	$("#esotbUpdate21Rules").click(OnEsoUpdate21Click);
	$("#esotbUpdate22Rules").click(OnEsoUpdate22Click);
	
	$(".esotbInputValue").on('input', function(e) { OnEsoInputChange.call(this, e); });
	
	$(".esotbItemIcon").click(OnEsoClickItemIcon)
	
	$(".esotbComputeItems").click(OnEsoClickComputeItems);

	$("#esotbItemDetailsCloseButton").click(CloseEsoItemDetailsPopup);
	$("#esotbFormulaCloseButton").click(CloseEsoFormulaPopup);
	$("#esotbClickWall").click(OnEsoClickBuildWall);
	
	$("#esotbStatTabList").find(".esotbStatTab").click(OnEsoClickBuildStatTab);
	
	$(document).on("EsoItemSearchPopupOnClose", OnEsoItemSearchPopupClose);
	
	$(document).on("esocpUpdate", OnEsoBuildCpUpdate);
	
	$(".esotbItemDetailsButton").click(OnEsoItemDetailsClick);
	$(".esotbItemEnchantButton").click(OnEsoItemEnchantClick);
	$(".esotbItemDisableButton").click(OnEsoItemDisableClick);
	$(".esotbSkillDetailsButton").click(OnEsoSkillDetailsClick);
	
	$("#esotbWeaponBar1").click(OnEsoWeaponBarSelect1);
	$("#esotbWeaponBar2").click(OnEsoWeaponBarSelect2);
	
	$(document).on("EsoSkillBarSwap", OnEsoBuildSkillBarSwap);
	$(document).on("EsoSkillUpdate", OnEsoBuildSkillUpdate);
	$(document).on("EsoSkillBarUpdate", OnEsoBuildSkillBarUpdate);
	
	$(".esotbBuffCheck").click(OnEsoBuildBuffCheckClick);
	$(".esotbBuffItem").click(OnEsoBuildBuffClick);
	
	$(".esotbItemTransmuteList").change(OnEsoTransmuteListChange);
	
	$(".esotbItemButton").click(OnEsoItemButtonClick);
	$(".esotbItemTransmute").click(OnEsoItemButtonClick);	
	
	if ((window.g_EsoSkillIsMobile == null || !window.g_EsoSkillIsMobile) && window.skin != "minerva")
	{
		$(".esovsSkillContentBlock").children(".esovsAbilityBlock").click(OnEsoBuildAbilityBlockClick);
	}
	else
	{
		// $(".esovsSkillContentBlock").find(".esovsAbilityBlockIcon").click(OnEsoBuildAbilityIconBlockClick);
	}
	
	$("#esotbSaveButton").click(OnEsoBuildSave);
	$("#esotbCreateCopyButton").click(OnEsoBuildCreateCopy);
	$("#esotbDeleteButton").click(OnEsoBuildDelete);
	
	$('#esotbItemSetupEquipSet').focusin(function() {
	    	$('#esotbItemSetupEquipSet').val('');
	 });
	
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) OnEsoBuildEscapeKey(e);
	});
	
	$("#esotbMitigationShowDetails").click(OnEsoShowMitigationDetails);
	$(".esotbMitigationTable td").click(OnEsoMitigationTableClick);
	
	$(".esotbStatSectionTitle").click(OnEsoStatSectionTitleClick);
	
	g_EsoBuildEnableUpdates = false;
	
	CopyEsoSkillsToItemTab();
	UpdateEsoCpData();
	UpdateAllEsoItemTraitLists();
	
	UpdateEsoSkillGroupDisplay();
	
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoComputedStatsList(true);
	OnLeaveEsoSkillBarIcon();
}


$( document ).ready(esotbOnDocReady);


