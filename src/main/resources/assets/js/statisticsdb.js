import {Form} from "./Form";
const statisticsdb = new Vue({
    el: '#statisticsdb',
    data: {
        statistics: [],
        statisticsform: new Form({
            model: {
                nappe: '',
                date: '',
                type: '',
                valeur: ''
            },
        }),
        addNewStatistic: false,
    },
    methods: {
        saveNewStatistic(){
            this.statisticsform.post('/statistics').then(response => {
                this.getStatistics();
            }).catch(error=>{
            });
        },
        deleteStatistic(id){
            this.statisticsform.delete('/statistics/' + id).then(response=> {
                this.getStatistics();
            });
        },
        getStatistics(){
            axios.get('/api/statistics').then(response => {
                this.statistics = response.data;
                this.addNewStatistic = false;
            });
        }
    },
    mounted(){
        this.getStatistics();
    }
});