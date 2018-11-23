import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify';
import firebase from 'firebase/app';
import 'firebase/auth';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import theme from './theme';

import './firebase/firebaseInit';
import App from './App.vue';
import router from './router/';
import store from './store/';

Vue.config.productionTip = false;
Vue.use(Vuetify, { theme });
Vue.use(Vuelidate);

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      store,
      render: (h) => h(App)
    }).$mount('#app');
  }
});
