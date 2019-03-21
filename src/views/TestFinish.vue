<template>
  <v-flex md6>
    <v-card>
      <v-img :src="images.award"></v-img>
      <v-card-title primary-title>
        <h3 class="headline">Felicitari! Ai obtinut:</h3>
        <v-progress-circular
          class="ml-2"
          :size="60"
          :width="8"
          :value="this.$store.state.resultToTest.grade"
          :rotate="-90"
          color="brown"
        >{{ this.$store.state.resultToTest.grade }}</v-progress-circular>
        <h3 class="headline ml-2">de puncte.</h3>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" round dark small color="success" @click="backToTests">
          Inapoi la teste
          <v-icon dark right>input</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import 'firebase/firestore';
import firebase from 'firebase/app';
import confirm from 'vuetify';

import router from './../router/';

export default {
  name: 'TestFinish',
  components: {},
  mounted() {},
  data() {
    return {
      images: {
        award: require('./../assets/award.jpg')
      }
    };
  },
  computed: {},
  methods: {
    backToTests() {
      router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
</style>
