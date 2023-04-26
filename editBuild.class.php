<?php

/*
 * TODO:
 * 		- Destruction Mastery set...confirm magicka bonus.
 *  	- Spell range modification.
 *  	- Resurrect time computed stat.
 *  	- Damage done in stealth.
 *  	- World in Ruin: Increases the damage of Flame and Poison area of effect abilities by 6%.
 *  	- Nightblade - Pressure Points (scales from Assassination slotted)
 *  	- Nightblade - Shadow: Dark Vigor (scales from Shadow slotted)
 *  	- Nightblade - Siphoning: Soul Siphoner (scales from Siphoning abilities slotted)
 *  	- Sorcerer - Storm Calling: Expert Mage (scales from Storm abilities slotted)
 *  	- Adjust all Durations in tooltips?
 *  	- Increases healing with Restoration Staff spells by 5%
 *  	- Overall "X damage taken" type state (Flame damage for vampires).
 *  	- Quick Item Setup: Nirnhoned items that don't exist?
 *  	- Swift Warrior melee attack for class abilities.
 *  	- Status effect damage 
 */

require_once("/home/uesp/secrets/esolog.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/esolog.static/viewCps.class.php");
require_once("/home/uesp/esolog.static/viewSkills.class.php");
require_once(__DIR__."/viewBuildData.class.php");
//require_once("/home/uesp/www/esomap/UespMemcachedSession.php");


class EsoBuildDataEditor 
{
	public $PTS_VERSION = "38pts";	//TODO: Remove?
	
	public $LOAD_RULES_FROM_DB = true;
	public $LIVE_RULES_VERSION = "37";
	public $PTS_RULES_VERSION  = "38pts";
	
	public $SESSION_DEBUG_FILENAME = "/var/log/httpd/esoeditbuild_sessions.log";
	
	public $TEMPLATE_FILE = "";
	
		/* Set to false when update 21 goes live */
	public $REMOVE_NEW_UPDATE21_RACIALS = false;
	
	public $db = null;
	public $htmlTemplate = "";
	public $version = "";
	
	public $viewCps = null;
	public $viewSkills = null;
	
	public $buildDataViewer = null;
	
	public $buildId = null;
	
	public $loadSetNames = false;
	public $setNames = array();
	
	public $errorMessages = array();
	
	public $initialItemData = array();
	public $initialEnchantData = array();
	public $initialSetMaxData = array();
	public $initialBuffData = array();
	public $initialCPData = array();
	public $initialSkillData = array();
	public $initialPassiveSkillData = array();
	public $initialActiveSkillData = array();
	public $initialSkillBarData = array();
	public $initialToggleSkillData = array();
	public $initialToggleSetData = array();
	public $initialToggleCpData = array();
	public $initialCombatActionsData = array();
	
	public $buildRules = [];
	public $buildRuleEffects = [];
	public $buildComputedStats = [];
	public $ruleVersions = [];
	
	public $transformItemData = false; 
	
	public $wikiContext = null;
	
	public $ITEM_TABLE_SUFFIX = "";
	
	
		// This controls the order of categories when output
	public $COMPUTED_STAT_CATEGORIES_OUTPUT = [
			"basic" => "Basic Stats",
			"elementresist" => "Elemental Resistances",
			"healing" => "Healing",
			"statrestore" => "Stat Restoration",
			"movement" => "Movement",
			"combat" => "Bash / Block / Dodge / Break Free / Fear",
			"damageshield" => "Damage Shield",
			"damagetaken" => "Damage Taken",
			"damagedone" => "Damage Done",
			"harestore" => "Heavy Attack Restoration",
			"statuseffect" => "Status Effects",
			"lightattack" => "Light Attacks",
			"heavyattack" => "Heavy Attacks",
			"mitigation" => "Mitigation",
			"abilitycost" => "Ability Costs",
			"trait" => "Traits",
			"other" => "Other",
			// Categories not listed above will be shown at the bottom of the list
	];
	
	public $GEARSLOT_BASEICONS = array(
			"Head" 		=> "//esobuilds.uesp.net/resources/gearslot_head.png",
			"Shoulders" => "//esobuilds.uesp.net/resources/gearslot_shoulders.png",
			"Chest" 	=> "//esobuilds.uesp.net/resources/gearslot_chest.png",
			"Hands" 	=> "//esobuilds.uesp.net/resources/gearslot_hands.png",
			"Waist" 	=> "//esobuilds.uesp.net/resources/gearslot_belt.png",
			"Legs" 		=> "//esobuilds.uesp.net/resources/gearslot_legs.png",
			"Feet" 		=> "//esobuilds.uesp.net/resources/gearslot_feet.png",
			"Neck"		=> "//esobuilds.uesp.net/resources/gearslot_neck.png",
			"Ring1"		=> "//esobuilds.uesp.net/resources/gearslot_ring.png",
			"Ring2"		=> "//esobuilds.uesp.net/resources/gearslot_ring.png",
			"MainHand1" => "//esobuilds.uesp.net/resources/gearslot_mainhand.png",
			"MainHand2" => "//esobuilds.uesp.net/resources/gearslot_mainhand.png",
			"OffHand1" 	=> "//esobuilds.uesp.net/resources/gearslot_offhand.png",
			"OffHand2" 	=> "//esobuilds.uesp.net/resources/gearslot_offhand.png",
			"Poison1" 	=> "//esobuilds.uesp.net/resources/gearslot_poison.png",
			"Poison2"	=> "//esobuilds.uesp.net/resources/gearslot_poison.png",
			"Food"		=> "//esobuilds.uesp.net/resources/gearslot_quickslot.png",
			"Potion"	=> "//esobuilds.uesp.net/resources/gearslot_quickslot.png",
	);
	
