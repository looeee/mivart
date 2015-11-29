/******************************************************************
 * BUGS
 * -- washing line movement anims for sprites and gourd need work
 * -- boat is in front of goose and silks 
 * 
 * TODO
 * -- change classes to IDs 
 * -- change complex if/else to switch
 * -- fix floorgourdPath
 * -- sprites too small on mobile
 * -- lots of testing on other browsers
 *    --FIREFOX PROBLEMS
 *      --clippath not working - show 0x0 for size
 *    --IE PROBLEMS
 *      --boat clip path doesn't work - possible solution: http://stackoverflow.com/questions/21904672/internet-explorer-and-clip-path
 *      --wind anims on WL sprites not working/working intermittently
 *      
 * 
 * Minerva
 * --icons for books
 * --designs for pages
 * --finished sprites
 * --boat
 * 
 * ****************************************************************/



/******************************************************************
 * 
 * SET UP GLOBAL VARIABLES
 * 
 * ****************************************************************/

//washing line angle
var wlY1 = 10,
wlY2 = 18,

//Speed to animate along the line
wlAnimationSpeed = 4000,

//position of objects on washing line
bookX = 45,
tshirtX = 55,
gourdRotation = 0,
gourdX = 70,
silkX = 66,
bookOffset = 0.3,
tshirtOffset = 0.7,
gourdOffset = 0.5,
silkOffset = 0.5,

book1X = 32,
book2X = 47,
book3X = 62,
book4X = 80,

dressX = 35,
scarfX = 55,
dressOffset = 2,
scarfOffset = 1.5,

gourd1X = 35,

poiX = 45,
poiOffset = 0.3,
silk1X = 65,

gooseShadowY = 0;

//overlay the whole screen with a transparent unclickable div - hide when not needed,
//show it to prevent clicks when animating
var blockClicks = $('.blockingDiv');
blockClicks.click(function() {
  return false;
});

/* ************************************************************************

 DOCUMENT READY

************************************************************************** */
$(document).ready(function() {
  //initialize the mouse direction plugin
  $.mousedirection();

  
  //set up the boat and boat animation
  initBoatAndClouds();
  
  //Set up all SVG animation paths
  initAnimPaths();
  
  //Set up all sprites on the washing line and wind animations
  initWashingLineSprites();
  
  //set up all sprites on the planks and their shadows
  initPlankSprites();

  //add the (initially hidden) backarrow
  backarrow = addBackarrow();
  
  //set up all the animations that occur when an object on the line is clicked
  initWashingLineAnimations();
});


/* ************************************************************************

 INITIALIZATION FUNCTIONS

************************************************************************** */
function initWashingLineSprites(){
  //Objects on the line when the page first loads
  book = addWLSprite("book", bookX, bookOffset, 9, 9, 1, "#", 1, "centre");
  
  tshirt = addWLSprite("tshirt", tshirtX, tshirtOffset, 21, 16, 7, "#", 1, "centre");
  addWindAnimToWLSprite(tshirt);
  
  gourd = addWLSprite("gourd", gourdX, gourdOffset, 25, 20, 1, "#", 0, "centre");
  gourdRotation = 0;
  addWindToGourd(gourd, gourdRotation);
  
  silk = addSilk('silk', silkX, '#', 'centre');
  
  //Objects on the line after clicking book
  book1 = addWLSprite("book1", book1X, bookOffset, 9, 9, 1, "/books/book1", 1, "left");
  book2 = addWLSprite("book2", book2X, bookOffset, 9, 9, 1, "/books/book2", 1, "left");
  book3 = addWLSprite("book3", book3X, bookOffset, 9, 9, 1, "/books/book3", 1, "left");
  book4 = addWLSprite("book4", book4X, bookOffset, 9, 9, 1, "/books/book4", 1, "left");

  //Objects on the line after clicking tshirt
  dress = addWLSprite("dress", dressX, dressOffset, 55, 30, 1, "/clothing", 1, "right");
  scarf = addWLSprite("scarf", scarfX, scarfOffset, 60, 30, 1, "/clothing", 1, "right");

  //Objects on the line after clicking gourd
  gourd1 = addWLSprite("gourd1", gourd1X, gourdOffset, 25, 20, 1, "/crafts", 0, "left");
  gourd1Rotation = 0;
  addWindToGourd(gourd1, gourd1Rotation);
  
  //Objects on the line after clicking silk
  poi = addWLSprite("poi", poiX, poiOffset, 25, 20, 7, "/performance", 0, "right");
  addWindAnimToWLSprite(poi);
  
  silk1 = addSilk('silk1', silk1X, '/performance', 'right');
}

function initPlankSprites(){
  //Objects on planks  
  bucket = addPlankSprite("bucket", imagesUrl + "bucket.png", 7, 12, 18, 18, 1, 1, '/');
  addShadowToSprite('bucket', imagesUrl + "bucket-shadow.png");
  
  brushholder = addPlankSprite("brushholder", imagesUrl + "brushholder.png", 14, 12, 18, 22, 1, 1, "/biography");
  addShadowToSprite('brushholder', imagesUrl + "brushholder-shadow.png");
  
  inkwell = addPlankSprite("inkwell", imagesUrl + "inkwell.png", 21, 12, 22, 22, 1, 1, "/contact");
  addShadowToSprite('inkwell', imagesUrl + "inkwell-shadow.png");

  goose = addSpriteToPath(goosePath, "goose", $('.plank-sprites'), 25, 25, 1);
  addShadowToGoose();
  
  floorgourd = addSpriteToPath(floorgourdPath, "floorgourd", $('.plank-sprites'), 15, 15, 1);
  addShadowToSprite('floorgourd', imagesUrl + "floorgourd-shadow.png");
  
  staff = addSpriteToPath(staffPath, "staff", $('.plank-sprites'), 40, 50, 1);
  staff.css({ rotateZ: "-15deg"});
  addShadowToSprite('staff', imagesUrl + "staff-shadow.png");
}

//Add the SVG backarrow, with stroke-offset set to the length of the path so that it is invisible
function addBackarrow() {
  var backarrow = $("#backarrow");
  //Set the size and position based on window size
  var setTransformString = function() {
    var transform = "scale(1, 1) translate(" + xPercent(93) + ",5)";
    if (windowWidth() > 800) {
      transform = "scale(2, 2) translate(" + xPercent(47) + ",5)";
    }
    return transform;
  },


  len = backarrow[0].getTotalLength();

  backarrow.attr({
    transform: setTransformString(),
    "stroke-dasharray": len + " " + len, //create a dasharray the length of the total path
    "stroke-dashoffset": len //the offset the array so that the path is invisible
  });

  $(window).resize(function() {
    backarrow.attr({
      transform: setTransformString()
    });
  });
  
  return backarrow;
}

