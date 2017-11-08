/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 192);
/******/ })
/************************************************************************/
/******/ ({

/***/ 141:
/***/ (function(module, exports) {

var qualitatifs = new Vue({
    el: '#qualitatifs',
    data: {
        nappe: 'Toutes',
        type: 'Tous',
        message: '',
        dates: [],
        napes: [],
        types: [],
        names: {},
        chartData: []
    },
    methods: {
        getTypeData: function getTypeData() {
            this.nappe = 'Toutes';
            this.getNappes();
            this.getData();
        },
        getNappeData: function getNappeData() {
            this.getData();
            this.message = this.type + ' de ' + this.nappe;
        },
        getData: function getData() {
            var _this = this;

            axios.get('/api/qualitatifs/getData', {
                params: {
                    nappe: this.nappe,
                    type: this.type
                }
            }).then(function (response) {
                if (response.data.length == 0) {
                    _this.message = 'Choisir un type ';
                    chart = null;
                } else {
                    if (_this.nappe == 'Toutes') {
                        _this.getNappes().then(function () {
                            var array = {};
                            var chartdates = {};
                            for (var nappe in _this.napes) {
                                array[_this.napes[nappe]] = [];
                                chartdates[_this.napes[nappe]] = _this.napes[nappe] + "Dates";
                                array[_this.napes[nappe] + "Dates"] = [];
                                for (var item in response.data) {
                                    if (response.data[item].nappe == _this.napes[nappe]) {
                                        array[_this.napes[nappe]].push(response.data[item].valeur);
                                        array[_this.napes[nappe] + "Dates"].push(response.data[item].date);
                                    }
                                }
                            }
                            _this.chartData = array;
                            _this.dates = chartdates;
                            var vm = _this;
                            var chart = c3.generate({
                                bindto: '#chart',
                                data: {
                                    xs: vm.dates,
                                    xFormat: '%Y',
                                    json: vm.chartData,
                                    names: vm.names,
                                    type: 'bar'
                                },
                                legend: {
                                    position: 'right'
                                },
                                bar: {
                                    width: {
                                        ratio: 0.1
                                    }
                                },
                                axis: {
                                    x: {
                                        type: 'timeseries',
                                        tick: {
                                            format: '%Y'
                                        }
                                    },
                                    y: {
                                        tick: {
                                            outer: false,
                                            format: function format(d) {
                                                return Number(d.toFixed(1));
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        var _chart = c3.generate({
                            bindto: '#chart',
                            data: {
                                x: 'x',
                                xFormat: '%Y',
                                json: response.data,
                                keys: {
                                    x: 'date',
                                    value: ['valeur']
                                },
                                type: 'bar'
                            },
                            bar: {
                                width: {
                                    ratio: 0.1 // this makes bar width 50% of length between ticks
                                }
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%Y'
                                    }
                                },
                                y: {
                                    tick: {
                                        outer: false,
                                        format: function format(d) {
                                            return Number(d.toFixed(1));
                                        }
                                    }
                                }
                            }
                        });
                        _chart.data.names({ valeur: _this.type });
                    }
                }
            });
        },
        getDates: function getDates() {
            var vm = this;
            return new Promise(function (resolve, reject) {
                axios.get('/api/qualitatifs/getDates', {
                    params: {
                        type: vm.type
                    }
                }).then(function (response) {
                    vm.dates = [];
                    for (var item in response.data) {
                        vm.dates.push(response.data[item]);
                    }
                    resolve();
                });
            });
        },
        getNappes: function getNappes() {
            var vm = this;
            this.message = this.type + ' de zaghouan';
            return new Promise(function (resolve, reject) {
                axios.get('/api/qualitatifs/getNappesWithType', {
                    params: {
                        type: vm.type
                    }
                }).then(function (response) {
                    vm.napes = response.data;
                    for (var item in response.data) {
                        vm.names[response.data[item]] = response.data[item];
                    }
                    resolve();
                });
            });
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        axios.post('/api/qualitatifs/getTypes').then(function (response) {
            _this2.types = response.data;
            _this2.type = response.data[0];
        });
    }
});

/***/ }),

/***/ 192:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(141);


/***/ })

/******/ });