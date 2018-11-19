<template>
  <v-card
      class="mx-auto"
      max-width="1200"
    >
    <v-window v-model="currentTest">
      <v-window-item
        v-for="(problem, index) in problems"
        :key="`card-${index}`"
      >

        <v-card-title class="title font-weight-regular justify-space-between">
          <span>{{ problem.question }}</span>
          <v-avatar
            color="primary lighten-2"
            class="subheading white--text"
            size="24"
            v-text="index"
          ></v-avatar>
        </v-card-title>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn
        flat
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-item-group
        v-model="currentProblem"
        class="text-xs-center"
        mandatory
      >
        <v-item
          v-for="n in problems.length"
          :key="`btn-${n}`"
        >
          <v-btn
            slot-scope="{ active, toggle }"
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>mdi-record</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn
        flat
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import 'firebase/firestore';
import firebase from 'firebase/app';
import confirm from 'vuetify';

import router from './../router/';

export default {
  name: 'UserDashboard',
  components: {},
  mounted() {
    if (!this.$store.getters.getUser.name) {
      const { currentUser } = firebase.auth(),
        db = firebase.firestore();

      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          this.$store.dispatch('setUser', doc.data());
          this.$store.dispatch('loadTests');
        });
    }
  },
  data() {
    return {
      currentProblem: 0
    };
  },
  computed: {
    currentTest() {
      return this.$store.getters.getTest(this.$route.params.id);
    },
    problems() {
      return this.currentTest.problems || [];
    }
  },
  methods: {
    next() {
      this.currentProblem =
        this.currentProblem + 1 === length ? 0 : this.currentProblem + 1;
    },
    prev() {
      this.currentProblem =
        this.currentProblem - 1 < 0 ? this.length - 1 : this.currentProblem - 1;
    }
  }
};
</script>

<style scoped>
</style>
