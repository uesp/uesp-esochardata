<?php

require_once("/home/uesp/www/esomap/UespMemcachedSession.php");
require_once("viewBuildData.class.php");
require_once("viewCharData.class.php");


class CEsoCharManageScreenshots 
{
	
	public $inputParams = array();
	public $inputCharacterId = -1;
	public $inputBuildId = -1;
	public $inputScreenshotId = -1;
	public $inputCaption = "";
	public $inputAction = "";
	
	public $errorMsg = "";
	public $outputData = array();
	
	public $viewCharData = null;
	public $viewBuildData = null;
	
	public $canEditScreenshots = false;
	public $canEditScreenshotsCharId = 0;
	
	public $db = null;
	
	
	public function __construct()
	{
		UespMemcachedSession::install();
		
		session_name('uesp_net_wiki5_session');
		session_start();
		
		$this->viewBuildData = new EsoBuildDataViewer(true, true);
		$this->viewCharData  = new EsoCharDataViewer(true, true);
	}
	
	
	public function ReportError ($errorMsg)
	{
		if ($this->outputData['error'] == null) $this->outputData['error'] = array();
		$this->outputData['error'][] = $errorMsg;
		$this->outputData['result'] = -1;
		
		error_log("ManageEsoCharScreenshots: $errorMsg");
		//header("X-PHP-Response-Code: " . 400, true, 400);
		
		return false;
	}
	
	
	public function ReportSuccess ($msg)
	{
		$this->outputData['result'] = 1;
		$this->outputData['msg'] = $msg;
		
		return false;
	}
	
	
	public function WriteHeaders()
	{
		ob_start("ob_gzhandler");
	
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		//header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] . "");
		$origin = $_SERVER['HTTP_ORIGIN'];
		
		if (substr($origin, -8) == "uesp.net")
		{
			header("Access-Control-Allow-Origin: $origin");
		}
		
		header("Access-Control-Allow-Credentials: true");
		header("content-type: application/json");
	}
	
	
	public function ParseInputParams()
	{
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists("charid", $this->inputParams)) $this->inputCharacterId = intval($this->inputParams['charid']);
		if (array_key_exists("buildid", $this->inputParams)) $this->inputBuildId = intval($this->inputParams['buildid']);
		if (array_key_exists("screenshotid", $this->inputParams)) $this->inputScreenshotId = intval($this->inputParams['screenshotid']);
		if (array_key_exists("caption", $this->inputParams)) $this->inputCaption = $this->inputParams['caption'];
		if (array_key_exists("action", $this->inputParams)) $this->inputAction = $this->inputParams['action'];
	}
	
	
	public function HasEditPermission()
	{
		global $_SESSION;
		
		$wikiUser = $_SESSION['wsUserName'];
		error_log("wsUserName: {$wikiUser}");
	
		$this->canEditScreenshots = $_SESSION['UESP_ESO_canEditScreenshots'];
		if ($this->canEditScreenshots === null) $this->canEditScreenshots = 0;
		
		error_log("canEditScreenshots: {$this->canEditScreenshots}");
		
		$this->canEditScreenshotsCharId = $_SESSION['UESP_ESO_canEditScreenshotsCharId'];
		if ($this->canEditScreenshotsCharId === null) $this->canEditScreenshotsCharId = 0;
		
		error_log("canEditScreenshotsCharId: {$this->canEditScreenshotsCharId}, {$this->inputBuildId}, {$this->inputCharacterId}");
		
		if (!$this->canEditScreenshots) return false;
		
		if ($this->inputBuildId > 0) return $this->canEditScreenshotsCharId == $this->inputBuildId;
		if ($this->inputCharacterId > 0) return $this->canEditScreenshotsCharId == $this->inputCharacterId;
		
		return false;
	}	
	
	
	public function LoadBuildData()
	{
		$this->viewBuildData->characterId = $this->inputBuildId;
		
		if (!$this->viewBuildData->initDatabaseWrite()) return $this->ReportError("Failed to initialize database!");
		if (!$this->viewBuildData->loadSingleCharacter()) return $this->ReportError("Failed to load build data!");
		
		$this->db = $this->viewBuildData->db;
		
		$screenshotId = $this->inputScreenshotId;
		$query = "SELECT * FROM screenshots WHERE id='$screenshotId';";
		$result = $this->db->query($query);
		if ($result === false) return $this->ReportError("Database error loading screenshot data!");
		if ($result->num_rows <= 0) return $this->ReportError("Screenshot data not found!");
		
		$row = $result->fetch_assoc();
		if ($row['characterId'] != $this->inputBuildId) return $this->ReportError("Screenshot data does not belond to build!");
		
		return true;
	}
	
	
	public function LoadCharData()
	{
		$this->viewCharData->characterId = $this->inputCharacterId;
		
		if (!$this->viewCharData->initDatabaseWrite()) return $this->ReportError("Failed to initialize database!");
		if (!$this->viewCharData->loadSingleCharacter()) return $this->ReportError("Failed to load character data!");
		
		$this->db = $this->viewCharData->db;
		
		$screenshotId = $this->inputScreenshotId;
		$query = "SELECT * FROM screenshots WHERE id='$screenshotId';";
		$result = $this->db->query($query);
		if ($result === false) return $this->ReportError("Database error loading screenshot data!");
		if ($result->num_rows <= 0) return $this->ReportError("Screenshot data not found!");
		
		$row = $result->fetch_assoc();
		if ($row['characterId'] != $this->inputCharacterId) return $this->ReportError("Screenshot data does not belong to character!");
		
		return true;
	}
	
	
	public function LoadData()
	{
		if ($this->inputBuildId > 0)
			return $this->LoadBuildData();
		elseif ($this->inputCharacterId > 0)
			return $this->LoadCharData();
		
		return $this->ReportError("No character or build ID specified!");
	}
	
	
	public function DoEditCaption()
	{
		if (!$this->LoadData()) return false;
		
		if ($this->inputScreenshotId <= 0) return $this->ReportError("Missing screenshot ID input!");
		
		$caption = $this->db->real_escape_string($this->inputCaption);
		$screenshotId = $this->inputScreenshotId; 
		
		$query = "UPDATE screenshots SET caption='$caption' WHERE id='$screenshotId';";
		$result = $this->db->query($query);
		if ($result === false) return $this->ReportError("Failed to save screenshot caption!");
			
		$this->ReportSuccess("Saved caption!");
		return true;
	}
	
	
	public function DoDeleteScreenshot()
	{
		if (!$this->LoadData()) return false;
		
		$screenshotId = $this->inputScreenshotId; 
		
		$query = "DELETE FROM screenshots WHERE id='$screenshotId';";
		$result = $this->db->query($query);
		if ($result === false) return $this->ReportError("Failed to delete screenshot!");
		
		$this->ReportSuccess("Deleted screenshot!");
		return true;
	}
	
	
	public function OutputJson()
	{
		print( json_encode($this->outputData) );
	}
	
	
	public function DoRequest()
	{
		$this->WriteHeaders();
		$this->ParseInputParams();
		
		if (!$this->HasEditPermission())
			$this->ReportError("Manage screenshots permission denied! Action = {$this->inputAction}, BuildId = {$this->inputCharacterId}, WikiUser = {$_SESSION['wsUserName']}");
		elseif ($this->inputAction == "editcaption")
			$this->DoEditCaption();
		elseif ($this->inputAction == "delete")
			$this->DoDeleteScreenshot();
		else
			$this->ReportError("Unknown action provided!");
		
		$this->OutputJson();
			
		return true;
	}
	
};


$g_ManageScreenshots = new CEsoCharManageScreenshots();
$g_ManageScreenshots->DoRequest();