<?php


require_once("/home/uesp/secrets/esobuilddata.secrets");
require_once("/home/uesp/secrets/esolog.secrets");


class EsoBuildDataParser
{
	public $ECD_OUTPUTLOG_FILENAME = "/home/uesp/esobuilddata/builddata.log";
	public $ECD_OUTPUT_BUILDDATA_PATH = "/home/uesp/esobuilddata/";
	public $ECD_OUTPUT_BUILDDATA_PREFIX = "builddata-";
	public $ECD_MINIMUM_BUILDDATA_SIZE = 24;
	
	public $hasCharacterInventory = false;
	public $hasCharacterBank      = false;
	public $hasCharacterCraftBag  = false;
	
	public $inputParams = array();
	public $rawBuildData = array();
	public $Lua = null;
	public $fileLuaResult = false;
	public $parsedBuildData = array();
	public $parsedCommonData = array();
		
	public $currentCharacterStats = array();
	
	public $newCharacterCount = 0;
	public $characterCount = 0;
	public $characterId = -1;
	public $uniqueAccountName = "";
	
	public $db = null;
	public $dbLog = null;
	public $dbReadInitialized  = false;
	public $dbWriteInitialized = false;
	public $lastQuery = "";
	public $skipCreateTables = false;
	public $formResponseErrorMsg = "";
	
	public $itemDataDB = array();
	
	public $accountCharacters = array();
	public $accountData = array();
	
	public $startTime;
	public $endTime;
	
	
	public function __construct ()
	{
		$this->Lua = new Lua();
		$this->startTime = microtime(True);
		$this->initLogDatabase();
	}
	
	
	public function log ($msg)
	{
		//print($msg . "\n");
		$result = file_put_contents($this->ECD_OUTPUTLOG_FILENAME, $msg . "\n", FILE_APPEND | LOCK_EX);
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
		else if ($this->dbLog != null && $this->dbLog->error)
		{
			$this->log("\tDBLog Error:" . $this->dbLog->error);
			$this->log("\tLast Query:" . $this->lastQuery);
		}
	
		return false;
	}
	
	
	private function initLogDatabase ()
	{
		global $uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase;
	
		$this->dbLog = new mysqli($uespEsoLogReadDBHost, $uespEsoLogReadUser, $uespEsoLogReadPW, $uespEsoLogDatabase);
		if ($db->connect_error) return $this->ReportError("Could not connect to mysql database!");
		
		return true;
	}
	
	
	
