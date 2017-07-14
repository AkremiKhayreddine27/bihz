import {Form} from "./Form";
const users = new Vue({
    el: '#users',
    data: {
        auth: {},
        users: [],
        roles: [],
        editForm: new Form({
            model: {
                name: '',
                email: '',
                password: '',
                roles: []
            }
        }),
        form: new Form({
            model: {
                name: '',
                email: '',
                password: '',
                roles: []
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
                    _this.auth.roles = roles;
                    resolve();
                });
            });
        },
        getUsers(){
            axios.get('/api/users').then(response => {
                this.users = response.data;
                for (let user in this.users) {
                    let roles = [];
                    for (let role in this.users[user].roles) {
                        if (typeof this.users[user].roles[role].id != "undefined") {
                            roles.push(this.users[user].roles[role].id);
                        } else {
                            roles.push(this.users[user].roles[role]);
                        }

                    }
                    this.users[user].roles = roles;
                }
            });
        },
        getUser(userId){
            axios.get('/api/users/' + userId).then(response => {
                this.editForm.model = response.data;
                let roles = [];
                for (let role in this.editForm.model.roles) {
                    roles.push(this.editForm.model.roles[role].id)
                }
                this.editForm.model.roles = roles;
            });
        },
        getRoles(){
            axios.get('/api/roles').then(response => {
                this.roles = response.data;
            });
        },
        getRole(id){
            for (let i in this.roles) {
                if (this.roles[i].id == id) {
                    return this.roles[i];
                }
            }
        },
        addUser(){
            for (let i in this.form.model.roles) {
                this.form.model.roles[i] = this.getRole(this.form.model.roles[i]);
            }
            this.form.post('/api/users').then(data => {
                $('#closeUserModal').click();
                this.getUsers();
            });
        },
        editUser(){
            delete this.editForm.model["roles"];
            this.editForm.patch('/api/users/' + this.editForm.model.id).then(data => {
                $('#closeEditModal').click();
                this.getUsers();
            });
        },
        deleteUser(userId){
            axios.delete('/api/users/' + userId).then(() => {
                this.getUsers();
            });
        },
        assignRole(user, role){
            axios.post('/api/users/' + user.id + '/assignRole', user.roles).then(response => {
                this.getUsers();
            });
        }
    },
    mounted()
    {
        this.getAuth().then(() => {
            this.getUsers();
            this.getRoles();
        });
    }
});