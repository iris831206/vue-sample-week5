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
            tempProduct: {},
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
            //取得產品列表
            const url = `${apiUrl}/api/${apiPath}/products`;
            axios.get(url).then((response) => {
                this.products = response.data.products;
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        openModal(product) {
            //查看商品詳細
            this.loadingStatus.loadingItem = '';
            this.tempProduct = product;
            this.$refs.userProductModal.qty = 1;
            this.$refs.userProductModal.openModal();
        },
        addToCart(id, qty = 1) {
            //加入購物車
            this.loadingStatus.loadingItem = id;
            //帶入訂單資訊
            const cart = {
                product_id: id,
                qty,
            };
            const url = `${apiUrl}/api/${apiPath}/cart`;
            this.$refs.userProductModal.hideModal();
            axios.post(url, { data: cart }).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart(); //重新渲染購物車列表
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        updateCart(data) {
            this.loadingStatus.loadingItem = data.id;
            const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
            //帶入訂單資訊
            const cart = {
                product_id: data.product_id,
                qty: data.qty,
            };
            axios.put(url, { data: cart }).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart(); //重新渲染購物車列表
            }).catch((err) => {
                alert(err.response.data.message);
                this.loadingStatus.loadingItem = '';
            });
        },
        deleteAllCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url).then((response) => {
                alert(response.data.message);
                this.getCart(); //重新渲染購物車列表
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
                this.getCart(); //重新渲染購物車列表
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form; //宣告變數存放API需要的表單資料
            axios.post(url, { data: order }).then((response) => {
                alert(response.data.message);
                this.$refs.form.resetForm(); //清空表單欄位的內容
                this.getCart(); //重新渲染購物車列表
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