	public $STATS_UNIQUE_LIST = array(
			"Skill.EnableFrostTaunt",
			"Set.CompanionSkillCooldown",
			"Item.Divines",
			"Item.Bloodthirsty",
			"Item.Sturdy",
			//"Item.Prosperous",
			"Item.Training",
			"Item.MaelstromDamage",
			"ArmorLight",
			"ArmorMedium",
			"ArmorHeavy",
			"ArmorTypes",
			"WeaponDagger",
			"WeaponSword",
			"WeaponMace",
			"WeaponAxe",
			"WeaponBow",
			"Weapon1H",
			"Weapon2H",
			"WeaponPower",
			"UsePtsRules",
			"WeaponRestStaff",
			"WeaponDestStaff",
			"WeaponFlameStaff",
			"WeaponFrostStaff",
			"WeaponShockStaff",
			"Weapon1HShield",
			"WeaponOffHandDamage",
			"WeaponOffHandDagger",
			"WeaponOffHandSword",
			"WeaponOffHandMace",
			"WeaponOffHandAxe",
			"WeaponOffHandBow",
			"WeaponOffHand1H",
			"WeaponOffHand2H",
			"WeaponOffHandRestStaff",
			"WeaponOffHandDestStaff",
			"WeaponOffHandFlameStaff",
			"WeaponOffHandFrostStaff",
			"WeaponOffHandShockStaff",
			"WeaponOffHand1HShield",
			"Level",
			"CPLevel",
			"EffectiveLevel",
			"CP.TotalPoints",
			"CP.UsedPoints",
			"CP.HealingReduction",
			"CP.Enabled",
			"Attribute.TotalPoints",
			"Attribute.Health",
			"Attribute.Magicka",
			"Attribute.Stamina",
			"Mundus.Name",
			"Mundus.Name2",
			"Race",
			"Class",
			"Target.PercentHealth",
			"Target.SpellResist",
			"Target.PhysicalResist",
			"Target.PhysicalResistPctReduce",
			"Target.PenetrationFactor",
			"Target.PenetrationFlat",
			"Target.DefenseBonus",
			"Target.AttackBonus",
			"Target.CritDamage",
			"Target.CritChance",
			"Target.CritResistFactor",
			"Target.HealingReceived",
			"Target.HealingReduction",
			"Target.DamageTaken",
			"Target.SpellDebuff",
			"Target.PhysicalDebuff",
			"Target.EffectiveLevel",
			"Misc.SpellCost",
			"VampireStage",
			"WerewolfStage",
			"SkillCost.Runemend_Cost",
			"SkillCost.Simmering_Frenzy_Cost",
			"SkillCost.Crystal_Fragments_Cost",
			"SkillDamage.Crystal Fragments",
			"SkillCost.Regular_Ability_Cost",
			"SkillCost.Ardent_Flame_Cost",
			"SkillCost.Draconic_Power_Cost",
			"SkillCost.Earthern_Heart_Cost",
			"SkillCost.Assassination_Cost",
			"SkillCost.Blood_Scion_Cost",
			"SkillCost.Bone_Goliath_Transformation_Cost",
			"SkillCost.Shadow_Cost",
			"SkillCost.Siphoning_Cost",
			"SkillCost.Daedric_Summoning_Cost",
			"SkillCost.Dark_Magic_Cost",
			"SkillCost.Storm_Calling_Cost",
			"SkillCost.Aedric_Spear_Cost",
			"SkillCost.Dawns_Wrath_Cost",
			"SkillCost.Restoring_Light_Cost",
			"SkillCost.Two_Handed_Cost",
			"SkillCost.One_Hand_and_Shield_Cost",
			"SkillCost.Dual_Wield_Cost",
			"SkillCost.Bow_Cost",
			"SkillCost.Destruction_Staff_Cost",
			"SkillCost.Restoration_Staff_Cost",
			"SkillCost.Vampire_Cost",
			"SkillCost.Werewolf_Cost",
			"SkillCost.Werewolf_Transformation_Cost",
			"SkillCost.Fighters_Guild_Cost",
			"SkillCost.Mages_Guild_Cost",
			"SkillCost.Undaunted_Cost",
			"SkillCost.Assault_Cost",
			"SkillCost.Support_Cost",
			"SkillCost.Fighters_Guild_Cost",
			"SkillCost.Psijic_Order_Cost",
			"SkillCost.Blastbones_Cost",
			"SkillCost.Blighted_Blastbones_Cost",
			"SkillCost.Stalking_Blastbones_Cost",
			"SkillCost.Skeletal_Mage_Cost",
			"SkillCost.Spirit_Mender_Cost",
			"SkillCost.Undaunted_Cost",
			"Stealthed",
			"Skill.HAMagRestoreRestStaff",
			"Skill.HAStaRestoreWerewolf",
			"SkillDuration.Placeholder",
			"SkillDamage.Placeholder",
			"SkillDamage.Runeblades",
			"SkillFlatDamage.Placeholder",
			"SkillWeaponDamage.Placeholder",
			"SkillSpellDamage.Placeholder",
			"SkillLineDamage.Placeholder",
			"SkillLineDamage.Bow",
			"SkillLineDamage.Dual_Wield",
			"SkillHealing.Placeholder",
			"SkillLineWeaponDmg.base",
			"SkillLineSpellDmg.base",
			"SkillBonusWeaponDmg.base",
			"SkillBonusSpellDmg.base",
			"SkillDirectDamage.Placeholder",
			"SkillDotDamage.Placeholder",
			"Item.ChannelSpellDamage",
			"Item.ChannelWeaponDamage",
			"Buff.Empower",
			"CP.HAActiveDamage",
			"CP.LAActiveDamage",
			"Cyrodiil",
			"DrinkBuff",
			"FoodBuff",
			"Skill.VampireStage",
			"MountSpeedBonus",
			"BaseWalkSpeed",
			"Skill.NormalSneakSpeed",
			"CP.TargetRecovery",
			"CP.InspirationGained",
			"Skill.DestructionPenetration",
			"EnchantPotencyMainHand1",
			"EnchantCooldownMainHand1",
			"EnchantPotencyMainHand2",
			"EnchantCooldownMainHand2",
			"EnchantPotencyOffHand1",
			"EnchantCooldownOffHand1",
			"EnchantPotencyOffHand2",
			"EnchantCooldownOffHand2",
			"Item.EnchantCooldown",
			"Set.ClassSpellDamage",
			"Set.ClassWeaponDamage",
			"Item.SynergyBonus",
			"BuildDescription",
			"Skill.PoisonStaminaCost",
			"Skill.FlameAOEDamageDone",
			"Skill.RestorationExperience",
			"Skill.TwoHandedExperience",
			"Skill.BowExperience",
			"Skill.DestructionExperience",
			"Skill.OneHandandShieldExperience",
			"Skill.LightArmorExperience",
			"Skill.MediumArmorExperience",
			"Skill.HeavyArmorExperience",
			"Skill.DualWieldExperience",
			"Skill.AlliancePointsGained",
			"Skill.ExperienceGained",
			"Skill.InspirationGained",
			"Skill.PickPocketChance",
			"Skill.LavaDamage",
			"Set.PlayerDamageTaken",
			"Set.PlayerAOEDamageTaken",
			"Set.SiegeDamageTaken",
			"Skill.SiegeDamage",
			"Skill.UltimateRegen",
			"Set.TrapDamageTaken",
			"Buff.DungeonDamageTaken",
			"Skill.RangedDamageTaken",
			"Skill.BlockRangedDamageTaken",
			"Buff.Vulnerability",
			"Buff.FlameVulnerability",
			"Buff.PoisonVulnerability",
			"Target.Vulnerability",
			"Target.FlameVulnerability",
			"Target.PoisonVulnerability",
			"Set.ElfBaneDuration",
			"Skill.DiseaseImmunity",
			"Skill.BurningImmunity",
			"Skill.ChilledImmunity",
			"Skill.PoisonImmunity",
			"Skill.BurningDamage",
			"Skill.PoisonedDamage",
			"Skill.StatusEffectChance",
			"Skill.BurningChance",
			"Skill.ChilledChance",
			"Skill.ConcussionChance",
			"Item.StatusEffectChance",
			"CP.WeaponCritHealing",
			"CP.SpellCritHealing",
			"Set.TwinSlashInitialDamage",
			"Set.GuardDamage",
			"Set.PoisonDuration",
			"Set.MagickaAbilityDamageDone",
			"Set.HealingAbilityCost",
			"Set.PhysicalDotDamageDone",
			"Set.PoisonDotDamageDone",
			"Set.DiseaseDotDamageDone",
			"Set.BleedDotDamageDone",
			"Set.PhysicalChannelDamageDone",
			"Set.PoisonChannelDamageDone",
			"Set.DiseaseChannelDamageDone",
			"Set.BleedChannelDamageDone",
			"Set.HealthRegenResistFactor",
			"Set.RangedDamageTaken",
			"Skill.HealCrit",
			"Skill2.LASpellDamage",
			"Skill2.HASpellDamage",
			"SkillBonusSpellDmg.Flame",
			"SkillBonusSpellDmg.Shock",
			"SkillBonusSpellDmg.Frost",
			"SkillBonusSpellDmg.Magic",
			"SkillBonusSpellDmg.Bleed",
			"SkillBonusSpellDmg.Physical",
			"SkillBonusSpellDmg.Poison",
			"SkillBonusSpellDmg.Disease",
			"SkillBonusWeaponDmg.Physical",
			"SkillBonusWeaponDmg.Poison",
			"SkillBonusWeaponDmg.Disease",
			"SkillBonusWeaponDmg.Bleed",
			"SkillBonusWeaponDmg.Flame",
			"SkillBonusWeaponDmg.Magic",
			"SkillBonusWeaponDmg.Shock",
			"SkillBonusWeaponDmg.Frost",
			"Set.ExtraBashDamage",
			"Item.ExtraBashDamage",
			"Skill.ExtraBashDamage",
			"Set.VampireLord",
			"Set.BuffDuration",
			"Skill.BlockSpeedPenalty",
			"Skill.HeavyAttackSpeed",
			"Set.FlameCritDamageTaken",
			"Set.ShockCritDamageTaken",
			"Set.FrostCritDamageTaken",
			"Set.NonWeaponAbilityCost",
			"Set.AOESpellDamage",
			"Set.AOEWeaponDamage",
			"CP.HealingSpellDamage",
			"CP.HealingWeaponDamage",
			"Set.DOTSpellDamage",
			"Set.DOTWeaponDamage",
			"Set.RangedSpellDamage",
			"Set.RangedWeaponDamage",
			"Set.MeleeSpellDamage",
			"Set.MeleeWeaponDamage",
			"Set.WeaponTraitEffect",
			"Set.DirectSpellDamage",
			"Set.DirectWeaponDamage",
			"Set.DirectRangeSpellDamage",
			"Set.DirectRangeWeaponDamage",
			"ThreeSetCount",
			"Set.EnemyTargetSpellDamage",
			"Set.EnemyTargetWeaponDamage",
			"Set.CorelRiptide",
			"Set.MorasWhispers",
			"Set.PearlescentWard",
	);
	
	
	public $STATS_TYPE_LIST = array(
			"Item",
			"Set",
			"Skill",
			"Skill2",
			"Buff",
			"Food",
			"CP",
			"Mundus",
			"Target",
			"Vampire",
	);
	
	
	public $STATS_BASE_LIST = array(
			"Health",
			"Magicka",
			"Stamina",
			"HealthRegen",
			"MagickaRegen",
			"StaminaRegen",
			"HealthRestore",
			"MagickaRestore",
			"StaminaRestore",
			"UltimateRestore",
			"WeaponDamage",
			"SpellDamage",
			"WeaponCrit",
			"SpellCrit",
			"CritDamage",
			"CritDamageTaken",
			"SpellCritDamage",
			"WeaponCritDamage",
			"SpellResist",
			"PhysicalResist",
			"FlameResist",
			"FrostResist",
			"ShockResist",
			"PoisonResist",
			"DiseaseResist",
			"CritResist",
			"SpellPenetration",
			"PhysicalPenetration",
			"HealingDone",
			"HealingTaken",
			"HealingReceived",
			"HealingTotal",
			"HealingReduction",
			"BashCost",
			"BashWeaponDamage",
			"BashSpellDamage",
			"BashDamage",
			"BlockCost",
			"BlockMitigation",
			"BlockMeleeMitigation",
			"RollDodgeCost",
			"FlatRollDodgeCost",
			"RollDodgeDuration",
			"SprintCost",
			"SprintSpeed",
			"MovementSpeed",
			"MountSpeed",
			"SwimSpeed",
			"BlockSpeed",
			"SneakSpeed",
			"SneakCost",
			"BreakFreeCost",
			"BreakFreeDuration",
			"Constitution",
			"DamageShield",
			"DotDamageDone",
			"ChannelDamageDone",
			"DirectDamageDone",
			"MagicDamageDone",
			"PhysicalDamageDone",
			"ShockDamageDone",
			"FlameDamageDone",
			"FrostDamageDone",
			"PoisonDamageDone",
			"DiseaseDamageDone",
			"PetDamageDone",
			"HADamageTaken",
			"LADamageTaken",
			"DotDamageTaken",
			"AOEDamageTaken",
			"PlayerDamageTaken",
			"PlayerAOEDamageTaken",
			"RangedDamageTaken",
			"MagicDamageTaken",
			"PhysicalDamageTaken",
			"ShockDamageTaken",
			"FlameDamageTaken",
			"FrostDamageTaken",
			"PoisonDamageTaken",
			"BleedDamageTaken",
			"DiseaseDamageTaken",
			"DirectDamageTaken",
			"HADamage",
			"LADamage",
			"HAMeleeDamage",
			"LAMeleeDamage",
			"HAWeaponDamage",
			"HABowDamage",
			"HAStaffDamage",
			"LAWeaponDamage",
			"LABowDamage",
			"LAStaffDamage",
			"LASpeed",
			"LAMeleeSpeed",
			"ShieldDamageDone",
			"FearDuration",
			"SnareDuration",
			"SnareEffect",
			"HealthCost",
			"MagickaCost",
			"StaminaCost",
			"UltimateCost",
			"PotionDuration",
			"PotionCooldown",
			"AttackSpeed",
			"TrapResist",
			"PlayerDamageTaken",
			"NegativeEffectDuration",
			"DisableEffectDuration",
			"BowRange",
			"FlameEffectDuration",
			"BowDamageDone",
			"ResurrectSpeed",
			"BossDamageResist",
			"SneakRange",
			"SneakDetectRange",
			"TwiceBornStar",
			"HAChargeTime",
			"DodgeChance",
			"DamageTaken",
			"DamageDone",
			"StunDuration",
			"DisorientDuration",
			"WerewolfTransformCost",
			"EnchantCooldown",
			"EnchantPotency",
			"MountSpeed",
			"HAMagRestore",
			"HAStaRestore",
			"BossDamageDone",
			"BossDamageTaken",
			"BleedDamageDone",
			"CritHealing",
			"OverloadDamage",
			"MartialStatusEffectChance",
			"MagicalStatusEffectChance",
			"StatusEffectDuration",
			"StatusEffectDamage",
			"FallDamageTaken",
			"SingleTargetDamageTaken",
			"SingleTargetHealingDone",
			"GoldGained",
			"MerchantSellCost",
			"FenceSellCost",
			"InspirationGained",
			"HarvestSpeed",
			"StatusEffectDurationTaken",
			"RepairArmorCost",
			"DoubleHarvestChance",
			"FoodDuration",
			"DrinkDuration",
			"DamageShieldCost",
			"AOEHealingDone",
			"DotHealingDone",
			"AOEDamageDone",
			"AOEDamageTaken",
			"WayshrineCost",
			"SingleTargetDamageDone",
			"Set.BahseiMania",
	);
	
	
	public $MUNDUS_TYPES = array(
			"The Apprentice" 	=> "Spell Damage",
			"The Atronach" 		=> "Magicka Recovery",
			"The Lady" 			=> "Resistance",
			"The Lover" 		=> "Penetration",
			"The Lord" 			=> "Health",
			"The Mage" 			=> "Magicka",
			"The Ritual" 		=> "Healing",
			"The Serpent" 		=> "Stamina Recovery",
			"The Shadow" 		=> "Crit Damage/Healing",
			"The Steed" 		=> "Health Recovery/Movement Speed",
			"The Thief" 		=> "Crit Chance",
			"The Tower" 		=> "Stamina",
			"The Warrior" 		=> "Weapon Damage",
	);
	
	
	public $ALLIANCE_TYPES = array(
			"Aldmeri Dominion",
			"Ebonheart Pact",
			"Daggerfall Covenant",
	);
	
	
	public $EQUIPSLOT_TO_SLOTID = array(
			0 => "Head",
			3 => "Shoulders",
			2 => "Chest",
			16 => "Hands",
			6 => "Waist",
			8 => "Legs",
			9 => "Feet",
			1 => "Neck",
			11 => "Ring1",
			12 => "Ring2",
			4 => "MainHand1",
			5 => "OffHand1",
			13 => "Poison1",
			20 => "MainHand2",
			21 => "OffHand2",
			14 => "Poison2",
	);
	
	
	public $SLOTID_TO_EQUIPSLOT = array(
			"Head" => 0,
			"Shoulders" => 3,
			"Chest" => 2,
			"Hands" => 16,
			"Waist" => 6,
			"Legs" => 8,
			"Feet" => 9,
			"Neck" => 1,
			"Ring1" => 11,
			"Ring2" => 12,
			"MainHand1" => 4,
			"OffHand1" => 5,
			"Poison1" => 13,
			"MainHand2" => 20,
			"OffHand2" => 21,
			"Poison2" => 14,
	);
	
	
	public $RACE_TYPES = array(
			"Argonian" => "",
			"Breton" => "",
			"Dark Elf" => "Dunmer",
			"High Elf" => "Altmer",
			"Imperial" => "",
			"Khajiit" => "",
			"Nord" => "",
			"Orc" => "Orsimer",
			"Redguard" => "",
			"Wood Elf" => "Bosmer",
	);
	
	
	public $CLASS_TYPES = array(
			"Arcanist",
			"Dragonknight",
			"Necromancer",
			"Nightblade",
			"Sorcerer",
			"Templar",
			"Warden",
	);
	
	
	public $VAMPIRESTAGE_TYPES = array(
			0 => "none",
			1 => "Stage 1",
			2 => "Stage 2",
			3 => "Stage 3",
			4 => "Stage 4",
	);
	
	
	public $WEREWOLFSTAGE_TYPES = array(
			0 => "none",
			1 => "Werewolf in Human Form",
			2 => "Werewolf Form",
	);
	
	
	public $INPUT_STATS_LIST = array();
	
	
	public $INPUT_STAT_DETAILS = array(
			"Level" => array(
					"desc" => "1-50",
			),
			
			"EffectiveLevel" => array(
					"desc" => "1-66",
			),
			
			"Item.Divines" => array(
					"display" => "%",
			),
			
			"Item.Training" => array(
					"display" => "%",
			),
			
			"Item.Prosperous" => array(
					"display" => "%",
			),
			
			"Item.Sturdy" => array(
					"display" => "%",
			),
			
			"Skill.Health" => array(
					"display" => "%",
			),
			
			"Buff.Health" => array(
					"display" => "%",
			),
			
			"Skill.DestructionPenetration" => array(
					"display" => "%",
			),
			
			"Skill.Magicka" => array(
					"display" => "%",
			),
			
			"CP.HealingReduction" => array(
					"display" => "%",
			),
			
			"Buff.Magicka" => array(
					"display" => "%",
			),
			
			"Skill.Stamina" => array(
					"display" => "%",
			),
				
			"Buff.Stamina" => array(
					"display" => "%",
			),
			
			"Skill.HealthRegen" => array(
					"display" => "%",
			),
			
			"Vampire.HealthRegen" => array(
					"display" => "%",
			),
			
			"Skill.BashCost" => array(
					"display" => "%",
			),
			
			"Skill2.HealthRegen" => array(
					"display" => "%",
			),
			
			"Buff.HealthRegen" => array(
					"display" => "%",
			),
			
			"Skill.MagickaRegen" => array(
					"display" => "%",
			),
			
			"Buff.MagickaRegen" => array(
					"display" => "%",
			),
			
			"Set.BashCost" => array(
					"display" => "%",
			),
			
			"Set.BlockCost" => array(
					"display" => "%",
			),
			
			"Skill.StaminaRegen" => array(
					"display" => "%",
			),
			
			"Buff.StaminaRegen" => array(
					"display" => "%",
			),
			
			"Buff.SpellDamage" => array(
					"display" => "%",
			),
			
			"Buff.WeaponDamage" => array(
					"display" => "%",
			),
			
			"Skill.BowDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.CritDamage" => array(
					"display" => "%",
			),
			
			"Mundus.CritDamage" => array(
					"display" => "%",
			),
			
			"Skill.CritDamage" => array(
					"display" => "%",
			),
			
			"Item.SynergyBonus" => array(
					"display" => "%",
			),
			
			"SkillCost.Regular_Ability_Cost" => array(
					"display" => "%",
			),
			
			"SkillDamage.Crystal Fragments" => array( "display" => "%" ),
			"SkillDamage.Runeblades" => array( "display" => "%" ),
			"SkillDamage.Cleave_AOE" => array( "display" => "%" ),
			"SkillDamage.Scatter_Shot_DOT" => array( "display" => "%" ),
			"SkillCost.Crystal_Fragments_Cost" => array( "display" => "%" ),
			"SkillCost.Runemend_Cost" => array( "display" => "%" ),
			
			"SkillCost.Undaunted_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Mages_Guild" => array(
					"display" => "%",
			),
			
			"SkillCost.Werewolf_Transformation_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Blood_Scion_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Bone_Goliath_Transformation_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Blastbones_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Blighted_Blastbones_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Simmering_Frenzy_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Stalking_Blastbones_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Skeletal_Mage_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Skeletal_Archer_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Skeletal_Arcanist_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Spirit_Mender_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Spirit_Guardian_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Spirit_Intensive_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Destructive_Touch_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Shield_Charge_Cost" => array(
					"display" => "%",
			),			
			
			"SkillCost.Psijic_Order_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Impulse_Cost" => array(
					"display" => "%",
			),
			
			"CP.CritDamage" => array(
					"display" => "%",
			),
			
			"Buff.CritDamage" => array(
					"display" => "%",
			),
			
			"Skill2.CritDamage" => array(
					"display" => "%",
			),
			
			"Item.WeaponCrit" => array(
					"display" => "%",
			),
			
			"EnchantPotencyMainHand1" => array( "display" => "%" ),
			"EnchantPotencyMainHand2" => array( "display" => "%" ),
			"EnchantPotencyOffHand1" => array( "display" => "%" ),
			"EnchantPotencyOffHand2" => array( "display" => "%" ),
			"EnchantCooldownMainHand1" => array( "display" => "%" ),
			"EnchantCooldownMainHand2" => array( "display" => "%" ),
			"EnchantCooldownOffHand1" => array( "display" => "%" ),
			"EnchantCooldownOffHand2" => array( "display" => "%" ),
			"Enchant Potency Infused" => array( "display" => "%" ),
			"Enchant Potency Torug" => array( "display" => "%" ),
			"Enchant Cooldown Infused" => array( "display" => "%" ),
			"Enchant Cooldown Torug" => array( "display" => "%" ),
			"Set.CompanionSkillCooldown"  => array( "display" => "%" ),
			
			"Set.EnchantCooldown" => array(
					"display" => "%",
			),
			
			"Buff.MagickaCost" => array(
					"display" => "%",
			),
			
			"Buff.StaminaRegen" => array(
					"display" => "%",
			),
			
			"Skill.WeaponCrit" => array(
					"display" => "%",
			),

			"Item.SpellCrit" => array(
					"display" => "%",
			),
				
			"Mundus.SpellCrit" => array(
					"display" => "flatcrit",
			),
				
			"Skill.SpellCrit" => array(
					"display" => "%",
			),
			
			"Skill.AOEDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.HealCrit" => array(
					"display" => "%",
			),
			
			"Skill.PoisonStaminaCost" => array(
					"display" => "%",
			),
			
			"Skill.FlameAOEDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.AOEHealingDone" => array(
					"display" => "%",
			),
			
			"CP.AOEHealingDone" => array(
					"display" => "%",
			),
			
			"Skill.AOEDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.AOEDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.SingleTargetDamageDone" => array(
					"display" => "%",
			),
			
			"CP.SingleTargetDamageDone" => array(
					"display" => "%",
			),
			
			"CP.SpellCrit" => array(
					"display" => "flatcrit",
			),
			
			"CP.HABowDamage" => array(
					"display" => "%",
			),
			
			"CP.HAWeaponDamage" => array(
					"display" => "%",
			),
			
			"CP.HAStaffDamage" => array(
					"display" => "%",
			),
			
			"Mundus.HealingDone" => array(
					"display" => "%",
			),
			
			"Item.HealingDone" => array(
					"display" => "%",
			),
			
			"CP.DotDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.DotDamageDone" => array(
					"display" => "%",
			),
			
			"Set.DotDamageDone" => array(
					"display" => "%",
			),
			
			"Set.ChannelDamageDone" => array(
					"display" => "%",
			),
			
			"Buff.HealingTaken" => array(
					"display" => "%",
			),
			
			"CP.HealingTaken" => array(
					"display" => "%",
			),
			
			"CP.DirectDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.DirectDamageDone" => array(
					"display" => "%",
			),
			
			"CP.HealthRegen" => array(
					"display" => "%",
			),
			
			"CP.MagickaRegen" => array(
					"display" => "%",
			),
			
			"CP.StaminaRegen" => array(
					"display" => "%",
			),
			
			"CP.SpellCritDamage" => array(
					"display" => "%",
			),
			
			"CP.WeaponCritDamage" => array(
					"display" => "%",
			),
			
			"Mundus.WeaponCrit" => array(
					"display" => "flatcrit",
			),
				
			"CP.WeaponCrit" => array(
					"display" => "flatcrit",
			),
			
			"CP.PhysicalDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.MagicDamageTaken" => array(
					"display" => "%",
			),
			
			"MagicDamageTaken" => array(
					"display" => "%",
			),
			
			"PhysicalDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.MagicDamageDone" => array(
					"display" => "%",
			),
			
			"CP.StaminaDamageDone" => array(
					"display" => "%",
			),
			
			"CP.MagickaCost" => array(
					"display" => "%",
			),		
			
			"Set.MagickaCost" => array(
					"display" => "%",
			),
			
			"Skill.MagickaCost" => array(
					"display" => "%",
			),
			
			"Skill.HealthCost" => array(
					"display" => "%",
			),
			
			"Set.HealthCost" => array(
					"display" => "%",
			),
			
			"CP.StaminaCost" => array(
					"display" => "%",
			),
			
			"Set.StaminaCost" => array(
					"display" => "%",
			),
			
			"Set.UltimateCost" => array(
					"display" => "%",
			),
			
			"DefenseSpellMitigation" => array(
					"display" => "%",
			),					
			
			"DefensePhysicalMitigation" => array(
					"display" => "%",
			),
			
			"Skill.UltimateCost" => array(
					"display" => "%",
			),
				
			"Skill.StaminaCost" => array(
					"display" => "%",
			),
			
			"Skill.SneakRange" => array(
					"display" => "%",
			),
			
			"Target.HealingReceived" => array(
					"display" => "%",
			),
			
			"Target.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Target.LADamageTaken" => array(
					"display" => "%",
			),
			
			"Target.HealingReduction" => array(
					"display" => "%",
			),
			
			"Item.RollDodgeCost" => array(
					"display" => "%",
			),
			
			"Set.RollDodgeCost" => array(
					"display" => "%",
			),
			
			"Skill.RollDodgeCost" => array(
					"display" => "%",
			),
			
			"Item.SprintCost" => array(
					"display" => "%",
			),
			
			"Skill.SprintCost" => array(
					"display" => "%",
			),
			
			"CP.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Item.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Set.MovementSpeed" => array(
					"display" => "%",
			),
			
			"CP.MountSpeed" => array(
					"display" => "%",
			),
			
			"Skill.SprintSpeed" => array(
					"display" => "%",
			),
			
			"CP.SprintSpeed" => array(
					"display" => "%",
			),
			
			"Set.SprintSpeed" => array(
					"display" => "%",
			),
			
			"Skill.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Skill.MountSpeed" => array(
					"display" => "%",
			),
			
			"Skill.SneakSpeed" => array(
					"display" => "%",
			),
			
			"CP.SneakSpeed" => array(
					"display" => "%",
			),
			
			"Skill2.SneakSpeed" => array(
					"display" => "%",
			),
			
			"Skill.BlockSpeed" => array(
					"display" => "%",
			),
			
			"CP.BlockSpeed" => array(
					"display" => "%",
			),
			
			"Skill.BlockSpeedPenalty" => array(
					"display" => "%",
			),
			
			"Skill.SwimSpeed" => array(
					"display" => "%",
			),
			
			"Mundus.SprintSpeed" => array(
					"display" => "%",
			),			
			
			"Mundus.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Mundus.MountSpeed" => array(
					"display" => "%",
			),
			
			"Skill.SpellDamage" => array(
					"display" => "%",
			),
			
			"Skill.WeaponDamage" => array(
					"display" => "%",
			),
			
			"Skill.SneakCost" => array(
					"display" => "%",
			),
			
			"Skill.HealingReceived" => array(
					"display" => "%",
			),
			
			"Skill2.HealingReceived" => array(
					"display" => "%",
			),
			
			"Buff.SpellDamage" => array(
					"display" => "%",
			),
			
			"Buff.WeaponDamage" => array(
					"display" => "%",
			),		
			
			"Skill.FlameDamageTaken" => array(
					"display" => "%",
			),
			
			"Set.FlameDamageTaken" => array(
					"display" => "%",
			),
			
			"Set.FightsGuildDamageTaken" => array(
					"display" => "%",
			),
			
			"Target.FlameDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill2.SpellPenetration" => array(
					"display" => "%",
			),
			
			"Skill2.PhysicalPenetration" => array(
					"display" => "%",
			),
			
			"Skill.HAChargeTime" => array(
					"display" => "%",
			),
			
			"Skill.HealingDone" => array(
					"display" => "%",
			),
			
			"Skill.HealingTaken" => array(
					"display" => "%",
			),
			
			"Skill.HealingReceived" => array(
					"display" => "%",
			),
			
			"Target.AttackBonus" => array(
					"display" => "%",
			),
			
			"Target.DefenseBonus" => array(
					"display" => "%",
			),
			
			"Target.DamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.DodgeChance" => array(
					"display" => "%",
			),
			
			"Buff.HealingReceived" => array(
					"display" => "%",
			),
			
			"Buff.HealthRegen" => array(
					"display" => "%",
			),
			
			"Buff.MagickaRegen" => array(
					"display" => "%",
			),
			
			"Buff.StaminaRegen" => array(
					"display" => "%",
			),
			
			"Buff.MagicDamageDone" => array(
					"display" => "%",
			),
			
			"Buff.PhysicalDamageDone" => array(
					"display" => "%",
			),
			
			"CP.PhysicalDamageDone" => array(
					"display" => "%",
			),
			
			"Buff.MagicDamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.PhysicalDamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.SprintSpeed" => array(
					"display" => "%",
			),		
			
			"Buff.MovementSpeed" => array(
					"display" => "%",
			),
			
			"Buff.MountSpeed" => array(
					"display" => "%",
			),
			
			"Buff.DamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.HealingReceived" => array(
					"display" => "%",
			),
			
			"Buff.DamageShield" => array(
					"display" => "%",
			),
			
			"Skill.DamageShield" => array(
					"display" => "%",
			),
			
			"Set.DamageShield" => array(
					"display" => "%",
			),
			
			"Buff.DamageDone" => array(
					"display" => "%",
			),
			
			"Set.DamageDone" => array(
					"display" => "%",
			),
			
			"Skill.DamageDone" => array(
					"display" => "%",
			),
			
			"Item.DamageDone" => array(
					"display" => "%",
			),
			
			"Skill2.DamageDone" => array(
					"display" => "%",
			),
			
			"CP.DamageDone" => array(
					"display" => "%",
			),
			
			"Skill.HADamage" => array(
					"display" => "%",
			),
			
			"Skill.HAMeleeDamage" => array(
					"display" => "%",
			),
			
			"Skill.LAMeleeDamage" => array(
					"display" => "%",
			),
			
			"SkillCost.Ardent_Flame_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Draconic_Power_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Earthern_Heart_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Assassination_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Shadow_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Siphoning_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Daedric_Summoning_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Dark_Magic_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Storm_Calling_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Aedric_Spear_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Dawns_Wrath_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Restoring_Light_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Two_Handed_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.One_Hand_and_Shield_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Dual_Wield_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Bow_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Destruction_Staff_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Restoration_Staff_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Panacea_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Vampire_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Bat_Swarm_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Rapid_Fire_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Werewolf_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Fighters_Guild_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Mages_Guild_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Undaunted_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Assault_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Support_Cost" => array(
					"display" => "%",
			),
			
			"Skill.BlockMitigation" => array(
					"display" => "%",
			),
			
			"CP.BlockMitigation" => array(
					"display" => "%",
			),
			
			"CP.DamageShield" => array(
					"display" => "%",
			),
			
			"CP.PhysicalDamage" => array(
					"display" => "%",
			),
			
			"CP.BlockCost" => array(
					"display" => "%",
			),
			
			"Skill.BashCost" => array(
					"display" => "%",
			),			
			
			"CP.BlockCost" => array(
					"display" => "%",
			),
			
			"Skill.HAMagRestore" => array(
					"display" => "%",
			),
			
			"Set.HAMagRestore" => array(
					"display" => "%",
			),
			
			"Skill.HAStaRestore" => array(
					"display" => "%",
			),
			
			"Set.HAStaRestore" => array(
					"display" => "%",
			),
			
			"Buff.HAStaRestore" => array(
					"display" => "%",
			),
			
			"Buff.HAMagRestore" => array(
					"display" => "%",
			),
			
			"CP.HAMagRestore" => array(
					"display" => "%",
			),
				
			"CP.HAStaRestore" => array(
					"display" => "%",
			),
			
			"Skill.HAMagRestoreRestStaff" => array(
					"display" => "%",
			),
			
			"Skill.HAStaRestoreWerewolf" => array(
					"display" => "%",
			),
			
			"Skill.DamageTaken" => array(
					"display" => "%",
			),
			
			"CP.DamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.MagicDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.PhysicalDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.BreakFreeCost" => array(
					"display" => "%",
			),
			
			"Skill.RollDodgeCost" => array(
					"display" => "%",
			),
			
			"CP.RollDodgeCost" => array(
					"display" => "%",
			),
			
			"CP.ResurrectSpeed" => array(
					"display" => "%",
			),
			
			"Skill.ResurrectSpeed" => array(
					"display" => "%",
			),
			
			"CP.FlameDamageDone" => array(
					"display" => "%",
			),
			
			"CP.FrostDamageDone" => array(
					"display" => "%",
			),
			
			"Set.FrostDamageDone" => array(
					"display" => "%",
			),
			
			"CP.ShockDamageDone" => array(
					"display" => "%",
			),
			
			"ShockDamageDone" => array(
					"display" => "%",
			),
			
			"SingleTargetDamageDone" => array(
					"display" => "%",
			),
			
			"DirectDamageDone" => array(
					"display" => "%",
			),
			
			"FrostDamageDone" => array(
					"display" => "%",
			),
			
			"FlameDamageDone" => array(
					"display" => "%",
			),
			
			"ShockDamageDone" => array(
					"display" => "%",
			),
			
			"MagicDamageDone" => array(
					"display" => "%",
			),
			
			"PhysicalDamageDone" => array(
					"display" => "%",
			),
			
			"PoisonDamageDone" => array(
					"display" => "%",
			),
			
			"DiseaseDamageDone" => array(
					"display" => "%",
			),
			
			"BleedDamageDone" => array(
					"display" => "%",
			),
			
			"AOEDamageDone" => array(
					"display" => "%",
			),
			
			"AOEHealingDone" => array(
					"display" => "%",
			),
			
			"FlameDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.ShockDamageDone" => array(
					"display" => "%",
			),				
			
			"Skill.FrostDamageDone" => array(
					"display" => "%",
			),
			
			"CP.PoisonDamageDone" => array(
					"display" => "%",
			),
			
			"CP.DiseaseDamageDone" => array(
					"display" => "%",
			),
			
			"CP.HealingDone" => array(
					"display" => "%",
			),
			
			"Skill.FlameDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.FlameDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.ShockDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.ShockDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.FrostDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.FrostDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.PoisonDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.BleedDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.BleedDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.DiseaseDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.DiseaseDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.DotDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.DotDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill2.SpellCrit" => array(
					"display" => "flatcrit",
			),
			
			"Skill2.WeaponCrit" => array(
					"display" => "flatcrit",
			),
			
			"Set.SpellCrit" => array(
					"display" => "flatcrit",
			),
				
			"Set.WeaponCrit" => array(
					"display" => "flatcrit",
			),
			
			"Buff.SpellCrit" => array(
					"display" => "flatcrit",
			),
			
			"Buff.WeaponCrit" => array(
					"display" => "flatcrit",
			),
			
			"Set.CritDamage" => array(
					"display" => "%",
			),
			
			"CP.SneakCost" => array(
					"display" => "%",
			),
			
			"Buff.HealingDone" => array(
					"display" => "%",
			),
			
			"Buff.Empower" => array(
					"display" => "%",
			),
			
			"SkillDuration.Entropy" => array(
					"display" => "%",
			),
			
			"SkillDuration.Fire Rune" => array(
					"display" => "%",
			),
			
			"SkillDuration.Magelight" => array(
					"display" => "%",
			),
			
			"SpellCrit" => array(
					"display" => "%",
			),
			
			"DamageDone" => array(
					"display" => "%",
			),
			
			"WeaponCrit" => array(
					"display" => "%",
			),
			
			"SpellCritDamage" => array(
					"display" => "%",
			),
				
			"WeaponCritDamage" => array(
					"display" => "%",
			),
			
			"AttackSpellMitigation" => array(
					"display" => "%",
			),
				
			"AttackPhysicalMitigation" => array(
					"display" => "%",
			),
			
			"AttackSpellCritDamage" => array(
					"display" => "%",
			),
			
			"AttackSpellMitigation" => array(
					"display" => "%",
			),
			
			"AttackPhysicalMitigation" => array(
					"display" => "%",
			),
			
			"AttackWeaponCritDamage" => array(
					"display" => "%",
			),
			
			"Target.CritResistFactor" => array(
					"display" => "%",
			),
			
			"Set.HealingTaken" => array(
					"display" => "%",
			),
			
			"Set.BreakFreeCost" => array(
					"display" => "%",
			),
			
			"Skill.BreakFreeCost" => array(
					"display" => "%",
			),
			
			"Set.PlayerDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.PoisonDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.HAActiveDamage" => array(
					"display" => "%",
			),
			
			"CP.LAActiveDamage" => array(
					"display" => "%",
			),
			
			"Skill.FlameDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.PoisonDamageDone" => array(
					"display" => "%",
			),
			
			"CP.LAStaffDamage" => array(
					"display" => "%",
			),
			
			"CP.OverloadDamage" => array(
					"display" => "%",
			),
			
			"Skill.OverloadDamage" => array(
					"display" => "%",
			),
			
			"Buff.OverloadDamage" => array(
					"display" => "%",
			),
			
			"Set.OverloadDamage" => array(
					"display" => "%",
			),
			
			"CP.LAWeaponDamage" => array(
					"display" => "%",
			),
			
			"CP.LABowDamage" => array(
					"display" => "%",
			),
			
			"SkillDotDamage.Searing Strike" => array(
					"display" => "%",
			),
			
			"SkillDotDamage.Fiery Breath" => array(
					"display" => "%",
			),
			
			"SkillDotDamage.Dragonknight Standard" => array(
					"display" => "%",
			),
			
			"SkillDamage.Searing Strike" => array(
					"display" => "%",
			),
			
			"SkillDamage.Summon Twilight Tormentor" => array(
					"display" => "%",
			),
			
			"SkillDamage.Snipe" => array(
					"display" => "%",
			),
			
			"SkillDamage.Hidden Blade" => array(
					"display" => "%",
			),
			
			"SkillDamage.Molten Whip" => array(
					"display" => "%",
			),
			
			"SkillDamage.Overload" => array(
					"display" => "%",
			),
			
			"SkillDamage.Fiery Breath" => array(
					"display" => "%",
			),
			
			"SkillLineDamage.Bow" => array(
					"display" => "%",
			),
			
			"SkillLineDamage.Dual_Wield" => array(
					"display" => "%",
			),
			
			"SkillLineDamage.Fighters_Guild" => array(
					"display" => "%",
			),
			
			"Skill.PhysicalDamageDone" => array(
					"display" => "%",
			),
			
			"Buff.SpellResist" => array(
					"display" => "%",
			),
			
			"Buff.PhysicalResist" => array(
					"display" => "%",
			),
			
			"Skill.LADamage" => array(
					"display" => "%",
			),
			
			"CP.LADamage" => array(
					"display" => "%",
			),
			
			"CP.HADamage" => array(
					"display" => "%",
			),
			
			"SkillDuration.Stonefist" => array(
					"display" => "%",
			),
			
			"SkillDuration.Magma Armor" => array(
					"display" => "%",
			),
			
			"SkillDuration.Molten Weapons" => array(
					"display" => "%",
			),
			
			"SkillDuration.Obsidian Shield" => array(
					"display" => "%",
			),
			
			"SkillDuration.Petrify" => array(
					"display" => "%",
			),
			
			"SkillDuration.Ash Cloud" => array(
					"display" => "%",
			),
			
			"SkillDuration.Negate Magic" => array(
					"display" => "%",
			),
			
			"SkillDuration.Encase" => array(
					"display" => "%",
			),
			
			"SkillDuration.Rune Prison" => array(
					"display" => "%",
			),
			
			"SkillDuration.Daedric Mines" => array(
					"display" => "%",
			),
			
			"SkillDuration.Restoring Aura" => array(
					"display" => "%",
			),
			
			"Skill.BlockCost" => array(
					"display" => "%",
			),
			
			"CP.HealingReceived" => array(
					"display" => "%",
			),			
			
			"Set.EnchantPotency" => array(
					"display" => "%",
			),
			
			"Skill2.BlockCost" => array(
					"display" => "%",
			),
			
			"Target.CritChance" => array(
					"display" => "%",
			),
			
			"Target.FlameCritDamageTaken" => array(
					"display" => "%",
			), 
			
			"Target.FrostCritDamageTaken" => array(
					"display" => "%",
			),
			
			"Target.ShockCritDamageTaken" => array(
					"display" => "%",
			),
			
			"Set.LADamage" => array(
					"display" => "%",
			),
			
			"Set.LASpeed" => array(
					"display" => "%",
			),
			
			"Set.LAMeleeSpeed" => array(
					"display" => "%",
			),
			
			"Set.HADamage" => array(
					"display" => "%",
			),
			
			"Set.HealingDone" => array(
					"display" => "%",
			),
			
			"Set.HealingReceived" => array(
					"display" => "%",
			),
			
			"Set.Constitution" => array(
					"display" => "%",
			),
			
			"Set.SprintCost" => array(
					"display" => "%",
			),
			
			"Set.SneakCost" => array(
					"display" => "%",
			),
			
			"Set.BowDamageDone" => array(
					"display" => "%",
			),			
			
			"Set.ResurrectSpeed" => array(
					"display" => "%",
			),
			
			"Set.SneakDetectRange" => array(
					"display" => "%",
			),
			
			"Set.BlockMitigation" => array(
					"display" => "%",
			),
			
			"SkillDamage.Dragonknight Standard" => array(
					"display" => "%",
			),
			
			"SkillDamage.Soul Trap" => array(
					"display" => "%",
			),
			
			"Set.WerewolfTransformCost" => array(
					"display" => "%",
			),			
			
			"Set.NegativeEffectDuration" => array(
					"display" => "%",
			),
			
			"Set.DisableEffectDuration" => array(
					"display" => "%",
			),
			
			"Set.SnareEffect" => array(
					"display" => "%",
			),
			
			"Skill2.MagickaRegen" => array(
					"display" => "%",
			),
			
			"Skill2.StaminaRegen" => array(
					"display" => "%",
			),
			
			"CP.SprintCost" => array(
					"display" => "%",
			),
			
			"Set.DamageTaken" => array(
					"display" => "%",
			),
			
			"Target.CritDamage" => array(
					"display" => "%",
			),
			
			"CP.BashCost" => array(
					"display" => "%",
			),
			
			"CP.DirectDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.HADamageTaken" => array(
					"display" => "%",
			),
			
			"CP.LADamageTaken" => array(
					"display" => "%",
			),
			
			"CP.ShieldDamageDone" => array(
					"display" => "%",
			),
			
			"CP.TargetRecovery" => array(
					"display" => "%",
			),
			
			"CP.InspirationGained" => array(
					"display" => "%",
			),
			
			"Skill.BashDamage" => array(
					"display" => "%",
			),
			
			"SkillCost.Fighters_Guild_Cost" => array(
					"display" => "%",
			),
			
			"SkillHealing.Green_Balance" => array(
					"display" => "%",
			),
			
			"SkillHealing.Restoration_Staff" => array(
					"display" => "%",
			),
			
			"SkillHealing.Restoring_Light" => array(
					"display" => "%",
			),
			
			"Skill.MagicDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.SnareEffect" => array(
					"display" => "%",
			),
			
			"Skill.RestorationExperience" => array( "display" => "%" ),
			"Skill.TwoHandedExperience" => array( "display" => "%" ),
			"Skill.BowExperience" => array( "display" => "%" ),
			"Skill.DestructionExperience" => array( "display" => "%" ),
			"Skill.OneHandandShieldExperience" => array( "display" => "%" ),
			"Skill.LightArmorExperience" => array( "display" => "%" ),
			"Skill.MediumArmorExperience" => array( "display" => "%" ),
			"Skill.HeavyArmorExperience" => array( "display" => "%" ),
			"Skill.DualWieldExperience" => array( "display" => "%" ),
			"Skill.AlliancePointsGained" => array( "display" => "%" ),
			"Skill.ExperienceGained" => array( "display" => "%" ),
			"Skill.InspirationGained" => array( "display" => "%" ),
			"Skill.GoldGained" => array( "display" => "%" ),
			"CP.GoldGained" => array( "display" => "%" ),
			"Skill.PickPocketChance" => array( "display" => "%" ),
			"Skill.LavaDamage" => array( "display" => "%" ),
			"Skill.FallDamageTaken" => array( "display" => "%" ),
			"CP.FallDamageTaken" => array( "display" => "%" ),
			"Item.FallDamageTaken" => array( "display" => "%" ),
			"Set.FallDamageTaken" => array( "display" => "%" ),
			"Set.PlayerDamageTaken" => array( "display" => "%" ),
			"Set.PlayerAOEDamageTaken" => array( "display" => "%" ),
			"Set.SiegeDamageTaken" => array( "display" => "%" ),
			"Skill.SiegeDamage" => array( "display" => "%" ),
			"Skill.UltimateRegen" => array( "display" => "%" ),
			"Set.TrapDamageTaken" => array( "display" => "%" ),
			"Set.AOEDamageTaken" => array( "display" => "%" ),
			"Set.AOEDamageDone" => array( "display" => "%" ),
			"CP.AOEDamageDone" => array( "display" => "%" ),
			"Set.AOEHealingDone" => array( "display" => "%" ),
			"Buff.DungeonDamageTaken" => array( "display" => "%" ),
			"Skill.RangedDamageTaken" => array( "display" => "%" ),
			"Skill.BlockRangedDamageTaken" => array( "display" => "%" ),
			"Buff.Vulnerability" => array( "display" => "%" ),
			"Buff.FlameVulnerability" => array( "display" => "%" ),
			"Buff.PoisonVulnerability" => array( "display" => "%" ),
			"Target.Vulnerability" => array( "display" => "%" ),
			"Target.FlameVulnerability" => array( "display" => "%" ),
			"Target.PoisonVulnerability" => array( "display" => "%" ),
			"Target.PoisonDamageTaken" => array( "display" => "%" ),
			"Target.DiseaseDamageTaken" => array( "display" => "%" ),
			"SkillCost.Lacerate_Cost" => array( "display" => "%" ),
			"SkillCost.Berserker_Strike_Cost" => array( "display" => "%" ),
			"SkillCost.Elemental_Storm_Cost" => array( "display" => "%" ),
			"SkillCost.Shield_Wall_Cost" => array( "display" => "%" ),
			"Skill.BurningDamage" => array( "display" => "%" ),
			"Skill.PoisonedDamage" => array( "display" => "%" ),
			"Skill.StatusEffectChance" => array( "display" => "%" ),
			"Skill.StatusEffectDamage" => array( "display" => "%" ),
			"Skill.BurningChance" => array( "display" => "%" ),
			"Skill.ChilledChance" => array( "display" => "%" ),
			"Skill.ConcussionChance" => array( "display" => "%" ),
			"Item.StatusEffectChance" => array( "display" => "%" ),
			"Skill.CritHealing" => array( "display" => "%" ),
			"Set.CritHealing" => array( "display" => "%" ),
			"CP.CritHealing" => array( "display" => "%" ),
			"Mundus.CritHealing" => array( "display" => "%" ),
			"CP.WeaponCritHealing" => array( "display" => "%" ),
			"CP.SpellCritHealing" => array( "display" => "%" ),
			"Set.GuardDamage" => array( "display" => "%" ),
			"Set.MagickaAbilityDamageDone" => array( "display" => "%" ),
			"Set.HealingAbilityCost" => array( "display" => "%" ),
			"Set.BleedDamageDone" => array( "display" => "%" ),
			"Set.PhysicalDotDamageDone" => array( "display" => "%" ),
			"Set.DiseaseDotDamageDone" => array( "display" => "%" ),
			"Set.PoisonDotDamageDone" => array( "display" => "%" ),
			"Set.BleedDotDamageDone" => array( "display" => "%" ),
			"Set.PhysicalChannelDamageDone" => array( "display" => "%" ),
			"Set.DiseaseChannelDamageDone" => array( "display" => "%" ),
			"Set.PoisonChannelDamageDone" => array( "display" => "%" ),
			"Set.BleedChannelDamageDone" => array( "display" => "%" ),
			"Set.HealthRegenResistFactor" => array( "display" => "%" ),
			"Set.RangedDamageTaken" => array( "display" => "%" ),
			"Set.BuffDuration" => array( "display" => "%" ),
			"Skill.PetDamageDone" => array( "display" => "%" ),
			"Set.PetDamageDone" => array( "display" => "%" ),
			"Skill.HeavyAttackSpeed" => array( "display" => "%" ),
			"SkillCost.Undo_Cost" => array( "display" => "%" ),
			"Target.StunDuration" => array( "display" => "%" ),
			"Skill.StunDuration" => array( "display" => "%" ),
			"Set.FlameCritDamageTaken" => array( "display" => "%" ),
			"Set.ShockCritDamageTaken" => array( "display" => "%" ),
			"Set.FrostCritDamageTaken" => array( "display" => "%" ),
			"Target.PercentHealth" => array( "display" => "%" ),
			"Set.NonWeaponAbilityCost" => array( "display" => "%" ),
			"CP.MartialStatusEffectChance" => array( "display" => "%" ),
			"Set.MartialStatusEffectChance" => array( "display" => "%" ),
			"Item.MartialStatusEffectChance" => array( "display" => "%" ),
			"Skill.MartialStatusEffectChance" => array( "display" => "%" ),
			"Buff.MartialStatusEffectChance" => array( "display" => "%" ),
			"CP.MagicalStatusEffectChance" => array( "display" => "%" ),
			"Set.MagicalStatusEffectChance" => array( "display" => "%" ),
			"Set.SingleTargetDamageTaken" => array( "display" => "%" ),
			"CP.SingleTargetDamageTaken" => array( "display" => "%" ),
			"Set.SingleTargetHealingDone" => array( "display" => "%" ),
			"CP.SingleTargetHealingDone" => array( "display" => "%" ),
			"CP.MerchantSellCost" => array( "display" => "%" ),
			"Set.MerchantSellCost" => array( "display" => "%" ),
			"CP.FenceSellCost" => array( "display" => "%" ),
			"Set.FenceSellCost" => array( "display" => "%" ),
			"CP.InspirationGained" => array( "display" => "%" ),
			"CP.HarvestSpeed" => array( "display" => "%" ),
			"Skill.HarvestSpeed" => array( "display" => "%" ),
			"Set.HarvestSpeed" => array( "display" => "%" ),
			"CP.DoubleHarvestChance" => array( "display" => "%" ),
			"CP.RepairArmorCost" => array( "display" => "%" ),
			"CP.DamageShieldCost" => array( "display" => "%" ),
			"Skill.DamageShieldCost" => array( "display" => "%" ),
			"CP.DotHealingDone" => array( "display" => "%" ),
			"CP.WayshrineCost" => array( "display" => "%" ),
			"CP.StatusEffectDurationTaken" => array( "display" => "%" ),
			"CP.BreakFreeDuration" => array( "display" => "%" ),
			"Set.WeaponTraitEffect" => array( "display" => "%" ),
			"Set.BahseiMania" => array( "display" => "%" ),
	);
	
	
		/* Note: Order is how they'll appear in the computed stats list */
	/* TODO: Not used?
	public $COMPUTED_STAT_CATEGORIES = array(
			"basic" => "Basic Stats",
			"elementresist" => "Elemental Resistances",
			"healing" => "Healing",
			"statrestore" => "Stat Restoration",
			"movement" => "Movement",
			"combat" => "Bash / Block / Dodge / Break Free / Fear",
			"damageshield" => "Damage Shield",
			"damagetaken" => "Damage Taken",
			"damagedone" => "Damage Done",
			"harestore" => "Heavy Attack Restoration",
			"statuseffect" => "Status Effects",
			"lightattack" => "Light Attacks",
			"heavyattack" => "Heavy Attacks",
			"mitigation" => "Mitigation",
			"abilitycost" => "Ability Costs",
			"trait" => "Traits",
			"other" => "Other",
	); */
	
	
	public $COMPUTED_STATS_LIST = array(
			
			"Basic Stats" => "StartSection",
			
			/* 
			 * Health:
			 */
			"Health" => array(
					"title" => "Health",
					"round" => "floor",
					"compute" => array(
							//"156 * Level + 944",
							"300 * Level + 1000",		//Update 29
							"122 * Attribute.Health",
							"+",
							"Item.Health",
							"+",
							"Set.Health",
							"+",
							"Food.Health",
							"+",
							"Skill2.Health",
							"+",
							"Mundus.Health",
							"+",
							"1 + Skill.Health + Buff.Health",
							//"0.004 * min(CP.Health, 100) - 0.00002 * pow(min(CP.Health, 100), 2)", // Update 14
							//"+",
							"*",
					),
			),
			
			/* 
			 * Magicka :
			 */
			"Magicka" => array(
					"title" => "Magicka",
					"round" => "floor",
					"compute" => array(
							//"142 * Level + 858",
							"220 * Level + 1000",		//Update 29
							"111 * Attribute.Magicka",
							"+",
							"Item.Magicka",
							"+",
							"Set.Magicka",
							"+",
							"Food.Magicka",
							"+",
							"Mundus.Magicka",
							"+",
							"Skill2.Magicka",
							"+",
							"1 + Skill.Magicka + Buff.Magicka",
							//"0.004 * min(CP.Magicka, 100) - 0.00002 * pow(min(CP.Magicka, 100), 2)",	// Update 14
							//"+",
							"*",
					),
			),
			
			/* 
			 * Stamina:
			 */
			"Stamina" => array(
					"title" => "Stamina",
					"round" => "floor",
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							//"142 * Level + 858",
							"220 * Level + 1000",		//Update 29
							"111 * Attribute.Stamina",
							"+",
							"Item.Stamina",
							"+",
							"Set.Stamina",
							"+",
							"Food.Stamina",
							"+",
							"Mundus.Stamina",
							"+",
							"Skill2.Stamina",
							"+",
							"1 + Skill.Stamina + Buff.Stamina",
							//"0.004 * min(CP.Stamina, 100) - 0.00002 * pow(min(CP.Stamina, 100), 2)",	// Update 14
							//"+",
							"*",
					),
			),
				
