<template>
    <tr>
        <td><router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link></td>
        <td>RM{{ item.product.price }}</td>
        <td>
            {{ item.quantity }}
            <a class="poin" @click="decrementQuantity(item)">-</a>
            <a class="poin" @click="incrementQuantity(item)">+</a>
        </td>
        <td>RM{{ getItemTotal(item).toFixed(2) }}</td>
        <td><button class="btn btn-danger m-2" @click="removeFromCart(item)">X</button></td>
    </tr>
</template>

<script>
export default{
    name: 'CartItem',
    props:{
        initialItem: Object
    },
    data(){
        return{
            item: this.initialItem
        }
    },
    methods:{
        getItemTotal(item){
            return item.quantity * item.product.price
        },
        decrementQuantity(item){
            item.quantity -= 1

            if (item.quantity === 0){
                this.$emit('removeFromCart',item)
            }

            this.updateCart()
        },
        incrementQuantity(item){
            item.quantity += 1

            this.updateCart()
        },
        updateCart(){
            localStorage.setItem('cart',JSON.stringify(this.$store.state.cart))
        },
        removeFromCart(item){
            this.$emit('removeFromCart', item)

            this.updateCart()
        }
    }
}
</script>

<style>
.poin{
    cursor: pointer;
}
</style>