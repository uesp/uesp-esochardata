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
	public $PTS_VERSION = "49pts";	//TODO: Remove?
	
	public $LOAD_RULES_FROM_DB = true;
	public $LIVE_RULES_VERSION = "49";
	public $PTS_RULES_VERSION  = "49pts";
	
	public $READONLY = false;
	
	public $SESSION_DEBUG_FILENAME = "/var/log/httpd/esoeditbuild_sessions.log";
	
	public $TEMPLATE_FILE = "";
	
		/* Set to false when update 21 goes live */
	public $REMOVE_NEW_UPDATE21_RACIALS = false;
	
	public $db = null;
	public $htmlTemplate = "";
	public $version = "";
	public $debug = false;
	
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
			"Head" 		=> "//esobuilds-static.uesp.net/resources/gearslot_head.png",
			"Shoulders" => "//esobuilds-static.uesp.net/resources/gearslot_shoulders.png",
			"Chest" 	=> "//esobuilds-static.uesp.net/resources/gearslot_chest.png",
			"Hands" 	=> "//esobuilds-static.uesp.net/resources/gearslot_hands.png",
			"Waist" 	=> "//esobuilds-static.uesp.net/resources/gearslot_belt.png",
			"Legs" 		=> "//esobuilds-static.uesp.net/resources/gearslot_legs.png",
			"Feet" 		=> "//esobuilds-static.uesp.net/resources/gearslot_feet.png",
			"Neck"		=> "//esobuilds-static.uesp.net/resources/gearslot_neck.png",
			"Ring1"		=> "//esobuilds-static.uesp.net/resources/gearslot_ring.png",
			"Ring2"		=> "//esobuilds-static.uesp.net/resources/gearslot_ring.png",
			"MainHand1" => "//esobuilds-static.uesp.net/resources/gearslot_mainhand.png",
			"MainHand2" => "//esobuilds-static.uesp.net/resources/gearslot_mainhand.png",
			"OffHand1" 	=> "//esobuilds-static.uesp.net/resources/gearslot_offhand.png",
			"OffHand2" 	=> "//esobuilds-static.uesp.net/resources/gearslot_offhand.png",
			"Poison1" 	=> "//esobuilds-static.uesp.net/resources/gearslot_poison.png",
			"Poison2"	=> "//esobuilds-static.uesp.net/resources/gearslot_poison.png",
			"Food"		=> "//esobuilds-static.uesp.net/resources/gearslot_quickslot.png",
			"Potion"	=> "//esobuilds-static.uesp.net/resources/gearslot_quickslot.png",
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
			"Target.HealingTaken",
			"Target.HealingReduction",
			"Target.DamageTaken",
			"Target.DamageDone",
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
			"SkillLineDamage.Two_Handed",
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
			"Skill2.DestructionPenetration",
			"EnchantPotencyMainHand1",
			"EnchantCooldownMainHand1",
			"EnchantPotencyMainHand2",
			"EnchantCooldownMainHand2",
			"EnchantPotencyOffHand1",
			"EnchantCooldownOffHand1",
			"EnchantPotencyOffHand2",
			"EnchantCooldownOffHand2",
			"Item.EnchantCooldown",
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
			"Set.StatusEffectChance",
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
			"Set.DisableSetBonus",
			"Buff.MinorCount",
			"Buff.MajorCount",
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
			"CrowdControlDuration",
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
			"ClassSpellDamage",
			"ClassWeaponDamage",
			"StatusDamageDone",
			"FlatDamageDone",
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
			
			"CP.MagickaHealingCost" => array( "display" => "%" ),
			"CP.StaminaHealingCost" => array( "display" => "%" ),
			
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
			"SkillLineDamage.Siphoning" => array( "display" => "%" ),
			"SkillLineDamage.Two_Handed" => array( "display" => "%" ),
			"SkillHealing.Siphoning" => array( "display" => "%" ),
			"SkillCost.Siphoning_Cost" => array( "display" => "%" ),
			
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
			
			"Skill.ClassSpellDamage"  => array("display" => "%"),
			"Skill.ClassWeaponDamage" => array("display" => "%"),
			"Skill.ChannelDamageDone" => array("display" => "%"),
			"Skill.StatusDamageDone" => array("display" => "%"),
			
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
			
			"Set.HealingDone" => array(
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
			
			"Set.DirectDamageDone" => array(
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
			
			"Target.HealingTaken" => array(
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
			
			"Target.DamageDone" => array(
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
			
			"SkillCost.Bone_Goliath_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Bone_Goliath_Transformation_Cost" => array(
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
			
			"Set.FlameDamageDone" => array(
					"display" => "%",
			),
			
			"Set.ShockDamageDone" => array(
					"display" => "%",
			),
			
			"Set.BurningDamage" => array(
					"display" => "%",
			),
			
			"Set.ChilledDamage" => array(
					"display" => "%",
			),
			
			"Set.ConcussionDamage" => array(
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
			
			"Skill2.CritResist" => array(
					"display" => "%",
			),
			
			"Set.DotDamageTaken" => array(
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
			"Set.StatusEffectChance" => array( "display" => "%" ),
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
			"Skill.BleedDamageDone" => array( "display" => "%" ),
			"Set.PhysicalDotDamageDone" => array( "display" => "%" ),
			"Set.DiseaseDotDamageDone" => array( "display" => "%" ),
			"Skill.DiseaseDamageDone" => array( "display" => "%" ),
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
			"Buff.CritDamageTaken" => array( "display" => "%" ),
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
			"Set.CrowdControlDuration" => array( "display" => "%" ),
			"Target.CrowdControlDuration" => array( "display" => "%" ),
			"Set.WeaponTraitEffect" => array( "display" => "%" ),
			"Set.BahseiMania" => array( "display" => "%" ),
	);
	
	
	public $COMPUTED_STATS_LIST = [];
	public $COMPUTED_STATS_LIST_PTS = [];
	
	
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
		$this->viewSkills->LOAD_CRAFTED_SKILLS = true;
		$this->viewSkills->PERMIT_SUBCLASSING = true;
		
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
		
		if (array_key_exists('dev', $this->inputParams) || array_key_exists('debug', $this->inputParams))
		{
			$this->debug = true;
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
		
		$this->db->query("SET NAMES utf8;");
		$this->db->query("SET CHARACTER SET utf8;");
		
		UpdateEsoPageViews("buildEditorViews");
		
		return true;
	}
	
	
	public function LoadTemplate()
	{
		$this->htmlTemplate = utf8_encode(file_get_contents($this->TEMPLATE_FILE));
		
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
		return $this->SafeJsonEncode($this->INPUT_STAT_DETAILS);
	}
	
	
	public function GetComputedStatsJson()
	{
			//TODO: Remove this once fully moved to DB rules
		if (!$this->LOAD_RULES_FROM_DB) return $this->SafeJsonEncode($this->COMPUTED_STATS_LIST);
		
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
		
		return $this->SafeJsonEncode($json);
	}
	
	
	public static function SortStatsByIndex($a, $b)
	{
		$idx1 = intval($a['idx']);
		$idx2 = intval($b['idx']);
		return $idx1 - $idx2;
	}
	
	
	public function GetInputStatsJson()
	{
		return $this->SafeJsonEncode($this->INPUT_STATS_LIST);
	}
	
	
	public function GetGearIconJson()
	{
		return $this->SafeJsonEncode($this->GEARSLOT_BASEICONS);
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
		
		//error_log("CreateNewInitialSkillData Finished");
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
			error_log("{$this->buildId}: BaseAbility for $abilityId = $baseAbilityId");
			
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
			
			if ($skillData['craftData'])
			{
				$scriptIds = explode(",", $skillData['craftData']);
				$data['craftData'] = $skillData['craftData'];
				if ($scriptIds[0]) $data['scriptId1'] = $scriptIds[0];
				if ($scriptIds[1]) $data['scriptId2'] = $scriptIds[1];
				if ($scriptIds[2]) $data['scriptId3'] = $scriptIds[2];
			}
			
			if ($type == "passive")
				$this->initialPassiveSkillData[$baseAbilityId] = $data;
			else
				$this->initialActiveSkillData[$baseAbilityId] = $data;
		}
		
		$this->viewSkills->initialData = $this->initialSkillData;
		$this->viewSkills->activeData = $this->initialActiveSkillData;
		$this->viewSkills->passiveData = $this->initialPassiveSkillData;
		$this->viewSkills->charStats = $this->buildDataViewer->characterData['stats'];
		
		//error_log("CreateInitialSkillData Finished");
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
	
	
	public function SafeJsonEncode($data)
	{
		$json = json_encode($data);
		if ($json === false) return [];
		return $json;
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
		
		return $this->SafeJsonEncode($json);
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
		
		if ($currentVersion == "Live" || $currentVersion == "test")
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
		$this->CreateInitialSkillData();
		$this->viewSkills->UpdateCraftedSkillData();
		
		$this->FixupBuildForPts();
		$this->FixupUpdate21RacialSkills();
		
		$this->CreateInitialItemData();
		$this->CreateInitialBuffData();
		$this->CreateInitialCPData();
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
		
		return $this->SafeJsonEncode($buildData);
	}
	
	
	public function GetWikiUserName()
	{
		return $this->buildDataViewer->getWikiUserName();
	}
	
	
	public function GetSaveButtonDisabled()
	{
		if ($this->READONLY) return "disabled";
		
		if ($this->buildId <= 0)
			$canEdit = $this->buildDataViewer->canWikiUserCreate();
		else
			$canEdit = $this->buildDataViewer->canWikiUserEdit();
		
		if (!$canEdit) return "disabled";
		return "";
	}
	
	
	public function GetCreateCopyButtonDisabled()
	{
		if ($this->READONLY) return "disabled";
		
		if ($this->buildId < 0)
			$canCreate = false;
		else
			$canCreate = $this->buildDataViewer->canWikiUserCreate();
		
		if (!$canCreate || $this->buildId <= 0) return "disabled";
		return "";
	}
	
	
	public function GetDeleteButtonDisabled()
	{
		if ($this->READONLY) return "disabled";
		
		if ($this->buildId < 0)
			$canDelete = false;
		else
			$canDelete = $this->buildDataViewer->canWikiUserDelete();
		
		if (!$canDelete || $this->buildId <= 0) return "disabled";
		return "";
	}
	
	
	public function GetSaveNote()
	{
		if ($this->READONLY) return "Builds have been set to read-only for maintenance.";
		
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
		
		$dbLog->query("SET NAMES utf8;");
		$dbLog->query("SET CHARACTER SET utf8;");
		
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
		return $this->SafeJsonEncode($this->setNames);
	}
	
	public function CleanArrayStrings(&$array) {
		array_walk($array, function(&$value) {
			if (is_array($value)) {
				$this->CleanArrayStrings($value);
			} else {
				$value = str_replace("\xEF\xBF\xBD", " ", $value);
			}
		});
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
				'{initialItemDataJson}' => $this->SafeJsonEncode($this->initialItemData),
				'{initialEnchantDataJson}' => $this->SafeJsonEncode($this->initialEnchantData),
				'{initialSetMaxDataJson}' => $this->SafeJsonEncode($this->initialSetMaxData),
				'{initialBuffDataJson}' => $this->SafeJsonEncode($this->initialBuffData),
				'{initialCpDataJson}' => $this->SafeJsonEncode($this->initialCpData),
				'{initialSkillDataJson}' => $this->SafeJsonEncode($this->initialSkillData),
				'{initialToggleSkillDataJson}' => $this->SafeJsonEncode($this->initialToggleSkillData),
				'{initialToggleSetDataJson}' => $this->SafeJsonEncode($this->initialToggleSetData),
				'{initialToggleCpDataJson}' => $this->SafeJsonEncode($this->initialToggleCpData),
				'{initialCombatActionsJson}' => $this->SafeJsonEncode($this->initialCombatActionsData),
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



