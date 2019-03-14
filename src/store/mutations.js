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
    state.tests = [
      ...state.tests.filter((element) => element.id !== test.id),
      test
    ];
  },
  setResultToTest(state, test) {
    state.resultToTest = { ...test };
  },
  setUsersTestResults(state, tests) {
    state.usersTestResults = [...tests];
  },
  setAlert(state, alert) {
    state.alert = alert;
  },
  updateToolbarVisibility(state, visibility) {
    state.showToolbar = visibility;
  }
};
