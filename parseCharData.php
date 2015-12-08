<?php


require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataParser
{
	const ECD_OUTPUTLOG_FILENAME = "/home/uesp/esochardata/chardata.log";
	const ECD_OUTPUT_CHARDATA_PATH = "/home/uesp/esochardata/";
	const ECD_MINIMUM_CHARDATA_SIZE = 24;
	
	public $inputParams = array();
	public $rawCharData = array();
	public $Lua = null;
	public $fileLuaResult = false;
	public $parsedCharData = array();
	public $parsedCommonData = array();
	
	public $currentCharacterStats = array();
	
	public $db = null;
	private $dbReadInitialized  = false;
	private $dbWriteInitialized = false;
	public $lastQuery = "";
	public $skipCreateTables = false;
	
	
	public function __construct ()
	{
		$this->log("Started parsing " . $_SERVER['CONTENT_LENGTH'] . " bytes of character data from " . $_SERVER["REMOTE_ADDR"] . " at " . date("Y-m-d H:i:s"));
		
		$this->Lua = new Lua();
		$this->initDatabaseWrite();
	}
	
	
	public function log ($msg)
	{
		print($msg . "\n");
		$result = file_put_contents($this->logFilePath . self::ECD_OUTPUTLOG_FILENAME, $msg . "\n", FILE_APPEND | LOCK_EX);
		return TRUE;
	}
	
	
	public function reportError ($errorMsg)
	{
		$this->log("Error: " . $errorMsg);
		
		if ($this->db != null && $this->db->error)
		{
			$this->log("\tDB Error:" . $this->db->error);
			$this->log("\tLast Query:" . $this->lastQuery);
		}
	
		return false;
	}
	
	
	private function initDatabase ()
	{
		global $uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = false;
	
		return true;
	}
	
	
	private function initDatabaseWrite ()
	{
		global $uespEsoCharDataWriteDBHost, $uespEsoCharDataWriteUser, $uespEsoCharDataWritePW, $uespEsoCharDataDatabase;
	
		if ($this->dbWriteInitialized) return true;
	
		if ($this->dbReadInitialized)
		{
			$this->db->close();
			unset($this->db);
			$this->db = null;
			$this->dbReadInitialized = false;
		}
	
		$this->db = new mysqli($uespEsoCharDataWriteDBHost, $uespEsoCharDataWriteUser, $uespEsoCharDataWritePW, $uespEsoCharDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = true;
	
		if ($this->skipCreateTables) return true;
		return $this->createTables();
	}
	
	
	public function createTables()
	{
		$result = $this->initDatabaseWrite();
		if (!$result) return false;
		
		$query = "CREATE TABLE IF NOT EXISTS characters (
						id INTEGER NOT NULL AUTO_INCREMENT,
						name TINYTEXT NOT NULL,
						buildName TINYTEXT NOT NULL,
						accountName TINYTEXT NOT NULL,
						wikiUserName TINYTEXT NOT NULL,
						class TINYTEXT NOT NULL,
						race TINYTEXT NOT NULL,
						buildType TINYTEXT NOT NULL,
						level INTEGER NOT NULL,
						championPoints INTEGER NOT NULL,
						createTime BIGINT NOT NULL,
						uploadTimestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
						PRIMARY KEY (id),
						INDEX index_name(name(32)),
						INDEX index_class(class(10)),
						INDEX index_race(race(10)),
						INDEX index_buildType(buildType(10)),
						INDEX index_wikiUserName(wikiUserName(32)),
						INDEX index_accountName(accountName(32)),
						INDEX index_createTime(createTime)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create characters table!");
		
		$query = "CREATE TABLE IF NOT EXISTS stats (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						value TINYTEXT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create stats table!");
		
		$query = "CREATE TABLE IF NOT EXISTS equipSlots (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						`condition` INTEGER NOT NULL,
						itemLink TINYTEXT NOT NULL,
						icon TINYTEXT NOT NULL,
						`index` INTEGER NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create equipSlots table!");
		
		$query = "CREATE TABLE IF NOT EXISTS skills (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						type TINYTEXT NOT NULL,
						description TEXT NOT NULL,
						icon TINYTEXT NOT NULL,
						abilityId INTEGER NOT NULL,
						`index` INTEGER NOT NULL,
						`rank` INTEGER NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create skills table!");
		
		$query = "CREATE TABLE IF NOT EXISTS championPoints (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						points INTEGER NOT NULL,
						description TEXT NOT NULL,
						abilityId INTEGER NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create championPoints table!");
		
		$query = "CREATE TABLE IF NOT EXISTS buffs (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						icon TINYTEXT NOT NULL,
						abilityId INTEGER NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create buffs table!");
		
		$query = "CREATE TABLE IF NOT EXISTS actionBars (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						icon TINYTEXT NOT NULL,
						`index` INTEGER NOT NULL,
						abilityId INTEGER NOT NULL,
						description TEXT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create actionBars table!");
		
		$query = "CREATE TABLE IF NOT EXISTS screenshots (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
						filename TEXT NOT NULL,
						origFilename TEXT NOT NULL,
						caption TEXT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId)
					);";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create screenshots table!");
		
		$this->lastQuery = "";
		return true;
	}
	
	
	public function createCharDataLogFilename()
	{
		$index = 0;
		
		do 
		{
			if ($index > 1000) 
			{
				$this->reportError("Failed to create a new character data filename for backup!");
				return "";
			}
			
			$date = new DateTime();
			$dateStr = $date->format('Y-m-d-His');
			$filename = self::ECD_OUTPUT_CHARDATA_PATH;
			
			if ($index > 0)
				$filename .= "charData-" . $dateStr . "-" . $index . ".txt";
			else
				$filename .= "charData-" . $dateStr . ".txt";
			
			$index += 1;
		} while (file_exists($filename));
		
		return $filename;
	}

	
	public function saveCharData()
	{
		$filename = $this->createCharDataLogFilename();
		if ($filename == "") return false;
		
		if (file_put_contents($filename, $this->rawCharData) === False)
		{
			return $this->reportError("Failed to write character data to file '$filename'!");
		}
		
		return true;
	}
	
	
	public function parseRawCharData($rawCharData)
	{
		$charData = base64_decode(str_replace(' ', '+', $rawCharData));
		
		$charData .= "\n";
		$charData .= "uespCharData.IPAddress = '" . $_SERVER["REMOTE_ADDR"] . "'\n";
		$charData .= "uespCharData.UploadTimestamp = " . time() . "\n";
		
		return $charData;
	}
	
	
	public function parseCharData()
	{
		$this->fileLuaResult = $this->Lua->eval($this->rawCharData);
		return $this->parseCharDataRoot($this->Lua->uespCharData);
	}
	
	
	public function parseCharDataRoot($uespCharData)
	{
		if ($uespCharData == null) return $this->reportError("Null character data object received!");
		
		foreach ($uespCharData as $key => $value) 
		{
			if (is_numeric($key))
			{
				$this->parseSingleCharacter(intval($key), $value);
			}
			else 
			{
				$this->parseCommonData($key, $value);
			}
		}
		
		$this->mergeCommonData();
	
		return true;
	}
	
	
	public function mergeCommonData ()
	{
		foreach ($this->parsedCharData as $key => &$charData)
		{
			foreach ($this->parsedCommonData as $comKey => $comValue)
			{
				$charData[$comKey] = $comValue;
			}
		}
		
		return true;
	}
	
	
	public function parseSingleCharacter ($index, $charData)
	{
		$this->log("Parsing character with key $index...");
		$this->parsedCharData[$index] = $charData;
		return true;
	}
	
	
	public function saveAllNewCharacters()
	{
		foreach ($this->parsedCharData as $key => &$charData)
		{
			$this->saveNewCharacter($charData);
		}
		
		return true;
	}
	
	public function loadCharacterByCreateTime($charName, $createTime)
	{
		$safeCharName   = $this->db->real_escape_string($charName);
		$safeCreateTime = $this->db->real_escape_string($createTime);
		
		$query = "SELECT * from characters WHERE name=\"$safeCharName\" AND createTime=$safeCreateTime;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE)
		{
			$this->reportError("Failed to load character v{$charName}\" with creation time '{$createTime}'!");
			return null;
		}
		
		$result->data_seek(0);
		return $result->fetch_assoc();
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
	
	
	public function createNewCharacter(&$charData)
	{
		$name = $this->getSafeFieldStr($charData, 'CharName');
		$buildName = $this->getSafeFieldStr($charData, 'Note');
		$accountName = $this->getSafeFieldStr($charData, 'AccountName');
		$wikiUserName = $this->getSafeFieldStr($charData, 'WikiUser');
		$class = $this->getSafeFieldStr($charData, 'Class');
		$race = $this->getSafeFieldStr($charData, 'Race');
		$buildType = $this->getSafeFieldStr($charData, 'BuildType');
		$level = $this->getSafeFieldInt($charData, 'EffectiveLevel');
		$createTime = $this->getSafeFieldInt($charData, 'TimeStamp');
		
		$championPoints = 0;
		
		if (array_key_exists('ChampionPoints', $charData) && array_key_exists('Total:Spent', $charData['ChampionPoints']))
		{
			$championPoints = $charData['ChampionPoints']['Total:Spent'];
		}
		
		$query  = "INSERT INTO characters(name, buildName, accountName, wikiUserName, class, race, buildType, level, createTime, championPoints) ";
		$query .= "VALUES(\"$name\", \"$buildName\", \"$accountName\", \"$wikiUserName\", \"$class\", \"$race\", \"$buildType\", $level, $createTime, $championPoints);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE) 
		{
			$this->reportError("Failed to create new character record!");
			return -1;
		}
		
		$charData['id'] = $this->db->insert_id;
		$this->log("Created new character '$name' with ID {$charData['id']}.");
		return $this->db->insert_id;
	}
	
	
	public function isNewCharacter(&$charData)
	{
		if (!array_key_exists('CharName',  $charData)) return $this->reportError("Invalid character data received! Missing CharName field.");
		if (!array_key_exists('TimeStamp', $charData)) return $this->reportError("Invalid character data received! Missing TimeStamp field.");
		
		$charName = $charData['CharName'];
		$createTime = $charData['TimeStamp'];
		
		$loadChar = $this->loadCharacterByCreateTime($charName, $createTime);
		if ($loadChar == null) return true;
		
		$this->log("Character '$charName' created at '$createTime' already exists!");
		return false;
	}
	
	
	public function saveNewCharacter(&$charData)
	{
		if (!$this->isNewCharacter($charData)) return true;
		
		$charId = $this->createNewCharacter($charData);
		if ($charId < 0) return false;
		
		$this->currentCharacterStats = array();
		$result = True;
		
		foreach ($charData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterArrayData($charData, $key, $value);
			else
				$result &= $this->saveCharacterStatData($charData, $key, $value);
		}
		
		return $result;
	}
	
	
	public function saveCharacterStatData(&$charData, $name, $data)
	{
			// Ensure stat name fields are unique for this character
		if (array_key_exists($name, $this->currentCharacterStats)) return true;
		
		$charId = $charData['id'];
		$safeName = $this->db->real_escape_string($name);
		$safeData = $this->db->real_escape_string($data);
		
		$query  = "INSERT INTO stats(characterId, name, value) ";
		$query .= "VALUES($charId, \"$safeName\", \"$safeData\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE) return $this->reportError("Failed to save character stat data '$name'!");
		
		$this->currentCharacterStats[$name] = $data;
		return true;
	}
	
	
	public function saveCharacterArrayData(&$charData, $name, &$arrayData)
	{
		switch ($name)
		{
			case "ChampionPoints":
				return $this->saveCharacterChampionPoints($charData, $name, $arrayData);
			case "Stats":
			case "Power":
				return $this->saveCharacterArrayStats($charData, $name, $arrayData);
			case "Buffs":
				return $this->saveCharacterBuffs($charData, $name, $arrayData);
			case "Skills":
				return $this->saveCharacterSkills($charData, $name, $arrayData);
			case "ActionBar":
				return $this->saveCharacterActionBars($charData, $name, $arrayData);
			case "EquipSlots":
				return $this->saveCharacterEquipSlots($charData, $name, $arrayData);
			default:
				return $this->reportError("Unknown array '$name' found in character data!");
		}
		
		return true;
	}
	
	public function saveCharacterEquipSlots($charData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterEquipSlot($charData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterEquipSlot($charData, $index, $arrayData)
	{
		$charId = $charData['id'];
		$name = $this->getSafeFieldStr($arrayData, 'name');
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$itemLink = $this->getSafeFieldStr($arrayData, 'link');
		$condition = $this->getSafeFieldInt($arrayData, 'condition');
	
		$query  = "INSERT INTO equipSlots(characterId, name, itemLink, icon, `condition`, `index`) ";
		$query .= "VALUES($charId, \"$name\", \"$itemLink\", \"$icon\", $condition, $index);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character equip slot data!");
		return true;
	}
	
	
	public function saveCharacterActionBars($charData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterActionBar($charData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterActionBar($charData, $index, $arrayData)
	{
		$charId = $charData['id'];
		$name = $this->getSafeFieldStr($arrayData, 'name');
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
		$index = $this->db->real_escape_string($index);
	
		$query  = "INSERT INTO actionBars(characterId, name, description, icon, abilityId, `index`) ";
		$query .= "VALUES($charId, \"$name\", \"$description\", \"$icon\", $abilityId, $index);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character action bar data!");
		return true;
	}

	
	public function saveCharacterSkills($charData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterSkill($charData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterSkill($charData, $name, $arrayData)
	{
		$charId = $charData['id'];
		$safeName = $this->db->real_escape_string($name);
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$type = $this->getSafeFieldStr($arrayData, 'type');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
		$index = $this->getSafeFieldInt($arrayData, 'index');
		$rank = $this->getSafeFieldInt($arrayData, 'rank');
	
		$query  = "INSERT INTO skills(characterId, name, type, description, icon, abilityId, `index`, `rank`) ";
		$query .= "VALUES($charId, \"$name\", \"$type\", \"$description\", \"$icon\", $abilityId, $index, $rank);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character skill data!");
		return true;
	}
	
	
	public function saveCharacterBuffs($charData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterBuff($charData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterBuff($charData, $index, $arrayData)
	{
		$charId = $charData['id'];
		$name = $this->getSafeFieldStr($arrayData, 'name');
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
	
		$query  = "INSERT INTO buffs(characterId, name, icon, abilityId) ";
		$query .= "VALUES($charId, \"$name\", \"$icon\", $abilityId);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character buff data!");
		return true;
	}
	
	
	public function saveCharacterChampionPoints($charData, $name, $arrayData)
	{
		$result = True;
		
		foreach ($arrayData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterChampionPoint($charData, $key, $value);
			else
			{
				$newKey = "ChampionPoints:" . $key;
				$result &= $this->saveCharacterStatData($charData, $newKey, $value);
			}
		}
		
		return $result;
	}
	
	
	public function saveCharacterChampionPoint($charData, $name, $arrayData)
	{
		$charId = $charData['id'];
		$safeName = $this->db->real_escape_string($name);
		$points = $this->getSafeFieldInt($arrayData, 'points');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
		
		$query  = "INSERT INTO championPoints(characterId, name, points, description, abilityId) ";
		$query .= "VALUES($charId, \"$safeName\", $points, \"$description\", $abilityId);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE) return $this->reportError("Failed to save character champion point data!");
		return true;
	}
	
	
	public function saveCharacterArrayStats($charData, $name, $arrayData)
	{
		$result = True;
		
		foreach ($arrayData as $key => $value)
		{
			$result &= $this->saveCharacterStatData($charData, $key, $value);
		}
		
		return $result;
	}
	
	
	public function parseCommonData ($name, $value)
	{
		$this->parsedCommonData[$name] = $value;
		return true;
	}
	

	public function parseFormInput()
	{
		$this->writeHeaders();
	
		$this->inputParams = $_REQUEST;
	
		if (!array_key_exists('chardata', $this->inputParams)) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return $this->reportError("Failed to find any character data form input to parse!");
		}
		
		$this->rawCharData = $this->parseRawCharData($this->inputParams['chardata']); 
		print("Found character data " . strlen($this->rawCharData) . " bytes in size.");
		
		if (strlen($this->rawCharData) < self::ECD_MINIMUM_CHARDATA_SIZE)
		{
			print("Ignoring empty char data.");
			return true;
		}
		
		if (!$this->saveCharData()) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return false;
		}
	
		if (!$this->parseCharData())
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return false;
		}
		
		return true;
	}
	
	
	public function doParse()
	{
		if (!$this->parseFormInput()) return false;
		if (!$this->saveAllNewCharacters()) return false;
		
		return true;
	}
	
	
	public function writeHeaders ()
	{
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Pragma: no-cache");
		header("content-type: text/html");
	}
	
	
};


$tmp = new EsoCharDataParser();
$tmp->doParse();