//All animation paths are initialised here 
function initAnimPaths() {
  //Washing Line
  wlPath = $('#wlPath');

  goosePath = $('#goosePath');
  
  floorgourdPath = $('#floorgourdPath');
  
  staffPath = $('#staffPath');

  var setPaths = function() {
    wlPath.attr({  d: "M-" + windowWidth() + " " + washingLineYPoint(-100) + " L" + windowWidth() * 2 + " " + washingLineYPoint(200)  });
    
    goosePath.attr({
      d: "M" + xPercent(106) + "," + yPercent(65) //initial point
        + "Q" + xPercent(99) + ", " + yPercent(40) + " " //control point
        + xPercent(92) + ", " + yPercent(65) + " " //final point
        + "Q" + xPercent(85) + ", " + yPercent(40) + " " //next curve control point
        + xPercent(78) + ", " + yPercent(65) + " " //next curve final point
        + "Q" + xPercent(71) + ", " + yPercent(40) + " " + xPercent(64) + ", " + yPercent(65) + " " + "Q" + xPercent(56) + ", " + yPercent(40) + " " + xPercent(49) + ", " + yPercent(65)
    });
    floorgourdPath.attr({
      d: "M" + xPercent(55) + "," + yPercent(105) + "Q" + xPercent(50) + ", " + yPercent(95) + " " + xPercent(55) + ", " + yPercent(85)
    });
    staffPath.attr({
      d: "M" + xPercent(55) + "," + yPercent(105) + "Q" + xPercent(50) + ", " + yPercent(95) + " " + xPercent(55) + ", " + yPercent(85)
    });
  };

  setPaths();
  
  $(window).resize(function() {
    setPaths();
  });
}

//Add a shadow that will move (skew) based on the mouse position (left/right only)
//shadows require a CSS class specific to the object setting background-size and width and left position
function addShadowToSprite(spriteName, shadowImg) {
  var sprite = $('.' + spriteName);

  sprite.append('<div class="' + spriteName + '-shadow shadow"></div>');

  $('.' + spriteName + '-shadow').css({
    background: 'url("' + shadowImg + '") 0 0% / cover no-repeat ',
  });

  var spriteShadow = $('.' + spriteName + '-shadow');

  //Have to get size of parent div in here otherwise height is returned as 0
  $(window).load(function() {
    var spriteHeight = $('.bucket').height();
    $('.' + spriteName + '-shadow').css({
      height: spriteHeight + 'px',
    });
    
    //The above doesn't work in IE so
     if($('.' + spriteName + '-shadow').css('height') == '0px' ){
       $('.' + spriteName + '-shadow').css({
      height: '100%',
    });
     }
  });

  $(window).resize(function() {
    var spriteHeight = $('.bucket').height();
    $('.' + spriteName + '-shadow').css({
      height: spriteHeight + 'px',
    });
  });

  addSkewToShadow(spriteShadow, sprite);
}

function addSkewToShadow(spriteShadow, sprite, direction){
  var shadowMovAmount = 65;
  
  if(direction == "reverse"){
    shadowMovAmount = -shadowMovAmount;
  }
  
  $(document).on('mousemove', function(e) {
    //var maxSkew = 65;
    //Actually the left point of the sprite; using the mid would require putting this all
    //in a $(window).load(function () call
    var spriteMid = xPxToPercent(parseInt(sprite.css('left'), 10));

    var pageXPcnt = xPxToPercent(e.pageX);
    var skew = 0;
    if (pageXPcnt < spriteMid) {
      skew = (shadowMovAmount / spriteMid) * (spriteMid - pageXPcnt);
    }
    else if (e.pageX > spriteMid) {
      skew = -(shadowMovAmount / (spriteMid - 100)) * (spriteMid - pageXPcnt);
    }
    spriteShadow.css({
      transform: 'skew(' + skew + 'deg)'
    });
  });
}

//Set the goose shadow up so that it can be animated as the goose jumps up and down
function addShadowToGoose() {
  addShadowToSprite('goose', imagesUrl + "goose-shadow.png");

  var shadowYpos = function() {
    var gooseH = $('.goose').height();
    var gooseShadowYOffset = (gooseH / 100) * 15;
    gooseShadowY = -gooseH + gooseShadowYOffset;
    $('.goose-shadow').css({
      position: 'relative',
      'bottom': gooseShadowY
    });
  };
  //add the shadow to the bottom of the goose after the image has loaded
  $(window).load(function() {
    shadowYpos();
  });

  //do the same after resize
  $(window).resize(function() {
    shadowYpos();
  });
  
  //$(window).load(... doesn't work in IE so call it again after a delay
  delay(function(){
    shadowYpos();
  } , 1000);

}

function initBoatAndClouds() {
  boat = addBoat(69, 58,  15, 20);
  boatClipPath(); 
  floatBoat(boat); //add animation to the boat
  
  cloud1 = initCloud($('.clouds-wrapper'), 'cloud1', imagesUrl + "cloud1.png", 85, 35,  25, 20, 55000);
  cloud2 = initCloud($('.clouds-wrapper'), 'cloud2', imagesUrl + "cloud2.png", 59, 10,  15, 45, 45000);
  cloud3 = initCloud($('.clouds-wrapper'), 'cloud3', imagesUrl + "cloud3.png", 34, 20,  20, 28, 50000);
}

//add a clipping path to the boat to give the impression that it is floating in waves
function boatClipPath(){ 
  function setPath(clipPath){
    //create the curve
    var d = "M" + xPercent(49) + "," + yPercent(56) //initial point
            + "C" + xPercent(54) + ", " + yPercent(56) + " " //first control point
            + xPercent(56) + ", " + yPercent(59) + " " //second control point
            + xPercent(58) + ", " + yPercent(56) + " " //end point and start of next curve
            //second curve
            + "C" + xPercent(60) + ", " + yPercent(56) + " " //first control point
            + xPercent(62) + ", " + yPercent(59) + " " //second control point
            + xPercent(64) + ", " + yPercent(56) + " " //end point
            //third curve
            + "C" + xPercent(66) + ", " + yPercent(56) + " " //first control point
            + xPercent(69) + ", " + yPercent(59) + " " //second control point
            + xPercent(70) + ", " + yPercent(56) + " " //end point
            //Close the shape
            + "V" + yPercent(40) + "H" + xPercent(49) + "V"+yPercent(56); 
    clipPath.attr({'d': d}); //set the attribute
  }
                        
  var clipPath = $( "[id='boatClipPath']"); //get the (currently empty) clipPath
  
  setPath(clipPath, boatClip);
  
  $(window).resize(function(){
    setPath(clipPath, boatClip);
  });
}

function initCloud(parentDiv, name, img, xPos, yPos, maxW, maxH, animTime){
  cloud = addSprite(parentDiv, name, img, maxH, maxW, 1, 0);
  
  var setPos = function(sprite){
    cloud.css({
      position: 'absolute', 
      right: xPercent(100 - xPos),
      bottom: yPercent(100 - yPos), 
    });
  };
  
  setPos(cloud);
  
  $(window).resize(function(){
    setPos(cloud);
  });

  animCloud(cloud, animTime);
  
  return cloud;
}

