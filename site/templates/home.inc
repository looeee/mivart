</head>
<body>
	<div id="overlayLeft" class="overlay"></div>
	<div id="overlayRight" class="overlay"></div>
	
	<div id="line"></div>
	<div id="lineSprites">

	  	<div id="silk">
	    	<div id="silkTrigger"></div>
	  	</div>

		<div id="silk1">
			<div id="silk1Trigger"></div>
		</div>
	
		 <div id="sheet">
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