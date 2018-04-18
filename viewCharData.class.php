<?php 


require_once("viewBuildData.class.php");
require_once("/home/uesp/secrets/esochardata.secrets");
require_once("/home/uesp/esolog.static/viewAchievements.class.php");
require_once("/home/uesp/esolog.static/esoBookCollectionData.php");
require_once("/home/uesp/esolog.static/esoCollectibleData.php");
require_once("/home/uesp/esolog.static/esoRecipeData.php");
require_once("/home/uesp/esolog.static/esoQuestData.php");


class EsoCharDataViewer extends EsoBuildDataViewer
{
	
	public $CLOTHING_SLOT_DISPLAYNAMES = array(
			"Arm Cops" => "(M) Arm Cops",
			"Belt" => "(M) Belt",
			"Boots" => "(M) Boots",
			"Bracers" => "(M) Bracers",
			"Breeches" => "(L) Breeches",
			"Epaulets" => "(L) Epaulets",
			"Gloves" => "(L) Gloves",
			"Guards" => "(M) Guards",
			"Hat" => "(L) Hat",
			"Helmet" => "(M) Helmet",
			"Jack" => "(M) Jack",
			"Robe & Shirt" => "(L) Robe & Shirt",
			"Robe & Jerkin" => "(L) Robe & Shirt",
			"Sash" => "(L) Sash",
			"Shoes" => "(L) Shoes",
		);
	
	
	public $MAX_PROVISIONING_MASTERWRIT_CHANCE = 14;
	public $MAX_ALCHEMY_MASTERWRIT_CHANCE = 14;
	public $MAX_ENCHANTING_MASTERWRIT_CHANCE = 14;
	public $MAX_SMITHING_MASTERWRIT_CHANCE = 14;
	public $MIN_MASTERWRIT_CHANCE = 1;
	
	public $MOTIFS_FOR_MASTERWRITS = array(
			"Abah's Watch",
			"Akaviri",
			"Aldmeri Dominion",
			"Ancient Elf",
			"Ancient Orc",
			"Apostle",
			"Ashlander",
			"Assassins League",
			"Barbaric",
			"Bloodforge",
			"Buoyant Armiger",
			"Celestial",
			"Daedric",
			"Daggerfall Covenant",
			"Dark Brotherhood",
			"Draugr",
			"Dreadhorn",
			"Dro-m'Athra",
			"Dwemer",
			"Ebonheart Pact",
			"Ebonshadow",
			"Ebony",
			"Glass",
			"Hlaalu",
			"Hollowjack",
			"Malacath",
			"Mazzatun",
			"Mercenary",
			"Militant Ordinator",
			"Minotaur",
			"Morag Tong",
			"Order of the Hour",
			"Outlaw",
			"Primal",
			"Ra Gada",
			"Redoran",
			"Silken Ring",
			"Skinchanger",
			"Telvanni",
			"Thieves Guild",
			"Trinimac",
			"Worm Cult",
			"Xivkyn",
			"Yokudan",
	);
	
	public $PROVISIONING_MASTERWRIT_RECIPEIDS = array(
			57080,
			57081,
			57082,
			57084,
			33802,
			33594,
			33856,
			55922,
			33886,
			33892,
			28331,
			57110,
			33808,
			33868,
			33919,
			33862,
			33796,
			43128,
			33928,
			33910,
			33904,
			33922,
			28333,
			43089,
			43143,
			33898,
			57153,
			68251,
			68252,
			68253,
			68254,
			57155,
			57156,
			57157,
			34027,
			33434,
			33694,
			33979,
			33739,
			33436,
			33456,
			28514,
			34072,
			33459,
			28518,
			33438,
			33603,
			28403,
			33440,
			33454,
			46057,
			33982,
			28483,
			33699,
			28510,
			33646,
			34033,
			46059,
			68273,
			68274,
			68275,
			68276,
			64221,
			133556,
			120076,
			120763,
			87699,
			101879,
			87697,
			87690,
			71059,
			133555,
			120764,
	);
	
