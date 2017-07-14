require('./bootstrap');
$(document).ready(function () {
    var url = window.location;
    $('ul.nav a[href="' + url + '"]').parent().addClass('active');
    $('ul.nav a').filter(function () {
        return this.href == url;
    }).parent().addClass('active');
    $('ul.user-settings a[href="' + url + '"]').parent().addClass('active');
});
window.fbAsyncInit = function () {
    FB.init({
        appId: '400297800351679',
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
window.spectrum = require('spectrum-colorpicker');
window.toastr = require('toastr');
window.select2 = require('select2');
window.Dropzone = require("dropzone");
window.moment = require('moment');

window.moment.locale('fr');
Vue.component('layer-color', {
    props: ['color', 'layer', 'showinput'],
    template: '<input type="text" />',
    mounted(){
        let vm = this;
        $(this.$el).css("background-color", this.color);
        $(this.$el).css("color", "#FFFFFF");
        $(this.$el).val(this.color);
        $(this.$el).spectrum({
            color: this.color,
            showInput: vm.showinput,
            showAlpha: true,
            showInitial: true,
            preferredFormat: 'rgb',
            chooseText: "Choisir",
            cancelText: "Annuler",
            change: function (color) {
                $(vm.$el).val(color);
                $(vm.$el).css("background-color", color);
            },
            move: function (color) {
                $(vm.$el).css("background-color", color);
                $(vm.$el).val(color);
            },
            hide: function (color) {
                $(vm.$el).val(color);
                $(vm.$el).css("background-color", color);
                if (vm.layer.id) {
                    axios.patch('/layers/' + vm.layer.id, {
                        id: vm.layer.id,
                        stroke: vm.layer.stroke,
                        active: vm.layer.active,
                        name: vm.layer.name,
                        color: $(vm.$el).val()
                    }).then(() => {

                    });
                } else {
                    layers.form.model.color = $(vm.$el).val();
                }
            }
        });
        if (vm.showinput) {
            $(this.$el).css("display", "inline");
        }
        $(this.$el).css("box-shadow", "none");
        $(this.$el).css("outline", "none");
        $(this.$el).css("border", "0");
        $(this.$el).css("padding", "5px");
        $(this.$el).css("margin-right", "10px");
    },
});
Vue.component('layer-stroke', {
    props: ['stroke', 'layer', 'showinput'],
    template: '<input type="text" />',
    mounted(){
        let vm = this;
        $(this.$el).css("background-color", this.stroke);
        $(this.$el).css("color", "#FFFFFF");
        $(this.$el).val(this.stroke);
        $(this.$el).spectrum({
            color: this.stroke,
            showInput: vm.showinput,
            showAlpha: true,
            showInitial: true,
            preferredFormat: 'rgb',
            chooseText: "Choisir",
            cancelText: "Annuler",
            change: function (color) {
                $(vm.$el).val(color);
                $(vm.$el).css("background-color", color);
            },
            move: function (color) {
                $(vm.$el).css("background-color", color);
                $(vm.$el).val(color);
            },
            hide: function (color) {
                $(vm.$el).val(color);
                $(vm.$el).css("background-color", color);
                if (vm.layer.id) {
                    axios.patch('/layers/' + vm.layer.id, {
                        id: vm.layer.id,
                        active: vm.layer.active,
                        name: vm.layer.name,
                        color: vm.layer.color,
                        stroke: $(vm.$el).val()
                    }).then(() => {

                    });
                } else {
                    layers.form.model.stroke = $(vm.$el).val();
                }
            }
        });
        if (vm.showinput) {
            $(this.$el).css("display", "inline");
        }
        $(this.$el).css("box-shadow", "none");
        $(this.$el).css("outline", "none");
        $(this.$el).css("border", "0");
        $(this.$el).css("padding", "5px");
        $(this.$el).css("margin-right", "10px");
    },
});
(function ($) {
    $(document).ready(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 140) {
                $('.navbar-bottom').removeClass('navbar-bottom-light');
                $('.navbar-bottom').addClass('navbar-fixed-top navbar-bottom-black');
            } else {
                $('.navbar-bottom').removeClass('navbar-fixed-top  navbar-bottom-black');
                $('.navbar-bottom').addClass('navbar-bottom-light');
            }
        });
    });
}(jQuery));
Vue.component('select2', {
    props: ['options', 'value', 'multiple', 'change', 'type'],
    template: '<select ref="select" :multiple="multiple"><slot></slot></select>',
    mounted: function () {
        var vm = this;
        $(this.$el).val(this.value).select2({
            tags: true,
            data: this.options
        }).on('change', function () {
            vm.$emit('input', $(this).val());
            vm.$emit('search');
        })
    },
    watch: {
        value: function (value) {
            $(this.$el).val(value);
        },
        options: function (options) {
            let newOption = [];
            if (this.type === 'nappe') {
                newOption.push('Toutes');
            } else {
                newOption.push('Tous');
            }
            for (let item in options) {
                newOption.push(options[item]);
            }
            $(this.$el).select2('destroy').empty().select2({tags: true, data: newOption});
            if (this.change) {
                $(this.$el).val(newOption[1]).trigger('change');
            }
        }
    },
    destroyed: function () {
        $(this.$el).off().select2('destroy')
    }
});
const documentsSearch = new Vue({
    el: '#documentsSearch',
    data: {
        searchFor: '',
        results: []
    },
    methods: {
        search(){
            axios.post('/posts/search', {
                title: this.searchFor,
            }).then(response => {
                this.results = response.data;
                $("#mybutton").dropdown('toggle')
            });
        }
    }
});

window.Event = new Vue();
Vue.component('alert', {
    props: ['title', 'message', 'type'],
    template: '<div></div>',
    created(){
        toastr.options = {
            "timeOut": "5000",
            "extendedTimeOut": "5000",
            "showDuration": "300",
            "progressBar": true,
            "closeButton": true,
        }
    },
    mounted(){
        toastr[this.type](this.message);
    }
});

window.alerts = new Vue({
    el: '#alerts',
    data: {
        message: '',
        type: 'success',
        show: false
    },
    methods: {
        hide(){
            var vm = this;
            setTimeout(function () {
                vm.show = false;
            }, 5000);
        }
    },
    created(){
        Event.$on('alert', (message) => {
            this.show = true;
            this.message = message;
            var vm = this;
        })
    },
    watch: {
        show: function (value) {
            if (value) {
                this.hide();
            }
        },
    },
});

