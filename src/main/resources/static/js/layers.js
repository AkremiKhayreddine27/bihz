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
/******/ 	return __webpack_require__(__webpack_require__.s = 182);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Errors; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Errors = function () {
    function Errors() {
        _classCallCheck(this, Errors);

        this.errors = {};
    }

    _createClass(Errors, [{
        key: "record",
        value: function record(errors) {
            this.errors = {};
            for (var error in errors) {
                this.errors[errors[error].field] = errors[error].defaultMessage;
            }
        }
    }, {
        key: "has",
        value: function has(field) {
            return this.errors.hasOwnProperty(field);
        }
    }, {
        key: "any",
        value: function any() {
            return Object.keys(this.errors).length > 0;
        }
    }, {
        key: "get",
        value: function get(field) {
            if (this.errors[field]) {
                return this.errors[field];
            }
        }
    }, {
        key: "clear",
        value: function clear(field) {
            if (field) {
                delete this.errors[field];
                return;
            }
            this.errors = {};
        }
    }]);

    return Errors;
}();

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(2);

window.layers = new Vue({
    el: '#layers',
    data: {
        auth: {},
        layers: [],
        zone: {},
        form: new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* Form */]({
            model: {
                name: '',
                color: '#000000',
                stroke: '#000000',
                active: false
            }
        })
    },
    methods: {
        getAuth: function getAuth() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                axios.get('/auth').then(function (response) {
                    _this.auth = response.data;
                    var roles = [];
                    for (var role in _this.auth.roles) {
                        roles.push(_this.auth.roles[role].id);
                    }
                    for (var _role in _this.auth.roles) {
                        _this.auth.permissions = _this.auth.roles[_role].permissions;
                    }
                    _this.auth.roles = roles;
                    resolve();
                });
            });
        },
        hasPermission: function hasPermission(permission) {
            if (this.auth.permissions.hasOwnProperty(permission)) {
                return this.auth.permissions[permission];
            } else {
                return false;
            }
        },
        getLayers: function getLayers() {
            var _this2 = this;

            axios.post('/map/getAllCouches').then(function (response) {
                _this2.layers = response.data;
            });
        },
        deleteLayer: function deleteLayer(layerId) {
            axios.delete('/layers/' + layerId).then(function () {
                location.reload();
            });
        },
        addLayer: function addLayer() {
            this.uploadLayer().then(function () {});
        },
        uploadLayer: function uploadLayer() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.zone.processQueue();
                resolve();
            });
        },
        updateActive: function updateActive(layer) {
            var vm = this;
            axios.patch('/layers/' + layer.id, layer).then(function () {
                Event.$emit('alert', 'Votre modification a été enregistrer avec succé');
            });
        }
    },
    mounted: function mounted() {
        var _this4 = this;

        Dropzone.autoDiscover = false;
        this.zone = new Dropzone('#layersDropzone', {
            url: "/admin/shapeFiles/upload",
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 100,
            dictDefaultMessage: 'Déposez vos fichiers ici',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            init: function init() {
                // Set up any event handlers
                this.on('completemultiple', function () {
                    // Event.$emit('alert', 'Succé');
                    location.reload();
                });
            }
        });
        this.getAuth().then(function () {
            _this4.getLayers();
        });
    }
});

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(133);


/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Errors__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Form; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var Form = function () {
    function Form(data) {
        _classCallCheck(this, Form);

        this.model = {};
        this.originalData = data;
        for (var field in data.model) {
            this.model[field] = data.model[field];
        }
        this.errors = new __WEBPACK_IMPORTED_MODULE_0__Errors__["a" /* Errors */]();
    }

    _createClass(Form, [{
        key: 'reset',
        value: function reset() {
            for (var field in this.originalData.model) {
                this.model[field] = '';
            }
            this.errors.clear();
        }
    }, {
        key: 'data',
        value: function data() {
            var data = {};
            for (var property in this.model) {
                data[property] = this.model[property];
            }
            return data;
        }
    }, {
        key: 'submit',
        value: function submit(requestType, url) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                axios[requestType](url, _this.data()).then(function (response) {
                    _this.onSuccess(response.data);
                    resolve(response.data);
                }).catch(function (error) {
                    _this.onFail(error.response.data);
                    reject(error.response.data);
                });
            });
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess(response) {
            this.reset();
        }
    }, {
        key: 'post',
        value: function post(url) {
            return this.submit('post', url);
        }
    }, {
        key: 'delete',
        value: function _delete(url) {
            return this.submit('delete', url);
        }
    }, {
        key: 'patch',
        value: function patch(url) {
            return this.submit('patch', url);
        }
    }, {
        key: 'onFail',
        value: function onFail(errors) {
            this.errors.record(errors);
        }
    }]);

    return Form;
}();

/***/ })

/******/ });