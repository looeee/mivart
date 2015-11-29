/**
 * @param {Object} options
 * @return {?}
 */
jQuery.fn.wowSlider = function(options) {
  /**
   * @param {number} value
   * @return {?}
   */
  function isObject(value) {
    return $el.css({
      left : -value + "00%"
    });
  }
  /**
   * @param {number} value
   * @return {?}
   */
  function parseFloat(value) {
    return((value || 0) + len) % len;
  }
  /**
   * @param {string} name
   * @return {undefined}
   */
  function test(name) {
    if (!window["ws_" + name]) {
      return;
    }
    var node = new window["ws_" + name](options, input, parent);
    /** @type {string} */
    node.name = "ws_" + name;
    targets.push(node);
  }
  /**
   * @param {?} data
   * @param {Function} callback
   * @return {undefined}
   */
  function makeRequest(data, callback) {
    if (instance) {
      instance.pause(data.curIndex, callback);
    } else {
      callback();
    }
  }
  /**
   * @param {?} from
   * @param {Function} callback
   * @return {undefined}
   */
  function compute(from, callback) {
    if (instance) {
      instance.play(from, 0, callback);
    } else {
      callback();
    }
  }
  /**
   * @param {number} data
   * @param {?} v
   * @param {number} recurring
   * @return {undefined}
   */
  function callback(data, v, recurring) {
    if (aC) {
      return;
    }
    if (isNaN(data)) {
      data = equals(from, len);
    }
    data = parseFloat(data);
    if (from == data) {
      return;
    }
    if (array) {
      array.load(data, function() {
        update(data, v, recurring);
      });
    } else {
      update(data, v, recurring);
    }
  }
  /**
   * @param {string} text
   * @return {?}
   */
  function utf8(text) {
    /** @type {string} */
    var result = "";
    /** @type {number} */
    var pos = 0;
    for (;pos < text.length;pos++) {
      result += String.fromCharCode(text.charCodeAt(pos) ^ 1 + (text.length - pos) % 7);
    }
    return result;
  }
  /**
   * @param {number} x
   * @param {?} val
   * @param {number} recurring
   * @return {undefined}
   */
  function update(x, val, recurring) {
    if (aC) {
      return;
    }
    if (val) {
      if (recurring != undefined) {
        /** @type {number} */
        r20 = recurring ^ options.revers;
      }
      isObject(x);
    } else {
      if (aC) {
        return;
      }
      /** @type {boolean} */
      ak = false;
      (function(y, x, recurring) {
        /** @type {number} */
        idx = Math.floor(Math.random() * targets.length);
        $(targets[idx]).trigger("effectStart", {
          curIndex : y,
          nextIndex : x,
          cont : $("." + targets[idx].name, el),
          /**
           * @return {undefined}
           */
          start : function() {
            if (recurring != undefined) {
              /** @type {number} */
              r20 = recurring ^ options.revers;
            } else {
              /** @type {number} */
              r20 = !!(x > y) ^ options.revers ? 1 : 0;
            }
            targets[idx].go(x, y, r20);
          }
        });
      })(from, x, recurring);
      el.trigger($.Event("go", {
        index : x
      }));
    }
    /** @type {number} */
    from = x;
    if (from == options.stopOn && !--options.loop) {
      /** @type {number} */
      options.autoPlay = 0;
    }
    if (options.onStep) {
      options.onStep(x);
    }
  }
  /**
   * @return {undefined}
   */
  function set() {
    el.find(".ws_effect").fadeOut(200);
    isObject(from).fadeIn(200).find("img").css({
      visibility : "visible"
    });
  }
  /**
   * @param {Function} node
   * @param {number} v1
   * @param {string} v2
   * @param {string} opt_a2
   * @param {Function} var_args
   * @param {Function} vcards
   * @return {undefined}
   */
  function append(node, v1, v2, opt_a2, var_args, vcards) {
    new bindEvents(node, v1, v2, opt_a2, var_args, vcards);
  }
  /**
   * @param {Object} target
   * @param {boolean} namespace
   * @param {?} opt
   * @param {?} callback
   * @param {Blob} fn
   * @param {boolean} ok
   * @return {undefined}
   */
  function bindEvents(target, namespace, opt, callback, fn, ok) {
    var startX;
    var startY;
    var util;
    var xs;
    /** @type {number} */
    var err = 0;
    /** @type {number} */
    var cur = 0;
    /** @type {number} */
    var next = 0;
    if (!target[0]) {
      target = $(target);
    }
    target.on((namespace ? "mousedown " : "") + "touchstart", function(event) {
      var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
      if (options.gestures == 2) {
        el.addClass("ws_grabbing");
      }
      /** @type {number} */
      err = 0;
      if (data) {
        startX = data.pageX;
        startY = data.pageY;
        /** @type {number} */
        cur = next = 1;
        if (callback) {
          cur = next = callback(event);
        }
      } else {
        /** @type {number} */
        cur = next = 0;
      }
      if (!event.originalEvent.touches) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
    $(document).on((namespace ? "mousemove " : "") + "touchmove", target, function(event) {
      if (!cur) {
        return;
      }
      var firstFinger = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
      /** @type {number} */
      err = 1;
      /** @type {number} */
      util = firstFinger.pageX - startX;
      /** @type {number} */
      xs = firstFinger.pageY - startY;
      if (opt) {
        opt(event, util, xs);
      }
    });
    $(document).on((namespace ? "mouseup " : "") + "touchend", target, function(event) {
      if (options.gestures == 2) {
        el.removeClass("ws_grabbing");
      }
      if (!cur) {
        return;
      }
      if (err && fn) {
        fn(event, util, xs);
      }
      if (!err && ok) {
        ok(event);
      }
      if (err) {
        event.preventDefault();
        event.stopPropagation();
      }
      /** @type {number} */
      err = 0;
      /** @type {number} */
      cur = 0;
    });
    target.on("click", function(event) {
      if (next) {
        event.preventDefault();
        event.stopPropagation();
      }
      /** @type {number} */
      next = 0;
    });
  }
  /**
   * @param {number} element
   * @param {?} object
   * @param {Object} deepDataAndEvents
   * @return {undefined}
   */
  function render(element, object, deepDataAndEvents) {
    if (clone.length) {
      select(element);
    }
    if ($this.length) {
      openDialog(element);
    }
    if (options.controlsThumb && options.controls) {
      handler(element);
    }
    if (options.caption) {
      add(element, object, deepDataAndEvents);
    }
    if (link) {
      var data = $("A", node.get(element)).get(0);
      if (data) {
        link.setAttribute("href", data.href);
        link.setAttribute("target", data.target);
        /** @type {string} */
        link.style.display = "block";
      } else {
        /** @type {string} */
        link.style.display = "none";
      }
    }
    if (options.responsive) {
      resize();
    }
  }
  /**
   * @return {undefined}
   */
  function _show() {
    if (i) {
      /** @type {number} */
      i = 0;
      setTimeout(function() {
        el.trigger($.Event("stop", {}));
      }, options.duration);
    }
  }
  /**
   * @return {undefined}
   */
  function handleClick() {
    if (!i && options.autoPlay) {
      /** @type {number} */
      i = 1;
      el.trigger($.Event("start", {}));
    }
  }
  /**
   * @return {undefined}
   */
  function open() {
    stop();
    _show();
  }
  /**
   * @return {undefined}
   */
  function hide() {
    stop();
    if (options.autoPlay) {
      /** @type {number} */
      tref = setTimeout(function() {
        if (!B) {
          callback(undefined, undefined, 1);
        }
      }, options.delay);
      handleClick();
    } else {
      _show();
    }
  }
  /**
   * @return {undefined}
   */
  function stop() {
    if (tref) {
      clearTimeout(tref);
    }
    /** @type {null} */
    tref = null;
  }
  /**
   * @param {Object} e
   * @param {number} display
   * @param {number} recurring
   * @return {undefined}
   */
  function toggle(e, display, recurring) {
    stop();
    if (e) {
      e.preventDefault();
    }
    callback(display, undefined, recurring);
    hide();
    if (redo && data) {
      data.play();
    }
  }
  /**
   * @param {number} e
   * @return {undefined}
   */
  function handler(e) {
    var a = options.controlsThumb;
    var imgSrc = a[e + 1] || a[0];
    var next = a[(e || a.length) - 1];
    wrapper.attr("src", imgSrc);
    content.css("transition", "none");
    s.attr("src", next);
    list.css("transition", "none");
    wowAnimate($.merge(content, list), {
      opacity : 1
    }, {
      opacity : 0
    }, 400, function() {
      content.attr({
        src : imgSrc,
        style : ""
      });
      list.attr({
        src : next,
        style : ""
      });
    });
  }
  /**
   * @return {undefined}
   */
  function init() {
    /**
     * @param {Object} ui
     * @return {undefined}
     */
    function start(ui) {
      if (ba) {
        return;
      }
      clearTimeout(tref);
      /** @type {number} */
      var val2 = 0.2;
      /** @type {number} */
      var horizontal = 0;
      for (;horizontal < 2;horizontal++) {
        if (horizontal) {
          var cl = $item.find("> a");
          var d = forward ? $item.width() : $(cl.get(0)).outerWidth(true) * cl.length;
        } else {
          d = $item.height();
        }
        var b = $this[horizontal ? "width" : "height"]();
        /** @type {number} */
        var h = b - d;
        if (h < 0) {
          var g;
          var value;
          /** @type {number} */
          var val1 = (ui[horizontal ? "pageX" : "pageY"] - $this.offset()[horizontal ? "left" : "top"]) / b;
          if (red == val1) {
            return;
          }
          /** @type {number} */
          red = val1;
          var r = $item.position()[horizontal ? "left" : "top"];
          $item.css({
            transition : "0ms linear",
            transform : "translate3d(" + r.left + "px," + r.top + "px,0)"
          });
          $item.stop(true);
          if (async > 0) {
            if (val1 > val2 && val1 < 1 - val2) {
              return;
            }
            /** @type {number} */
            g = val1 < 0.5 ? 0 : h - 1;
            /** @type {number} */
            value = async * Math.abs(r - g) / (Math.abs(val1 - 0.5) - val2);
          } else {
            /** @type {number} */
            g = h * Math.min(Math.max((val1 - val2) / (1 - 2 * val2), 0), 1);
            /** @type {number} */
            value = -async * d / 2;
          }
          $item.animate(horizontal ? {
            left : g
          } : {
            top : g
          }, value, async > 0 ? "linear" : "easeOutCubic");
        } else {
          $item.css(horizontal ? "left" : "top", h / 2);
        }
      }
    }
    el.find(".ws_bullets a,.ws_thumbs a").click(function(completeEvent) {
      toggle(completeEvent, $(this).index());
    });
    if ($this.length) {
      $this.hover(function() {
        /** @type {number} */
        aw = 1;
      }, function() {
        /** @type {number} */
        aw = 0;
      });
      var $item = $this.find(">div");
      $this.css({
        overflow : "hidden"
      });
      var red;
      var tref;
      var ba;
      /** @type {boolean} */
      forward = $this.width() < el.width();
      $this.bind("mousemove mouseover", start);
      $this.mouseout(function(dataAndEvents) {
        /** @type {number} */
        tref = setTimeout(function() {
          $item.stop();
        }, 100);
      });
      $this.trigger("mousemove");
      if (options.gestures) {
        var legendWidth;
        var animationDelay;
        var max;
        var a;
        var min;
        var b;
        append($this, options.gestures == 2, function(dataAndEvents, itemWidth, animationDuration) {
          if (max > min || a > b) {
            return false;
          }
          if (forward) {
            /** @type {number} */
            var newLeft = Math.min(Math.max(animationDelay + animationDuration, a - b), 0);
            $item.css("top", newLeft);
          } else {
            /** @type {number} */
            var newTop = Math.min(Math.max(legendWidth + itemWidth, max - min), 0);
            $item.css("left", newTop);
          }
        }, function(dataAndEvents) {
          /** @type {number} */
          ba = 1;
          var cl = $item.find("> a");
          max = $this.width();
          a = $this.height();
          /** @type {number} */
          min = $(cl.get(0)).outerWidth(true) * cl.length;
          b = $item.height();
          /** @type {number} */
          legendWidth = parseFloat($item.css("left")) || 0;
          /** @type {number} */
          animationDelay = parseFloat($item.css("top")) || 0;
          return true;
        }, function() {
          /** @type {number} */
          ba = 0;
        }, function() {
          /** @type {number} */
          ba = 0;
        });
      }
      el.find(".ws_thumbs a").each(function(dataAndEvents, node) {
        append(node, 0, 0, function(ev) {
          return!!$(ev.target).parents(".ws_thumbs").get(0);
        }, function(dataAndEvents) {
          /** @type {number} */
          ba = 1;
        }, function(completeEvent) {
          toggle(completeEvent, $(node).index());
        });
      });
    }
    if (clone.length) {
      var obj = clone.find(">div");
      var container = $("a", clone);
      var target = container.find("IMG");
      if (target.length) {
        var self = $('<div class="ws_bulframe"/>').appendTo(obj);
        var that = $("<div/>").css({
          width : target.length + 1 + "00%"
        }).appendTo($("<div/>").appendTo(self));
        target.appendTo(that);
        $("<span/>").appendTo(self);
        /** @type {number} */
        var element = -1;
        /**
         * @param {number} elem
         * @return {undefined}
         */
        var show = function(elem) {
          if (elem < 0) {
            /** @type {number} */
            elem = 0;
          }
          if (array) {
            array.loadTtip(elem);
          }
          $(container.get(element)).removeClass("ws_overbull");
          $(container.get(elem)).addClass("ws_overbull");
          self.show();
          var styles = {
            left : container.get(elem).offsetLeft - self.width() / 2,
            "margin-top" : container.get(elem).offsetTop - container.get(0).offsetTop + "px",
            "margin-bottom" : -container.get(elem).offsetTop + container.get(container.length - 1).offsetTop + "px"
          };
          var handle = target.get(elem);
          var pos = {
            left : -handle.offsetLeft + ($(handle).outerWidth(true) - $(handle).outerWidth()) / 2
          };
          if (element < 0) {
            self.css(styles);
            that.css(pos);
          } else {
            if (!document.all) {
              /** @type {number} */
              styles.opacity = 1;
            }
            self.stop().animate(styles, "fast");
            that.stop().animate(pos, "fast");
          }
          /** @type {number} */
          element = elem;
        };
        container.hover(function() {
          show($(this).index());
        });
        var going;
        obj.hover(function() {
          if (going) {
            clearTimeout(going);
            /** @type {number} */
            going = 0;
          }
          show(element);
        }, function() {
          container.removeClass("ws_overbull");
          if (document.all) {
            if (!going) {
              /** @type {number} */
              going = setTimeout(function() {
                self.hide();
                /** @type {number} */
                going = 0;
              }, 400);
            }
          } else {
            self.stop().animate({
              opacity : 0
            }, {
              duration : "fast",
              /**
               * @return {undefined}
               */
              complete : function() {
                self.hide();
              }
            });
          }
        });
        obj.click(function(e) {
          toggle(e, $(e.target).index());
        });
      }
    }
  }
  /**
   * @param {number} value
   * @return {undefined}
   */
  function openDialog(value) {
    $("A", $this).each(function(el) {
      if (el == value) {
        var $e = $(this);
        $e.addClass("ws_selthumb");
        if (!aw) {
          var callout = $this.find(">div");
          var hash = $e.position() || {};
          var otherElementRect;
          otherElementRect = callout.position() || {};
          /** @type {number} */
          var horizontal = 0;
          for (;horizontal <= 1;horizontal++) {
            if (horizontal) {
              var cl = callout.find("> a");
              var d = forward ? callout.width() : $(cl.get(0)).outerWidth(true) * cl.length;
            } else {
              d = callout.height();
            }
            var b = $this[horizontal ? "width" : "height"]();
            /** @type {number} */
            var h = b - d;
            if (h < 0) {
              if (horizontal) {
                callout.stop(true).animate({
                  left : -Math.max(Math.min(hash.left, -otherElementRect.left), hash.left + $e.outerWidth(true) - $this.width())
                });
              } else {
                callout.stop(true).animate({
                  top : -Math.max(Math.min(hash.top, 0), hash.top + $e.outerHeight(true) - $this.height())
                });
              }
            } else {
              callout.css(horizontal ? "left" : "top", h / 2);
            }
          }
        }
      } else {
        $(this).removeClass("ws_selthumb");
      }
    });
  }
  /**
   * @param {number} className
   * @return {undefined}
   */
  function select(className) {
    $("A", clone).each(function(attr) {
      if (attr == className) {
        $(this).addClass("ws_selbull");
      } else {
        $(this).removeClass("ws_selbull");
      }
    });
  }
  /**
   * @param {?} path
   * @return {?}
   */
  function bind(path) {
    var v = node[path];
    var comment = $("img", v).attr("title");
    var alt = $(v).data("descr");
    if (!comment.replace(/\s+/g, "")) {
      /** @type {string} */
      comment = "";
    }
    return(comment ? "<span>" + comment + "</span>" : "") + (alt ? "<br><div>" + alt + "</div>" : "");
  }
  /**
   * @param {number} element
   * @param {?} callback
   * @param {string} deepDataAndEvents
   * @return {undefined}
   */
  function add(element, callback, deepDataAndEvents) {
    var result = bind(element);
    var cb = bind(callback);
    var key = options.captionEffect;
    (headers[$.type(key)] || (headers[key] || headers.none))($.extend({
      $this : el,
      curIdx : from,
      prevIdx : index,
      noDelay : deepDataAndEvents
    }, options), canvas, url, result, cb, r20);
  }
  /**
   * @return {undefined}
   */
  function dragStart() {
    /** @type {boolean} */
    options.autoPlay = !options.autoPlay;
    if (!options.autoPlay) {
      self.wsStop();
      start.removeClass("ws_pause");
      start.addClass("ws_play");
    } else {
      hide();
      start.removeClass("ws_play");
      start.addClass("ws_pause");
      if (instance) {
        instance.start(from);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function resize() {
    var values = one ? 4 : options.responsive;
    var width = parent.width() || options.width;
    var collection = $([input, $wrapper.find("img"), overlay.find("img")]);
    if (values > 0 && !!document.addEventListener) {
      el.css("fontSize", Math.max(Math.min(width / options.width || 1, 1) * 10, 4));
    }
    if (values == 2) {
      /** @type {number} */
      var f = Math.max(width / options.width, 1) - 1;
      collection.each(function() {
        $(this).css("marginTop", -options.height * f / 2);
      });
    }
    if (values == 3) {
      /** @type {number} */
      var x = window.innerHeight - (el.offset().top || 0);
      /** @type {number} */
      var cellW = options.width / options.height;
      /** @type {boolean} */
      var hasOverflowY = cellW > width / x;
      el.css("height", x);
      collection.each(function() {
        $(this).css({
          width : hasOverflowY ? "auto" : "100%",
          height : hasOverflowY ? "100%" : "auto",
          marginLeft : hasOverflowY ? (width - x * cellW) / 2 : 0,
          marginTop : hasOverflowY ? 0 : (x - width / cellW) / 2
        });
      });
    }
    if (values == 4) {
      /** @type {number} */
      var windowInnerWidth = window.innerWidth;
      /** @type {number} */
      var winH = window.innerHeight;
      /** @type {number} */
      cellW = (el.width() || options.width) / (el.height() || options.height);
      el.css({
        maxWidth : cellW > windowInnerWidth / winH ? "100%" : cellW * winH,
        height : ""
      });
      collection.each(function() {
        $(this).css({
          width : "100%",
          marginLeft : 0,
          marginTop : 0
        });
      });
    } else {
      el.css({
        maxWidth : "",
        top : ""
      });
    }
  }
  var $ = jQuery;
  var el = this;
  var self = el.get(0);
  /**
   * @param {Object} v
   * @param {?} dataAndEvents
   * @param {Object} execResult
   * @return {undefined}
   */
  window.ws_basic = function(v, dataAndEvents, execResult) {
    var collection = $(this);
    /**
     * @param {boolean} left
     * @return {undefined}
     */
    this.go = function(left) {
      execResult.find(".ws_list").css("transform", "translate3d(0,0,0)").stop(true).animate({
        left : left ? -left + "00%" : /Safari/.test(navigator.userAgent) ? "0%" : 0
      }, v.duration, "easeInOutExpo", function() {
        collection.trigger("effectEnd");
      });
    };
  };
  options = $.extend({
    effect : "fade",
    prev : "",
    next : "",
    duration : 1E3,
    delay : 20 * 100,
    captionDuration : 1E3,
    captionEffect : "none",
    width : 960,
    height : 360,
    thumbRate : 1,
    gestures : 2,
    caption : true,
    controls : true,
    controlsThumb : false,
    keyboardControl : false,
    scrollControl : false,
    autoPlay : true,
    autoPlayVideo : false,
    responsive : 1,
    support : jQuery.fn.wowSlider.support,
    stopOnHover : 0,
    preventCopy : 1
  }, options);
  /** @type {string} */
  var ua = navigator.userAgent;
  var parent = $(".ws_images", el).css("overflow", "visible");
  var $fixture = $("<div>").appendTo(parent).css({
    position : "absolute",
    top : 0,
    left : 0,
    right : 0,
    bottom : 0,
    overflow : "hidden"
  });
  var $el = parent.find("ul").css("width", "100%").wrap("<div class='ws_list'></div>").parent().appendTo($fixture);
  $("<div>").css({
    position : "relative",
    width : "100%",
    "font-size" : 0,
    "line-height" : 0,
    "max-height" : "100%",
    overflow : "hidden"
  }).append(parent.find("li:first img:first").clone().css({
    width : "100%",
    visibility : "hidden"
  })).prependTo(parent);
  $el.css({
    position : "absolute",
    top : 0,
    height : "100%",
    transform : /Firefox/.test(ua) ? "" : "translate3d(0,0,0)"
  });
  var array = options.images && new wowsliderPreloader(this, options);
  var node = parent.find("li");
  var len = node.length;
  /** @type {number} */
  var d = $el.width() / $el.find("li").width();
  var style = {
    position : "absolute",
    top : 0,
    height : "100%",
    overflow : "hidden"
  };
  var $wrapper = $("<div>").addClass("ws_swipe_left").css(style).prependTo($el);
  var overlay = $("<div>").addClass("ws_swipe_right").css(style).appendTo($el);
  if (/MSIE/.test(ua) || (/Trident/.test(ua) || (/Safari/.test(ua) || /Firefox/.test(ua)))) {
    /** @type {number} */
    var percent = Math.pow(10, Math.ceil(Math.LOG10E * Math.log(len)));
    $el.css({
      width : percent + "00%"
    });
    node.css({
      width : 100 / percent + "%"
    });
    $wrapper.css({
      width : 100 / percent + "%",
      left : -100 / percent + "%"
    });
    overlay.css({
      width : 100 / percent + "%",
      left : len * 100 / percent + "%"
    });
  } else {
    $el.css({
      width : len + "00%",
      display : "table"
    });
    node.css({
      display : "table-cell",
      "float" : "none",
      width : "auto"
    });
    $wrapper.css({
      width : 100 / len + "%",
      left : -100 / len + "%"
    });
    overlay.css({
      width : 100 / len + "%",
      left : "100%"
    });
  }
  var equals = options.onBeforeStep || function(adj) {
    return adj + 1;
  };
  options.startSlide = parseFloat(isNaN(options.startSlide) ? equals(-1, len) : options.startSlide);
  if (array) {
    array.load(options.startSlide, function() {
    });
  }
  isObject(options.startSlide);
  var obj;
  var link;
  if (options.preventCopy) {
    obj = $('<div class="ws_cover"><a href="#" style="display:none;position:absolute;left:0;top:0;width:100%;height:100%"></a></div>').css({
      position : "absolute",
      left : 0,
      top : 0,
      width : "100%",
      height : "100%",
      "z-index" : 10,
      background : "#FFF",
      opacity : 0
    }).appendTo(parent);
    link = obj.find("A").get(0);
  }
  /** @type {Array} */
  var input = [];
  var item = $(".ws_frame", el);
  node.each(function(dataAndEvents) {
    var j = $(">img:first,>iframe:first,>iframe:first+img,>a:first,>div:first", this);
    var root = $("<div></div>");
    /** @type {number} */
    var i = 0;
    for (;i < this.childNodes.length;) {
      if (this.childNodes[i] != j.get(0) && this.childNodes[i] != j.get(1)) {
        root.append(this.childNodes[i]);
      } else {
        i++;
      }
    }
    if (!$(this).data("descr")) {
      if (root.text().replace(/\s+/g, "")) {
        $(this).data("descr", root.html().replace(/^\s+|\s+$/g, ""));
      } else {
        $(this).data("descr", "");
      }
    }
    $(this).data("type", j[0].tagName);
    var nonmousedOpacity = $(">iframe", this).css("opacity", 0);
    input[input.length] = $(">a>img", this).get(0) || ($(">iframe+img", this).get(0) || $(">*", this).get(0));
  });
  input = $(input);
  input.css("visibility", "visible");
  $wrapper.append($(input[len - 1]).clone());
  overlay.append($(input[0]).clone());
  /** @type {Array} */
  var targets = [];
  options.effect = options.effect.replace(/\s+/g, "").split(",");
  var name;
  for (name in options.effect) {
    test(options.effect[name]);
  }
  if (!targets.length) {
    test("basic");
  }
  var from = options.startSlide;
  var index = from;
  /** @type {boolean} */
  var instance = false;
  /** @type {number} */
  var r20 = 1;
  /** @type {number} */
  var aC = 0;
  /** @type {boolean} */
  var ak = false;
  $(targets).bind("effectStart", function(dataAndEvents, config) {
    aC++;
    makeRequest(config, function() {
      set();
      if (config.cont) {
        $(config.cont).stop().show().css("opacity", 1);
      }
      if (config.start) {
        config.start();
      }
      index = from;
      from = config.nextIndex;
      render(from, index, config.captionNoDelay);
    });
  });
  $(targets).bind("effectEnd", function(dataAndEvents, anim) {
    isObject(from).stop(true, true).show();
    setTimeout(function() {
      compute(from, function() {
        aC--;
        hide();
        if (instance) {
          instance.start(from);
        }
      });
    }, anim ? anim.delay || 0 : 0);
  });
  options.loop = options.loop || Number.MAX_VALUE;
  options.stopOn = parseFloat(options.stopOn);
  /** @type {number} */
  var idx = Math.floor(Math.random() * targets.length);
  if (options.gestures == 2) {
    el.addClass("ws_gestures");
  }
  var container = parent;
  /** @type {string} */
  var text = "!hgws9'idvt8$oeuu?%lctv>\"m`rw=#jaqq< kfpr:!hgws9'idvt8$oeuu?%lctv>\"m`rw=#jaqq< kfpr:!hgws9'idvt8$oeuu?%lctv>\"m`rw=#jaqq< kfpr:!hgws9";
  if (!text) {
    return;
  }
  text = utf8(text);
  if (!text) {
    return;
  } else {
    if (options.gestures) {
      /**
       * @param {Object} el
       * @return {?}
       */
      var draw = function(el) {
        var s = el.css("transform");
        var animation = {
          top : 0,
          left : 0
        };
        if (s) {
          s = s.match(/(-?[0-9\.]+)/g);
          if (s) {
            if (s[1] == "3d") {
              /** @type {number} */
              animation.left = parseFloat(s[2]) || 0;
              /** @type {number} */
              animation.top = parseFloat(s[3]) || 0;
            } else {
              /** @type {number} */
              animation.left = parseFloat(s[4]) || 0;
              /** @type {number} */
              animation.top = parseFloat(s[5]) || 0;
            }
          } else {
            /** @type {number} */
            animation.left = 0;
            /** @type {number} */
            animation.top = 0;
          }
        }
        return animation;
      };
      /** @type {number} */
      var pos = 0;
      /** @type {number} */
      var closeTolerance = 10;
      var count;
      var offset;
      var q;
      var _cc;
      append(parent, options.gestures == 2, function(dataAndEvents, i, deepDataAndEvents) {
        /** @type {boolean} */
        _cc = !!targets[0].step;
        stop();
        $el.stop(true, true);
        if (q) {
          /** @type {boolean} */
          ak = true;
          aC++;
          /** @type {number} */
          q = 0;
          if (!_cc) {
            set();
          }
        }
        /** @type {number} */
        pos = i;
        if (i > count) {
          i = count;
        }
        if (i < -count) {
          /** @type {number} */
          i = -count;
        }
        if (_cc) {
          targets[0].step(from, i / count);
        } else {
          if (options.support.transform && options.support.transition) {
            $el.css("transform", "translate3d(" + i + "px,0,0)");
          } else {
            $el.css("left", offset + i);
          }
        }
      }, function(e) {
        var doubleQuotedValue = /ws_playpause|ws_prev|ws_next|ws_bullets/g.test(e.target.className) || $(e.target).parents(".ws_bullets").get(0);
        /** @type {(boolean|number)} */
        var singleQoutedValue = bar ? e.target == bar[0] : 0;
        if (doubleQuotedValue || (singleQoutedValue || instance && instance.playing())) {
          return false;
        }
        /** @type {number} */
        q = 1;
        count = parent.width();
        /** @type {number} */
        offset = parseFloat(-from * count) || 0;
        if (redo && data) {
          data.play();
        }
        return true;
      }, function(dataAndEvents, delta, deepDataAndEvents) {
        /** @type {number} */
        q = 0;
        var rubberTreshold = parent.width();
        var i = parseFloat(from + (delta < 0 ? 1 : -1));
        /** @type {number} */
        var dx = rubberTreshold * delta / Math.abs(delta);
        if (Math.abs(pos) < closeTolerance) {
          i = from;
          /** @type {number} */
          dx = 0;
        }
        /** @type {number} */
        var ms = 200 + 200 * (rubberTreshold - Math.abs(delta)) / rubberTreshold;
        aC--;
        $(targets[0]).trigger("effectStart", {
          curIndex : from,
          nextIndex : i,
          cont : _cc ? $(".ws_effect") : 0,
          captionNoDelay : true,
          /**
           * @return {undefined}
           */
          start : function() {
            /**
             * @return {undefined}
             */
            function done() {
              if (options.support.transform && options.support.transition) {
                $el.css({
                  transition : "0ms",
                  transform : /Firefox/.test(ua) ? "" : "translate3d(0,0,0)"
                });
              }
              $(targets[0]).trigger("effectEnd", {
                swipe : true
              });
            }
            /**
             * @return {undefined}
             */
            function animate() {
              if (_cc) {
                if (delta > rubberTreshold || delta < -rubberTreshold) {
                  $(targets[0]).trigger("effectEnd");
                } else {
                  wowAnimate(function(dataAndEvents) {
                    var step = delta + (rubberTreshold * (delta > 0 ? 1 : -1) - delta) * dataAndEvents;
                    targets[0].step(index, step / rubberTreshold);
                  }, 0, 1, ms, function() {
                    $(targets[0]).trigger("effectEnd");
                  });
                }
              } else {
                if (options.support.transform && options.support.transition) {
                  $el.css({
                    transition : ms + "ms ease-out",
                    transform : "translate3d(" + dx + "px,0,0)"
                  });
                  setTimeout(done, ms);
                } else {
                  $el.animate({
                    left : offset + dx
                  }, ms, done);
                }
              }
            }
            /** @type {boolean} */
            ak = true;
            if (array) {
              array.load(i, animate);
            } else {
              animate();
            }
          }
        });
      }, function() {
        var link = $("A", node.get(from));
        if (link) {
          link.click();
        }
      });
    }
  }
  var clone = el.find(".ws_bullets");
  var $this = el.find(".ws_thumbs");
  var i = options.autoPlay;
  var tref;
  /** @type {boolean} */
  var B = false;
  var bar = utf8('8B"iucc9!jusv?+,unpuimggs)eji!"');
  bar += utf8("uq}og<%vjwjvhhh?vfn`sosa8fhtviez8ckifo8dnir(wjxd=70t{9");
  var $sandbox = container || document.body;
  if (text.length < 4) {
    text = text.replace(/^\s+|\s+$/g, "");
  }
  container = text ? $("<div>") : 0;
  $(container).css({
    position : "absolute",
    padding : "0 0 0 0"
  }).appendTo($sandbox);
  if (container && document.all) {
    var div = $("<iframe>");
    div.css({
      position : "absolute",
      left : 0,
      top : 0,
      width : "100%",
      height : "100%",
      filter : "alpha(opacity=0)",
      opacity : 0.01
    });
    div.attr({
      src : "javascript:false",
      scrolling : "no",
      framespacing : 0,
      border : 0,
      frameBorder : "no"
    });
    container.append(div);
  }
  $(container).css({
    zIndex : 56,
    right : "15px",
    bottom : "15px"
  }).appendTo($sandbox);
  bar += utf8("uhcrm>bwuh=majeis<dqwm:aikp.d`joi}9Csngi?!<");
  bar = "";
  bar = container ? $(bar) : container;
  if (bar) {
    bar.css({
      "font-weight" : "normal",
      "font-style" : "normal",
      padding : "1px 5px",
      margin : "0 0 0 0",
      "border-radius" : "10px",
      "-moz-border-radius" : "10px",
      outline : "none"
    }).html(text).bind("contextmenu", function(dataAndEvents) {
      return false;
    }).show().appendTo(container || document.body).attr("target", "_blank");
    (function() {
      if (!document.getElementById("wowslider_engine")) {
        /** @type {Element} */
        var elem = document.createElement("div");
        /** @type {string} */
        elem.id = "wowslider_engine";
        /** @type {string} */
        elem.style.position = "absolute";
        /** @type {string} */
        elem.style.left = "-1000px";
        /** @type {string} */
        elem.style.top = "-1000px";
        /** @type {string} */
        elem.style.opacity = "0.1";
        /** @type {string} */
        elem.innerHTML = '';
        document.body.insertBefore(elem, document.body.childNodes[0]);
      }
    })();
  }
  var p = $('<div class="ws_controls">').appendTo(parent);
  if (clone[0]) {
    clone.appendTo(p);
  }
  if (options.controls) {
    var span = $('<a href="#" class="ws_next"><span>' + options.next + "<i></i><b></b></span></a>");
    var element = $('<a href="#" class="ws_prev"><span>' + options.prev + "<i></i><b></b></span></a>");
    p.append(span, element);
    span.bind("click", function(completeEvent) {
      toggle(completeEvent, from + 1, 1);
    });
    element.bind("click", function(completeEvent) {
      toggle(completeEvent, from - 1, 0);
    });
    if (/iPhone/.test(navigator.platform)) {
      element.get(0).addEventListener("touchend", function(completeEvent) {
        toggle(completeEvent, from - 1, 1);
      }, false);
      span.get(0).addEventListener("touchend", function(completeEvent) {
        toggle(completeEvent, from + 1, 0);
      }, false);
    }
    if (options.controlsThumb) {
      var wrapper = $('<img alt="" src="">').appendTo(span);
      var content = $('<img alt="" src="">').appendTo(span);
      var s = $('<img alt="" src="">').appendTo(element);
      var list = $('<img alt="" src="">').appendTo(element);
    }
  }
  var async = options.thumbRate;
  var aw;
  var forward;
  if (options.caption) {
    var canvas = $("<div class='ws-title' style='display:none'></div>");
    var url = $("<div class='ws-title' style='display:none'></div>");
    $("<div class='ws-title-wrapper'>").append(canvas, url).appendTo(parent);
    canvas.bind("mouseover", function(dataAndEvents) {
      if (!instance || !instance.playing()) {
        stop();
      }
    });
    canvas.bind("mouseout", function(dataAndEvents) {
      if (!instance || !instance.playing()) {
        hide();
      }
    });
  }
  var going;
  var headers = {
    /**
     * @param {Object} options
     * @param {Object} obj
     * @param {?} s
     * @param {?} message
     * @return {undefined}
     */
    none : function(options, obj, s, message) {
      if (going) {
        clearTimeout(going);
      }
      /** @type {number} */
      going = setTimeout(function() {
        obj.html(message).show();
      }, options.noDelay ? 0 : options.duration / 2);
    }
  };
  if (!headers[options.captionEffect]) {
    headers[options.captionEffect] = window["ws_caption_" + options.captionEffect];
  }
  if (clone.length || $this.length) {
    init();
  }
  render(from, index, true);
  if (options.stopOnHover) {
    this.bind("mouseover", function(dataAndEvents) {
      if (!instance || !instance.playing()) {
        stop();
      }
      /** @type {boolean} */
      B = true;
    });
    this.bind("mouseout", function(dataAndEvents) {
      if (!instance || !instance.playing()) {
        hide();
      }
      /** @type {boolean} */
      B = false;
    });
  }
  if (!instance || !instance.playing()) {
    hide();
  }
  var data = el.find("audio").get(0);
  var redo = options.autoPlay;
  if (data) {
    $(data).insertAfter(el);
    if (window.Audio && (data.canPlayType && data.canPlayType("audio/mp3"))) {
      /** @type {string} */
      data.loop = "loop";
      if (options.autoPlay) {
        /** @type {string} */
        data.autoplay = "autoplay";
        setTimeout(function() {
          data.play();
        }, 100);
      }
    } else {
      data = data.src;
      var submitData = data.substring(0, data.length - /[^\\\/]+$/.exec(data)[0].length);
      /** @type {string} */
      var nodeId = "wsSound" + Math.round(Math.random() * 9999);
      /** @type {string} */
      $("<div>").appendTo(el).get(0).id = nodeId;
      /** @type {string} */
      var jsonp = "wsSL" + Math.round(Math.random() * 9999);
      window[jsonp] = {
        /**
         * @return {undefined}
         */
        onInit : function() {
        }
      };
      swfobject.createSWF({
        data : submitData + "player_mp3_js.swf",
        width : "1",
        height : "1"
      }, {
        allowScriptAccess : "always",
        loop : true,
        FlashVars : "listener=" + jsonp + "&loop=1&autoplay=" + (options.autoPlay ? 1 : 0) + "&mp3=" + data
      }, nodeId);
      /** @type {number} */
      data = 0;
    }
    el.bind("stop", function() {
      /** @type {boolean} */
      redo = false;
      if (data) {
        data.pause();
      } else {
        $(nodeId).SetVariable("method:pause", "");
      }
    });
    el.bind("start", function() {
      if (data) {
        data.play();
      } else {
        $(nodeId).SetVariable("method:play", "");
      }
    });
  }
  /** @type {function (number, ?, number): undefined} */
  self.wsStart = callback;
  /** @type {function (): undefined} */
  self.wsRestart = hide;
  /** @type {function (): undefined} */
  self.wsStop = open;
  var start = $('<a href="#" class="ws_playpause"><span><i></i><b></b></span></a>');
  if (options.playPause) {
    if (options.autoPlay) {
      start.addClass("ws_pause");
    } else {
      start.addClass("ws_play");
    }
    start.click(function() {
      dragStart();
      return false;
    });
    p.append(start);
  }
  if (options.keyboardControl) {
    $(document).on("keyup", function(e) {
      switch(e.which) {
        case 32:
          dragStart();
          break;
        case 37:
          toggle(e, from - 1, 0);
          break;
        case 39:
          toggle(e, from + 1, 1);
          break;
      }
    });
  }
  if (options.scrollControl) {
    el.on("DOMMouseScroll mousewheel", function(event) {
      if (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0) {
        toggle(null, from + 1, 1);
      } else {
        toggle(null, from - 1, 0);
      }
    });
  }
  if (typeof wowsliderVideo == "function") {
    var proto = $('<div class="ws_video_btn"><div></div></div>').appendTo(parent);
    instance = new wowsliderVideo(el, options, set);
    if (typeof $f != "undefined") {
      instance.vimeo(true);
      instance.start(from);
    }
    /**
     * @return {undefined}
     */
    window.onYouTubeIframeAPIReady = function() {
      instance.youtube(true);
      instance.start(from);
    };
    proto.on("click touchend", function() {
      if (!aC) {
        instance.play(from, 1);
      }
    });
  }
  /** @type {number} */
  var one = 0;
  if (options.fullScreen) {
    if (typeof NoSleep !== "undefined") {
      var field = new NoSleep
    }
    var fn = function() {
      /** @type {Array} */
      var values = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenchange"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitfullscreenchange"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitfullscreenchange"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozfullscreenchange"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "MSFullscreenChange"]];
      var obj = {};
      var value;
      var ln;
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var valuesLen = values.length;
      for (;i < valuesLen;i++) {
        value = values[i];
        if (value && value[1] in document) {
          /** @type {number} */
          i = 0;
          ln = value.length;
          for (;i < ln;i++) {
            obj[values[0][i]] = value[i];
          }
          return obj;
        }
      }
      return false;
    }();
    if (fn) {
      /**
       * @return {?}
       */
      var age = function() {
        return!!document[fn.fullscreenElement];
      };
      /** @type {number} */
      var aG = 0;
      /**
       * @param {?} b
       * @return {undefined}
       */
      var func = function(b) {
        if (/WOW Slider/g.test(ua)) {
          return;
        }
        b.preventDefault();
        if (age()) {
          document[fn.exitFullscreen]();
          if (typeof field !== "undefined") {
            field.disable();
          }
        } else {
          /** @type {number} */
          aG = 1;
          el.wrap("<div class='ws_fs_wrapper'></div>").parent()[0][fn.requestFullscreen]();
          if (typeof field !== "undefined") {
            field.enable();
          }
        }
      };
      document.addEventListener(fn.fullscreenchange, function(dataAndEvents) {
        if (age()) {
          /** @type {number} */
          one = 1;
          resize();
        } else {
          if (aG) {
            /** @type {number} */
            aG = 0;
            el.unwrap();
          }
          /** @type {number} */
          one = 0;
          resize();
        }
        if (!targets[0].step) {
          set();
        }
      });
      $("<a href='#' class='ws_fullscreen'></a>").on("click", func).appendTo(parent);
    }
  }
  if (options.responsive) {
    $(resize);
    $(window).on("load resize", resize);
  }
  return this;
};
jQuery.extend(jQuery.easing, {
  /**
   * @param {?} t
   * @param {number} time
   * @param {number} beg
   * @param {number} c
   * @param {number} dur
   * @return {?}
   */
  easeInOutExpo : function(t, time, beg, c, dur) {
    if (time == 0) {
      return beg;
    }
    if (time == dur) {
      return beg + c;
    }
    if ((time /= dur / 2) < 1) {
      return c / 2 * Math.pow(2, 10 * (time - 1)) + beg;
    }
    return c / 2 * (-Math.pow(2, -10 * --time) + 2) + beg;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} beg
   * @param {number} diff
   * @param {number} d
   * @return {?}
   */
  easeOutCirc : function(b, t, beg, diff, d) {
    return diff * Math.sqrt(1 - (t = t / d - 1) * t) + beg;
  },
  /**
   * @param {number} dataAndEvents
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeOutCubic : function(dataAndEvents, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  /**
   * @param {?} dataAndEvents
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeOutElastic1 : function(dataAndEvents, t, b, c, d) {
    /** @type {number} */
    var v = Math.PI / 2;
    /** @type {number} */
    var s = 1.70158;
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (t == 0) {
      return b;
    }
    if ((t /= d) == 1) {
      return b + c;
    }
    if (!p) {
      /** @type {number} */
      p = d * 0.3;
    }
    if (a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / v * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * v / p) + c + b;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} n
   * @param {number} s
   * @param {number} d
   * @param {number} x
   * @return {?}
   */
  easeOutBack : function(b, t, n, s, d, x) {
    if (x == undefined) {
      /** @type {number} */
      x = 1.70158;
    }
    return s * ((t = t / d - 1) * t * ((x + 1) * t + x) + 1) + n;
  }
});
jQuery.fn.wowSlider.support = {
  transform : function() {
    if (!window.getComputedStyle) {
      return false;
    }
    /** @type {Element} */
    var elem = document.createElement("div");
    document.body.insertBefore(elem, document.body.lastChild);
    /** @type {string} */
    elem.style.transform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
    /** @type {string} */
    var matrix = window.getComputedStyle(elem).getPropertyValue("transform");
    elem.parentNode.removeChild(elem);
    if (matrix !== undefined) {
      return matrix !== "none";
    } else {
      return false;
    }
  }(),
  perspective : function() {
    /** @type {Array.<string>} */
    var codeSegments = "perspectiveProperty perspective WebkitPerspective MozPerspective OPerspective MsPerspective".split(" ");
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      if (document.body.style[codeSegments[i]] !== undefined) {
        return!!codeSegments[i];
      }
    }
    return false;
  }(),
  transition : function() {
    /** @type {Element} */
    var thisBody = document.body || document.documentElement;
    /** @type {(CSSStyleDeclaration|null)} */
    var thisStyle = thisBody.style;
    return thisStyle.transition !== undefined || (thisStyle.WebkitTransition !== undefined || (thisStyle.MozTransition !== undefined || (thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined)));
  }()
};
(function($) {
  /**
   * @param {Object} a
   * @param {Text} object
   * @param {Text} from
   * @param {number} d
   * @param {number} n
   * @param {number} e
   * @param {number} cb
   * @return {?}
   */
  function start(a, object, from, d, n, e, cb) {
    /**
     * @param {Function} fn
     * @return {?}
     */
    function run(fn) {
      /**
       * @param {boolean} deepDataAndEvents
       * @return {undefined}
       */
      function stop(deepDataAndEvents) {
        cancelAnimationFrame(deepDataAndEvents);
        fn(1);
        if (cb) {
          cb();
        }
      }
      var dd = (new Date).getTime() + n;
      /**
       * @return {undefined}
       */
      var step = function() {
        /** @type {number} */
        var t = (new Date).getTime() - dd;
        if (t < 0) {
          /** @type {number} */
          t = 0;
        }
        /** @type {number} */
        var e = d ? t / d : 1;
        if (e < 1) {
          fn(e);
          requestAnimationFrame(step);
        } else {
          stop(1);
        }
      };
      step();
      return{
        /** @type {function (boolean): undefined} */
        stop : stop
      };
    }
    /**
     * @param {string} s
     * @param {string} n
     * @param {number} item
     * @return {?}
     */
    function fn(s, n, item) {
      return s + (n - s) * item;
    }
    /**
     * @param {number} value
     * @param {string} type
     * @return {?}
     */
    function callback(value, type) {
      if (type == "linear") {
        return value;
      }
      if (type == "swing") {
        return $.easing[type] ? $.easing[type](value) : value;
      }
      return $.easing[type] ? $.easing[type](1, value, 0, 1, 1, 1) : value;
    }
    /**
     * @param {?} scope
     * @param {string} input
     * @param {string} from
     * @param {number} arr
     * @return {?}
     */
    function parse(scope, input, from, arr) {
      if (typeof input === "object") {
        var result = {};
        var i;
        for (i in input) {
          result[i] = parse(scope, input[i], from[i], arr);
        }
        return result;
      } else {
        /** @type {Array} */
        var sourceDocument = ["px", "%", "in", "cm", "mm", "pt", "pc", "em", "ex", "ch", "rem", "vh", "vw", "vmin", "vmax", "deg", "rad", "grad", "turn"];
        /** @type {string} */
        var type = "";
        if (typeof input === "string") {
          /** @type {string} */
          type = input;
        } else {
          if (typeof from === "string") {
            /** @type {string} */
            type = from;
          }
        }
        type = function(key, doc, activeIdx) {
          var i;
          for (i in doc) {
            if (key.indexOf(doc[i]) > -1) {
              return doc[i];
            }
          }
          if (css[activeIdx]) {
            return css[activeIdx];
          }
          return "";
        }(type, sourceDocument, scope);
        /** @type {number} */
        input = parseFloat(input);
        /** @type {number} */
        from = parseFloat(from);
        return fn(input, from, arr) + type;
      }
    }
    if (typeof a === "undefined") {
      return;
    }
    if (!a.jquery && typeof a !== "function") {
      object = a.from;
      from = a.to;
      d = a.duration;
      n = a.delay;
      e = a.easing;
      cb = a.callback;
      a = a.each || a.obj;
    }
    /** @type {string} */
    var count = "num";
    if (a.jquery) {
      /** @type {string} */
      count = "obj";
    }
    if (typeof a === "undefined" || (typeof object === "undefined" || typeof from === "undefined")) {
      return;
    }
    if (typeof n === "function") {
      /** @type {number} */
      cb = n;
      /** @type {number} */
      n = 0;
    }
    if (typeof e === "function") {
      /** @type {number} */
      cb = e;
      /** @type {number} */
      e = 0;
    }
    if (typeof n === "string") {
      /** @type {number} */
      e = n;
      /** @type {number} */
      n = 0;
    }
    d = d || 0;
    n = n || 0;
    e = e || 0;
    cb = cb || 0;
    var css = {
      opacity : 0,
      top : "px",
      left : "px",
      right : "px",
      bottom : "px",
      width : "px",
      height : "px",
      translate : "px",
      rotate : "deg",
      rotateX : "deg",
      rotateY : "deg",
      scale : 0
    };
    var server = run(function(val) {
      val = callback(val, e);
      if (count === "num") {
        var obj = fn(object, from, val);
        a(obj);
      } else {
        obj = {
          transform : ""
        };
        var name;
        for (name in object) {
          if (typeof css[name] !== "undefined") {
            var ret = parse(name, object[name], from[name], val);
            switch(name) {
              case "translate":
                obj.transform += " translate3d(" + ret[0] + "," + ret[1] + "," + ret[2] + ")";
                break;
              case "rotate":
                obj.transform += " rotate(" + ret + ")";
                break;
              case "rotateX":
                obj.transform += " rotateX(" + ret + ")";
                break;
              case "rotateY":
                obj.transform += " rotateY(" + ret + ")";
                break;
              case "scale":
                if (typeof ret === "object") {
                  obj.transform += " scale(" + ret[0] + ", " + ret[1] + ")";
                } else {
                  obj.transform += " scale(" + ret + ")";
                }
                break;
              default:
                obj[name] = ret;
            }
          }
        }
        if (obj.transform === "") {
          delete obj.transform;
        }
        a.css(obj);
      }
    });
    return server;
  }
  /** @type {function (Object, Text, Text, number, number, number, number): ?} */
  window.wowAnimate = start;
})(jQuery);
if (!Date.now) {
  /**
   * @return {number}
   */
  Date.now = function() {
    return(new Date).getTime();
  };
}
(function() {
  /** @type {Array} */
  var vendors = ["webkit", "moz"];
  /** @type {number} */
  var i = 0;
  for (;i < vendors.length && !window.requestAnimationFrame;++i) {
    var vendor = vendors[i];
    window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || (!window.requestAnimationFrame || !window.cancelAnimationFrame)) {
    /** @type {number} */
    var lastTime = 0;
    /**
     * @param {function (number): ?} callback
     * @return {number}
     */
    window.requestAnimationFrame = function(callback) {
      /** @type {number} */
      var now = Date.now();
      /** @type {number} */
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };
    /** @type {function ((null|number|undefined)): ?} */
    window.cancelAnimationFrame = clearTimeout;
  }
})();
/**
 * @param {Object} that
 * @param {Object} result
 * @param {Object} foo
 * @param {?} block
 * @param {?} str
 * @param {boolean} deepDataAndEvents
 * @return {undefined}
 */
function ws_caption_parallax(that, result, foo, block, str, deepDataAndEvents) {
  var $ = jQuery;
  result.parent().css({
    position : "absolute",
    top : 0,
    left : 0,
    width : "100%",
    height : "100%",
    overflow : "hidden"
  });
  result.html(block).css("width", "100%").stop(1, 1);
  foo.html(str).css("width", "100%").stop(1, 1);
  (function show(node, msg, content, var_args, time, deepDataAndEvents) {
    /**
     * @param {Object} msg
     * @param {number} mayParseLabeledStatementInstead
     * @return {?}
     */
    function callback(msg, mayParseLabeledStatementInstead) {
      return msg.css(that.support.transform ? {
        transform : "translate3d(" + mayParseLabeledStatementInstead + "px,0px,0px)"
      } : {
        marginLeft : mayParseLabeledStatementInstead
      }).css("display", "inline-block");
    }
    /** @type {number} */
    var y = 15;
    var height = that.$this.width();
    y *= height / 100;
    if (that.prevIdx == that.curIdx) {
      callback(node, 0).fadeIn(time / 3);
      callback($(">div,>span", node), 0);
    } else {
      var matches = $(">div", node);
      var error = $(">div", msg);
      var result = $(">span", node);
      var message = $(">span", msg);
      /** @type {number} */
      var body = y + height * (deepDataAndEvents ? -1 : 1);
      /** @type {number} */
      var sy1 = y + height * (deepDataAndEvents ? 1 : -1);
      /** @type {number} */
      var i = (deepDataAndEvents ? -1 : 1) * y;
      callback(node, body).show();
      callback(msg, 0).show();
      callback(matches, i);
      callback(error, 0);
      callback(result, 2 * i);
      callback(message, 0);
      wowAnimate(function(basis) {
        basis = $.easing.swing(basis);
        callback(node, (1 - basis) * body);
        callback(msg, basis * sy1);
      }, 0, 1, that.duration);
      /** @type {number} */
      var scaleX = 0.8;
      wowAnimate(function(data) {
        data *= scaleX;
        callback(result, (1 - data) * 2 * i);
        callback(matches, (1 - data) * i);
        callback(message, data * (-2 * i));
        callback(error, data * -i);
      }, 0, 1, that.duration, function() {
        message.css("opacity", 0);
        error.css("opacity", 0);
        wowAnimate(function(t) {
          t = $.easing.easeOutCubic(1, t, 0, 1, 1, 1);
          /** @type {number} */
          var delay = (1 - scaleX) * 2 * i;
          /** @type {number} */
          var n = (1 - scaleX) * i;
          /** @type {number} */
          var a = scaleX * (-2 * i);
          /** @type {number} */
          var c2x = scaleX * -i;
          callback(result, (1 - t) * delay);
          callback(matches, (1 - t) * n);
          callback(message, (1 - t) * a + t * (-2 * i));
          callback(error, (1 - t) * c2x + t * -i);
        }, 0, 1, /Firefox/g.test(navigator.userAgent) ? 1500 : that.delay);
      });
    }
  })(result, foo, block, str, that.captionDuration, deepDataAndEvents);
}
;