/*
 * TODO:
 * 		- Description of input types (plain, percent, special, etc...)
 */

ESO_TESTBUILD_SHOWALLRAWINPUTS = false;

ESO_ICON_URL = "http://esoicons.uesp.net";

ESO_MAX_ATTRIBUTES = 64;
ESO_MAX_LEVEL = 50;
ESO_MAX_CPLEVEL = 16;
ESO_MAX_EFFECTIVELEVEL = 66;

 	// Time between an input change and a stat update in seconds
ESO_BUILD_UPDATE_MINTIME = 0.5;	 

g_EsoBuildLastUpdateRequest = 0;
g_EsoBuildRebuildStatFlag = false;
g_EsoBuildEnableUpdates = true;
g_EsoBuildClickWallLinkElement = null;

g_EsoBuildItemData = {};
g_EsoBuildEnchantData = {};
g_EsoBuildSetData = {};
g_EsoBuildSetMaxData = {};
g_EsoBuildToggledSetData = {};
g_EsoBuildToggledSkillData = {};
g_EsoBuildLastInputValues = {};

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

g_EsoFormulaInputValues = {};
g_EsoInputStatSources = {};


ESO_MUNDUS_BUFF_DATA = 
{
	"The Atronach" : {
		abilityId: 13982,
		icon : "/esoui/art/icons/ability_mundusstones_009.png",
		description: "Increases your Magicka Recovery.",
	},
	"The Lady" : {
		abilityId: 13976,
		icon : "/esoui/art/icons/ability_mundusstones_005.png",
		description: "Increases your Physical Resistance.",
	},
	"The Lover" : {
		abilityId: 13981,
		icon : "/esoui/art/icons/ability_mundusstones_011.png",
		description: "Increases your Spell Resistance.",
	},
	"The Lord" : {
		abilityId: 13978,
		icon : "/esoui/art/icons/ability_mundusstones_007.png",
		description: "Increases your Maximum Health.",
	},
	"The Mage" : {
		abilityId: 13943,
		icon : "/esoui/art/icons/ability_mundusstones_002.png",
		description: "Increases your Maximum Magicka.",
	},
	"The Ritual" : {
		abilityId: 13980,
		icon : "/esoui/art/icons/ability_mundusstones_010.png",
		description: "Increases your Healing Done.",
	},
	"The Serpent" : {
		abilityId: 13974,
		icon : "/esoui/art/icons/ability_mundusstones_004.png",
		description: "Increases your Stamina Recovery.",
	},
	"The Shadow" : {
		abilityId: 13984,
		icon : "/esoui/art/icons/ability_mundusstones_012.png",
		description: "Increases your Critical Strike Damage.",
	},
	"The Steed" : {
		abilityId: 13977,
		icon : "/esoui/art/icons/ability_mundusstones_006.png",
		description: "Increases your Movement Speed and Health Recovery.",
	},
	"The Thief" : {
		abilityId: 13975,
		icon : "/esoui/art/icons/ability_mundusstones_003.png",
		description: "Increases your Critical Strike Chance.",
	},
	"The Tower" : {
		abilityId: 13985,
		icon : "/esoui/art/icons/ability_mundusstones_013.png",
		description: "Increases your Maximum Stamina.",
	},
	"The Warrior" : {
		abilityId: 13985,
		icon : "/esoui/art/icons/ability_mundusstones_001.png",
		description: "Increases your Weapon Damage.",
	},
};

ESOBUILD_SLOTID_TO_EQUIPSLOT = 
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


ESOBUILD_SKILLTYPES = 
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


g_EsoBuildBuffData =
{
		"Warhorn" : 
		{
			enabled: false,
			skillEnabled : false,
			values : [0.10, 0.10, 0.10],
			display: "%",
			statIds : ["Health", "Magicka", "Stamina"],
			icon : "/esoui/art/icons/ability_ava_003_a.png",
		},
		 "Major Force" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.30,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_ava_003_a.png",
		},
		"Minor Force" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.12,
			display: "%",
			statId : "CritDamage",
			icon : "/esoui/art/icons/ability_nightblade_003_a.png",
		},
		
		"Major Mending" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.25,
			display: "%",
			statId : "HealingDone",
			icon : "/esoui/art/icons/ability_templar_cleansing_ritual.png",
		},
		// Minor Mending: /esoui/art/icons/ability_templar_extended_ritual.png
		"Major Sorcery" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display: "%",
			statId : "SpellDamage",
			icon : "/esoui/art/icons/ability_sorcerer_critical_surge.png",
		},
		"Minor Sorcery" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.05,
			display: "%",
			statId : "SpellDamage",
			icon : "/esoui/art/icons/ability_sorcerer_surge.png",
		},
		"Major Brutality" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display: "%",
			statId : "WeaponDamage",
			icon : "/esoui/art/icons/ability_2handed_005.png",
		},
		"Minor Brutality" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.05,
			display: "%",
			statId : "WeaponDamage",
			icon : "/esoui/art/icons/ability_warrior_012.png",
		},
		"Major Resolve" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 5280,
			category : "Skill",
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_warrior_021.png",
		},
		"Minor Resolve" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 1320,
			category : "Skill",
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_warrior_033.png",
		},
		"Major Ward" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 5280,
			category : "Skill",
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_069.png",
		},
		"Minor Ward" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 1320,
			category : "Skill",
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_038.png",
		},
		"Major Savagery" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 2191,
			statId : "WeaponCrit",
			icon : "/esoui/art/icons/ability_warrior_022.png",
		},
		"Minor Savagery" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 657,
			statId : "WeaponCrit",
			icon : "/esoui/art/icons/ability_warrior_005.png",
		},
		"Major Prophecy" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 2191,
			statId : "SpellCrit",
			icon : "/esoui/art/icons/ability_mage_017.png",
		},
		"Minor Prophecy" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 657,
			statId : "SpellCrit",
			icon : "/esoui/art/icons/ability_mage_042.png",
		},
		"Major Fortitude" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display : "%",
			statId : "HealthRegen",
			icon : "/esoui/art/icons/ability_healer_003.png",
		},
		"Minor Fortitude" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.10,
			display : "%",
			statId : "HealthRegen",
			icon : "/esoui/art/icons/ability_healer_002.png",
		},
		"Major Intellect" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display : "%",
			statId : "MagickaRegen",
			icon : "/esoui/art/icons/ability_mage_045.png",
		},
		"Minor Intellect" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.10,
			display : "%",
			statId : "MagickaRegen",
			icon : "/esoui/art/icons/ability_mage_044.png",
		},
		"Major Endurance" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display : "%",
			statId : "StaminaRegen",
			icon : "/esoui/art/icons/ability_warrior_028.png",
		},
		"Minor Endurance" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.10,
			display : "%",
			statId : "StaminaRegen",
			icon : "/esoui/art/icons/ability_warrior_031.png",
		},
		"Major Expedition" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.30,
			display : "%",
			statId : "SprintSpeed",
			icon : "/esoui/art/icons/ability_rogue_049.png",
		},
		"Minor Expedition" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.10,
			display : "%",
			statId : "SprintSpeed",
			icon : "/esoui/art/icons/ability_rogue_045.png",
		},
		"Major Vitality" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.30,
			display : "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_healer_018.png",
		},
		"Minor Vitality" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.08,
			display : "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_healer_004.png",
		},
		"Empower" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display : "%",
			statId : "Empower",
			statDesc : "Increases the power of your next attack by ",
			icon : "/esoui/art/icons/ability_warrior_012.png",
		},
		"Spell Power Cure" :			//TODO: Check how its added to other SD/WD stats 
		{
			enabled: false,
			skillEnabled : false,
			value : 258,
			category: "Set",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			statDesc : "Increases your Weapon and Spell Damage by ",
			icon : "/esoui/art/icons/ability_mage_045.png",
		},
		"Major Evasion" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.20,
			display : "%",
			statId : "DodgeChance",
			icon : "/esoui/art/icons/ability_rogue_037.png",
		},
			// Minor Evasion: /esoui/art/icons/ability_rogue_035.png
		"Major Berserk" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.25,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_rogue_011.png",
		},
		"Minor Berserk" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.08,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_warrior_025.png",
		},
		"Major Protection" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -0.30,
			display: "%",
			statId : "DamageTaken",
			icon : "/esoui/art/icons/ability_templar_sun_shield.png",
		},
		//Minor Lifesteal: Heal 2% damage done
		"Minor Protection" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -0.08,
			display: "%",
			statId : "DamageTaken",
			icon : "/esoui/art/icons/ability_templar_radiant_ward.png",
		},
		"Major Defile" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -0.30,
			display: "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_nightblade_001_a.png",
		},
		"Minor Defile" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -0.08,
			display: "%",
			statId : "HealingReceived",
			icon : "/esoui/art/icons/ability_nightblade_001_b.png",
		},
			// Major Heroism: /esoui/art/icons/ability_templar_breath_of_life.png
		"Minor Heroism" : 
		{
			enabled: false,
			skillEnabled : false,
			value : "Grants you 1 Ultimate every 1.5 seconds for 9 seconds.",
			statId : "OtherEffects",
			icon : "/esoui/art/icons/ability_templar_honor_the_dead.png",
		},  
		"Major Fracture" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -5280,
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_1handed_002_a.png",
		},
		"Minor Fracture" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -1320,
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_1handed_002.png",
			//icon : "/esoui/art/icons/ability_warrior_016.png",
		},
		"Major Breach" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -5280,
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_039.png",
			//icon : "/esoui/art/icons/ability_1handed_002_b.png",			
		},
		"Minor Breach" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -1320,
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_053.png",
		},
			// Major Maim: /esoui/art/icons/ability_fightersguild_004_a.png
		"Minor Maim" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -0.15,
			display: "%",
			statId : "DamageDone",
			icon : "/esoui/art/icons/ability_fightersguild_004.png",
		},
		"Minor Vulnerability" : 
		{
			enabled: false,
			skillEnabled : false,
			value : 0.08,
			display: "%",
			statId : "DamageTaken",
			icon : "/esoui/art/icons/death_recap_poison_ranged.png",
		},
		"Weapon Damage Enchantment" :
		{
			enabled: false,
			skillEnabled : false,
			visible : false,
			toggleVisible : true,
			value : 348,
			category: "Item",
			statIds : [ "WeaponDamage", "SpellDamage" ],
			icon : "/esoui/art/icons/enchantment_weapon_berserking.png",
		},
		"Maelstrom DW Enchantment" :
		{
			enabled: false,
			skillEnabled : false,
			visible : false,
			toggleVisible : true,
			value : 3096,
			statDesc : "Increases the Spell and Weapon Damage of your next non-AoE DoT attack by ",
			category: "Item",
			statIds : [ "MaelstromDamage" ],
			icon : "/esoui/art/icons/enchantment_weapon_berserking.png",
		},
		"Lycanthropy" :
		{
			enabled: false,
			skillEnabled : false,
			visible : false,
			toggleVisible : true,
			displays : [ "", "", "%", "%", "%", "%" ],
			categories : [ "Buff", "Buff", "Buff", "Buff", "Buff", "Skill" ],
			values : [ 9966, 9966, 0.30, 0.15, 0.10, 0.25 ],
			statIds : [ "SpellResist", "PhysicalResist", "Stamina", "StaminaRegen", "SprintSpeed", "PoisonDamageTaken" ],
			icon: "/esoui/art/icons/ability_werewolf_001.png",
		},
		
			/* Target Buffs */
		"Major Fracture (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -5280,
			category: "Target",
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_1handed_002_a.png",
		},
		"Minor Fracture (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -1320,
			category: "Target",
			statId : "PhysicalResist",
			icon : "/esoui/art/icons/ability_1handed_002.png",
		},
		"Major Breach (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -5280,
			category: "Target",
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_039.png",
		},
		"Minor Breach (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			value : -1320,
			category: "Target",
			statId : "SpellResist",
			icon : "/esoui/art/icons/ability_mage_053.png",
		},
		"Minor Maim (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			category: "Target",
			value : -0.15,
			display: "%",
			statId : "AttackBonus",
			icon : "/esoui/art/icons/ability_fightersguild_004.png",
		},
		"Minor Vulnerability (Target)" : 
		{
			enabled: false,
			skillEnabled : false,
			category: "Target",
			value : 0.08,
			display: "%",
			statId : "DamageTaken",
			icon : "/esoui/art/icons/death_recap_poison_ranged.png",
		},
		
			/* Cyrodiil */
		"Offensive Scroll Bonus" : 
		{
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			category: "Buff",
			value : 0.05,
			display: "%",
			statIds : [ "SpellDamage", "WeaponDamage" ],
			icon : "/esoui/art/icons/ability_armor_004.png",
		},
		"Defensive Scroll Bonus" : 
		{
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			category: "Buff",
			value : 0.05,
			display: "%",
			statIds : [ "SpellResist", "PhysicalResist" ],
			icon : "/esoui/art/icons/ability_weapon_009.png",
		},
		"Battle Spirit" :
		{
			visible : false,
			toggleVisible : true,
			enabled: false,
			skillEnabled : false,
			displays : [ "", "%", "%", "%" ],
			categories : [ "Skill2", "Buff", "Buff", "Buff" ],
			values : [ 5000, -0.50, -0.50, -0.50 ],
			statIds : [ "Health", "HealingReceived", "DamageTaken", "DamageShield" ],
			icon: "/esoui/art/icons/ability_templar_002.png",
		},
		//Minor Aegis: 5% less damage from Boss Monsters
		//Minor Slayer: 5% more damage to Boss Monsters.

};


ESO_ACTIVEEFFECT_MATCHES = [

    {
		statId: "BlockMitigation",
		display: "%",
		match: /While slotted, the amount of damage you can block is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "BlockCost",
		display: "%",
		factorValue: -1,
		match: /the cost of blocking is reduced by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "BreakFreeCost",
		display: "%",
		factorValue: -1,
		match: /While slotted, the Stamina cost of breaking free from a disabling effect is reduced for each piece of Heavy Armor equipped.[\s]*Current Bonus: ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "StaminaRegen",
		display: "%",
		match: /While slotted, your Stamina Recovery is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "WeaponDamage",
		display: "%",
		match: /While slotted, your weapon damage is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "Magicka",
		display: "%",
		match: /While slotted, your Max Magicka is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "Health",
		display: "%",
		match: /While slotted, your Max Health is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		buffId: "Major Prophecy",
		match: /While slotted, you gain Major Prophecy/i
	},
	{
		buffId: "Major Savagery",
		match: /While slotted, you gain Major Prophecy and Major Savagery/i
	},
	{
		buffId: "Minor Vitality",
		match: /While slotted you gain Minor Vitality/i
	},
	{
		buffId: "Major Savagery",
		match: /While slotted you gain Major Savagery/i
	},
	{
		buffId: "Major Prophecy",
		match: /While slotted, your Max Magicka is increased by [0-9]+\.?[0-9]*% and you gain Major Prophecy/i
	},
	{
		buffId: "Minor Fortitude",
		match: /While slotted, you gain Minor Fortitude/i
	},
	{
		buffId: "Minor Endurance",
		match: /While slotted, you gain Minor Fortitude, Minor Endurance/i
	},
	{
		buffId: "Minor Intellect",
		match: /While slotted, you gain Minor Fortitude, Minor Endurance, and Minor Intellect/i
	},
	
		/* Begin Other Effects */
	{
		statId: "OtherEffects",
		display: "%",
		rawInputMatch: /(While slotted, blocking any attack increases the damage of your next Power Slam by [0-9]+\.?[0-9]*% for [0-9]+ seconds)/i,
		match: /While slotted, blocking any attack increases the damage of your next Power Slam by ([0-9]+\.?[0-9]*)% for [0-9]+ seconds/i
	},
	{
		statId: "OtherEffects",		//TODO?
		rawInputMatch: /(While slotted, your Spell and Weapon Damage is increased by [0-9]+ for Ardent Flame abilities)/i,
		match: /While slotted, your Spell and Weapon Damage is increased by ([0-9]+) for Ardent Flame abilities/i
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(While slotted, any time you kill an enemy you gain [0-9]+ Ultimate\.)/i,
		match: /While slotted, any time you kill an enemy you gain ([0-9]+) Ultimate/i
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(While slotted, your movement speed while stealthed or invisible is increased by [0-9]+\.?[0-9]*%\.)/i,
		match: /While slotted, your movement speed while stealthed or invisible is increased by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(You also prevent the stun and reduce the damage from stealth attacks by [0-9]+% for you and nearby allies\.)/i,
		match: /You also prevent the stun and reduce the damage from stealth attacks by ([0-9]+)% for you and nearby allies/i
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(You also recover ([0-9]+) Magicka every 0\.5 seconds\.)/i,
		match: /You also recover ([0-9]+) Magicka every 0\.5 seconds/i
	},
	{
		statId: "OtherEffects",
		match: /While slotted, any time you kill an enemy you gain ([0-9]+) Ultimate\./i
	},
	{
		statId: "OtherEffects",
		rawInputMatch: /(Critical hits from crouch grant Minor Berserk)/i,
		match: /Critical hits from crouch grant Minor Berserk/i,
	},
		/* End Other Effects */
	
		/* Begin Toggled Abilities */
	{
		id: "Leeching Strikes",
		matchSkillName: true,
		baseSkillId: 37977,
		statId: "OtherEffects",
		toggle: true,
		enabled: false,
		rawInputMatch: /(Imbue your weapons with soul-stealing power, causing your Light and Heavy Attacks to restore [0-9]+ Magicka, [0-9]+ Stamina, and [0-9]+\.?[0-9]*% of your Max Health while toggled\.)/i,
		match: /Imbue your weapons with soul-stealing power, causing your Light and Heavy Attacks to restore [0-9]+ Magicka, [0-9]+ Stamina, and ([0-9]+\.?[0-9]*)% of your Max Health while toggled/i
	},
	{
		id: "Leeching Strikes",
		matchSkillName: true,
		baseSkillId: 37977,
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		factorValue: -1,
		display: "%",
		match: /Leeching Strikes also reduces your Weapon Power and Spell Power by ([0-9]+\.?[0-9]*)% while toggled/i
	},
	{
		id: "Leeching Strikes",
		matchSkillName: true,
		baseSkillId: 37977,
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		factorValue: -1,
		display: "%",
		match: /Leeching Strikes also reduces your Weapon Power and Spell Power by ([0-9]+\.?[0-9]*)% while toggled/i
	},
	{
		id: "Bound Armor",
		baseSkillId: 30418,
		statId: "Magicka",
		toggle: true,
		enabled: false,
		display: "%",
		match: /The armor also increases your Max Magicka by ([0-9]+\.?[0-9]*)%/i
	},
	{
		id: "Bound Armor",
		displayName: "Bound Armaments",
		baseSkillId: 30418,
		statId: "HADamage",
		toggle: true,
		enabled: false,
		display: "%",
		match: /The armor also increases your damage with Heavy Attacks by ([0-9]+\.?[0-9]*)% and increases your Max Stamina by [0-9]+\.?[0-9]*%/i
	},
	{
		id: "Bound Armor",
		displayName: "Bound Armaments",
		baseSkillId: 30418,
		statId: "Stamina",
		toggle: true,
		enabled: false,
		display: "%",
		match: /The armor also increases your damage with Heavy Attacks by [0-9]+\.?[0-9]*% and increases your Max Stamina by ([0-9]+\.?[0-9]*)%/i
	},
	{
		id: "Bound Armor",
		baseSkillId: 30418,
		buffId : "Minor Resolve",
		toggle: true,
		enabled: false,
		match: /Protect yourself with the power of Oblivion, creating a suit of Daedric mail that grants Minor Resolve/i,
	},
	{
		id: "Bound Armor",
		baseSkillId: 30418,
		buffId : "Minor Ward",
		toggle: true,
		enabled: false,
		match: /Protect yourself with the power of Oblivion, creating a suit of Daedric mail that grants Minor Resolve and Minor Ward/i,
	},
	{
		id: "Lightning Form",
		baseSkillId: 30235,
		buffId : "Major Ward",
		toggle: true,
		enabled: false,
		match: /While in this form you also gain Major Resolve and Major Ward/i,
	},
	{
		id: "Lightning Form",
		baseSkillId: 30235,
		buffId : "Major Resolve",
		toggle: true,
		enabled: false,
		match: /While in this form you also gain Major Resolve and Major Ward/i,
	},
	{
		id: "Lightning Form",
		displayName: "Hurricane",
		baseSkillId: 30244,
		buffId : "Minor Expedition",
		toggle: true,
		enabled: false,
		match: /While in this form you gain Major Resolve, Major Ward, and Minor Expedition/i,
	},
	{
		id: "Lightning Form",
		displayName: "Boundless Storm",
		baseSkillId: 30255,
		buffId : "Major Expedition",
		toggle: true,
		enabled: false,
		match: /Activating this grants Major Expedition for a brief period/i,
	},
	{
		id: "Molten Armaments",
		baseSkillId: 32173,
		//baseSkillId: 32156,
		toggle: true,
		enabled: false,
		statId: "HADamage",
		display: "%",
		match: /Your own damage with fully\-charged Heavy Attacks is increased by ([0-9]+\.?[0-9]*)% while active/i,
	},
	{
		id: "Molten Armaments",
		baseSkillId: 32173,
		toggle: true,
		enabled: false,
		buffId : "Major Sorcery",
		match: /harge you and your allies' weapons with volcanic power to gain Major Sorcery/i,
	},
		/* End Toggled Abilities */
	
	
	// While slotted, your Spell and Weapon Damage is increased by 101 for Ardent Flame abilities.
];


