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
            required
          ></v-select>
          <v-text-field
            v-model="description"
            label="Descriere"
            required
          ></v-text-field>
          <v-checkbox
            v-model="active"
            label="Activ"
          ></v-checkbox>
        </v-flex>
        <v-toolbar flat color="white">
          <v-toolbar-title>Probleme</v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <v-btn fab dark color="indigo" slot="activator" class="mb-2">
              <v-icon dark>add</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field label="Intrebare*" required v-model="editedItem.question"></v-text-field>
                    </v-flex>
                    <v-radio-group v-model="editedItem.correctAnswer" row required >
                      <v-flex class="radio-cell xs12 sm6 md6 ">
                        <v-layout align-center>
                          <v-radio value="0"></v-radio>
                          <v-text-field v-model="editedItem.answerA" label="(A)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6 ">
                        <v-layout align-center>
                          <v-radio value="1"></v-radio>
                          <v-text-field v-model="editedItem.answerB" label="(B)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6 ">
                        <v-layout align-center>
                          <v-radio value="2"></v-radio>
                          <v-text-field v-model="editedItem.answerC" label="(C)"></v-text-field>
                        </v-layout>
                      </v-flex>
                      <v-flex class="radio-cell xs12 sm6 md6 ">
                        <v-layout align-center>
                          <v-radio value="3"></v-radio>
                          <v-text-field v-model="editedItem.answerD" label="(D)"></v-text-field>
                        </v-layout>
                      </v-flex>
                    </v-radio-group>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="problems"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.position }}.</td>
            <td>{{ props.item.question }}</td>
            <td>{{ props.item.answerA }}</td>
            <td>{{ props.item.answerB }}</td>
            <td>{{ props.item.answerC }}</td>
            <td>{{ props.item.answerD }}</td>
            <td class="text-xs-center">{{ props.item.correctAnswer }}</td>
            <td class="justify-center layout align-center">
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
          </template>
          <template slot="no-data">
            Nu a fost adaugata nici o problema. Apasa pe butonul de mai sus pentru a adauga o problema.
          </template>
        </v-data-table>
        <v-spacer column></v-spacer>
        <v-flex>
          <v-btn color="error" @click="cancel">Renunta</v-btn>
          <v-btn color="success" @click="submit">Adauga</v-btn>
        </v-flex>
      </v-layout>
    </form>
  </v-layout>
</template>

<script>
import 'firebase/firestore';
import confirm from 'vuetify';

import router from './../router/';

export default {
  name: 'UserDashboard',
  components: {},
  mounted() {},
  data() {
    return {
      menu1: false,
      date: new Date().toISOString().substr(0, 10),
      subject: 'romana',
      subjects: ['romana', 'matematica'],
      description: '',
      active: true,
      submitStatus: null,
      problems: [],
      dialog: false,
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
      // eslint-disable-next-line
      const problems = this.problems.map((problem) => {
          return {
            correct_answer: problem.correctAnswer,
            question: problem.question,
            answers: [
              problem.answerA,
              problem.answerB,
              problem.answerC,
              problem.answerD
            ]
          };
        }),
        test = {
          active: this.active,
          date: this.date,
          deleted: false,
          description: this.description,
          subject: this.subject,
          problems
        };

      this.$store.dispatch('saveTest', test).then(() => {
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
