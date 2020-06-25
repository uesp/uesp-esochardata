/* TODO:
 * 		- Passive skill parsing
 * 		- Sets parsing
 * 		- Synergy parsing
 * 		- Complete active/ultimate skill parsing.
 * 		- Custom actions:
 * 			- Use Synergy
 * 			- Roll dodge
 * 			- Bash
 *		- Complete target mitigation.
 *		- More in-depth parsing statistics (like Combat Metrics)
 *		- Combat log:
 *				- Formatting.
 *				- Logging verbose level.
 *				- Turn things on/off
 *						Spell cast
 *						Extra damage info
 *						Buffs on/off
 *						Status Effects on/off
 *						Cooldowns on/off
 *		- Poisons
 *		- Instant abilities (bar swap, failed skill cast)
 *		- Better active skill toggle handle
 *			- Seperate from in-game skill toggles
 *			- Display toggles
 *			- Source data
 *		- Taunt cooldown?
 *		- Events
 *			- onSynergy (player's can't activate their own synergy except for the Haven of Ursus set and ? skill)
 * 			- onDamageShield ?
 *  		- onHeal ?
 *  		- onHealCrit 
 *			- onPoison
 *		- Skill Parsing
 *				- Stonefist and morphs (how does this work?)
 *				- Pummeling Goliath bash attack?
 *				- Venom Skull (casting any Necro skill counts towards skill)
 *				- Avid Boneyard (use own synergy)
 *				- Empowering Sweep - Keep empower for the duration
 *				- Reduce enemy movement speed
 *				- Minor Mangle, reducing their Max Health by 10% for 10 seconds.
 *				- Healing Springs
 *				- Long Shots: Gives you a damage bonus of up to 12% against enemies at longer range.
 *				- Deliberation: While you are casting or channeling a Psijic Order ability you gain Major Protection, reducing your damage taken by 30%.
 *				- Spell Recharge: When you are using an ability with a channel or cast time, you take 5% less damage.
 *		- Set Parsing:
 *				- Sheer Venom: More damage with execute?
 *		- Increased the bonus damage done to off-balance targets with a Heavy Attack to 70% from 45% (more resources?)
 *		- Show Light/Heavy attack tooltips.
 *		- Resource gains "lost" or unused.
 *		- Roll Dodge fatigue.
 *
Single Target DoTs (e.g. Poison Injection, Destructive Clench) base their damage on the impact bar (i.e. the bar from which they were cast), rather than the active bar.
Ground AoE Dots (e.g. Liquid Lightning, Blockade, Endless Hail, Caltrops) base their damage on the active bar (i.e. the bar you are currently on), rather than the impact bar.
Both types of DoTs inherit the penetration from the impact bar and the crit damage and crit chance from the active bar.

So by this explanation I'm getting that buffs work similarly to action bars. A targeted dot damage will be static to the stats and buffs at the time of cast, whereas a persistent
dot like blockade will change its damage in real time with buffs gaining and falling?

Buffs that affect damage done (e.g. Minor Slayer, Minor Berserk) will update dynamically for both types of DoTs. In other words, if Minor Berserk falls off in the middle of a DoT,
the next tick will update to take that into account.
Buffs that affect Spell or Weapon Damage (e.g. Major Sorcery, Major Brutality) will not update dynamically for single target DoTs. In other words, if Major Sorcery falls off in the
This is because Minor Berserk is an increase to damage done, and so is tacked on at the end of damage calculation, while Major Sorcery is a 20 percent buff to your Spell Damage, so it is
used to calculate the initial damage ticks for single target DoTs.
 */


window.g_EsoBuildCombatPlayerRotations = {
		"default": {},
};
window.g_EsoBuildCombatPlayerActions = g_EsoBuildCombatPlayerRotations['default'];
window.g_EsoBuildCombatCurrentRotation = "default";

window.g_EsoBuildCombatIsRunning = false;
window.g_EsoBuildCombatIsPaused = false;
window.g_EsoBuildCombatTimeoutId = -1;
window.g_EsoBuildCombatStatUpdateRequired = false;
window.g_EsoBuildCombatNextFreeId = 1;
window.g_EsoBuildCombatInputValuesCache = {};

window.g_EsoBuildCombatFilterText = "";

	//TODO: Move to state?
window.g_EsoBuildCombatVolleyCounter = 0;
window.g_EsoBuildCombatZaanCounter = 0;
window.g_EsoBuildCombatSkeletalArcherAttackCount = 0;
window.g_EsoBuildCombatGrimFocusCounter = 0;
window.g_EsoBuildCombatOnslaughtResist = 0;
window.g_EsoBuildCombatBloodFrenzyTickCount = 0;
window.g_EsoBuildCombatBloodFrenzyTotalCost = 0;
window.g_EsoBuildCombatNecroPetDeaths = 0;
window.g_EsoBuildCombatLastNecroPetDeaths = 0;


window.g_EsoBuildCombatOptions = {
		useLAWeaving : true,
		skipSkillOnError: true,
		stayInOverload: true,
		stayInWerewolf: true,
		ignoreResources: true,		//Only H/M/S
		ignoreUltimate: false,
		startWithFullUltimate: false,
		log: {
			showRolls : true,
			showDamageDetails: true,
			showBuffs: true,
			showStatusEffects: true,
			showBarSwaps: true,
			showRegen: true,
			showRestore: true,
			showToggles: true,
			showSkillCast: true,
		},
};


window.g_EsoBuildCombatStateTemplate = {
	currentTime : 0.0,
	nextPlayerActionId : 0,
	rotationCount: 0,
	
	currentHealth : 10000,
	currentMagick : 10000,
	currentStamina : 10000,
	currentUltimate : 500,
	
	statHistory: {},
	
	targetHealth : 6800000,
	targetMaxHealth: 6800000,
	targetPctHealth: 100,
	
	damageSources: {},
	
	damageDone : {
		total : 0,
		crit : 0,
		dot : 0,
		aoe: 0,
		bleed: 0,
		melee: 0,
		pet: 0,
		Magic : 0,
		Flame : 0,
		Frost : 0,
		Shock : 0,
		Physical : 0,
		Bleed : 0,
		Poison : 0,
		Disease : 0,
		Oblivion : 0,
		Other : 0,
	},
	
	hits : {
		total : 0,
		crit : 0,
		dot : 0,
		aoe: 0,
		bleed: 0,
		melee: 0,
		pet: 0,
		Magic : 0,
		Flame : 0,
		Frost : 0,
		Shock : 0,
		Physical : 0,
		Bleed : 0,
		Poison : 0,
		Disease : 0,
		Oblivion : 0,
		Other : 0,
	},
	
	runTimes: {},
	
	resourceSources: {},
	resourceDrains: {},
	
	healingDone : {
		total : 0,
	},
	
	playerStatus : {},
	targetStatus : {},
	
	isOverload: false,
	overloadSkillData: null,
	isWerewolf: false,
	werewolfSkillData: null,
	origSkillBarIndex: 1,
	
	buffs: {},
	dots: {},
	pets: {},
	counters: {},
	cooldowns : {},
	synergies : {},
	restoreStats: {},
	toggles: {},
	activeSkills: {},
	activeSkillLines: {},
	
	skillDelay: {},
	
	events: {
		onStatusEffectCast: [],
		onStatusEffectChange: [],
		onUltimateCast: [],
		onAnySkillCast: [],
		onRollDodge: [],
		onSynergy: [],
		onTaunt: [],
		onDrinkPotion: [],
		onLightAttack: [],
		onHeavyAttack: [],
		onCrit: [],
		onAnyDamage: [],
		onTime: [],
		onTick: [],
		onBuff: [],
		onDebuff: [],
		
		getAllDamageMod: [],
		getExtraDamage: [],
		getCritChanceMod: [],
		getCostMod: [],
		getStatusEffectChanceMod: [],
		getFlatResistMod: [],
	},
	
};


	// Is copied from template as needed
window.g_EsoBuildCombatState = {};

window.g_EsoBuildCombatSkillBars = {};
window.g_EsoBuildCombatActiveSkills = {};
window.g_EsoBuildCombatPassiveSkills = {};
window.g_EsoBuildCombatSkillLines = {};
window.g_EsoBuildCombatCPPassives = {};

window.g_EsoBuildCombatBlockDragging = $();
window.g_EsoBuildCombatBlockDragOrig = $();
window.g_EsoBuildCombatBlockDragLastOver = $();

window.ESOBUILD_GLOBALDELAY_TIME = 0.7;
window.ESOBUILD_SKILLCAST_TIME = 0.5;
window.ESOBUILD_COMBAT_LOOPDELTATIME = 0.1;
window.ESOBUILD_COMBAT_ROUNDTIME = 0.04;
window.ESOBUILD_COMBAT_REALTIMELOOPDELAYMS = 200;
window.ESOBUILD_COMBAT_REGENTICKLENGTH = 2.0;
window.ESOBUILD_COMBAT_RESTORETICKLENGTH = 1.0;
window.ESOBUILD_MAX_ULTIMATE = 500;
window.ESOBUILD_COMBAT_INITIALSKILLBAR = -1;
window.ESOBUILDCOMBAT_LAULTIMATEBUFF_DURATION = 9.0;
window.ESOBUILD_COMBAT_USECACHED_INPUTVALUES = true;
window.ESOBUILDCOMBAT_STATHISTORY_MAXTIME = 5.0;

window.ESOBUILDCOMBAT_BURNING_DURATION = 4;
window.ESOBUILDCOMBAT_CHILLED_DURATION = 4;
window.ESOBUILDCOMBAT_CONCUSSION_DURATION = 4;
window.ESOBUILDCOMBAT_POISONED_DURATION = 6;
window.ESOBUILDCOMBAT_DISEASED_DURATION = 6;

window.ESOBUILD_COMBAT_STATUSEFFECT_ENCHANTCHANCE = 0.20;
window.ESOBUILD_COMBAT_STATUSEFFECT_SKILLCHANCE = 0.10;
window.ESOBUILD_COMBAT_STATUSEFFECT_AOECHANCE = 0.05;
window.ESOBUILD_COMBAT_STATUSEFFECT_DOTCHANCE = 0.03;
window.ESOBUILD_COMBAT_STATUSEFFECT_AOEDOTCHANCE = 0.01;
window.ESOBUILD_COMBAT_STATUSEFFECT_MINCHANCE = 0.50;

window.ESOBUILDCOMBAT_OFFBALANCE_DURATION = 5.0;
window.ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN = 20.0;

window.ESOBUILDCOMBAT_TAUNT_DURATION = 15.0;

window.ESOBUILDCOMBAT_POTION_DURATION = 36.6;
window.ESOBUILDCOMBAT_POTION_COOLDOWN = 45.0;

window.ESOBUILDCOMBAT_MAXMELEE_RANGE = 700;		// In game base units of cm

window.ESOBUILDCOMBAT_CORPSE_DURATION = 10.0;	//TODO: 


/*
 * Handles matching all damage and actions from skills (ultimate, active, and passive).
 * 
 *		type: Specifies the base type of the effect. directdamage dot synergy special
 * 
 * 		isAOE: Is the effect an Area-of-Effect type skill. Default is false (Single Target).
 * 			true | false
 * 
 * 		isDOT: Is the effect a Damage-over-Time. Default is false (Direct Damage).
 * 			true | false
 * 
 * 		isExclusive: If true then no other matches of this type will be checked for this skill. Default is false. 
 * 			true | false
 * 
 * 		match: Regex for the effect. Note that different effect types expect matching groups to be in a certain order:
 * 
 *			directdamage: 
 *				1 = Damage Value
 *				2 = Damage Type 
 *
 *			dot: 
 *				1 = Damage Value 
 *				2 = Damage Type 
 *				3 = Duration
 * 
 * TODO...
 * 
 */
window.ESOBUILD_COMBAT_SKILL_MATCHES_PRECAST = [

/*
 * This array should only have non-permanent effects list cost/duration parsing
 * that occur before the actual casting of the skill in case the skill is not
 * cast due to any reaspon.
 * 
 */

	{
		id: "Flame Lash",
		type: "cost",
		getCostFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Off Balance", "Immobilized")) return Math.floor(parseInt(skillData.newCostText)/2) + " Magicka";
			return skillData.newCostText;
		},
		getNameFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Off Balance", "Immobilized")) return "Power Lash";
			return skillData.name;
		},
		match: /Lash an enemy with flame, dealing ([0-9]+) Flame Damage\.[\s]+If you strike an enemy that is immobilized or stunned, you set them Off Balance\.[\s]+Targeting an Off Balance or immobilized enemy changes this ability into Power Lash, allowing you to lash an enemy at half cost to deal ([0-9]+) Flame Damage and heal you for [0-9]+ Health over [0-9]+ seconds\.[\s]+This effect can occur once every ([0-9]+) seconds\./,
	},
	{
		id: "Pounce",
		type: "name",
		getNameFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("player", "Pounce")) return "Carnage";
			return skillData.name;
		},
		match: /Activating the ability again within the next [0-9]+ seconds causes you to cast Carnage/,
	},
	{
		id: "Feral Pounce",
		type: "name",
		getNameFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("player", "Feral Pounce")) return "Feral Carnage";
			return skillData.name;
		},
		match: /Activating the ability again within the next [0-9]+ seconds causes you to cast Feral Carnage/,
	},
	{
		id: "Brutal Pounce",
		type: "name",
		getNameFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("player", "Brutal Pounce")) return "Brutal Carnage";
			return skillData.name;
		},
		match: /Activating the ability again within the next [0-9]+ seconds causes you to cast Brutal Carnage/,
	},
	{
		id: "Grim Focus",
		getCostFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Grim Focus") && g_EsoBuildCombatGrimFocusCounter >= matchResult[3]) return Math.floor(parseInt(skillData.newCostText)/2) + " Magicka";
			return skillData.newCostText;
		},
		match: /Focus your senses for ([0-9.]+) seconds, reducing your damage taken by ([0-9.]+)% with every Light or Heavy Attack, up to ([0-9.]+) times/i,
	},
	{
		id: "Bound Armaments",
		getCostFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasPlayerStatus("Bound Armaments")) return Math.floor(parseInt(skillData.newCostText)/2) + " Magicka";
			return skillData.newCostText;
		},
		match: /to summon a Bound weapon for ([0-9.]+) seconds, up to ([0-9.]+) times[\s\S]+causing them to strike your target for ([0-9.]+) Physical Damage every ([0-9.]+) second/i,
	},
	{
		id: "Crystal Fragments",
		getCostFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasPlayerStatus("Crystal Fragments")) return Math.floor(parseInt(skillData.newCostText) * (1 - matchResult[3]/100)) + " Magicka";
			return skillData.newCostText;
		},
		getCastTimeFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasPlayerStatus("Crystal Fragments")) return 0;
			return skillData.castTime;
		},
		match: /Conjure dark crystals to bombard an enemy, dealing ([0-9.]+) Magic Damage[\s\S]+instant, deal ([0-9.]+)% more damage, and cost ([0-9.]+)% less Magicka/i,
	},
	
];


window.ESOBUILD_COMBAT_SKILL_MATCHES = [

	{
		id: "Flurry",
		type: "dot",
		useTotalDamage: false,
		isAOE: false,
		isExclusiveAll: true,
		getDamageFunc: function(matchResult, skillData) { return parseInt(matchResult[1]); },
		getDamageTypeFunc: function(matchResult, skillData) { return "Physical"; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.channelTime / 1000; },
		getTickTimeFunc: function(matchResult, skillData) { return skillData.channelTime / 1000 / 5; },
		match: /battering them with five consecutive attacks that each deal ([0-9]+) Physical Damage/i,
	},
	{
		id: "Blastbones",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /Summon a flaming skeleton from the ground after ([0-9]+) second.*dealing ([0-9]+) Flame Damage to all enemies/i,
	},
	{
		id: "Summon Shade",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /Summon a shade version of yourself to attack/,
	},
	{
		id: "Skeletal Mage",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /The mage attacks the closest enemy every ([0-9]+) seconds, dealing ([0-9]+) Shock Damage/i,
	},
	{
		id: "Elemental Storm",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /Create a cataclysmic storm at the target location that builds.* ([0-9]+) seconds then lays waste to all enemies in the area/i,
	},
	{
		id: "Summon Unstable Familiar",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /The familiar's attacks deal ([0-9]+) Shock Damage/i,
	},
	{	id: "Summon Unstable Clannfear",		//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /The clannfear's headbutt deals ([0-9]+) Physical Damage/i,
	},
	{
		id: "Skeletal Archer",			//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /The archer attacks the closest enemy every ([0-9]+) seconds, dealing ([0-9]+) Physical Damage/i,
	},
	{
		id: "Unstable Wall of Elements",			//Prevent further damage matches
		type: "directdamage",
		isExclusive: true,
		ignore: true,
		match: /before exploding for an additional ([0-9.]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Unstable Wall of Elements",			//Prevent further damage matches
		type: "directdamage",
		isExclusive: true,
		ignore: true,
		match: /the barrier explodes, dealing ([0-9.]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Vampiric Drain",					//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /Siphon away your enemies' vitality, dealing ([0-9.]+) Magic Damage and healing you for ([0-9.]+)% of your missing Health every ([0-9.]+) second(?:s|) for ([0-9.]+) second/i,
	},
	{
		id: "Blood Mist",					//Prevent further damage matches
		type: "special",
		isExclusiveAll: true,
		match: /While in this form you deal ([0-9.]+) Magic Damage every ([0-9.]+) second to enemies around you and heal for the damage caused/i,
	},
	{
		id: "Inferno",
		type: "dot",
		isExclusiveAll: true,
		getDamageFunc: function(matchResult, skillData) { return matchResult[2]; },
		getDamageTypeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration / 1000; },
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[1]; },
		match: /a fireball at the nearest enemy every ([0-9]+) seconds, dealing ([0-9]+) ([A-Za-z]+) Damage/i,
	},
	
		// Direct Damage
	{
		id: "Radial Sweep",
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /Swing your Aedric spear around with holy vengeance, dealing ([0-9]+) ([A-Za-z]+) Damage to all nearby enemies/i,
	},
	{
		id: "Puncturing Strikes",
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		match: /The spear deals ([0-9]+) ([A-Za-z]+) Damage to the closest enemy/i,
	},
	{
		id: "Summon Storm Atronach",
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /Summon an immobile storm atronach at the target location. Its arrival deals ([0-9]+) ([A-Za-z]+) and/i,
	},
	{
		id: "Soul Shred",
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /Ravage nearby enemies' souls with a night rune, dealing ([0-9]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Elemental Ring",
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies at the target location/i,
	},
	{
		id: "Flame Lash",
		type: "directdamage",
		isExclusive: true,
		isAOE: false,
		getDamageFunc: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Off Balance", "Immobilized")) return parseInt(matchResult[2]);
			return parseInt(matchResult[1]);
		},
		getCooldownFunc: function(matchResult, skillData) { return parseFloat(matchResult[3]); },
		getDamageTypeFunc: function(matchResult, skillData) { return "Flame"; },
		match: /Lash an enemy with flame, dealing ([0-9]+) Flame Damage\.[\s]+If you strike an enemy that is immobil.* or stunned, you set them Off Balance\.[\s]+Targeting.*changes this ability into Power Lash, allowing you to lash an enemy at half cost to deal ([0-9]+) Flame Damage and heal you for [0-9]+ Health over [0-9]+ seconds\.[\s]+This effect can occur once every ([0-9]+) seconds\./,
	},
	{
		type: "directdamage",
		isExclusive: true,
		isAOE: true,
		match: /to enemies in front of you, dealing ([0-9]+) ([A-Za-z]+) Damage and/i,
	},
	{
		type: "directdamage",
		isExclusive: true,
		isAOE: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in your wake/i,
	},
	{
		type: "directdamage",
		isExclusive: true,
		isAOE: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in the area/i,
	},
	{
		id: "Pounce",
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		isEnabled: function() {
			return !EsoBuildCombatHasStatusEffect("player", "Pounce", "Brutal Pounce", "Feral Pounce");
		},
		match: /Pounce on an enemy with primal fury, dealing ([0-9]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Pounce",
		type: "special",
		isExclusiveAll: true,
		isEnabled: function() {
			return !EsoBuildCombatHasStatusEffect("player", "Pounce", "Brutal Pounce", "Feral Pounce");
		},
		onMatchAfter: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, skillData.name, matchResult[1], 0);
		},
		match: /Activating the ability again within the next ([0-9]+) seconds causes you to cast (Feral |Brutal |)Carnage/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to them and all nearby enemies/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to them/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /Nearby enemies take ([0-9]+) ([A-Za-z]+) Damage when the shield is activated/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /Exhale a (?:flaming|corrosive) blast to enemies in front of you, dealing ([0-9]+) ([A-Za-z]+) Damage/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in front of you/i,
	},
	{
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to the target and/i,
	},
	{
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		match: /When the stun ends, they take ([0-9]+) ([A-Za-z]+) Damage/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies near you/i,
	},
	{
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		match: /deals ([0-9]+) ([A-Za-z]+) Damage to the closest enemy/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to nearby enemies/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /and ([0-9]+) ([A-Za-z]+) Damage to all other enemies/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to all nearby enemies/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /and ([0-9]+) ([A-Za-z]+) Damage to all enemies/i,
	},
	{
		type: "directdamage",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to all enemies/i,
	},
	{
		type: "directdamage",
		isAOE: false,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage(?:\.| and|,)/i,
	},
	
		// DOTs
	{
		id: "Pounce",
		type: "dot",
		isAOE: false,
		isBleed: true,
		isExclusive: true,
		useTotalDamage: true,
		isEnabled: function() {
			return EsoBuildCombatHasStatusEffect("player", "Pounce", "Brutal Pounce", "Feral Pounce");
		},
		onMatchAfter: function(matchResult, skillData) {
			EsoBuildCombatRemovePlayerStatus(skillData.name);
		},
		match: /Carnage causes the enemy to bleed for ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) seconds/i,
	},
	{
		id: "Lacerate",
		type: "dot",
		isAOE: true,
		isBleed: true,
		isExclusive: true,
		useTotalDamage: true,
		getTickTimeFunc: function(matchResult, skillData) { return 1.0; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		match: /Slash enemies in front of you, causing them to bleed for ([0-9.]+) ([A-Za-z]+) Damage over ([0-9.]+) second/i,
	},
	{
		id: "Necrotic Orb",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return 0.5; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9.]+) ([A-Za-z]+) Damage every half second to nearby enemies/i,
	},
	{
		id: "Growing Swarm",
		type: "dot",
		isAOE: false,
		isBleed: true,
		isExclusive: true,
		useTotalDamage: true,
		match: /Unleash a swarm of fetcherflies to relentlessly attack an enemy, causing them to bleed for ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		id: "Carve",
		type: "dot",
		isAOE: true,
		isBleed: true,
		isExclusive: true,
		useTotalDamage: true,
		match: /to enemies in front of you, and causing them to bleed for an additional ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		id: "Impaling Shards",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /skewer enemies in the area, dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) for ([0-9]+) second/i,
	},
	{
		id: "Sleet Storm",
		type: "dot",
		isAOE: true,
		isBleed: true,
		isExclusive: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) for ([0-9]+) seconds to enemies around you/i,
	},
	{
		id: "Shocking Siphon",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) seconds to all enemies around the corpse/i,
	},
	{
		id: "Blade Cloak",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		getDamageFunc: function(matchResult) { return matchResult[2]; },
		getDamageTypeFunc: function(matchResult) { return matchResult[3]; },
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[1]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /Every ([0-9.]+) second(?:s|) the shrapnel will pulse, dealing ([0-9]+) ([A-Za-z]+) Damage to all enemies./i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to all enemies in the area every ([0-9]+) second(?:s|) for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) for ([0-9]+) seconds to enemies in the area/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second to enemies inside/i,
	},
	{
		type: "dot",
		isAOE: true,
		useTotalDamage: false,
		isExclusive: true,
		match: /deal ([0-9]+) ([A-Za-z]+) Damage (?:damage |)to nearby enemies every second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) to nearby enemies/i,
	},
	{
		type: "dot",
		isExclusive: true,
		isAOE: true,
		match: /to enemies in front of you, dealing [0-9]+ [A-Za-z]+ Damage and an additional ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) ([A-Za-z]+) second/i,
	},
	{
		type: "dot",
		isExclusive: true,
		isAOE: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },			//TODO: Option for more enemies hit?
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4] + matchResult[5]; },
		match: /an additional ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) seconds for ([0-9]+) second.*The duration is extended by ([0-9]+) seconds for each enemy hit/i,
	},
	{
		type: "dot",
		isAOE: false,
		isBleed: true,
		isExclusive: true,
		useTotalDamage: true,
		match: /and causing them to bleed for an additional ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		type: "dot",
		isExclusive: true,
		isAOE: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /take ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) for ([0-9]+) second/i,
	},
	{
		id: "Radiant Destruction",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: true,
		getTickTimeFunc: function(matchResult, skillData) { return 0.6; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		match: /Burn an enemy with a ray of holy fire, dealing ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		id: "Volley",
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4] + matchResult[5]; },
		getInitialTickFunc: function(matchResult, skillData) { return matchResult[5]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in the target area every ([0-9]+) second for ([0-9]+) seconds, after a ([0-9]+) second delay/i,
	},
	{
		type: "dot",
		isExclusive: true,
		isAOE: true,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /an additional ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second(?:s|) for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: true,
		match: /Exhale a (?:flaming|corrosive) blast to enemies in front of you, dealing [0-9]+ [A-Za-z]+ Damage and an additional ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) seconds./i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) seconds to enemies/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /zapping nearby enemies with electricity dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /buffeting nearby enemies with wind dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in the area every ([0-9]+) second for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /enemies in the target area take ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: false,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) seconds/i,
	},
	{
		type: "dot",
		isAOE: false,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to them every ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return matchResult[4]; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in the target area every ([0-9]+) second for ([0-9]+) seconds/i,
	},
	{
		type: "dot",
		isAOE: true,
		useTotalDamage: true,
		isExclusive: true,
		match: /enemies hit to take ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /Deals ([0-9]+) ([A-Za-z]+) Damage to enemies in the target area every ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in the target area every ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: true,
		isExclusive: true,
		useTotalDamage: false,
		getTickTimeFunc: function(matchResult, skillData) { return matchResult[3]; },
		getDamageTimeFunc: function(matchResult, skillData) { return skillData.duration/1000; },
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: false,
		isExclusive: true,
		useTotalDamage: true,
		match: /dealing ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: false,
		isExclusive: true,
		useTotalDamage: true,
		match: /an additional ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	{
		type: "dot",
		isAOE: false,
		isExclusive: true,
		useTotalDamage: true,
		match: /take ([0-9]+) ([A-Za-z]+) Damage over ([0-9]+) second/i,
	},
	
];


window.EsoBuildCombatOnBurningLight = function(matchResult, skillData, skillDataCast)
{
	// match: /When you deal damage with an Aedric Spear ability, you have a
	// ([0-9]+)% chance to deal an additional ([0-9]+) Physical Damage or
	// ([0-9]+) Magic Damage, whichever is higher\.
	// This effect can occur once every ([0-9\.]+) seconds./,
	// 1 = Chance
	// 2 = Physical
	// 3 = Magic
	// 4 = Cooldown
	
	if (EsoBuildCombatHasCooldown(skillData.abilityId)) return;
	
	var chance = parseFloat(matchResult[1]) / 100;
	if (!EsoBuildCombatCheckRandom(chance, "skill", skillData)) return;
	
	var physicalDamage = parseInt(matchResult[2]);
	var magicDamage = parseInt(matchResult[3]);
	var damageType = "Magic";
	var damage = magicDamage;
	
	if (physicalDamage > damage) 
	{
		damage = physicalDamage;
		damageType = "Physical";
	}
	
	if (damage <= 0) return;
	
	EsoBuildCombatApplyDamage("passiveproc", skillData, damage, damageType, false, false, false, false);
	EsoBuildCombatAddCooldown(skillData.abilityId);
}


window.ESOBUILD_COMBAT_SKILL_ONETIME_MATCHES = [

	{
		type: "majordefile",
		isExclusive: true,
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", matchResult[1]);
		},
		match: /and applying Major Defile to them for ([0-9.]+) second/i,
	},
	{
		type: "majordefile",
		isExclusive: true,
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", matchResult[1]);
		},
		match: /Afflicts enemies with Major Defile for ([0-9.]+) second/i,
	},
	{
		type: "majordefile",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", skillData.duration/1000);
		},
		match: /and applying Major Defile to them/i,
	},
	{
		type: "majordefile",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", skillData.duration/1000);
		},
		match: /are afflicted with Major Defile,/i,
	},
	{
		type: "majordefile",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", matchResult[2]);
		},
		match: /with Major Defile, reducing their healing received and Health Recovery by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		type: "minordefile",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Defile (Target)", matchResult[2]);
		},
		match: /afflicts enemy with Minor Defile, which reduces their healing received and Health Recovery by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		type: "minormending",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Mending", skillData.duration / 1000);
		},
		match: /you gain Minor Mending/i,
	},
	{
		type: "fear",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Feared", matchResult[1]);
		},
		match: /Summon a dark spirit to terrify up to [0-9.]+ enemies, causing them to cower in fear for ([0-9.]+) second/i,
	},
	{
		type: "stun",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[1]);
		},
		match: /and stuns enemies for ([0-9.]+) second/i,
	},
	{
		type: "stun",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[1]);
		},
		match: /and stunning them for ([0-9.]+) second/i,
	},
	{
		type: "immobilize",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", matchResult[1]);
		},
		match: /immobilizing them for ([0-9.]+) second/i,
	},
	{
		type: "majorexpedition",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Expedition", skillData.duration/1000);
		},
		match: /granting you and allies in area Major Expedition/i,
	},
	{
		type: "majorexpedition",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Expedition", matchResult[1]);
		},
		match: /gain Major Expedition for ([0-9.]+) second/i,
	},
	{
		type: "majorprotection",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Protection", skillData.duration/1000);
		},
		match: /You and nearby allies gain Major Protection/i,
	},
	{
		type: "majorprotection",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Protection", skillData.duration/1000);
		},
		match: /granting you and your allies Major Protection/i,
	},
	{
		type: "majorsavagery",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Savagery", matchResult[2]);
		},
		match: /grants you Major Savagery increasing your Weapon Critical rating by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		type: "majorsavagery",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Savagery", skillData.duration/1000);
		},
		match: /gain Major Savagery,/i,
	},
	{
		type: "majorprophecy",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Prophecy", skillData.duration/1000);
		},
		match: /you gain Major Prophecy/i,
	},
	{
		type: "minorvulnerability",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Vulnerability (Target)", matchResult[1]);
		},
		match: /afflicting them with Minor Vulnerability for ([0-9.]+) second/i,
	},
	{
		type: "minorvulnerability",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Vulnerability (Target)", skillData.duration/1000);
		},
		match: /afflicting them with Minor Vulnerability for the duration/i,
	},	
	{
		type: "empower",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Empower", matchResult[1]);
		},
		match: /grants you Empower for ([0-9.]+) second/i,
	},
	{
		type: "empower",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Empower", skillData.duration/1000);
		},
		match: /Gain Empower for the duration/i,	//TODO: For the entire duration of skill
	},
	{
		type: "majorevasion",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Evasion", matchResult[1]);
		},
		match: /gain Major Evasion.*for ([0-9.]+) second/i,
	},
	{
		type: "majorevasion",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Evasion", matchResult[1]);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Resolve", matchResult[1]);
		},
		match: /gain Major Evasion and Minor Resolve.*for ([0-9.]+) second/i,
	},
	{
		type: "minorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Resolve", skillData.duration/1000);
		},
		match: /grants Minor Resolve/i,
	},
	{
		type: "minorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Resolve", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Berserk", skillData.duration/1000);
		},
		match: /Also grants Minor Berserk and Minor Resolve/i,
	},
	{
		type: "majormaim",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Main (Target)", skillData.duration/1000);
		},
		match: /afflicting them with Major Maim/i,
	},
	{
		type: "majormaim",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Main (Target)", skillData.duration/1000 + matchResult[2]);
		},
		match: /applies Major Maim, reducing enemy damage done by ([0-9.]+)%\. Major Maim persists on enemies who leave the Nova for ([0-9.]+) second/i,
	},
	{
		type: "majorbreach",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", matchResult[1]);
			EsoBuildCombatAddBuff("skill", skillData, "Major Breach (Target)", matchResult[1]);
		},
		match: /with Major Fracture and Major Breach.*for ([0-9.]+) second/i,
	},
	{
		type: "majorbreach",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Breach (Target)", matchResult[1]);
		},
		match: /afflicted with Major Breach, reducing their Spell Resistance by [0-9.]+ for ([0-9.]+) second/i,
	},
	{
		type: "majorbreach",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Breach (Target)", matchResult[1]);
		},
		match: /afflict them with Major Breach for ([0-9.]+) second/i,
	},
	{
		type: "majorfracture",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", matchResult[1]);
		},
		match: /afflicted with Major Fracture, reducing their Physical Resistance by [0-9.]+ for ([0-9.]+) second/i,
	},
	{
		type: "majorfracture",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", matchResult[1]);
		},
		match: /have Major Fracture applied to them, reducing their Physical Resistance by [0-9.]+ for ([0-9.]+) second/i,
	},
	{
		type: "minorbreach",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Fracture (Target)", matchResult[2]);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Breach (Target)", matchResult[2]);
		},
		match: /Targets are also afflicted with Minor Fracture and Minor Breach, reducing their Physical and Spell Resistance by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		type: "minorfracture",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Fracture (Target)", matchResult[2]);
		},
		match: /afflicts the enemy with Minor Fracture, which reduces their Physical Resistance by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		type: "minorfracture",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Fracture (Target)", matchResult[1]);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[1]);
		},
		match: /applying Major Fracture and Minor Maim, reducing their Physical Resistance by [0-9.]+ and damage done by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		type: "minorintellect",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Intellect", skillData.duration/1000);
		},
		match: /grants Minor Intellect to you/
	},
	{
		type: "minorintellect",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Intellect", matchResult[1]);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Endurance", matchResult[1]);
		},
		match: /gains Minor Intellect and Minor Endurance, increasing their Magicka and Stamina Recovery by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		type: "minorendurance",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Protection", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Minor Endurance", skillData.duration/1000);
		},
		match: /gain Minor Protection and Minor Endurance,/i,
	},
	{
		id: "Frozen Colossus",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, matchResult[1], 1.0, matchResult[2], matchResult[3], false, true, false);		//TODO: Confirm attack types
		},
		match: /The Colossus smashes the ground three times over ([0-9.]+) seconds, dealing ([0-9.]+) ([A-Za-z]+) Damage with each smash/i,
	},
	{
		id: "Frozen Colossus",
		onInitialHit: function(matchResult, skillData) {
			if (!EsoBuildCombatAddNewCooldown(skillData.name, matchResult[2])) return;
			EsoBuildCombatAddBuff("skill", skillData, "Major Vulnerability (Target)", matchResult[1]);
		},
		match: /Dealing damage applies Major Vulnerability to any enemy hit for ([0-9.]+) second.*for ([0-9.]+) seconds./i,
	},
	{
		id: "Glacial Colossus",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[2]);
			}, true);
		},
		match: /three times over ([0-9.]+) seconds, dealing.*stuns all enemies hit for ([0-9.]+) second/
	},
	{
		id: "Skeletal Mage",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, skillData.duration/1000, matchResult[1], matchResult[2], "Shock", false, false, false);		//TODO: Confirm attack types
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				++g_EsoBuildCombatNecroPetDeaths;
			}, true);
		},
		match: /The mage attacks the closest enemy every ([0-9.]+) seconds, dealing ([0-9.]+) Shock Damage\./i,
	},
	{
		id: "Skeletal Archer",
		onInitialHit: function(matchResult, skillData) {
			g_EsoBuildCombatSkeletalArcherAttackCount = 0;
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, skillData.duration/1000, matchResult[1], matchResult[2], "Physical", false, false, false);		//TODO: Confirm attack types
		},
		match: /The archer attacks the closest enemy every ([0-9.]+) seconds, dealing ([0-9.]+) Physical Damage/i,
	},
	{
		id: "Skeletal Archer",
		getDamageMod: function(matchResult, skillData) {
			++g_EsoBuildCombatSkeletalArcherAttackCount;
			return Math.pow((1 - g_EsoBuildCombatSkeletalArcherAttackCount), 1.0 + parseFloat(matchResult[1]));
		},
		match: /Each time the archer deals damage, its next attack will do ([0-9.]+)% more damage than the previous attack/i,
	},
	{
		id: "Skeletal Arcanist",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, skillData.duration/1000, matchResult[1], matchResult[2], "Shock", false, true, false);		//TODO: Confirm attack types
		},
		match: /The mage attacks the closest enemy every ([0-9.]+) seconds, dealing ([0-9.]+) Shock Damage to them and all other enemies/i,
	},
	{
		getDamageMod: function(matchResult, skillData) {
			if (skillData.combat.castCount % 3 == 0) return (1 + parseFloat(matchResult[1]) / 100);
			return 1.0;
		},
		match: /Every third cast of this ability deals ([0-9.]+)% increased damage/i,
	},
	{
		getDamageMod: function(matchResult, skillData) {
			var corpseCounter = EsoBuildCombatGetCounter("Corpse");
			if (corpseCounter) {
				--corpseCounter.value;
				if (corpseCounter.value == 0) EsoBuildCombatRemoveCounter("Corpse");
				return 1 + parseFloat(matchResult[1]) / 100; 
			}
			return 1.0;
		},
		match: /Consumes a corpse on cast to deal ([0-9.]+)% more damage/,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Breach (Target)", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", skillData.duration/1000);
		},
		match: /applying Major Breach and Fracture/i,
	},
	{
		//TODO:?
		onInitialHit: function(matchResult, skillData) {
		},
		match: /You or an ally standing in the graveyard can activate the Grave Robber synergy, dealing 6149 Frost Damage to enemies in the area and healing you for the damage done/,
	},
	{
		//TODO:?
		onInitialHit: function(matchResult, skillData) {
		},
		match: /While slotted, casting any Necromancer ability while you are in combat will count towards the third cast/,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			if (skillData.combat.castCount % 3 == 0) EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", ESOBUILDCOMBAT_OFFBALANCE_DURATION, ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
		},
		match: /Every third cast of this ability will set all enemies hit Off Balance/i,
	},
	{
		id: "Toppling Charge",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", ESOBUILDCOMBAT_OFFBALANCE_DURATION, ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
			EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[1]);
		},
		match: /stunning them for ([0-9.]+) seconds, and setting them Off Balance/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Bone Goliath Transformation", skillData.duration / 1000);
		},
		match: /(Become a horrific Bone Goliath)|(Become a destructive Pummeling Goliath)|(Become a horrific Ravenous Goliath)/i,
	},
	{
		id: "Mystic Siphon",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddRestoreStat("skill", skillData, "Magicka", matchResult[1]/matchResult[2], 1.0, matchResult[2]);
		},
		match: /You also restore ([0-9.]+) Magicka over ([0-9.]+) seconds while siphoning the corpse/i,
	},
	{
		id: "Detonating Siphon",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Disease", false, true, false, false);
			});
		},
		match: /over ([0-9.]+) second[\s\S]+corpse to explode, dealing an additional ([0-9.]+) Disease Damage to all enemies around the corpse/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", matchResult[2]);
			}, true);
		},
		match: /stunning them for ([0-9.]+) second.*and are immobilized for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", skillData.duration/1000);
		},
		match: /Enemies afflicted are immobilized and/i,
	},
	{
		id: "Corrosive Armor",
		getFlatResistMod: function(matchResult, skillData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			if (srcType != "skill" || resistType != "Physical" || isDOT) return 0;
			return -100000;
		},
		match: /While active, this ability and your Direct Damage dealt ignores enemy Physical Resistance/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Sorcery", skillData.duration/1000);
		},
		match: /gain Major Brutality and Sorcery/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", matchResult[1]);
		},
		match: /granting you Major Sorcery, increasing your Spell Damage by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", skillData.duration/1000);
		},
		match: /Focus your strength and resolve to gain Major Brutality/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", matchResult[2]);
		},
		match: /granting you Major Brutality, increasing your Weapon Damage by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Endurance", skillData.duration/1000);
		},
		match: /as well as gaining Minor Endurance/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Molten Armaments", matchResult[1]);
		},
		match: /Your own damage with Heavy Attacks is increased/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Mending", matchResult[1]);
		},
		match: /gain Major Mending, increasing your healing done by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		id: "Inhale",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Flame", false, true, false, false); 
			}, true);
		},
		match: /After ([0-9.]+) seconds, you exhale fire, dealing ([0-9.]+) Flame Damage to nearby enemies/,
	},
	{
		id: "Draw Essence",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", parseInt(skillData.cost) * parseFloat(matchResult[1])/100 * 1);		//TODO: Set number of enemies?
		},
		match: /and restoring ([0-9.]+)% of the ability's cost for each enemy hit as Magicka/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[1]);
		},
		match: /Enemies hit are afflicted with Minor Maim, reducing their damage done by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[1]);
		},
		match: /inflicting Minor Maim for ([0-9.]+) seconds/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[1]);
		},
		match: /afflicting them with Minor Maim, reducing their damage done by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fortitude", matchResult[1]);
		},
		match: /You also gain Major Fortitude, increasing your Health Recovery by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", matchResult[1]);
		},
		match: /patch can immobilize one enemy for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Empower", matchResult[1]);
		},
		match: /grants them Empower for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fortitude", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Endurance", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Vitality", skillData.duration/1000);
		},
		match: /You also gain Major Fortitude, Major Endurance, and Minor Vitality/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Vitality", matchResult[1]);
		},
		match: /also receive Major Vitality, increasing your healing received by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		id: "Restraining Prison",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Vitality", matchResult[2] + matchResult[3]);
		},
		match: /Gain Major Vitality, increasing your healing received by ([0-9.]+)% for ([0-9.]+) seconds plus ([0-9.]+) extra second per enemy/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Protective Scale", matchResult[1]);
		},
		match: /reducing your damage taken from projectiles by [0-9.]+% for ([0-9.]+) second/i
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", matchResult[1]);
		},
		match: /immobilizing them for ([0-9.]+) second/i,
	},
	{
		type: "majorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Rune Focus Standing", skillData.duration/1000)
		},
		match: /Create a rune of celestial protection\. While active, the rune grants you Major Resolve/i,
	},
	{
		type: "majorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", skillData.duration/1000);
		},
		match: /grants Major Resolve/i,
	},
	{
		type: "majorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", skillData.duration/1000);
		},
		match: /granting you Major Resolve/i,
	},
	{
		type: "majorresolve",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", skillData.duration/1000);
		},
		match: /gain Major Resolve/i,
	},
	{
		type: "minorforce",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Force", matchResult[1]);
		},
		match: /Minor Force for ([0-9.]+) second/i,
	},
	{
		type: "Minor Heroism",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Heroism", matchResult[1]);
		},
		match: /You gain Minor Heroism, granting you [0-9.]+ Ultimate every [0-9.]+ seconds for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			//EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", skillData.duration/1000);	//Handled above
			EsoBuildCombatAddBuff("skill", skillData, "Minor Expedition", skillData.duration/1000);
		},
		match: /gain Major Resolve and Minor Expedition/i,
	},	
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Expedition", matchResult[2]);
		},
		match: /Activating this grants Major Expedition for a brief period, increasing your Movement Speed ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration / 1000, function() {
				EsoBuildCombatIncrementCounter("Corpse", ESOBUILDCOMBAT_CORPSE_DURATION);
			}, true);
		},
		match: /Creates a corpse when the effect completes/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration / 1000, function() {
				EsoBuildCombatIncrementCounter("Corpse", ESOBUILDCOMBAT_CORPSE_DURATION);
			}, true);
		},
		match: /Creates a corpse on death/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Summoner's Armor", skillData.duration / 1000);
		},
		match: /While active, reduce the cost of Blastbones, Skeletal Mage, and Spirit Mender by/i,
	},
	{
		id: "Blastbones",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Flame", false, true, false);
				++g_EsoBuildCombatNecroPetDeaths;
			}, true);
		},
		match: /Summon a.*skeleton from the ground after ([0-9]+) second.*dealing ([0-9]+) ([A-Za-z]+) Damage to all enemies/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			var corpseCounter = EsoBuildCombatRemoveCounter("Corpse");
			if (corpseCounter == null) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1] * corpseCounter.value);		//TODO: Is this per corpse?
			EsoBuildCombatAddRestoreStat("skill", skillData, "Health", matchResult[3], matchResult[4] * corpseCounter.value);
			if (matchResult[5]) EsoBuildCombatAddBuff("skill", skillData, "Major Expedition", matchResult[4] * corpseCounter.value);
		},
		match: /Sap the lingering life from fresh corpses, granting you ([0-9.]+) Ultimate and healing ([0-9.]+) Health every ([0-9.]+) second for ([0-9.]+) seconds per corpse consumed.*(you gain Major Protection)/i,
	},
	{
		type: "stun",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[1]);
		},
		match: /stunning them for ([0-9.]+) second/i,
	},
	{
		type: "minorprotection",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Protection", matchResult[1]);
		},
		match: /gives Minor Protection/i,
	},
	{
		type: "minorprotection",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Protection", skillData.duration/1000);
		},
		match: /You gain Minor Protection/i,
	},
	{
		type: "majorexpedition",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Expedition", matchResult[1]);
		},
		match: /Grants Major Expedition, increasing your Movement Speed by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Engulfing Flames", skillData.duration/1000);
		},
		match: /Affected enemies take more damage from all Flame Damage attacks based on your offensive stats/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", skillData.duration / 1000);
		},
		match: /Afflicts enemies with Major Fracture/i,
	},
	{
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", matchResult[1]);
		},
		match: /afflicts the enemy with Major Fracture, reducing their Physical Resistance by [0-9.]+ for ([0-9.]+) second/i
	},
	{
		id: "Standard of Might",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Standard of Might", skillData.duration/1000);
		},
		match: /Standing in the area increases your damage done and reduces damage taken by ([0-9]+)%/i,
	},
	{
		id: "Flurry",
		type: "special",
		isExclusiveAll: true,
		getDotTickDamage: function(matchResult, skillData, tickCount) {
			if (tickCount < 5) return matchResult[tickCount + 1];
			return NaN;
		},
		match: /Hits: ([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+).*\(Total ([0-9]+)\)/i,
	},
	{
		id: "Feral Pounce",
		type: "special",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		match: /Dealing damage with either attack restores ([0-9]+) Stamina/i,
	},
	{
		id: "Feral Pounce",
		type: "special",
		onInitialHit: function(matchResult, skillData) {
			if (!EsoBuildCombatHasStatusEffect("player", "Brutal Pounce")) return;
			EsoBuildCombatEnableSkillToggle("Brutal Pounce", true, 10.0);
		},
		match: /Increases your Weapon Damage by ([0-9]+) for each enemy hit, up to a maximum of ([0-9]+) times/i,
	},
	
	{
		id: "Minor Heroism",
		type: "special",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddRestoreStat("skill", skillData, "Ultimate", matchResult[1], matchResult[2], matchResult[3]);
		},
		match: /You gain Minor Heroism, granting you ([0-9]+) Ultimate every ([0-9\.]+) seconds for ([0-9\.]+) seconds./i,
	},
	{
		type: "special",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Fracture (Target)", skillData.duration/1000);
		},
		match: /Afflicts enemies with Major Fracture, reducing their Physical Resistance by/i,
	},
	{
		id: "Unstable Wall of Fire",
		type: "directdamage",
		isExclusive: true,
		isAOE: true,
		onFinalHit: function(matchResult, skillData) { EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Flame", false, true, false, false); },
		match: /When the effect ends, the barrier explodes, dealing ([0-9]+) Flame Damage/i,
	},
	{
		id: "Radiant Oppression",
		type: "execute",
		isExclusive: true,
		getDamageMod: function(matchResult, skillData) {
			var extraDamage = matchResult[3]/100 * g_EsoBuildCombatState.currentMagicka / g_EsoBuildLastInputValues.Magicka;
			return EsoBuildCombatGetExecuteDamageMod(matchResult[1], matchResult[2], null, extraDamage);
		},
		match: /Deals up to ([0-9.]+)% more damage to enemies below ([0-9.]+)% Health[\s\S]+deals up to ([0-9.]+)% more damage/i,
	},
	{
		id: "Execute",
		type: "execute",
		getDamageMod: function(matchResult, skillData) {
			return EsoBuildCombatGetExecuteDamageMod(matchResult[1], matchResult[2]);
		},
		match: /Deals up to ([0-9.]+)% more damage to enemies under ([0-9.]+)% Health/i,
	},
	{
		id: "Execute",
		type: "execute",
		getDamageMod: function(matchResult, skillData) {
			return EsoBuildCombatGetExecuteDamageMod(matchResult[1], matchResult[2]);
		},
		match: /Deals ([0-9.]+)% more damage to enemies below ([0-9.]+)% Health/i,
	},
	{
		id: "Execute",
		type: "execute",
		getDamageMod: function(matchResult, skillData) {
			return EsoBuildCombatGetExecuteDamageMod(matchResult[1], matchResult[2]);
		},
		match: /Deals up to ([0-9.]+)% more damage to enemies with less than ([0-9.]+)% Health/i,
	},
	{
		type: "special",
		getDamageMod: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Burning")) return 1 + parseFloat(matchResult[1])/100;
			return 1;
		},
		match: /Burning enemies take ([0-9]+)% more damage from this ability/i,
	},
	{
		type: "global",
		onStatusEffectCast: function(matchResult, skillData, statusEffect) {
			if (statusEffect == "Burning") {
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			}
		},
		match: /When you apply Burning to an enemy, you restore ([0-9]+) Magicka/i,
	},
	{
		type: "global",
		onStatusEffectCast: function(matchResult, skillData, statusEffect) {
			if (statusEffect == "Poisoned") {
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
			}
		},
		match: /When you apply Poisoned to an enemy, you restore ([0-9]+) Stamina/i,
	},
	{
		type: "global",
		onSkillLineActive: function() { EsoBuildCombatEnableSkillToggle("Burning Heart", true) },
		onSkillLineInactive: function() { EsoBuildCombatEnableSkillToggle("Burning Heart", false) },
		match: /While a Draconic Power ability is active, your healing received is increased by ([0-9]+)%/i,
	},
	{
		type: "global",
		onUltimateCast: function(matchResult, skillData, ultimateData, ultimateCost) { 
			
			if (cost > 0) {
				EsoBuildCombatRestoreStat("skill", skillData, "Health",  parseInt(matchResult[1]) * ultimateCost);
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", parseInt(matchResult[2]) * ultimateCost);
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", parseInt(matchResult[3]) * ultimateCost);
			}
		},
		match: /When you cast an Ultimate ability, you restore ([0-9]+) Health, ([0-9]+) Magicka, and ([0-9]+) Stamina for each point of the Ultimate's cost/,
	},
	{
		type: "global",
		onSkillLineCast: function(matchResult, skillData, skillDataCast) { 
			EsoBuildCombatAddBuff("skill", skillData, "Minor Brutality", matchResult[1]); 
		},
		match: /When you cast an Earthen Heart ability, you and your group gain Minor Brutality for ([0-9]+) seconds/,
	},
	{
		type: "global",
		onSkillLineCast: function(matchResult, skillData, skillDataCast) { 
			if (!EsoBuildCombatHasCooldown(skillData.abilityId)) {
				EsoBuildCombatRestoreStat("skill", skillData, "Ultimate",  matchResult[1]);
				EsoBuildCombatAddCooldown(skillData.abilityId, matchResult[2]);
			}
		},
		match: /If you are in combat, you also generate ([0-9]+) Ultimate\. This effect can occur once every ([0-9]+) seconds./,
	},
	{
		type: "global",
		onSkillLineCast: function(matchResult, skillData, skillDataCast) {
			if (skillDataCast.mechanic != 6) EsoBuildCombatRestoreStat("skill", skillData, "Stamina",  matchResult[1]);
		},
		match: /When you cast a non Stamina costing Earthen Heart ability, you restore ([0-9]+) Stamina/,
	},
	{
		type: "global",
		onSkillLineDamage: EsoBuildCombatOnBurningLight,
		match: /When you deal damage with an Aedric Spear ability, you have a ([0-9]+)% chance to deal an additional ([0-9]+) Physical Damage or ([0-9]+) Magic Damage, whichever is higher\. This effect can occur once every ([0-9\.]+) seconds./,
	},
	{
		type: "special",
		match: /If you strike an enemy that is immobil.* or stunned, you set them Off Balance/i,
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Immobilized", "Stunned")) {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", ESOBUILDCOMBAT_OFFBALANCE_DURATION, ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
			}
		},
	},
	{
		type: "special",
		match: /and setting concussed enemies Off Balance for ([0-9]+) second/i,
		onDamage: function(matchResult, skillData) {
			if (EsoBuildCombatHasStatusEffect("target", "Concussion")) {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", parseFloat(matchResult[1]), ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
			}
		},
	},
	{
		id: "Searing Strike",
		onInitialHit: function(matchResult, skillData) {
			//EsoBuildCombatAddTargetStatus("skill", skillData, "Burning", skillData.duration/1000);
			EsoBuildCombatCreateStatusEffectFromDamage("skill", skillData, "Flame", false, false, 1.0);
		},
		match: /Enemies hit by the initial hit are afflicted with the Burning status effect/i,
	},
	{
		id: "Venomous Claw",
		getDotTickDamage: function(matchResult, skillData, tickCount) {
			return Math.floor(matchResult[1] * (1 + Math.floor(tickCount/2) * matchResult[3]/100));
		},
		match: /an additional ([0-9.]+) Poison Damage over ([0-9.]+) second[\s\S]+The poison seeps into the target and deals increased damage the longer it lasts, dealing ([0-9.]+)% more damage every ([0-9.]+) second/i,
	},
	{
		id: "Death Stroke",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Death Stroke", matchResult[2]);
		},
		match: /causing them to take ([0-9.]+)% more damage from your attacks for ([0-9.]+) second/i,
	},
	{
		id: "Incapacitating Strike",
		onLightAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatIsSkillSlotted(skillData)) return;
			if (!EsoBuildCombatTargetHasNegativeEffect()) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatIsSkillSlotted(skillData)) return;
			if (!EsoBuildCombatTargetHasNegativeEffect()) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		match: /While slotted you gain Reave, which restores ([0-9.]+) Magicka and Stamina/i,
	},
	{
		id: "Soul Harvest",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Defile (Target)", matchResult[1]);
		},
		match: /for ([0-9.]+) second[\s\S]+Also afflicts the enemy with Major Defile/i,
	},
	{
		id: "Grim Focus",
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Grim Focus")) {		//TODO: Does this reset the counter after firing?
				if (g_EsoBuildCombatGrimFocusCounter >= matchResult[3]) {
					EsoBuildCombatApplyDamage("skill", skillData, matchResult[4], matchResult[5], false, false, false, false);
					g_EsoBuildCombatGrimFocusCounter = 0;
					EsoBuildCombatUpdateSkillToggleCount("Grim Focus", g_EsoBuildCombatGrimFocusCounter);
				}
				return;
			}
			EsoBuildCombatAddToggle("skill", skillData, "Grim Focus", skillData.duration / 1000);
			g_EsoBuildCombatGrimFocusCounter = 0;
			EsoBuildCombatUpdateSkillToggleCount("Grim Focus", g_EsoBuildCombatGrimFocusCounter);
		},
		onLightAttack: function(matchResult, skillData) {
			if (g_EsoBuildCombatGrimFocusCounter < matchResult[3]) {
				++g_EsoBuildCombatGrimFocusCounter;
				EsoBuildCombatUpdateSkillToggleCount("Grim Focus", g_EsoBuildCombatGrimFocusCounter);
			}
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (g_EsoBuildCombatGrimFocusCounter < matchResult[3]) {
				++g_EsoBuildCombatGrimFocusCounter;
				EsoBuildCombatUpdateSkillToggleCount("Grim Focus", g_EsoBuildCombatGrimFocusCounter);
			}
		},
		match: /Focus your senses for ([0-9.]+) seconds, reducing your damage taken by ([0-9.]+)% with every Light or Heavy Attack, up to ([0-9.]+) times[\s\S]+fire a spectral arrow for half cost to deal ([0-9.]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Veiled Strike",			//TODO: Option of where attacking from
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[1]);
			EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", ESOBUILDCOMBAT_OFFBALANCE_DURATION, ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
		},
		match: /Attacking with Veiled Strike from the flank stuns the enemy for ([0-9.]+) seconds and sets them Off Balance/i,
	},
	{
		id: "Surprise Attack",			//TODO: Option of where attacking from?
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Surprise Attack", matchResult[2]);
		},
		match: /shred through a small portion of their armor, reducing their Physical Resistance by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Summon Shade",
		onInitialHit: function(matchResult, skillData) {			//TODO: Confirm tick time
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, matchResult[1], 1.0, matchResult[2], "Magic", false, false, false);
		},
		onPetAttack: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[3]);
		},
		match: /Summon a shade version.*for ([0-9.]+) second[\s\S]+The shade slashes at an enemy, dealing ([0-9.]+) Magic Damage.*for ([0-9.]+) second/i,
	},
	{
		id: "Dark Shade",
		onInitialHit: function(matchResult, skillData) {			//TODO: Confirm tick time and attack chances
			EsoBuildCombatAddPetSimpleDamage2("skill", skillData, skillData.name, matchResult[1], 1.0, 0.75, matchResult[2], "Magic", false, false, false, 0.25, matchResult[3], "Magic", false, true, false);
		},
		onPetAttack: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Minor Maim (Target)", matchResult[4]);
		},
		match: /Summon a shade version.*for ([0-9.]+) second[\s\S]+The shade slashes at an enemy, dealing ([0-9.]+) Magic Damage and.*dealing ([0-9.]+) Magic Damage*for ([0-9.]+) second/i,
	},
	{
		id: "Soul Tether",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Soul Tether") return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", damage/2);
		},
		match: /Ravage nearby enemies' souls with a night rune, dealing ([0-9.]+) Magic Damage, healing for half the damage/i,
	},
	{
		id: "Soul Tether",
		onInitialHit: function(matchResult, skillData) {			//TODO: How does "siphon" work? Damage + Restore?
			EsoBuildCombatAddDot("skill", skillData, matchResult[2], "Magic", 1.0, matchResult[1], false, false, false);
			EsoBuildCombatAddRestoreStat("skill", skillData, "Health", matchResult[2], 1.0, matchResult[1]);
		},
		match: /Ravaged enemies are tethered to you for ([0-9.]+) seconds, and while they remain within [0-9]+. meters, you siphon ([0-9.]+) Health from them every second/i,
	},
	{
		id: "Strife",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Strife") return;
			var healthRestore = Math.floor(damage * (matchResult[2]/100));
			EsoBuildCombatAddRestoreStat("skill", skillData, "Health", healthRestore, matchResult[3], matchResult[4]);
		},
		match: /dealing ([0-9.]+) Magic Damage and healing you or a nearby ally for ([0-9.]+)% of the damage inflicted every ([0-9.]+) seconds for ([0-9.]+) second/i,
	},
	{
		id: "Debilitate",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Minor Magickasteal", skillData.duration/1000);
		},
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasTargetStatus("Minor Magickasteal")) return;
			if (!EsoBuildCombatAddNewCooldown("Minor Magickasteal", matchResult[2])) return;
			EsoBuildCombatRestoreStat("debuff", "Minor Magickasteal", "Magicka", matchResult[1]);
		},
		match: /While this effect persists the enemy is afflicted with Minor Magickasteal, causing you and your allies to restore ([0-9.]+) Magicka every ([0-9.]+) second when damaging them/i,
	},
	{
		id: "Siphoning Strikes",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Siphoning Strikes", matchResult[2]);
		},
		onLightAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Siphoning Strikes")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Siphoning Strikes")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]*2);
		},
		match: /Imbue your weapons with soul-stealing power, causing your Light and Heavy Attacks to heal you for ([0-9.]+) Health for ([0-9.]+) second/i,
	},
	{
		id: "Leeching Strikes",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Leeching Strikes", matchResult[3]);
		},
		onLightAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Leeching Strikes")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Leeching Strikes")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]*2);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]*2);
		},
		match: /Imbue your weapons with soul-stealing power, causing your Light and Heavy Attacks to heal you for ([0-9.]+) Health and restore ([0-9.]+) Stamina for ([0-9.]+) second/i,
	},
	{
		id: "Leeching Strikes",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
			}, true);
		},
		match: /You restore up to ([0-9.]+) additional Stamina when the effect ends, based on the length of time/i,
	},
	{
		id: "Siphoning Attacks",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Siphoning Attacks", matchResult[3]);
		},
		onLightAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Siphoning Attacks")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[2]);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Siphoning Attacks")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[2]);
		},
		match: /Imbue your weapons with soul-stealing power, causing your Light and Heavy Attacks to heal you for ([0-9.]+) Health and restore ([0-9.]+) Magicka for ([0-9.]+) second/i,
	},
	{
		id: "Siphoning Attacks",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			}, true);
		},
		match: /You restore up to ([0-9.]+) additional Magicka when the effect ends, based on the length of time/i,
	},
	{
		id: "Summon Storm Atronach",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, skillData.duration/1000, 1.0, matchResult[1], "Shock", false, false, false);
		},
		match: /The atronach zaps the closest enemy, dealing ([0-9.]+) Shock Damage every ([0-9.]+) second\./i,
	},
	{
		id: "Summon Charged Atronach",
		onInitialHit: function(matchResult, skillData) {		//TODO: Confirm attack chances
			EsoBuildCombatAddPetSimpleDamage2("skill", skillData, skillData.name, skillData.duration/1000, 1.0, 0.75, matchResult[1], "Shock", false, false, false, 0.25, matchResult[3], "Shock", false, true, false);
		},
		match: /The atronach zaps the closest enemy, dealing ([0-9.]+) Shock Damage every ([0-9.]+) second, and periodically deals ([0-9.]+) Shock Damage to enemies around it/i,
	},
	{
		id: "Summon Unstable Familiar",
		onInitialHit: function(matchResult, skillData) {		//TODO: Confirm attack rate
			if (EsoBuildCombatHasPet(skillData.name)) {
				EsoBuildCombatAddDot("skill", skillData, matchResult[2], "Shock", matchResult[3], matchResult[4], true, false, true);
				return;
			}
			EsoBuildCombatAddPetSimpleDamage("skill", skillData, skillData.name, -1, 1.0, matchResult[1], "Shock", false, false, false);
		},
		match: /The familiar's attacks deal ([0-9.]+) Shock Damage[\s\S]+dealing ([0-9.]+) Shock Damage every ([0-9.]+) seconds for ([0-9.]+) seconds to enemies near him/i,
	},
	{
		id: "Summon Unstable Clannfear",
		onInitialHit: function(matchResult, skillData) {		//TODO: Confirm attack rate and chances
			if (EsoBuildCombatHasPet(skillData.name)) {
				return;
			}
			EsoBuildCombatAddPetSimpleDamage2("skill", skillData, skillData.name, -1, 1.0, 0.75, matchResult[1], "Physical", false, false, false, 0.25, matchResult[2], "Physical", false, true, false);
		},
		match: /The clannfear's headbutt deals ([0-9.]+) Physical Damage, while its tail spike hits nearby enemies for ([0-9.]+) Physical Damage after ([0-9.]+) second/
	},
	{
		id: "Summon Unstable Familiar",
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasPet(skillData.name)) {
				EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
					EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[2]);
				}, true);
				return;
			}
		},
		match: /for ([0-9.]+) seconds to enemies near him.*The final pulse will stun all enemies hit for ([0-9.]+) second/i,
	},
	{
		id: "Daedric Curse",
		onInitialHit: function(matchResult, skillData) {
			if (!EsoBuildCombatAddNewCooldown(skillData.name, skillData.duration/1000)) return;
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Magic", false, true, false, false);
			}, true);
		},
		match: /and ([0-9.]+) Magic Damage to all other nearby enemies after ([0-9.]+) seconds\./i,
	},
	{
		id: "Daedric Prey",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Daedric Prey", skillData.duration/1000);
		},
		match: /While the curse is active, your pets deal an additional ([0-9.]+)% damage to the target/i,
	},
	{
		id: "Haunting Curse",
		onInitialHit: function(matchResult, skillData) {
			if (!EsoBuildCombatAddNewCooldown(skillData.name, skillData.duration/1000)) return;
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Magic", false, true, false, false);
			}, true);
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[5], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[3], "Magic", false, true, false, false);
			}, true);
		},
		match: /and ([0-9.]+) Magic Damage to all other nearby enemies after ([0-9.]+) second[\s\S]+explode a second time, dealing ([0-9.]+) Magic Damage to the target and ([0-9.]+) Magic Damage to all other nearby enemies after an additional ([0-9.]+) second/i,
	},
	{
		id: "Summon Twilight Tormentor",
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasPet(skillData.name) && g_EsoBuildCombatState.targetPctHealth > matchResult[2]) {
				EsoBuildCombatAddToggle("skill", skillData, "Summon Twilight Tormentor", skillData.duration/1000);
			}
		},
		match: /causing it to deal ([0-9.]+)% more damage to enemies above ([0-9.]+)% Health for ([0-9.]+) second/i,
	},
	{
		id: "Summon Winged Twilight",
		onInitialHit: function(matchResult, skillData) {		//TODO: Confirm attack type/chances
			if (EsoBuildCombatHasPet(skillData.name)) {
				return;
			}
			EsoBuildCombatAddPetSimpleDamage2("skill", skillData, skillData.name, -1, 1.0, 0.75, matchResult[1], "Shock", false, false, false, 0.25, matchResult[2], "Shock", false, false, false);
		},
		match: /zaps deal ([0-9.]+) Shock Damage and its kicks deal ([0-9.]+) Shock Damage/i,
	},
	{
		id: "Bound Armor",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Bound Armor", skillData.duration/1000);
		},
		match: /creating a suit of Daedric mail that increases your block mitigation by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Bound Armaments",
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasPlayerStatus("Bound Armaments")) {
				var counter = EsoBuildCombatRemoveCounter("Bound Armaments");
				if (counter && counter.value) EsoBuildCombatAddDot("skill", skillData, matchResult[3], "Physical", matchResult[4], matchResult[4]*counter.value, false, false, false);
				return;
			}
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Bound Armaments", skillData.duration/1000);
		},
		onLightAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Bound Armaments")) return;
			EsoBuildCombatIncrementCounter("Bound Armaments", -1, matchResult[2]);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (!EsoBuildCombatHasPlayerStatus("Bound Armaments")) return;
			EsoBuildCombatIncrementCounter("Bound Armaments", -1, matchResult[2]);
		},
		match: /to summon a Bound weapon for ([0-9.]+) seconds, up to ([0-9.]+) times[\s\S]+causing them to strike your target for ([0-9.]+) Physical Damage every ([0-9.]+) second/i,
	},
	{
		id: "Crystal Fragments",
		onAnySkillCast: function(matchResult, skillData, castSkillData) {
			if (castSkillData.mechanic != 0) return;
			if (!EsoBuildCombatIsSkillSlotted(skillData)) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "skill", skillData)) return;
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Crystal Fragments", -1);
		},
		getDamageMod: function(matchResult, skillData) {
			if (EsoBuildCombatHasPlayerStatus("Crystal Fragments")) {
				EsoBuildCombatRemovePlayerStatus("Crystal Fragments")
				return 1 + matchResult[2]/100;
			}
			return 1.0;
		},
		match: /Casting any other Magicka ability has a ([0-9.]+)% chance of causing your next Crystal Fragments to be instant, deal ([0-9.]+)% more damage, and cost ([0-9.]+)% less Magicka/,
	},
	{
		id: "Encase",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", skillData.duration/1000);
		},
		match: /Call forth Daedric shards from the earth to immobilize enemies in front of you/i,
	},
	{
		id: "Shattering Prison",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				EsoBuildCombatApplyDamage("skill", skillData,  matchResult[1], "Magic", false, false, false, false);
			}, true);
		},
		match: /The shards deal ([0-9.]+) Magic Damage when the effect ends/i,
	},
	{
		id: "Dark Exchange",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[2]);
			EsoBuildCombatAddRestoreStat("skill", skillData, "Magicka", matchResult[3]/matchResult[4], 1.0, matchResult[4]);
		},
		match: /Bargain with darkness to restore ([0-9.]+) Health and ([0-9.]+) Magicka instantly, and an additional ([0-9.]+) Magicka over ([0-9.]+) second/i,
	},
	{
		id: "Dark Deal",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]);
			EsoBuildCombatAddRestoreStat("skill", skillData, "Stamina", matchResult[3]/matchResult[4], 1.0, matchResult[4]);
		},
		match: /Bargain with darkness to restore ([0-9.]+) Health and ([0-9.]+) Stamina instantly, and an additional ([0-9.]+) Stamina over ([0-9.]+) second/i,
	},
	{
		id: "Daedric Mines",
		onInitialHit: function(matchResult, skillData) {		//TODO: Better parsing, more flexibility? set detonation time?
			EsoBuildCombatAddDot("skill", skillData, matchResult[4], "Magic", matchResult[3]/matchResult[1], matchResult[3], true, false, false);
		},
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Daedric Mines") return;
			EsoBuildCombatAddTargetStatus("skill", skillData, "Immobilized", matchResult[5]);
		},
		match: /placing ([0-9.]+) volatile Daedric mines around you, which take ([0-9.]+) seconds to arm and last for ([0-9.]+) second[\s\S]+dealing ([0-9.]+) Magic Damage and immobilizing the enemy for ([0-9.]+) second/i,
	},
	{
		id: "Mages' Fury",
		onInitialHit: function(matchResult, skillData) {
			if (g_EsoBuildCombatState.targetPctHealth <= matchResult[1]) {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[3], "Shock", false, false, false, false);
			}
		},
		match: /If the enemy falls to or below ([0-9.]+)% Health within ([0-9.]+) seconds of being struck, an explosion deals an additional ([0-9.]+) Shock Damage to them and ([0-9.]+) Shock Damage to other enemies nearby/i,
	},
	{
		id: "Hurricane",
		getDotTickDamage: function(matchResult, skillData, tickCount) {
			var damage = matchResult[2] * (1 + tickCount * matchResult[5]/100 / matchResult[4] * matchResult[3]); 
			return Math.floor(damage);
		},
		match: /buffeting nearby enemies with wind dealing ([0-9]+) ([A-Za-z]+) Damage every ([0-9]+) second for ([0-9]+) second.*increasing up to ([0-9]+)% more damage/i,
	},
	{
		id: "Surge",
		onCrit: function(matchResult, skillData) {
			if (!EsoBuildCombatAddNewCooldown("Surge", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
		},
		match: /While active, dealing Critical Damage heals you for ([0-9]+) Health.*every ([0-9]+) second/i,
	},
	{
		id: "Crescent Sweep",
		getDamageMod: function(matchResult, skillData) {
			return 1 + matchResult[1]/100;
		},
		match: /Enemies in your path will be hit for ([0-9]+)% more damage/i,
	},
	{
		id: "Piercing Javelin",
		getSkillResistMod: function(matchResult, skillData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			return -100000;
		},
		match: /This attack ignores the enemy's Resistances/i,
	},
	{
		id: "Aurora Javelin",
		getDamageMod: function(matchResult, skillData) {
			return 1 + matchResult[1]/100 * ESOBUILDCOMBAT_MAXMELEE_RANGE/100;
		},
		match: /You deal ([0-9]+)% additional damage with the spear for every ([0-9]+) meter you are away from the target, up to a maximum of ([0-9]+)%/i,
	},
	{
		id: "Restoring Aura",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Minor Magickasteal", skillData.duration/1000);
		},
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasTargetStatus("Minor Magickasteal")) return;
			if (!EsoBuildCombatAddNewCooldown("Minor Magickasteal", matchResult[2])) return;
			EsoBuildCombatRestoreStat("debuff", "Minor Magickasteal", "Magicka", matchResult[1]);
		},
		match: /apply Minor Magickasteal to all enemies around you for [0-9]+ seconds, causing you and your allies to restore ([0-9.]+) Magicka every ([0-9.]+) second when damaging them/i,
	},
	{
		id: "Channeled Focus",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddRestoreStat("skill", skillData, "Magicka", matchResult[1], matchResult[2], skillData.duration/1000);
		},
		match: /You also recover ([0-9]+) Magicka every ([0-9.]+) second/i,
	},
	{
		id: "Scorch",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], matchResult[3], false, true, false, false);
			}, true);
		},
		match: /Stir a group of shalk that attack after ([0-9]+) seconds, dealing ([0-9]+) ([A-Za-z]+) Damage to enemies in front of you./i,
	},
	{
		id: "Fetcher Infection",
		getDamageMod: function(matchResult, skillData) {
			if (skillData.combat.castCount % 2 == 0) {
				return 1 + matchResult[1]/100;
			}
			return 1;
		},
		match: /Every second cast of this ability deals ([0-9]+)% increased damage/i,
	},
	{
		id: "Betty Netch",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPet("skill", skillData, skillData.name, skillData.duration/1000)
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Sorcery", skillData.duration/1000);
		},
		match: /netch to your side, which grants you Major Brutality and Sorcery/i,
	},
	{
		id: "Blue Betty",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleRestore("skill", skillData, skillData.name, matchResult[2], 1.0, "Magicka", matchResult[1]/matchResult[2]);
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Sorcery", skillData.duration/1000);
		},
		match: /netch to your side, which restores ([0-9]+) Magicka to you over ([0-9.]+) seconds and grants you Major Brutality and Sorcery/i,
	},
	{
		id: "Bull Netch",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleRestore("skill", skillData, skillData.name, matchResult[2], 1.0, "Stamina", matchResult[1]/matchResult[2]);
			EsoBuildCombatAddBuff("skill", skillData, "Major Brutality", skillData.duration/1000);
			EsoBuildCombatAddBuff("skill", skillData, "Major Sorcery", skillData.duration/1000);
		},
		match: /netch to your side, which restores ([0-9]+) Stamina to you over ([0-9.]+) seconds and grants you Major Brutality and Sorcery/i,
	},
	{
		id: "Northern Storm",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Northern Storm", matchResult[1]);
		},
		match: /Twist a violent storm around you.*and increasing your Max Magicka by [0-9.]+% for ([0-9.]+) second/i,
	},
	{
		type: "chilled",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Chilled", skillData.duration/1000);
		},
		match: /and applying the Chilled status effect/i,
	},
	{
		id: "Berserker Strike",
		getSkillResistMod: function(matchResult, skillData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			//TODO: Buff player resist?
			return -100000;
		},
		match: /This attack ignores the target's Physical Resistance, and grants you Physical and Spell Resistance equal to the amount ignored from the initial target for ([0-9.]+) second/i,
	},
	{
		id: "Onslaught",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Onslaught", matchResult[2]);
		},
		getSkillResistMod: function(matchResult, skillData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			g_EsoBuildCombatOnslaughtResist = Math.floor(resist * matchResult[1]/100);
			return -100000;
		},
		getFlatResistMod: function(matchResult, setData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			if (isDOT || !EsoBuildCombatHasPlayerStatus("Onslaught")) return 0;
			return -g_EsoBuildCombatOnslaughtResist;
		},
		match: /This attack ignores the target's Resistance and grants you Physical and Spell Penetration for your Direct Damage attacks equal to ([0-9.]+)% of the amount ignored from the initial target for ([0-9.]+) second/i,
	},
	{
		id: "Dizzying Swing",
		onInitialHit: function(matchResult, skillData) {
			if (EsoBuildCombatHasTargetStatus("Off Balance")) {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Stunned", matchResult[2]);
			} else {
				EsoBuildCombatAddTargetStatus("skill", skillData, "Off Balance", matchResult[1], ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
			}
		},
		match: /and setting them Off Balance for ([0-9.]+) second[\s\S]+Hitting an enemy that is already Off Balance stuns them for ([0-9.]+) second/i,
	},
	{
		id: "Critical Charge",
		getCritChanceMod: function(matchResult, skillData) {
			if (skillData.baseName != "Critical Charge") return 0;
			return 1;
		},
		match: /This attack is always a Critical Strike/i,
	},
	{
		id: "Taunt",
		onInitialHit: function(matchResult, skillData) {	//TODO: Cooldown?
			EsoBuildCombatAddTargetStatus("skill", skillData, "Taunted", matchResult[1]);
		},
		match: /and taunting them to attack you for ([0-9.]+) second/i,
	},
	{
		id: "Reverberating Bash",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Physical", false, false, false, false);
			}, true);
		},
		match: /stunning them for ([0-9.]+) second[\s\S]+After the stun ends, the enemy takes an additional ([0-9.]+) Physical Damage/i,
	},
	{
		id: "Lacerate",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Lacerate") return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[3]/100*damage);
		},
		match: /Slash enemies in front of you, causing them to bleed for ([0-9.]+) Physical Damage over ([0-9.]+) seconds and healing you for ([0-9.]+)% of the damage done/i,
	},
	{
		id: "Thrive in Chaos",
		getDamageMod: function(matchResult, skillData) {
			return 1 + matchResult[1]/100;
		},
		match: /Each enemy hit increases your damage done by ([0-9.]+)% for the duration/i,
	},
	{
		id: "Twin Slashes",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Physical", false, false, false, false);
			EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Physical", false, false, false, false);
		},
		match: /dealing ([0-9.]+) Physical Damage with each weapon/i,
	},
	{
		id: "Toxic Barrage",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.channelTime/1000, function() {
				EsoBuildCombatAddDot("set", setData, matchResult[1]/matchResult[2], "Poison", 1,0, matchResult[2], false, false, false);
			}, true);
		},
		match: /After the barrage ends you poison the enemy, dealing an additional ([0-9.]+) Poison Damage over ([0-9.]+) second/i,
	},
	{
		id: "Elemental Storm",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatAddDot("skill", skillData, matchResult[2], matchResult[3], matchResult[4], skillData.duration/1000, true, false, false);
			}, true);
		},
		match: /Create a cataclysmic storm at the target location.* ([0-9.]+) seconds then lays waste to all enemies in the area, dealing ([0-9.]+) ([A-Za-z]+) Damage every ([0-9.]+) second(?:s|) for ([0-9.]+) second/i,
	},
	{
		id: "Force Shock",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], "Flame", false, false, false, false);
			EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Frost", false, false, false, false);
			EsoBuildCombatApplyDamage("skill", skillData, matchResult[3], "Shock", false, false, false, false);
		},
		match: /for ([0-9.]+) Flame Damage, ([0-9.]+) Frost Damage, and ([0-9.]+) Shock Damage/i,
	},
	{
		id: "Unstable Wall of Elements",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], matchResult[2],false, true, false, false);
			}, true);
		},
		match: /before exploding for an additional ([0-9.]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Unstable Wall of Elements",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], matchResult[2],false, true, false, false);
			}, true);
		},
		match: /the barrier explodes, dealing ([0-9.]+) ([A-Za-z]+) Damage/i,
	},
	{
		id: "Wall of Fire",
		getDamageMod: function(matchResult, skillData) {
			if (EsoBuildCombatHasTargetStatus("Burning")) return 1 + matchResult[1]/100;
			return 1;
		},
		match: /Burning enemies take ([0-9.]+)% more damage from this ability/i,
	},
	{
		id: "Elemental Susceptibility",
		onAnyDamage: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Breach (Target)", matchResult[1]);
		},
		match: /with Major Breach for ([0-9.]+) seconds[\s\S]+Any damage you deal to the enemy refreshes this effect to its maximum duration/i,
	},
	{
		id: "Elemental Drain",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Minor Magickasteal", matchResult[1]);
		},
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasTargetStatus("Minor Magickasteal")) return;
			if (!EsoBuildCombatAddNewCooldown("Minor Magickasteal", matchResult[3])) return;
			EsoBuildCombatRestoreStat("debuff", "Minor Magickasteal", "Magicka", matchResult[2]);
		},
		match: /applies Minor Magickasteal to the enemy for ([0-9.]+) seconds, causing you and your allies to restore ([0-9.]+) Magicka every ([0-9.]+) second/i,
	},
	{
		id: "Light's Champion",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Major Force", matchResult[1]);
		},
		match: /Any friendly target you heal gains Major Force for ([0-9.]+) second/i,
	},
	{
		id: "Life Giver",
		onInitialHit: function(matchResult, skillData) {
			var blessing = g_EsoSkillActiveData[41151];
			if (blessing == null) blessing = g_SkillsData[41151];
			if (blessing == null) return;
			var desc = GetEsoSkillDescription(blessing.abilityId, null, false, true, false);
			if (desc.match(/Minor Resolve/i)) EsoBuildCombatAddBuff("skill", skillData, "Minor Resolve", blessing.duration/1000);
			if (desc.match(/Minor Berserk/i)) EsoBuildCombatAddBuff("skill", skillData, "Minor Berserk", blessing.duration/1000);
		},
		match: /When you activate this ability you automatically cast Regeneration, Blessing of Protection, and Steadfast Ward at no cost/i,
	},
	{
		id: "Siphon Spirit",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddTargetStatus("skill", skillData, "Minor Magickasteal", skillData.duration/1000);
		},
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasTargetStatus("Minor Magickasteal")) return;
			if (!EsoBuildCombatAddNewCooldown("Minor Magickasteal", matchResult[2])) return;
			EsoBuildCombatRestoreStat("debuff", "Minor Magickasteal", "Magicka", matchResult[1]);
		},
		match: /applies Minor Magickasteal to the enemy for [0-9]+ seconds, causing you and your allies to restore ([0-9.]+) Magicka every ([0-9.]+) second when damaging them/i,
	},
	{
		id: "Blood Scion",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Blood Scion", skillData.duration/1000);
		},
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasToggle("skill", "Blood Scion")) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", damage*matchResult[2]/100);
		},
		match: /While transformed, your Max Health, Magicka, and Stamina is increased by ([0-9.]+), you heal for ([0-9.]+)% of all damage you deal/i,
	},
	{
		id: "Eviscerate",
		getDamageMod: function(matchResult, skillData) {
			var pctHealth = g_EsoBuildCombat.currentHealth / g_EsoBuildLastInputValues.Health * 100;
			return 1 + (100 - pctHealth)/100 * matchResult[1] / 100;
		},
		match: /Deals up to ([0-9.]+)% more damage based on your missing Health/i,
	},
	{
		id: "Arterial Burst",
		getCritChanceMod: function(matchResult, skillData) {
			if (skillData.name != "Arterial Burst") return 0;
			var pctHealth = g_EsoBuildCombat.currentHealth / g_EsoBuildLastInputValues.Health * 100;
			if (pctHealth < matchResult[1]) return 1;
			return 0;
		},
		match: /If you use this ability while you are under ([0-9.]+)% Health, it will always be a Critical Strike/i,
	},
	{
		id: "Blood Frenzy",
		onInitialHit: function(matchResult, skillData) {
			g_EsoBuildCombatBloodFrenzyTickCount = 0;
			g_EsoBuildCombatBloodFrenzyTotalCost = 0;
			EsoBuildCombatAddToggle("skill", skillData, "Blood Frenzy", -1);
		},
		onFinalHit: function(matchResult, skillData) {
			EsoBuildCombatRemoveToggle("skill", "Blood Frenzy");
		},
		getCostMod: function(matchResult, setData, skillCastData, cost) {
			if (skillCastData.baseName != "Blood Frenzy") return 1.0;
			++g_EsoBuildCombatBloodFrenzyTickCount;
			g_EsoBuildCombatBloodFrenzyTotalCost += costt
			return 1.0 + (g_EsoBuildCombatBloodFrenzyTickCount - 1)*matchResult[2]/100;
		},
		match: /Allow your monstrous appetites to take hold, increasing your Weapon and Spell Damage by[\s\S]+the Health cost of this ability increases by ([0-9.]+)% every second/i,
	},
	{
		id: "Simmering Frenzy",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatUpdateSkillToggleCount("Simmering Frenzy", 0);
			EsoBuildCombatAddToggle("skill", skillData, "Simmering Frenzy", -1);
		},
		onFinalHit: function(matchResult, skillData) {
			EsoBuildCombatRemoveToggle("skill", "Simmering Frenzy");
		},
		getCostMod: function(matchResult, setData, skillCastData, cost) {
			EsoBuildCombatUpdateSkillToggleCount("Simmering Frenzy", g_EsoBuildCombatBloodFrenzyTickCount - 1);
			return 1.0;
		},
		match: /the Health cost of this ability increases by ([0-9.]+)% and Weapon and Spell Damage bonus increases by ([0-9.]+)% every second/i,
	},
	{
		id: "Sated Fury",
		onFinalHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", g_EsoBuildCombatBloodFrenzyTotalCost * matchResult[1]/100);
		},
		match: /When you toggle this ability off, you heal for ([0-9.]+)% of the total Health cost you spent while it was toggled on/i,
	},
	{
		id: "Vampiric Drain",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddDot("skill", skillData, matchResult[1], "Magic", matchResult[3], matchResult[4], false, false, false);
		},
		onDamage: function(matchResult, skillData) {
			var missingHealth = g_EsoBuildLastInputValues.Health - g_EsoBuildCombatState.currentHealth;
			if (missingHealth > 0) EsoBuildCombatRestoreStat("skill", skillData, "Health", missingHealth * matchResult[2]/100);
		},
		match: /Siphon away your enemies' vitality, dealing ([0-9.]+) Magic Damage and healing you for ([0-9.]+)% of your missing Health.*every ([0-9.]+) second(?:s|) for ([0-9.]+) second/i,
	},
	{
		id: "Drain Vigor",
		onDamage: function(matchResult, skillData, damage, damageType) {
			var missingStamina = g_EsoBuildLastInputValues.Stamina - g_EsoBuildCombatState.currentStamina;
			if (missingStamina > 0) EsoBuildCombatRestoreStat("skill", skillData, "Stamina", missingStamina * matchResult[1]/100);
		},
		match: /restoring ([0-9.]+)% of your missing Stamina every ([0-9.]+) second(?:s|) for ([0-9.]+) second/i,
	},
	{
		id: "Exhilarating Drain",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddRestoreStat("skill", skillData, "Ultimate", matchResult[1], matchResult[2], matchResult[3]);
		},
		match: /and generating ([0-9.]+) Ultimate every ([0-9.]+) second(?:s|) for ([0-9.]+) second/i,
	},
	{
		id: "Blood Mist",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddDot("skill", skillData, matchResult[1], "Magic", matchResult[2], -1, true, false, false);
		},
		onFinalHit: function(matchResult, skillData) {
			EsoBuildCombatRemoveDot("skill", skillData);
		},
		onDamage: function(matchResult, skillData, damage, damageType) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", damage);
		},
		match: /While in this form you deal ([0-9.]+) Magic Damage every ([0-9.]+) second to enemies around you and heal for the damage caused/i,
	},
	{
		id: "Soul Trap",
		onInitialHit: function(matchResult, skillData) {
			if (matchResult[1] > matchResult[2])
				EsoBuildCombatAddDot("skill", skillData, matchResult[1]/matchResult[3], "Magic", 1.0, matchResult[3], false, false, false);
			else
				EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], false, false, false);
		},
		match: /dealing ([0-9.]+) Magic Damage or ([0-9.]+) Physical Damage over ([0-9.]+) seconds./i,
	},
	{
		id: "Soul Splitting Trap",
		onInitialHit: function(matchResult, skillData) {
			if (matchResult[1] > matchResult[2])
				EsoBuildCombatAddDot("skill", skillData, matchResult[1]/matchResult[3], "Magic", 1.0, matchResult[3], true, false, false);
			else
				EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], true, false, false);
		},
		match: /dealing ([0-9.]+) Magic Damage or ([0-9.]+) Physical Damage to the target and any other nearby enemies over ([0-9.]+) second/i,
	},
	{
		id: "Hircine's Bounty",
		onInitialHit: function(matchResult, skillData) {
			if (g_EsoBuildCombatState.currentHealth >= g_EsoBuildLastInputValues.Health)
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]);
			else
				EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
		},
		match: /healing you for ([0-9.]+) Health.*you are at full Health you instead restore ([0-9.]+) Stamina\./i,
	},
	{
		id: "Hircine's Rage",
		onInitialHit: function(matchResult, skillData) {
			if (g_EsoBuildCombatState.currentHealth >= g_EsoBuildLastInputValues.Health) {
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]);
				EsoBuildCombatAddBuff("skill", skillData, "Major Berserk", matchResult[4]);
			}
			else {
				EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			}
		},
		match: /healing you for ([0-9.]+) Health.*full Health you instead restore ([0-9.]+) Stamina and gain Major Berserk, increasing your damage done by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Hircine's Fortitude",
		onInitialHit: function(matchResult, skillData) {
			var amtHealed = g_EsoBuildLastInputValues.Health - g_EsoBuildCombatState.currentHealth;
			if (amtHealed > 0) {
				EsoBuildCombatRestoreStat("skill", skillData, "Health", amtHealed);
				EsoBuildCombatUpdateSkillToggleCount("Hircine's Fortitude", amtHealed * matchResult[2]/100);
				EsoBuildCombatAddToggle("skill", skillData, "Hircine's Fortitude", matchResult[3]);
			}
		},
		match: /healing you for ([0-9.]+) Health and increasing your Health and Stamina Recovery by ([0-9.]+)% of the healing caused for ([0-9.]+) seconds, up to a maximum of ([0-9.]+).*full Health you instead restore ([0-9.]+) Stamina/i,
	},
	{
		id: "Ferocious Roar",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Ferocious Roar", matchResult[2]);
		},
		match: /Your Heavy Attacks also are ([0-9.]+)% faster for ([0-9.]+) seconds after casting/i,
	},
	{
		id: "Piercing Howl",
		getDamageMod: function(matchResult, skillData) {		//TODO: Option to have facing or not
			return 1.0 + matchResult[1]/100;
		},
		match: /Enemies who are facing you take ([0-9.]+)% more damage from this attack/i,
	},
	{
		id: "Howl of Agony",
		getDamageMod: function(matchResult, skillData) {		//TODO: Option to have facing or not
			return 1.0 + matchResult[1]/100;
		},
		match: /Enemies who are feared or facing you take ([0-9.]+)% more damage from this attack/i,
	},
	{
		id: "Infectious Claws",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatCreateStatusEffectFromDamage("skill", skillData, "Disease", false, false, 1.0);
		},
		match: /Enemies hit by the initial hit are afflicted with the Diseased status effect/i,
	},
	{
		id: "Flawless Dawnbreaker",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Flawless Dawnbreaker", matchResult[1]);
		},
		match: /After activating, your Weapon Damage is increased by [0-9.]+ for ([0-9.]+) second/i,
	},
	{
		id: "Evil Hunter",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Evil Hunter", skillData.duration/1000);
		},
		getAllDamageMod: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet) {
			if (srcType != "skill" || srcType.skillLine != "Fighters Guild" || srcType.mechanic != 6) return 1.0;
			if (!EsoBuildCombatHasPlayerStatus("Evil Hunter")) return 1.0;
			return 1.0 + matchResult[1]/100;
		},
		match: /increases the damage of your Stamina costing Fighters Guild abilities by ([0-9.]+)%/i,
	},
	{
		id: "Camouflaged Hunter",
		onCrit: function(matchResult, skillData) {
			if (!EsoBuildCombatIsSkillSlotted(skillData)) return;
			EsoBuildCombatAddBuff("skill", skillData, "Minor Berserk", matchResult[1]);
		},
		match: /You also gain Minor Berserk for ([0-9.]+) seconds/i,
	},
	{
		id: "Trap Beast",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[3], "Physical", false, false, false, false);
				EsoBuildCombatAddDot("skill", skillData, matchResult[4]/matchResult[5], "Physical", 1.0, matchResult[5], false, false, false);
				EsoBuildCombatAddBuff("skill", skillData, "Minor Force", matchResult[5]);
			}, true);
		},
		match: /Set a sharpened blade trap at your location, which takes ([0-9.]+) seconds to arm and lasts for ([0-9.]+) minute[\s\S]+deals ([0-9.]+) Physical Damage, an additional ([0-9.]+) Physical Damage over ([0-9.]+) second/i,
	},
	{
		id: "Shooting Star",
		onInitialHit: function(matchResult, skillData) {		//TODO: Set number of enemies hit?
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /You generate ([0-9.]+) Ultimate for each enemy hit by the initial blast/i,
	},
	{
		id: "Fire Fune",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Flame", false, true, false, false);
			}, true);
		},
		match: /which takes ([0-9.]+) seconds to arm [\s\S]+the rune blasts all enemies in the target area for ([0-9.]+) Flame Damage/i,
	},
	{
		id: "Equilibrium",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			EsoBuildCombatAddToggle("skill", skillData, "Equilibrium", matchResult[3]);
		},
		match: /sacrificing your Health in exchange for ([0-9.]+) Magicka[\s\S]+healing done and damage shield strength by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Spell Symmetry",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Equilibrium", matchResult[3]);
		},
		match: /After the exchange is complete, the cost of your next Magicka ability is reduced by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Undo",
		onInitialHit: function(matchResult, skillData) {
			var undoTime = g_EsoBuildCombatState.currentTime - matchResult[1];
			var statHistory = g_EsoBuildCombatState.statHistory[undoTime];
			if (undoTime) {
				g_EsoBuildCombatState.currentHealth = statHistory.Health;
				g_EsoBuildCombatState.currentMagicka = statHistory.Magicka;
				g_EsoBuildCombatState.currentStamina = statHistory.Stamina;
				
				if (g_EsoBuildCombatState.currentHealth  >  g_EsoBuildLastInputValues.Health) g_EsoBuildCombatState.currentHealth  = g_EsoBuildLastInputValues.Health;
				if (g_EsoBuildCombatState.currentMagicka > g_EsoBuildLastInputValues.Magicka) g_EsoBuildCombatState.currentMagicka = g_EsoBuildLastInputValues.Magicka;
				if (g_EsoBuildCombatState.currentStamina > g_EsoBuildLastInputValues.Stamina) g_EsoBuildCombatState.currentStamina = g_EsoBuildLastInputValues.Stamina;
				
				EsoBuildCombatLog("Reset stats to " + g_EsoBuildLastInputValues.Health + " Health, " + g_EsoBuildLastInputValues.Magicka + " Magicka, and " + g_EsoBuildLastInputValues.Stamina + " Stamina!");
			}
			else {
				EsoBuildCombatLog("Error: No stat history available for time " + undoTime + "!");
			}
		},
		match: /Step backwards in time, resetting your Health, Magicka, Stamina, and position to what they were ([0-9.]+) seconds ago/i,
	},
	{
		id: "Imbue Weapon",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Imbue Weapon", matchResult[1]);
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				if (!EsoBuildCombatHasPlayerStatus("Imbue Weapon")) return;
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[3]);
			}, true);
		},
		onLightAttack: function(matchResult, setData, srcType, srcData) {
			if (!EsoBuildCombatHasPlayerStatus("Imbue Weapon")) return;
			EsoBuildCombatApplyDamage("skill", skillData, matchData[2], "Physical", false, false, false, false);
			EsoBuildCombatRemovePlayerStatus("Imbue Weapon");
		},
		match: /next Light Attack used within ([0-9.]+) seconds to deal an additional ([0-9.]+) Physical Damage[\s\S]+you restore ([0-9.]+) Stamina/i,
	},
	{
		id: "Elemental Weapon",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPlayerStatus("skill", skillData, "Elemental Weapon", matchResult[1]);
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				if (!EsoBuildCombatHasPlayerStatus("Elemental Weapon")) return;
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[3]);
			}, true);
		},
		onLightAttack: function(matchResult, setData, srcType, srcData) {
			if (!EsoBuildCombatHasPlayerStatus("Elemental Weapon")) return;
			EsoBuildCombatApplyDamage("skill", skillData, matchData[2], "Magic", false, false, false, false);
			var elements = ["Flame", "Shock", "Frost"];
			EsoBuildCombatCreateStatusEffectFromDamage("skill", skillData, elements[Math.floor(Math.random()*elements.length)], false, false, 1.0);
			
			EsoBuildCombatRemovePlayerStatus("Elemental Weapon");
		},
		match: /next Light Attack used within ([0-9.]+) seconds to deal an additional ([0-9.]+) Magic Damage[\s\S]+you restore ([0-9.]+) Magicka./i,
	},
	{
		id: "Crushing Weapon",
		onDamage: function(matchResult, skillData, damage, damageType) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", damage*matchResult[1]/100);
		},
		match: /and heal you for ([0-9.]+)% of the damage done/i,
	},
	{
		id: "Mend Wounds",
		onInitialHit: function(matchResult, skillData) {				//TODO: Better options for Enabling/disabling
			if (EsoBuildCombatHasToggle("skill", "Mend Wounds")) {
				EsoBuildCombatRemoveToggle("skill", "Mend Wounds");
				return;
			}
			EsoBuildCombatAddToggle("skill", skillData, "Mend Wounds", -1);
		},
		onLightAttack: function (matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Mend Wounds")) {
				EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			}
		},
		onHeavyAttack: function (matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Mend Wounds")) {
				EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[2]);		//TODO: Cooldown?
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[4]);
			}
		},
		match: /Your Light Attacks heal for ([0-9.]+)[\s\S]+Heavy Attacks heal for ([0-9.]+) every ([0-9.]+) second(?:s|), and restore ([0-9.]+) Magicka/i,
	},
	{
		id: "Mend Wounds",
		onLightAttack: function (matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Mend Wounds")) {
				EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", matchResult[1]);
			}
		},
		onHeavyAttack: function (matchResult, skillData) {
			if (EsoBuildCombatHasToggle("skill", "Mend Wounds")) {
				EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", matchResult[1]);
			}
		},
		match: /After you heal an ally you grant them Major Resolve, increasing their Physical and Spell Resistance by [0-9.]+ for ([0-9.]+) second/i,
	},
	{
		id: "Trapping Webs",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Poison", false, true, false, false);
			}, true);
		},
		match: /After ([0-9.]+) seconds the webs explode, dealing ([0-9.]+) Poison Damage to enemies within/i,
	},
	{
		id: "Inner Beast",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "Inner Beast (Target)", matchResult[1]);
		},
		match: /you for ([0-9.]+) second.*The enemy takes ([0-9.]+)% more damage from your attacks while this effect persists/i,
	},
	{
		id: "War Horn",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddBuff("skill", skillData, "War Horn", skillData.duration/1000);
		},
		match: /Sound a war horn to rally your forces/i,
	},
	{
		id: "Magicka Detonation",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddGlobalOnTimeEvent(matchResult[1], function() {
				EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Magic", false, true, false, false);
			}, true);
		},
		getDamageMod: function(matchResult, skillData) {		//TODO: Set number of enemies hit?
			return 1 + matchResult[3]/100;
		},
		match: /explodes after ([0-9.]+) seconds, dealing ([0-9.]+) Magic Damage to all enemies in the area[\s\S]+increases the damage by ([0-9.]+)%/i,
	},
	{
		id: "Burning Heart",
		onTick: function(matchResult, setData, currentTime) {
			EsoBuildCombatEnableToggle("skill", skillData, "Burning Heart", EsoBuildCombatIsSkillLineActive("Draconic Power"));
		},
		match: /While a Draconic Power ability is active, your healing received is increased by ([0-9.]+)%/i,
	},
	{
		id: "Spirit Minder",
		onInitialHit: function(matchResult, skillData) {
			EsoBuildCombatAddPetSimpleRestore("skill", skillData, skillData.name, skillData.duration/1000, matchResult[1], "Health", matchResult[2]);
			EsoBuildCombatAddGlobalOnTimeEvent(skillData.duration/1000, function() {
				++g_EsoBuildCombatNecroPetDeaths;
			}, true);
		},
		match: /The spirit heals you or the lowest Health ally around you every ([0-9.]+) seconds, restoring ([0-9.]+) Health/i,
	},
	{
		id: "Reusable Parts",
		onTick: function(matchResult, setData, currentTime) {
			if (g_EsoBuildCombatLastNecroPetDeaths != g_EsoBuildCombatNecroPetDeaths) {
				EsoBuildCombatAddPlayerStatus("skill", skillData, "Reusable Parts", -1);
				g_EsoBuildCombatLastNecroPetDeaths = g_EsoBuildCombatNecroPetDeaths;
			}
		},
		getCostMod: function(matchResult, setData, skillCastData, cost) {
			if (skillCastData.baseBame != "Blastbones" || skillCastData.baseBame != "Skeletal Mage" || skillCastData.baseBame != "Spirit Mender") return 1.0;
			if (!EsoBuildCombatHasPlayerStatus("Reusable Parts")) return 1.0;
			EsoBuildCombatRemovePlayerStatus("Reusable Parts");
			return 1 - matchResult[1]/100;
		},
		match: /When your Blastbones, Skeletal Mage, or Spirit Mender dies, the cost of your next Blastbones, Skeletal Mage, or Spirit Mender is reduced by ([0-9.]+)%/i,
	},
	{
		id: "Death Knell",
		onTick: function(matchResult, setData, currentTime) {
			if (g_EsoBuildCombatState.targetPctHealth < matchResult[1]) {
				EsoBuildCombatAddToggle("skill", skillData, "Death Knell", -1);
			}
		},
		match: /Increases your Critical Strike Chance against enemies under ([0-9.]+)% Health by ([0-9.]+)% for each Grave Lord ability slotted/i,
	},
	{
		id: "Dismember",
		onTick: function(matchResult, setData, currentTime) {
			EsoBuildCombatEnableToggle("skill", skillData, "Dismember", EsoBuildCombatIsSkillLineActive("Grave Lord"));
		},
		match: /While a Grave Lord ability is active, your Spell and Physical Penetration are increased by ([0-9.]+)/i,
	},
	{
		id: "Curative Curse",
		onTick: function(matchResult, setData, currentTime) {
			EsoBuildCombatEnableToggle("skill", skillData, "Curative Curse", EsoBuildCombatCountPlayerNegativeEffects() > 0);
		},
		match: /While you have a negative effect on you, your healing done is increased by ([0-9.]+)%/i,
	},
	{
		id: "Near-Death Experience",
		onTick: function(matchResult, setData, currentTime) {
			var healValue = Math.round((100 - g_EsoBuildCombatState.targetPctHealth)/100 * matchResult[1]);
			EsoBuildCombatUpdateSkillToggleCount("Near-Death Experience", healValue);
			EsoBuildCombatEnableToggle("skill", skillData, "Near-Death Experience", EsoBuildCombatIsSkillLineSlotted("Living Death"));
		},
		match: /While you have a Living Death ability slotted, your Critical Strike Chance with all healing abilities is increased by up to ([0-9.]+)%/i,
	},
	{
		id: "Corpse Consumption",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {		//TODO: Ensure a corpse is used?
			if (skillCastData.baseName != "Life amid Death" && skillCastData.baseName != "Shocking Siphon" && skillCastData.baseName != "Bitter Harvest") return;
			if (!EsoBuildCombatAddNewCooldown("Corpse Consumption", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /When you use an ability on a corpse, you generate ([0-9.]+) Ultimate. This effect can occur once every ([0-9.]+) second/i,
	},
	{
		id: "Undead Confederate",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.baseName != "Blastbones" && skillCastData.baseName != "Skeletal Mage" && skillCastData.baseName != "Spirit Mender") return;
			EsoBuildCombatAddToggle("skill", skillData, "Undead Confederate", skillCastData.duration/1000);
		},
		match: /While you have a Blastbones, Skeletal Mage, or Spirit Mender active, your Magicka and Stamina Recovery is increased by ([0-9.]+)/i,
	},
	{
		id: "Hemorrhage",
		onCrit: function(matchResult, setData, currentTime) {
			if (EsoBuildCombatIsSkillLineSlotted("Assassination")) EsoBuildCombatAddBuff("skill", skillData, "Minor Savagery", matchResult[2]);
		},
		match: /Dealing Critical Damage grants you and your group Minor Savagery, increasing your Weapon Critical rating by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Shadow Barrier",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Shadow") return;
			EsoBuildCombatAddBuff("skill", skillData, "Major Resolve", matchResult[1] * ( 1 + matchResult[2] * g_EsoBuildLastInputValues.ArmorHeavy / 100));
		},
		match: /Casting a Shadow ability grants you Major Resolve for ([0-9.]+) seconds.*This duration is increased by ([0-9.]+)%/i,
	},
	{
		id: "Catalyst",
		onDrinkPotion: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /After drinking a potion you gain ([0-9.]+) Ultimate/i,
	},
	{
		id: "Transfer",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Siphoning") return;
			if (!EsoBuildCombatAddNewCooldown("Transfer", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /Casting a Siphoning ability generates ([0-9.]+) Ultimate.*every ([0-9.]+) second/i,
	},
	{
		id: "Expert Summoner",
		onTick: function(matchResult, skillData, currentTime) {
			EsoBuildCombatEnableToggle("skill", skillData, "Expert Summoner", EsoBuildCombatHasPetActive());
		},
		match: /Increases your Max Health by ([0-9.]+)% while you have a Daedric Summoning pet active/i,
	},
	{
		id: "Exploitation",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Dark Magic") return;
			EsoBuildCombatAddBuff("skill", skillData, "Minor Prophecy", matchResult[2]);
		},
		match: /When you cast a Dark Magic ability you grant Minor Prophecy to you and your group, increasing your Spell Critical by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Amplitude",
		onTick: function(matchResult, skillData) {
			EsoBuildCombatUpdateSkillToggleCount("Hircine's Fortitude", Math.floor(g_EsoBuildCombatState.targetPctHealth / matchResult[2] * matchResult[1]));
			EsoBuildCombatEnableToggle("skill", skillData, "Amplitude", true);
		},
		match: /Increases your damage done against enemies by ([0-9.]+)% for every ([0-9.]+)% current Health they have/i,
	},
	{
		id: "Spear Wall",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Aedric Spear") return;
			EsoBuildCombatAddBuff("skill", skillData, "Minor Protection", matchResult[1]);
		},
		match: /WHEN ACTIVATING AN AEDRIC SPEAR ABILITY[\s\S]+Gain Minor Protection for ([0-9.]+) second/i,
	},
	{
		id: "Prism",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Dawn's Wrath") return;
			if (!EsoBuildCombatAddNewCooldown("Prism", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /Casting a Dawn's Wrath ability generates ([0-9.]+) Ultimate.* every ([0-9.]+) second/i,
	},
	{
		id: "Illuminate",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Dawn's Wrath") return;
			EsoBuildCombatAddBuff("skill", skillData, "Minor Sorcery", matchResult[1]);
		},
		match: /Casting a Dawn's Wrath ability grants Minor Sorcery to you and your group for ([0-9.]+) seconds/i,
	},
	{
		id: "Savage Beast",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Animal Companions") return;
			if (!EsoBuildCombatAddNewCooldown("avage Beast", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Ultimate", matchResult[1]);
		},
		match: /When you cast an Animal Companions ability while you are in combat, you generate ([0-9.]+) Ultimate.* every ([0-9.]+) second/i,
	},
	{
		id: "Glacial Presence",
		getStatusEffectChanceMod: function(matchResult, skillData, srcType, srcData, statusEffect, srcDamageType, isSrcDOT, isSrcAOE) {
			if (srcType != "skill" || srcData.skillLine != "Winter's Embrace" || statusEffect != "Chilled") return 0;
			return matchResult[1]/100;
		},
		match: /Increase chance of applying Chilled to enemies with Winter's Embrace abilities by ([0-9.]+)%/i,
	},
	{
		id: "Glacial Presence",			//TODO: What does 'recently' mean?
		onStatusEffectChange: function(matchResult, skillData, statusEffect, isAdded) {
			if (statusEffect != "Chilled" || !isAdded) return;
			EsoBuildCombatAddToggle("skill", skillData, "Glacial Presence", ESOBUILDCOMBAT_CHILLED_DURATION*2);
		},
		match: /Enemies and allies who have recently been Chilled take ([0-9.]+)% more Critical Damage and Healing from you/i,
	},
	{
		id: "Heavy Weapons",		//TODO: All melee skills or just LA/HA?
		onLightAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.Weapon2H <= 0 || g_EsoBuildLastInputValues.WeaponAxe <= 0) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "skill", skillData)) return;
			EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], false, true, false);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.Weapon2H <= 0 || g_EsoBuildLastInputValues.WeaponAxe <= 0) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "skill", skillData)) return;
			EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], false, true, false);
		},
		match: /Axes grant your melee attacks a ([0-9.]+)% chance to apply a bleed dealing ([0-9.]+) Physical Damage over ([0-9.]+) seconds/i,
	},
	{
		id: "Follow Up",
		onHeavyAttack: function(matchResult, skillData, skillCastData) {
			if (g_EsoBuildLastInputValues.Weapon2H <= 0) return;
			EsoBuildCombatAddToggle("skill", skillData, "Follow Up", matchResult[1]);
		},
		match: /When you deal damage with a fully-charged Heavy Attack, your next direct damage attack used within ([0-9.]+) seconds deals an additional ([0-9.]+)% damage/i,
	},
	{
		id: "Slaughter",
		onTick: function(matchResult, skillData) {
			EsoBuildCombatEnableToggle("skill", skillData, "Slaughter", g_EsoBuildCombatState.targetPctHealth < matchResult[2]);
		},
		match: /Increases damage with Dual Wield abilities by ([0-9.]+)% against enemies with under ([0-9.]+)% Health/i,
	},
	{
		id: "Ruffian",
		onTick: function(matchResult, skillData) {
			EsoBuildCombatEnableToggle("skill", skillData, "Slaughter", EsoBuildCombatHasTargetStatus("Stunned", "Immobilized", "Disoriented", "Silenced"));
		},
		match: /Increases damage with Dual Wield abilities by ([0-9.]+)% against enemies with under ([0-9.]+)% Health/i,
	},
	{
		id: "Twin Blade and Blunt",		//TODO: All melee skills or just LA/HA?
		onLightAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.Weapon1H <= 0 || g_EsoBuildLastInputValues.WeaponAxe <= 0) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100 * g_EsoBuildLastInputValues.WeaponAxe, "skill", skillData)) return;
			EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], false, true, false);
		},
		onHeavyAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.Weapon1H <= 0 || g_EsoBuildLastInputValues.WeaponAxe <= 0) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100 * g_EsoBuildLastInputValues.WeaponAxe, "skill", skillData)) return;
			EsoBuildCombatAddDot("skill", skillData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], false, true, false);
		},
		match: /Each axe gives your melee attacks an ([0-9.]+)% chance to bleed enemies for ([0-9.]+) Physical Damage over ([0-9.]+) seconds/i,
	},
	{
		id: "Hawk Eye",
		onLightAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.WeaponBow <= 0) return;
			var counter = EsoBuildCombatIncrementCounter("Hawk Eye", matchResult[2], matchResult[3]);
			EsoBuildCombatUpdateSkillToggleCount("Hawk Eye", counter.value);
			EsoBuildCombatAddToggle("skill", skillData, "Hawk Eye", matchResult[2]);
		},
		match: /Dealing damage with a Light or Heavy Attack increases the damage of your Bow abilities by ([0-9.]+)% for ([0-9.]+) seconds, stacking up to ([0-9.]+) times/i,
	},
	{
		id: "Essence Drain",
		onHeavyAttack: function(matchResult, skillData) {
			if (g_EsoBuildLastInputValues.WeaponRestStaff) return;
			EsoBuildCombatAddBuff("skill", skillData, "Major Mending", matchResult[1]);
		},
		match: /You gain Major Mending for ([0-9.]+) seconds after completing a fully-charged Heavy Attack/i,
	},
	{
		id: "Essence Drain",
		onHeavyAttack: function(matchResult, skillData, skillCastData, damage) {
			if (g_EsoBuildLastInputValues.WeaponRestStaff) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]/100 * damage);
		},
		match: /for ([0-9.]+)% of the damage inflicted by the final hit of a fully-charged Heavy Attack/i,
	},
	{
		id: "Might of the Guild",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Mages Guild") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "skill", skillData)) return;
			EsoBuildCombatAddBuff("skill", skillData, "Empower", matchResult[2]);
		},
		match: /Casting a Mages Guild ability has a ([0-9.]+)% chance of granting you Empower.*for ([0-9.]+) second/i,
	},
	{
		id: "Might of the Guild",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Mages Guild") return;
			EsoBuildCombatAddBuff("skill", skillData, "Empower", matchResult[1]);
		},
		match: /Casting a Mages Guild ability grants you Empower.*for ([0-9.]+) second/i,
	},
	{
		id: "Spell Orb",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillLine != "Psijic Order") return;
			var counter = EsoBuildCombatIncrementCounter("Spell Orb", matchResult[4], matchResult[5]);
			if (counter.value == matchResult[5]) {
				if (matchResult[2] > matchResult[3])
					EsoBuildCombatApplyDamage("skill", skillData, matchResult[2], "Magic", false, false, false, false);
				else
					EsoBuildCombatApplyDamage("skill", skillData, matchResult[3], "Physical", false, false, false, false);
				EsoBuildCombatRemoveCounter("Spell Orb");
			}
		},
		match: /When you reach ([0-9.]+) spell charges.*dealing ([0-9.]+) Magic Damage or ([0-9.]+) Physical Damage.*within ([0-9.]+) seconds of each other/i,
	},
	{
		id: "Resourceful",
		onDrinkPotion: function(matchResult, skillData) {
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		match: /When you drink a potion, you restore ([0-9.]+) Health, Magicka, and Stamina/i,
	},
	{
		id: "Spell Recharge",
		onAnySkillCast: function(matchResult, skillData, skillCastData) {
			if (skillCastData.skillType != 1) return;
			if (!EsoBuildCombatAddNewCooldown("Spell Recharge", matchResult[2])) return;
			if (g_EsoBuildCombatState.currentMagicka < g_EsoBuildCombatState.currentStamina)
				EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[1]);
			else
				EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		match: /When you activate a class ability, you restore ([0-9.]+) Magicka or Stamina, based on whichever is lowest.*every ([0-9.]+) second/i,
	},
	{
		id: "Red Diamond",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (isDOT) return;
			if (!EsoBuildCombatAddNewCooldown("Red Diamond", matchResult[3])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
			EsoBuildCombatRestoreStat("skill", skillData, "Magicka", matchResult[2]);
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[2]);
		},
		match: /When you deal direct damage, you heal yourself for ([0-9.]+) and restore ([0-9.]+) Magicka and Stamina.*every ([0-9.]+) second/i,
	},
	{
		id: "Unflinching Rage",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.skillType != 2) return;
			if (!EsoBuildCombatAddNewCooldown("Unflinching Rage", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Health", matchResult[1]);
		},
		match: /When you deal damage with a Weapon ability, you heal for ([0-9.]+) Health.*every ([0-9.]+) second/i,
	},
	{
		id: "Unflinching Rage",
		onAnyDamage: function(matchResult, skillData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (isDOT) return;
			if (!EsoBuildCombatAddNewCooldown("Unflinching Rage", matchResult[2])) return;
			EsoBuildCombatRestoreStat("skill", skillData, "Stamina", matchResult[1]);
		},
		match: /When you deal direct damage, you restore ([0-9.]+) Stamina.*every ([0-9.]+) second/i,
	},
	{
		id: "Hunter's Eye",
		onRollDodge: function(matchResult, skillData) {
			EsoBuildCombatAddToggle("skill", skillData, "Hunter's Eye", matchResult[2]);
		},
		match: /Physical and Spell Penetration by ([0-9.]+) for ([0-9.]+) seconds after you use Roll Dodge/i,
	},
];


window.ESOBUILD_COMBAT_CPPASSIVE_ONETIME_MATCHES = [
	// When you use Bash, you have a 33% chance to reduce the enemy's Movement Speed by 20% for 3 seconds.
	// When you use Bash, you have a 20% chance to heal for 437 Health.
	// When you deal Critical Damage, you heal for 330 Health. This effect can occur once every 5 seconds.
	{
		id: "Exploiter",
		match: /Increases your damage done against Off Balance enemies by ([0-9.]+)%/i,
		onStatusEffectChange: function(matchResult, cpData, statusEffect, isAdded) {
			if (statusEffect == "Off Balance") EsoBuildCombatEnableToggle("cp", cpData, "Exploiter", isAdded);
		},
	},
	{
		id: "Foresight",
		match: /When you drink a potion, the cost of your next Magicka ability used within ([0-9.]+) seconds is reduced by ([0-9.]+)%/i,
		onAnySkillCast: function(matchResult, cpData, skillCastData) {
			if (skillCastData.mechanic == 0) EsoBuildCombatEnableToggle("cp", cpData, "Foresight", false);
		},
		onDrinkPotion: function(matchResult, cpData, potionName, potionData) {
			EsoBuildCombatAddToggle("cp", cpData, "Foresight", matchResult[1]);
		},
	},
	{
		id: "Butcher",
			//TODO
		match: /Increases your damage done with Light and Heavy Attacks by 5% to enemies below ([0-9.]+)% Health/i,
	},
	{
		id: "Tactician",
		onRollDodge: function(matchResult, cpData) {
			EsoBuildCombatAddTargetStatus("cp", cpData, "Off Balance", ESOBUILDCOMBAT_OFFBALANCE_DURATION, ESOBUILDCOMBAT_OFFBALANCE_COOLDOWN);
		},
		match: /When you use Roll Dodge to dodge an attack, you set the enemy Off Balance/i,
	},
	{
		id: "Phase",
		onRollDodge: function(matchResult, cpData) {
			//TODO
		},
		match: /When you use Roll Dodge, your Physical and Spell Resistance is increased by ([0-9]+) for ([0-9.]+) seconds/i,
	},
];


window.ESOBUILD_COMBAT_SET_ONETIME_MATCHES = [
	{
		id: "Aegis Caller",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!isMelee) return;
			
			var duration = parseFloat(matchResult[1]);
			var initialTick = parseFloat(matchResult[2]);
			var bleedDamage = parseInt(matchResult[3]);
			var tickTime = parseFloat(matchResult[4]);
			var cooldown = parseFloat(matchResult[5]);
			
			EsoBuildCombatAddDot("set", setData, bleedDamage, "Bleed", tickTime, duration, true, true, false, initialTick, cooldown);
		},
		match: /When you deal critical melee damage, summon a Lesser Aegis for ([0-9\.]+) seconds\. After ([0-9\.]+) seconds, the Lesser Aegis spins its blades, dealing ([0-9]+) Bleed Damage every ([0-9\.]+) second\. This effect can occur once every ([0-9\.]+) second/i,
	},
	{
		id: "Affliction",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (EsoBuildCombatHasCooldown("Affliction")) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			EsoBuildCombatAddCooldown("Affliction", matchResult[4]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Disease", false, false, false, false);
			EsoBuildCombatAddTargetStatus("set", setData, "Diseased", matchResult[4]);
		},
		match: /When you deal damage, you have a ([0-9]+)% chance to deal ([0-9]+) Disease Damage to the target(.*?) for ([0-9]+) second/i,
	},
	{
		id: "Armor of Truth",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (EsoBuildCombatHasStatusEffect("target", "Off Balance")) {
				EsoBuildCombatAddToggle("set", setData, "Armor of Truth", matchResult[2]);
			}
		},
		match: /When you deal damage to an enemy who is Off Balance, your Weapon Damage is increased by ([0-9]+) for ([0-9\.]+) second/i,
	},
	{
		id: "Arms of Relequen",
		onLightAttack: function(matchResult, setData) {
			EsoBuildCombatIncrementCounter("Arms of Relequen", matchResult[1], matchResult[4], matchResult[3], function(counter, value) { 
				EsoBuildCombatApplyDamage("set", setData, matchResult[2] * value, "Physical", true, false, false, false);
			});
		},
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatIncrementCounter("Arms of Relequen", matchResult[1], matchResult[4], matchResult[3], function(counter, value) { 
				EsoBuildCombatApplyDamage("set", setData, matchResult[2] * value, "Physical", true, false, false, false);
			});
		},
		match: /harmful winds to your target for ([0-9\.]+) second.*Harmful winds deal ([0-9]+) Physical Damage per stack every ([0-9\.]+) second.*([0-9]+) stacks max/i,
	},
	{
		id: "Ashen Grip",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!isMelee) return;
			if (EsoBuildCombatHasCooldown("Ashen Grip")) return;
			EsoBuildCombatAddCooldown("Ashen Grip", matchResult[2]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Flame", false, true, false, false);
		},
		match: /When you deal melee damage, you breathe fire to all enemies in front of you for ([0-9]+) Flame damage\. This effect can occur once every ([0-9\.]+) second/i,
	},
	{
		id: "Auroran's Thunder",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (isDOT || isAOE || isBleed) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Shock", matchResult[3], matchResult[1], true, false, false, -1, matchResult[4]);
		},
		match: /Dealing direct damage with a single target attack summons a cone of lightning from your chest for ([0-9\.]+) seconds, dealing ([0-9]+) Shock Damage every ([0-9\.]+) seconds to enemies in the cone\. This effect can occur every ([0-9\.]+) second/i,
	},
	{
		id: "Azureblight Reaper",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!isDOT || srcType == "set") return;
			if (EsoBuildCombatHasCooldown("Azureblight Reaper")) return;
			EsoBuildCombatIncrementCounter("Azureblight Reaper", matchResult[1], matchResult[2], null, null, function(counter) {
				EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Disease", false, true, false, false);
				EsoBuildCombatAddCooldown("Azureblight Reaper", matchResult[5]);
				EsoBuildCombatRemoveCounter("Azureblight Reaper");
			});
		},
		match: /Blight Seed to your target for ([0-9\.]+) seconds\. At ([0-9]+) stacks, the Blight Seeds explode, dealing ([0-9]+) Disease Damage to the target([\s\S]*)with Blight Seed for ([0-9\.]+) second/i,
	},
	{
		id: "Bahraha's Curse",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			EsoBuildCombatAddDot("set", setData, matchResult[3], "Magic", matchResult[2], matchResult[4], true, false, false, -1, matchResult[2]);
		},
		match: /When you deal damage, you have a ([0-9\.]+)% chance to create desecrated ground for ([0-9\.]+) second(.*)damages them for ([0-9\.]+) Magic damage every ([0-9\.]+) second/i,
	},
	{
		id: "Balorgh",
		onUltimateCast: function(matchResult, setData, ultimateData, ultimateCost, initialUltimate) {
			var duration = parseFloat(matchResult[1]);
			if (isNaN(duration) || duration <= 0 || ultimateCost <= 0) return;
				// TODO: Overload?
			EsoBuildCombatUpdateSetToggleCount('Balorgh', ultimateCost)
			EsoBuildCombatAddToggle("set", setData, "Balorgh", duration);
		},
			// TODO: Remove Old Set Desc
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage for ([0-9\.]+) seconds equal to twice the amount of total Ultimate consumed/i,
	},
	{
		id: "Balorgh",
		onUltimateCast: function(matchResult, setData, ultimateData, ultimateCost, initialUltimate) {
			var duration = parseFloat(matchResult[1]);
			if (isNaN(duration) || duration <= 0 || ultimateCost <= 0) return;
				// TODO: Overload?
			EsoBuildCombatUpdateSetToggleCount('Balorgh', ultimateCost)
			EsoBuildCombatAddToggle("set", setData, "Balorgh", duration);
		},
		match: /When you use an Ultimate ability, you gain Weapon and Spell Damage equal to the amount of total Ultimate consumed, and Physical and Spell Penetration equal to ([0-9\.]+) times the amount for ([0-9\.]+) second/i,
	},
	{
		id: "Berserking Warrior",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!isMelee || srcType == "set") return;
			if (EsoBuildCombatHasCooldown("Berserking Warrior")) return;
			EsoBuildCombatAddCooldown("Berserking Warrior", 0.5);
			
			var counter = EsoBuildCombatIncrementCounter("Berserking Warrior", matchResult[2], matchResult[3]);
			if (!counter) return;
			
			EsoBuildCombatUpdateSetToggleCount("Berserking Warrior", counter.value)
			EsoBuildCombatAddToggle("set", setData, "Berserking Warrior", matchResult[2]);
		},
		match: /When you deal melee damage your Critical Strike rating is increased by ([0-9\.]+) for ([0-9\.]+) seconds, stacking up to ([0-9]+) times/i,
	},
	{
		id: "Blood Moon",
		onLightAttack: function(matchResult, setData, laData, damage, damageType) {
			if (!laData.isMelee) return;
			EsoBuildCombatIncrementCounter("Blood Moon", matchResult[1], matchResult[2], null, null, function(counter) {
				if (EsoBuildCombatHasCooldown("Blood Moon")) return;
				EsoBuildCombatAddCooldown("Blood Moon", matchResult[6]);
				EsoBuildCombatAddToggle("set", setData, "Blood Moon", matchResult[3]);
				EsoBuildCombatRemoveCounter("Blood Moon");
			});
		},
		match: /Blood Scent for ([0-9\.]+) seconds\. When you gain ([0-9]+) stacks, you become Frenzied for ([0-9\.]+) seconds, increasing your melee Light Attack damage by ([0-9]+)% and attack speed by ([0-9]+)%\. This effect can occur every ([0-9\.]+) second/i,
	},
	{
		id: "Bloodthorn's Touch",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!isDOT || srcType == "set") return;
			if (EsoBuildCombatHasCooldown("Bloodthorn's Touch")) return;
			EsoBuildCombatAddCooldown("Bloodthorn's Touch", matchResult[2]);
			EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[1]);
			EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[1]);
		},
		match: /When you deal direct damage, you restore ([0-9]+) Magicka and Stamina\. This effect can occur once every ([0-9.]+) second/i,
	},
	{
		id: "Briarheart",
		onCrit:  function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (EsoBuildCombatHasCooldown("Briarheart")) return;
			if (!EsoBuildCombatCheckRandom(matchResult[1]/100, "set", setData)) return;
			EsoBuildCombatAddCooldown("Briarheart", matchResult[4]);
			EsoBuildCombatAddToggle("set", setData, "Briarheart", matchResult[3]);
		},
		match: /When you deal Critical Damage, you have a ([0-9.]+)% chance to increase your Weapon Damage by ([0-9]+) for ([0-9.]+) second(?:.*)This effect can occur once every ([0-9.]+) seconds./i,
	},
	{
		id: "Burning Spellweave",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (damageType != "Flame" || srcType == "set") return;
			if (EsoBuildCombatHasCooldown("Burning Spellweave")) return;
			if (!EsoBuildCombatCheckRandom(matchResult[1]/100, "set", setData)) return;
			EsoBuildCombatAddCooldown("Burning Spellweave", matchResult[4]);
			EsoBuildCombatAddToggle("set", setData, "Burning Spellweave", matchResult[3]);
			EsoBuildCombatAddTargetStatus("set", setData, "Burning", matchResult[3]);
		},
		match: /a Flame Damage ability, you have a ([0-9.]+)% chance(?:.*)Spell Damage by ([0-9.]+) for ([0-9.]+) seconds(?:.*) every ([0-9.]+) second/i,
	},
	{
		id: "Caluurion's Legacy",
		onCrit:  function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (isAOE || srcType != "skill" || srcData.mechanic != 0) return;
			if (EsoBuildCombatHasCooldown("Caluurion's Legacy")) return;
			var chance = Math.random();
			var dmgType = "Flame";
			var statusEffect = "Burning";
			if (chance < 0.25) {
				dmgType = "Frost";
				statusEffect = "Chilled";
			}
			else if (chance < 0.50) {
				dmgType = "Shock";
				statusEffect = "Concussion";
			}
			else if (chance < 0.75) {
				dmgType = "Disease";
				statusEffect = "Diseased";
			}
			EsoBuildCombatAddCooldown("Caluurion's Legacy", matchResult[2]);
			EsoBuildCombatAddTargetStatus("set", setData, statusEffect, matchResult[2]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], dmgType, false, false, false, false);
		},
		match: /you launch a Fire, Ice, Shock, or Disease ball at your target that deals ([0-9.]+) damage and applies a status(?:.*)every ([0-9.]+) second/i,
	},
	{
		id: "Caustic Arrow",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName == "Poison Arrow") {
				var duration = 10.0; // Default
				var matchResult = skillCastData.lastDesc.match(/over ([0-9.]+) second/i);
				if (matchResult) duration = parseFloat(matchResult[1]);
				EsoBuildCombatAddToggle("set", setData, "Caustic Arrow", duration);
			}
		},
		match: /Increases your Weapon Damage by ([0-9]+) against targets affected by your Poison Arrow/i,
	},
	{
		id: "Chaotic Whirlwind",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName == "Whirlwind") {
				if (!EsoBuildCombatAddNewCooldown("Chaotic Whirlwind", matchResult[5])) return;
				EsoBuildCombatAddDot("set", setData, matchResult[4], "Physical", matchResult[3], matchResult[1], true, false, false);
			}
		},
		match: / for ([0-9.]+) seconds that pulse outward, striking up to ([0-9.]+) random enemies around you every ([0-9.]+) second for ([0-9]+) Physical Damage[\s\S]*once every ([0-9.]+) second/i,
	},
	{
		id: "Chokethorn",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatIsHealAbility(skillCastData)) return;
			if (!EsoBuildCombatAddNewCooldown("Chokethorn", matchResult[4])) return;
			EsoBuildCombatAddPetSimpleRestore("set", setData, "Chokethorn", matchResult[3], 1.0, "Health", matchResult[2]/matchResult[3]);
		},
		match: /a ([0-9.]+)% chance to summon a strangler sapling that heals you or an ally for ([0-9.]+) Health over ([0-9.]+) seconds.*every ([0-9.]+) second/i,
	},
	{
		id: "Claw of Yolnahkriin",
		onTaunt: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Claw of Yolnahkriin", matchResult[3])) return;
			EsoBuildCombatAddToggle("set", setData, "Claw of Yolnahkriin", matchResult[1]);
		},
		match: /When you taunt an enemy.* Minor Courage for ([0-9.]+) seconds, increasing your Weapon and Spell Damage by ([0-9.]+)\. This effect can occur once every ([0-9.]+) second/i,
	},
	{
		id: "Clever Alchemist",
		onDrinkPotion: function(matchResult, setData) {
			EsoBuildCombatAddToggle("set", setData, "Clever Alchemist", matchResult[2]);
		},
		match: /When you drink a potion during combat you feel a rush of energy, increasing your Weapon and Spell Damage by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Coldharbour's Favorite",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatAddNewCooldown("Coldharbour's Favorite", matchResult[4])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2]/matchResult[3], "Magic", 1.0, matchResult[3], true, false, false, matchResult[1]);
		},
		match: /Honor, who after ([0-9.]+) seconds, explodes, damaging enemies around him for ([0-9.]+) Magic Damage over ([0-9.]+) seconds[\s\S]+every ([0-9.]+) second/i,
	},
	{
		id: "Concentrated Force",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			EsoBuildCombatIncrementCounter("Concentrated Force", matchResult[1], 3, -1, null, function(counter) {
				var weaponData = g_EsoBuildItemData["MainHand" + g_EsoBuildActiveWeapon];
				if (weaponData == null || weaponData.weaponType == null) return;
				
				var damageType = "Flame";
				if (weaponData.weaponType == 15) damageType = "Shock";
				if (weaponData.weaponType == 13) damageType = "Frost";
				
				EsoBuildCombatCreateStatusEffectFromDamage("set", setData, damageType, false, false, 1.0);
				EsoBuildCombatRemoveCounter("Concentrated Force");
			});
		},
		match: /The Force Shock casts must be made within ([0-9.]+) seconds of each other for this effect to occur/i,
	},
	{
		id: "Cruel Flurry",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Flurry") return;
			EsoBuildCombatAddToggle("set", setData, "Cruel Flurry", matchResult[1]);
		},
		match: /When you deal damage with Flurry, your single target damage over time abilities used within ([0-9.]+) seconds gain ([0-9]+) Spell and Weapon Damage/i,
	},
	{
		id: "Crushing Wall",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Wall of Elements") return;
			EsoBuildCombatAddToggle("set", setData, "Crushing Wall", skillCastData.newDuration / 1000);
		},
		match: /Your Light and Heavy Attacks deal an additional ([0-9.]+) damage to enemies in your Wall of Elements/i,
	},
	{
		id: "Curse of Doylemish",
		onHeavyAttack: function(matchResult, setData, skillCastData, damage, damageType) {
			if (!EsoBuildCombatHasStatusEffect("target", "Taunted")) return;
			if (!EsoBuildCombatHasStatusEffect("target", "Stunned", "Feared", "Immobilized")) return;
			if (!EsoBuildCombatAddNewCooldown("Curse of Doylemish", matchResult[2])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Physical", false, false, false, false);
		},
		match: /When using a fully-charged melee Heavy Attack on a taunted monster or any enemy who is stunned, feared, or immobilized, you will deal ([0-9]+) Physical Damage\. This effect can occur once every ([0-9.]+) second/i,
	},
	{
		id: "Daedric Trickery",
		onTick: function(matchResult, setData, currentTime) {
			if (!EsoBuildCombatAddNewCooldown("Daedric Trickery", matchResult[2])) return;
			var buffs = [ "Major Expedition", "Major Protection", "Major Mending", "Major Heroism", "Major Vitality" ];
			var randomBuff = buffs[Math.floor(Math.random()*buffs.length)];
			EsoBuildCombatAddBuff("set", setData, randomBuff, matchResult[1]);
		},
		match: /While in combat you gain one of [0-9]+ random Major Buffs for ([0-9.]+) seconds every ([0-9.]+) seconds/i,
	},
	{
		id: "Daring Corsair",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.skillType != 2) return;
			if (!EsoBuildCombatAddNewCooldown("Daring Corsair", matchResult[2])) return;
			EsoBuildCombatAddBuff("set", setData, "Minor Heroism", matchResult[1]);
		},
		match: /After casting a Weapon ability, you gain Minor Heroism for ([0-9.]+) second.*occur every ([0-9.]+) second/i,
	},
	{
		id: "Defiler",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Defiler", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Poison", false, true, false, false);
			EsoBuildCombatAddTargetStatus("set", setData, "Stunned", matchResult[3]);
			
			EsoBuildCombatAddPet("set", setData, "Defiler", 0.5);			//TODO: Technically a pet but how long is the summon time?
		},
		match: /When you deal Critical Damage, you have an ([0-9.]+)% chance to summon a Hunger.*dealing ([0-9]+) Poison Damage and stunning any enemy hit for ([0-9.]+) second.* once every ([0-9.]+) second/i,
	},
	{
		id: "Destructive Impact",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Destructive Touch") return;
			EsoBuildCombatAddToggle("set", setData, "Destructive Impact", matchResult[3]);
		},
		match: /Reduces the cost of Destructive Touch by ([0-9.]+)% and increases your Spell Damage by ([0-9]+) for ([0-9.]+) seconds after activating it/i,
	},
	{
		id: "Destructive Mage",
		onHeavyAttack: function(matchResult, setData, skillCastData, damage, damageType) 
		{
			if (!EsoBuildCombatHasStatusEffect("target", "Taunted")) 
			{
				if (!EsoBuildCombatAddNewCooldown("Destructive Mage", matchResult[3])) return;
				EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Magic", false, true, false, false);
				EsoBuildCombatRemoveTargetStatus("Destructive Mage");
				return;
			}
			
			EsoBuildCombatAddTargetStatus("set", setData, "Destructive Mage", matchResult[1]);
		},
		match: /you place a bomb on the enemy for ([0-9.]+) second*dealing ([0-9]+) Magic Damage all enemies.*once every ([0-9.]+) second/i,
	},
	{
		id: "Disciplined Slash",
		onAnySkillCast: function(matchResult, cpData, skillCastData) {
			if (skillCastData.baseName != "Reverse Slash") return;
				//Deals up to 300% more damage to enemies with less than 50% Health.
				//TODO: Confirm scaling
			var ultimate = EsoBuildCombatGetExecuteDamageMod(matchResult[1] * 100, 50) - 1;
			EsoBuildCombatRestoreStat("set", setData, "Ultimate", ultimate);
		},
		match: /When you deal damage with Reverse Slash, you generate up to ([0-9]+) Ultimate based on how much execute bonus damage it dealt/i,
	},
	{
		id: "Domihaus",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatAddNewCooldown("Domihaus", matchResult[5])) return;
			var useMagic = g_EsoBuildLastInputValues.Magicka > g_EsoBuildLastInputValues.Stamina; //TODO: Confirm choice used
			
			if (useMagic) {
				EsoBuildCombatAddToggle("set", setData, "Domihaus (Spell Damage)", matchResult[1]);
				EsoBuildCombatAddDot("set", setData, matchResult[2], "Flame", matchResult[4], matchResult[1], true, false, false);
			}
			else {
				EsoBuildCombatAddToggle("set", setData, "Domihaus (Weapon Damage)", matchResult[1]);
				EsoBuildCombatAddDot("set", setData, matchResult[3], "Physical", matchResult[4], matchResult[1], true, false, false);
			}
			
		},
		match: /you create either a ring of fire or ring of molten earth around you for ([0-9.]+) seconds, which deals ([0-9]+) Flame damage or ([0-9]+) Physical damage every ([0-9.]+) second.*once every ([0-9.]+) seconds/i,
	},
	{
		id: "Dragon's Appetite",
		getExtraDamage: function(matchResult, setData, srcType, srcData) {
			if (srcType != "skill") return 0;
			if (!EsoBuildCombatIsTargetBleeding()) return 0;
			return parseInt(matchResult[1]);
		},
		match: /Increase your damage done to Bleeding enemies by ([0-9.]+)/i,
	},
	{
		id: "Dragonguard Elite",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			if (!EsoBuildCombatAddNewCooldown("Dragonguard Tactics", matchResult[3])) return;
			var counter = EsoBuildCombatIncrementCounter("Dragonguard Tactics", matchResult[1], matchResult[2]);
			EsoBuildCombatUpdateSetToggleCount("Dragonguard Elite", counter)
			EsoBuildCombatAddToggle("set", setData, "Dragonguard Elite", matchResult[1]);
		},
		match: /You gain a stack of Dragonguard Tactics for ([0-9.]+) second.*up to ([0-9]+) stack*every ([0-9.]+) second/i,
	},
	{
		id: "Draugrkin's Grip",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || isDOT) return;
			if (!EsoBuildCombatAddNewCooldown("Draugrkin's Grip", matchResult[3])) return;
			EsoBuildCombatAddPlayerStatus(srcType, srcData, "Draugrkin's Grip", matchResult[1]);
		},
		getExtraDamage: function(matchResult, setData, srcType, srcData) {
			if (srcType != "skill") return 0;
			if (!EsoBuildCombatHasStatusEffect("player", "Draugrkin's Grip")) return 0;
			return parseInt(matchResult[2]);
		},
		match: /curse on your enemy for ([0-9.]+) second.*take ([0-9.]+) extra damage.*once every ([0-9.]+) second/i,
	},
	{
		id: "Dro'Zakar's Claws",
		onTick: function(matchResult, setData, currentTime) {
			var count = EsoBuildCombatCountTargetBleeds();
			EsoBuildCombatUpdateSetToggleCount("Dro'Zakar's Claws", count)
			EsoBuildCombatEnableToggle("set", setData, "Dro'Zakar's Claws", (count > 0));
		},
		match: /For every bleed effect you have on an enemy, increase your Weapon Damage by ([0-9.]+) against them./i,
	},
	{
		id: "Eagle Eye",
		getCritChanceMod: function(matchResult, setData, srcType, srcData, damageType, isDOT, isAOE, isBleed) {
			if (srcType != "skill" || isDOT) return 0;
			if (srcData.maxRange <= ESOBUILDCOMBAT_MAXMELEE_RANGE) return 0;
			return ConvertEsoFlatCritToPercent(parseFloat(matchResult[1]))/100;
		},
		match: /Adds ([0-9.]+) Weapon Critical to your ranged direct damage abilities/i,
	},
	{
		id: "Elemental Succession",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (damageType != "Flame" || damageType != "Shock" || damageType != "Frost") return;
			if (!EsoBuildCombatAddNewCooldown("Elemental Succession (" + damageType + ")", matchResult[3])) return;
			EsoBuildCombatAddToggle("set", setData, "Elemental Succession (" + damageType + ")", matchResult[2]);
		},
		match: /Whenever you deal Flame, Shock, or Frost Damage, you gain ([0-9.]+) Spell Damage for that element for ([0-9.]+) seconds.*occur every ([0-9.]+) second/i, 
	},
	{
		id: "Embershield",
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatAddNewCooldown("Embershield)", matchResult[4])) return;
			EsoBuildCombatAddToggle("set", setData, "Embershield", matchResult[4]);
			EsoBuildCombatAddDot("set", setData, matchResult[1], "Flame", matchResult[3], matchResult[4], true, false, false);
		},
		match: /When you deal damage with a fully-charged Heavy Attack.*and deal ([0-9.]+) Flame damage to all enemies within ([0-9.]+) meters of you every ([0-9.]+) second for ([0-9.]+) second/i,
	},
	{
		id: "Engine Guardian",
		onAnySkillCast: function(matchResult, cpData, skillCastData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Engine Guardian", matchResult[6])) return;
			
			var stat = "Magicka";
			var amtPerTick = matchResult[2];
			var statChance = Math.random();
			if (statChance < 0.33) stat = "Stamina";
			else if (statChance < 0.66) { stat = "Health"; amtPerTick = matchResult[3]; }
			
			EsoBuildCombatAddRestoreStat("set", setData, stat, amtPerTick, matchResult[4], matchResult[5]);
			EsoBuildCombatAddPet("set", setData, "Engine Guardian", matchResult[5]);
		},
		match: /a ([0-9.]+)% chance.*restore ([0-9.]+) Stamina or Magicka or ([0-9.]+) Health to you every ([0-9.]+) seconds for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
				//TODO: Effective use % of this set
		id: "Essence Thief",
		onLightAttack: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Essence Thief)", matchResult[6])) return;
			EsoBuildCombatRestoreStat("set", setData, "Health", matchResult[2]);
			EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[3]);
			EsoBuildCombatAddToggle("set", setData, "Essence Thief", matchResult[5]);
		},
		onHeavyAttack: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Essence Thief)", matchResult[6])) return;
			EsoBuildCombatRestoreStat("set", setData, "Health", matchResult[2]);
			EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[3]);
			EsoBuildCombatAddToggle("set", setData, "Essence Thief", matchResult[5]);
		},
		match: /for ([0-9.]+) second.*for ([0-9.]+) Health, restores ([0-9.]+) Stamina, and increases your damage done by ([0-9.]+)% for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Eternal Hunt",
		onRollDodge: function(matchResult, setData) {	//TODO
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Poison", false, false, false, false);
			EsoBuildCombatAddTargetStatus("set", setData, "Immobilized", matchResult[2]);
		},
		match: /When you use Roll Dodge, you leave behind a rune that detonates when enemies come close, dealing ([0-9.]+) Poison damage and immobilizing them for ([0-9.]+) second/i,
	},
	{
		id: "Eye of Nahviintaas",
		//TODO: How to implement this?
		match: /ally who activated the synergy get ([0-9.]+)% cost reduction for non-Ultimate abilities for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Flame Blossom",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Flame Blossom", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Flame", false, true, false, false);
		},
		match: /When you deal damage, you have a ([0-9.]+)% chance.*after ([0-9.]+) second, dealing ([0-9.]+) Flame Damage to.*every ([0-9.]+) second/i,
	},
	{
		id: "Galerion's Revenge",
		onLightAttack: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Galerion's Revenge", 1.0)) return;
			EsoBuildCombatIncrementCounter("Galerion's Revenge", matchResult[1], matchResult[2], -1, null, function(counter) {
				EsoBuildCombatRemoveCounter("Galerion's Revenge");
				EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Magic", false, false, false, false);
			});
		},
		match: /a Mark of Revenge on the enemy for ([0-9.]+) second.*stacking ([0-9.]+) Marks of Revenge on an enemy they detonate for ([0-9.]+) Magic Damage/i,
	},
	{
		id: "Gallant Charge",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Shield Charge") return;
			EsoBuildCombatAddPlayerStatus("set", setData, "Gallant Charge", matchResult[1]);
		},
		getCostMod: function(matchResult, setData, skillCastData, cost) {
			if (!EsoBuildCombatHasStatusEffect("player", "Gallant Charge")) return 1.0;
			if (skillCastData.skillLine != "One Hand and Shield" || skillCastData.baseName == "Shield Charge") return 1.0;
			EsoBuildCombatRemovePlayerStatus("Gallant Charge");
			return 0;
		},
		match: /and reduces the cost of your next non-Shield Charge One Handed and Shield ability cast within ([0-9.]+) seconds by ([0-9.]+)%/,
	},
	{
		id: "Grothdarr",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Grothdarr", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Flame", matchResult[3], matchResult[4], true, false, false);
		},
		match: /you have a ([0-9.]+)% chance to create lava.*dealing ([0-9.]+) Flame damage to.*every ([0-9.]+) second for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Grundwulf",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatAddNewCooldown("Grundwulf", matchResult[3])) return;
			
			if (g_EsoBuildLastInputValues.Magicka > g_EsoBuildLastInputValues.Stamina) {
				EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[1]);
				EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[2]);
			}
			else {
				EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[1]);
				EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[2]);
			}
		},
		match: /Whenever you deal critical damage, restore ([0-9.]+) Magicka or Stamina.*gain ([0-9.]+) of the other.*every ([0-9.]+) second/i,
	},
	{
		id: "Gryphon's Ferocity",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			EsoBuildCombatAddBuff("set", setData, "Minor Force", matchResult[1]);
			EsoBuildCombatAddBuff("set", setData, "Minor Expedition", matchResult[1]);
		},
		match: /After dealing direct damage, you gain Minor Force and Minor Expedition for ([0-9.]+) second/i,
	},
	{
		id: "Hide of Morihaus",
		onRollDodge: function(matchResult, setData) {
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Physical", false, false, false, false);
			EsoBuildCombatAddTargetStatus("set", setData, "Knocked Down", matchResult[2]);
		},
		match: /When you Roll Dodge through an enemy, you deal ([0-9.]+) Physical Damage and knock them down for ([0-9.]+) second/i,
	},
	{
		id: "Hollowfang Thirst",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatAddNewCooldown("Hollowfang Thirst", matchResult[4])) return;
			EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[2]);
			EsoBuildCombatAddBuff("set", setData, "Minor Vitality", matchResult[3]);
		},
		match: /spawn a ball of Hemoglobin.*After ([0-9.]+) seconds the ball explodes, restoring ([0-9.]+) Magicka.*for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Hunt Leader",
		onPetAttack: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed) {	//TODO?
					//TODO: Assumes you've attacked in the last 10 seconds
			if (!EsoBuildCombatAddNewCooldown("Hunt Leader", matchResult[4])) return;
			EsoBuildCombatRestoreStat("set", setData, "Health", matchResult[2]);
			EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[3]);
		},
		match: /When your pets attack.*last ([0-9.]+) seconds, you heal for ([0-9.]+) Health and restore ([0-9.]+) Stamina.*every ([0-9.]+) second/i,
	},
	{
		id: "Iceheart",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {	//TODO: Assumes damage shield holds
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Iceheart", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[3], "Frost", matchResult[4], matchResult[2], true, false, false);
		},
		match: /When you deal Critical Damage, you have a ([0-9.]+)% chance.*for ([0-9.]+) second.*deal ([0-9.]+) Frost damage to all.*every ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Icy Conjuror",
		onDebuff: function(matchResult, setData, buffId) {	//TODO
			if (buffId.indexOf("Minor") < 0) return;
			if (!EsoBuildCombatAddNewCooldown("Icy Conjuror", matchResult[3])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[1]/matchResult[2], "Frost", 1.0, matchResult[2], false, false, false);
		},
		match: /Applying a minor debuff.*dealing ([0-9.]+) Frost Damage over ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Ilambris",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (damageType != "Flame" && damageType != "Shock") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Ilambris", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], damageType, matchResult[3], matchResult[4], true, false, false);
		},
		match: /you have a ([0-9.]+)% chance to summon a meteor shower of that damage type that deals ([0-9.]+) Damage to all.*every ([0-9.]+) second for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Infallible Mage",
		onHeavyAttack: function (matchResult, setData) {
			EsoBuildCombatAddBuff("set", setData, "Minor Vulnerability (Target)", matchResult[1]);
		},
		match: /Enemies you damage with fully-charged Heavy Attacks are afflicted with Minor Vulnerability for ([0-9.]+) second/i,
	},
	{
		id: "Infernal Guardian",
		onDamageShield: function(matchResult, setData) {	//TODO
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Infernal Guardian", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[4], "Flame", matchResult[3]/matchResult[2], matchResult[3], true, false, false);
		},
		match: /you have a ([0-9.]+)% chance to lob ([0-9.]+) mortars over ([0-9.]+) second.*each deal ([0-9.]+) Flame damage to all.*every ([0-9.]+) second/i,
	},
	{
		id: "Inventor's Guard",
		onUltimateCast: function(matchResult, setData) {
			EsoBuildCombatAddBuff("set", setData, "Major Aegis", matchResult[1]);
		},
		match: /When you use an Ultimate ability.*gain Major Aegis for ([0-9.]+) second/i,
	},
	{
		id: "Kjalnar's Nightmare",
		onLightAttack: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Kjalnar's Nightmare", matchResult[2])) return;
			EsoBuildCombatIncrementCounter("Kjalnar's Nightmare", matchResult[1], matchResult[3], -1, null, function(counter) {
				EsoBuildCombatRemoveCounter("Kjalnar's Nightmare");
				EsoBuildCombatApplyDamage("set", setData, matchResult[5], "Magic", false, false, false, false);
				EsoBuildCombatAddCooldown("Kjalnar's Nightmare", matchResult[6]);
			});
		},
		match: /for ([0-9.]+) second.*every ([0-9.]+) second[\s\S]+At ([0-9.]+) stacks.*stunning them for ([0-9.]+) seconds, or dealing ([0-9.]+) Magic damage.*for ([0-9.]+) second/i,
	},
	{
		id: "Knight Slayer",
		onHeavyAttack: function(matchResult, setData, skillCastData) {
			var damage = Math.floor(parseFloat(matchResult[1])/100 * g_EsoBuildCombatState.targetHealth);
			var maxDamage = parseInt(matchResult[2]);
			if (damage > maxDamage) damage = maxDamage;
			EsoBuildCombatApplyDamage("set", setData, damage, "Oblivion", false, false, false, false);
		},
		match: /Your fully-charged Heavy Attacks deal an additional ([0-9.]+)% of their Max Health as Oblivion.*maximum of ([0-9.]+) Oblivion/i,
	},
	{
		id: "Knightmare",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || !isMelee) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			EsoBuildCombatAddBuff("set", setData, "Minor Maim (Target)", matchResult[2]);
		},
		match: /When you deal melee damage, you have a ([0-9.]+)% chance to apply Minor Maim.*for ([0-9.]+) second/i,
	},
	{
		id: "Kra'gh",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Kra'gh", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Physical", matchResult[3], matchResult[4], true, false, false);
		},
		match: /a ([0-9.]+)% chance to spawn dreugh.*dealing ([0-9.]+) Physical damage every ([0-9.]+) seconds for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Kvatch Gladiator",
		onTick: function(matchResult, setData) {
			var minHealth = parseFloat(matchResult[2]);
			if (g_EsoBuildCombatState.targetPctHealth <= minHealth && !EsoBuildCombatHasSetToggle("Kvatch Gladiator")) {
				EsoBuildCombatEnableToggle("set", setData, "Kvatch Gladiator", true);
			}
		},
		match: /You gain ([0-9.]+) Weapon Damage against targets who are at or below ([0-9.]+)% Health/i,
	},
	{
		id: "Kyne's Wind",
		onBuff: function(matchResult, setData, buffId) {	//TODO
			if (!buffId.startsWith("Major") || buffId.indexOf("Target") >= 0) return;
			if (!EsoBuildCombatAddNewCooldown("Kyne's Wind", matchResult[4])) return;
			EsoBuildCombatAddRestoreStat("set", setData, "Magicka", matchResult[2], matchResult[3], matchResult[1]);
			EsoBuildCombatAddRestoreStat("set", setData, "Stamina", matchResult[2], matchResult[3], matchResult[1]);
		},
		match: /Kyne's Blessing for ([0-9.]+) seconds.*restore ([0-9.]+) Stamina and Magicka every ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Lunar Bastion",
		onSynergy: function(matchResult, setData, synergyId) { //TODO
			//TODO: Damage Shield
		},
		match: /lunar blessing underneath you for ([0-9.]+) second.*every ([0-9.]+) seconds that absorbs ([0-9.]+) damage/i,
	},
	{
		id: "Maarselok",
		onBash: function(matchResult, setData) { //TODO
			if (!EsoBuildCombatAddNewCooldown("Maarselok", matchResult[5])) return;
			var extraDamage = matchResult[3]/100 * EsoBuildCombatCountTargetNegativeEffects();
			var maxExtraDamage = parseFloat(matchResult[4])/100;
			if (extraDamage > maxExtraDamage) extraDamage = maxExtraDamage;
			EsoBuildCombatAddDot("set", setData, matchResult[1]/matchResult[2] * (1 + extraDamage), "Disease", 1.0, matchResult[2], true, false, false);
		},
		match: /of corruption, dealing ([0-9.]+) Disease damage to enemies over ([0-9.]+) seconds.*by ([0-9.]+) for each negative effect the enemies have, up to ([0-9.]+) additional.*every ([0-9.]+) second/i,
	},
	{
		id: "Mad Tinkerer",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Mad Tinkerer", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Shock", false, true, false, false);
			EsoBuildCombatAddTargetStatus("set", setData, "Stunned", matchResult[3]);
			EsoBuildCombatAddPet("set", setData, "Mad Tinkerer", 1.0);	//TODO: How long are they summoned for?
		},
		match: /a ([0-9.]+)% chance to summon a Verminous Fabricant.*dealing ([0-9.]+) Shock Damage to all.*stunning them for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Magnus' Gift",
		getCostMod: function() {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return 1.0;
			return 0;
		},
		match: /When you cast a Magicka ability, you have an ([0-9.]+)% chance to negate that ability's cost/i,
	},
	{
		id: "Mantle of Siroria",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isAOE) return;
			if (!EsoBuildCombatAddNewCooldown("Mantle of Siroria", matchResult[1])) return;
			EsoBuildCombatAddPlayerStatus("set", setData, "Mantle of Siroria", matchResult[1]);
		},
		onTick: function(matchResult, setData) {
			if (!EsoBuildCombatHasStatusEffect("player", "Mantle of Siroria")) {
				if (!EsoBuildCombatHasCounter("Mantle of Siroria")) EsoBuildCombatRemoveToggle("set", "Mantle of Siroria");
				return;
			}
			if (!EsoBuildCombatAddNewCooldown("Mantle of Siroria (Standing)", matchResult[3])) return;
			var counter = EsoBuildCombatIncrementCounter("Mantle of Siroria", matchResult[3], matchResult[5]);
			EsoBuildCombatUpdateSetToggleCount("Mantle of Siroria", counter.value)
			EsoBuildCombatAddToggle("set", setData, "Mantle of Siroria", matchResult[3]);
		},
		match: /for ([0-9.]+) second.*every ([0-9.]+) seconds.*Siroria's Boon for ([0-9.]+) second.*your Spell Damage by ([0-9.]+).*([0-9.]+) stacks max/i,
	},
	{
		id: "Master Architect",
		onUltimateCast: function(matchResult, setData) {
			EsoBuildCombatAddBuff("set", setData, "Major Slayer", matchResult[1]);
		},
		match: /When you use an Ultimate abilit,*Major Slayer for ([0-9.]+) second/i,
	},
	{
		id: "Maw of the Infernal",
		onLightAttack: function(matchResult, setData) {		//TODO: More accurate damage?
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Maw of the Infernal", matchResult[5])) return;
			//EsoBuildCombatAddDot("set", setData, matchResult[3], "Flame", 1.0, matchResult[2], true, false, true);
			EsoBuildCombatAddPetMawDaedroth("set", setData, matchResult[3], "Flame", matchResult[2], matchResult[4]);
		},
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Maw of the Infernal", matchResult[5])) return;
			//EsoBuildCombatAddDot("set", setData, matchResult[3], "Flame", 1.0, matchResult[2], true, false, true);
			EsoBuildCombatAddPetMawDaedroth("set", setData, matchResult[3], "Flame", matchResult[2], matchResult[4]);
		},
		match: /a ([0-9.]+)% chance to summon a fire breathing Daedroth for ([0-9.]+) second.*deal ([0-9.]+) Flame damage.*alternate once every ([0-9.]+) second[\s\S]+every ([0-9.]+) second/i,
	},
	{
		id: "Mechanical Acuity",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Mechanical Acuity", matchResult[3])) return;
			EsoBuildCombatAddToggle("set", setData, "Mechanical Acuity", matchResult[2]);
		},
		match: /a ([0-9.]+)% chance to gain unerring mechanical vision for ([0-9.]+) seconds.*every ([0-9.]+) second/i,
	},
	{
		id: "Merciless Charge",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Critical Charge") return;
			EsoBuildCombatAddDot("set", setData, matchResult[1], "Physical", 1.0, matchResult[2], false, true, false);
		},
		match: /Dealing damage with Critical Charge causes enemies to bleed for ([0-9.]+) Physical Damage over ([0-9.]+) seconds/i,
	},
	{
		id: "Molag Kena",				//TODO: Exactly how does this set work with weaving now?
		onLightAttack: function(matchResult, setData) {
			var counter = EsoBuildCombatIncrementCounter("Molag Kena", 30, 2);
			if (counter.value == 2) {
				EsoBuildCombatRemoveCounter("Molag Kena");
				EsoBuildCombatAddToggle("set", setData, "Molag Kena", matchResult[1]);
			}
		},
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatRemoveCounter("Molag Kena");
		},
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			EsoBuildCombatRemoveCounter("Molag Kena");
		},
		match: /trigger Overkill for ([0-9.]+) seconds, which increases your Weapon and Spell Damage by/i,
	},
	{
		id: "Moon Hunter",
		onPoison: function(matchResult, setData) {		//TODO
			EsoBuildCombatAddToggle("set", setData, "Moon Hunter", matchResult[1]);
		},
		match: /When your alchemical poison fires, increase your Spell Damage by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Moondancer",
		onSynergy: function(matchResult, setData) {		//TODO
			if (!EsoBuildCombatAddNewCooldown("Moondancer", matchResult[3])) return;
			if (Math.random() < 0.50)
				EsoBuildCombatAddToggle("set", setData, "Moondancer", matchResult[1]);
			else
				EsoBuildCombatAddToggle("set", setData, "Moondancer2", matchResult[1]);
		},
		match: /Spell Damage by ([0-9.]+) or a lunar blessing that increases your Magicka Recovery by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Morkuldin",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatAddNewCooldown("Morkuldin", matchResult[3])) return;		//TODO: Confirm tick time
			//EsoBuildCombatAddDot("set", setData, matchResult[2], "Physical", 1.0, matchResult[1], false, false, true);
			EsoBuildCombatAddPetSimpleDamage("set", setData, "Morkuldin", matchResult[1], 1.0, matchResult[2], "Physical", false, false, false);
		},
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatAddNewCooldown("Morkuldin", matchResult[3])) return;		//TODO: Confirm tick time
			//EsoBuildCombatAddDot("set", setData, matchResult[2], "Physical", 1.0, matchResult[1], false, false, true);
			EsoBuildCombatAddPetSimpleDamage("set", setData, "Morkuldin", matchResult[1], 1.0, matchResult[2], "Physical", false, false, false);
		},
		match: /animated weapon to attack your enemies for ([0-9.]+) second.*deal ([0-9.]+) Physical damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Necropotence",
		onTick: function(matchResult, setData) {
			EsoBuildCombatEnableToggle("set", setData, "Necropotence", EsoBuildCombatHasPetActive());
		},
		match: /While you have a pet active/i,
	},
	{
		id: "Nerien'eth",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Nerien'eth", matchResult[3])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Magic", false, true, false, false);
		},
		match: /a ([0-9.]+)% chance to summon a Lich crystal.*dealing ([0-9.]+) Magic damage to all.*every ([0-9.]+) second/i,
	},
	{
		id: "Night Mother's Gaze",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			EsoBuildCombatAddBuff("set", setData, "Major Fracture (Target)", matchResult[1]);
		},
		match: /When you deal Critical Damage you apply Major Fracture to the enemy.*for ([0-9.]+) second/i,
	},
	{
		id: "Overwhelming Surge",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" && srcData.name == "Overwhelming Surge") {
				var magicka = Math.floor(damage * parseFloat(matchResult[5]) / 100);
				EsoBuildCombatRestoreStat(srcType, srcData, "Magicka", magicka);
			}
			
			if (srcType != "skill" || srcData.skillType != 1) return;
			
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Overwhelming Surge", matchResult[6])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Shock", matchResult[3], matchResult[4], true, false, false);
		},
		match: /a ([0-9.]+)% chance to surround yourself with a torrent that deals ([0-9.]+) Shock Damage to enemies.*every ([0-9.]+) second for ([0-9.]+) second.*([0-9.]+)% of the damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Piercing Spray",
		getFlatResistMod: function(matchResult, setData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			if (srcType != "skill" || srcData.skillLine != "Bow") return;
			if (resistType != "Physical") return 0;
			if (!EsoBuildCombatHasStatusEffect("player", "Piercing Spray")) return 0;
			return -parseInt(matchResult[1]);
		},
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Arrow Spray") return;
			EsoBuildCombatAddPlayerStatus("Piercing Spray", matchResult[2]);
		},
		match: /When you deal damage with Arrow Spray, you cause enemies hit to have ([0-9.]+) less Physical Resistance against Bow attacks for ([0-9.]+) second/i,
	},
	{
		id: "Pillar of Nirn",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Pillar of Nirn", matchResult[5])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Physical", false, true, false, false);
			EsoBuildCombatAddDot("set", setData, matchResult[2]/matchResult[5], "Physical", 1.0, matchResult[5], true, true, false);
		},
		match: /a ([0-9.]+)% chance to create a fissure underneath the enemy after ([0-9.]+) second, dealing ([0-9.]+) Physical Damage to all.*additional ([0-9.]+) Physical Damage over ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Poisonous Serpent",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatHasTargetPoisonEffect()) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Poisonous Serpent", matchResult[3])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Poison", false, false, false, false);
		},
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatHasTargetPoisonEffect()) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Poisonous Serpent", matchResult[3])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Poison", false, false, false, false);
		},
		match: /Poison Damage ability on them, you have a ([0-9.]+)% chance to deal an additional ([0-9.]+) Poison Damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Powerful Assault",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.skillLine != "Assault") return;
			EsoBuildCombatAddToggle("set", setData, "Powerful Assault", matchResult[2]);
		},
		match: /When you cast an Assault ability.*gain ([0-9.]+) Weapon and Spell Damage for ([0-9.]+) second/i,
	},
	{
		id: "Queen's Elegance",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			EsoBuildCombatRemoveToggle("set", "Queen's Elegance");
		},
		onLightAttack: function(matchResult, setData) {
			EsoBuildCombatAddToggle("set", setData, "Queen's Elegance", matchResult[3]);
		},
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatAddPlayerStatus("set", setData, "Queen's Elegance", matchResult[3]);
		},
		getExtraDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatHasStatusEffect("player", "Queen's Elegance")) return 0;
			if (srcType != "skill" || isDOT) return 0;
			EsoBuildCombatRemovePlayerStatus("Queen's Elegance");
			return parseInt(matchResult[2]);
		},
		match: /When you use a Light Attack you reduce.*by ([0-9.]+)%.*next direct damage attack by ([0-9.]+) against [\s\S]+for ([0-9.]+) second/i,
	},
	{
		id: "Rampaging Slash",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Low Slash") return;
			EsoBuildCombatAddPlayerStatus("Rampaging Slash", matchResult[1]);
		},
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatHasStatusEffect("player", "Rampaging Slash")) return;
			EsoBuildCombatRemovePlayerStatus("Rampaging Slash");
			EsoBuildCombatRstoreStat("set", setData, "Magicka", matchResult[2]);
			EsoBuildCombatRstoreStat("set", setData, "Stamina", matchResult[2]);
		},
		match: /When you deal damage with Low Slash.*within ([0-9.]+) seconds restores ([0-9.]+) Magicka and Stamina/i,
	},
	{
		id: "Ravager",
		onDebuff: function(matchResult, setData, buffId) {	//TODO
			if (buffId != "Alkosh (Target)" && buffId != "Crusher Enchantment (Target)" && buffId != "Major Breach (Target)" && buffId != "Major Fracture (Target)" &&
					buffId != "Minor Breach (Target)" && buffId != "Minor Fracture (Target)" && buffId != "Tremorscale (Target)") return;
			if (!EsoBuildCombatAddNewCooldown("Ravager", matchResult[2])) return;
			var counter = EsoBuildCombatIncrementCounter("Ravager", matchResult[1], matchResult[3], -1, null, function(counter) {
				EsoBuildCombatRemoveCounter("Ravager");
				EsoBuildCombatUpdateSetToggleCount("Ravager", counter.value);
				EsoBuildCombatAddToggle("set", setData, "Ravager", matchResult[1]*2);
			});
			if (counter.value < matchResult[3]) {
				EsoBuildCombatUpdateSetToggleCount("Ravager", counter.value);
				EsoBuildCombatAddToggle("set", setData, "Ravager", matchResult[1]);
			}
		},
		match: /stack of Ravager for ([0-9.]+) seconds.*every ([0-9.]+) second.*At ([0-9.]+) stacks/i,
	},
	{
		id: "Roar of Alkosh",
		onSynergy: function(matchResult, setData) {
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Physical", false, true, false, false);
			EsoBuildCombatAddDot("set", setData, matchResult[2]/matchResult[3], "Physical", 1.0, matchResult[3], true, false, false);
			EsoBuildCombatAddToggle("set", setData, "Roar of Alkosh", matchResult[5]);
		},
		match: /deals ([0-9.]+) Physical damage and an additional ([0-9.]+) Physical damage over ([0-9.]+) seconds\. Reduces the Physical and Spell Resistance of any enemy hit by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Roaring Opportunist",
		onHeavyAttack: function(matchResult, setData, haData, damage, damageType) {
			if (!EsoBuildCombatAddNewCooldown("Roaring Opportunist", matchResult[3])) return;
			var minDuration = parseFloat(matchResult[4]);
			var maxDuration = parseFloat(matchResult[5]);
			var duration = damage / matchResult[2];
			if (duration < minDuration) duration = minDuration;
			if (duration > maxDuration) duration = maxDuration;
			EsoBuildCombatAddBuff("set", setData, "Major Slayer", duration);
		},
		match: /Major Slayer.*for ([0-9.]+) second for every ([0-9.]+) damage dealt\. Roaring Opportunist can only affect a target every ([0-9.]+) seconds.[\s\S]+Minimum duration: ([0-9.]+) seconds.[\s\S]+Maximum duration ([0-9.]+) seconds./i,
	},
	{
		id: "Savage Werewolf",
		onLightAttack: function(matchResult, setData, haData, damage, damageType) {
			EsoBuildCombatAddDot("set", setData, matchResult[1], "Physical", matchResult[2], matchResult[3], false, true, false);
		},
		onHeavyAttack: function(matchResult, setData, haData, damage, damageType) {
			EsoBuildCombatAddDot("set", setData, matchResult[1], "Physical", matchResult[2], matchResult[3], false, true, false);
		},
		match: /Your Light and Heavy Attacks rend flesh, causing your enemy to bleed for ([0-9.]+) Physical Damage every ([0-9.]+) second for ([0-9.]+) second/i,
	},
	{
		id: "Scathing Mage",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Scathing Mage", matchResult[4])) return;
			EsoBuildCombatAddToggle("set", setData, "Scathing Mage", matchResult[3]);
		},
		match: /When you deal direct damage, you have a ([0-9.]+)% chance to increase your Spell Damage by ([0-9.]+) for ([0-9.]+) second.* every ([0-9.]+) second/i,
	},
	{
		id: "Scavenging Demise",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (damageType != "Poison") return;
			if (!EsoBuildCombatAddNewCooldown("Scavenging Demise", matchResult[4])) return;
			EsoBuildCombatAddBuff("set", setData, "Minor Vulnerability (Target)", matchResult[3]);		//TODO: Verify tick length
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Poison", 1.0, matchResult[3], false, false, true);
		},
		match: /summon the Scavenging Maw which attacks your enemy after ([0-9.]+) second.*deals ([0-9.]+) Poison Damage and inflicts Minor Vulnerability for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Selene",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || !isMelee) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Selene", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Physical", false, false, false, false);
			
			EsoBuildCombatAddPet("set", setData, "Selene", 0.5);			//TODO: Technically a pet but how long is the summon time?
		},
		match: / a ([0-9.]+)% chance to call on a primal spirit that mauls the closest enemy in front of you after ([0-9.]+) seconds for ([0-9.]+) Physical damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Sellistrix",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatAddNewCooldown("Sellistrix", matchResult[4])) return;
			EsoBuildCombatAddTargetStatus("Stunned", matchResult[3]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Physical", false, true, false, false);
		},
		match: /When you deal damage you create an earthquake under the enemy that erupts after ([0-9.]+) seconds, dealing ([0-9.]+) Physical damage to all.*stunning them for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Senchal Defender",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || srcType == "heavyattack" || isDOT) return;
			EsoBuildCombatIncrementCounter("Senchal Defender", -1, matchResult[1]);
		},
		onHeavyAttack: function(matchResult, setData) {
			var counter = EsoBuildCombatRemoveCounter("Senchal Defender");
			if (counter) {
				EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[2] * counter.value);
				EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[2] * counter.value);
			}
		},
		match: /Senchal's Duty, up to ([0-9.]+) stacks.*restore ([0-9.]+) Stamina and Magick.*every ([0-9.]+) second/i,
	},
	{
		id: "Senche's Bite",
		onRollDodge: function(matchResult, setData) {
			EsoBuildCombatAddToggle("set", setData, "Senche's Bite", matchResult[2]);
		},
		match: /When you use Roll Dodge, increase your Critical Damage by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Seventh Legion Brute",
		onBuff: function(matchResult, setData, buffId) {	//TODO
			if (buffId != "Major Resolve" && buffId != "Minor Resolve") return;
			if (!EsoBuildCombatAddNewCooldown("Seventh Legion Brute", matchResult[4])) return;
			EsoBuildCombatAddToggle("set", setData, "Seventh Legion Brute", matchResult[3]);
		},
		match: /When you cast an ability that increases your Physical or Spell Resistance, you gain ([0-9.]+) Weapon Damage and ([0-9.]+) Health Recovery for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Shadow of the Red Mountain",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Shadow of the Red Mountain", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Flame", false, false, false, false);
		},
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Shadow of the Red Mountain", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Flame", false, false, false, false);
		},
		match: /a ([0-9.]+)% chance to spawn a volcano that erupts after ([0-9.]+) second.*dealing ([0-9.]+) Flame damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Sheer Venom",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {	//TODO?
			if (srcType == "set") return;
			//more damage to enemies below 
		},
		match: /When you deal damage with an Execute ability you infect the enemy, dealing ([0-9.]+) Poison damage over ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Shroud of the Lich",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.mechanic != 0) return;
			if (g_EsoBuildCombat.currentMagicka / g_EsoBuildLastInputValues.Magicka >= 0.33) return;
			if (!EsoBuildCombatAddNewCooldown("Shroud of the Lich", matchResult[4])) return;
			EsoBuildCombatAddToggle("set", setData, "Shroud of the Lich", matchResult[3]);
		},
		match: /under ([0-9.]+)% Magicka, your Magicka Recovery is increased by ([0-9.]+) for ([0-9.]+) second.*every ([0-9.]+) minute/i
	},
	{
		id: "Sload's Semblance",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Sload's Semblance", matchResult[5])) return;
			var damage = Math.floor(g_EsoBuildCombatState.targetMaxHealth * parseFloat(matchResult[2]) / 100);
			var maxDamage = parseFloat(matchResult[6]);
			if (damage > maxDamage) damage = maxDamage;
			EsoBuildCombatAddDot("set", setData, damage, "Oblivion", matchResult[3], matchResult[4], false, false, false);
		},
		match: /a ([0-9.]+)% chance to fire a Shadow Pearl.*dealing ([0-9.]+)% of.*every ([0-9.]+) second for ([0-9.]+) second.*every ([0-9.]+) second[\s\S]+maximum of ([0-9.]+) Oblivion Damage/i,
	},
	{
		id: "Spawn of Mephala",
		onHeavyAttack: function(matchResult, setData) {
			if (!EsoBuildCombatAddNewCooldown("Spawn of Mephala", matchResult[4])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Poison", matchResult[3], matchResult[1], true, false, false);
		},
		match: /create a web for ([0-9.]+) seconds that deals ([0-9.]+) Poison damage every ([0-9.]+) second to all.*every ([0-9.]+) second/i,
	},
	{
		id: "Spectral Cloak",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Blade Cloak") return;
			EsoBuildCombatAddToggle("set", setData, "Spectral Cloak", matchResult[1]);
			EsoBuildCombatAddToggle("set", setData, "Perfected Spectral Cloak", matchResult[1]);
		},
		match: /Dealing damage with Blade Cloak grants you Spectral Cloak for ([0-9.]+) seconds/i,
	},
	{
		id: "Spell Parasite",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatAddNewCooldown("Spell Parasite", matchResult[2])) return;
			EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[1]);
		},
		match: /Whenever you deal damage, you restore ([0-9.]+) Magicka.*every ([0-9.]+) second/i,
	},
	{
		id: "Spell Power Cure",
			//TODO?
		match: /When you heal yourself or an ally that is at ([0-9.]+)% Health, you have a ([0-9.]+)% chance to give the target Major Courage for ([0-9.]+) second/i,
	},
	{
		id: "Spell Strategist",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatAddNewCooldown("Spell Strategist", matchResult[2])) return;
			EsoBuildCombatAddToggle("set", setData, "Spell Strategist", matchResult[1]);
		},
		match: /When you deal damage with a Light Attack, you place a mark over your target for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Storm Master",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatHasPlayerStatus("Storm Master", matchResult[2])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Shock", false, false, false, false);
		},
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "heavyattack") return;
			EsoBuildCombatAddPlayerStatus("Storm Master", matchResult[2]);
		},
		match: /When you deal Critical Damage with a fully-charged Heavy Attack or Overload, your Light Attacks will also deal ([0-9.]+) Shock Damage for ([0-9.]+) second/i,
	},
	{
		id: "Stormfist",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Stormfist", matchResult[6])) return;
			//EsoBuildCombatAddDot("set", setData, matchResult[2], "Shock", matchResult[3], matchResult[4], true, false, false);
			EsoBuildCombatAddPetSimpleDamage("set", setData, "Stormfist", matchResult[3], 1.0, matchResult[2], "Shock", false, false, false);
			EsoBuildCombatApplyDamage("set", setData, matchResult[5], "Physical", false, true, false, false);
		},
		getFlatResistMod: function(matchResult, setData, srcType, srcData, resist, resistType, damageType, isDOT, isAOE) {
			if (srcType != "set" || srcData.name != "Stormfist" || damageType != "Shock") return 0;
			return -100000;
		},
		match: /a ([0-9.]+)% chance to create a thunderfist to crush the enemy, dealing ([0-9.]+) Shock damage every ([0-9.]+) second for ([0-9.]+) second.*final ([0-9.]+) Physical damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Stuhn's Favor",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatHasTargetStatus("Off Balance")) return;
			EsoBuildCombatAddToggle("set", setData, "Stuhn's Favor", matchResult[2]);
		},
		match: /When you deal damage to an enemy who is Off Balance, your Physical and Spell Penetration is increased by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Sunderflame",
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Flame", false, false, false, false);
			EsoBuildCombatAddBuff("set", setData, "Minor Breach (Target)", matchResult[2]);
			EsoBuildCombatAddBuff("set", setData, "Minor Fracture (Target)", matchResult[2]);
		},
		match: /additional ([0-9.]+) Flame Damage and apply Minor Breach and Minor Fracture to the enemy.*for ([0-9.]+) second/i,
	},
	{
		id: "Syvarra's Scales",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Syvarra's Scales", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[3]/matchResult[4], "Poison", 1.0, matchResult[4], true, false, false);
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Poison", false, true, false, false);
		},
		match: /a ([0-9.]+)% chance to cause a burst of lamia poison that deals ([0-9.]+) Poison damage.*additional ([0-9.]+) Poison damage over ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "The Arch-Mage",
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatAddToggle("set", setData, "The Arch-Mage", matchResult[2]);
		},
		match: /Dealing damage with a fully-charged Heavy Attack increases your Magicka Recovery by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "The Ice Furnace",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || damageType != "Frost") return;
			if (!EsoBuildCombatAddNewCooldown("The Ice Furnace", matchResult[2])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Flame", false, true, false, false);
		},
		match: /When you deal Frost Damage, you deal an additional ([0-9.]+) Flame Damage to all.*every ([0-9.]+) second/i,
	},
	{
		id: "The Morag Tong",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || isDOT) return;
			EsoBuildCombatAddToggle("set", setData, "The Morag Tong", matchResult[2]);
		},
		match: /When you deal direct damage, you cause the enemy to take ([0-9.]+)% more damage from all Poison Damage abilities for ([0-9.]+) second/i,
	},
	{
		id: "Thunderous Volley",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Volley") return;
			g_EsoBuildCombatVolleyCounter = 0;
		},
		getExtraDamage: function(matchResult, setData, srcType, srcData) {		//TODO: Include +DamageDone?
			if (srcType != "skill" || srcData.baseName != "Volley") return 0;
			var maxCount = parseInt(matchResult[3]);
			if (g_EsoBuildCombatVolleyCounter > maxCount) g_EsoBuildCombatVolleyCounter = maxCount;
			var extraDamage = parseInt(matchResult[1]) + parseInt(matchResult[2])*(g_EsoBuildCombatVolleyCounter);
			++g_EsoBuildCombatVolleyCounter;
			return extraDamage;
		},
		match: /Increases the damage Volley deals by ([0-9.]+) each.*by ([0-9.]+) every time Volley ticks, up to a maximum of ([0-9.]+) time/i,
	},
	{
		id: "Timeless Blessing",
		onAnySkillCast: function(matchResult, setData, skillCastData) {
			if (skillCastData.baseName != "Blessing of Protection") return;
			EsoBuildCombatAddToggle("set", setData, "Timeless Blessing", matchResult[2]);
		},
		match: /When you cast Blessing of Protection, the cost of your Magicka and Stamina healing abilities are reduced by ([0-9.]+)% for ([0-9.]+) second/i,
	},
	{
		id: "Titanic Cleave",
		getExtraDamage: function(matchResult, setData, srcType, srcData) {
			if (srcType != "skill" || srcData.baseName != "Cleave") return 0;
			return matchResult[1] * 1;			//TODO: Option for more enemies?
		},
		match: /Increases the direct damage Cleave deals by ([0-9.]+) for each enemy in its cone/i,
	},
	{
		id: "Tooth of Lokkestiiz",
		onSynergy: function(matchResult, setData) {
			EsoBuildCombatAddBuff("set", setData, "Major Slayer", matchResult[1]);
		},
		match: /When you activate a synergy, gain Major Slayer for ([0-9.]+) second/i,
	},
	{
		id: "Torc of Tonal Constancy",
		onTick: function(matchResult, setData) {		//TODO: Test if both effects are exclusive or not
			if (g_EsoBuildCombatState.currentStamina < g_EsoBuildLastInputValues.Stamina * 0.5) {
				EsoBuildCombatAddToggle("set", setData, "Torc of Tonal Constancy (Stamina)", -1);
			}
			if (g_EsoBuildCombatState.currentMagicka < g_EsoBuildLastInputValues.Magicka * 0.5) {
				EsoBuildCombatAddToggle("set", setData, "Torc of Tonal Constancy (Magicka)", -1);
			}
		},
		match: /While your Stamina is less than ([0-9.]+)%, increase your Magicka Recovery by ([0-9.]+)\. While your Magicka is less than ([0-9.]+)%, increase your Stamina Recovery by ([0-9.]+)/i,
	},
	{
		id: "Trappings of Invigoration",
		onAnySkillCast: function(matchResult, setData, skillCastData, cost) {
			if (cost <= 0) return;
			if (g_EsoBuildCombatState.currentStamina < g_EsoBuildLastInputValues.Stamina * parseFloat(matchResult[1]) / 100) {
				if (!EsoBuildCombatAddNewCooldown("Trappings of Invigoration", matchResult[3])) return;
				EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[2]);
			}
		},
		match: /When you cast an ability that costs resources while under ([0-9.]+)% Stamina, you restore ([0-9.]+) Stamina.*every ([0-9.]+) second/i,
	},
	{
		id: "Tremorscale",
		onTaunt: function(matchResult, setData, skillCastData) {
			if (!EsoBuildCombatAddNewCooldown("Tremorscale", matchResult[4])) return;
			EsoBuildCombatAddBuff("set", setData, "Tremorscale (Target)", matchResult[3]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[1], "Physical", false, true, false, false);
		},
		match: /duneripper to burst from the ground beneath.*dealing ([0-9.]+) Physical damage to all.*Physical Resistance by ([0-9.]+) for ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Trinimac's Valor",
		onDamageShield: function(matchResult, setData) {		//TODO
			if (!EsoBuildCombatAddNewCooldown("Trinimac's Valor", matchResult[3])) return;
			EsoBuildCombatRestoreStat("set", setData, "Health", matchResult[2]);
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Magic", false, true, false, false);
		},
		match: /you call down a fragment of Trinimac that heals you and your allies for ([0-9.]+) Health and damages enemies for ([0-9.]+) Magic damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Twice-Fanged Serpent",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			var counter = EsoBuildCombatIncrementCounter("Twice-Fanged Serpent", matchResult[2], matchResult[3]);
			EsoBuildCombatUpdateSetToggleCount("Twice-Fanged Serpent", counter.value)
			EsoBuildCombatAddToggle("set", setData, "Twice-Fanged Serpent", matchResult[3]);
		},
		match: /When you deal damage, your Physical Penetration is increased by ([0-9.]+) for ([0-9.]+) seconds, stacking up to ([0-9.]+) times/i,
	},
	{
		id: "Tzogvin's Warband",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			var counter = EsoBuildCombatIncrementCounter("Tzogvin's Warband", matchResult[2], matchResult[3]);
			EsoBuildCombatUpdateSetToggleCount("Tzogvin's Warband", counter.value);
			EsoBuildCombatAddToggle("set", setData, "Tzogvin's Warband", matchResult[2]);
		},
		match: /you gain a stack of Precision, increasing your Weapon Critical by ([0-9.]+) for ([0-9.]+) seconds, up to ([0-9.]+) stacks max/i,
	},
	{
		id: "Undaunted Infiltrator",
		onAnySkillCast: function(matchResult, setData, skillCastData, cost) {
			if (skillCastData.mechanic != 0 || cost <= 0) return;
			EsoBuildCombatAddToggle("set", setData, "Undaunted Infiltrator", matchResult[3]);
		},
		match: /costs Magicka, your Light Attacks deal an additional ([0-9.]+) damage and Heavy Attacks deal an additional ([0-9.]+) damage for ([0-9.]+) second/i,
	},
	{
		id: "Undaunted Unweaver",
		onAnySkillCast: function(matchResult, setData, skillCastData, cost) {
			if (skillCastData.mechanic != 6 || cost <= 0) return;
			EsoBuildCombatAddToggle("set", setData, "Undaunted Unweaver", matchResult[3]);
		},
		match: /costs Stamina, your Light Attacks deal an additional ([0-9.]+) damage and Heavy Attacks deal an additional ([0-9.]+) damage for ([0-9.]+) second/i,
	},
	{
		id: "Unfathomable Darkness",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Unfathomable Darkness", matchResult[5])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[4], "Physical", matchResult[3], matchResult[2], false, false, false);
		},
		match: /a ([0-9.]+)% chance to call a murder of crows around you for ([0-9.]+) second.*Every ([0-9.]+) seconds a crow.*dealing ([0-9.]+) Physical Damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Valkyn Skoria",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || !isDOT) return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Unfathomable Darkness", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Flame", false, true, false, false);
		},
		match: /you have a ([0-9.]+)% chance to summon a meteor that deals ([0-9.]+) Flame damage to the target and ([0-9.]+) Flame damage to all.*every ([0-9.]+) second/i,
	},
	{
		id: "Velidreth",			//TODO: Number of spores that hit the target?
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Velidreth", matchResult[4])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[3], "Disease", false, false, false, false);
		},
		match: /a ([0-9.]+)% chance to spawn ([0-9.]+) disease spores.*deal ([0-9.]+) Disease damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Venomous Smite",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (!EsoBuildCombatAddNewCooldown("Venomous Smite", matchResult[4])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[2], "Poison", matchResult[3], matchResult[1], true, false, false);
		},
		match: /Venom on your enemy for ([0-9.]+) seconds, dealing ([0-9.]+) Poison Damage.*every ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Vestment of Olorime",
			//TODO:?
		match: /Casting abilities that leave an effect on the ground in combat will create a circle of might for ([0-9.]+) second.*gain Major Courage for ([0-9.]+) second.*every 10 second/i,
	},
	{
		id: "Vestments of the Warlock",
		onAnySkillCast: function(matchResult, setData, skillCastData, cost) {
			if (cost <= 0) return;
			if (g_EsoBuildCombatState.currentStamina < g_EsoBuildLastInputValues.Stamina * parseFloat(matchResult[1]) / 100) {
				if (!EsoBuildCombatAddNewCooldown("Vestments of the Warlock", matchResult[3])) return;
				EsoBuildCombatRestoreStat("set", setData, "Magicka", matchResult[2]);
			}
		},
		match: /under ([0-9.]+)% Magicka, you restore ([0-9.]+) Magicka.*every ([0-9.]+) second/i,
	},
	{
		id: "Viper's Sting",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || !isMelee) return;
			if (!EsoBuildCombatAddNewCooldown("Viper's Sting", matchResult[3])) return;
			EsoBuildCombatAddDot("set", setData, matchResult[1]/matchResult[2], "Poison", 1.0, matchResult[2], false, false, false);
		},
		match: /When you deal damage with a melee attack, you deal an additional ([0-9.]+) Poison Damage over ([0-9.]+) second.*every ([0-9.]+) second/i,
	},
	{
		id: "Virulent Shot",			//TODO: Variation on range/duration?
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType != "skill" || srcData.baseName != "Scatter Shot") return;
			var damage = Math.floor(parseFloat(matchResult[1])/100 * damage);
			EsoBuildCombatAddDot("set", setData, damage, "Poison", matchResult[2], matchResult[3], false, false, false);
		},
		match: /Scatter Shot applies a damage over time effect that deals ([0-9.]+)% of your initial attack as Poison Damage every ([0-9.]+) seconds for ([0-9.]+) second/,
		 					//The duration increases if you are farther away from your target to a maximum of 12 seconds.
	},
	{
		id: "Way of Air",
		onRollDodge: function(matchResult, setData) {
			EsoBuildCombatAddToggle("set", setData, "Way of Air", matchResult[2]);
		},
		match: /When you use Roll Dodge, your Weapon and Spell Damage is increased by ([0-9.]+) for ([0-9.]+) second/i,
	},
	{
		id: "Way of Fire",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Way of Fire", matchResult[3])) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Flame", false, false, false, false);
		},
		match: /you have a ([0-9.]+)% chance to deal an additional ([0-9.]+) Flame damage.*every ([0-9.]+) second/i,
	},
	{
		id: "Way of Martial Knowledge",
		onLightAttack: function(matchResult, setData) {
			if (g_EsoBuildCombatState.currentStamina >= g_EsoBuildLastInputValues.Stamina * parseFloat(matchResult[1]) / 100) return;
			if (!EsoBuildCombatAddNewCooldown("Way of Martial Knowledge", matchResult[4])) return;
			EsoBuildCombatAddToggle("set", setData, "Way of Martial Knowledge", matchResult[3]);
		},
		match: /While your Stamina is below ([0-9.]+)%, your Light Attacks cause the enemy to take ([0-9.]+)% additional damage for ([0-9.]+) seconds.*every ([0-9.]+) second/i,
	},
	{
		id: "Widowmaker",
		onPoison: function(matchResult, setData) {		//TODO
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Poison", false, true, false, false);
		},
		match: /you drop a poisonous spore in front of you that bursts after ([0-9.]+) second, dealing ([0-9.]+) Poison Damage/i,
	},
	{
		id: "Wild Impulse",
		onAnySkillCast: function(matchResult, setData, skillCastData, cost) {
			if (skillCastData.baseName != "Impulse") return;
			EsoBuildCombatAddDot("set", setData, matchResult[1]/matchResult[4], "Flame", 1.0, matchResult[4], false, false, false);
			EsoBuildCombatAddDot("set", setData, matchResult[2]/matchResult[4], "Shock", 1.0, matchResult[4], false, false, false);
			EsoBuildCombatAddDot("set", setData, matchResult[3]/matchResult[4], "Frost", 1.0, matchResult[4], false, false, false);
		},
		match: /Impulse places lingering elemental damage on your targets, dealing ([0-9.]+) Flame, ([0-9.]+) Shock, and ([0-9.]+) Frost Damage over ([0-9.]+) second/i,
	},
	{
		id: "Winterborn",
		onAnyDamage: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (srcType == "set" || damageType != "Frost") return;
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			EsoBuildCombatApplyDamage("set", setData, matchResult[2], "Frost", false, true, false, false);
		},
		match: /an ([0-9.]+)% chance to summon an ice pillar that deals ([0-9.]+) Frost damage to all/i,
	},
	{
		id: "Wise Mage",
		onHeavyAttack: function(matchResult, setData) {
			EsoBuildCombatAddBuff("set", setData, "Minor Vulnerability (Target)", matchResult[1]);
		},
		match: /Enemies you damage with fully-charged Heavy Attacks are afflicted with Minor Vulnerability for ([0-9.]+) second/i,
	},
	{
		id: "Witchman Armor",
		onUltimateCast: function(matchResult, skillData, ultimateData, ultimateCost) {
			EsoBuildCombatRestoreStat("set", setData, "Health",  matchResult[1]*ultimateCost);
			EsoBuildCombatRestoreStat("set", setData, "Stamina", matchResult[2]*ultimateCost);
		},
		match: /When you use an Ultimate ability, you heal for ([0-9.]+) Health and restore ([0-9.]+) Stamina per point of the Ultimate's cost/i,
	},
	{
		id: "Wrath of the Imperium",
		getCritChanceMod: function(matchResult, setData, srcType, srcData, damageType, isDOT, isAOE, isBleed) {
			if (srcType != "skill" || isDOT) return 0;
			if (srcType.maxRange <= ESOBUILDCOMBAT_MAXMELEE_RANGE) return 0;
			return ConvertEsoFlatCritToPercent(parseFloat(matchResult[1]))/100;
		},
		match: /Adds ([0-9.]+) Spell Critical to your ranged direct damage abilities./i,
	},
	{
		id: "Yandir's Might",
		onCrit: function(matchResult, setData, srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee) {
			if (EsoBuildCombatHasCooldown("Giant's Might")) return;
			if (!EsoBuildCombatAddNewCooldown("Giant's Endurance", 1.0)) return;
			var counter = EsoBuildCombatIncrementCounter("Giant's Endurance", -1, matchResult[2]);
			EsoBuildCombatUpdateSetToggleCount("Yandir's Might (Giant's Endurance)", counter.value)
			EsoBuildCombatAddToggle("set", setData, "Yandir's Might (Giant's Endurance)", -1);
		},
		onHeavyAttack: function(matchResult, setData) {			//TODO: Test
			var counter = EsoBuildCombatRemoveCounter("Giant's Endurance");
			if (counter == null || counter.value == 0) return;
			EsoBuildCombatRemoveToggle("set", "Yandir's Might (Giant's Endurance)");
			EsoBuildCombatUpdateSetToggleCount("Yandir's Might (Giant's Might)", counter.value)
			EsoBuildCombatAddToggle("set", setData, "Yandir's Might (Giant's Might)", matchResult[3]);
		},
		match: /Each stack of Giant's Endurance adds ([0-9.]+) Stamina Recovery, and stacks up to ([0-9.]+) times[\s\S]+grants Giant's Might for ([0-9.]+) seconds/i,
	},
	{
		id: "Z'en's Redress",
		onLightAttack: function(matchResult, setData) {
			var count = EsoBuildCombatCountTargetDots();
			var maxCount = parseInt(matchResult[3]);
			if (count > maxCount) count = maxCount;
			EsoBuildCombatUpdateSetToggleCount("Z'en's Redress", count);
			EsoBuildCombatAddToggle("set", setData, "Z'en's Redress", matchResult[1]);
		},
		match: /Touch of Z'en on enemies for ([0-9.]+) second.*additional ([0-9.]+)% more damage.*up to ([0-9.]+)%/i,
	},
	{
		id: "Zaan",
		onLightAttack: function(matchResult, setData) {
			if (!EsoBuildCombatCheckRandom(parseFloat(matchResult[1])/100, "set", setData)) return;
			if (!EsoBuildCombatAddNewCooldown("Zaan", matchResult[6])) return;
			g_EsoBuildCombatZaanCounter = 0;
			EsoBuildCombatAddDot("set", setData, matchResult[1], "Flame", matchResult[3], matchResult[4], false, false, false);
		},
		getExtraDamage: function(matchResult, setData, srcType, srcData) {		//TODO: Include +DamageDone?
			if (srcType != "set" || srcData.name != "Zaan") return 0;
			var extraDamage = Math.floor(parseInt(matchResult[2])*(1 + parseFloat(matchResult[5])/100) * g_EsoBuildCombatZaanCounter);
			++g_EsoBuildCombatZaanCounter;
			return extraDamage;
		},
		match: /a ([0-9.]+)% chance to create a beam.*deals ([0-9.]+) Flame damage every ([0-9.]+) second to your enemy for ([0-9.]+) second.*increases by ([0-9.]+)%.*every ([0-9.]+) second/i,
	},
	
];


window.ESOBUILD_UNIQUESKILLID_MIN = 101;

window.ESOBUILD_UNIQUESKILLID_BARSWAP1 = 101;
window.ESOBUILD_UNIQUESKILLID_BARSWAP2 = 102;
window.ESOBUILD_UNIQUESKILLID_BARSWAP3 = 103;
window.ESOBUILD_UNIQUESKILLID_BARSWAP4 = 104;
window.ESOBUILD_UNIQUESKILLID_WAIT = 105;
window.ESOBUILD_UNIQUESKILLID_POTION = 106;
window.ESOBUILD_UNIQUESKILLID_ROLLDODGE = 107;
window.ESOBUILD_UNIQUESKILLID_BASH = 108;

window.ESOBUILD_UNIQUESKILLID_LAMIN = 110;
window.ESOBUILD_UNIQUESKILLID_LAFLAMEDEST = 110;
window.ESOBUILD_UNIQUESKILLID_LAFROSTDEST = 111;
window.ESOBUILD_UNIQUESKILLID_LASHOCKDEST = 112;
window.ESOBUILD_UNIQUESKILLID_LARESTORATION = 113;
window.ESOBUILD_UNIQUESKILLID_LAUNARMED = 114;
window.ESOBUILD_UNIQUESKILLID_LAONEHANDANDSHIELD = 115;
window.ESOBUILD_UNIQUESKILLID_LADUALWIELD = 116;
window.ESOBUILD_UNIQUESKILLID_LATWOHANDED = 117;
window.ESOBUILD_UNIQUESKILLID_LABOW = 118;
window.ESOBUILD_UNIQUESKILLID_LAWEREWOLF = 119;
window.ESOBUILD_UNIQUESKILLID_LAOVERLOAD = 120;
window.ESOBUILD_UNIQUESKILLID_LA = 121;
window.ESOBUILD_UNIQUESKILLID_LAMAX = 121;

window.ESOBUILD_UNIQUESKILLID_HAMIN = 130;
window.ESOBUILD_UNIQUESKILLID_HAFLAMEDEST = 130;
window.ESOBUILD_UNIQUESKILLID_HAFROSTDEST = 131;
window.ESOBUILD_UNIQUESKILLID_HASHOCKDEST = 132;
window.ESOBUILD_UNIQUESKILLID_HARESTORATION = 133;
window.ESOBUILD_UNIQUESKILLID_HAUNARMED = 134;
window.ESOBUILD_UNIQUESKILLID_HAONEHANDANDSHIELD = 135;
window.ESOBUILD_UNIQUESKILLID_HADUALWIELD = 136;
window.ESOBUILD_UNIQUESKILLID_HATWOHANDED = 137;
window.ESOBUILD_UNIQUESKILLID_HABOW = 138;
window.ESOBUILD_UNIQUESKILLID_HAWEREWOLF = 139;
window.ESOBUILD_UNIQUESKILLID_HAOVERLOAD = 140;
window.ESOBUILD_UNIQUESKILLID_HA = 141;
window.ESOBUILD_UNIQUESKILLID_HAMAX = 141;

window.ESOBUILD_UNIQUESKILLID_MAX = 200;


window.ESOBUILD_COMBAT_UNIQUE_SKILLS = [
	{
		abilityId: ESOBUILD_UNIQUESKILLID_BARSWAP1,
		name: "Swap to Bar #1",
		description: "Swap to Ability Bar #1",
		icon: "/esoui/art/icons/ability_warrior_003.png",
		duration: 0,
		castTime: 100,
		skillBarIndex: 1,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_BARSWAP2,
		name: "Swap to Bar #2",
		description: "Swap to Ability Bar #2",
		icon: "/esoui/art/icons/ability_warrior_003.png",
		duration: 0,
		castTime: 100,
		skillBarIndex: 2,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_BARSWAP3,
		name: "Swap to Bar #3",
		description: "Swap to Ability Bar #3",
		icon: "/esoui/art/icons/ability_warrior_003.png",
		duration: 0,
		castTime: 100,		skillBarIndex: 3,
	},
	{		// Automatic switch when casting werewolf ultimate?
		abilityId: ESOBUILD_UNIQUESKILLID_BARSWAP4,
		name: "Swap to Bar #4",
		description: "Swap to Werewolf Ability Bar",
		icon: "/esoui/art/icons/ability_warrior_003.png",
		duration: 0,
		castTime: 100,
		skillBarIndex: 4,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_WAIT,
		name: "Wait",
		description: "Wait X seconds before starting the next player action.",
		icon: "/esoui/art/icons/achievement_scalecaller_peak_time.png",
		duration: 0,
		castTime: 0,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_POTION,
		name: "Use Potion",
		description: "Drink the selected potion.",
		icon: "/esoui/art/icons/consumable_potion_001_type_005.png",
		duration: ESOBUILDCOMBAT_POTION_DURATION*1000,
		cooldown: ESOBUILDCOMBAT_POTION_COOLDOWN*1000,
		castTime: 100,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_ROLLDODGE,
		name: "Roll Dodge",
		description: "Perform a roll dodge maneuver.",
		icon: "/esoui/art/icons/ability_rogue_035.png",
		duration: 0,
		castTime: 1000,		//TODO
		getCostFunc: function() { return g_EsoBuildLastInputValues['RollDodgeCost']; },
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_BASH,
		name: "Bash",
		description: "Bash the target.",
		icon: "/esoui/art/icons/ability_debuff_stun.png",
		duration: 0,
		castTime: 500,	//TODO
		getDamageFunc: function() { return g_EsoBuildLastInputValues['BashDamage']; },
		getCostFunc: function() { return g_EsoBuildLastInputValues['BashCost']; },
		getCostStatFunc: function() { return "Stamina"; },
		damageType: "Physical",
	},
	
		// Light Attacks
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LA,
		name: "Light Attack",
		description: "Light Attack with your currently equipped weapon.",
		icon: "/esoui/art/icons/death_recap_melee_basic.png",
		getDamageFunc: function() { return 0; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		cost: 0,
		castTime: ESOBUILD_GLOBALDELAY_TIME*1000,
		quickCastTime: 250,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAFLAMEDEST,
		sourceAbilityId: 16165,
		name: "Light Attack (Flame Destruction)",
		description: "Light Attack with a Flame Destruction Staff.",
		icon: "/esoui/art/icons/death_recap_fire_ranged.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAFlameStaff']; },
		damageType: "Flame",
		duration: 0,
		mechanic: 0,
		castTime: 700,
		quickCastTime: 250,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAFROSTDEST,
		sourceAbilityId: -1,
		name: "Light Attack (Frost Destruction)",
		description: "Light Attack with a Frost Destruction Staff.",
		icon: "/esoui/art/icons/death_recap_cold_ranged.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAFrostStaff']; },
		damageType: "Frost",
		duration: 0,
		mechanic: 0,
		castTime: 700,
		cost: 0,
		quickCastTime: 250,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LASHOCKDEST,
		sourceAbilityId: -1,
		name: "Light Attack (Shock Destruction)",
		description: "Light Attack with a Shock Destruction Staff.",
		icon: "/esoui/art/icons/death_recap_shock_ranged.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAShockStaff']; },
		damageType: "Shock",
		duration: 0,
		mechanic: 0,
		castTime: 800,
		quickCastTime: 350,
		cost: 0,
		isDOT: true,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LARESTORATION,
		sourceAbilityId: -1,
		name: "Light Attack (Restoration)",
		description: "Light Attack with a Restoration Staff.",
		icon: "/esoui/art/icons/death_recap_magic_ranged.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LARestorationStaff']; },
		damageType: "Magic",
		duration: 0,
		mechanic: 0,
		castTime: 700,
		quickCastTime: 350,
		cost: 0,
		isDOT: true,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAUNARMED,
		sourceAbilityId: 16688,
		name: "Light Attack (Unarmed)",
		description: "Light Attack when Unarmed.",
		icon: "/esoui/art/icons/death_recap_melee_basic.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAUnarmed']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: true,
		castTime: 900,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAONEHANDANDSHIELD,
		sourceAbilityId: 16499,
		name: "Light Attack (One Hand and Shield)",
		description: "Light Attack with One Hand and Shield.",
		icon: "/esoui/art/icons/death_recap_melee_basic.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAOneHand']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: true,
		castTime: 900,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LADUALWIELD,
		sourceAbilityId: -1,
		name: "Light Attack (Dual Wield)",
		description: "Light Attack when Dual Wielding two weapons.",
		icon: "/esoui/art/icons/death_recap_melee_basic.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LADualWield']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: true,
		castTime: 800,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LATWOHANDED,
		sourceAbilityId: 16037,
		name: "Light Attack (Two-Handed)",
		description: "Light Attack with a Two-Handed weapon.",
		icon: "/esoui/art/icons/death_recap_melee_basic.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LATwoHand']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: true,
		castTime: 1000,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LABOW,
		sourceAbilityId: 32464,
		name: "Light Attack (Bow)",
		description: "Light Attack with a Bow.",
		icon: "/esoui/art/icons/death_recap_ranged_basic.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LABow']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: false,
		castTime: 700,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAWEREWOLF,
		sourceAbilityId: 62426,
		name: "Light Attack (Werewolf)",
		description: "Light Attack when in Werewolf form.",
		icon: "/esoui/art/icons/death_recap_fire_ranged.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAWerewolf']; },
		damageType: "Physical",
		duration: 0,
		mechanic: 6,
		isMelee: true,
		castTime: 600,
		quickCastTime: 350,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_LAOVERLOAD,
		sourceAbilityId: -1,
		name: "Light Attack (Overload)",
		description: "Light Attack with the Overload ultimate.",
		icon: "/esoui/art/icons/ability_sorcerer_overload.png",
		getDamageFunc: function() {
			if (g_EsoBuildCombatState.overloadSkillData == null) return 0;
			var desc = GetEsoSkillDescription(g_EsoBuildCombatState.overloadSkillData.abilityId, null, false, true, false);
			var matchResult = desc.match(/Light Attacks become lightning bolts, dealing ([0-9]+) Shock Damage/i);
			if (!matchResult || !matchResult[1]) return 0;
			return parseInt(matchResult[1]); 
		},
		damageType: "Shock",
		duration: 0,
		mechanic: 0,
		castTime: 800,
		quickCastTime: 600,	// TODO: Verify?
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	
		// Heavy Attacks
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HA,
		name: "Heavy Attack",
		description: "Heavy Attack with your currently equipped weapon.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",
		getDamageFunc: function() { return 0; },
		getRestoreFunc: function() { return 0; },
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		mechanic: 0,
		castTime: 1500,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAFLAMEDEST,
		sourceAbilityId: -1,
		name: "Heavy Attack (Flame Destruction)",
		description: "Heavy Attack with a Flame Destruction Staff.",
		icon: "/esoui/art/icons/ability_mage_062.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HAFlameStaff']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreFlameStaff']; },
		damageType: "Flame",
		restoreStat: "Magicka",
		duration: 0,
		mechanic: 0,
		castTime: 2200,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAFROSTDEST,
		sourceAbilityId: -1,
		name: "Heavy Attack (Frost Destruction)",
		description: "Heavy Attack with a Frost Destruction Staff.",
		icon: "/esoui/art/icons/ability_mage_047.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HAFrostStaff']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreFrostStaff']; },
		damageType: "Frost",
		restoreStat: "Magicka",
		duration: 0,
		mechanic: 0,
		castTime: 2200,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HASHOCKDEST,
		sourceAbilityId: -1,
		name: "Heavy Attack (Shock Destruction)",
		description: "Heavy Attack with a Shock Destruction Staff.",
		icon: "/esoui/art/icons/death_recap_shock_ranged.png",				// Is meant to be LA since this is damage per tick
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LAShockStaff']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreShockStaff']; },
		onFinalHit: function() { EsoBuildCombatApplyDamage("heavyattackfinal", g_SkillsData[ESOBUILD_UNIQUESKILLID_HASHOCKDEST], g_EsoBuildLastInputValues['HAShockStaffFinal'], "Shock", false, false, false, false); },
		damageType: "Shock",
		restoreStat: "Magicka",
		duration: 1800,
		mechanic: 0,
		tickTime: 830,
		castTime: 2500,
		cost: 0,
		isDOT: true,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HARESTORATION,
		sourceAbilityId: -1,
		name: "Heavy Attack (Restoration)",
		description: "Heavy Attack with a Restoration Staff.",
		icon: "/esoui/art/icons/death_recap_magic_ranged.png",				// Is meant to be LA since this is damage per tick
		getDamageFunc: function() { return g_EsoBuildLastInputValues['LARestorationStaff']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreRestStaff']; },
		onFinalHit: function() { EsoBuildCombatApplyDamage("heavyattackfinal", g_SkillsData[ESOBUILD_UNIQUESKILLID_HARESTORATION], g_EsoBuildLastInputValues['HARestorationFinal'], "Magic", false, false, false, false); },
		damageType: "Magic",
		restoreStat: "Magicka",
		duration: 1600,
		mechanic: 0,
		tickTime: 800,
		castTime: 2300,
		cost: 0,
		isDOT: true,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAUNARMED,
		sourceAbilityId: -1,
		name: "Heavy Attack (Unarmed)",
		description: "Heavy Attack when Unarmed.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HAUnarmed']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestore1HS']; },	// TODO: Verify
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		isMelee: true,
		mechanic: 6,
		castTime: 1700,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAONEHANDANDSHIELD,
		sourceAbilityId: -1,
		name: "Heavy Attack (One Hand and Shield)",
		description: "Heavy Attack with One Hand and Shield.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HAOneHand']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestore1HS']; },
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		isMelee: true,
		mechanic: 6,
		castTime: 1700,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HADUALWIELD,
		sourceAbilityId: -1,
		name: "Heavy Attack (Dual Wield)",
		description: "Heavy Attack when Dual Wielding two weapons.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HADualWield']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreDW']; },
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		isMelee: true,
		isDualWield: true,
		mechanic: 6,
		castTime: 1700,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HATWOHANDED,
		sourceAbilityId: -1,
		name: "Heavy Attack (Two-Handed)",
		description: "Heavy Attack with a Two-Handed weapon.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",		// http://esoicons.uesp.net/esoui/art/icons/ability_warrior_034.png
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HATwoHand']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestore2H']; },
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		isTwoHanded: true,
		isMelee: true,
		mechanic: 6,
		castTime: 1900,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HABOW,
		sourceAbilityId: -1,
		name: "Heavy Attack (Bow)",
		description: "Heavy Attack with a Bow.",
		icon: "/esoui/art/icons/ability_warrior_006.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HABow']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreBow']; },
		damageType: "Physical",
		restoreStat: "Stamina",
		duration: 0,
		isMelee: false,
		isBow: true,
		mechanic: 6,
		castTime: 2500,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAWEREWOLF,
		sourceAbilityId: -1,
		name: "Heavy Attack (Werewolf)",
		description: "Heavy Attack when in Werewolf form.",
		icon: "/esoui/art/icons/death_recap_melee_heavy.png",
		getDamageFunc: function() { return g_EsoBuildLastInputValues['HAWerewolf']; },
		getRestoreFunc: function() { return g_EsoBuildLastInputValues['HARestoreWerewolf']; },
		restoreStat: "Stamina",
		damageType: "Physical",
		duration: 0,
		isMelee: true,
		mechanic: 6,
		castTime: 2300,
		cost: 0,
		isDOT: false,
		isAOE: false,
	},
	{
		abilityId: ESOBUILD_UNIQUESKILLID_HAOVERLOAD,
		sourceAbilityId: -1,
		name: "Heavy Attack (Overload)",
		description: "Heavy Attack with the Overload ultimate.",
		icon: "/esoui/art/icons/ability_sorcerer_overload.png",
		getDamageFunc: function() { 
			if (g_EsoBuildCombatState.overloadSkillData == null) return 0;
			var desc = GetEsoSkillDescription(g_EsoBuildCombatState.overloadSkillData.abilityId, null, false, true, false);
			var matchResult = desc.match(/Heavy Attacks blast enemies in a [0-9]+ x [0-9]+ area for ([0-9]+) Shock Damage/i);
			if (!matchResult || !matchResult[1]) return 0;
			return parseInt(matchResult[1]);
		},
		getRestoreFunc: function() { return 0; },
		damageType: "Shock",
		duration: 0,
		mechanic: 0,
		cost: 0,
		castTime: 1000,
		isDOT: false,
		isAOE: true,
	},
	
];


window.ESOBUILD_COMBAT_POTIONDATA = {
	"Potion of Restore Health": {
		restoreHealth: 8369,
		restoreMagicka: 0,
		restoreStamina: 0,
		buffs: ["Major Fortitude"],
	},
	"Potion of Restore Magicka": {
		restoreHealth: 0,
		restoreMagicka: 7582,
		restoreStamina: 0,
		buffs: ["Major Intellect"],
	},
	"Potion of Restore Stamina": {
		restoreHealth: 0,
		restoreMagicka: 0,
		restoreStamina: 7582,
		buffs: ["Major Endurance"],
	},
	"Potion of Spell Power": {
		restoreHealth: 0,
		restoreMagicka: 7582,
		restoreStamina: 0,
		buffs: ["Major Sorcery", "Major Intellect", "Major Prophecy"],
	},
	"Potion of Weapon Power": {
		restoreHealth: 0,
		restoreMagicka: 0,
		restoreStamina: 7582,
		buffs: ["Major Brutality", "Major Savagery", "Major Endurance"],
	},
	"Potion of Vitality": {
		restoreHealth: 8369,
		restoreMagicka: 0,
		restoreStamina: 0,
		restoreOverTime: { 
			stat: "Health", 
			amount:  898,
			duration: 13.0 
		},
		durations: [ 12.0, -1 ],
		buffs: ["Major Vitality", "Major Fortitude"],
	},
	"Tristat Potion": {
		restoreHealth: 8369,
		restoreMagicka: 7582,
		restoreStamina: 7582,
		buffs: ["Major Fortitude", "Major Intellect", "Major Endurance"],
	},
	
};


window.ESOBUILD_COMBAT_WEAPONENCHANT_MATCHES = [
	{
		id: "Glyph of Absorb X",
		match: /Deals ([0-9]+) ([A-Za-z]+) Damage and restores ([0-9]+) ([A-Za-z]+)\./i,
		getDamageFunc: function(matchResult) { return matchResult[1]; },
		getDamageTypeFunc: function(matchResult) { return matchResult[2]; },
		getRestoreFunc: function(matchResult) { return matchResult[3]; },
		getRestoreTypeFunc: function(matchResult) { return matchResult[4]; },
	},
	{
		id: "Glyph of Crushing",
		match: /Reduce the target's Physical and Spell Resistance by ([0-9]+) for ([0-9]+) second/i,
		buffId: "Crusher Enchantment (Target)",
		getDurationFunc: function(matchResult) { return matchResult[2]; },
		getBuffValueFunc: function(matchResult) { return matchResult[1]; },
	},
	{
		id: "Glyph of Weakening",
		match: /Reduce target Weapon Damage and Spell Damage by ([0-9]+) for ([0-9]+) second/i,
		buffId: "Weakening Enchantment (Target)",
		getDurationFunc: function(matchResult) { return matchResult[2]; },
		getBuffValueFunc: function(matchResult) { return matchResult[1]; },
	},
	{
		id: "Glyph of Weapon Damage",
		match: /Increase your Weapon Damage and Spell Damage by ([0-9]+) for ([0-9]+) second/i,
		buffId: "Weapon Damage Enchantment",
		getDurationFunc: function(matchResult) { return matchResult[2]; },
		getBuffValueFunc: function(matchResult) { return matchResult[1]; },
	},
	{
		id: "Glyph of Decrease Health",
		match: /Deals a maximum of ([0-9]+) Oblivion Damage/i,
		getDamageTypeFunc: function() { return "Oblivion"; },
		getDamageFunc: function(matchResult) { return matchResult[1]; },
	},
	{
		id: "Glyph of Damage X",
		match: /Deals ([0-9]+) ([A-Za-z]+) Damage\./i,
		getDamageTypeFunc: function(matchResult) { return matchResult[2]; },
		getDamageFunc: function(matchResult) { return matchResult[1]; },
	},
	{
		id: "Glyph of Hardening",
		match: /Grants a ([0-9]+) point Damage shield for ([0-9]+) second/i,
		getDurationFunc: function(matchResult) { return matchResult[2]; },
		getDamageShieldFunc: function(matchResult) { return matchResult[1]; },
	},
	
];


// From: https://stackoverflow.com/a/3103269/439599
jQuery.fn.cleanWhitespace = function() {
    this.contents().filter(function() {
        if (this.nodeType != 3) {
            $(this).cleanWhitespace();
            return false;
        }
        else {
            this.textContent = $.trim(this.textContent);
            return !/\S/.test(this.nodeValue);
        }
    }).remove();
    return this;
}


// From: https://stackoverflow.com/a/7616484/439599
Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});


window.EsoBuildCombatMergeUniqueSkills = function()
{
	for (var i = 0; i < ESOBUILD_COMBAT_UNIQUE_SKILLS.length; ++i)
	{
		var uniqueSkill = ESOBUILD_COMBAT_UNIQUE_SKILLS[i];
		
		if (g_SkillsData[uniqueSkill.abilityId] != null) {
			EsoBuildLog("Warning: Can't set unique skill #" + uniqueSkill.abilityId + " as it already exists!");
			continue;
		}
		
		g_SkillsData[uniqueSkill.abilityId] = uniqueSkill;
	}
}


window.EsoBuildCombatGetCachedInputValues = function(inputValues)
{
	var hashCode = EsoBuildCombatHashSimpleObject(inputValues);
	return g_EsoBuildCombatInputValuesCache[hashCode];
}


window.EsoBuildCombatSetCachedInputValues = function(inputValues)
{
	var hashCode = EsoBuildCombatHashSimpleObject(inputValues);
	g_EsoBuildCombatInputValuesCache[hashCode] = jQuery.extend(true, {}, g_EsoBuildLastInputValues);
}


window.EsoBuildCombatHashSimpleObject = function(object)
{
	var string = JSON.stringify(object);
	var hashCode = string.hashCode();
	
	return hashCode;
}


window.EsoBuildCombatInitializeSkillEvents = function(skillData)
{
	if (skillData == null) return;
	
	skillData.events = {
			onInitialHit: [],
			afterInitialHit: [],
			onDamage: [],
			onFinalHit: [],
	};
	
	skillData.combat = {
			castCount: 0,
			upTime: 0,
			getSkillResistMod: [],
			getDamageMod: [],
			getFinalDamage: [],
			getDotTickDamage: [],
	};
	
}


window.EsoBuildCombatInitializeCombatSkillLine = function(skillLine)
{
	skillLine = skillLine.replace(/ Skills$/, "");
	
	if (g_EsoBuildCombatSkillLines[skillLine] != null) return;
	
	var skillLineData = {};
	
	skillLineData.events = {};
	skillLineData.events.onSkillLineCast = [];
	skillLineData.events.onSkillLineDamage = [];
	skillLineData.events.onSkillLineActive = [];
	skillLineData.events.onSkillLineInactive = [];
	
	g_EsoBuildCombatSkillLines[skillLine] = skillLineData;
}


window.EsoBuildCombatInitializeAllSkillEvents = function()
{
	var skillElements = $("#esotbCombatSkillCopy").find(".esovsSkillBarIcon");
	
	g_EsoBuildCombatActiveSkills = {};
	g_EsoBuildCombatPassiveSkills = {};
	g_EsoBuildCombatSkillBars = {};
	g_EsoBuildCombatSkillLines = {};
	g_EsoBuildCombatCPPassives = {};
	
	skillElements.each(function() {
		var $this = $(this);
		var abilityId = parseInt($this.attr("skillid"));
		var skillBar = parseInt($this.attr("skillbar"));
		var skillIndex = parseInt($this.attr("skillindex"));
		
		if (abilityId <= 0) return;
		var skillData = g_SkillsData[abilityId];
		if (skillData == null) return;
		
		var newSkill = {};
		newSkill.abilityId = abilityId;
		newSkill.skillData = skillData;
		newSkill.skillBar = skillBar;
		newSkill.skillIndex = skillIndex;
		newSkill.isPassive = false;
		
		EsoBuildCombatInitializeCombatSkillLine(skillData.skillLine);
		
		g_EsoBuildCombatActiveSkills[abilityId] = newSkill;
		
		if (g_EsoBuildCombatSkillBars[newSkill.skillBar] == null) g_EsoBuildCombatSkillBars[newSkill.skillBar] = {};
		g_EsoBuildCombatSkillBars[newSkill.skillBar][abilityId] = newSkill;
		
		EsoBuildCombatInitializeSkillEvents(skillData);
		EsoBuildCombatSetupOneTimeSkillMatches(skillData);
	});
	
		// Setup events for unique skills
	for (var combatId in g_EsoBuildCombatPlayerActions)
	{
		var action = g_EsoBuildCombatPlayerActions[combatId];
		
		if (action.abilityId >= ESOBUILD_UNIQUESKILLID_MIN && action.abilityId <= ESOBUILD_UNIQUESKILLID_MAX) 
		{
			EsoBuildCombatInitializeSkillEvents(action.skillData);
			EsoBuildCombatSetupOneTimeSkillMatches(action.skillData);
		}
	}
	
	for (var id in g_EsoSkillPassiveData)
	{
		var passive = g_EsoSkillPassiveData[id];
		var skillData = g_SkillsData[passive.abilityId];
		
		if (skillData == null) continue;
		
		var newSkill = {};
		
		newSkill.abilityId = passive.abilityId;
		newSkill.baseAbilityId = passive.baseAbilityId;
		newSkill.skillData = skillData;
		newSkill.rank = passive.rank;
		newSkill.isPassive = true;
		newSkill.skillBar = -1;
		newSkill.skillIndex = -1;
		
		EsoBuildCombatInitializeCombatSkillLine(skillData.skillLine);
		
		g_EsoBuildCombatPassiveSkills[newSkill.abilityId] = newSkill;
		
		EsoBuildCombatInitializeSkillEvents(skillData);
		EsoBuildCombatSetupOneTimeSkillMatches(skillData);
	}
	
	for (var id in g_EsoCpData)
	{
		if (!isNaN(id)) continue;
		
		var cp = g_EsoCpData[id];
		
		if (cp.type != "skill") continue;
		if (cp.points != null) continue;
		if (!cp.isUnlocked) continue;
		
		g_EsoBuildCombatCPPassives[cp.id] = cp;
		
		EsoBuildCombatSetupOneTimeCpMatches(cp);
	}
	
	for (var id in g_EsoBuildSetData)
	{
		var setData = g_EsoBuildSetData[id];
		EsoBuildCombatSetupOneTimeSetMatches(setData);
	}
	
}


window.EsoBuildCombatRunSkillLineActiveEvents = function()
{
	
	for (var name in g_EsoBuildCombatSkillLines)
	{
		var skillLine = g_EsoBuildCombatSkillLines[name];
		
		if (EsoBuildCombatIsSkillLineActive(name))
			EsoBuildCombatRunSkillLineEvent(name, "onSkillLineActive", null);
		else
			EsoBuildCombatRunSkillLineEvent(name, "onSkillLineInactive", null);
	}
}


window.EsoBuildCombatGetNextFreeCombatId = function() 
{
	var index = g_EsoBuildCombatNextFreeId;
	++g_EsoBuildCombatNextFreeId;
	return index;
}


window.EsoBuildCombatSetupOneTimeSkillMatches = function(skillData)
{
	var desc = GetEsoSkillDescription(skillData.abilityId, null, false, true, false);
	var exclusiveFlags = {};
	
	for (var i = 0; i < ESOBUILD_COMBAT_SKILL_ONETIME_MATCHES.length; ++i) 
	{
		var matchData = ESOBUILD_COMBAT_SKILL_ONETIME_MATCHES[i];
		
		if (exclusiveFlags[matchData.type] === true) continue;
		if (matchData.isExclusive) exclusiveFlags[matchData.type] = true;
		
		var match = desc.match(matchData.match);
		if (match == null) continue;
		
		if (matchData.getDamageMod) EsoBuildCombatAddSkillFunc(skillData.abilityId, "getDamageMod", matchData.getDamageMod, matchData);
		if (matchData.getDotTickDamage) EsoBuildCombatAddSkillFunc(skillData.abilityId, "getDotTickDamage", matchData.getDotTickDamage, matchData);
		if (matchData.getSkillResistMod) EsoBuildCombatAddSkillFunc(skillData.abilityId, "getSkillResistMod", matchData.getSkillResistMod, matchData);
		
		if (matchData.onDamage) EsoBuildCombatAddSkillEvent(skillData.abilityId, "onDamage", matchData.onDamage, matchData);
		if (matchData.onInitialHit) EsoBuildCombatAddSkillEvent(skillData.abilityId, "onInitialHit", matchData.onInitialHit, matchData);
		if (matchData.afterInitialHit) EsoBuildCombatAddSkillEvent(skillData.abilityId, "afterInitialHit", matchData.afterInitialHit, matchData);
		if (matchData.onFinalHit) EsoBuildCombatAddSkillEvent(skillData.abilityId, "onFinalHit", matchData.onFinalHit, matchData);
		if (matchData.onSkillLineCast) EsoBuildCombatAddSkillLineEvent(skillData.skillLine, "onSkillLineCast", matchData.onSkillLineCast, skillData, matchData);
		if (matchData.onSkillLineDamage) EsoBuildCombatAddSkillLineEvent(skillData.skillLine, "onSkillLineDamage", matchData.onSkillLineDamage, skillData, matchData);
		if (matchData.onSkillLineActive) EsoBuildCombatAddSkillLineEvent(skillData.skillLine, "onSkillLineActive", matchData.onSkillLineActive, skillData, matchData);
		if (matchData.onSkillLineInactive) EsoBuildCombatAddSkillLineEvent(skillData.skillLine, "onSkillLineInactive", matchData.onSkillLineInactive, skillData, matchData);
		if (matchData.onStatusEffectCast) EsoBuildCombatAddGlobalEvent("onStatusEffectCast", matchData.onStatusEffectCast, skillData, matchData);
		if (matchData.onStatusEffectChange) EsoBuildCombatAddGlobalEvent("onStatusEffectChange", matchData.onStatusEffectChange, skillData, matchData);
		if (matchData.onUltimateCast) EsoBuildCombatAddGlobalEvent("onUltimateCast", matchData.onUltimateCast, skillData, matchData);
		if (matchData.onAnySkillCast) EsoBuildCombatAddGlobalEvent("onAnySkillCast", matchData.onAnySkillCast, skillData, matchData);
		if (matchData.onTaunt) EsoBuildCombatAddGlobalEvent("onTaunt", matchData.onTaunt, skillData, matchData);
		if (matchData.onDrinkPotion) EsoBuildCombatAddGlobalEvent("onDrinkPotion", matchData.onDrinkPotion, skillData, matchData);
		if (matchData.onLightAttack) EsoBuildCombatAddGlobalEvent("onLightAttack", matchData.onLightAttack, skillData, matchData);
		if (matchData.onHeavyAttack) EsoBuildCombatAddGlobalEvent("onHeavyAttack", matchData.onHeavyAttack, skillData, matchData);
		if (matchData.onCrit) EsoBuildCombatAddGlobalEvent("onCrit", matchData.onCrit, skillData, matchData);
		if (matchData.onAnyDamage) EsoBuildCombatAddGlobalEvent("onAnyDamage", matchData.onAnyDamage, skillData, matchData);
		if (matchData.onTick) EsoBuildCombatAddGlobalEvent("onTick", matchData.onTick, skillData, matchData);
		if (matchData.onRollDodge) EsoBuildCombatAddGlobalEvent("onRollDodge", matchData.onRollDodge, skillData, matchData);
		if (matchData.onSynergy) EsoBuildCombatAddGlobalEvent("onSynergy", matchData.onSynergy, skillData, matchData);
		
		if (matchData.getAllDamageMod) EsoBuildCombatAddGlobalEvent("getAllDamageMod", matchData.getAllDamageMod, skillData, matchData);
		if (matchData.getExtraDamage) EsoBuildCombatAddGlobalEvent("getExtraDamage", matchData.getExtraDamage, skillData, matchData);
		if (matchData.getCritChanceMod) EsoBuildCombatAddGlobalEvent("getCritChanceMod", matchData.getCritChanceMod, skillData, matchData);
		if (matchData.getCostMod) EsoBuildCombatAddGlobalEvent("getCostMod", matchData.getCostMod, skillData, matchData);
		if (matchData.getFlatResistMod) EsoBuildCombatAddGlobalEvent("getFlatResistMod", matchData.getFlatResistMod, skillData, matchData);
		if (matchData.getStatusEffectChanceMod) EsoBuildCombatAddGlobalEvent("getStatusEffectChanceMod", matchData.getStatusEffectChanceMod, skillData, matchData);
	}
}


window.EsoBuildCombatSetupOneTimeCpMatches = function(cpData)
{
	var desc = cpData.description;
	var exclusiveFlags = {};
	
	for (var i = 0; i < ESOBUILD_COMBAT_CPPASSIVE_ONETIME_MATCHES.length; ++i) 
	{
		var matchData = ESOBUILD_COMBAT_CPPASSIVE_ONETIME_MATCHES[i];
		
		if (exclusiveFlags[matchData.type] === true) continue;
		if (matchData.isExclusive) exclusiveFlags[matchData.type] = true;
		
		var match = desc.match(matchData.match);
		if (match == null) continue;
		
		if (matchData.onStatusEffectCast) EsoBuildCombatAddGlobalEvent("onStatusEffectCast", matchData.onStatusEffectCast, cpData, matchData);
		if (matchData.onStatusEffectChange) EsoBuildCombatAddGlobalEvent("onStatusEffectChange", matchData.onStatusEffectChange, cpData, matchData);
		if (matchData.onUltimateCast) EsoBuildCombatAddGlobalEvent("onUltimateCast", matchData.onUltimateCast, cpData, matchData);
		if (matchData.onAnySkillCast) EsoBuildCombatAddGlobalEvent("onAnySkillCast", matchData.onAnySkillCast, cpData, matchData);
		if (matchData.onTaunt) EsoBuildCombatAddGlobalEvent("onTaunt", matchData.onTaunt, cpData, matchData);
		if (matchData.onDrinkPotion) EsoBuildCombatAddGlobalEvent("onDrinkPotion", matchData.onDrinkPotion, cpData, matchData);
		if (matchData.onLightAttack) EsoBuildCombatAddGlobalEvent("onLightAttack", matchData.onLightAttack, cpData, matchData);
		if (matchData.onHeavyAttack) EsoBuildCombatAddGlobalEvent("onHeavyAttack", matchData.onHeavyAttack, cpData, matchData);
		if (matchData.onCrit) EsoBuildCombatAddGlobalEvent("onCrit", matchData.onCrit, cpData, matchData);
		if (matchData.onAnyDamage) EsoBuildCombatAddGlobalEvent("onAnyDamage", matchData.onAnyDamage, cpData, matchData);
		if (matchData.onTick) EsoBuildCombatAddGlobalEvent("onTick", matchData.onTick, cpData, matchData);
		if (matchData.onRollDodge) EsoBuildCombatAddGlobalEvent("onRollDodge", matchData.onRollDodge, cpData, matchData);
		if (matchData.onSynergy) EsoBuildCombatAddGlobalEvent("onSynergy", matchData.onSynergy, cpData, matchData);
		
		if (matchData.getAllDamageMod) EsoBuildCombatAddGlobalEvent("getAllDamageMod", matchData.getAllDamageMod, cpData, matchData);
		if (matchData.getExtraDamage) EsoBuildCombatAddGlobalEvent("getExtraDamage", matchData.getExtraDamage, cpData, matchData);
		if (matchData.getCritChanceMod) EsoBuildCombatAddGlobalEvent("getCritChanceMod", matchData.getCritChanceMod, cpData, matchData);
		if (matchData.getCostMod) EsoBuildCombatAddGlobalEvent("getCostMod", matchData.getCostMod, cpData, matchData);
		if (matchData.getFlatResistMod) EsoBuildCombatAddGlobalEvent("getFlatResistMod", matchData.getFlatResistMod, cpData, matchData);
		if (matchData.getStatusEffectChanceMod) EsoBuildCombatAddGlobalEvent("getStatusEffectChanceMod", matchData.getStatusEffectChanceMod, cpData, matchData);
	}
}


window.EsoBuildCombatSetupOneTimeSetMatches = function(setData)
{
	
	for (var j = 0; j < 5; ++j) 
	{
		var desc = setData.averageDesc[j];
		var exclusiveFlags = {};
		
		if (desc == null && setData.items[0] != null)
		{
			var itemDesc = setData.items[0]['setBonusDesc' + (j+1)];
			if (itemDesc) desc = RemoveEsoDescriptionFormats(itemDesc);
		}
		else if (desc == null && setData.unequippedItems[0] != null)
		{
			var itemDesc = setData.unequippedItems[0]['setBonusDesc' + (j+1)];
			if (itemDesc) desc = RemoveEsoDescriptionFormats(itemDesc);
		}
		
		if (desc == null) continue;
		if (!(setData.isDescValid[j] || setData.isOffhandDescValid[j])) continue;
		if (desc == "") continue;
		
		for (var i = 0; i < ESOBUILD_COMBAT_SET_ONETIME_MATCHES.length; ++i) 
		{
			var matchData = ESOBUILD_COMBAT_SET_ONETIME_MATCHES[i];
			
			if (exclusiveFlags[matchData.type] === true) continue;
			if (matchData.isExclusive) exclusiveFlags[matchData.type] = true;
			
			var match = desc.match(matchData.match);
			if (match == null) continue;
			
			if (matchData.onStatusEffectCast) EsoBuildCombatAddGlobalEvent("onStatusEffectCast", matchData.onStatusEffectCast, setData, matchData);
			if (matchData.onStatusEffectChange) EsoBuildCombatAddGlobalEvent("onStatusEffectChange", matchData.onStatusEffectChange, setData, matchData);
			if (matchData.onUltimateCast) EsoBuildCombatAddGlobalEvent("onUltimateCast", matchData.onUltimateCast, setData, matchData);
			if (matchData.onAnySkillCast) EsoBuildCombatAddGlobalEvent("onAnySkillCast", matchData.onAnySkillCast, setData, matchData);
			if (matchData.onTaunt) EsoBuildCombatAddGlobalEvent("onTaunt", matchData.onTaunt, setData, matchData);
			if (matchData.onDrinkPotion) EsoBuildCombatAddGlobalEvent("onDrinkPotion", matchData.onDrinkPotion, setData, matchData);
			if (matchData.onLightAttack) EsoBuildCombatAddGlobalEvent("onLightAttack", matchData.onLightAttack, setData, matchData);
			if (matchData.onHeavyAttack) EsoBuildCombatAddGlobalEvent("onHeavyAttack", matchData.onHeavyAttack, setData, matchData);
			if (matchData.onCrit) EsoBuildCombatAddGlobalEvent("onCrit", matchData.onCrit, setData, matchData);
			if (matchData.onAnyDamage) EsoBuildCombatAddGlobalEvent("onAnyDamage", matchData.onAnyDamage, setData, matchData);
			if (matchData.onTick) EsoBuildCombatAddGlobalEvent("onTick", matchData.onTick, setData, matchData);
			if (matchData.onRollDodge) EsoBuildCombatAddGlobalEvent("onRollDodge", matchData.onRollDodge, setData, matchData);
			if (matchData.onSynergy) EsoBuildCombatAddGlobalEvent("onSynergy", matchData.onSynergy, setData, matchData);
			
			if (matchData.getAllDamageMod) EsoBuildCombatAddGlobalEvent("getAllDamageMod", matchData.getAllDamageMod, setData, matchData);
			if (matchData.getExtraDamage) EsoBuildCombatAddGlobalEvent("getExtraDamage", matchData.getExtraDamage, setData, matchData);
			if (matchData.getCritChanceMod) EsoBuildCombatAddGlobalEvent("getCritChanceMod", matchData.getCritChanceMod, setData, matchData);
			if (matchData.getCostMod) EsoBuildCombatAddGlobalEvent("getCostMod", matchData.getCostMod, setData, matchData);
			if (matchData.getFlatResistMod) EsoBuildCombatAddGlobalEvent("getFlatResistMod", matchData.getFlatResistMod, setData, matchData);
			if (matchData.getStatusEffectChanceMod) EsoBuildCombatAddGlobalEvent("getStatusEffectChanceMod", matchData.getStatusEffectChanceMod, setData, matchData);
		}
	}
}


window.EsoBuildCombatUpdateSetData = function()
{
	for (var eventId in g_EsoBuildCombatState.events)
	{
		var events = g_EsoBuildCombatState.events[eventId];
		
		for (var i = 0; i < events.length; ++i)
		{
			var event = events[i];
			
			if (event.srcData == null) continue;
			if (event.srcData.averageDesc == null) continue;
			
			var setData = g_EsoBuildSetData[event.srcData.name];
			if (setData == null) continue;
			
			event.srcData = setData;
		}
	}
}


window.EsoBuildCombatAddSkillFunc = function(abilityId, funcName, func, matchData)
{
	var skillData = g_SkillsData[abilityId];
	if (skillData == null) return;
	if (skillData.combat == null) return;
	
	var funcs = skillData.combat[funcName];
	if (funcs == null) return;
	
	var newFunc = {};
	
	newFunc.func = func;
	newFunc.matchData = matchData;
	newFunc.skillData = skillData;
	
	funcs.push(newFunc);
}


window.EsoBuildCombatAddSkillEvent = function(abilityId, eventName, func, matchData)
{
	var skillData = g_SkillsData[abilityId];
	if (skillData == null) return;
	
	var events = skillData.events[eventName];
	if (events == null) return;
	
	var newEvent = {};
	
	newEvent.func = func;
	newEvent.matchData = matchData;
	newEvent.skillData = skillData;
	
	events.push(newEvent);
}


window.EsoBuildCombatAddSkillLineEvent = function(skillLine, eventName, func, skillData,  matchData)
{
	skillLine = skillLine.replace(/ Skills$/, "");
	var skillLineData = g_EsoBuildCombatSkillLines[skillLine];
	if (skillLineData == null) return;
	
	var events = skillLineData.events[eventName];
	if (events == null) return;
	
	var newEvent = {};
	
	newEvent.func = func;
	newEvent.matchData = matchData;
	newEvent.skillData = skillData;
	
	events.push(newEvent);
}


window.EsoBuildCombatAddGlobalEvent = function(eventName, func, srcData, matchData)
{
	if (g_EsoBuildCombatState.events[eventName] == null) return false;
	
	var newEvent = {};
	
	newEvent.func = func;
	newEvent.matchData = matchData;
	newEvent.srcData = srcData;
	
	g_EsoBuildCombatState.events[eventName].push(newEvent);
	
	return true;
}


window.EsoBuildCombatAddGlobalOnTimeEvent = function(time, func, isDeltaTime)
{
	time = parseFloat(time);
	if (time == null || isNaN(time)) return false;
	
	if (isDeltaTime) time += g_EsoBuildCombatState.currentTime;
	
	if (time <= g_EsoBuildCombatState.currentTime) return false;
	
	var newEvent = {};
	
	newEvent.func = func;
	newEvent.time = time;
	
	g_EsoBuildCombatState.events["onTime"].push(newEvent);
	
	return true;
}


window.EsoBuildCombatRunGlobalOnTimeEvent = function()
{
	var keysToDelete = [];
	var events = g_EsoBuildCombatState.events["onTime"];
	
	if (events == null) return;
	
	for (var i = 0; i < events.length; ++i)
	{
		var event = events[i];
		
		if (event.time - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			event.func();
			keysToDelete.push(i);
		}
	}
	
	for (var i = keysToDelete.length-1; i >= 0; --i)
	{
		var key = keysToDelete[i];
		g_EsoBuildCombatState.events["onTime"].splice(key, 1);
	}
}


window.EsoBuildCombatRunGlobalGetFunc = function(eventName, initialValue, combineType, ...args)
{
	var returnResult = initialValue;
	var funcs = g_EsoBuildCombatState.events[eventName];
	if (funcs == null) return returnResult;
	
	for (var i = 0; i < funcs.length; ++i)
	{
		var func = funcs[i];
		var desc = "";
		
		if (!isNaN(func.srcData.abilityId))
		{
			desc = GetEsoSkillDescription(func.srcData.abilityId, null, false, true, false);
		}
		else if (func.srcData.type == "skill" && func.srcData.description != null)
		{
			desc = func.srcData.description;
		}
		else if (func.srcData.averageDesc != null) 
		{
			for (j = 0; j < 5; ++j)
			{
				if (!func.srcData.isDescValid[j]) continue;
				
				desc = func.srcData.averageDesc[j];
				if (desc == null) continue;
				
				var matchResult = [];
				if (func.matchData) matchResult = desc.match(func.matchData.match);
				if (!matchResult) continue;
				
				var result = func.func(matchResult, func.srcData, ...args);
				
				if (!isNaN(result)) 
				{
					if (combineType == "*")
						returnResult *= result;
					else
						returnResult += result;
				}
			}
			
			continue;
		}
		
		var matchResult = [];
		if (func.matchData) matchResult = desc.match(func.matchData.match);
		if (!matchResult) continue;
		
		var result = func.func(matchResult, func.srcData, ...args);
		
		if (!isNaN(result)) 
		{
			if (combineType == "*")
				returnResult *= result;
			else
				returnResult += result;
		}
	}
	
	return returnResult;
}


window.EsoBuildCombatRunGlobalEvent = function(eventName, ...args)
{
	var events = g_EsoBuildCombatState.events[eventName];
	if (events == null) return;
	
	for (var i = 0; i < events.length; ++i)
	{
		var event = events[i];
		var desc = "";
		
		if (!isNaN(event.srcData.abilityId))
		{
			desc = GetEsoSkillDescription(event.srcData.abilityId, null, false, true, false);
		}
		else if (event.srcData.type == "skill" && event.srcData.description != null)
		{
			desc = event.srcData.description;
		}
		else if (event.srcData.averageDesc != null) 
		{
			for (j = 0; j < 5; ++j)
			{
				if (!event.srcData.isDescValid[j]) continue;
				
				desc = event.srcData.averageDesc[j];
				if (desc == null) continue;
				
				var matchResult = [];
				if (event.matchData) matchResult = desc.match(event.matchData.match);
				if (!matchResult) continue;
				
				event.func(matchResult, event.srcData, ...args);
			}
			
			continue;
		}
		
		var matchResult = [];
		if (event.matchData) matchResult = desc.match(event.matchData.match);
		if (!matchResult) continue;
		
		event.func(matchResult, event.srcData, ...args);
	}
}


window.EsoBuildCombatRunSkillLineEvent = function(skillLine, eventName, skillData)
{
	skillLine = skillLine.replace(/ Skills$/, "");
	
	var skillLine = g_EsoBuildCombatSkillLines[skillLine];
	if (skillLine == null) return;
	
	var events = skillLine.events[eventName];
	if (events == null) return;
	
	for (var i = 0; i < events.length; ++i)
	{
		var event = events[i];
		var desc = GetEsoSkillDescription(event.skillData.abilityId, null, false, true, false);
		
		var matchResult = [];
		if (event.matchData) matchResult = desc.match(event.matchData.match);
		if (!matchResult) continue;
		
		event.func(matchResult, event.skillData, skillData);
	}
}


window.EsoBuildCombatRunSkillFunc = function(skillData, funcName, combineType = "+", defaultValue = 0, ...args)
{
	if (skillData == null || skillData.combat == null) return defaultValue;
	
	var result = defaultValue;
	var funcs = skillData.combat[funcName];
	
	if (funcs == null) return result;
	
	for (var i = 0; i < funcs.length; ++i)
	{
		var funcData = funcs[i];
		
		var desc = GetEsoSkillDescription(funcData.skillData.abilityId, null, false, true, false);
		
		var matchResult = [];
		if (funcData.matchData) matchResult = desc.match(funcData.matchData.match);
		if (!matchResult) continue;
		
		var funcResult = funcData.func(matchResult, funcData.skillData, ...args);
		
		if (combineType == "*") 
			result = result * funcResult;
		else
			result = result + funcResult;
	}
	
	return result;
}


window.EsoBuildCombatRunSkillEvent = function(skillData, eventName)
{
	if (skillData == null || skillData.events == null) return false;
	
	var events = skillData.events[eventName];
	if (events == null) return false;
	
	for (var i = 0; i < events.length; ++i)
	{
		var event = events[i];
		
		var desc = GetEsoSkillDescription(event.skillData.abilityId, null, false, true, false);
		
		var matchResult = [];
		if (event.matchData) matchResult = desc.match(event.matchData.match);
		if (!matchResult) continue;
		
		event.func(matchResult, skillData);
	}
	
	return true;
}


window.EsoBuildCombatGetExecuteDamageMod = function(maxDamageMod, minHealth, targetPctHealth, extraDamage)
{
	minHealth = parseFloat(minHealth);
	maxDamageMod = parseFloat(maxDamageMod);
	if (targetPctHealth == null) targetPctHealth = g_EsoBuildCombatState.targetPctHealth;
	if (targetPctHealth == null) targetPctHealth = 100;
	targetPctHealth = parseFloat(targetPctHealth);
	
		// TODO: Log?
	if (isNaN(minHealth)    || minHealth <= 0) return 1;
	if (isNaN(maxDamageMod) || maxDamageMod <= 0) return 1;
	if (targetPctHealth >= minHealth) return 1;
	
	var damageMod = 1 + (1 - targetPctHealth / minHealth) * maxDamageMod / 100;
	if (extraDamage) damageMod += extraDamage;
	damageMod = Math.floor(damageMod * 100) / 100;
	
	return damageMod;
}


window.EsoBuildCombatUpdateBuffValue = function(buffId, newValue)
{
	var buffData = g_EsoBuildBuffData[buffId];
	
	if (buffData == null) return false;
	
	if (buffData.value != null) buffData.value = newValue;
	
	if (buffData.values != null) {
		for (var i in buffData.values)
		{
			buffData.values[i] = newValue;
		}
	}
	
	return true;
}


window.EsoBuildCombatRestoreStat = function(srcType, srcData, statName, statAmount)
{
	statAmount = parseInt(statAmount);
	if (isNaN(statAmount) || statAmount <= 0) return false;
	
	var statId = 'current' + statName;
	if (g_EsoBuildCombatState[statId] == null) return false;
	
	g_EsoBuildCombatState[statId] += statAmount;
	if (g_EsoBuildCombatState[statId] > g_EsoBuildLastInputValues[statName]) g_EsoBuildCombatState[statId] = g_EsoBuildLastInputValues[statName];
	
	var srcName = srcType;
	if (srcData && srcData.name) srcName = srcData.name;
	if (srcData && srcData.overrideName) srcName = srcData.overrideName;
	if (typeof(srcData) == "string") srcName = srcData;
	
	if (g_EsoBuildCombatOptions.log.showRestore) 
	{
		EsoBuildCombatLog("You restored " + statAmount + " " + statName + " from " + srcName + ".");
	}
	
	EsoBuildCombatLogRestoreStat(srcType, srcData, statName, statAmount);
	
	return true;
}


window.EsoBuildCombatEnableSkillToggle = function(name, enable, duration)
{
	if (g_EsoBuildToggledSkillData[name] == null) return false;
	
	if (g_EsoBuildToggledSkillData[name].combatEnabled != enable)
	{
		g_EsoBuildToggledSkillData[name].combatEnabled = enable;
		g_EsoBuildCombatStatUpdateRequired = true;
		
		if (g_EsoBuildCombatOptions.log.showToggles) 
		{
			if (duration == null || duration <= 0)
				EsoBuildCombatLog("Changed active skill " + name + " toggle to " + (enable ? "on" : "off") + ".");
			else
				EsoBuildCombatLog("Changed active skill " + name + " toggle to " + (enable ? "on" : "off") + " for " + duration + " seconds.");
		}
	}
	
	
	return true;
}


window.EsoBuildCombatUpdateSkillToggleCount = function(skillName, newCount)
{
	var skillData = g_EsoBuildToggledSkillData[skillName];
	if (skillData == null) return false;
	
	if (skillData.count == newCount) return true;
	
	skillData.count = newCount;
	skillData.combatCount = newCount;
	g_EsoBuildCombatStatUpdateRequired = true;
	
	var skillElement = $("#esotbToggledSkillInfo").children(".esotbToggledSkillItem[skillid='" + skillName + "']");
	if (skillElement.length == 0) return false;
	
	var skillNumber = skillElement.children(".esotbToggleSkillNumber");
	if (skillNumber.length == 0) return false;
	
	skillNumber.val(newCount);
	
	return true;
}


window.EsoBuildCombatUpdateSetToggleCount = function(setName, newCount)
{
	var setData = g_EsoBuildToggledSetData[setName];
	if (setData == null) return false;
	
	if (setData.count == newCount) return true;
	
	setData.count = newCount;
	setData.combatCount = newCount;
	g_EsoBuildCombatStatUpdateRequired = true;
	
	var setElement = $("#esotbToggledSetInfo").children(".esotbToggledSetItem[setid='" + setName + "']");
	if (setElement.length == 0) return false;
	
	var setNumber = setElement.children(".esotbToggleSetNumber");
	if (setNumber.length == 0) return false;
	
	setNumber.val(newCount);
	
	return true;
	
}


window.EsoBuildCombatHasSetToggle = function(name)
{
	var setToggle = g_EsoBuildToggledSetData[name];
	if (setToggle == null) return false;
	return (setToggle.combatEnabled || setToggle.enabled);
}


window.EsoBuildCombatEnableSetToggle = function(name, enable, duration)
{
	if (g_EsoBuildToggledSetData[name] == null) return false;
	
	if (g_EsoBuildToggledSetData[name].combatEnabled != enable)
	{
		g_EsoBuildToggledSetData[name].combatEnabled = enable;
		g_EsoBuildCombatStatUpdateRequired = true;
		
		if (g_EsoBuildCombatOptions.log.showToggles) 
		{
			if (duration == null || duration <= 0)
				EsoBuildCombatLog("Changed set " + name + " toggle to " + (enable ? "on" : "off") + ".");
			else
				EsoBuildCombatLog("Changed set " + name + " toggle to " + (enable ? "on" : "off") + " for " + duration + " seconds.");
		}
	}
	
	return true;
}


window.EsoBuildCombatEnableCpToggle = function(name, enable, duration)
{
	if (g_EsoBuildToggledCpData[name] == null) return false;
	
	if (g_EsoBuildToggledCpData[name].combatEnabled != enable)
	{
		g_EsoBuildToggledCpData[name].combatEnabled = enable;
		g_EsoBuildCombatStatUpdateRequired = true;
		
		if (g_EsoBuildCombatOptions.log.showToggles) 
		{
			EsoBuildCombatLog("Changed CP toggle " + name + " status to " + (enable ? "on" : "off") + ".");
		}
	}
	
	return true;
}


window.EsoBuildCombatAddRestoreStat = function(srcType, srcData, stat, amtPerTick, tickTime, duration)
{
	duration = parseFloat(duration);
	amtPerTick = parseInt(amtPerTick);
	tickTime = parseFloat(tickTime);
	
	if (tickTime <= 0) return false;
	
	var statId = srcType;
	if (typeof(srcData) == "string") statId = srcData;
	if (srcData && srcData.name) statId = srcData.name;
	
	var newRestoreStat = {};
	var oldRestoreStat = g_EsoBuildCombatState.restoreStats[statId];
	
	newRestoreStat.endTime     = g_EsoBuildCombatState.currentTime + duration;
	if (duration < 0) newRestoreStat.endTime = -1;
	
	if (oldRestoreStat != null) 
	{
		if (oldRestoreStat.endTime > 0 && newRestoreStat.endTime > 0 && oldRestoreStat.endTime > newRestoreStat.endTime) return oldRestoreStat;
	}
	
	newRestoreStat.startTime   = g_EsoBuildCombatState.currentTime;
	newRestoreStat.nextTime    = g_EsoBuildCombatState.currentTime + tickTime;
	newRestoreStat.stat        = stat;
	newRestoreStat.amtPerTick  = amtPerTick;
	newRestoreStat.tickTime    = tickTime;
	newRestoreStat.srcType     = srcType;
	newRestoreStat.srcData     = srcData;
	newRestoreStat.statId      = statId;
	
	g_EsoBuildCombatState.restoreStats[statId] = newRestoreStat;
	
	return newRestoreStat;
}


window.EsoBuildCombatRemoveBuff = function(buffId)
{
	var buffData = g_EsoBuildBuffData[buffId];
	
	if (buffData == null) return false;
	if (g_EsoBuildCombatState.buffs[buffId] == null) return false;
	if (!buffData.combatEnabled) return false;
	
	EsoBuildCombatLog("Manually disabling buff " + buffId + ".");
	
	buffData.combatEnabled = false;
	delete g_EsoBuildCombatState.buffs[buffId];
	g_EsoBuildCombatStatUpdateRequired = true;
	
	return true;
}


window.EsoBuildCombatEnableToggle = function(srcType, srcData, toggleName, enable)
{
	if (enable) return EsoBuildCombatAddToggle(srcType, srcData, toggleName);
	EsoBuildCombatRemoveToggle(srcType, toggleName);
}


window.EsoBuildCombatAddToggle = function(srcType, srcData, toggleName, duration, cooldown, cost, costType, costTime)
{
	var newToggle = {};
	var toggleId = srcType.charAt(0).toUpperCase() + srcType.slice(1).toLowerCase() + ": " + toggleName;
	var oldToggle = g_EsoBuildCombatState.toggles[toggleId];
	
	duration = parseFloat(duration);
	cooldown = parseFloat(cooldown);
	costTime = parseFloat(costTime);
	cost = parseFloat(cost);
	
	if (isNaN(duration)) duration = -1;
	if (isNaN(cooldown)) cooldown = -1;
	if (isNaN(costTime)) costTime = -1;
	if (isNaN(cost)) cost = -1;
	
	if (cooldown > 0)
	{
		if (EsoBuildCombatHasCooldown(toggleName)) return false;
		EsoBuildCombatAddCooldown(toggleName, cooldown);
	}
	
	if (oldToggle)
	{
		var newEndTime = g_EsoBuildCombatState.currentTime + duration;
		if (duration < 0) newEndTime = -1;
		
		if (newEndTime <= 0 && oldToggle.endTime <= 0) return oldToggle;
		if (duration > 0 && oldToggle.endTime >= newEndTime) return oldToggle;
		
		newToggle = oldToggle;
	}
	
	newToggle.name = toggleName;
	newToggle.srcType = srcType;
	newToggle.srcData = srcData;
	newToggle.duration = duration;
	newToggle.cooldown = cooldown;
	
	newToggle.endTime = -1;
	if (duration > 0) newToggle.endTime = g_EsoBuildCombatState.currentTime + duration;
	
	newToggle.cost = cost;
	newToggle.costType = costType;
	newToggle.costTime = costTime;
	
	newToggle.nextTime = -1;
	if (costTime > 0) newToggle.nextTime = g_EsoBuildCombatState.currentTime + costTime;
	
	g_EsoBuildCombatState.toggles[toggleId] = newToggle;
	
	if (srcType == "cast")
	{
		if (g_EsoBuildCombatOptions.log.showToggles) 
		{
			EsoBuildCombatLog("Turning on toggle for player cast skill " + srcData.name + " for " + cost + " " + costType + ".");
		}
	}
	else if (srcType == "set")
	{
		EsoBuildCombatEnableSetToggle(toggleName, true, duration);
	}
	else if (srcType == "skill")
	{
		EsoBuildCombatEnableSkillToggle(toggleName, true, duration);
	}
	else if (srcType == "cp")
	{
		EsoBuildCombatEnableCpToggle(toggleName, true, duration);
	}
	
	return newToggle;
}


window.EsoBuildCombatHasToggle = function(srcType, toggleName)
{
	var toggleId = srcType.charAt(0).toUpperCase() + srcType.slice(1).toLowerCase() + ": " + toggleName;
	if (toggleName == null) toggleId = srcType;
	
	return (g_EsoBuildCombatState.toggles[toggleId] != null);
}


window.EsoBuildCombatRemoveToggle = function(srcType, toggleName)
{
	var toggleId = srcType.charAt(0).toUpperCase() + srcType.slice(1).toLowerCase() + ": " + toggleName;
	if (toggleName == null) toggleId = srcType;
	
	var toggleData = g_EsoBuildCombatState.toggles[toggleId];
	
	if (toggleData == null) return false;
	
	if (toggleData.srcType == "cast")
	{
		EsoBuildCombatRunSkillEvent(toggleData.srcData, "onFinalHit");
		
		if (g_EsoBuildCombatOptions.log.showToggles) 
		{
			EsoBuildCombatLog("Turning on toggle for player cast skill " + toggleData.srcData.name + " for " + cost + " " + costType + ".");
		}
	}
	else if (toggleData.srcType == "set")
	{
		EsoBuildCombatEnableSetToggle(toggleName, false);
	}
	else if (toggleData.srcType == "skill")
	{
		EsoBuildCombatEnableSkillToggle(toggleName, false);
	}
	else if (toggleData.srcType == "cp")
	{
		EsoBuildCombatEnableCpToggle(toggleName, false);
	}
	
	delete g_EsoBuildCombatState.toggles[toggleId];
	
	return true;
}


window.EsoBuildCombatAddBuff = function(srcType, srcData, buffId, duration)
{
	var buffData = g_EsoBuildBuffData[buffId];
	var name = "unknown";
	
	duration = parseFloat(duration);
	if (isNaN(duration) || duration <= 0) return false;
	
	if (srcData && srcData.name) name = srcData.name;
	if (typeof(srcData) == "string") name = srcData;
	
	if (buffData == null) 
	{
		EsoBuildLog("Combat failed to find buff matching ID " + buffId + " for skill " + name + "!");
		return false;
	}
	
	if (duration > 0 && g_EsoBuildLastInputValues.Set.BuffDuration)
	{
		if ((buffId.startsWith("Major") || buffId.startsWith("Minor")) && buffId.indexOf("Target") < 0) {
			duration = Math.round(duration * (1 + g_EsoBuildLastInputValues.Set.BuffDuration) * 10) / 10;
		}
	}
	
	if (buffData.combatEnabled == null) buffData.combatEnabled = false;
	buffData.combatEnabled = true;
	
	var prevEndTime = g_EsoBuildCombatState.buffs[buffId];
	var newEndTime = g_EsoBuildCombatState.currentTime + duration;
	
	if (prevEndTime == null) { 
		g_EsoBuildCombatStatUpdateRequired = true;
		g_EsoBuildCombatState.buffs[buffId] = newEndTime;
	}
	else if (prevEndTime < newEndTime) {
		g_EsoBuildCombatState.buffs[buffId] = newEndTime;
	}
	
	if (g_EsoBuildCombatOptions.log.showBuffs) 
	{
		EsoBuildCombatLog("Enabling buff " + buffId + " for " + duration.toFixed(1) + " seconds (from skill " + name + ").");
	}
	
	EsoBuildCombatRunGlobalEvent("onBuff", buffId, buffData, duration);
	if (buffData.category == "target" || buffData.group == "target" || buffId.indexOf("(Target)") >= 0) EsoBuildCombatRunGlobalEvent("onDebuff", buffId, buffData, duration);
	
	return true;
}


window.EsoBuildCombatRunSkillMatches = function(skillData, matches)
{
	var desc = GetEsoSkillDescription(skillData.abilityId, null, false, true, false);
	var exclusiveFlags = {};
	var result = {};
	
	for (var i = 0; i < matches.length; ++i)
	{
		var matchData = matches[i];
		
		if (exclusiveFlags[matchData.type] === true) continue;
		
		var matchResult = desc.match(matchData.match);
		if (!matchResult) continue;
		
		if (matchData.isEnabled) 
		{
			var isEnabled = matchData.isEnabled(matchResult, skillData);
			if (!isEnabled) continue;
		}
		
		if (matchData.isExclusive) exclusiveFlags[matchData.type] = true;
		
		if (matchData.ignore) 
		{
			if (matchData.isExclusiveAll) break;
			continue;
		}
		
		if (matchData.onMatchBefore) matchData.onMatchBefore(matchResult, skillData);
		
		if (matchData.getDamageFunc)      result.damage      = matchData.getDamageFunc(matchResult, skillData);
		if (matchData.getDamageTypeFunc)  result.damageType  = matchData.getDamageTypeFunc(matchResult, skillData);
		if (matchData.getDamageTimeFunc)  result.damageTime  = matchData.getDamageTimeFunc(matchResult, skillData);
		if (matchData.getInitialTickFunc) result.initialTick = matchData.getInitialTickFunc(matchResult, skillData);
		if (matchData.getCostFunc)        result.cost        = matchData.getCostFunc(matchResult, skillData); 
		if (matchData.getCastTimeFunc)    result.castTime    = matchData.getCastTimeFunc(matchResult, skillData);
		if (matchData.getCooldownFunc)    result.cooldown    = matchData.getCooldownFunc(matchResult, skillData);
		
		if (matchData.getNameFunc) {
			result.name = matchData.getNameFunc(matchResult, skillData);
			skillData.overrideName = result.name;
		}
		
		switch (matchData.type)
		{
		case "dot": 
			EsoBuildCombatRunSkillMatches_Dot(skillData, matchData, matchResult);
			break;
		case "directdamage": 
			EsoBuildCombatRunSkillMatches_DirectDamage(skillData, matchData, matchResult);
			break;
		}
		
		if (matchData.onMatchAfter) matchData.onMatchAfter(matchResult, skillData);
		
		if (matchData.isExclusiveAll) break;
	}
	
	return result;
}


window.EsoBuildCombatHasPlayerStatus = function(...statuses)
{
	return EsoBuildCombatHasStatusEffect("player", ...statuses);
}


window.EsoBuildCombatHasTargetStatus = function(...statuses)
{
	return EsoBuildCombatHasStatusEffect("target", ...statuses);
}


window.EsoBuildCombatHasStatusEffect = function(target, ...statuses)
{
	var statusEffects = g_EsoBuildCombatState.playerStatus;
	var args = Array.prototype.slice.call(arguments, 2);
	
	if (target == "target") statusEffects = g_EsoBuildCombatState.targetStatus;
	
	for (var i = 0; i < statuses.length; ++i)
	{
		var status = statuses[i];
		if (statusEffects[status] != null) return true;
	}
	
	return false;
}


window.EsoBuildCombatRunSkillMatches_Dot = function(skillData, matchData, matchResult)
{
	var damage = parseInt(matchResult[1]);
	var damageType = matchResult[2];
	var damageTime = skillData.duration/1000;
	var isAOE = (matchData.isAOE == null) ? false : matchData.isAOE;
	var isBleed = (matchData.isBleed == null) ? false : matchData.isBleed;
	var isPet = (matchData.isPet == null) ? false : matchData.isPet;
	var result = {};
	var tickTime = 1.0;
	var initialTick = null;
	
	if (matchResult[3]) damageTime = parseFloat(matchResult[3]);
	
	if (matchData.getDamageFunc)      damage      = parseInt(matchData.getDamageFunc(matchResult, skillData));
	if (matchData.getDamageTypeFunc)  damageType  = matchData.getDamageTypeFunc(matchResult, skillData);
	if (matchData.getDamageTimeFunc)  damageTime  = parseFloat(matchData.getDamageTimeFunc(matchResult, skillData));
	if (matchData.getInitialTickFunc) initialTick = parseFloat(matchData.getInitialTickFunc(matchResult, skillData));
	if (matchData.getTickTimeFunc)    tickTime    = parseFloat(matchData.getTickTimeFunc(matchResult, skillData));
	
	if (isNaN(damageTime) || damageTime <= 0) return false;
	if (isNaN(damage)     || damage     <= 0) return false;
	if (isNaN(tickTime)   || tickTime   <= 0) return false;
	
	if (matchData.useTotalDamage === true) {
		damage = Math.round(damage / damageTime);
	}
	
	EsoBuildCombatAddDot("skill", skillData, damage, damageType, tickTime, damageTime, isAOE, isBleed, isPet, initialTick);
	
	return true;
}


window.EsoBuildCombatRunSkillMatches_DirectDamage = function(skillData, matchData, matchResult)
{
	var damage = parseInt(matchResult[1]);
	var damageType = matchResult[2];
	var isAOE = (matchData.isAOE == null) ? false : matchData.isAOE;
	var result = {};
	
	if (matchData.getDamageFunc)     damage     = parseInt(matchData.getDamageFunc(matchResult, skillData));
	if (matchData.getDamageTypeFunc) damageType = matchData.getDamageTypeFunc(matchResult, skillData);
	
	EsoBuildCombatApplyDamage("skill", skillData, damage, damageType, false, isAOE, false, false);
	
}


window.EsoBuildCombatUpdateStats = function() 
{
	var dps = 0;
	var totalTime = "" + g_EsoBuildCombatState.currentTime.toFixed(2) + " sec";
	
	if (g_EsoBuildCombatState.currentTime > 0) 
	{
		dps = Math.round(g_EsoBuildCombatState.damageDone.total / g_EsoBuildCombatState.currentTime);
	}
	
	$("#esotbCombatStat_TotalTime").text(totalTime);
	$("#esotbCombatStat_DPS").text(dps);
	
	var targetHealth = "" + g_EsoBuildCombatState.targetHealth + " / " + g_EsoBuildCombatState.targetMaxHealth + " (" + g_EsoBuildCombatState.targetPctHealth + "%)";
	$("#esotbCombatStat_TargetHealth").text(targetHealth);
	
	var pctHealth = g_EsoBuildCombatState.currentHealth*100/g_EsoBuildLastInputValues.Health;
	var playerHealth = "" + g_EsoBuildCombatState.currentHealth + " / " + g_EsoBuildLastInputValues.Health + " (" + pctHealth.toFixed(0) + "%)"; 
	$("#esotbCombatStat_PlayerHealth").text(playerHealth);
	
	var pctMagicka = g_EsoBuildCombatState.currentMagicka*100/g_EsoBuildLastInputValues.Magicka;
	var playerMagicka = "" + g_EsoBuildCombatState.currentMagicka + " / " + g_EsoBuildLastInputValues.Magicka + " (" + pctMagicka.toFixed(0) + "%)"; 
	$("#esotbCombatStat_PlayerMagicka").text(playerMagicka);
	
	var pctStamina = g_EsoBuildCombatState.currentStamina*100/g_EsoBuildLastInputValues.Stamina;
	var playerStamina = "" + g_EsoBuildCombatState.currentStamina + " / " + g_EsoBuildLastInputValues.Stamina + " (" + pctStamina.toFixed(0) + "%)"; 
	$("#esotbCombatStat_PlayerStamina").text(playerStamina);
	
	var pctUltimate = g_EsoBuildCombatState.currentUltimate*100/ESOBUILD_MAX_ULTIMATE;
	var playerUltimate = "" + g_EsoBuildCombatState.currentUltimate + " / " + ESOBUILD_MAX_ULTIMATE + " (" + pctUltimate.toFixed(0) + "%)"; 
	$("#esotbCombatStat_PlayerUltimate").text(playerUltimate);
}


window.EsoBuildCombatSkillBarSwap = function (skillBarIndex)
{
	if (skillBarIndex <= 0) return false;
	if (skillBarIndex  > 4) return false;
	if (g_EsoBuildActiveAbilityBar == skillBarIndex) return true;
	if (g_EsoBuildCombatState.isWerewolf && skillBarIndex != 4) return false;
	
	var skillBarElement = $("#esovsSkillBar" + skillBarIndex);
	var weaponBarIndex = skillBarElement.attr("activeweaponbar");
	
	SetEsoSkillBarSelect(skillBarIndex, weaponBarIndex);
	
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
	
	EsoBuildCombatUpdateComputedStats();
	
	return true;
}


window.CopyEsoSkillsToCombatTab = function ()
{
	$("#esotbCombatSkillCopy").html($("#esovsSkillBar").html());
	
	$("#esotbCombatSkillCopy #esovsSkillBar1").attr("id", null);
	$("#esotbCombatSkillCopy #esovsSkillBar2").attr("id", null);
	$("#esotbCombatSkillCopy #esovsSkillBar3").attr("id", null);

	$("#esotbCombatSkillCopy .esovsSkillBarItem").removeClass("ui-droppable");
	$("#esotbCombatUniqueSkills .esovsCombatSkillBarItem").removeClass("ui-droppable").removeClass("ui-draggable");
	
	$("#esotbCombatSkillCopy .esovsSkillBar").click(OnSkillBarSelect);
	
	$("#esotbCombatSkillCopy .esovsSkillBarIcon, #esotbCombatUniqueSkills .esovsSkillBarIcon").draggable({ 
		containment: false,
		appendTo: $('body'),
		helper: 'clone',
		revert: OnCombatSkillBarRevertDraggable,
		start: OnCombatSkillBarDraggableStart,
		classes: { },
	}).hover(OnHoverEsoSkillBarIcon, OnLeaveEsoSkillBarIcon);
}


window.OnCombatSkillBarRevertDraggable = function (droppableObj)
{
	return false;
}


window.OnCombatSkillBarDraggableStart = function (event, ui) 
{
	if (g_EsoBuildCombatIsRunning) 
	{
		event.preventDefault();
		return;
	}
	
	$(".ui-draggable-dragging").addClass('esovsSkillDraggableBad').addClass('esovsSkillDraggable');
	
	$("#esovsPopupSkillTooltip").hide();
	
	$("#esovsSkillBar").find(".esovsSkillBarIcon").removeAttr("oldsrc");
}


window.OnCombatIconDroppableOut = function (event, ui)
{
	var $this = $(this);
	var realDraggable = $(".ui-draggable-dragging");
	var currentImage = $this.find("img");
	var oldSrc = currentImage.attr("oldsrc");
	
	realDraggable.addClass("esovsSkillDraggableBad");
	realDraggable.removeClass("esovsSkillDraggableGood");
	
	if (oldSrc != null) currentImage.attr("src", oldSrc);
}


window.OnCombatIconDroppableOver = function (event, ui)
{
	var $this = $(this);
	var realDraggable = $(".ui-draggable-dragging");
	var currentImage = $this.find("img");
	var src = currentImage.attr("src");
	var newSrc = "";
	
	realDraggable.removeClass("esovsSkillDraggableBad");
	realDraggable.addClass("esovsSkillDraggableGood");
	
	if (realDraggable.hasClass("esovsSkillBarIcon")) newSrc = realDraggable.attr("src");

	if (src == null) src == "";
	currentImage.attr("oldsrc", src);
	if (newSrc) currentImage.attr("src", newSrc);
}


window.OnCombatIconDroppableAccept = function (draggable)
{
	if (g_EsoBuildCombatIsRunning) return false;
	
	var $this = $(this);
	draggable = $(draggable);
	
	var sourceAbilityId = -1;
	var sourceSkillIndex = -1;
	
	if (draggable.hasClass("esovsSkillBarIcon"))
	{
		sourceAbilityId = parseInt(draggable.attr("skillid"));
	}
	else
	{
		return false;
	}
	
	var skillData = g_SkillsData[sourceAbilityId];
	if (skillData == null) return false;
	
	return true;
}


window.EsoBuildCombatGetSkillActionHtml = function(skillData, abilityId, actionData)
{
	if (skillData == null) return "Unknown Skill #" + abilityId;
	
	if (abilityId == ESOBUILD_UNIQUESKILLID_WAIT)
	{
		var output = "";
		var initialValue = 0;
		
		if (actionData != null) initialValue = actionData;
		
		output = "Wait <input type='number' class='esotbCombatWaitAction' value='" + initialValue + "' step='0.1' min='0' max='100'> seconds";
		
		return output;
	}
	else if (abilityId == ESOBUILD_UNIQUESKILLID_POTION)
	{
		var output = "";
		var initialValue = "";
		
		if (actionData != null) initialValue = actionData;
		
		output = "Use ";
		output += "<select class='esotbCombatPotionAction'>";
		
		for (var potionName in ESOBUILD_COMBAT_POTIONDATA)
		{
			var potionData = ESOBUILD_COMBAT_POTIONDATA[potionName];
			var selected = "";
			
			if (initialValue == potionName) selected = "selected";
			output += "<option value='" + potionName + "' " + selected + ">" + potionName + "</option>";
		}
		
		output += "</select>";
		
		return output;
	}
	
	return skillData.name;
}


window.OnCombatIconDrop = function (event, ui)
{
	var $this = $(this);
	var combatBlock = $this.parent(".esotbCombatBlock");
	var sourceBlockIcon = $(ui.draggable);
	
	var sourceAbilityId = -1;
	var sourceOrigAbilityId = -1;
	var sourceIconUrl = -1;
	
	if (sourceBlockIcon.hasClass("esovsSkillBarIcon"))
	{
		sourceAbilityId = parseInt(sourceBlockIcon.attr("skillid"));
		sourceOrigAbilityId = parseInt(sourceBlockIcon.attr("origskillid"));
		sourceIconUrl = sourceBlockIcon.attr("src");
	}
	
	if (sourceAbilityId <= 0) return false;
	
	$this.attr("origskillid", sourceOrigAbilityId);
	$this.attr("skillid", sourceAbilityId);
	$this.children("img").attr("src", sourceIconUrl);
	var combatId = parseInt(combatBlock.attr("combatid"));
	var combatData = g_EsoBuildCombatPlayerActions[combatId];
	
	var skillData = g_SkillsData[sourceAbilityId];
	var elementName = $this.siblings(".esovsCombatSkillName");
	
	var html = EsoBuildCombatGetSkillActionHtml(skillData, sourceAbilityId);
	elementName.html(html);
	
	if (combatData) 
	{
		combatData.abilityId = sourceAbilityId;
		combatData.skillData = skillData;
	}
	
	EsoBuildCombatFixActionData();
	
	event.preventDefault();
	event.stopPropagation();
}


window.EsoBuildCombatIsSkillOnBar = function(abilityId, skillBarIndex)
{
	var skillElements = $("#esotbCombatSkillCopy").children(".esovsSkillBar[skillbar='" + skillBarIndex + "']").find(".esovsSkillBarIcon");
	var returnResult = false;
	
	skillElements.each(function() {
		var $this = $(this);
		var skillAbilityId = parseInt($this.attr("skillid"));
		var skillBar = parseInt($this.attr("skillbar"));
		
		if (skillBar == skillBarIndex && skillAbilityId == abilityId) {
			returnResult = true;
			return false;
		}
		
		return true;
	});
	
	return returnResult;
}


window.EsoBuildCombatWhichBarHasSkill = function(abilityId)
{
	var skillElements = $("#esotbCombatSkillCopy").find(".esovsSkillBarIcon");
	var returnResult = -1;
	
	skillElements.each(function() {
		var $this = $(this);
		var skillAbilityId = parseInt($this.attr("skillid"));
		var skillBar = parseInt($this.attr("skillbar"));
		
		if (skillAbilityId == abilityId) {
			returnResult = skillBar;
			return false;
		}
		
		return true;
	});
	
	return returnResult;
}


window.EsoBuildCombatGetCombatBlocks = function() 
{
	return $(".esotbCombatBlock").not("#esotbCombatBlockTemplate").not(".ui-draggable-dragging");
}


window.EsoBuildCombatUpdatePotionData = function(action, skillBarIndex, combatBlockElement)
{
	var currentValue = combatBlockElement.find(".esotbCombatPotionAction").val();
	var combatId = combatBlockElement.attr("combatid");
	var action = g_EsoBuildCombatPlayerActions[combatId];
	
	combatBlockElement.attr("actiondata", currentValue);
	
	if (action) action.actionData = currentValue;
}


window.EsoBuildCombatUpdateWaitData = function(action, skillBarIndex, combatBlockElement)
{
	var currentValue = combatBlockElement.find(".esotbCombatWaitAction").val();
	var combatId = combatBlockElement.attr("combatid");
	var action = g_EsoBuildCombatPlayerActions[combatId];
	
	combatBlockElement.attr("actiondata", currentValue);
	
	if (action) action.actionData = parseFloat(currentValue);
}


window.EsoBuildCombatUpdateLightAttackData = function(action, skillBarIndex, combatBlockElement)
{
	var mainHandItem = {};
	var offHandItem = {};
	var weaponType = "";
	var abilityId = -1;
	
	if (skillBarIndex == 1) {
		mainHandItem = g_EsoBuildItemData['MainHand1'];
		offHandItem = g_EsoBuildItemData['OffHand1'];
	}
	else if (skillBarIndex == 2) {
		mainHandItem = g_EsoBuildItemData['MainHand2'];
		offHandItem = g_EsoBuildItemData['OffHand2'];
	}
	else if (skillBarIndex == 4) {
		return;
	}
	
	switch (parseInt(mainHandItem.weaponType)) 
	{
	case 1:
	case 2:
	case 3:
	case 11:
		if (offHandItem.weaponType == null) {
			weaponType = "OneHand";
			abilityId = ESOBUILD_UNIQUESKILLID_LAONEHANDANDSHIELD;
		}
		else if (offHandItem.weaponType == 14) {
			weaponType = "OneHand";
			abilityId = ESOBUILD_UNIQUESKILLID_LAONEHANDANDSHIELD;
		}
		else {
			weaponType = "DualWield";
			abilityId = ESOBUILD_UNIQUESKILLID_LADUALWIELD;
		}
		break;
	case 4:
	case 5:
	case 6:
		weaponType = "TwoHanded";
		abilityId = ESOBUILD_UNIQUESKILLID_LATWOHANDED;
		break;
	case 8:
		weaponType = "Bow";
		abilityId = ESOBUILD_UNIQUESKILLID_LABOW;
		break;
	case 9:
		weaponType = "Restoration";
		abilityId = ESOBUILD_UNIQUESKILLID_LARESTORATION;
		break;
	case 12:
		weaponType = "FlameStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_LAFLAMEDEST;
		break;
	case 13:
		weaponType = "FrostStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_LAFROSTDEST;
		break;
	case 15:
		weaponType = "ShockStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_LASHOCKDEST;
		break;
	default:
		weaponType = "Unarmed";
		abilityId = ESOBUILD_UNIQUESKILLID_LAUNARMED;
		break;
	}
	
	action.abilityId = abilityId;
	action.skillData = g_SkillsData[abilityId];
	
	EsoBuildCombatSetSlotSkill(combatBlockElement, action);
}


window.EsoBuildCombatUpdateHeavyAttackData = function(action, skillBarIndex, combatBlockElement)
{
	var mainHandItem = {};
	var offHandItem = {};
	var weaponType = "";
	var abilityId = -1;
	
	if (skillBarIndex == 1) {
		mainHandItem = g_EsoBuildItemData['MainHand1'];
		offHandItem = g_EsoBuildItemData['OffHand1'];
	}
	else if (skillBarIndex == 2) {
		mainHandItem = g_EsoBuildItemData['MainHand2'];
		offHandItem = g_EsoBuildItemData['OffHand2'];
	}
	else if (skillBarIndex == 4) {
		return;
	}
	
	switch (parseInt(mainHandItem.weaponType)) 
	{
	case 1:
	case 2:
	case 3:
	case 11:
		if (offHandItem.weaponType == null) {
			weaponType = "OneHand";
			abilityId = ESOBUILD_UNIQUESKILLID_HAONEHANDANDSHIELD;
		}
		else if (offHandItem.weaponType == 14) {
			weaponType = "OneHand";
			abilityId = ESOBUILD_UNIQUESKILLID_HAONEHANDANDSHIELD;
		}
		else {
			weaponType = "DualWield";
			abilityId = ESOBUILD_UNIQUESKILLID_HADUALWIELD;
		}
		break;
	case 4:
	case 5:
	case 6:
		weaponType = "TwoHanded";
		abilityId = ESOBUILD_UNIQUESKILLID_HATWOHANDED;
		break;
	case 8:
		weaponType = "Bow";
		abilityId = ESOBUILD_UNIQUESKILLID_HABOW;
		break;
	case 9:
		weaponType = "Restoration";
		abilityId = ESOBUILD_UNIQUESKILLID_HARESTORATION;
		break;
	case 12:
		weaponType = "FlameStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_HAFLAMEDEST;
		break;
	case 13:
		weaponType = "FrostStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_HAFROSTDEST;
		break;
	case 15:
		weaponType = "ShockStaff";
		abilityId = ESOBUILD_UNIQUESKILLID_HASHOCKDEST;
		break;
	default:
		weaponType = "Unarmed";
		abilityId = ESOBUILD_UNIQUESKILLID_HAUNARMED;
		break;
	}
	
	action.abilityId = abilityId;
	action.skillData = g_SkillsData[abilityId];
	
	EsoBuildCombatSetSlotSkill(combatBlockElement, action);
}


window.EsoBuildCombatRemoveInvalidSkills = function()
{
	var combatBlocks = EsoBuildCombatGetCombatBlocks();
	var idsToDelete = [];
	
	for (var combatId in g_EsoBuildCombatPlayerActions)
	{
		var action = g_EsoBuildCombatPlayerActions[combatId];
		
		if (action.abilityId >= ESOBUILD_UNIQUESKILLID_MIN && action.abilityId <= ESOBUILD_UNIQUESKILLID_MAX) continue;
		if (action.abilityId < 0) continue;
		
		var barIndex = EsoBuildCombatWhichBarHasSkill(action.abilityId);
		if (barIndex <= 0) idsToDelete.push(combatId);
	}
	
	for (var i = 0; i < idsToDelete.length; ++i)
	{
		var combatId = idsToDelete[i];
		var action = g_EsoBuildCombatPlayerActions[combatId];
		
		if (combatId != action.combatId) EsoBuildLog("Deleting invalid combat action ID mismatch!", combatId, action.combatId);
		
		$(".esotbCombatBlock[combatid='" + action.combatId + "']").remove();
		
		delete g_EsoBuildCombatPlayerActions[combatId];
	}
}


window.EsoBuildCombatFixActionData = function() 
{
	var currentSkillBar = ESOBUILD_COMBAT_INITIALSKILLBAR;
	var barSwapIndexes = {};
	var actionIndex = -1;
	
	EsoBuildCombatRemoveInvalidSkills();
	
	var combatBlocks = EsoBuildCombatGetCombatBlocks();
	
	combatBlocks.each(function() {
		var $this = $(this);
		var combatId = parseInt($this.attr("combatid"));
		var action = g_EsoBuildCombatPlayerActions[combatId];
		
		++actionIndex;
		
		if (action == null) return true;
		if (action.abilityId <= 0) return true;
		
		if (action.abilityId == ESOBUILD_UNIQUESKILLID_BARSWAP1) {
			currentSkillBar = 1;
		}
		else if (action.abilityId == ESOBUILD_UNIQUESKILLID_BARSWAP2) {
			currentSkillBar = 2;
		}
		else if (action.abilityId == ESOBUILD_UNIQUESKILLID_BARSWAP3) {
			currentSkillBar = 3;
		}
		else if (action.abilityId == ESOBUILD_UNIQUESKILLID_BARSWAP4) {
			currentSkillBar = 4;
		}
		else if (action.abilityId >= ESOBUILD_UNIQUESKILLID_MIN && action.abilityId <= ESOBUILD_UNIQUESKILLID_MAX) {
			
			if (action.abilityId >= ESOBUILD_UNIQUESKILLID_LAMIN && action.abilityId <= ESOBUILD_UNIQUESKILLID_LAMAX) 
			{
				EsoBuildCombatUpdateLightAttackData(action, currentSkillBar, $this);
			}
			else if (action.abilityId >= ESOBUILD_UNIQUESKILLID_HAMIN && action.abilityId <= ESOBUILD_UNIQUESKILLID_HAMAX) 
			{
				EsoBuildCombatUpdateHeavyAttackData(action, currentSkillBar, $this);
			}
			else if (action.abilityId == ESOBUILD_UNIQUESKILLID_WAIT)
			{
				EsoBuildCombatUpdateWaitData(action, currentSkillBar, $this);
			}
			else if (action.abilityId == ESOBUILD_UNIQUESKILLID_POTION)
			{
				EsoBuildCombatUpdatePotionData(action, currentSkillBar, $this);
			}
			
			// TODO
		}
		else if (!EsoBuildCombatIsSkillOnBar(action.abilityId, currentSkillBar))
		{
			var barIndex = EsoBuildCombatWhichBarHasSkill(action.abilityId);
			
			if (barIndex > 0) {
				barSwapIndexes[actionIndex] = barIndex;
				currentSkillBar = barSwapIndexes[actionIndex];
			}
		}
		
		return true;
	});
	
	var shiftIndex = 0;
	
	for (var i in barSwapIndexes)
	{
		var skillBarIndex = barSwapIndexes[i];
		var insertIndex = parseInt(i) + shiftIndex;
		++shiftIndex;
		
		var newAction = EsoBuildCombatCreateNewCombatAction();
		var newElement = EsoBuildCombatAddSlotElement(newAction.combatId, insertIndex);
		
		newAction.abilityId = ESOBUILD_UNIQUESKILLID_BARSWAP1 + skillBarIndex - 1;
		newAction.skillData = g_SkillsData[newAction.abilityId];
		
		EsoBuildCombatSetSlotSkill(newElement, newAction);
	}
	
	EsoBuildCombatFixCombatIds();
	
	return true;
}


window.OnEsoBuildCombatAddSlot = function(e)
{
	var newAction = EsoBuildCombatCreateNewCombatAction();
	return EsoBuildCombatAddSlotElement(newAction.combatId);
}


window.EsoBuildCombatCreateNewCombatAction = function()
{
	var newCombat = {};
	newCombat.combatId = EsoBuildCombatGetNextFreeCombatId();
	newCombat.abilityId = -1;
	newCombat.skillData = null;
	newCombat.actionData = null;
	
	g_EsoBuildCombatPlayerActions[newCombat.combatId] = newCombat;
	
	return newCombat;
}


window.EsoBuildCombatAddSlotElement = function(combatId, insertIndex) 
{
	var src = $("#esotbCombatBlockTemplate");
	var copy = src.clone();
	
	copy.show().attr("id", "").attr("combatid", combatId);
	
	copy.find(".esovsCombatSkillIcon").droppable({ 
		drop: OnCombatIconDrop, 
		accept: OnCombatIconDroppableAccept,
		out: OnCombatIconDroppableOut,
		over: function(event, ui) { setTimeout(OnCombatIconDroppableOver.bind(this, event, ui), 0); },
	}).hover(OnHoverEsoSkillBarIcon, OnLeaveEsoSkillBarIcon);
	
	copy.droppable({ 
		drop: OnCombatBlockDrop, 
		accept: OnCombatBlockDroppableAccept,
		out: OnCombatBlockDroppableOut,
		over: function(event, ui) { setTimeout(OnCombatBlockDroppableOver.bind(this, event, ui), 0); },
	}).draggable({ 
		revert: false,
		containment: false,
		appendTo: $('body'),
		helper: 'clone',
		stop: OnCombatBlockBarDraggableStop,
		start: OnCombatBlockDraggableStart,
	});
	
	if (insertIndex >= 0) {
		var blocks = EsoBuildCombatGetCombatBlocks();
		
		if (blocks[insertIndex])
			copy.insertBefore(blocks[insertIndex]);
		else
			copy.insertBefore("#esotbCombatAddSlot");
	}
	else {
		copy.insertBefore("#esotbCombatAddSlot");
	}
	
	return copy;
}


window.OnCombatBlockDrop = function(event, ui)
{
	var $this = $(this);
	
		/* Dropped a skill icon onto the add slot button */
	if ($this.hasClass("esotbCombatAddSlot") && ui.draggable.hasClass("esovsSkillBarIcon")) 
	{
		var newSlot = OnEsoBuildCombatAddSlot();
		OnCombatIconDrop.call(newSlot.children(".esovsCombatSkillIcon"), event, ui);
		return;
	}
	
	EsoBuildCombatFixActionData();
	
	g_EsoBuildCombatBlockDragging = $();
	g_EsoBuildCombatBlockDragOrig = $();
	g_EsoBuildCombatBlockDragLastOver = $();
	
	$(".esotbCombatBlockHover").removeClass("esotbCombatBlockHover");
	$(".esotbCombatAddSlotHover").removeClass("esotbCombatAddSlotHover");
	$(".esotbCombatBlockDragging").removeClass("esotbCombatBlockDragging");
	$(".esotbCombatNoHover").removeClass("esotbCombatNoHover");
}


window.OnCombatBlockDroppableOut = function(event, ui)
{
	var $this = this;
	
	g_EsoBuildCombatBlockDragOrig.hide().removeClass("esotbCombatBlockDragging");
	g_EsoBuildCombatBlockDragging.show();
	
	g_EsoBuildCombatBlockDragLastOver.removeClass("esotbCombatBlockHover");
	$(".esotbCombatBlockHover").removeClass("esotbCombatBlockHover");
	$(".esotbCombatAddSlotHover").removeClass("esotbCombatAddSlotHover");
	
	g_EsoBuildCombatBlockDragLastOver = $();
}


window.EsoBuildCombatFixCombatIds = function()
{
	var combatBlocks = EsoBuildCombatGetCombatBlocks();
	var actionIndex = 0;
	var transformIds = {};
	var combatElements = {};
	
	combatBlocks.each(function() {
		var $this = $(this);
		var combatId = parseInt($this.attr("combatid"));
		
		++actionIndex;
		
		transformIds[combatId] = actionIndex;
		combatElements[combatId] = $(".esotbCombatBlock[combatId='" + combatId + "']")
		return true;
	});
	
	var newRotation = {};
	
	for (var combatId in g_EsoBuildCombatPlayerActions)
	{
		var action = g_EsoBuildCombatPlayerActions[combatId];
		action.combatId = transformIds[action.combatId];
		newRotation[action.combatId] = action;
		combatElements[combatId].attr("combatId", transformIds[combatId]);
	}
	
	g_EsoBuildCombatPlayerActions = newRotation;
	g_EsoBuildCombatPlayerRotations[g_EsoBuildCombatCurrentRotation] = g_EsoBuildCombatPlayerActions;
}


window.OnCombatBlockBarDraggableStop = function(event, ui)
{
	if (g_EsoBuildCombatBlockDragOrig.is(":visible")) 
	{
		OnCombatBlockDrop();
		return;
	}
	
	var combatId = g_EsoBuildCombatBlockDragOrig.attr("combatid");
	
	g_EsoBuildCombatBlockDragOrig.remove();
	if (combatId >= 1) delete g_EsoBuildCombatPlayerActions[combatId];
	
	EsoBuildCombatFixActionData();
	
	g_EsoBuildCombatBlockDragging = $();
	g_EsoBuildCombatBlockDragOrig = $();
	g_EsoBuildCombatBlockDragLastOver = $();
	
	$(".esotbCombatAddSlotHover").removeClass("esotbCombatAddSlotHover");
	$(".esotbCombatBlockHover").removeClass("esotbCombatBlockHover");
	$(".esotbCombatBlockDragging").removeClass("esotbCombatBlockDragging");
	$(".esotbCombatNoHover").removeClass("esotbCombatNoHover");
}


window.OnCombatBlockDroppableOver = function(event, ui)
{
	var $this = $(this);
	
	if ($this.hasClass("esotbCombatAddSlot") && ui.draggable.hasClass("esovsSkillBarIcon")) 
	{
		$(".esotbCombatBlockHover").removeClass("esotbCombatBlockHover");
		$this.addClass("esotbCombatAddSlotHover");
		return;
	}
	
	g_EsoBuildCombatBlockDragLastOver = $this;
	g_EsoBuildCombatBlockDragOrig.insertBefore($this);
	g_EsoBuildCombatBlockDragOrig.show().addClass("esotbCombatBlockDragging");
	g_EsoBuildCombatBlockDragging.hide();
	
	$this.addClass("esotbCombatBlockHover");
}


window.OnCombatBlockDraggableStart = function(event, ui)
{
	if (g_EsoBuildCombatIsRunning) 
	{
		event.preventDefault();
		return;
	}
	
	g_EsoBuildCombatBlockDragging = $(".ui-draggable-dragging");
	g_EsoBuildCombatBlockDragInsert = $();
	g_EsoBuildCombatBlockDragLastOver = $();
	
	$("#esotbCombatRoot .esotbCombatBlock").addClass("esotbCombatNoHover");
	
	var combatId = parseInt(g_EsoBuildCombatBlockDragging.attr("combatid"));
	var origBlock = $("#esotbCombatRoot .esotbCombatBlock[combatid='" + combatId + "']");
	
	g_EsoBuildCombatBlockDragOrig = origBlock;
	g_EsoBuildCombatBlockDragOrig.hide();
	g_EsoBuildCombatBlockDragOrig.removeClass("esotbCombatNoHover");
	
	$("#esovsPopupSkillTooltip").hide();
}


window.OnCombatBlockAddSlotDroppableAccept = function (droppable)
{
	if (g_EsoBuildCombatIsRunning) return false;
	
	var $droppable = $(droppable);
	
	if ($droppable.hasClass("esotbCombatBlock")) return true;
	if ($droppable.hasClass("esotbCombatAddSlot")) return true;
	if ($droppable.hasClass("esovsSkillBarIcon")) return true;
	
	return false;
}


window.OnCombatBlockDroppableAccept = function(droppable)
{
	if (g_EsoBuildCombatIsRunning) return false;
	
	var $droppable = $(droppable);
	
	if ($droppable.hasClass("esotbCombatBlock")) return true;
	if ($droppable.hasClass("esotbCombatAddSlot")) return true;
	
	return false;
}

window.EsoBuildCombatLog = function(msg)
{
	var log = $("#esotbCombatLog");
	var currentTime = g_EsoBuildCombatState.currentTime.toFixed(3);
	
	var text = currentTime + " -- " + msg;
	var showText = EsoBuildCombatDoesTextMatchFilter(text);
	var newElement = $("<p>").text(text).toggle(showText);
	
	newElement.appendTo(log);
	// log.append("<p>" + text + "</p>");
	
	// log.scrollTop(log[0].scrollHeight)
}


window.EsoBuildResetCombatState = function()
{
	g_EsoBuildCombatState = jQuery.extend(true, {}, g_EsoBuildCombatStateTemplate);
	
	g_EsoBuildCombatState.currentHealth = g_EsoBuildLastInputValues.Health;
	g_EsoBuildCombatState.currentMagicka = g_EsoBuildLastInputValues.Magicka;
	g_EsoBuildCombatState.currentStamina = g_EsoBuildLastInputValues.Stamina;
	
	if (g_EsoBuildCombatOptions.startWithFullUltimate)
		g_EsoBuildCombatState.currentUltimate = ESOBUILD_MAX_ULTIMATE;
	else
		g_EsoBuildCombatState.currentUltimate = 0;
	
	g_EsoBuildCombatVolleyCounter = 0;
	g_EsoBuildCombatZaanCounter = 0;
	g_EsoBuildCombatSkeletalArcherAttackCount = 0;
	g_EsoBuildCombatGrimFocusCounter = 0;
	g_EsoBuildCombatOnslaughtResist = 0;
	g_EsoBuildCombatBloodFrenzyTickCount = 0;
	g_EsoBuildCombatBloodFrenzyTotalCost = 0;
	g_EsoBuildCombatNecroPetDeaths = 0;
	g_EsoBuildCombatLastNecroPetDeaths = 0;
	
	EsoBuildCombatResetBuffDisplay();
}


window.EsoBuildCombatResetBuffDisplay = function()
{
	$("#esotbCombatBuffs .esotbCombatBuff").remove();
}


window.EsoBuildCombatUpdateAllBuffDisplay = function()
{
	EsoBuildCombatUpdateAllBuffDisplay_Category("TargetStatus", g_EsoBuildCombatState.targetStatus);
	EsoBuildCombatUpdateAllBuffDisplay_Category("PlayerStatus", g_EsoBuildCombatState.playerStatus);
	EsoBuildCombatUpdateAllBuffDisplay_Category("Buffs", g_EsoBuildCombatState.buffs);
	EsoBuildCombatUpdateAllBuffDisplay_Category("Dots", g_EsoBuildCombatState.dots, 'endTime');
	EsoBuildCombatUpdateAllBuffDisplay_Category("Pets", g_EsoBuildCombatState.pets, 'endTime');
	EsoBuildCombatUpdateAllBuffDisplay_Category("Cooldowns", g_EsoBuildCombatState.cooldowns);
	EsoBuildCombatUpdateAllBuffDisplay_Category("RestoreStats", g_EsoBuildCombatState.restoreStats, 'endTime');
	EsoBuildCombatUpdateAllBuffDisplay_Category("Toggles", g_EsoBuildCombatState.toggles, 'endTime');
	EsoBuildCombatUpdateAllBuffDisplay_Category("Counters", g_EsoBuildCombatState.counters, 'endTime');
}


window.EsoBuildCombatMakeSafeId = function(id)
{
	id = id.replace(/['"]/g, "_");
	
	return id;
}

window.EsoBuildCombatUpdateAllBuffDisplay_Category = function(category, objects, endTimeField)
{
	var displayedIds = {};
	var elementsToDelete = [];
	
	for (var id in objects)
	{
		var endTime = 0;
		
		if (endTimeField != null)
			endTime = objects[id][endTimeField];
		else
			endTime = objects[id];
		
		var displayId = EsoBuildCombatUpdateBuffDisplay(category, id, endTime, objects[id]);
		
		displayedIds[displayId] = true;
	}
	
	 var combatBuffs = $("#esotbCombatBuffs_" + category + " .esotbCombatBuff");
	 
	 combatBuffs.each(function() {
		 var $this = $(this);
		 var id = $this.attr("buffid");
		 if (displayedIds[id] == null) elementsToDelete.push($this);
		 return true;
	});
	
	for (var i = 0; i < elementsToDelete.length; ++i)
	{
		var element = elementsToDelete[i];
		element.remove();
	}
	
}


window.EsoBuildCombatUpdateBuffDisplay = function(category, id, endTime, data)
{
	var origId = id;
	var displayName = id;
	
	if (category == "Dots")
	{
		id = data.name;
		displayName = id;
	}
	else if (category == "Buffs")
	{
		var buffData = g_EsoBuildBuffData[id];
		
		if (buffData) {
			if (buffData.category == "Target") {
				category = "TargetBuffs";
				id = id.replace(" (Target)", "");
			}
			else {
				category = "PlayerBuffs";
			}
		}
		
		displayName = id;
	}
	else if (category == "Toggles")
	{
		displayName = id;
	}
	else if (category == "Counters")
	{
		displayName = "" + id + ": " + data.value + " / " + data.maxCount + "";
	}
	
	id = EsoBuildCombatMakeSafeId(id);
	
	var buffElement = $("#esotbCombatBuffs_" + category + " .esotbCombatBuff[buffid='" + id + "']");
	
	if (buffElement.length == 0)
	{
		buffElement = $("<div/>").addClass("esotbCombatBuff")
			.attr("buffid", id)
			.appendTo($("#esotbCombatBuffs_" + category));
	}
	
	var timeRemaining = (endTime - g_EsoBuildCombatState.currentTime).toFixed(1);
	
	if (endTime > 0 && timeRemaining <= 0)
	{
		buffElement.remove();
		return;
	}
		
	var newText = "" + displayName + " (" + timeRemaining + " s)";
	if (endTime <= 0) newText = "" + displayName;
	
	buffElement.text(newText);
	
	return id;
}


window.EsoBuildCombatCheckTimesObj = function(objects, displayName) 
{
	var keysToDelete = [];
	
	for (var i in objects)
	{
		var time = objects[i];
		
		if (time - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			keysToDelete.push(i);
		}
	}
	
	for (var i = 0; i < keysToDelete.length; ++i)
	{
		if (displayName != null) 
		{
			EsoBuildCombatLog("Ending " + displayName + " " + keysToDelete[i] + ".");
		}
		
		delete objects[keysToDelete[i]];
	}
}

//

window.EsoBuildCombatCheckTargetStatusTimes = function() 
{
	var keysToDelete = [];
	
	for (var i in g_EsoBuildCombatState.targetStatus)
	{
		var time = g_EsoBuildCombatState.targetStatus[i];
		
		if (time - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			keysToDelete.push(i);
		}
	}
	
	for (var i = 0; i < keysToDelete.length; ++i)
	{
		if (g_EsoBuildCombatOptions.log.showStatusEffects) {
			EsoBuildCombatLog("Ending target status effect " + keysToDelete[i] + ".");
		}
		
		EsoBuildCombatRunGlobalEvent("onStatusEffectChange", keysToDelete[i], false);
		
		delete g_EsoBuildCombatState.targetStatus[keysToDelete[i]];
	}
}


window.EsoBuildCombatDoRegenTick = function()
{
	if (g_EsoBuildCombatOptions.log.showRegen) {
		EsoBuildCombatLog("Regen Tick: +" + g_EsoBuildLastInputValues.HealthRegen + " Health, +" + g_EsoBuildLastInputValues.MagickaRegen + " Magicka, +" + g_EsoBuildLastInputValues.StaminaRegen + " Stamina");
	}
	
	g_EsoBuildCombatState.currentHealth  += g_EsoBuildLastInputValues.HealthRegen;
	g_EsoBuildCombatState.currentMagicka += g_EsoBuildLastInputValues.MagickaRegen;
	g_EsoBuildCombatState.currentStamina += g_EsoBuildLastInputValues.StaminaRegen;
	
	EsoBuildCombatLogRestoreStat("regen", "Regen", "Health", g_EsoBuildLastInputValues.HealthRegen);
	EsoBuildCombatLogRestoreStat("regen", "Regen", "Magicka", g_EsoBuildLastInputValues.MagickaRegen);
	EsoBuildCombatLogRestoreStat("regen", "Regen", "Stamina", g_EsoBuildLastInputValues.StaminaRegen);
	
	if (g_EsoBuildCombatState.currentHealth  > g_EsoBuildLastInputValues.Health)  g_EsoBuildCombatState.currentHealth  = g_EsoBuildLastInputValues.Health;
	if (g_EsoBuildCombatState.currentMagicka > g_EsoBuildLastInputValues.Magicka) g_EsoBuildCombatState.currentMagicka = g_EsoBuildLastInputValues.Magicka;
	if (g_EsoBuildCombatState.currentStamina > g_EsoBuildLastInputValues.Stamina) g_EsoBuildCombatState.currentStamina = g_EsoBuildLastInputValues.Stamina;
	
	g_EsoBuildCombatState.playerStatus['playerRegen'] = g_EsoBuildCombatState.currentTime + ESOBUILD_COMBAT_REGENTICKLENGTH;
}


window.EsoBuildCombatDoRestoreTick = function()
{
	var restoreValues = [];
	
	if (g_EsoBuildLastInputValues.HealthRestore   > 0) restoreValues.push("+" + g_EsoBuildLastInputValues.HealthRestore   + " Health");
	if (g_EsoBuildLastInputValues.MagickaRestore  > 0) restoreValues.push("+" + g_EsoBuildLastInputValues.MagickaRestore  + " Magicka");
	if (g_EsoBuildLastInputValues.StaminaRestore  > 0) restoreValues.push("+" + g_EsoBuildLastInputValues.StaminaRestore  + " Stamina");
	if (g_EsoBuildLastInputValues.UltimateRestore > 0) restoreValues.push("+" + g_EsoBuildLastInputValues.UltimateRestore + " Ultimate");
	
	if (restoreValues.length > 0) 
	{
		var outText = restoreValues.join(", ");
		
		if (g_EsoBuildCombatOptions.log.showRestore) {
			EsoBuildCombatLog("Restore Tick: " + outText);
		}
	}
	
	g_EsoBuildCombatState.currentHealth   += g_EsoBuildLastInputValues.HealthRestore;
	g_EsoBuildCombatState.currentMagicka  += g_EsoBuildLastInputValues.MagickaRestore;
	g_EsoBuildCombatState.currentStamina  += g_EsoBuildLastInputValues.StaminaRestore;
	g_EsoBuildCombatState.currentUltimate += g_EsoBuildLastInputValues.UltimateRestore;
	
	EsoBuildCombatLogRestoreStatFromStatSource("restore", "Restore Tick", "Health", "HealthRestore");
	EsoBuildCombatLogRestoreStatFromStatSource("restore", "Restore Tick", "Magicka", "MagickaRestore");
	EsoBuildCombatLogRestoreStatFromStatSource("restore", "Restore Tick", "Stamina", "StaminaRestore");
	EsoBuildCombatLogRestoreStatFromStatSource("restore", "Restore Tick", "Ultimate", "UltimateRestore");
	
	if (g_EsoBuildCombatState.currentHealth  > g_EsoBuildLastInputValues.Health)  g_EsoBuildCombatState.currentHealth  = g_EsoBuildLastInputValues.Health;
	if (g_EsoBuildCombatState.currentMagicka > g_EsoBuildLastInputValues.Magicka) g_EsoBuildCombatState.currentMagicka = g_EsoBuildLastInputValues.Magicka;
	if (g_EsoBuildCombatState.currentStamina > g_EsoBuildLastInputValues.Stamina) g_EsoBuildCombatState.currentStamina = g_EsoBuildLastInputValues.Stamina;
	if (g_EsoBuildCombatState.currentUltimate > ESOBUILD_MAX_ULTIMATE) g_EsoBuildCombatState.currentUltimate = ESOBUILD_MAX_ULTIMATE;
	
	g_EsoBuildCombatState.playerStatus['playerRestore'] = g_EsoBuildCombatState.currentTime + ESOBUILD_COMBAT_RESTORETICKLENGTH;
}


window.EsoBuildCombatLogRestoreStatFromStatSource = function(srcType, srcData, statName, statSourceName)
{
	for (var i in g_EsoInputStatSources[statSourceName])
	{
		var statSource = g_EsoInputStatSources[statSourceName][i];
		
		if (statSource.buff && statSource.buffName) {
			EsoBuildCombatLogRestoreStat("buff", statSource.buffName, statName, statSource.value);
		}
		else if (statSource.set) {
			EsoBuildCombatLogRestoreStat("set", statSource.set.name, statName, statSource.value);
		}
		else {
			EsoBuildCombatLogRestoreStat(srcType, "Unknown", statName, statSource.value);
		}
	}
	
}


window.EsoBuildCombatRunDots = function()
{
	var dotsToDelete = [];
	
	for (var dotId in g_EsoBuildCombatState.dots) 
	{
		var dot = g_EsoBuildCombatState.dots[dotId];
		
		if (dot.endTime > 0 && dot.endTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			var damage = EsoBuildCombatRunSkillFunc(dot.srcData, "getDotTickDamage", "+", 0, dot.tickCount);
			if (isNaN(damage)) continue;
			if (damage == 0) damage = dot.damage;
			
			dotsToDelete.push(dotId);	// TODO: Skill run time
			EsoBuildCombatApplyDamage(dot.srcType, dot.srcData, damage, dot.damageType, true, dot.isAOE, dot.isBleed, dot.isPet);
			EsoBuildCombatLog("Ending DOT " + dot.name + ".");
			EsoBuildCombatRunSkillEvent(dot.srcData, "onFinalHit");
			
			if (dot.srcType == "heavyattack") EsoBuildCombatCheckWeaponEnchants();
			
			++dot.tickCount;
		}
		else if (dot.nextTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime)
		{
			var damage = EsoBuildCombatRunSkillFunc(dot.srcData, "getDotTickDamage", "+", 0, dot.tickCount);
			if (damage == 0) damage = dot.damage;
			
			EsoBuildCombatApplyDamage(dot.srcType, dot.srcData, damage, dot.damageType, true, dot.isAOE, dot.isBleed, dot.isPet);
			dot.nextTime = g_EsoBuildCombatState.currentTime + dot.tickTime;
			
			if (dot.srcType == "heavyattack") EsoBuildCombatCheckWeaponEnchants();
			
			++dot.tickCount;
		}
	}
	
	for (var i = 0; i < dotsToDelete.length; ++i)
	{
		delete g_EsoBuildCombatState.dots[dotsToDelete[i]];
	}
}


window.EsoBuildCombatRunRestoreStats = function() {
	var statsToDelete = [];
	
	for (var statId in g_EsoBuildCombatState.restoreStats)
	{
		var statData = g_EsoBuildCombatState.restoreStats[statId];
		var endTime = statData.endTime;
		
		if (endTime > 0 && endTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			statsToDelete.push(statId);						// TODO: Buff run time
			
			if (g_EsoBuildCombatOptions.log.showRestore) {
				EsoBuildCombatLog("Ending restore stat buff " + statId + " duration.");
			}
		}
		else if (statData.nextTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime)
		{
			EsoBuildCombatRestoreStat(statData.srcType, statData.srcData, statData.stat, statData.amtPerTick);
			statData.nextTime = g_EsoBuildCombatState.currentTime + statData.tickTime;
		}
	}
	
	for (var i = 0; i < statsToDelete.length; ++i)
	{
		delete g_EsoBuildCombatState.restoreStats[statsToDelete[i]];
	}
}


window.EsoBuildCombatCheckCastSkillToggle = function(toggleData)
{
	if (toggleData.srcType != "cast" || toggleData.nextTime < 0) return true;
	
	if (toggleData.nextTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
	{
		var statValue = g_EsoBuildCombatState['current' + toggleData.costType];
		var costText = GetEsoSkillCost(toggleData.skillData.abilityId, null, false);
		
		toggleData.cost = parseInt(costText);
		
		var costMod = EsoBuildCombatRunGlobalGetFunc("getCostMod", 1.0, "*", skillData, cost);
		if (costMod != 1) toggleData.cost = Math.floor(toggleData.cost * costMod);
		
		var newStatValue = statValue - toggleData.cost;
		
		if (!g_EsoBuildCombatOptions.ignoreResources && newStatValue < 0) return false; 
		
		if (toggleData.costType == "Health") 
		{
			g_EsoBuildCombatState.currentHealth -= toggleData.cost;
		}
		else if (toggleData.costType == "Magicka") 
		{
			g_EsoBuildCombatState.currentMagicka -= toggleData.cost;
		}
		else if (toggleData.costType == "Stamina") 
		{
			g_EsoBuildCombatState.currentStamina -= toggleData.cost;
		}
		
		if (g_EsoBuildCombatOptions.log.showToggles) {
			EsoBuildCombatLog("Player skill cast toggle " + toggleData.name + " (#" + toggleData.abilityId + ") cost " + toggleData.cost + " " + toggleData.costType + ".");
		}
		
		toggleData.nextTime = g_EsoBuildCombatState.currentTime + toggleData.costTime;
	}
	
	return true;
}


window.EsoBuildCombatCheckCounters = function()
{
	var countersToDelete = [];
	
	for (var counterId in g_EsoBuildCombatState.counters)
	{
		var counterData = g_EsoBuildCombatState.counters[counterId];
		
		if (counterData.nextTime > 0 && counterData.nextTime -  ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			counterData.onTick(counterData, counterData.value);
			counterData.nextTime = g_EsoBuildCombatState.currentTime + counterData.tickTime;
		}
		else if (counterData.endTime > 0 && counterData.endTime -  ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime)
		{
			countersToDelete.push(counterId);
		}
	}
	
	for (var i = 0; i < countersToDelete.length; ++i)
	{
		EsoBuildCombatRemoveCounter(countersToDelete[i]);
	}
}


window.EsoBuildCombatCheckToggles = function()
{
	var togglesToDelete = [];
	
	for (var toggleId in g_EsoBuildCombatState.toggles)
	{
		var toggleData = g_EsoBuildCombatState.toggles[toggleId];
		
		if (toggleData.srcType == "cast")
		{
			var isOk = EsoBuildCombatCheckCastSkillToggle(toggleData);
			if (!isOk) togglesToDelete.push(toggleId);
		}
		else if (toggleData.endTime > 0 && toggleData.endTime -  ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime)
		{
			togglesToDelete.push(toggleId);
		}
		
	}
	
	for (var i = 0; i < togglesToDelete.length; ++i)
	{
		EsoBuildCombatRemoveToggle(togglesToDelete[i]);
	}
}


window.EsoBuildCombatCheckBuffs = function() {
	var buffsToDelete = [];
	
	for (var buffId in g_EsoBuildCombatState.buffs)
	{
		var endTime = g_EsoBuildCombatState.buffs[buffId];
		
		if (endTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			buffsToDelete.push(buffId);						// TODO: Buff run time
			var buffData = g_EsoBuildBuffData[buffId];
			if (buffData) buffData.combatEnabled = false;
			
			if (g_EsoBuildCombatOptions.log.showBuffs) {
				EsoBuildCombatLog("Ending buff " + buffId + " duration.");
			}
			
			g_EsoBuildCombatStatUpdateRequired = true;
		}
	}
	
	for (var i = 0; i < buffsToDelete.length; ++i)
	{
		delete g_EsoBuildCombatState.buffs[buffsToDelete[i]];
	}
}


window.EsoBuildCombatDisableAllCombatEnabled = function()
{
	for (var buffId in g_EsoBuildBuffData)
	{
		var buffData = g_EsoBuildBuffData[buffId];
		buffData.combatEnabled = false;
	}
	
	for (var skillName in g_EsoBuildToggledSkillData)
	{
		var skillData = g_EsoBuildToggledSkillData[skillName];
		skillData.combatEnabled = false;
	}
	
	for (var cpName in g_EsoBuildToggledCpData)
	{
		var cpData = g_EsoBuildToggledCpData[cpName];
		cpData.combatEnabled = false;
	}
	
	for (var setName in g_EsoBuildToggledSetData)
	{
		var setData = g_EsoBuildToggledSetData[setName];
		setData.combatEnabled = false;
	}
	
}


window.EsoBuildCombatUpdateRunTimes = function()
{
	EsoBuildCombatUpdateActiveSkillRunTimes();
	
	for (var dotId in g_EsoBuildCombatState.dots)
	{
		var dot = g_EsoBuildCombatState.dots[dotId];
		var dotId1 = "DOT: " + dot.name;
		
		if (g_EsoBuildCombatState.runTimes[dotId1] == null) g_EsoBuildCombatState.runTimes[dotId1] = 0;
		g_EsoBuildCombatState.runTimes[dotId1] += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
	
	for (var buffId in g_EsoBuildCombatState.buffs)
	{
		var buff = g_EsoBuildCombatState.buffs[buffId];
		var buffId1 = "Buff: " + buffId;
		
		if (g_EsoBuildCombatState.runTimes[buffId1] == null) g_EsoBuildCombatState.runTimes[buffId1] = 0;
		g_EsoBuildCombatState.runTimes[buffId1] += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
	
	for (var statusId in g_EsoBuildCombatState.targetStatus)
	{
		var status = g_EsoBuildCombatState.targetStatus[statusId];
		var statusId1 = "Target Status: " + statusId;
		
		if (g_EsoBuildCombatState.runTimes[statusId1] == null) g_EsoBuildCombatState.runTimes[statusId1] = 0;
		g_EsoBuildCombatState.runTimes[statusId1] += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
	
	for (var petId in g_EsoBuildCombatState.pets)
	{
		var pet = g_EsoBuildCombatState.pets[petId];
		var petId1 = "Pet: " + pet.name;
		
		if (g_EsoBuildCombatState.runTimes[petId1] == null) g_EsoBuildCombatState.runTimes[petId1] = 0;
		g_EsoBuildCombatState.runTimes[petId1] += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
	
	for (var toggleId in g_EsoBuildCombatState.toggles)
	{
		var toggle = g_EsoBuildCombatState.toggles[toggleId];
		
		if (g_EsoBuildCombatState.runTimes[toggleId] == null) g_EsoBuildCombatState.runTimes[toggleId] = 0;
		g_EsoBuildCombatState.runTimes[toggleId] += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
}


window.EsoBuildCombatUpdateActiveSkillRunTimes = function()
{
	for (var skillId in g_EsoBuildCombatState.activeSkills)
	{
		var activeSkill = g_SkillsData[skillId];
		if (activeSkill == null || activeSkill.combat == null) continue;
		
		activeSkill.combat.runTime += ESOBUILD_COMBAT_LOOPDELTATIME;
	}
}


window.EsoBuildCombatCheckTimes = function()
{
	EsoBuildCombatUpdateRunTimes();
	
	EsoBuildCombatCheckTimesObj(g_EsoBuildCombatState.playerStatus);
	EsoBuildCombatCheckTimesObj(g_EsoBuildCombatState.cooldowns);
	EsoBuildCombatCheckTimesObj(g_EsoBuildCombatState.synergies);
	EsoBuildCombatCheckTimesObj(g_EsoBuildCombatState.activeSkills);
	EsoBuildCombatCheckTimesObj(g_EsoBuildCombatState.activeSkillLines);
	
	EsoBuildCombatCheckTargetStatusTimes();
	EsoBuildCombatCheckBuffs();
	
	if (g_EsoBuildCombatState.playerStatus['playerRegen']   == null) EsoBuildCombatDoRegenTick();
	if (g_EsoBuildCombatState.playerStatus['playerRestore'] == null) EsoBuildCombatDoRestoreTick();
	
	EsoBuildCombatCheckToggles();
	EsoBuildCombatCheckCounters();
	
	EsoBuildCombatRunSkillLineActiveEvents();
	
	EsoBuildCombatRunDots();
	EsoBuildCombatRunPets();
	EsoBuildCombatRunRestoreStats();
}


window.EsoBuildCombatGetCritDataForSkill = function (srcType, srcData, damageType, isDOT, isAOE, isBleed, isPet) 
{
	var critRate = 0;
	var critType = "";
	var critDamage = 0.50;
	
	if (srcType == "skill" || (srcData != null && srcData.mechanic != null)) 
	{
		if (srcData.mechanic == 0) {
			critRate = g_EsoBuildLastInputValues.SpellCrit;
			critDamage = g_EsoBuildLastInputValues.SpellCritDamage;
			critType = "Spell";
		}
		else if (srcData.mechanic == 6) {
			critRate = g_EsoBuildLastInputValues.WeaponCrit;
			critDamage = g_EsoBuildLastInputValues.WeaponCritDamage;
			critType = "Weapon";
		}
		else if (srcData.mechanic == 10) {
			critType = "Ultimate";
			
			if (g_EsoBuildLastInputValues.SpellCrit >= g_EsoBuildLastInputValues.WeaponCrit) {
				critRate = g_EsoBuildLastInputValues.SpellCrit;
				critDamage = g_EsoBuildLastInputValues.SpellCritDamage;
			}
			else {
				critRate = g_EsoBuildLastInputValues.WeaponCrit;
				critDamage = g_EsoBuildLastInputValues.WeaponCritDamage;
			}
		}
	}
	else if (srcType == "statuseffect") 
	{
		critType = "Ultimate";
		
		if (g_EsoBuildLastInputValues.SpellCrit >= g_EsoBuildLastInputValues.WeaponCrit) {
			critRate = g_EsoBuildLastInputValues.SpellCrit;
			critDamage = g_EsoBuildLastInputValues.SpellCritDamage;
		}
		else {
			critRate = g_EsoBuildLastInputValues.WeaponCrit;
			critDamage = g_EsoBuildLastInputValues.WeaponCritDamage;
		}
	}
	else if (damageType == "Frost" || damageType == "Magic" || damageType == "Flame" || damageType == "Shock")
	{
		critRate = g_EsoBuildLastInputValues.SpellCrit;
		critDamage = g_EsoBuildLastInputValues.SpellCritDamage;
		critType = "Spell";
	}
	else if (damageType == "Physical" || damageType == "Disease" || damageType == "Poison" || damageType == "Bleed")
	{
		critRate = g_EsoBuildLastInputValues.WeaponCrit;
		critDamage = g_EsoBuildLastInputValues.WeaponCritDamage;
		critType = "Weapon";
	}
	else {
		critType = "Ultimate";
		
				// TODO: Better type detection?
		if (g_EsoBuildLastInputValues.SpellCrit >= g_EsoBuildLastInputValues.WeaponCrit) {
			critRate = g_EsoBuildLastInputValues.SpellCrit;
			critDamage = g_EsoBuildLastInputValues.SpellCritDamage;
		}
		else {
			critRate = g_EsoBuildLastInputValues.WeaponCrit;
			critDamage = g_EsoBuildLastInputValues.WeaponCritDamage;
		}
	}
	
	var critResist = g_EsoBuildLastInputValues.Target.CritResist;
	
	critDamage -= Math.round(critResist*(0.035/250) * 100) / 100;
	if (critDamage < 0) critDamage = 0;
	
	var extraCrit = EsoBuildCombatRunGlobalGetFunc("getCritChanceMod", 0, "+", srcType, srcData, damageType, isDOT, isAOE, isBleed);
	if (extraCrit) critRate += extraCrit;
	
	return { rate: critRate, damage: critDamage, type: critType };
}


window.EsoBuildCombatCheckRandom = function(chance, srcType, srcData, chanceType)
{
	chance = parseFloat(chance);
	if (isNaN(chance)) return false;
	
	var random = Math.random();
	var success = (random <= chance);
	var name = srcType;
	
	if (typeof(srcData) == "string")
		name = srcData;
	else if (srcData && srcData.name) 
		name = srcData.name;
	
	if (g_EsoBuildCombatOptions.log.showRolls)
	{
		if (chanceType)
			EsoBuildCombatLog("Rolling random chance for " + name + " with a " + (chance*100).toFixed(0) + "% success chance (" + chanceType + ", roll " + (success ? "passed" : "failed") + ")");
		else
			EsoBuildCombatLog("Rolling random chance for " + name + " with a " + (chance*100).toFixed(0) + "% success chance (roll " + (success ? "passed" : "failed") + ")");
	}
	
	return success;
}


window.EsoBuildCombatIsCrit = function (critRate, critType) 
{
	return EsoBuildCombatCheckRandom(critRate, "crit", null, critType);
}


window.EsoBuildCombatGetTargetMitigation = function(srcType, srcData, damage, damageType, isDOT, isAOE)
{
	var resist = 0;
	var mitigation = 1;
	var elementResist = g_EsoBuildLastInputValues.Target[damageType + 'Resist'];
	var resistType = "";
	
	if (elementResist == null) elementResist = 0;
	if (damageType == "Physical") elementResist = 0;
	
	resist += elementResist;
	
	switch (damageType) 
	{
	case 'Magic':
	case 'Shock':
	case 'Flame':
	case 'Frost':
	case 'Cold':
		resist += g_EsoBuildLastInputValues.Target.SpellResist;
		resist += g_EsoBuildLastInputValues.Target.SpellDebuff
		resistType = "Magic";
		break;
	case 'Bleed':
	case 'Physical':
	case 'Poison':
	case 'Disease':
		resist += g_EsoBuildLastInputValues.Target.PhysicalResist;
		resist += g_EsoBuildLastInputValues.Target.PhysicalDebuff
		resistType = "Physical";
		break;
	}
	
	var resistMod = EsoBuildCombatRunGlobalGetFunc("getFlatResistMod", 0, "+", srcType, srcData, resist, resistType, damageType, isDOT, isAOE);
	if (resistMod) resist += resistMod;
	
	if (srcType == "skill" && srcData != null)
	{
		resistMod = EsoBuildCombatRunSkillFunc(srcData, "getSkillResistMod", "+", 0, srcType, srcData, resist, resistType, damageType, isDOT, isAOE);
		if (resistMod) resist += resistMod;
	}
	
	if (resist < 0) resist = 0;
	if (resist > ESO_RESIST_CAP) resist = ESO_RESIST_CAP;
	
	var resistDamageTaken = (1 - resist / 660 / 100);
	if (damageType == "Oblivion") resistDamageTaken = 1;
	
	var damageTaken = 1 + g_EsoBuildLastInputValues.Target.DamageTaken;

	/*
	 * TODO: Skill.DestructionPenetration (SpellResist only)
	 * TODO: Target.PhysicalResistPctReduce
	 * 
	 * rawData.resistance = resistance; rawData.resistanceDamageTaken = (1 -
	 * Math.max(0, resistance - 100) / 660 / 100); rawData.elementVulnerability =
	 * elementVulnerability; rawData.vulnerability = vulnerability;
	 * rawData.damageTaken = damageTaken; rawData.damage1Taken = damage1Taken;
	 * Direct/Dot rawData.damage2Taken = damage2Taken; Melee/Ranged/AOE/LA
	 * rawData.elementDamageTaken = elementDamageTaken; rawData.blockDamageTaken =
	 * 1 - blockDamageTaken; rawData.playerDamageTaken = playerDamageTaken;
	 * rawData.playerAOEDamageTaken = playerAOEDamageTaken;
	 * rawData.dungeonDamageTaken = dungeonDamageTaken;
	 * 
	 * mitigation *= (1 - Math.max(0, resistance - 100) / 660 / 100); mitigation *=
	 * damageTaken * damage1Taken * damage2Taken * elementDamageTaken +
	 * elementVulnerability + vulnerability; mitigation *= 1 - blockDamageTaken;
	 * mitigation *= playerDamageTaken; mitigation *= playerAOEDamageTaken;
	 * mitigation *= dungeonDamageTaken;
	 */
	
	mitigation = resistDamageTaken;
	mitigation *= damageTaken;
	
	return mitigation;
}


window.EsoBuildCombatApplyDamage = function (srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isPet)
{
	var origDamage = damage;
	var isCrit = false;
	var noCrit = false;
	var critChar = '';
	var outTypes = [];
	var outType = srcType;
	
	damage = parseInt(damage);
	damageType = damageType.toLowerCase();
	damageType = damageType.charAt(0).toUpperCase() + damageType.slice(1);
	
	if (srcType == "set" || srcType == "setProc") noCrit = true;
	
	if (srcType == "skill" && srcData != null && !srcData.ignoreDamageMod) 
	{
		var damageMod = EsoBuildCombatRunSkillFunc(srcData, "getDamageMod", "*", 1);
		
		if (!isNaN(damageMod) && damageMod != 1)
		{
			if (damageMod > 1)
				outTypes.push("+" + (damageMod*100-100).toFixed(0) + "% Skill Damage");
			else
				outTypes.push("-" + (100 - damageMod*100).toFixed(0) + "% Skill Damage");
			
			damage = Math.floor(damage * damageMod);
		}
	}
	
	var damageMod = EsoBuildCombatRunGlobalGetFunc("getAllDamageMod", 1.0, "*", srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
	
	if (!isNaN(damageMod) && damageMod != 1)
	{
		if (damageMod > 1)
			outTypes.push("+" + (damageMod*100-100).toFixed(0) + "% Damage");
		else
			outTypes.push("-" + (100 - damageMod*100).toFixed(0) + "% Damage");
		
		damage = Math.floor(damage * damageMod);
	}
	
	var extraDamage = EsoBuildCombatRunGlobalGetFunc("getExtraDamage", 0, "+", srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
	
	if (extraDamage)
	{
		outTypes.push("+" + extraDamage + " Damage");
		damage += extraDamage;
	}
	
	var critData = EsoBuildCombatGetCritDataForSkill(srcType, srcData, damageType, isDOT, isAOE, isBleed, isPet);
	
	if (!noCrit && EsoBuildCombatIsCrit(critData.rate, critData.type) && critData.damage > 0) 
	{
		var critFactor = (1 + critData.damage);
		damage = Math.floor(damage * critFactor);
		isCrit = true;
		outTypes.push("x" + critFactor.toFixed(2) + " Crit");
		critChar = '*';
	}
	
	var mitigation = EsoBuildCombatGetTargetMitigation(srcType, srcData, damage, damageType, isDOT, isAOE);
	damage = Math.floor(damage * mitigation);
	
	var skillName = srcType;
	
	if (typeof(srcData) == "string") 
		skillName = srcData;
	else if (srcData && srcData.overrideName != null) 
		skillName = srcData.overrideName;
	else if (srcData && srcData.name) 
		skillName = srcData.name;
	
	var isMelee = EsoBuildCombatIsMeleeDamage(srcType, srcData, damage, damageType, isDOT, isAOE, isBleed);
	
	outTypes.push(isDOT ? "DOT" : "DD");
	outTypes.push(isAOE ? "AoE" : "ST");
	if (isBleed) outTypes.push("Bleed");
	if (isMelee) outTypes.push("Melee");
	if (isPet)  outTypes.push("Pet");
	
	outTypes.push(Math.round(100 - mitigation*100) + "% Mit");
	outType = outTypes.join(", ");
	
	g_EsoBuildCombatState.targetHealth -= damage;
	g_EsoBuildCombatState.targetPctHealth = (g_EsoBuildCombatState.targetHealth / g_EsoBuildCombatState.targetMaxHealth * 100).toFixed(1); 
	
	if (g_EsoBuildCombatOptions.log.showDamageDetails)
		EsoBuildCombatLog("You hit for " + critChar + damage + critChar + " " + damageType + " damage from " + skillName + " (" + outType + ").");
	else
		EsoBuildCombatLog("You hit for " + critChar + damage + critChar + " " + damageType + " damage from " + skillName + ".");
	
	if (srcType != "status") EsoBuildCombatCreateStatusEffectFromDamage(srcType, srcData, damageType, isDOT, isAOE);
	
	if (srcType == "skill" && srcData) 
	{
		EsoBuildCombatRunSkillEvent(srcData, "onDamage", damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
		if (srcData.skillLine) EsoBuildCombatRunSkillLineEvent(srcData.skillLine, "onSkillLineDamage", srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
	}
	
	if (isCrit) EsoBuildCombatRunGlobalEvent("onCrit", srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
	EsoBuildCombatRunGlobalEvent("onAnyDamage", srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet);
	
	EsoBuildCombatLogDamage(srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet, isCrit, mitigation)
}


window.EsoBuildCombatLogRestoreStat = function(srcType, srcData, statName, statAmount)
{
	if (statAmount <= 0) return;
	
	var skillName = srcType + ": " + statName;
	
	if (typeof(srcData) == "string") 
		skillName = srcType + ": " + srcData + ": " + statName;
	else if (srcData && srcData.overrideName != null) 
		skillName = srcType + ": " + srcData.overrideName + ": " + statName;
	else if (srcData && srcData.name) 
		skillName = srcType + ": " + srcData.name + ": " + statName;
	
	if (g_EsoBuildCombatState.resourceSources[skillName] == null) 
	{
		g_EsoBuildCombatState.resourceSources[skillName] = {
				name: skillName,
				srcType: srcType,
				srcData: srcData,
				statName: statName,
				resources: 0,
				hits: 0,
		};
	}
	
	g_EsoBuildCombatState.resourceSources[skillName].resources += statAmount;
	++g_EsoBuildCombatState.resourceSources[skillName].hits;
	
	if (g_EsoBuildCombatState.resourceSources[statName] == null) 
	{
		g_EsoBuildCombatState.resourceSources[statName] = {
				name: statName,
				statName: statName,
				resources: 0,
				hits: 0,
		};
	}
	
	g_EsoBuildCombatState.resourceSources[statName].resources += statAmount;
	++g_EsoBuildCombatState.resourceSources[statName].hits;
}


window.EsoBuildCombatLogDrainStat = function(srcType, srcData, statName, statAmount)
{
	if (statAmount <= 0) return;
	
	var skillName = srcType + ": " + statName;
	
	if (typeof(srcData) == "string") 
		skillName = srcType + ": " + srcData + ": " + statName;
	else if (srcData && srcData.overrideName != null) 
		skillName = srcType + ": " + srcData.overrideName + ": " + statName;
	else if (srcData && srcData.name) 
		skillName = srcType + ": " + srcData.name + ": " + statName;
	
	if (g_EsoBuildCombatState.resourceDrains[skillName] == null) 
	{
		g_EsoBuildCombatState.resourceDrains[skillName] = {
				name: skillName,
				srcType: srcType,
				srcData: srcData,
				statName: statName,
				resources: 0,
				hits: 0,
		};
	}
	
	g_EsoBuildCombatState.resourceDrains[skillName].resources += statAmount;
	++g_EsoBuildCombatState.resourceDrains[skillName].hits;
	
	if (g_EsoBuildCombatState.resourceDrains[statName] == null) 
	{
		g_EsoBuildCombatState.resourceDrains[statName] = {
				name: statName,
				statName: statName,
				resources: 0,
				hits: 0,
		};
	}
	
	g_EsoBuildCombatState.resourceDrains[statName].resources += statAmount;
	++g_EsoBuildCombatState.resourceDrains[statName].hits;
}


window.EsoBuildCombatLogDamage = function (srcType, srcData, damage, damageType, isDOT, isAOE, isBleed, isMelee, isPet, isCrit, mitigation)
{
	if (damage <= 0) return;
	
	g_EsoBuildCombatState.damageDone.total += damage;
	
	if (g_EsoBuildCombatState.damageDone[damageType])
		g_EsoBuildCombatState.damageDone[damageType] += damage;
	else
		g_EsoBuildCombatState.damageDone.other += damage;
	
	++g_EsoBuildCombatState.hits.total;
	
	if (g_EsoBuildCombatState.hits[damageType])
		++g_EsoBuildCombatState.hits[damageType];
	else
		++g_EsoBuildCombatState.hits.other;
	
	if (isCrit)
	{
		g_EsoBuildCombatState.damageDone.crit += damage;
		++g_EsoBuildCombatState.hits.crit;
	}
	
	if (isDOT)
	{
		g_EsoBuildCombatState.damageDone.dot += damage;
		++g_EsoBuildCombatState.hits.dot;
	}
	
	if (isAOE)
	{
		g_EsoBuildCombatState.damageDone.aoe += damage;
		++g_EsoBuildCombatState.hits.aoe;
	}
	
	if (isBleed)
	{
		g_EsoBuildCombatState.damageDone.bleed += damage;
		++g_EsoBuildCombatState.hits.bleed;
	}
	
	if (isMelee)
	{
		g_EsoBuildCombatState.damageDone.melee += damage;
		++g_EsoBuildCombatState.hits.melee;
	}
	
	if (isPet)
	{
		g_EsoBuildCombatState.damageDone.pet += damage;
		++g_EsoBuildCombatState.hits.pet;
	}
	
	var skillName = srcType;
	
	if (typeof(srcData) == "string") 
		skillName = srcType + ": " + srcData;
	else if (srcData && srcData.overrideName != null) 
		skillName = srcType + ": " + srcData.overrideName;
	else if (srcData && srcData.name) 
		skillName = srcType + ": " + srcData.name;
	
	if (g_EsoBuildCombatState.damageSources[skillName] == null) 
	{
		g_EsoBuildCombatState.damageSources[skillName] = {
				name: skillName,
				srcType: srcType,
				srcData: srcData,
				damageDone: 0,
				hits: 0,
		};
	}
	
	g_EsoBuildCombatState.damageSources[skillName].damageDone += damage;
	++g_EsoBuildCombatState.damageSources[skillName].hits;
}


window.EsoBuildCombatCreateStats = function()
{
	var output = "";
	var totalDps = 0;
	var totalTime = "" + g_EsoBuildCombatState.currentTime.toFixed(2) + " sec";
	
	if (g_EsoBuildCombatState.damageDone.total == 0 || g_EsoBuildCombatState.currentTime == 0) 
	{
		$("#esotbCombatTabStatistics").html("Not enough data to display stats...");
		return;
	}
	
	if (g_EsoBuildCombatState.currentTime > 0) totalDps = Math.round(g_EsoBuildCombatState.damageDone.total / g_EsoBuildCombatState.currentTime);
	
	output += "<h4>Summary</h4>";
	output += "<div class='esotbCombatStatLabel2'>Average DPS</div>";
	output += "<div class='esotbCombatStatValue2'>" + totalDps.toFixed(0) + " damage/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Total Damage Done</div>";
	output += "<div class='esotbCombatStatValue2'>" + g_EsoBuildCombatState.damageDone.total + "</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Simulation Time</div>";
	output += "<div class='esotbCombatStatValue2'>" + g_EsoBuildCombatState.currentTime.toFixed(2) + " seconds</div><br/>";
	
	var magickaUsed = 0;
	var staminaUsed = 0;
	var ultimateaUsed = 0;
	if (g_EsoBuildCombatState.resourceDrains["Magicka"]) magickaUsed = g_EsoBuildCombatState.resourceDrains["Magicka"].resources;
	if (g_EsoBuildCombatState.resourceDrains["Stamina"]) staminaUsed = g_EsoBuildCombatState.resourceDrains["Stamina"].resources;
	if (g_EsoBuildCombatState.resourceDrains["Ultimate"]) ultimateaUsed = g_EsoBuildCombatState.resourceDrains["Ultimate"].resources;
	var magickaUseRate = magickaUsed / g_EsoBuildCombatState.currentTime;
	var staminaUseRate = staminaUsed / g_EsoBuildCombatState.currentTime;
	var ultimateUseRate = ultimateaUsed / g_EsoBuildCombatState.currentTime;
	
	var magickaGained = 0;
	var staminaGained = 0;
	var ultimateGained = 0;
	if (g_EsoBuildCombatState.resourceSources["Magicka"]) magickaGained = g_EsoBuildCombatState.resourceSources["Magicka"].resources;
	if (g_EsoBuildCombatState.resourceSources["Stamina"]) staminaGained = g_EsoBuildCombatState.resourceSources["Stamina"].resources;
	if (g_EsoBuildCombatState.resourceSources["Ultimate"]) ultimateGained = g_EsoBuildCombatState.resourceSources["Ultimate"].resources;
	var magickaGainRate = magickaGained / g_EsoBuildCombatState.currentTime;
	var staminaGainRate = staminaGained / g_EsoBuildCombatState.currentTime;
	var ultimateGainRate = ultimateGained / g_EsoBuildCombatState.currentTime;
	
	output += "<h4>Damage Summary</h4>";
	
	var avgCrit = g_EsoBuildCombatState.hits.crit / g_EsoBuildCombatState.hits.total * 100;
	output += "<div class='esotbCombatStatLabel2'>Crit</div>";
	output += "<div class='esotbCombatStatValue2'>" + avgCrit.toFixed(0) + "%</div><br/>";
	
	var dotRatio = g_EsoBuildCombatState.damageDone.dot / g_EsoBuildCombatState.damageDone.total * 100;
	output += "<div class='esotbCombatStatLabel2'>DOT Damage</div>";
	output += "<div class='esotbCombatStatValue2'>" + dotRatio.toFixed(0) + "%</div><br/>";
	
	var aoeRatio = g_EsoBuildCombatState.damageDone.aoe / g_EsoBuildCombatState.damageDone.total * 100;
	output += "<div class='esotbCombatStatLabel2'>AOE Damage</div>";
	output += "<div class='esotbCombatStatValue2'>" + aoeRatio.toFixed(0) + "%</div><br/>";
	
	var bleedRatio = g_EsoBuildCombatState.damageDone.bleed / g_EsoBuildCombatState.damageDone.total * 100;
	output += "<div class='esotbCombatStatLabel2'>Bleed Damage</div>";
	output += "<div class='esotbCombatStatValue2'>" + bleedRatio.toFixed(0) + "%</div><br/>";
	
	var petRatio = g_EsoBuildCombatState.damageDone.pet / g_EsoBuildCombatState.damageDone.total * 100;
	output += "<div class='esotbCombatStatLabel2'>Pet Damage</div>";
	output += "<div class='esotbCombatStatValue2'>" + petRatio.toFixed(0) + "%</div><br/>";
	
	var meleeRatio = g_EsoBuildCombatState.damageDone.melee / g_EsoBuildCombatState.damageDone.total * 100;
	output += "<div class='esotbCombatStatLabel2'>Melee Damage</div>";
	output += "<div class='esotbCombatStatValue2'>" + meleeRatio.toFixed(0) + "%</div><br/>";
	
	output += "<h4>Damage Sources</h4>";
	
	var sortedDamageSources = [];
	
	for (var skillName in g_EsoBuildCombatState.damageSources)
	{
		var damageSource = g_EsoBuildCombatState.damageSources[skillName];
		var dps = damageSource.damageDone / g_EsoBuildCombatState.currentTime;
		
		var newSource = {};
		newSource.skillName = skillName;
		newSource.dps = dps;
		
		sortedDamageSources.push(newSource)
	}
	
	sortedDamageSources.sort(EsoBuildCombatSortDamageSourcesByDps);
	
	output += "<div class='esotbCombatStatLabel2'>Total DPS</div>";
	output += "<div class='esotbCombatStatValue2'>" + totalDps.toFixed(0) + " damage/sec (100%)</div><br/>";
	
	for (var i in sortedDamageSources)
	{
		var sortedSrc = sortedDamageSources[i];
		var skillName = sortedSrc.skillName;
		var dps = sortedSrc.dps;
		var damageSource = g_EsoBuildCombatState.damageSources[skillName];
		var niceName = damageSource.srcType;
		var pctDps = (dps/totalDps*100).toFixed(1);
		
		if (typeof(damageSource.srcData) == "string") 
			niceName = damageSource.srcData;
		else if (damageSource.srcData && damageSource.srcData.overrideName != null) 
			niceName = damageSource.srcData.overrideName;
		else if (damageSource.srcData && damageSource.srcData.name) 
			niceName = damageSource.srcData.name;
		
		output += "<div class='esotbCombatStatLabel2'>" + niceName + "</div>";
		output += "<div class='esotbCombatStatValue2'>" + dps.toFixed(0) + " damage/sec (" + pctDps + "%)</div><br/>";
	}
	
	output += "<h4>Resource Summary</h4>";
	
	output += "<div class='esotbCombatStatLabel2'>Magicka Used</div>";
	output += "<div class='esotbCombatStatValue2'>" + magickaUseRate.toFixed(0) + " Magicka/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Magicka Gained</div>";
	output += "<div class='esotbCombatStatValue2'>" + magickaGainRate.toFixed(0) + " Magicka/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Stamina Used</div>";
	output += "<div class='esotbCombatStatValue2'>" + staminaUseRate.toFixed(0) + " Stamina/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Stamina Gained</div>";
	output += "<div class='esotbCombatStatValue2'>" + staminaGainRate.toFixed(0) + " Stamina/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Ultimate Used</div>";
	output += "<div class='esotbCombatStatValue2'>" + ultimateUseRate.toFixed(0) + " Ultimate/sec</div><br/>";
	
	output += "<div class='esotbCombatStatLabel2'>Ultimate Gained</div>";
	output += "<div class='esotbCombatStatValue2'>" + ultimateGainRate.toFixed(0) + " Ultimate/sec</div><br/>";
	
	output += "<h4>Resource Sources</h4>";
	
	for (var skillName in  g_EsoBuildCombatState.resourceSources)
	{
		var resourceSource = g_EsoBuildCombatState.resourceSources[skillName];
		if (resourceSource.statName == resourceSource.name) continue;
		
		var statName = resourceSource.statName;
		var totalResource = g_EsoBuildCombatState.resourceSources[statName].resources;
		var pctResource = (resourceSource.resources/totalResource*100).toFixed(1);
		var statRate = resourceSource.resources / g_EsoBuildCombatState.currentTime;
		var niceName = resourceSource.srcType;
		
		if (typeof(resourceSource.srcData) == "string") 
			niceName = resourceSource.srcData;
		else if (resourceSource.srcData && resourceSource.srcData.overrideName != null) 
			niceName = resourceSource.srcData.overrideName;
		else if (resourceSource.srcData && resourceSource.srcData.name) 
			niceName = resourceSource.srcData.name;
		
		output += "<div class='esotbCombatStatLabel2'>" + niceName + "</div>";
		output += "<div class='esotbCombatStatValue2'>" + statRate.toFixed(1) + " " + statName + "/sec (" + pctResource + "%)</div><br/>";
	}
	
	output += "<h4>Uptime Summary</h4>";
	
	var sortedRunTimes = [];
	
	for (var id in g_EsoBuildCombatState.runTimes)
	{
		var runTime = g_EsoBuildCombatState.runTimes[id];
		
		var newRunTime = {};
		newRunTime.id = id;
		newRunTime.runTime = runTime;
		newRunTime.pctTime = (runTime / g_EsoBuildCombatState.currentTime * 100).toFixed(1);
		
		sortedRunTimes.push(newRunTime);
	}
	
	sortedRunTimes.sort(EsoBuildCombatSortRunTimesByPctTime);
	
	output += "<div class='esotbCombatStatLabel2'>Total Time</div>";
	output += "<div class='esotbCombatStatValue2'>" + g_EsoBuildCombatState.currentTime.toFixed(2) + " seconds (100%)</div><br/>";
	
	for (var i in sortedRunTimes)
	{
		var runTimeData = sortedRunTimes[i];
				
		output += "<div class='esotbCombatStatLabel2'>" + runTimeData.id + "</div>";
		output += "<div class='esotbCombatStatValue2'>" + runTimeData.runTime.toFixed(2) + " seconds (" + runTimeData.pctTime + "%)</div><br/>";
	}
	
	$("#esotbCombatTabStatistics").html(output);
}


window.EsoBuildCombatSortRunTimesByPctTime = function(a, b)
{
	return b.runTime - a.runTime;
}


window.EsoBuildCombatSortDamageSourcesByDps = function(a, b)
{
	return b.dps - a.dps;
}


window.EsoBuildCombatCreateStatusEffectFromDamage = function(srcType, srcData, srcDamageType, isSrcDOT, isSrcAOE, overrideChance) 
{
	var chance = 0;
	var statusEffect = "";
	var buffEffect = "";
	var duration = 0;
	var damage = 0;
	var damageType = "";
	var isDOT = false;
	
	switch (srcDamageType) 
	{
	case "Flame":   
		statusEffect = "Burning";
		duration = ESOBUILDCOMBAT_BURNING_DURATION;
		damage = EsoBuildCombatGetBurningDamage();
		damageType = "Flame";
		isDOT = true;
		break;
	case "Cold":
	case "Frost":   
		statusEffect = "Chilled";
		buffEffect = "Major Maim (Target)";
		duration = ESOBUILDCOMBAT_CHILLED_DURATION;
		damage = EsoBuildCombatGetChilledDamage();
		damageType = "Frost";
		break;
	case "Shock":   
		statusEffect = "Concussion";
		buffEffect = "Minor Vulnerability (Target)";
		duration = ESOBUILDCOMBAT_CONCUSSION_DURATION;
		damage = EsoBuildCombatGetConcussionDamage();
		damageType = "Shock";
		break;
	case "Poison":  
		statusEffect = "Poisoned";
		duration = ESOBUILDCOMBAT_POISONED_DURATION;
		damage = EsoBuildCombatGetPoisonedDamage();
		damageType = "Poison";
		isDOT = true;
		break;
	case "Disease": 
		statusEffect = "Diseased";
		buffEffect = "Minor Defile (Target)";
		damage = EsoBuildCombatGetDiseasedDamage();
		damageType = "Disease";
		duration = ESOBUILDCOMBAT_DISEASED_DURATION;
		break;
	}
	
	if (statusEffect == "") return false;
	
	if (srcType == "enchant") 
	{
		chance = ESOBUILD_COMBAT_STATUSEFFECT_ENCHANTCHANCE;
	}
	else if (srcType == "skill") 
	{
		chance = ESOBUILD_COMBAT_STATUSEFFECT_SKILLCHANCE;
		if (isSrcAOE) chance = ESOBUILD_COMBAT_STATUSEFFECT_AOECHANCE;
		if (isSrcDOT) chance = ESOBUILD_COMBAT_STATUSEFFECT_DOTCHANCE;
		if (isSrcDOT && isSrcAOE) chance = ESOBUILD_COMBAT_STATUSEFFECT_AOEDOTCHANCE;
	}
	
	if (overrideChance) chance = overrideChance;
	
	var modChance = g_EsoBuildLastInputValues.Item.StatusEffectChance;
	if (g_EsoBuildLastInputValues.Skill[statusEffect + 'Chance']) modChance += g_EsoBuildLastInputValues.Skill[statusEffect + 'Chance'];
	
	var modChance1 = EsoBuildCombatRunGlobalGetFunc("getStatusEffectChanceMod", 0, "+", srcType, srcData, statusEffect, srcDamageType, isSrcDOT, isSrcAOE);
	if (modChance1) modChance += modChance1;
	
	if (modChance) chance *= 1 + modChance;
	
	if (chance <= 0) return;
	
		/* For debugging purposes */
	if (chance < ESOBUILD_COMBAT_STATUSEFFECT_MINCHANCE) chance = ESOBUILD_COMBAT_STATUSEFFECT_MINCHANCE;
	
	if (chance < 1 && !EsoBuildCombatCheckRandom(chance, "statuseffect", "status effect from " + srcType)) return false;
	
	var isNewEffect = EsoBuildCombatAddTargetStatus(srcType, srcData, statusEffect, duration, 0);
	if (buffEffect) EsoBuildCombatAddBuff("statuseffect", statusEffect, buffEffect, duration);
	
	EsoBuildCombatRunGlobalEvent("onStatusEffectCast", statusEffect);
	
	if (isDOT && damage)
	{
		EsoBuildCombatAddDot("statuseffect", statusEffect, damage, damageType, 2.0, duration, false, false, false, 0.0);
	}
	else if (damage)
	{
		EsoBuildCombatApplyDamage("statuseffect", statusEffect, damage, damageType, false, false, false, false);
	}
	
	return true;
}


window.EsoBuildCombatGetBurningDamage = function()
{
	var stat = Math.max(g_EsoBuildLastInputValues.Magicka, g_EsoBuildLastInputValues.Stamina);
	var power = Math.max(g_EsoBuildLastInputValues.SpellDamage, g_EsoBuildLastInputValues.WeaponDamage);
	var damage = (stat + power*10.5)*0.0160;
	
		// TODO: Log?
	damage *= (1 + g_EsoBuildLastInputValues.FlameDamageDone + g_EsoBuildLastInputValues.DotDamageDone + g_EsoBuildLastInputValues.SingleTargetDamageDone + g_EsoBuildLastInputValues.DamageDone + g_EsoBuildLastInputValues.Skill.BurningDamage);
	damage = Math.floor(damage);
	
	return damage;
}


window.EsoBuildCombatGetPoisonedDamage = function()
{
	var stat = Math.max(g_EsoBuildLastInputValues.Magicka, g_EsoBuildLastInputValues.Stamina);
	var power = Math.max(g_EsoBuildLastInputValues.SpellDamage, g_EsoBuildLastInputValues.WeaponDamage);
	var damage = (stat + power*10.5)*0.0144;
	
	damage *= (1 + g_EsoBuildLastInputValues.PoisonDamageDone + g_EsoBuildLastInputValues.DotDamageDone + g_EsoBuildLastInputValues.SingleTargetDamageDone + g_EsoBuildLastInputValues.DamageDone + g_EsoBuildLastInputValues.Skill.PoisonedDamage);
	damage = Math.floor(damage);
	
	return damage;
}


window.EsoBuildCombatGetChilledDamage = function()
{
	var stat = Math.max(g_EsoBuildLastInputValues.Magicka, g_EsoBuildLastInputValues.Stamina);
	var power = Math.max(g_EsoBuildLastInputValues.SpellDamage, g_EsoBuildLastInputValues.WeaponDamage);
	var damage = (stat + power*10.5)*0.008;
	
	damage *= (1 + g_EsoBuildLastInputValues.FrostDamageDone + g_EsoBuildLastInputValues.DirectDamageDone + g_EsoBuildLastInputValues.SingleTargetDamageDone + g_EsoBuildLastInputValues.DamageDone);
	damage = Math.floor(damage);
	
	return damage;
}


window.EsoBuildCombatGetConcussionDamage = function()
{
	var stat = Math.max(g_EsoBuildLastInputValues.Magicka, g_EsoBuildLastInputValues.Stamina);
	var power = Math.max(g_EsoBuildLastInputValues.SpellDamage, g_EsoBuildLastInputValues.WeaponDamage);
	var damage = (stat + power*10.5)*0.008;
	
	damage *= (1 + g_EsoBuildLastInputValues.ShockDamageDone + g_EsoBuildLastInputValues.DirectDamageDone + g_EsoBuildLastInputValues.SingleTargetDamageDone + g_EsoBuildLastInputValues.DamageDone);
	damage = Math.floor(damage);
	
	return damage;
}


window.EsoBuildCombatGetDiseasedDamage = function()
{
	var stat = Math.max(g_EsoBuildLastInputValues.Magicka, g_EsoBuildLastInputValues.Stamina);
	var power = Math.max(g_EsoBuildLastInputValues.SpellDamage, g_EsoBuildLastInputValues.WeaponDamage);
	var damage = (stat + power*10.5)*0.008;
	
	damage *= (1 + g_EsoBuildLastInputValues.DiseaseDamageDone + g_EsoBuildLastInputValues.DirectDamageDone + g_EsoBuildLastInputValues.SingleTargetDamageDone + g_EsoBuildLastInputValues.DamageDone);
	damage = Math.floor(damage);
	
	return damage;
}


window.EsoBuildCombatTargetHasNegativeEffect = function() 
{
	return (EsoBuildCombatCountTargetNegativeEffects() > 0);
}


window.EsoBuildCombatCountTargetNegativeEffects = function()
{
	var count = 0;
						//TODO: Verify
	for (var dotId in g_EsoBuildCombatState.dots)
	{
		++count;
	}
	
	for (var buffId in g_EsoBuildCombatState.buffs)
	{
		if (buffId.indexOf("(Target)") >= 0) ++count;
	}
	
	return count;
}


window.EsoBuildCombatCountPlayerNegativeEffects = function()		//TODO
{
	var count = 0;
	
	for (var buffId in g_EsoBuildCombatState.buffs)
	{
		if (buffId == "Major Maim") ++count;
		else if (buffId == "Major Defile") ++count;
		else if (buffId == "Major Breach") ++count;
		else if (buffId == "Major Fracture") ++count;
		else if (buffId == "Major Vulnerability") ++count;
		else if (buffId == "Minor Defile") ++count;
		else if (buffId == "Minor Breach") ++count;
		else if (buffId == "Minor Fracture") ++count;
		else if (buffId == "Minor Vulnerability") ++count;
	}
	
	return count;
}


window.EsoBuildCombatHasDot = function(name)
{
	name = String(name).toLowerCase();
	
	for (var dotId in g_EsoBuildCombatState.dots)
	{
		var dot = g_EsoBuildCombatState.dots[dotId];
		
		if (String(dotId).toLowerCase() == name) return true;
		
		if (typeof(dot.srcData) == "string") {
			if (dot.srcData.toLowerCase() == name) return true;
		}
		else if (dot.srcData && dot.srcData.abilityId) {
			if (dot.srcData.abilityId == name) return true;
			if (dot.srcData.name.toLowerCase() == name) return true;
			if (dot.srcData.baseName && dot.srcData.baseName.toLowerCase() == name) return true;
			if (dot.srcData.overrideName && dot.srcData.overrideName.toLowerCase() == name) return true;
		}
		else if (dot.srcData && dot.srcData.name) {
			if (dot.srcData.name.toLowerCase() == name) return true;
		}
	}
	
	return false;
}


window.EsoBuildCombatRemoveDot = function(srcType, srcData)
{
	var dotId = srcType;
	
	if (typeof(srcData) == "string") {
		dotId = srcData;
	}
	else if (srcData && srcData.abilityId) {
		dotId = srcData.abilityId;
	}
	else if (srcData && srcData.name) {
		dotId = srcData.name;
	}
	
	var oldDot = g_EsoBuildCombatState.dots[dotId];
	if (!oldDot) return null;
	
	delete g_EsoBuildCombatState.dots[dotId];
	
	return oldDot;
}


window.EsoBuildCombatAddDot = function(srcType, srcData, damage, damageType, tickTime, duration, isAOE, isBleed, isPet, initialTickTime, cooldown)
{
	var newDot = {};
	var dotId = srcType;
	
	damage = parseInt(damage);
	tickTime = parseFloat(tickTime);
	initialTickTime = parseFloat(initialTickTime);
	duration = parseFloat(duration);
	cooldown = parseFloat(cooldown);
	
	if (isNaN(damage)) return null;
	if (isNaN(duration)) return null;
	if (isNaN(tickTime)) tickTime = 1.0;
	
	if (typeof(srcData) == "string") {
		dotId = srcData;
		newDot.name = dotId;
	}
	else if (srcData && srcData.abilityId) {
		dotId = srcData.abilityId;
		newDot.name = srcData.name;
		if (srcData.overrideName) newDot.name = srcData.overrideName;
	}
	else if (srcData && srcData.name) {
		dotId = srcData.name;
		newDot.name = srcData.name;
	}
	
	if (cooldown > 0)
	{
		if (EsoBuildCombatHasCooldown(dotId)) return null;
		EsoBuildCombatAddCooldown(dotId, cooldown);
	}
	
	newDot.duration = duration;
	newDot.endTime = g_EsoBuildCombatState.currentTime + duration;
	if (duration < 0) newDot.endTime = -1;
	
	newDot.nextTime = g_EsoBuildCombatState.currentTime + tickTime;
	if (initialTickTime > 0) newDot.nextTime = g_EsoBuildCombatState.currentTime + initialTickTime;
	
	newDot.tickTime = tickTime;
	newDot.damage = damage;
	newDot.damageType = damageType;
	newDot.isAOE = isAOE;
	newDot.isBleed = isBleed;
	newDot.isPet = isPet;
	newDot.srcType = srcType;
	newDot.srcData = srcData;
	newDot.tickCount = 0;
	
		// TODO: DOT run time stats
	
	newDot.dotId = dotId;
	g_EsoBuildCombatState.dots[dotId] = newDot;
	
	if (initialTickTime == 0) 
	{
		EsoBuildCombatApplyDamage("skill", srcData, damage, damageType, true, isAOE, isBleed, isPet);
		++newDot.tickCount;
	}
	
	return newDot;
}


window.EsoBuildCombatHasPet = function(petId)
{
	for (var id in g_EsoBuildCombatState.pets)
	{
		if (id == petId) return true;
	}
	return false;
}


window.EsoBuildCombatAddPetMawDaedroth = function(srcType, srcData, damage, damageType, duration, tickTime)
{
	var attackData = {};
	var newAttack = {};
	
	newAttack.name = "Fiery Jaws";
	newAttack.type = "damage";
	newAttack.damage = damage;
	newAttack.damageType = damageType;
	newAttack.isDOT = false;
	newAttack.isAOE = false;
	newAttack.isBleed = false;
	newAttack.chance = 0.33;
	newAttack.tickTime = tickTime;
	attackData.push(newAttack);
	
	newAttack = {};
	newAttack.name = "Jagged Claw";
	newAttack.type = "damage";
	newAttack.damage = damage;
	newAttack.damageType = damageType;
	newAttack.isDOT = false;
	newAttack.isAOE = false;
	newAttack.isBleed = false;
	newAttack.chance = 0.33;
	newAttack.tickTime = tickTime;
	attackData.push(newAttack);
	
	newAttack = {};
	newAttack.name = "Fiery Breath";
	newAttack.type = "damage";
	newAttack.damage = Math.floor(damage / 5.0);
	newAttack.damageType = damageType;
	newAttack.isDOT = true;
	newAttack.isAOE = true;
	newAttack.tickCount = 5;
	newAttack.isBleed = false;
	newAttack.chance = 0.33;
	newAttack.tickTime = tickTime;
	attackData.push(newAttack);
	
	return EsoBuildCombatAddPet(srcType, srcData, "Maw of the Infernal", duration, attackData, tickTime);
}


window.EsoBuildCombatAddPetSimpleDamage = function(srcType, srcData, petId, duration, tickTime, damage, damageType, isDOT, isAOE, isBleed)
{
	var attackData = {};
	var newAttack = {};
	
	newAttack.type = "damage";
	newAttack.damage = parseInt(damage);
	newAttack.damageType = damageType;
	newAttack.isDOT = isDOT;
	newAttack.isAOE = isAOE;
	newAttack.isBleed = isBleed;
	newAttack.chance = 1.0;
	newAttack.tickTime = parseFloat(tickTime);
	attackData.push(newAttack);
	
	return EsoBuildCombatAddPet(srcType, srcData, petId, duration, attackData, tickTime);
}


window.EsoBuildCombatAddPetSimpleDamage2 = function(srcType, srcData, petId, duration, tickTime, chance, damage, damageType, isDOT, isAOE, isBleed, chance2, damage2, damageType2, isDOT2, isAOE2, isBleed2)
{
	var attackData = {};
	var newAttack = {};
	
	newAttack.type = "damage";
	newAttack.damage = parseInt(damage);
	newAttack.damageType = damageType;
	newAttack.isDOT = isDOT;
	newAttack.isAOE = isAOE;
	newAttack.isBleed = isBleed;
	newAttack.chance = chance;
	newAttack.tickTime = parseFloat(tickTime);
	attackData.push(newAttack);
	
	newAttack = {};
	newAttack.type = "damage";
	newAttack.damage = parseInt(damage2);
	newAttack.damageType = damageType2;
	newAttack.isDOT = isDOT2;
	newAttack.isAOE = isAOE2;
	newAttack.isBleed = isBleed2;
	newAttack.chance = chance2;
	newAttack.tickTime = parseFloat(tickTime);
	attackData.push(newAttack);
	
	return EsoBuildCombatAddPet(srcType, srcData, petId, duration, attackData, tickTime);
}


window.EsoBuildCombatAddPetSimpleRestore = function(srcType, srcData, petId, duration, tickTime, restoreStat, restoreAmount)
{
	var attackData = {};
	var newAttack = {};
	
	newAttack.type = "restore";
	newAttack.tickTime = parseFloat(tickTime);
	newAttack.restoreStat = restoreStat;
	newAttack.restoreAmount = parseInt(restoreAmount);
	newAttack.chance = 1.0;
	attackData.push(newAttack);
	
	return EsoBuildCombatAddPet(srcType, srcData, petId, duration, attackData, tickTime);
}


window.EsoBuildCombatAddPet = function(srcType, srcData, petId, duration, attackData, firstTick)
{
		//TODO: Adding existing pet?
	
	var newPet = {};
	
	newPet.name = petId;
	newPet.srcType = srcType;
	newPet.srcData = srcData;
	newPet.duration = duration;
	newPet.attackData = attackData;
	newPet.firstTick = firstTick;
	newPet.tickCount = 0;
	
	newPet.endTime = g_EsoBuildCombatState.currentTime + duration;
	if (duration < 0) newPet.endTime = -1;
	
	newPet.nextTime = g_EsoBuildCombatState.currentTime + 1.0;
	if (firstTick > 0) newPet.nextTime = g_EsoBuildCombatState.currentTime + firstTick;
	
	g_EsoBuildCombatState.pets[petId] = newPet;
	
	return newPet;
}


window.EsoBuildCombatRemovePet = function(petId)
{
	var pet = g_EsoBuildCombatState.pets[petId];
	if (pet == null) return null;
	
	delete g_EsoBuildCombatState.pets[petId];
	
	return pet;
}


window.EsoBuildCombatRunPets = function()
{
	var petsToDelete = [];
	
	for (var petId in g_EsoBuildCombatState.pets)
	{
		var pet = g_EsoBuildCombatState.pets[petId];
		var doAttack = false;
		
		if (pet.attackData == null) continue;
		
		if (pet.endTime > 0 && pet.endTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime) 
		{
			petsToDelete.push(petId);	// TODO: Skill run time
			doAttack = true;
		}
		else if (pet.nextTime > 0 && pet.nextTime - ESOBUILD_COMBAT_ROUNDTIME <= g_EsoBuildCombatState.currentTime)
		{
			doAttack = true;
		}
		
		if (doAttack) 
		{
			pet.nextTime = -1;
			++pet.tickCount;
			
			var attack = EsoBuildCombatChoosePetAttack(pet);
			if (!attack) continue;
			
			if (attack.type == "damage")
			{
				var damage = attack.damage;
				var damageType = attack.damageType;
				var matchResult = null;
				
				if (attack.match && pet.srcType == "skill" && pet.srcData.abilityId) {
					var desc = GetEsoSkillDescription(pet.srcData.abilityId, null, false, true, false);
					matchResult = desc.match(attack.match);
					
					if (matchResult) {
						damage = parseInt(matchResult[1]);
						damageType = matchResult[2];
					}
				}
					
				if (damage && damageType)
				{
					if (attack.ignoreDamageMod) pet.srcData.ignoreDamageMod = true;
					
					if (attack.isDOT)
					{
						EsoBuildCombatAddDot(pet.srcType, pet.srcData, damage, damageType, attack.tickTime / attack.tickCount, attack.tickTime, attack.isAOE, attack.isBleed, true);
						EsoBuildCombatRunGlobalEvent("onPetAttack", pet.srcType, pet.srcData, damage, damageType, attack.tickTime / attack.tickCount, attack.tickTime, true, attack.isAOE, attack.isBleed);
					}
					else {
						EsoBuildCombatApplyDamage(pet.srcType, pet.srcData, damage, damageType, attack.isDOT, attack.isAOE, attack.isBleed, true);
						EsoBuildCombatRunGlobalEvent("onPetAttack", pet.srcType, pet.srcData, damage, damageType, attack.isDOT, attack.isAOE, attack.isBleed);
					}
					
					if (attack.ignoreDamageMod) pet.srcData.ignoreDamageMod = false;
					
					EsoBuildCombatRunGlobalEvent("onPetAttack", pet.srcType, pet.srcData, damage, damageType, attack.tickTime / attack.tickCount, attack.tickTime, attack.isAOE, attack.isBleed,);
				}
				
				if (attack.statusEffect && attack.durationIndex && matchResult && matchResult[attack.durationIndex]) 
				{
					EsoBuildCombatAddTargetStatus(pet.srcType, pet.srcData, attack.statusEffect, matchResult[attack.durationIndex]);
				}
				
				pet.nextTime = g_EsoBuildCombatState.currentTime + attack.tickTime;
			}
			else if (attack.type == "restore")
			{
				EsoBuildCombatRestoreStat(pet.srcType, pet.srcData, attack.restoreStat, attack.restoreStatAmount);
				pet.nextTime = g_EsoBuildCombatState.currentTime + attack.tickTime;
			}
		}
	}
	
	for (var i = 0; i < petsToDelete.length; ++i)
	{
		delete g_EsoBuildCombatState.pets[petsToDelete[i]];
	}
}


window.EsoBuildCombatChoosePetAttack = function(pet)
{
	var totalChance = 0;
	
	if (pet.attackData.length == 0) return null;
	
	for (var i = 0; i < pet.attackData.length; ++i)
	{
		totalChance += pet.attackData[i].chance;
	}
	
		//TODO: Log output?
	if (totalChance == 0)
	{
		var i = Math.floor(Math.random() * pet.attackData.length);
		return pet.attackData[i];
	}
	
	var choice = Math.random() * totalChance;
	totalChance = 0;
	
	for (var i = 0; i < pet.attackData.length; ++i)
	{
		totalChance += pet.attackData[i].chance;
		if (choice < totalChance) return pet.attackData[i];
	}
	
	return pet.attackData[0];
}


window.EsoBuildCombatCastUniqueSkill = function(skillData, action)
{
	if (skillData.skillBarIndex != null) {
		return EsoBuildCombatCastSkillBarSwap(skillData);
	}
	else if (skillData.abilityId >= ESOBUILD_UNIQUESKILLID_LAMIN && skillData.abilityId <= ESOBUILD_UNIQUESKILLID_LAMAX) {
		return EsoBuildCombatCastLightAttack(skillData);
	}
	else if (skillData.abilityId >= ESOBUILD_UNIQUESKILLID_HAMIN && skillData.abilityId <= ESOBUILD_UNIQUESKILLID_HAMAX) {
		return EsoBuildCombatCastHeavyAttack(skillData);
	}
	else if (skillData.abilityId == ESOBUILD_UNIQUESKILLID_WAIT) {
		return EsoBuildCombatCastWait(skillData, action);
	}
	else if (skillData.abilityId == ESOBUILD_UNIQUESKILLID_POTION) {
		return EsoBuildCombatCastPotion(skillData, action);
	}
	else if (skillData.abilityId == ESOBUILD_UNIQUESKILLID_ROLLDODGE) {
		return EsoBuildCombatCastRollDodge(skillData, action);
	}
	else if (skillData.abilityId == ESOBUILD_UNIQUESKILLID_BASH) {
		return EsoBuildCombatCastBash(skillData, action);
	}
	
	return true;
}


window.EsoBuildCombatCastPotion = function(skillData, action)
{
	var duration = skillData.duration / 1000;
	var cooldown = skillData.cooldown / 1000;
	var potionName = action.actionData;
	
	if (potionName == null || potionName == "") return false;
	if (EsoBuildCombatHasCooldown("PlayerPotion")) return false;
	
	var fullName = potionName;
	var potionData = ESOBUILD_COMBAT_POTIONDATA[potionName];
	if (potionData == null) return false;
	
	if (g_EsoBuildLastInputValues.PotionCooldown) cooldown += g_EsoBuildLastInputValues.PotionCooldown;
	if (g_EsoBuildLastInputValues.PotionDuration) duration += g_EsoBuildLastInputValues.PotionDuration;
	if (duration <= 0) return false;
	
	EsoBuildCombatAddCooldown("PlayerPotion", cooldown);
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + skillData.castTime/1000;
	
	EsoBuildCombatLog("Using " + fullName + " with duration of " + duration.toFixed(1) + "s and cooldown of " + cooldown.toFixed(1) + "s.");
	
	if (potionData.restoreHealth  > 0) EsoBuildCombatRestoreStat("potion", potionName, "Health",  potionData.restoreHealth);
	if (potionData.restoreMagicka > 0) EsoBuildCombatRestoreStat("potion", potionName, "Magicka", potionData.restoreMagicka);
	if (potionData.restoreStamina > 0) EsoBuildCombatRestoreStat("potion", potionName, "Stamina", potionData.restoreStamina);
	
	if (potionData.restoreOverTime)
	{
		var stat = potionData.restoreOverTime.stat;
		var amountPerTick = potionData.restoreOverTime.amount;
		var thisDuration = potionData.restoreOverTime.duration;
		
		if (thisDuration == null || thisDuration <= 0) 
			thisDuration = duration;
		else
			thisDuration += g_EsoBuildLastInputValues.PotionDuration;
		
		EsoBuildCombatAddRestoreStat("potion", potionName, stat, amountPerTick, 1.0, thisDuration);
	}
	
	var durations = potionData.durations;
	
	for (var i = 0; i < potionData.buffs.length; ++i)
	{
		var buffName = potionData.buffs[i];
		var thisDuration = duration;
		if (durations && durations[i] > 0) thisDuration = durations[i] + g_EsoBuildLastInputValues.PotionDuration;
		
		EsoBuildCombatAddBuff("potion", potionName, buffName, thisDuration);
	}
	
	EsoBuildCombatRunGlobalEvent("onDrinkPotion", potionName, potionData);
	
	return true;
}


window.EsoBuildCombatCastRollDodge = function(skillData, action)
{
	var cost = skillData.getCostFunc();
	
	if (!g_EsoBuildCombatOptions.ignoreResources && g_EsoBuildCombatState.currentStamina < cost) 
	{
		EsoBuildCombatLog("Failed to roll dodge due to lack of Stamina.");
		return false;
	}
	
	g_EsoBuildCombatState.currentStamina -= cost;
	
	var castTime = skillData.castTime/1000;
	var quickCastTime = skillData.quickCastTime/1000;
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + castTime;
	
	EsoBuildCombatRunGlobalEvent("onRollDodge", skillData, damage, damageType);
	
	return true;
}


window.EsoBuildCombatCastBash = function(skillData, action)
{
	var damageType = skillData.damageType;
	var damage = skillData.getDamageFunc();
	var cost = skillData.getCostFunc();
	
	if (!g_EsoBuildCombatOptions.ignoreResources && g_EsoBuildCombatState.currentStamina < cost) 
	{
		EsoBuildCombatLog("Failed to bash target due to lack of Stamina.");
		return false;
	}
	
	g_EsoBuildCombatState.currentStamina -= cost;
	
	EsoBuildCombatApplyDamage("bash", skillData, damage, damageType, false, false, false, false);
	
	//EsoBuildCombatCheckWeaponEnchants(); //TODO: Does bash trigger weapon enchantments?
	
	var castTime = skillData.castTime/1000;
	var quickCastTime = skillData.quickCastTime/1000;
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + castTime;
	
	EsoBuildCombatRunGlobalEvent("onBash", skillData, damage, damageType);
	
	return true;
}


window.EsoBuildCombatCastWait = function(skillData, action)
{
	var duration = parseFloat(action.actionData);
	
	if (isNaN(duration) || duration <= 0) return false;
	
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + duration;
	
	EsoBuildCombatLog("Waiting for " + duration.toFixed(1) + " seconds before performing next action...");
	
	return true;
}


window.EsoBuildCombatCastLightAttack = function(skillData)
{
	var endOverload = false;
	
	if (g_EsoBuildCombatState.isOverload) 
	{
		skillData = g_SkillsData[ESOBUILD_UNIQUESKILLID_LAOVERLOAD];
		var costText = GetEsoSkillCost(g_EsoBuildCombatState.overloadSkillData.abilityId, null, false);
		var cost = parseInt(costText);
		
		if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) 
		{
			EsoBuildCombatToggleOverload(null, "due to lack of Ultimate");
			return true;
		}
		
		g_EsoBuildCombatState.currentUltimate -= cost;
		if (g_EsoBuildCombatState.currentUltimate < 0) g_EsoBuildCombatState.currentUltimate = 0;
		
		if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) 
		{
			endOverload = true;
		}
	}
	else if (g_EsoBuildCombatState.isWerewolf)
	{
		skillData = g_SkillsData[ESOBUILD_UNIQUESKILLID_LAWEREWOLF];
	}
	
	var damageType = skillData.damageType;
	var damage = skillData.getDamageFunc();
	var isDOT = skillData.isDOT;
	var isAOE = skillData.isAOE;
	
	EsoBuildCombatApplyDamage("lightattack", skillData, damage, damageType, isDOT, isAOE, false, false);
	
	var castTime = skillData.castTime/1000 * g_EsoBuildLastInputValues.LASpeed;
	var quickCastTime = skillData.quickCastTime/1000;
	if (g_EsoBuildCombatOptions.useLAWeaving) castTime = quickCastTime;
	
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + castTime;
	
	EsoBuildCombatAddBuff("skill", skillData, "Ultimate Restore (LA)", ESOBUILDCOMBAT_LAULTIMATEBUFF_DURATION);
	
	EsoBuildCombatCheckWeaponEnchants();
	
	EsoBuildCombatRunGlobalEvent("onLightAttack", skillData, damage, damageType);
	
	if (g_EsoBuildCombatState.isOverload && g_EsoBuildCombatState.overloadSkillData.name == "Energy Overload")
	{
		var matchResult = skillData.lastDesc.match(/Each attack restores ([0-9]+) Magicka/i);
		if (matchResult && matchResult[1]) EsoBuildCombatRestoreStat("skill", g_EsoBuildCombatState.overloadSkillData, "Magicka", matchResult[1]);
	}
	else if (g_EsoBuildCombatState.isWerewolf && g_EsoBuildCombatState.werewolfSkillData.name == "Werewolf Berserker")
	{
		var desc = GetEsoSkillDescription(g_EsoBuildCombatState.werewolfSkillData.abilityId, null, false, true, false);
		var matchResult = desc.match(/your Light Attacks apply a bleed for ([0-9]+) Physical Damage over ([0-9\.]+) second/i);
		
		if (matchResult && matchResult[1] && matchResult[2]) EsoBuildCombatAddDot("skill", g_EsoBuildCombatState.werewolfSkillData, matchResult[1]/4, "Physical", 1.0, matchResult[2], false, true, false);
	}
	
	if (endOverload) EsoBuildCombatToggleOverload(null, "due to lack of Ultimate");
	
	EsoBuildCombatRemoveBuff("Empower");
	
	return true;
}


window.EsoBuildCombatCastHeavyAttack = function(skillData)
{
	var endOverload = false;
	
	if (g_EsoBuildCombatState.isOverload) 
	{
		skillData = g_SkillsData[ESOBUILD_UNIQUESKILLID_HAOVERLOAD];
		var costText = GetEsoSkillCost(g_EsoBuildCombatState.overloadSkillData.abilityId, null, false);
		var cost = parseInt(costText);
		
		if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) 
		{
			EsoBuildCombatToggleOverload(null, "due to lack of Ultimate");
			return true;
		}
		
		g_EsoBuildCombatState.currentUltimate -= cost;
		if (g_EsoBuildCombatState.currentUltimate < 0) g_EsoBuildCombatState.currentUltimate = 0;
		
		if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) 
		{
			endOverload = true;
		}
	}
	else if (g_EsoBuildCombatState.isWerewolf)
	{
		skillData = g_SkillsData[ESOBUILD_UNIQUESKILLID_HAWEREWOLF];
	}
	
	var damageType = skillData.damageType;
	var damage = skillData.getDamageFunc();
	var tickTime = skillData.tickTime;
	var isDOT = skillData.isDOT;
	var isAOE = skillData.isAOE;
	var castTime = skillData.castTime / 1000;
	var restoreStat = skillData.restoreStat;
	var restoreStatValue = 0;
	
	if (skillData.getRestoreFunc) restoreStatValue = skillData.getRestoreFunc();
	
	if (isDOT)
	{
		if (skillData.onFinalHit && skillData.events.onFinalHit.length <= 0) EsoBuildCombatAddSkillEvent(skillData.abilityId, "onFinalHit", skillData.onFinalHit, null);
		
		castTime = skillData.duration / 1000;
		var newDot = EsoBuildCombatAddDot("heavyattack", skillData, damage, damageType, tickTime/1000, skillData.duration/1000, isAOE, false, false);
	}
	else
	{
		EsoBuildCombatApplyDamage("heavyattack", skillData, damage, damageType, isDOT, isAOE, false, false);
		EsoBuildCombatCheckWeaponEnchants();
	}
	
	EsoBuildCombatRunGlobalEvent("onHeavyAttack", skillData, damage, damageType);
	
	if (EsoBuildCombatIsSkillTaunt(skillData)) 
	{
		EsoBuildCombatAddTargetStatus("heavyattack", skillData, "Taunted", ESOBUILDCOMBAT_TAUNT_DURATION);
		EsoBuildCombatRunGlobalEvent("onTaunt", skillData);
	}
	
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + castTime;
	
	if (restoreStatValue > 0 && restoreStat)
	{
		EsoBuildCombatAddGlobalOnTimeEvent(castTime, function() {
			EsoBuildCombatRestoreStat("heavyattack", skillData, restoreStat, restoreStatValue); 
		}, true);
	}
	else if (g_EsoBuildCombatState.isOverload && skillData.name == "Energy Overload")
	{
		var matchResult = skillData.lastDesc.match(/Each attack restores ([0-9]+) Magicka/i);
		if (matchResult && matchResult[1]) EsoBuildCombatRestoreStat("skill", g_EsoBuildCombatState.overloadSkillData, "Magicka", matchResult[1]);
	}
	
	if (endOverload) EsoBuildCombatToggleOverload(null, "due to lack of Ultimate");
	
	return true;
}


window.EsoBuildCombatCheckWeaponEnchants = function()
{
	if (g_EsoBuildActiveWeapon == 1) 
	{
		if (!$.isEmptyObject(g_EsoBuildItemData['MainHand1'])) EsoBuildCombatCheckWeaponEnchant("MainHand1");
		if (!$.isEmptyObject(g_EsoBuildItemData['OffHand1']))  EsoBuildCombatCheckWeaponEnchant("OffHand1");
	}
	else if (g_EsoBuildActiveWeapon == 2)
	{
		if (!$.isEmptyObject(g_EsoBuildItemData['MainHand2'])) EsoBuildCombatCheckWeaponEnchant("MainHand2");
		if (!$.isEmptyObject(g_EsoBuildItemData['OffHand2']))  EsoBuildCombatCheckWeaponEnchant("OffHand2");
	}
		
}


window.EsoBuildCombatCheckWeaponEnchant = function(slotId) 
{
	var enchantData = g_EsoBuildEnchantData[slotId];
	
	if (enchantData == null || $.isEmptyObject(enchantData)) return false;
	if (enchantData.enchantDesc == null || enchantData.enchantDesc == "") return false;
	
	var cooldownId = slotId + "Enchant";
	
	if (g_EsoBuildCombatState.cooldowns[cooldownId] != null) return false;
	
	EsoBuildCombatFireWeaponEnchant(slotId, enchantData);
	
	return true;
}


window.EsoBuildCombatFireWeaponEnchant = function(slotId, enchantData)
{
	var cooldownId = slotId + "Enchant";
	
	EsoBuildCombatAddCooldown(cooldownId, enchantData.cooldown);
	// if (enchantData.duration != null && enchantData.duration > 0) {}
	
	for (var i = 0; i < ESOBUILD_COMBAT_WEAPONENCHANT_MATCHES.length; ++i)
	{
		var matchData = ESOBUILD_COMBAT_WEAPONENCHANT_MATCHES[i];
		var enchantDesc = enchantData.newEnchantDesc;
		
		if (enchantDesc == null || enchantDesc == "") continue;
		
		var matchResult = enchantDesc.match(matchData.match);
		if (!matchResult) continue;
		
		var damage = null;
		var damageType = null;
		var restore = null;
		var restoreType = null;
		var duration = null;
		var buffValue = null;
			
		if (matchData.getDamageFunc) damage = matchData.getDamageFunc(matchResult); 
		if (matchData.getDamageTypeFunc) damageType = matchData.getDamageTypeFunc(matchResult);
		if (matchData.getRestoreFunc) restore = matchData.getRestoreFunc(matchResult); 
		if (matchData.getRestoreTypeFunc) restoreType = matchData.getRestoreTypeFunc(matchResult);
		if (matchData.getDurationFunc) duration = matchData.getDurationFunc(matchResult);
		if (matchData.getBuffValueFunc) buffValue = matchData.getBuffValueFunc(matchResult);
		
		if (matchData.buffId && duration) 
		{
			if (buffValue) EsoBuildCombatUpdateBuffValue(matchData.buffId, buffValue);
			EsoBuildCombatAddBuff("weaponenchant", enchantData, matchData.buffId, duration);
		}
		
		if (damage && damageType)
		{
			EsoBuildCombatApplyDamage("enchant", enchantData, damage, damageType, false, false, false, false);
		}
		
	}
	
}


window.EsoBuildCombatIsSkillActive = function(abilityId)
{
	return ( g_EsoBuildCombatState.activeSkills[id] != null);
}


window.EsoBuildCombatIsSkillLineActive = function(skillLine)
{
	return (g_EsoBuildCombatState.activeSkillLines[skillLine] != null);
}


window.EsoBuildCombatAddActiveSkill = function(id, duration, skillLine)
{
	if (duration == null || duration <= 0) return;
	
	skillLine = skillLine.replace(/ Skills$/, "");
	
	var currentValue = g_EsoBuildCombatState.activeSkills[id];
	var newValue = g_EsoBuildCombatState.currentTime + duration;
	
	if (currentValue == null || currentValue < newValue) g_EsoBuildCombatState.activeSkills[id] = newValue;
	
	currentValue = g_EsoBuildCombatState.activeSkillLines[skillLine];
	if (currentValue == null || currentValue < newValue) g_EsoBuildCombatState.activeSkillLines[skillLine] = newValue;
}


window.EsoBuildCombatAddNewCooldown = function(name, duration)
{
	if (EsoBuildCombatHasCooldown(name)) return false;
	EsoBuildCombatAddCooldown(name, duration);
	return true;
}


window.EsoBuildCombatAddCooldown = function(name, duration)
{
	duration = parseFloat(duration);
	if (isNaN(duration) || duration == null || duration <= 0) return;
	
	var currentValue = g_EsoBuildCombatState.cooldowns[name];
	var newValue = g_EsoBuildCombatState.currentTime + duration;
	
	if (currentValue == null || currentValue < newValue) g_EsoBuildCombatState.cooldowns[name] = newValue;
}


window.EsoBuildCombatHasCooldown = function(name)
{
	return (g_EsoBuildCombatState.cooldowns[name] != null);
}


window.EsoBuildCombatIncrementCounter = function(name, duration, maxCount, tickTime, onTick, onMaxCounter)
{
	var counter = g_EsoBuildCombatState.counters[name];
	
	if (!counter) counter = EsoBuildCombatAddCounter(name, duration, maxCount, tickTime, onTick, onMaxCounter);
	if (counter == null) return null;
	
	duration = parseFloat(duration);
	if (isNaN(duration) || duration <= 0) return counter;
	
	counter.duration = duration;
	counter.endTime = g_EsoBuildCombatState.currentTime + duration;
	if (duration < 0) counter.endTime = -1;
	
	if (counter.value < counter.maxCount) ++counter.value;
	
	if (counter.value == counter.maxCount && counter.onMaxCounter) {
		counter.onMaxCounter(counter, counter.value);
	}
	
	return counter;
}


window.EsoBuildCombatAddCounter = function(name, duration, maxCount, tickTime, onTick, onMaxCounter)
{
	duration = parseFloat(duration);
	maxCount = parseInt(maxCount);
	tickTime = parseFloat(tickTime);
	if (isNaN(duration)) return null;
	if (isNaN(maxCount)) return null;
	if (isNaN(tickTime)) tickTime = -1;
	
	var oldCounter = g_EsoBuildCombatState.counters[name];
	var newCounter = {};
	var newEndTime = g_EsoBuildCombatState.currentTime + duration;
	
	if (oldCounter)
	{
		if (newEndTime < oldCounter.endTime) return oldCounter;
		newCounter = oldCounter;
	}
	else 
	{
		newCounter.value = 0;
		newCounter.tickTime = tickTime;
		newCounter.nextTime = -1;
		if (tickTime > 0) newCounter.nextTime = g_EsoBuildCombatState.currentTime + newCounter.tickTime;
		newCounter.onTick = function() { };
		newCounter.onMaxCounter = function() { };
	}
	
	if (onTick) newCounter.onTick = onTick;
	if (onMaxCounter) newCounter.onMaxCounter = onMaxCounter;
	newCounter.name = name;
	newCounter.maxCount = maxCount;
	newCounter.duration = duration;
	newCounter.endTime = g_EsoBuildCombatState.currentTime + duration;
	if (duration < 0) newCounter.endTime = -1;
	
	g_EsoBuildCombatState.counters[name] = newCounter;
	return newCounter;
}


window.EsoBuildCombatHasCounter = function(name)
{
	return (g_EsoBuildCombatState.counters[name] != null);
}


window.EsoBuildCombatGetCounter = function(name)
{
	if (g_EsoBuildCombatState.counters[name] == null) return 0;
	return g_EsoBuildCombatState.counters[name];
}


window.EsoBuildCombatRemoveCounter = function(name)
{
	var counter = g_EsoBuildCombatState.counters[name];
	if (counter == null) return null;
	
	delete g_EsoBuildCombatState.counters[name];
	
	return counter;
}


window.EsoBuildCombatAddPlayerStatus = function(srcType, srcData, statusEffect, duration, cooldown)
{
	duration = parseFloat(duration);
	cooldown = parseFloat(cooldown);
	
	if (isNaN(duration) || duration == null || duration <= 0) return false;
	
	if (cooldown > 0)
	{
		if (EsoBuildCombatHasCooldown(statusEffect)) return false;
		EsoBuildCombatAddCooldown(statusEffect, cooldown);
	}
	
	var currentValue = g_EsoBuildCombatState.playerStatus[statusEffect];
	var newValue = g_EsoBuildCombatState.currentTime + duration;
	
	if (currentValue == null || currentValue < newValue) g_EsoBuildCombatState.playerStatus[statusEffect] = newValue;
	
	return (currentValue == null);
}


window.EsoBuildCombatRemovePlayerStatus = function(statusEffect)
{
	if (g_EsoBuildCombatState.playerStatus[statusEffect] == null) return false;
	
	delete g_EsoBuildCombatState.playerStatus[statusEffect] ;
	return true;
}


window.EsoBuildCombatRemoveTargetStatus = function( statusEffect)
{
	if (g_EsoBuildCombatState.targetStatus[statusEffect] == null) return false;
	
	if (g_EsoBuildCombatOptions.log.showStatusEffects) {
		EsoBuildCombatLog("Ending target status effect " + statusEffect + ".");
	}
	
	EsoBuildCombatRunGlobalEvent("onStatusEffectChange", statusEffect, false);
	
	delete g_EsoBuildCombatState.targetStatus[statusEffect];
	
	return true;
}


window.EsoBuildCombatAddTargetStatus = function(srcType, srcData, statusEffect, duration, cooldown)
{
	duration = parseFloat(duration);
	cooldown = parseFloat(cooldown);
	
	if (isNaN(duration) || duration == null || duration <= 0) return false;
	
	if (cooldown > 0)
	{
		if (EsoBuildCombatHasCooldown(statusEffect)) return false;
		EsoBuildCombatAddCooldown(statusEffect, cooldown);
	}
	
	var currentValue = g_EsoBuildCombatState.targetStatus[statusEffect];
	var newValue = g_EsoBuildCombatState.currentTime + duration;
	
	if (currentValue == null || currentValue < newValue) g_EsoBuildCombatState.targetStatus[statusEffect] = newValue;
	
	if (currentValue == null) 
	{
		if (g_EsoBuildCombatOptions.log.showStatusEffects) {
			EsoBuildCombatLog("Applying target status effect " + statusEffect + " from " + srcType + " " + srcData.name + ".");
		}
		
		g_EsoBuildCombatStatUpdateRequired = true;
		EsoBuildCombatRunGlobalEvent("onStatusEffectChange", statusEffect, true);
	}
	
	return (currentValue == null);
}


window.EsoBuildCombatCastSkillBarSwap = function(skillData)
{
	if (g_EsoBuildCombatState.isWerewolf && skillData.skillBarIndex != 4) return false;
	
	if (g_EsoBuildCombatOptions.log.showBarSwaps) 
	{
		EsoBuildCombatLog("Swapping to ability bar #" + skillData.skillBarIndex + ".");
	}
	
	EsoBuildCombatSkillBarSwap(skillData.skillBarIndex);
	
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + skillData.castTime/1000;
	
	return true;
}


window.EsoBuildCombatCanCastPlayerSkill = function(skillData)
{
	var skillLine = skillData.skillLine.replace(/ Skills$/, "");
	var skillType = parseInt(skillData.skillType);
	var canCast = true;
	var failMsg = "";
	
		// Werewolf
	if (g_EsoBuildCombatState.isWerewolf && skillLine != "Werewolf") 
	{
		canCast = false;
		failMsg = "You can't use non-Werewolf skills while in Werewolf form!";
	}
		/* Weapon */
	else if (skillType == 2) 
	{
		switch (skillLine)
		{
		case "Two Handed": 			canCast = (g_EsoBuildLastInputValues.Weapon2H        > 0); break;
		case "One Hand and Shield": canCast = (g_EsoBuildLastInputValues.Weapon1HShield  > 0); break;
		case "Dual Wield": 		 	canCast = (g_EsoBuildLastInputValues.Weapon1H        > 1); break;
		case "Bow": 			  	canCast = (g_EsoBuildLastInputValues.WeaponBow       > 0); break;
		case "Destruction Staff": 	canCast = (g_EsoBuildLastInputValues.WeaponDestStaff > 0); break;
		case "Restoration Staff": 	canCast = (g_EsoBuildLastInputValues.WeaponRestStaff > 0); break;
		default: canCast = false; break;
		}
		
		failMsg = "You must have a " + skillLine + " weapon equipped!";
	}
		/* Armor */
	else if (skillType == 3) 
	{
		switch (skillLine)
		{
		case "Light Armor":  canCast = (g_EsoBuildLastInputValues.ArmorLight  >= 5); break;
		case "Medium Armor": canCast = (g_EsoBuildLastInputValues.ArmorMedium >= 5); break;
		case "Heavy Armor":  canCast = (g_EsoBuildLastInputValues.ArmorHeavy  >= 5); break;
		default: canCast = false; break;
		}
		
		failMsg = "You must have 5 pieces of " + skillLine + " armor equipped!";
	}
	else if (skillLine == "Vampire") 
	{
		canCast = (g_EsoBuildLastInputValues.VampireStage > 0);
		failMsg = "You must be a Vampire!";
	}
	else if (skillLine == "Werewolf") 
	{
		canCast = (g_EsoBuildLastInputValues.WerewolfStage == 2);
		failMsg = "You must be in Werewolf form!";
	}
	
	if (!canCast) EsoBuildCombatLog("Failed to cast skill " + skillData.name + "! " + failMsg + "");
	return canCast;
}


window.EsoBuildCombatCastSpecialPlayerSkill = function(skillData)
{
	if (skillData.baseName == "Overload") return EsoBuildCombatToggleOverload(skillData, null, true);
	if (skillData.baseName == "Werewolf Transformation") return EsoBuildCombatToggleWerewolf(skillData, null, true);
	if (skillData.baseName == "Feral Guardian") return EsoBuildCombatToggleFeralGuardian(skillData, null, true);
	
	return false;
}


window.EsoBuildCombatToggleFeralGuardian = function(skillData, msg, isManualAction)
{
	var desc = GetEsoSkillDescription(skillData.abilityId, null, false, true, false);
	
	if (EsoBuildCombatHasPet(skillData.name)) 
	{
		var matchResult = desc.match(/you can activate Guardian's (?:Savagery|Wrath) for ([0-9]+) Ultimate/i);
		if (!matchResult) return true; 

		var cost = parseInt(matchResult[1]);		//TODO: Cost reduction?
		if (g_EsoBuildCombatState.currentUltimate < cost) return true;
		
		matchResult = desc.match(/causing the grizzly to maul an enemy for ([0-9]+) ([A-Za-z]+) Damage. /i);
		if (!matchResult) return true;
		
		g_EsoBuildCombatState.currentUltimate = 0;
		
		EsoBuildCombatApplyDamage("skill", skillData, matchResult[1], matchResult[2], false, false, false, true);
		g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + ESOBUILD_GLOBALDELAY_TIME;
		
		return true;
	}
	
	var attackData = [];
	var newAttack = {};
	
	newAttack.type = "damage";
	newAttack.match = /The grizzly swipes at an enemy, dealing ([0-9]+) ([A-Za-z]+) Damage/i;
	newAttack.isDOT = false;
	newAttack.isAOE = false;
	newAttack.isBleed = false;
	newAttack.chance = 0.75;
	newAttack.tickTime = 1.0;
	newAttack.ignoreDamageMod = true;
	attackData.push(newAttack);
	
	newAttack = {};
	newAttack.type = "damage";
	newAttack.statusEffect = "Stunned";
	newAttack.durationIndex = 3;
	newAttack.match = /swipes all enemies in front of it, dealing ([0-9]+) ([A-Za-z]+) Damage and stunning them for ([0-9.]+) second/i;
	newAttack.isDOT = false;
	newAttack.isAOE = true;
	newAttack.isBleed = false;
	newAttack.ignoreDamageMod = true;
	newAttack.chance = 0.25;
	newAttack.tickTime = 1.0;
	attackData.push(newAttack);
	
	EsoBuildCombatAddPet("skill", skillData, skillData.name, -1, attackData);
	
	EsoBuildCombatLog("You summon a " + skillData.name + ".");
	
	return true;
}


window.EsoBuildCombatToggleOverload = function(skillData, msg, isManualAction)
{
	if (g_EsoBuildCombatState.isWerewolf) return true;
	
	if (g_EsoBuildCombatState.isOverload)
	{
		if (isManualAction && g_EsoBuildCombatOptions.stayInOverload) return true;
		
		if (msg)
			EsoBuildCombatLog("Turned overload toggle off " + msg + "!");
		else
			EsoBuildCombatLog("Turned overload toggle off!");
		
		g_EsoBuildCombatState.isOverload = false;
		EsoBuildCombatRemovePlayerStatus("Overload");
		return true;
	}
	
	var cost = parseInt(skillData.newCostText);
	if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) return true;
	
	g_EsoBuildCombatState.isOverload = true;
	g_EsoBuildCombatState.overloadSkillData = skillData;
	EsoBuildCombatAddPlayerStatus("skill", skillData, "Overload");
	EsoBuildCombatLog("Turned overload toggle on!");
	
	return true;
}


window.EsoBuildCombatToggleWerewolf = function(skillData, msg, isManualAction)
{
	if (g_EsoBuildCombatState.isOverload) EsoBuildCombatToggleOverload(null, "can't use overload in Werewolf form");
	
	if (g_EsoBuildCombatState.isWerewolf)
	{
		if (isManualAction && g_EsoBuildCombatOptions.stayInWerewolf) return true;
		
		if (msg)
			EsoBuildCombatLog("Turned off werewolf form " + msg + "!");
		else
			EsoBuildCombatLog("Turned off werewolf form!");
		
		g_EsoBuildCombatStatUpdateRequired = true;
		g_EsoBuildCombatState.isWerewolf = false;
		EsoBuildCombatRemoveBuff("Lycanthropy");
		EsoBuildCombatSkillBarSwap(g_EsoBuildCombatState.origSkillBarIndex);
		$("#esotbWerewolfStage").val(0);
		
		return true;
	}
	
	var cost = parseInt(skillData.newCostText);
	if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) return true;
	
	g_EsoBuildCombatState.currentUltimate = 0;
	
	g_EsoBuildCombatState.isWerewolf = true;
	g_EsoBuildCombatStatUpdateRequired = true;
	g_EsoBuildCombatState.origSkillBarIndex = g_EsoBuildActiveAbilityBar;
	g_EsoBuildCombatState.werewolfSkillData = skillData;
	
	EsoBuildCombatLog("Turned on werewolf form from " + skillData.name + "!");
	EsoBuildCombatAddBuff("skill", skillData, "Lycanthropy", 3600);
	
	EsoBuildCombatSkillBarSwap(4);
	$("#esotbWerewolfStage").val(2);
	
	return true;
}


window.EsoBuildCombatCastPlayerSkill = function(skillData)
{
	var skillResult = {};
	var skillName = skillData.name;
	var costText = GetEsoSkillCost(skillData.abilityId, null, false);
	var duration = GetEsoSkillDuration(skillData.abilityId);
	
	if (EsoBuildCombatCastSpecialPlayerSkill(skillData)) return true;
	
	skillData.overrideName = null;
	
		// Turn off toggle
	if (skillData.isToggle > 0 && EsoBuildCombatHasSkillToggle(skillData.name)) 
	{
		EsoBuildCombatRemoveToggle("cast", skillData.name);
		return true;
	}
	
	if (g_EsoBuildCombatState.cooldowns[skillData.abilityId] != null) 
	{
		var cooldownLeft = g_EsoBuildCombatState.cooldowns[skillData.abilityId] - g_EsoBuildCombatState.currentTime;
		
		if (g_EsoBuildCombatState.skillDelay[skillData.abilityId] == null) 
		{
			EsoBuildCombatLog("Failed to cast player skill " + skillData.name + " due to cooldown (" + cooldownLeft.toFixed(2) + " secs left).");
			g_EsoBuildCombatState.skillDelay[skillData.abilityId] = g_EsoBuildCombatState.currentTime;
		}
		
		return false;
	}
	
		/* Run pre-cast skill matches (modify cost, duration, etc...) */
	skillResult = EsoBuildCombatRunSkillMatches(skillData, ESOBUILD_COMBAT_SKILL_MATCHES_PRECAST);
	
	if (skillResult.cost) costText = skillResult.cost;
	if (skillResult.name) skillName = skillResult.name;
	if (skillResult.duration) duration = skillResult.duration;
	
	var costSplit = costText.split(" ");
	var cost = parseInt(costSplit[0]);
	var costType = costSplit[1];
	var costRate = parseFloat(costSplit[3]);
	if (isNaN(costRate)) costRate = 0;
	
	var canCast = EsoBuildCombatCanCastPlayerSkill(skillData);
	if (!canCast) return false;
	
	var costMod = EsoBuildCombatRunGlobalGetFunc("getCostMod", 1.0, "*", skillData, cost);
	if (costMod != 1) cost = Math.floor(cost * costMod);
	
	var initialUltimate = g_EsoBuildCombatState.currentUltimate;
	
	if (costType == "Health")
	{
		if (!g_EsoBuildCombatOptions.ignoreResources && g_EsoBuildCombatState.currentHealth < cost) 
			canCast = false;
		else
			g_EsoBuildCombatState.currentHealth -= cost;
	}
	else if (costType == "Magicka")
	{
		if (!g_EsoBuildCombatOptions.ignoreResources && g_EsoBuildCombatState.currentMagicka < cost) 
			canCast = false;
		else 
			g_EsoBuildCombatState.currentMagicka -= cost;
	}
	else if (costType == "Stamina")
	{
		if (!g_EsoBuildCombatOptions.ignoreResources && g_EsoBuildCombatState.currentStamina < cost) 
			canCast = false;
		else
			g_EsoBuildCombatState.currentStamina -= cost;
	}
	else if (costType == "Ultimate")
	{
		if (!g_EsoBuildCombatOptions.ignoreUltimate && g_EsoBuildCombatState.currentUltimate < cost) {
			canCast = false;
		}
		else {
			g_EsoBuildCombatState.currentUltimate -= cost;
			if (g_EsoBuildCombatState.currentUltimate > 0) g_EsoBuildCombatState.currentUltimate = 0;
		}
	}
	
	if (!canCast)
	{
		if (g_EsoBuildCombatState.skillDelay[skillData.abilityId] == null) 
		{
			EsoBuildCombatLog("Failed to cast player skill " + skillData.name + " due to lack of " + costType + ".");
			g_EsoBuildCombatState.skillDelay[skillData.abilityId] = g_EsoBuildCombatState.currentTime;
		}
		
		return false;
	}
	
	/* Start casting the ability from this point */
	
	EsoBuildCombatLogDrainStat("skill", skillData, costType, cost);
	++skillData.combat.castCount;
	
	var castTime = skillData.castTime/1000;
	var channelTime = skillData.channelTime/1000;
	var actionDuration = duration;
	
	if (skillResult.castTime) castTime = skillResult.castTime/1000;
	
	if (channelTime > 0 && channelTime > actionDuration) actionDuration = channelTime;
	if (actionDuration > 0) EsoBuildCombatAddActiveSkill(skillData.abilityId, actionDuration/1000, skillData.skillLine);
	
	if (g_EsoBuildCombatState.skillDelay[skillData.abilityId] != null) 
	{
		var origCastTime = g_EsoBuildCombatState.skillDelay[skillData.abilityId];
		var diffTime = g_EsoBuildCombatState.currentTime - origCastTime;
		
		EsoBuildCombatLog("Warning: Player skill " + skillData.name + " cast was delayed " + diffTime.toFixed(2) + " seconds.");
		
		delete g_EsoBuildCombatState.skillDelay[skillData.abilityId];
	}
	
	if (skillData.isToggle > 0)
	{
		EsoBuildCombatAddToggle("cast", skillData, skillData.name, -1, -1, cost, costType, costRate)
	}
	else 
	{
		if (g_EsoBuildCombatOptions.log.showSkillCast) {
			EsoBuildCombatLog("Casting player skill " + skillName + " for " + cost + " " + costType + ".");
		}
	}
	
		/* Run any events associated with the initial cast/hit of the skill */
	EsoBuildCombatRunSkillEvent(skillData, "onInitialHit");	
	EsoBuildCombatRunSkillLineEvent(skillData.skillLine, "onSkillLineCast", skillData);
	EsoBuildCombatRunGlobalEvent("onAnySkillCast", skillData, cost);
	if (costType == "ultimate" || skillData.mechanic == 10) EsoBuildCombatRunGlobalEvent("onUltimateCast", skillData, cost, initialUltimate);
	
	if (EsoBuildCombatIsSkillTaunt(skillData)) 
	{
		EsoBuildCombatAddTargetStatus("skill", skillData, "Taunted", ESOBUILDCOMBAT_TAUNT_DURATION);
		EsoBuildCombatRunGlobalEvent("onTaunt", skillData);
	}
	
		/* Perform the actual skill cast and damage application */
	var skillResult1 = EsoBuildCombatRunSkillMatches(skillData, ESOBUILD_COMBAT_SKILL_MATCHES);
	Object.assign(skillResult, skillResult1);
	
	EsoBuildCombatRunSkillEvent(skillData, "afterInitialHit");
	
	if (skillResult.cooldown) EsoBuildCombatAddCooldown(skillData.abilityId, skillResult.cooldown);
	
	if (castTime < ESOBUILD_GLOBALDELAY_TIME) castTime = ESOBUILD_GLOBALDELAY_TIME;
	if (castTime < channelTime) castTime = channelTime;
	
	g_EsoBuildCombatState.playerStatus['playerAction'] = g_EsoBuildCombatState.currentTime + castTime;
	
	return true;
}


window.CreateEsoBuildCombatSaveData = function(saveData, inputValues)
{
	var actionCount = 0;
	saveData.Combat = {};
	
	EsoBuildCombatGetOptions();
	
	saveData.Stats['useLAWeaving'] = g_EsoBuildCombatOptions.useLAWeaving;
	saveData.Stats['stayInOverload'] = g_EsoBuildCombatOptions.stayInOverload;
	saveData.Stats['startWithFullUltimate'] = g_EsoBuildCombatOptions.startWithFullUltimate;
	saveData.Stats['showDamageDetails'] = g_EsoBuildCombatOptions.log.showDamageDetails;
	saveData.Stats['showBuffs'] = g_EsoBuildCombatOptions.log.showBuffs;
	saveData.Stats['showSkillCast'] = g_EsoBuildCombatOptions.log.showSkillCast;
	saveData.Stats['showToggles'] = g_EsoBuildCombatOptions.log.showToggles;
	saveData.Stats['showStatusEffects'] = g_EsoBuildCombatOptions.log.showStatusEffects;
	saveData.Stats['showRegen'] = g_EsoBuildCombatOptions.log.showRegen;
	saveData.Stats['showRestore'] = g_EsoBuildCombatOptions.log.showRestore;
	saveData.Stats['showBarSwaps'] = g_EsoBuildCombatOptions.log.showBarSwaps;
	saveData.Stats['showRollDodge'] = g_EsoBuildCombatOptions.log.showRolls;
	
	for (var rotation in g_EsoBuildCombatPlayerRotations) 
	{
		var actions = g_EsoBuildCombatPlayerRotations[rotation];
		var actionData = "";
		
		for (var i in actions)
		{
			var action = actions[i];
			
			if (actionData != "") actionData += ",";
			
			actionData += action.abilityId;
			if (action.actionData != null) actionData += "(" + action.actionData + ")";
			
			++actionCount;
		}
		
		saveData.Combat[rotation] = actionData;
	}
	
		// TODO: Update deleted actions?
	if (actionCount == 0) delete saveData['Combat'];
	
	return saveData;
}


window.EsoBuildCombatRunNextPlayerAction = function()
{
	var playerAction = g_EsoBuildCombatPlayerActions[g_EsoBuildCombatState.nextPlayerActionId];
	if (playerAction == null) return false;
	
	var skillData = playerAction.skillData;
	
	EsoBuildCombatHighlightBlock(playerAction.combatId);
	
	if (playerAction.abilityId >= ESOBUILD_UNIQUESKILLID_MIN && playerAction.abilityId <= ESOBUILD_UNIQUESKILLID_MAX && skillData)
	{
		var castResult = EsoBuildCombatCastUniqueSkill(skillData, playerAction);
		
		if (!castResult) {
			if (!g_EsoBuildCombatOptions.skipSkillOnError) return false
		}
	}
	else if (playerAction.abilityId > 0 && skillData) 
	{
		var castResult = EsoBuildCombatCastPlayerSkill(skillData);
		
		if (!castResult) {
			if (!g_EsoBuildCombatOptions.skipSkillOnError) return false
		}
	}
	
	++g_EsoBuildCombatState.nextPlayerActionId;
	
	if (g_EsoBuildCombatPlayerActions[g_EsoBuildCombatState.nextPlayerActionId] == null) 
	{
		++g_EsoBuildCombatState.rotationCount;
		g_EsoBuildCombatState.nextPlayerActionId = 1;
	}
	
	return true;
}


window.EsoBuildCombatHighlightBlock = function(combatId) 
{
	$(".esotbCombatBlockHighlight").removeClass("esotbCombatBlockHighlight");
	
	if (combatId > 0) {
		$(".esotbCombatBlock[combatid='" + combatId + "']").addClass("esotbCombatBlockHighlight");
	}
}


window.EsoBuildCombatUpdateComputedStats = function() 
{
	if (!ESOBUILD_COMBAT_USECACHED_INPUTVALUES) 
	{
		UpdateEsoComputedStatsList_Real(true, true);
		g_EsoBuildCombatStatUpdateRequired = false;
		EsoBuildCombatUpdateSetData();
		return;
	}
	
	EsoProfileStart("EsoBuildCombatUpdateComputedStats");
	
	var inputValues = GetEsoInputValues();
	
	var cachedInputValues = EsoBuildCombatGetCachedInputValues(inputValues);
	
	if (cachedInputValues != null)
	{
		EsoBuildLog("Using cached computed stat values!");
		
		g_EsoBuildLastInputValues = cachedInputValues;
		UpdateEsoBuildSkillInputValues(g_EsoBuildLastInputValues);
		g_EsoBuildCombatStatUpdateRequired = false;
		
		DisplayEsoAllComputedStats(g_EsoBuildLastInputValues);
		EsoBuildCombatUpdateSetData();
		
		EsoProfileEnd("EsoBuildCombatUpdateComputedStats");
		return;
	}
	
	UpdateEsoComputedStatsList_Real(true, true);
	DisplayEsoAllComputedStats(g_EsoBuildLastInputValues);
	EsoBuildCombatSetCachedInputValues(inputValues);
	
	g_EsoBuildCombatStatUpdateRequired = false;
	EsoBuildCombatUpdateSetData();
	EsoProfileEnd("EsoBuildCombatUpdateComputedStats");
}


window.EsoBuildCombatSaveStatHistory = function() 
{
	var statHistory = g_EsoBuildCombatState.statHistory;
	
	var newStat = {};
	
	newStat.Health   = g_EsoBuildCombatState.currentHealth;
	newStat.Magicka  = g_EsoBuildCombatState.currentMagicka;
	newStat.Stamina  = g_EsoBuildCombatState.currentStamina;
	newStat.Ultimate = g_EsoBuildCombatState.currentUltimate;
	
	statHistory[g_EsoBuildCombatState.currentTime] = newStat;
	
	for (var time in statHistory) 
	{
		var diffTime = g_EsoBuildCombatState.currentTime - time;
		if (diffTime > ESOBUILDCOMBAT_STATHISTORY_MAXTIME) delete statHistory[time];
	}
}


window.EsoBuildCombatLoop = function() 
{
	if (!g_EsoBuildCombatIsRunning) return;
	if (g_EsoBuildCombatIsPaused) return;
	
	EsoProfileStart('EsoBuildCombatLoop');
	
	EsoBuildCombatSaveStatHistory();
	
	// EsoBuildCombatLog("Starting Combat Loop for combat time " +
	// g_EsoBuildCombatState.currentTime.toFixed(3) + " sec.");
	
	EsoBuildCombatUpdateAllBuffDisplay();
	EsoBuildCombatRunGlobalOnTimeEvent();
	EsoBuildCombatCheckTimes();
	EsoBuildCombatRunGlobalEvent("onTick", g_EsoBuildCombatState.currentTime);
	
	var playerAction = g_EsoBuildCombatState.playerStatus['playerAction'];
	
	if (playerAction == null)
	{
		EsoBuildCombatRunNextPlayerAction();
	}
	
	if (g_EsoBuildCombatStatUpdateRequired) EsoBuildCombatUpdateComputedStats();
	
	EsoBuildCombatUpdateStats();
	EsoBuildCombatUpdateAllBuffDisplay();
	
	g_EsoBuildCombatState.currentTime += ESOBUILD_COMBAT_LOOPDELTATIME;
	g_EsoBuildCombatTimeoutId = setTimeout(EsoBuildCombatLoop, ESOBUILD_COMBAT_REALTIMELOOPDELAYMS);
	
	EsoProfileEnd('EsoBuildCombatLoop');
}


window.EsoBuildCombatEnableEditEvents = function(enable)
{
	if (enable) 
	{
		$(".esotbCombatDisable").removeClass("esotbCombatDisable");
	}
	else 
	{
		$("#esotbCombatAddSlot").addClass("esotbCombatDisable");
		$("#esotbCombatTabOptions").addClass("esotbCombatDisable");
	}
}


window.EsoBuildCombatCheckSpecialToggles = function()
{
	var minorHeroBuff = g_EsoBuildBuffData['Minor Heroism'];
	
	if (minorHeroBuff.enabled || minorHeroBuff.buffEnabled || minorHeroBuff.skillEnabled) 
	{
		EsoBuildCombatAddRestoreStat("buff", minorHeroBuff, "Ultimate", 1, 1.5, -1);
	}
}


window.EsoBuildStartCombat = function() 
{
	var log = $("#esotbCombatLog");
	
	if (g_EsoBuildCombatIsRunning) return;
	
	EsoBuildCombatGetOptions();
	
	EsoBuildCombatFixActionData();
	EsoBuildCombatEnableEditEvents(false);
	
	EsoBuildCombatHighlightBlock(-1);
	g_EsoBuildCombatIsPaused = false;
	
	EsoBuildResetCombatState();
	EsoBuildCombatInitializeAllSkillEvents();
	EsoBuildCombatCheckSpecialToggles();
	
	g_EsoBuildCombatState.targetHealth = g_EsoBuildCombatState.targetMaxHealth;
	g_EsoBuildCombatState.targetPctHealth = 100;
	g_EsoBuildCombatState.currentTime = 0;
	g_EsoBuildCombatState.nextPlayerActionId = 1;
	
	g_EsoBuildCombatIsRunning = true;
	
	log.text("");
	
	EsoBuildCombatLog("Starting Combat Simulation...");
	
	if (g_EsoBuildCombatOptions.ignoreResources) EsoBuildCombatLog("Warning: Ignoring Health/Magicka/Stamina resource levels when casting abilities!");
	if (g_EsoBuildCombatOptions.ignoreUltimate) EsoBuildCombatLog("Warning: Ignoring Ultimate resource levels when casting abilities!");
	
	$("#esotbCombatRunButton").text("Stop Combat");
	$("#esotbCombatPauseButton").text("Pause Combat").removeAttr("disabled");
	
	g_EsoBuildCombatTimeoutId = setTimeout(EsoBuildCombatLoop, ESOBUILD_COMBAT_REALTIMELOOPDELAYMS);
}


window.EsoBuildEndCombat = function()
{
	if (!g_EsoBuildCombatIsRunning) return;
	
	EsoBuildCombatDisableAllCombatEnabled();
	
	EsoBuildCombatEnableEditEvents(true);
	g_EsoBuildCombatIsRunning = false;
	EsoBuildCombatLog("Ending Combat Simulation");
	
	EsoBuildCombatHighlightBlock(-1);
	
	$("#esotbCombatRunButton").text("Run Combat");
	$("#esotbCombatPauseButton").text("Pause Combat").attr("disabled", true);
	
	clearTimeout(g_EsoBuildCombatTimeoutId);
	
	UpdateEsoComputedStatsList(false);
	EsoBuildCombatCreateStats();
}


window.OnEsoBuildCombatPause = function(e)
{
	if (g_EsoBuildCombatIsPaused)
	{
		g_EsoBuildCombatIsPaused = false;
		g_EsoBuildCombatTimeoutId = setTimeout(EsoBuildCombatLoop, ESOBUILD_COMBAT_REALTIMELOOPDELAYMS);
		$("#esotbCombatPauseButton").text("Pause Combat");
		EsoBuildCombatLog("Resuming Combat...");
	}
	else
	{
		$("#esotbCombatPauseButton").text("Resume Combat");
		g_EsoBuildCombatIsPaused = true;
		clearTimeout(g_EsoBuildCombatTimeoutId);
		EsoBuildCombatLog("Pausing Combat...");
		EsoBuildCombatCreateStats();
	}
	
}


window.OnEsoBuildCombatRun = function(e)
{
	var log = $("#esotbCombatLog");
	
	if (!g_EsoBuildCombatIsRunning) 
	{
		EsoBuildStartCombat();
	}
	else 
	{
		EsoBuildEndCombat();
	}
}


window.EsoBuildCombatSetSlotSkill = function(slotElement, action)
{
	var abilityId = action.abilityId;
	var slotIcon = slotElement.children(".esovsCombatSkillIcon");
	var slotImage = slotIcon.children("img");
	var slotName = slotIcon.siblings(".esovsCombatSkillName");
	var skillData = g_SkillsData[abilityId];
	
	slotIcon.attr("origskillid", -1);
	slotIcon.attr("skillid", abilityId);
	
	if (skillData)
	{
		var iconName = skillData.icon.replace(".dds", ".png");
		slotImage.attr("src", ESO_ICON_URL + iconName);
	}
	else 
	{
		slotImage.attr("src", ESO_ICON_URL + "");
	}
	
	var html = EsoBuildCombatGetSkillActionHtml(skillData, abilityId, action.actionData);
	slotName.html(html);
}


window.EsoBuildCombatDisplayRotation = function(rotationName)
{
	g_EsoBuildCombatCurrentRotation = rotationName;
	g_EsoBuildCombatPlayerActions = g_EsoBuildCombatPlayerRotations[rotationName];
	EsoBuildCombatGetCombatBlocks().remove();
	
	for (var id in g_EsoBuildCombatPlayerActions) 
	{
		var action = g_EsoBuildCombatPlayerActions[id];
		var newSlotElement = EsoBuildCombatAddSlotElement(action.combatId);
		
		EsoBuildCombatSetSlotSkill(newSlotElement, action);
	}
}


window.EsoBuildCombatChangeSkillId = function(oldAbilityId, newAbilityId)
{
	var combatBlocks = EsoBuildCombatGetCombatBlocks();
	
	combatBlocks.each(function() {
		var $this = $(this);
		var combatId = $this.attr("combatid");
		var action = g_EsoBuildCombatPlayerActions[combatId];
		
		if (action.abilityId != oldAbilityId) return true;
		
		var skillData = g_SkillsData[newAbilityId];
		if (skillData == null) return true;
		
		action.skillData = skillData;
		action.abilityId = newAbilityId;
		
		EsoBuildCombatSetSlotSkill($this, action);
		
		return true
	});
	
}


window.UpdateEsoInitialCombatActionsData = function() 
{
	var hasResetOriginal = false;
	var lastName = null;
	
	if (g_EsoBuildInitialCombatActions == null) return;
	
	for (var rotationName in g_EsoBuildInitialCombatActions)
	{
		var actions = g_EsoBuildInitialCombatActions[rotationName];
		
		if (!hasResetOriginal) 
		{
			g_EsoBuildCombatPlayerRotations = {};
			hasResetOriginal = true;
		}
		
		var allActions = actions.split(",");
		var newRotation = {};
		g_EsoBuildCombatPlayerActions = newRotation;
		
		for (var i = 0; i < allActions.length; ++i)
		{
			var action = allActions[i];
			var newAction = EsoBuildCombatCreateNewCombatAction();
			
			newAction.abilityId = parseInt(action);
			newAction.skillData = g_SkillsData[newAction.abilityId];
			
			var allData = action.split(/[\(\)]/);
			if (allData[1] != null) newAction.actionData = allData[1];
			
			newRotation[newAction.combatId] = newAction;
		}
		
		g_EsoBuildCombatPlayerRotations[rotationName] = newRotation;
		lastName = rotationName;
	}
	
	if (lastName)
	{
		EsoBuildCombatDisplayRotation(lastName);
	}
}


window.EsoBuildCombatCountTargetBleeds = function()
{
	var count = 0;
	
	for (var id in g_EsoBuildCombatState.dots)
	{
		var dot = g_EsoBuildCombatState.dots[id];
		if (dot.isBleed) ++count;
	}
	
	return count;
}


window.EsoBuildCombatIsTargetBleeding = function()
{
	for (var id in g_EsoBuildCombatState.dots)
	{
		var dot = g_EsoBuildCombatState.dots[id];
		if (dot.isBleed) return true;
	}
	
	return false;
}


window.EsoBuildCombatHasPetActive = function()
{
	return (g_EsoBuildCombatState.pets.length > 0);
}


window.EsoBuildCombatHasTargetPoisonEffect = function()
{
	for (var id in g_EsoBuildCombatState.dots)
	{
		var dot = g_EsoBuildCombatState.dots[id];
		if (dot.damageType == "Poison") return true;
	}
	
	return false;
}


window.EsoBuildCombatCountTargetDots = function()
{
	var count = 0;
	
	for (var id in g_EsoBuildCombatState.dots)
	{
		++count;
	}
	
	return count;
}


window.EsoBuildCombatIsHealAbility = function(skillData)			//TODO: Better parsing
{
	var desc = GetEsoSkillDescription(skillData.abilityId, null, false, true, false);
	
	var matchResult = desc.match(/for ([0-9]+) Health/i);
	return matchResult;
}


window.EsoBuildCombatIsSkillLineSlotted = function(skillLine)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return false;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillBarData = skillBar[i];
		var skillData = g_SkillsData[skillBarData.origSkillId];
		
		if (skillData == null) continue;
		if (skillData.skillLine == skillLine) return true;
	}
	
	return false;
}


window.EsoBuildCombatCountSkillLineSlotted = function(skillLine)
{
	var count = 0;
	
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return 0;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillBarData = skillBar[i];
		var skillData = g_SkillsData[skillBarData.origSkillId];
		
		if (skillData == null) continue;
		if (skillData.skillLine == skillLine) ++count;
	}
	
	return count;
}


window.EsoBuildCombatIsSkillSlotted = function(skillData)
{
	var skillBar = g_EsoSkillBarData[g_EsoBuildActiveAbilityBar - 1];
	if (skillBar == null) return false;
	
	for (var i = 0; i < skillBar.length; ++i)
	{
		var skillBarData = skillBar[i];
		
		if (skillBarData.skillId == skillData.abilityId) return true;
		if (skillBarData.origSkillId == skillData.abilityId) return true;
		if (skillBarData.skillId == skillData.baseAbilityId) return true;
		if (skillBarData.origSkillId == skillData.baseAbilityId) return true;
	}
	
	return false;
}


window.EsoBuildCombatIsSkillTaunt = function(skillData)
{
	if (skillData.abilityId == ESOBUILD_UNIQUESKILLID_HAFROSTDEST && g_EsoBuildLastInputValues.Skill.EnableFrostTaunt) return true;
	if (!skillData.description) return false;
	var matchResult = skillData.description.match(/and taunting them/i);
	return matchResult != null;
}


window.EsoBuildCombatIsMeleeDamage = function(srcType, srcData, damage, damageType, isDOT, isAOE, isBleed)
{
	if (srcType == "lightattack" || srcType == "heavyattack")
	{
		if (g_EsoBuildCombatState.isWerewolf) return false;
		if (g_EsoBuildCombatState.isOverload) return false;
		
		var mainHandWeapon = g_EsoBuildItemData["MainHand" + g_EsoBuildActiveWeapon];
		if (mainHandWeapon == null) return false;
		if (mainHandWeapon.weaponType == null) return true;		// Unarmed
		
		var weaponType = parseInt(mainHandWeapon.weaponType);
		
		return (weaponType == 1 || weaponType == 2 || weaponType == 3 || weaponType == 4 || weaponType == 5 || weaponType == 6 || weaponType == 11);
	}
	
	if (srcType != "skill") return false;
	
	if (isDOT) return false;
	
	if (srcData.skillLine == null || srcData.skillType == null) return false;
	if (srcData.maxRange == null | srcData.radius == null) return false;
	if (srcData.mechanic == null) return false;
	if (srcData.mechanic != 6) return false;
	
	var skillType = parseInt(srcData.skillType)
	if (skillType != 1 && skillType != 2) return false;
	
	var range = parseInt(srcData.maxRange);
	if (range == 0) range = parseInt(srcData.radius);
	
	return range <= ESOBUILDCOMBAT_MAXMELEE_RANGE;
}


window.EsoBuildCombatDoesElementMatchFilter = function(element)
{
	if (g_EsoBuildCombatFilterText == "") return true;
	return EsoBuildCombatDoesTextMatchFilter(element.text());
}


window.EsoBuildCombatDoesTextMatchFilter = function(text)
{
	if (g_EsoBuildCombatFilterText == "") return true;
	
	var index = text.toLowerCase().indexOf(g_EsoBuildCombatFilterText);
	if (index >= 0) return true;
	
	return false;
}


window.OnEsoBuildCombatFilter = function()
{
	var elements = $("#esotbCombatLog p");
	g_EsoBuildCombatFilterText = $("#esotbCombatFilterText").val().toLowerCase();
	
	elements.each(function() {
		var $this = $(this);
		
		if (EsoBuildCombatDoesElementMatchFilter($this))
			$this.show();
		else
			$this.hide();
	});
	
}


window.OnEsoClickCombatTab = function()
{
	var tabId = $(this).attr("tabid");
	if (tabId == null || tabId == "") return;
	
	$(".esotbCombatTabSelected").removeClass("esotbCombatTabSelected");
	$(this).addClass("esotbCombatTabSelected");
	
	$(".esotbCombatTabBlock:visible").hide();
	$("#" + tabId).show();
	
}


window.EsoBuildCombatGetOptions = function() 
{
	g_EsoBuildCombatOptions.useLAWeaving = $("#esotbCombatOptionUseLAWeaving").prop("checked");
	g_EsoBuildCombatOptions.stayInOverload = $("#esotbCombatOptionStayInOverload").prop("checked");
	g_EsoBuildCombatOptions.startWithFullUltimate = $("#esotbCombatOptionStartWithFullUltimate").prop("checked");
	
	g_EsoBuildCombatOptions.log.showDamageDetails = $("#esotbCombatOptionShowDamageDetails").prop("checked");
	g_EsoBuildCombatOptions.log.showBuffs = $("#esotbCombatOptionShowBuffs").prop("checked");
	g_EsoBuildCombatOptions.log.showSkillCast = $("#esotbCombatOptionShowSkillCast").prop("checked");
	g_EsoBuildCombatOptions.log.showToggles = $("#esotbCombatOptionShowToggles").prop("checked");
	g_EsoBuildCombatOptions.log.showStatusEffects = $("#esotbCombatOptionShowStatusEffects").prop("checked");
	g_EsoBuildCombatOptions.log.showRegen = $("#esotbCombatOptionShowRegen").prop("checked");
	g_EsoBuildCombatOptions.log.showRestore = $("#esotbCombatOptionShowRestore").prop("checked");
	g_EsoBuildCombatOptions.log.showBarSwaps = $("#esotbCombatOptionShowBarSwaps").prop("checked");
	g_EsoBuildCombatOptions.log.showRolls = $("#esotbCombatOptionShowRollDodge").prop("checked");
}


window.esotbOnDocReadyCombat = function ()
{
	EsoBuildCombatMergeUniqueSkills();
	
	$("#esotbCombatUniqueSkills").cleanWhitespace();
	
	$(".esovsCombatSkillIcon").droppable({ 
		drop: OnCombatIconDrop, 
		accept: OnCombatIconDroppableAccept,
		out: OnCombatIconDroppableOut,
		over: function(event, ui) { setTimeout(OnCombatIconDroppableOver.bind(this, event, ui), 0); },
	});
	
	$(".esotbCombatAddSlot").click(OnEsoBuildCombatAddSlot).droppable({ 
		drop: OnCombatBlockDrop, 
		accept: OnCombatBlockAddSlotDroppableAccept,
		out: OnCombatBlockDroppableOut,
		over: function(event, ui) { setTimeout(OnCombatBlockDroppableOver.bind(this, event, ui), 0); }
	});
	
	$("#esotbCombatFilterButton").click(OnEsoBuildCombatFilter);
	$(".esotbCombatTab").click(OnEsoClickCombatTab);
	
	UpdateEsoInitialCombatActionsData();
	
	CopyEsoSkillsToCombatTab();
	
	if (window.location.host == "content3.uesp.net") 
	{
		$("#esotbItemPoison1").show();
		$("#esotbItemPoison2").show();
		$("#esotbStatTabCombat").show();
	}
}


$( document ).ready(esotbOnDocReadyCombat);
