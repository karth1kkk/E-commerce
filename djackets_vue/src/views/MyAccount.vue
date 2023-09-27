<template>
     <div class="page-my-account text-white">
        <div class="row">
            <div class="col-sm-12">
                <h1 class="title">My account</h1>
            </div>

            <div class="col-sm-12">
                <button @click="logout()" class="btn btn-danger">Log out</button>
            </div>
        </div>
     </div>       
</template>

<script>
import axios from 'axios'
export default{
    name: 'MyAccount',
    methods:{
        logout(){
            axios.defaults.headers.common["Authorization"]=""

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")

            this.$store.commit('removeToken')

            this.$router.push('/')
        }
    }
}
</script>