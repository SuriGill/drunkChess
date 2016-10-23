(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/index.js":[function(require,module,exports){
/**
 * MUI NPM package
 * @module pkg/index.js
 */

/** Define module API */
module.exports = {
  overlay: require('./lib/js/overlay')
}

},{"./lib/js/overlay":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/overlay.js"}],"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/config.js":[function(require,module,exports){
/**
 * MUI config module
 * @module config
 */

/** Define module API */
module.exports = {
  /** Use debug mode */
  debug: true
};

},{}],"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/lib/jqLite.js":[function(require,module,exports){
/**
 * MUI CSS/JS jqLite module
 * @module lib/jqLite
 */

'use strict';


/**
 * Add a class to an element.
 * @param {Element} element - The DOM element.
 * @param {string} cssClasses - Space separated list of class names.
 */
function jqLiteAddClass(element, cssClasses) {
  if (!cssClasses || !element.setAttribute) return;

  var existingClasses = _getExistingClasses(element),
      splitClasses = cssClasses.split(' '),
      cssClass;

  for (var i=0; i < splitClasses.length; i++) {
    cssClass = splitClasses[i].trim();
    if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
      existingClasses += cssClass + ' ';
    }
  }
  
  element.setAttribute('class', existingClasses.trim());
}


/**
 * Get or set CSS properties.
 * @param {Element} element - The DOM element.
 * @param {string} [name] - The property name.
 * @param {string} [value] - The property value.
 */
function jqLiteCss(element, name, value) {
  // Return full style object
  if (name === undefined) {
    return getComputedStyle(element);
  }

  var nameType = jqLiteType(name);

  // Set multiple values
  if (nameType === 'object') {
    for (var key in name) element.style[_camelCase(key)] = name[key];
    return;
  }

  // Set a single value
  if (nameType === 'string' && value !== undefined) {
    element.style[_camelCase(name)] = value;
  }

  var styleObj = getComputedStyle(element),
      isArray = (jqLiteType(name) === 'array');

  // Read single value
  if (!isArray) return _getCurrCssProp(element, name, styleObj);

  // Read multiple values
  var outObj = {},
      key;

  for (var i=0; i < name.length; i++) {
    key = name[i];
    outObj[key] = _getCurrCssProp(element, key, styleObj);
  }

  return outObj;
}


/**
 * Check if element has class.
 * @param {Element} element - The DOM element.
 * @param {string} cls - The class name string.
 */
function jqLiteHasClass(element, cls) {
  if (!cls || !element.getAttribute) return false;
  return (_getExistingClasses(element).indexOf(' ' + cls + ' ') > -1);
}


/**
 * Return the type of a variable.
 * @param {} somevar - The JavaScript variable.
 */
function jqLiteType(somevar) {
  // handle undefined
  if (somevar === undefined) return 'undefined';

  // handle others (of type [object <Type>])
  var typeStr = Object.prototype.toString.call(somevar);
  if (typeStr.indexOf('[object ') === 0) {
    return typeStr.slice(8, -1).toLowerCase();
  } else {
    throw new Error("MUI: Could not understand type: " + typeStr);
  }    
}


/**
 * Attach an event handler to a DOM element
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated event names.
 * @param {Function} callback - The callback function.
 * @param {Boolean} useCapture - Use capture flag.
 */
function jqLiteOn(element, events, callback, useCapture) {
  useCapture = (useCapture === undefined) ? false : useCapture;

  var cache = element._muiEventCache = element._muiEventCache || {};  

  events.split(' ').map(function(event) {
    // add to DOM
    element.addEventListener(event, callback, useCapture);

    // add to cache
    cache[event] = cache[event] || [];
    cache[event].push([callback, useCapture]);
  });
}


/**
 * Remove an event handler from a DOM element
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated event names.
 * @param {Function} callback - The callback function.
 * @param {Boolean} useCapture - Use capture flag.
 */
function jqLiteOff(element, events, callback, useCapture) {
  useCapture = (useCapture === undefined) ? false : useCapture;

  // remove from cache
  var cache = element._muiEventCache = element._muiEventCache || {},
      argsList,
      args,
      i;

  events.split(' ').map(function(event) {
    argsList = cache[event] || [];

    i = argsList.length;
    while (i--) {
      args = argsList[i];

      // remove all events if callback is undefined
      if (callback === undefined ||
          (args[0] === callback && args[1] === useCapture)) {

        // remove from cache
        argsList.splice(i, 1);
        
        // remove from DOM
        element.removeEventListener(event, args[0], args[1]);
      }
    }
  });
}


/**
 * Attach an event hander which will only execute once per element per event
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated event names.
 * @param {Function} callback - The callback function.
 * @param {Boolean} useCapture - Use capture flag.
 */
function jqLiteOne(element, events, callback, useCapture) {
  events.split(' ').map(function(event) {
    jqLiteOn(element, event, function onFn(ev) {
      // execute callback
      if (callback) callback.apply(this, arguments);

      // remove wrapper
      jqLiteOff(element, event, onFn, useCapture);
    }, useCapture);
  });
}


/**
 * Get or set horizontal scroll position
 * @param {Element} element - The DOM element
 * @param {number} [value] - The scroll position
 */
function jqLiteScrollLeft(element, value) {
  var win = window;

  // get
  if (value === undefined) {
    if (element === win) {
      var docEl = document.documentElement;
      return (win.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0);
    } else {
      return element.scrollLeft;
    }
  }

  // set
  if (element === win) win.scrollTo(value, jqLiteScrollTop(win));
  else element.scrollLeft = value;
}


/**
 * Get or set vertical scroll position
 * @param {Element} element - The DOM element
 * @param {number} value - The scroll position
 */
function jqLiteScrollTop(element, value) {
  var win = window;

  // get
  if (value === undefined) {
    if (element === win) {
      var docEl = document.documentElement;
      return (win.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
    } else {
      return element.scrollTop;
    }
  }

  // set
  if (element === win) win.scrollTo(jqLiteScrollLeft(win), value);
  else element.scrollTop = value;
}


/**
 * Return object representing top/left offset and element height/width.
 * @param {Element} element - The DOM element.
 */
function jqLiteOffset(element) {
  var win = window,
      rect = element.getBoundingClientRect(),
      scrollTop = jqLiteScrollTop(win),
      scrollLeft = jqLiteScrollLeft(win);

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    height: rect.height,
    width: rect.width
  };
}


/**
 * Attach a callback to the DOM ready event listener
 * @param {Function} fn - The callback function.
 */
function jqLiteReady(fn) {
  var done = false,
      top = true,
      doc = document,
      win = doc.defaultView,
      root = doc.documentElement,
      add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
      rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
      pre = doc.addEventListener ? '' : 'on';

  var init = function(e) {
    if (e.type == 'readystatechange' && doc.readyState != 'complete') {
      return;
    }

    (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
    if (!done && (done = true)) fn.call(win, e.type || e);
  };

  var poll = function() {
    try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
    init('poll');
  };

  if (doc.readyState == 'complete') {
    fn.call(win, 'lazy');
  } else {
    if (doc.createEventObject && root.doScroll) {
      try { top = !win.frameElement; } catch(e) { }
      if (top) poll();
    }
    doc[add](pre + 'DOMContentLoaded', init, false);
    doc[add](pre + 'readystatechange', init, false);
    win[add](pre + 'load', init, false);
  }
}


/**
 * Remove classes from a DOM element
 * @param {Element} element - The DOM element.
 * @param {string} cssClasses - Space separated list of class names.
 */
function jqLiteRemoveClass(element, cssClasses) {
  if (!cssClasses || !element.setAttribute) return;

  var existingClasses = _getExistingClasses(element),
      splitClasses = cssClasses.split(' '),
      cssClass;
  
  for (var i=0; i < splitClasses.length; i++) {
    cssClass = splitClasses[i].trim();
    while (existingClasses.indexOf(' ' + cssClass + ' ') >= 0) {
      existingClasses = existingClasses.replace(' ' + cssClass + ' ', ' ');
    }
  }

  element.setAttribute('class', existingClasses.trim());
}


// ------------------------------
// Utilities
// ------------------------------
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
    MOZ_HACK_REGEXP = /^moz([A-Z])/,
    ESCAPE_REGEXP = /([.*+?^=!:${}()|\[\]\/\\])/g;


function _getExistingClasses(element) {
  var classes = (element.getAttribute('class') || '').replace(/[\n\t]/g, '');
  return ' ' + classes + ' ';
}


function _camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}


function _escapeRegExp(string) {
  return string.replace(ESCAPE_REGEXP, "\\$1");
}


function _getCurrCssProp(elem, name, computed) {
  var ret;

  // try computed style
  ret = computed.getPropertyValue(name);

  // try style attribute (if element is not attached to document)
  if (ret === '' && !elem.ownerDocument) ret = elem.style[_camelCase(name)];

  return ret;
}


/**
 * Module API
 */
module.exports = {
  /** Add classes */
  addClass: jqLiteAddClass,

  /** Get or set CSS properties */
  css: jqLiteCss,

  /** Check for class */
  hasClass: jqLiteHasClass,

  /** Remove event handlers */
  off: jqLiteOff,

  /** Return offset values */
  offset: jqLiteOffset,

  /** Add event handlers */
  on: jqLiteOn,

  /** Add an execute-once event handler */
  one: jqLiteOne,

  /** DOM ready event handler */
  ready: jqLiteReady,

  /** Remove classes */
  removeClass: jqLiteRemoveClass,

  /** Check JavaScript variable instance type */
  type: jqLiteType,

  /** Get or set horizontal scroll position */
  scrollLeft: jqLiteScrollLeft,

  /** Get or set vertical scroll position */
  scrollTop: jqLiteScrollTop
};

},{}],"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/lib/util.js":[function(require,module,exports){
/**
 * MUI CSS/JS utilities module
 * @module lib/util
 */

'use strict';


var config = require('../config'),
    jqLite = require('./jqLite'),
    scrollLock = 0,
    scrollLockCls = 'mui-scroll-lock',
    scrollStyleEl,
    scrollEventHandler,
    _supportsPointerEvents;


scrollEventHandler = function(ev) {
  // stop propagation on window scroll events
  if (!ev.target.tagName) ev.stopImmediatePropagation();
}


/**
 * Logging function
 */
function logFn() {
  var win = window;
  
  if (config.debug && typeof win.console !== "undefined") {
    try {
      win.console.log.apply(win.console, arguments);
    } catch (a) {
      var e = Array.prototype.slice.call(arguments);
      win.console.log(e.join("\n"));
    }
  }
}


/**
 * Load CSS text in new stylesheet
 * @param {string} cssText - The css text.
 */
function loadStyleFn(cssText) {
  var doc = document,
      head;
  
  // copied from jQuery 
  head = doc.head ||
    doc.getElementsByTagName('head')[0] ||
    doc.documentElement;
  
  var e = doc.createElement('style');
  e.type = 'text/css';
  
  if (e.styleSheet) e.styleSheet.cssText = cssText;
  else e.appendChild(doc.createTextNode(cssText));
  
  // add to document
  head.insertBefore(e, head.firstChild);
  
  return e;
}


/**
 * Raise an error
 * @param {string} msg - The error message.
 */
function raiseErrorFn(msg, useConsole) {
  if (useConsole) {
    if (typeof console !== 'undefined') console.error('MUI Warning: ' + msg);
  } else {
    throw new Error('MUI: ' + msg);
  }
}


/**
 * Convert Classname object, with class as key and true/false as value, to an
 * class string.
 * @param  {Object} classes The classes
 * @return {String}         class string
 */
function classNamesFn(classes) {
  var cs = '';
  for (var i in classes) {
    cs += (classes[i]) ? i + ' ' : '';
  }
  return cs.trim();
}


/**
 * Check if client supports pointer events.
 */
function supportsPointerEventsFn() {
  // check cache
  if (_supportsPointerEvents !== undefined) return _supportsPointerEvents;
  
  var element = document.createElement('x');
  element.style.cssText = 'pointer-events:auto';
  _supportsPointerEvents = (element.style.pointerEvents === 'auto');
  return _supportsPointerEvents;
}


/**
 * Create callback closure.
 * @param {Object} instance - The object instance.
 * @param {String} funcName - The name of the callback function.
 */
function callbackFn(instance, funcName) {
  return function() {instance[funcName].apply(instance, arguments);};
}


/**
 * Dispatch event.
 * @param {Element} element - The DOM element.
 * @param {String} eventType - The event type.
 * @param {Boolean} bubbles=true - If true, event bubbles.
 * @param {Boolean} cancelable=true = If true, event is cancelable
 * @param {Object} [data] - Data to add to event object
 */
function dispatchEventFn(element, eventType, bubbles, cancelable, data) {
  var ev = document.createEvent('HTMLEvents'),
      bubbles = (bubbles !== undefined) ? bubbles : true,
       cancelable = (cancelable !== undefined) ? cancelable : true,
       k;

  ev.initEvent(eventType, bubbles, cancelable);
  
  // add data to event object
  if (data) for (k in data) ev[k] = data[k];
  
  // dispatch
  if (element) element.dispatchEvent(ev);
  
  return ev;
}


/**
 * Turn on window scroll lock.
 */
function enableScrollLockFn() {
  // increment counter
  scrollLock += 1;
  
  // add lock
  if (scrollLock === 1) {
    var htmlEl = document.documentElement,
        top = jqLite.scrollTop(window),
        left = jqLite.scrollLeft(window),
        cssProps,
        cssStr;

    // define scroll lock class dynamically
    cssProps = [
      'position:fixed',
      'top:' + -top + 'px',
      'right:0',
      'bottom:0',
      'left:' + -left + 'px'
    ];

    // scrollbar-y
    if (htmlEl.scrollHeight > htmlEl.clientHeight) {
      cssProps.push('overflow-y:scroll');
    }
    
    // scrollbar-x
    if (htmlEl.scrollWidth > htmlEl.clientWidth) {
      cssProps.push('overflow-x:scroll');
    }

    // define css class dynamically
    cssStr = '.' + scrollLockCls + '{';
    cssStr += cssProps.join(' !important;') + ' !important;}';
    scrollStyleEl = loadStyleFn(cssStr);

    // cancel 'scroll' event listener callbacks
    jqLite.on(window, 'scroll', scrollEventHandler, true);

    // add scroll lock
    jqLite.addClass(htmlEl, scrollLockCls);
  }
}


/**
 * Turn off window scroll lock.
 * @param {Boolean} resetPos - Reset scroll position to original value.
 */
function disableScrollLockFn(resetPos) {
  // ignore
  if (scrollLock === 0) return;

  // decrement counter
  scrollLock -= 1;

  // remove lock 
  if (scrollLock === 0) {
    var htmlEl = document.documentElement,
        top = parseInt(jqLite.css(htmlEl, 'top')),
        left = parseInt(jqLite.css(htmlEl, 'left'));

    // remove scroll lock and delete style element
    jqLite.removeClass(htmlEl, scrollLockCls);
    scrollStyleEl.parentNode.removeChild(scrollStyleEl);

    // restore scroll position
    window.scrollTo(-left, -top);      

    // restore scroll event listeners
    jqLite.off(window, 'scroll', scrollEventHandler, true);
  }
}

/**
 * requestAnimationFrame polyfilled
 * @param {Function} callback - The callback function
 */
function requestAnimationFrameFn(callback) {
  var fn = window.requestAnimationFrame;
  if (fn) fn(callback);
  else setTimeout(callback, 0);
}


/**
 * Define the module API
 */
module.exports = {
  /** Create callback closures */
  callback: callbackFn,
  
  /** Classnames object to string */
  classNames: classNamesFn,

  /** Disable scroll lock */
  disableScrollLock: disableScrollLockFn,

  /** Dispatch event */
  dispatchEvent: dispatchEventFn,
  
  /** Enable scroll lock */
  enableScrollLock: enableScrollLockFn,

  /** Log messages to the console when debug is turned on */
  log: logFn,

  /** Load CSS text as new stylesheet */
  loadStyle: loadStyleFn,

  /** Raise MUI error */
  raiseError: raiseErrorFn,

  /** Request animation frame */
  requestAnimationFrame: requestAnimationFrameFn,

  /** Support Pointer Events check */
  supportsPointerEvents: supportsPointerEventsFn
};

},{"../config":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/config.js","./jqLite":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/lib/jqLite.js"}],"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/overlay.js":[function(require,module,exports){
/**
 * MUI CSS/JS overlay module
 * @module overlay
 */

'use strict';


var util = require('./lib/util'),
    jqLite = require('./lib/jqLite'),
    overlayId = 'mui-overlay',
    bodyClass = 'mui--overflow-hidden',
    iosRegex = /(iPad|iPhone|iPod)/g,
    activeElement;


/**
 * Turn overlay on/off.
 * @param {string} action - Turn overlay "on"/"off".
 * @param {object} [options]
 * @config {boolean} [keyboard] - If true, close when escape key is pressed.
 * @config {boolean} [static] - If false, close when backdrop is clicked.
 * @config {Function} [onclose] - Callback function to execute on close
 * @param {Element} [childElement] - Child element to add to overlay.
 */
function overlayFn(action) {
  var overlayEl;
  
  if (action === 'on') {
    // extract arguments
    var arg, options, childElement;
    
    // pull options and childElement from arguments
    for (var i=arguments.length - 1; i > 0; i--) {
      arg = arguments[i];

      if (jqLite.type(arg) === 'object') options = arg;
      if (arg instanceof Element && arg.nodeType === 1) childElement = arg;
    }

    // option defaults
    options = options || {};
    if (options.keyboard === undefined) options.keyboard = true;
    if (options.static === undefined) options.static = false;
    
    // execute method
    overlayEl = overlayOn(options, childElement);
    
  } else if (action === 'off') {
    overlayEl = overlayOff();

  } else {
    // raise error
    util.raiseError("Expecting 'on' or 'off'");

  }

  return overlayEl;
}


/**
 * Turn on overlay.
 * @param {object} options - Overlay options.
 * @param {Element} childElement - The child element.
 */
function overlayOn(options, childElement) {
  var doc = document,
      bodyEl = doc.body,
      overlayEl = doc.getElementById(overlayId);

  // cache activeElement
  if (doc.activeElement) activeElement = doc.activeElement;

  // add overlay
  util.enableScrollLock();

  if (!overlayEl) {
    // create overlayEl
    overlayEl = doc.createElement('div');
    overlayEl.setAttribute('id', overlayId);
    overlayEl.setAttribute('tabindex', '-1');
    
    // add child element
    if (childElement) overlayEl.appendChild(childElement);

    bodyEl.appendChild(overlayEl);
    
  } else {
    // remove existing children
    while (overlayEl.firstChild) overlayEl.removeChild(overlayEl.firstChild);
    
    // add child element
    if (childElement) overlayEl.appendChild(childElement);
  }

  // iOS bugfix
  if (iosRegex.test(navigator.userAgent)) {
    jqLite.css(overlayEl, 'cursor', 'pointer');
  }

  // handle options
  if (options.keyboard) addKeyupHandler();
  else removeKeyupHandler();

  if (options.static) removeClickHandler(overlayEl);
  else addClickHandler(overlayEl);

  // attach options
  overlayEl.muiOptions = options;

  // focus overlay element
  overlayEl.focus();

  return overlayEl;
}


/**
 * Turn off overlay.
 */
function overlayOff() {
  var overlayEl = document.getElementById(overlayId),
      callbackFn;

  if (overlayEl) {
    // remove children
    while (overlayEl.firstChild) overlayEl.removeChild(overlayEl.firstChild);

    // remove overlay element
    overlayEl.parentNode.removeChild(overlayEl);

    // callback reference
    callbackFn = overlayEl.muiOptions.onclose;

    // remove click handler
    removeClickHandler(overlayEl);
  }

  util.disableScrollLock();

  // remove keyup handler
  removeKeyupHandler();

  // return focus to activeElement
  if (activeElement) activeElement.focus();

  // execute callback
  if (callbackFn) callbackFn();

  return overlayEl;
}


/**
 * Add keyup handler.
 */
function addKeyupHandler() {
  jqLite.on(document, 'keyup', onKeyup);
}


/**
 * Remove keyup handler.
 */
function removeKeyupHandler() {
  jqLite.off(document, 'keyup', onKeyup);
}


/**
 * Teardown overlay when escape key is pressed.
 */
function onKeyup(ev) {
  if (ev.keyCode === 27) overlayOff();
}


/**
 * Add click handler.
 */
function addClickHandler(overlayEl) {
  jqLite.on(overlayEl, 'click', onClick);
}


/**
 * Remove click handler.
 */
function removeClickHandler(overlayEl) {
  jqLite.off(overlayEl, 'click', onClick);
}


/**
 * Teardown overlay when backdrop is clicked.
 */
function onClick(ev) {
  if (ev.target.id === overlayId) overlayOff();
}


/** Define module API */
module.exports = overlayFn;

},{"./lib/jqLite":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/lib/jqLite.js","./lib/util":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/lib/js/lib/util.js"}],"/Users/GlenCoco/Desktop/DrunkChess/src/js/components/CreateGameForm.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var CreateGameForm = _reactAddons2["default"].createClass({
  displayName: "CreateGameForm",

  propTypes: {
    link: _reactAddons2["default"].PropTypes.string.isRequired,
    time: _reactAddons2["default"].PropTypes.string.isRequired,
    inc: _reactAddons2["default"].PropTypes.string.isRequired,
    onChangeForm: _reactAddons2["default"].PropTypes.func.isRequired,
    createGame: _reactAddons2["default"].PropTypes.func.isRequired
  },
  mixins: [_reactAddons2["default"].addons.PureRenderMixin],

  render: function render() {
    return _reactAddons2["default"].createElement(
      "form",
      { onSubmit: this.props.createGame },
      _reactAddons2["default"].createElement(
        "fieldset",
        null,
        _reactAddons2["default"].createElement(
          "label",
          null,
          _reactAddons2["default"].createElement(
            "span",
            null,
            "Minutes per side: "
          ),
          _reactAddons2["default"].createElement("input", {
            type: "number",
            name: "time",
            value: this.props.time,
            onChange: this.props.onChangeForm,
            min: "1",
            max: "50",
            required: true })
        ),
        _reactAddons2["default"].createElement(
          "label",
          { style: { paddingLeft: '2em' } },
          _reactAddons2["default"].createElement(
            "span",
            null,
            "Increment in seconds: "
          ),
          _reactAddons2["default"].createElement("input", {
            type: "number",
            name: "inc",
            value: this.props.inc,
            onChange: this.props.onChangeForm,
            min: "0",
            max: "50",
            required: true })
        )
      ),
      _reactAddons2["default"].createElement("input", {
        id: "game-link",
        type: "text",
        value: this.props.link || 'Game link will be generated here.',
        onClick: function (e) {
          return e.target.select();
        },
        readOnly: true }),
      _reactAddons2["default"].createElement(
        "button",
        { type: "submit", className: "btn yellow" },
        "Play"
      )
    );
  }
});

