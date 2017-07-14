const posts = new Vue({
    el: "#posts",
    data: {
        posts: []
    },
    methods: {
        getPosts(){
            axios.get('/api/posts').then(response => {
                this.posts = response.data;
                for (let i in this.posts) {
                    this.posts[i].updated_at = moment(this.posts[i].updated_at).from(moment());
                }
            })
        },
        deletePost(id){
            axios.delete('/api/posts/' + id).then(response => {
                this.getPosts();
            })
        },
        findPost(id){
            for (let i in this.posts) {
                if (this.posts[i].id = id) {
                    return this.posts[i].id;
                }
            }
        },
        fbShare(id){
            let vm = this;
            var url = window.location.href;
            FB.ui({
                method: 'share',
                href: url+'/'+vm.findPost(id).id,
                title: vm.findPost(id).title,
                link: url,
                picture: 'http://www.groupstudy.in/img/logo3.jpeg',
                description: vm.findPost(id).description,
            }, function (response) {
            });
        }
    },
    mounted(){
        this.getPosts();
    }
})