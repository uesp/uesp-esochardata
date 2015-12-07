<?php

class EsoCharDataParser
{
	const ECD_OUTPUT_CHARDATA_PATH = "/home/uesp/esochardata/";
	const ECD_MINIMUM_CHARDATA_SIZE = 24;
	
	public $inputParams = array();
	public $rawCharData = array();
	
	
	public function __construct ()
	{
	}
	
	
	public function reportError ($errorMsg)
	{
		print("Error: " . $errorMsg . "\n");
		error_log("Error: " . $errorMsg);
	
		return false;
	}
	
	
	public function createCharDataLogFilename()
	{
		$index = 0;
		
		do 
		{
			if ($index > 1000) 
			{
				$this->reportError("Failed to create a new character data filename for backup!");
				return "";
			}
			
			$date = new DateTime();
			$dateStr = $date->format('Y-m-d-His');
			$filename = self::ECD_OUTPUT_CHARDATA_PATH;
			
			if ($index > 0)
				$filename .= "charData-" . $dateStr . "-" . $index . ".txt";
			else
				$filename .= "charData-" . $dateStr . ".txt";
			
			$index += 1;
		} while (file_exists($filename));
		
		return $filename;
	}

	
	public function saveCharData()
	{
		$filename = $this->createCharDataLogFilename();
		if ($filename == "") return false;
		
		if (file_put_contents($filename, $this->rawCharData) === False)
		{
			return $this->reportError("Failed to write character data to file '$filename'!");
		}
		
		return true;
	}
	
	
	public function parseRawCharData($rawCharData)
	{
		$charData = base64_decode(str_replace(' ', '+', $rawCharData));
		
		$charData .= "\n";
		$charData .= "uespCharData.IPAddress = '" . $_SERVER["REMOTE_ADDR"] . "'\n";
		$charData .= "uespCharData.UploadTimestamp = " . time() . "\n";
		
		return $charData;
	}
	

	public function parseFormInput()
	{
		$this->writeHeaders();
	
		$this->inputParams = $_REQUEST;
	
		if (!array_key_exists('chardata', $this->inputParams)) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return $this->reportError("Failed to find any character data form input to parse!");
		}
		
		$this->rawCharData = $this->parseRawCharData($this->inputParams['chardata']); 
		print("Found character data " . strlen($this->rawCharData) . " bytes in size.");
		
		if (strlen($this->rawCharData) < self::ECD_MINIMUM_CHARDATA_SIZE)
		{
			print("Ignoring empty char data.");
			return true;
		}
		
		if (!$this->saveCharData()) 
		{
			header('X-PHP-Response-Code: 500', true, 500);
			return false;
		}
	
		return true;
	}
	
	
	public function writeHeaders ()
	{
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Pragma: no-cache");
		header("content-type: text/html");
	}
	
	
};


$tmp = new EsoCharDataParser();
$tmp->parseFormInput();

