<?php

require_once("/home/uesp/secrets/esolog.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/esolog.static/viewCps.class.php");
require_once("/home/uesp/esolog.static/viewSkills.class.php");
require_once(__DIR__."/viewBuildData.class.php");
require_once("/home/uesp/www/esomap/UespMemcachedSession.php");


class EsoBuildDataEditor 
{
	public $TEMPLATE_FILE = "";
	
	public $db = null;
	public $htmlTemplate = "";
	public $version = "";
	
	public $viewCps = null;
	public $viewSkills = null;
	
	public $buildDataViewer = null;
	
	public $buildId = null;
	
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
			"Head" 		=> "http://esobuilds.uesp.net/resources/gearslot_head.png",
			"Shoulders" => "http://esobuilds.uesp.net/resources/gearslot_shoulders.png",
			"Chest" 	=> "http://esobuilds.uesp.net/resources/gearslot_chest.png",
			"Hands" 	=> "http://esobuilds.uesp.net/resources/gearslot_hands.png",
			"Waist" 	=> "http://esobuilds.uesp.net/resources/gearslot_belt.png",
			"Legs" 		=> "http://esobuilds.uesp.net/resources/gearslot_legs.png",
			"Feet" 		=> "http://esobuilds.uesp.net/resources/gearslot_feet.png",
			"Neck"		=> "http://esobuilds.uesp.net/resources/gearslot_neck.png",
			"Ring1"		=> "http://esobuilds.uesp.net/resources/gearslot_ring.png",
			"Ring2"		=> "http://esobuilds.uesp.net/resources/gearslot_ring.png",
			"MainHand1" => "http://esobuilds.uesp.net/resources/gearslot_mainhand.png",
			"MainHand2" => "http://esobuilds.uesp.net/resources/gearslot_mainhand.png",
			"OffHand1" 	=> "http://esobuilds.uesp.net/resources/gearslot_offhand.png",
			"OffHand2" 	=> "http://esobuilds.uesp.net/resources/gearslot_offhand.png",
			"Poison1" 	=> "http://esobuilds.uesp.net/resources/gearslot_poison.png",
			"Poison2"	=> "http://esobuilds.uesp.net/resources/gearslot_poison.png",
			"Food"		=> "http://esobuilds.uesp.net/resources/gearslot_quickslot.png",
			"Potion"	=> "http://esobuilds.uesp.net/resources/gearslot_quickslot.png",
	);
	
	public $STATS_UNIQUE_LIST = array(
			"Item.Divines",
			"Item.Sturdy",
			"Item.Prosperous",
			"Item.Training",
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
			"Weapon1HShield",
			"WeaponOffHandDamage",
			"Level",
			"CPLevel",
			"EffectiveLevel",
			"EffectiveLevel",
			"CP.TotalPoints",
			"CP.UsedPoints",
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
			"SkillCost.Fighters_Guild_Cost",
			"SkillCost.Mages_Guild_Cost",
			"SkillCost.Undaunted_Cost",
			"SkillCost.Assault_Cost",
			"SkillCost.Support_Cost",
			"Stealthed",
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
			"FireResist",
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
			"SneakCost",
			"BreakFreeCost",
			"HARestore",
			"Constitution",
			"DamageShield",
			"HADamageResist",
			"DotDamageTaken",
			"DotDamageDone",
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
			"LAHADamage",
			"HADamage",
			"LADamage",
			"HAWeaponDamage",
			"HABowDamage",
			"HAStaffDamage",
			"ShieldDamage",
			"FearDuration",
			"SnareDuration",
			"MagickaCost",
			"StaminaCost",
			"UltimateCost",
			"PotionDuration",
			"PotionCooldown",
			"AttackSpeed",
			"TrapResist",
			"PlayerDamageResist",
			"NegativeEffectDuration",
			"BowRange",
			"FireEffectDuration",
			"BowAbilityCost",
			"BowAbilityDamage",
			"ResurrectSpeed",
			"BossDamageResist",
			"SneakRange",
			"SneakDetectRange",
			"TwiceBornStar",
			"HAChargeTime",
			"FireDamageResist",
			"DodgeChance",
			"DamageTaken",
			"DamageDone",
			"Empower",
	);
	
	
	public $MUNDUS_TYPES = array(
			"The Apprentice" 	=> "Spell Damage",
			"The Atronach" 		=> "Magicka Recovery",
			"The Lady" 			=> "Physical Resist",
			"The Lover" 		=> "Spell Resist",
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
			"Ebonheart Pack",
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
			
			"Skill.Magicka" => array(
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
			
			"Skill.CritDamage" => array(
					"display" => "%",
			),
			
			"Mundus.CritDamage" => array(
					"display" => "%",
			),
			
			"Skill.CritDamage" => array(
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
			
				//Set raw critical values?
			"Item.WeaponCrit" => array(
					"display" => "%",
			),
			
			"Mundus.WeaponCrit" => array(
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
			
			"CP.DotDamageDone" => array(
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
			
			"Skill.UltimateCost" => array(
					"display" => "%",
			),
				
			"Skill.StaminaCost" => array(
					"display" => "%",
			),
			
			"Skill.SneakRange" => array(
					"display" => "%",
			),
			
			"Item.RollDodgeCost" => array(
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
			
			"Skill.SprintSpeed" => array(
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
			
			"Buff.SpellDamage" => array(
					"display" => "%",
			),
			
			"Buff.WeaponDamage" => array(
					"display" => "%",
			),		
			
			"Skill.FireDamageResist" => array(
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
			
			"Buff.MagicDamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.PhysicalDamageTaken" => array(
					"display" => "%",
			),
			
			"Buff.SprintSpeed" => array(
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
			
			"SkillCost.Vampire_Cost" => array(
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
			
			"Skill.HARestore" => array(
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
		
			
	);
	
	
	public $COMPUTED_STATS_LIST = array(
			
			"Health" => array(
					"title" => "Health",
					"round" => "floor",
					"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"156 * Level + 944",
							"122 * Attribute.Health",
							"+",
							"Item.Health",
							"+",
							"Set.Health",
							"+",
							"1 + pow(CP.Health, 0.56432)/100",
							"*",
							"Food.Health",
							"+",
							"Mundus.Health",
							"+",
							"floor(Mundus.Health * Item.Divines)",
							"+",
							"1 + Skill.Health + Buff.Health",
							"*",
					),
			),
			
			"Magicka" => array(
					"title" => "Magicka",
					"round" => "floor",
					"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"142 * Level + 858",
							"111 * Attribute.Magicka",
							"+",
							"Item.Magicka",
							"+",
							"Set.Magicka",
							"+",
							"1 + pow(CP.Magicka, 0.56432)/100",
							"*",
							"Food.Magicka",
							"+",
							"Mundus.Magicka",
							"+",
							"floor(Mundus.Magicka * Item.Divines)",
							"+",
							"1 + Skill.Magicka + Buff.Magicka",
							"*",
					),
			),
			
			"Stamina" => array(
					"title" => "Stamina",
					"round" => "floor",
					"warning" => "Note: Currently there is a bug on Live with the Undaunted Mettle passive that sometimes causes incorrect health/magica/stamina values to be displayed. Logging out and back in should reset the display issue.",
					"compute" => array(
							"142 * Level + 858",
							"111 * Attribute.Stamina",
							"+",						
							"Item.Stamina",
							"+",
							"Set.Stamina",
							"+",
							"1 + pow(CP.Stamina, 0.56432)/100",
							"*",
							"Food.Stamina",
							"+",
							"Mundus.Stamina",
							"+",
							"floor(Mundus.Stamina * Item.Divines)",
							"+",
							"1 + Skill.Stamina + Buff.Stamina",
							"*",
					),
			),
			
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
							"floor(Mundus.HealthRegen * Item.Divines)",
							"+",
							"1 + CP.HealthRegen",
							"*",
							"1 + Skill2.HealthRegen",
							"*",
							"Food.HealthRegen",
							"+",
							"1 + Skill.HealthRegen + Buff.HealthRegen",
							"*",
					),
			),
			
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
							"floor(Mundus.MagickaRegen * Item.Divines)",
							"+",
							"1 + CP.MagickaRegen",
							"*",
							"1 + Skill2.MagickaRegen",
							"*",
							"Food.MagickaRegen",
							"+",
							"1 + Skill.MagickaRegen + Buff.MagickaRegen",
							"*",
					),
			),
			
			"StaminaRegen" => array(
					"title" => "Stamina Recovery",
					"round" => "floor",
					"compute" => array(
							"round(9.30612 * Level + 48.7)",
							"Item.StaminaRegen",
							"+",
							"Set.StaminaRegen",
							"+",
							"Mundus.StaminaRegen",
							"+",
							"floor(Mundus.StaminaRegen * Item.Divines)",
							"+",
							"1 + CP.StaminaRegen",
							"*",
							"1 + Skill2.StaminaRegen",
							"*",
							"Food.StaminaRegen",
							"+",
							"1 + Skill.StaminaRegen + Buff.StaminaRegen",
							"*",
					),
			),
			
			"SpellDamage" => array(
					"title" => "Spell Damage",
					"round" => "floor",
					"compute" => array(
							"Item.SpellDamage",
							"Set.SpellDamage",
							"+",
							"Mundus.SpellDamage",
							"+",
							"floor(Mundus.SpellDamage * Item.Divines)",
							"+",
							"1 + Skill.SpellDamage + Buff.SpellDamage",
							"*",							
					),
			),
			
			"WeaponDamage" => array(
					"title" => "Weapon Damage",
					"round" => "floor",
					"compute" => array(
							"Item.WeaponDamage",
							"Set.WeaponDamage",
							"+",
							"Mundus.WeaponDamage",
							"+",
							"floor(Mundus.WeaponDamage * Item.Divines)",
							"+",
							"1 + Skill.WeaponDamage + Buff.WeaponDamage",
							"*",
					),
			),
			
			
			"SpellCrit" => array(
					"title" => "Spell Critical",
					"display" => "%",
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
							"Mundus.SpellCrit * Item.Divines",
							"+",
							"Skill.SpellCrit",
							"+",
							"CP.SpellCrit",
							"+",
					),
			),
			
			"WeaponCrit" => array(
					"title" => "Weapon Critical",
					"display" => "%",
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
							"Mundus.WeaponCrit * Item.Divines",
							"+",
							"Skill.WeaponCrit",
							"+",
							"CP.WeaponCrit",
							"+",
					),
			),
			
			"SpellCritDamage" => array(
					"title" => "Spell Critical Damage",
					"display" => "%",
					"compute" => array(
							"CP.SpellCritDamage",
							"Skill.CritDamage",
							"+",
							"Mundus.CritDamage",
							"+",
							"Mundus.CritDamage * Item.Divines",
							"+",
							"Buff.CritDamage",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritDamage",
							"*",
					),
			),
			
			"WeaponCritDamage" => array(
					"title" => "Weapon Critical Damage",
					"display" => "%",
					"compute" => array(
							"CP.WeaponCritDamage",
							"Skill.CritDamage",
							"+",
							"Mundus.CritDamage",
							"+",
							"Mundus.CritDamage * Item.Divines",
							"+",
							"Buff.CritDamage",
							"+",
							"0.5",
							"+",
							"1 + Skill2.CritDamage",
							"*",
					),
			),
			
			"SpellResist" => array(
					"title" => "Spell Resistance",
					"display" => "resist",
					"compute" => array(
							"Item.SpellResist",
							"Skill2.SpellResist",
							"+",
							"Set.SpellResist",
							"+",
							"Skill.SpellResist",
							"+",
							"Buff.SpellResist",
							"+",
							"CP.SpellResist",
							"+",
					),
			),
			
			"PhysicalResist" => array(
					"title" => "Physical Resistance",
					"display" => "resist",
					"compute" => array(
							"Item.PhysicalResist",
							"Skill2.PhysicalResist",
							"+",
							"Set.PhysicalResist",
							"+",
							"Skill.PhysicalResist",
							"+",
							"Buff.PhysicalResist",
							"+",
							"CP.PhysicalResist",
							"+",
					),
			),
			
			"CritResist" => array(
					"title" => "Critical Resistance",
					"display" => "critresist",
					"compute" => array(
							"Item.CritResist",
							"Set.CritResist",
							"+",
							"Skill.CritResist",
							"+",
					),
			),
			
			"ColdResist" => array(
					"title" => "Cold Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.ColdResist",
							"Set.ColdResist",
							"+",
							"Skill.ColdResist",
							"+",
							"CP.ColdResist",
							"+",
							"Buff.ColdResist",
							"+",
					),
			),
			
			"FireResist" => array(
					"title" => "Fire Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.FireResist",
							"Set.FireResist",
							"+",
							"Skill.FireResist",
							"+",
							"CP.FireResist",
							"+",
							"Buff.FireResist",
							"+",
					),
			),
			
			"ShockResist" => array(
					"title" => "Shock Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.ShockResist",
							"Set.ShockResist",
							"+",
							"Skill.ShockResist",
							"+",
							"CP.ShockResist",
							"+",
							"Buff.ShockResist",
							"+",
					),
			),
			
			"PoisonResist" => array(
					"title" => "Poison Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.PoisonResist",
							"Set.PoisonResist",
							"+",
							"Skill.PoisonResist",
							"+",
							"CP.PoisonResist",
							"+",
							"Buff.PoisonResist",
							"+",
					),
			),
			
			"DiseaseResist" => array(
					"title" => "Disease Resistance",
					"display" => "elementresist",
					"compute" => array(
							"Item.DiseaseResist",
							"Set.DiseaseResist",
							"+",
							"Skill.DiseaseResist",
							"+",
							"CP.DiseaseResist",
							"+",
							"Buff.DiseaseResist",
							"+",
					),
			),
			
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
					),
			),
			
			"PhysicalPenetration" => array(
					"title" => "Physical Penetration",
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
					),
			),
						
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
			
			"HealingReceived" => array(
					"title" => "Healing Received",
					"display" => "%",
					"compute" => array(
							"Item.HealingReceived",
							"Set.HealingReceived",
							"+",
							"Skill.HealingReceived",
							"+",
							"CP.HealingReceived",
							"+",
							"Buff.HealingReceived",
							"+",
					),
			),
			
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
			
			"HealingReduction" => array(
					"title" => "Healing Reduction",
					"display" => "%",
					"compute" => array(
							"1 + CP.HealingReduction",
					),
			),
			
			"SneakCost" => array(
					"title" => "Sneak Cost",
					"round" => "floor",
					"compute" => array(				// TODO: Include item
							"1 + 2 * EffectiveLevel",
							"1 - CP.SneakCost",
							"*",
							"1 - Skill.SneakCost",
							"*",
					),
			),
			
			"SneakRange" => array(					// TODO: Check?
					"title" => "Sneak Range",
					"round" => "floor",
					"compute" => array(
							"21",
							"Item.SneakRange",
							"-",
							"1 - Skill.SneakRange",
							"*",
					),
			),
			
			"SneakDetectRange" => array(			// TODO: Check?
					"title" => "Sneak Detection Range",
					"round" => "floor",
					"compute" => array(
							"21",
							"Item.SneakDetectRange",
							"+",
							"1 + Skill.SneakDetectRange",
							"*",
					),
			),
			
			"SprintCost" => array(
					"title" => "Sprint Cost",
					"round" => "floor",
					"compute" => array(		// TODO: Include items/skills
							"floor(38.46 + 7.69*EffectiveLevel)",
							"1 - CP.SprintCost",
							"*",
					),
			),
			
			"BashCost" => array(
					"title" => "Bash Cost",
					"round" => "floor",
					"compute" => array(
							"floor(157 + 26.25*EffectiveLevel)",
							"Item.BashCost * 1.1625",  // TODO: Check?
							"-",
							"1 - CP.BashCost",
							"*",
					),
			),
			
			"BlockCost" => array(
					"title" => "Block Cost",
					"round" => "floor",
					"compute" => array(
							"180 + 30*EffectiveLevel",
							"1 - Item.Sturdy",
							"*",
							"1 - CP.BlockCost",
							"*",
							"Item.BlockCost",
							"-",
							"Set.BlockCost",
							"-",
							"1 - Skill.BlockCost",
							"*",
					),
			),
			
			"BlockMitigation" => array(
					"title" => "Block Mitigation",
					"display" => "%",
					"compute" => array(
							"0.5",
							"1 - Skill.BlockMitigation",
							"*",
					),
			),
			
			"RollDodgeCost" => array(
					"title" => "Roll Dodge Cost",
					"round" => "floor",
					"compute" => array(
							"floor(34 + 5.62*EffectiveLevel)*10",
							"1 - CP.RollDodgeCost",
							"*",
							"1 - Skill.RollDodgeCost",
							"*",
							"1 - Item.RollDodgeCost",  	// TODO: Check?
							"*",
							"1 - Set.RollDodgeCost",  	// TODO: Check?
							"*",
					),
			),
			
			"BreakFreeCost" => array(					// TODO: Check?
					"title" => "Break Free Cost",
					"round" => "floor",
					"compute" => array(
							"450 + 75*EffectiveLevel",
							"1 - CP.BreakFreeCost",
							"*",
							"1 - Skill.BreakFreeCost",
							"*",
							"1 - Item.BreakFreeCost",
							"*",
							"1 - Set.BreakFreeCost",
							"*",
					),
			),
			
			"FearDuration" => array(
					"title" => "Fear Duration",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 - CP.FearDuration",
					),
			),
				
			"HARestore" => array(
					"title" => "Heavy Attack Restore",
					"round" => "floor",
					"compute" => array(
							"floor(1 + Level * 28.25)",
							"floor(CPLevel * 30.625)",
							"+",
							"1 + CP.HARestore",
							"*",
							"1 + Skill.HARestore",
							"*",
							"1 + Set.HARestore",	// TODO: Check?
							"*",
					),
			),
			
			"Constitution" => array(				// TODO: Check?
					"title" => "Constitution",
					"round" => "floor",
					"compute" => array(
							"floor(2.82 * EffectiveLevel)",
							"ArmorHeavy",
							"*",
							"1 + Set.Constitution",
							"*",
					),
			),
			
			"MagickaCost" => array(
					"title" => "Magicka Ability Cost",
					"round" => "floor",
					"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"Misc.SpellCost",
							"1 - CP.MagickaCost",
							"*",
							"Item.MagickaCost",
							"-",
							"1 - Skill.MagickaCost - Set.MagickaCost",
							"*",
					),
			),
			
			"StaminaCost" => array(
					"title" => "Stamina Ability Cost",
					"round" => "floor",
					"warning" => "Note: Currently there is a bug on Live that randomly results in ability costs 0-2% higher than normal. ",
					"compute" => array(
							"Misc.SpellCost",
							"1 - CP.StaminaCost",
							"*",
							"Item.StaminaCost",
							"-",
							"1 - Skill.StaminaCost - Set.StaminaCost",
							"*",
					),
			),
			
			"DamageShield" => array(
					"title" => "Damage Shield",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.DamageShield",
					),
			),
			
			"ShieldDamage" => array(
					"title" => "Shield Damage",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.ShieldDamage",
					),
			),
			
			"DotDamageTaken" => array(
					"title" => "DOT Damge Taken",
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
			
			"MagicDamageTaken" => array(
					"title" => "Magic Damage Taken",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"CP.MagicDamageTaken",
							"Skill.MagicDamageTaken",
							"+",
							"Buff.MagicDamageTaken",
							"+",
							"Item.MagicDamageTaken",
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
							"Buff.PhysicalDamageTaken",
							"+",
							"Item.PhysicalDamageTaken",
							"+",
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
					),
			),
			
			"HADamageResist" => array(
					"title" => "Light/Heavy Attack Resist",
					"display" => "%",
					"round" => "floor",
					"compute" => array(
							"1 + CP.HADamageResist",
					),
			),
			
			"HAFireStaff" => array(						// TODO: Staff passive?
					"title" => "Heavy Attack Fire Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"0.055*Magicka",
							"2.20*SpellDamage - 0.67",
							"+",
							"1 + CP.HAStaffDamage",
							"*",
					),
			),
			
			"HAColdStaff" => array(						// TODO: Staff passive?
					"title" => "Heavy Attack Cold Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"0.055*Magicka",
							"2.20*SpellDamage - 0.67",
							"+",
							"1 + CP.HAStaffDamage",
							"*",
					),
			),
			
			"HAShockStaff" => array(					// TODO: Staff passive?
					"title" => "Heavy Attack Shock Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"0.013*Magicka",
							"0.52*SpellDamage - 0.26",
							"+",
							"1.8",
							"*",
							"0.0182*Magicka",
							"0.728*SpellDamage - 0.03",
							"+",
							"+",
							"1 + CP.HAStaffDamage",
							"*",
					),
			),
			
			"HARestoration" => array(
					"title" => "Heavy Attack Restoration",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"0.0481*Magicka",
							"1.92*SpellDamage - 3.06",
							"+",
							"1.6",
							"*",
							"0.02643*Magicka",
							"1.055*SpellDamage - 0.62",
							"+",
							"+",
							"1 + CP.HAStaffDamage",
							"*",
					),
			),
			
			"HAOneHand" => array(
					"title" => "Heavy Attack One Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.03852*Stamina",
							"1.5436*WeaponDamage - 0.33",
							"+",
							"1 + CP.HAWeaponDamage",
							"*",
					),
			),
			
			"HATwoHand" => array(						// TODO: Axe, Mace, Sword 2H passive
					"title" => "Heavy Attack Two Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.123*Stamina",
							"1.283*WeaponDamage - 0.94",
							"+",
							"1 + CP.HAWeaponDamage",
							"*",
					),
			),
			
			"HABow" => array(
					"title" => "Heavy Attack Bow",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.0550*Stamina",
							"2.20*WeaponDamage - 0.95",
							"+",
							"1 + CP.HABowDamage",
							"*",
					),
			),
			
			"HADualWield" => array(						// TODO: Dual wield passive
					"title" => "Heavy Attack Dual Wield",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.01636*Stamina",
							"0.6556*WeaponDamage + 0.81",
							"+",
							"0.0199*Stamina",
							"0.800*WeaponDamage + 3.82",
							"+",
							"+",
							"1 + CP.HAWeaponDamage",
							"*",
					),
			),
			
			"HAWerewolf" => array(
					"title" => "Heavy Attack Werewolf",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.0440*Stamina",
							"1.76*WeaponDamage + 0.74",
							"+",
							"1 + CP.HAWeaponDamage", // TODO: Check?
							"*",
					),
			),
			
			"LAStaff" => array(
					"title" => "Light Attack Staff",
					"round" => "floor",
					"depends" => array("Magicka", "SpellDamage"),
					"compute" => array(
							"0.0140*Magicka",
							"0.56*SpellDamage - 0.60",
							"+",
							"1 + CP.HAStaffDamage",
							"*",
					),
			),
			
			"LAOneHand" => array(
					"title" => "Light Attack One Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.0140*Stamina",
							"0.56*WeaponDamage - 0.60",
							"+",
							"1 + CP.HAWeaponDamage",
							"*",
					),
			),
			
			"LATwoHand" => array(
					"title" => "Light Attack Two Hand",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.0148*Stamina",
							"0.592*WeaponDamage - 1.06",
							"+",
							"1 + CP.HAWeaponDamage",
							"*",
					),
			),
			
			"LABow" => array(
					"title" => "Light Attack Bow",
					"round" => "floor",
					"depends" => array("Stamina", "WeaponDamage"),
					"compute" => array(
							"0.0140*Stamina",
							"0.56*WeaponDamage - 0.60",
							"+",
							"1 + CP.HABowDamage",
							"*",
					),
			),
			
			"AttackSpellMitigation" => array(
					"title" => "Attacker Spell Mitigation",
					"display" => "%",
					"depends" => array("SpellPenetration"),
					"compute" => array(
							"Target.SpellResist",
							"1 - Skill2.SpellPenetration",
							"*",
							"SpellPenetration",
							"-",
							"-1/(Level * 1000)",
							"*",
							"1",
							"+",
							"1 - Target.DefenseBonus",
							"*",
							"1 + MagicDamageDone",
							"*",
					),
			),
				
			"AttackPhysicalMitigation" => array(
					"title" => "Attacker Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalPenetration"),
					"compute" => array(
							"Target.PhysicalResist",
							"1 - Skill2.PhysicalPenetration",
							"*",
							"PhysicalPenetration",
							"-",
							"-1/(Level * 1000)",
							"*",
							"1",
							"+",
							"1 - Target.DefenseBonus",
							"*",
							"1 + PhysicalDamageDone",
							"*",
					),
			),
				
			"DefenseSpellMitigation" => array(
					"title" => "Defending Spell Mitigation",
					"display" => "%",
					"depends" => array("SpellResist"),
					"compute" => array(
							"SpellResist",
							"1 - Target.PenetrationFactor",
							"*",
							"Target.PenetrationFlat",
							"-",
							"-1/(Level * 1000)",
							"*",
							"1",
							"+",
							"1 + Target.AttackBonus",
							"*",
							"1 - MagicDamageTaken",
							"*",
					),
			),
				
			"DefensePhysicalMitigation" => array(
					"title" => "Defending Physical Mitigation",
					"display" => "%",
					"depends" => array("PhysicalResist"),
					"compute" => array(
							"PhysicalResist",
							"1 - Target.PenetrationFactor",
							"*",
							"Target.PenetrationFlat",
							"-",
							"-1/(Level * 1000)",
							"*",
							"1",
							"+",
							"1 + Target.AttackBonus",
							"*",
							"1 - PhysicalDamageTaken",
							"*",
					),
			),
			
			//SprintSpeed
			//Physical/spell mitigation = (resistance - 100) / (level*10)
			//Mitigation = [Resist ÷ (Level × 1,000)] or  = (resistance-100)/(level+VR)*10
			// 50% cap on element + spell resistance
			//Flat Crit = 2 * (effectiveLevel) * (100 + effectiveLevel)

	); 
	
	
	public function __construct()
	{
		UespMemcachedSession::install();
		
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
		$output .= "<option value='none' $selected>(none)</option>";
		
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
		
		$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId1>[0-9]*)\:(?P<enchantSubtype1>[0-9]*)\:(?P<enchantLevel1>[0-9]*)\:(?P<enchantId2>[0-9]*)\:(?P<enchantSubtype2>[0-9]*)\:(?P<enchantLevel2>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<stolen>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h\[?(?P<name>[a-zA-Z0-9 %_\(\)\'\-]*)(?P<nameCode>.*?)\]?\|h/', $itemLink, $matches);
		
		if (!$result) 
		{
			$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId1>[0-9]*)\:(?P<enchantSubtype1>[0-9]*)\:(?P<enchantLevel1>[0-9]*)\:(?P<enchantId2>[0-9]*)\:(?P<enchantSubtype2>[0-9]*)\:(?P<enchantLevel2>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h\[?(?P<name>[a-zA-Z0-9 %_\(\)\'\-]*)(?P<nameCode>.*?)\]?\|h/', $itemLink, $matches);
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
		
		$linkData['enchantId2'] = $matches['enchantId2'];
		$linkData['enchantIntLevel2'] = $matches['enchantLevel2'];
		$linkData['enchantIntType2'] = $matches['enchantSubtype2'];
		
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
		$imageSrc = $this->GEARSLOT_BASEICONS[$slotId];
		
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
		
		foreach ($this->buildDataViewer->characterData['stats'] as $name => $value)
		{
			$result = preg_match("/^ToggleSkill:(.*)$/", $name);
			if (!$result) continue;
			
			$names = explode(":", $name);
			$skillName = $names[1];
			$count = $names[2];
			
			if ($this->initialToggleSkillData[$skillName] == null) $this->initialToggleSkillData[$skillName] = array();
			
			if ($count !== null)
				$this->initialToggleSkillData[$skillName]['count'] = $value;
			else
				$this->initialToggleSkillData[$skillName]['enabled'] = $value;			
		}
	}
	
	
	public function CreateInitialToggleSetData()
	{
		$this->initialSetToggleData = array();
		
		foreach ($this->buildDataViewer->characterData['stats'] as $name => $value)
		{
			$result = preg_match("/^ToogleSet:(.*)$/", $name);
			if (!$result) continue;
				
			$names = explode(":", $name);
			$setName = $names[1];
				
			if ($this->initialToggleSetData[$setName] == null) $this->initialToggleSetData[$setName] = array();
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
		
		$this->initialSkillData = array();
		$this->initialSkillData['UsedPoints'] = $this->getCharStatField("SkillPointsUsed", 0);
		$this->initialSkillData['UnusedPoints'] = $this->getCharStatField("SkillPointsUnused", 0);;
		$this->initialSkillData['TotalPoints'] = $this->getCharStatField("SkillPointsTotal", 0);;
		
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
		
		for ($i = 0; $i < 2; ++$i)
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
	}

	
	public function GetClassWeaponBar($weaponBar)
	{
		$activeBar = $this->getCharStatField("ActiveAbilityBar", 1);
		if ($activeBar == $weaponBar) return "esotbWeaponSelect";
		return "";
	}
	
	
	public function GetActiveWeaponBar()
	{
		return $this->getCharStatField("ActiveAbilityBar", 1);
	}
	
	
	public function LoadBuild()
	{
		if ($this->buildId === null) return true;
		$this->buildDataViewer->characterId = $this->buildId;
		
		if (!$this->buildDataViewer->loadCharacter()) return false;
		
		$this->viewSkills->LoadData();
	
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
		$canEdit = $this->buildDataViewer->canWikiUserEdit();
		if (!$canEdit) return "disabled";
		return "";
	}
	
	
	public function GetCreateCopyButtonDisabled()
	{
		$canCreate = $this->buildDataViewer->canWikiUserCreate();
		
		if (!$canCreate || $this->buildId <= 0) return "disabled";
		return "";
	}
	
	
	public function GetSaveNote()
	{
		$isNew = !($this->buildId > 0);
		$canEdit = $this->buildDataViewer->canWikiUserEdit();
		$canDelete = $this->buildDataViewer->canWikiUserDelete();
		$canCreate = $this->buildDataViewer->canWikiUserCreate();
		
		$label = "existing";
		if ($isNew) $label = "new";
		
		if (!$canCreate) return "You can modify this $label build data but you will not be able to save it or create a new copy of it. Login or create a Wiki account in order to save and create new builds.";
		if (!$canEdit) return "You can modify this $label build data but you will not be able to save it. You can, however, create a new copy of the build data you will can save.";
		
		return "You are able to save this $label build data or create a new copy of it.";
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
				'{vampireStage}' => $this->GetCharVampireStage(),
				'{werewolfStage}' => $this->GetCharWerewolfStage(),
				'{attributeTotal}' => $this->getCharStatField("AttributesTotal", "0"),
				'{attributeHealth}' => $this->getCharStatField("AttributesHealth", "0"),
				'{attributeMagicka}' => $this->getCharStatField("AttributesMagicka", "0"),
				'{attributeStamina}' => $this->getCharStatField("AttributesStamina", "0"),
				'{targetFlatPene}' => $this->getCharStatField("Target:PenetrationFlat", "0"),
				'{targetFactPene}' => $this->getCharStatField("Target:PenetrationFactor", "0"),
				'{targetFactDefense}' => $this->getCharStatField("Target:DefenseBonus", "0"),
				'{targetFactAttack}' => $this->getCharStatField("Target:AttackBonus", "0"),
				'{targetResist}' => $this->getCharStatField("Target:Resistance", "0"),
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
				'{activeBar}' => $this->GetActiveWeaponBar(),
				'{saveButtonDisabled}' => $this->GetSaveButtonDisabled(),
				'{createCopyButtonDisabled}' => $this->GetCreateCopyButtonDisabled(),
				'{saveNote}' => $this->GetSaveNote(),
				'{trail}' => $this->GetBreadcrumbTrailHtml(),
		);
		
		$output = strtr($this->htmlTemplate, $replacePairs);
		return $output;
	}
	
	
	public function SetSessionData()
	{
		if ($this->wikiContext == null) return $this->ReportError("Failed to setup session data!");
		
		$request = $this->wikiContext->getRequest();
		if ($request == null) return $this->ReportError("Failed to setup session data!");
		
		$request->setSessionData( 'UESP_ESO_canEditBuild', $this->buildDataViewer->canWikiUserEdit() );
		$request->setSessionData( 'UESP_ESO_canDeleteBuild', $this->buildDataViewer->canWikiUserDelete() );
		$request->setSessionData( 'UESP_ESO_canCreateBuild', $this->buildDataViewer->canWikiUserCreate() );
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


