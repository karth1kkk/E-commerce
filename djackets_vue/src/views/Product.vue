<template>
    <div class="page-product">
        <div class="row">
            <div class="col-sm-9">
                <figure class="mb-6">
                    <img class="pic rounded-circle" v-bind:src="product.get_image">
                </figure>

                <h1 class="title text-white">{{ product.name }}</h1>

                <p class="text-white">{{ product.description }}</p>
            </div>

            <div class="col-sm-3">
                <h2 class="subtitle text-white">
                    Information
                </h2>

                <p class="text-white"><strong>Price:</strong>RM{{ product.price }}</p>

                <div class="mt-6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>

                    <div class="control">
                        <button class="mt-4" @click="addToCart()">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.11/+esm';
import axios from 'axios'
export default{
    name:'Product',
    data(){
        return{
            product:{},
            quantity:1
        }
    },
    mounted()
    {
        this.getProduct()
    },
    methods:{
        async getProduct(){
            this.$store.commit('setIsLoading', true)

            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug

        await axios.get(`/api/v1/products/${category_slug}/${product_slug}`)
            .then(response =>{
                this.product = response.data

                document.title = this.product.name + '| Djackets'
            })
            .catch(error =>{
                console.log(error)
            })

            this.$store.commit('setIsLoading',false)
        },
        addToCart(){
            if (isNaN(this.quantity)|| this.quantity < 1){
                this.quantity = 1
            }

            const item = {
                product: this.product,
                quantity: this.quantity
            }
            this.$store.commit('addToCart',item)

            toast.success('The product was added to the cart')
        }
    }
}
</script>

<style>
.pic{
    width:50%;
}
</style>