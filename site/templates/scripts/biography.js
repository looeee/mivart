/*eslint no-use-before-define:0, no-console:0*/
/*eslint-env browser, jquery */

/* ************************************************************************

      BOOKBLOCKS

************************************************************************** */

(function(){
	"use strict";

	//refresh page on browser resize
	$(window).resize(function(){
		if (window.RT) { clearTimeout(window.RT); }

		window.RT = setTimeout(function(){
			window.location.href = window.location.href;
			location.reload(false);/* false to get page from cache */
		}, 200);
	});

	//Set the height of the bb-wrapper so that the contents fits on the pages
	var setHeight = function(){
		var imageUrl = $("#bb-openbook").css("background-image"),
			image, imageHeight, imageWidth, marginTop, marginLeft;
		var divWidth = $("#bb-openbook").width();
		var divHeight = $("#bb-openbook").height();
		var windowHeight = $(window).outerHeight(true);
		var windowWidth = $(window).outerWidth(true);

		// Remove url() or in case of Chrome url("")
		imageUrl = imageUrl.match(/^url\("?(.+?)"?\)$/);

		if (imageUrl[1]) {
			imageUrl = imageUrl[1];
			image = new Image();

			// check the image is loaded
			$(image).load(function () {

				imageHeight = ((divWidth / image.width) * image.height);
				imageWidth = ((divHeight / image.height) * image.width);

				//In this case the image fills the div vertically
				//imageHeight is not accurate but imageWidth is
				if(imageHeight >= divHeight){
					imageWidth = imageWidth * 0.9;
					imageHeight = "90%";
					marginTop = "3%";
					marginLeft = ((windowWidth - imageWidth) / 2) * 0.6;
				}

				//otherwise it fills the div horizontally
				//imageWidth is not accurate but imageHeight is
				else{
					imageHeight = imageHeight * 0.8;
					marginTop = ((windowHeight - imageHeight) / 2 ) * 0.85;
					imageWidth = "90%";
					marginLeft = "5%";
					//imageWidth = divWidth * 0.9;
					//marginLeft = ((windowWidth - imageWidth) / 2) * 0.4;
				}

				$("#bb-wrapper").css({
					height: imageHeight,
					width: imageWidth,
					"margin-left": marginLeft,
					"margin-top": marginTop
				});
			});

			image.src = imageUrl;
		}
	};

	var addBook = (function() {
		//var bb = $(".bb-bookblock");

		var config = {
			$bookBlock: $( ".bb-bookblock" ),
			$navNext: $( "#bb-nav-next" ),
			$navPrev: $( "#bb-nav-prev" ),
			$navFirst: $( "#bb-nav-first" ),
			$navLast: $( "#bb-nav-last" )
		},
		init = function() {
			config.$bookBlock.bookblock( {
				speed: 800,
				easing: "ease-in-out",
				shadows: true,
				shadowSides: 0.8,
				shadowFlip: 0.4

				// callback after the flip transition
				// old is the index of the previous item
				// page is the current item´s index
				// isLimit is true if the current page is the last one (or the first one)
				//onEndFlip: function(old, page, isLimit) {	}

				// callback before the flip transition
				// page is the current item´s index
				//onBeforeFlip : function(page) { return false; }
			} );
			initEvents();
		},
		initEvents = function() {

			var $slides = config.$bookBlock.children();

			// add navigation events
			config.$navNext.on( "click touchstart", function() {
				config.$bookBlock.bookblock( "next" );
				return false;
			} );

			config.$navPrev.on( "click touchstart", function() {
				config.$bookBlock.bookblock( "prev" );
				return false;
			} );

			config.$navFirst.on( "click touchstart", function() {
				config.$bookBlock.bookblock( "first" );
				return false;
			} );

			config.$navLast.on( "click touchstart", function() {
				config.$bookBlock.bookblock( "last" );
				return false;
			} );

			// add swipe events
			$slides.on( {
				"swipeleft": function( ) {
					config.$bookBlock.bookblock( "next" );
					return false;
				},
				"swiperight": function( ) {
					config.$bookBlock.bookblock( "prev" );
					return false;
				}
			} );

			// add keyboard events
			$( document ).keydown( function(e) {
				var keyCode = e.keyCode || e.which,
					arrow = {
						left: 37,
						up: 38,
						right: 39,
						down: 40
					};

				switch (keyCode) {
					case arrow.left:
						config.$bookBlock.bookblock( "prev" );
						break;
					case arrow.right:
						config.$bookBlock.bookblock( "next" );
						break;
				}
			} );
			};

			return { init: init };

		})();


	$(document).ready(function(){
		addBook.init();
	});

	$(window).load(function(){
		$(".bb-bookblock").fadeIn();
		setHeight();
	});

})();
