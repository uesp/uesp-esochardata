<?php 


require_once("/home/uesp/secrets/esobuilddata.secrets");


class EsoBuildDataViewer
{
	public $ESO_HTML_TEMPLATE = "templates/esobuilddata_embed_template.txt";
	public $ESO_SHORT_LINK_URL = "http://esobuilds.uesp.net/";
	
	public $hasCharacterInventory = false;
	public $hasCharacterBank      = false;
	public $hasResearchOutput     = false;
	public $combineInventoryItems = true;
	public $combineBankItems      = true;
	
	const ESO_ICON_URL = "http://esoicons.uesp.net";

	
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
	
	public $characterData = array();
	public $skillData = array();
	public $buildData = array();
	public $accountData = array();
	public $accountCharacters = array();
	
	public $characterId = 0;
	public $viewRawData = false;
	public $useBuildTable = true;
	public $action = '';
	public $confirm = '';
	public $nonConfirm = '';
	
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
	public $accountAP = 0;
	public $accountUsedSpace = 0;
	public $accountTotalSpace = 0;
	
	public $formOldPassword = "";
	public $formNewPassword1 = "";
	public $formNewPassword2 = "";
	public $formAccount = "";
	
	
	public function __construct ()
	{
		$this->initDatabase();
	}
	
	
	public function escape($input)
	{
		return htmlspecialchars($input, ENT_COMPAT, 'UTF-8');
	}
	
	
	public function reportError($msg)
	{
		error_log("Error: " . $msg);
		
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

		return true;
	}
	
	
	public function loadHtmlTemplate()
	{
		$this->htmlTemplate = file_get_contents(__DIR__ . '/' . $this->ESO_HTML_TEMPLATE);
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
	
	
	public function canWikiUserEditBuild($buildData)
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
	
		if (!$user->isLoggedIn()) return false;
		if (strcasecmp($user->getName(), $buildData['wikiUserName']) == 0) return true;
	
		return $user->isAllowedAny('esochardata_edit');
	}
	
	
	public function canWikiUserDeleteBuild($buildData)
	{
		if ($this->wikiContext == null) return false;
	
		$user = $this->wikiContext->getUser();
		if ($user == null) return false;
	
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

		if ($this->hasCharacterInventory)
		{
			if (!$this->loadCharacterArrayData("inventory")) return false;
			if (!$this->loadAccountInventory()) return false;
		}
		
		if ($this->hasCharacterBank)
		{
			if (!$this->loadCharacterBankData()) return false;
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
				$newItemData[$lastIndex]['qnt'] += intval($item['qnt']);
			}
			else
			{
				$newItemData[] = $item;
			}
			
			$lastItemLink = $itemLink;
		}		
		