ESO_PASSIVEEFFECT_MATCHES = [
	{
		factorStatId: "ArmorLight",
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces the Magicka cost of spells by ([0-9]+\.?[0-9]*)% per piece of Light Armor/i,
	},
	{
		factorStatId: "ArmorLight",
		statId: "MagickaRegen",
		display: "%",
		match: /Increases Magicka Recovery by ([0-9]+\.?[0-9]*)% per piece of Light Armor/i,
	},
	{
		statId: "SpellResist",
		match: /Increases your Spell Resistance for each piece of Light Armor equipped.[\s\S]*?Current Bonus\: ([0-9]+)/i,
	},
	{
		statRequireId: "ArmorLight",
		statRequireValue: 5,
		category: "Skill2",
		statId: "SpellCrit",
		match: /WHEN 5 OR MORE PIECES OF LIGHT ARMOR ARE EQUIPPED[\s\S]*?Increases your Spell Critical rating by ([0-9]+)/i,
	},
	{
		statRequireId: "ArmorLight",
		statRequireValue: 5,
		statId: "SpellPenetration",
		match: /WHEN 5 OR MORE PIECES OF LIGHT ARMOR ARE EQUIPPED[\s\S]*?Increases your Spell Penetration by ([0-9]+)/i,
	},
	{
		category: "Skill2",
		statId: "WeaponCrit",
		match: /Increases your Weapon Critical rating for each piece of Medium Armor equipped.[\s\S]*?Current Bonus\: ([0-9]+)/i,
	},
	{
		factorStatId: "ArmorMedium",
		statId: "StaminaRegen",
		display: '%',
		match: /Increases Stamina Recovery by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i,
	},
	{
		factorStatId: "ArmorMedium",
		statId: "StaminaCost",
		display: '%',
		factorValue: -1,
		match: /Reduces the Stamina cost of abilities by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i,
	},
	{
		factorStatId: "ArmorMedium",
		statId: "SneakCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces the cost of sneaking by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i,
	},
	{
		factorStatId: "ArmorMedium",
		statId: "SneakRange",
		display: '%',
		factorValue: -1,
		match: /Reduces the size of your detection area by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i,
	},
	{
		statRequireId: "ArmorMedium",
		statRequireValue: 5,
		statId: "WeaponDamage",
		display: '%',
		match: /WHEN 5 OR MORE PIECES OF MEDIUM ARMOR ARE EQUIPPED[\s\S]*?Increases your Weapon Damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		// factorStatId: "ArmorMedium", // TODO: Check?
		statId: "SprintSpeed",
		display: '%',
		match: /increases your movement speed while using Sprint by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		factorStatId: "ArmorMedium",
		statId: "RollDodgeCost",
		display: '%',
		factorValue: -1,
		match: /Reduces the cost of Roll Dodge by ([0-9]+\.?[0-9]*)% per piece of Medium Armor equipped/i,
	},
	{
		statId: "PhysicalResist",
		match: /Increases your Physical Resistance and Spell Resistance for each piece of Heavy Armor equipped.[\s\S]*?Current bonus\: ([0-9]+)/i,
	},
	{
		statId: "SpellResist",
		match: /Increases your Physical Resistance and Spell Resistance for each piece of Heavy Armor equipped.[\s\S]*?Current bonus\: ([0-9]+)/i,
	},
	{
		factorStatId: "ArmorHeavy",
		statId: "HealthRegen",
		display: "%",
		match: /Increases Health Recovery by ([0-9]+\.?[0-9]*)% per piece of Heavy Armor equipped/i,
	},
	{
		statId: "Constitution",
		match: /Also restores Magicka and Stamina each time you are hit[\s\S]*?Current bonus\: ([0-9]+)/i,
	},
	{
		factorStatId: "ArmorHeavy",
		statId: "Health",
		display: "%",
		match: /Increases Max Health by ([0-9]+\.?[0-9]*)% per piece of Heavy Armor equipped/i,
	},
	{
		statRequireId: "ArmorHeavy",
		statRequireValue: 5,
		statId: "HealingReceived",
		display: "%",
		match: /WITH 5 OR MORE PIECES OF HEAVY ARMOR EQUIPPED[\s\S]*?Increases your healing received by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SneakCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces the Stamina cost of sneaking by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		factorStatId: "ArmorTypes",
		statId: "Health",
		display: '%',
		match: /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i,
	},
	{
		factorStatId: "ArmorTypes",
		statId: "Magicka",
		display: '%',
		match: /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i,
	},
	{
		factorStatId: "ArmorTypes",
		statId: "Stamina",
		display: '%',
		match: /Increases your Max Health, Stamina, and Magicka by ([0-9]+\.?[0-9]*)% per type of Armor/i,
	},
	{
		statId: "Health",
		display: '%',
		match: /^Increases your Max Health by ([0-9]+\.?[0-9]*)% and/i,
	},
	{
		statId: "PoisonResist",
		match: /Poison and Disease Resistance by ([0-9]+)/i,
	},
	{
		statId: "DiseaseResist",
		match: /Poison and Disease Resistance by ([0-9]+)/i,
	},
	{
		statId: "HealingReceived",
		display: "%",
		match: /Increases the effectiveness of healing on you by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "HealingDone",
		display: "%",
		match: /Increases the effectiveness of healing you initiate by ([0-9]+\.?[0-9]*)% when near a keep/i,
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "ResurrectSpeed",
		display: "%",
		match: /WHILE IN PVP AREAS[\s]*?Reduces the time it takes to resurrect another played by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Health",
		display: "%",
		match: /Increases Max Health by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "Health",
		display: "%",
		match: /Increases Max Health by ([0-9]+\.?[0-9]*)% and /i,
	},
	{
		statId: "Magicka",
		display: "%",
		match: /Increases your Max Magicka by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Health",
		display: "%",
		match: /Increases Max Health and Max Stamina by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Stamina",
		display: "%",
		match: /Increases Max Health and Max Stamina by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Stamina",
		display: "%",
		match: /Increases your Max Stamina by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SpellResist",
		match: /Increases your Spell Resistance by ([0-9]+)/i,
	},
	{
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces the Magicka cost of spells by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "Magicka",
		display: "%",
		match: /Increases Max Magicka and Max Stamina by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Stamina",
		display: "%",
		match: /Increases Max Magicka and Max Stamina by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "FlameResist",
		match: /Increases Flame Resistance by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		display: "%",
		match: /Increases Flame Resistance by [0-9]+ and increases Max Magicka by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaRegen",
		display: "%",
		match: /Increases Magicka Recovery by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "StaminaRegen",
		display: "%",
		match: /Increases Stamina Recovery by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "HealthRegen",
		display: "%",
		match: /Increases Health Recovery by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "HealthRegen",
		display: "%",
		match: /Increases Health Recovery by ([0-9]+\.?[0-9]*)%\ and /i,
	},
	{
		statId: "HealthRegen",
		display: "%",
		match: /and Health Recovery by ([0-9]+\.?[0-9]*)%\./i,
	},
	{
		statId: "StaminaRegen",
		display: "%",
		match: /Increases Health Recovery by [0-9]+\.?[0-9]*% and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "Skill2",
		statId: "SneakRange",
		factorValue: -1,
		match: /Reduces your detection radius in stealth by ([0-9]+\.?[0-9]*) meters/i,
	},
	{
		statId: "WeaponCrit",
		display: "%",
		match: /Increases your Weapon Critical rating by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "ColdResist",
		match: /Increases Cold Resistance by ([0-9]+)/i,
	},
	{
		statId: "MagicDamageTaken",
		display: "%",
		factorValue: -1,
		match: /Reduces incoming damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "PhysicalDamageTaken",
		display: "%",
		factorValue: -1,
		match: /Reduces incoming damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SprintCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Sprint cost by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SprintSpeed",
		display: "%",
		match: /Increases sprint speed by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "BlockCost",
		display: "%",
		factorValue: -1,
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s]*Reduces the cost of blocking by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "BlockCost",
		display: "%",
		factorValue: -1,
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s]*Reduces the cost of blocking by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "WeaponDamage",
		display: "%",
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s]*Increases your Weapon Damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "BlockMitigation",
		display: "%",
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s\S]*?amount of damage you can block by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "BashDamage",
		display: "%",
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s]*Bashing deals ([0-9]+\.?[0-9]*)% additional damage/i,
	},
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		statId: "BashCost",
		display: "%",
		factorValue: -1,
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s\S]*?Bashing deals [0-9]+\.?[0-9]*% additional damage and costs ([0-9]+\.?[0-9]*)% less Stamina/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		factorStatId: "WeaponMace",
		category: "Skill2",
		statId: "PhysicalPenetration",
		display: "%",
		rawInputMatch: /(Each mace causes your attacks to ignore [0-9]+\.?[0-9]*% of an enemy's Physical Resistance)/i,
		match: /Each mace causes your attacks to ignore ([0-9]+\.?[0-9]*)% of an enemy's Physical Resistance/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		factorStatId: "WeaponSword",
		statId: "DamageDone",
		display: "%",
		rawInputMatch: /(Each sword increases your damage done by [0-9]+\.?[0-9]*%)/i,
		match: /Each sword increases your damage done by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		category: "Skill2",
		statId: "WeaponCrit",
		rawInputMatch: /(Each dagger increases your Weapon Critical rating[\s\S]*?Current bonus\: [0-9]+)/i,
		match: /Each dagger increases your Weapon Critical rating[\s\S]*?Current bonus\: ([0-9]+)/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		factorStatId: "WeaponAxe",
		statId: "OtherEffects",
		rawInputMatch: /(Each axe gives your melee attacks a [0-9]+\.?[0-9]*% chance to bleed enemies for [0-9]+ Physical Damage over 6 seconds\.)/i,
		match: /Each axe gives your melee attacks a [0-9]+\.?[0-9]*% chance to bleed enemies for ([0-9]+) Physical Damage over 6 seconds/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		category: "Item",
		statId: "WeaponDamage",
		factorStatId: "WeaponOffHandDamage",
		display: "%",
		round: "floor",
		match: /WHILE DUAL WIELDING[\s]*Increases Weapon Damage by ([0-9]+\.?[0-9]*)% of off-hand weapon's damage/i,
	},
	{
		statRequireId: "WeaponBow",
		statRequireValue: 1,
		category: "Skill2",
		statId: "WeaponCrit",
		match: /WITH BOW EQUIPPED[\s\S]*?Increases Weapon Critical rating by ([0-9]+)/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		category: "Skill2",
		statId: "SpellPenetration",
		display: "%",
		match: /WITH DESTRUCTION STAFF EQUIPPED[\s\S]*?Allows your Destruction Staff spells to ignore ([0-9]+)% of an enemy's Spell Resistance/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		statId: "HAChargeTime",
		display: "%",
		match: /WITH DESTRUCTION STAFF EQUIPPED[\s\S]*?Reduces the time it takes to charge a heavy attack by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		statId: "OtherEffects",
		rawInputMatch: /WITH DESTRUCTION STAFF EQUIPPED[\s]*(.*)/i,
		match: /WITH DESTRUCTION STAFF EQUIPPED[\s]*Restores ([0-9]+) Magicka when you kill a target with a Destruction Staff spell or weapon attack/i,
	},
	{
		statRequireId: "WeaponFlameStaff",
		statRequireValue: 1,
		statId: "HADamage",
		display: "%",
		match: /Fully charged heavy fire attacks deal ([0-9]+\.?[0-9]*)% additional damage/i,
	},
	{
		statRequireId: "Weapon2H",
		statRequireValue: 1,
		category: "SkillCost",
		statId: "Two_Handed_Cost",
		display: "%",
		factorValue: -1,
		match: /WITH TWO-HANDED WEAPON EQUIPPED[\s]*Reduces the cost of Two-Handed abilities by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statRequireId: "Weapon1HShield",
		statRequireValue: 1,
		category: "SkillCost",
		statId: "One_Hand_and_Shield_Cost",
		display: "%",
		factorValue: -1,
		match: /WITH ONE HAND WEAPON AND SHIELD EQUIPPED[\s]*Reduces the cost of One Hand and Shield abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon1H",
		statRequireValue: 2,
		category: "SkillCost",
		statId: "Dual_Wield_Cost",
		display: "%",
		factorValue: -1,
		match: /WHILE DUAL WIELDING[\s]*Reduces the cost of Dual Wield abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "WeaponBow",
		statRequireValue: 1,
		category: "SkillCost",
		statId: "Bow_Cost",
		display: "%",
		factorValue: -1,
		match: /WITH BOW EQUIPPED[\s]*Reduces the Stamina cost of Bow abilities by ([0-9]+\.?[0-9]*)%/i,
	},	 
	{
		statId: "WeaponDamage",
		display: "%",
		match: /^Increases your Weapon Damage by ([0-9]+\.?[0-9]*)% and /i,
	},
	{
		statId: "SpellResist",
		match: /and your Spell Resistance by ([0-9]+)/i,
	},
	{
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Magicka, Stamina, and Ultimate ability costs by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StaminaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Magicka, Stamina, and Ultimate ability costs by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StaminaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Magicka and Stamina costs for all abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Magicka and Stamina costs for all abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "UltimateCost",
		display: "%",
		factorValue: -1,
		match: /Reduces Magicka, Stamina, and Ultimate ability costs by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "UltimateCost",
		display: "%",
		factorValue: -1,
		match: /Reduces the cost of Ultimate abilities by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		category: "SkillDuration",
		statId: "Fiery Breath",
		match: /Increases the duration of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDuration",
		statId: "Searing Strike",
		match: /Increases the duration of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDuration",
		statId: "Dragonknight Standard",
		match: /Increases the duration of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDuration",
		statId: "Fiery Breath",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDuration",
		statId: "Searing Strike",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDuration",
		statId: "Dragonknight Standard",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by [0-9]+\.?[0-9]*% and the duration by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillDamage",
		statId: "Fiery Breath",
		display: "%",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDamage",
		statId: "Searing Strike",
		display: "%",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDamage",
		statId: "Dragonknight Standard",
		display: "%",
		match: /Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Sun Fire",
		display: "%",
		match: /Increases the duration of your Sun Fire, Eclipse, and Nova abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Nova",
		display: "%",
		match: /Increases the duration of your Sun Fire, Eclipse, and Nova abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Eclipse",
		display: "%",
		match: /Increases the duration of your Sun Fire, Eclipse, and Nova abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Negate",
		display: "%",
		match: /Increases the duration of Dark Magic abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Encase",
		display: "%",
		match: /Increases the duration of Dark Magic abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Rune Prison",
		display: "%",
		match: /Increases the duration of Dark Magic abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Daedric Mines",
		display: "%",
		match: /Increases the duration of Dark Magic abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Magelight",
		display: "%",
		match: /Increases the duration of Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Entropy",
		display: "%",
		match: /Increases the duration of Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "SkillDuration",
		statId: "Fire Rune",
		display: "%",
		match: /Increases the duration of Mages Guild abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "ResurrectSpeed",
		display: "%",
		match: /Increases Resurrection speed by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealthRegen",
		display: "%",
		match: /Increases Stamina, Health and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaRegen",
		display: "%",
		match: /Increases Stamina, Health and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StaminaRegen",
		display: "%",
		match: /Increases Stamina, Health and Magicka Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BlockMitigation",
		display: "%",
		match: /Block an additional ([0-9]+\.?[0-9]*)% damage/i,
	},
	{
		statId: "SpellResist",
		match: /Increases Spell Resistance by ([0-9]+)/i,
	},
	{
		statRequireId: "ArmorHeavy",
		statRequireValue: 5,
		statId: "HAStaRestore",
		display: "%",
		match: /WITH 5 OR MORE PIECES OF HEAVY ARMOR EQUIPPED[\s\S]*?increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "ArmorHeavy",
		statRequireValue: 5,
		statId: "HAMagRestore",
		display: "%",
		match: /WITH 5 OR MORE PIECES OF HEAVY ARMOR EQUIPPED[\s\S]*?increases the Magicka or Stamina your Heavy Attacks restore by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillLine: "Draconic Power",
		statId: "HealthRegen",
		display: "%",
		match: /WITH DRACONIC POWER ABILITIES SLOTTED[\s\S]*?Increases Health Recovery by ([0-9]+\.?[0-9]*)% for each Draconic Power ability slotted/i
	},
	{
		factorSkillLine: "Assassination",
		statId: "CritDamage",
		display: "%",
		match: /WITH AN ASSASSINATION ABILITY SLOTTED[\s\S]*?Increases damage dealt by Critical Strikes by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillLine: "Assassination",
		category: "Skill2",
		statId: "WeaponCrit",
		statValue: 219,
		skillName: "Pressure Points",
		skillRank: 1,
		//match: /WITH AN ASSASSINATION ABILITY SLOTTED[\s\S]*?Increases Critical Strike and Spell Critical ratings for each Assassination ability slotted/i
	},
	{
		factorSkillLine: "Assassination",
		category: "Skill2",
		statId: "SpellCrit",
		statValue: 219,
		skillName: "Pressure Points",
		skillRank: 1,
		//match: /WITH AN ASSASSINATION ABILITY SLOTTED[\s\S]*?Increases Critical Strike and Spell Critical ratings for each Assassination ability slotted/i
	},
	{
		factorSkillLine: "Assassination",
		category: "Skill2",
		statId: "WeaponCrit",
		statValue: 438,
		skillName: "Pressure Points",
		skillRank: 2,
		//match: /WITH AN ASSASSINATION ABILITY SLOTTED[\s\S]*?Increases Critical Strike and Spell Critical ratings for each Assassination ability slotted/i
	},
	{
		factorSkillLine: "Assassination",
		category: "Skill2",
		statId: "SpellCrit",
		statValue: 438,
		skillName: "Pressure Points",
		skillRank: 2,
		//match: /WITH AN ASSASSINATION ABILITY SLOTTED[\s\S]*?Increases Critical Strike and Spell Critical ratings for each Assassination ability slotted/i
	},
	{
		statRequireId: "Stealthed",
		statRequireValue: 1,
		statId: "SpellDamage",
		display: "%",
		match: /Increases Weapon and Spell Damage while invisible or stealthed by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "Stealthed",
		statRequireValue: 1,
		statId: "WeaponDamage",
		display: "%",
		match: /Increases Weapon and Spell Damage while invisible or stealthed by ([0-9]+\.?[0-9]*)%/i
	},	 
	{
		factorSkillLine: "Shadow",
		statId: "Health",
		display: "%",
		match: /WITH A SHADOW ABILITY SLOTTED[\s\S]*?Each Shadow Ability slotted increases your Max Health by ([0-9]+\.?[0-9]*)%/i
	},
	{
		requireSkillLine: "SIPHONING",
		statId: "Magicka",
		display: "%",
		match: /WITH SIPHONING ABILITY SLOTTED[\s\S]*?Increases Max Magicka ([0-9]+\.?[0-9]*)% while a Siphoning ability is slotted/i
	},
	{
		requireSkillLine: "SIPHONING",
		statId: "HealingDone",
		display: "%",
		match: /WHILE USING SIPHONING ABILITIES[\s\S]*?Increases the effectiveness of your Healing done by ([0-9]+\.?[0-9]*)% for each Siphoning ability slotted/i
	},
	{
		requireSkillLine: "DAEDRIC SUMMONING",
		statId: "HealthRegen",
		display: "%",
		match: /WHILE A DAEDRIC SUMMONING ABILITY IS SLOTTED[\s\S]*?Increases your Health and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		requireSkillLine: "DAEDRIC SUMMONING",
		statId: "StaminaRegen",
		display: "%",
		match: /WHILE A DAEDRIC SUMMONING ABILITY IS SLOTTED[\s\S]*?Increases your Health and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillType: "Sorcerer",
		statId: "SpellDamage",
		display: "%",
		match: /Increases Spell Damage and Weapon Damage by ([0-9]+\.?[0-9]*)% for each Sorcerer ability slotted/i
	},
	{
		factorSkillType: "Sorcerer",
		statId: "WeaponDamage",
		display: "%",
		match: /Increases Spell Damage and Weapon Damage by ([0-9]+\.?[0-9]*)% for each Sorcerer ability slotted/i
	},
	{
		requireSkillLine: "AEDRIC SPEAR",
		statId: "CritDamage",
		display: "%",
		match: /WHILE AN AEDRIC SPEAR ABILITY IS SLOTTED[\s]*Increases the damage bonus for your critical strikes by ([0-9]+\.?[0-9]*)%/i
	},
	{
		requireSkillLine: "AEDRIC SPEAR",
		statId: "OtherEffects",
		display: "%",
		match: /WHILE AN AEDRIC SPEAR ABILITY IS SLOTTED[\s\S]*?your damage against blocking targets by ([0-9]+\.?[0-9]*)%/i
	},
	{
		requireSkillLine: "AEDRIC SPEAR",
		statId: "OtherEffects",
		display: "%",
		match: /WHILE AN AEDRIC SPEAR ABILITY IS SLOTTED[\s]*Increases the amount of damage you can block against melee attacks by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillLine: "Fighters Guild",
		statId: "WeaponDamage",
		display: "%",
		match: /Increases Weapon Damage by ([0-9]+\.?[0-9]*)% for each Fighters Guild ability slotted/i
	},
	{
		factorSkillLine: "Mages Guild",
		statId: "Magicka",
		display: "%",
		match: /WITH A MAGES GUILD ABILITY SLOTTED[\s]*Increases your Max Magicka and your Magicka Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillLine: "Mages Guild",
		statId: "MagickaRegen",
		display: "%",
		match: /WITH A MAGES GUILD ABILITY SLOTTED[\s]*Increases your Max Magicka and your Magicka Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		factorSkillLine: "Support",
		statId: "MagickaRegen",
		display: "%",
		match: /Increases Magicka Recovery by ([0-9]+\.?[0-9]*)% for each Support ability slotted/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "HealthRegen",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina recovery in combat by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "MagickaRegen",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina recovery in combat by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "StaminaRegen",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina recovery in combat by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "OtherEffect",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Ultimate gains by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "HealingReceived",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases the magnitude of healing effects on Emperors by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "Health",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "Magicka",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	{
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "Stamina",
		display: "%",
		match: /WHILE EMPEROR[\s\S]*?Increases Health, Magicka, and Stamina by ([0-9]+\.?[0-9]*)% while in your campaign/i
	},
	//TODO: Tactician = +Siege Damage
	{
		statRequireId: "VampireStage",
		statRequireValue: 2,
		statId: "StaminaRegen",
		display: "%",
		match: /WHILE YOU HAVE VAMPIRISM STAGE 2 OR HIGHER[\s\S]*?Increases your Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "VampireStage",
		statRequireValue: 2,
		statId: "MagickaRegen",
		display: "%",
		match: /WHILE YOU HAVE VAMPIRISM STAGE 2 OR HIGHER[\s\S]*?Increases your Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "VampireStage",
		statRequireValue: 2,
		statId: "HealthRegen",
		display: "%",
		statValue: "25",
		match: /Reduces the severity of the Health Recovery determent in Vampirism stages 2 through 4/i
	},
	{
		statRequireId: "WerewolfStage",
		statRequireValue: 2,
		statId: "HAStaRestoreWerewolf",
		display: "%",
		match: /WHILE IN WEREWOLF FORM[\s\S]*?Increases the amount of Stamina your heavy attacks restore by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "WerewolfStage",
		statRequireValue: 2,
		statId: "WeaponDamage",
		display: "%",
		match: /WHILE IN WEREWOLF FORM[\s\S]*?Increases Weapon Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "PhysicalDamageDone",
		display: "%",
		match: /Increases your Physical and Shock Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "ShockDamageDone",
		display: "%",
		match: /Increases your Physical and Shock Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statId: "ShockDamageDone",
		display: "%",
		match: /Increases your Physical and Shock Damage by ([0-9]+\.?[0-9]*)%/i
	},
	{
		statRequireId: "Weapon2H",
		statRequireValue: 1,
		factorStatId: "WeaponSword",
		statId: "DamageDone",
		display: "%",
		match: /Swords increase your damage done by  ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Weapon2H",
		statRequireValue: 1,
		factorStatId: "WeaponMace",
		category: "Skill2",
		statId: "PhysicalPenetration",
		display: "%",
		match: /Maces cause your attacks to ignore ([0-9]+\.?[0-9]*)% of your target's Physical Resistance/i,
	},
	{
		statId: "FlameDamageDone",
		display: "%",
		match: /Increases your Damage with Flame effects by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "ColdDamageDone",
		display: "%",
		match: /Increases your Damage with Frost, Fire, and Shock effects by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "FlameDamageDone",
		display: "%",
		match: /Increases your Damage with Frost, Fire, and Shock effects by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "ShockDamageDone",
		display: "%",
		match: /Increases your Damage with Frost, Fire, and Shock effects by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Stealthed",
		statRequireValue: 1,
		statId: "DamageDone",
		display: "%",
		match: /Increases damage done while in stealth by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "Skill",
		statId: "LADamage",
		display: "%",
		match: /Increases your damage with melee weapon attacks by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "Skill",
		statId: "HADamage",
		display: "%",
		match: /Increases your damage with melee weapon attacks by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "WeaponRestStaff",
		statRequireValue: 1,
		statId: "HAMagRestoreRestStaff",
		display: "%",
		match: /WITH RESTORATION STAFF EQUIPPED[\s\S]*?Restores an additional ([0-9]+\.?[0-9]*)% Magicka when you complete a heavy attack/i,
	},
	
	
		/* Begin Toggled Passives */
	{
		id: "Wrath",
		baseSkillId: 29773,
		statRequireId: "ArmorHeavy",
		statRequireValue: 5,
		category: "Item",
		statId: "WeaponDamage",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /WHEN 5 OR MORE PIECES OF HEAVY ARMOR ARE EQUIPPED[\s]*Gain ([0-9]+) Weapon and Spell Damage for [0-9]+ seconds when you take damage, stacking up to 10 times/i
	},
	{
		id: "Wrath",
		baseSkillId: 29773,
		statRequireId: "ArmorHeavy",
		statRequireValue: 5,
		category: "Item",
		statId: "SpellDamage",
		toggle: true,
		enabled: false,
		maxTimes: 10,
		match: /WHEN 5 OR MORE PIECES OF HEAVY ARMOR ARE EQUIPPED[\s\S]*?Gain ([0-9]+) Weapon and Spell Damage for [0-9]+ seconds when you take damage, stacking up to 10 times/i
	},
	{
		id: "Burning Heart",
		requireSkillLine: "DRACONIC POWER",
		baseSkillId: 29457,
		statId: "HealingReceived",
		toggle: true,
		enabled: false,
		display: "%",
		match: /WHILE USING DRACONIC POWER ABILITIES[\s\S]*?Increases healing received by ([0-9]+\.?[0-9]*)% while a Draconic Power ability is active/i
	},
	{
		id: "Expert Summoner",
		baseSkillId: 31412,
		statId: "Health",
		toggle: true,
		enabled: false,
		display: "%",
		match: /Increases your Max Health by ([0-9]+\.?[0-9]*)% if you have a Daedric Summoning pet active/i
	},
	{
		statRequireId: "WeaponBow",
		statRequireValue: 1,
		id: "Hawk Eye",
		baseSkillId: 30936,
		statId: "Health",
		toggle: true,
		enabled: false,
		display: "%",
		maxTimes: 3,
		match: /WITH BOW EQUIPPED[\s\S]*?Your successful Light and Heavy Attacks increase the damage of your Bow abilities by ([0-9]+\.?[0-9]*)% for [0-9]+ seconds, stacking up to [0-9]+ times/i
	},
	{
		id: "Continuous Attack",
		baseSkillId: 39248,
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "WeaponDamage",
		display: "%",
		toggle: true,
		enabled: false,
		match: /Increases Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and /i,
	},
	{
		id: "Continuous Attack",
		baseSkillId: 39248,
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "SpellDamage",
		display: "%",
		toggle: true,
		enabled: false,
		match: /Increases Weapon and Spell Damage by ([0-9]+\.?[0-9]*)% and /i,
	},
	{
		id: "Continuous Attack",
		baseSkillId: 39248,
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "MagickaRegen",
		display: "%",
		toggle: true,
		enabled: false,
		match: /and Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Continuous Attack",
		baseSkillId: 39248,
		statRequireId: "Cyrodiil",
		statRequireValue: 1,
		statId: "StaminaRegen",
		display: "%",
		toggle: true,
		enabled: false,
		match: /and Magicka and Stamina Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
		/* End Toggled Passives */
	

		/* Begin Other Effects */
		/* End Other Effects */
	
	
		// Dragonknight
	//Increases the damage of Fiery Breath, Searing Strike, and Dragonknight Standard abilities by 3% and the duration by 2 seconds.
	//Increases the damage of Flame and Poison area of effect abilities by 6%.
	
		// Templar
	//Gives you a 25% chance to cause an extra 1803 Damage any time you hit with an Aedric Spear ability. Deals Physical Damage and scales with Weapon Damage, or deals Magic Damage and scales with Spell Damage, based on whichever is higher.
	
		// Restoration Staff
	//WITH RESTORATION STAFF EQUIPPED Increases your healing by 15% on allies under 30% Health.
	//WITH RESTORATION STAFF EQUIPPED Restores 540 Magicka when you block a spell.
	//WITH RESTORATION STAFF EQUIPPED Increases healing with Restoration Staff spells by 5%.
	
		// Destruction Staff
	//Grants bonus effects based on the element used:
		//Fully charged heavy fire attacks deal 12% additional damage.
		//Fully charged heavy frost attacks grant a damage shield that absorbs 1809 damage.
		//Fully charged heavy shock attacks damage nearby enemies for 100% of the damage done.
	
		// Bow
	//WITH BOW ABILITIES Gives you a damage bonus of up to 12% against enemies at longer range.
	
		// Dual Wield
	//WHILE DUAL WIELDING Increases damage with Dual Wield abilities by 20% against enemies with under 25% Health.
	
		// One Hand and Shield
	//WITH ONE HAND WEAPON AND SHIELD EQUIPPED Increases the amount of damage you can block from projectiles and ranged attacks by 15%.
	//WITH ONE HAND WEAPON AND SHIELD EQUIPPED Increases your Movement Speed while blocking by 60%
	
		// Two Handed
	//Grants a bonus based on the type of weapon equipped:
		//Axes grant your melee attacks 16% chance to apply a bleed dealing 5635 Physical Damage over 6 seconds.
	
		// Racial
	//Gives your melee attacks a 10% chance to restore 854 Health.
	//Restores 361 Stamina whenever you damage an enemy with a melee attack. This can happen no more than once every 3 seconds.
];


ESO_SETEFFECT_MATCHES = [
	{
		statId: "SpellCrit",
		match: /Adds ([0-9]+) Spell Critical/i,
	},
	{
		statId: "WeaponCrit",
		match: /Adds ([0-9]+) Weapon Critical/i,
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
		statId: "SpellDamage",
		match: /Increase Spell Damage by ([0-9]+)/i,
	},
	{
		statId: "SpellDamage",
		match: /increases Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Spell Damage/i,
	},
	{
		statId: "WeaponDamage",
		match: /increases Weapon and Spell Damage by ([0-9]+)/i,
	},
	{
		statId: "WeaponDamage",
		match: /Increase Weapon Damage by ([0-9]+)/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon Damage/i,
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
		statId: "PhysicalResist",
		match: /Adds ([0-9]+) Physical Resistance/i,
	},
	{
		statId: "SpellResist",
		match: /Adds ([0-9]+) Spell Resistance/i,
	},
	{
		statId: "HealingTaken",
		display: '%',
		match: /Adds ([0-9]+\.?[0-9]*)% Healing Taken/i,
	},	
	{
		statId: "HealingReceived",
		display: '%',
		match: /Group members within [0-9]+m gain ([0-9]+\.?[0-9]*)% increased effect from heals/i,
	},	
	{
		statId: "HealingReceived",
		display: '%',
		match: /When you are healed, gain ([0-9]+\.?[0-9]*)% additional healing/i,
	},	
	{
		statId: "CritDamage",
		display: '%',
		match: /Critical Damage increases by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statId: "CritDamage",
		statRequireId: "Stealthed",
		statRequireValue: 1,
		display: '%',
		match: /Attacking from stealth increases Critical Damage by an additional ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statId: "CritResist",
		display: '%',
		match: /Reduces damage from Critical Hits by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaCost",
		display: '%',
		factorValue: -1,
		match: /Reduce the Magicka cost of abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaCost",
		display: '%',
		factorValue: -1,
		match: /Reduce all costs by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "MagickaCost",
		display: '%',
		factorValue: -1,
		match: /Reduce Magicka costs for up to [0-9]+ group members by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statId: "StaminaCost",
		display: '%',
		factorValue: -1,
		match: /Reduce the Stamina cost of abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StaminaCost",
		display: '%',
		factorValue: -1,
		match: /Reduces the costs of Stamina abilities by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statId: "StaminaCost",
		display: '%',
		factorValue: -1,
		match: /Reduce all costs by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "UltimateCost",
		display: '%',
		factorValue: -1,
		match: /Reduce cost of Ultimate abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "PhysicalPenetration",
		match: /Adds ([0-9]+) Physical Penetration/i,
	},
	{
		statId: "Spell Penetration",
		match: /Adds ([0-9]+) Spell Penetration/i,
	},
	{
		statId: "SnareDuration",
		display: '%',
		factorValue: -1,
		match: /Snares on you have ([0-9]+)% shorter duration/i,
	},
	{
		statId: "PlayerDamageTaken",
		factorValue: -1,
		display: '%',
		match: /Reduce damage taken from players by ([0-9]+)%/i,
	},
	{
		statId: "Constitution",
		display: '%',
		match: /Increases the Magicka and Stamina restoration benefit from the Constitution Passive ability by ([0-9]+)%/i,
	},
	{
		statId: "RollDodgeDuration",
		match: /After roll dodging, continue to dodge attacks for an additional ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		statId: "NegativeEffectDuration",
		display: '%',
		match: /Reduce the duration of negative effects on you by ([0-9]+)%/i,
	},
	{
		statId: "SprintCost",
		display: '%',
		factorValue: -1,
		match: /Reduces Stamina cost for sprinting and crouching by ([0-9]+)%/i,
	},
	{
		statId: "SprintCost",
		display: '%',
		factorValue: -1,
		match: /Sprint cost reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SprintCost",
		display: '%',
		factorValue: -1,
		match: /Sprint costs ([0-9]+\.?[0-9]*)% less/i,
	},	
	{
		statId: "SneakCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces Stamina cost for sprinting and crouching by ([0-9]+)%/i,
	},
	{
		statId: "SneakCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduces crouch cost by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SneakCost",
		display: '%',
		factorValue: -1,
		combineAs: "*%",
		match: /Reduce Sneak cost by ([0-9]+\.?[0-9]*)%/i,
	},	
	{
		statId: "BowRange",
		match: /Increase range of bow attacks by ([0-9]+) meters/i,
	},
	{
		statId: "LADamage",
		display: '%',
		category: "Skill",
		match: /Light attack and heavy attack damage increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HADamage",
		display: '%',
		category: "Skill",
		match: /Light attack and heavy attack damage increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "Skill2",
		statId: "HADamage",
		match: /Your fully charged Heavy Attacks do an additional ([0-9]+) damage/i,
	},
	{
		statId: "HADamage",
		display: '%',
		category: "Skill",
		match: /Your fully charged heavy attacks deal ([0-9]+\.?[0-9]*)% additional damage/i,
	},
	{
		statId: "FlameEffectDuration",
		match: /Increases duration of your damaging fire effects by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		statId: "SprintSpeed",
		display: '%',
		match: /movement speed increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BlockMitigation",
		display: '%',
		match: /Increase your block mitigation by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BlockMitigation",
		display: '%',
		match: /Increase block mitigation by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		category: "Skill",
		statId: "Magicka",
		display: '%',
		match: /Increase Maximum Magicka by ([0-9]+\.?[0-9]*)%./i,
	},
	{
		category: "SkillCost",
		statId: "Bow_Cost",
		display: '%',
		factorValue: -1,
		match: /Reduce cost of bow abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BowDamageDone",
		display: '%',
		match: /Reduce cost of bow abilities by [0-9]+\.?[0-9]*% and increase their damage by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealingDone",
		display: '%',
		match: /Increases healing done by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealingDone",
		display: '%',
		match: /Increase healing done by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "Health",
		match: /Increase Max Health for up to 12 group members by ([0-9]+\.?[0-9]*)/i,
	},
	{
		category: "Skill",
		statId: "StaminaRecovery",
		display: '%',
		match: /Increase Max Health for up to 12 group members by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "ResurrectSpeed",
		display: '%',
		match: /decrease time to resurrect an ally by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "BossDamageResist",
		display: '%',
		match: /you to take ([0-9]+\.?[0-9]*)% less damage from Boss/i,
	},
	{
		category: "Skill2",
		statId: "SneakRange",
		factorValue: -1,
		match: /Reduce the range you can be detected while hidden by ([0-9]+\.?[0-9]*) meters/i,
	},
	{
		category: "Skill2",
		statId: "SneakRange",
		factorValue: -1,
		match: /Decrease detection radius by ([0-9]+\.?[0-9]*) meters/i,
	},
	{
		statId: "SneakDetectRange",
		category: "Skill",
		display: '%',
		match: /Stealth detection radius increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SneakDetectRange",
		category: "Skill2",
		match: /Increases stealth detection radius by ([0-9]+) meters/i,
	},	
	{
		statId: "BreakFreeCost",
		display: '%',
		factorValue: -1,
		match: /Reduce the cost of Break Free by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "TwiceBornStar",
		match: /Allows you to have two Mundus Stone Boons at the same time/i,
	},
	{
		statId: "SpellResist",
		factorValue: 0.2309,
		round: "floor",
		match: /Mark of the Pariah[\s]*Increase your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{
		statId: "PhysicalResist",
		factorValue: 0.2309,
		round: "floor",
		match: /Mark of the Pariah[\s]*Increase your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{
		statId: "OtherEffects",
		match: /Mark of the Pariah[\s]*Increase your Physical and Spell Resistance by up to ([0-9]+) based on your missing Health/i,
	},
	{
		statId: "BreakFreeDuration",
		match: /Immunity duration after using Break Free increased by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		requireSkillType: "Armor",
		category: "Skill",
		statId: "Health",
		display: "%",
		match: /While you have an Armor Ability slotted, increase your Maximum Health by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "RollDodgeDuration",
		match: /After using Roll Dodge, continue to dodge attacks for an additional ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		category: "SkillCost",
		statId: "Restoration_Staff_Cost",
		display: "%",
		factorValue: -1,
		match: /Reduce the Magicka cost of restoration staff abilities by ([0-9]+\.?[0-9]*)/i,
	},
	{
		statId: "StaminaRegen",
		display: "%",
		match: /Increase Stamina Recovery for up to [0-9]+ group members by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "SnareEffect",
		display: "%",
		factorValue: -1,
		match: /Reduce the effectiveness of incoming snares by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		statId: "Magicka",
		display: "%",
		match: /Increase Maximum Magicka by ([0-9]+\.?[0-9]*)% while you have a destruction staff equipped/i,
	},
	{
		statRequireId: "WeaponDestStaff",
		statRequireValue: 1,
		statId: "Magicka",
		display: "%",
		match: /Increase Maximum Magicka by ([0-9]+\.?[0-9]*)% while you have a destruction staff equipped/i,
	},
	{
		statId: "SnareDuration",
		display: "%",
		factorValue: -1,
		match: /Duration of snare, stun, and disorient effects are reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "StunDuration",
		display: "%",
		factorValue: -1,
		match: /Duration of snare, stun, and disorient effects are reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "DisorientDuration",
		display: "%",
		factorValue: -1,
		match: /Duration of snare, stun, and disorient effects are reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "WerewolfTransformCost",
		display: "%",
		factorValue: -1,
		match: /Reduce cost of Werewolf Transformation by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statId: "HealingReceived",
		display: "%",
		match: /Group members within [0-9]+\.?[0-9]*m gain ([0-9]+\.?[0-9]*)% increased effect from heals/i,
	},
	{
		statId: "FlameDamageDone",
		display: "%",
		match: /Flame Damage dealt increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		statRequireId: "Stealthed",
		statRequireValue: 1,
		setBonusCount: 4,
		statId: "DamageDone",
		display: "%",
		match: /While sneaking or invisible, Spells do an additional ([0-9]+\.?[0-9]*)% damage/i,
	},	
	{
		setBonusCount: 4,
		statId: "PoisonDamageDone",
		display: "%",
		match: /Your attacks cause targets to take ([0-9]+\.?[0-9]*)% more damage from Poison/i,
	},
	{
		setBonusCount: 4,
		statId: "MagickaCost",
		display: "%",
		factorValue: -1,
		match: /Reduce Magicka costs for up to [0-9]+ group members by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		setBonusCount: 4,
		statId: "EnchantCooldown",
		factorValue: -1,
		match: /Reduce weapon enchantment's internal cooldown by ([0-9]+) second/i,
	},
	{
		setBonusCount: 4,			//TODO: Add to item tooltip?
		statId: "EnchantPotency",
		display: "%",
		match: /Increases enchantment potency by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		setBonusCount: 2,
		statId: "MountSpeed",
		display: "%",
		match: /Movement speed while mounted increased by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		setBonusCount: 4,
		statId: "MountSpeed",
		display: "%",
		match: /Increase block mitigation by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		setBonusCount: 4,
		statId: "BreakFreeCost",
		display: "%",
		match: /Reduce cost of Break Free by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		setBonusCount: 4,
		ignore: true,
		match: /Law of Julianos/i,
	},
	{
		setBonusCount: 4,
		ignore: true,
		match: /Your Weapon Damage and Spell Damage both become the highest of the two values/i,
	},
	{
		setBonusCount: 4,
		ignore: true,
		match: /Law of Julianos/i,
	},
	{
		setBonusCount: 4,
		category: "Skill2",
		statId: "HAMagRestore",
		match: /Fully charged heavy attacks restore ([0-9]+) Magicka/i,
	},
	
		// Optionally toggled set effects
	{
		id: "Armor Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /When you activate an Armor Ability you gain ([0-9]+) Physical and Spell Resistance/i,
	},
	{
		id: "Armor Master",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /When you activate an Armor Ability you gain ([0-9]+) Physical and Spell Resistance/i,
	},
	{
		id: "Armor of Rage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /chance to increase Weapon Damage by ([0-9]+) for [0-9]+ seconds after dealing damage/i,
	},
	{
		id: "Berserking Warrior",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		maxTimes: 5,
		statId: "WeaponCrit",
		match: /critical strike chance is increased by ([0-9]+) for [0-9]+ seconds\. Stacks five times/i,
	},
	{
		id: "Blood Spawn",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /chance when hit to gain ([0-9]+) Physical Resistance and Spell Resistance/i,
	},
	{
		id: "Blood Spawn",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /chance when hit to gain ([0-9]+) Physical Resistance and Spell Resistance/i,
	},
	{
		id: "Briarheart",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /chance when you deal Critical Damage to create Briarthorns which increases your Weapon Damage by ([0-9]+)/i,
	},
	{
		id: "Burning Spellweave",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /chance when dealing Flame damage to inflict the burning status effect on enemy and gain ([0-9]+) Spell Damage/i,
	},
	{
		id: "Clever Alchemist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /When you drink a potion you feel a rush of energy, gaining ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Clever Alchemist",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /When you drink a potion you feel a rush of energy, gaining ([0-9]+) Weapon and Spell Damage/i,
	},
	{
		id: "Embershield",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /chance to gain ([0-9]+) Spell Resistance/i,
	},
	{
		id: "Essence Thief",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageDone",
		display: "%",
		match: /increases your damage by ([0-9]+\.?[0-9]*)% for/i,
	},
	{
		id: "Essence Thief",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /Attacks from behind an enemy gain an additional ([0-9]+) Weapon Damage/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Health",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Magicka",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
	},
	{
		id: "Imperial Physique",
		setBonusCount: 5,
		toggle: true,
		enabled: false,
		statId: "Stamina",
		disableSetId: "Imperial Physique +600%",
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
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
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
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
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
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
		match: /you tap into the power of the Tel Var Stones you are carrying, increasing your Health, Magicka and Stamina by ([0-9]+)/i,
	},
	{
		id: "Jolting Arms",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /as well as granting yourself ([0-9]+) Spell Resistance/i,
	},
	{
		id: "Light of Cyrodiil",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageTaken",
		factorValue: -1,
		match: /While casting or channeling a spell, incoming damage is reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Lord Warden",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /chance when you take damage to summon a shadow orb that adds ([0-9]+) Physical and Spell Resistance to nearby allies/i,
	},
	{
		id: "Lord Warden",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /chance when you take damage to summon a shadow orb that adds ([0-9]+) Physical and Spell Resistance to nearby allies/i,
	},
	{
		id: "Marksman's Crest",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageDone",
		match: /increase the damage of your bow abilities against players by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "MagickaCost",
		display: "%",
		match: /triggers Overkill, which increases the cost of all abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "StaminaCost",
		display: "%",
		match: /triggers Overkill, which increases the cost of all abilities by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /and increases Spell and Weapon Damage by ([0-9]+)/i,
	},
	{
		id: "Molag Kena",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /and increases Spell and Weapon Damage by ([0-9]+)/i,
	},
	{
		id: "Moondancer",
		displayName: "MoonDancer Spell Damage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		disableSetId: "Moondancer2",
		statId: "SpellDamage",
		match: /When you activate a synergy gain either a shadow blessing that increases Spell Damage by ([0-9]+), or a lunar blessing that increases Magicka Recovery by [0-9]+/i,
	},
	{
		id: "Moondancer2",
		displayName: "MoonDancer Magicka Regen",
		setId: "Moondancer",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		disableSetId: "Moondancer",
		match: /When you activate a synergy gain either a shadow blessing that increases Spell Damage by [0-9]+, or a lunar blessing that increases Magicka Recovery by ([0-9]+)/i,
	},
	{
		id: "Necropotence",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Set",
		statId: "Magicka",
		match: /While you have a pet active your Max Magicka is increased by ([0-9]+\.?[0-9]*)/i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill2",
		statId: "LADamage",
		match: /After dodging an attack, light and heavy attacks deal ([0-9]+) increased damage for [0-9]+ seconds./i,
	},
	{
		id: "Noble Duelist's Silks",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill2",
		statId: "HADamage",
		match: /After dodging an attack, light and heavy attacks deal ([0-9]+) increased damage for [0-9]+ seconds./i,
	},
	{
		id: "Orgnum's Scales",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill",
		statId: "HealthRegen",
		display: '%',		
		match: /If below 60% Health, increase Health Recovery by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Permafrost",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "HealthRegen",
		match: /Gain ([0-9]+\.?[0-9]*) Health Recovery while you have a Damage Shield/i,
	},
	{
		id: "Ravager",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /Your melee attacks have an [0-9]+\.?[0-9]*% chance to increase Weapon Damage by ([0-9]+) for [0-9]+ seconds/i,
	},	
	{
		id: "Ravager",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "DamageTaken",
		factorValue: -1,
		match: /While affected by Stun, Immobilize, Fear, Knockdown or Disorient effects, damage you take is reduced by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Scathing Mage",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /chance when causing Critical Damage to increase your Spell Damage by ([0-9]+)/i,
	},	
	{
		id: "Scourge Harvester",
		setBonusCount: 2,
		toggle: true,
		enabled: false,
		statId: "HealingReceived",
		match: /While beam holds gain ([0-9]+\.?[0-9]*)% increased healing from all sources/i,
	},
	{
		id: "Shroud of the Lich",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "MagickaRegen",
		match: /Once per minute, when below [0-9]+\.?[0-9]*% Magicka, gain ([0-9]+) Magicka Recovery/i,
	},
	{
		id: "Skirmisher's Bite",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /Using Roll Dodge increases your Weapon Damage by ([0-9]+) and Weapon Critical by [0-9]+/i,
	},
	{
		id: "Skirmisher's Bite",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponCrit",
		match: /Using Roll Dodge increases your Weapon Damage by [0-9]+ and Weapon Critical by ([0-9]+)/i,
	},
	{
		id: "Soulshine",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /While casting or channeling a spell, your spell power is increased by ([0-9]+)/i,
	},
	{
		id: "The Brute",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /chance when hit to increase Weapon Damage by ([0-9]+)/i,
	},
	{
		id: "Tormentor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /Causing damage with a Charge ability applies Taunt for [0-9]+ seconds and increases your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Tormentor",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /Causing damage with a Charge ability applies Taunt for [0-9]+ seconds and increases your Physical and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Twice-Fanged Serpent",
		setBonusCount: 3,
		toggle: true,
		enabled: false,
		statId: "PhysicalPenetration",
		maxTimes: 3,
		match: /Attacking an enemy increases Physical Penetration by ([0-9]+)/i,
	},
	{
		id: "Unassailable",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "PhysicalResist",
		match: /While blocking, increase Physical Resistance and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Unassailable",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellResist",
		match: /While blocking, increase Physical Resistance and Spell Resistance by ([0-9]+)/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "LADamage",
		match: /After casting an ability that costs Magicka, Light Attacks deal ([0-9]+) additional damage and Heavy Attacks deal [0-9]+ additional damage/i,
	},
	{
		id: "Undaunted Infiltrator",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "HADamage",
		category: "Skill2",
		match: /After casting an ability that costs Magicka, Light Attacks deal [0-9]+ additional damage and Heavy Attacks deal ([0-9]+) additional damage/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "LADamage",
		category: "Skill2",
		match: /After casting an ability that costs Magicka, Light Attacks deal ([0-9]+) additional damage and Heavy Attacks deal [0-9]+ additional damage/i,
	},
	{
		id: "Undaunted Unweaver",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "HADamage",
		category: "Skill2",
		match: /After casting an ability that costs Magicka, Light Attacks deal [0-9]+ additional damage and Heavy Attacks deal ([0-9]+) additional damage/i,
	},
	{
		id: "Warrior's Fury",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		maxTimes: 25,
		match: /When you take critical damage, your Weapon Damage is increased by ([0-9]+)/i,
	},
	{
		id: "Way of Air",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "WeaponDamage",
		match: /After activating Roll Dodge, Weapon Damage is increased by ([0-9]+) and Spell Damage is increased by [0-9]+/i,
	},
	{
		id: "Way of Air",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		statId: "SpellDamage",
		match: /After activating Roll Dodge, Weapon Damage is increased by [0-9]+ and Spell Damage is increased by ([0-9]+)/i,
	},	
	{
		id: "Willow's Path",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill",
		statId: "HealthRegen",
		display: '%',
		match: /Increase all recovery in combat by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Willow's Path",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill",
		statId: "MagickaRegen",
		display: '%',
		match: /Increase all recovery in combat by ([0-9]+\.?[0-9]*)%/i,
	},
	{
		id: "Willow's Path",
		setBonusCount: 4,
		toggle: true,
		enabled: false,
		category: "Skill",
		statId: "StaminaRegen",
		display: '%',
		match: /Increase all recovery in combat by ([0-9]+\.?[0-9]*)%/i,
	},

		// End of Toggled Sets

	
		// Other Effects
	//Elemental Succession: While in combat, you gain a rotating bonus to either Flame, Shock, or Frost damage. The active element changes every 4 seconds. Your attacks dealing damage with the active element gain 44-515 Spell Damage.
	//Oblivion's Foe: Increase the damage of your Soul Trap abilities by 100%.
	//Syvarra's Scales: Take 20% less damage from guards
	//Trial by Fire: When you take elemental damage, gain 179-7727 Resistance to that element for 4 seconds. You can only be resistant to one element at a time.
	//Varen's Legacy: 10% chance on block that the next Area of Effect Attack you use will deal an additional 300-3450 Damage.
];

	
ESO_ENCHANT_ARMOR_MATCHES = [
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
		statId: "BashDamage",
		match: /Increase bash damage by ([0-9]+)/i,
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
		statId: "ColdResist",
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
		match: /Adds ([0-9]+) Spell Damage/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon Damage/i,
	},
	{
		statId: "PotionDuration",
		match: /Increase the duration of potion effects by ([0-9]+\.?[0-9]*) seconds/i,
	},
	{
		statId: "PotionCooldown",
		match: /Reduce the cooldown of potions below this item's level by ([0-9]+\.?[0-9]*) seconds/i,
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
	
];


ESO_ENCHANT_WEAPON_MATCHES = [
	{
		statId: "SpellDamage",
		match: /Adds ([0-9]+) Spell Damage/i,
	},
	{
		statId: "WeaponDamage",
		match: /Adds ([0-9]+) Weapon Damage/i,
	},
	/*{			// Unused?
		modValue: 0.5,
		statId: "WeaponDamage",
		match: /grants ([0-9]+) additional Weapon Damage/i,
	}, //*/
	{
		statId: "WeaponDamage",
		match: /increases Weapon Damage by ([0-9]+)/i,
	},
	{
		statId: "WeaponDamage",
		match: /increase Weapon Damage by ([0-9]+)/i,
	},
	{
		statId: "WeaponDamage",
		match: /gain ([0-9]+) Weapon Damage/i,
	},
	{
		statId: "SpellDamage",
		match: /gain ([0-9]+) Spell Damage/i,
	},
	{
		statId: "SpellDamage",
		match: /grants ([0-9]+) additional Spell Damage/i,
	},
	{
		category: "Set",
		statId: "SpellCrit",
		match: /grants ([0-9]+) additional Spell Critical/i,
	},
	{
		statId: "Health",
		match: /grants ([0-9]+) Max Health/i,
	},
	{
		statId: "Stamina",
		match: /grants ([0-9]+) Max Stamina/i,
	},
	{
		statId: "Magicka",
		match: /grants ([0-9]+) Max Magicka/i,
	},
	{
		statId: "Health",
		match: /increase Max Health by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /increase Max Stamina by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /increase Max Magicka by ([0-9]+)/i,
	},
	{
		statId: "Health",
		match: /Max Health increased by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /Max Stamina increased by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Magicka increased by ([0-9]+)/i,
	},
	{
		statId: "Health",
		match: /Max Health is increased by ([0-9]+)/i,
	},
	{
		statId: "Stamina",
		match: /Max Stamina is increased by ([0-9]+)/i,
	},
	{
		statId: "Magicka",
		match: /Max Magicka is increased by ([0-9]+)/i,
	},
  	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) Magic Damage/i,
	},
	{
		statId: "",
		match: /and restores ([0-9]+) Health/i,
	},
	{
		statId: "",
		match: /and restores ([0-9]+) Magicka/i,
	},
	{
		statId: "",
		match: /and restores ([0-9]+) Stamina/i,
	},
	{
		statId: "OtherEffects",
		match: /Reduce's targets armor by ([0-9]+) for restores [0-9]+ seconds/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) unresistable damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) flame damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) disease damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) cold damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) poison damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) shock damage/i,
	},
	{
		statId: "OtherEffects",
		match: /Deals ([0-9]+) Magic Damage to Undead and Daedra/i,
	},
	{
		statId: "OtherEffects",
		match: /Grants a ([0-9]+) point Damage Shield for [0-9]+ seconds/i,
	},
	{
		statId: "OtherEffects",
		match: /Reduce target Weapon Damage and Spell Damage by ([0-9]+) for [0-9]+ seconds/i,
	},
	{
		statId: "OtherEffects",
		match: /Increase your Weapon Damage and Spell Damage by ([0-9]+) for [0-9]+ seconds/i,
		buffId : "Weapon Damage Enchantment",
		updateBuffValue : true,
	},
	{
		statId: "OtherEffects",
		match: /Your Flurry grants ([0-9]+) additional Weapon and Spell Damage/i,
		buffId : "Maelstrom DW Enchantment",
		updateBuffValue : true,
	},
];


ESO_ABILITYDESC_MATCHES = [
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
];


function GetEsoInputValues(mergeComputedStats)
{
	ResetEsoBuffSkillEnabled();
	ResetEsoAllSkillRawOutputs();
	
	var inputValues = {};
	if (mergeComputedStats == null) mergeComputedStats = false;
	
	g_EsoInputStatSources = {};
	
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
	inputValues.ceil = Math.ceil;
	
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
		
		//g_EsoBuildBuffData['Lycanthropy'].skillAbilities.push(g_SkillsData[42358]);
		AddEsoItemRawOutputString(g_EsoBuildBuffData['Battle Spirit'], "Active Skill", "Character State");
	}
	else
	{
		g_EsoBuildBuffData['Battle Spirit'].visible = false;
		g_EsoBuildBuffData['Battle Spirit'].enabled = false;
		g_EsoBuildBuffData['Battle Spirit'].skillEnabled = false;
		
		g_EsoBuildBuffData['Offensive Scroll Bonus'].visible = false;
		g_EsoBuildBuffData['Defensive Scroll Bonus'].visible = false;
	}
		
	GetEsoInputSpecialValues(inputValues);
	
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
	
	inputValues.ActiveBar = g_EsoBuildActiveWeapon;
	
	if (g_EsoBuildActiveWeapon == 1)
	{
		if ( ( (g_EsoBuildItemData.MainHand1.weaponType >= 1 && g_EsoBuildItemData.MainHand1.weaponType <= 3) ||
				g_EsoBuildItemData.MainHand1.weaponType == 1) &&				
				g_EsoBuildItemData.OffHand1.weaponType == 14) inputValues.Weapon1HShield = 1;
		GetEsoInputItemValues(inputValues, "MainHand1");
		GetEsoInputItemValues(inputValues, "OffHand1");
		GetEsoInputItemValues(inputValues, "Poison1");
	}
	else
	{
		if ( ( (g_EsoBuildItemData.MainHand2.weaponType >= 1 && g_EsoBuildItemData.MainHand2.weaponType <= 3) ||
				g_EsoBuildItemData.MainHand2.weaponType == 1) &&				
				g_EsoBuildItemData.OffHand2.weaponType == 14) inputValues.Weapon1HShield = 1;
		GetEsoInputItemValues(inputValues, "MainHand2");
		GetEsoInputItemValues(inputValues, "OffHand2");
		GetEsoInputItemValues(inputValues, "Poison2");
	}
	
	inputValues.ArmorTypes = 0;
	if (inputValues.ArmorLight  > 0) ++inputValues.ArmorTypes;
	if (inputValues.ArmorMedium > 0) ++inputValues.ArmorTypes;
	if (inputValues.ArmorHeavy  > 0) ++inputValues.ArmorTypes;
	AddEsoInputStatSource("ArmorTypes", { source: "Worn Armor", value: inputValues.ArmorTypes });
	
	UpdateEsoItemSets();
	GetEsoInputSetValues(inputValues);
	
	GetEsoInputMundusValues(inputValues);
	GetEsoInputCPValues(inputValues);
	GetEsoInputTargetValues(inputValues);
	
	UpdateEsoBuildToggledSkillData(inputValues);
	UpdateEsoTestBuildSkillInputValues(inputValues);
	GetEsoInputSkillPassives(inputValues);
	GetEsoInputSkillActiveBar(inputValues);
	GetEsoInputBuffValues(inputValues);
	
	GetEsoInputMiscValues(inputValues);
	
	if (mergeComputedStats === true) 
	{
		for (var name in g_EsoComputedStats)
		{
			inputValues[name] = g_EsoComputedStats[name].value;
		}
	}
	
	g_EsoBuildLastInputValues = inputValues;
	return inputValues;
}


