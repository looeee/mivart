<?php 
	$craftsPage = $pages->get("name=crafts");
	echo '<div id="craftsGallery" class="sheetGallery">';  
	if(count($craftsPage->images)) {
        foreach($craftsPage->images as $image) {            
            echo '<a href="'.$image->url.'">
            	<img src="'.$image->height(100)->url.'" title="'.$image->description.'" alt="'.$image->description.'"/>
            </a>';
        }    
     }    
	echo "</div>"; //close craftsGallery div
?>

<script>
    // applying photobox on a `gallery` element which has lots of thumbnails links.
    // Passing options object as well:
    //-----------------------------------------------
    $('#craftsGallery').photobox('a',{ time:0 });

    // using a callback and a fancier selector
    //----------------------------------------------
    $('#craftsGallery').photobox('li > a.family',{ time:0 }, callback);
    function callback(){
       console.log('image has been loaded');
    }

    // destroy the plugin on a certain gallery:
    //-----------------------------------------------
    //$('#craftsGallery').photobox('destroy');

    // re-initialize the photbox DOM (does what Document ready does)
    //-----------------------------------------------
    //$('#craftsGallery').photobox('prepareDOM');
</script>
