<?php

require_once("viewCharData.class.php");


class EsoCharDataContentLoader 
{
	
	public $characterId = -1;
	public $contentId = "";
	
	
	public function __construct ()
	{
		$this->viewCharData = new EsoCharDataViewer();
		$this->viewCharData->useAsyncLoad = false;
		$this->viewCharData->baseResourceUrl = "//esochars.uesp.net/";
		
		$this->ParseInputParams();
	}
	
	
	public function ReportError($msg)
	{
		print("<div class='ecdAsyncLoad ecdAsyncError'>Error: $msg!</div>");		
		return false;
	}
	
	
	public function OutputHtmlHeader()
	{
		ob_start("ob_gzhandler");
		
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Pragma: no-cache");
		header("content-type: text/html");
	
		$origin = $_SERVER['HTTP_ORIGIN'];
	
		if (substr($origin, -8) == "uesp.net")
		{
			header("Access-Control-Allow-Origin: $origin");
		}
	}
	
	
	public function OutputJsonHeader()
	{
		ob_start("ob_gzhandler");
	
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] . "");
		header("content-type: application/json");
	}
		
	
	public function ParseInputParams()
	{
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists('id', $this->inputParams)) 
		{
			$this->characterId = (int) $this->inputParams['id'];
			$this->viewCharData->characterId = $this->characterId;
		}
		
		if (array_key_exists('content', $this->inputParams)) 
		{
			$this->contentId = $this->inputParams['content'];
		}
	
	}
	
	
	public function GetQuestContent()
	{
		return $this->viewCharData->getCharQuestContentHtml();
	}
	
	
	public function GetAchievementContent()
	{
		return $this->viewCharData->getAchievementContentHtml();
	}
	
	
	public function GetCollectibleContent()
	{
		return $this->viewCharData->getCollectibleContentsHtml();
	}
	
	
	public function GetBookContent()
	{
		return $this->viewCharData->getCharBookContentHtml();
	}
	
	
	public function GetInventoryContent()
	{
		return $this->viewCharData->getInventoryContentHtml();
	}
	
	
	public function GetBankContent()
	{
		return $this->viewCharData->getBankContentHtml();
	}
	
	
	public function GetCraftBagContent()
	{
		return $this->viewCharData->getCraftBagContentHtml();
	}
	
	
	public function GetAccountInventoryContent()
	{
		return $this->viewCharData->getAccountInvContentHtml();
	}
	
	
	public function GetAllInventoryJS()
	{
		return $this->viewCharData->getAllInventoryJS();
	}

	
	public function GetContent()
	{
		if (!$this->viewCharData->loadCharacter()) return $this->ReportError("Failed to load character data!");
		
		if ($this->contentId == "Quests")
			return $this->GetQuestContent();
		elseif ($this->contentId == "Achievements")
			return $this->GetAchievementContent();
		elseif ($this->contentId == "Collectibles")
			return $this->GetCollectibleContent();
		elseif ($this->contentId == "Books")
			return $this->GetBookContent();
		elseif ($this->contentId == "Inventory")
			return $this->GetInventoryContent();
		elseif ($this->contentId == "Bank")
			return $this->GetBankContent();
		elseif ($this->contentId == "Craft")
			return $this->GetCraftBagContent();
		elseif ($this->contentId == "AccountInv")
			return $this->GetAccountInventoryContent();
		elseif ($this->contentId == "AllInventoryJS")
			return $this->GetAllInventoryJS();
				
		return $this->ReportError("Unknown content type specified!");
	}
	
	
	public function RenderContent()
	{
		$output = $this->GetContent();
		print ($output);
	}
	
		
	public function Go()
	{
		if ($this->contentId == "AllInventoryJS")
			$this->OutputJsonHeader();
		else
			$this->OutputHtmlHeader();
		
		if ($this->characterId <= 0 || $this->contentId == "") return $this->ReportError("Invalid input parameters received!");
		
		$this->RenderContent();
		
		return true;
	}
	
	
	
};


$charDataLoader = new EsoCharDataContentLoader();
$charDataLoader->Go();
