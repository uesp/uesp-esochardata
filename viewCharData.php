<?php 


require_once("viewCharData.class.php");

$charDataViewer = new EsoCharDataViewer();
print($charDataViewer->getOutput());
