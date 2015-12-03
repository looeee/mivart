<?php 
	//Redirect browser to home page as this page not intended to be directly viewable
	header('Location: '.$config->urls->root); 
?> 
    
	</head>
	<body>
	    
	    <?php 
	    
	        if(count($page->biography_image)) { 
		  	    $bioImage = $page->biography_image->url;
		  	    //echo $bioImage;
		  	}else{
		  	    $bioImage = "";
		  	}
		  	
		  	if(count($page->biography)) { 
		  	    $biography = $page->biography;
		  	}else{
		  	    $biography = "";
		  	}
	    ?>
		
		<div id="bb-background"></div>
		
    	<div id="bb-openbook" >
   
			<div id="bb-wrapper">
				<div class="bb-bookblock">
					
					<div class="bb-item">
					    
						<div id="bb-description"><?php echo $biography; ?></div>
						
						<div id="bb-cover" style="background: url('<?php echo $bioImage; ?>') no-repeat 50% 50%; background-size: cover;"></div>
						
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

    <script src="<?php echo $config->urls->templates?>scripts/biography.js"></script>
	
	    
    <script src="<?php echo $config->urls->templates?>scripts/vendor/jquerypp.custom.js"></script>
    <script src="<?php echo $config->urls->templates?>scripts/vendor/modernizr.custom.js"></script>
    <script src="<?php echo $config->urls->templates?>scripts/vendor/jquery.bookblock.min.js"></script>
    
<?php
    //Footer includes everything after closing </body>
    include("./footer.php"); 