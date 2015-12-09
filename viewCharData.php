<!DOCTYPE HTML>
<html>
	<head>
		<title>UESP:ESO Character Data</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<link rel="stylesheet" href="resources/esochardata.css" />
		<link rel="stylesheet" href="http://content3.uesp.net/esolog/resources/esoitemlink.css" />
		<link rel="stylesheet" href="http://content3.uesp.net/esolog/resources/esoitemlink_embed.css" />
		<script type="text/javascript" src="resources/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="resources/esochardata.js"></script>
	</head>
<body>
<?php 


require_once("viewCharData.class.php");

$charDataViewer = new EsoCharDataViewer();
print($charDataViewer->getOutput());

?>
<hr />
<div id='ecdFooter'>
Created and hosted by the <a href="http://www.uesp.net">UESP</a>.
</div>
</body>
</html>
