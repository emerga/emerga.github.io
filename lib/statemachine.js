var StateMachine =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/lib/state-machine.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/state-machine.js":
/*!**********************************!*\
  !*** ./src/lib/state-machine.js ***!
  \**********************************/
/*! exports provided: StateElement, StateMachineCollection, StateMachine, EntityElement, StateOperator, StateRenderer, StateBuilder */
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
    key: "advance",
    value: function advance(iterations) {
      var self = this;

      var _advance = function _advance() {
        self.remIterations = iterations;

        if (self.remIterations === 0 || self.iteration >= self.maxIterations) {
          return;
        }

        var newElements = [];

        var operateOnElement = function operateOnElement(stateEl) {
          var els = [];
          self.operators.elements.forEach(function (stateOp) {
            var r = stateOp.execute(self.iteration, stateEl);
            if (r) els = els.concat(r);
          });
          return els;
        };

        var renderElement = function renderElement(stateEl, async) {
          var _re = function _re() {
            self.renderers.elements.forEach(function (stateRe) {
              stateRe.execute(self.iteration, stateEl);
            });
          };

          return self.async ? setTimeout(_re, 0) : _re();
        };

        self.elements.elements.forEach(function (stateEl) {
          var els = operateOnElement(stateEl);
          renderElement(stateEl); // setTimeout(()=>{

          els.forEach(function (ell) {
            renderElement(ell);
            newElements.push(ell);
          });
          stateEl.state.parent = stateEl; // },0);
        });
        var stopIter = false;

        if (self.postIteration) {
          stopIter = self.postIteration(self, newElements, self.iteration);
        }

        self.iteration++;

        if (self.remIterations !== -1) {
          if (self.remIterations !== 0 && !stopIter) {
            self.remIterations--;
            setTimeout(_advance, 0);
          }
        } else {
          setTimeout(_advance, 0);
        }
      };

      setTimeout(_advance, 0);
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



/***/ })

/******/ });
//# sourceMappingURL=statemachine.js.map