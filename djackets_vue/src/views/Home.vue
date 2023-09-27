<script>
import axios from 'axios'
import ProductBox from '../components/ProductBox.vue'
  export default {
    name: 'Home',
    data() {
      return{
        latestProducts:[]
      }
    },
    components: {
      ProductBox
    },
    mounted(){
      this.getLatestProducts()

      document.title = 'Home | Djackets'
    },
    methods:{
      async getLatestProducts(){
        this.$store.commit('setIsLoading', true)

        await axios
        .get('/api/v1/latest-products/')
        .then(response =>{
          this.latestProducts= response.data
        })
        .catch(error => {
          console.log(error)
        })

        this.$store.commit('setIsLoading', false)
      }
    }
  }

</script>
<template>
  <div class="home text-white">
    <section class="my-5">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 class="display-4 text-center mt-5">
              Welcome to DJackets
            </h1>
            <p class="lead text-center">
              The best jacket store online
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="my-5">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h2 class="mb-4 text-center">
              Latest Products
            </h2>
          </div>
        </div>
        
        <div class="row">
          <div class="col-sm-6 col-md-4 col-lg-5" v-for="product in latestProducts" :key="product.id">
            <div class="card mb-4">
              <img class="card-img-top" :src="product.get_thumbnail" alt="Product Image">
              <div class="card-body">
                <h3 class="card-title">{{ product.name }}</h3>
                <p class="card-text">RM{{ product.price }}</p>
                <router-link :to="product.get_absolute_url" class="btn btn-primary btn-block">View details</router-link>
              </div>
            </div>
          </div>
        </div>
        <ProductBox style="display: none;"
        v-for="product in latestProducts"
        v-bind:key="product.id"
        v-bind:product="product"/>
      </div>
    </section>
  </div>
</template>
