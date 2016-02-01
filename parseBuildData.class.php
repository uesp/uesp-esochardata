<?php


require_once("/home/uesp/secrets/esochardata.secrets");


class EsoBuildDataParser
{
	const ECD_OUTPUTLOG_FILENAME = "/home/uesp/esobuilddata/builddata.log";
	const ECD_OUTPUT_BUILDDATA_PATH = "/home/uesp/esobuilddata/";
	const ECD_MINIMUM_BUILDDATA_SIZE = 24;
	
	public $inputParams = array();
	public $rawBuildData = array();
	public $Lua = null;
	public $fileLuaResult = false;
	public $parsedBuildData = array();
	public $parsedCommonData = array();
	
	public $currentCharacterStats = array();
	
	public $newCharacterCount = 0;
	public $characterCount = 0;
	
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
		//print($msg . "\n");
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
						special TINYTEXT NOT NULL,
						level INTEGER NOT NULL,
						championPoints INTEGER NOT NULL,
						createTime BIGINT NOT NULL,
						uploadTimestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
						PRIMARY KEY (id),
						INDEX index_name(name(32)),
						INDEX index_class(class(10)),
						INDEX index_race(race(10)),
						INDEX index_special(special(10)),
						INDEX index_buildName(buildName(32)),
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
						setCount INTEGER NOT NULL,
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
						area TINYTEXT NOT NULL,
						cost TINYTEXT NOT NULL,
						`range` TINYTEXT NOT NULL,
						radius INTEGER NOT NULL,
						castTime INTEGER NOT NULL,
						channelTime INTEGER NOT NULL,
						duration INTEGER NOT NULL,
						target TINYTEXT NOT NULL,
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
						area TINYTEXT NOT NULL,
						cost TINYTEXT NOT NULL,
						`range` TINYTEXT NOT NULL,
						radius INTEGER NOT NULL,
						castTime INTEGER NOT NULL,
						channelTime INTEGER NOT NULL,
						duration INTEGER NOT NULL,
						target TINYTEXT NOT NULL,
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
	
	
	public function createBuildDataLogFilename()
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
			$filename = self::ECD_OUTPUT_BUILDDATA_PATH;
			
			if ($index > 0)
				$filename .= "buildData-" . $dateStr . "-" . $index . ".txt";
			else
				$filename .= "buildData-" . $dateStr . ".txt";
			
