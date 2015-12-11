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

	var padWriting = undefined;

	var WW = $(window).outerWidth(true);
	var WH = $(window).outerHeight(true);
	var $window = $(window);
	var $body = $("body");
	var $document = $(document);

	//sheet info elements
	var sheetElem = $("#sheet");
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

	var xPxToPercent = function xPxToPercent(x) {
		return 100 * x / WW;
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
	// *   GET BACKGROUND IMAGE BASED ON PAGE WIDTH
	// *
	// *************************************************************************
	(function () {
		$("#background").hide();
		$.get(rootUrl, { background: "y", width: WW, height: WH }, function (data) {
			$("#background").css({
				background: "url(" + data + ") 0 no-repeat fixed"
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

			this.txt = "";
		}

		_createClass(Handwriting, [{
			key: "write",
			value: function write(text) {
				//if we are trying to write a different word change the writing
				//otherwise do nothing
				if (text != this.txt) {
					this.txt = text;
					this.speed = 10;
					// start position for x and iterator
					this.x = 0, this.i = 0;
					// dash-length for off-range
					this.dashLen = 120;
					// we'll update this, initialize
					this.dashOffset = this.dashLen;
					this.erase();

					this.loop();
				}
			}
		}, {
			key: "loop",
			value: function loop() {
				//test for length not working properly below, don't continue if
				//we have reached the end of the word
				if (this.i > this.txt.length - 1) {
					return;
				}
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

			//if there is writing on the pad, erase it.

		}, {
			key: "erase",
			value: function erase() {
				this.ctx.clearRect(0, 0, this.width, this.height);
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

			this.lineElem = $('#' + lineElem);

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
				top: p1.y + "%"
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
				onStart: this.onStart,
				onUpdate: this.onUpdate
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
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.getChildren()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var child = _step.value;

						child.target.hide();
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
			}
		}, {
			key: "sheetComplete",
			value: function sheetComplete() {
				wind.tweenTo(3);
				sheetElem.empty();
				sheetElem.hide();
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
		}, {
			key: "onUpdate",
			value: function onUpdate() {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.getChildren()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var child = _step2.value;

						//if the object is offscreen to the left, hide it
						if (parseInt(child.target[0].style.left, 10) + child.target[0].clientWidth < 0) {
							child.target[0].style.display = "none";
						}
						//if the object is offscreen to the right, hide it
						else if (parseInt(child.target[0].style.left, 10) > WW) {
								child.target[0].style.display = "none";
							}
							//if the object is onscreen, show it
							else {
									child.target[0].style.display = "block";
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
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.timelines[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var timeline = _step3.value;

						var progress = timeline.progress();
						if (progress != 1 && progress != 0) {
							timeline.play();
						}
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				this.sheetTL.tweenTo("middle");
			}
		}, {
			key: "home",
			value: function home() {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = this.timelines[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var timeline = _step4.value;

						var progress = timeline.progress();
						if (progress != 1 && progress != 0) {
							timeline.reversed(false).play();
						}
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				this.centreTL.progress(0).tweenTo("middle");
				//bring goose and staff offscreen
				if (staff.timeline.progress() != 0) {
					staff.animate();
				}
				if (goose.timeline.progress() != 0) {
					goose.animate();
				}
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

			//if number of frames not specified assume 1 frame
			if (!spec.frames) {
				spec.frames = 1;
			}
			this.frames = spec.frames;

			//if no parentDiv supplied add sprite to body
			if (spec.parentDiv == null) {
				spec.parentDiv = 'body';
			}

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

		_createClass(ResponsiveSprite, [{
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
			key: "setBackground",
			value: function setBackground(spec) {
				var _this2 = this;

				//get an resized version of the image that matches the calcualted image width
				//images must have a description set in Processwire that matches the sprites name
				$.get(rootUrl, { image: this.name, width: this.width }, function (data) {
					_this2.spriteImage = _this2.selectImage(data, function (w, h) {
						_this2.spriteElem.css({
							background: "url('" + data + "') no-repeat 0 0%",
							"background-size": "100%",
							height: h / _this2.frames + "px",
							width: w + "px"
						});
						_this2.height = h / _this2.frames;

						_this2.width = w;

						_this2.setPosition(spec);
						_this2.spriteElem.fadeIn(2000);

						if (typeof _this2.afterImageLoad === "function") {
							_this2.afterImageLoad(spec);
						}
					});
				});
			}
		}, {
			key: "setPosition",
			value: function setPosition(spec) {
				if (!spec.type) {
					spec.type = "absolute";
				}
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

			wind.addTween(_this3);
			return _this3;
		}

		//anything that needs to be done after the ajax image load goes here

		_createClass(LineSprite, [{
			key: "afterImageLoad",
			value: function afterImageLoad() {
				this.makeDraggable();
			}
		}, {
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

				var heightPercent = this.height / 100;
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

				this.xPos = point.x;
				this.yPos = point.y;

				lineTimelines.addTween(this);
			}

			//note: "this" refers to the draggable event here, pass sprites "this" as "sprite"

		}, {
			key: "onDrag",
			value: function onDrag(sprite) {
				return function () {
					//difference between start and current point in drag
					var change = sprite.xPos - this.pointerX;

					sprite.direction = this.pointerX - sprite.mid;

					//current middle of the sprite
					sprite.mid = parseInt(sprite.spriteElem[0].style.left, 10) + sprite.width / 2;

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
					var progress = change > 0 ? 0.5 + change / sprite.mid / 2 * sprite.mid / WW : 0.5 + change / (WW - sprite.mid) / 2 * (1 - sprite.mid / WW);
					sprite.timeline.progress(progress);

					//show the next page divs if dragged far enough
					var p = sprite.timeline.progress();
					if (p > sprite.progressMax || isNaN(p)) {
						animateOpacity("#overlayLeft", 0.4, 1);
						if (sprite.nextGroup != "Sheet") {
							padWriting.write(sprite.nextGroup);
						} else {
							padWriting.write(sprite.name);
						}
					} else if (p < sprite.progressMin) {
						animateOpacity("#overlayRight", 0.4, 1);
						if (sprite.nextGroup != "Sheet") {
							padWriting.write(sprite.nextGroup);
						} else {
							padWriting.write(sprite.name);
						}
					} else {
						animateOpacity("#overlayLeft", 0.4, 0);
						animateOpacity("#overlayRight", 0.4, 0);
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
					animateOpacity("#overlayLeft", 0.4, 0);
					animateOpacity("#overlayRight", 0.4, 0);
					//clear the animation timer
					clearTimeout(sprite.timer);

					var p = sprite.timeline.progress();

					if (p > sprite.progressMax || isNaN(p)) {
						//show the sheet contents for this sprite if relevant
						if (sprite.nextGroup === "Sheet") {
							sheet.sheetContents(sprite.name);
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
							sheet.sheetContents(sprite.name);
						}
						//moving right
						sprite.timeline.reverse();
						//set the next group to the end of its timeline then reverse to the middle
						sprite.nextTimeline.progress(1).tweenTo("middle");
						//show the objects
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = sprite.nextTimeline.getChildren()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var child = _step5.value;

								child.target.show();
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}

						animateOpacity("#infoRight", 0.2, 0);
						sprite.animateSecondary();
					} else {
						wind.tweenTo(3);
						//restart the gusts
						wind.gusts();
						sprite.endX = parseFloat(sprite.spriteElem[0].style.left) + sprite.width / 2;
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
				this.xPos = this.xPos + this.width / 2;
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
	// *   	SHEET CLASS extends LINE SPRITE CLASS
	// *
	// *************************************************************************

	var Sheet = (function (_LineSprite) {
		_inherits(Sheet, _LineSprite);

		function Sheet(spec) {
			_classCallCheck(this, Sheet);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Sheet).call(this, spec));
		}

		//Display information on the sheet

		_createClass(Sheet, [{
			key: "sheetContents",
			value: function sheetContents(name) {
				switch (name) {
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
					case "contact":
						this.loadPage("contact");
						break;
					case "biography":
						this.loadPage("biography");
						break;
				}
			}

			//empty the sheet then load a gallery with ajax

		}, {
			key: "loadPage",
			value: function loadPage(page) {
				$(".sheetContents").fadeOut(500);
				//clear any previous galleries
				sheetElem.empty();

				$.get(rootUrl, { name: page }, function (data) {
					sheetElem.append(data);
					$(".sheetContents").fadeIn(500);
				});
			}

			//empty the sheet then load a gallery with ajax

		}, {
			key: "loadGallery",
			value: function loadGallery(page) {
				//clear any previous galleries
				sheetElem.empty();

				$.get(rootUrl, {
					name: page,
					width: parseInt(WW, 10),
					thumbWidth: parseInt(sheetElem.width() / 7, 10)
				}, function (data) {
					sheetElem.append(data);
					$("#sheetGallery").photobox("a", { time: 0 });
				});
			}
		}]);

		return Sheet;
	})(LineSprite);

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

	var ShadowSprite = (function (_ResponsiveSprite2) {
		_inherits(ShadowSprite, _ResponsiveSprite2);

		function ShadowSprite(spec) {
			_classCallCheck(this, ShadowSprite);

			spec.xType = "left";

			var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ShadowSprite).call(this, spec));

			_this5.shadowYOffset = spec.shadowYOffset || 5;
			_this5.shadowXOffset = spec.shadowXOffset || 0;
			_this5.shadowWidth = spec.shadowWidth || 100;

			_this5.rotated = false;

			return _this5;
		}

		_createClass(ShadowSprite, [{
			key: "afterImageLoad",
			value: function afterImageLoad(spec) {
				if (spec.shadowImg) {
					this.shadow(spec.shadowImg);
				}
			}
		}, {
			key: "shadow",
			value: function shadow(shadowImg) {
				var _this6 = this;

				var spriteMid = parseFloat(this.spriteElem[0].style.left + this.width / 2) / WW * 100;
				this.spriteElem.append("<div id='" + this.name + "Shadow' class='shadow'></div>");

				var shadowTL = new TimelineMax({ paused: true });
				var shadowTween = TweenMax.fromTo("#" + this.name + "Shadow", 2, { skewX: -60 }, { skewX: 60, ease: Linear.easeNone });

				shadowTL.add(shadowTween);

				this.shadow = $("#" + this.name + "Shadow");

				$document.on("mousemove", function (e) {
					spriteMid = parseFloat(_this6.spriteElem[0].style.left + _this6.width / 2) / WW * 100;
					var pageXPercent = e.pageX * 100 / WW;
					var skew = 0;
					if (pageXPercent < spriteMid) {
						if (_this6.rotated) {
							skew = 0.5 - 0.5 / (spriteMid - 100) * (spriteMid - pageXPercent);
						} else {
							skew = 0.5 + 0.5 / spriteMid * (spriteMid - pageXPercent);
						}
					} else {
						if (_this6.rotated) {
							skew = 0.5 + 0.5 / spriteMid * (spriteMid - pageXPercent);
						} else {
							skew = 0.5 - 0.5 / (spriteMid - 100) * (spriteMid - pageXPercent);
						}
					}
					shadowTL.progress(skew);
				});
				this.shadowYOffset = -100 + this.shadowYOffset;

				$.get(rootUrl, { image: this.name + "Shadow", width: this.width }, function (data) {
					_this6.shadow.css({
						background: "url('" + data + "') 0 0% / contain no-repeat",
						width: _this6.shadowWidth + "%",
						bottom: _this6.shadowYOffset + "%",
						left: _this6.shadowXOffset + "%"
					});
					animateOpacity("#" + _this6.name + "Shadow", 5, 0.7);
				});
			}
		}]);

		return ShadowSprite;
	})(ResponsiveSprite);

	// * ***********************************************************************
	// *
	// *   	Pad CLASS extends SHADOW SPRITE CLASS
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************

	var Pad = (function (_ShadowSprite) {
		_inherits(Pad, _ShadowSprite);

		function Pad(spec) {
			_classCallCheck(this, Pad);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Pad).call(this, spec));
		}

		_createClass(Pad, [{
			key: "afterImageLoad",
			value: function afterImageLoad() {
				padWriting = new Handwriting(this.width * 0.6, this.height * 0.7);
			}
		}]);

		return Pad;
	})(ShadowSprite);
	// * ***********************************************************************
	// *
	// *   	GOOSE CLASS extends SHADOW SPRITE CLASS
	// *
	// *	Define animation functions for goose
	// *
	// *************************************************************************

	var Goose = (function (_ShadowSprite2) {
		_inherits(Goose, _ShadowSprite2);

		function Goose(spec) {
			_classCallCheck(this, Goose);

			var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Goose).call(this, spec));

			_this8.left = xPercentToPx(spec.xPos);
			_this8.top = yPercentToPx(spec.yPos);

			_this8.buildTimeline();

			_this8.rotated = false;
			return _this8;
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
				var _this9 = this;

				if (this.timeline.reversed()) {
					this.rotated = false;
					TweenMax.to(this.spriteElem, 0.6, { rotationY: 0, ease: Quad.easeInOut });
					setTimeout(function () {
						_this9.timeline.play();
					}, 300);
				} else if (this.timeline.progress() === 0) {
					this.rotated = false;
					this.timeline.play();
				} else {
					this.rotated = true;
					TweenMax.to(this.spriteElem, 0.6, { rotationY: 180, ease: Quad.easeInOut });
					setTimeout(function () {
						_this9.timeline.reverse();
					}, 300);
				}
			}
		}]);

		return Goose;
	})(ShadowSprite);

	// * *******************************************************************
	// *
	// *   	STAFF CLASS extends SHADOW SPRITE CLASS
	// *
	// *	Define animation functions for staff
	// *
	// *************************************************************************

	var Staff = (function (_ShadowSprite3) {
		_inherits(Staff, _ShadowSprite3);

		function Staff(spec) {
			_classCallCheck(this, Staff);

			var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(Staff).call(this, spec));

			_this10.buildTimeline();
			return _this10;
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

				//let rotate = TweenMax.fromTo(this.spriteElem, animSpeed,
				//	{rotation: -4},
				//	{rotation: 4, ease: Sine.easeInOut,}
				//);

				this.timeline.add(move, 0); //.add(rotate, 0);
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
	})(ShadowSprite);

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

			var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(Cloud).call(this, spec));

			_this11.yPos = parseFloat(_this11.spriteElem.css("bottom"));
			_this11.animate(spec.animSpeed, spec.name, spec.startPos);
			return _this11;
		}

		_createClass(Cloud, [{
			key: "animate",
			value: function animate(speed, name, startPos) {
				var _this12 = this;

				this.timeline = new TimelineMax();
				var crossScreen = TweenMax.fromTo('#' + name, speed, { left: WW * 6 / 5, y: 0 }, { left: -WW * 1 / 5, repeat: -1, ease: Linear.easeNone, force3D: true });

				this.timeline.add(crossScreen).seek(speed / 100 * startPos); //start each cloud at a random offset

				//move the cloud a random amount on mouse over
				this.spriteElem.off("mousedirection").on("mousedirection", _.debounce(function (e) {
					var vertical = randomInt(0, 1) ? randomInt(20, 30) : randomInt(-20, -30);
					var horizontal = randomInt(30, 50);

					var wind = function wind(x, y) {
						//set the minimum height of clouds as a % of screen height
						var height = parseFloat(_this12.spriteElem.css("bottom"));
						if (height > WH / 100 * 55) {
							y = Math.abs(y);
						}
						_this12.timeline.pause();
						TweenMax.to('#' + name, 2, {
							x: x,
							y: y,
							ease: Sine.easeOut,
							force3D: true,
							onComplete: function onComplete() {
								_this12.timeline.play();
							}
						});
					};

					if (e.direction === "right") {
						wind(horizontal, vertical);
					} else {
						wind(-horizontal, vertical);
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

			var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(Boat).call(this, spec));

			_this13.animate();
			return _this13;
		}

		//anything that needs to be done after the ajax image load goes here

		_createClass(Boat, [{
			key: "afterImageLoad",
			value: function afterImageLoad() {
				this.clipPath();
			}
		}, {
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
		maxW: 6,
		offset: 6,
		rotate: true
	};

	var tshirtSpec = {
		frames: 7,
		imageURL: imagesUrl + "tshirt.png",
		maxW: 15,
		offset: 7,
		rotate: true
	};

	var gourdSpec = {
		imageURL: imagesUrl + "gourd.png",
		frames: 1,
		maxW: 3.5,
		offset: 4,
		progressMin: 0.40,
		progressMax: 0.81
	};

	var silkSpec = {
		imageURL: imagesUrl + "silk.png",
		frames: 7,
		link: '#',
		maxW: 33,
		offset: 0,
		progressMin: 0.48,
		progressMax: 0.89
	};

	var clothingSpec = {
		rotate: true,
		frames: 1,
		maxW: 19
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
	var sheetSpec = {
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
		maxW: 53
	};
	var sheet = new Sheet(sheetSpec);

	$("#sheetContents").css({
		transform: 'rotate(-' + washingLine.slopeDegrees + 'deg)'
	});

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM LEFT) AFTER CLICKING BOOK
	// *********************************************************************
	var book1Spec = _.extend({
		name: "book1",
		group: "Books",
		xPos: 32,
		progressMin: 0.22,
		progressMax: 0.64
	}, bookSpec);
	var book1 = new LineSprite(book1Spec);

	var book2Spec = _.extend({
		name: "book2",
		group: "Books",
		xPos: 47,
		progressMin: 0.30,
		progressMax: 0.70
	}, bookSpec);
	var book2 = new LineSprite(book2Spec);

	var book3Spec = _.extend({
		name: "book3",
		group: "Books",
		xPos: 62,
		progressMin: 0.36,
		progressMax: 0.79
	}, bookSpec);
	var book3 = new LineSprite(book3Spec);

	var book4Spec = _.extend({
		name: "book4",
		group: "Books",
		xPos: 75,
		progressMin: 0.45,
		progressMax: 0.86
	}, bookSpec);
	var book4 = new LineSprite(book4Spec);

	// *********************************************************************
	// *SPRITES THAT ANIMATE ONTO SCREEN (FROM RIGHT) AFTER CLICKING TSHIRT
	// *********************************************************************
	var dressSpec = _.extend({
		name: "dress",
		imageURL: imagesUrl + "dress.png",
		group: "Clothing",
		offset: 3,
		xPos: 35,
		progressMin: 0.28,
		progressMax: 0.70
	}, clothingSpec);
	var dress = new LineSprite(dressSpec);

	var scarfSpec = _.extend({
		name: "scarf",
		imageURL: imagesUrl + "scarf.png",
		group: "Clothing",
		offset: 3,
		xPos: 55,
		progressMin: 0.34,
		progressMax: 0.78
	}, clothingSpec);
	var scarf = new LineSprite(scarfSpec);

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING GOURD
	// *********************************************************************
	var gourd1Spec = _.extend({
		name: "gourd1",
		group: "Crafts",
		xPos: 70
	}, gourdSpec);
	var gourd1 = new LineSprite(gourd1Spec);

	// *********************************************************************
	// *SPRITE THAT ANIMATEs ONTO SCREEN (FROM LEFT) AFTER CLICKING SILK
	// *********************************************************************
	var silk1Spec = _.extend({
		name: "silk1",
		xPos: 66,
		group: "Performance",
		trigger: "silk1Trigger"
	}, silkSpec);
	var silk1 = new LineSprite(silk1Spec);

	var poiSpec = {
		frames: 7,
		name: "poi",
		imageURL: imagesUrl + "poi.png",
		maxW: 15.5,
		offset: 3,
		xPos: 45,
		group: "Performance",
		progressMin: 0.36,
		progressMax: 0.75
	};
	var poi = new LineSprite(poiSpec);

	// * ***********************************************************************
	// *
	// *	PLANK OBJECTS
	// *
	// *
	// * ***********************************************************************

	var bucket = new ShadowSprite({
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
		shadowWidth: 100
	});
	bucket.spriteElem.hover(function () {
		padWriting.write("Home");
	});
	bucket.spriteElem.click(function () {
		lineTimelines.home();
	});

	var brushholder = new ShadowSprite({
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
		shadowWidth: 100
	});
	brushholder.spriteElem.hover(function () {
		padWriting.write("Biography");
	});
	brushholder.spriteElem.click(function () {
		var p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if (p < sheet.progressMax && p > sheet.progressMin) {
			sheet.sheetContents("biography");
		}
		//sheet is offscreen
		else {
				lineTimelines.bringSheetOnscreen();
				sheet.sheetContents("biography");
			}
	});

	var inkwell = new ShadowSprite({
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
		shadowWidth: 90
	});
	inkwell.spriteElem.hover(function () {
		padWriting.write("Contact");
	});
	inkwell.spriteElem.click(function () {
		var p = lineTimelines.sheetTL.progress();
		//sheet is onscreen
		if (p < sheet.progressMax && p > sheet.progressMin) {
			sheet.sheetContents("contact");
		}
		//sheet is offscreen
		else {
				lineTimelines.bringSheetOnscreen();
				sheet.sheetContents("contact");
			}
	});

	var pad = new Pad({
		parentDiv: 'plankSprites',
		name: "pad",
		imageURL: imagesUrl + "pad.png",
		maxW: 20,
		xPos: 27,
		yPos: 5,
		yType: "bottom",
		shadowYOffset: 5,
		shadowXOffset: 10,
		shadowWidth: 65
	});

	var gooseSpec = {
		parentDiv: 'gooseWrapper',
		name: "goose",
		imageURL: imagesUrl + "goose.png",
		maxW: 18,
		xPos: 110,
		yPos: 70,
		shadowImg: imagesUrl + "goose-shadow.png",
		shadowYOffset: 10,
		shadowXOffset: 0,
		shadowWidth: 100
	};
	var goose = new Goose(gooseSpec);;

	var staffSpec = {
		parentDiv: 'staffWrapper',
		name: "staff",
		imageURL: imagesUrl + "staff.png",
		maxW: 40,
		xPos: 120,
		yPos: 120,
		shadowImg: imagesUrl + "staff-shadow.png",
		shadowYOffset: 70,
		shadowXOffset: 3,
		shadowWidth: 100
	};
	var staff = new Staff(staffSpec);

	// * ***********************************************************************
	// *
	// *  CLOUDS AND BOAT
	// *
	// *************************************************************************

	var cloud1 = new Cloud({
		name: 'cloud1',
		imageURL: imagesUrl + "cloud1.png",
		maxW: 30,
		xPos: 85,
		yPos: 65,
		animSpeed: 65,
		startPos: 24
	});

	var cloud2 = new Cloud({
		name: 'cloud2',
		imageURL: imagesUrl + "cloud2.png",
		maxW: 20,
		xPos: 59,
		yPos: 90,
		animSpeed: 45,
		startPos: 55
	});

	var cloud3 = new Cloud({
		name: 'cloud3',
		imageURL: imagesUrl + "cloud3.png",
		maxW: 20,
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
		maxW: 13,
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
	window.onload = function (e) {
		setTimeout(function () {
			lineTimelines.centreTL.tweenTo("middle");
		}, 3000);

		washingLine.lineElem.fadeIn(3000);
	};
})();

},{}]},{},[1]);
