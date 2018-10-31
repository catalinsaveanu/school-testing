<template>
  <div id="app">
    <v-app>
      <v-content>
      <v-snackbar
        v-model="showAlert"
        :color="alertColor"
        :multi-line="false"
        :timeout="0"
        :vertical="true"
      >
        {{ alertMessage }}
        <v-btn
          dark
          flat
          @click="closeAlert"
        >
          Inchide
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
export default {
  name: 'app',
  computed: {
    showAlert() {
      return this.$store.getters.getAlert.show;
    },
    alertColor() {
      return this.$store.getters.getAlert.color;
    },
    alertMessage() {
      return this.$store.getters.getAlert.message;
    }
  },
  methods: {
    closeAlert() {
      this.$store.dispatch('updateAlert', { show: false });
    }
  }
};
</script>

