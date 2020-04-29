var Sample =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/sample.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ })

/******/ });
//# sourceMappingURL=sample.js.map