function GetEsoInputBuffValues(inputValues)
{
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (!buffData.visible || !(buffData.enabled || buffData.skillEnabled)) continue;
		GetEsoInputBuffValue(inputValues, buffName, buffData);
	}
}


function GetEsoInputBuffValue(inputValues, buffName, buffData)
{
	var statId = buffData.statId;
	var statIds = buffData.statIds;
	var category = "Buff";
	var categories = buffData.categories;
	var statValue = buffData.value;
	var statValues = buffData.values;
	
	if (buffData.category != null) category = buffData.category;
	
	if (statIds == null) statIds = [ statId ];
	if (statValues == null) statValues = [].fill.call({ length: statIds.length }, statValue);
	if (categories == null) categories = [].fill.call({ length: statIds.length }, category);
	
	for (var i = 0; i < statIds.length; ++i)
	{
		statValue = statValues[i];
		category = categories[i];
		statId = statIds[i];
		
		if (statId == "OtherEffects")
		{
			AddEsoItemRawOutputString(buffData, "OtherEffects", statValue);
			AddEsoInputStatSource("OtherEffects", { other: true, buff: buffData, buffName: buffName, value: statValue });
		}
		else
		{
			inputValues[category][statId] += parseFloat(statValue);
			AddEsoItemRawOutput(buffData, category + "." + statId, statValue);
			AddEsoInputStatSource(category + "." + statId, { buff: buffData,  buffName: buffName, value: statValue });
		}
	}
	
}


