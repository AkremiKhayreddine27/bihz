import {Form} from "./Form";
window.layers = new Vue({
    el: '#layers',
    data: {
        auth: {},
        layers: [],
        zone: {},
        form: new Form({
            model: {
                name: '',
                color: '#000000',
                stroke: '#000000',
                active: false
            }
        })
    },
    methods: {
        getAuth(){
            let _this = this;
            return new Promise(function (resolve, reject) {
                axios.get('/auth').then(response => {
                    _this.auth = response.data;
                    let roles = [];
                    for (let role in _this.auth.roles) {
                        roles.push(_this.auth.roles[role].id)
                    }
                    for (let role in _this.auth.roles) {
                        _this.auth.permissions = _this.auth.roles[role].permissions;
                    }
                    _this.auth.roles = roles;
                    resolve();
                });
            });
        },
        hasPermission(permission){
            if (this.auth.permissions.hasOwnProperty(permission)) {
                return this.auth.permissions[permission];
            } else {
                return false;
            }
        },
        getLayers(){
            axios.post('/map/getAllCouches').then(response => {
                this.layers = response.data;
            });
        },
        deleteLayer(layerId){
            axios.delete('/layers/' + layerId).then(() => {
                location.reload();
            });
        },
        addLayer(){
            this.uploadLayer().then(() => {

            });
        },
        uploadLayer(){
            return new Promise((resolve, reject) => {
                this.zone.processQueue();
                resolve();
            });
        },
        updateActive(layer){
            let vm = this;
            axios.patch('/layers/' + layer.id, layer).then(() => {
                Event.$emit('alert', 'Votre modification a été enregistrer avec succé');
            });
        }
    },
    mounted()
    {
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
            init: function () {
                // Set up any event handlers
                this.on('completemultiple', function () {
                    // Event.$emit('alert', 'Succé');
                    location.reload();
                });
            }
        });
        this.getAuth().then(() => {
            this.getLayers();
        });
    }
})
;