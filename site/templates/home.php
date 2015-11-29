<?php 
    include("./header.php"); 
    //Header file includes everyting up to opening <body>
?>    
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js"></script>
	</head>
	<body>
		
		<div id="lineSprites">
		  <div id="silk">
		    <div id="silkTrigger"></div>
		  </div>
		  <div id="silk1">
		    <div id="silk1Trigger"></div>
		  </div>
		</div>

		<div id="infoLeft" class="info">
		  <div id="infoLeftText" class="infoText">Books</div>
		</div>

		<div id="infoRight" class="info">
		  <div id="infoRightText" class="infoText">Books</div>
		</div>

		<div id="infoBottom" class="info">
		  <div id="infoBottomText" class="infoText">Home</div>
		</div>


		<div id="clouds"></div>

		<div id="plankSprites"></div>

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
		    
		</script>
		<script type='text/javascript' src="<?php echo $config->urls->templates?>scripts/frontPage.js"></script>
		
		
		<?php
		    //Footer includes everything after closing </body>
		    include("./footer.php"); 