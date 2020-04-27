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
/*! exports provided: StateElement, StateMachineCollection, StateMachine, EntityElement, StateOperator, StateBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateElement", function() { return StateElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateMachineCollection", function() { return StateMachineCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateMachine", function() { return StateMachine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EntityElement", function() { return EntityElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateOperator", function() { return StateOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateBuilder", function() { return StateBuilder; });
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

    this.machine = machine;
    this.state = state;
    this.callback = callback;
  }

  _createClass(StateElement, [{
    key: "execute",
    value: function execute(iteration) {
      if (this.callback) {
        this.callback(this, iteration);
      }
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
      if (el) {
        if (Array.isArray(el)) {
          this.elements = this.elements.concat(el);
        } else {
          this.elements.push(el);
        }

        return this;
      } else {
        return this.elements;
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
    _this._children = [];
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
    key: "children",
    get: function get() {
      return this._children;
    }
  }]);

  return EntityElement;
}(StateElement);
/**
 * 
 */


var StateOperator = /*#__PURE__*/function (_StateElement2) {
  _inherits(StateOperator, _StateElement2);

  var _super2 = _createSuper(StateOperator);

  function StateOperator() {
    _classCallCheck(this, StateOperator);

    return _super2.apply(this, arguments);
  }

  _createClass(StateOperator, [{
    key: "execute",
    value: function execute(iteration, el) {
      if (this.callback) {
        this.callback(el, iteration);
      }
    }
  }]);

  return StateOperator;
}(StateElement);
/**
 * 
 */


var StateBuilder = /*#__PURE__*/function (_StateElement3) {
  _inherits(StateBuilder, _StateElement3);

  var _super3 = _createSuper(StateBuilder);

  function StateBuilder() {
    _classCallCheck(this, StateBuilder);

    return _super3.apply(this, arguments);
  }

  return StateBuilder;
}(StateElement);
/**
 * 
 */


var StateMachine = /*#__PURE__*/function () {
  function StateMachine() {
    _classCallCheck(this, StateMachine);

    this.remIterations = 0;
    this.iteration = 0;
    this.maxIterations = 5;
    this.stateElements = new StateMachineCollection(this);
    this.stateOperators = new StateMachineCollection(this);
    this.stateBuilders = new StateMachineCollection(this);
  }

  _createClass(StateMachine, [{
    key: "reset",
    value: function reset() {
      this.elements.clear();
      this.iteration = this.remIterations = 0;
      this.builders.elements.forEach(function (stateBu) {
        stateBu.execute(0);
      });
    }
  }, {
    key: "run",
    value: function run(iterations) {
      this.builders.elements.forEach(function (stateBu) {
        stateBu.execute(0);
      });
      this.advance(iterations);
    }
  }, {
    key: "advance",
    value: function advance(iterations) {
      var _this2 = this;

      for (this.remIterations = iterations; this.remIterations >= 0 && this.iteration < this.maxIterations; this.remIterations = this.remIterations !== -1 ? this.remIterations - 1 : -1) {
        this.elements.elements.forEach(function (stateEl) {
          _this2.operators.elements.forEach(function (stateOp) {
            stateOp.execute(_this2.iteration, stateEl);
          });
        });
        this.iteration++;
      }
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var state = __webpack_require__(/*! ../lib/state-machine */ "./src/lib/state-machine.js");

var FractalOfLife = /*#__PURE__*/function () {
  function FractalOfLife(emerga) {
    _classCallCheck(this, FractalOfLife);

    this.emerga = emerga;
  }

  _createClass(FractalOfLife, [{
    key: "init",
    value: function init() {
      var iterop = this.fractalOfLifeBloom;
      var machine = this.stateMachine = new state.StateMachine();
      machine.builders.add(new state.StateBuilder(machine, null, function (el, iter) {
        machine.elements.add(new state.EntityElement(machine, {
          x: 0,
          y: 0
        }, iterop));
      }));
      machine.operators.add(new state.StateOperator(machine, null, function (el, iter) {
        // execute the operator on the element
        // and add resulting elements to list
        el.execute(iter);
      }));
    }
  }, {
    key: "fractalOfLifeBloom",
    value: function fractalOfLifeBloom(el, iter) {
      console.log(iter);
    }
  }, {
    key: "run",
    value: function run() {
      this.stateMachine.run(5);
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
      this.flowerOfLife();
      requestAnimationFrame(this.animate);
    }
  }, {
    key: "animate",
    value: function animate() {
      this.emerga.stats[1].begin();
      this.emerga.stats[1].end();
      requestAnimationFrame(this.animate);
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