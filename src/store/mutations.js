export default {
  setUser(state, user) {
    state.user = user;
  },
  setTests(state, tests) {
    state.tests = [...tests];
  },
  updateTest(state, test) {
    state.tests = [
      ...state.tests.filter(element => element.id !== test.id),
      test
    ];
  },
  setAlert(state, alert) {
    state.alert = alert;
  }
};