function animCloud(cloud, time){ 
  var currentPos = parseFloat(cloud.css('right'));
  var screenLeft = windowWidth()*6/5;
  var screenRight = -windowWidth()*1/5;
  var totalDist = screenLeft -screenRight; //total distance travelled
  var initialDist = totalDist - currentPos; //distance already travelled across the screen
  var initialTime = initialDist/totalDist * time;
  
  cloud.velocity({right: screenLeft + "px" }, 
                 {duration: initialTime, 
                  easing: "linear",
                  complete: function( ){
                    cloud.css({right: screenRight + "px"});
                    animCloud(cloud,  time);
                  }
                 });
  
  var maxHeight = yPercent(90);
  var minHeight = yPercent(65); //THIS WILL NEED TO BE MORE PRECISE FOR SOME SCREEN RESOLUTIONS!!!

  cloud.off("mousedirection").on("mousedirection", _.debounce(function(e) {
    var xMoveAmount = xPercent(getRandomInt(2, 10));
    var currentXPos = parseFloat(cloud.css('right'));
    var xMoveTo = 0;
    
    currentYPos = parseFloat(cloud.css('bottom'));

    var yMoveAmount = yPercent(getRandomInt(1, 5));
    var yMoveTo = 0;
    if(currentYPos <= minHeight){ 
      //always move up if too low
      yMoveTo = currentYPos + yMoveAmount;
    }
    else if(currentYPos >= maxHeight){ 
      //always move down if too high
      yMoveTo = currentYPos - yMoveAmount;
    }
    else{
      //otherwise randomly move up or down
      var direction = getRandomInt(1, 2);
      if(direction == 1){
        yMoveTo = currentYPos - yMoveAmount;
      }else{ 
        yMoveTo = currentYPos + yMoveAmount;
      }
    }
    
    var duration = getRandomInt(1000, 2000);
    
    //check the vertical position of the cloud - if its too high move it down, 
    //too low move it up, otherwise random
    if (e.direction == "left") {
      xMoveTo = currentXPos  + xMoveAmount;
    }
    else if (e.direction == "right") {
      xMoveTo = currentXPos  - xMoveAmount;
    }
    cloud.velocity('stop').velocity({right: xMoveTo + "px", bottom: yMoveTo + "px" }, {duration: duration, 
            easing: [ 0.1, .2, .5, .7 ],
            complete: function( ){
              animCloud(cloud,  time);
            }
           });
  }, 800, true)); //debounce timing
}

function initWashingLineAnimations() {
  //Set up the squeak sounds
  var squeak1 = new Audio();
  squeak1.src = soundsUrl + "squeak1.mp3";
  var squeak2 = new Audio();
  squeak2.src = soundsUrl + "squeak2.mp3";
  var squeak3 = new Audio();
  squeak3.src = soundsUrl + "squeak3.mp3";
  var squeak4 = new Audio();
  squeak4.src = soundsUrl + "squeak4.mp3";

  var squeaks = [squeak1, squeak2, squeak3, squeak4];

  book.off("click").on("click", function(event) { //Animate forward
    blockClicks.show(); //prevent clicks while animating
    var pieces = randomPointsOnPath();
    squeaks = shuffle(squeaks); //play squeaks in a different order each time
    removeAllWindAnims();
    animAlongWL(pieces, book, bookX, "right", bookOffset, "normal", squeaks);
    animAlongWL(pieces, tshirt, tshirtX, "right", tshirtOffset, "sprite");
    animAlongWL(pieces, gourd, gourdX, "right", gourdOffset, "gourd");
    animSilkAlongWL(pieces, silk, silkX, "right");

    animAlongWL(pieces, book1, book1X, "centre", bookOffset, "normal");
    animAlongWL(pieces, book2, book2X, "centre", bookOffset, "normal");
    animAlongWL(pieces, book3, book3X, "centre", bookOffset, "normal");
    animAlongWL(pieces, book4, book4X, "centre", bookOffset, "normal");

    animBackarrow('forwards');

    backarrow.off("click").on("click", function(event) {
      blockClicks.show(); //prevent clicks while animating
      var pieces = randomPointsOnPath();
      squeaks = shuffle(squeaks);
      removeAllWindAnims();
      animAlongWL(pieces, book, bookX, "centre", bookOffset, "normal", squeaks);
      animAlongWL(pieces, tshirt, tshirtX, "centre", tshirtOffset, "sprite");
      animAlongWL(pieces, gourd, gourdX, "centre", gourdOffset, "gourd");
      animSilkAlongWL(pieces, silk, silkX, "centre");

      animAlongWL(pieces, book1, book1X, "left", bookOffset, "normal");
      animAlongWL(pieces, book2, book2X, "left", bookOffset, "normal");
      animAlongWL(pieces, book3, book3X, "left", bookOffset, "normal");
      animAlongWL(pieces, book4, book4X, "left", bookOffset, "normal");

      animBackarrow('reverse');
    });

  });

  tshirt.off("click").on("click", function(event) {
    blockClicks.show(); //prevent clicks while animating
    var pieces = randomPointsOnPath();
    squeaks = shuffle(squeaks);
    removeAllWindAnims();
    animAlongWL(pieces, book, bookX, "left", bookOffset, "normal", squeaks);
    animAlongWL(pieces, tshirt, tshirtX, "left", tshirtOffset, "sprite");
    animAlongWL(pieces, gourd, gourdX, "left", gourdOffset, "gourd");
    animSilkAlongWL(pieces, silk, silkX, "left");

    animAlongWL(pieces, dress, dressX, "centre", dressOffset, "sprite");
    animAlongWL(pieces, scarf, scarfX, "centre", dressOffset, "sprite");

    animBackarrow('forwards');

    backarrow.off("click").on("click", function(event) {
      blockClicks.show(); //prevent clicks while animating
      var pieces = randomPointsOnPath();
      squeaks = shuffle(squeaks);
      removeAllWindAnims();
      animAlongWL(pieces, book, bookX, "centre", bookOffset, "normal", squeaks);
      animAlongWL(pieces, tshirt, tshirtX, "centre", tshirtOffset, "sprite");
      animAlongWL(pieces, gourd, gourdX, "centre", gourdOffset, "gourd");
      animSilkAlongWL(pieces, silk, silkX, "centre");

      animAlongWL(pieces, dress, dressX, "right", dressOffset, "sprite");
      animAlongWL(pieces, scarf, scarfX, "right", dressOffset, "sprite");

      animBackarrow('reverse');
    });
  });

  gourd.off("click").on("click", function(event) {
    blockClicks.show(); //prevent clicks while animating
    var pieces = randomPointsOnPath();
    squeaks = shuffle(squeaks);
    removeAllWindAnims();
    animAlongWL(pieces, book, bookX, "right", bookOffset, "normal", squeaks);
    animAlongWL(pieces, tshirt, tshirtX, "right", tshirtOffset, "sprite");
    animAlongWL(pieces, gourd, gourdX, "right", gourdOffset, "gourd");
    animSilkAlongWL(pieces, silk, silkX, "right");

    animAlongWL(pieces, gourd1, gourd1X, "centre", gourdOffset, "gourd");

    animGoose("forward");

    animFloorgourd("forwards");
    animBackarrow('forwards');

    backarrow.off("click").on("click", function(event) {
      blockClicks.show(); //prevent clicks while animating
      var pieces = randomPointsOnPath();
      squeaks = shuffle(squeaks);
      removeAllWindAnims();
      animAlongWL(pieces, book, bookX, "centre", bookOffset, "normal", squeaks);
      animAlongWL(pieces, tshirt, tshirtX, "centre", tshirtOffset, "sprite");
      animAlongWL(pieces, gourd, gourdX, "centre", gourdOffset, "gourd");
      animSilkAlongWL(pieces, silk, silkX, "centre");

      animAlongWL(pieces, gourd1, gourd1X, "left", gourdOffset, "gourd");

      animGoose("reverse");

      animFloorgourd("reverse");
      animBackarrow('reverse');
    });
  });
  silk.off("click").on("click", function(event) {
    blockClicks.show(); //prevent clicks while animating
    var pieces = randomPointsOnPath();
    squeaks = shuffle(squeaks);
    removeAllWindAnims();
    animAlongWL(pieces, book, bookX, "left", bookOffset, "normal", squeaks);
    animAlongWL(pieces, tshirt, tshirtX, "left", tshirtOffset, "sprite");
    animAlongWL(pieces, gourd, gourdX, "left", gourdOffset, "gourd");
    animSilkAlongWL(pieces, silk, silkX, "left");

    animAlongWL(pieces, poi, poiX, "centre", poiOffset, "sprite");
    animSilkAlongWL(pieces, silk1, silk1X, "centre");

    animStaff('forward');

    animBackarrow('forwards');

    backarrow.off("click").on("click", function(event) {
      blockClicks.show(); //prevent clicks while animating
      var pieces = randomPointsOnPath();
      squeaks = shuffle(squeaks);
      animAlongWL(pieces, book, bookX, "centre", bookOffset, "normal", squeaks);
      animAlongWL(pieces, tshirt, tshirtX, "centre", tshirtOffset, "sprite");
      animAlongWL(pieces, gourd, gourdX, "centre", gourdOffset, "gourd");
      animSilkAlongWL(pieces, silk, silkX, "centre");

      animAlongWL(pieces, poi, poiX, "right", poiOffset, "sprite");
      animSilkAlongWL(pieces, silk1, silk1X, "right");

      animStaff('reverse');

      animBackarrow('reverse');
    });
  });
}

