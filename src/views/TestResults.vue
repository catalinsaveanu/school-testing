<template>
  <v-flex>
    <v-card>
      <v-card-title>Rezultatele testelor</v-card-title>
      <v-data-table :headers="headers" :items="tests" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.progress }}</td>
          <td class="text-xs-left">{{ props.item.grade }}</td>
        </template>
        <template slot="no-data">Inca nici un elev nu a inceput acest test.</template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Cautarea dupa "{{ search }}" nu a returnat nici un rezultat.</v-alert>
      </v-data-table>
      <v-card-actions class="login-btns-container">
        <v-btn color="primary" @click="goBack" round>
          <v-icon dark left>arrow_back</v-icon>Inapoi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import router from './../router/';

export default {
  name: 'TestResults',
  mounted() {
    this.$store.dispatch('getUsersTestResults', this.$route.params.id);
  },
  data() {
    return {
      text: '',
      search: '',
      headers: this.getHeaders()
    };
  },
  computed: {
    tests() {
      return this.$store.state.usersTestResults;
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    getHeaders() {
      let headers = [
        { text: 'Elev', value: 'name' },
        { text: 'Progres', value: 'progress' },
        { text: 'Punctaj', value: 'grade' }
      ];

      return headers;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
</style>