			/* 
			 * HealthRegen Confirmed:
			 */
			"HealthRegen" => array(
					"title" => "Health Recovery",
					"round" => "floor",
					"min" => 0,
					"deferLevel" => 2,
					"depends" => array("PhysicalResist", "SpellResist"),
					"compute" => array(
							"round(5.592 * Level + 29.4)",
							"Item.HealthRegen",
							"+",
							"Set.HealthRegen",
							"+",
											// Alessian Order set in update 21
							"floor(Set.HealthRegenResistFactor * (PhysicalResist + SpellResist))",
							"+",
							
							"Mundus.HealthRegen",
							"+",
							"Food.HealthRegen",
							"1/(1 + Skill2.HealthRegen)",
							"*",
							"+",
							"1 + CP.HealthRegen + Skill.HealthRegen + Buff.HealthRegen",
							"*",
							"1 + Skill2.HealthRegen",
							"*",
							"1 + Vampire.HealthRegen",
							"*",
					),
			),
			
			/*
			 * MagickaRegen Confirmed:
			 */
			"MagickaRegen" => array(
					"title" => "Magicka Recovery",
					"round" => "floor",
					"min" => 0,
					"compute" => array(
							"round(9.30612 * Level + 48.7)",
							"Item.MagickaRegen",
							"+",
							"Set.MagickaRegen",
							"+",
							"Mundus.MagickaRegen",
							"+",
							"Food.MagickaRegen",
							"1/(1 + Skill2.MagickaRegen)",
							"*",
							"+",
							"1 + CP.MagickaRegen + Skill.MagickaRegen + Buff.MagickaRegen",
							"*",
							"1 + Skill2.MagickaRegen",
							"*",
					),
			),
			