/* ************************************************************************

      SPRITE MAKING FUNCTIONS 

************************************************************************** */

// Add a responsive sprite - it will grow no wider than maxW and no taller than maxH (both defined in terms of screen %)
addSprite = function(parentDiv, spriteName, imageURl, maxH, maxW, numFrames, isLink, linkURL) {
  var height = yPercent(maxH), //The height of the sprite, initially set to the maximum desired height
    width = maxW, //The width of the sprite, initially set to the maximum desired width
    imgH, imgW, //The width and height of the original image

    spriteImage = selectImage(imageURl, function(w, h) {
      imgH = h, imgW = w;
      //Calculate the width based on maxH
      width = imgW / ((imgH / numFrames) / height);
      //If the calculated width is too wide, decrease the height until the desired width is found
      while (xPxToPercent(width) > maxW) {
        height = height - 10;
        width = imgW / ((imgH / numFrames) / height);
      }
      //Set the sprites initial width and height
      $('.' + spriteName).css({
        height: height + "px",
        width: width + "px"
      });
    });

  //Recalculate width and height if the browser window is resized
  $(window).resize(function() {
    //increase width if too narrow
    if (xPxToPercent(width) < maxW) {
      while (xPxToPercent(width) < maxW && height < yPercent(maxH)) {
        height = height + 10;
        width = imgW / ((imgH / numFrames) / height);
      }
    }
    //decrease width if too wide
    if (xPxToPercent(width) > maxW) {
      while (xPxToPercent(width) > maxW && height <= yPercent(maxH)) {
        height = height - 10;
        width = imgW / ((imgH / numFrames) / height);
      }
    }
    //decrease height if too tall
    if (height > yPercent(maxH)) {
      height = yPercent(maxH);
      width = imgW / ((imgH / numFrames) / height);
    }
    //Set the new width and height
    $('.' + spriteName).css({
      height: height + "px",
      width: width + "px"
    });
  });

  if (isLink) { //Make the sprite a link if required
    parentDiv.append('<a class="' + spriteName + '" href="' + linkURL + '"></a>');
  }
  else { //Otherwise just place it in a div
    parentDiv.append('<div class="' + spriteName + '"></div>');
  }

  $('.' + spriteName).css({
    background: 'url("' + spriteImage.src + '") no-repeat 0 0%',
    'background-size': "100%",
  });
  //Return the parent div - this can be used to add animations, reposition the sprite etc.
  return $('.' + spriteName);
};

//Add a sprite to the start of an SVG path - also put the sprite in a wrapper div so that it can be rotated wothout destroying z-index
//(for shadows)
function addSpriteToPath(path, spriteName, div, maxH, maxW, numFrames, isLink, linkURL) {
  var setPos = function(sprite, path){
    if (sprite.attr('data-pathPos') == 'start') {
      position = path[0].getPointAtLength(0);
    }
    else if (sprite.attr('data-pathPos') == 'end') {
      var len = path[0].getTotalLength();
      position = path[0].getPointAtLength( len);
    }
    sprite.css({
      position: 'absolute',
      top: position.y,
      left: position.x,
    });
  };
  
  var sprite = addSprite(div, spriteName, imagesUrl + spriteName + ".png", maxH, maxW, numFrames, isLink, linkURL);
  
  //The sprite will be wrapped in a div, so set the current sprite object to relative positioning
  sprite.css({
    position: 'relative',
    top: 0,
    left: 0,
  });
  
  //Wrap the srite in a div - this is necessary as the sprite will be rotated in Z and this breaks z-indexing
  //so rotating the wrapper div instead allows z-index to continue working for child elements of the wrapper
  sprite.wrap('<div class="' + spriteName + '-wrapper"></div>');

  //Now reference this div as the sprite
  sprite = $('.' + spriteName + '-wrapper');

  //Give the sprite a data attribute specifying whether it is at the start or end of the path
  //this will be used to reposition it on window resize
  sprite.attr('data-pathPos', 'start');
  
  //now set the position of the wrapper div
  setPos(sprite, path);

  $(window).resize(function() {
    setPos(sprite, path);
  });

  return sprite;
}

//Add a sprite on top of the planks image
function addPlankSprite(name, imageURl, xPos, yPos, maxH, maxW, numFrames, isLink, linkURL) {
  var setPos = function(sprite, xPos, yPos){
    sprite.css({
      position: 'absolute',
      left: xPercent(xPos) + 'px',
      bottom: yPercent(yPos) + 'px' 
    });
  };
  
  var sprite = addSprite($('.plank-sprites'), name, imageURl, maxH, maxW, numFrames, isLink, linkURL);
  
  setPos(sprite, xPos, yPos);

  $(window).resize(function() {
    setPos(sprite, xPos, yPos);
  });
  return sprite;
}

//Add a sprite to the washing line
function addWLSprite(spriteName, xPos, offset, maxH, maxW, numFrames, linkURL, rotate, screenPos) {

  var setPos = function(sprite, xPos, offset){
    var point = 0;
    
    //screenPos specifies whether the sprite starts offscreen to the left, right, or onscreen ("centre")
    //then window widths are added to the sprites xPos accordingly
    if (screenPos == "left") {
      point = wlPath[0].getPointAtLength(xPercent(xPos));
    }
    else if (screenPos == "right") {
      point = wlPath[0].getPointAtLength(windowWidth() * 2 + xPercent(xPos));
    }
    else {
      point = wlPath[0].getPointAtLength(windowWidth() + xPercent(xPos));
    }
    
    sprite.css({
      position: 'absolute',
      top: point.y + wlSpritesOffset(offset),
      left: point.x
    });

    if (rotate) {
      sprite.rotate(washingLineAngle());
    }
    
    sprite.attr("data-screen", screenPos);

  };
  
  var sprite;
  if(linkURL == ''){ //if the link is empty create the sprite as a div instead
    sprite = addSprite($(".wl-sprites"),spriteName, imagesUrl + spriteName + ".png", maxH, maxW, numFrames, 0);
  }
  else{
    sprite = addSprite($(".wl-sprites"),spriteName, imagesUrl + spriteName + ".png", maxH, maxW, numFrames, 1, linkURL);
  }
  
  //Set to the middle frame if animated
  if (numFrames > 1) {
    sprite.css({
      'background-position': '50%'
    });
  }

  setPos(sprite, xPos, offset);
  

  $(window).resize(function() {
    if(!isAnimating()){ //if the animation is not currently running set the new position
      setPos(sprite, xPos, offset);
    }
    else{ //otherwise wait until it is finished then set the new position -doesn't work very well!
      delay(function(){
        setPos(sprite, xPos, offset);
      }, wlAnimationSpeed);
    }
  });

  return sprite;
}

