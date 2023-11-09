<?php 


require_once('parseBuildData.class.php');
require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataParser extends EsoBuildDataParser 
{
	
	public $savedCharacters = 0;
	
		
	public function __construct ()
	{
		parent::__construct();
		
		$this->ECD_OUTPUTLOG_FILENAME = "/home/uesp/esochardata/chardata.log";
		$this->ECD_OUTPUT_BUILDDATA_PATH = "/home/uesp/esochardata/";
		$this->ECD_OUTPUT_BUILDDATA_PREFIX = "chardata-";
		$this->ECD_MINIMUM_BUILDDATA_SIZE = 24;
		
		$this->hasCharacterInventory = true;
		$this->hasCharacterBank      = true;
		$this->hasCharacterCraftBag  = true;
		$this->hasCharacterRecipes   = true;
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
						characterId INTEGER NOT NULL,
				 		account TINYTEXT NOT NULL DEFAULT '',
						qnt INTEGER NOT NULL,
						name TINYTEXT NOT NULL,
						itemLink TINYTEXT NOT NULL DEFAULT '',
						icon TEXT NOT NULL DEFAULT '',
						value INTEGER NOT NULL DEFAULT '0',
						level TINYINT NOT NULL DEFAULT '0',
						quality TINYINT NOT NULL DEFAULT '0',
						type TINYINT NOT NULL DEFAULT '0',
						equipType TINYINT NOT NULL DEFAULT '0',
						weaponType TINYINT NOT NULL DEFAULT '0',
						armorType TINYINT NOT NULL DEFAULT '0',
						craftType TINYINT NOT NULL DEFAULT '0',
						stolen TINYINT NOT NULL DEFAULT '0',
						trait TINYINT NOT NULL DEFAULT '0',
						style TINYINT NOT NULL DEFAULT '0',
						consumable TINYINT NOT NULL DEFAULT '0',
						junk TINYINT NOT NULL DEFAULT '0',
						setName TINYTEXT NOT NULL DEFAULT '',
						INDEX index_name(name(32)),
						INDEX index_itemLink(itemLink(64)),
						INDEX index_account(account(48)),
						INDEX index_characterId(characterId)
					) ENGINE=MYISAM;";
	
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create inventory table!");
		
		$query = "CREATE TABLE IF NOT EXISTS account (
						id INTEGER NOT NULL AUTO_INCREMENT,
						account TINYTEXT NOT NULL,
						passwordHash CHAR(64) NOT NULL,
						salt CHAR(16) NOT NULL,
						wikiUserName TINYTEXT NOT NULL DEFAULT '',
						PRIMARY KEY (id),
						INDEX index_account(account(48))
					) ENGINE=MYISAM;";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to create account table!");

		return true;
	}
	
	
	public function saveAccount()
	{
		$id = $this->accountData['id'];
		if ($id == null || $id <= 0) return $this->createNewAccount();
		
		$account = $this->getSafeFieldStr($this->accountData, 'account');
		$wikiUserName = $this->getSafeFieldStr($this->accountData, 'wikiUserName');
		$salt = $this->getSafeFieldStr($this->accountData, 'salt');
		$passwordHash = $this->getSafeFieldStr($this->accountData, 'passwordHash');
		
		$query  = "UPDATE account SET passwordHash=\"$passwordHash\", salt=\"$salt\", wikiUserName=\"$wikiUserName\" ";
		$query .= "WHERE account=\"$account\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Failed to update existing account record!");
		
		return true;
	}
	
	
	public function updateAccountData($newCharData)
	{
		$wikiUserName = $this->getSafeFieldStr($newCharData, 'WikiUser');
		$this->accountData['wikiUserName'] = $wikiUserName;
		if ($this->uniqueAccountName != "") $this->accountData['account'] = $this->uniqueAccountName;

		return $this->updateAccountPassword($newCharData['Password']);
	}
	
	
	public function updateAccountPassword($newPassword)
	{
		$salt = $this->accountData['salt'];
		$newSalt = uniqid('', true);
		$passwordHash = "0";
		if ($newPassword == null) $newPassword = "";
		if ($newPassword != "")	$passwordHash = crypt($newPassword, '$5$'.$salt);
		
			/* Don't update if nothing has changed */
		if ($this->accountData['passwordHash'] == $passwordHash) return true;
		
		$passwordHash = "0";
		if ($newPassword != "")	$passwordHash = crypt($newPassword, '$5$'.$newSalt);
		
		$this->accountData['salt'] = $newSalt;
		$this->accountData['passwordHash'] = $passwordHash;
		
		return true;
	}
	
	
	public function createNewAccount()
	{
		$account = $this->getSafeFieldStr($this->accountData, 'account');
		$wikiUserName = $this->getSafeFieldStr($this->accountData, 'wikiUserName'); 
		$salt = $this->accountData['salt'];
		$passwordHash = $this->accountData['passwordHash'];

		$query  = "INSERT INTO account(account, passwordHash, salt, wikiUserName)";
		$query .= "VALUES(\"$account\", \"$passwordHash\", \"$salt\", \"$wikiUserName\");";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Failed to create new account record!");
		
		return true;
	}
	
	
	public function loadAccount($account)
	{
		$safeAccount = $this->db->real_escape_string($account);
			
		$query  = "SELECT * FROM account WHERE account=\"$safeAccount\" LIMIT 1;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Failed to load account record for '$account'!");
		if ($result->num_rows == 0) return $this->reportError("Failed to load account record '$account'!");;
		
		$result->data_seek(0);
		$this->accountData = array_merge($this->accountData, $result->fetch_assoc());
		
		return true;
	}
	
	
	public function parseRawBuildData($rawCharData)
	{
		$charData = base64_decode(str_replace(' ', '+', $rawCharData));
	
		$charData .= "\n";
		$charData .= "uespCharData.IPAddress = '" . $_SERVER["REMOTE_ADDR"] . "'\n";
		$charData .= "uespCharData.UploadTimestamp = " . time() . "\n";
		$charData .= "uespCharData.UseZeroBaseCrit = 1\n";
	
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
		
		$result &= $this->saveCharacterScreenshots($charData, false);
		
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
	
	
	public function deleteExistingCraftBagData($charData)
	{
		$accountName = $this->getSafeFieldStr($charData, 'UniqueAccountName');
	
		$this->log("Deleting craft bag inventory for $accountName...");
	
		$query = "DELETE FROM inventory WHERE characterId=-2 AND account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) $this->reportError("Failed to clear previous character craft bag data!");
	
		return True;
	}
	
	
	public function saveCharData($newCharData, $oldCharData)
	{
		if ($oldCharData == null) return $this->saveNewCharData($newCharData);
		
		$newCharData['id'] = $oldCharData['id'];
		if (!$this->updateCharacter($newCharData)) return false;
		
		$this->deleteExistingCharData($oldCharData);
		
		$this->currentCharacterStats = array();
		$result = True;
		
		foreach ($newCharData as $key => &$value)
		{
			if (is_array($value))
				$result &= $this->saveCharacterArrayData($newCharData, $key, $value);
			else
				$result &= $this->saveCharacterStatData($newCharData, $key, $value);
			
			//error_log("SaveCharData: $key = $result");
		}
		
		$result &= $this->saveCharacterScreenshots($newCharData, false);
		
		$result &= $this->updateAccountData($newCharData);
		return $result;
	}
	
	
	public function updateCharacter($charData)
	{
		$charId = $this->characterId;
		$name = $this->getSafeFieldStr($charData, 'CharName');
		$buildName = $this->getSafeFieldStr($charData, 'Note');
		$accountName = $this->getSafeFieldStr($charData, 'AccountName');
		$uniqueAccountName = $this->getSafeFieldStr($charData, 'UniqueAccountName');
		$wikiUserName = $this->getSafeFieldStr($charData, 'WikiUser');
		$class = $this->getSafeFieldStr($charData, 'Class');
		$race = $this->getSafeFieldStr($charData, 'Race');
		$alliance = $this->getSafeFieldStr($charData, 'Alliance');
		$buildType = $this->getSafeFieldStr($charData, 'BuildType');
		$level = $this->getSafeFieldInt($charData, 'Level');
		$createTime = $this->getSafeFieldInt($charData, 'TimeStamp');
		$charIndex = $this->getSafeFieldInt($charData, 'CharIndex');
		$gameCharId = $this->getSafeFieldStr($charData, 'CharId');
		if ($gameCharId == '') $gameCharId = 0;
		$special = '';
		$championPoints = 0;
		
		if (array_key_exists('ChampionPoints', $charData) && array_key_exists('Total:Spent', $charData['ChampionPoints']))
		{
			$championPoints = $charData['ChampionPoints']['Total:Spent'];
		}
		
		$championPoints = $charData['ChampionPointsEarned'];
		
		if ($level == 50)
		{
			$level = 50 + intval($championPoints/10);
			if ($level > 66) $level = 66;
		}
		
		if ($charData['Vampire'] == 1) $special = "Vampire";
		if ($charData['Werewolf'] == 1) $special = "Werewolf";
		
		if ($this->checkBuffWerewolf($charData)) $special = "Werewolf";
		if ($this->checkBuffVampire($charData)) $special = "Vampire";
		
		$query  = "UPDATE characters SET ";
		$query .= "name=\"$name\", buildName=\"$buildName\", wikiUserName=\"$wikiUserName\", class=\"$class\", race=\"$race\", buildType=\"$buildType\", level=$level, ";
		$query .= "createTime=$createTime, championPoints=$championPoints, special=\"$special\", uploadTimestamp=now(), alliance=\"$alliance\", charIndex='$charIndex', charId='$gameCharId' ";
		$query .= "WHERE id=$charId;";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		
		if ($result === FALSE)
		{
			$this->reportError("Failed to update character record!");
			return -1;
		}
		
		return true;
	}
	
	
	public function findAccountFromRawData()
	{
		$this->accountData['passwords'] = array();
		$this->accountData['oldPasswords'] = array();
		$this->accountData['wikiUserNames'] = array();
		
		$goodAccount = "";
		
		foreach ($this->parsedBuildData as $key => &$charData)
		{
			if ($charData["IsBank"] == 0 && $charData["IsCraftBag"] == 0)
			{
				$account = $charData['UniqueAccountName'];
				if ($account != null && $account != "") $goodAccount = $account;
				
				$password = $charData['Password'];
				if ($password != null && $password != "") $this->accountData['passwords'][] = $password;
				
				$password = $charData['OldPassword'];
				if ($password != null && $password != "") $this->accountData['oldPasswords'][] = $password;
				
				$name = $charData['WikiUser'];
				if ($name != null && $name != "") $this->accountData['wikiUserNames'][] = $name;
			}
		}
		
		return $goodAccount;
	}
	
	
	public function canUpdateCharacterData($charData, $oldCharData)
	{
		if ($oldCharData == null) 
		{
			$this->log("Character access Granted...new character!");
			return true;
		}
		
		if ($oldCharData['charId'] == null) 
		{
			$this->log("Character access Granted...old character has no charId!");
			return true;
		}
		
		if ($oldCharData['charId'] == 0) 
		{
			$this->log("Character access Granted...old character has a 0 charId!");
			return true;
		}
		
		if ($charData['CharId'] != $oldCharData['charId']) 
		{
			$this->log("Character access Denied...character IDs do not match! {$charData['CharId']} != {$oldCharData['charId']}");
			return false;
		}
		
		$this->log("Character access Granted...character ID matches!");
		return true;
	}
	
	
	public function saveAllCharData()
	{
		$result = True;
		
		$account = $this->findAccountFromRawData();
		$this->loadAccount($account);
		
		$bankKey = -1;
		$craftBagKey = -1;
		$charKeysToParse = array();
		$hasValidCharData = false;
		
		foreach ($this->parsedBuildData as $key => &$charData)
		{
			if ($charData["IsBank"] != 0)
			{
				$bankKey = $key;
			}
			else if ($charData["IsCraftBag"] != 0)
			{
				$craftBagKey = $key;
			}
			else 
			{
				$charKeysToParse[] = $key;
			}
		}
	
		foreach ($charKeysToParse as $key)
		{
			$charData = &$this->parsedBuildData[$key];
			$oldCharData = $this->loadCharacterByAccountName($charData['CharName'], $charData['UniqueAccountName']);
			
			if (!$this->canUpdateCharacterData($charData, $oldCharData))
			{
				$name = $charData['CharName'];
				$this->log("Access denied for character '$name' update on account '$account'!");
				$this->formResponseErrorMsg .= "Access Denied for character $name!";
				header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
				continue;
			}
			
			$this->characterCount += 1;
			
			$thisResult  = $this->saveCharData($charData, $oldCharData);
			//error_log("SaveChar1: $thisResult");
			$thisResult &= $this->saveCharacterCurrency();
			//error_log("SaveChar2: $thisResult");
			$thisResult &= $this->saveCharacterInventorySpace();
			//error_log("SaveChar3: $thisResult");
			
			if ($thisResult) 
			{
				$hasValidCharData = true;
				$this->savedCharacters += 1;
			}
		}
		
		if (!$hasValidCharData)
		{
			header('X-PHP-Response-Code: 500', true, 500);
			$this->formResponseErrorMsg .= "Access Denied for all characters!";
			header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
			return false;
		}
		
		if ($bankKey >= 0 && $hasValidCharData)
		{
			$charData = &$this->parsedBuildData[$bankKey];
			$thisResult = $this->saveBankData($charData);
			$result &= $thisResult;
		}
		
		if ($craftBagKey >= 0 && $hasValidCharData)
		{
			$charData = &$this->parsedBuildData[$craftBagKey];
			$thisResult = $this->saveCraftBagData($charData);
			$result &= $thisResult;
		}
		
		$result &= $this->saveAccount();
		
		return $result;
	}
	
	
	public function saveBankData($bankData)
	{
		$result = True;
		
		$this->deleteExistingBankData($bankData);
		$account = $this->getSafeFieldStr($bankData, "UniqueAccountName");
		
		foreach ($bankData as $key => &$value)
		{
			if ($key == "Inventory") 
			{
				$result &= $this->saveCharacterBank($bankData, $key, $value);
			}
			else if ($key == "Gold")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__Gold", $value);
			}
			else if ($key == "Telvar")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__Telvar", $value);
			}
			else if ($key == "AP")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__AP", $value);
			}
			else if ($key == "WritVouchers")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__WritVoucher", $value);
			}
			else if ($key == "Size")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__TotalSpace", $value);
			}
			else if ($key == "UsedSize")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__UsedSpace", $value);
			}
		}
	
		return $result;
	}
	
	
	public function saveCraftBagData($craftBagData)
	{
		$result = True;
	
		$this->deleteExistingCraftBagData($craftBagData);
		$account = $this->getSafeFieldStr($craftBagData, "UniqueAccountName");
	
		foreach ($craftBagData as $key => &$value)
		{
			if ($key == "Inventory")
			{
				$result &= $this->saveCharacterCraftBag($craftBagData, $key, $value);
			}
			else if ($key == "UsedSize")
			{
				$result &= $this->saveCharacterInventoryExtraRawData(-2, $account, "__UsedSpace", $value);
			}
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
	
	
	public function saveCharacterCraftBag($buildData, $name, $arrayData)
	{
		if (!$this->hasCharacterCraftBag) return true;
	
		$charId = -2;
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
		
		$this->log("Saving character $charId currency for account $account...");
		
		$invGold = $this->getSafeFieldInt($this->currentCharacterStats, 'Money');
		$invTelvar = $this->getSafeFieldInt($this->currentCharacterStats, 'TelvarStones');
		$invAP = $this->getSafeFieldInt($this->currentCharacterStats, 'AlliancePoints');
		$invVoucher = $this->getSafeFieldInt($this->currentCharacterStats, 'WritVoucher');
		$invTransmute = $this->getSafeFieldInt($this->currentCharacterStats, 'TransmuteCrystals');
		
		$result = True;
		
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__Gold",   $invGold);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__Telvar", $invTelvar);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__AP",     $invAP);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__WritVoucher", $invVoucher);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__TransmuteCrystals", $invTransmute);
		
		return $result;
	}
	
	
	public function saveCharacterInventorySpace()
	{
		$charId = $this->characterId;
		$account = $this->db->real_escape_string($this->uniqueAccountName);
		
		$invUsedSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'InventoryUsedSize');
		$invTotalSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'InventorySize');

		$result = True;
		
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__UsedSpace", $invUsedSpace);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__TotalSpace", $invTotalSpace);
		
		return $result;
	}
	
	
	public function saveCharacterInventoryExtraRawData($charId, $account, $name, $value)
	{
		$query = "INSERT INTO inventory(characterId, account, name, qnt) VALUES($charId, \"$account\", \"$name\", $value);";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Failed to save currency data '$name' for $name::$account!");
		 
		return True;
	}
	
	
	public function doFormParse()
	{
		$this->initDatabaseWrite();
		$this->log("Started parsing " . $_SERVER['CONTENT_LENGTH'] . " bytes of character data from " . $_SERVER["REMOTE_ADDR"] . " at " . date("Y-m-d H:i:s"));
		$this->writeHeaders();
		
		if (!$this->parseFormInput()) return false;
		if (!$this->saveAllCharData()) return false;
		
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
		
		return True;
	}
	
	
	public function parseCharDataRoot($uespCharData)
	{
		if ($uespCharData == null)
		{
			$this->formResponseErrorMsg = "Error parsing Lua data object!";
			return $this->reportError("Null character data object received!");
		}
	
		$index = count($this->parsedBuildData) + 1;
		return $this->parseSingleCharacter($index, $uespCharData);
	}
	
	
	public function doParse($buildData)
	{
		$this->initDatabaseWrite();
	
		if (!$this->parseCharDataRoot($buildData)) return false;
	
		return true;
	}
	
	
	public function saveParsedCharacters()
	{
		if (!$this->savePhpBuildData()) return false;
		if (!$this->saveAllCharData()) return false;
	
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
	
		return true;
	}
	
	
};



