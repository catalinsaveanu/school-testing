<template>
  <div id="app">
    <v-app>
      <v-toolbar v-if="user.name">
        <v-btn color="primary" @click="logout" dark round>
          Deconectare
          <v-icon right>last_page</v-icon>
        </v-btn>

        <v-toolbar-title class="white--text">Title</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-chip color="indigo" text-color="white">
          <v-avatar>
            <v-icon>account_circle</v-icon>
          </v-avatar>
          {{user.name}}
        </v-chip>
      </v-toolbar>
      <v-content>
        <v-snackbar
          v-model="alert.show"
          :color="alert.color"
          :multi-line="false"
          :timeout="4000"
          :vertical="false"
        >
          {{ alert.message }}
          <v-btn small fab dark flat @click.native="closeAlert">
            <v-icon dark>cancel</v-icon>
          </v-btn>
        </v-snackbar>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <router-view></router-view>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  name: 'app',
  computed: {
    ...mapState(['alert', 'user'])
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: this.$router.path });
        });
    },
    closeAlert() {
      this.$store.dispatch('updateAlert', { show: false });
    }
  }
};
</script>

