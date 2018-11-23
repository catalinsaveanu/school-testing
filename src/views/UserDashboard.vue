<template>
  <v-flex>
    <v-card>
      <v-card-title v-if="user.role === 'admin'">
        <v-btn color="success" @click="addTest()">Adauga test</v-btn>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-card-title v-else>
        Lista de teste
      </v-card-title>
      <v-data-table :headers="headers" :items="tests" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ formatDate(props.item.date) }}</td>
          <td class="text-xs-left">{{ props.item.subject }}</td>
          <td class="text-xs-left">{{ props.item.description }}</td>
          <td class="text-xs-left">{{ props.item.active }}</td>
          <td class="text-xs-left" v-if="user.role === 'admin'">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
          <td class="text-xs-lef" v-else>
            <v-icon
              small
              class="mr-2"
              @click="takeTest(props.item)"
            >
              assignment
            </v-icon>
          </td>
        </template>
        <template slot="no-data">
          Nu a fost adaugat nici un test. Apasa pe butonul de mai sus pentru a adauga test.
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <v-card-actions class="login-btns-container">
        <v-btn color="primary" @click="logout">Deconectare</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import router from './../router/';

export default {
  name: 'UserDashboard',
  mounted() {
    if (!this.$store.getters.getUser.name) {
      const { currentUser } = firebase.auth(),
        db = firebase.firestore();

      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          this.$store.dispatch('setUser', {
            id: currentUser.uid,
            ...doc.data()
          });
        });
    }

    this.$store.dispatch('loadTests');
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
    user() {
      return this.$store.getters.getUser;
    },
    tests() {
      // eslint-disable-next-line
      return this.$store.getters.getTests.filter((test) => {
        return !test.deleted && (this.user.role === 'admin' || test.active);
      });
    }
  },
  methods: {
    formatDate(date) {
      return date
        .toDate()
        .toISOString()
        .replace(/T.*/g, '');
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('login');
        });
    },
    deleteItem(test) {
      if (confirm('Esti sigur ca doresti sa stergi acest test?')) {
        this.$store.dispatch('deleteTest', test);
      }
    },
    editItem(test) {
      router.push(`test/${test.id}`);
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
</style>
