<?php 
    include("./header.php"); 
    //Header file includes everyting up to opening <body>
?> 

	    <script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.3.0/snap.svg-min.js"></script>
        <script>window.Snap || document.write('<script src="<?php echo $config->urls->templates?>scripts/vendor/snap.svg-min.js"><\/script>');</script>
        
		<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>
		<script>(typeof _ === 'function') || document.write('<script src="<?php echo $config->urls->templates?>scripts/vendor/lodash.js"><\/script>');</script>

        <script src="//cdnjs.cloudflare.com/ajax/libs/velocity/1.2.2/velocity.min.js"></script>
        <script>(typeof $('body').velocity === 'function') || document.write('<script src="<?php echo $config->urls->templates?>scripts/vendor/velocity.min.js"><\/script>');  </script>

	</head>
	<body>
		<svg width="100%" height="100%">
			<path id="backarrow" d="M0,9.8c0,0.9,0.1,1.8,0.4,2.6c0.2,0.8,0.6,1.6,1,2.4 c0.4,0.7,1,1.4,1.6,2c0.6,0.6,1.3,1.1,2,1.6c0.7,0.4,1.5,0.8,2.4,1c0.9,0.2,1.7,0.4,2.6,0.4c0.9,0,1.8-0.1,2.6-0.4 c0.8-0.2,1.6-0.6,2.4-1c0.7-0.4,1.4-1,2-1.6c0.6-0.6,1.1-1.3,1.6-2c0.4-0.7,0.8-1.5,1-2.4c0.2-0.8,0.4-1.7,0.4-2.6 c0-0.9-0.1-1.8-0.4-2.6c-0.2-0.8-0.6-1.6-1-2.4c-0.4-0.7-1-1.4-1.6-2c-0.6-0.6-1.3-1.1-2-1.6c-0.7-0.4-1.5-0.8-2.4-1 c-0.8-0.2-1.7-0.4-2.6-0.4c-0.9,0-1.8,0.1-2.6,0.4C6.5,0.4,5.7,0.8,5,1.2c-0.7,0.4-1.4,1-2,1.6C2.3,3.4,1.8,4,1.4,4.8 c-0.4,0.7-0.8,1.5-1,2.4C0.1,8,0,8.9,0,9.8z M3.4,9.9L3.4,9.9l4.9-5.1h3.5L8,8.5h8.1v2.6H8l3.7,3.8H8.2L3.4,9.9z";
				 transform="matrix(5,0,0,5,0,0)" fill="none" stroke="#ffffff"  strokeMiterLimit="100" style="stroke-width: 0px;">
			</path>
		</svg>
		
		
		<div class="blockingDiv"></div>
	
		<div class="background"></div>
		
		<div class="wl-sprites"></div>
		
		<div class="plank-sprites"></div>
		
		<div class="boat-wrapper"></div>
		
		<div class="clouds-wrapper"></div>
		
		<svg id="paper" width="100%" height="100%">
		  <defs>
		    <clipPath id="boatClip">
		      <path d="" id="boatClipPath"></path>
		    </clipPath>
		  </defs>
		  <path stroke="#000000" style="stroke-width: 1.25px;" id="wlPath"></path>
		  <path stroke="#000000" fill="none" style="stroke-width: 0px;" id="goosePath"></path>
		  <path stroke="#000000" fill="none" style="stroke-width: 0px;" id="floorgourdPath"></path>
		  <path stroke="#000000" fill="none" style="stroke-width: 0px;" id="staffPath"></path>
		</svg>
				
		<script  type='text/javascript'>
		    
		    //All javscript variables that need calls to PHP go here.
			
		    
		    //URL for images folder in templates directory
		    var imagesUrl = "<?php echo $config->urls->templates?>images/front-page/";
		    var soundsUrl = "<?php echo $config->urls->templates?>sounds/";
		    
		</script>
		<script type='text/javascript' src="<?php echo $config->urls->templates?>scripts/front_page.js"></script>
		
		
		<?php
		    //Footer includes everything after closing </body>
		    include("./footer.php"); 