(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var ResponsiveSprite = exports.ResponsiveSprite = (function () {
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
			var _this = this;

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
				_this.imgH = h;
				_this.imgW = w;
				//After the image has loaded, initialize the width based on maxH
				_this.width = _this.imgW / (_this.imgH / spec.frames / _this.height);

				_this.calcSize(spec); //now calculate the sprite's size and apply it to the spriteElem
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

},{}]},{},[1]);
