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
 */

require_once("/home/uesp/secrets/esolog.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/esolog.static/viewCps.class.php");
require_once("/home/uesp/esolog.static/viewSkills.class.php");
require_once(__DIR__."/viewBuildData.class.php");
# require_once("/home/uesp/www/esomap/UespMemcachedSession.php");


class EsoBuildDataEditor 
{
	public $SESSION_DEBUG_FILENAME = "/var/log/httpd/esoeditbuild_sessions.log";
	
	public $TEMPLATE_FILE = "";
	
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
	
	public $wikiContext = null;
	
	
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
			"Item.Divines",
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
			"WeaponRestStaff",
			"WeaponDestStaff",
			"WeaponFlameStaff",
			"WeaponColdStaff",
			"WeaponShockStaff",
			"Weapon1HShield",
			"WeaponOffHandDamage",
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
			"Target.SpellResist",
			"Target.PhysicalResist",
			"Target.PenetrationFactor",
			"Target.PenetrationFlat",
			"Target.DefenseBonus",
			"Target.AttackBonus",
			"Target.CritDamage",
			"Target.CritChance",
			"Target.CritResistFlat",
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
			"SkillCost.Ardent_Flame_Cost",
			"SkillCost.Draconic_Power_Cost",
			"SkillCost.Earthern_Heart_Cost",
			"SkillCost.Assassination_Cost",
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
			"Stealthed",
			"Skill.HAMagRestoreRestStaff",
			"Skill.HAStaRestoreWerewolf",
			"SkillDuration.Placeholder",
			"SkillDamage.Placeholder",
			"SkillLineDamage.Placeholder",
			"SkillHealing.Placeholder",
			"SkillLineWeaponDmg.base",
			"SkillLineSpellDmg.base",
			"SkillBonusWeaponDmg.base",
			"SkillBonusSpellDmg.base",
			"SkillDirectDamage.Placeholder",
			"Item.ChannelSpellDamage",
			"Buff.Empower",
			"CP.HAActiveDamage",
			"CP.LAActiveDamage",
			"Cyrodiil",
			"DrinkBuff",
			"FoodBuff",
			"Skill.SingleTargetDamageDone",
			"Skill.AOEDamageDone",
			"Skill.AOEHealingDone",
			"Skill.AOEDamageTaken",
			"MountSpeedBonus",
			"BaseWalkSpeed",
			"Skill.NormalSneakSpeed",
			"CP.TargetRecovery",
			"CP.InspirationGained",
			"Skill.DestructionPenetration",
			"Item.EnchantPotency1",
			"Item.EnchantCooldown1",
			"Item.EnchantPotency2",
			"Item.EnchantCooldown2",
			"Item.EnchantCooldown",
			"Set.ClassSpellDamage",
			"Set.ClassWeaponDamage",
			"Item.SynergyBonus",
			"Item.ExecuteBonus",
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
	);
	
	
	public $STATS_BASE_LIST = array(
			"Health",
			"Magicka",
			"Stamina",
			"HealthRegen",
			"MagickaRegen",
			"StaminaRegen",
			"WeaponDamage",
			"SpellDamage",
			"WeaponCrit",
			"SpellCrit",
			"CritDamage",
			"SpellCritDamage",
			"WeaponCritDamage",
			"SpellResist",
			"PhysicalResist",
			"FlameResist",
			"ColdResist",
			"PoisonResist",
			"DiseaseResist",
			"ShockResist",
			"CritResist",
			"SpellPenetration",
			"PhysicalPenetration",
			"HealingDone",
			"HealingTaken",
			"HealingReceived",
			"HealingTotal",
			"HealingReduction",
			"BashCost",
			"BashDamage",
			"BlockCost",
			"BlockMitigation",
			"BlockMeleeMitigation",
			"RollDodgeCost",
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
			"HADamageTaken",
			"LADamageTaken",
			"DotDamageTaken",
			"DotDamageDone",
			"DirectDamageDone",
			"MagicDamageDone",
			"PhysicalDamageDone",
			"ShockDamageDone",
			"FlameDamageDone",
			"ColdDamageDone",
			"PoisonDamageDone",
			"DiseaseDamageDone",
			"MagicDamageTaken",
			"PhysicalDamageTaken",
			"ShockDamageTaken",
			"FlameDamageTaken",
			"ColdDamageTaken",
			"PoisonDamageTaken",
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
			"ShieldDamageDone",
			"FearDuration",
			"SnareDuration",
			"SnareEffect",
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
			"BleedDamage",
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
			"The Shadow" 		=> "Crit Damage",
			"The Steed" 		=> "Run/Health Recovery",
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
			"Dragonknight",
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
			
			"Item.ExecuteBonus" => array(
					"display" => "%",
			),
			
			"SkillCost.Mages_Guild" => array(
					"display" => "%",
			),			
			
			"SkillCost.Destructive_Touch_Cost" => array(
					"display" => "%",
			),
			
			"SkillCost.Psijic_Order_Cost" => array(
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
			
			"Item.EnchantPotency1" => array(
					"display" => "%",
			),
			
			"Item.EnchantCooldown1" => array(
					"display" => "%",
			),
			
			"Set.EnchantCooldown" => array(
					"display" => "%",
			),
			
			"Item.EnchantPotency2" => array(
					"display" => "%",
			),
				
			"Item.EnchantCooldown2" => array(
					"display" => "%",
			),
			
			"Mundus.WeaponCrit" => array(
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

			"CP.WeaponCrit" => array(
					"display" => "%",
			),
			
			"Item.SpellCrit" => array(
					"display" => "%",
			),
				
			"Mundus.SpellCrit" => array(
					"display" => "%",
			),
				
			"Skill.SpellCrit" => array(
					"display" => "%",
			),
			
			"Skill.AOEDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.AOEHealingDone" => array(
					"display" => "%",
			),
			
			"Skill.AOEDamageTaken" => array(
					"display" => "%",
			),
			
			"Skill.SingleTargetDamageDone" => array(
					"display" => "%",
			),
			
			"CP.SpellCrit" => array(
					"display" => "%",
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
			
			"Buff.HealingTaken" => array(
					"display" => "%",
			),			
			
			"CP.DirectDamageDone" => array(
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
			
			"Mundus.SpellCrit" => array(
					"display" => "%",
			),
			
			"CP.SpellCrit" => array(
					"display" => "%",
			),
			
			"Mundus.WeaponCrit" => array(
					"display" => "%",
			),
				
			"CP.WeaponCrit" => array(
					"display" => "%",
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
			
			"CP.MountSpeed" => array(
					"display" => "%",
			),
			
			"Skill.SprintSpeed" => array(
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
			
			"Skill2.SneakSpeed" => array(
					"display" => "%",
			),
			
			"Skill.BlockSpeed" => array(
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
			
			"Buff.DamageDone" => array(
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
			
			"CP.ColdDamageDone" => array(
					"display" => "%",
			),
			
			"CP.ShockDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.ShockDamageDone" => array(
					"display" => "%",
			),				
			
			"Skill.ColdDamageDone" => array(
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
			
			"CP.ColdDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.PoisonDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.DiseaseDamageTaken" => array(
					"display" => "%",
			),
			
			"CP.DotDamageTaken" => array(
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
			
			"CP.LAStaffDamage" => array(
					"display" => "%",
			),
			
			"CP.LAWeaponDamage" => array(
					"display" => "%",
			),
			
			"CP.LABowDamage" => array(
					"display" => "%",
			),
			
			"SkillDamage.Searing Strike" => array(
					"display" => "%",
			),
			
			"SkillDamage.Overload" => array(
					"display" => "%",
			),
			
			"SkillDamage.Fiery Breath" => array(
					"display" => "%",
			),
			
			"SkillLineDamage.Bow Damage" => array(
					"display" => "%",
			),
			
			"SkillLineDamage.Dual Wield Damage" => array(
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
			
			"SkillDuration.Consuming Darkness" => array(
					"display" => "%",
			),
			
			"SkillDuration.Shadow Cloak" => array(
					"display" => "%",
			),
			
			"SkillDuration.Path of Darkness" => array(
					"display" => "%",
			),
			
			"SkillDuration.Summon Shade" => array(
					"display" => "%",
			),
			
			"SkillDuration.Aspect of Terror" => array(
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
			
			"Set.LADamage" => array(
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
			
			"SkillHealing.Green Balance" => array(
					"display" => "%",
			),
			
			"SkillHealing.Restoration Staff" => array(
					"display" => "%",
			),
			
			"Skill.MagicDamageDone" => array(
					"display" => "%",
			),
			
			"Skill.SnareEffect" => array(
					"display" => "%",
			),
			
	);
	
	
	public $COMPUTED_STATS_LIST = array(
			
			/* 
			 * Health Confirmed:
			 * Note that there is a bug with Undaunted Mettle on live which messes up the in-game value sometimes.
			 */
			"Health" => array(
					"title" => "Health",
					"round" => "floor",
					//"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"156 * Level + 944",
							"122 * Attribute.Health",
							"+",
							"Item.Health",
							"+",
							"Set.Health",
							"+",
							//"1 + pow(CP.Health, 0.56432)/100",	
							"1 + 0.004 * min(CP.Health, 100) - 0.00002 * pow(min(CP.Health, 100), 2)", // Update 14
							"*",
							"Food.Health",
							"+",
							"Skill2.Health",
							"+",
							"Mundus.Health",
							"+",
							"1 + Skill.Health + Buff.Health",
							"*",
					),
			),
			
			/* 
			 * Magicka Confirmed:
			 * Note that there is a bug with Undaunted Mettle on live which messes up the in-game value sometimes.
			 */
			"Magicka" => array(
					"title" => "Magicka",
					"round" => "floor",
					//"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"142 * Level + 858",
							"111 * Attribute.Magicka",
							"+",
							"Item.Magicka",
							"+",
							"Set.Magicka",
							"+",
							//"1 + pow(CP.Magicka, 0.56432)/100",
							"1 + 0.004 * min(CP.Magicka, 100) - 0.00002 * pow(min(CP.Magicka, 100), 2)",	// Update 14
							"*",
							"Food.Magicka",
							"+",
							"Mundus.Magicka",
							"+",
							"Skill2.Magicka",
							"+",
							"1 + Skill.Magicka + Buff.Magicka",
							"*",
					),
			),
			
			/* 
			 * Stamina Confirmed:
			 * Note that there is a bug with Undaunted Mettle on live which messes up the in-game value sometimes.
			 */
			"Stamina" => array(
					"title" => "Stamina",
					"round" => "floor",
					"addClass" => "esotbStatDividerLite",
					//"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"142 * Level + 858",
							"111 * Attribute.Stamina",
							"+",						
							"Item.Stamina",
							"+",
							"Set.Stamina",
							"+",
							//"1 + pow(CP.Stamina, 0.56432)/100",
							"1 + 0.004 * min(CP.Stamina, 100) - 0.00002 * pow(min(CP.Stamina, 100), 2)",	// Update 14
							"*",
							"Food.Stamina",
							"+",
							"Mundus.Stamina",
							"+",
							"1 + Skill.Stamina + Buff.Stamina",
							"*",
					),
			),
			
			/* 
			 * HealthRegen Confirmed:
			 */
			"HealthRegen" => array(
					"title" => "Health Recovery",
					"round" => "floor",
					"compute" => array(
							"round(5.592 * Level + 29.4)",
							"Item.HealthRegen",
							"+",
							"Set.HealthRegen",
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
					),
			),
			
			/*
			 * MagickaRegen Confirmed:
			 */
			"MagickaRegen" => array(
					"title" => "Magicka Recovery",
					"round" => "floor",
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
					"round" => "floor",
					"compute" => array(
							"Item.SpellDamage",
							"Set.SpellDamage",
							"+",
							"Mundus.SpellDamage",
							"+",
							"1 + Skill.SpellDamage + Buff.SpellDamage",
							"*",							
					),
			),
			
			/*
			 * WeaponDamage Confirmed:
			 */
			"WeaponDamage" => array(
					"title" => "Weapon Damage",
					"round" => "floor",
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"Item.WeaponDamage",
							"Set.WeaponDamage",
							"+",
							"Mundus.WeaponDamage",
							"+",
							"1 + Skill.WeaponDamage + Buff.WeaponDamage",
							"*",
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
							"1/(2*EffectiveLevel*(100 + EffectiveLevel))",
							"*",
							"0.10",
							"+",
							"Item.SpellCrit",
							"+",
							"Mundus.SpellCrit",
							"+",
							"Skill.SpellCrit",
							"+",
							"CP.SpellCrit",
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
							"1/(2*EffectiveLevel*(100 + EffectiveLevel))",
							"*",
							"0.10",
							"+",
							"Item.WeaponCrit",
							"+",
							"Mundus.WeaponCrit",
							"+",
							"Skill.WeaponCrit",
							"+",
							"CP.WeaponCrit",
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
					"compute" => array(
							"CP.SpellCritDamage",
							"Skill.CritDamage",
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
					"addClass" => "esotbStatDividerLite",
					"compute" => array(
							"CP.WeaponCritDamage",
							"Skill.CritDamage",
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
			 * SpellResist Confirmed:
			 */
			"SpellResist" => array(
					"title" => "Spell Resistance",
					"display" => "resist",
					"round" => "floor",
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
							"Item.CritResist",
							"Set.CritResist",
							"+",
							"Skill.CritResist",
							"+",
							"CP.CritResist",
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
							"100",
							"Item.SpellPenetration",
							"+",
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
							"100",
							"Item.PhysicalPenetration",
							"+",
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
							"AttackSpellMitigation",
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
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"round(Stamina/10.5)",
							"WeaponDamage",
							"+",
							"1 + WeaponCrit*AttackWeaponCritDamage",
							"*",
							"1 + CP.PhysicalDamageDone",
							"*",
							"AttackPhysicalMitigation",
							"*",
							"1 + Target.DamageTaken",
							"*",
							"1 + DamageDone",
							"*",
					),
			),
			
			"ColdResist" => array(
					"title" => "Cold Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.ColdResist",
							"Skill.ColdResist",
							"+",
					),
			),
			
			"FlameResist" => array(
					"title" => "Fire Resistance",
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
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"Item.DiseaseResist",
							"Skill.DiseaseResist",
							"+",
					),
			),
		
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
			"Healing" => array(
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
					"round" => "floor2",
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"7",
							"1",
							"Set.ResurrectSpeed",
							"-",
							"Skill.ResurrectSpeed",
							"-",
							"Buff.ResurrectSpeed",
							"-",
							"CP.ResurrectSpeed",
							"-",
							"Item.ResurrectSpeed",
							"-",
							"*",
					),
			),
			
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
							"1 + 2 * EffectiveLevel",
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
					"round" => "floor2",
					"suffix" => " meters",
					"compute" => array(
							"6.5",
							"Skill2.SneakRange",
							"+",
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
					"round" => "floor2",
					"suffix" => " meters",
					"compute" => array(
							"6.5",
							"Skill2.SneakDetectRange",
							"+",
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
							"floor(38.46 + 7.69*EffectiveLevel)",
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
							"1 + Buff.MovementSpeed",
							"Skill.MovementSpeed",
							"+",
							"Item.MovementSpeed",
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
							"Buff.SprintSpeed",
							"+",
							"Skill.MovementSpeed",
							"+",
							"Skill.SprintSpeed",
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
							"1 - Skill.NormalSneakSpeed",
							"*",
							"+",
							"Buff.MovementSpeed",
							"+",
							"Skill.MovementSpeed",
							"+",
							"Mundus.MovementSpeed",
							"+",
							"Item.MovementSpeed",
							"+",
							"*",
							"1 + Skill2.SneakSpeed",
							"CP.MovementSpeed",
							"+",
							"*",
					),
			),
			
			"BlockSpeed" => array(
					"title" => "Block Speed",
					"display" => "round2",
					"suffix" => " m/s",
					"compute" => array(
							"BaseWalkSpeed",
							"1 - 0.60",
							"*",
							"1 + Skill.BlockSpeed",
							"*"
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
					"addClass" => "esotbStatDivider",
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
			
			/*
			 * BashCost: TODO needs checking
			 */
			"BashCost" => array(
					"title" => "Bash Cost",
					"round" => "floor",
					"compute" => array(
							"floor(157 + 26.25*EffectiveLevel)",
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
			 * BashCost: Confirmed Update 15
			 */
			"BashDamage" => array(
					"warning" => "This is the base damage for bashing a non-casting opponent.",
					"title" => "Bash Damage",
					"round" => "floor",
					"compute" => array(
							"floor((WeaponDamage + Item.BashDamage)*0.5)",
							"1 + Skill.BashDamage",
							"*",
							"1 + CP.DirectDamageDone + CP.PhysicalDamageDone + Skill.PhysicalDamageDone + Skill.DamageDone",
							"*",
					),
			),
			
			/*
			 * BlockCost Confirmed
			 * (Base*CP*Sturdy*Fortress - Enchants)*(Defensive Posture)
			 */
			"BlockCost" => array(
					"title" => "Block Cost",
					"round" => "floor",
					"compute" => array(
							
								/* Update 17 */
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
							"*",
							
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
			 * BlockMitigation: ToDo needs checking
			 */
			"BlockMitigation" => array(
					"title" => "Block Mitigation",
					"display" => "%",
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
							"*",
							"-",
					),
			),
			
			"RollDodgeCost" => array(					// TODO: Check?
					"title" => "Dodge Roll Cost",
					"round" => "floor",
					"compute" => array(
							"floor(34 + 5.62*EffectiveLevel)*10", // Old?
							//"3200", //?
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
							"450 + 75*EffectiveLevel",
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
						
			"DamageShield" => array(
					"title" => "Damage Shield",
					"display" => "%",
					"compute" => array(
							"1 + CP.DamageShield",
							"1 + Buff.DamageShield",
							"*",
							"-1",
							"+",
					),
			),
			
			"ShieldDamageDone" => array(
					"title" => "Shield Damage Done",
					"display" => "%",
					"round" => "floor",
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"CP.ShieldDamageDone",
					),
			),
			
			"DotDamageTaken" => array(
					"title" => "DOT Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DotDamageTaken",
					),
			),
			
			"DotDamageDone" => array(
					"title" => "DOT Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DotDamageDone",
					),
			),
			
			"DirectDamageDone" => array(
					"title" => "Direct Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DirectDamageDone",
					),
			),
						
			"DirectDamageTaken" => array(
					"title" => "Direct Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DirectDamageTaken",
					),
			),
			
			"MagicDamageTaken" => array(
					"title" => "Magic Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.MagicDamageTaken",
							"Skill.MagicDamageTaken",
							"+",
					),
			),
			
			"PhysicalDamageTaken" => array(
					"title" => "Physical Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.PhysicalDamageTaken",
							"Skill.PhysicalDamageTaken",
							"+",
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
			
			"DamageDone" => array(
					"title" => "Damage Done",
					"display" => "%",
					"round" => "floor",
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
			
			"DamageTaken" => array(
					"title" => "Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.DamageTaken",
							"Skill.DamageTaken",
							"+",
							"Buff.DamageTaken",
							"+",
							"Item.DamageTaken",
							"+",
							"Set.DamageTaken",
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
			
			"ColdDamageDone" => array(
					"title" => "Cold Damage Done",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.ColdDamageDone",
							"Skill.ColdDamageDone",
							"+",
							"Buff.ColdDamageDone",
							"+",
							"Item.ColdDamageDone",
							"+",
							"Set.ColdDamageDone",
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
					"addClass" => "esotbStatDivider",
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
							"round(EffectiveLevel * 41.28)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore",
							"*",
					),
			),
			
			"HARestoreDW" => array(
					"title" => "Dual Wield HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 25.26)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore",
							"*",
					),
			),
			
			"HARestore2H" => array(
					"title" => "2H HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 36.76)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore",
							"*",
					),
			),
			
			"HARestore1HS" => array(
					"title" => "1H+Shield HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 30.52)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore",
							"*",
					),
			),
			
			"HARestoreFireFrostStaff" => array(
					"title" => "Fire/Frost HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 42.78)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore",
							"*",
					),
			),
			
			"HARestoreShockStaff" => array(
					"title" => "Shock HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 55.04)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore",
							"*",
					),
			),
			
			"HARestoreRestStaff" => array(
					"title" => "Restore HA Magicka Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 48.78)",
							"Skill2.HAMagRestore",
							"+",
							"1 + CP.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestore + Set.HAMagRestore",
							"*",
							"1 + Skill.HAMagRestoreRestStaff",
							"*",
					),
			),
			
			
			"HARestoreWerewolf" => array(
					"title" => "Werewolf HA Stamina Restore",
					"round" => "floor",
					"compute" => array(
							"round(EffectiveLevel * 24.5)",
							"1 + CP.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestore + Set.HAStaRestore",
							"*",
							"1 + Skill.HAStaRestoreWerewolf",
							"*",
					),
			),
				
			"Constitution" => array(				// TODO: Check?
					"title" => "Constitution",
					"round" => "floor",
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"floor(2.82 * EffectiveLevel)",
							"ArmorHeavy",
							"*",
							"1 + Set.Constitution",
							"*",
					),
			),
			
			"LAShockStaff" => array(
					"title" => "Light Attack Shock Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.0240568*Magicka + 0.251298*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.828837)",	//Update 18
							//"round(0.0110522*Magicka + 0.441972*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.04019)",	//Update 14
							//"round(0.0129965*Magicka + 0.520247*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.1641)",	//Update 12
							//"round((0.0130319*Magicka + 0.519646*SpellDamage - 0.890172)*3)",		//Update 11pts
							//"round((0.013*Magicka + 0.52*SpellDamage - 0.26)*3)",					//Update 10
							"1 + CP.LAStaffDamage + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + Skill.ShockDamageDone + Buff.Empower + Skill.DamageDone + Skill.AOEDamageDone",	 //TODO: Include + Skill.LADamage?
							"*",
								
					),
			),
			
			"LAFlameStaff" => array(
					"title" => "Light Attack Flame Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.0450227*Magicka + 0.472303*SpellDamage - 0.802558)", 	// Update 18
							//"round(0.0161002*Magicka + 0.643855*SpellDamage - 0.692667)", 		// Update 14
							//"round(0.0139076*Magicka + 0.560231*SpellDamage + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)", 				// Update 10?
							
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + Skill.FlameDamageDone + Skill.DamageDone + Skill.SingleTargetDamageDone + CP.DirectDamageDone",
							//"*",
							
							"1 + CP.LAStaffDamage + CP.FlameDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.LADamage + Set.LADamage + Skill.FlameDamageDone + Buff.Empower + Skill.DamageDone + Skill.SingleTargetDamageDone",
							"*",
					),
			),
			
			"LAColdStaff" => array(
					"title" => "Light Attack Cold Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.0450227*Magicka + 0.472303 *SpellDamage - 0.802558)", 	// Update 18
							//"round(0.0161002*Magicka + 0.643855*SpellDamage - 0.692667)", 		// Update 14
							//"round(0.0139076*Magicka + 0.560231*SpellDamage + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)",
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + Skill.ColdDamageDone + Skill.DamageDone + CP.DirectDamageDone",
							//"*",
							
							"1 + CP.LAStaffDamage + CP.ColdDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.LADamage + Set.LADamage + Skill.ColdDamageDone + Buff.Empower + Skill.DamageDone + Skill.SingleTargetDamageDone",
							"*",
					),
			),
			
			"LAResorationStaff" => array(
					"title" => "Light Attack Restoration",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round((0.103346*Magicka + 1.08623*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.562222)/3)", 		// Update 18
							//"round((0.0407852*Magicka + 1.63171*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 1.76576)/3)", 	// Update 14
							//"round(0.0139076*Magicka + 0.560231*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.0163755)", 	// Update 12
							//"round(0.0140*Magicka + 0.56*SpellDamage - 0.60)",
							//"1 + CP.LAStaffDamage + Set.LADamage + Buff.Empower + Skill.DamageDone + CP.DotDamageDone",
							//"*",
							
							"1 + CP.LAStaffDamage + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"Skill2.LADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + Skill.ShockDamageDone + Buff.Empower + Skill.DamageDone + Skill.AOEDamageDone",
							"*",
					),
			),
				
			"LAOneHand" => array( // 16499?
					"title" => "Light Attack One Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",		// Update 18
							//"round(0.0166857*Stamina + 0.666645*WeaponDamage - 0.749082)",	// Update 14
							//"round(0.0145129*Stamina + 0.579979*WeaponDamage - 1.0552)",		// Update 12
							//"round(0.0140*Stamina + 0.56*WeaponDamage - 0.60)",
							"1 + CP.LAWeaponDamage + Set.LADamage + Buff.Empower + Skill.PhysicalDamageDone + Skill.LAMeleeDamage + Skill.DamageDone + CP.DirectDamageDone",
							"*",
					),
			),
				
			"LATwoHand" => array( // 16037?
					"title" => "Light Attack Two Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",		// Update 18
							//"round(0.0218892*Stamina + 0.873792*WeaponDamage - 1.61325)",		// Update 14
							//"round(0.019042*Stamina + 0.760103*WeaponDamage - 1.77928)",		// Update 12
							//"round(0.0148*Stamina + 0.592*WeaponDamage - 1.06)",
							"1 + CP.LAWeaponDamage + Set.LADamage + Buff.Empower + Skill.PhysicalDamageDone + Skill.LAMeleeDamage + Skill.DamageDone + CP.DirectDamageDone",
							"*",
					),
			),
				
			"LABow" => array( // 32464?
					"title" => "Light Attack Bow",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",		// Update 18
							//"round(0.0166857*Stamina + 0.666645*WeaponDamage - 0.749082)",	// Update 14
							//"round(0.0145129*Stamina + 0.579979*WeaponDamage - 1.0552)",		// Update 12
							//"round(0.0140*Stamina + 0.56*WeaponDamage - 0.60)",
							//"1 + CP.LABowDamage + Set.LADamage + Set.BowDamageDone + Skill.BowDamageDone + Buff.Empower + Skill.PhysicalDamageDone + Skill.DamageDone", 	// TODO: Check BowDamageDone
							"1 + CP.LAWeaponDamage + Set.LADamage + Set.BowDamageDone + Skill.BowDamageDone + Buff.Empower + Skill.PhysicalDamageDone + Skill.DamageDone + CP.DirectDamageDone", 	// Update 14
							"*",
					),
			),
			
			"LADualWield" => array(
					"title" => "Light Attack Dual Wield",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",		// Update 18
							//"round(0.0139542*Stamina + 0.557374*WeaponDamage - 0.139753)",	// Update 14?
							//"round(0.0163232*Stamina + 0.65628*WeaponDamage + 0.555625)",		// Probably not correct?
							"1 + CP.LAWeaponDamage + Set.LADamage + Buff.Empower + Skill.PhysicalDamageDone + Skill.LAMeleeDamage + Skill.DamageDone + CP.DirectDamageDone",
							"*",
					),
			),
			
			"LAWerewolf" => array(
					"title" => "Light Attack Werewolf",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"round(0.0449953*Stamina + 0.471987*WeaponDamage - 0.232637)",			// Update 18?
							//"round(0.0166213*Stamina + 0.666503*WeaponDamage + 0.0462245)",		// Update 17
							"Skill2.HADamage",
							"+",
							"1 + CP.LAActiveDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.LADamage + Set.LADamage + Buff.Empower + Skill.PhysicalDamageDone + Skill.LAMeleeDamage + Skill.DamageDone",
							"*",
					),
			),
				
			
			"HAFlameStaff" => array(
					"title" => "Heavy Attack Fire Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.0960395*Magicka + 1.0076*SpellDamage - 1.01795)",			//Update 18
							//"round(0.0409739*Magicka + 1.63589*SpellDamage - 0.239583)",		//Update 14
							//"round(0.0550432*Magicka + 2.19972*SpellDamage - 0.864784)",		//Update 12
							//"round(0.0549025*Magicka + 2.20013*SpellDamage - 0.481141)",		//Update 11pts
							//"round(0.055*Magicka + 2.20*SpellDamage - 0.67)",					//Update 10
							"1 + CP.HAStaffDamage + CP.FlameDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + Skill.FlameDamageDone + Buff.Empower + Skill.DamageDone + Skill.SingleTargetDamageDone",
							"*",
					),
			),
			
			"HAColdStaff" => array(
					"title" => "Heavy Attack Cold Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.0960395*Magicka + 1.0076*SpellDamage - 1.01795)",			//Update 18
							//"round(0.0409739*Magicka + 1.63589*SpellDamage - 0.239583)",		//Update 14
							//"round(0.0550432*Magicka + 2.19972*SpellDamage - 0.864784)",		//Update 12
							//"round(0.0549025*Magicka + 2.20013*SpellDamage - 0.481141)",		//Update 11pts
							//"round(0.055*Magicka + 2.20*SpellDamage - 0.67)",					//Update 10
							"1 + CP.HAStaffDamage + CP.ColdDamageDone + CP.DirectDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + Skill.ColdDamageDone + Skill.DamageDone",
							"*",
					),
			),
			
			"HAShockStaff" => array(
					"title" => "Heavy Attack Shock Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage", "LAShockStaff"),
					"compute" => array(
							"round(0.0399643*Magicka + 0.419512*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.0136314)",		//Update 18
							//"round(0.0154345*Magicka + 0.618618*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 0.265101)",		//Update 14
							//"round(0.0182736*Magicka + 0.728039*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 2.50684)",		//Update 12
							//"round(0.0181386*Magicka + 0.728188*SpellDamage - 0.397214)",			//Update 11pts
							//"round(0.0182*Magicka + 0.728*SpellDamage - 0.03)",					//Update 10
							"1 + CP.ShockDamageDone + CP.DotDamageDone",
							"*",
							"1 + Skill.ShockDamageDone",
							"*",
							"Skill2.HADamage",
							"+",
							"1 + Skill.HADamage + Set.HADamage + Skill.ShockDamageDone + Skill.DamageDone + Skill.AOEDamageDone",
							"*",
							"LAShockStaff * 3",
							"+",
					),
			),
			
			"HARestoration" => array(					// TODO: Confirm damage
					"title" => "Heavy Attack Restoration",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"round(0.103346*Magicka + 1.08623 *(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.562222)",		//Update 18
							//"round(0.0264005*Magicka + 1.05581*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) - 0.661848)",	//Update 14
							//"round(0.0478338*Magicka + 1.91925*(SpellDamage + Item.ChannelSpellDamage*(1 + Skill.SpellDamage + Buff.SpellDamage)) + 1.35918)",	//Update 11pts
							//"round(0.0481*Magicka + 1.92*SpellDamage - 3.06)",			//Update 10
							//"round(0.02643*Magicka + 1.055*SpellDamage - 0.62)",			//Update 10
							"Skill2.HADamage",
							"+",
							"1 + CP.HAStaffDamage + CP.MagicDamageDone + CP.DotDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + Skill.DamageDone",
							"*",
					),
			),
			
			"HAOneHand" => array(
					"title" => "Heavy Attack One Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0699164*Stamina + 0.734938*WeaponDamage + 0.0110695)",		//Update 18
							//"round(0.0327709*Stamina + 1.31231*WeaponDamage + 0.234536)",		//Update 14
							//"round(0.038698*Stamina + 1.54378*WeaponDamage - 2.03145)",		//Update 11pts
							//"round(0.03852*Stamina + 1.5436*WeaponDamage - 0.33)",			//Update 10
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Skill.PhysicalDamageDone + Skill.HAMeleeDamage + Skill.DamageDone",
							"*",
					),
			),
			
			"HATwoHand" => array(						// TODO: Axe, Mace, Sword 2H passive
					"title" => "Heavy Attack Two Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0719815*Stamina + 0.755865*WeaponDamage + 0.20861)",	//Update 18
							//"round(0.0374172*Stamina + 1.49589*WeaponDamage + 0.256685)",	//Update 14
							//"round(0.044067*Stamina + 1.7596*WeaponDamage - 0.45188)",	//Update 11pts
							//"round(0.123*Stamina + 1.283*WeaponDamage - 0.94)",			//Update 10
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + Skill.PhysicalDamageDone + Skill.HAMeleeDamage + Skill.DamageDone",
							"*",
					),
			),
			
			"HABow" => array(
					"title" => "Heavy Attack Bow",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.0940809*Stamina + 0.986539*WeaponDamage - 1.45469)",		//Update 18
							//"round(0.0421126*Stamina + 1.68265*WeaponDamage - 1.43962)",		//Update 14
							//"round(0.0550887*Stamina + 2.20001*WeaponDamage - 1.90256)",		//Update 11pts
							//"round(0.0550*Stamina + 2.20*WeaponDamage - 0.95)",				//Update 10
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",			//Update 14
							//"1 + CP.HABowDamage + CP.PhysicalDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + Set.BowDamageDone + Skill.BowDamageDone + Skill.PhysicalDamageDone + Skill.DamageDone",  //TODO: Check BowDamageDone
							"*",
					),
			),
			
			"HADualWield" => array(						// TODO: Dual wield passive
					"title" => "Heavy Attack Dual Wield",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"round(0.033036*Stamina + 0.346257*WeaponDamage - 0.228267)",		//Update 18
							"round(0.033036*Stamina + 0.346257*WeaponDamage + 1.77173 )",		//Update 18
							//"round(0.0139542*Stamina + 0.557374*WeaponDamage - 0.139753)",	//Update 14
							//"round(0.0169856*Stamina + 0.680024*WeaponDamage + 2.09792)",		//Update 14
							//"round(0.0200506*Stamina + 0.799675*WeaponDamage + 2.03471)",		//Update 11pts
							//"round(0.01636*Stamina + 0.6556*WeaponDamage + 0.81)",			//Update 10
							//"round(0.0199*Stamina + 0.800*WeaponDamage + 3.82)",				//Update 10
							"+",
							"Skill2.HADamage",
							"+",
							"1 + CP.HAWeaponDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + Skill.PhysicalDamageDone + Skill.HAMeleeDamage + Skill.DamageDone",
							"*",
					),
			),
			
			"HAWerewolf" => array(
					"title" => "Heavy Attack Werewolf",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"round(0.0719815*Stamina + 0.755865*WeaponDamage + 0.20861)",	//Update 18
							//"round(0.0374172*Stamina + 1.49589*WeaponDamage + 0.256685)",	//Update 14
							//"round(0.05007*Stamina + 1.99937*WeaponDamage - 0.51345)",	//Update 11pts
							//"round(0.0440*Stamina + 1.76*WeaponDamage + 0.74)",			//Update 10
							"Skill2.HADamage",
							"+",
							"1 + CP.HAActiveDamage + CP.PhysicalDamageDone + CP.DirectDamageDone",
							"*",
							"1 + Skill.HADamage + Set.HADamage + Skill.PhysicalDamageDone + Skill.HAMeleeDamage + Skill.DamageDone",
							"*",
					),
			),
			
			//TODO: Bash Damage = 0.5 * WeaponDamage
						
			"AttackSpellMitigation" => array(
					"title" => "Attacker Spell Mitigation",
					"display" => "%",
					"depends" => array("SpellPenetration", "Skill2.PhysicalPenetration"),
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"Target.SpellResist",
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
					),
			),
				
			"AttackPhysicalMitigation" => array(
					"title" => "Attacker Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalPenetration", "Skill2.PhysicalPenetration"),
					"min" => 0,
					"max" => 1,
					"compute" => array(
							"Target.PhysicalResist",
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
					),
			),
			
			
			"AttackSpellCritDamage" => array(
					"title" => "Attack Spell Critical Dmg",
					"display" => "%",
					"depends" => array("SpellCritDamage"),
					"min" => 0,
					"compute" => array(
							"SpellCritDamage",
							"Target.CritResistFlat",
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
							"Target.CritResistFlat",
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
							"SpellResist",
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
					),
			),
				
			"DefensePhysicalMitigation" => array(
					"title" => "Defending Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalResist", "PhysicalDamageTaken"),
					"compute" => array(
							"PhysicalResist",
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
					),
			),
			
			"DefenseSpellAoEMitigation" => array(
					"title" => "Defending Spell AOE Mitigation",
					"display" => "%",
					"depends" => array("DefenseSpellMitigation"),
					"compute" => array(
							"1 + Skill.AOEDamageTaken",
							"DefensePhysicalMitigation",
							"*",
					),
			),
				
			"DefensePhysicalAoeMitigation" => array(
					"title" => "Defending Phys AOE Mitigation",
					"display" => "%",
					"depends" => array("DefensePhysicalMitigation"),
					"compute" => array(
							"1 + Skill.AOEDamageTaken",
							"DefensePhysicalMitigation",
							"*",
					),
			),
			
			"DefenseCritDmg" => array(
					"title" => "Target Critical Dmg",
					"depends" => array("CritResist"),
					"display" => "%",
					"min" => 0,
					"max" => 1,
					"addClass" => "esotbStatDivider",
					"compute" => array(
							"Target.CritDamage",
							"CritResist",
							"0.035/250",
							"*",
							"-",
					),
			),
			
			/*
			 * MagickaCost Confirmed
			 */
			"MagickaCost" => array(
					"title" => "Magicka Ability Cost",
					"round" => "floor",
					//"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"Misc.SpellCost",
							"1 + CP.MagickaCost",
							"*",
							"Item.MagickaCost",
							"+",
							"Skill.MagickaCost",
							"Set.MagickaCost",
							"+",
							"Buff.MagickaCost",
							"+",
							"1",
							"+",
							"*",
					),
			),
				
			/*
			 * StaminaCost Confirmed
			*/
			"StaminaCost" => array(
					"title" => "Stamina Ability Cost",
					"round" => "floor",
					"addClass" => "esotbStatDivider",
					//"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"Misc.SpellCost",
							"1 + CP.StaminaCost",
							"*",
							"Item.StaminaCost",
							"+",
							"Skill.StaminaCost",
							"Set.StaminaCost",
							"+",
							"Buff.StaminaCost",
							"+",
							"1",
							"+",
							"*",
					),
			),
			
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
			
			
			// Sneak Attack Melee Damage
			//		= Base * (SneakBonus + CritMod)
			//			SneakBonus = 3.75 melee, 1.46 Ranged (PVE Only?)
			// MountSpeed
			
			//Physical/spell mitigation = (resistance - 100) / (level*10)
			//Mitigation = [Resist ÷ (Level × 1,000)] or  = (resistance-100)/(level+VR)*10
			// 50% cap on element + spell resistance
			//Flat Crit = 2 * (effectiveLevel) * (100 + effectiveLevel)

	); 
	
	
	public function __construct()
	{
		//UespMemcachedSession::install();
		
		$this->TEMPLATE_FILE = __DIR__."/templates/esoeditbuild_embed_template.txt";
		
		$this->buildDataViewer = new EsoBuildDataViewer(true, true);
		
		$this->viewCps = new CEsoViewCP(true, false);
		$this->viewCps->hideTopBar = true;
		$this->viewCps->shortDiscDisplay = true;
		
		$this->viewSkills = new CEsoViewSkills(true, "select", false);
		$this->viewSkills->showLeftDetails = false;
		$this->viewSkills->displayClass = "Dragonknight";
		$this->viewSkills->displayRace = "Argonian";
		$this->viewSkills->displayMenuBar = false;
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
				if ($this->INPUT_STATS_LIST[$statBase] === null) $this->INPUT_STATS_LIST[$statBase] = array();
				$this->INPUT_STATS_LIST[$statBase][$statList[1]] = 0;
			}			
		}
		
		foreach ($this->STATS_BASE_LIST as $stat)
		{
			$this->INPUT_STATS_LIST[$stat] = 0;
		}
		
		foreach ($this->STATS_TYPE_LIST as $statBase)
		{
			if ($this->INPUT_STATS_LIST[$statBase] === null) $this->INPUT_STATS_LIST[$statBase] = array();
			
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
		return json_encode($this->COMPUTED_STATS_LIST);
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
		if ($this->buildDataViewer->characterData[$field] === null) return $default;
		return $this->buildDataViewer->escape($this->buildDataViewer->characterData[$field]);
	}
	
	
	public function getCharStatField($field, $default = "")
	{
		if ($this->buildDataViewer->characterData === null) return $default;
		if ($this->buildDataViewer->characterData['stats'] === null)  return $default;
		if ($this->buildDataViewer->characterData['stats'][$field]['value'] === null) return $default;
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
	
	
	public function LoadInitialItemData($slotId, $linkData)
	{
		$itemId = (int) $linkData['itemId'];
		$intLevel = (int) $linkData['itemIntLevel'];
		$intType = (int) $linkData['itemIntType'];
		
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
		
		$query = "SELECT * FROM minedItem WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
		$result = $this->db->query($query);
		if (!$result) return $this->ReportError("Failed to load item data for $slotId!");
		
		if ($result->num_rows == 0)
		{
			$intLevel = 1;
			$intType = 1;
			$query = "SELECT * FROM minedItem WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
			$result = $this->db->query($query);
			if (!$result) return $this->ReportError("Failed to load item data for $slotId!");
			if ($result->num_rows == 0) return false;
		}
		
		$this->initialItemData[$slotId] = $result->fetch_assoc();
		$this->initialItemData[$slotId]["origTrait"] = $this->initialItemData[$slotId]["trait"];
		$this->initialItemData[$slotId]["origTraitDesc"] = $this->initialItemData[$slotId]["traitDesc"];
		
		if ($linkData['transmuteTrait'] > 0)
		{
			$this->initialItemData[$slotId]["trait"] = $linkData['transmuteTrait'];
			
			//$transmuteItemId = $ESO_ITEMTRANSMUTETRAIT_IDS[$linkData['transmuteTrait']];
			$transmuteItemId = GetEsoTransmuteTraitItemId($linkData['transmuteTrait'], $this->initialItemData[$slotId]['equipType']);
			
			if ($transmuteItemId != null) 
			{
				$query = "SELECT traitDesc, trait, internalLevel, internalSubtype FROM minedItem WHERE itemId='$transmuteItemId' AND internalLevel='$intLevel' AND internalSubtype='$intType' LIMIT 1;";
				$result = $this->db->query($query);
				
				if ($result) 
				{
					$this->ReportError("Failed to load item data for transmute item $transmuteItemId:$intLevel:$intType!");
					$row = $result->fetch_assoc();
					
					$this->initialItemData[$slotId]["traitDesc"] = $row['traitDesc'];
					$this->initialItemData[$slotId]["transmuteTrait"] = $linkData['transmuteTrait'];
				}								
			}
		}
		
		$setName = $this->initialItemData[$slotId]['setName'];
		if ($setName != "") return $this->LoadInitialSetMaxData($setName, $linkData);
		
		return true;
	}
	
	
	public function LoadInitialEnchantData($slotId, $linkData)
	{
		$itemId = (int) $linkData['enchantId1'];
		$intLevel = (int) $linkData['enchantIntLevel1'];
		$intType = (int) $linkData['enchantIntType1'];
	
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
	
		$query = "SELECT * FROM minedItem WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
		$result = $this->db->query($query);
		if (!$result) return $this->ReportError("Failed to load enchantment data for $slotId!");
		if ($result->num_rows == 0) return false;
	
		$this->initialEnchantData[$slotId] = $result->fetch_assoc();
	
		return true;
	}
	
	
	public function LoadInitialSetMaxData($setName, $linkData)
	{
				/* Only load it once */
		if ($this->initialSetMaxData[$setName] != null) return true;
		
		$itemId = (int) $linkData['itemId'];
		$intLevel = 50;
		$intType = 370;
	
		if ($itemId === null || $intLevel === null || $intType === null || $itemId <= 0) return false;
	
		$query = "SELECT * FROM minedItem WHERE itemId=$itemId AND internalLevel=$intLevel AND internalSubtype=$intType LIMIT 1;";
		$result = $this->db->query($query);
		if (!$result) return $this->ReportError("Failed to load set max data for $setName!");
		if ($result->num_rows == 0) return false;
		
		$this->initialSetMaxData[$setName] = $result->fetch_assoc();
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
		
		$output .= " setcount=\"$setCount\"";
		$output .= " itemid=\"{$linkData['itemId']}\"";
		$output .= " intlevel=\"{$linkData['itemIntLevel']}\"";
		$output .= " inttype=\"{$linkData['itemIntType']}\"";
		$output .= " enchantid=\"{$linkData['enchantId1']}\"";
		$output .= " enchantintlevel=\"{$linkData['enchantIntLevel1']}\"";
		$output .= " enchantinttype=\"{$linkData['enchantIntType1']}\"";
		$output .= " trait=\"{$linkData['transmuteTrait']}\"";
		
		$this->LoadInitialItemData($slotId, $linkData);
		$this->LoadInitialEnchantData($slotId, $linkData);
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
	
	
	public function OutputError($errorMsg)
	{
		return $errorMsg . "<br/>" . implode("<br/>", $this->errorMessages) . implode("<br>/", $this->buildDataViewer->errorMessages);	
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
				'ESO Plus Member' => 1,
		);
		
		foreach ($this->buildDataViewer->characterData['buffs'] as $buff)
		{
			$buffName = $buff['name'];
			$enabled = $buff['enabled'];
			if ($enabled == 0) $enabled = 1;
			
			if ($buffName == "Spell Power Cure") $buffName = "Major Courage";
			
			$this->initialBuffData[$buffName] = $enabled;	
		}
	}
	
	
	public function CreateInitialCPData()
	{
		$cpData = $this->buildDataViewer->characterData['championPoints'];
		
		$this->initialCpData = array();
		$this->initialCpData['points'] = 0;
		
		foreach ($cpData as $cp)
		{
			$names = explode(":", $cp['name']);
			$cpLine = $names[0];
			$cpSkill = $names[1];
			$points = $cp['points'];
			
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
			$skillName = $names[1];
			$count = $names[2];
			$value = $record['value'];
			
			if ($this->initialToggleSkillData[$skillName] == null) $this->initialToggleSkillData[$skillName] = array();
			
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
			$count = $names[2];
			$value = $record['value'];
				
			if ($this->initialToggleSetData[$setName] == null) $this->initialToggleSetData[$setName] = array();
			$this->initialToggleSetData[$setName]['enabled'] = $value;
			
			if ($count !== null)
				$this->initialToggleSetData[$setName]['count'] = $value;
			else
				$this->initialToggleSetData[$setName]['enabled'] = $value;
		}
	}
	
	
	public function CreateInitialSkillData()
	{
		$this->viewSkills->displayClass = $this->getCharField('class');
		$this->viewSkills->displayRace = $this->getCharField('race');
		
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
		
		$this->initialSkillData = array();
		$this->initialSkillData['UsedPoints'] = $this->getCharStatField("SkillPointsUsed", 0);
		$this->initialSkillData['UnusedPoints'] = $this->getCharStatField("SkillPointsUnused", 0);
		$this->initialSkillData['TotalPoints'] = $this->getCharStatField("SkillPointsTotal", 0);
		
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
		if ($this->getCharField('class') == "Sorcerer") $this->viewSkills->enableOverload = true;
		
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
	
	
	public function LoadBuild()
	{
		if ($this->buildId === null) return true;
		$this->buildDataViewer->characterId = $this->buildId;
		
		if (!$this->buildDataViewer->loadCharacter()) return false;
		
		if ($this->getCharStatField("UseUpdate18Rules", 0)) 
		{
			//$this->viewSkills->version = "18pts";
			//$this->viewCps->version = "18pts";
		}
		
		$this->viewSkills->LoadData();
		
		$this->FixupBuildForPts();
	
		$this->CreateInitialItemData();
		$this->CreateInitialBuffData();
		$this->CreateInitialCPData();
		$this->CreateInitialSkillData();
		$this->CreateInitialSkillBarData();
		$this->CreateInitialToggleSkillData();
		$this->CreateInitialToggleSetData();
		
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
	
	
	public function GetEnableCPCheckState()
	{
		$flag = $this->getCharStatField("CP:Enabled", "1");
		if ($flag > 0) return "checked";
		return "";
	}
	
	
	public function GetUpdate18RulesCheckState()
	{
		$flag = $this->getCharStatField("UseUpdate18Rules", "0");
		if ($flag > 0) return "checked";
		return "";
	}
	
	
	public function getCharTargetResist()
	{
		$resist = $this->getCharStatField("Target:Resistance", "18200");
		if ($resist <= 0) $resist = "18200";
		return $resist;
	}
	
	
	public function FixupComputedStatsForPts()
	{
	}
	
	
	public function FixupBuildForPts()
	{
		if (!$this->getCharStatField("UseUpdate18Rules", 0)) return false;
		
		$this->FixupComputedStatsForPts();
		
		return true;
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
				'{weaponBarClass1}' => $this->GetClassWeaponBar(1),
				'{weaponBarClass2}' => $this->GetClassWeaponBar(2),
				'{activeWeaponBar}' => $this->GetActiveWeaponBar(),
				'{activeSkillBar}' =>  $this->GetActiveAbilityBar(),
				'{saveButtonDisabled}' => $this->GetSaveButtonDisabled(),
				'{createCopyButtonDisabled}' => $this->GetCreateCopyButtonDisabled(),
				'{saveNote}' => $this->GetSaveNote(),
				'{trail}' => $this->GetBreadcrumbTrailHtml(),
				'{stealth}' => $this->GetStealthCheckState(),
				'{cyrodiil}' => $this->GetCyrodiilCheckState(),
				'{enableCP}' => $this->GetEnableCPCheckState(),
				'{useUpdate18Rules}' => $this->GetUpdate18RulesCheckState(),  
				'{setNamesJson}' => $this->GetSetNamesJson(),
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
	
		foreach ($_COOKIE as $name => $val)
		{
			//$output .= "\t$name = '$val'\n";
		}
		
		file_put_contents($this->SESSION_DEBUG_FILENAME, $output, FILE_APPEND | LOCK_EX);
	}
	
	
	public function SetSessionData()
	{
		global $_SESSION;
		
		$_SESSION['UESP_ESO_canEditBuild']   = false;
		$_SESSION['UESP_ESO_canDeleteBuild'] = false;
		$_SESSION['UESP_ESO_canCreateBuild'] = false;
		
		if ($this->wikiContext == null) return $this->ReportError("Failed to setup session data!");
		
		//$request = $this->wikiContext->getRequest();
		//if ($request == null) return $this->ReportError("Failed to setup session data!");
		
		//$request->setSessionData( 'UESP_ESO_canEditBuild', $this->buildDataViewer->canWikiUserEdit() );
		//$request->setSessionData( 'UESP_ESO_canDeleteBuild', $this->buildDataViewer->canWikiUserDelete() );
		//$request->setSessionData( 'UESP_ESO_canCreateBuild', $this->buildDataViewer->canWikiUserCreate() );
		
		$_SESSION['UESP_ESO_canEditBuild']   = $this->buildDataViewer->canWikiUserEdit();
		$_SESSION['UESP_ESO_canDeleteBuild'] = $this->buildDataViewer->canWikiUserDelete();
		$_SESSION['UESP_ESO_canCreateBuild'] = $this->buildDataViewer->canWikiUserCreate();
		
		//$val = $request->getSessionData('UESP_ESO_canEditBuild');
		//$val = $_SESSION['UESP_ESO_canEditBuild'];
		//$val1 = $this->buildDataViewer->canWikiUserEdit();
		
		//error_log("EsoBuildSetSession: '$val' = '$val1'");
		//$this->DebugSessionData();
	}
	
		
	public function GetOutputHtml()
	{
		
		if (!$this->LoadBuild())
		{
			return $this->OutputError("Could not find the specified character build!");
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



