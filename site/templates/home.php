<?php 
	include("./functions.php");

	//Header file includes everyting up to opening <body>
    include("./header.php"); 
?>    
	<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js"></script>
	<script src="<?php echo $config->urls->templates?>scripts/vendor/jquery.photobox.js"></script>
	<script defer src="<?php echo $config->urls->templates?>scripts/frontPage.js"></script>

</head>
<body>
	<div id="overlayLeft" class="overlay"></div>
	<div id="overlayRight" class="overlay"></div>

	<div id="lineSprites">

	  	<div id="silk">
	    	<div id="silkTrigger"></div>
	  	</div>

		<div id="silk1">
			<div id="silk1Trigger"></div>
		</div>
	
		 <div id="sheet">
		 	<?php 
		 	/*
		 		sheetGallery('book1', $pages);
		 		sheetGallery('book2', $pages);
		 		sheetGallery('book3', $pages);
		 		sheetGallery('book4', $pages);
		 		sheetGallery('crafts', $pages);
		 		sheetGallery('clothing', $pages);
		 		sheetGallery('performance', $pages);
		 		biography($pages);
		 		contact($pages);
		 		silksVideo();
		 		*/
			?> 
	  	</div>
	 
	</div>

	<div id="clouds"></div>

	<div id="plankSprites">
		<div id="pad">
		</div>
	</div>

	<div id="boatWrapper"></div>

	<div id="background"></div>

	<svg id="paper"  width="0%" height="0%">
			  <defs>
			    <clipPath id="boatClip">
			      <path d="" id="boatClipPath"></path>
			    </clipPath>
			  </defs>
	</svg>		

	<script  type='text/javascript'>
	    //All javscript variables that need calls to PHP go here.
	    
	    //URL for images folder in templates directory
	    var imagesUrl = "<?php echo $config->urls->templates?>images/frontPage/";
	    var soundsUrl = "<?php echo $config->urls->templates?>sounds/";
	    var templateUrl = "<?php echo $config->urls->templates?>";
	    var rootUrl = "<?php echo $config->urls->root?>";
	    
	</script>
	
	<?php
	    //Footer includes everything after closing </body>
	    include("./footer.php"); 