export default {
  getUser(state) {
    return state.user;
  },
  getTests(state) {
    console.log('state:', state);
    return state.tests;
  },
  getAlert(state) {
    return state.alert;
  }
};
