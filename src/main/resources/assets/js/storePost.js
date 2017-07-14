import {Form} from "./Form";
const post = new Vue({
    el: '#post',
    data: {
        zone: {},
        post: {
            id: 0
        },
        form: new Form({
            model: {
                title: '',
                description: ''
            }
        }),
    },
    methods: {
        create(){
            this.form.post('/posts').then(data => {
                this.post.id = data.id;
                this.zone.options.url = "/posts/" + this.post.id + "/upload";
                this.zone.processQueue();
            });
        }
    },
    mounted(){
        let vm = this;
        Dropzone.autoDiscover = false;
        this.zone = new Dropzone('#dzone', {
            url: "/posts/" + vm.post.id + "/upload",
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 100,
            dictDefaultMessage: 'Déposez vos fichiers ici',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            init: function () {
                this.on("queuecomplete", function (file) {
                    window.location.pathname = "/posts/"+vm.post.id;
                });
            }
        });
    }
});