	public function initDatabase ()
	{
		global $uespEsoBuildDataReadDBHost, $uespEsoBuildDataReadUser, $uespEsoBuildDataReadPW, $uespEsoBuildDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoBuildDataReadDBHost, $uespEsoBuildDataReadUser, $uespEsoBuildDataReadPW, $uespEsoBuildDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = false;
	
		return true;
	}
	
	
	public function initDatabaseWrite ()
	{
		global $uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase;
	
		if ($this->dbWriteInitialized) return true;
	
		if ($this->dbReadInitialized)
		{
			$this->db->close();
			unset($this->db);
			$this->db = null;
			$this->dbReadInitialized = false;
		}
	
		$this->db = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
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
						uniqueAccountName TINYTEXT NOT NULL,
						wikiUserName TINYTEXT NOT NULL,
						class TINYTEXT NOT NULL,
						race TINYTEXT NOT NULL,
						alliance TINYTEXT NOT NULL,
						buildType TINYTEXT NOT NULL,
						special TINYTEXT NOT NULL,
						level INTEGER NOT NULL,
						championPoints INTEGER NOT NULL,
						createTime BIGINT NOT NULL,
						editTimestamp TIMESTAMP NOT NULL,
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
						INDEX index_uniqueAccountName(uniqueAccountName(48)),
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
						account TINYTEXT NOT NULL,
						name TINYTEXT NOT NULL,
						`condition` INTEGER NOT NULL,
						itemLink TINYTEXT NOT NULL,
						icon TINYTEXT NOT NULL,
						`index` INTEGER NOT NULL,
						setCount INTEGER NOT NULL,
						value INTEGER NOT NULL,
						level TINYINT NOT NULL,
						quality TINYINT NOT NULL,
						type TINYINT NOT NULL,
						equipType TINYINT NOT NULL,
						weaponType TINYINT NOT NULL,
						armorType TINYINT NOT NULL,
						craftType TINYINT NOT NULL,
						stolen TINYINT NOT NULL,
						style TINYINT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_characterId(characterId),
						INDEX index_account(account(48))
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
						description TEXT NOT NULL,
						enabled TINYINT NOT NULL,
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
	
	
	public function saveAccount()
	{
		return true;
	}
	
	
	public function updateAccountData($newCharData)
	{
		return true;
	}
	
	
	public function updateAccountPassword($newPassword)
	{
		return true;
	}
	
	
	public function loadAccount($account)
	{
		return true;
	}
	
	
	public function createNewAccount($rawCharData)
	{
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
			$filename = $this->ECD_OUTPUT_BUILDDATA_PATH;
			
			if ($index > 0)
				$filename .= $this->ECD_OUTPUT_BUILDDATA_PREFIX . $dateStr . "-" . $index . ".txt";
			else
				$filename .= $this->ECD_OUTPUT_BUILDDATA_PREFIX . $dateStr . ".txt";
			
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
			$this->formResponseErrorMsg = "Failed writing character data to file!";
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
			$this->formResponseErrorMsg = "Failed writing character data to file!";
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
		if ($uespBuildData == null)
		{
			$this->formResponseErrorMsg = "Error parsing Lua data object!";
			return $this->reportError("Null character data object received!");
		}
		
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
		if ($buildData["IsBank"] != 0)
		{
			$this->log("Parsing bank data with key $index...");
		}
		else if ($buildData["IsCraftBag"] != 0)
		{
			$this->log("Parsing craft bag data with key $index...");
		}
		else
		{
			$this->log("Parsing character with key $index...");
		}
		
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
			$this->reportError("Failed to load character \"{$charName}\" with creation time '{$createTime}'!");
			return null;
		}
		
		if ($result->num_rows == 0) return null;
		
		$result->data_seek(0);
		$data = $result->fetch_assoc();
		$data['UniqueAccountName'] = $data['uniqueAccountName'];
		$this->uniqueAccountName = $data['UniqueAccountName'];
		$this->characterId = $data['id'];
		return $data;
	}
	
	
	public function loadCharacterByAccountName($charName, $accountName)
	{
		$safeCharName = $this->db->real_escape_string($charName);
		$safeAccount  = $this->db->real_escape_string($accountName);
	
		$query = "SELECT * from characters WHERE name=\"$safeCharName\" AND uniqueAccountName=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE)
		{
			$this->reportError("Failed to load character \"{$charName}\" from account '{$accountName}'!");
			return null;
		}
		
		if ($result->num_rows == 0) return null;
	
		$result->data_seek(0);
		$data = $result->fetch_assoc();
		$data['UniqueAccountName'] = $data['uniqueAccountName'];
		$this->uniqueAccountName = $data['UniqueAccountName'];
		$this->characterId = $data['id'];
		return $data;
	}
	
	
	public function getSafeFieldStr(&$arrayData, $field)
	{
		if ($arrayData == null) return "";
		if (!array_key_exists($field, $arrayData)) return '';
		
		if ($field == "name")
		{
			$name = $arrayData[$field];
			$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
			return $this->db->real_escape_string($name);
		}
		else
		{
			return $this->db->real_escape_string($arrayData[$field]);
		}
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
		$uniqueAccountName = $this->getSafeFieldStr($buildData, 'UniqueAccountName');
		$wikiUserName = $this->getSafeFieldStr($buildData, 'WikiUser');
		$class = $this->getSafeFieldStr($buildData, 'Class');
		$race = $this->getSafeFieldStr($buildData, 'Race');
		$buildType = $this->getSafeFieldStr($buildData, 'BuildType');
		$alliance = $this->getSafeFieldStr($buildData, 'Alliance');
		$level = $this->getSafeFieldInt($buildData, 'EffectiveLevel');
		$createTime = $this->getSafeFieldInt($buildData, 'TimeStamp');
		$special = '';
		$championPoints = 0;
		
		$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
		$alliance = preg_replace("#\^[a-zA-Z]*#", "", $alliance);
		$class = preg_replace("#\^[a-zA-Z]*#", "", $class);
		$race = preg_replace("#\^[a-zA-Z]*#", "", $race);
		
		if (array_key_exists('ChampionPoints', $buildData) && array_key_exists('Total:Spent', $buildData['ChampionPoints']))
		{
			$championPoints = $buildData['ChampionPoints']['Total:Spent'];
		}
		
		$championPoints = $buildData['ChampionPointsEarned'];
		
		if ($buildData['Vampire'] == 1) $special = "Vampire";
		if ($buildData['Werewolf'] == 1) $special = "Werewolf";
		
		if ($this->checkBuffWerewolf($buildData)) $special = "Werewolf";
				
		$query  = "INSERT INTO characters(name, buildName, accountName, uniqueAccountName, wikiUserName, class, race, buildType, level, createTime, championPoints, special, alliance) ";
		$query .= "VALUES(\"$name\", \"$buildName\", \"$accountName\", \"$uniqueAccountName\", \"$wikiUserName\", \"$class\", \"$race\", \"$buildType\", $level, $createTime, $championPoints, \"$special\", \"$alliance\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE) 
		{
			$this->reportError("Failed to create new character record!");
			return -1;
		}
		
		$buildData['id'] = $this->db->insert_id;
		$this->characterId = $buildData['id'];
		$this->uniqueAccountName = $uniqueAccountName;
		$this->log("Created new character '$name' with ID {$buildData['id']}.");
		return $this->db->insert_id;
	}
	
	
	public function checkBuffWerewolf(&$buildData)
	{
		$buffs = &$buildData['Buffs'];
		if ($buffs == null) return false;
		
		foreach ($buffs as $buff)
		{
			if ($buff['name'] == 'Lycanthropy') return true;
		}
		
		return false;
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
				$result &= $this->saveCharacterArrayData($buildData, $key, $value, false);
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
		$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
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
			case "Research":
				return $this->saveCharacterResearch($buildData, $name, $arrayData);
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
			case "Inventory":
			case "inventory":
				return $this->saveCharacterInventory($buildData, $name, $arrayData);
			default:
				return $this->reportError("Unknown array '$name' found in character data!");
		}
		
