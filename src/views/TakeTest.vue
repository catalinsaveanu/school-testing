<template>
<v-flex xs12 fill-height>
  <v-card
      class="mx-auto fill-height"
      max-width="1200"
    >
    <v-layout justify-space-between column fill-height>
      <v-btn color="primary" fab small dark>
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-window
        class="fill-height"
        v-model="currentProblem">
        <v-window-item
          v-for="(problem, index) in problems"
          :key="index"
        >
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ problem.question }}</span>
          </v-card-title>

          <v-layout row wrap>
            <v-flex
              class="xs6"
              v-for="(value, index2) in DEFAULT_ANSWERS"
              :key="`answer-${index2}`">
              <v-card dark color="secondary">
                <v-card-text class="px-0">{{value}}) {{problem[`answer${value}`]}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-window-item>
      </v-window>

      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          fab
          small
          dark
          @click="prev"
        >
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <div class="current-problem-position">
          {{currentProblem + 1}} din {{problems.length}}
        </div>
        <v-btn color="primary"
          fab
          small
          dark
          @click="next">
          <v-icon dark>chevron_right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-layout>
  </v-card>
</v-flex>
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
      currentProblem: 0,
      DEFAULT_ANSWERS: ['A', 'B', 'C', 'D']
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
      this.currentProblem = this.currentProblem + 1;
      if (this.currentProblem > this.problems.length - 1) {
        this.currentProblem = this.problems.length - 1;
      }
    },
    prev() {
      this.currentProblem = this.currentProblem - 1;
      if (this.currentProblem < 0) {
        this.currentProblem = 0;
      }
    }
  }
};
</script>

<style scoped>
.current-problem-position {
  padding: 0 10px;
}
.v-card__actions {
  background: #fff8e1;
}
</style>
