<?php

require_once("/home/uesp/secrets/esobuilddata.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");
require_once("/home/uesp/www/esomap/UespMemcachedSession.php");


class EsoBuildDataSaver 
{
	
	public $SESSION_DEBUG_FILENAME = "/var/log/httpd/esoeditbuild_sessions.log"; 
	
	public $canEditBuilds = false;
	public $canDeleteBuilds = false;
	public $canCreateBuilds = false;
	
	public $inputData = null;
	public $parsedBuildData = null;
	public $inputId = null;
	public $createCopy = false;
	
	public $origBuildId = -1;
	public $buildId = -1;
	public $buildData = null;
	public $statsData = null;
	public $isNew = false;
	
	public $errorMessages = array();
	
	public $db = null;
	public $dbWriteInitialized = false;
	
	
	public $BUILD_FIELDS = array(
			"id"				=> "id",
			"name"				=> "text",
			"buildName"			=> "text",
			"wikiUserName"		=> "text",
			"class"				=> "text",
			"race"				=> "text",
			"buildType"			=> "text",
			"special"			=> "text",
			"alliance"			=> "text",
			"level"				=> "int",
			"championPoints"	=> "int",
			"createTime"		=> "time",
			"uploadTimestamp"	=> "timestamp",
			"editTimestamp"		=> "timestamp",
	);
	
	
	public $BUFF_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"icon"				=> "text",
			"abilityId"			=> "int",
			"description"		=> "text",
			"enabled"			=> "int",
	);
	
	
	public $CP_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"points"			=> "int",
			"description"		=> "text",
			"abilityId"			=> "int",
	);
	
	
	public $ACTIONBAR_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"type"				=> "text",
			"description"		=> "text",
			"index"				=> "int",
			"icon"				=> "text",
			"abilityId"			=> "int",
			"rank"				=> "int",
			"area"				=> "text",
			"cost"				=> "text",
			"range"				=> "text",
			"radius"			=> "int",
			"castTime"			=> "int",
			"channelTime"		=> "int",
			"duration"			=> "int",
			"target"			=> "text",
	);
	
	
	public $SKILL_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"type"				=> "text",
			"description"		=> "text",
			"icon"				=> "text",
			"abilityId"			=> "int",
			"rank"				=> "int",
			"index"				=> "int",
			"area"				=> "text",
			"cost"				=> "text",
			"range"				=> "text",
			"radius"			=> "int",
			"castTime"			=> "int",
			"channelTime"		=> "int",
			"duration"			=> "int",
			"target"			=> "text",
	);
	
	
	public $STAT_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"value"				=> "text",
	);
	
	
	public $EQUIPSLOT_FIELDS = array(
			"characterId"		=> "id",
			"name"				=> "text",
			"itemLink"			=> "text",
			"icon"				=> "text",
			"condition"			=> "int",
			"index"				=> "int",
			"setCount"			=> "int",
			"value"				=> "int",
			"level"				=> "int",
			"quality"			=> "int",
			"type"				=> "int",
			"equipType"			=> "int",
			"weaponType"		=> "int",
			"armorType"			=> "int",
			"craftType"			=> "int",
			"stolen"			=> "int",
			"style"				=> "int",
	);
	
	
	public function __construct()
	{
		UespMemcachedSession::install();
		
		session_name('uesp_net_wiki5_session');
		session_start();
	}
	
	
	public function ReportError($msg)
	{
		$this->errorMessages[] = $msg;
		error_log($msg);
		return false;
	}
	
	
	public function InitDatabaseWrite()
	{
		global $uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase;
	
		if ($this->dbWriteInitialized) return true;
	
		$this->db = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
		if ($db->connect_error) return $this->ReportError("Could not connect to mysql database!");
	
		$this->dbWriteInitialized = true;
		return true;
	}
	
	
	public function DebugSessionData()
	{
		global $_SESSION;
		
		$canEditBuilds   = $_SESSION['UESP_ESO_canEditBuild'];
		$canDeleteBuilds = $_SESSION['UESP_ESO_canDeleteBuild'];
		$canCreateBuilds = $_SESSION['UESP_ESO_canCreateBuild'];
		$wikiUser = $_SESSION['wsUserName'];
		$sessionId = session_id();
		$currentDate = date("Y-m-d H:i:s");
		$sessionName = session_name();
		$cookie = $_COOKIE[$sessionName];
		
		$output = "EsoBuildSession: $currentDate\n";
		$output .= "\tsessionId = $sessionId\n";
		$output .= "\tsessionName = $sessionName\n";
		$output .= "\tsessionCookie = $cookie\n";
		$output .= "\tbuildId = {$this->buildId}\n";
		$output .= "\torigBuildId = {$this->origBuildId}\n";
		$output .= "\twikiUser = $wikiUser\n";
		$output .= "\tcanEditBuilds = {$this->canEditBuilds}\n";
		$output .= "\tcanDeleteBuilds = {$this->canDeleteBuilds}\n";
		$output .= "\tcanCreateBuilds = {$this->canCreateBuilds}\n";
		
		foreach ($_SESSION as $name => $val)
		{
			$output .= "\t$name = '$val'\n";
		}
		
		file_put_contents($this->SESSION_DEBUG_FILENAME, $output, FILE_APPEND | LOCK_EX);
	}
	
	
	public function GetSessionData()
	{
		global $_SESSION;
	
		$this->canEditBuilds   = $_SESSION['UESP_ESO_canEditBuild'];
		$this->canDeleteBuilds = $_SESSION['UESP_ESO_canDeleteBuild'];
		$this->canCreateBuilds = $_SESSION['UESP_ESO_canCreateBuild'];
		
		if ($this->canEditBuilds   === null) $this->canEditBuilds   = false;
		if ($this->canDeleteBuilds === null) $this->canDeleteBuilds = false;
		if ($this->canCreateBuilds === null) $this->canCreateBuilds = false;
		
		//$this->DebugSessionData();
		
		return true;
	}
	
	
	public function OutputHeaders()
	{
		ob_start("ob_gzhandler");

		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		
		$origin = $_SERVER['HTTP_ORIGIN'];
		
		if (substr($origin, -8) == "uesp.net")
		{
			header("Access-Control-Allow-Origin: $origin");
		}
		
		header("Access-Control-Allow-Credentials: true");
		header("content-type: application/json");
	}
	
	
	public function Initialize()
	{
		if (!$this->ParseInputParams()) return false;
		
		if (!$this->GetSessionData()) 
		{
			$this->OutputHeaders();
			return false;
		}
		
		$this->OutputHeaders();
		
		if (!$this->InitDatabaseWrite()) return false;
		
		if ($this->inputData === null || $this->inputId === null) return $this->ReportError("No input data received!");
		
		return true;
	}
	
	
	public function Query($query)
	{
		if ($query == "" || $query === false) return $this->ReportError("Empty query given!");
		
		$result = true;
		$result = $this->db->query($query);
		
		if (!$result) 
		{
			//file_put_contents("/home/dave/test.log", "Query Error: '$query',  Error: '{$this->db->error}'\n", FILE_APPEND);
			return $this->ReportError("Database query error: $query");
		}
		
		//file_put_contents("/home/dave/test.log", "Query: '$query',  NumRows: '{$result->num_rows}'\n", FILE_APPEND);
		
		return $result;
	}
	
	
	public function ParseInputParams()
	{
		if (array_key_exists('savedata', $_REQUEST)) 
		{
			$this->inputData = $_REQUEST['savedata'];
			$this->parsedBuildData = json_decode($this->inputData, true);
		}
		
		if (array_key_exists('id', $_REQUEST)) 
		{
			$this->inputId = (int) $_REQUEST['id'];
			$this->buildId = $this->inputId;
			$this->origBuildId = $this->buildId;
		}
		
		if (array_key_exists('copy', $_REQUEST))
		{
			$flag = (int) $_REQUEST['copy'];
			if ($flag != 0) $this->createCopy = true;
		}
		
		return true;
	}
	
	
	public function OutputErrorJson()
	{
		$output = array();
		
		$output['errors'] = $this->errorMessages;
		$output['success'] = false;
		
		print (json_encode($output));
		
		return false;
	}
	
	
	public function OutputSuccessJson()
	{
		$output = array();
		$output['success'] = true;
		$output['inputLength'] = strlen($this->inputData);
		$output['errors'] = $this->errorMessages;
		$output['id'] = $this->buildId;
		$output['isnew'] = $this->isNew;
		
		print (json_encode($output));
		
		return true;
	}
	
	
	public function LoadBuild()
	{
		$query = "SELECT * FROM characters WHERE id='{$this->buildId}';";
		$result = $this->db->query($query);
		if (!$result || $result->num_rows == 0) return $this->ReportError("Failed to load build #{$this->buildId}!");
		
		$this->buildData = $result->fetch_assoc();
		
		return true;
	}
	
	
	public function LoadStats()
	{
		$query = "SELECT name, value FROM stats WHERE characterId='{$this->buildId}';";
		$result = $this->db->query($query);
		if (!$result || $result->num_rows == 0) return $this->ReportError("Failed to load stats for build #{$this->buildId}!");
		
		$this->statsData = array();
		
		while (($row = $result->fetch_assoc()))
		{
			$this->statsData[$row['name']] = $row['value'];
		}
		
		return true;
	}
	
	
	public function Load()
	{
		if ($this->buildId <= 0) return true;
		
		//if (!$this->LoadBuild()) return false;
		if (!$this->LoadStats()) return false;
	
		return true;
	}
	
	
	public function MergeStats()
	{
		if ($this->parsedBuildData == null) return true;
		if ($this->statsData == null) return true;
		if ($this->parsedBuildData['Stats'] === null) $this->parsedBuildData['Stats'] = array();
		
		foreach ($this->statsData as $name => $value)
		{
			if ($this->parsedBuildData['Stats'][$name] === null)
			{
				$this->parsedBuildData['Stats'][$name] = $value;
			}
		}
		
		return true;
	}
	
		
	public function CreateInsertQuery($table, $data, $FIELDS)
	{
		$query = "INSERT INTO $table";
		$queryColumns = array();
		$queryValues = array();
		
		foreach ($FIELDS as $field => $fieldType)
		{
			$value = $data[$field];
			
			if ($fieldType == "id")
			{
				if ($table == "characters") continue;
				$value = $this->buildId;	
			}
			
			if ($value === null) continue;
			$value = $this->db->real_escape_string($value);
			
			$queryColumns[] = "`$field`";
			$queryValues[] = "'$value'";
		}
		
		if (count($queryColumns) == 0) return "";
		
		$query .= "(" . implode(", ", $queryColumns) . ") ";
		$query .= "VALUES(" . implode(", ", $queryValues) . ");";
		
		return $query;
	}
	
	
	public function CreateUpdateQuery($table, $data, $FIELDS)
	{
		$query = "UPDATE $table";
		$queryValues = array();
		$whereQuery = "";
		
		foreach ($FIELDS as $field => $fieldType)
		{
			$value = $data[$field];
			if ($value === null) continue;
				
			if ($fieldType == "id")
			{
				$whereQuery = " WHERE `$field`='$value'";
				continue;
			}
				
			$value = $this->db->real_escape_string($value);
			$queryValues[] = "`$field`='$value'";
		}
		
		if (count($queryValues) == 0) return "";
		if ($whereQuery == "") return $this->ReportError("Failed to create WHERE condition for saving to $table!");
		
		$query .= " SET " . implode(", ", $queryValues) . " ";
		$query .= $whereQuery . ";";
		
		return $query;
	}
	
	
	public function CreateQuery($table, $data, $FIELDS)
	{
		if ($this->buildId <= 0) return $this->CreateInsertQuery($table, $data, $FIELDS);
		return $this->CreateUpdateQuery($table, $data, $FIELDS);
	}
	
	
	public function DeleteCharacterData($table)
	{
		if ($this->buildId <= 0) return true;
		
		$query = "DELETE FROM `$table` WHERE characterId={$this->buildId};";
		$result = $this->Query($query);
		if (!$result) return $this->ReportError("Failed to delete data from $table for build #{$this->buildId}!");
		
		return true;
	}
	
	
	public function SaveTable($table, $buildData, $FIELDS)
	{
		if (!$this->DeleteCharacterData($table)) return false;
		
		foreach ($buildData as $key => $value)
		{
			$data = $value;
			
			if (!is_array($data))
			{
				$data = array();
				$data['name'] = $key;
				$data['value'] = $value;
			}
			
			$data['characterId'] = $this->buildId;
			
			$query = $this->CreateInsertQuery($table, $data, $FIELDS);
			if ($query == "" || $query === false) continue;
			
			$result = $this->Query($query);
			if (!$result) $this->ReportError("Failed to add new record into $table!");
		}
	
		return true;
	}
	
	
	public function SaveBuild()
	{
		
		if ($this->buildId <= 0)
		{
			if (!$this->canCreateBuilds) return $this->ReportError("Permission Denied!");
						
			$this->parsedBuildData['Build']['createTime'] = time();
			$this->parsedBuildData['Build']['uploadTimestamp'] = date('Y-m-d G:i:s');
		}
		else
		{
			if (!$this->canEditBuilds) return $this->ReportError("Permission Denied!");
		}
		
		$this->parsedBuildData['Build']['editTimestamp'] = date('Y-m-d G:i:s');
		
		$query = $this->CreateQuery("characters", $this->parsedBuildData['Build'], $this->BUILD_FIELDS);
		if ($query === false || $query == "") return $this->ReportError("Failed to create query for build data!");
		
		$result = $this->Query($query);
		if (!$result) return $this->ReportError("Failed to save data for build!");
		
		if ($this->buildId <= 0)
		{
			$this->buildId = $this->db->insert_id;
			$this->isNew = true;
		}
		
		return true;
	}
	
	
	public function Run()
	{
		if (!$this->Initialize()) return $this->OutputErrorJson();
		if (!$this->Load()) return $this->OutputErrorJson();
		
		$this->MergeStats();
		
		if ($this->createCopy)
		{
			$this->buildId = -1;
		}
		
		if (!$this->SaveBuild()) return $this->OutputErrorJson();
		
		$result  = $this->SaveTable("stats", $this->parsedBuildData['Stats'], $this->STAT_FIELDS);
		$result &= $this->SaveTable("actionBars", $this->parsedBuildData['ActionBars'], $this->ACTIONBAR_FIELDS);
		$result &= $this->SaveTable("buffs", $this->parsedBuildData['Buffs'], $this->BUFF_FIELDS);
		$result &= $this->SaveTable("championPoints", $this->parsedBuildData['ChampionPoints'], $this->CP_FIELDS);
		$result &= $this->SaveTable("skills", $this->parsedBuildData['Skills'], $this->SKILL_FIELDS);
		$result &= $this->SaveTable("equipSlots", $this->parsedBuildData['EquipSlots'], $this->EQUIPSLOT_FIELDS);
				
		if (!$result) return $this->OutputErrorJson();
		
		$this->OutputSuccessJson();
		return true;
	}
	
	
};


$buildSaver = new EsoBuildDataSaver();
$buildSaver->Run();