exports["default"] = CreateGameForm;
module.exports = exports["default"];

},{"react/addons":"react/addons"}],"/Users/GlenCoco/Desktop/DrunkChess/src/js/components/Index.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CreateGameForm = require('./CreateGameForm');

var _CreateGameForm2 = _interopRequireDefault(_CreateGameForm);

var _io = require('../io');

var _io2 = _interopRequireDefault(_io);

var Index = _react2['default'].createClass({
  displayName: 'Index',

  propTypes: {
    io: _react2['default'].PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      link: '',
      hasExpired: false,
      time: '30',
      inc: '0'
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var io = this.props.io;

    io.on('created', function (data) {
      var _state = _this.state;
      var time = _state.time;
      var inc = _state.inc;

      var loc = window.location;

      var origin = loc.origin || loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '');

      _this.setState({
        link: origin + '/play/' + data.token + '/' + time + '/' + inc,
        hasExpired: false
      });
    });
    io.on('ready', function () {
      window.location = _this.state.link;
    });
    io.on('token-expired', function () {
      return _this.setState({ hasExpired: true });
    });
  },
  render: function render() {
    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement('img', { src: '/img/beer.png',
        width: '120',
        height: '120',
        className: 'beer' }),
      _react2['default'].createElement(
        'h1',
        null,
        'Drunk Chess'
      ),
      _react2['default'].createElement(
        'p',
        null,
        'Click the button to create a game. Send the link to your friend. Once the link is opened your friend‘s browser, game should begin shortly. Colors are picked randomly by computer.'
      ),
      _react2['default'].createElement(
        'div',
        { id: 'create-game' },
        _react2['default'].createElement(_CreateGameForm2['default'], {
          link: this.state.link,
          time: this.state.time,
          inc: this.state.inc,
          onChangeForm: this._onChangeForm,
          createGame: this._createGame }),
        _react2['default'].createElement(
          'p',
          { id: 'game-status' },
          this.state.hasExpired ? 'Game link has expired, generate a new one' : this.state.link ? 'Waiting for opponent to connect' : null
        )
      ),
      _react2['default'].createElement(
        'p',
        null,
        _react2['default'].createElement(
          'a',
          { href: '/about', className: 'alpha' },
          'Read more about Drunk Chess'
        )
      )
    );
  },

  _onChangeForm: function _onChangeForm(e) {
    this.setState(_defineProperty({}, e.target.name, e.target.value));
  },
  _createGame: function _createGame(e) {
    e.preventDefault();

    var _state2 = this.state;
    var time = _state2.time;
    var inc = _state2.inc;

    var isInvalid = [time, inc].some(function (val) {
      val = parseInt(val, 10);
      return isNaN(val) || val < 0 || val > 50;
    });

    if (isInvalid) {
      // fallback for old browsers
      return window.alert('Form is invalid. Enter numbers between 0 and 50.');
    } else {
      this.props.io.emit('start');
    }
  }
});

