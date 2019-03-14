<template>
  <v-layout row wrap fill-height align-center justify-center>
    <v-flex md4 v-for="test in tests" :key="test.id">
      <v-card width="300px">
        <v-img :src="images.math1" width="300px" height="200px">
          <div class="headline subject-text" v-text="test.subject"></div>
        </v-img>

        <v-card-actions>
          <v-progress-circular
            :size="43"
            :width="6"
            :value="test.grade"
            color="brown"
          >{{ test.grade / 10 }}</v-progress-circular>
          <v-progress-circular
            class="ml-1"
            :size="43"
            :width="6"
            :value="test.progress"
            color="deep-orange lighten-2"
          >{{ test.progress }}%</v-progress-circular>
          <v-spacer></v-spacer>
          <v-btn fab depressed dark small color="success" @click="takeTest(test)">
            <v-icon dark>input</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import router from './../router/';

export default {
  name: 'StudentDashboard',
  data() {
    return {
      text: '',
      search: '',
      headers: this.getHeaders(),
      images: {
        math1: require('./../assets/math2.jpg')
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    tests() {
      return this.$store.getters.getTests;
    },
    noDataMessage() {
      return this.$store.getters.getUser.role === 'admin'
        ? 'Nu a fost adaugat nici un test. Apasa pe butonul de mai sus pentru a adauga test.'
        : 'Momentan nici un test nu este activ. Incearca mai tarziu.';
    }
  },
  methods: {
    getHeaders() {
      let headers = [
        { text: 'Data', value: 'date' },
        { text: 'Materia', value: 'subject' },
        { text: 'Descriere', value: 'description', sortable: false },
        { text: 'Activ', value: 'active', sortable: false },
        { text: 'Actiuni', value: 'actions', sortable: false }
      ];

      if (this.$store.getters.getUser.role !== 'admin') {
        headers.splice(4, 0, {
          text: 'Progres',
          value: 'progress',
          sortable: true
        });
      }

      return headers;
    },
    formatDate(date) {
      return date
        .toDate()
        .toISOString()
        .replace(/T.*/g, '');
    },
    deleteItem(test) {
      if (confirm('Esti sigur ca doresti sa stergi acest test?')) {
        this.$store.dispatch('deleteTest', test);
      }
    },
    editItem(test) {
      router.push(`test/${test.id}`);
    },
    showTestResults(test) {
      router.push(`results/${test.id}`);
    },
    addTest() {
      router.push('test');
    },
    takeTest(test) {
      router.push(`taketest/${test.id}`);
    }
  }
};
</script>

<style scoped>
.subject-text {
  background-color: rgba(255, 255, 255, 1);
  color: black;
  opacity: 0.5;
}
</style>
