<!DOCTYPE HTML>
<html>
	<head>
		<title>UESP:ESO Build Editor</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esocp_simple_embed.css" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esoskills_embed.css" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esoItemSearchPopup.css" />
		<link rel="stylesheet" href="http://esolog.uesp.net/resources/esoitemlink_embed.css" />
		<link rel="stylesheet" href="resources/esoEditBuild.css" />
		<link rel="stylesheet" href="resources/esoEditBuild_embed.css" />
		<script type="text/javascript" src="http://esolog.uesp.net/resources/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="http://esolog.uesp.net/resources/esocp_simple.js"></script>
		<script type="text/javascript" src="http://esolog.uesp.net/resources/esoskills.js"></script>
		<script type="text/javascript" src="http://esolog.uesp.net/resources/esoItemSearchPopup.js"></script>
		<script type="text/javascript" src="http://content3.uesp.net/w/extensions/UespEsoItemLink/uespitemlink.js"></script>
		<script type="text/javascript" src="resources/esoEditBuild.js"></script>
	</head>
<body>
<h1>ESO Character Build Editor</h1>
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