exports['default'] = Index;
module.exports = exports['default'];

},{"../io":"/Users/GlenCoco/Desktop/DrunkChess/src/js/io.js","./CreateGameForm":"/Users/GlenCoco/Desktop/DrunkChess/src/js/components/CreateGameForm.js","react":"react"}],"/Users/GlenCoco/Desktop/DrunkChess/src/js/index.js":[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _componentsIndex = require('./components/Index');

var _componentsIndex2 = _interopRequireDefault(_componentsIndex);

require('muicss');

_react2['default'].render(_react2['default'].createElement(_componentsIndex2['default'], { io: _io2['default'] }), document.getElementById('container'));

},{"./components/Index":"/Users/GlenCoco/Desktop/DrunkChess/src/js/components/Index.js","./io":"/Users/GlenCoco/Desktop/DrunkChess/src/js/io.js","muicss":"/Users/GlenCoco/Desktop/DrunkChess/node_modules/muicss/index.js","react":"react"}],"/Users/GlenCoco/Desktop/DrunkChess/src/js/io.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var HOST = 'http://localhost:3000';

exports['default'] = _socketIoClient2['default'].connect(HOST);
module.exports = exports['default'];

},{"socket.io-client":"socket.io-client"}]},{},["/Users/GlenCoco/Desktop/DrunkChess/src/js/index.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbXVpY3NzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvbGliL2pxTGl0ZS5qcyIsIm5vZGVfbW9kdWxlcy9tdWljc3MvbGliL2pzL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvb3ZlcmxheS5qcyIsIi9Vc2Vycy9HbGVuQ29jby9EZXNrdG9wL0RydW5rQ2hlc3Mvc3JjL2pzL2NvbXBvbmVudHMvQ3JlYXRlR2FtZUZvcm0uanMiLCIvVXNlcnMvR2xlbkNvY28vRGVza3RvcC9EcnVua0NoZXNzL3NyYy9qcy9jb21wb25lbnRzL0luZGV4LmpzIiwiL1VzZXJzL0dsZW5Db2NvL0Rlc2t0b3AvRHJ1bmtDaGVzcy9zcmMvanMvaW5kZXguanMiLCIvVXNlcnMvR2xlbkNvY28vRGVza3RvcC9EcnVua0NoZXNzL3NyYy9qcy9pby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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SSxDQUFDLEtBQUs7UUFBdkIsSUFBSSxXQUFKLElBQUk7UUFBRSxHQUFHLFdBQUgsR0FBRzs7QUFDaEIsUUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ3hDLFNBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLGFBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztLQUMxQyxDQUFDLENBQUM7O0FBRUgsUUFBSSxTQUFTLEVBQUU7O0FBRWIsYUFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7S0FDekUsTUFBTTtBQUNMLFVBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM3QjtHQUNGO0NBQ0YsQ0FBQyxDQUFDOztxQkFFWSxLQUFLOzs7Ozs7OztxQkNsR0YsT0FBTzs7OztrQkFFVixNQUFNOzs7OytCQUNILG9CQUFvQjs7OztRQUMvQixRQUFROztBQUdmLG1CQUFNLE1BQU0sQ0FDVixpRUFBTyxFQUFFLGlCQUFLLEdBQUcsRUFDakIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FDckMsQ0FBQzs7Ozs7Ozs7Ozs7OEJDVmEsa0JBQWtCOzs7O0FBR2pDLElBQU0sSUFBSSxHQUFHLHVCQUF1QixDQUFDOztxQkFFdEIsNEJBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIE1VSSBOUE0gcGFja2FnZVxuICogQG1vZHVsZSBwa2cvaW5kZXguanNcbiAqL1xuXG4vKiogRGVmaW5lIG1vZHVsZSBBUEkgKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvdmVybGF5OiByZXF1aXJlKCcuL2xpYi9qcy9vdmVybGF5Jylcbn1cbiIsIi8qKlxuICogTVVJIGNvbmZpZyBtb2R1bGVcbiAqIEBtb2R1bGUgY29uZmlnXG4gKi9cblxuLyoqIERlZmluZSBtb2R1bGUgQVBJICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqIFVzZSBkZWJ1ZyBtb2RlICovXG4gIGRlYnVnOiB0cnVlXG59O1xuIiwiLyoqXG4gKiBNVUkgQ1NTL0pTIGpxTGl0ZSBtb2R1bGVcbiAqIEBtb2R1bGUgbGliL2pxTGl0ZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIEFkZCBhIGNsYXNzIHRvIGFuIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY3NzQ2xhc3NlcyAtIFNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIG5hbWVzLlxuICovXG5mdW5jdGlvbiBqcUxpdGVBZGRDbGFzcyhlbGVtZW50LCBjc3NDbGFzc2VzKSB7XG4gIGlmICghY3NzQ2xhc3NlcyB8fCAhZWxlbWVudC5zZXRBdHRyaWJ1dGUpIHJldHVybjtcblxuICB2YXIgZXhpc3RpbmdDbGFzc2VzID0gX2dldEV4aXN0aW5nQ2xhc3NlcyhlbGVtZW50KSxcbiAgICAgIHNwbGl0Q2xhc3NlcyA9IGNzc0NsYXNzZXMuc3BsaXQoJyAnKSxcbiAgICAgIGNzc0NsYXNzO1xuXG4gIGZvciAodmFyIGk9MDsgaSA8IHNwbGl0Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGNzc0NsYXNzID0gc3BsaXRDbGFzc2VzW2ldLnRyaW0oKTtcbiAgICBpZiAoZXhpc3RpbmdDbGFzc2VzLmluZGV4T2YoJyAnICsgY3NzQ2xhc3MgKyAnICcpID09PSAtMSkge1xuICAgICAgZXhpc3RpbmdDbGFzc2VzICs9IGNzc0NsYXNzICsgJyAnO1xuICAgIH1cbiAgfVxuICBcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgZXhpc3RpbmdDbGFzc2VzLnRyaW0oKSk7XG59XG5cblxuLyoqXG4gKiBHZXQgb3Igc2V0IENTUyBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lXSAtIFRoZSBwcm9wZXJ0eSBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV0gLSBUaGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZUNzcyhlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xuICAvLyBSZXR1cm4gZnVsbCBzdHlsZSBvYmplY3RcbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICB9XG5cbiAgdmFyIG5hbWVUeXBlID0ganFMaXRlVHlwZShuYW1lKTtcblxuICAvLyBTZXQgbXVsdGlwbGUgdmFsdWVzXG4gIGlmIChuYW1lVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkgZWxlbWVudC5zdHlsZVtfY2FtZWxDYXNlKGtleSldID0gbmFtZVtrZXldO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFNldCBhIHNpbmdsZSB2YWx1ZVxuICBpZiAobmFtZVR5cGUgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbGVtZW50LnN0eWxlW19jYW1lbENhc2UobmFtZSldID0gdmFsdWU7XG4gIH1cblxuICB2YXIgc3R5bGVPYmogPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgaXNBcnJheSA9IChqcUxpdGVUeXBlKG5hbWUpID09PSAnYXJyYXknKTtcblxuICAvLyBSZWFkIHNpbmdsZSB2YWx1ZVxuICBpZiAoIWlzQXJyYXkpIHJldHVybiBfZ2V0Q3VyckNzc1Byb3AoZWxlbWVudCwgbmFtZSwgc3R5bGVPYmopO1xuXG4gIC8vIFJlYWQgbXVsdGlwbGUgdmFsdWVzXG4gIHZhciBvdXRPYmogPSB7fSxcbiAgICAgIGtleTtcblxuICBmb3IgKHZhciBpPTA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XG4gICAga2V5ID0gbmFtZVtpXTtcbiAgICBvdXRPYmpba2V5XSA9IF9nZXRDdXJyQ3NzUHJvcChlbGVtZW50LCBrZXksIHN0eWxlT2JqKTtcbiAgfVxuXG4gIHJldHVybiBvdXRPYmo7XG59XG5cblxuLyoqXG4gKiBDaGVjayBpZiBlbGVtZW50IGhhcyBjbGFzcy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHMgLSBUaGUgY2xhc3MgbmFtZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZUhhc0NsYXNzKGVsZW1lbnQsIGNscykge1xuICBpZiAoIWNscyB8fCAhZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIChfZ2V0RXhpc3RpbmdDbGFzc2VzKGVsZW1lbnQpLmluZGV4T2YoJyAnICsgY2xzICsgJyAnKSA+IC0xKTtcbn1cblxuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBhIHZhcmlhYmxlLlxuICogQHBhcmFtIHt9IHNvbWV2YXIgLSBUaGUgSmF2YVNjcmlwdCB2YXJpYWJsZS5cbiAqL1xuZnVuY3Rpb24ganFMaXRlVHlwZShzb21ldmFyKSB7XG4gIC8vIGhhbmRsZSB1bmRlZmluZWRcbiAgaWYgKHNvbWV2YXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIC8vIGhhbmRsZSBvdGhlcnMgKG9mIHR5cGUgW29iamVjdCA8VHlwZT5dKVxuICB2YXIgdHlwZVN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzb21ldmFyKTtcbiAgaWYgKHR5cGVTdHIuaW5kZXhPZignW29iamVjdCAnKSA9PT0gMCkge1xuICAgIHJldHVybiB0eXBlU3RyLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk1VSTogQ291bGQgbm90IHVuZGVyc3RhbmQgdHlwZTogXCIgKyB0eXBlU3RyKTtcbiAgfSAgICBcbn1cblxuXG4vKipcbiAqIEF0dGFjaCBhbiBldmVudCBoYW5kbGVyIHRvIGEgRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudHMgLSBTcGFjZSBzZXBhcmF0ZWQgZXZlbnQgbmFtZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZSAtIFVzZSBjYXB0dXJlIGZsYWcuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZU9uKGVsZW1lbnQsIGV2ZW50cywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgdXNlQ2FwdHVyZSA9ICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiB1c2VDYXB0dXJlO1xuXG4gIHZhciBjYWNoZSA9IGVsZW1lbnQuX211aUV2ZW50Q2FjaGUgPSBlbGVtZW50Ll9tdWlFdmVudENhY2hlIHx8IHt9OyAgXG5cbiAgZXZlbnRzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgLy8gYWRkIHRvIERPTVxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpO1xuXG4gICAgLy8gYWRkIHRvIGNhY2hlXG4gICAgY2FjaGVbZXZlbnRdID0gY2FjaGVbZXZlbnRdIHx8IFtdO1xuICAgIGNhY2hlW2V2ZW50XS5wdXNoKFtjYWxsYmFjaywgdXNlQ2FwdHVyZV0pO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSBhbiBldmVudCBoYW5kbGVyIGZyb20gYSBET00gZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50cyAtIFNwYWNlIHNlcGFyYXRlZCBldmVudCBuYW1lcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlIC0gVXNlIGNhcHR1cmUgZmxhZy5cbiAqL1xuZnVuY3Rpb24ganFMaXRlT2ZmKGVsZW1lbnQsIGV2ZW50cywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgdXNlQ2FwdHVyZSA9ICh1c2VDYXB0dXJlID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiB1c2VDYXB0dXJlO1xuXG4gIC8vIHJlbW92ZSBmcm9tIGNhY2hlXG4gIHZhciBjYWNoZSA9IGVsZW1lbnQuX211aUV2ZW50Q2FjaGUgPSBlbGVtZW50Ll9tdWlFdmVudENhY2hlIHx8IHt9LFxuICAgICAgYXJnc0xpc3QsXG4gICAgICBhcmdzLFxuICAgICAgaTtcblxuICBldmVudHMuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBhcmdzTGlzdCA9IGNhY2hlW2V2ZW50XSB8fCBbXTtcblxuICAgIGkgPSBhcmdzTGlzdC5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJncyA9IGFyZ3NMaXN0W2ldO1xuXG4gICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyBpZiBjYWxsYmFjayBpcyB1bmRlZmluZWRcbiAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgKGFyZ3NbMF0gPT09IGNhbGxiYWNrICYmIGFyZ3NbMV0gPT09IHVzZUNhcHR1cmUpKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gY2FjaGVcbiAgICAgICAgYXJnc0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICBcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiAqIEF0dGFjaCBhbiBldmVudCBoYW5kZXIgd2hpY2ggd2lsbCBvbmx5IGV4ZWN1dGUgb25jZSBwZXIgZWxlbWVudCBwZXIgZXZlbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudHMgLSBTcGFjZSBzZXBhcmF0ZWQgZXZlbnQgbmFtZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZSAtIFVzZSBjYXB0dXJlIGZsYWcuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZU9uZShlbGVtZW50LCBldmVudHMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gIGV2ZW50cy5zcGxpdCgnICcpLm1hcChmdW5jdGlvbihldmVudCkge1xuICAgIGpxTGl0ZU9uKGVsZW1lbnQsIGV2ZW50LCBmdW5jdGlvbiBvbkZuKGV2KSB7XG4gICAgICAvLyBleGVjdXRlIGNhbGxiYWNrXG4gICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIC8vIHJlbW92ZSB3cmFwcGVyXG4gICAgICBqcUxpdGVPZmYoZWxlbWVudCwgZXZlbnQsIG9uRm4sIHVzZUNhcHR1cmUpO1xuICAgIH0sIHVzZUNhcHR1cmUpO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIEdldCBvciBzZXQgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb25cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudFxuICogQHBhcmFtIHtudW1iZXJ9IFt2YWx1ZV0gLSBUaGUgc2Nyb2xsIHBvc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZVNjcm9sbExlZnQoZWxlbWVudCwgdmFsdWUpIHtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICAvLyBnZXRcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gd2luKSB7XG4gICAgICB2YXIgZG9jRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICByZXR1cm4gKHdpbi5wYWdlWE9mZnNldCB8fCBkb2NFbC5zY3JvbGxMZWZ0KSAtIChkb2NFbC5jbGllbnRMZWZ0IHx8IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldFxuICBpZiAoZWxlbWVudCA9PT0gd2luKSB3aW4uc2Nyb2xsVG8odmFsdWUsIGpxTGl0ZVNjcm9sbFRvcCh3aW4pKTtcbiAgZWxzZSBlbGVtZW50LnNjcm9sbExlZnQgPSB2YWx1ZTtcbn1cblxuXG4vKipcbiAqIEdldCBvciBzZXQgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFRoZSBzY3JvbGwgcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24ganFMaXRlU2Nyb2xsVG9wKGVsZW1lbnQsIHZhbHVlKSB7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgLy8gZ2V0XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKGVsZW1lbnQgPT09IHdpbikge1xuICAgICAgdmFyIGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgcmV0dXJuICh3aW4ucGFnZVlPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsVG9wKSAtIChkb2NFbC5jbGllbnRUb3AgfHwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbGVtZW50LnNjcm9sbFRvcDtcbiAgICB9XG4gIH1cblxuICAvLyBzZXRcbiAgaWYgKGVsZW1lbnQgPT09IHdpbikgd2luLnNjcm9sbFRvKGpxTGl0ZVNjcm9sbExlZnQod2luKSwgdmFsdWUpO1xuICBlbHNlIGVsZW1lbnQuc2Nyb2xsVG9wID0gdmFsdWU7XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyB0b3AvbGVmdCBvZmZzZXQgYW5kIGVsZW1lbnQgaGVpZ2h0L3dpZHRoLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBqcUxpdGVPZmZzZXQoZWxlbWVudCkge1xuICB2YXIgd2luID0gd2luZG93LFxuICAgICAgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICBzY3JvbGxUb3AgPSBqcUxpdGVTY3JvbGxUb3Aod2luKSxcbiAgICAgIHNjcm9sbExlZnQgPSBqcUxpdGVTY3JvbGxMZWZ0KHdpbik7XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLFxuICAgIGxlZnQ6IHJlY3QubGVmdCArIHNjcm9sbExlZnQsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICB3aWR0aDogcmVjdC53aWR0aFxuICB9O1xufVxuXG5cbi8qKlxuICogQXR0YWNoIGEgY2FsbGJhY2sgdG8gdGhlIERPTSByZWFkeSBldmVudCBsaXN0ZW5lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZVJlYWR5KGZuKSB7XG4gIHZhciBkb25lID0gZmFsc2UsXG4gICAgICB0b3AgPSB0cnVlLFxuICAgICAgZG9jID0gZG9jdW1lbnQsXG4gICAgICB3aW4gPSBkb2MuZGVmYXVsdFZpZXcsXG4gICAgICByb290ID0gZG9jLmRvY3VtZW50RWxlbWVudCxcbiAgICAgIGFkZCA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ2F0dGFjaEV2ZW50JyxcbiAgICAgIHJlbSA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInIDogJ2RldGFjaEV2ZW50JyxcbiAgICAgIHByZSA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gJycgOiAnb24nO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLnR5cGUgPT0gJ3JlYWR5c3RhdGVjaGFuZ2UnICYmIGRvYy5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoZS50eXBlID09ICdsb2FkJyA/IHdpbiA6IGRvYylbcmVtXShwcmUgKyBlLnR5cGUsIGluaXQsIGZhbHNlKTtcbiAgICBpZiAoIWRvbmUgJiYgKGRvbmUgPSB0cnVlKSkgZm4uY2FsbCh3aW4sIGUudHlwZSB8fCBlKTtcbiAgfTtcblxuICB2YXIgcG9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7IHJvb3QuZG9TY3JvbGwoJ2xlZnQnKTsgfSBjYXRjaChlKSB7IHNldFRpbWVvdXQocG9sbCwgNTApOyByZXR1cm47IH1cbiAgICBpbml0KCdwb2xsJyk7XG4gIH07XG5cbiAgaWYgKGRvYy5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpIHtcbiAgICBmbi5jYWxsKHdpbiwgJ2xhenknKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZG9jLmNyZWF0ZUV2ZW50T2JqZWN0ICYmIHJvb3QuZG9TY3JvbGwpIHtcbiAgICAgIHRyeSB7IHRvcCA9ICF3aW4uZnJhbWVFbGVtZW50OyB9IGNhdGNoKGUpIHsgfVxuICAgICAgaWYgKHRvcCkgcG9sbCgpO1xuICAgIH1cbiAgICBkb2NbYWRkXShwcmUgKyAnRE9NQ29udGVudExvYWRlZCcsIGluaXQsIGZhbHNlKTtcbiAgICBkb2NbYWRkXShwcmUgKyAncmVhZHlzdGF0ZWNoYW5nZScsIGluaXQsIGZhbHNlKTtcbiAgICB3aW5bYWRkXShwcmUgKyAnbG9hZCcsIGluaXQsIGZhbHNlKTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmVtb3ZlIGNsYXNzZXMgZnJvbSBhIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY3NzQ2xhc3NlcyAtIFNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIG5hbWVzLlxuICovXG5mdW5jdGlvbiBqcUxpdGVSZW1vdmVDbGFzcyhlbGVtZW50LCBjc3NDbGFzc2VzKSB7XG4gIGlmICghY3NzQ2xhc3NlcyB8fCAhZWxlbWVudC5zZXRBdHRyaWJ1dGUpIHJldHVybjtcblxuICB2YXIgZXhpc3RpbmdDbGFzc2VzID0gX2dldEV4aXN0aW5nQ2xhc3NlcyhlbGVtZW50KSxcbiAgICAgIHNwbGl0Q2xhc3NlcyA9IGNzc0NsYXNzZXMuc3BsaXQoJyAnKSxcbiAgICAgIGNzc0NsYXNzO1xuICBcbiAgZm9yICh2YXIgaT0wOyBpIDwgc3BsaXRDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY3NzQ2xhc3MgPSBzcGxpdENsYXNzZXNbaV0udHJpbSgpO1xuICAgIHdoaWxlIChleGlzdGluZ0NsYXNzZXMuaW5kZXhPZignICcgKyBjc3NDbGFzcyArICcgJykgPj0gMCkge1xuICAgICAgZXhpc3RpbmdDbGFzc2VzID0gZXhpc3RpbmdDbGFzc2VzLnJlcGxhY2UoJyAnICsgY3NzQ2xhc3MgKyAnICcsICcgJyk7XG4gICAgfVxuICB9XG5cbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgZXhpc3RpbmdDbGFzc2VzLnRyaW0oKSk7XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBVdGlsaXRpZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2csXG4gICAgTU9aX0hBQ0tfUkVHRVhQID0gL15tb3ooW0EtWl0pLyxcbiAgICBFU0NBUEVfUkVHRVhQID0gLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZztcblxuXG5mdW5jdGlvbiBfZ2V0RXhpc3RpbmdDbGFzc2VzKGVsZW1lbnQpIHtcbiAgdmFyIGNsYXNzZXMgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpLnJlcGxhY2UoL1tcXG5cXHRdL2csICcnKTtcbiAgcmV0dXJuICcgJyArIGNsYXNzZXMgKyAnICc7XG59XG5cblxuZnVuY3Rpb24gX2NhbWVsQ2FzZShuYW1lKSB7XG4gIHJldHVybiBuYW1lLlxuICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcbiAgICAgIHJldHVybiBvZmZzZXQgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcbiAgICB9KS5cbiAgICByZXBsYWNlKE1PWl9IQUNLX1JFR0VYUCwgJ01veiQxJyk7XG59XG5cblxuZnVuY3Rpb24gX2VzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKEVTQ0FQRV9SRUdFWFAsIFwiXFxcXCQxXCIpO1xufVxuXG5cbmZ1bmN0aW9uIF9nZXRDdXJyQ3NzUHJvcChlbGVtLCBuYW1lLCBjb21wdXRlZCkge1xuICB2YXIgcmV0O1xuXG4gIC8vIHRyeSBjb21wdXRlZCBzdHlsZVxuICByZXQgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gIC8vIHRyeSBzdHlsZSBhdHRyaWJ1dGUgKGlmIGVsZW1lbnQgaXMgbm90IGF0dGFjaGVkIHRvIGRvY3VtZW50KVxuICBpZiAocmV0ID09PSAnJyAmJiAhZWxlbS5vd25lckRvY3VtZW50KSByZXQgPSBlbGVtLnN0eWxlW19jYW1lbENhc2UobmFtZSldO1xuXG4gIHJldHVybiByZXQ7XG59XG5cblxuLyoqXG4gKiBNb2R1bGUgQVBJXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKiogQWRkIGNsYXNzZXMgKi9cbiAgYWRkQ2xhc3M6IGpxTGl0ZUFkZENsYXNzLFxuXG4gIC8qKiBHZXQgb3Igc2V0IENTUyBwcm9wZXJ0aWVzICovXG4gIGNzczoganFMaXRlQ3NzLFxuXG4gIC8qKiBDaGVjayBmb3IgY2xhc3MgKi9cbiAgaGFzQ2xhc3M6IGpxTGl0ZUhhc0NsYXNzLFxuXG4gIC8qKiBSZW1vdmUgZXZlbnQgaGFuZGxlcnMgKi9cbiAgb2ZmOiBqcUxpdGVPZmYsXG5cbiAgLyoqIFJldHVybiBvZmZzZXQgdmFsdWVzICovXG4gIG9mZnNldDoganFMaXRlT2Zmc2V0LFxuXG4gIC8qKiBBZGQgZXZlbnQgaGFuZGxlcnMgKi9cbiAgb246IGpxTGl0ZU9uLFxuXG4gIC8qKiBBZGQgYW4gZXhlY3V0ZS1vbmNlIGV2ZW50IGhhbmRsZXIgKi9cbiAgb25lOiBqcUxpdGVPbmUsXG5cbiAgLyoqIERPTSByZWFkeSBldmVudCBoYW5kbGVyICovXG4gIHJlYWR5OiBqcUxpdGVSZWFkeSxcblxuICAvKiogUmVtb3ZlIGNsYXNzZXMgKi9cbiAgcmVtb3ZlQ2xhc3M6IGpxTGl0ZVJlbW92ZUNsYXNzLFxuXG4gIC8qKiBDaGVjayBKYXZhU2NyaXB0IHZhcmlhYmxlIGluc3RhbmNlIHR5cGUgKi9cbiAgdHlwZToganFMaXRlVHlwZSxcblxuICAvKiogR2V0IG9yIHNldCBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiAqL1xuICBzY3JvbGxMZWZ0OiBqcUxpdGVTY3JvbGxMZWZ0LFxuXG4gIC8qKiBHZXQgb3Igc2V0IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiAqL1xuICBzY3JvbGxUb3A6IGpxTGl0ZVNjcm9sbFRvcFxufTtcbiIsIi8qKlxuICogTVVJIENTUy9KUyB1dGlsaXRpZXMgbW9kdWxlXG4gKiBAbW9kdWxlIGxpYi91dGlsXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKSxcbiAgICBqcUxpdGUgPSByZXF1aXJlKCcuL2pxTGl0ZScpLFxuICAgIHNjcm9sbExvY2sgPSAwLFxuICAgIHNjcm9sbExvY2tDbHMgPSAnbXVpLXNjcm9sbC1sb2NrJyxcbiAgICBzY3JvbGxTdHlsZUVsLFxuICAgIHNjcm9sbEV2ZW50SGFuZGxlcixcbiAgICBfc3VwcG9ydHNQb2ludGVyRXZlbnRzO1xuXG5cbnNjcm9sbEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGV2KSB7XG4gIC8vIHN0b3AgcHJvcGFnYXRpb24gb24gd2luZG93IHNjcm9sbCBldmVudHNcbiAgaWYgKCFldi50YXJnZXQudGFnTmFtZSkgZXYuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG59XG5cblxuLyoqXG4gKiBMb2dnaW5nIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGxvZ0ZuKCkge1xuICB2YXIgd2luID0gd2luZG93O1xuICBcbiAgaWYgKGNvbmZpZy5kZWJ1ZyAmJiB0eXBlb2Ygd2luLmNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB0cnkge1xuICAgICAgd2luLmNvbnNvbGUubG9nLmFwcGx5KHdpbi5jb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH0gY2F0Y2ggKGEpIHtcbiAgICAgIHZhciBlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHdpbi5jb25zb2xlLmxvZyhlLmpvaW4oXCJcXG5cIikpO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogTG9hZCBDU1MgdGV4dCBpbiBuZXcgc3R5bGVzaGVldFxuICogQHBhcmFtIHtzdHJpbmd9IGNzc1RleHQgLSBUaGUgY3NzIHRleHQuXG4gKi9cbmZ1bmN0aW9uIGxvYWRTdHlsZUZuKGNzc1RleHQpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgaGVhZDtcbiAgXG4gIC8vIGNvcGllZCBmcm9tIGpRdWVyeSBcbiAgaGVhZCA9IGRvYy5oZWFkIHx8XG4gICAgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0gfHxcbiAgICBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICBcbiAgdmFyIGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgZS50eXBlID0gJ3RleHQvY3NzJztcbiAgXG4gIGlmIChlLnN0eWxlU2hlZXQpIGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgZWxzZSBlLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gIFxuICAvLyBhZGQgdG8gZG9jdW1lbnRcbiAgaGVhZC5pbnNlcnRCZWZvcmUoZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgXG4gIHJldHVybiBlO1xufVxuXG5cbi8qKlxuICogUmFpc2UgYW4gZXJyb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gcmFpc2VFcnJvckZuKG1zZywgdXNlQ29uc29sZSkge1xuICBpZiAodXNlQ29uc29sZSkge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIGNvbnNvbGUuZXJyb3IoJ01VSSBXYXJuaW5nOiAnICsgbXNnKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01VSTogJyArIG1zZyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIENvbnZlcnQgQ2xhc3NuYW1lIG9iamVjdCwgd2l0aCBjbGFzcyBhcyBrZXkgYW5kIHRydWUvZmFsc2UgYXMgdmFsdWUsIHRvIGFuXG4gKiBjbGFzcyBzdHJpbmcuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNsYXNzZXMgVGhlIGNsYXNzZXNcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICBjbGFzcyBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gY2xhc3NOYW1lc0ZuKGNsYXNzZXMpIHtcbiAgdmFyIGNzID0gJyc7XG4gIGZvciAodmFyIGkgaW4gY2xhc3Nlcykge1xuICAgIGNzICs9IChjbGFzc2VzW2ldKSA/IGkgKyAnICcgOiAnJztcbiAgfVxuICByZXR1cm4gY3MudHJpbSgpO1xufVxuXG5cbi8qKlxuICogQ2hlY2sgaWYgY2xpZW50IHN1cHBvcnRzIHBvaW50ZXIgZXZlbnRzLlxuICovXG5mdW5jdGlvbiBzdXBwb3J0c1BvaW50ZXJFdmVudHNGbigpIHtcbiAgLy8gY2hlY2sgY2FjaGVcbiAgaWYgKF9zdXBwb3J0c1BvaW50ZXJFdmVudHMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIF9zdXBwb3J0c1BvaW50ZXJFdmVudHM7XG4gIFxuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKTtcbiAgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ3BvaW50ZXItZXZlbnRzOmF1dG8nO1xuICBfc3VwcG9ydHNQb2ludGVyRXZlbnRzID0gKGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9PT0gJ2F1dG8nKTtcbiAgcmV0dXJuIF9zdXBwb3J0c1BvaW50ZXJFdmVudHM7XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgY2FsbGJhY2sgY2xvc3VyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZSAtIFRoZSBvYmplY3QgaW5zdGFuY2UuXG4gKiBAcGFyYW0ge1N0cmluZ30gZnVuY05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhbGxiYWNrRm4oaW5zdGFuY2UsIGZ1bmNOYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtpbnN0YW5jZVtmdW5jTmFtZV0uYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7fTtcbn1cblxuXG4vKipcbiAqIERpc3BhdGNoIGV2ZW50LlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZSAtIFRoZSBldmVudCB0eXBlLlxuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzPXRydWUgLSBJZiB0cnVlLCBldmVudCBidWJibGVzLlxuICogQHBhcmFtIHtCb29sZWFufSBjYW5jZWxhYmxlPXRydWUgPSBJZiB0cnVlLCBldmVudCBpcyBjYW5jZWxhYmxlXG4gKiBAcGFyYW0ge09iamVjdH0gW2RhdGFdIC0gRGF0YSB0byBhZGQgdG8gZXZlbnQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnRGbihlbGVtZW50LCBldmVudFR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRhdGEpIHtcbiAgdmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKSxcbiAgICAgIGJ1YmJsZXMgPSAoYnViYmxlcyAhPT0gdW5kZWZpbmVkKSA/IGJ1YmJsZXMgOiB0cnVlLFxuICAgICAgIGNhbmNlbGFibGUgPSAoY2FuY2VsYWJsZSAhPT0gdW5kZWZpbmVkKSA/IGNhbmNlbGFibGUgOiB0cnVlLFxuICAgICAgIGs7XG5cbiAgZXYuaW5pdEV2ZW50KGV2ZW50VHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XG4gIFxuICAvLyBhZGQgZGF0YSB0byBldmVudCBvYmplY3RcbiAgaWYgKGRhdGEpIGZvciAoayBpbiBkYXRhKSBldltrXSA9IGRhdGFba107XG4gIFxuICAvLyBkaXNwYXRjaFxuICBpZiAoZWxlbWVudCkgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgXG4gIHJldHVybiBldjtcbn1cblxuXG4vKipcbiAqIFR1cm4gb24gd2luZG93IHNjcm9sbCBsb2NrLlxuICovXG5mdW5jdGlvbiBlbmFibGVTY3JvbGxMb2NrRm4oKSB7XG4gIC8vIGluY3JlbWVudCBjb3VudGVyXG4gIHNjcm9sbExvY2sgKz0gMTtcbiAgXG4gIC8vIGFkZCBsb2NrXG4gIGlmIChzY3JvbGxMb2NrID09PSAxKSB7XG4gICAgdmFyIGh0bWxFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgdG9wID0ganFMaXRlLnNjcm9sbFRvcCh3aW5kb3cpLFxuICAgICAgICBsZWZ0ID0ganFMaXRlLnNjcm9sbExlZnQod2luZG93KSxcbiAgICAgICAgY3NzUHJvcHMsXG4gICAgICAgIGNzc1N0cjtcblxuICAgIC8vIGRlZmluZSBzY3JvbGwgbG9jayBjbGFzcyBkeW5hbWljYWxseVxuICAgIGNzc1Byb3BzID0gW1xuICAgICAgJ3Bvc2l0aW9uOmZpeGVkJyxcbiAgICAgICd0b3A6JyArIC10b3AgKyAncHgnLFxuICAgICAgJ3JpZ2h0OjAnLFxuICAgICAgJ2JvdHRvbTowJyxcbiAgICAgICdsZWZ0OicgKyAtbGVmdCArICdweCdcbiAgICBdO1xuXG4gICAgLy8gc2Nyb2xsYmFyLXlcbiAgICBpZiAoaHRtbEVsLnNjcm9sbEhlaWdodCA+IGh0bWxFbC5jbGllbnRIZWlnaHQpIHtcbiAgICAgIGNzc1Byb3BzLnB1c2goJ292ZXJmbG93LXk6c2Nyb2xsJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIHNjcm9sbGJhci14XG4gICAgaWYgKGh0bWxFbC5zY3JvbGxXaWR0aCA+IGh0bWxFbC5jbGllbnRXaWR0aCkge1xuICAgICAgY3NzUHJvcHMucHVzaCgnb3ZlcmZsb3cteDpzY3JvbGwnKTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgY3NzIGNsYXNzIGR5bmFtaWNhbGx5XG4gICAgY3NzU3RyID0gJy4nICsgc2Nyb2xsTG9ja0NscyArICd7JztcbiAgICBjc3NTdHIgKz0gY3NzUHJvcHMuam9pbignICFpbXBvcnRhbnQ7JykgKyAnICFpbXBvcnRhbnQ7fSc7XG4gICAgc2Nyb2xsU3R5bGVFbCA9IGxvYWRTdHlsZUZuKGNzc1N0cik7XG5cbiAgICAvLyBjYW5jZWwgJ3Njcm9sbCcgZXZlbnQgbGlzdGVuZXIgY2FsbGJhY2tzXG4gICAganFMaXRlLm9uKHdpbmRvdywgJ3Njcm9sbCcsIHNjcm9sbEV2ZW50SGFuZGxlciwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgc2Nyb2xsIGxvY2tcbiAgICBqcUxpdGUuYWRkQ2xhc3MoaHRtbEVsLCBzY3JvbGxMb2NrQ2xzKTtcbiAgfVxufVxuXG5cbi8qKlxuICogVHVybiBvZmYgd2luZG93IHNjcm9sbCBsb2NrLlxuICogQHBhcmFtIHtCb29sZWFufSByZXNldFBvcyAtIFJlc2V0IHNjcm9sbCBwb3NpdGlvbiB0byBvcmlnaW5hbCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZGlzYWJsZVNjcm9sbExvY2tGbihyZXNldFBvcykge1xuICAvLyBpZ25vcmVcbiAgaWYgKHNjcm9sbExvY2sgPT09IDApIHJldHVybjtcblxuICAvLyBkZWNyZW1lbnQgY291bnRlclxuICBzY3JvbGxMb2NrIC09IDE7XG5cbiAgLy8gcmVtb3ZlIGxvY2sgXG4gIGlmIChzY3JvbGxMb2NrID09PSAwKSB7XG4gICAgdmFyIGh0bWxFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgdG9wID0gcGFyc2VJbnQoanFMaXRlLmNzcyhodG1sRWwsICd0b3AnKSksXG4gICAgICAgIGxlZnQgPSBwYXJzZUludChqcUxpdGUuY3NzKGh0bWxFbCwgJ2xlZnQnKSk7XG5cbiAgICAvLyByZW1vdmUgc2Nyb2xsIGxvY2sgYW5kIGRlbGV0ZSBzdHlsZSBlbGVtZW50XG4gICAganFMaXRlLnJlbW92ZUNsYXNzKGh0bWxFbCwgc2Nyb2xsTG9ja0Nscyk7XG4gICAgc2Nyb2xsU3R5bGVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcm9sbFN0eWxlRWwpO1xuXG4gICAgLy8gcmVzdG9yZSBzY3JvbGwgcG9zaXRpb25cbiAgICB3aW5kb3cuc2Nyb2xsVG8oLWxlZnQsIC10b3ApOyAgICAgIFxuXG4gICAgLy8gcmVzdG9yZSBzY3JvbGwgZXZlbnQgbGlzdGVuZXJzXG4gICAganFMaXRlLm9mZih3aW5kb3csICdzY3JvbGwnLCBzY3JvbGxFdmVudEhhbmRsZXIsIHRydWUpO1xuICB9XG59XG5cbi8qKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZUZuKGNhbGxiYWNrKSB7XG4gIHZhciBmbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIGlmIChmbikgZm4oY2FsbGJhY2spO1xuICBlbHNlIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xufVxuXG5cbi8qKlxuICogRGVmaW5lIHRoZSBtb2R1bGUgQVBJXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKiogQ3JlYXRlIGNhbGxiYWNrIGNsb3N1cmVzICovXG4gIGNhbGxiYWNrOiBjYWxsYmFja0ZuLFxuICBcbiAgLyoqIENsYXNzbmFtZXMgb2JqZWN0IHRvIHN0cmluZyAqL1xuICBjbGFzc05hbWVzOiBjbGFzc05hbWVzRm4sXG5cbiAgLyoqIERpc2FibGUgc2Nyb2xsIGxvY2sgKi9cbiAgZGlzYWJsZVNjcm9sbExvY2s6IGRpc2FibGVTY3JvbGxMb2NrRm4sXG5cbiAgLyoqIERpc3BhdGNoIGV2ZW50ICovXG4gIGRpc3BhdGNoRXZlbnQ6IGRpc3BhdGNoRXZlbnRGbixcbiAgXG4gIC8qKiBFbmFibGUgc2Nyb2xsIGxvY2sgKi9cbiAgZW5hYmxlU2Nyb2xsTG9jazogZW5hYmxlU2Nyb2xsTG9ja0ZuLFxuXG4gIC8qKiBMb2cgbWVzc2FnZXMgdG8gdGhlIGNvbnNvbGUgd2hlbiBkZWJ1ZyBpcyB0dXJuZWQgb24gKi9cbiAgbG9nOiBsb2dGbixcblxuICAvKiogTG9hZCBDU1MgdGV4dCBhcyBuZXcgc3R5bGVzaGVldCAqL1xuICBsb2FkU3R5bGU6IGxvYWRTdHlsZUZuLFxuXG4gIC8qKiBSYWlzZSBNVUkgZXJyb3IgKi9cbiAgcmFpc2VFcnJvcjogcmFpc2VFcnJvckZuLFxuXG4gIC8qKiBSZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IHJlcXVlc3RBbmltYXRpb25GcmFtZUZuLFxuXG4gIC8qKiBTdXBwb3J0IFBvaW50ZXIgRXZlbnRzIGNoZWNrICovXG4gIHN1cHBvcnRzUG9pbnRlckV2ZW50czogc3VwcG9ydHNQb2ludGVyRXZlbnRzRm5cbn07XG4iLCIvKipcbiAqIE1VSSBDU1MvSlMgb3ZlcmxheSBtb2R1bGVcbiAqIEBtb2R1bGUgb3ZlcmxheVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vbGliL3V0aWwnKSxcbiAgICBqcUxpdGUgPSByZXF1aXJlKCcuL2xpYi9qcUxpdGUnKSxcbiAgICBvdmVybGF5SWQgPSAnbXVpLW92ZXJsYXknLFxuICAgIGJvZHlDbGFzcyA9ICdtdWktLW92ZXJmbG93LWhpZGRlbicsXG4gICAgaW9zUmVnZXggPSAvKGlQYWR8aVBob25lfGlQb2QpL2csXG4gICAgYWN0aXZlRWxlbWVudDtcblxuXG4vKipcbiAqIFR1cm4gb3ZlcmxheSBvbi9vZmYuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gVHVybiBvdmVybGF5IFwib25cIi9cIm9mZlwiLlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQGNvbmZpZyB7Ym9vbGVhbn0gW2tleWJvYXJkXSAtIElmIHRydWUsIGNsb3NlIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICogQGNvbmZpZyB7Ym9vbGVhbn0gW3N0YXRpY10gLSBJZiBmYWxzZSwgY2xvc2Ugd2hlbiBiYWNrZHJvcCBpcyBjbGlja2VkLlxuICogQGNvbmZpZyB7RnVuY3Rpb259IFtvbmNsb3NlXSAtIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gY2xvc2VcbiAqIEBwYXJhbSB7RWxlbWVudH0gW2NoaWxkRWxlbWVudF0gLSBDaGlsZCBlbGVtZW50IHRvIGFkZCB0byBvdmVybGF5LlxuICovXG5mdW5jdGlvbiBvdmVybGF5Rm4oYWN0aW9uKSB7XG4gIHZhciBvdmVybGF5RWw7XG4gIFxuICBpZiAoYWN0aW9uID09PSAnb24nKSB7XG4gICAgLy8gZXh0cmFjdCBhcmd1bWVudHNcbiAgICB2YXIgYXJnLCBvcHRpb25zLCBjaGlsZEVsZW1lbnQ7XG4gICAgXG4gICAgLy8gcHVsbCBvcHRpb25zIGFuZCBjaGlsZEVsZW1lbnQgZnJvbSBhcmd1bWVudHNcbiAgICBmb3IgKHZhciBpPWFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGlmIChqcUxpdGUudHlwZShhcmcpID09PSAnb2JqZWN0Jykgb3B0aW9ucyA9IGFyZztcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBFbGVtZW50ICYmIGFyZy5ub2RlVHlwZSA9PT0gMSkgY2hpbGRFbGVtZW50ID0gYXJnO1xuICAgIH1cblxuICAgIC8vIG9wdGlvbiBkZWZhdWx0c1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLmtleWJvYXJkID09PSB1bmRlZmluZWQpIG9wdGlvbnMua2V5Ym9hcmQgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnN0YXRpYyA9PT0gdW5kZWZpbmVkKSBvcHRpb25zLnN0YXRpYyA9IGZhbHNlO1xuICAgIFxuICAgIC8vIGV4ZWN1dGUgbWV0aG9kXG4gICAgb3ZlcmxheUVsID0gb3ZlcmxheU9uKG9wdGlvbnMsIGNoaWxkRWxlbWVudCk7XG4gICAgXG4gIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnb2ZmJykge1xuICAgIG92ZXJsYXlFbCA9IG92ZXJsYXlPZmYoKTtcblxuICB9IGVsc2Uge1xuICAgIC8vIHJhaXNlIGVycm9yXG4gICAgdXRpbC5yYWlzZUVycm9yKFwiRXhwZWN0aW5nICdvbicgb3IgJ29mZidcIik7XG5cbiAgfVxuXG4gIHJldHVybiBvdmVybGF5RWw7XG59XG5cblxuLyoqXG4gKiBUdXJuIG9uIG92ZXJsYXkuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIE92ZXJsYXkgb3B0aW9ucy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gY2hpbGRFbGVtZW50IC0gVGhlIGNoaWxkIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIG92ZXJsYXlPbihvcHRpb25zLCBjaGlsZEVsZW1lbnQpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keUVsID0gZG9jLmJvZHksXG4gICAgICBvdmVybGF5RWwgPSBkb2MuZ2V0RWxlbWVudEJ5SWQob3ZlcmxheUlkKTtcblxuICAvLyBjYWNoZSBhY3RpdmVFbGVtZW50XG4gIGlmIChkb2MuYWN0aXZlRWxlbWVudCkgYWN0aXZlRWxlbWVudCA9IGRvYy5hY3RpdmVFbGVtZW50O1xuXG4gIC8vIGFkZCBvdmVybGF5XG4gIHV0aWwuZW5hYmxlU2Nyb2xsTG9jaygpO1xuXG4gIGlmICghb3ZlcmxheUVsKSB7XG4gICAgLy8gY3JlYXRlIG92ZXJsYXlFbFxuICAgIG92ZXJsYXlFbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5RWwuc2V0QXR0cmlidXRlKCdpZCcsIG92ZXJsYXlJZCk7XG4gICAgb3ZlcmxheUVsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICBcbiAgICAvLyBhZGQgY2hpbGQgZWxlbWVudFxuICAgIGlmIChjaGlsZEVsZW1lbnQpIG92ZXJsYXlFbC5hcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQpO1xuXG4gICAgYm9keUVsLmFwcGVuZENoaWxkKG92ZXJsYXlFbCk7XG4gICAgXG4gIH0gZWxzZSB7XG4gICAgLy8gcmVtb3ZlIGV4aXN0aW5nIGNoaWxkcmVuXG4gICAgd2hpbGUgKG92ZXJsYXlFbC5maXJzdENoaWxkKSBvdmVybGF5RWwucmVtb3ZlQ2hpbGQob3ZlcmxheUVsLmZpcnN0Q2hpbGQpO1xuICAgIFxuICAgIC8vIGFkZCBjaGlsZCBlbGVtZW50XG4gICAgaWYgKGNoaWxkRWxlbWVudCkgb3ZlcmxheUVsLmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gIH1cblxuICAvLyBpT1MgYnVnZml4XG4gIGlmIChpb3NSZWdleC50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAganFMaXRlLmNzcyhvdmVybGF5RWwsICdjdXJzb3InLCAncG9pbnRlcicpO1xuICB9XG5cbiAgLy8gaGFuZGxlIG9wdGlvbnNcbiAgaWYgKG9wdGlvbnMua2V5Ym9hcmQpIGFkZEtleXVwSGFuZGxlcigpO1xuICBlbHNlIHJlbW92ZUtleXVwSGFuZGxlcigpO1xuXG4gIGlmIChvcHRpb25zLnN0YXRpYykgcmVtb3ZlQ2xpY2tIYW5kbGVyKG92ZXJsYXlFbCk7XG4gIGVsc2UgYWRkQ2xpY2tIYW5kbGVyKG92ZXJsYXlFbCk7XG5cbiAgLy8gYXR0YWNoIG9wdGlvbnNcbiAgb3ZlcmxheUVsLm11aU9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIC8vIGZvY3VzIG92ZXJsYXkgZWxlbWVudFxuICBvdmVybGF5RWwuZm9jdXMoKTtcblxuICByZXR1cm4gb3ZlcmxheUVsO1xufVxuXG5cbi8qKlxuICogVHVybiBvZmYgb3ZlcmxheS5cbiAqL1xuZnVuY3Rpb24gb3ZlcmxheU9mZigpIHtcbiAgdmFyIG92ZXJsYXlFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG92ZXJsYXlJZCksXG4gICAgICBjYWxsYmFja0ZuO1xuXG4gIGlmIChvdmVybGF5RWwpIHtcbiAgICAvLyByZW1vdmUgY2hpbGRyZW5cbiAgICB3aGlsZSAob3ZlcmxheUVsLmZpcnN0Q2hpbGQpIG92ZXJsYXlFbC5yZW1vdmVDaGlsZChvdmVybGF5RWwuZmlyc3RDaGlsZCk7XG5cbiAgICAvLyByZW1vdmUgb3ZlcmxheSBlbGVtZW50XG4gICAgb3ZlcmxheUVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob3ZlcmxheUVsKTtcblxuICAgIC8vIGNhbGxiYWNrIHJlZmVyZW5jZVxuICAgIGNhbGxiYWNrRm4gPSBvdmVybGF5RWwubXVpT3B0aW9ucy5vbmNsb3NlO1xuXG4gICAgLy8gcmVtb3ZlIGNsaWNrIGhhbmRsZXJcbiAgICByZW1vdmVDbGlja0hhbmRsZXIob3ZlcmxheUVsKTtcbiAgfVxuXG4gIHV0aWwuZGlzYWJsZVNjcm9sbExvY2soKTtcblxuICAvLyByZW1vdmUga2V5dXAgaGFuZGxlclxuICByZW1vdmVLZXl1cEhhbmRsZXIoKTtcblxuICAvLyByZXR1cm4gZm9jdXMgdG8gYWN0aXZlRWxlbWVudFxuICBpZiAoYWN0aXZlRWxlbWVudCkgYWN0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gIC8vIGV4ZWN1dGUgY2FsbGJhY2tcbiAgaWYgKGNhbGxiYWNrRm4pIGNhbGxiYWNrRm4oKTtcblxuICByZXR1cm4gb3ZlcmxheUVsO1xufVxuXG5cbi8qKlxuICogQWRkIGtleXVwIGhhbmRsZXIuXG4gKi9cbmZ1bmN0aW9uIGFkZEtleXVwSGFuZGxlcigpIHtcbiAganFMaXRlLm9uKGRvY3VtZW50LCAna2V5dXAnLCBvbktleXVwKTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSBrZXl1cCBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiByZW1vdmVLZXl1cEhhbmRsZXIoKSB7XG4gIGpxTGl0ZS5vZmYoZG9jdW1lbnQsICdrZXl1cCcsIG9uS2V5dXApO1xufVxuXG5cbi8qKlxuICogVGVhcmRvd24gb3ZlcmxheSB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAqL1xuZnVuY3Rpb24gb25LZXl1cChldikge1xuICBpZiAoZXYua2V5Q29kZSA9PT0gMjcpIG92ZXJsYXlPZmYoKTtcbn1cblxuXG4vKipcbiAqIEFkZCBjbGljayBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiBhZGRDbGlja0hhbmRsZXIob3ZlcmxheUVsKSB7XG4gIGpxTGl0ZS5vbihvdmVybGF5RWwsICdjbGljaycsIG9uQ2xpY2spO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIGNsaWNrIGhhbmRsZXIuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUNsaWNrSGFuZGxlcihvdmVybGF5RWwpIHtcbiAganFMaXRlLm9mZihvdmVybGF5RWwsICdjbGljaycsIG9uQ2xpY2spO1xufVxuXG5cbi8qKlxuICogVGVhcmRvd24gb3ZlcmxheSB3aGVuIGJhY2tkcm9wIGlzIGNsaWNrZWQuXG4gKi9cbmZ1bmN0aW9uIG9uQ2xpY2soZXYpIHtcbiAgaWYgKGV2LnRhcmdldC5pZCA9PT0gb3ZlcmxheUlkKSBvdmVybGF5T2ZmKCk7XG59XG5cblxuLyoqIERlZmluZSBtb2R1bGUgQVBJICovXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJsYXlGbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdC9hZGRvbnMnO1xuXG5jb25zdCBDcmVhdGVHYW1lRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBsaW5rOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdGltZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGluYzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG9uQ2hhbmdlRm9ybTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjcmVhdGVHYW1lOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMucHJvcHMuY3JlYXRlR2FtZX0+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICA8c3Bhbj5NaW51dGVzIHBlciBzaWRlOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIG5hbWU9XCJ0aW1lXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudGltZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25DaGFuZ2VGb3JtfVxuICAgICAgICAgICAgICBtaW49XCIxXCJcbiAgICAgICAgICAgICAgbWF4PVwiNTBcIlxuICAgICAgICAgICAgICByZXF1aXJlZCAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIHN0eWxlPXt7cGFkZGluZ0xlZnQ6ICcyZW0nfX0+XG4gICAgICAgICAgICA8c3Bhbj5JbmNyZW1lbnQgaW4gc2Vjb25kczogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBuYW1lPVwiaW5jXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuaW5jfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy5vbkNoYW5nZUZvcm19XG4gICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICBtYXg9XCI1MFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQ9XCJnYW1lLWxpbmtcIlxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5saW5rIHx8ICdHYW1lIGxpbmsgd2lsbCBiZSBnZW5lcmF0ZWQgaGVyZS4nfVxuICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gZS50YXJnZXQuc2VsZWN0KCl9XG4gICAgICAgICAgcmVhZE9ubHkgLz5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIHllbGxvd1wiPlBsYXk8L2J1dHRvbj5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ3JlYXRlR2FtZUZvcm07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQ3JlYXRlR2FtZUZvcm0gZnJvbSAnLi9DcmVhdGVHYW1lRm9ybSc7XG5pbXBvcnQgaW8gZnJvbSAnLi4vaW8nO1xuXG5cbmNvbnN0IEluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBcbiAgcHJvcFR5cGVzOiB7XG4gICAgaW86IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGluazogJycsXG4gICAgICBoYXNFeHBpcmVkOiBmYWxzZSxcbiAgICAgIHRpbWU6ICczMCcsXG4gICAgICBpbmM6ICcwJ1xuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IGlvID0gdGhpcy5wcm9wcy5pbztcblxuICAgIGlvLm9uKCdjcmVhdGVkJywgZGF0YSA9PiB7XG4gICAgICBjb25zdCB7dGltZSwgaW5jfSA9IHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCBsb2MgPSB3aW5kb3cubG9jYXRpb247XG5cbiAgICAgIGNvbnN0IG9yaWdpbiA9IGxvYy5vcmlnaW4gfHwgYCR7bG9jLnByb3RvY29sfS8vJHtsb2MuaG9zdG5hbWV9YCArXG4gICAgICAgIChsb2MucG9ydCA/ICc6JyArIGxvYy5wb3J0IDogJycpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGluazogYCR7b3JpZ2lufS9wbGF5LyR7ZGF0YS50b2tlbn0vJHt0aW1lfS8ke2luY31gLFxuICAgICAgICBoYXNFeHBpcmVkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaW8ub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5zdGF0ZS5saW5rO1xuICAgIH0pO1xuICAgIGlvLm9uKCd0b2tlbi1leHBpcmVkJywgKCkgPT4gdGhpcy5zZXRTdGF0ZSh7aGFzRXhwaXJlZDogdHJ1ZX0pKTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aW1nIHNyYz1cIi9pbWcvYmVlci5wbmdcIlxuICAgICAgICAgICAgIHdpZHRoPVwiMTIwXCJcbiAgICAgICAgICAgICBoZWlnaHQ9XCIxMjBcIlxuICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlZXJcIiAvPlxuICAgICAgICA8aDE+RHJ1bmsgQ2hlc3M8L2gxPlxuXG4gICAgICAgIDxwPlxuICAgICAgICAgIENsaWNrIHRoZSBidXR0b24gdG8gY3JlYXRlIGEgZ2FtZS4gU2VuZCB0aGUgbGluayB0byB5b3VyIGZyaWVuZC5cbiAgICAgICAgICBPbmNlIHRoZSBsaW5rIGlzIG9wZW5lZCB5b3VyIGZyaWVuZOKAmHMgYnJvd3NlciwgZ2FtZSBzaG91bGQgYmVnaW4gXG4gICAgICAgICAgc2hvcnRseS4gQ29sb3JzIGFyZSBwaWNrZWQgcmFuZG9tbHkgYnkgY29tcHV0ZXIuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBpZD1cImNyZWF0ZS1nYW1lXCI+XG4gICAgICAgICAgPENyZWF0ZUdhbWVGb3JtXG4gICAgICAgICAgICBsaW5rPXt0aGlzLnN0YXRlLmxpbmt9XG4gICAgICAgICAgICB0aW1lPXt0aGlzLnN0YXRlLnRpbWV9XG4gICAgICAgICAgICBpbmM9e3RoaXMuc3RhdGUuaW5jfVxuICAgICAgICAgICAgb25DaGFuZ2VGb3JtPXt0aGlzLl9vbkNoYW5nZUZvcm19XG4gICAgICAgICAgICBjcmVhdGVHYW1lPXt0aGlzLl9jcmVhdGVHYW1lfSAvPlxuICAgICAgICAgICAgXG4gICAgICAgICAgPHAgaWQ9XCJnYW1lLXN0YXR1c1wiPlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaGFzRXhwaXJlZCA/XG4gICAgICAgICAgICAgICdHYW1lIGxpbmsgaGFzIGV4cGlyZWQsIGdlbmVyYXRlIGEgbmV3IG9uZSdcbiAgICAgICAgICAgIDp0aGlzLnN0YXRlLmxpbmsgP1xuICAgICAgICAgICAgICAnV2FpdGluZyBmb3Igb3Bwb25lbnQgdG8gY29ubmVjdCdcbiAgICAgICAgICAgIDpudWxsfVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwPlxuICAgICAgICAgIDxhIGhyZWY9XCIvYWJvdXRcIiBjbGFzc05hbWU9XCJhbHBoYVwiPlJlYWQgbW9yZSBhYm91dCBEcnVuayBDaGVzczwvYT5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBfb25DaGFuZ2VGb3JtKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtbZS50YXJnZXQubmFtZV06IGUudGFyZ2V0LnZhbHVlfSk7XG4gIH0sXG4gIF9jcmVhdGVHYW1lKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCB7dGltZSwgaW5jfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgaXNJbnZhbGlkID0gW3RpbWUsIGluY10uc29tZSh2YWwgPT4ge1xuICAgICAgdmFsID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICByZXR1cm4gaXNOYU4odmFsKSB8fCB2YWwgPCAwIHx8IHZhbCA+IDUwO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzSW52YWxpZCkge1xuICAgICAgLy8gZmFsbGJhY2sgZm9yIG9sZCBicm93c2Vyc1xuICAgICAgcmV0dXJuIHdpbmRvdy5hbGVydCgnRm9ybSBpcyBpbnZhbGlkLiBFbnRlciBudW1iZXJzIGJldHdlZW4gMCBhbmQgNTAuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMuaW8uZW1pdCgnc3RhcnQnKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBpbyBmcm9tICcuL2lvJztcbmltcG9ydCBJbmRleCBmcm9tICcuL2NvbXBvbmVudHMvSW5kZXgnO1xuaW1wb3J0ICdtdWljc3MnO1xuXG5cblJlYWN0LnJlbmRlcihcbiAgPEluZGV4IGlvPXtpb30gLz4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKVxuKTtcbiIsImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuXG5jb25zdCBIT1NUID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCc7XG5cbmV4cG9ydCBkZWZhdWx0IGlvLmNvbm5lY3QoSE9TVCk7XG4iXX0=
