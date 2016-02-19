<?php 


require_once('parseBuildData.class.php');
require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataParser extends EsoBuildDataParser 
{
	
	public function __construct ()
	{
		parent::__construct();
		
		$this->ECD_OUTPUTLOG_FILENAME = "/home/uesp/esochardata/chardata.log";
		$this->ECD_OUTPUT_BUILDDATA_PATH = "/home/uesp/esochardata/";
		$this->ECD_OUTPUT_BUILDDATA_PREFIX = "chardata-";
		$this->ECD_MINIMUM_BUILDDATA_SIZE = 24;
		
		$this->hasCharacterInventory = true;
		$this->hasCharacterBank      = true;
	}
	
	
	public function initDatabase ()
	{
		global $uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = false;
	
		return true;
	}	


	public function initDatabaseWrite ()
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
		$result = parent::createTables();
		if (!$result) return false;
			
		$query = "CREATE TABLE IF NOT EXISTS inventory (
						id INTEGER NOT NULL AUTO_INCREMENT,
						characterId INTEGER NOT NULL,
				 		account TINYTEXT NOT NULL,
						qnt INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						itemLink TINYTEXT NOT NULL,
						icon TEXT NOT NULL,
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
						consumable TINYTINT NOT NULL,
						junk TINYINT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_name(name(32)),
						INDEX index_itemLink(itemLink(64)),
						INDEX index_account(account(48)),
						INDEX index_characterId(characterId)
					);";
	
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create inventory table!");
	}
	
	
	public function parseRawBuildData($rawCharData)
	{
		$charData = base64_decode(str_replace(' ', '+', $rawCharData));
	
		$charData .= "\n";
		$charData .= "uespCharData.IPAddress = '" . $_SERVER["REMOTE_ADDR"] . "'\n";
		$charData .= "uespCharData.UploadTimestamp = " . time() . "\n";
	
		return $charData;
	}
	
	
	public function parseBuildData()
	{
		$this->fileLuaResult = $this->Lua->eval($this->rawBuildData);
		return $this->parseBuildDataRoot($this->Lua->uespCharData);
	}
	
	
	public function saveNewCharData($charData)
	{
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
		
		$this->newCharacterCount += 1;
		return $result;
	}
	
	
	public function deleteExistingCharData($charData)
	{
		$charId = intval($charData['id']);
		$accountName = $this->getSafeFieldStr($charData, 'UniqueAccountName');
		
		$this->log("Deleting character data for characterId #$charId ($accountName)...");
		
		$query = "DELETE FROM inventory WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character inventory data!");
		
		$query = "DELETE FROM championPoints WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character championPoints data!");
		
		$query = "DELETE FROM stats WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character stats data!");
		
		$query = "DELETE FROM equipSlots WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character equipSlots data!");
		
		$query = "DELETE FROM skills WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character skills data!");
		
		$query = "DELETE FROM buffs WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character buffs data!");
		
		$query = "DELETE FROM actionBars WHERE characterId=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character actionBars data!");

		return True;
	}
	
	
	public function deleteExistingBankData($charData)
	{
		$accountName = $this->getSafeFieldStr($charData, 'UniqueAccountName');
		
		$this->log("Deleting bank inventory for $accountName...");
		
		$query = "DELETE FROM inventory WHERE characterId=-1 AND account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character bank data!");
		
		return True;
	}
	
	
	public function saveCharData($newCharData)
	{
		$charData = $this->loadCharacterByAccountName($newCharData['CharName'], $newCharData['UniqueAccountName']);
		if ($charData == null) return $this->saveNewCharData($newCharData);
		
		$newCharData['id'] = $charData['id'];
		
		$this->deleteExistingCharData($charData);
		
		$this->currentCharacterStats = array();
		$result = True;
		
		foreach ($newCharData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterArrayData($newCharData, $key, $value);
			else
				$result &= $this->saveCharacterStatData($newCharData, $key, $value);
		}
		
		return $result;
	}
	
	
	public function saveAllCharData()
	{
		$result = True;
	
		foreach ($this->parsedBuildData as $key => &$charData)
		{
			if ($charData["IsBank"] != 0)
			{
				$result &= $this->saveBankData($charData);
			}
			else 
			{
				$this->characterCount += 1;
				$result &= $this->saveCharData($charData);
			}
		}
		
		$result &= $this->saveCharacterCurrency();
	
		return $result;
	}
	
	
	public function saveBankData($bankData)
	{
		$result = True;
		
		$this->deleteExistingBankData($bankData);
		
		foreach ($bankData as $key => &$value)
		{
			if ($key == "Inventory") $result = $this->saveCharacterBank($bankData, $key, $value);
		}
	
		return $result;
	}

	
	public function saveCharacterBank($buildData, $name, $arrayData)
	{
		if (!$this->hasCharacterBank) return true;
	
		$charId = -1;
		$accountName = $this->getSafeFieldStr($buildData, 'UniqueAccountName');
		$result = True;
			
		foreach ($arrayData as $key => &$value)
		{
			$result &= $this->saveCharacterInventoryItem($charId, $accountName, $key, $value);
		}
	
		return $result;
	}
	
	
	public function saveCharacterCurrency()
	{
		$charId = $this->characterId;
		$account = $this->db->real_escape_string($this->uniqueAccountName);
		
		$invGold = $this->getSafeFieldInt($this->currentCharacterStats, 'Money');
		$invTelvar = $this->getSafeFieldInt($this->currentCharacterStats, 'TelvarStones');
		$invAP = $this->getSafeFieldInt($this->currentCharacterStats, 'AlliancePoints');
		$bankGold = $this->getSafeFieldInt($this->currentCharacterStats, 'BankedMoney');
		$bankTelvar = $this->getSafeFieldInt($this->currentCharacterStats, 'BankedTelvarStones');
		
		$result = True;
		
		$result &= $this->saveCharacterCurrencyRawData($charId, $account, "__Gold",   $invGold);
		$result &= $this->saveCharacterCurrencyRawData($charId, $account, "__Telvar", $invTelvar);
		$result &= $this->saveCharacterCurrencyRawData($charId, $account, "__AP",     $invAP);
		
		$result &= $this->saveCharacterCurrencyRawData(-1, $account, "__Gold",   $bankGold);
		$result &= $this->saveCharacterCurrencyRawData(-1, $account, "__Telvar", $bankTelvar);		
		
		return $result;
	}
	
	
	public function saveCharacterCurrencyRawData($charId, $account, $name, $value)
	{
		$query = "INSERT INTO inventory(characterId, account, name, qnt) VALUES($charId, \"$account\", \"$name\", $value);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Failed to save currency data '$name' for $name::$account!");
		 
		return True;
	}
	
	
	public function doFormParse()
	{
		$this->log("Started parsing " . $_SERVER['CONTENT_LENGTH'] . " bytes of character data from " . $_SERVER["REMOTE_ADDR"] . " at " . date("Y-m-d H:i:s"));
		
		$this->writeHeaders();
	
		if (!$this->parseFormInput()) return false;
		if (!$this->saveAllCharData()) return false;
		
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
		
		return True;
	}
	
};


