<!DOCTYPE HTML>
<html>
	<head>
		<title>UESP:ESO Character Build Editor</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<style type="text/css">>
			body {
				background-color: #FBEFD5;
				font-family: sans-serif;
				font-size: 13px;
			}
		</style>
		<link rel="stylesheet" href="http://esobuilds.uesp.net/resources/esobuilddata.css" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esoitemlink.css" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esoitemlink_embed.css" />
		<link rel='stylesheet' href='http://esolog.uesp.net/resources/esoItemSearchPopup.css' />
		<link rel='stylesheet' href='http://www.uesp.net/w/extensions/UespEsoSkills/uespesoskills.css' />
		<link rel='stylesheet' href='http://esolog.uesp.net/resources/esoskills_embed.css' />
		<link rel='stylesheet' href='http://esolog.uesp.net/resources/esocp_simple_embed.css' />
		<link rel='stylesheet' href='resources/esoEditBuild.css' />
		<link rel='stylesheet' href='resources/esoEditBuild_embed.css' />
		<script type="text/javascript" src="http://esobuilds.uesp.net/resources/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="http://esobuilds.uesp.net/resources/jquery.tablesorter.min.js"></script>
		<script src='http://esobuilds.uesp.net/resources/json2.js'></script>
		<script src='http://www.uesp.net/w/extensions/UespEsoItemLink/uespitemlink.js'></script>
		<script src='http://esolog.uesp.net/resources/esoskills.js'></script>
		<script src='http://esolog.uesp.net/resources/esocp_simple.js'></script>
		<script type="text/javascript" src="http://esobuilds.uesp.net/resources/esobuilddata.js"></script>
		<script src='http://www.uesp.net/w/extensions/UespEsoSkills/uespesoskills.js?4Apr2016'></script>
		<script src='http://esolog.uesp.net/resources/esoItemSearchPopup.js'></script>
		<script src='resources/esoEditBuild.js'></script>
		
	</head>
<body>
<?php

require_once("editBuild.class.php");


$buildDataEditor = new EsoBuildDataEditor();
print($buildDataEditor->GetOutputHtml());

?>
<hr />
<div id='ecdFooter'>
Created and hosted by the <a href="http://www.uesp.net">UESP</a>.
</div>
</body>
</html>