		return $newItemData;
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
					'{baseResourceUrl}' => $this->baseResourceUrl,
					'{activeWeaponClass1}' => $this->getActiveWeaponBarClass(1),
					'{activeWeaponClass2}' => $this->getActiveWeaponBarClass(2),
					'{activeBarClass1}' => $this->getActiveAbilityBarClass(1),
					'{activeBarClass2}' => $this->getActiveAbilityBarClass(2),
					'{activeBarClass3}' => $this->getActiveAbilityBarClass(3),
					'{trail}' => $this->getBreadcrumbTrailHtml(),
					'{characterLink}' => $this->getShortCharacterLinkHtml(),
					'{inventoryContents}' => $this->getInventoryContentHtml(),
					'{bankContents}' => $this->getBankContentHtml(),
					'{accountInvContents}' => $this->getAccountInvContentHtml(),
					'{allInventoryJS}' => $this->getAllInventoryJS(),
					'{invGold}' => $this->getInventoryGold(),
					'{bankGold}' => $this->getBankGold(),
					'{accInvGold}' => $this->getAccountInventoryGold(),
					'{invAP}' => $this->getInventoryAP(),
					'{bankAP}' => $this->getBankAP(),
					'{accInvAP}' => $this->getAccountInventoryAP(),
					'{invTelvar}' => $this->getInventoryTelvar(),
					'{bankTelvar}' => $this->getBankTelvar(),
					'{accInvTelvar}' => $this->getAccountInventoryTelvar(),
					'{invUsedSpace}' => $this->getInventoryUsedSpace(),
					'{invTotalSpace}' => $this->getInventoryTotalSpace(),
					'{bankUsedSpace}' => $this->getBankUsedSpace(),
					'{bankTotalSpace}' => $this->getBankTotalSpace(),
					'{accInvUsedSpace}' => $this->getAccountInventoryUsedSpace(),
					'{accInvTotalSpace}' => $this->getAccountInventoryTotalSpace(),
				
			);
		
		$this->outputHtml .= strtr($this->htmlTemplate, $replacePairs);
		
		return true;
	}
	
	
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
	public function getBankTelvar() { return ""; }
	public function getAccountInventoryTelvar() { return ""; }
	

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
	
	
	public function getAccountInvContentHtml()
	{
		return "";
	}
	
	
	public function getShortCharacterLinkHtml()
	{
		$output = "";
		
		if ($this->characterId <= 0)
		{
			$charLink = $this->ESO_SHORT_LINK_URL . "b/" . $this->characterId;
			$output .= " <a href='$charLink' class='ecdShortCharLink'>Link to Build</a>";
		}
		
		$output .= "<a href='http://esobuilds.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		return $output;
	}
	
	
	public function getBreadcrumbTrailHtml()
	{
		$output = "<div id='ecdTrail'>";
		
		if ($this->characterId > 0)
		{
			$baseLink = $this->getBuildLink();
			$charLink = $this->getCharacterLink($this->characterId);
			
			if ($this->viewRawData)
			{
				$output .= "<a href='$baseLink'>&laquo; View All Builds</a> : ";
				$output .= "<a href='$charLink'>View Normal Build</a>";
			}
			else
			{
				$output .= "<a href='$baseLink'>&laquo; View All Builds</a>";
			}
		}
		else
		{
			$output .= "Viewing all character builds.";
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
			if ($this->characterData['class'] != "Sorcerer") return "ecdHiddenAbilityBar";
			return "";
		}
		
		return "";
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
	
	
	public function getCharCreateDate()
	{
		$tz = 'America/Montreal';
		$timestamp = $this->getCharField('createTime');
		$dt = new DateTime("now", new DateTimeZone($tz));
		$dt->setTimestamp($timestamp);
		$output = $dt->format('Y-m-d H:i:s');
		
		return $output;
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
		
		$output .= $this->getCharSkillMotifContentHtml();
		
		if ($this->hasResearchOutput)
		{
			$output .= $this->getCharSkillResearchContentHtml();
		}
	
		return $output;
	}
	
	
	public function getCharSkillResearchContentHtml()
	{
		$output  = "<div id='ecdSkill_Research' class='ecdSkillData' style='display: none;'>\n";
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
				
		$output  = "<div class='ecdResearchTitle'>$craftType ($knownCount / $totalCount Traits)</div>";
		$output .= "<div class='ecdResearchBlock'>";
		
		$prefix = "Research:$craftType";
		$openSlots = $this->getCharStatField("$prefix:Open");
		$timeStamp = $this->getCharStatField("Research:Timestamp");
		
		$researchTimes = array();
		$researchTraits = array();
		$researchItems = array();
		
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
				$output .= "$trait $item research is finished!";
			else
				$output .= "$trait $item finishes in $timeFmt";
			
			$output .= "</div>\n";
		}
		
		if ($openSlots > 0)
		{
			$output .= "<div class='ecdResearchItem'>\n";
			$output .= "$openSlots research slots available";
			$output .= "</div>\n";
		}
		
		$output .= "<hr width='95%' />";
		$output .= $this->getResearchTraitContentHtml($craftType);
		$output .= "</div>\n";
		return $output;
	}
	
	
	public function getResearchTraitContentHtml($craftType)
	{
		$output = "";
		$totalCount = 0;
		$knownCount = 0;
		
		foreach ($this->characterData['stats'] as $key => $value)
		{
			$matches = array();
			$result = preg_match("/^Research:$craftType:Trait:([a-zA-Z\ _0-9]*)$/", $key, $matches);
			if ($result == 0) continue;
			
			$slotName = $matches[1];
			$rawData = $value['value'];
			
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
			$unknownTraits = $this->characterData['stats']["Research:$craftType:Trait:$slotName:Unknown"];
			
			if ($unknownTraits != null) 
			{
				$tooltip = " tooltip='Unknown Traits: " . $unknownTraits['value'] . "'";
				$extraClass = "ecdTraitTooltip";
			}
			
			$output .= "<div class='ecdResearchTraitItem $extraClass' $tooltip>";
			$output .= "<div class='ecdTraitTitle'>$slotName: </div> ";
			$output .= "$rawData</div>";
		}
		
		//$output .= "<div class='ecdResearchTraitItem'><div class='ecdTraitTitle'>";
		//$output .= "$knownCount of $totalCount traits known";
		//$output .= "</div></div>";
		
		return $output;
	}
	
	
	public function getCharSkillMotifContentHtml()
	{
		$output  = "<div id='ecdSkill_Motifs' class='ecdSkillData' style='display: none;'>\n";
		$output .= "<div id='ecdSkillContentTitle'>Crafting Motifs</div>";
		
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
			
			if (count($rawValues) > 1)
			{
				$styleArray = array();
				$unknownArray = array();
				
				for ($i = 0; $i < 14; ++$i)
				{
					if ($rawValues[$i] == 1) 
						$styleArray[] = $this->ESO_MOTIF_CHAPTERNAMES[$i];
					else
						$unknownArray[] = $this->ESO_MOTIF_CHAPTERNAMES[$i];
				}
				
				$styleData = implode(', ', $styleArray);
				$unknownChapters = implode(', ', $unknownArray);
			}
			elseif ($rawData == '1')
			{
				$styleData = 'All Known';
			}
			elseif ($rawData == '0')
			{
				$styleData = 'None Known';
				$unknownChapters =  implode(', ', $this->ESO_MOTIF_CHAPTERNAMES);
			}
			else
			{
				continue;
			}
			
			$extraClass = "";
			$tooltip = "";
				
			if ($unknownChapters != "")
			{
				$tooltip = " tooltip='Unknown Chapters: " . $unknownChapters . "'";
				$extraClass = "ecdTraitTooltip";
			}
							
			$output .= "<div class='ecdSkillDataBox $extraClass' $tooltip>\n";
			$output .= "<div class='ecdSkillNameCraft'>$styleName:</div>";
			$output .= "<div class='ecdSkillValueCraft'>$styleData</div>";
			$output .= "</div>\n";
		}
		
		$output .= "</div>\n";
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
		
		return $output;
	}
	
	
	public function getCharSkillTreeHtml1($skillName, &$skillData)
	{
		if ($skillData == null) return "";
		
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
			$output .= "<div class='ecdSkillTreeName2'>Motifs</div>\n";
			
			if ($this->hasResearchOutput)
			{
				$output .= "<div class='ecdSkillTreeName2'>Research</div>\n";
			}
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
		
		if (!$this->checkDisplayBuffName($buffName)) return "";
		
		if ($this->isBuffFoodOrDrink($buffName))
		{
			$foodDesc = $this->convertFoodDrinkDescription($this->getCharStatField('LastFoodEatenDesc'), $this->getCharStatField('LastFoodEatenType'), $this->getCharStatField('LastFoodEatenName'));
			if ($foodDesc != "") $safeName = $foodDesc;
		}
		
		$iconUrl = $this->convertIconToImageUrl($rawIcon);
		$output .= "<div class='ecdBuff'><img src=\"$iconUrl\" title=\"$rawIcon\"/>\n";
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
		$output .= $this->getCharBasicStatHtml('Spell Critical', 'SpellCritical', $this->getCharCriticalFactor(), '%', 10.0);
		$output .= $this->getCharBasicStatHtml('Weapon Damage', 'Power');
		$output .= $this->getCharBasicStatHtml('Weapon Critical', 'CriticalStrike', $this->getCharCriticalFactor(), '%', 10.0);
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
				
		return true;
	}
	
	
	public function checkCharacterRawKeyName($keyName)
	{
		if ($keyName === 'IPAddress') return false;
		if ($keyName === 'password') return false;
		if ($keyName === 'uniqueAccountName') return false;
		if ($keyName === 'account') return false;
		if ($keyName === 'accountName') return false;
	
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
				//if (!$this->checkCharacterRawKeyName($value)) $skipRow = true;
				
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
	
	
	public function createBuildTableHtml()
	{
		if (!$this->loadBuilds()) return false;
		
		$this->outputHtml .= $this->getBreadcrumbTrailHtml() . "<p />\n";
		
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
		
		if ($this->canWikiUserEditBuild($buildData))
		{
			$output .= "<td>";
			
			if ($this->canWikiUserDeleteBuild($buildData))
			{
				$output .= "<form method='post' action=''>";
				$output .= "<input type='hidden' name='id' value ='{$buildData['id']}'>";
				$output .= "<input type='hidden' name='action' value ='delete'>";
				$output .= "<input type='submit' value ='Delete Build'>";
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
	
	
	public function getBuildLink($charId = -1, $viewRaw = false)
	{
		$link  = $this->baseUrl;
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