function addSilk(name, xPos, linkURL, screen){
  //This creates a sprite as per the normal setup, however due to the animation the clickable area
  //is far too big
  var silk = addWLSprite(name, xPos, silkOffset, 55, 40, 7, '', 0, screen);
  
  //add the wind animation
  addWindAnimToWLSprite(silk);
  
  //add a smaller link area
  silk.append('<a class="' + name + '-link" href="' + linkURL + '"></a>');
  
  //Now reference the smaller link in place of the large sprite
  //This breaks the animation though so have to update the animations function
  return $('.' + name + '-link');
}

//add the boat positioned aboslutely from screen bottom right
function addBoat(xPos, yPos,  maxH, maxW){
  sprite = addSprite($('.boat-wrapper'), 'boat', imagesUrl + "boat.png", maxH, maxW, 1, 0);
  
  var setPos = function(sprite){
    sprite.css({
      position: 'absolute', 
      right: xPercent(100 - xPos),
      bottom: yPercent(100 - yPos), 
    });
  };
  
  setPos(sprite);
  
  $(window).resize(function(){
    setPos(sprite);
  });
  
  return sprite;
}

/* ************************************************************************

      ANIMATION FUNCTIONS

************************************************************************** */
// Animate DOM element along SVG path - the basic SNAP animation call used by most of the animation functions
function animDOMAlongPath(path, element, start, end, dur, type, xOffset, yOffset, callback) {
  // If end is set to 100 then animate to the end of the path
  if (end == 100) {
    end = path[0].getTotalLength();
  }

  // If start = 100 then start at the end of the path
  if (start == 100) {
    start = path[0].getTotalLength();
  }

  //Snap.animate(from, to, setter, duration, [easing], [callback])
  Snap.animate(start, end, function(value) {
    // movePoint gets the path attributes at a certain frame
    var movePoint = path[0].getPointAtLength(value);
    // applies the attributes to our element
    element.css({
      "top": movePoint.y + yOffset,
      "left": movePoint.x + xOffset
    });
  }, dur, type, function() {
    if (callback) {
      callback();
    }
  });
}

/* Animate DOM element along washing line path*/
function animAlongWL(pieces, element, elementX, toScreen, offset, type, squeaks) {

  //The current element will either be on screen, to the left, or to the right
  //and will be either moving to the left or right. The array pieces[] currently 
  //contains one arbitrary screen length - this needs to be offset according to the 
  //direction the element will be moving, and its current position

  //The wlPath is 3 screens wide and starts at 0 one screen width to the left 
  //This is -windowWidth() in absolute position

  //start with the original pieces (.slice[0] required so make the new array a copy rather than an instance)
  var thisElemPieces = pieces.slice(0);

  var thisElemXOffset = xPercent(elementX); //position along the path for this element
  var ww = windowWidth();

  var dataScreen = ""; //set the new data-screen of the element after animating
  //If the element is offscreen to the left, then it must be moving right, to the centre screen
  if (element.attr("data-screen") == "left") {
    dataScreen = "centre";
    //In this case we need to add thisElemXOffset to each piece
    for (i = 0; i < thisElemPieces.length; i++) {
      thisElemPieces[i] = thisElemPieces[i] + thisElemXOffset;
    }
  }

  //If the element is offscreen to the right, then it must be moving left, to the centre screen
  if (element.attr("data-screen") == "right") {
    dataScreen = "centre";
    //reverse the array to move in the opposite direction
    thisElemPieces.reverse();
    for (i = 0; i < thisElemPieces.length; i++) {
      //then add the offset and a window width
      thisElemPieces[i] = thisElemPieces[i] + thisElemXOffset + ww;
    }
  }

  //Otherwise the element is onscreen, and may be moving left or right
  if (element.attr("data-screen") == "centre") {
    if (toScreen == "left") {
      dataScreen = "left";
      //reverse the array to move in the opposite direction
      thisElemPieces.reverse();
      for (i = 0; i < thisElemPieces.length; i++) {
        //In this case we need to add thisElemXOffset to each piece
        thisElemPieces[i] = thisElemPieces[i] + thisElemXOffset;
      }
    }
    if (toScreen == "right") {
      dataScreen = "right";
      for (i = 0; i < thisElemPieces.length; i++) {
        //here we'll a ww and the offset to move the element offscreen to the right
        thisElemPieces[i] = thisElemPieces[i] + thisElemXOffset + ww;
      }
    }
  }
  if (type == "sprite") {
    animSpriteAlongWL(element, thisElemPieces, offset, toScreen, dataScreen);
  }
  else if (type == "normal") {
    //squeaks will only be played by one element, in this case always the first book
    animElemAlongWL(element, thisElemPieces, offset, dataScreen, squeaks);
  }
  else if (type == "gourd") {
    animGourdAlongWL(element, thisElemPieces, offset, toScreen, dataScreen);
  }
}

//to be called within animAlongWL if the element is a sprite
function animSpriteAlongWL(element, thisElemPieces, offset, toScreen, dataScreen) {
  var elemClass = element.attr('class'); //record the initial class of the element
  var yOffset = wlSpritesOffset(offset);
  var animFwdClass, animRevClass;

  //figure out which anim classes to apply based on which direction the sprite is moving
  if (toScreen == "right") {
    animFwdClass = 'spriteMoveLeft';
    animRevClass = 'spriteMoveLeftRev';
  }
  else if (toScreen == "left") {
    animFwdClass = 'spriteMoveRight';
    animRevClass = 'spriteMoveRightRev';
  }
  else if (toScreen == "centre") {
    if (element.attr("data-screen") == "right") {
      animFwdClass = 'spriteMoveRight';
      animRevClass = 'spriteMoveRightRev';
    }
    else if (element.attr("data-screen") == "left") {
      animFwdClass = 'spriteMoveLeft';
      animRevClass = 'spriteMoveLeftRev';
    }
  }

  //Add the forward anim class, then when it finishes, remove it and and the reverse anim class
  //Then when the reverse anim ends, remove that too and reset the class back to the original
  function animClasses(element, elemClass, animFwdClass, animRevClass) {
    element.attr('class', elemClass + ' ' + animFwdClass); //add the forward animation class
    element.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() { //trigger when the forward animation ends
      element.off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd'); //unbind the animation end trigger
      element.attr('class', elemClass + ' ' + animRevClass); //add the reverse anim and remove the forward anim
      element.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() { //trigger when the reverse animation ends
        element.attr('class', elemClass); //reset the class back to the original after the reverse anim ends
        element.off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd'); //unbind the animation end trigger
      });
    });
  }
  //nest a number of of callbacks equal to the max number of path pieces 
  animDOMAlongPath(wlPath, element, thisElemPieces[0], thisElemPieces[1], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
    animClasses(element, elemClass, animFwdClass, animRevClass);
    animDOMAlongPath(wlPath, element, thisElemPieces[1], thisElemPieces[2], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
      if (thisElemPieces[3]) { //There will be at least 2 pieces, only continue if there are more
        animClasses(element, elemClass, animFwdClass, animRevClass);
        animDOMAlongPath(wlPath, element, thisElemPieces[2], thisElemPieces[3], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
          //Now we have reached the minimum number of pieces so don't continue if this is the end
          if (thisElemPieces[4]) {
            animClasses(element, elemClass, animFwdClass, animRevClass);
            animDOMAlongPath(wlPath, element, thisElemPieces[3], thisElemPieces[4], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
              if (thisElemPieces[5]) {
                animClasses(element, elemClass, animFwdClass, animRevClass);
                animDOMAlongPath(wlPath, element, thisElemPieces[4], thisElemPieces[5], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
                  element.attr("data-screen", dataScreen);
                  //CURRENTLY MAX 6 PIECES! 
                });
              }
              else {
                element.attr("data-screen", dataScreen);
              }
            });
          }
          else {
            element.attr("data-screen", dataScreen);
          }
        });
      }
      else {
        element.attr("data-screen", dataScreen);
      }
    });
  });
}

