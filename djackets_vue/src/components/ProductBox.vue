<template>
    <div class="col-md-3">
                <div class="box">
                    <figure class="image mb-4">
                        <img v-bind:src="product.get_thumbnail">
                    </figure>

                    <h3 class="display-4">{{ product.name }}</h3>
                    <p class="display-6 text-grey">RM{{ product.price }}</p>

                    <router-link v-bind:to="product.get_absolute_url" class="btn btn-dark mt-4">View Details</router-link>
                </div>
            </div>
</template>

<script>
export default{
    name:'ProductBox',
    props:{
            product:Object
        }
    }
</script>