<?php


require_once('/home/uesp/www/esobuilddata/parseBuildData.class.php');


class EsoCharDataSubmitter
{
	
	const ESOBUILDDATA_UPLOAD_PATH = "/home/uesp/esobuilddata/";
	
	public $parseBuildData = null;
	public $fileData = "";
	public $fileError = 0;
	public $fileErrorMsg = "";
	public $fileSize = 0;
	public $fileTmpName = "";
	public $fileMoveName = "";
	public $fileName = "";
	public $hasFileData = false;
	public $accountName = "Anonymous";
	public $uploadedBuilds = 0;
	public $parsedBuilds = 0;
	public $wikiUserName = '';
	
	public $currentLogIndex = 1;
	
	
	public function __construct ()
	{
		$this->parseBuildData = new EsoBuildDataParser();
	}
	
	
	public function parseFormInput()
	{
		$this->writeHeaders();
		
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists("wikiUserName", $this->inputParams))
		{
			$this->wikiUserName = $this->inputParams['wikiUserName'];
		}
		
		if (array_key_exists("logfile", $_FILES))
		{
			$this->fileName = $_FILES["logfile"]['name'];
			$this->fileSize = $_FILES["logfile"]['size'];
			$this->fileError = $_FILES["logfile"]['error'];
			$this->fileTmpName = $_FILES["logfile"]['tmp_name'];
			$this->hasFileData = true;
			
			switch($this->fileError)
			{
				case UPLOAD_ERR_OK:
					$this->fileErrorMsg = ""; 
					break;
				case UPLOAD_ERR_INI_SIZE:
					$this->fileErrorMsg = "The uploaded file exceeds the upload_max_filesize directive in php.ini.";
					break;
				case UPLOAD_ERR_FORM_SIZE:
					$this->fileErrorMsg = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.";
					break;
				case UPLOAD_ERR_PARTIAL:
					$this->fileErrorMsg = "The uploaded file was only partially uploaded.";
					break;
				case UPLOAD_ERR_NO_FILE:
					$this->fileErrorMsg = "No file was uploaded.";
					break;
				case UPLOAD_ERR_NO_TMP_DIR:
					$this->fileErrorMsg = "Missing a temporary folder. Introduced in PHP 4.3.10 and PHP 5.0.3.";
					break;
				case UPLOAD_ERR_CANT_WRITE:
					$this->fileErrorMsg = "Failed to write file to disk. Introduced in PHP 5.1.0.";
					break;
				case UPLOAD_ERR_EXTENSION:
					$this->fileErrorMsg = "Unknown PHP extension error.";
					break;
				default:
					$this->fileErrorMsg = "Unknown error " . $this->fileError . ".";
					break;
			}
		}
		
