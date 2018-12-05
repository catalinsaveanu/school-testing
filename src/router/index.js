import Vue from 'vue';
import Router from 'vue-router';

import UserDashboard from '@/views/UserDashboard.vue';
import Test from '@/views/Test.vue';
import TakeTest from '@/views/TakeTest.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserSignUp from '@/views/UserSignUp.vue';

import firebase from 'firebase/app';
import store from '@/store/index.js';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: UserLogin
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: UserSignUp
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: UserDashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test/:id?',
      name: 'Test',
      component: Test,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/taketest/:id',
      name: 'TakeTest',
      component: TakeTest,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const { currentUser } = firebase.auth(),
    // eslint-disable-next-line
    requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  debugger;
  if (requiresAuth && !currentUser) {
    next('login');
  } else if (!requiresAuth && currentUser) {
    next('dashboard');
  } else {
    if (
      !store.getters.getUser.name &&
      to.fullPath !== '/login' &&
      to.fullPath !== 'sign-up'
    ) {
      const db = firebase.firestore();

      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          store.dispatch('setUser', {
            id: currentUser.uid,
            ...doc.data()
          });
          store.dispatch('loadTests');
          next();
        });
    } else {
      next();
    }
  }
});

export default router;
