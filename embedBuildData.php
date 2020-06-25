<?php

require_once("viewBuildData.class.php");

$buildDataViewer = new EsoBuildDataViewer(true, false, true);

ob_start("ob_gzhandler");
header("Expires: 0");
header("Pragma: no-cache");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");

header("Access-Control-Allow-Origin: *");
header("content-type: text/html");

print($buildDataViewer->getOutput());