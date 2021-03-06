<!DOCTYPE html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		
		<title><?php echo $page->title; ?></title>
		
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>styles/application.css" />
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script  src="<?php echo $config->urls->templates?>scripts/vendor/jquery.1.11.3.min.js"><\/script>');</script>
        
		<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>
		<script>(typeof _ === 'function') || document.write('<script src="<?php echo $config->urls->templates?>scripts/vendor/lodash.js"><\/script>');</script>
		
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js"></script>
		<script>(typeof Tweenlite === 'function') || document.write('<script  src="<?php echo $config->urls->templates?>scripts/vendor/TweenMax.min.js"><\/script>');</script>

		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js"></script>
		<script>(typeof Draggable === 'function') || document.write('<script  src="<?php echo $config->urls->templates?>scripts/vendor/Draggable.min.js"><\/script>');</script>

		<script src="<?php echo $config->urls->templates?>scripts/vendor/jquery.photobox.js"></script>
		<script defer src="<?php echo $config->urls->templates?>scripts/frontPage.js"></script>
