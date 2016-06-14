<!DOCTYPE HTML>
<html>
	<head>
		<title>UESP:ESO Character Build Data</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<style type="text/css">>
			body {
				background-color: #FBEFD5;
				font-family: sans-serif;
				font-size: 13px;
			}
		</style>
		<link rel="stylesheet" href="http://esobuilds-static.uesp.net/resources/esobuilddata.css" />
		<link rel="stylesheet" href="http://esolog-static.uesp.net/resources/esoitemlink.css" />
		<link rel="stylesheet" href="http://esolog-static.uesp.net/resources/esoitemlink_embed.css" />
		<script type="text/javascript" src="http://esobuilds-static.uesp.net/resources/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="http://esobuilds-static.uesp.net/resources/jquery.tablesorter.min.js"></script>
		<script type="text/javascript" src="http://esobuilds-static.uesp.net/resources/esobuilddata.js"></script>
		<script type="text/javascript" src="http://esobuilds-static.uesp.net/resources/esobuilddata_itemlink.js"></script>
	</head>
<body>
<?php

require_once("viewBuildData.class.php");

$buildDataViewer = new EsoBuildDataViewer();
print($buildDataViewer->getOutput());

?>
<hr />
<div id='ecdFooter'>
Created and hosted by the <a href="http://www.uesp.net">UESP</a>.
</div>
</body>
</html>
