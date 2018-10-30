<template>
  <v-flex>
    <v-card>
      <v-card-title>
        Lista teste
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="tests" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.date }}</td>
          <td class="text-xs-right">{{ props.item.subject }}</td>
          <td class="text-xs-right">{{ props.item.description }}</td>
          <td class="text-xs-right">{{ props.item.active }}</td>
          <td class="text-xs-right"></td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <v-card-actions class="login-btns-container">
        <v-btn color="primary" @click="logout">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  name: 'UserDashboard',
  mounted() {
    if (!this.$store.getters.getUser.name) {
      const { currentUser } = firebase.auth(),
        db = firebase.firestore();

      db.collection('users').doc(currentUser.uid).get().then((doc) => {
        this.$store.dispatch('setUser', doc.data());
      });
    }

    this.$store.dispatch('getTests');
  },
  data() {
    return {
      text: '',
      search: '',
      headers: [
        { text: 'Data', value: 'date' },
        { text: 'Materia', value: 'subject' },
        { text: 'Descriere', value: 'description', sortable: false },
        { text: 'Activ', value: 'active', sortable: false },
        { text: 'Actiuni', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUser;
    },
    tests() {
      return this.$store.getters.getTests;
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