//to be called within animAlongWL if the element is a normal DOM element
function animElemAlongWL(element, thisElemPieces, offset, dataScreen, squeaks) {
  var yOffset = wlSpritesOffset(offset);

  if (squeaks) {
    squeaks[0].play();
  } //play a squeak sound each time the line moves
  //nest a number of of callbacks equal to the max number of path pieces 
  animDOMAlongPath(wlPath, element, thisElemPieces[0], thisElemPieces[1], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
    if (thisElemPieces[2]) { //Only do another animation if there are more pieces
      if (squeaks) {
        squeaks[1].play();
      }
      animDOMAlongPath(wlPath, element, thisElemPieces[1], thisElemPieces[2], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
        if (thisElemPieces[3]) {
          if (squeaks) {
            squeaks[2].play();
          }
          animDOMAlongPath(wlPath, element, thisElemPieces[2], thisElemPieces[3], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
            //Now we have reached the minimum number of pieces so don't continue if this is the end
            if (thisElemPieces[4]) {
              if (squeaks) {
                squeaks[3].play();
              }
              animDOMAlongPath(wlPath, element, thisElemPieces[3], thisElemPieces[4], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
                if (thisElemPieces[5]) {
                  if (squeaks) {
                    squeaks[0].play();
                  }
                  animDOMAlongPath(wlPath, element, thisElemPieces[4], thisElemPieces[5], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
                    //CURRENTLY MAX OF 5 PIECES!
                    element.attr("data-screen", dataScreen);
                    blockClicks.hide();
                  });
                }
                else {
                  element.attr("data-screen", dataScreen);
                  blockClicks.hide(); //hide the unclickable overlay when finished animating
                }
              });
            }
            else {
              element.attr("data-screen", dataScreen);
              blockClicks.hide();
            }
          });
        }
        else {
          element.attr("data-screen", dataScreen);
          blockClicks.hide();
        }
      });
    }
    else {
      element.attr("data-screen", dataScreen);
      blockClicks.hide();
    }
  });
}

//animate the gourd along the washing line, adding swing to it
function animGourdAlongWL(element, thisElemPieces, offset, toScreen, dataScreen) {
  var currentScreen = element.attr("data-screen");
  var maxRotate = 0;
  if (toScreen == "centre") {
    if (currentScreen == "left") {
      maxRotate = -8;
    }
    else if (currentScreen == "right") {
      maxRotate = 8;
    }
  }
  else if (toScreen == "left") {
    maxRotate = 8;
  }
  else if (toScreen == "right") {
    maxRotate = -8;
  }

  var yOffset = wlSpritesOffset(offset);
  gourdSwing(element, maxRotate);
  //nest a number of of callbacks equal to the max number of path pieces 
  animDOMAlongPath(wlPath, element, thisElemPieces[0], thisElemPieces[1], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
    gourdSwing(element, maxRotate);
    animDOMAlongPath(wlPath, element, thisElemPieces[1], thisElemPieces[2], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
      if (thisElemPieces[3]) {
        gourdSwing(element, maxRotate);
        animDOMAlongPath(wlPath, element, thisElemPieces[2], thisElemPieces[3], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
          //Now we have reached the minimum number of pieces so don't continue if this is the end
          if (thisElemPieces[4]) {
            gourdSwing(element, maxRotate);
            animDOMAlongPath(wlPath, element, thisElemPieces[3], thisElemPieces[4], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
              if (thisElemPieces[5]) {
                gourdSwing(element, maxRotate);
                animDOMAlongPath(wlPath, element, thisElemPieces[4], thisElemPieces[5], wlAnimationSpeed / thisElemPieces.length, mina.easeinout, 0, yOffset, function() {
                  element.attr("data-screen", dataScreen); //set the new data-screen when the element has finished animating
                  gourdSwing(element, maxRotate);
                });
              }
              else {
                element.attr("data-screen", dataScreen);
              }
            });
          }
          else {
            element.attr("data-screen", dataScreen);
          }
        });
      }
      else {
        element.attr("data-screen", dataScreen);
      }
    });
  });
}

function animSilkAlongWL(pieces, sprite, spriteX, toScreen){
  sprite = sprite.parent();
  animAlongWL(pieces, sprite, spriteX, toScreen, silkOffset, "sprite");
}


//Add wind animation to spritesheets on the washing line when the mouse moves over them
function addWindAnimToWLSprite(sprite) {
  var spriteClass = sprite.attr('class'); //record whatever classes the sprite has before animating

  sprite.on("mousedirection", _.debounce(function(e) { //debounce the function to prevent it being called too often
      if ($(this).css("background-position") == "50% 50%" || $(this).css("background-position") == "0px 50%") {
        if (e.direction == "right") {
          $(this).on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() { //when the anim ends
            $(this).attr('class', spriteClass); //reset the classes to the original
            $(this).off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
          });

          $(this).attr('class', spriteClass + ' spriteWindRight spriteWindRightRev');
        }
        else if (e.direction == "left") {
          $(this).on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() {
            $(this).attr('class', spriteClass);
            $(this).off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
          });
          $(this).attr('class', spriteClass + ' spriteWindLeft spriteWindLeftRev');
        }
      }
  }, 400, true)); //debounce timing
}


//Remove all wind animations from washing line objects, called before animating the washing line
function removeAllWindAnims() {
  $('.spriteWindRight').removeClass('spriteWindRight');
  $('.spriteWindRightRev').removeClass('spriteWindRightRev');
  $('.spriteWindLeft').removeClass('spriteWindLeft');
  $('.spriteWindLeftRev').removeClass('spriteWindLeftRev');
  gourd.velocity('stop');
  gourd1.velocity('stop');
}

//add swing motion to the gourd using velocity.js - swing for each gourd is globally recorded
//and decreases with each swing so the gourd gradually slows down
function gourdSwing(grd, swingAmount) {
  grd.velocity({
    rotateZ: -swingAmount + "deg"
  }, {
    duration: 800,
    easing: "swing",
    complete: function() {
      if (swingAmount != 0) {
        if (swingAmount < 0) {
          swingAmount = -swingAmount - 2;
        }
        else if (swingAmount > 0) {
          swingAmount = -swingAmount + 2;
        }
        gourdSwing(grd, swingAmount);
      }
    }
  });
}

