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
/******/ 	return __webpack_require__(__webpack_require__.s = 190);
/******/ })
/************************************************************************/
/******/ ({

/***/ 139:
/***/ (function(module, exports) {

var posts = new Vue({
    el: "#posts",
    data: {
        posts: []
    },
    methods: {
        getPosts: function getPosts() {
            var _this = this;

            axios.get('/api/posts').then(function (response) {
                _this.posts = response.data;
                for (var i in _this.posts) {
                    _this.posts[i].updated_at = moment(_this.posts[i].updated_at).from(moment());
                }
            });
        },
        deletePost: function deletePost(id) {
            var _this2 = this;

            axios.delete('/api/posts/' + id).then(function (response) {
                _this2.getPosts();
            });
        },
        findPost: function findPost(id) {
            for (var i in this.posts) {
                if (this.posts[i].id = id) {
                    return this.posts[i].id;
                }
            }
        },
        fbShare: function fbShare(id) {
            var vm = this;
            var url = window.location.href;
            FB.ui({
                method: 'share',
                href: url + '/' + vm.findPost(id).id,
                title: vm.findPost(id).title,
                link: url,
                picture: 'http://www.groupstudy.in/img/logo3.jpeg',
                description: vm.findPost(id).description
            }, function (response) {});
        }
    },
    mounted: function mounted() {
        this.getPosts();
    }
});

/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(139);


/***/ })

/******/ });