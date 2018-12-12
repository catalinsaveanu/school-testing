<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Conectare</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip right></v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            append-icon="person"
            name="email"
            label="E-mail"
            autocomplete="username"
            required
            type="text"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :error-messages="passwordErrors"
            append-icon="lock"
            name="password"
            label="Parola"
            autocomplete="current-password"
            required
            type="password"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="login-btns-container">
        <p>Nu ai un cont? Poti sa-ti
          <router-link to="/sign-up">creezi unul</router-link>
        </p>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submit" round>Conectare</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      submitStatus: null
    };
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  computed: {
    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) {
        return errors;
      }

      if (!this.$v.email.email) {
        errors.push('Adresa de e-mail nu este valida.');
      }

      if (!this.$v.email.required) {
        errors.push('Acest camp este obligatoriu.');
      }

      return errors;
    },
    passwordErrors() {
      const errors = [];

      if (!this.$v.password.$dirty) {
        return errors;
      }

      if (!this.$v.password.required) {
        errors.push('Acest camp este obligatoriu.');
      }

      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        // do your submit logic here
        this.submitStatus = 'PENDING';

        this.$store
          .dispatch('login', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$router.replace('dashboard');
          });
      }
    }
  }
};
</script>

<style scoped>
.v-card__actions.login-btns-container {
  padding: 0 16px 16px;
}
.login-btns-container .spacer {
  margin: 0 10px;
}
.v-text-field__details {
  padding-bottom: 5px;
}
</style>
