<?php 


require_once("/home/uesp/secrets/esobuilddata.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/esolog.static/esoRecipeData.php");


class EsoBuildDataViewer
{
	static $ARMOR_TRAITS = array("Divines", "Impenetrable", "Infused", "Nirnhoned", "Prosperous", "Reinforced", "Sturdy", "Training", "Well-fitted");
	static $WEAPON_TRAITS = array("Charged", "Decisive", "Defending", "Infused", "Nirnhoned",  "Precise", "Powered", "Sharpened", "Training" );
	static $WEAPONS = array("Axe" => 1, "Battle Axe" => 1, "Dagger" => 1, "Greatsword" => 1, "Mace" => 1, "Maul" => 1, "Sword" => 1, "Bow" => 1,
			"Ice Staff" => 1, "Inferno Staff" => 1, "Lightning Staff" => 1, "Restoration Staff" => 1);
	
	public $ESO_HTML_TEMPLATE = "templates/esobuilddata_embed_template.txt";
	public $ESO_SHORT_LINK_URL = "//esobuilds.uesp.net/";
	
	public $ORNATE_ICON = "resources/ornate.png";
	public $INTRICATE_ICON = "resources/intricate.png";
	
	public $MAX_BUILD_DISPLAY = 100;
	
	public $hasCharacterInventory = false;
	public $hasCharacterBank      = false;
	public $hasCharacterCraftBag  = false;
	public $hasResearchOutput     = false;
	public $hasRecipeOutput       = false;
	public $hasAchievementOutput  = false;
	public $combineInventoryItems = true;
	public $combineBankItems      = true;
	public $showCPLevel           = true;
	
	public $currentCharacterPage = 0;
	public $totalCharacterCount = 0;
	public $totalCharacterPages = 0;
		
	
	const ESO_ICON_URL = "//esoicons.uesp.net";

	
	public $ESO_MOTIF_CHAPTERNAMES = array(
				"Axes",
				"Belts",
				"Boots",
				"Bows",
				"Chests",
				"Daggers",
				"Gloves",
				"Helmets",
				"Legs",
				"Maces",
				"Shields",
				"Shoulders",
				"Staves",
				"Swords",
		);
	
	
	public $wikiContext = null;
	
	public $inputParams = array();
	public $outputHtml = "";
	public $htmlTemplate = "";
	public $inputFilter = "";
	public $myMyBuilds = false;
	public $inputSearch = "";
	public $inputSearchClass = "";
	public $inputSearchRace = "";
	public $inputSearchBuildType = "";
	public $inputSearchSpecial = "";
	
	public $characterData = array();
	public $skillData = array();
	public $buildData = array();
	public $accountData = array();
	public $accountCharacters = array();
	public $accountStats = array();
	public $accountBuffs = array();
	
	public $characterId = 0;
	public $viewRawData = false;
	public $useBuildTable = true;
	public $action = '';
	public $confirm = '';
	public $nonConfirm = '';
	public $copyCharToNewBuildCharId = -1;
	
	public $db = null;
	public $dbReadInitialized  = false;
	public $dbWriteInitialized = false;
	public $lastQuery = "";
	
	public $baseUrl = "viewBuildData.php";
	public $baseResourceUrl = "";
	
	public $skillDataDisplay = 'block';
	public $skillTreeFirstName = '';
	
	public $nextLocalItemID = 1;
	
	public $accountGold = 0;
	public $accountTelvar = 0;
	public $accountWritVoucher = 0;
	public $accountAP = 0;
	public $accountUsedSpace = 0;
	public $accountTotalSpace = 0;
	
	public $formOldPassword = "";
	public $formNewPassword1 = "";
	public $formNewPassword2 = "";
	public $formAccount = "";
	
	public $isEmbedded = false;
	public $errorMessages = array();
	
	
	public function __construct ($isEmbedded = false, $initDbWrite = false)
	{
		$this->isEmbedded = $isEmbedded;
		
		if ($initDbWrite)
			$this->initDatabaseWrite();
		else
			$this->initDatabase();
	}
	
	
	public function escape($input)
	{
		return htmlspecialchars($input, ENT_COMPAT, 'UTF-8');
	}
	
	
	public function reportError($msg)
	{
		error_log("Error: " . $msg);
		
		$this->errorMessages[] = $msg;
		$this->outputHtml .= "Error: " . $msg . "<br />";
		
		if ($this->db != null && $this->db->error)
		{
			$this->outputHtml .= "\tDB Error:" . $this->db->error;
			$this->outputHtml .= "\tLast Query:" . $this->lastQuery;
		}
		
		return false;
	}
	
	
	public function initDatabase ()
	{
		global $uespEsoBuildDataReadDBHost, $uespEsoBuildDataReadUser, $uespEsoBuildDataReadPW, $uespEsoBuildDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialize) return true;
	
		$this->db = new mysqli($uespEsoBuildDataReadDBHost, $uespEsoBuildDataReadUser, $uespEsoBuildDataReadPW, $uespEsoBuildDataDatabase);
		if ($this->db == null || $this->db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		
		UpdateEsoPageViews("buildDataViews");
		
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
		
		UpdateEsoPageViews("buildDataViews");

		return true;
	}
		
	
	public function loadHtmlTemplate()
	{
		$this->htmlTemplate = file_get_contents(__DIR__ . '/' . $this->ESO_HTML_TEMPLATE);
	}
	
	
	public function getFieldStr(&$arrayData, $field)
	{
		if (!array_key_exists($field, $arrayData)) return '';
		return $arrayData[$field];
	}
	
	
	public function getFieldInt(&$arrayData, $field)
	{
		if (!array_key_exists($field, $arrayData)) return 0;
		return intval($arrayData[$field]);
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
		if ($this->showCPLevel) 
		{
			if ($level > 50) return "50";
			return strval($level);
		}
		
		if ($level < 50) return strval($level);
		if ($level == 50) return "v1";
		return "v" . ($level - 50);
	}
	
	
	public function isWikiLoggedIn()
	{
		if ($this->wikiContext == null) return false;
		
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
		
		return $user->isLoggedIn();
	}
	
	
	public function isWikiUserAdmin()
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
	
