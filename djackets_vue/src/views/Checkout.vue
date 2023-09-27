<template>
    <div class="page-checkout bg-success">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <h1 class="title text-white">Checkout</h1>
            
            <table class="table table-striped bg-white">
              <thead>
                <tr class="text-success">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody class="text-success">
                <tr v-for="item in cart.items" :key="item.product.id">
                  <td>{{ item.product.name }}</td>
                  <td>{{ item.product.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ getItemTotal(item).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="text-success">
                  <td colspan="2">Total</td>
                  <td>{{ cartTotalLength }}</td>
                  <td>RM{{ cartTotalPrice.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
  
          <div class="col-md-4">
            <div class="shipping-details">
              <h2 class="subtitle">Shipping Details</h2>
              <p class="text-grey mb-4">All fields are required</p>
  
              <!-- Form fields for first name, last name, email, phone, address, zipcode, place -->
              <!-- Add appropriate classes and labels for styling -->
  
              <div class="form-group">
                <label for="first_name">First Name</label>
                <input type="text" class="form-control" v-model="first_name" id="first_name">
              </div>
              
              <div class="form-group">
                <label for="last_name">Last Name</label>
                <input type="text" class="form-control" v-model="last_name" id="last_name">
              </div>
  
              <div class="form-group">
                <label for="email">E-mail*</label>
                <input type="email" class="form-control" v-model="email" id="email">
              </div>
  
              <div class="form-group">
                <label for="phone">Phone*</label>
                <input type="text" class="form-control" v-model="phone" id="phone">
              </div>
  
              <div class="form-group">
                <label for="address">Address*</label>
                <input type="text" class="form-control" v-model="address" id="address">
              </div>
  
              <div class="form-group">
                <label for="zipcode">Zip Code*</label>
                <input type="text" class="form-control" v-model="zipcode" id="zipcode">
              </div>
  
              <div class="form-group">
                <label for="place">Place*</label>
                <input type="text" class="form-control" v-model="place" id="place">
              </div>

            </div>
            <div class="notification is-danger mt-4" v-if="errors.length">
                <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
              </div>

              <hr>

              <div id="card-element" class="op mb-5"></div>

              <template v-if="cartTotalLength">
                <hr>

                <button class="btn btn-dark" @click="submitForm">Pay with Stripe</button>

              </template> 
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: 'Checkout',
    data() {
      return {
        cart: {
          items: []
        },
        stripe:{},
        card: {},
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        zipcode: '',
        place: '',
        errors:[]
      };
    },
    mounted() {
      document.title = 'Checkout | Djackets';
  
      this.cart = this.$store.state.cart;

      if (this.cartTotalLength > 0){
        this.stripe = Stripe('pk_test_51NswIPI1E7kaYH6yeRpUU8mvNJNGJSDQIH9xqCr5nSk5SJH1uc5FOkjVUu21KFdjCHvYeuXZd2NA4idI2w28nwT9007oDoiM7E')
        const elements = this.stripe.elements();
        this.card = elements.create('card', {hidePostalCode: true})

        this.card.mount('#card-element')
      }
    },
    methods: {
      getItemTotal(item) {
        return item.quantity * item.product.price;
      },
      submitForm(){
        this.errors = []

        if (this.first_name === ''){
            this.errors.push('The first name field is missing!')
        }

        if(this.last_name === ''){
            this.errors.push('The last name field is missing!')
        }

        if(this.email === ''){
            this.errors.push('The email field is missing!')
        }

        if(this.phone === ''){
            this.errors.push('The phone field is missing')
        }

        if(this.address === ''){
            this.errors.push('The address field is missing!')
        }

        if (this.zipcode === '') {
            this.errors.push('The zip code field is missing!')
        }

        if (this.place === '') {
            this.errors.push('The place field is missing!')
        }

        if (!this.errors.length){
            this.$store.commit('setIsLoading', true)

            this.stripe.createToken(this.card).then(result => {
                if (result.error){
                    this.$store.commit('setIsLoading', false)

                    this.errors.push('Something went wrong with Stripe. Please try again')
                    console.log(result.error.message)
                }else{
                    this.stripeTokenHandler(result.token)
                }
            })       
        }
      },
    async stripeTokenHandler(token){
        const items =[]

        for (let i =0; i < this.cart.items.length; i++){
            const item = this.cart.items[i]
            const obj = {
                product: item.product.id,
                quantity: item.quantity,
                price: item.product.price * item.quantity
            }

            items.push(obj)
        }

        const data = {
                'first_name': this.first_name,
                'last_name': this.last_name,
                'email': this.email,
                'address': this.address,
                'zipcode': this.zipcode,
                'place': this.place,
                'phone': this.phone,
                'items': items,
                'stripe_token': token.id
            }

            await axios
            .post('/api/v1/checkout/', data)
            .then(response =>{
                this.$store.commit('clearCart')
                this.$router.push('/cart/success')
            })
            .catch(error =>{
                this.errors.push('Something went wrong. Please try again')

                console.log(error)
            })

            this.$store.commit('setIsLoading', false)
        }
    },
    computed: {
      cartTotalPrice() {
        return this.cart.items.reduce((acc, curVal) => {
          return acc += curVal.product.price * curVal.quantity;
        }, 0);
      },
      cartTotalLength() {
        return this.cart.items.reduce((acc, curVal) => {
          return acc += curVal.quantity
        }, 0);
      }
    }
  };
  </script>
  
  <style>
  /* Add any custom styling for this component here *

  /* Additional styling for specific elements if needed */
  </style>
  