<?php 
	//if we are calling from AJAX include functions file
	if($config->ajax){
		include("./functions.php");
	}
	//otherwise load the page.
	else{
    	include("./header.php"); 
    	include("./home.inc"); 
    	include("./footer.php");
	}
?>    