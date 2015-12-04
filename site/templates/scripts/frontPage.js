(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	var config = {
		wlAnimSpeed: 4,
		windSpeed: 0.8
	};

	var WW = $(window).outerWidth(true);
	var WH = $(window).outerHeight(true);
	var $window = $(window);
	var $body = $("body");
	var $document = $(document);

	var infoLeftText = document.getElementById("infoLeftText");
	var infoRightText = document.getElementById("infoRightText");
	var padInfo = $("#padInfo");

	//sheet info elements
	var sheetContent = $("#sheetContents");
	var craftsGallery = $("#craftsGallery");
	var clothingGallery = $("#clothingGallery");
	var performanceGallery = $("#performanceGallery");
	var book1Gallery = $("#book1Gallery");
	var book2Gallery = $("#book2Gallery");
	var book3Gallery = $("#book3Gallery");
	var book4Gallery = $("#book4Gallery");
	var biography = $("#biography");
	var contact = $("#contact");
	var silksVideo = $("#silksVideo");

	//prevent touch scrolling
	document.body.addEventListener('touchmove', function (e) {
		e.preventDefault();
	});

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
	var yPercentToPx = function yPercentToPx(y) {
		return WH / 100 * y;
	};

	//Return a window height percent value from a pixel value
	var yPxToPercent = function yPxToPercent(y) {
		return 100 * y / WH;
	};

	//Return a window width % as a pixel value
	var xPercentToPx = function xPercentToPx(x) {
		return WW / 100 * x;
	};

	var randomInt = function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var randomFloat = function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	};

	var animateOpacity = function animateOpacity(elem, speed, opacity) {
		TweenLite.to(elem, speed, { opacity: opacity });
	};

	// * ***********************************************************************
	// *
	// *   MOUSE DIRECTION PLUGIN
	// *   Based on Hasin Hayder's original [hasin@leevio.com | http://hasin.me]
	// *
	// *************************************************************************

	(function ($) {
		var oldx = 0;
		var direction = "";
		$.mousedirection = function () {
			$document.on("mousemove", function (e) {
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

	var Handwriting = (function () {
		function Handwriting() {
			var width = arguments.length <= 0 || arguments[0] === undefined ? "600" : arguments[0];
			var height = arguments.length <= 1 || arguments[1] === undefined ? "150" : arguments[1];
			var parentElem = arguments.length <= 2 || arguments[2] === undefined ? $('#pad') : arguments[2];
			var id = arguments.length <= 3 || arguments[3] === undefined ? "padInfo" : arguments[3];

			_classCallCheck(this, Handwriting);

			if (parentElem.length === 0) {
				console.log("Handwriting parentElem does not exist");
				return;
			}
			if ($('#' + id).length === 0) {
				parentElem.append('<canvas id="' + id + '" width="' + width + '" height="' + height + '"></canvas>');
			}

			this.ctx = document.querySelector("canvas").getContext("2d");
			this.width = this.ctx.canvas.width;
			this.height = this.ctx.canvas.height;
			// dash-length for off-range
			this.dashLen = 120;
			// we'll update this, initialize
			this.dashOffset = this.dashLen;
			this.speed = 10;
			// start position for x and iterator
			this.x = 0, this.i = 0;

			//~30px font for 1280px screen width, adjust accordingly for others.
			var fontSize = this.width / 5;
			this.ctx.font = fontSize + "px sans-serif";

			// line thickness
			this.ctx.lineWidth = 2;

			//join each line with a round joint
			this.ctx.lineJoin = "round";

			// slight opacity
			this.ctx.globalAlpha = 2 / 3;

			// set color (black)
			this.ctx.strokeStyle = this.ctx.fillStyle = "#000";

			this.txt = "Home";
		}

		_createClass(Handwriting, [{
			key: "write",
			value: function write() {
				var text = arguments.length <= 0 || arguments[0] === undefined ? this.txt : arguments[0];

				this.txt = text;
				this.loop();
			}
		}, {
			key: "loop",
			value: function loop() {
				// clear ctx for each frame
				this.ctx.clearRect(this.x, 0, this.width, this.height);

				// calculate and set current line-dash for this char
				this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]);

				// reduce length of off-dash
				this.dashOffset -= this.speed;

				// draw char to ctx with current dash-length
				this.ctx.strokeText(this.txt[this.i], this.x, this.height * 2 / 3, this.width);

				// char done? no, then loop
				if (this.dashOffset > 0) {
					requestAnimationFrame(this.loop.bind(this));
				} else {
					// ok, outline done, lets fill its interior before next
					this.ctx.fillText(this.txt[this.i], this.x, this.height * 2 / 3, this.width);

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
		}]);

		return Handwriting;
	})();

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

	var Line = (function () {
		function Line() {
			var lineElem = arguments.length <= 0 || arguments[0] === undefined ? "line" : arguments[0];
			var p1 = arguments.length <= 1 || arguments[1] === undefined ? { x: 0, y: 10 } : arguments[1];
			var p2 = arguments.length <= 2 || arguments[2] === undefined ? { x: 100, y: 18 } : arguments[2];

			_classCallCheck(this, Line);

			if ($('#' + lineElem).length === 0) {
				$body.append('<div id="' + lineElem + '"></div>');
			}

			this.lineElem = $('#' + lineElem);

			this.lineElem.css({ opacity: 0 });

			this.p1 = {
				x: xPercentToPx(p1.x),
				y: yPercentToPx(p1.y)
			};
			this.p2 = {
				x: xPercentToPx(p2.x),
				y: yPercentToPx(p2.y)
			};

			this.slope = (p2.y - p1.y) / (p2.x - p1.x);

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
				'z-index': '-100'
			});

			//any calculations that need to be done after the images have loaded go here
			window.addEventListener("load", function () {
				var fadeSpeed = randomFloat(0.2, 0.4);
				animateOpacity("#line", fadeSpeed, 1);
			});
		}

		//return y value for given x value

		_createClass(Line, [{
			key: "yPoint",
			value: function yPoint(x) {
				return this.slope * (x - this.p1.x) + this.p1.y;
			}
		}]);

		return Line;
	})();

	var washingLine = new Line();

	// * ***********************************************************************
	// *
	// *   	WASHING LINE TIMELINES CLASS
	// *
	// *************************************************************************

	var WashingLineTimelines = (function () {
		function WashingLineTimelines() {
			_classCallCheck(this, WashingLineTimelines);

			var options = {
				paused: true,
				onComplete: this.onComplete,
				onReverseComplete: this.onComplete,
				onStart: this.onStart
			};

			this.centreTL = new TimelineMax(options);
			this.centreTL.add("middle", config.wlAnimSpeed / 2);

			this.booksTL = new TimelineMax(options);
			this.booksTL.add("middle", config.wlAnimSpeed / 2);

			this.clothingTL = new TimelineMax(options);
			this.clothingTL.add("middle", config.wlAnimSpeed / 2);

			this.craftsTL = new TimelineMax(options);
			this.craftsTL.add("middle", config.wlAnimSpeed / 2);

			this.performanceTL = new TimelineMax(options);
			this.performanceTL.add("middle", config.wlAnimSpeed / 2);

			this.sheetTL = new TimelineMax({
				paused: true,
				onComplete: this.sheetComplete,
				onReverseComplete: this.sheetComplete,
				onStart: this.onStart
			});
			this.sheetTL.add("middle", config.wlAnimSpeed / 2);

			this.timelines = [this.centreTL, this.booksTL, this.clothingTL, this.craftsTL, this.performanceTL, this.sheetTL];
		}

		_createClass(WashingLineTimelines, [{
			key: "onComplete",
			value: function onComplete() {
				wind.tweenTo(3);
			}
		}, {
			key: "sheetComplete",
			value: function sheetComplete() {
				wind.tweenTo(3);
				var sheetDivs = $("#sheet").children("div");
				sheetDivs.hide();
			}
		}, {
			key: "onStart",
			value: function onStart() {
				if (this.reversed()) {
					wind.tweenTo(0);
				} else {
					wind.tweenTo(6);
				}
			}

			// add movement tween for a sprite on it's correct timeline

		}, {
			key: "addTween",
			value: function addTween(sprite) {
				var tween = TweenMax.fromTo("#" + sprite.name, config.wlAnimSpeed, {
					left: sprite.xPos + WW,
					top: washingLine.yPoint(sprite.xPos + WW) - sprite.offset }, {
					left: sprite.xPos - WW,
					top: washingLine.yPoint(sprite.xPos - WW) - sprite.offset,
					ease: Linear.easeNone
				});

				//set the the timeline for this
				switch (sprite.group) {
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
		}, {
			key: "bringSheetOnscreen",
			value: function bringSheetOnscreen() {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.timelines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var timeline = _step.value;

						var progress = timeline.progress();
						if (progress != 1 && progress != 0) {
							timeline.play();
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				this.sheetTL.tweenTo("middle");
			}
		}, {
			key: "home",
			value: function home() {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.timelines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var timeline = _step2.value;

						var progress = timeline.progress();
						if (progress != 1 && progress != 0) {
							timeline.play();
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				this.centreTL.progress(0).tweenTo("middle");
			}
		}]);

		return WashingLineTimelines;
	})();

	var lineTimelines = new WashingLineTimelines();

	// * ***********************************************************************
	// *
	// *   	WINDTIMELINE CLASS
	// * 	Assumes a line sprite with either 1 or 7 frames
	// *
	// *************************************************************************

	var WindTimeline = (function () {
		function WindTimeline() {
			_classCallCheck(this, WindTimeline);

			this.timeline = new TimelineMax({ paused: true });

			//assume all sprites have either one or seven frames, for now
			var frames = 7;

			//add one label for each frame position to the gusts timeline
			var frameTime = 0;
			for (var i = 0; i < frames; i++) {
				this.timeline.add("frame" + i, frameTime);
				frameTime += config.windSpeed / (frames - 1);
			}

			this.gusts();

			//any calculations that need to be done after the images have loaded go here
			window.addEventListener("load", function () {});
		}

		//gusts to left or right at random intervals

		_createClass(WindTimeline, [{
			key: "gusts",
			value: function gusts() {
				var _this = this;

				//if the gusts are already running reset them
				if (this.gustsTimer) {
					clearTimeout(this.gustsTimer);
				}
				//otherwise choose a direction at random
				var frame = randomInt(0, 1) ? 1 : 5;
				this.gustsTimer = setTimeout(function () {
					_this.tweenTo(frame);
					setTimeout(function () {
						_this.tweenTo(3);
					}, 1000);
					_this.gusts();
				}, randomFloat(1500, 5000));
			}
		}, {
			key: "addTween",
			value: function addTween(sprite) {
				if (sprite.frames === 1) {
					return;
				} //if it's a single frame sprite just return for now

				//this tween contains all the frames
				var tween = TweenMax.fromTo("#" + sprite.name, config.windSpeed, {
					backgroundPosition: "0 0%"
				}, {
					backgroundPosition: "0 100%",
					ease: SteppedEase.config(sprite.frames - 1)
				});

				this.timeline.add(tween, 0);
			}
		}, {
			key: "tweenTo",
			value: function tweenTo(frameNum) {
				this.timeline.tweenTo("frame" + frameNum);
			}
		}]);

		return WindTimeline;
	})();

	var wind = new WindTimeline();

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

	var ResponsiveSprite = (function () {
		function ResponsiveSprite(spec) {
			_classCallCheck(this, ResponsiveSprite);

			//if frames not supplied set it to one
			if (!spec.frames) {
				spec.frames = 1;
			}

			//if no parentDiv supplied add sprite to body
			if (spec.parentDiv == null) {
				spec.parentDiv = 'body';
			}

			//create the parentDiv if it does not exist
			if (!$("#" + spec.parentDiv).length) {
				$body.append("<div id='" + spec.parentDiv + "'></div>");
			}

			spec.parentDiv = $("#" + spec.parentDiv);

			//check if the sprite div has already been created in html and if not add it
			if (!$("#" + spec.name).length) {
				if (spec.islink) {
					spec.parentDiv.append("<a id='" + spec.name + "'></a>");
				} else {
					spec.parentDiv.append("<div id='" + spec.name + "'></div>");
				}
			}

			this.spriteElem = $("#" + spec.name);
			this.name = spec.name;

			this.setDims(spec);

			this.setBackground();
		}

		_createClass(ResponsiveSprite, [{
			key: "setDims",
			value: function setDims(spec) {
				var _this2 = this;

				if (!spec.minH) {
					//if minH/minW are not provided set them to 0
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

				this.spriteImage = this.selectImage(spec.imageURL, function (w, h) {
					_this2.imgH = h;
					_this2.imgW = w;
					//After the image has loaded, initialize the width based on maxH
					_this2.width = _this2.imgW / (_this2.imgH / spec.frames / _this2.height);

					_this2.calcSize(spec); //now calculate the sprite's size and apply it to the spriteElem
				});
			}
		}, {
			key: "calcSize",
			value: function calcSize(spec) {
				//increase width if too narrow
				if (this.width < spec.maxW || this.width < spec.minW) {
					while (this.width < spec.maxW && this.height < spec.maxH) {
						this.height = this.height + 5;
						this.width = this.imgW / (this.imgH / spec.frames / this.height);
					}
				}

				//decrease width if too wide
				if (this.width > spec.maxW && this.width > spec.minW) {
					while (this.width > spec.maxW && this.height <= spec.maxH) {
						this.height = this.height - 5;
						this.width = this.imgW / (this.imgH / spec.frames / this.height);
					}
				}

				//decrease height if too tall
				if (this.height > spec.maxH && this.height > spec.minH) {
					this.height = spec.maxH;
					this.width = this.imgW / (this.imgH / spec.frames / this.height);
				}

				//Set the new width and height
				this.spriteElem.css({
					height: this.height + "px",
					width: this.width + "px"
				});
			}
		}, {
			key: "setBackground",
			value: function setBackground() {
				this.spriteElem.css({
					background: "url('" + this.spriteImage.src + "') no-repeat 0 0%",
					"background-size": "100%"
				});
			}
		}, {
			key: "selectImage",
			value: function selectImage(imageURL, callback) {
				var img = new Image();
				img.onload = function () {
					if (callback) {
						callback(img.width, img.height);
					}
				};
				img.src = imageURL;
				return img;
			}
		}, {
			key: "setPosition",
			value: function setPosition(spec) {
				if (!spec.type) {
					spec.type = "absolute";
				}
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
		}]);

		return ResponsiveSprite;
	})();

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

	var LineSprite = (function (_ResponsiveSprite) {
		_inherits(LineSprite, _ResponsiveSprite);

		function LineSprite(spec) {
			_classCallCheck(this, LineSprite);

			spec.parentDiv = 'lineSprites';

			//set variables

			var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(LineSprite).call(this, spec));

			_this3.frames = spec.frames;
			_this3.trigger = spec.trigger || spec.name; //allow setting of a different element as trigger
			_this3.group = spec.group;
			_this3.nextGroup = spec.nextGroup || "Sheet";
			_this3.progressMin = spec.progressMin || 0.26;
			_this3.progressMax = spec.progressMax || 0.72;

			switch (_this3.group) {
				case "Books":
					_this3.timeline = lineTimelines.booksTL;
					break;
				case "Crafts":
					_this3.timeline = lineTimelines.craftsTL;
					break;
				case "Clothing":
					_this3.timeline = lineTimelines.clothingTL;
					break;
				case "Performance":
					_this3.timeline = lineTimelines.performanceTL;
					break;
				case "Sheet":
					_this3.timeline = lineTimelines.sheetTL;
					break;
				default:
					_this3.timeline = lineTimelines.centreTL;
			}

			//set the the timeline for the next group of sprites
			switch (_this3.nextGroup) {
				case "Sheet":
					_this3.nextTimeline = lineTimelines.sheetTL;
					break;
				case "Books":
					_this3.nextTimeline = lineTimelines.booksTL;
					break;
				case "Crafts":
					_this3.nextTimeline = lineTimelines.craftsTL;
					break;
				case "Clothing":
					_this3.nextTimeline = lineTimelines.clothingTL;
					break;
				case "Performance":
					_this3.nextTimeline = lineTimelines.performanceTL;
					break;
				case "Home":
					_this3.nextTimeline = lineTimelines.centreTL;
					break;
			}

			//hide the sprite until it has been positioned
			animateOpacity("#" + _this3.name, 0, 0);

			wind.addTween(_this3);

			_this3.makeDraggable();

			//any calculations that need to be done after the image has loaded go here
			window.addEventListener("load", function () {
				_this3.width = _this3.spriteElem.width();
				_this3.setPosition(spec);
				lineTimelines.addTween(_this3);
				_this3.xPos = _this3.xPos + _this3.width / 2;
			});
			return _this3;
		}

		_createClass(LineSprite, [{
			key: "setPosition",
			value: function setPosition(spec) {
				var xPos = xPercentToPx(spec.xPos);

				//if it's animated via frames set it to the middle frame
				if (spec.frames != 1) {
					this.spriteElem.css({
						backgroundPosition: '50%'
					});
				}

				//if it needs to be rotated
				if (spec.rotate) {
					this.spriteElem.css({
						transform: 'rotate(' + washingLine.slopeDegrees + 'deg)'
					});
				}

				var heightPercent = this.spriteElem.height() / 100;
				this.offset = heightPercent * spec.offset;

				//calculate the point on the line
				var point = {
					x: xPos,
					y: washingLine.yPoint(xPos) - this.offset
				};

				this.spriteElem.css({
					position: "absolute",
					top: point.y,
					left: point.x
				});

				//now that the sprite has been positioned show it
				var fadeSpeed = randomInt(0.2, 0.4);
				animateOpacity("#" + this.name, fadeSpeed, 1);

				this.xPos = point.x;
				this.yPos = point.y;
			}

			//Display information on the sheet

		}, {
			key: "sheetContents",
			value: function sheetContents() {
				switch (this.name) {
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

		}, {
			key: "onDrag",
			value: function onDrag(sprite) {
				return function () {
					var change = sprite.xPos - this.pointerX;

					sprite.direction = this.pointerX - (parseFloat(sprite.spriteElem.css("left")) + sprite.width / 2);

					//add wind effect as we drag the sprite
					//need to make the wind time line universal for all sprites
					if (sprite.direction < 0) {
						//moving left
						wind.tweenTo(6);
					} else if (sprite.direction > 0) {
						//moving right
						wind.tweenTo(0);
					}

					//Set a timeout to reset the sprites if we have not moved in a while
					clearTimeout(sprite.timer);
					sprite.timer = setTimeout(function () {
						wind.tweenTo(3);
					}, 100);

					//set the progress of the washing line as we drag the sprite
					var progress = change > 0 ? 0.5 + change / this.pointerX / 2 * this.pointerX / WW : 0.5 + change / (WW - this.pointerX) / 2 * (1 - this.pointerX / WW);
					sprite.timeline.progress(progress);

					//show the next page divs if dragged far enough
					var p = sprite.timeline.progress();
					if (p > sprite.progressMax || p < sprite.progressMin || isNaN(p)) {
						padInfo.html(sprite.nextGroup);
						animateOpacity("#padInfo", 0.2, 1);
					} else {
						animateOpacity("#padInfo", 0.2, 0);
					}
				};
			}

			//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"

		}, {
			key: "onDragStart",
			value: function onDragStart(sprite) {
				return function () {
					//stop the gusts
					clearTimeout(wind.gustsTimer);
					//set the start position to the previous end position
					sprite.startX = sprite.endX;
				};
			}

			//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"

		}, {
			key: "onDragEnd",
			value: function onDragEnd(sprite) {
				return function () {
					console.log(sprite.direction);
					//clear the animation timer
					clearTimeout(sprite.timer);

					var p = sprite.timeline.progress();

					if (p > sprite.progressMax || isNaN(p)) {
						//show the sheet contents for this sprite if relevant
						if (sprite.nextGroup === "Sheet") {
							sprite.sheetContents();
						}
						//moving left
						sprite.timeline.play();
						//set the next group to the start of its timeline then play to the middle
						sprite.nextTimeline.progress(0).tweenTo("middle");
						animateOpacity("#infoLeft", 0.2, 0);
						sprite.animateSecondary();
					} else if (p < sprite.progressMin) {
						//show the sheet contents for this sprite if relevant
						if (sprite.nextGroup === "Sheet") {
							sprite.sheetContents();
						}
						//moving right
						sprite.timeline.reverse();
						//set the next group to the end of its timeline then reverse to the middle
						sprite.nextTimeline.progress(1).tweenTo("middle");
						animateOpacity("#infoRight", 0.2, 0);
						sprite.animateSecondary();
					} else {
						wind.tweenTo(3);
						//restart the gusts
						wind.gusts();
						sprite.endX = parseFloat(sprite.spriteElem.css("left")) + sprite.width / 2;
					}
				};
			}
		}, {
			key: "animateSecondary",
			value: function animateSecondary() {
				if (this.nextGroup === "Performance" || this.group === "Performance") {
					staff.animate();
				} else if (this.nextGroup === "Crafts" || this.group === "Crafts") {
					goose.animate();
				}
			}
		}, {
			key: "makeDraggable",
			value: function makeDraggable() {
				this.direction = 0;
				this.endX = this.xPos;
				this.startX = this.xPos;
				Draggable.create(document.createElement('div'), {
					type: "x",
					onDragStart: this.onDragStart(this),
					onDrag: this.onDrag(this),
					onDragEnd: this.onDragEnd(this),
					trigger: "#" + this.trigger
				});
			}
		}]);

		return LineSprite;
	})(ResponsiveSprite);

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

	var shadowSprite = (function (_ResponsiveSprite2) {
		_inherits(shadowSprite, _ResponsiveSprite2);

		function shadowSprite(spec) {
			_classCallCheck(this, shadowSprite);

			spec.xType = "left";

			var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(shadowSprite).call(this, spec));

			_this4.setPosition(spec);

			_this4.shadowYOffset = spec.shadowYOffset || 5;
			_this4.shadowXOffset = spec.shadowXOffset || 0;
			_this4.shadowWidth = spec.shadowWidth || 100;

			if (spec.shadowImg) {
				_this4.shadow(spec.shadowImg);
			}

			_this4.rotated = false;

			//fade in the sprite after everything has loaded
			window.addEventListener("load", function () {
				var fadeSpeed = randomFloat(0.2, 0.4);
				animateOpacity("#" + _this4.name, fadeSpeed, 1);
			});
			return _this4;
		}

		_createClass(shadowSprite, [{
			key: "shadow",
			value: function shadow(shadowImg) {
				var _this5 = this;

				var shadowMoveAmount = 65;
				var spriteMid = parseFloat(this.spriteElem.css("left")) / WW * 100;
				this.spriteElem.append("<div id='" + this.name + "-shadow' class='shadow'></div>");

				this.shadow = $("#" + this.name + "-shadow");
				this.shadow.addClass("shadow");
				animateOpacity("#" + this.name + "-shadow", 0, 0);

				$document.on("mousemove", function (e) {
					var pageXPercent = e.pageX * 100 / WW;
					var skew = 0;
					if (pageXPercent < spriteMid) {
						skew = shadowMoveAmount / spriteMid * (spriteMid - pageXPercent);
					} else {
						skew = -(shadowMoveAmount / (spriteMid - 100)) * (spriteMid - pageXPercent);
					}
					if (_this5.rotated === true) {
						skew = -skew;
					}
					_this5.shadow.css({
						transform: "skew(" + skew + "deg)"
					});
				});

				this.shadowYOffset = -100 + this.shadowYOffset;

				window.addEventListener("load", function () {
					var width = parseFloat(_this5.spriteElem.css("width"));
					//slightly more accurate calculation of spriteMid now that we know the width
					spriteMid = (parseFloat(_this5.spriteElem.css("left")) + width / 2) / WW * 100;

					_this5.shadow.css({
						background: "url('" + shadowImg + "') 0 0% / contain no-repeat",
						height: _this5.height + "px",
						width: _this5.shadowWidth + "%",
						bottom: _this5.shadowYOffset + "%",
						left: _this5.shadowXOffset + "%",
						transform: "skew(25deg)"
					});

					var fadeSpeed = randomFloat(0.2, 0, 4);
					animateOpacity("#" + _this5.name + "-shadow", fadeSpeed, 0.7);
				});
			}
		}]);

		return shadowSprite;
	})(ResponsiveSprite);

	// * ***********************************************************************
	// *
	// *   	MOVING SHADOW SPRITE CLASS extends SHADOW SPRITE CLASS
	// *
	// *	When the sprite moves it breaks the z-index so the shadow appears on
	// * 	top - create a wrapper element, move this and put the sprite image
	// * 	in a sub element
	// *
	// * ***********************************************************************

	var movingShadowSprite = (function (_shadowSprite) {
		_inherits(movingShadowSprite, _shadowSprite);

		function movingShadowSprite(spec) {
			_classCallCheck(this, movingShadowSprite);

			spec.parentDiv = 'plankSprites';
			spec.xType = "left";
			spec.yType = "top";

			spec.originalName = spec.name;
			spec.name = spec.name + "Wrapper";

			var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(movingShadowSprite).call(this, spec));

			_this6.spriteElem.css({ background: "" });

			_this6.spriteElem.append("<div id='" + spec.originalName + "'></div>");

			$("#" + spec.originalName).css({
				position: 'relative',
				top: '-100%',
				left: 0,
				width: 'inherit',
				height: 'inherit',
				background: "url('" + _this6.spriteImage.src + "') no-repeat 0 0%",
				"background-size": "100%"
			});

			return _this6;
		}

		return movingShadowSprite;
	})(shadowSprite);

	// * ***********************************************************************
	// *
	// *   	GOOSE CLASS extends MOVING SHADOW SPRITE CLASS
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************

	var Goose = (function (_movingShadowSprite) {
		_inherits(Goose, _movingShadowSprite);

		function Goose(spec) {
			_classCallCheck(this, Goose);

			var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Goose).call(this, spec));

			_this7.left = xPercentToPx(spec.xPos);
			_this7.top = yPercentToPx(spec.yPos);

			_this7.buildTimeline();

			_this7.rotated = false;
			return _this7;
		}

		_createClass(Goose, [{
			key: "buildTimeline",
			value: function buildTimeline() {
				this.timeline = new TimelineMax({ paused: true });
				var animSpeed = 5;
				var rotateSpeed = animSpeed / 6;

				var move = TweenMax.to(this.spriteElem, animSpeed, {
					bezier: {
						type: "cubic",
						timeResolution: 6,
						values: [//Curve 1
						{ left: this.left, top: this.top }, //Anchor Point 1
						{ left: this.left - xPercentToPx(6), top: this.top - yPercentToPx(7) }, //Control Point 1
						{ left: this.left - xPercentToPx(12), top: this.top - yPercentToPx(7) }, //CP 2
						{ left: this.left - xPercentToPx(18), top: this.top }, //AP 2
						//Curve 2
						{ left: this.left - xPercentToPx(24), top: this.top - yPercentToPx(7) }, //Control Point 1
						{ left: this.left - xPercentToPx(30), top: this.top - yPercentToPx(7) }, //CP 2
						{ left: this.left - xPercentToPx(36), top: this.top }, //AP 2
						//Curve 3
						{ left: this.left - xPercentToPx(42), top: this.top - yPercentToPx(7) }, //Control Point 1
						{ left: this.left - xPercentToPx(48), top: this.top - yPercentToPx(7) }, //CP 2
						{ left: this.left - xPercentToPx(54), top: this.top }]
					},
					//AP 2
					ease: Linear.easeNone
				});

				//let rotate = TweenMax.to(
				//	this.spriteElem, .6, { rotation: 8, ease: Sine.easeInOut, repeat: 8, yoyo: true });

				this.timeline.add(move, 0);
				//.add(rotate, 0)
			}
		}, {
			key: "animate",
			value: function animate() {
				var _this8 = this;

				if (this.timeline.reversed()) {
					this.rotated = false;
					TweenMax.to(this.spriteElem, 0.6, { rotationY: 0, ease: Quad.easeInOut });
					setTimeout(function () {
						_this8.timeline.play();
					}, 300);
				} else if (this.timeline.progress() === 0) {
					this.rotated = false;
					this.timeline.play();
				} else {
					this.rotated = true;
					TweenMax.to(this.spriteElem, 0.6, { rotationY: 180, ease: Quad.easeInOut });
					setTimeout(function () {
						_this8.timeline.reverse();
					}, 300);
				}
			}
		}]);

		return Goose;
	})(movingShadowSprite);

	// * *******************************************************************
	// *
	// *   	STAFF CLASS extends MOVING SHADOW SPRITE CLASS
	// *
	// *	Define animation functions for staff
	// *
	// *************************************************************************

	var Staff = (function (_movingShadowSprite2) {
		_inherits(Staff, _movingShadowSprite2);

		function Staff(spec) {
			_classCallCheck(this, Staff);

			var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(Staff).call(this, spec));

			_this9.buildTimeline();
			return _this9;
		}

		_createClass(Staff, [{
			key: "buildTimeline",
			value: function buildTimeline() {
				this.timeline = new TimelineMax({ paused: true });
				var animSpeed = 2;

				var move = TweenMax.to(this.spriteElem, animSpeed, {
					bezier: {
						type: "cubic",
						timeResolution: 6,
						values: [{ left: xPercentToPx(60), top: yPercentToPx(115) }, { left: xPercentToPx(55), top: yPercentToPx(105) }, { left: xPercentToPx(55), top: yPercentToPx(95) }, { left: xPercentToPx(60), top: yPercentToPx(85) }]
					},
					ease: Linear.easeNone
				});

				var rotate = TweenMax.fromTo(this.spriteElem, animSpeed, { rotation: -4 }, { rotation: 4, ease: Sine.easeInOut });

				this.timeline.add(move, 0).add(rotate, 0);
			}
		}, {
			key: "animate",
			value: function animate() {
				if (this.timeline.progress() === 0) {
					this.timeline.play();
				} else if (this.timeline.reversed()) {
					this.timeline.play();
				} else {
					this.timeline.reverse();
				}
			}
		}]);

		return Staff;
	})(movingShadowSprite);

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

	var Cloud = (function (_ResponsiveSprite3) {
		_inherits(Cloud, _ResponsiveSprite3);

		function Cloud(spec) {
			_classCallCheck(this, Cloud);

			spec.xType = "left";
			spec.yType = "bottom";
			spec.parentDiv = 'clouds';

			$('#clouds').css({ width: '100%' });

			//fade in the sprite after everything has loaded

			var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(Cloud).call(this, spec));

			window.addEventListener("load", function () {
				var fadeSpeed = randomFloat(0.2, 0.4);
				animateOpacity("#" + _this10.name, fadeSpeed, 0.7);
			});

			_this10.setPosition(spec);

			_this10.yPos = parseFloat(_this10.spriteElem.css("bottom"));
			_this10.animate(spec.animSpeed, spec.name, spec.startPos);
			return _this10;
		}

		_createClass(Cloud, [{
			key: "animate",
			value: function animate(speed, name, startPos) {
				var _this11 = this;

				this.timeline = new TimelineMax();
				var crossScreen = TweenMax.fromTo('#' + name, speed, { left: WW * 6 / 5, y: 0 }, { left: -WW * 1 / 5, repeat: -1, ease: Linear.easeNone, force3D: true });

				this.timeline.add(crossScreen).seek(speed / 100 * startPos); //start each cloud at a random offset

				//move the cloud a random amount on mouse over
				this.spriteElem.off("mousedirection").on("mousedirection", _.debounce(function (e) {
					var wind = function wind(x, y) {
						//set the minimum height of clouds as a % of screen height
						var height = parseFloat(_this11.spriteElem.css("bottom"));
						if (height > WH / 100 * 55) {
							y = Math.abs(y);
						}
						_this11.timeline.pause();
						TweenMax.to('#' + name, 2, {
							x: x,
							y: y,
							ease: Sine.easeOut,
							force3D: true,
							onComplete: function onComplete() {
								_this11.timeline.play();
							}
						});
					};

					if (e.direction === "right") {
						wind(randomFloat(30, 50), randomFloat(-20, 20));
					} else {
						wind(randomFloat(-30, -50), randomFloat(-20, 20));
					}
				}, 2000, true)); //debounce timing
			}
		}]);

		return Cloud;
	})(ResponsiveSprite);

	// * ***********************************************************************
	// *
	// *   	BOAT CLASS extends RESPONSIVE SPRITE CLASS
	// *
	// *************************************************************************

	var Boat = (function (_ResponsiveSprite4) {
		_inherits(Boat, _ResponsiveSprite4);

		function Boat(spec) {
			_classCallCheck(this, Boat);

			var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Boat).call(this, spec));

			_this12.setPosition(spec);
			_this12.clipPath();
			_this12.animate();

			//fade in the sprite after everything has loaded
			window.addEventListener("load", function () {
				var fadeSpeed = randomFloat(0.2, 0.4);
				animateOpacity("#" + _this12.name, fadeSpeed, 1);
			});
			return _this12;
		}

		_createClass(Boat, [{
			key: "clipPath",
			value: function clipPath() {
				var clipPathElem = $("#boatClipPath");
				this.bottom = parseFloat(this.spriteElem.css("bottom"));
				this.right = parseFloat(this.spriteElem.css("right"));
				this.left = xPercentToPx(100) - this.right - this.width;
				var pathBase = yPercentToPx(100.5) - this.bottom;
				var waveHeight = pathBase - this.height / 6;
				var pathTop = pathBase - this.height * 3;
				var pathLeft = this.left - xPercentToPx(4);
				var pathRight = xPercentToPx(104) - this.right;
				var waveWidth = (pathRight - pathLeft) / 10;

				//create 3 waves
				var path = "M" + pathLeft + "," + waveHeight //initial point
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

				clipPathElem.attr({ d: path }); //set the path attribute
			}
		}, {
			key: "animate",
			value: function animate() {
				this.timeline = new TimelineMax();

				var float = TweenMax.to("#boat", 2, {
					y: 1,
					x: 1,
					repeat: -1,
					ease: Sine.easeInOut,
					yoyo: true,
					force3D: false });

				//true or auto breaks clip path
				var rotate = TweenMax.to("#boat", 3, {
					rotation: 4,
					repeat: -1,
					ease: Sine.easeInOut,
					yoyo: true,
					force3D: false });

				//true or auto breaks clip path
				this.timeline.insert(float).insert(rotate);
			}
		}]);

		return Boat;
	})(ResponsiveSprite);

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

	var bookSpec = {
		imageURL: imagesUrl + "book.png",
		frames: 1,
		maxH: 9,
		maxW: 9,
		minH: 6,
		minW: 6,
		offset: 6,
		rotate: true
	};

	var tshirtSpec = {
		frames: 7,
		imageURL: imagesUrl + "tshirt.png",
		maxH: 21,
		maxW: 16,
		minH: 17,
		minW: 14,
		offset: 7,
		rotate: true
	};

	var gourdSpec = {
		imageURL: imagesUrl + "gourd.png",
		frames: 1,
		maxH: 20,
		maxW: 20,
		minH: 18,
		minW: 18,
		offset: 4,
		progressMin: 0.40,
		progressMax: 0.81
	};

	var silkSpec = {
		imageURL: imagesUrl + "silk.png",
		frames: 7,
		link: '#',
		maxH: 55,
		maxW: 40,
		minH: 55,
		minW: 49,
		offset: 0,
		progressMin: 0.48,
		progressMax: 0.89
	};

	var clothingSpec = {
		rotate: true,
		frames: 1,
		maxH: 55,
		maxW: 30,
		minH: 50,
		minW: 25
	};

	// *********************************************************************
	// *SPRITES ON CENTRE SCREEN AT START
	// *********************************************************************
	var book = new LineSprite(_.extend({
		name: "book",
		xPos: 45,
		group: "Centre",
		nextGroup: "Books",
		progressMin: 0.30,
		progressMax: 0.70
	}, bookSpec));

	var tshirt = new LineSprite(_.extend({
		name: "tshirt",
		xPos: 55,
		group: "Centre",
		nextGroup: "Clothing",
		progressMin: 0.36,
		progressMax: 0.75
	}, tshirtSpec));

	var gourd = new LineSprite(_.extend({
		name: "gourd",
		xPos: 70,
		group: "Centre",
		nextGroup: "Crafts"
	}, gourdSpec));

	var silk = new LineSprite(_.extend({
		name: "silk",
		xPos: 66,
		group: "Centre",
		nextGroup: "Performance",
		trigger: "silkTrigger"
	}, silkSpec));

	// *********************************************************************
	// * SHEET SPRITE USED TO DISPLY INFORMATION
	// *********************************************************************

	var sheet = new LineSprite({
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
		minW: 25
	});

	$("#sheetContents").css({
		transform: 'rotate(-' + washingLine.slopeDegrees + 'deg)'
	});

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM LEFT) AFTER CLICKING BOOK
	// *********************************************************************
	var book1 = new LineSprite(_.extend({
		name: "book1",
		group: "Books",
		xPos: 32,
		progressMin: 0.22,
		progressMax: 0.64
	}, bookSpec));

	var book2 = new LineSprite(_.extend({
		name: "book2",
		group: "Books",
		xPos: 47,
		progressMin: 0.30,
		progressMax: 0.70
	}, bookSpec));

	var book3 = new LineSprite(_.extend({
		name: "book3",
		group: "Books",
		xPos: 62,
		progressMin: 0.36,
		progressMax: 0.79
	}, bookSpec));

	var book4 = new LineSprite(_.extend({
		name: "book4",
		group: "Books",
		xPos: 75,
		progressMin: 0.45,
		progressMax: 0.86
	}, bookSpec));

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM RIGHT) AFTER CLICKING TSHIRT
	// *********************************************************************

	var dress = new LineSprite(_.extend({
		name: "dress",
		imageURL: imagesUrl + "dress.png",
		group: "Clothing",
		offset: 3,
		xPos: 35,
		progressMin: 0.28,
		progressMax: 0.70
	}, clothingSpec));

	var scarf = new LineSprite(_.extend({
		name: "scarf",
		imageURL: imagesUrl + "scarf.png",
		group: "Clothing",
		offset: 3,
		xPos: 55,
		progressMin: 0.34,
		progressMax: 0.78
	}, clothingSpec));

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING GOURD
	// *********************************************************************

	var gourd1 = new LineSprite(_.extend({
		name: "gourd1",
		group: "Crafts",
		xPos: 70
	}, gourdSpec));

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING SILK
	// *********************************************************************

	var silk1 = new LineSprite(_.extend({
		name: "silk1",
		xPos: 66,
		group: "Performance",
		trigger: "silk1Trigger"
	}, silkSpec));

	var poi = new LineSprite({
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
		progressMax: 0.75
	});

	// * ***********************************************************************
	// *
	// *	PLANK OBJECTS
	// *
	// *
	// * ***********************************************************************

	//when the mouse hovers over display info
	var linksHover = function linksHover(text) {
		padInfo.html(text);
		animateOpacity("#padInfo", 0.2, 1);
	};
	//when the hover ends hide info
	var linksHoverEnd = function linksHoverEnd() {
		animateOpacity("#padInfo", 0.2, 0);
	};

	var bucket = new shadowSprite({
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
		shadowWidth: 100
	});
	bucket.spriteElem.hover(function () {
		linksHover("Home");
	}, function () {
		linksHoverEnd();
	});
	bucket.spriteElem.click(function () {
		lineTimelines.home();
	});

	var brushholder = new shadowSprite({
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
		shadowWidth: 100
	});
	brushholder.spriteElem.hover(function () {
		linksHover("Biography");
	}, function () {
		linksHoverEnd();
	});
	brushholder.spriteElem.click(function () {
		var p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if (p < sheet.progressMax && p > sheet.progressMin) {
			var sheetDivs = $("#sheet").children("div");
			sheetDivs.fadeOut();
			biography.fadeIn();
		}
		//sheet is offscreen
		else {
				lineTimelines.bringSheetOnscreen();
				biography.show();
			}
	});

	var inkwell = new shadowSprite({
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
		shadowWidth: 65
	});
	inkwell.spriteElem.hover(function () {
		linksHover("Contact");
	}, function () {
		linksHoverEnd();
	});
	inkwell.spriteElem.click(function () {
		var p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if (p < sheet.progressMax && p > sheet.progressMin) {
			var sheetDivs = $("#sheet").children("div");
			sheetDivs.fadeOut();
			contact.fadeIn();
		}
		//sheet is offscreen
		else {
				lineTimelines.bringSheetOnscreen();
				contact.show();
			}
	});

	var pad = new shadowSprite({
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
		shadowWidth: 65
	});

	var goose = new Goose({
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
		shadowWidth: 100
	});

	var staff = new Staff({
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
		shadowWidth: 100
	});

	// * ***********************************************************************
	// *
	// *  CLOUDS AND BOAT
	// *
	// *************************************************************************

	var cloud1 = new Cloud({
		name: 'cloud1',
		imageURL: imagesUrl + "cloud1.png",
		maxH: 15,
		maxW: 25,
		minH: 14,
		minW: 22,
		xPos: 85,
		yPos: 65,
		animSpeed: 65,
		startPos: 24
	});

	var cloud2 = new Cloud({
		name: 'cloud2',
		imageURL: imagesUrl + "cloud2.png",
		maxH: 15,
		maxW: 15,
		minH: 12,
		minW: 12,
		xPos: 59,
		yPos: 90,
		animSpeed: 45,
		startPos: 55
	});

	var cloud3 = new Cloud({
		name: 'cloud3',
		imageURL: imagesUrl + "cloud3.png",
		maxH: 15,
		maxW: 20,
		minH: 12,
		minW: 16,
		xPos: 15,
		yPos: 80,
		animSpeed: 55,
		startPos: 80
	});

	var boat = new Boat({
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
		yPos: 40
	});

	// * ***********************************************************************
	// *
	// *   FINAL SETUP
	// *
	// *************************************************************************
	window.addEventListener("load", function () {
		lineTimelines.centreTL.progress(0.5); //.tweenTo( "middle" );
		wind.timeline.progress(0.5);
		var padWriting = new Handwriting(pad.width * 0.6, pad.height * 0.7);
		padWriting.write("dfsdfsdfsdgsdgsdg");
	}); //end window.load
})();

},{}]},{},[1]);