function GetEsoInputSpecialValues(inputValues)
{
	inputValues.VampireStage = parseInt($("#esotbVampireStage").val());
	
	if (inputValues.VampireStage > 0)
	{
		var healthRegenValue = 0;
		var flameDamageValue = 0;
		var costReduction = 0;
		
		if (inputValues.VampireStage == 1)
		{
			healthRegenValue = 0;
			flameDamageValue = 0;
			costReduction = 0;
		}
		else if (inputValues.VampireStage == 2)
		{
			healthRegenValue = -0.25;
			flameDamageValue = 0.15;
			costReduction = -0.07;
		}
		else if (inputValues.VampireStage == 3)
		{
			healthRegenValue = -0.50;
			flameDamageValue = 0.20;
			costReduction = -0.14;
		}
		else if (inputValues.VampireStage == 4)
		{
			healthRegenValue = -0.75;
			flameDamageValue = 0.25;
			costReduction = -0.21;
		}
		
		if (healthRegenValue != 0)
		{
			inputValues.Skill.HealthRegen += healthRegenValue;
			AddEsoInputStatSource("Skill.HealthRegen", { source: "Vampire Stage " + inputValues.VampireStage, value: healthRegenValue });
		}
		
		if (flameDamageValue != 0)
		{
			inputValues.Skill.FlameDamageTaken += flameDamageValue;
			AddEsoInputStatSource("Skill.FlameDamageTaken", { source: "Vampire Stage " + inputValues.VampireStage, value: flameDamageValue });
		}
		
		if (costReduction != 0)
		{
			inputValues.SkillCost.Vampire_Cost += costReduction;
			AddEsoInputStatSource("SkillCost.Vampire_Cost", { source: "Vampire Stage " + inputValues.VampireStage, value: costReduction });
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


function GetEsoInputSetValues(inputValues)
{
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		GetEsoInputSetDataValues(inputValues, setData);
	}
	
}


function GetEsoInputSetDataValues(inputValues, setData)
{
	if (setData == null || setData.count <= 0) return;
	setData.rawOutput = [];
	
	for (var i = 0; i < 5; ++i)
	{
		var setBonusCount = parseInt(setData.items[0]['setBonusCount' + (i+1)]);
		if (setBonusCount > setData.count) continue;
		
		var setDesc = setData.averageDesc[i];
		
		GetEsoInputSetDescValues(inputValues, setDesc, setBonusCount, setData);
	}
}


function GetEsoInputSetDescValues(inputValues, setDesc, setBonusCount, setData)
{
	var foundMatch = false;
	var addFinalEffect = false;
	
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
		
		if (matchData.statId == "OtherEffects")
		{
			addFinalEffect = true;
			continue;
		}
		
		var statValue = parseFloat(matches[1]);
		var statFactor = 1;
		if (isNaN(statValue)) statValue = 1;
		
		if (matchData.maxTimes != null)
		{
			var toggleData = g_EsoBuildToggledSetData[matchData.id];
			if (toggleData != null && toggleData.count != null) statFactor = toggleData.count;
		}
		
		if (matchData.factorValue != null)
		{
			statFactor = statFactor * matchData.factorValue;
		}
		
		statValue = statValue * statFactor;
	
		if (matchData.round == "floor") statValue = Math.floor(statValue);
		if (matchData.display == "%") statValue = statValue/100;
					
		var category = matchData.category || "Set";
		
		if (matchData.combineAs == "*%")
			inputValues[category][matchData.statId] = (1 + inputValues[category][matchData.statId]) * (1 + statValue) - 1;
		else
			inputValues[category][matchData.statId] += statValue;
		
		AddEsoItemRawOutput(setData, category + "." + matchData.statId, statValue);
		AddEsoInputStatSource(category + "." + matchData.statId, { set: setData, setBonusCount: setBonusCount, value: statValue });
	}
	
	if (!foundMatch || addFinalEffect)
	{
		AddEsoInputStatSource("OtherEffects", { other: true, set: setData, setBonusCount: setBonusCount, value: setDesc });
		AddEsoItemRawOutputString(setData, "OtherEffects", setDesc);
	}
	
}


function GetEsoEnchantData(slotId)
{
	var itemData = null;
	var enchantData = {};
	
	if (g_EsoBuildEnchantData[slotId] == null) return null;
	
	if ($.isEmptyObject(g_EsoBuildEnchantData[slotId]))
	{
		itemData = g_EsoBuildItemData[slotId];
		enchantData.isDefaultEnchant = true;
	}
	else
	{
		itemData = g_EsoBuildEnchantData[slotId];
		enchantData.isDefaultEnchant = false;
	}
	
	if (itemData == null) return null;
	
	enchantData.itemId = itemData.itemId;
	enchantData.internalLevel = itemData.internalLevel;
	enchantData.internalSubtype = itemData.internalSubtype;
	enchantData.enchantId = itemData.enchantId;
	enchantData.enchantLevel = itemData.enchantLevel;
	enchantData.enchantSubtype = itemData.enchantSubtype;
	enchantData.enchantName = itemData.enchantName;
	enchantData.enchantDesc = itemData.enchantDesc;
	
	return enchantData;
}


function GetEsoInputGeneralValues(inputValues, outputId, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	
	itemData.rawOutput = {};
	
	GetEsoInputAbilityDescValues(inputValues, outputId, itemData, slotId);
}


function GetEsoInputAbilityDescValues(inputValues, outputId, itemData, slotId)
{
	var rawDesc = RemoveEsoDescriptionFormats(itemData.abilityDesc);
	if (rawDesc == "") return;
	
	for (var i = 0; i < ESO_ABILITYDESC_MATCHES.length; ++i)
	{
		var matchData = ESO_ABILITYDESC_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var statValue = Math.floor(parseFloat(matches[1]));
		
		inputValues[outputId][matchData.statId] += statValue;
		AddEsoItemRawOutput(itemData, outputId + "." + matchData.statId, statValue);
		AddEsoInputStatSource(outputId + "." + matchData.statId, { item: itemData, value: statValue, slotId: slotId });
	}
}


function GetEsoInputSkillPassives(inputValues)
{
	var skillInputValues = GetEsoTestBuildSkillInputValues();
	
	for (var skillId in g_EsoSkillPassiveData)
	{
		GetEsoInputSkillPassiveValues(inputValues, skillInputValues, g_EsoSkillPassiveData[skillId]);	
	}
	
}


function GetEsoInputSkillActiveBar(inputValues)
{
	var skillInputValues = GetEsoTestBuildSkillInputValues();
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveWeapon - 1];
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


function ComputeEsoInputSkillValue(matchData, inputValues, rawDesc, abilityData, isPassive)
{
	var statValue = 0;
	var statFactor = 1;
	var matches = null;

	if (matchData.statValue != null) statValue = matchData.statValue;
	
	if (matchData.match != null) 
	{
		matches = rawDesc.match(matchData.match);
		if (matches == null) return false;
		if (matches[1] != null) statValue = parseFloat(matches[1]);
	}
	
	if (matchData.skillName != null)
	{
		if (abilityData.name.toUpperCase() != matchData.skillName.toUpperCase()) return false;
	}
	
	if (matchData.skillRank != null)
	{
		if (abilityData.rank != matchData.skillRank) return false;
	}
			
	if (matchData.toggle === true && matchData.id != null)
	{
		if (!IsEsoBuildToggledSkillEnabled(matchData.id)) return false;
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
	
	statValue = statValue * statFactor;
	
	if (matchData.display == '%') statValue = statValue / 100;
	if (matchData.round == 'floor') statValue = Math.floor(statValue);
	
	var category = "Skill";
	if (matchData.category != null) category = matchData.category;
	
	if (matchData.buffId != null)
	{
		var buffData = g_EsoBuildBuffData[matchData.buffId];
		if (buffData == null) return false;
		
		buffData.skillEnabled = true;
		buffData.skillAbilities.push(abilityData);
		AddEsoItemRawOutputString(abilityData, "Adds Buff", buffData.buffId);
		AddEsoItemRawOutputString(buffData, (isPassive ? "Passive Skill" : "Active Skill"), abilityData.name);
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
		
		if (isPassive)
			AddEsoInputStatSource("OtherEffects", { other: true, passive: abilityData, value: rawInputDesc, rawInputMatch: matchData.rawInputMatch });
		else
			AddEsoInputStatSource("OtherEffects", { other: true, active: abilityData, value: rawInputDesc, rawInputMatch: matchData.rawInputMatch });
	}
	else 
	{
		if (inputValues[category][matchData.statId] == null) inputValues[category][matchData.statId] = 0;
		
		if (matchData.combineAs == "*%")
			inputValues[category][matchData.statId] = (1 + inputValues[category][matchData.statId]) * (1 + statValue) - 1;
		else
			inputValues[category][matchData.statId] += statValue;
		
		AddEsoItemRawOutput(abilityData, category + "." + matchData.statId, statValue);
		
		if (isPassive)
			AddEsoInputStatSource(category + "." + matchData.statId, { passive: abilityData, value: statValue, rawInputMatch: matchData.rawInputMatch });
		else
			AddEsoInputStatSource(category + "." + matchData.statId, { active: abilityData, value: statValue, rawInputMatch: matchData.rawInputMatch });
	}
	
	return true;
}


function ResetEsoBuffSkillEnabled()
{
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData.visible == null) buffData.visible = true;
		if (buffData.toggleVisible === true) buffData.visible = false;
		buffData.skillEnabled = false;
		buffData.rawOutput = {};
		buffData.skillAbilities = [];
	}
}