		return in_array("sysop", $user->getEffectiveGroups());
	}
	
	
	public function canWikiUserEdit()
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
		
		if (!$user->isLoggedIn()) return false;
		if (strcasecmp($user->getName(), $this->characterData['wikiUserName']) == 0) return true;
	
		return $user->isAllowedAny('esochardata_edit');
	}
	
	
	public function canWikiUserDelete()
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
		
		if (!$user->isLoggedIn()) return false;
		if (strcasecmp($user->getName(), $this->characterData['wikiUserName']) == 0) return true;
		
		return $user->isAllowedAny('esochardata_delete');
	}
	
	
	public function doesOwnBuild($buildData)
	{
		if ($this->wikiContext == null) return false;
		
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
		
		if (strcasecmp($user->getName(), $buildData['wikiUserName']) == 0) return true;
		
		return false;
	}
	
	
	public function canWikiUserCreate()
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
	
		if (!$user->isLoggedIn()) return false;
		
		return true;
	}
	
	
	public function canWikiUserEditBuild($buildData)
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
	
		if (!$user->isLoggedIn()) return false;
		if (strcasecmp($user->getName(), $buildData['wikiUserName']) == 0) return true;
		
		return $user->isAllowedAny('esochardata_edit');
	}
	
	
	public function getWikiUserName()
	{
		if ($this->wikiContext == null) return "";
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return "";
	
		return $user->getName();
	}
	
	
	public function canWikiUserDeleteBuild($buildData)
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
		
		$logIn = $user->isLoggedIn();
		$username1 = $user->getName();
		$username2 = $buildData['wikiUserName'];
			
		if (!$user->isLoggedIn()) return false;
		if (strcasecmp($user->getName(), $buildData['wikiUserName']) == 0) return true;
		
		return $user->isAllowedAny('esochardata_delete');
	}
	
	
	public function parseFormInput()
	{
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists('id', $this->inputParams)) $this->characterId = intval($this->inputParams['id']);
		if (array_key_exists('raw', $this->inputParams)) $this->viewRawData = true;
		if (array_key_exists('action', $this->inputParams)) $this->action = $this->inputParams['action'];
		if (array_key_exists('confirm', $this->inputParams)) $this->confirm = $this->inputParams['confirm'];
		if (array_key_exists('nonconfirm', $this->inputParams)) $this->nonConfirm = $this->inputParams['nonconfirm'];
		if (array_key_exists('oldPassword', $this->inputParams)) $this->formOldPassword = $this->inputParams['oldPassword'];
		if (array_key_exists('password1', $this->inputParams)) $this->formNewPassword1 = $this->inputParams['password1'];
		if (array_key_exists('password2', $this->inputParams)) $this->formNewPassword2 = $this->inputParams['password2'];
		if (array_key_exists('account', $this->inputParams)) $this->formAccount = $this->inputParams['account'];
		if (array_key_exists('filter', $this->inputParams)) $this->inputFilter = $this->inputParams['filter'];
		
		if (array_key_exists('findbuild', $this->inputParams)) 
		{
			$this->inputSearch = trim($this->inputParams['findbuild']);
		}
		
		if (array_key_exists('findclass', $this->inputParams))
		{
			$this->inputSearchClass = trim($this->inputParams['findclass']);
		}
		
		if (array_key_exists('findrace', $this->inputParams))
		{
			$this->inputSearchRace = trim($this->inputParams['findrace']);
		}
		
		if (array_key_exists('findbuildtype', $this->inputParams))
		{
			$this->inputSearchBuildType = trim($this->inputParams['findbuildtype']);
		}
		
		if (array_key_exists('findspecial', $this->inputParams))
		{
			$this->inputSearchSpecial = trim($this->inputParams['findspecial']);
		}		
		
		if ($this->inputFilter == "mine" || $this->inputFilter == "my")
		{
			$this->viewMyBuilds = true;
		}
		
		if (array_key_exists('page', $this->inputParams))
		{
			$this->currentCharacterPage = intval($this->inputParams['page']) - 1;
			if ($this->currentCharacterPage < 0) $this->currentCharacterPage = 0;
		}
		
		if (array_key_exists('copytobuild', $this->inputParams))
		{
			$this->copyCharToNewBuildCharId = intval($this->inputParams['copytobuild']);
		}		
	
		return true;
	}
	
		
	public function loadBuilds()
	{
		$page = $this->currentCharacterPage * $this->MAX_BUILD_DISPLAY;
		$this->totalCharacterCount = 0;
		$where = array();
				
		if ($this->inputSearchClass != "")
		{
			$value = $this->db->real_escape_string($this->inputSearchClass);
			$where[] = "class='$value'";
		}
		
		if ($this->inputSearchRace != "")
		{
			$value = $this->db->real_escape_string($this->inputSearchRace);
			$where[] = "race='$value'";
		}
		
		if ($this->inputSearchBuildType != "")
		{
			$value = $this->db->real_escape_string($this->inputSearchBuildType);
			$where[] = "buildType='$value'";
		}
		
		if ($this->inputSearchSpecial != "")
		{
			$value = $this->db->real_escape_string($this->inputSearchSpecial);
			$where[] = "special='$value'";
		}
		
		if ($this->inputSearch != "")
		{
			$value = $this->db->real_escape_string($this->inputSearch);
			$where[] = "(name LIKE '%$value%' OR buildName LIKE '%$value%' OR class LIKE '%$value%' OR race LIKE '%$value%' OR alliance LIKE '%$value%' OR buildType LIKE '%$value%' OR special LIKE '%$value%')";
		}
				
		if ($this->viewMyBuilds)
		{
			if ($this->wikiContext != null)
			{			
				$user = $this->wikiContext->getUser();
				
				if ($user != null)
				{
					$name = $this->db->real_escape_string($user->getName());
					$where[] = "wikiUserName='$name'";
				}
			}
		}
				
		$query = "SELECT SQL_CALC_FOUND_ROWS * FROM characters ";
		if (count($where) > 0) $query .= " WHERE " . implode(" AND ", $where); 
		$query .= " ORDER BY buildName LIMIT $page, {$this->MAX_BUILD_DISPLAY};";
		
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load builds!");
		
		$result->data_seek(0);
		$this->totalCharacterCount = $result->num_rows;
		
		while (($row = $result->fetch_assoc()))
		{
			$this->buildData[] = $row;
			$this->accountCharacters[$row['id']] = $row;
		}
		
		$this->lastQuery = "SELECT FOUND_ROWS() as count;";
		$result = $this->db->query($this->lastQuery);
		if ($result === FALSE) return true;
		
		$row = $result->fetch_assoc();
		$this->totalCharacterCount = $row['count'];
		
		$this->totalCharacterPages = ceil($this->totalCharacterCount / $this->MAX_BUILD_DISPLAY);
		if ($this->totalCharacterCount <= 0 || ($this->MAX_BUILD_DISPLAY % $this->totalCharacterCount) == 0) $this->totalCharacterPages -= 1;
		
		return true;
	}
	
	
	public function loadCharacter()
	{
		if ($this->characterId <= 0) return $this->reportError("Cannot load character: No characterId specified!");
		
		$query = "SELECT * FROM characters WHERE id={$this->characterId};";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load character {$this->characterId}!");
		if ($result->num_rows == 0) return $this->reportError("Failed to load character {$this->characterId}!");
		
		$result->data_seek(0);
		$this->characterData = $result->fetch_assoc();
		
		$this->characterData['cp'] = $this->characterData['championPoints'];

		if ($this->hasCharacterInventory)
		{
			if (!$this->loadCharacterArrayData("inventory")) return false;
			if (!$this->loadAccountInventory()) return false;
		}
		
		if ($this->hasCharacterBank)
		{
			if (!$this->loadCharacterBankData()) return false;
		}
		
		if ($this->hasCharacterCraftBag)
		{
			if (!$this->loadCharacterCraftBagData()) return false;
		}
		
		if (!$this->loadCharacterArrayData("buffs")) return false;
		if (!$this->loadCharacterArrayData("championPoints")) return false;
		if (!$this->loadCharacterArrayData("skills")) return false;
		if (!$this->loadCharacterArrayData("stats")) return false;
		if (!$this->loadCharacterArrayData("equipSlots")) return false;
		if (!$this->loadCharacterArrayData("actionBars")) return false;
		if (!$this->loadCharacterArrayData("screenshots")) return false;
		
		if (!$this->loadAccountCharacters()) return false;
		
		$this->parseCharSkillData();
		$this->parseCharChampionPointData();
		
		return true;
	}
	
	
	public function loadCharacterBankData()
	{
		$accountName = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		 
		$query = "SELECT * FROM inventory WHERE characterId=-1 AND account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load inventory bank data for account $accountName!");
		
		$result->data_seek(0);
		$arrayData = array();
		
		while (($row = $result->fetch_assoc()))
		{
			if ($row['itemLink'] == "")
			{
					/* Skip Data */
			}
			else 
			{
				$row['invType'] = "Bank";
				$row['nameLC'] = strtolower($row['name']);
				$row['setNameLC'] = strtolower($row['setName']);
				$row['localId'] = $this->nextLocalItemID;
				++$this->nextLocalItemID;
				
				$arrayData[] = $row;
			}
		}
		
		if ($this->combineBankItems) $arrayData = $this->combineInventory($arrayData);
		usort($arrayData, compareInventoryByName);
		$this->characterData['bank'] = $arrayData;
		return true;
	}
	
	
	public function loadCharacterCraftBagData()
	{
		$accountName = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
			
		$query = "SELECT * FROM inventory WHERE characterId=-2 AND account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load craft bag data for account $accountName!");
	
		$result->data_seek(0);
		$arrayData = array();
	
		while (($row = $result->fetch_assoc()))
		{
			if ($row['itemLink'] == "")
			{
				/* Skip Data */
			}
			else
			{
				$row['invType'] = "CraftBag";
				$row['nameLC'] = strtolower($row['name']);
				$row['setNameLC'] = strtolower($row['setName']);
				$row['localId'] = $this->nextLocalItemID;
				++$this->nextLocalItemID;
	
				$arrayData[] = $row;
			}
		}
	
		if ($this->combineBankItems) $arrayData = $this->combineInventory($arrayData);
		usort($arrayData, compareInventoryByName);
		$this->characterData['craftBag'] = $arrayData;
		return true;
	}
	
	
	public function loadAccountInventory()
	{
		$accountName = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		
		$query = "SELECT * FROM inventory WHERE account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load inventory data for account $accountName!");
	
		$result->data_seek(0);
		$arrayData = array();
	
		while (($row = $result->fetch_assoc()))
		{
			if ($row['itemLink'] == "")
			{
				if ($row['name'] == "__Gold")
				{
					$this->accountGold += intval($row['qnt']);
				}
				else if ($row['name'] == "__Telvar")
				{
					$this->accountTelvar += intval($row['qnt']);
				}
				else if ($row['name'] == "__WritVoucher")
				{
					$this->accountWritVoucher += intval($row['qnt']);
				}
				else if ($row['name'] == "__AP")
				{
					$this->accountAP += intval($row['qnt']);
				}
				else if ($row['name'] == "__TotalSpace")
				{
					$this->accountTotalSpace += intval($row['qnt']);
				}
				else if ($row['name'] == "__UsedSpace")
				{
					$this->accountUsedSpace += intval($row['qnt']);
				}
			}
			else 
			{
				$row['invType'] = "Account";
				$row['nameLC'] = strtolower($row['name']);
				$row['setNameLC'] = strtolower($row['setName']);
				$row['localId'] = $this->nextLocalItemID;
				++$this->nextLocalItemID;
				
				$arrayData[] = $row;
			}
		}
		
		if ($this->loadAccountEquipSlots())
		{
			$arrayCopy = $this->characterData['accountEquipSlots'];
			$arrayData = array_merge($arrayData, $arrayCopy);	
		}
	
		$arrayData = $this->combineInventory($arrayData);
		usort($arrayData, compareInventoryByName);
		$this->characterData['accountInventory'] = $arrayData;
		return true;
	}
	
	
	public function loadAccountEquipSlots()
	{
		$accountName = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		
		$query = "SELECT * FROM equipSlots WHERE account=\"$accountName\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === FALSE) return $this->reportError("Failed to load equipSlots data for account $accountName!");
		
		$result->data_seek(0);
		$arrayData = array();
		
		while (($row = $result->fetch_assoc()))
		{
			if ($row['itemLink'] != "")
			{
				$row['qnt'] = 1;
				$row['junk'] = 0;
				$row['consumable'] = 0;
				$row['invType'] = "AccountEquipSlot";
				$row['nameLC'] = strtolower($row['name']);
				$row['setNameLC'] = strtolower($row['setName']);
				$row['localId'] = $this->nextLocalItemID;
				++$this->nextLocalItemID;
				
				$arrayData[] = $row;
			}
		}
		
		$this->characterData['accountEquipSlots'] = $arrayData;
		
		return true;
	}
	
	
	public function loadAccountCharacters()
	{
		return True;
	}
	
	
	public function loadCharacterAccountCurrency(&$arrayData)
	{
		
		$arrayData['AccountGold'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountGold",
				"value" => (string) $this->accountGold,
		);
		
		$arrayData['AccountTelvarStones'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountTelvarStones",
				"value" => (string) $this->accountTelvar,
		);
		
		$arrayData['AccountWritVoucher'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountWritVoucher",
				"value" => (string) $this->accountWritVoucher,
		);
		
		$arrayData['AccountAlliancePoints'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountAlliancePoints",
				"value" => (string) $this->accountAP,
		);
		
		return True;
	}
	
	
	public function loadCharacterAccountInventorySpace(&$arrayData)
	{
	
		$arrayData['AccountUsedSpace'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountUsedSpace",
				"value" => (string) $this->accountUsedSpace,
		);
	
		$arrayData['AccountTotalSpace'] = array(
				"id" => -1,
				"characterId" => $this->characterId,
				"name" => "AccountTotalSpace",
				"value" => (string) $this->accountTotalSpace,
		);
	
		return True;
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
			else if ($table == "inventory")
			{
				if ($row['itemLink'] == "")
				{
						/* Skip data */
				}
				else
				{
					$row['invType'] = "Inventory";
					$row['localId'] = $this->nextLocalItemID;
					$row['nameLC'] = strtolower($row['name']);
					$row['setNameLC'] = strtolower($row['setName']);
					++$this->nextLocalItemID;
					$arrayData[] = $row;
				}
			}
			else
			{
				$arrayData[$row['name']] = $row;
			}
		}
		
		if ($table == "inventory")
		{
			if ($this->combineInventoryItems) $arrayData = $this->combineInventory($arrayData);
			usort($arrayData, compareInventoryByName);
		}
		else if ($table == "stats")
		{
			$this->loadCharacterAccountCurrency($arrayData);
			$this->loadCharacterAccountInventorySpace($arrayData);
			ksort($arrayData);
		}
		else
		{
			ksort($arrayData);
		}
		
		$this->characterData[$table] = $arrayData;
		
		return true;
	}
	
	
	public function loadAccountStats()
	{
		$charIds = array();
		
		foreach ($this->buildData as $build)
		{
			$charIds[] = $build['id'];	
		}
		
		if (count($charIds) == 0) return false;
		
		$this->lastQuery = "SELECT * FROM stats WHERE characterId IN (" . implode(",", $charIds) . ");";
		$result = $this->db->query($this->lastQuery);
		if ($result === FALSE) return $this->reportError("Failed to load stats data for account $accountName!");
		
		$result->data_seek(0);
		$this->accountStats = array();
		$count = 0;
		
		while (($row = $result->fetch_assoc()))
		{
			++$count;
			$charId = intval($row['characterId']);
			if ($this->accountStats[$charId] === null) $this->accountStats[$charId] = array();
			$this->accountStats[$charId][$row['name']] = $row;
		}
		
		return true;
	}
	
	
	public function loadAccountBuffs()
	{
		$charIds = array();
	
		foreach ($this->buildData as $build)
		{
			$charIds[] = $build['id'];
		}
	
		if (count($charIds) == 0) return false;
	
		$this->lastQuery = "SELECT * FROM buffs WHERE characterId IN (" . implode(",", $charIds) . ");";
		$result = $this->db->query($this->lastQuery);
		if ($result === FALSE) return $this->reportError("Failed to load buffs data for account $accountName!");
	
		$result->data_seek(0);
		$this->accountBuffs = array();
		$count = 0;
	
		while (($row = $result->fetch_assoc()))
		{
			++$count;
			$charId = intval($row['characterId']);
			if ($this->accountBuffs[$charId] === null) $this->accountBuffs[$charId] = array();
			$this->accountBuffs[$charId][$row['name']] = $row;
		}
	
		return true;
	}
	
	
	public function combineInventory($itemData)
	{
		$newItemData = array();
		
		usort($itemData, compareInventoryByItemLink);
		$lastItemLink = "";
		
		foreach ($itemData as $key => $item)
		{
			$itemLink = $item['itemLink'];
			
			if ($itemLink == $lastItemLink)
			{
				$lastIndex = count($newItemData) - 1;
				$newItemData[$lastIndex]['stacks'] += 1;
				$newItemData[$lastIndex]['qnt'] += intval($item['qnt']);
				$newItemData[$lastIndex]['characterIds'][] = $item['characterId'];
				$newItemData[$lastIndex]['characterQnts'][] = intval($item['qnt']);
			}
			else
			{
				$newItemData[] = $item;
				$lastIndex = count($newItemData) - 1;
				$newItemData[$lastIndex]['stacks'] = 1;
				$newItemData[$lastIndex]['characterIds'] = array($item['characterId']);
				$newItemData[$lastIndex]['characterQnts'] = array(intval($item['qnt']));
			}
			
			$lastItemLink = $itemLink;
		}		
		
		return $newItemData;
	}
	
	
	public function getEditButtonsHtml()
	{
		if (!$this->canWikiUserCreate()) return ""; 

		$buildId = $this->characterId;
		
		$output = "";
		$output .= "<form method='get' id='ecdMenuEditForm' action='/wiki/Special:EsoBuildEditor'>";
		$output .= "<input type='hidden' name='id' value ='$buildId'>";
				
		if ($this->canWikiUserEdit())
			$output .= "<input type='submit' value='Edit Build'>";
		else
			$output .= "<input type='submit' value='Create Copy'>";
					
		$output .= "</form>";
						
		return $output;
	}
	
	
	public function getSkillPointDisplay()
	{
		//if ($this->getCharStatField('SkillPointsUnused') == "" || $this->getCharStatField('SkillPointsTotal') == "") return "none";
		return "inline-block";
	}

	
	public function getSkyshardDisplay()
	{
		//if ($this->getCharStatField('SkyShards') == "") return "none";
		return "inline-block";
	}
	
	
	public function getCharRawLevel()
	{
		$level1 = $this->getCharField('level');
		
		$level2 = $this->getCharStatField('Level');
		$cp = $this->getCharField('Level');
		
		if ($level2 != "")
		{
			if ($level2 == 50) 
			{
				$level2 = 50 + intval($cp/100);
				if ($level2 > 66) $level2 = 66;
			}
			
			return $level2;
		}
		
		return $level1;
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
					'{level}' => $this->formatCharacterLevel($this->getCharRawLevel()),
					'{alliance}' => strtoupper($this->getCharStatField('Alliance')),
					'{allianceRank}' => $this->getCharStatField('AllianceRank'),
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
					'{action31}' => $this->getCharActionHtml(3, 1),
					'{action32}' => $this->getCharActionHtml(3, 2),
					'{action33}' => $this->getCharActionHtml(3, 3),
					'{action34}' => $this->getCharActionHtml(3, 4),
					'{action35}' => $this->getCharActionHtml(3, 5),
					'{action36}' => $this->getCharActionHtml(3, 6),
					'{action41}' => $this->getCharActionHtml(4, 1),
					'{action42}' => $this->getCharActionHtml(4, 2),
					'{action43}' => $this->getCharActionHtml(4, 3),
					'{action44}' => $this->getCharActionHtml(4, 4),
					'{action45}' => $this->getCharActionHtml(4, 5),
					'{action46}' => $this->getCharActionHtml(4, 6),
					'{actionBarTitle1}' => $this->getActionBarTitle(1),
					'{actionBarTitle2}' => $this->getActionBarTitle(2),
					'{actionBarTitle3}' => $this->getActionBarTitle(3),
					'{actionBarTitle4}' => $this->getActionBarTitle(4),
					'{activeBarIndex1}' => $this->getActionBarIndex(1),
					'{activeBarIndex2}' => $this->getActionBarIndex(2),
					'{activeBarIndex3}' => $this->getActionBarIndex(3),
					'{activeBarIndex4}' => $this->getActionBarIndex(4),
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
					'{equipPoison1}' => $this->getCharEquipSlotHtml(13),
					'{equipPoison2}' => $this->getCharEquipSlotHtml(14),
					'{buffs}' => $this->getCharBuffsHtml(),
					'{skyshards}' => $this->getCharStatField('SkyShards', 0),
					'{skillPointDisplay}' => $this->getSkillPointDisplay(),
					'{skyshardDisplay}' => $this->getSkyshardDisplay(),
					'{skillPointsUnused}' => $this->getCharStatField('SkillPointsUnused', 0),
					'{skillPointsTotal}' => $this->getCharStatField('SkillPointsTotal', 0),
					'{skillTree}' => $this->getCharSkillTreeHtml(),
					'{skillContents}' => $this->getCharSkillContentHtml(),
					'{skillContentTitle}' => $this->skillTreeFirstName,
					'{rawLink}' => $this->getCharacterLink($this->characterId, true),
					'{createDate}' => $this->getCharCreateDate(),
					'{editDateNote}' => $this->getCharEditDateNote(),
					'{figureImage}' => $this->getCharFigureImageUrl(),
					'{baseResourceUrl}' => $this->baseResourceUrl,
					'{activeWeaponClass1}' => $this->getActiveWeaponBarClass(1),
					'{activeWeaponClass2}' => $this->getActiveWeaponBarClass(2),
					'{activeBarClass1}' => $this->getActiveAbilityBarClass(1),
					'{activeBarClass2}' => $this->getActiveAbilityBarClass(2),
					'{activeBarClass3}' => $this->getActiveAbilityBarClass(3),
					'{activeBarClass4}' => $this->getActiveAbilityBarClass(4),
					'{trail}' => $this->getBreadcrumbTrailHtml(),
					'{characterLink}' => $this->getShortCharacterLinkHtml(),
					'{inventoryContents}' => $this->getInventoryContentHtml(),
					'{bankContents}' => $this->getBankContentHtml(),
					'{craftBagContents}' => $this->getCraftBagContentHtml(),
					'{accountInvContents}' => $this->getAccountInvContentHtml(),
					'{allInventoryJS}' => $this->getAllInventoryJS(),
					'{characterNamesJS}' => $this->getCharacterNamesJS(),
					'{invGold}' => $this->getInventoryGold(),
					'{invVoucher}' => $this->getInventoryWritVoucher(),
					'{bankGold}' => $this->getBankGold(),
					'{accInvGold}' => $this->getAccountInventoryGold(),
					'{invAP}' => $this->getInventoryAP(),
					'{bankAP}' => $this->getBankAP(),
					'{accInvAP}' => $this->getAccountInventoryAP(),
					'{invTelvar}' => $this->getInventoryTelvar(),
					'{bankTelvar}' => $this->getBankTelvar(),
					'{accInvTelvar}' => $this->getAccountInventoryTelvar(),
					'{accInvVoucher}' => $this->getAccountInventoryWritVoucher(),
					'{invUsedSpace}' => $this->getInventoryUsedSpace(),
					'{invTotalSpace}' => $this->getInventoryTotalSpace(),
					'{bankUsedSpace}' => $this->getBankUsedSpace(),
					'{bankTotalSpace}' => $this->getBankTotalSpace(),
					'{accInvUsedSpace}' => $this->getAccountInventoryUsedSpace(),
					'{accInvTotalSpace}' => $this->getAccountInventoryTotalSpace(),
					'{editButtons}' => $this->getEditButtonsHtml(),
					'{achievementContents}' => $this->getAchievementContentHtml(),
					'{achievementTree}' => $this->getAchievementTreeHtml(),				
			);
		
		$this->outputHtml .= strtr($this->htmlTemplate, $replacePairs);
		
		return true;
	}
	
	
	public function getAchievementContentHtml() { return ""; }
	public function getAchievementTreeHtml() { return ""; }	
	
	public function getInventoryUsedSpace() { return ""; }
	public function getInventoryTotalSpace() { return ""; }
	public function getBankUsedSpace() { return ""; }
	public function getBankTotalSpace() { return ""; }
	public function getAccountInventoryUsedSpace() { return ""; }
	public function getAccountInventoryTotalSpace() { return ""; }
	
	public function getInventoryGold() { return ""; }
	public function getBankGold() { return ""; }
	public function getAccountInventoryGold() { return ""; }
	public function getInventoryAP() { return ""; }
	public function getBankAP() { return ""; }
	public function getAccountInventoryAP() { return ""; }
	public function getInventoryTelvar() { return ""; }
	public function getInventoryWritVoucher() { return ""; }
	public function getBankTelvar() { return ""; }
	public function getAccountInventoryTelvar() { return ""; }
	public function getAccountInventoryWritVoucher() { return ""; }
	
	
	public function getCharacterNamesJS()
	{
		$charNames = array();
		
		$charNames[-1] = "Bank";
		$charNames[-2] = "Craft Bag";
		
		foreach ($this->accountCharacters as $charId => $charData)
		{
			$charNames[$charId] = $charData['name'];
		}
		
		return json_encode($charNames);
	}
	

	public function getAllInventoryJS()
	{
		return "";
	}
	
	
	public function getInventoryContentHtml()
	{
		return "";
	}
	
	
	public function getBankContentHtml()
	{
		return "";
	}
	
	
	public function getCraftBagContentHtml()
	{
		return "";
	}
	
	
	public function getAccountInvContentHtml()
	{
		return "";
	}
	
	
	public function getShortCharacterLinkHtml()
	{
		$output = "";
		$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
		
		if ($this->characterId <= 0)
		{
			$charLink = $this->ESO_SHORT_LINK_URL . "b/" . $this->characterId;
			$output .= " <a href='$charLink' class='ecdShortCharLink'>Link to Build</a>";
		}
		
		$output .= "<a href='//esobuilds.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		return $output;
	}
	
	
	public function getOptionHtml($value, $inputValue)
	{
		$select = "";
		if ($value == $inputValue) $select = "selected";
		return "<option value='$value' $select>$value</option>";
	}
	
	
	public function isViewingAllBuilds()
	{
		//if ($this->viewMyBuilds && $this->wikiContext != null) return false;
		
		if ($this->inputSearch != "") return false;
		if ($this->inputSearchClass != "") return false;
		if ($this->inputSearchRace != "") return false;
		if ($this->inputSearchBuildType != "") return false;
		if ($this->inputSearchSpecial != "") return false;
		
		return true;
	}
	
	
	public function getBreadcrumbTrailHtml()
	{
		$output = "<div id='ecdTrail'>";
		
		$baseLink = $this->getBuildLink();
		$myLink = $baseLink . "?filter=mine";
		$charLink = $this->getCharacterLink($this->characterId);
		$canViewMyBuilds = $this->wikiContext != null;
		$searchText = $this->escape($this->inputSearch);
		
		$search  = "<br/><form method='GET' action='' id='ecdSearchForm'>";
		$search .= "	<div class='ecdSearchLabel'>Text</div>";
		$search .= "	<input name='findbuild' id='ecdSearchText' type='text' size='25' value='$searchText'>";
		$search .= "	<div class='ecdSearchLabel'>Class</div>";
		$search .= "	<select name='findclass' id='ecdSearchClass'>";
		$search .= $this->getOptionHtml("", $this->inputSearchClass);
		$search .= $this->getOptionHtml("Dragonknight", $this->inputSearchClass);
		$search .= $this->getOptionHtml("Nightblade", $this->inputSearchClass);
		$search .= $this->getOptionHtml("Sorcerer", $this->inputSearchClass);
		$search .= $this->getOptionHtml("Templar", $this->inputSearchClass);
		$search .= "	</select>";
		$search .= "	<div class='ecdSearchLabel'>Race</div>";
		$search .= "	<select name='findrace' id='ecdSearchRace'>";
		$search .= $this->getOptionHtml("", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Argonian", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Breton", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Dark Elf", $this->inputSearchRace);
		$search .= $this->getOptionHtml("High Elf", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Imperial", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Khajiit", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Nord", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Orc", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Redguard", $this->inputSearchRace);
		$search .= $this->getOptionHtml("Wood Elf", $this->inputSearchRace);
		$search .= "	</select>";
		$search .= "	<div class='ecdSearchLabel'>Build Type</div>";
		$search .= "	<select name='findbuildtype' id='ecdSearchBuildType'>";
		$search .= $this->getOptionHtml("", $this->inputSearchBuildType);
		$search .= $this->getOptionHtml("Magicka", $this->inputSearchBuildType);
		$search .= $this->getOptionHtml("Stamina", $this->inputSearchBuildType);
		$search .= $this->getOptionHtml("Other", $this->inputSearchBuildType);
		$search .= "	</select>";
		$search .= "	<div class='ecdSearchLabel'>Special</div>";
		$search .= "	<select name='findspecial' id='ecdSearchSpecial'>";
		$search .= $this->getOptionHtml("", $this->inputSearchSpecial);
		$search .= $this->getOptionHtml("Vampire", $this->inputSearchSpecial);
		$search .= $this->getOptionHtml("Werewolf", $this->inputSearchSpecial);
		$search .= "	</select>";
		if ($this->viewMyBuilds) $search .= "	<input type='hidden' name='filter' value='mine'>";
		$search .= "	<input type='submit' id='ecdSearchButton' value='Find Builds'>";
		$search .= "</form>";
		
		if ($this->characterId > 0)
		{
			if ($this->viewRawData)
			{
				$output .= "<a href='$baseLink'>&laquo; View All Builds</a>";
				if ($canViewMyBuilds) $output .= " : <a href='$myLink'>View My Builds</a>";
				$output .= " : <a href='$charLink'>View Normal Build</a>";
			}
			else
			{
				$output .= "<a href='$baseLink'>&laquo; View All Builds</a>";
				if ($canViewMyBuilds) $output .= " : <a href='$myLink'>View My Builds</a>";
			}
		}
		else if (!$this->isViewingAllBuilds())
		{
			$output .= "<a href='$baseLink'>&laquo; View All Builds</a>";
			if ($canViewMyBuilds) $output .= " : <a href='$myLink'>View My Builds</a>";
			$output .= " : $search";
			$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			$output .= "<a href='//esobuilds.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
		else if ($this->viewMyBuilds && $canViewMyBuilds)
		{
			$output .= "<a href='$baseLink'>&laquo; View All Builds</a>";
			$output .= " : <b>Viewing My Builds</b>";
			$output .= " : $search";
			$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			$output .= "<a href='//esobuilds.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
		else
		{
			$output .= "<b>Viewing All Builds</b>";
			if ($canViewMyBuilds) $output .= " : <a href='$myLink'>View My Builds</a>";
			$output .= " : $search";
			$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			$output .= "<a href='//esobuilds.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getActiveAbilityBarClass($barIndex)
	{
		$activeBarIndex = intval($this->getCharStatField('ActiveAbilityBar'));
		if ($activeBarIndex == $barIndex) return "ecdActiveAbilityBar";
		
		if ($barIndex == 3)	
		{
				/* Handle old stats data that held both Werewolf and Overload skills in bar3 */
			if ($this->characterData['special'] == "Werewolf")
			{
				if ($this->getCharStatField('Bar4:Health') == "") return "";
			}
			
			if ($this->characterData['class'] != "Sorcerer") return "ecdHiddenAbilityBar";
			return "";
		}
		else if ($barIndex == 4)
		{
			if ($this->characterData['special'] != "Werewolf") return "ecdHiddenAbilityBar";
			if ($this->getCharStatField('Bar4:Health') == "") return "ecdHiddenAbilityBar";
			return "";
		}
		
		return "";
	}
	
	
	public function getActionBarTitle($barIndex)
	{
		if ($barIndex == 1) return "Bar 1";
		if ($barIndex == 2) return "Bar 2";
		
		if ($barIndex == 3) 
		{
			if ($this->characterData['special'] == "Werewolf")
			{
				if ($this->getCharStatField('Bar4:Health') == "") return "Werewolf";
			}
			
			return "Overload";
		}
		
		if ($barIndex == 4)
		{
			return "Werewolf";
		}
		
		return "Bar $barIndex";
	}
	
	
	public function getActionBarIndex($barIndex)
	{
		if ($barIndex == 1) return "1";
		if ($barIndex == 2) return "2";
		
		if ($barIndex == 3)
		{
			return $this->getCharStatField('Bar3:ActiveWeaponBar', "-1");
		}
		
		if ($barIndex == 4)
		{
			return $this->getCharStatField('Bar4:ActiveWeaponBar', "-1");
		}
		
		return "$barIndex";
	}
	
	
	public function getActiveWeaponBarClass($barIndex)
	{
		$activeBarIndex = intval($this->getCharStatField('ActiveWeaponBar'));
		if ($activeBarIndex == 0) $activeBarIndex = intval($this->getCharStatField('ActiveAbilityBar'));
		if ($activeBarIndex == $barIndex) return "ecdActiveAbilityBar";
		return "";
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
		
		return $this->baseResourceUrl . $output;
	}
	
	
	public function getCharEditDateNote()
	{
		if ($this->isEditted())
			$output = "Character data Edited on " . $this->getCharEditDate();
		else 
			$output = "Character data Exported on " . $this->getCharCreateDate();
		
		return $output;
	}
	
	
	public function getCharCreateDate()
	{
		$tz = 'America/Montreal';
		$timestamp = $this->getCharField('createTime');
		$dt = new DateTime("now", new DateTimeZone($tz));
		$dt->setTimestamp($timestamp);
		$output = $dt->format('Y-m-d H:i:s');
		
		return $output;
	}
	
	
	public function getCharEditDate()
	{
		return $this->getCharField('editTimestamp');
	}
	
	
	public function isEditted()
	{
		$time = strtotime($this->getCharField('editTimestamp'));
		return ($time > 0);
	}
	
	
	public function getBuildCreateDate($buildData)
	{
		$timestamp = $buildData['createTime'];
		if ($timestamp == null) return "";
		
		$tz = 'America/Montreal';
		$dt = new DateTime("now", new DateTimeZone($tz));
		$dt->setTimestamp($timestamp);
		$output = $dt->format('Y-m-d H:i:s');
	
		return $output;
	}
	
	
	public function getBuildEditDate($buildData)
	{
		$editTime = $buildData['editTimestamp'];
		if ($editTime == null) return "";
		
		return $editTime;
	}
	
	
	public function isBuildEditted($buildData)
	{
		$editTime = $buildData['editTimestamp'];
		if ($editTime == null) return false;
		
		$time = strtotime($editTime);
		return ($time > 0);
	}
	
	
	public function getCharSkillContentHtml()
	{
		$output = "";
		$this->skillDataDisplay = 'block';
		
		foreach($this->skillData as $name => &$data)
		{
			if ($name[0] != "_")
			{
				$output .= $this->getCharSkillContentHtml1($name, $data);
			}	
		}
		
		if ($this->hasResearchOutput)
		{
			$output .= $this->getCharSkillMotifContentHtml();
			$output .= $this->getCharSkillResearchContentHtml();
		}
		
		if ($this->hasRecipeOutput) $output .= $this->getCharSkillRecipeContentHtml();
		
		$output .= $this->getCharSkillRidingContentHtml();
	
		return $output;
	}
	
	
	public function getCharSkillResearchContentHtml()
	{
		$output  = "<div id='ecdSkill_Research' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div id='ecdSkillContentTitle'>Crafting Research</div>";
		
		$output .= $this->getResearchContentHtml("Blacksmithing");
		$output .= $this->getResearchContentHtml("Clothier");
		$output .= $this->getResearchContentHtml("Woodworking");
		
		$output .= "</div>\n";
		return $output;
	}
	
	
	public function getResearchContentHtml($craftType)
	{
		$knownCount = $this->getCharStatField("Research:$craftType:Trait:Known");
		$totalCount = $this->getCharStatField("Research:$craftType:Trait:Total");
				
		$output = "";
		
		$prefix = "Research:$craftType";
		$openSlots = $this->getCharStatField("$prefix:Open");
		$timeStamp = $this->getCharStatField("Research:Timestamp");
		
		$researchTimes = array();
		$researchTraits = array();
		$researchItems = array();
		$extraTraits = array();
		
		for ($i = 1; $i <= 3; ++$i)
		{
			$researchTraits[] = $this->getCharStatField("$prefix:Trait$i");
			$researchTimes[]  = $this->getCharStatField("$prefix:Time$i");
			$researchItems[]  = $this->getCharStatField("$prefix:Item$i");
		}
		
		foreach ($researchTimes as $i => $time)
		{
			$trait = $researchTraits[$i];
			$item  = $researchItems[$i];
			
			if ($time == "" || $trait == "" || $item == "") continue;
			
			$finishTime = intval($time) + intval($timeStamp);
			$timeLeft   = intval($time) + intval($timeStamp) - time();
			//$formatDate = date('M j \a\t H:i:s', $finishTime);  // Will output in UTC 
			
			$days = floor($timeLeft / 3600 / 24);
			$hours = floor($timeLeft / 3600) % 24;
			$minutes = floor($timeLeft / 60) % 60;
			$seconds = $timeLeft % 60;
			$timeFmt = "";
				
			if ($days > 1)
				$timeFmt = sprintf("%d days %02d:%02d:%02d", $days, $hours, $minutes, $seconds);
			else if ($days > 0)
				$timeFmt = sprintf("%d day %02d:%02d:%02d", $days, $hours, minutes, $seconds);
			else
				$timeFmt = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
			
			$output .= "<div class='ecdResearchItem'>\n";
			
			if ($timeLeft <= 0)
			{
				++$openSlots;
				++$knownCount;
				$output .= "$trait $item research is finished!";
				$extraTraits[$item] = $trait;
			}			
			else
			{
				$output .= "$trait $item finishes in $timeFmt";
			}
			
			$output .= "</div>\n";
		}
		
		if ($openSlots > 0)
		{
			$output .= "<div class='ecdResearchItem'>\n";
			$output .= "$openSlots research slots available";
			$output .= "</div>\n";
		}
		
		$output .= "<hr width='95%' />";
		//$output .= $this->getResearchTraitContentHtml($craftType, $extraTraits);
		$output .= $this->getResearchTraitTableHtml($craftType, $extraTraits);
		$output .= "</div>\n";
		
		$output = "<div class='ecdResearchTitle'>$craftType ($knownCount / $totalCount Traits)</div> <div class='ecdResearchBlock'>" . $output;
		
		return $output;
	}

	
	public function FormatResearchTime($time, $timeStamp)
	{
		$finishTime = intval($time) + intval($timeStamp);
		$timeLeft   = intval($time) + intval($timeStamp) - time();
			
		$days = floor($timeLeft / 3600 / 24);
		$hours = floor($timeLeft / 3600) % 24;
		$minutes = floor($timeLeft / 60) % 60;
		$seconds = $timeLeft % 60;
		$timeFmt = "";
		
		if ($days > 1)
			$timeFmt = sprintf("%d days %02d:%02d:%02d", $days, $hours, $minutes, $seconds);
		else if ($days > 0)
			$timeFmt = sprintf("%d day %02d:%02d:%02d", $days, $hours, minutes, $seconds);
		else
			$timeFmt = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
						
		$output = "<div class='ecdResearchItem'>\n";
						
		if ($timeLeft <= 0)
		{
			$output = "research is finished!";
		}
		else
		{
			$output = "finishes in $timeFmt";
		}
		
		return $output;
	}
	
	
	public function getResearchTraitTableHtml($craftType, $extraTraits)
	{
		$output = "";
		$totalCount = 0;
		$knownCount = 0;
		$armorTraits = array();
		$weaponTraits = array();
		$prefix = "Research:$craftType";
		$timestamp = $this->getCharStatField("Research:Timestamp");
		$research = array();
		$knownCounts = array();
		
		for ($i = 1; $i <= 3; ++$i)
		{
			$trait = $this->getCharStatField("$prefix:Trait$i");
			$time = $this->getCharStatField("$prefix:Time$i");
			$item = $this->getCharStatField("$prefix:Item$i");
			
			if ($research[$item] == null) $research[$item] = array();
			$research[$item][$trait] = $time;
		}
		
		foreach ($this->characterData['stats'] as $key => $value)
		{
			$matches = array();
			$result = preg_match("/^Research:$craftType:Trait:([a-zA-Z\ _0-9&]*)$/", $key, $matches);
			if ($result == 0) continue;
				
			$slotName = $matches[1];
			$rawData = $value["value"];
				
			if ($slotName == "Known")
			{
				$knownCount = intval($rawData);
				continue;
			}
			else if ($slotName == "Total")
			{
				$totalCount = intval($rawData);
				continue;
			}
				
			$tooltip = "";
			$extraClass = "";
			$totalTraits = 9;
			$unknownTraits = "";
			$knownTraitCount = 0;
				
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Unknown"];
			if ($stat && $stat['value']) $unknownTraits = $stat['value'];
				
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Total"];
			if ($stat && $stat['value']) $totalTraits = intval($stat['value']);
				
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Known"];
			if ($stat && $stat['value']) $knownTraitCount = intval($stat['value']);
				
			if ($extraTraits && $extraTraits[$slotName])
			{
				if ($knownTraitCount <= 0)
				{
					$knownTraitCount = 1;
					$rawData = $extraTraits[$slotName] . " (1/9)";
				}
				else if ($knownTraitCount == $totalTraits - 1)
				{
					$knownTraitCount = $totalTraits;
					$rawData = "All traits known";
				}
				else
				{
					++$knownTraitCount;
					$rawData = preg_replace_callback("# \(([0-9]+)/([0-9]+)\)#", function ($matches) {
							$count = intval($matches[1]) + 1;
							return " ($count/{$matches[2]})";
						}, $rawData);
					$rawData = str_replace($extraTraits[$slotName], "[" . $extraTraits[$slotName]."]", $rawData);
				}
			}
			
			$knownCounts[$slotName] = $knownTraitCount;
			$rawData = preg_replace("#[ ]*\(.*\)#", "", $rawData);
			$traits = preg_split("#[, ]+#", $rawData, 0, PREG_SPLIT_NO_EMPTY);
			
			if (self::$WEAPONS[$slotName])
			{
				$weaponTraits[$slotName] = array();
				
				$value = 0;
				if ($knownTraitCount == $totalTraits) $value = 1;
				
				foreach (self::$WEAPON_TRAITS as $trait)
				{
					$weaponTraits[$slotName][$trait] = $value;
				}
				
				foreach ($traits as $trait)
				{
					if (preg_match("#\[([a-zA-Z 0-9\&\-]+)\]#", $trait, $matches))
					{
						$weaponTraits[$slotName][$matches[1]] = 2;
						$trait = $matches[1];
					}
					else
					{						
						$weaponTraits[$slotName][$trait] = 1;
					}
				}
			}
			else
			{
				$armorTraits[$slotName] = array();
				
				$value = 0;
				if ($knownTraitCount == $totalTraits) $value = 1;
				
				foreach (self::$ARMOR_TRAITS as $trait)
				{
					$armorTraits[$slotName][$trait] = $value;
				}
				
				foreach ($traits as $trait)
				{
					if (preg_match("#\[([a-zA-Z 0-9\&\-]+)\]#", $trait, $matches))
					{
						$armorTraits[$slotName][$matches[1]] = 2;
						$trait = $matches[1];
					}
					else
					{
						$armorTraits[$slotName][$trait] = 1;
					}
				}
			}			
		}
		
		if (count($armorTraits) > 0)
		{
			$output .= "<table class='ecdSkillResearchTable'>";
			$output .= "<tr><td></td>";
			
			foreach (self::$ARMOR_TRAITS as $trait)
			{
				$trait = str_replace("-fitted", "-Fitted", $trait);
				$output .= "<th><div class='ecdSkillRotateHeader'>$trait</div></th>";	
			}
			
			$output .= "<th></th></tr>";
			
			foreach ($armorTraits as $slot => $slotTraits)
			{
				$output .= "<tr>";
				$output .= "<td>$slot</td>";
								
				foreach (self::$ARMOR_TRAITS as $trait)
				{
					$value = "";
					$researchNote = "";
					
					if ($slotTraits[$trait] == 1)
					{
						$value = "X";
					}
					else if ($slotTraits[$trait] == 2)
					{
						$value = "?";
						
						if ($research[$slot] != null && $research[$slot][$trait] != null)
						{
							$researchNote = " : " . $this->FormatResearchTime($research[$slot][$trait], $timestamp);
						}
					}
					
					$output .= "<td title='$trait$researchNote'>$value</td>";
				}
				
				$output .= "<td>{$knownCounts[$slot]}/9</td>";
				$output .= "</tr>";
			}
			
			$output .= "</table>";
		}
		
		if (count($weaponTraits) > 0)
		{
			$output .= "<table class='ecdSkillResearchTable'>";
			$output .= "<tr><td></td>";
				
			foreach (self::$WEAPON_TRAITS as $trait)
			{
				$output .= "<th><div class='ecdSkillRotateHeader'>$trait</div></th>";
			}
				
			$output .= "</tr>";
				
			foreach ($weaponTraits as $slot => $slotTraits)
			{
				$output .= "<tr>";
				$output .= "<td>$slot</td>";
						
				foreach (self::$WEAPON_TRAITS as $trait)
				{
					$value = "";
					$researchNote = "";
					
					if ($slotTraits[$trait] == 1)
					{
						$value = "X";
					}
					else if ($slotTraits[$trait] == 2)
					{
						$value = "?";
						
						if ($research[$slot] != null && $research[$slot][$trait] != null)
						{
							$researchNote = " : " . $this->FormatResearchTime($research[$slot][$trait], $timestamp);
						}
					}
					
					$output .= "<td title='$trait$researchNote'>$value</td>";
				}
				
				$output .= "<td>{$knownCounts[$slot]}/9</td>";
				$output .= "</tr>";
			}
				
			$output .= "</table><p/>";
		}
		
		return $output;
	}
	
	public function getResearchTraitContentHtml($craftType, $extraTraits)
	{
		$output = "";
		$totalCount = 0;
		$knownCount = 0;
		
		foreach ($this->characterData['stats'] as $key => $value)
		{
			$matches = array();
			$result = preg_match("/^Research:$craftType:Trait:([a-zA-Z\ _0-9&]*)$/", $key, $matches);
			if ($result == 0) continue;
			
			$slotName = $matches[1];
			$rawData = $value["value"];
			
			if ($slotName == "Known")
			{
				$knownCount = intval($rawData);
				continue;
			}
			else if ($slotName == "Total") 
			{
				$totalCount = intval($rawData);
				continue;
			}
			
			$tooltip = "";
			$extraClass = "";
			$totalTraits = 9;
			$unknownTraits = "";
			$knownTraitCount = 0;
			
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Unknown"];
			if ($stat && $stat['value']) $unknownTraits = $stat['value'];
			
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Total"];
			if ($stat && $stat['value']) $totalTraits = intval($stat['value']);
			
			$stat = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Known"];
			if ($stat && $stat['value']) $knownTraitCount = intval($stat['value']);
			
			if ($extraTraits && $extraTraits[$slotName])
			{
				if ($knownTraitCount <= 0)
				{
					$rawData = $extraTraits[$slotName] . " (1/9)";
				}
				else if ($knownTraitCount == $totalTraits - 1)
				{
					$rawData = "All traits known";
				}
				else 
				{
					$rawData = preg_replace_callback("# \(([0-9]+)/([0-9]+)\)#", function ($matches) {
								$count = intval($matches[1]) + 1;
          					  	return " ($count/{$matches[2]})";
        				}, $rawData);
					$rawData = str_replace($extraTraits[$slotName], "[" . $extraTraits[$slotName]."]", $rawData);
				}
				
				if ($unknownTraits)
				{
					if ($knownTraitCount <= 0)
					{
						$unknownTraits = "All except {$extraTraits[$slotName]} (8/9)";
					}
					else if ($knownTraitCount == $totalTraits - 1)
					{
						$unknownTraits = "";
					}
					else
					{
						$unknownTraits = preg_replace_callback("# \(([0-9]+)/([0-9]+)\)#", function ($matches) {
								$count = intval($matches[1]) - 1;
          					  	return " ($count/{$matches[2]})";
        					}, $unknownTraits );
						$unknownTraits = str_replace($extraTraits[$slotName] . ", ", "", $unknownTraits); 
						$unknownTraits = str_replace(", " . $extraTraits[$slotName], "", $unknownTraits);
						$unknownTraits = str_replace(" [" . $extraTraits[$slotName]."]", "", $unknownTraits);
					}
				}
			}
			
			if ($unknownTraits != "") 
			{
				$tooltip = " tooltip='" . $unknownTraits . "'";
				$extraClass = "ecdTraitTooltip";
			}
			
			$output .= "<div class='ecdResearchTraitItem ecdClickToCopyTooltip $extraClass' $tooltip>";
			$output .= "<div class='ecdTraitTitle'>$slotName:</div>";
			$output .= "$rawData</div>";
		}
		
		//$output .= "<div class='ecdResearchTraitItem'><div class='ecdTraitTitle'>";
		//$output .= "$knownCount of $totalCount traits known";
		//$output .= "</div></div>";
		
		return $output;
	}
	
	
	public function createCharSummaryHtml()
	{
		return "";
	}
	
	
	public function getCharSkillRidingContentHtml()
	{
		$output  = "<div id='ecdSkill_Riding' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div id='ecdSkillContentTitle'>Riding</div>";
		
		$ridingInv = intval($this->getCharStatField("RidingInventory", 0));
		$ridingSta = intval($this->getCharStatField("RidingStamina", 0));
		$ridingSpd = intval($this->getCharStatField("RidingSpeeed", 0));
		if ($ridingSpd == 0) $ridingSpd = intval($this->getCharStatField("RidingSpeed", 0));
		$ridingTimeDone = intval($this->getCharStatField("RidingTrainingDone", -1));
		
		$isFinishedTraining = false;
		if ($ridingInv + $ridingSta + $ridingSpd >= 180) $isFinishedTraining = true;
				
		$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'>$ridingSpd%</div> <img src='{$this->baseResourceUrl}resources/ridingskill_speed.png'> Speed</div>";
		$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'>$ridingSta</div> <img src='{$this->baseResourceUrl}resources/ridingskill_stamina.png'> Stamina</div>";
		$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'>$ridingInv</div> <img src='{$this->baseResourceUrl}resources/ridingskill_capacity.png'> Inventory</div>";
		$output .= "<br/>";
		
		if (!$isFinishedTraining)
		{
			$timeLeft = $ridingTimeDone - time();
			
			if ($ridingTimeDone < 0)
			{
				$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'></div> ?</div>";
			}
			else if ($timeLeft <= 0)
			{
				$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'></div> <img src='{$this->baseResourceUrl}resources/ridingskill_ready.png'>Ready to Train!</div>";
			}
			else
			{
				$hours = floor($timeLeft / 3600) % 24;
				$minutes = floor($timeLeft / 60) % 60;
				$seconds = $timeLeft % 60;
				
				$timeFmt = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
				$output .= "<div class='ecdRidingStat'><div class='ecdRidingValue'>$timeFmt</div> <img src='{$this->baseResourceUrl}resources/timer_64.png'> to Next Training!</div>";
			}
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharRecipeData()
	{
		global $ESO_RECIPELIST_INFO, $ESO_RECIPE_INFO;
		
		$recipes = array();
		
		foreach ($this->characterData['stats'] as $key => $value)
		{
			$matches = array();
			$result = preg_match("/^Recipe:(.*)/", $key, $matches);
			if (!($key == "Recipe" || $result != 0)) continue;
			
			$resultId = -1;
			$recipeId = -1;
			$quality = 1;
			$recipeName = $value['value'];
			$recipeType = "Unknown";
			if ($key != "Recipe") $resultId = intval($matches[1]);
			
			$recipeInfo = $ESO_RECIPE_INFO[$resultId];
			
			if ($recipeInfo != null)
			{
				$recipeId = $recipeInfo[0];
				$recipeType = $recipeInfo[1];
				$quality = $recipeInfo[3];
			}
			
			if ($recipes[$recipeType] == null) $recipes[$recipeType] = array();
			
			if ($resultId > 0)
				$recipes[$recipeType][$resultId] = array('recipe' => $recipeId, 'name' => $recipeName, 'known' => true, 'quality' => $quality);
			else
				$recipes[$recipeType][] = array('recipe' => $recipeId, 'name' => $recipeName, 'known' => true, 'quality' => $quality);			
		}
		
		return $recipes;
	}
	
	
	public function createAllRecipeData($knownRecipes)
	{
		global $ESO_RECIPELIST_INFO, $ESO_RECIPE_INFO;
		
		$recipes = $knownRecipes;
		
		foreach ($ESO_RECIPE_INFO as $resultId => $recipeData)
		{
			$recipeId = intval($recipeData[0]);
			$recipeType = $recipeData[1];
			$recipeName = $recipeData[2];
			$quality = $recipeData[3];
			
			if ($recipes[$recipeType] == null) $recipes[$recipeType] = array();
			
			if ($recipes[$recipeType][$resultId] == null)
			{
				$recipes[$recipeType][$resultId] = array('recipe' => $recipeId, 'name' => $recipeName, 'known' => false, 'quality' => $quality);
			}
		}		
		
		return $recipes;
	}
	
	
	public function SortRecipeListByName($a, $b)
	{
		return strcmp($a['name'], $b['name']);
	}
	
	
	public function getCharSkillRecipeContentHtml()
	{
		global $ESO_RECIPELIST_INFO;
		
		$totalCount = $this->getCharStatField("RecipeTotalCount", 0);
		$knownCount = $this->getCharStatField("RecipeKnownCount", 0);
		
		$output  = "<div id='ecdSkill_Recipes' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div class='ecdSkillRecipesSearchBlock' id='ecdSkillRecipesSearchBlock'>";
		$output .= "<input type='text' size='10' maxlength='32' id='ecdSkillRecipesSearchInput' placeholder='Find Recipes'/>";
		$output .= "<button onclick='OnEsoCharDataSearchRecipe();'>Find...</button>";
		$output .= "</div>";
		$output .= "<div id='ecdSkillContentTitle'>Recipes<small> ($knownCount / $totalCount Known)</small></div>";
		$output .= "<br/>";
		
		$knownRecipes = $this->getCharRecipeData();
		$allRecipes = $this->createAllRecipeData($knownRecipes);
		//$allRecipes = $knownRecipes;
		
		foreach ($ESO_RECIPELIST_INFO as $recipeListIndex => $listInfo)
		{
			$listCount = $listInfo[0];
			$listName = $listInfo[1];
			$listIcon = $listInfo[2];
			$listQuality = $listInfo[3];
			$qualityClass = "";
			$knownCount = 0;
			if ($listQuality >= 1 && $listQuality <= 5) $qualityClass = "ecdItemQuality$listQuality";
			
			if ($allRecipes[$listName] == null) continue;
			
			usort($allRecipes[$listName], array("EsoBuildDataViewer", "SortRecipeListByName"));
			
			foreach ($allRecipes[$listName] as $resultId => $recipeData)
			{
				if ($recipeData['known']) ++$knownCount;
			}
			
			if ($listCount == 0) $listCount = "?";
			$output .= "<div class='ecdRecipeTitle'>$listName ($knownCount / $listCount Known)</div>";
			
			foreach ($allRecipes[$listName] as $resultId => $recipeData)
			{
				$name = $recipeData['name'];
				$known = $recipeData['known'];
				$itemId = $recipeData['recipe'];
				$quality = $recipeData['quality'];
				$extraClass = "";
				if ($known) $extraClass = "ecdRecipeKnown";
				
				if ($quality >= 1 && $quality <= 5) 
					$qualityClass = "ecdItemQuality$quality";
				else
					$qualityClass = "ecdItemQuality$listQuality";
				
				if ($itemId == null || $itemId <= 0) $itemId = $resultId;
				
				$output .= "<div class='ecdRecipeItem eso_item_link $extraClass $qualityClass' itemid='$itemId' inttype='1' intlevel='1'>$name</div>";
			}
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharSkillMotifContentHtml()
	{
		$output  = "<div id='ecdSkill_Motifs' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div id='ecdSkillContentTitle'>Crafting Motifs</div>";
		$output1 = "";
		
		$craftData = array();
		
		foreach ($this->characterData['stats'] as $key => $value)
		{
			$matches = array();
			$result = preg_match("/Crafting:(.*)/", $key, $matches);
			if ($result == 0) continue; 

			$styleName = $matches[1];
			$rawData = $value['value'];
			$rawValues = explode(',', $rawData);
			$styleData = '';
			$unknownChapters = "";
			$knownCount = 0;
			$unknownCount = 14;
			
			if ($styleName == "Akatosh") continue;
			if ($styleName == "Grim Arlequin") $styleName = "Grim Harlequin";
			
			$craftData[$styleName] = array();
			
			if (count($rawValues) > 1)
			{
				$styleArray = array();
				$unknownArray = array();
				
				for ($i = 0; $i < 14; ++$i)
				{
					$name = $this->ESO_MOTIF_CHAPTERNAMES[$i];
					
					if ($rawValues[$i] == 1)
					{
						$styleArray[] = $name;
						$craftData[$styleName][$name] = true;
					}
					else
					{
						$unknownArray[] = $name;
						$craftData[$styleName][$name] = false;
					}					
				}
				
				$styleData = implode(', ', $styleArray);
				$unknownChapters = implode(', ', $unknownArray);
				$unknownCount = count($unknownArray);
				$knownCount = 14 - $unknownCount;
			}
			elseif ($rawData == '1')
			{
				$styleData = 'All Known';
				$knownCount = 14;
				$unknownCount = 0;
								
				foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
				{
					$craftData[$styleName][$name] = true;
				}
			}
			elseif ($rawData == '0')
			{
				$styleData = 'None Known';
				$unknownChapters =  implode(', ', $this->ESO_MOTIF_CHAPTERNAMES);
				$knownCount = 0;
				$unknownCount = 14;
				
				foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
				{
					$craftData[$styleName][$name] = false;
				}
			}
			else
			{
				continue;
			}
			
			$extraClass = "";
			$tooltip = "";
				
			if ($unknownChapters != "")
			{
				$tooltip = " tooltip='" . $unknownChapters . "'";
				$extraClass = "ecdTraitTooltip ecdMotifTooltip";
			}
							
			$output1 .= "<div class='ecdSkillDataBox ecdClickToCopyTooltip $extraClass' $tooltip>\n";
			$output1 .= "<div class='ecdSkillNameCraft'>$styleName:</div>";
			$output1 .= "<div class='ecdSkillValueCraft'>($knownCount/14) $styleData</div>";
			$output1 .= "</div>\n";
		}
		
		$output .= $this->getCharSkillMotifTableHtml($craftData);
		$output .= "<p/><br/>";
		$output .= $output1;
		$output .= "</div>\n";
		return $output;
	}
	
	
	public function getCharSkillMotifTableHtml($craftData)
	{
		$output = "<table class='ecdSkillMotifsTable'>";
		$output .= "<tr><td></td>";
		
		foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
		{
			$output .= "<th><div class='ecdSkillRotateHeader'>$name</div></th>";
		}
		
		foreach ($craftData as $style => $styleData)
		{
			$output .= "<tr>";
			$output .= "<td>$style</td>";
			
			foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
			{
				$isKnown = $styleData[$name];
				
				if ($isKnown) 
					$output .= "<td title='$name'>X</td>";
				else
					$output .= "<td title='$name'></td>";
			}
			
			$output .= "</tr>";
		}
		
		$output .= "</tr>";
		
		$output .= "</table>";
		return $output;
	}
	
	
	public function getCharSkillContentHtml1($skillName, &$skillData)
	{
		$output = "";
		if ($skillData == null || !is_array($skillData)) return $output;
	
		foreach ($skillData as $name => &$data)
		{
			if ($name[0] != "_")
			{
				$output .= $this->getCharSkillContentHtml2($name, $data);
			}
		}
	
		return $output;
	}
	
	
	public function getAccountStatsField ($charId, $stat, $default = '')
	{
		if ($this->accountStats[$charId] === null) return $default;
		if ($this->accountStats[$charId][$stat] === null) return $default;
		if ($this->accountStats[$charId][$stat]['value'] === null) return $default;
		
		return $this->escape($this->accountStats[$charId][$stat]['value']);
	}
	
	
	public function getCharSkillContentHtml2($skillName, &$skillData)
	{
		$safeName = $this->escape($skillName);
		$idName = str_replace("'", '', str_replace(' ', '', $safeName));
		
		$displayType = 'none';
		if ($skillName == $this->skillTreeFirstName) $displayType = "block";
		$output = "<div id='ecdSkill_$idName' class='ecdSkillData ecdScrollContent' style='display: {$displayType};'>\n";
				
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
		
		$skillLine = $this->escape($skillData['_skillLine']);
		$skillLineName = "SkillRank:" . $skillData['_skillType'] . ":" . $skillData['_skillLine'];
		$skillRank = $this->getCharStatField($skillLineName);
		$output .= "<div id='ecdSkillContentTitle'><div class='ecdSkillRank'>$skillRank</div> $skillLine</div><br />";
		
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
		
		$skillLine = $this->escape($skillData['_skillLine']);
		$skillLineName = "ChampionPoints:" . $skillData['_skillLine'] . ":Points";
		$skillRank = $this->getCharStatField($skillLineName);
		$output .= "<div id='ecdSkillContentTitle'><div class='ecdSkillRank'>$skillRank&nbsp;</div> $skillLine</div><br />";
		
		foreach ($skillData as $name => &$data)
		{
			if ($name[0] != "_")
			{
				$output .= $this->getCharSkillContentHtml3CP($name, $data);
			}
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
		
		$safeName = $this->escape($skillData['_baseName']);
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
		
		$safeName = $this->escape($skillData['_baseName']);
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
		$output .= "<img src='{$this->baseResourceUrl}resources/skill_divider.png' class='ecdSkillTooltipDivider' />";
		
		if ($skillType != 'passive')
		{
		
			if ($channelTime > 0) 
			{
				$output .= "<div class='ecdSkillTooltipValue'>$channelTime seconds</div>";
				$output .= "<div class='ecdSkillTooltipName'>Channel Time</div>";
				$castTimeStr = "";
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
			
			$output .= "<img src='{$this->baseResourceUrl}resources/skill_divider.png' class='ecdSkillTooltipDivider' />";
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
		$output .= $this->getCharSkillTreeHtml1("OTHER", $this->skillData['Other']);
		
		return $output;
	}
	
	
	public function getCharSkillTreeHtml1($skillName, &$skillData)
	{
		if ($skillData === null) return "";
		
		$safeName = $this->escape($skillName);
		
		$extraClass = "";
		if ($this->skillTreeDisplay == 'block') $extraClass = " ecdSkillTreeNameHighlight";
		
		$output  = "<div class='ecdSkillTree1'>\n";
		$output .= "<div class='ecdSkillTreeName1$extraClass'>$safeName</div>\n";
		$output .= "<div class='ecdSkillTreeContent1' style='display: {$this->skillTreeDisplay};'>\n";
		
		$this->skillTreeDisplay = 'none';
		
		foreach ($skillData as $name => &$data)
		{
			if ($name[0] != "_")
			{
				$output .= $this->getCharSkillTreeHtml2($name, $data);
			}
		}
		
		if ($skillName == "CRAFT") 
		{
			if ($this->hasResearchOutput)
			{
				$output .= "<div class='ecdSkillTreeName2'>Motifs</div>\n";
				$output .= "<div class='ecdSkillTreeName2'>Research</div>\n";
			}
			
			if ($this->hasRecipeOutput) $output .= "<div class='ecdSkillTreeName2'>Recipes</div>\n";
		}
		else if ($skillName == "OTHER") 
		{
			$output .= "<div class='ecdSkillTreeName2'>Riding</div>\n";
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
		$this->skillData['Other'] = array();
		
		foreach ($this->characterData['skills'] as $skillName => &$skillData)
		{
			$this->parseCharSkill($skillName, $skillData);
		}
		
		foreach ($this->skillData as $skillName => &$skillLineData)
		{
			uksort($skillLineData, 'CompareEsoSkillTypeName');
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
		$newData['_baseName'] = $names[1];
		$this->skillData['ChampionPoints'][$names[0]][$names[1]] = $newData;
		$this->skillData['ChampionPoints'][$names[0]][$names[1]]['_skillLine'] = $names[0];
		$this->skillData['ChampionPoints'][$names[0]]['_skillLine'] = $names[0];
		
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
		$this->skillData[$names[0]][$names[1]][$index]['_baseName']  = $names[2];
		$this->skillData[$names[0]][$names[1]][$index]['_skillLine'] = $names[1];
		$this->skillData[$names[0]][$names[1]][$index]['_skillType'] = $names[0];
		$this->skillData[$names[0]][$names[1]]['_skillLine'] = $names[1];
		$this->skillData[$names[0]][$names[1]]['_skillType'] = $names[0];
		$this->skillData[$names[0]]['_skillType'] = $names[0];
			
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
		$desc = $buff['description'];
		
		if (!$this->checkDisplayBuffName($buffName)) return "";
		
		if ($this->isBuffFoodOrDrink($buffName))
		{
			$foodDesc = $this->convertFoodDrinkDescription($this->getCharStatField('LastFoodEatenDesc'), $this->getCharStatField('LastFoodEatenType'), $this->getCharStatField('LastFoodEatenName'));
			
			if ($foodDesc != "") 
			{
				$safeName = $foodDesc;
				$desc = $this->getCharStatField('LastFoodEatenDesc');
			}
		}
				
		$extraClass = "";
		$tooltip = "";
		
		if ($desc != "")
		{
			$desc = $this->convertDescriptionToText($desc);
			$extraClass = "ecdBuffTooltip";
			$tooltip = " tooltip='$desc'";
		}
		
		$iconUrl = $this->convertIconToImageUrl($rawIcon);
		$output .= "<div class='ecdBuff $extraClass' $tooltip><img src=\"$iconUrl\" title=\"$rawIcon\"/>\n";
		$output .= "<div class='ecdBuffDesc'>$safeName</div>\n";
		$output .= "</div>\n";
		
		return $output;
	}
	
	
	public function convertFoodDrinkDescription($desc, $foodType, $foodName, $useShort = true)
	{
		//Increase Max Magicka by 6048 for 35 minutes.
		//Increase Max Health by 5395 and Max Magicka by 4936 for 1 hour.
		//Increase Max Health by 3936, Max Magicka by 3617, and Max Stamina by 3617 for 2 hours.
		//Increase Health Recovery by 660 for 35 minutes.
		//Increase Health Recovery by 420 and Magicka and Stamina Recovery by 386 for 2 hours.
		//Increase Max Health by 5000 and Stamina Recovery by 457 for 2 hours.
		//Increase Max Health by 3724, Health Recovery by 351 and Stamina and Magicka Recovery by 319 for 2 hours.
			// 3724 Max Health, 351 Health Recovery, 319 Stamina and Magicka Recovery
			// 3724 Health, 351 HR, 319 SR and MR
		
		$newDesc = $this->convertDescriptionToText($this->getCharStatField('LastFoodEatenDesc'));
		
		$buffData = array();
		$matches = array();
		$result = preg_match_all("/([\w ]*?) by ([0-9]*)/", $newDesc, $matches);
		if ($result == 0) return $newDesc;
		
		foreach ($matches[1] as $index => $buffName)
		{
			$buffValue = $matches[2][$index];
	
			$buffName = trim($buffName);
			$buffName = str_replace("Increase ", "", $buffName);
			
			$buffName = preg_replace("/^and /", "", $buffName);
			
			if ($useShort)
			{
				$buffName = str_replace("Max ", "", $buffName);
				
				$nameMatches = array();
				$nameResult = preg_match("/([\w]*) and ([\w]*) Recovery/i", $buffName, $nameMatches);
				if ($nameResult === 1) $buffName = strtoupper($nameMatches[1][0]) . "R and " . strtoupper($nameMatches[2][0]) . "R";
	
				$nameMatches = array();
				$nameResult = preg_match("/([\w]*) Recovery/i", $buffName, $nameMatches);
				if ($nameResult === 1) $buffName = strtoupper($nameMatches[1][0]) . "R";
			}
				
			$buffData[] = $buffValue . " " . $buffName;
		}
		
		$newDesc = "";
		if ($foodType != null && $foodType != "") $newDesc = ucwords($foodType) . ": ";
		$newDesc .= implode(", ", $buffData);

		return $newDesc;
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
			$setCount = $equipSlot['setCount'];
			
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
		
		$output .= "<img src=\"$iconUrl\" class=\"eso_item_link\" itemlink=\"$safeItemLink\" intlevel=\"$itemIntLevel\" inttype=\"$itemIntType\" itemid=\"$itemIntId\" setcount=\"$setCount\"/>";
		
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
				13 => 'resources/gearslot_poison.png',
				14 => 'resources/gearslot_poison.png',
				16 => 'resources/gearslot_hands.png',
				20 => 'resources/gearslot_mainhand.png',
				21 => 'resources/gearslot_offhand.png',
		);
		
		$icon = $IMAGES[$slotIndex];
		if ($icon == null) return "";
		return $this->baseResourceUrl . $icon;
	}
	
	
	public function getCharCriticalFactor()
	{
		$level = $this->characterData['level'];
		if ($level <= 0) return 1;
		
		return 100.0 / (2 * $level * (100 + $level));
	}
	
	
	public function getCharBasicStatsHtml()
	{
		$output  = $this->getCharBasicStatsBarHtml(null);
		$output .= $this->getCharBasicStatsBarHtml(1);
		$output .= $this->getCharBasicStatsBarHtml(2);
		$output .= $this->getCharBasicStatsBarHtml(3);
		$output .= $this->getCharBasicStatsBarHtml(4);
		
		return $output;
	}
	
	
	public function getCharBasicStatsBarHtml($barIndex)
	{
		$baseCrit = 10.0;
		if ($this->getCharStatField("UseZeroBaseCrit") > 0) $baseCrit = 0.0;
		
		$activeBarIndex = intval($this->getCharStatField('ActiveWeaponBar'));
		$prefix = "";
		$display = "block";
		$note = "";
		
		if ($barIndex == null)
		{
			$barIndex = "";
		}
		else
		{
			$display = "none";
			$prefix = "Bar$barIndex:";
			
			if ($this->getCharStatField($prefix."Health") == "") 
			{
				$prefix = "";
				if ($barIndex != $activeBarIndex) $note = "Stats are only correct for bar #$activeBarIndex.";
			}
		}
		
		$output  = "<div class='ecdStatBar$barIndex' style='display: $display;'>";
		
		$output .= $this->getCharBasicStatHtml('Magicka', $prefix.'Magicka');
		$output .= $this->getCharBasicStatHtml('Health', $prefix.'Health');
		$output .= $this->getCharBasicStatHtml('Stamina', $prefix.'Stamina');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Magicka Recovery', $prefix.'MagickaRegenCombat');
		$output .= $this->getCharBasicStatHtml('Health Recovery', $prefix.'HealthRegenCombat');
		$output .= $this->getCharBasicStatHtml('Stamina Recovery', $prefix.'StaminaRegenCombat');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Damage', $prefix.'SpellPower');
		$output .= $this->getCharBasicStatHtml('Spell Critical', $prefix.'SpellCritical', $this->getCharCriticalFactor(), '%', $baseCrit);
		
		$weaponPower = $this->getCharStatField($prefix."WeaponPower");
		$power = $this->getCharStatField($prefix."Power");
		
		if ($power == 0)
			$output .= $this->getCharBasicStatHtml('Weapon Damage', $prefix.'WeaponPower');
		else
			$output .= $this->getCharBasicStatHtml('Weapon Damage', $prefix.'Power');
		
		$output .= $this->getCharBasicStatHtml('Weapon Critical', $prefix.'CriticalStrike', $this->getCharCriticalFactor(), '%', $baseCrit);
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Resistance', $prefix.'SpellResist');
		$output .= $this->getCharBasicStatHtml('Physical Resistance', $prefix.'PhysicalResist');
		$output .= $this->getCharBasicStatHtml('Critical Resistance', $prefix.'CriticalResistance');
		$output .= "<br />";
		$output .= $this->getCharBasicStatHtml('Spell Penetration', $prefix.'SpellPenetration');
		$output .= $this->getCharBasicStatHtml('Physical Penetration', $prefix.'PhysicalPenetration');
			
		$output .= "<div class='ecdStatBarNote'>$note</div>";
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharBasicStatHtml($title, $field, $factor = 1, $suffix = '', $offset = 0)
	{
		$title = $this->escape($title);
		$rawValue = (intval(($this->characterData['stats'][$field]['value'] * $factor + $offset) * 10)) / 10;
		$value = $this->escape($rawValue);
		
		$output  = "<div class='ecdStat'>"; 
		$output .= "<div class='ecdStatTitle'>$title</div>";
		$output .= "<div class='ecdStatValue'>$value$suffix</div>";
		$output .= "</div>\n";
		
		return $output;	
	}
	
	
	public function getCharField($field, $default = "")
	{
		if (!array_key_exists($field, $this->characterData)) return $default;
		return $this->escape($this->characterData[$field]);
	}
	
	
	public function getCharStatField($field, $default = "")
	{
		if (!array_key_exists($field, $this->characterData['stats'])) return $default;
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
		$output .= "<img alt='' src=\"$iconUrl\" class='ecdActionIconImage' />";
		
		if ($name != '')
		{
			$output .= $this->getCharSkillTooltipHtml($action, 'ecdSkillTooltip');
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharLevelTitle()
	{
		if ($this->showCPLevel) return 'LEVEL';
		
		if ($this->characterData['level'] >= 50) return 'VETERAN RANK';
		return 'LEVEL';
	}
	

	public function createCharacterOutputRaw()
	{
		$this->outputHtml .= $this->getBreadcrumbTrailHtml();
		
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
		
		$characterOutput .= $this->getCharacterRawOutput('canEdit', $this->canWikiUserEdit() ? 'true' : 'false');
		$characterOutput .= $this->getCharacterRawOutput('canDelete', $this->canWikiUserDelete() ? 'true' : 'false');
		
		$normalLink = $this->getCharacterLink($this->characterId, false);
		$contentsOutput .= "<li><a href=\"$normalLink\">View Normal Data</a></li>";
		
		$this->outputHtml .= "<ul id='ecdTableOfContents'>\n";
		$this->outputHtml .= $contentsOutput;
		$this->outputHtml .= "</ul>\n";
		$this->outputHtml .= "<table class='ecdRawBuildData'>\n";
		$this->outputHtml .= "<th colspan='20'>Character Summary</th>\n";
		$this->outputHtml .= $characterOutput;
		$this->outputHtml .= "</table> <p />\n";
		
		if ($this->isEditted())
			$this->outputHtml .= "<small>Character Data Edited on " . $this->getCharEditDate() . "</small>";
		else
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
				'bank' => 'Bank',
				'craft' => 'Craft',
				'craftBag' => 'Craft Bag',
				'inventory' => 'Inventory',
				'accountInventory' => 'Account Inventory',
				'accountEquipSlots' => 'Account Equipment',
		);
		
		$title = $SECTIONS[$section];
		if ($title == null) return $section;
		return $title;
	}
	
	
	public function checkCharacterRawColumnName($colName)
	{
		if ($colName === 'id') return false;
		if ($colName === 'characterId') return false;
		if ($colName === 'account') return false;
		if ($colName === 'invType') return false;
		if ($colName === 'localId') return false;
		if ($colName === 'nameLC') return false;
		if ($colName === 'setNameLC') return false;
		if ($colName === 'password') return false;
		if ($colName === 'Password') return false;
		if ($colName === 'OldPassword') return false;
				
		return true;
	}
	
	
	public function checkCharacterRawKeyName($keyName)
	{
		if ($keyName === 'IPAddress') return false;
		if ($keyName === 'password') return false;
		if ($keyName === 'uniqueAccountName') return false;
		if ($keyName === 'account') return false;
		if ($keyName === 'accountName') return false;
		if ($keyName === 'Password') return false;
		if ($keyName === 'OldPassword') return false;
	
		return true;
	}
	
	
	public function convertDescriptionToText($description)
	{
		$newDesc = preg_replace('/\|c[a-fA-F0-9]{6}([a-zA-Z _0-9\.\+\-\:\;\n\r\t]*)\|r/', '$1', $description);
		$newDesc = $this->escape($newDesc);
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
	
	
	public function GetCharMundus()
	{
		$mundus = "";
		if ($this->characterData == null) return "";
	
		foreach ($this->characterData['buffs'] as $buff)
		{
			if (preg_match("#Boon\: (.*)#", $buff['name'], $matches))
			{
				if ($mundus != "") $mundus .= "+";
				$mundus .= $matches[1];
			}
		}
	
		return $mundus;
	}
	
	
	public function GetAccountCharMundus($charId)
	{
		if ($this->accountBuffs[$charId] === null) return "";
		$mundus = "";
	
		foreach ($this->accountBuffs[$charId] as $buff)
		{
			if (preg_match("#Boon\: (.*)#", $buff['name'], $matches))
			{
				if ($mundus != "") $mundus .= "+";
				$mundus .= $matches[1];
			}
		}
	
		return $mundus;
	}
	
	
	public function getCharacterRawArrayOutput($name, $data)
	{
		$output .= "<a name='ecd_$name'></a>";
		$title = $this->getCharacterRawSectionTitle($name);
		$output .= "<h2>$title</h2>";
		$output .= "<table class='ecdRawCharArrayData'>\n";
		$firstRow = true;
		$colNames = array();
		
		foreach ($data as $key => $arrayData)
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
					$colNames[] = $rowName;
				}
				
				$firstRow = false;
				$output .= "</tr>\n";
			}
			
			$safeKey = $this->escape($key);
			$rowOutput = "<tr>\n";
			
			foreach ($colNames as $col)
			{
				if (!$this->checkCharacterRawColumnName($col)) continue;

				$value = $arrayData[$col];
				if (!$this->checkCharacterRawKeyName($value)) $skipRow = true;
				
				$className = "";
				
				if ($col == 'description')
				{
					$safeValue = $this->escape($this->convertDescriptionToText($value));
				}
				elseif ($col == 'icon')
				{
					$safeValue = $this->convertIconToImageLink($value);
				}
				elseif ($col == 'name') 
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
	
	
	public function getCreateBuildButtonHtml()
	{
		$output = "";
		
		if ($this->canWikiUserCreate())
		{
			$editLink = $this->getEditLink();
				
			$output .= "<tr class='ecdBuildCreateNewRow'><td colspan='10' align='center'>";
			$output .= "	<form method='get' action='$editLink'>";
			$output .= "		<input type='submit' value='Create New Build'>";
			$output .= "	</form>";
			$output .= "</td></tr>";
		}
		
		return $output;
	}
	
	
	public function getPrevBuildTableRowHtml() 
	{
		$output = "";
		
		if ($this->currentCharacterPage > 0)
		{
			$page = $this->currentCharacterPage - 1 + 1;
			$output .= "<tr class='ecdBuildNextPrevRow'><td colspan='10' align='center'>";				
			$output .= "<a href='?$query&page=$page'><b>Previous Builds...</b></a>";
			$output .= "</td></tr>";
		}
		
		return $output;
	}
	
	
	public function getNextBuildTableRowHtml()
	{
		$output = "";
	
		if ($this->currentCharacterPage < $this->totalCharacterPages - 1)
		{
			$page = $this->currentCharacterPage + 1 + 1;
			$output .= "<tr class='ecdBuildNextPrevRow'><td colspan='10' align='center'>";
			$output .= "<a href='?$query&page=$page'><b>More Builds...</b></a> ";
			$output .= "</td></tr>";
		}
		
		return $output;
	}
	

	public function createBuildTableHtml()
	{
		// Fuzzfoot Pouchfiller, Level 50 CP160 Stamina Nightblade Woodelf, AD, Vampire
		if (!$this->loadBuilds()) return false;
		
		$this->outputHtml .= $this->getBreadcrumbTrailHtml() . "<p />\n";
		
		if (!$this->canWikiUserCreate())
		{
			$this->outputHtml .= "If you wish to create, edit, or copy the builds listed below you must login or create a Wiki account.";
		}
		
		$this->outputHtml .= $this->getBuildTablePageHtml();
		
		$this->outputHtml .= "<table id='ecdBuildTable' class='sortable jquery-tablesorter'>\n";
		$this->outputHtml .= "<thead><tr class='ecdBuildTableHeader'>\n";
		$this->outputHtml .= "<th class='headerSort headerSortDown'>Build Name</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Character</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Class</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Race</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Alliance</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Type</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Special</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Level</th>\n";
		$this->outputHtml .= "<th class='headerSort'>CPs</th>\n";
		$this->outputHtml .= "<th class='headerSort'>Last Updated</th>\n";
		$this->outputHtml .= "</tr>\n";
		
		$this->outputHtml .= $this->getCreateBuildButtonHtml();
		$this->outputHtml .= $this->getPrevBuildTableRowHtml();
		
		$this->outputHtml .= "</thead><tbody>\n";
		
		foreach ($this->buildData as $buildData)
		{
			$this->outputHtml .= $this->getBuildTableItemHtml($buildData);
		}
		
		$this->outputHtml .= $this->getNextBuildTableRowHtml();
		$this->outputHtml .= $this->getCreateBuildButtonHtml();
		
		$this->outputHtml .= "</tbody></table>\n";
		$this->outputHtml .= $this->getBuildTablePageHtml();
		
		return true;
	}
	
	
	public function getBuildTableFindQuery()
	{
		$query = array();
		
		if ($this->inputSearch != "") 
		{
			$value = urlencode($this->inputSearch);
			$query[] = "findbuild=$value";
		}
		
		if ($this->inputSearchClass != "")
		{
			$value = urlencode($this->inputSearchClass);
			$query[] = "findclass=$value";
		}
		
		if ($this->inputSearchRace != "")
		{
			$value = urlencode($this->inputSearchRace);
			$query[] = "findrace=$value";
		}
		
		if ($this->inputSearchBuildType != "")
		{
			$value = urlencode($this->inputSearchBuildType);
			$query[] = "findbuildtype=$value";
		}
		
		if ($this->inputSearchSpecial != "")
		{
			$value = urlencode($this->inputSearchSpecial);
			$query[] = "findspecial=$value";
		}
		
		if ($this->viewMyBuilds) $query[] = "filter=mine";
						
		return implode("&", $query);
	}
	
	
	public function getBuildTablePageHtml()
	{
		$output = "";
		$displayCount = 0;
		$query = $this->getBuildTableFindQuery();
		
		if ($this->totalCharacterPages <= 1) return $output;
		
		if ($this->currentCharacterPage > 0)
		{
			$page = $this->currentCharacterPage - 1 + 1;
			$output .= "<a href='?$query&page=$page'>prev</a> ";
		}
		
		$page = $this->currentCharacterPage + 1;
		$max = $this->totalCharacterPages;
		$output .= "| Page $page of $max ";
		
		if ($this->currentCharacterPage < $this->totalCharacterPages - 1)
		{
			$page = $this->currentCharacterPage + 1 + 1;
			$output .= "| <a href='?$query&page=$page'>next</a> ";
		}
		
		for ($i = 0; $i < $this->totalCharacterPages; ++$i)
		{
			++$displayCount;
			
			if ($displayCount == 4)
			{
				if ($i < $this->currentCharacterPage - 5)
				{
					$output .= "| ... ";
					$i = $this->currentCharacterPage - 4;
				}
			}
			else if ($displayCount == 13)
			{
				if ($i < $this->totalCharacterPages - 4) 
				{
					$output .= "| ... ";
					$i = $this->totalCharacterPages - 3;
				}
			}
			
			$page = $i + 1;
			
			if ($i == $this->currentCharacterPage)
				$output .= "| <b>$page</b> ";
			else
				$output .= "| <a href='?$query&page=$page'>$page</a> ";			
		}		
				
		return $output;		
	}
	
	
	public function doesBuildMatchFilter($buildData)
	{
		if ($this->viewMyBuilds && !$this->doesOwnBuild($buildData)) return false;
		
		if ($this->inputSearch != "" && !$this->doesBuildMatchSearch($buildData)) return false;
		
		return true;
	}
	
	
	public function doesBuildMatchSearch($buildData)
	{
		static $MATCH_FIELDS = array(
				"name",
				"buildName",
				"class",
				"race",
				"alliance",
				"buildType",
				"special",
		);
		
		$searchText = strtolower($this->inputSearch);
		
		foreach ($MATCH_FIELDS as $field)
		{
			$value = $buildData[$field];
			if ($value == null || $value == "") continue;
			$value = strtolower($value);
			
			if (strpos($value, $searchText) !== false) return true;
		}
		
		return false;
	}
	
	
	public function deleteBuild()
	{
		if ($this->characterId <= 0) return $this->reportError("Missing valid character ID!");
		if (!$this->initDatabaseWrite()) return $this->reportError("Database error!");
		
		$id = $this->characterId;
		
		$this->lastQuery = "DELETE FROM characters WHERE id=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character record!");
		
		$this->lastQuery = "DELETE FROM stats WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character stats records!");
		
		$this->lastQuery = "DELETE FROM screenshots WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character screenshots records!");
		
		$this->lastQuery = "DELETE FROM buffs WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character buffs records!");
		
		$this->lastQuery = "DELETE FROM actionBars WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character actionBars records!");
		
		$this->lastQuery = "DELETE FROM championPoints WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character championPoints records!");
		
		$this->lastQuery = "DELETE FROM skills WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character skills records!");
		
		$this->lastQuery = "DELETE FROM equipSlots WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character equipSlots records!");				
		
		return true;
	}
		
	
	public function doBuildDelete()
	{
		if ($this->characterId <= 0) return $this->reportError("Missing valid character ID!");
		if (!$this->loadCharacter()) return false;
		if (!$this->canWikiUserDelete()) return $this->reportError("Permission denied!");
		
		$buildName = $this->getCharField('buildName');
		$charName = $this->getCharField('name');
		
		if (!$this->deleteBuild())
		{
			$this->reportError($this->getDeleteFailureOutput($buildName, $charName, $this->characterId));
			return false;
		}
				
		$this->outputHtml .= $this->getDeleteSuccessHtmlOutput($buildName, $charName, $this->characterId);
		
		return true;
	}
	
	
	public function getDeleteFailureOutput($buildName, $charName, $id)
	{
		return "Failed to delete build '$buildName' (id #$id)!";
	}
	
	
	public function getDeleteSuccessHtmlOutput($buildName, $charName, $id)
	{
		$output = "";
		$output .= $this->getBreadcrumbTrailHtml();
		$output  .= "<p />\n";
		$output  .= "Successfully deleted build '$buildName' (id #$id)! <br/>";
		
		return $output;
	}

	
	public function createChangePasswordOutput()
	{
		if ($this->characterId <= 0) return $this->reportError("Missing valid character ID 1!");
		if ($this->formAccount == "")  return $this->reportError("Missing valid account ID!");
		if ($this->nonConfirm != '') return $this->createBuildTableHtml();
		if ($this->confirm != '') return $this->doBuildChangePassword();
		
		if (!$this->loadCharacter()) return false;
		if (!$this->canWikiUserEdit()) return $this->reportError("Permission denied!");
		
		$buildName = $this->getCharField('buildName');
		$charName = $this->getCharField('name');
		$id = $this->characterId;
		
		$this->outputHtml .= $this->getChangePasswordConfirmOutput($buildName, $charName, $id);
		
		return true;
	}
	
	
	public function getChangePasswordConfirmOutput($buildName, $charName, $id)
	{
		$account = $this->formAccount;
		
		$output = <<<EOT
		<form method='post' action=''>
			Changing password for the character <b>'$charName'</b> (id #$id) and all other characters on the same account.
			A blank password means "no password".
			<p/>
			Remember to change your character data password in the game using <em>"/uespchardata password [newpassword]"</em> 
			to match the new password entered below or you will not be able to upload new character data.
			<p />&nbsp;<br />
			<div class='ecdPasswordBox'>
EOT;
		
		if (!$this->isWikiUserAdmin())
		{
			$output .= "<label class='ecdPasswordLabel'>Current Password:</label> <input type='password' name='oldPassword' value='' size='24' maxsize='64'><p />&nbsp;<br />";
		}
			
		$output .= <<<EOT
				<label class='ecdPasswordLabel'>New Password:</label> <input type='password' name='password1' value='' size='24' maxsize='64'><p />
				<label class='ecdPasswordLabel'>Confirm Password:</label> <input type='password' name='password2' value='' size='24' maxsize='64'>
				<p />&nbsp;<br />
				<button type='submit' name='confirm' value='1' class='ecdChangePasswordButton'>Change Password</button> &nbsp; &nbsp;
				<button type='submit' name='nonconfirm' value='1' class='ecdCancelPasswordButton'>Cancel</button>
				<input type='hidden' name='id' value='$id'>
				<input type='hidden' name='account' value='$account'>
				<input type='hidden' name='action' value='changePassword'>
			</div>
		</form>
EOT;
		
		return $output;
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
	
	
	public function doBuildChangePassword()
	{
		if ($this->characterId <= 0) return $this->reportError("Missing valid character ID 4!");
		if ($this->formAccount == "")  return $this->reportError("Missing valid account ID!");
		
		if (!$this->initDatabaseWrite()) return false;
		
		if (!$this->loadCharacter()) return false;
		if (!$this->loadAccount($this->formAccount)) return false;
		if (!$this->canWikiUserDelete()) return $this->reportError("Permission denied!");
			
		$buildName = $this->getCharField('buildName');
		$charName = $this->getCharField('name');
		$id = $this->characterId;
		
		if ($this->formNewPassword1 != $this->formNewPassword2)
		{
			$this->outputHtml .= "<div class='ecdFormSubmitError'>New passwords do not match!</div>";
			$this->outputHtml .= $this->getChangePasswordConfirmOutput($buildName, $charName, $this->characterId);
			return true;
		}
		
		if (!$this->isWikiUserAdmin())
		{
			if (!$this->checkAccountPassword($this->formOldPassword))
			{
				$this->outputHtml .= "<div class='ecdFormSubmitError'>Permission Denied!</div>";
				$this->outputHtml .= $this->getChangePasswordConfirmOutput($buildName, $charName, $this->characterId);
				return false;
			}
		}
		
		if (!$this->changePassword($this->formNewPassword1))
		{
			$this->reportError("Failed to change password for account with character '$charName' (id #$id)!");
			return false;
		}
		
		$this->outputHtml .= $this->getBreadcrumbTrailHtml();
		$this->outputHtml .= "<p />\n";
		$this->outputHtml .= "Successfully changed the password for account with character '$charName' (id #$id)! <br/>";
		
		return true;
	}
	
	
	public function checkAccountPassword($password)
	{
		$passwordHash = $this->accountData['passwordHash'];
		if ($passwordHash == null || $passwordHash == '0') return true;
		
		return (crypt($password, $passwordHash) == $passwordHash);
	}
	
	
	public function changePassword($newPassword)
	{
		$salt = uniqid('', true);
		$passwordHash = "0";
		if ($newPassword == null) $newPassword = "";
		if ($newPassword != "")	$passwordHash = crypt($newPassword, '$5$'.$salt);
		
		$account = $this->accountData['account'];
		$this->accountData['passwordHash'] = $passwordHash;
		$this->accountData['salt'] = $salt;
		
		$query = "UPDATE account SET passwordHash=\"$passwordHash\", salt=\"$salt\" WHERE account=\"$account\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result == 0) return $this->reportError("Failed to save account data!");
		
		return true;
	}
	
	
	public function createDeleteOutput()
	{
		if ($this->characterId <= 0) return $this->reportError("Missing valid character ID!");
		if ($this->nonConfirm != '') return $this->createBuildTableHtml();
		if ($this->confirm != '') return $this->doBuildDelete();
		
		if (!$this->loadCharacter()) return false;
		if (!$this->canWikiUserDelete()) return $this->reportError("Permission denied!");
		
		$buildName = $this->getCharField('buildName');
		$charName = $this->getCharField('name');
		$id = $this->characterId;
		
		$this->outputHtml .= $this->getDeleteConfirmOutput($buildName, $charName, $id); 
		
		return true;
	}
	
	
	public function getDeleteConfirmOutput($buildName, $charName, $id)
	{
		$output = "";
		
		$output .= "<form method='post' action=''>";
		$output .= "<b>Warning:</b> Once a build is deleted it cannot be restored. It can be re-uploaded again if desired.<p />";
		$output .= "Are you sure you wish to delete build <b>'$buildName'</b> (id #$id)? <p />";
		$output .= "<button type='submit' name='confirm' value='1' class='ecdDeleteButton'>Yes, Delete this Build</button> &nbsp; &nbsp; ";
		$output .= "<button type='submit' name='nonconfirm' value='1'>Cancel</button>";
		$output .= "<input type='hidden' name='id' value='$id'>";
		$output .= "<input type='hidden' name='action' value='delete'>";
		$output .= "</form>";
				
		return $output;
	}
	
	
	public function getBuildTableItemHtml($buildData)
	{
		$output = "";
		
		$buildName = $this->escape($this->getFieldStr($buildData, 'buildName'));
		$charName = $this->escape($this->getFieldStr($buildData, 'name'));
		$buildType = $this->escape($this->getFieldStr($buildData, 'buildType'));
		$allianceName = $this->escape($this->getFieldStr($buildData, 'alliance'));
		$className = $this->escape($this->getFieldStr($buildData, 'class'));
		$raceName = $this->escape($this->getFieldStr($buildData, 'race'));
		$level = $this->formatCharacterLevel($this->getFieldInt($buildData, 'level'));
		$cp = $this->getFieldInt($buildData, 'championPoints');
		$charId = $this->getFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		$special = $this->escape($this->getFieldStr($buildData, 'special'));
		
		if ($buildName == "") 
		{
			$buildName = "(Noname $buildType $className $special)";
		}
		
		if ($this->isBuildEditted($buildData))
			$lastUpdate = $this->getBuildEditDate($buildData);
		else
			$lastUpdate = $this->getBuildCreateDate($buildData);
				
		if ($buildName == "") $buildName = $charName;
		
		$rowClass = "ecdBuildRowHover";
		if ($this->doesOwnBuild($buildData)) $rowClass .= " ecdBuildOwned";
				
		$output .= "<tr class='$rowClass'>\n";
		$output .= "<td class='ecdBuildTableName'><a class='ecdBuildLink' href=\"$linkUrl\">$buildName</a></td>";
		$output .= "<td>$charName</td>";
		$output .= "<td>$className</td>";
		$output .= "<td>$raceName</td>";
		$output .= "<td>$allianceName</td>";
		$output .= "<td>$buildType</td>";
		$output .= "<td>$special</td>";
		$output .= "<td>$level</td>";
		$output .= "<td>$cp</td>";
		$output .= "<td>$lastUpdate</td>";
		
		if ($this->canWikiUserCreate())
		{
			$output .= "<td class='ecdBuildTableButtons'>";
			
			/*
			$output .= "<form method='get' action='/wiki/Special:EsoBuildEditor'>";
			$output .= "<input type='hidden' name='id' value ='{$buildData['id']}'>";
			$output .= "<input type='submit' value='Create Copy'>";
			$output .= "</form>\n &nbsp &nbsp"; 
			*/
			
			$output .= "<form method='get' action='/wiki/Special:EsoBuildEditor'>";
			$output .= "<input type='hidden' name='id' value ='{$buildData['id']}'>";
			
			if ($this->canWikiUserEditBuild($buildData))
				$output .= "<input type='submit' value='Edit'>";
			else
				$output .= "<input type='submit' value='Create Copy'>";
			
			$output .= "</form>\n &nbsp &nbsp";
							
			if ($this->canWikiUserDeleteBuild($buildData))
			{
				$output .= " &nbsp &nbsp <form method='post' action=''>";
				$output .= "<input type='hidden' name='id' value ='{$buildData['id']}'>";
				$output .= "<input type='hidden' name='action' value ='delete'>";
				$output .= "<input type='submit' value='Delete'>";
				$output .= "</form>\n";				
			}
			
			$output .= "</td>";
		}
		else
		{
			$output .= "<td></td>";
		}
		
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
		if ($charId == null) $charId = $this->characterId;
		
		$link  = $this->baseUrl . "?";
		$link .= "id=$charId";
		
		if ($viewRaw) $link .= "&raw";
		
		return $link;
	}
	
	
	public function getBuildLink()
	{
		$link  = $this->baseUrl;
		return $link;
	}
	
	
	public function getEditLink()
	{
		return "/wiki/Special:EsoBuildEditor";
	}
	
		
	public function getBuildListItemHtml($buildData)
	{
		$output = "";
		
		$buildName = $this->escape($this->getFieldStr($buildData, 'buildName'));
		$charName = $this->escape($this->getFieldStr($buildData, 'name'));
		$buildType = $this->escape($this->getFieldStr($buildData, 'buildType'));
		$className = $this->escape($this->getFieldStr($buildData, 'class'));
		$raceName = $this->escape($this->getFieldStr($buildData, 'race'));
		$level = $this->formatCharacterLevel($this->getFieldInt($buildData, 'level'));
		$cp = $this->getFieldInt($buildData, 'championPoints');
		$charId = $this->getFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		$special = $this->escape($this->getFieldStr($buildData, 'special'));
		
		if ($buildType == "other") $buildType = "";
		
		if ($buildName == "")
		{
			$buildName = $charName;
			$charName = "";
		}
		
		$output .= "<li><a href=\"$linkUrl\">$buildName <div class='ecdQuietBuildLink'> -- $buildType $className $special ($raceName, $level, $cp CP) $charName</div></a></li>\n";
		
		return $output;
	}
	
	
	public function copyCharToNewBuild()
	{
		return false;
	}
	
		
	public function getOutput()
	{
		$this->loadHtmlTemplate();
		
		if ($this->db == null || !$this->dbReadInitialized)
		{
			$this->reportError("Error initializing database!");
			return $this->outputHtml;
		}
		
		if ($this->htmlTemplate == "")
		{
			$this->reportError("Error loading the HTML template file!");
			return $this->outputHtml;
		}
		
		if (!$this->parseFormInput()) 
		{
			$this->reportError("Error parsing input data!");
			return $this->outputHtml;
		}
		
		if ($this->copyCharToNewBuildCharId > 0)
		{
			if ($this->copyCharToNewBuild()) return $this->outputHtml;
		}
		
		if ($this->action == 'delete')
			$this->createDeleteOutput();
		else if ($this->action == 'changePassword')
			$this->createChangePasswordOutput();
		else if ($this->characterId > 0)
			$this->createCharacterOutput();
		else if ($this->useBuildTable)
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


function compareInventoryByName($a, $b)
{
	return strcmp($a["name"], $b["name"]);
}


function compareInventoryByItemLink($a, $b)
{
	return strcmp($a["itemLink"], $b["itemLink"]);
}


function CompareEsoSkillTypeName($a, $b)
{
	static $SKILLTYPES = array(
			"Light Armor" => 1,
			"Medium Armor" => 2,
			"Heavy Armor" => 3,
				
			"Two Handed" => 1,
			"One Hand and Shield" => 2,
			"Dual Wield" => 3,
			"Bow" => 4,
			"Destruction Staff" => 5,
			"Restoration Staff" => 6,
	);

	if (!array_key_exists($a, $SKILLTYPES) || !array_key_exists($b, $SKILLTYPES))
	{
		return strcmp($a, $b);
	}

	return $SKILLTYPES[$a] - $SKILLTYPES[$b];
}
