window.messages = new Vue({
    el: "#messages",
    data: {
        messages: []
    },
    methods: {
        getMessages(){
            axios.get('/api/messages').then(response => {
                this.messages = response.data;
            })
        }
    },
    mounted(){
        this.getMessages();
    }
})