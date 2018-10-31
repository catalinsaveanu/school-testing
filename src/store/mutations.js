export default {
  setUser(state, user) {
    state.user = user;
  },
  setTests(state, tests) {
    state.tests = [...tests];
  },
  setAlert(state, alert) {
    state.alert = alert;
  }
};