//add wind (swing) to the gourd on mouse over - maximum swing allowed is 20 degrees
function addWindToGourd(grd, swingAmount) {
  grd.on("mousedirection", _.throttle(function(e) {
      if (e.direction == "left") {
        if (swingAmount == 0) { //if the gourd is currently stationary
          swingAmount = -20; //set it to max swing
          grd.velocity('stop');
          gourdSwing(grd, swingAmount);
        }
        //if its already swinging set the swing amount back to the maximum
        else if (swingAmount > 0) {
          swingAmount = (swingAmount - 10) % (-20);
        }
        else if (swingAmount < 0) {
          swingAmount = -20;
        }
      }
      if (e.direction == "right") {
        if (swingAmount == 0) {
          swingAmount = 20;
          grd.velocity('stop');
          gourdSwing(grd, swingAmount);
        }
        else if (swingAmount > 0) {
          swingAmount = 20;
        }
        else if (swingAmount < 0) {
          swingAmount = (swingAmount + 10) % (20);
        }
      }
  }, 300)); //throttle timing
}

//animate the sprites on the planks along their animation paths - then set their data attributes to 
//specify whether they are at the start or end of the path using a callback
function animSpriteAlongPath(path, sprite, from, to) {
  animDOMAlongPath(path, sprite, from, to, wlAnimationSpeed, mina.easeinout, 0, 0, function() {
    if (to == 100) {
      sprite.attr('data-pathPos', 'end'); //used to reposition the object on window resize
    }
    else if (to == 0) {
      sprite.attr('data-pathPos', 'start'); //used to reposition the object on window resize
    }
  });
}

//fade in or out the back arrow
function animBackarrow(direction) {
  var len = backarrow[0].getTotalLength();
  if (direction == "forwards") {
    backarrow[0].velocity({ "stroke-dashoffset": 0, "stroke-width": .4  }, wlAnimationSpeed, "swing");
    //backarrow.velocity({ "stroke-width": .4  }, (1 / 2) * wlAnimationSpeed, "swing");
  }
  else if (direction == "reverse") {
    backarrow[0].velocity({ "stroke-dashoffset": len,"stroke-width": 0 }, (2 / 3) * wlAnimationSpeed, "swing");
    //backarrow.velocity({ "stroke-width": 0  }, wlAnimationSpeed, "swing");
  }
}

function animFloorgourd(direction) {
  if (direction == "forwards") {
    animSpriteAlongPath(floorgourdPath, floorgourd, 0, 100);
    //sprite.attr('data-pathPos', 'end'); //used to reposition the object on window resize
  }
  else if (direction == "reverse") {
    animSpriteAlongPath(floorgourdPath, floorgourd, 100, 0);
    //sprite.attr('data-pathPos', 'start'); //used to reposition the object on window resize
  }

  swingAmount = 8;

  floorgourd.velocity('stop').velocity({
    rotateZ: swingAmount + "deg"
  }, {
    duration: 400,
    easing: "swing"
  });
  gourdSwing(floorgourd, swingAmount);
  
  //reset the shadow movement so that it is the same as objects already on screen
  floorgourd.off("mousemove");
  addSkewToShadow($('.floorgourd-shadow'), goose);
}

function animGoose(direction) {
  var pathLen = goosePath[0].getTotalLength();
  var groundYpos = goosePath[0].getPointAtLength(pathLen).y;

  var animAlongPath = function(start, end, dur, callback) {
    Snap.anizmate(start, end, function(value) {
      var movePoint = goosePath[0].getPointAtLength(value);
      goose.css({
        "top": movePoint.y,
        "left": movePoint.x
      });
      //Get the distance from the ground and move the shadow down this amount
      var groundDist = groundYpos - movePoint.y;
      $('.goose-shadow').css({
        "bottom": gooseShadowY - (2 * groundDist)
      });
    }, dur, mina.easinout, function() {
      if (callback) {
        callback();
      }
    });
  };

  //Divide the path into 9 pieces
  var p1 = getLengthOfPathPercent(0, goosePath);
  var p2 = getLengthOfPathPercent(100 / 8, goosePath);
  var p3 = getLengthOfPathPercent(200 / 8, goosePath);
  var p4 = getLengthOfPathPercent(300 / 8, goosePath);
  var p5 = getLengthOfPathPercent(400 / 8, goosePath);
  var p6 = getLengthOfPathPercent(500 / 8, goosePath);
  var p7 = getLengthOfPathPercent(600 / 8, goosePath);
  var p8 = getLengthOfPathPercent(700 / 8, goosePath);
  var p9 = getLengthOfPathPercent(100, goosePath);

  var wlAnimationSpeed = 4000;
  var swing = 9;

  var fwdPoints = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
  var revPoints = [p9, p8, p7, p6, p5, p4, p3, p2, p1];

  var animPoints;
  
  var hideShadow = false; 
  
    //reset the shadow movement so that it is the same as objects already on screen
  goose.off("mousemove");
  
  if (direction == ("forward")) {
    addSkewToShadow($('.goose-shadow'), goose);
    hideShadow = false;
    swing = 9;
    goose.velocity('stop').velocity({
      rotateY: "0deg",
      rotateZ: swing + "deg"
    }, {
      duration: wlAnimationSpeed / 7,
      easing: "swing"
    });
    animPoints = fwdPoints;
    goose.attr('data-pathPos', 'end'); //used to reposition the object on window resize
  }
  else if (direction == ("reverse")) {
    addSkewToShadow($('.goose-shadow'), goose,"reverse");
    hideShadow = true;
    swing = -9;
    goose.velocity('stop').velocity({
      rotateY: "180deg",
      rotateZ: swing + "deg"
    }, {
      duration: wlAnimationSpeed / 7,
      easing: "swing"
    });
    animPoints = revPoints;
    goose.attr('data-pathPos', 'start'); //used to reposition the object on window resize
  }

  if(!hideShadow){$('.goose-shadow').show();}

  //animate along these pieces in sequence - this will allow extra animation classes to be added 
  //if the goose becomes an animated  sprite
  animAlongPath(animPoints[0], animPoints[1], wlAnimationSpeed / 7, function() {
    goose.velocity('finish').velocity({
      rotateZ: -swing + "deg"
    }, {
      duration: wlAnimationSpeed / 7,
      easing: "swing"
    });
    animAlongPath(animPoints[1], animPoints[2], wlAnimationSpeed / 7, function() {
      goose.velocity('stop').velocity({
        rotateZ: swing + "deg"
      }, {
        duration: wlAnimationSpeed / 7,
        easing: "swing"
      });
      animAlongPath(animPoints[2], animPoints[3], wlAnimationSpeed / 7, function() {
        goose.velocity('stop').velocity({
          rotateZ: -swing + "deg"
        }, {
          duration: wlAnimationSpeed / 7,
          easing: "swing"
        });
        animAlongPath(animPoints[3], animPoints[4], wlAnimationSpeed / 7, function() {
          goose.velocity('stop').velocity({
            rotateZ: swing + "deg"
          }, {
            duration: wlAnimationSpeed / 7,
            easing: "swing"
          });
          animAlongPath(animPoints[4], animPoints[5], wlAnimationSpeed / 7, function() {
            goose.velocity('stop').velocity({
              rotateZ: -swing + "deg"
            }, {
              duration: wlAnimationSpeed / 7,
              easing: "swing"
            });
            animAlongPath(animPoints[5], animPoints[6], wlAnimationSpeed / 7, function() {
              goose.velocity('stop').velocity({
                rotateZ: swing + "deg"
              }, {
                duration: wlAnimationSpeed / 7,
                easing: "swing"
              });
              animAlongPath(animPoints[6], animPoints[7], wlAnimationSpeed / 7, function() {
                goose.velocity('stop').velocity({
                  rotateZ: "0deg"
                }, {
                  duration: wlAnimationSpeed / 7,
                  easing: "swing"
                });
                animAlongPath(animPoints[7], animPoints[8], wlAnimationSpeed / 7, function() {
                  if(hideShadow){$('.goose-shadow').hide();}
                });
              });
            });
          });
        });
      });
    });
  });
}

