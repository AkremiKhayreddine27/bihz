import {Form} from "./Form";
const editPost = new Vue({
    el: "#editPost",
    data: {
        zone: {},
        post: {},
        form: new Form({
            model: {}
        })

    },
    methods: {
        getPost(){
            var url = window.location.pathname;
            axios.get('/api' + url).then(response => {
                this.post = response.data;
                this.form.model = this.post;
            })
        },
        update(){
            this.form.patch('/posts/' + this.post.id).then(data => {
                this.post.id = data.id;
                this.zone.options.url = "/posts/" + this.post.id + "/upload";
                this.zone.processQueue();
                Event.$emit('alert','Votre modification a été enregistrer avec succé');
            });
        }
    }
    ,
    mounted()
    {
        this.getPost();
        let vm = this;
        Dropzone.autoDiscover = false;
        this.zone = new Dropzone('#dzone', {
            url: "/posts/" + vm.post.id + "/upload",
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 100,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            init: function () {
                this.on("queuecomplete", function (file) {
                    window.location.pathname = "/posts/" + vm.post.id;
                });
            }
        });
    }
})