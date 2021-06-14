/*eslint-env browser */
/*eslint no-unused-vars: 0 */
/*eslint no-undef: 0 */


var utils = (function() {
  // ======================= //
  /* public : returns height of element with padding */
  function elem_height(elem) {
    var styles;
    try {
      styles = window.getComputedStyle(elem);
      return elem.clientHeight + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    } catch (err) {
      console.warn(err);
    }
    return 0;
  }
  /* public : returns width of element with padding */
  function elem_width(elem) {
    var styles;
    try {
      styles = window.getComputedStyle(elem);
      return elem.clientWidth + parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    } catch (err) {
      console.warn(err);
    }
    return 0;
  }
  /* public : add class to element */
  function add_class(elem, cls) {
    if (elem && cls) {
      elem.classList.add(cls);
    }
  }
  /* public : remove class from element */
  function remove_class(elem, cls) {
    if (elem && cls) {
      elem.classList.remove(cls);
    }
  }
  /* public : fades out an element with animate.css */
  function fade_out(elem) {
    elem.classList.remove("fadeOut");
    elem.classList.add("animated", "fadeOut", "faster");
  }
  /* public : fades in an element with animate.css */
  function fade_in(elem) {
    elem.classList.remove("fadeOut");
    elem.classList.add("animated", "fadeIn", "faster");
  }
  /* public : finds elements of class */
  function elems_for_class(str) {
    return document.getElementsByClassName(str);
  }
  /* public : finds the element for and id */
  function elem_for_id(str) {
    return document.getElementById(str);
  }

  /* public : interface */
  return {
    elem_height: elem_height,
    elem_width: elem_width,
    add_class: add_class,
    remove_class: remove_class,
    fade_out: fade_out,
    fade_in: fade_in,
    elems_for_class: elems_for_class,
    elem_for_id: elem_for_id,
  };
})();