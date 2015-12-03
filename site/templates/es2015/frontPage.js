( () => { 
	let config = {
		wlAnimSpeed: 4,
		windSpeed: 0.8,
	}

	const WW = $(window).outerWidth(true);
	const WH = $(window).outerHeight(true);
	const $window = $(window);
	const $body = $("body");
	const $document = $(document);

	const infoLeftText = document.getElementById("infoLeftText");
	const infoRightText = document.getElementById("infoRightText");
	const padInfo = $("#padInfo");

	//sheet info elements
	const sheetContent = $("#sheetContents");
	const craftsGallery = $("#craftsGallery");
	const clothingGallery = $("#clothingGallery");
	const performanceGallery = $("#performanceGallery");
	const book1Gallery = $("#book1Gallery");
	const book2Gallery = $("#book2Gallery");
	const book3Gallery = $("#book3Gallery");
	const book4Gallery = $("#book4Gallery");
	const biography = $("#biography");
	const contact = $("#contact");
	const silksVideo = $("#silksVideo");
	
	//prevent touch scrolling
	document.body.addEventListener('touchmove', (e) => { e.preventDefault(); });

	//refresh page on browser resize (Breaks fullscreen video)
	/*
	window.onresize = () => {
		if (window.RT) { clearTimeout(window.RT); }

		window.RT = setTimeout( () => {
			window.location.href = window.location.href;
			location.reload(false); // false to get page from cache 
		}, 180);
	}
	*/
  
	// * ***********************************************************************
	// *
	// *   HELPER FUNCTIONS
	// *
	// *************************************************************************

	//Return a window height % as a pixel value
	let yPercentToPx = (y) => WH / 100 * y;

	//Return a window height percent value from a pixel value
	let yPxToPercent = (y) => (100 * y)/WH;

	//Return a window width % as a pixel value
	let xPercentToPx = (x) => WW / 100 * x;

	let randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	let randomFloat = (min, max) => Math.random() * (max - min) + min;

	let animateOpacity = (elem, speed, opacity) => {
		TweenLite.to(elem, speed, {opacity: opacity});
	}

	// * ***********************************************************************
	// *
	// *   MOUSE DIRECTION PLUGIN
	// *   Based on Hasin Hayder's original [hasin@leevio.com | http://hasin.me]
	// *
	// *************************************************************************

	( ($) => {
		var oldx = 0;
		var direction = "";
		$.mousedirection = () => {
			$document.on("mousemove", (e) => {
				var activeElement = e.target || e.srcElement;
				if (e.pageX > oldx) {
					direction = "right";
				} else if (e.pageX < oldx) {
					direction = "left";
				}
				$(activeElement).trigger({
					type: "mousedirection",
					direction: direction
				});
				oldx = e.pageX;
			});
		};
	})(jQuery);

	$.mousedirection();

	// * ***********************************************************************
	// *
	// *   LINE CLASS 
	//	Draw a horizontal line over the whole screen given 2 points
	//  p1 = {    p2 = {
	//    x: 12,      x: 100,
	//    y: 12       y: 12
	//  }       
	// *
	// *************************************************************************

	class Line{
		constructor(lineElem="line", p1={x:0, y:10}, p2={x:100, y:18}){
			if($('#'+lineElem).length === 0){
				$body.append('<div id="'+lineElem+'"></div>')
			}

			this.lineElem = $('#'+lineElem);

			this.lineElem.css({opacity: 0})

			this.p1 = {
				x: xPercentToPx(p1.x),
				y: yPercentToPx(p1.y)
			};
			this.p2 = {
				x: xPercentToPx(p2.x),
				y: yPercentToPx(p2.y)
			};

			this.slope = ( p2.y - p1.y ) / ( p2.x - p1.x );

			this.slopeDegrees = Math.atan(this.slope) * 180 / (4 * Math.atan(1));

			this.lineElem.css({
				transform: "rotate(" + this.slopeDegrees + "deg)",
				position: 'absolute',
				top: p1.y + "%",
				left: 0,
				'transform-origin': '0%',
				width: "150%",
				height: 0, 
				'border-top': '1px solid rgba(0, 0, 0, 1)',
				'z-index': '-100',
			});

			//any calculations that need to be done after the images have loaded go here
			window.addEventListener("load", ()=> { 
				let fadeSpeed = randomFloat(0.2,0.4);
				animateOpacity("#line", fadeSpeed,1);
			});
		}

		//return y value for given x value
		yPoint(x){
			return this.slope * (x - this.p1.x) + this.p1.y;
		}
	}

	let washingLine = new Line();

	// * ***********************************************************************
	// *
	// *   	WASHING LINE TIMELINES CLASS
	// *
	// *************************************************************************
	class WashingLineTimelines{
		constructor(){
			let options = {
				paused:true, 
				onComplete: this.onComplete, 
				onReverseComplete: this.onComplete,
				onStart: this.onStart,
			}

			this.centreTL = new TimelineMax(options);
			this.centreTL.add("middle", config.wlAnimSpeed/2);

			this.booksTL = new TimelineMax(options);
			this.booksTL.add("middle", config.wlAnimSpeed/2);

			this.clothingTL = new TimelineMax(options);
			this.clothingTL.add("middle", config.wlAnimSpeed/2);

			this.craftsTL = new TimelineMax(options);
			this.craftsTL.add("middle", config.wlAnimSpeed/2);

			this.performanceTL = new TimelineMax(options);
			this.performanceTL.add("middle", config.wlAnimSpeed/2);

			this.sheetTL = new TimelineMax({
				paused:true, 
				onComplete: this.sheetComplete, 
				onReverseComplete: this.sheetComplete,
				onStart: this.onStart,
			});
			this.sheetTL.add("middle", config.wlAnimSpeed/2);

			this.timelines = [
				this.centreTL, 
				this.booksTL, 
				this.clothingTL, 
				this.craftsTL, 
				this.performanceTL, 
				this.sheetTL
			]
		}

		onComplete(){
			wind.tweenTo(3);
		}

		sheetComplete(){
			wind.tweenTo(3);
			let sheetDivs = $("#sheet").children("div");
			sheetDivs.hide();
		}

		onStart(){
			if(this.reversed()){
				wind.tweenTo(0);
			}
			else{
				wind.tweenTo(6);
			}
		}

		// add movement tween for a sprite on it's correct timeline
		addTween( sprite ){
	  		let tween = TweenMax.fromTo("#"+ sprite.name, config.wlAnimSpeed, 
				{
					left: sprite.xPos + WW, 
					top:washingLine.yPoint(sprite.xPos + WW) - sprite.offset }, 
				{
					left: sprite.xPos - WW, 
					top: washingLine.yPoint(sprite.xPos - WW) - sprite.offset, 
					ease:  Linear.easeNone, 
				});

	  		//set the the timeline for this
	  		switch( sprite.group ) {
	  			case "Sheet":
	  		       	this.sheetTL.add(tween, 0);
	  		        break;
	  		    case "Books":
	  		       	this.booksTL.add(tween, 0);
	  		        break;
	  		    case "Crafts":
	  		        this.craftsTL.add(tween, 0);
	  		        break;
	  		    case "Clothing":
	  		        this.clothingTL.add(tween, 0);
	  		       	break;
	  		    case "Performance":
	  		        this.performanceTL.add(tween, 0);
	  		        break;
	  		    default:
	  		        this.centreTL.add(tween, 0);
	  		}
	  	}

	  	bringSheetOnscreen(){
			for(let timeline of this.timelines){
				let progress = timeline.progress();
				if( progress != 1 && progress != 0){
					timeline.play();
				}
			}
			this.sheetTL.tweenTo("middle");
		}

		home(){
			for(let timeline of this.timelines){
				let progress = timeline.progress();
				if( progress != 1 && progress != 0){
					timeline.play();
				}
			}
			this.centreTL.progress(0).tweenTo("middle");	
		}
	}

	let lineTimelines = new WashingLineTimelines();

	// * ***********************************************************************
	// *
	// *   	WINDTIMELINE CLASS
	// * 	Assumes a line sprite with either 1 or 7 frames
	// *
	// *************************************************************************
	class WindTimeline{
		constructor(){
			this.timeline = new TimelineMax({ paused:true });

			//assume all sprites have either one or seven frames, for now
			let frames = 7;

			//add one label for each frame position to the gusts timeline
			let frameTime = 0;
			for(let i = 0; i < frames; i++){
				this.timeline.add("frame"+i, frameTime);
				frameTime += config.windSpeed/(frames-1);
			}

			this.gusts();

			//any calculations that need to be done after the images have loaded go here
			window.addEventListener("load", ()=> { 
				
			});
		}

		//gusts to left or right at random intervals
		gusts(){
			//if the gusts are already running reset them
			if(this.gustsTimer){
				clearTimeout( this.gustsTimer )
			}
			//otherwise choose a direction at random
			let frame = ( randomInt( 0, 1 ) ) ? 1 : 5; 
			this.gustsTimer = setTimeout(() => {
				this.tweenTo( frame );
				setTimeout( () => { this.tweenTo( 3 ); }, 1000 );
				this.gusts();
			}, randomFloat( 1500, 5000 ) );
		}

		addTween( sprite ){
	  		if(sprite.frames === 1 ){ return; } //if it's a single frame sprite just return for now

	  		//this tween contains all the frames
			let tween = TweenMax.fromTo("#" + sprite.name, config.windSpeed, 
				{
					backgroundPosition: "0 0%"
				}, 
				{ 
					backgroundPosition: "0 100%", 
					ease: SteppedEase.config((sprite.frames -1)), 
				}
			);

			this.timeline.add( tween, 0);
	  	}
    
    	tweenTo( frameNum ){
      		this.timeline.tweenTo("frame" + frameNum);
    	}
	}

	let wind = new WindTimeline();

	// * ***********************************************************************
	// *
	// *   RESPONSIVE SPRITE CLASS (jQuery required)
	// *
	// *************************************************************************

	//  spec = {
	//    //sprite details
	//    parentDiv: 'your-wrapper-div-id', //omitting this will append the sprite to body
	//    name: 'spritesName',
	//    imageURL: spritesImg,
	//    frames: xx, //how many frames if the sprite is animated, omit for not animated
	//    maxH: 15,  //maxW and maxH are screen dimension percentage values
	//    maxW: 25,
	//    minH: 14,  //minW and minH are percent values, omit to allow minimums of 0
	//    minW: 22,
	//    link: 'www.example.com' //omit to make the sprite a div instead of a link
	//    type: "absolute", OR "relative" //omit for absolute
	//    xType: "right" OR "left",
	//    xPos: xPercentToPx(31),
	//    yType: "bottom" OR "top",
	//    yPos: yPercentToPx(60)
	//	};


	class ResponsiveSprite{
		constructor(spec){
			//if frames not supplied set it to one
			if(!spec.frames){ spec.frames = 1}

			//if no parentDiv supplied add sprite to body
			if(spec.parentDiv == null){ spec.parentDiv = 'body'; }

			//create the parentDiv if it does not exist
			if (!$("#" + spec.parentDiv).length) {
				$body.append("<div id='" + spec.parentDiv + "'></div>");
			}

			spec.parentDiv = $("#" + spec.parentDiv);

			//check if the sprite div has already been created in html and if not add it
			if (!$("#" + spec.name).length) {
				if(spec.islink){
					spec.parentDiv.append("<a id='" + spec.name + "'></a>");
				}
				else{
					spec.parentDiv.append("<div id='" + spec.name + "'></div>");
				}
			}

			this.spriteElem = $("#" + spec.name);
			this.name = spec.name;

			this.setDims(spec);

			this.setBackground();
		}

		setDims(spec){
			if (!spec.minH) { //if minH/minW are not provided set them to 0
				spec.minH = 0;
			}
			if (!spec.minW) {
				spec.minW = 0;
			}

			spec.maxH = yPercentToPx(spec.maxH);
			spec.maxW = xPercentToPx(spec.maxW);
			spec.minH = yPercentToPx(spec.minH);
			spec.minW = xPercentToPx(spec.minW);

			this.height = spec.maxH; //initially set maxH as a percentage of screen height
			this.width = spec.maxW; //and the maxW as a percentage of screen width

			this.imgH = 0;
			this.imgW = 0;

			this.spriteImage = this.selectImage(spec.imageURL, (w, h) => {
				this.imgH = h;
				this.imgW = w;
				//After the image has loaded, initialize the width based on maxH
				this.width = this.imgW / ((this.imgH / spec.frames) / this.height);

				this.calcSize(spec); //now calculate the sprite's size and apply it to the spriteElem
			}); 
		}

		calcSize(spec){
			//increase width if too narrow
			if (this.width < spec.maxW || this.width < spec.minW) {
				while (this.width < spec.maxW && this.height < spec.maxH){
					this.height = this.height + 5;
					this.width = this.imgW / ((this.imgH / spec.frames) / this.height);
				}
			}

			//decrease width if too wide
			if (this.width > spec.maxW && this.width > spec.minW) {
				while (this.width > spec.maxW && this.height <= spec.maxH) {
					this.height = this.height - 5;
					this.width = this.imgW / ((this.imgH / spec.frames) / this.height);
				}
			}

			//decrease height if too tall
			if (this.height > spec.maxH && this.height > spec.minH) {
				this.height = spec.maxH;
				this.width = this.imgW / ((this.imgH / spec.frames) / this.height);
			}

			//Set the new width and height
			this.spriteElem.css({
				height: this.height + "px",
				width: this.width + "px"
			});
		}

		setBackground(){
			this.spriteElem.css({
				background: "url('" + this.spriteImage.src + "') no-repeat 0 0%",
				"background-size": "100%"
			});
		}

		selectImage(imageURL, callback) {
			let img = new Image();
			img.onload = () => {
				if (callback) {
					callback(img.width, img.height);
				}
			};
			img.src = imageURL;
			return img;
		}

		setPosition(spec){
			if(!spec.type){ spec.type = "absolute"; }
			animateOpacity("#" + this.name, 0, 0); //hide the sprite until the image has loaded

			this.spriteElem.css({
				position: spec.type
			});
			if (spec.xType === "right") {
				this.spriteElem.css({
					right: xPercentToPx(spec.xPos) + "px"
				});
			} else if (spec.xType === "left") {
				this.spriteElem.css({
					left: xPercentToPx(spec.xPos) + "px"
				});
			}

			if (spec.yType === "top") {
				this.spriteElem.css({
					top: yPercentToPx(spec.yPos) + "px"
				});
			} else if (spec.yType === "bottom") {
				this.spriteElem.css({
					bottom: yPercentToPx(spec.yPos) + "px"
				});
			}
		}
	}

	// * ***********************************************************************
	// *
	// *  LINE SPRITE CLASS extends RESPONSIVE SPRITE CLASS
	// *
	// *	spec = {
	// *		frames: 7,
	// *		name: "poiSprite",
	// *		link: '#',
	// *		imageURL: poiSpriteImg,
	// *		maxH: 55, //in screen %
	// *		maxW: 40, 
	// *		minH: 100, 
	// *		minW: 80, 
	// *		offset:    //minor y adjustment for line placement as a percentage of object height
	// *		screen: "left", "right" or "centre"
	// *		xPos: 30, //percentage from screen left
	// *		group: "Centre", //the animation group this is part of
	// *		nextGroup: "Books", //the group that should animate on screen after this 
	// *	};
	// *************************************************************************

	class LineSprite extends ResponsiveSprite {
		constructor(spec) { 
			spec.parentDiv = 'lineSprites';
	    	super(spec); 

	    	//set variables
	    	this.frames = spec.frames;
	    	this.trigger = spec.trigger || spec.name; //allow setting of a different element as trigger
	    	this.group = spec.group;
	    	this.nextGroup = spec.nextGroup || "Sheet";
	    	this.progressMin = spec.progressMin || 0.26;
	    	this.progressMax = spec.progressMax || 0.72;

	    	switch( this.group ) {
	    	    case "Books":
	    	       	this.timeline = lineTimelines.booksTL;
	    	        break;
	    	    case "Crafts":
	    	        this.timeline = lineTimelines.craftsTL;
	    	        break;
	    	    case "Clothing":
	    	        this.timeline = lineTimelines.clothingTL;
	    	       	break;
	    	    case "Performance":
	    	        this.timeline = lineTimelines.performanceTL;
	    	        break;
	    	    case "Sheet":
	    	        this.timeline = lineTimelines.sheetTL;
	    	        break;
	    	    default:
	    	        this.timeline = lineTimelines.centreTL;
	    	}

	    	//set the the timeline for the next group of sprites
	    	switch( this.nextGroup ) {
	    		case "Sheet":
	    	       	this.nextTimeline = lineTimelines.sheetTL;
	    	        break;
	    	    case "Books":
	    	       	this.nextTimeline = lineTimelines.booksTL;
	    	        break;
	    	    case "Crafts":
	    	        this.nextTimeline = lineTimelines.craftsTL;
	    	        break;
	    	    case "Clothing":
	    	        this.nextTimeline = lineTimelines.clothingTL;
	    	       	break;
	    	    case "Performance":
	    	        this.nextTimeline = lineTimelines.performanceTL;
	    	        break;
	    	    case "Home":
	    	        this.nextTimeline = lineTimelines.centreTL;
	    	       	break;
	    	}

	    	//hide the sprite until it has been positioned
	    	animateOpacity("#" + this.name, 0, 0);

			wind.addTween( this );

			this.makeDraggable();
	    	
	    	//any calculations that need to be done after the image has loaded go here
			window.addEventListener("load", ()=> { 
				this.width = this.spriteElem.width();
				this.setPosition(spec);
				lineTimelines.addTween( this );
				this.xPos = this.xPos + this.width/2;
			});
	  	}

	  	setPosition(spec){
	  		let xPos = xPercentToPx(spec.xPos);

	  		//if it's animated via frames set it to the middle frame
			if(spec.frames != 1){
				this.spriteElem.css({
					backgroundPosition: '50%'
				});
			}

			//if it needs to be rotated
			if(spec.rotate){
				this.spriteElem.css({
					transform: 'rotate(' + washingLine.slopeDegrees + 'deg)'
				});
			}

	  		let heightPercent = this.spriteElem.height()/100;
			this.offset = heightPercent*spec.offset;

			//calculate the point on the line
			let point = {
	  			x: xPos,
	  			y: washingLine.yPoint(xPos) - this.offset,
		  	}

		  	this.spriteElem.css({
				position: "absolute",
				top: point.y,
				left: point.x,
			});
				
			//now that the sprite has been positioned show it
			let fadeSpeed = randomInt(0.2,0.4);
			animateOpacity("#" + this.name, fadeSpeed , 1);

			this.xPos = point.x;
			this.yPos = point.y;
	  	}

	  	//Display information on the sheet
	  	sheetContents(){
	    	switch( this.name ) {
	    		case "book1":
	    			book1Gallery.show();
	    	        break;
	    	    case "book2":
	    			book2Gallery.show();
	    	        break;
	    	    case "book3":
	    			book3Gallery.show();
	    	        break;
	    	    case "book4":
	    			book4Gallery.show();
	    	        break;
	    	    case "gourd1":
	    			craftsGallery.show();
	    	        break;
	    	    case "poi":
	    			performanceGallery.show();
	    	        break;
	    	    case "silks1":
	    			silksVideo.show();
	    	        break;
	    	    case "dress":
	    			clothingGallery.show();
	    	        break;
	    	    case "scarf":
	    			clothingGallery.show();
	    	        break;
	    	}
	  	}
	  	
	  	//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"
	  	onDrag( sprite ){
			return function(){
				let change = sprite.xPos - this.pointerX;
  
				sprite.direction = this.pointerX 
								- (parseFloat(sprite.spriteElem.css("left")) 
								+ sprite.width/2);

				//add wind effect as we drag the sprite
				//need to make the wind time line universal for all sprites
				if( sprite.direction < 0  ){
					//moving left
					wind.tweenTo(6);
				}
        
				else if( sprite.direction > 0 ){
					//moving right
					wind.tweenTo(0);
				}

				//Set a timeout to reset the sprites if we have not moved in a while
				clearTimeout(sprite.timer);
				sprite.timer = setTimeout( () =>{
					wind.tweenTo(3);
				} , 100);

				//set the progress of the washing line as we drag the sprite
				let progress = (change > 0 ) 
								? 0.5 + ( change/this.pointerX/2 ) * this.pointerX/WW
								: 0.5 + ( change/(WW-this.pointerX)/2 ) * ( 1 - this.pointerX/WW );
				sprite.timeline.progress( progress ); 	

				//show the next page divs if dragged far enough
				let p =sprite.timeline.progress();
				if(p > sprite.progressMax ||  p< sprite.progressMin || isNaN(p)){
					padInfo.html(sprite.nextGroup);
					animateOpacity("#padInfo", 0.2, 1);
				}
				else{
					animateOpacity("#padInfo", 0.2, 0);
				}
			}
		}
    
    	//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"
		onDragStart( sprite ){
			return function(){
				//stop the gusts
				clearTimeout(wind.gustsTimer);
				//set the start position to the previous end position
				sprite.startX = sprite.endX;
			}
		}
    
		//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"
		onDragEnd( sprite ){
			return function(){  
				console.log(sprite.direction);
				//clear the animation timer
				clearTimeout(sprite.timer);

				let p =sprite.timeline.progress();

				if(p > sprite.progressMax || isNaN(p)){
					//show the sheet contents for this sprite if relevant
					if(sprite.nextGroup === "Sheet"){sprite.sheetContents();}
					//moving left
					sprite.timeline.play();
					//set the next group to the start of its timeline then play to the middle
					sprite.nextTimeline.progress(0).tweenTo("middle");
					animateOpacity("#infoLeft", 0.2, 0);
					sprite.animateSecondary();
				}
				else if( p < sprite.progressMin ){
					//show the sheet contents for this sprite if relevant
					if(sprite.nextGroup === "Sheet"){sprite.sheetContents();}
					//moving right
					sprite.timeline.reverse();
					//set the next group to the end of its timeline then reverse to the middle
					sprite.nextTimeline.progress(1).tweenTo("middle");
					animateOpacity("#infoRight", 0.2, 0);
					sprite.animateSecondary();
				}
				else{
					wind.tweenTo(3);
					//restart the gusts
					wind.gusts();
					sprite.endX = parseFloat(sprite.spriteElem.css("left")) + sprite.width/2;
				}
			}
		}

		animateSecondary(){
			if(this.nextGroup === "Performance" || this.group === "Performance"){
				staff.animate();
			}
			else if(this.nextGroup === "Crafts" || this.group === "Crafts"){
				goose.animate();
			}
		}

		makeDraggable(){
			this.direction = 0;
			this.endX = this.xPos;
			this.startX = this.xPos;
			Draggable.create(document.createElement('div'), {
				type: "x",
				onDragStart: this.onDragStart(this ), 
				onDrag: this.onDrag( this ),
				onDragEnd: this.onDragEnd( this ),
				trigger: "#"+ this.trigger,
			});
		}
	}

	// * ***********************************************************************
	// *
	// *   	SHADOW SPRITE CLASS extends RESPONSIVE SPRITE CLASS
	// *
	// *   	let shadowSpriteSpec ={
	// *		...as for ResponsiveSprite spec
	// * 		shadowImg: imageURL 
	// *		shadowYOffset: 5 //fine tuning for base of shadow
	// *	}
	// *
	// *************************************************************************

	class shadowSprite extends ResponsiveSprite{
		constructor(spec){
			spec.xType = "left";

			super(spec);

			this.setPosition(spec);

			this.shadowYOffset = spec.shadowYOffset || 5;
			this.shadowXOffset = spec.shadowXOffset || 0;
			this.shadowWidth = spec.shadowWidth || 100;

			this.shadow(spec.shadowImg);

			this.rotated = false;

			//fade in the sprite after everything has loaded
			window.addEventListener("load", ()=> { 
				let fadeSpeed = randomFloat(0.2,0.4);
				animateOpacity("#" + this.name, fadeSpeed, 1);
			});
		}

		shadow(shadowImg){
			let shadowMoveAmount = 65;
			let spriteMid = parseFloat(this.spriteElem.css("left"))/WW*100;
			this.spriteElem.append("<div id='" + this.name + "-shadow' class='shadow'></div>");

			this.shadow = $("#" + this.name + "-shadow");
			this.shadow.addClass("shadow");
			animateOpacity("#" + this.name +"-shadow", 0, 0);

			$document.on("mousemove", (e) => {
				let pageXPercent = (e.pageX * 100)/WW;
				let skew = 0;
				if (pageXPercent < spriteMid) {
					skew = (shadowMoveAmount / spriteMid) * (spriteMid - pageXPercent);
				}
				else{
					skew = -(shadowMoveAmount / (spriteMid - 100)) * (spriteMid - pageXPercent);
				}
				if(this.rotated === true){
					skew = - skew;
				}
				this.shadow.css({
					transform: "skew(" + skew + "deg)"
				});
			});

			this.shadowYOffset = -100 + this.shadowYOffset;

			window.addEventListener("load", () => { 
				let width = parseFloat(this.spriteElem.css("width"));
				//slightly more accurate calculation of spriteMid now that we know the width
				spriteMid = (parseFloat(this.spriteElem.css("left")) + width/2)/WW*100;

				this.shadow.css({
					background: "url('" + shadowImg + "') 0 0% / contain no-repeat",
					height: this.height + "px",
					width: this.shadowWidth + "%",
					bottom: this.shadowYOffset + "%",
					left: this.shadowXOffset + "%", 
					transform: "skew(25deg)",
				});

				let fadeSpeed = randomFloat(0.2,0,4);
				animateOpacity("#" + this.name +"-shadow", fadeSpeed, 0.7); 
			});
		}
	}

	// * ***********************************************************************
	// *
	// *   	MOVING SHADOW SPRITE CLASS extends SHADOW SPRITE CLASS
	// *
	// *	When the sprite moves it breaks the z-index so the shadow appears on 
	// * 	top - create a wrapper element, move this and put the sprite image
	// * 	in a sub element
	// *
	// * ***********************************************************************

	class movingShadowSprite extends shadowSprite{
		constructor(spec){
			spec.parentDiv = 'plankSprites';
			spec.xType = "left";
			spec.yType= "top";

			spec.originalName = spec.name;
			spec.name = spec.name + "Wrapper";

			super(spec);

			this.spriteElem.css({background: ""});

			this.spriteElem.append("<div id='" + spec.originalName + "'></div>");

			$( "#" + spec.originalName ).css({
				position: 'relative',
			    top: '-100%',
			    left: 0,
			    width: 'inherit',
			    height: 'inherit',
				background: "url('" + this.spriteImage.src + "') no-repeat 0 0%",
				"background-size": "100%",
			});

		}
	}

	// * ***********************************************************************
	// *
	// *   	GOOSE CLASS extends MOVING SHADOW SPRITE CLASS 
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************
	class Goose extends movingShadowSprite{
		constructor(spec){
			super(spec);

			this.left = xPercentToPx(spec.xPos);
			this.top = yPercentToPx(spec.yPos);

			this.buildTimeline();

			this.rotated = false;
		}

		buildTimeline(){
			this.timeline = new TimelineMax({ paused: true });
			let animSpeed = 5;
			let rotateSpeed = animSpeed/6;

			let move = TweenMax.to(this.spriteElem, animSpeed, {
				bezier:{
					type:"cubic",
					timeResolution : 6,
					values:
					[	//Curve 1
						{left:this.left, top:this.top}, //Anchor Point 1
						{left:this.left - xPercentToPx(6), top:this.top - yPercentToPx(7)}, //Control Point 1
						{left:this.left - xPercentToPx(12), top:this.top - yPercentToPx(7) }, //CP 2
						{left:this.left - xPercentToPx(18), top:this.top}, //AP 2
						//Curve 2
						{left:this.left - xPercentToPx(24), top:this.top - yPercentToPx(7)}, //Control Point 1
						{left:this.left - xPercentToPx(30), top:this.top - yPercentToPx(7) }, //CP 2
						{left:this.left - xPercentToPx(36), top:this.top}, //AP 2
						//Curve 3
						{left:this.left - xPercentToPx(42), top:this.top - yPercentToPx(7)}, //Control Point 1
						{left:this.left - xPercentToPx(48), top:this.top - yPercentToPx(7) }, //CP 2
						{left:this.left - xPercentToPx(54), top:this.top}, //AP 2
					], 
				}, 
				ease:Linear.easeNone, 
			});

			//let rotate = TweenMax.to(
			//	this.spriteElem, .6, { rotation: 8, ease: Sine.easeInOut, repeat: 8, yoyo: true });

			this.timeline.add(move, 0)
						 //.add(rotate, 0)
		}

		animate(){
			if( this.timeline.reversed() ){
				this.rotated = false;
				TweenMax.to(this.spriteElem, 0.6, {	rotationY: 0, ease:Quad.easeInOut,});
				setTimeout( () => {
					this.timeline.play();
				}, 300)
			}
			else if(this.timeline.progress() === 0){
				this.rotated = false;
				this.timeline.play();
			}
			else{
				this.rotated = true;		
				TweenMax.to(this.spriteElem, 0.6, {	rotationY: 180, ease:Quad.easeInOut,});
				setTimeout( () => {
					this.timeline.reverse();
				}, 300)
			}				
		}
	}

		// * *******************************************************************
	// *
	// *   	STAFF CLASS extends MOVING SHADOW SPRITE CLASS 
	// *
	// *	Define animation functions for staff
	// *
	// *************************************************************************

	class Staff extends movingShadowSprite{
		constructor(spec){
			super(spec);

			this.buildTimeline();
		}

		buildTimeline(){
			this.timeline = new TimelineMax({ paused: true });
			let animSpeed = 2;

			let move = TweenMax.to(this.spriteElem, animSpeed, {
				bezier:{
					type:"cubic",
					timeResolution : 6,
					values:
					[	
						{left: xPercentToPx(60), top: yPercentToPx(115),},
					    {left: xPercentToPx(55), top: yPercentToPx(105),},
					    {left: xPercentToPx(55), top: yPercentToPx(95),},
					    {left: xPercentToPx(60),top: yPercentToPx(85),},
					], 
				}, 
				ease:Linear.easeNone, 
			});

			let rotate = TweenMax.fromTo(this.spriteElem, animSpeed, 
				{rotation: -4},
				{rotation: 4, ease: Sine.easeInOut,}
			);

			this.timeline.add(move, 0).add(rotate, 0);
		}

		animate(){
			if(this.timeline.progress() === 0){
				this.timeline.play();
			}
			else if( this.timeline.reversed() ){
				this.timeline.play();
			}
			else{
				this.timeline.reverse();
			}				
		}
	}
	
	// * ***********************************************************************
	// *
	// *   	CLOUDS CLASS extends RESPONSIVE SPRITE CLASS
	// *
	// *   	let cloudSpec ={
	// *		...as for ResponsiveSprite spec
	// * 		animSpeed: 1 //in seconds
	// *	}
	// *
	// *************************************************************************
	class Cloud extends ResponsiveSprite{
		constructor(spec){
			spec.xType = "left";
			spec.yType = "bottom";
			spec.parentDiv = 'clouds';

			$('#clouds').css({width: '100%'})
			super(spec);

			//fade in the sprite after everything has loaded
			window.addEventListener("load", ()=> { 
				let fadeSpeed = randomFloat(0.2,0.4);
				animateOpacity("#" + this.name, fadeSpeed, 0.7);
			});

			this.setPosition(spec);

			this.yPos = parseFloat(this.spriteElem.css("bottom"));
			this.animate(spec.animSpeed, spec.name, spec.startPos);
		}

		animate(speed, name, startPos){
			this.timeline = new TimelineMax();
			let crossScreen = TweenMax.fromTo('#'+name, speed, {left: WW * 6/5, y:0 }, 
				{ left: -WW * 1 / 5, repeat: -1, ease: Linear.easeNone, force3D: true });

			this.timeline.add(crossScreen)
				   .seek(( speed/100 ) * startPos ); //start each cloud at a random offset

			//move the cloud a random amount on mouse over
			this.spriteElem.off("mousedirection").on("mousedirection", _.debounce( (e) => {
				let wind = (x, y) => {
					//set the minimum height of clouds as a % of screen height
					let height = parseFloat(this.spriteElem.css("bottom"));
					if( height > (WH/100)*55 ){ y = Math.abs(y); }
					this.timeline.pause();
					TweenMax.to('#'+name, 2, {
							x: x, 
							y: y, 
						 	ease: Sine.easeOut, 
						 	force3D:true,
						 	onComplete: () => { this.timeline.play();  },
					});
				}

				if(e.direction === "right"){ 
					wind(randomFloat(30,50), randomFloat(-20,20));
				}
				else{ 
					wind(randomFloat(-30,-50), randomFloat(-20,20));	
				}
			}, 2000, true)); //debounce timing

		}
	}

	// * ***********************************************************************
	// *
	// *   	BOAT CLASS extends RESPONSIVE SPRITE CLASS
	// *
	// *************************************************************************

	class Boat extends ResponsiveSprite{
		constructor(spec){
			super(spec);
			this.setPosition(spec);
			this.clipPath();
			this.animate();

			//fade in the sprite after everything has loaded
			window.addEventListener("load", ()=> { 
				let fadeSpeed = randomFloat(0.2,0.4);
				animateOpacity("#" + this.name, fadeSpeed, 1);
			});
		}

		clipPath(){
			let clipPathElem = $("#boatClipPath");
			this.bottom = parseFloat(this.spriteElem.css("bottom"));
			this.right = parseFloat(this.spriteElem.css("right"));
			this.left = xPercentToPx(100) - this.right - this.width;
			let pathBase = yPercentToPx(100.5) - this.bottom;
			let waveHeight = pathBase - this.height / 6;
			let pathTop = pathBase - this.height * 3;
			let pathLeft = this.left - xPercentToPx(4);
			let pathRight = xPercentToPx(104) - this.right;
			let waveWidth = (pathRight - pathLeft) / 10;

			//create 3 waves
			let path = "M" + pathLeft + "," + waveHeight //initial point
				+ "C" + (pathLeft + waveWidth * 1) + ", " + waveHeight + " " //first control point
				+ (pathLeft + waveWidth * 2) + ", " + pathBase + " " //second control point
				+ (pathLeft + waveWidth * 3) + ", " + waveHeight + " " //end point and start of next curve
				//second curve
				+ "C" + (pathLeft + waveWidth * 4) + ", " + waveHeight + " " //first control point
				+ (pathLeft + waveWidth * 5) + ", " + pathBase + " " //second control point
				+ (pathLeft + waveWidth * 6) + ", " + waveHeight + " " //end point
				//third curve
				+ "C" + (pathLeft + waveWidth * 7) + ", " + waveHeight + " " //first control point
				+ (pathLeft + waveWidth * 8) + ", " + pathBase + " " //second control point
				+ pathRight + ", " + waveHeight + " " //end point
				//Close the shape
				+ "V" + pathTop + "H" + pathLeft + "V" + waveHeight;
			
			clipPathElem.attr({	d: path	}); //set the path attribute
		}

		animate(){
			this.timeline = new TimelineMax();
			
			let float = TweenMax.to("#boat", 2, { 
				y: 1,
				x: 1, 
				repeat: -1,
				ease: Sine.easeInOut,
				yoyo:true,
				force3D: false, //true or auto breaks clip path
			});

			let rotate = TweenMax.to("#boat", 3, { 
				rotation: 4, 
				repeat: -1,
				ease: Sine.easeInOut,
				yoyo:true,
				force3D: false, //true or auto breaks clip path
			});
			
			this.timeline.insert(float).insert(rotate);

		}
	}

	// * ***********************************************************************
	// * ***********************************************************************
	// *
	// *   CREATE OBJECTS
	// *
	// *************************************************************************
	// * ***********************************************************************

	// * ***********************************************************************
	// *
	// *   CREATE WASHING LINE SPRITES
	// *
	// *************************************************************************

	// *********************************************************************
	// *SPECS FOR OBJECTS WITH SIMILAR CHARACTERISTICS 
	// *********************************************************************
	let bookSpec = {
		imageURL: imagesUrl + "book.png",
		frames: 1,
		maxH: 9, 
		maxW: 9, 
		minH: 6, 
		minW: 6, 
		offset: 6,
		rotate: true,
	};

	let tshirtSpec = {
		frames: 7,
		imageURL: imagesUrl + "tshirt.png",
		maxH: 21, 
		maxW: 16, 
		minH: 17, 
		minW: 14, 
		offset: 7,
		rotate: true,
	};

	let gourdSpec = {
		imageURL: imagesUrl + "gourd.png",
		frames: 1,
		maxH: 20, 
		maxW: 20, 
		minH: 18, 
		minW: 18, 
		offset: 4,
		progressMin: 0.40,
		progressMax: 0.81,
	};

	let silkSpec = {
		imageURL: imagesUrl + "silk.png",
		frames: 7,
		link: '#',
		maxH: 55, 
		maxW: 40, 
		minH: 55, 
		minW: 49, 
		offset: 0,
		progressMin: 0.48,
		progressMax: 0.89,
	};

	let clothingSpec = {
		rotate: true,
		frames: 1,
		maxH: 55, 
		maxW: 30, 
		minH: 50, 
		minW: 25, 
	};

	// *********************************************************************
	// *SPRITES ON CENTRE SCREEN AT START
	// *********************************************************************
	let book = new LineSprite( _.extend({
		name: "book",
		xPos: 45,
		group: "Centre", 
		nextGroup: "Books",
		progressMin: 0.30,
		progressMax: 0.70,
	}, bookSpec));

	let tshirt = new LineSprite(_.extend({
		name: "tshirt",
		xPos: 55,
		group: "Centre", 
		nextGroup: "Clothing",
		progressMin: 0.36,
		progressMax: 0.75,
	}, tshirtSpec));

	let gourd = new LineSprite(_.extend({
		name: "gourd",
		xPos: 70,
		group: "Centre", 
		nextGroup: "Crafts",
	}, gourdSpec));

	let silk = new LineSprite(_.extend({
		name: "silk",
		xPos: 66,
		group: "Centre", 
		nextGroup: "Performance",
		trigger: "silkTrigger",
	}, silkSpec));


	// *********************************************************************
	// * SHEET SPRITE USED TO DISPLY INFORMATION
	// *********************************************************************
	
	let sheet = new LineSprite({
		name: "sheet",
		imageURL: imagesUrl + "sheet.png",
		group: "Sheet",
		nextGroup: "Home",
		offset: 1,
		xPos: 20,
		progressMin: 0.37,
		progressMax: 0.6,
		rotate: true,
		frames: 1,
		maxH: 70, 
		maxW: 90, 
		minH: 50, 
		minW: 25,
	});

	$("#sheetContents").css({ 
		transform: 'rotate(-' + washingLine.slopeDegrees + 'deg)',
	});

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM LEFT) AFTER CLICKING BOOK
	// *********************************************************************
	let book1 = new LineSprite(_.extend({
		name: "book1",
		group: "Books",
		xPos: 32,
		progressMin: 0.22,
		progressMax: 0.64,
	}, bookSpec));

	let book2 = new LineSprite(_.extend({
		name: "book2",
		group: "Books",
		xPos: 47,
		progressMin: 0.30,
		progressMax: 0.70,
	}, bookSpec));

	let book3 = new LineSprite(_.extend({
		name: "book3",
		group: "Books",
		xPos: 62,
		progressMin: 0.36,
		progressMax: 0.79,
	}, bookSpec));

	let book4 = new LineSprite(_.extend({
		name: "book4",
		group: "Books",
		xPos: 75,
		progressMin: 0.45,
		progressMax: 0.86,
	}, bookSpec));

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM RIGHT) AFTER CLICKING TSHIRT
	// *********************************************************************

	let dress = new LineSprite(_.extend({
		name: "dress",
		imageURL: imagesUrl + "dress.png",
		group: "Clothing",
		offset: 3,
		xPos: 35,
		progressMin: 0.28,
		progressMax: 0.70,
	}, clothingSpec));

	let scarf = new LineSprite(_.extend({
		name: "scarf",
		imageURL: imagesUrl + "scarf.png",
		group: "Clothing",
		offset: 3,
		xPos: 55,
		progressMin: 0.34,
		progressMax: 0.78,
	}, clothingSpec));

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING GOURD
	// *********************************************************************

	let gourd1 = new LineSprite(_.extend({
		name: "gourd1",
		group: "Crafts",
		xPos: 70,
	}, gourdSpec));

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING SILK
	// *********************************************************************

	let silk1 = new LineSprite(_.extend({
		name: "silk1",
		xPos: 66,
		group: "Performance",
		trigger: "silk1Trigger",
	}, silkSpec));

	let poi = new LineSprite({
		frames: 7,
		name: "poi",
		imageURL: imagesUrl + "poi.png",
		maxH: 25, 
		maxW: 20, 
		minH: 22, 
		minW: 18, 
		offset: 3,
		xPos: 45,
		group: "Performance",
		progressMin: 0.36,
		progressMax: 0.75,
	});

	// * ***********************************************************************
	// *
	// *	PLANK OBJECTS
	// *
	// *
	// * ***********************************************************************
	
	//when the mouse hovers over display info
	let linksHover = function(text){
		padInfo.html(text);
		animateOpacity("#padInfo", 0.2, 1);
	}
	//when the hover ends hide info
	let linksHoverEnd = () => {
		animateOpacity("#padInfo", 0.2, 0);
	}

	let bucket = new shadowSprite({
		parentDiv: 'plankSprites',
		name: "bucket",
		imageURL: imagesUrl + "bucket.png",
		maxH: 18, 
		maxW: 18, 
		minH: 16, 
		minW: 16, 
		xPos: 7,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "bucket-shadow.png",
		shadowYOffset: 10, 
		shadowXOffset: 0, 
		shadowWidth: 100, 
	});
	bucket.spriteElem.hover(
		() => { linksHover("Home"); },
		() => { linksHoverEnd(); }
	);
	bucket.spriteElem.click( () => { 
		lineTimelines.home();
	});

	let brushholder = new shadowSprite({
		parentDiv: 'plankSprites',
		name: "brushholder",
		imageURL: imagesUrl + "brushholder.png",
		maxH: 18, 
		maxW: 18, 
		minH: 16, 
		minW: 16, 
		xPos: 15,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "brushholder-shadow.png",
		shadowYOffset: 5, 
		shadowXOffset: 10, 
		shadowWidth: 100, 
	});
	brushholder.spriteElem.hover(
		() => { linksHover("Biography"); },
		() => { linksHoverEnd(); }
	);
	brushholder.spriteElem.click( () => { 
		let p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if( p < sheet.progressMax &&  p > sheet.progressMin ){
			let sheetDivs = $("#sheet").children("div");
			sheetDivs.fadeOut();
			biography.fadeIn();
		}
		//sheet is offscreen
		else{
			lineTimelines.bringSheetOnscreen();
			biography.show();
		}
	});

	let inkwell = new shadowSprite({
		parentDiv: 'plankSprites',
		name: "inkwell",
		imageURL: imagesUrl + "inkwell.png",
		maxH: 18, 
		maxW: 18, 
		minH: 16, 
		minW: 16, 
		xPos: 21,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "inkwell-shadow.png",
		shadowYOffset: 5, 
		shadowXOffset: 10, 
		shadowWidth: 65, 
	});
	inkwell.spriteElem.hover(
		() => { linksHover("Contact"); },
		() => { linksHoverEnd(); }
	);
	inkwell.spriteElem.click( () => { 
		let p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if( p < sheet.progressMax &&  p > sheet.progressMin ){
			let sheetDivs = $("#sheet").children("div");
			sheetDivs.fadeOut();
			contact.fadeIn();
		}
		//sheet is offscreen
		else{
			lineTimelines.bringSheetOnscreen();
			contact.show();
		}
	});

	let pad = new shadowSprite({
		parentDiv: 'plankSprites',
		name: "pad",
		imageURL: imagesUrl + "pad.png",
		maxH: 18, 
		maxW: 18, 
		minH: 16, 
		minW: 16, 
		xPos: 27,
		yPos: 5,
		yType: "bottom",
		//shadowImg: imagesUrl + "inkwell-shadow.png",
		shadowYOffset: 5, 
		shadowXOffset: 10, 
		shadowWidth: 65, 
	});

	let goose = new Goose({
		name: "goose",
		imageURL: imagesUrl + "goose.png",
		maxH: 25,
		maxW: 20,
		minH: 22,
		minW: 18,
		xPos: 110, 
		yPos: 80,
		shadowImg: imagesUrl + "goose-shadow.png",
		shadowYOffset: 10, 
		shadowXOffset: 0, 
		shadowWidth: 100, 
	});

	let staff = new Staff({
		name: "staff",
		imageURL: imagesUrl + "staff.png",
		maxH: 25,
		maxW: 40,
		minH: 22,
		minW: 18,
		xPos: 60,
		yPos: 120,
		shadowImg: imagesUrl + "staff-shadow.png",
		shadowYOffset: 70, 
		shadowXOffset: 3, 
		shadowWidth: 100, 
	});

	// * ***********************************************************************
	// *
	// *  CLOUDS AND BOAT
	// *
	// *************************************************************************

	let cloud1 = new Cloud({
		name: 'cloud1',
		imageURL: imagesUrl + "cloud1.png",
		maxH: 15, 
		maxW: 25, 
		minH: 14, 
		minW: 22, 
		xPos: 85,
		yPos: 65,
		animSpeed: 65,
		startPos: 24,
	});

	let cloud2 = new Cloud({
		name: 'cloud2',
		imageURL: imagesUrl + "cloud2.png",
		maxH: 15, 
		maxW: 15, 
		minH: 12, 
		minW: 12, 
		xPos: 59,
		yPos: 90,
		animSpeed: 45,
		startPos: 55,
	});

	let cloud3 = new Cloud({
		name: 'cloud3',
		imageURL: imagesUrl + "cloud3.png",
		maxH: 15, 
		maxW: 20, 
		minH: 12, 
		minW: 16, 
		xPos: 15,
		yPos: 80,
		animSpeed: 55,
		startPos: 80,
	});

	let boat = new Boat({
		parentDiv: 'boatWrapper',
		name: "boat",
		imageURL: imagesUrl + "boat.png",
		maxH: 20, 
		maxW: 20, 
		minH: 12, 
		minW: 16, 
		xType: "right",
		xPos: 25,
		yType: "bottom",
		yPos: 40,
	});

	// * ***********************************************************************
	// *
	// *   FINAL SETUP
	// *
	// *************************************************************************
	window.addEventListener("load", ()=> { 
		lineTimelines.centreTL.progress( 0.5 ); //.tweenTo( "middle" );
		wind.timeline.progress( 0.5 );

	}); //end window.load

})();