function UpdateEsoBuffSkillEnabled()
{
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		var parent = $(".esotbBuffItem[buffid='" + buffName + "']");
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


function GetEsoInputSkillPassiveValues(inputValues, skillInputValues, skillData)
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


function GetEsoInputSkillActiveValues(inputValues, skillInputValues, skillData)
{
	var abilityData = g_SkillsData[skillData.abilityId];
	var skillDesc = GetEsoSkillDescription(skillData.abilityId, skillInputValues, false, true);
	var rawDesc = RemoveEsoDescriptionFormats(skillDesc);
	if (rawDesc == "" || abilityData == null) return;
	
	abilityData.rawOutput = {};
	
	for (var i = 0; i < ESO_ACTIVEEFFECT_MATCHES.length; ++i)
	{
		var matchData = ESO_ACTIVEEFFECT_MATCHES[i];
		ComputeEsoInputSkillValue(matchData, inputValues, rawDesc, abilityData, false);
	}
	
}


function ResetEsoAllSkillRawOutputs()
{
	
	for (var skillId in g_SkillsData)
	{
		g_SkillsData[skillId].rawOutput = {};	
	}

}


function AddEsoItemRawOutput(itemData, statId, value)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	if (itemData.rawOutput[statId] == null)	itemData.rawOutput[statId] = "";
	itemData.rawOutput[statId] = +itemData.rawOutput[statId] + +value;
}


function AddEsoItemRawOutputString(itemData, statId, value)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	if (itemData.rawOutput[statId] == null)	itemData.rawOutput[statId] = "";
	itemData.rawOutput[statId] += "" + value;
}


function AddEsoItemRawOutputData(itemData, statId, data)
{
	if (itemData.rawOutput == null) itemData.rawOutput = {};
	itemData.rawOutput[statId] = data;
}


