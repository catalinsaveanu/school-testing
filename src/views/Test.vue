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
              <v-text-field slot="activator" v-model="date" label="Data testului" readonly></v-text-field>
              <v-date-picker
                v-model="date"
                first-day-of-week="1"
                @input="menu1 = false"
                locale="ro-ro"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-select v-model="subject" :items="subjects" label="Materia" required></v-select>
          <v-text-field v-model="description" label="Titlu" required></v-text-field>
          <v-switch
            color="pink"
            :label="`Stare test: ${active ? 'activ' : 'inactiv'}`"
            v-model="active"
          ></v-switch>
        </v-flex>
        <v-toolbar flat color="white">
          <v-toolbar-title>Probleme</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <v-btn color="pink" slot="activator" class="mb-2" round dark>Adauga Problema
              <v-icon dark right>add_circle</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-textarea outline label="Intrebare" required v-model="editedItem.question"></v-textarea>
                    </v-flex>
                    <v-radio-group v-model="editedItem.correctAnswer" row required>
                      <v-flex class="radio-cell xs12 sm6 md6">
                        <v-layout align-center>
                          <v-radio value="0" color="teal"></v-radio>
                          <v-text-field v-model="editedItem.answerA" label="(A)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6">
                        <v-layout align-center>
                          <v-radio value="1" color="teal"></v-radio>
                          <v-text-field v-model="editedItem.answerB" label="(B)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6">
                        <v-layout align-center>
                          <v-radio value="2" color="teal"></v-radio>
                          <v-text-field v-model="editedItem.answerC" label="(C)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6">
                        <v-layout align-center>
                          <v-radio value="3" color="teal"></v-radio>
                          <v-text-field v-model="editedItem.answerD" label="(D)"></v-text-field>
                        </v-layout>
                      </v-flex>
                    </v-radio-group>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" flat round @click.native="close">Cancel</v-btn>
                <v-btn color="success" flat round @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-data-table :headers="headers" :items="problems" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.position }}.</td>
            <td>{{ props.item.question }}</td>
            <td>{{ props.item.answerA }}</td>
            <td>{{ props.item.answerB }}</td>
            <td>{{ props.item.answerC }}</td>
            <td>{{ props.item.answerD }}</td>
            <td class="text-xs-center">{{ props.item.correctAnswer }}</td>
            <td class="justify-center layout align-center">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template
            slot="no-data"
          >Nu a fost adaugata nici o problema. Apasa pe butonul de mai sus pentru a adauga o problema.</template>
        </v-data-table>
        <v-spacer column></v-spacer>
        <v-flex>
          <v-btn color="error" @click="cancel" round>Renunta
            <v-icon dark right>remove_circle</v-icon>
          </v-btn>
          <v-btn color="success" @click="submit" round>
            {{submitTextBtn}}
            <v-icon dark right>check_circle</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </form>
  </v-layout>
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
    if (this.testId) {
      // eslint-disable-next-line
      const currentTest = this.$store.getters.getTests.find(
        (test) => test.id === this.testId
        // eslint-disable-next-line
      );

      this.date = this.formatDate(currentTest.date);
      this.subject = currentTest.subject;
      this.description = currentTest.description;
      this.active = currentTest.active;
      this.problems = currentTest.problems;
      this.submitTextBtn = 'Modifica';
    }
  },
  data() {
    return {
      menu1: false,
      testId: this.$route.params.id,
      date: new Date().toISOString().substr(0, 10),
      subject: 'romana',
      subjects: ['romana', 'matematica'],
      description: '',
      active: true,
      submitStatus: null,
      problems: [],
      dialog: false,
      submitTextBtn: 'Adauga',
      headers: [
        {
          text: 'Numar',
          align: 'left',
          sortable: true,
          value: 'position'
        },
        { text: 'Intrebarea', value: 'question', sortable: false },
        { text: '(A)', value: 'answerA', sortable: false },
        { text: '(B)', value: 'answerB', sortable: false },
        { text: '(C)', value: 'answerC', sortable: false },
        { text: '(D)', value: 'answerD', sortable: false },
        {
          text: 'Raspuns',
          value: 'correctAnswer',
          sortable: false,
          align: 'center'
        },
        { text: 'Actiuni', sortable: false, align: 'center' }
      ],
      editedIndex: -1,
      editedItem: {
        position: 0,
        question: '',
        answerA: '',
        answerB: '',
        answerC: '',
        answerD: '',
        correctAnswer: 0
      },
      defaultItem: {
        position: 0,
        question: '',
        answerA: '',
        answerB: '',
        answerC: '',
        answerD: '',
        correctAnswer: 0
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Adauga Problema' : 'Modifica Problema';
    }
  },
  watch: {
    dialog(val) {
      return val || this.close();
    }
  },
  methods: {
    formatDate(date) {
      return date
        .toDate()
        .toISOString()
        .replace(/T.*/g, '');
    },
    editItem(item) {
      this.editedIndex = this.problems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.problems.indexOf(item);

      if (confirm('Esti sigur ca vrei sa stergi aceasta problema?')) {
        this.problems.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.problems[this.editedIndex], this.editedItem);
      } else {
        this.problems.push({
          ...this.editedItem,
          position: this.problems.length + 1
        });
      }

      this.close();
    },

    cancel() {
      router.go(-1);
    },

    submit() {
      const problems = [...this.problems],
        test = {
          active: this.active,
          date: firebase.firestore.Timestamp.fromDate(new Date(this.date)),
          deleted: false,
          description: this.description,
          subject: this.subject,
          problems
        };

      if (this.testId) {
        test.id = this.testId;
      }

      this.$store
        .dispatch('saveTest', test)
        .then(() => {
          return this.$store.dispatch('loadTests');
        })
        .then(() => {
          this.$router.go(-1);
        });
    }
  }
};
</script>

<style scoped>
form {
  height: 100%;
  width: 100%;
}
.separator {
  border-top: 1px dashed gray;
  position: relative;
}
.v-dialog .v-radio {
  margin-right: 0;
}

.container.grid-list-md .layout .flex.radio-cell:nth-child(2n) {
  padding-left: 10px;
}

.container.grid-list-md .layout .flex.radio-cell:nth-child(2n + 1) {
  padding-right: 10px;
}
</style>
