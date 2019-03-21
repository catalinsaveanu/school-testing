export default {
  setUser(state, user) {
    state.user = user;
  },
  setTests(state, tests) {
    state.tests = [...tests];
  },
  deleteTest(state, test) {
    state.tests = [...state.tests.filter((element) => element.id !== test.id)];
  },
  updateTest(state, test) {
    state.tests = state.tests.map((element) => {
      if (element.id === test.id) {
        return Object.assign({}, element, test);
      } else {
        return element;
      }
    });
  },
  setResultToTest(state, test) {
    state.resultToTest = { ...test };
  },
  setUsersTestResults(state, tests) {
    state.usersTestResults = [...tests];
  },
  setAlert(state, alert) {
    state.alert = alert;
  }
};
