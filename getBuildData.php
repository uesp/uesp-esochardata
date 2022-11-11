<?php

require_once("editBuild.class.php");


class CEsoBuildEditorGetData
{
	
	public $buildData = null;
	
	public $inputParams = [];
	public $inputAction = '';
	
	
	public function __construct()
	{
		$this->buildData = new EsoBuildDataEditor();
		
		$this->ParseInputParams();
	}
	
	
	
	protected function ParseInputParams()
	{
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists('action', $this->inputParams)) $this->inputAction = strtolower($this->inputParams['action']);
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
	
	
	public function DefaultAction()
	{
		print("No action specified!\n");
	}
	
	
	public function OutputComputedStatsAction($computedStats)
	{
		$json = json_encode($computedStats, JSON_UNESCAPED_SLASHES);
		
		$this->OutputJsonHeader();
		
		print($json);
	}
	
	
	public function OutputActionArray($arrayData)
	{
		$json = json_encode($arrayData, JSON_UNESCAPED_SLASHES);
		
		$this->OutputJsonHeader();
		
		print($json);
	}
	
	
	public function Run()
	{
		
		switch ($this->inputAction)
		{
			case 'computedstatspts':
				$this->OutputComputedStatsAction($this->buildData->COMPUTED_STATS_LIST_PTS);
				break;
			case 'computedstats':
				$this->OutputComputedStatsAction($this->buildData->COMPUTED_STATS_LIST);
				break;
			case 'gearsloticons':
				$this->OutputActionArray($this->buildData->GEARSLOT_BASEICONS);
				break;
			case 'uniquestats':
				$this->OutputActionArray($this->buildData->STATS_UNIQUE_LIST);
				break;
			case 'stattypes':
				$this->OutputActionArray($this->buildData->STATS_TYPE_LIST);
				break;
			case 'basestats':
				$this->OutputActionArray($this->buildData->STATS_BASE_LIST);
				break;
			case 'mundus':
				$this->OutputActionArray($this->buildData->MUNDUS_TYPES);
				break;
			case 'alliances':
				$this->OutputActionArray($this->buildData->ALLIANCE_TYPES);
				break;
			case 'equipslots':
				$this->OutputActionArray($this->buildData->EQUIPSLOT_TO_SLOTID);
				break;
			case 'races':
				$this->OutputActionArray($this->buildData->RACE_TYPES);
				break;
			case 'classes':
				$this->OutputActionArray($this->buildData->CLASS_TYPES);
				break;
			case 'vampirestages':
				$this->OutputActionArray($this->buildData->VAMPIRESTAGE_TYPES);
				break;
			case 'werewolfstages':
				$this->OutputActionArray($this->buildData->WEREWOLFSTAGE_TYPES);
				break;
			case 'inputstatdetails':
				$this->OutputActionArray($this->buildData->INPUT_STAT_DETAILS);
				break;
			default:
				$this->DefaultAction();
				break;
		}
	}
};


$getData = new CEsoBuildEditorGetData();
$getData->Run();