			$index += 1;
		} while (file_exists($filename));
		
		return $filename;
	}

	
	public function saveBuildData()
	{
		$filename = $this->createBuildDataLogFilename();
		if ($filename == "") return false;
		
		if (file_put_contents($filename, $this->rawBuildData) === False)
		{
			return $this->reportError("Failed to write character data to file '$filename'!");
		}
		
		return true;
	}
	
	
	public function savePhpBuildData()
	{
		$filename = $this->createBuildDataLogFilename();
		if ($filename == "") return false;
		$outputData = var_export($this->parsedBuildData, TRUE);
	
		if (file_put_contents($filename, $outputData) === False)
		{
			return $this->reportError("Failed to write character data to file '$filename'!");
		}
	
		return true;
	}
	
	
	public function parseRawBuildData($rawBuildData)
	{
		$buildData = base64_decode(str_replace(' ', '+', $rawBuildData));
		
		$buildData .= "\n";
		$buildData .= "uespBuildData.IPAddress = '" . $_SERVER["REMOTE_ADDR"] . "'\n";
		$buildData .= "uespBuildData.UploadTimestamp = " . time() . "\n";
		
		return $buildData;
	}
	
	
	public function parseBuildData()
	{
		$this->fileLuaResult = $this->Lua->eval($this->rawBuildData);
		return $this->parseBuildDataRoot($this->Lua->uespBuildData);
	}
	
	
	public function parseBuildDataRoot($uespBuildData)
	{
		if ($uespBuildData == null) return $this->reportError("Null character data object received!");
		
		foreach ($uespBuildData as $key => $value) 
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
		foreach ($this->parsedBuildData as $key => &$buildData)
		{
			foreach ($this->parsedCommonData as $comKey => $comValue)
			{
				$buildData[$comKey] = $comValue;
			}
		}
		
		return true;
	}
	
	
	public function parseSingleCharacter ($index, $buildData)
	{
		$this->log("Parsing character with key $index...");
		$this->parsedBuildData[$index] = $buildData;
		return true;
	}
	
	
	public function saveAllNewCharacters()
	{
		$result = TRUE;
		
		foreach ($this->parsedBuildData as $key => &$buildData)
		{
			$this->characterCount += 1;
			$result &= $this->saveNewCharacter($buildData);
		}
		
		return $result;
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
	
	
	public function createNewCharacter(&$buildData)
	{
		$name = $this->getSafeFieldStr($buildData, 'CharName');
		$buildName = $this->getSafeFieldStr($buildData, 'Note');
		$accountName = $this->getSafeFieldStr($buildData, 'AccountName');
		$wikiUserName = $this->getSafeFieldStr($buildData, 'WikiUser');
		$class = $this->getSafeFieldStr($buildData, 'Class');
		$race = $this->getSafeFieldStr($buildData, 'Race');
		$buildType = $this->getSafeFieldStr($buildData, 'BuildType');
		$level = $this->getSafeFieldInt($buildData, 'EffectiveLevel');
		$createTime = $this->getSafeFieldInt($buildData, 'TimeStamp');
		$special = '';
		$championPoints = 0;
		
		if (array_key_exists('ChampionPoints', $buildData) && array_key_exists('Total:Spent', $buildData['ChampionPoints']))
		{
			$championPoints = $buildData['ChampionPoints']['Total:Spent'];
		}
		
		if ($buildData['Vampire'] == 1) $special = "Vampire";
		if ($buildData['Werewolf'] == 1) $special = "Werewolf";
				
		$query  = "INSERT INTO characters(name, buildName, accountName, wikiUserName, class, race, buildType, level, createTime, championPoints, special) ";
		$query .= "VALUES(\"$name\", \"$buildName\", \"$accountName\", \"$wikiUserName\", \"$class\", \"$race\", \"$buildType\", $level, $createTime, $championPoints, \"$special\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE) 
		{
			$this->reportError("Failed to create new character record!");
			return -1;
		}
		
		$buildData['id'] = $this->db->insert_id;
		$this->log("Created new character '$name' with ID {$buildData['id']}.");
		return $this->db->insert_id;
	}
	
	
	public function isNewCharacter(&$buildData)
	{
		if (!array_key_exists('CharName',  $buildData)) return $this->reportError("Invalid character data received! Missing CharName field.");
		if (!array_key_exists('TimeStamp', $buildData)) return $this->reportError("Invalid character data received! Missing TimeStamp field.");
		
		$charName = $buildData['CharName'];
		$createTime = $buildData['TimeStamp'];
		
		$loadChar = $this->loadCharacterByCreateTime($charName, $createTime);
		if ($loadChar == null) return true;
		
		$this->log("Character '$charName' created at '$createTime' already exists!");
		return false;
	}
	
	
	public function saveNewCharacter(&$buildData)
	{
		if (!$this->isNewCharacter($buildData)) return true;
		
		$charId = $this->createNewCharacter($buildData);
		if ($charId < 0) return false;
		
		$this->currentCharacterStats = array();
		$result = True;
		
		foreach ($buildData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterArrayData($buildData, $key, $value);
			else
				$result &= $this->saveCharacterStatData($buildData, $key, $value);
		}
		
		$this->newCharacterCount += 1;
		return $result;
	}
	
	
	public function saveCharacterStatData(&$buildData, $name, $data)
	{
			// Ensure stat name fields are unique for this character
		if (array_key_exists($name, $this->currentCharacterStats)) return true;
		
		$charId = $buildData['id'];
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
		
	
	public function saveCharacterArrayData(&$buildData, $name, &$arrayData)
	{
		switch ($name)
		{
			case "ChampionPoints":
				return $this->saveCharacterChampionPoints($buildData, $name, $arrayData);
			case "Crafting":
				return $this->saveCharacterCrafting($buildData, $name, $arrayData);
			case "Stats":
			case "Power":
				return $this->saveCharacterArrayStats($buildData, $name, $arrayData);
			case "Buffs":
				return $this->saveCharacterBuffs($buildData, $name, $arrayData);
			case "Skills":
				return $this->saveCharacterSkills($buildData, $name, $arrayData);
			case "ActionBar":
				return $this->saveCharacterActionBars($buildData, $name, $arrayData);
			case "EquipSlots":
				return $this->saveCharacterEquipSlots($buildData, $name, $arrayData);
			default:
				return $this->reportError("Unknown array '$name' found in character data!");
		}
		
		return true;
	}
	
	public function saveCharacterEquipSlots($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterEquipSlot($buildData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterEquipSlot($buildData, $index, $arrayData)
	{
		$charId = $buildData['id'];
		$name = $this->getSafeFieldStr($arrayData, 'name');
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$itemLink = $this->getSafeFieldStr($arrayData, 'link');
		$condition = $this->getSafeFieldInt($arrayData, 'condition');
		$setCount = $this->getSafeFieldInt($arrayData, 'setcount');
	
		$query  = "INSERT INTO equipSlots(characterId, name, itemLink, icon, `condition`, `index`, setCount) ";
		$query .= "VALUES($charId, \"$name\", \"$itemLink\", \"$icon\", $condition, $index, $setCount);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character equip slot data!");
		return true;
	}
	
	
	public function saveCharacterActionBars($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterActionBar($buildData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterActionBar($buildData, $index, $arrayData)
	{
		$charId = $buildData['id'];
		$name = $this->getSafeFieldStr($arrayData, 'name');
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
		$area = $this->getSafeFieldStr($arrayData, 'area');
		$cost = $this->getSafeFieldStr($arrayData, 'cost');
		$range = $this->getSafeFieldStr($arrayData, 'range');
		$radius = $this->getSafeFieldInt($arrayData, 'radius');
		$castTime = $this->getSafeFieldInt($arrayData, 'castTime');
		$channelTime = $this->getSafeFieldInt($arrayData, 'channelTime');
		$duration = $this->getSafeFieldInt($arrayData, 'duration');
		$target = $this->getSafeFieldStr($arrayData, 'target');
		$index = $this->db->real_escape_string($index);
	
		$query  = "INSERT INTO actionBars(characterId, name, description, icon, abilityId, `index`, area, cost, `range`, radius, castTime, channelTime, duration, target) ";
		$query .= "VALUES($charId, \"$name\", \"$description\", \"$icon\", $abilityId, $index, \"$area\", \"$cost\", \"$range\", $radius, $castTime, $channelTime, $duration, \"$target\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character action bar data!");
		return true;
	}

	
	public function saveCharacterSkills($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterSkill($buildData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterSkill($buildData, $name, $arrayData)
	{
		$charId = $buildData['id'];
		$safeName = $this->db->real_escape_string($name);
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$type = $this->getSafeFieldStr($arrayData, 'type');
		$description = $this->getSafeFieldStr($arrayData, 'desc');
		$abilityId = $this->getSafeFieldInt($arrayData, 'id');
		$index = $this->getSafeFieldInt($arrayData, 'index');
		$rank = $this->getSafeFieldInt($arrayData, 'rank');
		$area = $this->getSafeFieldStr($arrayData, 'area');
		$cost = $this->getSafeFieldStr($arrayData, 'cost');
		$range = $this->getSafeFieldStr($arrayData, 'range');
		$radius = $this->getSafeFieldInt($arrayData, 'radius');
		$castTime = $this->getSafeFieldInt($arrayData, 'castTime');
		$channelTime = $this->getSafeFieldInt($arrayData, 'channelTime');
		$duration = $this->getSafeFieldInt($arrayData, 'duration');
		$target = $this->getSafeFieldStr($arrayData, 'target');
	
		$query  = "INSERT INTO skills(characterId, name, type, description, icon, abilityId, `index`, `rank`, area, cost, `range`, radius, castTime, channelTime, duration, target) ";
		$query .= "VALUES($charId, \"$name\", \"$type\", \"$description\", \"$icon\", $abilityId, $index, $rank, \"$area\", \"$cost\", \"$range\", $radius, $castTime, $channelTime, $duration, \"$target\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE) return $this->reportError("Failed to save character skill data!");
		return true;
	}
	
	
	public function saveCharacterBuffs($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterBuff($buildData, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterBuff($buildData, $index, $arrayData)
	{
		$charId = $buildData['id'];
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
	
	
	public function saveCharacterChampionPoints($buildData, $name, $arrayData)
	{
		$result = True;
		
		foreach ($arrayData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterChampionPoint($buildData, $key, $value);
			else
			{
				$newKey = "ChampionPoints:" . $key;
				$result &= $this->saveCharacterStatData($buildData, $newKey, $value);
			}
		}
		
		return $result;
	}
	
	
	public function saveCharacterChampionPoint($buildData, $name, $arrayData)
	{
		$charId = $buildData['id'];
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
	
	
	public function saveCharacterArrayStats($buildData, $name, $arrayData)
	{
		$result = True;
		
		foreach ($arrayData as $key => $value)
		{
			$result &= $this->saveCharacterStatData($buildData, $key, $value);
		}
		
		return $result;
	}
	
	
	public function saveCharacterCrafting($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $styleName => $value)
		{
			$key = "Crafting:" . $styleName;
			
			if (is_array($value))
			{
				$newValue = implode(',', $value);
				$result &= $this->saveCharacterStatData($buildData, $key, $newValue);
			}
			else
			{
				$result &= $this->saveCharacterStatData($buildData, $key, $value);
			}
		
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
		$this->inputParams = $_REQUEST;
	
		if (!array_key_exists('chardata', $this->inputParams)) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return $this->reportError("Failed to find any character data form input to parse!");
		}
		
		$this->rawBuildData = $this->parseRawBuildData($this->inputParams['chardata']); 
		print("Found character data " . strlen($this->rawBuildData) . " bytes in size.");
		
		if (strlen($this->rawBuildData) < self::ECD_MINIMUM_BUILDDATA_SIZE)
		{
			print("Ignoring empty char data.");
			return true;
		}
		
		if (!$this->saveBuildData()) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return false;
		}
	
		if (!$this->parseBuildData())
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return false;
		}
		
		return true;
	}
	
	
	public function doFormParse()
	{
		$this->writeHeaders();
		
		if (!$this->parseFormInput()) return false;
		if (!$this->saveAllNewCharacters()) return false;
		
		return true;
	}
	
	
	public function doParse($buildData)
	{
	
		if (!$this->parseBuildDataRoot($buildData)) return false;
		if (!$this->savePhpBuildData()) return false;
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



