<?php 
    include("./header.php"); 
    //Header file includes everyting up to opening <body>
?> 

    <link rel="stylesheet" type="text/css" href="/site/templates/gallery/style.css" />
	</head>
	<body>
		
		<div id="gallery">
			
			<div class="ws_images">
				<ul>
					<?php 
						if(count($page->images)) {  
						   $imgNum = 0;
			               foreach($page->images as $image) {            
			                    echo '<li>
			                    	<img src="'.$image->height(600)->url.'" alt="'.$image->description.'" title="'.$image->description.'" id="wows1_'.$imgNum.'"/>
			                    </li>';
			                    $imgNum++;
			                }    
			             }    
					?>
					
				</ul>
			</div>
			
			<div class="ws_thumbs">
				<div>
					<?php 
						if(count($page->images)) {      
						
							$imgNum = 0;
							
			               	foreach($page->images as $image) {            
			                    
			                    echo '<a href="wows1_'.$imgNum.'" title="'.$image->description.'">
									<img src="'.$image->size(96,72)->url.'" alt="" />
								</a>';
								
								$imgNum++;
			            	}    
			             }    
					?>
				</div>
			</div>
			
		</div>	
		
		<?php
	        //All javscript variables that need calls to PHP go here.
	        //echo '<script  type="text/javascript">'."\r\n";
	   
		  	
		  	//echo '</script>';
		  	
		?>

	
	
		<script type="text/javascript" src="/site/templates/scripts/vendor/wowslider.js"></script>
		

		<!-- <script type="text/javascript" src="/site/templates/scripts/vendor/wowslider.mod.js"></script> -->

		
		<script type="text/javascript" src="/site/templates/scripts/gallery.js"></script>

<?php
    //Footer includes everything after closing </body>
    include("./footer.php"); 