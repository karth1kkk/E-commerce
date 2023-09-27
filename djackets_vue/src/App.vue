<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
  <div class="container-fluid ">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="/"><strong> Djackets</strong></a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav me-auto mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" href="/summer">Summer</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/winter">Winter</a>
        </li>
        <form class="d-flex" role="search" method="get" action="/search">
        <input class="form-control me-2" type="text" placeholder="Search" aria-label="Search" name="query">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      </ul>
      <a v-if="$store.state.isAuthenticated" class="btn btn-outline-success" href="/my-account">My account</a>
      <a v-else class="btn btn-outline-success" href="/log-in">Log in</a>
      <a class="btn btn-outline-success" href="/cart"><i class="fas fa-shopping-cart"></i><span>Cart ({{ cartTotalLength }})</span></a>
    </div>
  </div>
</nav>

  <div class="is-loading-bar" v-bind:class="{'is-loading': $store.state.isLoading}">
    <div class="lds-dual-ring"></div>
  </div>

<section class="section">
  <RouterView/>
</section>

    <footer class="footer">
      <p class="has-text-centered text-white">Copyright (c) 2023</p>
    </footer>
</template>

<style>
*{
  padding: 0px;
}

body{
    background-color: rgb(39, 39, 39);
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ccc;
  border-color: #ccc transparent #ccc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.is-loading-bar {
  height: 0;
  overflow: hidden;

  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  &.is-loading {
    height: 80px;
  }
}
</style>

<script>
import axios from 'axios'
  export default {
    data() {
      return{
        showMobileMenu: false,
        cart:{
          items:[]
        }
      }
    },
    beforeCreate(){
      this.$store.commit('initializeStore')

      const token = this.$store.state.token

      if(token){
        axios.defaults.headers.common['Authorization'] ="Token " + token
      }else {
        axios.defaults.headers.common['Authorization'] = ""
      }

    },
    mounted(){
      this.cart = this.$store.state.cart
    },
    computed:{
      cartTotalLength(){
        let totalLength = 0

        for (let i=0; i < this.cart.items.length; i++ ){
          totalLength += this.cart.items[i].quantity
        }
        return totalLength
      }
    }
  }
</script>
