<template>
  <v-layout justify-start fill-height>
    <form>
      <v-layout fill-height column>
        <v-flex fluid>
          <v-flex xs12 lg6>
              <v-menu
                  ref="menu1"
                  :close-on-content-click="false"
                  v-model="menu1"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
              >
                  <v-text-field
                    slot="activator"
                    v-model="date"
                    label="Data testului"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" first-day-of-week="1" @input="menu1 = false" locale="ro-ro"></v-date-picker>
              </v-menu>
          </v-flex>
          <v-select
            v-model="subject"
            :items="subjects"
            label="Materia"
            data-vv-name="subject"
            required
          ></v-select>
          <v-text-field
            v-model="description"
            label="Descriere"
            data-vv-name="description"
            required
          ></v-text-field>
          <v-checkbox
            v-model="active"
            value="true"
            label="Activ"
            data-vv-name="active"
            type="active"
          ></v-checkbox>
        </v-flex>
        <div class="separator">
            <v-btn
              absolute
              dark
              fab
              top
              right
              color="pink"
            >
              <v-icon>add</v-icon>
            </v-btn>
        </div>
        <v-spacer column></v-spacer>
        <v-flex>
          <v-btn color="error" @click="submit">Renunta</v-btn>
          <v-btn color="success" @click="submit">Adauga</v-btn>
        </v-flex>
      </v-layout>
    </form>
  </v-layout>
</template>

<script>
import 'firebase/firestore';

export default {
  name: 'UserDashboard',
  mounted() {
  },
  data() {
    return {
      menu1: false,
      date: new Date().toISOString().substr(0, 10),
      subject: 'romana',
      subjects: ['romana', 'matematica'],
      description: '',
      active: false,
      submitStatus: null
    };
  },
  computed: {
  },
  methods: {
    submit() {
    }
  }
};
</script>

<style scoped>
  form {height: 100%; width: 100%}
  .separator {border-top: 1px dashed gray; position: relative}
</style>
