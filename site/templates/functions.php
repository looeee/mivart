<?php

	//image processing options
	$options = array(
	  'upscaling' => false,
	);

	function sheetGallery($name, $pages) {
		$galleryPage = $pages->get('name='.$name);

		echo '<div id="'.$name.'Gallery" class="sheetContents">';  
		if(count($galleryPage->images)) {
	        foreach($galleryPage->images as $image) {            
	            echo '<a href="'.$image->width(1280, $options)->url.'">
	            	<img src="'.$image->height(100, $options)->url.'" title="'.$image->description.'" alt="'.$image->description.'"/>
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

	function silksVideo(){
		echo '<div id="silksVideo" class="sheetContents">';  ;
		echo 	'<iframe width="100%" height="100%" src="https://www.youtube.com/embed/vYJpy7jMAAU?wmode=opaque?rel=0?autoplay=1&html5=1" frameborder="0" allowfullscreen></iframe>';
		echo '</div>';
	}
?>
