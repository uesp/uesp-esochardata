<?php

require_once("/home/uesp/secrets/esolog.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/esolog.static/viewCps.class.php");
require_once("/home/uesp/esolog.static/viewSkills.class.php");


class CEsoTestBuild 
{
	public $TEMPLATE_FILE = "";
	
	public $db = null;
	public $htmlTemplate = "";
	public $version = "";
	
	public $viewCps = null;
	public $viewSkills = null;
	
	
	public $GEARSLOT_BASEICONS = array(
			"Head" 		=> "resources/gearslot_head.png",
			"Shoulders" => "resources/gearslot_shoulders.png",
			"Chest" 	=> "resources/gearslot_chest.png",
			"Hands" 	=> "resources/gearslot_hands.png",
			"Waist" 	=> "resources/gearslot_belt.png",
			"Legs" 		=> "resources/gearslot_legs.png",
			"Feet" 		=> "resources/gearslot_feet.png",
			"Neck"		=> "resources/gearslot_neck.png",
			"Ring1"		=> "resources/gearslot_ring.png",
			"Ring2"		=> "resources/gearslot_ring.png",
			"MainHand1" => "resources/gearslot_mainhand.png",
			"MainHand2" => "resources/gearslot_mainhand.png",
			"OffHand1" 	=> "resources/gearslot_offhand.png",
			"OffHand2" 	=> "resources/gearslot_offhand.png",
			"Poison1" 	=> "resources/gearslot_poison.png",
			"Poison2"	=> "resources/gearslot_poison.png",
			"Food"		=> "resources/gearslot_quickslot.png",
			"Potion"	=> "resources/gearslot_quickslot.png",
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
			"Mundus.Name",
			"Mundus.Name2",
			"Race",
			"Class",
			"Target.SpellResistance",
			"Target.PhysicalResistance",
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
			"Attribute",
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
							"1/219/100",
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
							"1/219/100",
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
			//Mitigation = [Resist � (Level � 1,000)] or  = (resistance-100)/(level+VR)*10
			// 50% cap on element + spell resistance

	); 
	
	
	public function __construct()
	{
		$this->TEMPLATE_FILE = __DIR__."/templates/esoeditbuild_template.txt";
		
		$this->viewCps = new CEsoViewCP(true);
		$this->viewCps->hideTopBar = true;
		$this->viewCps->shortDiscDisplay = true;
		
		$this->viewSkills = new CEsoViewSkills(true, "select");
		
		$this->MakeInputStatsList();
		$this->SetInputParams();
		$this->ParseInputParams();
		$this->InitDatabase();
		$this->LoadTemplate();
	}
	
	
	public function ReportError($errorMsg)
	{
		print($errorMsg);
		error_log($errorMsg);
		return false;
	}
	
	
	public function ParseInputParams ()
	{
		//if (array_key_exists('output', $this->inputParams)) $this->rawOutput = strtoupper($this->inputParams['output']);
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
				if ($this->INPUT_STATS_LIST[$statBase] == null) $this->INPUT_STATS_LIST[$statBase] = array();
				$this->INPUT_STATS_LIST[$statBase][$statList[1]] = 0;
			}			
		}
		
		foreach ($this->STATS_BASE_LIST as $stat)
		{
			$this->INPUT_STATS_LIST[$stat] = 0;
		}
		
		foreach ($this->STATS_TYPE_LIST as $statBase)
		{
			if ($this->INPUT_STATS_LIST[$statBase] == null) $this->INPUT_STATS_LIST[$statBase] = array();
			
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
	
	
	public function GetMundusListHtml()
	{
		$output = "";
		$output .= "<option value='none'>(none)</option>";
		
		foreach ($this->MUNDUS_TYPES as $name => $type)
		{
			$output .= "<option value='$name'>$name <small>($type)</small></option>";
		}
		
		return $output;
	}
	
	
	public function GetClassListHtml()
	{
		$output = "";
	
		foreach ($this->CLASS_TYPES as $class)
		{
			$output .= "<option value='$class'>$class</option>";
		}
	
		return $output;
	}
	
	
	public function GetRaceListHtml()
	{
		$output = "";
	
		foreach ($this->RACE_TYPES as $name => $extra)
		{
			$extraDesc = "";
			if ($extra != "") $extraDesc = " ($extra)";
			$output .= "<option value='$name'>$name$extraDesc</option>";
		}
	
		return $output;
	}
	
	
	public function GetCPHtml()
	{
		return $this->viewCps->GetOutputHtml();
	}
	
	
	public function GetSkillHtml()
	{
		return $this->viewSkills->GetOutputHtml();
	}
	
	
	public function GetOutputHtml()
	{
		$replacePairs = array(
				'{version}' => $this->version,
				'{esoComputedStatsJson}' => $this->GetComputedStatsJson(),
				'{esoInputStatsJson}' => $this->GetInputStatsJson(),
				'{esoInputStatDetailsJson}' => $this->GetInputStatDetailsJson(),
				'{gearIconJson}' => $this->GetGearIconJson(),
				'{raceList}' => $this->GetRaceListHtml(),
				'{classList}' => $this->GetClassListHtml(),
				'{mundusList}' => $this->GetMundusListHtml(),
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
		);
		
		$output = strtr($this->htmlTemplate, $replacePairs);
		return $output;
	}
	
	
	public function Render()
	{
		$this->OutputHtmlHeader();
		print($this->GetOutputHtml());
	}
	
};



$g_EsoTestBuild = new CEsoTestBuild();
$g_EsoTestBuild->Render();