		return true;
	}
		
	
	public function saveCharacterInventory($buildData, $name, $arrayData)
	{
		if (!$this->hasCharacterInventory) return true;
		
		$charId = intval($buildData['id']);
		$accountName = $this->getSafeFieldStr($buildData, 'UniqueAccountName');
		
		$result = True;
		$startTime = microtime(True);
			
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterInventoryItem($charId, $accountName, $key, $value);
		}
		
		$deltaTime = (microtime(True) - $startTime) * 1000;
		$count = count($arrayData);
		$this->log("Parsed and saved $count inventory items in $deltaTime ms.");
			
		return $result;
	}
	
	
	public function saveCharacterInventoryItem($charId, $accountName, $index, $itemData)
	{
		
			/* Ignore non-numeric indexes */
		if (!is_numeric($index)) return true;
		
			//"200 |H0:item:33753:25:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0|h[Fish]|h"
		$matches = array();
		$result = preg_match("/([0-9]+) (.*)/", $itemData, $matches);
		if ($result !== 1) return false;
		
		$qnt = intval($matches[1]);
		$fullItemLink = $matches[2];
		$itemLink = $fullItemLink;
		$itemName = "";
		$extraData = "";
		
		$matches = array();
		$result = preg_match("/(.*)\|h\[(.*)\]\|h(.*)/", $fullItemLink, $matches);
		
		if ($result === 1) 
		{
			$itemLink = $matches[1] . "|h|h";
			$itemName = $this->MakeNiceItemName($matches[2]);
			$extraData = $matches[3];
		}
		
		$style = 0;
		$stolen = 0;
		$value = 0;
		$quality = 0;
		$level = 0;
		$type = 0;
		$equipType = 0;
		$weaponType = 0;
		$craftType = 0;
		$armorType = 0;
		$consumable = 0;
		$isJunk = 0;
		$icon = "";
		
		if (strpos($extraData, 'Junk') !== false) 
		{
			$isJunk = 1;
		}
		
		if (strpos($extraData, 'Cons') !== false)
		{
			$consumable = 1;
		}
				
		$matches = array();
		$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId>[0-9]*)\:(?P<enchantSubtype>[0-9]*)\:(?P<enchantLevel>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<stolen>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h(?P<name>[^|\^]*)(?P<nameCode>.*?)\|h/', $itemLink, $matches);
		
		if ($result === 1)
		{
			$style = intval($matches['style']);	
			$stolen = intval($matches['stolen']);
			
			$itemData = $this->loadItemData($matches['itemId'], $matches['subtype'], $matches['level']);
			
			if ($itemData !== False)
			{
				$value = $itemData['value'];
				$quality = $itemData['quality'];
				$level = $itemData['level'];
				$type = $itemData['type'];
				$equipType = $itemData['equipType'];
				$weaponType = $itemData['weaponType'];
				$armorType = $itemData['armorType'];
				$craftType = $itemData['craftType'];
				
					//TODO: Consumable column in mined item data is currently wrong a lot of the time
				//$consumable = $itemData['isConsumable'];
				
				$icon = $this->db->real_escape_string($itemData['icon']);
			}
		}
		
		$safeLink = $this->db->real_escape_string($itemLink);
		$safeName = $this->db->real_escape_string($itemName);

		$query  = "INSERT INTO inventory(characterId, account, name, itemLink, qnt, style, stolen, value, quality, level, type, equipType, weaponType, armorType, craftType, icon, consumable, junk) ";
		$query .= "VALUES($charId, \"$accountName\", \"$safeName\", \"$safeLink\", $qnt, $style, $stolen, $value, $quality, $level, $type, $equipType, $weaponType, $armorType, $craftType, \"$icon\", $consumable, $isJunk);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to save character inventory slot data!");
			
		return true;
	}
	
	
	public function loadItemData($itemId, $subtype, $level)
	{
		$itemId  = intval($itemId);
		$subtype = intval($subtype);
		$level   = intval($level);
				
		if (isset($this->itemDataDB[$itemId][$subtype][$level])) return $this->itemDataDB[$itemId][$subtype][$level]; 
		if (isset($this->itemDataDB[$itemId][1][1])) return $this->itemDataDB[$itemId][1][1];
		
		$itemData = array();		
				
		$query = "SELECT * from uesp_esolog.minedItem WHERE itemId=$itemId AND internalSubType=$subtype AND internalLevel=$level LIMIT 1;";
		$this->lastQuery = $query;
		$result = $this->dbLog->query($query);
		if ($result === False) return $this->reportError("Failed to load item data for $itemId::$subtype::$level");
		
		if ($result->num_rows == 0) 
		{
			$query = "SELECT * from uesp_esolog.minedItem WHERE itemId=$itemId AND internalSubType=1 AND internalLevel=1 LIMIT 1;";
			$this->lastQuery = $query;
			$result = $this->dbLog->query($query);
			if ($result === False) return $this->reportError("Failed to load item data for $itemId::$subtype::$level");
			if ($result->num_rows == 0) return False;
			
			$subtype = 1;
			$level = 1;
		}
		
		$result->data_seek(0);
		$itemData = $result->fetch_assoc();
		
		if ($this->itemDataDB[$itemId] == null) $this->itemDataDB[$itemId] = array();
		if ($this->itemDataDB[$itemId][$subtype] == null) $this->itemDataDB[$itemId][$subtype] = array();
		$this->itemDataDB[$itemId][$subtype][$level] = $itemData;
		
		//$this->log("Loaded item $itemId::$subtype::$level, {$itemData['quality']}, {$itemData['icon']}");
		return $itemData;
	}
	
	
	public function saveCharacterEquipSlots($buildData, $name, $arrayData)
	{
		$result = True;
		$accountName = $this->getSafeFieldStr($buildData, 'UniqueAccountName');
	
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterEquipSlot($buildData, $key, $value, $accountName);
		}
	
		return $result;
	}
	
	
	public function MakeNiceItemName($name)
	{
		if ($name == null) $name = "";
		
		$name = preg_replace("/(.*?)(\^.*)?/", "$1", $name);
		$name = ucwords($name);
		
		$name = preg_replace("/ Of /", " of ", $name);
		$name = preg_replace("/ The /", " the ", $name);
		$name = preg_replace("/ And /", " and ", $name);
		
		$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
		
		return $name;
	}
	
	
	public function saveCharacterEquipSlot($buildData, $index, $arrayData, $accountName)
	{
		$charId = $buildData['id'];
		$name = $arrayData['name'];
		$icon = $this->getSafeFieldStr($arrayData, 'icon');
		$itemLink = $this->getSafeFieldStr($arrayData, 'link');
		$condition = $this->getSafeFieldInt($arrayData, 'condition');
		$setCount = $this->getSafeFieldInt($arrayData, 'setcount');
		
		$name = $this->MakeNiceItemName($name);
		
		$style = 0;
		$stolen = 0;
		$value = 0;
		$quality = 0;
		$level = 0;
		$type = 0;
		$equipType = 0;
		$weaponType = 0;
		$craftType = 0;
		$armorType = 0;
		
		$matches = array();
		$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId>[0-9]*)\:(?P<enchantSubtype>[0-9]*)\:(?P<enchantLevel>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<stolen>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h(?P<name>[^|\^]*)(?P<nameCode>.*?)\|h/', $itemLink, $matches);
		
		if ($result === 1)
		{
			$style = intval($matches['style']);
			$stolen = intval($matches['stolen']);
				
			$itemData = $this->loadItemData($matches['itemId'], $matches['subtype'], $matches['level']);
				
			if ($itemData !== False)
			{
				$value = $itemData['value'];
				$quality = $itemData['quality'];
				$level = $itemData['level'];
				$type = $itemData['type'];
				$equipType = $itemData['equipType'];
				$weaponType = $itemData['weaponType'];
				$armorType = $itemData['armorType'];
				$craftType = $itemData['craftType'];
			}
		}
		
		$safeName = $this->db->real_escape_string($name);
		
		$query  = "INSERT INTO equipSlots(characterId, account, name, itemLink, icon, `condition`, `index`, setCount, style, stolen, value, quality, level, type, equipType, weaponType, armorType, craftType) ";
		$query .= "VALUES($charId, \"$accountName\", \"$safeName\", \"$itemLink\", \"$icon\", $condition, $index, $setCount, $style, $stolen, $value, $quality, $level, $type, $equipType, $weaponType, $armorType, $craftType);";
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
			if (is_array($value))
			{
				$result &= $this->saveCharacterSkill($buildData, $key, $value);
			}
			else
			{
				$newKey = "SkillRank:" . $key;
				$result &= $this->saveCharacterStatData($buildData, $newKey, $value);
			}			
		}
	
		return $result;
	}
	
	
	public function saveCharacterSkill($buildData, $name, $arrayData)
	{
		$charId = $buildData['id'];
		$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
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
	
		$query  = "INSERT INTO buffs(characterId, name, icon, abilityId, description) ";
		$query .= "VALUES($charId, \"$name\", \"$icon\", $abilityId, \"$description\");";
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
			{
				$result &= $this->saveCharacterChampionPoint($buildData, $key, $value);
			}
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
		$name = preg_replace("#\^[a-zA-Z]*#", "", $name);
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
	
		foreach ($arrayData as $styleName => &$value)
		{
			$key = "Crafting:" . $styleName;
			
			if (is_array($value))
			{
				ksort($value);
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
	
	
	public function saveCharacterResearch($buildData, $name, $arrayData)
	{
		$result = True;
	
		foreach ($arrayData as $styleName => $value)
		{
			$key = "Research:" . $styleName;
			$result &= $this->saveCharacterStatData($buildData, $key, $value);
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
			$this->formResponseErrorMsg = "Failed to find any character data form input to parse!"; 
			header('X-PHP-Response-Code: 500', true, 500);
			header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
			return $this->reportError($this->formResponseErrorMsg);
		}
		
		$this->rawBuildData = $this->parseRawBuildData($this->inputParams['chardata']); 
		print("Found character data " . strlen($this->rawBuildData) . " bytes in size.");
		
		if (strlen($this->rawBuildData) < $this->ECD_MINIMUM_BUILDDATA_SIZE)
		{
			print("Ignoring empty char data.");
			return true;
		}
		
		if (!$this->saveBuildData()) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
			return false;
		}
	
		if (!$this->parseBuildData())
		{
			header('X-PHP-Response-Code: 500', true, 500);
			header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
			return false;
		}
		
		return true;
	}
	
	
	public function doFormParse()
	{
		$this->initDatabaseWrite();
		$this->log("Started parsing " . $_SERVER['CONTENT_LENGTH'] . " bytes of build data from " . $_SERVER["REMOTE_ADDR"] . " at " . date("Y-m-d H:i:s"));
		
		$this->writeHeaders();
		
		if (!$this->parseFormInput()) return false;
		if (!$this->saveAllNewCharacters()) return false;
		
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
		
		return true;
	}
	
	
	public function doParse($buildData)
	{
		$this->initDatabaseWrite();
		
		if (!$this->parseBuildDataRoot($buildData)) return false;
		if (!$this->savePhpBuildData()) return false;
		if (!$this->saveAllNewCharacters()) return false;
		
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
	
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



