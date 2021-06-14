/*eslint-env browser */
/*eslint no-unused-vars: 0 */
/*eslint no-undef: 0 */


var slider = (function() {
  // ======================= //

  // private variable for external dependency
  var _utils = utils;
  var _app;


  var _mobile_slider_state = 0;
  var _viewport_state;
  var _clicked = false;
  var _last_pos = null;

  /* element refs */
  var _container = _utils.elem_for_id("slider_container");
  var _slide_overlay = _utils.elem_for_id("slide_left");
  var _slide_container = _utils.elem_for_id("slides");
  var _slider_thumb = _utils.elem_for_id("slider_thumb");
  var _slider_thumb_img = _utils.elem_for_id("slider_thumb_img");
  var _slider_desktop_prompt = _utils.elem_for_id("slider_desktop_prompt");
  var _slider_mobile_prompt = _utils.elem_for_id("slider_mobile_prompt");
  var _swipe_hand = _utils.elem_for_id("swipe_hand");
  var _slider_handset_list_container = _utils.elem_for_id("slider_handset_list_container");
  var _night_callouts = [
    _utils.elem_for_id("callout_0"),
    _utils.elem_for_id("callout_1"),
    _utils.elem_for_id("callout_2"),
    _utils.elem_for_id("callout_3"),
  ];
  var _day_callouts = [
    _utils.elem_for_id("callout_10"),
    _utils.elem_for_id("callout_11"),
    _utils.elem_for_id("callout_12"),
    _utils.elem_for_id("callout_13"),
  ];
  var _night_hotspots = [
    _utils.elem_for_id("hotspot_0"),
    _utils.elem_for_id("hotspot_1"),
    _utils.elem_for_id("hotspot_2"),
    _utils.elem_for_id("hotspot_3"),
  ];
  var _day_hotspots = [
    _utils.elem_for_id("hotspot_10"),
    _utils.elem_for_id("hotspot_11"),
    _utils.elem_for_id("hotspot_12"),
    _utils.elem_for_id("hotspot_13"),
  ];
  var _handset_list_callouts = [
    _utils.elem_for_id("list_callout_0"),
    _utils.elem_for_id("list_callout_1"),
    _utils.elem_for_id("list_callout_2"),
    _utils.elem_for_id("list_callout_3"),
  ];

  // ======================= //
  /* private : preload done, show the UI */
  function widget_start() {
    /* post init save of app ref */
    _app = app;
    /* bind events */
    _slider_thumb.addEventListener("mousedown", slider.slide_ready, false);
    _slider_thumb.addEventListener("touchstart", slider.slide_ready, false);
    window.addEventListener("touchend", slider.slide_finish, false);
    window.addEventListener("mouseup", slider.slide_finish, false);
    /* inti ui elements to animate */
    setTimeout(function() {
      var r = _slide_container.getBoundingClientRect();
      var x = r.width * 0.5;
      pulse(_slider_thumb_img);
      pulse(_slider_desktop_prompt);
      trigger_hotspots(x);
    }, 500);
  }
  /* private : pulse an element */
  function pulse(elem) {
    elem.classList.remove("pulse");
    elem.classList.add("animated", "pulse", "infinite", "slow");
  }

  /* private : scale up an element */
  function scale_up(elem) {
    elem.classList.remove("scale_up");
    elem.classList.add("scale_up");
  }

  /* private : handset-specific UI considerations */
  function trigger_mobile_ui(pos, w) {
    var mobile_slider_state;
    var content_items;
    if (pos > (w * 0.5) + (w * 0.02)) {
      mobile_slider_state = 1;
    } else if (pos < (w * 0.5) - (w * 0.02)) {
      mobile_slider_state = -1;
    } else {
      // center
      mobile_slider_state = 0;
    }
    if (mobile_slider_state === _mobile_slider_state) {
      //return;
    }
    switch (mobile_slider_state) {
      case -1:
        // slider is on the left
        _utils.fade_out(_swipe_hand);
        _utils.fade_out(_slider_mobile_prompt);
        _utils.fade_in(_slider_handset_list_container);
        _utils.remove_class(_container, 'night');
        _utils.add_class(_container, 'day');
        content_items = _night_callouts;
        break;
      case 1:
        // slider is on the right
        _utils.fade_out(_swipe_hand);
        _utils.fade_out(_slider_mobile_prompt);
        _utils.fade_in(_slider_handset_list_container);
        _utils.add_class(_container, 'night');
        _utils.remove_class(_container, 'day');
        content_items = _day_callouts;
        break;
      default:
        // slider is ~ centered
        break;
    }
    if (content_items) {
      for (var i = 0; i < _handset_list_callouts.length; i++) {
        var elem = _handset_list_callouts[i];
        var cont = content_items[i];
        if (cont.classList.toString().indexOf('scale_up') > -1) {
          elem.innerHTML = cont.innerHTML;
          _utils.remove_class(elem, 'hide_slow');
        } else {
          _utils.add_class(elem, 'hide_slow');
        }
      }
    }
    _mobile_slider_state = mobile_slider_state;
  }

  /* private : change callout content depending on where the slider is */
  function trigger_hotspots(pos) {
    var r, h;
    var s = _slide_container.getBoundingClientRect();
    var item;
    if (pos === _last_pos) {
      return;
    }
    for (h in _day_hotspots) {
      r = _day_hotspots[h].getBoundingClientRect();
      if (r.left - s.left < pos) {
        if (_day_callouts[h].classList.toString().indexOf('scale_up') < 0) {
          item = _day_callouts[h];
          scale_up(item);
        }
      } else {
        if (_day_callouts[h].classList.toString().indexOf('scale_up') >= 0) {
          _utils.remove_class(_day_callouts[h], "scale_up");
        }
      }
    }
    for (h in _night_hotspots) {
      r = _night_hotspots[h].getBoundingClientRect();
      if (r.left - s.left > pos) {
        if (_night_callouts[h].classList.toString().indexOf('scale_up') < 0) {
          item = _night_callouts[h];
          scale_up(item);
        }
      } else {
        if (_night_callouts[h].classList.toString().indexOf('scale_up') >= 0) {
          _utils.remove_class(_night_callouts[h], "scale_up");
        }
      }
    }
    _last_pos = pos;
  }

  /* private : set position of slide bar */
  function slide(x) {
    _slide_overlay.style.width = x + "px";
    _slider_thumb.style.left = _slide_overlay.offsetWidth + "px";
  }

  /* private : get cursor position */
  function get_cursor_pos(e) {
    var a, x = 0;
    try {
      e = e.targetTouches[0] || window.event;
    } catch (err) {
      e = e || window.event;
    }
    a = _slide_overlay.getBoundingClientRect();
    x = e.pageX - a.left;
    x = x - window.pageXOffset;
    return x;
  }



  // ======================= //
  /* public functions below this point */

  /* public : resize */
  function resize() {
    // re-center thumb
    var viewport_state;
    if (_app) {
      if (_app.is_handset()) {
        viewport_state = 'handset';
      } else {
        viewport_state = 'desktop';
      }
    }
    // resize only if we change viewport from/to handset
    if (_viewport_state === viewport_state) {
      return;
    }
    _viewport_state = viewport_state;
    slide(_slide_container.offsetWidth * 0.5);
    if (_app) {
      if (_app.is_handset()) {
        // fade instructions
        _utils.fade_in(_swipe_hand);
        _utils.fade_in(_slider_mobile_prompt);
        _utils.fade_out(_slider_handset_list_container);
        _utils.remove_class(_container, 'day');
        _utils.remove_class(_container, 'night');
        pulse(_slider_thumb_img);
        pulse(_slider_desktop_prompt);
      }
    }
    _utils.remove_class(slider_desktop_prompt, 'fadeOut');
    _utils.remove_class(slider_desktop_prompt, 'fadeIn');
    setTimeout(function() {
      var r = _slide_container.getBoundingClientRect();
      var x = r.width * 0.5;
      trigger_hotspots(x);
    }, 100);
  }

  /* public : control is ready to respond to user input */
  function slide_ready(e) {
    if (_app) {
      if (_app.is_handset()) {
        // fade instructions
        _utils.fade_out(_slider_desktop_prompt);
        _utils.fade_in(_slider_handset_list_container);
        _viewport_state = 'handset';
      } else {
        _viewport_state = 'desktop';
      }
    }
    _utils.remove_class(_slider_thumb_img, "pulse");
    _utils.remove_class(_slider_desktop_prompt, "pulse");
    _clicked = true;
    try {
      e.preventDefault();
    } catch (err) {
      //
    }
    window.addEventListener("mousemove", slider.slide_move, false);
    window.addEventListener("touchmove", slider.slide_move, false);
  }

  /* private : user is done */
  function slide_finish() {
    _clicked = false;
  }

  /* public : control is moving */
  function slide_move(e) {
    var pos;
    var w = _slide_container.offsetWidth;
    if (!_clicked) {
      return;
    }
    pos = get_cursor_pos(e);
    if (pos < 0) pos = 0;
    if (pos > w) pos = w;
    if (_app) {
      if (_app.is_handset()) {
        trigger_mobile_ui(pos, w);
      }
    }
    slide(pos);
    trigger_hotspots(pos);
  }



  /* public : interface */
  return {
    widget_start: widget_start,
    slide_ready: slide_ready,
    slide_finish: slide_finish,
    slide_move: slide_move,
    resize: resize,
  };
})();