<?php 
	function gallery($page) {
		$name = $page->name;

		echo '<div id="sheetGallery" class="sheetContents">';  
		
		if(count($page->images)) {
	        foreach($page->images as $image) {            
	            echo '<a href="'.$image->width(1280, $options)->url.'">
	            	<img src="'.$image->height(100, $options)->url.'" title="'.$image->description.'" alt="'.$image->description.'"/>
	            </a>';
	        }    
	     }    
		echo "</div>"; //close craftsGallery div		
	}

	//Redirect browser to home page as this page not intended to be directly viewable
    if($config->ajax) gallery($page);
    else header('Location: '.$config->urls->root); 


	
?>