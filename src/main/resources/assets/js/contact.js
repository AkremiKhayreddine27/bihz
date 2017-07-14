import {Form} from "./Form";
const contact = new Vue({
    el: '#contact',
    data: {
        form: new Form({
            model: {
                from_name: '',
                from_email: '',
                phone: '',
                content: ''
            }
        })
    },
    methods: {
        sendMessage(){
            this.form.post('/contact');
        }
    }
});