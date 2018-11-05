<template>
<v-flex>
  <v-text-field
    v-model="question"
    :label="`Intrebarea ${problemNumber}`"
    required
  >
  </v-text-field>
  <v-radio-group v-model="correctAnswer">
    <v-radio
      v-for="n in 4"
      :key="n"
      :label="` ${n}`"
      :value="n"
    >
    </v-radio>
  </v-radio-group>
</v-flex>
</template>
<script>
export default {
  props: ['problemNumber'],
  data() {
    return {
      question: '',
      answers: [],
      correctAnswer: 0
    };
  }
};
</script>
<style scoped>

</style>
