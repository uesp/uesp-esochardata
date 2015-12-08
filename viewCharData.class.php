<?php 


require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataViewer
{
	const ESO_ICON_URL = "http://esoicons.uesp.net";
	const ESO_HTML_TEMPLATE = "templates/esochardata_embed_template.txt";
	
	public $inputParams = array();
	public $outputHtml = "";
	public $htmlTemplate = "";
	
	public $characterData = array();
	public $buildData = array();
	
	public $characterId = 0;
	public $viewRawData = false;
	
	public $db = null;
	private $dbReadInitialized  = false;
	public $lastQuery = "";
	
	public $baseUrl = "viewCharData.php";
	
	
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
		$this->htmlTemplate = file_get_contents(self::ESO_HTML_TEMPLATE);
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
			$arrayData[] = $row;
			$this->buildData[] = $row;
		}
		
		if ($table == "equipSlots" || $table == "actionBars")
			usort($arrayData, charArrayDataCompareByIndex);
		else
			usort($arrayData, charArrayDataCompareByName);
		
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
			);
		
		$this->outputHtml .= strtr($this->htmlTemplate, $replacePairs);
		
		return true;
	}
	
	
	public function getCharField($field)
	{
		if (!array_key_exists($field, $this->characterData)) return "";
		return $this->escape($this->characterData[$field]);
	}
	
	
	public function getCharActionHtml($barIndex, $skillIndex)
	{
		if (!array_key_exists('actionBars', $this->characterData)) return "";
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
		
		if ($action == null) return "";
		
		$icon = $action['icon'];
		$iconUrl = $this->convertIconToImageUrl($icon);
		$desc = $this->convertDescriptionToHtml($action['description']);
		$name = $this->escape($action['name']);
		$abilityId = $action['abilityId'];
		
		$output  = "<div class='ecdActionIcon ecdTooltipTrigger'>";
		$output .= "<img src=\"$iconUrl\" />";
		$output .= "<div class='ecdTooltip ecdSkillTooltip'>";
		$output .= "<div class='ecdSkillTooltipTitle'>$name</div> <br /><br /> $desc";
		$output .= "</div>";
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
				$contentsOutput .= "<li><a href=\"#ecd_$key\">$key</a></li>";
			}
			else
			{
				$characterOutput .= $this->getCharacterRawOutput($key, $data);
			}
				
		}
		
		$this->outputHtml .= "<ul id='ecdTableOfContents'>\n";
		$this->outputHtml .= $contentsOutput;
		$this->outputHtml .= "</ul>\n";
		$this->outputHtml .= "<table class='ecdRawCharData'>\n";
		$this->outputHtml .= "<th colspan='20'>Character Summary</th>\n";
		$this->outputHtml .= $characterOutput;
		$this->outputHtml .= "</table> <p />\n";
		$this->outputHtml .= $arrayOutput;
	
		return true;
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
		$pngIcon = preg_replace("/\.dds$/", ".png", $icon);
		return self::ESO_ICON_URL . $pngIcon;
	}
	
	
	public function getCharacterRawArrayOutput($name, $data)
	{
		$output  = "<hr />";
		$output .= "<a name='ecd_$name'></a>";
		$output .= "<h2>$name</h2>";
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
	
	
	public function createBuildListOutput()
	{
		if (!$this->loadBuilds()) return false;
		
		$this->outputHtml .= "<ul id='ecdBuildList'>\n";
		
		foreach ($this->buildData as $buildData)
		{
			$this->createBuildOutput($buildData);
		}
		
		$this->outputHtml .= "</ul>\n";
		
		return true;
	}
	
	
	public function getCharacterLink($charId)
	{
		$link  = $this->baseUrl . "?";
		$link .= "id=$charId&";
		
		return $link;
	}
	
		
	public function createBuildOutput($buildData)
	{
		$buildName = $this->getSafeFieldStr($buildData, 'buildName');
		$charName = $this->getSafeFieldStr($buildData, 'name');
		$buildType = $this->getSafeFieldStr($buildData, 'buildType');
		$className = $this->getSafeFieldStr($buildData, 'class');
		$raceName = $this->getSafeFieldStr($buildData, 'race');
		$level = $this->formatCharacterLevel($this->getSafeFieldInt($buildData, 'level'));
		$cp = $this->getSafeFieldInt($buildData, 'championPoints');
		$charId = $this->getSafeFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		
		if ($buildType == "other") $buildType = "";
		
		if ($buildName == "")
		{
			$buildName = $charName;
			$charName = "";
		}
		
		$this->outputHtml .= "<li><A href=\"$linkUrl\">$buildName -- $buildType $className ($raceName, $level, $cp CP) $charName</a></li>\n";
		
		return true;
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
		else
			$this->createBuildListOutput();
	
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


