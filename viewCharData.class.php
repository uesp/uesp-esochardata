<?php 


require_once("viewBuildData.class.php");
require_once("/home/uesp/secrets/esochardata.secrets");
require_once("/home/uesp/esolog.static/viewAchievements.class.php");
require_once("/home/uesp/esolog.static/esoBookCollectionData.php");
require_once("/home/uesp/esolog.static/esoCollectibleData.php");


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
	
	
	public function __construct ()
	{
		parent::__construct();
		
		$this->ESO_HTML_TEMPLATE = "templates/esochardata_embed_template.txt";
		$this->ESO_SHORT_LINK_URL = "//esochars.uesp.net/";
		$this->baseUrl = "viewCharData.php";
		
		$this->hasCharacterInventory = true;
		$this->hasCharacterBank      = true;
		$this->hasCharacterCraftBag  = true;
		$this->hasResearchOutput     = true;
		$this->hasRecipeOutput       = true;
		$this->hasAchievementOutput  = true;
		
		$this->achievements = new CEsoViewAchievements(false);
	}
	
	
	public function initDatabase ()
	{
		global $uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase;
	
		if ($this->dbReadInitialized || $this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoCharDataReadDBHost, $uespEsoCharDataReadUser, $uespEsoCharDataReadPW, $uespEsoCharDataDatabase);
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
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
		if ($db->connect_error) return $this->reportError("Could not connect to mysql database!");
	
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
	
	
	public function getCharQuestContentHtml()
	{
		if ($this->useAsyncLoad) return $this->GetAsyncLoadContentsHtml();
		
		$output = "";
		$leftOutput = "<div id='ecdQuestList'>";
		$rightOutput = "<div id='ecdQuestDetails' class=''>";
		$questTree = array();
		$completedQuests = array();
		
		$numJournalQuests = $this->getCharStatField("NumJournalQuests", 0);
		
		$leftOutput .= "<div class='ecdQuestCountTitle'>Quests: </div> <div class='ecdQuestCount'> $numJournalQuests / 25</div><p/>";
		$firstStyle = "display: none;";
		
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
			else if ($questZone == "") 
			{
				$questZone = "Other";
			}
			
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
						
			$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='$firstStyle' id='ecdQuestJournal$i' journalindex='$i'>";			
			$rightOutput .= "<div class='ecdQuestDetailTitle'>$questName</div>";			
			$rightOutput .= "<div class='ecdQuestDetailType'>$typeHtml</div>";
			$rightOutput .= "<div class='ecdQuestDetailRepeat'>$repeatHtml</div><br/>";
			$rightOutput .= "<div class='ecdQuestDetailDesc'><p>$questText</p><p>$activeText</p></div>";
			$rightOutput .= "<img class='' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='100%' height='4px' />";
			$rightOutput .= "<div class='ecdQuestDetailTaskTitle'>TASKS</div>";
			$rightOutput .= "<div class='ecdQuestDetailTasks'>$taskHtml</div>";
			$rightOutput .= "</div>";
			
			$firstStyle = "display: none;";
		}
		
		ksort($questTree);
		$firstStyle = "display: block;";
		$firstClass = "ecdQuestSelected";
		
		foreach ($questTree as $questZone => $quests)
		{
			$zone = strtoupper($questZone);
			$leftOutput .= "<div class='ecdQuestZoneTitle $firstClass'>$zone</div><div class='ecdQuestZoneList' style='$firstStyle'>";
			$firstStyle = 'display: none;';
			
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
			
			$firstClass = '';
			$leftOutput .= "</div>";
		}
		
		$numCompletedQuests = $this->getCharStatField("NumCompletedQuests", 0);
		
		$leftOutput .= "<img class='ecdImageFlip' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' />";
		$leftOutput .= "<img class='' src='{$this->baseResourceUrl}resources/eso_equip_bar.png' width='49%' />";
		$leftOutput .= "<div class='ecdQuestZoneTitle'>ALL QUESTS</div>";
		$leftOutput .= "<div class='ecdQuestZoneList' style='display: none;'>";
		$leftOutput .= "<div class='ecdQuestName' journalindex='Completed'>Completed Quests ($numCompletedQuests)</div>";
		$leftOutput .= "<div class='ecdQuestName' journalindex='Missing'>Missing Quests (?)</div>";
		$leftOutput .= "</div>";		
				
		for ($i = 1; $i <= $numCompletedQuests; ++$i)
		{
			$questData = explode("|", $this->getCharStatField("Quest:$i", ""));
			if ($questData[4] === null) continue; 
			
			$questId = $questData[0];
			$questName = $questData[1];
			$questType = $questData[2];
			$questZone = $questData[3];
			$questObjective = $questData[4];
						
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
			else if ($questZone == "") 
			{
				$questZone = "Other";
			}
			
			if ($completedQuests[$questZone] == null) $completedQuests[$questZone] = array();
			
			$completedQuests[$questZone][$questName] = array(
					"id" => $questId,
					//"name" => $questName,
					"type" => $questType,
					"objective" => $questObjective,
				);
		}
		
		ksort($completedQuests);
		
		$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournalCompleted' journalindex='Completed'>";
		$rightOutput .= "<div class='ecdQuestDetailSearch' id='ecdQuestCompleteSearchForm'>";
		$rightOutput .= "<input type='text' size='10' maxlength='32' id='ecdQuestCompleteSearchText' placeholder='Find Quest'/>";
		$rightOutput .= "<button onclick='OnEsoCharDataSearchCompletedQuests();'>Find...</button>";
		$rightOutput .= "</div>";
		$rightOutput .= "<div class='ecdQuestDetailTitle'>COMPLETED QUESTS</div>";
		$rightOutput .= "This character has completed $numCompletedQuests unique quests.<p/>";
		
		foreach ($completedQuests as $questZone => $zoneData)
		{
			ksort($zoneData);

			$questZone = strtoupper($questZone);
			$questCount = count($zoneData);
			$rightOutput .= "<div class='ecdQuestZoneTitle1'>$questZone ($questCount)</div>";
			$rightOutput .= "<div class='ecdQuestZoneList1' style='display: none;'>";
						
			foreach ($zoneData as $questName => $questData)
			{
				$questId = $questData['id'];
				$questType = $questData['type'];
				$questObj = $questData['objective'];
				$imageHtml = "";
				
				if ($questType == 1)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_trial.png'>";
				}
				else if ($questType == 5)
				{
					$imageHtml = "<img src='{$this->baseResourceUrl}resources/journal_quest_group_instance.png'>";
				}
				
				if ($questObj != "")
					$rightOutput .= "<div class='ecdQuestName1'>$imageHtml$questName ($questObj)</div>";
				else
					$rightOutput .= "<div class='ecdQuestName1'>$imageHtml$questName</div>";
			}
			
			$rightOutput .= "</div>";
		}
		
		$rightOutput .= "</div>";
		
		$rightOutput .= "<div class='ecdQuestDetail ecdScrollContent' style='display: none;' id='ecdQuestJournalMissing' journalindex='Missing'>";
		$rightOutput .= "<div class='ecdQuestDetailSearch' id='ecdQuestMissingSearchForm'>";
		$rightOutput .= "<input type='text' size='10' maxlength='32' id='ecdQuestMissingSearchText' placeholder='Find Quest'/>";
		$rightOutput .= "<button onclick='OnEsoCharDataSearchMissingQuests();'>Find...</button>";
		$rightOutput .= "</div>";
		$rightOutput .= "<div class='ecdQuestDetailTitle'>MISSING QUESTS</div>";
		$rightOutput .= "This character is missing ? quests.<p/>";
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
			$this->loadAccountBuffs($this->buildData[0]['accountName']);			
		}
		
		//usort($this->buildData, array('EsoCharDataViewer', 'SortBuildsByName'));
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
		$output .= $this->createCharRidingSummaryHtml();
		$output .= $this->createCharResearchSummaryHtml();
		$output .= $this->createCharMotifSummaryHtml();
				
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
		$output .= "<th>Blacksmith<br/>Hireling</th>";
		$output .= "<th>Clothier<br/>Hireling</th>";
		$output .= "<th>Enchanter<br/>Hireling</th>";
		$output .= "<th>Provisioner<br/>Hireling</th>";
		$output .= "<th>Woodworker<br/>Hireling</th>";
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
			
			$blackHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Blacksmithing', 0));
			$clothHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Clothier', 0));
			$enchantHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Enchanting', 0));
			$provHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Provisioning', 0));
			$woodHireling = intval($this->getAccountStatsField($charId, 'HirelingMailTime:Woodworking', 0));
			
			$blackSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Blacksmithing', 0));
			$clothSkilll = intval($this->getAccountStatsField($charId, 'HirelingSkill:Clothier', 0));
			$enchantSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Enchanting', 0));
			$provSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Provisioning', 0));
			$woodSkill = intval($this->getAccountStatsField($charId, 'HirelingSkill:Woodworking', 0));
			
			$secondsPlayed = intval($this->getAccountStatsField($charId, 'SecondsPlayed', 0));
			$timePlayedFmt = $this->formatTimeLeft($secondsPlayed);
			
			$blackTime = (($blackSkill >= 3) ? 12 : 24) * 3600 + $blackHireling;
			$clothTime = (($clothSkilll >= 3) ? 12 : 24) * 3600 + $clothHireling;
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
			
			$totalGold += $gold;
			$totalAP += $ap;
			$totalTelvar += $telvar;
			$totalVouchers += $voucher;
			$totalInvUsed += $invUsed;
			$totalInv += $invTotal;
			$totalSkillPoints += $skillPoints;
			$totalAchPoints += $achPoints;
			$totalSecondsPlayed += $secondsPlayed;
			
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
			$output .= "<td>$blackTimeFmt</td>";
			$output .= "<td>$clothTimeFmt</td>";
			$output .= "<td>$enchantTimeFmt</td>";
			$output .= "<td>$provTimeFmt</td>";
			$output .= "<td>$woodTimeFmt</td>";
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
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "<td>-</td>";
		$output .= "</tr>";
		
		$timePlayedFmt = $this->formatTimeLeft($totalSecondsPlayed);
		$transmuteCrystals = intval($this->getAccountStatsField($maxCharId, 'TransmuteCrystals', 0));
		
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
		$output .= "<th>-</th>";
		$output .= "<th>-</th>";
		$output .= "<th>-</th>";
		$output .= "<th>-</th>";
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
				$output .= "<button type='submit' name='action' value='changePassword'>Change Password</button> ";
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
	
		if ($this->characterId > 0)
		{
			$charLink = $this->getCharacterLink($this->characterId);
				
			if ($this->viewRawData)
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
				if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
				$output .= " : <a href='$charLink'>View Normal Character</a>";
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
			$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			$output .= "<a href='//esochars.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
		else
		{
			$output .= "Viewing all characters. ";
			if ($canViewMyChars) $output .= " : <a href='$myLink'>View My Characters</a>";
			$output .= "<a href='//en.uesp.net/wiki/UESPWiki:EsoCharData' class='ecdShortCharLink'>Help</a>";
			$output .= "<a href='//esochars.uesp.net/submit.php' class='ecdShortCharLink'>Submit Log</a>";
		}
	
		$output .= "</div>";
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
					$bookOutput .= "<img src='$iconUrl'>";
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
			if ($icon != "") $output .= "<img src='$iconUrl'><br />";
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
				if ($icon) $iconHtml = "<img src='" . MakeEsoIconLink($icon) . "'>"; 
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
				if ($icon) $iconHtml = "<img src='" . MakeEsoIconLink($icon) . "'>"; 
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
					if ($icon != "") $outfitOutput .= "<img src='$iconUrl'><br />";
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