<?php
	function sheetGallery($name, $pages) {
		$galleryPage = $pages->get('name='.$name);

		echo '<div id="'.$name.'Gallery" class="sheetContents">';  
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

	function biography($pages) {
		$bioPage = $pages->get('name=biography');
		echo '<div id="biography" class="sheetContents">';  
		echo '	<img src="'.$bioPage->biography_image->width(300)->url.'" 
					title="'.$bioPage->biography_image->description.'" 
					alt="'.$bioPage->biography_image->description.'" id="bioImage"/>';
		echo '<div id="bioDetails">'.$bioPage->biography.'</div>';
		echo '</div>';
	}

	function contact($pages) {
		$contactPage = $pages->get('name=contact');
		echo '<div id="contact" class="sheetContents">';  
		echo '<h2 id="email">'.$contactPage->title.'</h2>';
		echo '<div id="email">'.$contactPage->email.'</div>';
		echo '</div>';
	}
?>
