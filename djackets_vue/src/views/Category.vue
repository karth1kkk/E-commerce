<template>
    <div class="page-category text-white">
        <div class="row">
            <div class="col-md-12">
                <h2>{{ category.name }}</h2>                                
            </div>

            <ProductBox
        v-for="product in category.products"
        v-bind:key="product.id"
        v-bind:product="product"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ProductBox from '../components/ProductBox.vue';
import { toast } from 'https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.11/+esm';
export default  {
    name:'Category',
    components:{
        ProductBox
    },
    data(){
        return {
            category:{
                products: []
            }
        }
    },
    mounted(){
        this.getCategory()
    },
    watch:{
        $route(to, from){
            if(to.name === 'Category'){
                this.getCategory()
            }
        }
    },
    methods:{
        async getCategory(){
            const categorySlug = this.$route.params.category_slug

            this.$store.commit('setIsLoading', true)

            axios
            .get(`/api/v1/products/${categorySlug}/`)
            .then(response =>{
               this.category = response.data 

               document.title = this.category.name + ' | Djackets'
            })
            .catch(error => {
                console.log(error)

                toast.error('Something went wrong')
            })

            this.$store.commit('setIsLoading', false)
        }
    }
}
</script>