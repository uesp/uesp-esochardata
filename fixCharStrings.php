<?php 

if (php_sapi_name() != "cli") die("Can only be run from command line!");
print("Fixing character strings in build data...\n");

require("/home/uesp/secrets/esobuilddata.secrets");

$db = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
if ($db->connect_error) exit("Could not connect to mysql database!");


$query = "SELECT * FROM characters;";
$result = $db->query($query);
if (!$result) exit("Error loading character data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$class = $row['class'];
	$race = $row['race'];
	$alliance = $row['alliance'];	
	
	$newClass = preg_replace("#\^.*#", "", $class);
	$newRace = preg_replace("#\^.*#", "", $race);
	$newAlliance = preg_replace("#\^.*#", "", $alliance);
	
	//print("$class -- $newClass\n");
	
	$query = "UPDATE characters SET class='$newClass', race='$newRace', alliance='$newAlliance' WHERE id=$id;";
	$db->query($query);
}

$query = "SELECT * FROM championPoints;";
$result = $db->query($query);
if (!$result) exit("Error loading CP data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);
	
	$query = "UPDATE championPoints SET name='$newName' WHERE id=$id;";
	$db->query($query);
	
}

$query = "SELECT * FROM buffs;";
$result = $db->query($query);
if (!$result) exit("Error loading buff data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);

	$query = "UPDATE buffs SET name='$newName' WHERE id=$id;";
	$db->query($query);
}

$query = "SELECT * FROM skills;";
$result = $db->query($query);
if (!$result) exit("Error loading skill data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);

	$query = "UPDATE skills SET name='$newName' WHERE id=$id;";
	$db->query($query);
}

$query = "SELECT * FROM stats;";
$result = $db->query($query);
if (!$result) exit("Error loading stat data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);

	$query = "UPDATE stats SET name='$newName' WHERE id=$id;";
	$db->query($query);
}

$query = "SELECT * FROM actionBars;";
$result = $db->query($query);
if (!$result) exit("Error loading action bar data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);

	$query = "UPDATE actionBars SET name='$newName' WHERE id=$id;";
	$db->query($query);
}

$query = "SELECT * FROM equipSlots;";
$result = $db->query($query);
if (!$result) exit("Error loading equip slot data!");

while (($row = $result->fetch_assoc()))
{
	$id = $row['id'];
	$name = $row['name'];
	$newName = preg_replace("#\^[a-zA-Z]*#", "", $name);

	$query = "UPDATE equipSlots SET name='$newName' WHERE id=$id;";
	$db->query($query);
}

//actionBars
//buffs
//championPoints
//equipSlots
//screenshots
//skills
//stats