	public function __construct ($isEmbedded = false, $initDbWrite = false)
	{
		parent::__construct($isEmbedded, $initDbWrite);
		
		$this->ESO_HTML_TEMPLATE = "templates/esochardata_embed_template.txt";
		$this->ESO_SHORT_LINK_URL = "//esochars.uesp.net/";
		$this->baseUrl = "viewCharData.php";
		$this->SCREENSHOT_BASE_URL = "//esochar.uesp.net/screenshots/";
		$this->BUILD_TYPE = "character";
		$this->BUILD_TYPE_SHORT = "char";
		
		$this->hasCharacterInventory = true;
		$this->hasCharacterBank      = true;
		$this->hasCharacterCraftBag  = true;
		$this->hasResearchOutput     = true;
		$this->hasRecipeOutput       = true;
		$this->hasAchievementOutput  = true;
		
		$this->achievements = new CEsoViewAchievements(false);
		$this->achievements->useDivImageTags = $this->useDivImageTags;
	}
	
	
	public function initDatabase ()
	{
		global $uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase);
		if ($this->db == null || $this->db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = false;
		
		UpdateEsoPageViews("charDataViews");
	
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
		if ($this->db == null || $this->db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
		$this->dbReadInitialized = true;
		$this->dbWriteInitialized = true;
		
		UpdateEsoPageViews("charDataViews");
	
		return true;
	}
	
	
	public function getInventoryContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['inventory'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function getItemHeaderHtml()
	{
		$output = "<table class='ecdItemTable tablesorter'>\n";
		$output .= "<thead class='ecdFixedHeader'><tr>";
		$output .= "<th></th>"; //Stolen
		$output .= "<th></th>"; //Icon/Qnt
		$output .= "<th>NAME</th>";
		$output .= "<th></th>";	//Extra?
		$output .= "<th>VALUE</th>";
		$output .= "</tr></thead>\n";
		$output .= "<tbody class='ecdScrollContent'>\n";
		
		return $output;
	}
	
	
	public function getItemFooterHtml()
	{
		$output = "</thead></table>\n";
		return $output;
	}
	
	
	public function getItemRowHtml($item)
	{
		$output = "";
		
		$qnt = intval($item['qnt']);
		$name = $this->escape($item['name']);
		$value = intval($item['value']) * $qnt;
		$quality = intval($item['quality']);
		$qualityClass = "ecdItemQuality" . $quality;
		$itemLink = $this->escape($item['itemLink']);
		$trait = $item['trait'];
		$stolen = $item['stolen'];
		$itemId = 0;
		$itemIntSubType = 0;
		$itemIntLevel = 0;
		$optionalIcon = "";
		$localId = $item['localId'];
		
		$matches = array();
		$result = preg_match("/\|H0\:item\:([0-9]+)\:([0-9]+)\:([0-9]+)\:.*/", $item['itemLink'], $matches);
		
		if ($result == 1)
		{
			$itemId = intval($matches[1]);
			$itemIntSubType = intval($matches[2]);
			$itemIntLevel = intval($matches[3]);
		}
		
		$iconUrl = $this->convertIconToImageUrl($item['icon']);
		if ($qnt == 1) $qnt = "";
		
		if ($stolen > 0)
		{
			$optionalIcon = "<img src='{$this->baseResourceUrl}resources/stolenitem.png' class='ecdStolenItemIcon' /><div style='display:none;'>1</div>";
		}
		else if ($trait == 19 || $trait == 24 || $trait == 10)
		{
			$optionalIcon = "<img src='{$this->baseResourceUrl}{$this->ORNATE_ICON}' class='ecdStolenItemIcon' /><div style='display:none;'>$trait</div>";
		}
		else if ($trait == 20 || $trait == 9)
		{
			$optionalIcon = "<img src='{$this->baseResourceUrl}{$this->INTRICATE_ICON}' class='ecdStolenItemIcon' /><div style='display:none;'>$trait</div>";
		}
		else 
		{
		}
			
		$output .= "<tr class='eso_item_link' itemlink='$itemLink' itemid='$itemId' inttype='$itemIntSubType' intlevel='$itemIntLevel' localid='$localId'>";
		$output .= "<td>$optionalIcon</td>";
		$output .= "<td style=\"background-image: url($iconUrl);\">$qnt</td>";
		$output .= "<td class='$qualityClass'>$name</td>";
		$output .= "<td></td>";
		$output .= "<td>$value</td>";
		$output .= "</tr>\n";
		
		return $output;
	}
	
	
	public function getItemFilterHtml()
	{
		$output = <<<EOT
			<div class='ecdItemFilters'>
				<div class='ecdItemFilterTextBox'>
					<input type="text" size="16" maxsize="32" value="" placeholder="Filter Text" class="ecdItemFilterTextInput" /> 
				</div>
				<div class='ecdItemFilterTextLabel'>ALL</div>
				<div class='ecdItemFilterContainer ecdItemFilterAll selected' title='All Items' style="background-image: url('{$this->baseResourceUrl}resources/allfilter.png');" onclick="OnItemFilter('All');" itemfilter="all" ></div> 
				<div class='ecdItemFilterContainer ecdItemFilterWeapon' title='Weapons' style="background-image: url('{$this->baseResourceUrl}resources/weaponfilter.png');" onclick="OnItemFilter('Weapon');"  itemfilter="weapon" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterArmor' title='Armor' style="background-image: url('{$this->baseResourceUrl}resources/armorfilter.png');" onclick="OnItemFilter('Armor');"  itemfilter="armor" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterConsumable' title='Consumable Items' style="background-image: url('{$this->baseResourceUrl}resources/consumablefilter.png');" onclick="OnItemFilter('Consumable');"  itemfilter="consumable" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterMaterial' title='Crafting Materials' style="background-image: url('{$this->baseResourceUrl}resources/materialfilter.png');" onclick="OnItemFilter('Material');"  itemfilter="material" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterMisc' title='Miscellaneous Items' style="background-image: url('{$this->baseResourceUrl}resources/miscfilter.png');" onclick="OnItemFilter('Misc');"  itemfilter="misc" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterQuest' title='Quest Items' style="background-image: url('{$this->baseResourceUrl}resources/questfilter.png');" onclick="OnItemFilter('Quest');"  itemfilter="quest" ></div>
				<div class='ecdItemFilterContainer ecdItemFilterJunk' title='Junk' style="background-image: url('{$this->baseResourceUrl}resources/junkfilter.png');" onclick="OnItemFilter('Junk');"  itemfilter="junk" ></div>
			</div>
			<img class='ecdImageFlip' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' /><img class='3' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' />
EOT;

		return $output;
	}
	
	
	public function getInventoryUsedSpace() 
	{ 
		$space = $this->getCharStatField('InventoryUsedSize');
		return $space; 
	}
	
	
	public function getInventoryTotalSpace() 
	{ 
		$space = $this->getCharStatField('InventorySize');
		return $space; 
	}
	
	
	public function getBankUsedSpace() 
	{
		$space = $this->getCharStatField('BankUsedSize');
		return $space;
	}
	
	
	public function getBankTotalSpace() 
	{ 
		$space = $this->getCharStatField('BankSize');
		return $space;
	}
	
	
	public function getAccountInventoryUsedSpace() 
	{
		$space = $this->getCharStatField('AccountUsedSpace');
		return $space; 
	}
	
	
	public function getAccountInventoryTotalSpace() 
	{ 
		$space = $this->getCharStatField('AccountTotalSpace');
		return $space; 
	}
	
	
	public function getInventoryGold()
	{ 
		$gold = $this->getCharStatField('Money');
		return number_format(intval($gold)); 
	}
	
	
	public function getInventoryWritVoucher()
	{
		$voucher = $this->getCharStatField('WritVoucher');
		return number_format(intval($voucher));
	}
	
	
	public function getBankGold() 
	{ 
		$gold = $this->getCharStatField('BankedMoney');
		return number_format(intval($gold));
	}

	
	public function getAccountTransmuteCrystals()
	{
		$crystals = $this->getCharStatField('TransmuteCrystals');
		return number_format(intval($crystals));
	}
	
	
	public function getAccountInventoryGold() 
	{ 
		$ap = $this->getCharStatField('AccountGold');
		return number_format(intval($ap));
	}
	
	
	public function getInventoryAP() 
	{ 
		$ap = $this->getCharStatField('AlliancePoints');
		return number_format(intval($ap)); 
	}
	
	
	public function getBankAP() 
	{ 
		$telvar = $this->getCharStatField('BankedAP');
		return number_format(intval($telvar));
		//return $this->getInventoryAP();
	}
	
	
	public function getVoucherAP()
	{
		$telvar = $this->getCharStatField('BankedWritVoucher');
		return number_format(intval($telvar));
		//return $this->getInventoryAP();
	}
	
	
	public function getAccountInventoryAP() 
	{ 
		$ap = $this->getCharStatField('AccountAlliancePoints');
		return number_format(intval($ap)); 
	}
	
	
	public function getInventoryTelvar() 
	{ 
		$telvar = $this->getCharStatField('TelvarStones');
		return number_format(intval($telvar)); 
	}
	
	
	public function getBankTelvar() 
	{ 
		$telvar = $this->getCharStatField('BankedTelvarStones');
		return number_format(intval($telvar));
	}
	
	
	public function getAccountInventoryTelvar() 
	{ 
		$ap = $this->getCharStatField('AccountTelvarStones');
		return number_format(intval($ap)); 
	}
	
	
	public function getAccountInventoryWritVoucher()
	{
		$voucher = $this->getCharStatField('AccountWritVoucher');
		return number_format(intval($voucher));
	}
	
	
	public function getInventoryJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['inventory']);
	}
	
	
	public function getBankJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['bank']);
	}
	
	
	public function getCraftBagJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['craftBag']);
	}
	
	
	public function getAccountInvJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['accountInventory']);
	}
	
	
	public function getGeneralInventoryJS($itemData)
	{
		$newItemData = array();
		
		foreach ($itemData as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		$output = json_encode($newItemData);
		return $output;
	}
	
	
	public function getAllInventoryJS()
	{
		if ($this->useAsyncLoad) return "{}";
		
		$newItemData = array();
	
		foreach ($this->characterData['inventory'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		foreach ($this->characterData['bank'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		foreach ($this->characterData['craftBag'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		foreach ($this->characterData['accountInventory'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		//$this->FindCharacterNamesForItems($newItemData);
	
		$output = json_encode($newItemData);
		return $output;
	}
	
	
	public function GetCharacterName($charId)
	{
		$characterData = $this->accountCharacters[$charId];
		
		if ($charId == -1)
			return "Bank";
		else if ($charId == -2)
			return "Craft Bag";
		else if ($characterData != null)
			return $characterData['name'];
		
		return "ID #" . $charId;
	}
	
		
	public function FindCharacterNamesForItems(&$itemData)
	{
		foreach ($itemData as $id => $item)
		{
			$itemData[$id]['characterName'] = $this->GetCharacterName($item['characterId']);
			$itemData[$id]['characterNames'] = array();
			
			foreach ($item['characterIds'] as $charId)
			{
				$itemData[$id]['characterNames'][] = $this->GetCharacterName($charId);
			}
		}
		
	}
	
	
	public function GetQuestCategoryFromType($questType, $questZone)
	{
		if ($questType == 13)
		{
			$questZone = "Battleground";
		}
		else if ($questType == 2)
		{
			$questZone = "Main Quest";
		}
		else if ($questType == 12)
		{
			$questZone = "Holiday Event";
		}
		else if ($questType == 4)
		{
			$questZone = "Crafting";
		}
		else if ($questType == 7 || $questType == 10 || $questType == 11)
		{
			$questZone = "Cyrodiil";
		}
		else if ($questZone == "") 
		{
			if ($questType == 5)
				$questZone = "Dungeon";
			elseif ($questType == 3)
				$questZone = "Guild";
			elseif ($questType == 9)
				$questZone = "QA Test";
			else
				$questZone = "Other";
		}
		
		return $questZone;
	}
	
	
	public function FindQuestIdFromQuestData($allQuestData, $targetName, $targetZone, $targetType)
	{
		$foundQuestIds = array();
		
		$targetZone = $this->GetQuestCategoryFromType($targetType, $targetZone);
		
		$zoneData = $allQuestData[$targetZone];
		if ($zoneData == null) return -1;
		
		foreach ($zoneData as $questId => $questData)
		{
			if ($questData['name'] != $targetName) continue;
			if ($questData['type'] != $targetType) continue;
			if ($questData['complete'] == 0) return $questId;
			
			$foundQuestIds[] = $questId;
		}
		
		if ($foundQuestIds[0] != null) return $foundQuestIds[0];
		
		foreach ($allQuestData as $questZone => $zoneData)
		{
			foreach ($zoneData as $questId => $questData)
			{
				if ($questData['name'] != $targetName) continue;
				if ($questData['type'] != $targetType) continue;
				if ($questData['complete'] == 0) return $questId;
				$foundQuestIds[] = $questId;
			}
		}
		
		if ($foundQuestIds[0] != null) return $foundQuestIds[0];
		
		//error_log("FindQuestIdFromQuestData: No Matches! $targetName, $targetZone, $targetType");
		return -1;
	}
	
	
	public function GetCharAllQuestData(&$numAllQuests, &$numMissingQuests)
	{
		global $ESO_QUEST_DATA;
		
		$resultData = array();
		$numCompletedQuests = $this->getCharStatField("NumCompletedQuests", 0);
		$numMissingQuests = 0;
		$numAllQuests = 0;
		
		foreach ($ESO_QUEST_DATA as $questId => $questData)
		{
			if ($resultData[$questZone] == null) $resultData[$questZone] = array();
			
			$questType = $questData['type'];
			$questZone = $questData['zone'];
			$questZone = $this->GetQuestCategoryFromType($questType, $questZone);
			
			$resultData[$questZone][$questId] = array(
					"id" => $questId,
					"zone" => $questZone,
					"name" => $questData['name'],
					"type" => $questData['type'],
					"objective" => "",
					"journal" => $questData['journal'],
					"completed" => 0,
				);
		}
				
		for ($i = 1; $i <= $numCompletedQuests; ++$i)
		{
			$questData = explode("|", $this->getCharStatField("Quest:$i", ""));
			if ($questData[4] === null) continue; 
			
			$questId = $questData[0];
			$questName = $questData[1];
			$questType = $questData[2];
			$questZone = $questData[3];
			$questObjective = $questData[4];
			$questZone = $this->GetQuestCategoryFromType($questType, $questZone);

			if ($resultData[$questZone] == null) $resultData[$questZone] = array();
			if ($resultData[$questZone][$questId] == null) $resultData[$questZone][$questId] = array();
		
			$resultData[$questZone][$questId]["id"] = $questId;
			$resultData[$questZone][$questId]["zone"] = $questZone;
			$resultData[$questZone][$questId]["name"] = $questName;
			$resultData[$questZone][$questId]["type"] = $questType;
			$resultData[$questZone][$questId]["index"] = $index;
			$resultData[$questZone][$questId]["objective"] = $questObjective;
			$resultData[$questZone][$questId]["completed"] = 1;
		}
		
		$numJournalQuests = $this->getCharStatField("NumJournalQuests", 0);
	
		for ($i = 1; $i <= $numJournalQuests; ++$i)
		{
			$prefix = "Journal:$i";

			$questName = $this->getCharStatField("$prefix:Name");
			$questType = $this->getCharStatField("$prefix:Type");
			$questZone = $this->getCharStatField("$prefix:Zone");
			$questZone = $this->GetQuestCategoryFromType($questType, $questZone);
			
			$questId = $this->FindQuestIdFromQuestData($resultData, $questName, $questZone, $questType);
			if ($questId < 0) continue;
			
			if ($resultData[$questZone] == null) $resultData[$questZone] = array();
			if ($resultData[$questZone][$questId] == null) $resultData[$questZone][$questId] = array();
			
			if ($resultData[$questZone][$questId]["completed"] == 0) $resultData[$questZone][$questId]["completed"] = -1;			
		}
		
		ksort($resultData);
		
		foreach ($resultData as $zoneName => $zoneData)
		{
			foreach ($zoneData as $questId => $questData)
			{
				if ($questData['completed'] != 1) $numMissingQuests++;
				++$numAllQuests;
			}
			
			uasort($resultData[$zoneName], "cmpQuestZoneData");
		}
		
		return $resultData;
	}
	
		
	public function GetAllQuestContentHtml($allQuests, $showComplete, $showMissing)
	{
		$rightOutput = "";
		
		foreach ($allQuests as $questZone => $zoneData)
		{
			$questZone = strtoupper($questZone);
			$questCount = 0;
			$zoneOutput = "";
						
			foreach ($zoneData as $questId => $questData)
			{
				if (!$showComplete && $questData['completed'] == 1) continue;
				if (!$showMissing && $questData['completed'] != 1) continue;
				
				++$questCount;
				
				$questId = $questData['id'];
				$questType = $questData['type'];
				$questObj = $this->escape($questData['objective']);
				$name = $this->escape($questData['name']);
				$complete = $questData['complete'];
				$journal = $this->escapeAttr($questData['journal']);
				$imageHtml = "";
				
				$tooltip = "$questId: $journal";
				$extraClass = "ecdQuestTooltip ";
				
				if ($questData['completed'] == 0)
				{
					$extraClass .= "ecdQuestMissing ";
				}
				elseif ($questData['completed'] == -1)
				{
					$tooltip = "$questId: (In Progress) $journal";
					$extraClass .= "ecdQuestInProgress ";
				}
				
				if ($questType == 1)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_trial.png'>";
				}
				else if ($questType == 5)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_group_instance.png'>";
				}
				
				if ($questObj != "")
					$zoneOutput .= "<div class='ecdQuestName1 $extraClass' tooltip='$tooltip' questid='$questId'>$imageHtml$name ($questObj)</div>";
				else
					$zoneOutput .= "<div class='ecdQuestName1 $extraClass' tooltip='$tooltip' questid='$questId'>$imageHtml$name</div>";
			}
			
			if ($zoneOutput != "")
			{
				$rightOutput .= "<div class='ecdQuestZoneTitle1'>$questZone ($questCount)</div>";
				$rightOutput .= "<div class='ecdQuestZoneList1' style='display: none;'>";
				$rightOutput .= $zoneOutput;
				$rightOutput .= "</div>";
			}
		}
		
		return $rightOutput;
	}
	
	
	public function getCharQuestContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
				
		$output = "";
		$leftOutput = "<div id='ecdQuestList'>";
		$rightOutput = "<div id='ecdQuestDetails' class=''>";
		$questTree = array();
				
		$numJournalQuests = $this->getCharStatField("NumJournalQuests", 0);
		
		$leftOutput .= "<div class='ecdQuestCountTitle'>Quests: </div> <div class='ecdQuestCount'> $numJournalQuests / 25</div><p/>";
		
		for ($i = 1; $i <= $numJournalQuests; ++$i)
		{
			$prefix = "Journal:$i";
			
			$activeText = $this->getCharStatField("$prefix:ActiveText");
			$activeType = $this->getCharStatField("$prefix:ActiveType");
			$questName = $this->getCharStatField("$prefix:Name");
			$repeatType = $this->getCharStatField("$prefix:Repeat");
			$questTasks = $this->getCharStatField("$prefix:Tasks");
			$questText = $this->getCharStatField("$prefix:Text");
			$questType = $this->getCharStatField("$prefix:Type");
			$questZone = $this->getCharStatField("$prefix:Zone");
			$questZone = $this->GetQuestCategoryFromType($questType, $questZone);
			
			if ($questTree[$questZone] == null) $questTree[$questZone] = array();
			$questTree[$questZone][] = array("name" => $questName, "index" => $i, "type" => $questType, "repeat" => $repeatType);
			
			$tasks = explode("|", $questTasks);
			$taskHtml = "<ul class='ecdQuestTaskList'>";
			
			foreach ($tasks as $task)
			{
				$subTasks = explode("~*", $task);
				
				if (count($subTasks) > 1)
				{
					$taskHtml .= "<li>" . $subTasks[0] . "<ul class='ecdQuestTaskSublist'>";
					
					for ($j = 1; $j < count($subTasks); $j++)
					{
						$taskHtml .= "<li>" . $subTasks[$j] . "</li>";
					}
					
					$taskHtml .= "</ul></li>";
				}
				else
				{					
					$taskHtml .= "<li>$task</li>";
				}
			}
			
			$taskHtml .= "</ul>";
			
			$questName = strtoupper($questName);
			
			$typeHtml = "";
			$repeatHtml = "";
			
			if ($repeatType != 0)
			{
				$repeatHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_repeat.png'> Repeatable";
			}
			
			if ($questType == 1)
			{
				$typeHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_trial.png'>";
			}
			else if ($questType == 5)
			{
				$typeHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_group_instance.png'>";
			}
						
			$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournal$i' journalindex='$i'>";			
			$rightOutput .= "<div class='ecdQuestDetailTitle'>$questName</div>";			
			$rightOutput .= "<div class='ecdQuestDetailType'>$typeHtml</div>";
			$rightOutput .= "<div class='ecdQuestDetailRepeat'>$repeatHtml</div><br/>";
			$rightOutput .= "<div class='ecdQuestDetailDesc'><p>$questText</p><p>$activeText</p></div>";
			$rightOutput .= "<img class='' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='100%' height='4px' />";
			$rightOutput .= "<div class='ecdQuestDetailTaskTitle'>TASKS</div>";
			$rightOutput .= "<div class='ecdQuestDetailTasks'>$taskHtml</div>";
			$rightOutput .= "</div>";
		}
		
		ksort($questTree);
		
		foreach ($questTree as $questZone => $quests)
		{
			$zone = strtoupper($questZone);
			$leftOutput .= "<div class='ecdQuestZoneTitle $firstClass'>$zone</div><div class='ecdQuestZoneList' style='display: none;'>";
			
			foreach ($quests as $questData)
			{
				$questName = $questData['name'];
				$questType = $questData['type'];
				$questIndex = $questData['index'];
				$repeatType = $questData['repeat'];
				$imageHtml = "";
				
				if ($questType == 1)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_trial.png'>";
				}
				else if ($questType == 5)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_group_instance.png'>";
				}
				else if ($repeatType != 0)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_repeat.png'>";
				}
				
				$leftOutput .= "<div class='ecdQuestName' journalindex='$questIndex'>$imageHtml$questName</div>";
				$firstClass = '';
			}
			
			$leftOutput .= "</div>";
		}
		
		$numCompletedQuests = $this->getCharStatField("NumCompletedQuests", 0);
		$numMissingQuests = 0;
		$numAllQuests = 0;
		$allQuests = $this->GetCharAllQuestData($numAllQuests, $numMissingQuests);
		
		$leftOutput .= "<img class='ecdImageFlip' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' />";
		$leftOutput .= "<img class='' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' />";
		$leftOutput .= "<div class='ecdQuestZoneTitle'>ALL QUESTS</div>";
		$leftOutput .= "<div class='ecdQuestZoneList' style='display: none;'>";
		$leftOutput .= "<div class='ecdQuestName' journalindex='All'>All Quests ($numAllQuests)</div>";
		$leftOutput .= "<div class='ecdQuestName' journalindex='Completed'>Completed Quests ($numCompletedQuests)</div>";
		$leftOutput .= "<div class='ecdQuestName' journalindex='Missing'>Missing Quests ($numMissingQuests)</div>";
		$leftOutput .= "</div>";
		
		$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournalAll' journalindex='All'>";
		$rightOutput .= "<div class='ecdQuestDetailSearch' id='ecdQuestAllSearchForm'>";
		$rightOutput .= "<input type='text' size='10' maxlength='32' id='ecdQuestAllSearchText' placeholder='Find Quest'/>";
		$rightOutput .= "<button onclick='OnEsoCharDataSearchAllQuests();'>Find...</button>";
		$rightOutput .= "</div>";
		$rightOutput .= "<div class='ecdQuestDetailTitle'>ALL QUESTS</div>";
		$rightOutput .= $this->GetAllQuestContentHtml($allQuests, true, true);
		$rightOutput .= "</div>";
		
		$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournalCompleted' journalindex='Completed'>";
		$rightOutput .= "<div class='ecdQuestDetailTitle'>COMPLETED QUESTS</div>";
		$rightOutput .= "This character has completed $numCompletedQuests unique quests.<p/>";
		$rightOutput .= $this->GetAllQuestContentHtml($allQuests, true, false);
		$rightOutput .= "</div>";
		
		$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournalMissing' journalindex='Missing'>";
		$rightOutput .= "<div class='ecdQuestDetailTitle'>MISSING QUESTS</div>";
		$rightOutput .= "This character is missing $numMissingQuests quests.<p/>";
		$rightOutput .= $this->GetAllQuestContentHtml($allQuests, false, true);
		$rightOutput .= "</div>";
		
		$leftOutput .= "</div>";
		$rightOutput .= "</div>";
		$output = $rightOutput . $leftOutput;
				
		return $output;
	}
	
			
	public function getBankContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['bank'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function getCraftBagContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['craftBag'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function getAccountInvContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['accountInventory'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function SortBuildsByName($a, $b)
	{
		return strcmp($a['name'], $b['name']);
	}
	
	
	public function SortBuildsByCharIndexAndName($a, $b)
	{
		$charIndex1 = $a['charIndex'] ? : 1000;
		$charIndex2 = $b['charIndex'] ? : 1000;
		
		$result = $charIndex1 - $charIndex2;
		if ($result != 0) return $result;
		
		return strcmp($a['name'], $b['name']);
	}	
	
	
	public function createBuildTableHtml()
	{
		if (!$this->loadBuilds()) return false;
		
		if ($this->buildData[0] != null)
		{
			$this->loadAccountStats($this->buildData[0]['accountName']);
			$this->loadAccountSkills($this->buildData[0]['accountName']);
			$this->loadAccountBuffs($this->buildData[0]['accountName']);			
		}
		
		uasort($this->buildData, array('EsoCharDataViewer', 'SortBuildsByCharIndexAndName'));
	
		$this->outputHtml .= $this->getBreadcrumbTrailHtml() . "<p />\n";
	
		$this->outputHtml .= "<table id='ecdBuildTable'>\n";
		$this->outputHtml .= "<tr class='ecdBuildTableHeader'>\n";
		$this->outputHtml .= "<th>Character Name</th>\n";
		$this->outputHtml .= "<th>Class</th>\n";
		$this->outputHtml .= "<th>Race</th>\n";
		$this->outputHtml .= "<th>Alliance</th>\n";
		$this->outputHtml .= "<th>Type</th>\n";
		$this->outputHtml .= "<th>Special</th>\n";
		$this->outputHtml .= "<th>Level</th>\n";
		$this->outputHtml .= "<th>CPs</th>\n";
		$this->outputHtml .= "</tr>\n";
	
		foreach ($this->buildData as $buildData)
		{
			if (!$this->doesBuildMatchFilter($buildData)) continue;
			
			$this->outputHtml .= $this->getBuildTableItemHtml($buildData);
		}
	
		$this->outputHtml .= "</table>\n";
		
		$this->outputHtml .= $this->createCharSummaryHtml();
	
		return true;
	}
	
	
	public function createCharSummaryHtml()
	{
		if ($this->accountStats == null || count($this->accountStats) == 0) return "";
		if (!$this->viewMyBuilds) return "";
		
		$output .= $this->createCharInventorySummaryHtml();
		$output .= $this->createCharHirelingSummaryHtml();		
		$output .= $this->createCharWritSummaryHtml();
		$output .= $this->createCharRidingSummaryHtml();
		$output .= $this->createCharResearchSummaryHtml();
		$output .= $this->createCharMotifSummaryHtml();
				
		return $output;
	}
	
	
	public function createCharWritSummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Writ Summary</h2>";
		
		$output .= "<table id='ecdCharSummaryInventory' class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th rowspan='2'>Character</th>";
		$output .= "<th colspan='6'>Crafting Level</th>";
		$output .= "<td></td>";
		$output .= "<th colspan='6'>Master Writ Chance (Estimate)</th>";
		$output .= "</tr>";
		$output .= "<tr>";
		$output .= "<th>Alchemy</th>";
		$output .= "<th>Black</th>";
		$output .= "<th>Cloth</th>";
		$output .= "<th>Enchant</th>";
		$output .= "<th>Prov</th>";
		$output .= "<th>Wood</th>";
		$output .= "<td></td>";
		$output .= "<th>Alchemy</th>";
		$output .= "<th>Black</th>";
		$output .= "<th>Cloth</th>";
		$output .= "<th>Enchant</th>";
		$output .= "<th>Prov</th>";
		$output .= "<th>Wood</th>";
		$output .= "</tr>";
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$charName = $this->escape($build['name']);
						
			$charSkills = $this->accountSkills[$charId];
			if ($charSkills == null) continue;
			
			$alchemyLevel = $this->getAccountSkillsField($charId, "Craft:Alchemy:Solvent Proficiency", "rank", 0);
			$blackLevel = $this->getAccountSkillsField($charId, "Craft:Blacksmithing:Metalworking", "rank", 0);
			$clothLevel = $this->getAccountSkillsField($charId, "Craft:Clothing:Tailoring", "rank", 0);
			$enchantLevel = $this->getAccountSkillsField($charId, "Craft:Enchanting:Potency Improvement", "rank", 0);
			$provLevel = $this->getAccountSkillsField($charId, "Craft:Provisioning:Recipe Improvement", "rank", 0);
			$woodLevel = $this->getAccountSkillsField($charId, "Craft:Woodworking:Woodworking", "rank", 0);
			
			$motifsKnown = $this->getCharMasterWritMotifsKnown($charId);
			
			$alchemyMRChance = $this->getCharAlchemyMasterWritChance($charId, $alchemyLevel);
			$blackMRChance = $this->getCharBlacksmithingMasterWritChance($charId, $blackLevel, $motifsKnown);
			$clothMRChance = $this->getCharClothingMasterWritChance($charId, $clothLevel, $motifsKnown);
			$enchantMRChance = $this->getCharEnchantingMasterWritChance($charId, $enchantLevel);;
			$provMRChance = $this->getCharProvisioningMasterWritChance($charId, $provLevel);
			$woodMRChance = $this->getCharWoodworkingMasterWritChance($charId, $woodLevel, $motifsKnown);
			
			$output .= "<tr>";
			$output .= "<td>$charName</td>";
			$output .= "<td>$alchemyLevel</td>";
			$output .= "<td>$blackLevel</td>";
			$output .= "<td>$clothLevel</td>";
			$output .= "<td>$enchantLevel</td>";
			$output .= "<td>$provLevel</td>";
			$output .= "<td>$woodLevel</td>";
			$output .= "<td></td>";
			$output .= "<td>$alchemyMRChance</td>";
			$output .= "<td>$blackMRChance</td>";
			$output .= "<td>$clothMRChance</td>";
			$output .= "<td>$enchantMRChance</td>";
			$output .= "<td>$provMRChance</td>";
			$output .= "<td>$woodMRChance</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table>";
		
		return $output;
	}
	
		
	public function getCharMasterWritMotifsKnown($charId)
	{
		$knownMotifs = 0;
		$totalMotifs = count($this->MOTIFS_FOR_MASTERWRITS);
		
		foreach ($this->MOTIFS_FOR_MASTERWRITS as $motif)
		{
			$isKnown = $this->getAccountStatsField($charId, "Crafting:$motif", "0");
			if ($isKnown === "1") ++$knownMotifs;
		}
		
		return $knownMotifs / $totalMotifs;
	}
	
	
	public function getCharBlacksmithingMasterWritChance($charId, $level, $motifsKnown)
	{
		if ($level < 10) return "";
		
		$knownTraits = $this->getAccountStatsField($charId, "Research:Blacksmithing:Trait:Known", "0");
		$totalTraits = $this->getAccountStatsField($charId, "Research:Blacksmithing:Trait:Total", "1");
		
		$writChance = $this->MIN_MASTERWRIT_CHANCE;
		$writChance += $knownTraits/$totalTraits * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		$writChance += $motifsKnown * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		
		return round($writChance) . "%";
	}
	
	
	public function getCharClothingMasterWritChance($charId, $level, $motifsKnown)
	{
		if ($level < 10) return "";
		
		$knownTraits = $this->getAccountStatsField($charId, "Research:Clothier:Trait:Known", "0");
		$totalTraits = $this->getAccountStatsField($charId, "Research:Clothier:Trait:Total", "1");
		
		$writChance = $this->MIN_MASTERWRIT_CHANCE;
		$writChance += $knownTraits/$totalTraits * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		$writChance += $motifsKnown * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		
		return round($writChance) . "%";
	}

	
	public function getCharWoodworkingMasterWritChance($charId, $level, $motifsKnown)
	{
		if ($level < 10) return "";
		
		$knownTraits = $this->getAccountStatsField($charId, "Research:Woodworking:Trait:Known", "0");
		$totalTraits = $this->getAccountStatsField($charId, "Research:Woodworking:Trait:Total", "1");
		
		$writChance = $this->MIN_MASTERWRIT_CHANCE;
		$writChance += $knownTraits/$totalTraits * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		$writChance += $motifsKnown * $this->MAX_SMITHING_MASTERWRIT_CHANCE/2;
		
		return round($writChance) . "%";
	}
	
	
	public function getCharEnchantingMasterWritChance($charId, $enchantLevel)
	{
		if ($enchantLevel < 10) return "";
		
			// 788 - 5
			// 781 - 17
			// 779 - 14
			// 780 - 14
			// 1317 - 5
		$achData1 = explode(",", $this->getAccountStatsField($charId, "Achievement:788", "0,0"));
		$achData2 = explode(",", $this->getAccountStatsField($charId, "Achievement:781", "0,0"));
		$achData3 = explode(",", $this->getAccountStatsField($charId, "Achievement:779", "0,0"));
		$achData4 = explode(",", $this->getAccountStatsField($charId, "Achievement:780", "0,0"));
		$achData5 = explode(",", $this->getAccountStatsField($charId, "Achievement:1317", "0,0"));
		
		$runesKnown = 0;
		$runesKnown += substr_count(decbin($achData1[0]), '1');
		$runesKnown += substr_count(decbin($achData2[0]), '1');
		$runesKnown += substr_count(decbin($achData3[0]), '1');
		$runesKnown += substr_count(decbin($achData4[0]), '1');
		$runesKnown += substr_count(decbin($achData5[0]), '1');
		
		return round($runesKnown/(4 + 17 + 14 + 14 + 5) * $this->MAX_ENCHANTING_MASTERWRIT_CHANCE + $this->MIN_MASTERWRIT_CHANCE) . "%";
	}
	
	
	public function getCharAlchemyMasterWritChance($charId, $alchemyLevel)
	{
		if ($alchemyLevel < 8) return "";
		
			// 1045 - 18
			// 1464 - 8
		$achData1 = explode(",", $this->getAccountStatsField($charId, "Achievement:1045", "0,0"));
		$achData2 = explode(",", $this->getAccountStatsField($charId, "Achievement:1464", "0,0"));
		
		$reagentsKnown = 0;
		$reagentsKnown += substr_count(decbin($achData1[0]), '1');
		$reagentsKnown += substr_count(decbin($achData2[0]), '1');
		
		return round($reagentsKnown/(18 + 8) * $this->MAX_ALCHEMY_MASTERWRIT_CHANCE + $this->MIN_MASTERWRIT_CHANCE) . "%";
	}
	
	
	public function getCharProvisioningMasterWritChance($charId, $provLevel)
	{
		if ($provLevel < 6) return "";
		
		$numRecipesKnown = 0;
		$totalRecipes = count($this->PROVISIONING_MASTERWRIT_RECIPEIDS);
		
		foreach ($this->PROVISIONING_MASTERWRIT_RECIPEIDS as $recipeId)
		{
			$isKnown = $this->getAccountStatsField($charId, "Recipe:$recipeId", 0);
			if ($isKnown) ++$numRecipesKnown;
		}
		
		return round($numRecipesKnown/$totalRecipes * $this->MAX_PROVISIONING_MASTERWRIT_CHANCE + $this->MIN_MASTERWRIT_CHANCE) . "%";
	}
	
	
	public function createCharHirelingSummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Hireling Summary</h2>";
		
		$output .= "<table id='ecdCharSummaryInventory' class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th>Character</th>";
		$output .= "<th>Blacksmith<br/>Hireling</th>";
		$output .= "<th>Clothier<br/>Hireling</th>";
		$output .= "<th>Enchanter<br/>Hireling</th>";
		$output .= "<th>Provisioner<br/>Hireling</th>";
		$output .= "<th>Woodworker<br/>Hireling</th>";
		$output .= "</tr>";
		
		$currentTime = time();
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$charName = $this->escape($build['name']);
			if ($this->accountStats[$charId] == null) continue;
			
			$blackHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Blacksmithing', 0));
			$clothHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Clothier', 0));
			$enchantHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Enchanting', 0));
			$provHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Provisioning', 0));
			$woodHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Woodworking', 0));
			
			$blackSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Blacksmithing', 0));
			$clothSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Clothier', 0));
			$enchantSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Enchanting', 0));
			$provSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Provisioning', 0));
			$woodSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Woodworking', 0));
			
			$blackTime = (($blackSkill >= 3) ? 12 : 24) * 3600 + $blackHireling;
			$clothTime = (($clothSkill >= 3) ? 12 : 24) * 3600 + $clothHireling;
			$enchantTime = (($enchantSkill >= 3) ? 12 : 24) * 3600 + $enchantHireling;
			$provTime = (($provSkill >= 3) ? 12 : 24) * 3600 + $provHireling;
			$woodTime = (($woodSkill >= 3) ? 12 : 24) * 3600 + $woodHireling;
			
			$blackTimeFmt = "";
			$clothTimeFmt = "";
			$enchantTimeFmt = "";
			$provTimeFmt = "";
			$woodTimeFmt = "";
			
			if ($blackHireling > 0) 
			{
				if ($blackTime > $currentTime)
					$blackTimeFmt = $this->formatTimeLeft($blackTime - $currentTime);
				else
					$blackTimeFmt = "Ready!";
			}
			
			if ($clothHireling > 0)
			{
				if ($clothTime > $currentTime)
					$clothTimeFmt = $this->formatTimeLeft($clothTime - $currentTime);
				else
					$clothTimeFmt = "Ready!";
			}
			
			if ($enchantHireling > 0)
			{
				if ($enchantTime > $currentTime)
					$enchantTimeFmt = $this->formatTimeLeft($enchantTime - $currentTime);
				else
					$enchantTimeFmt = "Ready!";
			}
			
			if ($provHireling > 0)
			{
				if ($provTime > $currentTime)
					$provTimeFmt = $this->formatTimeLeft($provTime - $currentTime);
				else
					$provTimeFmt = "Ready!";
			}
			
			if ($woodHireling > 0)
			{
				if ($woodTime > $currentTime)
					$woodTimeFmt = $this->formatTimeLeft($woodTime - $currentTime);
				else
					$woodTimeFmt = "Ready!";
			}
			
			$output .= "<tr>";
			$output .= "<td>$charName</td>";
			$output .= "<td>$blackTimeFmt</td>";
			$output .= "<td>$clothTimeFmt</td>";
			$output .= "<td>$enchantTimeFmt</td>";
			$output .= "<td>$provTimeFmt</td>";
			$output .= "<td>$woodTimeFmt</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table>";
		
		return $output;
	}
	
	
	public function createCharInventorySummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Character Summary</h2>";
		
		$output .= "<table id='ecdCharSummaryInventory' class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th>Character</th>";
		$output .= "<th>Gold</th>";
		$output .= "<th>AP</th>";
		$output .= "<th>Telvar</th>";
		$output .= "<th>Vouchers</th>";
		$output .= "<th>Transmute</th>";
		$output .= "<th>Inv Used</th>";
		$output .= "<th>Inv Total</th>";
		$output .= "<th>Skill Points</th>";
		$output .= "<th>Achievement<br>Points</th>";
		$output .= "<th>Mundus</th>";
		$output .= "<th>Time Played</th>";
		$output .= "</tr>";
		
		//InventorySize
		//InventoryUsedSize
		//Money
		//TelvarStones
		//AlliancePoints
		//WritVoucher
		
		//BankSize
		//BankUsedSize
		//BankedMoney
		//BankedTelvarStones
		$totalGold = 0;
		$totalAP = 0;
		$totalTelvar = 0;
		$totalVouchers = 0;
		$totalInvUsed = 0;
		$totalInv = 0;
		$totalSkillPoints = 0;
		$totalAchPoints = 0;
		$totalSecondsPlayed = 0;
		$currentTime = time();
		$maxTimestamp = 0;
		$maxCharId = 0;
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$charName = $this->escape($build['name']);
			if ($this->accountStats[$charId] == null) continue;
			
			$timestamp = $this->getAccountStatsField($charId, 'TimeStamp', 0);
			
			if ($timestamp > $maxTimestamp)
			{
				$maxTimestamp = $timestamp;
				$maxCharId = $charId;
			}
			
			$gold = intval($this->getAccountStatsField($charId, 'Money', 0));
			$telvar = intval($this->getAccountStatsField($charId, 'TelvarStones', 0));
			$ap = intval($this->getAccountStatsField($charId, 'AlliancePoints', 0));
			$voucher = intval($this->getAccountStatsField($charId, 'WritVoucher', 0));
			$invUsed = intval($this->getAccountStatsField($charId, 'InventoryUsedSize', 0));
			$invTotal = intval($this->getAccountStatsField($charId, 'InventorySize', 0));
			$skillPoints = intval($this->getAccountStatsField($charId, 'SkillPointsTotal', 0));
			$achPoints = intval($this->getAccountStatsField($charId, 'AchievementEarnedPoints', 0));
			$mundus = $this->escape($this->GetAccountCharMundus($charId));
			
			$secondsPlayed = intval($this->getAccountStatsField($charId, 'SecondsPlayed', 0));
			$timePlayedFmt = $this->formatTimeLeft($secondsPlayed);
			
			$totalGold += $gold;
			$totalAP += $ap;
			$totalTelvar += $telvar;
			$totalVouchers += $voucher;
			$totalInvUsed += $invUsed;
			$totalInv += $invTotal;
			$totalSkillPoints += $skillPoints;
			$totalAchPoints += $achPoints;
			$totalSecondsPlayed += $secondsPlayed;
			
			$gold = number_format($gold);
			$telvar = number_format($telvar);
			$ap = number_format($ap);
			$voucher = number_format($voucher);
			$achPoints = number_format($achPoints);
			
			$output .= "<tr>";
			$output .= "<td>$charName</td>";
			$output .= "<td>$gold</td>";
			$output .= "<td>$ap</td>";
			$output .= "<td>$telvar</td>";
			$output .= "<td>$voucher</td>";
			$output .= "<td>-</td>";
			$output .= "<td>$invUsed</td>";
			$output .= "<td>$invTotal</td>";
			$output .= "<td>$skillPoints</td>";
			$output .= "<td>$achPoints</td>";
			$output .= "<td>$mundus</td>";
			$output .= "<td>$timePlayedFmt</td>";
			$output .= "</tr>";			
		}
		
		if ($maxCharId <= 0) $maxCharId = $charId;
		
		$gold = intval($this->getAccountStatsField($maxCharId, 'BankedMoney', 0));
		$telvar = intval($this->getAccountStatsField($maxCharId, 'BankedTelvarStones', 0));
		$ap = intval($this->getAccountStatsField($maxCharId, 'BankedAP', 0));
		$voucher = intval($this->getAccountStatsField($maxCharId, 'BankedWritVouchers', 0));
		$invUsed = intval($this->getAccountStatsField($maxCharId, 'BankUsedSize', 0));
		$invTotal = intval($this->getAccountStatsField($maxCharId, 'BankSize', 0));
		
		$totalGold += $gold;
		$totalAP += $ap;
		$totalVouchers += $voucher;
		$totalTelvar += $telvar;
		$totalInvUsed += $invUsed;
		$totalInv += $invTotal;
		
		$gold = number_format($gold);
		$telvar = number_format($telvar);
		$ap = number_format($ap);
		$voucher = number_format($voucher);
		
		$output .= "<tr>";
		$output .= "<td>Bank</td>";
		$output .= "<td>$gold</td>";
		$output .= "<td>$ap</td>";
		$output .= "<td>$telvar</td>";
		$output .= "<td>$voucher</td>";
		$output .= "<td>-</td>";
		$output .= "<td>$invUsed</td>";
		$output .= "<td>$invTotal</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "</tr>";
		
		$invHomeUsed = $this->getAccountStatsField($maxCharId, 'HouseStorage:TotalUsedSize');
		$invHomeTotal = $this->getAccountStatsField($maxCharId, 'HouseStorage:TotalSize');
		$totalInvUsed += $invHomeUsed;
		$totalInv += $invHomeTotal;
		
		$output .= "<tr>";
		$output .= "<td>Home</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>$invHomeUsed</td>";
		$output .= "<td>$invHomeTotal</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "</tr>";
		
		$timePlayedFmt = $this->formatTimeLeft($totalSecondsPlayed);
		$transmuteCrystals = number_format($this->getAccountStatsField($maxCharId, 'TransmuteCrystals', 0));
		
		$totalGold = number_format($totalGold);
		$totalAP = number_format($totalAP);
		$totalTelvar = number_format($totalTelvar);
		$totalVouchers = number_format($totalVouchers);
		$transmuteCrystals = number_format($transmuteCrystals);
		$totalAchPoints = number_format($totalAchPoints);
		$totalInvUsed = number_format($totalInvUsed);
		$totalInv = number_format($totalInv);
		$totalSkillPoints = number_format($totalSkillPoints);
		
		$output .= "<tr>";
		$output .= "<th>Account</th>";
		$output .= "<th>$totalGold</th>";
		$output .= "<th>$totalAP</th>";
		$output .= "<th>$totalTelvar</th>";
		$output .= "<th>$totalVouchers</th>";
		$output .= "<th>$transmuteCrystals</th>";
		$output .= "<th>$totalInvUsed</th>";
		$output .= "<th>$totalInv</th>";
		$output .= "<th>$totalSkillPoints</th>";
		$output .= "<th>$totalAchPoints</th>";
		$output .= "<th>-</th>";
		$output .= "<th>$timePlayedFmt</th>";
		$output .= "</tr>";

		$output .= "</table>";
		return $output;
	}
	
	
	public function getAccountMotifData($charId)
	{
		$craftData = array();
		if ($this->accountStats[$charId] == null) return $craftData;
		
		foreach ($this->accountStats[$charId] as $key => $value)
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
		
				$unknownCount = count($unknownArray);
				$knownCount = 14 - $unknownCount;
			}
			elseif ($rawData == '1')
			{
				$knownCount = 14;
				$unknownCount = 0;
		
				foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
				{
					$craftData[$styleName][$name] = true;
				}
			}
			elseif ($rawData == '0')
			{
				$unknownChapters = implode(', ', $this->ESO_MOTIF_CHAPTERNAMES);
				$knownCount = 0;
				$unknownCount = 14;
		
				foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
				{
					$craftData[$styleName][$name] = false;
				}
			}
		}
		
		return $craftData;
	}
	
	
	public function sumMotifArray($data)
	{
		$sum = array();
	
		foreach ($data as $charId => $data1)
		{
			$charName = $this->escape($this->accountCharacters[$charId]['name']);
			
			foreach ($data1 as $styleName => $data2)
			{
				if ($sum[$styleName] === null) $sum[$styleName] = array();
					
				foreach ($data2 as $chapter => $isKnown)
				{
					if ($sum[$styleName][$chapter] === null)
					{
						$sum[$styleName][$chapter] = array();
						$sum[$styleName][$chapter]['known'] = array();
						$sum[$styleName][$chapter]['unknown'] = array();
						$sum[$styleName][$chapter]['count'] = 0;
					}
					
					if ($isKnown)
					{
						$sum[$styleName][$chapter]['count'] += 1;
						$sum[$styleName][$chapter]['known'][] = $charName;	
					}
					else
					{
						$sum[$styleName][$chapter]['unknown'][] = $charName;
					}
				}
			}
		}
	
		return $sum;
	}
	

	public function createCharMotifSummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Motif  Summary</h2>";
		
		$motifCharData = array();
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$motifCharData[$charId] = $this->getAccountMotifData($charId);
		}
		
		$motifData = $this->sumMotifArray($motifCharData);
		
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
		{
			$output .= "<th>$name</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		$numChars = count($this->buildData);
		$maxCount = 14 * $numChars;
		
		ksort($motifData);
		
		foreach ($motifData as $styleName => $chapterData)
		{
			$output .= "<tr>";
			$output .= "<td>$styleName</td>";
			$totalCount = 0;
			
			foreach ($this->ESO_MOTIF_CHAPTERNAMES as $name)
			{
				$count = $chapterData[$name]['count'] ?: 0;
				$totalCount += $count;
				$title = implode(", ", $chapterData[$name]['known']) . "\n\nUnknown: " . implode(", ", $chapterData[$name]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
			
			$output .= "<td>$totalCount / $maxCount</td>";
			$output .= "</tr>";			
		}
		
		$output .= "</table>";
		return $output;
	}
	
	
	public function getAccountResearchData($charId, $craftType, $slotNameModifier = array())
	{
		if ($this->accountStats[$charId] == null) return array("weapons" => array(), "armor" => array());
		
		$output = "";
		$totalCount = 0;
		$knownCount = 0;
		$armorTraits = array();
		$weaponTraits = array();
		$prefix = "Research:$craftType";
		$timestamp = $this->getAccountStatsField($charId, "Research:Timestamp");
		$research = array();
		$knownCounts = array();
		
		for ($i = 1; $i <= 3; ++$i)
		{
			$trait = $this->getAccountStatsField($charId, "$prefix:Trait$i");
			$time = $this->getAccountStatsField($charId, "$prefix:Time$i");
			$item = $this->getAccountStatsField($charId, "$prefix:Item$i");
				
			if ($research[$item] == null) $research[$item] = array();
			$research[$item][$trait] = $time;
		}
		
		foreach ($this->accountStats[$charId] as $key => $value)
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
		
			$unknownTraits = $this->getAccountStatsField($charId, "Research:$craftType:Trait:$slotName:Unknown"); 
			$totalTraits = intval($this->getAccountStatsField($charId, "Research:$craftType:Trait:$slotName:Total"));
			$knownTraitCount = intval($this->getAccountStatsField($charId, "Research:$craftType:Trait:$slotName:Known"));
		
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
			
			$saveSlotName = $slotName;
			if ($slotNameModifier[$slotName] != null) $saveSlotName = $slotNameModifier[$slotName];
				
			if (self::$WEAPONS[$saveSlotName])
			{
				$weaponTraits[$saveSlotName] = array();
		
				$value = 0;
				if ($knownTraitCount == $totalTraits) $value = 1;
		
				foreach (self::$WEAPON_TRAITS as $trait)
				{
					$weaponTraits[$saveSlotName][$trait] = $value;
				}
		
				foreach ($traits as $trait)
				{
					if (preg_match("#\[([a-zA-Z 0-9\&\-]+)\]#", $trait, $matches))
					{
						$weaponTraits[$saveSlotName][$matches[1]] = 1;
					}
					else
					{
						$weaponTraits[$saveSlotName][$trait] = 1;
					}
				}
			}
			else
			{
				$armorTraits[$saveSlotName] = array();
		
				$value = 0;
				if ($knownTraitCount == $totalTraits) $value = 1;
		
				foreach (self::$ARMOR_TRAITS as $trait)
				{
					$armorTraits[$saveSlotName][$trait] = $value;
				}
		
				foreach ($traits as $trait)
				{
					if (preg_match("#\[([a-zA-Z 0-9\&\-]+)\]#", $trait, $matches)) $trait = $matches[1];
					if ($trait == "Prosperous") $trait = "Invigorating";
					$armorTraits[$saveSlotName][$trait] = 1;
				}
			}
		}
	
		ksort($weaponTraits);
		ksort($armorTraits);
		return array("weapons" => $weaponTraits, "armor" => $armorTraits);
	}
	
	
	public function sumResearchArray($data)
	{
		$sum = array();
		
		foreach ($data as $charId => $data1)
		{
			$charName = $this->escape($this->accountCharacters[$charId]['name']);
			
			foreach ($data1 as $itemType => $data2)
			{
				if ($sum[$itemType] === null) $sum[$itemType] = array();
					
				foreach ($data2 as $slotName => $data3)
				{
					if ($sum[$itemType][$slotName] === null) $sum[$itemType][$slotName] = array();
					
					foreach ($data3 as $trait => $isKnown)
					{
						if ($sum[$itemType][$slotName][$trait] === null) 
						{
							$sum[$itemType][$slotName][$trait] = array();
							$sum[$itemType][$slotName][$trait]['count'] = 0;
							$sum[$itemType][$slotName][$trait]['known'] = array();
							$sum[$itemType][$slotName][$trait]['unknown'] = array();
						}
						
						$sum[$itemType][$slotName][$trait]['count'] += intval($isKnown);
						
						if ($isKnown)
							$sum[$itemType][$slotName][$trait]['known'][] = $charName;
						else
							$sum[$itemType][$slotName][$trait]['unknown'][] = $charName;
					}
				}
			}
		}
		
		return $sum;
	}
	
	
	public function formatTimeLeft($timeLeft)
	{
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
		
		return $timeFmt;
	}
	
	
	public function createAccountResearchSlotData($charId, $craftType, $charName)
	{
		$output = "";
		
		$knownCount = $this->getAccountStatsField($charId, "Research:$craftType:Trait:Known");
		$totalCount = $this->getAccountStatsField($charId, "Research:$craftType:Trait:Total");
		$inProgressCount = 0;
		$finishedCount = 0;
	
		$openSlots = $this->getAccountStatsField($charId,"Research:$craftType:Open");
		$timeStamp = $this->getAccountStatsField($charId,"Research:Timestamp");
	
		$researchTimes = array();
		$researchTraits = array();
		$researchItems = array();
		$extraTraits = array();
	
		for ($i = 1; $i <= 3; ++$i)
		{
			$researchTraits[] = $this->getAccountStatsField($charId, "Research:$craftType:Trait$i");
			$researchTimes[]  = $this->getAccountStatsField($charId, "Research:$craftType:Time$i");
			$researchItems[]  = $this->getAccountStatsField($charId, "Research:$craftType:Item$i");
		}
	
		foreach ($researchTimes as $i => $time)
		{
			$trait = $researchTraits[$i];
			$item  = $researchItems[$i];
				
			if ($time == "" || $trait == "" || $item == "") continue;
				
			$finishTime = intval($time) + intval($timeStamp);
			$timeLeft   = intval($time) + intval($timeStamp) - time();
			$timeFmt = $this->formatTimeLeft($timeLeft);			
							
			if ($timeLeft <= 0)
			{
				++$openSlots;
				++$finishedCount;
				++$knownCount;
				$output .= "$trait $item research is finished!<br/>";
				$extraTraits[$item] = $trait;
				$this->nextResearchFinished[] = array("time" => 0, "name" => "$charName has finished research for $craftType $trait $item!");
			}
			else
			{
				$output .= "$trait $item finishes in $timeFmt<br/>";
				$this->nextResearchFinished[] = array("time" => $timeLeft, "name" => "$charName finishes $craftType $trait $item in $timeFmt.");
				++$inProgressCount;
			}
		}
		
		$totalKnown = $knownCount + $inProgressCount;
		if ($totalKnown >= $totalCount) $openSlots = 0;
	
		if ($knownCount >= $totalCount)
		{
			$output .= "<b>Research Complete!</b><br/>";
		}
		else if ($openSlots == 1)
		{
			$output .= "<b>1 research slot available</b><br/>";
		}
		else if ($openSlots > 1)
		{
			$output .= "<b>$openSlots research slots available</b><br/>";
		}
		
		if ($finishedCount < $openSlots && $knownCount < $totalCount)
		{
			$openSlots -= $finishedCount;
			$this->nextResearchFinished[] = array("time" => 0, "name" => "$charName has $openSlots $craftType research slots available!");
		}
		
		$output .= "$knownCount / $totalCount traits known";
		
		return $output;
	}
	
	
	public function SortNextResearchByTime($a, $b)
	{
		return $a['time'] - $b['time'];
	}
	
	
	public function createCharResearchSummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Research Summary</h2>";
		
		$blacksmithData = array();
		$clothingData = array();
		$woodworkData = array();
		$this->nextResearchFinished = array();
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$blacksmithData[$charId] = $this->getAccountResearchData($charId, "Blacksmithing");
			$clothingData[$charId] = $this->getAccountResearchData($charId, "Clothier", $this->CLOTHING_SLOT_DISPLAYNAMES);
			$woodworkData[$charId] = $this->getAccountResearchData($charId, "Woodworking");
		}
		
		$blacksmithSum = $this->sumResearchArray($blacksmithData);
		$clothingSum = $this->sumResearchArray($clothingData);
		$woodworkSum = $this->sumResearchArray($woodworkData);
		$numChars = count($this->buildData);
		
		$output .= "<h3>Current Research</h3>";
		$output .= "<table id='ecdCharResearchSummary' class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		$output .= "<th>Blacksmithing</th>";
		$output .= "<th>Clothing</th>";
		$output .= "<th>Woodworking</th>";
		$output .= "</tr>";
		
		foreach ($this->buildData as $build)
		{
			$charId = $build['id'];
			$charName = $this->escape($build['name']);
			
			$output .= "<tr>";
			$output .= "<td>$charName</td>";
			$output .= "<td>" . $this->createAccountResearchSlotData($charId, "Blacksmithing", $charName) . "</td>";
			$output .= "<td>" . $this->createAccountResearchSlotData($charId, "Clothier", $charName) . "</td>";
			$output .= "<td>" . $this->createAccountResearchSlotData($charId, "Woodworking", $charName) . "</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table>";
		$output .= "<p><br/>";
		
		if (count($this->nextResearchFinished) > 0)
		{
			usort($this->nextResearchFinished, array("EsoCharDataViewer", "SortNextResearchByTime"));
			
			$output .= "<h3>Next Research Finished</h3>";
			$output .= "<ol>";
			
			for ($i = 0; $i < 10 && $i < count($this->nextResearchFinished); ++$i)
			{
				$research = $this->nextResearchFinished[$i];
				$output .= "<li>{$research['name']}</li>";
			}
			
			$output .= "</ol><p/><br/>";
		}
		
		
		$output .= "<h3>Blacksmithing</h3>";
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach (self::$WEAPON_TRAITS as $trait)
		{
			$output .= "<th>$trait</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		$maxTraits = $numChars * 9;
		
		foreach ($blacksmithSum['weapons'] as $slotName => $traitData)
		{
			$output .= "<tr>";
			$output .= "<td>$slotName</td>";
			$totalCount = 0;
			
			foreach (self::$WEAPON_TRAITS as $trait)
			{
				$count = $traitData[$trait]['count'] ? : 0;
				$totalCount += $count;
				$title = implode(", ", $traitData[$trait]['known']) . "\n\nUnknown: " . implode(", ", $traitData[$trait]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
			
			$output .= "<td>$totalCount / $maxTraits</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table><p><br/>";
		
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach (self::$ARMOR_TRAITS as $trait)
		{
			$output .= "<th>$trait</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		
		foreach ($blacksmithSum['armor'] as $slotName => $traitData)
		{
			$output .= "<tr>";
			$output .= "<td>$slotName</td>";
			$totalCount = 0;
				
			foreach (self::$ARMOR_TRAITS as $trait)
			{
				$count = $traitData[$trait]['count'] ? : 0;
				$totalCount += $count;
				$title = implode(", ", $traitData[$trait]['known']). "\n\nUnknown: " . implode(", ", $traitData[$trait]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
				
			$output .= "<td>$totalCount / $maxTraits</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table><p><br/>";
		
		$output .= "<h3>Clothing</h3>";
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach (self::$ARMOR_TRAITS as $trait)
		{
			$output .= "<th>$trait</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		
		foreach ($clothingSum['armor'] as $slotName => $traitData)
		{
			if ($slotName == "Robe & Jerkin") $slotName = "Robe & Shirt";
			
			$output .= "<tr>";
			$output .= "<td>$slotName</td>";
			$totalCount = 0;
				
			foreach (self::$ARMOR_TRAITS as $trait)
			{
				$count = $traitData[$trait]['count'] ? : 0;
				$totalCount += $count;
				$title = implode(", ", $traitData[$trait]['known']). "\n\nUnknown: " . implode(", ", $traitData[$trait]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
				
			$output .= "<td>$totalCount / $maxTraits</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table><p><br/>";
		
		$output .= "<h3>Woodworking</h3>";
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach (self::$WEAPON_TRAITS as $trait)
		{
			$output .= "<th>$trait</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		
		foreach ($woodworkSum['weapons'] as $slotName => $traitData)
		{
			$output .= "<tr>";
			$output .= "<td>$slotName</td>";
			$totalCount = 0;
				
			foreach (self::$WEAPON_TRAITS as $trait)
			{
				$count = $traitData[$trait]['count'] ? : 0;
				$totalCount += $count;
				$title = implode(", ", $traitData[$trait]['known']). "\n\nUnknown: " . implode(", ", $traitData[$trait]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
				
			$output .= "<td>$totalCount / $maxTraits</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table><p><br/>";
		
		$output .= "<table class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th></th>";
		
		foreach (self::$ARMOR_TRAITS as $trait)
		{
			$output .= "<th>$trait</th>";
		}
		
		$output .= "<th></th>";
		$output .= "</tr>";
		
		foreach ($woodworkSum['armor'] as $slotName => $traitData)
		{
			$output .= "<tr>";
			$output .= "<td>$slotName</td>";
			$totalCount = 0;
		
			foreach (self::$ARMOR_TRAITS as $trait)
			{
				$count = $traitData[$trait]['count'] ? : 0;
				$totalCount += $count;
				$title = implode(", ", $traitData[$trait]['known']). "\n\nUnknown: " . implode(", ", $traitData[$trait]['unknown']);
				$title = $this->escapeAttr($title);
				$output .= "<td title='$title'>$count</td>";
			}
		
			$output .= "<td>$totalCount / $maxTraits</td>";
			$output .= "</tr>";
		}
		
		$output .= "</table>";
		
		$output .= "<p><br/>";
		return $output;
	}
	
	
	public function createCharRidingSummaryHtml()
	{
		$output  = "<p><br/>";
		$output .= "<h2>Riding Summary</h2>";
		$output .= "<table id='ecdCharSummaryRiding' class='ecdCharSummaryTable'>";
		$output .= "<tr>";
		$output .= "<th>Character</th>";
		$output .= "<th>Speed</th>";
		$output .= "<th>Stamina</th>";
		$output .= "<th>Inventory</th>";
		$output .= "<th>Training Time</th>";
		$output .= "</tr>";
		
		foreach ($this->buildData as $build)
		{
			$charId = intval($build['id']);
			$charName = $this->escape($build['name']);
			if ($this->accountStats[$charId] == null) continue;
			
			$ridingSta = intval($this->getAccountStatsField($charId, 'RidingStamina'));
			$ridingSpd = intval($this->getAccountStatsField($charId, "RidingSpeeed", 0));
			if ($ridingSpd == 0) $ridingSpd = intval($this->getAccountStatsField($charId, "RidingSpeed", 0));
			$ridingInv = intval($this->getAccountStatsField($charId, 'RidingInventory'));
			$ridingTimeDone = intval($this->getAccountStatsField($charId, 'RidingTrainingDone', -1));
			
			$isFinishedTraining = false;
			if ($ridingInv + $ridingSta + $ridingSpd >= 180) $isFinishedTraining = true;
			
			$timeLeftMsg = "";
			
			if (!$isFinishedTraining)
			{
				$timeLeft = $ridingTimeDone - time();
				
				if ($ridingTimeDone < 0)
				{
					$timeLeftMsg = "?";
				}
				else if ($timeLeft <= 0)
				{
					$timeLeftMsg = "Ready";
				}
				else
				{
					$hours = floor($timeLeft / 3600) % 24;
					$minutes = floor($timeLeft / 60) % 60;
					$seconds = $timeLeft % 60;
					$timeLeftMsg = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
				}
			}
			
			$output .= "<tr>";
			$output .= "<td>$charName</td>";
			$output .= "<td>$ridingSpd</td>";
			$output .= "<td>$ridingSta</td>";
			$output .= "<td>$ridingInv</td>";
			$output .= "<td>$timeLeftMsg</td>";
			$output .= "</tr>";			
		}		

		$output .= "</table>";
		return $output;
	}
	
	
	public function getBuildTableItemHtml($buildData)
	{
		$output = "";
	
		$buildName = $this->escape($this->getFieldStr($buildData, 'buildName'));
		$charName = $this->escape($this->getFieldStr($buildData, 'name'));
		$buildType = $this->escape($this->getFieldStr($buildData, 'buildType'));
		$className = $this->escape($this->getFieldStr($buildData, 'class'));
		$allianceName = $this->escape($this->getFieldStr($buildData, 'alliance')); 
		$raceName = $this->escape($this->getFieldStr($buildData, 'race'));
		$level = $this->formatCharacterLevel($this->getFieldInt($buildData, 'level'));
		$cp = $this->getFieldInt($buildData, 'championPoints');
		$charId = $this->getFieldInt($buildData, 'id');
		$linkUrl = $this->getCharacterLink($charId);
		$special = $this->escape($this->getFieldStr($buildData, 'special'));
	
		if ($buildName == "") $buildName = $charName;
		
		$rowClass = "ecdBuildRowHover";
		if ($this->doesOwnBuild($buildData)) $rowClass .= " ecdBuildOwned";
	
		$output .= "<tr class='$rowClass'>\n";
		$output .= "<td class='ecdBuildTableName'><a href=\"$linkUrl\">$charName</a></td>";
		$output .= "<td>$className</td>";
		$output .= "<td>$raceName</td>";
		$output .= "<td>$allianceName</td>";
		$output .= "<td>$buildType</td>";
		$output .= "<td>$special</td>";
		$output .= "<td>$level</td>";
		$output .= "<td>$cp</td>";
	
		if ($this->canWikiUserEditBuild($buildData))
		{
			$output .= "<td>";
				
			if ($this->canWikiUserDeleteBuild($buildData))
			{
				$output .= "<form method='post' action=''>";
				$output .= "<input type='hidden' name='id' value ='{$buildData['id']}'>";
				$output .= "<input type='hidden' name='account' value ='{$buildData['uniqueAccountName']}'>";
				$output .= "<button type='submit' name='action' value='delete'>Delete Character</button> ";
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
	
	
	public function loadAccountCharacters()
	{
		$account = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		
		$query = "SELECT * FROM characters WHERE uniqueAccountName=\"$account\";";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
		if ($result === False) return $this->reportError("Error loading account character data!");
		
		$result->data_seek(0);
		$arrayData = array();
		
		while (($row = $result->fetch_assoc()))
		{
			$arrayData[$row['id']] = $row;
		}
		
		$this->accountCharacters = $arrayData;
		return True;
	}
	
	
	public function getAccountCharacterListHtml()
	{
		$output  = "<form method='get' id='ecdAccountCharForm'>\n";
		if ($this->viewRawData) $output .= "<input type='hidden' name='raw' value='' />\n";
		$output .= "<select name='id' class='ecdAccountCharList' onchange='this.form.submit();' >\n";
		
		uasort($this->accountCharacters, array('EsoCharDataViewer', 'SortBuildsByCharIndexAndName'));
	
		foreach ($this->accountCharacters as $charData)
		{
			$charName = $charData['name'];
			$charId = $charData['id'];
			$selected = "";
			if ($charId == $this->characterData['id']) $selected = "selected";
			
			$output .= "<option value='$charId' $selected>$charName</option>";	
		}
		
		$output .= "</select></form>\n";
		return $output;
	}
	
	
	public function getBreadcrumbTrailHtml()
	{
		$canViewMyChars = $this->wikiContext != null;
		$baseLink = $this->getBuildLink();
		$myLink = $baseLink . "?filter=mine";
		
		$output = "<div id='ecdTrail'>";
	
		if ($this->inputShowSummaryFor > 0)
		{
			$charName = $this->escape($this->characterData['name']);
			$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
			$output .= " : Viewing Account Characters for <b>$charName</b>";
		}
		else if ($this->characterId > 0)
		{
			$charLink = $this->getCharacterLink($this->characterId);
				
			if ($this->viewRawData)
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
				if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
				$output .= " : <a href='$charLink'>View Normal Character</a>";
			}
			elseif ($this->action == "managescreenshots")
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
				if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
				$output .= " : <a href='$charLink'>View Character</a>";
			}
			else
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
				if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
			}
			
			$output .= " : Account Characters ";
			$output .= $this->getAccountCharacterListHtml();
		}
		else if ($this->viewMyBuilds && $canViewMyChars)
		{
			$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
			$output .= " : Viewing My Characters";
			//$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			//$output .= "<a href='//esochars.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
		else
		{
			$output .= "Viewing all characters. ";
			if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
			//$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			//$output .= "<a href='//esochars.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
	
		$output .= "</div>";
		return $output;
	}
	
	
	public function getLeftCharacterMenuHtml()
	{
		$output = "<div id='ecdCharacterMenuRoot'>";
		$output .= "<div class='ecdCharacterMenuTitle'>Character Menu <div id='ecdCharMenuArrow'>&#x25BC;</div></div>";
		$output .= "<div class='ecdCharacterMenu' id='ecdCharacterMenu' style='display: none;'>";
		$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData'>Help</a>";
		$output .= "<a href='//en.uesp.net/wiki/UESPWiki_talk:EsoCharData'>Feedback</a>";
		$output .= "<a href='//esochars.uesp.net/submit.php'>Submit Data</a>";
		
		if ($this->characterId > 0)
		{
			$output .= "<a href='//esochars.uesp.net/submitScreenshot.php?charid={$this->characterId}' target='_blank'>Submit Screenshot</a>";
			$output .= "<a href='?id={$this->characterId}&action=managescreenshots'>Manage Screenshots</a>";
			$output .= "<a href='?copytobuild={$this->characterId}'>Copy to New Build</a>";
			$charLink = $this->ESO_SHORT_LINK_URL . "c/" . $this->characterId;
			$output .= "<a href='$charLink'>Link to Character</a>";
		}
		else
		{
			$output .= "<a href='' class='ecdMenuDisabled' onclick='return false;'>Submit Screenshot</a>";
			$output .= "<a href='' class='ecdMenuDisabled' onclick='return false;'>Manage Screenshots</a>";
			$output .= "<a href='' class='ecdMenuDisabled' onclick='return false;'>Copy to New Build</a>";
			$output .= "<a href='' class='ecdMenuDisabled' onclick='return false;'>Link to Character</a>";
		}
		
		$output .= "</div>";
		$output .= "</div>";
		
		$output .= $this->getCharacterScreenshotMenuHtml();
		
		return $output;
	}
	
	
	public function getShortCharacterLinkHtml()
	{
		$output = "";
		$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
		
		if ($this->characterId > 0 && $this->canWikiUserCreate())
		{
			$output .= "<a href='?copytobuild={$this->characterId}' class='ecdShortCharLink'>Copy to New Build</a>";
		}
		
		if ($this->characterId > 0) 
		{
			$charLink = $this->ESO_SHORT_LINK_URL . "c/" . $this->characterId;
			$output .= "<a href='$charLink' class='ecdShortCharLink'>Link to Character</a>";
		}
	
		$output .= "<a href='//esochars.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		return $output;
	}
			
	
	public function deleteBuild()
	{
		if (!parent::deleteBuild()) return false;
		
		$id = $this->characterId;
	
		$this->lastQuery = "DELETE FROM inventory WHERE characterId=$id;";
		$result = $this->db->query($this->lastQuery);
		if ($result === false) return $this->reportError("Database error trying to delete character inventory records!");
	
		return true;
	}
	
	
	public function getDeleteConfirmOutput($buildName, $charName, $id)
	{
		$output = "";
	
		$output .= "<form method='post' action=''>";
		$output .= "<b>Warning:</b> Once a character is deleted it cannot be restored. It can be re-uploaded again if desired.<p />";
		$output .= "Are you sure you wish to delete character <b>'$charName'</b> (id #$id)? <p />";
		$output .= "<button type='submit' name='confirm' value='1' class='ecdDeleteButton'>Yes, Delete this Character</button> &nbsp; &nbsp; ";
		$output .= "<button type='submit' name='nonconfirm' value='1'>Cancel</button>";
		$output .= "<input type='hidden' name='id' value='$id'>";
		$output .= "<input type='hidden' name='action' value='delete'>";
		$output .= "</form>";
	
		return $output;
	}
	
	
	public function getDeleteFailureOutput($buildName, $charName, $id)
	{
		return "Failed to delete character '$buildName' (id #$id)!";
	}
	
	
	public function getDeleteSuccessHtmlOutput($buildName, $charName, $id)
	{
		$output = "";
		$output .= $this->getBreadcrumbTrailHtml();
		$output  .= "<p />\n";
		$output  .= "Successfully deleted character '$charName' (id #$id)! <br/>";
		
		return $output;
	}
	
	
	public function createNewBuildFromCharacter()
	{
		$name = $this->db->real_escape_string($this->characterData['name']);
		$buildName = $this->db->real_escape_string($this->characterData['buildName']);
		$accountName = $this->db->real_escape_string($this->characterData['accoutName']);
		$uniqueAccountName = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		$wikiUserName = $this->db->real_escape_string($this->characterData['wikiUserName']);
		$class = $this->db->real_escape_string($this->characterData['class']);
		$race = $this->db->real_escape_string($this->characterData['race']);
		$buildType = $this->db->real_escape_string($this->characterData['buildType']);
		$alliance = $this->db->real_escape_string($this->characterData['alliance']);
		$level = $this->characterData['level'];
		$createTime = $this->characterData['createTime'];
		$championPoints = $this->characterData['cp'];
		$special = $this->db->real_escape_string($this->characterData['special']);
		$uploadTimestamp = $this->db->real_escape_string($this->characterData['uploadTimestamp']);
		$editTimestamp = $this->db->real_escape_string(date('Y-m-d G:i:s'));
		
		$query  = "INSERT INTO characters(name, buildName, accountName, uniqueAccountName, wikiUserName, class, race, buildType, level, createTime, championPoints, special, alliance, uploadTimestamp, editTimestamp) ";
		$query .= "VALUES(\"$name\", \"$buildName\", \"$accountName\", \"$uniqueAccountName\", \"$wikiUserName\", \"$class\", \"$race\", \"$buildType\", $level, $createTime, $championPoints, \"$special\", \"$alliance\", '$uploadTimestamp', '$editTimestamp');";
		$this->lastQuery = $query;
		$result = $this->db->query($query);
	
		if ($result === FALSE)
		{
			$this->reportError("Failed to create new build record from character data!");
			return -1;
		}
		
		return $this->db->insert_id;
	}
	
	
	public function createNewBuildCPs($buildId)
	{
		
		foreach ($this->characterData['championPoints'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$points = $data['points'];
			$desc = $this->db->real_escape_string($data['description']);
			$abilityId = $data['abilityId'];
			
			$query = "INSERT INTO championPoints(characterId, name, points, description, abilityId) ";
			$query .= "VALUES($buildId, '$name', $points, '$desc', $abilityId);";
			$this->lastQuery = $query;
			
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record championPoints data!");
		}
		
		return true;
	}
	
	
	public function createNewBuildBuffs($buildId)
	{
	
		foreach ($this->characterData['buffs'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$icon = $this->db->real_escape_string($data['icon']);
			$desc = $this->db->real_escape_string($data['description']);
			$abilityId = $data['abilityId'];
			$enabled = $data['enabled'];
				
			$query = "INSERT INTO buffs(characterId, name, icon, abilityId, description, enabled) ";
			$query .= "VALUES($buildId, '$name', '$icon', $abilityId, '$desc', $enabled);";
			$this->lastQuery = $query;
				
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record buffs data!");
		}
	
		return true;
	}
	
	
	public function createNewBuildSkills($buildId)
	{
	
		foreach ($this->characterData['skills'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$icon = $this->db->real_escape_string($data['icon']);
			$desc = $this->db->real_escape_string($data['description']);
			$abilityId = $data['abilityId'];
			$type = $this->db->real_escape_string($data['type']);
			$index = $data['index'];
			$rank = $data['rank'];
			$area = $this->db->real_escape_string($data['area']);
			$cost = $this->db->real_escape_string($data['cost']);
			$range = $this->db->real_escape_string($data['range']);
			$radius = $data['radius'];
			$castTime = $data['castTime'];
			$channelTime = $data['channelTime'];
			$duration = $data['duration'];
			$target = $this->db->real_escape_string($data['target']);			
	
			$query = "INSERT INTO skills(characterId, name, type, description, icon, abilityId, `index`, `rank`, area, cost, `range`, radius, castTime, channelTime, duration, target) ";
			$query .= "VALUES($buildId, '$name', '$type', '$desc', '$icon', $abilityId, $index, $rank, '$area', '$cost', '$range', $radius, $castTime, $channelTime, $duration, '$target');";
			$this->lastQuery = $query;
	
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record skills data!");
		}
	
		return true;
	}
	
	
	public function createNewBuildStats($buildId)
	{
	
		foreach ($this->characterData['stats'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$value = $this->db->real_escape_string($data['value']);
			
			$result = preg_match("#([^:]+):(.*)#", $name, $matches);
			
			if ($result)
			{
				if ($matches[1] == "Research") continue;
				if ($matches[1] == "Book") continue;
				if ($matches[1] == "Recipe") continue;
				if ($matches[1] == "Achievement") continue;
				if ($matches[1] == "AchievementPoints") continue;
				if ($matches[1] == "Crafting") continue;
				if ($matches[1] == "Research") continue;
			}
			
			$query = "INSERT INTO stats(characterId, name, value) ";
			$query .= "VALUES($buildId, '$name', '$value');";
			$this->lastQuery = $query;
	
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record stats data!");
		}
	
		return true;
	}
	
	
	public function createNewBuildEquipment($buildId)
	{
	
		foreach ($this->characterData['equipSlots'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$account = $this->db->real_escape_string($data['account']);
			$itemLink = $this->db->real_escape_string($data['itemLink']);
			$setName = $this->db->real_escape_string($data['setName']);
			$icon = $this->db->real_escape_string($data['icon']);
			$condition = $data['condition'];
			$index = $data['index'];
			$setCount = $data['setCount'];
			$value = $data['value'];
			$level = $data['level'];
			$quality = $data['quality'];
			$type = $data['type'];
			$equipType = $data['equipType'];
			$weaponType = $data['weaponType'];
			$armorType = $data['armorType'];
			$craftType = $data['craftType'];
			$stolen = $data['stolen'];
			$trait = $data['trait'];
			$style = $data['style'];
				
			$query = "INSERT INTO equipSlots(characterId, account, name, icon, itemLink, setName, `condition`, `index`, setCount, value, level, quality, type, equipType, weaponType, armorType, craftType, stolen, trait, style) ";
			$query .= "VALUES($buildId, '$account', '$name', '$icon', '$itemLink', '$setName', $condition, $index, $setCount, $value, $level, $quality, $type, $equipType, $weaponType, $armorType, $craftType, $stolen, $trait, $style);";
			$this->lastQuery = $query;
	
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record equipSlots data!");
		}
	
		return true;
	}
	
	
	public function createNewBuildActionBars($buildId)
	{
	
		foreach ($this->characterData['actionBars'] as $data)
		{
			$name = $this->db->real_escape_string($data['name']);
			$icon = $this->db->real_escape_string($data['icon']);
			$desc = $this->db->real_escape_string($data['description']);
			$abilityId = $data['abilityId'];
			$index = $data['index'];
			$area = $this->db->real_escape_string($data['area']);
			$cost = $this->db->real_escape_string($data['cost']);
			$range = $this->db->real_escape_string($data['range']);
			$radius = $data['radius'];
			$castTime = $data['castTime'];
			$channelTime = $data['channelTime'];
			$duration = $data['duration'];
			$target = $this->db->real_escape_string($data['target']);
	
			$query = "INSERT INTO actionBars(characterId, name, description, icon, abilityId, `index`, area, cost, `range`, radius, castTime, channelTime, duration, target) ";
			$query .= "VALUES($buildId, '$name', '$desc', '$icon', $abilityId, $index, '$area', '$cost', '$range', $radius, $castTime, $channelTime, $duration, '$target');";
			$this->lastQuery = $query;
	
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record actionBars data!");
		}
	
		return true;
	}
	
	
	public function createNewBuildScreenshots($buildId)
	{
		// Can't rename screenshot images if not running on content3
		return true;
		
		foreach ($this->characterData['screenshots'] as $data)
		{
			$newFilename = preg_replace("/^char-/", "build-", $data['filename']);
			
			$srcFilename = "/home/uesp/www/esobuilddata/screenshots/{$data['filename']}";
			$destFilename = "/home/uesp/www/esobuilddata/screenshots/$newFilename";
			
			$filename = $this->db->real_escape_string($newFilename);
			$origFilename = $this->db->real_escape_string($data['origFilename']);
			$caption = $this->db->real_escape_string($data['caption']);
			$uploadTimestamp = $this->db->real_escape_string($data['uploadTimestamp']);
			
			$query = "INSERT INTO screenshots(characterId, filename, origFilename, caption, uploadTimestamp) ";
			$query .= "VALUES($buildId, '$filename', '$origFilename', '$caption', '$uploadTimestamp');";
			$this->lastQuery = $query;
	
			$result = $this->db->query($query);
			if ($result === FALSE) $this->reportError("Failed to save new build record actionBars data!");
		}
		
		return true;
	}
	
	
	public function redirectToNewBuild($buildId)
	{
		header("Location: //esobuilds.uesp.net/b/$buildId");
		return true;
	}
	
	
	public function copyCharToNewBuild()
	{
		if ($this->copyCharToNewBuildCharId <= 0) return false;
		
		$this->characterId = $this->copyCharToNewBuildCharId;
				
		if (!$this->loadCharacter()) return true;
		if (!parent::initDatabaseWrite()) return true;
		
		$buildId = $this->createNewBuildFromCharacter();
		if ($buildId <= 0) return true;
		
		$this->createNewBuildCPs($buildId);
		$this->createNewBuildBuffs($buildId);
		$this->createNewBuildSkills($buildId);
		$this->createNewBuildStats($buildId);
		$this->createNewBuildEquipment($buildId);
		$this->createNewBuildActionBars($buildId);
		$this->createNewBuildScreenshots($buildId);
		
		$this->redirectToNewBuild($buildId);
		$this->outputHtml .= "<p/>Created <a href='//esobuilds.uesp.net/b/$buildId'><b>New Build!</b></a>";
				
		return true;
	}
	
	
	public function getAchievementContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
	
		$this->achievements->characterData = &$this->characterData;
		
		$output  = "<div id='ecdAchievementContents'>";
		$output .= $this->achievements->GetAchievementContentHtml();
		$output .= "</div>";
		$output .= "<div id='ecdAchievementTree'>";
		$output .= "<div class='ecdFindAchTextBox'>";
		$output .= "<input type='text' size='16' maxsize='32' value='' id='ecdFindAchInput' placeholder='Find Achievement' />";
		$output .= "<button onclick='OnFindEsoCharAchievement(this);'>Find...</button>"; 
		$output .= "</div>";
		$output .= $this->achievements->getAchievementTreeHtml();
		$output .= "</div>";
			
		return $output;
	}
	
	
	public function getAchievementTreeHtml() 
	{ 
		$this->achievements->characterData = &$this->characterData;
		return $this->achievements->GetAchievementTreeHtml();
	}
	
	
	public function GetSkyshardsTotal() 
	{
		$this->achievements->characterData = &$this->characterData;
		
		$skyshardCount = $this->achievements->GetSkyshardsFound();
		if ($skyshardCount == null) return "";
		
		$skyshardsFound = $skyshardCount['skyshardsFound'];
		$skyshardsTotal = $skyshardCount['skyshardsTotal'];
				
		$output = "<br/>$skyshardsFound / $skyshardsTotal";

		return $output; 
	}
	
	
	public function getCharBookContentHtml()
	{
		global $ESO_BOOK_COLLECTIONS;
		
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output = "";
		$leftOutput = "";
		$rightOutput = "";
		$totalBooks = 0;
		$totalKnownBooks = 0;
		$catArray = array();
		
		foreach ($ESO_BOOK_COLLECTIONS as $catIndex => $catData)
		{
			$catInfo = $catData[0];
			if ($catInfo == null) continue;
			
			$numCollections = $catInfo['numCollect'];
			$catName = preg_replace("/`/", "'", $catInfo['name']);
			$numCatBooks = $catInfo['numBooks'];
			$totalBooks += $numCatBooks;
			$knownCatBooks = 0;
			$collectArray = array();
							
			for ($collectIndex = 1; $collectIndex <= $numCollections; ++$collectIndex)
			{
				$collectData = $catData[$collectIndex];
				
				$collectName = preg_replace("/`/", "'", $collectData['name']);
				$collectIcon = $collectData['icon'];
				$numBooks = $collectData['numBooks'];
				$books = &$collectData['books'];
				$colKnownBooks = 0;
				
				if ($collectName == "" || $numBooks == 0) continue;
				
				$rightOutput .= "<div class='ecdBookList ecdScrollContent' id='ecdBookList_{$catIndex}_{$collectIndex}' categoryindex='$catIndex' collectionindex='$collectIndex' style='display: none;'>";
				$rightOutput .= "<div class='ecdBookListTitle'>$collectName</div>";
				$booksArray = array();
				
				foreach ($books as $bookId => $bookData)
				{
					$title = preg_replace("/`/", "'", $bookData['title']);
					$icon = $bookData['icon'];
					$iconUrl = MakeEsoIconLink($icon);
					
					$isKnown = $this->getCharStatField("Book:$bookId");
					$knownClass = "";
					
					if ($isKnown)
					{
						$knownClass = "ecdBookKnown";
						++$colKnownBooks;
						++$knownCatBooks;
						++$totalKnownBooks;
					}
					
					$bookOutput  = "<div class='ecdBookLine $knownClass' bookid='$bookId'>";
					$bookOutput .= $this->MakeIconTag($icon, "ecdBookSprite");
					$bookOutput .= " <div class='ecdBookTitle'>$title</div>";
					$bookOutput .= "</div>";
					
					$booksArray[$title] = $bookOutput;
				}
				
				ksort($booksArray);
				$rightOutput .= implode("", $booksArray);
				
				$rightOutput .= "</div>";
				$collectArray[$collectName] = "<div class='ecdBookCollection' categoryindex='$catIndex' collectionindex='$collectIndex'>$collectName <div class='ecdBookCollectionCount'>$colKnownBooks/$numBooks</div></div>";
			}
			
			ksort($collectArray);
			
			$catOutput  = "<div class='ecdBookCategory'>$catName $knownCatBooks/$numCatBooks</div>";
			$catOutput .= "<div class='ecdBookCollectionList' style='display: none'>";
			$catOutput .= implode("", $collectArray);
			$catOutput .= "</div>";
			
			$catArray[$catName] = $catOutput;
		}
		
		ksort($catArray);
		$leftOutput = implode("", $catArray);
		
		$output .= "<div class='ecdBookSearch' id='ecdBookSearchForm'>";
		$output .= "<input type='text' size='10' maxlength='32' id='ecdBookSearchText' placeholder='Find Book'/>";
		$output .= "<button onclick='OnEsoCharDataSearchBooks();'>Find...</button>";
		$output .= "</div>";
		
		$output .= "<div class='ecdBookCountTitle'>Books:</div> ";
		$output .= "<div class='ecdBookCount'>$totalKnownBooks/$totalBooks</div><br/>";
		
		$output .= "<div class='ecdBookLists'>$rightOutput</div>";
		$output .= "<div class='ecdBookTree ecdScrollContent'>$leftOutput</div>";
		
		$output .= "<div id='ecdBookRoot' class='ecdScrollContent' style='display:none;'><div class='ecdBookClose'></div><div id='ecdBookContents'></div></div>";
		
		return $output;
	}
	
	
	public function getCollectibleCollectibleContentsHtml_Collectibles($collectibles, $categoryIndex, $subCategoryIndex, $title)
	{
		if (count($collectibles) == 0) return "";
		
		$output = "";
		$knownCount = 0;
		$totalCount = 0;
				
		foreach ($collectibles as $collectIndex => $collectible)
		{
			++$totalCount;
			
			$collectibleId = $collectible['id'];
			$name = preg_replace("/`/", "'", $collectible['name']);
			$icon = $collectible['icon'];
			$iconUrl = MakeEsoIconLink($icon);
			$desc = preg_replace("/`/", "'", $collectible['desc']);
			$type = $collectible['type'];
			$image = $collectible['image'];
			
			$knownClass = "";			
			$isKnown = $this->getCharStatField("Collectible:$collectibleId", 0);
			
			if ($isKnown)
			{
				$knownClass = "ecdCollectibleKnown";
				++$knownCount;
			}
			
			$output .= "<div class='ecdCollectible $knownClass eso_item_link' collectid='$collectibleId'>";
			
			if ($icon != "") 
			{
				$output .= $this->MakeIconTag($icon, "ecdCollectSprite");
			}
			
			$output .= "$name";
			$output .= "</div>";			
		}
		
		$output .= "</div>";
		
		$output = "<div class='ecdCollectibleBlockTitle'>$title ($knownCount / $totalCount)</div>" . $output;
		$output = "<div class='ecdCollectibleBlock ecdScrollContent' id='ecdCollectible_{$categoryIndex}_{$subCategoryIndex}' style='display: none'>" . $output;
		
		return $output;
	}
	
	
	public function getCollectibleCollectibleContentsHtml()
	{
		global $ESO_COLLECTIBLE_DATA; // 2, 3, 5, 6, 7, 8, 9, 10, 11
		
		$categories = array(2, 3, 5, 6, 7, 8, 9, 10, 11);
		
		$output = "<div id='ecdCollectContents_Collectibles' collectid='Collectibles' class='ecdCollectContents' style='display: block;'>";
		$leftOutput = "";
		$rightOutput = "";
		
		foreach ($categories as $category)
		{
			$categoryData = $ESO_COLLECTIBLE_DATA[$category];
			if ($categoryData == null) continue;
			
			$categoryInfo = $categoryData[0];
			if ($categoryInfo == null) continue;
			
			$icon = $categoryInfo['icon'];
			$iconImage = "";
			if ($icon != "") $iconImage = "<img src='" . MakeEsoIconLink($categoryInfo['icon']) . "'>";
			
			$name = preg_replace("/`/", "'", strtoupper($categoryInfo['name']));
			$special = $categoryInfo['special'];
			$numSubCategories = $categoryInfo['numSubCategories'];
			$collectibles = $categoryInfo['collectibles'];
			$categoryIndex = $categoryInfo['categoryIndex'];
			
			$rightOutput .= $this->getCollectibleCollectibleContentsHtml_Collectibles($collectibles, $categoryIndex, 0, $name);
			
			$leftOutput .= "<div class='ecdCollectibleCategory' categoryindex='$categoryIndex'>$iconImage $name</div>";
			$leftOutput .= "<div class='ecdCollectibleSubcategories' style='display: none;'>";
			
			for ($subCategoryIndex = 1; $subCategoryIndex <= $numSubCategories; ++$subCategoryIndex)
			{
				$subCategoryData = $categoryData[$subCategoryIndex];
				if ($subCategoryData == null) continue;
				
				$name = preg_replace("/`/", "'", $subCategoryData['name']);
				$collectibles = $subCategoryData['collectibles'];
				
				$leftOutput .= "<div class='ecdCollectibleSubcategory' categoryindex='$categoryIndex' subcategoryindex='$subCategoryIndex'>$name</div>";
				$rightOutput .= $this->getCollectibleCollectibleContentsHtml_Collectibles($collectibles, $categoryIndex, $subCategoryIndex, $name);
			}
			
			$leftOutput .= "</div>";
		}
		 
		$output .= "<div class='ecdCollectibleDetails'>$rightOutput</div>";
		$output .= "<div class='ecdCollectibleTree ecdScrollContent'>$leftOutput</div>";
		$output .= "</div>";
		return $output;				
	}
	
	
	public function getCollectibleHousingContentsHtml()
	{
		global $ESO_COLLECTIBLE_DATA; // 4
		
		$totalCount = 0;
		$knownCount = 0;
		
		$housingData = $ESO_COLLECTIBLE_DATA[4];
		if ($housingData == null || $housingData[0] == null) return "";

		$output = "";
		
		$numSubCategories = $housingData[0]['numSubCategories'];
		$catHouseData = array();
		
		for ($subCategoryIndex = 1; $subCategoryIndex <= $numSubCategories; ++$subCategoryIndex)
		{
			$catOutput = "";
			
			$houseCatData = $housingData[$subCategoryIndex];
			if ($houseCatData == null) continue;
			
			$catName = strtoupper(preg_replace("/`/", "'", $houseCatData['name']));
			$houses = $houseCatData['collectibles'];
			
			$catOutput .= "<div class='ecdCollectibleHouseCategory'>$catName</div>";
			$catOutput .= "<div class='ecdCollectibleHouseCategoryList'>";
			
			$subCatHouseData = array();
			
			foreach ($houses as $houseData)
			{
				$subCatOutput = "";
				++$totalCount;
				
				$collectibleId = $houseData['id'];
				$name = preg_replace("/`/", "'", $houseData['name']);
				$desc = preg_replace("/`/", "'", $houseData['desc']);
				$icon = $houseData['icon'];
				$iconHtml = "";
				
				if ($icon) 
				{
					$iconHtml = $this->MakeIconTag($icon, "ecdHouseSprite");
				}
				
				$image = $houseData['image'];
				
				$knownClass = "";			
				$isKnown = $this->getCharStatField("Collectible:$collectibleId", 0);
				
				if ($isKnown)
				{
					$knownClass = "ecdCollectibleKnown";
					++$knownCount;
				}
				
				$subCatHouseData[$name] = "<div class='ecdCollectibleHouse $knownClass eso_item_link' collectid='$collectibleId'>$iconHtml$name</div>";
			}
			
			ksort($subCatHouseData);
			$catOutput .= implode("", $subCatHouseData); 
			$catOutput .= "</div>";
			
			$catHouseData[$catName] = $catOutput;
		}
		
		ksort($catHouseData);
		$output .= implode("", $catHouseData);
		
		$output .= "</div>";
		$output = "<div class='ecdCollectHouseCount'>You own $knownCount / $totalCount homes</div>" . $output;
		$output = "<div id='ecdCollectContents_Housing' collectid='Housing' class='ecdCollectContents ecdScrollContent' style='display: none;'>" . $output;
		
		return $output;				
	}
	
	
	public function getCollectibleDLCContentsHtml()
	{
		global $ESO_COLLECTIBLE_DATA; // 1
				
		$storyData = $ESO_COLLECTIBLE_DATA[1];
		if ($storyData == null || $storyData[0] == null) return "";
		
		$numSubCategories = $storyData[0]['numSubCategories'];
		$catDlcData = array();
		$totalCount = 0;
		$knownCount = 0;
		$output = "";
		$leftOutput = "";
		$rightOutput = "";
		
		for ($subCategoryIndex = 1; $subCategoryIndex <= $numSubCategories; ++$subCategoryIndex)
		{
			$catOutput = "";
			
			$catStoryData = $storyData[$subCategoryIndex];
			if ($catStoryData == null) continue;
			
			$catName = strtoupper(preg_replace("/`/", "'", $catStoryData['name']));
			$dlcData = $catStoryData['collectibles'];
			
			$catOutput .= "<div class='ecdCollectibleDlcCategory'>$catName</div>";
			$catOutput .= "<div class='ecdCollectibleDlcCategoryList'>";
			
			$subCatDlcData = array();
			
			foreach ($dlcData as $dlc)
			{
				$subCatOutput = "";
				++$totalCount;
				
				$collectibleId = $dlc['id'];
				$name = preg_replace("/`/", "'", $dlc['name']);
				$desc = preg_replace("/`/", "'", $dlc['desc']);
				$icon = $dlc['icon'];
				$iconHtml = "";
				
				if ($icon) 
				{
					$iconHtml = $this->MakeIconTag($icon, "ecdDlcSprite");
				}
				
				$image = $dlc['image'];
				
				$knownClass = "";			
				$isKnown = $this->getCharStatField("Collectible:$collectibleId", 0);
				
				if ($isKnown)
				{
					$knownClass = "ecdCollectibleKnown";
					++$knownCount;
				}
				
				$subCatDlcData[$name] = "<div class='ecdCollectibleDlc $knownClass eso_item_link' collectid='$collectibleId'>$iconHtml$name</div>";
			}
			
			ksort($subCatDlcData);
			$catOutput .= implode("", $subCatDlcData); 
			$catOutput .= "</div>";
			
			$catDlcData[$catName] = $catOutput;
		}
		
		ksort($catDlcData);
		$output .= implode("", $catDlcData);
		
		$output .= "</div>";
		$output = "<div class='ecdCollectDlcCount'>You own $knownCount / $totalCount stories</div>" . $output;
		$output = "<div id='ecdCollectContents_DLC' collectid='DLC' class='ecdCollectContents' style='display: none;'>" . $output;
		
		return $output;				
	}
	
	
	public function getCollectibleOutfitStylesContentsHtml()
	{
		global $ESO_COLLECTIBLE_DATA; // 12, 13
		
		$OUTFIT_TYPE_STRINGS = array(
				"Head" => array(
							"Hat" => "Light",
							"Helmet" => "Medium",
							"Helm" => "Heavy",
						),
				"Chest" => array(
							"Jerkin" => "Light",
							"Robe" => "Light",
							"Jack" => "Medium",
							"Cuirass" => "Heavy",
							"Shirt" => "Clothing",
						),
				"Legs" => array(
							"Breeches" => "Light",
							"Guards" => "Medium",
							"Greaves" => "Heavy",
							"Trousers" => "Clothing",
							"Skirt" => "Clothing",
						),
				"Shoulders" => array(
							"Epaulets" => "Light",
							"Arm Cops" => "Medium",
							"Pauldrons" => "Heavy",
						),
				"Feet" => array(
							"Shoes" => "Light",
							"Boots" => "Medium",
							"Sabatons" => "Heavy",
							"Sandals" => "Clothing",
						),
				"Hands" => array(
							"Gloves" => "Light",
							"Bracers" => "Medium",
							"Gauntlets" => "Heavy",
							"Chains" => "Clouthing",
						),
				"Waist" => array(
							"Sash" => "Light",
							"Belt" => "Medium",
							"Girdle" => "Heavy",
						),
				"Two-Handed" => array(
							"Battle Axe" => "Axe",
							"Maul" => "Hammer",
							"Greatsword" => "Sword",
						),
				"One-Handed" => array(
							"Axe" => "Axe",
							"Hammer" => "Hammer",
							"Sword" => "Sword",
							"Dagger" => "Dagger",
						),
			);
		
		$totalCount = 0;
		$knownCount = 0;
		$output = "";
		$rightOutput = "";
		$leftOutput = "";
				
		foreach (array(12, 13) as $styleIndex)
		{
			$styleData = $ESO_COLLECTIBLE_DATA[$styleIndex];
			if ($styleData == null || $styleData[0] == null) continue;
						
			$categoryInfo = $styleData[0];
			if ($categoryInfo == null) continue;
			
			$icon = $categoryInfo['icon'];
			$iconImage = "";
			if ($icon != "") $iconImage = "<img src='" . MakeEsoIconLink($categoryInfo['icon']) . "'>";
			
			$catName = preg_replace("/`/", "'", strtoupper($categoryInfo['name']));
			$special = $categoryInfo['special'];
			$numSubCategories = $categoryInfo['numSubCategories'];
			$collectibles = $categoryInfo['collectibles'];
			$categoryIndex = $categoryInfo['categoryIndex'];
			
			$leftOutput .= "<div class='ecdOutfitCategory' categoryindex='$categoryIndex'>$iconImage $catName</div>";
			$leftOutput .= "<div class='ecdOutfitSubcategories' style='display: none;'>";			
						
			$knownCatCount = 0;
			$totalCatCount = 0;			
			
			for ($subCategoryIndex = 1; $subCategoryIndex <= $numSubCategories; ++$subCategoryIndex)
			{
				$subCategoryData = $styleData[$subCategoryIndex];
				if ($subCategoryData == null) continue;
				
				$title = preg_replace("/`/", "'", $subCategoryData['name']);
				$collectibles = $subCategoryData['collectibles'];
															
				$knownSubCatCount = 0;
				$totalSubCatCount = 0;
				
				$OUTFIT_TYPE_CATEGORY = $OUTFIT_TYPE_STRINGS[$title];
				$outfitData = array();
				$knownOutfitData = array();
				
				foreach ($collectibles as $collectIndex => $collectible)
				{
					++$totalSubCatCount;
					
					$collectibleId = $collectible['id'];
					$name = preg_replace("/`/", "'", $collectible['name']);
					$icon = $collectible['icon'];
					$iconUrl = MakeEsoIconLink($icon);
					$desc = preg_replace("/`/", "'", $collectible['desc']);
					$type = $collectible['type'];
					$image = $collectible['image'];
					
					$outfitType = $title;
					
					if ($OUTFIT_TYPE_CATEGORY)
					{
						foreach($OUTFIT_TYPE_CATEGORY as $searchTerm => $targetType)
						{
							$result = preg_match("/$searchTerm/", $name);
							
							if ($result) 
							{
								$outfitType = $targetType;
								break;
							}	
						}
					}
					
					$knownClass = "";			
					$isKnown = $this->getCharStatField("Collectible:$collectibleId", 0);
										
					if ($outfitData[$outfitType] == null) 
					{
						$outfitData[$outfitType] = array();
						$knownOutfitData[$outfitType] = 0;
					}
					
					if ($isKnown)
					{
						$knownClass = "ecdOutfitKnown";
						++$knownSubCatCount;
						++$knownOutfitData[$outfitType];
					}					
					
					$outfitOutput = "";
					$outfitOutput .= "<div class='ecdOutfit $knownClass eso_item_link' collectid='$collectibleId'>";
					
					if ($icon != "") 
					{
						$outfitOutput .= $this->MakeIconTag($icon, "ecdOutfitSprite");
					}
					$outfitOutput .= "</div>";
					
					$outfitData[$outfitType][] = $outfitOutput;
				}
				
				$rightOutput .= "<div class='ecdOutfitBlock ecdScrollContent' id='ecdOutfit_{$categoryIndex}_{$subCategoryIndex}' style='display: none'>";
				$rightOutput .= "<div class='ecdOutfitBlockTitle'>$title ($knownSubCatCount / $totalSubCatCount)</div>";
				
				uksort($outfitData, "cmpEsoOutfitTypes");
				
				foreach ($outfitData as $outfitType => $typeData)
				{
					$count = count($typeData);
					$known = $knownOutfitData[$outfitType];
					if (count($outfitData) > 1) $rightOutput .= "<div class='ecdOutfitTypeTitle'>$outfitType ($known / $count)</div>";
					$rightOutput .= implode("", $typeData);
				}
				
				$rightOutput .= "</div>";
				
				$knownCatCount += $knownSubCatCount;
				$totalCatCount += $totalSubCatCount;
				
				$leftOutput .= "<div class='ecdOutfitSubcategory' categoryindex='$categoryIndex' subcategoryindex='$subCategoryIndex'>$title</div>";
			}
			
			$totalCount += $knownCatCount;
			$knownCount += $totalCatCount;
						
			$leftOutput .= "</div>";				
		}				
		
		$output .= "<div class='ecdOutfitDetails'>$rightOutput</div>";
		$output .= "<div class='ecdOutfitTree ecdScrollContent'>$leftOutput</div>";
		$output .= "</div>";
		$output = "<div id='ecdCollectContents_OutfitStyles' collectid='OutfitStyles' class='ecdCollectContents' style='display: none;'>" . $output;
		
		return $output;				
	}
	
	
	public function getCollectibleContentsHtml() 
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output = "<div class='ecdCollectMenuBar'>";
		$output .= "<div id='ecdCollectMenuTitle'>COLLECTIBLES</div>";
		$output .= "<div class='ecdCollectMenuItem ecdCollectMenuItemSelected' title='Collectibles' collectid='Collectibles' id='ecdCollectMenuItem_Collectibles'></div>";
		$output .= "<div class='ecdCollectMenuItem' title='Stories' collectid='DLC' id='ecdCollectMenuItem_DLC'></div>";
		$output .= "<div class='ecdCollectMenuItem' title='Housing' collectid='Housing' id='ecdCollectMenuItem_Housing'></div>";
		$output .= "<div class='ecdCollectMenuItem' title='Outfit Styles' collectid='OutfitStyles' id='ecdCollectMenuItem_OutfitStyles'></div>";
		$output .= "</div>";
		$output .= "<div class='ecdCollectTitle'>COLLECTIONS</div>";
		
		$output .= $this->getCollectibleCollectibleContentsHtml();
		$output .= $this->getCollectibleHousingContentsHtml();
		$output .= $this->getCollectibleDLCContentsHtml();
		$output .= $this->getCollectibleOutfitStylesContentsHtml();
		
		return $output; 
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
		$output .= "<div class='ecdSkillContentTitle'>Recipes<small> ($knownCount / $totalCount Known)</small></div>";
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
			$output .= "<div class='ecdRecipeTitle'>$listName ($knownCount / $listCount Known)<div class='ecdRecipeTitleArrow'>&#9660;</div></div>";
			$output .= "<div class='ecdRecipeList' style='display: none;'>";
			
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
				
				if ($itemId == null || $itemId <= 0) $itemId = $recipeData['result'];
				
				$output .= "<div class='ecdRecipeItem eso_item_link $extraClass $qualityClass' itemid='$itemId' inttype='1' intlevel='1'>$name</div>";
			}
			
			$output .= "</div>";
		}
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharSkillHirelingsContentHtml() 
	{
		$blackHireling = intval($this->getCharStatField('HirelingMailTime:Blacksmithing', 0));
		$clothHireling = intval($this->getCharStatField('HirelingMailTime:Clothier', 0));
		$enchantHireling = intval($this->getCharStatField('HirelingMailTime:Enchanting', 0));
		$provHireling = intval($this->getCharStatField('HirelingMailTime:Provisioning', 0));
		$woodHireling = intval($this->getCharStatField('HirelingMailTime:Woodworking', 0));
			
		$blackSkill = intval($this->getCharStatField('HirelingSkill:Blacksmithing', 0));
		$clothSkill = intval($this->getCharStatField('HirelingSkill:Clothier', 0));
		$enchantSkill = intval($this->getCharStatField('HirelingSkill:Enchanting', 0));
		$provSkill = intval($this->getCharStatField('HirelingSkill:Provisioning', 0));
		$woodSkill = intval($this->getCharStatField('HirelingSkill:Woodworking', 0));
		
		$blackTime = (($blackSkill >= 3) ? 12 : 24) * 3600 + $blackHireling;
		$clothTime = (($clothSkill >= 3) ? 12 : 24) * 3600 + $clothHireling;
		$enchantTime = (($enchantSkill >= 3) ? 12 : 24) * 3600 + $enchantHireling;
		$provTime = (($provSkill >= 3) ? 12 : 24) * 3600 + $provHireling;
		$woodTime = (($woodSkill >= 3) ? 12 : 24) * 3600 + $woodHireling;
		
		$currentTime = time(); 
		
		$blackTimeFmt = "None";
		$clothTimeFmt = "None";
		$enchantTimeFmt = "None";
		$provTimeFmt = "None";
		$woodTimeFmt = "None";
		
		$blackHireLevel = str_repeat("I", $blackSkill);
		$clothHireLevel = str_repeat("I", $clothSkill);
		$enchantHireLevel = str_repeat("I", $enchantSkill);
		$provHireLevel = str_repeat("I", $provSkill);
		$woodHireLevel = str_repeat("I", $woodSkill);
		
		if ($blackHireling > 0) 
		{
			if ($blackTime > $currentTime)
				$blackTimeFmt = $this->formatTimeLeft($blackTime - $currentTime);
			else
				$blackTimeFmt = "Ready!";
		}
		
		if ($clothHireling > 0)
		{
			if ($clothTime > $currentTime)
				$clothTimeFmt = $this->formatTimeLeft($clothTime - $currentTime);
			else
				$clothTimeFmt = "Ready!";
		}
		
		if ($enchantHireling > 0)
		{
			if ($enchantTime > $currentTime)
				$enchantTimeFmt = $this->formatTimeLeft($enchantTime - $currentTime);
			else
				$enchantTimeFmt = "Ready!";
		}
		
		if ($provHireling > 0)
		{
			if ($provTime > $currentTime)
				$provTimeFmt = $this->formatTimeLeft($provTime - $currentTime);
			else
				$provTimeFmt = "Ready!";
		}
		
		if ($woodHireling > 0)
		{
			if ($woodTime > $currentTime)
				$woodTimeFmt = $this->formatTimeLeft($woodTime - $currentTime);
			else
				$woodTimeFmt = "Ready!";
		}
		
		$output  = "<div id='ecdSkill_Hirelings' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div class='ecdSkillContentTitle'>Craft Hirelings</div><br/>";
		
		$output .= "<div class='ecdHirelingTitle'>Blacksmithing $blackHireLevel:</div> <div class='ecdHirelingTime' timestamp='$blackHireling' skill='$blackSkill'>$blackTimeFmt</div><br/>";
		$output .= "<div class='ecdHirelingTitle'>Clothing $clothHireLevel:</div> <div class='ecdHirelingTime' timestamp='$clothHireling' skill='$clothSkill'>$clothTimeFmt</div><br/>";
		$output .= "<div class='ecdHirelingTitle'>Enchanting $enchantHireLevel:</div> <div class='ecdHirelingTime' timestamp='$enchantHireling' skill='$enchantSkill'>$enchantTimeFmt</div><br/>";
		$output .= "<div class='ecdHirelingTitle'>Provisioning $provHireLevel:</div> <div class='ecdHirelingTime' timestamp='$provHireling' skill='$provSkill'>$provTimeFmt</div><br/>";
		$output .= "<div class='ecdHirelingTitle'>Woodworking $woodHireLevel:</div> <div class='ecdHirelingTime' timestamp='$woodHireling' skill='$woodSkill'>$woodTimeFmt</div><br/>";
		
		$output .= "</div>";
		return $output;
	}
	
	
	public function getCharSkillMotifContentHtml()
	{
		$output  = "<div id='ecdSkill_Motifs' class='ecdSkillData ecdScrollContent' style='display: none;'>\n";
		$output .= "<div class='ecdSkillContentTitle'>Crafting Motifs</div>";
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

	
};



function cmpEsoOutfitTypes($a, $b)
{
	static $OUTFIT_TYPES = array(
				"Light" => 1,
				"Medium" => 2,
				"Heavy" => 3,
				"Clothing" => 4,
				"Axe" => 1,
				"Hammer" => 2,
				"Sword" => 3,
				"Dagger" => 4,
			);
	
	$a1 = $OUTFIT_TYPES[$a];
	if ($a1 == null) $a1 = 10;
	
	$b1 = $OUTFIT_TYPES[$b];
	if ($b1 == null) $b1 = 10;
	
	return $a1 > $b1;
}


function cmpQuestZoneData($a, $b)
{
	$name1 = $a['name'];
	$name2 = $b['name'];
	return strcmp($name1, $name2);
}
