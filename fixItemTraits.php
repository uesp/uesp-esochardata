<?php

if (php_sapi_name() != "cli") die("Can only be run from command line!");
print("Fixing item trait data...\n");

require("/home/uesp/secrets/esobuilddata.secrets");
require("/home/uesp/secrets/esochardata.secrets");
require("/home/uesp/secrets/esolog.secrets");


function LoadItemData($db, $itemId, $subtype, $level)
{
	$query = "SELECT * from uesp_esolog.minedItem WHERE itemId=$itemId AND internalLevel=$level AND internalSubType=$subtype LIMIT 1;";
	$result = $db->query($query);
	if ($result === False) return false;
	
	if ($result->num_rows == 0)
	{
		$query = "SELECT * from uesp_esolog.minedItem WHERE itemId=$itemId AND internalLevel=1 AND internalSubType=1 LIMIT 1;";
		$result = $db->query($query);
		if ($result === False) return false;
		if ($result->num_rows == 0) return false;
	}
	
	return $result->fetch_assoc();
}


function UpdateTraits($db, $dbLog, $table)
{
	$query = "SELECT * FROM $table;";
	$loadItemResult = $db->query($query);
	if (!$loadItemResult) exit("Error loading $table data!");
		
	print("Updating traits in $table...\n");
	
	$numRows = $loadItemResult->num_rows;
	$count = 0;
	
	while (($item = $loadItemResult->fetch_assoc()))
	{
		++$count;
		if (($count % 100) == 0) print("\t$count of $numRows items updated\n");
		
		if ($item['trait'] > 0) continue;
			
		$matches = array();
		$itemLink = $item['itemLink'];
		$result = preg_match('/\|H(?P<color>[A-Za-z0-9]*)\:item\:(?P<itemId>[0-9]*)\:(?P<subtype>[0-9]*)\:(?P<level>[0-9]*)\:(?P<enchantId>[0-9]*)\:(?P<enchantSubtype>[0-9]*)\:(?P<enchantLevel>[0-9]*)\:(.*?)\:(?P<style>[0-9]*)\:(?P<crafted>[0-9]*)\:(?P<bound>[0-9]*)\:(?P<stolen>[0-9]*)\:(?P<charges>[0-9]*)\:(?P<potionData>[0-9]*)\|h(?P<name>[^|\^]*)(?P<nameCode>.*?)\|h/', $itemLink, $matches);
		if ($result !== 1) continue;
	
		$itemData = LoadItemData($dbLog, $matches['itemId'], $matches['subtype'], $matches['level']);
		if ($itemData === false) continue;
	
		$trait = $itemData['trait'];
		if ($trait <= 0 || $trait == null || $trait == "") continue;
	
		$id = $item['id'];
		$query = "UPDATE $table SET trait=$trait WHERE id=$id;";
		$result = $db->query($query);
		if ($result === false) print ("\t$id: Error saving trait data! {$db->error}\n");
		
		//print("\t$query\n");
	}
	
}


$dbBuild = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
if ($dbBuild->connect_error) exit("Could not connect to character mysql database!");

$dbChar = new mysqli($uespEsoCharDataWriteDBHost, $uespEsoCharDataWriteUser, $uespEsoCharDataWritePW, $uespEsoCharDataDatabase);
if ($dbChar->connect_error) exit("Could not connect to character mysql database!");

$dbLog = new mysqli($uespEsoLogWriteDBHost, $uespEsoLogWriteUser, $uespEsoLogWritePW, $uespEsoLogDatabase);
if ($dbLog->connect_error) exit("Could not connect to log mysql database!");


UpdateTraits($dbChar, $dbLog, 'equipSlots');
UpdateTraits($dbChar, $dbLog, 'inventory');
UpdateTraits($dbBuild, $dbLog, 'equipSlots');