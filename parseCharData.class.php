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
						consumable TINYINT NOT NULL,
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
		
		$query = "CREATE TABLE IF NOT EXISTS account (
						id INTEGER NOT NULL AUTO_INCREMENT,
						account TINYTEXT NOT NULL,
						passwordHash CHAR(64) NOT NULL,
						salt CHAR(16) NOT NULL,
						wikiUserName TINYTEXT NOT NULL,
						PRIMARY KEY (id),
						INDEX index_account(account(48))
					);";
		
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
	
	
	public function createNewAccount($rawCharData)
	{
		$account = $this->getSafeFieldStr($this->accountData, 'account');
		$wikiUserName = $this->getSafeFieldStr($this->accountData, 'wikiUserName'); 
		$salt = uniqid('', true);
		$password = $rawCharData['Password'];
		if ($password == null) $password = "";
		$passwordHash = "0";
		
		if ($password != "")
		{
			$passwordHash = crypt($password, '$5$'.$salt);
		}
		
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
		
		//$this->log("Loaded account '$account' with password hash '".$this->accountData['passwordHash']."'!");
		return true;
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
		if (!$this->updateCharacter($newCharData)) return false;
		
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
		$buildType = $this->getSafeFieldStr($charData, 'BuildType');
		$level = $this->getSafeFieldInt($charData, 'EffectiveLevel');
		$createTime = $this->getSafeFieldInt($charData, 'TimeStamp');
		$special = '';
		$championPoints = 0;
		
		if (array_key_exists('ChampionPoints', $charData) && array_key_exists('Total:Spent', $charData['ChampionPoints']))
		{
			$championPoints = $charData['ChampionPoints']['Total:Spent'];
		}
		
		if ($charData['Vampire'] == 1) $special = "Vampire";
		if ($charData['Werewolf'] == 1) $special = "Werewolf";
		
		if ($this->checkBuffWerewolf($charData)) $special = "Werewolf";
		
		$query  = "UPDATE characters SET ";
		$query .= "name=\"$name\", buildName=\"$buildName\", wikiUserName=\"$wikiUserName\", class=\"$class\", race=\"$race\", buildType=\"$buildType\", level=$level, ";
		$query .= "createTime=$createTime, championPoints=$championPoints, special=\"$special\", uploadTimestamp=now() ";
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
			if ($charData["IsBank"] == 0)
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
	
	
	public function canUpdateAccountData()
	{
		$passwordHash = $this->accountData['passwordHash'];
		
		if ($passwordHash == null || $passwordHash == "0") 
		{
			$this->log("Access Granted...no password on account!");
			return true;
		}
		
		foreach ($this->accountData['passwords'] as $password)
		{
			if (crypt($password, $passwordHash) == $passwordHash)
			{
				$this->log("Access Granted...password match!");
				return true;
			}
		}
		
		foreach ($this->accountData['oldPasswords'] as $password)
		{
			if (crypt($password, $passwordHash) == $passwordHash)
			{
				$this->log("Access Granted...old password match!");
				return true;
			}
		}
		
		$this->log("Access Denied...no password found to match!");
		return false;
	}
	
	
	public function saveAllCharData()
	{
		$result = True;
		
		$account = $this->findAccountFromRawData();
		$this->loadAccount($account);
		
		if (!$this->canUpdateAccountData())
		{
			$this->formResponseErrorMsg = "Access Denied!";
			header('X-PHP-Response-Code: 500', true, 500);
			header('X-Uesp-Error: ' . $this->formResponseErrorMsg, false);
			$this->log("Access denied for character data upload on account '$account'!");
			return false;
		}
	
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
				$result &= $this->saveCharacterCurrency();
				$result &= $this->saveCharacterInventorySpace();
			}
		}
		
		$result &= $this->saveAccount();
	
		return $result;
	}
	
	
	public function saveBankData($bankData)
	{
		$result = True;
		
		$this->deleteExistingBankData($charData);
		
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
		
		$this->log("Saving character $charId currency for account $account...");
		
		$invGold = $this->getSafeFieldInt($this->currentCharacterStats, 'Money');
		$invTelvar = $this->getSafeFieldInt($this->currentCharacterStats, 'TelvarStones');
		$invAP = $this->getSafeFieldInt($this->currentCharacterStats, 'AlliancePoints');
		$bankGold = $this->getSafeFieldInt($this->currentCharacterStats, 'BankedMoney');
		$bankTelvar = $this->getSafeFieldInt($this->currentCharacterStats, 'BankedTelvarStones');
		
		$result = True;
		
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__Gold",   $invGold);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__Telvar", $invTelvar);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__AP",     $invAP);
		
		$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__Gold",   $bankGold);
		$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__Telvar", $bankTelvar);		
		
		return $result;
	}
	
	
	public function saveCharacterInventorySpace()
	{
		$charId = $this->characterId;
		$account = $this->db->real_escape_string($this->uniqueAccountName);
		
		$invUsedSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'InventoryUsedSize');
		$invTotalSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'InventorySize');
		$bankUsedSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'BankUsedSize');
		$bankTotalSpace = $this->getSafeFieldInt($this->currentCharacterStats, 'BankSize');

		$result = True;
		
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__UsedSpace", $invUsedSpace);
		$result &= $this->saveCharacterInventoryExtraRawData($charId, $account, "__TotalSpace", $invTotalSpace);
		
		$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__UsedSpace", $bankUsedSpace);
		$result &= $this->saveCharacterInventoryExtraRawData(-1, $account, "__TotalSpace", $bankTotalSpace);
		
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
	
	
	public function doParse($buildData)
	{
		$this->initDatabaseWrite();
	
		if (!$this->parseBuildDataRoot($buildData)) return false;
		if (!$this->savePhpBuildData()) return false;
		if (!$this->saveAllCharData()) return false;
		
		$this->endTime = microtime(True);
		$deltaTime = ($this->endTime - $this->startTime) * 1000;
		$this->log("Total Parsing Time = $deltaTime ms");
	
		return true;
	}
	
	
};



