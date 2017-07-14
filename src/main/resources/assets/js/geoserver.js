import {Form} from "./Form";
const geoserver = new Vue({
    el: "#geoserver",
    data: {
        form: new Form({
            model: {
                url: '',
                workspace: '',
                featureNs: '',
                srcName: '',
                layers_primary_key: ''
            }
        })
    },
    methods: {
        getConfig(){
            axios.get('/admin/geoserver').then(response => {
                this.form.model = response.data;
            });
        },
        configure(){
            this.form.post('/admin/geoserver').then(response => {
                this.form.model = response;
                Event.$emit('alert','Votre modification a été enregistrer avec succé');
            });
        }
    },
    mounted(){
        this.getConfig();
    }
});