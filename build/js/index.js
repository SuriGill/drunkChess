(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/index.js":[function(require,module,exports){
/**
 * MUI NPM package
 * @module pkg/index.js
 */

/** Define module API */
module.exports = {
  overlay: require('./lib/js/overlay')
}

},{"./lib/js/overlay":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/overlay.js"}],"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/config.js":[function(require,module,exports){
/**
 * MUI config module
 * @module config
 */

/** Define module API */
module.exports = {
  /** Use debug mode */
  debug: true
};

},{}],"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/lib/jqLite.js":[function(require,module,exports){
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

},{}],"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/lib/util.js":[function(require,module,exports){
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

},{"../config":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/config.js","./jqLite":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/lib/jqLite.js"}],"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/overlay.js":[function(require,module,exports){
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

},{"./lib/jqLite":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/lib/jqLite.js","./lib/util":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/lib/js/lib/util.js"}],"/Users/GlenCoco/Desktop/reti-chess-master/src/js/components/CreateGameForm.js":[function(require,module,exports){
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

},{"react/addons":"react/addons"}],"/Users/GlenCoco/Desktop/reti-chess-master/src/js/components/Index.js":[function(require,module,exports){
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

},{"../io":"/Users/GlenCoco/Desktop/reti-chess-master/src/js/io.js","./CreateGameForm":"/Users/GlenCoco/Desktop/reti-chess-master/src/js/components/CreateGameForm.js","react":"react"}],"/Users/GlenCoco/Desktop/reti-chess-master/src/js/index.js":[function(require,module,exports){
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

},{"./components/Index":"/Users/GlenCoco/Desktop/reti-chess-master/src/js/components/Index.js","./io":"/Users/GlenCoco/Desktop/reti-chess-master/src/js/io.js","muicss":"/Users/GlenCoco/Desktop/reti-chess-master/node_modules/muicss/index.js","react":"react"}],"/Users/GlenCoco/Desktop/reti-chess-master/src/js/io.js":[function(require,module,exports){
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

},{"socket.io-client":"socket.io-client"}]},{},["/Users/GlenCoco/Desktop/reti-chess-master/src/js/index.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbXVpY3NzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvbGliL2pxTGl0ZS5qcyIsIm5vZGVfbW9kdWxlcy9tdWljc3MvbGliL2pzL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL211aWNzcy9saWIvanMvb3ZlcmxheS5qcyIsIi9Vc2Vycy9HbGVuQ29jby9EZXNrdG9wL3JldGktY2hlc3MtbWFzdGVyL3NyYy9qcy9jb21wb25lbnRzL0NyZWF0ZUdhbWVGb3JtLmpzIiwiL1VzZXJzL0dsZW5Db2NvL0Rlc2t0b3AvcmV0aS1jaGVzcy1tYXN0ZXIvc3JjL2pzL2NvbXBvbmVudHMvSW5kZXguanMiLCIvVXNlcnMvR2xlbkNvY28vRGVza3RvcC9yZXRpLWNoZXNzLW1hc3Rlci9zcmMvanMvaW5kZXguanMiLCIvVXNlcnMvR2xlbkNvY28vRGVza3RvcC9yZXRpLWNoZXNzLW1hc3Rlci9zcmMvanMvaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUMsY0FBYyxFQUFFLENBQUM7O2tCQUVDLElBQUksQ0FBQyxLQUFLO1FBQXZCLElBQUksV0FBSixJQUFJO1FBQUUsR0FBRyxXQUFILEdBQUc7O0FBQ2hCLFFBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUN4QyxTQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QixhQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7S0FDMUMsQ0FBQyxDQUFDOztBQUVILFFBQUksU0FBUyxFQUFFOztBQUViLGFBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0tBQ3pFLE1BQU07QUFDTCxVQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDN0I7R0FDRjtDQUNGLENBQUMsQ0FBQzs7cUJBRVksS0FBSzs7Ozs7Ozs7cUJDbEdGLE9BQU87Ozs7a0JBRVYsTUFBTTs7OzsrQkFDSCxvQkFBb0I7Ozs7UUFDL0IsUUFBUTs7QUFHZixtQkFBTSxNQUFNLENBQ1YsaUVBQU8sRUFBRSxpQkFBSyxHQUFHLEVBQ2pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQ3JDLENBQUM7Ozs7Ozs7Ozs7OzhCQ1ZhLGtCQUFrQjs7OztBQUdqQyxJQUFNLElBQUksR0FBRyx1QkFBdUIsQ0FBQzs7cUJBRXRCLDRCQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBNVUkgTlBNIHBhY2thZ2VcbiAqIEBtb2R1bGUgcGtnL2luZGV4LmpzXG4gKi9cblxuLyoqIERlZmluZSBtb2R1bGUgQVBJICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3ZlcmxheTogcmVxdWlyZSgnLi9saWIvanMvb3ZlcmxheScpXG59XG4iLCIvKipcbiAqIE1VSSBjb25maWcgbW9kdWxlXG4gKiBAbW9kdWxlIGNvbmZpZ1xuICovXG5cbi8qKiBEZWZpbmUgbW9kdWxlIEFQSSAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKiBVc2UgZGVidWcgbW9kZSAqL1xuICBkZWJ1ZzogdHJ1ZVxufTtcbiIsIi8qKlxuICogTVVJIENTUy9KUyBqcUxpdGUgbW9kdWxlXG4gKiBAbW9kdWxlIGxpYi9qcUxpdGVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGNzc0NsYXNzZXMgLSBTcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lcy5cbiAqL1xuZnVuY3Rpb24ganFMaXRlQWRkQ2xhc3MoZWxlbWVudCwgY3NzQ2xhc3Nlcykge1xuICBpZiAoIWNzc0NsYXNzZXMgfHwgIWVsZW1lbnQuc2V0QXR0cmlidXRlKSByZXR1cm47XG5cbiAgdmFyIGV4aXN0aW5nQ2xhc3NlcyA9IF9nZXRFeGlzdGluZ0NsYXNzZXMoZWxlbWVudCksXG4gICAgICBzcGxpdENsYXNzZXMgPSBjc3NDbGFzc2VzLnNwbGl0KCcgJyksXG4gICAgICBjc3NDbGFzcztcblxuICBmb3IgKHZhciBpPTA7IGkgPCBzcGxpdENsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjc3NDbGFzcyA9IHNwbGl0Q2xhc3Nlc1tpXS50cmltKCk7XG4gICAgaWYgKGV4aXN0aW5nQ2xhc3Nlcy5pbmRleE9mKCcgJyArIGNzc0NsYXNzICsgJyAnKSA9PT0gLTEpIHtcbiAgICAgIGV4aXN0aW5nQ2xhc3NlcyArPSBjc3NDbGFzcyArICcgJztcbiAgICB9XG4gIH1cbiAgXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGV4aXN0aW5nQ2xhc3Nlcy50cmltKCkpO1xufVxuXG5cbi8qKlxuICogR2V0IG9yIHNldCBDU1MgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV0gLSBUaGUgcHJvcGVydHkgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gVGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBqcUxpdGVDc3MoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgLy8gUmV0dXJuIGZ1bGwgc3R5bGUgb2JqZWN0XG4gIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgfVxuXG4gIHZhciBuYW1lVHlwZSA9IGpxTGl0ZVR5cGUobmFtZSk7XG5cbiAgLy8gU2V0IG11bHRpcGxlIHZhbHVlc1xuICBpZiAobmFtZVR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG5hbWUpIGVsZW1lbnQuc3R5bGVbX2NhbWVsQ2FzZShrZXkpXSA9IG5hbWVba2V5XTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTZXQgYSBzaW5nbGUgdmFsdWVcbiAgaWYgKG5hbWVUeXBlID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZWxlbWVudC5zdHlsZVtfY2FtZWxDYXNlKG5hbWUpXSA9IHZhbHVlO1xuICB9XG5cbiAgdmFyIHN0eWxlT2JqID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgIGlzQXJyYXkgPSAoanFMaXRlVHlwZShuYW1lKSA9PT0gJ2FycmF5Jyk7XG5cbiAgLy8gUmVhZCBzaW5nbGUgdmFsdWVcbiAgaWYgKCFpc0FycmF5KSByZXR1cm4gX2dldEN1cnJDc3NQcm9wKGVsZW1lbnQsIG5hbWUsIHN0eWxlT2JqKTtcblxuICAvLyBSZWFkIG11bHRpcGxlIHZhbHVlc1xuICB2YXIgb3V0T2JqID0ge30sXG4gICAgICBrZXk7XG5cbiAgZm9yICh2YXIgaT0wOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IG5hbWVbaV07XG4gICAgb3V0T2JqW2tleV0gPSBfZ2V0Q3VyckNzc1Byb3AoZWxlbWVudCwga2V5LCBzdHlsZU9iaik7XG4gIH1cblxuICByZXR1cm4gb3V0T2JqO1xufVxuXG5cbi8qKlxuICogQ2hlY2sgaWYgZWxlbWVudCBoYXMgY2xhc3MuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xzIC0gVGhlIGNsYXNzIG5hbWUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBqcUxpdGVIYXNDbGFzcyhlbGVtZW50LCBjbHMpIHtcbiAgaWYgKCFjbHMgfHwgIWVsZW1lbnQuZ2V0QXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAoX2dldEV4aXN0aW5nQ2xhc3NlcyhlbGVtZW50KS5pbmRleE9mKCcgJyArIGNscyArICcgJykgPiAtMSk7XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHR5cGUgb2YgYSB2YXJpYWJsZS5cbiAqIEBwYXJhbSB7fSBzb21ldmFyIC0gVGhlIEphdmFTY3JpcHQgdmFyaWFibGUuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZVR5cGUoc29tZXZhcikge1xuICAvLyBoYW5kbGUgdW5kZWZpbmVkXG4gIGlmIChzb21ldmFyID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcblxuICAvLyBoYW5kbGUgb3RoZXJzIChvZiB0eXBlIFtvYmplY3QgPFR5cGU+XSlcbiAgdmFyIHR5cGVTdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc29tZXZhcik7XG4gIGlmICh0eXBlU3RyLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICByZXR1cm4gdHlwZVN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNVUk6IENvdWxkIG5vdCB1bmRlcnN0YW5kIHR5cGU6IFwiICsgdHlwZVN0cik7XG4gIH0gICAgXG59XG5cblxuLyoqXG4gKiBBdHRhY2ggYW4gZXZlbnQgaGFuZGxlciB0byBhIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRzIC0gU3BhY2Ugc2VwYXJhdGVkIGV2ZW50IG5hbWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmUgLSBVc2UgY2FwdHVyZSBmbGFnLlxuICovXG5mdW5jdGlvbiBqcUxpdGVPbihlbGVtZW50LCBldmVudHMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gIHVzZUNhcHR1cmUgPSAodXNlQ2FwdHVyZSA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogdXNlQ2FwdHVyZTtcblxuICB2YXIgY2FjaGUgPSBlbGVtZW50Ll9tdWlFdmVudENhY2hlID0gZWxlbWVudC5fbXVpRXZlbnRDYWNoZSB8fCB7fTsgIFxuXG4gIGV2ZW50cy5zcGxpdCgnICcpLm1hcChmdW5jdGlvbihldmVudCkge1xuICAgIC8vIGFkZCB0byBET01cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKTtcblxuICAgIC8vIGFkZCB0byBjYWNoZVxuICAgIGNhY2hlW2V2ZW50XSA9IGNhY2hlW2V2ZW50XSB8fCBbXTtcbiAgICBjYWNoZVtldmVudF0ucHVzaChbY2FsbGJhY2ssIHVzZUNhcHR1cmVdKTtcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlciBmcm9tIGEgRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudHMgLSBTcGFjZSBzZXBhcmF0ZWQgZXZlbnQgbmFtZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZSAtIFVzZSBjYXB0dXJlIGZsYWcuXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZU9mZihlbGVtZW50LCBldmVudHMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gIHVzZUNhcHR1cmUgPSAodXNlQ2FwdHVyZSA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogdXNlQ2FwdHVyZTtcblxuICAvLyByZW1vdmUgZnJvbSBjYWNoZVxuICB2YXIgY2FjaGUgPSBlbGVtZW50Ll9tdWlFdmVudENhY2hlID0gZWxlbWVudC5fbXVpRXZlbnRDYWNoZSB8fCB7fSxcbiAgICAgIGFyZ3NMaXN0LFxuICAgICAgYXJncyxcbiAgICAgIGk7XG5cbiAgZXZlbnRzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgYXJnc0xpc3QgPSBjYWNoZVtldmVudF0gfHwgW107XG5cbiAgICBpID0gYXJnc0xpc3QubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3MgPSBhcmdzTGlzdFtpXTtcblxuICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgaWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkXG4gICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgIChhcmdzWzBdID09PSBjYWxsYmFjayAmJiBhcmdzWzFdID09PSB1c2VDYXB0dXJlKSkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIGNhY2hlXG4gICAgICAgIGFyZ3NMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIERPTVxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4gKiBBdHRhY2ggYW4gZXZlbnQgaGFuZGVyIHdoaWNoIHdpbGwgb25seSBleGVjdXRlIG9uY2UgcGVyIGVsZW1lbnQgcGVyIGV2ZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRzIC0gU3BhY2Ugc2VwYXJhdGVkIGV2ZW50IG5hbWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmUgLSBVc2UgY2FwdHVyZSBmbGFnLlxuICovXG5mdW5jdGlvbiBqcUxpdGVPbmUoZWxlbWVudCwgZXZlbnRzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICBldmVudHMuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBqcUxpdGVPbihlbGVtZW50LCBldmVudCwgZnVuY3Rpb24gb25Gbihldikge1xuICAgICAgLy8gZXhlY3V0ZSBjYWxsYmFja1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAvLyByZW1vdmUgd3JhcHBlclxuICAgICAganFMaXRlT2ZmKGVsZW1lbnQsIGV2ZW50LCBvbkZuLCB1c2VDYXB0dXJlKTtcbiAgICB9LCB1c2VDYXB0dXJlKTtcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBHZXQgb3Igc2V0IGhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdmFsdWVdIC0gVGhlIHNjcm9sbCBwb3NpdGlvblxuICovXG5mdW5jdGlvbiBqcUxpdGVTY3JvbGxMZWZ0KGVsZW1lbnQsIHZhbHVlKSB7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgLy8gZ2V0XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKGVsZW1lbnQgPT09IHdpbikge1xuICAgICAgdmFyIGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgcmV0dXJuICh3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdCkgLSAoZG9jRWwuY2xpZW50TGVmdCB8fCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICB9XG4gIH1cblxuICAvLyBzZXRcbiAgaWYgKGVsZW1lbnQgPT09IHdpbikgd2luLnNjcm9sbFRvKHZhbHVlLCBqcUxpdGVTY3JvbGxUb3Aod2luKSk7XG4gIGVsc2UgZWxlbWVudC5zY3JvbGxMZWZ0ID0gdmFsdWU7XG59XG5cblxuLyoqXG4gKiBHZXQgb3Igc2V0IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgc2Nyb2xsIHBvc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGpxTGl0ZVNjcm9sbFRvcChlbGVtZW50LCB2YWx1ZSkge1xuICB2YXIgd2luID0gd2luZG93O1xuXG4gIC8vIGdldFxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChlbGVtZW50ID09PSB3aW4pIHtcbiAgICAgIHZhciBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgIHJldHVybiAod2luLnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcCkgLSAoZG9jRWwuY2xpZW50VG9wIHx8IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0XG4gIGlmIChlbGVtZW50ID09PSB3aW4pIHdpbi5zY3JvbGxUbyhqcUxpdGVTY3JvbGxMZWZ0KHdpbiksIHZhbHVlKTtcbiAgZWxzZSBlbGVtZW50LnNjcm9sbFRvcCA9IHZhbHVlO1xufVxuXG5cbi8qKlxuICogUmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgdG9wL2xlZnQgb2Zmc2V0IGFuZCBlbGVtZW50IGhlaWdodC93aWR0aC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24ganFMaXRlT2Zmc2V0KGVsZW1lbnQpIHtcbiAgdmFyIHdpbiA9IHdpbmRvdyxcbiAgICAgIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgc2Nyb2xsVG9wID0ganFMaXRlU2Nyb2xsVG9wKHdpbiksXG4gICAgICBzY3JvbGxMZWZ0ID0ganFMaXRlU2Nyb2xsTGVmdCh3aW4pO1xuXG4gIHJldHVybiB7XG4gICAgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCxcbiAgICBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0LFxuICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgfTtcbn1cblxuXG4vKipcbiAqIEF0dGFjaCBhIGNhbGxiYWNrIHRvIHRoZSBET00gcmVhZHkgZXZlbnQgbGlzdGVuZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBqcUxpdGVSZWFkeShmbikge1xuICB2YXIgZG9uZSA9IGZhbHNlLFxuICAgICAgdG9wID0gdHJ1ZSxcbiAgICAgIGRvYyA9IGRvY3VtZW50LFxuICAgICAgd2luID0gZG9jLmRlZmF1bHRWaWV3LFxuICAgICAgcm9vdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBhZGQgPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCcsXG4gICAgICByZW0gPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/ICdyZW1vdmVFdmVudExpc3RlbmVyJyA6ICdkZXRhY2hFdmVudCcsXG4gICAgICBwcmUgPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/ICcnIDogJ29uJztcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS50eXBlID09ICdyZWFkeXN0YXRlY2hhbmdlJyAmJiBkb2MucmVhZHlTdGF0ZSAhPSAnY29tcGxldGUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKGUudHlwZSA9PSAnbG9hZCcgPyB3aW4gOiBkb2MpW3JlbV0ocHJlICsgZS50eXBlLCBpbml0LCBmYWxzZSk7XG4gICAgaWYgKCFkb25lICYmIChkb25lID0gdHJ1ZSkpIGZuLmNhbGwod2luLCBlLnR5cGUgfHwgZSk7XG4gIH07XG5cbiAgdmFyIHBvbGwgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkgeyByb290LmRvU2Nyb2xsKCdsZWZ0Jyk7IH0gY2F0Y2goZSkgeyBzZXRUaW1lb3V0KHBvbGwsIDUwKTsgcmV0dXJuOyB9XG4gICAgaW5pdCgncG9sbCcpO1xuICB9O1xuXG4gIGlmIChkb2MucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSB7XG4gICAgZm4uY2FsbCh3aW4sICdsYXp5Jyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCAmJiByb290LmRvU2Nyb2xsKSB7XG4gICAgICB0cnkgeyB0b3AgPSAhd2luLmZyYW1lRWxlbWVudDsgfSBjYXRjaChlKSB7IH1cbiAgICAgIGlmICh0b3ApIHBvbGwoKTtcbiAgICB9XG4gICAgZG9jW2FkZF0ocHJlICsgJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0LCBmYWxzZSk7XG4gICAgZG9jW2FkZF0ocHJlICsgJ3JlYWR5c3RhdGVjaGFuZ2UnLCBpbml0LCBmYWxzZSk7XG4gICAgd2luW2FkZF0ocHJlICsgJ2xvYWQnLCBpbml0LCBmYWxzZSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFJlbW92ZSBjbGFzc2VzIGZyb20gYSBET00gZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gVGhlIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGNzc0NsYXNzZXMgLSBTcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lcy5cbiAqL1xuZnVuY3Rpb24ganFMaXRlUmVtb3ZlQ2xhc3MoZWxlbWVudCwgY3NzQ2xhc3Nlcykge1xuICBpZiAoIWNzc0NsYXNzZXMgfHwgIWVsZW1lbnQuc2V0QXR0cmlidXRlKSByZXR1cm47XG5cbiAgdmFyIGV4aXN0aW5nQ2xhc3NlcyA9IF9nZXRFeGlzdGluZ0NsYXNzZXMoZWxlbWVudCksXG4gICAgICBzcGxpdENsYXNzZXMgPSBjc3NDbGFzc2VzLnNwbGl0KCcgJyksXG4gICAgICBjc3NDbGFzcztcbiAgXG4gIGZvciAodmFyIGk9MDsgaSA8IHNwbGl0Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGNzc0NsYXNzID0gc3BsaXRDbGFzc2VzW2ldLnRyaW0oKTtcbiAgICB3aGlsZSAoZXhpc3RpbmdDbGFzc2VzLmluZGV4T2YoJyAnICsgY3NzQ2xhc3MgKyAnICcpID49IDApIHtcbiAgICAgIGV4aXN0aW5nQ2xhc3NlcyA9IGV4aXN0aW5nQ2xhc3Nlcy5yZXBsYWNlKCcgJyArIGNzc0NsYXNzICsgJyAnLCAnICcpO1xuICAgIH1cbiAgfVxuXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGV4aXN0aW5nQ2xhc3Nlcy50cmltKCkpO1xufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBTUEVDSUFMX0NIQVJTX1JFR0VYUCA9IC8oW1xcOlxcLVxcX10rKC4pKS9nLFxuICAgIE1PWl9IQUNLX1JFR0VYUCA9IC9ebW96KFtBLVpdKS8sXG4gICAgRVNDQVBFX1JFR0VYUCA9IC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2c7XG5cblxuZnVuY3Rpb24gX2dldEV4aXN0aW5nQ2xhc3NlcyhlbGVtZW50KSB7XG4gIHZhciBjbGFzc2VzID0gKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKS5yZXBsYWNlKC9bXFxuXFx0XS9nLCAnJyk7XG4gIHJldHVybiAnICcgKyBjbGFzc2VzICsgJyAnO1xufVxuXG5cbmZ1bmN0aW9uIF9jYW1lbENhc2UobmFtZSkge1xuICByZXR1cm4gbmFtZS5cbiAgICByZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbihfLCBzZXBhcmF0b3IsIGxldHRlciwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSkuXG4gICAgcmVwbGFjZShNT1pfSEFDS19SRUdFWFAsICdNb3okMScpO1xufVxuXG5cbmZ1bmN0aW9uIF9lc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShFU0NBUEVfUkVHRVhQLCBcIlxcXFwkMVwiKTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0Q3VyckNzc1Byb3AoZWxlbSwgbmFtZSwgY29tcHV0ZWQpIHtcbiAgdmFyIHJldDtcblxuICAvLyB0cnkgY29tcHV0ZWQgc3R5bGVcbiAgcmV0ID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcblxuICAvLyB0cnkgc3R5bGUgYXR0cmlidXRlIChpZiBlbGVtZW50IGlzIG5vdCBhdHRhY2hlZCB0byBkb2N1bWVudClcbiAgaWYgKHJldCA9PT0gJycgJiYgIWVsZW0ub3duZXJEb2N1bWVudCkgcmV0ID0gZWxlbS5zdHlsZVtfY2FtZWxDYXNlKG5hbWUpXTtcblxuICByZXR1cm4gcmV0O1xufVxuXG5cbi8qKlxuICogTW9kdWxlIEFQSVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqIEFkZCBjbGFzc2VzICovXG4gIGFkZENsYXNzOiBqcUxpdGVBZGRDbGFzcyxcblxuICAvKiogR2V0IG9yIHNldCBDU1MgcHJvcGVydGllcyAqL1xuICBjc3M6IGpxTGl0ZUNzcyxcblxuICAvKiogQ2hlY2sgZm9yIGNsYXNzICovXG4gIGhhc0NsYXNzOiBqcUxpdGVIYXNDbGFzcyxcblxuICAvKiogUmVtb3ZlIGV2ZW50IGhhbmRsZXJzICovXG4gIG9mZjoganFMaXRlT2ZmLFxuXG4gIC8qKiBSZXR1cm4gb2Zmc2V0IHZhbHVlcyAqL1xuICBvZmZzZXQ6IGpxTGl0ZU9mZnNldCxcblxuICAvKiogQWRkIGV2ZW50IGhhbmRsZXJzICovXG4gIG9uOiBqcUxpdGVPbixcblxuICAvKiogQWRkIGFuIGV4ZWN1dGUtb25jZSBldmVudCBoYW5kbGVyICovXG4gIG9uZToganFMaXRlT25lLFxuXG4gIC8qKiBET00gcmVhZHkgZXZlbnQgaGFuZGxlciAqL1xuICByZWFkeToganFMaXRlUmVhZHksXG5cbiAgLyoqIFJlbW92ZSBjbGFzc2VzICovXG4gIHJlbW92ZUNsYXNzOiBqcUxpdGVSZW1vdmVDbGFzcyxcblxuICAvKiogQ2hlY2sgSmF2YVNjcmlwdCB2YXJpYWJsZSBpbnN0YW5jZSB0eXBlICovXG4gIHR5cGU6IGpxTGl0ZVR5cGUsXG5cbiAgLyoqIEdldCBvciBzZXQgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gKi9cbiAgc2Nyb2xsTGVmdDoganFMaXRlU2Nyb2xsTGVmdCxcblxuICAvKiogR2V0IG9yIHNldCB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gKi9cbiAgc2Nyb2xsVG9wOiBqcUxpdGVTY3JvbGxUb3Bcbn07XG4iLCIvKipcbiAqIE1VSSBDU1MvSlMgdXRpbGl0aWVzIG1vZHVsZVxuICogQG1vZHVsZSBsaWIvdXRpbFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyksXG4gICAganFMaXRlID0gcmVxdWlyZSgnLi9qcUxpdGUnKSxcbiAgICBzY3JvbGxMb2NrID0gMCxcbiAgICBzY3JvbGxMb2NrQ2xzID0gJ211aS1zY3JvbGwtbG9jaycsXG4gICAgc2Nyb2xsU3R5bGVFbCxcbiAgICBzY3JvbGxFdmVudEhhbmRsZXIsXG4gICAgX3N1cHBvcnRzUG9pbnRlckV2ZW50cztcblxuXG5zY3JvbGxFdmVudEhhbmRsZXIgPSBmdW5jdGlvbihldikge1xuICAvLyBzdG9wIHByb3BhZ2F0aW9uIG9uIHdpbmRvdyBzY3JvbGwgZXZlbnRzXG4gIGlmICghZXYudGFyZ2V0LnRhZ05hbWUpIGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuXG5cbi8qKlxuICogTG9nZ2luZyBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBsb2dGbigpIHtcbiAgdmFyIHdpbiA9IHdpbmRvdztcbiAgXG4gIGlmIChjb25maWcuZGVidWcgJiYgdHlwZW9mIHdpbi5jb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHdpbi5jb25zb2xlLmxvZy5hcHBseSh3aW4uY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICB9IGNhdGNoIChhKSB7XG4gICAgICB2YXIgZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB3aW4uY29uc29sZS5sb2coZS5qb2luKFwiXFxuXCIpKTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIExvYWQgQ1NTIHRleHQgaW4gbmV3IHN0eWxlc2hlZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBjc3NUZXh0IC0gVGhlIGNzcyB0ZXh0LlxuICovXG5mdW5jdGlvbiBsb2FkU3R5bGVGbihjc3NUZXh0KSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGhlYWQ7XG4gIFxuICAvLyBjb3BpZWQgZnJvbSBqUXVlcnkgXG4gIGhlYWQgPSBkb2MuaGVhZCB8fFxuICAgIGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdIHx8XG4gICAgZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgXG4gIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIFxuICBpZiAoZS5zdHlsZVNoZWV0KSBlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gIGVsc2UgZS5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICBcbiAgLy8gYWRkIHRvIGRvY3VtZW50XG4gIGhlYWQuaW5zZXJ0QmVmb3JlKGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gIFxuICByZXR1cm4gZTtcbn1cblxuXG4vKipcbiAqIFJhaXNlIGFuIGVycm9yXG4gKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gVGhlIGVycm9yIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIHJhaXNlRXJyb3JGbihtc2csIHVzZUNvbnNvbGUpIHtcbiAgaWYgKHVzZUNvbnNvbGUpIHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSBjb25zb2xlLmVycm9yKCdNVUkgV2FybmluZzogJyArIG1zZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNVUk6ICcgKyBtc2cpO1xuICB9XG59XG5cblxuLyoqXG4gKiBDb252ZXJ0IENsYXNzbmFtZSBvYmplY3QsIHdpdGggY2xhc3MgYXMga2V5IGFuZCB0cnVlL2ZhbHNlIGFzIHZhbHVlLCB0byBhblxuICogY2xhc3Mgc3RyaW5nLlxuICogQHBhcmFtICB7T2JqZWN0fSBjbGFzc2VzIFRoZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgY2xhc3Mgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGNsYXNzTmFtZXNGbihjbGFzc2VzKSB7XG4gIHZhciBjcyA9ICcnO1xuICBmb3IgKHZhciBpIGluIGNsYXNzZXMpIHtcbiAgICBjcyArPSAoY2xhc3Nlc1tpXSkgPyBpICsgJyAnIDogJyc7XG4gIH1cbiAgcmV0dXJuIGNzLnRyaW0oKTtcbn1cblxuXG4vKipcbiAqIENoZWNrIGlmIGNsaWVudCBzdXBwb3J0cyBwb2ludGVyIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gc3VwcG9ydHNQb2ludGVyRXZlbnRzRm4oKSB7XG4gIC8vIGNoZWNrIGNhY2hlXG4gIGlmIChfc3VwcG9ydHNQb2ludGVyRXZlbnRzICE9PSB1bmRlZmluZWQpIHJldHVybiBfc3VwcG9ydHNQb2ludGVyRXZlbnRzO1xuICBcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4Jyk7XG4gIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdwb2ludGVyLWV2ZW50czphdXRvJztcbiAgX3N1cHBvcnRzUG9pbnRlckV2ZW50cyA9IChlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPT09ICdhdXRvJyk7XG4gIHJldHVybiBfc3VwcG9ydHNQb2ludGVyRXZlbnRzO1xufVxuXG5cbi8qKlxuICogQ3JlYXRlIGNhbGxiYWNrIGNsb3N1cmUuXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2UgLSBUaGUgb2JqZWN0IGluc3RhbmNlLlxuICogQHBhcmFtIHtTdHJpbmd9IGZ1bmNOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYWxsYmFja0ZuKGluc3RhbmNlLCBmdW5jTmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7aW5zdGFuY2VbZnVuY05hbWVdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO307XG59XG5cblxuLyoqXG4gKiBEaXNwYXRjaCBldmVudC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIFRoZSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGUgLSBUaGUgZXZlbnQgdHlwZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYnViYmxlcz10cnVlIC0gSWYgdHJ1ZSwgZXZlbnQgYnViYmxlcy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FuY2VsYWJsZT10cnVlID0gSWYgdHJ1ZSwgZXZlbnQgaXMgY2FuY2VsYWJsZVxuICogQHBhcmFtIHtPYmplY3R9IFtkYXRhXSAtIERhdGEgdG8gYWRkIHRvIGV2ZW50IG9iamVjdFxuICovXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50Rm4oZWxlbWVudCwgZXZlbnRUeXBlLCBidWJibGVzLCBjYW5jZWxhYmxlLCBkYXRhKSB7XG4gIHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyksXG4gICAgICBidWJibGVzID0gKGJ1YmJsZXMgIT09IHVuZGVmaW5lZCkgPyBidWJibGVzIDogdHJ1ZSxcbiAgICAgICBjYW5jZWxhYmxlID0gKGNhbmNlbGFibGUgIT09IHVuZGVmaW5lZCkgPyBjYW5jZWxhYmxlIDogdHJ1ZSxcbiAgICAgICBrO1xuXG4gIGV2LmluaXRFdmVudChldmVudFR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUpO1xuICBcbiAgLy8gYWRkIGRhdGEgdG8gZXZlbnQgb2JqZWN0XG4gIGlmIChkYXRhKSBmb3IgKGsgaW4gZGF0YSkgZXZba10gPSBkYXRhW2tdO1xuICBcbiAgLy8gZGlzcGF0Y2hcbiAgaWYgKGVsZW1lbnQpIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG4gIFxuICByZXR1cm4gZXY7XG59XG5cblxuLyoqXG4gKiBUdXJuIG9uIHdpbmRvdyBzY3JvbGwgbG9jay5cbiAqL1xuZnVuY3Rpb24gZW5hYmxlU2Nyb2xsTG9ja0ZuKCkge1xuICAvLyBpbmNyZW1lbnQgY291bnRlclxuICBzY3JvbGxMb2NrICs9IDE7XG4gIFxuICAvLyBhZGQgbG9ja1xuICBpZiAoc2Nyb2xsTG9jayA9PT0gMSkge1xuICAgIHZhciBodG1sRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIHRvcCA9IGpxTGl0ZS5zY3JvbGxUb3Aod2luZG93KSxcbiAgICAgICAgbGVmdCA9IGpxTGl0ZS5zY3JvbGxMZWZ0KHdpbmRvdyksXG4gICAgICAgIGNzc1Byb3BzLFxuICAgICAgICBjc3NTdHI7XG5cbiAgICAvLyBkZWZpbmUgc2Nyb2xsIGxvY2sgY2xhc3MgZHluYW1pY2FsbHlcbiAgICBjc3NQcm9wcyA9IFtcbiAgICAgICdwb3NpdGlvbjpmaXhlZCcsXG4gICAgICAndG9wOicgKyAtdG9wICsgJ3B4JyxcbiAgICAgICdyaWdodDowJyxcbiAgICAgICdib3R0b206MCcsXG4gICAgICAnbGVmdDonICsgLWxlZnQgKyAncHgnXG4gICAgXTtcblxuICAgIC8vIHNjcm9sbGJhci15XG4gICAgaWYgKGh0bWxFbC5zY3JvbGxIZWlnaHQgPiBodG1sRWwuY2xpZW50SGVpZ2h0KSB7XG4gICAgICBjc3NQcm9wcy5wdXNoKCdvdmVyZmxvdy15OnNjcm9sbCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBzY3JvbGxiYXIteFxuICAgIGlmIChodG1sRWwuc2Nyb2xsV2lkdGggPiBodG1sRWwuY2xpZW50V2lkdGgpIHtcbiAgICAgIGNzc1Byb3BzLnB1c2goJ292ZXJmbG93LXg6c2Nyb2xsJyk7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGNzcyBjbGFzcyBkeW5hbWljYWxseVxuICAgIGNzc1N0ciA9ICcuJyArIHNjcm9sbExvY2tDbHMgKyAneyc7XG4gICAgY3NzU3RyICs9IGNzc1Byb3BzLmpvaW4oJyAhaW1wb3J0YW50OycpICsgJyAhaW1wb3J0YW50O30nO1xuICAgIHNjcm9sbFN0eWxlRWwgPSBsb2FkU3R5bGVGbihjc3NTdHIpO1xuXG4gICAgLy8gY2FuY2VsICdzY3JvbGwnIGV2ZW50IGxpc3RlbmVyIGNhbGxiYWNrc1xuICAgIGpxTGl0ZS5vbih3aW5kb3csICdzY3JvbGwnLCBzY3JvbGxFdmVudEhhbmRsZXIsIHRydWUpO1xuXG4gICAgLy8gYWRkIHNjcm9sbCBsb2NrXG4gICAganFMaXRlLmFkZENsYXNzKGh0bWxFbCwgc2Nyb2xsTG9ja0Nscyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFR1cm4gb2ZmIHdpbmRvdyBzY3JvbGwgbG9jay5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVzZXRQb3MgLSBSZXNldCBzY3JvbGwgcG9zaXRpb24gdG8gb3JpZ2luYWwgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGRpc2FibGVTY3JvbGxMb2NrRm4ocmVzZXRQb3MpIHtcbiAgLy8gaWdub3JlXG4gIGlmIChzY3JvbGxMb2NrID09PSAwKSByZXR1cm47XG5cbiAgLy8gZGVjcmVtZW50IGNvdW50ZXJcbiAgc2Nyb2xsTG9jayAtPSAxO1xuXG4gIC8vIHJlbW92ZSBsb2NrIFxuICBpZiAoc2Nyb2xsTG9jayA9PT0gMCkge1xuICAgIHZhciBodG1sRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KGpxTGl0ZS5jc3MoaHRtbEVsLCAndG9wJykpLFxuICAgICAgICBsZWZ0ID0gcGFyc2VJbnQoanFMaXRlLmNzcyhodG1sRWwsICdsZWZ0JykpO1xuXG4gICAgLy8gcmVtb3ZlIHNjcm9sbCBsb2NrIGFuZCBkZWxldGUgc3R5bGUgZWxlbWVudFxuICAgIGpxTGl0ZS5yZW1vdmVDbGFzcyhodG1sRWwsIHNjcm9sbExvY2tDbHMpO1xuICAgIHNjcm9sbFN0eWxlRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JvbGxTdHlsZUVsKTtcblxuICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uXG4gICAgd2luZG93LnNjcm9sbFRvKC1sZWZ0LCAtdG9wKTsgICAgICBcblxuICAgIC8vIHJlc3RvcmUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyc1xuICAgIGpxTGl0ZS5vZmYod2luZG93LCAnc2Nyb2xsJywgc2Nyb2xsRXZlbnRIYW5kbGVyLCB0cnVlKTtcbiAgfVxufVxuXG4vKipcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbGVkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5mdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVGbihjYWxsYmFjaykge1xuICB2YXIgZm4gPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICBpZiAoZm4pIGZuKGNhbGxiYWNrKTtcbiAgZWxzZSBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKTtcbn1cblxuXG4vKipcbiAqIERlZmluZSB0aGUgbW9kdWxlIEFQSVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqIENyZWF0ZSBjYWxsYmFjayBjbG9zdXJlcyAqL1xuICBjYWxsYmFjazogY2FsbGJhY2tGbixcbiAgXG4gIC8qKiBDbGFzc25hbWVzIG9iamVjdCB0byBzdHJpbmcgKi9cbiAgY2xhc3NOYW1lczogY2xhc3NOYW1lc0ZuLFxuXG4gIC8qKiBEaXNhYmxlIHNjcm9sbCBsb2NrICovXG4gIGRpc2FibGVTY3JvbGxMb2NrOiBkaXNhYmxlU2Nyb2xsTG9ja0ZuLFxuXG4gIC8qKiBEaXNwYXRjaCBldmVudCAqL1xuICBkaXNwYXRjaEV2ZW50OiBkaXNwYXRjaEV2ZW50Rm4sXG4gIFxuICAvKiogRW5hYmxlIHNjcm9sbCBsb2NrICovXG4gIGVuYWJsZVNjcm9sbExvY2s6IGVuYWJsZVNjcm9sbExvY2tGbixcblxuICAvKiogTG9nIG1lc3NhZ2VzIHRvIHRoZSBjb25zb2xlIHdoZW4gZGVidWcgaXMgdHVybmVkIG9uICovXG4gIGxvZzogbG9nRm4sXG5cbiAgLyoqIExvYWQgQ1NTIHRleHQgYXMgbmV3IHN0eWxlc2hlZXQgKi9cbiAgbG9hZFN0eWxlOiBsb2FkU3R5bGVGbixcblxuICAvKiogUmFpc2UgTVVJIGVycm9yICovXG4gIHJhaXNlRXJyb3I6IHJhaXNlRXJyb3JGbixcblxuICAvKiogUmVxdWVzdCBhbmltYXRpb24gZnJhbWUgKi9cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVGbixcblxuICAvKiogU3VwcG9ydCBQb2ludGVyIEV2ZW50cyBjaGVjayAqL1xuICBzdXBwb3J0c1BvaW50ZXJFdmVudHM6IHN1cHBvcnRzUG9pbnRlckV2ZW50c0ZuXG59O1xuIiwiLyoqXG4gKiBNVUkgQ1NTL0pTIG92ZXJsYXkgbW9kdWxlXG4gKiBAbW9kdWxlIG92ZXJsYXlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL2xpYi91dGlsJyksXG4gICAganFMaXRlID0gcmVxdWlyZSgnLi9saWIvanFMaXRlJyksXG4gICAgb3ZlcmxheUlkID0gJ211aS1vdmVybGF5JyxcbiAgICBib2R5Q2xhc3MgPSAnbXVpLS1vdmVyZmxvdy1oaWRkZW4nLFxuICAgIGlvc1JlZ2V4ID0gLyhpUGFkfGlQaG9uZXxpUG9kKS9nLFxuICAgIGFjdGl2ZUVsZW1lbnQ7XG5cblxuLyoqXG4gKiBUdXJuIG92ZXJsYXkgb24vb2ZmLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIFR1cm4gb3ZlcmxheSBcIm9uXCIvXCJvZmZcIi5cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25maWcge2Jvb2xlYW59IFtrZXlib2FyZF0gLSBJZiB0cnVlLCBjbG9zZSB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAqIEBjb25maWcge2Jvb2xlYW59IFtzdGF0aWNdIC0gSWYgZmFsc2UsIGNsb3NlIHdoZW4gYmFja2Ryb3AgaXMgY2xpY2tlZC5cbiAqIEBjb25maWcge0Z1bmN0aW9ufSBbb25jbG9zZV0gLSBDYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uIGNsb3NlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IFtjaGlsZEVsZW1lbnRdIC0gQ2hpbGQgZWxlbWVudCB0byBhZGQgdG8gb3ZlcmxheS5cbiAqL1xuZnVuY3Rpb24gb3ZlcmxheUZuKGFjdGlvbikge1xuICB2YXIgb3ZlcmxheUVsO1xuICBcbiAgaWYgKGFjdGlvbiA9PT0gJ29uJykge1xuICAgIC8vIGV4dHJhY3QgYXJndW1lbnRzXG4gICAgdmFyIGFyZywgb3B0aW9ucywgY2hpbGRFbGVtZW50O1xuICAgIFxuICAgIC8vIHB1bGwgb3B0aW9ucyBhbmQgY2hpbGRFbGVtZW50IGZyb20gYXJndW1lbnRzXG4gICAgZm9yICh2YXIgaT1hcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBpZiAoanFMaXRlLnR5cGUoYXJnKSA9PT0gJ29iamVjdCcpIG9wdGlvbnMgPSBhcmc7XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRWxlbWVudCAmJiBhcmcubm9kZVR5cGUgPT09IDEpIGNoaWxkRWxlbWVudCA9IGFyZztcbiAgICB9XG5cbiAgICAvLyBvcHRpb24gZGVmYXVsdHNcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucy5rZXlib2FyZCA9PT0gdW5kZWZpbmVkKSBvcHRpb25zLmtleWJvYXJkID0gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy5zdGF0aWMgPT09IHVuZGVmaW5lZCkgb3B0aW9ucy5zdGF0aWMgPSBmYWxzZTtcbiAgICBcbiAgICAvLyBleGVjdXRlIG1ldGhvZFxuICAgIG92ZXJsYXlFbCA9IG92ZXJsYXlPbihvcHRpb25zLCBjaGlsZEVsZW1lbnQpO1xuICAgIFxuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ29mZicpIHtcbiAgICBvdmVybGF5RWwgPSBvdmVybGF5T2ZmKCk7XG5cbiAgfSBlbHNlIHtcbiAgICAvLyByYWlzZSBlcnJvclxuICAgIHV0aWwucmFpc2VFcnJvcihcIkV4cGVjdGluZyAnb24nIG9yICdvZmYnXCIpO1xuXG4gIH1cblxuICByZXR1cm4gb3ZlcmxheUVsO1xufVxuXG5cbi8qKlxuICogVHVybiBvbiBvdmVybGF5LlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBPdmVybGF5IG9wdGlvbnMuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkRWxlbWVudCAtIFRoZSBjaGlsZCBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBvdmVybGF5T24ob3B0aW9ucywgY2hpbGRFbGVtZW50KSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHlFbCA9IGRvYy5ib2R5LFxuICAgICAgb3ZlcmxheUVsID0gZG9jLmdldEVsZW1lbnRCeUlkKG92ZXJsYXlJZCk7XG5cbiAgLy8gY2FjaGUgYWN0aXZlRWxlbWVudFxuICBpZiAoZG9jLmFjdGl2ZUVsZW1lbnQpIGFjdGl2ZUVsZW1lbnQgPSBkb2MuYWN0aXZlRWxlbWVudDtcblxuICAvLyBhZGQgb3ZlcmxheVxuICB1dGlsLmVuYWJsZVNjcm9sbExvY2soKTtcblxuICBpZiAoIW92ZXJsYXlFbCkge1xuICAgIC8vIGNyZWF0ZSBvdmVybGF5RWxcbiAgICBvdmVybGF5RWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheUVsLnNldEF0dHJpYnV0ZSgnaWQnLCBvdmVybGF5SWQpO1xuICAgIG92ZXJsYXlFbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgXG4gICAgLy8gYWRkIGNoaWxkIGVsZW1lbnRcbiAgICBpZiAoY2hpbGRFbGVtZW50KSBvdmVybGF5RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcblxuICAgIGJvZHlFbC5hcHBlbmRDaGlsZChvdmVybGF5RWwpO1xuICAgIFxuICB9IGVsc2Uge1xuICAgIC8vIHJlbW92ZSBleGlzdGluZyBjaGlsZHJlblxuICAgIHdoaWxlIChvdmVybGF5RWwuZmlyc3RDaGlsZCkgb3ZlcmxheUVsLnJlbW92ZUNoaWxkKG92ZXJsYXlFbC5maXJzdENoaWxkKTtcbiAgICBcbiAgICAvLyBhZGQgY2hpbGQgZWxlbWVudFxuICAgIGlmIChjaGlsZEVsZW1lbnQpIG92ZXJsYXlFbC5hcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQpO1xuICB9XG5cbiAgLy8gaU9TIGJ1Z2ZpeFxuICBpZiAoaW9zUmVnZXgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgIGpxTGl0ZS5jc3Mob3ZlcmxheUVsLCAnY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBvcHRpb25zXG4gIGlmIChvcHRpb25zLmtleWJvYXJkKSBhZGRLZXl1cEhhbmRsZXIoKTtcbiAgZWxzZSByZW1vdmVLZXl1cEhhbmRsZXIoKTtcblxuICBpZiAob3B0aW9ucy5zdGF0aWMpIHJlbW92ZUNsaWNrSGFuZGxlcihvdmVybGF5RWwpO1xuICBlbHNlIGFkZENsaWNrSGFuZGxlcihvdmVybGF5RWwpO1xuXG4gIC8vIGF0dGFjaCBvcHRpb25zXG4gIG92ZXJsYXlFbC5tdWlPcHRpb25zID0gb3B0aW9ucztcblxuICAvLyBmb2N1cyBvdmVybGF5IGVsZW1lbnRcbiAgb3ZlcmxheUVsLmZvY3VzKCk7XG5cbiAgcmV0dXJuIG92ZXJsYXlFbDtcbn1cblxuXG4vKipcbiAqIFR1cm4gb2ZmIG92ZXJsYXkuXG4gKi9cbmZ1bmN0aW9uIG92ZXJsYXlPZmYoKSB7XG4gIHZhciBvdmVybGF5RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvdmVybGF5SWQpLFxuICAgICAgY2FsbGJhY2tGbjtcblxuICBpZiAob3ZlcmxheUVsKSB7XG4gICAgLy8gcmVtb3ZlIGNoaWxkcmVuXG4gICAgd2hpbGUgKG92ZXJsYXlFbC5maXJzdENoaWxkKSBvdmVybGF5RWwucmVtb3ZlQ2hpbGQob3ZlcmxheUVsLmZpcnN0Q2hpbGQpO1xuXG4gICAgLy8gcmVtb3ZlIG92ZXJsYXkgZWxlbWVudFxuICAgIG92ZXJsYXlFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG92ZXJsYXlFbCk7XG5cbiAgICAvLyBjYWxsYmFjayByZWZlcmVuY2VcbiAgICBjYWxsYmFja0ZuID0gb3ZlcmxheUVsLm11aU9wdGlvbnMub25jbG9zZTtcblxuICAgIC8vIHJlbW92ZSBjbGljayBoYW5kbGVyXG4gICAgcmVtb3ZlQ2xpY2tIYW5kbGVyKG92ZXJsYXlFbCk7XG4gIH1cblxuICB1dGlsLmRpc2FibGVTY3JvbGxMb2NrKCk7XG5cbiAgLy8gcmVtb3ZlIGtleXVwIGhhbmRsZXJcbiAgcmVtb3ZlS2V5dXBIYW5kbGVyKCk7XG5cbiAgLy8gcmV0dXJuIGZvY3VzIHRvIGFjdGl2ZUVsZW1lbnRcbiAgaWYgKGFjdGl2ZUVsZW1lbnQpIGFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblxuICAvLyBleGVjdXRlIGNhbGxiYWNrXG4gIGlmIChjYWxsYmFja0ZuKSBjYWxsYmFja0ZuKCk7XG5cbiAgcmV0dXJuIG92ZXJsYXlFbDtcbn1cblxuXG4vKipcbiAqIEFkZCBrZXl1cCBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiBhZGRLZXl1cEhhbmRsZXIoKSB7XG4gIGpxTGl0ZS5vbihkb2N1bWVudCwgJ2tleXVwJywgb25LZXl1cCk7XG59XG5cblxuLyoqXG4gKiBSZW1vdmUga2V5dXAgaGFuZGxlci5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlS2V5dXBIYW5kbGVyKCkge1xuICBqcUxpdGUub2ZmKGRvY3VtZW50LCAna2V5dXAnLCBvbktleXVwKTtcbn1cblxuXG4vKipcbiAqIFRlYXJkb3duIG92ZXJsYXkgd2hlbiBlc2NhcGUga2V5IGlzIHByZXNzZWQuXG4gKi9cbmZ1bmN0aW9uIG9uS2V5dXAoZXYpIHtcbiAgaWYgKGV2LmtleUNvZGUgPT09IDI3KSBvdmVybGF5T2ZmKCk7XG59XG5cblxuLyoqXG4gKiBBZGQgY2xpY2sgaGFuZGxlci5cbiAqL1xuZnVuY3Rpb24gYWRkQ2xpY2tIYW5kbGVyKG92ZXJsYXlFbCkge1xuICBqcUxpdGUub24ob3ZlcmxheUVsLCAnY2xpY2snLCBvbkNsaWNrKTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSBjbGljayBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiByZW1vdmVDbGlja0hhbmRsZXIob3ZlcmxheUVsKSB7XG4gIGpxTGl0ZS5vZmYob3ZlcmxheUVsLCAnY2xpY2snLCBvbkNsaWNrKTtcbn1cblxuXG4vKipcbiAqIFRlYXJkb3duIG92ZXJsYXkgd2hlbiBiYWNrZHJvcCBpcyBjbGlja2VkLlxuICovXG5mdW5jdGlvbiBvbkNsaWNrKGV2KSB7XG4gIGlmIChldi50YXJnZXQuaWQgPT09IG92ZXJsYXlJZCkgb3ZlcmxheU9mZigpO1xufVxuXG5cbi8qKiBEZWZpbmUgbW9kdWxlIEFQSSAqL1xubW9kdWxlLmV4cG9ydHMgPSBvdmVybGF5Rm47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QvYWRkb25zJztcblxuY29uc3QgQ3JlYXRlR2FtZUZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbGluazogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRpbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBpbmM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBvbkNoYW5nZUZvcm06IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY3JlYXRlR2FtZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLnByb3BzLmNyZWF0ZUdhbWV9PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgPHNwYW4+TWludXRlcyBwZXIgc2lkZTogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBuYW1lPVwidGltZVwiXG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnRpbWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uQ2hhbmdlRm9ybX1cbiAgICAgICAgICAgICAgbWluPVwiMVwiXG4gICAgICAgICAgICAgIG1heD1cIjUwXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWQgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBzdHlsZT17e3BhZGRpbmdMZWZ0OiAnMmVtJ319PlxuICAgICAgICAgICAgPHNwYW4+SW5jcmVtZW50IGluIHNlY29uZHM6IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgbmFtZT1cImluY1wiXG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLmluY31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25DaGFuZ2VGb3JtfVxuICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgbWF4PVwiNTBcIlxuICAgICAgICAgICAgICByZXF1aXJlZCAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGlkPVwiZ2FtZS1saW5rXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMubGluayB8fCAnR2FtZSBsaW5rIHdpbGwgYmUgZ2VuZXJhdGVkIGhlcmUuJ31cbiAgICAgICAgICBvbkNsaWNrPXtlID0+IGUudGFyZ2V0LnNlbGVjdCgpfVxuICAgICAgICAgIHJlYWRPbmx5IC8+XG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biB5ZWxsb3dcIj5QbGF5PC9idXR0b24+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyZWF0ZUdhbWVGb3JtO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IENyZWF0ZUdhbWVGb3JtIGZyb20gJy4vQ3JlYXRlR2FtZUZvcm0nO1xuaW1wb3J0IGlvIGZyb20gJy4uL2lvJztcblxuXG5jb25zdCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgXG4gIHByb3BUeXBlczoge1xuICAgIGlvOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6ICcnLFxuICAgICAgaGFzRXhwaXJlZDogZmFsc2UsXG4gICAgICB0aW1lOiAnMzAnLFxuICAgICAgaW5jOiAnMCdcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBpbyA9IHRoaXMucHJvcHMuaW87XG5cbiAgICBpby5vbignY3JlYXRlZCcsIGRhdGEgPT4ge1xuICAgICAgY29uc3Qge3RpbWUsIGluY30gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3QgbG9jID0gd2luZG93LmxvY2F0aW9uO1xuXG4gICAgICBjb25zdCBvcmlnaW4gPSBsb2Mub3JpZ2luIHx8IGAke2xvYy5wcm90b2NvbH0vLyR7bG9jLmhvc3RuYW1lfWAgK1xuICAgICAgICAobG9jLnBvcnQgPyAnOicgKyBsb2MucG9ydCA6ICcnKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpbms6IGAke29yaWdpbn0vcGxheS8ke2RhdGEudG9rZW59LyR7dGltZX0vJHtpbmN9YCxcbiAgICAgICAgaGFzRXhwaXJlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlvLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuc3RhdGUubGluaztcbiAgICB9KTtcbiAgICBpby5vbigndG9rZW4tZXhwaXJlZCcsICgpID0+IHRoaXMuc2V0U3RhdGUoe2hhc0V4cGlyZWQ6IHRydWV9KSk7XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGltZyBzcmM9XCIvaW1nL2JlZXIucG5nXCJcbiAgICAgICAgICAgICB3aWR0aD1cIjEyMFwiXG4gICAgICAgICAgICAgaGVpZ2h0PVwiMTIwXCJcbiAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZWVyXCIgLz5cbiAgICAgICAgPGgxPkRydW5rIENoZXNzPC9oMT5cblxuICAgICAgICA8cD5cbiAgICAgICAgICBDbGljayB0aGUgYnV0dG9uIHRvIGNyZWF0ZSBhIGdhbWUuIFNlbmQgdGhlIGxpbmsgdG8geW91ciBmcmllbmQuXG4gICAgICAgICAgT25jZSB0aGUgbGluayBpcyBvcGVuZWQgeW91ciBmcmllbmTigJhzIGJyb3dzZXIsIGdhbWUgc2hvdWxkIGJlZ2luIFxuICAgICAgICAgIHNob3J0bHkuIENvbG9ycyBhcmUgcGlja2VkIHJhbmRvbWx5IGJ5IGNvbXB1dGVyLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxkaXYgaWQ9XCJjcmVhdGUtZ2FtZVwiPlxuICAgICAgICAgIDxDcmVhdGVHYW1lRm9ybVxuICAgICAgICAgICAgbGluaz17dGhpcy5zdGF0ZS5saW5rfVxuICAgICAgICAgICAgdGltZT17dGhpcy5zdGF0ZS50aW1lfVxuICAgICAgICAgICAgaW5jPXt0aGlzLnN0YXRlLmluY31cbiAgICAgICAgICAgIG9uQ2hhbmdlRm9ybT17dGhpcy5fb25DaGFuZ2VGb3JtfVxuICAgICAgICAgICAgY3JlYXRlR2FtZT17dGhpcy5fY3JlYXRlR2FtZX0gLz5cbiAgICAgICAgICAgIFxuICAgICAgICAgIDxwIGlkPVwiZ2FtZS1zdGF0dXNcIj5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLmhhc0V4cGlyZWQgP1xuICAgICAgICAgICAgICAnR2FtZSBsaW5rIGhhcyBleHBpcmVkLCBnZW5lcmF0ZSBhIG5ldyBvbmUnXG4gICAgICAgICAgICA6dGhpcy5zdGF0ZS5saW5rID9cbiAgICAgICAgICAgICAgJ1dhaXRpbmcgZm9yIG9wcG9uZW50IHRvIGNvbm5lY3QnXG4gICAgICAgICAgICA6bnVsbH1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cD5cbiAgICAgICAgICA8YSBocmVmPVwiL2Fib3V0XCIgY2xhc3NOYW1lPVwiYWxwaGFcIj5SZWFkIG1vcmUgYWJvdXQgRHJ1bmsgQ2hlc3M8L2E+XG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlRm9ybShlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7W2UudGFyZ2V0Lm5hbWVdOiBlLnRhcmdldC52YWx1ZX0pO1xuICB9LFxuICBfY3JlYXRlR2FtZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qge3RpbWUsIGluY30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGlzSW52YWxpZCA9IFt0aW1lLCBpbmNdLnNvbWUodmFsID0+IHtcbiAgICAgIHZhbCA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgcmV0dXJuIGlzTmFOKHZhbCkgfHwgdmFsIDwgMCB8fCB2YWwgPiA1MDtcbiAgICB9KTtcblxuICAgIGlmIChpc0ludmFsaWQpIHtcbiAgICAgIC8vIGZhbGxiYWNrIGZvciBvbGQgYnJvd3NlcnNcbiAgICAgIHJldHVybiB3aW5kb3cuYWxlcnQoJ0Zvcm0gaXMgaW52YWxpZC4gRW50ZXIgbnVtYmVycyBiZXR3ZWVuIDAgYW5kIDUwLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLmlvLmVtaXQoJ3N0YXJ0Jyk7XG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgaW8gZnJvbSAnLi9pbyc7XG5pbXBvcnQgSW5kZXggZnJvbSAnLi9jb21wb25lbnRzL0luZGV4JztcbmltcG9ydCAnbXVpY3NzJztcblxuXG5SZWFjdC5yZW5kZXIoXG4gIDxJbmRleCBpbz17aW99IC8+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJylcbik7XG4iLCJpbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cblxuY29uc3QgSE9TVCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuXG5leHBvcnQgZGVmYXVsdCBpby5jb25uZWN0KEhPU1QpO1xuIl19
