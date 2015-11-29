<?php 
    include("./header.php"); 
    //Header file includes everyting up to opening <body>
?> 
    
	</head>
	<body>
		
		<div id="bb-background"></div>
		
    	<div id="bb-openbook" >
   
			<div id="bb-wrapper">
				<div class="bb-bookblock">
					
					<div class="bb-item">
						<div id="bb-description">
							<?php 	echo $page->book_description;	?>
						</div>
						<div id="bb-cover"></div>
					</div>
					
				</div
			
				</div>
			</div>
		</div>
		
		<nav id="bb-nav">
			<a id="bb-home" href="/" class="bb-icon bb-icon-home"><img src="/site/templates/images/books/icons/home.png"></a>
			<a id="bb-nav-first" href="#" class="bb-icon bb-icon-first"><img src="/site/templates/images/books/icons/first.png"></a>
			<a id="bb-nav-prev" href="#" class="bb-icon bb-icon-arrow-left"><img src="/site/templates/images/books/icons/prev.png"></a>
			<a id="bb-nav-next" href="#" class="bb-icon bb-icon-arrow-right"><img src="/site/templates/images/books/icons/next.png"></a>
			<a id="bb-nav-last" href="#" class="bb-icon bb-icon-last"><img src="/site/templates/images/books/icons/last.png"></a>
		</nav>
		
	    <?php
	        //All javscript variables that need calls to PHP go here.
	        echo '<script  type="text/javascript">'."\r\n";
	        
	        //Get the URLS of the book images and add them to an array 
			echo "var images = [];";
			if(count($page->images)) {        
               foreach($page->images as $image) {            
                    echo "images.push('".$image->url."');"."\r\n";
                    
                    
                    
                }    
             }    
			
			//Get the book front page if it exists
		  	if(count($page->book_front)) { 
		  	    echo 'var titlePage ="'.$page->book_front->url.'";'."\r\n";
		  	}else{
		  	    echo 'var titlePage =""';
		  	}
		  	
		  	//Get the book front cover  if it exists
		  	if(count($page->book_cover)) { 
		  	    echo 'var cover ="'.$page->book_cover->url.'";'."\r\n";
		  	}else{
		  	    echo 'var cover =""';
		  	}
		  	
		    //Get the book description if it exists
		  	if(count($page->book_description)) { 
		  	    echo "var description ='".$page->book_description."';"."\r\n";
		  	}else{
		  	    echo "var description =''"."\r\n";
		  	}
		  	
		  	echo '</script>';
		?>

    <script src="<?php echo $config->urls->templates?>scripts/book.js"></script>
	
	    
    <script src="<?php echo $config->urls->templates?>scripts/vendor/jquerypp.custom.js"></script>
    <script src="<?php echo $config->urls->templates?>scripts/vendor/modernizr.custom.js"></script>
    <script src="<?php echo $config->urls->templates?>scripts/vendor/jquery.bookblock.min.js"></script>
    
<?php
    //Footer includes everything after closing </body>
    include("./footer.php"); 