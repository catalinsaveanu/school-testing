<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip right>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <div>{{ userName.name }}</div>
      </v-card-text>
      <v-card-actions class="login-btns-container">
        <v-btn color="primary" @click="logout">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'UserDashboard',
  data() {
    return {
      text: ''
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login');
      });
    }
  }
};
</script>

<style scoped>
</style>