function GetEsoInputItemValues(inputValues, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	if (itemData.enabled === false) return false;
	
	itemData.rawOutput = {};
	
	var traitMatch = null;
	var traitValue = 0;
	if (itemData.traitDesc != null) traitMatch = itemData.traitDesc.match(/[0-9]+.?[0-9]*/);
	if (traitMatch != null && traitMatch[0] != null) traitValue = parseFloat(traitMatch[0]);
	
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
		
		++inputValues.WeaponColdStaff;
		AddEsoItemRawOutput(itemData, "WeaponColdStaff", 1);
		AddEsoInputStatSource("WeaponColdStaff", { item: itemData, value: 1, slotId: slotId });
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
	
	if (itemData.armorRating > 0)
	{
		var factor = 1;
		var bonusResist = 0;
		
				// Shield expert
		if (itemData.weaponType == 14 && g_EsoCpData['Shield Expert'].isUnlocked)
		{
			//var extraBonus = factor * 0.75;
			//factor *= 1.75;
		}
		
		if (itemData.trait == 13)	// Reinforced
		{
			//factor *= 1 + traitValue/100;		// Now included in the raw item data when mined
		}
		else if (itemData.trait == 25) // Armor Nirnhoned
		{
			//bonusResist = Math.floor(itemData.armorRating*traitValue/100*factor);	// Pre Update 11
			bonusResist = Math.floor(traitValue);
		}
		
		var armorRating = Math.floor(itemData.armorRating * factor) + bonusResist;
		
		inputValues.Item.SpellResist += armorRating;
		inputValues.Item.PhysicalResist += armorRating;
		
		AddEsoItemRawOutput(itemData, "Item.SpellResist", armorRating);
		AddEsoItemRawOutput(itemData, "Item.PhysicalResist", armorRating);
		
		AddEsoInputStatSource("Item.SpellResist", { item: itemData, value: armorRating, slotId:slotId });
		AddEsoInputStatSource("Item.PhysicalResist", { item: itemData, value: armorRating, slotId:slotId });
	}
	
	if (itemData.weaponPower > 0)
	{
		var weaponPower = parseFloat(itemData.weaponPower);
		
		if (slotId == "OffHand1" || slotId == "OffHand2") 
		{
			inputValues.WeaponOffHandDamage = weaponPower;
			weaponPower = Math.floor(weaponPower * 0.200);
		}
		
		if (itemData.trait == 26)	// Weapon nirnhoned
		{
			//weaponPower = Math.floor(weaponPower * (1 + traitValue/100));		// Now included in raw weapon data
		}
				
		inputValues.Item.WeaponDamage += weaponPower;
		inputValues.Item.SpellDamage += weaponPower;
		
		AddEsoItemRawOutput(itemData, "Item.WeaponDamage", weaponPower);
		AddEsoItemRawOutput(itemData, "Item.SpellDamage", weaponPower);
		
		AddEsoInputStatSource("Item.WeaponDamage", { item: itemData, value: weaponPower, slotId:slotId });
		AddEsoInputStatSource("Item.SpellDamage", { item: itemData, value: weaponPower, slotId:slotId });
	}
	
	if (itemData.trait == 18) // Divines
	{
		inputValues.Item.Divines += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.Divines", traitValue/100);
		AddEsoInputStatSource("Item.Divines", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 17) //Prosperous
	{
		inputValues.Item.Prosperous += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.Prosperous", traitValue/100);
		AddEsoInputStatSource("Item.Prosperous", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 12) //Impenetrable
	{
		inputValues.Item.CritResist += traitValue;
		AddEsoItemRawOutput(itemData, "Item.CritResist", traitValue);
		AddEsoInputStatSource("Item.CritResist", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 11) //Sturdy
	{
		inputValues.Item.Sturdy += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.Sturdy", traitValue/100);
		AddEsoInputStatSource("Item.Sturdy", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 15 || itemData == 6) //Training
	{
		inputValues.Item.Training += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.Training", traitValue/100);
		AddEsoInputStatSource("Item.Training", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 21) //Healthy
	{
		inputValues.Item.Health += traitValue;
		itemData.rawOutput["Item.Health"] = traitValue;
		AddEsoItemRawOutput(itemData, "Item.Health", traitValue);
		AddEsoInputStatSource("Item.Health", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 22) //Arcane
	{
		inputValues.Item.Magicka += traitValue;
		AddEsoItemRawOutput(itemData, "Item.Magicka", traitValue);
		AddEsoInputStatSource("Item.Magicka", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 23) //Robust
	{
		inputValues.Item.Stamina += traitValue;
		AddEsoItemRawOutput(itemData, "Item.Stamina", traitValue);
		AddEsoInputStatSource("Item.Stamina", { item: itemData, value: traitValue, slotId:slotId });
	}	
	else if (itemData.trait == 14) //Well Fitted
	{
		inputValues.Item.SprintCost -= traitValue/100;
		inputValues.Item.RollDodgeCost -= traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.SprintCost", -traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.RollDodgeCost", -traitValue/100);
		AddEsoInputStatSource("Item.SprintCost", { item: itemData, value: -traitValue/100, slotId:slotId });
		AddEsoInputStatSource("Item.RollDodgeCost", { item: itemData, value: -traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 7) //Sharpened
	{
		inputValues.Item.SpellPenetration += traitValue;
		inputValues.Item.PhysicalPenetration += traitValue;
		AddEsoItemRawOutput(itemData, "Item.SpellPenetration", traitValue);
		AddEsoItemRawOutput(itemData, "Item.PhysicalPenetration", traitValue);
		AddEsoInputStatSource("Item.SpellPenetration", { item: itemData, value: traitValue, slotId:slotId });
		AddEsoInputStatSource("Item.PhysicalPenetration", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 3) //Precise
	{
		inputValues.Item.SpellCrit += traitValue/100;
		inputValues.Item.WeaponCrit += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.SpellCrit", traitValue/100);
		AddEsoItemRawOutput(itemData, "Item.WeaponCrit", traitValue/100);
		AddEsoInputStatSource("Item.SpellCrit", { item: itemData, value: traitValue/100, slotId:slotId });
		AddEsoInputStatSource("Item.WeaponCrit", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 5) //Defending
	{
		inputValues.Item.SpellResist += traitValue;
		inputValues.Item.PhysicalResist += traitValue;
		AddEsoItemRawOutput(itemData, "Item.SpellResist", traitValue);
		AddEsoInputStatSource("Item.SpellResist", { item: itemData, value: traitValue, slotId:slotId });
		AddEsoItemRawOutput(itemData, "Item.PhysicalResist", traitValue);
		AddEsoInputStatSource("Item.PhysicalResist", { item: itemData, value: traitValue, slotId:slotId });
	}
	else if (itemData.trait == 2) //Charged
	{
	}
	else if (itemData.trait == 4) //Infused
	{
	}
	else if (itemData.trait == 1) //Powered
	{
		inputValues.Item.HealingDone += traitValue/100;
		AddEsoItemRawOutput(itemData, "Item.HealingDone", traitValue/100);
		AddEsoInputStatSource("Item.HealingDone", { item: itemData, value: traitValue/100, slotId:slotId });
	}
	else if (itemData.trait == 8) //Decisive
	{
		// TODO?
	}
	
	GetEsoInputItemEnchantValues(inputValues, slotId);
}


function IsEsoItemArmor(itemData)
{
	if (itemData.type == 1 && itemData.weaponType == 14) return true;
	if (itemData.type != 2) return false;
	return true;
}


function IsEsoItemWeapon(itemData)
{
	if (itemData.type != 1) return false;
	if (itemData.weaponType == 14) return false;
	return true;
}


function GetEsoInputItemEnchantValues(inputValues, slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null || itemData.itemId == null || itemData.itemId == "") return false;
	
	var enchantData = GetEsoEnchantData(slotId);
	if (enchantData == null) return false;
	if (enchantData.enchantDesc == "") return true;
	
	var enchantFactor = 1;
	
		// Infused
	if (itemData.trait == 16 || itemData.trait == 4)
	{
		var rawDesc = RemoveEsoDescriptionFormats(itemData.traitDesc);
		var results = rawDesc.match(/by ([0-9]+\.?[0-9]*\%?)/);
		
		if (results != null && results.length !== 0) 
		{
			var infusedFactor = 1 + parseFloat(results[1])/100;
			if (isNaN(infusedFactor) || infusedFactor < 1) infusedFactor = 1;
			enchantFactor = enchantFactor * infusedFactor;
		}
	}
	
	if (slotId == "Waist" || slotId == "Feet" || slotId == "Shoulders" || slotId == "Hands")
	{
		enchantFactor = enchantFactor * 0.4044;
	}
	
	if (IsEsoItemWeapon(itemData))
	{
		GetEsoInputItemEnchantWeaponValues(inputValues, slotId, itemData, enchantData, enchantFactor);
	}
	else if (IsEsoItemArmor(itemData))
	{
		GetEsoInputItemEnchantArmorValues(inputValues, slotId, itemData, enchantData, enchantFactor);
	}	
	
	return true;
}


function GetEsoInputItemEnchantArmorValues(inputValues, slotId, itemData, enchantData, enchantFactor)
{
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	
	for (var i = 0; i < ESO_ENCHANT_ARMOR_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_ARMOR_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var statValue = parseFloat(matches[1]);
		if (!enchantData.isDefaultEnchant) statValue *= enchantFactor;
		
		if (matchData.factorValue != null) statValue *= matchData.factorValue;
		
		statValue = Math.floor(statValue);
		
		inputValues.Item[matchData.statId] += statValue;
		AddEsoItemRawOutput(itemData, "Item." + matchData.statId, statValue);
		AddEsoInputStatSource("Item." + matchData.statId, { item: itemData, enchant: enchantData, value: statValue, slotId: slotId });
	}
}


function RemoveEsoDescriptionFormats(text)
{
	if (text == null) return "";
	return text.replace(/\|c[a-fA-F0-9]{6}([^|]*)\|r/g, '$1');
}


function ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor)
{
	var newValue = Math.floor(parseFloat(p1) * enchantFactor);
	return match.replace(p1, newValue);
}


function GetEsoInputItemEnchantWeaponValues(inputValues, slotId, itemData, enchantData, enchantFactor)
{
	var rawDesc = RemoveEsoDescriptionFormats(enchantData.enchantDesc);
	var addFinalEffect = false;
	
	if (enchantData.isDefaultEnchant) enchantFactor = 1;
	
	for (var i = 0; i < ESO_ENCHANT_WEAPON_MATCHES.length; ++i)
	{
		var matchData = ESO_ENCHANT_WEAPON_MATCHES[i];
		var matches = rawDesc.match(matchData.match);
		if (matches == null) continue;
		
		var modValue = matchData.modValue || 1;
		
		if (matchData.statId == "")
		{
			rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor); });
			
		}
		else if (matchData.statId == "OtherEffects")
		{
			rawDesc = rawDesc.replace(matchData.match, function(match, p1, offset, string) { return ReplaceEsoWeaponMatch(match, p1, offset, string, enchantFactor); });
			addFinalEffect = true;
			
			if (matchData.buffId != null && matchData.updateBuffValue === true)
			{
				var buffData = g_EsoBuildBuffData[matchData.buffId];
				
				if (buffData != null) 
				{
					var matches = rawDesc.match(matchData.match);
					if (matches != null && matches[1] != null) buffData.value = parseFloat(matches[1]);
					
					buffData.visible = true;
				}
			}
		}
		else
		{
			var statValue = Math.floor(parseFloat(matches[1]) * enchantFactor * modValue);
			var category = matchData.category || "Item";
			
			inputValues[category][matchData.statId] += statValue;
			AddEsoItemRawOutput(itemData, category + "." + matchData.statId, statValue);
			AddEsoInputStatSource(category + "." + matchData.statId, { item: itemData, enchant: enchantData, value: statValue, slotId: slotId });
		}
	}
	
	if (addFinalEffect) 
	{
		AddEsoInputStatSource("OtherEffects", { other: true, item: itemData, enchant: enchantData, value: rawDesc, slotId: slotId });
		AddEsoItemRawOutputString(itemData, "WeaponEnchant", rawDesc);
	}
}


function UpdateEsoItemSets()
{
	g_EsoBuildSetData = {};
	
	for (var key in g_EsoBuildItemData)
	{
		if (g_EsoBuildActiveWeapon == 1 && (key == "MainHand2" || key == "OffHand2" || key == "Poison2")) continue;
		if (g_EsoBuildActiveWeapon == 2 && (key == "MainHand1" || key == "OffHand1" || key == "Poison1")) continue;
		
		var itemData = g_EsoBuildItemData[key];
		var setName = itemData.setName;
		
		if (itemData.enabled === false) continue;
		if (setName == null || setName == "") continue;
		
		if (g_EsoBuildSetData[setName] == null) 
		{
			g_EsoBuildSetData[setName] = {
					name: setName,
					count: 0,
					items: [],
			};
		}
		
		++g_EsoBuildSetData[setName].count;
		g_EsoBuildSetData[setName].items.push(itemData);
		AddEsoItemRawOutput(itemData, "Set." + setName, 1);
		AddEsoInputStatSource("Set." + setName, { set: setName, item: itemData });
	}
	
	ComputeEsoBuildAllSetData();
	UpdateEsoBuildToggledSetData();
}


function ParseEsoBuildFloat(value, defaultValue)
{
	var result = parseFloat(value);
	
	if (!isNaN(result)) return result;
	if (defaultValue != null) return defaultValue;
	return 0;
}


function GetEsoInputTargetValues(inputValues)
{
	inputValues.Target.SpellResist = ParseEsoBuildFloat($("#esotbTargetResistance").val());
	inputValues.Target.PhysicalResist = inputValues.Target.SpellResist;
	inputValues.Target.CritResistFlat = ParseEsoBuildFloat($("#esotbTargetCritResistFlat").val());
	inputValues.Target.CritResistFactor = ParseEsoBuildFloat($("#esotbTargetCritResistFactor").val()) / 100;
	inputValues.Target.PenetrationFlat = ParseEsoBuildFloat($("#esotbTargetPenetrationFlat").val());
	inputValues.Target.PenetrationFactor = ParseEsoBuildFloat($("#esotbTargetPenetrationFactor").val()) / 100;
	inputValues.Target.DefenseBonus = ParseEsoBuildFloat($("#esotbTargetDefenseBonus").val()) / 100;
	inputValues.Target.AttackBonus = ParseEsoBuildFloat($("#esotbTargetAttackBonus").val()) / 100;
	inputValues.Target.CritDamage = ParseEsoBuildFloat($("#esotbTargetCritDamage").val()) / 100;
	inputValues.Target.CritChance = ParseEsoBuildFloat($("#esotbTargetCritChance").val()) / 100;
}


function GetEsoInputMiscValues(inputValues)
{
	inputValues.Misc.SpellCost = parseFloat($("#esotbMiscSpellCost").val());
}


function GetEsoInputMundusValues(inputValues)
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


function GetEsoInputMundusNameValues(inputValues, mundusName)
{
	
	if (mundusName == "The Lady")
	{
		inputValues.Mundus.PhysicalResist = 1280;
		AddEsoInputStatSource("Mundus.PhysicalResist", { mundus: mundusName, value: inputValues.Mundus.PhysicalResist });
	}
	else if (mundusName == "The Lover")
	{
		inputValues.Mundus.SpellResist = 1280;
		AddEsoInputStatSource("Mundus.SpellResist", { mundus: mundusName, value: inputValues.Mundus.SpellResist });
	}
	else if (mundusName == "The Lord")
	{
		inputValues.Mundus.Health = 1452;
		AddEsoInputStatSource("Mundus.Health", { mundus: mundusName, value: inputValues.Mundus.Health });
	}
	else if (mundusName == "The Mage")
	{
		inputValues.Mundus.Magicka = 1320;
		AddEsoInputStatSource("Mundus.Magicka", { mundus: mundusName, value: inputValues.Mundus.Magicka });
	}
	else if (mundusName == "The Tower")
	{
		inputValues.Mundus.Stamina = 1320;
		AddEsoInputStatSource("Mundus.Stamina", { mundus: mundusName, value: inputValues.Mundus.Stamina });
	}
	else if (mundusName == "The Atronach")
	{
		inputValues.Mundus.MagickaRegen = 198;
		AddEsoInputStatSource("Mundus.MagickaRegen", { mundus: mundusName, value: inputValues.Mundus.MagickaRegen });
	}
	else if (mundusName == "The Serpent")
	{
		inputValues.Mundus.StaminaRegen = 198;
		AddEsoInputStatSource("Mundus.StaminaRegen", { mundus: mundusName, value: inputValues.Mundus.StaminaRegen });
	}
	else if (mundusName == "The Shadow")
	{
		inputValues.Mundus.CritDamage = 0.12;
		AddEsoInputStatSource("Mundus.CritDamage", { mundus: mundusName, value: inputValues.Mundus.CritDamage });
	}
	else if (mundusName == "The Ritual")
	{
		inputValues.Mundus.HealingDone = 0.10;
		AddEsoInputStatSource("Mundus.HealingDone", { mundus: mundusName, value: inputValues.Mundus.HealingDone });
	}
	else if (mundusName == "The Thief")
	{
		inputValues.Mundus.SpellCrit = 0.11;
		inputValues.Mundus.WeaponCrit = 0.11;
		AddEsoInputStatSource("Mundus.SpellCrit", { mundus: mundusName, value: inputValues.Mundus.SpellCrit });
		AddEsoInputStatSource("Mundus.WeaponCrit", { mundus: mundusName, value: inputValues.Mundus.WeaponCrit });
	}
	else if (mundusName == "The Warrior")
	{
		inputValues.Mundus.WeaponDamage = 166;
		AddEsoInputStatSource("Mundus.WeaponDamage", { mundus: mundusName, value: inputValues.Mundus.WeaponDamage });
	}
	else if (mundusName == "The Apprentice")
	{
		inputValues.Mundus.SpellDamage = 166;
		AddEsoInputStatSource("Mundus.SpellDamage", { mundus: mundusName, value: inputValues.Mundus.SpellDamage });
	}
	else if (mundusName == "The Steed")
	{
		inputValues.Mundus.HealthRegen = 198;
		inputValues.Mundus.SprintSpeed = 0.05;
		AddEsoInputStatSource("Mundus.HealthRegen", { mundus: mundusName, value: inputValues.Mundus.HealthRegen });
		AddEsoInputStatSource("Mundus.SprintSpeed", { mundus: mundusName, value: inputValues.Mundus.SprintSpeed });
	}

}


function GetEsoInputCPValues(inputValues)
{
	inputValues.CP.Health = g_EsoCpData.attribute1.points;
	inputValues.CP.Magicka = g_EsoCpData.attribute2.points;
	inputValues.CP.Stamina = g_EsoCpData.attribute3.points;
	inputValues.CP.TotalPoints = parseInt($("#esotbCPTotalPoints").val());
	inputValues.CP.UsedPoints = inputValues.CP.Health + inputValues.CP.Magicka + inputValues.CP.Stamina;
	
	inputValues.CPLevel = Math.floor(inputValues.CP.TotalPoints/10);
	if (inputValues.CPLevel > ESO_MAX_CPLEVEL) inputValues.CPLevel = ESO_MAX_CPLEVEL;
	
	if (inputValues.Level == 50)
		inputValues.EffectiveLevel = inputValues.Level + inputValues.CPLevel;
	else
		inputValues.EffectiveLevel = inputValues.Level;
		
	if (inputValues.EffectiveLevel > ESO_MAX_EFFECTIVELEVEL) inputValues.EffectiveLevel = ESO_MAX_EFFECTIVELEVEL;

		/* Lord */
	if (inputValues.ArmorHeavy >= 5) ParseEsoCPValue(inputValues, "PhysicalResist", 60624);
	ParseEsoCPValue(inputValues, "DamageShield", 59948);
	ParseEsoCPValue(inputValues, ["HADamageTaken", "LADamageTaken"], 59953, null, null, -1);
	ParseEsoCPValue(inputValues, "HealingReceived", 63851);
	
		/* Lady */
	if (inputValues.ArmorLight >= 5) ParseEsoCPValue(inputValues, "PhysicalResist", 60502);
	ParseEsoCPValue(inputValues, "DotDamageTaken", 63850, null, null, -1);
	ParseEsoCPValue(inputValues, ["PhysicalDamageTaken", "PoisonDamageTaken", "DiseaseDamageTaken"], 63844, null, null, -1);
	ParseEsoCPValue(inputValues, ["MagicDamageTaken", "FlameDamageTaken", "ColdDamageTaken", "ShockDamageTaken"], 63843, null, null, -1);
	
		/* Steed */
	if (inputValues.ArmorMedium >= 5) ParseEsoCPValue(inputValues, "PhysicalResist", 59120);
	ParseEsoCPValue(inputValues, "BlockCost", 60649, null, null, -1);
	ParseEsoCPValue(inputValues, "SpellResist", 62760);
	ParseEsoCPValue(inputValues, "CritResist", 60384);
	
		/* Ritual */
	ParseEsoCPValue(inputValues, "DotDamageDone", 63847);
	ParseEsoCPValue(inputValues, "WeaponCritDamage", 59105);
	ParseEsoCPValue(inputValues, "PhysicalPenetration", 61546);
	ParseEsoCPValue(inputValues, ["PhysicalDamageDone", "PoisonDamageDone", "DiseaseDamageDone"], 63868);
	ParseEsoCPValue(inputValues, "WeaponCrit", 59418, "the_ritual", 30);
	
		/* Atronach */
	ParseEsoCPValue(inputValues, ["HAWeaponDamage", "LAWeaponDamage"], 60565);
	ParseEsoCPValue(inputValues, "ShieldDamageDone", 60662);
	ParseEsoCPValue(inputValues, ["HABowDamage", "LABowDamage"], 60546);
	ParseEsoCPValue(inputValues, ["HAStaffDamage", "LAStaffDamage"], 60503);
	
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
		
		/* Apprentice */
	ParseEsoCPValue(inputValues, ["MagicDamageDone", "FlameDamageDone", "ColdDamageDone", "ShockDamageDone"], 63848);
	ParseEsoCPValue(inputValues, "SpellPenetration", 61555);
	ParseEsoCPValue(inputValues, "SpellCritDamage", 61680);
	ParseEsoCPValue(inputValues, "HealingDone", 59630);
	ParseEsoCPValue(inputValues, "SpellCrit", 59626, "the_apprentice", 30);
	
		/* Shadow */
	ParseEsoCPValue(inputValues, "HealingReceived", 59298, null, null, null, "Target");
	ParseEsoCPValue(inputValues, "SneakCost", 61548, null, null, -1);
	ParseEsoCPValue(inputValues, ["FearDuration", "StunDuration", "DisorientDuration", "SnareDuration"], 59353, null, null, -1);
	ParseEsoCPValue(inputValues, ["RollDodgeCost", "BreakFreeCost"], 63863, null, null, -1);
	
		/* Lover */
	ParseEsoCPValue(inputValues, "StaminaRegen", 59346);
	ParseEsoCPValue(inputValues, "MagickaRegen", 59577);
	ParseEsoCPValue(inputValues, "HealthRegen", 60374);
	ParseEsoCPValue(inputValues, ["HAMagRestore", "HAStaRestore"], 63854);
	
		/* Tower */
	ParseEsoCPValue(inputValues, "BashCost", 58899, null, null, -1);
	ParseEsoCPValue(inputValues, "SprintCost", 64077, null, null, -1);
	ParseEsoCPValue(inputValues, "MagickaCost", 63861, null, null, -1);
	ParseEsoCPValue(inputValues, "StaminaCost", 63862, null, null, -1);
	
	var itemData = g_EsoBuildItemData.OffHand1;
	if (g_EsoBuildActiveWeapon == 2) itemData = g_EsoBuildItemData.OffHand2;
	
	if (itemData.weaponType == 14 && g_EsoCpData['Shield Expert'].isUnlocked)
	{
		var extraBonus = Math.floor(itemData.armorRating * 0.75);
		
		inputValues.Item.SpellResist += extraBonus;
		inputValues.Item.PhysicalResist += extraBonus;
		AddEsoInputStatSource("Item.SpellResist", { cp: "Shield Expert", abilityId: g_EsoCpData['Shield Expert'].id, value: extraBonus });
		AddEsoInputStatSource("Item.PhysicalResist", { cp: "Shield Expert", abilityId: g_EsoCpData['Shield Expert'].id, value: extraBonus });
	}
	
}


function ConvertEsoFlatCritToPercent(flatCrit, inputValues)
{
	var effectiveLevel = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) effectiveLevel = parseInt(inputValues.EffectiveLevel);

	var result = flatCrit / (2 * effectiveLevel * (100 + effectiveLevel));
	return Math.round(result * 1000) / 10;
}


function ConvertEsoPercentCritToFlat(percentCrit, inputValues)
{
	var effectiveLevel = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) effectiveLevel = parseInt(inputValues.EffectiveLevel);

	var result = percentCrit * 2 * effectiveLevel * (100 + effectiveLevel);
	return Math.round(result);
}


function ParseEsoCPValue(inputValues, statIds, abilityId, discId, unlockLevel, statFactor, category)
{
	var cpDesc = $("#descskill_" + abilityId);
	if (cpDesc.length == 0) return false;

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
	if (lastChar == "%") value = value/100;
	
	if (statFactor != null) value *= statFactor;

	if (typeof(statIds) == "object")
	{
		for (var i = 0; i < statIds.length; ++i)
		{
			inputValues.CP[statIds[i]] += value;
			AddEsoInputStatSource("CP." + statIds[i], { cp: cpName, abilityId: abilityId, value: value });
		}
	}
	else
	{
		inputValues.CP[statIds] += value;
		AddEsoInputStatSource("CP." + statIds, { cp: cpName, abilityId: abilityId, value: value });
	}
	
	return true;
}


function AddEsoInputStatSource(statId, data)
{
	if (g_EsoInputStatSources[statId] == null) g_EsoInputStatSources[statId] = [];
	
	data.origStatId = statId;
	g_EsoInputStatSources[statId].push(data);
	
	var statIds = statId.split(".");
	
	if (statIds.length > 1)
	{
		var firstStatId = statIds.shift();
		
		var newStatId = statIds.join(".");
		if (g_EsoInputStatSources[newStatId] == null) g_EsoInputStatSources[newStatId] = [];
		g_EsoInputStatSources[newStatId].push(data);
	}
}


function UpdateEsoComputedStatsList(realUpdate)
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


function CheckEsoComputeStatUpdate()
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


function UpdateEsoComputedStatsList_Real()
{
	g_EsoBuildRebuildStatFlag = false;
	SetEsoBuildSaveResults("");
	
	var inputValues = GetEsoInputValues();
	var deferredStats = [];
	
	UpdateEsoTestBuildSkillInputValues(inputValues);
		
	for (var statId in g_EsoComputedStats)
	{
		var depends = g_EsoComputedStats[statId].depends;
		
		if (depends != null)
			deferredStats.push(statId);
		else
			UpdateEsoComputedStat(statId, g_EsoComputedStats[statId], inputValues);
	}
	
	for (var j = 0; j <= 10; ++j)
	{
		for (var i = 0; i < deferredStats.length; ++i)
		{
			var statId = deferredStats[i];
			var deferLevel = g_EsoComputedStats[statId].deferLevel;
			if (deferLevel == null) deferLevel = 0;
			
			if (deferLevel == j) UpdateEsoComputedStat(statId, g_EsoComputedStats[statId], inputValues);
		}
	}

	UpdateEsoComputedStatsSpecial();
	
	for (var name in g_EsoComputedStats)
	{
		inputValues[name] = g_EsoComputedStats[name].value;
	}
	
	UpdateEsoTestBuildSkillInputValues(inputValues);
	UpdateEsoBuildRawInputOtherEffects();
	
	UpdateEsoReadOnlyStats(inputValues);
	UpdateEsoBuildMundusList2();
	UpdateEsoBuildSetInfo();
	UpdateEsoBuildToggleSets();
	UpdateEsoBuildToggleSkills();
	UpdateEsoBuildItemLinkSetCounts();
	
	UpdateEsoBuildVisibleBuffs();
	UpdateEsoBuffSkillEnabled();
	UpdateEsoAllSkillCost(false);
}


function UpdateEsoComputedStatsSpecial()
{
	
	if (g_EsoBuildSetData["Pelinal's Aptitude"] != null && g_EsoBuildSetData["Pelinal's Aptitude"].count >= 5)
	{
		var weaponDamage = g_EsoComputedStats.WeaponDamage.value;
		var spellDamage = g_EsoComputedStats.SpellDamage.value;
		var setBonusCount = g_EsoBuildSetData["Pelinal's Aptitude"].count;
		
		if (weaponDamage > spellDamage)
		{
			g_EsoComputedStats.SpellDamage.value = weaponDamage;
			
			AddEsoItemRawOutputString(g_EsoBuildSetData["Pelinal's Aptitude"], "OtherEffects", "Set Spell Damage to Weapon Damage");
			AddEsoInputStatSource("OtherEffects", { set: g_EsoBuildSetData["Pelinal's Aptitude"], setBonusCount: setBonusCount, value: "Set Spell Damage to Weapon Damage" });
		}
		else
		{
			g_EsoComputedStats.WeaponDamage.value = spellDamage;
			
			AddEsoItemRawOutputString(g_EsoBuildSetData["Pelinal's Aptitude"], "OtherEffects", "Set Weapon Damage to Spell Damage");
			AddEsoInputStatSource("OtherEffects", { set: g_EsoBuildSetData["Pelinal's Aptitude"],  setBonusCount: setBonusCount, value: "Set Weapon Damage to Spell Damage" });
		}
		
		DisplayEsoComputedStat("WeaponDamage");
		DisplayEsoComputedStat("SpellDamage");
	}
}


function UpdateEsoReadOnlyStats(inputValues)
{
	if (inputValues == null) inputValues = GetEsoInputValues();
	
	$("#esotbEffectiveLevel").text(inputValues.EffectiveLevel);
}


function UpdateEsoComputedStat(statId, stat, inputValues, saveResult)
{
	var stack = [];
	var error = "";
	var computeIndex = 0;
	var round = stat.round;
	
	if (saveResult == null) saveResult = true;
	if (inputValues == null) inputValues = GetEsoInputValues();
	
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
	
	if (stat.min != null && result < stat.min) result = stat.min;
	if (stat.max != null && result > stat.max) result = stat.max;
	
	if (saveResult !== true) return result;

	inputValues[statId] = result;
	stat.value = result;
	DisplayEsoComputedStat(statId, inputValues);
	
	return result;
}


function DisplayEsoComputedStat(statId, inputValues)
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


function ConvertEsoFlatResistToPercent(flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	var result = (flatResist - 100)/(level*10);
	return Math.round(result);
}


function ConvertEsoElementResistToPercent(flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	var result = flatResist/(level*10);
	return Math.round(result);
}


function ConvertEsoCritResistToPercent(flatResist, inputValues)
{
	var level = parseInt($("#esotbEffectiveLevel").text());
	if (inputValues != null) level = inputValues.EffectiveLevel;
	
	if (level <= 0) return 0;
	
	var result = flatResist/level;
	return Math.round(result);
}


function CreateEsoComputedStats()
{
	for (var statId in g_EsoComputedStats)
	{
		CreateEsoComputedStat(statId, g_EsoComputedStats[statId]);
	}
	
}


function CreateEsoComputedStat(statId, stat)
{
	var element;
	
	element = $("<div/>").attr("id", "esoidStat_" + statId).
		attr("statid", statId).
		addClass("esotbStatRow").
		appendTo("#esotbStatList");

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


function CreateEsoComputedStatItems(computeData, parentElement)
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


function OnEsoInputChange(e)
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


function OnEsoAttributeChange(e)
{
	var $this = $(this);
	var value = $this.val();
	
	if (value > ESO_MAX_ATTRIBUTES) $this.val(ESO_MAX_ATTRIBUTES);
	if (value < 0)  $this.val("0");
	
	var totalValue = parseInt($("#esotbAttrHea").val()) + parseInt($("#esotbAttrMag").val()) + parseInt($("#esotbAttrSta").val());
	
	if (totalValue > ESO_MAX_ATTRIBUTES) 
	{
		totalValue = ESO_MAX_ATTRIBUTES;
		$this.val(ESO_MAX_ATTRIBUTES - totalValue + parseInt(value));
	}
	
	$("#esotbAttrTotal").text(totalValue + " / " + ESO_MAX_ATTRIBUTES);
}


function OnEsoLevelChange(e)
{
	var $this = $(this);
	var value = $this.val();
	
	if (value > 50) $this.val("50");
	if (value < 1)  $this.val("1");
}


function OnEsoCPTotalPointsChange(e)
{
	var $this = $(this);
	var value = $this.val();
	
	if (value < 0) $this.val("0");
}


function OnEsoClickStatRow(e)
{
	var computeItems = $(this).find(".esotbComputeItems");
	computeItems.slideToggle();
}


function OnEsoClickStatWarningButton(e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	
	return false;
}


function FixupEsoRacialSkills(raceName, abilityIds)
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


function OnEsoRaceChange(e)
{
	var newRace = $(this).val();
	
	g_EsoBuildEnableUpdates = false;
	EnableEsoRaceSkills(newRace);
	g_EsoBuildEnableUpdates = true;
	
	UpdateEsoComputedStatsList("async");
}


function OnEsoClassChange(e)
{
	var newClass = $(this).val();
	
	g_EsoBuildEnableUpdates = false;
	EnableEsoClassSkills(newClass);
	g_EsoBuildEnableUpdates = true;
		
	UpdateEsoComputedStatsList("async");
}


function OnEsoVampireChange(e)
{
	if ($("#esotbVampireStage").val() > 0)
	{
		$("#esotbWerewolfStage").val("0");
	}
	
	UpdateEsoComputedStatsList("async");
}


function OnEsoWerewolfChange(e)
{
	if ($("#esotbWerewolfStage").val() > 0)
	{
		$("#esotbVampireStage").val("0");
	}
	
	UpdateEsoComputedStatsList("async");
}


function OnEsoClickStealth(e)
{
	UpdateEsoComputedStatsList("async");
}


function OnEsoClickCyrodiil(e)
{
	UpdateEsoComputedStatsList("async");
}


function OnEsoMundusChange(e)
{
	var mundus1 = $("#esotbMundus").val();
	var mundus2 = $("#esotbMundus2").val();
	
	if (mundus1 == mundus2 && mundus1 != "")
	{
		$("#esotbMundus2").val("");
	}
	
	UpdateEsoComputedStatsList("async");
}


function OnEsoClickItem(e)
{
	var $this = $(this);
	var id = $this.attr("id");
	
	SelectEsoItem($this);
}

function OnEsoClickItemIcon(e)
{
	var $this = $(this).parent();
	var id = $this.attr("id");
	
	SelectEsoItem($this);
}


function UnequipEsoItemSlot(slotId, update)
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
		
	g_EsoBuildItemData[slotId] = {};
	
	UnequipEsoEnchantSlot(slotId, false);
	
	if (update == null || update === true) UpdateEsoComputedStatsList("async");
	return true;
}


function UnequipEsoEnchantSlot(slotId, update)
{
	if (g_EsoBuildEnchantData[slotId] == null) return false;
	
	var element = $("#esotbItem" + slotId);
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	iconElement.attr("enchantid", "");
	iconElement.attr("enchantintlevel", "");
	iconElement.attr("enchantinttype", "");

	g_EsoBuildEnchantData[slotId] = {};
	
	if (update == null || update === true) UpdateEsoComputedStatsList("async");
	return true;
}


function OnEsoSelectItem(itemData, element)
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
	
	g_EsoBuildItemData[slotId] = itemData;
	RequestEsoItemData(itemData, element);
}


function RequestEsoItemData(itemData, element)
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
	
	if (itemData.type == 4 || itemData.type == 12)
	{
		queryParams.intlevel = null;
		queryParams.inttype = null;
		queryParams.level = null;
		queryParams.quality = null;
	}
	
	$.ajax("http://esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoItemDataReceive(data, status, xhr, element, itemData); }).
		fail(function(xhr, status, errorMsg) { OnEsoItemDataError(xhr, status, errorMsg); });
}


function OnEsoItemDataReceive(data, status, xhr, element, origItemData)
{
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if (data.minedItem != null && data.minedItem[0] != null)
	{
		g_EsoBuildItemData[slotId] = data.minedItem[0];
		UpdateEsoComputedStatsList(true);
		
		GetEsoSetMaxData(g_EsoBuildItemData[slotId]);
	}
	
}


function GetEsoSetMaxData(itemData)
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
	
	$.ajax("http://esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoSetMaxDataReceive(data, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoItemDataError(xhr, status, errorMsg); });
}


function OnEsoSetMaxDataReceive(data, status, xhr)
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


function OnEsoItemDataError(xhr, status, errorMsg)
{
}


function SelectEsoItem(element)
{
	var equipType = element.attr("equiptype");
	var itemType = element.attr("itemtype");
	var weaponType = element.attr("weapontype");
	
	var data = {
		onSelectItem: OnEsoSelectItem,
		itemType: itemType,
		xoffset: -190,
	};
	
	if (equipType  != null) data.equipType  = equipType;
	if (weaponType != null) data.weaponType = weaponType;
	
	var rootSearchPopup = UESP.showEsoItemSearchPopup(element, data);
	ShowEsoBuildClickWall(rootSearchPopup);
}


function ShowEsoBuildClickWall(parentElement)
{
	$("#esotbClickWall").show();
	g_EsoBuildClickWallLinkElement = parentElement;
}


function HideEsoBuildClickWall()
{
	$("#esotbClickWall").hide();
	
	if (g_EsoBuildClickWallLinkElement != null)
	{
		g_EsoBuildClickWallLinkElement.hide();
		g_EsoBuildClickWallLinkElement = null;
	}
}


function OnEsoClickBuildWall(e)
{
	HideEsoBuildClickWall();
}


function OnEsoClickComputeItems(e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	return false;
}


function OnEsoClickStatDetails(e)
{
	var parent = $(this).parent(".esotbStatRow");
	var statId = parent.attr("statid");
	
	if (statId == null || statId == "") return false;
	
	ShowEsoFormulaPopup(statId);
	return false;
}



function ConvertEsoFormulaToPrefix(computeItems)
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
			stack.push("" + op2 + " " + operator + " " + op1 + "");
		
		lastOperator = operator;
	}
	
	if (stack.length != 1) return "ERR";
	return stack.pop();
}


function OnEsoFormulaInputChange(e)
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
	
	var newValue = UpdateEsoComputedStat(computeStatId, stat, g_EsoFormulaInputValues, false);
	
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
}


function ShowEsoFormulaPopup(statId)
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
	
	$(".esotbFormInputInput").on("input", OnEsoFormulaInputChange);
	
	formulaPopup.show();
	ShowEsoBuildClickWall(formulaPopup);
	
	return true;
}


function MakeEsoFormulaInputs(statId)
{
	var output = "";
	var stat = g_EsoComputedStats[statId];
	if (stat == null) return "";
	
	var FUNCTIONS = { "floor" : 1, "round" : 1, "ceil" : 1, "pow" : 1 };
	
	var inputValues = GetEsoInputValues(true);
	var inputNames = {};
	
	g_EsoFormulaInputValues = inputValues;
	
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
	output += "<div id='esotbFormInputResultSuffix'>" + suffix + "</div>";;
	output += "</div>";
	
	return output;
}


function SetEsoInputValue(name, value, inputValues)
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


function GetEsoInputValue(name, inputValues)
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


function CloseEsoFormulaPopup()
{
	$("#esotbFormulaPopup").hide();
	HideEsoBuildClickWall();
}


function OnEsoClickBuildStatTab(e)
{
	var tabId = $(this).attr("tabid");
	if (tabId == null || tabId == "") return;
	
	$(".esotbStatTabSelected").removeClass("esotbStatTabSelected");
	$(this).addClass("esotbStatTabSelected");
	
	$(".esotbStatBlock:visible").hide();
	$("#" + tabId).show();
	
	if (tabId == "esotbStatBlockRawData")
	{
		UpdateEsoBuildRawInputs();		
	}
	else if (tabId == "esotbStatBlockSkils")
	{
		//UpdateEsoAllSkillDescription();
		UpdateEsoAllSkillCost(false);
	}
	
}


function OnEsoBuildCpUpdate(e)
{
	UpdateEsoComputedStatsList();
}


function OnEsoItemSearchPopupClose(e)
{
	HideEsoBuildClickWall();
}


function OnEsoSkillDetailsClick(e)
{
	var skillId = $(this).parent().attr("skillid");
	if (skillId == null || skillId == "") return;
	
	ShowEsoSkillDetailsPopup(skillId);
	
	e.preventDefault();
	e.stopPropagation();
	return false;
}


function OnEsoItemDetailsClick(e)
{
	var slotId = $(this).parent().attr("slotId");
	if (slotId == null || slotId == "") return;
	
	ShowEsoItemDetailsPopup(slotId);
}


