(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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
var infoBottomText = document.getElementById("infoBottomText");

var sheetInfo = document.getElementById("sheet");

//prevent touch scrolling
document.body.addEventListener('touchmove', function (e) {
	e.preventDefault();
});

//refresh page on browser resize
window.onresize = function () {
	if (window.RT) {
		clearTimeout(window.RT);
	}

	window.RT = setTimeout(function () {
		window.location.href = window.location.href;
		location.reload(false); /* false to get page from cache */
	}, 180);
};

},{}]},{},[1]);
