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
/******/ 	return __webpack_require__(__webpack_require__.s = 198);
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

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(2);

var users = new Vue({
    el: '#users',
    data: {
        auth: {},
        users: [],
        roles: [],
        editForm: new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* Form */]({
            model: {
                name: '',
                email: '',
                password: '',
                roles: []
            }
        }),
        form: new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* Form */]({
            model: {
                name: '',
                email: '',
                password: '',
                roles: []
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
                    _this.auth.roles = roles;
                    resolve();
                });
            });
        },
        getUsers: function getUsers() {
            var _this2 = this;

            axios.get('/api/users').then(function (response) {
                _this2.users = response.data;
                for (var user in _this2.users) {
                    var roles = [];
                    for (var role in _this2.users[user].roles) {
                        if (typeof _this2.users[user].roles[role].id != "undefined") {
                            roles.push(_this2.users[user].roles[role].id);
                        } else {
                            roles.push(_this2.users[user].roles[role]);
                        }
                    }
                    _this2.users[user].roles = roles;
                }
            });
        },
        getUser: function getUser(userId) {
            var _this3 = this;

            axios.get('/api/users/' + userId).then(function (response) {
                _this3.editForm.model = response.data;
                var roles = [];
                for (var role in _this3.editForm.model.roles) {
                    roles.push(_this3.editForm.model.roles[role].id);
                }
                _this3.editForm.model.roles = roles;
            });
        },
        getRoles: function getRoles() {
            var _this4 = this;

            axios.get('/api/roles').then(function (response) {
                _this4.roles = response.data;
            });
        },
        getRole: function getRole(id) {
            for (var i in this.roles) {
                if (this.roles[i].id == id) {
                    return this.roles[i];
                }
            }
        },
        addUser: function addUser() {
            var _this5 = this;

            for (var i in this.form.model.roles) {
                this.form.model.roles[i] = this.getRole(this.form.model.roles[i]);
            }
            this.form.post('/api/users').then(function (data) {
                $('#closeUserModal').click();
                _this5.getUsers();
            });
        },
        editUser: function editUser() {
            var _this6 = this;

            delete this.editForm.model["roles"];
            this.editForm.patch('/api/users/' + this.editForm.model.id).then(function (data) {
                $('#closeEditModal').click();
                _this6.getUsers();
            });
        },
        deleteUser: function deleteUser(userId) {
            var _this7 = this;

            axios.delete('/api/users/' + userId).then(function () {
                _this7.getUsers();
            });
        },
        assignRole: function assignRole(user, role) {
            var _this8 = this;

            axios.post('/api/users/' + user.id + '/assignRole', user.roles).then(function (response) {
                _this8.getUsers();
            });
        }
    },
    mounted: function mounted() {
        var _this9 = this;

        this.getAuth().then(function () {
            _this9.getUsers();
            _this9.getRoles();
        });
    }
});

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(147);


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