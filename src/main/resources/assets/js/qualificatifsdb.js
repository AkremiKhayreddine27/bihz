import {Form} from "./Form";
const qualitatifsdb = new Vue({
    el: '#qualitatifsdb',
    data: {
        qualitatifs: [],
        qualitatifsform: new Form({
            model: {
                nappe: '',
                date: '',
                type: '',
                valeur: ''
            },
        }),
        addNewqualitatif: false,
    },
    methods: {
        saveNewQualitatif(){
            this.qualitatifsform.post('/qualitatifs').then(response => {
                this.getqualitatifs();
            }).catch(error=>{
            });
        },
        deleteQualitatif(id){
            this.qualitatifsform.delete('/qualitatifs/' + id).then(response=> {
                this.getqualitatifs();
            });
        },
        getqualitatifs(){
            axios.get('/api/qualitatifs').then(response => {
                this.qualitatifs = response.data;
                this.addNewqualitatif = false;
            });
        }
    },
    mounted(){
        this.getqualitatifs();
    }
});