<template>
  <div id="app">
    <v-app>
      <v-content>
        <v-snackbar
          v-model="alert.show"
          :color="alert.color"
          :multi-line="false"
          :timeout="4000"
          :vertical="false"
        >
          {{ alert.message }}
          <v-btn dark flat @click.native="closeAlert">Inchide</v-btn>
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

export default {
  name: 'app',
  computed: {
    ...mapState(['alert'])
  },
  methods: {
    closeAlert() {
      this.$store.dispatch('updateAlert', { show: false });
    }
  }
};
</script>

