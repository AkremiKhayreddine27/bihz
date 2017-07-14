const {mix} = require('laravel-mix');

mix.js('src/main/resources/assets/js/app.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/statistics.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/qualitatifs.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/statisticsdb.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/qualificatifsdb.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/users.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/main.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/posts.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/storePost.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/showPost.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/editPost.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/sidebar.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/contact.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/messages.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/layers.js', 'src/main/resources/static/js')
    .js('src/main/resources/assets/js/geoserver.js', 'src/main/resources/static/js')
    .sass('src/main/resources/assets/sass/app.scss', 'src/main/resources/static/css');
mix.styles([
    'src/main/resources/static/css/app.css',
    'node_modules/c3/c3.css',
    'node_modules/select2/dist/css/select2.css',
    'src/main/resources/static/css/font-awesome.css',
    'node_modules/dropzone/dist/dropzone.css',
    'node_modules/spectrum-colorpicker/spectrum.css',
    'node_modules/toastr/build/toastr.css',
], 'src/main/resources/static/css/all.css');
