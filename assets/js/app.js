/*eslint-env browser */
/*eslint no-unused-vars: 0 */
/*eslint no-undef: 0 */


var app = (function() {
  // ======================= //

  /* private variables for external dependencies */
  var _utils = utils;
  var _slider;
  /* array : array of objects, images to preload from JSON_images */
  var _images;
  /* obj : stores the language from the lang.js file */
  var _language;
  /* int : handset width */
  var _handset_width = 360;
  /* string : defaults to "EN" */
  var _language_key = "EN";

  /* bool : settings for show/hide modules */
  var _enable_header = false;
  var _enable_main = false;
  var _enable_slider = false;
  var _enable_compare = false;
  var _enable_legal = false;

  /* int : stores the timer int, simple debounce of inputs */
  var _debounce;
  /* bool : for dev */
  var _debug = false;
  /* bool : is handset view showing? */
  var _handset = false;
  /* obj : config passes at init */
  var _config;
  /* element refs */
  var _container = _utils.elem_for_id("container");
  var _shade = _utils.elem_for_id("modal_shade");
  var _preloader_percent = _utils.elem_for_id("preloader_percent");
  var _legal_container = _utils.elem_for_id("compare_container");

  /* private : remove preloader */
  function remove_shade() {
    _utils.fade_out(_shade);
    setTimeout(function() {
      _utils.add_class(_shade, "hide");
    }, 250);
  }

  /* private : preload done, show the UI */
  function widget_start() {
    _handset = is_handset();
    if (!_enable_header) {
      _utils.elem_for_id('header_container').style.display = 'none';
    }
    if (!_enable_main) {
      _utils.elem_for_id('main_container').style.display = 'none';
    }
    if (!_enable_slider) {
      _utils.elem_for_id('slider_container').style.display = 'none';
    }
    if (!_enable_compare) {
      _utils.elem_for_id('compare_container').style.display = 'none';
    }
    if (!_enable_legal) {
      _utils.elem_for_id('legal_toggle').style.display = 'none';
    }
    if (get_slider() && _enable_slider) {
      _slider.widget_start();
    }
    remove_shade();
  }

  /* private : return slider */
  function get_slider() {
    // slider may or may not exist
    _slider = null;
    try {
      // store ref to it if it exists
      _slider = slider;
      return true;
    } catch (err) {
      return false;
    }
  }



  // ======================= //
  /* public functions below this point */


  /* public : load lang */
  function preload_language(langs) {
    var hasLanguage = Object.prototype.hasOwnProperty.call(langs, _language_key);
    if (!hasLanguage) {
      // language not found, use default
      alert("Language not found");
      return;
    }
    var elem;
    _language = langs[_language_key];
    for (var l in _language) {
      // load text into containers
      elem = _utils.elem_for_id(l);
      if (elem) {
        elem.innerHTML = _language[l];
      }
    }
  }

  /* public : load imgs */
  function preload_images(imgs) {
    _images = imgs;
    var elem = _utils.elem_for_id("preload_container");
    var img;
    var loadCount = 0;
    var done = false;
    var str = "Loading...";
    _preloader_percent.innerHTML = str;
    for (var i in _images) {
      img = document.createElement("img");
      elem.appendChild(img);
      img.src = _images[i].img;
      img.onload = function() {
        loadCount++;
        str = parseInt((loadCount / imgs.length) * 100, 10) + "%";
        _preloader_percent.innerHTML = str;
        if (loadCount >= _images.length && !done) {
          done = true;
          setTimeout(function() {
            widget_start();
          }, 500);
        }
      };
    }
  }

  /* public : resize */
  function resize() {
    _handset = _utils.elem_width(_container) < 500 ? true : false;
    if (_debounce) {
      clearTimeout(_debounce);
    }
    _debounce = setTimeout(function() {
      if (_slider) {
        _slider.resize();
      }
    }, 10);
  }

  /* public : init */
  function init(config) {
    _config = config;
    if (config.enable_header) {
      _enable_header = config.enable_header;
    }
    if (config.enable_main) {
      _enable_main = config.enable_main;
    }
    if (config.enable_slider) {
      _enable_slider = config.enable_slider;
    }
    if (config.enable_compare) {
      _enable_compare = config.enable_compare;
    }
    if (config.enable_legal) {
      _enable_legal = config.enable_legal;
    }
    if (config.language) {
      _language_key = config.language;
    }
    if (config.debug) {
      _debug = config.debug;
    }
  }
  /* public : legal btn toggle */
  function toggle_legal(ev) {
    //console.log(ev.target.parentElement)
    var copy = _utils.elem_for_id('legal_copy');
    ev.preventDefault();
    if (_legal_container) {
      if (_legal_container.classList.toString().indexOf('legal') > -1) {
        _utils.fade_out(copy);
        setTimeout(function() {
          _utils.remove_class(_legal_container, 'legal');
        }, 250);
      } else {
        _utils.add_class(_legal_container, 'legal');
        _utils.fade_in(copy);
      }
    }
  }
  /* public : return if handset */
  function is_handset() {
    return _utils.elem_width(_container) <= _handset_width ? true : false;
  }
  /* public : debug kepress */
  function keypress(e) {
    if (!_debug)
      return;
    var elem = _utils.elem_for_id('template');
    switch (e.which) {
      case 96:
        // tilde
        var display = elem.style.display;
        elem.style.display = (display === 'none' ? 'block' : 'none');
        break;
      case 49:
        // 1
        elem.style.zIndex = 999;
        break;
      case 50:
        // 2
        elem.style.zIndex = 0;
        break;
    }
  }



  /* public : interface */
  return {
    is_handset: is_handset,
    preload_language: preload_language,
    preload_images: preload_images,
    resize: resize,
    init: init,
    keypress: keypress,
    toggle_legal: toggle_legal,
  };
})();