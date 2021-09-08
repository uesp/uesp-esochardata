<?php

$TABLE = "stats";
$BATCH_SIZE = 10000;

if (php_sapi_name() != "cli") die("Can only be run from command line!");

require_once("/home/uesp/secrets/esobuilddata.secrets");

$db = new mysqli($uespEsoBuildDataWriteDBHost, $uespEsoBuildDataWriteUser, $uespEsoBuildDataWritePW, $uespEsoBuildDataDatabase);
if ($db->connect_error) exit("Could not connect to mysql database!");

print("Removing primary index and ID field from ESO Build table $TABLE ...\n");

$TMPTABLE = $TABLE . "tmp";

$result = $db->query("DROP TABLE IF EXISTS $TMPTABLE;");
if ($result === false) exit("Error: Failed to drop temporary table $TMPTABLE! {$db->error}\n");

$result = $db->query("CREATE TABLE $TMPTABLE LIKE $TABLE;");
if ($result === false) exit("Error: Failed to create temporary table $TMPTABLE! {$db->error}\n");

$result = $db->query("ALTER TABLE $TMPTABLE DROP COLUMN id;");
if ($result === false) exit("Error: Failed to remove ID column in temporary table $TMPTABLE! {$db->error}\n");

$result = $db->query("DESCRIBE $TMPTABLE;");
if ($result === false) exit("Error: Failed to describe temporary table $TMPTABLE! {$db->error}\n");

$cols = array();

while ($row = $result->fetch_assoc())
{
	$cols[] = $row['Field'];
}

print("\tReading data from $TABLE...\n");

$result = $db->query("SELECT min(id) as m1, max(id) as m2, count(*) as c FROM $TABLE;");
if ($result === false) exit("Error: Failed to read min/max ID from table $TABLE! {$db->error}\n");

$row = $result->fetch_assoc();
$minId = intval($row['m1']);
$maxId = intval($row['m2']);
$idCount = intval($row['c']);

if ($minId >= $maxId || $maxId <= 0) exit("Error: Bad min/max ID $minId:$maxId found for $TABLE!\n");
print("\tID Range $minId - $maxId found for $TABLE\n");

$READ_BATCH_SIZE = floor(($maxId - $minId) / $BATCH_SIZE);
print("\tRead Batch Size = $READ_BATCH_SIZE rows\n");

$startId = 0;
$colList = "`" . implode("`,`", $cols) . "`";
$totalRowCount = 0;

while ($startId <= $maxId)
{
	$endId = $startId + $READ_BATCH_SIZE;
	
	$readResult = $db->query("SELECT * FROM $TABLE WHERE id>='$startId' AND id<'$endId';");
	if ($readResult === false) exit("Error: Failed to read batch $startId:$endId from table $TABLE! {$db->error}\n");
	
	$allValues = array();
	$rowCount = 0;
	
	while ($row = $readResult->fetch_assoc())
	{
		++$rowCount;
		++$totalRowCount;
		
		$values = array();
		
		foreach ($cols as $col)
		{
			$values[] = "'" . $db->real_escape_string($row[$col]) . "'";
		}
		
		$allValues[] = "(" . implode(",", $values) . ")";
	}
	
	if (count($allValues) > 0)
	{
		$allValues = implode(", ", $allValues);
		$query = "INSERT INTO $TMPTABLE($colList) VALUES $allValues;";
		
		$writeResult = $db->query($query);
		if ($writeResult === false) exit("Error: Failed to write batch $startId:$endId from table $TMPTABLE! $query {$db->error}\n");
	}
	
	$pct = floor($totalRowCount / $idCount * 100); 
	print("\tCopied $rowCount rows ($totalRowCount total, $pct%)...\n");
	
	$startId = $endId;
}

$OLD_TABLE = $TABLE . "_old";

$result = $db->query("RENAME TABLE $TABLE to $OLD_TABLE;");
if ($result === false) exit("Error: Failed to rename table $TABLE to $OLD_TABLE! {$db->error}\n");

$result = $db->query("RENAME TABLE $TMPTABLE to $TABLE;");
if ($result === false) exit("Error: Failed to rename table $TMPTABLE to $TABLE! {$db->error}\n");

print("Copied $totalRowCount rows in $TABLE\n");







