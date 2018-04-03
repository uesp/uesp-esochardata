<?php


require_once("/home/uesp/secrets/esobuilddata.secrets");
require_once("/home/uesp/secrets/esochardata.secrets");
require_once("/home/uesp/esolog.static/esoCommon.php");


class EsoCharScreenshotSubmitter
{
	public $BASE_CHARDATA_SCREENSHOT_PATH = "/home/uesp/www/esobuilddata/screenshots/";
	public $BASE_BUILDDATA_SCREENSHOT_PATH = "/home/uesp/www/esobuilddata/screenshots/";
	
	public $fileData = "";
	public $fileError = 0;
	public $fileErrorMsg = "";
	public $fileSize = 0;
	public $fileTmpName = "";
	public $fileMoveName = "";
	public $fileBaseName = "";
	public $fileName = "";
	public $hasFileData = false;
	
	public $inputParams = array();
	public $inputCharacterId = -1;
	public $inputBuildId = -1;
	public $inputWikiUserName = "";
	public $inputCaption = "";
	
	public $dbChar = null;
	public $dbBuild = null;
	
	public $characterData = array( "name" => "");

	
	public function __construct ()
	{
	}
	
	
	public function ReportError ($errorMsg)
	{
		$this->fileErrorMsg .= $errorMsg . "<br/>";
		$this->fileError = 10;
		
		return false;
	}
	
	
	public function ReportWarning ($errorMsg)
	{
		$this->fileErrorMsg .= $errorMsg . "<br/>";
	
		return false;
	}
	
	
	public function InitCharDatabaseWrite ()
	{
		global $uespEsoCharDataWriteDBHost, $uespEsoCharDataWriteUser, $uespEsoCharDataWritePW, $uespEsoCharDataDatabase;
	
		$this->dbChar = new mysqli($uespEsoCharDataWriteDBHost, $uespEsoCharDataWriteUser, $uespEsoCharDataWritePW, $uespEsoCharDataDatabase);
		if ($this->dbChar == null || $this->dbChar->connect_error) return $this->ReportError("Could not connect to mysql character database!");
	
		return true;
	}
	
	
	public function InitBuildDatabaseWrite ()
	{
		global $uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase;
	
		$this->dbBuild = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
		if ($this->dbBuild == null || $this->dbBuild->connect_error) return $this->InitCharDatabaseWrite("Could not connect to mysql build database!");
		
		return true;
	}

	
	public function LoadData()
	{
		if ($this->inputCharacterId > 0) return $this->LoadCharacterData();
		if ($this->inputBuildId > 0) return $this->LoadBuildData();
		
		return $this->ReportError("No target character or build specified!");
	}
	
	
	public function LoadCharacterData()
	{
		if (!$this->InitCharDatabaseWrite()) return false;
		
		$query = "SELECT * FROM characters WHERE id={$this->inputCharacterId};";
		$result = $this->dbChar->query($query);
		if ($result === false) return $this->ReportError("Failed to load character data!");
		
		$this->characterData = $result->fetch_assoc();
		
		return true;
	}
	
	
	public function LoadBuildData()
	{
		if (!$this->InitBuildDatabaseWrite()) return false;
		
		$query = "SELECT * FROM characters WHERE id={$this->inputBuildId};";
		$result = $this->dbBuild->query($query);
		if ($result === false) return $this->ReportError("Failed to load build data!");
		
		$this->characterData = $result->fetch_assoc();
		
		return true;
	}
	
	
	public function SaveData()
	{
		if ($this->inputCharacterId > 0) return $this->SaveCharacterData();
		if ($this->inputBuildId > 0) return $this->SaveBuildData();
		
		return $this->ReportError("No target character or build specified!");
	}
	
	
	public function SaveCharacterData()
	{
		if (!$this->InitCharDatabaseWrite()) return false;
			
		$filename = $this->dbChar->real_escape_string($this->fileBaseName);
		$origFilename = $this->dbChar->real_escape_string($this->fileName);
		$caption = $this->dbChar->real_escape_string($this->inputCaption);
		
		$query = "SELECT * FROM screenshots WHERE characterId='{$this->inputCharacterId}' AND origFilename='$origFilename';";
		$result = $this->dbChar->query($query);
		if ($result === false) return $this->ReportError("Failed to load existing screenshot data!");
		
		if ($result->num_rows > 0)
		{
			error_log("SaveCharacterData {$result->num_rows}");
			$this->ReportWarning("Updating existing screenshot data!");
			
			$query = "UPDATE screenshots SET caption='$caption' WHERE characterId='{$this->inputCharacterId}' AND origFilename='$origFilename';";
			$result = $this->dbChar->query($query);
			if ($result === false) return $this->ReportError("Failed to update screenshot data!");
			
			return true;
		}
		
		$query = "INSERT INTO screenshots(characterId, filename, origFilename, caption) VALUES('$this->inputCharacterId', '$filename', '$origFilename', '$caption');";
		$result = $this->dbChar->query($query);
		if ($result === false) return $this->ReportError("Failed to create new screenshot data!");
		
		return true;
	}
	
	
	public function SaveBuildData()
	{
		if (!$this->InitBuildDatabaseWrite()) return false;
		
		$filename = $this->dbBuild->real_escape_string($this->fileBaseName);
		$origFilename = $this->dbBuild->real_escape_string($this->fileName);
		$caption = $this->dbBuild->real_escape_string($this->inputCaption);
		
		$query = "SELECT * FROM screenshots WHERE characterId='{$this->inputBuildId}' AND origFilename='$origFilename';";
		$result = $this->dbBuild->query($query);
		if ($result === false) return $this->ReportError("Failed to load existing screenshot data!");
		
		if ($result->num_rows > 0)
		{
			$this->ReportWarning("Updating existing screenshot data!");
			
			$query = "UPDATE screenshots SET caption='$caption' WHERE characterId='{$this->inputBuildId}' AND origFilename='$origFilename';";
			$result = $this->dbBuild->query($query);
			if ($result === false) return $this->ReportError("Failed to update screenshot data!");
			
			return true;
		}
		
		$query = "INSERT INTO screenshots(characterId, filename, origFilename, caption) VALUES('$this->inputBuildId', '$filename', '$origFilename', '$caption');";
		$result = $this->dbBuild->query($query);
		if ($result === false) return $this->ReportError("Failed to create new screenshot data!");
		
		return true;
	}
	
	
	public function ParseFormInput()
	{
		$this->WriteHeaders();
		
		$this->inputParams = $_REQUEST;
		
		if (array_key_exists("charid", $this->inputParams)) $this->inputCharacterId = intval($this->inputParams['charid']);
		if (array_key_exists("buildid", $this->inputParams)) $this->inputBuildId = intval($this->inputParams['buildid']);
		if (array_key_exists("wikiUserName", $this->inputParams)) $this->inputWikiUserName = $this->inputParams['wikiUserName'];
		if (array_key_exists("caption", $this->inputParams)) $this->inputCaption = $this->inputParams['caption'];
		
		if (array_key_exists("screenshot", $_FILES))
		{
			$this->fileName = $_FILES["screenshot"]['name'];
			$this->fileSize = $_FILES["screenshot"]['size'];
			$this->fileError = $_FILES["screenshot"]['error'];
			$this->fileTmpName = $_FILES["screenshot"]['tmp_name'];
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
					$this->fileErrorMsg = "Missing a temporary folder.";
					break;
				case UPLOAD_ERR_CANT_WRITE:
					$this->fileErrorMsg = "Failed to write file to disk.";
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
	
	
	public function OutputUpload()
	{
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>UESP -- Submit ESO Character & Build Screenshot</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" href="submit.css" />
</head>
<body>

<table border="0" cellpadding="2" cellspacing="0" id="maintable">
<tr>
	<td>
		<h1>UESP -- Submitted ESO Character & Build Screenshot...</h1>
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
<?php
	$output = "";
	
	if ($this->fileError != 0)
	{
		$output = "<b>Error: Failed to upload screenshot file!</b><br /><br/>";
		$output .= $this->fileErrorMsg . "<br />";
		$output .= "Error Code: " . $this->fileError . "<br />";
	}
	else
	{
		$filesize = number_format($this->fileSize);
		$output  = "<b>Successfully uploaded screenshot file!</b><br /><br/>";
		$output .= "Filename: {$this->fileName}<br />";
		$output .= "File Size: $filesize bytes<br />";
		$output .= "Local Filename: {$this->fileMoveName}<br /><br/>";
	}
	
	print($output);
	
	$params = "";
	if ($this->inputCharacterId > 0) $params .= "charid={$this->inputCharacterId}&";
	if ($this->inputBuildId > 0) $params .= "buildid={$this->inputBuildId}&";
?>
	</td>
</tr><tr>
	<td>
<?php
		print ("<a href=\"submitScreenshot.php?$params\" style=\"float: right;\">Upload more character/build screenshots...</a>");
?>
	</td>
	
</table>

</body>
</html>
<?php
	}
	
	
	public function OutputForm()
	{
		$outputError = false;
		
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>UESP -- Submit ESO Character & Build Screenshot</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" href="submit.css" />
	<script type="text/javascript" src="resources/jquery-1.10.2.js"></script>
	<script type="text/javascript" src="submit.js"></script>
</head>
<body>

<form id="submitform" enctype="multipart/form-data" action="submitScreenshot.php" method="post">

<table border="0" cellpadding="2" cellspacing="0" id="maintable">
<tr>
	<td>
		<h1>UESP -- Submit ESO Character & Build Screenshot</h1>
		Use this page to manually submit an ESO screenshot for your UESP builds or characters. On Windows systems you can use the uespLogMonitor program to
		automatically upload character screenshots taken with the <em>/uespsavebuild screenshot</em> command.
		<p />
		<ul>
			<li>Take a screenshot of your character/build inside ESO using <em>F12</em> or the <em>/uespsavebuild screenshot</em> command.</li>
			<li>(optional) Convert your screenshot from BMP to JPEG for quicker uploads.</li>
			<li>Click on <em>Choose File</em> and fnd your screenshot image taken in ESO which is usually in the folder:<br/>
				<em>Documents\Elder Scrolls Online\live\Screenshots\</em>
			</li>
			<li>Click the <em>Upload</em> button to submit your file.</li>
		</ul>
		<p />
		Note: Maximum file upload size is 40MB.
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
<?php

		$name = htmlspecialchars($this->characterData['name']);
		$wikiUserName = $_COOKIE['uesp_net_wiki5UserName'];
		$safeWikiName = htmlspecialchars($wikiUserName);
		$outputError = false;
		
		if ($this->characterData['wikiUserName'] != $wikiUserName)
		{
			$outputError = true;
			print("<b>ERROR:</b> You do not have permission to upload screenshots for this build/character! ");
			print(" Make sure you are logged into the <a href='//en.uesp.net' target='_blank'>UESP Wiki</a> in another tab in this browser and that you own this build/character.<br /><br/>");
		}

		if ($this->inputCharacterId > 0)
		{
			print("<div class=\"ecdUploadCaption\">Character Name:</div> <b>$name</b><br /><br/>");
			print("<div class=\"ecdUploadCaption\">Character ID:</div> <input type=\"text\" name=\"charid\" value=\"{$this->inputCharacterId}\" size=\"7\" readonly=\"readonly\" class=\"ecdSubmitRequired\"/> (required)<br /><br/>");
			
		}
		elseif ($this->inputBuildId > 0)
		{
			print("<div class=\"ecdUploadCaption\">Build Name:</div> <b>$name</b><br /><br/>");
			print("<div class=\"ecdUploadCaption\">Build ID:</div> <input type=\"text\" name=\"buildid\" value=\"{$this->inputBuildId}\" size=\"7\" readonly=\"readonly\" class=\"ecdSubmitRequired\"/> (required)<br /><br/>");
		}
		else 
		{
			$outputError = true;
			print("<b>ERROR:</b> Missing required character or build ID!<br />");
		}
		
		print("<div class=\"ecdUploadCaption\">Wiki Username:</div> <input type=\"text\" name=\"wikiuser\" value=\"$safeWikiName\" size=\"20\" readonly=\"readonly\"  class=\"ecdSubmitRequired\" /> (required)<br/><br/>");
		
		if (!$outputError)
		{
?>
		<div class="ecdUploadCaption">Caption:</div> <input type="text" name="caption" value="" size="32"/> (optional)<br/>
				
		<br /><br /><br />
		
		<input type="file" name="screenshot" value="Choose Screenshot File..." />
		<input type="hidden" name="MAX_FILE_SIZE" value="41000000" />
		<br /> &nbsp;
	</td>
</tr><tr>
	<td>
		<input type="submit" id="submitbutton" value="Upload" onclick="return OnSubmitEsoScreenshotFile();" />
	</td>
<?php
		}
		
?>

</table>

</form>

<div id='esosubmituploadscreen' style='display: none;'>
Uploading Data...
</div>

</body>
</html>
<?php
		return true;
	}
	
	
	public function WriteHeaders()
	{
		header("Expires: 0");
		header("Pragma: no-cache");
		header("Cache-Control: no-cache, no-store, must-revalidate");
		header("Pragma: no-cache");
		header("content-type: text/html");
	}
	
	
	public function ProcessUpload()
	{
		if ($this->fileError != 0)
		{
			error_log("upload error:" . $this->fileError);
			return false;
		}
		
		if ($this->inputCharacterId > 0)
		{
			$basePath = "char-" . $this->inputCharacterId;
			
			if (!is_dir($this->BASE_BUILDDATA_SCREENSHOT_PATH . $basePath))
			{
				$result = mkdir($this->BASE_BUILDDATA_SCREENSHOT_PATH . $basePath);
				if (!$result) return $this->ReportError("Failed to create the path '$basePath'!");
			}
			
			$pathInfo = pathinfo($this->fileName);
			$baseFilename = $basePath . "/" . $pathInfo['filename'] . '.jpg';
			
			$destFilename = $this->BASE_CHARDATA_SCREENSHOT_PATH . $baseFilename;
		}
		elseif ($this->inputBuildId > 0)
		{
			$basePath = "build-" . $this->inputBuildId;
			
			if (!is_dir($this->BASE_BUILDDATA_SCREENSHOT_PATH . $basePath))
			{
				$result = mkdir($this->BASE_BUILDDATA_SCREENSHOT_PATH . $basePath);
				if (!$result) return $this->ReportError("Failed to create the path '$basePath'!");
			}
			
			$pathInfo = pathinfo($this->fileName);
			$baseFilename = $basePath . "/" . $pathInfo['filename'] . '.jpg';
			
			$destFilename = $this->BASE_BUILDDATA_SCREENSHOT_PATH . $baseFilename;
		}
		else
		{
			return $this->ReportError("No character or build specified for screenshot!");
		}
		
		$this->fileMoveName = $destFilename;
		$this->fileBaseName = $baseFilename;
	
		$safeInput = escapeshellarg($this->fileTmpName);
		$safeOutput = escapeshellarg($destFilename);
		$cmd = "convert $safeInput -quality 35 $safeOutput";
	
		$lastOutput = exec($cmd, $output, $result);
		$output = implode("<br/>", $output);
		if ($result) return $this->ReportError("Failed to convert/save input file as a JPEG image file!<br/>Shell Command: $cmd<br/>Output: $output<br/>Result: $result");

		chmod($destFilename, 0644);
	
		return $this->SaveData();
	}
	
	
	public function OutputHtml()
	{
		if ($this->hasFileData)
		{
			$this->ProcessUpload();
			$this->OutputUpload();
		}
		else
		{
			$this->LoadData();
			$this->OutputForm();
		}
	}
	
};



$g_EsoScreenshotSubmitter = new EsoCharScreenshotSubmitter();
$g_EsoScreenshotSubmitter->ParseFormInput();
$g_EsoScreenshotSubmitter->OutputHtml();