function MakeEsoBuildItemLink(slotId)
{
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null) return "";
	
	var itemLink = itemData.link;
	if (itemLink == null) return "";
	
	var enchantData = g_EsoBuildEnchantData[slotId];
	if (enchantData == null || enchantData.itemId == null) return itemLink;
	
	itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:[0-9]+:[0-9]+:)/, "$1" + enchantData.itemId + "$3");
	itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:[0-9]+:)/, "$1" + enchantData.internalSubtype + "$3");
	itemLink = itemLink.replace(/(\|H[0-9]+:item:[0-9]+:[0-9]+:[0-9]+:[0-9]+:[0-9]+:)([0-9]+)(:)/, "$1" + enchantData.internalLevel + "$3");
		
	return itemLink;
}


function ShowEsoSkillDetailsPopup(abilityId)
{
	var detailsPopup = $("#esotbItemDetailsPopup");
	
	var skillData = g_SkillsData[abilityId];
	if (skillData == null) return false;
	
	GetEsoSkillDescription(abilityId, null, false); 
	
	var detailsHtml = "";
	
	for (var key in skillData.rawOutput)
	{
		var statDetails = g_EsoInputStatDetails[key] || {};
		var value = skillData.rawOutput[key];
		var suffix = "";
		
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
			value = value * 100;
		}
		else if (statDetails.display == "flatcrit")
		{
			value = ConvertEsoFlatCritToPercent(value);
			suffix = "%";
		}
		
		detailsHtml += key + " = " + value + suffix + "<br/>";
	}
	
	if (skillData.numCoefVars > 0)
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
	detailsHtml += "abilityId = " + abilityId + "<br/>";
	detailsHtml += "skillType = " + skillData.skillTypeName.split("::")[0] + "<br/>";
	detailsHtml += "skillLine = " + skillData.skillLine + "<br/>";
	detailsHtml += "type = " + skillData.type + "<br/>";
	detailsHtml += "rank = " + skillData.rank + "<br/>";
	detailsHtml += "learnedLevel = " + skillData.learnedLevel + "<br/>";
	detailsHtml += "target = " + skillData.target + "<br/>";
	detailsHtml += "maxCost = " + skillData.cost + "<br/>";
	detailsHtml += "</div>";
	detailsHtml += "<div class='esotbSkillDetailsOther'>";
	detailsHtml += "duration = " + skillData.duration + "<br/>";
	detailsHtml += "minRange = " + skillData.minRange + "<br/>";
	detailsHtml += "maxRange = " + skillData.maxRange + "<br/>";
	detailsHtml += "radius = " + skillData.radius + "<br/>";
	detailsHtml += "castTime = " + skillData.castTime + "<br/>";
	detailsHtml += "channelTime = " + skillData.channelTime + "<br/>";
	detailsHtml += "angleDistance = " + skillData.angleDistance + "<br/>";
	detailsHtml += "mechanic = " + skillData.mechanic + "<br/>";
	detailsHtml += "</div>";
	
	$("#esotbItemDetailsTitle").text("Details for Ability " + skillData.name);
	$("#esotbItemDetailsText").html(detailsHtml);
	
	detailsPopup.show();
	ShowEsoBuildClickWall(detailsPopup);
	
	return true;
}


function ShowEsoItemDetailsPopup(slotId)
{
	var detailsPopup = $("#esotbItemDetailsPopup");
	
	var itemData = g_EsoBuildItemData[slotId];
	if (itemData == null) return false;
	if (itemData.rawOutput == null) return false;
	
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

	$("#esotbItemDetailsTitle").text("Item Details for " + slotId);
	$("#esotbItemDetailsText").html(detailsHtml);
	
	detailsPopup.show();
	ShowEsoBuildClickWall(detailsPopup);
	
	return true;
}


function CloseEsoItemDetailsPopup()
{
	$("#esotbItemDetailsPopup").hide();
	HideEsoBuildClickWall();
}


function OnEsoItemEnchantClick(e)
{
	var parent = $(this).parent();
	
	SelectEsoItemEnchant(parent);
}


function OnEsoItemDisableClick(e)
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


function SelectEsoItemEnchant(element)
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
	
	var rootSearchPopup = UESP.showEsoItemSearchPopup(element, data);
	ShowEsoBuildClickWall(rootSearchPopup);
	
	return true;
}


function OnEsoSelectItemEnchant(itemData, element)
{
	var iconElement = $(element).find(".esotbItemIcon");
	var labelElement = $(element).find(".esotbItemLabel");
	
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if ($.isEmptyObject(itemData))
	{
		iconElement.attr("enchantid", "");
		iconElement.attr("enchantintlevel", "");
		iconElement.attr("enchantinttype", "");
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


function RequestEsoEnchantData(itemData, element)
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
	
	$.ajax("http://esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoEnchantDataReceive(data, status, xhr, element, itemData); }).
		fail(function(xhr, status, errorMsg) { OnEsoEnchantDataError(xhr, status, errorMsg); });
}


function OnEsoEnchantDataReceive(data, status, xhr, element, origItemData)
{
	var slotId = $(element).attr("slotId");
	if (slotId == null || slotId == "") return false;
	
	if (data.minedItem != null && data.minedItem[0] != null)
	{
		g_EsoBuildEnchantData[slotId] = data.minedItem[0];
		
		var iconElement = $(element).find(".esotbItemIcon");
		iconElement.attr("enchantintlevel", data.minedItem[0].internalLevel);
		iconElement.attr("enchantinttype", data.minedItem[0].internalSubtype);
		
		UpdateEsoComputedStatsList(true);
	}
	
}


function OnEsoEnchantDataError(xhr, status, errorMsg)
{
}


function OnEsoWeaponBarSelect1()
{
	SetEsoBuildActiveWeaponBar(1);
	SetEsoBuildActiveSkillBar(1);
	UpdateEsoComputedStatsList(true);
}


function OnEsoWeaponBarSelect2()
{
	SetEsoBuildActiveWeaponBar(2);
	SetEsoBuildActiveSkillBar(2);
	UpdateEsoComputedStatsList(true);
}


function UpdateEsoBuildRawInputs()
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


function HasEsoBuildRawInputSources(sourceData)
{
	if (sourceData == null) return false;
	
	for (var i = 0; i < sourceData.length; ++i)
	{
		if (sourceData[i].value != null && sourceData[i].value != 0) return true;
	}	
	
	return false;
}


function GetEsoBuildRawInputSourcesHtml(sourceName, sourceData)
{
	if (sourceData.length <= 0) return "";
	if (!ESO_TESTBUILD_SHOWALLRAWINPUTS && sourceName.indexOf(".") >= 0) return "";
	
	var output = "<div class='esotbRawInputItem'>";
	var sourceValue = "";
	
	output += "<div class='esotbRawInputName'>" + sourceName + ":</div>";
	
	for (var i = 0; i < sourceData.length; ++i)
	{
		output += GetEsoBuildRawInputSourceItemHtml(sourceData[i]);
	}
	
	output += "</div>";
	return output;
}


function GetEsoBuildRawInputSourceItemHtml(sourceItem)
{
	var output = "<div class='esotbRawInputValue'>";
	var value = sourceItem.value;
	var statDetails = g_EsoInputStatDetails[sourceItem.origStatId] || {};
	var suffix = " (" + sourceItem.origStatId + ")";
	
	if (value == 0) return "";
	
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


function ComputeEsoBuildAllSetData()
{
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		ComputeEsoBuildSetData(setData);
	}
}


function ComputeEsoBuildSetData(setData)
{
	setData.parsedNumbers = [];
	setData.averageNumbers = [];
	setData.averageDesc = [];
	
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


function UpdateEsoBuildSetDesc(setData)
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


function ComputeEsoBuildSetDataAverages(setData)
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
			
			setData.averageNumbers[i][j] = Math.floor(thisSum[j] / counts[j]);
			
			if (numbersVary[j])
			{
				if (setData.maxParsedNumbers == null) continue;
				if (setData.maxParsedNumbers[i] == null) continue;
				if (setData.maxParsedNumbers[i][0] == null) continue;
				
				var maxNumber = setData.maxParsedNumbers[i][0][j];
				if (maxNumber == null) continue;

				var delta = maxNumber / 86;		// Best estimate so far
				setData.averageNumbers[i][j] = Math.round(Math.floor(setData.averageNumbers[i][j] / delta) * delta);
			}
			
			
		}
	}
	
}


function ComputeEsoBuildSetDataItem(setData, item)
{
	ParseEsoBuildSetDesc(setData, 0, item.setBonusDesc1);
	ParseEsoBuildSetDesc(setData, 1, item.setBonusDesc2);
	ParseEsoBuildSetDesc(setData, 2, item.setBonusDesc3);
	ParseEsoBuildSetDesc(setData, 3, item.setBonusDesc4);
	ParseEsoBuildSetDesc(setData, 4, item.setBonusDesc5);
}


function ParseEsoBuildSetDesc(setData, descIndex, description)
{
	var rawDesc = RemoveEsoDescriptionFormats(description);
	var results = rawDesc.match(/[0-9]+\.?[0-9]*/g);
	
	if (setData.parsedNumbers[descIndex] == null) setData.parsedNumbers[descIndex] = [];
	
	setData.parsedNumbers[descIndex].push(results);
}


function IsTwiceBornStarEnabled()
{
	if (g_EsoInputStatSources.TwiceBornStar == null) return false;
	if (g_EsoInputStatSources.TwiceBornStar[0] == null) return false;
	if (g_EsoInputStatSources.TwiceBornStar[0].value == 1) return true;
	return false;
}


function UpdateEsoBuildMundusList2()
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


function UpdateEsoBuildSetInfo()
{
	var setInfoElement = $("#esotbSetInfo");
	var output = GetEsoBuildSetInfoHtml(); 
		
	setInfoElement.html(output);
}


function GetEsoBuildSetInfoHtml()
{
	var output = "";
	
	for (var setName in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[setName];
		
		var wornItems = setData.count;
		if (wornItems <= 0) continue;
		
		output += "<div class='esotbSetInfoSet'>";
		output += "<h4>" + setName + "</h4>";
		
		output += "<div class='esotbSetInfoRow'>Worn Set Items = " + wornItems + "</div>";
		
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


function AddEsoBuildToggledSkillData(skillEffectData, isPassive)
{
	var id = skillEffectData.id;
	
	if (g_EsoBuildToggledSkillData[id] == null) 
	{
		g_EsoBuildToggledSkillData[id] = {};
		g_EsoBuildToggledSkillData[id].isPassive = isPassive;
		g_EsoBuildToggledSkillData[id].matchData = skillEffectData;
		g_EsoBuildToggledSkillData[id].baseSkillId = skillEffectData.baseSkillId;
		g_EsoBuildToggledSkillData[id].statIds = [];
		
	}
	
	g_EsoBuildToggledSkillData[id].id = id;
	g_EsoBuildToggledSkillData[id].desc = "";
	g_EsoBuildToggledSkillData[id].valid = false;
	g_EsoBuildToggledSkillData[id].enabled = skillEffectData.enabled;
	g_EsoBuildToggledSkillData[id].count = 0;
	g_EsoBuildToggledSkillData[id].maxTimes = skillEffectData.maxTimes;
	
	if (skillEffectData.statId != null)
		g_EsoBuildToggledSkillData[id].statIds.push(skillEffectData.statId);
	else if (skillEffectData.buffId != null)
		g_EsoBuildToggledSkillData[id].statIds.push("Buff." + skillEffectData.buffId);
}


function CreateEsoBuildToggledSkillData()
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


function CreateEsoBuildToggledSetData()
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
		}
		
		g_EsoBuildToggledSetData[id].id = id;
		g_EsoBuildToggledSetData[id].setBonusCount = setEffectData.setBonusCount;
		g_EsoBuildToggledSetData[id].desc = "";
		g_EsoBuildToggledSetData[id].valid = false;
		g_EsoBuildToggledSetData[id].enabled = setEffectData.enabled;
		g_EsoBuildToggledSetData[id].statIds.push(setEffectData.statId);
		g_EsoBuildToggledSetData[id].maxTimes = setEffectData.maxTimes;
		g_EsoBuildToggledSetData[id].count = 0;		
		
		if (setEffectData.setId != null) g_EsoBuildToggledSetData[id].setId = setEffectData.setId;
				
		if (g_EsoBuildSetData[id] != null && g_EsoBuildSetData[id].averageDesc != null &&
				g_EsoBuildSetData[id].averageDesc[setEffectData.setBonusCount] != null)
		{
			g_EsoBuildToggledSetData[id].desc = g_EsoBuildSetData[id].averageDesc[setEffectData.setBonusCount];
		}
	}
	
}


function IsEsoBuildToggledSkillEnabled(skillId)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	return g_EsoBuildToggledSkillData[skillId].valid && g_EsoBuildToggledSkillData[skillId].enabled;
}


function SetEsoBuildToggledSkillValid(skillId, valid)
{
	if (g_EsoBuildToggledSkillData[skillId] != null) g_EsoBuildToggledSkillData[skillId].valid = valid;
}


function SetEsoBuildToggledSkillDesc(skillId, desc)
{
	if (g_EsoBuildToggledSkillData[skillId] != null) g_EsoBuildToggledSkillData[skillId].desc = desc;
}


function SetEsoBuildToggledSkillEnable(skillId, enable)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	g_EsoBuildToggledSkillData[skillId].enabled = enable;
}


function SetEsoBuildToggledSkillCount(skillId, value)
{
	if (g_EsoBuildToggledSkillData[skillId] == null) return false;
	g_EsoBuildToggledSkillData[skillId].count = parseInt(value);
}


function SetEsoBuildToggledSetCount(skillId, value)
{
	if (g_EsoBuildToggledSetData[skillId] == null) return false;
	g_EsoBuildToggledSetData[skillId].count = parseInt(value);
}


function IsEsoBuildToggledSetEnabled(setId)
{
	if (g_EsoBuildToggledSetData[setId] == null) return false;
	var isEnabled = g_EsoBuildToggledSetData[setId].valid && g_EsoBuildToggledSetData[setId].enabled;
	if (isEnabled) return true;
	return false;
}


function SetEsoBuildToggledSetValid(setId, valid)
{
	if (g_EsoBuildToggledSetData[setId] != null) g_EsoBuildToggledSetData[setId].valid = valid;
	//if (g_EsoBuildToggledSetData[setId+"2"] != null) g_EsoBuildToggledSetData[setId+"2"].valid = valid;
}


function SetEsoBuildToggledSetDesc(setId, desc)
{
	if (g_EsoBuildToggledSetData[setId] != null) g_EsoBuildToggledSetData[setId].desc = desc;
}


function SetEsoBuildToggledSetEnable(setId, enable)
{
	if (g_EsoBuildToggledSetData[setId] == null) return false;
	g_EsoBuildToggledSetData[setId].enabled = enable;
}


function UpdateEsoBuildToggledSkillData(inputValues)
{
	
	for (var skillId in g_EsoBuildToggledSkillData)
	{
		var toggleSkillData = g_EsoBuildToggledSkillData[skillId];
		var abilityId = toggleSkillData.baseSkillId;
		var abilityData = g_EsoSkillPassiveData[abilityId];
		var realAbilityId = abilityId;
		
		toggleSkillData.valid = false;
		
		if (abilityData == null)
		{
			abilityData = g_EsoSkillActiveData[abilityId];
			//if (abilityData == null) continue;
		}

		if (toggleSkillData.matchData == null) continue;
		
		if (toggleSkillData.matchData.matchSkillName === true)
		{
			var data = g_SkillsData[abilityId];
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
			if (!IsEsoSkillOnActiveBar(abilityId)) continue;
			
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
		
		var checkElement = $(".esotbToggledSkillItem[skillid=\"" + skillId + "\"]").find(".esotbToggleSkillCheck");
		
		if (checkElement.length > 0)
		{
			SetEsoBuildToggledSkillEnable(skillId, checkElement.is(":checked"));
			
			var countElement = checkElement.next(".esotbToggleSkillNumber");
			if (countElement.length > 0) SetEsoBuildToggledSkillCount(skillId, countElement.val());
		}
	}
	
}


function FindMatchingEsoPassiveSkillDescription(matchData)
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


function UpdateEsoBuildToggledSetData()
{
	
	for (var setId in g_EsoBuildToggledSetData)
	{
		var toggleData = g_EsoBuildToggledSetData[setId];
		if (toggleData == null) continue;
		
		var setName = setId;
		if (toggleData.setId != null) setName = toggleData.setId;
		
		//console.log("SetData", setId, setName);
		
		var setData = g_EsoBuildSetData[setName];
		if (setData == null) continue;
		
		SetEsoBuildToggledSetValid(setId, false);
		
		if (setData.averageDesc == null || setData.items[0] == null) continue;
		
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
		
		var setDesc = setData.averageDesc[toggleData.setBonusCount - 1];
		var setCount = setData.items[0]['setBonusCount' + toggleData.setBonusCount];
		
		if (setDesc == null || setCount == null) continue;
		toggleData.desc = setDesc;
		if (setCount > setData.count) continue;
		
		SetEsoBuildToggledSetValid(setId, true);
		
		var checkElement = $(".esotbToggledSetItem[setid=\"" + setId + "\"]").find(".esotbToggleSetCheck");
		
		if (checkElement.length > 0)
		{
			SetEsoBuildToggledSetEnable(setId, checkElement.is(":checked"));
			
			var countElement = checkElement.next(".esotbToggleSetNumber");
			if (countElement.length > 0) SetEsoBuildToggledSetCount(setId, countElement.val());
		}
	}
}


function UpdateEsoBuildToggleSets()
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
	
	$(".esotbToggleSetNumber").on("input", OnEsoBuildToggleSetNumber);
	$(".esotbToggleSetNumber").click(OnEsoBuildToggleSetNumberClick);
	$(".esotbToggleSetCheck").click(OnEsoBuildToggleSet);
	$(".esotbToggledSetItem").click(OnEsoBuildToggleSetClick);
}


function OnEsoBuildToggleSetNumberClick(e)
{
	e.stopPropagation();
	return false;
}


function OnEsoBuildToggleSet(e)
{
	OnEsoBuildToggleSetChanged($(this));
	
	UpdateEsoComputedStatsList("async");
	
	e.stopPropagation();
	return true;
}


function OnEsoBuildToggleSetClick(e)
{
	var checkBox = $(this).find(".esotbToggleSetCheck");
	checkBox.prop("checked", !checkBox.prop("checked"));
	
	OnEsoBuildToggleSetChanged(checkBox);
	
	UpdateEsoComputedStatsList("async");
	
	return false;
}


function OnEsoBuildToggleSetChanged(checkBox)
{
	var parent = checkBox.parent();
	var setId = parent.attr("setid");
	var toggleData = g_EsoBuildToggledSetData[setId];
	
	if (checkBox.prop("checked"))
		parent.addClass("esotbToggledSetSelect");
	else
		parent.removeClass("esotbToggledSetSelect");
	
	if (toggleData == null) return;
	
	if (toggleData.disableSetId != null)
	{
		$(".esotbToggledSetItem[setid='" + toggleData.disableSetId + "']").find(".esotbToggleSetCheck").prop("checked", false);
	}
	
}


function CreateEsoBuildToggleSetHtml(setData)
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


function OnEsoBuildToggleSkill(e)
{
	var skillId = $(this).parent().attr("skillId");
	if (skillId == null || skillId == "") return;
	
	UpdateEsoComputedStatsList("async");
	
	e.stopPropagation();
	return true;
}


function OnEsoBuildToggleSkillClick(e)
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


function OnEsoBuildToggleSkillNumber(e)
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


function OnEsoBuildToggleSetNumber(e)
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


function UpdateEsoBuildToggleSkills()
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
	$(".esotbToggleSkillNumber").on("input", OnEsoBuildToggleSkillNumber);
	$(".esotbToggleSkillNumber").click(OnEsoBuildToggleSkillNumberClick);
	$(".esotbToggleSkillCheck").click(OnEsoBuildToggleSkill);
	$(".esotbToggledSkillItem").click(OnEsoBuildToggleSkillClick);
}


function OnEsoBuildToggleSkillNumberClick(e)
{
	e.stopPropagation();
	return false;
}


function CreateEsoBuildToggleSkillHtml(skillData)
{
	var checked = skillData.enabled ? "checked" : "";
	var extraClass = "";
	if (checked) extraClass = 'esotbToggledSkillSelect';
	
	var output = "<div class='esotbToggledSkillItem " + extraClass + "' skillid=\"" + skillData.id + "\">";
	
	var displayName = skillData.id;
	var activeData = g_EsoSkillActiveData[skillData.baseSkillId];
	
	if (skillData.displayName != null) displayName = skillData.displayName;
	
	if (activeData != null && activeData.abilityId != null)
	{
		var abilityData = g_SkillsData[activeData.abilityId];
		if (abilityData != null && abilityData.name != null) displayName = abilityData.name;
	}	
	
	output += "<input type='checkbox' class='esotbToggleSkillCheck'  " + checked + " >";
	
	if (skillData.maxTimes != null) 
	{
		output += "<input type='number' class='esotbToggleSkillNumber'  value='" + skillData.count + "' >";
	}
	
	output += "<div class='esotbToggleSkillTitle'>" + displayName + ":</div> ";
	output += "<div class='esotbToggleSkillDesc'>" + skillData.desc + "</div>";
	
	output += "</div>";
	return output;
}


function UpdateEsoBuildItemLinkSetCounts()
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


