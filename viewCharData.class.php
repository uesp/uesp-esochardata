<?php 


require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataViewer
{
	const ESO_ICON_URL = "http://esoicons.uesp.net";
	const ESO_HTML_TEMPLATE = "templates/esochardata_embed_template.txt";
	const ESO_WEAPON_CRITICAL_FACTOR = 0.00597099;
	const ESO_SPELL_CRITICAL_FACTOR = 0.00563926;
	
	public $inputParams = array();
	public $outputHtml = "";
	public $htmlTemplate = "";
	
	public $characterData = array();
	public $skillData = array();
	public $buildData = array();
	
	public $characterId = 0;
	public $viewRawData = false;
	public $useBuildTable = true; 
	
	public $db = null;
	private $dbReadInitialized  = false;
	public $lastQuery = "";
	
	public $baseUrl = "viewCharData.php";
	
	public $skillDataDisplay = 'block';
	public $skillTreeFirstName = '';
	
	
	public function __construct ()
	{
		$this->initDatabase();
		$this->loadHtmlTemplate();
	}
	
	
	public function escape($input)
	{
		return htmlspecialchars($input, ENT_COMPAT, 'UTF-8');
	}
	
	
	public function reportError($msg)
	{
		error_log("Error: " . $msg);
		
		$outputHtml .= "Error: " . $msg;
		
		if ($this->db != null && $this->db->error)
		{
			$outputHtml .= "\tDB Error:" . $this->db->error;
			$outputHtml .= "\tLast Query:" . $this->lastQuery;
		}
		
		return false;
	}
	
	
	private function initDatabase ()
	{
		global $uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase;
	
		if ($this->dbReadInitialized) return true;
	
		$this->db = new mysqli($uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
	
		return true;
	}
	
	
	public function loadHtmlTemplate()
	{
		$this->htmlTemplate = file_get_contents(__DIR__ . '/' . self::ESO_HTML_TEMPLATE);
	}
	
	
	public function getSafeFieldStr(&$arrayData, $field)
	{
		if (!array_key_exists($field, $arrayData)) return '';
		return $this->db->real_escape_string($arrayData[$field]);
	}
	
	
	public function getSafeFieldInt(&$arrayData, $field)
	{
		if (!array_key_exists($field, $arrayData)) return 0;
		return $this->db->real_escape_string(intval($arrayData[$field]));
	}
	
	
	public function formatCharacterLevel($level)
	{
		if ($level < 50) return strval($level);
		if ($level == 50) return "v1";
		return "v" . ($level - 50);
	}
	
	
	public function parseFormInput()
	{
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists('id', $this->inputParams)) $this->characterId = intval($this->inputParams['id']);
		if (array_key_exists('raw', $this->inputParams)) $this->viewRawData = true;
	
		return true;
	}
	
	
	public function loadBuilds()
	{
		$query = "SELECT * FROM characters ORDER BY buildName;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load builds!");
		
		$result->data_seek(0);
		
		while (($row = $result->fetch_assoc()))
		{
			$this->buildData[] = $row;
		}
		
		return true;
	}
	
	
	public function loadCharacter()
	{
		if ($this->characterId <= 0) return $this->reportError("Cannot load character: No characterId specified!");
		
		$query = "SELECT * FROM characters WHERE id={$this->characterId};";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load character {$this->characterId}!");
		
		$result->data_seek(0);
		$this->characterData = $result->fetch_assoc();
		
		$this->characterData['cp'] = $this->characterData['championPoints']; 
		
		if (!$this->loadCharacterArrayData("buffs")) return false;
		if (!$this->loadCharacterArrayData("championPoints")) return false;
		if (!$this->loadCharacterArrayData("skills")) return false;
		if (!$this->loadCharacterArrayData("stats")) return false;
		if (!$this->loadCharacterArrayData("equipSlots")) return false;
		if (!$this->loadCharacterArrayData("actionBars")) return false;
		if (!$this->loadCharacterArrayData("screenshots")) return false;
		
		$this->parseCharSkillData();
		$this->parseCharChampionPointData();
		
		return true;
	}
	
	
	public function loadCharacterArrayData($table)
	{
		$query = "SELECT * FROM $table WHERE characterId={$this->characterId};";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load $table data for character {$this->characterId}!");
		
		$result->data_seek(0);
		$arrayData = array();
		
		while (($row = $result->fetch_assoc()))
		{
			if ($table == "equipSlots" || $table == "actionBars")
			{
				$arrayData[$row['index']] = $row;
			}
			else
			{
				$arrayData[$row['name']] = $row;
			}
		}
		
	/*	if ($table == "equipSlots" || $table == "actionBars")
			usort($arrayData, charArrayDataCompareByIndex);
		else
			usort($arrayData, charArrayDataCompareByName); */
		
		ksort($arrayData);
		$this->characterData[$table] = $arrayData;
		
		return true;
	}
	
	
	public function createCharacterOutput()
	{
		if (!$this->loadCharacter()) return false;
		if ($this->viewRawData) return $this->createCharacterOutputRaw();
		
		$replacePairs = array(
					'{buildName}' => $this->getCharField('buildName'),
					'{buildType}' => $this->getCharField('buildType'),
					'{charName}' => $this->getCharField('name'),
					'{race}' => $this->getCharField('race'),
					'{class}' => $this->getCharField('class'),
					'{special}' => $this->getCharField('special'),				
					'{level}' => $this->formatCharacterLevel($this->getCharField('level')),
					'{levelTitle}' => $this->getCharLevelTitle(),
					'{championPoints}' => $this->getCharField('cp'),
					'{rawLevel}' => $this->getCharField('level'),
					'{action11}' => $this->getCharActionHtml(1, 1),
					'{action12}' => $this->getCharActionHtml(1, 2),
					'{action13}' => $this->getCharActionHtml(1, 3),
					'{action14}' => $this->getCharActionHtml(1, 4),
					'{action15}' => $this->getCharActionHtml(1, 5),
					'{action16}' => $this->getCharActionHtml(1, 6),
					'{action21}' => $this->getCharActionHtml(2, 1),
					'{action22}' => $this->getCharActionHtml(2, 2),
					'{action23}' => $this->getCharActionHtml(2, 3),
					'{action24}' => $this->getCharActionHtml(2, 4),
					'{action25}' => $this->getCharActionHtml(2, 5),
					'{action26}' => $this->getCharActionHtml(2, 6),
					'{attrMag}' => $this->getCharStatField('AttributesMagicka'),
					'{attrHea}' => $this->getCharStatField('AttributesHealth'),
					'{attrSta}' => $this->getCharStatField('AttributesStamina'),
					'{basicStats}' => $this->getCharBasicStatsHtml(),
					'{equipHead}' => $this->getCharEquipSlotHtml(0),
					'{equipShoulder}' => $this->getCharEquipSlotHtml(3),
					'{equipChest}' => $this->getCharEquipSlotHtml(2),
					'{equipLeg}' => $this->getCharEquipSlotHtml(8),
					'{equipBelt}' => $this->getCharEquipSlotHtml(6),
					'{equipGlove}' => $this->getCharEquipSlotHtml(16),
					'{equipFeet}' => $this->getCharEquipSlotHtml(9),
					'{equipNeck}' => $this->getCharEquipSlotHtml(1),
					'{equipCostume}' => $this->getCharEquipSlotHtml(10),
					'{equipRing1}' => $this->getCharEquipSlotHtml(11),
					'{equipRing2}' => $this->getCharEquipSlotHtml(12),
					'{equipWeapon11}' => $this->getCharEquipSlotHtml(4),
					'{equipWeapon12}' => $this->getCharEquipSlotHtml(5),
					'{equipWeapon21}' => $this->getCharEquipSlotHtml(20),
					'{equipWeapon22}' => $this->getCharEquipSlotHtml(21),
					'{buffs}' => $this->getCharBuffsHtml(),
					'{skyshards}' => $this->getCharStatField('SkyShards'),
					'{skillPointsUnused}' => $this->getCharStatField('SkillPointsUnused'),
					'{skillPointsTotal}' => $this->getCharStatField('SkillPointsTotal'),
					'{skillTree}' => $this->getCharSkillTreeHtml(),
					'{skillContents}' => $this->getCharSkillContentHtml(),
					'{skillContentTitle}' => $this->skillTreeFirstName,
					'{rawLink}' => $this->getCharacterLink($this->characterId, true),
					'{createDate}' => $this->getCharCreateDate(),
					'{figureImage}' => $this->getCharFigureImageUrl(),
			);
		
		$this->outputHtml .= strtr($this->htmlTemplate, $replacePairs);
		
		return true;
	}
	
	
	public function getCharFigureImageUrl()
	{
		$gender = intval($this->getCharStatField('Gender'));
		$race = $this->getCharStatField('Race');
		$output = "resources/silhouette_human_male.png";
		
		if ($race == 'Argonian')
		{
			if ($gender == 2)
				$output = "resources/silhouette_argonian_male.png";
			else
				$output = "resources/silhouette_argonian_female.png";
		}
		elseif ($race == 'Khajiit')
		{
			if ($gender == 2)
				$output = "resources/silhouette_khajiit_male.png";
			else
				$output = "resources/silhouette_khajiit_female.png";
		}
		elseif ($gender == 2)
		{
			$output = "resources/silhouette_human_male.png";
		}
		else
		{
			$output = "resources/silhouette_human_female.png";
		}
		
		return $output;
	}
	
	
	public function getCharCreateDate()
	{
		$output = date('Y-m-d H:i:s', $this->getCharField('createTime'));
		
		return $output;
	}
	
	
	public function getCharSkillContentHtml()
	{
		$output = "";
		$this->skillDataDisplay = 'block';
		
		foreach($this->skillData as $name => &$data)
		{
			$output .= $this->getCharSkillContentHtml1($name, $data);	
		}
		
		return $output;
	}
	
	
	public function getCharSkillContentHtml1($skillName, &$skillData)
	{
		$output = "";
	
		foreach($skillData as $name => &$data)
		{
			$output .= $this->getCharSkillContentHtml2($name, $data);
		}
	
		return $output;
	}
	
	
	public function getCharSkillContentHtml2($skillName, &$skillData)
	{
		$safeName = $this->escape($skillName);
		$idName = str_replace("'", '', str_replace(' ', '', $safeName));
		
		$displayType = 'none';
		if ($skillName == $this->skillTreeFirstName) $displayType = "block";
				
		$output = "<div id='ecdSkill_$idName' class='ecdSkillData' style='display: {$displayType};'>\n";
		
		reset($skillData);
		
		if (is_numeric(key($skillData)))
			$output .= $this->getCharSkillContentHtmlSkills($skillData);
		else
			$output .= $this->getCharSkillContentHtmlCP($skillData);
	
		$output .= "</div>\n";
		return $output;
	}
	
	
	public function getCharSkillContentHtmlSkills(&$skillData)
	{
		$foundUltimate = false;
		$foundSkill = false;
		$foundPassive = false;
		$output = "";
		
		for ($i = 0; $i < 100; ++$i)
		{
			if (!array_key_exists($i, $skillData)) continue;
			
			if ($skillData[$i]['type'] == 'ultimate' && !$foundUltimate)
			{
				$output .= "<div class='ecdSkillDataHeader'>ULTIMATES</div>\n";
				$foundUltimate = true;
			}
			else if ($skillData[$i]['type'] == 'skill' && !$foundSkill)
			{
				$output .= "<div class='ecdSkillDataHeader'>SKILLS</div>\n";
				$foundSkill = true;
			}
			else if ($skillData[$i]['type'] == 'passive' && !$foundPassive)
			{
				$output .= "<div class='ecdSkillDataHeader'>PASSIVES</div>\n";
				$foundPassive = true;
			}
			
			$output .= $this->getCharSkillContentHtml3($i, $skillData[$i]);
		}
		
		return $output;
	}
	
	
	public function getCharSkillContentHtmlCP(&$skillData)
	{
		$output = "";
		
		foreach ($skillData as $name => &$data)
		{
			$output .= $this->getCharSkillContentHtml3CP($name, $data);
		}
		
		return $output;
	}
	
	
	public function getCharSkillContentHtml3CP($skillName, &$skillData)
	{
		$output = "<div class='ecdSkillDataBox'>\n";
		
		$safeName = $this->escape($skillName);
		$points = $skillData['points'];
		$abilityId = $skillData['abilityId'];
		$desc = $this->convertDescriptionToHtml($skillData['description']);
		
		if ($points <= 0) $points = '';
		
		$output .= "<div class='ecdSkillName'>$points $safeName</div>\n";
		$output .= "<div class='ecdSkillNameDesc'>$desc</div>\n";
		$output .= "</div>\n";
		
		return $output;
	}
		
	
	public function getCharSkillContentHtml3($skillName, &$skillData)
	{
		$output = "<div class='ecdSkillDataBox'>\n";
		
		$safeName = $this->escape($skillData['baseName']);
		$rawIcon = $skillData['icon'];
		$iconUrl = $this->convertIconToImageUrl($rawIcon);
		
		$rank = $skillData['rank'];
		$outputRank = '';
		$className = 'ecdSkillIconBox';
		
		if ($skillData['type'] == 'passive') 
		{
			$className = 'ecdSkillPassiveIconBox';
			$outputRank = '(' . $rank . ')';
		}
		
		$output .= "<div class='$className ecdTooltipTrigger'>\n";
		$output .= "<img src='$iconUrl' class='ecdSkillIcon' />\n";
		$output .= $this->getCharSkillTooltipHtml($skillData, 'ecdSkillTooltip1');
		$output .= "</div>\n";			
		
		$output .= "<div class='ecdSkillName'>$safeName $outputRank</div>\n";
		$output .= "</div>\n";
		
		return $output;
	}
	
	
	public function getCharSkillTooltipHtml(&$skillData, $className)
	{
		$output = "<div class='ecdTooltip $className'>\n";
		
		$safeName = $this->escape($skillData['baseName']);
		if ($safeName == '') $safeName = $this->escape($skillData['name']);
		
		$desc = $this->convertDescriptionToHtml($skillData['description']);
		$channelTime = intval($skillData['channelTime']) / 1000;
		$castTime = intval($skillData['castTime']) / 1000;
		$radius = intval($skillData['radius']) / 100;
		$duration = intval($skillData['duration']) / 1000;
		$target = $this->escape($skillData['target']);
		$area = $this->escape($skillData['area']);
		$range = $this->escape($skillData['range']);
		$cost = $this->escape($skillData['cost']);
		$castTimeStr = $castTime . " seconds";
		$skillType = $skillData['type'];
		
		$output .= "<div class='ecdSkillTooltipTitle'>$safeName</div>\n";
		$output .= "<img src='resources/skill_divider.png' class='ecdSkillTooltipDivider' />";
		
		if ($skillType != 'passive')
		{
		
			if ($channelTime > 0) 
			{
				$output .= "<div class='ecdSkillTooltipValue'>$channelTime seconds</div>";
				$output .= "<div class='ecdSkillTooltipName'>Channel Time</div>";			
			}
			else if ($castTime <= 0)
			{
				$castTimeStr = "Instant";
			}
					
			if ($castTimeStr != '')
			{
				$output .= "<div class='ecdSkillTooltipValue'>$castTimeStr</div>";
				$output .= "<div class='ecdSkillTooltipName'>Cast Time</div>";			
			}
			
			if ($target != '')
			{
				$output .= "<div class='ecdSkillTooltipValue'>$target</div>";
				$output .= "<div class='ecdSkillTooltipName'>Target</div>";			
			}
			
			if ($area != '')
			{
				$output .= "<div class='ecdSkillTooltipValue'>$area</div>";
				$output .= "<div class='ecdSkillTooltipName'>Area</div>";			
			}
			
			if ($radius > 0)
			{
				$output .= "<div class='ecdSkillTooltipValue'>$radius meters</div>";
				$output .= "<div class='ecdSkillTooltipName'>Radius</div>";			
			}
			
			if ($range > 0)
			{
				$output .= "<div class='ecdSkillTooltipValue'>$range</div>";
				$output .= "<div class='ecdSkillTooltipName'>Range</div>";			
			}
			
			if ($duration > 0)
			{
				$output .= "<div class='ecdSkillTooltipValue'>$duration seconds</div>";
				$output .= "<div class='ecdSkillTooltipName'>Duration</div>";			
			}
			
			if ($cost != '')
			{
				$output .= "<div class='ecdSkillTooltipValue'>$cost</div>";
				$output .= "<div class='ecdSkillTooltipName'>Cost</div>";			
			}
			
			$output .= "<img src='resources/skill_divider.png' class='ecdSkillTooltipDivider' />";
		}
		
		
		$output .= "<div class='ecdSkillTooltipDesc'>$desc</div>\n";
		$output .= "</div>";
		
		return $output;
	}
	
	
	public function getCharSkillTreeHtml()
	{
		$output = "";
		$this->skillTreeDisplay = 'block';
		$this->skillTreeFirstName = '';

		$output .= $this->getCharSkillTreeHtml1("CLASS", $this->skillData['Class']);
		$output .= $this->getCharSkillTreeHtml1("WEAPON", $this->skillData['Weapon']);
		$output .= $this->getCharSkillTreeHtml1("ARMOR", $this->skillData['Armor']);
		$output .= $this->getCharSkillTreeHtml1("WORLD", $this->skillData['World']);
		$output .= $this->getCharSkillTreeHtml1("GUILD", $this->skillData['Guild']);
		$output .= $this->getCharSkillTreeHtml1("ALLIANCE WAR", $this->skillData['Alliance War']);
		$output .= $this->getCharSkillTreeHtml1("RACIAL", $this->skillData['Racial']);
		$output .= $this->getCharSkillTreeHtml1("CRAFT", $this->skillData['Craft']);
		$output .= $this->getCharSkillTreeHtml1("CHAMPION POINTS", $this->skillData['ChampionPoints']);
		
		return $output;
	}
	
	
	public function getCharSkillTreeHtml1($skillName, &$skillData)
	{
		if ($skillData == null) return "";
		
		$safeName = $this->escape($skillName);
		
		$output  = "<div class='ecdSkillTree1'>\n";
		$output .= "<div class='ecdSkillTreeName1'>$safeName</div>\n";
		$output .= "<div class='ecdSkillTreeContent1' style='display: {$this->skillTreeDisplay};'>\n";
		
		$this->skillTreeDisplay = 'none';
		
		foreach ($skillData as $name => &$data)
		{
			$output .= $this->getCharSkillTreeHtml2($name, $data);
		}		
		
		$output .= "</div>\n";
		$output .= "</div>\n";
		return $output;		
	}
	
	
	public function getCharSkillTreeHtml2($skillName, &$skillData)
	{
		$safeName = $this->escape($skillName);
		$extraClass = '';
		
		$cpPointsId = 'ChampionPoints:' . $skillName . ':Points';
		$cpPoints = $this->getCharStatField($cpPointsId);
				
		if ($this->skillTreeFirstName == '')
		{
			$extraClass = 'ecdSkillTreeNameHighlight2';
			$this->skillTreeFirstName = $skillName;
		}
		
		if ($cpPoints > 0)
		{
			$output = "<div class='ecdSkillTreeName2 $extraClass'>$safeName <div class='ecdSkillTreeNameCp'>$cpPoints</div></div>\n";
		}
		else
		{
			$output = "<div class='ecdSkillTreeName2 $extraClass'>$safeName</div>\n";
		}
		
		return $output;
	}
	
	
	public function parseCharSkillData()
	{
		
		foreach ($this->characterData['skills'] as $skillName => &$skillData)
		{
			$this->parseCharSkill($skillName, $skillData);
		}
		
		return true;
	}
	
	
	public function parseCharChampionPointData()
	{
	
		foreach ($this->characterData['championPoints'] as $cpName => &$cpData)
		{
			$this->parseCharChampionPoint($cpName, $cpData);
		}
	
		return true;
	}
	
	
	public function parseCharChampionPoint($cpName, &$cpData)
	{
		$names = explode(':', $cpName);
		if (count($names) != 2) return $this->reportError("Champion point '$cpName' doesn't have 2 parts!");
		
		if (!array_key_exists('ChampionPoints', $this->skillData)) $this->skillData['ChampionPoints'] = array();
		if (!array_key_exists($names[0], $this->skillData['ChampionPoints'])) $this->skillData['ChampionPoints'][$names[0]] = array();
		
		$newData = $cpData;
		$newData['baseName'] = $names[1];
		$this->skillData['ChampionPoints'][$names[0]][$names[1]] = $newData;
		
		return true;
	}
	
	
	public function parseCharSkill($skillName, &$skillData)
	{
		$names = explode(':', $skillName);
		$index = intval($skillData['index']);
		
		if (count($names) == 4)
		{
			$names[2] .= ':' . $names[3];
			unset($names[3]);
		}
		
		if (count($names) != 3) return $this->reportError("Skill name '$skillName' doesn't have 3 parts!");
		if ($index == null) return $this->reportError("Skill name '$skillName' missing index data!");
		
		if (!array_key_exists($names[0], $this->skillData)) $this->skillData[$names[0]] = array();
		if (!array_key_exists($names[1], $this->skillData[$names[0]])) $this->skillData[$names[0]][$names[1]] = array();
		
		$this->skillData[$names[0]][$names[1]][$index] = $skillData;
		$this->skillData[$names[0]][$names[1]][$index]['baseName'] = $names[2];
			
		return true;
	}
	
	
	public function getCharBuffsHtml()
	{
		
		foreach ($this->characterData['buffs'] as $buff)
		{
			$output .= $this->getCharBuffHtml($buff);
		}
		
		return $output;
	}
	
	
	public function isBuffFoodOrDrink($buffName)
	{
		if (preg_match("/ Recovery$/", $buffName)) return true;
		if (preg_match("/^Increase /", $buffName)) return true;
		return false;
	}
	
	
	public function getCharBuffHtml($buff)
	{
		$output = "";
		$buffName = $buff['name'];
		$safeName = $this->escape($buffName);
		$rawIcon = $buff['icon'];
		$abilityId = $buff['abilityId'];
		
		if (!$this->checkDisplayBuffName($buffName)) return "";
		
		if ($this->isBuffFoodOrDrink($buffName))
		{
			$foodDesc = $this->convertDescriptionToHtml($this->getCharStatField('LastFoodEatenDesc'));
			if ($foodDesc != "") $safeName = $foodDesc;
		}
		
		$iconUrl = $this->convertIconToImageUrl($rawIcon);
		$output .= "<div class='ecdBuff'><img src=\"$iconUrl\" title=\"$rawIcon\"/>\n";
		$output .= "<div class='ecdBuffDesc'>$safeName</div>\n";
		$output .= "</div>\n";
		
		return $output;
	}
	
	
	public function checkDisplayBuffName($buffName)
	{
		static $IGNORED_BUFFS = array(
				'ESO Plus Member' => 1,
		);
		
		if ($IGNORED_BUFFS[$buffName] == null) return True;
		return False;
	}
	
	
	public function getCharEquipSlotHtml($slotIndex)
	{
		$output = "";
		
		$itemIntLevel = '';
		$itemIntId = '';
		$itemIntType = '';
		$safeItemLink = '';
		$itemLink = '';
			
		$iconUrl = $this->getCharEquipSlotDefaultImage($slotIndex);
		
		$equipSlot = $this->characterData['equipSlots'][$slotIndex];
		
		if ($equipSlot != null) 
		{		
			$rawIcon = $equipSlot['icon'];
			$iconUrl = $this->convertIconToImageUrl($rawIcon);
			$itemLink = $equipSlot['itemLink'];
			$itemName = $equipSlot['name'];
			
			//|H0:item:71267:304:50:0:0:0:0:0:0:0:0:0:0:0:0:21:0:1:0:0:0|h|h
			$matches = array();
			$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:/', $itemLink, $matches);
			
			if ($result != 0)
			{
				$safeItemLink = $this->escape($itemLink);
				$itemIntLevel = $matches['level'];
				$itemIntId = $matches['itemId'];
				$itemIntType = $matches['subtype'];
			}
		}
		
		$output .= "<img src=\"$iconUrl\" class=\"eso_item_link\" itemlink=\"$safeItemLink\" intlevel=\"$itemIntLevel\" inttype=\"$itemIntType\" itemid=\"$itemIntId\" />";
		
		return $output;
	}
	
	
	public function getCharEquipSlotDefaultImage($slotIndex)
	{
		static $IMAGES = array(
				0 => 'resources/gearslot_head.png',
				1 => 'resources/gearslot_neck.png',
				2 => 'resources/gearslot_chest.png',
				3 => 'resources/gearslot_shoulders.png',
				4 => 'resources/gearslot_mainhand.png',
				5 => 'resources/gearslot_offhand.png',
				6 => 'resources/gearslot_belt.png',
				8 => 'resources/gearslot_legs.png',
				9 => 'resources/gearslot_feet.png',
				10 => 'resources/gearslot_costume.png',
				11 => 'resources/gearslot_ring.png',
				12 => 'resources/gearslot_ring.png',
				16 => 'resources/gearslot_hands.png',
				20 => 'resources/gearslot_mainhand.png',
				21 => 'resources/gearslot_offhand.png',
		);
		
		$icon = $IMAGES[$slotIndex];
		if ($icon == null) return "";
		return $icon;
	}
	
	
	public function getCharBasicStatsHtml()
	{
		$output  = "";
		$output .= $this->getCharBasicStatHtml('Magicka', 'Magicka');
		$output .= $this->getCharBasicStatHtml('Health', 'Health');
		$output .= $this->getCharBasicStatHtml('Stamina', 'Stamina');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Magicka Recovery', 'MagickaRegenCombat');
		$output .= $this->getCharBasicStatHtml('Health Recovery', 'HealthRegenCombat');
		$output .= $this->getCharBasicStatHtml('Stamina Recovery', 'StaminaRegenCombat');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Damage', 'SpellPower');
		$output .= $this->getCharBasicStatHtml('Spell Critical', 'SpellCritical', self::ESO_SPELL_CRITICAL_FACTOR, '%');
		$output .= $this->getCharBasicStatHtml('Weapon Damage', 'WeaponPower');
		$output .= $this->getCharBasicStatHtml('Weapon Critical', 'CriticalStrike', self::ESO_WEAPON_CRITICAL_FACTOR, '%');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Resistance', 'SpellResist');
		$output .= $this->getCharBasicStatHtml('Physical Resistance', 'PhysicalResist');
		$output .= $this->getCharBasicStatHtml('Critical Resistance', 'CriticalResist');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Penetration', 'SpellPenetration');
		$output .= $this->getCharBasicStatHtml('Physical Penetration', 'PhysicalPenetration');
		$output .= "<br />";
		
		return $output;
	}
	
	
	public function getCharBasicStatHtml($title, $field, $factor = 1, $suffix = '')
	{
		$title = $this->escape($title);
		$rawValue = (intval($this->characterData['stats'][$field]['value'] * $factor * 10)) / 10;
		$value = $this->escape($rawValue);
		
		$output  = "<div class='ecdStat'>"; 
		$output .= "<div class='ecdStatTitle'>$title</div>";
		$output .= "<div class='ecdStatValue'>$value$suffix</div>";
		$output .= "</div>\n";
		
		return $output;	
	}
	
	
	public function getCharField($field)
	{
		if (!array_key_exists($field, $this->characterData)) return "";
		return $this->escape($this->characterData[$field]);
	}
	
	
	public function getCharStatField($field)
	{
		if (!array_key_exists($field, $this->characterData['stats'])) return "";
		return $this->escape($this->characterData['stats'][$field]['value']);
	}
	
	
	public function getCharActionHtml($barIndex, $skillIndex)
	{
		$index = ($barIndex - 1) * 100 + $skillIndex + 2;
		$action = null;
		
		foreach ($this->characterData['actionBars'] as $bar)
		{
			if ($bar['index'] == $index)
			{
				$action = $bar;
				break;
			}
		}
		
		if ($action == null)
		{
			$icon = '';
			$iconUrl = '';
			$desc = '';
			$name = '';
			$abilityId = '';
		}
		else
		{
			$icon = $action['icon'];
			$iconUrl = $this->convertIconToImageUrl($icon);
			$desc = $this->convertDescriptionToHtml($action['description']);
			$name = $this->escape($action['name']);
			$abilityId = $action['abilityId'];
		}
		
		$output  = "<div class='ecdActionIcon ecdTooltipTrigger'>";
		$output .= "<img src=\"$iconUrl\" class='ecdActionIconImage' />";
		
		if ($name != '')
		{
			$output .= $this->getCharSkillTooltipHtml($action, 'ecdSkillTooltip');
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharLevelTitle()
	{
		if ($this->characterData['level'] >= 50) return 'VETERAN RANK';
		return 'LEVEL';
	}
	

	public function createCharacterOutputRaw()
	{
		$characterOutput = "<a name='ecd_character'></a>";
		$arrayOutput = "";
		$contentsOutput .= "<li><a href=\"#ecd_character\">Character Summary</a></li>";
		
		foreach ($this->characterData as $key => &$data)
		{
			if (is_array($data))
			{
				$arrayOutput .= $this->getCharacterRawArrayOutput($key, $data);
				$sectionTitle = $this->getCharacterRawSectionTitle($key);
				$contentsOutput .= "<li><a href=\"#ecd_$key\">$sectionTitle</a></li>";
			}
			else
			{
				$characterOutput .= $this->getCharacterRawOutput($key, $data);
			}
				
		}
		
		$normalLink = $this->getCharacterLink($this->characterId, false);
		$contentsOutput .= "<li><a href=\"$normalLink\">View Normal Data</a></li>";
		
		$this->outputHtml .= "<ul id='ecdTableOfContents'>\n";
		$this->outputHtml .= $contentsOutput;
		$this->outputHtml .= "</ul>\n";
		$this->outputHtml .= "<table class='ecdRawCharData'>\n";
		$this->outputHtml .= "<th colspan='20'>Character Summary</th>\n";
		$this->outputHtml .= $characterOutput;
		$this->outputHtml .= "</table> <p />\n";
		$this->outputHtml .= "<small>Character Data Exported on " . $this->getCharCreateDate() . "</small>";
		$this->outputHtml .= $arrayOutput;
		
		return true;
	}
	
	
	public function getCharacterRawSectionTitle($section)
	{
		static $SECTIONS = array(
				'championPoints' => 'Champion Points',	
				'buffs' => 'Buffs',
				'skills' => 'Skills',
				'stats' => 'Stats',
				'equipSlots' => 'Equipment',
				'actionBars' => 'Action Bars',
				'screenshots' => 'Screenshots',
		);
		
		$title = $SECTIONS[$section];
		if ($title == null) return $section;
		return $title;
	}
	
	
	public function checkCharacterRawColumnName($colName)
	{
		if ($colName == 'id') return false;
		if ($colName == 'characterId') return false;
		
		return true;
	}
	
	
	public function checkCharacterRawKeyName($keyName)
	{
		if ($keyName == 'IPAddress') return false;
	
		return true;
	}
	
	
	public function convertDescriptionToText($description)
	{
		$newDesc = preg_replace('/\|c[a-fA-F0-9]{6}([a-zA-Z _0-9\.\+\-\:\;\n\r\t]*)\|r/', '$1', $description);
		return $newDesc;
	}
	
	
	public function convertDescriptionToHtml($description)
	{
		$newDesc = preg_replace('/\|c[a-fA-F0-9]{6}([a-zA-Z _0-9\.\+\-\:\;\n\r\t]*)\|r/', '<div class="ecdWhite">$1</div>', $description);
		$newDesc = preg_replace('/\n/', '<br />', $newDesc);
		return $newDesc;
	}
	
	
	public function convertIconToImageLink($icon)
	{
		$height = "";
		if ($this->viewRawData) $height = "32";
		$pngIconUrl = $this->convertIconToImageUrl($icon);
		$iconLink = "<img src=\"$pngIconUrl\" height='$height' title=\"$icon\" />";
		return $iconLink;
	}
	
	
	public function convertIconToImageUrl($icon)
	{
		if ($icon == null || $icon == "") return "";
		
		$pngIcon = preg_replace("/\.dds$/", ".png", $icon);
		return self::ESO_ICON_URL . $pngIcon;
	}
	
	
	public function getCharacterRawArrayOutput($name, $data)
	{
		$output  = "<hr />";
		$output .= "<a name='ecd_$name'></a>";
		$title = $this->getCharacterRawSectionTitle($name);
		$output .= "<h2>$title</h2>";
		$output .= "<table class='ecdRawCharArrayData'>\n";
		$firstRow = true;
		
		foreach ($data as $key => &$arrayData)
		{
			$skipRow = false;
			
			if ($firstRow)
			{
				$output .= "<tr>\n";
				
				foreach ($arrayData as $rowName => $value)
				{
					if (!$this->checkCharacterRawColumnName($rowName)) continue;
					$safeRowName = $this->escape($rowName);
					$output .= "<th>$safeRowName</td>\n";
				}
				
				$firstRow = false;
				$output .= "</tr>\n";
			}
			
			$safeKey = $this->escape($key);
			$rowOutput = "<tr>\n";
			
			foreach ($arrayData as $rowName => $value)
			{
				if (!$this->checkCharacterRawColumnName($rowName)) continue;
				if (!$this->checkCharacterRawKeyName($value)) $skipRow = true;
				
				$className = "";
				
				if ($rowName == 'description')
				{
					$safeValue = $this->escape($this->convertDescriptionToText($value));
				}
				elseif ($rowName == 'icon')
				{
					$safeValue = $this->convertIconToImageLink($value);
				}
				elseif ($rowName == 'name') 
				{
				 	$className = 'ecdRawCharHeader';
				 	$safeValue = $this->escape($value);
				}
				else
				{
					$safeValue = $this->escape($value);
				}
				
				$rowOutput .= "<td class='$className'>$safeValue</td>\n";
			}
			
			$rowOutput .= "</tr>\n";
			if (!$skipRow) $output .= $rowOutput;
		}
		
		$output .= "</table> <p />\n";
		return $output;
	}
	
	
	public function getCharacterRawOutput($name, $data)
	{
		if (!$this->checkCharacterRawKeyName($name)) return "";
		
		$safeName = $this->escape($name);
		$safeData = $this->escape($data);
		
		$output  = "<tr>\n";
		$output .= "<td class='ecdRawCharHeader'>$safeName</td>\n";
		$output .= "<td>$safeData</td>\n";
		$output .= "</tr>\n";
		
		return $output;
	}
	
	
	public function createBuildTableHtml()
	{
		if (!$this->loadBuilds()) return false;
		
		$this->outputHtml .= "<table id='ecdBuildTable'>\n";
		$this->outputHtml .= "<tr class='ecdBuildTableHeader'>\n";
		$this->outputHtml .= "<th>Build Name</th>\n";
		$this->outputHtml .= "<th>Class</th>\n";
		$this->outputHtml .= "<th>Race</th>\n";
		$this->outputHtml .= "<th>Type</th>\n";
		$this->outputHtml .= "<th>Special</th>\n";
		$this->outputHtml .= "<th>Character</th>\n";
		$this->outputHtml .= "<th>Level</th>\n";
		$this->outputHtml .= "<th>CPs</th>\n";
		$this->outputHtml .= "</tr>\n";
		
		foreach ($this->buildData as $buildData)
		{
			$this->outputHtml .= $this->getBuildTableItemHtml($buildData);
		}
		
		$this->outputHtml .= "</table>\n";		
		
		return true;
	}
	
	
	public function getBuildTableItemHtml($buildData)
	{
		$output = "";
		
		$buildName = $this->escape($this->getSafeFieldStr($buildData, 'buildName'));
		$charName = $this->escape($this->getSafeFieldStr($buildData, 'name'));
		$buildType = $this->escape($this->getSafeFieldStr($buildData, 'buildType'));
		$className = $this->escape($this->getSafeFieldStr($buildData, 'class'));
		$raceName = $this->escape($this->getSafeFieldStr($buildData, 'race'));
		$level = $this->formatCharacterLevel($this->getSafeFieldInt($buildData, 'level'));
		$cp = $this->getSafeFieldInt($buildData, 'championPoints');
		$charId = $this->getSafeFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		$special = $this->escape($this->getSafeFieldStr($buildData, 'special'));
		
		if ($buildName == "") $buildName = $charName;
				
		$output .= "<tr>\n";
		$output .= "<td class='ecdBuildTableName'><a href=\"$linkUrl\">$buildName</a></td>";
		$output .= "<td>$className</td>";
		$output .= "<td>$raceName</td>";
		$output .= "<td>$buildType</td>";
		$output .= "<td>$special</td>";
		$output .= "<td>$charName</td>";
		$output .= "<td>$level</td>";
		$output .= "<td>$cp</td>";
		$output .= "</tr>\n";
		
		return $output;
	}
		
	
	public function createBuildListHtml()
	{
		if (!$this->loadBuilds()) return false;
		
		$this->outputHtml .= "<ul id='ecdBuildList'>\n";
		
		foreach ($this->buildData as $buildData)
		{
			$outputHtml .= $this->getBuildListItemHtml($buildData);
		}
		
		$this->outputHtml .= "</ul>\n";
		
		return true;
	}
	
	
	public function getCharacterLink($charId, $viewRaw = false)
	{
		$link  = $this->baseUrl . "?";
		$link .= "id=$charId&";
		
		if ($viewRaw) $link .= "raw&";
		
		return $link;
	}
	
		
	public function getBuildListItemHtml($buildData)
	{
		$output = "";
		
		$buildName = $this->escape($this->getSafeFieldStr($buildData, 'buildName'));
		$charName = $this->escape($this->getSafeFieldStr($buildData, 'name'));
		$buildType = $this->escape($this->getSafeFieldStr($buildData, 'buildType'));
		$className = $this->escape($this->getSafeFieldStr($buildData, 'class'));
		$raceName = $this->escape($this->getSafeFieldStr($buildData, 'race'));
		$level = $this->formatCharacterLevel($this->getSafeFieldInt($buildData, 'level'));
		$cp = $this->getSafeFieldInt($buildData, 'championPoints');
		$charId = $this->getSafeFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		$special = $this->escape($this->getSafeFieldStr($buildData, 'special'));
		
		if ($buildType == "other") $buildType = "";
		
		if ($buildName == "")
		{
			$buildName = $charName;
			$charName = "";
		}
		
		$output .= "<li><a href=\"$linkUrl\">$buildName <div class='ecdQuietBuildLink'> -- $buildType $className $special ($raceName, $level, $cp CP) $charName</div></a></li>\n";
		
		return $output;
	}
	
		
	public function getOutput()
	{
		
		if (!$this->parseFormInput()) 
		{
			$this->reportError("Error parsing input data!");
			return $this->outputHtml;
		}
		
		if ($this->characterId > 0)
			$this->createCharacterOutput();
		elseif ($this->useBuildTable)
			$this->createBuildTableHtml();
		else
			$this->createBuildListHtml();
	
		return $this->outputHtml;
	}
	

	
};


function charArrayDataCompareByName($a, $b)
{
	return strcmp($a["name"], $b["name"]);
}


function charArrayDataCompareByIndex($a, $b)
{
	return $a["index"] - $b["index"];
}



