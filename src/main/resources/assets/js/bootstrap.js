window._ = require('lodash');

window.$ = window.jQuery = require('jquery');

require('bootstrap-sass');

window.Vue = require('vue');

window.axios = require('axios');
window.c3 = require('c3');

window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': window.Laravel.csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*'
};