			/*
			 * StaminaRegen Confirmed:
			 */
			"StaminaRegen" => array(
					"title" => "Stamina Recovery",
					"round" => "floor",
					"min" => 0,
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"round(9.30612 * Level + 48.7)",
							"Item.StaminaRegen",
							"+",
							"Set.StaminaRegen",
							"+",
							"Mundus.StaminaRegen",
							"+",
							"Food.StaminaRegen",
							"1/(1 + Skill2.StaminaRegen)",
							"*",
							"+",
							"1 + CP.StaminaRegen + Skill.StaminaRegen + Buff.StaminaRegen",
							"*",
							"1 + Skill2.StaminaRegen",
							"*",
					),
			),
			
			/*
			 * SpellDamage Confirmed:
			 */
			"SpellDamage" => array(
					"title" => "Spell Damage",
					"min" => 0,
					"round" => "floor",
					"depends" => array("BloodthirstySpellDamage"),
					"compute" => array(
							"20 * Level",	//Update 29
							"Item.SpellDamage",
							"+",
							"Set.SpellDamage",
							"+",
							"Skill2.SpellDamage",
							"+",
							"Mundus.SpellDamage",
							"+",
							"CP.SpellDamage",
							"+",
							"1 + Skill.SpellDamage + Buff.SpellDamage",
							"*",
							"BloodthirstySpellDamage",
							"+",
					),
			),
			
			/*
			 * WeaponDamage Confirmed:
			 */
			"WeaponDamage" => array(
					"title" => "Weapon Damage",
					"round" => "floor",
					"min" => 0,
					"depends" => array("BloodthirstyWeaponDamage"),
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"20 * Level",	//Update 29
							"Item.WeaponDamage",
							"+",
							"Set.WeaponDamage",
							"+",
							"Skill2.WeaponDamage",
							"+",
							"Mundus.WeaponDamage",
							"+",
							"CP.WeaponDamage",
							"+",
							"1 + Skill.WeaponDamage + Buff.WeaponDamage",
							"*",
							"BloodthirstyWeaponDamage",
							"+",
					),
			),
			
			/*
			 * SpellCrit Confirmed:
			 */
			"SpellCrit" => array(
					"title" => "Spell Critical",
					"display" => "%",
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"Set.SpellCrit",
							"Skill2.SpellCrit",
							"+",
							"Buff.SpellCrit",
							"+",
							"CP.SpellCrit",
							"+",
							"Mundus.SpellCrit",
							"+",
							"1/(2*EffectiveLevel*(100 + EffectiveLevel))",
							"*",
							"0.10",
							"+",
							"Item.SpellCrit",
							"+",
							"Skill.SpellCrit",
							"+",
					),
			),
			
			/*
			 * WeaponCrit Confirmed:
			 */
			"WeaponCrit" => array(
					"title" => "Weapon Critical",
					"display" => "%",
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"Set.WeaponCrit",
							"Skill2.WeaponCrit",
							"+",
							"Buff.WeaponCrit",
							"+",
							"CP.WeaponCrit",
							"+",
							"Mundus.WeaponCrit",
							"+",
							"1/(2*EffectiveLevel*(100 + EffectiveLevel))",
							"*",
							"0.10",
							"+",
							"Item.WeaponCrit",
							"+",
							"Skill.WeaponCrit",
							"+",
					),
			),
			
			/*
			 * SpellCritDamage Confirmed:
			 */
			"SpellCritDamage" => array(
					"title" => "Spell Critical Damage",
					"display" => "%2",
					"min" => 0,
					"max" => "1.25",
					"compute" => array(
							"CP.SpellCritDamage",
							"Skill.CritDamage",
							"+",
							"CP.CritDamage",
							"+",
							"Mundus.CritDamage",
							"+",
							"Set.CritDamage",
							"+",
							"Item.CritDamage",
							"+",
							"Buff.CritDamage",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritDamage",
							"*",
					),
			),
			
			/*
			 * WeaponCritDamage Confirmed:
			 */
			"WeaponCritDamage" => array(
					"title" => "Weapon Critical Damage",
					"display" => "%2",
					"min" => 0,
					"max" => "1.25",
					"compute" => array(
							"CP.WeaponCritDamage",
							"Skill.CritDamage",
							"+",
							"CP.CritDamage",
							"+",
							"Mundus.CritDamage",
							"+",
							"Set.CritDamage",
							"+",
							"Item.CritDamage",
							"+",
							"Buff.CritDamage",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritDamage",
							"*",
					),
			),
			
			/*
			 * SpellCritHealing ?
			 */
			"SpellCritHealing" => array(
					"title" => "Spell Critical Healing",
					"display" => "%2",
					"min" => 0,
					"max" => "1.25",
					"compute" => array(
							"CP.SpellCritHealing",
							"Skill.CritHealing",
							"+",
							"CP.CritHealing",
							"+",
							"Mundus.CritHealing",
							"+",
							"Set.CritHealing",
							"+",
							"Item.CritHealing",
							"+",
							"Buff.CritHealing",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritHealing",
							"*",
					),
			),
			
			/*
			 * WeaponCritHealing ?
			 */
			"WeaponCritHealing" => array(
					"title" => "Weapon Critical Healing",
					"display" => "%2",
					"min" => 0,
					"max" => "1.25",
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"CP.WeaponCritHealing",
							"Skill.CritHealing",
							"+",
							"CP.CritHealing",
							"+",
							"Mundus.CritHealing",
							"+",
							"Set.CritHealing",
							"+",
							"Item.CritHealing",
							"+",
							"Buff.CritHealing",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritHealing",
							"*",
					),
			),
			
			/*
			 * SpellResist Confirmed:
			 */
			"SpellResist" => array(
					"title" => "Spell Resistance",
					"display" => "resist",
					"round" => "floor",
					"min" => 0,
					"compute" => array(
							"Item.SpellResist",
							"Skill2.SpellResist",
							"+",
							"Mundus.SpellResist",
							"+",
							"Set.SpellResist",
							"+",
							"Skill.SpellResist",
							"+",
							"CP.SpellResist",
							"+",
							"1 + Buff.SpellResist",
							"*",
					),
			),
			
			/*
			 * PhysicalResist Confirmed:
			 */
			"PhysicalResist" => array(
					"title" => "Physical Resistance",
					"display" => "resist",
					"round" => "floor",
					"min" => 0,
					"compute" => array(
							"Item.PhysicalResist",
							"Skill2.PhysicalResist",
							"+",
							"Mundus.PhysicalResist",
							"+",
							"Set.PhysicalResist",
							"+",
							"Skill.PhysicalResist",
							"+",
							"CP.PhysicalResist",
							"+",
							"1 + Buff.PhysicalResist",
							"*",
					),
			),
			
			/*
			 * CritResist Confirmed
			 */
			"CritResist" => array(
					"title" => "Critical Resistance",
					"display" => "critresist",
					"round" => "floor",
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"1320",				//Update 29
							"Item.CritResist",
							"+",
							"Set.CritResist",
							"+",
							"Skill.CritResist",
							"+",
							"CP.CritResist",
							"+",
							"Buff.CritResist",
							"+",
							"round(Skill2.CritResist / EffectiveLevel)",
							"+",
					),
			),
			
			/*
			 * SpellPenetration Confirmed
			 */
			"SpellPenetration" => array(
					"title" => "Spell Penetration",
					"compute" => array(
							"Item.SpellPenetration",
							"Set.SpellPenetration",
							"+",
							"Skill.SpellPenetration",
							"+",
							"CP.SpellPenetration",
							"+",
							"Buff.SpellPenetration",
							"+",
							"Mundus.SpellPenetration",	// Update 15
							"+",
					),
			),
				
			/*
			 * PhysicalPenetration Confirmed
			*/
			"PhysicalPenetration" => array(
					"title" => "Physical Penetration",
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"Item.PhysicalPenetration",
							"Set.PhysicalPenetration",
							"+",
							"Skill.PhysicalPenetration",
							"+",
							"CP.PhysicalPenetration",
							"+",
							"Buff.PhysicalPenetration",
							"+",
							"Mundus.PhysicalPenetration",	// Update 15
							"+",
					),
			),
			
			"EffectiveSpellPower" => array(
					"title" => "Effective Spell Power",
					"deferLevel" => 2,
					"depends" => array("AttackSpellMitigation", "SpellDamage", "Magicka", "SpellCrit", "AttackSpellCritDamage", "DamageDone"),
					"round" => "round",
					"note" => "Effective Spell Power is a custom stat that represents your overall power with spell/magicka attacks and can be used to compare different build setups. A higher number is better.",
					"compute" => array(
							"round(Magicka/10.5)",
							"SpellDamage",
							"+",
							"1 + SpellCrit*AttackSpellCritDamage",
							"*",
							"1 + CP.MagicDamageDone",
							"*",
							"1 - AttackSpellMitigation",
							"*",
							"1 + Target.DamageTaken",
							"*",
							"1 + DamageDone",
							"*",
					),
			),
			
			"EffectiveWeaponPower" => array(
					"title" => "Effective Weapon Power",
					"deferLevel" => 2,
					"depends" => array("AttackPhysicalMitigation", "WeaponDamage", "Stamina", "WeaponCrit", "AttackWeaponCritDamage", "DamageDone"),
					"round" => "round",
					"note" => "Effective Weapon Power is a custom stat that represents your overall power with weapon/stamina attacks and can be used to compare different build setups. A higher number is better.",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"round(Stamina/10.5)",
							"WeaponDamage",
							"+",
							"1 + WeaponCrit*AttackWeaponCritDamage",
							"*",
							"1 + CP.PhysicalDamageDone",
							"*",
							"1 - AttackPhysicalMitigation",
							"*",
							"1 + Target.DamageTaken",
							"*",
							"1 + DamageDone",
							"*",
					),
			),
			
			"Elemental Resistances" => "StartSection",
			
			"FrostResist" => array(
					"title" => "Frost Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.FrostResist",
							"Skill.FrostResist",
							"+",
					),
			),
			
			"FlameResist" => array(
					"title" => "Flame Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.FlameResist",
							"Skill.FlameResist",
							"+",
					),
			),
			
			"ShockResist" => array(
					"title" => "Shock Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.ShockResist",
							"Skill.ShockResist",
							"+",
					),
			),
			
			"PoisonResist" => array(
					"title" => "Poison Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.PoisonResist",
							"Skill.PoisonResist",
							"+",
					),
			),
			
			"DiseaseResist" => array(
					"title" => "Disease Resistance",
					"display" => "elementresist",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"Item.DiseaseResist",
							"Skill.DiseaseResist",
							"+",
					),
			),
			
			"Healing" => "StartSection",
		
			/*
			 * HealingDone Confirmed
			 */
			"HealingDone" => array(
					"title" => "Healing Done",
					"display" => "%",
					"compute" => array(
							"Item.HealingDone",
							"Set.HealingDone",
							"+",
							"Skill.HealingDone",
							"+",
							"CP.HealingDone",
							"+",
							"Buff.HealingDone",
							"+",
							"Mundus.HealingDone",
							"+",
					),
			),
			
			"AOEHealingDone" => array(
					"title" => "AOE Healing Done",
					"display" => "%",
					"compute" => array(
							"Skill.AOEHealingDone",
							"Set.AOEHealingDone",
							"+",
							"CP.AOEHealingDone",
							"+",
					),
			),
			
			"DotHealingDone" => array(
					"title" => "DOT Healing Done",
					"display" => "%",
					"compute" => array(
							"Skill.DotHealingDone",
							"Set.DotHealingDone",
							"+",
							"CP.DotHealingDone",
							"+",
					),
			),
			
			"SingleTargetHealingDone" => array(
					"title" => "Single Target Healing Done",
					"display" => "%",
					"compute" => array(
							"Skill.SingleTargetHealingDone",
							"Set.SingleTargetHealingDone",
							"+",
							"CP.SingleTargetHealingDone",
							"+",
					),
			),
			
			
			/*
			 * HealingTaken Confirmed
			 */
			"HealingTaken" => array(
					"title" => "Healing Taken",
					"display" => "%",
					"compute" => array(
							"Item.HealingTaken",
							"Set.HealingTaken",
							"+",
							"Skill.HealingTaken",
							"+",
							"CP.HealingTaken",
							"+",
							"Buff.HealingTaken",
							"+",
					),
			),
			
			/*
			 * HealingReceived Confirmed
			 * 		Skill2.HealingReceived (Battle Spirit) changed in update 16?
			 */
			"HealingReceived" => array(
					"title" => "Healing Received",
					"display" => "%",
					"compute" => array(
							"1 + Item.HealingReceived",
							"Set.HealingReceived",
							"+",
							"Skill.HealingReceived",
							"+",
							"CP.HealingReceived",
							"+",
							"Buff.HealingReceived",
							"+",
							"1 + Skill2.HealingReceived",
							"*",
							"1",
							"-",
					),
			),
			
			/*
			 * Healing Confirmed
			 */
			"HealingTotal" => array(
					"title" => "Healing Total",
					"display" => "%",
					"depends" => array("HealingDone", "HealingTaken", "HealingReceived"),
					"compute" => array(
							"1 + HealingDone",
							"1 + HealingTaken",
							"*",
							"1 + HealingReceived",
							"*"
					),
			),
			
			/*
			 * Resurrection Time Needs Confirmation
			 */
			"ResurrectTime" => array(
					"title" => "Resurrect Time",
					"suffix" => " secs",
					"round" => "floor10",
					"compute" => array(
							"7",
							"1 - Set.ResurrectSpeed",
							"*",
							"1 - Skill.ResurrectSpeed",
							"*",
							"1 - Buff.ResurrectSpeed",
							"*",
							"1 - CP.ResurrectSpeed",
							"*",
							"1 - Item.ResurrectSpeed",
							"*",
					),
			),
			
			"HealingReduction" => array(
					"title" => "Healing Reduction",
					"display" => "%",
					"compute" => array(
							"CP.HealingReduction",
					),
			),
			
			"Stat Restoration" => "StartSection",
			
			"HealthRestore" => array(
					"title" => "Health Restoration",
					"suffix" => "/1s",
					"note" => "Health Restoration is a flat value/second given by some skills/sets and is seperate from Health Recovery.",
					"compute" => array(
							"Item.HealthRestore",
							"Skill.HealthRestore",
							"+",
							"Buff.HealthRestore",
							"+",
							"Set.HealthRestore",
							"+",
					),
			),
			
			"MagickaRestore" => array(
					"title" => "Magicka Restoration",
					"suffix" => "/1s",
					"note" => "Magicka Restoration is a flat value/second given by some skills/sets and is seperate from Magicka Recovery.",
					"compute" => array(
							"Item.MagickaRestore",
							"Skill.MagickaRestore",
							"+",
							"Buff.MagickaRestore",
							"+",
							"Set.MagickaRestore",
							"+",
					),
			),
			
			"StaminaRestore" => array(
					"title" => "Stamina Restoration",
					"suffix" => "/1s",
					"note" => "Stamina Restoration is a flat value/second given by some skills/sets and is seperate from Stamina Recovery.",
					"compute" => array(
							"Item.StaminaRestore",
							"Skill.StaminaRestore",
							"+",
							"Buff.StaminaRestore",
							"+",
							"Set.StaminaRestore",
							"+",
					),
			),
			
			"Movement" => "StartSection",
			
			/* 
			 * Sneak Cost Confirmed: 
			 * Note that all effects seem to multiplicative, even within a category.
			 * So if you had:
			 * 					Skill.SneakCost = -7% (Medium Armor Passive)
			 * 					Skill.SneakCost = -40% (Ledgerdemain Passive)
			 * The results would be:
			 * 					Skill.SneakCost = (1 - 0.07) * (1 - 0.40) = 0.558
			 */
			"SneakCost" => array(
					"title" => "Sneak Cost",
					"round" => "ceil",
					"compute" => array(
							"133",		//Update 29
							//"1 + 2 * EffectiveLevel",
							"1 + CP.SneakCost",
							"*",
							"1 + Skill.SneakCost",
							"*",
							"1 + Item.SneakCost",
							"*",
							"1 + Set.SneakCost",
							"*",
							"1 + Buff.SneakCost",
							"*",
					),
			),
			
			/*
			 * SneakRange Confirmed:
			 */
			"SneakRange" => array(
					"title" => "Sneak Range",
					"round" => "floor10",
					"suffix" => " m",
					"note" => "Range that others can detect you while sneaking.",
					"compute" => array(
							"max(0, 6.5 + Skill2.SneakRange + CP.SneakRange)",
							"Skill.SneakRange",
							"Set.SneakRange",
							"+",
							"1",
							"+",
							"*",
					),
			),
			
			/*
			 * SneakDetectRange Confirmed (mostly):
			 */
			"SneakDetectRange" => array(
					"title" => "Detection Range",
					"round" => "floor10",
					"suffix" => " m",
					"note" => "Range that you can detect others that are sneaking.",
					"compute" => array(
							"max(0, 6.5 + Skill2.SneakDetectRange + CP.SneakDetectRange)",
							"1",
							"Item.SneakDetectRange",
							"+",
							"Skill.SneakDetectRange",
							"+",
							"Set.SneakDetectRange",
							"+",
							"*",
					),
			),
			
			/*
			 * SprintCost: TODO needs checking
			 */
			"SprintCost" => array(
					"title" => "Sprint Cost",
					"round" => "floor",
					"compute" => array(
							"500",		// Update 29
							//"floor(38.46 + 7.69*EffectiveLevel)",
							"Skill2.SprintCost",
							"+",
							"1 + CP.SprintCost",
							"*",
							"1 + Buff.SprintCost",
							"*",
							"1 + Set.SprintCost",
							"*",
							"1 + Skill.SprintCost",
							"*",
							"1 + Item.SprintCost",
							"*",
					),
			),
			
			"WalkSpeed" => array(
					"title" => "Walk Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"0.3",
							"*",
							"1 + Buff.MovementSpeed",
							"Skill.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"Set.MovementSpeed",
							"+",
							"Mundus.MovementSpeed",
							"+",
							"*",
							"1 + CP.MovementSpeed",
							"*",
					),
			),
			
			"RunSpeed" => array(
					"title" => "Run Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 + Buff.MovementSpeed",
							"Skill.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"Set.MovementSpeed",
							"+",
							"Mundus.MovementSpeed",
							"+",
							"*",
							"1 + CP.MovementSpeed",
							"*",
					),
			),
			
			"SprintSpeed" => array(
					"title" => "Sprint Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 + 0.40",
							"Set.SprintSpeed",
							"+",
							"Buff.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"Set.MovementSpeed",
							"+",
							"Buff.SprintSpeed",
							"+",
							"Skill.MovementSpeed",
							"+",
							"Skill.SprintSpeed",
							"+",
							"CP.SprintSpeed",
							"+",
							"Mundus.MovementSpeed",
							"+",
							"*",
							"1 + CP.MovementSpeed",
							"*",
					),
			),
			
			"SwimSpeed" => array(
					"title" => "Swim Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 - 0.40",
							"*",
							"1 + Skill.SwimSpeed",
							"*",
							"1 + Buff.MovementSpeed",
							"Mundus.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"Set.MovementSpeed",
							"+",
							"CP.MovementSpeed",
							"+",
							"*",
					),
			),
			
			"SneakSpeed" => array(
					"title" => "Sneak Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1",
							"-0.40",
							"max(0, 1 - Skill.NormalSneakSpeed - CP.SneakSpeed)",
							"*",
							"+",
							"Buff.MovementSpeed",
							"+",
							"Skill.MovementSpeed",
							"+",
							"Skill.SneakSpeed",
							"+",
							"Mundus.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"Set.MovementSpeed",
							"+",
							"*",
							"1 + Skill2.SneakSpeed",
							"CP.MovementSpeed",
							"+",
							"*",
					),
			),
			
			"BlockSpeed" => array(		//TODO: Check update29pts
					"title" => "Block Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 - Skill.BlockSpeedPenalty",
							"*",
							"1 + Skill.BlockSpeed",
							"*",
							"1 + CP.BlockSpeed",
							"*",
					),
			),
			
			"MountWalkSpeed" => array(
					"title" => "Mount Walk Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 + 0.15",
							"MountSpeedBonus",
							"+",
							"Skill.MountSpeed",
							"+",
							"CP.MountSpeed",
							"+",
							"*",
							"1 + Set.MountSpeed",
							"Buff.MountSpeed",
							"+",
							"*",
					),
			),
			
			"MountRunSpeed" => array(
					"title" => "Mount Run Speed",
					"display" => "round2",
					"suffix" => " m/s",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"BaseWalkSpeed",
							"1 + 0.45",
							"MountSpeedBonus",
							"+",
							"Skill.MountSpeed",
							"+",
							"CP.MountSpeed",
							"+",
							"*",
							"1 + Set.MountSpeed",
							"Buff.MountSpeed",
							"+",
							"*",
					),
			),
			
			"Bash / Block / Dodge / Break Free / Fear" => "StartSection",
			
			/*
			 * BashCost
			 */
			"BashCost" => array(
					"title" => "Bash Cost",
					"round" => "floor",
					"compute" => array(
							"765",		// Update 32
							//"1889",	// Update 29
							//"floor(157 + 26.25*EffectiveLevel)",
							"Item.BashCost",
							"+",
							"1 + CP.BashCost",
							"*",
							"1 + Skill.BashCost",
							"*",
							"1 + Set.BashCost",
							"*",
					),
			),
			
			/*
			 * BashDamage: Confirmed Update 15
			 */
			"BashDamage" => array(	// 21970
					"title" => "Bash Damage",
					"round" => "floor",
					"depends" => array("SpellResist", "PhysicalResist", "DamageDone", "DirectDamageDone", "PhysicalDamageDone", "SingleTargetDamageDone"),
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"max(SpellResist, PhysicalResist) * 0.011250 + 1",		// Update 32
							//"max(Stamina, Magicka) * 0.004762",					// Update 29
							//"max(WeaponDamage + Item.BashWeaponDamage + Skill.BashWeaponDamage, SpellDamage + Item.BashSpellDamage + Skill.BashSpellDamage) * 0.05",
							//"+",
							//"max(Stamina, Magicka) * 0.02865",				// Update 25
							//"max(WeaponDamage + Item.BashWeaponDamage + Skill.BashWeaponDamage, SpellDamage + Item.BashSpellDamage + Skill.BashSpellDamage) * 0.26515",
							//"+",
							//"-67.875",
							"CP.BashDamage",
							"+",
							"1 + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone + Skill.BashDamage",
							"*",
							"Set.ExtraBashDamage",
							"+",
							"Skill.ExtraBashDamage",
							"+",
							"Item.ExtraBashDamage",
							"+",
					),
			),
			
			/*
			"WeaponBashDamage" => array(
					"warning" => "This is the base damage for bashing a non-casting opponent with a physical weapon.",
					"title" => "Weapon Bash Damage",
					"round" => "floor",
					"depends" => array("DamageDone", "DirectDamageDone", "WeaponDamage"),
					"compute" => array(
							"floor((WeaponDamage + Item.BashWeaponDamage + Skill.BashWeaponDamage)*0.5)",
							"1 + Skill.BashDamage",
							"*",
							"1 + DirectDamageDone + CP.PhysicalDamageDone + Skill.PhysicalDamageDone + DamageDone",
							"*",
							"Set.ExtraBashDamage",
							"+",
					),
			),
			
			"SpellBashDamage" => array(
					"warning" => "This is the base damage for bashing a non-casting opponent with a magical weapon.",
					"title" => "Spell Bash Damage",
					"round" => "floor",
					"depends" => array("DamageDone", "DirectDamageDone", "SpellDamage"),
					"compute" => array(
							"floor((SpellDamage + Item.BashSpellDamage + Skill.BashSpellDamage)*0.5)",
							"1 + Skill.BashDamage",
							"*",
							"1 + DirectDamageDone + CP.PhysicalDamageDone + Skill.PhysicalDamageDone + DamageDone",
							"*",
							"Set.ExtraBashDamage",
							"+",
					),
			), //*/
			
			
			
			/*
			 * BlockCost 
			 */
			"BlockCost" => array(
					"title" => "Block Cost",
					"round" => "floor",
					"compute" => array(
							
							"1750",			// Update 29
							//"80 + 25*EffectiveLevel",		// Unknown update, early 2018?
							"Item.BlockCost",
							"+",
							"1 - Item.Sturdy",
							"*",
							"1 + CP.BlockCost",
							"*",
							"1 + Set.BlockCost",
							"*",
							"1 + Skill.BlockCost",
							"*",
							"1 + Buff.BlockCost",
							"*",
							"1 + Skill2.BlockCost",
							"*",
							
								/* Update 17 
							"110 + 25*EffectiveLevel",
							"Item.BlockCost",
							"+",
							"1 - Item.Sturdy",
							"*",
							"1 + CP.BlockCost",
							"*",
							"1",
							"Set.BlockCost",
							"+",
							"Skill.BlockCost",
							"+",
							"Buff.BlockCost",
							"+",
							"*",
							"1 + Skill2.BlockCost",
							"*", //*/
							
								/* Pre Update 17 
							"180 + 30*EffectiveLevel",
							"1 - Item.Sturdy",
							"*",
							"1 + CP.BlockCost",
							"*",
							"1",
							"Set.BlockCost",
							"+",
							"Skill.BlockCost",
							"+",
							"Buff.BlockCost",
							"+",
							"*",
							"Item.BlockCost",
							"+",
							"1 + Skill2.BlockCost",
							"*", // */
					),
			),
			
			/*
			 * BlockMitigation: ToDo needs checking Update29pts
			 */
			"BlockMitigation" => array(
					"title" => "Block Mitigation",
					"display" => "%",
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"1",
							"0.5",
							"1",
							"Skill.BlockMitigation",
							"-",
							"Item.BlockMitigation",
							"-",
							"Set.BlockMitigation",
							"-",
							"Buff.BlockMitigation",
							"-",
							"CP.BlockMitigation",
							"-",
							"*",
							"-",
					),
			),
			
			"RollDodgeCost" => array(					// TODO: Check?
					"title" => "Dodge Roll Cost",
					"round" => "floor",
					"compute" => array(
							"4040",		// Update 29
							//"floor(34 + 5.62*EffectiveLevel)*10", // Old?
							//"3200", //?
							"Skill2.RollDodgeCost",
							"+",
							"1 + CP.RollDodgeCost",
							"*",
							"Skill.RollDodgeCost",
							"Item.RollDodgeCost",
							"+",
							"Set.RollDodgeCost",
							"+",
							"Buff.RollDodgeCost",
							"+",
							"1",
							"+",
							"*",
					),
			),
			
			"BreakFreeCost" => array(					// TODO: Check?
					"title" => "Break Free Cost",
					"round" => "floor",
					"compute" => array(
							"5400",	// Update 29
							//"450 + 75*EffectiveLevel",
							"Skill2.BreakFreeCost",
							"+",
							"1 + CP.BreakFreeCost",
							"*",
							"1",
							"Skill.BreakFreeCost",
							"+",
							"Buff.BreakFreeCost",
							"+",
							"Item.BreakFreeCost",
							"+",
							"Set.BreakFreeCost",
							"+",
							"*",
					),
			),
			
			"BreakFreeDuration" => array(					// TODO: Check?
					"title" => "Break Free Duration",
					"round" => "floor10",
					"suffix" => " secs",
					"compute" => array(
							"7",
							"1 + CP.BreakFreeDuration",
							"*",
					),
			),
			
			"FearDuration" => array(				// TODO: Check?
					"title" => "Fear Duration",
					"round" => "floor10",
					"suffix" => " secs",
					"compute" => array(
							"4",
							"1 + CP.FearDuration",
							"*",
					),
			),
			
			"Damage Shield" => "StartSection",
						
			"DamageShield" => array(
					"title" => "Damage Shield",
					"display" => "%",
					"compute" => array(
							"1 + CP.DamageShield",
							"1 + Buff.DamageShield",
							"*",
							"1 + Set.DamageShield",
							"*",
							"1 + Skill.DamageShield",
							"*",
							"-1",
							"+",
					),
			),
			
			"DamageShieldCost" => array(
					"title" => "Damage Shield Cost",
					"display" => "%",
					"compute" => array(
							"CP.DamageShieldCost",
					),
			),

			/*
			"ShieldDamageDone" => array(
					"title" => "Shield Damage Done",
					"display" => "%",
					"round" => "floor",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"CP.ShieldDamageDone",
					),
			), */
						
			"Damage Taken" => "StartSection",
						
			"DotDamageTaken" => array(
					"title" => "DOT Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DotDamageTaken",
							"Set.DotDamageTaken",
							"+",
							"Skill.DotDamageTaken",
							"+",
					),
			),
			
			"DirectDamageTaken" => array(
					"title" => "Direct Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.DirectDamageTaken",
							"Set.DirectDamageTaken",
							"+",
							"Set.DirectDamageTaken",
							"+",
					),
			),
			
			"SingleTargetDamageTaken" => array(
					"title" => "Single Target Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.SingleTargetDamageTaken",
							"Skill.SingleTargetDamageTaken",
							"+",
							"Set.SingleTargetDamageTaken",
							"+",
					),
			),
			
			"AOEDamageTaken" => array(
					"title" => "Area of Effect Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.AOEDamageTaken",
							"Skill.AOEDamageTaken",
							"+",
							"Set.AOEDamageTaken",
							"+",
					),
			),
			
			"MagicDamageTaken" => array(
					"title" => "Magic Damage Taken",
					"display" => "%",
					//"round" => "floor",
					"compute" => array(
							"1 + CP.MagicDamageTaken",
							"1 + Skill.MagicDamageTaken",
							"*",
							"1",
							"-",
					),
			),
			
			"PhysicalDamageTaken" => array(
					"title" => "Physical Damage Taken",
					"display" => "%",
					//"round" => "floor",
					"compute" => array(
							"1 + CP.PhysicalDamageTaken",
							"1 + Skill.PhysicalDamageTaken",
							"*",
							"1",
							"-",
					),
			),
			
			"HADamageTaken" => array(
					"title" => "Heavy Attack Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.HADamageTaken",
					),
			),
				
			"LADamageTaken" => array(
					"title" => "Light Attack Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.LADamageTaken",
					),
			),
			
			"FallDamageTaken" => array(
					"title" => "Fall Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.FallDamageTaken",
							"Set.FallDamageTaken",
							"+",
					),
			),
			
							//TODO: Update29pts confirm?
			"DamageTaken" => array(
					"title" => "Damage Taken",
					"display" => "%",
					//"round" => "floor",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"1 - 0.15",	//Update 29
							"1 + CP.DamageTaken",
							"*",
							"1 + Skill.DamageTaken",
							"*",
							"1 + Buff.DamageTaken",
							"*",
							"1 + Item.DamageTaken",
							"*",
							"1 + Set.DamageTaken",
							"*",
							"Buff.Vulnerability",
							"+",
							"1",
							"-",
					),
			),
			
			"Damage Done" => "StartSection",
			
			"DotDamageDone" => array(
					"title" => "DOT Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DotDamageDone",
							"Skill.DotDamageDone",
							"+",
							"Set.DotDamageDone",
							"+",
					),
			),
			
			"DirectDamageDone" => array(
					"title" => "Direct Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DirectDamageDone",
							"Skill.DirectDamageDone",
							"+",
					),
			),
			
			"SingleTargetDamageDone" => array(
					"title" => "Single Target Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"Skill.SingleTargetDamageDone",
							"CP.SingleTargetDamageDone",
							"+",
					),
			),
			
			"AOEDamageDone" => array(
					"title" => "AOE Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"Set.AOEDamageDone",
							"Skill.AOEDamageDone",
							"+",
							"CP.AOEDamageDone",
							"+",
					),
			),			
			
			"MagicDamageDone" => array(
					"title" => "Magic Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.MagicDamageDone",
							"Skill.MagicDamageDone",
							"+",
							"Buff.MagicDamageDone",
							"+",
							"Item.MagicDamageDone",
							"+",
							"Set.MagicDamageDone",
							"+",
					),
			),
			
			"PhysicalDamageDone" => array(
					"title" => "Physical Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.PhysicalDamageDone",
							"Skill.PhysicalDamageDone",
							"+",
							"Buff.PhysicalDamageDone",
							"+",
							"Item.PhysicalDamageDone",
							"+",
							"Set.PhysicalDamageDone",
							"+",
					),
			),
			
			"ShockDamageDone" => array(
					"title" => "Shock Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.ShockDamageDone",
							"Skill.ShockDamageDone",
							"+",
							"Buff.ShockDamageDone",
							"+",
							"Item.ShockDamageDone",
							"+",
							"Set.ShockDamageDone",
							"+",
					),
			),
			
			"FlameDamageDone" => array(
					"title" => "Flame Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.FlameDamageDone",
							"Skill.FlameDamageDone",
							"+",
							"Buff.FlameDamageDone",
							"+",
							"Item.FlameDamageDone",
							"+",
							"Set.FlameDamageDone",
							"+",
					),
			),
			
			"FrostDamageDone" => array(
					"title" => "Frost Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.FrostDamageDone",
							"Skill.FrostDamageDone",
							"+",
							"Buff.FrostDamageDone",
							"+",
							"Item.FrostDamageDone",
							"+",
							"Set.FrostDamageDone",
							"+",
					),
			),
			
			"PoisonDamageDone" => array(
					"title" => "Poison Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.PoisonDamageDone",
							"Skill.PoisonDamageDone",
							"+",
							"Buff.PoisonDamageDone",
							"+",
							"Item.PoisonDamageDone",
							"+",
							"Set.PoisonDamageDone",
							"+",
					),
			),
			
			"DiseaseDamageDone" => array(
					"title" => "Disease Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DiseaseDamageDone",
							"Skill.DiseaseDamageDone",
							"+",
							"Buff.DiseaseDamageDone",
							"+",
							"Item.DiseaseDamageDone",
							"+",
							"Set.DiseaseDamageDone",
							"+",
					),
			),
			
			"BowDamageDone" => array(
					"title" => "Bow Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.BowDamageDone",
							"Skill.BowDamageDone",
							"+",
							"Buff.BowDamageDone",
							"+",
							"Item.BowDamageDone",
							"+",
							"Set.BowDamageDone",
							"+",
					),
			),
			
			"BleedDamageDone" => array(
					"title" => "Bleed Damage",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"Set.BleedDamageDone",
					),
			),
			
			"PetDamageDone" => array(
					"title" => "Pet Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"Skill.PetDamageDone",
							"Set.PetDamageDone",
							"+",
					),
			),
			
			"DamageDone" => array(
					"title" => "Damage Done",
					"display" => "%",
					"round" => "floor",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"CP.DamageDone",
							"Skill.DamageDone",
							"+",
							"Buff.DamageDone",
							"+",
							"Item.DamageDone",
							"+",
							"Set.DamageDone",
							"+",
					),
			),			
			
			"Heavy Attack Restoration" => "StartSection",
			
			/*
			 * HARestore:
			 *    2H Base = round(28.26 * EffectiveLevel)
			 *    DW Base = round(21.00 * EffectiveLevel)
			 *   Bow Base = round(35.26 * EffectiveLevel)
			 * Staff Base = round(37.52 * EffectiveLevel)
			 *  1H+S Base = round(23.50 * EffectiveLevel)
			 *   Werewolf = round(18.76 * EffectiveLevel)
			 * 
			 * Final = Base * CP * Skill
			 *
			 * All Heavy Attack Restore skills confirmed (mostly)
			 * 
			 */
			"HARestoreBow" => array(
					"title" => "Bow HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"2772",		// Update 35
							//"round(EffectiveLevel * 41.28)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
					),
			),
			
			"HARestoreDW" => array(
					"title" => "Dual Wield HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"2095",		// Update 35
							//"round(EffectiveLevel * 27.26)",	// Update 29
							//"round(EffectiveLevel * 25.26)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
					),
			),
			
			"HARestore2H" => array(
					"title" => "2H HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"2425",		// Update 35
							//"round(EffectiveLevel * 36.76)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
					),
			),
			
			"HARestore1HS" => array(
					"title" => "1H+Shield HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"2293",		// Update 35
							//"round(EffectiveLevel * 30.52)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
					),
			),
			
			"HARestoreFireFrostStaff" => array(
					"title" => "Fire/Frost HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"2838",		// Update 35
							//"round(EffectiveLevel * 42.78)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore + Buff.HAMagRestore",
							"*",
					),
			),
			
			"HARestoreShockStaff" => array(
					"title" => "Shock HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"2970",		// Update 35
							//"round(EffectiveLevel * 55.03)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore + Buff.HAMagRestore",
							"*",
					),
			),
			
			"HARestoreRestStaff" => array(
					"title" => "Restore HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"2970",		// Update 35
							//"round(EffectiveLevel * 48.78)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore + Buff.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestoreRestStaff",
							"*",
					),
			),
			
			"HARestoreUnarmed" => array(
					"title" => "Unarmed HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"2095",		// Update 35
							//"round(EffectiveLevel * 24.50)",		// Update 29
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
					),
			),
			
			"HARestoreWerewolf" => array(
					"title" => "Werewolf HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"3235",		// Update 35, confirmed
							//"round(EffectiveLevel * 49.02)",		// Update 29
							//"round(EffectiveLevel * 24.5)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore + Buff.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestoreWerewolf",
							"*",
					),
			),
			
			"Constitution" => array(				// TODO: Check?
					"title" => "Constitution",
					"round" => "floor",
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"floor(2.82 * EffectiveLevel)",
							"ArmorHeavy",
							"*",
							"1 + Set.Constitution",
							"*",
					),
			),
			
			/* 
				Chilled (21481, 95136) – Deals direct damage and applies Minor Maim for 4 seconds, reducing targets damage done by 5%.
					Minor Brittle = 145975 (Frost Staff Only)
					Minor Maim = 61723
						Direct SingleTarget Frost Damage
						0.084 * Power + 0.008 * Stat
				
				Concussion (21487, 95134) – Deals direct damage and applies Minor Vulnerability for 4 seconds, increasing damage taken by 5%. 
							Animation: electric sparkles. Chance to proc from any lightning damage. Does not proc off Staff Light and Heavy attacks. 
							However, it can proc from the splash damage of Shock Heavy Attacks.
						Direct SingleTarget Shock Damage
						0.084 * Power + 0.008 * Stat
				
				Burning (18084) – Flame damage over time for 4 seconds and ticks every 2 seconds. Chance to proc from any flame damage.
						DOT SingleTarget, Flame Damage, 2 sec Ticks, 4 sec duration (x3)
						0.168 * Power + 0.016 * Stat
				
				Poisoned (21929) – Poison damage over time for 6 seconds. Chance to proc from any poison damage.
						DOT SingleTarget, Poison Damage, 2 sec Ticks, 6 sec duration (x4)
						0.1512 * Power + 0.0144 * Stat
				
				Disease (21925) – Applies Minor Defile debuff (Yes it is supposed to be Minor) for 4 seconds that reduces healing taken by 15%. 
							Animation: green cloud and health bar has inward arrowheads. Chance to proc from any disease damage (meat bag siege catapults,
							werewolf infectious claws and foul weapon enchants)
						Direct SingleTarget Disease Damage
						0.084 * Power + 0.008 * Stat
						
				3 new effects from update 29?
				
				Hemorrhaging
							Bleed Damage has a chance to apply Hemorrhaging. It deals slightly weaker damage than Burning over 4 seconds and 
							applies Minor Mangle to the target while afflicted.
						DOT SingleTarget Bleed Damage
						0.1575 * Power + 0.015 * Stat
				
				Sundered (148800)
							Physical Damage has a chance to apply Sundered. It deals minor damage and applies Minor Breach for 4 seconds.
						Direct SingleTarget Physical Damage
						0.084 * Power + 0.008 * Stat
				
				Overcharged (148797)
							Magic Damage has a chance to apply Overcharged. It deals minor damage and applies Minor Magickasteal for 4 seconds.
						Direct SingleTarget Magic Damage
						0.084 * Power + 0.008 * Stat
				
				Standardized the chance an ability has to apply a secondary effect, such as burning, chilled, or concussed. These chances are:
						Weapon enchants 20%
						Standard ability 10%
						Area of effect abilities 5%
						Damage over time abilities 3%
						Area of effect damage over time abilities 1%
			 */
			"Status Effects" => "StartSection",
			
			"StatusFlameSpellDamage" => array(
					"title" => "Status Flame Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Flame",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusFlameWeaponDamage" => array(
					"title" => "Status Flame Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Flame",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusShockSpellDamage" => array(
					"title" => "Status Shock Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Shock",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusShockWeaponDamage" => array(
					"title" => "Status Shock Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Shock",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusFrostSpellDamage" => array(
					"title" => "Status Frost Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Frost",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusFrostWeaponDamage" => array(
					"title" => "Status Frost Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Frost",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusMagicSpellDamage" => array(
					"title" => "Status Magic Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Magic",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusMagicWeaponDamage" => array(
					"title" => "Status Magic Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Magic",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusPhysicalSpellDamage" => array(
					"title" => "Status Physical Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Physical",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusPhysicalWeaponDamage" => array(
					"title" => "Status Physical Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Physical",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusBleedSpellDamage" => array(
					"title" => "Status Bleed Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Bleed",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusBleedWeaponDamage" => array(
					"title" => "Status Bleed Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Bleed",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusDiseaseSpellDamage" => array(
					"title" => "Status Disease Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Disease",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusDiseaseWeaponDamage" => array(
					"title" => "Status Disease Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Disease",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"StatusPoisonSpellDamage" => array(
					"title" => "Status Poison Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Poison",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"StatusPoisonWeaponDamage" => array(
					"title" => "Status Poison Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Poison",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"BurningDamage" => array(	// 18084 
					"title" => "Burning Damage / Tick",
					"round" => "floor",
					"depends" => array("StatusFlameSpellDamage", "StatusFlameWeaponDamage", "Magicka", "Stamina", "FlameDamageDone", "DotDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"note" => "This is per 2 second tick so multiply by 3 to get total damage done.",
					"compute" => array(
							"floor(fround(0.016)*max(Magicka, Stamina)) + floor(fround(0.168)*max(StatusFlameSpellDamage, StatusFlameWeaponDamage))",
							"1 + Skill.BurningDamage + FlameDamageDone + DotDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"ChilledDamage" => array(	// 21481 
					"title" => "Chilled Damage",
					"round" => "floor",
					"depends" => array("StatusFrostSpellDamage", "StatusFrostWeaponDamage", "Magicka", "Stamina", "FrostDamageDone", "DirectDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"compute" => array(
							"floor(fround(0.008)*max(Magicka, Stamina)) + floor(fround(0.084)*max(StatusFrostSpellDamage, StatusFrostWeaponDamage))",
							"1 + FrostDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"ConcussionDamage" => array(	// 21487 
					"title" => "Concussion Damage",
					"round" => "floor",
					"depends" => array("StatusShockSpellDamage", "StatusShockWeaponDamage", "Magicka", "Stamina", "ShockDamageDone", "DirectDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"compute" => array(
							"floor(fround(0.008)*max(Magicka, Stamina)) + floor(fround(0.084)*max(StatusShockSpellDamage, StatusShockWeaponDamage))",
							"1 + ShockDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"OverchargedDamage" => array(	// 148797 
					"title" => "Overcharged Damage",
					"round" => "floor",
					"depends" => array("StatusMagicSpellDamage", "StatusMagicWeaponDamage", "Magicka", "Stamina", "MagicDamageDone", "DirectDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"compute" => array(
							"floor(fround(0.008)*max(Magicka, Stamina)) + floor(fround(0.084)*max(StatusMagicSpellDamage, StatusMagicWeaponDamage))",
							"1 + MagicDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"SunderedDamage" => array(	// 148800 
					"title" => "Sundered Damage",
					"round" => "floor",
					"depends" => array("StatusPhysicalSpellDamage", "StatusPhysicalWeaponDamage", "Magicka", "Stamina", "PhysicalDamageDone", "DirectDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"compute" => array(
							"floor(fround(0.008)*max(Magicka, Stamina)) + floor(fround(0.084)*max(StatusPhysicalSpellDamage, StatusPhysicalWeaponDamage))",
							"1 + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"HemorrhagingDamage" => array(	// 48801 
					"title" => "Hemorrhaging Damage / Tick",
					"round" => "floor",
					"depends" => array("StatusBleedSpellDamage", "StatusBleedWeaponDamage", "Magicka", "Stamina", "BleedDamageDone", "DotDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"note" => "This is per 2 second tick so multiply by 3 to get total damage done.",
					"compute" => array(
							"floor(fround(0.015)*max(Magicka, Stamina)) + floor(fround(0.1575)*max(StatusBleedSpellDamage, StatusBleedWeaponDamage))",
							"1 + BleedDamageDone + DotDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"DiseaseDamage" => array(	// 21925 
					"title" => "Disease Damage",
					"round" => "floor",
					"depends" => array("StatusDiseaseSpellDamage", "StatusDiseaseWeaponDamage", "Magicka", "Stamina", "DiseaseDamageDone", "DirectDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"compute" => array(
							"floor(fround(0.008)*max(Magicka, Stamina)) + floor(fround(0.084)*max(StatusDiseaseSpellDamage, StatusDiseaseWeaponDamage))",
							"1 + DiseaseDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"PoisonedDamage" => array(	// 21929 
					"title" => "Poisoned Damage / Tick",
					"round" => "floor",
					"depends" => array("StatusPoisonSpellDamage", "StatusPoisonWeaponDamage", "Magicka", "Stamina", "PoisonDamageDone", "DotDamageDone", "SingleTargetDamageDone", "DamageDone"),
					"note" => "This is per 2 second tick so multiply by 4 to get total damage done.",
					"compute" => array(
							"floor(fround(0.0144)*max(Magicka, Stamina)) + floor(fround(0.1512)*max(StatusPoisonSpellDamage, StatusPoisonWeaponDamage))",
							"1 + Skill.PoisonedDamage + PoisonDamageDone + DotDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
					),
			),
			
			"PoisonedDuration" => array(
					"title" => "Poisoned Duration",
					"round" => "floor",
					"suffix" => " secs",
					"note" => "Duration for only the Poisoned status effect.",
					"compute" => array(
							"6.0",
					),
			),
			
			"StatusDuration" => array(
					"title" => "Status Duration",
					"round" => "floor",
					"suffix" => " secs",
					"note" => "Duration for Burning, Concussion, Chilled, and Diseased status effects.",
					"compute" => array(
							"4.0",
					),
			),
			
			"MagicalEnchantStatusChance" => array(
					"title" => "Magical Chance (Enchants)",
					"display" => "%",
					"compute" => array(
							"0.20",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MagicalStatusEffectChance",
							"*",
					),
			),
			
			"MagicalAbilityStatusChance" => array(
					"title" => "Magical Chance (Ability)",
					"display" => "%",
					"compute" => array(
							"0.10",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MagicalStatusEffectChance",
							"*",
					),
			),
			
			"MagicalAOEStatusChance" => array(
					"title" => "Magical Chance (AOE)",
					"display" => "%",
					"compute" => array(
							"0.05",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MagicalStatusEffectChance",
							"*",
					),
			),
			
			"MagicalDOTStatusChance" => array(
					"title" => "Magical Chance (DOT)",
					"display" => "%",
					"compute" => array(
							"0.03",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MagicalStatusEffectChance",
							"*",
					),
			),
			
			"MagicalAOEDOTStatusChance" => array(
					"title" => "Magical Chance (AOE + DOT)",
					"display" => "%",
					"compute" => array(
							"0.01",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MagicalStatusEffectChance",
							"*",
					),
			),
			
			"MartialEnchantStatusChance" => array(
					"title" => "Martial Chance (Enchants)",
					"display" => "%",
					"compute" => array(
							"0.20",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MartialStatusEffectChance",
							"*",
					),
			),
			
			"MartialAbilityStatusChance" => array(
					"title" => "Martial Chance (Ability)",
					"display" => "%",
					"compute" => array(
							"0.10",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MartialStatusEffectChance",
							"*",
					),
			),
			
			"MartialAOEStatusChance" => array(
					"title" => "Martial Chance (AOE)",
					"display" => "%",
					"compute" => array(
							"0.05",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MartialStatusEffectChance",
							"*",
					),
			),
			
			"MartialDOTStatusChance" => array(
					"title" => "Martial Chance (DOT)",
					"display" => "%",
					"compute" => array(
							"0.03",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MartialStatusEffectChance",
							"*",
					),
			),
			
			"MartialAOEDOTStatusChance" => array(
					"title" => "Martial Chance (AOE + DOT)",
					"display" => "%",
					"compute" => array(
							"0.01",
							"1 + Skill.StatusEffectChance + Item.StatusEffectChance + CP.MartialStatusEffectChance",
							"*",
					),
			),
			
			"Light Attacks" => "StartSection",
			
			"LAFlameSpellDamage" => array(
					"title" => "LA Flame Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Flame + Skill2.LASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"LAFlameWeaponDamage" => array(
					"title" => "LA Flame Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Flame + Skill2.LAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"LAShockSpellDamage" => array(
					"title" => "LA Shock Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Shock + Skill2.LASpellDamage + Item.ChannelSpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"LAShockWeaponDamage" => array(
					"title" => "LA Shock Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Shock + Skill2.LAWeaponDamage + Item.ChannelWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"LAFrostSpellDamage" => array(
					"title" => "LA Frost Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Frost + Skill2.LASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"LAFrostWeaponDamage" => array(
					"title" => "LA Frost Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Frost + Skill2.LAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"LAMagicSpellDamage" => array(
					"title" => "LA Magic Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Magic + Skill2.LASpellDamage + Item.ChannelSpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"LAMagicWeaponDamage" => array(
					"title" => "LA Magic Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Magic + Skill2.LAWeaponDamage + Item.ChannelWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"LAPhysicalWeaponDamage" => array(
					"title" => "LA Physical Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Physical + Skill2.LAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"LAPhysicalSpellDamage" => array(
					"title" => "LA Physical Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Physical + Skill2.LASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"LAFlameStaff" => array(	// 16165
					"title" => "Light Attack Flame Staff",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAFlameSpellDamage", "LAFlameWeaponDamage", "SingleTargetDamageDone", "DamageDone", "DirectDamageDone"),
					"compute" => array(
							"floor(fround(0.030)*max(Magicka, Stamina)) + floor(fround(0.315)*max(LAFlameSpellDamage, LAFlameWeaponDamage))", 	// Update 35 Exact
							//"2025", 	// Update 35pts
							//"floor(fround(0.0405)*max(Magicka, Stamina)) + floor(fround(0.4252)*max(LAFlameSpellDamage, LAFlameWeaponDamage))", 	// Update 29 Exact
							//"round(0.040455*max(Magicka, Stamina) + 0.42489*max(LAFlameSpellDamage, LAFlameWeaponDamage) + 0.55404)", 			// Update 29
							//"round(0.0404834*max(Magicka, Stamina) + 0.425035*max(LAFlameSpellDamage, LAFlameWeaponDamage) - 0.420652)", 			// Update 28
							//"round(0.0449528*Magicka + 0.47223*LAFlameSpellDamage - 0.210105)", 		// Update 21
							//"round(0.0450227*Magicka + 0.472303*SpellDamage - 0.802558)", 	// Update 18
							//"round(0.0161002*Magicka + 0.643855*SpellDamage - 0.692667)", 	// Update 14
							//"round(0.0139076*Magicka + 0.560231*SpellDamage + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)", 				// Update 10?
							
								/* Update 21 */
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + FlameDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
							
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + Skill.FlameDamageDone + DamageDone + SingleTargetDamageDone + DirectDamageDone",
							//"*",
							
							/*
							"1 + CP.LAStaffDamage + CP.FlameDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.LADamage + Set.LADamage + Skill.FlameDamageDone + Buff.Empower + DamageDone + SingleTargetDamageDone + DirectDamageDone -  CP.FlameDamageDone + CP.DirectDamageDone",
							"*",*/
					),
			),
			
			"LAFrostStaff" => array(	// 16277
					"title" => "Light Attack Frost Staff",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAFrostSpellDamage", "LAFrostWeaponDamage", "SingleTargetDamageDone", "DamageDone", "DirectDamageDone", "FrostDamageDone"),
					"compute" => array(
							"floor(fround(0.030)*max(Magicka, Stamina)) + floor(fround(0.315)*max(LAFrostSpellDamage, LAFrostWeaponDamage))", 	// Update 35 Exact
							//"2025", 	// Update 35
							//"floor(fround(0.0405)*max(Magicka, Stamina)) + floor(fround(0.4252)*max(LAFrostSpellDamage, LAFrostWeaponDamage))", 	// Update 29 Exact
							//"round(0.040455*max(Magicka, Stamina) + 0.42489*max(LAFrostSpellDamage, LAFrostWeaponDamage) + 0.55404)", 			// Update 29
							//"round(0.0404834*max(Magicka, Stamina) + 0.425035*max(LAFrostSpellDamage, LAFrostWeaponDamage) - 0.420652)", 			// Update 28
							//"round(0.0449528*Magicka + 0.47223*LAFrostSpellDamage - 0.210105)", 		// Update 21
							//"round(0.0450227*Magicka + 0.472303 *SpellDamage - 0.802558)", 	// Update 18
							//"round(0.0161002*Magicka + 0.643855*SpellDamage - 0.692667)", 	// Update 14
							//"round(0.0139076*Magicka + 0.560231*SpellDamage + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)",
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + FrostDamageDone + DamageDone + DirectDamageDone",
							//"*",
							
								// Update 21
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + FrostDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
							
							/*
							"1 + CP.LAStaffDamage + CP.FrostDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.LADamage + Set.LADamage + FrostDamageDone + Buff.Empower + DamageDone + SingleTargetDamageDone + DirectDamageDone - CP.FrostDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"LAShockStaff" => array(	// 18396
					"title" => "Light Attack Shock Staff",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAShockSpellDamage", "LAShockWeaponDamage", "DamageDone", "AOEDamageDone", "DotDamageDone", "ShockDamageDone"),
					"compute" => array(
							"floor(fround(0.021905)*max(Magicka, Stamina)) + floor(fround(0.2305)*max(LAShockSpellDamage, LAShockWeaponDamage))", 	// Update 35 Exact
							//"900", 	// Update 35
							//"floor(fround(0.024)*max(Magicka, Stamina)) + floor(fround(0.252)*max(LAShockSpellDamage, LAShockWeaponDamage))", 		// Update 29 Exact
							//"round(0.0239542*max(Magicka, Stamina) + 0.251628*max(LAShockSpellDamage, LAShockWeaponDamage) + 0.80486)",			// Update 29
							//"round(0.0240162*max(Magicka, Stamina) + 0.251633*max(LAShockSpellDamage, LAShockWeaponDamage) - 0.55663)",			// Update 28
							//"round(0.0241608*Magicka + 0.251379*LAShockSpellDamage - 1.77615)",		// Update 21
							//"round(0.0240568*Magicka + 0.251298*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.828837)",	// Update 18
							//"round(0.0110522*Magicka + 0.441972*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.04019)",	// Update 14
							//"round(0.0129965*Magicka + 0.520247*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.1641)",	// Update 12
							//"round((0.0130319*Magicka + 0.519646*SpellDamage - 0.890172)*3)",		// Update 11pts
							//"round((0.013*Magicka + 0.52*SpellDamage - 0.26)*3)",					// Update 10
							
							"Skill2.HADamage",
							"+",						// Not affected by Empower?
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + Buff.Empower + ShockDamageDone + SingleTargetDamageDone + DotDamageDone + DamageDone",
							"*",
							
							/*
							"1 + CP.LAStaffDamage + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + ShockDamageDone + Buff.Empower + DamageDone + AOEDamageDone + DotDamageDone - CP.ShockDamageDone - CP.DotDamageDone",	 //TODO: Include + Skill.LADamage?
							"*", */
					),
			),
			
			"LARestorationStaff" => array(	// 16212
					"title" => "Light Attack Restoration",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAMagicSpellDamage", "LAMagicWeaponDamage", "DamageDone", "SingleTargetDamageDone", "DotDamageDone", "MagicDamageDone"),
					"compute" => array(
							"floor(fround(0.013690)*max(Magicka, Stamina)) + floor(fround(0.14375)*max(LAMagicSpellDamage, LAMagicWeaponDamage))", 	// Update 35 Exact
							//"600", 	// Update 35
							//"floor(fround(0.028462)*max(Magicka, Stamina)) + floor(fround(0.298856)*max(LAMagicSpellDamage, LAMagicWeaponDamage))", 	// Update 29 Exact
							//"(0.0570679*max(Magicka, Stamina) + 0.597695*max(LAMagicSpellDamage, LAMagicWeaponDamage) - 4.48203)/2",					// Update 29
							//"(0.0568945*max(Magicka, Stamina) + 0.597347*max(LAMagicSpellDamage, LAMagicWeaponDamage) - 0.998668)/2",					// Update 28
							//"(0.0570557*Magicka + 0.597266*LAMagicSpellDamage - 2.41936)/2",				// Update 26
							//"round((0.103388*Magicka + 1.08557*LAMagicSpellDamage - 0.647704)/3)",		// Update 21
							//"round((0.103346*Magicka + 1.08623*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.562222)/3)", 	// Update 18
							//"round((0.0407852*Magicka + 1.63171*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.76576)/3)", 	// Update 14
							//"round(0.0139076*Magicka + 0.560231*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)",
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + DamageDone + DotDamageDone",
							//"*",
							
							"Skill2.HADamage",
							"+",						//Not affected by Empower
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + Buff.Empower + MagicDamageDone + DotDamageDone + SingleTargetDamageDone + DamageDone",
							"*",
							
							/*
							"1 + CP.LAStaffDamage + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + ShockDamageDone + Buff.Empower + DamageDone - CP.ShockDamageDone - CP.DotDamageDone",
							"*", */
					),
			),
			
			"LAUnarmed" => array( // 23604
					"title" => "Light Attack Unarmed",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "LAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.033333)*max(Magicka, Stamina)) + floor(fround(0.350)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.045)*max(Magicka, Stamina)) + floor(fround(0.4725)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0447787*max(Magicka, Stamina) + 0.472299*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 2.65615)",			// Update 29
							//"round(0.0404834*max(Magicka, Stamina) + 0.425035*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.420652)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + Set.LAMeleeDamage + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone",
							"*",
					),
			),
			
			"LAOneHand" => array( // 15435
					"title" => "Light Attack One Hand",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "LAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.033333)*max(Magicka, Stamina)) + floor(fround(0.350)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.045)*max(Magicka, Stamina)) + floor(fround(0.4725)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0447787*max(Magicka, Stamina) + 0.472299*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) + 2.65615)",			// Update 29
							//"round(0.0449414*max(Magicka, Stamina) + 0.472081*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.0841677)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							//"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",	// Update 18
							//"round(0.0166857*Stamina + 0.666645*WeaponDamage - 0.749082)",	// Update 14
							//"round(0.0145129*Stamina + 0.579979*WeaponDamage - 1.0552)",		// Update 12
							//"round(0.0140*Stamina + 0.56*WeaponDamage - 0.60)",
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + Set.LAMeleeDamage + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone",
							"*",
					),
			),
			
			"LATwoHand" => array( // 16037
					"title" => "Light Attack Two Hand",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.033333)*max(Magicka, Stamina)) + floor(fround(0.350)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.045)*max(Magicka, Stamina)) + floor(fround(0.4725)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0447787*max(Magicka, Stamina) + 0.472299*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) + 2.65615)",			// Update 29
							//"round(0.0449414*max(Magicka, Stamina) + 0.472081*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.0841677)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							//"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",	// Update 18
							//"round(0.0218892*Stamina + 0.873792*WeaponDamage - 1.61325)",		// Update 14
							//"round(0.019042*Stamina + 0.760103*WeaponDamage - 1.77928)",		// Update 12
							//"round(0.0148*Stamina + 0.592*WeaponDamage - 1.06)",
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + Set.LAMeleeDamage + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone",
							"*",
					),
			),
			
			"LABow" => array( // 16688
					"title" => "Light Attack Bow",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "LAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "BowDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.0300)*max(Magicka, Stamina)) + floor(fround(0.3150)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.0405)*max(Magicka, Stamina)) + floor(fround(0.42525)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.040455*max(Magicka, Stamina) + 0.42489*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) + 0.55404)",			// Update 29
							//"round(0.0449414*max(Magicka, Stamina) + 0.472081*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.0841677)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							//"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",	// Update 18
							//"round(0.0166857*Stamina + 0.666645*WeaponDamage - 0.749082)",	// Update 14
							//"round(0.0145129*Stamina + 0.579979*WeaponDamage - 1.0552)",		// Update 12
							//"round(0.0140*Stamina + 0.56*WeaponDamage - 0.60)",
							//"1 + CP.LABowDamage + Set.LADamage + Set.BowDamageDone + Skill.BowDamageDone + Buff.Empower + Skill.PhysicalDamageDone + DamageDone", 	// TODO: Check BowDamageDone
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + BowDamageDone + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone + SkillLineDamage.Bow",
							"*",
					),
			),
			
			"LADualWield" => array(	// 16499
					"title" => "Light Attack Dual Wield",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "LAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.033333)*max(Magicka, Stamina)) + floor(fround(0.350)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.045)*max(Magicka, Stamina)) + floor(fround(0.4725)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0447787*max(Magicka, Stamina) + 0.472299*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) + 2.65615)",			// Update 29
							//"round(0.0449414*max(Magicka, Stamina) + 0.472081*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.0841677)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							//"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",	// Update 18
							//"round(0.0139542*Stamina + 0.557374*WeaponDamage - 0.139753)",	// Update 14?
							//"round(0.0163232*Stamina + 0.65628*WeaponDamage + 0.555625)",		// Probably not correct?
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + Set.LAMeleeDamage + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone + SkillLineDamage.Dual_Wield",
							"*",
					),
			),
			
			"LAWerewolf" => array( // 32464
					"title" => "Light Attack Werewolf",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAPhysicalWeaponDamage", "LAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.041667)*max(Magicka, Stamina)) + floor(fround(0.43750)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.045)*max(Magicka, Stamina)) + floor(fround(0.4725)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0447787*max(Magicka, Stamina) + 0.472299*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) + 2.65615)",			// Update 29
							//"round(0.0449414*max(Magicka, Stamina) + 0.472081*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage) - 0.0841677)",		// Update 28
							//"round(0.0450269*Stamina + 0.472092*LAPhysicalWeaponDamage - 0.915352)",		// Update 21
							//"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",	// Update 18?
							//"round(0.0166213*Stamina + 0.666503*WeaponDamage + 0.0462245)",	// Update 17
							"Skill2.LADamage",
							"+",
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + Set.LAMeleeDamage + PhysicalDamageDone + DamageDone + DirectDamageDone + SingleTargetDamageDone",
							"*",
					),
			),
			
			"OverloadDamage" => array(
					"title" => "Overload Damage Modifier",
					"display" => "%",
					"compute" => array(
							"CP.OverloadDamage",
							"Skill.OverloadDamage",
							"+",
							"Set.OverloadDamage",
							"+",
							"Buff.OverloadDamage",
							"+",
					),
			),
			
			"LAOverload" => array( // 24792
					"title" => "Light Attack Overload",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAShockSpellDamage", "LAShockWeaponDamage", "DamageDone", "SingleTargetDamageDone", "DirectDamageDone", "ShockDamageDone", "OverloadDamage"),
					"compute" => array(
							"floor(fround(0.100)*max(Magicka, Stamina)) + floor(fround(1.050)*max(LAPhysicalWeaponDamage, LAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2250", 	// Update 35
							//"floor(fround(0.1)*max(Magicka, Stamina)) + floor(fround(1.05)*max(LAShockSpellDamage, LAShockWeaponDamage))", 		// Update 29 Exact
							//"round(0.100012*max(Magicka, Stamina) + 1.04995*max(LAShockSpellDamage, LAShockWeaponDamage) - 1.02553)",			// Update 29
							
							"Skill2.LADamage",
							"+",					// Empower?
							"1 + CP.LADamage + Skill.LADamage + Set.LADamage + ShockDamageDone + SingleTargetDamageDone + DirectDamageDone + DamageDone + OverloadDamage",
							"*",
					),
			),
			
			"LASpeed" => array(
					"title" => "Light Attack Speed",
					"display" => "%",
					"compute" => array(
							"1 + Set.LASpeed",
					),
			),
					
			"LAMeleeSpeed" => array(
					"title" => "Light Attack Melee Speed",
					"note" => "Melee Light Attacks include 1H+Shield, Dual Wield, 2Handed, Werewolf, and Unarmed.",
					"display" => "%",
					"compute" => array(
							"1 + Set.LASpeed + Set.LAMeleeSpeed",
					),
			),
			
			"Heavy Attacks" => "StartSection",
			
			"HAFlameSpellDamage" => array(
					"title" => "HA Flame Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Flame + Skill2.HASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"HAFlameWeaponDamage" => array(
					"title" => "HA Flame Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Flame + Skill2.HAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"HAShockSpellDamage" => array(
					"title" => "HA Shock Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Shock + Skill2.HASpellDamage + Item.ChannelSpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"HAShockWeaponDamage" => array(
					"title" => "HA Shock Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Shock + Skill2.HAWeaponDamage + Item.ChannelWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"HAFrostSpellDamage" => array(
					"title" => "HA Frost Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Frost + Skill2.LASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"HAFrostWeaponDamage" => array(
					"title" => "HA Frost Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Frost + Skill2.LAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"HAMagicSpellDamage" => array(
					"title" => "HA Magic Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Magic + Skill2.HASpellDamage + Item.ChannelSpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"HAMagicWeaponDamage" => array(
					"title" => "HA Magic Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Magic + Skill2.HAWeaponDamage + Item.ChannelWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"HAPhysicalWeaponDamage" => array(
					"title" => "HA Physical Weapon Damage",
					"round" => "floor",
					"depends" => array("WeaponDamage"),
					"compute" => array(
							"WeaponDamage",
							"SkillBonusWeaponDmg.Physical + Skill2.HAWeaponDamage",
							"1 + Buff.WeaponDamage + Skill.WeaponDamage",
							"*",
							"+",
					),
			),
			
			"HAPhysicalSpellDamage" => array(
					"title" => "HA Physical Spell Damage",
					"round" => "floor",
					"depends" => array("SpellDamage"),
					"compute" => array(
							"SpellDamage",
							"SkillBonusSpellDmg.Physical + Skill2.HASpellDamage",
							"1 + Buff.SpellDamage + Skill.SpellDamage",
							"*",
							"+",
					),
			),
			
			"HAFlameStaff" => array(	// 15383
					"title" => "Heavy Attack Fire Staff",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAFlameSpellDamage", "HAFlameWeaponDamage", "SingleTargetDamageDone", "DamageDone", "DirectDamageDone", "FlameDamageDone"),
					"compute" => array(
							"floor(fround(0.071429)*max(Magicka, Stamina)) + floor(fround(0.750)*max(HAFlameSpellDamage, HAFlameWeaponDamage))", 	// Update 35 Exact
							//"4893",		// Update 35
							//"floor(fround(0.096)*max(Magicka, Stamina)) + floor(fround(1.008)*max(HAFlameSpellDamage, HAFlameWeaponDamage))", 	// Update 29 Exact
							//"round(0.0960392*max(Magicka, Stamina) + 1.00751*max(HAFlameSpellDamage, HAFlameWeaponDamage) - 0.531069)",		// Update 29
							//"round(0.0959915*max(Magicka, Stamina) + 1.00751*max(HAFlameSpellDamage, HAFlameWeaponDamage) - 0.520289)",		// Update 28
							//"round(0.0960903 *Magicka + 1.00757*HAFlameSpellDamage - 1.59257)",	// Update 21
							//"round(0.0960395*Magicka + 1.0076*SpellDamage - 1.01795)",		// Update 18
							//"round(0.0409739*Magicka + 1.63589*SpellDamage - 0.239583)",		// Update 14
							//"round(0.0550432*Magicka + 2.19972*SpellDamage - 0.864784)",		// Update 12
							//"round(0.0549025*Magicka + 2.20013*SpellDamage - 0.481141)",		// Update 11pts
							//"round(0.055*Magicka + 2.20*SpellDamage - 0.67)",					// Update 10
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + FlameDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"1 + CP.HAStaffDamage + CP.FlameDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + FlameDamageDone + Buff.Empower + DamageDone + SingleTargetDamageDone + DirectDamageDone - CP.FlameDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HAFrostStaff" => array(	// 16261
					"title" => "Heavy Attack Frost Staff",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAFrostSpellDamage", "HAFrostWeaponDamage", "DamageDone", "DirectDamageDone", "FrostDamageDone"),
					"compute" => array(
							"floor(fround(0.071429)*max(Magicka, Stamina)) + floor(fround(0.750)*max(HAFrostSpellDamage, HAFrostWeaponDamage))", 	// Update 35 Exact
							//"4893",		// Update 35
							//"floor(fround(0.096)*max(Magicka, Stamina)) + floor(fround(1.008)*max(HAFrostSpellDamage, HAFrostWeaponDamage))", 	// Update 29 Exact
							//"round(0.0960392*max(Magicka, Stamina) + 1.00751*max(HAFrostSpellDamage, HAFrostWeaponDamage) - 0.531069)",		// Update 29
							//"round(0.0959915*max(Magicka, Stamina) + 1.00751*max(HAFrostSpellDamage, HAFrostWeaponDamage) - 0.520289)",		// Update 28
							//"round(0.0960903 *Magicka + 1.00757*HAFrostSpellDamage - 1.59257)",	// Update 21
							//"round(0.0960395*Magicka + 1.0076*SpellDamage - 1.01795)",		// Update 18
							//"round(0.0409739*Magicka + 1.63589*SpellDamage - 0.239583)",		// Update 14
							//"round(0.0550432*Magicka + 2.19972*SpellDamage - 0.864784)",		// Update 12
							//"round(0.0549025*Magicka + 2.20013*SpellDamage - 0.481141)",		// Update 11pts
							//"round(0.055*Magicka + 2.20*SpellDamage - 0.67)",					// Update 10
							
									/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + FrostDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"1 + CP.HAStaffDamage + CP.FrostDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + FrostDamageDone + DamageDone + DirectDamageDone - CP.FrostDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HAShockStaffFinal" => array(	// 18396
					"title" => "HA Shock Staff Final",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAShockSpellDamage", "HAShockWeaponDamage", "LAShockStaff", "DamageDone", "AOEDamageDone", "DotDamageDone", "ShockDamageDone"),
					"compute" => array(
							"floor(fround(0.065714)*max(Magicka, Stamina)) + floor(fround(0.690)*max(HAShockSpellDamage, HAShockWeaponDamage))", 	// Update 35 Exact
							//"3150",		// Update 35
							//"floor(fround(0.04)*max(Magicka, Stamina)) + floor(fround(0.42)*max(HAShockSpellDamage, HAShockWeaponDamage))", 	// Update 29 Exact
							//"round(0.039976*max(Magicka, Stamina) + 0.420235*max(HAShockSpellDamage, HAShockWeaponDamage) - 1.34724)",		// Update 29
							//"round(0.0401116*max(Magicka, Stamina) + 0.4193*max(HAShockSpellDamage, HAShockWeaponDamage) - 1.39152)",			// Update 28
							//"round(0.0399777*Magicka + 0.419722*HAShockSpellDamage - 0.327807)",		// Update 21
							//"round(0.0399643*Magicka + 0.419512*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.0136314)",		// Update 18
							//"round(0.0154345*Magicka + 0.618618*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.265101)",		// Update 14
							//"round(0.0182736*Magicka + 0.728039*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 2.50684)",		// Update 12
							//"round(0.0181386*Magicka + 0.728188*SpellDamage - 0.397214)",			//Update 11pts
							//"round(0.0182*Magicka + 0.728*SpellDamage - 0.03)",					//Update 10
							
									/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + ShockDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"1 + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"1 + ShockDamageDone - CP.ShockDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + ShockDamageDone + DamageDone + AOEDamageDone",
							"*", */
					),
			),
			
			"HAShockStaff" => array(
					"title" => "Heavy Attack Shock Staff",
					"round" => "round",
					"depends" => array("LAShockStaff", "HAShockStaffFinal"),
					"compute" => array(
							"HAShockStaffFinal",
							"LAShockStaff * 2",
							"+", 
					),
			),
			
			"HARestorationFinal" => array(	// 67022
					"title" => "Heavy Attack Restoration Final",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "LAMagicSpellDamage", "LAMagicWeaponDamage", "DamageDone", "SingleTargetDamageDone", "DirectDamageDone", "MagicDamageDone"),
					"compute" => array(
							"floor(fround(0.082143)*max(Magicka, Stamina)) + floor(fround(0.8625)*max(LAMagicSpellDamage, LAMagicWeaponDamage))", 	// Update 35 Exact
							//"3750",		// Update 35
							//"floor(fround(0.046575)*max(Magicka, Stamina)) + floor(fround(0.489038)*max(LAMagicSpellDamage, LAMagicWeaponDamage))", 	// Update 29 Exact
							//"0.046575*max(Magicka, Stamina) + 0.489038*max(LAMagicSpellDamage, LAMagicWeaponDamage)",									// Update 29
							//"0.0568945*max(Magicka, Stamina) + 0.597347*max(LAMagicSpellDamage, LAMagicWeaponDamage) - 0.998668",						// Update 28
							//"0.0465*Magicka + 0.48825*LAMagicSpellDamage",			// Update 26
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + MagicDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
					),
			),
			
			"HARestoration" => array(	// 16212 + 67022
					"title" => "Heavy Attack Restoration",
					"round" => "round",
					"depends" => array("LARestorationStaff", "HARestorationFinal"),
					"compute" => array(
							"LARestorationStaff",
							"2",
							"*",
							"HARestorationFinal",
							"+",
					),
			),
			
			"HAUnarmed" => array(	// 18429 (18431)
					"title" => "Heavy Attack Unarmed",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.0700)*max(Magicka, Stamina)) + floor(fround(0.7350)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"3875",		// Update 35
							//"floor(fround(0.07)*max(Magicka, Stamina)) + floor(fround(0.735)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.06996*max(Magicka, Stamina) + 0.73483*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.08754)",			// Update 29
							//"round(0.0699622*Stamina + 0.734782*HAPhysicalWeaponDamage - 0.178041)",													// Update 28: What it actually is
							//"round(0.0699622*max(Magicka, Stamina) + 0.734782*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.178041)",		// Update 28 What it is supposed to be
							//"round(0.0699437*Stamina + 0.73485*HAPhysicalWeaponDamage - 0.27499)",	// Update 21
							
									/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + PhysicalDamageDone + Skill.HAMeleeDamage + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HAOneHand" => array(	// 15279 (15829)
					"title" => "Heavy Attack One Hand",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.066667)*max(Magicka, Stamina)) + floor(fround(0.700)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"4275",		// Update 35
							//"floor(fround(0.07)*max(Magicka, Stamina)) + floor(fround(0.735)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0699402*max(Magicka, Stamina) + 0.734554*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) + 1.10766 )",		// Update 29
							//"round(0.0699608*max(Magicka, Stamina) + 0.73472*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.130863)",			// Update 28
							//"round(0.0699437*Stamina + 0.73485*HAPhysicalWeaponDamage - 0.27499)",	// Update 21
							//"round(0.0699164*Stamina + 0.734938*WeaponDamage + 0.0110695)",	// Update 18
							//"round(0.0327709*Stamina + 1.31231*WeaponDamage + 0.234536)",		// Update 14
							//"round(0.038698*Stamina + 1.54378*WeaponDamage - 2.03145)",		// Update 11pts
							//"round(0.03852*Stamina + 1.5436*WeaponDamage - 0.33)",			// Update 10
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + PhysicalDamageDone + Skill.HAMeleeDamage + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HATwoHand" => array(		// 16041 (17163)
					"title" => "Heavy Attack Two Hand",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.071429)*max(Magicka, Stamina)) + floor(fround(0.750)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"4500",		// Update 35
							//"floor(fround(0.072)*max(Magicka, Stamina)) + floor(fround(0.756)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.071964*max(Magicka, Stamina) + 0.756761*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 2.19699)",			// Update 29
							//"round(0.0718798*max(Magicka, Stamina) + 0.756019*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) + 0.150727)",		// Update 28
							//"round(0.0719181*Stamina + 0.755647*HAPhysicalWeaponDamage + 1.35513)",		// Update 21
							//"round(0.0719815*Stamina + 0.755865*WeaponDamage + 0.20861)",		// Update 18
							//"round(0.0374172*Stamina + 1.49589*WeaponDamage + 0.256685)",		// Update 14
							//"round(0.044067*Stamina + 1.7596*WeaponDamage - 0.45188)",		// Update 11pts
							//"round(0.123*Stamina + 1.283*WeaponDamage - 0.94)",				// Update 10
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + PhysicalDamageDone + Skill.HAMeleeDamage + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HABow" => array(	// 16691 (17173)
					"title" => "Heavy Attack Bow",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone", "BowDamageDone"),
					"compute" => array(
							"floor(fround(0.095238)*max(Magicka, Stamina)) + floor(fround(1.000)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"4777",		// Update 35
							//"floor(fround(0.094)*max(Magicka, Stamina)) + floor(fround(0.987)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.0940508*max(Magicka, Stamina) + 0.987346*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 2.60372)",			// Update 29
							//"round(0.0939428*max(Magicka, Stamina) + 0.986704*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.168718)",		// Update 28
							//"round(0.0939553*Stamina + 0.986829*HAPhysicalWeaponDamage - 0.247677)",		// Update 21
							//"round(0.0940809*Stamina + 0.986539*WeaponDamage - 1.45469)",		// Update 18
							//"round(0.0421126*Stamina + 1.68265*WeaponDamage - 1.43962)",		// Update 14
							//"round(0.0550887*Stamina + 2.20001*WeaponDamage - 1.90256)",		// Update 11pts
							//"round(0.0550*Stamina + 2.20*WeaponDamage - 0.95)",				// Update 10
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + BowDamageDone + Buff.Empower + SkillLineDamage.Bow",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",			// Update 14
							//"1 + CP.HABowDamage + CP.PhysicalDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + BowDamageDone + PhysicalDamageDone + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",  //TODO: Check BowDamageDone
							"*", */
					),
			),
			
			"HADualWield" => array(		// 16420 (17169 + 18622)
					"title" => "Heavy Attack Dual Wield",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.023810)*max(Magicka, Stamina)) + floor(fround(0.250)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							"floor(fround(0.023810)*max(Magicka, Stamina)) + floor(fround(0.250)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))",
							//"1938",		// Update 35
							//"1938",
							//"floor(fround(0.033)*max(Magicka, Stamina)) + floor(fround(0.3465)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"floor(fround(0.033)*max(Magicka, Stamina)) + floor(fround(0.3465)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 
							//"round(0.0328981*max(Magicka, Stamina) + 0.346912*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.500839)",		// Update 29
							//"round(0.0328981*max(Magicka, Stamina) + 0.346912*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 0.500839)",
							//"round(0.0331184*max(Magicka, Stamina) + 0.34582*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 1.60692 )",			// Update 28
							//"round(0.0331184*max(Magicka, Stamina) + 0.34582*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 1.60692 )",
							//"round(0.033017*Stamina + 0.346099*HAPhysicalWeaponDamage + 0.257098)",		// Update 21
							//"round(0.033017*Stamina + 0.346099*HAPhysicalWeaponDamage + 2.2571)",			// Update 21
							//"round(0.033036*Stamina + 0.346257*WeaponDamage - 0.228267)",		// Update 18
							//"round(0.033036*Stamina + 0.346257*WeaponDamage + 1.77173 )",		// Update 18
							//"round(0.0139542*Stamina + 0.557374*WeaponDamage - 0.139753)",	// Update 14
							//"round(0.0169856*Stamina + 0.680024*WeaponDamage + 2.09792)",		// Update 14
							//"round(0.0200506*Stamina + 0.799675*WeaponDamage + 2.03471)",		// Update 11pts
							//"round(0.01636*Stamina + 0.6556*WeaponDamage + 0.81)",			// Update 10
							//"round(0.0199*Stamina + 0.800*WeaponDamage + 3.82)",				// Update 10
							"+",
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower + SkillLineDamage.Dual_Wield",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + PhysicalDamageDone + Skill.HAMeleeDamage + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HAWerewolf" => array(	// 32477 (32480)
					"title" => "Heavy Attack Werewolf",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAPhysicalWeaponDamage", "HAPhysicalSpellDamage", "DamageDone", "DirectDamageDone", "PhysicalDamageDone"),
					"compute" => array(
							"floor(fround(0.071429)*max(Magicka, Stamina)) + floor(fround(0.750)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"4500",		// Update 35
							//"floor(fround(0.072)*max(Magicka, Stamina)) + floor(fround(0.756)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 29 Exact
							//"round(0.071964*max(Magicka, Stamina) + 0.756761*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) - 2.19699)",			// Update 29
							//"round(0.0718798*max(Magicka, Stamina) + 0.756019*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage) + 0.150727)",		// Update 28
							//"round(0.0719181*Stamina + 0.755647*HAPhysicalWeaponDamage + 1.35513)",		// Update 21
							//"round(0.0719815*Stamina + 0.755865*WeaponDamage + 0.20861)",		// Update 18
							//"round(0.0374172*Stamina + 1.49589*WeaponDamage + 0.256685)",		// Update 14
							//"round(0.05007*Stamina + 1.99937*WeaponDamage - 0.51345)",		// Update 11pts
							//"round(0.0440*Stamina + 1.76*WeaponDamage + 0.74)",				// Update 10
							
								/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + PhysicalDamageDone + DirectDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower",
							"*",
							
							/*
							"Skill2.HADamage",
							"+",
							"1 + CP.HAActiveDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + PhysicalDamageDone + Skill.HAMeleeDamage + DamageDone + DirectDamageDone - CP.PhysicalDamageDone - CP.DirectDamageDone",
							"*", */
					),
			),
			
			"HAOverload" => array(	// 24794
					"title" => "Heavy Attack Overload",
					"round" => "round",
					"depends" => array("Magicka", "Stamina", "HAShockSpellDamage", "HAShockWeaponDamage", "LAShockStaff", "DamageDone", "AOEDamageDone", "SingleTargetDamageDone", "ShockDamageDone", "OverloadDamage"),
					"compute" => array(
							"floor(fround(0.0900)*max(Magicka, Stamina)) + floor(fround(0.945)*max(HAPhysicalWeaponDamage, HAPhysicalSpellDamage))", 	// Update 35 Exact
							//"2024",		// Update 35
							//"floor(fround(0.09)*max(Magicka, Stamina)) + floor(fround(0.945)*max(HAShockSpellDamage, HAShockWeaponDamage))", 	// Update 29 Exact
							//"round(0.0898005*max(Magicka, Stamina) + 0.94525*max(HAShockSpellDamage, HAShockWeaponDamage) + 1.43798)",		// Update 29
 							
									/* Update 21 */
							"Skill2.HADamage",
							"+",
							"1 + CP.HADamage + Skill.HADamage + Set.HADamage + ShockDamageDone + AOEDamageDone + SingleTargetDamageDone + DamageDone + Buff.Empower + OverloadDamage",
							"*",
					),
			),
			
			"HASpeed" => array(
					"title" => "Heavy Attack Speed Modifier",
					"display" => "%",
					"compute" => array(
							"1",
					),
			),
					
			"Mitigation" => "StartSection",
									
			"AttackSpellMitigation" => array(
					"title" => "Attacker Spell Mitigation",
					"display" => "%",
					"depends" => array("SpellPenetration", "Skill2.PhysicalPenetration"),
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"min(33000, Target.SpellResist)",
							"Target.SpellDebuff",
							"+",
							"1 - Skill2.SpellPenetration",
							"*",
							"SpellPenetration",
							"-",
							"-1/(Target.EffectiveLevel * 1000)",
							"*",
							"1",
							"+",
							"1 - Target.DefenseBonus",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
				
			"AttackPhysicalMitigation" => array(
					"title" => "Attacker Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalPenetration", "Skill2.PhysicalPenetration"),
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"min(33000, Target.PhysicalResist)",
							"Target.PhysicalDebuff",
							"+",
							"1 - Skill2.PhysicalPenetration",
							"*",
							"PhysicalPenetration",
							"-",
							"-1/(Target.EffectiveLevel * 1000)",
							"*",
							"1",
							"+",
							"1 - Target.DefenseBonus",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
			
			
			"AttackSpellCritDamage" => array(
					"title" => "Attack Spell Critical Dmg",
					"display" => "%",
					"depends" => array("SpellCritDamage"),
					"min" => 0,
					"compute" => array(
							"SpellCritDamage",
							"Target.CritResist",
							"0.035/250",
							"*",
							"-",
					),
			),
			
			"AttackWeaponCritDamage" => array(
					"title" => "Attack Weapon Critical Dmg",
					"display" => "%",
					"depends" => array("WeaponCritDamage"),
					"min" => 0,
					"compute" => array(
							"WeaponCritDamage",
							"Target.CritResist",
							"0.035/250",
							"*",
							"-",
					),
			),
				
			"DefenseSpellMitigation" => array(
					"title" => "Defending Spell Mitigation",
					"display" => "%",
					"depends" => array("SpellResist", "MagicDamageTaken"),
					"compute" => array(
							"min(33000, SpellResist)",
							"1 - Target.PenetrationFactor",
							"*",
							"Target.PenetrationFlat",
							"-",
							"-1/(EffectiveLevel * 1000)",
							"*",
							"1",
							"+",
							"1 + Target.AttackBonus",
							"*",
							"1 + MagicDamageTaken",
							"*",
							"1 + DamageTaken",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
				
			"DefensePhysicalMitigation" => array(
					"title" => "Defending Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalResist", "PhysicalDamageTaken"),
					"compute" => array(
							"min(33000, PhysicalResist)",
							"1 - Target.PenetrationFactor",
							"*",
							"Target.PenetrationFlat",
							"-",
							"-1/(EffectiveLevel * 1000)",
							"*",
							"1",
							"+",
							"1 + Target.AttackBonus",
							"*",
							"1 + PhysicalDamageTaken",
							"*",
							"1 + DamageTaken",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
			
			"DefenseSpellAoEMitigation" => array(
					"title" => "Defending Spell AOE Mitigation",
					"display" => "%",
					"depends" => array("DefenseSpellMitigation", "AOEDamageTaken"),
					"compute" => array(
							"1 + AOEDamageTaken",
							"1 - DefensePhysicalMitigation",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
				
			"DefensePhysicalAoeMitigation" => array(
					"title" => "Defending Phys AOE Mitigation",
					"display" => "%",
					"depends" => array("DefensePhysicalMitigation", "AOEDamageTaken"),
					"compute" => array(
							"1 + AOEDamageTaken",
							"1 - DefensePhysicalMitigation",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
			
			"DefenseSpellDDMitigation" => array(
					"title" => "Defending Spell DD Mitigation",
					"display" => "%",
					"depends" => array("DefenseSpellMitigation", "DirectDamageTaken"),
					"compute" => array(
							"1 + DirectDamageTaken",
							"1 - DefensePhysicalMitigation",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
				
			"DefensePhysicalDDMitigation" => array(
					"title" => "Defending Phys DD Mitigation",
					"display" => "%",
					"depends" => array("DefensePhysicalMitigation", "DirectDamageTaken"),
					"compute" => array(
							"1 + DirectDamageTaken",
							"1 - DefensePhysicalMitigation",
							"*",
							"-1",
							"*",
							"1",
							"+",
					),
			),
			
			"DefenseCritDmg" => array(
					"title" => "Target Critical Dmg",
					"depends" => array("CritResist"),
					"display" => "%",
					"min" => 0,
					"max" => 1,
					//"addClass" => "esotbStatDivider",
					"compute" => array(
							"Target.CritDamage",
							"CritResist",
							"0.035/250",
							"*",
							"-",
					),
			),
			
			"Ability Costs" => "StartSection",
			
			/*
			 * HealthCost Confirmed
			 */
			"HealthCost" => array(
					"title" => "Health Ability Cost",
					"display" => "%",
					"compute" => array(
							"1 + Item.HealthCost",
							"1 + Skill.HealthCost",
							"*",
							"1 + Set.HealthCost",
							"*",
							"1 + Buff.HealthCost",
							"*",
							"1 + SkillCost.Regular_Ability_Cost",
							"*",
					),
			),
			
			/*
			 * MagickaCost Confirmed
			 */
			"MagickaCost" => array(
					"title" => "Magicka Ability Cost",
					//"round" => "floor",
					"display" => "%",
					//"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"1 + CP.MagickaCost",
							"1 + Item.MagickaCost",
							"*",
							"1 + Skill.MagickaCost",
							"*",
							"1 + Set.MagickaCost",
							"*",
							"1 + Buff.MagickaCost",
							"*",
							"1 + SkillCost.Regular_Ability_Cost",
							"*",
					),
			),
				
			/*
			 * StaminaCost Confirmed
			*/
			"StaminaCost" => array(
					"title" => "Stamina Ability Cost",
					//"round" => "floor",
					"display" => "%",
					//"addClass" => "esotbStatDivider",
					//"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"1 + CP.StaminaCost",
							"1 + Item.StaminaCost",
							"*",
							"1 + Skill.StaminaCost",
							"*",
							"1 + Set.StaminaCost",
							"*",
							"1 + Buff.StaminaCost",
							"*",
							"1 + SkillCost.Regular_Ability_Cost",
							"*",
					),
			),
			
			/*
			 * UltimateCost Confirmed
			 */
			"UltimateCost" => array(
					"title" => "Ultimate Ability Cost",
					"display" => "%",
					"compute" => array(
							"1 + Item.UltimateCost",
							"1 + Skill.UltimateCost",
							"*",
							"1 + Set.UltimateCost",
							"*",
							"1 + Buff.UltimateCost",
							"*",
							"1 + SkillCost.Regular_Ability_Cost",
							"*",
					),
			),
			
			"Traits" => "StartSection",
			
			/*
			 * Divines Confirmed
			 */
			"Divines" => array(
					"title" => "Divines Trait",
					"display" => "%",
					"compute" => array(
							"Item.Divines",
					),
			),
			
			/*
			 * Prosperous Confirmed (Pre-Update 15)
			 */
			/*
			"Prosperous" => array(
					"title" => "Prosperous Trait",
					"display" => "%",
					"compute" => array(
							"Item.Prosperous",
					),
			), */
			
			/*
			 * Sturdy Confirmed
			 */
			"Sturdy" => array(
					"title" => "Sturdy Trait",
					"display" => "%",
					"compute" => array(
							"Item.Sturdy",
					),
			),
			
			/*
			 * Training Confirmed
			 */
			"Training" => array(
					"title" => "Training Trait",
					"display" => "%",
					"compute" => array(
							"Item.Training",
					),
			),
			
			"Bloodthirsty" => array(
					"title" => "Bloodthirsty Trait",
					"compute" => array(
							"Item.Bloodthirsty",
					),
			),
			
			"BloodthirstySpellDamage" => array(
					"title" => "Bloodthirsty Spell Damage",
					"round" => "floor",
					"compute" => array(
							"1 - min(0.9, Target.PercentHealth)/0.9",
							"Item.Bloodthirsty",
							"*",
					),
			),
			
			"BloodthirstyWeaponDamage" => array(
					"title" => "Bloodthirsty Weapon Damage",
					"round" => "floor",
					"compute" => array(
							"1 - min(0.9, Target.PercentHealth)/0.9",
							"Item.Bloodthirsty",
							"*",
					),
			),
			
			"Other" => "StartSection",
			
			/*
			 * TODO
			 */
			"UltimateRestore" => array(
					"title" => "Ultimate Restoration",
					"round" => "floor",
					"compute" => array(
							"Item.UltimateRestore",
							"Set.UltimateRestore",
							"+",
					),
			),
			
			"PotionDuration" => array(
					"title" => "Potion Duration",
					"round" => "floor10",
					"suffix" => " sec",
					"compute" => array(
							"Item.PotionDuration",
							"Skill.PotionDuration",
							"+",
					),
			),
			
			"PotionCooldown" => array(
					"title" => "Potion Cooldown",
					"round" => "floor10",
					"suffix" => " sec",
					"compute" => array(
							"Item.PotionDuration",
							"Skill.PotionDuration",
							"+",
							"Set.PotionDuration",
							"+",
					),
			),
			
			
			// Sneak Attack Melee Damage
			//		= Base * (SneakBonus + CritMod)
			//			SneakBonus = 3.75 melee, 1.46 Ranged (PVE Only?)
			// MountSpeed
			
			//Physical/spell mitigation = (resistance - 100) / (level*10)
			//Mitigation = [Resist ÷ (Level × 1,000)] or  = (resistance-100)/(level+VR)*10
			// 50% cap on element + spell resistance
			//Flat Crit = 2 * (effectiveLevel) * (100 + effectiveLevel)

	);
	
		//TODO: Update 35pts
	public $COMPUTED_STATS_LIST_PTS = array(
			
			
	);
	
	
	public function __construct()
	{
		//UespMemcachedSession::install();
		
		$this->TEMPLATE_FILE = __DIR__."/templates/esoeditbuild_embed_template.txt";
		
		$this->buildDataViewer = new EsoBuildDataViewer(true, true);
		
		$this->viewCps = new CEsoViewCP(true, false);
		$this->viewCps->hideTopBar = false;
		$this->viewCps->shortDiscDisplay = true;
		$this->viewCps->useVersion2 = true;
		$this->viewCps->showFlatV2 = false;
		$this->viewCps->selectedDiscId = "fitness";
		
		$this->viewSkills = new CEsoViewSkills(true, "select", false);
		$this->viewSkills->showLeftDetails = false;
		$this->viewSkills->displayClass = "Dragonknight";
		$this->viewSkills->displayRace = "Argonian";
		$this->viewSkills->displayMenuBar = true;
		$this->viewSkills->displaySkillBar = true;
		
		$this->MakeInputStatsList();
		$this->SetInputParams();
		$this->ParseInputParams();
		$this->InitDatabase();
		$this->LoadTemplate();
	}
	
	
	public function ReportError($errorMsg)
	{
		$this->errorMessages[] = $errorMsg;
		error_log($errorMsg);
		return false;
	}
	
	
	public function ParseInputParams ()
	{
		if (array_key_exists('id', $this->inputParams)) $this->buildId = (int) ($this->inputParams['id']);
		if (array_key_exists('buildid', $this->inputParams)) $this->buildId = (int) ($this->inputParams['buildid']);
		
		if (array_key_exists('loadsets', $this->inputParams)) 
		{
			$value = $this->inputParams['loadsets'];
			
			if ($value == null)
				$this->loadSetNames = true;
			else
				$this->loadSetNames = ($value != 0);
		}
	}
	
	
	public function SetInputParams ()
	{
		global $argv;
		$this->inputParams = $_REQUEST;
	
			// Add command line arguments to input parameters for testing
		if ($argv !== null)
		{
			$argIndex = 0;
	
			foreach ($argv as $arg)
			{
				$argIndex += 1;
				if ($argIndex <= 1) continue;
				$e = explode("=", $arg);
	
				if(count($e) == 2)
				{
					$this->inputParams[$e[0]] = $e[1];
				}
				else
				{
					$this->inputParams[$e[0]] = 1;
				}
			}
		}
	}
	
	
	public function InitDatabase()
	{
		global $uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase;
	
		$this->db = new mysqli($uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase);
		if ($this->db->connect_error) return $this->ReportError("ERROR: Could not connect to mysql database!");
		
		UpdateEsoPageViews("buildEditorViews");
	
		return true;
	}
		
	
	public function LoadTemplate()
	{
		$this->htmlTemplate = file_get_contents($this->TEMPLATE_FILE);
		
		if (!$this->htmlTemplate)
		{
			$this->htmlTemplate = "Error: Failed to load HTML template file '".$this->TEMPLATE_FILE."'!";
			return false;
		}
		
		return true;
	}
	
	
	public function OutputHtmlHeader()
	{
		ob_start("ob_gzhandler");
		
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Pragma: no-cache");
		header("content-type: text/html");
	}
	
	
	public function MakeInputStatsList()
	{
		$this->INPUT_STATS_LIST = array();
		
		foreach ($this->STATS_UNIQUE_LIST as $statItem)
		{
			$statList = explode(".", $statItem);
			$count = count($statList);
			
			if ($count == 1)
			{
				$this->INPUT_STATS_LIST[$statList[0]] = 0;
			}
			else if ($count == 2)
			{
				$statBase = $statList[0];
				if (!array_key_exists($statBase, $this->INPUT_STATS_LIST) || $this->INPUT_STATS_LIST[$statBase] === null) $this->INPUT_STATS_LIST[$statBase] = array();
				$this->INPUT_STATS_LIST[$statBase][$statList[1]] = 0;
			}
		}
		
		foreach ($this->STATS_BASE_LIST as $stat)
		{
			$this->INPUT_STATS_LIST[$stat] = 0;
		}
		
		foreach ($this->STATS_TYPE_LIST as $statBase)
		{
			if (!array_key_exists($statBase, $this->INPUT_STATS_LIST) || $this->INPUT_STATS_LIST[$statBase] === null) $this->INPUT_STATS_LIST[$statBase] = array();
			
			foreach ($this->STATS_BASE_LIST as $stat)
			{
				$this->INPUT_STATS_LIST[$statBase][$stat] = 0;
			}
		}
	}
	
	
	public function GetInputStatDetailsJson()
	{
		return json_encode($this->INPUT_STAT_DETAILS);
	}
	
	
	public function GetComputedStatsJson()
	{
			//TODO: Remove this once fully moved to DB rules
		if (!$this->LOAD_RULES_FROM_DB) return json_encode($this->COMPUTED_STATS_LIST);
		
		$statCategories = [];
		
		foreach ($this->COMPUTED_STAT_CATEGORIES_OUTPUT as $catId => $category)
		{
			$statCategories[$category] = [];
		}
		
		foreach ($this->buildComputedStats as $id => $stat)
		{
			$category = $stat['category'];
			$statId = $stat['statId'];
			
			$longCat = $this->COMPUTED_STAT_CATEGORIES_OUTPUT[$category];
			if ($longCat) $category = $longCat;
			
			$statCategories[$category][$statId] = $stat;
		}
		
		foreach ($statCategories as $statCat => $stats)
		{
			uasort($statCategories[$statCat], ['EsoBuildDataEditor', 'SortStatsByIndex']);
		}
		
		$json = [];
		
		foreach ($statCategories as $statCat => $stats)
		{
			$json[$statCat] = 'StartSection';
			
			foreach ($stats as $statId => $stat)
			{
				$stat['round'] = $stat['roundNum'];
				unset($stat['roundNum']);
				
				$dependsOn = $stat['dependsOn'];
				$stat['depends'] = [];
				
				if ($dependsOn !== '')
				{
					$statJson = json_decode($dependsOn, true);
					if ($statJson !== null) $stat['depends'] = $statJson;
				}
				
				$stat['compute'] = json_decode($stat['compute'], true);
				$stat['value'] = 0;
				
				$json[$statId] = $stat;
			}
		}
		
		return json_encode($json);
	}
	
	
	public static function SortStatsByIndex($a, $b)
	{
		$idx1 = intval($a['idx']);
		$idx2 = intval($b['idx']);
		return $idx1 - $idx2;
	}
	
	
	public function GetInputStatsJson()
	{
		return json_encode($this->INPUT_STATS_LIST);
	}
	
	
	public function GetGearIconJson()
	{
		return json_encode($this->GEARSLOT_BASEICONS);
	}
	
	
	public function getCharField($field, $default = "")
	{
		if ($this->buildDataViewer->characterData === null) return $default;
		if (!array_key_exists($field, $this->buildDataViewer->characterData) || $this->buildDataViewer->characterData[$field] === null) return $default;
		return $this->buildDataViewer->escape($this->buildDataViewer->characterData[$field]);
	}
	
	
	public function getCharStatField($field, $default = "")
	{
		if ($this->buildDataViewer->characterData === null) return $default;
		if (!array_key_exists('stats', $this->buildDataViewer->characterData) || $this->buildDataViewer->characterData['stats'] === null)  return $default;
		if (!array_key_exists($field, $this->buildDataViewer->characterData['stats']) || $this->buildDataViewer->characterData['stats'][$field] === null) return $default;
		if (!array_key_exists('value', $this->buildDataViewer->characterData['stats'][$field]) || $this->buildDataViewer->characterData['stats'][$field]['value'] === null) return $default;
		return $this->buildDataViewer->escape($this->buildDataViewer->characterData['stats'][$field]['value']);
	}
	
	
	public function GetCharMundus($mundusIndex)
	{
		$foundIndex = 0;
		if ($this->buildDataViewer->characterData == null) return "";
		
		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			if (preg_match("#Boon\: (.*)#", $buff['name'], $matches))
			{
				++$foundIndex;
				if ($foundIndex >= $mundusIndex) return $matches[1];
			}
		}
		
		return "";
	}
	
	
	public function GetCharVampireStage()
	{
		$stage = (int) $this->getCharStatField("VampireStage", -1);
		if ($stage >= 0) return (int) $stage;
		
		if ($this->buildDataViewer->characterData == null) return 0;

		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			if (preg_match("#Stage ([0-9]+) Vampirism#", $buff['name'], $matches))
			{
				return (int) $matches[1];
			}
			
			if (preg_match("#Vampire Stage ([0-9]+)#", $buff['name'], $matches))
			{
				return (int) $matches[1];
			}
		}
	
		return 0;
	}
	
	
	public function GetCharWerewolfStage()
	{
		$stage = (int) $this->getCharStatField("WerewolfStage", -1);
		if ($stage >= 0) return (int) $stage;
		
		if ($this->buildDataViewer->characterData == null) return 0;
		
		$stage = 0;
		
		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			if ($buff['name'] == "Lycanthropy" && $stage == 0)
			{
				$stage = 1;
			}
			else if ($buff['name'] == "Lycanthropy")
			{
				$stage = 2;
			}
		}
	
		return $stage;
	}
	
		
	public function GetMundusListHtml($mundusIndex)
	{
		$output = "";
		$currentMundus = $this->GetCharMundus($mundusIndex);
		
		$selected = ($currentMundus == "") ? "selected" : "";
		$output .= "<option value='' $selected>(none)</option>";
		
		foreach ($this->MUNDUS_TYPES as $name => $type)
		{
			$selected = ($name == $currentMundus) ? "selected" : "";
			$output .= "<option value='$name' $selected>$name <small>($type)</small></option>";
		}
		
		return $output;
	}
	
	
	public function GetAllianceListHtml()
	{
		$output = "";
		$currentAlliance = $this->getCharField("alliance");
		
		foreach ($this->ALLIANCE_TYPES as $name)
		{
			$selected = ($name == $currentAlliance) ? "selected" : "";
			$output .= "<option value='$name' $selected>$name</option>";
		}
		
		return $output;
	}
	
	
	public function GetClassListHtml()
	{
		$output = "";
		
		$currentClass = $this->getCharField('class');
		if ($currentClass == "") $currentClass = "Dragonknight";
		
		foreach ($this->CLASS_TYPES as $class)
		{
			if ($class == "Arcanist" && !IsEsoVersionAtLeast($this->realRulesVersion, "38")) continue;
			$selected = ($currentClass == $class) ? "selected" : "";
			$output .= "<option value='$class' $selected>$class</option>";
		}
		
		return $output;
	}
	
	
	public function GetRaceListHtml()
	{
		$output = "";
		
		$currentRace = $this->getCharField('race');
		if ($currentRace == "") $currentRace = "Argonian";
		
		foreach ($this->RACE_TYPES as $name => $extra)
		{
			$extraDesc = "";
			if ($extra != "") $extraDesc = " ($extra)";
			$selected = ($currentRace == $name) ? "selected" : "";
			$output .= "<option value='$name' $selected>$name$extraDesc</option>";
		}
		
		return $output;
	}
	
	
	public function GetVampireListHtml()
	{
		$output = "";
		
		$currentStage = $this->GetCharVampireStage();
		
		foreach ($this->VAMPIRESTAGE_TYPES as $stage => $display)
		{
			$selected = ($currentStage == $stage) ? "selected" : "";
			$output .= "<option value='$stage' $selected>$display</option>";
		}
		
		return $output;
	}
	
	
	public function GetWerewolfListHtml()
	{
		$output = "";
		
		$currentStage = $this->GetCharWerewolfStage();
	
		foreach ($this->WEREWOLFSTAGE_TYPES as $stage => $display)
		{
			$selected = ($currentStage == $stage) ? "selected" : "";
			$output .= "<option value='$stage' $selected>$display</option>";
		}
	
		return $output;
	}
	
	
	public function GetCharacterEquippedItem($slotIndex) 
	{
		if ($slotIndex === null) return null;
		if ($this->buildDataViewer->characterData['equipSlots'] == null) return null;
		if (!array_key_exists($slotIndex, $this->buildDataViewer->characterData['equipSlots'])) return null;
		return $this->buildDataViewer->characterData['equipSlots'][$slotIndex];
	}
	
	
	public function ParseItemLink($itemLink)
	{
		$linkData = array();
		
		$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId1>[0-9]*)\:(?P<enchantSubtype1>[0-9]*)\:(?P<enchantLevel1>[0-9]*)\:(?P<transmuteTrait>[0-9]*)\:(?P<enchantSubtype2>[0-9]*)\:(?P<enchantLevel2>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<stolen>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h\[?(?P<name>[a-zA-Z0-9 %_\(\)\'\-]*)(?P<nameCode>.*?)\]?\|h/', $itemLink, $matches);
		
		if (!$result) 
		{
			$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId1>[0-9]*)\:(?P<enchantSubtype1>[0-9]*)\:(?P<enchantLevel1>[0-9]*)\:(?P<transmuteTrait>[0-9]*)\:(?P<enchantSubtype2>[0-9]*)\:(?P<enchantLevel2>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h\[?(?P<name>[a-zA-Z0-9 %_\(\)\'\-]*)(?P<nameCode>.*?)\]?\|h/', $itemLink, $matches);
			if (!$result) return $linkData;
		}
		
		$linkData['itemId'] = $matches['itemId'];
		$linkData['itemIntLevel'] = $matches['level'];
		$linkData['itemIntType'] = $matches['subtype'];
		
		$linkData['itemStyle'] = $matches['style'];
		$linkData['itemBound'] = $matches['bound'];
		$linkData['itemCrafted'] = $matches['crafted'];
		$linkData['itemCharges'] = $matches['charges'];
		$linkData['itemPotionData'] = $matches['potionData'];
		$linkData['itemStolen'] = $matches['stolen'];
		
		$linkData['enchantId1'] = $matches['enchantId1'];
		$linkData['enchantIntLevel1'] = $matches['enchantLevel1'];
		$linkData['enchantIntType1'] = $matches['enchantSubtype1'];
		
		$linkData['transmuteTrait'] = $matches['transmuteTrait'];
		
		//$linkData['enchantId2'] = $matches['enchantId2'];
		//$linkData['enchantIntLevel2'] = $matches['enchantLevel2'];
		//$linkData['enchantIntType2'] = $matches['enchantSubtype2'];
		
		return $linkData;
	}
	
	
	public function TransformItemDataForPts(&$intLevel, &$intType)
	{
		global $ESO_ITEMINTTYPE_QUALITYMAP;
		
		//if (!$this->getCharStatField("UsePtsRules", 0)) return false;
		if (!$this->transformItemData) return false;
		
		if ($intLevel == 1)
		{
			$intType = 1;
		}
		else if ($intLevel == 50)
		{
			$quality = $ESO_ITEMINTTYPE_QUALITYMAP[$intType];
			
			if ($quality == 1)
				$intType = 366;
			else if ($quality == 2)
				$intType = 367;
			else if ($quality == 3)
				$intType = 368;
			else if ($quality == 4)
				$intType = 369;
			else
				$intType = 370;
		}
		else
		{
			$intLevel = 50;
			$quality = $ESO_ITEMINTTYPE_QUALITYMAP[$intType];
			
			if ($quality == 1)
				$intType = 366;
			else if ($quality == 2)
				$intType = 367;
			else if ($quality == 3)
				$intType = 368;
			else if ($quality == 4)
				$intType = 369;
			else
				$intType = 370;
		}
		
		return true;
	}
	
	
	public function LoadInitialItemData($slotId, &$linkData)
	{
		$itemId = (int) $linkData['itemId'];
		$intLevel = (int) $linkData['itemIntLevel'];
		$intType = (int) $linkData['itemIntType'];
		
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
		
		$this->TransformItemDataForPts($intLevel, $intType);
		
		$item = LoadEsoMinedItemExact($this->db, $itemId, $intLevel, $intType, $this->ITEM_TABLE_SUFFIX);
		
		if (!$item)
		{
			$intLevel = 1;
			$intType = 1;
			$item = LoadEsoMinedItemExact($this->db, $itemId, $intLevel, $intType, $this->ITEM_TABLE_SUFFIX);
			if (!$item) return false;
		}
		
		$this->initialItemData[$slotId] = $item;
		$this->initialItemData[$slotId]["origTrait"] = $this->initialItemData[$slotId]["trait"];
		$this->initialItemData[$slotId]["origTraitDesc"] = $this->initialItemData[$slotId]["traitDesc"];
		
		if ($linkData['transmuteTrait'] > 0)
		{
			$this->initialItemData[$slotId]["trait"] = $linkData['transmuteTrait'];
			
			//$transmuteItemId = $ESO_ITEMTRANSMUTETRAIT_IDS[$linkData['transmuteTrait']];
			$transmuteItemId = GetEsoTransmuteTraitItemId($linkData['transmuteTrait'], $this->initialItemData[$slotId]['equipType']);
			
			if ($transmuteItemId != null)
			{
				//$query = "SELECT traitDesc, trait, internalLevel, internalSubtype FROM minedItem{$this->ITEM_TABLE_SUFFIX} WHERE itemId='$transmuteItemId' AND internalLevel='$intLevel' AND internalSubtype='$intType' LIMIT 1;";
				$minedTable = "minedItem{$this->ITEM_TABLE_SUFFIX}";
				$summaryTable = "minedItemSummary{$this->ITEM_TABLE_SUFFIX}";
				$query = "SELECT $minedTable.traitDesc, $summaryTable.trait, $minedTable.itemId, $minedTable.internalLevel, $minedTable.internalSubtype FROM $minedTable LEFT JOIN $summaryTable ON $minedTable.itemId=$summaryTable.itemId WHERE $minedTable.itemId='$transmuteItemId' AND $minedTable.internalLevel='$intLevel' AND $minedTable.internalSubtype='$intType' LIMIT 1;";
				$result = $this->db->query($query);
				
				if ($result)
				{
					$row = $result->fetch_assoc();
					
					$this->initialItemData[$slotId]["traitDesc"] = $row['traitDesc'];
					$this->initialItemData[$slotId]["transmuteTrait"] = $linkData['transmuteTrait'];
				}
				else
				{
					$this->ReportError("Failed to load item data for transmute item $transmuteItemId:$intLevel:$intType!");
				}
			}
		}
		
		$linkData['itemIntLevel'] = $intLevel;
		$linkData['itemIntType'] = $intType;
		
		$setName = $this->initialItemData[$slotId]['setName'];
		if ($setName != "") return $this->LoadInitialSetMaxData($setName, $linkData);
		
		return true;
	}
	
	
	public function LoadInitialEnchantData($slotId, &$linkData)
	{
		$itemId = (int) $linkData['enchantId1'];
		$intLevel = (int) $linkData['enchantIntLevel1'];
		$intType = (int) $linkData['enchantIntType1'];
	
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
		
		$this->TransformItemDataForPts($intLevel, $intType);
		
		$linkData['enchantIntLevel1'] = $intLevel;
		$linkData['enchantIntType1'] = $intType;
		
		/*$query = "SELECT * FROM minedItem{$this->ITEM_TABLE_SUFFIX} WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
		$result = $this->db->query($query);
		if (!$result) return $this->ReportError("Failed to load enchantment data for $slotId!");
		if ($result->num_rows == 0) return false;*/
		
		$item = LoadEsoMinedItemExact($this->db, $itemId, $intLevel, $intType, $this->ITEM_TABLE_SUFFIX);
		if (!$item) return false;
		
		$this->initialEnchantData[$slotId] = $item;
		
		return true;
	}
	
	
	public function LoadInitialSetMaxData($setName, $linkData)
	{
				/* Only load it once */
		if (!array_key_exists($setName, $this->initialSetMaxData) || $this->initialSetMaxData[$setName] != null) return true;
		
		$itemId = (int) $linkData['itemId'];
		$intLevel = 50;
		$intType = 370;
		
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
		
		/*
		$query = "SELECT * FROM minedItem{$this->ITEM_TABLE_SUFFIX} WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
		$result = $this->db->query($query);
		if (!$result) return $this->ReportError("Failed to load set max data for $setName!");
		if ($result->num_rows == 0) return false;*/
		
		$item = LoadEsoMinedItemExact($this->db, $itemId, $intLevel, $intType, $this->ITEM_TABLE_SUFFIX);
		if (!$item) return false;
		
		$this->initialSetMaxData[$setName] = $item;
		return true;
	}
	
	
	public function GetEquippedItemData($slotId, $load = false)
	{
			// TODO: Disabled items
		
		if ($slotId == "Food") return $this->GetFoodItemData();
		
		$output = "";
		$equipSlot = $this->SLOTID_TO_EQUIPSLOT[$slotId];
		$item = $this->GetCharacterEquippedItem($equipSlot);
		
		if ($item === null || $item['itemLink'] == "")
		{
			$imageSrc = $this->GEARSLOT_BASEICONS[$slotId];
			$output .= "src=\"$imageSrc\"";
			return $output;
		}
		
		$imageSrc = $this->buildDataViewer->convertIconToImageUrl($item['icon']);
		$output .= " src=\"$imageSrc\"";
		
		$linkData = $this->ParseItemLink($item['itemLink']);
		$setCount = $item['setCount'];
		
		$this->LoadInitialItemData($slotId, $linkData);
		$this->LoadInitialEnchantData($slotId, $linkData);
		
		$output .= " setcount=\"$setCount\"";
		$output .= " itemid=\"{$linkData['itemId']}\"";
		$output .= " intlevel=\"{$linkData['itemIntLevel']}\"";
		$output .= " inttype=\"{$linkData['itemIntType']}\"";
		$output .= " enchantid=\"{$linkData['enchantId1']}\"";
		$output .= " enchantintlevel=\"{$linkData['enchantIntLevel1']}\"";
		$output .= " enchantinttype=\"{$linkData['enchantIntType1']}\"";
		$output .= " trait=\"{$linkData['transmuteTrait']}\"";
				
		return $output;
	}
	
	
	public function GetEquippedItemName($slotId)
	{
		if ($slotId == "Food") return $this->GetFoodItemName();
		
		$equipSlot = $this->SLOTID_TO_EQUIPSLOT[$slotId];
		$item = $this->GetCharacterEquippedItem($equipSlot);
		if ($item === null) return "";
		
		return $item['name'];
	}
	
	
	public function GetFoodItemData()
	{
		$itemLink = $this->getCharStatField("LastFoodEatenLink", "");
		$output = "";
		$imageSrc = $this->GEARSLOT_BASEICONS["Food"];
		
		if ($itemLink == "")
		{
			return "src=\"$imageSrc\"";
		}
				
		$linkData = $this->ParseItemLink($itemLink);
		
		$output .= " itemid=\"{$linkData['itemId']}\"";
		$output .= " intlevel=\"{$linkData['itemIntLevel']}\"";
		$output .= " inttype=\"{$linkData['itemIntType']}\"";
		
		if ($this->LoadInitialItemData("Food", $linkData))
		{
			$icon = $this->initialItemData['Food']['icon'];
			$imageSrc = $this->buildDataViewer->convertIconToImageUrl($icon);
		}
		
		$output .= " src=\"$imageSrc\"";
		return $output;
	}
	
	
	public function GetFoodItemName()
	{
		return $this->getCharStatField("LastFoodEatenName", "");
	}	
	
	
	public function GetCPHtml()
	{
		return $this->viewCps->GetOutputHtml();
	}
	
	
	public function GetSkillHtml()
	{
		return $this->viewSkills->GetOutputHtml();
	}
	
	
	public static function escapeHtml($html)
	{
		return htmlspecialchars( $html,  ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401 );
	}
	
	
	public function OutputError($errorMsg)
	{
		$links = "You can <a href='https://en.uesp.net/wiki/Special:EsoBuildEditor'>Create a New Build</a> or <a href='https://en.uesp.net/wiki/Special:EsoBuildData'>Search for More Builds</a>.";
		return $errorMsg . "<br/>" . implode("<br/>", $this->errorMessages) . implode("<br>/", $this->buildDataViewer->errorMessages) . "<br/>" . $links;
	}
	
	
	public function CreateInitialItemData()
	{
		foreach ($this->EQUIPSLOT_TO_SLOTID as $equipSlot => $slotId)
		{
			$this->GetEquippedItemData($slotId, true);
		}
	}
	
	
	public function CreateInitialBuffData()
	{
		static $IGNORED_BUFFS = array(
				'ESO Plus Member' => [
					'count' => 0,
					'enabled' => 1,
				]
		);
		
		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			$buffName = $buff['name'];
			$enabled = $buff['enabled'];
			$count = $buff['count'];
			if ($enabled == 0) $enabled = 1;
			
			if ($buffName == "Spell Power Cure") $buffName = "Major Courage";
			
			$this->initialBuffData[$buffName] = [
					'count' => $count,
					'enabled' => $enabled,
			];
		}
	}
	
	
	public function CreateInitialCPData()
	{
		$this->viewCps->LoadCpData();
		
		$cpData = $this->buildDataViewer->characterData['championPoints'];
		
		$this->initialCpData = array();
		$this->initialCpData['points'] = 0;
		
		foreach ($cpData as $cp)
		{
			$names = explode(":", $cp['name']);
			$cpLine = $names[0];
			$cpSkill = $names[1];
			$points = $cp['points'];
			$abilityId = $cp['abilityId'];
			$slotIndex = $cp['slotIndex'];
			
			$skillData = $this->viewCps->cpSkills[$abilityId];
			if ($skillData && $skillData['clusterName']) $cpLine = $skillData['clusterName'];
			
			if ($this->initialCpData[$cpLine] === null)
			{
				 $this->initialCpData[$cpLine] = array();
				 $this->initialCpData[$cpLine]['points'] = 0;
			}
			
			$this->initialCpData[$cpLine][$cpSkill] = $points;
			
			if ($points > 0)
			{
				$this->initialCpData[$cpLine]['points'] += $points;
				$this->initialCpData['points'] += $points;
			}
			
			if ($slotIndex > 0)
			{
				if ($this->initialCpData['slots'] === null) $this->initialCpData['slots'] = array();
				$this->initialCpData['slots'][$slotIndex] = $abilityId;
			}
		}
		
		$this->viewCps->initialData = $this->initialCpData;
	}
	
	
	public function CreateInitialToggleSkillData()
	{
		$this->initialToggleSkillData = array();
		
		foreach ($this->buildDataViewer->characterData['stats'] as $name => $record)
		{
			$result = preg_match("/^ToggleSkill:(.*)$/", $name);
			if (!$result) continue;
			
			$names = explode(":", $name);
			$value = $record['value'];
			$skillName = $names[1];
			
			$count = null;
			if (array_key_exists(2, $names)) $count = $names[2];
			
			if (!array_key_exists($skillName, $this->initialToggleSkillData) || $this->initialToggleSkillData[$skillName] == null) $this->initialToggleSkillData[$skillName] = array();
			
			if ($count !== null)
				$this->initialToggleSkillData[$skillName]['count'] = $value;
			else
				$this->initialToggleSkillData[$skillName]['enabled'] = $value;
		}
	}
	
	
	public function CreateInitialToggleSetData()
	{
		$this->initialToggleSetData = array();
		
		foreach ($this->buildDataViewer->characterData['stats'] as $name => $record)
		{
			$result = preg_match("/^ToggleSet:(.*)$/", $name);
			if (!$result) continue;
				
			$names = explode(":", $name);
			$setName = $names[1];
			$value = $record['value'];
			
			$count = null;
			if (array_key_exists(2, $names)) $count = $names[2];
							
			if (!array_key_exists($setName, $this->initialToggleSetData) || $this->initialToggleSetData[$setName] == null) $this->initialToggleSetData[$setName] = array();
			//$this->initialToggleSetData[$setName]['enabled'] = $value;
			
			if ($count !== null)
				$this->initialToggleSetData[$setName]['count'] = $value;
			else
				$this->initialToggleSetData[$setName]['enabled'] = $value;
		}
	}
	
	
	public function CreateInitialToggleCpData()
	{
		$this->initialToggleCpData = array();
		
		foreach ($this->buildDataViewer->characterData['stats'] as $name => $record)
		{
			$result = preg_match("/^ToggleCp:(.*)$/", $name);
			if (!$result) continue;
				
			$names = explode(":", $name);
			$cpName = $names[1];
			$value = $record['value'];
			
			$count = null;
			if (array_key_exists(2, $names)) $count = $names[2];
							
			if (!array_key_exists($cpName, $this->initialToggleCpData) || $this->initialToggleCpData[$cpName] == null) $this->initialToggleCpData[$cpName] = array();
			$this->initialToggleCpData[$cpName]['enabled'] = $value;
			
			if ($count !== null)
				$this->initialToggleCpData[$cpName]['count'] = $value;
			else
				$this->initialToggleCpData[$cpName]['enabled'] = $value;
		}
		
		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			$buffName = $buff['name'];
			
			if ($buffName == "Exploiter Off-Balance")
			{
				$enabled = $buff['enabled'];
				if ($enabled == 0) $enabled = 1;
				if ($enabled) $this->initialToggleCpData["Exploiter"]['enabled'] = 1;
			}
		}
	}
	
	
	public function CreateInitialCombatActionsData()
	{
			$this->initialCombatActionsData = array();
			
			foreach ($this->buildDataViewer->characterData['combatActions'] as $name => $record)
			{
				$actions = $record['playerActions'];
				$this->initialCombatActionsData[$name] = $actions;
			}
	}
	
	
	public function CreateNewInitialSkillData()
	{
		global $ESO_FREE_SKILLS;
		global $ESO_FREE_RACIAL_SKILLS;
		
		foreach ($ESO_FREE_SKILLS as $skillId => $skillType)
		{
			$race = $ESO_FREE_RACIAL_SKILLS[$skillId];
			if ($race != null && $race != $this->viewSkills->displayRace) continue;
			
			$this->initialSkillData[$skillId] = 1;
			
			$skillCharData = array();
			$skillCharData['type'] = $skillType;
			$skillCharData['abilityId'] = $skillId;
			$skillCharData['description'] = "";
			$skillCharData['rank'] = 1;
			
			if ($skillType == "passive")
				$this->initialPassiveSkillData[$skillId] = $skillCharData;
			else
				$this->initialActiveSkillData[$skillId] = $skillCharData;
		}
		
		$this->viewSkills->initialData = $this->initialSkillData;
		$this->viewSkills->activeData = $this->initialActiveSkillData;
		$this->viewSkills->passiveData = $this->initialPassiveSkillData;
	}
	
	
	public function CreateInitialSkillData()
	{
		$isNew = ($this->buildId <= 0 || $this->buildId == null);
		
		$this->viewSkills->displayClass = $this->getCharField('class', 'Dragonknight');
		$this->viewSkills->displayRace = $this->getCharField('race', 'Argonian');
		
		if ($this->viewSkills->displayClass == "Arcanist")
			$this->viewSkills->highlightSkillId = 183709;
		if ($this->viewSkills->displayClass == "Dragonknight")
			$this->viewSkills->highlightSkillId = 33963;
		else if ($this->viewSkills->displayClass == "Nightblade")
			$this->viewSkills->highlightSkillId = 37518;
		else if ($this->viewSkills->displayClass == "Sorcerer")
			$this->viewSkills->highlightSkillId = 30538;
		else if ($this->viewSkills->displayClass == "Templar")
			$this->viewSkills->highlightSkillId = 23784;
		else if ($this->viewSkills->displayClass == "Warden")
			$this->viewSkills->highlightSkillId = 85985;
		else if ($this->viewSkills->displayClass == "Necromancer")
			$this->viewSkills->highlightSkillId = 115001;
		
		$this->initialSkillData = array();
		$this->initialSkillData['UsedPoints'] = $this->getCharStatField("SkillPointsUsed", 0);
		$this->initialSkillData['UnusedPoints'] = $this->getCharStatField("SkillPointsUnused", 0);
		$this->initialSkillData['TotalPoints'] = $this->getCharStatField("SkillPointsTotal", 0);
		
		if ($isNew) 
		{
			$this->CreateNewInitialSkillData();
			return;
		}
		
		foreach ($this->buildDataViewer->characterData['skills'] as $skillName => $skillData)
		{
			$names = explode(":", $skillName);
			$skillType = $names[0];
			$skillLine = $names[1];
			$skillName = $names[2];
			if ($skillName === null || $skillLine === null) continue;
			
			$type = $skillData['type'];
			$desc = $skillData['description'];
			$abilityId = $skillData['abilityId'];
			$rank = $skillData['rank'];
			$morph = 0;
			
			$this->initialSkillData[$abilityId] = $rank;
			
			if ($type != "passive")
			{
				if ($rank > 8)
				{
					$morph = 2;
					$rank -= 8;
				}
				else if ($rank > 4)
				{
					$morph = 1;
					$rank -= 4;
				}
			}
			
			$data = array();
			$baseAbilityId = $this->viewSkills->FindBaseAbilityForActiveData($abilityId);
			//error_log("{$this->buildId}: BaseAbility for $abilityId = $baseAbilityId");
			
			$data['abilityId'] = $abilityId;
			$data['baseAbilityId'] = $baseAbilityId;
			$data['morph'] = $morph;
			$data['rank'] = $rank;
			$data['skillDesc'] = $skillData['description'];
			
			if ($type == "passive")
				$data['abilityType'] = "Passive";
			else if ($type == "skill")
				$data['abilityType'] = "Active";
			else if ($type == "ultimate")
				$data['abilityType'] = "Ultimate";
			
			if ($type == "passive")
				$this->initialPassiveSkillData[$baseAbilityId] = $data;
			else
				$this->initialActiveSkillData[$baseAbilityId] = $data;
		}
		
		$this->viewSkills->initialData = $this->initialSkillData;
		$this->viewSkills->activeData = $this->initialActiveSkillData;
		$this->viewSkills->passiveData = $this->initialPassiveSkillData;
	}
	
	
	public function CreateInitialSkillBarData()
	{
		$this->initialSkillBarData = array();
		$this->initialSkillBarData[0] = array();
		$this->initialSkillBarData[1] = array();
		$this->initialSkillBarData[2] = array();
		$this->initialSkillBarData[3] = array();
		
		for ($i = 0; $i < 4; ++$i)
		{
			for ($j = 0; $j < 6; ++$j)
			{
				$this->initialSkillBarData[$i][$j] = array();
				$this->initialSkillBarData[$i][$j]['skillId'] = 0;
			}
		}
		
		$actionBars = $this->buildDataViewer->characterData['actionBars'];
		
		foreach ($actionBars as $barSlot)
		{
			$index = $barSlot['index'];
			$abilityId = $barSlot['abilityId'];
			
			$barIndex = 0;
			if ($index > 100) $barIndex = 1;
			if ($index > 200) $barIndex = 2;
			if ($index > 300) $barIndex = 3;
			$slotIndex = ($index % 100) - 3;
			
			$barData = array();
			$barData['skillId'] = $abilityId;
			$barData['origSkillId'] = $this->viewSkills->FindBaseAbilityForActiveData($abilityId);
			$barData['skillDesc'] = $barSlot['description'];
			$barData['skillType'] = (($slotIndex < 5) ? "Active" : "Ultimate");
			
			$this->initialSkillBarData[$barIndex][$slotIndex] = $barData;
		}
		
		$this->viewSkills->initialSkillBarData = $this->initialSkillBarData;
		$this->viewSkills->activeSkillBar = $this->getCharStatField("ActiveAbilityBar", 1);
		
		if ($this->getCharStatField("Werewolf", 0) > 0) $this->viewSkills->enableWerewolf = true;
		if ($this->getCharField('class') == "Sorcerer") $this->viewSkills->enableOverload = false;
		
		$this->viewSkills->activeWeaponBar3 = $this->getCharStatField("Bar3:ActiveWeaponBar", "-1"); 
		$this->viewSkills->activeWeaponBar4 = $this->getCharStatField("Bar4:ActiveWeaponBar", "-1");
	}

	
	public function GetClassWeaponBar($weaponBar)
	{
		$activeBar = $this->GetActiveWeaponBar();
		if ($activeBar == $weaponBar) return "esotbWeaponSelect";
		return "";
	}
	
	
	public function GetActiveWeaponBar()
	{
		return $this->getCharStatField("ActiveWeaponBar", 1);
	}
	
	
	public function GetActiveAbilityBar()
	{
		return $this->getCharStatField("ActiveAbilityBar", 1);
	}
	
	
	public function GetBuildRulesJson()
	{
		if (!$this->LOAD_RULES_FROM_DB) return [];
		
		$json = [];
		$rulesByType = [];
		
		foreach ($this->buildRules as $ruleId => &$rule)
		{
			$ruleType = $rule['ruleType'];
			
			if ($rule['customData'] != '')
			{
				$json = json_decode($rule['customData'], true);
				
				if ($json)
				{
					foreach ($json as $key => $value)
					{
						if (!array_key_exists($key, $rule)) $rule[$key] = $value;
					}
				}
			}
			
			$rule['enableOffBar'] = $rule['enableOffBar'] == 1 ? true : false;
			$rule['isToggle'] = $rule['isToggle'] == 1 ? true : false;
			$rule['isEnabled'] = $rule['isEnabled'] == 1 ? true : false;
			$rule['isVisible'] = $rule['isVisible'] == 1 ? true : false;
			
			if ($rule['maxTimes']) $rule['maxTimes'] = intval($rule['maxTimes']);
			$rule['id'] = intval($rule['id']);
			
			$rulesByType[$ruleType][$ruleId] = &$rule;
		}
		
		$json = $rulesByType;
		
			// TODO: For debugging only
		$json['effects'] = $this->buildRuleEffects;
		$json['stats'] = $this->buildComputedStats;
		
		return json_encode($json);
	}
	
	
	public function SetCharStatField($statId, $value)
	{
		if ($this->buildDataViewer->characterData === null) return false;
		if (!array_key_exists('stats', $this->buildDataViewer->characterData) || $this->buildDataViewer->characterData['stats'] === null) return false;
		
		$charId = $this->buildId;
		if ($charId == null) $charId = -1;
		
		$this->buildDataViewer->characterData['stats'][$statId] = [];
		$this->buildDataViewer->characterData['stats'][$statId]['characterId'] = $charId;
		$this->buildDataViewer->characterData['stats'][$statId]['name']= $statId;
		$this->buildDataViewer->characterData['stats'][$statId]['value']= $value;
		
		return true;
	}
	
	
	public function LoadRulesFromDb()
	{
		$db = $this->buildDataViewer->db;
		
		$usePtsRules = $this->getCharStatField("UsePtsRules", "");
		$currentVersion = $this->getCharStatField("RulesVersion", "");
		
		if ($currentVersion == "")
		{
			$currentVersion = "Live";
			if ($usePtsRules > 0) $currentVersion = "PTS";
			$this->SetCharStatField("RulesVersion", $currentVersion);
		}
		
		$this->rulesVersion = $currentVersion;
		
		if ($currentVersion == "Live")
		{
			$currentVersion = $this->LIVE_RULES_VERSION;
		}
		else if ($currentVersion == "PTS")
		{
			$currentVersion = $this->PTS_RULES_VERSION;
		}
		
		if ($usePtsRules)
		{
			$this->SetCharStatField("UsePtsRules", 0);
		}
		
		$this->realRulesVersion = $currentVersion;
		$this->SetCharStatField("RealRulesVersion", $currentVersion);
		
		$safeVersion = $db->real_escape_string($currentVersion);
		$query = "SELECT * FROM rules WHERE version='$safeVersion';";
		
		$this->buildRules = [];
		$this->buildRuleEffects = [];
		$this->buildComputedStats = [];
		
		$result = $db->query($query);
		if ($result === false) return $this->reportError("Error: Failed to load rules for version $safeVersion! " . $db->error);
		
		while ($row = $result->fetch_assoc())
		{
			$ruleId = intval($row['id']);
			$row['ruleId'] = $ruleId;
			
			$this->buildRules[$ruleId] = $row;
		}
		
		$query = "SELECT * FROM effects WHERE version='$safeVersion';";
		$result = $db->query($query);
		if ($result === false) return $this->reportError("Error: Failed to load rule effects for version $safeVersion! " . $db->error);
		
		while ($row = $result->fetch_assoc())
		{
			$effectId = intval($row['id']);
			$row['effectId'] = $effectId;
			
			$ruleId = intval($row['ruleId']);
			
			$row['round'] = $row['roundNum'];
			unset($row['roundNum']);
			
			$this->buildRules[$ruleId]['effects'][] = $row;
			$this->buildRuleEffects[] = $row;
		}
		
		$query = "SELECT * FROM computedStats WHERE version='$safeVersion';";
		$result = $db->query($query);
		if ($result === false) return $this->reportError("Error: Failed to load computedStats for version $safeVersion! " . $db->error);
		
		while ($row = $result->fetch_assoc())
		{
			$id = intval($row['id']);
			$this->buildComputedStats[$id] = $row;
		}
		
		$this->ruleVersions = [];
		$this->ruleVersions[] = "Live";
		$this->ruleVersions[] = "PTS";
		
		$query = "SELECT * FROM versions ORDER BY version";
		$result = $db->query($query);
		if ($result === false) return $this->reportError("Error: Failed to load rule versions! " . $db->error);
		
		while ($row = $result->fetch_assoc())
		{
			$this->ruleVersions[] = $row['version'];
		}
		
		return true;
	}
	
	
	public function LoadBuild()
	{
		if ($this->buildId === null)
		{
			$this->CreateInitialSkillData();
			
			if ($this->LOAD_RULES_FROM_DB)
			{
				$this->LoadRulesFromDb();
			}
			else
			{
				$this->rulesVersion = "";
				$this->realRulesVersion = "";
			}
			
			return true;
		}
		
		$this->buildDataViewer->characterId = $this->buildId;
		
		if (!$this->buildDataViewer->loadCharacter()) return false;
		
		if ($this->LOAD_RULES_FROM_DB)
		{
			$this->LoadRulesFromDb();
			
			if ($this->realRulesVersion != $this->LIVE_RULES_VERSION)
			{
				$this->transformItemData = true;
				$this->viewSkills->version = $this->realRulesVersion;
				$this->viewCps->version = $this->realRulesVersion;
				$this->ITEM_TABLE_SUFFIX = $this->realRulesVersion;
			}
		}
		else if ($this->getCharStatField("UsePtsRules", 0))
		{
			$this->transformItemData = true;
			$this->rulesVersion = $this->PTS_VERSION;
			$this->realRulesVersion = $this->PTS_VERSION;
			$this->viewSkills->version = $this->PTS_VERSION;
			$this->viewCps->version = $this->PTS_VERSION;
			$this->ITEM_TABLE_SUFFIX = $this->PTS_VERSION;
		}
		else
		{
			$this->rulesVersion = "";
			$this->realRulesVersion = "";
		}
		
		$this->viewSkills->LoadData();
		
		$this->FixupBuildForPts();
		$this->FixupUpdate21RacialSkills();
		
		$this->CreateInitialItemData();
		$this->CreateInitialBuffData();
		$this->CreateInitialCPData();
		$this->CreateInitialSkillData();
		$this->CreateInitialSkillBarData();
		$this->CreateInitialToggleSkillData();
		$this->CreateInitialToggleSetData();
		$this->CreateInitialToggleCpData();
		$this->CreateInitialCombatActionsData();
		
		$this->FixupBuildForPtsPost();
		
		return true;
	}
	
	
	public function GetBuildDataJson()
	{
		$buildData = array();
		
		$buildData['id'] = -1;
		
		if ($this->buildDataViewer->characterData != null)
		{
			foreach ($this->buildDataViewer->characterData as $key => $value)
			{
				if (is_array($value)) continue;
				$buildData[$key] = $value;
			}
		}
		
		$buildData['wikiUserName'] = $this->GetWikiUserName();
		$buildData['canEdit'] = $this->buildDataViewer->canWikiUserEdit();
		$buildData['canDelete'] = $this->buildDataViewer->canWikiUserDelete();
		$buildData['canCreate'] = $this->buildDataViewer->canWikiUserCreate();
		
		return json_encode($buildData);
	}
	
	
	public function GetWikiUserName()
	{
		return $this->buildDataViewer->getWikiUserName();
	}
	
	
	public function GetSaveButtonDisabled()
	{
		if ($this->buildId <= 0)
			$canEdit = $this->buildDataViewer->canWikiUserCreate();
		else
			$canEdit = $this->buildDataViewer->canWikiUserEdit();
		
		if (!$canEdit) return "disabled";
		return "";
	}
	
	
	public function GetCreateCopyButtonDisabled()
	{
		if ($this->buildId < 0)
			$canCreate = false;
		else
			$canCreate = $this->buildDataViewer->canWikiUserCreate();
		
		if (!$canCreate || $this->buildId <= 0) return "disabled";
		return "";
	}
	
	
	public function GetDeleteButtonDisabled()
	{
		if ($this->buildId < 0)
			$canDelete = false;
		else
			$canDelete = $this->buildDataViewer->canWikiUserDelete();
		
		if (!$canDelete || $this->buildId <= 0) return "disabled";
		return "";
	}
	
	
	public function GetSaveNote()
	{
		$isNew = ($this->buildId <= 0);
		
		$canDelete = $this->buildDataViewer->canWikiUserDelete();
		$canCreate = $this->buildDataViewer->canWikiUserCreate();
		
		if ($isNew)
			$canEdit = $canCreate;
		else
			$canEdit = $this->buildDataViewer->canWikiUserEdit();
		
		if ($isNew)
		{
			if (!$canCreate) return "You can modify this new build data but you will not be able to save it. Login or create a Wiki account in order to save and create new builds.";
			if (!$canEdit) return "You can modify this new build data but you will not be able to save it.  Login or create a Wiki account in order to save and create new builds.";
			return "You can save this new build data.";
		}
		
		if (!$canCreate) return "You can modify this existing build data but you will not be able to save it or create a new copy of it. Login or create a Wiki account in order to save and create new builds.";
		if (!$canEdit) return "You can modify this existing build data but you will not be able to save it. You can, however, create a new copy of the build data you will can save.";
		return "You can save this existing build data or create a new copy of it.";
	}
	
	
	public function GetBreadcrumbTrailHtml()
	{
		$baseLink = "/wiki/Special:EsoBuildData";
		$myLink = $baseLink . "?filter=mine";
		$thisLink = $baseLink . "?id=" . $this->buildId;
		$buildName = $this->getCharField("buildName");
		
		$output  = "<div id='esotbTrail'>";
		$output .= "	<a href='$baseLink'>&laquo; View All Builds</a> : ";
		$output .= "	<a href='$myLink'>View My Builds</a>";
		if ($this->buildId > 0) $output .= " : <a href='$thisLink'>View This Build</a>";
		
		if ($this->buildId <= 0) 
			$output .= " : <b>Editing New Build</b>";
		elseif ($this->buildDataViewer->canWikiUserEdit())
			$output .= " : <b>Editing Build $buildName</b>";
		else
			$output .= " : <b>Viewing Build $buildName</b>";
			
		$output .= "</div>";
		return $output;
	}
	
	
	public function GetStealthCheckState()
	{
		$stealth = $this->getCharStatField("Stealth", "0");
		if ($stealth > 0) return "checked";
		return "";
	}
	
	
	public function GetCyrodiilCheckState()
	{
		$flag = $this->getCharStatField("Cyrodiil", "0");
		if ($flag > 0) return "checked";
		return "";
	}
	
	
	public function GetEnableRaceAutoPurchaseState()
	{
		$flag = $this->getCharStatField("AutoPurchaseRacialPassives", "0");
		if ($flag > 0) return "checked";
		return "";
	}
	
	
	public function GetEnableCPCheckState()
	{
		$flag = $this->getCharStatField("CP:Enabled", "1");
		if ($flag > 0) return "checked";
		return "";
	}
	
	
	public function GetUsePtsRulesCheckState()
	{
		$flag = $this->getCharStatField("UsePtsRules", "0");
		if ($flag > 0) return "checked";
		return "";
	}
	
	public function getCharTargetResist()
	{
		$resist = $this->getCharStatField("Target:Resistance", "18200");
		if ($resist <= 0) $resist = "18200";
		return $resist;
	}
	
	public function GetValueCheckState($value)
	{
		if ($value > 0) return "checked";
		return "";
	}
	
	
	public function GetCharStatCheckState($stat, $default)
	{
		$value = $this->getCharStatField($stat, $default);
		if ($value > 0) return "checked";
		return "";
	}
	
	
	public function FixupComputedStatsForPts()
	{
		$this->COMPUTED_STATS_LIST = array_merge($this->COMPUTED_STATS_LIST, $this->COMPUTED_STATS_LIST_PTS);
	}
	

	public function FixupUpdate21RacialSkills()
	{
		$currentRace = $this->getCharField('race');
		
		if ($currentRace == "High Elf")	
			$this->ReplaceSkillsFromBuild(array(35995 => 117968, 45259 => 117969, 45260 => 117970));
		else if ($currentRace == "Khajiit") 
			$this->ReplaceSkillsFromBuild(array(36022 => 117846, 45295 => 117847, 45296 => 117848));
		else if ($currentRace == "Redguard")
			$this->RemoveSkillsFromBuild(array(36153 => 117752, 45279 => 117753, 45280 => 117754));
	}
	
	
	public function ReplaceSkillsFromBuild($skillsToReplace)
	{
		$skillsToDelete = array();
		$newSkills = array();
		
		foreach ($this->buildDataViewer->characterData['skills'] as $skillName => $skillData)
		{
			$abilityId = $skillData['abilityId'];
			$newAbilityId = $skillsToReplace[$abilityId];
	
			if ($newAbilityId == null) continue;
			$abilityData = $this->viewSkills->skillIds[$newAbilityId];
			if ($abilityData == null) continue;
			
			$skillsToDelete[] = $skillName;
			
			$newSkill = $skillData;
			$newName = str_replace("::", ":", $abilityData['skillTypeName'] . "::" . $abilityData['name']);

			$newSkill['name'] = $newName;
			$newSkill['description'] = $abilityData['description'];
			$newSkill['icon'] = $abilityData['icon'];
			$newSkill['abilityId'] = $abilityData['abilityId'];
		
			$newSkills[$newName] = $newSkill;
		}
		
		foreach ($skillsToDelete as $skillName)
		{
			unset($this->buildDataViewer->characterData['skills'][$skillName]);
		}
		
		foreach ($newSkills as $skillName => $skillData)
		{
			$this->buildDataViewer->characterData['skills'][$skillName] = $skillData;
		}

	}
	
	
	public function RemoveSkillsFromBuild($skillsToRemove)
	{
		$skillsToDelete = array();
		
		foreach ($this->buildDataViewer->characterData['skills'] as $skillName => $skillData)
		{
			$abilityId = $skillData['abilityId'];
	
			if ($skillsToRemove[$abilityId])
			{
				$skillsToDelete[] = $skillName;
			}
		}
		
		foreach ($skillsToDelete as $skillName)
		{
			unset($this->buildDataViewer->characterData['skills'][$skillName]);
		}
	}
	
	
	//TODO: Remove?
	public function FixupBuildForPts()
	{
		if (!$this->getCharStatField("UsePtsRules", 0)) return false;
		
		$this->FixupComputedStatsForPts();
		
		return true;
	}
	
	
	//TODO: Remove?
	public function FixupBuildForPtsPost()
	{
		if (!$this->getCharStatField("UsePtsRules", 0)) return false;
		
			//Make sure new PTS builds have the new free passives
			//TODO: Update29pts Remove after update 29?
		$newPassives = array(152778, 150185, 150181, 152780, 150184);
		
		foreach ($newPassives as $skillId) 
		{
			$this->initialSkillData[$skillId] = 1;
			
			$skillCharData = array();
			$skillCharData['type'] = "passive";
			$skillCharData['abilityId'] = $skillId;
			$skillCharData['description'] = "";
			$skillCharData['rank'] = 1;
			
			$this->initialPassiveSkillData[$skillId] = $skillCharData;
		}
		
		$this->viewSkills->initialData = $this->initialSkillData;
		$this->viewSkills->passiveData = $this->initialPassiveSkillData;
	}
	
	
	public function LoadSetNamesData()
	{
		global $uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase;
		
		$dbLog = new mysqli($uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase);
		if ($dbLog->connectError) return $this->ReportError("Could not connect to MySQL uesp_esolog database!");
		
		$this->setNames = array();
		$query = "SELECT setName from uesp_esolog.setSummary;";
		
		$result = $dbLog->query($query);
		if (!$result) return $this->ReportError("Failed to load set name data!");
		
		$result->data_seek(0);
		
		while (($row = $result->fetch_assoc()))
		{
			$this->setNames[] = $row['setName'];
		}
		
		sort($this->setNames);
		
		$dbLog->close();
		return true;
	}
	
	
	public function GetRulesVersionOptions()
	{
		$usePtsRules = $this->getCharStatField("UsePtsRules", "");
		$currentVersion = $this->getCharStatField("RulesVersion", "");
		
		if ($currentVersion == "")
		{
			$currentVersion = "Live";
			if ($usePtsRules > 0) $currentVersion = "PTS"; 
		}
		
		$output = "";
		
		foreach ($this->ruleVersions as $version)
		{
			$selected = "";
			if ($currentVersion == $version) $selected = "selected";
			
			$safeVersion = $this->escapeHtml($version);
			$output .= "<option $selected>$safeVersion</option>\n";
		}
		
		return $output;
	}
	
	
	public function GetSetNamesJson()
	{
		if ($this->loadSetNames) $this->LoadSetNamesData();
		return json_encode($this->setNames);
	}
	
	
	public function CreateOutputHtml()
	{
		$replacePairs = array(
				'{version}' => $this->version,
				'{esoComputedStatsJson}' => $this->GetComputedStatsJson(),
				'{esoInputStatsJson}' => $this->GetInputStatsJson(),
				'{esoInputStatDetailsJson}' => $this->GetInputStatDetailsJson(),
				'{gearIconJson}' => $this->GetGearIconJson(),
				'{buildDataJson}' => $this->GetBuildDataJson(),
				'{raceList}' => $this->GetRaceListHtml(),
				'{classList}' => $this->GetClassListHtml(),
				'{mundusList}' => $this->GetMundusListHtml(1),
				'{mundusList2}' => $this->GetMundusListHtml(2),
				'{vampireList}' => $this->GetVampireListHtml(),
				'{werewolfList}' => $this->GetWerewolfListHtml(),
				'{allianceList}' => $this->GetAllianceListHtml(),
				'{cpHtml}' => $this->GetCPHtml(),
				'{skillHtml}' => $this->GetSkillHtml(),
				'{gearIconHead}' => $this->GEARSLOT_BASEICONS['Head'],
				'{gearIconShoulders}' => $this->GEARSLOT_BASEICONS['Shoulders'],
				'{gearIconChest}' => $this->GEARSLOT_BASEICONS['Chest'],
				'{gearIconHands}' => $this->GEARSLOT_BASEICONS['Hands'],
				'{gearIconWaist}' => $this->GEARSLOT_BASEICONS['Waist'],
				'{gearIconLegs}' => $this->GEARSLOT_BASEICONS['Legs'],
				'{gearIconFeet}' => $this->GEARSLOT_BASEICONS['Feet'],
				'{gearIconNeck}' => $this->GEARSLOT_BASEICONS['Neck'],
				'{gearIconRing1}' => $this->GEARSLOT_BASEICONS['Ring1'],
				'{gearIconRing2}' => $this->GEARSLOT_BASEICONS['Ring2'],
				'{gearIconMainHand1}' => $this->GEARSLOT_BASEICONS['MainHand1'],
				'{gearIconOffHand1}' => $this->GEARSLOT_BASEICONS['OffHand1'],
				'{gearIconPoison1}' => $this->GEARSLOT_BASEICONS['Poison1'],
				'{gearIconMainHand2}' => $this->GEARSLOT_BASEICONS['MainHand2'],
				'{gearIconOffHand2}' => $this->GEARSLOT_BASEICONS['OffHand2'],
				'{gearIconPoison2}' => $this->GEARSLOT_BASEICONS['Poison2'],
				'{gearIconFood}' => $this->GEARSLOT_BASEICONS['Food'],
				'{gearIconPotion}' => $this->GEARSLOT_BASEICONS['Potion'],
				'{buildName}' => $this->getCharField('buildName'),
				'{charName}'  => $this->getCharField('name'),
				'{level}' => $this->getCharStatField('Level', '50'),
				'{effectiveLevel}' => $this->getCharStatField('EffectiveLevel', '66'),
				'{CPTotalPoints}' => $this->getCharField('cp', '160'),
				'{BaseWalkSpeed}' => $this->getCharStatField("BaseWalkSpeed", "3.0"),
				'{MountSpeedBonus}' => $this->getCharStatField("RidingSpeed", "0"),
				'{vampireStage}' => $this->GetCharVampireStage(),
				'{werewolfStage}' => $this->GetCharWerewolfStage(),
				'{attributeTotal}' => $this->getCharStatField("AttributesTotal", "0"),
				'{attributeHealth}' => $this->getCharStatField("AttributesHealth", "0"),
				'{attributeMagicka}' => $this->getCharStatField("AttributesMagicka", "0"),
				'{attributeStamina}' => $this->getCharStatField("AttributesStamina", "0"),
				'{targetFlatPene}' => $this->getCharStatField("Target:PenetrationFlat", "0"),
				'{targetFactPene}' => $this->getCharStatField("Target:PenetrationFactor", "0%"),
				'{targetFactDefense}' => $this->getCharStatField("Target:DefenseBonus", "0%"),
				'{targetFactAttack}' => $this->getCharStatField("Target:AttackBonus", "0%"),
				'{targetResist}' => $this->getCharTargetResist(),
				'{targetCritResistFlat}' => $this->getCharStatField("Target:CritResistFlat", "0"),
				'{targetEffectiveLevel}' => $this->getCharStatField("Target:EffectiveLevel", "66"),
				//'{targetCritResistFactor}' => $this->getCharStatField("Target:CritResistFactor", "0%"),
				'{targetCritDamage}' => $this->getCharStatField("Target:CritDamage", "50%"),
				'{targetCritChance}' => $this->getCharStatField("Target:CritChance", "50%"),
				'{targetPercentHealth}' => $this->getCharStatField("Target:PercentHealth", "100%"),
				'{miscSpellCost}' => $this->getCharStatField("Misc:SpellCost", "3000"),
				'{itemDataHead}' => $this->GetEquippedItemData('Head'),
				'{itemDataShoulders}' => $this->GetEquippedItemData('Shoulders'),
				'{itemDataChest}' => $this->GetEquippedItemData('Chest'),
				'{itemDataHands}' => $this->GetEquippedItemData('Hands'),
				'{itemDataWaist}' => $this->GetEquippedItemData('Waist'),
				'{itemDataLegs}' => $this->GetEquippedItemData('Legs'),
				'{itemDataFeet}' => $this->GetEquippedItemData('Feet'),
				'{itemDataNeck}' => $this->GetEquippedItemData('Neck'),
				'{itemDataRing1}' => $this->GetEquippedItemData('Ring1'),
				'{itemDataRing2}' => $this->GetEquippedItemData('Ring2'),
				'{itemDataMainHand1}' => $this->GetEquippedItemData('MainHand1'),
				'{itemDataOffHand1}' => $this->GetEquippedItemData('OffHand1'),
				'{itemDataPoison1}' => $this->GetEquippedItemData('Poison1'),
				'{itemDataMainHand2}' => $this->GetEquippedItemData('MainHand2'),
				'{itemDataOffHand2}' => $this->GetEquippedItemData('OffHand2'),
				'{itemDataPoison2}' => $this->GetEquippedItemData('Poison2'),
				'{itemDataFood}' => $this->GetEquippedItemData('Food'),
				'{itemNameHead}' => $this->GetEquippedItemName('Head'),
				'{itemNameShoulders}' => $this->GetEquippedItemName('Shoulders'),
				'{itemNameChest}' => $this->GetEquippedItemName('Chest'),
				'{itemNameHands}' => $this->GetEquippedItemName('Hands'),
				'{itemNameWaist}' => $this->GetEquippedItemName('Waist'),
				'{itemNameLegs}' => $this->GetEquippedItemName('Legs'),
				'{itemNameFeet}' => $this->GetEquippedItemName('Feet'),
				'{itemNameNeck}' => $this->GetEquippedItemName('Neck'),
				'{itemNameRing1}' => $this->GetEquippedItemName('Ring1'),
				'{itemNameRing2}' => $this->GetEquippedItemName('Ring2'),
				'{itemNameMainHand1}' => $this->GetEquippedItemName('MainHand1'),
				'{itemNameOffHand1}' => $this->GetEquippedItemName('OffHand1'),
				'{itemNamePoison1}' => $this->GetEquippedItemName('Poison1'),
				'{itemNameMainHand2}' => $this->GetEquippedItemName('MainHand2'),
				'{itemNameOffHand2}' => $this->GetEquippedItemName('OffHand2'),
				'{itemNamePoison2}' => $this->GetEquippedItemName('Poison2'),
				'{itemNameFood}' => $this->GetEquippedItemName('Food'),
				'{initialItemDataJson}' => json_encode($this->initialItemData),
				'{initialEnchantDataJson}' => json_encode($this->initialEnchantData),
				'{initialSetMaxDataJson}' => json_encode($this->initialSetMaxData),
				'{initialBuffDataJson}' => json_encode($this->initialBuffData),
				'{initialCpDataJson}' => json_encode($this->initialCpData),
				'{initialSkillDataJson}' => json_encode($this->initialSkillData),
				'{initialToggleSkillDataJson}' => json_encode($this->initialToggleSkillData),
				'{initialToggleSetDataJson}' => json_encode($this->initialToggleSetData),
				'{initialToggleCpDataJson}' => json_encode($this->initialToggleCpData),
				'{initialCombatActionsJson}' => json_encode($this->initialCombatActionsData),
				'{weaponBarClass1}' => $this->GetClassWeaponBar(1),
				'{weaponBarClass2}' => $this->GetClassWeaponBar(2),
				'{activeWeaponBar}' => $this->GetActiveWeaponBar(),
				'{activeSkillBar}' =>  $this->GetActiveAbilityBar(),
				'{saveButtonDisabled}' => $this->GetSaveButtonDisabled(),
				'{createCopyButtonDisabled}' => $this->GetCreateCopyButtonDisabled(),
				'{deleteButtonDisabled}' => $this->GetDeleteButtonDisabled(),
				'{saveNote}' => $this->GetSaveNote(),
				'{trail}' => $this->GetBreadcrumbTrailHtml(),
				'{stealth}' => $this->GetStealthCheckState(),
				'{cyrodiil}' => $this->GetCyrodiilCheckState(),
				'{enableCP}' => $this->GetEnableCPCheckState(),
				'{enableRaceAutoPurchase}' => $this->GetEnableRaceAutoPurchaseState(),
				'{usePtsRules}' => $this->getCharStatField("UsePtsRules", "0"),
				'{usePtsRulesCheck}' => $this->GetUsePtsRulesCheckState(),
				'{setNamesJson}' => $this->GetSetNamesJson(),
				'{BuildDescription}' => $this->getCharStatField("BuildDescription", ""),
				'{ptsVersion}' => $this->PTS_VERSION,
				'{useLAWeaving}' => $this->GetCharStatCheckState("useLAWeaving", "1"),
				'{startWithFullUltimate}' => $this->GetCharStatCheckState("startWithFullUltimate", "0"),
				'{stayInOverload}' => $this->GetCharStatCheckState("stayInOverload", "1"),
				'{showDamageDetails}' => $this->GetCharStatCheckState("showDamageDetails", "1"),
				'{showSkillCast}' => $this->GetCharStatCheckState("showSkillCast", "1"),
				'{showBuffs}' => $this->GetCharStatCheckState("showBuffs", "1"),
				'{showToggles}' => $this->GetCharStatCheckState("showToggles", "1"),
				'{showStatusEffects}' => $this->GetCharStatCheckState("showStatusEffects", "1"),
				'{showRegen}' => $this->GetCharStatCheckState("showRegen", "1"),
				'{showRestore}' => $this->GetCharStatCheckState("showRestore", "1"),
				'{showBarSwaps}' => $this->GetCharStatCheckState("showBarSwaps", "1"),
				'{showRollDodge}' => $this->GetCharStatCheckState("showRollDodge", "1"),
				'{buildRulesJson}' => $this->GetBuildRulesJson(),
				'{oldVersionDisplay}' => $this->LOAD_RULES_FROM_DB ? "none" : "block",
				'{newVersionDisplay}' => $this->LOAD_RULES_FROM_DB ? "block" : "none",
				'{rulesVersionOptions}' => $this->GetRulesVersionOptions(),
				'{rulesVersion}' => $this->escapeHtml($this->rulesVersion),
				'{realRulesVersion}' => $this->escapeHtml($this->realRulesVersion),
				'{liveRulesVersion}' => $this->escapeHtml($this->LIVE_RULES_VERSION),
				'{ptsRulesVersion}' => $this->escapeHtml($this->PTS_RULES_VERSION),
		);
		
		$output = strtr($this->htmlTemplate, $replacePairs);
		return $output;
	}
	

	public function DebugSessionData()
	{
		global $_SESSION, $_COOKIE;
	
		$canEditBuilds   = $_SESSION['UESP_ESO_canEditBuild'];
		$canDeleteBuilds = $_SESSION['UESP_ESO_canDeleteBuild'];
		$canCreateBuilds = $_SESSION['UESP_ESO_canCreateBuild'];
		$wikiUser = $_SESSION['wsUserName'];
		$sessionId = session_id();
		$currentDate = date("Y-m-d H:i:s");
		
		$sessionName = session_name();
		$cookie = $_COOKIE[$sessionName];
		
		$cookieParams = session_get_cookie_params();
	
		$output = "EsoBuildSession Set: $currentDate\n";
		$output .= "\tsessionId = $sessionId\n";
		$output .= "\tsessionName = $sessionName\n";
		$output .= "\tsessionCookie = $cookie\n";
		$output .= "\tsessionDomain = {$cookieParams['domain']}\n";
		$output .= "\tbuildId = {$this->buildId}\n";
		$output .= "\torigBuildId = {$this->origBuildId}\n";
		$output .= "\twikiUser = $wikiUser\n";
		$output .= "\tcanEditBuilds = {$_SESSION['UESP_ESO_canEditBuild']}\n";
		$output .= "\tcanDeleteBuilds = {$_SESSION['UESP_ESO_canDeleteBuild']}\n";
		$output .= "\tcanCreateBuilds = {$_SESSION['UESP_ESO_canCreateBuild']}\n";
		$output .= "\tUESP_EsoMap_canEdit = {$_SESSION['UESP_EsoMap_canEdit']}\n";
		$output .= "\tuesp_eso_morrowind = {$_SESSION['uesp_eso_morrowind']}\n";
		
		$newKey = wfMemcKey( 'MWSession', $sessionId);
		$output .= "\tNew Key = $newKey\n";
		
		foreach ($_COOKIE as $name => $val)
		{
			//$output .= "\t$name = '$val'\n";
		}
		
		file_put_contents($this->SESSION_DEBUG_FILENAME, $output, FILE_APPEND | LOCK_EX);
	}
	
	
	public function SetSessionData()
	{
		global $wgRequest;
		
		$wgRequest->setSessionData('UESP_ESO_canEditBuild', false);
		$wgRequest->setSessionData('UESP_ESO_canDeleteBuild', false);
		$wgRequest->setSessionData('UESP_ESO_canCreateBuild', false);
		
		if ($this->wikiContext == null) return $this->ReportError("Failed to setup session data!");
		
		$wgRequest->setSessionData('UESP_ESO_canEditBuild', $this->buildDataViewer->canWikiUserEdit());
		$wgRequest->setSessionData('UESP_ESO_canDeleteBuild', $this->buildDataViewer->canWikiUserDelete());
		$wgRequest->setSessionData('UESP_ESO_canCreateBuild', $this->buildDataViewer->canWikiUserCreate());
		
		$this->DebugSessionData();
	}
	
	
	public function GetOutputHtml()
	{
		
		if (!$this->LoadBuild())
		{
			return $this->OutputError("Could not find the specified character build! It was likely deleted by the owner and is no longer available.");
		}
		
		$this->SetSessionData();
		
		return $this->CreateOutputHtml();
	}
	
	
	public function Render()
	{
		$this->OutputHtmlHeader();
		print($this->GetOutputHtml());
	}
	
};



