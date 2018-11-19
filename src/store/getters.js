export default {
  getUser(state) {
    return state.user;
  },
  getTests(state) {
    return state.tests;
  },
  getTest: (state) => (testId) => {
    return state.tests.find((test) => test.id === testId) || {};
  },
  getAlert(state) {
    return state.alert;
  }
};