function UpdateEsoBuildItemLinkSetCount(slotId)
{
	var itemElement = $(".esotbItem[slotid='" + slotId + "']");
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


function OnEsoBuildEscapeKey(e) 
{
	HideEsoBuildClickWall();
}


function GetEsoTestBuildStat(statId)
{
	if (g_EsoComputedStats[statId] != null) return g_EsoComputedStats[statId];
	return g_EsoInputStats[statId];
}


function GetEsoTestBuildSkillInputValues(inputValues)
{
	return g_LastSkillInputValues;
}


function UpdateEsoTestBuildSkillInputValues(inputValues)
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
	};
	
	g_LastSkillInputValues.SkillLineCost = inputValues.SkillCost;
	g_LastSkillInputValues.DamageShield = inputValues.DamageShield;
	
	g_LastSkillInputValues.MagickaCost = 
	{
			CP 		: inputValues.CP.MagickaCost,
			Item 	: inputValues.Item.MagickaCost,
			Set 	: inputValues.Set.MagickaCost,
			Skill 	: inputValues.Skill.MagickaCost,
			Skill2	: inputValues.Skill2.MagickaCost,
			Buff	: inputValues.Buff.MagickaCost,
	};
	
	g_LastSkillInputValues.StaminaCost = 
	{
			CP 		: inputValues.CP.StaminaCost,
			Item 	: inputValues.Item.StaminaCost,
			Set		: inputValues.Set.StaminaCost,
			Skill 	: inputValues.Skill.StaminaCost,
			Skill2	: inputValues.Skill2.StaminaCost,
			Buff	: inputValues.Buff.StaminaCost,
	};
	
	g_LastSkillInputValues.UltimateCost = 
	{
			CP 		: inputValues.CP.UltimateCost,
			Item 	: inputValues.Item.UltimateCost,
			Set 	: inputValues.Set.UltimateCost,
			Skill 	: inputValues.Skill.UltimateCost,
			Skill2	: inputValues.Skill2.UltimateCost,
			Buff	: inputValues.Buff.UltimateCost,
	};
	
	g_LastSkillInputValues.Damage =
	{
		Physical		: inputValues.PhysicalDamageDone,
		Magic			: inputValues.MagicDamageDone,
		Shock			: inputValues.ShockDamageDone,
		Flame			: inputValues.FlameDamageDone,
		Cold			: inputValues.ColdDamageDone,
		Poison			: inputValues.PoisonDamageDone,
		Disease			: inputValues.DiseaseDamageDone,
		Dot				: inputValues.DotDamageDone,
		All				: inputValues.DamageDone,
		Empower			: inputValues.Buff.Empower,
		MaelstromDamage : inputValues.Item.MaelstromDamage,
	};
	
	g_LastSkillInputValues.Healing =
	{
		Done		: inputValues.HealingDone,
		Taken		: inputValues.HealingTaken,
		Received	: inputValues.HealingReceived,	
	};
	
	g_LastSkillInputValues.SkillDuration = inputValues.SkillDuration;
 	g_LastSkillInputValues.SkillDamage = inputValues.SkillDamage;
 	g_LastSkillInputValues.useMaelstromDamage = false;
	
	return g_LastSkillInputValues; 
}


function SetEsoBuildActiveWeaponBar(barIndex)
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


function SetEsoBuildActiveSkillBar(skillBarIndex)
{
	SetEsoSkillBarSelect(skillBarIndex);
}


function OnEsoBuildSkillBarSwap(e, skillBarIndex)
{
	SetEsoBuildActiveWeaponBar(skillBarIndex);	
	UpdateEsoComputedStatsList("async");
}


function OnEsoBuildSkillUpdate(e)
{
	UpdateEsoComputedStatsList("async");
}


function OnEsoBuildSkillBarUpdate(e)
{
	UpdateEsoComputedStatsList();
}


function IsEsoSkillOnActiveBar(abilityId)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveWeapon - 1];
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


function IsEsoOrigSkillOnActiveBar(abilityId)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveWeapon - 1];
	if (skillBar == null) return false;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillId = skillBar[i].origSkillId;
		if (skillId == null || skillId <= 0) continue;
		
		if (skillId == abilityId) return true;
	}
	
	return false;
}


function CountEsoBarSkillsWithSkillLine(skillLine)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveWeapon - 1];
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


function CountEsoBarSkillsWithSkillType(skillType)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveWeapon - 1];
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


function UpdateEsoBuildRawInputOtherEffects()
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


function CreateEsoBuildBuffElements()
{
	var buffElement = $("#esotbBuffInfo");
	var output = "";
	var keys = Object.keys(g_EsoBuildBuffData).sort();
	
	for (var i = 0; i < keys.length; ++i)
	{
		var buffName = keys[i];
		var buffData = g_EsoBuildBuffData[buffName];
		output += CreateEsoBuildBuffHtml(buffName, buffData);
	}
	
	buffElement.html(output);
}


function CreateEsoBuildBuffHtml(buffName, buffData)
{
	var icon = buffData.icon;
	var extraAttributes = "";
	var checked = "";
	
	buffData.name = buffName;
	
	if (icon == null) icon = "/unknown.png";
	icon = ESO_ICON_URL + icon;
	
	if (buffData.visible === false) extraAttributes = "style='display: none;'";
	if (buffData.enabled) checked = "checked";
	
	var output = "<div class='esotbBuffItem' " + extraAttributes + " buffid='" + buffName + "'>";
	
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


function CreateEsoBuildBuffDescHtml(buffData)
{
	var statId = buffData.statId;
	var statIds = buffData.statIds;
	var category = buffData.category;;
	var categories = buffData.categories;
	var statValue = buffData.value;
	var statValues = buffData.values;
	var display = buffData.display;
	var displays = buffData.displays;
	var statDesc = buffData.statDesc;
	var statDescs = buffData.statDescs;
	var prefixDesc = "Increases ";
	var targetDesc = "your ";
	
	buffData.desc = "";
	
	if (statDesc == null) statDesc = "";
	if (statValue == null) statValue = "";
	if (category == null) category = "";
	if (display == null) display = "";
	
	if (statIds == null) statIds = [ statId ];
	if (statValues == null) statValues = [].fill.call({ length: statIds.length }, statValue);
	if (categories == null) categories = [].fill.call({ length: statIds.length }, category);
	if (displays == null) displays = [].fill.call({ length: statIds.length }, display);
	if (statDescs == null) statDescs = [].fill.call({ length: statIds.length }, statDesc);
			
	for (var i = 0; i < statIds.length; ++i)
	{
		statId = statIds[i].replace(/([A-Z])/g, ' $1').trim();
		statValue = statValues[i];
		category = categories[i];
		display = displays[i];
		
		if (typeof(statValue) != "string")
		{
			if (statValue < 0) 
			{
				prefixDesc = "Decreases ";
				statValue *= -1;
			}
			
			if (buffData.category == "Target") targetDesc = "the target's ";
			
			if (display == "%")
			{
				statValue = "" + (Math.floor(statValue*1000)/10) + "%";
			}
			
			if (statDescs[i] != null && statDescs[i] != "")
				buffData.desc += statDescs[i] + statValue + "<br/>";
			else
				buffData.desc += prefixDesc + targetDesc + statId + " by " + statValue + "<br/>";
		}
		else
		{
			if (statDescs[i] != null && statDescs[i] != "")
				buffData.desc += statDescs[i]+ statValue + "<br/>";
			else
				buffData.desc += statValue + "<br/>";
		}
	}
	
	return buffData.desc;
}


function UpdateEsoBuildVisibleBuffs()
{
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		var element = $(".esotbBuffItem[buffid='" + buffName + "']");
		
		if (buffData.toggleVisible === true && buffData.visible)
		{
			element.show();
			element.find(".esotbBuffDesc").html(CreateEsoBuildBuffDescHtml(buffData));
		}
		else if (buffData.toggleVisible === true && !buffData.visible)
		{
			element.hide();
		}
	}
}


function UpdateEsoBuffItem(element)
{
	if (element.hasClass("esotbBuffDisable")) return;
	var checked = element.find(".esotbBuffCheck").prop("checked");
	
	if (checked)
		element.addClass("esotbBuffItemSelect");
	else
		element.removeClass("esotbBuffItemSelect");
}


function OnEsoBuildBuffClick(e)
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


function OnEsoBuildBuffCheckClick(e)
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


function AddEsoBuildSkillDetailsButtons()
{
	var skillDetails = "<div class='esotbItemButton esotbSkillDetailsButton'>...</div>";
	$(".esovsSkillContentBlock").children(".esovsAbilityBlock").append(skillDetails);
}


function CreateEsoBuildClickWall()
{
	$("<div/>").attr("id", "esotbClickWall")
		.attr("style", "display:none;")
		.html("")
		.appendTo("body");
}


function CreateEsoBuildItemDetailsPopup()
{
	$("<div/>").attr("id", "esotbItemDetailsPopup")
		.attr("style", "display:none;")
		.html("<div id=\"esotbItemDetailsCloseButton\">x</div><div id=\"esotbItemDetailsTitle\"></div><div id=\"esotbItemDetailsText\"></div>")
		.appendTo("body");
}


function CreateEsoBuildFormulaPopup()
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


function SetEsoInitialData(destData, srcData)
{
	
	for (var key in srcData)
	{
		var value = srcData[key];
		if (value != null) destData[key] = value;
	}
	
}


function UpdateEsoSetMaxData()
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


function UpdateEsoInitialBuffData()
{
	for (var buffName in g_EsoInitialBuffData)
	{
		var enabled = g_EsoInitialBuffData[buffName];
		var buffData = g_EsoBuildBuffData[buffName];
		if (buffData == null) continue;
		
		buffData.enabled      = ((parseInt(enabled) & 1) != 0); 
		buffData.skillEnabled = ((parseInt(enabled) & 2) != 0);
	}
	
}


function UpdateEsoInitialToggleSetData()
{
	for (var setName in g_EsoInitialToggleSetData)
	{
		var initData = g_EsoInitialToggleSetData[setName];
		var setData = g_EsoBuildToggledSetData[setName];
		if (setData == null) continue;
		
		setData.enabled = (initData.enabled != 0);
		if (initData.count != null) setData.count = parseInt(initData.count);
	}

}


function UpdateEsoInitialToggleSkillData()
{
	for (var skillName in g_EsoInitialToggleSkillData)
	{
		var initData = g_EsoInitialToggleSkillData[skillName];
		var skillData = g_EsoBuildToggledSkillData[skillName];
		if (skillData == null) continue;
		
		skillData.enabled = (initData.enabled != 0);
		if (initData.count != null) skillData.count = parseInt(initData.count);
	}

}


function OnEsoBuildAbilityBlockClick(e)
{
	var $openList = $('.esovsAbilityBlockList:visible');
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


function RequestEsoBuildSave()
{
	var saveData = CreateEsoBuildSaveData();
	
	$.ajax("http://esobuilds.uesp.net/saveBuild.php", {
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


function RequestEsoBuildCreateCopy()
{
	var saveData = CreateEsoBuildSaveData();
	
	$.ajax("http://esobuilds.uesp.net/saveBuild.php", {
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


function OnEsoBuildSaved(data, status, xhr)
{
	if (!data.success)
	{
		SetEsoBuildSaveResults("ERROR saving build!");
	}
	else if (data.isnew)
	{
		UpdateEsoBuildNewId(data.id);
		SetEsoBuildSaveResults("Successfully created new build!");
		
		var currentUrl = window.location.href.split('?')[0];
		var newUrl = currentUrl + "?id=" + data.id;
		
		window.location.href = newUrl;
	}
	else
	{
		SetEsoBuildSaveResults("Successfully saved build!");	
	}

}


function OnEsoBuildCopy(data, status, xhr)
{
	if (!data.success)
	{
		SetEsoBuildSaveResults("ERROR copying build!");
		return;
	}
	
	UpdateEsoBuildNewId(data.id);
	SetEsoBuildSaveResults("Successfully created new build!");
	
	var currentUrl = window.location.href.split('?')[0];
	var newUrl = currentUrl + "?id=" + data.id;
	
	window.location.href = newUrl;
}


function OnEsoBuildCopyError(xhr, status, errorMsg)
{
	SetEsoBuildSaveResults("ERROR copying build!");
}


function OnEsoBuildSaveError(xhr, status, errorMsg)
{
	SetEsoBuildSaveResults("ERROR saving build!");
}


function UpdateEsoBuildNewId(newId)
{
	g_EsoBuildData.id = newId;
}


function CreateEsoBuildSaveData()
{
	var saveData = {};

	UpdateEsoComputedStatsList_Real();
	
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
	
	CreateEsoBuildOffBarSaveData(saveData, inputValues);
		
	return saveData;
}


function CreateEsoBuildSetToggleSaveData(saveData, inputValues)
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


function ConvertBoolToInt(value)
{
	if (value == null) return 0;
	return value ? 1 : 0;
}


function CreateEsoBuildSkillToggleSaveData(saveData, inputValues)
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


function CreateEsoAbilityRangeString(abilityData)
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


function CreateEsoAbilityAreaString(abilityData)
{
	if (abilityData == null) return "";
	var areaStr = "";
	
	if (abilityData.angleDistance > 0)
	{
		areaStr = "" + (abilityData.radius/100) + " x " + (abilityData.angleDistance/50) + " meters";
	}
	
	return areaStr;
}


function CreateEsoBuildActionBarSaveData(saveData, inputValues)
{
	saveData.ActionBars = {};
	
	for (var barIndex = 0; barIndex < 2; ++barIndex)
	{
		for (var slotIndex = 0; slotIndex < 6; ++slotIndex)
		{
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


function CreateEsoBuildCPSaveData(saveData, inputValues)
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
		
		if (cpData.points != null)
			data.points = cpData.points;
		else if (cpData.isUnlocked)
			data.points = -1;
		
		saveData.ChampionPoints[id] = data;		
	}
	
	return saveData;
}


function CreateEsoBuildBuffSaveData(saveData, inputValues)
{
	var data = {};
	saveData.Buffs = {};
	
	for (var buffName in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffName];
		if (!buffData.visible || !(buffData.enabled || buffData.skillEnabled)) continue;
		
		data = {};
		
		data.name = buffName;
		data.icon = buffData.icon;
		data.description = buffData.desc.replace("<br/>", "");
		data.abilityId = 0;
		
		data.enabled = 0;
		if (buffData.enabled) data.enabled += 1;
		if (buffData.skillEnabled) data.enabled += 2;
		
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
		data.name = "Stage " + inputValues.VampireStage + " Vampirism";
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


function CreateEsoBuildSkillSaveData(saveData, inputValues)
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


function CreateEsoBuildSaveDataForSkill(saveData, abilityData, skillData)
{
	var data = {};
	var abilityId = abilityData.abilityId;
	
	var skillType = ESOBUILD_SKILLTYPES[abilityData.skillType];
	if (skillType == null) skillType = abilityData.skillType;
	
	data.name = skillType + ":" + abilityData.skillLine + ":" + abilityData.name;
	data.type = abilityData.type.toLowerCase();
	if (data.type == "active") data.type = "skill";
	data.icon = abilityData.texture;
	data.abilityId = abilityId;
	data.rank = +skillData.rank + +skillData.morph * 4;
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


function CreateEsoBuildItemSaveData(saveData, inputValues)
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
	saveData.Stats["ColdStaffWeaponCount"] = "" + inputValues.WeaponColdStaff;
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


function CreateEsoBuildGeneralSaveData(saveData, inputValues)
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
	
	saveData.Stats['ActiveAbilityBar'] = "" + inputValues.ActiveBar;
	saveData.Stats['ActiveWeaponBar'] = "" + inputValues.ActiveBar;
	
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
	saveData.Stats['Target:CritResistFlat'] = "" + inputValues.Target.CritResistFlat;
	saveData.Stats['Target:CritResistFactor'] = "" + (inputValues.Target.CritResistFactor * 100) + "%";
	saveData.Stats['Target:CritDamage'] = "" + (inputValues.Target.CritDamage * 100) + "%";
	saveData.Stats['Target:CritChance'] = "" + (inputValues.Target.CritChance * 100) + "%";
	saveData.Stats['Misc:SpellCost'] = "" + inputValues.Misc.SpellCost;
	
	saveData.Stats['AttributesTotal'] = "" + inputValues.Attribute.TotalPoints;
	saveData.Stats['AttributesHealth'] = "" + inputValues.Attribute.Health;
	saveData.Stats['AttributesMagicka'] = "" + inputValues.Attribute.Magicka;
	saveData.Stats['AttributesStamina'] = "" + inputValues.Attribute.Stamina;
	
	saveData.Stats['Mundus'] = inputValues.Mundus.Name;
	saveData.Stats['Mundus2'] = inputValues.Mundus.Name2;
	
	saveData.Stats['SkillPointsTotal'] = g_EsoSkillPointsUsed;
	
	return saveData;
}


function HasEsoBuildThirdSkillBar()
{
		// TODO: Add third skill bar
	return false;
}


function CreateEsoBuildOffBarSaveData(saveData, inputValues)
{
	var CurrentActiveBar = g_EsoBuildActiveWeapon;
	
	CreateEsoBuildComputedSaveData(saveData, inputValues, CurrentActiveBar);
	
	if (HasEsoBuildThirdSkillBar() && CurrentActiveBar != 3)
	{
		SetEsoBuildActiveSkillBar(3);
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
	
	SetEsoBuildActiveWeaponBar(CurrentActiveBar);
	SetEsoBuildActiveSkillBar(CurrentActiveBar);
	UpdateEsoComputedStatsList(true);
}


function CreateEsoBuildComputedSaveData(saveData, inputValues, barIndex)
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
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "WeaponCritPerecent");
	AddEsoBuildComputedStatToSaveData(saveData, "WeaponCrit", prefix + "WeaponCritPerecent");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellResist", prefix + "SpellResist");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalResist", prefix + "PhysicalResist");
	AddEsoBuildComputedStatToSaveData(saveData, "CritResist", prefix + "CriticalResistance");
	AddEsoBuildComputedStatToSaveData(saveData, "ColdResist", prefix + "DamageResistCold");
	AddEsoBuildComputedStatToSaveData(saveData, "DiseaseResist", prefix + "DamageResistDisease");
	AddEsoBuildComputedStatToSaveData(saveData, "FlameResist", prefix + "DamageResistFire");
	AddEsoBuildComputedStatToSaveData(saveData, "SpellResist", prefix + "DamageResistMagic");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalResist", prefix + "DamageResistPhysical");
	AddEsoBuildComputedStatToSaveData(saveData, "PoisonResist", prefix + "DamageResistPoison");
	AddEsoBuildComputedStatToSaveData(saveData, "ShockResist", prefix + "DamageResistShock");
	
	AddEsoBuildComputedStatToSaveData(saveData, "SpellPenetration", prefix + "SpellPenetration");
	AddEsoBuildComputedStatToSaveData(saveData, "PhysicalPenetration", prefix + "PhysicalPenetration");
	
	return saveData;
}


function GetEsoBuildSetCount(setName)
{
	if (setName == null || setName == "") return 0;
	if (g_EsoBuildSetData[setName] == null) return 0;
	return g_EsoBuildSetData[setName].count;
}


function AddEsoBuildComputedStatToSaveData(saveData, name, outName, addComputed, type)
{
	var statData = g_EsoComputedStats[name];
	if (statData == null) return;
	
	var value = statData.value;
	
	if (type == "critical")
		value = ConvertEsoPercentCritToFlat(value - 0.1);
	else if (statData.display == "%" || type == "%") 
		value = Math.round(value * 1000)/10;
	
	if (outName == null) outName = name;
	var statId = outName;
	if (addComputed === true) statId = "Computed:" + outName;
	
	saveData.Stats[statId] = "" + value;
}


function SetEsoBuildSaveResults(text)
{
	$("#esotbSaveResults").html(text);
}


function OnEsoBuildSave(e)
{
	SetEsoBuildSaveResults("Saving build...");
	RequestEsoBuildSave();	
}


function OnEsoBuildCreateCopy(e)
{
	var buildName = $("#esotbBuildName").val().trim();
	if (!buildName.endsWith(" (Copy)")) $("#esotbBuildName").val(buildName + " (Copy)");
	
	RequestEsoBuildCreateCopy();
	SetEsoBuildSaveResults("Saving new build...");
}


function esotbOnDocReady()
{
	GetEsoSkillInputValues = GetEsoTestBuildSkillInputValues;
	
	SetEsoInitialData(g_EsoBuildItemData, g_EsoInitialItemData);
	SetEsoInitialData(g_EsoBuildEnchantData, g_EsoInitialEnchantData);
	SetEsoInitialData(g_EsoBuildSetMaxData, g_EsoInitialSetMaxData);
	UpdateEsoSetMaxData();
	
	UpdateEsoInitialBuffData();
	
	CreateEsoBuildToggledSetData();
	CreateEsoBuildToggledSkillData();
	UpdateEsoInitialToggleSetData();
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
	$(".esotbStatRow").click(OnEsoClickStatRow);
	$(".esotbStatDetailsButton").click(OnEsoClickStatDetails);
	$(".esotbStatWarningButton").click(OnEsoClickStatWarningButton);
	$(".esotbStatNoteButton").click(OnEsoClickStatWarningButton);
	$("#esotbStealth").click(OnEsoClickStealth);	
	$("#esotbCyrodiil").click(OnEsoClickCyrodiil);
	
	$(".esotbInputValue").on('input', function(e) { OnEsoInputChange.call(this, e); });
	
	$(".esotbItemIcon").click(OnEsoClickItemIcon)
	
	$(".esotbComputeItems").click(OnEsoClickComputeItems);

	$("#esotbItemDetailsCloseButton").click(CloseEsoItemDetailsPopup);
	$("#esotbFormulaCloseButton").click(CloseEsoFormulaPopup);
	$("#esotbClickWall").click(OnEsoClickBuildWall);
	
	$(".esotbStatTab").click(OnEsoClickBuildStatTab);
	
	$(document).on("EsoItemSearchPopupOnClose", OnEsoItemSearchPopupClose);
	
	$(document).on("esocpUpdate", OnEsoBuildCpUpdate);
	
	$(".esotbItemDetailsButton").click(OnEsoItemDetailsClick);
	$(".esotbItemEnchantButton").click(OnEsoItemEnchantClick);
	$(".esotbItemDisableButton").click(OnEsoItemDisableClick);
	$(".esotbSkillDetailsButton").click(OnEsoSkillDetailsClick);
	
	$("#esotbWeaponBar1").click(OnEsoWeaponBarSelect1);
	$("#esotbWeaponBar2").click(OnEsoWeaponBarSelect2);
	// TODO: 3rd Bar
	
	$(document).on("EsoSkillBarSwap", OnEsoBuildSkillBarSwap);
	$(document).on("EsoSkillUpdate", OnEsoBuildSkillUpdate);
	$(document).on("EsoSkillBarUpdate", OnEsoBuildSkillBarUpdate);
	
	$(".esotbBuffCheck").click(OnEsoBuildBuffCheckClick);
	$(".esotbBuffItem").click(OnEsoBuildBuffClick);
	
	$(".esovsSkillContentBlock").children(".esovsAbilityBlock").click(OnEsoBuildAbilityBlockClick); 
	
	$("#esotbSaveButton").click(OnEsoBuildSave);
	$("#esotbCreateCopyButton").click(OnEsoBuildCreateCopy);
	
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) OnEsoBuildEscapeKey(e);
	});
	
	//UpdateEsoComputedStatsList(true);
	UpdateEsoCpData();
}


$( document ).ready(esotbOnDocReady);


