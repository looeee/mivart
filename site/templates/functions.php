<?php
	function sheetGallery($name, $pages) {
		$galleryPage = $pages->get('name='.$name.', include=all');

		echo '<div id="'.$name.'Gallery" class="sheetGallery">';  
		if(count($galleryPage->images)) {
	        foreach($galleryPage->images as $image) {            
	            echo '<a href="'.$image->url.'">
	            	<img src="'.$image->height(100)->url.'" title="'.$image->description.'" alt="'.$image->description.'"/>
	            </a>';
	        }    
	     }    
		echo "</div>"; //close craftsGallery div

		echo "<script>";

		echo '$("#'.$name.'Gallery").photobox("a",{ time:0 });';

		echo "</script>";
	}
?>
