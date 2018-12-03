<template>
  <v-flex xs12 fill-height class="page-container">
    <v-card class="mx-auto fill-height" max-width="1200">
      <v-layout justify-space-between column fill-height>
        <v-btn color="primary" fab small dark @click="goBack">
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-window
          class="fill-height align-center d-flex question-container"
          v-model="currentProblem"
        >
          <v-window-item v-for="(problem, index) in problems" :key="index">
            <v-card-title class="title font-weight-regular justify-space-between">
              <span class="question-title">{{ problem.question }}</span>
            </v-card-title>

            <v-layout row wrap>
              <v-flex
                class="xs12 md6 px-1"
                v-for="(value, index2) in DEFAULT_ANSWERS"
                :key="`answer-${index2}`"
              >
                <v-btn
                  block
                  large
                  class="answer-button"
                  :color="answerColor(index2)"
                  bold
                  round
                  @click="answerClicked(index2)"
                >
                  <span class="answer-button__letter">{{value}}</span>
                  {{problem[`answer${value}`]}}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-window-item>
        </v-window>

        <v-card-actions class="justify-center">
          <v-btn color="primary" fab small dark :disabled="currentProblem === 0" @click="prev">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <div class="current-problem-position">{{currentProblem + 1}} din {{problems.length}}</div>
          <v-btn
            color="primary"
            fab
            small
            dark
            :disabled="currentProblem === problems.length - 1"
            @click="next"
          >
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
    const testId = this.$route.params.id,
      userId = this.$store.getters.getUser.id,
      problems = this.$store.getters.getTest(testId).problems,
      correctAnswers = this.getCorrectAnswers(problems),
      sendData = {
        userId,
        testId,
        correctAnswers
      };

    this.$store.dispatch('getResultToTest', sendData);
  },
  data() {
    return {
      currentProblem: 0,
      DEFAULT_ANSWERS: ['A', 'B', 'C', 'D'],
      userAnswers: []
    };
  },
  computed: {
    resultToTest() {
      return this.$store.state.resultToTest;
    },
    currentTest() {
      return this.$store.getters.getTest(this.$route.params.id);
    },
    problems() {
      return this.currentTest.problems || [];
    }
  },
  methods: {
    getCorrectAnswers(problems = []) {
      let answers = [];

      problems.forEach((problem) => {
        answers.push(problem.correctAnswer);
      });

      return answers;
    },
    next() {
      this.currentProblem = this.currentProblem + 1;
      if (this.currentProblem > this.problems.length - 1) {
        this.currentProblem = this.problems.length - 1;
      }
      this.userAnswers = -1;
    },
    prev() {
      this.currentProblem = this.currentProblem - 1;
      if (this.currentProblem < 0) {
        this.currentProblem = 0;
      }
      this.userAnswers = -1;
    },
    goBack() {
      router.go(-1);
    },
    answerClicked(answer) {
      let answers = this.resultToTest.answers,
        initialAnswers = this.resultToTest.initialAnswers;

      if (initialAnswers[this.currentProblem] === -1) {
        initialAnswers[this.currentProblem] = answer;
      }

      answers[this.currentProblem] = answer;

      const sendData = {
        ...this.resultToTest,
        answers,
        initialAnswers
      };

      this.$store.dispatch('setResultToTest', sendData);
    },
    answerColor(answer) {
      if (Object.keys(this.resultToTest).length === 0) {
        return 'primary';
      }

      const currentAnswer = this.resultToTest.answers[this.currentProblem];

      if (currentAnswer === answer) {
        return currentAnswer ===
          this.currentTest.problems[this.currentProblem].correctAnswer
          ? 'success'
          : 'error';
      } else {
        return 'primary';
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
  background: #e2e6d8;
}
.theme--light.v-card {
  background: #fcfff5;
}
.answer-button {
  font-weight: bold;
}
.answer-button--wrong {
  background: #dc3522;
}
.answer-button--correct {
  background: #468966;
}
.answer-button__letter {
  background: #2b4550;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  line-height: 30px;
  left: -20px;
  position: absolute;
}
.question-container {
  padding: 50px;
}
.question-title {
  font-size: 27px;
}
</style>
