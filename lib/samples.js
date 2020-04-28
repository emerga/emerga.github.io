var Samples =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/samples.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/state-machine.js":
/*!**********************************!*\
  !*** ./src/lib/state-machine.js ***!
  \**********************************/
/*! exports provided: StateElement, StateMachineCollection, StateMachine, EntityElement, StateOperator, StateRenderer, StateBuilder, StateMachineBreakException */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateElement", function() { return StateElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateMachineCollection", function() { return StateMachineCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateMachine", function() { return StateMachine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EntityElement", function() { return EntityElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateOperator", function() { return StateOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateRenderer", function() { return StateRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateBuilder", function() { return StateBuilder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateMachineBreakException", function() { return StateMachineBreakException; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 
 */
var StateElement = /*#__PURE__*/function () {
  function StateElement(machine, state, callback) {
    _classCallCheck(this, StateElement);

    this._machine = machine;
    this._state = state;
    this.callback = callback;
  }

  _createClass(StateElement, [{
    key: "execute",
    value: function execute(iteration) {
      if (this.callback) {
        return this.callback(this, iteration);
      }
    }
  }, {
    key: "machine",
    get: function get() {
      return this._machine;
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }]);

  return StateElement;
}();
/**
 * 
 */


var StateMachineCollection = /*#__PURE__*/function () {
  function StateMachineCollection(machine) {
    _classCallCheck(this, StateMachineCollection);

    this.machine = machine;
    this._elements = [];
  }

  _createClass(StateMachineCollection, [{
    key: "add",
    value: function add(el) {
      var self = this;

      if (el) {
        var toUpdate = [];

        if (!Array.isArray(el)) {
          toUpdate = [el];
        } else {
          toUpdate = el;
        }

        toUpdate.forEach(function (tu) {
          return self.elements.push(tu);
        });
      }

      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._elements = [];
    }
  }, {
    key: "elements",
    get: function get() {
      return this._elements;
    }
  }]);

  return StateMachineCollection;
}();
/**
 * 
 */


var EntityElement = /*#__PURE__*/function (_StateElement) {
  _inherits(EntityElement, _StateElement);

  var _super = _createSuper(EntityElement);

  function EntityElement(machine, state, callback) {
    var _this;

    _classCallCheck(this, EntityElement);

    _this = _super.call(this, machine, state, callback);
    _this.state.children = [];
    return _this;
  }

  _createClass(EntityElement, [{
    key: "x",
    get: function get() {
      return this.state.x;
    }
  }, {
    key: "y",
    get: function get() {
      return this.state.y;
    }
  }, {
    key: "parent",
    get: function get() {
      return this.state.parent;
    },
    set: function set(p) {
      this.state.parent = p;
    }
  }, {
    key: "children",
    get: function get() {
      return this.state.children;
    }
  }]);

  return EntityElement;
}(StateElement);
/**
 * 
 */


var StateRenderer = /*#__PURE__*/function (_StateElement2) {
  _inherits(StateRenderer, _StateElement2);

  var _super2 = _createSuper(StateRenderer);

  function StateRenderer() {
    _classCallCheck(this, StateRenderer);

    return _super2.apply(this, arguments);
  }

  _createClass(StateRenderer, [{
    key: "execute",
    value: function execute(iteration, el) {
      if (this.callback) {
        return this.callback(el, iteration);
      }
    }
  }]);

  return StateRenderer;
}(StateElement);
/**
 * 
 */


var StateOperator = /*#__PURE__*/function (_StateElement3) {
  _inherits(StateOperator, _StateElement3);

  var _super3 = _createSuper(StateOperator);

  function StateOperator() {
    _classCallCheck(this, StateOperator);

    return _super3.apply(this, arguments);
  }

  _createClass(StateOperator, [{
    key: "execute",
    value: function execute(iteration, el) {
      if (this.callback) {
        return this.callback(el, iteration);
      }
    }
  }]);

  return StateOperator;
}(StateElement);
/**
 * 
 */


var StateBuilder = /*#__PURE__*/function (_StateElement4) {
  _inherits(StateBuilder, _StateElement4);

  var _super4 = _createSuper(StateBuilder);

  function StateBuilder() {
    _classCallCheck(this, StateBuilder);

    return _super4.apply(this, arguments);
  }

  return StateBuilder;
}(StateElement);

var StateMachineBreakException = {};
/**
 * 
 */

var StateMachine = /*#__PURE__*/function () {
  function StateMachine() {
    _classCallCheck(this, StateMachine);

    this.remIterations = 0;
    this.iteration = 1;
    this.maxIterations = 10;
    this.async = true;
    this.halt = false;
    this.stateElements = new StateMachineCollection(this);
    this.stateOperators = new StateMachineCollection(this);
    this.stateBuilders = new StateMachineCollection(this);
    this.stateRenderers = new StateMachineCollection(this);
    this._postIteration = null;
  }

  _createClass(StateMachine, [{
    key: "reset",
    value: function reset() {
      this.elements.clear();
      this.iteration = this.remIterations = 0;
      this.builders.elements.forEach(function (stateBu) {
        stateBu.execute(1);
      });
    }
  }, {
    key: "run",
    value: function run(iterations) {
      this.builders.elements.forEach(function (stateBu) {
        stateBu.execute(1);
      });
      this.advance(iterations);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.halt = true;
    }
  }, {
    key: "advance",
    value: function advance(iterations) {
      var self = this;

      var __advance = function __advance() {
        try {
          _advance();
        } catch (e) {
          if (e !== StateMachineBreakException) throw e;
        }
      };

      var _advance = function _advance() {
        self.remIterations = iterations;

        if (self.remIterations === 0 || self.iteration >= self.maxIterations || self.halt) {
          return;
        }

        var newElements = [];

        var checkHalt = function checkHalt() {
          if (self.halt) {
            throw StateMachineBreakException;
          }
        };

        var operateOnElement = function operateOnElement(stateEl) {
          var els = [];
          self.operators.elements.forEach(function (stateOp) {
            checkHalt();
            var r = stateOp.execute(self.iteration, stateEl);
            if (r) els = els.concat(r);
          });
          return els;
        };

        var renderElement = function renderElement(stateEl, async) {
          var _re = function _re() {
            self.renderers.elements.forEach(function (stateRe) {
              checkHalt();
              stateRe.execute(self.iteration, stateEl);
            });
          };

          return self.async ? setTimeout(_re, 0) : _re();
        };

        self.elements.elements.forEach(function (stateEl) {
          checkHalt();
          var els = operateOnElement(stateEl);
          renderElement(stateEl, true);
          els.forEach(function (ell) {
            checkHalt();
            renderElement(ell, true);
            newElements.push(ell);
          });
          stateEl.state.parent = stateEl;
        });
        var stopIter = false;

        if (self.postIteration) {
          checkHalt();
          stopIter = self.postIteration(self, newElements, self.iteration);
        }

        self.iteration++;
        checkHalt();

        if (self.remIterations !== -1) {
          if (self.remIterations !== 0 && !stopIter) {
            self.remIterations--;
            setTimeout(__advance, 0);
          }
        } else {
          setTimeout(__advance, 0);
        }
      };

      setTimeout(__advance, 0);
    }
  }, {
    key: "elements",
    get: function get() {
      return this.stateElements;
    }
  }, {
    key: "operators",
    get: function get() {
      return this.stateOperators;
    }
  }, {
    key: "builders",
    get: function get() {
      return this.stateBuilders;
    }
  }, {
    key: "renderers",
    get: function get() {
      return this.stateRenderers;
    }
  }, {
    key: "postIteration",
    get: function get() {
      return this._postIteration;
    },
    set: function set(x) {
      this._postIteration = x;
    }
  }, {
    key: "async",
    get: function get() {
      return this._async;
    },
    set: function set(x) {
      this._async = x;
    }
  }]);

  return StateMachine;
}();



/***/ }),

/***/ "./src/scripts/fractal-of-life.js":
/*!****************************************!*\
  !*** ./src/scripts/fractal-of-life.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var state = __webpack_require__(/*! ../lib/state-machine */ "./src/lib/state-machine.js");

var FractalOfLife = /*#__PURE__*/function () {
  function FractalOfLife(emerga) {
    _classCallCheck(this, FractalOfLife);

    this.emerga = emerga;
    this.branchAngle = this._branchAngle = 27;
    this.segments = this._segments = 5;
    this.numIterations = this._numIterations = 8;
    this.scaleFactor = 512;
    this.offset = 600;
    this.useFabric = false;
    this.usePoints = this._usePoints = true;
    if (!this.useFabric) this.emerga.initCanvas('main');
    this.context = this.useFabric ? null : this.emerga.context;
    this.canvas = this.useFabric ? new fabric.Canvas('main') : this.emerga.context;
  }

  _createClass(FractalOfLife, [{
    key: "init",
    value: function init() {
      var _this = this;

      var self = this;

      var stopStateMachine = function stopStateMachine(cb) {
        _this.stateMachine.stop();

        _this.stateMachine.reset();

        if (cb) {
          setTimeout(cb, 100);
        }
      };

      var startStateMachine = function startStateMachine() {
        _this.stateMachine.run(self.numIterations);
      };

      var _animate = function _animate() {
        stats.begin();
        stats.end();
        window.requestAnimationFrame(_animate);
      };

      this.emerga.initStats(0).initGUI('gui', {
        load: JSON,
        preset: 'Fractal of Life'
      });
      window.requestAnimationFrame(_animate);
      var g = this.emerga.guis['gui'];
      g.add(self, '_segments').min(2).step(1).onChange(function (val) {
        if (val !== self.segments) {
          self.segments = val;
          stopStateMachine(startStateMachine);
        }
      });
      g.add(self, '_numIterations').min(1).step(1).onChange(function (val) {
        if (val !== self.numIterations) {
          self.numIterations = val;
          stopStateMachine(startStateMachine);
        }
      });
      g.add(self, '_branchAngle', 1, 359).onChange(function (val) {
        if (val !== self.branchAngle) {
          self.branchAngle = val;
          stopStateMachine(startStateMachine);
        }
      });
      g.add(self, '_usePoints', 1, 359).onChange(function (val) {
        if (val !== self.usePoints) {
          self.usePoints = val;
          stopStateMachine(startStateMachine);
        }
      });
      g.add(self, 'scaleFactor', 1, 8192);
      g.remember(self);

      var BloomElement = /*#__PURE__*/function (_state$EntityElement) {
        _inherits(BloomElement, _state$EntityElement);

        var _super = _createSuper(BloomElement);

        function BloomElement(machine, state, callback) {
          _classCallCheck(this, BloomElement);

          return _super.call(this, machine, state, callback);
        }

        _createClass(BloomElement, [{
          key: "toString",
          value: function toString() {
            return JSON.stringify({
              id: this.id,
              parent_id: this.parent ? this.parent.id : null,
              x: this.x,
              y: this.y,
              angle: this.angle,
              segments: this.segments,
              children: this.children.length
            });
          }
        }, {
          key: "origin",
          value: function origin(scale) {
            return [this.x * scale, this.y * scale];
          }
        }, {
          key: "logPoint",
          value: function logPoint(p1, p2) {
            return '{,`$p1[0]`,`$p1[1]`,`$p2[0]`,`$p2[1]`}';
          }
        }, {
          key: "id",
          get: function get() {
            return this.state.id;
          }
        }, {
          key: "angle",
          get: function get() {
            return this.state.angle;
          }
        }, {
          key: "segments",
          get: function get() {
            return this.state.segments;
          }
        }], [{
          key: "bloom",
          value: function bloom(el, iter, cb) {
            var getAngle = function getAngle(distance, base) {
              return 2 * Math.PI / base * distance;
            };

            var getCartesianCoordinates = function getCartesianCoordinates(angle, radius) {
              return [Math.cos(angle) * radius, Math.sin(angle) * radius];
            };

            var pointsEqual = function pointsEqual(p1, p2) {
              return p1[0] === p2[0] && p1[1] === p2[1];
            };

            for (var i = 0; i < el.segments; i++) {
              var _id = el.id + i.toString();

              var angle = self.branchAngle * (1 / 2 + i - self.segments / 2) + el.angle;

              while (angle >= 360) {
                angle -= 360;
              }

              var lastlen = iter == 1 ? 0 : 1 / (iter - 1);
              var len = lastlen / (1 / iter);
              var ccoords = getCartesianCoordinates(angle, len);
              if (el.parent !== el) el.children.push(new BloomElement(el.machine, {
                id: _id,
                x: el.x + ccoords[0] / iter,
                y: el.y + ccoords[1] / iter,
                parent: el,
                angle: angle,
                segments: self.segments,
                iteration: iter
              }, BloomElement.bloom));
            }

            if (cb) cb(el.children);else return el.children;
          }
        }]);

        return BloomElement;
      }(state.EntityElement);

      var machine = self.stateMachine = new state.StateMachine();
      machine.builders.add(new state.StateBuilder(machine, null, function (el, iter) {
        if (self.useFabric) {} else {
          self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        }

        var nel = new BloomElement(machine, {
          id: '',
          x: 0,
          y: 0,
          parent: null,
          angle: 90,
          segments: self.segments
        }, BloomElement.bloom);
        machine.elements.add(nel);
      }));
      machine.operators.add(new state.StateOperator(machine, null, function (el, iter) {
        // execute the operator on the element
        // and add resulting elements to list
        return el.execute(iter);
      }));

      machine.postIteration = function (machine, _els, iter) {
        machine.elements.clear();
        machine.elements.add(_els);
        return iter > 6;
      };

      machine.renderers.add(new state.StateRenderer(machine, null, function (el, iter) {
        var me = _this;

        var hslToRgb = function hslToRgb(h, s, l) {
          var r, g, b;

          if (s == 0) {
            r = g = b = l; // achromatic
          } else {
            var hue2rgb = function hue2rgb(p, q, t) {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }

          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };

        var colorRgbMap = [];

        var getRgb = function getRgb(level) {
          if (colorRgbMap[level] == null) {
            // Keep hue value in range [0, 1]
            var hue = level / 10 % 1;
            var rgb = hslToRgb(hue, 0.5, 0.5);
            colorRgbMap[level] = rgb;
          }

          return colorRgbMap[level];
        };

        var rgbToHex = function rgbToHex(rgb) {
          var hex = Number(rgb).toString(16);

          if (hex.length < 2) {
            hex = "0" + hex;
          }

          return hex;
        };

        var fullColor = function fullColor(rgb, l) {
          return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + l + ')';
        };

        var offset = function offset(a, o) {
          return [a[0] + o, a[1] + o];
        };

        var lineString = function lineString(p1, p2) {
          return '{' + p1[0] + ',' + p1[1] + ',' + p2[0] + ',' + p2[1] + '}';
        };

        var logLine = function logLine(p1, p2) {
          console.log(lineString(p1, p2));
        };

        var strokeStyle = fullColor(getRgb(iter), 1 / iter * 2);
        var strokeWidth = iter > 6 ? 1 : 6 + 2 / iter;

        var drawLine = function drawLine(start, end) {
          if (!self.useFabric) {
            if (self.usePoints) {
              self.context.arc(start[0], start[1], strokeWidth * (8 * 4 / iter), 0, 2 * Math.PI, false);
              self.context.fillStyle = strokeStyle;
              self.context.fill();
              self.context.lineWidth = 1;
              self.context.strokeStyle = strokeStyle;
            } else {
              self.context.moveTo(start[0], start[1]);
              self.context.lineTo(end[0], end[1]);
              self.context.strokeStyle = strokeStyle;
              self.context.strokeWidth = strokeWidth;
            }
          } else {
            self.canvas.add(new fabric.Line({
              x1: start[0],
              y1: start[1],
              x2: end[0],
              y2: end[1],
              stroke: strokeStyle,
              strokeWidth: strokeWidth
            }));
          }
        };

        if (!self.useFabric) self.context.beginPath();
        var originCoords = offset(el.origin(self.scaleFactor), self.offset);

        if (el.parent) {
          var parentCoords = offset(el.parent.origin(self.scaleFactor), self.offset);
          drawLine(originCoords, parentCoords);
          if (self.logging) logLine(originCoords, parentCoords);
        }

        el.children.forEach(function (child) {
          var childCoords = offset(child.origin(self.scaleFactor), self.offset);
          drawLine(originCoords, childCoords);
          if (self.logging) logLine(originCoords, childCoords);
        });
        if (!self.useFabric) self.context.stroke();
      }));
    }
  }, {
    key: "run",
    value: function run() {
      this.stateMachine.run(this.numIterations);
    }
  }]);

  return FractalOfLife;
}();

module.exports = FractalOfLife;

/***/ }),

/***/ "./src/scripts/sample.js":
/*!*******************************!*\
  !*** ./src/scripts/sample.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Sample = /*#__PURE__*/function () {
  function Sample(emerga) {
    _classCallCheck(this, Sample);

    this.emerga = emerga;
  }

  _createClass(Sample, [{
    key: "run",
    value: function run() {
      this.emerga.initStats(1).initGUI('gui');
      this.animate();
      this.flowerOfLife();
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this = this;

      var animate = function animate() {
        _this.emerga.stats[1].begin();

        _this.emerga.stats[1].end();
      };

      requestAnimationFrame(animate);
    }
  }, {
    key: "flowerOfLife",
    value: function flowerOfLife() {
      var d3 = this.emerga.d3;
      var body = d3.select("body");
      var svg = body.append("svg").attr("width", window.innerWidth).attr("height", window.innerHeight);
      initialize();

      function initialize() {
        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();
      }

      function resizeCanvas() {
        svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
        d3.selectAll("svg > *").remove();
        redraw(40, 4, "#444444");
      }

      function redraw(radius, cycles, color) {
        var w = window.innerWidth,
            h = window.innerWidth,
            r = radius,
            flip = 0,
            grid = new Array();

        for (i = 1, m = 1, d = 0; i <= cycles; i += 1, m *= 2, d += 2500) {
          xs = Math.sqrt(Math.pow(r * m, 2) - Math.pow(r * m / 2, 2));

          for (x = 0; x < w + r * m; x += xs) {
            for (y = 0; y < h + r * m; y += r * m) {
              if (flip == 1) {
                var tCoord = {
                  "x": x,
                  "y": y + r * m / 2,
                  "r": r * m,
                  "d": d
                };
              } else {
                var tCoord = {
                  "x": x,
                  "y": y,
                  "r": r * m,
                  "d": d
                };
              }

              grid.push(tCoord);
            }

            if (flip == 1) {
              flip = 0;
            } else {
              flip = 1;
            }
          }
        }

        d3.select("svg").selectAll("circle").data(grid).enter().append("circle").attr("cx", function (d) {
          return d.x;
        }).attr("cy", function (d) {
          return d.y;
        }).attr("r", function (d) {
          return d.r;
        }).attr("stroke", color).attr("stroke-width", 1.0) //			.attr("stroke-opacity", function(d) { return d.o })
        .attr("fill-opacity", 0.0).attr("opacity", 1.0).transition().duration(5000).delay(function (d) {
          return d.d;
        }).each(fade);

        function fade() {
          var circle = d3.select(this);

          (function repeat() {
            circle = circle.transition().attr("stroke-opacity", 1).transition().attr("stroke-opacity", 0.33).each("end", repeat);
          })();
        }
      }
    }
  }]);

  return Sample;
}();

module.exports = Sample;

/***/ }),

/***/ "./src/scripts/samples.js":
/*!********************************!*\
  !*** ./src/scripts/samples.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var samples = {
  Sample: __webpack_require__(/*! ./sample */ "./src/scripts/sample.js"),
  FractalOfLife: __webpack_require__(/*! ./fractal-of-life */ "./src/scripts/fractal-of-life.js")
};
module.exports = samples;

/***/ })

/******/ });
//# sourceMappingURL=samples.js.map