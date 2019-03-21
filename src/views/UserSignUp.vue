<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Inregistrare</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip right></v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            append-icon="person"
            name="name"
            label="Nume si Prenume"
            autocomplete="name"
            required
            type="text"
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
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
            autocomplete="new-password"
            required
            type="password"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="repeatPassword"
            :error-messages="repeatPasswordErrors"
            append-icon="lock"
            name="repeatpassword"
            label="Re-Parola"
            autocomplete="new-password"
            required
            type="password"
            @input="$v.repeatPassword.$touch()"
            @blur="$v.repeatPassword.$touch()"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="login-btns-container">
        <p>Ai un cont deja? Te poti conecta
          <router-link to="/login">aici</router-link>
        </p>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submit" round>Inregistreaza-te</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { required, sameAs, email, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'UserSignUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      submitStatus: null
    };
  },
  validations: {
    email: { required, email },
    name: { required },
    password: { required, minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') }
  },
  computed: {
    nameErrors() {
      const errors = [];

      if (!this.$v.name.$dirty) {
        return errors;
      }

      if (!this.$v.name.required) {
        errors.push('Acest camp este obligatoriu.');
      }

      return errors;
    },
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

      if (!this.$v.password.minLength) {
        const errorMsg = `Parola trebuie sa contina mininim ${
          this.$v.password.$params.minLength.min
        } caractere.`;

        errors.push(errorMsg);
      }

      return errors;
    },
    repeatPasswordErrors() {
      const errors = [];

      if (!this.$v.repeatPassword.$dirty) {
        return errors;
      }

      if (!this.$v.repeatPassword.sameAsPassword) {
        errors.push('Campurile cu parole trebuie sa fie identice.');
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
          .dispatch('signup', {
            email: this.email,
            password: this.password,
            name: this.name,
            role: 'student'
          })
          .then(() => {
            this.$router.replace('/dashboard');
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
