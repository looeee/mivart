(function($) {
  /** @type {function (Object): ?} */
  var extra = $.fn.wowSlider;
  /**
   * @param {Object} options
   * @return {?}
   */
  $.fn.wowSlider = function(options) {
    /**
     * @return {undefined}
     */
    function isVisible() {
      var content = $(".ws_prev");
      var elem = $(".ws_next");
      try {
        if (n == 0) {
          content.css("display", "none");
        } else {
          content.css("display", "block");
        }
        if (n == l - 1) {
          elem.css("display", "none");
        } else {
          elem.css("display", "block");
        }
      } catch (O) {
      }
    }
    var paused = options.autoPlay;
    var children = $(".ws_images ul")[0].children;
    var l = children.length;
    /** @type {null} */
    var tref = null;
    var t;
    /** @type {boolean} */
    var foundToken = true;
    if (this.hasClass("delays")) {
      /** @type {boolean} */
      options.autoPlay = false;
      /** @type {Array} */
      var responses = new Array;
      /** @type {number} */
      var i = 0;
      for (;i < l;i++) {
        responses[i] = $(children[i]).data("delay") || options.delay;
      }
      /**
       * @return {undefined}
       */
      var poll = function() {
        clearTimeout(tref);
        /** @type {number} */
        tref = setTimeout(function() {
          if (paused && (t && !foundToken)) {
            t[0].wsStart();
          } else {
            /** @type {boolean} */
            foundToken = false;
          }
          poll();
        }, responses[n] + options.duration);
      };
      poll();
    }
    var request = options.onBeforeStep;
    var client = options.onStep;
    $.extend(options, {
      /**
       * @param {number} callback
       * @param {?} element
       * @return {?}
       */
      onBeforeStep : function(callback, element) {
        if (!paused && t) {
          t[0].wsStop();
          return callback;
        } else {
          if (request) {
            return request.apply(this, [callback, element]);
          } else {
            return callback + 1;
          }
        }
      },
      /**
       * @param {boolean} callback
       * @param {?} value
       * @return {undefined}
       */
      onStep : function(callback, value) {
        if (client) {
          client.apply(this, [callback, value]);
        }
        /** @type {boolean} */
        n = callback;
        if (li) {
          if (li.hasClass("delays")) {
            poll();
          }
          if (li.hasClass("stoptitles")) {
            $(".ws-title, .ws-title>").stop(1, 1).stop(1, 1);
          }
          if (li.hasClass("hidecontrolls")) {
            isVisible();
          }
        }
      }
    });
    t = extra.apply(this, [options]);
    var n = options.startSlide || 0;
    var li = this;
    var duration = options.duration;
    /** @type {null} */
    var M = null;
    /** @type {boolean} */
    var clicked = false;
    if (li.hasClass("hidecontrolls")) {
      isVisible();
    }
    if (li.hasClass("fullscreen")) {
      /**
       * @param {Object} el
       * @param {string} type
       * @param {Function} fn
       * @return {undefined}
       */
      var addEvent = function(el, type, fn) {
        if (el.addEventListener) {
          el.addEventListener(type, fn, false);
        } else {
          el.attachEvent("on" + type, fn);
        }
      };
      /**
       * @param {Object} el
       * @param {string} event
       * @param {Function} fn
       * @return {undefined}
       */
      var unbind = function(el, event, fn) {
        if (el.removeEventListener) {
          el.removeEventListener(event, fn);
        } else {
          el.detachEvent("on" + event, fn);
        }
      };
      /**
       * @param {(Array|string)} tokens
       * @param {Object} attrs
       * @return {undefined}
       */
      var save = function(tokens, attrs) {
        if (!tokens.length) {
          /** @type {Array} */
          tokens = [tokens];
        }
        var attr;
        for (attr in attrs) {
          /** @type {number} */
          var x = 0;
          for (;x < tokens.length;x++) {
            tokens[x].style[attr] = attrs[attr];
          }
        }
      };
      /** @type {number} */
      var h = 0;
      /** @type {string} */
      var prefix = "";
      if (typeof document.cancelFullScreen != "undefined") {
        /** @type {boolean} */
        h = true;
      } else {
        /** @type {Array.<string>} */
        var codeSegments = "webkit moz o ms khtml".split(" ");
        /** @type {number} */
        i = 0;
        /** @type {number} */
        var valuesLen = codeSegments.length;
        for (;i < valuesLen;i++) {
          /** @type {string} */
          prefix = codeSegments[i];
          if (typeof document[prefix + "CancelFullScreen"] != "undefined") {
            /** @type {boolean} */
            h = true;
            break;
          }
        }
      }
      /**
       * @param {?} failing_message
       * @return {?}
       */
      var report = function(failing_message) {
        if (h) {
          switch(prefix) {
            case "":
              return document.fullScreen;
            case "webkit":
              return document.webkitIsFullScreen;
            default:
              return document[prefix + "FullScreen"];
          }
        } else {
          return!!failing_message.eh5v;
        }
      };
      /** @type {number} */
      var failuresLink = 0;
      /** @type {number} */
      var width = 0;
      /**
       * @param {?} element
       * @return {?}
       */
      var init = function(element) {
        if (h) {
          /** @type {number} */
          var dpi = options.width / (options.height + 100);
          /** @type {number} */
          var screenWidth = window.screen.availWidth;
          $(element).css({
            width : screenWidth
          });
          $(element).children().css({
            top : (window.screen.availHeight - screenWidth / dpi) / 2
          });
          return prefix === "" ? element.requestFullScreen() : element[prefix + "RequestFullScreen"]();
        } else {
          if (!element) {
            return;
          }
          if (failuresLink) {
            run(failuresLink);
          }
          /** @type {number} */
          dpi = options.width / (options.height + 100);
          screenWidth = $(window).width();
          var form = $("<div id='viewfullscreen'/>").css({
            position : "absolute",
            width : "100%",
            height : "100%",
            "background-color" : "#000",
            top : 0,
            left : 0,
            "z-index" : 9999999
          });
          form.appendTo("body");
          width = $(element).children().css("max-width");
          form.append($("<div id='container'/>").css({
            "margin-top" : ($(window).height() - screenWidth / dpi) / 2
          }).append($(element).children().css({
            width : screenWidth,
            "max-width" : "95%"
          })));
          (function() {
            var requestUrl = $(".ws_shadow").css("background-image");
            requestUrl = requestUrl.replace("url(", "").replace(")", "").replace(/\/$/, "");
            $(".ws_shadow").css("background-image", "none").append($("<img src=" + requestUrl + "></img>").css("width", "100%"));
          })();
          addEvent(document.body, "keydown", mousedown);
          $("body").focus();
          /** @type {boolean} */
          clicked = !clicked;
        }
      };
      /**
       * @param {number} el
       * @return {?}
       */
      var run = function(el) {
        if (h) {
          return prefix === "" ? document.cancelFullScreen() : document[prefix + "CancelFullScreen"]();
        } else {
          if (!el) {
            return;
          }
          (function() {
            /** @type {string} */
            var y = "url(" + $(".ws_shadow>img").attr("src") + ")";
            $(".ws_shadow").css("background-image", y).empty();
          })();
          $("#viewfullscreen>#container").children().css({
            width : "",
            "max-width" : width
          }).appendTo($(el));
          $("#viewfullscreen").remove();
          unbind(document.body, "keydown", mousedown);
          /** @type {number} */
          failuresLink = 0;
          /** @type {boolean} */
          clicked = !clicked;
        }
      };
      /**
       * @param {?} event
       * @return {undefined}
       */
      var mousedown = function(event) {
        if (event.keyCode == 27) {
          show(true);
        }
      };
      $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function() {
        /** @type {boolean} */
        clicked = !clicked;
        $("");
        if (!clicked) {
          show(true);
        }
      });
      /**
       * @param {boolean} dataAndEvents
       * @return {undefined}
       */
      var show = function(dataAndEvents) {
        if (!dataAndEvents) {
          var ul = $("<div id='fullscreen'/>");
          ul.appendTo(li.parent());
          ul.append(li);
          init($("#fullscreen")[0]);
          input.removeClass("min");
          input.addClass("max");
        } else {
          run(document);
          li.css({
            top : 0
          });
          $("#fullscreen").parent().append(li);
          $("#fullscreen").remove();
          input.removeClass("max");
          input.addClass("min");
        }
        setTimeout(function() {
          $(".ws_thumbs").trigger("mousemove");
        }, 100);
      };
      var input = $('<a href="#" class="min ws_fulscreen" style="display: block;"></a>');
      input.click(function() {
        show(clicked);
      });
      li.append(input);
    }
    if (li.hasClass("playpause")) {
      var b = $('<a href="#" class="ws_playpause" style="display: block;"></a>');
      if (paused) {
        b.addClass("pause");
      } else {
        b.addClass("play");
      }
      b.click(function() {
        /** @type {boolean} */
        paused = !paused;
        if (!paused) {
          if (!t.hasClass("delays")) {
            t[0].wsStop();
          }
          b.removeClass("pause");
          b.addClass("play");
        } else {
          if (!t.hasClass("delays")) {
            t[0].wsStart();
          }
          b.removeClass("play");
          b.addClass("pause");
        }
      });
      li.append(b);
    }
    if (li.hasClass("hidetitles")) {
      $(".ws-title").addClass("ws_hovershow");
      $(".ws_playpause").addClass("ws_hovershow");
      if (navigator.appName == "Microsoft Internet Explorer") {
        /** @type {number} */
        var q = -1;
        /** @type {string} */
        var ua = navigator.userAgent;
        /** @type {RegExp} */
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) {
          /** @type {number} */
          q = parseFloat(RegExp.$1);
        }
        if (q != -1 && q <= 8) {
          li.hover(function() {
            $(".ws_hovershow").animate({
              opacity : 1
            }, {
              /**
               * @param {string} dt
               * @param {?} error
               * @return {undefined}
               */
              step : function(dt, error) {
                $(this).css("-ms-filter", '"progid:DXImageTransform.Microsoft.Alpha(Opacity="' + dt + ')"');
              },
              duration : 200
            }, 200);
          }, function() {
            $(".ws_hovershow").animate({
              opacity : 0
            }, {
              /**
               * @param {string} dt
               * @param {?} error
               * @return {undefined}
               */
              step : function(dt, error) {
                $(this).css("-ms-filter", '"progid:DXImageTransform.Microsoft.Alpha(Opacity="' + dt + ')"');
              },
              duration : 200
            }, 200);
          });
        }
      }
    }
    return t;
  };
})(jQuery);
(function($) {
  /** @type {function (Object): ?} */
  var extra = $.fn.wowSlider;
  /**
   * @param {Object} options
   * @return {?}
   */
  $.fn.wowSlider = function(options) {
    /**
     * @return {undefined}
     */
    function isVisible() {
      var content = $(".ws_prev");
      var elem = $(".ws_next");
      try {
        if (objUid == 0) {
          content.css("display", "none");
        } else {
          content.css("display", "block");
        }
        if (objUid == l - 1) {
          elem.css("display", "none");
        } else {
          elem.css("display", "block");
        }
      } catch (O) {
      }
    }
    var s = options.autoPlay;
    var children = $(".ws_images ul")[0].children;
    var l = children.length;
    /** @type {null} */
    var tref = null;
    var o;
    /** @type {boolean} */
    var F = true;
    if (this.hasClass("delays")) {
      /** @type {boolean} */
      options.autoPlay = false;
      /** @type {Array} */
      var map = new Array;
      /** @type {number} */
      var i = 0;
      for (;i < l;i++) {
        map[i] = $(children[i]).data("delay") || options.delay;
      }
      /**
       * @return {undefined}
       */
      var poll = function() {
        clearTimeout(tref);
        /** @type {number} */
        tref = setTimeout(function() {
          if (s && (o && !F)) {
            o[0].wsStart();
          } else {
            /** @type {boolean} */
            F = false;
          }
          poll();
        }, map[objUid] + options.duration);
      };
      poll();
    }
    var request = options.onBeforeStep;
    var self = options.onStep;
    $.extend(options, {
      /**
       * @param {number} callback
       * @param {?} element
       * @return {?}
       */
      onBeforeStep : function(callback, element) {
        if (!s && o) {
          o[0].wsStop();
          return callback;
        } else {
          if (request) {
            return request.apply(this, [callback, element]);
          } else {
            return callback + 1;
          }
        }
      },
      /**
       * @param {boolean} params
       * @param {?} value
       * @return {undefined}
       */
      onStep : function(params, value) {
        if (self) {
          self.apply(this, [params, value]);
        }
        /** @type {boolean} */
        objUid = params;
        if (li) {
          if (li.hasClass("delays")) {
            poll();
          }
          if (li.hasClass("stoptitles")) {
            $(".ws-title, .ws-title>").stop(1, 1).stop(1, 1);
          }
          if (li.hasClass("hidecontrolls")) {
            isVisible();
          }
        }
      }
    });
    o = extra.apply(this, [options]);
    var objUid = options.startSlide || 0;
    var li = this;
    var duration = options.duration;
    /** @type {null} */
    var M = null;
    /** @type {boolean} */
    var dataAndEvents = false;
    if (li.hasClass("hidecontrolls")) {
      isVisible();
    }
    if (li.hasClass("fullscreen")) {
      /**
       * @param {Object} el
       * @param {string} type
       * @param {Function} fn
       * @return {undefined}
       */
      var addEvent = function(el, type, fn) {
        if (el.addEventListener) {
          el.addEventListener(type, fn, false);
        } else {
          el.attachEvent("on" + type, fn);
        }
      };
      /**
       * @param {Object} el
       * @param {string} event
       * @param {Function} fn
       * @return {undefined}
       */
      var unbind = function(el, event, fn) {
        if (el.removeEventListener) {
          el.removeEventListener(event, fn);
        } else {
          el.detachEvent("on" + event, fn);
        }
      };
      /**
       * @param {(Array|string)} tokens
       * @param {Object} attrs
       * @return {undefined}
       */
      var save = function(tokens, attrs) {
        if (!tokens.length) {
          /** @type {Array} */
          tokens = [tokens];
        }
        var attr;
        for (attr in attrs) {
          /** @type {number} */
          var x = 0;
          for (;x < tokens.length;x++) {
            tokens[x].style[attr] = attrs[attr];
          }
        }
      };
      /** @type {number} */
      var h = 0;
      /** @type {string} */
      var prefix = "";
      if (typeof document.cancelFullScreen != "undefined") {
        /** @type {boolean} */
        h = true;
      } else {
        /** @type {Array.<string>} */
        var codeSegments = "webkit moz o ms khtml".split(" ");
        /** @type {number} */
        i = 0;
        /** @type {number} */
        var valuesLen = codeSegments.length;
        for (;i < valuesLen;i++) {
          /** @type {string} */
          prefix = codeSegments[i];
          if (typeof document[prefix + "CancelFullScreen"] != "undefined") {
            /** @type {boolean} */
            h = true;
            break;
          }
        }
      }
      /**
       * @param {?} failing_message
       * @return {?}
       */
      var report = function(failing_message) {
        if (h) {
          switch(prefix) {
            case "":
              return document.fullScreen;
            case "webkit":
              return document.webkitIsFullScreen;
            default:
              return document[prefix + "FullScreen"];
          }
        } else {
          return!!failing_message.eh5v;
        }
      };
      /** @type {number} */
      var failuresLink = 0;
      /** @type {number} */
      var width = 0;
      /**
       * @param {?} element
       * @return {?}
       */
      var init = function(element) {
        if (h) {
          /** @type {number} */
          var dpi = options.width / (options.height + 100);
          /** @type {number} */
          var screenWidth = window.screen.availWidth;
          $(element).css({
            width : screenWidth
          });
          $(element).children().css({
            top : (window.screen.availHeight - screenWidth / dpi) / 2
          });
          return prefix === "" ? element.requestFullScreen() : element[prefix + "RequestFullScreen"]();
        } else {
          if (!element) {
            return;
          }
          if (failuresLink) {
            run(failuresLink);
          }
          /** @type {number} */
          dpi = options.width / (options.height + 100);
          screenWidth = $(window).width();
          var form = $("<div id='viewfullscreen'/>").css({
            position : "absolute",
            width : "100%",
            height : "100%",
            "background-color" : "#000",
            top : 0,
            left : 0,
            "z-index" : 9999999
          });
          form.appendTo("body");
          width = $(element).children().css("max-width");
          form.append($("<div id='container'/>").css({
            "margin-top" : ($(window).height() - screenWidth / dpi) / 2
          }).append($(element).children().css({
            width : screenWidth,
            "max-width" : "95%"
          })));
          (function() {
            var requestUrl = $(".ws_shadow").css("background-image");
            requestUrl = requestUrl.replace("url(", "").replace(")", "").replace(/\/$/, "");
            $(".ws_shadow").css("background-image", "none").append($("<img src=" + requestUrl + "></img>").css("width", "100%"));
          })();
          addEvent(document.body, "keydown", mousedown);
          $("body").focus();
          /** @type {boolean} */
          dataAndEvents = !dataAndEvents;
        }
      };
      /**
       * @param {number} el
       * @return {?}
       */
      var run = function(el) {
        if (h) {
          return prefix === "" ? document.cancelFullScreen() : document[prefix + "CancelFullScreen"]();
        } else {
          if (!el) {
            return;
          }
          (function() {
            /** @type {string} */
            var y = "url(" + $(".ws_shadow>img").attr("src") + ")";
            $(".ws_shadow").css("background-image", y).empty();
          })();
          $("#viewfullscreen>#container").children().css({
            width : "",
            "max-width" : width
          }).appendTo($(el));
          $("#viewfullscreen").remove();
          unbind(document.body, "keydown", mousedown);
          /** @type {number} */
          failuresLink = 0;
          /** @type {boolean} */
          dataAndEvents = !dataAndEvents;
        }
      };
      /**
       * @param {?} event
       * @return {undefined}
       */
      var mousedown = function(event) {
        if (event.keyCode == 27) {
          setup(true);
        }
      };
      $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function() {
        /** @type {boolean} */
        dataAndEvents = !dataAndEvents;
        $("");
        if (!dataAndEvents) {
          setup(true);
        }
      });
      /**
       * @param {boolean} dataAndEvents
       * @return {undefined}
       */
      var setup = function(dataAndEvents) {
        if (!dataAndEvents) {
          var ul = $("<div id='ws_fullscreen'/>");
          ul.appendTo(li.parent());
          ul.append(li);
          init($("#ws_fullscreen")[0]);
        } else {
          run(document);
          li.css({
            top : 0
          });
          $("#ws_fullscreen").parent().append(li);
          $("#ws_fullscreen").remove();
        }
        setTimeout(function() {
          $(".ws_thumbs").trigger("mousemove");
        }, 100);
      };
      var a = $('<a href="#" class="min ws_fullscreen" style="display: block;"></a>');
      a.click(function() {
        setup(dataAndEvents);
      });
      li.append(a);
    }
    if (li.hasClass("playpause")) {
      var b = $('<a href="#" class="ws_playpause ws_hovershow" style="display: block;"></a>');
      if (s) {
        b.addClass("pause");
      } else {
        b.addClass("play");
      }
      b.click(function() {
        /** @type {boolean} */
        s = !s;
        if (!s) {
          if (!o.hasClass("delays")) {
            o[0].wsStop();
          }
          b.removeClass("pause");
          b.addClass("play");
        } else {
          if (!o.hasClass("delays")) {
            o[0].wsStart();
          }
          b.removeClass("play");
          b.addClass("pause");
        }
      });
      li.append(b);
    }
    if (li.hasClass("hidetitles")) {
      $(".ws-title").addClass("ws_hovershow");
      if (navigator.appName == "Microsoft Internet Explorer") {
        /** @type {number} */
        var q = -1;
        /** @type {string} */
        var ua = navigator.userAgent;
        /** @type {RegExp} */
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) {
          /** @type {number} */
          q = parseFloat(RegExp.$1);
        }
        if (q != -1 && q <= 8) {
          li.hover(function() {
            $(".ws_hovershow").animate({
              opacity : 1
            }, {
              /**
               * @param {string} dt
               * @param {?} error
               * @return {undefined}
               */
              step : function(dt, error) {
                $(this).css("-ms-filter", '"progid:DXImageTransform.Microsoft.Alpha(Opacity="' + dt + ')"');
              },
              duration : 200
            }, 200);
          }, function() {
            $(".ws_hovershow").animate({
              opacity : 0
            }, {
              /**
               * @param {string} dt
               * @param {?} error
               * @return {undefined}
               */
              step : function(dt, error) {
                $(this).css("-ms-filter", '"progid:DXImageTransform.Microsoft.Alpha(Opacity="' + dt + ')"');
              },
              duration : 200
            }, 200);
          });
        }
      }
    }
    return o;
  };
})(jQuery);
