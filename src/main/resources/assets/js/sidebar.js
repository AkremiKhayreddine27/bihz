const sidebar = new Vue({
    el: "#sidebar",
    data: {
        latests: []
    },
    methods: {
        getLatests(){
            axios.get("/api/posts/latests").then(response => {
                this.latests = response.data;
                for (let i in this.latests) {
                    this.latests[i].updated_at = moment(this.latests[i].updated_at).from(moment());
                }
            })
        }
    },
    mounted(){
        this.getLatests();
    }
})