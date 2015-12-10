( () => { 
	let config = {
		wlAnimSpeed: 4,
		windSpeed: 0.8,
	}

	let padWriting;

	const WW = $(window).outerWidth(true);
	const WH = $(window).outerHeight(true);
	const $window = $(window);
	const $body = $("body");
	const $document = $(document);

	//sheet info elements
	const sheetElem = $("#sheet");
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
	const yPercentToPx = (y) => WH / 100 * y;

	//Return a window height percent value from a pixel value
	const yPxToPercent = (y) => (100 * y)/WH;

	//Return a window width % as a pixel value
	const xPercentToPx = (x) => WW / 100 * x;

	const xPxToPercent = (x) => (100 * x)/WW;

	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	const randomFloat = (min, max) => Math.random() * (max - min) + min;

	const animateOpacity = (elem, speed, opacity) => {
		TweenLite.to(elem, speed, {opacity: opacity});
	}

	// * ***********************************************************************
	// *
	// *   GET BACKGROUND IMAGE BASED ON PAGE WIDTH
	// *
	// *************************************************************************
	( () => {
		$("#background").hide();
		$.get( rootUrl, { background: "y", width: WW, height: WH }, (data) => {
			$("#background").css({
				background: "url(" + data + ") 0 no-repeat fixed",
			});
			$("#background").fadeIn(5000);
		}); 
	})();

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
	// *   	HANDWRITING CLASS 
	// *   	Animated handwritten effect using ctx      
	// *   	Based on 
	// *	www.codementor.io/javascript/tutorial/how-to-make-a-write-on-effect-using-html5-ctx-and-javascript-only
	// *
	// *************************************************************************
	class Handwriting{
		constructor(width="600", height="150", parentElem=$('#pad'), id="padInfo"){
			if(parentElem.length === 0){
				console.log("Handwriting parentElem does not exist");
				return;
			}
			if($('#'+id).length === 0){
				parentElem.append('<canvas id="'+id+'" width="'+width+'" height="'+height+'"></canvas>')
			}

			this.ctx = document.querySelector("canvas").getContext("2d");
			this.width = this.ctx.canvas.width;
			this.height = this.ctx.canvas.height;

			//~30px font for 1280px screen width, adjust accordingly for others.
			let fontSize = this.width/5;
			this.ctx.font = fontSize+"px sans-serif"; 

			// line thickness
			this.ctx.lineWidth = 2; 

			//join each line with a round joint
			this.ctx.lineJoin = "round";

			// slight opacity
			this.ctx.globalAlpha = 2/3;

			// set color (black)
			this.ctx.strokeStyle = this.ctx.fillStyle = "#000";

			this.txt = "";
		}

		write(text){
			//if we are trying to write a different word change the writing
			//otherwise do nothing
			if(text != this.txt){
				this.txt=text;
				this.speed = 10;
				// start position for x and iterator
				this.x = 0, 
				this.i = 0;
				// dash-length for off-range
				this.dashLen = 120;
				// we'll update this, initialize
				this.dashOffset = this.dashLen;
				this.erase();
				
				this.loop();
			}
		}

		loop(){
			//test for length not working properly below, don't continue if
			//we have reached the end of the word
			if(this.i > this.txt.length -1){
				return;
			}
			// clear ctx for each frame
			this.ctx.clearRect(this.x, 0, this.width, this.height);

			// calculate and set current line-dash for this char
			this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]);

			// reduce length of off-dash
			this.dashOffset -= this.speed;

			// draw char to ctx with current dash-length
			this.ctx.strokeText(this.txt[this.i], this.x, this.height*2/3, this.width);

			// char done? no, then loop
			if (this.dashOffset > 0){
				requestAnimationFrame(this.loop.bind(this));
			}
			else {
				// ok, outline done, lets fill its interior before next
				this.ctx.fillText(this.txt[this.i], this.x, this.height*2/3, this.width);

				// reset line-dash length
				this.dashOffset = this.dashLen;

				// get x position to next char by measuring what we have drawn
				// notice we offset it a little by random to increase realism
				this.x += this.ctx.measureText(this.txt[this.i++]).width + this.ctx.lineWidth * Math.random();

				// lets use an absolute transform to randomize y-position a little
				this.ctx.setTransform(1, 0, 0, 1, 0, 2 * Math.random());

				// and just cause we can, rotate it a little too to make it even
				// more realistic
				this.ctx.rotate(Math.random() * 0.005);

				// if we still have chars left, loop animation again for this char
				if (this.i < this.txt.length) requestAnimationFrame(this.loop.bind(this));
			}
		}

		//if there is writing on the pad, erase it.
		erase(){
			this.ctx.clearRect(0, 0, this.width, this.height);
		}
	}

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
			this.lineElem = $('#'+lineElem);

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
				top: p1.y + "%",
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
				onUpdate: this.onUpdate,
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
			for(let child of this.getChildren()){
				child.target.hide();
			}
		}

		sheetComplete(){
			wind.tweenTo(3);
			sheetElem.empty();
			sheetElem.hide();
		}

		onStart(){
			if(this.reversed()){
				wind.tweenTo(0);
			}
			else{
				wind.tweenTo(6);
			}
		}

		onUpdate(){
			for(let child of this.getChildren()){
				//if the object is offscreen to the left, hide it
				if( parseInt(child.target[0].style.left,10) + child.target[0].clientWidth < 0 ){
					child.target[0].style.display = "none";
				}
				//if the object is offscreen to the right, hide it
				else if(parseInt(child.target[0].style.left,10) > WW){
					child.target[0].style.display = "none";
				}
				//if the object is onscreen, show it
				else{
					child.target[0].style.display = "block";
				}
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
					timeline.reversed(false).play();
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
			//if number of frames not specified assume 1 frame
			if(!spec.frames){ spec.frames = 1}
			this.frames=spec.frames;

			//if no parentDiv supplied add sprite to body
			if(spec.parentDiv == null){ spec.parentDiv = 'body'; }

			//create the parentDiv if it does not exist
			if (!$("#" + spec.parentDiv).length) {
				$body.append("<div id='" + spec.parentDiv + "'></div>");
			}

			//check if the sprite div has already been created in html and if not add it
			if (!$("#" + spec.name).length) {
				$("#" + spec.parentDiv).append("<div class='sprite' id='" + spec.name + "'></div>");
			}

			this.spriteElem = $("#" + spec.name);

			this.name = spec.name;

			//convert the percentage heights to pixels
			spec.maxW = xPercentToPx(spec.maxW);

			this.width = spec.maxW; //and the maxW as a percentage of screen width

			//if(spec.originalName){
			//	this.originalName = spec.originalName;
			//	this.spriteElem = $("#" + spec.originalName );
			//}

			this.setBackground(spec);
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

		setBackground(spec){
			//get an resized version of the image that matches the calcualted image width
			//images must have a description set in Processwire that matches the sprites name
			$.get( rootUrl, { image: this.name, width: this.width }, ( data ) => {
				this.spriteImage = this.selectImage(data, (w, h) => {
					this.spriteElem.css({
						background: "url('" + data + "') no-repeat 0 0%",
						"background-size": "100%",
						height: h/(this.frames) +"px",
						width: w + "px"
					});
					this.height = h/(this.frames);

					this.width = w;

					this.setPosition(spec);
					this.spriteElem.fadeIn(2000);

					if(typeof this.afterImageLoad === "function") {
						this.afterImageLoad();				
					}		
				})
			});
		}

		setPosition(spec){
			if(!spec.type){ spec.type = "absolute"; }
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

			wind.addTween( this );
	  	}

	  	//anything that needs to be done after the ajax image load goes here
	  	afterImageLoad(){
	  		this.makeDraggable();
	  	}

	  	setPosition(spec){
	  		console.log(spec.name, spec.xPos)
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

	  		let heightPercent = this.height/100;
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
				
			this.xPos = point.x
			this.yPos = point.y;

			lineTimelines.addTween( this );
	  	}

	  	//Display information on the sheet
	  	sheetContents(){
	    	switch( this.name ) {
	    		case "book1":
	    			this.loadGallery("book1");
	    	        break;
	    	    case "book2":
	    			this.loadGallery("book2");
	    	        break;
	    	    case "book3":
	    			this.loadGallery("book3");
	    	        break;
	    	    case "book4":
	    			this.loadGallery("book4");
	    	        break;
	    	    case "gourd1":
	    			this.loadGallery("crafts");
	    	        break;
	    	    case "poi":
	    			this.loadGallery("performance");
	    	        break;
	    	    case "silks1":
	    			silksVideo.show();
	    	        break;
	    	    case "dress":
	    			this.loadGallery("clothing");
	    	        break;
	    	    case "scarf":
	    			this.loadGallery("clothing");
	    	        break;
	    	}
	  	}

	  	//empty the sheet then load a gallery with ajax
	  	loadGallery(page){
	  		//clear any previous galleries
	  		sheetElem.empty();
	  		
	  		$.get( rootUrl , {
	  			name: page,
	  			width: parseInt(WW, 10), 
	  			thumbWidth: parseInt(sheetElem.width()/7, 10),
	  		}, (data) => {
				sheetElem.append(data);
				$("#sheetGallery").photobox("a",{ time:0 })
			}); 

	  	}
	  	
	  	//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"
	  	onDrag( sprite ){
			return function(){
				//difference between start and current point in drag
				let change = sprite.xPos - this.pointerX;
				
				sprite.direction = this.pointerX - sprite.mid;

				//current middle of the sprite
				sprite.mid = parseInt(sprite.spriteElem[0].style.left, 10) +  sprite.width/2;

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
								? 0.5 + ( change/sprite.mid/2 ) * sprite.mid/WW
								: 0.5 + ( change/(WW-sprite.mid)/2 ) * ( 1 - sprite.mid/WW );
				sprite.timeline.progress( progress ); 	

				//show the next page divs if dragged far enough
				let p =sprite.timeline.progress();
				if(p > sprite.progressMax || isNaN(p)){
					animateOpacity("#overlayLeft", 0.4, 1);
					if(sprite.nextGroup!="Sheet"){
						padWriting.write(sprite.nextGroup);
					}
					else{
						padWriting.write(sprite.name);
					}
				}
				else if( p < sprite.progressMin ){
					animateOpacity("#overlayRight", 0.4, 1);
					if(sprite.nextGroup!="Sheet"){
						padWriting.write(sprite.nextGroup);
					}
					else{
						padWriting.write(sprite.name);
					}
				}
				else{
					animateOpacity("#overlayLeft", 0.4, 0);
					animateOpacity("#overlayRight", 0.4, 0);
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
				animateOpacity("#overlayLeft", 0.4, 0);
				animateOpacity("#overlayRight", 0.4, 0);
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
					//show the objects
					for(let child of sprite.nextTimeline.getChildren()){
						child.target.show();
					}
					animateOpacity("#infoRight", 0.2, 0);
					sprite.animateSecondary();
				}
				else{
					wind.tweenTo(3);
					//restart the gusts
					wind.gusts();
					sprite.endX = parseFloat(sprite.spriteElem[0].style.left ) + sprite.width/2;
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
			this.xPos = this.xPos + this.width/2;
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
	// *   	let ShadowSpriteSpec ={
	// *		...as for ResponsiveSprite spec
	// * 		shadowImg: imageURL 
	// *		shadowYOffset: 5 //fine tuning for base of shadow
	// *	}
	// *
	// *************************************************************************

	class ShadowSprite extends ResponsiveSprite{
		constructor(spec){
			spec.xType = "left";

			super(spec);

			this.shadowYOffset = spec.shadowYOffset || 5;
			this.shadowXOffset = spec.shadowXOffset || 0;
			this.shadowWidth = spec.shadowWidth || 100;

			if(spec.shadowImg) { this.shadow(spec.shadowImg); }

			this.rotated = false;

		}

		shadow(shadowImg){
			let spriteMid = parseFloat(this.spriteElem.css("left"))/WW*100;
			this.spriteElem.append("<div id='" + this.name + "Shadow' class='shadow'></div>");

			let shadowTL = new TimelineMax({paused: true})
			let shadowTween = TweenMax.fromTo("#" + this.name + "Shadow", 2,
				{ skewX: -60, }, 
				{ skewX: 60, ease: Linear.easeNone,	});

			shadowTL.add(shadowTween)

			this.shadow = $("#" + this.name + "Shadow");

			$document.on("mousemove", (e) => {
				let pageXPercent = (e.pageX * 100)/WW;
				let skew = 0;
				if (pageXPercent < spriteMid) {
					if(this.rotated){
						skew = 0.5 - (0.5 / (spriteMid - 100)) * (spriteMid - pageXPercent);
					}
					else{
						skew = 0.5 + (0.5 / spriteMid) * (spriteMid - pageXPercent);
					}
				}
				else{
					if(this.rotated){
						skew = 0.5 + (0.5 / spriteMid) * (spriteMid - pageXPercent);
					}
					else{
						skew = 0.5 - (0.5 / (spriteMid - 100)) * (spriteMid - pageXPercent);
					}
				}

				shadowTL.progress(skew);
			});
			this.shadowYOffset = -100 + this.shadowYOffset;

			window.addEventListener("load", () => { 
				let width = parseFloat(this.spriteElem.css("width"));
				//slightly more accurate calculation of spriteMid now that we know the width
				spriteMid = (parseFloat(this.spriteElem.css("left")) + width/2)/WW*100;

				this.shadow.css({
					background: "url('" + shadowImg + "') 0 0% / contain no-repeat",
					//height: this.height + "px",
					width: this.shadowWidth + "%",
					bottom: this.shadowYOffset + "%",
					left: this.shadowXOffset + "%", 
				});
			});
		}
	}

	// * ***********************************************************************
	// *
	// *   	Pad CLASS extends SHADOW SPRITE CLASS 
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************
	class Pad extends ShadowSprite{
		constructor(spec){
			super(spec);
		}

		afterImageLoad(){
			padWriting = new Handwriting(this.width *0.6, this.height *0.7);
		}
	}
	// * ***********************************************************************
	// *
	// *   	GOOSE CLASS extends SHADOW SPRITE CLASS 
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************
	class Goose extends ShadowSprite{
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

			this.timeline.add(move, 0);
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
	// *   	STAFF CLASS extends SHADOW SPRITE CLASS 
	// *
	// *	Define animation functions for staff
	// *
	// *************************************************************************

	class Staff extends ShadowSprite{
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

			super(spec);

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
				let vertical = randomInt(0,1) ? randomInt(20,30) : randomInt(-20,-30);
				let horizontal = randomInt(30,50);

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
					wind(horizontal, vertical);
				}
				else{ 
					wind(-horizontal, vertical);	
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
			this.animate();
		}

		//anything that needs to be done after the ajax image load goes here
	  	afterImageLoad(){
	  		this.clipPath();
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
	const bookSpec = {
		imageURL: imagesUrl + "book.png",
		frames: 1,
		maxW: 6, 
		offset: 6,
		rotate: true,
	};

	const tshirtSpec = {
		frames: 7,
		imageURL: imagesUrl + "tshirt.png",
		maxW: 15, 
		offset: 7,
		rotate: true,
	};

	const gourdSpec = {
		imageURL: imagesUrl + "gourd.png",
		frames: 1,
		maxW: 3.5, 
		offset: 4,
		progressMin: 0.40,
		progressMax: 0.81,
	};

	const silkSpec = {
		imageURL: imagesUrl + "silk.png",
		frames: 7,
		link: '#',
		maxW: 33, 
		offset: 0,
		progressMin: 0.48,
		progressMax: 0.89,
	};

	const clothingSpec = {
		rotate: true,
		frames: 1,
		maxW: 19, 
	};

	// *********************************************************************
	// *SPRITES ON CENTRE SCREEN AT START
	// *********************************************************************
	const book = new LineSprite( _.extend({
		name: "book",
		xPos: 45,
		group: "Centre", 
		nextGroup: "Books",
		progressMin: 0.30,
		progressMax: 0.70,
	}, bookSpec));

	const tshirt = new LineSprite(_.extend({
		name: "tshirt",
		xPos: 55,
		group: "Centre", 
		nextGroup: "Clothing",
		progressMin: 0.36,
		progressMax: 0.75,
	}, tshirtSpec));

	const gourd = new LineSprite(_.extend({
		name: "gourd",
		xPos: 70,
		group: "Centre", 
		nextGroup: "Crafts",
	}, gourdSpec));

	const silk = new LineSprite(_.extend({
		name: "silk",
		xPos: 66,
		group: "Centre", 
		nextGroup: "Performance",
		trigger: "silkTrigger",
	}, silkSpec));


	// *********************************************************************
	// * SHEET SPRITE USED TO DISPLY INFORMATION
	// *********************************************************************
	const sheetSpec = {
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
		maxW: 53, 
	};
	const sheet = new LineSprite(sheetSpec);

	$("#sheetContents").css({ 
		transform: 'rotate(-' + washingLine.slopeDegrees + 'deg)',
	});

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM LEFT) AFTER CLICKING BOOK
	// *********************************************************************
	const book1Spec = _.extend({
		name: "book1",
		group: "Books",
		xPos: 32,
		progressMin: 0.22,
		progressMax: 0.64,
	}, bookSpec);
	const book1 = new LineSprite(book1Spec);

	const book2Spec = _.extend({
		name: "book2",
		group: "Books",
		xPos: 47,
		progressMin: 0.30,
		progressMax: 0.70,
	}, bookSpec);
	const book2 = new LineSprite(book2Spec);

	const book3Spec = _.extend({
		name: "book3",
		group: "Books",
		xPos: 62,
		progressMin: 0.36,
		progressMax: 0.79,
	}, bookSpec);
	const book3 = new LineSprite(book3Spec);

	const book4Spec = _.extend({
		name: "book4",
		group: "Books",
		xPos: 75,
		progressMin: 0.45,
		progressMax: 0.86,
	}, bookSpec);
	const book4 = new LineSprite(book4Spec);

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM RIGHT) AFTER CLICKING TSHIRT
	// *********************************************************************
	const dressSpec = _.extend({
		name: "dress",
		imageURL: imagesUrl + "dress.png",
		group: "Clothing",
		offset: 3,
		xPos: 35,
		progressMin: 0.28,
		progressMax: 0.70,
	}, clothingSpec);
	const dress = new LineSprite(dressSpec);

	const scarfSpec = _.extend({
		name: "scarf",
		imageURL: imagesUrl + "scarf.png",
		group: "Clothing",
		offset: 3,
		xPos: 55,
		progressMin: 0.34,
		progressMax: 0.78,
	}, clothingSpec);
	const scarf = new LineSprite(scarfSpec);

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING GOURD
	// *********************************************************************
	const gourd1Spec = _.extend({
		name: "gourd1",
		group: "Crafts",
		xPos: 70,
	}, gourdSpec);
	const gourd1 = new LineSprite(gourd1Spec);

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING SILK
	// *********************************************************************
	const silk1Spec = _.extend({
		name: "silk1",
		xPos: 66,
		group: "Performance",
		trigger: "silk1Trigger",
	}, silkSpec);
	const silk1 = new LineSprite(silk1Spec);

	const poiSpec = {
		frames: 7,
		name: "poi",
		imageURL: imagesUrl + "poi.png",
		maxW: 15.5,  
		offset: 3,
		xPos: 45,
		group: "Performance",
		progressMin: 0.36,
		progressMax: 0.75,
	}
	const poi = new LineSprite(poiSpec);

	// * ***********************************************************************
	// *
	// *	PLANK OBJECTS
	// *
	// *
	// * ***********************************************************************

	const bucket = new ShadowSprite({
		parentDiv: 'plankSprites',
		name: "bucket",
		imageURL: imagesUrl + "bucket.png",
		maxW: 7.5, 
		xPos: 7,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "bucket-shadow.png",
		shadowYOffset: 10, 
		shadowXOffset: 0, 
		shadowWidth: 100, 
	});
	bucket.spriteElem.hover(
		() => { padWriting.write("Home"); }
	);
	bucket.spriteElem.click( () => { 
		lineTimelines.home();
	});

	const brushholder = new ShadowSprite({
		parentDiv: 'plankSprites',
		name: "brushholder",
		imageURL: imagesUrl + "brushholder.png",
		maxW: 5.5, 
		xPos: 15,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "brushholder-shadow.png",
		shadowYOffset: 5, 
		shadowXOffset: 10, 
		shadowWidth: 100, 
	});
	brushholder.spriteElem.hover(
		() => { padWriting.write("Biography"); }
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

	const inkwell = new ShadowSprite({
		parentDiv: 'plankSprites',
		name: "inkwell",
		imageURL: imagesUrl + "inkwell.png",
		maxW: 5.5, 
		xPos: 21,
		yPos: 10,
		yType: "bottom",
		shadowImg: imagesUrl + "inkwell-shadow.png",
		shadowYOffset: 15, 
		shadowXOffset: 10, 
		shadowWidth: 90, 
	});
	inkwell.spriteElem.hover(
		() => { padWriting.write("Contact"); }
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

	const pad = new Pad({
		parentDiv: 'plankSprites',
		name: "pad",
		imageURL: imagesUrl + "pad.png", 
		maxW: 20, 
		xPos: 27,
		yPos: 5,
		yType: "bottom",
		shadowYOffset: 5, 
		shadowXOffset: 10, 
		shadowWidth: 65, 
	});

	const gooseSpec = {
		parentDiv: 'gooseWrapper',
		name: "goose",
		imageURL: imagesUrl + "goose.png",
		maxW: 18,
		xPos: 110, 
		yPos: 70,
		shadowImg: imagesUrl + "goose-shadow.png",
		shadowYOffset: 10, 
		shadowXOffset: 0, 
		shadowWidth: 100, 
	}
	const goose = new Goose(gooseSpec);;

	const staffSpec = {
		parentDiv: 'staffWrapper',
		name: "staff",
		imageURL: imagesUrl + "staff.png",
		maxW: 40,
		xPos: 120,
		yPos: 120,
		shadowImg: imagesUrl + "staff-shadow.png",
		shadowYOffset: 70, 
		shadowXOffset: 3, 
		shadowWidth: 100, 
	}
	const staff = new Staff(staffSpec);

	// * ***********************************************************************
	// *
	// *  CLOUDS AND BOAT
	// *
	// *************************************************************************

	const cloud1 = new Cloud({
		name: 'cloud1',
		imageURL: imagesUrl + "cloud1.png",
		maxW: 30, 
		xPos: 85,
		yPos: 65,
		animSpeed: 65,
		startPos: 24,
	});

	const cloud2 = new Cloud({
		name: 'cloud2',
		imageURL: imagesUrl + "cloud2.png",
		maxW: 20,  
		xPos: 59,
		yPos: 90,
		animSpeed: 45,
		startPos: 55,
	});

	const cloud3 = new Cloud({
		name: 'cloud3',
		imageURL: imagesUrl + "cloud3.png",
		maxW: 20, 
		xPos: 15,
		yPos: 80,
		animSpeed: 55,
		startPos: 80,
	});

	const boat = new Boat({
		parentDiv: 'boatWrapper',
		name: "boat",
		imageURL: imagesUrl + "boat.png",
		maxH: 20, 
		maxW: 13, 
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
	window.onload = function(e){ 
    	setTimeout( () => {
    		lineTimelines.centreTL.tweenTo( "middle" );
    	}, 2000);

		//wind.timeline.progress( 0.5 );
		washingLine.lineElem.fadeIn(3000);

		/*
		bucket.spriteElem.fadeIn(4000);
		inkwell.spriteElem.fadeIn(4000);
		brushholder.spriteElem.fadeIn(4000);
		pad.spriteElem.fadeIn(4000);
		cloud1.spriteElem.fadeIn(4000);
		cloud2.spriteElem.fadeIn(4000);
		cloud3.spriteElem.fadeIn(4000);
		boat.spriteElem.fadeIn(4000);
		*/
	}


})();