		return true;
	}
	
	
	public function reportError ($errorMsg)
	{
		//print("Error: " . $errorMsg . "\n");
		
		$this->fileErrorMsg .= $errorMsg . "<br/>";
		$this->fileError = 10;
		
		return false;
	}
	
	
	public function reportWarning ($errorMsg)
	{
		$this->fileErrorMsg .= $errorMsg . "<br/>";
	
		return false;
	}
	
	
	public function outputUpload ()
	{
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>UESP -- Submit ESO Character Build Data</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" href="submit.css" />
</head>
<body>

<table border="0" cellpadding="2" cellspacing="0" id="maintable">
<tr>
	<td>
		<h1>UESP -- Submitted ESO Character Build Data...</h1>
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
<?php
	$output = "";
	
	if ($this->fileError != 0)
	{
		$output = "<b>Error: Failed to upload file!</b><br />";
		$output .= $this->fileErrorMsg . "<br />";
		$output .= "Error Code: " . $this->fileError . "<br />";
	}
	else
	{
		$output  = "<b>Successfully uploaded file!</b><br />";
		$output .= "Filename: {$this->fileName}<br />";
		$output .= "File Size: {$this->fileSize} bytes<br />";
		$output .= "Local Filename: {$this->fileMoveName}<br />";
		$output .= "Lua Result: {$this->fileLuaResult}<br />";
		$output .= "Uploaded Character Builds: {$this->uploadedBuilds}<br />";
		$output .= "Parsed Character Builds: {$this->parsedBuilds}<br />";
		
	}
	
	print($output);
?>
	</td>
</tr><tr>
	<td>
		<a href="submit.php" style="float: right;">Upload another character/build log file...</a>
	</td>
	
</table>

</body>
</html>
<?php
	}
	
	public function outputForm ()
	{
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>UESP -- Submit ESO Character Build Data</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" href="submit.css" />
</head>
<body>

<form id="submitform" enctype="multipart/form-data" action="submit.php" method="post">

<table border="0" cellpadding="2" cellspacing="0" id="maintable">
<tr>
	<td>
		<h1>UESP -- Submit ESO Character Build Data</h1>
		Use this page to manually submit a log file created by uespLog containing characeter build data saved from ESO. 
		<p />
		If you are playing on the Windows/PC version you can use uespLogMonitor program included with the addon to automatically upload the build data.
		<p />
		Only character build data is parsed and saved with this form. To parse/save all uespLog data use the <a href='http://esolog.uesp.net/submit.php'>http://esolog.uesp.net/submit.php</a> form.
		<p />
		<ul>
		<li>Choose your uespLog saved variable file. This is usually in your <em>"Documents"</em> folder as one of the following:<br />
			<em style="margin-left: 52px;">Documents\Elder Scrolls Online\live\SavedVariables\uespLog.lua</em><br /> 
			<em style="margin-left: 52px;">Documents\Elder Scrolls Online\liveeu\SavedVariables\uespLog.lua</em>
			<br/>	
			<b>&nbsp; &nbsp; or</b></li>
		<li>Choose a backup build data file created by uespLogMonitor (ex: if there were errors uploading the data with the program).</li>
		<li>(Optional) Enter your UESP wiki username to associate your wiki account with the build.</li>
		<li>Submit file.</li>
		<li>After submitting you can run the game command <em>"/uespreset builddata"</em> (or <em>"/uespsavebuild clear"</em>) in ESO to clear the build data.</li>
		<li>It is safe to submit duplicate files or build entries...the parser detects and ignore duplicate build submissions.</li>
		</ul>
		<p />
		Note: Maximum file upload size is 40MB.
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
		UESP Wiki Username: <input type="text" name="wikiUserName" value="<?= $_COOKIE['uesp_net_wiki5UserName']?>" size="24" /> (optional)
		<br />
		<br />
		<br />
		<input type="file" name="logfile" value="Choose File..." />
		<input type="hidden" name="MAX_FILE_SIZE" value="41000000" />
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
		<input type="submit" id="submitbutton" />
	</td>
	
</table>

</form>

</body>
</html>
<?php
		return true;
	}
	
	
	public function output ()
	{
		if ($this->hasFileData)
		{
			$this->processUpload();
			$this->outputUpload();
		}
		else
		{
			$this->outputForm();
		}
	}
	
	
	public function processUpload ()
	{
		if ($this->fileError != 0)
		{
			error_log("upload error:" . $this->fileError);
			return false;
		}
		
		$destFilename = $this->parseBuildData->createBuildDataLogFilename();
		$this->fileMoveName = $destFilename;
		
		$result = move_uploaded_file ($this->fileTmpName, $destFilename);
		if (!$result) return $this->reportError("Failed to move temporary upload file!");

		chmod($destFilename, 0644);
		
		$this->Lua = new Lua();
		
		$result = $this->Lua->include($destFilename);
		$this->fileLuaResult = $result;
		
		if ($this->Lua->uespLogSavedVars != null) return $this->parseVarRootLevel($this->Lua->uespLogSavedVars);
		if ($this->Lua->uespBuildData != null)	return $this->parseCharacterBuildData($this->Lua->uespBuildData);
		return $this->reportError('No recognized UESP Lua data found in uploaded file!');
	}
	
	
	public function parseVarRootLevel ($object)
	{
		if ($object == null) return $this->reportError("Could not find the root object in the saved LUA variable file!");
		
		foreach ($object as $key => $value)
		{
			$this->parseVarAccountLevel($key, $value);
		}
		
		return TRUE;
	}
	
	
	public function parseVarAccountLevel ($parentName, $object)
	{
		if ($object == null) return $this->reportError("NULL object found in the {$parentName} section (account level) of the saved variable file!");
		
		foreach ($object as $key => $value)
		{
			$this->parseVarAccountWideLevel($key, $value);
		}
		
		return TRUE;
	}
	
	
	public function parseVarAccountWideLevel ($parentName, $object)
	{
		if ($object == null) return $this->reportError("NULL object found in the {$parentName} section (account wide leve) of the saved variable file!");
		$this->accountName = ltrim($parentName, '@');
		
		foreach ($object as $key => $value)
		{
			$this->parseVarSectionLevel($key, $value);
		}
		
		return TRUE;
	}
	
	
	public function parseVarSectionLevel ($parentName, $object)
	{
			/* Only parse the account wide section */
		if ($parentName != '$AccountWide') return TRUE;
		
		if ($object == null) return $this->reportError("NULL object found in the {$parentName} section (section level) of the saved variable file!");
		
		return $this->parseCharacterBuild($object["buildData"]);
	}
	
	
	public function parseCharacterBuild ($buildData)
	{
			// Older log files won't have a buildData section so its not an error
		if ($buildData == null) return TRUE;
		
		$data = $buildData['data'];
		return $this->parseCharacterBuildData($data);
	}
	
	
	public function parseCharacterBuildData ($data)
	{
		if ($data == null) return $this->reportError("Missing 'data' section in the {buildData} section of the saved variable file!");
		
		$data['IPAddress'] = $_SERVER["REMOTE_ADDR"];
		$data['UploadTimestamp'] = time();
		$data['WikiUser'] = $this->wikiUserName;
		
		if (!$this->parseBuildData->doParse($data)) 
		{
			return $this->reportError("Failed to parse/save the saved character data!");
		}
		
		$this->uploadedBuilds = $this->parseBuildData->characterCount;
		$this->parsedBuilds = $this->parseBuildData->newCharacterCount;
		return TRUE;
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


$g_EsoLogSubmitter = new EsoCharDataSubmitter();
$g_EsoLogSubmitter->parseFormInput();
$g_EsoLogSubmitter->output();