function animStaff(direction) {
  rotate = 8;
  if (direction == "forward") {
    staff.velocity('stop').velocity({
      rotateZ: rotate + "deg"
    }, {
      duration: wlAnimationSpeed,
      easing: "swing"
    });
    animDOMAlongPath(staffPath, staff, 0, 100, wlAnimationSpeed, mina.easeinout, 0, 0);
    staff.attr('data-pathPos', 'end'); //used to reposition the object on window resize
  }
  else if (direction == "reverse") {
    staff.velocity('stop').velocity({
      rotateZ: -rotate + "deg"
    }, {
      duration: wlAnimationSpeed,
      easing: "swing"
    });
    animDOMAlongPath(staffPath, staff, 100, 0, wlAnimationSpeed, mina.easeinout, 0, 0);
    staff.attr('data-pathPos', 'start'); //used to reposition the object on window resize
  }
  
  //reset the shadow movement so that it is the same as objects already on screen
  staff.off("mousemove");
  addSkewToShadow($('.staff-shadow'), staff);
}

function floatBoat(boat){
  var floatAmount = 0;
  var bottom = parseFloat(boat.css('bottom'));
  
  var rockBoat = function(){
    boat.velocity({
      rotateZ: -floatAmount + "deg",
      bottom: bottom - floatAmount+"px"
    }, {
      duration: 800,
      easing: "swing",
      complete: function() {
        if (floatAmount != 0) {
          if (floatAmount < 0) {
            floatAmount = -floatAmount - 1;
          }
          else if (floatAmount > 0) {
            floatAmount = -floatAmount + 1;
          }
          rockBoat();
        }
      }
    });
  };
  
  $(window).resize(function(){
    bottom = parseFloat(boat.css('bottom'));
  });
  
  boat.on("mousedirection", _.throttle(function(e) {
    if (e.direction == "left") {
      if (floatAmount == 0) { //if the boat is currently stationary
        floatAmount = -10; //set it to max swing
        boat.velocity('stop');
        rockBoat();
      }
      //if its already swinging set the swing amount back to the maximum
      else if (floatAmount > 0) {
        floatAmount = (floatAmount - 5) % (-10);
      }
      else if (floatAmount < 0) {
        floatAmount = -10;
      }
    }
    if (e.direction == "right") {
      if (floatAmount == 0) {
        floatAmount = 10;
        boat.velocity('stop');
        rockBoat();
      }
      else if (floatAmount > 0) {
        floatAmount = 10;
      }
      else if (floatAmount < 0) {
        floatAmount = (floatAmount + 5) % (10);
      }
    }
  }, 300)); //throttle timing
}

/* ************************************************************************

 HELPER FUNCTIONS

************************************************************************** */
function windowWidth() {
  return $(window).outerWidth(true);
}

function windowHeight() {
  return $(window).outerHeight(true);
}

//Return a window height % as a pixel value
function yPercent(y) {
  return ($(window).outerHeight(true) / 100) * y;
}

//Return a window width % as a pixel value         
function xPercent(x) {
  return ($(window).outerWidth(true) / 100) * x;
}



//Return a window width pixel value in window % 
function xPxToPercent(x) {
  return x * 100 / $(window).outerWidth(true);
}

function getLengthOfPathPercent(percent, path) {
  var len = path[0].getTotalLength();
  return (percent / 100) * len;
}

function wlSpritesOffset(offset) {
  return -yPercent(offset) * (windowWidth() / windowHeight());
}

//Point on the washing line relative to percentage of screen width - used to 
//place objects on the line
function washingLineYPoint(xPcnt) {
  return (yPercent(wlY2) - yPercent(wlY1)) / 100 * xPcnt + yPercent(wlY1);
}

//Washing line slope in degrees - used to place objects on the line
function washingLineAngle() {
  var y1 = yPercent(wlY1),
    y2 = yPercent(wlY2),
    x2 = xPercent(100),
    slope = (y2 - y1) / x2;
  return Math.atan(slope) * 180 / (4 * Math.atan(1));
}

//Plugin to add rotation - $('element').rotate(value in degrees)
jQuery.fn.rotate = function(degrees) {
  $(this).css({
    '-webkit-transform': 'rotate(' + degrees + 'deg)',
    '-moz-transform': 'rotate(' + degrees + 'deg)',
    '-ms-transform': 'rotate(' + degrees + 'deg)',
    'transform': 'rotate(' + degrees + 'deg)'
  });
  return $(this);
};

//Select an image with a callback to get the width and height after the image has loaded
function selectImage(imageURL, callback) {
  var img = new Image();
  img.onload = function() {
    if (callback) callback(img.width, img.height);
  };
  img.src = imageURL;
  return img;
}

function shuffle(array) {
  var m = array.length,
    t, i;
  while (m > 0) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//return an array of random float values along the length of an SVG path 
function randomPointsOnPath() {
  var len = windowWidth(); //The distance an object will be moving in each anim call

  var min = len / getRandomInt(4, 6); //Max 6 or will need to nest anim calls deeper
  var max = len / 3;
  var pieces = [0]; //create an array of path pieces
  var nextPiece = 0;
  var i = 0;
  //Now distribute these points along the path at random intervals that are not too far apart or close together
  while (pieces[i] <= len) {
    nextPiece = getRandomArbitrary(min, max);
    pieces.push(pieces[i] + nextPiece);
    i++;
  }

  //if pieces[] contains any values too large, pop them off
  while (pieces[pieces.length - 1] > len) {
    pieces.pop();
  }

  //if the last element is too short, add the final piece
  if (pieces[pieces.length - 1] < len) {
    pieces.push(len);
  }

  return pieces;
}

//check if the is shown and return true if so
function isAnimating(){
  if($('.blockingDiv').css('display') == "none"){
    return false;
  }
  return true;
}

/* ************************************************************************

      MOUSE DIRECTION PLUGIN
 Based on Hasin Hayder's original [hasin@leevio.com | http://hasin.me]

************************************************************************** */
(function($) {
  var oldx = 0;
  var direction = "";
  $.mousedirection = function() {
    $(document).on("mousemove", function(e) {
      var activeElement = e.target || e.srcElement;
      if (e.pageX > oldx) {
        direction = "right";
      }
      else if (e.pageX < oldx) {
        direction = "left";
      }

      //$(activeElement).trigger(direction);
      $(activeElement).trigger({
        type: "mousedirection",
        direction: direction
      });
      oldx = e.pageX;
    });
  };
})(jQuery);


/* ************************************************************************

      DEPRECATED FUNCTIONS
      
************************************************************************** */


//Prevent the setTimeout being called multiple times
//Note: Doesn't guarantee running
delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

