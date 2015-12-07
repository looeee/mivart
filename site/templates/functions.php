<?php

	//image processing options
	$options = array(
	  'upscaling' => false,
	);

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

	function resizedImage($page, $name, $width){
		echo $page->images->get("description=".$name)->size($width, 0, $options)->url;
	}

	function gallery($pages, $name, $width, $thumbWidth ) {
		$page = $pages->get('name='.$name);
		//maximum width 1280px
		if($width >1280) { $width = 1280; }

		echo '<div id="sheetGallery" class="sheetContents">';  
		
		if(count($page->images)) {
	        foreach($page->images as $image) {            
	            echo '<a href="'.$image->width($width, $options)->url.'">
	            	<img src="'.$image->size($thumbWidth, $thumbWidth, $options)->url.'" title="'.$image->description.'" alt="'.$image->description.'"/>
	            </a>';
	        }    
	     }    
		echo "</div>";		
	}

	if( isset($_GET['silks']) ){
		silksVideo();
	}
	elseif( isset($_GET['contact']) ){
		contact($pages);
	}
	elseif( isset($_GET['biography']) ){
		biography($pages);
	}
	elseif( isset($_GET['image']) ){
		resizedImage( $page, $_GET['image'], $_GET['width'] );
	}
	elseif( isset($_GET['thumbWidth']) ){
		gallery($pages, $_GET['name'], $_GET['width'], $_GET['thumbWidth'] );
	}

?>
