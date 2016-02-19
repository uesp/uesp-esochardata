<?php 


require("viewBuildData.class.php");
require_once("/home/uesp/secrets/esochardata.secrets");


class EsoCharDataViewer extends EsoBuildDataViewer
{
	
	public function __construct ()
	{
		parent::__construct();
		
		$this->ESO_HTML_TEMPLATE = "templates/esochardata_embed_template.txt";
		$this->ESO_SHORT_LINK_URL = "http://esochars.uesp.net/";
		$this->baseUrl = "viewCharData.php";
		
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
	
	
	public function getInventoryContentHtml()
	{
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
		$stolen = $item['stolen'];
		$itemId = 0;
		$itemIntSubType = 0;
		$itemIntLevel = 0;
		$stolenIcon = "";
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
			$stolenIcon = "<img src='resources/stolenitem.png' class='ecdStolenItemIcon' /><div style='display:none;'>1</div>";
		}
			
		$output .= "<tr class='eso_item_link' itemlink='$itemLink' itemid='$itemId' inttype='$itemIntSubType' intlevel='$itemIntLevel' localid='$localId'>";
		$output .= "<td>$stolenIcon</td>";
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
				<div class='ecdItemFilterContainer ecdItemFilterAll selected' style="background-image: url('resources/allfilter.png');" onclick="OnItemFilter('All');" itemfilter="all" /></div> 
				<div class='ecdItemFilterContainer ecdItemFilterWeapon' style="background-image: url('resources/weaponfilter.png');" onclick="OnItemFilter('Weapon');"  itemfilter="weapon" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterArmor' style="background-image: url('resources/armorfilter.png');" onclick="OnItemFilter('Armor');"  itemfilter="armor" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterConsumable' style="background-image: url('resources/consumablefilter.png');" onclick="OnItemFilter('Consumable');"  itemfilter="consumable" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterMaterial' style="background-image: url('resources/materialfilter.png');" onclick="OnItemFilter('Material');"  itemfilter="material" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterMisc' style="background-image: url('resources/miscfilter.png');" onclick="OnItemFilter('Misc');"  itemfilter="misc" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterQuest' style="background-image: url('resources/questfilter.png');" onclick="OnItemFilter('Quest');"  itemfilter="quest" /></div>
				<div class='ecdItemFilterContainer ecdItemFilterJunk' style="background-image: url('resources/junkfilter.png');" onclick="OnItemFilter('Junk');"  itemfilter="junk" /></div>
			</div>
			<img class='ecdImageFlip' src='resources/eso_equip_bar.png' width='49%' /><img class='3' src='resources/eso_equip_bar.png' width='49%' />
EOT;

		return $output;
	}
	
	
	public function getInventoryGold()
	{ 
		$gold = $this->getCharStatField('Money');
		return $gold; 
	}
	
	
	public function getBankGold() 
	{ 
		$gold = $this->getCharStatField('BankedMoney');
		return $gold;
	}
	
	
	public function getAccountInventoryGold() 
	{ 
		return "";
	}
	
	
	public function getInventoryAP() 
	{ 
		$ap = $this->getCharStatField('AlliancePoints');
		return $ap; 
	}
	
	
	public function getBankAP() 
	{ 
		return $this->getInventoryAP();
	}
	
	
	public function getAccountInventoryAP() 
	{ 
		//$account = $this->db->real_escape_string($this->characterData['uniqueAccountName']);
		//$query = "SELECT * FROM stats WHERE account";
		return ""; 
	}
	
	
	public function getInventoryTelvar() 
	{ 
		$telvar = $this->getCharStatField('TelvarStones');
		return $telvar; 
	}
	
	
	public function getBankTelvar() 
	{ 
		$telvar = $this->getCharStatField('BankedTelvarStones');
		return $telvar;
	}
	
	
	public function getAccountInventoryTelvar() 
	{ 
		return ""; 
	}
	
	
	public function getInventoryJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['inventory']);
	}
	
	
	public function getBankJS()
	{
		return $this->getGeneralInventoryJS($this->characterData['bank']);
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
		$newItemData = array();
	
		foreach ($this->characterData['inventory'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		foreach ($this->characterData['bank'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
		
		foreach ($this->characterData['accountInventory'] as $item)
		{
			$newItemData[$item['localId']] = $item;
		}
	
		$output = json_encode($newItemData);
		return $output;
	}
		
		
	public function getBankContentHtml()
	{
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['bank'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function getAccountInvContentHtml()
	{
		$output  = $this->getItemFilterHtml();
		$output .= $this->getItemHeaderHtml();
				
		foreach($this->characterData['accountInventory'] as $key => $item)
		{
			$output .= $this->getItemRowHtml($item);
		}
		
		$output .= $this->getItemFooterHtml();
		return $output;
	}
	
	
	public function createBuildTableHtml()
	{
		if (!$this->loadBuilds()) return false;
	
		$this->outputHtml .= $this->getBreadcrumbTrailHtml() . "<p />\n";
	
		$this->outputHtml .= "<table id='ecdBuildTable'>\n";
		$this->outputHtml .= "<tr class='ecdBuildTableHeader'>\n";
		$this->outputHtml .= "<th>Character Name</th>\n";
		$this->outputHtml .= "<th>Class</th>\n";
		$this->outputHtml .= "<th>Race</th>\n";
		$this->outputHtml .= "<th>Type</th>\n";
		$this->outputHtml .= "<th>Special</th>\n";
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
		$output .= "<td class='ecdBuildTableName'><a href=\"$linkUrl\">$charName</a></td>";
		$output .= "<td>$className</td>";
		$output .= "<td>$raceName</td>";
		$output .= "<td>$buildType</td>";
		$output .= "<td>$special</td>";
		$output .= "<td>$level</td>";
		$output .= "<td>$cp</td>";
	
		if ($this->canWikiUserEditBuild($buildData))
		{
			$output .= "<td>";
				
			if ($this->canWikiUserDeleteBuild($buildData))
			{
				//$output .= "Delete Build";
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
	
	
	public function getBreadcrumbTrailHtml()
	{
		$output = "<div id='ecdTrail'>";
	
		if ($this->characterId > 0)
		{
			$baseLink = $this->getBuildLink();
			$charLink = $this->getCharacterLink($this->characterId);
				
			if ($this->viewRawData)
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a> : ";
				$output .= "<a href='$charLink'>View Normal Character</a>";
			}
			else
			{
				$output .= "<a href='$baseLink'>&laquo; View All Characters</a>";
			}
		}
		else
		{
			$output .= "Viewing all characters.";
		}
	
		$output .= "</div>";
		return $output;
	}
	
};


