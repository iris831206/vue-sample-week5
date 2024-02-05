import userProductModal from './userProductModal.js';

// VeeValidate 定義規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// VeeValidate 加入多國語系
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json'); // 讀取外部的資源
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'iris831206';

const app = Vue.createApp({
    data() {
        return {
            loadingStatus: {
                loadingItem: '',
            },
            products: [],
            product: {},
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            cart: {},
        };
    },
    methods: {
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products`;
            axios.get(url).then((response) => {
                this.products = response.data.products;
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        getProduct(id) {
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.get(url).then((response) => {
                this.loadingStatus.loadingItem = '';
                this.product = response.data.product;
                this.$refs.userProductModal.openModal();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        addToCart(id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            };

            this.$refs.userProductModal.hideModal();
            axios.post(url, { data: cart }).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        updateCart(data) {
            this.loadingStatus.loadingItem = data.id;
            const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
            const cart = {
                product_id: data.product_id,
                qty: data.qty,
            };
            axios.put(url, { data: cart }).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
                this.loadingStatus.loadingItem = '';
            });
        },
        deleteAllCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url).then((response) => {
                alert(response.data.message);
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url).then((response) => {
                this.cart = response.data.data;
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        removeCartItem(id) {
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.delete(url).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
                alert(response.data.message);
                this.$refs.form.resetForm();
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('userProductModal', userProductModal)
app.mount('#app');